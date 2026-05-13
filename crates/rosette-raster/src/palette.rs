//! Layer color palette.
//!
//! Source of truth is `app/src/stores/palette.json`, shared with the web
//! viewer. The file is embedded at compile time via `include_str!` so the
//! Rust crate does not need a runtime path. Edit the JSON to change colors
//! everywhere.

use std::collections::HashMap;

use serde::Deserialize;

const PALETTE_JSON: &str = include_str!("../../../app/src/stores/palette.json");

#[derive(Deserialize)]
struct PaletteFile {
    colors: Vec<String>,
}

/// Layer-number → RGBA color lookup.
///
/// Resolves a color in two stages: per-layer overrides take precedence,
/// then the indexed fallback list is consulted (wrapping by layer number).
/// This lets a project's configured layer colors (from `rosette.toml`'s
/// `[layers]` section) win over the auto-assigned palette while still
/// providing sane defaults for layers the project hasn't named.
#[derive(Debug, Clone)]
pub struct Palette {
    colors: Vec<[u8; 4]>,
    overrides: HashMap<u16, [u8; 4]>,
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
        Self {
            colors,
            overrides: HashMap::new(),
        }
    }

    /// Build a custom palette from a slice of RGBA colors.
    pub fn from_colors(colors: Vec<[u8; 4]>) -> Self {
        Self {
            colors,
            overrides: HashMap::new(),
        }
    }

    /// Add per-layer color overrides. Layers not in the map fall back to
    /// the indexed palette.
    pub fn with_overrides(mut self, overrides: HashMap<u16, [u8; 4]>) -> Self {
        self.overrides.extend(overrides);
        self
    }

    /// Get the color for a layer number. Override wins; otherwise wraps
    /// the indexed palette by layer number, matching the web viewer's
    /// auto-assignment behavior.
    pub fn color_for(&self, layer_number: u16) -> [u8; 4] {
        if let Some(c) = self.overrides.get(&layer_number) {
            return *c;
        }
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
    fn override_takes_precedence_over_indexed() {
        let mut overrides = HashMap::new();
        overrides.insert(1, [0xff, 0x69, 0xb4, 0xff]); // pink
        let p = Palette::shared().with_overrides(overrides);
        assert_eq!(p.color_for(1), [0xff, 0x69, 0xb4, 0xff]);
        // Other layers still use the indexed fallback.
        assert_eq!(p.color_for(0), [0xf4, 0x43, 0x36, 0xff]); // red
    }

    #[test]
    fn parse_hex_variants() {
        assert_eq!(parse_hex_rgba("#ff0000"), Some([0xff, 0, 0, 0xff]));
        assert_eq!(parse_hex_rgba("00ff00"), Some([0, 0xff, 0, 0xff]));
        assert_eq!(parse_hex_rgba("#0000ff80"), Some([0, 0, 0xff, 0x80]));
        assert_eq!(parse_hex_rgba("not-hex"), None);
    }
}
