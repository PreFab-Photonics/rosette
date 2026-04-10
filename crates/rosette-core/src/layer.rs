//! Layer definitions for GDS layout.
//!
//! A [`Layer`] identifies where geometry is placed in the fabrication process.

/// A GDS layer specification.
///
/// In GDS II format, geometry is placed on layers identified by:
/// - `number`: The primary layer number (0-65535)
/// - `datatype`: A secondary identifier, often used for purpose (0-65535)
///
/// Common conventions:
/// - Different materials (silicon, oxide, cladding) have different layer numbers
/// - Datatypes distinguish purposes (drawing, pin, label) on the same layer
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Layer {
    /// Layer number (0-65535).
    pub number: u16,
    /// Datatype (0-65535).
    pub datatype: u16,
}

impl Layer {
    /// Create a new layer.
    pub fn new(number: u16, datatype: u16) -> Self {
        Self { number, datatype }
    }

    /// Create a layer with datatype 0.
    pub fn from_number(number: u16) -> Self {
        Self {
            number,
            datatype: 0,
        }
    }
}

impl From<u16> for Layer {
    fn from(number: u16) -> Self {
        Self::from_number(number)
    }
}

impl From<(u16, u16)> for Layer {
    fn from((number, datatype): (u16, u16)) -> Self {
        Self::new(number, datatype)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new() {
        let layer = Layer::new(1, 0);
        assert_eq!(layer.number, 1);
        assert_eq!(layer.datatype, 0);
    }

    #[test]
    fn test_from_number() {
        let layer = Layer::from_number(5);
        assert_eq!(layer.number, 5);
        assert_eq!(layer.datatype, 0);
    }

    #[test]
    fn test_from_u16() {
        let layer: Layer = 10.into();
        assert_eq!(layer.number, 10);
        assert_eq!(layer.datatype, 0);
    }

    #[test]
    fn test_from_tuple() {
        let layer: Layer = (3, 5).into();
        assert_eq!(layer.number, 3);
        assert_eq!(layer.datatype, 5);
    }

    #[test]
    fn test_equality() {
        let l1 = Layer::new(1, 0);
        let l2 = Layer::new(1, 0);
        let l3 = Layer::new(1, 1);
        assert_eq!(l1, l2);
        assert_ne!(l1, l3);
    }
}
