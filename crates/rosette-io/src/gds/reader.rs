//! GDS II binary format reader.
//!
//! Parses GDS II Stream files into rosette [`Library`] objects.

use std::fs;
use std::io::{Cursor, Read};
use std::path::Path;

use byteorder::{BigEndian, ReadBytesExt};

use rosette_core::cell::{CellRef, PathEndType, Repetition};
use rosette_core::geometry::Vector2;
use rosette_core::{
    Cell, CellRefError, CellRefValidationReason, CellValidationError, Layer, Library, LibraryError,
    PathValidationReason, Point, Polygon, PolygonValidationReason, RepetitionValidationReason,
    TextValidationReason, Transform,
};

use super::constants::*;
use super::error::{GdsElementError, GdsError, GdsTransformError};

/// Read a GDS file from disk into a [`Library`].
///
/// # Example
///
/// ```no_run
/// use rosette_io::gds;
///
/// let lib = gds::read("input.gds").unwrap();
/// println!("Library: {}", lib.name());
/// for cell in lib.cells() {
///     println!("  Cell: {}", cell.name());
/// }
/// ```
pub fn read(path: impl AsRef<Path>) -> Result<Library, GdsError> {
    let data = fs::read(path)?;
    read_bytes(&data)
}

/// Read a GDS from raw bytes into a [`Library`].
pub fn read_bytes(data: &[u8]) -> Result<Library, GdsError> {
    let mut reader = GdsReader::new(data);
    reader.read_library()
}

/// A raw GDS record as read from the file.
struct Record {
    record_type: u8,
    data: Vec<u8>,
}

/// State machine for reading GDS files.
struct GdsReader<'a> {
    cursor: Cursor<&'a [u8]>,
    /// Database unit in meters, read from UNITS record.
    db_unit_m: f64,
}

impl<'a> GdsReader<'a> {
    fn new(data: &'a [u8]) -> Self {
        Self {
            cursor: Cursor::new(data),
            db_unit_m: 1e-9, // default: 1 nm
        }
    }

    /// Current byte offset in the stream (for error messages).
    fn offset(&self) -> usize {
        self.cursor.position() as usize
    }

    /// Read the next record from the stream. Returns None at EOF.
    fn read_record(&mut self) -> Result<Option<Record>, GdsError> {
        let offset = self.offset();
        let remaining = self.cursor.get_ref().len().saturating_sub(offset);
        if remaining == 0 {
            return Ok(None);
        }
        if remaining < 2 {
            return Err(GdsError::UnexpectedEof);
        }

        let len = self.cursor.read_u16::<BigEndian>()?;

        if len < 4 {
            return Err(GdsError::InvalidRecord {
                offset,
                message: format!("record length {} is less than minimum 4", len),
            });
        }
        if !len.is_multiple_of(2) {
            return Err(GdsError::InvalidRecord {
                offset,
                message: format!("record length {len} is not even"),
            });
        }

        let record_type = self.cursor.read_u8()?;
        let data_type = self.cursor.read_u8()?;

        let data_len = (len - 4) as usize;
        if let Some(expected) = expected_data_type(record_type)
            && data_type != expected
        {
            return Err(GdsError::InvalidRecord {
                offset,
                message: format!(
                    "record 0x{record_type:02X} has data type 0x{data_type:02X}, expected 0x{expected:02X}"
                ),
            });
        }
        if data_type == NO_DATA && data_len != 0 {
            return Err(GdsError::InvalidRecord {
                offset,
                message: format!("NO_DATA record has {data_len} payload bytes"),
            });
        }
        if let Some(expected_len) = fixed_data_len(record_type)
            && data_len != expected_len
        {
            return Err(GdsError::InvalidRecord {
                offset,
                message: format!(
                    "record 0x{record_type:02X} has {data_len} data bytes, expected {expected_len}"
                ),
            });
        }

        let mut data = vec![0u8; data_len];
        self.cursor
            .read_exact(&mut data)
            .map_err(|_| GdsError::UnexpectedEof)?;

        Ok(Some(Record { record_type, data }))
    }

    /// Read the next record, returning an error if EOF.
    fn expect_record(&mut self) -> Result<Record, GdsError> {
        self.read_record()?.ok_or(GdsError::UnexpectedEof)
    }

    /// Read a record within an element without crossing its ENDEL boundary.
    fn expect_element_record(&mut self) -> Result<Record, GdsError> {
        let rec = self.expect_record()?;
        let message = match rec.record_type {
            BOUNDARY | PATH | SREF | AREF | TEXT | NODE | BOX => Some(format!(
                "nested element start 0x{:02X} encountered before ENDEL",
                rec.record_type
            )),
            HEADER | BGNLIB | LIBNAME | UNITS | ENDLIB | BGNSTR | STRNAME | ENDSTR => Some(
                format!("record 0x{:02X} encountered before ENDEL", rec.record_type),
            ),
            _ => None,
        };
        if let Some(message) = message {
            return Err(GdsError::InvalidRecord {
                offset: self.offset(),
                message,
            });
        }
        Ok(rec)
    }

    fn reject_known_record(&self, rec: &Record, context: &str) -> Result<(), GdsError> {
        if expected_data_type(rec.record_type).is_some() {
            return Err(GdsError::InvalidRecord {
                offset: self.offset(),
                message: format!("record 0x{:02X} is not valid {context}", rec.record_type),
            });
        }
        Ok(())
    }

    /// Read the full library.
    fn read_library(&mut self) -> Result<Library, GdsError> {
        // HEADER
        let rec = self.expect_record()?;
        if rec.record_type != HEADER {
            return Err(GdsError::InvalidRecord {
                offset: 0,
                message: format!("expected HEADER, got 0x{:02X}", rec.record_type),
            });
        }
        // Version check (informational, we accept any)
        let _version = u16::from_be_bytes([rec.data[0], rec.data[1]]);

        // BGNLIB
        let rec = self.expect_record()?;
        if rec.record_type != BGNLIB {
            return Err(GdsError::InvalidRecord {
                offset: self.offset(),
                message: format!("expected BGNLIB, got 0x{:02X}", rec.record_type),
            });
        }

        // LIBNAME
        let rec = self.expect_record()?;
        if rec.record_type != LIBNAME {
            return Err(GdsError::InvalidRecord {
                offset: self.offset(),
                message: format!("expected LIBNAME, got 0x{:02X}", rec.record_type),
            });
        }
        let lib_name = parse_string(&rec.data);

        // UNITS
        let rec = self.expect_record()?;
        if rec.record_type != UNITS {
            return Err(GdsError::InvalidRecord {
                offset: self.offset(),
                message: format!("expected UNITS, got 0x{:02X}", rec.record_type),
            });
        }
        if rec.data.len() != 16 {
            return Err(GdsError::InvalidRecord {
                offset: self.offset(),
                message: format!(
                    "UNITS record has {} data bytes, expected 16",
                    rec.data.len()
                ),
            });
        }
        let db_unit_in_user_units = gds_real_to_f64(&rec.data[0..8]);
        let db_unit_in_meters = gds_real_to_f64(&rec.data[8..16]);
        if !db_unit_in_user_units.is_finite()
            || db_unit_in_user_units <= 0.0
            || !db_unit_in_meters.is_finite()
            || db_unit_in_meters <= 0.0
        {
            return Err(GdsError::InvalidUnits {
                reason: "database and user units must be finite and positive",
            });
        }
        self.db_unit_m = db_unit_in_meters;

        let mut library = Library::new(lib_name);

        // Read cells until ENDLIB
        loop {
            let rec = self.expect_record()?;
            match rec.record_type {
                BGNSTR => {
                    let cell = self.read_cell()?;
                    // Core identities are format-neutral, so representable
                    // third-party names are retained even when Rosette would
                    // not emit them as GDS.
                    library.add_cell(cell)?;
                }
                ENDLIB => break,
                _ => self.reject_known_record(&rec, "at library scope")?,
            }
        }

        library.validate()?;
        Ok(library)
    }

    /// Read a cell (after BGNSTR has been consumed).
    fn read_cell(&mut self) -> Result<Cell, GdsError> {
        // STRNAME
        let rec = self.expect_record()?;
        if rec.record_type != STRNAME {
            return Err(GdsError::InvalidRecord {
                offset: self.offset(),
                message: format!("expected STRNAME, got 0x{:02X}", rec.record_type),
            });
        }
        let cell_name = parse_string(&rec.data);
        let mut cell = Cell::new(cell_name.clone()).map_err(|source| {
            GdsError::InvalidLibrary(LibraryError::InvalidCell {
                name: cell_name,
                source,
            })
        })?;

        // Read elements until ENDSTR
        loop {
            let rec = self.expect_record()?;
            match rec.record_type {
                BOUNDARY => self.read_boundary(&mut cell)?,
                PATH => self.read_path(&mut cell)?,
                SREF => self.read_sref(&mut cell)?,
                AREF => self.read_aref(&mut cell)?,
                TEXT => self.read_text(&mut cell)?,
                ENDSTR => break,
                // Skip unsupported element types gracefully
                NODE | BOX => self.skip_element()?,
                _ => self.reject_known_record(&rec, "between structure elements")?,
            }
        }

        Ok(cell)
    }

    /// Skip records until ENDEL (for unsupported element types).
    fn skip_element(&mut self) -> Result<(), GdsError> {
        loop {
            let rec = self.expect_element_record()?;
            if rec.record_type == ENDEL {
                break;
            }
        }
        Ok(())
    }

    /// Read a BOUNDARY (polygon) element.
    fn read_boundary(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let element_index = cell.elements().len();
        let mut layer = None;
        let mut datatype = None;
        let mut xy_data = None;

        loop {
            let rec = self.expect_element_record()?;
            match rec.record_type {
                LAYER => layer = Some(parse_int16_record(&rec.data, self.offset(), "LAYER")?),
                DATATYPE => {
                    datatype = Some(parse_int16_record(&rec.data, self.offset(), "DATATYPE")?)
                }
                XY => xy_data = Some(rec.data),
                ENDEL => break,
                PROPATTR | PROPVALUE => {} // skip properties
                _ => self.reject_known_record(&rec, "in a BOUNDARY element")?,
            }
        }

        let layer = require_element_record(layer, cell.name(), element_index, "BOUNDARY", "LAYER")?;
        let datatype =
            require_element_record(datatype, cell.name(), element_index, "BOUNDARY", "DATATYPE")?;
        let xy_data =
            require_element_record(xy_data, cell.name(), element_index, "BOUNDARY", "XY")?;
        let mut vertices = self.parse_xy_points(&xy_data, cell.name(), element_index)?;
        let closing_point = vertices.pop();
        if !(3..=8190).contains(&vertices.len()) {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::BoundaryPointCount {
                    count: vertices.len(),
                },
            ));
        }
        if closing_point != vertices.first().copied() {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::BoundaryNotClosed,
            ));
        }
        let layer = parse_layer(cell.name(), element_index, layer, datatype)?;
        let polygon = Polygon::new(vertices).map_err(|reason| {
            invalid_element(cell.name(), element_index, polygon_error_reason(reason))
        })?;
        cell.add_polygon(polygon, layer);

        Ok(())
    }

    /// Read a PATH element.
    fn read_path(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let element_index = cell.elements().len();
        let mut layer = None;
        let mut datatype = None;
        let mut width_db = 0;
        let mut pathtype: i16 = 0;
        let mut xy_data = None;

        loop {
            let rec = self.expect_element_record()?;
            match rec.record_type {
                LAYER => layer = Some(parse_int16_record(&rec.data, self.offset(), "LAYER")?),
                DATATYPE => {
                    datatype = Some(parse_int16_record(&rec.data, self.offset(), "DATATYPE")?)
                }
                PATHTYPE => pathtype = parse_int16_record(&rec.data, self.offset(), "PATHTYPE")?,
                WIDTH => width_db = parse_int32_record(&rec.data, self.offset(), "WIDTH")?,
                XY => xy_data = Some(rec.data),
                ENDEL => break,
                PROPATTR | PROPVALUE => {}
                _ => self.reject_known_record(&rec, "in a PATH element")?,
            }
        }

        let layer = require_element_record(layer, cell.name(), element_index, "PATH", "LAYER")?;
        let datatype =
            require_element_record(datatype, cell.name(), element_index, "PATH", "DATATYPE")?;
        let xy_data = require_element_record(xy_data, cell.name(), element_index, "PATH", "XY")?;
        let points = self.parse_xy_points(&xy_data, cell.name(), element_index)?;
        if !(2..=8191).contains(&points.len()) {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::PathPointCount {
                    count: points.len(),
                },
            ));
        }
        let width = self.db_to_user(width_db);
        if !width.is_finite() {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::NonFiniteValue {
                    field: "path width",
                },
            ));
        }
        if width == 0.0 {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::ZeroPathWidth,
            ));
        }
        let end_type = match pathtype {
            0 => PathEndType::Flush,
            1 => PathEndType::Round,
            2 => PathEndType::HalfWidthExtension,
            value => {
                return Err(invalid_element(
                    cell.name(),
                    element_index,
                    GdsElementError::UnsupportedPathType(value),
                ));
            }
        };
        let layer = parse_layer(cell.name(), element_index, layer, datatype)?;
        cell.add_path(points, width, layer, end_type)
            .map_err(|error| map_cell_element_error(cell.name(), element_index, error))?;

        Ok(())
    }

    /// Read an SREF (single cell reference) element.
    fn read_sref(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let element_index = cell.elements().len();
        let mut sname = None;
        let mut strans: u16 = 0;
        let mut mag: f64 = 1.0;
        let mut angle_deg: f64 = 0.0;
        let mut xy_data = None;

        loop {
            let rec = self.expect_element_record()?;
            match rec.record_type {
                SNAME => sname = Some(parse_string(&rec.data)),
                STRANS => {
                    strans = parse_uint16_record(&rec.data, self.offset(), "STRANS")?;
                }
                MAG => mag = parse_real_record(&rec.data, self.offset(), "MAG")?,
                ANGLE => angle_deg = parse_real_record(&rec.data, self.offset(), "ANGLE")?,
                XY => xy_data = Some(rec.data),
                ENDEL => break,
                PROPATTR | PROPVALUE => {}
                _ => self.reject_known_record(&rec, "in an SREF element")?,
            }
        }

        let sname = require_element_record(sname, cell.name(), element_index, "SREF", "SNAME")?;
        let xy_data = require_element_record(xy_data, cell.name(), element_index, "SREF", "XY")?;
        validate_reference_strans(cell.name(), element_index, strans)?;
        validate_reference_target(cell.name(), element_index, &sname)?;
        let points = self.parse_xy_points(&xy_data, cell.name(), element_index)?;
        validate_xy_count(cell.name(), element_index, "SREF", points.len(), 1)?;
        validate_magnification(cell.name(), element_index, mag)?;
        if !angle_deg.is_finite() {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::NonFiniteValue { field: "angle" },
            ));
        }
        let origin = points[0];

        let reflected = (strans & STRANS_REFLECTION) != 0;
        let transform = build_transform(origin, angle_deg, mag, reflected);
        validate_imported_transform(cell.name(), element_index, &transform)?;

        let cell_ref = CellRef::with_transform(sname, transform)
            .map_err(|error| map_cell_ref_error(cell.name(), element_index, error))?;
        cell.add_ref(cell_ref);
        Ok(())
    }

    /// Read an AREF (array cell reference) element.
    fn read_aref(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let element_index = cell.elements().len();
        let mut sname = None;
        let mut strans: u16 = 0;
        let mut mag: f64 = 1.0;
        let mut angle_deg: f64 = 0.0;
        let mut xy_data = None;
        let mut colrow: Option<(u16, u16)> = None;

        loop {
            let rec = self.expect_element_record()?;
            match rec.record_type {
                SNAME => sname = Some(parse_string(&rec.data)),
                STRANS => {
                    strans = parse_uint16_record(&rec.data, self.offset(), "STRANS")?;
                }
                MAG => mag = parse_real_record(&rec.data, self.offset(), "MAG")?,
                ANGLE => angle_deg = parse_real_record(&rec.data, self.offset(), "ANGLE")?,
                COLROW => {
                    require_record_data_len(&rec.data, 4, self.offset(), "COLROW")?;
                    colrow = Some((
                        u16::from_be_bytes([rec.data[0], rec.data[1]]),
                        u16::from_be_bytes([rec.data[2], rec.data[3]]),
                    ));
                }
                XY => xy_data = Some(rec.data),
                ENDEL => break,
                PROPATTR | PROPVALUE => {}
                _ => self.reject_known_record(&rec, "in an AREF element")?,
            }
        }

        let sname = require_element_record(sname, cell.name(), element_index, "AREF", "SNAME")?;
        let colrow = require_element_record(colrow, cell.name(), element_index, "AREF", "COLROW")?;
        let xy_data = require_element_record(xy_data, cell.name(), element_index, "AREF", "XY")?;
        validate_reference_strans(cell.name(), element_index, strans)?;
        validate_reference_target(cell.name(), element_index, &sname)?;
        let points = self.parse_xy_points(&xy_data, cell.name(), element_index)?;
        validate_xy_count(cell.name(), element_index, "AREF", points.len(), 3)?;
        validate_magnification(cell.name(), element_index, mag)?;
        if !angle_deg.is_finite() {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::NonFiniteValue { field: "angle" },
            ));
        }
        let (columns, rows) = colrow;
        if columns == 0 || rows == 0 || columns > i16::MAX as u16 || rows > i16::MAX as u16 {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::RepetitionDimensions { columns, rows },
            ));
        }

        let origin = points[0];
        let col_end = points[1];
        let row_end = points[2];

        let reflected = (strans & STRANS_REFLECTION) != 0;
        let transform = build_transform(origin, angle_deg, mag, reflected);
        validate_imported_transform(cell.name(), element_index, &transform)?;

        // Recover per-instance world-space lattice vectors from the three
        // XY points:
        //   col_world_vec = (col_end - origin) / columns
        //   row_world_vec = (row_end - origin) / rows
        let cols = columns as f64;
        let rows_f = rows as f64;
        let col_world_x = (col_end.x - origin.x) / cols;
        let col_world_y = (col_end.y - origin.y) / cols;
        let row_world_x = (row_end.x - origin.x) / rows_f;
        let row_world_y = (row_end.y - origin.y) / rows_f;

        // Convert world-space vectors into the CellRef's local (pre-transform)
        // frame. The writer maps local vector `v` through the linear part of
        // the CellRef transform `[a,b;c,d]` to produce the world vector. So
        // we invert the 2x2 linear part here. This preserves arbitrary
        // (non-orthogonal, hex, skewed) lattice vectors on round-trip,
        // instead of the old behaviour of collapsing to scalar magnitudes
        // and losing any off-axis component.
        //
        let det = transform.a * transform.d - transform.b * transform.c;
        let inv_det = 1.0 / det;
        // [a b; c d]^{-1} = (1/det) * [ d -b; -c  a ]
        let col_local_x = inv_det * (transform.d * col_world_x - transform.b * col_world_y);
        let col_local_y = inv_det * (-transform.c * col_world_x + transform.a * col_world_y);
        let row_local_x = inv_det * (transform.d * row_world_x - transform.b * row_world_y);
        let row_local_y = inv_det * (-transform.c * row_world_x + transform.a * row_world_y);
        if ![col_local_x, col_local_y, row_local_x, row_local_y]
            .into_iter()
            .all(f64::is_finite)
        {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::NonFiniteValue {
                    field: "array repetition vector",
                },
            ));
        }

        let repetition = Repetition::new_vectors(
            columns,
            rows,
            Vector2::new(col_local_x, col_local_y),
            Vector2::new(row_local_x, row_local_y),
        )
        .map_err(|reason| {
            invalid_element(
                cell.name(),
                element_index,
                repetition_error_reason(reason, columns, rows),
            )
        })?;

        let cell_ref = CellRef::with_transform(sname, transform)
            .map_err(|error| map_cell_ref_error(cell.name(), element_index, error))?
            .with_repetition(Some(repetition));
        cell.add_ref(cell_ref);

        Ok(())
    }

    /// Read a TEXT element.
    fn read_text(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let element_index = cell.elements().len();
        let mut layer = None;
        let mut texttype = None;
        let mut pathtype: i16 = 0;
        let mut width_db: i32 = 0;
        let mut presentation: u16 = 0;
        let mut strans: u16 = 0;
        let mut mag: f64 = 1.0;
        let mut angle_deg: f64 = 0.0;
        let mut text_string = None;
        let mut xy_data = None;

        loop {
            let rec = self.expect_element_record()?;
            match rec.record_type {
                LAYER => layer = Some(parse_int16_record(&rec.data, self.offset(), "LAYER")?),
                TEXTTYPE => {
                    texttype = Some(parse_int16_record(&rec.data, self.offset(), "TEXTTYPE")?)
                }
                PATHTYPE => pathtype = parse_int16_record(&rec.data, self.offset(), "PATHTYPE")?,
                WIDTH => width_db = parse_int32_record(&rec.data, self.offset(), "WIDTH")?,
                STRANS => {
                    strans = parse_uint16_record(&rec.data, self.offset(), "STRANS")?;
                }
                MAG => mag = parse_real_record(&rec.data, self.offset(), "MAG")?,
                ANGLE => {
                    angle_deg = parse_real_record(&rec.data, self.offset(), "ANGLE")?;
                }
                PRESENTATION => {
                    presentation = parse_uint16_record(&rec.data, self.offset(), "PRESENTATION")?;
                }
                XY => xy_data = Some(rec.data),
                STRING => text_string = Some(parse_string(&rec.data)),
                ENDEL => break,
                PROPATTR | PROPVALUE => {}
                _ => self.reject_known_record(&rec, "in a TEXT element")?,
            }
        }

        let layer = require_element_record(layer, cell.name(), element_index, "TEXT", "LAYER")?;
        let texttype =
            require_element_record(texttype, cell.name(), element_index, "TEXT", "TEXTTYPE")?;
        let xy_data = require_element_record(xy_data, cell.name(), element_index, "TEXT", "XY")?;
        let text_string =
            require_element_record(text_string, cell.name(), element_index, "TEXT", "STRING")?;
        if pathtype != 0 {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::UnsupportedTextPresentation {
                    record: "PATHTYPE",
                    value: i32::from(pathtype),
                },
            ));
        }
        if width_db != 0 {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::UnsupportedTextPresentation {
                    record: "WIDTH",
                    value: width_db,
                },
            ));
        }
        if presentation != 0 {
            return Err(invalid_element(
                cell.name(),
                element_index,
                GdsElementError::UnsupportedTextPresentation {
                    record: "PRESENTATION",
                    value: i32::from(presentation),
                },
            ));
        }
        validate_text_transform(cell.name(), element_index, strans, angle_deg)?;
        let points = self.parse_xy_points(&xy_data, cell.name(), element_index)?;
        validate_xy_count(cell.name(), element_index, "TEXT", points.len(), 1)?;
        validate_magnification(cell.name(), element_index, mag)?;
        let position = points[0];
        let layer = parse_layer(cell.name(), element_index, layer, texttype)?;

        cell.add_text_with_height(text_string, position, layer, mag)
            .map_err(|error| map_cell_element_error(cell.name(), element_index, error))?;

        Ok(())
    }

    /// Parse XY record data into Points, converting database units to micrometers.
    fn parse_xy_points(
        &self,
        data: &[u8],
        cell: &str,
        element_index: usize,
    ) -> Result<Vec<Point>, GdsError> {
        if !data.len().is_multiple_of(8) {
            return Err(invalid_element(
                cell,
                element_index,
                GdsElementError::MalformedCoordinates {
                    byte_count: data.len(),
                },
            ));
        }
        let mut points = Vec::with_capacity(data.len() / 8);
        let mut cursor = Cursor::new(data);
        while let (Ok(x), Ok(y)) = (
            cursor.read_i32::<BigEndian>(),
            cursor.read_i32::<BigEndian>(),
        ) {
            let x = self.db_to_user(x);
            let y = self.db_to_user(y);
            if !x.is_finite() || !y.is_finite() {
                return Err(invalid_element(
                    cell,
                    element_index,
                    GdsElementError::NonFiniteValue {
                        field: "coordinate",
                    },
                ));
            }
            points.push(Point::new(x, y));
        }
        Ok(points)
    }

    /// Convert a database unit integer to user units (micrometers).
    fn db_to_user(&self, db: i32) -> f64 {
        (db as f64) * self.db_unit_m * 1e6
    }
}

// ============================================================
// Helper functions
// ============================================================

fn expected_data_type(record_type: u8) -> Option<u8> {
    let data_type = match record_type {
        HEADER | BGNLIB | BGNSTR | LAYER | DATATYPE | COLROW | TEXTTYPE | PATHTYPE | PROPATTR
        | BOXTYPE => INT16,
        LIBNAME | STRNAME | SNAME | STRING | PROPVALUE => ASCII,
        UNITS | MAG | ANGLE => REAL64,
        ENDLIB | ENDSTR | BOUNDARY | PATH | SREF | AREF | TEXT | ENDEL | NODE | BOX => NO_DATA,
        WIDTH | XY => INT32,
        PRESENTATION | STRANS => BIT_ARRAY,
        _ => return None,
    };
    Some(data_type)
}

fn fixed_data_len(record_type: u8) -> Option<usize> {
    match record_type {
        HEADER => Some(2),
        BGNLIB | BGNSTR => Some(24),
        _ => None,
    }
}

fn invalid_element(cell: &str, element_index: usize, reason: GdsElementError) -> GdsError {
    GdsError::InvalidElement {
        cell: cell.to_string(),
        element_index,
        reason,
    }
}

fn polygon_error_reason(reason: PolygonValidationReason) -> GdsElementError {
    match reason {
        PolygonValidationReason::TooFewVertices { count } => {
            GdsElementError::BoundaryPointCount { count }
        }
        PolygonValidationReason::NonFiniteVertex { .. } => GdsElementError::NonFiniteValue {
            field: "polygon vertex",
        },
    }
}

fn path_error_reason(reason: PathValidationReason) -> GdsElementError {
    match reason {
        PathValidationReason::TooFewPoints { count } => GdsElementError::PathPointCount { count },
        PathValidationReason::NonFinitePoint { .. } => GdsElementError::NonFiniteValue {
            field: "path point",
        },
        PathValidationReason::NonFiniteWidth => GdsElementError::NonFiniteValue {
            field: "path width",
        },
        PathValidationReason::ZeroWidth => GdsElementError::ZeroPathWidth,
    }
}

fn repetition_error_reason(
    reason: RepetitionValidationReason,
    columns: u16,
    rows: u16,
) -> GdsElementError {
    match reason {
        RepetitionValidationReason::ZeroColumns | RepetitionValidationReason::ZeroRows => {
            GdsElementError::RepetitionDimensions { columns, rows }
        }
        RepetitionValidationReason::NonFiniteColumnVector
        | RepetitionValidationReason::NonFiniteRowVector => GdsElementError::NonFiniteValue {
            field: "array repetition vector",
        },
    }
}

fn map_cell_ref_error(cell: &str, element_index: usize, error: CellRefError) -> GdsError {
    let reason = match error {
        CellRefError::Reference(CellRefValidationReason::EmptyTarget) => {
            GdsElementError::EmptyReferenceTarget
        }
        CellRefError::Reference(CellRefValidationReason::NonFiniteTransform) => {
            GdsElementError::UnsupportedTransform(GdsTransformError::NonFinite)
        }
        CellRefError::Reference(CellRefValidationReason::SingularTransform) => {
            GdsElementError::UnsupportedTransform(GdsTransformError::Singular)
        }
        CellRefError::Repetition(reason) => repetition_error_reason(reason, 0, 0),
    };
    invalid_element(cell, element_index, reason)
}

fn map_cell_element_error(
    cell: &str,
    element_index: usize,
    error: CellValidationError,
) -> GdsError {
    let reason = match error {
        CellValidationError::InvalidPolygon { reason, .. } => polygon_error_reason(reason),
        CellValidationError::InvalidPath { reason, .. } => path_error_reason(reason),
        CellValidationError::InvalidCellRef { reason, .. } => match reason {
            CellRefValidationReason::EmptyTarget => GdsElementError::EmptyReferenceTarget,
            CellRefValidationReason::NonFiniteTransform => {
                GdsElementError::UnsupportedTransform(GdsTransformError::NonFinite)
            }
            CellRefValidationReason::SingularTransform => {
                GdsElementError::UnsupportedTransform(GdsTransformError::Singular)
            }
        },
        CellValidationError::InvalidRepetition { reason, .. } => {
            repetition_error_reason(reason, 0, 0)
        }
        CellValidationError::InvalidText { reason, .. } => match reason {
            TextValidationReason::NonFinitePosition => GdsElementError::NonFiniteValue {
                field: "text position",
            },
            TextValidationReason::NonFiniteHeight | TextValidationReason::NonPositiveHeight => {
                GdsElementError::InvalidMagnification
            }
        },
        other => {
            return GdsError::InvalidLibrary(LibraryError::InvalidCell {
                name: cell.to_string(),
                source: other,
            });
        }
    };
    invalid_element(cell, element_index, reason)
}

fn require_element_record<T>(
    value: Option<T>,
    cell: &str,
    element_index: usize,
    element: &'static str,
    record: &'static str,
) -> Result<T, GdsError> {
    value.ok_or_else(|| {
        invalid_element(
            cell,
            element_index,
            GdsElementError::MissingRequiredRecord { element, record },
        )
    })
}

fn require_record_data_len(
    data: &[u8],
    expected: usize,
    offset: usize,
    record: &str,
) -> Result<(), GdsError> {
    if data.len() != expected {
        return Err(GdsError::InvalidRecord {
            offset,
            message: format!(
                "{record} record has {} data bytes, expected {expected}",
                data.len()
            ),
        });
    }
    Ok(())
}

fn parse_int16_record(data: &[u8], offset: usize, record: &str) -> Result<i16, GdsError> {
    require_record_data_len(data, 2, offset, record)?;
    Ok(i16::from_be_bytes([data[0], data[1]]))
}

fn parse_uint16_record(data: &[u8], offset: usize, record: &str) -> Result<u16, GdsError> {
    require_record_data_len(data, 2, offset, record)?;
    Ok(u16::from_be_bytes([data[0], data[1]]))
}

fn parse_int32_record(data: &[u8], offset: usize, record: &str) -> Result<i32, GdsError> {
    require_record_data_len(data, 4, offset, record)?;
    Ok(i32::from_be_bytes([data[0], data[1], data[2], data[3]]))
}

fn parse_real_record(data: &[u8], offset: usize, record: &str) -> Result<f64, GdsError> {
    require_record_data_len(data, 8, offset, record)?;
    Ok(gds_real_to_f64(data))
}

fn parse_layer(
    cell: &str,
    element_index: usize,
    number: i16,
    datatype: i16,
) -> Result<Layer, GdsError> {
    if number < 0 {
        return Err(invalid_element(
            cell,
            element_index,
            GdsElementError::NegativeRecordValue {
                field: "layer",
                value: number,
            },
        ));
    }
    if datatype < 0 {
        return Err(invalid_element(
            cell,
            element_index,
            GdsElementError::NegativeRecordValue {
                field: "datatype",
                value: datatype,
            },
        ));
    }
    Ok(Layer::new(number as u16, datatype as u16))
}

fn validate_reference_strans(
    cell: &str,
    element_index: usize,
    strans: u16,
) -> Result<(), GdsError> {
    let reserved = strans & !STRANS_SUPPORTED_BITS;
    let reason = if reserved != 0 {
        Some(GdsTransformError::ReservedBits(reserved))
    } else if (strans & STRANS_ABSOLUTE_MAGNIFICATION) != 0 {
        Some(GdsTransformError::AbsoluteMagnification)
    } else if (strans & STRANS_ABSOLUTE_ANGLE) != 0 {
        Some(GdsTransformError::AbsoluteAngle)
    } else {
        None
    };
    if let Some(reason) = reason {
        return Err(invalid_element(
            cell,
            element_index,
            GdsElementError::UnsupportedTransform(reason),
        ));
    }
    Ok(())
}

fn validate_text_transform(
    cell: &str,
    element_index: usize,
    strans: u16,
    angle_deg: f64,
) -> Result<(), GdsError> {
    let reserved = strans & !STRANS_SUPPORTED_BITS;
    let reason = if reserved != 0 {
        Some(GdsTransformError::ReservedBits(reserved))
    } else if (strans & STRANS_ABSOLUTE_MAGNIFICATION) != 0 {
        Some(GdsTransformError::AbsoluteMagnification)
    } else if (strans & STRANS_ABSOLUTE_ANGLE) != 0 {
        Some(GdsTransformError::AbsoluteAngle)
    } else if (strans & STRANS_REFLECTION) != 0 {
        Some(GdsTransformError::TextReflection)
    } else if angle_deg != 0.0 {
        Some(GdsTransformError::TextRotation)
    } else {
        None
    };
    if let Some(reason) = reason {
        return Err(invalid_element(
            cell,
            element_index,
            GdsElementError::UnsupportedTransform(reason),
        ));
    }
    Ok(())
}

fn validate_reference_target(
    cell: &str,
    element_index: usize,
    target: &str,
) -> Result<(), GdsError> {
    if target.is_empty() {
        return Err(invalid_element(
            cell,
            element_index,
            GdsElementError::EmptyReferenceTarget,
        ));
    }
    Ok(())
}

fn validate_xy_count(
    cell: &str,
    element_index: usize,
    kind: &'static str,
    count: usize,
    expected: usize,
) -> Result<(), GdsError> {
    if count != expected {
        return Err(invalid_element(
            cell,
            element_index,
            GdsElementError::ReferencePointCount {
                kind,
                count,
                expected,
            },
        ));
    }
    Ok(())
}

fn validate_magnification(
    cell: &str,
    element_index: usize,
    magnification: f64,
) -> Result<(), GdsError> {
    if !magnification.is_finite() || magnification <= 0.0 {
        return Err(invalid_element(
            cell,
            element_index,
            GdsElementError::InvalidMagnification,
        ));
    }
    Ok(())
}

fn validate_imported_transform(
    cell: &str,
    element_index: usize,
    transform: &Transform,
) -> Result<(), GdsError> {
    let reason = if !transform.is_finite() {
        Some(GdsTransformError::NonFinite)
    } else if !transform.is_invertible() {
        Some(GdsTransformError::Singular)
    } else {
        None
    };
    if let Some(reason) = reason {
        return Err(invalid_element(
            cell,
            element_index,
            GdsElementError::UnsupportedTransform(reason),
        ));
    }
    Ok(())
}

/// Decode GDS REAL8 (8-byte excess-64 base-16 float) to f64.
fn gds_real_to_f64(bytes: &[u8]) -> f64 {
    if bytes.len() < 8 {
        return 0.0;
    }

    let negative = (bytes[0] & 0x80) != 0;
    let exponent = (bytes[0] & 0x7F) as i32 - 64;

    // 56-bit mantissa from bytes 1..7
    let mut mantissa: u64 = 0;
    for &b in &bytes[1..8] {
        mantissa = (mantissa << 8) | (b as u64);
    }

    if mantissa == 0 {
        return 0.0;
    }

    // mantissa / 2^56 gives a value in [0, 1)
    // result = mantissa / 2^56 * 16^exponent
    let value = (mantissa as f64) / ((1u64 << 56) as f64) * 16.0_f64.powi(exponent);

    if negative { -value } else { value }
}

/// Parse a big-endian INT16 from record data.
#[cfg(test)]
fn parse_int16(data: &[u8]) -> i16 {
    if data.len() >= 2 {
        i16::from_be_bytes([data[0], data[1]])
    } else {
        0
    }
}

/// Parse a big-endian INT32 from record data.
#[cfg(test)]
fn parse_int32(data: &[u8]) -> i32 {
    if data.len() >= 4 {
        i32::from_be_bytes([data[0], data[1], data[2], data[3]])
    } else {
        0
    }
}

/// Parse an ASCII string from record data, stripping trailing nulls and padding.
fn parse_string(data: &[u8]) -> String {
    // GDS strings are padded to even length with null bytes
    let trimmed = data
        .iter()
        .copied()
        .take_while(|&b| b != 0)
        .collect::<Vec<u8>>();
    String::from_utf8_lossy(&trimmed).to_string()
}

/// Build a Transform from GDS SREF/AREF parameters.
///
/// GDS decomposition:
/// - First apply reflection about X axis (if reflected)
/// - Then apply magnification
/// - Then apply rotation (angle in degrees)
/// - Then apply translation (origin)
///
/// The resulting 2x2 matrix (before translation):
///   Without reflection: [mag*cos, -mag*sin; mag*sin, mag*cos]
///   With reflection:    [mag*cos, mag*sin; mag*sin, -mag*cos]
///
/// GDS reflection is "mirror about X axis before rotation", which means
/// the Y-coordinates are negated before rotation is applied.
fn build_transform(origin: Point, angle_deg: f64, mag: f64, reflected: bool) -> Transform {
    let angle = angle_deg.to_radians();
    let cos = angle.cos();
    let sin = angle.sin();

    let (a, b, c, d) = if reflected {
        // Reflection about X axis first, then rotation, then magnification
        // M * R * Mx = mag * [cos, sin; sin, -cos]
        (mag * cos, mag * sin, mag * sin, -mag * cos)
    } else {
        // Rotation then magnification
        // M * R = mag * [cos, -sin; sin, cos]
        (mag * cos, -mag * sin, mag * sin, mag * cos)
    };

    Transform::new(a, b, c, d, origin.x, origin.y)
}

#[cfg(test)]
mod tests {
    use super::*;

    struct Cell;

    #[allow(clippy::new_ret_no_self)]
    impl Cell {
        fn new(name: impl Into<String>) -> rosette_core::Cell {
            rosette_core::Cell::new(name).unwrap()
        }
    }

    struct CellRef;

    #[allow(clippy::new_ret_no_self)]
    impl CellRef {
        fn new(cell_name: impl Into<String>) -> rosette_core::CellRef {
            rosette_core::CellRef::new(cell_name).unwrap()
        }
    }

    struct Polygon;

    #[allow(clippy::new_ret_no_self)]
    impl Polygon {
        fn new(vertices: Vec<Point>) -> rosette_core::Polygon {
            rosette_core::Polygon::new(vertices).unwrap()
        }

        fn rect(origin: Point, width: f64, height: f64) -> rosette_core::Polygon {
            rosette_core::Polygon::rect(origin, width, height).unwrap()
        }
    }

    fn record_bytes(record_type: u8, data_type: u8, data: &[u8]) -> Vec<u8> {
        assert!(data.len().is_multiple_of(2));
        let length = 4 + data.len();
        let mut record = Vec::with_capacity(length);
        record.extend_from_slice(&(length as u16).to_be_bytes());
        record.push(record_type);
        record.push(data_type);
        record.extend_from_slice(data);
        record
    }

    fn replace_record_data(bytes: &mut Vec<u8>, record_type: u8, data: &[u8]) {
        assert!(data.len().is_multiple_of(2));
        let mut offset = 0;
        while offset + 4 <= bytes.len() {
            let length = u16::from_be_bytes([bytes[offset], bytes[offset + 1]]) as usize;
            assert!(length >= 4 && offset + length <= bytes.len());
            if bytes[offset + 2] == record_type {
                let new_length = 4 + data.len();
                let data_type = bytes[offset + 3];
                let mut replacement = Vec::with_capacity(new_length);
                replacement.extend_from_slice(&(new_length as u16).to_be_bytes());
                replacement.push(record_type);
                replacement.push(data_type);
                replacement.extend_from_slice(data);
                bytes.splice(offset..offset + length, replacement);
                return;
            }
            offset += length;
        }
        panic!("record type 0x{record_type:02x} not found");
    }

    fn remove_record(bytes: &mut Vec<u8>, record_type: u8) {
        let mut offset = 0;
        while offset + 4 <= bytes.len() {
            let length = u16::from_be_bytes([bytes[offset], bytes[offset + 1]]) as usize;
            assert!(length >= 4 && offset + length <= bytes.len());
            if bytes[offset + 2] == record_type {
                bytes.drain(offset..offset + length);
                return;
            }
            offset += length;
        }
        panic!("record type 0x{record_type:02x} not found");
    }

    fn insert_record_before(
        bytes: &mut Vec<u8>,
        before: u8,
        record_type: u8,
        data_type: u8,
        data: &[u8],
    ) {
        let mut offset = 0;
        while offset + 4 <= bytes.len() {
            let length = u16::from_be_bytes([bytes[offset], bytes[offset + 1]]) as usize;
            assert!(length >= 4 && offset + length <= bytes.len());
            if bytes[offset + 2] == before {
                bytes.splice(offset..offset, record_bytes(record_type, data_type, data));
                return;
            }
            offset += length;
        }
        panic!("record type 0x{before:02x} not found");
    }

    fn xy_data(points: &[(i32, i32)]) -> Vec<u8> {
        points
            .iter()
            .flat_map(|(x, y)| x.to_be_bytes().into_iter().chain(y.to_be_bytes()))
            .collect()
    }

    fn polygon_library() -> Library {
        let mut cell = Cell::new("TOP");
        cell.add_polygon(
            Polygon::new(vec![
                Point::origin(),
                Point::new(1.0, 0.0),
                Point::new(0.0, 1.0),
            ]),
            Layer::new(1, 0),
        );
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        library
    }

    fn valid_record_data(record_type: u8) -> Vec<u8> {
        vec![0; fixed_data_len(record_type).unwrap_or(0)]
    }

    fn assert_missing_required_record(
        mut bytes: Vec<u8>,
        record_type: u8,
        element: &'static str,
        record: &'static str,
    ) {
        remove_record(&mut bytes, record_type);
        assert!(matches!(
            read_bytes(&bytes),
            Err(GdsError::InvalidElement {
                reason: GdsElementError::MissingRequiredRecord {
                    element: actual_element,
                    record: actual_record,
                },
                ..
            }) if actual_element == element && actual_record == record
        ));
    }

    #[test]
    fn validates_headers_for_every_known_record_type() {
        let known_records = [
            (HEADER, INT16),
            (BGNLIB, INT16),
            (LIBNAME, ASCII),
            (UNITS, REAL64),
            (ENDLIB, NO_DATA),
            (BGNSTR, INT16),
            (STRNAME, ASCII),
            (ENDSTR, NO_DATA),
            (BOUNDARY, NO_DATA),
            (PATH, NO_DATA),
            (SREF, NO_DATA),
            (AREF, NO_DATA),
            (TEXT, NO_DATA),
            (LAYER, INT16),
            (DATATYPE, INT16),
            (WIDTH, INT32),
            (XY, INT32),
            (ENDEL, NO_DATA),
            (SNAME, ASCII),
            (COLROW, INT16),
            (NODE, NO_DATA),
            (TEXTTYPE, INT16),
            (PRESENTATION, BIT_ARRAY),
            (STRING, ASCII),
            (STRANS, BIT_ARRAY),
            (MAG, REAL64),
            (ANGLE, REAL64),
            (PATHTYPE, INT16),
            (PROPATTR, INT16),
            (PROPVALUE, ASCII),
            (BOX, NO_DATA),
            (BOXTYPE, INT16),
        ];

        for (record_type, expected_type) in known_records {
            let data = valid_record_data(record_type);
            let valid = record_bytes(record_type, expected_type, &data);
            assert!(GdsReader::new(&valid).read_record().unwrap().is_some());

            let wrong_type = if expected_type == NO_DATA {
                INT16
            } else {
                NO_DATA
            };
            let invalid = record_bytes(record_type, wrong_type, &[]);
            assert!(matches!(
                GdsReader::new(&invalid).read_record(),
                Err(GdsError::InvalidRecord { .. })
            ));
        }
    }

    #[test]
    fn rejects_odd_record_lengths_and_no_data_payloads() {
        let odd_length = [0, 5, HEADER, INT16, 0];
        assert!(matches!(
            GdsReader::new(&odd_length).read_record(),
            Err(GdsError::InvalidRecord { .. })
        ));

        let no_data_payload = [0, 6, ENDLIB, NO_DATA, 0, 0];
        assert!(matches!(
            GdsReader::new(&no_data_payload).read_record(),
            Err(GdsError::InvalidRecord { .. })
        ));
    }

    #[test]
    fn rejects_wrong_header_and_timestamp_lengths() {
        for (record_type, data_type, data) in [
            (HEADER, INT16, vec![]),
            (HEADER, INT16, vec![0; 4]),
            (BGNLIB, INT16, vec![0; 22]),
            (BGNLIB, INT16, vec![0; 26]),
            (BGNSTR, INT16, vec![0; 22]),
            (BGNSTR, INT16, vec![0; 26]),
        ] {
            let bytes = record_bytes(record_type, data_type, &data);
            assert!(matches!(
                GdsReader::new(&bytes).read_record(),
                Err(GdsError::InvalidRecord { .. })
            ));
        }
    }

    #[test]
    fn rejects_known_records_at_library_scope_but_skips_unknown_extensions() {
        for record_type in [BOUNDARY, ENDEL, ENDSTR, STRNAME] {
            let mut bytes = super::super::writer::write_bytes(&polygon_library()).unwrap();
            let data = valid_record_data(record_type);
            insert_record_before(
                &mut bytes,
                BGNSTR,
                record_type,
                expected_data_type(record_type).unwrap(),
                &data,
            );
            assert!(matches!(
                read_bytes(&bytes),
                Err(GdsError::InvalidRecord { .. })
            ));
        }

        let mut bytes = super::super::writer::write_bytes(&polygon_library()).unwrap();
        insert_record_before(&mut bytes, BGNSTR, 0x7F, NO_DATA, &[]);
        assert!(read_bytes(&bytes).is_ok());
    }

    #[test]
    fn rejects_nested_structure_records_instead_of_merging_them() {
        for record_type in [BGNSTR, STRNAME, BGNLIB, ENDLIB, ENDEL, HEADER, LIBNAME] {
            let mut bytes = super::super::writer::write_bytes(&polygon_library()).unwrap();
            let data = if matches!(record_type, STRNAME | LIBNAME) {
                b"NESTED".to_vec()
            } else {
                valid_record_data(record_type)
            };
            insert_record_before(
                &mut bytes,
                ENDSTR,
                record_type,
                expected_data_type(record_type).unwrap(),
                &data,
            );
            assert!(matches!(
                read_bytes(&bytes),
                Err(GdsError::InvalidRecord { .. })
            ));
        }
    }

    #[test]
    fn rejects_records_that_cross_an_element_boundary() {
        for record_type in [
            BOUNDARY, PATH, SREF, AREF, TEXT, NODE, BOX, BGNSTR, ENDSTR, ENDLIB,
        ] {
            let mut bytes = super::super::writer::write_bytes(&polygon_library()).unwrap();
            let data = valid_record_data(record_type);
            insert_record_before(
                &mut bytes,
                ENDEL,
                record_type,
                expected_data_type(record_type).unwrap(),
                &data,
            );
            assert!(matches!(
                read_bytes(&bytes),
                Err(GdsError::InvalidRecord { .. })
            ));
        }
    }

    #[test]
    fn rejects_missing_required_element_records() {
        let boundary = super::super::writer::write_bytes(&polygon_library()).unwrap();
        for (record_type, record) in [(LAYER, "LAYER"), (DATATYPE, "DATATYPE"), (XY, "XY")] {
            assert_missing_required_record(boundary.clone(), record_type, "BOUNDARY", record);
        }

        let mut cell = Cell::new("TOP");
        cell.add_path(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            0.5,
            Layer::new(1, 2),
            PathEndType::default(),
        )
        .unwrap();
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let path = super::super::writer::write_bytes(&library).unwrap();
        for (record_type, record) in [(LAYER, "LAYER"), (DATATYPE, "DATATYPE"), (XY, "XY")] {
            assert_missing_required_record(path.clone(), record_type, "PATH", record);
        }

        let mut cell = Cell::new("TOP");
        cell.add_ref(CellRef::new("TARGET"));
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let sref = super::super::writer::write_bytes(&library).unwrap();
        for (record_type, record) in [(SNAME, "SNAME"), (XY, "XY")] {
            assert_missing_required_record(sref.clone(), record_type, "SREF", record);
        }

        let mut cell = Cell::new("TOP");
        cell.add_ref(CellRef::new("TARGET").array(2, 2, 1.0, 1.0).unwrap());
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let aref = super::super::writer::write_bytes(&library).unwrap();
        for (record_type, record) in [(SNAME, "SNAME"), (COLROW, "COLROW"), (XY, "XY")] {
            assert_missing_required_record(aref.clone(), record_type, "AREF", record);
        }

        let mut cell = Cell::new("TOP");
        cell.add_text_with_height("label", Point::origin(), Layer::new(1, 2), 1.0)
            .unwrap();
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let text = super::super::writer::write_bytes(&library).unwrap();
        for (record_type, record) in [
            (LAYER, "LAYER"),
            (TEXTTYPE, "TEXTTYPE"),
            (XY, "XY"),
            (STRING, "STRING"),
        ] {
            assert_missing_required_record(text.clone(), record_type, "TEXT", record);
        }
    }

    #[test]
    fn rejects_omitted_path_width_as_unrepresentable_zero_width() {
        let mut cell = Cell::new("TOP");
        cell.add_path(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            0.5,
            Layer::new(1, 0),
            PathEndType::default(),
        )
        .unwrap();
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let mut bytes = super::super::writer::write_bytes(&library).unwrap();
        remove_record(&mut bytes, WIDTH);

        assert!(matches!(
            read_bytes(&bytes),
            Err(GdsError::InvalidElement {
                reason: GdsElementError::ZeroPathWidth,
                ..
            })
        ));
    }

    #[test]
    fn test_gds_real_to_f64_zero() {
        assert_eq!(gds_real_to_f64(&[0u8; 8]), 0.0);
    }

    #[test]
    fn test_gds_real_roundtrip_one() {
        use super::super::writer::f64_to_gds_real;
        let encoded = f64_to_gds_real(1.0);
        let decoded = gds_real_to_f64(&encoded);
        assert!((decoded - 1.0).abs() < 1e-12, "got {}", decoded);
    }

    #[test]
    fn test_gds_real_roundtrip_small() {
        use super::super::writer::f64_to_gds_real;
        let val = 1e-9;
        let encoded = f64_to_gds_real(val);
        let decoded = gds_real_to_f64(&encoded);
        assert!(
            (decoded - val).abs() / val < 1e-6,
            "got {} expected {}",
            decoded,
            val
        );
    }

    #[test]
    fn test_gds_real_roundtrip_negative() {
        use super::super::writer::f64_to_gds_real;
        let val = -45.0;
        let encoded = f64_to_gds_real(val);
        let decoded = gds_real_to_f64(&encoded);
        assert!(
            (decoded - val).abs() < 1e-10,
            "got {} expected {}",
            decoded,
            val
        );
    }

    #[test]
    fn test_parse_string_no_padding() {
        assert_eq!(parse_string(b"TEST"), "TEST");
    }

    #[test]
    fn test_parse_string_null_padding() {
        assert_eq!(parse_string(b"TEST\0"), "TEST");
        assert_eq!(parse_string(b"AB\0"), "AB");
    }

    #[test]
    fn test_parse_int16() {
        assert_eq!(parse_int16(&[0x00, 0x01]), 1);
        assert_eq!(parse_int16(&[0xFF, 0xFF]), -1);
        assert_eq!(parse_int16(&[0x02, 0x58]), 600);
    }

    #[test]
    fn test_parse_int32() {
        assert_eq!(parse_int32(&[0x00, 0x00, 0x03, 0xE8]), 1000);
        assert_eq!(parse_int32(&[0xFF, 0xFF, 0xFC, 0x18]), -1000);
    }

    #[test]
    fn test_build_transform_identity() {
        let t = build_transform(Point::origin(), 0.0, 1.0, false);
        let p = t.apply(Point::new(5.0, 3.0));
        assert!((p.x - 5.0).abs() < 1e-10);
        assert!((p.y - 3.0).abs() < 1e-10);
    }

    #[test]
    fn test_build_transform_translation() {
        let t = build_transform(Point::new(10.0, 20.0), 0.0, 1.0, false);
        let p = t.apply(Point::origin());
        assert!((p.x - 10.0).abs() < 1e-10);
        assert!((p.y - 20.0).abs() < 1e-10);
    }

    #[test]
    fn test_build_transform_90deg() {
        let t = build_transform(Point::origin(), 90.0, 1.0, false);
        let p = t.apply(Point::new(1.0, 0.0));
        assert!((p.x - 0.0).abs() < 1e-10, "x = {}", p.x);
        assert!((p.y - 1.0).abs() < 1e-10, "y = {}", p.y);
    }

    #[test]
    fn test_build_transform_reflected() {
        let t = build_transform(Point::origin(), 0.0, 1.0, true);
        // Reflection about X axis negates Y
        let p = t.apply(Point::new(1.0, 2.0));
        assert!((p.x - 1.0).abs() < 1e-10);
        assert!((p.y - (-2.0)).abs() < 1e-10);
    }

    #[test]
    fn test_build_transform_magnification() {
        let t = build_transform(Point::origin(), 0.0, 2.5, false);
        let p = t.apply(Point::new(4.0, 2.0));
        assert!((p.x - 10.0).abs() < 1e-10);
        assert!((p.y - 5.0).abs() < 1e-10);
    }

    // ============================================================
    // Round-trip tests: write GDS -> read GDS -> compare
    // ============================================================

    /// Helper: write a library to GDS bytes, then read it back.
    fn roundtrip(lib: &Library) -> Library {
        use std::io::BufWriter;

        let mut output = Vec::new();
        {
            let mut w = super::super::writer::GdsWriter::new(BufWriter::new(&mut output));
            w.write_library(lib).unwrap();
        }
        read_bytes(&output).unwrap()
    }

    #[test]
    fn reader_retains_representable_noncanonical_structure_names() {
        let mut library = Library::new("test");
        library.add_cell(Cell::new("VALIDNAME")).unwrap();
        let mut bytes = super::super::writer::write_bytes(&library).unwrap();
        let offset = bytes
            .windows(b"VALIDNAME".len())
            .position(|window| window == b"VALIDNAME")
            .unwrap();
        bytes[offset..offset + b"HAS SPACE".len()].copy_from_slice(b"HAS SPACE");

        let imported = read_bytes(&bytes).unwrap();
        assert!(imported.cell("HAS SPACE").is_some());
    }

    #[test]
    fn rejects_one_and_two_point_boundaries_without_panicking() {
        for points in [&[(0, 0)][..], &[(0, 0), (1000, 0)][..]] {
            let mut bytes = super::super::writer::write_bytes(&polygon_library()).unwrap();
            replace_record_data(&mut bytes, XY, &xy_data(points));
            assert!(matches!(
                read_bytes(&bytes),
                Err(GdsError::InvalidElement {
                    reason: GdsElementError::BoundaryPointCount { .. },
                    ..
                })
            ));
        }
    }

    #[test]
    fn rejects_short_paths_and_empty_reference_targets() {
        let mut cell = Cell::new("TOP");
        cell.add_path(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            0.5,
            Layer::new(1, 0),
            PathEndType::default(),
        )
        .unwrap();
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let mut bytes = super::super::writer::write_bytes(&library).unwrap();
        replace_record_data(&mut bytes, XY, &xy_data(&[(0, 0)]));
        assert!(matches!(
            read_bytes(&bytes),
            Err(GdsError::InvalidElement {
                reason: GdsElementError::PathPointCount { count: 1 },
                ..
            })
        ));

        let mut cell = Cell::new("TOP");
        cell.add_ref(CellRef::new("TARGET"));
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let mut bytes = super::super::writer::write_bytes(&library).unwrap();
        replace_record_data(&mut bytes, SNAME, &[]);
        assert!(matches!(
            read_bytes(&bytes),
            Err(GdsError::InvalidElement {
                reason: GdsElementError::EmptyReferenceTarget,
                ..
            })
        ));
    }

    #[test]
    fn rejects_zero_and_oversized_colrow_values() {
        let mut cell = Cell::new("TOP");
        cell.add_ref(CellRef::new("TARGET").array(2, 2, 1.0, 1.0).unwrap());
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();

        for colrow in [[0, 0, 0, 2], [0x80, 0, 0, 2]] {
            let mut bytes = super::super::writer::write_bytes(&library).unwrap();
            replace_record_data(&mut bytes, COLROW, &colrow);
            assert!(matches!(
                read_bytes(&bytes),
                Err(GdsError::InvalidElement {
                    reason: GdsElementError::RepetitionDimensions { .. },
                    ..
                })
            ));
        }
    }

    #[test]
    fn rejects_invalid_units_and_singular_reference_magnification() {
        let mut bytes = super::super::writer::write_bytes(&polygon_library()).unwrap();
        replace_record_data(&mut bytes, UNITS, &[0; 16]);
        assert!(matches!(
            read_bytes(&bytes),
            Err(GdsError::InvalidUnits { .. })
        ));

        let mut cell = Cell::new("TOP");
        cell.add_ref(CellRef::new("TARGET").scale(2.0).unwrap());
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let mut bytes = super::super::writer::write_bytes(&library).unwrap();
        replace_record_data(&mut bytes, MAG, &[0; 8]);
        assert!(matches!(
            read_bytes(&bytes),
            Err(GdsError::InvalidElement {
                reason: GdsElementError::InvalidMagnification,
                ..
            })
        ));
    }

    #[test]
    fn imports_database_units_at_their_physical_micrometer_scale() {
        let mut bytes = super::super::writer::write_bytes(&polygon_library()).unwrap();
        let mut units = Vec::with_capacity(16);
        units.extend_from_slice(&super::super::writer::f64_to_gds_real(0.25));
        units.extend_from_slice(&super::super::writer::f64_to_gds_real(2e-9));
        replace_record_data(&mut bytes, UNITS, &units);

        let imported = read_bytes(&bytes).unwrap();
        let (polygon, _) = imported.cell("TOP").unwrap().polygons().next().unwrap();
        let bbox = polygon.bbox();
        assert!((bbox.width() - 2.0).abs() < 1e-12);
        assert!((bbox.height() - 2.0).abs() < 1e-12);
    }

    #[test]
    fn rejects_absolute_strans_flags_on_references() {
        for is_array in [false, true] {
            for (flag, expected) in [
                (
                    STRANS_ABSOLUTE_MAGNIFICATION,
                    GdsTransformError::AbsoluteMagnification,
                ),
                (STRANS_ABSOLUTE_ANGLE, GdsTransformError::AbsoluteAngle),
            ] {
                let cell_ref = if is_array {
                    CellRef::new("TARGET")
                        .scale(2.0)
                        .unwrap()
                        .array(2, 2, 1.0, 1.0)
                        .unwrap()
                } else {
                    CellRef::new("TARGET").scale(2.0).unwrap()
                };
                let mut cell = Cell::new("TOP");
                cell.add_ref(cell_ref);
                let mut library = Library::new("test");
                library.add_cell(cell).unwrap();
                let mut bytes = super::super::writer::write_bytes(&library).unwrap();
                replace_record_data(&mut bytes, STRANS, &flag.to_be_bytes());

                assert!(matches!(
                    read_bytes(&bytes),
                    Err(GdsError::InvalidElement {
                        reason: GdsElementError::UnsupportedTransform(reason),
                        ..
                    }) if reason == expected
                ));
            }
        }
    }

    #[test]
    fn rejects_reserved_strans_flags() {
        let reserved: u16 = 0x4000;

        for cell_ref in [
            CellRef::new("TARGET").scale(2.0).unwrap(),
            CellRef::new("TARGET")
                .scale(2.0)
                .unwrap()
                .array(2, 2, 1.0, 1.0)
                .unwrap(),
        ] {
            let mut cell = Cell::new("TOP");
            cell.add_ref(cell_ref);
            let mut library = Library::new("test");
            library.add_cell(cell).unwrap();
            let mut bytes = super::super::writer::write_bytes(&library).unwrap();
            replace_record_data(&mut bytes, STRANS, &reserved.to_be_bytes());

            assert!(matches!(
                read_bytes(&bytes),
                Err(GdsError::InvalidElement {
                    reason: GdsElementError::UnsupportedTransform(GdsTransformError::ReservedBits(
                        0x4000
                    )),
                    ..
                })
            ));
        }

        let mut cell = Cell::new("TOP");
        cell.add_text_with_height("label", Point::origin(), Layer::new(1, 0), 2.0)
            .unwrap();
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let mut bytes = super::super::writer::write_bytes(&library).unwrap();
        replace_record_data(&mut bytes, STRANS, &reserved.to_be_bytes());
        assert!(matches!(
            read_bytes(&bytes),
            Err(GdsError::InvalidElement {
                reason: GdsElementError::UnsupportedTransform(GdsTransformError::ReservedBits(
                    0x4000
                )),
                ..
            })
        ));
    }

    #[test]
    fn retains_negative_nonzero_path_widths() {
        let mut cell = Cell::new("TOP");
        cell.add_path(
            vec![Point::origin(), Point::new(1.0, 0.0)],
            0.5,
            Layer::new(1, 0),
            PathEndType::default(),
        )
        .unwrap();
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let mut bytes = super::super::writer::write_bytes(&library).unwrap();
        replace_record_data(&mut bytes, WIDTH, &(-500_i32).to_be_bytes());

        let imported = read_bytes(&bytes).unwrap();
        let (_, width, _, _) = imported.cell("TOP").unwrap().paths().next().unwrap();
        assert!((width + 0.5).abs() < 1e-12);
    }

    #[test]
    fn accepts_default_text_pathtype_and_width() {
        let mut cell = Cell::new("TOP");
        cell.add_text_with_height("label", Point::origin(), Layer::new(1, 0), 1.0)
            .unwrap();
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let mut bytes = super::super::writer::write_bytes(&library).unwrap();
        insert_record_before(&mut bytes, XY, PATHTYPE, INT16, &0_i16.to_be_bytes());
        insert_record_before(&mut bytes, XY, WIDTH, INT32, &0_i32.to_be_bytes());
        insert_record_before(
            &mut bytes,
            XY,
            PRESENTATION,
            BIT_ARRAY,
            &0_u16.to_be_bytes(),
        );

        let imported = read_bytes(&bytes).unwrap();
        assert_eq!(imported.cell("TOP").unwrap().texts().count(), 1);
    }

    #[test]
    fn rejects_nonzero_text_presentation_records_as_unsupported() {
        for (record_type, data_type, data, record, value) in [
            (PATHTYPE, INT16, 1_i16.to_be_bytes().to_vec(), "PATHTYPE", 1),
            (WIDTH, INT32, 1_i32.to_be_bytes().to_vec(), "WIDTH", 1),
            (
                PRESENTATION,
                BIT_ARRAY,
                1_u16.to_be_bytes().to_vec(),
                "PRESENTATION",
                1,
            ),
        ] {
            let mut cell = Cell::new("TOP");
            cell.add_text_with_height("label", Point::origin(), Layer::new(1, 0), 1.0)
                .unwrap();
            let mut library = Library::new("test");
            library.add_cell(cell).unwrap();
            let mut bytes = super::super::writer::write_bytes(&library).unwrap();
            insert_record_before(&mut bytes, XY, record_type, data_type, &data);

            assert!(matches!(
                read_bytes(&bytes),
                Err(GdsError::InvalidElement {
                    reason: GdsElementError::UnsupportedTextPresentation {
                        record: actual_record,
                        value: actual_value,
                    },
                    ..
                }) if actual_record == record && actual_value == value
            ));
        }
    }

    #[test]
    fn validates_optional_text_presentation_record_lengths() {
        for (record_type, data_type, data) in [
            (PATHTYPE, INT16, vec![]),
            (WIDTH, INT32, vec![0, 0]),
            (PRESENTATION, BIT_ARRAY, vec![]),
        ] {
            let mut cell = Cell::new("TOP");
            cell.add_text_with_height("label", Point::origin(), Layer::new(1, 0), 1.0)
                .unwrap();
            let mut library = Library::new("test");
            library.add_cell(cell).unwrap();
            let mut bytes = super::super::writer::write_bytes(&library).unwrap();
            insert_record_before(&mut bytes, XY, record_type, data_type, &data);

            assert!(matches!(
                read_bytes(&bytes),
                Err(GdsError::InvalidRecord { .. })
            ));
        }
    }

    #[test]
    fn rejects_unrepresentable_text_transforms() {
        for (flag, expected) in [
            (STRANS_REFLECTION, GdsTransformError::TextReflection),
            (
                STRANS_ABSOLUTE_MAGNIFICATION,
                GdsTransformError::AbsoluteMagnification,
            ),
            (STRANS_ABSOLUTE_ANGLE, GdsTransformError::AbsoluteAngle),
        ] {
            let mut cell = Cell::new("TOP");
            cell.add_text_with_height("label", Point::origin(), Layer::new(1, 0), 2.0)
                .unwrap();
            let mut library = Library::new("test");
            library.add_cell(cell).unwrap();
            let mut bytes = super::super::writer::write_bytes(&library).unwrap();
            replace_record_data(&mut bytes, STRANS, &flag.to_be_bytes());

            assert!(matches!(
                read_bytes(&bytes),
                Err(GdsError::InvalidElement {
                    reason: GdsElementError::UnsupportedTransform(reason),
                    ..
                }) if reason == expected
            ));
        }

        let mut cell = Cell::new("TOP");
        cell.add_text_with_height("label", Point::origin(), Layer::new(1, 0), 1.0)
            .unwrap();
        let mut library = Library::new("test");
        library.add_cell(cell).unwrap();
        let mut bytes = super::super::writer::write_bytes(&library).unwrap();
        insert_record_before(
            &mut bytes,
            XY,
            ANGLE,
            REAL64,
            &super::super::writer::f64_to_gds_real(45.0),
        );
        assert!(matches!(
            read_bytes(&bytes),
            Err(GdsError::InvalidElement {
                reason: GdsElementError::UnsupportedTransform(GdsTransformError::TextRotation),
                ..
            })
        ));
    }

    #[test]
    fn test_roundtrip_simple_polygon() {
        let mut cell = Cell::new("TOP");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));

        let mut lib = Library::new("test");
        lib.add_cell(cell).unwrap();

        let result = roundtrip(&lib);
        assert_eq!(result.cells().len(), 1);
        let cell = &result.cells()[0];
        assert_eq!(cell.name(), "TOP");
        assert_eq!(cell.polygons().count(), 1);

        let (poly, layer) = cell.polygons().next().unwrap();
        assert_eq!(layer.number, 1);
        assert_eq!(layer.datatype, 0);
        // Rect (0,0) 10x5 should have 4 vertices
        assert_eq!(poly.vertices().len(), 4);
        let bbox = poly.bbox();
        assert!((bbox.width() - 10.0).abs() < 0.01);
        assert!((bbox.height() - 5.0).abs() < 0.01);
    }

    #[test]
    fn test_roundtrip_path() {
        use rosette_core::cell::PathEndType;

        let mut cell = Cell::new("TOP");
        cell.add_path(
            vec![Point::new(0.0, 0.0), Point::new(100.0, 0.0)],
            0.5,
            Layer::new(2, 0),
            PathEndType::Round,
        )
        .unwrap();

        let mut lib = Library::new("test");
        lib.add_cell(cell).unwrap();

        let result = roundtrip(&lib);
        let cell = &result.cells()[0];
        assert_eq!(cell.paths().count(), 1);

        let (points, width, layer, end_type) = cell.paths().next().unwrap();
        assert_eq!(points.len(), 2);
        assert!((width - 0.5).abs() < 0.01);
        assert_eq!(layer.number, 2);
        assert_eq!(end_type, PathEndType::Round);
    }

    #[test]
    fn test_roundtrip_text() {
        let mut cell = Cell::new("TOP");
        cell.add_text_with_height("Hello", Point::new(5.0, 10.0), Layer::new(10, 7), 2.5)
            .unwrap();

        let mut lib = Library::new("test");
        lib.add_cell(cell).unwrap();

        let result = roundtrip(&lib);
        let cell = &result.cells()[0];
        assert_eq!(cell.texts().count(), 1);

        let (text, pos, layer, height) = cell.texts().next().unwrap();
        assert_eq!(text, "Hello");
        assert!((pos.x - 5.0).abs() < 0.01);
        assert!((pos.y - 10.0).abs() < 0.01);
        assert_eq!(layer.number, 10);
        assert_eq!(layer.datatype, 7);
        assert!((height - 2.5).abs() < 0.01);
    }

    #[test]
    fn test_roundtrip_sref() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").at(10.0, 20.0).unwrap());

        let mut lib = Library::new("test");
        lib.add_cell(sub).unwrap();
        lib.add_cell(top).unwrap();

        let result = roundtrip(&lib);
        assert_eq!(result.cells().len(), 2);

        let top = result.cell("TOP").unwrap();
        assert_eq!(top.cell_refs().count(), 1);

        let cell_ref = top.cell_refs().next().unwrap();
        assert_eq!(cell_ref.cell_name(), "SUB");
        // Check translation
        let origin = cell_ref.transform().apply(Point::origin());
        assert!((origin.x - 10.0).abs() < 0.01);
        assert!((origin.y - 20.0).abs() < 0.01);
    }

    #[test]
    fn test_roundtrip_sref_rotated() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(
            CellRef::new("SUB")
                .rotate(std::f64::consts::FRAC_PI_2)
                .unwrap(),
        );

        let mut lib = Library::new("test");
        lib.add_cell(sub).unwrap();
        lib.add_cell(top).unwrap();

        let result = roundtrip(&lib);
        let top = result.cell("TOP").unwrap();
        let cell_ref = top.cell_refs().next().unwrap();

        // (1, 0) should map to (0, 1) under 90deg rotation
        let p = cell_ref.transform().apply(Point::new(1.0, 0.0));
        assert!((p.x).abs() < 0.01, "x={}", p.x);
        assert!((p.y - 1.0).abs() < 0.01, "y={}", p.y);
    }

    #[test]
    fn test_roundtrip_sref_mirror() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").mirror_x());

        let mut lib = Library::new("test");
        lib.add_cell(sub).unwrap();
        lib.add_cell(top).unwrap();

        let result = roundtrip(&lib);
        let top = result.cell("TOP").unwrap();
        let cell_ref = top.cell_refs().next().unwrap();

        assert!(cell_ref.transform().is_reflection());
        // (0, 1) should map to (0, -1) under mirror_x
        let p = cell_ref.transform().apply(Point::new(0.0, 1.0));
        assert!((p.x).abs() < 0.01);
        assert!((p.y - (-1.0)).abs() < 0.01);
    }

    #[test]
    fn test_roundtrip_hierarchy() {
        let mut leaf = Cell::new("LEAF");
        leaf.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut mid = Cell::new("MID");
        mid.add_ref(CellRef::new("LEAF").at(5.0, 0.0).unwrap());

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("MID").at(0.0, 10.0).unwrap());

        let mut lib = Library::new("test");
        lib.add_cell(leaf).unwrap();
        lib.add_cell(mid).unwrap();
        lib.add_cell(top).unwrap();

        let result = roundtrip(&lib);
        assert_eq!(result.cells().len(), 3);
        assert!(result.cell("LEAF").is_some());
        assert!(result.cell("MID").is_some());
        assert!(result.cell("TOP").is_some());
    }

    #[test]
    fn test_roundtrip_preserves_cycles_and_missing_references() {
        let mut cell_a = Cell::new("A");
        cell_a.add_ref(CellRef::new("B"));
        let mut cell_b = Cell::new("B");
        cell_b.add_ref(CellRef::new("A"));
        cell_b.add_ref(CellRef::new("MISSING"));

        let mut library = Library::new("test");
        library.add_cell(cell_a).unwrap();
        library.add_cell(cell_b).unwrap();

        let result = roundtrip(&library);
        assert_eq!(result.cell("A").unwrap().cell_refs().count(), 1);
        assert_eq!(result.cell("B").unwrap().cell_refs().count(), 2);
    }

    #[test]
    fn test_roundtrip_multiple_layers() {
        let mut cell = Cell::new("TOP");
        cell.add_polygon(Polygon::rect(Point::origin(), 5.0, 5.0), Layer::new(1, 0));
        cell.add_polygon(
            Polygon::rect(Point::new(10.0, 0.0), 5.0, 5.0),
            Layer::new(2, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(20.0, 0.0), 5.0, 5.0),
            Layer::new(1, 1),
        );

        let mut lib = Library::new("test");
        lib.add_cell(cell).unwrap();

        let result = roundtrip(&lib);
        let cell = &result.cells()[0];
        assert_eq!(cell.polygons().count(), 3);

        let layers: Vec<Layer> = cell.polygons().map(|(_, l)| *l).collect();
        assert!(layers.contains(&Layer::new(1, 0)));
        assert!(layers.contains(&Layer::new(2, 0)));
        assert!(layers.contains(&Layer::new(1, 1)));
    }

    #[test]
    fn test_roundtrip_empty_library() {
        let lib = Library::new("empty");
        let result = roundtrip(&lib);
        assert_eq!(result.cells().len(), 0);
    }

    #[test]
    fn test_roundtrip_skewed_aref_preserves_lattice_vectors() {
        // ROS-512: a skewed (non-orthogonal) AREF round-trips through GDS
        // without losing its lattice structure. This is the regression case
        // for the old reader behaviour, which collapsed each world-space
        // lattice vector to a scalar magnitude, dropping off-axis components.
        use rosette_core::Repetition;

        let mut sub = Cell::new("UNIT");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        // Flat-top hex packing: row vector offset by (pitch/2, pitch*sqrt(3)/2).
        let pitch: f64 = 10.0;
        let row_y = pitch * (3.0_f64).sqrt() / 2.0;
        let col_vec = rosette_core::geometry::Vector2::new(pitch, 0.0);
        let row_vec = rosette_core::geometry::Vector2::new(pitch / 2.0, row_y);

        let mut top = Cell::new("TOP");
        top.add_ref(
            CellRef::new("UNIT")
                .array_vectors(4, 3, col_vec, row_vec)
                .unwrap(),
        );

        let mut lib = Library::new("test");
        lib.add_cell(sub).unwrap();
        lib.add_cell(top).unwrap();

        let result = roundtrip(&lib);
        let top = result.cell("TOP").unwrap();
        let refs: Vec<&rosette_core::CellRef> = top.cell_refs().collect();
        assert_eq!(refs.len(), 1);
        let rep = refs[0]
            .repetition()
            .expect("AREF repetition should be preserved");

        assert_eq!(rep.columns(), 4);
        assert_eq!(rep.rows(), 3);
        // GDS DB units quantise coordinates to a grid (default 1 nm = 1e-3 µm).
        // The reader recovers each lattice vector as
        //   `(end - origin) / n_steps`
        // so the worst-case per-component error is `~1 DB unit / n_steps`,
        // i.e. ≤ 2.5e-4 µm for the 4-column test. Allow ~2× margin.
        let tol = 5e-4;
        assert!(
            (rep.col_vector().x - col_vec.x).abs() < tol,
            "col_vector.x = {}",
            rep.col_vector().x
        );
        assert!(
            (rep.col_vector().y - col_vec.y).abs() < tol,
            "col_vector.y = {}",
            rep.col_vector().y
        );
        assert!(
            (rep.row_vector().x - row_vec.x).abs() < tol,
            "row_vector.x = {}",
            rep.row_vector().x
        );
        assert!(
            (rep.row_vector().y - row_vec.y).abs() < tol,
            "row_vector.y = {}",
            rep.row_vector().y
        );

        // Writer path (legacy) also agrees for an axis-aligned AREF built
        // with the scalar `.array()` builder.
        let mut top2 = Cell::new("TOP2");
        top2.add_ref(CellRef::new("UNIT").array(3, 2, 5.0, 7.0).unwrap());
        let mut lib2 = Library::new("test2");
        let mut sub2 = Cell::new("UNIT");
        sub2.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));
        lib2.add_cell(sub2).unwrap();
        lib2.add_cell(top2).unwrap();
        let r2 = roundtrip(&lib2);
        let rep2 = r2
            .cell("TOP2")
            .unwrap()
            .cell_refs()
            .next()
            .unwrap()
            .repetition()
            .unwrap();
        let expected2 = Repetition::new(3, 2, 5.0, 7.0).unwrap();
        assert_eq!(rep2.columns(), expected2.columns());
        assert_eq!(rep2.rows(), expected2.rows());
        assert!(
            (rep2.col_vector().x - expected2.col_vector().x).abs() < 1e-9
                && (rep2.col_vector().y - expected2.col_vector().y).abs() < 1e-9
                && (rep2.row_vector().x - expected2.row_vector().x).abs() < 1e-9
                && (rep2.row_vector().y - expected2.row_vector().y).abs() < 1e-9,
            "rectangular AREF should round-trip to within ULP: got {:?}, expected {:?}",
            rep2,
            expected2,
        );
    }

    #[test]
    fn test_roundtrip_mixed_elements() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));
        top.add_path(
            vec![Point::new(0.0, 10.0), Point::new(100.0, 10.0)],
            0.5,
            Layer::new(2, 0),
            PathEndType::Flush,
        )
        .unwrap();
        top.add_text_with_height("Label", Point::new(50.0, 15.0), Layer::new(10, 0), 1.0)
            .unwrap();
        top.add_ref(CellRef::new("SUB").at(20.0, 20.0).unwrap());

        let mut lib = Library::new("test");
        lib.add_cell(sub).unwrap();
        lib.add_cell(top).unwrap();

        let result = roundtrip(&lib);
        let top = result.cell("TOP").unwrap();
        assert_eq!(top.polygons().count(), 1);
        assert_eq!(top.paths().count(), 1);
        assert_eq!(top.texts().count(), 1);
        assert_eq!(top.cell_refs().count(), 1);
    }
}
