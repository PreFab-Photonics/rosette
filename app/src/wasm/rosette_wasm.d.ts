/* tslint:disable */
/* eslint-disable */

/**
 * CellRef information returned by get_cell_ref_info.
 *
 * Contains all data needed to reconstruct a CellRef element for undo/redo.
 */
export class CellRefInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Get the referenced cell name.
     */
    readonly cell_name: string;
    /**
     * Get the transform as [a, b, c, d, tx, ty].
     */
    readonly transform: Float64Array;
}

/**
 * Element information returned by get_element_info.
 *
 * Contains all data needed to reconstruct an element for undo/redo.
 */
export class ElementInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Get the datatype number.
     */
    readonly datatype: number;
    /**
     * Get the layer number.
     */
    readonly layer: number;
    /**
     * Get the vertices as a flat array [x0, y0, x1, y1, ...].
     */
    readonly vertices: Float64Array;
}

/**
 * WASM-compatible library wrapper.
 *
 * Wraps a `rosette_core::Library` and provides methods for creating
 * and manipulating cells and elements from JavaScript.
 */
export class WasmLibrary {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Get the active cell name, or None if no cell exists.
     */
    active_cell_name(): string | undefined;
    /**
     * Add a new cell to the library.
     *
     * Returns an error if the name is invalid or already exists.
     */
    add_cell(name: string): void;
    /**
     * Add a cell reference (instance) to the active cell.
     *
     * Places an instance of `ref_cell_name` at position `(x, y)` in the active cell.
     * The CellRef element is stored directly — its geometry is resolved on-the-fly
     * during rendering and hit-testing, so changes to the child cell are always
     * reflected in the parent.
     *
     * Returns the element index of the CellRef (used for undo), or -1 on failure.
     */
    add_cell_ref(ref_cell_name: string, x: number, y: number): string | undefined;
    /**
     * Add a CellRef element with a full affine transform (for undo/redo).
     *
     * The transform is given as [a, b, c, d, tx, ty].
     * Returns the UUID of the new element, or None on failure.
     */
    add_cell_ref_with_transform(ref_cell_name: string, transform: Float64Array): string | undefined;
    /**
     * Add a polygon to the active cell.
     *
     * Points are provided as a flat array: [x0, y0, x1, y1, ...].
     * Returns the element's UUID, or None if no active cell or invalid points.
     */
    add_polygon(points: Float64Array, layer: number, datatype: number): string | undefined;
    /**
     * Add a rectangle to the active cell.
     *
     * Returns the element's UUID, or None if no active cell.
     *
     * # Arguments
     * * `x`, `y` - Bottom-left corner position
     * * `width`, `height` - Rectangle dimensions
     * * `layer`, `datatype` - GDS layer specification
     */
    add_rectangle(x: number, y: number, width: number, height: number, layer: number, datatype: number): string | undefined;
    /**
     * Add a text label to the active cell.
     *
     * Returns the element's UUID, or None if no active cell.
     */
    add_text(text: string, x: number, y: number, height: number, layer: number, datatype: number): string | undefined;
    /**
     * Perform a boolean operation on polygon elements.
     *
     * Supported operations: `"union"`, `"subtract"`, `"intersect"`, `"xor"`.
     *
     * For `"subtract"`, the element identified by `base_id` is the shape
     * from which all others are subtracted. For other operations, `base_id`
     * is ignored and all shapes are combined.
     *
     * Only polygon elements are supported — text labels and cell references
     * are silently skipped. The input polygons are removed and replaced with
     * the result polygon(s).
     *
     * Returns the UUIDs of the newly created result polygons, or an empty
     * array if the operation cannot be performed.
     */
    boolean_operation(ids: string[], operation: string, base_id: string): string[];
    /**
     * Check whether placing `child_cell` inside `parent_cell` would create
     * a circular reference.
     *
     * Returns true if the instancing is safe (no circular reference).
     */
    can_instance_cell(parent_cell: string, child_cell: string): boolean;
    /**
     * Get the number of cells in the library.
     */
    cell_count(): number;
    /**
     * Clear all elements from the active cell.
     */
    clear_active_cell(): void;
    /**
     * Create a path (waveguide) polygon from a centerline and width.
     *
     * Generates a constant-width ribbon polygon. At interior corners the
     * miter offset is clamped so the path edges stay at exactly half-width
     * from the centerline without flaring at bends.
     *
     * Points are provided as a flat array: [x0, y0, x1, y1, ...].
     * Returns the element's UUID, or None if generation fails.
     *
     * # Arguments
     * * `points` - Flat array of centerline coordinates in world units
     * * `width` - Path width in world units
     * * `layer` - GDS layer number
     * * `datatype` - GDS datatype number
     */
    create_path(points: Float64Array, width: number, layer: number, datatype: number): string | undefined;
    /**
     * Create a path (waveguide) polygon with rounded corners from a centerline.
     *
     * Same as `create_path` but inserts circular arc points at interior corners
     * before generating the ribbon polygon. If `corner_radius` is 0 the result
     * is identical to `create_path`.
     *
     * Returns the element's UUID, or None if no active cell.
     */
    create_path_rounded(points: Float64Array, width: number, corner_radius: number, num_arc_points: number, layer: number, datatype: number): string | undefined;
    /**
     * Get the number of elements in the active cell.
     */
    element_count(): number;
    /**
     * Create a WasmLibrary directly from raw GDS binary bytes.
     *
     * This is the fast path for the Tauri desktop app: the raw file bytes
     * are passed directly to WASM, avoiding the JSON serialization round-trip
     * that `from_library_json` requires.
     */
    static from_gds_bytes(bytes: Uint8Array): WasmLibrary;
    /**
     * Load a library from JSON, flattening all elements to polygons.
     *
     * This method parses a JSON-serialized `rosette_core::Library` and creates
     * a new `WasmLibrary` with all elements flattened to polygons:
     * - Path elements are converted to polygon ribbons using their width
     * - Cell references are expanded with their transforms applied
     * - Text elements are skipped (not rendered)
     *
     * This flattening makes the design ready for rendering in the web viewer.
     *
     * # Arguments
     * * `json` - JSON string containing a serialized Library
     *
     * # Returns
     * A new WasmLibrary with a single "flattened" cell containing all polygons.
     *
     * # Errors
     * Returns a JsValue error if parsing fails.
     */
    static from_json(json: string): WasmLibrary;
    /**
     * Load a full hierarchical library from JSON without flattening.
     *
     * Unlike [`from_json`] which flattens the hierarchy into a single cell,
     * this preserves all cells, cell references, paths, and text elements.
     * Coordinates are converted from the SDK convention (micrometers, Y-up)
     * to app world coordinates (GRID_SIZE units per nm, Y-down).
     *
     * This is the load path for Tauri desktop mode where the user opens a
     * GDS file and wants to edit it hierarchically then save back.
     *
     * # Arguments
     * * `json` - JSON string containing a serialized Library (in micrometers)
     *
     * # Returns
     * A new WasmLibrary with the full cell hierarchy preserved.
     *
     * # Errors
     * Returns a JsValue error if parsing fails.
     */
    static from_library_json(json: string): WasmLibrary;
    /**
     * Get the bounding box of all elements in the active cell.
     *
     * Returns [minX, minY, maxX, maxY] or None if no elements exist.
     * Includes CellRef-resolved geometry.
     */
    get_all_bounds(): Float64Array | undefined;
    /**
     * Get all element IDs in the active cell.
     *
     * Returns a vector of UUIDs for all elements in the active cell,
     * including synthetic UUIDs for CellRef-resolved geometry.
     */
    get_all_ids(): string[];
    /**
     * Get all vertices from all polygons in the active cell.
     *
     * Returns a flat array with polygon boundaries encoded as:
     * [n1, x0, y0, x1, y1, ..., n2, x0, y0, ...]
     * where n1, n2 are vertex counts for each polygon.
     * Includes CellRef-resolved geometry.
     *
     * Used for snap-to-geometry functionality.
     */
    get_all_vertices(): Float64Array;
    /**
     * Get the bounding box of elements with the given UUIDs.
     *
     * Returns [minX, minY, maxX, maxY] or None if none of the IDs are found.
     * Handles both regular UUIDs and synthetic ref UUIDs.
     */
    get_bounds_for_ids(ids: string[]): Float64Array | undefined;
    /**
     * Get the bounding box of a cell's geometry (for drag preview).
     *
     * Returns `[minX, minY, maxX, maxY]` or None if the cell is empty/not found.
     * Includes flattened CellRef geometry.
     */
    get_cell_bounds(cell_name: string): Float64Array | undefined;
    /**
     * Get the origin of the active cell as [x, y].
     *
     * Returns None if no active cell exists.
     */
    get_cell_origin(): Float64Array | undefined;
    /**
     * Get the origin of a cell by name as [x, y].
     *
     * Returns None if the cell does not exist.
     */
    get_cell_origin_by_name(cell_name: string): Float64Array | undefined;
    /**
     * Get preview polygons for a cell reference at a given position.
     *
     * Returns a JS array of `{ vertices: number[], color: [r, g, b, a] }` objects
     * suitable for rendering a preview during drag-and-drop.
     */
    get_cell_preview_polygons(cell_name: string, x: number, y: number): any;
    /**
     * Get the array repetition parameters for a CellRef instance.
     *
     * `id` must be a synthetic ref UUID (e.g. "ref:3:0").
     * Returns `[columns, rows, col_spacing, row_spacing]` or None if not arrayed.
     */
    get_cell_ref_array(id: string): Float64Array | undefined;
    /**
     * Get CellRef information for a given UUID.
     *
     * Works with both real UUIDs and synthetic ref UUIDs.
     * Returns None if the element is not a CellRef.
     */
    get_cell_ref_info(id: string): CellRefInfo | undefined;
    /**
     * Get the cell hierarchy as a forest of tree roots for the Explorer panel.
     *
     * Returns a JS array of `CellNode` objects:
     * ```ts
     * Array<{ name: string, children: CellNode[] }>
     * ```
     *
     * Top-level roots are cells that are not referenced by any other cell.
     * Each root's children are the unique cells it references via `CellRef`
     * elements, built recursively. Returns `JsValue::NULL` if the library
     * has no cells.
     */
    get_cell_tree(): any;
    /**
     * Get the element index for a UUID.
     *
     * Returns the element's position in the parent cell's elements list,
     * or -1 if the UUID is not found. Useful for constructing synthetic
     * ref UUIDs (e.g. `ref:{index}:0`) for selection after placing an instance.
     */
    get_element_index(uuid: string): number;
    /**
     * Get full element information including vertices, layer, and datatype.
     *
     * Returns None/undefined if element not found.
     * For synthetic ref UUIDs, returns the transformed polygon data.
     */
    get_element_info(id: string): ElementInfo | undefined;
    /**
     * Get vertices of an element for outline rendering.
     *
     * Returns flat array [x0, y0, x1, y1, ...] or None if not found.
     * For synthetic ref UUIDs, returns the transformed polygon vertices.
     */
    get_element_vertices(id: string): Float64Array | undefined;
    /**
     * Get UUIDs of all elements on a given layer in the active cell.
     *
     * Use this to snapshot elements before deletion (e.g., for undo support).
     */
    get_elements_on_layer(layer: number, datatype: number): string[];
    /**
     * Get all element UUIDs that belong to the same instance group as the given UUID.
     *
     * If the UUID is a synthetic ref UUID (from a CellRef instance), returns all
     * synthetic UUIDs for that same CellRef element.
     * If the UUID is part of a pre-flattened group (design mode), returns group members.
     * Otherwise returns just the UUID itself.
     */
    get_group_ids(uuid: string): string[];
    /**
     * Get one representative UUID per element or CellRef instance.
     *
     * Used for Tab-cycling: each step in the cycle corresponds to one
     * cell instance (CellRef) or one standalone element (polygon, path, text).
     */
    get_group_representative_ids(): string[];
    /**
     * Get the list of currently hidden cell names.
     */
    get_hidden_cells(): string[];
    /**
     * Get label data for all CellRef instances in the active cell.
     *
     * Returns a JS array of objects with:
     * - `name`: cell name
     * - `elementIndex`: CellRef element index (for matching with ref UUIDs)
     * - `minX`, `minY`, `maxX`, `maxY`: bounding box in world coordinates
     */
    get_instance_label_data(): any;
    /**
     * Get all polygons for rendering.
     *
     * Returns a JS array of [id, vertices, color] tuples where:
     * - id: UUID string
     * - vertices: array of [x, y] pairs
     * - color: [r, g, b, a] with values 0.0-1.0
     *
     * # Errors
     * Returns a JsValue error if serialization fails.
     */
    get_render_polygons(): any;
    /**
     * Get text-specific information for a given element UUID.
     *
     * Returns a JS object `{ text, x, y, height, layer, datatype }` or null
     * if the element is not a text element.
     */
    get_text_element_info(id: string): any;
    /**
     * Get all text labels in the active cell as a JS array.
     *
     * Each entry is `{ id, text, x, y, height, layer, datatype }`.
     */
    get_text_labels(): any;
    /**
     * Get all unique (layer, datatype) pairs used across all cells.
     *
     * Returns a flat array: `[layer0, datatype0, layer1, datatype1, ...]`
     * sorted by layer number then datatype.
     */
    get_used_layers(): Uint32Array;
    /**
     * Hit test at a world position.
     *
     * Returns the UUID of the element at that point, if any.
     * When multiple elements overlap, returns the one with smallest area
     * (typically the "topmost" in visual stacking).
     * Also tests CellRef-resolved geometry using synthetic UUIDs.
     */
    hit_test(x: number, y: number): string | undefined;
    /**
     * Hit test a rectangle to find all intersecting elements.
     *
     * Returns UUIDs of all elements whose bounding boxes intersect
     * the given rectangle (specified in world coordinates).
     * Also tests CellRef-resolved geometry using synthetic UUIDs.
     */
    hit_test_rect(min_x: number, min_y: number, max_x: number, max_y: number): string[];
    /**
     * Check whether a cell's internal geometry is visible.
     */
    is_cell_visible(cell_name: string): boolean;
    /**
     * Check if the library has changed since last sync.
     */
    is_dirty(): boolean;
    /**
     * Check if an element is a text element.
     */
    is_text_element(id: string): boolean;
    /**
     * Mark the library as clean (after syncing to renderer).
     */
    mark_clean(): void;
    /**
     * Create a new library with the given name.
     */
    constructor(name: string);
    /**
     * Remove a cell from the library.
     *
     * Returns false if the cell doesn't exist.
     * If the removed cell is the active cell, the active cell is cleared.
     */
    remove_cell(name: string): boolean;
    /**
     * Remove an element by its UUID.
     *
     * Returns true if the element was removed, false if not found.
     * Handles both real UUIDs and synthetic ref UUIDs (from CellRef instances).
     */
    remove_element(id: string): boolean;
    /**
     * Remove multiple elements by their UUIDs in a single batch operation.
     *
     * This is more efficient than calling `remove_element` repeatedly because
     * it only rebuilds element indices once at the end, rather than after each removal.
     * Handles both real UUIDs and synthetic ref UUIDs (from CellRef instances).
     * Returns the number of elements successfully removed.
     */
    remove_elements(ids: string[]): number;
    /**
     * Remove all elements on a given layer from the active cell.
     *
     * Returns the number of removed elements.
     */
    remove_elements_on_layer(layer: number, datatype: number): number;
    /**
     * Remove the color entry for a layer.
     *
     * Call this after deleting a layer to clean up stale rendering state.
     */
    remove_layer_color(layer: number, datatype: number): void;
    /**
     * Rename a cell in the library.
     *
     * Returns false if old_name doesn't exist, or throws a JS error if
     * new_name is invalid or already taken.
     */
    rename_cell(old_name: string, new_name: string): boolean;
    /**
     * Set the active cell by name.
     *
     * Returns false if the cell doesn't exist.
     */
    set_active_cell(name: string): boolean;
    /**
     * Set the origin of the active cell.
     *
     * Returns false if no active cell exists.
     */
    set_cell_origin(x: number, y: number): boolean;
    /**
     * Set the array repetition parameters on a CellRef instance.
     *
     * `id` must be a synthetic ref UUID (e.g. "ref:3:0").
     * `params` must be `[columns, rows, col_spacing, row_spacing]` (4 elements).
     * If columns and rows are both 1, removes the array (reverts to single instance).
     *
     * Returns true if the array was set, false otherwise.
     */
    set_cell_ref_array(id: string, columns: number, rows: number, col_spacing: number, row_spacing: number): boolean;
    /**
     * Set the full affine transform on a CellRef instance.
     *
     * `id` must be a synthetic ref UUID (e.g. "ref:3:0").
     * `transform` must be `[a, b, c, d, tx, ty]` (6 elements).
     *
     * Returns true if the transform was set, false otherwise.
     */
    set_cell_ref_transform(id: string, transform: Float64Array): boolean;
    /**
     * Set visibility of a cell's internal geometry.
     *
     * When a cell is hidden, its polygons and paths are not rendered inside
     * CellRef instances. Bounding-box outlines, labels, and hit-testing
     * remain active so the instance can still be selected and identified.
     */
    set_cell_visibility(cell_name: string, visible: boolean): void;
    /**
     * Set the maximum hierarchy depth for rendering CellRef instances.
     *
     * - `0` means unlimited (fully resolve all nested references).
     * - `1` means only render direct elements of the active cell; instances
     *   are not resolved (they still appear as bounding-box outlines).
     * - `N` means resolve up to N levels of nested CellRef elements.
     */
    set_hierarchy_depth_limit(limit: number): void;
    /**
     * Set the color for a layer.
     *
     * Colors are RGBA with values 0.0-1.0.
     */
    set_layer_color(layer: number, datatype: number, r: number, g: number, b: number, a: number): void;
    /**
     * Set the fill pattern for a layer.
     *
     * Pattern IDs: 0=solid, 1=hatched, 2=crosshatched, 3=dotted, 4=horizontal, 5=vertical, 6=zigzag, 7=brick.
     */
    set_layer_fill_pattern(layer: number, datatype: number, pattern: number): void;
    /**
     * Update the height of a text element.
     *
     * Returns true if the element was found and updated.
     */
    set_text_height(id: string, new_height: number): boolean;
    /**
     * Update the position of a text element.
     *
     * Returns true if the element was found and updated.
     */
    set_text_position(id: string, x: number, y: number): boolean;
    /**
     * Export the library as GDS II binary bytes.
     *
     * Coordinates are converted back from app world coordinates
     * (GRID_SIZE units per nm, Y-down) to GDS convention (micrometers, Y-up).
     *
     * # Returns
     * A `Uint8Array` containing the GDS binary data.
     *
     * # Errors
     * Returns a JsValue error if serialization fails.
     */
    to_gds(): Uint8Array;
    /**
     * Export the library to JSON.
     *
     * # Returns
     * A JSON string representation of the library.
     *
     * # Errors
     * Returns a JsValue error if serialization fails.
     */
    to_json(): string;
    /**
     * Export the library to JSON with coordinates in micrometers (GDS convention).
     *
     * This is used by the Tauri backend to write GDS files: the frontend sends
     * this JSON to the backend, which deserializes and writes via `gds::write_library`.
     *
     * # Returns
     * A JSON string with coordinates converted back to micrometers/Y-up.
     *
     * # Errors
     * Returns a JsValue error if serialization fails.
     */
    to_library_json(): string;
    /**
     * Translate an element by the given delta in world coordinates.
     *
     * Returns true if successful, false if element not found.
     *
     * # Arguments
     * * `id` - The element's UUID
     * * `dx` - Translation delta in X direction (world units)
     * * `dy` - Translation delta in Y direction (world units)
     */
    translate_element(id: string, dx: number, dy: number): boolean;
    /**
     * Translate multiple elements by the given delta.
     *
     * Returns the number of elements successfully translated.
     * For synthetic ref UUIDs, translates the CellRef element's transform directly.
     *
     * # Arguments
     * * `ids` - Array of element UUIDs
     * * `dx` - Translation delta in X direction (world units)
     * * `dy` - Translation delta in Y direction (world units)
     */
    translate_elements(ids: string[], dx: number, dy: number): number;
    /**
     * Update the text content of an existing text element.
     *
     * Returns true if the element was found and updated.
     */
    update_text(id: string, new_text: string): boolean;
}

/**
 * WebAssembly renderer with wgpu backend.
 *
 * Manages GPU resources and provides methods for rendering
 * the layout canvas with grid, crosshair, laser pointer, and shapes.
 */
export class WasmRenderer {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Add a shape to render.
     *
     * Points are in world coordinates (flat array: [x0, y0, x1, y1, ...]).
     * Color is RGBA (flat array: [r, g, b, a], values 0.0-1.0).
     *
     * # Arguments
     * * `id` - Unique identifier for the shape.
     * * `points` - Flat array of world coordinates (x, y pairs).
     * * `color` - RGBA color array [r, g, b, a].
     */
    add_shape(id: string, points: Float64Array, color: Float32Array): void;
    /**
     * Add a shape to the selection.
     */
    add_to_selection(id: string): void;
    /**
     * Capture the current view as raw RGBA pixels.
     *
     * Renders the scene to an offscreen texture, copies the result to a
     * staging buffer, maps it, and returns the pixel data as a `Uint8Array`.
     * The first 8 bytes encode (width, height) as two little-endian u32s,
     * followed by `width * height * 4` bytes of RGBA pixel data.
     *
     * Returns a `Promise<Uint8Array>` to JS.
     */
    capture_screenshot(): Promise<any>;
    /**
     * Clear the laser pointer trail.
     */
    clear_laser(): void;
    /**
     * Clear the preview shape.
     */
    clear_preview(): void;
    /**
     * Clear all selection.
     */
    clear_selection(): void;
    /**
     * Clear all shapes.
     */
    clear_shapes(): void;
    /**
     * Create a new renderer attached to a canvas element.
     *
     * # Arguments
     * * `canvas_id` - The DOM id of the canvas element.
     *
     * # Errors
     * Returns an error if WebGPU is not supported or initialization fails.
     */
    static create(canvas_id: string): Promise<WasmRenderer>;
    /**
     * Signal that the renderer is no longer needed.
     *
     * Note: This method does not immediately release GPU resources. Resources
     * are released when the JS garbage collector frees the WasmRenderer object.
     * Calling this method allows you to drop your JS reference, signaling to
     * the GC that the object can be collected.
     *
     * wgpu resources (device, queue, surface, buffers, pipelines) are
     * automatically cleaned up via Rust's Drop trait when the object is freed.
     */
    destroy(): void;
    /**
     * Get the currently hovered shape ID.
     */
    get_hover(): string | undefined;
    /**
     * Get all currently hovered shape IDs.
     */
    get_hover_ids(): string[];
    /**
     * Get the current offset (screen position of world origin).
     */
    get_offset(): Float64Array;
    /**
     * Get the currently selected shape IDs.
     */
    get_selection(): string[];
    /**
     * Get the current zoom level (pixels per world unit).
     */
    get_zoom(): number;
    /**
     * Force the renderer to re-render on next frame.
     *
     * Use this for external triggers that require a visual update.
     */
    mark_dirty(): void;
    /**
     * Remove a shape by ID.
     *
     * # Arguments
     * * `id` - The shape's identifier.
     */
    remove_shape(id: string): void;
    /**
     * Render the current view.
     *
     * Returns early if nothing has changed since last render.
     */
    render(): void;
    /**
     * Handle canvas resize.
     *
     * # Arguments
     * * `width` - New width in pixels.
     * * `height` - New height in pixels.
     */
    resize(width: number, height: number): void;
    /**
     * Convert screen coordinates to world coordinates.
     */
    screen_to_world(screen_x: number, screen_y: number): Float64Array;
    /**
     * Set the crosshair origin in world coordinates.
     *
     * The crosshair is rendered at this position instead of world (0,0).
     * Used to visualize the cell origin for instancing.
     */
    set_crosshair_origin(x: number, y: number): void;
    /**
     * Set the device pixel ratio for HiDPI/retina display support.
     *
     * This scales UI elements like grid dots to maintain consistent
     * visual size across different display densities.
     *
     * # Arguments
     * * `dpr` - Device pixel ratio (typically 1.0 for standard displays, 2.0 for retina).
     */
    set_dpr(dpr: number): void;
    /**
     * Set grid visibility.
     *
     * When hidden, grid points are not drawn but are still computed
     * so toggling back on is instantaneous.
     *
     * # Arguments
     * * `visible` - Whether the grid should be rendered.
     */
    set_grid_visible(visible: boolean): void;
    /**
     * Set the hovered shape ID.
     *
     * Pass None/undefined to clear hover.
     */
    set_hover(id?: string | null): void;
    /**
     * Set the hover outline color.
     *
     * # Arguments
     * * `r`, `g`, `b`, `a` - RGBA color values (0.0-1.0 range).
     */
    set_hover_color(r: number, g: number, b: number, a: number): void;
    /**
     * Set multiple hovered shape IDs (for marquee preview).
     *
     * Pass an empty array to clear hover.
     */
    set_hover_multiple(ids: string[]): void;
    /**
     * Set laser pointer opacity (for fade animation).
     *
     * # Arguments
     * * `opacity` - Opacity value from 0.0 (invisible) to 1.0 (fully visible).
     */
    set_laser_opacity(opacity: number): void;
    /**
     * Set laser pointer trail points.
     *
     * Points are in screen coordinates (pixels). The array should contain
     * alternating x, y values: [x0, y0, x1, y1, x2, y2, ...]
     *
     * # Arguments
     * * `points` - Flat array of screen coordinates (x, y pairs).
     */
    set_laser_points(points: Float64Array): void;
    /**
     * Set a preview origin cross (two perpendicular lines at the given world position).
     *
     * # Arguments
     * * `x`, `y` - World coordinates of the cross center.
     * * `arm_size` - Half-length of each arm in world units.
     * * `color` - RGBA color array `[r, g, b, a]`.
     */
    set_preview_origin(x: number, y: number, arm_size: number, color: Float32Array): void;
    /**
     * Set a preview shape (rendered on top, for drag previews).
     *
     * # Arguments
     * * `points` - Flat array of world coordinates (x, y pairs).
     * * `color` - RGBA color array [r, g, b, a].
     */
    set_preview_shape(points: Float64Array, color: Float32Array): void;
    /**
     * Set the selected shape IDs.
     *
     * Pass an empty array to clear selection.
     */
    set_selection(ids: string[]): void;
    /**
     * Set the selection outline color.
     *
     * # Arguments
     * * `r`, `g`, `b`, `a` - RGBA color values (0.0-1.0 range).
     */
    set_selection_color(r: number, g: number, b: number, a: number): void;
    /**
     * Set the color theme.
     *
     * # Arguments
     * * `dark` - true for dark theme, false for light theme.
     */
    set_theme(dark: boolean): void;
    /**
     * Set the viewport transformation using offset-based coordinates.
     *
     * # Arguments
     * * `offset_x` - Screen X position of world origin in pixels.
     * * `offset_y` - Screen Y position of world origin in pixels.
     * * `zoom` - Zoom level (pixels per world unit).
     */
    set_viewport(offset_x: number, offset_y: number, zoom: number): void;
    /**
     * Get the number of shapes (excluding preview).
     */
    shape_count(): number;
    /**
     * Sync shapes from a WasmLibrary.
     *
     * This replaces all existing shapes with the polygons from the library.
     * The preview shape is preserved.
     */
    sync_from_library(library: WasmLibrary): void;
    /**
     * Toggle a shape in the selection.
     */
    toggle_selection(id: string): void;
    /**
     * Update an existing shape's points.
     *
     * # Arguments
     * * `id` - The shape's identifier.
     * * `points` - New points (flat array: [x0, y0, x1, y1, ...]).
     */
    update_shape(id: string, points: Float64Array): void;
}

/**
 * Initialize panic hook for better error messages in browser console.
 */
export function init(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_cellrefinfo_free: (a: number, b: number) => void;
    readonly __wbg_elementinfo_free: (a: number, b: number) => void;
    readonly __wbg_wasmlibrary_free: (a: number, b: number) => void;
    readonly cellrefinfo_cell_name: (a: number) => [number, number];
    readonly cellrefinfo_transform: (a: number) => [number, number];
    readonly elementinfo_datatype: (a: number) => number;
    readonly elementinfo_layer: (a: number) => number;
    readonly elementinfo_vertices: (a: number) => [number, number];
    readonly wasmlibrary_active_cell_name: (a: number) => [number, number];
    readonly wasmlibrary_add_cell: (a: number, b: number, c: number) => [number, number];
    readonly wasmlibrary_add_cell_ref: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly wasmlibrary_add_cell_ref_with_transform: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly wasmlibrary_add_polygon: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly wasmlibrary_add_rectangle: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly wasmlibrary_add_text: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
    readonly wasmlibrary_boolean_operation: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly wasmlibrary_can_instance_cell: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly wasmlibrary_cell_count: (a: number) => number;
    readonly wasmlibrary_clear_active_cell: (a: number) => void;
    readonly wasmlibrary_create_path: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly wasmlibrary_create_path_rounded: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
    readonly wasmlibrary_element_count: (a: number) => number;
    readonly wasmlibrary_from_gds_bytes: (a: number, b: number) => [number, number, number];
    readonly wasmlibrary_from_json: (a: number, b: number) => [number, number, number];
    readonly wasmlibrary_from_library_json: (a: number, b: number) => [number, number, number];
    readonly wasmlibrary_get_all_bounds: (a: number) => [number, number];
    readonly wasmlibrary_get_all_ids: (a: number) => [number, number];
    readonly wasmlibrary_get_all_vertices: (a: number) => [number, number];
    readonly wasmlibrary_get_bounds_for_ids: (a: number, b: number, c: number) => [number, number];
    readonly wasmlibrary_get_cell_bounds: (a: number, b: number, c: number) => [number, number];
    readonly wasmlibrary_get_cell_origin: (a: number) => [number, number];
    readonly wasmlibrary_get_cell_origin_by_name: (a: number, b: number, c: number) => [number, number];
    readonly wasmlibrary_get_cell_preview_polygons: (a: number, b: number, c: number, d: number, e: number) => any;
    readonly wasmlibrary_get_cell_ref_array: (a: number, b: number, c: number) => [number, number];
    readonly wasmlibrary_get_cell_ref_info: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_get_cell_tree: (a: number) => any;
    readonly wasmlibrary_get_element_index: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_get_element_info: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_get_element_vertices: (a: number, b: number, c: number) => [number, number];
    readonly wasmlibrary_get_elements_on_layer: (a: number, b: number, c: number) => [number, number];
    readonly wasmlibrary_get_group_ids: (a: number, b: number, c: number) => [number, number];
    readonly wasmlibrary_get_group_representative_ids: (a: number) => [number, number];
    readonly wasmlibrary_get_hidden_cells: (a: number) => [number, number];
    readonly wasmlibrary_get_instance_label_data: (a: number) => any;
    readonly wasmlibrary_get_render_polygons: (a: number) => [number, number, number];
    readonly wasmlibrary_get_text_element_info: (a: number, b: number, c: number) => any;
    readonly wasmlibrary_get_text_labels: (a: number) => any;
    readonly wasmlibrary_get_used_layers: (a: number) => [number, number];
    readonly wasmlibrary_hit_test: (a: number, b: number, c: number) => [number, number];
    readonly wasmlibrary_hit_test_rect: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly wasmlibrary_is_cell_visible: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_is_dirty: (a: number) => number;
    readonly wasmlibrary_is_text_element: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_mark_clean: (a: number) => void;
    readonly wasmlibrary_new: (a: number, b: number) => number;
    readonly wasmlibrary_remove_cell: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_remove_element: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_remove_elements: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_remove_elements_on_layer: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_remove_layer_color: (a: number, b: number, c: number) => void;
    readonly wasmlibrary_rename_cell: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly wasmlibrary_set_active_cell: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_set_cell_origin: (a: number, b: number, c: number) => number;
    readonly wasmlibrary_set_cell_ref_array: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
    readonly wasmlibrary_set_cell_ref_transform: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly wasmlibrary_set_cell_visibility: (a: number, b: number, c: number, d: number) => void;
    readonly wasmlibrary_set_hierarchy_depth_limit: (a: number, b: number) => void;
    readonly wasmlibrary_set_layer_color: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly wasmlibrary_set_layer_fill_pattern: (a: number, b: number, c: number, d: number) => void;
    readonly wasmlibrary_set_text_height: (a: number, b: number, c: number, d: number) => number;
    readonly wasmlibrary_set_text_position: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly wasmlibrary_to_gds: (a: number) => [number, number, number, number];
    readonly wasmlibrary_to_json: (a: number) => [number, number, number, number];
    readonly wasmlibrary_to_library_json: (a: number) => [number, number, number, number];
    readonly wasmlibrary_translate_element: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly wasmlibrary_translate_elements: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly wasmlibrary_update_text: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly __wbg_wasmrenderer_free: (a: number, b: number) => void;
    readonly wasmrenderer_add_shape: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly wasmrenderer_add_to_selection: (a: number, b: number, c: number) => void;
    readonly wasmrenderer_capture_screenshot: (a: number) => any;
    readonly wasmrenderer_clear_laser: (a: number) => void;
    readonly wasmrenderer_clear_preview: (a: number) => void;
    readonly wasmrenderer_clear_selection: (a: number) => void;
    readonly wasmrenderer_clear_shapes: (a: number) => void;
    readonly wasmrenderer_create: (a: number, b: number) => any;
    readonly wasmrenderer_destroy: (a: number) => void;
    readonly wasmrenderer_get_hover: (a: number) => [number, number];
    readonly wasmrenderer_get_hover_ids: (a: number) => [number, number];
    readonly wasmrenderer_get_offset: (a: number) => [number, number];
    readonly wasmrenderer_get_selection: (a: number) => [number, number];
    readonly wasmrenderer_get_zoom: (a: number) => number;
    readonly wasmrenderer_mark_dirty: (a: number) => void;
    readonly wasmrenderer_remove_shape: (a: number, b: number, c: number) => void;
    readonly wasmrenderer_render: (a: number) => void;
    readonly wasmrenderer_resize: (a: number, b: number, c: number) => void;
    readonly wasmrenderer_screen_to_world: (a: number, b: number, c: number) => [number, number];
    readonly wasmrenderer_set_crosshair_origin: (a: number, b: number, c: number) => void;
    readonly wasmrenderer_set_dpr: (a: number, b: number) => void;
    readonly wasmrenderer_set_grid_visible: (a: number, b: number) => void;
    readonly wasmrenderer_set_hover: (a: number, b: number, c: number) => void;
    readonly wasmrenderer_set_hover_color: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wasmrenderer_set_hover_multiple: (a: number, b: number, c: number) => void;
    readonly wasmrenderer_set_laser_opacity: (a: number, b: number) => void;
    readonly wasmrenderer_set_laser_points: (a: number, b: number, c: number) => void;
    readonly wasmrenderer_set_preview_origin: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly wasmrenderer_set_preview_shape: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wasmrenderer_set_selection: (a: number, b: number, c: number) => void;
    readonly wasmrenderer_set_selection_color: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wasmrenderer_set_theme: (a: number, b: number) => void;
    readonly wasmrenderer_set_viewport: (a: number, b: number, c: number, d: number) => void;
    readonly wasmrenderer_shape_count: (a: number) => number;
    readonly wasmrenderer_sync_from_library: (a: number, b: number) => void;
    readonly wasmrenderer_toggle_selection: (a: number, b: number, c: number) => void;
    readonly wasmrenderer_update_shape: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly init: () => void;
    readonly wasm_bindgen__closure__destroy__h52ff4e9cf9be43a2: (a: number, b: number) => void;
    readonly wasm_bindgen__closure__destroy__hb39ba80c733e6d38: (a: number, b: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h4aa216712475f51d: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h93c31ecaa1a59c3c: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1aa1ab0756435612: (a: number, b: number, c: any) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
