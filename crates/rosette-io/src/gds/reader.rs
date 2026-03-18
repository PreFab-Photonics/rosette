//! GDS II binary format reader.
//!
//! Parses GDS II Stream files into rosette [`Library`] objects.

use std::fs;
use std::io::{Cursor, Read};
use std::path::Path;

use byteorder::{BigEndian, ReadBytesExt};

use rosette_core::cell::{CellRef, PathEndType, Repetition};
use rosette_core::{Cell, Layer, Library, Point, Polygon, Transform};

use super::constants::*;
use super::error::GdsError;

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
    _data_type: u8,
    data: Vec<u8>,
}

/// State machine for reading GDS files.
struct GdsReader<'a> {
    cursor: Cursor<&'a [u8]>,
    /// Database unit in meters, read from UNITS record.
    db_unit_m: f64,
    /// User unit in meters, read from UNITS record.
    user_unit_m: f64,
}

impl<'a> GdsReader<'a> {
    fn new(data: &'a [u8]) -> Self {
        Self {
            cursor: Cursor::new(data),
            db_unit_m: 1e-9,   // default: 1 nm
            user_unit_m: 1e-6, // default: 1 um
        }
    }

    /// Current byte offset in the stream (for error messages).
    fn offset(&self) -> usize {
        self.cursor.position() as usize
    }

    /// Read the next record from the stream. Returns None at EOF.
    fn read_record(&mut self) -> Result<Option<Record>, GdsError> {
        // Read 2-byte record length
        let len = match self.cursor.read_u16::<BigEndian>() {
            Ok(l) => l,
            Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => return Ok(None),
            Err(e) => return Err(GdsError::Io(e)),
        };

        if len < 4 {
            return Err(GdsError::InvalidRecord {
                offset: self.offset() - 2,
                message: format!("record length {} is less than minimum 4", len),
            });
        }

        let record_type = self.cursor.read_u8()?;
        let data_type = self.cursor.read_u8()?;

        let data_len = (len - 4) as usize;
        let mut data = vec![0u8; data_len];
        self.cursor
            .read_exact(&mut data)
            .map_err(|_| GdsError::UnexpectedEof)?;

        Ok(Some(Record {
            record_type,
            _data_type: data_type,
            data,
        }))
    }

    /// Read the next record, returning an error if EOF.
    fn expect_record(&mut self) -> Result<Record, GdsError> {
        self.read_record()?.ok_or(GdsError::UnexpectedEof)
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
        if rec.data.len() >= 2 {
            let _version = u16::from_be_bytes([rec.data[0], rec.data[1]]);
        }

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
        if rec.data.len() >= 16 {
            let user_unit_ratio = gds_real_to_f64(&rec.data[0..8]);
            let db_unit_in_meters = gds_real_to_f64(&rec.data[8..16]);
            self.db_unit_m = db_unit_in_meters;
            self.user_unit_m = db_unit_in_meters / user_unit_ratio;
        }

        let mut library = Library::new(lib_name);

        // Read cells until ENDLIB
        loop {
            let rec = self.expect_record()?;
            match rec.record_type {
                BGNSTR => {
                    let cell = self.read_cell()?;
                    // Use add_cell_dedup: names from existing GDS files may
                    // duplicate (re-defined structures) and we accept whatever
                    // the file contains. Validation errors from exotic names
                    // in third-party files are ignored — the name was valid
                    // enough for the originating tool.
                    let _ = library.add_cell_dedup(cell);
                }
                ENDLIB => break,
                _ => {
                    // Skip unknown top-level records
                }
            }
        }

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
        let mut cell = Cell::new(cell_name);

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
                _ => {
                    // Unknown record inside a cell — skip
                }
            }
        }

        Ok(cell)
    }

    /// Skip records until ENDEL (for unsupported element types).
    fn skip_element(&mut self) -> Result<(), GdsError> {
        loop {
            let rec = self.expect_record()?;
            if rec.record_type == ENDEL {
                break;
            }
        }
        Ok(())
    }

    /// Read a BOUNDARY (polygon) element.
    fn read_boundary(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let mut layer: i16 = 0;
        let mut datatype: i16 = 0;
        let mut xy_data: Vec<u8> = Vec::new();

        loop {
            let rec = self.expect_record()?;
            match rec.record_type {
                LAYER => layer = parse_int16(&rec.data),
                DATATYPE => datatype = parse_int16(&rec.data),
                XY => xy_data = rec.data,
                ENDEL => break,
                PROPATTR | PROPVALUE => {} // skip properties
                _ => {}
            }
        }

        let points = self.parse_xy_points(&xy_data);
        // GDS polygons are closed (first == last), strip the closing vertex
        if points.len() > 1 {
            let vertices = points[..points.len() - 1].to_vec();
            if !vertices.is_empty() {
                cell.add_polygon(
                    Polygon::new(vertices),
                    Layer::new(layer.max(0) as u16, datatype.max(0) as u16),
                );
            }
        }

        Ok(())
    }

    /// Read a PATH element.
    fn read_path(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let mut layer: i16 = 0;
        let mut datatype: i16 = 0;
        let mut width_db: i32 = 0;
        let mut pathtype: i16 = 0;
        let mut xy_data: Vec<u8> = Vec::new();

        loop {
            let rec = self.expect_record()?;
            match rec.record_type {
                LAYER => layer = parse_int16(&rec.data),
                DATATYPE => datatype = parse_int16(&rec.data),
                PATHTYPE => pathtype = parse_int16(&rec.data),
                WIDTH => width_db = parse_int32(&rec.data),
                XY => xy_data = rec.data,
                ENDEL => break,
                PROPATTR | PROPVALUE => {}
                _ => {}
            }
        }

        let points = self.parse_xy_points(&xy_data);
        let width = self.db_to_user(width_db);
        let end_type = match pathtype {
            1 => PathEndType::Round,
            2 => PathEndType::HalfWidthExtension,
            _ => PathEndType::Flush,
        };

        if points.len() >= 2 {
            cell.add_path(
                points,
                width,
                Layer::new(layer.max(0) as u16, datatype.max(0) as u16),
                end_type,
            );
        }

        Ok(())
    }

    /// Read an SREF (single cell reference) element.
    fn read_sref(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let mut sname = String::new();
        let mut strans: u16 = 0;
        let mut has_strans = false;
        let mut mag: f64 = 1.0;
        let mut angle_deg: f64 = 0.0;
        let mut xy_data: Vec<u8> = Vec::new();

        loop {
            let rec = self.expect_record()?;
            match rec.record_type {
                SNAME => sname = parse_string(&rec.data),
                STRANS => {
                    has_strans = true;
                    strans = parse_uint16(&rec.data);
                }
                MAG => mag = gds_real_to_f64(&rec.data),
                ANGLE => angle_deg = gds_real_to_f64(&rec.data),
                XY => xy_data = rec.data,
                ENDEL => break,
                PROPATTR | PROPVALUE => {}
                _ => {}
            }
        }

        let points = self.parse_xy_points(&xy_data);
        let origin = points.first().copied().unwrap_or(Point::origin());

        let reflected = has_strans && (strans & 0x8000) != 0;
        let transform = build_transform(origin, angle_deg, mag, reflected);

        cell.add_ref(CellRef::with_transform(sname, transform));
        Ok(())
    }

    /// Read an AREF (array cell reference) element.
    fn read_aref(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let mut sname = String::new();
        let mut strans: u16 = 0;
        let mut has_strans = false;
        let mut mag: f64 = 1.0;
        let mut angle_deg: f64 = 0.0;
        let mut xy_data: Vec<u8> = Vec::new();
        let mut columns: u16 = 1;
        let mut rows: u16 = 1;

        loop {
            let rec = self.expect_record()?;
            match rec.record_type {
                SNAME => sname = parse_string(&rec.data),
                STRANS => {
                    has_strans = true;
                    strans = parse_uint16(&rec.data);
                }
                MAG => mag = gds_real_to_f64(&rec.data),
                ANGLE => angle_deg = gds_real_to_f64(&rec.data),
                COLROW => {
                    if rec.data.len() >= 4 {
                        columns = u16::from_be_bytes([rec.data[0], rec.data[1]]);
                        rows = u16::from_be_bytes([rec.data[2], rec.data[3]]);
                    }
                }
                XY => xy_data = rec.data,
                ENDEL => break,
                PROPATTR | PROPVALUE => {}
                _ => {}
            }
        }

        let points = self.parse_xy_points(&xy_data);

        // AREF XY has 3 points: origin, col_end, row_end
        // col_end = origin + col_vector * num_columns
        // row_end = origin + row_vector * num_rows
        if points.len() < 3 {
            return Ok(()); // malformed AREF, skip
        }

        let origin = points[0];
        let col_end = points[1];
        let row_end = points[2];

        let reflected = has_strans && (strans & 0x8000) != 0;
        let transform = build_transform(origin, angle_deg, mag, reflected);

        // Recover spacing in local coordinates.
        // The writer computes:
        //   col_end = origin + (t.a * col_spacing) * cols, origin.y + (t.c * col_spacing) * cols
        //   row_end = origin + (t.b * row_spacing) * rows, origin.y + (t.d * row_spacing) * rows
        //
        // We need to invert: go from world-space vectors back to local spacing.
        // World-space column vector (total span):
        let col_total_x = col_end.x - origin.x;
        let col_total_y = col_end.y - origin.y;
        let row_total_x = row_end.x - origin.x;
        let row_total_y = row_end.y - origin.y;

        // Per-instance world-space vectors:
        let cols = columns.max(1) as f64;
        let rows_f = rows.max(1) as f64;

        let col_vec_x = col_total_x / cols;
        let col_vec_y = col_total_y / cols;
        let row_vec_x = row_total_x / rows_f;
        let row_vec_y = row_total_y / rows_f;

        // The writer maps local (col_spacing, 0) through [a,b;c,d] to get the
        // world-space column vector, and local (0, row_spacing) to get the row vector.
        // So: col_vec = (a * cs, c * cs) => cs = col_vec / (a, c)
        //     row_vec = (b * rs, d * rs) => rs = row_vec / (b, d)
        // We use the magnitude since spacing is a scalar.
        let col_spacing = (col_vec_x * col_vec_x + col_vec_y * col_vec_y).sqrt();
        let row_spacing = (row_vec_x * row_vec_x + row_vec_y * row_vec_y).sqrt();

        let repetition = Repetition::new(columns, rows, col_spacing, row_spacing);

        let mut cell_ref = CellRef::with_transform(sname, transform);
        cell_ref.repetition = Some(repetition);
        cell.add_ref(cell_ref);

        Ok(())
    }

    /// Read a TEXT element.
    fn read_text(&mut self, cell: &mut Cell) -> Result<(), GdsError> {
        let mut layer: i16 = 0;
        let mut _texttype: i16 = 0;
        let mut mag: f64 = 1.0;
        let mut text_string = String::new();
        let mut xy_data: Vec<u8> = Vec::new();

        loop {
            let rec = self.expect_record()?;
            match rec.record_type {
                LAYER => layer = parse_int16(&rec.data),
                TEXTTYPE => _texttype = parse_int16(&rec.data),
                STRANS => {} // consume but we only care about MAG for text height
                MAG => mag = gds_real_to_f64(&rec.data),
                ANGLE => {}        // text angle — not stored in rosette's Text element
                PRESENTATION => {} // skip
                XY => xy_data = rec.data,
                STRING => text_string = parse_string(&rec.data),
                ENDEL => break,
                PROPATTR | PROPVALUE => {}
                _ => {}
            }
        }

        let points = self.parse_xy_points(&xy_data);
        let position = points.first().copied().unwrap_or(Point::origin());

        cell.add_text_with_height(
            text_string,
            position,
            Layer::new(layer.max(0) as u16, 0),
            mag,
        );

        Ok(())
    }

    /// Parse XY record data into Points, converting from database units to user units (um).
    fn parse_xy_points(&self, data: &[u8]) -> Vec<Point> {
        let mut points = Vec::with_capacity(data.len() / 8);
        let mut cursor = Cursor::new(data);
        while let (Ok(x), Ok(y)) = (
            cursor.read_i32::<BigEndian>(),
            cursor.read_i32::<BigEndian>(),
        ) {
            points.push(Point::new(self.db_to_user(x), self.db_to_user(y)));
        }
        points
    }

    /// Convert a database unit integer to user units (micrometers).
    fn db_to_user(&self, db: i32) -> f64 {
        // db is in database units. Convert to meters, then to user units.
        // db_value_in_meters = db * db_unit_m
        // user_value = db_value_in_meters / user_unit_m
        (db as f64) * self.db_unit_m / self.user_unit_m
    }
}

// ============================================================
// Helper functions
// ============================================================

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
fn parse_int16(data: &[u8]) -> i16 {
    if data.len() >= 2 {
        i16::from_be_bytes([data[0], data[1]])
    } else {
        0
    }
}

/// Parse a big-endian unsigned INT16 from record data.
fn parse_uint16(data: &[u8]) -> u16 {
    if data.len() >= 2 {
        u16::from_be_bytes([data[0], data[1]])
    } else {
        0
    }
}

/// Parse a big-endian INT32 from record data.
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
    fn test_roundtrip_simple_polygon() {
        let mut cell = Cell::new("TOP");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));

        let mut lib = Library::new("test");
        lib.add_cell(cell).unwrap();

        let result = roundtrip(&lib);
        assert_eq!(result.cells().len(), 1);
        let cell = &result.cells()[0];
        assert_eq!(cell.name(), "TOP");
        assert_eq!(cell.polygon_count(), 1);

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
        );

        let mut lib = Library::new("test");
        lib.add_cell(cell).unwrap();

        let result = roundtrip(&lib);
        let cell = &result.cells()[0];
        assert_eq!(cell.path_count(), 1);

        let (points, width, layer, end_type) = cell.paths().next().unwrap();
        assert_eq!(points.len(), 2);
        assert!((width - 0.5).abs() < 0.01);
        assert_eq!(layer.number, 2);
        assert_eq!(end_type, PathEndType::Round);
    }

    #[test]
    fn test_roundtrip_text() {
        let mut cell = Cell::new("TOP");
        cell.add_text_with_height("Hello", Point::new(5.0, 10.0), Layer::new(10, 0), 2.5);

        let mut lib = Library::new("test");
        lib.add_cell(cell).unwrap();

        let result = roundtrip(&lib);
        let cell = &result.cells()[0];
        assert_eq!(cell.text_count(), 1);

        let (text, pos, layer, height) = cell.texts().next().unwrap();
        assert_eq!(text, "Hello");
        assert!((pos.x - 5.0).abs() < 0.01);
        assert!((pos.y - 10.0).abs() < 0.01);
        assert_eq!(layer.number, 10);
        assert!((height - 2.5).abs() < 0.01);
    }

    #[test]
    fn test_roundtrip_sref() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").at(10.0, 20.0));

        let mut lib = Library::new("test");
        lib.add_cell(sub).unwrap();
        lib.add_cell(top).unwrap();

        let result = roundtrip(&lib);
        assert_eq!(result.cells().len(), 2);

        let top = result.cell("TOP").unwrap();
        assert_eq!(top.ref_count(), 1);

        let cell_ref = top.cell_refs().next().unwrap();
        assert_eq!(cell_ref.cell_name, "SUB");
        // Check translation
        let origin = cell_ref.transform.apply(Point::origin());
        assert!((origin.x - 10.0).abs() < 0.01);
        assert!((origin.y - 20.0).abs() < 0.01);
    }

    #[test]
    fn test_roundtrip_sref_rotated() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").rotate(std::f64::consts::FRAC_PI_2));

        let mut lib = Library::new("test");
        lib.add_cell(sub).unwrap();
        lib.add_cell(top).unwrap();

        let result = roundtrip(&lib);
        let top = result.cell("TOP").unwrap();
        let cell_ref = top.cell_refs().next().unwrap();

        // (1, 0) should map to (0, 1) under 90deg rotation
        let p = cell_ref.transform.apply(Point::new(1.0, 0.0));
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

        assert!(cell_ref.transform.is_reflection());
        // (0, 1) should map to (0, -1) under mirror_x
        let p = cell_ref.transform.apply(Point::new(0.0, 1.0));
        assert!((p.x).abs() < 0.01);
        assert!((p.y - (-1.0)).abs() < 0.01);
    }

    #[test]
    fn test_roundtrip_hierarchy() {
        let mut leaf = Cell::new("LEAF");
        leaf.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut mid = Cell::new("MID");
        mid.add_ref(CellRef::new("LEAF").at(5.0, 0.0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("MID").at(0.0, 10.0));

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
        assert_eq!(cell.polygon_count(), 3);

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
        );
        top.add_text("Label", Point::new(50.0, 15.0), Layer::new(10, 0));
        top.add_ref(CellRef::new("SUB").at(20.0, 20.0));

        let mut lib = Library::new("test");
        lib.add_cell(sub).unwrap();
        lib.add_cell(top).unwrap();

        let result = roundtrip(&lib);
        let top = result.cell("TOP").unwrap();
        assert_eq!(top.polygon_count(), 1);
        assert_eq!(top.path_count(), 1);
        assert_eq!(top.text_count(), 1);
        assert_eq!(top.ref_count(), 1);
    }
}
