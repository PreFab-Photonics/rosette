import { Resource as t, Channel as r, invoke as a } from "./core-DxBnVPgq.js";
class l extends t {
  constructor(e) {
    super(e.rid), this.available = true, this.currentVersion = e.currentVersion, this.version = e.version, this.date = e.date, this.body = e.body, this.rawJson = e.rawJson;
  }
  async download(e, d) {
    i(d);
    const s = new r();
    e && (s.onmessage = e);
    const o = await a("plugin:updater|download", { onEvent: s, rid: this.rid, ...d });
    this.downloadedBytes = new t(o);
  }
  async install() {
    if (!this.downloadedBytes) throw new Error("Update.install called before Update.download");
    await a("plugin:updater|install", { updateRid: this.rid, bytesRid: this.downloadedBytes.rid }), this.downloadedBytes = void 0;
  }
  async downloadAndInstall(e, d) {
    i(d);
    const s = new r();
    e && (s.onmessage = e), await a("plugin:updater|download_and_install", { onEvent: s, rid: this.rid, ...d });
  }
  async close() {
    var _a;
    await ((_a = this.downloadedBytes) == null ? void 0 : _a.close()), await super.close();
  }
}
async function w(n) {
  i(n);
  const e = await a("plugin:updater|check", { ...n });
  return e ? new l(e) : null;
}
function i(n) {
  (n == null ? void 0 : n.headers) && (n.headers = Array.from(new Headers(n.headers).entries()));
}
export {
  l as Update,
  w as check
};
