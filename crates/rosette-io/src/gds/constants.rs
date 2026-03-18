//! GDS II record type and data type constants.
//!
//! These are shared between the reader and writer modules.

// GDS Record Types
pub const HEADER: u8 = 0x00;
pub const BGNLIB: u8 = 0x01;
pub const LIBNAME: u8 = 0x02;
pub const UNITS: u8 = 0x03;
pub const ENDLIB: u8 = 0x04;
pub const BGNSTR: u8 = 0x05;
pub const STRNAME: u8 = 0x06;
pub const ENDSTR: u8 = 0x07;
pub const BOUNDARY: u8 = 0x08;
pub const PATH: u8 = 0x09;
pub const SREF: u8 = 0x0A;
pub const AREF: u8 = 0x0B;
pub const TEXT: u8 = 0x0C;
pub const LAYER: u8 = 0x0D;
pub const DATATYPE: u8 = 0x0E;
pub const WIDTH: u8 = 0x0F;
pub const XY: u8 = 0x10;
pub const ENDEL: u8 = 0x11;
pub const SNAME: u8 = 0x12;
pub const COLROW: u8 = 0x13;
pub const NODE: u8 = 0x15;
pub const TEXTTYPE: u8 = 0x16;
pub const PRESENTATION: u8 = 0x17;
pub const STRING: u8 = 0x19;
pub const STRANS: u8 = 0x1A;
pub const MAG: u8 = 0x1B;
pub const ANGLE: u8 = 0x1C;
pub const PATHTYPE: u8 = 0x21;
pub const PROPATTR: u8 = 0x2B;
pub const PROPVALUE: u8 = 0x2C;
pub const BOX: u8 = 0x2D;
#[allow(dead_code)]
pub const BOXTYPE: u8 = 0x2E;

// GDS Data Types
pub const NO_DATA: u8 = 0x00;
pub const BIT_ARRAY: u8 = 0x01;
pub const INT16: u8 = 0x02;
pub const INT32: u8 = 0x03;
pub const REAL64: u8 = 0x05;
pub const ASCII: u8 = 0x06;
