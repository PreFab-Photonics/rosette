// Resolve the theme before first paint to avoid a flash of the wrong theme
// while the application bundle loads (notably in Firefox).
//
// Mirrors the logic in src/stores/ui.ts: read the persisted "themeSetting"
// from the "rosette-ui" zustand store, falling back to the system preference.
//
// Loaded as a blocking script in index.html's <head> so it executes before
// the document is painted.
(function () {
  var setting = "system";

  try {
    var raw = localStorage.getItem("rosette-ui");
    if (raw) {
      var parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.state &&
        (parsed.state.themeSetting === "light" ||
          parsed.state.themeSetting === "dark" ||
          parsed.state.themeSetting === "system")
      ) {
        setting = parsed.state.themeSetting;
      }
    }
  } catch (_) {
    // Storage can be unavailable; system preference remains the fallback.
  }

  var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  var theme = setting === "system" ? systemTheme : setting;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
