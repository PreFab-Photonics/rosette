//! Core component infrastructure for photonic layout.
//!
//! This module provides connection utilities for photonic layouts:
//!
//! - [`connect_transform`]: Calculate transforms to connect ports
//!
//! **Note:** Photonic components (waveguides, bends, MMIs, etc.) are now
//! implemented in Python as user-customizable code. See `rosette.components`
//! in Python for the component library.

mod connection;

pub use connection::connect_transform;
