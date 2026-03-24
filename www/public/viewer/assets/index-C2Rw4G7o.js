import { invoke as a } from "./core-DxBnVPgq.js";
async function r(e = {}) {
  return typeof e == "object" && Object.freeze(e), await a("plugin:dialog|open", { options: e });
}
async function o(e = {}) {
  return typeof e == "object" && Object.freeze(e), await a("plugin:dialog|save", { options: e });
}
async function l(e, n) {
  var _a, _b, _c;
  const t = typeof n == "string" ? { title: n } : n;
  return await a("plugin:dialog|ask", { message: e.toString(), title: (_a = t == null ? void 0 : t.title) == null ? void 0 : _a.toString(), kind: t == null ? void 0 : t.kind, yesButtonLabel: (_b = t == null ? void 0 : t.okLabel) == null ? void 0 : _b.toString(), noButtonLabel: (_c = t == null ? void 0 : t.cancelLabel) == null ? void 0 : _c.toString() });
}
export {
  l as ask,
  r as open,
  o as save
};
