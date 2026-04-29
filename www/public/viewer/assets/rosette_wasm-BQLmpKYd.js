class j {
  static __wrap(e) {
    e = e >>> 0;
    const t = Object.create(j.prototype);
    return t.__wbg_ptr = e, Z.register(t, t.__wbg_ptr, t), t;
  }
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Z.unregister(this), e;
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
    return t.__wbg_ptr = e, K.register(t, t.__wbg_ptr, t), t;
  }
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, K.unregister(this), e;
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
class P {
  static __wrap(e) {
    e = e >>> 0;
    const t = Object.create(P.prototype);
    return t.__wbg_ptr = e, $.register(t, t.__wbg_ptr, t), t;
  }
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, $.unregister(this), e;
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
    if (r[1]) throw S(r[0]);
  }
  add_cell_ref(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f, o = _.wasmlibrary_add_cell_ref(this.__wbg_ptr, r, c, t, n);
    let i;
    return o[0] !== 0 && (i = m(o[0], o[1]).slice(), _.__wbindgen_free(o[0], o[1] * 1, 1)), i;
  }
  add_cell_ref_to(e, t, n, r) {
    const c = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f, i = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), b = f, s = _.wasmlibrary_add_cell_ref_to(this.__wbg_ptr, c, o, i, b, n, r);
    let u;
    return s[0] !== 0 && (u = m(s[0], s[1]).slice(), _.__wbindgen_free(s[0], s[1] * 1, 1)), u;
  }
  add_cell_ref_to_with_transform(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f, o = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), i = f, b = A(n, _.__wbindgen_malloc), s = f, u = _.wasmlibrary_add_cell_ref_to_with_transform(this.__wbg_ptr, r, c, o, i, b, s);
    let y;
    return u[0] !== 0 && (y = m(u[0], u[1]).slice(), _.__wbindgen_free(u[0], u[1] * 1, 1)), y;
  }
  add_cell_ref_with_transform(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = A(t, _.__wbindgen_malloc), o = f, i = _.wasmlibrary_add_cell_ref_with_transform(this.__wbg_ptr, n, r, c, o);
    let b;
    return i[0] !== 0 && (b = m(i[0], i[1]).slice(), _.__wbindgen_free(i[0], i[1] * 1, 1)), b;
  }
  add_polygon(e, t, n) {
    const r = A(e, _.__wbindgen_malloc), c = f, o = _.wasmlibrary_add_polygon(this.__wbg_ptr, r, c, t, n);
    let i;
    return o[0] !== 0 && (i = m(o[0], o[1]).slice(), _.__wbindgen_free(o[0], o[1] * 1, 1)), i;
  }
  add_rectangle(e, t, n, r, c, o) {
    const i = _.wasmlibrary_add_rectangle(this.__wbg_ptr, e, t, n, r, c, o);
    let b;
    return i[0] !== 0 && (b = m(i[0], i[1]).slice(), _.__wbindgen_free(i[0], i[1] * 1, 1)), b;
  }
  add_text(e, t, n, r, c, o) {
    const i = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), b = f, s = _.wasmlibrary_add_text(this.__wbg_ptr, i, b, t, n, r, c, o);
    let u;
    return s[0] !== 0 && (u = m(s[0], s[1]).slice(), _.__wbindgen_free(s[0], s[1] * 1, 1)), u;
  }
  boolean_operation(e, t, n) {
    const r = F(e, _.__wbindgen_malloc), c = f, o = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), i = f, b = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), s = f, u = _.wasmlibrary_boolean_operation(this.__wbg_ptr, r, c, o, i, b, s);
    var y = I(u[0], u[1]).slice();
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
    const c = A(e, _.__wbindgen_malloc), o = f, i = _.wasmlibrary_create_path(this.__wbg_ptr, c, o, t, n, r);
    let b;
    return i[0] !== 0 && (b = m(i[0], i[1]).slice(), _.__wbindgen_free(i[0], i[1] * 1, 1)), b;
  }
  create_path_rounded(e, t, n, r, c, o) {
    const i = A(e, _.__wbindgen_malloc), b = f, s = _.wasmlibrary_create_path_rounded(this.__wbg_ptr, i, b, t, n, r, c, o);
    let u;
    return s[0] !== 0 && (u = m(s[0], s[1]).slice(), _.__wbindgen_free(s[0], s[1] * 1, 1)), u;
  }
  element_count() {
    return _.wasmlibrary_element_count(this.__wbg_ptr) >>> 0;
  }
  flatten_active_cell() {
    return _.wasmlibrary_flatten_active_cell(this.__wbg_ptr) !== 0;
  }
  static from_gds_bytes(e) {
    const t = Se(e, _.__wbindgen_malloc), n = f, r = _.wasmlibrary_from_gds_bytes(t, n);
    if (r[2]) throw S(r[1]);
    return P.__wrap(r[0]);
  }
  static from_json(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_from_json(t, n);
    if (r[2]) throw S(r[1]);
    return P.__wrap(r[0]);
  }
  static from_library_json(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_from_library_json(t, n);
    if (r[2]) throw S(r[1]);
    return P.__wrap(r[0]);
  }
  get_all_bounds() {
    const e = _.wasmlibrary_get_all_bounds(this.__wbg_ptr);
    let t;
    return e[0] !== 0 && (t = v(e[0], e[1]).slice(), _.__wbindgen_free(e[0], e[1] * 8, 8)), t;
  }
  get_all_ids() {
    const e = _.wasmlibrary_get_all_ids(this.__wbg_ptr);
    var t = I(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_all_vertices() {
    const e = _.wasmlibrary_get_all_vertices(this.__wbg_ptr);
    var t = v(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 8, 8), t;
  }
  get_area_by_layer() {
    const e = _.wasmlibrary_get_area_by_layer(this.__wbg_ptr);
    var t = v(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 8, 8), t;
  }
  get_bounds_for_ids(e) {
    const t = F(e, _.__wbindgen_malloc), n = f, r = _.wasmlibrary_get_bounds_for_ids(this.__wbg_ptr, t, n);
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
    var t = I(e[0], e[1]).slice();
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
  get_cell_path_length(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_get_cell_path_length(this.__wbg_ptr, t, n);
    return r[0] === 0 ? void 0 : r[1];
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
    var r = I(n[0], n[1]).slice();
    return _.__wbindgen_free(n[0], n[1] * 4, 4), r;
  }
  get_group_ids(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f, r = _.wasmlibrary_get_group_ids(this.__wbg_ptr, t, n);
    var c = I(r[0], r[1]).slice();
    return _.__wbindgen_free(r[0], r[1] * 4, 4), c;
  }
  get_group_representative_ids() {
    const e = _.wasmlibrary_get_group_representative_ids(this.__wbg_ptr);
    var t = I(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_hidden_cells() {
    const e = _.wasmlibrary_get_hidden_cells(this.__wbg_ptr);
    var t = I(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_instance_cell_contexts() {
    return _.wasmlibrary_get_instance_cell_contexts(this.__wbg_ptr);
  }
  get_instance_label_data() {
    return _.wasmlibrary_get_instance_label_data(this.__wbg_ptr);
  }
  get_render_polygons() {
    const e = _.wasmlibrary_get_render_polygons(this.__wbg_ptr);
    if (e[2]) throw S(e[1]);
    return S(e[0]);
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
    var o = I(c[0], c[1]).slice();
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
    return this.__wbg_ptr = r >>> 0, $.register(this, this.__wbg_ptr, this), this;
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
    const t = F(e, _.__wbindgen_malloc), n = f;
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
    if (i[2]) throw S(i[1]);
    return i[0] !== 0;
  }
  set_active_cell(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    return _.wasmlibrary_set_active_cell(this.__wbg_ptr, t, n) !== 0;
  }
  set_cell_image_bounds(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f;
    var c = l(t) ? 0 : A(t, _.__wbindgen_malloc), o = f;
    _.wasmlibrary_set_cell_image_bounds(this.__wbg_ptr, n, r, c, o);
  }
  set_cell_origin(e, t) {
    return _.wasmlibrary_set_cell_origin(this.__wbg_ptr, e, t) !== 0;
  }
  set_cell_ref_array(e, t, n, r, c) {
    const o = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), i = f;
    return _.wasmlibrary_set_cell_ref_array(this.__wbg_ptr, o, i, t, n, r, c) !== 0;
  }
  set_cell_ref_transform(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = A(t, _.__wbindgen_malloc), o = f;
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
    var c = I(r[0], r[1]).slice();
    return _.__wbindgen_free(r[0], r[1] * 4, 4), c;
  }
  to_gds() {
    const e = _.wasmlibrary_to_gds(this.__wbg_ptr);
    if (e[3]) throw S(e[2]);
    var t = E(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 1, 1), t;
  }
  to_json() {
    let e, t;
    try {
      const c = _.wasmlibrary_to_json(this.__wbg_ptr);
      var n = c[0], r = c[1];
      if (c[3]) throw n = 0, r = 0, S(c[2]);
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
      if (c[3]) throw n = 0, r = 0, S(c[2]);
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
    const r = F(e, _.__wbindgen_malloc), c = f;
    return _.wasmlibrary_translate_elements(this.__wbg_ptr, r, c, t, n) >>> 0;
  }
  update_text(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = g(t, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    return _.wasmlibrary_update_text(this.__wbg_ptr, n, r, c, o) !== 0;
  }
}
Symbol.dispose && (P.prototype[Symbol.dispose] = P.prototype.free);
class q {
  static __wrap(e) {
    e = e >>> 0;
    const t = Object.create(q.prototype);
    return t.__wbg_ptr = e, ee.register(t, t.__wbg_ptr, t), t;
  }
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ee.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    _.__wbg_wasmrenderer_free(e, 0);
  }
  add_shape(e, t, n) {
    const r = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f, o = A(t, _.__wbindgen_malloc), i = f, b = X(n, _.__wbindgen_malloc), s = f;
    _.wasmrenderer_add_shape(this.__wbg_ptr, r, c, o, i, b, s);
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
    var t = I(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_offset() {
    const e = _.wasmrenderer_get_offset(this.__wbg_ptr);
    var t = v(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 8, 8), t;
  }
  get_selection() {
    const e = _.wasmrenderer_get_selection(this.__wbg_ptr);
    var t = I(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get_zoom() {
    return _.wasmrenderer_get_zoom(this.__wbg_ptr);
  }
  mark_dirty() {
    _.wasmrenderer_mark_dirty(this.__wbg_ptr);
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
    const t = F(e, _.__wbindgen_malloc), n = f;
    _.wasmrenderer_set_hover_multiple(this.__wbg_ptr, t, n);
  }
  set_laser_opacity(e) {
    _.wasmrenderer_set_laser_opacity(this.__wbg_ptr, e);
  }
  set_laser_points(e) {
    const t = A(e, _.__wbindgen_malloc), n = f;
    _.wasmrenderer_set_laser_points(this.__wbg_ptr, t, n);
  }
  set_preview_origin(e, t, n, r) {
    const c = X(r, _.__wbindgen_malloc), o = f;
    _.wasmrenderer_set_preview_origin(this.__wbg_ptr, e, t, n, c, o);
  }
  set_preview_shape(e, t) {
    const n = A(e, _.__wbindgen_malloc), r = f, c = X(t, _.__wbindgen_malloc), o = f;
    _.wasmrenderer_set_preview_shape(this.__wbg_ptr, n, r, c, o);
  }
  set_selection(e) {
    const t = F(e, _.__wbindgen_malloc), n = f;
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
    le(e, P), _.wasmrenderer_sync_from_library(this.__wbg_ptr, e.__wbg_ptr);
  }
  toggle_selection(e) {
    const t = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), n = f;
    _.wasmrenderer_toggle_selection(this.__wbg_ptr, t, n);
  }
  update_shape(e, t) {
    const n = g(e, _.__wbindgen_malloc, _.__wbindgen_realloc), r = f, c = A(t, _.__wbindgen_malloc), o = f;
    _.wasmrenderer_update_shape(this.__wbg_ptr, n, r, c, o);
  }
}
Symbol.dispose && (q.prototype[Symbol.dispose] = q.prototype.free);
function De() {
  _.init();
}
function ne() {
  return { __proto__: null, "./rosette_wasm_bg.js": { __proto__: null, __wbg_String_8564e559799eccda: function(e, t) {
    const n = String(t), r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_Window_b0c275b50676d397: function(e) {
    return e.Window;
  }, __wbg_WorkerGlobalScope_7a1f78d9f7542cfa: function(e) {
    return e.WorkerGlobalScope;
  }, __wbg___wbindgen_boolean_get_c0f3f60bac5a78d1: function(e) {
    const t = e, n = typeof t == "boolean" ? t : void 0;
    return l(n) ? 16777215 : n ? 1 : 0;
  }, __wbg___wbindgen_debug_string_5398f5bb970e0daa: function(e, t) {
    const n = Y(t), r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg___wbindgen_is_function_3c846841762788c1: function(e) {
    return typeof e == "function";
  }, __wbg___wbindgen_is_null_0b605fc6b167c56f: function(e) {
    return e === null;
  }, __wbg___wbindgen_is_object_781bc9f159099513: function(e) {
    const t = e;
    return typeof t == "object" && t !== null;
  }, __wbg___wbindgen_is_undefined_52709e72fb9f179c: function(e) {
    return e === void 0;
  }, __wbg___wbindgen_number_get_34bb9d9dcfa21373: function(e, t) {
    const n = t, r = typeof n == "number" ? n : void 0;
    p().setFloat64(e + 8, l(r) ? 0 : r, true), p().setInt32(e + 0, !l(r), true);
  }, __wbg___wbindgen_string_get_395e606bd0ee4427: function(e, t) {
    const n = t, r = typeof n == "string" ? n : void 0;
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg___wbindgen_throw_6ddd609b62940d55: function(e, t) {
    throw new Error(m(e, t));
  }, __wbg__wbg_cb_unref_6b5b6b8576d35cb1: function(e) {
    e._wbg_cb_unref();
  }, __wbg_activeTexture_11610c2c57e26cfa: function(e, t) {
    e.activeTexture(t >>> 0);
  }, __wbg_activeTexture_66fa8cafd3610ddb: function(e, t) {
    e.activeTexture(t >>> 0);
  }, __wbg_attachShader_6426e8576a115345: function(e, t, n) {
    e.attachShader(t, n);
  }, __wbg_attachShader_e557f37438249ff7: function(e, t, n) {
    e.attachShader(t, n);
  }, __wbg_beginComputePass_0fb772608bf84f44: function(e, t) {
    return e.beginComputePass(t);
  }, __wbg_beginQuery_ac2ef47e00ec594a: function(e, t, n) {
    e.beginQuery(t >>> 0, n);
  }, __wbg_beginRenderPass_c662486e5caabb09: function(e, t) {
    return e.beginRenderPass(t);
  }, __wbg_bindAttribLocation_1d976e3bcc954adb: function(e, t, n, r, c) {
    e.bindAttribLocation(t, n >>> 0, m(r, c));
  }, __wbg_bindAttribLocation_8791402cc151e914: function(e, t, n, r, c) {
    e.bindAttribLocation(t, n >>> 0, m(r, c));
  }, __wbg_bindBufferRange_469c3643c2099003: function(e, t, n, r, c, o) {
    e.bindBufferRange(t >>> 0, n >>> 0, r, c, o);
  }, __wbg_bindBuffer_142694a9732bc098: function(e, t, n) {
    e.bindBuffer(t >>> 0, n);
  }, __wbg_bindBuffer_d2a4f6cfb33336fb: function(e, t, n) {
    e.bindBuffer(t >>> 0, n);
  }, __wbg_bindFramebuffer_4643a12ca1c72776: function(e, t, n) {
    e.bindFramebuffer(t >>> 0, n);
  }, __wbg_bindFramebuffer_fdc7c38f1c700e64: function(e, t, n) {
    e.bindFramebuffer(t >>> 0, n);
  }, __wbg_bindRenderbuffer_91db2fc67c1f0115: function(e, t, n) {
    e.bindRenderbuffer(t >>> 0, n);
  }, __wbg_bindRenderbuffer_e6cfc20b6ebcf605: function(e, t, n) {
    e.bindRenderbuffer(t >>> 0, n);
  }, __wbg_bindSampler_be3a05e88cecae98: function(e, t, n) {
    e.bindSampler(t >>> 0, n);
  }, __wbg_bindTexture_6a0892cd752b41d9: function(e, t, n) {
    e.bindTexture(t >>> 0, n);
  }, __wbg_bindTexture_6e7e157d0aabe457: function(e, t, n) {
    e.bindTexture(t >>> 0, n);
  }, __wbg_bindVertexArrayOES_082b0791772327fa: function(e, t) {
    e.bindVertexArrayOES(t);
  }, __wbg_bindVertexArray_c307251f3ff61930: function(e, t) {
    e.bindVertexArray(t);
  }, __wbg_blendColor_b4c7d8333af4876d: function(e, t, n, r, c) {
    e.blendColor(t, n, r, c);
  }, __wbg_blendColor_c2771aead110c867: function(e, t, n, r, c) {
    e.blendColor(t, n, r, c);
  }, __wbg_blendEquationSeparate_b08aba1c715cb265: function(e, t, n) {
    e.blendEquationSeparate(t >>> 0, n >>> 0);
  }, __wbg_blendEquationSeparate_f16ada84ba672878: function(e, t, n) {
    e.blendEquationSeparate(t >>> 0, n >>> 0);
  }, __wbg_blendEquation_46367a891604b604: function(e, t) {
    e.blendEquation(t >>> 0);
  }, __wbg_blendEquation_c353d94b097007e5: function(e, t) {
    e.blendEquation(t >>> 0);
  }, __wbg_blendFuncSeparate_6aae138b81d75b47: function(e, t, n, r, c) {
    e.blendFuncSeparate(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_blendFuncSeparate_8c91c200b1a72e4b: function(e, t, n, r, c) {
    e.blendFuncSeparate(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_blendFunc_2e98c5f57736e5f3: function(e, t, n) {
    e.blendFunc(t >>> 0, n >>> 0);
  }, __wbg_blendFunc_4ce0991003a9468e: function(e, t, n) {
    e.blendFunc(t >>> 0, n >>> 0);
  }, __wbg_blitFramebuffer_c1a68feaca974c87: function(e, t, n, r, c, o, i, b, s, u, y) {
    e.blitFramebuffer(t, n, r, c, o, i, b, s, u >>> 0, y >>> 0);
  }, __wbg_bufferData_730b629ba3f6824f: function(e, t, n, r) {
    e.bufferData(t >>> 0, n, r >>> 0);
  }, __wbg_bufferData_d20232e3d5dcdc62: function(e, t, n, r) {
    e.bufferData(t >>> 0, n, r >>> 0);
  }, __wbg_bufferData_d3bd8c69ff4b7254: function(e, t, n, r) {
    e.bufferData(t >>> 0, n, r >>> 0);
  }, __wbg_bufferData_fb2d946faa09a60b: function(e, t, n, r) {
    e.bufferData(t >>> 0, n, r >>> 0);
  }, __wbg_bufferSubData_3fcefd4648de39b5: function(e, t, n, r) {
    e.bufferSubData(t >>> 0, n, r);
  }, __wbg_bufferSubData_7b112eb88657e7c0: function(e, t, n, r) {
    e.bufferSubData(t >>> 0, n, r);
  }, __wbg_buffer_60b8043cd926067d: function(e) {
    return e.buffer;
  }, __wbg_call_2d781c1f4d5c0ef8: function() {
    return w(function(e, t, n) {
      return e.call(t, n);
    }, arguments);
  }, __wbg_clearBuffer_e063e34f4a181e05: function(e, t, n, r) {
    e.clearBuffer(t, n, r);
  }, __wbg_clearBuffer_f330030ddc7767fc: function(e, t, n) {
    e.clearBuffer(t, n);
  }, __wbg_clearBufferfv_7bc3e789059fd29b: function(e, t, n, r, c) {
    e.clearBufferfv(t >>> 0, n, h(r, c));
  }, __wbg_clearBufferiv_050b376a7480ef9c: function(e, t, n, r, c) {
    e.clearBufferiv(t >>> 0, n, D(r, c));
  }, __wbg_clearBufferuiv_d75635e80261ea93: function(e, t, n, r, c) {
    e.clearBufferuiv(t >>> 0, n, B(r, c));
  }, __wbg_clearDepth_0fb1b5aba2ff2d63: function(e, t) {
    e.clearDepth(t);
  }, __wbg_clearDepth_3ff5ef5e5fad4016: function(e, t) {
    e.clearDepth(t);
  }, __wbg_clearStencil_0e5924dc2f0fa2b7: function(e, t) {
    e.clearStencil(t);
  }, __wbg_clearStencil_4505636e726114d0: function(e, t) {
    e.clearStencil(t);
  }, __wbg_clear_3d6ad4729e206aac: function(e, t) {
    e.clear(t >>> 0);
  }, __wbg_clear_5a0606f7c62ad39a: function(e, t) {
    e.clear(t >>> 0);
  }, __wbg_clientHeight_3d6e452054fdbc3b: function(e) {
    return e.clientHeight;
  }, __wbg_clientWaitSync_5402aac488fc18bb: function(e, t, n, r) {
    return e.clientWaitSync(t, n >>> 0, r >>> 0);
  }, __wbg_clientWidth_33c7e9c1bcdf4a7e: function(e) {
    return e.clientWidth;
  }, __wbg_colorMask_b053114f7da42448: function(e, t, n, r, c) {
    e.colorMask(t !== 0, n !== 0, r !== 0, c !== 0);
  }, __wbg_colorMask_b47840e05b5f8181: function(e, t, n, r, c) {
    e.colorMask(t !== 0, n !== 0, r !== 0, c !== 0);
  }, __wbg_compileShader_623a1051cf49494b: function(e, t) {
    e.compileShader(t);
  }, __wbg_compileShader_7ca66245c2798601: function(e, t) {
    e.compileShader(t);
  }, __wbg_compressedTexSubImage2D_593058a6f5aca176: function(e, t, n, r, c, o, i, b, s) {
    e.compressedTexSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s);
  }, __wbg_compressedTexSubImage2D_aab12b65159c282e: function(e, t, n, r, c, o, i, b, s) {
    e.compressedTexSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s);
  }, __wbg_compressedTexSubImage2D_f3c4ae95ef9d2420: function(e, t, n, r, c, o, i, b, s, u) {
    e.compressedTexSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s, u);
  }, __wbg_compressedTexSubImage3D_77a6ab77487aa211: function(e, t, n, r, c, o, i, b, s, u, y, x) {
    e.compressedTexSubImage3D(t >>> 0, n, r, c, o, i, b, s, u >>> 0, y, x);
  }, __wbg_compressedTexSubImage3D_95f64742aae944b8: function(e, t, n, r, c, o, i, b, s, u, y) {
    e.compressedTexSubImage3D(t >>> 0, n, r, c, o, i, b, s, u >>> 0, y);
  }, __wbg_configure_c71c9f57ca3edf98: function(e, t) {
    e.configure(t);
  }, __wbg_copyBufferSubData_aaeed526e555f0d1: function(e, t, n, r, c, o) {
    e.copyBufferSubData(t >>> 0, n >>> 0, r, c, o);
  }, __wbg_copyBufferToBuffer_910ae8c201bdff01: function(e, t, n, r, c, o) {
    e.copyBufferToBuffer(t, n, r, c, o);
  }, __wbg_copyBufferToTexture_8c287708aff282a4: function(e, t, n, r) {
    e.copyBufferToTexture(t, n, r);
  }, __wbg_copyExternalImageToTexture_540fcadea7d8323f: function(e, t, n, r) {
    e.copyExternalImageToTexture(t, n, r);
  }, __wbg_copyTexSubImage2D_08a10bcd45b88038: function(e, t, n, r, c, o, i, b, s) {
    e.copyTexSubImage2D(t >>> 0, n, r, c, o, i, b, s);
  }, __wbg_copyTexSubImage2D_b9a10d000c616b3e: function(e, t, n, r, c, o, i, b, s) {
    e.copyTexSubImage2D(t >>> 0, n, r, c, o, i, b, s);
  }, __wbg_copyTexSubImage3D_7fcdf7c85bc308a5: function(e, t, n, r, c, o, i, b, s, u) {
    e.copyTexSubImage3D(t >>> 0, n, r, c, o, i, b, s, u);
  }, __wbg_copyTextureToBuffer_76965133f36672a4: function(e, t, n, r) {
    e.copyTextureToBuffer(t, n, r);
  }, __wbg_copyTextureToTexture_04331d5254bea8fc: function(e, t, n, r) {
    e.copyTextureToTexture(t, n, r);
  }, __wbg_createBindGroupLayout_fe258aa231f602a1: function(e, t) {
    return e.createBindGroupLayout(t);
  }, __wbg_createBindGroup_783178b92eca4f94: function(e, t) {
    return e.createBindGroup(t);
  }, __wbg_createBuffer_05c143bc69af7de1: function(e, t) {
    return e.createBuffer(t);
  }, __wbg_createBuffer_1aa34315dc9585a2: function(e) {
    const t = e.createBuffer();
    return l(t) ? 0 : d(t);
  }, __wbg_createBuffer_8e47b88217a98607: function(e) {
    const t = e.createBuffer();
    return l(t) ? 0 : d(t);
  }, __wbg_createCommandEncoder_eeac00d01e7c7215: function(e, t) {
    return e.createCommandEncoder(t);
  }, __wbg_createComputePipeline_70cb69a35311bb5a: function(e, t) {
    return e.createComputePipeline(t);
  }, __wbg_createFramebuffer_911d55689ff8358e: function(e) {
    const t = e.createFramebuffer();
    return l(t) ? 0 : d(t);
  }, __wbg_createFramebuffer_97d39363cdd9242a: function(e) {
    const t = e.createFramebuffer();
    return l(t) ? 0 : d(t);
  }, __wbg_createPipelineLayout_3195019c488e9d1f: function(e, t) {
    return e.createPipelineLayout(t);
  }, __wbg_createProgram_1fa32901e4db13cd: function(e) {
    const t = e.createProgram();
    return l(t) ? 0 : d(t);
  }, __wbg_createProgram_8eb14525e7fcffb8: function(e) {
    const t = e.createProgram();
    return l(t) ? 0 : d(t);
  }, __wbg_createQuerySet_a8afd88335f1ae22: function(e, t) {
    return e.createQuerySet(t);
  }, __wbg_createQuery_0f754c13ae341f39: function(e) {
    const t = e.createQuery();
    return l(t) ? 0 : d(t);
  }, __wbg_createRenderBundleEncoder_0ae4be9a26b4f4aa: function(e, t) {
    return e.createRenderBundleEncoder(t);
  }, __wbg_createRenderPipeline_430c946fe289280f: function(e, t) {
    return e.createRenderPipeline(t);
  }, __wbg_createRenderbuffer_69fb8c438e70e494: function(e) {
    const t = e.createRenderbuffer();
    return l(t) ? 0 : d(t);
  }, __wbg_createRenderbuffer_8847d6a81975caee: function(e) {
    const t = e.createRenderbuffer();
    return l(t) ? 0 : d(t);
  }, __wbg_createSampler_59ee59f9ce9c89e6: function(e, t) {
    return e.createSampler(t);
  }, __wbg_createSampler_7bed7d46769be9a7: function(e) {
    const t = e.createSampler();
    return l(t) ? 0 : d(t);
  }, __wbg_createShaderModule_cb92dd515bc68e5a: function(e, t) {
    return e.createShaderModule(t);
  }, __wbg_createShader_9ffc9dc1832608d7: function(e, t) {
    const n = e.createShader(t >>> 0);
    return l(n) ? 0 : d(n);
  }, __wbg_createShader_a00913b8c6489e6b: function(e, t) {
    const n = e.createShader(t >>> 0);
    return l(n) ? 0 : d(n);
  }, __wbg_createTexture_9b1b4f40cab0097b: function(e) {
    const t = e.createTexture();
    return l(t) ? 0 : d(t);
  }, __wbg_createTexture_ae83ede28133180f: function(e, t) {
    return e.createTexture(t);
  }, __wbg_createTexture_ceb367c3528574ec: function(e) {
    const t = e.createTexture();
    return l(t) ? 0 : d(t);
  }, __wbg_createVertexArrayOES_1b30eca82fb89274: function(e) {
    const t = e.createVertexArrayOES();
    return l(t) ? 0 : d(t);
  }, __wbg_createVertexArray_420460898dc8d838: function(e) {
    const t = e.createVertexArray();
    return l(t) ? 0 : d(t);
  }, __wbg_createView_c0fb516125a12571: function(e, t) {
    return e.createView(t);
  }, __wbg_cullFace_2c9f57c2f90cbe70: function(e, t) {
    e.cullFace(t >>> 0);
  }, __wbg_cullFace_d759515c1199276c: function(e, t) {
    e.cullFace(t >>> 0);
  }, __wbg_debug_4b9b1a2d5972be57: function(e) {
    console.debug(e);
  }, __wbg_deleteBuffer_a2f8244b249c356e: function(e, t) {
    e.deleteBuffer(t);
  }, __wbg_deleteBuffer_b053c58b4ed1ab1c: function(e, t) {
    e.deleteBuffer(t);
  }, __wbg_deleteFramebuffer_1af8b97d40962089: function(e, t) {
    e.deleteFramebuffer(t);
  }, __wbg_deleteFramebuffer_badadfcd45ef5e64: function(e, t) {
    e.deleteFramebuffer(t);
  }, __wbg_deleteProgram_cb8f79d5c1e84863: function(e, t) {
    e.deleteProgram(t);
  }, __wbg_deleteProgram_fc1d8d77ef7e154d: function(e, t) {
    e.deleteProgram(t);
  }, __wbg_deleteQuery_9420681ec3d643ef: function(e, t) {
    e.deleteQuery(t);
  }, __wbg_deleteRenderbuffer_401ffe15b179c343: function(e, t) {
    e.deleteRenderbuffer(t);
  }, __wbg_deleteRenderbuffer_b030660bf2e9fc95: function(e, t) {
    e.deleteRenderbuffer(t);
  }, __wbg_deleteSampler_8111fd44b061bdd1: function(e, t) {
    e.deleteSampler(t);
  }, __wbg_deleteShader_5b6992b5e5894d44: function(e, t) {
    e.deleteShader(t);
  }, __wbg_deleteShader_a8e5ccb432053dbe: function(e, t) {
    e.deleteShader(t);
  }, __wbg_deleteSync_deeb154f55e59a7d: function(e, t) {
    e.deleteSync(t);
  }, __wbg_deleteTexture_00ecab74f7bddf91: function(e, t) {
    e.deleteTexture(t);
  }, __wbg_deleteTexture_d8b1d278731e0c9f: function(e, t) {
    e.deleteTexture(t);
  }, __wbg_deleteVertexArrayOES_9da21e3515bf556e: function(e, t) {
    e.deleteVertexArrayOES(t);
  }, __wbg_deleteVertexArray_5a75f4855c2881df: function(e, t) {
    e.deleteVertexArray(t);
  }, __wbg_depthFunc_0376ef69458b01d8: function(e, t) {
    e.depthFunc(t >>> 0);
  }, __wbg_depthFunc_befeae10cb29920d: function(e, t) {
    e.depthFunc(t >>> 0);
  }, __wbg_depthMask_c6c1b0d88ade6c84: function(e, t) {
    e.depthMask(t !== 0);
  }, __wbg_depthMask_fd5bc408415b9cd3: function(e, t) {
    e.depthMask(t !== 0);
  }, __wbg_depthRange_b42d493a2b9258aa: function(e, t, n) {
    e.depthRange(t, n);
  }, __wbg_depthRange_ebba8110d3fe0332: function(e, t, n) {
    e.depthRange(t, n);
  }, __wbg_destroy_d1537bee2b5a7849: function(e) {
    e.destroy();
  }, __wbg_destroy_d28e196e9dbc3b27: function(e) {
    e.destroy();
  }, __wbg_destroy_ddd5bee0b4b02f49: function(e) {
    e.destroy();
  }, __wbg_disableVertexAttribArray_124a165b099b763b: function(e, t) {
    e.disableVertexAttribArray(t >>> 0);
  }, __wbg_disableVertexAttribArray_c4f42277355986c0: function(e, t) {
    e.disableVertexAttribArray(t >>> 0);
  }, __wbg_disable_62ec2189c50a0db7: function(e, t) {
    e.disable(t >>> 0);
  }, __wbg_disable_7731e2f3362ef1c5: function(e, t) {
    e.disable(t >>> 0);
  }, __wbg_dispatchWorkgroupsIndirect_e915df9199133ac5: function(e, t, n) {
    e.dispatchWorkgroupsIndirect(t, n);
  }, __wbg_dispatchWorkgroups_0d71a3ed9fcaee9f: function(e, t, n, r) {
    e.dispatchWorkgroups(t >>> 0, n >>> 0, r >>> 0);
  }, __wbg_document_c0320cd4183c6d9b: function(e) {
    const t = e.document;
    return l(t) ? 0 : d(t);
  }, __wbg_drawArraysInstancedANGLE_20ee4b8f67503b54: function(e, t, n, r, c) {
    e.drawArraysInstancedANGLE(t >>> 0, n, r, c);
  }, __wbg_drawArraysInstanced_13e40fca13079ade: function(e, t, n, r, c) {
    e.drawArraysInstanced(t >>> 0, n, r, c);
  }, __wbg_drawArrays_13005ccff75e4210: function(e, t, n, r) {
    e.drawArrays(t >>> 0, n, r);
  }, __wbg_drawArrays_c20dedf441392005: function(e, t, n, r) {
    e.drawArrays(t >>> 0, n, r);
  }, __wbg_drawBuffersWEBGL_5f9efe378355889a: function(e, t) {
    e.drawBuffersWEBGL(t);
  }, __wbg_drawBuffers_823c4881ba82dc9c: function(e, t) {
    e.drawBuffers(t);
  }, __wbg_drawElementsInstancedANGLE_e9170c6414853487: function(e, t, n, r, c, o) {
    e.drawElementsInstancedANGLE(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_drawElementsInstanced_2e549060a77ba831: function(e, t, n, r, c, o) {
    e.drawElementsInstanced(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_drawIndexedIndirect_0954a720a9b13248: function(e, t, n) {
    e.drawIndexedIndirect(t, n);
  }, __wbg_drawIndexedIndirect_7882fca885de47ce: function(e, t, n) {
    e.drawIndexedIndirect(t, n);
  }, __wbg_drawIndexed_280977bb1d3baf3d: function(e, t, n, r, c, o) {
    e.drawIndexed(t >>> 0, n >>> 0, r >>> 0, c, o >>> 0);
  }, __wbg_drawIndexed_9a150a51a8427045: function(e, t, n, r, c, o) {
    e.drawIndexed(t >>> 0, n >>> 0, r >>> 0, c, o >>> 0);
  }, __wbg_drawIndirect_b393626eb70ae7fb: function(e, t, n) {
    e.drawIndirect(t, n);
  }, __wbg_drawIndirect_c6c299eb2ddf8fd7: function(e, t, n) {
    e.drawIndirect(t, n);
  }, __wbg_draw_26370233bc7d2e7e: function(e, t, n, r, c) {
    e.draw(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_draw_83285c3877561ec1: function(e, t, n, r, c) {
    e.draw(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_enableVertexAttribArray_60dadea3a00e104a: function(e, t) {
    e.enableVertexAttribArray(t >>> 0);
  }, __wbg_enableVertexAttribArray_626e8d2d9d1fdff9: function(e, t) {
    e.enableVertexAttribArray(t >>> 0);
  }, __wbg_enable_3728894fa8c1d348: function(e, t) {
    e.enable(t >>> 0);
  }, __wbg_enable_91dff7f43064bb54: function(e, t) {
    e.enable(t >>> 0);
  }, __wbg_endQuery_48241eaef2e96940: function(e, t) {
    e.endQuery(t >>> 0);
  }, __wbg_end_420d93a37f764933: function(e) {
    e.end();
  }, __wbg_end_97a4259681c42d8d: function(e) {
    e.end();
  }, __wbg_error_8d9a8e04cd1d3588: function(e) {
    console.error(e);
  }, __wbg_error_a6fa202b58aa1cd3: function(e, t) {
    let n, r;
    try {
      n = e, r = t, console.error(m(e, t));
    } finally {
      _.__wbindgen_free(n, r, 1);
    }
  }, __wbg_error_d9a855c84f9b4e4c: function(e) {
    return e.error;
  }, __wbg_executeBundles_452872ac4afbbf92: function(e, t) {
    e.executeBundles(t);
  }, __wbg_features_15adc13e5b141301: function(e) {
    return e.features;
  }, __wbg_features_f6c1f470639a88e2: function(e) {
    return e.features;
  }, __wbg_fenceSync_460953d9ad5fd31a: function(e, t, n) {
    const r = e.fenceSync(t >>> 0, n >>> 0);
    return l(r) ? 0 : d(r);
  }, __wbg_finish_23cbd862d4229ec3: function(e, t) {
    return e.finish(t);
  }, __wbg_finish_52172eac54898d16: function(e) {
    return e.finish();
  }, __wbg_finish_94bc184b535e2a90: function(e, t) {
    return e.finish(t);
  }, __wbg_finish_dad34d81d4500e85: function(e) {
    return e.finish();
  }, __wbg_framebufferRenderbuffer_7a2be23309166ad3: function(e, t, n, r, c) {
    e.framebufferRenderbuffer(t >>> 0, n >>> 0, r >>> 0, c);
  }, __wbg_framebufferRenderbuffer_d8c1d0b985bd3c51: function(e, t, n, r, c) {
    e.framebufferRenderbuffer(t >>> 0, n >>> 0, r >>> 0, c);
  }, __wbg_framebufferTexture2D_bf4d47f4027a3682: function(e, t, n, r, c, o) {
    e.framebufferTexture2D(t >>> 0, n >>> 0, r >>> 0, c, o);
  }, __wbg_framebufferTexture2D_e2f7d82e6707010e: function(e, t, n, r, c, o) {
    e.framebufferTexture2D(t >>> 0, n >>> 0, r >>> 0, c, o);
  }, __wbg_framebufferTextureLayer_01d5b9516636ccae: function(e, t, n, r, c, o) {
    e.framebufferTextureLayer(t >>> 0, n >>> 0, r, c, o);
  }, __wbg_framebufferTextureMultiviewOVR_336ea10e261ec5f6: function(e, t, n, r, c, o, i) {
    e.framebufferTextureMultiviewOVR(t >>> 0, n >>> 0, r, c, o, i);
  }, __wbg_frontFace_1537b8c3fc174f05: function(e, t) {
    e.frontFace(t >>> 0);
  }, __wbg_frontFace_57081a0312eb822e: function(e, t) {
    e.frontFace(t >>> 0);
  }, __wbg_getBindGroupLayout_6d503a1fba524ee6: function(e, t) {
    return e.getBindGroupLayout(t >>> 0);
  }, __wbg_getBindGroupLayout_bc897888c0670dbe: function(e, t) {
    return e.getBindGroupLayout(t >>> 0);
  }, __wbg_getBufferSubData_cbabbb87d4c5c57d: function(e, t, n, r) {
    e.getBufferSubData(t >>> 0, n, r);
  }, __wbg_getCompilationInfo_469a33f449854be7: function(e) {
    return e.getCompilationInfo();
  }, __wbg_getContext_07270456453ee7f5: function() {
    return w(function(e, t, n, r) {
      const c = e.getContext(m(t, n), r);
      return l(c) ? 0 : d(c);
    }, arguments);
  }, __wbg_getContext_794490fe04be926a: function() {
    return w(function(e, t, n, r) {
      const c = e.getContext(m(t, n), r);
      return l(c) ? 0 : d(c);
    }, arguments);
  }, __wbg_getContext_a9236f98f1f7fe7c: function() {
    return w(function(e, t, n) {
      const r = e.getContext(m(t, n));
      return l(r) ? 0 : d(r);
    }, arguments);
  }, __wbg_getContext_f04bf8f22dcb2d53: function() {
    return w(function(e, t, n) {
      const r = e.getContext(m(t, n));
      return l(r) ? 0 : d(r);
    }, arguments);
  }, __wbg_getCurrentTexture_e27b103ea7a3ce3c: function(e) {
    return e.getCurrentTexture();
  }, __wbg_getElementById_d1f25d287b19a833: function(e, t, n) {
    const r = e.getElementById(m(t, n));
    return l(r) ? 0 : d(r);
  }, __wbg_getExtension_0b8543b0c6b3068d: function() {
    return w(function(e, t, n) {
      const r = e.getExtension(m(t, n));
      return l(r) ? 0 : d(r);
    }, arguments);
  }, __wbg_getIndexedParameter_338c7c91cbabcf3e: function() {
    return w(function(e, t, n) {
      return e.getIndexedParameter(t >>> 0, n >>> 0);
    }, arguments);
  }, __wbg_getMappedRange_4f36f39e059a63c6: function(e, t, n) {
    return e.getMappedRange(t, n);
  }, __wbg_getParameter_b1431cfde390c2fc: function() {
    return w(function(e, t) {
      return e.getParameter(t >>> 0);
    }, arguments);
  }, __wbg_getParameter_e634fa73b5e25287: function() {
    return w(function(e, t) {
      return e.getParameter(t >>> 0);
    }, arguments);
  }, __wbg_getPreferredCanvasFormat_13332df72e63723a: function(e) {
    const t = e.getPreferredCanvasFormat();
    return (ge.indexOf(t) + 1 || 96) - 1;
  }, __wbg_getProgramInfoLog_50443ddea7475f57: function(e, t, n) {
    const r = t.getProgramInfoLog(n);
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg_getProgramInfoLog_e03efa51473d657e: function(e, t, n) {
    const r = t.getProgramInfoLog(n);
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg_getProgramParameter_46e2d49878b56edd: function(e, t, n) {
    return e.getProgramParameter(t, n >>> 0);
  }, __wbg_getProgramParameter_7d3bd54ec02de007: function(e, t, n) {
    return e.getProgramParameter(t, n >>> 0);
  }, __wbg_getQueryParameter_5a3a2bd77e5f56bb: function(e, t, n) {
    return e.getQueryParameter(t, n >>> 0);
  }, __wbg_getRandomValues_a1cf2e70b003a59d: function() {
    return w(function(e, t) {
      globalThis.crypto.getRandomValues(E(e, t));
    }, arguments);
  }, __wbg_getShaderInfoLog_22f9e8c90a52f38d: function(e, t, n) {
    const r = t.getShaderInfoLog(n);
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg_getShaderInfoLog_40c6a4ae67d82dde: function(e, t, n) {
    const r = t.getShaderInfoLog(n);
    var c = l(r) ? 0 : g(r, _.__wbindgen_malloc, _.__wbindgen_realloc), o = f;
    p().setInt32(e + 4, o, true), p().setInt32(e + 0, c, true);
  }, __wbg_getShaderParameter_46f64f7ca5d534db: function(e, t, n) {
    return e.getShaderParameter(t, n >>> 0);
  }, __wbg_getShaderParameter_82c275299b111f1b: function(e, t, n) {
    return e.getShaderParameter(t, n >>> 0);
  }, __wbg_getSupportedExtensions_a799751b74c3a674: function(e) {
    const t = e.getSupportedExtensions();
    return l(t) ? 0 : d(t);
  }, __wbg_getSupportedProfiles_e089393bebafd3b0: function(e) {
    const t = e.getSupportedProfiles();
    return l(t) ? 0 : d(t);
  }, __wbg_getSyncParameter_fbf70c60f5e3b271: function(e, t, n) {
    return e.getSyncParameter(t, n >>> 0);
  }, __wbg_getUniformBlockIndex_e483a4d166df9c2a: function(e, t, n, r) {
    return e.getUniformBlockIndex(t, m(n, r));
  }, __wbg_getUniformLocation_5eb08673afa04eee: function(e, t, n, r) {
    const c = e.getUniformLocation(t, m(n, r));
    return l(c) ? 0 : d(c);
  }, __wbg_getUniformLocation_90cdff44c2fceeb9: function(e, t, n, r) {
    const c = e.getUniformLocation(t, m(n, r));
    return l(c) ? 0 : d(c);
  }, __wbg_get_a8ee5c45dabc1b3b: function(e, t) {
    return e[t >>> 0];
  }, __wbg_get_c7546417fb0bec10: function(e, t) {
    const n = e[t >>> 0];
    return l(n) ? 0 : d(n);
  }, __wbg_get_unchecked_329cfe50afab7352: function(e, t) {
    return e[t >>> 0];
  }, __wbg_gpu_c773d7932dc745d7: function(e) {
    return e.gpu;
  }, __wbg_has_b54bd7b6e9da11c7: function(e, t, n) {
    return e.has(m(t, n));
  }, __wbg_height_05531443b91baa6e: function(e) {
    return e.height;
  }, __wbg_height_6568c4427c3b889d: function(e) {
    return e.height;
  }, __wbg_height_a6fcb48398bd1539: function(e) {
    return e.height;
  }, __wbg_height_ee9ea840e5499878: function(e) {
    return e.height;
  }, __wbg_height_fb8c4164276f25fd: function(e) {
    return e.height;
  }, __wbg_includes_9f81335525be01f9: function(e, t, n) {
    return e.includes(t, n);
  }, __wbg_info_7d4e223bb1a7e671: function(e) {
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
  }, __wbg_instanceof_HtmlCanvasElement_26125339f936be50: function(e) {
    let t;
    try {
      t = e instanceof HTMLCanvasElement;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_Object_be1962063fcc0c9f: function(e) {
    let t;
    try {
      t = e instanceof Object;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_WebGl2RenderingContext_349f232f715e6bc2: function(e) {
    let t;
    try {
      t = e instanceof WebGL2RenderingContext;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_Window_23e677d2c6843922: function(e) {
    let t;
    try {
      t = e instanceof Window;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_invalidateFramebuffer_df9574509a402d4f: function() {
    return w(function(e, t, n) {
      e.invalidateFramebuffer(t >>> 0, n);
    }, arguments);
  }, __wbg_is_a166b9958c2438ad: function(e, t) {
    return Object.is(e, t);
  }, __wbg_label_614ef5e608843844: function(e, t) {
    const n = t.label, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_length_550d8a396009cd38: function(e) {
    return e.length;
  }, __wbg_length_b3416cf66a5452c8: function(e) {
    return e.length;
  }, __wbg_length_d34bf7d191aa0640: function(e) {
    return e.length;
  }, __wbg_length_ea16607d7b61445b: function(e) {
    return e.length;
  }, __wbg_limits_2bfe39eb5f0b5a01: function(e) {
    return e.limits;
  }, __wbg_limits_77193ad8b62f8502: function(e) {
    return e.limits;
  }, __wbg_lineNum_95b780ade9fb4ba3: function(e) {
    return e.lineNum;
  }, __wbg_linkProgram_b969f67969a850b5: function(e, t) {
    e.linkProgram(t);
  }, __wbg_linkProgram_e626a3e7d78e1738: function(e, t) {
    e.linkProgram(t);
  }, __wbg_log_524eedafa26daa59: function(e) {
    console.log(e);
  }, __wbg_lost_21e9db8a9502a0ca: function(e) {
    return e.lost;
  }, __wbg_mapAsync_f4fc38ac51855b15: function(e, t, n, r) {
    return e.mapAsync(t >>> 0, n, r);
  }, __wbg_maxBindGroups_cc0c1b6031ac310e: function(e) {
    return e.maxBindGroups;
  }, __wbg_maxBindingsPerBindGroup_d950de0c90e382e0: function(e) {
    return e.maxBindingsPerBindGroup;
  }, __wbg_maxBufferSize_01e5e024c304478a: function(e) {
    return e.maxBufferSize;
  }, __wbg_maxColorAttachmentBytesPerSample_91fc5eb9155186fd: function(e) {
    return e.maxColorAttachmentBytesPerSample;
  }, __wbg_maxColorAttachments_69f3bac8513cd2ce: function(e) {
    return e.maxColorAttachments;
  }, __wbg_maxComputeInvocationsPerWorkgroup_5d8e1f9e65b5443c: function(e) {
    return e.maxComputeInvocationsPerWorkgroup;
  }, __wbg_maxComputeWorkgroupSizeX_e8c75fa90e0b00b7: function(e) {
    return e.maxComputeWorkgroupSizeX;
  }, __wbg_maxComputeWorkgroupSizeY_72bce71ec7fa9330: function(e) {
    return e.maxComputeWorkgroupSizeY;
  }, __wbg_maxComputeWorkgroupSizeZ_8c7050ac47c80e42: function(e) {
    return e.maxComputeWorkgroupSizeZ;
  }, __wbg_maxComputeWorkgroupStorageSize_b789a39c5a0fd04a: function(e) {
    return e.maxComputeWorkgroupStorageSize;
  }, __wbg_maxComputeWorkgroupsPerDimension_a02a7f66f7c68b9c: function(e) {
    return e.maxComputeWorkgroupsPerDimension;
  }, __wbg_maxDynamicStorageBuffersPerPipelineLayout_90d4eb33665de8d1: function(e) {
    return e.maxDynamicStorageBuffersPerPipelineLayout;
  }, __wbg_maxDynamicUniformBuffersPerPipelineLayout_835864d8a793cc95: function(e) {
    return e.maxDynamicUniformBuffersPerPipelineLayout;
  }, __wbg_maxSampledTexturesPerShaderStage_f1fdaca8bd10047f: function(e) {
    return e.maxSampledTexturesPerShaderStage;
  }, __wbg_maxSamplersPerShaderStage_a0126ce660fc903a: function(e) {
    return e.maxSamplersPerShaderStage;
  }, __wbg_maxStorageBufferBindingSize_9ed12d54b564312c: function(e) {
    return e.maxStorageBufferBindingSize;
  }, __wbg_maxStorageBuffersPerShaderStage_7db5a7548c1199e6: function(e) {
    return e.maxStorageBuffersPerShaderStage;
  }, __wbg_maxStorageTexturesPerShaderStage_3df697d427690d26: function(e) {
    return e.maxStorageTexturesPerShaderStage;
  }, __wbg_maxTextureArrayLayers_759d0ac67e0a7d26: function(e) {
    return e.maxTextureArrayLayers;
  }, __wbg_maxTextureDimension1D_4bfdff8638ada7c1: function(e) {
    return e.maxTextureDimension1D;
  }, __wbg_maxTextureDimension2D_ea0c9c4d0b239666: function(e) {
    return e.maxTextureDimension2D;
  }, __wbg_maxTextureDimension3D_e76f3604806f47be: function(e) {
    return e.maxTextureDimension3D;
  }, __wbg_maxUniformBufferBindingSize_591ad000ffe10aad: function(e) {
    return e.maxUniformBufferBindingSize;
  }, __wbg_maxUniformBuffersPerShaderStage_6e5696dba506ca6c: function(e) {
    return e.maxUniformBuffersPerShaderStage;
  }, __wbg_maxVertexAttributes_fef434a4cf2ba188: function(e) {
    return e.maxVertexAttributes;
  }, __wbg_maxVertexBufferArrayStride_de60c38ec574b423: function(e) {
    return e.maxVertexBufferArrayStride;
  }, __wbg_maxVertexBuffers_d1a4a2fba06ae7d6: function(e) {
    return e.maxVertexBuffers;
  }, __wbg_message_8fd23df93c50075a: function(e, t) {
    const n = t.message, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_message_b00edacf4a520b03: function(e, t) {
    const n = t.message, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_message_d2eedafa0bd554a6: function(e, t) {
    const n = t.message, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_messages_1df11461d071c92c: function(e) {
    return e.messages;
  }, __wbg_minStorageBufferOffsetAlignment_49f6b6baa1d34111: function(e) {
    return e.minStorageBufferOffsetAlignment;
  }, __wbg_minUniformBufferOffsetAlignment_39ec7837ddc9ee2c: function(e) {
    return e.minUniformBufferOffsetAlignment;
  }, __wbg_navigator_583ffd4fc14c0f7a: function(e) {
    return e.navigator;
  }, __wbg_navigator_9cebf56f28aa719b: function(e) {
    return e.navigator;
  }, __wbg_new_227d7c05414eb861: function() {
    return new Error();
  }, __wbg_new_a70fbab9066b301f: function() {
    return new Array();
  }, __wbg_new_ab79df5bd7c26067: function() {
    return new Object();
  }, __wbg_new_from_slice_22da9388ac046e50: function(e, t) {
    return new Uint8Array(E(e, t));
  }, __wbg_new_from_slice_ff94ab4827a1a00b: function(e, t) {
    return new Float64Array(v(e, t));
  }, __wbg_new_typed_aaaeaf29cf802876: function(e, t) {
    try {
      var n = { a: e, b: t }, r = (o, i) => {
        const b = n.a;
        n.a = 0;
        try {
          return fe(b, n.b, o, i);
        } finally {
          n.a = b;
        }
      };
      return new Promise(r);
    } finally {
      n.a = n.b = 0;
    }
  }, __wbg_new_typed_bccac67128ed885a: function() {
    return new Array();
  }, __wbg_new_with_byte_offset_and_length_b2ec5bf7b2f35743: function(e, t, n) {
    return new Uint8Array(e, t >>> 0, n >>> 0);
  }, __wbg_new_with_length_eae667475c36c4e4: function(e) {
    return new Float64Array(e >>> 0);
  }, __wbg_of_8bf7ed3eca00ea43: function(e) {
    return Array.of(e);
  }, __wbg_offset_78dcfcd1f3ebc4ea: function(e) {
    return e.offset;
  }, __wbg_pixelStorei_2a2385ed59538d48: function(e, t, n) {
    e.pixelStorei(t >>> 0, n);
  }, __wbg_pixelStorei_2a3c5b85cf37caba: function(e, t, n) {
    e.pixelStorei(t >>> 0, n);
  }, __wbg_polygonOffset_17cb85e417bf9db7: function(e, t, n) {
    e.polygonOffset(t, n);
  }, __wbg_polygonOffset_cc6bec2f9f4a18f7: function(e, t, n) {
    e.polygonOffset(t, n);
  }, __wbg_popErrorScope_efb23ea2dcc3b587: function(e) {
    return e.popErrorScope();
  }, __wbg_prototypesetcall_d62e5099504357e6: function(e, t, n) {
    Uint8Array.prototype.set.call(E(e, t), n);
  }, __wbg_pushErrorScope_9a7570b7a9f67657: function(e, t) {
    e.pushErrorScope(ue[t]);
  }, __wbg_push_e87b0e732085a946: function(e, t) {
    return e.push(t);
  }, __wbg_queryCounterEXT_12ca9f560a5855cb: function(e, t, n) {
    e.queryCounterEXT(t, n >>> 0);
  }, __wbg_querySelectorAll_ccbf0696a1c6fed8: function() {
    return w(function(e, t, n) {
      return e.querySelectorAll(m(t, n));
    }, arguments);
  }, __wbg_querySelector_46ff1b81410aebea: function() {
    return w(function(e, t, n) {
      const r = e.querySelector(m(t, n));
      return l(r) ? 0 : d(r);
    }, arguments);
  }, __wbg_queueMicrotask_0c399741342fb10f: function(e) {
    return e.queueMicrotask;
  }, __wbg_queueMicrotask_a082d78ce798393e: function(e) {
    queueMicrotask(e);
  }, __wbg_queue_9595c5175ef399b9: function(e) {
    return e.queue;
  }, __wbg_readBuffer_e559a3da4aa9e434: function(e, t) {
    e.readBuffer(t >>> 0);
  }, __wbg_readPixels_41a371053c299080: function() {
    return w(function(e, t, n, r, c, o, i, b) {
      e.readPixels(t, n, r, c, o >>> 0, i >>> 0, b);
    }, arguments);
  }, __wbg_readPixels_5c7066b5bd547f81: function() {
    return w(function(e, t, n, r, c, o, i, b) {
      e.readPixels(t, n, r, c, o >>> 0, i >>> 0, b);
    }, arguments);
  }, __wbg_readPixels_f675ed52bd44f8f1: function() {
    return w(function(e, t, n, r, c, o, i, b) {
      e.readPixels(t, n, r, c, o >>> 0, i >>> 0, b);
    }, arguments);
  }, __wbg_reason_f9df4a653cfa764b: function(e) {
    const t = e.reason;
    return (se.indexOf(t) + 1 || 3) - 1;
  }, __wbg_reject_452b6409a2fde3cd: function(e) {
    return Promise.reject(e);
  }, __wbg_renderbufferStorageMultisample_d999a80fbc25df5f: function(e, t, n, r, c, o) {
    e.renderbufferStorageMultisample(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_renderbufferStorage_9130171a6ae371dc: function(e, t, n, r, c) {
    e.renderbufferStorage(t >>> 0, n >>> 0, r, c);
  }, __wbg_renderbufferStorage_b184ea29064b4e02: function(e, t, n, r, c) {
    e.renderbufferStorage(t >>> 0, n >>> 0, r, c);
  }, __wbg_requestAdapter_592f04f645dfaf68: function(e, t) {
    return e.requestAdapter(t);
  }, __wbg_requestDevice_52bb2980e6280ebc: function(e, t) {
    return e.requestDevice(t);
  }, __wbg_resolveQuerySet_b316102e1d152b52: function(e, t, n, r, c, o) {
    e.resolveQuerySet(t, n >>> 0, r >>> 0, c, o >>> 0);
  }, __wbg_resolve_ae8d83246e5bcc12: function(e) {
    return Promise.resolve(e);
  }, __wbg_samplerParameterf_774cff2229cc9fc3: function(e, t, n, r) {
    e.samplerParameterf(t, n >>> 0, r);
  }, __wbg_samplerParameteri_7dde222b01588620: function(e, t, n, r) {
    e.samplerParameteri(t, n >>> 0, r);
  }, __wbg_scissor_b18f09381b341db5: function(e, t, n, r, c) {
    e.scissor(t, n, r, c);
  }, __wbg_scissor_db3842546fb31842: function(e, t, n, r, c) {
    e.scissor(t, n, r, c);
  }, __wbg_setBindGroup_0fb411b7d1ec4966: function(e, t, n, r, c, o, i) {
    e.setBindGroup(t >>> 0, n, B(r, c), o, i >>> 0);
  }, __wbg_setBindGroup_1c6bfc705c95f81f: function(e, t, n) {
    e.setBindGroup(t >>> 0, n);
  }, __wbg_setBindGroup_2ec8db65419ec50c: function(e, t, n, r, c, o, i) {
    e.setBindGroup(t >>> 0, n, B(r, c), o, i >>> 0);
  }, __wbg_setBindGroup_3afbefd496741277: function(e, t, n) {
    e.setBindGroup(t >>> 0, n);
  }, __wbg_setBindGroup_4ac51c0e16178380: function(e, t, n) {
    e.setBindGroup(t >>> 0, n);
  }, __wbg_setBindGroup_c2fbfec522cc7572: function(e, t, n, r, c, o, i) {
    e.setBindGroup(t >>> 0, n, B(r, c), o, i >>> 0);
  }, __wbg_setBlendConstant_00bed453ac51c91b: function(e, t) {
    e.setBlendConstant(t);
  }, __wbg_setIndexBuffer_42017bb879ab062b: function(e, t, n, r) {
    e.setIndexBuffer(t, Q[n], r);
  }, __wbg_setIndexBuffer_4876c05f77106bb6: function(e, t, n, r, c) {
    e.setIndexBuffer(t, Q[n], r, c);
  }, __wbg_setIndexBuffer_8c79ee0b0b6460fa: function(e, t, n, r) {
    e.setIndexBuffer(t, Q[n], r);
  }, __wbg_setIndexBuffer_e10a7cf5d063fdab: function(e, t, n, r, c) {
    e.setIndexBuffer(t, Q[n], r, c);
  }, __wbg_setPipeline_5c5a949bf12f8a5f: function(e, t) {
    e.setPipeline(t);
  }, __wbg_setPipeline_c4793bebd98b8e56: function(e, t) {
    e.setPipeline(t);
  }, __wbg_setPipeline_ce7a683c2c94919d: function(e, t) {
    e.setPipeline(t);
  }, __wbg_setScissorRect_cf24179de05b8393: function(e, t, n, r, c) {
    e.setScissorRect(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_setStencilReference_7a98f054e2f31f54: function(e, t) {
    e.setStencilReference(t >>> 0);
  }, __wbg_setVertexBuffer_06dd033f8e75af24: function(e, t, n, r) {
    e.setVertexBuffer(t >>> 0, n, r);
  }, __wbg_setVertexBuffer_c973cd35605098e4: function(e, t, n, r, c) {
    e.setVertexBuffer(t >>> 0, n, r, c);
  }, __wbg_setVertexBuffer_e80315ecd1774568: function(e, t, n, r) {
    e.setVertexBuffer(t >>> 0, n, r);
  }, __wbg_setVertexBuffer_ef41a6013dba1352: function(e, t, n, r, c) {
    e.setVertexBuffer(t >>> 0, n, r, c);
  }, __wbg_setViewport_75637b1c9a301986: function(e, t, n, r, c, o, i) {
    e.setViewport(t, n, r, c, o, i);
  }, __wbg_set_282384002438957f: function(e, t, n) {
    e[t >>> 0] = n;
  }, __wbg_set_636d1e3e4286e068: function(e, t, n) {
    e.set(v(t, n));
  }, __wbg_set_6be42768c690e380: function(e, t, n) {
    e[t] = n;
  }, __wbg_set_7eaa4f96924fd6b3: function() {
    return w(function(e, t, n) {
      return Reflect.set(e, t, n);
    }, arguments);
  }, __wbg_set_e80615d7a9a43981: function(e, t, n) {
    e.set(t, n >>> 0);
  }, __wbg_set_height_98a1a397672657e2: function(e, t) {
    e.height = t >>> 0;
  }, __wbg_set_height_b6548a01bdcb689a: function(e, t) {
    e.height = t >>> 0;
  }, __wbg_set_onuncapturederror_5c20c4125b115c22: function(e, t) {
    e.onuncapturederror = t;
  }, __wbg_set_width_576343a4a7f2cf28: function(e, t) {
    e.width = t >>> 0;
  }, __wbg_set_width_c0fcaa2da53cd540: function(e, t) {
    e.width = t >>> 0;
  }, __wbg_shaderSource_06639e7b476e6ac2: function(e, t, n, r) {
    e.shaderSource(t, m(n, r));
  }, __wbg_shaderSource_2bca0edc97475e95: function(e, t, n, r) {
    e.shaderSource(t, m(n, r));
  }, __wbg_size_b5c1b72884cb3fa5: function(e) {
    return e.size;
  }, __wbg_stack_3b0d974bbf31e44f: function(e, t) {
    const n = t.stack, r = g(n, _.__wbindgen_malloc, _.__wbindgen_realloc), c = f;
    p().setInt32(e + 4, c, true), p().setInt32(e + 0, r, true);
  }, __wbg_static_accessor_GLOBAL_8adb955bd33fac2f: function() {
    const e = typeof global > "u" ? null : global;
    return l(e) ? 0 : d(e);
  }, __wbg_static_accessor_GLOBAL_THIS_ad356e0db91c7913: function() {
    const e = typeof globalThis > "u" ? null : globalThis;
    return l(e) ? 0 : d(e);
  }, __wbg_static_accessor_SELF_f207c857566db248: function() {
    const e = typeof self > "u" ? null : self;
    return l(e) ? 0 : d(e);
  }, __wbg_static_accessor_WINDOW_bb9f1ba69d61b386: function() {
    const e = typeof window > "u" ? null : window;
    return l(e) ? 0 : d(e);
  }, __wbg_stencilFuncSeparate_18642df0574c1930: function(e, t, n, r, c) {
    e.stencilFuncSeparate(t >>> 0, n >>> 0, r, c >>> 0);
  }, __wbg_stencilFuncSeparate_94ee4fbc164addec: function(e, t, n, r, c) {
    e.stencilFuncSeparate(t >>> 0, n >>> 0, r, c >>> 0);
  }, __wbg_stencilMaskSeparate_13b0475860a9b559: function(e, t, n) {
    e.stencilMaskSeparate(t >>> 0, n >>> 0);
  }, __wbg_stencilMaskSeparate_a7bd409376ee05ff: function(e, t, n) {
    e.stencilMaskSeparate(t >>> 0, n >>> 0);
  }, __wbg_stencilMask_326a11d0928c3808: function(e, t) {
    e.stencilMask(t >>> 0);
  }, __wbg_stencilMask_6354f8ba392f6581: function(e, t) {
    e.stencilMask(t >>> 0);
  }, __wbg_stencilOpSeparate_7e819381705b9731: function(e, t, n, r, c) {
    e.stencilOpSeparate(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_stencilOpSeparate_8627d0f5f7fe5800: function(e, t, n, r, c) {
    e.stencilOpSeparate(t >>> 0, n >>> 0, r >>> 0, c >>> 0);
  }, __wbg_submit_6ffa2ed48b3eaecf: function(e, t) {
    e.submit(t);
  }, __wbg_texImage2D_32ed4220040ca614: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texImage2D_f4ae6c314a9a4bbe: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texImage3D_88ff1fa41be127b9: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u, y) {
      e.texImage3D(t >>> 0, n, r, c, o, i, b, s >>> 0, u >>> 0, y);
    }, arguments);
  }, __wbg_texParameteri_f4b1596185f5432d: function(e, t, n, r) {
    e.texParameteri(t >>> 0, n >>> 0, r);
  }, __wbg_texParameteri_fcdec30159061963: function(e, t, n, r) {
    e.texParameteri(t >>> 0, n >>> 0, r);
  }, __wbg_texStorage2D_a84f74d36d279097: function(e, t, n, r, c, o) {
    e.texStorage2D(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_texStorage3D_aec6fc3e85ec72da: function(e, t, n, r, c, o, i) {
    e.texStorage3D(t >>> 0, n, r >>> 0, c, o, i);
  }, __wbg_texSubImage2D_1e7d6febf82b9bed: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_271ffedb47424d0d: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_3bb41b987f2bfe39: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_68e0413824eddc12: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_b6cdbbe62097211a: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_c8919d8f32f723da: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_d784df0b813dc1ab: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage2D_dd1d50234b61de4b: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u) {
      e.texSubImage2D(t >>> 0, n, r, c, o, i, b >>> 0, s >>> 0, u);
    }, arguments);
  }, __wbg_texSubImage3D_09cc863aedf44a21: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, b, s, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_4665e67a8f0f7806: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, b, s, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_61ed187f3ec11ecc: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, b, s, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_6a46981af8bc8e49: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, b, s, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_9eca35d234d51b8a: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, b, s, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_b3cbbb79fe54da6d: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, b, s, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_texSubImage3D_f9c3af789162846a: function() {
    return w(function(e, t, n, r, c, o, i, b, s, u, y, x) {
      e.texSubImage3D(t >>> 0, n, r, c, o, i, b, s, u >>> 0, y >>> 0, x);
    }, arguments);
  }, __wbg_then_098abe61755d12f6: function(e, t) {
    return e.then(t);
  }, __wbg_then_1d7a5273811a5cea: function(e, t) {
    return e.then(t);
  }, __wbg_then_9e335f6dd892bc11: function(e, t, n) {
    return e.then(t, n);
  }, __wbg_then_bc59d1943397ca4e: function(e, t, n) {
    return e.then(t, n);
  }, __wbg_type_ba6bfed8f5073b9e: function(e) {
    const t = e.type;
    return (be.indexOf(t) + 1 || 4) - 1;
  }, __wbg_uniform1f_8c3b03df282dba21: function(e, t, n) {
    e.uniform1f(t, n);
  }, __wbg_uniform1f_b8841988568406b9: function(e, t, n) {
    e.uniform1f(t, n);
  }, __wbg_uniform1i_953040fb972e9fab: function(e, t, n) {
    e.uniform1i(t, n);
  }, __wbg_uniform1i_acd89bea81085be4: function(e, t, n) {
    e.uniform1i(t, n);
  }, __wbg_uniform1ui_9f8d9b877d6691d8: function(e, t, n) {
    e.uniform1ui(t, n >>> 0);
  }, __wbg_uniform2fv_28fbf8836f3045d0: function(e, t, n, r) {
    e.uniform2fv(t, h(n, r));
  }, __wbg_uniform2fv_f3c92aab21d0dec3: function(e, t, n, r) {
    e.uniform2fv(t, h(n, r));
  }, __wbg_uniform2iv_892b6d31137ad198: function(e, t, n, r) {
    e.uniform2iv(t, D(n, r));
  }, __wbg_uniform2iv_f40f632615c5685a: function(e, t, n, r) {
    e.uniform2iv(t, D(n, r));
  }, __wbg_uniform2uiv_6d170469a702f23e: function(e, t, n, r) {
    e.uniform2uiv(t, B(n, r));
  }, __wbg_uniform3fv_85a9a17c9635941b: function(e, t, n, r) {
    e.uniform3fv(t, h(n, r));
  }, __wbg_uniform3fv_cdf7c84f9119f13b: function(e, t, n, r) {
    e.uniform3fv(t, h(n, r));
  }, __wbg_uniform3iv_38e74d2ae9dfbfb8: function(e, t, n, r) {
    e.uniform3iv(t, D(n, r));
  }, __wbg_uniform3iv_4c372010ac6def3f: function(e, t, n, r) {
    e.uniform3iv(t, D(n, r));
  }, __wbg_uniform3uiv_bb7266bb3a5aef96: function(e, t, n, r) {
    e.uniform3uiv(t, B(n, r));
  }, __wbg_uniform4f_0b00a34f4789ad14: function(e, t, n, r, c, o) {
    e.uniform4f(t, n, r, c, o);
  }, __wbg_uniform4f_7275e0fb864b7513: function(e, t, n, r, c, o) {
    e.uniform4f(t, n, r, c, o);
  }, __wbg_uniform4fv_a4cdb4bd66867df5: function(e, t, n, r) {
    e.uniform4fv(t, h(n, r));
  }, __wbg_uniform4fv_c416900acf65eca9: function(e, t, n, r) {
    e.uniform4fv(t, h(n, r));
  }, __wbg_uniform4iv_b49cd4acf0aa3ebc: function(e, t, n, r) {
    e.uniform4iv(t, D(n, r));
  }, __wbg_uniform4iv_d654af0e6b7bdb1a: function(e, t, n, r) {
    e.uniform4iv(t, D(n, r));
  }, __wbg_uniform4uiv_e95d9a124fb8f91e: function(e, t, n, r) {
    e.uniform4uiv(t, B(n, r));
  }, __wbg_uniformBlockBinding_a47fa267662afd7b: function(e, t, n, r) {
    e.uniformBlockBinding(t, n >>> 0, r >>> 0);
  }, __wbg_uniformMatrix2fv_4229ae27417c649a: function(e, t, n, r, c) {
    e.uniformMatrix2fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix2fv_648417dd2040de5b: function(e, t, n, r, c) {
    e.uniformMatrix2fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix2x3fv_eb9a53c8c9aa724b: function(e, t, n, r, c) {
    e.uniformMatrix2x3fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix2x4fv_8849517a52f2e845: function(e, t, n, r, c) {
    e.uniformMatrix2x4fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix3fv_244fc4416319c169: function(e, t, n, r, c) {
    e.uniformMatrix3fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix3fv_bafc2707d0c48e27: function(e, t, n, r, c) {
    e.uniformMatrix3fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix3x2fv_f1729eb13fcd41a3: function(e, t, n, r, c) {
    e.uniformMatrix3x2fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix3x4fv_3c11181f5fa929de: function(e, t, n, r, c) {
    e.uniformMatrix3x4fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix4fv_4d322b295d122214: function(e, t, n, r, c) {
    e.uniformMatrix4fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix4fv_7c68dee5aee11694: function(e, t, n, r, c) {
    e.uniformMatrix4fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix4x2fv_5a8701b552d704af: function(e, t, n, r, c) {
    e.uniformMatrix4x2fv(t, n !== 0, h(r, c));
  }, __wbg_uniformMatrix4x3fv_741c3f4e0b2c7e04: function(e, t, n, r, c) {
    e.uniformMatrix4x3fv(t, n !== 0, h(r, c));
  }, __wbg_unmap_d610a495d70ebb5e: function(e) {
    e.unmap();
  }, __wbg_usage_92ae9f7605bb82c1: function(e) {
    return e.usage;
  }, __wbg_useProgram_49b77c7558a0646a: function(e, t) {
    e.useProgram(t);
  }, __wbg_useProgram_5405b431988b837b: function(e, t) {
    e.useProgram(t);
  }, __wbg_valueOf_5c6da6c9a85f34dc: function(e) {
    return e.valueOf();
  }, __wbg_vertexAttribDivisorANGLE_b357aa2bf70d3dcf: function(e, t, n) {
    e.vertexAttribDivisorANGLE(t >>> 0, n >>> 0);
  }, __wbg_vertexAttribDivisor_99b2fd5affca539d: function(e, t, n) {
    e.vertexAttribDivisor(t >>> 0, n >>> 0);
  }, __wbg_vertexAttribIPointer_ecd3baef73ba0965: function(e, t, n, r, c, o) {
    e.vertexAttribIPointer(t >>> 0, n, r >>> 0, c, o);
  }, __wbg_vertexAttribPointer_ea73fc4cc5b7d647: function(e, t, n, r, c, o, i) {
    e.vertexAttribPointer(t >>> 0, n, r >>> 0, c !== 0, o, i);
  }, __wbg_vertexAttribPointer_f63675d7fad431e6: function(e, t, n, r, c, o, i) {
    e.vertexAttribPointer(t >>> 0, n, r >>> 0, c !== 0, o, i);
  }, __wbg_videoHeight_6dac1fd954779498: function(e) {
    return e.videoHeight;
  }, __wbg_videoWidth_48f094fdc1b5ba64: function(e) {
    return e.videoWidth;
  }, __wbg_viewport_63ee76a0f029804d: function(e, t, n, r, c) {
    e.viewport(t, n, r, c);
  }, __wbg_viewport_b60aceadb9166023: function(e, t, n, r, c) {
    e.viewport(t, n, r, c);
  }, __wbg_warn_69424c2d92a2fa73: function(e) {
    console.warn(e);
  }, __wbg_wasmrenderer_new: function(e) {
    return q.__wrap(e);
  }, __wbg_width_462295a1353ea71b: function(e) {
    return e.width;
  }, __wbg_width_4d6fc7fecd877217: function(e) {
    return e.width;
  }, __wbg_width_6a767700990b90f4: function(e) {
    return e.width;
  }, __wbg_width_71d9d44b5e14c4b7: function(e) {
    return e.width;
  }, __wbg_width_e0981c16dad36a72: function(e) {
    return e.width;
  }, __wbg_writeBuffer_28f398e6955ad305: function(e, t, n, r, c, o) {
    e.writeBuffer(t, n, r, c, o);
  }, __wbg_writeTexture_4eafae0e29b3eac0: function(e, t, n, r, c) {
    e.writeTexture(t, n, r, c);
  }, __wbindgen_cast_0000000000000001: function(e, t) {
    return H(e, t, _.wasm_bindgen__closure__destroy__h200b07e2cd2d62ec, ie);
  }, __wbindgen_cast_0000000000000002: function(e, t) {
    return H(e, t, _.wasm_bindgen__closure__destroy__h2d6fab434757b308, oe);
  }, __wbindgen_cast_0000000000000003: function(e, t) {
    return H(e, t, _.wasm_bindgen__closure__destroy__h2d6fab434757b308, ae);
  }, __wbindgen_cast_0000000000000004: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000005: function(e, t) {
    return h(e, t);
  }, __wbindgen_cast_0000000000000006: function(e, t) {
    return de(e, t);
  }, __wbindgen_cast_0000000000000007: function(e, t) {
    return D(e, t);
  }, __wbindgen_cast_0000000000000008: function(e, t) {
    return we(e, t);
  }, __wbindgen_cast_0000000000000009: function(e, t) {
    return me(e, t);
  }, __wbindgen_cast_000000000000000a: function(e, t) {
    return B(e, t);
  }, __wbindgen_cast_000000000000000b: function(e, t) {
    return E(e, t);
  }, __wbindgen_cast_000000000000000c: function(e, t) {
    return m(e, t);
  }, __wbindgen_init_externref_table: function() {
    const e = _.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
  } } };
}
function oe(a, e, t) {
  _.wasm_bindgen__convert__closures_____invoke__h6e626c1e6a6f2548(a, e, t);
}
function ae(a, e, t) {
  _.wasm_bindgen__convert__closures_____invoke__h6e626c1e6a6f2548_2(a, e, t);
}
function ie(a, e, t) {
  const n = _.wasm_bindgen__convert__closures_____invoke__hbd2a77e27682db99(a, e, t);
  if (n[1]) throw S(n[0]);
}
function fe(a, e, t, n) {
  _.wasm_bindgen__convert__closures_____invoke__h5b9b797b0cec42ed(a, e, t, n);
}
const be = ["error", "warning", "info"], se = ["unknown", "destroyed"], ue = ["validation", "out-of-memory", "internal"], Q = ["uint16", "uint32"], ge = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"], Z = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => _.__wbg_cellrefinfo_free(a >>> 0, 1)), K = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => _.__wbg_elementinfo_free(a >>> 0, 1)), $ = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => _.__wbg_wasmlibrary_free(a >>> 0, 1)), ee = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => _.__wbg_wasmrenderer_free(a >>> 0, 1));
function d(a) {
  const e = _.__externref_table_alloc();
  return _.__wbindgen_externrefs.set(e, a), e;
}
function le(a, e) {
  if (!(a instanceof e)) throw new Error(`expected instance of ${e.name}`);
}
const te = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((a) => a.dtor(a.a, a.b));
function Y(a) {
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
    r > 0 && (c += Y(a[0]));
    for (let o = 1; o < r; o++) c += ", " + Y(a[o]);
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
function de(a, e) {
  return a = a >>> 0, pe().subarray(a / 2, a / 2 + e);
}
function D(a, e) {
  return a = a >>> 0, ye().subarray(a / 4, a / 4 + e);
}
function we(a, e) {
  return a = a >>> 0, he().subarray(a / 1, a / 1 + e);
}
function I(a, e) {
  a = a >>> 0;
  const t = p(), n = [];
  for (let r = a; r < a + 4 * e; r += 4) n.push(_.__wbindgen_externrefs.get(t.getUint32(r, true)));
  return _.__externref_drop_slice(a, e), n;
}
function me(a, e) {
  return a = a >>> 0, xe().subarray(a / 2, a / 2 + e);
}
function B(a, e) {
  return a = a >>> 0, ve().subarray(a / 4, a / 4 + e);
}
function E(a, e) {
  return a = a >>> 0, M().subarray(a / 1, a / 1 + e);
}
let T = null;
function p() {
  return (T === null || T.buffer.detached === true || T.buffer.detached === void 0 && T.buffer !== _.memory.buffer) && (T = new DataView(_.memory.buffer)), T;
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
function pe() {
  return (L === null || L.byteLength === 0) && (L = new Int16Array(_.memory.buffer)), L;
}
let C = null;
function ye() {
  return (C === null || C.byteLength === 0) && (C = new Int32Array(_.memory.buffer)), C;
}
let W = null;
function he() {
  return (W === null || W.byteLength === 0) && (W = new Int8Array(_.memory.buffer)), W;
}
function m(a, e) {
  return a = a >>> 0, Ae(a, e);
}
let O = null;
function xe() {
  return (O === null || O.byteLength === 0) && (O = new Uint16Array(_.memory.buffer)), O;
}
let G = null;
function ve() {
  return (G === null || G.byteLength === 0) && (G = new Uint32Array(_.memory.buffer)), G;
}
let V = null;
function M() {
  return (V === null || V.byteLength === 0) && (V = new Uint8Array(_.memory.buffer)), V;
}
function w(a, e) {
  try {
    return a.apply(this, e);
  } catch (t) {
    const n = d(t);
    _.__wbindgen_exn_store(n);
  }
}
function l(a) {
  return a == null;
}
function H(a, e, t, n) {
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
    --r.cnt === 0 && (r.dtor(r.a, r.b), r.a = 0, te.unregister(r));
  }, te.register(c, r, r), c;
}
function Se(a, e) {
  const t = e(a.length * 1, 1) >>> 0;
  return M().set(a, t / 1), f = a.length, t;
}
function X(a, e) {
  const t = e(a.length * 4, 4) >>> 0;
  return re().set(a, t / 4), f = a.length, t;
}
function A(a, e) {
  const t = e(a.length * 8, 8) >>> 0;
  return _e().set(a, t / 8), f = a.length, t;
}
function F(a, e) {
  const t = e(a.length * 4, 4) >>> 0;
  for (let n = 0; n < a.length; n++) {
    const r = d(a[n]);
    p().setUint32(t + 4 * n, r, true);
  }
  return f = a.length, t;
}
function g(a, e, t) {
  if (t === void 0) {
    const i = U.encode(a), b = e(i.length, 1) >>> 0;
    return M().subarray(b, b + i.length).set(i), f = i.length, b;
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
    const i = M().subarray(r + o, r + n), b = U.encodeInto(a, i);
    o += b.written, r = t(r, n, o, 1) >>> 0;
  }
  return f = o, r;
}
function S(a) {
  const e = _.__wbindgen_externrefs.get(a);
  return _.__externref_table_dealloc(a), e;
}
let N = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
N.decode();
const Ie = 2146435072;
let J = 0;
function Ae(a, e) {
  return J += e, J >= Ie && (N = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), N.decode(), J = e), N.decode(M().subarray(a, a + e));
}
const U = new TextEncoder();
"encodeInto" in U || (U.encodeInto = function(a, e) {
  const t = U.encode(a);
  return e.set(t), { read: a.length, written: t.length };
});
let f = 0, _;
function ce(a, e) {
  return _ = a.exports, T = null, R = null, k = null, L = null, C = null, W = null, O = null, G = null, V = null, _.__wbindgen_start(), _;
}
async function Be(a, e) {
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
function Pe(a) {
  if (_ !== void 0) return _;
  a !== void 0 && (Object.getPrototypeOf(a) === Object.prototype ? { module: a } = a : console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));
  const e = ne();
  a instanceof WebAssembly.Module || (a = new WebAssembly.Module(a));
  const t = new WebAssembly.Instance(a, e);
  return ce(t);
}
async function Te(a) {
  if (_ !== void 0) return _;
  a !== void 0 && (Object.getPrototypeOf(a) === Object.prototype ? { module_or_path: a } = a : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), a === void 0 && (a = new URL("" + new URL("rosette_wasm_bg-9zWs4xFv.wasm", import.meta.url).href, import.meta.url));
  const e = ne();
  (typeof a == "string" || typeof Request == "function" && a instanceof Request || typeof URL == "function" && a instanceof URL) && (a = fetch(a));
  const { instance: t, module: n } = await Be(await a, e);
  return ce(t);
}
export {
  j as CellRefInfo,
  z as ElementInfo,
  P as WasmLibrary,
  q as WasmRenderer,
  Te as default,
  De as init,
  Pe as initSync
};
