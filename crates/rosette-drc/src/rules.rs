//! DRC rule definitions and builder.

use rosette_core::Layer;

/// Internal representation of a DRC rule.
#[derive(Debug, Clone)]
pub enum Rule {
    /// Minimum width for polygons on a layer.
    MinWidth {
        layer: Layer,
        width: f64,
        name: Option<String>,
    },
    /// Minimum spacing between polygons.
    MinSpacing {
        layer1: Layer,
        layer2: Layer,
        spacing: f64,
        name: Option<String>,
    },
    /// Minimum area for polygons on a layer.
    MinArea {
        layer: Layer,
        area: f64,
        name: Option<String>,
    },
    /// Inner layer must be enclosed by outer layer.
    Enclosure {
        inner: Layer,
        outer: Layer,
        enclosure: f64,
        name: Option<String>,
    },
    /// Two layers must overlap.
    RequireOverlap {
        layer1: Layer,
        layer2: Layer,
        name: Option<String>,
    },
    /// Two layers must not overlap.
    ForbidOverlap {
        layer1: Layer,
        layer2: Layer,
        name: Option<String>,
    },
    /// Only allow specific edge angles.
    AllowedAngles {
        layer: Layer,
        allowed_angles: Vec<f64>,
        name: Option<String>,
    },
    /// Minimum edge length for polygons on a layer.
    MinEdgeLength {
        layer: Layer,
        length: f64,
        name: Option<String>,
    },
    /// Check polygons for self-intersection on a layer.
    SelfIntersection { layer: Layer, name: Option<String> },
    /// Maximum width for polygons on a layer.
    MaxWidth {
        layer: Layer,
        width: f64,
        name: Option<String>,
    },
    /// Verify all vertex coordinates are on the manufacturing grid.
    SnapToGrid {
        layer: Layer,
        /// Grid pitch in user units (e.g. 0.001 for 1nm grid).
        grid_pitch: f64,
        name: Option<String>,
    },
    /// Flag convex vertices whose interior angle is below a threshold.
    AcuteAngle {
        layer: Layer,
        /// Minimum allowed interior angle (degrees). Typical: 60.0.
        threshold_deg: f64,
        name: Option<String>,
    },
    /// Inner layer must not be fully contained inside outer layer.
    ///
    /// Defines an "exclusion zone": polygons on `inner` that sit entirely
    /// inside `outer` (or inside the union of `outer` polygons) are flagged.
    /// Partial crossings are not a violation — the inner polygon must be
    /// wholly inside for the rule to trigger.
    NotInside {
        inner: Layer,
        outer: Layer,
        name: Option<String>,
    },
    /// Layer area-density check (CMP uniformity).
    ///
    /// Tiles the layout with a sliding window of `window` x `window` across
    /// a region (either the union of `region_layer` polygons or, if that is
    /// `None`, the bounding box of all placed geometry in the design)
    /// stepping by `step` between window positions. For each window, the
    /// area fraction covered by `layer` is computed and compared against
    /// the `[min, max]` range. Windows that don't fully fit inside the
    /// region are skipped.
    ///
    /// If the design contains no geometry at all, density is undefined and
    /// the check is skipped silently. Declare a `region_layer` if you need
    /// density measured over an explicit floor-plan extent that may contain
    /// empty regions.
    ///
    /// At least one of `min` or `max` must be `Some`.
    Density {
        layer: Layer,
        /// Minimum required density fraction (0.0..=1.0). `None` = no lower bound.
        min: Option<f64>,
        /// Maximum allowed density fraction (0.0..=1.0). `None` = no upper bound.
        max: Option<f64>,
        /// Window side length (design units).
        window: f64,
        /// Step between window positions (design units). Typically `<= window`.
        step: f64,
        /// Optional region layer. If `Some`, the union of polygons on this
        /// layer defines the region over which density is measured. If
        /// `None`, the bounding box of all placed geometry in the design
        /// is used.
        region_layer: Option<Layer>,
        name: Option<String>,
    },
}

/// Builder for DRC rule sets.
///
/// # Example
///
/// ```
/// use rosette_core::Layer;
/// use rosette_drc::DrcRules;
///
/// let rules = DrcRules::new()
///     .min_width(Layer::new(1, 0), 0.1, Some("M1.W.1"))
///     .min_spacing(Layer::new(1, 0), Layer::new(1, 0), 0.15, None)
///     .min_area(Layer::new(1, 0), 0.01, None);
/// ```
#[derive(Debug, Clone, Default)]
pub struct DrcRules {
    rules: Vec<Rule>,
    /// Optional global warning margin, in user units (typically µm).
    ///
    /// When set, near-threshold violations on length-based numeric rules
    /// (`MinWidth`, `MinSpacing`, `Enclosure`, `MinEdgeLength`, `MaxWidth`)
    /// are reported as [`crate::Severity::Warning`] instead of
    /// [`crate::Severity::Error`]. A violation is "near-threshold" when the
    /// measured value is within `warning_margin` of the required threshold.
    ///
    /// `MinArea` is intentionally excluded since its threshold is in squared
    /// units.
    ///
    /// `None` (the default) preserves legacy behavior: every violation is
    /// reported as an error.
    warning_margin: Option<f64>,
}

impl DrcRules {
    /// Create a new empty rule set.
    pub fn new() -> Self {
        Self::default()
    }

    /// Get all configured rules.
    pub fn rules(&self) -> &[Rule] {
        &self.rules
    }

    /// Configured warning margin, if any. See [`Self::warning_margin`].
    pub fn warning_margin_value(&self) -> Option<f64> {
        self.warning_margin
    }

    /// Set a global warning margin (in user units, typically µm).
    ///
    /// When a length-based numeric threshold rule is violated but the
    /// measured value is within this margin of the required threshold, the
    /// resulting violation is downgraded from [`crate::Severity::Error`] to
    /// [`crate::Severity::Warning`].
    ///
    /// For example, with `min_width = 0.12` and `warning_margin = 0.01`:
    ///
    /// - width `< 0.11` → error
    /// - width in `[0.11, 0.12)` → warning
    /// - width `>= 0.12` → no violation
    ///
    /// Applies to `MinWidth`, `MinSpacing`, `Enclosure`, `MinEdgeLength`, and
    /// `MaxWidth` — all of which compare in length units.
    ///
    /// **Excluded:** `MinArea` thresholds are in *squared* user units, which
    /// are not commensurate with a length-unit margin; they remain strict
    /// errors. Categorical rules (angles, overlap, self-intersection,
    /// snap-to-grid, not-inside, acute-angle) are also unaffected.
    ///
    /// Pass a non-positive value or `0.0` to disable (behaves as `None`).
    pub fn warning_margin(mut self, margin: f64) -> Self {
        self.warning_margin = if margin > 0.0 { Some(margin) } else { None };
        self
    }

    /// Add a minimum width rule for polygons on a layer.
    pub fn min_width(mut self, layer: impl Into<Layer>, width: f64, name: Option<&str>) -> Self {
        self.rules.push(Rule::MinWidth {
            layer: layer.into(),
            width,
            name: name.map(String::from),
        });
        self
    }

    /// Add a minimum spacing rule between polygons on two layers.
    ///
    /// Use the same layer for both to check spacing within a layer.
    pub fn min_spacing(
        mut self,
        layer1: impl Into<Layer>,
        layer2: impl Into<Layer>,
        spacing: f64,
        name: Option<&str>,
    ) -> Self {
        self.rules.push(Rule::MinSpacing {
            layer1: layer1.into(),
            layer2: layer2.into(),
            spacing,
            name: name.map(String::from),
        });
        self
    }

    /// Add a minimum area rule for polygons on a layer.
    pub fn min_area(mut self, layer: impl Into<Layer>, area: f64, name: Option<&str>) -> Self {
        self.rules.push(Rule::MinArea {
            layer: layer.into(),
            area,
            name: name.map(String::from),
        });
        self
    }

    /// Add an enclosure rule requiring inner layer to be enclosed by outer layer.
    pub fn min_enclosure(
        mut self,
        inner: impl Into<Layer>,
        outer: impl Into<Layer>,
        enclosure: f64,
        name: Option<&str>,
    ) -> Self {
        self.rules.push(Rule::Enclosure {
            inner: inner.into(),
            outer: outer.into(),
            enclosure,
            name: name.map(String::from),
        });
        self
    }

    /// Add a rule requiring overlap between two layers.
    pub fn require_overlap(
        mut self,
        layer1: impl Into<Layer>,
        layer2: impl Into<Layer>,
        name: Option<&str>,
    ) -> Self {
        self.rules.push(Rule::RequireOverlap {
            layer1: layer1.into(),
            layer2: layer2.into(),
            name: name.map(String::from),
        });
        self
    }

    /// Add a rule forbidding overlap between two layers.
    pub fn forbid_overlap(
        mut self,
        layer1: impl Into<Layer>,
        layer2: impl Into<Layer>,
        name: Option<&str>,
    ) -> Self {
        self.rules.push(Rule::ForbidOverlap {
            layer1: layer1.into(),
            layer2: layer2.into(),
            name: name.map(String::from),
        });
        self
    }

    /// Add a rule restricting edge angles to specified values (in degrees).
    ///
    /// Angles are normalized to [0, 180) for comparison since edges are bidirectional.
    pub fn allowed_angles(
        mut self,
        layer: impl Into<Layer>,
        angles: &[f64],
        name: Option<&str>,
    ) -> Self {
        self.rules.push(Rule::AllowedAngles {
            layer: layer.into(),
            allowed_angles: angles.to_vec(),
            name: name.map(String::from),
        });
        self
    }

    /// Add a minimum edge length rule for polygons on a layer.
    ///
    /// Catches tiny jogs, notches, or vertices that are closer together than
    /// the lithography resolution.
    pub fn min_edge_length(
        mut self,
        layer: impl Into<Layer>,
        length: f64,
        name: Option<&str>,
    ) -> Self {
        self.rules.push(Rule::MinEdgeLength {
            layer: layer.into(),
            length,
            name: name.map(String::from),
        });
        self
    }

    /// Add a self-intersection check for polygons on a layer.
    ///
    /// Self-intersecting polygons are geometrically invalid and will be
    /// rejected by foundries.
    pub fn no_self_intersection(mut self, layer: impl Into<Layer>, name: Option<&str>) -> Self {
        self.rules.push(Rule::SelfIntersection {
            layer: layer.into(),
            name: name.map(String::from),
        });
        self
    }

    /// Add a maximum width rule for polygons on a layer.
    ///
    /// In photonics, prevents multimode waveguides by enforcing the single-mode
    /// width cutoff.
    pub fn max_width(mut self, layer: impl Into<Layer>, width: f64, name: Option<&str>) -> Self {
        self.rules.push(Rule::MaxWidth {
            layer: layer.into(),
            width,
            name: name.map(String::from),
        });
        self
    }

    /// Add a snap-to-grid check for polygons on a layer.
    ///
    /// Verifies that all vertex coordinates are integer multiples of the
    /// manufacturing grid pitch. Off-grid geometry can cause mask fracturing
    /// errors and is rejected by most foundries.
    ///
    /// Common grid pitches: 0.001 (1 nm) or 0.005 (5 nm).
    pub fn snap_to_grid(
        mut self,
        layer: impl Into<Layer>,
        grid_pitch: f64,
        name: Option<&str>,
    ) -> Self {
        self.rules.push(Rule::SnapToGrid {
            layer: layer.into(),
            grid_pitch,
            name: name.map(String::from),
        });
        self
    }

    /// Add an acute interior angle check for polygons on a layer.
    ///
    /// Flags convex vertices (where the polygon turns inward) whose interior
    /// angle is strictly less than `threshold_deg`. Reflex (concave / >180°)
    /// vertices are not reported — they represent the polygon "poking outward"
    /// and are not a lithography risk.
    ///
    /// Sharp inward corners are hard to manufacture: they round off during
    /// lithography and can cause fracturing issues. A common threshold in
    /// photonic PDKs is 60°.
    pub fn acute_angle(
        mut self,
        layer: impl Into<Layer>,
        threshold_deg: f64,
        name: Option<&str>,
    ) -> Self {
        self.rules.push(Rule::AcuteAngle {
            layer: layer.into(),
            threshold_deg,
            name: name.map(String::from),
        });
        self
    }

    /// Add a "not-inside" / exclusion zone rule.
    ///
    /// Flags polygons on `inner` that are fully contained inside the union of
    /// polygons on `outer`. Partial crossings (an `inner` polygon that crosses
    /// the boundary of an `outer` polygon) are not violations — the inner must
    /// sit wholly inside an exclusion zone for the rule to trigger.
    ///
    /// Use this for keep-out zones: "routing layer must not sit entirely inside
    /// a no-fly marker". It is distinct from `forbid_overlap`, which flags any
    /// overlap at all.
    pub fn not_inside(
        mut self,
        inner: impl Into<Layer>,
        outer: impl Into<Layer>,
        name: Option<&str>,
    ) -> Self {
        self.rules.push(Rule::NotInside {
            inner: inner.into(),
            outer: outer.into(),
            name: name.map(String::from),
        });
        self
    }

    /// Add a layer-density (CMP uniformity) check.
    ///
    /// Tiles a region with a sliding `window` × `window` square, stepping by
    /// `step`, and flags every window position where the area fraction
    /// covered by `layer` falls outside `[min, max]`. If `region_layer` is
    /// `Some`, the union of polygons on that layer defines the region;
    /// otherwise the bounding box of all placed geometry in the design is
    /// used.
    ///
    /// Foundries require density to be within a band for CMP (chemical-
    /// mechanical planarization) uniformity. Typical photonic-PDK values:
    /// silicon device layer 0.20-0.80 fill, 100 µm window.
    ///
    /// # Panics
    ///
    /// Panics if both `min` and `max` are `None` (no-op rule), if `window`
    /// is not positive, or if `step` is not positive.
    #[allow(clippy::too_many_arguments)]
    pub fn density(
        mut self,
        layer: impl Into<Layer>,
        min: Option<f64>,
        max: Option<f64>,
        window: f64,
        step: f64,
        region_layer: Option<Layer>,
        name: Option<&str>,
    ) -> Self {
        assert!(
            min.is_some() || max.is_some(),
            "density: at least one of min or max must be set"
        );
        assert!(window > 0.0, "density: window must be positive");
        assert!(step > 0.0, "density: step must be positive");
        if let (Some(lo), Some(hi)) = (min, max) {
            assert!(lo <= hi, "density: min ({lo}) must be <= max ({hi})");
        }
        self.rules.push(Rule::Density {
            layer: layer.into(),
            min,
            max,
            window,
            step,
            region_layer,
            name: name.map(String::from),
        });
        self
    }
}
