class j {
  static __wrap(e) {
    e = e >>> 0;
    const t = Object.create(j.prototype);
    return t.__wbg_ptr = e, Y.register(t, t.__wbg_ptr, t), t;
  }
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Y.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    _.__wbg_cellrefinfo_free(e, 0);
  }
  get cell_name() {
    let e, t;
    try {
      const n = _.cellrefinfo_cell_name(this.__wbg_ptr);
      return e = n[0], t = n[1], m(n[0], n[1]);
    } finally {
      _.__wbindgen_free(e, t, 1);
    }
  }
  get transform() {
    const e = _.cellrefinfo_transform(this.__wbg_ptr);
    var t = v(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 8, 8), t;
  }
}
Symbol.dispose && (j.prototype[Symbol.dispose] = j.prototype.free);
class z {
  static __wrap(e) {
    e = e >>> 0;
    const t = Object.create(z.prototype);
    return t.__wbg_ptr = e, Z.register(t, t.__wbg_ptr, t), t;
  }
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Z.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    _.__wbg_elementinfo_free(e, 0);
  }
  get datatype() {
    return _.elementinfo_datatype(this.__wbg_ptr);
  }
  get layer() {
    return _.elementinfo_layer(this.__wbg_ptr);
  }
  get vertices() {
    const e = _.elementinfo_vertices(this.__wbg_ptr);
    var t = v(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 8, 8), t;
  }
}
Symbol.dispose && (z.prototype[Symbol.dispose] = z.prototype.free);
class T {
  static __wrap(e) {
    e = e >>> 0;
    const t = Object.create(T.prototype);
    return t.__wbg_ptr = e, H.register(t, t.__wbg_ptr, t), t;
  }
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, H.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    _.__wbg_wasmlibrary_free(e, 0);
  }
  active_cell_name() {
    const e = _.wasmlibrary_active_cell_name(this.__wbg_ptr);
    let t;
    return e[0] !== 0 && (t = m(e[0], e[1]).slice(), _.__wbindgen_free(e[0], e[1] * 1, 1)), t;
  }
  add_cell(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_add_cell(this.__wbg_ptr, t, n);
    if (r[1]) throw A(r[0]);
  }
  add_cell_ref(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f, o = _.wasmlibrary_add_cell_ref(this.__wbg_ptr, r, c, t, n);
    let i;
    return o[0] !== 0 && (i = m(o[0], o[1]).slice(), _.__wbindgen_free(o[0], o[1] * 1, 1)), i;
  }
  add_cell_ref_to(e, t, n, r) {
    const c = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f, i = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), s = f, b = _.wasmlibrary_add_cell_ref_to(this.__wbg_ptr, c, o, i, s, n, r);
    let u;
    return b[0] !== 0 && (u = m(b[0], b[1]).slice(), _.__wbindgen_free(b[0], b[1] * 1, 1)), u;
  }
  add_cell_ref_to_with_transform(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f, o = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), i = f, s = I(n, _.__wbindgen_malloc), b = f, u = _.wasmlibrary_add_cell_ref_to_with_transform(this.__wbg_ptr, r, c, o, i, s, b);
    let y;
    return u[0] !== 0 && (y = m(u[0], u[1]).slice(), _.__wbindgen_free(u[0], u[1] * 1, 1)), y;
  }
  add_cell_ref_with_transform(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = I(t, _.__wbindgen_malloc), o = f, i = _.wasmlibrary_add_cell_ref_with_transform(this.__wbg_ptr, n, r, c, o);
    let s;
    return i[0] !== 0 && (s = m(i[0], i[1]).slice(), _.__wbindgen_free(i[0], i[1] * 1, 1)), s;
  }
  add_polygon(e, t, n) {
    const r = I(e, _.__wbindgen_malloc), c = f, o = _.wasmlibrary_add_polygon(this.__wbg_ptr, r, c, t, n);
    let i;
    return o[0] !== 0 && (i = m(o[0], o[1]).slice(), _.__wbindgen_free(o[0], o[1] * 1, 1)), i;
  }
  add_rectangle(e, t, n, r, c, o) {
    const i = _.wasmlibrary_add_rectangle(this.__wbg_ptr, e, t, n, r, c, o);
    let s;
    return i[0] !== 0 && (s = m(i[0], i[1]).slice(), _.__wbindgen_free(i[0], i[1] * 1, 1)), s;
  }
  add_text(e, t, n, r, c, o) {
    const i = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), s = f, b = _.wasmlibrary_add_text(this.__wbg_ptr, i, s, t, n, r, c, o);
    let u;
    return b[0] !== 0 && (u = m(b[0], b[1]).slice(), _.__wbindgen_free(b[0], b[1] * 1, 1)), u;
  }
  boolean_operation(e, t, n) {
    const r = P(e, _.__wbindgen_malloc), c = f, o = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), i = f, s = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), b = f, u = _.wasmlibrary_boolean_operation(this.__wbg_ptr, r, c, o, i, s, b);
    var y = S(u[0], u[1]).slice();
    return _.__wbindgen_free(u[0], u[1] * 4, 4), y;
  }
  can_instance_cell(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    return _.wasmlibrary_can_instance_cell(this.__wbg_ptr, n, r, c, o) !== 0;
  }
  cell_count() {
    return _.wasmlibrary_cell_count(this.__wbg_ptr) >>> 0;
  }
  clear_active_cell() {
    _.wasmlibrary_clear_active_cell(this.__wbg_ptr);
  }
  create_path(e, t, n, r) {
    const c = I(e, _.__wbindgen_malloc), o = f, i = _.wasmlibrary_create_path(this.__wbg_ptr, c, o, t, n, r);
    let s;
    return i[0] !== 0 && (s = m(i[0], i[1]).slice(), _.__wbindgen_free(i[0], i[1] * 1, 1)), s;
  }
  create_path_rounded(e, t, n, r, c, o) {
    const i = I(e, _.__wbindgen_malloc), s = f, b = _.wasmlibrary_create_path_rounded(this.__wbg_ptr, i, s, t, n, r, c, o);
    let u;
    return b[0] !== 0 && (u = m(b[0], b[1]).slice(), _.__wbindgen_free(b[0], b[1] * 1, 1)), u;
  }
  element_count() {
    return _.wasmlibrary_element_count(this.__wbg_ptr) >>> 0;
  }
  static from_gds_bytes(e) {
    const t = ve(e, _.__wbindgen_malloc), n = f, r = _.wasmlibrary_from_gds_bytes(t, n);
    if (r[2]) throw A(r[1]);
    return T.__wrap(r[0]);
  }
  static from_json(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_from_json(t, n);
    if (r[2]) throw A(r[1]);
    return T.__wrap(r[0]);
  }
  static from_library_json(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_from_library_json(t, n);
    if (r[2]) throw A(r[1]);
    return T.__wrap(r[0]);
  }
  get_all_bounds() {
    const e = _.wasmlibrary_get_all_bounds(this.__wbg_ptr);
    let t;
    return e[0] !== 0 && (t = v(e[0], e[1]).slice(), _.__wbindgen_free(e[0], e[1] * 8, 8)), t;
  }
  get_all_ids() {
    const e = _.wasmlibrary_get_all_ids(this.__wbg_ptr);
    var t = S(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_all_vertices() {
    const e = _.wasmlibrary_get_all_vertices(this.__wbg_ptr);
    var t = v(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 8, 8), t;
  }
  get_bounds_for_ids(e) {
    const t = P(e, _.__wbindgen_malloc), n = f, r = _.wasmlibrary_get_bounds_for_ids(this.__wbg_ptr, t, n);
    let c;
    return r[0] !== 0 && (c = v(r[0], r[1]).slice(), _.__wbindgen_free(r[0], r[1] * 8, 8)), c;
  }
  get_cell_bounds(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_get_cell_bounds(this.__wbg_ptr, t, n);
    let c;
    return r[0] !== 0 && (c = v(r[0], r[1]).slice(), _.__wbindgen_free(r[0], r[1] * 8, 8)), c;
  }
  get_cell_names() {
    const e = _.wasmlibrary_get_cell_names(this.__wbg_ptr);
    var t = S(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_cell_origin() {
    const e = _.wasmlibrary_get_cell_origin(this.__wbg_ptr);
    let t;
    return e[0] !== 0 && (t = v(e[0], e[1]).slice(), _.__wbindgen_free(e[0], e[1] * 8, 8)), t;
  }
  get_cell_origin_by_name(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_get_cell_origin_by_name(this.__wbg_ptr, t, n);
    let c;
    return r[0] !== 0 && (c = v(r[0], r[1]).slice(), _.__wbindgen_free(r[0], r[1] * 8, 8)), c;
  }
  get_cell_preview_polygons(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    return _.wasmlibrary_get_cell_preview_polygons(this.__wbg_ptr, r, c, t, n);
  }
  get_cell_ref_array(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_get_cell_ref_array(this.__wbg_ptr, t, n);
    let c;
    return r[0] !== 0 && (c = v(r[0], r[1]).slice(), _.__wbindgen_free(r[0], r[1] * 8, 8)), c;
  }
  get_cell_ref_info(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_get_cell_ref_info(this.__wbg_ptr, t, n);
    return r === 0 ? void 0 : j.__wrap(r);
  }
  get_cell_ref_parents(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_get_cell_ref_parents(this.__wbg_ptr, t, n);
  }
  get_cell_tree() {
    return _.wasmlibrary_get_cell_tree(this.__wbg_ptr);
  }
  get_element_index(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_get_element_index(this.__wbg_ptr, t, n);
  }
  get_element_info(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_get_element_info(this.__wbg_ptr, t, n);
    return r === 0 ? void 0 : z.__wrap(r);
  }
  get_element_vertices(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_get_element_vertices(this.__wbg_ptr, t, n);
    let c;
    return r[0] !== 0 && (c = v(r[0], r[1]).slice(), _.__wbindgen_free(r[0], r[1] * 8, 8)), c;
  }
  get_elements_on_layer(e, t) {
    const n = _.wasmlibrary_get_elements_on_layer(this.__wbg_ptr, e, t);
    var r = S(n[0], n[1]).slice();
    return _.__wbindgen_free(n[0], n[1] * 4, 4), r;
  }
  get_group_ids(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_get_group_ids(this.__wbg_ptr, t, n);
    var c = S(r[0], r[1]).slice();
    return _.__wbindgen_free(r[0], r[1] * 4, 4), c;
  }
  get_group_representative_ids() {
    const e = _.wasmlibrary_get_group_representative_ids(this.__wbg_ptr);
    var t = S(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_hidden_cells() {
    const e = _.wasmlibrary_get_hidden_cells(this.__wbg_ptr);
    var t = S(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_instance_label_data() {
    return _.wasmlibrary_get_instance_label_data(this.__wbg_ptr);
  }
  get_render_polygons() {
    const e = _.wasmlibrary_get_render_polygons(this.__wbg_ptr);
    if (e[2]) throw A(e[1]);
    return A(e[0]);
  }
  get_text_element_info(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_get_text_element_info(this.__wbg_ptr, t, n);
  }
  get_text_labels() {
    return _.wasmlibrary_get_text_labels(this.__wbg_ptr);
  }
  get_used_layers() {
    const e = _.wasmlibrary_get_used_layers(this.__wbg_ptr);
    var t = B(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  hit_test(e, t) {
    const n = _.wasmlibrary_hit_test(this.__wbg_ptr, e, t);
    let r;
    return n[0] !== 0 && (r = m(n[0], n[1]).slice(), _.__wbindgen_free(n[0], n[1] * 1, 1)), r;
  }
  hit_test_rect(e, t, n, r) {
    const c = _.wasmlibrary_hit_test_rect(this.__wbg_ptr, e, t, n, r);
    var o = S(c[0], c[1]).slice();
    return _.__wbindgen_free(c[0], c[1] * 4, 4), o;
  }
  is_cell_visible(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_is_cell_visible(this.__wbg_ptr, t, n) !== 0;
  }
  is_dirty() {
    return _.wasmlibrary_is_dirty(this.__wbg_ptr) !== 0;
  }
  is_text_element(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_is_text_element(this.__wbg_ptr, t, n) !== 0;
  }
  mark_clean() {
    _.wasmlibrary_mark_clean(this.__wbg_ptr);
  }
  constructor(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_new(t, n);
    return this.__wbg_ptr = r >>> 0, H.register(this, this.__wbg_ptr, this), this;
  }
  predict_blur(e) {
    const t = P(e, _.__wbindgen_malloc), n = f;
    return _.wasmlibrary_predict_blur(this.__wbg_ptr, t, n) !== 0;
  }
  predict_contours(e) {
    return _.wasmlibrary_predict_contours(this.__wbg_ptr, e);
  }
  predict_gaussian(e, t) {
    const n = P(e, _.__wbindgen_malloc), r = f;
    return _.wasmlibrary_predict_gaussian(this.__wbg_ptr, n, r, t);
  }
  remove_cell(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_remove_cell(this.__wbg_ptr, t, n) !== 0;
  }
  remove_cell_cascade(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_remove_cell_cascade(this.__wbg_ptr, t, n) >>> 0;
  }
  remove_element(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_remove_element(this.__wbg_ptr, t, n) !== 0;
  }
  remove_elements(e) {
    const t = P(e, _.__wbindgen_malloc), n = f;
    return _.wasmlibrary_remove_elements(this.__wbg_ptr, t, n) >>> 0;
  }
  remove_elements_on_layer(e, t) {
    return _.wasmlibrary_remove_elements_on_layer(this.__wbg_ptr, e, t) >>> 0;
  }
  remove_layer_color(e, t) {
    _.wasmlibrary_remove_layer_color(this.__wbg_ptr, e, t);
  }
  rename_cell(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f, i = _.wasmlibrary_rename_cell(this.__wbg_ptr, n, r, c, o);
    if (i[2]) throw A(i[1]);
    return i[0] !== 0;
  }
  set_active_cell(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_set_active_cell(this.__wbg_ptr, t, n) !== 0;
  }
  set_cell_origin(e, t) {
    return _.wasmlibrary_set_cell_origin(this.__wbg_ptr, e, t) !== 0;
  }
  set_cell_ref_array(e, t, n, r, c) {
    const o = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), i = f;
    return _.wasmlibrary_set_cell_ref_array(this.__wbg_ptr, o, i, t, n, r, c) !== 0;
  }
  set_cell_ref_transform(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = I(t, _.__wbindgen_malloc), o = f;
    return _.wasmlibrary_set_cell_ref_transform(this.__wbg_ptr, n, r, c, o) !== 0;
  }
  set_cell_visibility(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f;
    _.wasmlibrary_set_cell_visibility(this.__wbg_ptr, n, r, t);
  }
  set_hierarchy_depth_limit(e) {
    _.wasmlibrary_set_hierarchy_depth_limit(this.__wbg_ptr, e);
  }
  set_layer_color(e, t, n, r, c, o) {
    _.wasmlibrary_set_layer_color(this.__wbg_ptr, e, t, n, r, c, o);
  }
  set_layer_fill_pattern(e, t, n) {
    _.wasmlibrary_set_layer_fill_pattern(this.__wbg_ptr, e, t, n);
  }
  set_text_height(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f;
    return _.wasmlibrary_set_text_height(this.__wbg_ptr, n, r, t) !== 0;
  }
  set_text_position(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    return _.wasmlibrary_set_text_position(this.__wbg_ptr, r, c, t, n) !== 0;
  }
  text_to_polygons(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_text_to_polygons(this.__wbg_ptr, t, n);
    var c = S(r[0], r[1]).slice();
    return _.__wbindgen_free(r[0], r[1] * 4, 4), c;
  }
  to_gds() {
    const e = _.wasmlibrary_to_gds(this.__wbg_ptr);
    if (e[3]) throw A(e[2]);
    var t = E(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 1, 1), t;
  }
  to_json() {
    let e, t;
    try {
      const c = _.wasmlibrary_to_json(this.__wbg_ptr);
      var n = c[0], r = c[1];
      if (c[3]) throw n = 0, r = 0, A(c[2]);
      return e = n, t = r, m(n, r);
    } finally {
      _.__wbindgen_free(e, t, 1);
    }
  }
  to_library_json() {
    let e, t;
    try {
      const c = _.wasmlibrary_to_library_json(this.__wbg_ptr);
      var n = c[0], r = c[1];
      if (c[3]) throw n = 0, r = 0, A(c[2]);
      return e = n, t = r, m(n, r);
    } finally {
      _.__wbindgen_free(e, t, 1);
    }
  }
  translate_element(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    return _.wasmlibrary_translate_element(this.__wbg_ptr, r, c, t, n) !== 0;
  }
  translate_elements(e, t, n) {
    const r = P(e, _.__wbindgen_malloc), c = f;
    return _.wasmlibrary_translate_elements(this.__wbg_ptr, r, c, t, n) >>> 0;
  }
  update_text(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    return _.wasmlibrary_update_text(this.__wbg_ptr, n, r, c, o) !== 0;
  }
}
Symbol.dispose && (T.prototype[Symbol.dispose] = T.prototype.free);
class q {
  static __wrap(e) {
    e = e >>> 0;
    const t = Object.create(q.prototype);
    return t.__wbg_ptr = e, K.register(t, t.__wbg_ptr, t), t;
  }
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, K.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    _.__wbg_wasmrenderer_free(e, 0);
  }
  add_overlay_shape(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f, o = I(t, _.__wbindgen_malloc), i = f, s = N(n, _.__wbindgen_malloc), b = f;
    _.wasmrenderer_add_overlay_shape(this.__wbg_ptr, r, c, o, i, s, b);
  }
  add_shape(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f, o = I(t, _.__wbindgen_malloc), i = f, s = N(n, _.__wbindgen_malloc), b = f;
    _.wasmrenderer_add_shape(this.__wbg_ptr, r, c, o, i, s, b);
  }
  add_to_selection(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    _.wasmrenderer_add_to_selection(this.__wbg_ptr, t, n);
  }
  capture_screenshot() {
    return _.wasmrenderer_capture_screenshot(this.__wbg_ptr);
  }
  clear_laser() {
    _.wasmrenderer_clear_laser(this.__wbg_ptr);
  }
  clear_overlay_shapes() {
    _.wasmrenderer_clear_overlay_shapes(this.__wbg_ptr);
  }
  clear_preview() {
    _.wasmrenderer_clear_preview(this.__wbg_ptr);
  }
  clear_selection() {
    _.wasmrenderer_clear_selection(this.__wbg_ptr);
  }
  clear_shapes() {
    _.wasmrenderer_clear_shapes(this.__wbg_ptr);
  }
  static create(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmrenderer_create(t, n);
  }
  destroy() {
    _.wasmrenderer_destroy(this.__wbg_ptr);
  }
  get_hover() {
    const e = _.wasmrenderer_get_hover(this.__wbg_ptr);
    let t;
    return e[0] !== 0 && (t = m(e[0], e[1]).slice(), _.__wbindgen_free(e[0], e[1] * 1, 1)), t;
  }
  get_hover_ids() {
    const e = _.wasmrenderer_get_hover_ids(this.__wbg_ptr);
    var t = S(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_offset() {
    const e = _.wasmrenderer_get_offset(this.__wbg_ptr);
    var t = v(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 8, 8), t;
  }
  get_selection() {
    const e = _.wasmrenderer_get_selection(this.__wbg_ptr);
    var t = S(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_zoom() {
    return _.wasmrenderer_get_zoom(this.__wbg_ptr);
  }
  mark_dirty() {
    _.wasmrenderer_mark_dirty(this.__wbg_ptr);
  }
  remove_overlay_shape(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    _.wasmrenderer_remove_overlay_shape(this.__wbg_ptr, t, n);
  }
  remove_shape(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    _.wasmrenderer_remove_shape(this.__wbg_ptr, t, n);
  }
  render() {
    _.wasmrenderer_render(this.__wbg_ptr);
  }
  resize(e, t) {
    _.wasmrenderer_resize(this.__wbg_ptr, e, t);
  }
  screen_to_world(e, t) {
    const n = _.wasmrenderer_screen_to_world(this.__wbg_ptr, e, t);
    var r = v(n[0], n[1]).slice();
    return _.__wbindgen_free(n[0], n[1] * 8, 8), r;
  }
  set_crosshair_origin(e, t) {
    _.wasmrenderer_set_crosshair_origin(this.__wbg_ptr, e, t);
  }
  set_dpr(e) {
    _.wasmrenderer_set_dpr(this.__wbg_ptr, e);
  }
  set_grid_visible(e) {
    _.wasmrenderer_set_grid_visible(this.__wbg_ptr, e);
  }
  set_hover(e) {
    var t = l(e) ? 0 : g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    _.wasmrenderer_set_hover(this.__wbg_ptr, t, n);
  }
  set_hover_color(e, t, n, r) {
    _.wasmrenderer_set_hover_color(this.__wbg_ptr, e, t, n, r);
  }
  set_hover_multiple(e) {
    const t = P(e, _.__wbindgen_malloc), n = f;
    _.wasmrenderer_set_hover_multiple(this.__wbg_ptr, t, n);
  }
  set_laser_opacity(e) {
    _.wasmrenderer_set_laser_opacity(this.__wbg_ptr, e);
  }
  set_laser_points(e) {
    const t = I(e, _.__wbindgen_malloc), n = f;
    _.wasmrenderer_set_laser_points(this.__wbg_ptr, t, n);
  }
  set_preview_origin(e, t, n, r) {
    const c = N(r, _.__wbindgen_malloc), o = f;
    _.wasmrenderer_set_preview_origin(this.__wbg_ptr, e, t, n, c, o);
  }
  set_preview_shape(e, t) {
    const n = I(e, _.__wbindgen_malloc), r = f, c = N(t, _.__wbindgen_malloc), o = f;
    _.wasmrenderer_set_preview_shape(this.__wbg_ptr, n, r, c, o);
  }
  set_selection(e) {
    const t = P(e, _.__wbindgen_malloc), n = f;
    _.wasmrenderer_set_selection(this.__wbg_ptr, t, n);
  }
  set_selection_color(e, t, n, r) {
    _.wasmrenderer_set_selection_color(this.__wbg_ptr, e, t, n, r);
  }
  set_theme(e) {
    _.wasmrenderer_set_theme(this.__wbg_ptr, e);
  }
  set_viewport(e, t, n) {
    _.wasmrenderer_set_viewport(this.__wbg_ptr, e, t, n);
  }
  shape_count() {
    return _.wasmrenderer_shape_count(this.__wbg_ptr) >>> 0;
  }
  sync_from_library(e) {
    ge(e, T), _.wasmrenderer_sync_from_library(this.__wbg_ptr, e.__wbg_ptr);
  }
  toggle_selection(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    _.wasmrenderer_toggle_selection(this.__wbg_ptr, t, n);
  }
  update_shape(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = I(t, _.__wbindgen_malloc), o = f;
    _.wasmrenderer_update_shape(this.__wbg_ptr, n, r, c, o);
  }
}
Symbol.dispose && (q.prototype[Symbol.dispose] = q.prototype.free);
function Be() {
  _.init();
}
function ne() {
  return { __proto__: null, "./rosette_wasm_bg.js": { __proto__: null, __wbg_String_8f0eb39a4a4c2f66: function(e, t) {
    const n = String(t), r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_Window_cf5b693340a7c469: function(e) {
    return e.Window;
  }, __wbg_WorkerGlobalScope_354364d1b0bd06e5: function(e) {
    return e.WorkerGlobalScope;
  }, __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: function(e) {
    const t = e, n = typeof t == "boolean" ? t : void 0;
    return l(n) ? 16777215 : n ? 1 : 0;
  }, __wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(e, t) {
    const n = J(t), r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg___wbindgen_is_function_0095a73b8b156f76: function(e) {
    return typeof e == "function";
  }, __wbg___wbindgen_is_null_ac34f5003991759a: function(e) {
    return e === null;
  }, __wbg___wbindgen_is_object_5ae8e5880f2c1fbd: function(e) {
    const t = e;
    return typeof t == "object" && t !== null;
  }, __wbg___wbindgen_is_undefined_9e4d92534c42d778: function(e) {
    return e === void 0;
  }, __wbg___wbindgen_number_get_8ff4255516ccad3e: function(e, t) {
    const n = t, r = typeof n == "number" ? n : void 0;
    p().setFloat64(e + 8, l(r) ? 0 : r, true), p().setInt32(e + 0, !l(r), true);
  }, __wbg___wbindgen_string_get_72fb696202c56729: function(e, t) {
    const n = t, r = typeof n == "string" ? n : void 0;
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg___wbindgen_throw_be289d5034ed271b: function(e, t) {
    throw new Error(m(e, t));
  }, __wbg__wbg_cb_unref_d9b87ff7982e3b21: function(e) {
    e._wbg_cb_unref();
  }, __wbg_activeTexture_6f9a710514686c24: function(e, t) {
    e.activeTexture(t >>> 0);
  }, __wbg_activeTexture_7e39cb8fdf4b6d5a: function(e, t) {
    e.activeTexture(t >>> 0);
  }, __wbg_attachShader_32114efcf2744eb6: function(e, t, n) {
    e.attachShader(t, n);
  }, __wbg_attachShader_b36058e5c9eeaf54: function(e, t, n) {
    e.attachShader(t, n);
  }, __wbg_beginComputePass_90d5303e604970cb: function(e, t) {
    return e.beginComputePass(t);
  }, __wbg_beginQuery_0fdf154e1da0e73d: function(e, t, n) {
    e.beginQuery(t >>> 0, n);
  }, __wbg_beginRenderPass_9739520c601001c3: function(e, t) {
    return e.beginRenderPass(t);
  }, __wbg_bindAttribLocation_5cfc7fa688df5051: function(e, t, n, r, c) {
    e.bindAttribLocation(t, n >>> 0, m(r, c));
  }, __wbg_bindAttribLocation_ce78bfb13019dbe6: function(e, t, n, r, c) {
    e.bindAttribLocation(t, n >>> 0, m(r, c));
  }, __wbg_bindBufferRange_009d206fe9e4151e: function(e, t, n, r, c, o) {
    e.bindBufferRange(t >>> 0, n >>> 0, r, c, o);
  }, __wbg_bindBuffer_69a7a0b8f3f9b9cf: function(e, t, n) {
    e.bindBuffer(t >>> 0, n);
  }, __wbg_bindBuffer_c9068e8712a034f5: function(e, t, n) {
    e.bindBuffer(t >>> 0, n);
  }, __wbg_bindFramebuffer_031c73ba501cb8f6: function(e, t, n) {
    e.bindFramebuffer(t >>> 0, n);
  }, __wbg_bindFramebuffer_7815ca611abb057f: function(e, t, n) {
    e.bindFramebuffer(t >>> 0, n);
  }, __wbg_bindRenderbuffer_8a2aa4e3d1fb5443: function(e, t, n) {
    e.bindRenderbuffer(t >>> 0, n);
  }, __wbg_bindRenderbuffer_db37c1bac9ed4da0: function(e, t, n) {
    e.bindRenderbuffer(t >>> 0, n);
  }, __wbg_bindSampler_96f0e90e7bc31da9: function(e, t, n) {
    e.bindSampler(t >>> 0, n);
  }, __wbg_bindTexture_b2b7b1726a83f93e: function(e, t, n) {
    e.bindTexture(t >>> 0, n);
  }, __wbg_bindTexture_ec13ddcb9dc8e032: function(e, t, n) {
    e.bindTexture(t >>> 0, n);
  }, __wbg_bindVertexArrayOES_c2610602f7485b3f: function(e, t) {
    e.bindVertexArrayOES(t);
  }, __wbg_bindVertexArray_78220d1edb1d2382: function(e, t) {
    e.bindVertexArray(t);
  }, __wbg_blendColor_1d50ac87d9a2794b: function(e, t, n, r, c) {
    e.blendColor(t, n, r, c);
  }, __wbg_blendColor_e799d452ab2a5788: function(e, t, n, r, c) {
    e.blendColor(t, n, r, c);
  }, __wbg_blendEquationSeparate_1b12c43928cc7bc1: function(e, t, n) {
    e.blendEquationSeparate(t >>> 0, n >>> 0);
  }, __wbg_blendEquationSeparate_a8094fbec94cf80e: function(e, t, n) {
    e.blendEquationSeparate(t >>> 0, n >>> 0);
  }, __wbg_blendEquation_82202f34c4c00e50: function(e, t) {
    e.blendEquation(t >>> 0);
  }, __wbg_blendEquation_e9b99928ed1494ad: function(e, t) {
    e.blendEquation(t >>> 0);
  }, __wbg_blendFuncSeparate_95465944f788a092: function(e, t, n, r, c) {
    e.blendFuncSeparate(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_blendFuncSeparate_f366c170c5097fbe: function(e, t, n, r, c) {
    e.blendFuncSeparate(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_blendFunc_2ef59299d10c662d: function(e, t, n) {
    e.blendFunc(t >>> 0, n >>> 0);
  }, __wbg_blendFunc_446658e7231ab9c8: function(e, t, n) {
    e.blendFunc(t >>> 0, n >>> 0);
  }, __wbg_blitFramebuffer_d730a23ab4db248e: function(e, t, n, r, c, o, i, s, b, u, y) {
    e.blitFramebuffer(t, n, r, c, o, i, s, b, u >>> 0, y >>> 0);
  }, __wbg_bufferData_1be8450fab534758: function(e, t, n, r) {
    e.bufferData(t >>> 0, n, r >>> 0);
  }, __wbg_bufferData_32d26eba0c74a53c: function(e, t, n, r) {
    e.bufferData(t >>> 0, n, r >>> 0);
  }, __wbg_bufferData_52235e85894af988: function(e, t, n, r) {
    e.bufferData(t >>> 0, n, r >>> 0);
  }, __wbg_bufferData_98f6c413a8f0f139: function(e, t, n, r) {
    e.bufferData(t >>> 0, n, r >>> 0);
  }, __wbg_bufferSubData_33eebcc173094f6a: function(e, t, n, r) {
    e.bufferSubData(t >>> 0, n, r);
  }, __wbg_bufferSubData_3e902f031adf13fd: function(e, t, n, r) {
    e.bufferSubData(t >>> 0, n, r);
  }, __wbg_buffer_26d0910f3a5bc899: function(e) {
    return e.buffer;
  }, __wbg_call_389efe28435a9388: function() {
    return d(function(e, t) {
      return e.call(t);
    }, arguments);
  }, __wbg_call_4708e0c13bdc8e95: function() {
    return d(function(e, t, n) {
      return e.call(t, n);
    }, arguments);
  }, __wbg_clearBuffer_6164fc25d22b25cc: function(e, t, n, r) {
    e.clearBuffer(t, n, r);
  }, __wbg_clearBuffer_cfcaaf1fb2baa885: function(e, t, n) {
    e.clearBuffer(t, n);
  }, __wbg_clearBufferfv_ac87d92e2f45d80c: function(e, t, n, r, c) {
    e.clearBufferfv(t >>> 0, n, h(r, c));
  }, __wbg_clearBufferiv_69ff24bb52ec4c88: function(e, t, n, r, c) {
    e.clearBufferiv(t >>> 0, n, D(r, c));
  }, __wbg_clearBufferuiv_8ad59a8219aafaca: function(e, t, n, r, c) {
    e.clearBufferuiv(t >>> 0, n, B(r, c));
  }, __wbg_clearDepth_2b109f644a783a53: function(e, t) {
    e.clearDepth(t);
  }, __wbg_clearDepth_670099db422a4f91: function(e, t) {
    e.clearDepth(t);
  }, __wbg_clearStencil_5d243d0dff03c315: function(e, t) {
    e.clearStencil(t);
  }, __wbg_clearStencil_aa65955bb39d8c18: function(e, t) {
    e.clearStencil(t);
  }, __wbg_clear_4d801d0d054c3579: function(e, t) {
    e.clear(t >>> 0);
  }, __wbg_clear_7187030f892c5ca0: function(e, t) {
    e.clear(t >>> 0);
  }, __wbg_clientHeight_6432ff0d61ccfe7d: function(e) {
    return e.clientHeight;
  }, __wbg_clientWaitSync_21865feaeb76a9a5: function(e, t, n, r) {
    return e.clientWaitSync(t, n >>> 0, r >>> 0);
  }, __wbg_clientWidth_dcf89c40d88df4a3: function(e) {
    return e.clientWidth;
  }, __wbg_colorMask_177d9762658e5e28: function(e, t, n, r, c) {
    e.colorMask(t !== 0, n !== 0, r !== 0, c !== 0);
  }, __wbg_colorMask_7a8dbc86e7376a9b: function(e, t, n, r, c) {
    e.colorMask(t !== 0, n !== 0, r !== 0, c !== 0);
  }, __wbg_compileShader_63b824e86bb00b8f: function(e, t) {
    e.compileShader(t);
  }, __wbg_compileShader_94718a93495d565d: function(e, t) {
    e.compileShader(t);
  }, __wbg_compressedTexSubImage2D_215bb115facd5e48: function(e, t, n, r, c, o, i, s, b) {
    e.compressedTexSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b);
  }, __wbg_compressedTexSubImage2D_684350eb62830032: function(e, t, n, r, c, o, i, s, b) {
    e.compressedTexSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b);
  }, __wbg_compressedTexSubImage2D_d8fbae93bb8c4cc9: function(e, t, n, r, c, o, i, s, b, u) {
    e.compressedTexSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b, u);
  }, __wbg_compressedTexSubImage3D_16afa3a47bf1d979: function(e, t, n, r, c, o, i, s, b, u, y) {
    e.compressedTexSubImage3D(t >>> 0, n, r, c, o, i, s, b, u >>> 0, y);
  }, __wbg_compressedTexSubImage3D_778008a6293f15ab: function(e, t, n, r, c, o, i, s, b, u, y, x) {
    e.compressedTexSubImage3D(t >>> 0, n, r, c, o, i, s, b, u >>> 0, y, x);
  }, __wbg_configure_2414aed971d368cd: function(e, t) {
    e.configure(t);
  }, __wbg_copyBufferSubData_a4f9815861ff0ae9: function(e, t, n, r, c, o) {
    e.copyBufferSubData(t >>> 0, n >>> 0, r, c, o);
  }, __wbg_copyBufferToBuffer_1ba67191114656a1: function(e, t, n, r, c, o) {
    e.copyBufferToBuffer(t, n, r, c, o);
  }, __wbg_copyBufferToTexture_878d31d479e48f28: function(e, t, n, r) {
    e.copyBufferToTexture(t, n, r);
  }, __wbg_copyExternalImageToTexture_7878d196c0b60d39: function(e, t, n, r) {
    e.copyExternalImageToTexture(t, n, r);
  }, __wbg_copyTexSubImage2D_417a65926e3d2490: function(e, t, n, r, c, o, i, s, b) {
    e.copyTexSubImage2D(t >>> 0, n, r, c, o, i, s, b);
  }, __wbg_copyTexSubImage2D_91ebcd9cd1908265: function(e, t, n, r, c, o, i, s, b) {
    e.copyTexSubImage2D(t >>> 0, n, r, c, o, i, s, b);
  }, __wbg_copyTexSubImage3D_f62ef4c4eeb9a7dc: function(e, t, n, r, c, o, i, s, b, u) {
    e.copyTexSubImage3D(t >>> 0, n, r, c, o, i, s, b, u);
  }, __wbg_copyTextureToBuffer_6a8fe0e90f0a663d: function(e, t, n, r) {
    e.copyTextureToBuffer(t, n, r);
  }, __wbg_copyTextureToTexture_0a06a393d6726b4a: function(e, t, n, r) {
    e.copyTextureToTexture(t, n, r);
  }, __wbg_createBindGroupLayout_1d93b6d41c87ba9d: function(e, t) {
    return e.createBindGroupLayout(t);
  }, __wbg_createBindGroup_61cd07ec9d423432: function(e, t) {
    return e.createBindGroup(t);
  }, __wbg_createBuffer_26534c05e01b8559: function(e) {
    const t = e.createBuffer();
    return l(t) ? 0 : w(t);
  }, __wbg_createBuffer_963aa00d5fe859e4: function(e, t) {
    return e.createBuffer(t);
  }, __wbg_createBuffer_c4ec897aacc1b91c: function(e) {
    const t = e.createBuffer();
    return l(t) ? 0 : w(t);
  }, __wbg_createCommandEncoder_f0e1613e9a2dc1eb: function(e, t) {
    return e.createCommandEncoder(t);
  }, __wbg_createComputePipeline_b9616b9fe2f4eb2f: function(e, t) {
    return e.createComputePipeline(t);
  }, __wbg_createFramebuffer_41512c38358a41c4: function(e) {
    const t = e.createFramebuffer();
    return l(t) ? 0 : w(t);
  }, __wbg_createFramebuffer_b88ffa8e0fd262c4: function(e) {
    const t = e.createFramebuffer();
    return l(t) ? 0 : w(t);
  }, __wbg_createPipelineLayout_56c6cf983f892d2b: function(e, t) {
    return e.createPipelineLayout(t);
  }, __wbg_createProgram_98aaa91f7c81c5e2: function(e) {
    const t = e.createProgram();
    return l(t) ? 0 : w(t);
  }, __wbg_createProgram_9b7710a1f2701c2c: function(e) {
    const t = e.createProgram();
    return l(t) ? 0 : w(t);
  }, __wbg_createQuerySet_c14be802adf7c207: function(e, t) {
    return e.createQuerySet(t);
  }, __wbg_createQuery_7988050efd7e4c48: function(e) {
    const t = e.createQuery();
    return l(t) ? 0 : w(t);
  }, __wbg_createRenderBundleEncoder_8e4bdffea72f8c1f: function(e, t) {
    return e.createRenderBundleEncoder(t);
  }, __wbg_createRenderPipeline_079a88a0601fcce1: function(e, t) {
    return e.createRenderPipeline(t);
  }, __wbg_createRenderbuffer_1e567f2f4d461710: function(e) {
    const t = e.createRenderbuffer();
    return l(t) ? 0 : w(t);
  }, __wbg_createRenderbuffer_a601226a6a680dbe: function(e) {
    const t = e.createRenderbuffer();
    return l(t) ? 0 : w(t);
  }, __wbg_createSampler_da6bb96c9ffaaa27: function(e) {
    const t = e.createSampler();
    return l(t) ? 0 : w(t);
  }, __wbg_createSampler_ef5578990df3baf7: function(e, t) {
    return e.createSampler(t);
  }, __wbg_createShaderModule_17f451ea25cae47c: function(e, t) {
    return e.createShaderModule(t);
  }, __wbg_createShader_e3ac08ed8c5b14b2: function(e, t) {
    const n = e.createShader(t >>> 0);
    return l(n) ? 0 : w(n);
  }, __wbg_createShader_f2b928ca9a426b14: function(e, t) {
    const n = e.createShader(t >>> 0);
    return l(n) ? 0 : w(n);
  }, __wbg_createTexture_01cc1cd2fea732d9: function(e, t) {
    return e.createTexture(t);
  }, __wbg_createTexture_16d2c8a3d7d4a75a: function(e) {
    const t = e.createTexture();
    return l(t) ? 0 : w(t);
  }, __wbg_createTexture_f9451a82c7527ce2: function(e) {
    const t = e.createTexture();
    return l(t) ? 0 : w(t);
  }, __wbg_createVertexArrayOES_bd76ceee6ab9b95e: function(e) {
    const t = e.createVertexArrayOES();
    return l(t) ? 0 : w(t);
  }, __wbg_createVertexArray_ad5294951ae57497: function(e) {
    const t = e.createVertexArray();
    return l(t) ? 0 : w(t);
  }, __wbg_createView_04701884291e1ccc: function(e, t) {
    return e.createView(t);
  }, __wbg_cullFace_39500f654c67a205: function(e, t) {
    e.cullFace(t >>> 0);
  }, __wbg_cullFace_e7e711a14d2c3f48: function(e, t) {
    e.cullFace(t >>> 0);
  }, __wbg_debug_a4099fa12db6cd61: function(e) {
    console.debug(e);
  }, __wbg_deleteBuffer_22fcc93912cbf659: function(e, t) {
    e.deleteBuffer(t);
  }, __wbg_deleteBuffer_ab099883c168644d: function(e, t) {
    e.deleteBuffer(t);
  }, __wbg_deleteFramebuffer_8de1ca41ac87cfd9: function(e, t) {
    e.deleteFramebuffer(t);
  }, __wbg_deleteFramebuffer_9738f3bb85c1ab35: function(e, t) {
    e.deleteFramebuffer(t);
  }, __wbg_deleteProgram_9298fb3e3c1d3a78: function(e, t) {
    e.deleteProgram(t);
  }, __wbg_deleteProgram_f354e79b8cae8076: function(e, t) {
    e.deleteProgram(t);
  }, __wbg_deleteQuery_ea8bf1954febd774: function(e, t) {
    e.deleteQuery(t);
  }, __wbg_deleteRenderbuffer_096edada57729468: function(e, t) {
    e.deleteRenderbuffer(t);
  }, __wbg_deleteRenderbuffer_0f565f0727b341fc: function(e, t) {
    e.deleteRenderbuffer(t);
  }, __wbg_deleteSampler_c6b68c4071841afa: function(e, t) {
    e.deleteSampler(t);
  }, __wbg_deleteShader_aaf3b520a64d5d9d: function(e, t) {
    e.deleteShader(t);
  }, __wbg_deleteShader_ff70ca962883e241: function(e, t) {
    e.deleteShader(t);
  }, __wbg_deleteSync_c8e4a9c735f71d18: function(e, t) {
    e.deleteSync(t);
  }, __wbg_deleteTexture_2be78224e5584a8b: function(e, t) {
    e.deleteTexture(t);
  }, __wbg_deleteTexture_9d411c0e60ffa324: function(e, t) {
    e.deleteTexture(t);
  }, __wbg_deleteVertexArrayOES_197df47ef9684195: function(e, t) {
    e.deleteVertexArrayOES(t);
  }, __wbg_deleteVertexArray_7bc7f92769862f93: function(e, t) {
    e.deleteVertexArray(t);
  }, __wbg_depthFunc_eb3aa05361dd2eaa: function(e, t) {
    e.depthFunc(t >>> 0);
  }, __wbg_depthFunc_f670d4cbb9cd0913: function(e, t) {
    e.depthFunc(t >>> 0);
  }, __wbg_depthMask_103091329ca1a750: function(e, t) {
    e.depthMask(t !== 0);
  }, __wbg_depthMask_75a36d0065471a4b: function(e, t) {
    e.depthMask(t !== 0);
  }, __wbg_depthRange_337bf254e67639bb: function(e, t, n) {
    e.depthRange(t, n);
  }, __wbg_depthRange_5579d448b9d7de57: function(e, t, n) {
    e.depthRange(t, n);
  }, __wbg_destroy_35f94012e5bb9c17: function(e) {
    e.destroy();
  }, __wbg_destroy_767d9dde1008e293: function(e) {
    e.destroy();
  }, __wbg_destroy_c6af4226dda95dbd: function(e) {
    e.destroy();
  }, __wbg_disableVertexAttribArray_24a020060006b10f: function(e, t) {
    e.disableVertexAttribArray(t >>> 0);
  }, __wbg_disableVertexAttribArray_4bac633c27bae599: function(e, t) {
    e.disableVertexAttribArray(t >>> 0);
  }, __wbg_disable_7fe6fb3e97717f88: function(e, t) {
    e.disable(t >>> 0);
  }, __wbg_disable_bd37bdcca1764aea: function(e, t) {
    e.disable(t >>> 0);
  }, __wbg_dispatchWorkgroupsIndirect_8b25efab93a7a433: function(e, t, n) {
    e.dispatchWorkgroupsIndirect(t, n);
  }, __wbg_dispatchWorkgroups_c102fa81b955935d: function(e, t, n, r) {
    e.dispatchWorkgroups(t >>> 0, n >>> 0, r >>> 0);
  }, __wbg_document_ee35a3d3ae34ef6c: function(e) {
    const t = e.document;
    return l(t) ? 0 : w(t);
  }, __wbg_drawArraysInstancedANGLE_9e4cc507eae8b24d: function(e, t, n, r, c) {
    e.drawArraysInstancedANGLE(t >>> 0, n, r, c);
  }, __wbg_drawArraysInstanced_ec30adc616ec58d5: function(e, t, n, r, c) {
    e.drawArraysInstanced(t >>> 0, n, r, c);
  }, __wbg_drawArrays_075228181299b824: function(e, t, n, r) {
    e.drawArrays(t >>> 0, n, r);
  }, __wbg_drawArrays_2be89c369a29f30b: function(e, t, n, r) {
    e.drawArrays(t >>> 0, n, r);
  }, __wbg_drawBuffersWEBGL_447bc0a21f8ef22d: function(e, t) {
    e.drawBuffersWEBGL(t);
  }, __wbg_drawBuffers_5eccfaacc6560299: function(e, t) {
    e.drawBuffers(t);
  }, __wbg_drawElementsInstancedANGLE_6f9da0b845ac6c4e: function(e, t, n, r, c, o) {
    e.drawElementsInstancedANGLE(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_drawElementsInstanced_d41fc920ae24717c: function(e, t, n, r, c, o) {
    e.drawElementsInstanced(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_drawIndexedIndirect_34484fc6227c7bc8: function(e, t, n) {
    e.drawIndexedIndirect(t, n);
  }, __wbg_drawIndexedIndirect_5a7c30bb5f1d5b67: function(e, t, n) {
    e.drawIndexedIndirect(t, n);
  }, __wbg_drawIndexed_115af1449b52a948: function(e, t, n, r, c, o) {
    e.drawIndexed(t >>> 0, n >>> 0, r >>> 0, c, o >>> 0);
  }, __wbg_drawIndexed_a587cce4c317791f: function(e, t, n, r, c, o) {
    e.drawIndexed(t >>> 0, n >>> 0, r >>> 0, c, o >>> 0);
  }, __wbg_drawIndirect_036d71498a21f1a3: function(e, t, n) {
    e.drawIndirect(t, n);
  }, __wbg_drawIndirect_a1d7c5e893aa5756: function(e, t, n) {
    e.drawIndirect(t, n);
  }, __wbg_draw_5351b12033166aca: function(e, t, n, r, c) {
    e.draw(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_draw_e2a7c5d66fb2d244: function(e, t, n, r, c) {
    e.draw(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_enableVertexAttribArray_475e06c31777296d: function(e, t) {
    e.enableVertexAttribArray(t >>> 0);
  }, __wbg_enableVertexAttribArray_aa6e40408261eeb9: function(e, t) {
    e.enableVertexAttribArray(t >>> 0);
  }, __wbg_enable_d1ac04dfdd2fb3ae: function(e, t) {
    e.enable(t >>> 0);
  }, __wbg_enable_fee40f19b7053ea3: function(e, t) {
    e.enable(t >>> 0);
  }, __wbg_endQuery_54f0627d4c931318: function(e, t) {
    e.endQuery(t >>> 0);
  }, __wbg_end_0ac71677a5c1717a: function(e) {
    e.end();
  }, __wbg_end_6f776519f1faa582: function(e) {
    e.end();
  }, __wbg_error_7534b8e9a36f1ab4: function(e, t) {
    let n, r;
    try {
      n = e, r = t, console.error(m(e, t));
    } finally {
      _.__wbindgen_free(n, r, 1);
    }
  }, __wbg_error_9a7fe3f932034cde: function(e) {
    console.error(e);
  }, __wbg_error_e98e6aadd08e0b94: function(e) {
    return e.error;
  }, __wbg_executeBundles_8e6c0614da2805d4: function(e, t) {
    e.executeBundles(t);
  }, __wbg_features_1b464383ea8a7691: function(e) {
    return e.features;
  }, __wbg_features_e5fbbc2760867852: function(e) {
    return e.features;
  }, __wbg_fenceSync_c52a4e24eabfa0d3: function(e, t, n) {
    const r = e.fenceSync(t >>> 0, n >>> 0);
    return l(r) ? 0 : w(r);
  }, __wbg_finish_20711371c58df61c: function(e) {
    return e.finish();
  }, __wbg_finish_34b2c54329c8719f: function(e, t) {
    return e.finish(t);
  }, __wbg_finish_a9ab917e756ea00c: function(e, t) {
    return e.finish(t);
  }, __wbg_finish_e0a6c97c0622f843: function(e) {
    return e.finish();
  }, __wbg_framebufferRenderbuffer_850811ed6e26475e: function(e, t, n, r, c) {
    e.framebufferRenderbuffer(t >>> 0, n >>> 0, r >>> 0, c);
  }, __wbg_framebufferRenderbuffer_cd9d55a68a2300ea: function(e, t, n, r, c) {
    e.framebufferRenderbuffer(t >>> 0, n >>> 0, r >>> 0, c);
  }, __wbg_framebufferTexture2D_8adf6bdfc3c56dee: function(e, t, n, r, c, o) {
    e.framebufferTexture2D(t >>> 0, n >>> 0, r >>> 0, c, o);
  }, __wbg_framebufferTexture2D_c283e928186aa542: function(e, t, n, r, c, o) {
    e.framebufferTexture2D(t >>> 0, n >>> 0, r >>> 0, c, o);
  }, __wbg_framebufferTextureLayer_c8328828c8d5eb60: function(e, t, n, r, c, o) {
    e.framebufferTextureLayer(t >>> 0, n >>> 0, r, c, o);
  }, __wbg_framebufferTextureMultiviewOVR_16d049b41d692b91: function(e, t, n, r, c, o, i) {
    e.framebufferTextureMultiviewOVR(t >>> 0, n >>> 0, r, c, o, i);
  }, __wbg_frontFace_027e2ec7a7bc347c: function(e, t) {
    e.frontFace(t >>> 0);
  }, __wbg_frontFace_d4a6507ad2939b5c: function(e, t) {
    e.frontFace(t >>> 0);
  }, __wbg_getBindGroupLayout_4a94df6108ac6667: function(e, t) {
    return e.getBindGroupLayout(t >>> 0);
  }, __wbg_getBindGroupLayout_80e803d942962f6a: function(e, t) {
    return e.getBindGroupLayout(t >>> 0);
  }, __wbg_getBufferSubData_4fc54b4fbb1462d7: function(e, t, n, r) {
    e.getBufferSubData(t >>> 0, n, r);
  }, __wbg_getCompilationInfo_2af3ecdfeda551a3: function(e) {
    return e.getCompilationInfo();
  }, __wbg_getContext_2966500392030d63: function() {
    return d(function(e, t, n) {
      const r = e.getContext(m(t, n));
      return l(r) ? 0 : w(r);
    }, arguments);
  }, __wbg_getContext_2a5764d48600bc43: function() {
    return d(function(e, t, n) {
      const r = e.getContext(m(t, n));
      return l(r) ? 0 : w(r);
    }, arguments);
  }, __wbg_getContext_b28d2db7bd648242: function() {
    return d(function(e, t, n, r) {
      const c = e.getContext(m(t, n), r);
      return l(c) ? 0 : w(c);
    }, arguments);
  }, __wbg_getContext_de810d9f187f29ca: function() {
    return d(function(e, t, n, r) {
      const c = e.getContext(m(t, n), r);
      return l(c) ? 0 : w(c);
    }, arguments);
  }, __wbg_getCurrentTexture_5a79cda2ff36e1ee: function(e) {
    return e.getCurrentTexture();
  }, __wbg_getElementById_e34377b79d7285f6: function(e, t, n) {
    const r = e.getElementById(m(t, n));
    return l(r) ? 0 : w(r);
  }, __wbg_getExtension_3c0cb5ae01bb4b17: function() {
    return d(function(e, t, n) {
      const r = e.getExtension(m(t, n));
      return l(r) ? 0 : w(r);
    }, arguments);
  }, __wbg_getIndexedParameter_ca1693c768bc4934: function() {
    return d(function(e, t, n) {
      return e.getIndexedParameter(t >>> 0, n >>> 0);
    }, arguments);
  }, __wbg_getMappedRange_932dd043ae22ee0a: function(e, t, n) {
    return e.getMappedRange(t, n);
  }, __wbg_getParameter_1ecb910cfdd21f88: function() {
    return d(function(e, t) {
      return e.getParameter(t >>> 0);
    }, arguments);
  }, __wbg_getParameter_2e1f97ecaab76274: function() {
    return d(function(e, t) {
      return e.getParameter(t >>> 0);
    }, arguments);
  }, __wbg_getPreferredCanvasFormat_de73c02773a5209e: function(e) {
    const t = e.getPreferredCanvasFormat();
    return (ue.indexOf(t) + 1 || 96) - 1;
  }, __wbg_getProgramInfoLog_2ffa30e3abb8b5c2: function(e, t, n) {
    const r = t.getProgramInfoLog(n);
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg_getProgramInfoLog_dbfda4b6e7eb1b37: function(e, t, n) {
    const r = t.getProgramInfoLog(n);
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg_getProgramParameter_43fbc6d2613c08b3: function(e, t, n) {
    return e.getProgramParameter(t, n >>> 0);
  }, __wbg_getProgramParameter_92e4540ca9da06b2: function(e, t, n) {
    return e.getProgramParameter(t, n >>> 0);
  }, __wbg_getQueryParameter_5d6af051438ae479: function(e, t, n) {
    return e.getQueryParameter(t, n >>> 0);
  }, __wbg_getRandomValues_9c5c1b115e142bb8: function() {
    return d(function(e, t) {
      globalThis.crypto.getRandomValues(E(e, t));
    }, arguments);
  }, __wbg_getShaderInfoLog_9991e9e77b0c6805: function(e, t, n) {
    const r = t.getShaderInfoLog(n);
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg_getShaderInfoLog_9e0b96da4b13ae49: function(e, t, n) {
    const r = t.getShaderInfoLog(n);
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg_getShaderParameter_786fd84f85720ca8: function(e, t, n) {
    return e.getShaderParameter(t, n >>> 0);
  }, __wbg_getShaderParameter_afa4a3dd9dd397c1: function(e, t, n) {
    return e.getShaderParameter(t, n >>> 0);
  }, __wbg_getSupportedExtensions_57142a6b598d7787: function(e) {
    const t = e.getSupportedExtensions();
    return l(t) ? 0 : w(t);
  }, __wbg_getSupportedProfiles_1f728bc32003c4d0: function(e) {
    const t = e.getSupportedProfiles();
    return l(t) ? 0 : w(t);
  }, __wbg_getSyncParameter_7d11ab875b41617e: function(e, t, n) {
    return e.getSyncParameter(t, n >>> 0);
  }, __wbg_getUniformBlockIndex_1ee7e922e6d96d7e: function(e, t, n, r) {
    return e.getUniformBlockIndex(t, m(n, r));
  }, __wbg_getUniformLocation_71c070e6644669ad: function(e, t, n, r) {
    const c = e.getUniformLocation(t, m(n, r));
    return l(c) ? 0 : w(c);
  }, __wbg_getUniformLocation_d06b3a5b3c60e95c: function(e, t, n, r) {
    const c = e.getUniformLocation(t, m(n, r));
    return l(c) ? 0 : w(c);
  }, __wbg_get_9b94d73e6221f75c: function(e, t) {
    return e[t >>> 0];
  }, __wbg_get_d8db2ad31d529ff8: function(e, t) {
    const n = e[t >>> 0];
    return l(n) ? 0 : w(n);
  }, __wbg_gpu_87871e8f7ace8fee: function(e) {
    return e.gpu;
  }, __wbg_has_624cbf0451d880e8: function(e, t, n) {
    return e.has(m(t, n));
  }, __wbg_height_38750dc6de41ee75: function(e) {
    return e.height;
  }, __wbg_height_408f385de046f7e5: function(e) {
    return e.height;
  }, __wbg_height_87250db2be5164b9: function(e) {
    return e.height;
  }, __wbg_height_9a49d61734f6cf36: function(e) {
    return e.height;
  }, __wbg_height_aceb0c14551ea27d: function(e) {
    return e.height;
  }, __wbg_includes_32215c836f1cd3fb: function(e, t, n) {
    return e.includes(t, n);
  }, __wbg_info_148d043840582012: function(e) {
    console.info(e);
  }, __wbg_instanceof_GpuAdapter_0731153d2b08720b: function(e) {
    let t;
    try {
      t = e instanceof GPUAdapter;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_GpuCanvasContext_d14121c7bd72fcef: function(e) {
    let t;
    try {
      t = e instanceof GPUCanvasContext;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_GpuDeviceLostInfo_a3677ebb8241d800: function(e) {
    let t;
    try {
      t = e instanceof GPUDeviceLostInfo;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_GpuOutOfMemoryError_391d9a08edbfa04b: function(e) {
    let t;
    try {
      t = e instanceof GPUOutOfMemoryError;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_GpuValidationError_f4d803c383da3c92: function(e) {
    let t;
    try {
      t = e instanceof GPUValidationError;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_HtmlCanvasElement_3f2f6e1edb1c9792: function(e) {
    let t;
    try {
      t = e instanceof HTMLCanvasElement;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_Object_1c6af87502b733ed: function(e) {
    let t;
    try {
      t = e instanceof Object;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_WebGl2RenderingContext_4a08a94517ed5240: function(e) {
    let t;
    try {
      t = e instanceof WebGL2RenderingContext;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_Window_ed49b2db8df90359: function(e) {
    let t;
    try {
      t = e instanceof Window;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_invalidateFramebuffer_b17b7e1da3051745: function() {
    return d(function(e, t, n) {
      e.invalidateFramebuffer(t >>> 0, n);
    }, arguments);
  }, __wbg_is_f29129f676e5410c: function(e, t) {
    return Object.is(e, t);
  }, __wbg_label_2082ab37d2ad170d: function(e, t) {
    const n = t.label, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_length_32ed9a279acd054c: function(e) {
    return e.length;
  }, __wbg_length_35a7bace40f36eac: function(e) {
    return e.length;
  }, __wbg_length_9df32f7add647235: function(e) {
    return e.length;
  }, __wbg_length_f7386240689107f3: function(e) {
    return e.length;
  }, __wbg_limits_2dd632c891786ddf: function(e) {
    return e.limits;
  }, __wbg_limits_f6411f884b0b2d62: function(e) {
    return e.limits;
  }, __wbg_lineNum_0246de1e072ffe19: function(e) {
    return e.lineNum;
  }, __wbg_linkProgram_6600dd2c0863bbfd: function(e, t) {
    e.linkProgram(t);
  }, __wbg_linkProgram_be6b825cf66d177b: function(e, t) {
    e.linkProgram(t);
  }, __wbg_log_6b5ca2e6124b2808: function(e) {
    console.log(e);
  }, __wbg_lost_6e4d29847ce2a34a: function(e) {
    return e.lost;
  }, __wbg_mapAsync_37f5e03edf2e1352: function(e, t, n, r) {
    return e.mapAsync(t >>> 0, n, r);
  }, __wbg_maxBindGroups_768ca5e8623bf450: function(e) {
    return e.maxBindGroups;
  }, __wbg_maxBindingsPerBindGroup_057972d600d69719: function(e) {
    return e.maxBindingsPerBindGroup;
  }, __wbg_maxBufferSize_e237b44f19a5a62b: function(e) {
    return e.maxBufferSize;
  }, __wbg_maxColorAttachmentBytesPerSample_d6c7b4051d22c6d6: function(e) {
    return e.maxColorAttachmentBytesPerSample;
  }, __wbg_maxColorAttachments_7a18ba24c05edcfd: function(e) {
    return e.maxColorAttachments;
  }, __wbg_maxComputeInvocationsPerWorkgroup_b99c2f3611633992: function(e) {
    return e.maxComputeInvocationsPerWorkgroup;
  }, __wbg_maxComputeWorkgroupSizeX_adb26da9ed7f77f7: function(e) {
    return e.maxComputeWorkgroupSizeX;
  }, __wbg_maxComputeWorkgroupSizeY_cc217559c98be33b: function(e) {
    return e.maxComputeWorkgroupSizeY;
  }, __wbg_maxComputeWorkgroupSizeZ_66606a80e2cf2309: function(e) {
    return e.maxComputeWorkgroupSizeZ;
  }, __wbg_maxComputeWorkgroupStorageSize_cb6235497b8c4997: function(e) {
    return e.maxComputeWorkgroupStorageSize;
  }, __wbg_maxComputeWorkgroupsPerDimension_6bf550b5f21d57cf: function(e) {
    return e.maxComputeWorkgroupsPerDimension;
  }, __wbg_maxDynamicStorageBuffersPerPipelineLayout_c6ac20334e328b47: function(e) {
    return e.maxDynamicStorageBuffersPerPipelineLayout;
  }, __wbg_maxDynamicUniformBuffersPerPipelineLayout_aa8f14a74b440f01: function(e) {
    return e.maxDynamicUniformBuffersPerPipelineLayout;
  }, __wbg_maxSampledTexturesPerShaderStage_db7c4922cc60144a: function(e) {
    return e.maxSampledTexturesPerShaderStage;
  }, __wbg_maxSamplersPerShaderStage_538705fe2263e710: function(e) {
    return e.maxSamplersPerShaderStage;
  }, __wbg_maxStorageBufferBindingSize_32178c0f5f7f85cb: function(e) {
    return e.maxStorageBufferBindingSize;
  }, __wbg_maxStorageBuffersPerShaderStage_9f67e9eae0089f77: function(e) {
    return e.maxStorageBuffersPerShaderStage;
  }, __wbg_maxStorageTexturesPerShaderStage_57239664936031cf: function(e) {
    return e.maxStorageTexturesPerShaderStage;
  }, __wbg_maxTextureArrayLayers_db5d4e486c78ae04: function(e) {
    return e.maxTextureArrayLayers;
  }, __wbg_maxTextureDimension1D_3475085ffacabbdc: function(e) {
    return e.maxTextureDimension1D;
  }, __wbg_maxTextureDimension2D_7c8d5ecf09eb8519: function(e) {
    return e.maxTextureDimension2D;
  }, __wbg_maxTextureDimension3D_8bd976677a0f91d4: function(e) {
    return e.maxTextureDimension3D;
  }, __wbg_maxUniformBufferBindingSize_95b1a54e7e4a0f0f: function(e) {
    return e.maxUniformBufferBindingSize;
  }, __wbg_maxUniformBuffersPerShaderStage_5f475d9a453af14d: function(e) {
    return e.maxUniformBuffersPerShaderStage;
  }, __wbg_maxVertexAttributes_4c48ca2f5d32f860: function(e) {
    return e.maxVertexAttributes;
  }, __wbg_maxVertexBufferArrayStride_2233f6933ecc5a16: function(e) {
    return e.maxVertexBufferArrayStride;
  }, __wbg_maxVertexBuffers_c47e508cd7348554: function(e) {
    return e.maxVertexBuffers;
  }, __wbg_message_0762358e59db7ed6: function(e, t) {
    const n = t.message, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_message_7957ab09f64c6822: function(e, t) {
    const n = t.message, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_message_b163994503433c9e: function(e, t) {
    const n = t.message, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_messages_da071582f72bc978: function(e) {
    return e.messages;
  }, __wbg_minStorageBufferOffsetAlignment_51b4801fac3a58de: function(e) {
    return e.minStorageBufferOffsetAlignment;
  }, __wbg_minUniformBufferOffsetAlignment_5d62a77924b2335f: function(e) {
    return e.minUniformBufferOffsetAlignment;
  }, __wbg_navigator_43be698ba96fc088: function(e) {
    return e.navigator;
  }, __wbg_navigator_4478931f32ebca57: function(e) {
    return e.navigator;
  }, __wbg_new_361308b2356cecd0: function() {
    return new Object();
  }, __wbg_new_3eb36ae241fe6f44: function() {
    return new Array();
  }, __wbg_new_8a6f238a6ece86ea: function() {
    return new Error();
  }, __wbg_new_b5d9e2fb389fef91: function(e, t) {
    try {
      var n = { a: e, b: t }, r = (o, i) => {
        const s = n.a;
        n.a = 0;
        try {
          return ie(s, n.b, o, i);
        } finally {
          n.a = s;
        }
      };
      return new Promise(r);
    } finally {
      n.a = n.b = 0;
    }
  }, __wbg_new_from_slice_38c66b2d6c31f4b7: function(e, t) {
    return new Float64Array(v(e, t));
  }, __wbg_new_from_slice_a3d2629dc1826784: function(e, t) {
    return new Uint8Array(E(e, t));
  }, __wbg_new_no_args_1c7c842f08d00ebb: function(e, t) {
    return new Function(m(e, t));
  }, __wbg_new_with_byte_offset_and_length_aa261d9c9da49eb1: function(e, t, n) {
    return new Uint8Array(e, t >>> 0, n >>> 0);
  }, __wbg_new_with_length_6523745c0bd32809: function(e) {
    return new Float64Array(e >>> 0);
  }, __wbg_of_f915f7cd925b21a5: function(e) {
    return Array.of(e);
  }, __wbg_offset_336f14c993863b76: function(e) {
    return e.offset;
  }, __wbg_pixelStorei_2a65936c11b710fe: function(e, t, n) {
    e.pixelStorei(t >>> 0, n);
  }, __wbg_pixelStorei_f7cc498f52d523f1: function(e, t, n) {
    e.pixelStorei(t >>> 0, n);
  }, __wbg_polygonOffset_24a8059deb03be92: function(e, t, n) {
    e.polygonOffset(t, n);
  }, __wbg_polygonOffset_4b3158d8ed028862: function(e, t, n) {
    e.polygonOffset(t, n);
  }, __wbg_popErrorScope_af0b22f136a861d6: function(e) {
    return e.popErrorScope();
  }, __wbg_prototypesetcall_bdcdcc5842e4d77d: function(e, t, n) {
    Uint8Array.prototype.set.call(E(e, t), n);
  }, __wbg_pushErrorScope_b52914ff10ba6ce3: function(e, t) {
    e.pushErrorScope(be[t]);
  }, __wbg_push_8ffdcb2063340ba5: function(e, t) {
    return e.push(t);
  }, __wbg_queryCounterEXT_b578f07c30420446: function(e, t, n) {
    e.queryCounterEXT(t, n >>> 0);
  }, __wbg_querySelectorAll_1283aae52043a951: function() {
    return d(function(e, t, n) {
      return e.querySelectorAll(m(t, n));
    }, arguments);
  }, __wbg_querySelector_c3b0df2d58eec220: function() {
    return d(function(e, t, n) {
      const r = e.querySelector(m(t, n));
      return l(r) ? 0 : w(r);
    }, arguments);
  }, __wbg_queueMicrotask_0aa0a927f78f5d98: function(e) {
    return e.queueMicrotask;
  }, __wbg_queueMicrotask_5bb536982f78a56f: function(e) {
    queueMicrotask(e);
  }, __wbg_queue_bea4017efaaf9904: function(e) {
    return e.queue;
  }, __wbg_readBuffer_9eb461d6857295f0: function(e, t) {
    e.readBuffer(t >>> 0);
  }, __wbg_readPixels_55b18304384e073d: function() {
    return d(function(e, t, n, r, c, o, i, s) {
      e.readPixels(t, n, r, c, o >>> 0, i >>> 0, s);
    }, arguments);
  }, __wbg_readPixels_6ea8e288a8673282: function() {
    return d(function(e, t, n, r, c, o, i, s) {
      e.readPixels(t, n, r, c, o >>> 0, i >>> 0, s);
    }, arguments);
  }, __wbg_readPixels_95b2464a7bb863a2: function() {
    return d(function(e, t, n, r, c, o, i, s) {
      e.readPixels(t, n, r, c, o >>> 0, i >>> 0, s);
    }, arguments);
  }, __wbg_reason_43acd39cce242b50: function(e) {
    const t = e.reason;
    return (se.indexOf(t) + 1 || 3) - 1;
  }, __wbg_reject_a2176de7f1212be5: function(e) {
    return Promise.reject(e);
  }, __wbg_renderbufferStorageMultisample_bc0ae08a7abb887a: function(e, t, n, r, c, o) {
    e.renderbufferStorageMultisample(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_renderbufferStorage_1bc02383614b76b2: function(e, t, n, r, c) {
    e.renderbufferStorage(t >>> 0, n >>> 0, r, c);
  }, __wbg_renderbufferStorage_6348154d30979c44: function(e, t, n, r, c) {
    e.renderbufferStorage(t >>> 0, n >>> 0, r, c);
  }, __wbg_requestAdapter_e6dcfac497cafa7a: function(e, t) {
    return e.requestAdapter(t);
  }, __wbg_requestDevice_03b802707d5a382c: function(e, t) {
    return e.requestDevice(t);
  }, __wbg_resolveQuerySet_811661fb23f3b699: function(e, t, n, r, c, o) {
    e.resolveQuerySet(t, n >>> 0, r >>> 0, c, o >>> 0);
  }, __wbg_resolve_002c4b7d9d8f6b64: function(e) {
    return Promise.resolve(e);
  }, __wbg_samplerParameterf_f070d2b69b1e2d46: function(e, t, n, r) {
    e.samplerParameterf(t, n >>> 0, r);
  }, __wbg_samplerParameteri_8e4c4bcead0ee669: function(e, t, n, r) {
    e.samplerParameteri(t, n >>> 0, r);
  }, __wbg_scissor_2ff8f18f05a6d408: function(e, t, n, r, c) {
    e.scissor(t, n, r, c);
  }, __wbg_scissor_b870b1434a9c25b4: function(e, t, n, r, c) {
    e.scissor(t, n, r, c);
  }, __wbg_setBindGroup_62a3045b0921e429: function(e, t, n, r, c, o, i) {
    e.setBindGroup(t >>> 0, n, B(r, c), o, i >>> 0);
  }, __wbg_setBindGroup_6c0fd18e9a53a945: function(e, t, n) {
    e.setBindGroup(t >>> 0, n);
  }, __wbg_setBindGroup_7f3b61f1f482133b: function(e, t, n) {
    e.setBindGroup(t >>> 0, n);
  }, __wbg_setBindGroup_bf767a5aa46a33ce: function(e, t, n, r, c, o, i) {
    e.setBindGroup(t >>> 0, n, B(r, c), o, i >>> 0);
  }, __wbg_setBindGroup_c4aaff14063226b4: function(e, t, n, r, c, o, i) {
    e.setBindGroup(t >>> 0, n, B(r, c), o, i >>> 0);
  }, __wbg_setBindGroup_f82e771dc1b69093: function(e, t, n) {
    e.setBindGroup(t >>> 0, n);
  }, __wbg_setBlendConstant_016723821cfb3aa4: function(e, t) {
    e.setBlendConstant(t);
  }, __wbg_setIndexBuffer_286a40afdff411b7: function(e, t, n, r) {
    e.setIndexBuffer(t, Q[n], r);
  }, __wbg_setIndexBuffer_7efd0b7a40c65fb9: function(e, t, n, r, c) {
    e.setIndexBuffer(t, Q[n], r, c);
  }, __wbg_setIndexBuffer_e091a9673bb575e2: function(e, t, n, r) {
    e.setIndexBuffer(t, Q[n], r);
  }, __wbg_setIndexBuffer_f0759f00036f615f: function(e, t, n, r, c) {
    e.setIndexBuffer(t, Q[n], r, c);
  }, __wbg_setPipeline_ba92070b8ee81cf9: function(e, t) {
    e.setPipeline(t);
  }, __wbg_setPipeline_c344f76bae58c4d6: function(e, t) {
    e.setPipeline(t);
  }, __wbg_setPipeline_d76451c50a121598: function(e, t) {
    e.setPipeline(t);
  }, __wbg_setScissorRect_0b6ee0852ef0b6b9: function(e, t, n, r, c) {
    e.setScissorRect(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_setStencilReference_34fd3d59673a5a9d: function(e, t) {
    e.setStencilReference(t >>> 0);
  }, __wbg_setVertexBuffer_06a90dc78e1ad9c4: function(e, t, n, r, c) {
    e.setVertexBuffer(t >>> 0, n, r, c);
  }, __wbg_setVertexBuffer_1540e9118b6c451d: function(e, t, n, r) {
    e.setVertexBuffer(t >>> 0, n, r);
  }, __wbg_setVertexBuffer_5166eedc06450701: function(e, t, n, r, c) {
    e.setVertexBuffer(t >>> 0, n, r, c);
  }, __wbg_setVertexBuffer_8621784e5014065b: function(e, t, n, r) {
    e.setVertexBuffer(t >>> 0, n, r);
  }, __wbg_setViewport_731ad30abb13f744: function(e, t, n, r, c, o, i) {
    e.setViewport(t, n, r, c, o, i);
  }, __wbg_set_25cf9deff6bf0ea8: function(e, t, n) {
    e.set(t, n >>> 0);
  }, __wbg_set_3f1d0b984ed272ed: function(e, t, n) {
    e[t] = n;
  }, __wbg_set_6cb8631f80447a67: function() {
    return d(function(e, t, n) {
      return Reflect.set(e, t, n);
    }, arguments);
  }, __wbg_set_a7e6b10165583fc4: function(e, t, n) {
    e.set(v(t, n));
  }, __wbg_set_f43e577aea94465b: function(e, t, n) {
    e[t >>> 0] = n;
  }, __wbg_set_height_b386c0f603610637: function(e, t) {
    e.height = t >>> 0;
  }, __wbg_set_height_f21f985387070100: function(e, t) {
    e.height = t >>> 0;
  }, __wbg_set_onuncapturederror_19541466822d790b: function(e, t) {
    e.onuncapturederror = t;
  }, __wbg_set_width_7f07715a20503914: function(e, t) {
    e.width = t >>> 0;
  }, __wbg_set_width_d60bc4f2f20c56a4: function(e, t) {
    e.width = t >>> 0;
  }, __wbg_shaderSource_32425cfe6e5a1e52: function(e, t, n, r) {
    e.shaderSource(t, m(n, r));
  }, __wbg_shaderSource_8f4bda03f70359df: function(e, t, n, r) {
    e.shaderSource(t, m(n, r));
  }, __wbg_size_661bddb3f9898121: function(e) {
    return e.size;
  }, __wbg_stack_0ed75d68575b0f3c: function(e, t) {
    const n = t.stack, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_static_accessor_GLOBAL_12837167ad935116: function() {
    const e = typeof global > "u" ? null : global;
    return l(e) ? 0 : w(e);
  }, __wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f: function() {
    const e = typeof globalThis > "u" ? null : globalThis;
    return l(e) ? 0 : w(e);
  }, __wbg_static_accessor_SELF_a621d3dfbb60d0ce: function() {
    const e = typeof self > "u" ? null : self;
    return l(e) ? 0 : w(e);
  }, __wbg_static_accessor_WINDOW_f8727f0cf888e0bd: function() {
    const e = typeof window > "u" ? null : window;
    return l(e) ? 0 : w(e);
  }, __wbg_stencilFuncSeparate_10d043d0af14366f: function(e, t, n, r, c) {
    e.stencilFuncSeparate(t >>> 0, n >>> 0, r, c >>> 0);
  }, __wbg_stencilFuncSeparate_1798f5cca257f313: function(e, t, n, r, c) {
    e.stencilFuncSeparate(t >>> 0, n >>> 0, r, c >>> 0);
  }, __wbg_stencilMaskSeparate_28d53625c02d9c7f: function(e, t, n) {
    e.stencilMaskSeparate(t >>> 0, n >>> 0);
  }, __wbg_stencilMaskSeparate_c24c1a28b8dd8a63: function(e, t, n) {
    e.stencilMaskSeparate(t >>> 0, n >>> 0);
  }, __wbg_stencilMask_0eca090c4c47f8f7: function(e, t) {
    e.stencilMask(t >>> 0);
  }, __wbg_stencilMask_732dcc5aada10e4c: function(e, t) {
    e.stencilMask(t >>> 0);
  }, __wbg_stencilOpSeparate_4657523b1d3b184f: function(e, t, n, r, c) {
    e.stencilOpSeparate(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_stencilOpSeparate_de257f3c29e604cd: function(e, t, n, r, c) {
    e.stencilOpSeparate(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_submit_f635072bb3d05faa: function(e, t) {
    e.submit(t);
  }, __wbg_texImage2D_087ef94df78081f0: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texImage2D_e71049312f3172d9: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texImage3D_bd2b0bd2cfcdb278: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u, y) {
      e.texImage3D(t >>> 0, n, r, c, o, i, s, b >>> 0, u >>> 0, y);
    }, arguments);
  }, __wbg_texParameteri_0d45be2c88d6bad8: function(e, t, n, r) {
    e.texParameteri(t >>> 0, n >>> 0, r);
  }, __wbg_texParameteri_ec937d2161018946: function(e, t, n, r) {
    e.texParameteri(t >>> 0, n >>> 0, r);
  }, __wbg_texStorage2D_9504743abf5a986a: function(e, t, n, r, c, o) {
    e.texStorage2D(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_texStorage3D_e9e1b58fee218abe: function(e, t, n, r, c, o, i) {
    e.texStorage3D(t >>> 0, n, r >>> 0, c, o, i);
  }, __wbg_texSubImage2D_117d29278542feb0: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_19ae4cadb809f264: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_5d270af600a7fc4a: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_bd034db2e58c352c: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_bf72e56edeeed376: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_d17a39cdec4a3495: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_e193f1d28439217c: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_edf5bd70fda3feaf: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, s >>> 0, b >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage3D_1102c12a20bf56d5: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, s, b, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_18d7f3c65567c885: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, s, b, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_3b653017c4c5d721: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, s, b, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_45591e5655d1ed5c: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, s, b, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_47643556a8a4bf86: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, s, b, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_59b8e24fb05787aa: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, s, b, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_eff5cd6ab84f44ee: function() {
    return d(function(e, t, n, r, c, o, i, s, b, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, s, b, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_then_0d9fe2c7b1857d32: function(e, t, n) {
    return e.then(t, n);
  }, __wbg_then_b9e7b3b5f1a9e1b5: function(e, t) {
    return e.then(t);
  }, __wbg_type_c0d5d83032e9858a: function(e) {
    const t = e.type;
    return (fe.indexOf(t) + 1 || 4) - 1;
  }, __wbg_uniform1f_b500ede5b612bea2: function(e, t, n) {
    e.uniform1f(t, n);
  }, __wbg_uniform1f_c148eeaf4b531059: function(e, t, n) {
    e.uniform1f(t, n);
  }, __wbg_uniform1i_9f3f72dbcb98ada9: function(e, t, n) {
    e.uniform1i(t, n);
  }, __wbg_uniform1i_e9aee4b9e7fe8c4b: function(e, t, n) {
    e.uniform1i(t, n);
  }, __wbg_uniform1ui_a0f911ff174715d0: function(e, t, n) {
    e.uniform1ui(t, n >>> 0);
  }, __wbg_uniform2fv_04c304b93cbf7f55: function(e, t, n, r) {
    e.uniform2fv(t, h(n, r));
  }, __wbg_uniform2fv_2fb47cfe06330cc7: function(e, t, n, r) {
    e.uniform2fv(t, h(n, r));
  }, __wbg_uniform2iv_095baf208f172131: function(e, t, n, r) {
    e.uniform2iv(t, D(n, r));
  }, __wbg_uniform2iv_ccf2ed44ac8e602e: function(e, t, n, r) {
    e.uniform2iv(t, D(n, r));
  }, __wbg_uniform2uiv_3030d7e769f5e82a: function(e, t, n, r) {
    e.uniform2uiv(t, B(n, r));
  }, __wbg_uniform3fv_aa35ef21e14d5469: function(e, t, n, r) {
    e.uniform3fv(t, h(n, r));
  }, __wbg_uniform3fv_c0872003729939a5: function(e, t, n, r) {
    e.uniform3fv(t, h(n, r));
  }, __wbg_uniform3iv_6aa2b0791e659d14: function(e, t, n, r) {
    e.uniform3iv(t, D(n, r));
  }, __wbg_uniform3iv_e912f444d4ff8269: function(e, t, n, r) {
    e.uniform3iv(t, D(n, r));
  }, __wbg_uniform3uiv_86941e7eeb8ee0a3: function(e, t, n, r) {
    e.uniform3uiv(t, B(n, r));
  }, __wbg_uniform4f_71ec75443e58cecc: function(e, t, n, r, c, o) {
    e.uniform4f(t, n, r, c, o);
  }, __wbg_uniform4f_f6b5e2024636033a: function(e, t, n, r, c, o) {
    e.uniform4f(t, n, r, c, o);
  }, __wbg_uniform4fv_498bd80dc5aa16ff: function(e, t, n, r) {
    e.uniform4fv(t, h(n, r));
  }, __wbg_uniform4fv_e6c73702e9a3be5c: function(e, t, n, r) {
    e.uniform4fv(t, h(n, r));
  }, __wbg_uniform4iv_375332584c65e61b: function(e, t, n, r) {
    e.uniform4iv(t, D(n, r));
  }, __wbg_uniform4iv_8a8219fda39dffd5: function(e, t, n, r) {
    e.uniform4iv(t, D(n, r));
  }, __wbg_uniform4uiv_046ee400bb80547d: function(e, t, n, r) {
    e.uniform4uiv(t, B(n, r));
  }, __wbg_uniformBlockBinding_1cf9fd2c49adf0f3: function(e, t, n, r) {
    e.uniformBlockBinding(t, n >>> 0, r >>> 0);
  }, __wbg_uniformMatrix2fv_24430076c7afb5e3: function(e, t, n, r, c) {
    e.uniformMatrix2fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix2fv_e2806601f5b95102: function(e, t, n, r, c) {
    e.uniformMatrix2fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix2x3fv_a377326104a8faf4: function(e, t, n, r, c) {
    e.uniformMatrix2x3fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix2x4fv_b7a4d810e7a1cf7d: function(e, t, n, r, c) {
    e.uniformMatrix2x4fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix3fv_6f822361173d8046: function(e, t, n, r, c) {
    e.uniformMatrix3fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix3fv_b94a764c63aa6468: function(e, t, n, r, c) {
    e.uniformMatrix3fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix3x2fv_69a4cf0ce5b09f8b: function(e, t, n, r, c) {
    e.uniformMatrix3x2fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix3x4fv_cc72e31a1baaf9c9: function(e, t, n, r, c) {
    e.uniformMatrix3x4fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix4fv_0e724dbebd372526: function(e, t, n, r, c) {
    e.uniformMatrix4fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix4fv_923b55ad503fdc56: function(e, t, n, r, c) {
    e.uniformMatrix4fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix4x2fv_8c9fb646f3b90b63: function(e, t, n, r, c) {
    e.uniformMatrix4x2fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix4x3fv_ee0bed9a1330400d: function(e, t, n, r, c) {
    e.uniformMatrix4x3fv(t, n !== 0, h(r, c));
  }, __wbg_unmap_8c2e8131b2aaa844: function(e) {
    e.unmap();
  }, __wbg_usage_13caa02888040e9f: function(e) {
    return e.usage;
  }, __wbg_useProgram_e82c1a5f87d81579: function(e, t) {
    e.useProgram(t);
  }, __wbg_useProgram_fe720ade4d3b6edb: function(e, t) {
    e.useProgram(t);
  }, __wbg_valueOf_3c28600026e653c4: function(e) {
    return e.valueOf();
  }, __wbg_vertexAttribDivisorANGLE_eaa3c29423ea6da4: function(e, t, n) {
    e.vertexAttribDivisorANGLE(t >>> 0, n >>> 0);
  }, __wbg_vertexAttribDivisor_744c0ca468594894: function(e, t, n) {
    e.vertexAttribDivisor(t >>> 0, n >>> 0);
  }, __wbg_vertexAttribIPointer_b9020d0c2e759912: function(e, t, n, r, c, o) {
    e.vertexAttribIPointer(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_vertexAttribPointer_75f6ff47f6c9f8cb: function(e, t, n, r, c, o, i) {
    e.vertexAttribPointer(t >>> 0, n, r >>> 0, c !== 0, o, i);
  }, __wbg_vertexAttribPointer_adbd1853cce679ad: function(e, t, n, r, c, o, i) {
    e.vertexAttribPointer(t >>> 0, n, r >>> 0, c !== 0, o, i);
  }, __wbg_videoHeight_a90b6b6ebd4132de: function(e) {
    return e.videoHeight;
  }, __wbg_videoWidth_4b450aa64c85eaa4: function(e) {
    return e.videoWidth;
  }, __wbg_viewport_174ae1c2209344ae: function(e, t, n, r, c) {
    e.viewport(t, n, r, c);
  }, __wbg_viewport_df236eac68bc7467: function(e, t, n, r, c) {
    e.viewport(t, n, r, c);
  }, __wbg_warn_f7ae1b2e66ccb930: function(e) {
    console.warn(e);
  }, __wbg_wasmrenderer_new: function(e) {
    return q.__wrap(e);
  }, __wbg_width_5901d980713eb80b: function(e) {
    return e.width;
  }, __wbg_width_5f66bde2e810fbde: function(e) {
    return e.width;
  }, __wbg_width_75158459c067906d: function(e) {
    return e.width;
  }, __wbg_width_be8f36d66d37751f: function(e) {
    return e.width;
  }, __wbg_width_f12394c19964e4bb: function(e) {
    return e.width;
  }, __wbg_writeBuffer_5ca4981365eb5ac0: function(e, t, n, r, c, o) {
    e.writeBuffer(t, n, r, c, o);
  }, __wbg_writeTexture_246118eb2f5a1592: function(e, t, n, r, c) {
    e.writeTexture(t, n, r, c);
  }, __wbindgen_cast_0000000000000001: function(e, t) {
    return te(e, t, _.wasm_bindgen__closure__destroy__hd580dc64d670e909, oe);
  }, __wbindgen_cast_0000000000000002: function(e, t) {
    return te(e, t, _.wasm_bindgen__closure__destroy__hd9d8fcf544480c3e, ae);
  }, __wbindgen_cast_0000000000000003: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000004: function(e, t) {
    return h(e, t);
  }, __wbindgen_cast_0000000000000005: function(e, t) {
    return le(e, t);
  }, __wbindgen_cast_0000000000000006: function(e, t) {
    return D(e, t);
  }, __wbindgen_cast_0000000000000007: function(e, t) {
    return de(e, t);
  }, __wbindgen_cast_0000000000000008: function(e, t) {
    return we(e, t);
  }, __wbindgen_cast_0000000000000009: function(e, t) {
    return B(e, t);
  }, __wbindgen_cast_000000000000000a: function(e, t) {
    return E(e, t);
  }, __wbindgen_cast_000000000000000b: function(e, t) {
    return m(e, t);
  }, __wbindgen_init_externref_table: function() {
    const e = _.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
  } } };
}
function oe(a, e, t) {
  _.wasm_bindgen__convert__closures_____invoke__hc63a6cfd4bd96038(a, e, t);
}
function ae(a, e, t) {
  _.wasm_bindgen__convert__closures_____invoke__hfedee57f14a5ed81(a, e, t);
}
function ie(a, e, t, n) {
  _.wasm_bindgen__convert__closures_____invoke__hd55f58cd52f0a612(a, e, t, n);
}
const fe = ["error", "warning", "info"], se = ["unknown", "destroyed"], be = ["validation", "out-of-memory", "internal"], Q = ["uint16", "uint32"], ue = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"], Y = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => _.__wbg_cellrefinfo_free(a >>> 0, 1)), Z = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => _.__wbg_elementinfo_free(a >>> 0, 1)), H = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => _.__wbg_wasmlibrary_free(a >>> 0, 1)), K = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => _.__wbg_wasmrenderer_free(a >>> 0, 1));
function w(a) {
  const e = _.__externref_table_alloc();
  return _.__wbindgen_externrefs.set(e, a), e;
}
function ge(a, e) {
  if (!(a instanceof e)) throw new Error(`expected instance of ${e.name}`);
}
const ee = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => a.dtor(a.a, a.b));
function J(a) {
  const e = typeof a;
  if (e == "number" || e == "boolean" || a == null) return `${a}`;
  if (e == "string") return `"${a}"`;
  if (e == "symbol") {
    const r = a.description;
    return r == null ? "Symbol" : `Symbol(${r})`;
  }
  if (e == "function") {
    const r = a.name;
    return typeof r == "string" && r.length > 0 ? `Function(${r})` : "Function";
  }
  if (Array.isArray(a)) {
    const r = a.length;
    let c = "[";
    r > 0 && (c += J(a[0]));
    for (let o = 1; o < r; o++) c += ", " + J(a[o]);
    return c += "]", c;
  }
  const t = /\[object ([^\]]+)\]/.exec(toString.call(a));
  let n;
  if (t && t.length > 1) n = t[1];
  else return toString.call(a);
  if (n == "Object") try {
    return "Object(" + JSON.stringify(a) + ")";
  } catch {
    return "Object";
  }
  return a instanceof Error ? `${a.name}: ${a.message}
${a.stack}` : n;
}
function h(a, e) {
  return a = a >>> 0, re().subarray(a / 4, a / 4 + e);
}
function v(a, e) {
  return a = a >>> 0, _e().subarray(a / 8, a / 8 + e);
}
function le(a, e) {
  return a = a >>> 0, me().subarray(a / 2, a / 2 + e);
}
function D(a, e) {
  return a = a >>> 0, pe().subarray(a / 4, a / 4 + e);
}
function de(a, e) {
  return a = a >>> 0, ye().subarray(a / 1, a / 1 + e);
}
function S(a, e) {
  a = a >>> 0;
  const t = p(), n = [];
  for (let r = a; r < a + 4 * e; r += 4) n.push(_.__wbindgen_externrefs.get(t.getUint32(r, true)));
  return _.__externref_drop_slice(a, e), n;
}
function we(a, e) {
  return a = a >>> 0, he().subarray(a / 2, a / 2 + e);
}
function B(a, e) {
  return a = a >>> 0, xe().subarray(a / 4, a / 4 + e);
}
function E(a, e) {
  return a = a >>> 0, M().subarray(a / 1, a / 1 + e);
}
let F = null;
function p() {
  return (F === null || F.buffer.detached === true || F.buffer.detached === void 0 && F.buffer !== _.memory.buffer) && (F = new DataView(_.memory.buffer)), F;
}
let R = null;
function re() {
  return (R === null || R.byteLength === 0) && (R = new Float32Array(_.memory.buffer)), R;
}
let k = null;
function _e() {
  return (k === null || k.byteLength === 0) && (k = new Float64Array(_.memory.buffer)), k;
}
let L = null;
function me() {
  return (L === null || L.byteLength === 0) && (L = new Int16Array(_.memory.buffer)), L;
}
let C = null;
function pe() {
  return (C === null || C.byteLength === 0) && (C = new Int32Array(_.memory.buffer)), C;
}
let W = null;
function ye() {
  return (W === null || W.byteLength === 0) && (W = new Int8Array(_.memory.buffer)), W;
}
function m(a, e) {
  return a = a >>> 0, Ie(a, e);
}
let O = null;
function he() {
  return (O === null || O.byteLength === 0) && (O = new Uint16Array(_.memory.buffer)), O;
}
let G = null;
function xe() {
  return (G === null || G.byteLength === 0) && (G = new Uint32Array(_.memory.buffer)), G;
}
let V = null;
function M() {
  return (V === null || V.byteLength === 0) && (V = new Uint8Array(_.memory.buffer)), V;
}
function d(a, e) {
  try {
    return a.apply(this, e);
  } catch (t) {
    const n = w(t);
    _.__wbindgen_exn_store(n);
  }
}
function l(a) {
  return a == null;
}
function te(a, e, t, n) {
  const r = { a, b: e, cnt: 1, dtor: t }, c = (...o) => {
    r.cnt++;
    const i = r.a;
    r.a = 0;
    try {
      return n(i, r.b, ...o);
    } finally {
      r.a = i, c._wbg_cb_unref();
    }
  };
  return c._wbg_cb_unref = () => {
    --r.cnt === 0 && (r.dtor(r.a, r.b), r.a = 0, ee.unregister(r));
  }, ee.register(c, r, r), c;
}
function ve(a, e) {
  const t = e(a.length * 1, 1) >>> 0;
  return M().set(a, t / 1), f = a.length, t;
}
function N(a, e) {
  const t = e(a.length * 4, 4) >>> 0;
  return re().set(a, t / 4), f = a.length, t;
}
function I(a, e) {
  const t = e(a.length * 8, 8) >>> 0;
  return _e().set(a, t / 8), f = a.length, t;
}
function P(a, e) {
  const t = e(a.length * 4, 4) >>> 0;
  for (let n = 0; n < a.length; n++) {
    const r = w(a[n]);
    p().setUint32(t + 4 * n, r, true);
  }
  return f = a.length, t;
}
function g(a, e, t) {
  if (t === void 0) {
    const i = U.encode(a), s = e(i.length, 1) >>> 0;
    return M().subarray(s, s + i.length).set(i), f = i.length, s;
  }
  let n = a.length, r = e(n, 1) >>> 0;
  const c = M();
  let o = 0;
  for (; o < n; o++) {
    const i = a.charCodeAt(o);
    if (i > 127) break;
    c[r + o] = i;
  }
  if (o !== n) {
    o !== 0 && (a = a.slice(o)), r = t(r, n, n = o + a.length * 3, 1) >>> 0;
    const i = M().subarray(r + o, r + n), s = U.encodeInto(a, i);
    o += s.written, r = t(r, n, o, 1) >>> 0;
  }
  return f = o, r;
}
function A(a) {
  const e = _.__wbindgen_externrefs.get(a);
  return _.__externref_table_dealloc(a), e;
}
let $ = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
$.decode();
const Se = 2146435072;
let X = 0;
function Ie(a, e) {
  return X += e, X >= Se && ($ = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), $.decode(), X = e), $.decode(M().subarray(a, a + e));
}
const U = new TextEncoder();
"encodeInto" in U || (U.encodeInto = function(a, e) {
  const t = U.encode(a);
  return e.set(t), { read: a.length, written: t.length };
});
let f = 0, _;
function ce(a, e) {
  return _ = a.exports, F = null, R = null, k = null, L = null, C = null, W = null, O = null, G = null, V = null, _.__wbindgen_start(), _;
}
async function Ae(a, e) {
  if (typeof Response == "function" && a instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function") try {
      return await WebAssembly.instantiateStreaming(a, e);
    } catch (r) {
      if (a.ok && t(a.type) && a.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", r);
      else throw r;
    }
    const n = await a.arrayBuffer();
    return await WebAssembly.instantiate(n, e);
  } else {
    const n = await WebAssembly.instantiate(a, e);
    return n instanceof WebAssembly.Instance ? { instance: n, module: a } : n;
  }
  function t(n) {
    switch (n) {
      case "basic":
      case "cors":
      case "default":
        return true;
    }
    return false;
  }
}
function De(a) {
  if (_ !== void 0) return _;
  a !== void 0 && (Object.getPrototypeOf(a) === Object.prototype ? { module: a } = a : console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));
  const e = ne();
  a instanceof WebAssembly.Module || (a = new WebAssembly.Module(a));
  const t = new WebAssembly.Instance(a, e);
  return ce(t);
}
async function Pe(a) {
  if (_ !== void 0) return _;
  a !== void 0 && (Object.getPrototypeOf(a) === Object.prototype ? { module_or_path: a } = a : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), a === void 0 && (a = new URL("" + new URL("rosette_wasm_bg-QSLlAqBZ.wasm", import.meta.url).href, import.meta.url));
  const e = ne();
  (typeof a == "string" || typeof Request == "function" && a instanceof Request || typeof URL == "function" && a instanceof URL) && (a = fetch(a));
  const { instance: t, module: n } = await Ae(await a, e);
  return ce(t);
}
export {
  j as CellRefInfo,
  z as ElementInfo,
  T as WasmLibrary,
  q as WasmRenderer,
  Pe as default,
  Be as init,
  De as initSync
};
