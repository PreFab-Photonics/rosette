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
}
