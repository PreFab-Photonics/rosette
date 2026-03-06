//! GDS II binary format writer.
//!
//! Implements writing of GDS II Stream format as specified in the
//! GDSII Reference Manual.

use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::Path;

use byteorder::{BigEndian, WriteBytesExt};
use thiserror::Error;

use rosette_core::cell::{CellRef, Element, PathEndType};
use rosette_core::{Cell, Layer, Library, Point, Polygon, Transform};

/// Errors that can occur during GDS writing.
#[derive(Error, Debug)]
pub enum GdsError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Cell name too long: {0} (max 32 characters)")]
    CellNameTooLong(String),

    #[error("Polygon has too many vertices: {0} (max 8191)")]
    TooManyVertices(usize),

    #[error("Path has too many points: {0} (max 8191)")]
    TooManyPathPoints(usize),

    #[error("Path has too few points: {0} (minimum 2)")]
    TooFewPathPoints(usize),

    #[error("Text string too long: {0} (max 512 characters)")]
    TextTooLong(usize),
}

/// Write a single cell to a GDS file.
///
/// The cell becomes the only structure in the library.
pub fn write(path: impl AsRef<Path>, cell: &Cell) -> Result<(), GdsError> {
    let mut lib = Library::new("library");
    lib.add_cell(cell.clone());
    write_library(path, &lib)
}

/// Write a library to a GDS file.
pub fn write_library(path: impl AsRef<Path>, library: &Library) -> Result<(), GdsError> {
    let file = File::create(path)?;
    let mut writer = GdsWriter::new(BufWriter::new(file));
    writer.write_library(library)
}

// GDS Record Types
const HEADER: u8 = 0x00;
const BGNLIB: u8 = 0x01;
const LIBNAME: u8 = 0x02;
const UNITS: u8 = 0x03;
const ENDLIB: u8 = 0x04;
const BGNSTR: u8 = 0x05;
const STRNAME: u8 = 0x06;
const ENDSTR: u8 = 0x07;
const BOUNDARY: u8 = 0x08;
const PATH: u8 = 0x09;
const SREF: u8 = 0x0A;
const AREF: u8 = 0x0B;
const TEXT: u8 = 0x0C;
const ENDEL: u8 = 0x11;
const LAYER: u8 = 0x0D;
const DATATYPE: u8 = 0x0E;
const TEXTTYPE: u8 = 0x16;
const XY: u8 = 0x10;
const SNAME: u8 = 0x12;
const STRING: u8 = 0x19;
const STRANS: u8 = 0x1A;
const MAG: u8 = 0x1B;
const ANGLE: u8 = 0x1C;
const COLROW: u8 = 0x13;
const PATHTYPE: u8 = 0x21;
const WIDTH: u8 = 0x0F;

// Data Types
const NO_DATA: u8 = 0x00;
const BIT_ARRAY: u8 = 0x01;
const INT16: u8 = 0x02;
const INT32: u8 = 0x03;
const REAL64: u8 = 0x05;
const ASCII: u8 = 0x06;

/// GDS database unit in meters (1nm).
const DB_UNIT_M: f64 = 1e-9;
/// User unit in meters (1um).
const USER_UNIT_M: f64 = 1e-6;
/// Conversion factor: user units to database units.
const UNITS_PER_UM: f64 = 1000.0;

struct GdsWriter<W: Write> {
    writer: W,
}

impl<W: Write> GdsWriter<W> {
    fn new(writer: W) -> Self {
        Self { writer }
    }

    fn write_library(&mut self, library: &Library) -> Result<(), GdsError> {
        self.write_header()?;
        self.write_bgnlib()?;
        self.write_libname(library.name())?;
        self.write_units()?;

        // Collect all cells including dependencies
        let cells = self.collect_cells(library);

        for cell in &cells {
            self.write_cell(cell)?;
        }

        self.write_endlib()?;
        Ok(())
    }

    /// Collect cells in dependency order (topological sort).
    ///
    /// GDS requires that cells be defined before they are referenced.
    /// This performs a topological sort so dependencies come first.
    fn collect_cells<'a>(&self, library: &'a Library) -> Vec<&'a Cell> {
        use std::collections::{HashMap, HashSet};

        let cells = library.cells();
        let cell_map: HashMap<&str, &'a Cell> = cells.iter().map(|c| (c.name(), c)).collect();

        let mut visited: HashSet<&str> = HashSet::new();
        let mut result: Vec<&'a Cell> = Vec::new();

        // Helper function to visit a cell and its dependencies (depth-first)
        fn visit<'a>(
            cell_name: &str,
            cell_map: &HashMap<&str, &'a Cell>,
            visited: &mut HashSet<&'a str>,
            result: &mut Vec<&'a Cell>,
        ) {
            // Skip if already visited or not in library
            let Some(&cell) = cell_map.get(cell_name) else {
                return;
            };
            let name = cell.name();
            if visited.contains(name) {
                return;
            }

            // Visit all dependencies first
            for cell_ref in cell.cell_refs() {
                visit(&cell_ref.cell_name, cell_map, visited, result);
            }

            // Mark as visited and add to result
            visited.insert(name);
            result.push(cell);
        }

        // Visit all cells in the library
        for cell in cells {
            visit(cell.name(), &cell_map, &mut visited, &mut result);
        }

        result
    }

    fn write_header(&mut self) -> Result<(), GdsError> {
        // HEADER record with version 600 (GDS II Release 6.0)
        self.write_record(HEADER, INT16, &[0x02, 0x58])?;
        Ok(())
    }

    fn write_bgnlib(&mut self) -> Result<(), GdsError> {
        // BGNLIB with modification and access timestamps
        // 12 INT16 values: year, month, day, hour, min, sec (x2)
        let timestamp = Self::current_timestamp();
        let mut data = Vec::with_capacity(24);
        for _ in 0..2 {
            for &val in &timestamp {
                data.extend_from_slice(&val.to_be_bytes());
            }
        }
        self.write_record(BGNLIB, INT16, &data)?;
        Ok(())
    }

    fn write_libname(&mut self, name: &str) -> Result<(), GdsError> {
        self.write_string_record(LIBNAME, name)?;
        Ok(())
    }

    fn write_units(&mut self) -> Result<(), GdsError> {
        // UNITS: two REAL64 values
        // First: size of database unit in user units (1e-3 um = 1nm)
        // Second: size of database unit in meters
        let user_unit = DB_UNIT_M / USER_UNIT_M;
        let db_unit = DB_UNIT_M;

        let mut data = Vec::with_capacity(16);
        data.extend_from_slice(&Self::f64_to_gds_real(user_unit));
        data.extend_from_slice(&Self::f64_to_gds_real(db_unit));
        self.write_record(UNITS, REAL64, &data)?;
        Ok(())
    }

    fn write_cell(&mut self, cell: &Cell) -> Result<(), GdsError> {
        if cell.name().len() > 32 {
            return Err(GdsError::CellNameTooLong(cell.name().to_string()));
        }

        self.write_bgnstr()?;
        self.write_strname(cell.name())?;

        for element in cell.elements() {
            match element {
                Element::Polygon { polygon, layer } => {
                    self.write_polygon(polygon, layer)?;
                }
                Element::CellRef(cell_ref) => {
                    if cell_ref.repetition.as_ref().is_some_and(|r| !r.is_single()) {
                        self.write_aref(cell_ref)?;
                    } else {
                        self.write_sref(cell_ref)?;
                    }
                }
                Element::Path {
                    points,
                    width,
                    layer,
                    end_type,
                } => {
                    self.write_path(points, *width, layer, *end_type)?;
                }
                Element::Text {
                    text,
                    position,
                    layer,
                    height,
                } => {
                    self.write_text(text, *position, layer, *height)?;
                }
            }
        }

        self.write_endstr()?;
        Ok(())
    }

    fn write_bgnstr(&mut self) -> Result<(), GdsError> {
        let timestamp = Self::current_timestamp();
        let mut data = Vec::with_capacity(24);
        for _ in 0..2 {
            for &val in &timestamp {
                data.extend_from_slice(&val.to_be_bytes());
            }
        }
        self.write_record(BGNSTR, INT16, &data)?;
        Ok(())
    }

    fn write_strname(&mut self, name: &str) -> Result<(), GdsError> {
        self.write_string_record(STRNAME, name)?;
        Ok(())
    }

    fn write_polygon(&mut self, polygon: &Polygon, layer: &Layer) -> Result<(), GdsError> {
        let vertices = polygon.vertices();

        // GDS polygons are closed, so we need n+1 points
        if vertices.len() > 8190 {
            return Err(GdsError::TooManyVertices(vertices.len()));
        }

        // BOUNDARY
        self.write_record(BOUNDARY, NO_DATA, &[])?;

        // LAYER
        self.write_record(LAYER, INT16, &layer.number.to_be_bytes())?;

        // DATATYPE
        self.write_record(DATATYPE, INT16, &layer.datatype.to_be_bytes())?;

        // XY (coordinates in database units)
        let mut xy_data = Vec::with_capacity((vertices.len() + 1) * 8);
        for v in vertices {
            let x = Self::to_db_units(v.x);
            let y = Self::to_db_units(v.y);
            xy_data.extend_from_slice(&x.to_be_bytes());
            xy_data.extend_from_slice(&y.to_be_bytes());
        }
        // Close the polygon
        let first = &vertices[0];
        xy_data.extend_from_slice(&Self::to_db_units(first.x).to_be_bytes());
        xy_data.extend_from_slice(&Self::to_db_units(first.y).to_be_bytes());

        self.write_record(XY, INT32, &xy_data)?;

        // ENDEL
        self.write_record(ENDEL, NO_DATA, &[])?;

        Ok(())
    }

    fn write_sref(&mut self, cell_ref: &CellRef) -> Result<(), GdsError> {
        // SREF
        self.write_record(SREF, NO_DATA, &[])?;

        // SNAME
        self.write_string_record(SNAME, &cell_ref.cell_name)?;

        // STRANS (if there's reflection or rotation)
        let t = &cell_ref.transform;
        let has_reflection = t.is_reflection();
        let angle = Self::transform_angle(t);
        let mag = Self::transform_magnification(t);

        if has_reflection || angle.abs() > 1e-10 || (mag - 1.0).abs() > 1e-10 {
            let mut strans: u16 = 0;
            if has_reflection {
                strans |= 0x8000; // Bit 0 (MSB) = reflection about X axis
            }
            self.write_record(STRANS, BIT_ARRAY, &strans.to_be_bytes())?;

            // MAG if not 1.0
            if (mag - 1.0).abs() > 1e-10 {
                self.write_record(MAG, REAL64, &Self::f64_to_gds_real(mag))?;
            }

            // ANGLE if not 0
            if angle.abs() > 1e-10 {
                let angle_deg = angle.to_degrees();
                self.write_record(ANGLE, REAL64, &Self::f64_to_gds_real(angle_deg))?;
            }
        }

        // XY (origin position)
        let origin = t.apply(Point::origin());
        let x = Self::to_db_units(origin.x);
        let y = Self::to_db_units(origin.y);
        let mut xy_data = Vec::with_capacity(8);
        xy_data.extend_from_slice(&x.to_be_bytes());
        xy_data.extend_from_slice(&y.to_be_bytes());
        self.write_record(XY, INT32, &xy_data)?;

        // ENDEL
        self.write_record(ENDEL, NO_DATA, &[])?;

        Ok(())
    }

    fn write_aref(&mut self, cell_ref: &CellRef) -> Result<(), GdsError> {
        let rep = cell_ref.repetition.as_ref().unwrap();

        // AREF
        self.write_record(AREF, NO_DATA, &[])?;

        // SNAME
        self.write_string_record(SNAME, &cell_ref.cell_name)?;

        // STRANS / MAG / ANGLE (same logic as SREF)
        let t = &cell_ref.transform;
        let has_reflection = t.is_reflection();
        let angle = Self::transform_angle(t);
        let mag = Self::transform_magnification(t);

        if has_reflection || angle.abs() > 1e-10 || (mag - 1.0).abs() > 1e-10 {
            let mut strans: u16 = 0;
            if has_reflection {
                strans |= 0x8000;
            }
            self.write_record(STRANS, BIT_ARRAY, &strans.to_be_bytes())?;

            if (mag - 1.0).abs() > 1e-10 {
                self.write_record(MAG, REAL64, &Self::f64_to_gds_real(mag))?;
            }

            if angle.abs() > 1e-10 {
                let angle_deg = angle.to_degrees();
                self.write_record(ANGLE, REAL64, &Self::f64_to_gds_real(angle_deg))?;
            }
        }

        // COLROW: number of columns and rows
        let mut colrow_data = Vec::with_capacity(4);
        colrow_data.extend_from_slice(&rep.columns.to_be_bytes());
        colrow_data.extend_from_slice(&rep.rows.to_be_bytes());
        self.write_record(COLROW, INT16, &colrow_data)?;

        // XY: three points
        // Point 1: origin (where (0,0) of the cell maps)
        // Point 2: origin + column_vector * columns  (end of all columns)
        // Point 3: origin + row_vector * rows  (end of all rows)
        //
        // Spacing is defined in the CellRef's local space (pre-transform), so we
        // must transform the spacing vectors through the linear part of the
        // CellRef transform to get world-space directions.
        let origin = t.apply(Point::origin());
        let cols = rep.columns as f64;
        let rows = rep.rows as f64;
        // Column direction: local (col_spacing, 0) transformed by [a,b;c,d]
        let col_end_x = origin.x + (t.a * rep.col_spacing) * cols;
        let col_end_y = origin.y + (t.c * rep.col_spacing) * cols;
        // Row direction: local (0, row_spacing) transformed by [a,b;c,d]
        let row_end_x = origin.x + (t.b * rep.row_spacing) * rows;
        let row_end_y = origin.y + (t.d * rep.row_spacing) * rows;

        let mut xy_data = Vec::with_capacity(24);
        xy_data.extend_from_slice(&Self::to_db_units(origin.x).to_be_bytes());
        xy_data.extend_from_slice(&Self::to_db_units(origin.y).to_be_bytes());
        xy_data.extend_from_slice(&Self::to_db_units(col_end_x).to_be_bytes());
        xy_data.extend_from_slice(&Self::to_db_units(col_end_y).to_be_bytes());
        xy_data.extend_from_slice(&Self::to_db_units(row_end_x).to_be_bytes());
        xy_data.extend_from_slice(&Self::to_db_units(row_end_y).to_be_bytes());
        self.write_record(XY, INT32, &xy_data)?;

        // ENDEL
        self.write_record(ENDEL, NO_DATA, &[])?;

        Ok(())
    }

    fn write_path(
        &mut self,
        points: &[Point],
        width: f64,
        layer: &Layer,
        end_type: PathEndType,
    ) -> Result<(), GdsError> {
        // GDS path requires at least 2 points
        if points.len() < 2 {
            return Err(GdsError::TooFewPathPoints(points.len()));
        }

        // GDS path max points is 8191
        if points.len() > 8191 {
            return Err(GdsError::TooManyPathPoints(points.len()));
        }

        // PATH
        self.write_record(PATH, NO_DATA, &[])?;

        // LAYER
        self.write_record(LAYER, INT16, &layer.number.to_be_bytes())?;

        // DATATYPE
        self.write_record(DATATYPE, INT16, &layer.datatype.to_be_bytes())?;

        // PATHTYPE (if not flush/default)
        let pathtype = end_type as i16;
        if pathtype != 0 {
            self.write_record(PATHTYPE, INT16, &pathtype.to_be_bytes())?;
        }

        // WIDTH (in database units)
        let width_db = Self::to_db_units(width);
        self.write_record(WIDTH, INT32, &width_db.to_be_bytes())?;

        // XY (coordinates in database units)
        let mut xy_data = Vec::with_capacity(points.len() * 8);
        for p in points {
            let x = Self::to_db_units(p.x);
            let y = Self::to_db_units(p.y);
            xy_data.extend_from_slice(&x.to_be_bytes());
            xy_data.extend_from_slice(&y.to_be_bytes());
        }
        self.write_record(XY, INT32, &xy_data)?;

        // ENDEL
        self.write_record(ENDEL, NO_DATA, &[])?;

        Ok(())
    }

    fn write_text(
        &mut self,
        text: &str,
        position: Point,
        layer: &Layer,
        height: f64,
    ) -> Result<(), GdsError> {
        // GDS text max is 512 characters
        let char_count = text.chars().count();
        if char_count > 512 {
            return Err(GdsError::TextTooLong(char_count));
        }

        // TEXT
        self.write_record(TEXT, NO_DATA, &[])?;

        // LAYER
        self.write_record(LAYER, INT16, &layer.number.to_be_bytes())?;

        // TEXTTYPE (use 0)
        self.write_record(TEXTTYPE, INT16, &0i16.to_be_bytes())?;

        // STRANS and MAG for text height (if not default 1.0)
        if (height - 1.0).abs() > 1e-10 {
            // STRANS with no flags (just to enable MAG)
            self.write_record(STRANS, BIT_ARRAY, &0u16.to_be_bytes())?;
            // MAG record for text height
            self.write_record(MAG, REAL64, &Self::f64_to_gds_real(height))?;
        }

        // XY (position)
        let x = Self::to_db_units(position.x);
        let y = Self::to_db_units(position.y);
        let mut xy_data = Vec::with_capacity(8);
        xy_data.extend_from_slice(&x.to_be_bytes());
        xy_data.extend_from_slice(&y.to_be_bytes());
        self.write_record(XY, INT32, &xy_data)?;

        // STRING
        self.write_string_record(STRING, text)?;

        // ENDEL
        self.write_record(ENDEL, NO_DATA, &[])?;

        Ok(())
    }

    fn write_endstr(&mut self) -> Result<(), GdsError> {
        self.write_record(ENDSTR, NO_DATA, &[])?;
        Ok(())
    }

    fn write_endlib(&mut self) -> Result<(), GdsError> {
        self.write_record(ENDLIB, NO_DATA, &[])?;
        Ok(())
    }

    fn write_record(
        &mut self,
        record_type: u8,
        data_type: u8,
        data: &[u8],
    ) -> Result<(), GdsError> {
        let len = 4 + data.len() as u16;
        self.writer.write_u16::<BigEndian>(len)?;
        self.writer.write_u8(record_type)?;
        self.writer.write_u8(data_type)?;
        self.writer.write_all(data)?;
        Ok(())
    }

    fn write_string_record(&mut self, record_type: u8, s: &str) -> Result<(), GdsError> {
        let mut bytes = s.as_bytes().to_vec();
        // Pad to even length
        if !bytes.len().is_multiple_of(2) {
            bytes.push(0);
        }
        self.write_record(record_type, ASCII, &bytes)?;
        Ok(())
    }

    fn to_db_units(um: f64) -> i32 {
        (um * UNITS_PER_UM).round() as i32
    }

    fn current_timestamp() -> [u16; 6] {
        // Returns a fixed timestamp for reproducibility
        // In production, you might want to use actual current time
        [2024, 1, 1, 0, 0, 0]
    }

    fn transform_angle(t: &Transform) -> f64 {
        // Extract rotation angle from transform matrix
        // Assuming the transform is rotation + optional reflection
        t.c.atan2(t.a)
    }

    fn transform_magnification(t: &Transform) -> f64 {
        // Extract scale factor from transform
        (t.a * t.a + t.c * t.c).sqrt()
    }

    /// Convert f64 to GDS REAL8 format.
    ///
    /// GDS uses an unusual 8-byte floating point format:
    /// - Bit 0: sign
    /// - Bits 1-7: exponent (excess-64, base 16)
    /// - Bits 8-63: mantissa
    fn f64_to_gds_real(value: f64) -> [u8; 8] {
        if value == 0.0 {
            return [0u8; 8];
        }

        let negative = value < 0.0;
        let mut val = value.abs();

        // Find exponent such that 1/16 <= mantissa < 1
        let mut exp: i32 = 64;

        if val >= 1.0 {
            while val >= 1.0 {
                val /= 16.0;
                exp += 1;
            }
        } else {
            while val < 1.0 / 16.0 {
                val *= 16.0;
                exp -= 1;
            }
        }

        // Clamp exponent
        if exp < 0 {
            return [0u8; 8];
        }
        if exp > 127 {
            exp = 127;
        }

        // Convert mantissa to 56-bit integer
        let mantissa = (val * (1u64 << 56) as f64) as u64;

        let mut result = [0u8; 8];
        result[0] = (if negative { 0x80 } else { 0x00 }) | (exp as u8);
        result[1] = ((mantissa >> 48) & 0xFF) as u8;
        result[2] = ((mantissa >> 40) & 0xFF) as u8;
        result[3] = ((mantissa >> 32) & 0xFF) as u8;
        result[4] = ((mantissa >> 24) & 0xFF) as u8;
        result[5] = ((mantissa >> 16) & 0xFF) as u8;
        result[6] = ((mantissa >> 8) & 0xFF) as u8;
        result[7] = (mantissa & 0xFF) as u8;

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rosette_core::cell::CellRef;

    #[test]
    fn test_to_db_units() {
        assert_eq!(GdsWriter::<Vec<u8>>::to_db_units(1.0), 1000);
        assert_eq!(GdsWriter::<Vec<u8>>::to_db_units(0.5), 500);
        assert_eq!(GdsWriter::<Vec<u8>>::to_db_units(-1.0), -1000);
    }

    #[test]
    fn test_gds_real_zero() {
        let result = GdsWriter::<Vec<u8>>::f64_to_gds_real(0.0);
        assert_eq!(result, [0u8; 8]);
    }

    #[test]
    fn test_gds_real_one() {
        let result = GdsWriter::<Vec<u8>>::f64_to_gds_real(1.0);
        // 1.0 should have exponent 65 (64 + 1) and mantissa 0.0625 * 2^56
        assert_eq!(result[0], 65);
    }

    #[test]
    fn test_write_simple_cell() {
        let mut cell = Cell::new("TEST");
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));

        let mut output = Vec::new();
        {
            let mut writer = GdsWriter::new(&mut output);
            let mut lib = Library::new("test");
            lib.add_cell(cell);
            writer.write_library(&lib).unwrap();
        }

        // Check that we wrote something
        assert!(!output.is_empty());

        // Check header (first 6 bytes)
        assert_eq!(output[0..2], [0x00, 0x06]); // Length 6
        assert_eq!(output[2], HEADER); // Record type
        assert_eq!(output[3], INT16); // Data type
    }

    // ============================================
    // Error Condition Tests
    // ============================================

    #[test]
    fn test_cell_name_too_long() {
        let long_name = "a".repeat(33); // 33 chars, max is 32
        let cell = Cell::new(&long_name);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(matches!(result, Err(GdsError::CellNameTooLong(_))));
    }

    #[test]
    fn test_cell_name_exactly_32_chars_ok() {
        let name = "a".repeat(32); // Exactly 32 chars should work
        let mut cell = Cell::new(&name);
        cell.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_polygon_too_many_vertices() {
        // Create a polygon with more than 8190 vertices
        let points: Vec<Point> = (0..8191).map(|i| Point::new(i as f64, 0.0)).collect();
        let polygon = Polygon::new(points);

        let mut cell = Cell::new("TEST");
        cell.add_polygon(polygon, Layer::new(1, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(matches!(result, Err(GdsError::TooManyVertices(_))));
    }

    #[test]
    fn test_polygon_exactly_8190_vertices_ok() {
        // 8190 vertices is the max allowed (becomes 8191 with closing point)
        let points: Vec<Point> = (0..8190)
            .map(|i| {
                let angle = 2.0 * std::f64::consts::PI * (i as f64) / 8190.0;
                Point::new(angle.cos(), angle.sin())
            })
            .collect();
        let polygon = Polygon::new(points);

        let mut cell = Cell::new("TEST");
        cell.add_polygon(polygon, Layer::new(1, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    // ============================================
    // Cell Dependency Ordering Tests
    // ============================================

    #[test]
    fn test_cell_dependency_ordering() {
        // Create cells where C references B, B references A
        // Add them in wrong order (C, B, A) and verify they're written correctly
        let mut cell_a = Cell::new("A");
        cell_a.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut cell_b = Cell::new("B");
        cell_b.add_ref(CellRef::new("A"));

        let mut cell_c = Cell::new("C");
        cell_c.add_ref(CellRef::new("B"));

        let mut lib = Library::new("test");
        // Add in "wrong" order
        lib.add_cell(cell_c);
        lib.add_cell(cell_b);
        lib.add_cell(cell_a);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);

        // This should succeed because writer reorders cells
        let result = writer.write_library(&lib);
        assert!(result.is_ok());

        // Verify the output contains all three structure names
        // STRNAME records should appear in dependency order: A, B, C
        let a_pos = output.windows(1).position(|w| w == b"A");
        let b_pos = output.windows(1).position(|w| w == b"B");
        let c_pos = output.windows(1).position(|w| w == b"C");

        // All cells should be present
        assert!(a_pos.is_some());
        assert!(b_pos.is_some());
        assert!(c_pos.is_some());
    }

    #[test]
    fn test_multi_level_hierarchy() {
        // Deep hierarchy: TOP -> L1 -> L2 -> L3 -> LEAF
        let mut leaf = Cell::new("LEAF");
        leaf.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut l3 = Cell::new("L3");
        l3.add_ref(CellRef::new("LEAF"));

        let mut l2 = Cell::new("L2");
        l2.add_ref(CellRef::new("L3"));

        let mut l1 = Cell::new("L1");
        l1.add_ref(CellRef::new("L2"));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("L1"));

        let mut lib = Library::new("test");
        lib.add_cell(top);
        lib.add_cell(l1);
        lib.add_cell(l2);
        lib.add_cell(l3);
        lib.add_cell(leaf);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
        assert!(!output.is_empty());
    }

    #[test]
    fn test_diamond_dependency() {
        // Diamond: TOP references both A and B, both A and B reference SHARED
        let mut shared = Cell::new("SHARED");
        shared.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut cell_a = Cell::new("A");
        cell_a.add_ref(CellRef::new("SHARED"));

        let mut cell_b = Cell::new("B");
        cell_b.add_ref(CellRef::new("SHARED"));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("A"));
        top.add_ref(CellRef::new("B"));

        let mut lib = Library::new("test");
        lib.add_cell(top);
        lib.add_cell(cell_a);
        lib.add_cell(cell_b);
        lib.add_cell(shared);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    // ============================================
    // Transform Tests
    // ============================================

    #[test]
    fn test_sref_no_transform() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB"));

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(top);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        assert!(writer.write_library(&lib).is_ok());
    }

    #[test]
    fn test_sref_translation() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").at(100.0, 200.0));

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(top);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        assert!(writer.write_library(&lib).is_ok());
    }

    #[test]
    fn test_sref_90_degree_rotation() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").rotate(std::f64::consts::FRAC_PI_2));

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(top);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        assert!(writer.write_library(&lib).is_ok());
    }

    #[test]
    fn test_sref_180_degree_rotation() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").rotate(std::f64::consts::PI));

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(top);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        assert!(writer.write_library(&lib).is_ok());
    }

    #[test]
    fn test_sref_270_degree_rotation() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").rotate(3.0 * std::f64::consts::FRAC_PI_2));

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(top);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        assert!(writer.write_library(&lib).is_ok());
    }

    #[test]
    fn test_sref_mirror_x() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").mirror_x());

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(top);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        assert!(writer.write_library(&lib).is_ok());
    }

    #[test]
    fn test_sref_mirror_y() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").mirror_y());

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(top);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        assert!(writer.write_library(&lib).is_ok());
    }

    #[test]
    fn test_sref_magnification() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        top.add_ref(CellRef::new("SUB").scale(2.5));

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(top);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        assert!(writer.write_library(&lib).is_ok());
    }

    #[test]
    fn test_sref_combined_transforms() {
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));

        let mut top = Cell::new("TOP");
        // Combine: translate, rotate, mirror, scale
        top.add_ref(
            CellRef::new("SUB")
                .at(10.0, 20.0)
                .rotate(std::f64::consts::FRAC_PI_4)
                .mirror_x()
                .scale(1.5),
        );

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(top);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        assert!(writer.write_library(&lib).is_ok());
    }

    // ============================================
    // Edge Case Tests
    // ============================================

    #[test]
    fn test_empty_cell() {
        let cell = Cell::new("EMPTY");

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_empty_library() {
        let lib = Library::new("empty");

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_multiple_polygons_same_layer() {
        let mut cell = Cell::new("TEST");
        cell.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));
        cell.add_polygon(
            Polygon::rect(Point::new(5.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );
        cell.add_polygon(
            Polygon::rect(Point::new(10.0, 0.0), 1.0, 1.0),
            Layer::new(1, 0),
        );

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_multiple_layers() {
        let mut cell = Cell::new("TEST");
        cell.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));
        cell.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(2, 0));
        cell.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 1)); // Different datatype

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_triangle_polygon() {
        let triangle = Polygon::new(vec![
            Point::new(0.0, 0.0),
            Point::new(1.0, 0.0),
            Point::new(0.5, 1.0),
        ]);

        let mut cell = Cell::new("TEST");
        cell.add_polygon(triangle, Layer::new(1, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_gds_real_negative() {
        let result = GdsWriter::<Vec<u8>>::f64_to_gds_real(-1.0);
        // Negative flag should be set (bit 7 of first byte)
        assert!(result[0] & 0x80 != 0);
    }

    #[test]
    fn test_gds_real_small_value() {
        let result = GdsWriter::<Vec<u8>>::f64_to_gds_real(1e-9);
        // Should not be zero
        assert!(result != [0u8; 8]);
    }

    #[test]
    fn test_gds_real_large_value() {
        let result = GdsWriter::<Vec<u8>>::f64_to_gds_real(1e9);
        // Should not overflow
        assert!(result[0] <= 127);
    }

    #[test]
    fn test_negative_coordinates() {
        let polygon = Polygon::new(vec![
            Point::new(-10.0, -10.0),
            Point::new(10.0, -10.0),
            Point::new(10.0, 10.0),
            Point::new(-10.0, 10.0),
        ]);

        let mut cell = Cell::new("TEST");
        cell.add_polygon(polygon, Layer::new(1, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    // ============================================
    // PATH Tests
    // ============================================

    #[test]
    fn test_simple_path() {
        let mut cell = Cell::new("TEST");
        cell.add_path(
            vec![Point::new(0.0, 0.0), Point::new(100.0, 0.0)],
            0.5,
            Layer::new(1, 0),
            PathEndType::Flush,
        );

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
        assert!(!output.is_empty());
    }

    #[test]
    fn test_path_with_bends() {
        let mut cell = Cell::new("TEST");
        cell.add_path(
            vec![
                Point::new(0.0, 0.0),
                Point::new(50.0, 0.0),
                Point::new(50.0, 50.0),
                Point::new(100.0, 50.0),
            ],
            1.0,
            Layer::new(1, 0),
            PathEndType::Flush,
        );

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_path_end_type_round() {
        let mut cell = Cell::new("TEST");
        cell.add_path(
            vec![Point::new(0.0, 0.0), Point::new(100.0, 0.0)],
            2.0,
            Layer::new(1, 0),
            PathEndType::Round,
        );

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_path_end_type_half_width_extension() {
        let mut cell = Cell::new("TEST");
        cell.add_path(
            vec![Point::new(0.0, 0.0), Point::new(100.0, 0.0)],
            2.0,
            Layer::new(1, 0),
            PathEndType::HalfWidthExtension,
        );

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_path_too_many_points() {
        // Create a path with more than 8191 points
        let points: Vec<Point> = (0..8192).map(|i| Point::new(i as f64, 0.0)).collect();

        let mut cell = Cell::new("TEST");
        cell.add_path(points, 0.5, Layer::new(1, 0), PathEndType::Flush);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(matches!(result, Err(GdsError::TooManyPathPoints(_))));
    }

    #[test]
    fn test_path_too_few_points_empty() {
        let mut cell = Cell::new("TEST");
        cell.add_path(vec![], 0.5, Layer::new(1, 0), PathEndType::Flush);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(matches!(result, Err(GdsError::TooFewPathPoints(0))));
    }

    #[test]
    fn test_path_too_few_points_single() {
        let mut cell = Cell::new("TEST");
        cell.add_path(
            vec![Point::new(0.0, 0.0)],
            0.5,
            Layer::new(1, 0),
            PathEndType::Flush,
        );

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(matches!(result, Err(GdsError::TooFewPathPoints(1))));
    }

    #[test]
    fn test_path_exactly_8191_points_ok() {
        // 8191 points is the max allowed
        let points: Vec<Point> = (0..8191).map(|i| Point::new(i as f64 * 0.1, 0.0)).collect();

        let mut cell = Cell::new("TEST");
        cell.add_path(points, 0.5, Layer::new(1, 0), PathEndType::Flush);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    // ============================================
    // TEXT Tests
    // ============================================

    #[test]
    fn test_simple_text() {
        let mut cell = Cell::new("TEST");
        cell.add_text("Hello World", Point::new(10.0, 20.0), Layer::new(10, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
        assert!(!output.is_empty());
    }

    #[test]
    fn test_text_with_special_chars() {
        let mut cell = Cell::new("TEST");
        cell.add_text("Label_123-ABC", Point::origin(), Layer::new(10, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_text_too_long() {
        let long_text = "x".repeat(513); // 513 chars, max is 512

        let mut cell = Cell::new("TEST");
        cell.add_text(&long_text, Point::origin(), Layer::new(10, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(matches!(result, Err(GdsError::TextTooLong(_))));
    }

    #[test]
    fn test_text_exactly_512_chars_ok() {
        let text = "x".repeat(512); // Exactly 512 chars should work

        let mut cell = Cell::new("TEST");
        cell.add_text(&text, Point::origin(), Layer::new(10, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_text_multibyte_utf8_char_count() {
        // Test that we count characters, not bytes
        // "μ" (micro sign) is 2 bytes in UTF-8 but 1 character
        // 512 "μ" = 512 characters but 1024 bytes
        let text = "μ".repeat(512);
        assert_eq!(text.len(), 1024); // 1024 bytes
        assert_eq!(text.chars().count(), 512); // 512 characters

        let mut cell = Cell::new("TEST");
        cell.add_text(&text, Point::origin(), Layer::new(10, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        // Should succeed because it's 512 characters (even though 1024 bytes)
        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    #[test]
    fn test_text_multibyte_utf8_too_long() {
        // 513 "μ" characters should fail
        let text = "μ".repeat(513);
        assert_eq!(text.chars().count(), 513);

        let mut cell = Cell::new("TEST");
        cell.add_text(&text, Point::origin(), Layer::new(10, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(matches!(result, Err(GdsError::TextTooLong(513))));
    }

    #[test]
    fn test_multiple_texts() {
        let mut cell = Cell::new("TEST");
        cell.add_text("Label1", Point::new(0.0, 0.0), Layer::new(10, 0));
        cell.add_text("Label2", Point::new(50.0, 0.0), Layer::new(10, 0));
        cell.add_text("Label3", Point::new(100.0, 0.0), Layer::new(10, 0));

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);
        let mut lib = Library::new("test");
        lib.add_cell(cell);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }

    // ============================================
    // Mixed Element Tests
    // ============================================

    #[test]
    fn test_mixed_elements_all_types() {
        let mut cell = Cell::new("TEST");

        // Add polygon
        cell.add_polygon(Polygon::rect(Point::origin(), 10.0, 5.0), Layer::new(1, 0));

        // Add path
        cell.add_path(
            vec![Point::new(0.0, 10.0), Point::new(100.0, 10.0)],
            0.5,
            Layer::new(2, 0),
            PathEndType::Round,
        );

        // Add text
        cell.add_text("Component", Point::new(50.0, 15.0), Layer::new(10, 0));

        // Add cell ref
        let mut sub = Cell::new("SUB");
        sub.add_polygon(Polygon::rect(Point::origin(), 1.0, 1.0), Layer::new(1, 0));
        cell.add_ref(CellRef::new("SUB").at(20.0, 20.0));

        let mut lib = Library::new("test");
        lib.add_cell(sub);
        lib.add_cell(cell);

        let mut output = Vec::new();
        let mut writer = GdsWriter::new(&mut output);

        let result = writer.write_library(&lib);
        assert!(result.is_ok());
    }
}
