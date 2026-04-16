//! Layer color palette.
//!
//! Source of truth is `app/src/stores/palette.json`, shared with the web
//! viewer. The file is embedded at compile time via `include_str!` so the
//! Rust crate does not need a runtime path. Edit the JSON to change colors
//! everywhere.

use serde::Deserialize;

const PALETTE_JSON: &str = include_str!("../../../app/src/stores/palette.json");

#[derive(Deserialize)]
struct PaletteFile {
    colors: Vec<String>,
}

/// Layer-number → RGBA color lookup.
#[derive(Debug, Clone)]
pub struct Palette {
    colors: Vec<[u8; 4]>,
}

impl Palette {
    /// Load the shared palette embedded at build time.
    pub fn shared() -> Self {
        let parsed: PaletteFile =
            serde_json::from_str(PALETTE_JSON).expect("embedded palette.json is invalid");
        let colors = parsed
            .colors
            .iter()
            .map(|hex| parse_hex_rgba(hex).expect("embedded palette has invalid hex color"))
            .collect();
        Self { colors }
    }

    /// Build a custom palette from a slice of RGBA colors.
    pub fn from_colors(colors: Vec<[u8; 4]>) -> Self {
        Self { colors }
    }

    /// Get the color for a layer number. Wraps around if the layer index
    /// exceeds the palette length, matching the web viewer's behavior.
    pub fn color_for(&self, layer_number: u16) -> [u8; 4] {
        if self.colors.is_empty() {
            return [0xff, 0xff, 0xff, 0xff];
        }
        self.colors[(layer_number as usize) % self.colors.len()]
    }
}

impl Default for Palette {
    fn default() -> Self {
        Self::shared()
    }
}

/// Parse a `#RRGGBB` or `#RRGGBBAA` hex string to RGBA bytes.
pub fn parse_hex_rgba(hex: &str) -> Option<[u8; 4]> {
    let h = hex.trim_start_matches('#');
    match h.len() {
        6 => {
            let r = u8::from_str_radix(&h[0..2], 16).ok()?;
            let g = u8::from_str_radix(&h[2..4], 16).ok()?;
            let b = u8::from_str_radix(&h[4..6], 16).ok()?;
            Some([r, g, b, 0xff])
        }
        8 => {
            let r = u8::from_str_radix(&h[0..2], 16).ok()?;
            let g = u8::from_str_radix(&h[2..4], 16).ok()?;
            let b = u8::from_str_radix(&h[4..6], 16).ok()?;
            let a = u8::from_str_radix(&h[6..8], 16).ok()?;
            Some([r, g, b, a])
        }
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shared_palette_loads() {
        let p = Palette::shared();
        let red = p.color_for(0);
        assert_eq!(red, [0xf4, 0x43, 0x36, 0xff]);
    }

    #[test]
    fn palette_wraps_on_overflow() {
        let p = Palette::shared();
        assert_eq!(p.color_for(0), p.color_for(16));
    }

    #[test]
    fn parse_hex_variants() {
        assert_eq!(parse_hex_rgba("#ff0000"), Some([0xff, 0, 0, 0xff]));
        assert_eq!(parse_hex_rgba("00ff00"), Some([0, 0xff, 0, 0xff]));
        assert_eq!(parse_hex_rgba("#0000ff80"), Some([0, 0, 0xff, 0x80]));
        assert_eq!(parse_hex_rgba("not-hex"), None);
    }
}
