import { SERIALIZE_TO_IPC_FN as o, Resource as B, invoke as t } from "./core-mPlcS5K-.js";
import { listen as z, once as D, emit as S, emitTo as C, TauriEvent as r } from "./event-DRyjiKX_.js";
class R {
  constructor(...e) {
    this.type = "Logical", e.length === 1 ? "Logical" in e[0] ? (this.width = e[0].Logical.width, this.height = e[0].Logical.height) : (this.width = e[0].width, this.height = e[0].height) : (this.width = e[0], this.height = e[1]);
  }
  toPhysical(e) {
    return new h(this.width * e, this.height * e);
  }
  [o]() {
    return { width: this.width, height: this.height };
  }
  toJSON() {
    return this[o]();
  }
}
class h {
  constructor(...e) {
    this.type = "Physical", e.length === 1 ? "Physical" in e[0] ? (this.width = e[0].Physical.width, this.height = e[0].Physical.height) : (this.width = e[0].width, this.height = e[0].height) : (this.width = e[0], this.height = e[1]);
  }
  toLogical(e) {
    return new R(this.width / e, this.height / e);
  }
  [o]() {
    return { width: this.width, height: this.height };
  }
  toJSON() {
    return this[o]();
  }
}
class c {
  constructor(e) {
    this.size = e;
  }
  toLogical(e) {
    return this.size instanceof R ? this.size : this.size.toLogical(e);
  }
  toPhysical(e) {
    return this.size instanceof h ? this.size : this.size.toPhysical(e);
  }
  [o]() {
    return { [`${this.size.type}`]: { width: this.size.width, height: this.size.height } };
  }
  toJSON() {
    return this[o]();
  }
}
class E {
  constructor(...e) {
    this.type = "Logical", e.length === 1 ? "Logical" in e[0] ? (this.x = e[0].Logical.x, this.y = e[0].Logical.y) : (this.x = e[0].x, this.y = e[0].y) : (this.x = e[0], this.y = e[1]);
  }
  toPhysical(e) {
    return new u(this.x * e, this.y * e);
  }
  [o]() {
    return { x: this.x, y: this.y };
  }
  toJSON() {
    return this[o]();
  }
}
class u {
  constructor(...e) {
    this.type = "Physical", e.length === 1 ? "Physical" in e[0] ? (this.x = e[0].Physical.x, this.y = e[0].Physical.y) : (this.x = e[0].x, this.y = e[0].y) : (this.x = e[0], this.y = e[1]);
  }
  toLogical(e) {
    return new E(this.x / e, this.y / e);
  }
  [o]() {
    return { x: this.x, y: this.y };
  }
  toJSON() {
    return this[o]();
  }
}
class w {
  constructor(e) {
    this.position = e;
  }
  toLogical(e) {
    return this.position instanceof E ? this.position : this.position.toLogical(e);
  }
  toPhysical(e) {
    return this.position instanceof u ? this.position : this.position.toPhysical(e);
  }
  [o]() {
    return { [`${this.position.type}`]: { x: this.position.x, y: this.position.y } };
  }
  toJSON() {
    return this[o]();
  }
}
class b extends B {
  constructor(e) {
    super(e);
  }
  static async new(e, i, l) {
    return t("plugin:image|new", { rgba: p(e), width: i, height: l }).then((s) => new b(s));
  }
  static async fromBytes(e) {
    return t("plugin:image|from_bytes", { bytes: p(e) }).then((i) => new b(i));
  }
  static async fromPath(e) {
    return t("plugin:image|from_path", { path: e }).then((i) => new b(i));
  }
  async rgba() {
    return t("plugin:image|rgba", { rid: this.rid }).then((e) => new Uint8Array(e));
  }
  async size() {
    return t("plugin:image|size", { rid: this.rid });
  }
}
function p(n) {
  return n == null ? null : typeof n == "string" ? n : n instanceof b ? n.rid : n;
}
var f;
(function(n) {
  n[n.Critical = 1] = "Critical", n[n.Informational = 2] = "Informational";
})(f || (f = {}));
class M {
  constructor(e) {
    this._preventDefault = false, this.event = e.event, this.id = e.id;
  }
  preventDefault() {
    this._preventDefault = true;
  }
  isPreventDefault() {
    return this._preventDefault;
  }
}
var O;
(function(n) {
  n.None = "none", n.Normal = "normal", n.Indeterminate = "indeterminate", n.Paused = "paused", n.Error = "error";
})(O || (O = {}));
function I() {
  return new y(window.__TAURI_INTERNALS__.metadata.currentWindow.label, { skip: true });
}
async function _() {
  return t("plugin:window|get_all_windows").then((n) => n.map((e) => new y(e, { skip: true })));
}
const v = ["tauri://created", "tauri://error"];
class y {
  constructor(e, i = {}) {
    var l;
    this.label = e, this.listeners = /* @__PURE__ */ Object.create(null), (i == null ? void 0 : i.skip) || t("plugin:window|create", { options: { ...i, parent: typeof i.parent == "string" ? i.parent : (l = i.parent) === null || l === void 0 ? void 0 : l.label, label: e } }).then(async () => this.emit("tauri://created")).catch(async (s) => this.emit("tauri://error", s));
  }
  static async getByLabel(e) {
    var i;
    return (i = (await _()).find((l) => l.label === e)) !== null && i !== void 0 ? i : null;
  }
  static getCurrent() {
    return I();
  }
  static async getAll() {
    return _();
  }
  static async getFocusedWindow() {
    for (const e of await _()) if (await e.isFocused()) return e;
    return null;
  }
  async listen(e, i) {
    return this._handleTauriEvent(e, i) ? () => {
      const l = this.listeners[e];
      l.splice(l.indexOf(i), 1);
    } : z(e, i, { target: { kind: "Window", label: this.label } });
  }
  async once(e, i) {
    return this._handleTauriEvent(e, i) ? () => {
      const l = this.listeners[e];
      l.splice(l.indexOf(i), 1);
    } : D(e, i, { target: { kind: "Window", label: this.label } });
  }
  async emit(e, i) {
    if (v.includes(e)) {
      for (const l of this.listeners[e] || []) l({ event: e, id: -1, payload: i });
      return;
    }
    return S(e, i);
  }
  async emitTo(e, i, l) {
    if (v.includes(i)) {
      for (const s of this.listeners[i] || []) s({ event: i, id: -1, payload: l });
      return;
    }
    return C(e, i, l);
  }
  _handleTauriEvent(e, i) {
    return v.includes(e) ? (e in this.listeners ? this.listeners[e].push(i) : this.listeners[e] = [i], true) : false;
  }
  async scaleFactor() {
    return t("plugin:window|scale_factor", { label: this.label });
  }
  async innerPosition() {
    return t("plugin:window|inner_position", { label: this.label }).then((e) => new u(e));
  }
  async outerPosition() {
    return t("plugin:window|outer_position", { label: this.label }).then((e) => new u(e));
  }
  async innerSize() {
    return t("plugin:window|inner_size", { label: this.label }).then((e) => new h(e));
  }
  async outerSize() {
    return t("plugin:window|outer_size", { label: this.label }).then((e) => new h(e));
  }
  async isFullscreen() {
    return t("plugin:window|is_fullscreen", { label: this.label });
  }
  async isMinimized() {
    return t("plugin:window|is_minimized", { label: this.label });
  }
  async isMaximized() {
    return t("plugin:window|is_maximized", { label: this.label });
  }
  async isFocused() {
    return t("plugin:window|is_focused", { label: this.label });
  }
  async isDecorated() {
    return t("plugin:window|is_decorated", { label: this.label });
  }
  async isResizable() {
    return t("plugin:window|is_resizable", { label: this.label });
  }
  async isMaximizable() {
    return t("plugin:window|is_maximizable", { label: this.label });
  }
  async isMinimizable() {
    return t("plugin:window|is_minimizable", { label: this.label });
  }
  async isClosable() {
    return t("plugin:window|is_closable", { label: this.label });
  }
  async isVisible() {
    return t("plugin:window|is_visible", { label: this.label });
  }
  async title() {
    return t("plugin:window|title", { label: this.label });
  }
  async theme() {
    return t("plugin:window|theme", { label: this.label });
  }
  async isAlwaysOnTop() {
    return t("plugin:window|is_always_on_top", { label: this.label });
  }
  async center() {
    return t("plugin:window|center", { label: this.label });
  }
  async requestUserAttention(e) {
    let i = null;
    return e && (e === f.Critical ? i = { type: "Critical" } : i = { type: "Informational" }), t("plugin:window|request_user_attention", { label: this.label, value: i });
  }
  async setResizable(e) {
    return t("plugin:window|set_resizable", { label: this.label, value: e });
  }
  async setEnabled(e) {
    return t("plugin:window|set_enabled", { label: this.label, value: e });
  }
  async isEnabled() {
    return t("plugin:window|is_enabled", { label: this.label });
  }
  async setMaximizable(e) {
    return t("plugin:window|set_maximizable", { label: this.label, value: e });
  }
  async setMinimizable(e) {
    return t("plugin:window|set_minimizable", { label: this.label, value: e });
  }
  async setClosable(e) {
    return t("plugin:window|set_closable", { label: this.label, value: e });
  }
  async setTitle(e) {
    return t("plugin:window|set_title", { label: this.label, value: e });
  }
  async maximize() {
    return t("plugin:window|maximize", { label: this.label });
  }
  async unmaximize() {
    return t("plugin:window|unmaximize", { label: this.label });
  }
  async toggleMaximize() {
    return t("plugin:window|toggle_maximize", { label: this.label });
  }
  async minimize() {
    return t("plugin:window|minimize", { label: this.label });
  }
  async unminimize() {
    return t("plugin:window|unminimize", { label: this.label });
  }
  async show() {
    return t("plugin:window|show", { label: this.label });
  }
  async hide() {
    return t("plugin:window|hide", { label: this.label });
  }
  async close() {
    return t("plugin:window|close", { label: this.label });
  }
  async destroy() {
    return t("plugin:window|destroy", { label: this.label });
  }
  async setDecorations(e) {
    return t("plugin:window|set_decorations", { label: this.label, value: e });
  }
  async setShadow(e) {
    return t("plugin:window|set_shadow", { label: this.label, value: e });
  }
  async setEffects(e) {
    return t("plugin:window|set_effects", { label: this.label, value: e });
  }
  async clearEffects() {
    return t("plugin:window|set_effects", { label: this.label, value: null });
  }
  async setAlwaysOnTop(e) {
    return t("plugin:window|set_always_on_top", { label: this.label, value: e });
  }
  async setAlwaysOnBottom(e) {
    return t("plugin:window|set_always_on_bottom", { label: this.label, value: e });
  }
  async setContentProtected(e) {
    return t("plugin:window|set_content_protected", { label: this.label, value: e });
  }
  async setSize(e) {
    return t("plugin:window|set_size", { label: this.label, value: e instanceof c ? e : new c(e) });
  }
  async setMinSize(e) {
    return t("plugin:window|set_min_size", { label: this.label, value: e instanceof c ? e : e ? new c(e) : null });
  }
  async setMaxSize(e) {
    return t("plugin:window|set_max_size", { label: this.label, value: e instanceof c ? e : e ? new c(e) : null });
  }
  async setSizeConstraints(e) {
    function i(l) {
      return l ? { Logical: l } : null;
    }
    return t("plugin:window|set_size_constraints", { label: this.label, value: { minWidth: i(e == null ? void 0 : e.minWidth), minHeight: i(e == null ? void 0 : e.minHeight), maxWidth: i(e == null ? void 0 : e.maxWidth), maxHeight: i(e == null ? void 0 : e.maxHeight) } });
  }
  async setPosition(e) {
    return t("plugin:window|set_position", { label: this.label, value: e instanceof w ? e : new w(e) });
  }
  async setFullscreen(e) {
    return t("plugin:window|set_fullscreen", { label: this.label, value: e });
  }
  async setSimpleFullscreen(e) {
    return t("plugin:window|set_simple_fullscreen", { label: this.label, value: e });
  }
  async setFocus() {
    return t("plugin:window|set_focus", { label: this.label });
  }
  async setFocusable(e) {
    return t("plugin:window|set_focusable", { label: this.label, value: e });
  }
  async setIcon(e) {
    return t("plugin:window|set_icon", { label: this.label, value: p(e) });
  }
  async setSkipTaskbar(e) {
    return t("plugin:window|set_skip_taskbar", { label: this.label, value: e });
  }
  async setCursorGrab(e) {
    return t("plugin:window|set_cursor_grab", { label: this.label, value: e });
  }
  async setCursorVisible(e) {
    return t("plugin:window|set_cursor_visible", { label: this.label, value: e });
  }
  async setCursorIcon(e) {
    return t("plugin:window|set_cursor_icon", { label: this.label, value: e });
  }
  async setBackgroundColor(e) {
    return t("plugin:window|set_background_color", { color: e });
  }
  async setCursorPosition(e) {
    return t("plugin:window|set_cursor_position", { label: this.label, value: e instanceof w ? e : new w(e) });
  }
  async setIgnoreCursorEvents(e) {
    return t("plugin:window|set_ignore_cursor_events", { label: this.label, value: e });
  }
  async startDragging() {
    return t("plugin:window|start_dragging", { label: this.label });
  }
  async startResizeDragging(e) {
    return t("plugin:window|start_resize_dragging", { label: this.label, value: e });
  }
  async setBadgeCount(e) {
    return t("plugin:window|set_badge_count", { label: this.label, value: e });
  }
  async setBadgeLabel(e) {
    return t("plugin:window|set_badge_label", { label: this.label, value: e });
  }
  async setOverlayIcon(e) {
    return t("plugin:window|set_overlay_icon", { label: this.label, value: e ? p(e) : void 0 });
  }
  async setProgressBar(e) {
    return t("plugin:window|set_progress_bar", { label: this.label, value: e });
  }
  async setVisibleOnAllWorkspaces(e) {
    return t("plugin:window|set_visible_on_all_workspaces", { label: this.label, value: e });
  }
  async setTitleBarStyle(e) {
    return t("plugin:window|set_title_bar_style", { label: this.label, value: e });
  }
  async setTheme(e) {
    return t("plugin:window|set_theme", { label: this.label, value: e });
  }
  async onResized(e) {
    return this.listen(r.WINDOW_RESIZED, (i) => {
      i.payload = new h(i.payload), e(i);
    });
  }
  async onMoved(e) {
    return this.listen(r.WINDOW_MOVED, (i) => {
      i.payload = new u(i.payload), e(i);
    });
  }
  async onCloseRequested(e) {
    return this.listen(r.WINDOW_CLOSE_REQUESTED, async (i) => {
      const l = new M(i);
      await e(l), l.isPreventDefault() || await this.destroy();
    });
  }
  async onDragDropEvent(e) {
    const i = await this.listen(r.DRAG_ENTER, (a) => {
      e({ ...a, payload: { type: "enter", paths: a.payload.paths, position: new u(a.payload.position) } });
    }), l = await this.listen(r.DRAG_OVER, (a) => {
      e({ ...a, payload: { type: "over", position: new u(a.payload.position) } });
    }), s = await this.listen(r.DRAG_DROP, (a) => {
      e({ ...a, payload: { type: "drop", paths: a.payload.paths, position: new u(a.payload.position) } });
    }), g = await this.listen(r.DRAG_LEAVE, (a) => {
      e({ ...a, payload: { type: "leave" } });
    });
    return () => {
      i(), s(), l(), g();
    };
  }
  async onFocusChanged(e) {
    const i = await this.listen(r.WINDOW_FOCUS, (s) => {
      e({ ...s, payload: true });
    }), l = await this.listen(r.WINDOW_BLUR, (s) => {
      e({ ...s, payload: false });
    });
    return () => {
      i(), l();
    };
  }
  async onScaleChanged(e) {
    return this.listen(r.WINDOW_SCALE_FACTOR_CHANGED, e);
  }
  async onThemeChanged(e) {
    return this.listen(r.WINDOW_THEME_CHANGED, e);
  }
}
var k;
(function(n) {
  n.Disabled = "disabled", n.Throttle = "throttle", n.Suspend = "suspend";
})(k || (k = {}));
var x;
(function(n) {
  n.Default = "default", n.FluentOverlay = "fluentOverlay";
})(x || (x = {}));
var A;
(function(n) {
  n.AppearanceBased = "appearanceBased", n.Light = "light", n.Dark = "dark", n.MediumLight = "mediumLight", n.UltraDark = "ultraDark", n.Titlebar = "titlebar", n.Selection = "selection", n.Menu = "menu", n.Popover = "popover", n.Sidebar = "sidebar", n.HeaderView = "headerView", n.Sheet = "sheet", n.WindowBackground = "windowBackground", n.HudWindow = "hudWindow", n.FullScreenUI = "fullScreenUI", n.Tooltip = "tooltip", n.ContentBackground = "contentBackground", n.UnderWindowBackground = "underWindowBackground", n.UnderPageBackground = "underPageBackground", n.Mica = "mica", n.Blur = "blur", n.Acrylic = "acrylic", n.Tabbed = "tabbed", n.TabbedDark = "tabbedDark", n.TabbedLight = "tabbedLight";
})(A || (A = {}));
var L;
(function(n) {
  n.FollowsWindowActiveState = "followsWindowActiveState", n.Active = "active", n.Inactive = "inactive";
})(L || (L = {}));
function N() {
  return new W(I(), window.__TAURI_INTERNALS__.metadata.currentWebview.label, { skip: true });
}
async function P() {
  return t("plugin:webview|get_all_webviews").then((n) => n.map((e) => new W(new y(e.windowLabel, { skip: true }), e.label, { skip: true })));
}
const m = ["tauri://created", "tauri://error"];
class W {
  constructor(e, i, l) {
    this.window = e, this.label = i, this.listeners = /* @__PURE__ */ Object.create(null), (l == null ? void 0 : l.skip) || t("plugin:webview|create_webview", { windowLabel: e.label, options: { ...l, label: i } }).then(async () => this.emit("tauri://created")).catch(async (s) => this.emit("tauri://error", s));
  }
  static async getByLabel(e) {
    var i;
    return (i = (await P()).find((l) => l.label === e)) !== null && i !== void 0 ? i : null;
  }
  static getCurrent() {
    return N();
  }
  static async getAll() {
    return P();
  }
  async listen(e, i) {
    return this._handleTauriEvent(e, i) ? () => {
      const l = this.listeners[e];
      l.splice(l.indexOf(i), 1);
    } : z(e, i, { target: { kind: "Webview", label: this.label } });
  }
  async once(e, i) {
    return this._handleTauriEvent(e, i) ? () => {
      const l = this.listeners[e];
      l.splice(l.indexOf(i), 1);
    } : D(e, i, { target: { kind: "Webview", label: this.label } });
  }
  async emit(e, i) {
    if (m.includes(e)) {
      for (const l of this.listeners[e] || []) l({ event: e, id: -1, payload: i });
      return;
    }
    return S(e, i);
  }
  async emitTo(e, i, l) {
    if (m.includes(i)) {
      for (const s of this.listeners[i] || []) s({ event: i, id: -1, payload: l });
      return;
    }
    return C(e, i, l);
  }
  _handleTauriEvent(e, i) {
    return m.includes(e) ? (e in this.listeners ? this.listeners[e].push(i) : this.listeners[e] = [i], true) : false;
  }
  async position() {
    return t("plugin:webview|webview_position", { label: this.label }).then((e) => new u(e));
  }
  async size() {
    return t("plugin:webview|webview_size", { label: this.label }).then((e) => new h(e));
  }
  async close() {
    return t("plugin:webview|webview_close", { label: this.label });
  }
  async setSize(e) {
    return t("plugin:webview|set_webview_size", { label: this.label, value: e instanceof c ? e : new c(e) });
  }
  async setPosition(e) {
    return t("plugin:webview|set_webview_position", { label: this.label, value: e instanceof w ? e : new w(e) });
  }
  async setFocus() {
    return t("plugin:webview|set_webview_focus", { label: this.label });
  }
  async setAutoResize(e) {
    return t("plugin:webview|set_webview_auto_resize", { label: this.label, value: e });
  }
  async hide() {
    return t("plugin:webview|webview_hide", { label: this.label });
  }
  async show() {
    return t("plugin:webview|webview_show", { label: this.label });
  }
  async setZoom(e) {
    return t("plugin:webview|set_webview_zoom", { label: this.label, value: e });
  }
  async reparent(e) {
    return t("plugin:webview|reparent", { label: this.label, window: typeof e == "string" ? e : e.label });
  }
  async clearAllBrowsingData() {
    return t("plugin:webview|clear_all_browsing_data");
  }
  async setBackgroundColor(e) {
    return t("plugin:webview|set_webview_background_color", { color: e });
  }
  async onDragDropEvent(e) {
    const i = await this.listen(r.DRAG_ENTER, (a) => {
      e({ ...a, payload: { type: "enter", paths: a.payload.paths, position: new u(a.payload.position) } });
    }), l = await this.listen(r.DRAG_OVER, (a) => {
      e({ ...a, payload: { type: "over", position: new u(a.payload.position) } });
    }), s = await this.listen(r.DRAG_DROP, (a) => {
      e({ ...a, payload: { type: "drop", paths: a.payload.paths, position: new u(a.payload.position) } });
    }), g = await this.listen(r.DRAG_LEAVE, (a) => {
      e({ ...a, payload: { type: "leave" } });
    });
    return () => {
      i(), s(), l(), g();
    };
  }
}
function F() {
  const n = N();
  return new d(n.label, { skip: true });
}
async function T() {
  return t("plugin:window|get_all_windows").then((n) => n.map((e) => new d(e, { skip: true })));
}
class d {
  constructor(e, i = {}) {
    var l;
    this.label = e, this.listeners = /* @__PURE__ */ Object.create(null), (i == null ? void 0 : i.skip) || t("plugin:webview|create_webview_window", { options: { ...i, parent: typeof i.parent == "string" ? i.parent : (l = i.parent) === null || l === void 0 ? void 0 : l.label, label: e } }).then(async () => this.emit("tauri://created")).catch(async (s) => this.emit("tauri://error", s));
  }
  static async getByLabel(e) {
    var i;
    const l = (i = (await T()).find((s) => s.label === e)) !== null && i !== void 0 ? i : null;
    return l ? new d(l.label, { skip: true }) : null;
  }
  static getCurrent() {
    return F();
  }
  static async getAll() {
    return T();
  }
  async listen(e, i) {
    return this._handleTauriEvent(e, i) ? () => {
      const l = this.listeners[e];
      l.splice(l.indexOf(i), 1);
    } : z(e, i, { target: { kind: "WebviewWindow", label: this.label } });
  }
  async once(e, i) {
    return this._handleTauriEvent(e, i) ? () => {
      const l = this.listeners[e];
      l.splice(l.indexOf(i), 1);
    } : D(e, i, { target: { kind: "WebviewWindow", label: this.label } });
  }
  async setBackgroundColor(e) {
    return t("plugin:window|set_background_color", { color: e }).then(() => t("plugin:webview|set_webview_background_color", { color: e }));
  }
}
G(d, [y, W]);
function G(n, e) {
  (Array.isArray(e) ? e : [e]).forEach((i) => {
    Object.getOwnPropertyNames(i.prototype).forEach((l) => {
      var s;
      typeof n.prototype == "object" && n.prototype && l in n.prototype || Object.defineProperty(n.prototype, l, (s = Object.getOwnPropertyDescriptor(i.prototype, l)) !== null && s !== void 0 ? s : /* @__PURE__ */ Object.create(null));
    });
  });
}
export {
  d as WebviewWindow,
  T as getAllWebviewWindows,
  F as getCurrentWebviewWindow
};
