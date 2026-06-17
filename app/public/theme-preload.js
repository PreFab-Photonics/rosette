// Resolve the theme before first paint to avoid a flash of the wrong
// background while the JS bundle and index.css load (notably in Firefox).
//
// Mirrors the logic in src/stores/ui.ts: read the persisted "themeSetting"
// from the "rosette-ui" zustand store, falling back to the system preference.
// Keep the colors in sync with App.tsx (bg-black / bg-white).
//
// Loaded as a blocking script in index.html's <head> so it executes before
// the document is painted.
(function () {
  try {
    var setting = "system";
    var raw = localStorage.getItem("rosette-ui");
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.state && parsed.state.themeSetting) {
        setting = parsed.state.themeSetting;
      }
    }
    var dark =
      setting === "dark" ||
      (setting === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.style.backgroundColor = dark ? "#000000" : "#ffffff";
  } catch (e) {
    document.documentElement.style.backgroundColor = "#000000";
  }
})();
