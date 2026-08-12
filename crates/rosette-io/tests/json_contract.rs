use rosette_core::PathEndType;
use rosette_io::json::{from_string, to_string};

const CURRENT_LIBRARY: &str = include_str!("../../../fixtures/json/current-library.json");
const CYCLE: &str = include_str!("../../../fixtures/json/cycle.json");
const MULTI_ROOT: &str = include_str!("../../../fixtures/json/multi-root.json");

#[test]
fn current_json_wire_shape_is_stable() {
    let library = from_string(CURRENT_LIBRARY).unwrap();

    assert_eq!(to_string(&library).unwrap(), CURRENT_LIBRARY.trim_end());
    assert_eq!(library.name(), "phase0_contract");
    assert_eq!(library.cells().len(), 3);
    assert_eq!(library.top_cell().unwrap().name(), "top");

    let leaf = library.cell("leaf").unwrap();
    assert_eq!(leaf.polygon_count(), 1);
    assert_eq!(leaf.path_count(), 1);
    assert_eq!(leaf.text_count(), 1);
    assert_eq!(leaf.ports().len(), 1);
    assert_eq!(leaf.path_length(), Some(7.25));
    assert!(leaf.drc_skip());
    assert_eq!(leaf.drc_waive_regions().len(), 1);
    assert_eq!(leaf.paths().next().unwrap().3, PathEndType::Round);

    let refs: Vec<_> = library.cell("top").unwrap().cell_refs().collect();
    assert_eq!(refs.len(), 3);
    let repetition = refs[1].repetition.unwrap();
    assert_eq!((repetition.columns, repetition.rows), (3, 2));
    assert_eq!(
        (repetition.col_vector.x, repetition.col_vector.y),
        (8.0, 1.0)
    );
    assert_eq!(
        (repetition.row_vector.x, repetition.row_vector.y),
        (2.0, 6.0)
    );
    assert_eq!(refs[2].cell_name, "missing");
    assert!(library.cell_bbox("top").is_some());
}

#[test]
fn cycle_fixture_is_accepted_and_bbox_guarded() {
    let library = from_string(CYCLE).unwrap();

    assert_eq!(to_string(&library).unwrap(), CYCLE.trim_end());
    assert_eq!(library.cells().len(), 2);
    assert!(library.roots().is_empty());
    assert!(library.top_cell().is_none());
    assert!(library.cell_bbox("cycle_a").is_none());
}

#[test]
fn multi_root_fixture_preserves_explicit_top_selection() {
    let mut library = from_string(MULTI_ROOT).unwrap();

    assert_eq!(to_string(&library).unwrap(), MULTI_ROOT.trim_end());
    assert_eq!(library.cells().len(), 2);
    assert_eq!(
        library
            .roots()
            .iter()
            .map(|cell| cell.name())
            .collect::<Vec<_>>(),
        vec!["root_a", "root_b"]
    );
    assert_eq!(library.top_cell().unwrap().name(), "root_b");
    assert_eq!(library.explicit_top_cell().unwrap().name(), "root_b");
    assert!(library.cell_bbox("root_a").is_some());
    assert!(library.cell_bbox("root_b").is_some());

    assert_eq!(to_string(&library).unwrap(), MULTI_ROOT.trim_end());

    let restored = from_string(&to_string(&library).unwrap()).unwrap();
    assert_eq!(restored.top_cell().unwrap().name(), "root_b");

    library.clear_top_cell();
    assert!(library.top_cell().is_none());
    let restored = from_string(&to_string(&library).unwrap()).unwrap();
    assert!(restored.top_cell().is_none());
}
