const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-C2Rw4G7o.js","./core-DxBnVPgq.js","./event-BC8TvpKC.js","./index-DWHWQ1OU.js","./index-BQlnJ-sT.js","./webviewWindow-DoRoZnHQ.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(async () => {
  function Yw(l, n) {
    for (var r = 0; r < n.length; r++) {
      const o = n[r];
      if (typeof o != "string" && !Array.isArray(o)) {
        for (const s in o) if (s !== "default" && !(s in l)) {
          const c = Object.getOwnPropertyDescriptor(o, s);
          c && Object.defineProperty(l, s, c.get ? c : {
            enumerable: true,
            get: () => o[s]
          });
        }
      }
    }
    return Object.freeze(Object.defineProperty(l, Symbol.toStringTag, {
      value: "Module"
    }));
  }
  (function() {
    const n = document.createElement("link").relList;
    if (n && n.supports && n.supports("modulepreload")) return;
    for (const s of document.querySelectorAll('link[rel="modulepreload"]')) o(s);
    new MutationObserver((s) => {
      for (const c of s) if (c.type === "childList") for (const d of c.addedNodes) d.tagName === "LINK" && d.rel === "modulepreload" && o(d);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(s) {
      const c = {};
      return s.integrity && (c.integrity = s.integrity), s.referrerPolicy && (c.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? c.credentials = "include" : s.crossOrigin === "anonymous" ? c.credentials = "omit" : c.credentials = "same-origin", c;
    }
    function o(s) {
      if (s.ep) return;
      s.ep = true;
      const c = r(s);
      fetch(s.href, c);
    }
  })();
  function Uv(l) {
    return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
  }
  var Ed = {
    exports: {}
  }, Ao = {};
  var ey;
  function Bw() {
    if (ey) return Ao;
    ey = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
    function r(o, s, c) {
      var d = null;
      if (c !== void 0 && (d = "" + c), s.key !== void 0 && (d = "" + s.key), "key" in s) {
        c = {};
        for (var f in s) f !== "key" && (c[f] = s[f]);
      } else c = s;
      return s = c.ref, {
        $$typeof: l,
        type: o,
        key: d,
        ref: s !== void 0 ? s : null,
        props: c
      };
    }
    return Ao.Fragment = n, Ao.jsx = r, Ao.jsxs = r, Ao;
  }
  var ty;
  function Xw() {
    return ty || (ty = 1, Ed.exports = Bw()), Ed.exports;
  }
  var y = Xw(), _d = {
    exports: {}
  }, Ne = {};
  var ny;
  function Vw() {
    if (ny) return Ne;
    ny = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), s = Symbol.for("react.profiler"), c = Symbol.for("react.consumer"), d = Symbol.for("react.context"), f = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), b = Symbol.for("react.activity"), w = Symbol.iterator;
    function E(j) {
      return j === null || typeof j != "object" ? null : (j = w && j[w] || j["@@iterator"], typeof j == "function" ? j : null);
    }
    var k = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    }, S = Object.assign, C = {};
    function _(j, D, O) {
      this.props = j, this.context = D, this.refs = C, this.updater = O || k;
    }
    _.prototype.isReactComponent = {}, _.prototype.setState = function(j, D) {
      if (typeof j != "object" && typeof j != "function" && j != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, j, D, "setState");
    }, _.prototype.forceUpdate = function(j) {
      this.updater.enqueueForceUpdate(this, j, "forceUpdate");
    };
    function L() {
    }
    L.prototype = _.prototype;
    function R(j, D, O) {
      this.props = j, this.context = D, this.refs = C, this.updater = O || k;
    }
    var T = R.prototype = new L();
    T.constructor = R, S(T, _.prototype), T.isPureReactComponent = true;
    var B = Array.isArray;
    function N() {
    }
    var A = {
      H: null,
      A: null,
      T: null,
      S: null
    }, H = Object.prototype.hasOwnProperty;
    function z(j, D, O) {
      var Z = O.ref;
      return {
        $$typeof: l,
        type: j,
        key: D,
        ref: Z !== void 0 ? Z : null,
        props: O
      };
    }
    function P(j, D) {
      return z(j.type, D, j.props);
    }
    function ee(j) {
      return typeof j == "object" && j !== null && j.$$typeof === l;
    }
    function J(j) {
      var D = {
        "=": "=0",
        ":": "=2"
      };
      return "$" + j.replace(/[=:]/g, function(O) {
        return D[O];
      });
    }
    var ce = /\/+/g;
    function fe(j, D) {
      return typeof j == "object" && j !== null && j.key != null ? J("" + j.key) : D.toString(36);
    }
    function Se(j) {
      switch (j.status) {
        case "fulfilled":
          return j.value;
        case "rejected":
          throw j.reason;
        default:
          switch (typeof j.status == "string" ? j.then(N, N) : (j.status = "pending", j.then(function(D) {
            j.status === "pending" && (j.status = "fulfilled", j.value = D);
          }, function(D) {
            j.status === "pending" && (j.status = "rejected", j.reason = D);
          })), j.status) {
            case "fulfilled":
              return j.value;
            case "rejected":
              throw j.reason;
          }
      }
      throw j;
    }
    function $(j, D, O, Z, Q) {
      var oe = typeof j;
      (oe === "undefined" || oe === "boolean") && (j = null);
      var ue = false;
      if (j === null) ue = true;
      else switch (oe) {
        case "bigint":
        case "string":
        case "number":
          ue = true;
          break;
        case "object":
          switch (j.$$typeof) {
            case l:
            case n:
              ue = true;
              break;
            case v:
              return ue = j._init, $(ue(j._payload), D, O, Z, Q);
          }
      }
      if (ue) return Q = Q(j), ue = Z === "" ? "." + fe(j, 0) : Z, B(Q) ? (O = "", ue != null && (O = ue.replace(ce, "$&/") + "/"), $(Q, D, O, "", function(se) {
        return se;
      })) : Q != null && (ee(Q) && (Q = P(Q, O + (Q.key == null || j && j.key === Q.key ? "" : ("" + Q.key).replace(ce, "$&/") + "/") + ue)), D.push(Q)), 1;
      ue = 0;
      var _e = Z === "" ? "." : Z + ":";
      if (B(j)) for (var X = 0; X < j.length; X++) Z = j[X], oe = _e + fe(Z, X), ue += $(Z, D, O, oe, Q);
      else if (X = E(j), typeof X == "function") for (j = X.call(j), X = 0; !(Z = j.next()).done; ) Z = Z.value, oe = _e + fe(Z, X++), ue += $(Z, D, O, oe, Q);
      else if (oe === "object") {
        if (typeof j.then == "function") return $(Se(j), D, O, Z, Q);
        throw D = String(j), Error("Objects are not valid as a React child (found: " + (D === "[object Object]" ? "object with keys {" + Object.keys(j).join(", ") + "}" : D) + "). If you meant to render a collection of children, use an array instead.");
      }
      return ue;
    }
    function F(j, D, O) {
      if (j == null) return j;
      var Z = [], Q = 0;
      return $(j, Z, "", "", function(oe) {
        return D.call(O, oe, Q++);
      }), Z;
    }
    function ie(j) {
      if (j._status === -1) {
        var D = j._result;
        D = D(), D.then(function(O) {
          (j._status === 0 || j._status === -1) && (j._status = 1, j._result = O);
        }, function(O) {
          (j._status === 0 || j._status === -1) && (j._status = 2, j._result = O);
        }), j._status === -1 && (j._status = 0, j._result = D);
      }
      if (j._status === 1) return j._result.default;
      throw j._result;
    }
    var Ee = typeof reportError == "function" ? reportError : function(j) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var D = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: typeof j == "object" && j !== null && typeof j.message == "string" ? String(j.message) : String(j),
          error: j
        });
        if (!window.dispatchEvent(D)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", j);
        return;
      }
      console.error(j);
    }, pe = {
      map: F,
      forEach: function(j, D, O) {
        F(j, function() {
          D.apply(this, arguments);
        }, O);
      },
      count: function(j) {
        var D = 0;
        return F(j, function() {
          D++;
        }), D;
      },
      toArray: function(j) {
        return F(j, function(D) {
          return D;
        }) || [];
      },
      only: function(j) {
        if (!ee(j)) throw Error("React.Children.only expected to receive a single React element child.");
        return j;
      }
    };
    return Ne.Activity = b, Ne.Children = pe, Ne.Component = _, Ne.Fragment = r, Ne.Profiler = s, Ne.PureComponent = R, Ne.StrictMode = o, Ne.Suspense = m, Ne.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = A, Ne.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(j) {
        return A.H.useMemoCache(j);
      }
    }, Ne.cache = function(j) {
      return function() {
        return j.apply(null, arguments);
      };
    }, Ne.cacheSignal = function() {
      return null;
    }, Ne.cloneElement = function(j, D, O) {
      if (j == null) throw Error("The argument must be a React element, but you passed " + j + ".");
      var Z = S({}, j.props), Q = j.key;
      if (D != null) for (oe in D.key !== void 0 && (Q = "" + D.key), D) !H.call(D, oe) || oe === "key" || oe === "__self" || oe === "__source" || oe === "ref" && D.ref === void 0 || (Z[oe] = D[oe]);
      var oe = arguments.length - 2;
      if (oe === 1) Z.children = O;
      else if (1 < oe) {
        for (var ue = Array(oe), _e = 0; _e < oe; _e++) ue[_e] = arguments[_e + 2];
        Z.children = ue;
      }
      return z(j.type, Q, Z);
    }, Ne.createContext = function(j) {
      return j = {
        $$typeof: d,
        _currentValue: j,
        _currentValue2: j,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      }, j.Provider = j, j.Consumer = {
        $$typeof: c,
        _context: j
      }, j;
    }, Ne.createElement = function(j, D, O) {
      var Z, Q = {}, oe = null;
      if (D != null) for (Z in D.key !== void 0 && (oe = "" + D.key), D) H.call(D, Z) && Z !== "key" && Z !== "__self" && Z !== "__source" && (Q[Z] = D[Z]);
      var ue = arguments.length - 2;
      if (ue === 1) Q.children = O;
      else if (1 < ue) {
        for (var _e = Array(ue), X = 0; X < ue; X++) _e[X] = arguments[X + 2];
        Q.children = _e;
      }
      if (j && j.defaultProps) for (Z in ue = j.defaultProps, ue) Q[Z] === void 0 && (Q[Z] = ue[Z]);
      return z(j, oe, Q);
    }, Ne.createRef = function() {
      return {
        current: null
      };
    }, Ne.forwardRef = function(j) {
      return {
        $$typeof: f,
        render: j
      };
    }, Ne.isValidElement = ee, Ne.lazy = function(j) {
      return {
        $$typeof: v,
        _payload: {
          _status: -1,
          _result: j
        },
        _init: ie
      };
    }, Ne.memo = function(j, D) {
      return {
        $$typeof: p,
        type: j,
        compare: D === void 0 ? null : D
      };
    }, Ne.startTransition = function(j) {
      var D = A.T, O = {};
      A.T = O;
      try {
        var Z = j(), Q = A.S;
        Q !== null && Q(O, Z), typeof Z == "object" && Z !== null && typeof Z.then == "function" && Z.then(N, Ee);
      } catch (oe) {
        Ee(oe);
      } finally {
        D !== null && O.types !== null && (D.types = O.types), A.T = D;
      }
    }, Ne.unstable_useCacheRefresh = function() {
      return A.H.useCacheRefresh();
    }, Ne.use = function(j) {
      return A.H.use(j);
    }, Ne.useActionState = function(j, D, O) {
      return A.H.useActionState(j, D, O);
    }, Ne.useCallback = function(j, D) {
      return A.H.useCallback(j, D);
    }, Ne.useContext = function(j) {
      return A.H.useContext(j);
    }, Ne.useDebugValue = function() {
    }, Ne.useDeferredValue = function(j, D) {
      return A.H.useDeferredValue(j, D);
    }, Ne.useEffect = function(j, D) {
      return A.H.useEffect(j, D);
    }, Ne.useEffectEvent = function(j) {
      return A.H.useEffectEvent(j);
    }, Ne.useId = function() {
      return A.H.useId();
    }, Ne.useImperativeHandle = function(j, D, O) {
      return A.H.useImperativeHandle(j, D, O);
    }, Ne.useInsertionEffect = function(j, D) {
      return A.H.useInsertionEffect(j, D);
    }, Ne.useLayoutEffect = function(j, D) {
      return A.H.useLayoutEffect(j, D);
    }, Ne.useMemo = function(j, D) {
      return A.H.useMemo(j, D);
    }, Ne.useOptimistic = function(j, D) {
      return A.H.useOptimistic(j, D);
    }, Ne.useReducer = function(j, D, O) {
      return A.H.useReducer(j, D, O);
    }, Ne.useRef = function(j) {
      return A.H.useRef(j);
    }, Ne.useState = function(j) {
      return A.H.useState(j);
    }, Ne.useSyncExternalStore = function(j, D, O) {
      return A.H.useSyncExternalStore(j, D, O);
    }, Ne.useTransition = function() {
      return A.H.useTransition();
    }, Ne.version = "19.2.4", Ne;
  }
  var ly;
  function Qf() {
    return ly || (ly = 1, _d.exports = Vw()), _d.exports;
  }
  var g = Qf();
  const Oa = Uv(g), Ff = Yw({
    __proto__: null,
    default: Oa
  }, [
    g
  ]);
  var kd = {
    exports: {}
  }, To = {}, Md = {
    exports: {}
  }, jd = {};
  var ry;
  function $w() {
    return ry || (ry = 1, (function(l) {
      function n($, F) {
        var ie = $.length;
        $.push(F);
        e: for (; 0 < ie; ) {
          var Ee = ie - 1 >>> 1, pe = $[Ee];
          if (0 < s(pe, F)) $[Ee] = F, $[ie] = pe, ie = Ee;
          else break e;
        }
      }
      function r($) {
        return $.length === 0 ? null : $[0];
      }
      function o($) {
        if ($.length === 0) return null;
        var F = $[0], ie = $.pop();
        if (ie !== F) {
          $[0] = ie;
          e: for (var Ee = 0, pe = $.length, j = pe >>> 1; Ee < j; ) {
            var D = 2 * (Ee + 1) - 1, O = $[D], Z = D + 1, Q = $[Z];
            if (0 > s(O, ie)) Z < pe && 0 > s(Q, O) ? ($[Ee] = Q, $[Z] = ie, Ee = Z) : ($[Ee] = O, $[D] = ie, Ee = D);
            else if (Z < pe && 0 > s(Q, ie)) $[Ee] = Q, $[Z] = ie, Ee = Z;
            else break e;
          }
        }
        return F;
      }
      function s($, F) {
        var ie = $.sortIndex - F.sortIndex;
        return ie !== 0 ? ie : $.id - F.id;
      }
      if (l.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
        var c = performance;
        l.unstable_now = function() {
          return c.now();
        };
      } else {
        var d = Date, f = d.now();
        l.unstable_now = function() {
          return d.now() - f;
        };
      }
      var m = [], p = [], v = 1, b = null, w = 3, E = false, k = false, S = false, C = false, _ = typeof setTimeout == "function" ? setTimeout : null, L = typeof clearTimeout == "function" ? clearTimeout : null, R = typeof setImmediate < "u" ? setImmediate : null;
      function T($) {
        for (var F = r(p); F !== null; ) {
          if (F.callback === null) o(p);
          else if (F.startTime <= $) o(p), F.sortIndex = F.expirationTime, n(m, F);
          else break;
          F = r(p);
        }
      }
      function B($) {
        if (S = false, T($), !k) if (r(m) !== null) k = true, N || (N = true, J());
        else {
          var F = r(p);
          F !== null && Se(B, F.startTime - $);
        }
      }
      var N = false, A = -1, H = 5, z = -1;
      function P() {
        return C ? true : !(l.unstable_now() - z < H);
      }
      function ee() {
        if (C = false, N) {
          var $ = l.unstable_now();
          z = $;
          var F = true;
          try {
            e: {
              k = false, S && (S = false, L(A), A = -1), E = true;
              var ie = w;
              try {
                t: {
                  for (T($), b = r(m); b !== null && !(b.expirationTime > $ && P()); ) {
                    var Ee = b.callback;
                    if (typeof Ee == "function") {
                      b.callback = null, w = b.priorityLevel;
                      var pe = Ee(b.expirationTime <= $);
                      if ($ = l.unstable_now(), typeof pe == "function") {
                        b.callback = pe, T($), F = true;
                        break t;
                      }
                      b === r(m) && o(m), T($);
                    } else o(m);
                    b = r(m);
                  }
                  if (b !== null) F = true;
                  else {
                    var j = r(p);
                    j !== null && Se(B, j.startTime - $), F = false;
                  }
                }
                break e;
              } finally {
                b = null, w = ie, E = false;
              }
              F = void 0;
            }
          } finally {
            F ? J() : N = false;
          }
        }
      }
      var J;
      if (typeof R == "function") J = function() {
        R(ee);
      };
      else if (typeof MessageChannel < "u") {
        var ce = new MessageChannel(), fe = ce.port2;
        ce.port1.onmessage = ee, J = function() {
          fe.postMessage(null);
        };
      } else J = function() {
        _(ee, 0);
      };
      function Se($, F) {
        A = _(function() {
          $(l.unstable_now());
        }, F);
      }
      l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function($) {
        $.callback = null;
      }, l.unstable_forceFrameRate = function($) {
        0 > $ || 125 < $ ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : H = 0 < $ ? Math.floor(1e3 / $) : 5;
      }, l.unstable_getCurrentPriorityLevel = function() {
        return w;
      }, l.unstable_next = function($) {
        switch (w) {
          case 1:
          case 2:
          case 3:
            var F = 3;
            break;
          default:
            F = w;
        }
        var ie = w;
        w = F;
        try {
          return $();
        } finally {
          w = ie;
        }
      }, l.unstable_requestPaint = function() {
        C = true;
      }, l.unstable_runWithPriority = function($, F) {
        switch ($) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            $ = 3;
        }
        var ie = w;
        w = $;
        try {
          return F();
        } finally {
          w = ie;
        }
      }, l.unstable_scheduleCallback = function($, F, ie) {
        var Ee = l.unstable_now();
        switch (typeof ie == "object" && ie !== null ? (ie = ie.delay, ie = typeof ie == "number" && 0 < ie ? Ee + ie : Ee) : ie = Ee, $) {
          case 1:
            var pe = -1;
            break;
          case 2:
            pe = 250;
            break;
          case 5:
            pe = 1073741823;
            break;
          case 4:
            pe = 1e4;
            break;
          default:
            pe = 5e3;
        }
        return pe = ie + pe, $ = {
          id: v++,
          callback: F,
          priorityLevel: $,
          startTime: ie,
          expirationTime: pe,
          sortIndex: -1
        }, ie > Ee ? ($.sortIndex = ie, n(p, $), r(m) === null && $ === r(p) && (S ? (L(A), A = -1) : S = true, Se(B, ie - Ee))) : ($.sortIndex = pe, n(m, $), k || E || (k = true, N || (N = true, J()))), $;
      }, l.unstable_shouldYield = P, l.unstable_wrapCallback = function($) {
        var F = w;
        return function() {
          var ie = w;
          w = F;
          try {
            return $.apply(this, arguments);
          } finally {
            w = ie;
          }
        };
      };
    })(jd)), jd;
  }
  var ay;
  function qw() {
    return ay || (ay = 1, Md.exports = $w()), Md.exports;
  }
  var Ld = {
    exports: {}
  }, Zt = {};
  var oy;
  function Gw() {
    if (oy) return Zt;
    oy = 1;
    var l = Qf();
    function n(m) {
      var p = "https://react.dev/errors/" + m;
      if (1 < arguments.length) {
        p += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var v = 2; v < arguments.length; v++) p += "&args[]=" + encodeURIComponent(arguments[v]);
      }
      return "Minified React error #" + m + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function r() {
    }
    var o = {
      d: {
        f: r,
        r: function() {
          throw Error(n(522));
        },
        D: r,
        C: r,
        L: r,
        m: r,
        X: r,
        S: r,
        M: r
      },
      p: 0,
      findDOMNode: null
    }, s = Symbol.for("react.portal");
    function c(m, p, v) {
      var b = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: s,
        key: b == null ? null : "" + b,
        children: m,
        containerInfo: p,
        implementation: v
      };
    }
    var d = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function f(m, p) {
      if (m === "font") return "";
      if (typeof p == "string") return p === "use-credentials" ? p : "";
    }
    return Zt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Zt.createPortal = function(m, p) {
      var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11) throw Error(n(299));
      return c(m, p, null, v);
    }, Zt.flushSync = function(m) {
      var p = d.T, v = o.p;
      try {
        if (d.T = null, o.p = 2, m) return m();
      } finally {
        d.T = p, o.p = v, o.d.f();
      }
    }, Zt.preconnect = function(m, p) {
      typeof m == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, o.d.C(m, p));
    }, Zt.prefetchDNS = function(m) {
      typeof m == "string" && o.d.D(m);
    }, Zt.preinit = function(m, p) {
      if (typeof m == "string" && p && typeof p.as == "string") {
        var v = p.as, b = f(v, p.crossOrigin), w = typeof p.integrity == "string" ? p.integrity : void 0, E = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
        v === "style" ? o.d.S(m, typeof p.precedence == "string" ? p.precedence : void 0, {
          crossOrigin: b,
          integrity: w,
          fetchPriority: E
        }) : v === "script" && o.d.X(m, {
          crossOrigin: b,
          integrity: w,
          fetchPriority: E,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0
        });
      }
    }, Zt.preinitModule = function(m, p) {
      if (typeof m == "string") if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var v = f(p.as, p.crossOrigin);
          o.d.M(m, {
            crossOrigin: v,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && o.d.M(m);
    }, Zt.preload = function(m, p) {
      if (typeof m == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
        var v = p.as, b = f(v, p.crossOrigin);
        o.d.L(m, v, {
          crossOrigin: b,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0,
          type: typeof p.type == "string" ? p.type : void 0,
          fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
          referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
          imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
          imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
          media: typeof p.media == "string" ? p.media : void 0
        });
      }
    }, Zt.preloadModule = function(m, p) {
      if (typeof m == "string") if (p) {
        var v = f(p.as, p.crossOrigin);
        o.d.m(m, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: v,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else o.d.m(m);
    }, Zt.requestFormReset = function(m) {
      o.d.r(m);
    }, Zt.unstable_batchedUpdates = function(m, p) {
      return m(p);
    }, Zt.useFormState = function(m, p, v) {
      return d.H.useFormState(m, p, v);
    }, Zt.useFormStatus = function() {
      return d.H.useHostTransitionStatus();
    }, Zt.version = "19.2.4", Zt;
  }
  var iy;
  function Yv() {
    if (iy) return Ld.exports;
    iy = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), Ld.exports = Gw(), Ld.exports;
  }
  var sy;
  function Pw() {
    if (sy) return To;
    sy = 1;
    var l = qw(), n = Qf(), r = Yv();
    function o(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var a = 2; a < arguments.length; a++) t += "&args[]=" + encodeURIComponent(arguments[a]);
      }
      return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function s(e) {
      return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
    }
    function c(e) {
      var t = e, a = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do
          t = e, (t.flags & 4098) !== 0 && (a = t.return), e = t.return;
        while (e);
      }
      return t.tag === 3 ? a : null;
    }
    function d(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
      }
      return null;
    }
    function f(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
      }
      return null;
    }
    function m(e) {
      if (c(e) !== e) throw Error(o(188));
    }
    function p(e) {
      var t = e.alternate;
      if (!t) {
        if (t = c(e), t === null) throw Error(o(188));
        return t !== e ? null : e;
      }
      for (var a = e, i = t; ; ) {
        var u = a.return;
        if (u === null) break;
        var h = u.alternate;
        if (h === null) {
          if (i = u.return, i !== null) {
            a = i;
            continue;
          }
          break;
        }
        if (u.child === h.child) {
          for (h = u.child; h; ) {
            if (h === a) return m(u), e;
            if (h === i) return m(u), t;
            h = h.sibling;
          }
          throw Error(o(188));
        }
        if (a.return !== i.return) a = u, i = h;
        else {
          for (var x = false, M = u.child; M; ) {
            if (M === a) {
              x = true, a = u, i = h;
              break;
            }
            if (M === i) {
              x = true, i = u, a = h;
              break;
            }
            M = M.sibling;
          }
          if (!x) {
            for (M = h.child; M; ) {
              if (M === a) {
                x = true, a = h, i = u;
                break;
              }
              if (M === i) {
                x = true, i = h, a = u;
                break;
              }
              M = M.sibling;
            }
            if (!x) throw Error(o(189));
          }
        }
        if (a.alternate !== i) throw Error(o(190));
      }
      if (a.tag !== 3) throw Error(o(188));
      return a.stateNode.current === a ? e : t;
    }
    function v(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null; ) {
        if (t = v(e), t !== null) return t;
        e = e.sibling;
      }
      return null;
    }
    var b = Object.assign, w = Symbol.for("react.element"), E = Symbol.for("react.transitional.element"), k = Symbol.for("react.portal"), S = Symbol.for("react.fragment"), C = Symbol.for("react.strict_mode"), _ = Symbol.for("react.profiler"), L = Symbol.for("react.consumer"), R = Symbol.for("react.context"), T = Symbol.for("react.forward_ref"), B = Symbol.for("react.suspense"), N = Symbol.for("react.suspense_list"), A = Symbol.for("react.memo"), H = Symbol.for("react.lazy"), z = Symbol.for("react.activity"), P = Symbol.for("react.memo_cache_sentinel"), ee = Symbol.iterator;
    function J(e) {
      return e === null || typeof e != "object" ? null : (e = ee && e[ee] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var ce = Symbol.for("react.client.reference");
    function fe(e) {
      if (e == null) return null;
      if (typeof e == "function") return e.$$typeof === ce ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case S:
          return "Fragment";
        case _:
          return "Profiler";
        case C:
          return "StrictMode";
        case B:
          return "Suspense";
        case N:
          return "SuspenseList";
        case z:
          return "Activity";
      }
      if (typeof e == "object") switch (e.$$typeof) {
        case k:
          return "Portal";
        case R:
          return e.displayName || "Context";
        case L:
          return (e._context.displayName || "Context") + ".Consumer";
        case T:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case A:
          return t = e.displayName || null, t !== null ? t : fe(e.type) || "Memo";
        case H:
          t = e._payload, e = e._init;
          try {
            return fe(e(t));
          } catch {
          }
      }
      return null;
    }
    var Se = Array.isArray, $ = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, F = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ie = {
      pending: false,
      data: null,
      method: null,
      action: null
    }, Ee = [], pe = -1;
    function j(e) {
      return {
        current: e
      };
    }
    function D(e) {
      0 > pe || (e.current = Ee[pe], Ee[pe] = null, pe--);
    }
    function O(e, t) {
      pe++, Ee[pe] = e.current, e.current = t;
    }
    var Z = j(null), Q = j(null), oe = j(null), ue = j(null);
    function _e(e, t) {
      switch (O(oe, t), O(Q, e), O(Z, null), t.nodeType) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Cp(e) : 0;
          break;
        default:
          if (e = t.tagName, t = t.namespaceURI) t = Cp(t), e = Ep(t, e);
          else switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
      }
      D(Z), O(Z, e);
    }
    function X() {
      D(Z), D(Q), D(oe);
    }
    function se(e) {
      e.memoizedState !== null && O(ue, e);
      var t = Z.current, a = Ep(t, e.type);
      t !== a && (O(Q, e), O(Z, a));
    }
    function he(e) {
      Q.current === e && (D(Z), D(Q)), ue.current === e && (D(ue), Mo._currentValue = ie);
    }
    var be, je;
    function Me(e) {
      if (be === void 0) try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        be = t && t[1] || "", je = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
      return `
` + be + e + je;
    }
    var Pe = false;
    function ht(e, t) {
      if (!e || Pe) return "";
      Pe = true;
      var a = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var i = {
          DetermineComponentFrameRoot: function() {
            try {
              if (t) {
                var re = function() {
                  throw Error();
                };
                if (Object.defineProperty(re.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(re, []);
                  } catch (W) {
                    var K = W;
                  }
                  Reflect.construct(e, [], re);
                } else {
                  try {
                    re.call();
                  } catch (W) {
                    K = W;
                  }
                  e.call(re.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (W) {
                  K = W;
                }
                (re = e()) && typeof re.catch == "function" && re.catch(function() {
                });
              }
            } catch (W) {
              if (W && K && typeof W.stack == "string") return [
                W.stack,
                K.stack
              ];
            }
            return [
              null,
              null
            ];
          }
        };
        i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var u = Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot, "name");
        u && u.configurable && Object.defineProperty(i.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot"
        });
        var h = i.DetermineComponentFrameRoot(), x = h[0], M = h[1];
        if (x && M) {
          var I = x.split(`
`), G = M.split(`
`);
          for (u = i = 0; i < I.length && !I[i].includes("DetermineComponentFrameRoot"); ) i++;
          for (; u < G.length && !G[u].includes("DetermineComponentFrameRoot"); ) u++;
          if (i === I.length || u === G.length) for (i = I.length - 1, u = G.length - 1; 1 <= i && 0 <= u && I[i] !== G[u]; ) u--;
          for (; 1 <= i && 0 <= u; i--, u--) if (I[i] !== G[u]) {
            if (i !== 1 || u !== 1) do
              if (i--, u--, 0 > u || I[i] !== G[u]) {
                var te = `
` + I[i].replace(" at new ", " at ");
                return e.displayName && te.includes("<anonymous>") && (te = te.replace("<anonymous>", e.displayName)), te;
              }
            while (1 <= i && 0 <= u);
            break;
          }
        }
      } finally {
        Pe = false, Error.prepareStackTrace = a;
      }
      return (a = e ? e.displayName || e.name : "") ? Me(a) : "";
    }
    function ke(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return Me(e.type);
        case 16:
          return Me("Lazy");
        case 13:
          return e.child !== t && t !== null ? Me("Suspense Fallback") : Me("Suspense");
        case 19:
          return Me("SuspenseList");
        case 0:
        case 15:
          return ht(e.type, false);
        case 11:
          return ht(e.type.render, false);
        case 1:
          return ht(e.type, true);
        case 31:
          return Me("Activity");
        default:
          return "";
      }
    }
    function Xe(e) {
      try {
        var t = "", a = null;
        do
          t += ke(e, a), a = e, e = e.return;
        while (e);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    var Ue = Object.prototype.hasOwnProperty, wt = l.unstable_scheduleCallback, mt = l.unstable_cancelCallback, ln = l.unstable_shouldYield, hn = l.unstable_requestPaint, jt = l.unstable_now, il = l.unstable_getCurrentPriorityLevel, Rl = l.unstable_ImmediatePriority, Al = l.unstable_UserBlockingPriority, Vr = l.unstable_NormalPriority, gc = l.unstable_LowPriority, Ya = l.unstable_IdlePriority, oi = l.log, ii = l.unstable_setDisableYieldValue, Tl = null, Ft = null;
    function Pn(e) {
      if (typeof oi == "function" && ii(e), Ft && typeof Ft.setStrictMode == "function") try {
        Ft.setStrictMode(Tl, e);
      } catch {
      }
    }
    var Wt = Math.clz32 ? Math.clz32 : ci, pc = Math.log, si = Math.LN2;
    function ci(e) {
      return e >>>= 0, e === 0 ? 32 : 31 - (pc(e) / si | 0) | 0;
    }
    var pr = 256, $r = 262144, qr = 4194304;
    function En(e) {
      var t = e & 42;
      if (t !== 0) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function Nl(e, t, a) {
      var i = e.pendingLanes;
      if (i === 0) return 0;
      var u = 0, h = e.suspendedLanes, x = e.pingedLanes;
      e = e.warmLanes;
      var M = i & 134217727;
      return M !== 0 ? (i = M & ~h, i !== 0 ? u = En(i) : (x &= M, x !== 0 ? u = En(x) : a || (a = M & ~e, a !== 0 && (u = En(a))))) : (M = i & ~h, M !== 0 ? u = En(M) : x !== 0 ? u = En(x) : a || (a = i & ~e, a !== 0 && (u = En(a)))), u === 0 ? 0 : t !== 0 && t !== u && (t & h) === 0 && (h = u & -u, a = t & -t, h >= a || h === 32 && (a & 4194048) !== 0) ? t : u;
    }
    function sl(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function ui(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function Gr() {
      var e = qr;
      return qr <<= 1, (qr & 62914560) === 0 && (qr = 4194304), e;
    }
    function yr(e) {
      for (var t = [], a = 0; 31 > a; a++) t.push(e);
      return t;
    }
    function br(e, t) {
      e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
    }
    function Zn(e, t, a, i, u, h) {
      var x = e.pendingLanes;
      e.pendingLanes = a, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= a, e.entangledLanes &= a, e.errorRecoveryDisabledLanes &= a, e.shellSuspendCounter = 0;
      var M = e.entanglements, I = e.expirationTimes, G = e.hiddenUpdates;
      for (a = x & ~a; 0 < a; ) {
        var te = 31 - Wt(a), re = 1 << te;
        M[te] = 0, I[te] = -1;
        var K = G[te];
        if (K !== null) for (G[te] = null, te = 0; te < K.length; te++) {
          var W = K[te];
          W !== null && (W.lane &= -536870913);
        }
        a &= ~re;
      }
      i !== 0 && di(e, i, 0), h !== 0 && u === 0 && e.tag !== 0 && (e.suspendedLanes |= h & ~(x & ~t));
    }
    function di(e, t, a) {
      e.pendingLanes |= t, e.suspendedLanes &= ~t;
      var i = 31 - Wt(t);
      e.entangledLanes |= t, e.entanglements[i] = e.entanglements[i] | 1073741824 | a & 261930;
    }
    function fi(e, t) {
      var a = e.entangledLanes |= t;
      for (e = e.entanglements; a; ) {
        var i = 31 - Wt(a), u = 1 << i;
        u & t | e[i] & t && (e[i] |= t), a &= ~u;
      }
    }
    function hi(e, t) {
      var a = t & -t;
      return a = (a & 42) !== 0 ? 1 : Kn(a), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
    }
    function Kn(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function Ba(e) {
      return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
    }
    function Qn() {
      var e = F.p;
      return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Pp(e.type));
    }
    function vr(e, t) {
      var a = F.p;
      try {
        return F.p = e, t();
      } finally {
        F.p = a;
      }
    }
    var cl = Math.random().toString(36).slice(2), It = "__reactFiber$" + cl, ne = "__reactProps$" + cl, Te = "__reactContainer$" + cl, rt = "__reactEvents$" + cl, Ve = "__reactListeners$" + cl, gt = "__reactHandles$" + cl, dt = "__reactResources$" + cl, Je = "__reactMarker$" + cl;
    function st(e) {
      delete e[It], delete e[ne], delete e[rt], delete e[Ve], delete e[gt];
    }
    function Et(e) {
      var t = e[It];
      if (t) return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[Te] || a[It]) {
          if (a = t.alternate, t.child !== null || a !== null && a.child !== null) for (e = Ap(e); e !== null; ) {
            if (a = e[It]) return a;
            e = Ap(e);
          }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Ze(e) {
      if (e = e[It] || e[Te]) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
      }
      return null;
    }
    function Ut(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(o(33));
    }
    function Lt(e) {
      var t = e[dt];
      return t || (t = e[dt] = {
        hoistableStyles: /* @__PURE__ */ new Map(),
        hoistableScripts: /* @__PURE__ */ new Map()
      }), t;
    }
    function tt(e) {
      e[Je] = true;
    }
    var Fn = /* @__PURE__ */ new Set(), Wn = {};
    function mn(e, t) {
      Hn(e, t), Hn(e + "Capture", t);
    }
    function Hn(e, t) {
      for (Wn[e] = t, e = 0; e < t.length; e++) Fn.add(t[e]);
    }
    var Pr = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ol = {}, xr = {};
    function Dl(e) {
      return Ue.call(xr, e) ? true : Ue.call(Ol, e) ? false : Pr.test(e) ? xr[e] = true : (Ol[e] = true, false);
    }
    function Jn(e, t, a) {
      if (Dl(t)) if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var i = t.toLowerCase().slice(0, 5);
            if (i !== "data-" && i !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + a);
      }
    }
    function Il(e, t, a) {
      if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, "" + a);
      }
    }
    function rn(e, t, a, i) {
      if (i === null) e.removeAttribute(a);
      else {
        switch (typeof i) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(a);
            return;
        }
        e.setAttributeNS(t, a, "" + i);
      }
    }
    function Xt(e) {
      switch (typeof e) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return e;
        default:
          return "";
      }
    }
    function mi(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function yc(e, t, a) {
      var i = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (!e.hasOwnProperty(t) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
        var u = i.get, h = i.set;
        return Object.defineProperty(e, t, {
          configurable: true,
          get: function() {
            return u.call(this);
          },
          set: function(x) {
            a = "" + x, h.call(this, x);
          }
        }), Object.defineProperty(e, t, {
          enumerable: i.enumerable
        }), {
          getValue: function() {
            return a;
          },
          setValue: function(x) {
            a = "" + x;
          },
          stopTracking: function() {
            e._valueTracker = null, delete e[t];
          }
        };
      }
    }
    function Zr(e) {
      if (!e._valueTracker) {
        var t = mi(e) ? "checked" : "value";
        e._valueTracker = yc(e, t, "" + e[t]);
      }
    }
    function Xa(e) {
      if (!e) return false;
      var t = e._valueTracker;
      if (!t) return true;
      var a = t.getValue(), i = "";
      return e && (i = mi(e) ? e.checked ? "true" : "false" : e.value), e = i, e !== a ? (t.setValue(e), true) : false;
    }
    function gi(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var O1 = /[\n"\\]/g;
    function _n(e) {
      return e.replace(O1, function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      });
    }
    function bc(e, t, a, i, u, h, x, M) {
      e.name = "", x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" ? e.type = x : e.removeAttribute("type"), t != null ? x === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Xt(t)) : e.value !== "" + Xt(t) && (e.value = "" + Xt(t)) : x !== "submit" && x !== "reset" || e.removeAttribute("value"), t != null ? vc(e, x, Xt(t)) : a != null ? vc(e, x, Xt(a)) : i != null && e.removeAttribute("value"), u == null && h != null && (e.defaultChecked = !!h), u != null && (e.checked = u && typeof u != "function" && typeof u != "symbol"), M != null && typeof M != "function" && typeof M != "symbol" && typeof M != "boolean" ? e.name = "" + Xt(M) : e.removeAttribute("name");
    }
    function yh(e, t, a, i, u, h, x, M) {
      if (h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" && (e.type = h), t != null || a != null) {
        if (!(h !== "submit" && h !== "reset" || t != null)) {
          Zr(e);
          return;
        }
        a = a != null ? "" + Xt(a) : "", t = t != null ? "" + Xt(t) : a, M || t === e.value || (e.value = t), e.defaultValue = t;
      }
      i = i ?? u, i = typeof i != "function" && typeof i != "symbol" && !!i, e.checked = M ? e.checked : !!i, e.defaultChecked = !!i, x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" && (e.name = x), Zr(e);
    }
    function vc(e, t, a) {
      t === "number" && gi(e.ownerDocument) === e || e.defaultValue === "" + a || (e.defaultValue = "" + a);
    }
    function Kr(e, t, a, i) {
      if (e = e.options, t) {
        t = {};
        for (var u = 0; u < a.length; u++) t["$" + a[u]] = true;
        for (a = 0; a < e.length; a++) u = t.hasOwnProperty("$" + e[a].value), e[a].selected !== u && (e[a].selected = u), u && i && (e[a].defaultSelected = true);
      } else {
        for (a = "" + Xt(a), t = null, u = 0; u < e.length; u++) {
          if (e[u].value === a) {
            e[u].selected = true, i && (e[u].defaultSelected = true);
            return;
          }
          t !== null || e[u].disabled || (t = e[u]);
        }
        t !== null && (t.selected = true);
      }
    }
    function bh(e, t, a) {
      if (t != null && (t = "" + Xt(t), t !== e.value && (e.value = t), a == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = a != null ? "" + Xt(a) : "";
    }
    function vh(e, t, a, i) {
      if (t == null) {
        if (i != null) {
          if (a != null) throw Error(o(92));
          if (Se(i)) {
            if (1 < i.length) throw Error(o(93));
            i = i[0];
          }
          a = i;
        }
        a == null && (a = ""), t = a;
      }
      a = Xt(t), e.defaultValue = a, i = e.textContent, i === a && i !== "" && i !== null && (e.value = i), Zr(e);
    }
    function Qr(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === 3) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var D1 = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function xh(e, t, a) {
      var i = t.indexOf("--") === 0;
      a == null || typeof a == "boolean" || a === "" ? i ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : i ? e.setProperty(t, a) : typeof a != "number" || a === 0 || D1.has(t) ? t === "float" ? e.cssFloat = a : e[t] = ("" + a).trim() : e[t] = a + "px";
    }
    function wh(e, t, a) {
      if (t != null && typeof t != "object") throw Error(o(62));
      if (e = e.style, a != null) {
        for (var i in a) !a.hasOwnProperty(i) || t != null && t.hasOwnProperty(i) || (i.indexOf("--") === 0 ? e.setProperty(i, "") : i === "float" ? e.cssFloat = "" : e[i] = "");
        for (var u in t) i = t[u], t.hasOwnProperty(u) && a[u] !== i && xh(e, u, i);
      } else for (var h in t) t.hasOwnProperty(h) && xh(e, h, t[h]);
    }
    function xc(e) {
      if (e.indexOf("-") === -1) return false;
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var I1 = /* @__PURE__ */ new Map([
      [
        "acceptCharset",
        "accept-charset"
      ],
      [
        "htmlFor",
        "for"
      ],
      [
        "httpEquiv",
        "http-equiv"
      ],
      [
        "crossOrigin",
        "crossorigin"
      ],
      [
        "accentHeight",
        "accent-height"
      ],
      [
        "alignmentBaseline",
        "alignment-baseline"
      ],
      [
        "arabicForm",
        "arabic-form"
      ],
      [
        "baselineShift",
        "baseline-shift"
      ],
      [
        "capHeight",
        "cap-height"
      ],
      [
        "clipPath",
        "clip-path"
      ],
      [
        "clipRule",
        "clip-rule"
      ],
      [
        "colorInterpolation",
        "color-interpolation"
      ],
      [
        "colorInterpolationFilters",
        "color-interpolation-filters"
      ],
      [
        "colorProfile",
        "color-profile"
      ],
      [
        "colorRendering",
        "color-rendering"
      ],
      [
        "dominantBaseline",
        "dominant-baseline"
      ],
      [
        "enableBackground",
        "enable-background"
      ],
      [
        "fillOpacity",
        "fill-opacity"
      ],
      [
        "fillRule",
        "fill-rule"
      ],
      [
        "floodColor",
        "flood-color"
      ],
      [
        "floodOpacity",
        "flood-opacity"
      ],
      [
        "fontFamily",
        "font-family"
      ],
      [
        "fontSize",
        "font-size"
      ],
      [
        "fontSizeAdjust",
        "font-size-adjust"
      ],
      [
        "fontStretch",
        "font-stretch"
      ],
      [
        "fontStyle",
        "font-style"
      ],
      [
        "fontVariant",
        "font-variant"
      ],
      [
        "fontWeight",
        "font-weight"
      ],
      [
        "glyphName",
        "glyph-name"
      ],
      [
        "glyphOrientationHorizontal",
        "glyph-orientation-horizontal"
      ],
      [
        "glyphOrientationVertical",
        "glyph-orientation-vertical"
      ],
      [
        "horizAdvX",
        "horiz-adv-x"
      ],
      [
        "horizOriginX",
        "horiz-origin-x"
      ],
      [
        "imageRendering",
        "image-rendering"
      ],
      [
        "letterSpacing",
        "letter-spacing"
      ],
      [
        "lightingColor",
        "lighting-color"
      ],
      [
        "markerEnd",
        "marker-end"
      ],
      [
        "markerMid",
        "marker-mid"
      ],
      [
        "markerStart",
        "marker-start"
      ],
      [
        "overlinePosition",
        "overline-position"
      ],
      [
        "overlineThickness",
        "overline-thickness"
      ],
      [
        "paintOrder",
        "paint-order"
      ],
      [
        "panose-1",
        "panose-1"
      ],
      [
        "pointerEvents",
        "pointer-events"
      ],
      [
        "renderingIntent",
        "rendering-intent"
      ],
      [
        "shapeRendering",
        "shape-rendering"
      ],
      [
        "stopColor",
        "stop-color"
      ],
      [
        "stopOpacity",
        "stop-opacity"
      ],
      [
        "strikethroughPosition",
        "strikethrough-position"
      ],
      [
        "strikethroughThickness",
        "strikethrough-thickness"
      ],
      [
        "strokeDasharray",
        "stroke-dasharray"
      ],
      [
        "strokeDashoffset",
        "stroke-dashoffset"
      ],
      [
        "strokeLinecap",
        "stroke-linecap"
      ],
      [
        "strokeLinejoin",
        "stroke-linejoin"
      ],
      [
        "strokeMiterlimit",
        "stroke-miterlimit"
      ],
      [
        "strokeOpacity",
        "stroke-opacity"
      ],
      [
        "strokeWidth",
        "stroke-width"
      ],
      [
        "textAnchor",
        "text-anchor"
      ],
      [
        "textDecoration",
        "text-decoration"
      ],
      [
        "textRendering",
        "text-rendering"
      ],
      [
        "transformOrigin",
        "transform-origin"
      ],
      [
        "underlinePosition",
        "underline-position"
      ],
      [
        "underlineThickness",
        "underline-thickness"
      ],
      [
        "unicodeBidi",
        "unicode-bidi"
      ],
      [
        "unicodeRange",
        "unicode-range"
      ],
      [
        "unitsPerEm",
        "units-per-em"
      ],
      [
        "vAlphabetic",
        "v-alphabetic"
      ],
      [
        "vHanging",
        "v-hanging"
      ],
      [
        "vIdeographic",
        "v-ideographic"
      ],
      [
        "vMathematical",
        "v-mathematical"
      ],
      [
        "vectorEffect",
        "vector-effect"
      ],
      [
        "vertAdvY",
        "vert-adv-y"
      ],
      [
        "vertOriginX",
        "vert-origin-x"
      ],
      [
        "vertOriginY",
        "vert-origin-y"
      ],
      [
        "wordSpacing",
        "word-spacing"
      ],
      [
        "writingMode",
        "writing-mode"
      ],
      [
        "xmlnsXlink",
        "xmlns:xlink"
      ],
      [
        "xHeight",
        "x-height"
      ]
    ]), z1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function pi(e) {
      return z1.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
    }
    function ul() {
    }
    var wc = null;
    function Sc(e) {
      return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
    }
    var Fr = null, Wr = null;
    function Sh(e) {
      var t = Ze(e);
      if (t && (e = t.stateNode)) {
        var a = e[ne] || null;
        e: switch (e = t.stateNode, t.type) {
          case "input":
            if (bc(e, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name), t = a.name, a.type === "radio" && t != null) {
              for (a = e; a.parentNode; ) a = a.parentNode;
              for (a = a.querySelectorAll('input[name="' + _n("" + t) + '"][type="radio"]'), t = 0; t < a.length; t++) {
                var i = a[t];
                if (i !== e && i.form === e.form) {
                  var u = i[ne] || null;
                  if (!u) throw Error(o(90));
                  bc(i, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name);
                }
              }
              for (t = 0; t < a.length; t++) i = a[t], i.form === e.form && Xa(i);
            }
            break e;
          case "textarea":
            bh(e, a.value, a.defaultValue);
            break e;
          case "select":
            t = a.value, t != null && Kr(e, !!a.multiple, t, false);
        }
      }
    }
    var Cc = false;
    function Ch(e, t, a) {
      if (Cc) return e(t, a);
      Cc = true;
      try {
        var i = e(t);
        return i;
      } finally {
        if (Cc = false, (Fr !== null || Wr !== null) && (ls(), Fr && (t = Fr, e = Wr, Wr = Fr = null, Sh(t), e))) for (t = 0; t < e.length; t++) Sh(e[t]);
      }
    }
    function Va(e, t) {
      var a = e.stateNode;
      if (a === null) return null;
      var i = a[ne] || null;
      if (i === null) return null;
      a = i[t];
      e: switch (t) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (i = !i.disabled) || (e = e.type, i = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !i;
          break e;
        default:
          e = false;
      }
      if (e) return null;
      if (a && typeof a != "function") throw Error(o(231, t, typeof a));
      return a;
    }
    var dl = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Ec = false;
    if (dl) try {
      var $a = {};
      Object.defineProperty($a, "passive", {
        get: function() {
          Ec = true;
        }
      }), window.addEventListener("test", $a, $a), window.removeEventListener("test", $a, $a);
    } catch {
      Ec = false;
    }
    var zl = null, _c = null, yi = null;
    function Eh() {
      if (yi) return yi;
      var e, t = _c, a = t.length, i, u = "value" in zl ? zl.value : zl.textContent, h = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++) ;
      var x = a - e;
      for (i = 1; i <= x && t[a - i] === u[h - i]; i++) ;
      return yi = u.slice(e, 1 < i ? 1 - i : void 0);
    }
    function bi(e) {
      var t = e.keyCode;
      return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
    }
    function vi() {
      return true;
    }
    function _h() {
      return false;
    }
    function an(e) {
      function t(a, i, u, h, x) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = h, this.target = x, this.currentTarget = null;
        for (var M in e) e.hasOwnProperty(M) && (a = e[M], this[M] = a ? a(h) : h[M]);
        return this.isDefaultPrevented = (h.defaultPrevented != null ? h.defaultPrevented : h.returnValue === false) ? vi : _h, this.isPropagationStopped = _h, this;
      }
      return b(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = false), this.isDefaultPrevented = vi);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = true), this.isPropagationStopped = vi);
        },
        persist: function() {
        },
        isPersistent: vi
      }), t;
    }
    var wr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, xi = an(wr), qa = b({}, wr, {
      view: 0,
      detail: 0
    }), H1 = an(qa), kc, Mc, Ga, wi = b({}, qa, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Lc,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (e !== Ga && (Ga && e.type === "mousemove" ? (kc = e.screenX - Ga.screenX, Mc = e.screenY - Ga.screenY) : Mc = kc = 0, Ga = e), kc);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Mc;
      }
    }), kh = an(wi), U1 = b({}, wi, {
      dataTransfer: 0
    }), Y1 = an(U1), B1 = b({}, qa, {
      relatedTarget: 0
    }), jc = an(B1), X1 = b({}, wr, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), V1 = an(X1), $1 = b({}, wr, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), q1 = an($1), G1 = b({}, wr, {
      data: 0
    }), Mh = an(G1), P1 = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Z1 = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    }, K1 = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function Q1(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = K1[e]) ? !!t[e] : false;
    }
    function Lc() {
      return Q1;
    }
    var F1 = b({}, qa, {
      key: function(e) {
        if (e.key) {
          var t = P1[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress" ? (e = bi(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Z1[e.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Lc,
      charCode: function(e) {
        return e.type === "keypress" ? bi(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? bi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), W1 = an(F1), J1 = b({}, wi, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), jh = an(J1), ex = b({}, qa, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Lc
    }), tx = an(ex), nx = b({}, wr, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), lx = an(nx), rx = b({}, wi, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), ax = an(rx), ox = b({}, wr, {
      newState: 0,
      oldState: 0
    }), ix = an(ox), sx = [
      9,
      13,
      27,
      32
    ], Rc = dl && "CompositionEvent" in window, Pa = null;
    dl && "documentMode" in document && (Pa = document.documentMode);
    var cx = dl && "TextEvent" in window && !Pa, Lh = dl && (!Rc || Pa && 8 < Pa && 11 >= Pa), Rh = " ", Ah = false;
    function Th(e, t) {
      switch (e) {
        case "keyup":
          return sx.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function Nh(e) {
      return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
    }
    var Jr = false;
    function ux(e, t) {
      switch (e) {
        case "compositionend":
          return Nh(t);
        case "keypress":
          return t.which !== 32 ? null : (Ah = true, Rh);
        case "textInput":
          return e = t.data, e === Rh && Ah ? null : e;
        default:
          return null;
      }
    }
    function dx(e, t) {
      if (Jr) return e === "compositionend" || !Rc && Th(e, t) ? (e = Eh(), yi = _c = zl = null, Jr = false, e) : null;
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
            if (t.char && 1 < t.char.length) return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return Lh && t.locale !== "ko" ? null : t.data;
        default:
          return null;
      }
    }
    var fx = {
      color: true,
      date: true,
      datetime: true,
      "datetime-local": true,
      email: true,
      month: true,
      number: true,
      password: true,
      range: true,
      search: true,
      tel: true,
      text: true,
      time: true,
      url: true,
      week: true
    };
    function Oh(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!fx[e.type] : t === "textarea";
    }
    function Dh(e, t, a, i) {
      Fr ? Wr ? Wr.push(i) : Wr = [
        i
      ] : Fr = i, t = us(t, "onChange"), 0 < t.length && (a = new xi("onChange", "change", null, a, i), e.push({
        event: a,
        listeners: t
      }));
    }
    var Za = null, Ka = null;
    function hx(e) {
      yp(e, 0);
    }
    function Si(e) {
      var t = Ut(e);
      if (Xa(t)) return e;
    }
    function Ih(e, t) {
      if (e === "change") return t;
    }
    var zh = false;
    if (dl) {
      var Ac;
      if (dl) {
        var Tc = "oninput" in document;
        if (!Tc) {
          var Hh = document.createElement("div");
          Hh.setAttribute("oninput", "return;"), Tc = typeof Hh.oninput == "function";
        }
        Ac = Tc;
      } else Ac = false;
      zh = Ac && (!document.documentMode || 9 < document.documentMode);
    }
    function Uh() {
      Za && (Za.detachEvent("onpropertychange", Yh), Ka = Za = null);
    }
    function Yh(e) {
      if (e.propertyName === "value" && Si(Ka)) {
        var t = [];
        Dh(t, Ka, e, Sc(e)), Ch(hx, t);
      }
    }
    function mx(e, t, a) {
      e === "focusin" ? (Uh(), Za = t, Ka = a, Za.attachEvent("onpropertychange", Yh)) : e === "focusout" && Uh();
    }
    function gx(e) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown") return Si(Ka);
    }
    function px(e, t) {
      if (e === "click") return Si(t);
    }
    function yx(e, t) {
      if (e === "input" || e === "change") return Si(t);
    }
    function bx(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var gn = typeof Object.is == "function" ? Object.is : bx;
    function Qa(e, t) {
      if (gn(e, t)) return true;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null) return false;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length) return false;
      for (i = 0; i < a.length; i++) {
        var u = a[i];
        if (!Ue.call(t, u) || !gn(e[u], t[u])) return false;
      }
      return true;
    }
    function Bh(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function Xh(e, t) {
      var a = Bh(e);
      e = 0;
      for (var i; a; ) {
        if (a.nodeType === 3) {
          if (i = e + a.textContent.length, e <= t && i >= t) return {
            node: a,
            offset: t - e
          };
          e = i;
        }
        e: {
          for (; a; ) {
            if (a.nextSibling) {
              a = a.nextSibling;
              break e;
            }
            a = a.parentNode;
          }
          a = void 0;
        }
        a = Bh(a);
      }
    }
    function Vh(e, t) {
      return e && t ? e === t ? true : e && e.nodeType === 3 ? false : t && t.nodeType === 3 ? Vh(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : false : false;
    }
    function $h(e) {
      e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
      for (var t = gi(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var a = typeof t.contentWindow.location.href == "string";
        } catch {
          a = false;
        }
        if (a) e = t.contentWindow;
        else break;
        t = gi(e.document);
      }
      return t;
    }
    function Nc(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    var vx = dl && "documentMode" in document && 11 >= document.documentMode, ea = null, Oc = null, Fa = null, Dc = false;
    function qh(e, t, a) {
      var i = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
      Dc || ea == null || ea !== gi(i) || (i = ea, "selectionStart" in i && Nc(i) ? i = {
        start: i.selectionStart,
        end: i.selectionEnd
      } : (i = (i.ownerDocument && i.ownerDocument.defaultView || window).getSelection(), i = {
        anchorNode: i.anchorNode,
        anchorOffset: i.anchorOffset,
        focusNode: i.focusNode,
        focusOffset: i.focusOffset
      }), Fa && Qa(Fa, i) || (Fa = i, i = us(Oc, "onSelect"), 0 < i.length && (t = new xi("onSelect", "select", null, t, a), e.push({
        event: t,
        listeners: i
      }), t.target = ea)));
    }
    function Sr(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var ta = {
      animationend: Sr("Animation", "AnimationEnd"),
      animationiteration: Sr("Animation", "AnimationIteration"),
      animationstart: Sr("Animation", "AnimationStart"),
      transitionrun: Sr("Transition", "TransitionRun"),
      transitionstart: Sr("Transition", "TransitionStart"),
      transitioncancel: Sr("Transition", "TransitionCancel"),
      transitionend: Sr("Transition", "TransitionEnd")
    }, Ic = {}, Gh = {};
    dl && (Gh = document.createElement("div").style, "AnimationEvent" in window || (delete ta.animationend.animation, delete ta.animationiteration.animation, delete ta.animationstart.animation), "TransitionEvent" in window || delete ta.transitionend.transition);
    function Cr(e) {
      if (Ic[e]) return Ic[e];
      if (!ta[e]) return e;
      var t = ta[e], a;
      for (a in t) if (t.hasOwnProperty(a) && a in Gh) return Ic[e] = t[a];
      return e;
    }
    var Ph = Cr("animationend"), Zh = Cr("animationiteration"), Kh = Cr("animationstart"), xx = Cr("transitionrun"), wx = Cr("transitionstart"), Sx = Cr("transitioncancel"), Qh = Cr("transitionend"), Fh = /* @__PURE__ */ new Map(), zc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    zc.push("scrollEnd");
    function Un(e, t) {
      Fh.set(e, t), mn(t, [
        e
      ]);
    }
    var Ci = typeof reportError == "function" ? reportError : function(e) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var t = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
          error: e
        });
        if (!window.dispatchEvent(t)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    }, kn = [], na = 0, Hc = 0;
    function Ei() {
      for (var e = na, t = Hc = na = 0; t < e; ) {
        var a = kn[t];
        kn[t++] = null;
        var i = kn[t];
        kn[t++] = null;
        var u = kn[t];
        kn[t++] = null;
        var h = kn[t];
        if (kn[t++] = null, i !== null && u !== null) {
          var x = i.pending;
          x === null ? u.next = u : (u.next = x.next, x.next = u), i.pending = u;
        }
        h !== 0 && Wh(a, u, h);
      }
    }
    function _i(e, t, a, i) {
      kn[na++] = e, kn[na++] = t, kn[na++] = a, kn[na++] = i, Hc |= i, e.lanes |= i, e = e.alternate, e !== null && (e.lanes |= i);
    }
    function Uc(e, t, a, i) {
      return _i(e, t, a, i), ki(e);
    }
    function Er(e, t) {
      return _i(e, null, null, t), ki(e);
    }
    function Wh(e, t, a) {
      e.lanes |= a;
      var i = e.alternate;
      i !== null && (i.lanes |= a);
      for (var u = false, h = e.return; h !== null; ) h.childLanes |= a, i = h.alternate, i !== null && (i.childLanes |= a), h.tag === 22 && (e = h.stateNode, e === null || e._visibility & 1 || (u = true)), e = h, h = h.return;
      return e.tag === 3 ? (h = e.stateNode, u && t !== null && (u = 31 - Wt(a), e = h.hiddenUpdates, i = e[u], i === null ? e[u] = [
        t
      ] : i.push(t), t.lane = a | 536870912), h) : null;
    }
    function ki(e) {
      if (50 < xo) throw xo = 0, Zu = null, Error(o(185));
      for (var t = e.return; t !== null; ) e = t, t = e.return;
      return e.tag === 3 ? e.stateNode : null;
    }
    var la = {};
    function Cx(e, t, a, i) {
      this.tag = e, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = i, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
    }
    function pn(e, t, a, i) {
      return new Cx(e, t, a, i);
    }
    function Yc(e) {
      return e = e.prototype, !(!e || !e.isReactComponent);
    }
    function fl(e, t) {
      var a = e.alternate;
      return a === null ? (a = pn(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = e.flags & 65011712, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue, t = e.dependencies, a.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.refCleanup = e.refCleanup, a;
    }
    function Jh(e, t) {
      e.flags &= 65011714;
      var a = e.alternate;
      return a === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type, t = a.dependencies, e.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      }), e;
    }
    function Mi(e, t, a, i, u, h) {
      var x = 0;
      if (i = e, typeof e == "function") Yc(e) && (x = 1);
      else if (typeof e == "string") x = jw(e, a, Z.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
      else e: switch (e) {
        case z:
          return e = pn(31, a, t, u), e.elementType = z, e.lanes = h, e;
        case S:
          return _r(a.children, u, h, t);
        case C:
          x = 8, u |= 24;
          break;
        case _:
          return e = pn(12, a, t, u | 2), e.elementType = _, e.lanes = h, e;
        case B:
          return e = pn(13, a, t, u), e.elementType = B, e.lanes = h, e;
        case N:
          return e = pn(19, a, t, u), e.elementType = N, e.lanes = h, e;
        default:
          if (typeof e == "object" && e !== null) switch (e.$$typeof) {
            case R:
              x = 10;
              break e;
            case L:
              x = 9;
              break e;
            case T:
              x = 11;
              break e;
            case A:
              x = 14;
              break e;
            case H:
              x = 16, i = null;
              break e;
          }
          x = 29, a = Error(o(130, e === null ? "null" : typeof e, "")), i = null;
      }
      return t = pn(x, a, t, u), t.elementType = e, t.type = i, t.lanes = h, t;
    }
    function _r(e, t, a, i) {
      return e = pn(7, e, i, t), e.lanes = a, e;
    }
    function Bc(e, t, a) {
      return e = pn(6, e, null, t), e.lanes = a, e;
    }
    function em(e) {
      var t = pn(18, null, null, 0);
      return t.stateNode = e, t;
    }
    function Xc(e, t, a) {
      return t = pn(4, e.children !== null ? e.children : [], e.key, t), t.lanes = a, t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation
      }, t;
    }
    var tm = /* @__PURE__ */ new WeakMap();
    function Mn(e, t) {
      if (typeof e == "object" && e !== null) {
        var a = tm.get(e);
        return a !== void 0 ? a : (t = {
          value: e,
          source: t,
          stack: Xe(t)
        }, tm.set(e, t), t);
      }
      return {
        value: e,
        source: t,
        stack: Xe(t)
      };
    }
    var ra = [], aa = 0, ji = null, Wa = 0, jn = [], Ln = 0, Hl = null, el = 1, tl = "";
    function hl(e, t) {
      ra[aa++] = Wa, ra[aa++] = ji, ji = e, Wa = t;
    }
    function nm(e, t, a) {
      jn[Ln++] = el, jn[Ln++] = tl, jn[Ln++] = Hl, Hl = e;
      var i = el;
      e = tl;
      var u = 32 - Wt(i) - 1;
      i &= ~(1 << u), a += 1;
      var h = 32 - Wt(t) + u;
      if (30 < h) {
        var x = u - u % 5;
        h = (i & (1 << x) - 1).toString(32), i >>= x, u -= x, el = 1 << 32 - Wt(t) + u | a << u | i, tl = h + e;
      } else el = 1 << h | a << u | i, tl = e;
    }
    function Vc(e) {
      e.return !== null && (hl(e, 1), nm(e, 1, 0));
    }
    function $c(e) {
      for (; e === ji; ) ji = ra[--aa], ra[aa] = null, Wa = ra[--aa], ra[aa] = null;
      for (; e === Hl; ) Hl = jn[--Ln], jn[Ln] = null, tl = jn[--Ln], jn[Ln] = null, el = jn[--Ln], jn[Ln] = null;
    }
    function lm(e, t) {
      jn[Ln++] = el, jn[Ln++] = tl, jn[Ln++] = Hl, el = t.id, tl = t.overflow, Hl = e;
    }
    var Vt = null, pt = null, Ge = false, Ul = null, Rn = false, qc = Error(o(519));
    function Yl(e) {
      var t = Error(o(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
      throw Ja(Mn(t, e)), qc;
    }
    function rm(e) {
      var t = e.stateNode, a = e.type, i = e.memoizedProps;
      switch (t[It] = e, t[ne] = i, a) {
        case "dialog":
          Be("cancel", t), Be("close", t);
          break;
        case "iframe":
        case "object":
        case "embed":
          Be("load", t);
          break;
        case "video":
        case "audio":
          for (a = 0; a < So.length; a++) Be(So[a], t);
          break;
        case "source":
          Be("error", t);
          break;
        case "img":
        case "image":
        case "link":
          Be("error", t), Be("load", t);
          break;
        case "details":
          Be("toggle", t);
          break;
        case "input":
          Be("invalid", t), yh(t, i.value, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name, true);
          break;
        case "select":
          Be("invalid", t);
          break;
        case "textarea":
          Be("invalid", t), vh(t, i.value, i.defaultValue, i.children);
      }
      a = i.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || i.suppressHydrationWarning === true || wp(t.textContent, a) ? (i.popover != null && (Be("beforetoggle", t), Be("toggle", t)), i.onScroll != null && Be("scroll", t), i.onScrollEnd != null && Be("scrollend", t), i.onClick != null && (t.onclick = ul), t = true) : t = false, t || Yl(e, true);
    }
    function am(e) {
      for (Vt = e.return; Vt; ) switch (Vt.tag) {
        case 5:
        case 31:
        case 13:
          Rn = false;
          return;
        case 27:
        case 3:
          Rn = true;
          return;
        default:
          Vt = Vt.return;
      }
    }
    function oa(e) {
      if (e !== Vt) return false;
      if (!Ge) return am(e), Ge = true, false;
      var t = e.tag, a;
      if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = e.type, a = !(a !== "form" && a !== "button") || cd(e.type, e.memoizedProps)), a = !a), a && pt && Yl(e), am(e), t === 13) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
        pt = Rp(e);
      } else if (t === 31) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
        pt = Rp(e);
      } else t === 27 ? (t = pt, er(e.type) ? (e = md, md = null, pt = e) : pt = t) : pt = Vt ? Tn(e.stateNode.nextSibling) : null;
      return true;
    }
    function kr() {
      pt = Vt = null, Ge = false;
    }
    function Gc() {
      var e = Ul;
      return e !== null && (un === null ? un = e : un.push.apply(un, e), Ul = null), e;
    }
    function Ja(e) {
      Ul === null ? Ul = [
        e
      ] : Ul.push(e);
    }
    var Pc = j(null), Mr = null, ml = null;
    function Bl(e, t, a) {
      O(Pc, t._currentValue), t._currentValue = a;
    }
    function gl(e) {
      e._currentValue = Pc.current, D(Pc);
    }
    function Zc(e, t, a) {
      for (; e !== null; ) {
        var i = e.alternate;
        if ((e.childLanes & t) !== t ? (e.childLanes |= t, i !== null && (i.childLanes |= t)) : i !== null && (i.childLanes & t) !== t && (i.childLanes |= t), e === a) break;
        e = e.return;
      }
    }
    function Kc(e, t, a, i) {
      var u = e.child;
      for (u !== null && (u.return = e); u !== null; ) {
        var h = u.dependencies;
        if (h !== null) {
          var x = u.child;
          h = h.firstContext;
          e: for (; h !== null; ) {
            var M = h;
            h = u;
            for (var I = 0; I < t.length; I++) if (M.context === t[I]) {
              h.lanes |= a, M = h.alternate, M !== null && (M.lanes |= a), Zc(h.return, a, e), i || (x = null);
              break e;
            }
            h = M.next;
          }
        } else if (u.tag === 18) {
          if (x = u.return, x === null) throw Error(o(341));
          x.lanes |= a, h = x.alternate, h !== null && (h.lanes |= a), Zc(x, a, e), x = null;
        } else x = u.child;
        if (x !== null) x.return = u;
        else for (x = u; x !== null; ) {
          if (x === e) {
            x = null;
            break;
          }
          if (u = x.sibling, u !== null) {
            u.return = x.return, x = u;
            break;
          }
          x = x.return;
        }
        u = x;
      }
    }
    function ia(e, t, a, i) {
      e = null;
      for (var u = t, h = false; u !== null; ) {
        if (!h) {
          if ((u.flags & 524288) !== 0) h = true;
          else if ((u.flags & 262144) !== 0) break;
        }
        if (u.tag === 10) {
          var x = u.alternate;
          if (x === null) throw Error(o(387));
          if (x = x.memoizedProps, x !== null) {
            var M = u.type;
            gn(u.pendingProps.value, x.value) || (e !== null ? e.push(M) : e = [
              M
            ]);
          }
        } else if (u === ue.current) {
          if (x = u.alternate, x === null) throw Error(o(387));
          x.memoizedState.memoizedState !== u.memoizedState.memoizedState && (e !== null ? e.push(Mo) : e = [
            Mo
          ]);
        }
        u = u.return;
      }
      e !== null && Kc(t, e, a, i), t.flags |= 262144;
    }
    function Li(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!gn(e.context._currentValue, e.memoizedValue)) return true;
        e = e.next;
      }
      return false;
    }
    function jr(e) {
      Mr = e, ml = null, e = e.dependencies, e !== null && (e.firstContext = null);
    }
    function $t(e) {
      return om(Mr, e);
    }
    function Ri(e, t) {
      return Mr === null && jr(e), om(e, t);
    }
    function om(e, t) {
      var a = t._currentValue;
      if (t = {
        context: t,
        memoizedValue: a,
        next: null
      }, ml === null) {
        if (e === null) throw Error(o(308));
        ml = t, e.dependencies = {
          lanes: 0,
          firstContext: t
        }, e.flags |= 524288;
      } else ml = ml.next = t;
      return a;
    }
    var Ex = typeof AbortController < "u" ? AbortController : function() {
      var e = [], t = this.signal = {
        aborted: false,
        addEventListener: function(a, i) {
          e.push(i);
        }
      };
      this.abort = function() {
        t.aborted = true, e.forEach(function(a) {
          return a();
        });
      };
    }, _x = l.unstable_scheduleCallback, kx = l.unstable_NormalPriority, Rt = {
      $$typeof: R,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
    function Qc() {
      return {
        controller: new Ex(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function eo(e) {
      e.refCount--, e.refCount === 0 && _x(kx, function() {
        e.controller.abort();
      });
    }
    var to = null, Fc = 0, sa = 0, ca = null;
    function Mx(e, t) {
      if (to === null) {
        var a = to = [];
        Fc = 0, sa = ed(), ca = {
          status: "pending",
          value: void 0,
          then: function(i) {
            a.push(i);
          }
        };
      }
      return Fc++, t.then(im, im), t;
    }
    function im() {
      if (--Fc === 0 && to !== null) {
        ca !== null && (ca.status = "fulfilled");
        var e = to;
        to = null, sa = 0, ca = null;
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function jx(e, t) {
      var a = [], i = {
        status: "pending",
        value: null,
        reason: null,
        then: function(u) {
          a.push(u);
        }
      };
      return e.then(function() {
        i.status = "fulfilled", i.value = t;
        for (var u = 0; u < a.length; u++) (0, a[u])(t);
      }, function(u) {
        for (i.status = "rejected", i.reason = u, u = 0; u < a.length; u++) (0, a[u])(void 0);
      }), i;
    }
    var sm = $.S;
    $.S = function(e, t) {
      qg = jt(), typeof t == "object" && t !== null && typeof t.then == "function" && Mx(e, t), sm !== null && sm(e, t);
    };
    var Lr = j(null);
    function Wc() {
      var e = Lr.current;
      return e !== null ? e : ct.pooledCache;
    }
    function Ai(e, t) {
      t === null ? O(Lr, Lr.current) : O(Lr, t.pool);
    }
    function cm() {
      var e = Wc();
      return e === null ? null : {
        parent: Rt._currentValue,
        pool: e
      };
    }
    var ua = Error(o(460)), Jc = Error(o(474)), Ti = Error(o(542)), Ni = {
      then: function() {
      }
    };
    function um(e) {
      return e = e.status, e === "fulfilled" || e === "rejected";
    }
    function dm(e, t, a) {
      switch (a = e[a], a === void 0 ? e.push(t) : a !== t && (t.then(ul, ul), t = a), t.status) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw e = t.reason, hm(e), e;
        default:
          if (typeof t.status == "string") t.then(ul, ul);
          else {
            if (e = ct, e !== null && 100 < e.shellSuspendCounter) throw Error(o(482));
            e = t, e.status = "pending", e.then(function(i) {
              if (t.status === "pending") {
                var u = t;
                u.status = "fulfilled", u.value = i;
              }
            }, function(i) {
              if (t.status === "pending") {
                var u = t;
                u.status = "rejected", u.reason = i;
              }
            });
          }
          switch (t.status) {
            case "fulfilled":
              return t.value;
            case "rejected":
              throw e = t.reason, hm(e), e;
          }
          throw Ar = t, ua;
      }
    }
    function Rr(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (a) {
        throw a !== null && typeof a == "object" && typeof a.then == "function" ? (Ar = a, ua) : a;
      }
    }
    var Ar = null;
    function fm() {
      if (Ar === null) throw Error(o(459));
      var e = Ar;
      return Ar = null, e;
    }
    function hm(e) {
      if (e === ua || e === Ti) throw Error(o(483));
    }
    var da = null, no = 0;
    function Oi(e) {
      var t = no;
      return no += 1, da === null && (da = []), dm(da, e, t);
    }
    function lo(e, t) {
      t = t.props.ref, e.ref = t !== void 0 ? t : null;
    }
    function Di(e, t) {
      throw t.$$typeof === w ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(o(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
    }
    function mm(e) {
      function t(V, U) {
        if (e) {
          var q = V.deletions;
          q === null ? (V.deletions = [
            U
          ], V.flags |= 16) : q.push(U);
        }
      }
      function a(V, U) {
        if (!e) return null;
        for (; U !== null; ) t(V, U), U = U.sibling;
        return null;
      }
      function i(V) {
        for (var U = /* @__PURE__ */ new Map(); V !== null; ) V.key !== null ? U.set(V.key, V) : U.set(V.index, V), V = V.sibling;
        return U;
      }
      function u(V, U) {
        return V = fl(V, U), V.index = 0, V.sibling = null, V;
      }
      function h(V, U, q) {
        return V.index = q, e ? (q = V.alternate, q !== null ? (q = q.index, q < U ? (V.flags |= 67108866, U) : q) : (V.flags |= 67108866, U)) : (V.flags |= 1048576, U);
      }
      function x(V) {
        return e && V.alternate === null && (V.flags |= 67108866), V;
      }
      function M(V, U, q, le) {
        return U === null || U.tag !== 6 ? (U = Bc(q, V.mode, le), U.return = V, U) : (U = u(U, q), U.return = V, U);
      }
      function I(V, U, q, le) {
        var Le = q.type;
        return Le === S ? te(V, U, q.props.children, le, q.key) : U !== null && (U.elementType === Le || typeof Le == "object" && Le !== null && Le.$$typeof === H && Rr(Le) === U.type) ? (U = u(U, q.props), lo(U, q), U.return = V, U) : (U = Mi(q.type, q.key, q.props, null, V.mode, le), lo(U, q), U.return = V, U);
      }
      function G(V, U, q, le) {
        return U === null || U.tag !== 4 || U.stateNode.containerInfo !== q.containerInfo || U.stateNode.implementation !== q.implementation ? (U = Xc(q, V.mode, le), U.return = V, U) : (U = u(U, q.children || []), U.return = V, U);
      }
      function te(V, U, q, le, Le) {
        return U === null || U.tag !== 7 ? (U = _r(q, V.mode, le, Le), U.return = V, U) : (U = u(U, q), U.return = V, U);
      }
      function re(V, U, q) {
        if (typeof U == "string" && U !== "" || typeof U == "number" || typeof U == "bigint") return U = Bc("" + U, V.mode, q), U.return = V, U;
        if (typeof U == "object" && U !== null) {
          switch (U.$$typeof) {
            case E:
              return q = Mi(U.type, U.key, U.props, null, V.mode, q), lo(q, U), q.return = V, q;
            case k:
              return U = Xc(U, V.mode, q), U.return = V, U;
            case H:
              return U = Rr(U), re(V, U, q);
          }
          if (Se(U) || J(U)) return U = _r(U, V.mode, q, null), U.return = V, U;
          if (typeof U.then == "function") return re(V, Oi(U), q);
          if (U.$$typeof === R) return re(V, Ri(V, U), q);
          Di(V, U);
        }
        return null;
      }
      function K(V, U, q, le) {
        var Le = U !== null ? U.key : null;
        if (typeof q == "string" && q !== "" || typeof q == "number" || typeof q == "bigint") return Le !== null ? null : M(V, U, "" + q, le);
        if (typeof q == "object" && q !== null) {
          switch (q.$$typeof) {
            case E:
              return q.key === Le ? I(V, U, q, le) : null;
            case k:
              return q.key === Le ? G(V, U, q, le) : null;
            case H:
              return q = Rr(q), K(V, U, q, le);
          }
          if (Se(q) || J(q)) return Le !== null ? null : te(V, U, q, le, null);
          if (typeof q.then == "function") return K(V, U, Oi(q), le);
          if (q.$$typeof === R) return K(V, U, Ri(V, q), le);
          Di(V, q);
        }
        return null;
      }
      function W(V, U, q, le, Le) {
        if (typeof le == "string" && le !== "" || typeof le == "number" || typeof le == "bigint") return V = V.get(q) || null, M(U, V, "" + le, Le);
        if (typeof le == "object" && le !== null) {
          switch (le.$$typeof) {
            case E:
              return V = V.get(le.key === null ? q : le.key) || null, I(U, V, le, Le);
            case k:
              return V = V.get(le.key === null ? q : le.key) || null, G(U, V, le, Le);
            case H:
              return le = Rr(le), W(V, U, q, le, Le);
          }
          if (Se(le) || J(le)) return V = V.get(q) || null, te(U, V, le, Le, null);
          if (typeof le.then == "function") return W(V, U, q, Oi(le), Le);
          if (le.$$typeof === R) return W(V, U, q, Ri(U, le), Le);
          Di(U, le);
        }
        return null;
      }
      function xe(V, U, q, le) {
        for (var Le = null, Qe = null, Ce = U, ze = U = 0, qe = null; Ce !== null && ze < q.length; ze++) {
          Ce.index > ze ? (qe = Ce, Ce = null) : qe = Ce.sibling;
          var Fe = K(V, Ce, q[ze], le);
          if (Fe === null) {
            Ce === null && (Ce = qe);
            break;
          }
          e && Ce && Fe.alternate === null && t(V, Ce), U = h(Fe, U, ze), Qe === null ? Le = Fe : Qe.sibling = Fe, Qe = Fe, Ce = qe;
        }
        if (ze === q.length) return a(V, Ce), Ge && hl(V, ze), Le;
        if (Ce === null) {
          for (; ze < q.length; ze++) Ce = re(V, q[ze], le), Ce !== null && (U = h(Ce, U, ze), Qe === null ? Le = Ce : Qe.sibling = Ce, Qe = Ce);
          return Ge && hl(V, ze), Le;
        }
        for (Ce = i(Ce); ze < q.length; ze++) qe = W(Ce, V, ze, q[ze], le), qe !== null && (e && qe.alternate !== null && Ce.delete(qe.key === null ? ze : qe.key), U = h(qe, U, ze), Qe === null ? Le = qe : Qe.sibling = qe, Qe = qe);
        return e && Ce.forEach(function(ar) {
          return t(V, ar);
        }), Ge && hl(V, ze), Le;
      }
      function Re(V, U, q, le) {
        if (q == null) throw Error(o(151));
        for (var Le = null, Qe = null, Ce = U, ze = U = 0, qe = null, Fe = q.next(); Ce !== null && !Fe.done; ze++, Fe = q.next()) {
          Ce.index > ze ? (qe = Ce, Ce = null) : qe = Ce.sibling;
          var ar = K(V, Ce, Fe.value, le);
          if (ar === null) {
            Ce === null && (Ce = qe);
            break;
          }
          e && Ce && ar.alternate === null && t(V, Ce), U = h(ar, U, ze), Qe === null ? Le = ar : Qe.sibling = ar, Qe = ar, Ce = qe;
        }
        if (Fe.done) return a(V, Ce), Ge && hl(V, ze), Le;
        if (Ce === null) {
          for (; !Fe.done; ze++, Fe = q.next()) Fe = re(V, Fe.value, le), Fe !== null && (U = h(Fe, U, ze), Qe === null ? Le = Fe : Qe.sibling = Fe, Qe = Fe);
          return Ge && hl(V, ze), Le;
        }
        for (Ce = i(Ce); !Fe.done; ze++, Fe = q.next()) Fe = W(Ce, V, ze, Fe.value, le), Fe !== null && (e && Fe.alternate !== null && Ce.delete(Fe.key === null ? ze : Fe.key), U = h(Fe, U, ze), Qe === null ? Le = Fe : Qe.sibling = Fe, Qe = Fe);
        return e && Ce.forEach(function(Uw) {
          return t(V, Uw);
        }), Ge && hl(V, ze), Le;
      }
      function it(V, U, q, le) {
        if (typeof q == "object" && q !== null && q.type === S && q.key === null && (q = q.props.children), typeof q == "object" && q !== null) {
          switch (q.$$typeof) {
            case E:
              e: {
                for (var Le = q.key; U !== null; ) {
                  if (U.key === Le) {
                    if (Le = q.type, Le === S) {
                      if (U.tag === 7) {
                        a(V, U.sibling), le = u(U, q.props.children), le.return = V, V = le;
                        break e;
                      }
                    } else if (U.elementType === Le || typeof Le == "object" && Le !== null && Le.$$typeof === H && Rr(Le) === U.type) {
                      a(V, U.sibling), le = u(U, q.props), lo(le, q), le.return = V, V = le;
                      break e;
                    }
                    a(V, U);
                    break;
                  } else t(V, U);
                  U = U.sibling;
                }
                q.type === S ? (le = _r(q.props.children, V.mode, le, q.key), le.return = V, V = le) : (le = Mi(q.type, q.key, q.props, null, V.mode, le), lo(le, q), le.return = V, V = le);
              }
              return x(V);
            case k:
              e: {
                for (Le = q.key; U !== null; ) {
                  if (U.key === Le) if (U.tag === 4 && U.stateNode.containerInfo === q.containerInfo && U.stateNode.implementation === q.implementation) {
                    a(V, U.sibling), le = u(U, q.children || []), le.return = V, V = le;
                    break e;
                  } else {
                    a(V, U);
                    break;
                  }
                  else t(V, U);
                  U = U.sibling;
                }
                le = Xc(q, V.mode, le), le.return = V, V = le;
              }
              return x(V);
            case H:
              return q = Rr(q), it(V, U, q, le);
          }
          if (Se(q)) return xe(V, U, q, le);
          if (J(q)) {
            if (Le = J(q), typeof Le != "function") throw Error(o(150));
            return q = Le.call(q), Re(V, U, q, le);
          }
          if (typeof q.then == "function") return it(V, U, Oi(q), le);
          if (q.$$typeof === R) return it(V, U, Ri(V, q), le);
          Di(V, q);
        }
        return typeof q == "string" && q !== "" || typeof q == "number" || typeof q == "bigint" ? (q = "" + q, U !== null && U.tag === 6 ? (a(V, U.sibling), le = u(U, q), le.return = V, V = le) : (a(V, U), le = Bc(q, V.mode, le), le.return = V, V = le), x(V)) : a(V, U);
      }
      return function(V, U, q, le) {
        try {
          no = 0;
          var Le = it(V, U, q, le);
          return da = null, Le;
        } catch (Ce) {
          if (Ce === ua || Ce === Ti) throw Ce;
          var Qe = pn(29, Ce, null, V.mode);
          return Qe.lanes = le, Qe.return = V, Qe;
        } finally {
        }
      };
    }
    var Tr = mm(true), gm = mm(false), Xl = false;
    function eu(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          lanes: 0,
          hiddenCallbacks: null
        },
        callbacks: null
      };
    }
    function tu(e, t) {
      e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        callbacks: null
      });
    }
    function Vl(e) {
      return {
        lane: e,
        tag: 0,
        payload: null,
        callback: null,
        next: null
      };
    }
    function $l(e, t, a) {
      var i = e.updateQueue;
      if (i === null) return null;
      if (i = i.shared, (We & 2) !== 0) {
        var u = i.pending;
        return u === null ? t.next = t : (t.next = u.next, u.next = t), i.pending = t, t = ki(e), Wh(e, null, a), t;
      }
      return _i(e, i, t, a), ki(e);
    }
    function ro(e, t, a) {
      if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
        var i = t.lanes;
        i &= e.pendingLanes, a |= i, t.lanes = a, fi(e, a);
      }
    }
    function nu(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null && (i = i.updateQueue, a === i)) {
        var u = null, h = null;
        if (a = a.firstBaseUpdate, a !== null) {
          do {
            var x = {
              lane: a.lane,
              tag: a.tag,
              payload: a.payload,
              callback: null,
              next: null
            };
            h === null ? u = h = x : h = h.next = x, a = a.next;
          } while (a !== null);
          h === null ? u = h = t : h = h.next = t;
        } else u = h = t;
        a = {
          baseState: i.baseState,
          firstBaseUpdate: u,
          lastBaseUpdate: h,
          shared: i.shared,
          callbacks: i.callbacks
        }, e.updateQueue = a;
        return;
      }
      e = a.lastBaseUpdate, e === null ? a.firstBaseUpdate = t : e.next = t, a.lastBaseUpdate = t;
    }
    var lu = false;
    function ao() {
      if (lu) {
        var e = ca;
        if (e !== null) throw e;
      }
    }
    function oo(e, t, a, i) {
      lu = false;
      var u = e.updateQueue;
      Xl = false;
      var h = u.firstBaseUpdate, x = u.lastBaseUpdate, M = u.shared.pending;
      if (M !== null) {
        u.shared.pending = null;
        var I = M, G = I.next;
        I.next = null, x === null ? h = G : x.next = G, x = I;
        var te = e.alternate;
        te !== null && (te = te.updateQueue, M = te.lastBaseUpdate, M !== x && (M === null ? te.firstBaseUpdate = G : M.next = G, te.lastBaseUpdate = I));
      }
      if (h !== null) {
        var re = u.baseState;
        x = 0, te = G = I = null, M = h;
        do {
          var K = M.lane & -536870913, W = K !== M.lane;
          if (W ? ($e & K) === K : (i & K) === K) {
            K !== 0 && K === sa && (lu = true), te !== null && (te = te.next = {
              lane: 0,
              tag: M.tag,
              payload: M.payload,
              callback: null,
              next: null
            });
            e: {
              var xe = e, Re = M;
              K = t;
              var it = a;
              switch (Re.tag) {
                case 1:
                  if (xe = Re.payload, typeof xe == "function") {
                    re = xe.call(it, re, K);
                    break e;
                  }
                  re = xe;
                  break e;
                case 3:
                  xe.flags = xe.flags & -65537 | 128;
                case 0:
                  if (xe = Re.payload, K = typeof xe == "function" ? xe.call(it, re, K) : xe, K == null) break e;
                  re = b({}, re, K);
                  break e;
                case 2:
                  Xl = true;
              }
            }
            K = M.callback, K !== null && (e.flags |= 64, W && (e.flags |= 8192), W = u.callbacks, W === null ? u.callbacks = [
              K
            ] : W.push(K));
          } else W = {
            lane: K,
            tag: M.tag,
            payload: M.payload,
            callback: M.callback,
            next: null
          }, te === null ? (G = te = W, I = re) : te = te.next = W, x |= K;
          if (M = M.next, M === null) {
            if (M = u.shared.pending, M === null) break;
            W = M, M = W.next, W.next = null, u.lastBaseUpdate = W, u.shared.pending = null;
          }
        } while (true);
        te === null && (I = re), u.baseState = I, u.firstBaseUpdate = G, u.lastBaseUpdate = te, h === null && (u.shared.lanes = 0), Kl |= x, e.lanes = x, e.memoizedState = re;
      }
    }
    function pm(e, t) {
      if (typeof e != "function") throw Error(o(191, e));
      e.call(t);
    }
    function ym(e, t) {
      var a = e.callbacks;
      if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) pm(a[e], t);
    }
    var fa = j(null), Ii = j(0);
    function bm(e, t) {
      e = El, O(Ii, e), O(fa, t), El = e | t.baseLanes;
    }
    function ru() {
      O(Ii, El), O(fa, fa.current);
    }
    function au() {
      El = Ii.current, D(fa), D(Ii);
    }
    var yn = j(null), An = null;
    function ql(e) {
      var t = e.alternate;
      O(_t, _t.current & 1), O(yn, e), An === null && (t === null || fa.current !== null || t.memoizedState !== null) && (An = e);
    }
    function ou(e) {
      O(_t, _t.current), O(yn, e), An === null && (An = e);
    }
    function vm(e) {
      e.tag === 22 ? (O(_t, _t.current), O(yn, e), An === null && (An = e)) : Gl();
    }
    function Gl() {
      O(_t, _t.current), O(yn, yn.current);
    }
    function bn(e) {
      D(yn), An === e && (An = null), D(_t);
    }
    var _t = j(0);
    function zi(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var a = t.memoizedState;
          if (a !== null && (a = a.dehydrated, a === null || fd(a) || hd(a))) return t;
        } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
          if ((t.flags & 128) !== 0) return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var pl = 0, De = null, at = null, At = null, Hi = false, ha = false, Nr = false, Ui = 0, io = 0, ma = null, Lx = 0;
    function St() {
      throw Error(o(321));
    }
    function iu(e, t) {
      if (t === null) return false;
      for (var a = 0; a < t.length && a < e.length; a++) if (!gn(e[a], t[a])) return false;
      return true;
    }
    function su(e, t, a, i, u, h) {
      return pl = h, De = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, $.H = e === null || e.memoizedState === null ? ng : Cu, Nr = false, h = a(i, u), Nr = false, ha && (h = wm(t, a, i, u)), xm(e), h;
    }
    function xm(e) {
      $.H = uo;
      var t = at !== null && at.next !== null;
      if (pl = 0, At = at = De = null, Hi = false, io = 0, ma = null, t) throw Error(o(300));
      e === null || Tt || (e = e.dependencies, e !== null && Li(e) && (Tt = true));
    }
    function wm(e, t, a, i) {
      De = e;
      var u = 0;
      do {
        if (ha && (ma = null), io = 0, ha = false, 25 <= u) throw Error(o(301));
        if (u += 1, At = at = null, e.updateQueue != null) {
          var h = e.updateQueue;
          h.lastEffect = null, h.events = null, h.stores = null, h.memoCache != null && (h.memoCache.index = 0);
        }
        $.H = lg, h = t(a, i);
      } while (ha);
      return h;
    }
    function Rx() {
      var e = $.H, t = e.useState()[0];
      return t = typeof t.then == "function" ? so(t) : t, e = e.useState()[0], (at !== null ? at.memoizedState : null) !== e && (De.flags |= 1024), t;
    }
    function cu() {
      var e = Ui !== 0;
      return Ui = 0, e;
    }
    function uu(e, t, a) {
      t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a;
    }
    function du(e) {
      if (Hi) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Hi = false;
      }
      pl = 0, At = at = De = null, ha = false, io = Ui = 0, ma = null;
    }
    function Jt() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return At === null ? De.memoizedState = At = e : At = At.next = e, At;
    }
    function kt() {
      if (at === null) {
        var e = De.alternate;
        e = e !== null ? e.memoizedState : null;
      } else e = at.next;
      var t = At === null ? De.memoizedState : At.next;
      if (t !== null) At = t, at = e;
      else {
        if (e === null) throw De.alternate === null ? Error(o(467)) : Error(o(310));
        at = e, e = {
          memoizedState: at.memoizedState,
          baseState: at.baseState,
          baseQueue: at.baseQueue,
          queue: at.queue,
          next: null
        }, At === null ? De.memoizedState = At = e : At = At.next = e;
      }
      return At;
    }
    function Yi() {
      return {
        lastEffect: null,
        events: null,
        stores: null,
        memoCache: null
      };
    }
    function so(e) {
      var t = io;
      return io += 1, ma === null && (ma = []), e = dm(ma, e, t), t = De, (At === null ? t.memoizedState : At.next) === null && (t = t.alternate, $.H = t === null || t.memoizedState === null ? ng : Cu), e;
    }
    function Bi(e) {
      if (e !== null && typeof e == "object") {
        if (typeof e.then == "function") return so(e);
        if (e.$$typeof === R) return $t(e);
      }
      throw Error(o(438, String(e)));
    }
    function fu(e) {
      var t = null, a = De.updateQueue;
      if (a !== null && (t = a.memoCache), t == null) {
        var i = De.alternate;
        i !== null && (i = i.updateQueue, i !== null && (i = i.memoCache, i != null && (t = {
          data: i.data.map(function(u) {
            return u.slice();
          }),
          index: 0
        })));
      }
      if (t == null && (t = {
        data: [],
        index: 0
      }), a === null && (a = Yi(), De.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0) for (a = t.data[t.index] = Array(e), i = 0; i < e; i++) a[i] = P;
      return t.index++, a;
    }
    function yl(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Xi(e) {
      var t = kt();
      return hu(t, at, e);
    }
    function hu(e, t, a) {
      var i = e.queue;
      if (i === null) throw Error(o(311));
      i.lastRenderedReducer = a;
      var u = e.baseQueue, h = i.pending;
      if (h !== null) {
        if (u !== null) {
          var x = u.next;
          u.next = h.next, h.next = x;
        }
        t.baseQueue = u = h, i.pending = null;
      }
      if (h = e.baseState, u === null) e.memoizedState = h;
      else {
        t = u.next;
        var M = x = null, I = null, G = t, te = false;
        do {
          var re = G.lane & -536870913;
          if (re !== G.lane ? ($e & re) === re : (pl & re) === re) {
            var K = G.revertLane;
            if (K === 0) I !== null && (I = I.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: G.action,
              hasEagerState: G.hasEagerState,
              eagerState: G.eagerState,
              next: null
            }), re === sa && (te = true);
            else if ((pl & K) === K) {
              G = G.next, K === sa && (te = true);
              continue;
            } else re = {
              lane: 0,
              revertLane: G.revertLane,
              gesture: null,
              action: G.action,
              hasEagerState: G.hasEagerState,
              eagerState: G.eagerState,
              next: null
            }, I === null ? (M = I = re, x = h) : I = I.next = re, De.lanes |= K, Kl |= K;
            re = G.action, Nr && a(h, re), h = G.hasEagerState ? G.eagerState : a(h, re);
          } else K = {
            lane: re,
            revertLane: G.revertLane,
            gesture: G.gesture,
            action: G.action,
            hasEagerState: G.hasEagerState,
            eagerState: G.eagerState,
            next: null
          }, I === null ? (M = I = K, x = h) : I = I.next = K, De.lanes |= re, Kl |= re;
          G = G.next;
        } while (G !== null && G !== t);
        if (I === null ? x = h : I.next = M, !gn(h, e.memoizedState) && (Tt = true, te && (a = ca, a !== null))) throw a;
        e.memoizedState = h, e.baseState = x, e.baseQueue = I, i.lastRenderedState = h;
      }
      return u === null && (i.lanes = 0), [
        e.memoizedState,
        i.dispatch
      ];
    }
    function mu(e) {
      var t = kt(), a = t.queue;
      if (a === null) throw Error(o(311));
      a.lastRenderedReducer = e;
      var i = a.dispatch, u = a.pending, h = t.memoizedState;
      if (u !== null) {
        a.pending = null;
        var x = u = u.next;
        do
          h = e(h, x.action), x = x.next;
        while (x !== u);
        gn(h, t.memoizedState) || (Tt = true), t.memoizedState = h, t.baseQueue === null && (t.baseState = h), a.lastRenderedState = h;
      }
      return [
        h,
        i
      ];
    }
    function Sm(e, t, a) {
      var i = De, u = kt(), h = Ge;
      if (h) {
        if (a === void 0) throw Error(o(407));
        a = a();
      } else a = t();
      var x = !gn((at || u).memoizedState, a);
      if (x && (u.memoizedState = a, Tt = true), u = u.queue, yu(_m.bind(null, i, u, e), [
        e
      ]), u.getSnapshot !== t || x || At !== null && At.memoizedState.tag & 1) {
        if (i.flags |= 2048, ga(9, {
          destroy: void 0
        }, Em.bind(null, i, u, a, t), null), ct === null) throw Error(o(349));
        h || (pl & 127) !== 0 || Cm(i, t, a);
      }
      return a;
    }
    function Cm(e, t, a) {
      e.flags |= 16384, e = {
        getSnapshot: t,
        value: a
      }, t = De.updateQueue, t === null ? (t = Yi(), De.updateQueue = t, t.stores = [
        e
      ]) : (a = t.stores, a === null ? t.stores = [
        e
      ] : a.push(e));
    }
    function Em(e, t, a, i) {
      t.value = a, t.getSnapshot = i, km(t) && Mm(e);
    }
    function _m(e, t, a) {
      return a(function() {
        km(t) && Mm(e);
      });
    }
    function km(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var a = t();
        return !gn(e, a);
      } catch {
        return true;
      }
    }
    function Mm(e) {
      var t = Er(e, 2);
      t !== null && dn(t, e, 2);
    }
    function gu(e) {
      var t = Jt();
      if (typeof e == "function") {
        var a = e;
        if (e = a(), Nr) {
          Pn(true);
          try {
            a();
          } finally {
            Pn(false);
          }
        }
      }
      return t.memoizedState = t.baseState = e, t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: yl,
        lastRenderedState: e
      }, t;
    }
    function jm(e, t, a, i) {
      return e.baseState = a, hu(e, at, typeof i == "function" ? i : yl);
    }
    function Ax(e, t, a, i, u) {
      if (qi(e)) throw Error(o(485));
      if (e = t.action, e !== null) {
        var h = {
          payload: u,
          action: e,
          next: null,
          isTransition: true,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(x) {
            h.listeners.push(x);
          }
        };
        $.T !== null ? a(true) : h.isTransition = false, i(h), a = t.pending, a === null ? (h.next = t.pending = h, Lm(t, h)) : (h.next = a.next, t.pending = a.next = h);
      }
    }
    function Lm(e, t) {
      var a = t.action, i = t.payload, u = e.state;
      if (t.isTransition) {
        var h = $.T, x = {};
        $.T = x;
        try {
          var M = a(u, i), I = $.S;
          I !== null && I(x, M), Rm(e, t, M);
        } catch (G) {
          pu(e, t, G);
        } finally {
          h !== null && x.types !== null && (h.types = x.types), $.T = h;
        }
      } else try {
        h = a(u, i), Rm(e, t, h);
      } catch (G) {
        pu(e, t, G);
      }
    }
    function Rm(e, t, a) {
      a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(function(i) {
        Am(e, t, i);
      }, function(i) {
        return pu(e, t, i);
      }) : Am(e, t, a);
    }
    function Am(e, t, a) {
      t.status = "fulfilled", t.value = a, Tm(t), e.state = a, t = e.pending, t !== null && (a = t.next, a === t ? e.pending = null : (a = a.next, t.next = a, Lm(e, a)));
    }
    function pu(e, t, a) {
      var i = e.pending;
      if (e.pending = null, i !== null) {
        i = i.next;
        do
          t.status = "rejected", t.reason = a, Tm(t), t = t.next;
        while (t !== i);
      }
      e.action = null;
    }
    function Tm(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function Nm(e, t) {
      return t;
    }
    function Om(e, t) {
      if (Ge) {
        var a = ct.formState;
        if (a !== null) {
          e: {
            var i = De;
            if (Ge) {
              if (pt) {
                t: {
                  for (var u = pt, h = Rn; u.nodeType !== 8; ) {
                    if (!h) {
                      u = null;
                      break t;
                    }
                    if (u = Tn(u.nextSibling), u === null) {
                      u = null;
                      break t;
                    }
                  }
                  h = u.data, u = h === "F!" || h === "F" ? u : null;
                }
                if (u) {
                  pt = Tn(u.nextSibling), i = u.data === "F!";
                  break e;
                }
              }
              Yl(i);
            }
            i = false;
          }
          i && (t = a[0]);
        }
      }
      return a = Jt(), a.memoizedState = a.baseState = t, i = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Nm,
        lastRenderedState: t
      }, a.queue = i, a = Jm.bind(null, De, i), i.dispatch = a, i = gu(false), h = Su.bind(null, De, false, i.queue), i = Jt(), u = {
        state: t,
        dispatch: null,
        action: e,
        pending: null
      }, i.queue = u, a = Ax.bind(null, De, u, h, a), u.dispatch = a, i.memoizedState = e, [
        t,
        a,
        false
      ];
    }
    function Dm(e) {
      var t = kt();
      return Im(t, at, e);
    }
    function Im(e, t, a) {
      if (t = hu(e, t, Nm)[0], e = Xi(yl)[0], typeof t == "object" && t !== null && typeof t.then == "function") try {
        var i = so(t);
      } catch (x) {
        throw x === ua ? Ti : x;
      }
      else i = t;
      t = kt();
      var u = t.queue, h = u.dispatch;
      return a !== t.memoizedState && (De.flags |= 2048, ga(9, {
        destroy: void 0
      }, Tx.bind(null, u, a), null)), [
        i,
        h,
        e
      ];
    }
    function Tx(e, t) {
      e.action = t;
    }
    function zm(e) {
      var t = kt(), a = at;
      if (a !== null) return Im(t, a, e);
      kt(), t = t.memoizedState, a = kt();
      var i = a.queue.dispatch;
      return a.memoizedState = e, [
        t,
        i,
        false
      ];
    }
    function ga(e, t, a, i) {
      return e = {
        tag: e,
        create: a,
        deps: i,
        inst: t,
        next: null
      }, t = De.updateQueue, t === null && (t = Yi(), De.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = e.next = e : (i = a.next, a.next = e, e.next = i, t.lastEffect = e), e;
    }
    function Hm() {
      return kt().memoizedState;
    }
    function Vi(e, t, a, i) {
      var u = Jt();
      De.flags |= e, u.memoizedState = ga(1 | t, {
        destroy: void 0
      }, a, i === void 0 ? null : i);
    }
    function $i(e, t, a, i) {
      var u = kt();
      i = i === void 0 ? null : i;
      var h = u.memoizedState.inst;
      at !== null && i !== null && iu(i, at.memoizedState.deps) ? u.memoizedState = ga(t, h, a, i) : (De.flags |= e, u.memoizedState = ga(1 | t, h, a, i));
    }
    function Um(e, t) {
      Vi(8390656, 8, e, t);
    }
    function yu(e, t) {
      $i(2048, 8, e, t);
    }
    function Nx(e) {
      De.flags |= 4;
      var t = De.updateQueue;
      if (t === null) t = Yi(), De.updateQueue = t, t.events = [
        e
      ];
      else {
        var a = t.events;
        a === null ? t.events = [
          e
        ] : a.push(e);
      }
    }
    function Ym(e) {
      var t = kt().memoizedState;
      return Nx({
        ref: t,
        nextImpl: e
      }), function() {
        if ((We & 2) !== 0) throw Error(o(440));
        return t.impl.apply(void 0, arguments);
      };
    }
    function Bm(e, t) {
      return $i(4, 2, e, t);
    }
    function Xm(e, t) {
      return $i(4, 4, e, t);
    }
    function Vm(e, t) {
      if (typeof t == "function") {
        e = e();
        var a = t(e);
        return function() {
          typeof a == "function" ? a() : t(null);
        };
      }
      if (t != null) return e = e(), t.current = e, function() {
        t.current = null;
      };
    }
    function $m(e, t, a) {
      a = a != null ? a.concat([
        e
      ]) : null, $i(4, 4, Vm.bind(null, t, e), a);
    }
    function bu() {
    }
    function qm(e, t) {
      var a = kt();
      t = t === void 0 ? null : t;
      var i = a.memoizedState;
      return t !== null && iu(t, i[1]) ? i[0] : (a.memoizedState = [
        e,
        t
      ], e);
    }
    function Gm(e, t) {
      var a = kt();
      t = t === void 0 ? null : t;
      var i = a.memoizedState;
      if (t !== null && iu(t, i[1])) return i[0];
      if (i = e(), Nr) {
        Pn(true);
        try {
          e();
        } finally {
          Pn(false);
        }
      }
      return a.memoizedState = [
        i,
        t
      ], i;
    }
    function vu(e, t, a) {
      return a === void 0 || (pl & 1073741824) !== 0 && ($e & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = a, e = Pg(), De.lanes |= e, Kl |= e, a);
    }
    function Pm(e, t, a, i) {
      return gn(a, t) ? a : fa.current !== null ? (e = vu(e, a, i), gn(e, t) || (Tt = true), e) : (pl & 42) === 0 || (pl & 1073741824) !== 0 && ($e & 261930) === 0 ? (Tt = true, e.memoizedState = a) : (e = Pg(), De.lanes |= e, Kl |= e, t);
    }
    function Zm(e, t, a, i, u) {
      var h = F.p;
      F.p = h !== 0 && 8 > h ? h : 8;
      var x = $.T, M = {};
      $.T = M, Su(e, false, t, a);
      try {
        var I = u(), G = $.S;
        if (G !== null && G(M, I), I !== null && typeof I == "object" && typeof I.then == "function") {
          var te = jx(I, i);
          co(e, t, te, wn(e));
        } else co(e, t, i, wn(e));
      } catch (re) {
        co(e, t, {
          then: function() {
          },
          status: "rejected",
          reason: re
        }, wn());
      } finally {
        F.p = h, x !== null && M.types !== null && (x.types = M.types), $.T = x;
      }
    }
    function Ox() {
    }
    function xu(e, t, a, i) {
      if (e.tag !== 5) throw Error(o(476));
      var u = Km(e).queue;
      Zm(e, u, t, ie, a === null ? Ox : function() {
        return Qm(e), a(i);
      });
    }
    function Km(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: ie,
        baseState: ie,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: yl,
          lastRenderedState: ie
        },
        next: null
      };
      var a = {};
      return t.next = {
        memoizedState: a,
        baseState: a,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: yl,
          lastRenderedState: a
        },
        next: null
      }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
    }
    function Qm(e) {
      var t = Km(e);
      t.next === null && (t = e.alternate.memoizedState), co(e, t.next.queue, {}, wn());
    }
    function wu() {
      return $t(Mo);
    }
    function Fm() {
      return kt().memoizedState;
    }
    function Wm() {
      return kt().memoizedState;
    }
    function Dx(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var a = wn();
            e = Vl(a);
            var i = $l(t, e, a);
            i !== null && (dn(i, t, a), ro(i, t, a)), t = {
              cache: Qc()
            }, e.payload = t;
            return;
        }
        t = t.return;
      }
    }
    function Ix(e, t, a) {
      var i = wn();
      a = {
        lane: i,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, qi(e) ? eg(t, a) : (a = Uc(e, t, a, i), a !== null && (dn(a, e, i), tg(a, t, i)));
    }
    function Jm(e, t, a) {
      var i = wn();
      co(e, t, a, i);
    }
    function co(e, t, a, i) {
      var u = {
        lane: i,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (qi(e)) eg(t, u);
      else {
        var h = e.alternate;
        if (e.lanes === 0 && (h === null || h.lanes === 0) && (h = t.lastRenderedReducer, h !== null)) try {
          var x = t.lastRenderedState, M = h(x, a);
          if (u.hasEagerState = true, u.eagerState = M, gn(M, x)) return _i(e, t, u, 0), ct === null && Ei(), false;
        } catch {
        } finally {
        }
        if (a = Uc(e, t, u, i), a !== null) return dn(a, e, i), tg(a, t, i), true;
      }
      return false;
    }
    function Su(e, t, a, i) {
      if (i = {
        lane: 2,
        revertLane: ed(),
        gesture: null,
        action: i,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, qi(e)) {
        if (t) throw Error(o(479));
      } else t = Uc(e, a, i, 2), t !== null && dn(t, e, 2);
    }
    function qi(e) {
      var t = e.alternate;
      return e === De || t !== null && t === De;
    }
    function eg(e, t) {
      ha = Hi = true;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function tg(e, t, a) {
      if ((a & 4194048) !== 0) {
        var i = t.lanes;
        i &= e.pendingLanes, a |= i, t.lanes = a, fi(e, a);
      }
    }
    var uo = {
      readContext: $t,
      use: Bi,
      useCallback: St,
      useContext: St,
      useEffect: St,
      useImperativeHandle: St,
      useLayoutEffect: St,
      useInsertionEffect: St,
      useMemo: St,
      useReducer: St,
      useRef: St,
      useState: St,
      useDebugValue: St,
      useDeferredValue: St,
      useTransition: St,
      useSyncExternalStore: St,
      useId: St,
      useHostTransitionStatus: St,
      useFormState: St,
      useActionState: St,
      useOptimistic: St,
      useMemoCache: St,
      useCacheRefresh: St
    };
    uo.useEffectEvent = St;
    var ng = {
      readContext: $t,
      use: Bi,
      useCallback: function(e, t) {
        return Jt().memoizedState = [
          e,
          t === void 0 ? null : t
        ], e;
      },
      useContext: $t,
      useEffect: Um,
      useImperativeHandle: function(e, t, a) {
        a = a != null ? a.concat([
          e
        ]) : null, Vi(4194308, 4, Vm.bind(null, t, e), a);
      },
      useLayoutEffect: function(e, t) {
        return Vi(4194308, 4, e, t);
      },
      useInsertionEffect: function(e, t) {
        Vi(4, 2, e, t);
      },
      useMemo: function(e, t) {
        var a = Jt();
        t = t === void 0 ? null : t;
        var i = e();
        if (Nr) {
          Pn(true);
          try {
            e();
          } finally {
            Pn(false);
          }
        }
        return a.memoizedState = [
          i,
          t
        ], i;
      },
      useReducer: function(e, t, a) {
        var i = Jt();
        if (a !== void 0) {
          var u = a(t);
          if (Nr) {
            Pn(true);
            try {
              a(t);
            } finally {
              Pn(false);
            }
          }
        } else u = t;
        return i.memoizedState = i.baseState = u, e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: u
        }, i.queue = e, e = e.dispatch = Ix.bind(null, De, e), [
          i.memoizedState,
          e
        ];
      },
      useRef: function(e) {
        var t = Jt();
        return e = {
          current: e
        }, t.memoizedState = e;
      },
      useState: function(e) {
        e = gu(e);
        var t = e.queue, a = Jm.bind(null, De, t);
        return t.dispatch = a, [
          e.memoizedState,
          a
        ];
      },
      useDebugValue: bu,
      useDeferredValue: function(e, t) {
        var a = Jt();
        return vu(a, e, t);
      },
      useTransition: function() {
        var e = gu(false);
        return e = Zm.bind(null, De, e.queue, true, false), Jt().memoizedState = e, [
          false,
          e
        ];
      },
      useSyncExternalStore: function(e, t, a) {
        var i = De, u = Jt();
        if (Ge) {
          if (a === void 0) throw Error(o(407));
          a = a();
        } else {
          if (a = t(), ct === null) throw Error(o(349));
          ($e & 127) !== 0 || Cm(i, t, a);
        }
        u.memoizedState = a;
        var h = {
          value: a,
          getSnapshot: t
        };
        return u.queue = h, Um(_m.bind(null, i, h, e), [
          e
        ]), i.flags |= 2048, ga(9, {
          destroy: void 0
        }, Em.bind(null, i, h, a, t), null), a;
      },
      useId: function() {
        var e = Jt(), t = ct.identifierPrefix;
        if (Ge) {
          var a = tl, i = el;
          a = (i & ~(1 << 32 - Wt(i) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = Ui++, 0 < a && (t += "H" + a.toString(32)), t += "_";
        } else a = Lx++, t = "_" + t + "r_" + a.toString(32) + "_";
        return e.memoizedState = t;
      },
      useHostTransitionStatus: wu,
      useFormState: Om,
      useActionState: Om,
      useOptimistic: function(e) {
        var t = Jt();
        t.memoizedState = t.baseState = e;
        var a = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        return t.queue = a, t = Su.bind(null, De, true, a), a.dispatch = t, [
          e,
          t
        ];
      },
      useMemoCache: fu,
      useCacheRefresh: function() {
        return Jt().memoizedState = Dx.bind(null, De);
      },
      useEffectEvent: function(e) {
        var t = Jt(), a = {
          impl: e
        };
        return t.memoizedState = a, function() {
          if ((We & 2) !== 0) throw Error(o(440));
          return a.impl.apply(void 0, arguments);
        };
      }
    }, Cu = {
      readContext: $t,
      use: Bi,
      useCallback: qm,
      useContext: $t,
      useEffect: yu,
      useImperativeHandle: $m,
      useInsertionEffect: Bm,
      useLayoutEffect: Xm,
      useMemo: Gm,
      useReducer: Xi,
      useRef: Hm,
      useState: function() {
        return Xi(yl);
      },
      useDebugValue: bu,
      useDeferredValue: function(e, t) {
        var a = kt();
        return Pm(a, at.memoizedState, e, t);
      },
      useTransition: function() {
        var e = Xi(yl)[0], t = kt().memoizedState;
        return [
          typeof e == "boolean" ? e : so(e),
          t
        ];
      },
      useSyncExternalStore: Sm,
      useId: Fm,
      useHostTransitionStatus: wu,
      useFormState: Dm,
      useActionState: Dm,
      useOptimistic: function(e, t) {
        var a = kt();
        return jm(a, at, e, t);
      },
      useMemoCache: fu,
      useCacheRefresh: Wm
    };
    Cu.useEffectEvent = Ym;
    var lg = {
      readContext: $t,
      use: Bi,
      useCallback: qm,
      useContext: $t,
      useEffect: yu,
      useImperativeHandle: $m,
      useInsertionEffect: Bm,
      useLayoutEffect: Xm,
      useMemo: Gm,
      useReducer: mu,
      useRef: Hm,
      useState: function() {
        return mu(yl);
      },
      useDebugValue: bu,
      useDeferredValue: function(e, t) {
        var a = kt();
        return at === null ? vu(a, e, t) : Pm(a, at.memoizedState, e, t);
      },
      useTransition: function() {
        var e = mu(yl)[0], t = kt().memoizedState;
        return [
          typeof e == "boolean" ? e : so(e),
          t
        ];
      },
      useSyncExternalStore: Sm,
      useId: Fm,
      useHostTransitionStatus: wu,
      useFormState: zm,
      useActionState: zm,
      useOptimistic: function(e, t) {
        var a = kt();
        return at !== null ? jm(a, at, e, t) : (a.baseState = e, [
          e,
          a.queue.dispatch
        ]);
      },
      useMemoCache: fu,
      useCacheRefresh: Wm
    };
    lg.useEffectEvent = Ym;
    function Eu(e, t, a, i) {
      t = e.memoizedState, a = a(i, t), a = a == null ? t : b({}, t, a), e.memoizedState = a, e.lanes === 0 && (e.updateQueue.baseState = a);
    }
    var _u = {
      enqueueSetState: function(e, t, a) {
        e = e._reactInternals;
        var i = wn(), u = Vl(i);
        u.payload = t, a != null && (u.callback = a), t = $l(e, u, i), t !== null && (dn(t, e, i), ro(t, e, i));
      },
      enqueueReplaceState: function(e, t, a) {
        e = e._reactInternals;
        var i = wn(), u = Vl(i);
        u.tag = 1, u.payload = t, a != null && (u.callback = a), t = $l(e, u, i), t !== null && (dn(t, e, i), ro(t, e, i));
      },
      enqueueForceUpdate: function(e, t) {
        e = e._reactInternals;
        var a = wn(), i = Vl(a);
        i.tag = 2, t != null && (i.callback = t), t = $l(e, i, a), t !== null && (dn(t, e, a), ro(t, e, a));
      }
    };
    function rg(e, t, a, i, u, h, x) {
      return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(i, h, x) : t.prototype && t.prototype.isPureReactComponent ? !Qa(a, i) || !Qa(u, h) : true;
    }
    function ag(e, t, a, i) {
      e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== e && _u.enqueueReplaceState(t, t.state, null);
    }
    function Or(e, t) {
      var a = t;
      if ("ref" in t) {
        a = {};
        for (var i in t) i !== "ref" && (a[i] = t[i]);
      }
      if (e = e.defaultProps) {
        a === t && (a = b({}, a));
        for (var u in e) a[u] === void 0 && (a[u] = e[u]);
      }
      return a;
    }
    function og(e) {
      Ci(e);
    }
    function ig(e) {
      console.error(e);
    }
    function sg(e) {
      Ci(e);
    }
    function Gi(e, t) {
      try {
        var a = e.onUncaughtError;
        a(t.value, {
          componentStack: t.stack
        });
      } catch (i) {
        setTimeout(function() {
          throw i;
        });
      }
    }
    function cg(e, t, a) {
      try {
        var i = e.onCaughtError;
        i(a.value, {
          componentStack: a.stack,
          errorBoundary: t.tag === 1 ? t.stateNode : null
        });
      } catch (u) {
        setTimeout(function() {
          throw u;
        });
      }
    }
    function ku(e, t, a) {
      return a = Vl(a), a.tag = 3, a.payload = {
        element: null
      }, a.callback = function() {
        Gi(e, t);
      }, a;
    }
    function ug(e) {
      return e = Vl(e), e.tag = 3, e;
    }
    function dg(e, t, a, i) {
      var u = a.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var h = i.value;
        e.payload = function() {
          return u(h);
        }, e.callback = function() {
          cg(t, a, i);
        };
      }
      var x = a.stateNode;
      x !== null && typeof x.componentDidCatch == "function" && (e.callback = function() {
        cg(t, a, i), typeof u != "function" && (Ql === null ? Ql = /* @__PURE__ */ new Set([
          this
        ]) : Ql.add(this));
        var M = i.stack;
        this.componentDidCatch(i.value, {
          componentStack: M !== null ? M : ""
        });
      });
    }
    function zx(e, t, a, i, u) {
      if (a.flags |= 32768, i !== null && typeof i == "object" && typeof i.then == "function") {
        if (t = a.alternate, t !== null && ia(t, a, u, true), a = yn.current, a !== null) {
          switch (a.tag) {
            case 31:
            case 13:
              return An === null ? rs() : a.alternate === null && Ct === 0 && (Ct = 3), a.flags &= -257, a.flags |= 65536, a.lanes = u, i === Ni ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([
                i
              ]) : t.add(i), Fu(e, i, u)), false;
            case 22:
              return a.flags |= 65536, i === Ni ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([
                  i
                ])
              }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([
                i
              ]) : a.add(i)), Fu(e, i, u)), false;
          }
          throw Error(o(435, a.tag));
        }
        return Fu(e, i, u), rs(), false;
      }
      if (Ge) return t = yn.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, i !== qc && (e = Error(o(422), {
        cause: i
      }), Ja(Mn(e, a)))) : (i !== qc && (t = Error(o(423), {
        cause: i
      }), Ja(Mn(t, a))), e = e.current.alternate, e.flags |= 65536, u &= -u, e.lanes |= u, i = Mn(i, a), u = ku(e.stateNode, i, u), nu(e, u), Ct !== 4 && (Ct = 2)), false;
      var h = Error(o(520), {
        cause: i
      });
      if (h = Mn(h, a), vo === null ? vo = [
        h
      ] : vo.push(h), Ct !== 4 && (Ct = 2), t === null) return true;
      i = Mn(i, a), a = t;
      do {
        switch (a.tag) {
          case 3:
            return a.flags |= 65536, e = u & -u, a.lanes |= e, e = ku(a.stateNode, i, e), nu(a, e), false;
          case 1:
            if (t = a.type, h = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (Ql === null || !Ql.has(h)))) return a.flags |= 65536, u &= -u, a.lanes |= u, u = ug(u), dg(u, e, a, i), nu(a, u), false;
        }
        a = a.return;
      } while (a !== null);
      return false;
    }
    var Mu = Error(o(461)), Tt = false;
    function qt(e, t, a, i) {
      t.child = e === null ? gm(t, null, a, i) : Tr(t, e.child, a, i);
    }
    function fg(e, t, a, i, u) {
      a = a.render;
      var h = t.ref;
      if ("ref" in i) {
        var x = {};
        for (var M in i) M !== "ref" && (x[M] = i[M]);
      } else x = i;
      return jr(t), i = su(e, t, a, x, h, u), M = cu(), e !== null && !Tt ? (uu(e, t, u), bl(e, t, u)) : (Ge && M && Vc(t), t.flags |= 1, qt(e, t, i, u), t.child);
    }
    function hg(e, t, a, i, u) {
      if (e === null) {
        var h = a.type;
        return typeof h == "function" && !Yc(h) && h.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = h, mg(e, t, h, i, u)) : (e = Mi(a.type, null, i, t, t.mode, u), e.ref = t.ref, e.return = t, t.child = e);
      }
      if (h = e.child, !Du(e, u)) {
        var x = h.memoizedProps;
        if (a = a.compare, a = a !== null ? a : Qa, a(x, i) && e.ref === t.ref) return bl(e, t, u);
      }
      return t.flags |= 1, e = fl(h, i), e.ref = t.ref, e.return = t, t.child = e;
    }
    function mg(e, t, a, i, u) {
      if (e !== null) {
        var h = e.memoizedProps;
        if (Qa(h, i) && e.ref === t.ref) if (Tt = false, t.pendingProps = i = h, Du(e, u)) (e.flags & 131072) !== 0 && (Tt = true);
        else return t.lanes = e.lanes, bl(e, t, u);
      }
      return ju(e, t, a, i, u);
    }
    function gg(e, t, a, i) {
      var u = i.children, h = e !== null ? e.memoizedState : null;
      if (e === null && t.stateNode === null && (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), i.mode === "hidden") {
        if ((t.flags & 128) !== 0) {
          if (h = h !== null ? h.baseLanes | a : a, e !== null) {
            for (i = t.child = e.child, u = 0; i !== null; ) u = u | i.lanes | i.childLanes, i = i.sibling;
            i = u & ~h;
          } else i = 0, t.child = null;
          return pg(e, t, h, a, i);
        }
        if ((a & 536870912) !== 0) t.memoizedState = {
          baseLanes: 0,
          cachePool: null
        }, e !== null && Ai(t, h !== null ? h.cachePool : null), h !== null ? bm(t, h) : ru(), vm(t);
        else return i = t.lanes = 536870912, pg(e, t, h !== null ? h.baseLanes | a : a, a, i);
      } else h !== null ? (Ai(t, h.cachePool), bm(t, h), Gl(), t.memoizedState = null) : (e !== null && Ai(t, null), ru(), Gl());
      return qt(e, t, u, a), t.child;
    }
    function fo(e, t) {
      return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), t.sibling;
    }
    function pg(e, t, a, i, u) {
      var h = Wc();
      return h = h === null ? null : {
        parent: Rt._currentValue,
        pool: h
      }, t.memoizedState = {
        baseLanes: a,
        cachePool: h
      }, e !== null && Ai(t, null), ru(), vm(t), e !== null && ia(e, t, i, true), t.childLanes = u, null;
    }
    function Pi(e, t) {
      return t = Ki({
        mode: t.mode,
        children: t.children
      }, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
    }
    function yg(e, t, a) {
      return Tr(t, e.child, null, a), e = Pi(t, t.pendingProps), e.flags |= 2, bn(t), t.memoizedState = null, e;
    }
    function Hx(e, t, a) {
      var i = t.pendingProps, u = (t.flags & 128) !== 0;
      if (t.flags &= -129, e === null) {
        if (Ge) {
          if (i.mode === "hidden") return e = Pi(t, i), t.lanes = 536870912, fo(null, e);
          if (ou(t), (e = pt) ? (e = Lp(e, Rn), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: Hl !== null ? {
              id: el,
              overflow: tl
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, a = em(e), a.return = t, t.child = a, Vt = t, pt = null)) : e = null, e === null) throw Yl(t);
          return t.lanes = 536870912, null;
        }
        return Pi(t, i);
      }
      var h = e.memoizedState;
      if (h !== null) {
        var x = h.dehydrated;
        if (ou(t), u) if (t.flags & 256) t.flags &= -257, t = yg(e, t, a);
        else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
        else if (Tt || ia(e, t, a, false), u = (a & e.childLanes) !== 0, Tt || u) {
          if (i = ct, i !== null && (x = hi(i, a), x !== 0 && x !== h.retryLane)) throw h.retryLane = x, Er(e, x), dn(i, e, x), Mu;
          rs(), t = yg(e, t, a);
        } else e = h.treeContext, pt = Tn(x.nextSibling), Vt = t, Ge = true, Ul = null, Rn = false, e !== null && lm(t, e), t = Pi(t, i), t.flags |= 4096;
        return t;
      }
      return e = fl(e.child, {
        mode: i.mode,
        children: i.children
      }), e.ref = t.ref, t.child = e, e.return = t, e;
    }
    function Zi(e, t) {
      var a = t.ref;
      if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof a != "function" && typeof a != "object") throw Error(o(284));
        (e === null || e.ref !== a) && (t.flags |= 4194816);
      }
    }
    function ju(e, t, a, i, u) {
      return jr(t), a = su(e, t, a, i, void 0, u), i = cu(), e !== null && !Tt ? (uu(e, t, u), bl(e, t, u)) : (Ge && i && Vc(t), t.flags |= 1, qt(e, t, a, u), t.child);
    }
    function bg(e, t, a, i, u, h) {
      return jr(t), t.updateQueue = null, a = wm(t, i, a, u), xm(e), i = cu(), e !== null && !Tt ? (uu(e, t, h), bl(e, t, h)) : (Ge && i && Vc(t), t.flags |= 1, qt(e, t, a, h), t.child);
    }
    function vg(e, t, a, i, u) {
      if (jr(t), t.stateNode === null) {
        var h = la, x = a.contextType;
        typeof x == "object" && x !== null && (h = $t(x)), h = new a(i, h), t.memoizedState = h.state !== null && h.state !== void 0 ? h.state : null, h.updater = _u, t.stateNode = h, h._reactInternals = t, h = t.stateNode, h.props = i, h.state = t.memoizedState, h.refs = {}, eu(t), x = a.contextType, h.context = typeof x == "object" && x !== null ? $t(x) : la, h.state = t.memoizedState, x = a.getDerivedStateFromProps, typeof x == "function" && (Eu(t, a, x, i), h.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof h.getSnapshotBeforeUpdate == "function" || typeof h.UNSAFE_componentWillMount != "function" && typeof h.componentWillMount != "function" || (x = h.state, typeof h.componentWillMount == "function" && h.componentWillMount(), typeof h.UNSAFE_componentWillMount == "function" && h.UNSAFE_componentWillMount(), x !== h.state && _u.enqueueReplaceState(h, h.state, null), oo(t, i, h, u), ao(), h.state = t.memoizedState), typeof h.componentDidMount == "function" && (t.flags |= 4194308), i = true;
      } else if (e === null) {
        h = t.stateNode;
        var M = t.memoizedProps, I = Or(a, M);
        h.props = I;
        var G = h.context, te = a.contextType;
        x = la, typeof te == "object" && te !== null && (x = $t(te));
        var re = a.getDerivedStateFromProps;
        te = typeof re == "function" || typeof h.getSnapshotBeforeUpdate == "function", M = t.pendingProps !== M, te || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (M || G !== x) && ag(t, h, i, x), Xl = false;
        var K = t.memoizedState;
        h.state = K, oo(t, i, h, u), ao(), G = t.memoizedState, M || K !== G || Xl ? (typeof re == "function" && (Eu(t, a, re, i), G = t.memoizedState), (I = Xl || rg(t, a, I, i, K, G, x)) ? (te || typeof h.UNSAFE_componentWillMount != "function" && typeof h.componentWillMount != "function" || (typeof h.componentWillMount == "function" && h.componentWillMount(), typeof h.UNSAFE_componentWillMount == "function" && h.UNSAFE_componentWillMount()), typeof h.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof h.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = i, t.memoizedState = G), h.props = i, h.state = G, h.context = x, i = I) : (typeof h.componentDidMount == "function" && (t.flags |= 4194308), i = false);
      } else {
        h = t.stateNode, tu(e, t), x = t.memoizedProps, te = Or(a, x), h.props = te, re = t.pendingProps, K = h.context, G = a.contextType, I = la, typeof G == "object" && G !== null && (I = $t(G)), M = a.getDerivedStateFromProps, (G = typeof M == "function" || typeof h.getSnapshotBeforeUpdate == "function") || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (x !== re || K !== I) && ag(t, h, i, I), Xl = false, K = t.memoizedState, h.state = K, oo(t, i, h, u), ao();
        var W = t.memoizedState;
        x !== re || K !== W || Xl || e !== null && e.dependencies !== null && Li(e.dependencies) ? (typeof M == "function" && (Eu(t, a, M, i), W = t.memoizedState), (te = Xl || rg(t, a, te, i, K, W, I) || e !== null && e.dependencies !== null && Li(e.dependencies)) ? (G || typeof h.UNSAFE_componentWillUpdate != "function" && typeof h.componentWillUpdate != "function" || (typeof h.componentWillUpdate == "function" && h.componentWillUpdate(i, W, I), typeof h.UNSAFE_componentWillUpdate == "function" && h.UNSAFE_componentWillUpdate(i, W, I)), typeof h.componentDidUpdate == "function" && (t.flags |= 4), typeof h.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof h.componentDidUpdate != "function" || x === e.memoizedProps && K === e.memoizedState || (t.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || x === e.memoizedProps && K === e.memoizedState || (t.flags |= 1024), t.memoizedProps = i, t.memoizedState = W), h.props = i, h.state = W, h.context = I, i = te) : (typeof h.componentDidUpdate != "function" || x === e.memoizedProps && K === e.memoizedState || (t.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || x === e.memoizedProps && K === e.memoizedState || (t.flags |= 1024), i = false);
      }
      return h = i, Zi(e, t), i = (t.flags & 128) !== 0, h || i ? (h = t.stateNode, a = i && typeof a.getDerivedStateFromError != "function" ? null : h.render(), t.flags |= 1, e !== null && i ? (t.child = Tr(t, e.child, null, u), t.child = Tr(t, null, a, u)) : qt(e, t, a, u), t.memoizedState = h.state, e = t.child) : e = bl(e, t, u), e;
    }
    function xg(e, t, a, i) {
      return kr(), t.flags |= 256, qt(e, t, a, i), t.child;
    }
    var Lu = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    };
    function Ru(e) {
      return {
        baseLanes: e,
        cachePool: cm()
      };
    }
    function Au(e, t, a) {
      return e = e !== null ? e.childLanes & ~a : 0, t && (e |= xn), e;
    }
    function wg(e, t, a) {
      var i = t.pendingProps, u = false, h = (t.flags & 128) !== 0, x;
      if ((x = h) || (x = e !== null && e.memoizedState === null ? false : (_t.current & 2) !== 0), x && (u = true, t.flags &= -129), x = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
        if (Ge) {
          if (u ? ql(t) : Gl(), (e = pt) ? (e = Lp(e, Rn), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: Hl !== null ? {
              id: el,
              overflow: tl
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, a = em(e), a.return = t, t.child = a, Vt = t, pt = null)) : e = null, e === null) throw Yl(t);
          return hd(e) ? t.lanes = 32 : t.lanes = 536870912, null;
        }
        var M = i.children;
        return i = i.fallback, u ? (Gl(), u = t.mode, M = Ki({
          mode: "hidden",
          children: M
        }, u), i = _r(i, u, a, null), M.return = t, i.return = t, M.sibling = i, t.child = M, i = t.child, i.memoizedState = Ru(a), i.childLanes = Au(e, x, a), t.memoizedState = Lu, fo(null, i)) : (ql(t), Tu(t, M));
      }
      var I = e.memoizedState;
      if (I !== null && (M = I.dehydrated, M !== null)) {
        if (h) t.flags & 256 ? (ql(t), t.flags &= -257, t = Nu(e, t, a)) : t.memoizedState !== null ? (Gl(), t.child = e.child, t.flags |= 128, t = null) : (Gl(), M = i.fallback, u = t.mode, i = Ki({
          mode: "visible",
          children: i.children
        }, u), M = _r(M, u, a, null), M.flags |= 2, i.return = t, M.return = t, i.sibling = M, t.child = i, Tr(t, e.child, null, a), i = t.child, i.memoizedState = Ru(a), i.childLanes = Au(e, x, a), t.memoizedState = Lu, t = fo(null, i));
        else if (ql(t), hd(M)) {
          if (x = M.nextSibling && M.nextSibling.dataset, x) var G = x.dgst;
          x = G, i = Error(o(419)), i.stack = "", i.digest = x, Ja({
            value: i,
            source: null,
            stack: null
          }), t = Nu(e, t, a);
        } else if (Tt || ia(e, t, a, false), x = (a & e.childLanes) !== 0, Tt || x) {
          if (x = ct, x !== null && (i = hi(x, a), i !== 0 && i !== I.retryLane)) throw I.retryLane = i, Er(e, i), dn(x, e, i), Mu;
          fd(M) || rs(), t = Nu(e, t, a);
        } else fd(M) ? (t.flags |= 192, t.child = e.child, t = null) : (e = I.treeContext, pt = Tn(M.nextSibling), Vt = t, Ge = true, Ul = null, Rn = false, e !== null && lm(t, e), t = Tu(t, i.children), t.flags |= 4096);
        return t;
      }
      return u ? (Gl(), M = i.fallback, u = t.mode, I = e.child, G = I.sibling, i = fl(I, {
        mode: "hidden",
        children: i.children
      }), i.subtreeFlags = I.subtreeFlags & 65011712, G !== null ? M = fl(G, M) : (M = _r(M, u, a, null), M.flags |= 2), M.return = t, i.return = t, i.sibling = M, t.child = i, fo(null, i), i = t.child, M = e.child.memoizedState, M === null ? M = Ru(a) : (u = M.cachePool, u !== null ? (I = Rt._currentValue, u = u.parent !== I ? {
        parent: I,
        pool: I
      } : u) : u = cm(), M = {
        baseLanes: M.baseLanes | a,
        cachePool: u
      }), i.memoizedState = M, i.childLanes = Au(e, x, a), t.memoizedState = Lu, fo(e.child, i)) : (ql(t), a = e.child, e = a.sibling, a = fl(a, {
        mode: "visible",
        children: i.children
      }), a.return = t, a.sibling = null, e !== null && (x = t.deletions, x === null ? (t.deletions = [
        e
      ], t.flags |= 16) : x.push(e)), t.child = a, t.memoizedState = null, a);
    }
    function Tu(e, t) {
      return t = Ki({
        mode: "visible",
        children: t
      }, e.mode), t.return = e, e.child = t;
    }
    function Ki(e, t) {
      return e = pn(22, e, null, t), e.lanes = 0, e;
    }
    function Nu(e, t, a) {
      return Tr(t, e.child, null, a), e = Tu(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
    }
    function Sg(e, t, a) {
      e.lanes |= t;
      var i = e.alternate;
      i !== null && (i.lanes |= t), Zc(e.return, t, a);
    }
    function Ou(e, t, a, i, u, h) {
      var x = e.memoizedState;
      x === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u,
        treeForkCount: h
      } : (x.isBackwards = t, x.rendering = null, x.renderingStartTime = 0, x.last = i, x.tail = a, x.tailMode = u, x.treeForkCount = h);
    }
    function Cg(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, h = i.tail;
      i = i.children;
      var x = _t.current, M = (x & 2) !== 0;
      if (M ? (x = x & 1 | 2, t.flags |= 128) : x &= 1, O(_t, x), qt(e, t, i, a), i = Ge ? Wa : 0, !M && e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Sg(e, a, t);
        else if (e.tag === 19) Sg(e, a, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      switch (u) {
        case "forwards":
          for (a = t.child, u = null; a !== null; ) e = a.alternate, e !== null && zi(e) === null && (u = a), a = a.sibling;
          a = u, a === null ? (u = t.child, t.child = null) : (u = a.sibling, a.sibling = null), Ou(t, false, u, a, h, i);
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (a = null, u = t.child, t.child = null; u !== null; ) {
            if (e = u.alternate, e !== null && zi(e) === null) {
              t.child = u;
              break;
            }
            e = u.sibling, u.sibling = a, a = u, u = e;
          }
          Ou(t, true, a, null, h, i);
          break;
        case "together":
          Ou(t, false, null, null, void 0, i);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function bl(e, t, a) {
      if (e !== null && (t.dependencies = e.dependencies), Kl |= t.lanes, (a & t.childLanes) === 0) if (e !== null) {
        if (ia(e, t, a, false), (a & t.childLanes) === 0) return null;
      } else return null;
      if (e !== null && t.child !== e.child) throw Error(o(153));
      if (t.child !== null) {
        for (e = t.child, a = fl(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null; ) e = e.sibling, a = a.sibling = fl(e, e.pendingProps), a.return = t;
        a.sibling = null;
      }
      return t.child;
    }
    function Du(e, t) {
      return (e.lanes & t) !== 0 ? true : (e = e.dependencies, !!(e !== null && Li(e)));
    }
    function Ux(e, t, a) {
      switch (t.tag) {
        case 3:
          _e(t, t.stateNode.containerInfo), Bl(t, Rt, e.memoizedState.cache), kr();
          break;
        case 27:
        case 5:
          se(t);
          break;
        case 4:
          _e(t, t.stateNode.containerInfo);
          break;
        case 10:
          Bl(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return t.flags |= 128, ou(t), null;
          break;
        case 13:
          var i = t.memoizedState;
          if (i !== null) return i.dehydrated !== null ? (ql(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? wg(e, t, a) : (ql(t), e = bl(e, t, a), e !== null ? e.sibling : null);
          ql(t);
          break;
        case 19:
          var u = (e.flags & 128) !== 0;
          if (i = (a & t.childLanes) !== 0, i || (ia(e, t, a, false), i = (a & t.childLanes) !== 0), u) {
            if (i) return Cg(e, t, a);
            t.flags |= 128;
          }
          if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), O(_t, _t.current), i) break;
          return null;
        case 22:
          return t.lanes = 0, gg(e, t, a, t.pendingProps);
        case 24:
          Bl(t, Rt, e.memoizedState.cache);
      }
      return bl(e, t, a);
    }
    function Eg(e, t, a) {
      if (e !== null) if (e.memoizedProps !== t.pendingProps) Tt = true;
      else {
        if (!Du(e, a) && (t.flags & 128) === 0) return Tt = false, Ux(e, t, a);
        Tt = (e.flags & 131072) !== 0;
      }
      else Tt = false, Ge && (t.flags & 1048576) !== 0 && nm(t, Wa, t.index);
      switch (t.lanes = 0, t.tag) {
        case 16:
          e: {
            var i = t.pendingProps;
            if (e = Rr(t.elementType), t.type = e, typeof e == "function") Yc(e) ? (i = Or(e, i), t.tag = 1, t = vg(null, t, e, i, a)) : (t.tag = 0, t = ju(null, t, e, i, a));
            else {
              if (e != null) {
                var u = e.$$typeof;
                if (u === T) {
                  t.tag = 11, t = fg(null, t, e, i, a);
                  break e;
                } else if (u === A) {
                  t.tag = 14, t = hg(null, t, e, i, a);
                  break e;
                }
              }
              throw t = fe(e) || e, Error(o(306, t, ""));
            }
          }
          return t;
        case 0:
          return ju(e, t, t.type, t.pendingProps, a);
        case 1:
          return i = t.type, u = Or(i, t.pendingProps), vg(e, t, i, u, a);
        case 3:
          e: {
            if (_e(t, t.stateNode.containerInfo), e === null) throw Error(o(387));
            i = t.pendingProps;
            var h = t.memoizedState;
            u = h.element, tu(e, t), oo(t, i, null, a);
            var x = t.memoizedState;
            if (i = x.cache, Bl(t, Rt, i), i !== h.cache && Kc(t, [
              Rt
            ], a, true), ao(), i = x.element, h.isDehydrated) if (h = {
              element: i,
              isDehydrated: false,
              cache: x.cache
            }, t.updateQueue.baseState = h, t.memoizedState = h, t.flags & 256) {
              t = xg(e, t, i, a);
              break e;
            } else if (i !== u) {
              u = Mn(Error(o(424)), t), Ja(u), t = xg(e, t, i, a);
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (pt = Tn(e.firstChild), Vt = t, Ge = true, Ul = null, Rn = true, a = gm(t, null, i, a), t.child = a; a; ) a.flags = a.flags & -3 | 4096, a = a.sibling;
            }
            else {
              if (kr(), i === u) {
                t = bl(e, t, a);
                break e;
              }
              qt(e, t, i, a);
            }
            t = t.child;
          }
          return t;
        case 26:
          return Zi(e, t), e === null ? (a = Dp(t.type, null, t.pendingProps, null)) ? t.memoizedState = a : Ge || (a = t.type, e = t.pendingProps, i = ds(oe.current).createElement(a), i[It] = t, i[ne] = e, Gt(i, a, e), tt(i), t.stateNode = i) : t.memoizedState = Dp(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
        case 27:
          return se(t), e === null && Ge && (i = t.stateNode = Tp(t.type, t.pendingProps, oe.current), Vt = t, Rn = true, u = pt, er(t.type) ? (md = u, pt = Tn(i.firstChild)) : pt = u), qt(e, t, t.pendingProps.children, a), Zi(e, t), e === null && (t.flags |= 4194304), t.child;
        case 5:
          return e === null && Ge && ((u = i = pt) && (i = gw(i, t.type, t.pendingProps, Rn), i !== null ? (t.stateNode = i, Vt = t, pt = Tn(i.firstChild), Rn = false, u = true) : u = false), u || Yl(t)), se(t), u = t.type, h = t.pendingProps, x = e !== null ? e.memoizedProps : null, i = h.children, cd(u, h) ? i = null : x !== null && cd(u, x) && (t.flags |= 32), t.memoizedState !== null && (u = su(e, t, Rx, null, null, a), Mo._currentValue = u), Zi(e, t), qt(e, t, i, a), t.child;
        case 6:
          return e === null && Ge && ((e = a = pt) && (a = pw(a, t.pendingProps, Rn), a !== null ? (t.stateNode = a, Vt = t, pt = null, e = true) : e = false), e || Yl(t)), null;
        case 13:
          return wg(e, t, a);
        case 4:
          return _e(t, t.stateNode.containerInfo), i = t.pendingProps, e === null ? t.child = Tr(t, null, i, a) : qt(e, t, i, a), t.child;
        case 11:
          return fg(e, t, t.type, t.pendingProps, a);
        case 7:
          return qt(e, t, t.pendingProps, a), t.child;
        case 8:
          return qt(e, t, t.pendingProps.children, a), t.child;
        case 12:
          return qt(e, t, t.pendingProps.children, a), t.child;
        case 10:
          return i = t.pendingProps, Bl(t, t.type, i.value), qt(e, t, i.children, a), t.child;
        case 9:
          return u = t.type._context, i = t.pendingProps.children, jr(t), u = $t(u), i = i(u), t.flags |= 1, qt(e, t, i, a), t.child;
        case 14:
          return hg(e, t, t.type, t.pendingProps, a);
        case 15:
          return mg(e, t, t.type, t.pendingProps, a);
        case 19:
          return Cg(e, t, a);
        case 31:
          return Hx(e, t, a);
        case 22:
          return gg(e, t, a, t.pendingProps);
        case 24:
          return jr(t), i = $t(Rt), e === null ? (u = Wc(), u === null && (u = ct, h = Qc(), u.pooledCache = h, h.refCount++, h !== null && (u.pooledCacheLanes |= a), u = h), t.memoizedState = {
            parent: i,
            cache: u
          }, eu(t), Bl(t, Rt, u)) : ((e.lanes & a) !== 0 && (tu(e, t), oo(t, null, null, a), ao()), u = e.memoizedState, h = t.memoizedState, u.parent !== i ? (u = {
            parent: i,
            cache: i
          }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), Bl(t, Rt, i)) : (i = h.cache, Bl(t, Rt, i), i !== u.cache && Kc(t, [
            Rt
          ], a, true))), qt(e, t, t.pendingProps.children, a), t.child;
        case 29:
          throw t.pendingProps;
      }
      throw Error(o(156, t.tag));
    }
    function vl(e) {
      e.flags |= 4;
    }
    function Iu(e, t, a, i, u) {
      if ((t = (e.mode & 32) !== 0) && (t = false), t) {
        if (e.flags |= 16777216, (u & 335544128) === u) if (e.stateNode.complete) e.flags |= 8192;
        else if (Fg()) e.flags |= 8192;
        else throw Ar = Ni, Jc;
      } else e.flags &= -16777217;
    }
    function _g(e, t) {
      if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
      else if (e.flags |= 16777216, !Yp(t)) if (Fg()) e.flags |= 8192;
      else throw Ar = Ni, Jc;
    }
    function Qi(e, t) {
      t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Gr() : 536870912, e.lanes |= t, va |= t);
    }
    function ho(e, t) {
      if (!Ge) switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var a = null; t !== null; ) t.alternate !== null && (a = t), t = t.sibling;
          a === null ? e.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = e.tail;
          for (var i = null; a !== null; ) a.alternate !== null && (i = a), a = a.sibling;
          i === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : i.sibling = null;
      }
    }
    function yt(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = 0, i = 0;
      if (t) for (var u = e.child; u !== null; ) a |= u.lanes | u.childLanes, i |= u.subtreeFlags & 65011712, i |= u.flags & 65011712, u.return = e, u = u.sibling;
      else for (u = e.child; u !== null; ) a |= u.lanes | u.childLanes, i |= u.subtreeFlags, i |= u.flags, u.return = e, u = u.sibling;
      return e.subtreeFlags |= i, e.childLanes = a, t;
    }
    function Yx(e, t, a) {
      var i = t.pendingProps;
      switch ($c(t), t.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return yt(t), null;
        case 1:
          return yt(t), null;
        case 3:
          return a = t.stateNode, i = null, e !== null && (i = e.memoizedState.cache), t.memoizedState.cache !== i && (t.flags |= 2048), gl(Rt), X(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (e === null || e.child === null) && (oa(t) ? vl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Gc())), yt(t), null;
        case 26:
          var u = t.type, h = t.memoizedState;
          return e === null ? (vl(t), h !== null ? (yt(t), _g(t, h)) : (yt(t), Iu(t, u, null, i, a))) : h ? h !== e.memoizedState ? (vl(t), yt(t), _g(t, h)) : (yt(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== i && vl(t), yt(t), Iu(t, u, e, i, a)), null;
        case 27:
          if (he(t), a = oe.current, u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== i && vl(t);
          else {
            if (!i) {
              if (t.stateNode === null) throw Error(o(166));
              return yt(t), null;
            }
            e = Z.current, oa(t) ? rm(t) : (e = Tp(u, i, a), t.stateNode = e, vl(t));
          }
          return yt(t), null;
        case 5:
          if (he(t), u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== i && vl(t);
          else {
            if (!i) {
              if (t.stateNode === null) throw Error(o(166));
              return yt(t), null;
            }
            if (h = Z.current, oa(t)) rm(t);
            else {
              var x = ds(oe.current);
              switch (h) {
                case 1:
                  h = x.createElementNS("http://www.w3.org/2000/svg", u);
                  break;
                case 2:
                  h = x.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                  break;
                default:
                  switch (u) {
                    case "svg":
                      h = x.createElementNS("http://www.w3.org/2000/svg", u);
                      break;
                    case "math":
                      h = x.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                      break;
                    case "script":
                      h = x.createElement("div"), h.innerHTML = "<script><\/script>", h = h.removeChild(h.firstChild);
                      break;
                    case "select":
                      h = typeof i.is == "string" ? x.createElement("select", {
                        is: i.is
                      }) : x.createElement("select"), i.multiple ? h.multiple = true : i.size && (h.size = i.size);
                      break;
                    default:
                      h = typeof i.is == "string" ? x.createElement(u, {
                        is: i.is
                      }) : x.createElement(u);
                  }
              }
              h[It] = t, h[ne] = i;
              e: for (x = t.child; x !== null; ) {
                if (x.tag === 5 || x.tag === 6) h.appendChild(x.stateNode);
                else if (x.tag !== 4 && x.tag !== 27 && x.child !== null) {
                  x.child.return = x, x = x.child;
                  continue;
                }
                if (x === t) break e;
                for (; x.sibling === null; ) {
                  if (x.return === null || x.return === t) break e;
                  x = x.return;
                }
                x.sibling.return = x.return, x = x.sibling;
              }
              t.stateNode = h;
              e: switch (Gt(h, u, i), u) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  i = !!i.autoFocus;
                  break e;
                case "img":
                  i = true;
                  break e;
                default:
                  i = false;
              }
              i && vl(t);
            }
          }
          return yt(t), Iu(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a), null;
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== i && vl(t);
          else {
            if (typeof i != "string" && t.stateNode === null) throw Error(o(166));
            if (e = oe.current, oa(t)) {
              if (e = t.stateNode, a = t.memoizedProps, i = null, u = Vt, u !== null) switch (u.tag) {
                case 27:
                case 5:
                  i = u.memoizedProps;
              }
              e[It] = t, e = !!(e.nodeValue === a || i !== null && i.suppressHydrationWarning === true || wp(e.nodeValue, a)), e || Yl(t, true);
            } else e = ds(e).createTextNode(i), e[It] = t, t.stateNode = e;
          }
          return yt(t), null;
        case 31:
          if (a = t.memoizedState, e === null || e.memoizedState !== null) {
            if (i = oa(t), a !== null) {
              if (e === null) {
                if (!i) throw Error(o(318));
                if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
                e[It] = t;
              } else kr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              yt(t), e = false;
            } else a = Gc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), e = true;
            if (!e) return t.flags & 256 ? (bn(t), t) : (bn(t), null);
            if ((t.flags & 128) !== 0) throw Error(o(558));
          }
          return yt(t), null;
        case 13:
          if (i = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            if (u = oa(t), i !== null && i.dehydrated !== null) {
              if (e === null) {
                if (!u) throw Error(o(318));
                if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(o(317));
                u[It] = t;
              } else kr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              yt(t), u = false;
            } else u = Gc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = u), u = true;
            if (!u) return t.flags & 256 ? (bn(t), t) : (bn(t), null);
          }
          return bn(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = i !== null, e = e !== null && e.memoizedState !== null, a && (i = t.child, u = null, i.alternate !== null && i.alternate.memoizedState !== null && i.alternate.memoizedState.cachePool !== null && (u = i.alternate.memoizedState.cachePool.pool), h = null, i.memoizedState !== null && i.memoizedState.cachePool !== null && (h = i.memoizedState.cachePool.pool), h !== u && (i.flags |= 2048)), a !== e && a && (t.child.flags |= 8192), Qi(t, t.updateQueue), yt(t), null);
        case 4:
          return X(), e === null && rd(t.stateNode.containerInfo), yt(t), null;
        case 10:
          return gl(t.type), yt(t), null;
        case 19:
          if (D(_t), i = t.memoizedState, i === null) return yt(t), null;
          if (u = (t.flags & 128) !== 0, h = i.rendering, h === null) if (u) ho(i, false);
          else {
            if (Ct !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
              if (h = zi(e), h !== null) {
                for (t.flags |= 128, ho(i, false), e = h.updateQueue, t.updateQueue = e, Qi(t, e), t.subtreeFlags = 0, e = a, a = t.child; a !== null; ) Jh(a, e), a = a.sibling;
                return O(_t, _t.current & 1 | 2), Ge && hl(t, i.treeForkCount), t.child;
              }
              e = e.sibling;
            }
            i.tail !== null && jt() > ts && (t.flags |= 128, u = true, ho(i, false), t.lanes = 4194304);
          }
          else {
            if (!u) if (e = zi(h), e !== null) {
              if (t.flags |= 128, u = true, e = e.updateQueue, t.updateQueue = e, Qi(t, e), ho(i, true), i.tail === null && i.tailMode === "hidden" && !h.alternate && !Ge) return yt(t), null;
            } else 2 * jt() - i.renderingStartTime > ts && a !== 536870912 && (t.flags |= 128, u = true, ho(i, false), t.lanes = 4194304);
            i.isBackwards ? (h.sibling = t.child, t.child = h) : (e = i.last, e !== null ? e.sibling = h : t.child = h, i.last = h);
          }
          return i.tail !== null ? (e = i.tail, i.rendering = e, i.tail = e.sibling, i.renderingStartTime = jt(), e.sibling = null, a = _t.current, O(_t, u ? a & 1 | 2 : a & 1), Ge && hl(t, i.treeForkCount), e) : (yt(t), null);
        case 22:
        case 23:
          return bn(t), au(), i = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== i && (t.flags |= 8192) : i && (t.flags |= 8192), i ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (yt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : yt(t), a = t.updateQueue, a !== null && Qi(t, a.retryQueue), a = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), i = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (i = t.memoizedState.cachePool.pool), i !== a && (t.flags |= 2048), e !== null && D(Lr), null;
        case 24:
          return a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), gl(Rt), yt(t), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(o(156, t.tag));
    }
    function Bx(e, t) {
      switch ($c(t), t.tag) {
        case 1:
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 3:
          return gl(Rt), X(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
        case 26:
        case 27:
        case 5:
          return he(t), null;
        case 31:
          if (t.memoizedState !== null) {
            if (bn(t), t.alternate === null) throw Error(o(340));
            kr();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 13:
          if (bn(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
            if (t.alternate === null) throw Error(o(340));
            kr();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 19:
          return D(_t), null;
        case 4:
          return X(), null;
        case 10:
          return gl(t.type), null;
        case 22:
        case 23:
          return bn(t), au(), e !== null && D(Lr), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 24:
          return gl(Rt), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function kg(e, t) {
      switch ($c(t), t.tag) {
        case 3:
          gl(Rt), X();
          break;
        case 26:
        case 27:
        case 5:
          he(t);
          break;
        case 4:
          X();
          break;
        case 31:
          t.memoizedState !== null && bn(t);
          break;
        case 13:
          bn(t);
          break;
        case 19:
          D(_t);
          break;
        case 10:
          gl(t.type);
          break;
        case 22:
        case 23:
          bn(t), au(), e !== null && D(Lr);
          break;
        case 24:
          gl(Rt);
      }
    }
    function mo(e, t) {
      try {
        var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
        if (i !== null) {
          var u = i.next;
          a = u;
          do {
            if ((a.tag & e) === e) {
              i = void 0;
              var h = a.create, x = a.inst;
              i = h(), x.destroy = i;
            }
            a = a.next;
          } while (a !== u);
        }
      } catch (M) {
        lt(t, t.return, M);
      }
    }
    function Pl(e, t, a) {
      try {
        var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
        if (u !== null) {
          var h = u.next;
          i = h;
          do {
            if ((i.tag & e) === e) {
              var x = i.inst, M = x.destroy;
              if (M !== void 0) {
                x.destroy = void 0, u = t;
                var I = a, G = M;
                try {
                  G();
                } catch (te) {
                  lt(u, I, te);
                }
              }
            }
            i = i.next;
          } while (i !== h);
        }
      } catch (te) {
        lt(t, t.return, te);
      }
    }
    function Mg(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var a = e.stateNode;
        try {
          ym(t, a);
        } catch (i) {
          lt(e, e.return, i);
        }
      }
    }
    function jg(e, t, a) {
      a.props = Or(e.type, e.memoizedProps), a.state = e.memoizedState;
      try {
        a.componentWillUnmount();
      } catch (i) {
        lt(e, t, i);
      }
    }
    function go(e, t) {
      try {
        var a = e.ref;
        if (a !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var i = e.stateNode;
              break;
            case 30:
              i = e.stateNode;
              break;
            default:
              i = e.stateNode;
          }
          typeof a == "function" ? e.refCleanup = a(i) : a.current = i;
        }
      } catch (u) {
        lt(e, t, u);
      }
    }
    function nl(e, t) {
      var a = e.ref, i = e.refCleanup;
      if (a !== null) if (typeof i == "function") try {
        i();
      } catch (u) {
        lt(e, t, u);
      } finally {
        e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
      }
      else if (typeof a == "function") try {
        a(null);
      } catch (u) {
        lt(e, t, u);
      }
      else a.current = null;
    }
    function Lg(e) {
      var t = e.type, a = e.memoizedProps, i = e.stateNode;
      try {
        e: switch (t) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            a.autoFocus && i.focus();
            break e;
          case "img":
            a.src ? i.src = a.src : a.srcSet && (i.srcset = a.srcSet);
        }
      } catch (u) {
        lt(e, e.return, u);
      }
    }
    function zu(e, t, a) {
      try {
        var i = e.stateNode;
        cw(i, e.type, a, t), i[ne] = t;
      } catch (u) {
        lt(e, e.return, u);
      }
    }
    function Rg(e) {
      return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && er(e.type) || e.tag === 4;
    }
    function Hu(e) {
      e: for (; ; ) {
        for (; e.sibling === null; ) {
          if (e.return === null || Rg(e.return)) return null;
          e = e.return;
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
          if (e.tag === 27 && er(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
          e.child.return = e, e = e.child;
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Uu(e, t, a) {
      var i = e.tag;
      if (i === 5 || i === 6) e = e.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(e, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(e), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = ul));
      else if (i !== 4 && (i === 27 && er(e.type) && (a = e.stateNode, t = null), e = e.child, e !== null)) for (Uu(e, t, a), e = e.sibling; e !== null; ) Uu(e, t, a), e = e.sibling;
    }
    function Fi(e, t, a) {
      var i = e.tag;
      if (i === 5 || i === 6) e = e.stateNode, t ? a.insertBefore(e, t) : a.appendChild(e);
      else if (i !== 4 && (i === 27 && er(e.type) && (a = e.stateNode), e = e.child, e !== null)) for (Fi(e, t, a), e = e.sibling; e !== null; ) Fi(e, t, a), e = e.sibling;
    }
    function Ag(e) {
      var t = e.stateNode, a = e.memoizedProps;
      try {
        for (var i = e.type, u = t.attributes; u.length; ) t.removeAttributeNode(u[0]);
        Gt(t, i, a), t[It] = e, t[ne] = a;
      } catch (h) {
        lt(e, e.return, h);
      }
    }
    var xl = false, Nt = false, Yu = false, Tg = typeof WeakSet == "function" ? WeakSet : Set, Yt = null;
    function Xx(e, t) {
      if (e = e.containerInfo, id = bs, e = $h(e), Nc(e)) {
        if ("selectionStart" in e) var a = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
        else e: {
          a = (a = e.ownerDocument) && a.defaultView || window;
          var i = a.getSelection && a.getSelection();
          if (i && i.rangeCount !== 0) {
            a = i.anchorNode;
            var u = i.anchorOffset, h = i.focusNode;
            i = i.focusOffset;
            try {
              a.nodeType, h.nodeType;
            } catch {
              a = null;
              break e;
            }
            var x = 0, M = -1, I = -1, G = 0, te = 0, re = e, K = null;
            t: for (; ; ) {
              for (var W; re !== a || u !== 0 && re.nodeType !== 3 || (M = x + u), re !== h || i !== 0 && re.nodeType !== 3 || (I = x + i), re.nodeType === 3 && (x += re.nodeValue.length), (W = re.firstChild) !== null; ) K = re, re = W;
              for (; ; ) {
                if (re === e) break t;
                if (K === a && ++G === u && (M = x), K === h && ++te === i && (I = x), (W = re.nextSibling) !== null) break;
                re = K, K = re.parentNode;
              }
              re = W;
            }
            a = M === -1 || I === -1 ? null : {
              start: M,
              end: I
            };
          } else a = null;
        }
        a = a || {
          start: 0,
          end: 0
        };
      } else a = null;
      for (sd = {
        focusedElem: e,
        selectionRange: a
      }, bs = false, Yt = t; Yt !== null; ) if (t = Yt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, Yt = e;
      else for (; Yt !== null; ) {
        switch (t = Yt, h = t.alternate, e = t.flags, t.tag) {
          case 0:
            if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null)) for (a = 0; a < e.length; a++) u = e[a], u.ref.impl = u.nextImpl;
            break;
          case 11:
          case 15:
            break;
          case 1:
            if ((e & 1024) !== 0 && h !== null) {
              e = void 0, a = t, u = h.memoizedProps, h = h.memoizedState, i = a.stateNode;
              try {
                var xe = Or(a.type, u);
                e = i.getSnapshotBeforeUpdate(xe, h), i.__reactInternalSnapshotBeforeUpdate = e;
              } catch (Re) {
                lt(a, a.return, Re);
              }
            }
            break;
          case 3:
            if ((e & 1024) !== 0) {
              if (e = t.stateNode.containerInfo, a = e.nodeType, a === 9) dd(e);
              else if (a === 1) switch (e.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  dd(e);
                  break;
                default:
                  e.textContent = "";
              }
            }
            break;
          case 5:
          case 26:
          case 27:
          case 6:
          case 4:
          case 17:
            break;
          default:
            if ((e & 1024) !== 0) throw Error(o(163));
        }
        if (e = t.sibling, e !== null) {
          e.return = t.return, Yt = e;
          break;
        }
        Yt = t.return;
      }
    }
    function Ng(e, t, a) {
      var i = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          Sl(e, a), i & 4 && mo(5, a);
          break;
        case 1:
          if (Sl(e, a), i & 4) if (e = a.stateNode, t === null) try {
            e.componentDidMount();
          } catch (x) {
            lt(a, a.return, x);
          }
          else {
            var u = Or(a.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(u, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (x) {
              lt(a, a.return, x);
            }
          }
          i & 64 && Mg(a), i & 512 && go(a, a.return);
          break;
        case 3:
          if (Sl(e, a), i & 64 && (e = a.updateQueue, e !== null)) {
            if (t = null, a.child !== null) switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
            try {
              ym(e, t);
            } catch (x) {
              lt(a, a.return, x);
            }
          }
          break;
        case 27:
          t === null && i & 4 && Ag(a);
        case 26:
        case 5:
          Sl(e, a), t === null && i & 4 && Lg(a), i & 512 && go(a, a.return);
          break;
        case 12:
          Sl(e, a);
          break;
        case 31:
          Sl(e, a), i & 4 && Ig(e, a);
          break;
        case 13:
          Sl(e, a), i & 4 && zg(e, a), i & 64 && (e = a.memoizedState, e !== null && (e = e.dehydrated, e !== null && (a = Fx.bind(null, a), yw(e, a))));
          break;
        case 22:
          if (i = a.memoizedState !== null || xl, !i) {
            t = t !== null && t.memoizedState !== null || Nt, u = xl;
            var h = Nt;
            xl = i, (Nt = t) && !h ? Cl(e, a, (a.subtreeFlags & 8772) !== 0) : Sl(e, a), xl = u, Nt = h;
          }
          break;
        case 30:
          break;
        default:
          Sl(e, a);
      }
    }
    function Og(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Og(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && st(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
    }
    var vt = null, on = false;
    function wl(e, t, a) {
      for (a = a.child; a !== null; ) Dg(e, t, a), a = a.sibling;
    }
    function Dg(e, t, a) {
      if (Ft && typeof Ft.onCommitFiberUnmount == "function") try {
        Ft.onCommitFiberUnmount(Tl, a);
      } catch {
      }
      switch (a.tag) {
        case 26:
          Nt || nl(a, t), wl(e, t, a), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
          break;
        case 27:
          Nt || nl(a, t);
          var i = vt, u = on;
          er(a.type) && (vt = a.stateNode, on = false), wl(e, t, a), Eo(a.stateNode), vt = i, on = u;
          break;
        case 5:
          Nt || nl(a, t);
        case 6:
          if (i = vt, u = on, vt = null, wl(e, t, a), vt = i, on = u, vt !== null) if (on) try {
            (vt.nodeType === 9 ? vt.body : vt.nodeName === "HTML" ? vt.ownerDocument.body : vt).removeChild(a.stateNode);
          } catch (h) {
            lt(a, t, h);
          }
          else try {
            vt.removeChild(a.stateNode);
          } catch (h) {
            lt(a, t, h);
          }
          break;
        case 18:
          vt !== null && (on ? (e = vt, Mp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, a.stateNode), Ma(e)) : Mp(vt, a.stateNode));
          break;
        case 4:
          i = vt, u = on, vt = a.stateNode.containerInfo, on = true, wl(e, t, a), vt = i, on = u;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          Pl(2, a, t), Nt || Pl(4, a, t), wl(e, t, a);
          break;
        case 1:
          Nt || (nl(a, t), i = a.stateNode, typeof i.componentWillUnmount == "function" && jg(a, t, i)), wl(e, t, a);
          break;
        case 21:
          wl(e, t, a);
          break;
        case 22:
          Nt = (i = Nt) || a.memoizedState !== null, wl(e, t, a), Nt = i;
          break;
        default:
          wl(e, t, a);
      }
    }
    function Ig(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
        e = e.dehydrated;
        try {
          Ma(e);
        } catch (a) {
          lt(t, t.return, a);
        }
      }
    }
    function zg(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
        Ma(e);
      } catch (a) {
        lt(t, t.return, a);
      }
    }
    function Vx(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return t === null && (t = e.stateNode = new Tg()), t;
        case 22:
          return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Tg()), t;
        default:
          throw Error(o(435, e.tag));
      }
    }
    function Wi(e, t) {
      var a = Vx(e);
      t.forEach(function(i) {
        if (!a.has(i)) {
          a.add(i);
          var u = Wx.bind(null, e, i);
          i.then(u, u);
        }
      });
    }
    function sn(e, t) {
      var a = t.deletions;
      if (a !== null) for (var i = 0; i < a.length; i++) {
        var u = a[i], h = e, x = t, M = x;
        e: for (; M !== null; ) {
          switch (M.tag) {
            case 27:
              if (er(M.type)) {
                vt = M.stateNode, on = false;
                break e;
              }
              break;
            case 5:
              vt = M.stateNode, on = false;
              break e;
            case 3:
            case 4:
              vt = M.stateNode.containerInfo, on = true;
              break e;
          }
          M = M.return;
        }
        if (vt === null) throw Error(o(160));
        Dg(h, x, u), vt = null, on = false, h = u.alternate, h !== null && (h.return = null), u.return = null;
      }
      if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) Hg(t, e), t = t.sibling;
    }
    var Yn = null;
    function Hg(e, t) {
      var a = e.alternate, i = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          sn(t, e), cn(e), i & 4 && (Pl(3, e, e.return), mo(3, e), Pl(5, e, e.return));
          break;
        case 1:
          sn(t, e), cn(e), i & 512 && (Nt || a === null || nl(a, a.return)), i & 64 && xl && (e = e.updateQueue, e !== null && (i = e.callbacks, i !== null && (a = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = a === null ? i : a.concat(i))));
          break;
        case 26:
          var u = Yn;
          if (sn(t, e), cn(e), i & 512 && (Nt || a === null || nl(a, a.return)), i & 4) {
            var h = a !== null ? a.memoizedState : null;
            if (i = e.memoizedState, a === null) if (i === null) if (e.stateNode === null) {
              e: {
                i = e.type, a = e.memoizedProps, u = u.ownerDocument || u;
                t: switch (i) {
                  case "title":
                    h = u.getElementsByTagName("title")[0], (!h || h[Je] || h[It] || h.namespaceURI === "http://www.w3.org/2000/svg" || h.hasAttribute("itemprop")) && (h = u.createElement(i), u.head.insertBefore(h, u.querySelector("head > title"))), Gt(h, i, a), h[It] = e, tt(h), i = h;
                    break e;
                  case "link":
                    var x = Hp("link", "href", u).get(i + (a.href || ""));
                    if (x) {
                      for (var M = 0; M < x.length; M++) if (h = x[M], h.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && h.getAttribute("rel") === (a.rel == null ? null : a.rel) && h.getAttribute("title") === (a.title == null ? null : a.title) && h.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                        x.splice(M, 1);
                        break t;
                      }
                    }
                    h = u.createElement(i), Gt(h, i, a), u.head.appendChild(h);
                    break;
                  case "meta":
                    if (x = Hp("meta", "content", u).get(i + (a.content || ""))) {
                      for (M = 0; M < x.length; M++) if (h = x[M], h.getAttribute("content") === (a.content == null ? null : "" + a.content) && h.getAttribute("name") === (a.name == null ? null : a.name) && h.getAttribute("property") === (a.property == null ? null : a.property) && h.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && h.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                        x.splice(M, 1);
                        break t;
                      }
                    }
                    h = u.createElement(i), Gt(h, i, a), u.head.appendChild(h);
                    break;
                  default:
                    throw Error(o(468, i));
                }
                h[It] = e, tt(h), i = h;
              }
              e.stateNode = i;
            } else Up(u, e.type, e.stateNode);
            else e.stateNode = zp(u, i, e.memoizedProps);
            else h !== i ? (h === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : h.count--, i === null ? Up(u, e.type, e.stateNode) : zp(u, i, e.memoizedProps)) : i === null && e.stateNode !== null && zu(e, e.memoizedProps, a.memoizedProps);
          }
          break;
        case 27:
          sn(t, e), cn(e), i & 512 && (Nt || a === null || nl(a, a.return)), a !== null && i & 4 && zu(e, e.memoizedProps, a.memoizedProps);
          break;
        case 5:
          if (sn(t, e), cn(e), i & 512 && (Nt || a === null || nl(a, a.return)), e.flags & 32) {
            u = e.stateNode;
            try {
              Qr(u, "");
            } catch (xe) {
              lt(e, e.return, xe);
            }
          }
          i & 4 && e.stateNode != null && (u = e.memoizedProps, zu(e, u, a !== null ? a.memoizedProps : u)), i & 1024 && (Yu = true);
          break;
        case 6:
          if (sn(t, e), cn(e), i & 4) {
            if (e.stateNode === null) throw Error(o(162));
            i = e.memoizedProps, a = e.stateNode;
            try {
              a.nodeValue = i;
            } catch (xe) {
              lt(e, e.return, xe);
            }
          }
          break;
        case 3:
          if (ms = null, u = Yn, Yn = fs(t.containerInfo), sn(t, e), Yn = u, cn(e), i & 4 && a !== null && a.memoizedState.isDehydrated) try {
            Ma(t.containerInfo);
          } catch (xe) {
            lt(e, e.return, xe);
          }
          Yu && (Yu = false, Ug(e));
          break;
        case 4:
          i = Yn, Yn = fs(e.stateNode.containerInfo), sn(t, e), cn(e), Yn = i;
          break;
        case 12:
          sn(t, e), cn(e);
          break;
        case 31:
          sn(t, e), cn(e), i & 4 && (i = e.updateQueue, i !== null && (e.updateQueue = null, Wi(e, i)));
          break;
        case 13:
          sn(t, e), cn(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (es = jt()), i & 4 && (i = e.updateQueue, i !== null && (e.updateQueue = null, Wi(e, i)));
          break;
        case 22:
          u = e.memoizedState !== null;
          var I = a !== null && a.memoizedState !== null, G = xl, te = Nt;
          if (xl = G || u, Nt = te || I, sn(t, e), Nt = te, xl = G, cn(e), i & 8192) e: for (t = e.stateNode, t._visibility = u ? t._visibility & -2 : t._visibility | 1, u && (a === null || I || xl || Nt || Dr(e)), a = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                I = a = t;
                try {
                  if (h = I.stateNode, u) x = h.style, typeof x.setProperty == "function" ? x.setProperty("display", "none", "important") : x.display = "none";
                  else {
                    M = I.stateNode;
                    var re = I.memoizedProps.style, K = re != null && re.hasOwnProperty("display") ? re.display : null;
                    M.style.display = K == null || typeof K == "boolean" ? "" : ("" + K).trim();
                  }
                } catch (xe) {
                  lt(I, I.return, xe);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                I = t;
                try {
                  I.stateNode.nodeValue = u ? "" : I.memoizedProps;
                } catch (xe) {
                  lt(I, I.return, xe);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                I = t;
                try {
                  var W = I.stateNode;
                  u ? jp(W, true) : jp(I.stateNode, false);
                } catch (xe) {
                  lt(I, I.return, xe);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              a === t && (a = null), t = t.return;
            }
            a === t && (a = null), t.sibling.return = t.return, t = t.sibling;
          }
          i & 4 && (i = e.updateQueue, i !== null && (a = i.retryQueue, a !== null && (i.retryQueue = null, Wi(e, a))));
          break;
        case 19:
          sn(t, e), cn(e), i & 4 && (i = e.updateQueue, i !== null && (e.updateQueue = null, Wi(e, i)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          sn(t, e), cn(e);
      }
    }
    function cn(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var a, i = e.return; i !== null; ) {
            if (Rg(i)) {
              a = i;
              break;
            }
            i = i.return;
          }
          if (a == null) throw Error(o(160));
          switch (a.tag) {
            case 27:
              var u = a.stateNode, h = Hu(e);
              Fi(e, h, u);
              break;
            case 5:
              var x = a.stateNode;
              a.flags & 32 && (Qr(x, ""), a.flags &= -33);
              var M = Hu(e);
              Fi(e, M, x);
              break;
            case 3:
            case 4:
              var I = a.stateNode.containerInfo, G = Hu(e);
              Uu(e, G, I);
              break;
            default:
              throw Error(o(161));
          }
        } catch (te) {
          lt(e, e.return, te);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function Ug(e) {
      if (e.subtreeFlags & 1024) for (e = e.child; e !== null; ) {
        var t = e;
        Ug(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
    }
    function Sl(e, t) {
      if (t.subtreeFlags & 8772) for (t = t.child; t !== null; ) Ng(e, t.alternate, t), t = t.sibling;
    }
    function Dr(e) {
      for (e = e.child; e !== null; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            Pl(4, t, t.return), Dr(t);
            break;
          case 1:
            nl(t, t.return);
            var a = t.stateNode;
            typeof a.componentWillUnmount == "function" && jg(t, t.return, a), Dr(t);
            break;
          case 27:
            Eo(t.stateNode);
          case 26:
          case 5:
            nl(t, t.return), Dr(t);
            break;
          case 22:
            t.memoizedState === null && Dr(t);
            break;
          case 30:
            Dr(t);
            break;
          default:
            Dr(t);
        }
        e = e.sibling;
      }
    }
    function Cl(e, t, a) {
      for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
        var i = t.alternate, u = e, h = t, x = h.flags;
        switch (h.tag) {
          case 0:
          case 11:
          case 15:
            Cl(u, h, a), mo(4, h);
            break;
          case 1:
            if (Cl(u, h, a), i = h, u = i.stateNode, typeof u.componentDidMount == "function") try {
              u.componentDidMount();
            } catch (G) {
              lt(i, i.return, G);
            }
            if (i = h, u = i.updateQueue, u !== null) {
              var M = i.stateNode;
              try {
                var I = u.shared.hiddenCallbacks;
                if (I !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < I.length; u++) pm(I[u], M);
              } catch (G) {
                lt(i, i.return, G);
              }
            }
            a && x & 64 && Mg(h), go(h, h.return);
            break;
          case 27:
            Ag(h);
          case 26:
          case 5:
            Cl(u, h, a), a && i === null && x & 4 && Lg(h), go(h, h.return);
            break;
          case 12:
            Cl(u, h, a);
            break;
          case 31:
            Cl(u, h, a), a && x & 4 && Ig(u, h);
            break;
          case 13:
            Cl(u, h, a), a && x & 4 && zg(u, h);
            break;
          case 22:
            h.memoizedState === null && Cl(u, h, a), go(h, h.return);
            break;
          case 30:
            break;
          default:
            Cl(u, h, a);
        }
        t = t.sibling;
      }
    }
    function Bu(e, t) {
      var a = null;
      e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (e != null && e.refCount++, a != null && eo(a));
    }
    function Xu(e, t) {
      e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && eo(e));
    }
    function Bn(e, t, a, i) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) Yg(e, t, a, i), t = t.sibling;
    }
    function Yg(e, t, a, i) {
      var u = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Bn(e, t, a, i), u & 2048 && mo(9, t);
          break;
        case 1:
          Bn(e, t, a, i);
          break;
        case 3:
          Bn(e, t, a, i), u & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && eo(e)));
          break;
        case 12:
          if (u & 2048) {
            Bn(e, t, a, i), e = t.stateNode;
            try {
              var h = t.memoizedProps, x = h.id, M = h.onPostCommit;
              typeof M == "function" && M(x, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
            } catch (I) {
              lt(t, t.return, I);
            }
          } else Bn(e, t, a, i);
          break;
        case 31:
          Bn(e, t, a, i);
          break;
        case 13:
          Bn(e, t, a, i);
          break;
        case 23:
          break;
        case 22:
          h = t.stateNode, x = t.alternate, t.memoizedState !== null ? h._visibility & 2 ? Bn(e, t, a, i) : po(e, t) : h._visibility & 2 ? Bn(e, t, a, i) : (h._visibility |= 2, pa(e, t, a, i, (t.subtreeFlags & 10256) !== 0 || false)), u & 2048 && Bu(x, t);
          break;
        case 24:
          Bn(e, t, a, i), u & 2048 && Xu(t.alternate, t);
          break;
        default:
          Bn(e, t, a, i);
      }
    }
    function pa(e, t, a, i, u) {
      for (u = u && ((t.subtreeFlags & 10256) !== 0 || false), t = t.child; t !== null; ) {
        var h = e, x = t, M = a, I = i, G = x.flags;
        switch (x.tag) {
          case 0:
          case 11:
          case 15:
            pa(h, x, M, I, u), mo(8, x);
            break;
          case 23:
            break;
          case 22:
            var te = x.stateNode;
            x.memoizedState !== null ? te._visibility & 2 ? pa(h, x, M, I, u) : po(h, x) : (te._visibility |= 2, pa(h, x, M, I, u)), u && G & 2048 && Bu(x.alternate, x);
            break;
          case 24:
            pa(h, x, M, I, u), u && G & 2048 && Xu(x.alternate, x);
            break;
          default:
            pa(h, x, M, I, u);
        }
        t = t.sibling;
      }
    }
    function po(e, t) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) {
        var a = e, i = t, u = i.flags;
        switch (i.tag) {
          case 22:
            po(a, i), u & 2048 && Bu(i.alternate, i);
            break;
          case 24:
            po(a, i), u & 2048 && Xu(i.alternate, i);
            break;
          default:
            po(a, i);
        }
        t = t.sibling;
      }
    }
    var yo = 8192;
    function ya(e, t, a) {
      if (e.subtreeFlags & yo) for (e = e.child; e !== null; ) Bg(e, t, a), e = e.sibling;
    }
    function Bg(e, t, a) {
      switch (e.tag) {
        case 26:
          ya(e, t, a), e.flags & yo && e.memoizedState !== null && Lw(a, Yn, e.memoizedState, e.memoizedProps);
          break;
        case 5:
          ya(e, t, a);
          break;
        case 3:
        case 4:
          var i = Yn;
          Yn = fs(e.stateNode.containerInfo), ya(e, t, a), Yn = i;
          break;
        case 22:
          e.memoizedState === null && (i = e.alternate, i !== null && i.memoizedState !== null ? (i = yo, yo = 16777216, ya(e, t, a), yo = i) : ya(e, t, a));
          break;
        default:
          ya(e, t, a);
      }
    }
    function Xg(e) {
      var t = e.alternate;
      if (t !== null && (e = t.child, e !== null)) {
        t.child = null;
        do
          t = e.sibling, e.sibling = null, e = t;
        while (e !== null);
      }
    }
    function bo(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var a = 0; a < t.length; a++) {
          var i = t[a];
          Yt = i, $g(i, e);
        }
        Xg(e);
      }
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) Vg(e), e = e.sibling;
    }
    function Vg(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          bo(e), e.flags & 2048 && Pl(9, e, e.return);
          break;
        case 3:
          bo(e);
          break;
        case 12:
          bo(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ji(e)) : bo(e);
          break;
        default:
          bo(e);
      }
    }
    function Ji(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var a = 0; a < t.length; a++) {
          var i = t[a];
          Yt = i, $g(i, e);
        }
        Xg(e);
      }
      for (e = e.child; e !== null; ) {
        switch (t = e, t.tag) {
          case 0:
          case 11:
          case 15:
            Pl(8, t, t.return), Ji(t);
            break;
          case 22:
            a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, Ji(t));
            break;
          default:
            Ji(t);
        }
        e = e.sibling;
      }
    }
    function $g(e, t) {
      for (; Yt !== null; ) {
        var a = Yt;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            Pl(8, a, t);
            break;
          case 23:
          case 22:
            if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
              var i = a.memoizedState.cachePool.pool;
              i != null && i.refCount++;
            }
            break;
          case 24:
            eo(a.memoizedState.cache);
        }
        if (i = a.child, i !== null) i.return = a, Yt = i;
        else e: for (a = e; Yt !== null; ) {
          i = Yt;
          var u = i.sibling, h = i.return;
          if (Og(i), i === a) {
            Yt = null;
            break e;
          }
          if (u !== null) {
            u.return = h, Yt = u;
            break e;
          }
          Yt = h;
        }
      }
    }
    var $x = {
      getCacheForType: function(e) {
        var t = $t(Rt), a = t.data.get(e);
        return a === void 0 && (a = e(), t.data.set(e, a)), a;
      },
      cacheSignal: function() {
        return $t(Rt).controller.signal;
      }
    }, qx = typeof WeakMap == "function" ? WeakMap : Map, We = 0, ct = null, Ye = null, $e = 0, nt = 0, vn = null, Zl = false, ba = false, Vu = false, El = 0, Ct = 0, Kl = 0, Ir = 0, $u = 0, xn = 0, va = 0, vo = null, un = null, qu = false, es = 0, qg = 0, ts = 1 / 0, ns = null, Ql = null, zt = 0, Fl = null, xa = null, _l = 0, Gu = 0, Pu = null, Gg = null, xo = 0, Zu = null;
    function wn() {
      return (We & 2) !== 0 && $e !== 0 ? $e & -$e : $.T !== null ? ed() : Qn();
    }
    function Pg() {
      if (xn === 0) if (($e & 536870912) === 0 || Ge) {
        var e = $r;
        $r <<= 1, ($r & 3932160) === 0 && ($r = 262144), xn = e;
      } else xn = 536870912;
      return e = yn.current, e !== null && (e.flags |= 32), xn;
    }
    function dn(e, t, a) {
      (e === ct && (nt === 2 || nt === 9) || e.cancelPendingCommit !== null) && (wa(e, 0), Wl(e, $e, xn, false)), br(e, a), ((We & 2) === 0 || e !== ct) && (e === ct && ((We & 2) === 0 && (Ir |= a), Ct === 4 && Wl(e, $e, xn, false)), ll(e));
    }
    function Zg(e, t, a) {
      if ((We & 6) !== 0) throw Error(o(327));
      var i = !a && (t & 127) === 0 && (t & e.expiredLanes) === 0 || sl(e, t), u = i ? Zx(e, t) : Qu(e, t, true), h = i;
      do {
        if (u === 0) {
          ba && !i && Wl(e, t, 0, false);
          break;
        } else {
          if (a = e.current.alternate, h && !Gx(a)) {
            u = Qu(e, t, false), h = false;
            continue;
          }
          if (u === 2) {
            if (h = t, e.errorRecoveryDisabledLanes & h) var x = 0;
            else x = e.pendingLanes & -536870913, x = x !== 0 ? x : x & 536870912 ? 536870912 : 0;
            if (x !== 0) {
              t = x;
              e: {
                var M = e;
                u = vo;
                var I = M.current.memoizedState.isDehydrated;
                if (I && (wa(M, x).flags |= 256), x = Qu(M, x, false), x !== 2) {
                  if (Vu && !I) {
                    M.errorRecoveryDisabledLanes |= h, Ir |= h, u = 4;
                    break e;
                  }
                  h = un, un = u, h !== null && (un === null ? un = h : un.push.apply(un, h));
                }
                u = x;
              }
              if (h = false, u !== 2) continue;
            }
          }
          if (u === 1) {
            wa(e, 0), Wl(e, t, 0, true);
            break;
          }
          e: {
            switch (i = e, h = u, h) {
              case 0:
              case 1:
                throw Error(o(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                Wl(i, t, xn, !Zl);
                break e;
              case 2:
                un = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(o(329));
            }
            if ((t & 62914560) === t && (u = es + 300 - jt(), 10 < u)) {
              if (Wl(i, t, xn, !Zl), Nl(i, 0, true) !== 0) break e;
              _l = t, i.timeoutHandle = _p(Kg.bind(null, i, a, un, ns, qu, t, xn, Ir, va, Zl, h, "Throttled", -0, 0), u);
              break e;
            }
            Kg(i, a, un, ns, qu, t, xn, Ir, va, Zl, h, null, -0, 0);
          }
        }
        break;
      } while (true);
      ll(e);
    }
    function Kg(e, t, a, i, u, h, x, M, I, G, te, re, K, W) {
      if (e.timeoutHandle = -1, re = t.subtreeFlags, re & 8192 || (re & 16785408) === 16785408) {
        re = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: true,
          waitingForViewTransition: false,
          unsuspend: ul
        }, Bg(t, h, re);
        var xe = (h & 62914560) === h ? es - jt() : (h & 4194048) === h ? qg - jt() : 0;
        if (xe = Rw(re, xe), xe !== null) {
          _l = h, e.cancelPendingCommit = xe(lp.bind(null, e, t, h, a, i, u, x, M, I, te, re, null, K, W)), Wl(e, h, x, !G);
          return;
        }
      }
      lp(e, t, h, a, i, u, x, M, I);
    }
    function Gx(e) {
      for (var t = e; ; ) {
        var a = t.tag;
        if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null))) for (var i = 0; i < a.length; i++) {
          var u = a[i], h = u.getSnapshot;
          u = u.value;
          try {
            if (!gn(h(), u)) return false;
          } catch {
            return false;
          }
        }
        if (a = t.child, t.subtreeFlags & 16384 && a !== null) a.return = t, t = a;
        else {
          if (t === e) break;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) return true;
            t = t.return;
          }
          t.sibling.return = t.return, t = t.sibling;
        }
      }
      return true;
    }
    function Wl(e, t, a, i) {
      t &= ~$u, t &= ~Ir, e.suspendedLanes |= t, e.pingedLanes &= ~t, i && (e.warmLanes |= t), i = e.expirationTimes;
      for (var u = t; 0 < u; ) {
        var h = 31 - Wt(u), x = 1 << h;
        i[h] = -1, u &= ~x;
      }
      a !== 0 && di(e, a, t);
    }
    function ls() {
      return (We & 6) === 0 ? (wo(0), false) : true;
    }
    function Ku() {
      if (Ye !== null) {
        if (nt === 0) var e = Ye.return;
        else e = Ye, ml = Mr = null, du(e), da = null, no = 0, e = Ye;
        for (; e !== null; ) kg(e.alternate, e), e = e.return;
        Ye = null;
      }
    }
    function wa(e, t) {
      var a = e.timeoutHandle;
      a !== -1 && (e.timeoutHandle = -1, fw(a)), a = e.cancelPendingCommit, a !== null && (e.cancelPendingCommit = null, a()), _l = 0, Ku(), ct = e, Ye = a = fl(e.current, null), $e = t, nt = 0, vn = null, Zl = false, ba = sl(e, t), Vu = false, va = xn = $u = Ir = Kl = Ct = 0, un = vo = null, qu = false, (t & 8) !== 0 && (t |= t & 32);
      var i = e.entangledLanes;
      if (i !== 0) for (e = e.entanglements, i &= t; 0 < i; ) {
        var u = 31 - Wt(i), h = 1 << u;
        t |= e[u], i &= ~h;
      }
      return El = t, Ei(), a;
    }
    function Qg(e, t) {
      De = null, $.H = uo, t === ua || t === Ti ? (t = fm(), nt = 3) : t === Jc ? (t = fm(), nt = 4) : nt = t === Mu ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, vn = t, Ye === null && (Ct = 1, Gi(e, Mn(t, e.current)));
    }
    function Fg() {
      var e = yn.current;
      return e === null ? true : ($e & 4194048) === $e ? An === null : ($e & 62914560) === $e || ($e & 536870912) !== 0 ? e === An : false;
    }
    function Wg() {
      var e = $.H;
      return $.H = uo, e === null ? uo : e;
    }
    function Jg() {
      var e = $.A;
      return $.A = $x, e;
    }
    function rs() {
      Ct = 4, Zl || ($e & 4194048) !== $e && yn.current !== null || (ba = true), (Kl & 134217727) === 0 && (Ir & 134217727) === 0 || ct === null || Wl(ct, $e, xn, false);
    }
    function Qu(e, t, a) {
      var i = We;
      We |= 2;
      var u = Wg(), h = Jg();
      (ct !== e || $e !== t) && (ns = null, wa(e, t)), t = false;
      var x = Ct;
      e: do
        try {
          if (nt !== 0 && Ye !== null) {
            var M = Ye, I = vn;
            switch (nt) {
              case 8:
                Ku(), x = 6;
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                yn.current === null && (t = true);
                var G = nt;
                if (nt = 0, vn = null, Sa(e, M, I, G), a && ba) {
                  x = 0;
                  break e;
                }
                break;
              default:
                G = nt, nt = 0, vn = null, Sa(e, M, I, G);
            }
          }
          Px(), x = Ct;
          break;
        } catch (te) {
          Qg(e, te);
        }
      while (true);
      return t && e.shellSuspendCounter++, ml = Mr = null, We = i, $.H = u, $.A = h, Ye === null && (ct = null, $e = 0, Ei()), x;
    }
    function Px() {
      for (; Ye !== null; ) ep(Ye);
    }
    function Zx(e, t) {
      var a = We;
      We |= 2;
      var i = Wg(), u = Jg();
      ct !== e || $e !== t ? (ns = null, ts = jt() + 500, wa(e, t)) : ba = sl(e, t);
      e: do
        try {
          if (nt !== 0 && Ye !== null) {
            t = Ye;
            var h = vn;
            t: switch (nt) {
              case 1:
                nt = 0, vn = null, Sa(e, t, h, 1);
                break;
              case 2:
              case 9:
                if (um(h)) {
                  nt = 0, vn = null, tp(t);
                  break;
                }
                t = function() {
                  nt !== 2 && nt !== 9 || ct !== e || (nt = 7), ll(e);
                }, h.then(t, t);
                break e;
              case 3:
                nt = 7;
                break e;
              case 4:
                nt = 5;
                break e;
              case 7:
                um(h) ? (nt = 0, vn = null, tp(t)) : (nt = 0, vn = null, Sa(e, t, h, 7));
                break;
              case 5:
                var x = null;
                switch (Ye.tag) {
                  case 26:
                    x = Ye.memoizedState;
                  case 5:
                  case 27:
                    var M = Ye;
                    if (x ? Yp(x) : M.stateNode.complete) {
                      nt = 0, vn = null;
                      var I = M.sibling;
                      if (I !== null) Ye = I;
                      else {
                        var G = M.return;
                        G !== null ? (Ye = G, as(G)) : Ye = null;
                      }
                      break t;
                    }
                }
                nt = 0, vn = null, Sa(e, t, h, 5);
                break;
              case 6:
                nt = 0, vn = null, Sa(e, t, h, 6);
                break;
              case 8:
                Ku(), Ct = 6;
                break e;
              default:
                throw Error(o(462));
            }
          }
          Kx();
          break;
        } catch (te) {
          Qg(e, te);
        }
      while (true);
      return ml = Mr = null, $.H = i, $.A = u, We = a, Ye !== null ? 0 : (ct = null, $e = 0, Ei(), Ct);
    }
    function Kx() {
      for (; Ye !== null && !ln(); ) ep(Ye);
    }
    function ep(e) {
      var t = Eg(e.alternate, e, El);
      e.memoizedProps = e.pendingProps, t === null ? as(e) : Ye = t;
    }
    function tp(e) {
      var t = e, a = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = bg(a, t, t.pendingProps, t.type, void 0, $e);
          break;
        case 11:
          t = bg(a, t, t.pendingProps, t.type.render, t.ref, $e);
          break;
        case 5:
          du(t);
        default:
          kg(a, t), t = Ye = Jh(t, El), t = Eg(a, t, El);
      }
      e.memoizedProps = e.pendingProps, t === null ? as(e) : Ye = t;
    }
    function Sa(e, t, a, i) {
      ml = Mr = null, du(t), da = null, no = 0;
      var u = t.return;
      try {
        if (zx(e, u, t, a, $e)) {
          Ct = 1, Gi(e, Mn(a, e.current)), Ye = null;
          return;
        }
      } catch (h) {
        if (u !== null) throw Ye = u, h;
        Ct = 1, Gi(e, Mn(a, e.current)), Ye = null;
        return;
      }
      t.flags & 32768 ? (Ge || i === 1 ? e = true : ba || ($e & 536870912) !== 0 ? e = false : (Zl = e = true, (i === 2 || i === 9 || i === 3 || i === 6) && (i = yn.current, i !== null && i.tag === 13 && (i.flags |= 16384))), np(t, e)) : as(t);
    }
    function as(e) {
      var t = e;
      do {
        if ((t.flags & 32768) !== 0) {
          np(t, Zl);
          return;
        }
        e = t.return;
        var a = Yx(t.alternate, t, El);
        if (a !== null) {
          Ye = a;
          return;
        }
        if (t = t.sibling, t !== null) {
          Ye = t;
          return;
        }
        Ye = t = e;
      } while (t !== null);
      Ct === 0 && (Ct = 5);
    }
    function np(e, t) {
      do {
        var a = Bx(e.alternate, e);
        if (a !== null) {
          a.flags &= 32767, Ye = a;
          return;
        }
        if (a = e.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (e = e.sibling, e !== null)) {
          Ye = e;
          return;
        }
        Ye = e = a;
      } while (e !== null);
      Ct = 6, Ye = null;
    }
    function lp(e, t, a, i, u, h, x, M, I) {
      e.cancelPendingCommit = null;
      do
        os();
      while (zt !== 0);
      if ((We & 6) !== 0) throw Error(o(327));
      if (t !== null) {
        if (t === e.current) throw Error(o(177));
        if (h = t.lanes | t.childLanes, h |= Hc, Zn(e, a, h, x, M, I), e === ct && (Ye = ct = null, $e = 0), xa = t, Fl = e, _l = a, Gu = h, Pu = u, Gg = i, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Jx(Vr, function() {
          return sp(), null;
        })) : (e.callbackNode = null, e.callbackPriority = 0), i = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || i) {
          i = $.T, $.T = null, u = F.p, F.p = 2, x = We, We |= 4;
          try {
            Xx(e, t, a);
          } finally {
            We = x, F.p = u, $.T = i;
          }
        }
        zt = 1, rp(), ap(), op();
      }
    }
    function rp() {
      if (zt === 1) {
        zt = 0;
        var e = Fl, t = xa, a = (t.flags & 13878) !== 0;
        if ((t.subtreeFlags & 13878) !== 0 || a) {
          a = $.T, $.T = null;
          var i = F.p;
          F.p = 2;
          var u = We;
          We |= 4;
          try {
            Hg(t, e);
            var h = sd, x = $h(e.containerInfo), M = h.focusedElem, I = h.selectionRange;
            if (x !== M && M && M.ownerDocument && Vh(M.ownerDocument.documentElement, M)) {
              if (I !== null && Nc(M)) {
                var G = I.start, te = I.end;
                if (te === void 0 && (te = G), "selectionStart" in M) M.selectionStart = G, M.selectionEnd = Math.min(te, M.value.length);
                else {
                  var re = M.ownerDocument || document, K = re && re.defaultView || window;
                  if (K.getSelection) {
                    var W = K.getSelection(), xe = M.textContent.length, Re = Math.min(I.start, xe), it = I.end === void 0 ? Re : Math.min(I.end, xe);
                    !W.extend && Re > it && (x = it, it = Re, Re = x);
                    var V = Xh(M, Re), U = Xh(M, it);
                    if (V && U && (W.rangeCount !== 1 || W.anchorNode !== V.node || W.anchorOffset !== V.offset || W.focusNode !== U.node || W.focusOffset !== U.offset)) {
                      var q = re.createRange();
                      q.setStart(V.node, V.offset), W.removeAllRanges(), Re > it ? (W.addRange(q), W.extend(U.node, U.offset)) : (q.setEnd(U.node, U.offset), W.addRange(q));
                    }
                  }
                }
              }
              for (re = [], W = M; W = W.parentNode; ) W.nodeType === 1 && re.push({
                element: W,
                left: W.scrollLeft,
                top: W.scrollTop
              });
              for (typeof M.focus == "function" && M.focus(), M = 0; M < re.length; M++) {
                var le = re[M];
                le.element.scrollLeft = le.left, le.element.scrollTop = le.top;
              }
            }
            bs = !!id, sd = id = null;
          } finally {
            We = u, F.p = i, $.T = a;
          }
        }
        e.current = t, zt = 2;
      }
    }
    function ap() {
      if (zt === 2) {
        zt = 0;
        var e = Fl, t = xa, a = (t.flags & 8772) !== 0;
        if ((t.subtreeFlags & 8772) !== 0 || a) {
          a = $.T, $.T = null;
          var i = F.p;
          F.p = 2;
          var u = We;
          We |= 4;
          try {
            Ng(e, t.alternate, t);
          } finally {
            We = u, F.p = i, $.T = a;
          }
        }
        zt = 3;
      }
    }
    function op() {
      if (zt === 4 || zt === 3) {
        zt = 0, hn();
        var e = Fl, t = xa, a = _l, i = Gg;
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? zt = 5 : (zt = 0, xa = Fl = null, ip(e, e.pendingLanes));
        var u = e.pendingLanes;
        if (u === 0 && (Ql = null), Ba(a), t = t.stateNode, Ft && typeof Ft.onCommitFiberRoot == "function") try {
          Ft.onCommitFiberRoot(Tl, t, void 0, (t.current.flags & 128) === 128);
        } catch {
        }
        if (i !== null) {
          t = $.T, u = F.p, F.p = 2, $.T = null;
          try {
            for (var h = e.onRecoverableError, x = 0; x < i.length; x++) {
              var M = i[x];
              h(M.value, {
                componentStack: M.stack
              });
            }
          } finally {
            $.T = t, F.p = u;
          }
        }
        (_l & 3) !== 0 && os(), ll(e), u = e.pendingLanes, (a & 261930) !== 0 && (u & 42) !== 0 ? e === Zu ? xo++ : (xo = 0, Zu = e) : xo = 0, wo(0);
      }
    }
    function ip(e, t) {
      (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, eo(t)));
    }
    function os() {
      return rp(), ap(), op(), sp();
    }
    function sp() {
      if (zt !== 5) return false;
      var e = Fl, t = Gu;
      Gu = 0;
      var a = Ba(_l), i = $.T, u = F.p;
      try {
        F.p = 32 > a ? 32 : a, $.T = null, a = Pu, Pu = null;
        var h = Fl, x = _l;
        if (zt = 0, xa = Fl = null, _l = 0, (We & 6) !== 0) throw Error(o(331));
        var M = We;
        if (We |= 4, Vg(h.current), Yg(h, h.current, x, a), We = M, wo(0, false), Ft && typeof Ft.onPostCommitFiberRoot == "function") try {
          Ft.onPostCommitFiberRoot(Tl, h);
        } catch {
        }
        return true;
      } finally {
        F.p = u, $.T = i, ip(e, t);
      }
    }
    function cp(e, t, a) {
      t = Mn(a, t), t = ku(e.stateNode, t, 2), e = $l(e, t, 2), e !== null && (br(e, 2), ll(e));
    }
    function lt(e, t, a) {
      if (e.tag === 3) cp(e, e, a);
      else for (; t !== null; ) {
        if (t.tag === 3) {
          cp(t, e, a);
          break;
        } else if (t.tag === 1) {
          var i = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof i.componentDidCatch == "function" && (Ql === null || !Ql.has(i))) {
            e = Mn(a, e), a = ug(2), i = $l(t, a, 2), i !== null && (dg(a, i, t, e), br(i, 2), ll(i));
            break;
          }
        }
        t = t.return;
      }
    }
    function Fu(e, t, a) {
      var i = e.pingCache;
      if (i === null) {
        i = e.pingCache = new qx();
        var u = /* @__PURE__ */ new Set();
        i.set(t, u);
      } else u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u));
      u.has(a) || (Vu = true, u.add(a), e = Qx.bind(null, e, t, a), t.then(e, e));
    }
    function Qx(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t), e.pingedLanes |= e.suspendedLanes & a, e.warmLanes &= ~a, ct === e && ($e & a) === a && (Ct === 4 || Ct === 3 && ($e & 62914560) === $e && 300 > jt() - es ? (We & 2) === 0 && wa(e, 0) : $u |= a, va === $e && (va = 0)), ll(e);
    }
    function up(e, t) {
      t === 0 && (t = Gr()), e = Er(e, t), e !== null && (br(e, t), ll(e));
    }
    function Fx(e) {
      var t = e.memoizedState, a = 0;
      t !== null && (a = t.retryLane), up(e, a);
    }
    function Wx(e, t) {
      var a = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var i = e.stateNode, u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case 19:
          i = e.stateNode;
          break;
        case 22:
          i = e.stateNode._retryCache;
          break;
        default:
          throw Error(o(314));
      }
      i !== null && i.delete(t), up(e, a);
    }
    function Jx(e, t) {
      return wt(e, t);
    }
    var is = null, Ca = null, Wu = false, ss = false, Ju = false, Jl = 0;
    function ll(e) {
      e !== Ca && e.next === null && (Ca === null ? is = Ca = e : Ca = Ca.next = e), ss = true, Wu || (Wu = true, tw());
    }
    function wo(e, t) {
      if (!Ju && ss) {
        Ju = true;
        do
          for (var a = false, i = is; i !== null; ) {
            if (e !== 0) {
              var u = i.pendingLanes;
              if (u === 0) var h = 0;
              else {
                var x = i.suspendedLanes, M = i.pingedLanes;
                h = (1 << 31 - Wt(42 | e) + 1) - 1, h &= u & ~(x & ~M), h = h & 201326741 ? h & 201326741 | 1 : h ? h | 2 : 0;
              }
              h !== 0 && (a = true, mp(i, h));
            } else h = $e, h = Nl(i, i === ct ? h : 0, i.cancelPendingCommit !== null || i.timeoutHandle !== -1), (h & 3) === 0 || sl(i, h) || (a = true, mp(i, h));
            i = i.next;
          }
        while (a);
        Ju = false;
      }
    }
    function ew() {
      dp();
    }
    function dp() {
      ss = Wu = false;
      var e = 0;
      Jl !== 0 && dw() && (e = Jl);
      for (var t = jt(), a = null, i = is; i !== null; ) {
        var u = i.next, h = fp(i, t);
        h === 0 ? (i.next = null, a === null ? is = u : a.next = u, u === null && (Ca = a)) : (a = i, (e !== 0 || (h & 3) !== 0) && (ss = true)), i = u;
      }
      zt !== 0 && zt !== 5 || wo(e), Jl !== 0 && (Jl = 0);
    }
    function fp(e, t) {
      for (var a = e.suspendedLanes, i = e.pingedLanes, u = e.expirationTimes, h = e.pendingLanes & -62914561; 0 < h; ) {
        var x = 31 - Wt(h), M = 1 << x, I = u[x];
        I === -1 ? ((M & a) === 0 || (M & i) !== 0) && (u[x] = ui(M, t)) : I <= t && (e.expiredLanes |= M), h &= ~M;
      }
      if (t = ct, a = $e, a = Nl(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), i = e.callbackNode, a === 0 || e === t && (nt === 2 || nt === 9) || e.cancelPendingCommit !== null) return i !== null && i !== null && mt(i), e.callbackNode = null, e.callbackPriority = 0;
      if ((a & 3) === 0 || sl(e, a)) {
        if (t = a & -a, t === e.callbackPriority) return t;
        switch (i !== null && mt(i), Ba(a)) {
          case 2:
          case 8:
            a = Al;
            break;
          case 32:
            a = Vr;
            break;
          case 268435456:
            a = Ya;
            break;
          default:
            a = Vr;
        }
        return i = hp.bind(null, e), a = wt(a, i), e.callbackPriority = t, e.callbackNode = a, t;
      }
      return i !== null && i !== null && mt(i), e.callbackPriority = 2, e.callbackNode = null, 2;
    }
    function hp(e, t) {
      if (zt !== 0 && zt !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
      var a = e.callbackNode;
      if (os() && e.callbackNode !== a) return null;
      var i = $e;
      return i = Nl(e, e === ct ? i : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), i === 0 ? null : (Zg(e, i, t), fp(e, jt()), e.callbackNode != null && e.callbackNode === a ? hp.bind(null, e) : null);
    }
    function mp(e, t) {
      if (os()) return null;
      Zg(e, t, true);
    }
    function tw() {
      hw(function() {
        (We & 6) !== 0 ? wt(Rl, ew) : dp();
      });
    }
    function ed() {
      if (Jl === 0) {
        var e = sa;
        e === 0 && (e = pr, pr <<= 1, (pr & 261888) === 0 && (pr = 256)), Jl = e;
      }
      return Jl;
    }
    function gp(e) {
      return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : pi("" + e);
    }
    function pp(e, t) {
      var a = t.ownerDocument.createElement("input");
      return a.name = t.name, a.value = t.value, e.id && a.setAttribute("form", e.id), t.parentNode.insertBefore(a, t), e = new FormData(e), a.parentNode.removeChild(a), e;
    }
    function nw(e, t, a, i, u) {
      if (t === "submit" && a && a.stateNode === u) {
        var h = gp((u[ne] || null).action), x = i.submitter;
        x && (t = (t = x[ne] || null) ? gp(t.formAction) : x.getAttribute("formAction"), t !== null && (h = t, x = null));
        var M = new xi("action", "action", null, i, u);
        e.push({
          event: M,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (i.defaultPrevented) {
                  if (Jl !== 0) {
                    var I = x ? pp(u, x) : new FormData(u);
                    xu(a, {
                      pending: true,
                      data: I,
                      method: u.method,
                      action: h
                    }, null, I);
                  }
                } else typeof h == "function" && (M.preventDefault(), I = x ? pp(u, x) : new FormData(u), xu(a, {
                  pending: true,
                  data: I,
                  method: u.method,
                  action: h
                }, h, I));
              },
              currentTarget: u
            }
          ]
        });
      }
    }
    for (var td = 0; td < zc.length; td++) {
      var nd = zc[td], lw = nd.toLowerCase(), rw = nd[0].toUpperCase() + nd.slice(1);
      Un(lw, "on" + rw);
    }
    Un(Ph, "onAnimationEnd"), Un(Zh, "onAnimationIteration"), Un(Kh, "onAnimationStart"), Un("dblclick", "onDoubleClick"), Un("focusin", "onFocus"), Un("focusout", "onBlur"), Un(xx, "onTransitionRun"), Un(wx, "onTransitionStart"), Un(Sx, "onTransitionCancel"), Un(Qh, "onTransitionEnd"), Hn("onMouseEnter", [
      "mouseout",
      "mouseover"
    ]), Hn("onMouseLeave", [
      "mouseout",
      "mouseover"
    ]), Hn("onPointerEnter", [
      "pointerout",
      "pointerover"
    ]), Hn("onPointerLeave", [
      "pointerout",
      "pointerover"
    ]), mn("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), mn("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), mn("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]), mn("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), mn("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), mn("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var So = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), aw = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(So));
    function yp(e, t) {
      t = (t & 4) !== 0;
      for (var a = 0; a < e.length; a++) {
        var i = e[a], u = i.event;
        i = i.listeners;
        e: {
          var h = void 0;
          if (t) for (var x = i.length - 1; 0 <= x; x--) {
            var M = i[x], I = M.instance, G = M.currentTarget;
            if (M = M.listener, I !== h && u.isPropagationStopped()) break e;
            h = M, u.currentTarget = G;
            try {
              h(u);
            } catch (te) {
              Ci(te);
            }
            u.currentTarget = null, h = I;
          }
          else for (x = 0; x < i.length; x++) {
            if (M = i[x], I = M.instance, G = M.currentTarget, M = M.listener, I !== h && u.isPropagationStopped()) break e;
            h = M, u.currentTarget = G;
            try {
              h(u);
            } catch (te) {
              Ci(te);
            }
            u.currentTarget = null, h = I;
          }
        }
      }
    }
    function Be(e, t) {
      var a = t[rt];
      a === void 0 && (a = t[rt] = /* @__PURE__ */ new Set());
      var i = e + "__bubble";
      a.has(i) || (bp(t, e, 2, false), a.add(i));
    }
    function ld(e, t, a) {
      var i = 0;
      t && (i |= 4), bp(a, e, i, t);
    }
    var cs = "_reactListening" + Math.random().toString(36).slice(2);
    function rd(e) {
      if (!e[cs]) {
        e[cs] = true, Fn.forEach(function(a) {
          a !== "selectionchange" && (aw.has(a) || ld(a, false, e), ld(a, true, e));
        });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[cs] || (t[cs] = true, ld("selectionchange", false, t));
      }
    }
    function bp(e, t, a, i) {
      switch (Pp(t)) {
        case 2:
          var u = Nw;
          break;
        case 8:
          u = Ow;
          break;
        default:
          u = vd;
      }
      a = u.bind(null, t, a, e), u = void 0, !Ec || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = true), i ? u !== void 0 ? e.addEventListener(t, a, {
        capture: true,
        passive: u
      }) : e.addEventListener(t, a, true) : u !== void 0 ? e.addEventListener(t, a, {
        passive: u
      }) : e.addEventListener(t, a, false);
    }
    function ad(e, t, a, i, u) {
      var h = i;
      if ((t & 1) === 0 && (t & 2) === 0 && i !== null) e: for (; ; ) {
        if (i === null) return;
        var x = i.tag;
        if (x === 3 || x === 4) {
          var M = i.stateNode.containerInfo;
          if (M === u) break;
          if (x === 4) for (x = i.return; x !== null; ) {
            var I = x.tag;
            if ((I === 3 || I === 4) && x.stateNode.containerInfo === u) return;
            x = x.return;
          }
          for (; M !== null; ) {
            if (x = Et(M), x === null) return;
            if (I = x.tag, I === 5 || I === 6 || I === 26 || I === 27) {
              i = h = x;
              continue e;
            }
            M = M.parentNode;
          }
        }
        i = i.return;
      }
      Ch(function() {
        var G = h, te = Sc(a), re = [];
        e: {
          var K = Fh.get(e);
          if (K !== void 0) {
            var W = xi, xe = e;
            switch (e) {
              case "keypress":
                if (bi(a) === 0) break e;
              case "keydown":
              case "keyup":
                W = W1;
                break;
              case "focusin":
                xe = "focus", W = jc;
                break;
              case "focusout":
                xe = "blur", W = jc;
                break;
              case "beforeblur":
              case "afterblur":
                W = jc;
                break;
              case "click":
                if (a.button === 2) break e;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                W = kh;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                W = Y1;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                W = tx;
                break;
              case Ph:
              case Zh:
              case Kh:
                W = V1;
                break;
              case Qh:
                W = lx;
                break;
              case "scroll":
              case "scrollend":
                W = H1;
                break;
              case "wheel":
                W = ax;
                break;
              case "copy":
              case "cut":
              case "paste":
                W = q1;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                W = jh;
                break;
              case "toggle":
              case "beforetoggle":
                W = ix;
            }
            var Re = (t & 4) !== 0, it = !Re && (e === "scroll" || e === "scrollend"), V = Re ? K !== null ? K + "Capture" : null : K;
            Re = [];
            for (var U = G, q; U !== null; ) {
              var le = U;
              if (q = le.stateNode, le = le.tag, le !== 5 && le !== 26 && le !== 27 || q === null || V === null || (le = Va(U, V), le != null && Re.push(Co(U, le, q))), it) break;
              U = U.return;
            }
            0 < Re.length && (K = new W(K, xe, null, a, te), re.push({
              event: K,
              listeners: Re
            }));
          }
        }
        if ((t & 7) === 0) {
          e: {
            if (K = e === "mouseover" || e === "pointerover", W = e === "mouseout" || e === "pointerout", K && a !== wc && (xe = a.relatedTarget || a.fromElement) && (Et(xe) || xe[Te])) break e;
            if ((W || K) && (K = te.window === te ? te : (K = te.ownerDocument) ? K.defaultView || K.parentWindow : window, W ? (xe = a.relatedTarget || a.toElement, W = G, xe = xe ? Et(xe) : null, xe !== null && (it = c(xe), Re = xe.tag, xe !== it || Re !== 5 && Re !== 27 && Re !== 6) && (xe = null)) : (W = null, xe = G), W !== xe)) {
              if (Re = kh, le = "onMouseLeave", V = "onMouseEnter", U = "mouse", (e === "pointerout" || e === "pointerover") && (Re = jh, le = "onPointerLeave", V = "onPointerEnter", U = "pointer"), it = W == null ? K : Ut(W), q = xe == null ? K : Ut(xe), K = new Re(le, U + "leave", W, a, te), K.target = it, K.relatedTarget = q, le = null, Et(te) === G && (Re = new Re(V, U + "enter", xe, a, te), Re.target = q, Re.relatedTarget = it, le = Re), it = le, W && xe) t: {
                for (Re = ow, V = W, U = xe, q = 0, le = V; le; le = Re(le)) q++;
                le = 0;
                for (var Le = U; Le; Le = Re(Le)) le++;
                for (; 0 < q - le; ) V = Re(V), q--;
                for (; 0 < le - q; ) U = Re(U), le--;
                for (; q--; ) {
                  if (V === U || U !== null && V === U.alternate) {
                    Re = V;
                    break t;
                  }
                  V = Re(V), U = Re(U);
                }
                Re = null;
              }
              else Re = null;
              W !== null && vp(re, K, W, Re, false), xe !== null && it !== null && vp(re, it, xe, Re, true);
            }
          }
          e: {
            if (K = G ? Ut(G) : window, W = K.nodeName && K.nodeName.toLowerCase(), W === "select" || W === "input" && K.type === "file") var Qe = Ih;
            else if (Oh(K)) if (zh) Qe = yx;
            else {
              Qe = gx;
              var Ce = mx;
            }
            else W = K.nodeName, !W || W.toLowerCase() !== "input" || K.type !== "checkbox" && K.type !== "radio" ? G && xc(G.elementType) && (Qe = Ih) : Qe = px;
            if (Qe && (Qe = Qe(e, G))) {
              Dh(re, Qe, a, te);
              break e;
            }
            Ce && Ce(e, K, G), e === "focusout" && G && K.type === "number" && G.memoizedProps.value != null && vc(K, "number", K.value);
          }
          switch (Ce = G ? Ut(G) : window, e) {
            case "focusin":
              (Oh(Ce) || Ce.contentEditable === "true") && (ea = Ce, Oc = G, Fa = null);
              break;
            case "focusout":
              Fa = Oc = ea = null;
              break;
            case "mousedown":
              Dc = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Dc = false, qh(re, a, te);
              break;
            case "selectionchange":
              if (vx) break;
            case "keydown":
            case "keyup":
              qh(re, a, te);
          }
          var ze;
          if (Rc) e: {
            switch (e) {
              case "compositionstart":
                var qe = "onCompositionStart";
                break e;
              case "compositionend":
                qe = "onCompositionEnd";
                break e;
              case "compositionupdate":
                qe = "onCompositionUpdate";
                break e;
            }
            qe = void 0;
          }
          else Jr ? Th(e, a) && (qe = "onCompositionEnd") : e === "keydown" && a.keyCode === 229 && (qe = "onCompositionStart");
          qe && (Lh && a.locale !== "ko" && (Jr || qe !== "onCompositionStart" ? qe === "onCompositionEnd" && Jr && (ze = Eh()) : (zl = te, _c = "value" in zl ? zl.value : zl.textContent, Jr = true)), Ce = us(G, qe), 0 < Ce.length && (qe = new Mh(qe, e, null, a, te), re.push({
            event: qe,
            listeners: Ce
          }), ze ? qe.data = ze : (ze = Nh(a), ze !== null && (qe.data = ze)))), (ze = cx ? ux(e, a) : dx(e, a)) && (qe = us(G, "onBeforeInput"), 0 < qe.length && (Ce = new Mh("onBeforeInput", "beforeinput", null, a, te), re.push({
            event: Ce,
            listeners: qe
          }), Ce.data = ze)), nw(re, e, G, a, te);
        }
        yp(re, t);
      });
    }
    function Co(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function us(e, t) {
      for (var a = t + "Capture", i = []; e !== null; ) {
        var u = e, h = u.stateNode;
        if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || h === null || (u = Va(e, a), u != null && i.unshift(Co(e, u, h)), u = Va(e, t), u != null && i.push(Co(e, u, h))), e.tag === 3) return i;
        e = e.return;
      }
      return [];
    }
    function ow(e) {
      if (e === null) return null;
      do
        e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function vp(e, t, a, i, u) {
      for (var h = t._reactName, x = []; a !== null && a !== i; ) {
        var M = a, I = M.alternate, G = M.stateNode;
        if (M = M.tag, I !== null && I === i) break;
        M !== 5 && M !== 26 && M !== 27 || G === null || (I = G, u ? (G = Va(a, h), G != null && x.unshift(Co(a, G, I))) : u || (G = Va(a, h), G != null && x.push(Co(a, G, I)))), a = a.return;
      }
      x.length !== 0 && e.push({
        event: t,
        listeners: x
      });
    }
    var iw = /\r\n?/g, sw = /\u0000|\uFFFD/g;
    function xp(e) {
      return (typeof e == "string" ? e : "" + e).replace(iw, `
`).replace(sw, "");
    }
    function wp(e, t) {
      return t = xp(t), xp(e) === t;
    }
    function ot(e, t, a, i, u, h) {
      switch (a) {
        case "children":
          typeof i == "string" ? t === "body" || t === "textarea" && i === "" || Qr(e, i) : (typeof i == "number" || typeof i == "bigint") && t !== "body" && Qr(e, "" + i);
          break;
        case "className":
          Il(e, "class", i);
          break;
        case "tabIndex":
          Il(e, "tabindex", i);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          Il(e, a, i);
          break;
        case "style":
          wh(e, i, h);
          break;
        case "data":
          if (t !== "object") {
            Il(e, "data", i);
            break;
          }
        case "src":
        case "href":
          if (i === "" && (t !== "a" || a !== "href")) {
            e.removeAttribute(a);
            break;
          }
          if (i == null || typeof i == "function" || typeof i == "symbol" || typeof i == "boolean") {
            e.removeAttribute(a);
            break;
          }
          i = pi("" + i), e.setAttribute(a, i);
          break;
        case "action":
        case "formAction":
          if (typeof i == "function") {
            e.setAttribute(a, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
            break;
          } else typeof h == "function" && (a === "formAction" ? (t !== "input" && ot(e, t, "name", u.name, u, null), ot(e, t, "formEncType", u.formEncType, u, null), ot(e, t, "formMethod", u.formMethod, u, null), ot(e, t, "formTarget", u.formTarget, u, null)) : (ot(e, t, "encType", u.encType, u, null), ot(e, t, "method", u.method, u, null), ot(e, t, "target", u.target, u, null)));
          if (i == null || typeof i == "symbol" || typeof i == "boolean") {
            e.removeAttribute(a);
            break;
          }
          i = pi("" + i), e.setAttribute(a, i);
          break;
        case "onClick":
          i != null && (e.onclick = ul);
          break;
        case "onScroll":
          i != null && Be("scroll", e);
          break;
        case "onScrollEnd":
          i != null && Be("scrollend", e);
          break;
        case "dangerouslySetInnerHTML":
          if (i != null) {
            if (typeof i != "object" || !("__html" in i)) throw Error(o(61));
            if (a = i.__html, a != null) {
              if (u.children != null) throw Error(o(60));
              e.innerHTML = a;
            }
          }
          break;
        case "multiple":
          e.multiple = i && typeof i != "function" && typeof i != "symbol";
          break;
        case "muted":
          e.muted = i && typeof i != "function" && typeof i != "symbol";
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (i == null || typeof i == "function" || typeof i == "boolean" || typeof i == "symbol") {
            e.removeAttribute("xlink:href");
            break;
          }
          a = pi("" + i), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a);
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          i != null && typeof i != "function" && typeof i != "symbol" ? e.setAttribute(a, "" + i) : e.removeAttribute(a);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          i && typeof i != "function" && typeof i != "symbol" ? e.setAttribute(a, "") : e.removeAttribute(a);
          break;
        case "capture":
        case "download":
          i === true ? e.setAttribute(a, "") : i !== false && i != null && typeof i != "function" && typeof i != "symbol" ? e.setAttribute(a, i) : e.removeAttribute(a);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          i != null && typeof i != "function" && typeof i != "symbol" && !isNaN(i) && 1 <= i ? e.setAttribute(a, i) : e.removeAttribute(a);
          break;
        case "rowSpan":
        case "start":
          i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i) ? e.removeAttribute(a) : e.setAttribute(a, i);
          break;
        case "popover":
          Be("beforetoggle", e), Be("toggle", e), Jn(e, "popover", i);
          break;
        case "xlinkActuate":
          rn(e, "http://www.w3.org/1999/xlink", "xlink:actuate", i);
          break;
        case "xlinkArcrole":
          rn(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", i);
          break;
        case "xlinkRole":
          rn(e, "http://www.w3.org/1999/xlink", "xlink:role", i);
          break;
        case "xlinkShow":
          rn(e, "http://www.w3.org/1999/xlink", "xlink:show", i);
          break;
        case "xlinkTitle":
          rn(e, "http://www.w3.org/1999/xlink", "xlink:title", i);
          break;
        case "xlinkType":
          rn(e, "http://www.w3.org/1999/xlink", "xlink:type", i);
          break;
        case "xmlBase":
          rn(e, "http://www.w3.org/XML/1998/namespace", "xml:base", i);
          break;
        case "xmlLang":
          rn(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", i);
          break;
        case "xmlSpace":
          rn(e, "http://www.w3.org/XML/1998/namespace", "xml:space", i);
          break;
        case "is":
          Jn(e, "is", i);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = I1.get(a) || a, Jn(e, a, i));
      }
    }
    function od(e, t, a, i, u, h) {
      switch (a) {
        case "style":
          wh(e, i, h);
          break;
        case "dangerouslySetInnerHTML":
          if (i != null) {
            if (typeof i != "object" || !("__html" in i)) throw Error(o(61));
            if (a = i.__html, a != null) {
              if (u.children != null) throw Error(o(60));
              e.innerHTML = a;
            }
          }
          break;
        case "children":
          typeof i == "string" ? Qr(e, i) : (typeof i == "number" || typeof i == "bigint") && Qr(e, "" + i);
          break;
        case "onScroll":
          i != null && Be("scroll", e);
          break;
        case "onScrollEnd":
          i != null && Be("scrollend", e);
          break;
        case "onClick":
          i != null && (e.onclick = ul);
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!Wn.hasOwnProperty(a)) e: {
            if (a[0] === "o" && a[1] === "n" && (u = a.endsWith("Capture"), t = a.slice(2, u ? a.length - 7 : void 0), h = e[ne] || null, h = h != null ? h[a] : null, typeof h == "function" && e.removeEventListener(t, h, u), typeof i == "function")) {
              typeof h != "function" && h !== null && (a in e ? e[a] = null : e.hasAttribute(a) && e.removeAttribute(a)), e.addEventListener(t, i, u);
              break e;
            }
            a in e ? e[a] = i : i === true ? e.setAttribute(a, "") : Jn(e, a, i);
          }
      }
    }
    function Gt(e, t, a) {
      switch (t) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          Be("error", e), Be("load", e);
          var i = false, u = false, h;
          for (h in a) if (a.hasOwnProperty(h)) {
            var x = a[h];
            if (x != null) switch (h) {
              case "src":
                i = true;
                break;
              case "srcSet":
                u = true;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                ot(e, t, h, x, a, null);
            }
          }
          u && ot(e, t, "srcSet", a.srcSet, a, null), i && ot(e, t, "src", a.src, a, null);
          return;
        case "input":
          Be("invalid", e);
          var M = h = x = u = null, I = null, G = null;
          for (i in a) if (a.hasOwnProperty(i)) {
            var te = a[i];
            if (te != null) switch (i) {
              case "name":
                u = te;
                break;
              case "type":
                x = te;
                break;
              case "checked":
                I = te;
                break;
              case "defaultChecked":
                G = te;
                break;
              case "value":
                h = te;
                break;
              case "defaultValue":
                M = te;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (te != null) throw Error(o(137, t));
                break;
              default:
                ot(e, t, i, te, a, null);
            }
          }
          yh(e, h, M, I, G, x, u, false);
          return;
        case "select":
          Be("invalid", e), i = x = h = null;
          for (u in a) if (a.hasOwnProperty(u) && (M = a[u], M != null)) switch (u) {
            case "value":
              h = M;
              break;
            case "defaultValue":
              x = M;
              break;
            case "multiple":
              i = M;
            default:
              ot(e, t, u, M, a, null);
          }
          t = h, a = x, e.multiple = !!i, t != null ? Kr(e, !!i, t, false) : a != null && Kr(e, !!i, a, true);
          return;
        case "textarea":
          Be("invalid", e), h = u = i = null;
          for (x in a) if (a.hasOwnProperty(x) && (M = a[x], M != null)) switch (x) {
            case "value":
              i = M;
              break;
            case "defaultValue":
              u = M;
              break;
            case "children":
              h = M;
              break;
            case "dangerouslySetInnerHTML":
              if (M != null) throw Error(o(91));
              break;
            default:
              ot(e, t, x, M, a, null);
          }
          vh(e, i, u, h);
          return;
        case "option":
          for (I in a) if (a.hasOwnProperty(I) && (i = a[I], i != null)) switch (I) {
            case "selected":
              e.selected = i && typeof i != "function" && typeof i != "symbol";
              break;
            default:
              ot(e, t, I, i, a, null);
          }
          return;
        case "dialog":
          Be("beforetoggle", e), Be("toggle", e), Be("cancel", e), Be("close", e);
          break;
        case "iframe":
        case "object":
          Be("load", e);
          break;
        case "video":
        case "audio":
          for (i = 0; i < So.length; i++) Be(So[i], e);
          break;
        case "image":
          Be("error", e), Be("load", e);
          break;
        case "details":
          Be("toggle", e);
          break;
        case "embed":
        case "source":
        case "link":
          Be("error", e), Be("load", e);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (G in a) if (a.hasOwnProperty(G) && (i = a[G], i != null)) switch (G) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(o(137, t));
            default:
              ot(e, t, G, i, a, null);
          }
          return;
        default:
          if (xc(t)) {
            for (te in a) a.hasOwnProperty(te) && (i = a[te], i !== void 0 && od(e, t, te, i, a, void 0));
            return;
          }
      }
      for (M in a) a.hasOwnProperty(M) && (i = a[M], i != null && ot(e, t, M, i, a, null));
    }
    function cw(e, t, a, i) {
      switch (t) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var u = null, h = null, x = null, M = null, I = null, G = null, te = null;
          for (W in a) {
            var re = a[W];
            if (a.hasOwnProperty(W) && re != null) switch (W) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                I = re;
              default:
                i.hasOwnProperty(W) || ot(e, t, W, null, i, re);
            }
          }
          for (var K in i) {
            var W = i[K];
            if (re = a[K], i.hasOwnProperty(K) && (W != null || re != null)) switch (K) {
              case "type":
                h = W;
                break;
              case "name":
                u = W;
                break;
              case "checked":
                G = W;
                break;
              case "defaultChecked":
                te = W;
                break;
              case "value":
                x = W;
                break;
              case "defaultValue":
                M = W;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (W != null) throw Error(o(137, t));
                break;
              default:
                W !== re && ot(e, t, K, W, i, re);
            }
          }
          bc(e, x, M, I, G, te, h, u);
          return;
        case "select":
          W = x = M = K = null;
          for (h in a) if (I = a[h], a.hasOwnProperty(h) && I != null) switch (h) {
            case "value":
              break;
            case "multiple":
              W = I;
            default:
              i.hasOwnProperty(h) || ot(e, t, h, null, i, I);
          }
          for (u in i) if (h = i[u], I = a[u], i.hasOwnProperty(u) && (h != null || I != null)) switch (u) {
            case "value":
              K = h;
              break;
            case "defaultValue":
              M = h;
              break;
            case "multiple":
              x = h;
            default:
              h !== I && ot(e, t, u, h, i, I);
          }
          t = M, a = x, i = W, K != null ? Kr(e, !!a, K, false) : !!i != !!a && (t != null ? Kr(e, !!a, t, true) : Kr(e, !!a, a ? [] : "", false));
          return;
        case "textarea":
          W = K = null;
          for (M in a) if (u = a[M], a.hasOwnProperty(M) && u != null && !i.hasOwnProperty(M)) switch (M) {
            case "value":
              break;
            case "children":
              break;
            default:
              ot(e, t, M, null, i, u);
          }
          for (x in i) if (u = i[x], h = a[x], i.hasOwnProperty(x) && (u != null || h != null)) switch (x) {
            case "value":
              K = u;
              break;
            case "defaultValue":
              W = u;
              break;
            case "children":
              break;
            case "dangerouslySetInnerHTML":
              if (u != null) throw Error(o(91));
              break;
            default:
              u !== h && ot(e, t, x, u, i, h);
          }
          bh(e, K, W);
          return;
        case "option":
          for (var xe in a) if (K = a[xe], a.hasOwnProperty(xe) && K != null && !i.hasOwnProperty(xe)) switch (xe) {
            case "selected":
              e.selected = false;
              break;
            default:
              ot(e, t, xe, null, i, K);
          }
          for (I in i) if (K = i[I], W = a[I], i.hasOwnProperty(I) && K !== W && (K != null || W != null)) switch (I) {
            case "selected":
              e.selected = K && typeof K != "function" && typeof K != "symbol";
              break;
            default:
              ot(e, t, I, K, i, W);
          }
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var Re in a) K = a[Re], a.hasOwnProperty(Re) && K != null && !i.hasOwnProperty(Re) && ot(e, t, Re, null, i, K);
          for (G in i) if (K = i[G], W = a[G], i.hasOwnProperty(G) && K !== W && (K != null || W != null)) switch (G) {
            case "children":
            case "dangerouslySetInnerHTML":
              if (K != null) throw Error(o(137, t));
              break;
            default:
              ot(e, t, G, K, i, W);
          }
          return;
        default:
          if (xc(t)) {
            for (var it in a) K = a[it], a.hasOwnProperty(it) && K !== void 0 && !i.hasOwnProperty(it) && od(e, t, it, void 0, i, K);
            for (te in i) K = i[te], W = a[te], !i.hasOwnProperty(te) || K === W || K === void 0 && W === void 0 || od(e, t, te, K, i, W);
            return;
          }
      }
      for (var V in a) K = a[V], a.hasOwnProperty(V) && K != null && !i.hasOwnProperty(V) && ot(e, t, V, null, i, K);
      for (re in i) K = i[re], W = a[re], !i.hasOwnProperty(re) || K === W || K == null && W == null || ot(e, t, re, K, i, W);
    }
    function Sp(e) {
      switch (e) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return true;
        default:
          return false;
      }
    }
    function uw() {
      if (typeof performance.getEntriesByType == "function") {
        for (var e = 0, t = 0, a = performance.getEntriesByType("resource"), i = 0; i < a.length; i++) {
          var u = a[i], h = u.transferSize, x = u.initiatorType, M = u.duration;
          if (h && M && Sp(x)) {
            for (x = 0, M = u.responseEnd, i += 1; i < a.length; i++) {
              var I = a[i], G = I.startTime;
              if (G > M) break;
              var te = I.transferSize, re = I.initiatorType;
              te && Sp(re) && (I = I.responseEnd, x += te * (I < M ? 1 : (M - G) / (I - G)));
            }
            if (--i, t += 8 * (h + x) / (u.duration / 1e3), e++, 10 < e) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
    }
    var id = null, sd = null;
    function ds(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Cp(e) {
      switch (e) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function Ep(e, t) {
      if (e === 0) switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
      return e === 1 && t === "foreignObject" ? 0 : e;
    }
    function cd(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    var ud = null;
    function dw() {
      var e = window.event;
      return e && e.type === "popstate" ? e === ud ? false : (ud = e, true) : (ud = null, false);
    }
    var _p = typeof setTimeout == "function" ? setTimeout : void 0, fw = typeof clearTimeout == "function" ? clearTimeout : void 0, kp = typeof Promise == "function" ? Promise : void 0, hw = typeof queueMicrotask == "function" ? queueMicrotask : typeof kp < "u" ? function(e) {
      return kp.resolve(null).then(e).catch(mw);
    } : _p;
    function mw(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function er(e) {
      return e === "head";
    }
    function Mp(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === 8) if (a = u.data, a === "/$" || a === "/&") {
          if (i === 0) {
            e.removeChild(u), Ma(t);
            return;
          }
          i--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&") i++;
        else if (a === "html") Eo(e.ownerDocument.documentElement);
        else if (a === "head") {
          a = e.ownerDocument.head, Eo(a);
          for (var h = a.firstChild; h; ) {
            var x = h.nextSibling, M = h.nodeName;
            h[Je] || M === "SCRIPT" || M === "STYLE" || M === "LINK" && h.rel.toLowerCase() === "stylesheet" || a.removeChild(h), h = x;
          }
        } else a === "body" && Eo(e.ownerDocument.body);
        a = u;
      } while (a);
      Ma(t);
    }
    function jp(e, t) {
      var a = e;
      e = 0;
      do {
        var i = a.nextSibling;
        if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), i && i.nodeType === 8) if (a = i.data, a === "/$") {
          if (e === 0) break;
          e--;
        } else a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || e++;
        a = i;
      } while (a);
    }
    function dd(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var a = t;
        switch (t = t.nextSibling, a.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            dd(a), st(a);
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if (a.rel.toLowerCase() === "stylesheet") continue;
        }
        e.removeChild(a);
      }
    }
    function gw(e, t, a, i) {
      for (; e.nodeType === 1; ) {
        var u = a;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!i && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
        } else if (i) {
          if (!e[Je]) switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (h = e.getAttribute("rel"), h === "stylesheet" && e.hasAttribute("data-precedence")) break;
              if (h !== u.rel || e.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || e.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || e.getAttribute("title") !== (u.title == null ? null : u.title)) break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (h = e.getAttribute("src"), (h !== (u.src == null ? null : u.src) || e.getAttribute("type") !== (u.type == null ? null : u.type) || e.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && h && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
              return e;
            default:
              return e;
          }
        } else if (t === "input" && e.type === "hidden") {
          var h = u.name == null ? null : "" + u.name;
          if (u.type === "hidden" && e.getAttribute("name") === h) return e;
        } else return e;
        if (e = Tn(e.nextSibling), e === null) break;
      }
      return null;
    }
    function pw(e, t, a) {
      if (t === "") return null;
      for (; e.nodeType !== 3; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = Tn(e.nextSibling), e === null)) return null;
      return e;
    }
    function Lp(e, t) {
      for (; e.nodeType !== 8; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Tn(e.nextSibling), e === null)) return null;
      return e;
    }
    function fd(e) {
      return e.data === "$?" || e.data === "$~";
    }
    function hd(e) {
      return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
    }
    function yw(e, t) {
      var a = e.ownerDocument;
      if (e.data === "$~") e._reactRetry = t;
      else if (e.data !== "$?" || a.readyState !== "loading") t();
      else {
        var i = function() {
          t(), a.removeEventListener("DOMContentLoaded", i);
        };
        a.addEventListener("DOMContentLoaded", i), e._reactRetry = i;
      }
    }
    function Tn(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
          if (t === "/$" || t === "/&") return null;
        }
      }
      return e;
    }
    var md = null;
    function Rp(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === "/$" || a === "/&") {
            if (t === 0) return Tn(e.nextSibling);
            t--;
          } else a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function Ap(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
            if (t === 0) return e;
            t--;
          } else a !== "/$" && a !== "/&" || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function Tp(e, t, a) {
      switch (t = ds(a), e) {
        case "html":
          if (e = t.documentElement, !e) throw Error(o(452));
          return e;
        case "head":
          if (e = t.head, !e) throw Error(o(453));
          return e;
        case "body":
          if (e = t.body, !e) throw Error(o(454));
          return e;
        default:
          throw Error(o(451));
      }
    }
    function Eo(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      st(e);
    }
    var Nn = /* @__PURE__ */ new Map(), Np = /* @__PURE__ */ new Set();
    function fs(e) {
      return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
    }
    var kl = F.d;
    F.d = {
      f: bw,
      r: vw,
      D: xw,
      C: ww,
      L: Sw,
      m: Cw,
      X: _w,
      S: Ew,
      M: kw
    };
    function bw() {
      var e = kl.f(), t = ls();
      return e || t;
    }
    function vw(e) {
      var t = Ze(e);
      t !== null && t.tag === 5 && t.type === "form" ? Qm(t) : kl.r(e);
    }
    var Ea = typeof document > "u" ? null : document;
    function Op(e, t, a) {
      var i = Ea;
      if (i && typeof t == "string" && t) {
        var u = _n(t);
        u = 'link[rel="' + e + '"][href="' + u + '"]', typeof a == "string" && (u += '[crossorigin="' + a + '"]'), Np.has(u) || (Np.add(u), e = {
          rel: e,
          crossOrigin: a,
          href: t
        }, i.querySelector(u) === null && (t = i.createElement("link"), Gt(t, "link", e), tt(t), i.head.appendChild(t)));
      }
    }
    function xw(e) {
      kl.D(e), Op("dns-prefetch", e, null);
    }
    function ww(e, t) {
      kl.C(e, t), Op("preconnect", e, t);
    }
    function Sw(e, t, a) {
      kl.L(e, t, a);
      var i = Ea;
      if (i && e && t) {
        var u = 'link[rel="preload"][as="' + _n(t) + '"]';
        t === "image" && a && a.imageSrcSet ? (u += '[imagesrcset="' + _n(a.imageSrcSet) + '"]', typeof a.imageSizes == "string" && (u += '[imagesizes="' + _n(a.imageSizes) + '"]')) : u += '[href="' + _n(e) + '"]';
        var h = u;
        switch (t) {
          case "style":
            h = _a(e);
            break;
          case "script":
            h = ka(e);
        }
        Nn.has(h) || (e = b({
          rel: "preload",
          href: t === "image" && a && a.imageSrcSet ? void 0 : e,
          as: t
        }, a), Nn.set(h, e), i.querySelector(u) !== null || t === "style" && i.querySelector(_o(h)) || t === "script" && i.querySelector(ko(h)) || (t = i.createElement("link"), Gt(t, "link", e), tt(t), i.head.appendChild(t)));
      }
    }
    function Cw(e, t) {
      kl.m(e, t);
      var a = Ea;
      if (a && e) {
        var i = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + _n(i) + '"][href="' + _n(e) + '"]', h = u;
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            h = ka(e);
        }
        if (!Nn.has(h) && (e = b({
          rel: "modulepreload",
          href: e
        }, t), Nn.set(h, e), a.querySelector(u) === null)) {
          switch (i) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (a.querySelector(ko(h))) return;
          }
          i = a.createElement("link"), Gt(i, "link", e), tt(i), a.head.appendChild(i);
        }
      }
    }
    function Ew(e, t, a) {
      kl.S(e, t, a);
      var i = Ea;
      if (i && e) {
        var u = Lt(i).hoistableStyles, h = _a(e);
        t = t || "default";
        var x = u.get(h);
        if (!x) {
          var M = {
            loading: 0,
            preload: null
          };
          if (x = i.querySelector(_o(h))) M.loading = 5;
          else {
            e = b({
              rel: "stylesheet",
              href: e,
              "data-precedence": t
            }, a), (a = Nn.get(h)) && gd(e, a);
            var I = x = i.createElement("link");
            tt(I), Gt(I, "link", e), I._p = new Promise(function(G, te) {
              I.onload = G, I.onerror = te;
            }), I.addEventListener("load", function() {
              M.loading |= 1;
            }), I.addEventListener("error", function() {
              M.loading |= 2;
            }), M.loading |= 4, hs(x, t, i);
          }
          x = {
            type: "stylesheet",
            instance: x,
            count: 1,
            state: M
          }, u.set(h, x);
        }
      }
    }
    function _w(e, t) {
      kl.X(e, t);
      var a = Ea;
      if (a && e) {
        var i = Lt(a).hoistableScripts, u = ka(e), h = i.get(u);
        h || (h = a.querySelector(ko(u)), h || (e = b({
          src: e,
          async: true
        }, t), (t = Nn.get(u)) && pd(e, t), h = a.createElement("script"), tt(h), Gt(h, "link", e), a.head.appendChild(h)), h = {
          type: "script",
          instance: h,
          count: 1,
          state: null
        }, i.set(u, h));
      }
    }
    function kw(e, t) {
      kl.M(e, t);
      var a = Ea;
      if (a && e) {
        var i = Lt(a).hoistableScripts, u = ka(e), h = i.get(u);
        h || (h = a.querySelector(ko(u)), h || (e = b({
          src: e,
          async: true,
          type: "module"
        }, t), (t = Nn.get(u)) && pd(e, t), h = a.createElement("script"), tt(h), Gt(h, "link", e), a.head.appendChild(h)), h = {
          type: "script",
          instance: h,
          count: 1,
          state: null
        }, i.set(u, h));
      }
    }
    function Dp(e, t, a, i) {
      var u = (u = oe.current) ? fs(u) : null;
      if (!u) throw Error(o(446));
      switch (e) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof a.precedence == "string" && typeof a.href == "string" ? (t = _a(a.href), a = Lt(u).hoistableStyles, i = a.get(t), i || (i = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, a.set(t, i)), i) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        case "link":
          if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
            e = _a(a.href);
            var h = Lt(u).hoistableStyles, x = h.get(e);
            if (x || (u = u.ownerDocument || u, x = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: {
                loading: 0,
                preload: null
              }
            }, h.set(e, x), (h = u.querySelector(_o(e))) && !h._p && (x.instance = h, x.state.loading = 5), Nn.has(e) || (a = {
              rel: "preload",
              as: "style",
              href: a.href,
              crossOrigin: a.crossOrigin,
              integrity: a.integrity,
              media: a.media,
              hrefLang: a.hrefLang,
              referrerPolicy: a.referrerPolicy
            }, Nn.set(e, a), h || Mw(u, e, a, x.state))), t && i === null) throw Error(o(528, ""));
            return x;
          }
          if (t && i !== null) throw Error(o(529, ""));
          return null;
        case "script":
          return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = ka(a), a = Lt(u).hoistableScripts, i = a.get(t), i || (i = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, a.set(t, i)), i) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        default:
          throw Error(o(444, e));
      }
    }
    function _a(e) {
      return 'href="' + _n(e) + '"';
    }
    function _o(e) {
      return 'link[rel="stylesheet"][' + e + "]";
    }
    function Ip(e) {
      return b({}, e, {
        "data-precedence": e.precedence,
        precedence: null
      });
    }
    function Mw(e, t, a, i) {
      e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? i.loading = 1 : (t = e.createElement("link"), i.preload = t, t.addEventListener("load", function() {
        return i.loading |= 1;
      }), t.addEventListener("error", function() {
        return i.loading |= 2;
      }), Gt(t, "link", a), tt(t), e.head.appendChild(t));
    }
    function ka(e) {
      return '[src="' + _n(e) + '"]';
    }
    function ko(e) {
      return "script[async]" + e;
    }
    function zp(e, t, a) {
      if (t.count++, t.instance === null) switch (t.type) {
        case "style":
          var i = e.querySelector('style[data-href~="' + _n(a.href) + '"]');
          if (i) return t.instance = i, tt(i), i;
          var u = b({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return i = (e.ownerDocument || e).createElement("style"), tt(i), Gt(i, "style", u), hs(i, a.precedence, e), t.instance = i;
        case "stylesheet":
          u = _a(a.href);
          var h = e.querySelector(_o(u));
          if (h) return t.state.loading |= 4, t.instance = h, tt(h), h;
          i = Ip(a), (u = Nn.get(u)) && gd(i, u), h = (e.ownerDocument || e).createElement("link"), tt(h);
          var x = h;
          return x._p = new Promise(function(M, I) {
            x.onload = M, x.onerror = I;
          }), Gt(h, "link", i), t.state.loading |= 4, hs(h, a.precedence, e), t.instance = h;
        case "script":
          return h = ka(a.src), (u = e.querySelector(ko(h))) ? (t.instance = u, tt(u), u) : (i = a, (u = Nn.get(h)) && (i = b({}, a), pd(i, u)), e = e.ownerDocument || e, u = e.createElement("script"), tt(u), Gt(u, "link", i), e.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
      else t.type === "stylesheet" && (t.state.loading & 4) === 0 && (i = t.instance, t.state.loading |= 4, hs(i, a.precedence, e));
      return t.instance;
    }
    function hs(e, t, a) {
      for (var i = a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), u = i.length ? i[i.length - 1] : null, h = u, x = 0; x < i.length; x++) {
        var M = i[x];
        if (M.dataset.precedence === t) h = M;
        else if (h !== u) break;
      }
      h ? h.parentNode.insertBefore(e, h.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(e, t.firstChild));
    }
    function gd(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
    }
    function pd(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
    }
    var ms = null;
    function Hp(e, t, a) {
      if (ms === null) {
        var i = /* @__PURE__ */ new Map(), u = ms = /* @__PURE__ */ new Map();
        u.set(a, i);
      } else u = ms, i = u.get(a), i || (i = /* @__PURE__ */ new Map(), u.set(a, i));
      if (i.has(e)) return i;
      for (i.set(e, null), a = a.getElementsByTagName(e), u = 0; u < a.length; u++) {
        var h = a[u];
        if (!(h[Je] || h[It] || e === "link" && h.getAttribute("rel") === "stylesheet") && h.namespaceURI !== "http://www.w3.org/2000/svg") {
          var x = h.getAttribute(t) || "";
          x = e + x;
          var M = i.get(x);
          M ? M.push(h) : i.set(x, [
            h
          ]);
        }
      }
      return i;
    }
    function Up(e, t, a) {
      e = e.ownerDocument || e, e.head.insertBefore(a, t === "title" ? e.querySelector("head > title") : null);
    }
    function jw(e, t, a) {
      if (a === 1 || t.itemProp != null) return false;
      switch (e) {
        case "meta":
        case "title":
          return true;
        case "style":
          if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
          return true;
        case "link":
          if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
          switch (t.rel) {
            case "stylesheet":
              return e = t.disabled, typeof t.precedence == "string" && e == null;
            default:
              return true;
          }
        case "script":
          if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return true;
      }
      return false;
    }
    function Yp(e) {
      return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
    }
    function Lw(e, t, a, i) {
      if (a.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== false) && (a.state.loading & 4) === 0) {
        if (a.instance === null) {
          var u = _a(i.href), h = t.querySelector(_o(u));
          if (h) {
            t = h._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = gs.bind(e), t.then(e, e)), a.state.loading |= 4, a.instance = h, tt(h);
            return;
          }
          h = t.ownerDocument || t, i = Ip(i), (u = Nn.get(u)) && gd(i, u), h = h.createElement("link"), tt(h);
          var x = h;
          x._p = new Promise(function(M, I) {
            x.onload = M, x.onerror = I;
          }), Gt(h, "link", i), a.instance = h;
        }
        e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (e.count++, a = gs.bind(e), t.addEventListener("load", a), t.addEventListener("error", a));
      }
    }
    var yd = 0;
    function Rw(e, t) {
      return e.stylesheets && e.count === 0 && ys(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(a) {
        var i = setTimeout(function() {
          if (e.stylesheets && ys(e, e.stylesheets), e.unsuspend) {
            var h = e.unsuspend;
            e.unsuspend = null, h();
          }
        }, 6e4 + t);
        0 < e.imgBytes && yd === 0 && (yd = 62500 * uw());
        var u = setTimeout(function() {
          if (e.waitingForImages = false, e.count === 0 && (e.stylesheets && ys(e, e.stylesheets), e.unsuspend)) {
            var h = e.unsuspend;
            e.unsuspend = null, h();
          }
        }, (e.imgBytes > yd ? 50 : 800) + t);
        return e.unsuspend = a, function() {
          e.unsuspend = null, clearTimeout(i), clearTimeout(u);
        };
      } : null;
    }
    function gs() {
      if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
        if (this.stylesheets) ys(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          this.unsuspend = null, e();
        }
      }
    }
    var ps = null;
    function ys(e, t) {
      e.stylesheets = null, e.unsuspend !== null && (e.count++, ps = /* @__PURE__ */ new Map(), t.forEach(Aw, e), ps = null, gs.call(e));
    }
    function Aw(e, t) {
      if (!(t.state.loading & 4)) {
        var a = ps.get(e);
        if (a) var i = a.get(null);
        else {
          a = /* @__PURE__ */ new Map(), ps.set(e, a);
          for (var u = e.querySelectorAll("link[data-precedence],style[data-precedence]"), h = 0; h < u.length; h++) {
            var x = u[h];
            (x.nodeName === "LINK" || x.getAttribute("media") !== "not all") && (a.set(x.dataset.precedence, x), i = x);
          }
          i && a.set(null, i);
        }
        u = t.instance, x = u.getAttribute("data-precedence"), h = a.get(x) || i, h === i && a.set(null, u), a.set(x, u), this.count++, i = gs.bind(this), u.addEventListener("load", i), u.addEventListener("error", i), h ? h.parentNode.insertBefore(u, h.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(u, e.firstChild)), t.state.loading |= 4;
      }
    }
    var Mo = {
      $$typeof: R,
      Provider: null,
      Consumer: null,
      _currentValue: ie,
      _currentValue2: ie,
      _threadCount: 0
    };
    function Tw(e, t, a, i, u, h, x, M, I) {
      this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = yr(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = yr(0), this.hiddenUpdates = yr(null), this.identifierPrefix = i, this.onUncaughtError = u, this.onCaughtError = h, this.onRecoverableError = x, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = I, this.incompleteTransitions = /* @__PURE__ */ new Map();
    }
    function Bp(e, t, a, i, u, h, x, M, I, G, te, re) {
      return e = new Tw(e, t, a, x, I, G, te, re, M), t = 1, h === true && (t |= 24), h = pn(3, null, null, t), e.current = h, h.stateNode = e, t = Qc(), t.refCount++, e.pooledCache = t, t.refCount++, h.memoizedState = {
        element: i,
        isDehydrated: a,
        cache: t
      }, eu(h), e;
    }
    function Xp(e) {
      return e ? (e = la, e) : la;
    }
    function Vp(e, t, a, i, u, h) {
      u = Xp(u), i.context === null ? i.context = u : i.pendingContext = u, i = Vl(t), i.payload = {
        element: a
      }, h = h === void 0 ? null : h, h !== null && (i.callback = h), a = $l(e, i, t), a !== null && (dn(a, e, t), ro(a, e, t));
    }
    function $p(e, t) {
      if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
        var a = e.retryLane;
        e.retryLane = a !== 0 && a < t ? a : t;
      }
    }
    function bd(e, t) {
      $p(e, t), (e = e.alternate) && $p(e, t);
    }
    function qp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Er(e, 67108864);
        t !== null && dn(t, e, 67108864), bd(e, 67108864);
      }
    }
    function Gp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = wn();
        t = Kn(t);
        var a = Er(e, t);
        a !== null && dn(a, e, t), bd(e, t);
      }
    }
    var bs = true;
    function Nw(e, t, a, i) {
      var u = $.T;
      $.T = null;
      var h = F.p;
      try {
        F.p = 2, vd(e, t, a, i);
      } finally {
        F.p = h, $.T = u;
      }
    }
    function Ow(e, t, a, i) {
      var u = $.T;
      $.T = null;
      var h = F.p;
      try {
        F.p = 8, vd(e, t, a, i);
      } finally {
        F.p = h, $.T = u;
      }
    }
    function vd(e, t, a, i) {
      if (bs) {
        var u = xd(i);
        if (u === null) ad(e, t, i, vs, a), Zp(e, i);
        else if (Iw(u, e, t, a, i)) i.stopPropagation();
        else if (Zp(e, i), t & 4 && -1 < Dw.indexOf(e)) {
          for (; u !== null; ) {
            var h = Ze(u);
            if (h !== null) switch (h.tag) {
              case 3:
                if (h = h.stateNode, h.current.memoizedState.isDehydrated) {
                  var x = En(h.pendingLanes);
                  if (x !== 0) {
                    var M = h;
                    for (M.pendingLanes |= 2, M.entangledLanes |= 2; x; ) {
                      var I = 1 << 31 - Wt(x);
                      M.entanglements[1] |= I, x &= ~I;
                    }
                    ll(h), (We & 6) === 0 && (ts = jt() + 500, wo(0));
                  }
                }
                break;
              case 31:
              case 13:
                M = Er(h, 2), M !== null && dn(M, h, 2), ls(), bd(h, 2);
            }
            if (h = xd(i), h === null && ad(e, t, i, vs, a), h === u) break;
            u = h;
          }
          u !== null && i.stopPropagation();
        } else ad(e, t, i, null, a);
      }
    }
    function xd(e) {
      return e = Sc(e), wd(e);
    }
    var vs = null;
    function wd(e) {
      if (vs = null, e = Et(e), e !== null) {
        var t = c(e);
        if (t === null) e = null;
        else {
          var a = t.tag;
          if (a === 13) {
            if (e = d(t), e !== null) return e;
            e = null;
          } else if (a === 31) {
            if (e = f(t), e !== null) return e;
            e = null;
          } else if (a === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return vs = e, null;
    }
    function Pp(e) {
      switch (e) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (il()) {
            case Rl:
              return 2;
            case Al:
              return 8;
            case Vr:
            case gc:
              return 32;
            case Ya:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Sd = false, tr = null, nr = null, lr = null, jo = /* @__PURE__ */ new Map(), Lo = /* @__PURE__ */ new Map(), rr = [], Dw = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function Zp(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          tr = null;
          break;
        case "dragenter":
        case "dragleave":
          nr = null;
          break;
        case "mouseover":
        case "mouseout":
          lr = null;
          break;
        case "pointerover":
        case "pointerout":
          jo.delete(t.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Lo.delete(t.pointerId);
      }
    }
    function Ro(e, t, a, i, u, h) {
      return e === null || e.nativeEvent !== h ? (e = {
        blockedOn: t,
        domEventName: a,
        eventSystemFlags: i,
        nativeEvent: h,
        targetContainers: [
          u
        ]
      }, t !== null && (t = Ze(t), t !== null && qp(t)), e) : (e.eventSystemFlags |= i, t = e.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), e);
    }
    function Iw(e, t, a, i, u) {
      switch (t) {
        case "focusin":
          return tr = Ro(tr, e, t, a, i, u), true;
        case "dragenter":
          return nr = Ro(nr, e, t, a, i, u), true;
        case "mouseover":
          return lr = Ro(lr, e, t, a, i, u), true;
        case "pointerover":
          var h = u.pointerId;
          return jo.set(h, Ro(jo.get(h) || null, e, t, a, i, u)), true;
        case "gotpointercapture":
          return h = u.pointerId, Lo.set(h, Ro(Lo.get(h) || null, e, t, a, i, u)), true;
      }
      return false;
    }
    function Kp(e) {
      var t = Et(e.target);
      if (t !== null) {
        var a = c(t);
        if (a !== null) {
          if (t = a.tag, t === 13) {
            if (t = d(a), t !== null) {
              e.blockedOn = t, vr(e.priority, function() {
                Gp(a);
              });
              return;
            }
          } else if (t === 31) {
            if (t = f(a), t !== null) {
              e.blockedOn = t, vr(e.priority, function() {
                Gp(a);
              });
              return;
            }
          } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
            e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function xs(e) {
      if (e.blockedOn !== null) return false;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var a = xd(e.nativeEvent);
        if (a === null) {
          a = e.nativeEvent;
          var i = new a.constructor(a.type, a);
          wc = i, a.target.dispatchEvent(i), wc = null;
        } else return t = Ze(a), t !== null && qp(t), e.blockedOn = a, false;
        t.shift();
      }
      return true;
    }
    function Qp(e, t, a) {
      xs(e) && a.delete(t);
    }
    function zw() {
      Sd = false, tr !== null && xs(tr) && (tr = null), nr !== null && xs(nr) && (nr = null), lr !== null && xs(lr) && (lr = null), jo.forEach(Qp), Lo.forEach(Qp);
    }
    function ws(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Sd || (Sd = true, l.unstable_scheduleCallback(l.unstable_NormalPriority, zw)));
    }
    var Ss = null;
    function Fp(e) {
      Ss !== e && (Ss = e, l.unstable_scheduleCallback(l.unstable_NormalPriority, function() {
        Ss === e && (Ss = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t], i = e[t + 1], u = e[t + 2];
          if (typeof i != "function") {
            if (wd(i || a) === null) continue;
            break;
          }
          var h = Ze(a);
          h !== null && (e.splice(t, 3), t -= 3, xu(h, {
            pending: true,
            data: u,
            method: a.method,
            action: i
          }, i, u));
        }
      }));
    }
    function Ma(e) {
      function t(I) {
        return ws(I, e);
      }
      tr !== null && ws(tr, e), nr !== null && ws(nr, e), lr !== null && ws(lr, e), jo.forEach(t), Lo.forEach(t);
      for (var a = 0; a < rr.length; a++) {
        var i = rr[a];
        i.blockedOn === e && (i.blockedOn = null);
      }
      for (; 0 < rr.length && (a = rr[0], a.blockedOn === null); ) Kp(a), a.blockedOn === null && rr.shift();
      if (a = (e.ownerDocument || e).$$reactFormReplay, a != null) for (i = 0; i < a.length; i += 3) {
        var u = a[i], h = a[i + 1], x = u[ne] || null;
        if (typeof h == "function") x || Fp(a);
        else if (x) {
          var M = null;
          if (h && h.hasAttribute("formAction")) {
            if (u = h, x = h[ne] || null) M = x.formAction;
            else if (wd(u) !== null) continue;
          } else M = x.action;
          typeof M == "function" ? a[i + 1] = M : (a.splice(i, 3), i -= 3), Fp(a);
        }
      }
    }
    function Wp() {
      function e(h) {
        h.canIntercept && h.info === "react-transition" && h.intercept({
          handler: function() {
            return new Promise(function(x) {
              return u = x;
            });
          },
          focusReset: "manual",
          scroll: "manual"
        });
      }
      function t() {
        u !== null && (u(), u = null), i || setTimeout(a, 20);
      }
      function a() {
        if (!i && !navigation.transition) {
          var h = navigation.currentEntry;
          h && h.url != null && navigation.navigate(h.url, {
            state: h.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if (typeof navigation == "object") {
        var i = false, u = null;
        return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
          i = true, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), u !== null && (u(), u = null);
        };
      }
    }
    function Cd(e) {
      this._internalRoot = e;
    }
    Cs.prototype.render = Cd.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null) throw Error(o(409));
      var a = t.current, i = wn();
      Vp(a, i, e, t, null, null);
    }, Cs.prototype.unmount = Cd.prototype.unmount = function() {
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        Vp(e.current, 2, null, e, null, null), ls(), t[Te] = null;
      }
    };
    function Cs(e) {
      this._internalRoot = e;
    }
    Cs.prototype.unstable_scheduleHydration = function(e) {
      if (e) {
        var t = Qn();
        e = {
          blockedOn: null,
          target: e,
          priority: t
        };
        for (var a = 0; a < rr.length && t !== 0 && t < rr[a].priority; a++) ;
        rr.splice(a, 0, e), a === 0 && Kp(e);
      }
    };
    var Jp = n.version;
    if (Jp !== "19.2.4") throw Error(o(527, Jp, "19.2.4"));
    F.findDOMNode = function(e) {
      var t = e._reactInternals;
      if (t === void 0) throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
      return e = p(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
    };
    var Hw = {
      bundleType: 0,
      version: "19.2.4",
      rendererPackageName: "react-dom",
      currentDispatcherRef: $,
      reconcilerVersion: "19.2.4"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
      var Es = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Es.isDisabled && Es.supportsFiber) try {
        Tl = Es.inject(Hw), Ft = Es;
      } catch {
      }
    }
    return To.createRoot = function(e, t) {
      if (!s(e)) throw Error(o(299));
      var a = false, i = "", u = og, h = ig, x = sg;
      return t != null && (t.unstable_strictMode === true && (a = true), t.identifierPrefix !== void 0 && (i = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (h = t.onCaughtError), t.onRecoverableError !== void 0 && (x = t.onRecoverableError)), t = Bp(e, 1, false, null, null, a, i, null, u, h, x, Wp), e[Te] = t.current, rd(e), new Cd(t);
    }, To.hydrateRoot = function(e, t, a) {
      if (!s(e)) throw Error(o(299));
      var i = false, u = "", h = og, x = ig, M = sg, I = null;
      return a != null && (a.unstable_strictMode === true && (i = true), a.identifierPrefix !== void 0 && (u = a.identifierPrefix), a.onUncaughtError !== void 0 && (h = a.onUncaughtError), a.onCaughtError !== void 0 && (x = a.onCaughtError), a.onRecoverableError !== void 0 && (M = a.onRecoverableError), a.formState !== void 0 && (I = a.formState)), t = Bp(e, 1, true, t, a ?? null, i, u, I, h, x, M, Wp), t.context = Xp(null), a = t.current, i = wn(), i = Kn(i), u = Vl(i), u.callback = null, $l(a, u, i), a = i, t.current.lanes = a, br(t, a), ll(t), e[Te] = t.current, rd(e), new Cs(t);
    }, To.version = "19.2.4", To;
  }
  var cy;
  function Zw() {
    if (cy) return kd.exports;
    cy = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), kd.exports = Pw(), kd.exports;
  }
  var Kw = Zw();
  const Qw = "modulepreload", Fw = function(l, n) {
    return new URL(l, n).href;
  }, uy = {}, ut = function(n, r, o) {
    let s = Promise.resolve();
    if (r && r.length > 0) {
      let d = function(v) {
        return Promise.all(v.map((b) => Promise.resolve(b).then((w) => ({
          status: "fulfilled",
          value: w
        }), (w) => ({
          status: "rejected",
          reason: w
        }))));
      };
      const f = document.getElementsByTagName("link"), m = document.querySelector("meta[property=csp-nonce]"), p = (m == null ? void 0 : m.nonce) || (m == null ? void 0 : m.getAttribute("nonce"));
      s = d(r.map((v) => {
        if (v = Fw(v, o), v in uy) return;
        uy[v] = true;
        const b = v.endsWith(".css"), w = b ? '[rel="stylesheet"]' : "";
        if (!!o) for (let S = f.length - 1; S >= 0; S--) {
          const C = f[S];
          if (C.href === v && (!b || C.rel === "stylesheet")) return;
        }
        else if (document.querySelector(`link[href="${v}"]${w}`)) return;
        const k = document.createElement("link");
        if (k.rel = b ? "stylesheet" : Qw, b || (k.as = "script"), k.crossOrigin = "", k.href = v, p && k.setAttribute("nonce", p), document.head.appendChild(k), b) return new Promise((S, C) => {
          k.addEventListener("load", S), k.addEventListener("error", () => C(new Error(`Unable to preload CSS for ${v}`)));
        });
      }));
    }
    function c(d) {
      const f = new Event("vite:preloadError", {
        cancelable: true
      });
      if (f.payload = d, window.dispatchEvent(f), !f.defaultPrevented) throw d;
    }
    return s.then((d) => {
      for (const f of d || []) f.status === "rejected" && c(f.reason);
      return n().catch(c);
    });
  }, dy = (l) => {
    let n;
    const r = /* @__PURE__ */ new Set(), o = (p, v) => {
      const b = typeof p == "function" ? p(n) : p;
      if (!Object.is(b, n)) {
        const w = n;
        n = v ?? (typeof b != "object" || b === null) ? b : Object.assign({}, n, b), r.forEach((E) => E(n, w));
      }
    }, s = () => n, f = {
      setState: o,
      getState: s,
      getInitialState: () => m,
      subscribe: (p) => (r.add(p), () => r.delete(p))
    }, m = n = l(o, s, f);
    return f;
  }, Ww = ((l) => l ? dy(l) : dy), Jw = (l) => l;
  function eS(l, n = Jw) {
    const r = Oa.useSyncExternalStore(l.subscribe, Oa.useCallback(() => n(l.getState()), [
      l,
      n
    ]), Oa.useCallback(() => n(l.getInitialState()), [
      l,
      n
    ]));
    return Oa.useDebugValue(r), r;
  }
  const fy = (l) => {
    const n = Ww(l), r = (o) => eS(n, o);
    return Object.assign(r, n), r;
  }, xt = ((l) => l ? fy(l) : fy);
  function tS(l, n) {
    let r;
    try {
      r = l();
    } catch {
      return;
    }
    return {
      getItem: (s) => {
        var c;
        const d = (m) => m === null ? null : JSON.parse(m, void 0), f = (c = r.getItem(s)) != null ? c : null;
        return f instanceof Promise ? f.then(d) : d(f);
      },
      setItem: (s, c) => r.setItem(s, JSON.stringify(c, void 0)),
      removeItem: (s) => r.removeItem(s)
    };
  }
  const Lf = (l) => (n) => {
    try {
      const r = l(n);
      return r instanceof Promise ? r : {
        then(o) {
          return Lf(o)(r);
        },
        catch(o) {
          return this;
        }
      };
    } catch (r) {
      return {
        then(o) {
          return this;
        },
        catch(o) {
          return Lf(o)(r);
        }
      };
    }
  }, nS = (l, n) => (r, o, s) => {
    let c = {
      storage: tS(() => window.localStorage),
      partialize: (C) => C,
      version: 0,
      merge: (C, _) => ({
        ..._,
        ...C
      }),
      ...n
    }, d = false, f = 0;
    const m = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
    let v = c.storage;
    if (!v) return l((...C) => {
      console.warn(`[zustand persist middleware] Unable to update item '${c.name}', the given storage is currently unavailable.`), r(...C);
    }, o, s);
    const b = () => {
      const C = c.partialize({
        ...o()
      });
      return v.setItem(c.name, {
        state: C,
        version: c.version
      });
    }, w = s.setState;
    s.setState = (C, _) => (w(C, _), b());
    const E = l((...C) => (r(...C), b()), o, s);
    s.getInitialState = () => E;
    let k;
    const S = () => {
      var C, _;
      if (!v) return;
      const L = ++f;
      d = false, m.forEach((T) => {
        var B;
        return T((B = o()) != null ? B : E);
      });
      const R = ((_ = c.onRehydrateStorage) == null ? void 0 : _.call(c, (C = o()) != null ? C : E)) || void 0;
      return Lf(v.getItem.bind(v))(c.name).then((T) => {
        if (T) if (typeof T.version == "number" && T.version !== c.version) {
          if (c.migrate) {
            const B = c.migrate(T.state, T.version);
            return B instanceof Promise ? B.then((N) => [
              true,
              N
            ]) : [
              true,
              B
            ];
          }
          console.error("State loaded from storage couldn't be migrated since no migrate function was provided");
        } else return [
          false,
          T.state
        ];
        return [
          false,
          void 0
        ];
      }).then((T) => {
        var B;
        if (L !== f) return;
        const [N, A] = T;
        if (k = c.merge(A, (B = o()) != null ? B : E), r(k, true), N) return b();
      }).then(() => {
        L === f && (R == null ? void 0 : R(o(), void 0), k = o(), d = true, p.forEach((T) => T(k)));
      }).catch((T) => {
        L === f && (R == null ? void 0 : R(void 0, T));
      });
    };
    return s.persist = {
      setOptions: (C) => {
        c = {
          ...c,
          ...C
        }, C.storage && (v = C.storage);
      },
      clearStorage: () => {
        v == null ? void 0 : v.removeItem(c.name);
      },
      getOptions: () => c,
      rehydrate: () => S(),
      hasHydrated: () => d,
      onHydrate: (C) => (m.add(C), () => {
        m.delete(C);
      }),
      onFinishHydration: (C) => (p.add(C), () => {
        p.delete(C);
      })
    }, c.skipHydration || S(), k || E;
  }, Wf = nS, In = {
    dark: "#44ff44",
    light: "#44ff44"
  }, Qs = {
    dark: "#ffffff",
    light: "#000000"
  };
  function Rf() {
    return typeof window > "u" || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function hy(l) {
    return l === "system" ? Rf() : l;
  }
  const Bo = 288, Ys = 200, Bs = 480, ge = xt()(Wf((l, n) => ({
    themeSetting: "system",
    theme: Rf(),
    wasmReady: false,
    cursorWorld: null,
    sidebarTab: "layers",
    inspectorFocusRequested: false,
    inspectorFocusField: null,
    showGrid: true,
    zenMode: false,
    explorerCollapsed: false,
    sidebarCollapsed: false,
    explorerWidth: Bo,
    sidebarWidth: Bo,
    setThemeSetting: (r) => l({
      themeSetting: r,
      theme: hy(r)
    }),
    toggleTheme: () => l((r) => {
      const o = r.theme === "dark" ? "light" : "dark";
      return {
        themeSetting: o,
        theme: o
      };
    }),
    syncSystemTheme: () => l((r) => r.themeSetting === "system" ? {
      theme: Rf()
    } : {}),
    setWasmReady: (r) => l({
      wasmReady: r
    }),
    setCursorWorld: (r) => l({
      cursorWorld: r
    }),
    getSelectionColor: () => In[n().theme],
    setSidebarTab: (r) => l({
      sidebarTab: r
    }),
    requestInspectorFocus: () => l({
      sidebarTab: "inspector",
      inspectorFocusRequested: true,
      inspectorFocusField: null
    }),
    requestInspectorFocusField: (r) => l({
      sidebarTab: "inspector",
      inspectorFocusRequested: true,
      inspectorFocusField: r
    }),
    clearInspectorFocus: () => l({
      inspectorFocusRequested: false,
      inspectorFocusField: null
    }),
    toggleGrid: () => l((r) => ({
      showGrid: !r.showGrid
    })),
    toggleZenMode: () => l((r) => ({
      zenMode: !r.zenMode
    })),
    toggleExplorerCollapsed: () => l((r) => ({
      explorerCollapsed: !r.explorerCollapsed
    })),
    toggleSidebarCollapsed: () => l((r) => ({
      sidebarCollapsed: !r.sidebarCollapsed
    })),
    setExplorerCollapsed: (r) => l({
      explorerCollapsed: r
    }),
    setSidebarCollapsed: (r) => l({
      sidebarCollapsed: r
    }),
    setExplorerWidth: (r) => l({
      explorerWidth: Math.round(Math.max(Ys, Math.min(Bs, r)))
    }),
    setSidebarWidth: (r) => l({
      sidebarWidth: Math.round(Math.max(Ys, Math.min(Bs, r)))
    })
  }), {
    name: "rosette-ui",
    partialize: (l) => ({
      themeSetting: l.themeSetting,
      showGrid: l.showGrid,
      zenMode: l.zenMode,
      explorerCollapsed: l.explorerCollapsed,
      sidebarCollapsed: l.sidebarCollapsed,
      explorerWidth: l.explorerWidth,
      sidebarWidth: l.sidebarWidth
    }),
    onRehydrateStorage: () => (l) => {
      if (l) {
        l.theme = hy(l.themeSetting);
        const n = (r) => Math.round(Math.max(Ys, Math.min(Bs, r)));
        l.explorerWidth = n(l.explorerWidth), l.sidebarWidth = n(l.sidebarWidth);
      }
    }
  }));
  typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    ge.getState().syncSystemTheme();
  });
  let Xo = null, No = null;
  async function lS() {
    if (Xo) return Xo;
    if (No) return No;
    No = (async () => {
      const l = await ut(() => import("./rosette_wasm-BHxly6r2.js"), [], import.meta.url);
      return await l.default(), Xo = l, l;
    })();
    try {
      return await No;
    } catch (l) {
      throw No = null, l;
    }
  }
  function Bv() {
    const [l, n] = g.useState(Xo), [r, o] = g.useState(!Xo), [s, c] = g.useState(null), d = ge((f) => f.setWasmReady);
    return g.useEffect(() => {
      let f = true;
      return lS().then((m) => {
        f && (n(m), o(false), d(true));
      }).catch((m) => {
        console.error("Failed to load WASM module:", m), f && (c(m), o(false));
      }), () => {
        f = false;
      };
    }, [
      d
    ]), {
      wasm: l,
      isLoading: r,
      error: s,
      isReady: !!l && !r && !s
    };
  }
  const nc = 1.18, lc = 0.82, rS = 1.5, aS = 0.67, oS = 8, iS = 24, Xv = 100, sS = 200, my = 1e6, gy = 1e3, cS = [
    1,
    2,
    5,
    10,
    20,
    50,
    100,
    200,
    500,
    1e3
  ], py = 0.1, Vv = 100, $v = "'Source Code Pro', monospace", uS = 530, Jf = 0.72, ve = 50, Xs = Math.pow(2, -6), Rd = 1e-18, Ad = 3, Oe = xt((l, n) => ({
    zoom: Xs,
    offset: {
      x: 0,
      y: 0
    },
    initialized: false,
    setZoom: (r) => l({
      zoom: Math.max(Rd, Math.min(Ad, r))
    }),
    zoomAt: (r, o, s) => {
      const c = n(), d = Math.max(Rd, Math.min(Ad, c.zoom * r)), f = (o - c.offset.x) / c.zoom, m = (s - c.offset.y) / c.zoom, p = o - f * d, v = s - m * d;
      l({
        zoom: d,
        offset: {
          x: p,
          y: v
        }
      });
    },
    pan: (r, o) => l((s) => ({
      offset: {
        x: s.offset.x + r,
        y: s.offset.y + o
      }
    })),
    setOffset: (r, o) => l({
      offset: {
        x: r,
        y: o
      }
    }),
    reset: (r, o) => l({
      zoom: Xs,
      offset: {
        x: r / 2,
        y: o / 2
      },
      initialized: true
    }),
    initOffset: (r, o) => {
      n().initialized || l({
        offset: {
          x: r / 2,
          y: o / 2
        },
        initialized: true
      });
    },
    zoomToBounds: (r, o, s, c) => {
      const d = Math.abs(r.maxX - r.minX), f = Math.abs(r.maxY - r.minY), m = 1e3, p = Math.max(d, m), v = Math.max(f, m), b = p * py, w = v * py, E = p + b * 2, k = v + w * 2, S = (r.minX + r.maxX) / 2, C = (r.minY + r.maxY) / 2, _ = o / E, L = s / k, R = Math.max(Rd, Math.min(_, L, Ad)), T = c ? c.x : o / 2, B = c ? c.y : s / 2, N = {
        x: T - S * R,
        y: B - C * R
      };
      l({
        zoom: R,
        offset: N
      });
    },
    zoomToFit: (r, o, s, c) => {
      if (r) n().zoomToBounds(r, o, s, c);
      else {
        const d = c ? c.x : o / 2, f = c ? c.y : s / 2;
        l({
          zoom: Xs,
          offset: {
            x: d,
            y: f
          },
          initialized: true
        });
      }
    },
    zoomToSelected: (r, o, s, c) => {
      r && n().zoomToBounds(r, o, s, c);
    },
    centerOnBounds: (r, o, s, c) => {
      const d = n(), f = (r.minX + r.maxX) / 2, m = (r.minY + r.maxY) / 2, p = c ? c.x : o / 2, v = c ? c.y : s / 2, b = {
        x: p - f * d.zoom,
        y: v - m * d.zoom
      };
      l({
        offset: b
      });
    }
  }));
  if (typeof window < "u" && window.parent !== window) {
    const l = (n) => {
      window.parent.postMessage({
        type: "rosette-viewport",
        zoom: n.zoom,
        offsetX: n.offset.x,
        offsetY: n.offset.y
      }, "*");
    };
    Oe.subscribe(l), l(Oe.getState());
  }
  function _s(l) {
    const n = l.replace("#", ""), r = Number.parseInt(n.slice(0, 2), 16) / 255, o = Number.parseInt(n.slice(2, 4), 16) / 255, s = Number.parseInt(n.slice(4, 6), 16) / 255;
    return [
      r,
      o,
      s,
      1
    ];
  }
  function dS(l) {
    const { wasm: n, isReady: r } = Bv(), [o, s] = g.useState(null), [c, d] = g.useState(false), [f, m] = g.useState(null), p = g.useRef(null), v = ge((_) => _.theme), b = ge((_) => _.showGrid), { zoom: w, offset: E } = Oe();
    g.useEffect(() => {
      if (!r || !n || !l) return;
      let _ = true;
      async function L() {
        try {
          const R = await n.WasmRenderer.create(l);
          if (!_) {
            R.destroy();
            return;
          }
          R.set_theme(v === "dark");
          const T = In[v], [B, N, A, H] = _s(T);
          R.set_selection_color(B, N, A, H);
          const z = Qs[v], [P, ee, J, ce] = _s(z);
          R.set_hover_color(P, ee, J, ce), R.set_dpr(window.devicePixelRatio || 1), p.current = R, s(R), d(true);
        } catch (R) {
          console.error("Failed to create renderer:", R), _ && m(R);
        }
      }
      return L(), () => {
        _ = false, p.current && (p.current.destroy(), p.current = null);
      };
    }, [
      r,
      n,
      l
    ]), g.useEffect(() => {
      if (o && c) {
        o.set_theme(v === "dark");
        const _ = In[v], [L, R, T, B] = _s(_);
        o.set_selection_color(L, R, T, B);
        const N = Qs[v], [A, H, z, P] = _s(N);
        o.set_hover_color(A, H, z, P);
      }
    }, [
      o,
      c,
      v
    ]), g.useEffect(() => {
      o && c && o.set_grid_visible(b);
    }, [
      o,
      c,
      b
    ]), g.useEffect(() => {
      if (o && c) {
        const _ = window.devicePixelRatio || 1;
        o.set_viewport(E.x * _, E.y * _, w * _);
      }
    }, [
      o,
      c,
      w,
      E.x,
      E.y
    ]);
    const k = g.useCallback(() => {
      o && c && o.render();
    }, [
      o,
      c
    ]), S = g.useCallback((_, L) => {
      o && c && (o.set_dpr(window.devicePixelRatio || 1), o.resize(_, L));
    }, [
      o,
      c
    ]), C = g.useCallback((_, L) => {
      if (o && c) {
        const R = window.devicePixelRatio || 1, T = o.screen_to_world(_ * R, L * R);
        return {
          x: T[0],
          y: T[1]
        };
      }
      return null;
    }, [
      o,
      c
    ]);
    return {
      renderer: o,
      isReady: c,
      error: f,
      render: k,
      resize: S,
      screenToWorld: C
    };
  }
  const Bt = xt((l) => ({
    activeTool: "select",
    toolSetAt: 0,
    setTool: (n) => l({
      activeTool: n,
      toolSetAt: Date.now()
    })
  })), ae = xt((l) => ({
    selectedIds: /* @__PURE__ */ new Set(),
    hoveredId: null,
    lastSelectedId: null,
    select: (n) => l({
      selectedIds: /* @__PURE__ */ new Set([
        n
      ]),
      lastSelectedId: n
    }),
    addToSelection: (n) => l((r) => ({
      selectedIds: /* @__PURE__ */ new Set([
        ...r.selectedIds,
        n
      ]),
      lastSelectedId: n
    })),
    toggleSelection: (n) => l((r) => {
      const o = new Set(r.selectedIds);
      if (o.has(n)) {
        o.delete(n);
        const s = r.lastSelectedId === n ? o.size > 0 ? [
          ...o
        ][o.size - 1] : null : r.lastSelectedId;
        return {
          selectedIds: o,
          lastSelectedId: s
        };
      } else return o.add(n), {
        selectedIds: o,
        lastSelectedId: n
      };
    }),
    deselect: (n) => l((r) => {
      const o = new Set(r.selectedIds);
      o.delete(n);
      const s = r.lastSelectedId === n ? o.size > 0 ? [
        ...o
      ][o.size - 1] : null : r.lastSelectedId;
      return {
        selectedIds: o,
        lastSelectedId: s
      };
    }),
    removeFromSelection: (n) => ae.getState().deselect(n),
    clearSelection: () => l({
      selectedIds: /* @__PURE__ */ new Set(),
      lastSelectedId: null
    }),
    selectAll: (n) => l({
      selectedIds: new Set(n),
      lastSelectedId: n.length > 0 ? n[n.length - 1] : null
    }),
    setSelection: (n) => l({
      selectedIds: n,
      lastSelectedId: n.size > 0 ? [
        ...n
      ][n.size - 1] : null
    }),
    setHover: (n) => l({
      hoveredId: n
    }),
    selectNext: (n) => l((r) => {
      if (n.length === 0) return r;
      if (r.selectedIds.size === 0) return {
        selectedIds: /* @__PURE__ */ new Set([
          n[0]
        ]),
        lastSelectedId: n[0]
      };
      const o = r.lastSelectedId ?? [
        ...r.selectedIds
      ][0], s = n.indexOf(o);
      if (s === -1) return {
        selectedIds: /* @__PURE__ */ new Set([
          n[0]
        ]),
        lastSelectedId: n[0]
      };
      const c = (s + 1) % n.length, d = n[c];
      return {
        selectedIds: /* @__PURE__ */ new Set([
          d
        ]),
        lastSelectedId: d
      };
    }),
    selectPrevious: (n) => l((r) => {
      if (n.length === 0) return r;
      if (r.selectedIds.size === 0) {
        const f = n[n.length - 1];
        return {
          selectedIds: /* @__PURE__ */ new Set([
            f
          ]),
          lastSelectedId: f
        };
      }
      const o = r.lastSelectedId ?? [
        ...r.selectedIds
      ][0], s = n.indexOf(o);
      if (s === -1) {
        const f = n[n.length - 1];
        return {
          selectedIds: /* @__PURE__ */ new Set([
            f
          ]),
          lastSelectedId: f
        };
      }
      const c = (s - 1 + n.length) % n.length, d = n[c];
      return {
        selectedIds: /* @__PURE__ */ new Set([
          d
        ]),
        lastSelectedId: d
      };
    })
  })), rc = xt((l) => ({
    isOpen: false,
    position: {
      x: 0,
      y: 0
    },
    variant: "canvas",
    targetId: null,
    open: (n, r, o = null) => l({
      isOpen: true,
      position: r,
      variant: n,
      targetId: o
    }),
    close: () => l({
      isOpen: false
    })
  }));
  function Td() {
    return `ruler-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  const Ae = xt((l, n) => ({
    rulers: /* @__PURE__ */ new Map(),
    activeRulerId: null,
    previewEnd: null,
    selectedRulerIds: /* @__PURE__ */ new Set(),
    hoveredRulerId: null,
    marqueePreviewIds: /* @__PURE__ */ new Set(),
    hoveredEndpoint: null,
    draggingEndpoint: null,
    draggingEndpointOriginal: null,
    isMovingRuler: false,
    moveStartPoint: null,
    moveOriginalPoint: null,
    snapPoint: null,
    startRuler: (r) => {
      const o = Td(), s = {
        id: o,
        start: r,
        end: r
      };
      return l((c) => {
        const d = new Map(c.rulers);
        return d.set(o, s), {
          rulers: d,
          activeRulerId: o,
          previewEnd: r
        };
      }), o;
    },
    updatePreview: (r) => {
      const o = n();
      o.activeRulerId && l((s) => {
        const c = new Map(s.rulers), d = c.get(o.activeRulerId);
        return d && c.set(o.activeRulerId, {
          ...d,
          end: r
        }), {
          rulers: c,
          previewEnd: r
        };
      });
    },
    finalizeRuler: (r) => {
      const o = n();
      if (!o.activeRulerId) return null;
      const s = o.rulers.get(o.activeRulerId);
      if (!s) return null;
      const c = {
        ...s,
        end: r
      };
      return l((d) => {
        const f = new Map(d.rulers);
        return f.set(o.activeRulerId, c), {
          rulers: f,
          activeRulerId: null,
          previewEnd: null
        };
      }), c;
    },
    cancelCreation: () => {
      const r = n();
      r.activeRulerId && l((o) => {
        const s = new Map(o.rulers);
        return s.delete(r.activeRulerId), {
          rulers: s,
          activeRulerId: null,
          previewEnd: null
        };
      });
    },
    updateEndpoint: (r, o, s) => {
      l((c) => {
        const d = new Map(c.rulers), f = d.get(r);
        return f && d.set(r, {
          ...f,
          [o]: s
        }), {
          rulers: d
        };
      });
    },
    removeRuler: (r) => {
      l((o) => {
        var _a, _b2;
        const s = new Map(o.rulers);
        s.delete(r);
        const c = new Set(o.selectedRulerIds);
        return c.delete(r), {
          rulers: s,
          selectedRulerIds: c,
          hoveredRulerId: o.hoveredRulerId === r ? null : o.hoveredRulerId,
          hoveredEndpoint: ((_a = o.hoveredEndpoint) == null ? void 0 : _a.rulerId) === r ? null : o.hoveredEndpoint,
          draggingEndpoint: ((_b2 = o.draggingEndpoint) == null ? void 0 : _b2.rulerId) === r ? null : o.draggingEndpoint
        };
      });
    },
    removeRulers: (r) => {
      l((o) => {
        const s = new Map(o.rulers), c = new Set(o.selectedRulerIds);
        for (const d of r) s.delete(d), c.delete(d);
        return {
          rulers: s,
          selectedRulerIds: c,
          hoveredRulerId: r.includes(o.hoveredRulerId ?? "") ? null : o.hoveredRulerId,
          hoveredEndpoint: o.hoveredEndpoint && r.includes(o.hoveredEndpoint.rulerId) ? null : o.hoveredEndpoint,
          draggingEndpoint: o.draggingEndpoint && r.includes(o.draggingEndpoint.rulerId) ? null : o.draggingEndpoint
        };
      });
    },
    clearAllRulers: () => l({
      rulers: /* @__PURE__ */ new Map(),
      activeRulerId: null,
      previewEnd: null,
      selectedRulerIds: /* @__PURE__ */ new Set(),
      hoveredRulerId: null,
      marqueePreviewIds: /* @__PURE__ */ new Set(),
      hoveredEndpoint: null,
      draggingEndpoint: null,
      draggingEndpointOriginal: null,
      isMovingRuler: false,
      moveStartPoint: null,
      moveOriginalPoint: null,
      snapPoint: null
    }),
    setHoveredEndpoint: (r) => l({
      hoveredEndpoint: r
    }),
    setDraggingEndpoint: (r) => {
      if (r) {
        const o = n().rulers.get(r.rulerId), s = o ? {
          ...o[r.endpoint]
        } : null;
        l({
          draggingEndpoint: r,
          draggingEndpointOriginal: s
        });
      } else l({
        draggingEndpoint: null
      });
    },
    endDraggingEndpoint: () => {
      const r = n(), { draggingEndpoint: o, draggingEndpointOriginal: s, rulers: c } = r;
      if (!o || !s) return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), null;
      const d = c.get(o.rulerId);
      if (!d) return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), null;
      const f = d[o.endpoint], m = f.x !== s.x || f.y !== s.y;
      return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), m ? {
        rulerId: o.rulerId,
        endpoint: o.endpoint,
        oldPosition: s,
        newPosition: {
          ...f
        }
      } : null;
    },
    selectRuler: (r) => l({
      selectedRulerIds: r ? /* @__PURE__ */ new Set([
        r
      ]) : /* @__PURE__ */ new Set()
    }),
    toggleSelection: (r) => l((o) => {
      const s = new Set(o.selectedRulerIds);
      return s.has(r) ? s.delete(r) : s.add(r), {
        selectedRulerIds: s
      };
    }),
    addToSelection: (r) => {
      l((o) => {
        const s = new Set(o.selectedRulerIds);
        for (const c of r) s.add(c);
        return {
          selectedRulerIds: s
        };
      });
    },
    setSelection: (r) => l({
      selectedRulerIds: r
    }),
    clearSelection: () => l({
      selectedRulerIds: /* @__PURE__ */ new Set()
    }),
    setHoveredRuler: (r) => l({
      hoveredRulerId: r
    }),
    setMarqueePreviewIds: (r) => l({
      marqueePreviewIds: new Set(r)
    }),
    startMoveRuler: (r) => {
      n().selectedRulerIds.size !== 0 && l({
        isMovingRuler: true,
        moveStartPoint: r,
        moveOriginalPoint: r
      });
    },
    moveRuler: (r) => {
      const o = n();
      if (!o.isMovingRuler || o.selectedRulerIds.size === 0 || !o.moveStartPoint) return;
      const s = r.x - o.moveStartPoint.x, c = r.y - o.moveStartPoint.y;
      l((d) => {
        const f = new Map(d.rulers);
        for (const m of o.selectedRulerIds) {
          const p = f.get(m);
          p && f.set(m, {
            ...p,
            start: {
              x: p.start.x + s,
              y: p.start.y + c
            },
            end: {
              x: p.end.x + s,
              y: p.end.y + c
            }
          });
        }
        return {
          rulers: f,
          moveStartPoint: r
        };
      });
    },
    endMoveRuler: () => {
      const r = n(), { selectedRulerIds: o, moveStartPoint: s, moveOriginalPoint: c } = r;
      let d = null;
      if (s && c && o.size > 0) {
        const f = s.x - c.x, m = s.y - c.y;
        (f !== 0 || m !== 0) && (d = {
          rulerIds: [
            ...o
          ],
          deltaX: f,
          deltaY: m
        });
      }
      return l({
        isMovingRuler: false,
        moveStartPoint: null,
        moveOriginalPoint: null
      }), d;
    },
    deleteSelectedRulers: () => {
      const r = n();
      r.selectedRulerIds.size > 0 && n().removeRulers(Array.from(r.selectedRulerIds));
    },
    addRuler: (r, o) => {
      const s = Td(), c = {
        id: s,
        start: r,
        end: o
      };
      return l((d) => {
        const f = new Map(d.rulers);
        return f.set(s, c), {
          rulers: f
        };
      }), s;
    },
    restoreRulers: (r) => {
      const o = [];
      return l((s) => {
        const c = new Map(s.rulers);
        for (const d of r) {
          const f = Td();
          c.set(f, {
            ...d,
            id: f
          }), o.push(f);
        }
        return {
          rulers: c
        };
      }), o;
    },
    setSnapPoint: (r) => l({
      snapPoint: r
    })
  })), we = xt((l) => ({
    library: null,
    renderer: null,
    syncGeneration: 0,
    setLibrary: (n) => l({
      library: n
    }),
    setRenderer: (n) => l({
      renderer: n
    }),
    bumpSyncGeneration: () => l((n) => ({
      syncGeneration: n.syncGeneration + 1
    }))
  }));
  function qv(l) {
    const n = [
      l.name
    ];
    for (const r of l.children) n.push(...qv(r));
    return n;
  }
  function fS(l) {
    const n = /* @__PURE__ */ new Set(), r = [];
    for (const o of l) for (const s of qv(o)) n.has(s) || (n.add(s), r.push(s));
    return r;
  }
  function Gv(l) {
    const n = [];
    if (l.children.length > 0) {
      n.push(l.name);
      for (const r of l.children) n.push(...Gv(r));
    }
    return n;
  }
  function hS(l) {
    function n(o) {
      if (o.children.length === 0) return 1;
      let s = 0;
      for (const c of o.children) s = Math.max(s, n(c));
      return 1 + s;
    }
    let r = 0;
    for (const o of l) r = Math.max(r, n(o));
    return r;
  }
  const me = xt()(Wf((l) => ({
    projectName: "untitled-project",
    cells: [],
    cellTree: null,
    expandedCells: /* @__PURE__ */ new Set(),
    activeCell: null,
    editingCellName: null,
    cellsLoaded: false,
    hierarchyLevelLimit: 1 / 0,
    maxTreeDepth: 0,
    hiddenCells: /* @__PURE__ */ new Set(),
    setProjectName: (n) => l({
      projectName: n
    }),
    setCells: (n) => l((r) => {
      const o = r.activeCell && n.includes(r.activeCell) ? r.activeCell : n[0] ?? null;
      return {
        cells: n,
        activeCell: o,
        cellsLoaded: true
      };
    }),
    setCellTree: (n) => l((r) => {
      const o = fS(n), s = hS(n), c = r.expandedCells.size === 0 ? new Set(n.flatMap(Gv)) : r.expandedCells, d = r.activeCell && o.includes(r.activeCell) ? r.activeCell : o[0] ?? null;
      return {
        cellTree: n,
        cells: o,
        expandedCells: c,
        activeCell: d,
        maxTreeDepth: s,
        cellsLoaded: true
      };
    }),
    toggleExpanded: (n) => l((r) => {
      const o = new Set(r.expandedCells);
      return o.has(n) ? o.delete(n) : o.add(n), {
        expandedCells: o
      };
    }),
    setHierarchyLevelLimit: (n) => l({
      hierarchyLevelLimit: n
    }),
    setActiveCell: (n) => l({
      activeCell: n
    }),
    setEditingCellName: (n) => l({
      editingCellName: n
    }),
    renameCell: (n, r) => l((o) => {
      const s = o.cells.map((f) => f === n ? r : f), c = o.activeCell === n ? r : o.activeCell, d = new Set(o.hiddenCells);
      return d.has(n) && (d.delete(n), d.add(r)), {
        cells: s,
        activeCell: c,
        hiddenCells: d
      };
    }),
    removeCell: (n) => l((r) => {
      const o = r.cells.filter((d) => d !== n), s = r.activeCell === n ? o[0] ?? null : r.activeCell, c = new Set(r.hiddenCells);
      return c.delete(n), {
        cells: o,
        activeCell: s,
        hiddenCells: c
      };
    }),
    addCell: (n) => l((r) => r.cells.includes(n) ? r : {
      cells: [
        ...r.cells,
        n
      ]
    }),
    toggleCellVisibility: (n) => l((r) => {
      const o = new Set(r.hiddenCells);
      return o.has(n) ? o.delete(n) : o.add(n), {
        hiddenCells: o
      };
    }),
    showAllCells: () => l({
      hiddenCells: /* @__PURE__ */ new Set()
    }),
    hideAllCells: () => l((n) => ({
      hiddenCells: new Set(n.cells)
    }))
  }), {
    name: "rosette-explorer",
    partialize: (l) => ({
      projectName: l.projectName
    })
  }));
  me.subscribe((l, n) => {
    l.projectName !== n.projectName && ut(async () => {
      const { useTabsStore: r } = await Promise.resolve().then(() => i0);
      return {
        useTabsStore: r
      };
    }, void 0, import.meta.url).then(({ useTabsStore: r }) => {
      const { activeTabId: o, getActiveTab: s, updateTab: c } = r.getState();
      if (!o) return;
      const d = s();
      d && !d.filePath && c(o, {
        title: l.projectName
      });
    });
  });
  const Vs = xt((l) => ({
    cellName: null,
    bounds: null,
    origin: {
      x: 0,
      y: 0
    },
    startDrag: (n, r, o) => l({
      cellName: n,
      bounds: r,
      origin: o
    }),
    endDrag: () => l({
      cellName: null,
      bounds: null,
      origin: {
        x: 0,
        y: 0
      }
    })
  })), eh = "img:";
  function Sn(l) {
    return l.startsWith(eh);
  }
  function Ur(l) {
    return l.slice(eh.length);
  }
  function Wo(l) {
    return eh + l;
  }
  function Go(l, n) {
    const { images: r } = Ot.getState();
    let o = null, s = 1 / 0;
    for (const c of r.values()) if (l >= c.x && l <= c.x + c.width && n >= c.y && n <= c.y + c.height) {
      const d = c.width * c.height;
      d < s && (s = d, o = Wo(c.id));
    }
    return o;
  }
  function yy(l, n, r, o) {
    const { images: s } = Ot.getState(), c = [];
    for (const d of s.values()) {
      const f = d.x + d.width, m = d.y + d.height;
      d.x <= r && f >= l && d.y <= o && m >= n && c.push(Wo(d.id));
    }
    return c;
  }
  const Ot = xt((l, n) => ({
    images: /* @__PURE__ */ new Map(),
    addImage: (r) => {
      const o = new Map(n().images);
      o.set(r.id, r), l({
        images: o
      });
    },
    removeImage: (r) => {
      const o = new Map(n().images);
      o.delete(r), l({
        images: o
      });
    },
    updateImage: (r, o) => {
      const s = new Map(n().images), c = s.get(r);
      c && (s.set(r, {
        ...c,
        ...o
      }), l({
        images: s
      }));
    },
    clearImages: () => {
      for (const r of n().images.values()) URL.revokeObjectURL(r.url);
      l({
        images: /* @__PURE__ */ new Map()
      });
    }
  }));
  let zr = null;
  const Dt = xt((l) => ({
    message: null,
    level: "info",
    show: (n, r = "info", o = 3e3) => {
      zr !== null && clearTimeout(zr), l({
        message: n,
        level: r
      }), zr = setTimeout(() => {
        l({
          message: null
        }), zr = null;
      }, o);
    },
    clear: () => {
      zr !== null && (clearTimeout(zr), zr = null), l({
        message: null
      });
    }
  })), $n = xt((l) => ({
    isDirty: false,
    markDirty: () => l({
      isDirty: true
    }),
    markClean: () => l({
      isDirty: false
    })
  }));
  let Nd = null;
  function mS(l) {
    const n = (r) => {
      const o = r.useTabsStore.getState().activeTabId;
      o && r.useTabsStore.getState().updateTab(o, {
        isDirty: l
      });
    };
    Nd ? n(Nd) : ut(() => Promise.resolve().then(() => i0), void 0, import.meta.url).then((r) => {
      Nd = r, n(r);
    });
  }
  $n.subscribe((l, n) => {
    l.isDirty !== n.isDirty && mS(l.isDirty);
  });
  const by = 100, de = xt((l, n) => ({
    undoStack: [],
    redoStack: [],
    canUndo: false,
    canRedo: false,
    execute: (r, o) => {
      try {
        r.execute(o);
      } catch (s) {
        Dt.getState().show(String(s), "warn");
        return;
      }
      we.getState().bumpSyncGeneration(), $n.getState().markDirty(), l((s) => {
        const c = [
          ...s.undoStack,
          r
        ];
        return c.length > by && c.shift(), {
          undoStack: c,
          redoStack: [],
          canUndo: true,
          canRedo: false
        };
      });
    },
    undo: (r) => {
      const { undoStack: o } = n();
      if (o.length === 0) return;
      const s = o[o.length - 1];
      try {
        s.undo(r);
      } catch (c) {
        Dt.getState().show(String(c), "warn");
        return;
      }
      we.getState().bumpSyncGeneration(), $n.getState().markDirty(), l((c) => {
        const d = c.undoStack.slice(0, -1), f = [
          ...c.redoStack,
          s
        ];
        return {
          undoStack: d,
          redoStack: f,
          canUndo: d.length > 0,
          canRedo: true
        };
      });
    },
    redo: (r) => {
      const { redoStack: o } = n();
      if (o.length === 0) return;
      const s = o[o.length - 1];
      try {
        s.execute(r);
      } catch (c) {
        Dt.getState().show(String(c), "warn");
        return;
      }
      we.getState().bumpSyncGeneration(), $n.getState().markDirty(), l((c) => {
        const d = c.redoStack.slice(0, -1);
        return {
          undoStack: [
            ...c.undoStack,
            s
          ],
          redoStack: d,
          canUndo: true,
          canRedo: d.length > 0
        };
      });
    },
    clear: () => {
      l({
        undoStack: [],
        redoStack: [],
        canUndo: false,
        canRedo: false
      });
    },
    pushCommand: (r) => {
      $n.getState().markDirty(), l((o) => {
        const s = [
          ...o.undoStack,
          r
        ];
        return s.length > by && s.shift(), {
          undoStack: s,
          redoStack: [],
          canUndo: true,
          canRedo: false
        };
      });
    }
  })), zn = xt((l) => ({
    elements: [],
    hasContent: false,
    copy: (n) => l({
      elements: n,
      hasContent: n.length > 0
    }),
    clear: () => l({
      elements: [],
      hasContent: false
    })
  })), Af = {
    solid: 0,
    hatched: 1,
    crosshatched: 2,
    dotted: 3,
    horizontal: 4,
    vertical: 5,
    zigzag: 6,
    brick: 7
  }, Vo = [
    "#f44336",
    "#ff9800",
    "#ffeb3b",
    "#4caf50",
    "#00bcd4",
    "#2196f3",
    "#9c27b0",
    "#ff69b4",
    "#795548",
    "#607d8b",
    "#3f51b5",
    "#009688",
    "#e6e6e6",
    "#8d6e63",
    "#ff6f00",
    "#1a237e"
  ], Tf = 999, Fs = [
    {
      id: 1,
      layerNumber: 1,
      datatype: 0,
      name: "silicon",
      color: "#ff69b4",
      visible: true,
      fillPattern: "solid",
      opacity: 0.7
    },
    {
      id: 2,
      layerNumber: 10,
      datatype: 0,
      name: "metal",
      color: "#ffeb3b",
      visible: true,
      fillPattern: "solid",
      opacity: 0.7
    },
    {
      id: 3,
      layerNumber: 100,
      datatype: 0,
      name: "text",
      color: "#607d8b",
      visible: true,
      fillPattern: "dotted",
      opacity: 0.7
    }
  ], ye = xt((l, n) => ({
    layers: new Map(Fs.map((r) => [
      r.id,
      r
    ])),
    activeLayerId: 1,
    editingLayerId: null,
    expandedLayerId: null,
    getLayer: (r) => n().layers.get(r),
    getActiveLayer: () => {
      const r = n();
      return r.layers.get(r.activeLayerId);
    },
    setActiveLayer: (r) => l({
      activeLayerId: r
    }),
    setLayer: (r) => l((o) => {
      const s = new Map(o.layers);
      return s.set(r.id, r), {
        layers: s
      };
    }),
    addLayer: (r, o) => {
      const s = n(), c = Array.from(s.layers.values());
      let d = 1;
      const f = new Set(c.map((E) => E.layerNumber));
      for (; f.has(d) && d <= Tf; ) d++;
      if (d > Tf) return c[0];
      const p = Math.max(0, ...c.map((E) => E.id)) + 1, v = new Set(c.map((E) => E.color)), b = o ?? Vo.find((E) => !v.has(E)) ?? Vo[c.length % Vo.length], w = {
        id: p,
        layerNumber: d,
        datatype: 0,
        name: r ?? `layer${d}`,
        color: b,
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      };
      return l((E) => {
        const k = new Map(E.layers);
        return k.set(w.id, w), {
          layers: k,
          activeLayerId: w.id
        };
      }), w;
    },
    deleteLayer: (r) => l((o) => {
      if (o.layers.size <= 1) return o;
      const s = new Map(o.layers);
      s.delete(r);
      let c = o.activeLayerId;
      return o.activeLayerId === r && (c = s.keys().next().value ?? 1), {
        layers: s,
        activeLayerId: c
      };
    }),
    toggleVisibility: (r) => l((o) => {
      const s = o.layers.get(r);
      if (!s) return o;
      const c = new Map(o.layers);
      return c.set(r, {
        ...s,
        visible: !s.visible
      }), {
        layers: c
      };
    }),
    showAllLayers: () => l((r) => {
      const o = new Map(r.layers);
      for (const [s, c] of o) o.set(s, {
        ...c,
        visible: true
      });
      return {
        layers: o
      };
    }),
    hideAllLayers: () => l((r) => {
      const o = new Map(r.layers);
      for (const [s, c] of o) o.set(s, {
        ...c,
        visible: false
      });
      return {
        layers: o
      };
    }),
    getAllLayers: () => Array.from(n().layers.values()).sort((r, o) => r.layerNumber - o.layerNumber),
    layerExists: (r, o) => {
      const s = n().layers;
      for (const c of s.values()) if (c.layerNumber === r && c.datatype === o) return true;
      return false;
    },
    resetLayers: (r) => l(() => {
      var _a;
      const o = new Map(r.map((c) => [
        c.id,
        c
      ])), s = ((_a = r[0]) == null ? void 0 : _a.id) ?? 1;
      return {
        layers: o,
        activeLayerId: s,
        editingLayerId: null,
        expandedLayerId: null
      };
    }),
    setEditingLayerId: (r) => l({
      editingLayerId: r
    }),
    setExpandedLayerId: (r) => l({
      expandedLayerId: r
    })
  }));
  function ac(l, n = 0.7) {
    const r = l.replace("#", ""), o = Number.parseInt(r.slice(0, 2), 16) / 255, s = Number.parseInt(r.slice(2, 4), 16) / 255, c = Number.parseInt(r.slice(4, 6), 16) / 255;
    return [
      o,
      s,
      c,
      n
    ];
  }
  function Nf(l) {
    return {
      minX: l[0],
      minY: l[1],
      maxX: l[2],
      maxY: l[3]
    };
  }
  function Of(l) {
    return {
      x: (l.minX + l.maxX) / 2,
      y: (l.minY + l.maxY) / 2
    };
  }
  function gS(l, n) {
    const r = /* @__PURE__ */ new Set(), o = [];
    for (const s of n) {
      if (r.has(s)) continue;
      const d = l.get_group_ids(s).filter((f) => n.has(f));
      for (const f of d) r.add(f);
      d.length > 0 && o.push(d);
    }
    return o;
  }
  function pS(l, n, r, o) {
    const s = gS(l, n);
    if (o === "origin-align") return yS(l, s);
    if (s.length < 2 || !r) return [];
    const c = s.findIndex((v) => v.includes(r));
    if (c === -1) return [];
    const d = l.get_bounds_for_ids(s[c]);
    if (!d) return [];
    const f = Nf(d), m = Of(f), p = [];
    for (let v = 0; v < s.length; v++) {
      if (v === c) continue;
      const b = s[v], w = l.get_bounds_for_ids(b);
      if (!w) continue;
      const E = Nf(w), k = Of(E);
      let S = 0, C = 0;
      switch (o) {
        case "align-left":
          S = f.minX - E.minX;
          break;
        case "align-center-h":
          S = m.x - k.x;
          break;
        case "align-right":
          S = f.maxX - E.maxX;
          break;
        case "align-top":
          C = f.minY - E.minY;
          break;
        case "align-center-v":
          C = m.y - k.y;
          break;
        case "align-bottom":
          C = f.maxY - E.maxY;
          break;
        case "center-align":
          S = m.x - k.x, C = m.y - k.y;
          break;
      }
      (S !== 0 || C !== 0) && p.push({
        ids: b,
        dx: S,
        dy: C
      });
    }
    return p;
  }
  function yS(l, n) {
    const r = [];
    for (const o of n) {
      const s = l.get_bounds_for_ids(o);
      if (!s) continue;
      const c = Of(Nf(s)), d = -c.x, f = -c.y;
      (d !== 0 || f !== 0) && r.push({
        ids: o,
        dx: d,
        dy: f
      });
    }
    return r;
  }
  const Dn = "__TAURI__" in window;
  async function Jo(l, n) {
    const { invoke: r } = await ut(async () => {
      const { invoke: o } = await import("./core-DxBnVPgq.js");
      return {
        invoke: o
      };
    }, [], import.meta.url);
    return r(l, n);
  }
  async function Pv(l) {
    const n = await Jo("read_gds_bytes", {
      path: l
    });
    return new Uint8Array(n);
  }
  async function Zv(l, n) {
    return Jo("save_gds", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function Kv(l, n) {
    return Jo("save_bytes", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function Qv() {
    return Jo("get_pending_file");
  }
  async function Fv() {
    const { open: l } = await ut(async () => {
      const { open: r } = await import("./index-C2Rw4G7o.js");
      return {
        open: r
      };
    }, __vite__mapDeps([0,1]), import.meta.url), n = await l({
      title: "Open GDS File",
      filters: [
        {
          name: "GDS Files",
          extensions: [
            "gds",
            "gds2",
            "gdsii"
          ]
        }
      ],
      multiple: false,
      directory: false
    });
    return n === null ? null : n;
  }
  async function Wv(l) {
    const { save: n } = await ut(async () => {
      const { save: o } = await import("./index-C2Rw4G7o.js");
      return {
        save: o
      };
    }, __vite__mapDeps([0,1]), import.meta.url);
    return await n({
      title: "Save GDS File",
      filters: [
        {
          name: "GDS Files",
          extensions: [
            "gds"
          ]
        }
      ],
      defaultPath: l
    });
  }
  async function Jv(l) {
    const { save: n } = await ut(async () => {
      const { save: r } = await import("./index-C2Rw4G7o.js");
      return {
        save: r
      };
    }, __vite__mapDeps([0,1]), import.meta.url);
    return n({
      title: "Export Screenshot",
      filters: [
        {
          name: "PNG Image",
          extensions: [
            "png"
          ]
        }
      ],
      defaultPath: l
    });
  }
  async function e0() {
    const { open: l } = await ut(async () => {
      const { open: r } = await import("./index-C2Rw4G7o.js");
      return {
        open: r
      };
    }, __vite__mapDeps([0,1]), import.meta.url), n = await l({
      title: "Insert Image",
      filters: [
        {
          name: "Image Files",
          extensions: [
            "png",
            "jpg",
            "jpeg",
            "svg",
            "webp",
            "gif",
            "bmp"
          ]
        }
      ],
      multiple: false,
      directory: false
    });
    return n === null ? null : n;
  }
  async function t0(l) {
    const n = await Jo("read_gds_bytes", {
      path: l
    });
    return new Uint8Array(n);
  }
  async function n0(l, n) {
    const { listen: r } = await ut(async () => {
      const { listen: s } = await import("./event-BC8TvpKC.js");
      return {
        listen: s
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    return await r(l, (s) => n(s.payload));
  }
  const l0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    getPendingFile: Qv,
    isTauri: Dn,
    listenTauri: n0,
    pickGdsFile: Fv,
    pickImageFile: e0,
    pickSaveFile: Wv,
    pickSaveImageFile: Jv,
    readFileBytes: t0,
    readGdsBytes: Pv,
    saveBytes: Kv,
    saveGds: Zv
  }, Symbol.toStringTag, {
    value: "Module"
  })), r0 = 500 * ve, oc = 64, tn = xt((l, n) => ({
    width: r0,
    cornerRadius: 0,
    numArcPoints: oc,
    setWidth: (r) => l({
      width: r
    }),
    setCornerRadius: (r) => l({
      cornerRadius: r
    }),
    setNumArcPoints: (r) => l({
      numArcPoints: r
    }),
    pathMetadata: /* @__PURE__ */ new Map(),
    setPathMetadata: (r, o) => {
      const s = new Map(n().pathMetadata);
      s.set(r, o), l({
        pathMetadata: s
      });
    },
    removePathMetadata: (r) => {
      const o = new Map(n().pathMetadata);
      o.delete(r), l({
        pathMetadata: o
      });
    }
  }));
  function bS() {
    return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  const Ke = xt((l, n) => ({
    tabs: [],
    activeTabId: null,
    addTab: (r) => {
      const o = bS(), s = {
        id: o,
        title: (r == null ? void 0 : r.title) ?? "untitled",
        filePath: (r == null ? void 0 : r.filePath) ?? null,
        isDirty: false
      };
      return l((c) => ({
        tabs: [
          ...c.tabs,
          s
        ],
        activeTabId: o
      })), o;
    },
    closeTab: (r) => {
      const o = n(), s = o.tabs.findIndex((f) => f.id === r);
      if (s === -1) return false;
      const c = o.tabs.filter((f) => f.id !== r);
      let d = o.activeTabId;
      return o.activeTabId === r && (c.length === 0 ? d = null : s < c.length ? d = c[s].id : d = c[c.length - 1].id), l({
        tabs: c,
        activeTabId: d
      }), true;
    },
    setActiveTab: (r) => {
      n().tabs.some((s) => s.id === r) && l({
        activeTabId: r
      });
    },
    updateTab: (r, o) => {
      l((s) => ({
        tabs: s.tabs.map((c) => c.id === r ? {
          ...c,
          ...o
        } : c)
      }));
    },
    getActiveTab: () => {
      const r = n();
      return r.activeTabId ? r.tabs.find((o) => o.id === r.activeTabId) ?? null : null;
    },
    getTab: (r) => n().tabs.find((o) => o.id === r),
    findTabByPath: (r) => n().tabs.find((o) => o.filePath === r)
  })), ei = /* @__PURE__ */ new Map(), ur = /* @__PURE__ */ new Map();
  function Po(l) {
    const n = Oe.getState(), r = ae.getState(), o = de.getState(), s = ye.getState(), c = me.getState(), d = Bt.getState(), f = tn.getState(), m = Ae.getState(), p = zn.getState(), v = $n.getState(), b = {
      viewport: {
        zoom: n.zoom,
        offset: {
          ...n.offset
        },
        initialized: n.initialized
      },
      selection: {
        selectedIds: new Set(r.selectedIds),
        hoveredId: r.hoveredId,
        lastSelectedId: r.lastSelectedId
      },
      history: {
        undoStack: [
          ...o.undoStack
        ],
        redoStack: [
          ...o.redoStack
        ]
      },
      layers: {
        layers: new Map(s.layers),
        activeLayerId: s.activeLayerId
      },
      explorer: {
        projectName: c.projectName,
        cells: [
          ...c.cells
        ],
        cellTree: c.cellTree,
        expandedCells: new Set(c.expandedCells),
        activeCell: c.activeCell,
        cellsLoaded: c.cellsLoaded,
        hierarchyLevelLimit: c.hierarchyLevelLimit,
        maxTreeDepth: c.maxTreeDepth,
        hiddenCells: new Set(c.hiddenCells)
      },
      tool: {
        activeTool: d.activeTool
      },
      path: {
        width: f.width,
        cornerRadius: f.cornerRadius,
        numArcPoints: f.numArcPoints,
        pathMetadata: new Map(f.pathMetadata)
      },
      rulers: {
        rulers: new Map(m.rulers),
        selectedRulerIds: new Set(m.selectedRulerIds)
      },
      clipboard: {
        elements: [
          ...p.elements
        ],
        hasContent: p.hasContent
      },
      document: {
        isDirty: v.isDirty
      }
    };
    ei.set(l, b), Ke.getState().updateTab(l, {
      isDirty: v.isDirty
    });
  }
  function a0(l) {
    const n = ei.get(l);
    if (!n) return;
    Oe.setState({
      zoom: n.viewport.zoom,
      offset: {
        ...n.viewport.offset
      },
      initialized: n.viewport.initialized
    }), ae.setState({
      selectedIds: new Set(n.selection.selectedIds),
      hoveredId: n.selection.hoveredId,
      lastSelectedId: n.selection.lastSelectedId
    }), de.setState({
      undoStack: [
        ...n.history.undoStack
      ],
      redoStack: [
        ...n.history.redoStack
      ],
      canUndo: n.history.undoStack.length > 0,
      canRedo: n.history.redoStack.length > 0
    }), ye.setState({
      layers: new Map(n.layers.layers),
      activeLayerId: n.layers.activeLayerId,
      editingLayerId: null,
      expandedLayerId: null
    }), me.setState({
      projectName: n.explorer.projectName,
      cells: [
        ...n.explorer.cells
      ],
      cellTree: n.explorer.cellTree,
      expandedCells: new Set(n.explorer.expandedCells),
      activeCell: n.explorer.activeCell,
      editingCellName: null,
      cellsLoaded: n.explorer.cellsLoaded,
      hierarchyLevelLimit: n.explorer.hierarchyLevelLimit,
      maxTreeDepth: n.explorer.maxTreeDepth,
      hiddenCells: new Set(n.explorer.hiddenCells)
    }), Bt.setState({
      activeTool: n.tool.activeTool,
      toolSetAt: Date.now()
    }), tn.setState({
      width: n.path.width,
      cornerRadius: n.path.cornerRadius,
      numArcPoints: n.path.numArcPoints,
      pathMetadata: new Map(n.path.pathMetadata)
    }), Ae.setState({
      rulers: new Map(n.rulers.rulers),
      activeRulerId: null,
      previewEnd: null,
      selectedRulerIds: new Set(n.rulers.selectedRulerIds),
      hoveredRulerId: null,
      marqueePreviewIds: /* @__PURE__ */ new Set(),
      hoveredEndpoint: null,
      draggingEndpoint: null,
      draggingEndpointOriginal: null,
      isMovingRuler: false,
      moveStartPoint: null,
      moveOriginalPoint: null,
      snapPoint: null
    }), zn.setState({
      elements: [
        ...n.clipboard.elements
      ],
      hasContent: n.clipboard.hasContent
    }), $n.setState({
      isDirty: n.document.isDirty
    });
    const r = ur.get(l) ?? null;
    we.setState({
      library: r
    }), we.getState().bumpSyncGeneration();
  }
  function $s(l) {
    ei.delete(l);
    const n = ur.get(l);
    n && (n.free(), ur.delete(l));
  }
  function $o(l, n) {
    ur.set(l, n);
  }
  function qs(l) {
    return ur.get(l) ?? null;
  }
  function Da(l, n) {
    if (l && l !== n) {
      Po(l);
      const r = we.getState().library;
      r && ur.set(l, r);
    }
    a0(n);
  }
  function o0() {
    return {
      viewport: {
        zoom: Xs,
        offset: {
          x: 0,
          y: 0
        },
        initialized: false
      },
      selection: {
        selectedIds: /* @__PURE__ */ new Set(),
        hoveredId: null,
        lastSelectedId: null
      },
      history: {
        undoStack: [],
        redoStack: []
      },
      layers: {
        layers: new Map(Fs.map((l) => [
          l.id,
          l
        ])),
        activeLayerId: 1
      },
      explorer: {
        projectName: "untitled-project",
        cells: [
          "top"
        ],
        cellTree: null,
        expandedCells: /* @__PURE__ */ new Set(),
        activeCell: "top",
        cellsLoaded: true,
        hierarchyLevelLimit: 1 / 0,
        maxTreeDepth: 0,
        hiddenCells: /* @__PURE__ */ new Set()
      },
      tool: {
        activeTool: "select"
      },
      path: {
        width: r0,
        cornerRadius: 0,
        numArcPoints: oc,
        pathMetadata: /* @__PURE__ */ new Map()
      },
      rulers: {
        rulers: /* @__PURE__ */ new Map(),
        selectedRulerIds: /* @__PURE__ */ new Set()
      },
      clipboard: {
        elements: [],
        hasContent: false
      },
      document: {
        isDirty: false
      }
    };
  }
  function Gs(l, n) {
    const r = new n.WasmLibrary("rosette");
    try {
      r.add_cell("top");
    } catch {
    }
    r.set_active_cell("top"), ur.set(l, r);
    const o = o0();
    return ei.set(l, o), r;
  }
  function vS(l, n, r) {
    ur.set(l, n);
    const o = {
      ...o0(),
      ...r
    };
    ei.set(l, o);
  }
  const i0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    deleteTabSnapshot: $s,
    getTabLibrary: qs,
    initNewTab: Gs,
    initTabWithLibrary: vS,
    restoreTabSnapshot: a0,
    saveTabSnapshot: Po,
    setTabLibrary: $o,
    switchTab: Da,
    useTabsStore: Ke
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  let Ia = null, fn = null, en = null, Ps = null, Mt = null;
  const qo = /* @__PURE__ */ new Map();
  function dr(l) {
    const n = (fn == null ? void 0 : fn.get(l)) ?? null;
    if (n) return n;
    if (!l.startsWith("ref:") && Ia) {
      const r = Ia.active_cell_name();
      let o = Ia.get_element_index(l);
      if (o < 0 && qo.has(l) && (o = qo.get(l)), o >= 0) {
        if (qo.set(l, o), en && r && en[r]) {
          const s = en[r];
          if (o < s.length && s[o]) return s[o];
        }
        if (Ps && o < Ps.length) {
          const s = Ps[o];
          if (s) return s;
        }
      }
    }
    return null;
  }
  async function xS(l) {
    try {
      return (await fetch("/api/design/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(l)
      })).ok;
    } catch {
      return false;
    }
  }
  async function al(l) {
    try {
      const n = await fetch("/api/design/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(l)
      }), r = await n.text();
      if (!n.ok) return Dt.getState().show(`Source edit failed (HTTP ${n.status}): ${l.op}`, "error", 5e3), false;
      try {
        const o = JSON.parse(r);
        if (!o.ok) return Dt.getState().show(`Source edit failed: ${o.error || l.op}`, "error", 5e3), false;
      } catch {
      }
      return true;
    } catch {
      return Dt.getState().show("Source edit failed: could not reach server", "error", 5e3), false;
    }
  }
  function Ho(l, n) {
    const r = dr(l);
    r && (r.type !== "polygon" && r.type !== "path" || al({
      op: "modify_vertices",
      file: r.file,
      line: r.line,
      old_code: r.code,
      vertices: Array.from(n)
    }));
  }
  function wS(l, n, r) {
    const o = dr(l);
    o && o.type === "ref" && al({
      op: "move_ref",
      file: o.file,
      line: o.line,
      old_code: o.code,
      dx: n,
      dy: r
    });
  }
  function SS(l, n, r) {
    const o = dr(l);
    o && (o.type !== "polygon" && o.type !== "path" || al({
      op: "modify_layer",
      file: o.file,
      line: o.line,
      old_code: o.code,
      layer: n,
      datatype: r
    }));
  }
  function CS(l) {
    const n = dr(l);
    n && al({
      op: "delete_element",
      file: n.file,
      line: n.line,
      old_code: n.code
    });
  }
  function s0(l, n, r) {
    const o = Ia == null ? void 0 : Ia.active_cell_name(), s = me.getState().cells[0] ?? null;
    if (o && s && o !== s) {
      if (en && en[o]) {
        const m = en[o];
        let p = 0, v = "", b = o;
        for (const w of m) if (w && w.line > p) {
          p = w.line, v = w.file;
          const E = w.code.indexOf(".");
          E > 0 && (b = w.code.substring(0, E).trim());
        }
        if (v && p > 0) {
          al({
            op: "add_element",
            file: v,
            after_line: p,
            element_type: "polygon",
            vertices: Array.from(l),
            layer: n,
            datatype: r,
            cell_var: b
          });
          return;
        }
      }
      if (Mt && Mt[o]) {
        const m = Mt[o];
        al({
          op: "add_element",
          file: m.file,
          after_line: m.line,
          element_type: "polygon",
          vertices: Array.from(l),
          layer: n,
          datatype: r,
          cell_var: m.var_name
        });
        return;
      }
    }
    if (!fn || fn.size === 0) return;
    let c = 0, d = "", f = "cell";
    for (const m of fn.values()) if (m.line > c) {
      c = m.line, d = m.file;
      const p = m.code.indexOf(".");
      p > 0 && (f = m.code.substring(0, p).trim());
    }
    !d || c === 0 || al({
      op: "add_element",
      file: d,
      after_line: c,
      element_type: "polygon",
      vertices: Array.from(l),
      layer: n,
      datatype: r,
      cell_var: f
    });
  }
  function ES(l, n) {
    const r = me.getState().cells[0] ?? null;
    let o = "", s = "design", c = 0;
    if (en) for (const f of Object.values(en)) for (const m of f) m && m.line > c && (c = m.line, o || (o = m.file));
    if (!c && Mt) for (const [f, m] of Object.entries(Mt)) f !== r && m.line > c && (c = m.line, o || (o = m.file));
    let d = 0;
    if (n === r && fn) for (const f of fn.values()) {
      o || (o = f.file);
      const m = f.code.indexOf(".");
      m > 0 && (s = f.code.substring(0, m).trim()), f.type === "ref" && f.line > d && (d = f.line);
    }
    else if (en && en[n]) {
      for (const f of en[n]) if (f && f.type === "ref" && f.line > d) {
        d = f.line, o || (o = f.file);
        const m = f.code.indexOf(".");
        m > 0 && (s = f.code.substring(0, m).trim());
      }
    }
    if (Mt && Mt[n]) {
      const f = Mt[n];
      o || (o = f.file, s = f.var_name);
    }
    if (!d && fn) for (const f of fn.values()) f.line > d && (d = f.line, o || (o = f.file));
    c || (c = d), d || (d = c), !(!o || !c || !d) && (Mt || (Mt = {}), Mt[l] = {
      var_name: l,
      file: o,
      line: c + 1
    }, al({
      op: "add_cell",
      file: o,
      def_after_line: c,
      ref_after_line: d,
      cell_name: l,
      parent_var: s
    }));
  }
  function c0(l, n, r) {
    const o = me.getState().cells[0] ?? null;
    let s = "", c = "design", d = 0;
    if (n === o && fn) for (const m of fn.values()) {
      s || (s = m.file);
      const p = m.code.indexOf(".");
      p > 0 && (c = m.code.substring(0, p).trim()), m.type === "ref" && m.line > d && (d = m.line);
    }
    else if (en && en[n]) {
      for (const m of en[n]) if (m && m.type === "ref" && m.line > d) {
        d = m.line, s || (s = m.file);
        const p = m.code.indexOf(".");
        p > 0 && (c = m.code.substring(0, p).trim());
      }
    }
    if (Mt && Mt[n]) {
      const m = Mt[n];
      s || (s = m.file), d || (d = m.line, c = m.var_name);
    }
    if (!d && fn) for (const m of fn.values()) m.line > d && (d = m.line, s || (s = m.file));
    if (!s || !d) return;
    const f = Mt && Mt[l] ? Mt[l].var_name : l;
    al({
      op: "add_ref",
      file: s,
      after_line: d,
      cell_name: f,
      parent_var: c,
      transform: r
    });
  }
  function _S(l) {
    if (!Mt || !Mt[l]) return;
    const n = Mt[l];
    al({
      op: "delete_cell",
      file: n.file,
      cell_name: l,
      var_name: n.var_name
    });
  }
  function kS(l, n, r) {
    if (Ps = n, en = r ?? null, !n || n.length === 0) {
      fn = null;
      return;
    }
    const o = /* @__PURE__ */ new Map();
    try {
      const s = l.get_render_polygons();
      for (const c of s) {
        const d = c[0];
        if (d) if (d.startsWith("ref:")) {
          const f = d.indexOf(":", 4), m = parseInt(d.substring(4, f > 0 ? f : void 0), 10);
          if (m >= 0 && m < n.length) {
            const p = n[m];
            p && o.set(d, p);
          }
        } else {
          const f = l.get_element_index(d);
          if (f >= 0 && f < n.length) {
            const m = n[f];
            m && o.set(d, m);
          }
        }
      }
    } catch {
    }
    fn = o.size > 0 ? o : null;
  }
  function Df() {
    return new URLSearchParams(window.location.search).get("design") === "true";
  }
  function Zo() {
    return new URLSearchParams(window.location.search).get("embed") === "true";
  }
  function MS() {
    return new URLSearchParams(window.location.search).get("src");
  }
  function jS() {
    const n = new URLSearchParams(window.location.search).get("colors");
    return n ? n.split(",").map((r) => `#${r.trim()}`) : null;
  }
  function LS() {
    const n = new URLSearchParams(window.location.search).get("fills");
    return n ? n.split(",").map((r) => r.trim()) : null;
  }
  function RS() {
    return new URLSearchParams(window.location.search).get("name");
  }
  function AS() {
    const n = new URLSearchParams(window.location.search).get("panelWidth");
    if (!n) return null;
    const r = Number.parseInt(n, 10);
    return Number.isNaN(r) || r <= 0 ? null : r;
  }
  function TS() {
    const n = new URLSearchParams(window.location.search).get("zoom");
    if (!n) return null;
    const r = Number.parseFloat(n);
    return Number.isNaN(r) || r <= 0 ? null : r;
  }
  function NS() {
    return Dn && !Df() && !Zo();
  }
  function OS(l) {
    return l !== null && !Array.isArray(l) && "name" in l && "children" in l;
  }
  function Od(l, n) {
    for (const r of n.values()) {
      const o = r.visible ? r.opacity ?? 0.7 : 0, [s, c, d, f] = ac(r.color, o);
      l.set_layer_color(r.layerNumber, r.datatype, s, c, d, f);
    }
  }
  const Ws = Vo;
  function DS(l, n) {
    if (n.length === 0) return false;
    const r = new Set(n.map((f) => `${f.layerNumber}/${f.datatype}`)), o = n.map((f) => ({
      id: f.id,
      layerNumber: f.layerNumber,
      datatype: f.datatype,
      name: f.name,
      color: f.color,
      visible: f.visible ?? true,
      fillPattern: f.fillPattern ?? "solid",
      opacity: f.opacity ?? 0.7
    })), s = l.get_used_layers();
    let c = Math.max(0, ...o.map((f) => f.id)) + 1, d = o.length;
    for (let f = 0; f < s.length; f += 2) {
      const m = s[f], p = s[f + 1], v = `${m}/${p}`;
      r.has(v) || (o.push({
        id: c++,
        layerNumber: m,
        datatype: p,
        name: p === 0 ? `layer${m}` : `layer${m}/${p}`,
        color: Ws[d % Ws.length],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      }), d++);
    }
    return ye.getState().resetLayers(o), true;
  }
  function Dd(l) {
    const n = l.get_used_layers();
    if (n.length === 0) return;
    const r = [];
    for (let o = 0; o < n.length; o += 2) {
      const s = n[o], c = n[o + 1], d = o / 2 + 1, f = (d - 1) % Ws.length, m = c === 0 ? `layer${s}` : `layer${s}/${c}`;
      r.push({
        id: d,
        layerNumber: s,
        datatype: c,
        name: m,
        color: Ws[f],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      });
    }
    ye.getState().resetLayers(r);
  }
  function Id() {
    de.getState().clear(), ae.getState().clearSelection(), Ae.getState().clearAllRulers(), zn.getState().clear(), $n.getState().markClean();
  }
  function IS(l, n) {
    const r = l.get_cell_tree();
    if (r) {
      me.getState().setCellTree(r);
      const o = l.active_cell_name();
      o && me.getState().setActiveCell(o);
    } else me.getState().setCells([
      "top"
    ]);
    n && me.getState().setProjectName(n);
  }
  function zS(l, n) {
    const [r, o] = g.useState(null), [s, c] = g.useState(false), d = ye((k) => k.layers), f = g.useRef(d), m = g.useRef(0), p = g.useCallback((k) => {
      Ia = k, o(k);
    }, []), v = g.useRef(l);
    g.useEffect(() => {
      f.current = d;
    }, [
      d
    ]), g.useEffect(() => {
      v.current = l;
    }, [
      l
    ]), g.useEffect(() => Ke.subscribe((S, C) => {
      if (S.activeTabId && S.activeTabId !== C.activeTabId) {
        const _ = qs(S.activeTabId);
        _ && (p(_), c(true));
      }
    }), [
      p
    ]), g.useEffect(() => {
      if (!l || !n || Df() || Zo()) return;
      const { tabs: k } = Ke.getState();
      if (k.length > 0) {
        const R = Ke.getState().activeTabId;
        if (R) {
          const T = qs(R);
          if (T) {
            p(T), c(true);
            return;
          }
        }
      }
      const S = me.getState().projectName, C = Ke.getState().addTab({
        title: S
      }), _ = Gs(C, l), L = _.get_cell_tree();
      L ? me.getState().setCellTree(L) : me.getState().setCells([
        "top"
      ]), p(_), c(true);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n) return;
      const k = () => {
        const S = Ke.getState().addTab({
          title: "untitled-project"
        }), C = Gs(S, l);
        Id(), ye.getState().resetLayers(Fs), me.getState().setProjectName("untitled-project");
        const _ = C.get_cell_tree();
        _ ? me.getState().setCellTree(_) : me.getState().setCells([
          "top"
        ]), me.getState().setActiveCell("top");
        const L = document.getElementById("rosette-canvas");
        if (L) {
          const R = L.getBoundingClientRect();
          Oe.getState().reset(R.width, R.height);
        }
        p(C), c(true), we.getState().bumpSyncGeneration();
      };
      return window.addEventListener("rosette-new-tab", k), () => window.removeEventListener("rosette-new-tab", k);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !NS()) return;
      let k = false;
      const S = async (_) => {
        if (!k) try {
          const L = Ke.getState().findTabByPath(_);
          if (L) {
            const z = Ke.getState().activeTabId;
            if (z && z !== L.id) {
              Da(z, L.id), Ke.getState().setActiveTab(L.id);
              const P = qs(L.id);
              P && (p(P), c(true));
            }
            return;
          }
          const R = await Pv(_);
          if (k) return;
          const T = l.WasmLibrary.from_gds_bytes(R), B = Ke.getState().activeTabId;
          if (B) {
            Po(B);
            const z = we.getState().library;
            z && $o(B, z);
          }
          const N = _.split(/[/\\]/).pop() ?? "untitled", A = Ke.getState().addTab({
            title: N,
            filePath: _
          });
          Dd(T), Od(T, ye.getState().layers), $o(A, T), Id(), IS(T, N);
          const H = document.getElementById("rosette-canvas");
          if (H) {
            const z = H.getBoundingClientRect();
            Oe.getState().reset(z.width, z.height);
          }
          p(T), c(true), we.getState().bumpSyncGeneration();
        } catch (L) {
          console.error("Failed to open GDS file:", L);
        }
      };
      Qv().then((_) => {
        _ && !k && S(_);
      });
      let C = null;
      return n0("open-file", S).then((_) => {
        k ? _() : C = _;
      }), () => {
        k = true, C == null ? void 0 : C();
      };
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n) return;
      const k = () => {
        const S = Ke.getState().activeTabId;
        if (S) {
          Po(S);
          const T = we.getState().library;
          T && $o(S, T);
        }
        const C = Ke.getState().addTab({
          title: "untitled-project"
        }), _ = Gs(C, l);
        Id(), ye.getState().resetLayers(Fs), me.getState().setProjectName("untitled-project");
        const L = _.get_cell_tree();
        L ? me.getState().setCellTree(L) : me.getState().setCells([
          "top"
        ]), me.getState().setActiveCell("top");
        const R = document.getElementById("rosette-canvas");
        if (R) {
          const T = R.getBoundingClientRect();
          Oe.getState().reset(T.width, T.height);
        }
        p(_), c(true), we.getState().bumpSyncGeneration();
      };
      return window.addEventListener("rosette-new-file", k), () => window.removeEventListener("rosette-new-file", k);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !Df()) return;
      const k = new EventSource("/api/design/events");
      return k.addEventListener("design", (S) => {
        try {
          const C = JSON.parse(S.data);
          if (C.version < m.current && (m.current = 0), C.version !== m.current && C.json) try {
            const _ = l.WasmLibrary.from_library_json(C.json);
            C.layers && C.layers.length > 0 ? DS(_, C.layers) : Dd(_), Od(_, ye.getState().layers);
            const L = Ia;
            p(_), c(true), m.current = C.version, de.getState().clear();
            const R = [
              ...ae.getState().selectedIds
            ], T = [];
            for (const N of R) if (N.startsWith("ref:")) T.push({
              elemIdx: -1,
              refId: N
            });
            else if (L) {
              let A = L.get_element_index(N);
              A < 0 && (A = qo.get(N) ?? -1), A >= 0 && qo.set(N, A), T.push({
                elemIdx: A,
                refId: ""
              });
            }
            ae.getState().clearSelection(), L && requestAnimationFrame(() => {
              try {
                L.free();
              } catch {
              }
            }), kS(_, C.source_map ?? null, C.child_source_maps ?? null), Mt = C.cell_vars ?? null;
            const B = _.get_cell_tree();
            if (B) {
              const N = me.getState().activeCell;
              me.getState().setCellTree(B), N && me.getState().cells.includes(N) && _.set_active_cell(N);
            } else C.cells && (OS(C.cells) ? me.getState().setCellTree([
              C.cells
            ]) : me.getState().setCells(C.cells));
            if (C.filename && me.getState().setProjectName(C.filename), T.length > 0) {
              const N = /* @__PURE__ */ new Set(), A = _.get_all_ids(), H = /* @__PURE__ */ new Map();
              for (const z of A) if (!z.startsWith("ref:")) {
                const P = _.get_element_index(z);
                P >= 0 && H.set(P, z);
              }
              for (const z of T) if (z.refId) N.add(z.refId);
              else if (z.elemIdx >= 0) {
                const P = H.get(z.elemIdx);
                P && N.add(P);
              }
              N.size > 0 && ae.getState().setSelection(N);
            }
          } catch (_) {
            console.error("Failed to parse design:", _);
          }
        } catch (C) {
          console.error("Failed to parse SSE event:", C);
        }
      }), k.onerror = () => {
        console.warn("SSE connection error, reconnecting...");
      }, () => {
        k.close();
      };
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !Zo()) return;
      const k = MS();
      if (!k || k.startsWith("//") || /^https?:\/\//i.test(k)) {
        console.error("Embed mode requires a relative ?src= parameter pointing to a JSON file");
        return;
      }
      let S = false;
      return (async () => {
        try {
          const C = await fetch(k);
          if (!C.ok) throw new Error(`Failed to fetch ${k}: ${C.status}`);
          const _ = await C.text();
          if (S) return;
          const L = l.WasmLibrary.from_library_json(_);
          Dd(L);
          const R = jS(), T = LS();
          if (R || T) {
            const H = ye.getState().layers, P = Array.from(H.values()).map((ee, J) => {
              let ce = ee;
              return R && J < R.length && (ce = {
                ...ce,
                color: R[J]
              }), T && J < T.length && T[J] in Af && (ce = {
                ...ce,
                fillPattern: T[J]
              }), ce;
            });
            ye.getState().resetLayers(P);
          }
          Od(L, ye.getState().layers);
          const B = we.getState().library;
          B && B.free(), p(L), c(true);
          const N = RS();
          N && me.getState().setProjectName(N);
          const A = L.get_cell_tree();
          if (A) {
            me.getState().setCellTree(A);
            const H = L.active_cell_name();
            H && me.getState().setActiveCell(H);
          }
        } catch (C) {
          console.error("Failed to load embed design:", C);
        }
      })(), () => {
        S = true;
      };
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (r) for (const k of d.values()) {
        const S = k.visible ? k.opacity ?? 0.7 : 0, [C, _, L, R] = ac(k.color, S);
        r.set_layer_color(k.layerNumber, k.datatype, C, _, L, R), r.set_layer_fill_pattern(k.layerNumber, k.datatype, Af[k.fillPattern ?? "solid"] ?? 0);
      }
    }, [
      r,
      d
    ]);
    const b = g.useCallback((k, S, C, _, L) => r ? r.add_rectangle(k, S, C, _, L, 0) ?? null : null, [
      r
    ]), w = g.useCallback((k, S) => r ? r.add_polygon(new Float64Array(k), S, 0) ?? null : null, [
      r
    ]), E = g.useCallback(() => {
      r && r.clear_active_cell();
    }, [
      r
    ]);
    return {
      library: r,
      isReady: s,
      addRectangle: b,
      addPolygon: w,
      clearCell: E
    };
  }
  const vy = 8;
  function xy(l, n) {
    const r = n.x - l.x, o = n.y - l.y;
    if (r === 0 && o === 0) return n;
    const s = Math.abs(Math.atan2(Math.abs(o), Math.abs(r)) * (180 / Math.PI));
    return s <= vy ? {
      x: n.x,
      y: l.y
    } : s >= 90 - vy ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function HS(l, n, r = 64) {
    const o = l.length;
    if (o < 3 || n <= 0) return l;
    const s = [];
    for (let p = 0; p < o - 1; p++) {
      const v = l[p + 1].x - l[p].x, b = l[p + 1].y - l[p].y;
      s.push(Math.sqrt(v * v + b * b));
    }
    const c = o - 2, d = [];
    for (let p = 1; p < o - 1; p++) {
      const v = l[p - 1], b = l[p], w = l[p + 1], E = s[p - 1], k = s[p];
      if (E < 1e-10 || k < 1e-10) {
        d.push(null);
        continue;
      }
      const S = (b.x - v.x) / E, C = (b.y - v.y) / E, _ = (w.x - b.x) / k, L = (w.y - b.y) / k, R = S * L - C * _, T = S * _ + C * L, B = Math.atan2(R, T);
      Math.abs(B) < 1e-6 ? d.push(null) : d.push(B);
    }
    const f = d.map((p) => {
      if (p === null) return 0;
      const v = Math.abs(p) / 2;
      return n * Math.tan(v);
    });
    for (let p = 0; p < 3; p++) for (let v = 0; v < s.length; v++) {
      const b = s[v] * 0.95, w = v > 0 ? v - 1 : null, E = v < c ? v : null, k = w !== null ? f[w] : 0, S = E !== null ? f[E] : 0, C = k + S;
      if (C > b && C > 1e-10) {
        const _ = b / C;
        w !== null && (f[w] = Math.min(f[w], k * _)), E !== null && (f[E] = Math.min(f[E], S * _));
      }
    }
    const m = [
      l[0]
    ];
    for (let p = 0; p < c; p++) {
      const v = p + 1, b = l[v], w = d[p];
      if (w === null) {
        m.push(b);
        continue;
      }
      const E = f[p], k = Math.abs(w) / 2, S = Math.tan(k), C = Math.abs(S) > 1e-10 ? E / S : 0;
      if (C < 1e-6 || E < 1e-6) {
        m.push(b);
        continue;
      }
      const _ = l[v - 1], L = l[v + 1], R = s[v - 1], T = s[v], B = (b.x - _.x) / R, N = (b.y - _.y) / R, A = (L.x - b.x) / T, H = (L.y - b.y) / T, z = w > 0 ? 1 : -1, P = b.x + B * -E, ee = b.y + N * -E, J = b.x + A * E, ce = b.y + H * E, fe = -N * z, Se = B * z, $ = P + fe * C, F = ee + Se * C, ie = P - $, Ee = ee - F, pe = Math.min(Math.max(Math.ceil(Math.abs(w) * 180 / Math.PI * 2), 8), r);
      m.push({
        x: P,
        y: ee
      });
      for (let j = 1; j < pe; j++) {
        const D = j / pe, O = w * D, Z = Math.cos(O), Q = Math.sin(O);
        m.push({
          x: $ + ie * Z - Ee * Q,
          y: F + ie * Q + Ee * Z
        });
      }
      m.push({
        x: J,
        y: ce
      });
    }
    return m.push(l[o - 1]), m;
  }
  function US(l, n) {
    const r = l.length;
    if (r < 3 || n <= 0) return [];
    const o = [];
    for (let m = 0; m < r - 1; m++) {
      const p = l[m + 1].x - l[m].x, v = l[m + 1].y - l[m].y;
      o.push(Math.sqrt(p * p + v * v));
    }
    const s = r - 2, c = [];
    for (let m = 1; m < r - 1; m++) {
      const p = l[m - 1], v = l[m], b = l[m + 1], w = o[m - 1], E = o[m];
      if (w < 1e-10 || E < 1e-10) {
        c.push(null);
        continue;
      }
      const k = (v.x - p.x) / w, S = (v.y - p.y) / w, C = (b.x - v.x) / E, _ = (b.y - v.y) / E, L = k * _ - S * C, R = k * C + S * _, T = Math.atan2(L, R);
      c.push(Math.abs(T) < 1e-6 ? null : T);
    }
    const d = c.map((m) => m === null ? 0 : n * Math.tan(Math.abs(m) / 2));
    for (let m = 0; m < 3; m++) for (let p = 0; p < o.length; p++) {
      const v = o[p] * 0.95, b = p > 0 ? p - 1 : null, w = p < s ? p : null, E = b !== null ? d[b] : 0, k = w !== null ? d[w] : 0, S = E + k;
      if (S > v && S > 1e-10) {
        const C = v / S;
        b !== null && (d[b] = Math.min(d[b], E * C)), w !== null && (d[w] = Math.min(d[w], k * C));
      }
    }
    const f = [];
    for (let m = 0; m < s; m++) {
      const p = c[m];
      if (p === null) continue;
      const v = Math.abs(p) / 2, b = Math.tan(v);
      if (Math.abs(b) < 1e-10) continue;
      const w = d[m] / b;
      w < n - 1e-6 && f.push({
        cornerIndex: m + 1,
        requested: n,
        actual: w
      });
    }
    return f;
  }
  function YS(l, n, r = 0, o = 64) {
    const s = r > 0 ? HS(l, r, o) : l;
    if (s.length < 2) return [];
    const c = n / 2, d = s.length, f = [], m = [];
    for (let p = 0; p < d; p++) {
      const v = s[p];
      if (p === 0) {
        const b = s[1], w = b.x - v.x, E = b.y - v.y, k = Math.sqrt(w * w + E * E);
        if (k < 1e-10) continue;
        const S = -E / k, C = w / k;
        f.push({
          x: v.x + S * c,
          y: v.y + C * c
        }), m.push({
          x: v.x - S * c,
          y: v.y - C * c
        });
      } else if (p === d - 1) {
        const b = s[d - 2], w = v.x - b.x, E = v.y - b.y, k = Math.sqrt(w * w + E * E);
        if (k < 1e-10) continue;
        const S = -E / k, C = w / k;
        f.push({
          x: v.x + S * c,
          y: v.y + C * c
        }), m.push({
          x: v.x - S * c,
          y: v.y - C * c
        });
      } else {
        const b = s[p - 1], w = s[p + 1], E = v.x - b.x, k = v.y - b.y, S = Math.sqrt(E * E + k * k), C = w.x - v.x, _ = w.y - v.y, L = Math.sqrt(C * C + _ * _);
        if (S < 1e-10 || L < 1e-10) continue;
        const R = -k / S, T = E / S, B = -_ / L, N = C / L, A = R + B, H = T + N, z = Math.sqrt(A * A + H * H);
        if (z < 1e-10) f.push({
          x: v.x + R * c,
          y: v.y + T * c
        }), m.push({
          x: v.x - R * c,
          y: v.y - T * c
        });
        else {
          const P = A / z, ee = H / z, J = P * R + ee * T;
          if (Math.abs(J) < 1e-6) f.push({
            x: v.x + R * c,
            y: v.y + T * c
          }), m.push({
            x: v.x - R * c,
            y: v.y - T * c
          });
          else {
            const ce = Math.max(-2 * c, Math.min(2 * c, c / J));
            f.push({
              x: v.x + P * ce,
              y: v.y + ee * ce
            }), m.push({
              x: v.x - P * ce,
              y: v.y - ee * ce
            });
          }
        }
      }
    }
    return m.reverse(), [
      ...f,
      ...m
    ];
  }
  class u0 {
    constructor(n, r, o, s, c, d = 0) {
      __publicField(this, "type", "create-rectangle");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.x = n, this.y = r, this.width = o, this.height = s, this.layer = c, this.datatype = d, this.description = `Create rectangle at (${n}, ${r})`;
    }
    execute(n) {
      const r = n.library.add_rectangle(this.x, this.y, this.width, this.height, this.layer, this.datatype);
      if (r) {
        this.elementId = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ae.getState().select(r);
        const o = new Float64Array([
          this.x,
          this.y,
          this.x + this.width,
          this.y,
          this.x + this.width,
          this.y + this.height,
          this.x,
          this.y + this.height
        ]);
        s0(o, this.layer, this.datatype);
      }
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ae.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  function mr(l, n) {
    const r = [], o = /* @__PURE__ */ new Set();
    for (const s of n) {
      if (s.startsWith("ref:")) {
        const m = s.split(":")[1];
        if (o.has(m)) continue;
        o.add(m);
        const p = l.get_cell_ref_info(s);
        p && (r.push({
          type: "cell-ref",
          cellName: p.cell_name,
          transform: new Float64Array(p.transform)
        }), p.free());
        continue;
      }
      const c = l.get_cell_ref_info(s);
      if (c) {
        r.push({
          type: "cell-ref",
          cellName: c.cell_name,
          transform: new Float64Array(c.transform)
        }), c.free();
        continue;
      }
      const d = l.get_text_element_info(s);
      if (d) {
        r.push({
          type: "text",
          text: d.text,
          x: d.x,
          y: d.y,
          height: d.height,
          layer: d.layer,
          datatype: d.datatype
        });
        continue;
      }
      const f = l.get_element_info(s);
      f && (r.push({
        type: "polygon",
        vertices: new Float64Array(f.vertices),
        layer: f.layer,
        datatype: f.datatype
      }), f.free());
    }
    return r;
  }
  function ti(l, n) {
    const r = [];
    for (const o of n) if (o.type === "cell-ref") {
      const s = l.add_cell_ref_with_transform(o.cellName, o.transform);
      s && r.push(s);
    } else if (o.type === "text") {
      const s = l.add_text(o.text, o.x, o.y, o.height, o.layer, o.datatype);
      s && r.push(s);
    } else {
      const s = l.add_polygon(o.vertices, o.layer, o.datatype);
      s && r.push(s);
    }
    return r;
  }
  function d0(l, n) {
    if (new URLSearchParams(window.location.search).get("design") !== "true") return;
    const o = l.library.active_cell_name();
    if (o) for (const s of n) s.type === "cell-ref" && c0(s.cellName, o, Array.from(s.transform));
  }
  class ic {
    constructor(n) {
      __publicField(this, "type", "delete-elements");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "restoredIds", []);
      this.elementIds = n;
      const r = n.length;
      this.description = r === 1 ? "Delete element" : `Delete ${r} elements`;
    }
    execute(n) {
      let r = this.restoredIds.length > 0 ? this.restoredIds : this.elementIds;
      const o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map();
      for (const p of r) {
        const v = n.library.get_cell_ref_info(p);
        if (v) {
          const b = v.cell_name, w = p.startsWith("ref:") ? p.split(":")[1] : p;
          v.free(), c.has(b) || c.set(b, /* @__PURE__ */ new Set()), c.get(b).add(w);
        }
      }
      for (const [p, v] of c) {
        const b = n.library.get_cell_ref_parents(p), w = Array.isArray(b) ? b.length : 0;
        if (w > 0 && v.size >= w) {
          o.add(p);
          for (const E of r) {
            const k = n.library.get_cell_ref_info(E);
            k && (k.cell_name === p && s.add(E), k.free());
          }
        }
      }
      if (s.size > 0) {
        r = r.filter((v) => !s.has(v));
        const p = [
          ...o
        ].map((v) => `"${v}"`).join(", ");
        if (Dt.getState().show(`Cannot delete last reference to ${p}. Delete the cell from the Explorer instead.`, "warn", 5e3), r.length === 0) return;
      }
      this.snapshots.length === 0 && (this.snapshots = mr(n.library, r));
      const d = new URLSearchParams(window.location.search).get("design") === "true", f = /* @__PURE__ */ new Map();
      let m = 0;
      for (const p of r) {
        const v = dr(p);
        if (v) {
          const b = `${v.file}:${v.line}`;
          f.has(b) || f.set(b, p);
        } else d && m++;
      }
      m > 0 && d && Dt.getState().show(`${m} element(s) deleted from viewer only \u2014 no source tracking available. Changes may revert on reload.`, "warn", 5e3), n.library.remove_elements(r), this.restoredIds = [], Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ae.getState().clearSelection();
      for (const p of f.values()) CS(p);
    }
    undo(n) {
      this.restoredIds = ti(n.library, this.snapshots), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.restoredIds.length > 0 && ae.getState().setSelection(new Set(this.restoredIds));
    }
  }
  class sc {
    constructor() {
      __publicField(this, "type", "paste-elements");
      __publicField(this, "description");
      __publicField(this, "createdIds", []);
      __publicField(this, "snapshots");
      const { elements: n } = zn.getState();
      this.snapshots = n.map((o) => o.type === "cell-ref" ? {
        type: "cell-ref",
        cellName: o.cellName,
        transform: new Float64Array(o.transform)
      } : o.type === "text" ? {
        ...o
      } : {
        type: "polygon",
        vertices: new Float64Array(o.vertices),
        layer: o.layer,
        datatype: o.datatype
      });
      const r = this.snapshots.length;
      this.description = r === 1 ? "Paste element" : `Paste ${r} elements`;
    }
    execute(n) {
      this.snapshots.length !== 0 && (this.createdIds = ti(n.library, this.snapshots), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && ae.getState().setSelection(new Set(this.createdIds)), d0(n, this.snapshots));
    }
    undo(n) {
      n.library.remove_elements(this.createdIds), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ae.getState().clearSelection();
    }
  }
  class cc {
    constructor(n) {
      __publicField(this, "type", "duplicate-elements");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "createdIds", []);
      this.elementIds = n;
      const r = n.length;
      this.description = r === 1 ? "Duplicate element" : `Duplicate ${r} elements`;
    }
    execute(n) {
      this.snapshots.length === 0 && (this.snapshots = mr(n.library, this.elementIds)), this.createdIds = ti(n.library, this.snapshots), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && ae.getState().setSelection(new Set(this.createdIds)), d0(n, this.snapshots);
    }
    undo(n) {
      n.library.remove_elements(this.createdIds), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.elementIds.length > 0 ? ae.getState().setSelection(new Set(this.elementIds)) : ae.getState().clearSelection();
    }
  }
  class f0 {
    constructor(n, r, o = 0) {
      __publicField(this, "type", "create-polygon");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.points = n, this.layer = r, this.datatype = o, this.description = `Create polygon with ${n.length / 2} vertices`;
    }
    execute(n) {
      const r = n.library.add_polygon(this.points, this.layer, this.datatype);
      r && (this.elementId = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ae.getState().select(r), s0(this.points, this.layer, this.datatype));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ae.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  function wy(l) {
    const n = l / ve / 1e3;
    return n.toFixed(n >= 10 ? 1 : n >= 1 ? 2 : 3);
  }
  function h0(l, n) {
    if (n <= 0) return;
    const r = US(l, n);
    if (r.length === 0) return;
    const o = wy(n), s = Math.min(...r.map((f) => f.actual)), c = wy(s), d = r.length === 1 ? `Bend radius reduced to ${c} \xB5m at corner ${r[0].cornerIndex} (requested ${o} \xB5m)` : `Bend radius reduced at ${r.length} corners (min ${c} \xB5m, requested ${o} \xB5m)`;
    Dt.getState().show(d, "warn");
  }
  class BS {
    constructor(n, r, o, s = 0, c, d = 0, f = oc) {
      __publicField(this, "type", "create-path");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      __publicField(this, "metadata", null);
      this.points = n, this.width = r, this.layer = o, this.datatype = s, this.waypoints = c, this.cornerRadius = d, this.numArcPoints = f, this.description = `Create path with ${n.length / 2} waypoints`;
    }
    execute(n) {
      const r = n.library.create_path_rounded(this.points, this.width, this.cornerRadius, this.numArcPoints, this.layer, this.datatype);
      r && (this.elementId = r, this.metadata ? tn.getState().setPathMetadata(r, this.metadata) : this.waypoints && (this.metadata = {
        waypoints: this.waypoints,
        width: this.width,
        cornerRadius: this.cornerRadius,
        numArcPoints: this.numArcPoints,
        layer: this.layer,
        datatype: this.datatype
      }, tn.getState().setPathMetadata(r, this.metadata)), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ae.getState().select(r), this.waypoints && h0(this.waypoints, this.cornerRadius));
    }
    undo(n) {
      if (this.elementId) {
        this.metadata || (this.metadata = tn.getState().pathMetadata.get(this.elementId) ?? null), tn.getState().removePathMetadata(this.elementId), n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ae.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class ks {
    constructor(n, r, o, s) {
      __publicField(this, "type", "edit-path");
      __publicField(this, "description");
      __publicField(this, "currentId");
      __publicField(this, "oldMeta");
      __publicField(this, "newMeta");
      this.currentId = n, this.oldMeta = r, this.newMeta = o, this.description = s;
    }
    execute(n) {
      this.currentId = this.rebuildPath(n, this.currentId, this.newMeta);
    }
    undo(n) {
      this.currentId = this.rebuildPath(n, this.currentId, this.oldMeta);
    }
    rebuildPath(n, r, o) {
      const s = new Float64Array(o.waypoints.length * 2);
      for (let d = 0; d < o.waypoints.length; d++) s[d * 2] = o.waypoints[d].x, s[d * 2 + 1] = o.waypoints[d].y;
      n.library.remove_element(r);
      const c = n.library.create_path_rounded(s, o.width, o.cornerRadius, o.numArcPoints ?? oc, o.layer, o.datatype);
      return c ? (tn.getState().removePathMetadata(r), tn.getState().setPathMetadata(c, {
        ...o
      }), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ae.getState().select(c), h0(o.waypoints, o.cornerRadius), c) : (n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), r);
    }
  }
  class XS {
    constructor(n, r, o) {
      __publicField(this, "type", "move-elements");
      __publicField(this, "description");
      this.elementIds = n, this.deltaX = r, this.deltaY = o;
      const s = n.length;
      this.description = s === 1 ? "Move element" : `Move ${s} elements`;
    }
    execute(n) {
      n.library.translate_elements(this.elementIds, this.deltaX, this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.translate_elements(this.elementIds, -this.deltaX, -this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class VS {
    constructor(n, r) {
      __publicField(this, "type", "create-ruler");
      __publicField(this, "description", "Create ruler");
      __publicField(this, "ruler");
      __publicField(this, "alreadyCreated");
      "id" in n ? (this.ruler = n, this.alreadyCreated = true) : (this.ruler = {
        id: "",
        start: n,
        end: r
      }, this.alreadyCreated = false);
    }
    execute(n) {
      if (this.alreadyCreated) {
        const { rulers: r } = Ae.getState();
        r.has(this.ruler.id) || Ae.setState((o) => {
          const s = new Map(o.rulers);
          return s.set(this.ruler.id, this.ruler), {
            rulers: s
          };
        });
      } else {
        const r = Ae.getState().addRuler(this.ruler.start, this.ruler.end);
        this.ruler = {
          ...this.ruler,
          id: r
        };
      }
    }
    undo(n) {
      Ae.getState().removeRuler(this.ruler.id);
    }
    getRulerId() {
      return this.ruler.id;
    }
  }
  class th {
    constructor(n) {
      __publicField(this, "type", "delete-rulers");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "restoredIds", []);
      this.rulerIds = n;
      const r = n.length;
      this.description = r === 1 ? "Delete ruler" : `Delete ${r} rulers`;
    }
    execute(n) {
      const { rulers: r, removeRulers: o } = Ae.getState(), s = this.restoredIds.length > 0 ? this.restoredIds : this.rulerIds;
      if (this.snapshots.length === 0) for (const c of s) {
        const d = r.get(c);
        d && this.snapshots.push({
          ...d
        });
      }
      o(s), this.restoredIds = [];
    }
    undo(n) {
      const r = Ae.getState().restoreRulers(this.snapshots);
      this.restoredIds = r, r.length > 0 && Ae.getState().setSelection(new Set(r));
    }
  }
  class m0 {
    constructor(n, r, o) {
      __publicField(this, "type", "move-rulers");
      __publicField(this, "description");
      this.rulerIds = n, this.deltaX = r, this.deltaY = o;
      const s = n.length;
      this.description = s === 1 ? "Move ruler" : `Move ${s} rulers`;
    }
    execute(n) {
      this.applyDelta(this.deltaX, this.deltaY);
    }
    undo(n) {
      this.applyDelta(-this.deltaX, -this.deltaY);
    }
    applyDelta(n, r) {
      Ae.setState((o) => {
        const s = new Map(o.rulers);
        for (const c of this.rulerIds) {
          const d = s.get(c);
          d && s.set(c, {
            ...d,
            start: {
              x: d.start.x + n,
              y: d.start.y + r
            },
            end: {
              x: d.end.x + n,
              y: d.end.y + r
            }
          });
        }
        return {
          rulers: s
        };
      });
    }
  }
  class g0 {
    constructor(n, r, o, s) {
      __publicField(this, "type", "move-ruler-endpoint");
      __publicField(this, "description", "Move ruler endpoint");
      this.rulerId = n, this.endpoint = r, this.oldPosition = o, this.newPosition = s;
    }
    execute(n) {
      Ae.getState().updateEndpoint(this.rulerId, this.endpoint, this.newPosition);
    }
    undo(n) {
      Ae.getState().updateEndpoint(this.rulerId, this.endpoint, this.oldPosition);
    }
  }
  class p0 {
    constructor(n, r) {
      __publicField(this, "type", "add-layer");
      __publicField(this, "description", "Add layer");
      __publicField(this, "createdLayer", null);
      this.name = n, this.color = r;
    }
    execute(n) {
      this.createdLayer ? (ye.getState().setLayer(this.createdLayer), ye.getState().setActiveLayer(this.createdLayer.id)) : this.createdLayer = ye.getState().addLayer(this.name, this.color);
    }
    undo(n) {
      this.createdLayer && ye.getState().deleteLayer(this.createdLayer.id);
    }
  }
  class y0 {
    constructor(n) {
      __publicField(this, "type", "delete-layer");
      __publicField(this, "description");
      __publicField(this, "snapshot", null);
      __publicField(this, "elementSnapshots", []);
      __publicField(this, "restoredElementIds", []);
      this.layerId = n, this.description = "Delete layer";
    }
    execute(n) {
      const r = ye.getState();
      if (this.snapshot = r.getLayer(this.layerId) ?? null, !this.snapshot) return;
      const o = this.restoredElementIds.length > 0 ? this.restoredElementIds : n.library.get_elements_on_layer(this.snapshot.layerNumber, this.snapshot.datatype);
      if (this.elementSnapshots.length === 0) for (const s of o) {
        const c = n.library.get_element_info(s);
        c && (this.elementSnapshots.push({
          vertices: new Float64Array(c.vertices),
          layer: c.layer,
          datatype: c.datatype
        }), c.free());
      }
      n.library.remove_elements(o), this.restoredElementIds = [], n.library.remove_layer_color(this.snapshot.layerNumber, this.snapshot.datatype), r.deleteLayer(this.layerId), ae.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      if (!this.snapshot) return;
      ye.getState().setLayer(this.snapshot), ye.getState().setActiveLayer(this.snapshot.id), If(this.snapshot, n);
      const r = [];
      for (const o of this.elementSnapshots) {
        const s = n.library.add_polygon(o.vertices, o.layer, o.datatype);
        s && r.push(s);
      }
      this.restoredElementIds = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  function If(l, n) {
    const r = l.visible ? l.opacity : 0, [o, s, c, d] = ac(l.color, r);
    n.library.set_layer_color(l.layerNumber, l.datatype, o, s, c, d), n.library.set_layer_fill_pattern(l.layerNumber, l.datatype, Af[l.fillPattern ?? "solid"] ?? 0);
  }
  class b0 {
    constructor(n, r) {
      __publicField(this, "type", "edit-layer");
      __publicField(this, "description");
      this.oldLayer = n, this.newLayer = r, this.description = `Edit layer "${n.name}"`;
    }
    execute(n) {
      const r = ye.getState();
      (this.oldLayer.layerNumber !== this.newLayer.layerNumber || this.oldLayer.datatype !== this.newLayer.datatype) && n.library.remove_layer_color(this.oldLayer.layerNumber, this.oldLayer.datatype), r.setLayer(this.newLayer), If(this.newLayer, n), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      const r = ye.getState();
      (this.oldLayer.layerNumber !== this.newLayer.layerNumber || this.oldLayer.datatype !== this.newLayer.datatype) && n.library.remove_layer_color(this.newLayer.layerNumber, this.newLayer.datatype), r.setLayer(this.oldLayer), If(this.oldLayer, n), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Sy {
    constructor(n, r, o) {
      __publicField(this, "type", "change-element-layer");
      __publicField(this, "description");
      __publicField(this, "originals", []);
      __publicField(this, "newIds", []);
      this.elementIds = n, this.newLayer = r, this.newDatatype = o;
      const s = n.length;
      this.description = s === 1 ? "Change element layer" : `Change layer of ${s} elements`;
    }
    execute(n) {
      if (this.originals.length === 0) for (const s of this.elementIds) {
        const c = n.library.get_text_element_info(s);
        if (c) {
          this.originals.push({
            id: s,
            snapshot: {
              type: "text",
              text: c.text,
              x: c.x,
              y: c.y,
              height: c.height,
              layer: c.layer,
              datatype: c.datatype
            }
          });
          continue;
        }
        const d = n.library.get_element_info(s);
        d && (this.originals.push({
          id: s,
          snapshot: {
            vertices: new Float64Array(d.vertices),
            layer: d.layer,
            datatype: d.datatype
          }
        }), d.free());
      }
      const r = this.newIds.length > 0 ? this.newIds : this.elementIds;
      n.library.remove_elements(r);
      const o = [];
      for (const { snapshot: s } of this.originals) {
        let c;
        "type" in s && s.type === "text" ? c = n.library.add_text(s.text, s.x, s.y, s.height, this.newLayer, this.newDatatype) : c = n.library.add_polygon(s.vertices, this.newLayer, this.newDatatype), c && o.push(c);
      }
      this.newIds = o, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), o.length > 0 && ae.getState().setSelection(new Set(o));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const r = [];
      for (const { snapshot: o } of this.originals) {
        let s;
        "type" in o && o.type === "text" ? s = n.library.add_text(o.text, o.x, o.y, o.height, o.layer, o.datatype) : s = n.library.add_polygon(o.vertices, o.layer, o.datatype), s && r.push(s);
      }
      this.newIds = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), r.length > 0 && ae.getState().setSelection(new Set(r));
    }
  }
  class $S {
    constructor(n, r, o, s) {
      __publicField(this, "type", "resize-elements");
      __publicField(this, "description");
      __publicField(this, "originals", []);
      __publicField(this, "newIds", []);
      this.elementIds = n, this.oldBounds = r, this.newWidth = o, this.newHeight = s;
      const c = n.length;
      this.description = c === 1 ? "Resize element" : `Resize ${c} elements`;
    }
    execute(n) {
      if (this.originals.length === 0) for (const m of this.elementIds) {
        const p = n.library.get_element_info(m);
        p && (this.originals.push({
          id: m,
          snapshot: {
            vertices: new Float64Array(p.vertices),
            layer: p.layer,
            datatype: p.datatype
          }
        }), p.free());
      }
      const r = this.oldBounds.maxX - this.oldBounds.minX, o = this.oldBounds.maxY - this.oldBounds.minY, s = r !== 0 ? this.newWidth / r : 1, c = o !== 0 ? this.newHeight / o : 1, d = this.newIds.length > 0 ? this.newIds : this.elementIds;
      n.library.remove_elements(d);
      const f = [];
      for (const { snapshot: m } of this.originals) {
        const p = new Float64Array(m.vertices.length);
        for (let b = 0; b < m.vertices.length; b += 2) p[b] = this.oldBounds.minX + (m.vertices[b] - this.oldBounds.minX) * s, p[b + 1] = this.oldBounds.minY + (m.vertices[b + 1] - this.oldBounds.minY) * c;
        const v = n.library.add_polygon(p, m.layer, m.datatype);
        v && f.push(v);
      }
      this.newIds = f, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), f.length > 0 && ae.getState().setSelection(new Set(f));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const r = [];
      for (const { snapshot: o } of this.originals) {
        const s = n.library.add_polygon(o.vertices, o.layer, o.datatype);
        s && r.push(s);
      }
      this.newIds = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), r.length > 0 && ae.getState().setSelection(new Set(r));
    }
  }
  class zd {
    constructor(n, r, o) {
      __publicField(this, "type", "edit-vertices");
      __publicField(this, "description");
      __publicField(this, "original", null);
      __publicField(this, "currentId");
      this.newVertices = r, this.currentId = n, this.description = o ?? "Edit vertices";
    }
    execute(n) {
      if (!this.original) {
        const o = n.library.get_element_info(this.currentId);
        if (!o) return;
        this.original = {
          vertices: new Float64Array(o.vertices),
          layer: o.layer,
          datatype: o.datatype
        }, o.free();
      }
      n.library.remove_element(this.currentId);
      const r = n.library.add_polygon(this.newVertices, this.original.layer, this.original.datatype);
      r && (this.currentId = r, ae.getState().setSelection(/* @__PURE__ */ new Set([
        r
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      if (!this.original) return;
      n.library.remove_element(this.currentId);
      const r = n.library.add_polygon(this.original.vertices, this.original.layer, this.original.datatype);
      r && (this.currentId = r, ae.getState().setSelection(/* @__PURE__ */ new Set([
        r
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class qS {
    constructor(n, r, o, s, c) {
      __publicField(this, "type", "move-elements-to");
      __publicField(this, "description");
      __publicField(this, "deltaX");
      __publicField(this, "deltaY");
      __publicField(this, "currentIds");
      this.currentIds = [
        ...n
      ], this.deltaX = s - r, this.deltaY = c - o, this.description = n.length === 1 ? "Move element" : `Move ${n.length} elements`;
    }
    execute(n) {
      n.library.translate_elements(this.currentIds, this.deltaX, this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.translate_elements(this.currentIds, -this.deltaX, -this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  function Qt(l) {
    const n = l.get_cell_tree();
    n && me.getState().setCellTree(n);
  }
  class GS {
    constructor(n) {
      __publicField(this, "type", "add-cell");
      __publicField(this, "description");
      __publicField(this, "cellName");
      this.cellName = n, this.description = `Add cell "${n}"`;
    }
    execute(n) {
      n.library.add_cell(this.cellName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.remove_cell(this.cellName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class PS {
    constructor(n, r) {
      __publicField(this, "type", "add-child-cell");
      __publicField(this, "description");
      this.cellName = n, this.parentCellName = r, this.description = `Add child cell "${n}" to "${r}"`;
    }
    execute(n) {
      n.library.add_cell(this.cellName), n.library.add_cell_ref_to(this.parentCellName, this.cellName, 0, 0), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), new URLSearchParams(window.location.search).get("design") === "true" && ES(this.cellName, this.parentCellName);
    }
    undo(n) {
      n.library.remove_cell_cascade(this.cellName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class v0 {
    constructor(n) {
      __publicField(this, "type", "delete-cell");
      __publicField(this, "description");
      __publicField(this, "cellName");
      __publicField(this, "elementSnapshots", []);
      __publicField(this, "cellOrigin", [
        0,
        0
      ]);
      __publicField(this, "parentRefs", []);
      this.cellName = n, this.description = `Delete cell "${n}"`;
    }
    execute(n) {
      if (this.elementSnapshots.length === 0 && this.parentRefs.length === 0) {
        const o = n.library.get_cell_origin_by_name(this.cellName);
        o && (this.cellOrigin = [
          o[0],
          o[1]
        ]);
        const s = n.library.get_cell_ref_parents(this.cellName);
        Array.isArray(s) && (this.parentRefs = s.map((f) => ({
          parent: f.parent,
          transform: new Float64Array(f.transform)
        })));
        const c = n.library.active_cell_name();
        n.library.set_active_cell(this.cellName);
        const d = n.library.get_all_ids();
        d.length > 0 && (this.elementSnapshots = mr(n.library, d)), c && n.library.set_active_cell(c);
      }
      n.library.remove_cell_cascade(this.cellName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), new URLSearchParams(window.location.search).get("design") === "true" && _S(this.cellName);
    }
    undo(n) {
      n.library.add_cell(this.cellName);
      const r = n.library.active_cell_name();
      n.library.set_active_cell(this.cellName), n.library.set_cell_origin(this.cellOrigin[0], this.cellOrigin[1]), this.elementSnapshots.length > 0 && ti(n.library, this.elementSnapshots), r && n.library.set_active_cell(r);
      for (const o of this.parentRefs) n.library.add_cell_ref_to_with_transform(o.parent, this.cellName, o.transform);
      Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class ZS {
    constructor(n, r, o, s) {
      __publicField(this, "type", "set-cell-origin");
      __publicField(this, "description", "Set cell origin");
      this.oldX = n, this.oldY = r, this.newX = o, this.newY = s;
    }
    execute(n) {
      n.library.set_cell_origin(this.newX, this.newY), n.renderer.set_crosshair_origin(this.newX, this.newY), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_cell_origin(this.oldX, this.oldY), n.renderer.set_crosshair_origin(this.oldX, this.oldY), n.renderer.mark_dirty();
    }
  }
  class x0 {
    constructor(n, r) {
      __publicField(this, "type", "rename-cell");
      __publicField(this, "description");
      this.oldName = n, this.newName = r, this.description = `Rename cell "${n}" to "${r}"`;
    }
    execute(n) {
      const r = me.getState();
      r.activeCell === this.oldName && r.setActiveCell(this.newName), n.library.rename_cell(this.oldName, this.newName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      const r = me.getState();
      r.activeCell === this.newName && r.setActiveCell(this.oldName), n.library.rename_cell(this.newName, this.oldName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class w0 {
    constructor(n, r, o) {
      __publicField(this, "type", "add-cell-ref");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.cellName = n, this.x = r, this.y = o, this.description = `Place instance of "${n}"`;
    }
    execute(n) {
      const r = n.library.add_cell_ref(this.cellName, this.x, this.y);
      if (r) {
        this.elementId = r, Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const o = n.library.get_element_index(r);
        if (o >= 0 && ae.getState().select(`ref:${o}:0`), new URLSearchParams(window.location.search).get("design") === "true") {
          const c = n.library.active_cell_name();
          c && c0(this.cellName, c, [
            1,
            0,
            0,
            1,
            this.x,
            this.y
          ]);
        }
      }
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ae.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
  }
  function Cn(l) {
    return Math.round(l / ve) * ve;
  }
  function nh() {
    const { activeLayerId: l, layers: n } = ye.getState(), r = n.get(l);
    return {
      layerNumber: (r == null ? void 0 : r.layerNumber) ?? 1,
      datatype: (r == null ? void 0 : r.datatype) ?? 0
    };
  }
  function lh(l) {
    const { zoom: n, offset: r } = Oe.getState(), o = l.getBoundingClientRect(), s = (o.width / 2 - r.x) / n, c = (o.height / 2 - r.y) / n, d = o.width / n, f = o.height / n, m = Math.max(Cn(d * 0.1 / 2), ve), p = Math.max(Cn(f * 0.1 / 2), ve);
    return {
      centerX: s,
      centerY: c,
      halfW: m,
      halfH: p
    };
  }
  function S0(l, n, r) {
    const { centerX: o, centerY: s, halfW: c, halfH: d } = lh(r), f = c * 2, m = d * 2, p = Cn(o - c), v = Cn(s - d), { layerNumber: b, datatype: w } = nh(), E = new u0(p, v, f, m, b, w);
    de.getState().execute(E, {
      library: l,
      renderer: n
    });
  }
  function C0(l, n, r) {
    const { centerX: o, centerY: s, halfW: c, halfH: d } = lh(r), f = new Float64Array([
      Cn(o - c),
      Cn(s - d),
      Cn(o + c),
      Cn(s - d),
      Cn(o),
      Cn(s + d)
    ]), { layerNumber: m, datatype: p } = nh(), v = new f0(f, m, p);
    de.getState().execute(v, {
      library: l,
      renderer: n
    });
  }
  function E0(l, n, r) {
    const { centerX: o, centerY: s, halfH: c } = lh(r), d = Math.max(Cn(c), ve), { layerNumber: f, datatype: m } = nh(), p = new _0("Text", Cn(o), Cn(s), d, f, m);
    de.getState().execute(p, {
      library: l,
      renderer: n
    }), we.getState().bumpSyncGeneration();
  }
  class _0 {
    constructor(n, r, o, s, c, d = 0) {
      __publicField(this, "type", "create-text");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.text = n, this.x = r, this.y = o, this.height = s, this.layer = c, this.datatype = d, this.description = `Create text "${n.slice(0, 20)}" at (${r}, ${o})`;
    }
    execute(n) {
      const r = n.library.add_text(this.text, this.x, this.y, this.height, this.layer, this.datatype);
      r && (this.elementId = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ae.getState().select(r));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ae.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class KS {
    constructor(n, r, o) {
      __publicField(this, "type", "update-text-content");
      __publicField(this, "description", "Update text content");
      this.elementId = n, this.oldText = r, this.newText = o;
    }
    execute(n) {
      n.library.update_text(this.elementId, this.newText), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.update_text(this.elementId, this.oldText), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class QS {
    constructor(n, r, o, s, c) {
      __publicField(this, "type", "move-text");
      __publicField(this, "description", "Move text");
      this.elementId = n, this.oldX = r, this.oldY = o, this.newX = s, this.newY = c;
    }
    execute(n) {
      n.library.set_text_position(this.elementId, this.newX, this.newY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_text_position(this.elementId, this.oldX, this.oldY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class FS {
    constructor(n, r, o) {
      __publicField(this, "type", "set-text-height");
      __publicField(this, "description", "Set text height");
      this.elementId = n, this.oldHeight = r, this.newHeight = o;
    }
    execute(n) {
      n.library.set_text_height(this.elementId, this.newHeight), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_text_height(this.elementId, this.oldHeight), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class k0 {
    constructor(n) {
      __publicField(this, "type", "text-to-polygons");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "resultIds", []);
      this.textElementIds = n, this.description = n.length === 1 ? "Convert text to polygons" : `Convert ${n.length} texts to polygons`;
    }
    execute(n) {
      if (this.snapshots.length === 0) for (const r of this.textElementIds) {
        const o = n.library.get_text_element_info(r);
        o && this.snapshots.push({
          snapshot: {
            type: "text",
            text: o.text,
            x: o.x,
            y: o.y,
            height: o.height,
            layer: o.layer,
            datatype: o.datatype
          },
          currentId: r
        });
      }
      this.resultIds = [];
      for (const r of this.snapshots) {
        const o = n.library.text_to_polygons(r.currentId);
        this.resultIds.push(...o);
      }
      this.resultIds.length > 0 ? ae.getState().selectAll(this.resultIds) : ae.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      this.resultIds.length > 0 && (n.library.remove_elements(this.resultIds), this.resultIds = []);
      const r = [];
      for (const o of this.snapshots) {
        const s = o.snapshot, c = n.library.add_text(s.text, s.x, s.y, s.height, s.layer, s.datatype);
        c && (o.currentId = c, r.push(c));
      }
      r.length > 0 && ae.getState().selectAll(r), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class M0 {
    constructor(n, r, o) {
      __publicField(this, "type", "align-elements");
      __publicField(this, "description");
      __publicField(this, "deltas", []);
      this.selectedIds = n, this.referenceId = r, this.alignType = o, this.description = `Align elements (${o})`;
    }
    execute(n) {
      this.deltas.length === 0 && (this.deltas = pS(n.library, this.selectedIds, this.referenceId, this.alignType));
      for (const r of this.deltas) n.library.translate_elements(r.ids, r.dx, r.dy);
      n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      for (let r = this.deltas.length - 1; r >= 0; r--) {
        const o = this.deltas[r];
        n.library.translate_elements(o.ids, -o.dx, -o.dy);
      }
      n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class j0 {
    constructor(n, r, o) {
      __publicField(this, "type", "boolean-operation");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "currentIds");
      __publicField(this, "currentBaseId");
      __publicField(this, "resultIds", []);
      this.operation = r, this.description = `Boolean ${r}`, this.currentIds = [
        ...n
      ], this.currentBaseId = o;
    }
    execute(n) {
      this.snapshots.length === 0 && (this.snapshots = mr(n.library, this.currentIds)), this.resultIds = n.library.boolean_operation(this.currentIds, this.operation, this.currentBaseId), this.resultIds.length > 0 ? ae.getState().selectAll(this.resultIds) : ae.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      this.resultIds.length > 0 && n.library.remove_elements(this.resultIds);
      const r = ti(n.library, this.snapshots), o = this.currentIds.indexOf(this.currentBaseId);
      this.currentIds = r, o >= 0 && o < r.length && (this.currentBaseId = r[o]), this.resultIds = [], ae.getState().selectAll(r), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class WS {
    constructor(n) {
      __publicField(this, "type", "add-image");
      __publicField(this, "description", "Insert image");
      this.entry = n;
    }
    execute(n) {
      Ot.getState().addImage(this.entry), ae.getState().select(Wo(this.entry.id));
    }
    undo(n) {
      Ot.getState().removeImage(this.entry.id), ae.getState().clearSelection();
    }
  }
  class L0 {
    constructor(n) {
      __publicField(this, "type", "remove-image");
      __publicField(this, "description", "Remove image");
      __publicField(this, "snapshots", []);
      __publicField(this, "imageIds");
      this.imageIds = Array.isArray(n) ? n : [
        n
      ];
    }
    execute(n) {
      const r = Ot.getState();
      if (this.snapshots.length === 0) for (const o of this.imageIds) {
        const s = r.images.get(o);
        s && this.snapshots.push(s);
      }
      for (const o of this.imageIds) Ot.getState().removeImage(o);
      ae.getState().clearSelection();
    }
    undo(n) {
      const r = [];
      for (const o of this.snapshots) Ot.getState().addImage(o), r.push(Wo(o.id));
      r.length > 0 && ae.getState().selectAll(r);
    }
  }
  class JS {
    constructor(n, r, o, s, c) {
      __publicField(this, "type", "move-image");
      __publicField(this, "description", "Move image");
      this.imageId = n, this.oldX = r, this.oldY = o, this.newX = s, this.newY = c;
    }
    execute(n) {
      Ot.getState().updateImage(this.imageId, {
        x: this.newX,
        y: this.newY
      });
    }
    undo(n) {
      Ot.getState().updateImage(this.imageId, {
        x: this.oldX,
        y: this.oldY
      });
    }
  }
  class e2 {
    constructor(n, r, o) {
      __publicField(this, "type", "move-images");
      __publicField(this, "description", "Move images");
      this.imageIds = n, this.deltaX = r, this.deltaY = o;
    }
    execute(n) {
      const r = Ot.getState();
      for (const o of this.imageIds) {
        const s = Ur(o), c = r.images.get(s);
        c && r.updateImage(s, {
          x: c.x + this.deltaX,
          y: c.y + this.deltaY
        });
      }
    }
    undo(n) {
      const r = Ot.getState();
      for (const o of this.imageIds) {
        const s = Ur(o), c = r.images.get(s);
        c && r.updateImage(s, {
          x: c.x - this.deltaX,
          y: c.y - this.deltaY
        });
      }
    }
  }
  class t2 {
    constructor(n, r, o, s, c) {
      __publicField(this, "type", "resize-image");
      __publicField(this, "description", "Resize image");
      this.imageId = n, this.oldWidth = r, this.oldHeight = o, this.newWidth = s, this.newHeight = c;
    }
    execute(n) {
      Ot.getState().updateImage(this.imageId, {
        width: this.newWidth,
        height: this.newHeight
      });
    }
    undo(n) {
      Ot.getState().updateImage(this.imageId, {
        width: this.oldWidth,
        height: this.oldHeight
      });
    }
  }
  const nn = xt()((l) => ({
    isOpen: false,
    initialSearch: "",
    open: (n) => l({
      isOpen: true,
      initialSearch: n ?? ""
    }),
    close: () => l({
      isOpen: false,
      initialSearch: ""
    }),
    toggle: () => l((n) => ({
      isOpen: !n.isOpen,
      initialSearch: ""
    }))
  })), zf = xt()((l, n) => ({
    stack: [],
    claim: (r) => l((o) => ({
      stack: o.stack.includes(r) ? o.stack : [
        ...o.stack,
        r
      ]
    })),
    release: (r) => l((o) => ({
      stack: o.stack.filter((s) => s !== r)
    })),
    isCanvasActive: () => n().stack.length === 0
  })), Kt = xt((l) => ({
    activeText: null,
    showCursor: true,
    isEditingText: false,
    startEditing: (n, r) => l({
      activeText: {
        x: n,
        y: r,
        content: "",
        cursorPosition: {
          line: 0,
          column: 0
        }
      },
      showCursor: true,
      isEditingText: true
    }),
    setActiveText: (n) => l({
      activeText: n,
      showCursor: true
    }),
    stopEditing: () => l({
      activeText: null,
      showCursor: true,
      isEditingText: false
    }),
    toggleCursor: () => l((n) => ({
      showCursor: !n.showCursor
    })),
    resetCursor: () => l({
      showCursor: true
    })
  }));
  function R0(l) {
    var n, r, o = "";
    if (typeof l == "string" || typeof l == "number") o += l;
    else if (typeof l == "object") if (Array.isArray(l)) {
      var s = l.length;
      for (n = 0; n < s; n++) l[n] && (r = R0(l[n])) && (o && (o += " "), o += r);
    } else for (r in l) l[r] && (o && (o += " "), o += r);
    return o;
  }
  function n2() {
    for (var l, n, r = 0, o = "", s = arguments.length; r < s; r++) (l = arguments[r]) && (n = R0(l)) && (o && (o += " "), o += n);
    return o;
  }
  const rh = "-", l2 = (l) => {
    const n = a2(l), { conflictingClassGroups: r, conflictingClassGroupModifiers: o } = l;
    return {
      getClassGroupId: (d) => {
        const f = d.split(rh);
        return f[0] === "" && f.length !== 1 && f.shift(), A0(f, n) || r2(d);
      },
      getConflictingClassGroupIds: (d, f) => {
        const m = r[d] || [];
        return f && o[d] ? [
          ...m,
          ...o[d]
        ] : m;
      }
    };
  }, A0 = (l, n) => {
    var _a;
    if (l.length === 0) return n.classGroupId;
    const r = l[0], o = n.nextPart.get(r), s = o ? A0(l.slice(1), o) : void 0;
    if (s) return s;
    if (n.validators.length === 0) return;
    const c = l.join(rh);
    return (_a = n.validators.find(({ validator: d }) => d(c))) == null ? void 0 : _a.classGroupId;
  }, Cy = /^\[(.+)\]$/, r2 = (l) => {
    if (Cy.test(l)) {
      const n = Cy.exec(l)[1], r = n == null ? void 0 : n.substring(0, n.indexOf(":"));
      if (r) return "arbitrary.." + r;
    }
  }, a2 = (l) => {
    const { theme: n, prefix: r } = l, o = {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    };
    return i2(Object.entries(l.classGroups), r).forEach(([c, d]) => {
      Hf(d, o, c, n);
    }), o;
  }, Hf = (l, n, r, o) => {
    l.forEach((s) => {
      if (typeof s == "string") {
        const c = s === "" ? n : Ey(n, s);
        c.classGroupId = r;
        return;
      }
      if (typeof s == "function") {
        if (o2(s)) {
          Hf(s(o), n, r, o);
          return;
        }
        n.validators.push({
          validator: s,
          classGroupId: r
        });
        return;
      }
      Object.entries(s).forEach(([c, d]) => {
        Hf(d, Ey(n, c), r, o);
      });
    });
  }, Ey = (l, n) => {
    let r = l;
    return n.split(rh).forEach((o) => {
      r.nextPart.has(o) || r.nextPart.set(o, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      }), r = r.nextPart.get(o);
    }), r;
  }, o2 = (l) => l.isThemeGetter, i2 = (l, n) => n ? l.map(([r, o]) => {
    const s = o.map((c) => typeof c == "string" ? n + c : typeof c == "object" ? Object.fromEntries(Object.entries(c).map(([d, f]) => [
      n + d,
      f
    ])) : c);
    return [
      r,
      s
    ];
  }) : l, s2 = (l) => {
    if (l < 1) return {
      get: () => {
      },
      set: () => {
      }
    };
    let n = 0, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
    const s = (c, d) => {
      r.set(c, d), n++, n > l && (n = 0, o = r, r = /* @__PURE__ */ new Map());
    };
    return {
      get(c) {
        let d = r.get(c);
        if (d !== void 0) return d;
        if ((d = o.get(c)) !== void 0) return s(c, d), d;
      },
      set(c, d) {
        r.has(c) ? r.set(c, d) : s(c, d);
      }
    };
  }, T0 = "!", c2 = (l) => {
    const { separator: n, experimentalParseClassName: r } = l, o = n.length === 1, s = n[0], c = n.length, d = (f) => {
      const m = [];
      let p = 0, v = 0, b;
      for (let C = 0; C < f.length; C++) {
        let _ = f[C];
        if (p === 0) {
          if (_ === s && (o || f.slice(C, C + c) === n)) {
            m.push(f.slice(v, C)), v = C + c;
            continue;
          }
          if (_ === "/") {
            b = C;
            continue;
          }
        }
        _ === "[" ? p++ : _ === "]" && p--;
      }
      const w = m.length === 0 ? f : f.substring(v), E = w.startsWith(T0), k = E ? w.substring(1) : w, S = b && b > v ? b - v : void 0;
      return {
        modifiers: m,
        hasImportantModifier: E,
        baseClassName: k,
        maybePostfixModifierPosition: S
      };
    };
    return r ? (f) => r({
      className: f,
      parseClassName: d
    }) : d;
  }, u2 = (l) => {
    if (l.length <= 1) return l;
    const n = [];
    let r = [];
    return l.forEach((o) => {
      o[0] === "[" ? (n.push(...r.sort(), o), r = []) : r.push(o);
    }), n.push(...r.sort()), n;
  }, d2 = (l) => ({
    cache: s2(l.cacheSize),
    parseClassName: c2(l),
    ...l2(l)
  }), f2 = /\s+/, h2 = (l, n) => {
    const { parseClassName: r, getClassGroupId: o, getConflictingClassGroupIds: s } = n, c = [], d = l.trim().split(f2);
    let f = "";
    for (let m = d.length - 1; m >= 0; m -= 1) {
      const p = d[m], { modifiers: v, hasImportantModifier: b, baseClassName: w, maybePostfixModifierPosition: E } = r(p);
      let k = !!E, S = o(k ? w.substring(0, E) : w);
      if (!S) {
        if (!k) {
          f = p + (f.length > 0 ? " " + f : f);
          continue;
        }
        if (S = o(w), !S) {
          f = p + (f.length > 0 ? " " + f : f);
          continue;
        }
        k = false;
      }
      const C = u2(v).join(":"), _ = b ? C + T0 : C, L = _ + S;
      if (c.includes(L)) continue;
      c.push(L);
      const R = s(S, k);
      for (let T = 0; T < R.length; ++T) {
        const B = R[T];
        c.push(_ + B);
      }
      f = p + (f.length > 0 ? " " + f : f);
    }
    return f;
  };
  function m2() {
    let l = 0, n, r, o = "";
    for (; l < arguments.length; ) (n = arguments[l++]) && (r = N0(n)) && (o && (o += " "), o += r);
    return o;
  }
  const N0 = (l) => {
    if (typeof l == "string") return l;
    let n, r = "";
    for (let o = 0; o < l.length; o++) l[o] && (n = N0(l[o])) && (r && (r += " "), r += n);
    return r;
  };
  function g2(l, ...n) {
    let r, o, s, c = d;
    function d(m) {
      const p = n.reduce((v, b) => b(v), l());
      return r = d2(p), o = r.cache.get, s = r.cache.set, c = f, f(m);
    }
    function f(m) {
      const p = o(m);
      if (p) return p;
      const v = h2(m, r);
      return s(m, v), v;
    }
    return function() {
      return c(m2.apply(null, arguments));
    };
  }
  const bt = (l) => {
    const n = (r) => r[l] || [];
    return n.isThemeGetter = true, n;
  }, O0 = /^\[(?:([a-z-]+):)?(.+)\]$/i, p2 = /^\d+\/\d+$/, y2 = /* @__PURE__ */ new Set([
    "px",
    "full",
    "screen"
  ]), b2 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, v2 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, x2 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, w2 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, S2 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ml = (l) => za(l) || y2.has(l) || p2.test(l), or = (l) => Ua(l, "length", R2), za = (l) => !!l && !Number.isNaN(Number(l)), Hd = (l) => Ua(l, "number", za), Oo = (l) => !!l && Number.isInteger(Number(l)), C2 = (l) => l.endsWith("%") && za(l.slice(0, -1)), He = (l) => O0.test(l), ir = (l) => b2.test(l), E2 = /* @__PURE__ */ new Set([
    "length",
    "size",
    "percentage"
  ]), _2 = (l) => Ua(l, E2, D0), k2 = (l) => Ua(l, "position", D0), M2 = /* @__PURE__ */ new Set([
    "image",
    "url"
  ]), j2 = (l) => Ua(l, M2, T2), L2 = (l) => Ua(l, "", A2), Do = () => true, Ua = (l, n, r) => {
    const o = O0.exec(l);
    return o ? o[1] ? typeof n == "string" ? o[1] === n : n.has(o[1]) : r(o[2]) : false;
  }, R2 = (l) => v2.test(l) && !x2.test(l), D0 = () => false, A2 = (l) => w2.test(l), T2 = (l) => S2.test(l), N2 = () => {
    const l = bt("colors"), n = bt("spacing"), r = bt("blur"), o = bt("brightness"), s = bt("borderColor"), c = bt("borderRadius"), d = bt("borderSpacing"), f = bt("borderWidth"), m = bt("contrast"), p = bt("grayscale"), v = bt("hueRotate"), b = bt("invert"), w = bt("gap"), E = bt("gradientColorStops"), k = bt("gradientColorStopPositions"), S = bt("inset"), C = bt("margin"), _ = bt("opacity"), L = bt("padding"), R = bt("saturate"), T = bt("scale"), B = bt("sepia"), N = bt("skew"), A = bt("space"), H = bt("translate"), z = () => [
      "auto",
      "contain",
      "none"
    ], P = () => [
      "auto",
      "hidden",
      "clip",
      "visible",
      "scroll"
    ], ee = () => [
      "auto",
      He,
      n
    ], J = () => [
      He,
      n
    ], ce = () => [
      "",
      Ml,
      or
    ], fe = () => [
      "auto",
      za,
      He
    ], Se = () => [
      "bottom",
      "center",
      "left",
      "left-bottom",
      "left-top",
      "right",
      "right-bottom",
      "right-top",
      "top"
    ], $ = () => [
      "solid",
      "dashed",
      "dotted",
      "double",
      "none"
    ], F = () => [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color",
      "luminosity"
    ], ie = () => [
      "start",
      "end",
      "center",
      "between",
      "around",
      "evenly",
      "stretch"
    ], Ee = () => [
      "",
      "0",
      He
    ], pe = () => [
      "auto",
      "avoid",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "column"
    ], j = () => [
      za,
      He
    ];
    return {
      cacheSize: 500,
      separator: ":",
      theme: {
        colors: [
          Do
        ],
        spacing: [
          Ml,
          or
        ],
        blur: [
          "none",
          "",
          ir,
          He
        ],
        brightness: j(),
        borderColor: [
          l
        ],
        borderRadius: [
          "none",
          "",
          "full",
          ir,
          He
        ],
        borderSpacing: J(),
        borderWidth: ce(),
        contrast: j(),
        grayscale: Ee(),
        hueRotate: j(),
        invert: Ee(),
        gap: J(),
        gradientColorStops: [
          l
        ],
        gradientColorStopPositions: [
          C2,
          or
        ],
        inset: ee(),
        margin: ee(),
        opacity: j(),
        padding: J(),
        saturate: j(),
        scale: j(),
        sepia: Ee(),
        skew: j(),
        space: J(),
        translate: J()
      },
      classGroups: {
        aspect: [
          {
            aspect: [
              "auto",
              "square",
              "video",
              He
            ]
          }
        ],
        container: [
          "container"
        ],
        columns: [
          {
            columns: [
              ir
            ]
          }
        ],
        "break-after": [
          {
            "break-after": pe()
          }
        ],
        "break-before": [
          {
            "break-before": pe()
          }
        ],
        "break-inside": [
          {
            "break-inside": [
              "auto",
              "avoid",
              "avoid-page",
              "avoid-column"
            ]
          }
        ],
        "box-decoration": [
          {
            "box-decoration": [
              "slice",
              "clone"
            ]
          }
        ],
        box: [
          {
            box: [
              "border",
              "content"
            ]
          }
        ],
        display: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden"
        ],
        float: [
          {
            float: [
              "right",
              "left",
              "none",
              "start",
              "end"
            ]
          }
        ],
        clear: [
          {
            clear: [
              "left",
              "right",
              "both",
              "none",
              "start",
              "end"
            ]
          }
        ],
        isolation: [
          "isolate",
          "isolation-auto"
        ],
        "object-fit": [
          {
            object: [
              "contain",
              "cover",
              "fill",
              "none",
              "scale-down"
            ]
          }
        ],
        "object-position": [
          {
            object: [
              ...Se(),
              He
            ]
          }
        ],
        overflow: [
          {
            overflow: P()
          }
        ],
        "overflow-x": [
          {
            "overflow-x": P()
          }
        ],
        "overflow-y": [
          {
            "overflow-y": P()
          }
        ],
        overscroll: [
          {
            overscroll: z()
          }
        ],
        "overscroll-x": [
          {
            "overscroll-x": z()
          }
        ],
        "overscroll-y": [
          {
            "overscroll-y": z()
          }
        ],
        position: [
          "static",
          "fixed",
          "absolute",
          "relative",
          "sticky"
        ],
        inset: [
          {
            inset: [
              S
            ]
          }
        ],
        "inset-x": [
          {
            "inset-x": [
              S
            ]
          }
        ],
        "inset-y": [
          {
            "inset-y": [
              S
            ]
          }
        ],
        start: [
          {
            start: [
              S
            ]
          }
        ],
        end: [
          {
            end: [
              S
            ]
          }
        ],
        top: [
          {
            top: [
              S
            ]
          }
        ],
        right: [
          {
            right: [
              S
            ]
          }
        ],
        bottom: [
          {
            bottom: [
              S
            ]
          }
        ],
        left: [
          {
            left: [
              S
            ]
          }
        ],
        visibility: [
          "visible",
          "invisible",
          "collapse"
        ],
        z: [
          {
            z: [
              "auto",
              Oo,
              He
            ]
          }
        ],
        basis: [
          {
            basis: ee()
          }
        ],
        "flex-direction": [
          {
            flex: [
              "row",
              "row-reverse",
              "col",
              "col-reverse"
            ]
          }
        ],
        "flex-wrap": [
          {
            flex: [
              "wrap",
              "wrap-reverse",
              "nowrap"
            ]
          }
        ],
        flex: [
          {
            flex: [
              "1",
              "auto",
              "initial",
              "none",
              He
            ]
          }
        ],
        grow: [
          {
            grow: Ee()
          }
        ],
        shrink: [
          {
            shrink: Ee()
          }
        ],
        order: [
          {
            order: [
              "first",
              "last",
              "none",
              Oo,
              He
            ]
          }
        ],
        "grid-cols": [
          {
            "grid-cols": [
              Do
            ]
          }
        ],
        "col-start-end": [
          {
            col: [
              "auto",
              {
                span: [
                  "full",
                  Oo,
                  He
                ]
              },
              He
            ]
          }
        ],
        "col-start": [
          {
            "col-start": fe()
          }
        ],
        "col-end": [
          {
            "col-end": fe()
          }
        ],
        "grid-rows": [
          {
            "grid-rows": [
              Do
            ]
          }
        ],
        "row-start-end": [
          {
            row: [
              "auto",
              {
                span: [
                  Oo,
                  He
                ]
              },
              He
            ]
          }
        ],
        "row-start": [
          {
            "row-start": fe()
          }
        ],
        "row-end": [
          {
            "row-end": fe()
          }
        ],
        "grid-flow": [
          {
            "grid-flow": [
              "row",
              "col",
              "dense",
              "row-dense",
              "col-dense"
            ]
          }
        ],
        "auto-cols": [
          {
            "auto-cols": [
              "auto",
              "min",
              "max",
              "fr",
              He
            ]
          }
        ],
        "auto-rows": [
          {
            "auto-rows": [
              "auto",
              "min",
              "max",
              "fr",
              He
            ]
          }
        ],
        gap: [
          {
            gap: [
              w
            ]
          }
        ],
        "gap-x": [
          {
            "gap-x": [
              w
            ]
          }
        ],
        "gap-y": [
          {
            "gap-y": [
              w
            ]
          }
        ],
        "justify-content": [
          {
            justify: [
              "normal",
              ...ie()
            ]
          }
        ],
        "justify-items": [
          {
            "justify-items": [
              "start",
              "end",
              "center",
              "stretch"
            ]
          }
        ],
        "justify-self": [
          {
            "justify-self": [
              "auto",
              "start",
              "end",
              "center",
              "stretch"
            ]
          }
        ],
        "align-content": [
          {
            content: [
              "normal",
              ...ie(),
              "baseline"
            ]
          }
        ],
        "align-items": [
          {
            items: [
              "start",
              "end",
              "center",
              "baseline",
              "stretch"
            ]
          }
        ],
        "align-self": [
          {
            self: [
              "auto",
              "start",
              "end",
              "center",
              "stretch",
              "baseline"
            ]
          }
        ],
        "place-content": [
          {
            "place-content": [
              ...ie(),
              "baseline"
            ]
          }
        ],
        "place-items": [
          {
            "place-items": [
              "start",
              "end",
              "center",
              "baseline",
              "stretch"
            ]
          }
        ],
        "place-self": [
          {
            "place-self": [
              "auto",
              "start",
              "end",
              "center",
              "stretch"
            ]
          }
        ],
        p: [
          {
            p: [
              L
            ]
          }
        ],
        px: [
          {
            px: [
              L
            ]
          }
        ],
        py: [
          {
            py: [
              L
            ]
          }
        ],
        ps: [
          {
            ps: [
              L
            ]
          }
        ],
        pe: [
          {
            pe: [
              L
            ]
          }
        ],
        pt: [
          {
            pt: [
              L
            ]
          }
        ],
        pr: [
          {
            pr: [
              L
            ]
          }
        ],
        pb: [
          {
            pb: [
              L
            ]
          }
        ],
        pl: [
          {
            pl: [
              L
            ]
          }
        ],
        m: [
          {
            m: [
              C
            ]
          }
        ],
        mx: [
          {
            mx: [
              C
            ]
          }
        ],
        my: [
          {
            my: [
              C
            ]
          }
        ],
        ms: [
          {
            ms: [
              C
            ]
          }
        ],
        me: [
          {
            me: [
              C
            ]
          }
        ],
        mt: [
          {
            mt: [
              C
            ]
          }
        ],
        mr: [
          {
            mr: [
              C
            ]
          }
        ],
        mb: [
          {
            mb: [
              C
            ]
          }
        ],
        ml: [
          {
            ml: [
              C
            ]
          }
        ],
        "space-x": [
          {
            "space-x": [
              A
            ]
          }
        ],
        "space-x-reverse": [
          "space-x-reverse"
        ],
        "space-y": [
          {
            "space-y": [
              A
            ]
          }
        ],
        "space-y-reverse": [
          "space-y-reverse"
        ],
        w: [
          {
            w: [
              "auto",
              "min",
              "max",
              "fit",
              "svw",
              "lvw",
              "dvw",
              He,
              n
            ]
          }
        ],
        "min-w": [
          {
            "min-w": [
              He,
              n,
              "min",
              "max",
              "fit"
            ]
          }
        ],
        "max-w": [
          {
            "max-w": [
              He,
              n,
              "none",
              "full",
              "min",
              "max",
              "fit",
              "prose",
              {
                screen: [
                  ir
                ]
              },
              ir
            ]
          }
        ],
        h: [
          {
            h: [
              He,
              n,
              "auto",
              "min",
              "max",
              "fit",
              "svh",
              "lvh",
              "dvh"
            ]
          }
        ],
        "min-h": [
          {
            "min-h": [
              He,
              n,
              "min",
              "max",
              "fit",
              "svh",
              "lvh",
              "dvh"
            ]
          }
        ],
        "max-h": [
          {
            "max-h": [
              He,
              n,
              "min",
              "max",
              "fit",
              "svh",
              "lvh",
              "dvh"
            ]
          }
        ],
        size: [
          {
            size: [
              He,
              n,
              "auto",
              "min",
              "max",
              "fit"
            ]
          }
        ],
        "font-size": [
          {
            text: [
              "base",
              ir,
              or
            ]
          }
        ],
        "font-smoothing": [
          "antialiased",
          "subpixel-antialiased"
        ],
        "font-style": [
          "italic",
          "not-italic"
        ],
        "font-weight": [
          {
            font: [
              "thin",
              "extralight",
              "light",
              "normal",
              "medium",
              "semibold",
              "bold",
              "extrabold",
              "black",
              Hd
            ]
          }
        ],
        "font-family": [
          {
            font: [
              Do
            ]
          }
        ],
        "fvn-normal": [
          "normal-nums"
        ],
        "fvn-ordinal": [
          "ordinal"
        ],
        "fvn-slashed-zero": [
          "slashed-zero"
        ],
        "fvn-figure": [
          "lining-nums",
          "oldstyle-nums"
        ],
        "fvn-spacing": [
          "proportional-nums",
          "tabular-nums"
        ],
        "fvn-fraction": [
          "diagonal-fractions",
          "stacked-fractions"
        ],
        tracking: [
          {
            tracking: [
              "tighter",
              "tight",
              "normal",
              "wide",
              "wider",
              "widest",
              He
            ]
          }
        ],
        "line-clamp": [
          {
            "line-clamp": [
              "none",
              za,
              Hd
            ]
          }
        ],
        leading: [
          {
            leading: [
              "none",
              "tight",
              "snug",
              "normal",
              "relaxed",
              "loose",
              Ml,
              He
            ]
          }
        ],
        "list-image": [
          {
            "list-image": [
              "none",
              He
            ]
          }
        ],
        "list-style-type": [
          {
            list: [
              "none",
              "disc",
              "decimal",
              He
            ]
          }
        ],
        "list-style-position": [
          {
            list: [
              "inside",
              "outside"
            ]
          }
        ],
        "placeholder-color": [
          {
            placeholder: [
              l
            ]
          }
        ],
        "placeholder-opacity": [
          {
            "placeholder-opacity": [
              _
            ]
          }
        ],
        "text-alignment": [
          {
            text: [
              "left",
              "center",
              "right",
              "justify",
              "start",
              "end"
            ]
          }
        ],
        "text-color": [
          {
            text: [
              l
            ]
          }
        ],
        "text-opacity": [
          {
            "text-opacity": [
              _
            ]
          }
        ],
        "text-decoration": [
          "underline",
          "overline",
          "line-through",
          "no-underline"
        ],
        "text-decoration-style": [
          {
            decoration: [
              ...$(),
              "wavy"
            ]
          }
        ],
        "text-decoration-thickness": [
          {
            decoration: [
              "auto",
              "from-font",
              Ml,
              or
            ]
          }
        ],
        "underline-offset": [
          {
            "underline-offset": [
              "auto",
              Ml,
              He
            ]
          }
        ],
        "text-decoration-color": [
          {
            decoration: [
              l
            ]
          }
        ],
        "text-transform": [
          "uppercase",
          "lowercase",
          "capitalize",
          "normal-case"
        ],
        "text-overflow": [
          "truncate",
          "text-ellipsis",
          "text-clip"
        ],
        "text-wrap": [
          {
            text: [
              "wrap",
              "nowrap",
              "balance",
              "pretty"
            ]
          }
        ],
        indent: [
          {
            indent: J()
          }
        ],
        "vertical-align": [
          {
            align: [
              "baseline",
              "top",
              "middle",
              "bottom",
              "text-top",
              "text-bottom",
              "sub",
              "super",
              He
            ]
          }
        ],
        whitespace: [
          {
            whitespace: [
              "normal",
              "nowrap",
              "pre",
              "pre-line",
              "pre-wrap",
              "break-spaces"
            ]
          }
        ],
        break: [
          {
            break: [
              "normal",
              "words",
              "all",
              "keep"
            ]
          }
        ],
        hyphens: [
          {
            hyphens: [
              "none",
              "manual",
              "auto"
            ]
          }
        ],
        content: [
          {
            content: [
              "none",
              He
            ]
          }
        ],
        "bg-attachment": [
          {
            bg: [
              "fixed",
              "local",
              "scroll"
            ]
          }
        ],
        "bg-clip": [
          {
            "bg-clip": [
              "border",
              "padding",
              "content",
              "text"
            ]
          }
        ],
        "bg-opacity": [
          {
            "bg-opacity": [
              _
            ]
          }
        ],
        "bg-origin": [
          {
            "bg-origin": [
              "border",
              "padding",
              "content"
            ]
          }
        ],
        "bg-position": [
          {
            bg: [
              ...Se(),
              k2
            ]
          }
        ],
        "bg-repeat": [
          {
            bg: [
              "no-repeat",
              {
                repeat: [
                  "",
                  "x",
                  "y",
                  "round",
                  "space"
                ]
              }
            ]
          }
        ],
        "bg-size": [
          {
            bg: [
              "auto",
              "cover",
              "contain",
              _2
            ]
          }
        ],
        "bg-image": [
          {
            bg: [
              "none",
              {
                "gradient-to": [
                  "t",
                  "tr",
                  "r",
                  "br",
                  "b",
                  "bl",
                  "l",
                  "tl"
                ]
              },
              j2
            ]
          }
        ],
        "bg-color": [
          {
            bg: [
              l
            ]
          }
        ],
        "gradient-from-pos": [
          {
            from: [
              k
            ]
          }
        ],
        "gradient-via-pos": [
          {
            via: [
              k
            ]
          }
        ],
        "gradient-to-pos": [
          {
            to: [
              k
            ]
          }
        ],
        "gradient-from": [
          {
            from: [
              E
            ]
          }
        ],
        "gradient-via": [
          {
            via: [
              E
            ]
          }
        ],
        "gradient-to": [
          {
            to: [
              E
            ]
          }
        ],
        rounded: [
          {
            rounded: [
              c
            ]
          }
        ],
        "rounded-s": [
          {
            "rounded-s": [
              c
            ]
          }
        ],
        "rounded-e": [
          {
            "rounded-e": [
              c
            ]
          }
        ],
        "rounded-t": [
          {
            "rounded-t": [
              c
            ]
          }
        ],
        "rounded-r": [
          {
            "rounded-r": [
              c
            ]
          }
        ],
        "rounded-b": [
          {
            "rounded-b": [
              c
            ]
          }
        ],
        "rounded-l": [
          {
            "rounded-l": [
              c
            ]
          }
        ],
        "rounded-ss": [
          {
            "rounded-ss": [
              c
            ]
          }
        ],
        "rounded-se": [
          {
            "rounded-se": [
              c
            ]
          }
        ],
        "rounded-ee": [
          {
            "rounded-ee": [
              c
            ]
          }
        ],
        "rounded-es": [
          {
            "rounded-es": [
              c
            ]
          }
        ],
        "rounded-tl": [
          {
            "rounded-tl": [
              c
            ]
          }
        ],
        "rounded-tr": [
          {
            "rounded-tr": [
              c
            ]
          }
        ],
        "rounded-br": [
          {
            "rounded-br": [
              c
            ]
          }
        ],
        "rounded-bl": [
          {
            "rounded-bl": [
              c
            ]
          }
        ],
        "border-w": [
          {
            border: [
              f
            ]
          }
        ],
        "border-w-x": [
          {
            "border-x": [
              f
            ]
          }
        ],
        "border-w-y": [
          {
            "border-y": [
              f
            ]
          }
        ],
        "border-w-s": [
          {
            "border-s": [
              f
            ]
          }
        ],
        "border-w-e": [
          {
            "border-e": [
              f
            ]
          }
        ],
        "border-w-t": [
          {
            "border-t": [
              f
            ]
          }
        ],
        "border-w-r": [
          {
            "border-r": [
              f
            ]
          }
        ],
        "border-w-b": [
          {
            "border-b": [
              f
            ]
          }
        ],
        "border-w-l": [
          {
            "border-l": [
              f
            ]
          }
        ],
        "border-opacity": [
          {
            "border-opacity": [
              _
            ]
          }
        ],
        "border-style": [
          {
            border: [
              ...$(),
              "hidden"
            ]
          }
        ],
        "divide-x": [
          {
            "divide-x": [
              f
            ]
          }
        ],
        "divide-x-reverse": [
          "divide-x-reverse"
        ],
        "divide-y": [
          {
            "divide-y": [
              f
            ]
          }
        ],
        "divide-y-reverse": [
          "divide-y-reverse"
        ],
        "divide-opacity": [
          {
            "divide-opacity": [
              _
            ]
          }
        ],
        "divide-style": [
          {
            divide: $()
          }
        ],
        "border-color": [
          {
            border: [
              s
            ]
          }
        ],
        "border-color-x": [
          {
            "border-x": [
              s
            ]
          }
        ],
        "border-color-y": [
          {
            "border-y": [
              s
            ]
          }
        ],
        "border-color-s": [
          {
            "border-s": [
              s
            ]
          }
        ],
        "border-color-e": [
          {
            "border-e": [
              s
            ]
          }
        ],
        "border-color-t": [
          {
            "border-t": [
              s
            ]
          }
        ],
        "border-color-r": [
          {
            "border-r": [
              s
            ]
          }
        ],
        "border-color-b": [
          {
            "border-b": [
              s
            ]
          }
        ],
        "border-color-l": [
          {
            "border-l": [
              s
            ]
          }
        ],
        "divide-color": [
          {
            divide: [
              s
            ]
          }
        ],
        "outline-style": [
          {
            outline: [
              "",
              ...$()
            ]
          }
        ],
        "outline-offset": [
          {
            "outline-offset": [
              Ml,
              He
            ]
          }
        ],
        "outline-w": [
          {
            outline: [
              Ml,
              or
            ]
          }
        ],
        "outline-color": [
          {
            outline: [
              l
            ]
          }
        ],
        "ring-w": [
          {
            ring: ce()
          }
        ],
        "ring-w-inset": [
          "ring-inset"
        ],
        "ring-color": [
          {
            ring: [
              l
            ]
          }
        ],
        "ring-opacity": [
          {
            "ring-opacity": [
              _
            ]
          }
        ],
        "ring-offset-w": [
          {
            "ring-offset": [
              Ml,
              or
            ]
          }
        ],
        "ring-offset-color": [
          {
            "ring-offset": [
              l
            ]
          }
        ],
        shadow: [
          {
            shadow: [
              "",
              "inner",
              "none",
              ir,
              L2
            ]
          }
        ],
        "shadow-color": [
          {
            shadow: [
              Do
            ]
          }
        ],
        opacity: [
          {
            opacity: [
              _
            ]
          }
        ],
        "mix-blend": [
          {
            "mix-blend": [
              ...F(),
              "plus-lighter",
              "plus-darker"
            ]
          }
        ],
        "bg-blend": [
          {
            "bg-blend": F()
          }
        ],
        filter: [
          {
            filter: [
              "",
              "none"
            ]
          }
        ],
        blur: [
          {
            blur: [
              r
            ]
          }
        ],
        brightness: [
          {
            brightness: [
              o
            ]
          }
        ],
        contrast: [
          {
            contrast: [
              m
            ]
          }
        ],
        "drop-shadow": [
          {
            "drop-shadow": [
              "",
              "none",
              ir,
              He
            ]
          }
        ],
        grayscale: [
          {
            grayscale: [
              p
            ]
          }
        ],
        "hue-rotate": [
          {
            "hue-rotate": [
              v
            ]
          }
        ],
        invert: [
          {
            invert: [
              b
            ]
          }
        ],
        saturate: [
          {
            saturate: [
              R
            ]
          }
        ],
        sepia: [
          {
            sepia: [
              B
            ]
          }
        ],
        "backdrop-filter": [
          {
            "backdrop-filter": [
              "",
              "none"
            ]
          }
        ],
        "backdrop-blur": [
          {
            "backdrop-blur": [
              r
            ]
          }
        ],
        "backdrop-brightness": [
          {
            "backdrop-brightness": [
              o
            ]
          }
        ],
        "backdrop-contrast": [
          {
            "backdrop-contrast": [
              m
            ]
          }
        ],
        "backdrop-grayscale": [
          {
            "backdrop-grayscale": [
              p
            ]
          }
        ],
        "backdrop-hue-rotate": [
          {
            "backdrop-hue-rotate": [
              v
            ]
          }
        ],
        "backdrop-invert": [
          {
            "backdrop-invert": [
              b
            ]
          }
        ],
        "backdrop-opacity": [
          {
            "backdrop-opacity": [
              _
            ]
          }
        ],
        "backdrop-saturate": [
          {
            "backdrop-saturate": [
              R
            ]
          }
        ],
        "backdrop-sepia": [
          {
            "backdrop-sepia": [
              B
            ]
          }
        ],
        "border-collapse": [
          {
            border: [
              "collapse",
              "separate"
            ]
          }
        ],
        "border-spacing": [
          {
            "border-spacing": [
              d
            ]
          }
        ],
        "border-spacing-x": [
          {
            "border-spacing-x": [
              d
            ]
          }
        ],
        "border-spacing-y": [
          {
            "border-spacing-y": [
              d
            ]
          }
        ],
        "table-layout": [
          {
            table: [
              "auto",
              "fixed"
            ]
          }
        ],
        caption: [
          {
            caption: [
              "top",
              "bottom"
            ]
          }
        ],
        transition: [
          {
            transition: [
              "none",
              "all",
              "",
              "colors",
              "opacity",
              "shadow",
              "transform",
              He
            ]
          }
        ],
        duration: [
          {
            duration: j()
          }
        ],
        ease: [
          {
            ease: [
              "linear",
              "in",
              "out",
              "in-out",
              He
            ]
          }
        ],
        delay: [
          {
            delay: j()
          }
        ],
        animate: [
          {
            animate: [
              "none",
              "spin",
              "ping",
              "pulse",
              "bounce",
              He
            ]
          }
        ],
        transform: [
          {
            transform: [
              "",
              "gpu",
              "none"
            ]
          }
        ],
        scale: [
          {
            scale: [
              T
            ]
          }
        ],
        "scale-x": [
          {
            "scale-x": [
              T
            ]
          }
        ],
        "scale-y": [
          {
            "scale-y": [
              T
            ]
          }
        ],
        rotate: [
          {
            rotate: [
              Oo,
              He
            ]
          }
        ],
        "translate-x": [
          {
            "translate-x": [
              H
            ]
          }
        ],
        "translate-y": [
          {
            "translate-y": [
              H
            ]
          }
        ],
        "skew-x": [
          {
            "skew-x": [
              N
            ]
          }
        ],
        "skew-y": [
          {
            "skew-y": [
              N
            ]
          }
        ],
        "transform-origin": [
          {
            origin: [
              "center",
              "top",
              "top-right",
              "right",
              "bottom-right",
              "bottom",
              "bottom-left",
              "left",
              "top-left",
              He
            ]
          }
        ],
        accent: [
          {
            accent: [
              "auto",
              l
            ]
          }
        ],
        appearance: [
          {
            appearance: [
              "none",
              "auto"
            ]
          }
        ],
        cursor: [
          {
            cursor: [
              "auto",
              "default",
              "pointer",
              "wait",
              "text",
              "move",
              "help",
              "not-allowed",
              "none",
              "context-menu",
              "progress",
              "cell",
              "crosshair",
              "vertical-text",
              "alias",
              "copy",
              "no-drop",
              "grab",
              "grabbing",
              "all-scroll",
              "col-resize",
              "row-resize",
              "n-resize",
              "e-resize",
              "s-resize",
              "w-resize",
              "ne-resize",
              "nw-resize",
              "se-resize",
              "sw-resize",
              "ew-resize",
              "ns-resize",
              "nesw-resize",
              "nwse-resize",
              "zoom-in",
              "zoom-out",
              He
            ]
          }
        ],
        "caret-color": [
          {
            caret: [
              l
            ]
          }
        ],
        "pointer-events": [
          {
            "pointer-events": [
              "none",
              "auto"
            ]
          }
        ],
        resize: [
          {
            resize: [
              "none",
              "y",
              "x",
              ""
            ]
          }
        ],
        "scroll-behavior": [
          {
            scroll: [
              "auto",
              "smooth"
            ]
          }
        ],
        "scroll-m": [
          {
            "scroll-m": J()
          }
        ],
        "scroll-mx": [
          {
            "scroll-mx": J()
          }
        ],
        "scroll-my": [
          {
            "scroll-my": J()
          }
        ],
        "scroll-ms": [
          {
            "scroll-ms": J()
          }
        ],
        "scroll-me": [
          {
            "scroll-me": J()
          }
        ],
        "scroll-mt": [
          {
            "scroll-mt": J()
          }
        ],
        "scroll-mr": [
          {
            "scroll-mr": J()
          }
        ],
        "scroll-mb": [
          {
            "scroll-mb": J()
          }
        ],
        "scroll-ml": [
          {
            "scroll-ml": J()
          }
        ],
        "scroll-p": [
          {
            "scroll-p": J()
          }
        ],
        "scroll-px": [
          {
            "scroll-px": J()
          }
        ],
        "scroll-py": [
          {
            "scroll-py": J()
          }
        ],
        "scroll-ps": [
          {
            "scroll-ps": J()
          }
        ],
        "scroll-pe": [
          {
            "scroll-pe": J()
          }
        ],
        "scroll-pt": [
          {
            "scroll-pt": J()
          }
        ],
        "scroll-pr": [
          {
            "scroll-pr": J()
          }
        ],
        "scroll-pb": [
          {
            "scroll-pb": J()
          }
        ],
        "scroll-pl": [
          {
            "scroll-pl": J()
          }
        ],
        "snap-align": [
          {
            snap: [
              "start",
              "end",
              "center",
              "align-none"
            ]
          }
        ],
        "snap-stop": [
          {
            snap: [
              "normal",
              "always"
            ]
          }
        ],
        "snap-type": [
          {
            snap: [
              "none",
              "x",
              "y",
              "both"
            ]
          }
        ],
        "snap-strictness": [
          {
            snap: [
              "mandatory",
              "proximity"
            ]
          }
        ],
        touch: [
          {
            touch: [
              "auto",
              "none",
              "manipulation"
            ]
          }
        ],
        "touch-x": [
          {
            "touch-pan": [
              "x",
              "left",
              "right"
            ]
          }
        ],
        "touch-y": [
          {
            "touch-pan": [
              "y",
              "up",
              "down"
            ]
          }
        ],
        "touch-pz": [
          "touch-pinch-zoom"
        ],
        select: [
          {
            select: [
              "none",
              "text",
              "all",
              "auto"
            ]
          }
        ],
        "will-change": [
          {
            "will-change": [
              "auto",
              "scroll",
              "contents",
              "transform",
              He
            ]
          }
        ],
        fill: [
          {
            fill: [
              l,
              "none"
            ]
          }
        ],
        "stroke-w": [
          {
            stroke: [
              Ml,
              or,
              Hd
            ]
          }
        ],
        stroke: [
          {
            stroke: [
              l,
              "none"
            ]
          }
        ],
        sr: [
          "sr-only",
          "not-sr-only"
        ],
        "forced-color-adjust": [
          {
            "forced-color-adjust": [
              "auto",
              "none"
            ]
          }
        ]
      },
      conflictingClassGroups: {
        overflow: [
          "overflow-x",
          "overflow-y"
        ],
        overscroll: [
          "overscroll-x",
          "overscroll-y"
        ],
        inset: [
          "inset-x",
          "inset-y",
          "start",
          "end",
          "top",
          "right",
          "bottom",
          "left"
        ],
        "inset-x": [
          "right",
          "left"
        ],
        "inset-y": [
          "top",
          "bottom"
        ],
        flex: [
          "basis",
          "grow",
          "shrink"
        ],
        gap: [
          "gap-x",
          "gap-y"
        ],
        p: [
          "px",
          "py",
          "ps",
          "pe",
          "pt",
          "pr",
          "pb",
          "pl"
        ],
        px: [
          "pr",
          "pl"
        ],
        py: [
          "pt",
          "pb"
        ],
        m: [
          "mx",
          "my",
          "ms",
          "me",
          "mt",
          "mr",
          "mb",
          "ml"
        ],
        mx: [
          "mr",
          "ml"
        ],
        my: [
          "mt",
          "mb"
        ],
        size: [
          "w",
          "h"
        ],
        "font-size": [
          "leading"
        ],
        "fvn-normal": [
          "fvn-ordinal",
          "fvn-slashed-zero",
          "fvn-figure",
          "fvn-spacing",
          "fvn-fraction"
        ],
        "fvn-ordinal": [
          "fvn-normal"
        ],
        "fvn-slashed-zero": [
          "fvn-normal"
        ],
        "fvn-figure": [
          "fvn-normal"
        ],
        "fvn-spacing": [
          "fvn-normal"
        ],
        "fvn-fraction": [
          "fvn-normal"
        ],
        "line-clamp": [
          "display",
          "overflow"
        ],
        rounded: [
          "rounded-s",
          "rounded-e",
          "rounded-t",
          "rounded-r",
          "rounded-b",
          "rounded-l",
          "rounded-ss",
          "rounded-se",
          "rounded-ee",
          "rounded-es",
          "rounded-tl",
          "rounded-tr",
          "rounded-br",
          "rounded-bl"
        ],
        "rounded-s": [
          "rounded-ss",
          "rounded-es"
        ],
        "rounded-e": [
          "rounded-se",
          "rounded-ee"
        ],
        "rounded-t": [
          "rounded-tl",
          "rounded-tr"
        ],
        "rounded-r": [
          "rounded-tr",
          "rounded-br"
        ],
        "rounded-b": [
          "rounded-br",
          "rounded-bl"
        ],
        "rounded-l": [
          "rounded-tl",
          "rounded-bl"
        ],
        "border-spacing": [
          "border-spacing-x",
          "border-spacing-y"
        ],
        "border-w": [
          "border-w-s",
          "border-w-e",
          "border-w-t",
          "border-w-r",
          "border-w-b",
          "border-w-l"
        ],
        "border-w-x": [
          "border-w-r",
          "border-w-l"
        ],
        "border-w-y": [
          "border-w-t",
          "border-w-b"
        ],
        "border-color": [
          "border-color-s",
          "border-color-e",
          "border-color-t",
          "border-color-r",
          "border-color-b",
          "border-color-l"
        ],
        "border-color-x": [
          "border-color-r",
          "border-color-l"
        ],
        "border-color-y": [
          "border-color-t",
          "border-color-b"
        ],
        "scroll-m": [
          "scroll-mx",
          "scroll-my",
          "scroll-ms",
          "scroll-me",
          "scroll-mt",
          "scroll-mr",
          "scroll-mb",
          "scroll-ml"
        ],
        "scroll-mx": [
          "scroll-mr",
          "scroll-ml"
        ],
        "scroll-my": [
          "scroll-mt",
          "scroll-mb"
        ],
        "scroll-p": [
          "scroll-px",
          "scroll-py",
          "scroll-ps",
          "scroll-pe",
          "scroll-pt",
          "scroll-pr",
          "scroll-pb",
          "scroll-pl"
        ],
        "scroll-px": [
          "scroll-pr",
          "scroll-pl"
        ],
        "scroll-py": [
          "scroll-pt",
          "scroll-pb"
        ],
        touch: [
          "touch-x",
          "touch-y",
          "touch-pz"
        ],
        "touch-x": [
          "touch"
        ],
        "touch-y": [
          "touch"
        ],
        "touch-pz": [
          "touch"
        ]
      },
      conflictingClassGroupModifiers: {
        "font-size": [
          "leading"
        ]
      }
    };
  }, O2 = g2(N2);
  function Y(...l) {
    return O2(n2(l));
  }
  const _y = 38, Ms = 16;
  function ol(l) {
    const n = l.getBoundingClientRect(), { zenMode: r, explorerCollapsed: o, sidebarCollapsed: s, explorerWidth: c, sidebarWidth: d } = ge.getState();
    let f = 0, m = 0;
    r || (f = o ? _y + Ms : c + Ms, m = s ? _y + Ms : d + Ms);
    const p = Math.max(1, n.width - f - m), v = n.height;
    return {
      width: p,
      height: v,
      screenCenter: {
        x: f + p / 2,
        y: v / 2
      }
    };
  }
  const D2 = typeof navigator < "u" && /Mac|iPod|iPhone|iPad/.test(navigator.platform), Ie = {
    mod: D2 ? "\u2318" : "Ctrl",
    shift: "\u21E7",
    backspace: "\u232B"
  };
  function Hr(l, n) {
    const r = ae.getState().selectedIds;
    if (r.size === 0) return;
    const o = l.get_bounds_for_ids([
      ...r
    ]);
    if (!o) return;
    const s = {
      minX: o[0],
      minY: o[1],
      maxX: o[2],
      maxY: o[3]
    }, c = ol(n);
    Oe.getState().centerOnBounds(s, c.width, c.height, c.screenCenter);
  }
  const I2 = /* @__PURE__ */ new Set([
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
  ]);
  function z2(l, n, r) {
    const o = Oe((b) => b.zoomAt), s = Oe((b) => b.pan), c = Oe((b) => b.zoomToFit), d = Oe((b) => b.zoomToSelected), f = Bt((b) => b.setTool), m = g.useRef(/* @__PURE__ */ new Set()), p = g.useRef(false), v = g.useRef(null);
    g.useEffect(() => {
      const b = () => {
        const C = m.current;
        if (C.size === 0) {
          v.current = null;
          return;
        }
        const _ = p.current ? iS : oS;
        let L = 0, R = 0;
        C.has("ArrowUp") && (R += _), C.has("ArrowDown") && (R -= _), C.has("ArrowLeft") && (L += _), C.has("ArrowRight") && (L -= _), (L !== 0 || R !== 0) && s(L, R), v.current = requestAnimationFrame(b);
      }, w = () => {
        v.current === null && m.current.size > 0 && (v.current = requestAnimationFrame(b));
      }, E = (C) => {
        const _ = l.current;
        if (!_) return;
        if (p.current = C.shiftKey, (C.metaKey || C.ctrlKey) && (C.key === "k" || C.key === "K")) {
          C.preventDefault(), nn.getState().toggle();
          return;
        }
        if (!zf.getState().isCanvasActive() || C.target instanceof HTMLInputElement || C.target instanceof HTMLTextAreaElement || Kt.getState().isEditingText) return;
        if (C.key === "/" && !C.metaKey && !C.ctrlKey && !C.altKey) {
          C.preventDefault(), nn.getState().open();
          return;
        }
        if (I2.has(C.key)) {
          C.preventDefault(), m.current.add(C.key), w();
          return;
        }
        const L = _.getBoundingClientRect(), R = L.width / 2, T = L.height / 2, B = C.shiftKey ? rS : nc, N = C.shiftKey ? aS : lc;
        switch (C.key) {
          case "=":
          case "+":
            C.preventDefault(), o(B, R, T);
            break;
          case "-":
          case "_":
            C.preventDefault(), o(N, R, T);
            break;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "a" || C.key === "A")) {
          if (C.preventDefault(), n) {
            const A = n.get_all_ids();
            ae.getState().selectAll(A);
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "c" || C.key === "C") && !C.shiftKey) {
          if (C.preventDefault(), n) {
            const { selectedIds: A } = ae.getState();
            if (A.size > 0) {
              const H = mr(n, A);
              zn.getState().copy(H);
            }
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "v" || C.key === "V") && !C.shiftKey) {
          if (C.preventDefault(), n && r && _) {
            const { hasContent: A } = zn.getState();
            if (A) {
              const H = new sc();
              de.getState().execute(H, {
                library: n,
                renderer: r
              }), Hr(n, _);
            }
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "b" || C.key === "B") && !C.shiftKey) {
          if (C.preventDefault(), n && r && _) {
            const { selectedIds: A } = ae.getState();
            if (A.size > 0) {
              const H = new cc([
                ...A
              ]);
              de.getState().execute(H, {
                library: n,
                renderer: r
              }), Hr(n, _);
            }
          }
          return;
        }
        if (C.key === "Delete" || C.key === "Backspace") {
          C.preventDefault();
          const { selectedRulerIds: A } = Ae.getState();
          if (A.size > 0 && n && r) {
            const H = new th([
              ...A
            ]);
            de.getState().execute(H, {
              library: n,
              renderer: r
            });
            return;
          }
          if (n && r) {
            const { selectedIds: H } = ae.getState();
            if (H.size > 0) {
              const z = [], P = [];
              for (const ee of H) Sn(ee) ? z.push(ee) : P.push(ee);
              if (z.length > 0) {
                const ee = new L0(z.map(Ur));
                de.getState().execute(ee, {
                  library: n,
                  renderer: r
                });
              }
              if (P.length > 0) {
                const ee = new ic(P);
                de.getState().execute(ee, {
                  library: n,
                  renderer: r
                });
              }
            }
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && C.key === "z" && !C.shiftKey) {
          if (C.preventDefault(), n && r) {
            const { canUndo: A, undo: H } = de.getState();
            A && H({
              library: n,
              renderer: r
            });
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && ((C.key === "z" || C.key === "Z") && C.shiftKey || C.key === "y" || C.key === "Y")) {
          if (C.preventDefault(), n && r) {
            const { canRedo: A, redo: H } = de.getState();
            A && H({
              library: n,
              renderer: r
            });
          }
          return;
        }
        if (C.key === "Tab") {
          if (C.preventDefault(), n && _) {
            const A = n.get_group_representative_ids();
            if (A.length > 0) {
              C.shiftKey ? ae.getState().selectPrevious(A) : ae.getState().selectNext(A);
              const z = ae.getState().lastSelectedId;
              if (z) {
                const P = n.get_group_ids(z);
                P.length > 1 && ae.setState({
                  selectedIds: new Set(P),
                  lastSelectedId: z
                });
              }
              Hr(n, _);
            }
          }
          return;
        }
        if (C.key === "Enter" && (Bt.getState().activeTool === "rectangle" || Bt.getState().activeTool === "polygon" || Bt.getState().activeTool === "text")) {
          if (Date.now() - Bt.getState().toolSetAt > 2e3) return;
          if (C.preventDefault(), n && r && _) {
            const H = Bt.getState().activeTool;
            H === "rectangle" ? S0(n, r, _) : H === "polygon" ? C0(n, r, _) : E0(n, r, _);
          }
          return;
        }
        if (!(C.metaKey || C.ctrlKey)) switch (C.key) {
          case "Escape":
            C.preventDefault(), Ae.getState().activeRulerId ? Ae.getState().cancelCreation() : Ae.getState().selectedRulerIds.size > 0 ? Ae.getState().clearSelection() : ae.getState().selectedIds.size > 0 ? ae.getState().clearSelection() : f("select");
            break;
          case "v":
          case "V":
            C.preventDefault(), f("select");
            break;
          case "p":
          case "P":
            C.preventDefault(), f("pan");
            break;
          case "q":
          case "Q":
            C.preventDefault(), f("laser");
            break;
          case "z":
          case "Z":
            C.preventDefault(), f("zoom");
            break;
          case "r":
          case "R":
            C.preventDefault(), f("rectangle");
            break;
          case "m":
          case "M":
            C.preventDefault(), f("move");
            break;
          case "g":
          case "G":
            C.preventDefault(), f("polygon");
            break;
          case "h":
          case "H":
            C.preventDefault(), f("path");
            break;
          case "t":
            C.preventDefault(), f("text");
            break;
          case "u":
          case "U":
            C.preventDefault(), f("ruler");
            break;
          case "i":
            C.preventDefault(), nn.getState().open("add instance ");
            break;
          case "f":
            if (C.preventDefault(), n && _) {
              const A = n.get_all_bounds(), H = A ? {
                minX: A[0],
                minY: A[1],
                maxX: A[2],
                maxY: A[3]
              } : null, z = ol(_);
              c(H, z.width, z.height, z.screenCenter);
            }
            break;
          case "F":
            if (C.preventDefault(), n && _) {
              const A = ae.getState().selectedIds;
              if (A.size > 0) {
                const H = n.get_bounds_for_ids([
                  ...A
                ]), z = H ? {
                  minX: H[0],
                  minY: H[1],
                  maxX: H[2],
                  maxY: H[3]
                } : null, P = ol(_);
                d(z, P.width, P.height, P.screenCenter);
              }
            }
            break;
          case "e":
          case "E":
            C.preventDefault(), ae.getState().selectedIds.size > 0 && ge.getState().requestInspectorFocus();
            break;
          case "L":
            C.preventDefault(), ge.getState().setSidebarTab("layers");
            break;
          case "I":
            C.preventDefault(), ge.getState().setSidebarTab("inspector");
            break;
        }
      }, k = (C) => {
        p.current = C.shiftKey, m.current.delete(C.key);
      }, S = () => {
        m.current.clear(), p.current = false;
      };
      return window.addEventListener("keydown", E), window.addEventListener("keyup", k), window.addEventListener("blur", S), () => {
        window.removeEventListener("keydown", E), window.removeEventListener("keyup", k), window.removeEventListener("blur", S), v.current !== null && cancelAnimationFrame(v.current);
      };
    }, [
      l,
      o,
      s,
      f,
      n,
      r,
      c,
      d
    ]);
  }
  const H2 = 500, U2 = 1, Y2 = xt((l, n) => ({
    points: [],
    opacity: 1,
    isDrawing: false,
    addPoint: (r) => {
      const { points: o, isDrawing: s } = n();
      if (!s) return;
      if (o.length > 0) {
        const d = o[o.length - 1], f = r.x - d.x, m = r.y - d.y;
        if (Math.sqrt(f * f + m * m) < U2) return;
      }
      const c = [
        ...o,
        r
      ];
      c.length > H2 && c.shift(), l({
        points: c
      });
    },
    startDrawing: () => {
      l({
        isDrawing: true,
        points: [],
        opacity: 1
      });
    },
    stopDrawing: () => {
      l({
        isDrawing: false
      });
    },
    setOpacity: (r) => {
      l({
        opacity: Math.max(0, Math.min(1, r))
      });
    },
    reset: () => {
      l({
        points: [],
        opacity: 1,
        isDrawing: false
      });
    }
  })), B2 = 300, ky = 16;
  function X2(l, n, r, o) {
    const s = 1 - o;
    return {
      x: s * s * l.x + 2 * s * o * n.x + o * o * r.x,
      y: s * s * l.y + 2 * s * o * n.y + o * o * r.y
    };
  }
  function V2(l) {
    if (l.length < 3) return l;
    const n = [
      l[0]
    ];
    for (let r = 1; r < l.length - 1; r++) {
      const o = l[r - 1], s = l[r], c = l[r + 1], d = {
        x: (o.x + s.x) / 2,
        y: (o.y + s.y) / 2
      }, f = {
        x: (s.x + c.x) / 2,
        y: (s.y + c.y) / 2
      };
      r === 1 && n.push(d);
      for (let m = 1; m <= ky; m++) {
        const p = m / ky;
        n.push(X2(d, s, f, p));
      }
    }
    return n.push(l[l.length - 1]), n;
  }
  function $2(l, n) {
    const r = Bt((_) => _.activeTool), { points: o, opacity: s, isDrawing: c, addPoint: d, startDrawing: f, stopDrawing: m, setOpacity: p, reset: v } = Y2(), b = g.useRef(null), w = g.useRef(null);
    g.useEffect(() => {
      if (!(!l || !n)) if (o.length === 0) l.clear_laser();
      else {
        const _ = V2(o), L = window.devicePixelRatio || 1, R = new Float64Array(_.length * 2);
        for (let T = 0; T < _.length; T++) R[T * 2] = _[T].x * L, R[T * 2 + 1] = _[T].y * L;
        l.set_laser_points(R);
      }
    }, [
      l,
      n,
      o
    ]), g.useEffect(() => {
      !l || !n || l.set_laser_opacity(s);
    }, [
      l,
      n,
      s
    ]);
    const E = g.useCallback(() => {
      w.current !== null && cancelAnimationFrame(w.current), b.current = performance.now();
      const _ = (L) => {
        if (b.current === null) return;
        const R = L - b.current, T = Math.min(R / B2, 1);
        if (T >= 1) {
          b.current = null, w.current = null, v();
          return;
        }
        p(1 - T), w.current = requestAnimationFrame(_);
      };
      w.current = requestAnimationFrame(_);
    }, [
      v,
      p
    ]), k = g.useCallback((_) => {
      r !== "laser" || _.button !== 0 || (w.current !== null && (cancelAnimationFrame(w.current), w.current = null, b.current = null), f(), d({
        x: _.clientX,
        y: _.clientY
      }));
    }, [
      r,
      f,
      d
    ]), S = g.useCallback((_) => {
      r !== "laser" || !c || d({
        x: _.clientX,
        y: _.clientY
      });
    }, [
      r,
      c,
      d
    ]), C = g.useCallback(() => {
      r !== "laser" || !c || (m(), E());
    }, [
      r,
      c,
      m,
      E
    ]);
    return g.useEffect(() => () => {
      w.current !== null && cancelAnimationFrame(w.current);
    }, []), g.useEffect(() => {
      r !== "laser" && (w.current !== null && (cancelAnimationFrame(w.current), w.current = null, b.current = null), v());
    }, [
      r,
      v
    ]), {
      handleMouseDown: k,
      handleMouseMove: S,
      handleMouseUp: C,
      isLaserActive: r === "laser"
    };
  }
  const q2 = xt((l, n) => ({
    box: null,
    isDrawing: false,
    startDrawing: (r, o) => l({
      box: {
        x: r,
        y: o,
        width: 0,
        height: 0
      },
      isDrawing: true
    }),
    updateBox: (r, o) => {
      const s = n();
      !s.box || !s.isDrawing || l({
        box: {
          ...s.box,
          width: r - s.box.x,
          height: o - s.box.y
        }
      });
    },
    stopDrawing: () => l({
      isDrawing: false
    }),
    reset: () => l({
      box: null,
      isDrawing: false
    })
  }));
  function G2(l) {
    const n = Bt((E) => E.activeTool), { box: r, isDrawing: o, startDrawing: s, updateBox: c, reset: d } = q2(), { zoom: f, offset: m, zoomToBounds: p } = Oe(), v = g.useCallback((E) => {
      if (n !== "zoom" || E.button !== 0) return;
      const k = l.current;
      if (!k) return;
      const S = k.getBoundingClientRect(), C = E.clientX - S.left, _ = E.clientY - S.top;
      s(C, _);
    }, [
      n,
      l,
      s
    ]), b = g.useCallback((E) => {
      if (n !== "zoom" || !o) return;
      const k = l.current;
      if (!k) return;
      const S = k.getBoundingClientRect(), C = E.clientX - S.left, _ = E.clientY - S.top;
      c(C, _);
    }, [
      n,
      o,
      l,
      c
    ]), w = g.useCallback(() => {
      if (n !== "zoom" || !o || !r) {
        d();
        return;
      }
      const E = l.current;
      if (Math.abs(r.width) > 5 && Math.abs(r.height) > 5 && E) {
        const k = Math.min(r.x, r.x + r.width), S = Math.max(r.x, r.x + r.width), C = Math.min(r.y, r.y + r.height), _ = Math.max(r.y, r.y + r.height), L = (k - m.x) / f, R = (S - m.x) / f, T = (C - m.y) / f, B = (_ - m.y) / f, N = {
          minX: L,
          maxX: R,
          minY: T,
          maxY: B
        }, A = ol(E);
        A.width > 0 && A.height > 0 && p(N, A.width, A.height, A.screenCenter);
      }
      d();
    }, [
      n,
      o,
      r,
      f,
      m,
      p,
      d,
      l
    ]);
    return g.useEffect(() => {
      n !== "zoom" && d();
    }, [
      n,
      d
    ]), {
      handleMouseDown: v,
      handleMouseMove: b,
      handleMouseUp: w,
      box: r,
      isZoomActive: n === "zoom",
      isDrawingZoom: o
    };
  }
  function ja(l) {
    return Math.round(l / ve) * ve;
  }
  const jl = new Float64Array(8), Io = new Float32Array(4);
  function P2(l, n, r) {
    const o = g.useRef(null), s = g.useRef(false), c = g.useRef([
      0.5,
      0.5,
      0.5,
      0.5
    ]), d = g.useCallback((v) => {
      if (v.button !== 0) return;
      const w = v.currentTarget.getBoundingClientRect(), E = v.clientX - w.left, k = v.clientY - w.top, S = l(E, k);
      if (!S) return;
      const C = ja(S.x), _ = ja(S.y);
      o.current = {
        x: C,
        y: _
      }, s.current = true;
      const L = ye.getState().activeLayerId, T = ye.getState().layers.get(L);
      if (T) {
        const [B, N, A] = ac(T.color, 0.5);
        c.current = [
          B,
          N,
          A,
          0.5
        ];
      } else c.current = [
        0.5,
        0.5,
        0.5,
        0.5
      ];
    }, [
      l
    ]), f = g.useCallback((v, b) => {
      const w = o.current;
      if (!s.current || !w || !r) return false;
      const E = l(v, b);
      if (!E) return false;
      const k = ja(E.x), S = ja(E.y), C = Math.min(w.x, k), _ = Math.min(w.y, S), L = Math.max(w.x, k), R = Math.max(w.y, S);
      jl[0] = C, jl[1] = _, jl[2] = L, jl[3] = _, jl[4] = L, jl[5] = R, jl[6] = C, jl[7] = R;
      const T = c.current;
      return Io[0] = T[0], Io[1] = T[1], Io[2] = T[2], Io[3] = T[3], r.set_preview_shape(jl, Io), r.mark_dirty(), true;
    }, [
      l,
      r
    ]), m = g.useCallback((v, b) => {
      const w = o.current;
      if (!w || !n || !r) return;
      const E = ja(v), k = ja(b), S = Math.min(w.x, E), C = Math.min(w.y, k), _ = Math.abs(E - w.x), L = Math.abs(k - w.y);
      if (_ > 0 && L > 0) {
        const R = ye.getState().activeLayerId, B = ye.getState().layers.get(R), N = (B == null ? void 0 : B.layerNumber) ?? 1, A = (B == null ? void 0 : B.datatype) ?? 0, H = new u0(S, C, _, L, N, A);
        de.getState().execute(H, {
          library: n,
          renderer: r
        });
      }
      r.clear_preview(), s.current = false, o.current = null;
    }, [
      n,
      r
    ]), p = g.useCallback(() => {
      s.current = false, o.current = null, r == null ? void 0 : r.clear_preview();
    }, [
      r
    ]);
    return {
      handleMouseDown: d,
      handleMouseMove: f,
      finalizeRectangle: m,
      cancelDrawing: p
    };
  }
  function js(l) {
    return Math.round(l / ve) * ve;
  }
  function My(l, n, r, o) {
    const s = (l.x - n.x) * r, c = (l.y - n.y) * r;
    return Math.sqrt(s * s + c * c) <= o;
  }
  const jy = 10, Ly = 8, Z2 = 6;
  function Ry(l, n, r) {
    const o = Z2 / r;
    let s = null, c = null, d = l.x, f = l.y;
    for (const m of n) if (s === null && Math.abs(l.x - m.x) <= o && (d = m.x, s = m), c === null && Math.abs(l.y - m.y) <= o && (f = m.y, c = m), s !== null && c !== null) break;
    return {
      point: {
        x: d,
        y: f
      },
      guides: {
        alignedVertexX: s,
        alignedVertexY: c
      }
    };
  }
  function Ay(l, n) {
    const r = n.x - l.x, o = n.y - l.y;
    if (r === 0 && o === 0) return n;
    const s = Math.abs(Math.atan2(Math.abs(o), Math.abs(r)) * (180 / Math.PI));
    return s <= Ly ? {
      x: n.x,
      y: l.y
    } : s >= 90 - Ly ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function K2(l, n, r, o) {
    const [s, c] = g.useState([]), [d, f] = g.useState(false), [m, p] = g.useState(null), [v, b] = g.useState(false), [w, E] = g.useState(null), k = ye((B) => B.activeLayerId), S = ye((B) => B.layers), C = Bt((B) => B.activeTool);
    g.useEffect(() => {
      C !== "polygon" && (c([]), f(false), p(null), b(false), E(null));
    }, [
      C
    ]);
    const _ = g.useCallback((B) => {
      if (!n || !r || B.length < 3) return;
      const N = new Float64Array(B.length * 2);
      for (let ee = 0; ee < B.length; ee++) N[ee * 2] = B[ee].x, N[ee * 2 + 1] = B[ee].y;
      const A = S.get(k), H = (A == null ? void 0 : A.layerNumber) ?? 1, z = (A == null ? void 0 : A.datatype) ?? 0, P = new f0(N, H, z);
      de.getState().execute(P, {
        library: n,
        renderer: r
      }), c([]), f(false), p(null), b(false);
    }, [
      n,
      r,
      k,
      S
    ]), L = g.useCallback((B) => {
      if (B.button !== 0) return;
      const A = B.currentTarget.getBoundingClientRect(), H = B.clientX - A.left, z = B.clientY - A.top, P = l(H, z);
      if (!P) return;
      let ee = {
        x: js(P.x),
        y: js(P.y)
      };
      if (s.length > 0 && !B.shiftKey && (ee = Ry(ee, s, o).point, ee = Ay(s[s.length - 1], ee)), s.length >= 3) {
        const fe = s[0];
        if (My(fe, ee, o, jy)) {
          _(s);
          return;
        }
      }
      const J = s[s.length - 1];
      if (J && ee.x === J.x && ee.y === J.y) return;
      const ce = [
        ...s,
        ee
      ];
      c(ce), f(true);
    }, [
      l,
      s,
      o,
      _
    ]), R = g.useCallback((B) => {
      const A = B.currentTarget.getBoundingClientRect(), H = B.clientX - A.left, z = B.clientY - A.top, P = l(H, z);
      if (!P) return;
      let ee = {
        x: js(P.x),
        y: js(P.y)
      }, J = null;
      if (s.length > 0 && !B.shiftKey) {
        const fe = Ry(ee, s, o);
        ee = fe.point, J = fe.guides, ee = Ay(s[s.length - 1], ee);
      }
      const ce = s.length >= 3 && My(s[0], ee, o, jy);
      ce && (ee = {
        ...s[0]
      }, J = null), b(ce), p(ee), E(J);
    }, [
      l,
      s,
      o
    ]), T = g.useCallback(() => {
      c([]), f(false), p(null), b(false), E(null);
    }, []);
    return {
      handleMouseDown: L,
      handleMouseMove: R,
      cancelDrawing: T,
      isDrawing: d,
      points: s,
      cursorPoint: m,
      isNearStart: v,
      alignmentGuides: w
    };
  }
  function Ls(l) {
    return Math.round(l / ve) * ve;
  }
  const Q2 = 6;
  function Ty(l, n, r) {
    const o = Q2 / r;
    let s = null, c = null, d = l.x, f = l.y;
    for (const m of n) if (s === null && Math.abs(l.x - m.x) <= o && (d = m.x, s = m), c === null && Math.abs(l.y - m.y) <= o && (f = m.y, c = m), s !== null && c !== null) break;
    return {
      point: {
        x: d,
        y: f
      },
      guides: {
        alignedVertexX: s,
        alignedVertexY: c
      }
    };
  }
  function F2(l, n, r, o) {
    const [s, c] = g.useState([]), [d, f] = g.useState(false), [m, p] = g.useState(null), [v, b] = g.useState(null), w = ye((T) => T.activeLayerId), E = ye((T) => T.layers), k = Bt((T) => T.activeTool);
    g.useEffect(() => {
      k !== "path" && (c([]), f(false), p(null), b(null));
    }, [
      k
    ]);
    const S = g.useCallback((T) => {
      if (!n || !r || T.length < 2) return;
      const { width: B, cornerRadius: N, numArcPoints: A } = tn.getState(), H = new Float64Array(T.length * 2);
      for (let ce = 0; ce < T.length; ce++) H[ce * 2] = T[ce].x, H[ce * 2 + 1] = T[ce].y;
      const z = E.get(w), P = (z == null ? void 0 : z.layerNumber) ?? 1, ee = (z == null ? void 0 : z.datatype) ?? 0, J = new BS(H, B, P, ee, [
        ...T
      ], N, A);
      de.getState().execute(J, {
        library: n,
        renderer: r
      }), c([]), f(false), p(null), b(null);
    }, [
      n,
      r,
      w,
      E
    ]), C = g.useCallback((T) => {
      if (T.button !== 0) return;
      const N = T.currentTarget.getBoundingClientRect(), A = T.clientX - N.left, H = T.clientY - N.top, z = l(A, H);
      if (!z) return;
      let P = {
        x: Ls(z.x),
        y: Ls(z.y)
      };
      if (s.length > 0 && !T.shiftKey && (P = Ty(P, s, o).point, P = xy(s[s.length - 1], P)), T.detail >= 2 && s.length >= 2) {
        S(s);
        return;
      }
      const ee = s[s.length - 1];
      if (ee && P.x === ee.x && P.y === ee.y) return;
      const J = [
        ...s,
        P
      ];
      c(J), f(true);
    }, [
      l,
      s,
      o,
      S
    ]), _ = g.useCallback((T) => {
      const N = T.currentTarget.getBoundingClientRect(), A = T.clientX - N.left, H = T.clientY - N.top, z = l(A, H);
      if (!z) return;
      let P = {
        x: Ls(z.x),
        y: Ls(z.y)
      }, ee = null;
      if (s.length > 0 && !T.shiftKey) {
        const J = Ty(P, s, o);
        P = J.point, ee = J.guides, P = xy(s[s.length - 1], P);
      }
      p(P), b(ee);
    }, [
      l,
      s,
      o
    ]), L = g.useCallback((T) => {
      T.key === "Enter" && s.length >= 2 && (T.preventDefault(), S(s));
    }, [
      s,
      S
    ]);
    g.useEffect(() => {
      if (d) return window.addEventListener("keydown", L), () => window.removeEventListener("keydown", L);
    }, [
      d,
      L
    ]);
    const R = g.useCallback(() => {
      c([]), f(false), p(null), b(null);
    }, []);
    return {
      handleMouseDown: C,
      handleMouseMove: _,
      cancelDrawing: R,
      isDrawing: d,
      waypoints: s,
      cursorPoint: m,
      alignmentGuides: v
    };
  }
  const Ny = xt((l, n) => ({
    box: null,
    isDrawing: false,
    previewIds: /* @__PURE__ */ new Set(),
    startDrawing: (r, o) => l({
      box: {
        x: r,
        y: o,
        width: 0,
        height: 0
      },
      isDrawing: true,
      previewIds: /* @__PURE__ */ new Set()
    }),
    updateBox: (r, o) => {
      const s = n();
      !s.box || !s.isDrawing || l({
        box: {
          ...s.box,
          width: r - s.box.x,
          height: o - s.box.y
        }
      });
    },
    setPreviewIds: (r) => l({
      previewIds: new Set(r)
    }),
    reset: () => l({
      box: null,
      isDrawing: false,
      previewIds: /* @__PURE__ */ new Set()
    })
  })), Oy = 15;
  function Uf(l) {
    if (!l) return null;
    try {
      const n = l.get_all_vertices();
      return n.length > 0 ? n : null;
    } catch {
      return null;
    }
  }
  function W2(l, n, r, o, s, c) {
    const d = s - r, f = c - o, m = d * d + f * f;
    if (m === 0) {
      const E = (l - r) * (l - r) + (n - o) * (n - o);
      return {
        point: {
          x: r,
          y: o
        },
        distSq: E
      };
    }
    const p = Math.max(0, Math.min(1, ((l - r) * d + (n - o) * f) / m)), v = r + p * d, b = o + p * f, w = (l - v) * (l - v) + (n - b) * (n - b);
    return {
      point: {
        x: v,
        y: b
      },
      distSq: w
    };
  }
  function J2(l, n, r, o, s) {
    let c = null, d = Oy * Oy;
    const f = (l - s.x) / o, m = (n - s.y) / o;
    for (const p of r) {
      const v = p.length / 2;
      if (!(v < 2)) for (let b = 0; b < v; b++) {
        const w = (b + 1) % v, E = p[b * 2], k = p[b * 2 + 1], S = p[w * 2], C = p[w * 2 + 1], { point: _, distSq: L } = W2(f, m, E, k, S, C), R = L * o * o;
        R < d && (d = R, c = _);
      }
    }
    return c;
  }
  function Dy(l) {
    return Math.round(l / ve) * ve;
  }
  function e5(l) {
    const n = [];
    let r = 0;
    for (; r < l.length; ) {
      const o = l[r];
      if (r++, o < 2 || r + o * 2 > l.length) break;
      const s = [];
      for (let c = 0; c < o; c++) s.push(l[r], l[r + 1]), r += 2;
      n.push(s);
    }
    return n;
  }
  function Yf(l, n, r, o, s, c, d, f = false) {
    if (!f && s && s.length >= 5) {
      const m = e5(s);
      if (m.length > 0) {
        const p = J2(l, n, m, c, d);
        if (p) return {
          point: p,
          isGeometrySnap: true
        };
      }
    }
    return {
      point: {
        x: Dy(r),
        y: Dy(o)
      },
      isGeometrySnap: false
    };
  }
  const Iy = 5;
  function zy(l, n) {
    return l.get_group_ids(n);
  }
  function Hy(l, n) {
    const r = /* @__PURE__ */ new Set(), o = [];
    for (const s of n) {
      const c = l.get_group_ids(s);
      for (const d of c) r.has(d) || (r.add(d), o.push(d));
    }
    return o;
  }
  const t5 = 8, Rs = 12, Bf = 140, Xf = 56;
  function n5(l, n, r, o, s, c) {
    const d = l - r, f = n - o, m = s - r, p = c - o, v = d * m + f * p, b = m * m + p * p;
    if (b === 0) return Math.sqrt(d * d + f * f);
    const w = Math.max(0, Math.min(1, v / b)), E = r + w * m, k = o + w * p, S = l - E, C = n - k;
    return Math.sqrt(S * S + C * C);
  }
  function Uy(l, n, r, o, s) {
    for (const c of r.values()) {
      const d = c.start.x * o + s.x, f = c.start.y * o + s.y, m = c.end.x * o + s.x, p = c.end.y * o + s.y, v = l - d, b = n - f;
      if (v * v + b * b <= Rs * Rs) return {
        rulerId: c.id,
        endpoint: "start"
      };
      const w = l - m, E = n - p;
      if (w * w + E * E <= Rs * Rs) return {
        rulerId: c.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function Yy(l, n, r, o, s) {
    for (const c of r.values()) {
      const d = c.start.x * o + s.x, f = c.start.y * o + s.y, m = c.end.x * o + s.x, p = c.end.y * o + s.y, v = (d + m) / 2, b = (f + p) / 2, w = Bf / 2, E = Xf / 2;
      if (l >= v - w && l <= v + w && n >= b - E && n <= b + E || n5(l, n, d, f, m, p) <= t5) return c.id;
    }
    return null;
  }
  function l5(l, n, r, o, s, c, d, f) {
    if (l >= s && l <= d && n >= c && n <= f || r >= s && r <= d && o >= c && o <= f) return true;
    const m = [
      [
        s,
        c,
        d,
        c
      ],
      [
        d,
        c,
        d,
        f
      ],
      [
        s,
        f,
        d,
        f
      ],
      [
        s,
        c,
        s,
        f
      ]
    ];
    for (const [p, v, b, w] of m) if (r5(l, n, r, o, p, v, b, w)) return true;
    return false;
  }
  function r5(l, n, r, o, s, c, d, f) {
    const m = As(s, c, d, f, l, n), p = As(s, c, d, f, r, o), v = As(l, n, r, o, s, c), b = As(l, n, r, o, d, f);
    return !!((m > 0 && p < 0 || m < 0 && p > 0) && (v > 0 && b < 0 || v < 0 && b > 0) || m === 0 && Ts(s, c, d, f, l, n) || p === 0 && Ts(s, c, d, f, r, o) || v === 0 && Ts(l, n, r, o, s, c) || b === 0 && Ts(l, n, r, o, d, f));
  }
  function As(l, n, r, o, s, c) {
    return (s - l) * (o - n) - (r - l) * (c - n);
  }
  function Ts(l, n, r, o, s, c) {
    return Math.min(l, r) <= s && s <= Math.max(l, r) && Math.min(n, o) <= c && c <= Math.max(n, o);
  }
  function By(l, n, r, o, s, c, d) {
    const f = [];
    for (const m of s.values()) {
      const p = m.start.x * c + d.x, v = m.start.y * c + d.y, b = m.end.x * c + d.x, w = m.end.y * c + d.y;
      if (l5(p, v, b, w, l, n, r, o)) {
        f.push(m.id);
        continue;
      }
      const E = (p + b) / 2, k = (v + w) / 2, S = E - Bf / 2, C = E + Bf / 2, _ = k - Xf / 2, L = k + Xf / 2;
      S <= r && C >= l && _ <= o && L >= n && f.push(m.id);
    }
    return f;
  }
  function a5(l, n, r) {
    const { selectedIds: o, hoveredId: s, clearSelection: c, setHover: d } = ae(), { box: f, isDrawing: m, previewIds: p, startDrawing: v, updateBox: b, setPreviewIds: w, reset: E } = Ny(), { zoom: k, offset: S } = Oe(), C = Ae((j) => j.rulers), _ = Ae((j) => j.selectedRulerIds), L = Ae((j) => j.selectRuler), R = Ae((j) => j.toggleSelection), T = Ae((j) => j.addToSelection), B = Ae((j) => j.clearSelection), N = Ae((j) => j.setHoveredRuler), A = Ae((j) => j.setHoveredEndpoint), H = Ae((j) => j.setDraggingEndpoint), z = Ae((j) => j.endDraggingEndpoint), P = Ae((j) => j.updateEndpoint), ee = Ae((j) => j.hoveredRulerId), J = Ae((j) => j.hoveredEndpoint), ce = Ae((j) => j.draggingEndpoint), fe = Ae((j) => j.setMarqueePreviewIds), Se = Ae((j) => j.setSnapPoint), $ = g.useRef("");
    g.useEffect(() => {
      if (!r) return;
      const j = Array.from(o).filter((D) => !Sn(D));
      r.set_selection(j);
    }, [
      r,
      o
    ]), g.useEffect(() => {
      if (r) if (m) {
        const j = Array.from(p).filter((D) => !Sn(D));
        r.set_hover_multiple(j);
      } else if (s && !Sn(s) && n) {
        const j = zy(n, s);
        r.set_hover_multiple(j);
      } else r.set_hover(void 0);
    }, [
      r,
      n,
      s,
      m,
      p
    ]);
    const F = g.useCallback((j) => {
      if (j.button !== 0) return;
      const O = j.currentTarget.getBoundingClientRect(), Z = j.clientX - O.left, Q = j.clientY - O.top, oe = Uy(Z, Q, C, k, S);
      if (oe) {
        L(oe.rulerId), H(oe), c();
        return;
      }
      const ue = Yy(Z, Q, C, k, S);
      if (ue) {
        j.shiftKey ? T([
          ue
        ]) : j.metaKey || j.ctrlKey ? R(ue) : L(ue), c();
        return;
      }
      _.size > 0 && B();
      const _e = l(Z, Q);
      if (!_e || !n) return;
      let X = n.hit_test(_e.x, _e.y);
      if (X || (X = Go(_e.x, _e.y) ?? void 0), X) {
        const se = Sn(X) ? [
          X
        ] : zy(n, X);
        if (j.shiftKey) {
          const he = ae.getState().selectedIds, be = /* @__PURE__ */ new Set([
            ...he,
            ...se
          ]);
          ae.setState({
            selectedIds: be,
            lastSelectedId: X
          });
        } else if (j.metaKey || j.ctrlKey) {
          const he = ae.getState().selectedIds, be = se.every((Me) => he.has(Me)), je = new Set(he);
          if (be) for (const Me of se) je.delete(Me);
          else for (const Me of se) je.add(Me);
          ae.setState({
            selectedIds: je,
            lastSelectedId: X
          });
        } else ae.setState({
          selectedIds: new Set(se),
          lastSelectedId: X
        });
      } else v(Z, Q), !j.shiftKey && !j.metaKey && !j.ctrlKey && c();
    }, [
      l,
      n,
      C,
      k,
      S,
      _,
      c,
      L,
      R,
      T,
      B,
      H,
      v
    ]), ie = g.useCallback((j) => {
      const O = j.currentTarget.getBoundingClientRect(), Z = j.clientX - O.left, Q = j.clientY - O.top;
      if (ce) {
        const X = l(Z, Q);
        if (X) {
          const se = Uf(n), he = Yf(Z, Q, X.x, X.y, se, k, S, j.shiftKey);
          P(ce.rulerId, ce.endpoint, he.point), Se(he.isGeometrySnap ? he.point : null);
        }
        return;
      }
      if (m) {
        b(Z, Q);
        const X = Ny.getState().box;
        if (X) {
          const se = Math.min(X.x, X.x + X.width), he = Math.max(X.x, X.x + X.width), be = Math.min(X.y, X.y + X.height), je = Math.max(X.y, X.y + X.height), Me = By(se, be, he, je, C, k, S);
          fe(Me);
          {
            const Pe = (se - S.x) / k, ht = (he - S.x) / k, ke = (be - S.y) / k, Xe = (je - S.y) / k, Ue = Math.min(Pe, ht), wt = Math.max(Pe, ht), mt = Math.min(ke, Xe), ln = Math.max(ke, Xe), hn = n ? n.hit_test_rect(Ue, mt, wt, ln) : [], jt = n ? Hy(n, hn) : hn, il = yy(Ue, mt, wt, ln), Rl = [
              ...jt,
              ...il
            ], Al = Rl.sort().join(",");
            Al !== $.current && ($.current = Al, w(Rl));
          }
        }
        return;
      }
      const oe = Uy(Z, Q, C, k, S);
      let ue = null;
      oe ? (((J == null ? void 0 : J.rulerId) !== oe.rulerId || (J == null ? void 0 : J.endpoint) !== oe.endpoint) && A(oe), ee !== oe.rulerId && N(oe.rulerId), ue = oe.rulerId) : (J && A(null), ue = Yy(Z, Q, C, k, S), ue !== ee && N(ue));
      const _e = l(Z, Q);
      if (!_e || !n) {
        s !== null && d(null);
        return;
      }
      if (ue) s !== null && d(null);
      else {
        let X = n.hit_test(_e.x, _e.y);
        X || (X = Go(_e.x, _e.y) ?? void 0), (X ?? null) !== s && d(X ?? null);
      }
    }, [
      l,
      n,
      C,
      s,
      ee,
      J,
      ce,
      d,
      N,
      A,
      P,
      fe,
      m,
      b,
      k,
      S,
      w,
      Se
    ]), Ee = g.useCallback(() => {
      if (ce) {
        const O = z();
        if (Se(null), O && n && r) {
          const Z = new g0(O.rulerId, O.endpoint, O.oldPosition, O.newPosition);
          de.getState().pushCommand(Z);
        }
        return;
      }
      if (!m || !f) {
        E(), fe([]);
        return;
      }
      const j = Math.abs(f.width), D = Math.abs(f.height);
      if (j > Iy || D > Iy) {
        const O = Math.min(f.x, f.x + f.width), Z = Math.max(f.x, f.x + f.width), Q = Math.min(f.y, f.y + f.height), oe = Math.max(f.y, f.y + f.height), ue = By(O, Q, Z, oe, C, k, S), _e = (O - S.x) / k, X = (Z - S.x) / k, se = (Q - S.y) / k, he = (oe - S.y) / k, be = Math.min(_e, X), je = Math.max(_e, X), Me = Math.min(se, he), Pe = Math.max(se, he), ht = n ? n.hit_test_rect(be, Me, je, Pe) : [], ke = n ? Hy(n, ht) : ht, Xe = yy(be, Me, je, Pe);
        ue.length > 0 && T(ue);
        const Ue = [
          ...ke,
          ...Xe
        ];
        if (Ue.length > 0) {
          const wt = ae.getState().selectedIds, mt = /* @__PURE__ */ new Set([
            ...wt,
            ...Ue
          ]);
          ae.getState().setSelection(mt);
        }
      }
      E(), fe([]);
    }, [
      m,
      f,
      n,
      r,
      C,
      k,
      S,
      ce,
      T,
      z,
      E,
      fe,
      Se
    ]), pe = g.useCallback(() => {
      s !== null && d(null), ee !== null && N(null), J !== null && A(null), ce !== null && H(null), E(), fe([]);
    }, [
      s,
      ee,
      J,
      ce,
      d,
      N,
      A,
      H,
      E,
      fe
    ]);
    return {
      handleMouseDown: F,
      handleMouseMove: ie,
      handleMouseUp: Ee,
      handleMouseLeave: pe,
      selectedIds: o,
      hoveredId: s,
      hoveredRulerId: ee,
      hoveredEndpoint: J,
      marqueeBox: f,
      isDrawingMarquee: m,
      previewIds: p
    };
  }
  const o5 = 8, i5 = 140, s5 = 56;
  function c5(l, n, r, o, s, c) {
    const d = l - r, f = n - o, m = s - r, p = c - o, v = d * m + f * p, b = m * m + p * p;
    if (b === 0) return Math.sqrt(d * d + f * f);
    const w = Math.max(0, Math.min(1, v / b)), E = r + w * m, k = o + w * p, S = l - E, C = n - k;
    return Math.sqrt(S * S + C * C);
  }
  function Xy(l, n, r, o, s) {
    for (const c of r.values()) {
      const d = c.start.x * o + s.x, f = c.start.y * o + s.y, m = c.end.x * o + s.x, p = c.end.y * o + s.y, v = (d + m) / 2, b = (f + p) / 2, w = i5 / 2, E = s5 / 2;
      if (l >= v - w && l <= v + w && n >= b - E && n <= b + E || c5(l, n, d, f, m, p) <= o5) return c.id;
    }
    return null;
  }
  function u5(l, n, r) {
    const [o, s] = g.useState(false), [c, d] = g.useState(null), [f, m] = g.useState(null), { zoom: p, offset: v } = Oe(), b = Ae((R) => R.rulers), w = Ae((R) => R.selectRuler), E = g.useRef(null), k = g.useCallback((R) => {
      if (R.button !== 0) return;
      const B = R.currentTarget.getBoundingClientRect(), N = R.clientX - B.left, A = R.clientY - B.top, H = l(N, A);
      if (!H) return;
      const z = Xy(N, A, b, p, v);
      if (z) {
        w(z), ae.getState().clearSelection(), E.current = {
          elementIds: [],
          rulerId: z,
          startWorld: H,
          currentDelta: {
            x: 0,
            y: 0
          }
        }, s(true);
        return;
      }
      let P;
      if (n && (P = n.hit_test(H.x, H.y) ?? void 0), P || (P = Go(H.x, H.y) ?? void 0), !P) return;
      w(null);
      const { selectedIds: ee } = ae.getState();
      if (Sn(P)) {
        let fe;
        ee.has(P) ? fe = [
          ...ee
        ].filter((Se) => Sn(Se)) : (fe = [
          P
        ], ae.getState().select(P)), E.current = {
          elementIds: fe,
          rulerId: null,
          startWorld: H,
          currentDelta: {
            x: 0,
            y: 0
          }
        }, s(true);
        return;
      }
      if (!n) return;
      const J = n.get_group_ids(P);
      let ce;
      ee.has(P) ? ce = [
        ...ee
      ].filter((fe) => !Sn(fe)) : (ce = J, ae.getState().setSelection(new Set(J))), E.current = {
        elementIds: ce,
        rulerId: null,
        startWorld: H,
        currentDelta: {
          x: 0,
          y: 0
        }
      }, s(true);
    }, [
      l,
      n,
      b,
      p,
      v,
      w
    ]), S = g.useCallback((R) => {
      const B = R.currentTarget.getBoundingClientRect(), N = R.clientX - B.left, A = R.clientY - B.top, H = l(N, A);
      if (!H) return;
      if (!o) {
        const fe = Xy(N, A, b, p, v);
        fe !== f && m(fe);
        {
          let Se = null;
          n && (Se = n.hit_test(H.x, H.y) ?? null), Se || (Se = Go(H.x, H.y)), Se !== c && d(Se);
        }
        return;
      }
      const z = E.current;
      if (!z) return;
      const P = H.x - z.startWorld.x, ee = H.y - z.startWorld.y, J = P - z.currentDelta.x, ce = ee - z.currentDelta.y;
      if (J !== 0 || ce !== 0) {
        if (z.rulerId) {
          const fe = Ae.getState().rulers.get(z.rulerId);
          fe && (Ae.getState().updateEndpoint(z.rulerId, "start", {
            x: fe.start.x + J,
            y: fe.start.y + ce
          }), Ae.getState().updateEndpoint(z.rulerId, "end", {
            x: fe.end.x + J,
            y: fe.end.y + ce
          }));
        } else if (z.elementIds.length > 0 && Sn(z.elementIds[0])) {
          const fe = Ot.getState();
          for (const Se of z.elementIds) {
            const $ = Ur(Se), F = fe.images.get($);
            F && fe.updateImage($, {
              x: F.x + J,
              y: F.y + ce
            });
          }
        } else n && r && (n.translate_elements(z.elementIds, J, ce), r.sync_from_library(n), r.mark_dirty(), we.getState().bumpSyncGeneration());
        z.currentDelta = {
          x: P,
          y: ee
        };
      }
    }, [
      l,
      n,
      r,
      b,
      p,
      v,
      o,
      c,
      f
    ]), C = g.useCallback(() => {
      if (!o) {
        s(false), E.current = null;
        return;
      }
      const R = E.current;
      if (!R) {
        s(false);
        return;
      }
      const { elementIds: T, rulerId: B, currentDelta: N } = R;
      if (B && (N.x !== 0 || N.y !== 0)) {
        const A = new m0([
          B
        ], N.x, N.y);
        de.getState().pushCommand(A), s(false), E.current = null;
        return;
      }
      if (T.length > 0 && Sn(T[0]) && (N.x !== 0 || N.y !== 0)) {
        const A = new e2(T, N.x, N.y);
        de.getState().pushCommand(A);
      } else if (n && r && (N.x !== 0 || N.y !== 0)) {
        n.translate_elements(T, -N.x, -N.y), r.sync_from_library(n);
        const A = new XS(T, N.x, N.y);
        de.getState().execute(A, {
          library: n,
          renderer: r
        });
        const H = /* @__PURE__ */ new Set();
        for (const z of T) {
          const P = dr(z);
          if (!P) {
            console.warn("[move] no source for", z.slice(0, 8), "\u2014 edit skipped");
            continue;
          }
          if (P.type === "ref") {
            const ee = `${P.file}:${P.line}`;
            H.has(ee) || (H.add(ee), wS(z, N.x, N.y));
          } else {
            const ee = n.get_element_info(z);
            ee && (Ho(z, new Float64Array(ee.vertices)), ee.free());
          }
        }
      }
      s(false), E.current = null;
    }, [
      o,
      n,
      r
    ]), _ = g.useCallback(() => {
      if (!o) {
        s(false), E.current = null;
        return;
      }
      const R = E.current;
      if (R && (R.currentDelta.x !== 0 || R.currentDelta.y !== 0)) if (R.rulerId) {
        const T = Ae.getState().rulers.get(R.rulerId);
        T && (Ae.getState().updateEndpoint(R.rulerId, "start", {
          x: T.start.x - R.currentDelta.x,
          y: T.start.y - R.currentDelta.y
        }), Ae.getState().updateEndpoint(R.rulerId, "end", {
          x: T.end.x - R.currentDelta.x,
          y: T.end.y - R.currentDelta.y
        }));
      } else if (R.elementIds.length > 0 && Sn(R.elementIds[0])) {
        const T = Ot.getState();
        for (const B of R.elementIds) {
          const N = Ur(B), A = T.images.get(N);
          A && T.updateImage(N, {
            x: A.x - R.currentDelta.x,
            y: A.y - R.currentDelta.y
          });
        }
      } else n && r && (n.translate_elements(R.elementIds, -R.currentDelta.x, -R.currentDelta.y), r.sync_from_library(n), r.mark_dirty());
      s(false), E.current = null;
    }, [
      o,
      n,
      r
    ]), L = g.useCallback(() => {
      o && _(), d(null), m(null);
    }, [
      o,
      _
    ]);
    return {
      handleMouseDown: k,
      handleMouseMove: S,
      handleMouseUp: C,
      handleMouseLeave: L,
      cancelMove: _,
      isMoving: o,
      hoveredId: c,
      hoveredRulerId: f
    };
  }
  function Vy(l, n) {
    return l.line < n.line ? true : l.line > n.line ? false : l.column < n.column;
  }
  function ah(l) {
    if (!l || !l.isActive || l.anchor.line === l.focus.line && l.anchor.column === l.focus.column) return null;
    const n = Vy(l.anchor, l.focus) ? l.anchor : l.focus, r = Vy(l.anchor, l.focus) ? l.focus : l.anchor;
    return {
      start: n,
      end: r
    };
  }
  function d5(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return "";
    const n = ah(l.selection);
    if (!n) return "";
    const r = l.content.split(`
`);
    let o = "";
    for (let s = n.start.line; s <= n.end.line; s++) {
      const c = r[s], d = s === n.start.line ? n.start.column : 0, f = s === n.end.line ? n.end.column : c.length;
      o += c.substring(d, f), s < n.end.line && (o += `
`);
    }
    return o;
  }
  function f5(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return l;
    const n = ah(l.selection);
    if (!n) return l;
    const o = [
      ...l.content.split(`
`)
    ];
    if (n.start.line === n.end.line) {
      const s = o[n.start.line];
      o[n.start.line] = s.substring(0, n.start.column) + s.substring(n.end.column);
    } else {
      const s = o[n.start.line], c = o[n.end.line];
      o[n.start.line] = s.substring(0, n.start.column) + c.substring(n.end.column), o.splice(n.start.line + 1, n.end.line - n.start.line);
    }
    return {
      ...l,
      content: o.join(`
`),
      cursorPosition: {
        line: n.start.line,
        column: n.start.column
      },
      selection: void 0
    };
  }
  function h5(l, n, r) {
    var _a;
    r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation();
    const o = l.content.split(`
`), { line: s, column: c } = l.cursorPosition, d = (r == null ? void 0 : r.shiftKey) || false;
    let f = s, m = c, p = l;
    switch (d && !((_a = l.selection) == null ? void 0 : _a.isActive) && (p = {
      ...l,
      selection: {
        anchor: {
          line: s,
          column: c
        },
        focus: {
          line: s,
          column: c
        },
        isActive: true
      }
    }), n) {
      case "ArrowLeft":
        c > 0 ? m = c - 1 : s > 0 && (f = s - 1, m = o[f].length);
        break;
      case "ArrowRight":
        c < o[s].length ? m = c + 1 : s < o.length - 1 && (f = s + 1, m = 0);
        break;
      case "ArrowUp":
        s > 0 && (f = s - 1, m = Math.min(c, o[f].length));
        break;
      case "ArrowDown":
        s < o.length - 1 && (f = s + 1, m = Math.min(c, o[f].length));
        break;
      case "Home":
        m = 0;
        break;
      case "End":
        m = o[s].length;
        break;
    }
    if (d) {
      const v = {
        line: f,
        column: m
      }, b = p.selection.anchor.line === v.line && p.selection.anchor.column === v.column;
      return {
        ...p,
        cursorPosition: v,
        selection: {
          ...p.selection,
          focus: v,
          isActive: !b
        }
      };
    }
    return {
      ...p,
      cursorPosition: {
        line: f,
        column: m
      },
      selection: void 0
    };
  }
  function m5(l, n) {
    if (n.key === "a" && (n.ctrlKey || n.metaKey)) {
      n.preventDefault(), n.stopPropagation();
      const r = l.content.split(`
`), o = r.length - 1, s = r[o].length;
      return {
        ...l,
        cursorPosition: {
          line: o,
          column: s
        },
        selection: {
          anchor: {
            line: 0,
            column: 0
          },
          focus: {
            line: o,
            column: s
          },
          isActive: true
        }
      };
    }
    return n.key === "c" && (n.ctrlKey || n.metaKey) ? (n.preventDefault(), n.stopPropagation(), l) : n.key === "v" && (n.ctrlKey || n.metaKey) ? l : null;
  }
  function $y(l, n, r) {
    var _a;
    if (r && (r.ctrlKey || r.metaKey)) {
      const d = m5(l, r);
      if (d) return d;
    }
    let o = null;
    if (((_a = l.selection) == null ? void 0 : _a.isActive) && (n.length === 1 || n === "Backspace" || n === "Delete") && (l = f5(l), n === "Backspace" || n === "Delete")) return l;
    const s = l.content.split(`
`), c = s[l.cursorPosition.line];
    switch (n) {
      case "Enter": {
        if (r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation(), !(r == null ? void 0 : r.shiftKey)) return null;
        const d = c.slice(0, l.cursorPosition.column), f = c.slice(l.cursorPosition.column), m = [
          ...s
        ];
        m[l.cursorPosition.line] = d, m.splice(l.cursorPosition.line + 1, 0, f), o = {
          ...l,
          content: m.join(`
`),
          cursorPosition: {
            line: l.cursorPosition.line + 1,
            column: 0
          },
          selection: void 0
        };
        break;
      }
      case "Backspace": {
        if (r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation(), l.cursorPosition.column > 0) {
          const d = [
            ...s
          ];
          d[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column - 1) + c.slice(l.cursorPosition.column), o = {
            ...l,
            content: d.join(`
`),
            cursorPosition: {
              ...l.cursorPosition,
              column: l.cursorPosition.column - 1
            },
            selection: void 0
          };
        } else if (l.cursorPosition.line > 0) {
          const d = s[l.cursorPosition.line - 1], f = [
            ...s
          ];
          f.splice(l.cursorPosition.line - 1, 2, d + c), o = {
            ...l,
            content: f.join(`
`),
            cursorPosition: {
              line: l.cursorPosition.line - 1,
              column: d.length
            },
            selection: void 0
          };
        }
        break;
      }
      case "Delete": {
        if (r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation(), l.cursorPosition.column < c.length) {
          const d = [
            ...s
          ];
          d[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column) + c.slice(l.cursorPosition.column + 1), o = {
            ...l,
            content: d.join(`
`),
            cursorPosition: l.cursorPosition,
            selection: void 0
          };
        } else if (l.cursorPosition.line < s.length - 1) {
          const d = s[l.cursorPosition.line + 1], f = [
            ...s
          ];
          f.splice(l.cursorPosition.line, 2, c + d), o = {
            ...l,
            content: f.join(`
`),
            cursorPosition: l.cursorPosition,
            selection: void 0
          };
        }
        break;
      }
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown":
      case "Home":
      case "End":
        o = h5(l, n, r);
        break;
      default:
        if (n.length === 1) {
          r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation();
          const d = [
            ...s
          ];
          d[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column) + n + c.slice(l.cursorPosition.column), o = {
            ...l,
            content: d.join(`
`),
            cursorPosition: {
              ...l.cursorPosition,
              column: l.cursorPosition.column + 1
            },
            selection: void 0
          };
        }
        break;
    }
    return o || l;
  }
  function qy(l) {
    return Math.round(l / ve) * ve;
  }
  function g5(l, n, r) {
    const o = Kt((p) => p.isEditingText), s = g.useRef(null), c = g.useCallback(() => {
      const p = Kt.getState().activeText;
      if (!p || !p.content.trim() || !n || !r) {
        Kt.getState().stopEditing();
        return;
      }
      const v = ye.getState().layers.get(ye.getState().activeLayerId), b = (v == null ? void 0 : v.layerNumber) ?? 1, w = (v == null ? void 0 : v.datatype) ?? 0, E = new _0(p.content, p.x, p.y, Vv * ve, b, w);
      de.getState().execute(E, {
        library: n,
        renderer: r
      }), we.getState().bumpSyncGeneration(), Kt.getState().stopEditing();
    }, [
      n,
      r
    ]), d = g.useCallback(() => {
      Kt.getState().stopEditing();
    }, []), f = g.useCallback((p) => {
      if (p.button !== 0) return;
      const b = p.currentTarget.getBoundingClientRect(), w = p.clientX - b.left, E = p.clientY - b.top, k = l(w, E);
      if (!k) return;
      if (o) {
        c();
        return;
      }
      const S = qy(k.x), C = qy(k.y);
      Kt.getState().startEditing(S, C);
    }, [
      l,
      o,
      c
    ]), m = g.useCallback((p) => {
    }, []);
    return g.useEffect(() => {
      if (!o) return;
      const p = (v) => {
        const b = Kt.getState().activeText;
        if (!b) return;
        if (v.key === "Escape") {
          v.preventDefault(), v.stopPropagation(), d(), Bt.getState().setTool("select");
          return;
        }
        if (v.key === "c" && (v.ctrlKey || v.metaKey)) {
          const E = d5(b);
          E && (v.preventDefault(), navigator.clipboard.writeText(E));
          return;
        }
        if (v.key === "v" && (v.ctrlKey || v.metaKey)) {
          v.preventDefault(), v.stopPropagation(), navigator.clipboard.readText().then((E) => {
            if (!E) return;
            const k = Kt.getState().activeText;
            if (!k) return;
            let S = k;
            for (const C of E) {
              const _ = $y(S, C === `
` ? "Enter" : C, {
                shiftKey: C === `
`,
                ctrlKey: false,
                metaKey: false,
                preventDefault: () => {
                },
                stopPropagation: () => {
                },
                key: C === `
` ? "Enter" : C
              });
              _ && (S = _);
            }
            Kt.getState().setActiveText(S);
          });
          return;
        }
        const w = $y(b, v.key, v);
        if (w === null) {
          c();
          return;
        }
        w !== b && (Kt.getState().setActiveText(w), Kt.getState().resetCursor());
      };
      return window.addEventListener("keydown", p, true), () => window.removeEventListener("keydown", p, true);
    }, [
      o,
      c,
      d
    ]), g.useEffect(() => (o && (s.current = setInterval(() => {
      Kt.getState().toggleCursor();
    }, uS)), () => {
      s.current && (clearInterval(s.current), s.current = null);
    }), [
      o
    ]), {
      handleMouseDown: f,
      handleMouseMove: m,
      commitText: c,
      cancelEditing: d,
      isEditing: o
    };
  }
  const Gy = 12, p5 = 8, y5 = 140, b5 = 56;
  function Py(l, n, r, o, s) {
    const c = n.x * r + o.x, d = n.y * r + o.y, f = l.x - c, m = l.y - d;
    return f * f + m * m <= s * s;
  }
  function v5(l, n, r, o, s, c) {
    const d = l - r, f = n - o, m = s - r, p = c - o, v = d * m + f * p, b = m * m + p * p;
    if (b === 0) return Math.sqrt(d * d + f * f);
    const w = Math.max(0, Math.min(1, v / b)), E = r + w * m, k = o + w * p, S = l - E, C = n - k;
    return Math.sqrt(S * S + C * C);
  }
  function x5(l, n, r, o, s, c) {
    const d = r.start.x * o + s.x, f = r.start.y * o + s.y, m = r.end.x * o + s.x, p = r.end.y * o + s.y;
    return v5(l, n, d, f, m, p) <= c;
  }
  function w5(l, n, r, o, s) {
    const c = r.start.x * o + s.x, d = r.start.y * o + s.y, f = r.end.x * o + s.x, m = r.end.y * o + s.y, p = (c + f) / 2, v = (d + m) / 2, b = y5 / 2, w = b5 / 2;
    return l >= p - b && l <= p + b && n >= v - w && n <= v + w;
  }
  function Zy(l, n, r, o, s, c) {
    const d = {
      x: l,
      y: n
    };
    for (const f of r.values()) if (f.id !== c) {
      if (Py(d, f.start, o, s, Gy)) return {
        rulerId: f.id,
        endpoint: "start"
      };
      if (Py(d, f.end, o, s, Gy)) return {
        rulerId: f.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function Ky(l, n, r, o, s, c) {
    for (const d of r.values()) if (d.id !== c && (w5(l, n, d, o, s) || x5(l, n, d, o, s, p5))) return d.id;
    return null;
  }
  function S5(l, n, r, o, s) {
    const c = Bt((F) => F.activeTool), { rulers: d, activeRulerId: f, selectedRulerIds: m, hoveredRulerId: p, draggingEndpoint: v, isMovingRuler: b, startRuler: w, updatePreview: E, finalizeRuler: k, cancelCreation: S, updateEndpoint: C, setHoveredEndpoint: _, setDraggingEndpoint: L, endDraggingEndpoint: R, selectRuler: T, toggleSelection: B, addToSelection: N, clearSelection: A, setHoveredRuler: H, startMoveRuler: z, moveRuler: P, endMoveRuler: ee, setSnapPoint: J } = Ae();
    g.useEffect(() => {
      c !== "ruler" && (f && S(), _(null), H(null));
    }, [
      c,
      f,
      S,
      _,
      H
    ]);
    const ce = g.useCallback((F) => {
      if (F.button !== 0) return;
      const Ee = F.currentTarget.getBoundingClientRect(), pe = F.clientX - Ee.left, j = F.clientY - Ee.top, D = l(pe, j);
      if (!D) return;
      const O = Uf(n), Q = Yf(pe, j, D.x, D.y, O, o, s, F.shiftKey).point, oe = Zy(pe, j, d, o, s, f ?? void 0);
      if (oe) {
        F.shiftKey ? N([
          oe.rulerId
        ]) : F.metaKey || F.ctrlKey ? B(oe.rulerId) : T(oe.rulerId), L(oe);
        return;
      }
      const ue = Ky(pe, j, d, o, s, f ?? void 0);
      if (ue) {
        F.shiftKey ? N([
          ue
        ]) : F.metaKey || F.ctrlKey ? B(ue) : m.has(ue) ? z(Q) : T(ue);
        return;
      }
      if (f) {
        const _e = k(Q);
        if (J(null), _e && n && r) {
          const X = new VS(_e);
          de.getState().pushCommand(X);
        }
      } else m.size > 0 && !F.shiftKey && !F.metaKey && !F.ctrlKey ? A() : m.size === 0 && w(Q);
    }, [
      l,
      n,
      r,
      d,
      o,
      s,
      f,
      m,
      w,
      k,
      L,
      T,
      B,
      N,
      A,
      z,
      J
    ]), fe = g.useCallback((F) => {
      const Ee = F.currentTarget.getBoundingClientRect(), pe = F.clientX - Ee.left, j = F.clientY - Ee.top, D = l(pe, j);
      if (!D) return;
      const O = Uf(n), Z = Yf(pe, j, D.x, D.y, O, o, s, F.shiftKey), Q = Z.point;
      if (b) {
        P(Q), J(Z.isGeometrySnap ? Q : null);
        return;
      }
      if (v) {
        C(v.rulerId, v.endpoint, Q), J(Z.isGeometrySnap ? Q : null);
        return;
      }
      if (f) {
        E(Q), J(Z.isGeometrySnap ? Q : null);
        return;
      }
      const oe = Zy(pe, j, d, o, s);
      _(oe);
      const ue = oe ? oe.rulerId : Ky(pe, j, d, o, s);
      H(ue), !oe && !ue && m.size === 0 ? J(Z.isGeometrySnap ? Q : null) : J(null);
    }, [
      l,
      n,
      d,
      o,
      s,
      f,
      v,
      b,
      m,
      E,
      C,
      P,
      _,
      H,
      J
    ]), Se = g.useCallback(() => {
      if (v) {
        const F = R();
        if (J(null), F && n && r) {
          const ie = new g0(F.rulerId, F.endpoint, F.oldPosition, F.newPosition);
          de.getState().pushCommand(ie);
        }
      }
      if (b) {
        const F = ee();
        if (F && n && r) {
          const ie = new m0(F.rulerIds, F.deltaX, F.deltaY);
          de.getState().pushCommand(ie);
        }
      }
    }, [
      v,
      b,
      R,
      ee,
      n,
      r,
      J
    ]), $ = g.useCallback(() => {
      S(), _(null), H(null), L(null), J(null);
    }, [
      S,
      _,
      H,
      L,
      J
    ]);
    return {
      handleMouseDown: ce,
      handleMouseMove: fe,
      handleMouseUp: Se,
      cancelDrawing: $,
      isCreating: f !== null,
      isDraggingEndpoint: v !== null,
      isMovingRuler: b,
      hoveredRulerId: p,
      selectedRulerIds: m
    };
  }
  const Ns = "#ff0000", Ud = 4;
  function C5() {
    const [l, n] = g.useState({
      x: 0,
      y: 0
    });
    return g.useEffect(() => {
      const r = (o) => {
        n({
          x: o.clientX,
          y: o.clientY
        });
      };
      return window.addEventListener("mousemove", r), () => window.removeEventListener("mousemove", r);
    }, []), y.jsx("div", {
      className: "pointer-events-none fixed z-50",
      style: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: Ns,
        boxShadow: `
          0 0 ${Ud}px ${Ns},
          0 0 ${Ud * 2}px ${Ns},
          0 0 ${Ud * 3}px ${Ns}`,
        opacity: 0.9,
        left: 0,
        top: 0,
        transform: `translate(${l.x - 4}px, ${l.y - 4}px)`,
        willChange: "transform"
      }
    });
  }
  const E5 = "rgba(46, 229, 120, 0.1)", _5 = "rgba(46, 229, 120, 0.6)";
  function k5({ box: l }) {
    const n = l.width >= 0 ? l.x : l.x + l.width, r = l.height >= 0 ? l.y : l.y + l.height, o = Math.abs(l.width), s = Math.abs(l.height);
    return o < 2 && s < 2 ? null : y.jsx("div", {
      className: "pointer-events-none absolute",
      style: {
        left: n,
        top: r,
        width: o,
        height: s,
        backgroundColor: E5,
        border: `1px solid ${_5}`
      }
    });
  }
  const M5 = "rgba(59, 130, 246, 0.1)", j5 = "rgba(59, 130, 246, 0.6)";
  function L5({ box: l }) {
    const n = l.width >= 0 ? l.x : l.x + l.width, r = l.height >= 0 ? l.y : l.y + l.height, o = Math.abs(l.width), s = Math.abs(l.height);
    return o < 2 && s < 2 ? null : y.jsx("div", {
      className: "pointer-events-none absolute",
      style: {
        left: n,
        top: r,
        width: o,
        height: s,
        backgroundColor: M5,
        border: `1px solid ${j5}`
      }
    });
  }
  function R5({ points: l, cursorPoint: n, isNearStart: r, alignmentGuides: o }) {
    var _a;
    const { zoom: s, offset: c } = Oe(), d = ye((R) => R.activeLayerId), p = ((_a = ye((R) => R.layers).get(d)) == null ? void 0 : _a.color) ?? "#888888", v = (R) => ({
      x: R.x * s + c.x,
      y: R.y * s + c.y
    });
    if (l.length === 0) return null;
    const w = (n ? [
      ...l,
      n
    ] : l).map(v), E = w.map((R, T) => `${T === 0 ? "M" : "L"} ${R.x} ${R.y}`).join(" "), k = l.length >= 3 && n ? `M ${w[w.length - 1].x} ${w[w.length - 1].y} L ${w[0].x} ${w[0].y}` : "", S = w[0], C = n ? v(n) : null, _ = (o == null ? void 0 : o.alignedVertexX) ? v(o.alignedVertexX) : null, L = (o == null ? void 0 : o.alignedVertexY) ? v(o.alignedVertexY) : null;
    return y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        C && _ && y.jsx("line", {
          x1: _.x,
          y1: _.y,
          x2: C.x,
          y2: C.y,
          stroke: In.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        C && L && y.jsx("line", {
          x1: L.x,
          y1: L.y,
          x2: C.x,
          y2: C.y,
          stroke: In.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        r && y.jsx("circle", {
          cx: S.x,
          cy: S.y,
          r: 9,
          fill: "none",
          stroke: p,
          strokeWidth: 1.5,
          opacity: 0.5,
          className: "animate-pulse"
        }),
        y.jsx("path", {
          d: E,
          fill: "none",
          stroke: p,
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        k && y.jsx("path", {
          d: k,
          fill: "none",
          stroke: p,
          strokeWidth: r ? 2 : 1,
          strokeDasharray: r ? "none" : "4 4",
          strokeLinecap: "round",
          opacity: r ? 0.8 : 0.5
        }),
        l.map((R, T) => {
          const B = w[T];
          return y.jsx("circle", {
            cx: B.x,
            cy: B.y,
            r: T === 0 ? 4 : 2.5,
            fill: T === 0 ? p : "white",
            stroke: p,
            strokeWidth: 1
          }, T);
        })
      ]
    });
  }
  function A5({ waypoints: l, cursorPoint: n, alignmentGuides: r }) {
    var _a;
    const { zoom: o, offset: s } = Oe(), c = ye((N) => N.activeLayerId), d = ye((N) => N.layers), f = tn((N) => N.width), m = tn((N) => N.cornerRadius), p = tn((N) => N.numArcPoints), b = ((_a = d.get(c)) == null ? void 0 : _a.color) ?? "#888888", w = (N) => ({
      x: N.x * o + s.x,
      y: N.y * o + s.y
    });
    if (l.length === 0) return null;
    const E = n ? [
      ...l,
      n
    ] : l, k = E.map(w), S = k.map((N, A) => `${A === 0 ? "M" : "L"} ${N.x} ${N.y}`).join(" "), _ = YS(E, f, m, p).map(w), L = _.length > 0 ? _.map((N, A) => `${A === 0 ? "M" : "L"} ${N.x} ${N.y}`).join(" ") + " Z" : "", R = n ? w(n) : null, T = (r == null ? void 0 : r.alignedVertexX) ? w(r.alignedVertexX) : null, B = (r == null ? void 0 : r.alignedVertexY) ? w(r.alignedVertexY) : null;
    return y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        R && T && y.jsx("line", {
          x1: T.x,
          y1: T.y,
          x2: R.x,
          y2: R.y,
          stroke: In.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        R && B && y.jsx("line", {
          x1: B.x,
          y1: B.y,
          x2: R.x,
          y2: R.y,
          stroke: In.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        L && y.jsx("path", {
          d: L,
          fill: b,
          fillOpacity: 0.15,
          stroke: "none"
        }),
        L && y.jsx("path", {
          d: L,
          fill: "none",
          stroke: b,
          strokeWidth: 1,
          strokeOpacity: 0.4
        }),
        y.jsx("path", {
          d: S,
          fill: "none",
          stroke: b,
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        l.map((N, A) => {
          const H = k[A];
          return y.jsx("circle", {
            cx: H.x,
            cy: H.y,
            r: A === 0 ? 4 : 2.5,
            fill: A === 0 ? b : "white",
            stroke: b,
            strokeWidth: 1
          }, A);
        })
      ]
    });
  }
  function oh(l) {
    const n = 1 / (l * ve), r = Xv * n;
    return r >= my ? {
      unit: "mm",
      scale: my
    } : r >= gy ? {
      unit: "\xB5m",
      scale: gy
    } : {
      unit: "nm",
      scale: 1
    };
  }
  function T5(l) {
    return Number.isFinite(l) ? l : 0;
  }
  function ft(l, n) {
    const r = T5(l) / n.scale;
    return Math.abs(r) >= 1e6 ? r.toExponential(3) : r.toFixed(3);
  }
  const N5 = {
    dark: {
      line: "#8b959f",
      text: "#8b959f",
      background: "#1a1d21",
      border: "#8b959f",
      endpoint: "#8b959f",
      hover: "#ffffff"
    },
    light: {
      line: "#4b5563",
      text: "#4b5563",
      background: "rgba(255, 255, 255, 0.95)",
      border: "#4b5563",
      endpoint: "#4b5563",
      hover: "#000000"
    }
  }, Qy = 3, Fy = 5, O5 = 6, D5 = {
    dark: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: In.dark
    },
    light: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: In.light
    }
  };
  function I5(l, n) {
    const r = Math.abs(n.x - l.x) / ve, o = Math.abs(n.y - l.y) / ve, s = Math.sqrt(r * r + o * o);
    return {
      dx: r,
      dy: o,
      diagonal: s
    };
  }
  function z5({ point: l, worldToScreen: n, theme: r }) {
    const o = D5[r], s = n(l), c = O5;
    return y.jsxs("g", {
      children: [
        y.jsx("circle", {
          cx: s.x,
          cy: s.y,
          r: c,
          fill: o.fill,
          stroke: o.stroke,
          strokeWidth: 2
        }),
        y.jsx("line", {
          x1: s.x - c - 2,
          y1: s.y,
          x2: s.x + c + 2,
          y2: s.y,
          stroke: o.stroke,
          strokeWidth: 1.5
        }),
        y.jsx("line", {
          x1: s.x,
          y1: s.y - c - 2,
          x2: s.x,
          y2: s.y + c + 2,
          stroke: o.stroke,
          strokeWidth: 1.5
        })
      ]
    });
  }
  function H5({ ruler: l, worldToScreen: n, hoveredEndpoint: r, isSelected: o, isHovered: s, isDragging: c, theme: d, zoom: f }) {
    const m = N5[d], p = In[d], v = n(l.start), b = n(l.end), w = o ? p : s ? m.hover : m.line, E = o ? p : s ? m.hover : m.border, k = o || s || c ? 2 : 1.5, S = {
      x: (v.x + b.x) / 2,
      y: (v.y + b.y) / 2
    }, { dx: C, dy: _, diagonal: L } = I5(l.start, l.end), R = oh(f), T = `${ft(C, R)} ${R.unit}`, B = `${ft(_, R)} ${R.unit}`, N = `${ft(L, R)} ${R.unit}`, A = 140, H = 56;
    return y.jsxs("g", {
      children: [
        y.jsx("line", {
          x1: v.x,
          y1: v.y,
          x2: b.x,
          y2: b.y,
          stroke: w,
          strokeWidth: k,
          strokeDasharray: "6 4",
          strokeLinecap: "round"
        }),
        y.jsx("foreignObject", {
          x: S.x - A / 2,
          y: S.y - H / 2,
          width: A,
          height: H,
          overflow: "visible",
          children: y.jsx("div", {
            style: {
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: y.jsxs("div", {
              style: {
                backgroundColor: m.background,
                border: `1px solid ${E}`,
                borderRadius: "4px",
                padding: "4px 8px",
                fontFamily: "monospace",
                fontSize: "11px",
                color: m.text,
                lineHeight: "14px",
                whiteSpace: "nowrap"
              },
              children: [
                y.jsxs("div", {
                  children: [
                    y.jsx("span", {
                      style: {
                        opacity: 0.7
                      },
                      children: "\u0394x"
                    }),
                    " ",
                    T
                  ]
                }),
                y.jsxs("div", {
                  children: [
                    y.jsx("span", {
                      style: {
                        opacity: 0.7
                      },
                      children: "\u0394y"
                    }),
                    " ",
                    B
                  ]
                }),
                y.jsxs("div", {
                  children: [
                    y.jsx("span", {
                      style: {
                        opacity: 0.7
                      },
                      children: "\u0394d"
                    }),
                    " ",
                    N
                  ]
                })
              ]
            })
          })
        }),
        y.jsx("circle", {
          cx: v.x,
          cy: v.y,
          r: r === "start" ? Fy : Qy,
          fill: o ? p : r === "start" ? m.hover : m.endpoint,
          stroke: o ? p : r === "start" ? m.hover : "none",
          strokeWidth: r === "start" || o ? 2 : 0,
          style: {
            transition: "r 0.1s, fill 0.1s"
          }
        }),
        y.jsx("circle", {
          cx: b.x,
          cy: b.y,
          r: r === "end" ? Fy : Qy,
          fill: o ? p : r === "end" ? m.hover : m.endpoint,
          stroke: o ? p : r === "end" ? m.hover : "none",
          strokeWidth: r === "end" || o ? 2 : 0,
          style: {
            transition: "r 0.1s, fill 0.1s"
          }
        })
      ]
    });
  }
  function U5() {
    const { zoom: l, offset: n } = Oe(), r = ge((w) => w.theme), { rulers: o, activeRulerId: s, selectedRulerIds: c, hoveredRulerId: d, marqueePreviewIds: f, hoveredEndpoint: m, draggingEndpoint: p, snapPoint: v } = Ae(), b = (w) => ({
      x: w.x * l + n.x,
      y: w.y * l + n.y
    });
    return o.size === 0 && !v ? null : y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        Array.from(o.values()).map((w) => {
          const E = w.id === s, k = c.has(w.id), S = w.id === d || f.has(w.id), C = (m == null ? void 0 : m.rulerId) === w.id, _ = (p == null ? void 0 : p.rulerId) === w.id;
          return y.jsx(H5, {
            ruler: w,
            worldToScreen: b,
            hoveredEndpoint: C ? m.endpoint : _ ? p.endpoint : null,
            isSelected: k,
            isHovered: S && !k,
            isDragging: _ || E,
            theme: r,
            zoom: l
          }, w.id);
        }),
        v && y.jsx(z5, {
          point: v,
          worldToScreen: b,
          theme: r
        })
      ]
    });
  }
  const Wy = "ref:";
  function I0(l) {
    if (!l.startsWith(Wy)) return null;
    const n = l.slice(Wy.length), r = n.indexOf(":");
    if (r === -1) return null;
    const o = Number.parseInt(n.slice(0, r), 10);
    return Number.isNaN(o) ? null : o;
  }
  function Y5(l) {
    const n = /* @__PURE__ */ new Set();
    for (const r of l) {
      const o = I0(r);
      o !== null && n.add(o);
    }
    return n;
  }
  const On = 9;
  function B5(l, n, r, o) {
    if (!l) return null;
    const s = `ref:${n}:0`, c = l.get_cell_ref_info(s);
    if (!c) return null;
    const [d, f, m, p, v, b] = c.transform, w = c.cell_name;
    c.free();
    const E = l.get_cell_origin_by_name(w), k = E ? E[0] : 0, S = E ? E[1] : 0, C = d * k + f * S + v, _ = m * k + p * S + b;
    return {
      x: C * r + o.x,
      y: _ * r + o.y
    };
  }
  function X5() {
    const { zoom: l, offset: n } = Oe(), r = we((b) => b.library), s = ge((b) => b.theme) === "dark";
    we((b) => b.syncGeneration), me((b) => b.activeCell);
    const c = ae((b) => b.selectedIds), d = ae((b) => b.hoveredId), f = Y5(c);
    if (d) {
      const b = I0(d);
      b !== null && f.add(b);
    }
    if (f.size === 0) return null;
    let m = [];
    if (r) try {
      const b = r.get_instance_label_data();
      b && Array.isArray(b) && (m = b);
    } catch {
      return null;
    }
    const p = m.filter((b) => f.has(b.elementIndex));
    if (p.length === 0) return null;
    const v = s ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
    return y.jsx(y.Fragment, {
      children: p.map((b) => {
        const w = b.minX * l + n.x, E = b.minY * l + n.y, k = B5(r, b.elementIndex, l, n);
        return y.jsxs("div", {
          children: [
            y.jsx("div", {
              className: Y("pointer-events-none absolute text-[13px] leading-none font-mono select-none", s ? "text-white" : "text-black"),
              style: {
                left: `${w}px`,
                top: `${E}px`,
                transform: "translateY(-100%)",
                paddingBottom: "2px"
              },
              children: b.name
            }),
            k && y.jsxs("svg", {
              className: "pointer-events-none absolute top-0 left-0 select-none",
              style: {
                width: `${On * 2 + 1}px`,
                height: `${On * 2 + 1}px`,
                transform: `translate(${k.x - On}px, ${k.y - On}px)`
              },
              viewBox: `0 0 ${On * 2 + 1} ${On * 2 + 1}`,
              children: [
                y.jsx("line", {
                  x1: "0",
                  y1: On,
                  x2: On * 2,
                  y2: On,
                  stroke: v,
                  strokeWidth: "1"
                }),
                y.jsx("line", {
                  x1: On,
                  y1: "0",
                  x2: On,
                  y2: On * 2,
                  stroke: v,
                  strokeWidth: "1"
                })
              ]
            })
          ]
        }, `inst-${b.elementIndex}`);
      })
    });
  }
  function V5(l, n) {
    const r = n / Jf, o = l.split(`
`), s = Math.max(1, ...o.map((f) => f.length)), c = r * 0.6 * s, d = r * 1.2 * o.length;
    return {
      width: c,
      totalHeight: d
    };
  }
  function $5({ label: l, zoom: n, offset: r, color: o, isSelected: s, isHovered: c }) {
    const d = l.height / Jf * n;
    if (d < 1) return null;
    const { width: f, totalHeight: m } = V5(l.text, l.height), p = l.x * n + r.x, v = (l.y - m) * n + r.y, b = s || c;
    let w;
    if (b) {
      const E = f * n, k = m * n, S = s ? "rgba(68, 255, 68, 0.8)" : o;
      w = {
        position: "absolute",
        left: "-3px",
        top: "-3px",
        width: `${E + 6}px`,
        height: `${k + 6}px`,
        border: `1.5px solid ${S}`,
        borderRadius: "1px",
        pointerEvents: "none"
      };
    }
    return y.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0 select-none whitespace-pre",
      style: {
        transform: `translate(${p}px, ${v}px)`,
        fontSize: `${d}px`,
        lineHeight: 1.2,
        fontFamily: $v,
        color: s ? "rgb(68, 255, 68)" : o
      },
      children: [
        b && y.jsx("div", {
          style: w
        }),
        l.text
      ]
    });
  }
  function q5({ zoom: l, offset: n, color: r }) {
    const o = Kt((_) => _.activeText), s = Kt((_) => _.showCursor);
    if (!o) return null;
    const c = Vv * ve / Jf * l;
    if (c < 1) return null;
    const d = c * 1.2, f = c * 0.6, m = o.content.split(`
`), p = d * Math.max(1, m.length), v = o.x * l + n.x, b = o.y * l + n.y - p, w = ah(o.selection), E = o.cursorPosition.line, S = o.cursorPosition.column * f, C = E * d;
    return y.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0 select-none",
      style: {
        transform: `translate(${v}px, ${b}px)`,
        fontSize: `${c}px`,
        lineHeight: `${d}px`,
        fontFamily: $v,
        color: r
      },
      children: [
        m.map((_, L) => {
          if (!(w && L >= w.start.line && L <= w.end.line)) return y.jsx("div", {
            style: {
              height: `${d}px`,
              whiteSpace: "pre"
            },
            children: _ || "\u200B"
          }, L);
          const T = L === w.start.line ? w.start.column : 0, B = L === w.end.line ? w.end.column : _.length, N = _.substring(0, T), A = _.substring(T, B), H = _.substring(B);
          return y.jsxs("div", {
            style: {
              height: `${d}px`,
              whiteSpace: "pre"
            },
            children: [
              N && y.jsx("span", {
                children: N
              }),
              A && y.jsx("span", {
                style: {
                  backgroundColor: "rgba(65, 105, 225, 0.7)",
                  color: "#ffffff"
                },
                children: A
              }),
              H && y.jsx("span", {
                children: H
              }),
              !_ && "\u200B"
            ]
          }, L);
        }),
        s && y.jsx("div", {
          className: "absolute",
          style: {
            left: `${S}px`,
            top: `${C}px`,
            width: "2px",
            height: `${d}px`,
            backgroundColor: r
          }
        })
      ]
    });
  }
  function G5() {
    var _a;
    const { zoom: l, offset: n } = Oe(), r = we((_) => _.library), s = ge((_) => _.theme) === "dark", c = Kt((_) => _.isEditingText), d = we((_) => _.syncGeneration), f = me((_) => _.activeCell), m = ae((_) => _.selectedIds), p = ae((_) => _.hoveredId), v = ye((_) => _.layers), b = ye((_) => _.activeLayerId), w = g.useMemo(() => {
      if (!r) return [];
      try {
        const _ = r.get_text_labels();
        if (_ && Array.isArray(_)) return _;
      } catch {
      }
      return [];
    }, [
      r,
      d,
      f
    ]), k = ((_a = v.get(b)) == null ? void 0 : _a.color) ?? (s ? "#ffffff" : "#000000"), S = (_, L) => {
      for (const R of v.values()) if (R.layerNumber === _ && R.datatype === L) return R.color;
      return s ? "#ffffff" : "#000000";
    };
    return w.length > 0 || c ? y.jsxs("div", {
      className: Y("pointer-events-none absolute inset-0 overflow-hidden"),
      children: [
        w.map((_) => y.jsx($5, {
          label: _,
          zoom: l,
          offset: n,
          color: S(_.layer, _.datatype),
          isSelected: m.has(_.id),
          isHovered: p === _.id
        }, _.id)),
        c && y.jsx(q5, {
          zoom: l,
          offset: n,
          color: k
        })
      ]
    }) : null;
  }
  function P5() {
    const { zoom: l, offset: n } = Oe(), r = ae((w) => w.selectedIds), o = ae((w) => w.hoveredId), s = tn((w) => w.pathMetadata), c = ge((w) => w.theme), d = c === "dark" ? In.dark : In.light, f = c === "dark" ? Qs.dark : Qs.light, m = (w) => ({
      x: w.x * l + n.x,
      y: w.y * l + n.y
    }), p = [];
    for (const w of r) {
      const E = s.get(w);
      E && E.waypoints.length >= 2 && p.push({
        meta: E,
        color: d
      });
    }
    let v = null;
    if (o && !r.has(o)) {
      const w = s.get(o);
      w && w.waypoints.length >= 2 && (v = {
        meta: w,
        color: f
      });
    }
    const b = v ? [
      ...p,
      v
    ] : p;
    return b.length === 0 ? null : y.jsx("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: b.map(({ meta: w, color: E }, k) => {
        const S = w.waypoints.map(m), C = S.map((_, L) => `${L === 0 ? "M" : "L"} ${_.x} ${_.y}`).join(" ");
        return y.jsxs("g", {
          children: [
            y.jsx("path", {
              d: C,
              fill: "none",
              stroke: E,
              strokeWidth: 1,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeOpacity: 0.8
            }),
            S.map((_, L) => y.jsx("circle", {
              cx: _.x,
              cy: _.y,
              r: 3,
              fill: E,
              fillOpacity: 0.9
            }, L))
          ]
        }, k);
      })
    });
  }
  function Z5({ entry: l, zoom: n, offset: r, isSelected: o, isHovered: s, isDark: c }) {
    const d = l.x * n + r.x, f = l.y * n + r.y, m = l.width * n, p = l.height * n;
    if (m < 1 && p < 1) return null;
    const v = o || s, b = o ? "rgba(68, 255, 68, 0.8)" : c ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
    return y.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0",
      style: {
        transform: `translate(${d}px, ${f}px)`,
        width: `${m}px`,
        height: `${p}px`
      },
      children: [
        y.jsx("img", {
          src: l.url,
          alt: l.filename,
          className: "block h-full w-full",
          style: {
            objectFit: "fill"
          },
          draggable: false
        }),
        v && y.jsx("div", {
          className: "pointer-events-none absolute inset-0",
          style: {
            border: `1.5px solid ${b}`
          }
        })
      ]
    });
  }
  function K5() {
    const { zoom: l, offset: n } = Oe(), r = Ot((f) => f.images), o = ae((f) => f.selectedIds), s = ae((f) => f.hoveredId), d = ge((f) => f.theme) === "dark";
    return r.size === 0 ? null : y.jsx("div", {
      className: Y("pointer-events-none absolute inset-0 overflow-hidden"),
      children: [
        ...r.values()
      ].map((f) => {
        const m = Wo(f.id);
        return y.jsx(Z5, {
          entry: f,
          zoom: l,
          offset: n,
          isSelected: o.has(m),
          isHovered: s === m,
          isDark: d
        }, f.id);
      })
    });
  }
  function uc(l, n) {
    g.useEffect(() => {
      if (n) return zf.getState().claim(l), () => {
        zf.getState().release(l);
      };
    }, [
      l,
      n
    ]);
  }
  function Q5(l) {
    return "separator" in l && l.separator;
  }
  function F5({ library: l, renderer: n, canvasRef: r }) {
    const o = g.useRef(null), { isOpen: s, position: c, variant: d, targetId: f, close: m } = rc(), { selectedIds: p } = ae(), { hasContent: v } = zn(), w = ge((R) => R.theme) === "dark";
    uc("context-menu", s);
    const E = l ? l.get_all_ids().length > 0 : false, k = p.size > 0, C = g.useCallback(() => {
      const R = () => {
        if (!l) return;
        const H = mr(l, p);
        zn.getState().copy(H), m();
      }, T = () => {
        if (!l || !n) return;
        const H = new sc();
        de.getState().execute(H, {
          library: l,
          renderer: n
        });
        const z = r.current;
        z && Hr(l, z), m();
      }, B = () => {
        if (!l || !n || p.size === 0) return;
        const H = new cc([
          ...p
        ]);
        de.getState().execute(H, {
          library: l,
          renderer: n
        });
        const z = r.current;
        z && Hr(l, z), m();
      }, N = () => {
        if (!l || !n || p.size === 0) return;
        const H = new ic([
          ...p
        ]);
        de.getState().execute(H, {
          library: l,
          renderer: n
        }), m();
      }, A = () => {
        if (!l) return;
        const H = l.get_all_ids();
        ae.getState().selectAll(H), m();
      };
      if (d === "element") return [
        {
          id: "edit",
          label: "Edit",
          shortcut: {
            key: "E"
          },
          action: () => {
            ge.getState().requestInspectorFocus(), m();
          },
          disabled: !k
        },
        {
          id: "sep0",
          separator: true
        },
        {
          id: "copy",
          label: "Copy",
          shortcut: {
            modifiers: [
              Ie.mod
            ],
            key: "C"
          },
          action: R,
          disabled: !k
        },
        {
          id: "paste",
          label: "Paste",
          shortcut: {
            modifiers: [
              Ie.mod
            ],
            key: "V"
          },
          action: T,
          disabled: !v
        },
        {
          id: "duplicate",
          label: "Duplicate",
          shortcut: {
            modifiers: [
              Ie.mod
            ],
            key: "B"
          },
          action: B,
          disabled: !k
        },
        {
          id: "sep1",
          separator: true
        },
        {
          id: "delete",
          label: "Delete",
          shortcut: {
            key: Ie.backspace
          },
          action: N,
          disabled: !k
        },
        {
          id: "sep2",
          separator: true
        },
        {
          id: "selectAll",
          label: "Select All",
          shortcut: {
            modifiers: [
              Ie.mod
            ],
            key: "A"
          },
          action: A,
          disabled: !E
        }
      ];
      if (d === "ruler") {
        const H = () => {
          if (!l || !n) return;
          const { selectedRulerIds: z } = Ae.getState();
          if (z.size > 0) {
            const P = new th([
              ...z
            ]);
            de.getState().execute(P, {
              library: l,
              renderer: n
            });
          }
          m();
        };
        return [
          {
            id: "paste",
            label: "Paste",
            shortcut: {
              modifiers: [
                Ie.mod
              ],
              key: "V"
            },
            action: T,
            disabled: !v
          },
          {
            id: "sep1",
            separator: true
          },
          {
            id: "delete",
            label: "Delete",
            shortcut: {
              key: Ie.backspace
            },
            action: H,
            disabled: false
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "selectAll",
            label: "Select All",
            shortcut: {
              modifiers: [
                Ie.mod
              ],
              key: "A"
            },
            action: A,
            disabled: true
          }
        ];
      }
      if (d === "image") {
        const H = () => {
          ge.getState().requestInspectorFocus(), m();
        }, z = () => {
          if (!l || !n) return;
          const P = [
            ...p
          ].filter(Sn).map(Ur);
          if (P.length > 0) {
            const ee = new L0(P);
            de.getState().execute(ee, {
              library: l,
              renderer: n
            });
          }
          m();
        };
        return [
          {
            id: "edit",
            label: "Edit",
            shortcut: {
              key: "E"
            },
            action: H,
            disabled: false
          },
          {
            id: "sep0",
            separator: true
          },
          {
            id: "delete",
            label: "Delete",
            shortcut: {
              key: Ie.backspace
            },
            action: z,
            disabled: false
          }
        ];
      }
      if (d === "layer") {
        const H = f ? Number(f) : null, z = ye.getState(), P = H !== null ? z.getLayer(H) : void 0, ee = z.layers.size <= 1, J = () => {
          if (!l || !n) return;
          const D = new p0();
          de.getState().execute(D, {
            library: l,
            renderer: n
          }), m();
        }, ce = () => {
          H !== null && ye.getState().setEditingLayerId(H), m();
        }, fe = () => {
          H !== null && ye.getState().toggleVisibility(H), m();
        }, Se = () => {
          if (!l || !n || H === null) return;
          const D = new y0(H);
          de.getState().execute(D, {
            library: l,
            renderer: n
          }), m();
        }, $ = Array.from(z.layers.values()), F = $.every((D) => D.visible), ie = $.every((D) => !D.visible), Ee = () => {
          ye.getState().showAllLayers(), m();
        }, pe = () => {
          ye.getState().hideAllLayers(), m();
        };
        return [
          {
            id: "editLayer",
            label: "Edit Layer",
            action: () => {
              H !== null && (ye.getState().setExpandedLayerId(H), ye.getState().setActiveLayer(H), ge.getState().setSidebarTab("layers")), m();
            },
            disabled: !P
          },
          {
            id: "addLayer",
            label: "Add Layer",
            action: J,
            disabled: false
          },
          {
            id: "rename",
            label: "Rename Layer",
            action: ce,
            disabled: !P
          },
          {
            id: "toggleVisibility",
            label: (P == null ? void 0 : P.visible) ? "Hide Layer" : "Show Layer",
            action: fe,
            disabled: !P
          },
          {
            id: "sep1",
            separator: true
          },
          {
            id: "showAll",
            label: "Show All Layers",
            action: Ee,
            disabled: F
          },
          {
            id: "hideAll",
            label: "Hide All Layers",
            action: pe,
            disabled: ie
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "delete",
            label: "Delete Layer",
            action: Se,
            disabled: !P || ee
          }
        ];
      }
      if (d === "cell") {
        const H = f, z = me.getState(), P = z.cells.length <= 1, ee = () => {
          var _a;
          const O = ((_a = l.get_cell_names) == null ? void 0 : _a.call(l)) ?? z.cells;
          let Z = 1, Q = `cell${Z}`;
          for (; O.includes(Q); ) Z++, Q = `cell${Z}`;
          return Q;
        }, J = (O) => {
          const Z = z.cellTree;
          if (!Z) return null;
          const Q = (oe, ue) => {
            for (const _e of oe) {
              if (_e.name === O) return ue;
              const X = Q(_e.children, _e.name);
              if (X != null) return X;
            }
            return null;
          };
          return Q(Z, null);
        }, ce = () => {
          if (!l || !n || !H) return;
          const O = ee(), Q = J(H) ?? H, oe = new PS(O, Q);
          de.getState().execute(oe, {
            library: l,
            renderer: n
          }), m();
        }, fe = () => {
          H && me.getState().setEditingCellName(H), m();
        }, Se = () => {
          if (!l || !n || !H) return;
          const O = new v0(H);
          de.getState().execute(O, {
            library: l,
            renderer: n
          }), m();
        }, $ = H ? z.hiddenCells.has(H) : false, F = () => {
          H && me.getState().toggleCellVisibility(H), m();
        }, ie = z.cells, Ee = ie.every((O) => !z.hiddenCells.has(O)), pe = ie.every((O) => z.hiddenCells.has(O));
        return [
          {
            id: "addCell",
            label: "Add Cell",
            action: ce,
            disabled: !H
          },
          {
            id: "rename",
            label: "Rename Cell",
            action: fe,
            disabled: !H
          },
          {
            id: "toggleVisibility",
            label: $ ? "Show Cell" : "Hide Cell",
            action: F,
            disabled: !H
          },
          {
            id: "sep1",
            separator: true
          },
          {
            id: "showAllCells",
            label: "Show All Cells",
            action: () => {
              me.getState().showAllCells(), m();
            },
            disabled: Ee
          },
          {
            id: "hideAllCells",
            label: "Hide All Cells",
            action: () => {
              me.getState().hideAllCells(), m();
            },
            disabled: pe
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "delete",
            label: "Delete Cell",
            action: Se,
            disabled: !H || P
          }
        ];
      }
      return [
        {
          id: "paste",
          label: "Paste",
          shortcut: {
            modifiers: [
              Ie.mod
            ],
            key: "V"
          },
          action: T,
          disabled: !v
        },
        {
          id: "sep1",
          separator: true
        },
        {
          id: "selectAll",
          label: "Select All",
          shortcut: {
            modifiers: [
              Ie.mod
            ],
            key: "A"
          },
          action: A,
          disabled: !E
        }
      ];
    }, [
      d,
      l,
      n,
      p,
      k,
      v,
      E,
      m,
      r,
      f
    ])();
    g.useEffect(() => {
      if (!s) return;
      const R = (T) => {
        o.current && !o.current.contains(T.target) && m();
      };
      return document.addEventListener("mousedown", R), () => document.removeEventListener("mousedown", R);
    }, [
      s,
      m
    ]), g.useEffect(() => {
      if (!s) return;
      const R = (T) => {
        T.key === "Escape" && (T.preventDefault(), m());
      };
      return document.addEventListener("keydown", R), () => document.removeEventListener("keydown", R);
    }, [
      s,
      m
    ]);
    const [_, L] = g.useState(c);
    return g.useLayoutEffect(() => {
      if (!s || !o.current) {
        L(c);
        return;
      }
      const T = o.current.getBoundingClientRect(), B = 8;
      let { x: N, y: A } = c;
      N + T.width + B > window.innerWidth && (N = window.innerWidth - T.width - B), A + T.height + B > window.innerHeight && (A = window.innerHeight - T.height - B), N < B && (N = B), A < B && (A = B), L({
        x: N,
        y: A
      });
    }, [
      s,
      c
    ]), s ? y.jsx("div", {
      ref: o,
      className: Y("fixed z-50 min-w-[170px] rounded-xl border py-1", w ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      style: {
        left: _.x,
        top: _.y
      },
      children: C.map((R) => {
        var _a;
        if (Q5(R)) return y.jsx("div", {
          className: Y("my-1 h-px", w ? "bg-white/10" : "bg-black/10")
        }, R.id);
        const T = R;
        return y.jsxs("button", {
          className: Y("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs", "transition-colors", T.disabled ? "opacity-40" : w ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          onClick: () => {
            T.disabled || T.action();
          },
          disabled: T.disabled,
          children: [
            y.jsx("span", {
              children: T.label
            }),
            T.shortcut && y.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = T.shortcut.modifiers) == null ? void 0 : _a.map((B) => y.jsx("kbd", {
                  className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", w ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: B
                }, B)),
                y.jsx("kbd", {
                  className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", w ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: T.shortcut.key
                })
              ]
            })
          ]
        }, T.id);
      })
    }) : null;
  }
  const Jy = "rosette-canvas";
  function eb() {
    const l = g.useRef(null), n = g.useRef(null), r = g.useRef({
      x: 0,
      y: 0
    }), o = g.useRef(null), s = g.useRef(null), [c, d] = g.useState(false), [f, m] = g.useState(false), { wasm: p, isReady: v } = Bv(), { renderer: b, isReady: w, render: E, resize: k, screenToWorld: S, error: C } = dS(c ? Jy : null), { library: _ } = zS(p, v);
    g.useEffect(() => (we.getState().setLibrary(_), () => we.getState().setLibrary(null)), [
      _
    ]), g.useEffect(() => (we.getState().setRenderer(b), () => we.getState().setRenderer(null)), [
      b
    ]);
    const { zoomAt: L, pan: R, initOffset: T, zoom: B, offset: N } = Oe(), A = ge((ne) => ne.setCursorWorld), H = ge((ne) => ne.theme), z = Bt((ne) => ne.activeTool), { handleMouseDown: P, handleMouseMove: ee, handleMouseUp: J, isLaserActive: ce } = $2(b, w), { handleMouseDown: fe, handleMouseMove: Se, handleMouseUp: $, box: F, isZoomActive: ie, isDrawingZoom: Ee } = G2(n), { handleMouseDown: pe, handleMouseMove: j, finalizeRectangle: D, cancelDrawing: O } = P2(S, _, b), { handleMouseDown: Z, handleMouseMove: Q, handleMouseUp: oe, handleMouseLeave: ue, hoveredId: _e, hoveredRulerId: X, marqueeBox: se, isDrawingMarquee: he } = a5(S, _, b), { handleMouseDown: be, handleMouseMove: je, handleMouseUp: Me, handleMouseLeave: Pe, hoveredRulerId: ht } = u5(S, _, b), { handleMouseDown: ke, handleMouseMove: Xe, cancelDrawing: Ue, points: wt, cursorPoint: mt, isNearStart: ln, alignmentGuides: hn } = K2(S, _, b, B), { handleMouseDown: jt, handleMouseMove: il, cancelDrawing: Rl, waypoints: Al, cursorPoint: Vr, alignmentGuides: gc } = F2(S, _, b, B), { handleMouseDown: Ya, handleMouseMove: oi, handleMouseUp: ii, cancelDrawing: Tl, isCreating: Ft, isDraggingEndpoint: Pn, isMovingRuler: Wt, hoveredRulerId: pc } = S5(S, _, b, B, N), { handleMouseDown: si, handleMouseMove: ci, cancelEditing: pr, isEditing: $r } = g5(S, _, b);
    g.useEffect(() => {
      const ne = l.current, Te = n.current;
      if (!ne || !Te) return;
      const rt = () => {
        const gt = ne.getBoundingClientRect(), dt = Math.floor(gt.width), Je = Math.floor(gt.height);
        if (dt > 0 && Je > 0) {
          const st = window.devicePixelRatio || 1;
          Te.width = Math.floor(dt * st), Te.height = Math.floor(Je * st), Te.style.width = `${dt}px`, Te.style.height = `${Je}px`, T(dt, Je), c || d(true), k(Math.floor(dt * st), Math.floor(Je * st)), E();
        }
      };
      rt();
      const Ve = new ResizeObserver(rt);
      return Ve.observe(ne), () => Ve.disconnect();
    }, [
      k,
      E,
      c,
      T
    ]), g.useEffect(() => {
      if (!w) return;
      let ne;
      const Te = () => {
        E(), ne = requestAnimationFrame(Te);
      };
      return Te(), () => cancelAnimationFrame(ne);
    }, [
      w,
      E
    ]);
    const qr = ye((ne) => ne.layers);
    g.useEffect(() => {
      !b || !_ || (b.sync_from_library(_), b.mark_dirty());
    }, [
      b,
      _,
      qr
    ]);
    const En = me((ne) => ne.activeCell);
    g.useEffect(() => {
      if (!_ || !b || !En) return;
      if (_.active_cell_name() !== En) {
        _.set_active_cell(En), b.sync_from_library(_), b.mark_dirty();
        const Te = n.current;
        if (Te) {
          const rt = _.get_all_bounds(), Ve = ol(Te);
          if (rt && Ve.width > 0 && Ve.height > 0) {
            const gt = {
              minX: rt[0],
              minY: rt[1],
              maxX: rt[2],
              maxY: rt[3]
            };
            Oe.getState().zoomToFit(gt, Ve.width, Ve.height, Ve.screenCenter);
          }
        }
      }
    }, [
      _,
      b,
      En
    ]);
    const Nl = me((ne) => ne.hierarchyLevelLimit);
    g.useEffect(() => {
      if (!_ || !b) return;
      const ne = Nl === 1 / 0 ? 0 : Nl;
      _.set_hierarchy_depth_limit(ne), b.sync_from_library(_), b.mark_dirty();
    }, [
      _,
      b,
      Nl
    ]);
    const sl = me((ne) => ne.hiddenCells);
    g.useEffect(() => {
      if (!_ || !b) return;
      const ne = new Set(_.get_hidden_cells());
      for (const Te of ne) sl.has(Te) || _.set_cell_visibility(Te, true);
      for (const Te of sl) ne.has(Te) || _.set_cell_visibility(Te, false);
      b.sync_from_library(_), b.mark_dirty();
    }, [
      _,
      b,
      sl
    ]);
    const ui = g.useRef(false), Gr = g.useRef(null);
    g.useEffect(() => {
      const ne = n.current;
      if (!_ || !ne) return;
      const Te = _.get_all_bounds();
      if (!Te) return;
      const rt = {
        minX: Te[0],
        minY: Te[1],
        maxX: Te[2],
        maxY: Te[3]
      }, Ve = ol(ne);
      if (Ve.width <= 0 || Ve.height <= 0) return;
      const gt = Gr.current !== null && Gr.current !== _;
      if (!ui.current || gt) {
        Oe.getState().zoomToFit(rt, Ve.width, Ve.height, Ve.screenCenter);
        const Je = Zo() ? TS() : null;
        if (Je !== null) {
          const st = Ve.screenCenter ?? {
            x: Ve.width / 2,
            y: Ve.height / 2
          };
          Oe.getState().zoomAt(Je, st.x, st.y);
        }
        ui.current = true;
      }
      Gr.current = _;
    }, [
      _
    ]);
    const yr = g.useCallback((ne) => {
      ne.preventDefault();
      const Te = n.current;
      if (!Te) return;
      const rt = Te.getBoundingClientRect(), Ve = ne.clientX - rt.left, gt = ne.clientY - rt.top, dt = ne.ctrlKey || Math.abs(ne.deltaY) < 50;
      let Je;
      dt ? Je = Math.pow(2, -ne.deltaY * 0.01) : Je = ne.deltaY > 0 ? lc : nc, L(Je, Ve, gt);
    }, [
      L
    ]), br = g.useCallback((ne) => {
      if (z === "laser" && ne.button === 0) {
        P(ne);
        return;
      }
      if (z === "zoom" && ne.button === 0) {
        fe(ne);
        return;
      }
      if (z === "rectangle" && ne.button === 0) {
        pe(ne);
        return;
      }
      if (z === "select" && ne.button === 0) {
        Z(ne);
        return;
      }
      if (z === "move" && ne.button === 0) {
        be(ne);
        return;
      }
      if (z === "polygon" && ne.button === 0) {
        ke(ne);
        return;
      }
      if (z === "path" && ne.button === 0) {
        jt(ne);
        return;
      }
      if (z === "ruler" && ne.button === 0) {
        Ya(ne);
        return;
      }
      if (z === "text" && ne.button === 0) {
        si(ne);
        return;
      }
      (ne.button === 1 || ne.button === 0 && z === "pan") && (m(true), r.current = {
        x: ne.clientX,
        y: ne.clientY
      });
    }, [
      z,
      P,
      fe,
      pe,
      Z,
      be,
      ke,
      jt,
      Ya,
      si
    ]), Zn = g.useRef(0);
    g.useEffect(() => () => {
      Zn.current && cancelAnimationFrame(Zn.current);
    }, []), g.useEffect(() => {
      const ne = o.current;
      if (!ne) return;
      const Te = (ne.x - N.x) / B, rt = (ne.y - N.y) / B, Ve = Math.trunc(Te / ve), gt = Math.trunc(rt / ve);
      A({
        x: Ve,
        y: -gt
      });
    }, [
      B,
      N,
      A
    ]);
    const di = g.useCallback((ne) => {
      const Te = n.current;
      if (!Te) return;
      const rt = Te.getBoundingClientRect(), Ve = ne.clientX - rt.left, gt = ne.clientY - rt.top;
      o.current = {
        x: Ve,
        y: gt
      };
      let dt = false;
      z === "laser" && ee(ne), z === "zoom" && Se(ne), z === "rectangle" && j(Ve, gt) && (dt = true), z === "select" && Q(ne), z === "move" && je(ne), z === "polygon" && Xe(ne), z === "path" && il(ne), z === "ruler" && oi(ne), z === "text" && ci(ne);
      const Je = S(Ve, gt);
      if (s.current = Je, Zn.current === 0 && (Zn.current = requestAnimationFrame(() => {
        Zn.current = 0;
        const st = s.current;
        if (st) {
          const Et = Math.trunc(st.x / ve), Ze = Math.trunc(st.y / ve);
          A({
            x: Et,
            y: -Ze
          });
        } else A(null);
      })), f) {
        const st = ne.clientX - r.current.x, Et = ne.clientY - r.current.y;
        r.current = {
          x: ne.clientX,
          y: ne.clientY
        }, R(st, Et);
      }
      dt && E();
    }, [
      R,
      S,
      A,
      f,
      z,
      ee,
      Se,
      j,
      Q,
      je,
      Xe,
      il,
      oi,
      ci,
      E
    ]), fi = g.useCallback(() => {
      z === "laser" && J(), z === "zoom" && $(), z === "rectangle" && s.current && D(s.current.x, s.current.y), z === "select" && oe(), z === "move" && Me(), z === "ruler" && ii(), m(false);
    }, [
      z,
      J,
      $,
      D,
      oe,
      Me,
      ii
    ]), hi = g.useCallback(() => {
      m(false), O(), Ue(), Rl(), Tl(), pr(), ue(), Pe(), Zn.current && (cancelAnimationFrame(Zn.current), Zn.current = 0), o.current = null, A(null);
    }, [
      A,
      O,
      Ue,
      Rl,
      Tl,
      pr,
      ue,
      Pe
    ]), Kn = rc((ne) => ne.open), Ba = g.useCallback((ne) => {
      ne.preventDefault();
      const Te = n.current;
      if (!Te) return;
      const rt = Te.getBoundingClientRect(), Ve = ne.clientX - rt.left, gt = ne.clientY - rt.top, dt = S(Ve, gt);
      if (!dt) return;
      const { rulers: Je, selectRuler: st } = Ae.getState();
      for (const Ze of Je.values()) {
        const Ut = Ze.start.x * B + N.x, Lt = Ze.start.y * B + N.y, tt = Ze.end.x * B + N.x, Fn = Ze.end.y * B + N.y, Wn = (Ut + tt) / 2, mn = (Lt + Fn) / 2, Hn = 70, Pr = 28;
        if (Ve >= Wn - Hn && Ve <= Wn + Hn && gt >= mn - Pr && gt <= mn + Pr) {
          st(Ze.id), Kn("ruler", {
            x: ne.clientX,
            y: ne.clientY
          }, Ze.id);
          return;
        }
        const Ol = Ve - Ut, xr = gt - Lt, Dl = tt - Ut, Jn = Fn - Lt, Il = Ol * Dl + xr * Jn, rn = Dl * Dl + Jn * Jn;
        if (rn > 0) {
          const Xt = Math.max(0, Math.min(1, Il / rn)), mi = Ut + Xt * Dl, yc = Lt + Xt * Jn, Zr = Ve - mi, Xa = gt - yc;
          if (Math.sqrt(Zr * Zr + Xa * Xa) <= 8) {
            st(Ze.id), Kn("ruler", {
              x: ne.clientX,
              y: ne.clientY
            }, Ze.id);
            return;
          }
        }
      }
      if (_) {
        const Ze = _.hit_test(dt.x, dt.y);
        if (Ze) {
          const Ut = _.get_group_ids(Ze), { selectedIds: Lt, setSelection: tt } = ae.getState();
          Ut.every((Wn) => Lt.has(Wn)) || tt(new Set(Ut)), Kn("element", {
            x: ne.clientX,
            y: ne.clientY
          }, Ze);
          return;
        }
      }
      const Et = Go(dt.x, dt.y);
      if (Et) {
        const { selectedIds: Ze } = ae.getState();
        Ze.has(Et) || ae.getState().select(Et), Kn("image", {
          x: ne.clientX,
          y: ne.clientY
        }, Et);
        return;
      }
      Kn("canvas", {
        x: ne.clientX,
        y: ne.clientY
      });
    }, [
      _,
      S,
      Kn,
      B,
      N
    ]), Qn = Vs((ne) => ne.cellName), vr = g.useRef(null);
    if (g.useEffect(() => {
      if (!Qn) return;
      const ne = n.current;
      if (!ne || !b || !_) return;
      const { bounds: Te, origin: rt } = Vs.getState(), Ve = (dt) => {
        if (!Te) return;
        const Je = ne.getBoundingClientRect(), st = dt.clientX - Je.left, Et = dt.clientY - Je.top, Ze = S(st, Et);
        if (!Ze) return;
        const Ut = Ze.x - rt.x, Lt = Ze.y - rt.y, tt = Te[0] + Ut, Fn = Te[1] + Lt, Wn = Te[2] + Ut, mn = Te[3] + Lt, Hn = new Float64Array([
          tt,
          Fn,
          Wn,
          Fn,
          Wn,
          mn,
          tt,
          mn
        ]), Pr = new Float32Array([
          0.5,
          0.5,
          0.5,
          0
        ]);
        b.set_preview_shape(Hn, Pr);
        const { zoom: Ol, offset: xr } = Oe.getState(), Dl = 9 / Ol, Il = ge.getState().theme === "dark" ? new Float32Array([
          1,
          1,
          1,
          0.5
        ]) : new Float32Array([
          0,
          0,
          0,
          0.5
        ]);
        if (b.set_preview_origin(Ze.x, Ze.y, Dl, Il), b.mark_dirty(), vr.current) {
          const rn = tt * Ol + xr.x, Xt = Fn * Ol + xr.y;
          vr.current.style.transform = `translate(${rn}px, ${Xt}px) translateY(-100%)`, vr.current.style.display = "block";
        }
      }, gt = (dt) => {
        const Je = ne.getBoundingClientRect(), st = dt.clientX - Je.left, Et = dt.clientY - Je.top, Ze = S(st, Et);
        b.clear_preview(), b.mark_dirty();
        const Ut = st >= 0 && Et >= 0 && st <= Je.width && Et <= Je.height;
        if (Ze && Ut) {
          const Lt = _.active_cell_name();
          if (Lt && Lt !== Qn && _.can_instance_cell(Lt, Qn)) {
            const tt = new w0(Qn, Ze.x, Ze.y);
            de.getState().execute(tt, {
              library: _,
              renderer: b
            });
          }
        }
        Vs.getState().endDrag();
      };
      return document.addEventListener("mousemove", Ve), document.addEventListener("mouseup", gt), () => {
        document.removeEventListener("mousemove", Ve), document.removeEventListener("mouseup", gt), b.clear_preview(), b.mark_dirty();
      };
    }, [
      Qn,
      _,
      b,
      S
    ]), g.useEffect(() => {
      const ne = n.current;
      if (ne) return ne.addEventListener("wheel", yr, {
        passive: false
      }), () => ne.removeEventListener("wheel", yr);
    }, [
      yr
    ]), z2(n, _, b), C) return y.jsx("div", {
      className: "flex h-full w-full items-center justify-center bg-red-950 text-red-200",
      children: y.jsxs("div", {
        className: "text-center",
        children: [
          y.jsx("p", {
            className: "text-lg font-semibold",
            children: "Failed to initialize renderer"
          }),
          y.jsx("p", {
            className: "mt-2 text-sm opacity-75",
            children: C.message
          }),
          y.jsx("p", {
            className: "mt-4 text-xs opacity-50",
            children: "WebGPU may not be supported in your browser. Try Chrome 113+, Safari 17+, or Edge 113+."
          })
        ]
      })
    });
    const It = (() => {
      if (f || Wt) return "cursor-grabbing";
      if (z === "pan") return "cursor-grab";
      if (z === "move") return "cursor-move";
      if (ce) return "cursor-none";
      if (ie || z === "rectangle" || z === "polygon" || z === "path") return "cursor-crosshair";
      if (z === "text") return $r ? "cursor-text" : "cursor-crosshair";
      if (z === "ruler") return Pn ? "cursor-grabbing" : Ft ? "cursor-crosshair" : pc ? "cursor-pointer" : "cursor-crosshair";
      if (z === "select") {
        if (he) return "cursor-crosshair";
        if (X || _e) return "cursor-pointer";
      }
      return "cursor-default";
    })();
    return y.jsxs("div", {
      ref: l,
      className: "relative h-full w-full select-none overflow-hidden",
      children: [
        y.jsx("canvas", {
          ref: n,
          id: Jy,
          className: It,
          onMouseDown: br,
          onMouseMove: di,
          onMouseUp: fi,
          onMouseLeave: hi,
          onContextMenu: Ba
        }),
        ce && !f && y.jsx(C5, {}),
        Ee && F && y.jsx(k5, {
          box: F
        }),
        he && se && y.jsx(L5, {
          box: se
        }),
        z === "polygon" && wt.length > 0 && y.jsx(R5, {
          points: wt,
          cursorPoint: mt,
          isNearStart: ln,
          alignmentGuides: hn
        }),
        z === "path" && Al.length > 0 && y.jsx(A5, {
          waypoints: Al,
          cursorPoint: Vr,
          alignmentGuides: gc
        }),
        Qn && y.jsx("div", {
          ref: vr,
          className: `pointer-events-none absolute top-0 left-0 text-[13px] leading-none font-mono select-none ${H === "dark" ? "text-white" : "text-black"}`,
          style: {
            display: "none",
            paddingBottom: "2px"
          },
          children: Qn
        }),
        y.jsx(K5, {}),
        y.jsx(P5, {}),
        y.jsx(X5, {}),
        y.jsx(G5, {}),
        y.jsx(U5, {}),
        y.jsx(F5, {
          library: _,
          renderer: b,
          canvasRef: n
        })
      ]
    });
  }
  var tb = 1, W5 = 0.9, J5 = 0.8, eC = 0.17, Yd = 0.1, Bd = 0.999, tC = 0.9999, nC = 0.99, lC = /[\\\/_+.#"@\[\(\{&]/, rC = /[\\\/_+.#"@\[\(\{&]/g, aC = /[\s-]/, z0 = /[\s-]/g;
  function Vf(l, n, r, o, s, c, d) {
    if (c === n.length) return s === l.length ? tb : nC;
    var f = `${s},${c}`;
    if (d[f] !== void 0) return d[f];
    for (var m = o.charAt(c), p = r.indexOf(m, s), v = 0, b, w, E, k; p >= 0; ) b = Vf(l, n, r, o, p + 1, c + 1, d), b > v && (p === s ? b *= tb : lC.test(l.charAt(p - 1)) ? (b *= J5, E = l.slice(s, p - 1).match(rC), E && s > 0 && (b *= Math.pow(Bd, E.length))) : aC.test(l.charAt(p - 1)) ? (b *= W5, k = l.slice(s, p - 1).match(z0), k && s > 0 && (b *= Math.pow(Bd, k.length))) : (b *= eC, s > 0 && (b *= Math.pow(Bd, p - s))), l.charAt(p) !== n.charAt(c) && (b *= tC)), (b < Yd && r.charAt(p - 1) === o.charAt(c + 1) || o.charAt(c + 1) === o.charAt(c) && r.charAt(p - 1) !== o.charAt(c)) && (w = Vf(l, n, r, o, p + 1, c + 2, d), w * Yd > b && (b = w * Yd)), b > v && (v = b), p = r.indexOf(m, p + 1);
    return d[f] = v, v;
  }
  function nb(l) {
    return l.toLowerCase().replace(z0, " ");
  }
  function oC(l, n, r) {
    return l = r && r.length > 0 ? `${l + " " + r.join(" ")}` : l, Vf(l, n, nb(l), nb(n), 0, 0, {});
  }
  function cr(l, n, { checkForDefaultPrevented: r = true } = {}) {
    return function(s) {
      if (l == null ? void 0 : l(s), r === false || !s.defaultPrevented) return n == null ? void 0 : n(s);
    };
  }
  function lb(l, n) {
    if (typeof l == "function") return l(n);
    l != null && (l.current = n);
  }
  function fr(...l) {
    return (n) => {
      let r = false;
      const o = l.map((s) => {
        const c = lb(s, n);
        return !r && typeof c == "function" && (r = true), c;
      });
      if (r) return () => {
        for (let s = 0; s < o.length; s++) {
          const c = o[s];
          typeof c == "function" ? c() : lb(l[s], null);
        }
      };
    };
  }
  function Xr(...l) {
    return g.useCallback(fr(...l), l);
  }
  function iC(l, n) {
    const r = g.createContext(n), o = (c) => {
      const { children: d, ...f } = c, m = g.useMemo(() => f, Object.values(f));
      return y.jsx(r.Provider, {
        value: m,
        children: d
      });
    };
    o.displayName = l + "Provider";
    function s(c) {
      const d = g.useContext(r);
      if (d) return d;
      if (n !== void 0) return n;
      throw new Error(`\`${c}\` must be used within \`${l}\``);
    }
    return [
      o,
      s
    ];
  }
  function sC(l, n = []) {
    let r = [];
    function o(c, d) {
      const f = g.createContext(d), m = r.length;
      r = [
        ...r,
        d
      ];
      const p = (b) => {
        var _a;
        const { scope: w, children: E, ...k } = b, S = ((_a = w == null ? void 0 : w[l]) == null ? void 0 : _a[m]) || f, C = g.useMemo(() => k, Object.values(k));
        return y.jsx(S.Provider, {
          value: C,
          children: E
        });
      };
      p.displayName = c + "Provider";
      function v(b, w) {
        var _a;
        const E = ((_a = w == null ? void 0 : w[l]) == null ? void 0 : _a[m]) || f, k = g.useContext(E);
        if (k) return k;
        if (d !== void 0) return d;
        throw new Error(`\`${b}\` must be used within \`${c}\``);
      }
      return [
        p,
        v
      ];
    }
    const s = () => {
      const c = r.map((d) => g.createContext(d));
      return function(f) {
        const m = (f == null ? void 0 : f[l]) || c;
        return g.useMemo(() => ({
          [`__scope${l}`]: {
            ...f,
            [l]: m
          }
        }), [
          f,
          m
        ]);
      };
    };
    return s.scopeName = l, [
      o,
      cC(s, ...n)
    ];
  }
  function cC(...l) {
    const n = l[0];
    if (l.length === 1) return n;
    const r = () => {
      const o = l.map((s) => ({
        useScope: s(),
        scopeName: s.scopeName
      }));
      return function(c) {
        const d = o.reduce((f, { useScope: m, scopeName: p }) => {
          const b = m(c)[`__scope${p}`];
          return {
            ...f,
            ...b
          };
        }, {});
        return g.useMemo(() => ({
          [`__scope${n.scopeName}`]: d
        }), [
          d
        ]);
      };
    };
    return r.scopeName = n.scopeName, r;
  }
  var Ko = (globalThis == null ? void 0 : globalThis.document) ? g.useLayoutEffect : () => {
  }, uC = Ff[" useId ".trim().toString()] || (() => {
  }), dC = 0;
  function Ll(l) {
    const [n, r] = g.useState(uC());
    return Ko(() => {
      r((o) => o ?? String(dC++));
    }, [
      l
    ]), n ? `radix-${n}` : "";
  }
  var fC = Ff[" useInsertionEffect ".trim().toString()] || Ko;
  function hC({ prop: l, defaultProp: n, onChange: r = () => {
  }, caller: o }) {
    const [s, c, d] = mC({
      defaultProp: n,
      onChange: r
    }), f = l !== void 0, m = f ? l : s;
    {
      const v = g.useRef(l !== void 0);
      g.useEffect(() => {
        const b = v.current;
        b !== f && console.warn(`${o} is changing from ${b ? "controlled" : "uncontrolled"} to ${f ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`), v.current = f;
      }, [
        f,
        o
      ]);
    }
    const p = g.useCallback((v) => {
      var _a;
      if (f) {
        const b = gC(v) ? v(l) : v;
        b !== l && ((_a = d.current) == null ? void 0 : _a.call(d, b));
      } else c(v);
    }, [
      f,
      l,
      c,
      d
    ]);
    return [
      m,
      p
    ];
  }
  function mC({ defaultProp: l, onChange: n }) {
    const [r, o] = g.useState(l), s = g.useRef(r), c = g.useRef(n);
    return fC(() => {
      c.current = n;
    }, [
      n
    ]), g.useEffect(() => {
      var _a;
      s.current !== r && ((_a = c.current) == null ? void 0 : _a.call(c, r), s.current = r);
    }, [
      r,
      s
    ]), [
      r,
      o,
      c
    ];
  }
  function gC(l) {
    return typeof l == "function";
  }
  var ni = Yv();
  const pC = Uv(ni);
  function li(l) {
    const n = yC(l), r = g.forwardRef((o, s) => {
      const { children: c, ...d } = o, f = g.Children.toArray(c), m = f.find(vC);
      if (m) {
        const p = m.props.children, v = f.map((b) => b === m ? g.Children.count(p) > 1 ? g.Children.only(null) : g.isValidElement(p) ? p.props.children : null : b);
        return y.jsx(n, {
          ...d,
          ref: s,
          children: g.isValidElement(p) ? g.cloneElement(p, void 0, v) : null
        });
      }
      return y.jsx(n, {
        ...d,
        ref: s,
        children: c
      });
    });
    return r.displayName = `${l}.Slot`, r;
  }
  function yC(l) {
    const n = g.forwardRef((r, o) => {
      const { children: s, ...c } = r;
      if (g.isValidElement(s)) {
        const d = wC(s), f = xC(c, s.props);
        return s.type !== g.Fragment && (f.ref = o ? fr(o, d) : d), g.cloneElement(s, f);
      }
      return g.Children.count(s) > 1 ? g.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var bC = Symbol("radix.slottable");
  function vC(l) {
    return g.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === bC;
  }
  function xC(l, n) {
    const r = {
      ...n
    };
    for (const o in n) {
      const s = l[o], c = n[o];
      /^on[A-Z]/.test(o) ? s && c ? r[o] = (...f) => {
        const m = c(...f);
        return s(...f), m;
      } : s && (r[o] = s) : o === "style" ? r[o] = {
        ...s,
        ...c
      } : o === "className" && (r[o] = [
        s,
        c
      ].filter(Boolean).join(" "));
    }
    return {
      ...l,
      ...r
    };
  }
  function wC(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, r = n && "isReactWarning" in n && n.isReactWarning;
    return r ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, r = n && "isReactWarning" in n && n.isReactWarning, r ? l.props.ref : l.props.ref || l.ref);
  }
  var SC = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
  ], H0 = SC.reduce((l, n) => {
    const r = li(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: d, ...f } = s, m = d ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {});
  function CC(l, n) {
    l && ni.flushSync(() => l.dispatchEvent(n));
  }
  function Qo(l) {
    const n = g.useRef(l);
    return g.useEffect(() => {
      n.current = l;
    }), g.useMemo(() => (...r) => {
      var _a;
      return (_a = n.current) == null ? void 0 : _a.call(n, ...r);
    }, []);
  }
  function EC(l, n = globalThis == null ? void 0 : globalThis.document) {
    const r = Qo(l);
    g.useEffect(() => {
      const o = (s) => {
        s.key === "Escape" && r(s);
      };
      return n.addEventListener("keydown", o, {
        capture: true
      }), () => n.removeEventListener("keydown", o, {
        capture: true
      });
    }, [
      r,
      n
    ]);
  }
  var _C = "DismissableLayer", $f = "dismissableLayer.update", kC = "dismissableLayer.pointerDownOutside", MC = "dismissableLayer.focusOutside", rb, U0 = g.createContext({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  }), Y0 = g.forwardRef((l, n) => {
    const { disableOutsidePointerEvents: r = false, onEscapeKeyDown: o, onPointerDownOutside: s, onFocusOutside: c, onInteractOutside: d, onDismiss: f, ...m } = l, p = g.useContext(U0), [v, b] = g.useState(null), w = (v == null ? void 0 : v.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, E] = g.useState({}), k = Xr(n, (A) => b(A)), S = Array.from(p.layers), [C] = [
      ...p.layersWithOutsidePointerEventsDisabled
    ].slice(-1), _ = S.indexOf(C), L = v ? S.indexOf(v) : -1, R = p.layersWithOutsidePointerEventsDisabled.size > 0, T = L >= _, B = RC((A) => {
      const H = A.target, z = [
        ...p.branches
      ].some((P) => P.contains(H));
      !T || z || (s == null ? void 0 : s(A), d == null ? void 0 : d(A), A.defaultPrevented || (f == null ? void 0 : f()));
    }, w), N = AC((A) => {
      const H = A.target;
      [
        ...p.branches
      ].some((P) => P.contains(H)) || (c == null ? void 0 : c(A), d == null ? void 0 : d(A), A.defaultPrevented || (f == null ? void 0 : f()));
    }, w);
    return EC((A) => {
      L === p.layers.size - 1 && (o == null ? void 0 : o(A), !A.defaultPrevented && f && (A.preventDefault(), f()));
    }, w), g.useEffect(() => {
      if (v) return r && (p.layersWithOutsidePointerEventsDisabled.size === 0 && (rb = w.body.style.pointerEvents, w.body.style.pointerEvents = "none"), p.layersWithOutsidePointerEventsDisabled.add(v)), p.layers.add(v), ab(), () => {
        r && p.layersWithOutsidePointerEventsDisabled.size === 1 && (w.body.style.pointerEvents = rb);
      };
    }, [
      v,
      w,
      r,
      p
    ]), g.useEffect(() => () => {
      v && (p.layers.delete(v), p.layersWithOutsidePointerEventsDisabled.delete(v), ab());
    }, [
      v,
      p
    ]), g.useEffect(() => {
      const A = () => E({});
      return document.addEventListener($f, A), () => document.removeEventListener($f, A);
    }, []), y.jsx(H0.div, {
      ...m,
      ref: k,
      style: {
        pointerEvents: R ? T ? "auto" : "none" : void 0,
        ...l.style
      },
      onFocusCapture: cr(l.onFocusCapture, N.onFocusCapture),
      onBlurCapture: cr(l.onBlurCapture, N.onBlurCapture),
      onPointerDownCapture: cr(l.onPointerDownCapture, B.onPointerDownCapture)
    });
  });
  Y0.displayName = _C;
  var jC = "DismissableLayerBranch", LC = g.forwardRef((l, n) => {
    const r = g.useContext(U0), o = g.useRef(null), s = Xr(n, o);
    return g.useEffect(() => {
      const c = o.current;
      if (c) return r.branches.add(c), () => {
        r.branches.delete(c);
      };
    }, [
      r.branches
    ]), y.jsx(H0.div, {
      ...l,
      ref: s
    });
  });
  LC.displayName = jC;
  function RC(l, n = globalThis == null ? void 0 : globalThis.document) {
    const r = Qo(l), o = g.useRef(false), s = g.useRef(() => {
    });
    return g.useEffect(() => {
      const c = (f) => {
        if (f.target && !o.current) {
          let m = function() {
            B0(kC, r, p, {
              discrete: true
            });
          };
          const p = {
            originalEvent: f
          };
          f.pointerType === "touch" ? (n.removeEventListener("click", s.current), s.current = m, n.addEventListener("click", s.current, {
            once: true
          })) : m();
        } else n.removeEventListener("click", s.current);
        o.current = false;
      }, d = window.setTimeout(() => {
        n.addEventListener("pointerdown", c);
      }, 0);
      return () => {
        window.clearTimeout(d), n.removeEventListener("pointerdown", c), n.removeEventListener("click", s.current);
      };
    }, [
      n,
      r
    ]), {
      onPointerDownCapture: () => o.current = true
    };
  }
  function AC(l, n = globalThis == null ? void 0 : globalThis.document) {
    const r = Qo(l), o = g.useRef(false);
    return g.useEffect(() => {
      const s = (c) => {
        c.target && !o.current && B0(MC, r, {
          originalEvent: c
        }, {
          discrete: false
        });
      };
      return n.addEventListener("focusin", s), () => n.removeEventListener("focusin", s);
    }, [
      n,
      r
    ]), {
      onFocusCapture: () => o.current = true,
      onBlurCapture: () => o.current = false
    };
  }
  function ab() {
    const l = new CustomEvent($f);
    document.dispatchEvent(l);
  }
  function B0(l, n, r, { discrete: o }) {
    const s = r.originalEvent.target, c = new CustomEvent(l, {
      bubbles: false,
      cancelable: true,
      detail: r
    });
    n && s.addEventListener(l, n, {
      once: true
    }), o ? CC(s, c) : s.dispatchEvent(c);
  }
  var TC = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
  ], NC = TC.reduce((l, n) => {
    const r = li(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: d, ...f } = s, m = d ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), Xd = "focusScope.autoFocusOnMount", Vd = "focusScope.autoFocusOnUnmount", ob = {
    bubbles: false,
    cancelable: true
  }, OC = "FocusScope", X0 = g.forwardRef((l, n) => {
    const { loop: r = false, trapped: o = false, onMountAutoFocus: s, onUnmountAutoFocus: c, ...d } = l, [f, m] = g.useState(null), p = Qo(s), v = Qo(c), b = g.useRef(null), w = Xr(n, (S) => m(S)), E = g.useRef({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    }).current;
    g.useEffect(() => {
      if (o) {
        let S = function(R) {
          if (E.paused || !f) return;
          const T = R.target;
          f.contains(T) ? b.current = T : sr(b.current, {
            select: true
          });
        }, C = function(R) {
          if (E.paused || !f) return;
          const T = R.relatedTarget;
          T !== null && (f.contains(T) || sr(b.current, {
            select: true
          }));
        }, _ = function(R) {
          if (document.activeElement === document.body) for (const B of R) B.removedNodes.length > 0 && sr(f);
        };
        document.addEventListener("focusin", S), document.addEventListener("focusout", C);
        const L = new MutationObserver(_);
        return f && L.observe(f, {
          childList: true,
          subtree: true
        }), () => {
          document.removeEventListener("focusin", S), document.removeEventListener("focusout", C), L.disconnect();
        };
      }
    }, [
      o,
      f,
      E.paused
    ]), g.useEffect(() => {
      if (f) {
        sb.add(E);
        const S = document.activeElement;
        if (!f.contains(S)) {
          const _ = new CustomEvent(Xd, ob);
          f.addEventListener(Xd, p), f.dispatchEvent(_), _.defaultPrevented || (DC(YC(V0(f)), {
            select: true
          }), document.activeElement === S && sr(f));
        }
        return () => {
          f.removeEventListener(Xd, p), setTimeout(() => {
            const _ = new CustomEvent(Vd, ob);
            f.addEventListener(Vd, v), f.dispatchEvent(_), _.defaultPrevented || sr(S ?? document.body, {
              select: true
            }), f.removeEventListener(Vd, v), sb.remove(E);
          }, 0);
        };
      }
    }, [
      f,
      p,
      v,
      E
    ]);
    const k = g.useCallback((S) => {
      if (!r && !o || E.paused) return;
      const C = S.key === "Tab" && !S.altKey && !S.ctrlKey && !S.metaKey, _ = document.activeElement;
      if (C && _) {
        const L = S.currentTarget, [R, T] = IC(L);
        R && T ? !S.shiftKey && _ === T ? (S.preventDefault(), r && sr(R, {
          select: true
        })) : S.shiftKey && _ === R && (S.preventDefault(), r && sr(T, {
          select: true
        })) : _ === L && S.preventDefault();
      }
    }, [
      r,
      o,
      E.paused
    ]);
    return y.jsx(NC.div, {
      tabIndex: -1,
      ...d,
      ref: w,
      onKeyDown: k
    });
  });
  X0.displayName = OC;
  function DC(l, { select: n = false } = {}) {
    const r = document.activeElement;
    for (const o of l) if (sr(o, {
      select: n
    }), document.activeElement !== r) return;
  }
  function IC(l) {
    const n = V0(l), r = ib(n, l), o = ib(n.reverse(), l);
    return [
      r,
      o
    ];
  }
  function V0(l) {
    const n = [], r = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (o) => {
        const s = o.tagName === "INPUT" && o.type === "hidden";
        return o.disabled || o.hidden || s ? NodeFilter.FILTER_SKIP : o.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    for (; r.nextNode(); ) n.push(r.currentNode);
    return n;
  }
  function ib(l, n) {
    for (const r of l) if (!zC(r, {
      upTo: n
    })) return r;
  }
  function zC(l, { upTo: n }) {
    if (getComputedStyle(l).visibility === "hidden") return true;
    for (; l; ) {
      if (n !== void 0 && l === n) return false;
      if (getComputedStyle(l).display === "none") return true;
      l = l.parentElement;
    }
    return false;
  }
  function HC(l) {
    return l instanceof HTMLInputElement && "select" in l;
  }
  function sr(l, { select: n = false } = {}) {
    if (l && l.focus) {
      const r = document.activeElement;
      l.focus({
        preventScroll: true
      }), l !== r && HC(l) && n && l.select();
    }
  }
  var sb = UC();
  function UC() {
    let l = [];
    return {
      add(n) {
        const r = l[0];
        n !== r && (r == null ? void 0 : r.pause()), l = cb(l, n), l.unshift(n);
      },
      remove(n) {
        var _a;
        l = cb(l, n), (_a = l[0]) == null ? void 0 : _a.resume();
      }
    };
  }
  function cb(l, n) {
    const r = [
      ...l
    ], o = r.indexOf(n);
    return o !== -1 && r.splice(o, 1), r;
  }
  function YC(l) {
    return l.filter((n) => n.tagName !== "A");
  }
  var BC = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
  ], XC = BC.reduce((l, n) => {
    const r = li(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: d, ...f } = s, m = d ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), VC = "Portal", $0 = g.forwardRef((l, n) => {
    var _a;
    const { container: r, ...o } = l, [s, c] = g.useState(false);
    Ko(() => c(true), []);
    const d = r || s && ((_a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _a.body);
    return d ? pC.createPortal(y.jsx(XC.div, {
      ...o,
      ref: n
    }), d) : null;
  });
  $0.displayName = VC;
  function $C(l, n) {
    return g.useReducer((r, o) => n[r][o] ?? r, l);
  }
  var dc = (l) => {
    const { present: n, children: r } = l, o = qC(n), s = typeof r == "function" ? r({
      present: o.isPresent
    }) : g.Children.only(r), c = Xr(o.ref, GC(s));
    return typeof r == "function" || o.isPresent ? g.cloneElement(s, {
      ref: c
    }) : null;
  };
  dc.displayName = "Presence";
  function qC(l) {
    const [n, r] = g.useState(), o = g.useRef(null), s = g.useRef(l), c = g.useRef("none"), d = l ? "mounted" : "unmounted", [f, m] = $C(d, {
      mounted: {
        UNMOUNT: "unmounted",
        ANIMATION_OUT: "unmountSuspended"
      },
      unmountSuspended: {
        MOUNT: "mounted",
        ANIMATION_END: "unmounted"
      },
      unmounted: {
        MOUNT: "mounted"
      }
    });
    return g.useEffect(() => {
      const p = Os(o.current);
      c.current = f === "mounted" ? p : "none";
    }, [
      f
    ]), Ko(() => {
      const p = o.current, v = s.current;
      if (v !== l) {
        const w = c.current, E = Os(p);
        l ? m("MOUNT") : E === "none" || (p == null ? void 0 : p.display) === "none" ? m("UNMOUNT") : m(v && w !== E ? "ANIMATION_OUT" : "UNMOUNT"), s.current = l;
      }
    }, [
      l,
      m
    ]), Ko(() => {
      if (n) {
        let p;
        const v = n.ownerDocument.defaultView ?? window, b = (E) => {
          const S = Os(o.current).includes(CSS.escape(E.animationName));
          if (E.target === n && S && (m("ANIMATION_END"), !s.current)) {
            const C = n.style.animationFillMode;
            n.style.animationFillMode = "forwards", p = v.setTimeout(() => {
              n.style.animationFillMode === "forwards" && (n.style.animationFillMode = C);
            });
          }
        }, w = (E) => {
          E.target === n && (c.current = Os(o.current));
        };
        return n.addEventListener("animationstart", w), n.addEventListener("animationcancel", b), n.addEventListener("animationend", b), () => {
          v.clearTimeout(p), n.removeEventListener("animationstart", w), n.removeEventListener("animationcancel", b), n.removeEventListener("animationend", b);
        };
      } else m("ANIMATION_END");
    }, [
      n,
      m
    ]), {
      isPresent: [
        "mounted",
        "unmountSuspended"
      ].includes(f),
      ref: g.useCallback((p) => {
        o.current = p ? getComputedStyle(p) : null, r(p);
      }, [])
    };
  }
  function Os(l) {
    return (l == null ? void 0 : l.animationName) || "none";
  }
  function GC(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, r = n && "isReactWarning" in n && n.isReactWarning;
    return r ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, r = n && "isReactWarning" in n && n.isReactWarning, r ? l.props.ref : l.props.ref || l.ref);
  }
  var PC = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
  ], ri = PC.reduce((l, n) => {
    const r = li(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: d, ...f } = s, m = d ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), $d = 0;
  function ZC() {
    g.useEffect(() => {
      const l = document.querySelectorAll("[data-radix-focus-guard]");
      return document.body.insertAdjacentElement("afterbegin", l[0] ?? ub()), document.body.insertAdjacentElement("beforeend", l[1] ?? ub()), $d++, () => {
        $d === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((n) => n.remove()), $d--;
      };
    }, []);
  }
  function ub() {
    const l = document.createElement("span");
    return l.setAttribute("data-radix-focus-guard", ""), l.tabIndex = 0, l.style.outline = "none", l.style.opacity = "0", l.style.position = "fixed", l.style.pointerEvents = "none", l;
  }
  var rl = function() {
    return rl = Object.assign || function(n) {
      for (var r, o = 1, s = arguments.length; o < s; o++) {
        r = arguments[o];
        for (var c in r) Object.prototype.hasOwnProperty.call(r, c) && (n[c] = r[c]);
      }
      return n;
    }, rl.apply(this, arguments);
  };
  function q0(l, n) {
    var r = {};
    for (var o in l) Object.prototype.hasOwnProperty.call(l, o) && n.indexOf(o) < 0 && (r[o] = l[o]);
    if (l != null && typeof Object.getOwnPropertySymbols == "function") for (var s = 0, o = Object.getOwnPropertySymbols(l); s < o.length; s++) n.indexOf(o[s]) < 0 && Object.prototype.propertyIsEnumerable.call(l, o[s]) && (r[o[s]] = l[o[s]]);
    return r;
  }
  function KC(l, n, r) {
    if (r || arguments.length === 2) for (var o = 0, s = n.length, c; o < s; o++) (c || !(o in n)) && (c || (c = Array.prototype.slice.call(n, 0, o)), c[o] = n[o]);
    return l.concat(c || Array.prototype.slice.call(n));
  }
  var Zs = "right-scroll-bar-position", Ks = "width-before-scroll-bar", QC = "with-scroll-bars-hidden", FC = "--removed-body-scroll-bar-size";
  function qd(l, n) {
    return typeof l == "function" ? l(n) : l && (l.current = n), l;
  }
  function WC(l, n) {
    var r = g.useState(function() {
      return {
        value: l,
        callback: n,
        facade: {
          get current() {
            return r.value;
          },
          set current(o) {
            var s = r.value;
            s !== o && (r.value = o, r.callback(o, s));
          }
        }
      };
    })[0];
    return r.callback = n, r.facade;
  }
  var JC = typeof window < "u" ? g.useLayoutEffect : g.useEffect, db = /* @__PURE__ */ new WeakMap();
  function eE(l, n) {
    var r = WC(null, function(o) {
      return l.forEach(function(s) {
        return qd(s, o);
      });
    });
    return JC(function() {
      var o = db.get(r);
      if (o) {
        var s = new Set(o), c = new Set(l), d = r.current;
        s.forEach(function(f) {
          c.has(f) || qd(f, null);
        }), c.forEach(function(f) {
          s.has(f) || qd(f, d);
        });
      }
      db.set(r, l);
    }, [
      l
    ]), r;
  }
  function tE(l) {
    return l;
  }
  function nE(l, n) {
    n === void 0 && (n = tE);
    var r = [], o = false, s = {
      read: function() {
        if (o) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        return r.length ? r[r.length - 1] : l;
      },
      useMedium: function(c) {
        var d = n(c, o);
        return r.push(d), function() {
          r = r.filter(function(f) {
            return f !== d;
          });
        };
      },
      assignSyncMedium: function(c) {
        for (o = true; r.length; ) {
          var d = r;
          r = [], d.forEach(c);
        }
        r = {
          push: function(f) {
            return c(f);
          },
          filter: function() {
            return r;
          }
        };
      },
      assignMedium: function(c) {
        o = true;
        var d = [];
        if (r.length) {
          var f = r;
          r = [], f.forEach(c), d = r;
        }
        var m = function() {
          var v = d;
          d = [], v.forEach(c);
        }, p = function() {
          return Promise.resolve().then(m);
        };
        p(), r = {
          push: function(v) {
            d.push(v), p();
          },
          filter: function(v) {
            return d = d.filter(v), r;
          }
        };
      }
    };
    return s;
  }
  function lE(l) {
    l === void 0 && (l = {});
    var n = nE(null);
    return n.options = rl({
      async: true,
      ssr: false
    }, l), n;
  }
  var G0 = function(l) {
    var n = l.sideCar, r = q0(l, [
      "sideCar"
    ]);
    if (!n) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    var o = n.read();
    if (!o) throw new Error("Sidecar medium not found");
    return g.createElement(o, rl({}, r));
  };
  G0.isSideCarExport = true;
  function rE(l, n) {
    return l.useMedium(n), G0;
  }
  var P0 = lE(), Gd = function() {
  }, fc = g.forwardRef(function(l, n) {
    var r = g.useRef(null), o = g.useState({
      onScrollCapture: Gd,
      onWheelCapture: Gd,
      onTouchMoveCapture: Gd
    }), s = o[0], c = o[1], d = l.forwardProps, f = l.children, m = l.className, p = l.removeScrollBar, v = l.enabled, b = l.shards, w = l.sideCar, E = l.noRelative, k = l.noIsolation, S = l.inert, C = l.allowPinchZoom, _ = l.as, L = _ === void 0 ? "div" : _, R = l.gapMode, T = q0(l, [
      "forwardProps",
      "children",
      "className",
      "removeScrollBar",
      "enabled",
      "shards",
      "sideCar",
      "noRelative",
      "noIsolation",
      "inert",
      "allowPinchZoom",
      "as",
      "gapMode"
    ]), B = w, N = eE([
      r,
      n
    ]), A = rl(rl({}, T), s);
    return g.createElement(g.Fragment, null, v && g.createElement(B, {
      sideCar: P0,
      removeScrollBar: p,
      shards: b,
      noRelative: E,
      noIsolation: k,
      inert: S,
      setCallbacks: c,
      allowPinchZoom: !!C,
      lockRef: r,
      gapMode: R
    }), d ? g.cloneElement(g.Children.only(f), rl(rl({}, A), {
      ref: N
    })) : g.createElement(L, rl({}, A, {
      className: m,
      ref: N
    }), f));
  });
  fc.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  fc.classNames = {
    fullWidth: Ks,
    zeroRight: Zs
  };
  var aE = function() {
    if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
  };
  function oE() {
    if (!document) return null;
    var l = document.createElement("style");
    l.type = "text/css";
    var n = aE();
    return n && l.setAttribute("nonce", n), l;
  }
  function iE(l, n) {
    l.styleSheet ? l.styleSheet.cssText = n : l.appendChild(document.createTextNode(n));
  }
  function sE(l) {
    var n = document.head || document.getElementsByTagName("head")[0];
    n.appendChild(l);
  }
  var cE = function() {
    var l = 0, n = null;
    return {
      add: function(r) {
        l == 0 && (n = oE()) && (iE(n, r), sE(n)), l++;
      },
      remove: function() {
        l--, !l && n && (n.parentNode && n.parentNode.removeChild(n), n = null);
      }
    };
  }, uE = function() {
    var l = cE();
    return function(n, r) {
      g.useEffect(function() {
        return l.add(n), function() {
          l.remove();
        };
      }, [
        n && r
      ]);
    };
  }, Z0 = function() {
    var l = uE(), n = function(r) {
      var o = r.styles, s = r.dynamic;
      return l(o, s), null;
    };
    return n;
  }, dE = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  }, Pd = function(l) {
    return parseInt(l || "", 10) || 0;
  }, fE = function(l) {
    var n = window.getComputedStyle(document.body), r = n[l === "padding" ? "paddingLeft" : "marginLeft"], o = n[l === "padding" ? "paddingTop" : "marginTop"], s = n[l === "padding" ? "paddingRight" : "marginRight"];
    return [
      Pd(r),
      Pd(o),
      Pd(s)
    ];
  }, hE = function(l) {
    if (l === void 0 && (l = "margin"), typeof window > "u") return dE;
    var n = fE(l), r = document.documentElement.clientWidth, o = window.innerWidth;
    return {
      left: n[0],
      top: n[1],
      right: n[2],
      gap: Math.max(0, o - r + n[2] - n[0])
    };
  }, mE = Z0(), Ha = "data-scroll-locked", gE = function(l, n, r, o) {
    var s = l.left, c = l.top, d = l.right, f = l.gap;
    return r === void 0 && (r = "margin"), `
  .`.concat(QC, ` {
   overflow: hidden `).concat(o, `;
   padding-right: `).concat(f, "px ").concat(o, `;
  }
  body[`).concat(Ha, `] {
    overflow: hidden `).concat(o, `;
    overscroll-behavior: contain;
    `).concat([
      n && "position: relative ".concat(o, ";"),
      r === "margin" && `
    padding-left: `.concat(s, `px;
    padding-top: `).concat(c, `px;
    padding-right: `).concat(d, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(f, "px ").concat(o, `;
    `),
      r === "padding" && "padding-right: ".concat(f, "px ").concat(o, ";")
    ].filter(Boolean).join(""), `
  }
  
  .`).concat(Zs, ` {
    right: `).concat(f, "px ").concat(o, `;
  }
  
  .`).concat(Ks, ` {
    margin-right: `).concat(f, "px ").concat(o, `;
  }
  
  .`).concat(Zs, " .").concat(Zs, ` {
    right: 0 `).concat(o, `;
  }
  
  .`).concat(Ks, " .").concat(Ks, ` {
    margin-right: 0 `).concat(o, `;
  }
  
  body[`).concat(Ha, `] {
    `).concat(FC, ": ").concat(f, `px;
  }
`);
  }, fb = function() {
    var l = parseInt(document.body.getAttribute(Ha) || "0", 10);
    return isFinite(l) ? l : 0;
  }, pE = function() {
    g.useEffect(function() {
      return document.body.setAttribute(Ha, (fb() + 1).toString()), function() {
        var l = fb() - 1;
        l <= 0 ? document.body.removeAttribute(Ha) : document.body.setAttribute(Ha, l.toString());
      };
    }, []);
  }, yE = function(l) {
    var n = l.noRelative, r = l.noImportant, o = l.gapMode, s = o === void 0 ? "margin" : o;
    pE();
    var c = g.useMemo(function() {
      return hE(s);
    }, [
      s
    ]);
    return g.createElement(mE, {
      styles: gE(c, !n, s, r ? "" : "!important")
    });
  }, qf = false;
  if (typeof window < "u") try {
    var Ds = Object.defineProperty({}, "passive", {
      get: function() {
        return qf = true, true;
      }
    });
    window.addEventListener("test", Ds, Ds), window.removeEventListener("test", Ds, Ds);
  } catch {
    qf = false;
  }
  var La = qf ? {
    passive: false
  } : false, bE = function(l) {
    return l.tagName === "TEXTAREA";
  }, K0 = function(l, n) {
    if (!(l instanceof Element)) return false;
    var r = window.getComputedStyle(l);
    return r[n] !== "hidden" && !(r.overflowY === r.overflowX && !bE(l) && r[n] === "visible");
  }, vE = function(l) {
    return K0(l, "overflowY");
  }, xE = function(l) {
    return K0(l, "overflowX");
  }, hb = function(l, n) {
    var r = n.ownerDocument, o = n;
    do {
      typeof ShadowRoot < "u" && o instanceof ShadowRoot && (o = o.host);
      var s = Q0(l, o);
      if (s) {
        var c = F0(l, o), d = c[1], f = c[2];
        if (d > f) return true;
      }
      o = o.parentNode;
    } while (o && o !== r.body);
    return false;
  }, wE = function(l) {
    var n = l.scrollTop, r = l.scrollHeight, o = l.clientHeight;
    return [
      n,
      r,
      o
    ];
  }, SE = function(l) {
    var n = l.scrollLeft, r = l.scrollWidth, o = l.clientWidth;
    return [
      n,
      r,
      o
    ];
  }, Q0 = function(l, n) {
    return l === "v" ? vE(n) : xE(n);
  }, F0 = function(l, n) {
    return l === "v" ? wE(n) : SE(n);
  }, CE = function(l, n) {
    return l === "h" && n === "rtl" ? -1 : 1;
  }, EE = function(l, n, r, o, s) {
    var c = CE(l, window.getComputedStyle(n).direction), d = c * o, f = r.target, m = n.contains(f), p = false, v = d > 0, b = 0, w = 0;
    do {
      if (!f) break;
      var E = F0(l, f), k = E[0], S = E[1], C = E[2], _ = S - C - c * k;
      (k || _) && Q0(l, f) && (b += _, w += k);
      var L = f.parentNode;
      f = L && L.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? L.host : L;
    } while (!m && f !== document.body || m && (n.contains(f) || n === f));
    return (v && Math.abs(b) < 1 || !v && Math.abs(w) < 1) && (p = true), p;
  }, Is = function(l) {
    return "changedTouches" in l ? [
      l.changedTouches[0].clientX,
      l.changedTouches[0].clientY
    ] : [
      0,
      0
    ];
  }, mb = function(l) {
    return [
      l.deltaX,
      l.deltaY
    ];
  }, gb = function(l) {
    return l && "current" in l ? l.current : l;
  }, _E = function(l, n) {
    return l[0] === n[0] && l[1] === n[1];
  }, kE = function(l) {
    return `
  .block-interactivity-`.concat(l, ` {pointer-events: none;}
  .allow-interactivity-`).concat(l, ` {pointer-events: all;}
`);
  }, ME = 0, Ra = [];
  function jE(l) {
    var n = g.useRef([]), r = g.useRef([
      0,
      0
    ]), o = g.useRef(), s = g.useState(ME++)[0], c = g.useState(Z0)[0], d = g.useRef(l);
    g.useEffect(function() {
      d.current = l;
    }, [
      l
    ]), g.useEffect(function() {
      if (l.inert) {
        document.body.classList.add("block-interactivity-".concat(s));
        var S = KC([
          l.lockRef.current
        ], (l.shards || []).map(gb), true).filter(Boolean);
        return S.forEach(function(C) {
          return C.classList.add("allow-interactivity-".concat(s));
        }), function() {
          document.body.classList.remove("block-interactivity-".concat(s)), S.forEach(function(C) {
            return C.classList.remove("allow-interactivity-".concat(s));
          });
        };
      }
    }, [
      l.inert,
      l.lockRef.current,
      l.shards
    ]);
    var f = g.useCallback(function(S, C) {
      if ("touches" in S && S.touches.length === 2 || S.type === "wheel" && S.ctrlKey) return !d.current.allowPinchZoom;
      var _ = Is(S), L = r.current, R = "deltaX" in S ? S.deltaX : L[0] - _[0], T = "deltaY" in S ? S.deltaY : L[1] - _[1], B, N = S.target, A = Math.abs(R) > Math.abs(T) ? "h" : "v";
      if ("touches" in S && A === "h" && N.type === "range") return false;
      var H = window.getSelection(), z = H && H.anchorNode, P = z ? z === N || z.contains(N) : false;
      if (P) return false;
      var ee = hb(A, N);
      if (!ee) return true;
      if (ee ? B = A : (B = A === "v" ? "h" : "v", ee = hb(A, N)), !ee) return false;
      if (!o.current && "changedTouches" in S && (R || T) && (o.current = B), !B) return true;
      var J = o.current || B;
      return EE(J, C, S, J === "h" ? R : T);
    }, []), m = g.useCallback(function(S) {
      var C = S;
      if (!(!Ra.length || Ra[Ra.length - 1] !== c)) {
        var _ = "deltaY" in C ? mb(C) : Is(C), L = n.current.filter(function(B) {
          return B.name === C.type && (B.target === C.target || C.target === B.shadowParent) && _E(B.delta, _);
        })[0];
        if (L && L.should) {
          C.cancelable && C.preventDefault();
          return;
        }
        if (!L) {
          var R = (d.current.shards || []).map(gb).filter(Boolean).filter(function(B) {
            return B.contains(C.target);
          }), T = R.length > 0 ? f(C, R[0]) : !d.current.noIsolation;
          T && C.cancelable && C.preventDefault();
        }
      }
    }, []), p = g.useCallback(function(S, C, _, L) {
      var R = {
        name: S,
        delta: C,
        target: _,
        should: L,
        shadowParent: LE(_)
      };
      n.current.push(R), setTimeout(function() {
        n.current = n.current.filter(function(T) {
          return T !== R;
        });
      }, 1);
    }, []), v = g.useCallback(function(S) {
      r.current = Is(S), o.current = void 0;
    }, []), b = g.useCallback(function(S) {
      p(S.type, mb(S), S.target, f(S, l.lockRef.current));
    }, []), w = g.useCallback(function(S) {
      p(S.type, Is(S), S.target, f(S, l.lockRef.current));
    }, []);
    g.useEffect(function() {
      return Ra.push(c), l.setCallbacks({
        onScrollCapture: b,
        onWheelCapture: b,
        onTouchMoveCapture: w
      }), document.addEventListener("wheel", m, La), document.addEventListener("touchmove", m, La), document.addEventListener("touchstart", v, La), function() {
        Ra = Ra.filter(function(S) {
          return S !== c;
        }), document.removeEventListener("wheel", m, La), document.removeEventListener("touchmove", m, La), document.removeEventListener("touchstart", v, La);
      };
    }, []);
    var E = l.removeScrollBar, k = l.inert;
    return g.createElement(g.Fragment, null, k ? g.createElement(c, {
      styles: kE(s)
    }) : null, E ? g.createElement(yE, {
      noRelative: l.noRelative,
      gapMode: l.gapMode
    }) : null);
  }
  function LE(l) {
    for (var n = null; l !== null; ) l instanceof ShadowRoot && (n = l.host, l = l.host), l = l.parentNode;
    return n;
  }
  const RE = rE(P0, jE);
  var W0 = g.forwardRef(function(l, n) {
    return g.createElement(fc, rl({}, l, {
      ref: n,
      sideCar: RE
    }));
  });
  W0.classNames = fc.classNames;
  var AE = function(l) {
    if (typeof document > "u") return null;
    var n = Array.isArray(l) ? l[0] : l;
    return n.ownerDocument.body;
  }, Aa = /* @__PURE__ */ new WeakMap(), zs = /* @__PURE__ */ new WeakMap(), Hs = {}, Zd = 0, J0 = function(l) {
    return l && (l.host || J0(l.parentNode));
  }, TE = function(l, n) {
    return n.map(function(r) {
      if (l.contains(r)) return r;
      var o = J0(r);
      return o && l.contains(o) ? o : (console.error("aria-hidden", r, "in not contained inside", l, ". Doing nothing"), null);
    }).filter(function(r) {
      return !!r;
    });
  }, NE = function(l, n, r, o) {
    var s = TE(n, Array.isArray(l) ? l : [
      l
    ]);
    Hs[r] || (Hs[r] = /* @__PURE__ */ new WeakMap());
    var c = Hs[r], d = [], f = /* @__PURE__ */ new Set(), m = new Set(s), p = function(b) {
      !b || f.has(b) || (f.add(b), p(b.parentNode));
    };
    s.forEach(p);
    var v = function(b) {
      !b || m.has(b) || Array.prototype.forEach.call(b.children, function(w) {
        if (f.has(w)) v(w);
        else try {
          var E = w.getAttribute(o), k = E !== null && E !== "false", S = (Aa.get(w) || 0) + 1, C = (c.get(w) || 0) + 1;
          Aa.set(w, S), c.set(w, C), d.push(w), S === 1 && k && zs.set(w, true), C === 1 && w.setAttribute(r, "true"), k || w.setAttribute(o, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", w, _);
        }
      });
    };
    return v(n), f.clear(), Zd++, function() {
      d.forEach(function(b) {
        var w = Aa.get(b) - 1, E = c.get(b) - 1;
        Aa.set(b, w), c.set(b, E), w || (zs.has(b) || b.removeAttribute(o), zs.delete(b)), E || b.removeAttribute(r);
      }), Zd--, Zd || (Aa = /* @__PURE__ */ new WeakMap(), Aa = /* @__PURE__ */ new WeakMap(), zs = /* @__PURE__ */ new WeakMap(), Hs = {});
    };
  }, OE = function(l, n, r) {
    r === void 0 && (r = "data-aria-hidden");
    var o = Array.from(Array.isArray(l) ? l : [
      l
    ]), s = AE(l);
    return s ? (o.push.apply(o, Array.from(s.querySelectorAll("[aria-live], script"))), NE(o, s, r, "aria-hidden")) : function() {
      return null;
    };
  }, hc = "Dialog", [e1] = sC(hc), [DE, Gn] = e1(hc), t1 = (l) => {
    const { __scopeDialog: n, children: r, open: o, defaultOpen: s, onOpenChange: c, modal: d = true } = l, f = g.useRef(null), m = g.useRef(null), [p, v] = hC({
      prop: o,
      defaultProp: s ?? false,
      onChange: c,
      caller: hc
    });
    return y.jsx(DE, {
      scope: n,
      triggerRef: f,
      contentRef: m,
      contentId: Ll(),
      titleId: Ll(),
      descriptionId: Ll(),
      open: p,
      onOpenChange: v,
      onOpenToggle: g.useCallback(() => v((b) => !b), [
        v
      ]),
      modal: d,
      children: r
    });
  };
  t1.displayName = hc;
  var n1 = "DialogTrigger", IE = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(n1, r), c = Xr(n, s.triggerRef);
    return y.jsx(ri.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": s.open,
      "aria-controls": s.contentId,
      "data-state": ch(s.open),
      ...o,
      ref: c,
      onClick: cr(l.onClick, s.onOpenToggle)
    });
  });
  IE.displayName = n1;
  var ih = "DialogPortal", [zE, l1] = e1(ih, {
    forceMount: void 0
  }), r1 = (l) => {
    const { __scopeDialog: n, forceMount: r, children: o, container: s } = l, c = Gn(ih, n);
    return y.jsx(zE, {
      scope: n,
      forceMount: r,
      children: g.Children.map(o, (d) => y.jsx(dc, {
        present: r || c.open,
        children: y.jsx($0, {
          asChild: true,
          container: s,
          children: d
        })
      }))
    });
  };
  r1.displayName = ih;
  var Js = "DialogOverlay", a1 = g.forwardRef((l, n) => {
    const r = l1(Js, l.__scopeDialog), { forceMount: o = r.forceMount, ...s } = l, c = Gn(Js, l.__scopeDialog);
    return c.modal ? y.jsx(dc, {
      present: o || c.open,
      children: y.jsx(UE, {
        ...s,
        ref: n
      })
    }) : null;
  });
  a1.displayName = Js;
  var HE = li("DialogOverlay.RemoveScroll"), UE = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(Js, r);
    return y.jsx(W0, {
      as: HE,
      allowPinchZoom: true,
      shards: [
        s.contentRef
      ],
      children: y.jsx(ri.div, {
        "data-state": ch(s.open),
        ...o,
        ref: n,
        style: {
          pointerEvents: "auto",
          ...o.style
        }
      })
    });
  }), Yr = "DialogContent", o1 = g.forwardRef((l, n) => {
    const r = l1(Yr, l.__scopeDialog), { forceMount: o = r.forceMount, ...s } = l, c = Gn(Yr, l.__scopeDialog);
    return y.jsx(dc, {
      present: o || c.open,
      children: c.modal ? y.jsx(YE, {
        ...s,
        ref: n
      }) : y.jsx(BE, {
        ...s,
        ref: n
      })
    });
  });
  o1.displayName = Yr;
  var YE = g.forwardRef((l, n) => {
    const r = Gn(Yr, l.__scopeDialog), o = g.useRef(null), s = Xr(n, r.contentRef, o);
    return g.useEffect(() => {
      const c = o.current;
      if (c) return OE(c);
    }, []), y.jsx(i1, {
      ...l,
      ref: s,
      trapFocus: r.open,
      disableOutsidePointerEvents: true,
      onCloseAutoFocus: cr(l.onCloseAutoFocus, (c) => {
        var _a;
        c.preventDefault(), (_a = r.triggerRef.current) == null ? void 0 : _a.focus();
      }),
      onPointerDownOutside: cr(l.onPointerDownOutside, (c) => {
        const d = c.detail.originalEvent, f = d.button === 0 && d.ctrlKey === true;
        (d.button === 2 || f) && c.preventDefault();
      }),
      onFocusOutside: cr(l.onFocusOutside, (c) => c.preventDefault())
    });
  }), BE = g.forwardRef((l, n) => {
    const r = Gn(Yr, l.__scopeDialog), o = g.useRef(false), s = g.useRef(false);
    return y.jsx(i1, {
      ...l,
      ref: n,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      onCloseAutoFocus: (c) => {
        var _a, _b2;
        (_a = l.onCloseAutoFocus) == null ? void 0 : _a.call(l, c), c.defaultPrevented || (o.current || ((_b2 = r.triggerRef.current) == null ? void 0 : _b2.focus()), c.preventDefault()), o.current = false, s.current = false;
      },
      onInteractOutside: (c) => {
        var _a, _b2;
        (_a = l.onInteractOutside) == null ? void 0 : _a.call(l, c), c.defaultPrevented || (o.current = true, c.detail.originalEvent.type === "pointerdown" && (s.current = true));
        const d = c.target;
        ((_b2 = r.triggerRef.current) == null ? void 0 : _b2.contains(d)) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && s.current && c.preventDefault();
      }
    });
  }), i1 = g.forwardRef((l, n) => {
    const { __scopeDialog: r, trapFocus: o, onOpenAutoFocus: s, onCloseAutoFocus: c, ...d } = l, f = Gn(Yr, r), m = g.useRef(null), p = Xr(n, m);
    return ZC(), y.jsxs(y.Fragment, {
      children: [
        y.jsx(X0, {
          asChild: true,
          loop: true,
          trapped: o,
          onMountAutoFocus: s,
          onUnmountAutoFocus: c,
          children: y.jsx(Y0, {
            role: "dialog",
            id: f.contentId,
            "aria-describedby": f.descriptionId,
            "aria-labelledby": f.titleId,
            "data-state": ch(f.open),
            ...d,
            ref: p,
            onDismiss: () => f.onOpenChange(false)
          })
        }),
        y.jsxs(y.Fragment, {
          children: [
            y.jsx(qE, {
              titleId: f.titleId
            }),
            y.jsx(PE, {
              contentRef: m,
              descriptionId: f.descriptionId
            })
          ]
        })
      ]
    });
  }), sh = "DialogTitle", XE = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(sh, r);
    return y.jsx(ri.h2, {
      id: s.titleId,
      ...o,
      ref: n
    });
  });
  XE.displayName = sh;
  var s1 = "DialogDescription", VE = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(s1, r);
    return y.jsx(ri.p, {
      id: s.descriptionId,
      ...o,
      ref: n
    });
  });
  VE.displayName = s1;
  var c1 = "DialogClose", $E = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(c1, r);
    return y.jsx(ri.button, {
      type: "button",
      ...o,
      ref: n,
      onClick: cr(l.onClick, () => s.onOpenChange(false))
    });
  });
  $E.displayName = c1;
  function ch(l) {
    return l ? "open" : "closed";
  }
  var u1 = "DialogTitleWarning", [V3, d1] = iC(u1, {
    contentName: Yr,
    titleName: sh,
    docsSlug: "dialog"
  }), qE = ({ titleId: l }) => {
    const n = d1(u1), r = `\`${n.contentName}\` requires a \`${n.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${n.docsSlug}`;
    return g.useEffect(() => {
      l && (document.getElementById(l) || console.error(r));
    }, [
      r,
      l
    ]), null;
  }, GE = "DialogDescriptionWarning", PE = ({ contentRef: l, descriptionId: n }) => {
    const o = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${d1(GE).contentName}}.`;
    return g.useEffect(() => {
      var _a;
      const s = (_a = l.current) == null ? void 0 : _a.getAttribute("aria-describedby");
      n && s && (document.getElementById(n) || console.warn(o));
    }, [
      o,
      l,
      n
    ]), null;
  }, ZE = t1, KE = r1, QE = a1, FE = o1, WE = Symbol.for("react.lazy"), ec = Ff[" use ".trim().toString()];
  function JE(l) {
    return typeof l == "object" && l !== null && "then" in l;
  }
  function f1(l) {
    return l != null && typeof l == "object" && "$$typeof" in l && l.$$typeof === WE && "_payload" in l && JE(l._payload);
  }
  function e_(l) {
    const n = t_(l), r = g.forwardRef((o, s) => {
      let { children: c, ...d } = o;
      f1(c) && typeof ec == "function" && (c = ec(c._payload));
      const f = g.Children.toArray(c), m = f.find(l_);
      if (m) {
        const p = m.props.children, v = f.map((b) => b === m ? g.Children.count(p) > 1 ? g.Children.only(null) : g.isValidElement(p) ? p.props.children : null : b);
        return y.jsx(n, {
          ...d,
          ref: s,
          children: g.isValidElement(p) ? g.cloneElement(p, void 0, v) : null
        });
      }
      return y.jsx(n, {
        ...d,
        ref: s,
        children: c
      });
    });
    return r.displayName = `${l}.Slot`, r;
  }
  function t_(l) {
    const n = g.forwardRef((r, o) => {
      let { children: s, ...c } = r;
      if (f1(s) && typeof ec == "function" && (s = ec(s._payload)), g.isValidElement(s)) {
        const d = a_(s), f = r_(c, s.props);
        return s.type !== g.Fragment && (f.ref = o ? fr(o, d) : d), g.cloneElement(s, f);
      }
      return g.Children.count(s) > 1 ? g.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var n_ = Symbol("radix.slottable");
  function l_(l) {
    return g.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === n_;
  }
  function r_(l, n) {
    const r = {
      ...n
    };
    for (const o in n) {
      const s = l[o], c = n[o];
      /^on[A-Z]/.test(o) ? s && c ? r[o] = (...f) => {
        const m = c(...f);
        return s(...f), m;
      } : s && (r[o] = s) : o === "style" ? r[o] = {
        ...s,
        ...c
      } : o === "className" && (r[o] = [
        s,
        c
      ].filter(Boolean).join(" "));
    }
    return {
      ...l,
      ...r
    };
  }
  function a_(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, r = n && "isReactWarning" in n && n.isReactWarning;
    return r ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, r = n && "isReactWarning" in n && n.isReactWarning, r ? l.props.ref : l.props.ref || l.ref);
  }
  var o_ = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
  ], gr = o_.reduce((l, n) => {
    const r = e_(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: d, ...f } = s, m = d ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), zo = '[cmdk-group=""]', Kd = '[cmdk-group-items=""]', i_ = '[cmdk-group-heading=""]', h1 = '[cmdk-item=""]', pb = `${h1}:not([aria-disabled="true"])`, Gf = "cmdk-item-select", Ta = "data-value", s_ = (l, n, r) => oC(l, n, r), m1 = g.createContext(void 0), ai = () => g.useContext(m1), g1 = g.createContext(void 0), uh = () => g.useContext(g1), p1 = g.createContext(void 0), y1 = g.forwardRef((l, n) => {
    let r = Na(() => {
      var D, O;
      return {
        search: "",
        value: (O = (D = l.value) != null ? D : l.defaultValue) != null ? O : "",
        selectedItemId: void 0,
        filtered: {
          count: 0,
          items: /* @__PURE__ */ new Map(),
          groups: /* @__PURE__ */ new Set()
        }
      };
    }), o = Na(() => /* @__PURE__ */ new Set()), s = Na(() => /* @__PURE__ */ new Map()), c = Na(() => /* @__PURE__ */ new Map()), d = Na(() => /* @__PURE__ */ new Set()), f = b1(l), { label: m, children: p, value: v, onValueChange: b, filter: w, shouldFilter: E, loop: k, disablePointerSelection: S = false, vimBindings: C = true, ..._ } = l, L = Ll(), R = Ll(), T = Ll(), B = g.useRef(null), N = v_();
    Br(() => {
      if (v !== void 0) {
        let D = v.trim();
        r.current.value = D, A.emit();
      }
    }, [
      v
    ]), Br(() => {
      N(6, ce);
    }, []);
    let A = g.useMemo(() => ({
      subscribe: (D) => (d.current.add(D), () => d.current.delete(D)),
      snapshot: () => r.current,
      setState: (D, O, Z) => {
        var Q, oe, ue, _e;
        if (!Object.is(r.current[D], O)) {
          if (r.current[D] = O, D === "search") J(), P(), N(1, ee);
          else if (D === "value") {
            if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
              let X = document.getElementById(T);
              X ? X.focus() : (Q = document.getElementById(L)) == null || Q.focus();
            }
            if (N(7, () => {
              var X;
              r.current.selectedItemId = (X = fe()) == null ? void 0 : X.id, A.emit();
            }), Z || N(5, ce), ((oe = f.current) == null ? void 0 : oe.value) !== void 0) {
              let X = O ?? "";
              (_e = (ue = f.current).onValueChange) == null || _e.call(ue, X);
              return;
            }
          }
          A.emit();
        }
      },
      emit: () => {
        d.current.forEach((D) => D());
      }
    }), []), H = g.useMemo(() => ({
      value: (D, O, Z) => {
        var Q;
        O !== ((Q = c.current.get(D)) == null ? void 0 : Q.value) && (c.current.set(D, {
          value: O,
          keywords: Z
        }), r.current.filtered.items.set(D, z(O, Z)), N(2, () => {
          P(), A.emit();
        }));
      },
      item: (D, O) => (o.current.add(D), O && (s.current.has(O) ? s.current.get(O).add(D) : s.current.set(O, /* @__PURE__ */ new Set([
        D
      ]))), N(3, () => {
        J(), P(), r.current.value || ee(), A.emit();
      }), () => {
        c.current.delete(D), o.current.delete(D), r.current.filtered.items.delete(D);
        let Z = fe();
        N(4, () => {
          J(), (Z == null ? void 0 : Z.getAttribute("id")) === D && ee(), A.emit();
        });
      }),
      group: (D) => (s.current.has(D) || s.current.set(D, /* @__PURE__ */ new Set()), () => {
        c.current.delete(D), s.current.delete(D);
      }),
      filter: () => f.current.shouldFilter,
      label: m || l["aria-label"],
      getDisablePointerSelection: () => f.current.disablePointerSelection,
      listId: L,
      inputId: T,
      labelId: R,
      listInnerRef: B
    }), []);
    function z(D, O) {
      var Z, Q;
      let oe = (Q = (Z = f.current) == null ? void 0 : Z.filter) != null ? Q : s_;
      return D ? oe(D, r.current.search, O) : 0;
    }
    function P() {
      if (!r.current.search || f.current.shouldFilter === false) return;
      let D = r.current.filtered.items, O = [];
      r.current.filtered.groups.forEach((Q) => {
        let oe = s.current.get(Q), ue = 0;
        oe.forEach((_e) => {
          let X = D.get(_e);
          ue = Math.max(X, ue);
        }), O.push([
          Q,
          ue
        ]);
      });
      let Z = B.current;
      Se().sort((Q, oe) => {
        var ue, _e;
        let X = Q.getAttribute("id"), se = oe.getAttribute("id");
        return ((ue = D.get(se)) != null ? ue : 0) - ((_e = D.get(X)) != null ? _e : 0);
      }).forEach((Q) => {
        let oe = Q.closest(Kd);
        oe ? oe.appendChild(Q.parentElement === oe ? Q : Q.closest(`${Kd} > *`)) : Z.appendChild(Q.parentElement === Z ? Q : Q.closest(`${Kd} > *`));
      }), O.sort((Q, oe) => oe[1] - Q[1]).forEach((Q) => {
        var oe;
        let ue = (oe = B.current) == null ? void 0 : oe.querySelector(`${zo}[${Ta}="${encodeURIComponent(Q[0])}"]`);
        ue == null ? void 0 : ue.parentElement.appendChild(ue);
      });
    }
    function ee() {
      let D = Se().find((Z) => Z.getAttribute("aria-disabled") !== "true"), O = D == null ? void 0 : D.getAttribute(Ta);
      A.setState("value", O || void 0);
    }
    function J() {
      var D, O, Z, Q;
      if (!r.current.search || f.current.shouldFilter === false) {
        r.current.filtered.count = o.current.size;
        return;
      }
      r.current.filtered.groups = /* @__PURE__ */ new Set();
      let oe = 0;
      for (let ue of o.current) {
        let _e = (O = (D = c.current.get(ue)) == null ? void 0 : D.value) != null ? O : "", X = (Q = (Z = c.current.get(ue)) == null ? void 0 : Z.keywords) != null ? Q : [], se = z(_e, X);
        r.current.filtered.items.set(ue, se), se > 0 && oe++;
      }
      for (let [ue, _e] of s.current) for (let X of _e) if (r.current.filtered.items.get(X) > 0) {
        r.current.filtered.groups.add(ue);
        break;
      }
      r.current.filtered.count = oe;
    }
    function ce() {
      var D, O, Z;
      let Q = fe();
      Q && (((D = Q.parentElement) == null ? void 0 : D.firstChild) === Q && ((Z = (O = Q.closest(zo)) == null ? void 0 : O.querySelector(i_)) == null || Z.scrollIntoView({
        block: "nearest"
      })), Q.scrollIntoView({
        block: "nearest"
      }));
    }
    function fe() {
      var D;
      return (D = B.current) == null ? void 0 : D.querySelector(`${h1}[aria-selected="true"]`);
    }
    function Se() {
      var D;
      return Array.from(((D = B.current) == null ? void 0 : D.querySelectorAll(pb)) || []);
    }
    function $(D) {
      let O = Se()[D];
      O && A.setState("value", O.getAttribute(Ta));
    }
    function F(D) {
      var O;
      let Z = fe(), Q = Se(), oe = Q.findIndex((_e) => _e === Z), ue = Q[oe + D];
      (O = f.current) != null && O.loop && (ue = oe + D < 0 ? Q[Q.length - 1] : oe + D === Q.length ? Q[0] : Q[oe + D]), ue && A.setState("value", ue.getAttribute(Ta));
    }
    function ie(D) {
      let O = fe(), Z = O == null ? void 0 : O.closest(zo), Q;
      for (; Z && !Q; ) Z = D > 0 ? y_(Z, zo) : b_(Z, zo), Q = Z == null ? void 0 : Z.querySelector(pb);
      Q ? A.setState("value", Q.getAttribute(Ta)) : F(D);
    }
    let Ee = () => $(Se().length - 1), pe = (D) => {
      D.preventDefault(), D.metaKey ? Ee() : D.altKey ? ie(1) : F(1);
    }, j = (D) => {
      D.preventDefault(), D.metaKey ? $(0) : D.altKey ? ie(-1) : F(-1);
    };
    return g.createElement(gr.div, {
      ref: n,
      tabIndex: -1,
      ..._,
      "cmdk-root": "",
      onKeyDown: (D) => {
        var O;
        (O = _.onKeyDown) == null || O.call(_, D);
        let Z = D.nativeEvent.isComposing || D.keyCode === 229;
        if (!(D.defaultPrevented || Z)) switch (D.key) {
          case "n":
          case "j": {
            C && D.ctrlKey && pe(D);
            break;
          }
          case "ArrowDown": {
            pe(D);
            break;
          }
          case "p":
          case "k": {
            C && D.ctrlKey && j(D);
            break;
          }
          case "ArrowUp": {
            j(D);
            break;
          }
          case "Home": {
            D.preventDefault(), $(0);
            break;
          }
          case "End": {
            D.preventDefault(), Ee();
            break;
          }
          case "Enter": {
            D.preventDefault();
            let Q = fe();
            if (Q) {
              let oe = new Event(Gf);
              Q.dispatchEvent(oe);
            }
          }
        }
      }
    }, g.createElement("label", {
      "cmdk-label": "",
      htmlFor: H.inputId,
      id: H.labelId,
      style: w_
    }, m), mc(l, (D) => g.createElement(g1.Provider, {
      value: A
    }, g.createElement(m1.Provider, {
      value: H
    }, D))));
  }), c_ = g.forwardRef((l, n) => {
    var r, o;
    let s = Ll(), c = g.useRef(null), d = g.useContext(p1), f = ai(), m = b1(l), p = (o = (r = m.current) == null ? void 0 : r.forceMount) != null ? o : d == null ? void 0 : d.forceMount;
    Br(() => {
      if (!p) return f.item(s, d == null ? void 0 : d.id);
    }, [
      p
    ]);
    let v = v1(s, c, [
      l.value,
      l.children,
      c
    ], l.keywords), b = uh(), w = hr((N) => N.value && N.value === v.current), E = hr((N) => p || f.filter() === false ? true : N.search ? N.filtered.items.get(s) > 0 : true);
    g.useEffect(() => {
      let N = c.current;
      if (!(!N || l.disabled)) return N.addEventListener(Gf, k), () => N.removeEventListener(Gf, k);
    }, [
      E,
      l.onSelect,
      l.disabled
    ]);
    function k() {
      var N, A;
      S(), (A = (N = m.current).onSelect) == null || A.call(N, v.current);
    }
    function S() {
      b.setState("value", v.current, true);
    }
    if (!E) return null;
    let { disabled: C, value: _, onSelect: L, forceMount: R, keywords: T, ...B } = l;
    return g.createElement(gr.div, {
      ref: fr(c, n),
      ...B,
      id: s,
      "cmdk-item": "",
      role: "option",
      "aria-disabled": !!C,
      "aria-selected": !!w,
      "data-disabled": !!C,
      "data-selected": !!w,
      onPointerMove: C || f.getDisablePointerSelection() ? void 0 : S,
      onClick: C ? void 0 : k
    }, l.children);
  }), u_ = g.forwardRef((l, n) => {
    let { heading: r, children: o, forceMount: s, ...c } = l, d = Ll(), f = g.useRef(null), m = g.useRef(null), p = Ll(), v = ai(), b = hr((E) => s || v.filter() === false ? true : E.search ? E.filtered.groups.has(d) : true);
    Br(() => v.group(d), []), v1(d, f, [
      l.value,
      l.heading,
      m
    ]);
    let w = g.useMemo(() => ({
      id: d,
      forceMount: s
    }), [
      s
    ]);
    return g.createElement(gr.div, {
      ref: fr(f, n),
      ...c,
      "cmdk-group": "",
      role: "presentation",
      hidden: b ? void 0 : true
    }, r && g.createElement("div", {
      ref: m,
      "cmdk-group-heading": "",
      "aria-hidden": true,
      id: p
    }, r), mc(l, (E) => g.createElement("div", {
      "cmdk-group-items": "",
      role: "group",
      "aria-labelledby": r ? p : void 0
    }, g.createElement(p1.Provider, {
      value: w
    }, E))));
  }), d_ = g.forwardRef((l, n) => {
    let { alwaysRender: r, ...o } = l, s = g.useRef(null), c = hr((d) => !d.search);
    return !r && !c ? null : g.createElement(gr.div, {
      ref: fr(s, n),
      ...o,
      "cmdk-separator": "",
      role: "separator"
    });
  }), f_ = g.forwardRef((l, n) => {
    let { onValueChange: r, ...o } = l, s = l.value != null, c = uh(), d = hr((p) => p.search), f = hr((p) => p.selectedItemId), m = ai();
    return g.useEffect(() => {
      l.value != null && c.setState("search", l.value);
    }, [
      l.value
    ]), g.createElement(gr.input, {
      ref: n,
      ...o,
      "cmdk-input": "",
      autoComplete: "off",
      autoCorrect: "off",
      spellCheck: false,
      "aria-autocomplete": "list",
      role: "combobox",
      "aria-expanded": true,
      "aria-controls": m.listId,
      "aria-labelledby": m.labelId,
      "aria-activedescendant": f,
      id: m.inputId,
      type: "text",
      value: s ? l.value : d,
      onChange: (p) => {
        s || c.setState("search", p.target.value), r == null ? void 0 : r(p.target.value);
      }
    });
  }), h_ = g.forwardRef((l, n) => {
    let { children: r, label: o = "Suggestions", ...s } = l, c = g.useRef(null), d = g.useRef(null), f = hr((p) => p.selectedItemId), m = ai();
    return g.useEffect(() => {
      if (d.current && c.current) {
        let p = d.current, v = c.current, b, w = new ResizeObserver(() => {
          b = requestAnimationFrame(() => {
            let E = p.offsetHeight;
            v.style.setProperty("--cmdk-list-height", E.toFixed(1) + "px");
          });
        });
        return w.observe(p), () => {
          cancelAnimationFrame(b), w.unobserve(p);
        };
      }
    }, []), g.createElement(gr.div, {
      ref: fr(c, n),
      ...s,
      "cmdk-list": "",
      role: "listbox",
      tabIndex: -1,
      "aria-activedescendant": f,
      "aria-label": o,
      id: m.listId
    }, mc(l, (p) => g.createElement("div", {
      ref: fr(d, m.listInnerRef),
      "cmdk-list-sizer": ""
    }, p)));
  }), m_ = g.forwardRef((l, n) => {
    let { open: r, onOpenChange: o, overlayClassName: s, contentClassName: c, container: d, ...f } = l;
    return g.createElement(ZE, {
      open: r,
      onOpenChange: o
    }, g.createElement(KE, {
      container: d
    }, g.createElement(QE, {
      "cmdk-overlay": "",
      className: s
    }), g.createElement(FE, {
      "aria-label": l.label,
      "cmdk-dialog": "",
      className: c
    }, g.createElement(y1, {
      ref: n,
      ...f
    }))));
  }), g_ = g.forwardRef((l, n) => hr((r) => r.filtered.count === 0) ? g.createElement(gr.div, {
    ref: n,
    ...l,
    "cmdk-empty": "",
    role: "presentation"
  }) : null), p_ = g.forwardRef((l, n) => {
    let { progress: r, children: o, label: s = "Loading...", ...c } = l;
    return g.createElement(gr.div, {
      ref: n,
      ...c,
      "cmdk-loading": "",
      role: "progressbar",
      "aria-valuenow": r,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-label": s
    }, mc(l, (d) => g.createElement("div", {
      "aria-hidden": true
    }, d)));
  }), Uo = Object.assign(y1, {
    List: h_,
    Item: c_,
    Input: f_,
    Group: u_,
    Separator: d_,
    Dialog: m_,
    Empty: g_,
    Loading: p_
  });
  function y_(l, n) {
    let r = l.nextElementSibling;
    for (; r; ) {
      if (r.matches(n)) return r;
      r = r.nextElementSibling;
    }
  }
  function b_(l, n) {
    let r = l.previousElementSibling;
    for (; r; ) {
      if (r.matches(n)) return r;
      r = r.previousElementSibling;
    }
  }
  function b1(l) {
    let n = g.useRef(l);
    return Br(() => {
      n.current = l;
    }), n;
  }
  var Br = typeof window > "u" ? g.useEffect : g.useLayoutEffect;
  function Na(l) {
    let n = g.useRef();
    return n.current === void 0 && (n.current = l()), n;
  }
  function hr(l) {
    let n = uh(), r = () => l(n.snapshot());
    return g.useSyncExternalStore(n.subscribe, r, r);
  }
  function v1(l, n, r, o = []) {
    let s = g.useRef(), c = ai();
    return Br(() => {
      var d;
      let f = (() => {
        var p;
        for (let v of r) {
          if (typeof v == "string") return v.trim();
          if (typeof v == "object" && "current" in v) return v.current ? (p = v.current.textContent) == null ? void 0 : p.trim() : s.current;
        }
      })(), m = o.map((p) => p.trim());
      c.value(l, f, m), (d = n.current) == null || d.setAttribute(Ta, f), s.current = f;
    }), s;
  }
  var v_ = () => {
    let [l, n] = g.useState(), r = Na(() => /* @__PURE__ */ new Map());
    return Br(() => {
      r.current.forEach((o) => o()), r.current = /* @__PURE__ */ new Map();
    }, [
      l
    ]), (o, s) => {
      r.current.set(o, s), n({});
    };
  };
  function x_(l) {
    let n = l.type;
    return typeof n == "function" ? n(l.props) : "render" in n ? n.render(l.props) : l;
  }
  function mc({ asChild: l, children: n }, r) {
    return l && g.isValidElement(n) ? g.cloneElement(x_(n), {
      ref: n.ref
    }, r(n.props.children)) : r(n);
  }
  var w_ = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: "0"
  };
  const Fo = xt()(Wf((l) => ({
    isMinimized: true,
    toggle: () => l((n) => ({
      isMinimized: !n.isMinimized
    }))
  }), {
    name: "rosette-minimap",
    partialize: (l) => ({
      isMinimized: l.isMinimized
    })
  })), S_ = "image/png,image/jpeg,image/svg+xml,image/webp,image/gif,image/bmp";
  function C_(l) {
    var _a;
    const n = ((_a = l.split(".").pop()) == null ? void 0 : _a.toLowerCase()) ?? "";
    return {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      svg: "image/svg+xml",
      webp: "image/webp",
      gif: "image/gif",
      bmp: "image/bmp"
    }[n] ?? "application/octet-stream";
  }
  function E_(l) {
    return l.replace(/\\/g, "/").split("/").pop() ?? l;
  }
  function x1(l) {
    return new Promise((n, r) => {
      const o = new Image();
      o.onload = () => n({
        naturalWidth: o.naturalWidth,
        naturalHeight: o.naturalHeight
      }), o.onerror = () => r(new Error("Failed to decode image")), o.src = l;
    });
  }
  function __() {
    return new Promise((l) => {
      const n = document.createElement("input");
      n.type = "file", n.accept = S_, n.style.display = "none", n.addEventListener("change", async () => {
        var _a;
        const r = (_a = n.files) == null ? void 0 : _a[0];
        if (!r) {
          l(null);
          return;
        }
        const o = URL.createObjectURL(r);
        try {
          const { naturalWidth: s, naturalHeight: c } = await x1(o);
          l({
            url: o,
            filename: r.name,
            naturalWidth: s,
            naturalHeight: c
          });
        } catch {
          URL.revokeObjectURL(o), l(null);
        }
      }), n.addEventListener("cancel", () => l(null)), document.body.appendChild(n), n.click(), document.body.removeChild(n);
    });
  }
  async function k_() {
    const l = await e0();
    if (!l) return null;
    const n = E_(l), r = C_(n), o = await t0(l), s = new Blob([
      o.buffer
    ], {
      type: r
    }), c = URL.createObjectURL(s);
    try {
      const { naturalWidth: d, naturalHeight: f } = await x1(c);
      return {
        url: c,
        filename: n,
        naturalWidth: d,
        naturalHeight: f
      };
    } catch {
      return URL.revokeObjectURL(c), null;
    }
  }
  function M_(l) {
    const { zoom: n, offset: r } = Oe.getState(), o = document.getElementById("rosette-canvas");
    if (!o) return;
    const s = o.getBoundingClientRect(), c = (s.width / 2 - r.x) / n, d = (s.height / 2 - r.y) / n, m = s.width / n * 0.2, p = l.naturalHeight / l.naturalWidth, v = m * p, b = c - m / 2, w = d - v / 2, E = {
      id: crypto.randomUUID(),
      url: l.url,
      filename: l.filename,
      x: b,
      y: w,
      width: m,
      height: v,
      naturalWidth: l.naturalWidth,
      naturalHeight: l.naturalHeight,
      lockAspectRatio: true
    }, { library: k, renderer: S } = we.getState();
    if (k && S) {
      const C = new WS(E);
      de.getState().execute(C, {
        library: k,
        renderer: S
      });
    }
  }
  async function j_() {
    const l = Dn ? await k_() : await __();
    l && M_(l);
  }
  function L_() {
    const { setThemeSetting: l } = ge.getState(), { close: n } = nn.getState(), { setTool: r } = Bt.getState();
    return [
      {
        id: "file-new",
        type: "command",
        name: "File: New",
        shortcut: {
          modifiers: [
            Ie.mod
          ],
          key: "N"
        },
        action: async () => {
          n();
          const { handleNewFile: s } = await ut(async () => {
            const { handleNewFile: c } = await Promise.resolve().then(() => Vn);
            return {
              handleNewFile: c
            };
          }, void 0, import.meta.url);
          await s();
        },
        searchableText: "File new create blank empty reset"
      },
      ..."__TAURI__" in window ? [
        {
          id: "file-open",
          type: "command",
          name: "File: Open GDS",
          shortcut: {
            modifiers: [
              Ie.mod
            ],
            key: "O"
          },
          action: async () => {
            n();
            const { emitOpenFile: s } = await ut(async () => {
              const { emitOpenFile: f } = await Promise.resolve().then(() => Vn);
              return {
                emitOpenFile: f
              };
            }, void 0, import.meta.url), { pickGdsFile: c } = await ut(async () => {
              const { pickGdsFile: f } = await Promise.resolve().then(() => l0);
              return {
                pickGdsFile: f
              };
            }, void 0, import.meta.url), d = await c();
            d && await s(d);
          },
          searchableText: "File open gds load import"
        },
        {
          id: "file-save",
          type: "command",
          name: "File: Save",
          shortcut: {
            modifiers: [
              Ie.mod
            ],
            key: "S"
          },
          action: async () => {
            n();
            const { handleSave: s } = await ut(async () => {
              const { handleSave: c } = await Promise.resolve().then(() => Vn);
              return {
                handleSave: c
              };
            }, void 0, import.meta.url);
            await s(false);
          },
          searchableText: "File save gds export write"
        },
        {
          id: "file-save-as",
          type: "command",
          name: "File: Save As",
          shortcut: {
            modifiers: [
              Ie.mod,
              "\u21E7"
            ],
            key: "S"
          },
          action: async () => {
            n();
            const { handleSave: s } = await ut(async () => {
              const { handleSave: c } = await Promise.resolve().then(() => Vn);
              return {
                handleSave: c
              };
            }, void 0, import.meta.url);
            await s(true);
          },
          searchableText: "File save as gds export write new"
        }
      ] : [],
      {
        id: "file-screenshot",
        type: "command",
        name: "File: Export Screenshot",
        action: async () => {
          n();
          const { handleScreenshot: s } = await ut(async () => {
            const { handleScreenshot: c } = await Promise.resolve().then(() => Vn);
            return {
              handleScreenshot: c
            };
          }, void 0, import.meta.url);
          await s();
        },
        searchableText: "File export screenshot image png capture canvas save picture"
      },
      {
        id: "file-screenshot-clipboard",
        type: "command",
        name: "File: Copy Screenshot to Clipboard",
        action: async () => {
          n();
          const { handleScreenshotToClipboard: s } = await ut(async () => {
            const { handleScreenshotToClipboard: c } = await Promise.resolve().then(() => Vn);
            return {
              handleScreenshotToClipboard: c
            };
          }, void 0, import.meta.url);
          await s();
        },
        searchableText: "File copy screenshot clipboard image png capture"
      },
      {
        id: "theme-dark",
        type: "command",
        name: "Set Theme: Dark",
        action: () => {
          l("dark"), n();
        },
        searchableText: "Set theme dark mode"
      },
      {
        id: "theme-light",
        type: "command",
        name: "Set Theme: Light",
        action: () => {
          l("light"), n();
        },
        searchableText: "Set theme light mode"
      },
      {
        id: "theme-system",
        type: "command",
        name: "Set Theme: System",
        action: () => {
          l("system"), n();
        },
        searchableText: "Set theme system auto automatic"
      },
      {
        id: "view-toggle-minimap",
        type: "command",
        name: "View: Toggle Minimap",
        action: () => {
          Fo.getState().toggle(), n();
        },
        searchableText: "Toggle minimap show hide overview map"
      },
      {
        id: "view-toggle-grid",
        type: "command",
        name: "View: Toggle Grid",
        action: () => {
          ge.getState().toggleGrid(), n();
        },
        searchableText: "Toggle grid show hide dots points"
      },
      {
        id: "view-toggle-zen-mode",
        type: "command",
        name: "View: Toggle Zen Mode",
        action: () => {
          ge.getState().toggleZenMode(), n();
        },
        searchableText: "Toggle zen mode focus distraction free hide toolbar explorer sidebar panels"
      },
      {
        id: "view-show-layers",
        type: "command",
        name: "View: Show Layers Panel",
        action: () => {
          ge.getState().setSidebarTab("layers"), n();
        },
        searchableText: "Show layers panel sidebar switch tab"
      },
      {
        id: "view-show-inspector",
        type: "command",
        name: "View: Show Inspector Panel",
        action: () => {
          ge.getState().setSidebarTab("inspector"), n();
        },
        searchableText: "Show inspector panel sidebar switch tab properties"
      },
      {
        id: "view-zoom-in",
        type: "command",
        name: "View: Zoom In",
        shortcut: {
          key: "+"
        },
        action: () => {
          const s = document.getElementById("rosette-canvas");
          if (s) {
            const c = s.getBoundingClientRect();
            Oe.getState().zoomAt(nc, c.width / 2, c.height / 2);
          }
          n();
        },
        searchableText: "Zoom in magnify enlarge"
      },
      {
        id: "view-zoom-out",
        type: "command",
        name: "View: Zoom Out",
        shortcut: {
          key: "-"
        },
        action: () => {
          const s = document.getElementById("rosette-canvas");
          if (s) {
            const c = s.getBoundingClientRect();
            Oe.getState().zoomAt(lc, c.width / 2, c.height / 2);
          }
          n();
        },
        searchableText: "Zoom out shrink reduce"
      },
      {
        id: "view-zoom-to-fit",
        type: "command",
        name: "View: Zoom to Fit",
        shortcut: {
          key: "F"
        },
        action: () => {
          const s = document.getElementById("rosette-canvas"), { library: c } = we.getState();
          if (s && c) {
            const d = c.get_all_bounds(), f = d ? {
              minX: d[0],
              minY: d[1],
              maxX: d[2],
              maxY: d[3]
            } : null, m = ol(s);
            Oe.getState().zoomToFit(f, m.width, m.height, m.screenCenter);
          }
          n();
        },
        searchableText: "Zoom to fit all objects view"
      },
      {
        id: "view-zoom-to-selection",
        type: "command",
        name: "View: Zoom to Selection",
        shortcut: {
          modifiers: [
            Ie.shift
          ],
          key: "F"
        },
        action: () => {
          const s = document.getElementById("rosette-canvas"), { library: c } = we.getState();
          if (s && c) {
            const d = ae.getState().selectedIds;
            if (d.size > 0) {
              const f = c.get_bounds_for_ids([
                ...d
              ]), m = f ? {
                minX: f[0],
                minY: f[1],
                maxX: f[2],
                maxY: f[3]
              } : null, p = ol(s);
              Oe.getState().zoomToSelected(m, p.width, p.height, p.screenCenter);
            }
          }
          n();
        },
        searchableText: "Zoom to fit selection selected elements"
      },
      {
        id: "tool-select",
        type: "tool",
        name: "Tool: Select",
        shortcut: {
          key: "V"
        },
        action: () => {
          r("select"), n();
        },
        searchableText: "Tool select cursor pointer"
      },
      {
        id: "tool-laser",
        type: "tool",
        name: "Tool: Laser Pointer",
        shortcut: {
          key: "Q"
        },
        action: () => {
          r("laser"), n();
        },
        searchableText: "Tool laser pointer"
      },
      {
        id: "tool-pan",
        type: "tool",
        name: "Tool: Pan",
        shortcut: {
          key: "P"
        },
        action: () => {
          r("pan"), n();
        },
        searchableText: "Tool pan hand grab"
      },
      {
        id: "tool-move",
        type: "tool",
        name: "Tool: Move",
        shortcut: {
          key: "M"
        },
        action: () => {
          r("move"), n();
        },
        searchableText: "Tool move drag"
      },
      {
        id: "tool-zoom",
        type: "tool",
        name: "Tool: Zoom",
        shortcut: {
          key: "Z"
        },
        action: () => {
          r("zoom"), n();
        },
        searchableText: "Tool zoom magnify"
      },
      {
        id: "tool-ruler",
        type: "tool",
        name: "Tool: Ruler",
        shortcut: {
          key: "U"
        },
        action: () => {
          r("ruler"), n();
        },
        searchableText: "Tool ruler measure distance"
      },
      {
        id: "tool-rectangle",
        type: "tool",
        name: "Tool: Rectangle",
        shortcut: {
          key: "R"
        },
        action: () => {
          r("rectangle"), n();
        },
        searchableText: "Tool rectangle shape draw box"
      },
      {
        id: "tool-polygon",
        type: "tool",
        name: "Tool: Polygon",
        shortcut: {
          key: "G"
        },
        action: () => {
          r("polygon"), n();
        },
        searchableText: "Tool polygon shape draw"
      },
      {
        id: "tool-path",
        type: "tool",
        name: "Tool: Path",
        shortcut: {
          key: "H"
        },
        action: () => {
          r("path"), n();
        },
        searchableText: "Tool path waveguide route draw"
      },
      {
        id: "tool-text",
        type: "tool",
        name: "Tool: Text",
        shortcut: {
          key: "T"
        },
        action: () => {
          r("text"), n();
        },
        searchableText: "Tool text label annotation"
      },
      {
        id: "add-rectangle",
        type: "command",
        name: "Add: Rectangle",
        shortcut: {
          key: "R",
          then: "\u21B5"
        },
        action: () => {
          const { library: s, renderer: c } = we.getState(), d = document.getElementById("rosette-canvas");
          s && c && d && S0(s, c, d), n();
        },
        searchableText: "Add rectangle create shape box place"
      },
      {
        id: "add-polygon",
        type: "command",
        name: "Add: Polygon",
        shortcut: {
          key: "G",
          then: "\u21B5"
        },
        action: () => {
          const { library: s, renderer: c } = we.getState(), d = document.getElementById("rosette-canvas");
          s && c && d && C0(s, c, d), n();
        },
        searchableText: "Add polygon create shape triangle place"
      },
      {
        id: "add-text",
        type: "command",
        name: "Add: Text",
        shortcut: {
          key: "T",
          then: "\u21B5"
        },
        action: () => {
          const { library: s, renderer: c } = we.getState(), d = document.getElementById("rosette-canvas");
          s && c && d && E0(s, c, d), n();
        },
        searchableText: "Add text create label annotation place"
      },
      {
        id: "insert-image",
        type: "command",
        name: "Insert: Image",
        action: () => {
          j_(), n();
        },
        searchableText: "Insert image picture photo reference overlay annotation"
      },
      {
        id: "edit-undo",
        type: "command",
        name: "Edit: Undo",
        shortcut: {
          modifiers: [
            Ie.mod
          ],
          key: "Z"
        },
        action: () => {
          const { library: s, renderer: c } = we.getState();
          if (s && c) {
            const { canUndo: d, undo: f } = de.getState();
            d && f({
              library: s,
              renderer: c
            });
          }
          n();
        },
        searchableText: "Undo revert back"
      },
      {
        id: "edit-redo",
        type: "command",
        name: "Edit: Redo",
        shortcut: {
          modifiers: [
            Ie.mod,
            Ie.shift
          ],
          key: "Z"
        },
        action: () => {
          const { library: s, renderer: c } = we.getState();
          if (s && c) {
            const { canRedo: d, redo: f } = de.getState();
            d && f({
              library: s,
              renderer: c
            });
          }
          n();
        },
        searchableText: "Redo repeat forward"
      },
      {
        id: "edit-copy",
        type: "command",
        name: "Edit: Copy Selection",
        shortcut: {
          modifiers: [
            Ie.mod
          ],
          key: "C"
        },
        action: () => {
          const { library: s } = we.getState(), { selectedIds: c } = ae.getState();
          if (!s || c.size === 0) {
            n();
            return;
          }
          const d = mr(s, c);
          zn.getState().copy(d), n();
        },
        searchableText: "Copy selection clipboard"
      },
      {
        id: "edit-paste",
        type: "command",
        name: "Edit: Paste",
        shortcut: {
          modifiers: [
            Ie.mod
          ],
          key: "V"
        },
        action: () => {
          const { library: s, renderer: c } = we.getState();
          if (!s || !c || !zn.getState().hasContent) {
            n();
            return;
          }
          const d = new sc();
          de.getState().execute(d, {
            library: s,
            renderer: c
          }), n();
        },
        searchableText: "Paste clipboard"
      },
      {
        id: "edit-duplicate",
        type: "command",
        name: "Edit: Duplicate Selection",
        shortcut: {
          modifiers: [
            Ie.mod
          ],
          key: "B"
        },
        action: () => {
          const { library: s, renderer: c } = we.getState(), { selectedIds: d } = ae.getState();
          if (!s || !c || d.size === 0) {
            n();
            return;
          }
          const f = new cc([
            ...d
          ]);
          de.getState().execute(f, {
            library: s,
            renderer: c
          }), n();
        },
        searchableText: "Duplicate selection clone"
      },
      {
        id: "edit-delete",
        type: "command",
        name: "Edit: Delete Selection",
        shortcut: {
          key: Ie.backspace
        },
        action: () => {
          const { library: s, renderer: c } = we.getState(), { selectedIds: d } = ae.getState();
          if (!s || !c || d.size === 0) {
            n();
            return;
          }
          const f = new ic([
            ...d
          ]);
          de.getState().execute(f, {
            library: s,
            renderer: c
          }), n();
        },
        searchableText: "Delete selection remove"
      },
      {
        id: "edit-edit-selection",
        type: "command",
        name: "Edit: Edit Selection in Inspector",
        shortcut: {
          key: "E"
        },
        action: () => {
          ae.getState().selectedIds.size > 0 && ge.getState().requestInspectorFocus(), n();
        },
        searchableText: "Edit selection inspector properties focus"
      },
      {
        id: "edit-select-all",
        type: "command",
        name: "Edit: Select All",
        shortcut: {
          modifiers: [
            Ie.mod
          ],
          key: "A"
        },
        action: () => {
          const { library: s } = we.getState();
          if (!s) {
            n();
            return;
          }
          const c = s.get_all_ids();
          ae.getState().selectAll(c), n();
        },
        searchableText: "Select all elements"
      },
      {
        id: "edit-text-to-polygons",
        type: "command",
        name: "Edit: Convert Text to Polygons",
        action: () => {
          const { selectedIds: s } = ae.getState(), { library: c, renderer: d } = we.getState();
          if (!c || !d || s.size === 0) {
            n();
            return;
          }
          const f = [
            ...s
          ].filter((p) => c.is_text_element(p));
          if (f.length === 0) {
            n();
            return;
          }
          const m = new k0(f);
          de.getState().execute(m, {
            library: c,
            renderer: d
          }), n();
        },
        searchableText: "Convert text to polygons outline vectorize font"
      },
      {
        id: "layer-add",
        type: "layer",
        name: "Layer: Add",
        action: () => {
          const { library: s, renderer: c } = we.getState();
          if (!s || !c) {
            n();
            return;
          }
          const d = new p0();
          de.getState().execute(d, {
            library: s,
            renderer: c
          }), n();
        },
        searchableText: "Add new layer create"
      },
      {
        id: "layer-delete",
        type: "layer",
        name: "Layer: Delete Active",
        action: () => {
          const { library: s, renderer: c } = we.getState(), { activeLayerId: d, layers: f } = ye.getState();
          if (!s || !c || f.size <= 1) {
            n();
            return;
          }
          const m = new y0(d);
          de.getState().execute(m, {
            library: s,
            renderer: c
          }), n();
        },
        searchableText: "Delete active layer remove"
      },
      {
        id: "layer-edit",
        type: "layer",
        name: "Layer: Edit Active",
        action: () => {
          const { activeLayerId: s } = ye.getState();
          ye.getState().setExpandedLayerId(s), ge.getState().setSidebarTab("layers"), n();
        },
        searchableText: "Edit active layer color fill pattern properties"
      },
      {
        id: "layer-rename",
        type: "layer",
        name: "Layer: Rename Active",
        action: () => {
          const { activeLayerId: s } = ye.getState();
          ye.getState().setEditingLayerId(s), n();
        },
        searchableText: "Rename active layer"
      },
      {
        id: "layer-toggle-visibility",
        type: "layer",
        name: "Layer: Toggle Active Visibility",
        action: () => {
          const { activeLayerId: s } = ye.getState();
          ye.getState().toggleVisibility(s), n();
        },
        searchableText: "Toggle active layer visibility show hide"
      },
      {
        id: "layer-show-all",
        type: "layer",
        name: "Layer: Show All",
        action: () => {
          ye.getState().showAllLayers(), n();
        },
        searchableText: "Show all layers visible"
      },
      {
        id: "layer-hide-all",
        type: "layer",
        name: "Layer: Hide All",
        action: () => {
          ye.getState().hideAllLayers(), n();
        },
        searchableText: "Hide all layers invisible"
      },
      ...ye.getState().getAllLayers().map((s) => ({
        id: `layer-activate-${s.id}`,
        type: "layer",
        name: `Layer: Set Active: ${s.name}`,
        color: s.color,
        action: () => {
          ye.getState().setActiveLayer(s.id), n();
        },
        searchableText: `Layer set active ${s.name} switch`
      })),
      {
        id: "cell-add",
        type: "cell",
        name: "Cell: Add",
        action: () => {
          const { library: s, renderer: c } = we.getState();
          if (!s || !c) {
            n();
            return;
          }
          const d = me.getState().cells;
          let f = 1, m = `cell${f}`;
          for (; d.includes(m); ) f++, m = `cell${f}`;
          const p = new GS(m);
          de.getState().execute(p, {
            library: s,
            renderer: c
          }), n();
        },
        searchableText: "Add new cell create"
      },
      {
        id: "cell-delete",
        type: "cell",
        name: "Cell: Delete Active",
        action: () => {
          const { library: s, renderer: c } = we.getState(), { activeCell: d, cells: f } = me.getState();
          if (!s || !c || !d || f.length <= 1) {
            n();
            return;
          }
          const m = new v0(d);
          de.getState().execute(m, {
            library: s,
            renderer: c
          }), n();
        },
        searchableText: "Delete active cell remove"
      },
      {
        id: "cell-rename",
        type: "cell",
        name: "Cell: Rename Active",
        action: () => {
          const { activeCell: s } = me.getState();
          s && me.getState().setEditingCellName(s), n();
        },
        searchableText: "Rename active cell"
      },
      {
        id: "cell-change-origin",
        type: "cell",
        name: "Cell: Change Origin",
        action: () => {
          ae.getState().clearSelection(), ge.getState().requestInspectorFocusField("X"), n();
        },
        searchableText: "Cell change origin position offset set move"
      },
      {
        id: "cell-toggle-visibility",
        type: "cell",
        name: "Cell: Toggle Active Visibility",
        action: () => {
          const { activeCell: s } = me.getState();
          s && me.getState().toggleCellVisibility(s), n();
        },
        searchableText: "Toggle cell visibility hide show active"
      },
      {
        id: "cell-show-all",
        type: "cell",
        name: "Cell: Show All",
        action: () => {
          me.getState().showAllCells(), n();
        },
        searchableText: "Show all cells visible unhide"
      },
      {
        id: "cell-hide-all",
        type: "cell",
        name: "Cell: Hide All",
        action: () => {
          me.getState().hideAllCells(), n();
        },
        searchableText: "Hide all cells invisible"
      },
      ...me.getState().cells.map((s) => ({
        id: `cell-activate-${s}`,
        type: "cell",
        name: `Cell: Set Active: ${s}`,
        action: () => {
          me.getState().setActiveCell(s), n();
        },
        searchableText: `Cell set active ${s} switch`
      })),
      ...me.getState().cells.filter((s) => s !== me.getState().activeCell).map((s) => ({
        id: `cell-instance-${s}`,
        type: "cell",
        name: `Cell: Add Instance: ${s}`,
        action: () => {
          const { library: c, renderer: d } = we.getState(), f = me.getState().activeCell;
          if (!c || !d || !f) {
            n();
            return;
          }
          if (!c.can_instance_cell(f, s)) {
            n();
            return;
          }
          const { zoom: m, offset: p } = Oe.getState(), v = window.innerWidth / 2, b = window.innerHeight / 2, w = (v - p.x) / m, E = (b - p.y) / m, k = new w0(s, w, E);
          de.getState().execute(k, {
            library: c,
            renderer: d
          }), n();
        },
        searchableText: `Cell add instance ${s} place ref reference`
      })),
      {
        id: "hierarchy-set-max-level",
        type: "command",
        name: "Hierarchy: Show All Levels",
        action: () => {
          const { setHierarchyLevelLimit: s } = me.getState();
          s(1 / 0), n();
        },
        searchableText: "Hierarchy show all levels max depth expand full"
      },
      {
        id: "hierarchy-set-level",
        type: "command",
        name: "Hierarchy: Set Level",
        action: () => {
          n(), requestAnimationFrame(() => {
            const s = document.getElementById("hierarchy-level-input");
            s && (s.focus(), s.select());
          });
        },
        searchableText: "Hierarchy set level depth limit change"
      },
      ...T_(n),
      ...N_(n)
    ];
  }
  const R_ = [
    {
      id: "align-left",
      name: "Align Left",
      search: "Align left edges"
    },
    {
      id: "align-center-h",
      name: "Align Center Horizontally",
      search: "Align center horizontal middle"
    },
    {
      id: "align-right",
      name: "Align Right",
      search: "Align right edges"
    },
    {
      id: "align-top",
      name: "Align Top",
      search: "Align top edges"
    },
    {
      id: "align-center-v",
      name: "Align Center Vertically",
      search: "Align center vertical middle"
    },
    {
      id: "align-bottom",
      name: "Align Bottom",
      search: "Align bottom edges"
    },
    {
      id: "center-align",
      name: "Center Align",
      search: "Center align both axes"
    },
    {
      id: "origin-align",
      name: "Align to Origin",
      search: "Origin align center zero"
    }
  ], A_ = [
    {
      id: "union",
      name: "Union",
      search: "Boolean union merge combine"
    },
    {
      id: "subtract",
      name: "Subtract",
      search: "Boolean subtract difference cut"
    },
    {
      id: "intersect",
      name: "Intersect",
      search: "Boolean intersect overlap common"
    },
    {
      id: "xor",
      name: "Exclude (XOR)",
      search: "Boolean exclude xor symmetric difference"
    }
  ];
  function T_(l) {
    return A_.map((n) => ({
      id: `boolean-${n.id}`,
      type: "command",
      name: `Boolean: ${n.name}`,
      action: () => {
        const { library: r, renderer: o } = we.getState();
        if (!r || !o) {
          l();
          return;
        }
        const { selectedIds: s, lastSelectedId: c } = ae.getState();
        if (s.size < 2) {
          l();
          return;
        }
        const d = [
          ...s
        ], f = c ?? d[0], m = new j0(d, n.id, f);
        de.getState().execute(m, {
          library: r,
          renderer: o
        }), l();
      },
      searchableText: n.search
    }));
  }
  function N_(l) {
    return R_.map((n) => ({
      id: `align-${n.id}`,
      type: "command",
      name: `Align: ${n.name}`,
      action: () => {
        const { library: r, renderer: o } = we.getState();
        if (!r || !o) {
          l();
          return;
        }
        const { selectedIds: s, lastSelectedId: c } = ae.getState();
        if (s.size === 0) {
          l();
          return;
        }
        if (n.id !== "origin-align" && s.size < 2) {
          l();
          return;
        }
        const d = new M0(new Set(s), c, n.id);
        de.getState().execute(d, {
          library: r,
          renderer: o
        }), l();
      },
      searchableText: n.search
    }));
  }
  function O_({ shortcut: l }) {
    var _a;
    const r = ge((s) => s.theme) === "dark", o = Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", r ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10");
    return y.jsxs("span", {
      className: "flex items-center gap-0.5",
      children: [
        (_a = l.modifiers) == null ? void 0 : _a.map((s, c) => y.jsx("kbd", {
          className: o,
          children: s
        }, c)),
        y.jsx("kbd", {
          className: o,
          children: l.key
        }),
        l.then && y.jsxs(y.Fragment, {
          children: [
            y.jsx("span", {
              className: Y("px-1 text-[11px]", r ? "text-white/50" : "text-gray-500"),
              children: "then"
            }),
            y.jsx("kbd", {
              className: o,
              children: l.then
            })
          ]
        })
      ]
    });
  }
  function D_({ item: l }) {
    const r = ge((o) => o.theme) === "dark";
    return y.jsxs(Uo.Item, {
      value: l.searchableText,
      onSelect: l.action,
      className: Y("flex cursor-pointer items-center justify-between rounded-lg px-3 py-2", r ? "text-white/80 aria-selected:bg-[rgb(54,54,54)] aria-selected:text-white" : "text-gray-700 aria-selected:bg-[rgb(217,217,217)] aria-selected:text-gray-900"),
      children: [
        y.jsx("span", {
          className: "text-sm",
          children: l.name
        }),
        l.color && y.jsx("span", {
          className: Y("inline-block h-3.5 w-3.5 shrink-0 rounded border", r ? "border-white/15" : "border-black/15"),
          style: {
            backgroundColor: l.color
          }
        }),
        l.shortcut && y.jsx(O_, {
          shortcut: l.shortcut
        })
      ]
    });
  }
  function yb() {
    const n = ge((b) => b.theme) === "dark", r = nn((b) => b.isOpen), o = nn((b) => b.close);
    uc("command-palette", r);
    const [s, c] = g.useState(""), d = g.useRef(null), f = g.useMemo(() => L_(), [
      r
    ]), m = g.useMemo(() => {
      const b = s.toLowerCase();
      return f.filter((w) => w.searchableText.toLowerCase().includes(b));
    }, [
      f,
      s
    ]), p = g.useMemo(() => [
      ...m
    ].sort((b, w) => b.name.localeCompare(w.name)), [
      m
    ]), v = g.useCallback((b) => {
      const w = b.target;
      w instanceof Node && d.current && !d.current.contains(w) && o();
    }, [
      o
    ]);
    return g.useEffect(() => {
      if (!r) {
        c("");
        return;
      }
      return c(nn.getState().initialSearch), document.addEventListener("mousedown", v), () => {
        document.removeEventListener("mousedown", v);
      };
    }, [
      r,
      v
    ]), r ? y.jsx("div", {
      className: "fixed inset-0 z-[200]",
      children: y.jsx(Uo, {
        className: "fixed inset-0 flex items-start justify-center px-4 pt-[min(15vh,120px)]",
        shouldFilter: false,
        loop: true,
        label: "Command Menu",
        onKeyDown: (b) => {
          b.key === "Escape" && (b.preventDefault(), o());
        },
        children: y.jsxs("div", {
          ref: d,
          className: Y("w-full max-w-[560px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          children: [
            y.jsx(Uo.Input, {
              value: s,
              onValueChange: c,
              placeholder: "Type a command or search...",
              className: Y("w-full border-b bg-transparent px-4 py-3 text-sm outline-none", n ? "border-white/10 text-white/90 placeholder:text-white/50" : "border-black/10 text-gray-900 placeholder:text-gray-500"),
              autoFocus: true
            }),
            y.jsxs(Uo.List, {
              className: "max-h-[320px] overflow-y-auto p-1",
              onWheel: (b) => b.stopPropagation(),
              children: [
                y.jsx(Uo.Empty, {
                  className: Y("px-3 py-2 text-sm", n ? "text-white/50" : "text-gray-500"),
                  children: "No matching commands"
                }),
                p.map((b) => y.jsx(D_, {
                  item: b
                }, b.id))
              ]
            })
          ]
        })
      })
    }) : null;
  }
  const et = Oa.createContext({});
  var I_ = Object.defineProperty, bb = Object.getOwnPropertySymbols, z_ = Object.prototype.hasOwnProperty, H_ = Object.prototype.propertyIsEnumerable, vb = (l, n, r) => n in l ? I_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Qd = (l, n) => {
    for (var r in n || (n = {})) z_.call(n, r) && vb(l, r, n[r]);
    if (bb) for (var r of bb(n)) H_.call(n, r) && vb(l, r, n[r]);
    return l;
  };
  const U_ = (l, n) => {
    const r = g.useContext(et), o = Qd(Qd({}, r), l);
    return g.createElement("svg", Qd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M12 22L12 2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M19 16H5C3.89543 16 3 15.1046 3 14L3 10C3 8.89543 3.89543 8 5 8H19C20.1046 8 21 8.89543 21 10V14C21 15.1046 20.1046 16 19 16Z",
      stroke: "currentColor"
    }));
  }, Y_ = g.forwardRef(U_);
  var B_ = Y_, X_ = Object.defineProperty, xb = Object.getOwnPropertySymbols, V_ = Object.prototype.hasOwnProperty, $_ = Object.prototype.propertyIsEnumerable, wb = (l, n, r) => n in l ? X_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Fd = (l, n) => {
    for (var r in n || (n = {})) V_.call(n, r) && wb(l, r, n[r]);
    if (xb) for (var r of xb(n)) $_.call(n, r) && wb(l, r, n[r]);
    return l;
  };
  const q_ = (l, n) => {
    const r = g.useContext(et), o = Fd(Fd({}, r), l);
    return g.createElement("svg", Fd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M22 12L2 12",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 19V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V19C16 20.1046 15.1046 21 14 21H10C8.89543 21 8 20.1046 8 19Z",
      stroke: "currentColor"
    }));
  }, G_ = g.forwardRef(q_);
  var P_ = G_, Z_ = Object.defineProperty, Sb = Object.getOwnPropertySymbols, K_ = Object.prototype.hasOwnProperty, Q_ = Object.prototype.propertyIsEnumerable, Cb = (l, n, r) => n in l ? Z_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Wd = (l, n) => {
    for (var r in n || (n = {})) K_.call(n, r) && Cb(l, r, n[r]);
    if (Sb) for (var r of Sb(n)) Q_.call(n, r) && Cb(l, r, n[r]);
    return l;
  };
  const F_ = (l, n) => {
    const r = g.useContext(et), o = Wd(Wd({}, r), l);
    return g.createElement("svg", Wd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M3 21L3 3L9 3V15L21 15V21H3Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M13 19V21",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), g.createElement("path", {
      d: "M9 19V21",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), g.createElement("path", {
      d: "M3 7H5",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), g.createElement("path", {
      d: "M3 11H5",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), g.createElement("path", {
      d: "M3 15H5",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), g.createElement("path", {
      d: "M17 19V21",
      stroke: "currentColor",
      strokeLinecap: "round"
    }));
  }, W_ = g.forwardRef(F_);
  var J_ = W_, e4 = Object.defineProperty, Eb = Object.getOwnPropertySymbols, t4 = Object.prototype.hasOwnProperty, n4 = Object.prototype.propertyIsEnumerable, _b = (l, n, r) => n in l ? e4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Jd = (l, n) => {
    for (var r in n || (n = {})) t4.call(n, r) && _b(l, r, n[r]);
    if (Eb) for (var r of Eb(n)) n4.call(n, r) && _b(l, r, n[r]);
    return l;
  };
  const l4 = (l, n) => {
    const r = g.useContext(et), o = Jd(Jd({}, r), l);
    return g.createElement("svg", Jd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M4 16.01L4.01 15.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4 20.01L4.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4 8.01L4.01 7.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4 4.01L4.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4 12.01L4.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 20.01L8.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 20.01L12.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M16 20.01L16.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 20.01L20.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 16.01L20.01 15.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 12.01L20.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 8.01L20.01 7.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 4.01L20.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M16 4.01L16.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 4.01L12.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 4.01L8.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 16V8H16V16H8Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, r4 = g.forwardRef(l4);
  var a4 = r4, o4 = Object.defineProperty, kb = Object.getOwnPropertySymbols, i4 = Object.prototype.hasOwnProperty, s4 = Object.prototype.propertyIsEnumerable, Mb = (l, n, r) => n in l ? o4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, ef = (l, n) => {
    for (var r in n || (n = {})) i4.call(n, r) && Mb(l, r, n[r]);
    if (kb) for (var r of kb(n)) s4.call(n, r) && Mb(l, r, n[r]);
    return l;
  };
  const c4 = (l, n) => {
    const r = g.useContext(et), o = ef(ef({}, r), l);
    return g.createElement("svg", ef({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M22 21L2 21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 15V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V15C16 16.1046 15.1046 17 14 17H10C8.89543 17 8 16.1046 8 15Z",
      stroke: "currentColor"
    }));
  }, u4 = g.forwardRef(c4);
  var d4 = u4, f4 = Object.defineProperty, jb = Object.getOwnPropertySymbols, h4 = Object.prototype.hasOwnProperty, m4 = Object.prototype.propertyIsEnumerable, Lb = (l, n, r) => n in l ? f4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, tf = (l, n) => {
    for (var r in n || (n = {})) h4.call(n, r) && Lb(l, r, n[r]);
    if (jb) for (var r of jb(n)) m4.call(n, r) && Lb(l, r, n[r]);
    return l;
  };
  const g4 = (l, n) => {
    const r = g.useContext(et), o = tf(tf({}, r), l);
    return g.createElement("svg", tf({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M3 22L3 2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M19 16H9C7.89543 16 7 15.1046 7 14V10C7 8.89543 7.89543 8 9 8H19C20.1046 8 21 8.89543 21 10V14C21 15.1046 20.1046 16 19 16Z",
      stroke: "currentColor"
    }));
  }, p4 = g.forwardRef(g4);
  var y4 = p4, b4 = Object.defineProperty, Rb = Object.getOwnPropertySymbols, v4 = Object.prototype.hasOwnProperty, x4 = Object.prototype.propertyIsEnumerable, Ab = (l, n, r) => n in l ? b4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, nf = (l, n) => {
    for (var r in n || (n = {})) v4.call(n, r) && Ab(l, r, n[r]);
    if (Rb) for (var r of Rb(n)) x4.call(n, r) && Ab(l, r, n[r]);
    return l;
  };
  const w4 = (l, n) => {
    const r = g.useContext(et), o = nf(nf({}, r), l);
    return g.createElement("svg", nf({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M21 22V2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M15 16H5C3.89543 16 3 15.1046 3 14L3 10C3 8.89543 3.89543 8 5 8H15C16.1046 8 17 8.89543 17 10V14C17 15.1046 16.1046 16 15 16Z",
      stroke: "currentColor"
    }));
  }, S4 = g.forwardRef(w4);
  var C4 = S4, E4 = Object.defineProperty, Tb = Object.getOwnPropertySymbols, _4 = Object.prototype.hasOwnProperty, k4 = Object.prototype.propertyIsEnumerable, Nb = (l, n, r) => n in l ? E4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, lf = (l, n) => {
    for (var r in n || (n = {})) _4.call(n, r) && Nb(l, r, n[r]);
    if (Tb) for (var r of Tb(n)) k4.call(n, r) && Nb(l, r, n[r]);
    return l;
  };
  const M4 = (l, n) => {
    const r = g.useContext(et), o = lf(lf({}, r), l);
    return g.createElement("svg", lf({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M22 3L2 3",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 19V9C8 7.89543 8.89543 7 10 7H14C15.1046 7 16 7.89543 16 9V19C16 20.1046 15.1046 21 14 21H10C8.89543 21 8 20.1046 8 19Z",
      stroke: "currentColor"
    }));
  }, j4 = g.forwardRef(M4);
  var L4 = j4, R4 = Object.defineProperty, Ob = Object.getOwnPropertySymbols, A4 = Object.prototype.hasOwnProperty, T4 = Object.prototype.propertyIsEnumerable, Db = (l, n, r) => n in l ? R4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, rf = (l, n) => {
    for (var r in n || (n = {})) A4.call(n, r) && Db(l, r, n[r]);
    if (Ob) for (var r of Ob(n)) T4.call(n, r) && Db(l, r, n[r]);
    return l;
  };
  const N4 = (l, n) => {
    const r = g.useContext(et), o = rf(rf({}, r), l);
    return g.createElement("svg", rf({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M5.21173 15.1113L2.52473 12.4243C2.29041 12.1899 2.29041 11.8101 2.52473 11.5757L5.21173 8.88873C5.44605 8.65442 5.82595 8.65442 6.06026 8.88873L8.74727 11.5757C8.98158 11.8101 8.98158 12.1899 8.74727 12.4243L6.06026 15.1113C5.82595 15.3456 5.44605 15.3456 5.21173 15.1113Z",
      stroke: "currentColor"
    }), g.createElement("path", {
      d: "M11.5757 21.475L8.88874 18.788C8.65443 18.5537 8.65443 18.1738 8.88874 17.9395L11.5757 15.2525C11.8101 15.0182 12.19 15.0182 12.4243 15.2525L15.1113 17.9395C15.3456 18.1738 15.3456 18.5537 15.1113 18.788L12.4243 21.475C12.19 21.7094 11.8101 21.7094 11.5757 21.475Z",
      stroke: "currentColor"
    }), g.createElement("path", {
      d: "M11.5757 8.7475L8.88874 6.06049C8.65443 5.82618 8.65443 5.44628 8.88874 5.21197L11.5757 2.52496C11.8101 2.29065 12.19 2.29065 12.4243 2.52496L15.1113 5.21197C15.3456 5.44628 15.3456 5.82618 15.1113 6.06049L12.4243 8.7475C12.19 8.98181 11.8101 8.98181 11.5757 8.7475Z",
      stroke: "currentColor"
    }), g.createElement("path", {
      d: "M17.9396 15.1113L15.2526 12.4243C15.0183 12.1899 15.0183 11.8101 15.2526 11.5757L17.9396 8.88873C18.174 8.65442 18.5539 8.65442 18.7882 8.88873L21.4752 11.5757C21.7095 11.8101 21.7095 12.1899 21.4752 12.4243L18.7882 15.1113C18.5539 15.3456 18.174 15.3456 17.9396 15.1113Z",
      stroke: "currentColor"
    }));
  }, O4 = g.forwardRef(N4);
  var D4 = O4, I4 = Object.defineProperty, Ib = Object.getOwnPropertySymbols, z4 = Object.prototype.hasOwnProperty, H4 = Object.prototype.propertyIsEnumerable, zb = (l, n, r) => n in l ? I4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, af = (l, n) => {
    for (var r in n || (n = {})) z4.call(n, r) && zb(l, r, n[r]);
    if (Ib) for (var r of Ib(n)) H4.call(n, r) && zb(l, r, n[r]);
    return l;
  };
  const U4 = (l, n) => {
    const r = g.useContext(et), o = af(af({}, r), l);
    return g.createElement("svg", af({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M12 12L4 4M4 4V8M4 4H8",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 12L20 4M20 4V8M20 4H16",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 12L4 20M4 20V16M4 20H8",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 12L20 20M20 20V16M20 20H16",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, Y4 = g.forwardRef(U4);
  var dh = Y4, B4 = Object.defineProperty, Hb = Object.getOwnPropertySymbols, X4 = Object.prototype.hasOwnProperty, V4 = Object.prototype.propertyIsEnumerable, Ub = (l, n, r) => n in l ? B4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, of = (l, n) => {
    for (var r in n || (n = {})) X4.call(n, r) && Ub(l, r, n[r]);
    if (Hb) for (var r of Hb(n)) V4.call(n, r) && Ub(l, r, n[r]);
    return l;
  };
  const $4 = (l, n) => {
    const r = g.useContext(et), o = of(of({}, r), l);
    return g.createElement("svg", of({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M3 20C11 20 21 4 21 4",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, q4 = g.forwardRef($4);
  var w1 = q4, G4 = Object.defineProperty, Yb = Object.getOwnPropertySymbols, P4 = Object.prototype.hasOwnProperty, Z4 = Object.prototype.propertyIsEnumerable, Bb = (l, n, r) => n in l ? G4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, sf = (l, n) => {
    for (var r in n || (n = {})) P4.call(n, r) && Bb(l, r, n[r]);
    if (Yb) for (var r of Yb(n)) Z4.call(n, r) && Bb(l, r, n[r]);
    return l;
  };
  const K4 = (l, n) => {
    const r = g.useContext(et), o = sf(sf({}, r), l);
    return g.createElement("svg", sf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M10.5 15H9.6C9.26863 15 9 15.2686 9 15.6V20.4C9 20.7314 9.26863 21 9.6 21H20.4C20.7314 21 21 20.7314 21 20.4V9.6C21 9.26863 20.7314 9 20.4 9H15.6C15.2686 9 15 9.26863 15 9.6V10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M13.5 15H14.4C14.7314 15 15 14.7314 15 14.4V13.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M9 13.5V14.4C9 14.7314 8.73137 15 8.4 15H3.6C3.26863 15 3 14.7314 3 14.4V3.6C3 3.26863 3.26863 3 3.6 3H14.4C14.7314 3 15 3.26863 15 3.6V8.4C15 8.73137 14.7314 9 14.4 9H13.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M9 10.5V9.6C9 9.26863 9.26863 9 9.6 9H10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, Q4 = g.forwardRef(K4);
  var F4 = Q4, W4 = Object.defineProperty, Xb = Object.getOwnPropertySymbols, J4 = Object.prototype.hasOwnProperty, ek = Object.prototype.propertyIsEnumerable, Vb = (l, n, r) => n in l ? W4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, cf = (l, n) => {
    for (var r in n || (n = {})) J4.call(n, r) && Vb(l, r, n[r]);
    if (Xb) for (var r of Xb(n)) ek.call(n, r) && Vb(l, r, n[r]);
    return l;
  };
  const tk = (l, n) => {
    const r = g.useContext(et), o = cf(cf({}, r), l);
    return g.createElement("svg", cf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M21 13.5V16.5M13.5 21H16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M16.5 9H9.6C9.26863 9 9 9.26863 9 9.6V16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M10.5 21H9.6C9.26863 21 9 20.7314 9 20.4V19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M21 19.5V20.4C21 20.7314 20.7314 21 20.4 21H19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M19.5 9H20.4C20.7314 9 21 9.26863 21 9.6V10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M3 10.5V7.5M7.5 3H10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M7.5 15H14.4C14.7314 15 15 14.7314 15 14.4V7.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4.5 15H3.6C3.26863 15 3 14.7314 3 14.4V13.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M3 4.5V3.6C3 3.26863 3.26863 3 3.6 3H4.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M13.5 3H14.4C14.7314 3 15 3.26863 15 3.6V4.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, nk = g.forwardRef(tk);
  var lk = nk, rk = Object.defineProperty, $b = Object.getOwnPropertySymbols, ak = Object.prototype.hasOwnProperty, ok = Object.prototype.propertyIsEnumerable, qb = (l, n, r) => n in l ? rk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, uf = (l, n) => {
    for (var r in n || (n = {})) ak.call(n, r) && qb(l, r, n[r]);
    if ($b) for (var r of $b(n)) ok.call(n, r) && qb(l, r, n[r]);
    return l;
  };
  const ik = (l, n) => {
    const r = g.useContext(et), o = uf(uf({}, r), l);
    return g.createElement("svg", uf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M3 5H21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M3 12H21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M3 19H21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, sk = g.forwardRef(ik);
  var ck = sk, uk = Object.defineProperty, Gb = Object.getOwnPropertySymbols, dk = Object.prototype.hasOwnProperty, fk = Object.prototype.propertyIsEnumerable, Pb = (l, n, r) => n in l ? uk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, df = (l, n) => {
    for (var r in n || (n = {})) dk.call(n, r) && Pb(l, r, n[r]);
    if (Gb) for (var r of Gb(n)) fk.call(n, r) && Pb(l, r, n[r]);
    return l;
  };
  const hk = (l, n) => {
    const r = g.useContext(et), o = df(df({}, r), l);
    return g.createElement("svg", df({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M20 12.5C20.2761 12.5 20.5 12.2761 20.5 12C20.5 11.7239 20.2761 11.5 20 11.5C19.7239 11.5 19.5 11.7239 19.5 12C19.5 12.2761 19.7239 12.5 20 12.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4 12.5C4.27614 12.5 4.5 12.2761 4.5 12C4.5 11.7239 4.27614 11.5 4 11.5C3.72386 11.5 3.5 11.7239 3.5 12C3.5 12.2761 3.72386 12.5 4 12.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, mk = g.forwardRef(hk);
  var gk = mk, pk = Object.defineProperty, Zb = Object.getOwnPropertySymbols, yk = Object.prototype.hasOwnProperty, bk = Object.prototype.propertyIsEnumerable, Kb = (l, n, r) => n in l ? pk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, ff = (l, n) => {
    for (var r in n || (n = {})) yk.call(n, r) && Kb(l, r, n[r]);
    if (Zb) for (var r of Zb(n)) bk.call(n, r) && Kb(l, r, n[r]);
    return l;
  };
  const vk = (l, n) => {
    const r = g.useContext(et), o = ff(ff({}, r), l);
    return g.createElement("svg", ff({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M15 6L9 12L15 18",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, xk = g.forwardRef(vk);
  var wk = xk, Sk = Object.defineProperty, Qb = Object.getOwnPropertySymbols, Ck = Object.prototype.hasOwnProperty, Ek = Object.prototype.propertyIsEnumerable, Fb = (l, n, r) => n in l ? Sk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, hf = (l, n) => {
    for (var r in n || (n = {})) Ck.call(n, r) && Fb(l, r, n[r]);
    if (Qb) for (var r of Qb(n)) Ek.call(n, r) && Fb(l, r, n[r]);
    return l;
  };
  const _k = (l, n) => {
    const r = g.useContext(et), o = hf(hf({}, r), l);
    return g.createElement("svg", hf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M9 6L15 12L9 18",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, kk = g.forwardRef(_k);
  var S1 = kk, Mk = Object.defineProperty, Wb = Object.getOwnPropertySymbols, jk = Object.prototype.hasOwnProperty, Lk = Object.prototype.propertyIsEnumerable, Jb = (l, n, r) => n in l ? Mk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, mf = (l, n) => {
    for (var r in n || (n = {})) jk.call(n, r) && Jb(l, r, n[r]);
    if (Wb) for (var r of Wb(n)) Lk.call(n, r) && Jb(l, r, n[r]);
    return l;
  };
  const Rk = (l, n) => {
    const r = g.useContext(et), o = mf(mf({}, r), l);
    return g.createElement("svg", mf({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M18 16.5V3M18 3L21.5 6.5M18 3L14.5 6.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M18 16.5C18 18.433 16.433 20 14.5 20C12.567 20 11 18.433 11 16.5V7.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M11 7.5C11 5.567 9.433 4 7.5 4C5.567 4 4 5.567 4 7.5V19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, Ak = g.forwardRef(Rk);
  var Tk = Ak, Nk = Object.defineProperty, ev = Object.getOwnPropertySymbols, Ok = Object.prototype.hasOwnProperty, Dk = Object.prototype.propertyIsEnumerable, tv = (l, n, r) => n in l ? Nk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, gf = (l, n) => {
    for (var r in n || (n = {})) Ok.call(n, r) && tv(l, r, n[r]);
    if (ev) for (var r of ev(n)) Dk.call(n, r) && tv(l, r, n[r]);
    return l;
  };
  const Ik = (l, n) => {
    const r = g.useContext(et), o = gf(gf({}, r), l);
    return g.createElement("svg", gf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M11.6473 2.25623C11.8576 2.10344 12.1424 2.10344 12.3527 2.25623L22.1089 9.34458C22.3192 9.49737 22.4072 9.76819 22.3269 10.0154L18.6003 21.4846C18.52 21.7318 18.2896 21.8992 18.0297 21.8992H5.97029C5.71035 21.8992 5.47998 21.7318 5.39965 21.4846L1.67309 10.0154C1.59276 9.76819 1.68076 9.49737 1.89105 9.34458L11.6473 2.25623Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, zk = g.forwardRef(Ik);
  var Hk = zk, Uk = Object.defineProperty, nv = Object.getOwnPropertySymbols, Yk = Object.prototype.hasOwnProperty, Bk = Object.prototype.propertyIsEnumerable, lv = (l, n, r) => n in l ? Uk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, pf = (l, n) => {
    for (var r in n || (n = {})) Yk.call(n, r) && lv(l, r, n[r]);
    if (nv) for (var r of nv(n)) Bk.call(n, r) && lv(l, r, n[r]);
    return l;
  };
  const Xk = (l, n) => {
    const r = g.useContext(et), o = pf(pf({}, r), l);
    return g.createElement("svg", pf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M9 12H12M15 12H12M12 12V9M12 12V15",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, Vk = g.forwardRef(Xk);
  var C1 = Vk, $k = Object.defineProperty, rv = Object.getOwnPropertySymbols, qk = Object.prototype.hasOwnProperty, Gk = Object.prototype.propertyIsEnumerable, av = (l, n, r) => n in l ? $k(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, yf = (l, n) => {
    for (var r in n || (n = {})) qk.call(n, r) && av(l, r, n[r]);
    if (rv) for (var r of rv(n)) Gk.call(n, r) && av(l, r, n[r]);
    return l;
  };
  const Pk = (l, n) => {
    const r = g.useContext(et), o = yf(yf({}, r), l);
    return g.createElement("svg", yf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M4 16.01L4.01 15.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4 20.01L4.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4 8.01L4.01 7.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4 4.01L4.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4 12.01L4.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 12.01L12.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 20.01L8.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 20.01L12.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M16 20.01L16.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 20.01L20.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 16.01L20.01 15.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 12.01L20.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 8.01L20.01 7.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M20 4.01L20.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M16 4.01L16.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 4.01L12.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 4.01L8.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, Zk = g.forwardRef(Pk);
  var Kk = Zk, Qk = Object.defineProperty, ov = Object.getOwnPropertySymbols, Fk = Object.prototype.hasOwnProperty, Wk = Object.prototype.propertyIsEnumerable, iv = (l, n, r) => n in l ? Qk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, bf = (l, n) => {
    for (var r in n || (n = {})) Fk.call(n, r) && iv(l, r, n[r]);
    if (ov) for (var r of ov(n)) Wk.call(n, r) && iv(l, r, n[r]);
    return l;
  };
  const Jk = (l, n) => {
    const r = g.useContext(et), o = bf(bf({}, r), l);
    return g.createElement("svg", bf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 19V21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M5 12H3",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 5V3",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M19 12H21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, eM = g.forwardRef(Jk);
  var tM = eM, nM = Object.defineProperty, sv = Object.getOwnPropertySymbols, lM = Object.prototype.hasOwnProperty, rM = Object.prototype.propertyIsEnumerable, cv = (l, n, r) => n in l ? nM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, vf = (l, n) => {
    for (var r in n || (n = {})) lM.call(n, r) && cv(l, r, n[r]);
    if (sv) for (var r of sv(n)) rM.call(n, r) && cv(l, r, n[r]);
    return l;
  };
  const aM = (l, n) => {
    const r = g.useContext(et), o = vf(vf({}, r), l);
    return g.createElement("svg", vf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M16 7V2.6C16 2.26863 15.7314 2 15.4 2H8.6C8.26863 2 8 2.26863 8 2.6V21.4C8 21.7314 8.26863 22 8.6 22H15.4C15.7314 22 16 21.7314 16 21.4V17M16 7H13M16 7V12M16 12H13M16 12V17M16 17H13",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, oM = g.forwardRef(aM);
  var E1 = oM, iM = Object.defineProperty, uv = Object.getOwnPropertySymbols, sM = Object.prototype.hasOwnProperty, cM = Object.prototype.propertyIsEnumerable, dv = (l, n, r) => n in l ? iM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, xf = (l, n) => {
    for (var r in n || (n = {})) sM.call(n, r) && dv(l, r, n[r]);
    if (uv) for (var r of uv(n)) cM.call(n, r) && dv(l, r, n[r]);
    return l;
  };
  const uM = (l, n) => {
    const r = g.useContext(et), o = xf(xf({}, r), l);
    return g.createElement("svg", xf({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M10 16L14 8",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, dM = g.forwardRef(uM);
  var _1 = dM, fM = Object.defineProperty, fv = Object.getOwnPropertySymbols, hM = Object.prototype.hasOwnProperty, mM = Object.prototype.propertyIsEnumerable, hv = (l, n, r) => n in l ? fM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, wf = (l, n) => {
    for (var r in n || (n = {})) hM.call(n, r) && hv(l, r, n[r]);
    if (fv) for (var r of fv(n)) mM.call(n, r) && hv(l, r, n[r]);
    return l;
  };
  const gM = (l, n) => {
    const r = g.useContext(et), o = wf(wf({}, r), l);
    return g.createElement("svg", wf({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z",
      stroke: "currentColor"
    }), g.createElement("path", {
      d: "M3 4C3.55228 4 4 3.55228 4 3C4 2.44772 3.55228 2 3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M21 22C21.5523 22 22 21.5523 22 21C22 20.4477 21.5523 20 21 20C20.4477 20 20 20.4477 20 21C20 21.5523 20.4477 22 21 22Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, pM = g.forwardRef(gM);
  var yM = pM, bM = Object.defineProperty, mv = Object.getOwnPropertySymbols, vM = Object.prototype.hasOwnProperty, xM = Object.prototype.propertyIsEnumerable, gv = (l, n, r) => n in l ? bM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Sf = (l, n) => {
    for (var r in n || (n = {})) vM.call(n, r) && gv(l, r, n[r]);
    if (mv) for (var r of mv(n)) xM.call(n, r) && gv(l, r, n[r]);
    return l;
  };
  const wM = (l, n) => {
    const r = g.useContext(et), o = Sf(Sf({}, r), l);
    return g.createElement("svg", Sf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M15 3.6V14.4C15 14.7314 14.7314 15 14.4 15H3.6C3.26863 15 3 14.7314 3 14.4V3.6C3 3.26863 3.26863 3 3.6 3H14.4C14.7314 3 15 3.26863 15 3.6Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M13.5 21H16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M21 13.5V16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M21 19.5V20.4C21 20.7314 20.7314 21 20.4 21H19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M10.5 21H9.6C9.26863 21 9 20.7314 9 20.4V19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M19.5 9H20.4C20.7314 9 21 9.26863 21 9.6V10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M16.5 9H9.6C9.26863 9 9 9.26863 9 9.6V16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, SM = g.forwardRef(wM);
  var CM = SM, EM = Object.defineProperty, pv = Object.getOwnPropertySymbols, _M = Object.prototype.hasOwnProperty, kM = Object.prototype.propertyIsEnumerable, yv = (l, n, r) => n in l ? EM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Cf = (l, n) => {
    for (var r in n || (n = {})) _M.call(n, r) && yv(l, r, n[r]);
    if (pv) for (var r of pv(n)) kM.call(n, r) && yv(l, r, n[r]);
    return l;
  };
  const MM = (l, n) => {
    const r = g.useContext(et), o = Cf(Cf({}, r), l);
    return g.createElement("svg", Cf({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M12 2V6",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 18V22",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M22 12H18",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M6 12H2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M4.92896 4.92896L7.75738 7.75738",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M16.2427 16.2427L19.0711 19.0711",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M19.071 4.92896L16.2426 7.75738",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M7.75732 16.2427L4.9289 19.0711",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, jM = g.forwardRef(MM);
  var LM = jM, RM = Object.defineProperty, bv = Object.getOwnPropertySymbols, AM = Object.prototype.hasOwnProperty, TM = Object.prototype.propertyIsEnumerable, vv = (l, n, r) => n in l ? RM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Ef = (l, n) => {
    for (var r in n || (n = {})) AM.call(n, r) && vv(l, r, n[r]);
    if (bv) for (var r of bv(n)) TM.call(n, r) && vv(l, r, n[r]);
    return l;
  };
  const NM = (l, n) => {
    const r = g.useContext(et), o = Ef(Ef({}, r), l);
    return g.createElement("svg", Ef({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M19 7V5L5 5V7",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M12 5L12 19M12 19H10M12 19H14",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, OM = g.forwardRef(NM);
  var DM = OM, IM = Object.defineProperty, xv = Object.getOwnPropertySymbols, zM = Object.prototype.hasOwnProperty, HM = Object.prototype.propertyIsEnumerable, wv = (l, n, r) => n in l ? IM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, _f = (l, n) => {
    for (var r in n || (n = {})) zM.call(n, r) && wv(l, r, n[r]);
    if (xv) for (var r of xv(n)) HM.call(n, r) && wv(l, r, n[r]);
    return l;
  };
  const UM = (l, n) => {
    const r = g.useContext(et), o = _f(_f({}, r), l);
    return g.createElement("svg", _f({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M15 9H20.4C20.7314 9 21 9.26863 21 9.6V20.4C21 20.7314 20.7314 21 20.4 21H9.6C9.26863 21 9 20.7314 9 20.4V15",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M15 9V3.6C15 3.26863 14.7314 3 14.4 3H3.6C3.26863 3 3 3.26863 3 3.6V14.4C3 14.7314 3.26863 15 3.6 15H9",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, YM = g.forwardRef(UM);
  var BM = YM, XM = Object.defineProperty, Sv = Object.getOwnPropertySymbols, VM = Object.prototype.hasOwnProperty, $M = Object.prototype.propertyIsEnumerable, Cv = (l, n, r) => n in l ? XM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, kf = (l, n) => {
    for (var r in n || (n = {})) VM.call(n, r) && Cv(l, r, n[r]);
    if (Sv) for (var r of Sv(n)) $M.call(n, r) && Cv(l, r, n[r]);
    return l;
  };
  const qM = (l, n) => {
    const r = g.useContext(et), o = kf(kf({}, r), l);
    return g.createElement("svg", kf({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, o), g.createElement("path", {
      d: "M8 11H11M14 11H11M11 11V8M11 11V14",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M17 17L21 21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, GM = g.forwardRef(qM);
  var fh = GM;
  const Us = {
    md: 768,
    lg: 1120
  };
  function k1() {
    if (typeof window > "u") return {
      isLg: true,
      isMd: false,
      isSm: false
    };
    const l = window.innerWidth;
    return {
      isLg: l >= Us.lg,
      isMd: l >= Us.md && l < Us.lg,
      isSm: l < Us.md
    };
  }
  let Yo = k1();
  const Pf = /* @__PURE__ */ new Set();
  function PM(l) {
    return Pf.add(l), () => Pf.delete(l);
  }
  function ZM() {
    return Yo;
  }
  if (typeof window < "u") {
    const l = () => {
      const n = k1();
      if (n.isLg !== Yo.isLg || n.isMd !== Yo.isMd || n.isSm !== Yo.isSm) {
        Yo = n;
        for (const r of Pf) r();
      }
    };
    window.addEventListener("resize", l);
  }
  function hh() {
    return g.useSyncExternalStore(PM, ZM, () => ({
      isLg: true,
      isMd: false,
      isSm: false
    }));
  }
  const KM = 8;
  function M1({ side: l, width: n, onResize: r }) {
    const [o, s] = g.useState(false), c = g.useRef(0), d = g.useRef(0), f = g.useCallback((v) => {
      const b = Math.max(Ys, Math.min(Bs, v));
      return Math.abs(b - Bo) <= KM ? Bo : Math.round(b);
    }, []), m = g.useCallback((v) => {
      if (v.button !== 0) return;
      v.preventDefault(), v.stopPropagation(), c.current = v.clientX, d.current = n, s(true), document.body.style.userSelect = "none", document.body.style.cursor = "col-resize";
      const b = (E) => {
        const k = E.clientX - c.current, S = l === "left" ? d.current + k : d.current - k;
        r(f(S));
      }, w = () => {
        document.removeEventListener("mousemove", b), document.removeEventListener("mouseup", w), document.body.style.userSelect = "", document.body.style.cursor = "", s(false);
      };
      document.addEventListener("mousemove", b), document.addEventListener("mouseup", w);
    }, [
      l,
      n,
      r,
      f
    ]), p = g.useCallback(() => {
      r(Bo);
    }, [
      r
    ]);
    return {
      handleProps: {
        onMouseDown: m,
        onDoubleClick: p,
        style: {
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 6,
          cursor: "col-resize",
          zIndex: 50,
          ...l === "left" ? {
            right: -3
          } : {
            left: -3
          }
        }
      },
      isResizing: o
    };
  }
  async function Zf(l) {
    const { emit: n } = await ut(async () => {
      const { emit: r } = await import("./event-BC8TvpKC.js");
      return {
        emit: r
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    await n("open-file", l);
  }
  async function Kf(l) {
    var _a;
    const n = we.getState().library;
    if (n) try {
      let r = null;
      if (l || (r = ((_a = Ke.getState().getActiveTab()) == null ? void 0 : _a.filePath) ?? null), r || (r = await Wv()), !r) return;
      !r.endsWith(".gds") && !r.endsWith(".gds2") && !r.endsWith(".gdsii") && (r += ".gds");
      const o = n.to_gds();
      await Zv(r, o), $n.getState().markClean();
      const s = Ke.getState().activeTabId;
      if (s) {
        const c = r.split(/[/\\]/).pop() ?? "untitled";
        Ke.getState().updateTab(s, {
          filePath: r,
          title: c,
          isDirty: false
        });
      }
      Dt.getState().show(`Saved to ${r.split("/").pop()}`);
    } catch (r) {
      console.error("Failed to save GDS file:", r), Dt.getState().show(`Save failed: ${r}`, "error");
    }
  }
  async function j1() {
    if (!$n.getState().isDirty) return true;
    if (Dn) {
      const { ask: l } = await ut(async () => {
        const { ask: n } = await import("./index-C2Rw4G7o.js");
        return {
          ask: n
        };
      }, __vite__mapDeps([0,1]), import.meta.url);
      return l("You have unsaved changes. Do you want to discard them?", {
        title: "Unsaved Changes",
        kind: "warning",
        okLabel: "Discard",
        cancelLabel: "Cancel"
      });
    }
    return window.confirm("You have unsaved changes. Do you want to discard them?");
  }
  async function mh() {
    window.dispatchEvent(new CustomEvent("rosette-new-file"));
  }
  async function L1() {
    const { renderer: l } = we.getState();
    if (!l) throw new Error("Renderer not ready");
    const n = await l.capture_screenshot(), r = new DataView(n.buffer, n.byteOffset, n.byteLength), o = r.getUint32(0, true), s = r.getUint32(4, true), c = n.slice(8), d = document.createElement("canvas");
    d.width = o, d.height = s;
    const f = d.getContext("2d");
    if (!f) throw new Error("Failed to create 2D context");
    const m = new ImageData(new Uint8ClampedArray(c.buffer, c.byteOffset, c.byteLength), o, s);
    return f.putImageData(m, 0, 0), new Promise((p, v) => {
      d.toBlob((b) => b ? p(b) : v(new Error("PNG encoding failed")), "image/png");
    });
  }
  async function QM() {
    try {
      const l = await L1();
      if (Dn) {
        let n = await Jv();
        if (!n) return;
        n.endsWith(".png") || (n += ".png");
        const r = new Uint8Array(await l.arrayBuffer());
        await Kv(n, r), Dt.getState().show(`Screenshot saved to ${n.split("/").pop()}`);
      } else {
        const n = URL.createObjectURL(l), r = document.createElement("a");
        r.href = n, r.download = "screenshot.png", document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(n), Dt.getState().show("Screenshot downloaded");
      }
    } catch (l) {
      console.error("Screenshot failed:", l), Dt.getState().show(`Screenshot failed: ${l}`, "error");
    }
  }
  async function FM() {
    try {
      const l = await L1();
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": l
        })
      ]), Dt.getState().show("Screenshot copied to clipboard");
    } catch (l) {
      console.error("Screenshot to clipboard failed:", l), Dt.getState().show(`Screenshot to clipboard failed: ${l}`, "error");
    }
  }
  const Vn = Object.freeze(Object.defineProperty({
    __proto__: null,
    confirmDiscardChanges: j1,
    emitOpenFile: Zf,
    handleNewFile: mh,
    handleSave: Kf,
    handleScreenshot: QM,
    handleScreenshotToClipboard: FM
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function qn({ label: l, shortcut: n, position: r = "bottom", align: o = "center", className: s, children: c }) {
    var _a;
    const d = ge((v) => v.theme) === "dark", f = Y("inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border px-1 text-[11px]", d ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"), p = r === "left" || r === "right" ? Y("top-1/2 -translate-y-1/2", r === "left" ? "right-full mr-3" : "left-full ml-3") : Y(o === "end" ? "right-0" : "left-1/2 -translate-x-1/2", r === "bottom" ? "top-full mt-2" : "bottom-full mb-2");
    return y.jsxs("div", {
      className: Y("group relative", s),
      children: [
        c,
        y.jsxs("div", {
          className: Y("pointer-events-none select-none absolute z-50 flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100", p, d ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
          children: [
            y.jsx("span", {
              children: l
            }),
            n && y.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = n.modifiers) == null ? void 0 : _a.map((v) => y.jsx("kbd", {
                  className: f,
                  children: v
                }, v)),
                y.jsx("kbd", {
                  className: f,
                  children: n.key
                })
              ]
            })
          ]
        })
      ]
    });
  }
  function WM(l) {
    return "separator" in l && l.separator;
  }
  function JM({ expanded: l, isDark: n }) {
    return y.jsx("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      className: Y("flex-shrink-0 transition-transform duration-150", l ? "rotate-90" : "rotate-0", n ? "text-white/40" : "text-black/40"),
      children: y.jsx("path", {
        d: "M6 4l4 4-4 4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5"
      })
    });
  }
  function e3({ items: l, isDark: n, onAction: r }) {
    const o = g.useRef(null), [s, c] = g.useState(false);
    return g.useLayoutEffect(() => {
      o.current && o.current.getBoundingClientRect().right > window.innerWidth - 8 && c(true);
    }, []), y.jsx("div", {
      ref: o,
      className: Y("absolute -top-1 z-50 ml-1 min-w-[170px] rounded-xl border py-1", s ? "right-full mr-1" : "left-full", n ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      children: l.map((d) => {
        var _a;
        return WM(d) ? y.jsx("div", {
          className: Y("my-1 h-px", n ? "bg-white/10" : "bg-black/10")
        }, d.id) : y.jsxs("button", {
          className: Y("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors", d.disabled ? "opacity-40" : n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          disabled: d.disabled,
          onClick: () => {
            d.disabled || (Promise.resolve(d.action()).catch((f) => console.error("Menu action failed:", f)), r());
          },
          children: [
            y.jsx("span", {
              children: d.label
            }),
            d.shortcut && y.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = d.shortcut.modifiers) == null ? void 0 : _a.map((f) => y.jsx("kbd", {
                  className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: f
                }, f)),
                y.jsx("kbd", {
                  className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: d.shortcut.key
                })
              ]
            })
          ]
        }, d.id);
      })
    });
  }
  function t3({ isDark: l }) {
    const [n, r] = g.useState(false), [o, s] = g.useState(null), c = g.useRef(null);
    uc("explorer-menu", n);
    const d = g.useCallback(() => {
      r(false), s(null);
    }, []);
    g.useEffect(() => {
      if (!n) return;
      const m = (p) => {
        c.current && !c.current.contains(p.target) && d();
      };
      return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
    }, [
      n,
      d
    ]), g.useEffect(() => {
      if (!n) return;
      const m = (p) => {
        p.key === "Escape" && (p.preventDefault(), d());
      };
      return document.addEventListener("keydown", m), () => document.removeEventListener("keydown", m);
    }, [
      n,
      d
    ]);
    const f = [
      {
        id: "file",
        label: "File",
        buildItems: () => [
          {
            id: "file-new",
            label: "New",
            shortcut: {
              modifiers: [
                Ie.mod
              ],
              key: "N"
            },
            action: async () => {
              await mh();
            },
            disabled: false
          },
          {
            id: "file-open",
            label: "Open...",
            shortcut: {
              modifiers: [
                Ie.mod
              ],
              key: "O"
            },
            action: async () => {
              const { pickGdsFile: m } = await ut(async () => {
                const { pickGdsFile: b } = await Promise.resolve().then(() => l0);
                return {
                  pickGdsFile: b
                };
              }, void 0, import.meta.url), { emitOpenFile: p } = await ut(async () => {
                const { emitOpenFile: b } = await Promise.resolve().then(() => Vn);
                return {
                  emitOpenFile: b
                };
              }, void 0, import.meta.url), v = await m();
              v && await p(v);
            },
            disabled: !Dn
          },
          {
            id: "file-save",
            label: "Save",
            shortcut: {
              modifiers: [
                Ie.mod
              ],
              key: "S"
            },
            action: async () => {
              const { handleSave: m } = await ut(async () => {
                const { handleSave: p } = await Promise.resolve().then(() => Vn);
                return {
                  handleSave: p
                };
              }, void 0, import.meta.url);
              await m(false);
            },
            disabled: !Dn
          },
          {
            id: "file-save-as",
            label: "Save As...",
            shortcut: {
              modifiers: [
                Ie.mod,
                Ie.shift
              ],
              key: "S"
            },
            action: async () => {
              const { handleSave: m } = await ut(async () => {
                const { handleSave: p } = await Promise.resolve().then(() => Vn);
                return {
                  handleSave: p
                };
              }, void 0, import.meta.url);
              await m(true);
            },
            disabled: !Dn
          },
          {
            id: "sep-file-1",
            separator: true
          },
          {
            id: "file-screenshot",
            label: "Export Screenshot",
            action: async () => {
              const { handleScreenshot: m } = await ut(async () => {
                const { handleScreenshot: p } = await Promise.resolve().then(() => Vn);
                return {
                  handleScreenshot: p
                };
              }, void 0, import.meta.url);
              await m();
            },
            disabled: false
          },
          {
            id: "file-screenshot-clipboard",
            label: "Copy Screenshot",
            action: async () => {
              const { handleScreenshotToClipboard: m } = await ut(async () => {
                const { handleScreenshotToClipboard: p } = await Promise.resolve().then(() => Vn);
                return {
                  handleScreenshotToClipboard: p
                };
              }, void 0, import.meta.url);
              await m();
            },
            disabled: false
          }
        ]
      },
      {
        id: "edit",
        label: "Edit",
        buildItems: () => {
          const { library: m, renderer: p } = we.getState(), { canUndo: v, canRedo: b } = de.getState(), { selectedIds: w } = ae.getState(), { hasContent: E } = zn.getState(), { selectedRulerIds: k } = Ae.getState(), S = w.size > 0, C = k.size > 0, _ = m ? m.get_all_ids().length > 0 : false;
          return [
            {
              id: "undo",
              label: "Undo",
              shortcut: {
                modifiers: [
                  Ie.mod
                ],
                key: "Z"
              },
              action: () => {
                m && p && de.getState().undo({
                  library: m,
                  renderer: p
                });
              },
              disabled: !v
            },
            {
              id: "redo",
              label: "Redo",
              shortcut: {
                modifiers: [
                  Ie.mod,
                  Ie.shift
                ],
                key: "Z"
              },
              action: () => {
                m && p && de.getState().redo({
                  library: m,
                  renderer: p
                });
              },
              disabled: !b
            },
            {
              id: "sep-edit-1",
              separator: true
            },
            {
              id: "copy",
              label: "Copy",
              shortcut: {
                modifiers: [
                  Ie.mod
                ],
                key: "C"
              },
              action: () => {
                if (!m) return;
                const L = ae.getState().selectedIds, R = mr(m, L);
                zn.getState().copy(R);
              },
              disabled: !S
            },
            {
              id: "paste",
              label: "Paste",
              shortcut: {
                modifiers: [
                  Ie.mod
                ],
                key: "V"
              },
              action: () => {
                if (!m || !p) return;
                const L = new sc();
                de.getState().execute(L, {
                  library: m,
                  renderer: p
                });
                const R = document.querySelector("canvas");
                R && Hr(m, R);
              },
              disabled: !E
            },
            {
              id: "duplicate",
              label: "Duplicate",
              shortcut: {
                modifiers: [
                  Ie.mod
                ],
                key: "B"
              },
              action: () => {
                if (!m || !p) return;
                const L = ae.getState().selectedIds;
                if (L.size === 0) return;
                const R = new cc([
                  ...L
                ]);
                de.getState().execute(R, {
                  library: m,
                  renderer: p
                });
                const T = document.querySelector("canvas");
                T && Hr(m, T);
              },
              disabled: !S
            },
            {
              id: "sep-edit-2",
              separator: true
            },
            {
              id: "delete",
              label: "Delete",
              shortcut: {
                key: Ie.backspace
              },
              action: () => {
                if (!m || !p) return;
                const L = Ae.getState().selectedRulerIds;
                if (L.size > 0) {
                  const B = new th([
                    ...L
                  ]);
                  de.getState().execute(B, {
                    library: m,
                    renderer: p
                  });
                  return;
                }
                const R = ae.getState().selectedIds;
                if (R.size === 0) return;
                const T = new ic([
                  ...R
                ]);
                de.getState().execute(T, {
                  library: m,
                  renderer: p
                });
              },
              disabled: !S && !C
            },
            {
              id: "sep-edit-3",
              separator: true
            },
            {
              id: "selectAll",
              label: "Select All",
              shortcut: {
                modifiers: [
                  Ie.mod
                ],
                key: "A"
              },
              action: () => {
                if (!m) return;
                const L = m.get_all_ids();
                ae.getState().selectAll(L);
              },
              disabled: !_
            }
          ];
        }
      },
      {
        id: "view",
        label: "View",
        buildItems: () => {
          const { library: m } = we.getState(), { selectedIds: p } = ae.getState(), v = p.size > 0;
          return [
            {
              id: "zoomIn",
              label: "Zoom In",
              shortcut: {
                key: "+"
              },
              action: () => {
                const b = document.querySelector("canvas");
                if (!b) return;
                const w = b.getBoundingClientRect();
                Oe.getState().zoomAt(nc, w.width / 2, w.height / 2);
              },
              disabled: false
            },
            {
              id: "zoomOut",
              label: "Zoom Out",
              shortcut: {
                key: "-"
              },
              action: () => {
                const b = document.querySelector("canvas");
                if (!b) return;
                const w = b.getBoundingClientRect();
                Oe.getState().zoomAt(lc, w.width / 2, w.height / 2);
              },
              disabled: false
            },
            {
              id: "sep-view-1",
              separator: true
            },
            {
              id: "fitAll",
              label: "Fit All",
              shortcut: {
                key: "F"
              },
              action: () => {
                const b = document.querySelector("canvas");
                if (!b || !m) return;
                const w = m.get_all_bounds(), E = w ? {
                  minX: w[0],
                  minY: w[1],
                  maxX: w[2],
                  maxY: w[3]
                } : null, k = ol(b);
                Oe.getState().zoomToFit(E, k.width, k.height, k.screenCenter);
              },
              disabled: false
            },
            {
              id: "fitSelection",
              label: "Fit Selection",
              shortcut: {
                modifiers: [
                  Ie.shift
                ],
                key: "F"
              },
              action: () => {
                const b = document.querySelector("canvas");
                if (!b || !m) return;
                const w = ae.getState().selectedIds;
                if (w.size === 0) return;
                const E = m.get_bounds_for_ids([
                  ...w
                ]), k = E ? {
                  minX: E[0],
                  minY: E[1],
                  maxX: E[2],
                  maxY: E[3]
                } : null, S = ol(b);
                Oe.getState().zoomToSelected(k, S.width, S.height, S.screenCenter);
              },
              disabled: !v
            }
          ];
        }
      },
      {
        id: "preferences",
        label: "Preferences",
        buildItems: () => {
          const { themeSetting: m, showGrid: p } = ge.getState();
          return [
            {
              id: "theme-light",
              label: `${m === "light" ? "\u2713  " : "     "}Light`,
              action: () => ge.getState().setThemeSetting("light"),
              disabled: false
            },
            {
              id: "theme-dark",
              label: `${m === "dark" ? "\u2713  " : "     "}Dark`,
              action: () => ge.getState().setThemeSetting("dark"),
              disabled: false
            },
            {
              id: "theme-system",
              label: `${m === "system" ? "\u2713  " : "     "}System`,
              action: () => ge.getState().setThemeSetting("system"),
              disabled: false
            },
            {
              id: "sep-prefs-1",
              separator: true
            },
            {
              id: "show-grid",
              label: `${p ? "\u2713  " : "     "}Show Grid`,
              action: () => ge.getState().toggleGrid(),
              disabled: false
            }
          ];
        }
      }
    ];
    return y.jsxs("div", {
      ref: c,
      className: "relative ml-auto flex-shrink-0",
      children: [
        y.jsx("button", {
          type: "button",
          onClick: () => {
            r((m) => !m), s(null);
          },
          className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
          children: y.jsx("div", {
            className: "flex h-4 w-4 items-center justify-center",
            children: y.jsx(ck, {
              className: Y("h-4 w-4", l ? "text-white/60" : "text-black/60")
            })
          })
        }),
        n && y.jsx("div", {
          className: Y("absolute top-full right-0 z-50 mt-1 min-w-[140px] rounded-xl border py-1", l ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
          children: f.map((m) => y.jsxs("div", {
            className: "relative",
            children: [
              y.jsxs("button", {
                type: "button",
                className: Y("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", o === m.id && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                onMouseEnter: () => s(m.id),
                onClick: () => s(o === m.id ? null : m.id),
                children: [
                  y.jsx("span", {
                    children: m.label
                  }),
                  y.jsx("svg", {
                    width: "12",
                    height: "12",
                    viewBox: "0 0 16 16",
                    className: "flex-shrink-0",
                    children: y.jsx("path", {
                      d: "M6 4l4 4-4 4",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1.5"
                    })
                  })
                ]
              }),
              o === m.id && y.jsx(e3, {
                items: m.buildItems(),
                isDark: l,
                onAction: d
              })
            ]
          }, m.id))
        })
      ]
    });
  }
  function R1({ name: l, isActive: n, isDark: r, depth: o, hasChildren: s, isExpanded: c, isHidden: d, onToggleExpand: f, onSelect: m, onRename: p, startEditing: v, canDrag: b }) {
    const [w, E] = g.useState(false), [k, S] = g.useState(l), C = g.useRef(null);
    g.useEffect(() => {
      v && (E(true), S(l), me.getState().setEditingCellName(null));
    }, [
      v,
      l
    ]), g.useEffect(() => {
      w && C.current && (C.current.focus(), C.current.select());
    }, [
      w
    ]);
    const _ = g.useCallback(() => {
      const N = k.trim();
      N && N !== l ? p(N) : S(l), E(false);
    }, [
      k,
      l,
      p
    ]), L = g.useCallback((N) => {
      N.key === "Enter" ? _() : N.key === "Escape" && (S(l), E(false));
    }, [
      _,
      l
    ]), R = g.useCallback((N) => {
      N.preventDefault(), N.stopPropagation(), rc.getState().open("cell", {
        x: N.clientX,
        y: N.clientY
      }, l);
    }, [
      l
    ]), T = g.useCallback((N) => {
      N.stopPropagation(), f();
    }, [
      f
    ]), B = g.useCallback((N) => {
      if (N.button !== 0 || !b || w) {
        b || N.preventDefault();
        return;
      }
      const A = {
        x: N.clientX,
        y: N.clientY
      };
      let H = false;
      const z = (ee) => {
        const J = ee.clientX - A.x, ce = ee.clientY - A.y;
        if (!(!H && J * J + ce * ce < 25) && !H) {
          H = true;
          const { library: fe } = we.getState();
          if (!fe) return;
          const Se = fe.get_cell_bounds(l) ?? null, $ = fe.get_cell_origin_by_name(l), F = {
            x: $ ? $[0] : 0,
            y: $ ? $[1] : 0
          };
          Vs.getState().startDrag(l, Se, F);
        }
      }, P = () => {
        document.removeEventListener("mousemove", z), document.removeEventListener("mouseup", P);
      };
      document.addEventListener("mousemove", z), document.addEventListener("mouseup", P);
    }, [
      b,
      w,
      l
    ]);
    return y.jsxs("button", {
      type: "button",
      className: Y("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center rounded-lg py-1.5 text-left transition-colors focus:outline-none", n ? r ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90"),
      style: {
        paddingLeft: `${7 + o * 10}px`,
        paddingRight: "7px"
      },
      onClick: m,
      onContextMenu: R,
      onMouseDown: B,
      tabIndex: -1,
      children: [
        s ? y.jsx("button", {
          type: "button",
          className: "mr-0.5 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center bg-transparent border-none p-0",
          onClick: T,
          children: y.jsx(JM, {
            expanded: c,
            isDark: r
          })
        }) : y.jsx("span", {
          className: "mr-0.5 h-4 w-4 flex-shrink-0"
        }),
        y.jsx("div", {
          className: "relative h-5 min-w-0 flex-1",
          children: w ? y.jsx("input", {
            ref: C,
            type: "text",
            value: k,
            onChange: (N) => S(N.target.value),
            onBlur: _,
            onKeyDown: L,
            onClick: (N) => N.stopPropagation(),
            className: Y("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", r ? "text-white/90" : "text-black/90")
          }) : y.jsx("span", {
            className: Y("absolute inset-0 truncate text-sm leading-5 select-none", d && "opacity-40"),
            onDoubleClick: (N) => {
              N.stopPropagation(), E(true), S(l);
            },
            children: l
          })
        })
      ]
    });
  }
  function A1({ node: l, depth: n, isDark: r, activeCell: o, editingCellName: s, expandedCells: c, hiddenCells: d, onSelect: f, onRename: m, onToggleExpand: p }) {
    const v = l.children.length > 0, b = c.has(l.name), w = l.name !== o;
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(R1, {
          name: l.name,
          isActive: l.name === o,
          isDark: r,
          depth: n,
          hasChildren: v,
          isExpanded: b,
          isHidden: d.has(l.name),
          onToggleExpand: () => p(l.name),
          onSelect: () => f(l.name),
          onRename: (E) => m(l.name, E),
          startEditing: s === l.name,
          canDrag: w
        }),
        v && b && l.children.map((E) => y.jsx(A1, {
          node: E,
          depth: n + 1,
          isDark: r,
          activeCell: o,
          editingCellName: s,
          expandedCells: c,
          hiddenCells: d,
          onSelect: f,
          onRename: m,
          onToggleExpand: p
        }, `${l.name}/${E.name}`))
      ]
    });
  }
  function n3({ tab: l, isActive: n, isDark: r, onSelect: o, onClose: s, onMiddleClick: c }) {
    return y.jsxs("div", {
      role: "tab",
      tabIndex: 0,
      "aria-selected": n,
      className: Y("group mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-1.5 rounded-lg py-1.5 pr-1 pl-2 transition-colors", n ? r ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90"),
      onClick: o,
      onKeyDown: (d) => {
        (d.key === "Enter" || d.key === " ") && (d.preventDefault(), o());
      },
      onMouseDown: c,
      children: [
        l.isDirty ? y.jsx("span", {
          className: Y("h-1.5 w-1.5 flex-shrink-0 rounded-full", r ? "bg-white/50" : "bg-black/50")
        }) : y.jsx("span", {
          className: "h-1.5 w-1.5 flex-shrink-0"
        }),
        y.jsx("span", {
          className: "min-w-0 flex-1 truncate text-sm select-none",
          children: l.title
        }),
        y.jsx("button", {
          type: "button",
          onClick: s,
          className: Y("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm transition-opacity", "opacity-0 group-hover:opacity-100", r ? "hover:bg-white/15 text-white/50 hover:text-white/80" : "hover:bg-black/15 text-black/50 hover:text-black/80"),
          children: y.jsx("svg", {
            width: "8",
            height: "8",
            viewBox: "0 0 8 8",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            children: y.jsx("path", {
              d: "M1.5 1.5l5 5M6.5 1.5l-5 5"
            })
          })
        })
      ]
    });
  }
  function l3({ isDark: l }) {
    const n = Ke((d) => d.tabs), r = Ke((d) => d.activeTabId), o = g.useCallback((d) => {
      d !== r && (Da(r, d), Ke.getState().setActiveTab(d));
    }, [
      r
    ]), s = g.useCallback(async (d, f) => {
      d.stopPropagation(), window.dispatchEvent(new CustomEvent("rosette-close-tab", {
        detail: f
      }));
    }, []), c = g.useCallback((d, f) => {
      d.button === 1 && (d.preventDefault(), window.dispatchEvent(new CustomEvent("rosette-close-tab", {
        detail: f
      })));
    }, []);
    return n.length <= 1 ? null : y.jsxs(y.Fragment, {
      children: [
        y.jsx("div", {
          className: "flex flex-col gap-0.5 py-1",
          children: n.map((d) => y.jsx(n3, {
            tab: d,
            isActive: d.id === r,
            isDark: l,
            onSelect: () => o(d.id),
            onClose: (f) => s(f, d.id),
            onMiddleClick: (f) => c(f, d.id)
          }, d.id))
        }),
        y.jsx("div", {
          className: Y("h-px", l ? "bg-white/10" : "bg-black/10")
        })
      ]
    });
  }
  function r3({ isDark: l, onExpand: n }) {
    const r = Ke((o) => o.tabs.length);
    return y.jsxs("div", {
      className: Y("fixed top-4 left-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border pt-[4.5px] pb-[5px]", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: [
        y.jsxs("div", {
          className: "relative p-1",
          children: [
            y.jsx("img", {
              src: "/icon.svg",
              alt: "",
              draggable: false,
              className: Y("h-5 w-5 select-none pointer-events-none rounded border", l ? "border-white/40" : "border-black/40")
            }),
            r > 1 && y.jsx("span", {
              className: Y("absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-0.5 text-[9px] font-medium leading-none", l ? "bg-white/20 text-white/80" : "bg-black/20 text-black/80"),
              children: r
            })
          ]
        }),
        y.jsx("div", {
          className: Y("mx-1 h-px w-5", l ? "bg-white/10" : "bg-black/10")
        }),
        y.jsx("button", {
          type: "button",
          onClick: n,
          className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          children: y.jsx(S1, {
            className: Y("h-4 w-4", l ? "text-white/60" : "text-black/60")
          })
        })
      ]
    });
  }
  function Ev() {
    const n = ge((O) => O.theme) === "dark", r = ge((O) => O.explorerCollapsed), o = ge((O) => O.toggleExplorerCollapsed), s = ge((O) => O.explorerWidth), c = ge((O) => O.setExplorerWidth), { isSm: d } = hh(), { handleProps: f } = M1({
      side: "left",
      width: s,
      onResize: c
    }), m = me((O) => O.projectName), p = me((O) => O.setProjectName), v = me((O) => O.cells), b = me((O) => O.cellTree), w = me((O) => O.activeCell), E = me((O) => O.setActiveCell), k = me((O) => O.editingCellName), S = me((O) => O.expandedCells), C = me((O) => O.toggleExpanded), _ = me((O) => O.cellsLoaded), L = me((O) => O.hierarchyLevelLimit), R = me((O) => O.setHierarchyLevelLimit), T = me((O) => O.maxTreeDepth), B = me((O) => O.hiddenCells), [N, A] = g.useState(false), H = g.useRef(null);
    g.useEffect(() => {
      if (!d || !N) return;
      const O = (Z) => {
        H.current && !H.current.contains(Z.target) && A(false);
      };
      return document.addEventListener("mousedown", O), () => document.removeEventListener("mousedown", O);
    }, [
      d,
      N
    ]);
    const z = (O, Z) => O === 1 / 0 ? Z > 0 ? Z.toString() : "" : O.toString(), [P, ee] = g.useState(z(L, T));
    g.useEffect(() => {
      ee(z(L, T));
    }, [
      L,
      T
    ]);
    const [J, ce] = g.useState(false), [fe, Se] = g.useState(m), $ = g.useRef(null);
    g.useEffect(() => {
      J && $.current && ($.current.focus(), $.current.select());
    }, [
      J
    ]);
    const F = g.useCallback(() => {
      const O = fe.trim();
      O && O !== m ? p(O) : Se(m), ce(false);
    }, [
      fe,
      m,
      p
    ]), ie = g.useCallback((O) => {
      O.key === "Enter" ? F() : O.key === "Escape" && (Se(m), ce(false));
    }, [
      F,
      m
    ]), Ee = g.useCallback((O, Z) => {
      const { library: Q, renderer: oe } = we.getState();
      if (Q && oe) {
        const ue = new x0(O, Z);
        de.getState().execute(ue, {
          library: Q,
          renderer: oe
        });
      } else me.getState().renameCell(O, Z);
    }, []), pe = g.useCallback((O) => {
      O === w && v.length <= 1 || E(O === w ? null : O);
    }, [
      w,
      v.length,
      E
    ]), j = g.useCallback(() => {
      d ? A(true) : o();
    }, [
      d,
      o
    ]);
    if (r && !(d && N)) return y.jsx(r3, {
      isDark: n,
      onExpand: j
    });
    const D = d && N;
    return y.jsxs(y.Fragment, {
      children: [
        D && y.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        y.jsxs("div", {
          ref: H,
          className: Y("fixed top-4 left-4 z-40 rounded-xl border transition-opacity duration-200", _ ? "opacity-100" : "pointer-events-none opacity-0", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", D && "shadow-xl"),
          style: {
            width: s
          },
          children: [
            y.jsx("div", {
              ...f
            }),
            y.jsxs("div", {
              className: "flex items-center gap-1 px-1 pt-1 pb-[3px]",
              children: [
                y.jsx("div", {
                  className: "flex-shrink-0 p-1",
                  children: y.jsx("img", {
                    src: "/icon.svg",
                    alt: "",
                    draggable: false,
                    className: Y("h-5 w-5 select-none pointer-events-none rounded border", n ? "border-white/40" : "border-black/40")
                  })
                }),
                y.jsx("div", {
                  className: "relative h-5 min-w-0 flex-1",
                  children: J ? y.jsx("input", {
                    ref: $,
                    type: "text",
                    value: fe,
                    onChange: (O) => Se(O.target.value),
                    onBlur: F,
                    onKeyDown: ie,
                    onClick: (O) => O.stopPropagation(),
                    className: Y("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-xs font-medium leading-5 outline-none focus:ring-0", n ? "text-white/90" : "text-black/90")
                  }) : y.jsx("button", {
                    type: "button",
                    className: Y("absolute inset-0 cursor-text truncate border-0 bg-transparent p-0 text-left text-xs font-medium leading-5 select-none focus:outline-none", n ? "text-white/60" : "text-black/60"),
                    onClick: () => {
                      Se(m), ce(true);
                    },
                    children: m
                  })
                }),
                !d && y.jsx("button", {
                  type: "button",
                  onClick: o,
                  className: Y("flex-shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: y.jsx(wk, {
                    className: Y("h-4 w-4", n ? "text-white/60" : "text-black/60")
                  })
                }),
                y.jsx(t3, {
                  isDark: n
                })
              ]
            }),
            y.jsx("div", {
              className: Y("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            y.jsx(l3, {
              isDark: n
            }),
            y.jsx("div", {
              className: "flex flex-col gap-0.5 overflow-y-auto py-1",
              style: {
                maxHeight: "calc(100vh - 176px)"
              },
              onWheel: (O) => O.stopPropagation(),
              children: b ? b.map((O) => y.jsx(A1, {
                node: O,
                depth: 0,
                isDark: n,
                activeCell: w,
                editingCellName: k,
                expandedCells: S,
                hiddenCells: B,
                onSelect: pe,
                onRename: Ee,
                onToggleExpand: C
              }, O.name)) : v.map((O) => y.jsx(R1, {
                name: O,
                isActive: O === w,
                isDark: n,
                depth: 0,
                hasChildren: false,
                isExpanded: false,
                isHidden: B.has(O),
                onToggleExpand: () => {
                },
                onSelect: () => pe(O),
                onRename: (Z) => Ee(O, Z),
                startEditing: k === O,
                canDrag: O !== w
              }, O))
            }),
            y.jsx("div", {
              className: Y("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            y.jsxs("div", {
              className: "flex items-center justify-between pl-2 pr-[5.5px] py-1.5",
              children: [
                y.jsx("span", {
                  className: Y("text-xs select-none pointer-events-none", n ? "text-white/40" : "text-black/40"),
                  children: "Level"
                }),
                y.jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [
                    y.jsx("input", {
                      id: "hierarchy-level-input",
                      type: "number",
                      min: "1",
                      max: T,
                      value: P,
                      onChange: (O) => {
                        const Z = O.target.value;
                        ee(Z);
                        const Q = parseInt(Z, 10);
                        !isNaN(Q) && Q >= 1 && R(Q);
                      },
                      onBlur: () => {
                        const O = parseInt(P, 10) || T, Z = Math.max(1, Math.min(O, T));
                        R(Z), ee(Z.toString());
                      },
                      onKeyDown: (O) => {
                        if (O.key === "Enter") {
                          const Z = parseInt(P, 10) || T, Q = Math.max(1, Math.min(Z, T));
                          R(Q), ee(Q.toString()), O.currentTarget.blur();
                        } else O.key === "Escape" && O.currentTarget.blur();
                      },
                      className: Y("h-6 w-12 rounded-lg border px-2 text-xs tabular-nums outline-none", n ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
                    }),
                    y.jsx(qn, {
                      label: "All levels",
                      position: "bottom",
                      children: y.jsx("button", {
                        type: "button",
                        onClick: () => R(1 / 0),
                        className: Y("flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border transition-colors", n ? "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/90" : "border-black/10 bg-black/5 text-black/40 hover:bg-black/10 hover:text-black/90"),
                        children: y.jsxs("svg", {
                          width: "14",
                          height: "14",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          children: [
                            y.jsx("polygon", {
                              points: "12 2 2 7 12 12 22 7 12 2"
                            }),
                            y.jsx("polyline", {
                              points: "2 17 12 22 22 17"
                            }),
                            y.jsx("polyline", {
                              points: "2 12 12 17 22 12"
                            })
                          ]
                        })
                      })
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
  }
  function a3(l, n) {
    if (l.length < 4) return null;
    let r = l[0], o = l[1], s = l[2], c = l[3];
    if (!Number.isFinite(r) || !Number.isFinite(o) || !Number.isFinite(s) || !Number.isFinite(c)) return null;
    const d = Math.max((s - r) * 0.05, (c - o) * 0.05, 1);
    r -= d, o -= d, s += d, c += d;
    const f = s - r, m = c - o, p = n / f, v = n / m, b = Math.min(p, v), w = f * b, E = m * b, k = (n - w) / 2, S = (n - E) / 2;
    return {
      minX: r,
      minY: o,
      maxX: s,
      maxY: c,
      width: f,
      height: m,
      scale: b,
      offsetX: k,
      offsetY: S
    };
  }
  function tc(l, n, r) {
    return {
      x: (l - r.minX) * r.scale + r.offsetX,
      y: (n - r.minY) * r.scale + r.offsetY
    };
  }
  function o3(l, n, r) {
    return {
      x: r.minX + (l - r.offsetX) / r.scale,
      y: r.minY + (n - r.offsetY) / r.scale
    };
  }
  function i3(l, n, r) {
    for (const [, o, s] of r) {
      if (o.length < 3) continue;
      const c = Math.round(s[0] * 255), d = Math.round(s[1] * 255), f = Math.round(s[2] * 255), m = s[3];
      l.fillStyle = `rgba(${c},${d},${f},${m})`, l.beginPath();
      const p = tc(o[0][0], o[0][1], n);
      l.moveTo(p.x, p.y);
      for (let v = 1; v < o.length; v++) {
        const b = tc(o[v][0], o[v][1], n);
        l.lineTo(b.x, b.y);
      }
      l.closePath(), l.fill();
    }
  }
  function s3(l, n, r, o, s, c, d) {
    const f = -r.x / o, m = -r.y / o, p = f + s / o, v = m + c / o, b = tc(f, m, n), w = tc(p, v, n), E = b.x, k = b.y, S = w.x - b.x, C = w.y - b.y;
    l.strokeStyle = d.viewportStroke, l.lineWidth = 1.5, l.setLineDash([
      3,
      3
    ]), l.strokeRect(E, k, S, C), l.fillStyle = d.viewportFill, l.fillRect(E, k, S, C), l.setLineDash([]);
  }
  function c3(l) {
    return {
      canvasBg: l ? "rgb(29,29,29)" : "rgb(241,241,241)",
      viewportStroke: l ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
      viewportFill: l ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    };
  }
  const Xn = 180;
  function _v() {
    const l = g.useRef(null), n = g.useRef(null), r = g.useRef(null), o = g.useRef(null), [s, c] = g.useState(false), d = Oe((A) => A.zoom), f = Oe((A) => A.offset), m = ge((A) => A.theme), p = we((A) => A.library), v = ye((A) => A.layers), b = Fo((A) => A.isMinimized), w = de((A) => A.undoStack.length), E = de((A) => A.redoStack.length), k = m === "dark", S = g.useMemo(() => c3(k), [
      k
    ]);
    g.useEffect(() => {
      const A = l.current;
      if (!A) return;
      const H = (z) => {
        const P = document.getElementById("rosette-canvas");
        P && (z.preventDefault(), P.dispatchEvent(new WheelEvent("wheel", z)));
      };
      return A.addEventListener("wheel", H, {
        passive: false
      }), () => A.removeEventListener("wheel", H);
    }, []);
    const C = g.useCallback(() => {
      var _a;
      return ((_a = document.getElementById("rosette-canvas")) == null ? void 0 : _a.getBoundingClientRect()) ?? null;
    }, []), _ = g.useCallback((A) => {
      var _a;
      const H = o.current;
      if (!H) return;
      const z = (_a = n.current) == null ? void 0 : _a.getBoundingClientRect();
      if (!z) return;
      const P = A.clientX - z.left, ee = A.clientY - z.top, J = o3(P, ee, H), ce = C();
      if (!ce) return;
      const fe = -(J.x * d) + ce.width / 2, Se = -(J.y * d) + ce.height / 2;
      Oe.getState().setOffset(fe, Se);
    }, [
      d,
      C
    ]), L = g.useCallback((A) => {
      A.stopPropagation(), c(true), _(A);
    }, [
      _
    ]), R = g.useCallback((A) => {
      s && _(A);
    }, [
      s,
      _
    ]), T = g.useCallback(() => {
      c(false);
    }, []), B = g.useCallback(() => {
      c(false);
    }, []);
    if (g.useEffect(() => {
      if (b || !p) return;
      const A = p.get_all_bounds();
      if (!A) {
        o.current = null, r.current = null;
        return;
      }
      const H = a3(A, Xn);
      if (!H) {
        o.current = null, r.current = null;
        return;
      }
      o.current = H;
      let z;
      try {
        z = p.get_render_polygons();
      } catch {
        r.current = null;
        return;
      }
      if (!z || z.length === 0) {
        r.current = null;
        return;
      }
      const P = /* @__PURE__ */ new Set();
      for (const [, fe] of v) fe.visible || P.add(`${fe.layerNumber}:${fe.datatype}`);
      let ee = z;
      P.size > 0 && (ee = z.filter(([fe]) => {
        const Se = p.get_element_info(fe);
        if (!Se) return true;
        const $ = `${Se.layer}:${Se.datatype}`, F = P.has($);
        return Se.free(), !F;
      }));
      const J = document.createElement("canvas");
      J.width = Xn, J.height = Xn;
      const ce = J.getContext("2d");
      ce && (ce.clearRect(0, 0, Xn, Xn), i3(ce, H, ee), r.current = J);
    }, [
      p,
      v,
      b,
      w,
      E
    ]), g.useEffect(() => {
      if (b) return;
      const A = n.current;
      if (!A) return;
      const H = A.getContext("2d");
      if (!H) return;
      const z = o.current;
      if (H.clearRect(0, 0, Xn, Xn), H.fillStyle = S.canvasBg, H.fillRect(0, 0, Xn, Xn), r.current && H.drawImage(r.current, 0, 0), z) {
        const P = C();
        P && P.width > 0 && P.height > 0 && s3(H, z, f, d, P.width, P.height, S);
      }
    }, [
      d,
      f,
      b,
      S,
      C,
      w,
      E
    ]), b) return null;
    const N = `rounded-xl border p-1 ${k ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"}`;
    return y.jsx("div", {
      className: "pointer-events-none absolute bottom-4 right-4 select-none",
      children: y.jsx("div", {
        ref: l,
        className: `pointer-events-auto relative ${N}`,
        children: y.jsx("canvas", {
          ref: n,
          width: Xn,
          height: Xn,
          className: "pointer-events-auto cursor-move rounded-lg",
          onMouseDown: L,
          onMouseMove: R,
          onMouseUp: T,
          onMouseLeave: B
        })
      })
    });
  }
  const u3 = Vo, d3 = [
    {
      id: "solid",
      label: "Solid"
    },
    {
      id: "hatched",
      label: "Hatched"
    },
    {
      id: "crosshatched",
      label: "Cross"
    },
    {
      id: "dotted",
      label: "Dotted"
    },
    {
      id: "horizontal",
      label: "Horiz"
    },
    {
      id: "vertical",
      label: "Vert"
    },
    {
      id: "zigzag",
      label: "Zigzag"
    },
    {
      id: "brick",
      label: "Brick"
    }
  ];
  function f3({ pattern: l, className: n }) {
    return y.jsxs("svg", {
      width: 14,
      height: 14,
      viewBox: "0 0 14 14",
      className: n,
      children: [
        y.jsx("rect", {
          x: "0",
          y: "0",
          width: 14,
          height: 14,
          fill: "currentColor",
          opacity: "0.15",
          rx: "1"
        }),
        l === "solid" && y.jsx("rect", {
          x: "1",
          y: "1",
          width: 12,
          height: 12,
          fill: "currentColor",
          opacity: "0.5",
          rx: "0.5"
        }),
        l === "hatched" && y.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            y.jsx("line", {
              x1: "0",
              y1: "4",
              x2: "4",
              y2: "0"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "9",
              x2: "9",
              y2: "0"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "14",
              x2: "14",
              y2: "0"
            }),
            y.jsx("line", {
              x1: "5",
              y1: "14",
              x2: "14",
              y2: "5"
            }),
            y.jsx("line", {
              x1: "10",
              y1: "14",
              x2: "14",
              y2: "10"
            })
          ]
        }),
        l === "crosshatched" && y.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            y.jsx("line", {
              x1: "0",
              y1: "4",
              x2: "4",
              y2: "0"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "9",
              x2: "9",
              y2: "0"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "14",
              x2: "14",
              y2: "0"
            }),
            y.jsx("line", {
              x1: "5",
              y1: "14",
              x2: "14",
              y2: "5"
            }),
            y.jsx("line", {
              x1: "10",
              y1: "14",
              x2: "14",
              y2: "10"
            }),
            y.jsx("line", {
              x1: "10",
              y1: "0",
              x2: "14",
              y2: "4"
            }),
            y.jsx("line", {
              x1: "5",
              y1: "0",
              x2: "14",
              y2: "9"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "0",
              x2: "14",
              y2: "14"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "5",
              x2: "9",
              y2: "14"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "10",
              x2: "4",
              y2: "14"
            })
          ]
        }),
        l === "dotted" && y.jsxs("g", {
          fill: "currentColor",
          opacity: "0.6",
          children: [
            y.jsx("circle", {
              cx: "3.5",
              cy: "3.5",
              r: "1"
            }),
            y.jsx("circle", {
              cx: "10.5",
              cy: "3.5",
              r: "1"
            }),
            y.jsx("circle", {
              cx: "3.5",
              cy: "10.5",
              r: "1"
            }),
            y.jsx("circle", {
              cx: "10.5",
              cy: "10.5",
              r: "1"
            }),
            y.jsx("circle", {
              cx: "7",
              cy: "7",
              r: "1"
            })
          ]
        }),
        l === "horizontal" && y.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            y.jsx("line", {
              x1: "0",
              y1: "3.5",
              x2: "14",
              y2: "3.5"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "7",
              x2: "14",
              y2: "7"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "10.5",
              x2: "14",
              y2: "10.5"
            })
          ]
        }),
        l === "vertical" && y.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            y.jsx("line", {
              x1: "3.5",
              y1: "0",
              x2: "3.5",
              y2: "14"
            }),
            y.jsx("line", {
              x1: "7",
              y1: "0",
              x2: "7",
              y2: "14"
            }),
            y.jsx("line", {
              x1: "10.5",
              y1: "0",
              x2: "10.5",
              y2: "14"
            })
          ]
        }),
        l === "zigzag" && y.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          fill: "none",
          children: [
            y.jsx("polyline", {
              points: "0,5 3.5,2 7,5 10.5,2 14,5"
            }),
            y.jsx("polyline", {
              points: "0,10 3.5,7 7,10 10.5,7 14,10"
            })
          ]
        }),
        l === "brick" && y.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            y.jsx("line", {
              x1: "0",
              y1: "3.5",
              x2: "14",
              y2: "3.5"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "7",
              x2: "14",
              y2: "7"
            }),
            y.jsx("line", {
              x1: "0",
              y1: "10.5",
              x2: "14",
              y2: "10.5"
            }),
            y.jsx("line", {
              x1: "3.5",
              y1: "0",
              x2: "3.5",
              y2: "3.5"
            }),
            y.jsx("line", {
              x1: "10.5",
              y1: "0",
              x2: "10.5",
              y2: "3.5"
            }),
            y.jsx("line", {
              x1: "7",
              y1: "3.5",
              x2: "7",
              y2: "7"
            }),
            y.jsx("line", {
              x1: "3.5",
              y1: "7",
              x2: "3.5",
              y2: "10.5"
            }),
            y.jsx("line", {
              x1: "10.5",
              y1: "7",
              x2: "10.5",
              y2: "10.5"
            }),
            y.jsx("line", {
              x1: "7",
              y1: "10.5",
              x2: "7",
              y2: "14"
            })
          ]
        })
      ]
    });
  }
  function h3({ color: l, isDark: n, onChange: r, hexTabIdx: o }) {
    const [s, c] = g.useState(l), d = g.useRef(null);
    g.useEffect(() => {
      c(l);
    }, [
      l
    ]);
    const f = g.useCallback(() => {
      const p = s.trim().replace(/^#?/, "#");
      /^#[0-9a-fA-F]{6}$/.test(p) ? r(p.toLowerCase()) : c(l);
    }, [
      s,
      l,
      r
    ]), m = g.useCallback((p) => {
      var _a, _b2;
      p.key === "Enter" ? (p.preventDefault(), (_a = d.current) == null ? void 0 : _a.blur()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), c(l), (_b2 = d.current) == null ? void 0 : _b2.blur());
    }, [
      l
    ]);
    return y.jsxs("div", {
      className: "flex flex-col gap-1.5",
      children: [
        y.jsx("div", {
          className: "grid grid-cols-8 gap-1",
          children: u3.map((p) => y.jsx("button", {
            type: "button",
            onClick: (v) => {
              v.stopPropagation(), r(p);
            },
            className: Y("h-5 w-full rounded border outline-none transition-all", p === l ? "ring-1 ring-offset-1 " + (n ? "ring-white/60 ring-offset-[rgb(29,29,29)]" : "ring-black/60 ring-offset-[rgb(241,241,241)]") : n ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30"),
            style: {
              backgroundColor: p
            },
            tabIndex: -1
          }, p))
        }),
        y.jsxs("div", {
          className: "flex items-center gap-1.5",
          children: [
            y.jsx("div", {
              className: Y("h-5 w-5 flex-shrink-0 rounded border", n ? "border-white/10" : "border-black/10"),
              style: {
                backgroundColor: l
              }
            }),
            y.jsx("input", {
              ref: d,
              type: "text",
              value: s,
              "data-tab-index": o,
              onChange: (p) => c(p.target.value),
              onBlur: f,
              onKeyDown: m,
              onClick: (p) => p.stopPropagation(),
              tabIndex: -1,
              className: Y("h-6 min-w-0 flex-1 rounded border px-1.5 font-mono text-xs outline-none", n ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
            })
          ]
        })
      ]
    });
  }
  function m3({ value: l, isDark: n, onChange: r, baseTabIdx: o }) {
    return y.jsx("div", {
      className: "grid grid-cols-4 gap-1",
      children: d3.map((s, c) => {
        const d = l === s.id;
        return y.jsx("button", {
          type: "button",
          "data-tab-index": o != null ? o + c : void 0,
          onClick: (f) => {
            f.stopPropagation(), r(s.id);
          },
          className: Y("flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1 text-[10px] outline-none transition-colors", d ? n ? "border-white/20 bg-white/10 text-white/90" : "border-black/20 bg-black/10 text-black/90" : n ? "border-white/5 text-white/40 hover:border-white/15 hover:text-white/70 focus:border-white/15 focus:text-white/70" : "border-black/5 text-black/40 hover:border-black/15 hover:text-black/70 focus:border-black/15 focus:text-black/70"),
          tabIndex: -1,
          children: y.jsx(f3, {
            pattern: s.id
          })
        }, s.id);
      })
    });
  }
  function kv({ label: l, value: n, isDark: r, onChange: o, tabIdx: s }) {
    const [c, d] = g.useState(String(n)), [f, m] = g.useState(false), p = g.useRef(null);
    g.useEffect(() => {
      f || d(String(n));
    }, [
      n,
      f
    ]);
    const v = g.useCallback(() => {
      const b = Number.parseInt(c, 10);
      !Number.isNaN(b) && b >= 0 && b <= Tf && b !== n ? o(b) : d(String(n));
    }, [
      c,
      n,
      o
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between",
      children: [
        y.jsx("span", {
          className: Y("text-xs select-none", r ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsx("input", {
          ref: p,
          type: "text",
          value: c,
          "data-tab-index": s,
          onChange: (b) => d(b.target.value),
          onFocus: (b) => {
            m(true), b.target.select();
          },
          onBlur: () => {
            m(false), v();
          },
          onKeyDown: (b) => {
            var _a, _b2;
            b.key === "Enter" ? (b.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), d(String(n)), (_b2 = p.current) == null ? void 0 : _b2.blur());
          },
          onClick: (b) => b.stopPropagation(),
          tabIndex: -1,
          className: Y("w-16 cursor-text rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors", f ? r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : r ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function g3({ label: l, value: n, isDark: r, onChange: o, tabIdx: s }) {
    const [c, d] = g.useState(n), [f, m] = g.useState(false), p = g.useRef(null);
    g.useEffect(() => {
      f || d(n);
    }, [
      n,
      f
    ]);
    const v = g.useCallback(() => {
      const b = c.trim();
      b && b !== n ? o(b) : d(n);
    }, [
      c,
      n,
      o
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between",
      children: [
        y.jsx("span", {
          className: Y("text-xs select-none", r ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsx("input", {
          ref: p,
          type: "text",
          value: c,
          "data-tab-index": s,
          onChange: (b) => d(b.target.value),
          onFocus: (b) => {
            m(true), b.target.select();
          },
          onBlur: () => {
            m(false), v();
          },
          onKeyDown: (b) => {
            var _a, _b2;
            b.key === "Enter" ? (b.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), d(n), (_b2 = p.current) == null ? void 0 : _b2.blur());
          },
          onClick: (b) => b.stopPropagation(),
          tabIndex: -1,
          className: Y("w-28 cursor-text truncate rounded border px-1.5 py-0.5 text-right text-xs outline-none transition-colors", f ? r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : r ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function Mf({ label: l, isDark: n }) {
    return y.jsx("span", {
      className: Y("text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function p3({ layer: l, isDark: n }) {
    const r = we((f) => f.library), o = we((f) => f.renderer), s = g.useRef(null), c = g.useCallback((f) => {
      if (!r || !o) return;
      const m = {
        ...l,
        ...f
      };
      if (f.layerNumber !== void 0 || f.datatype !== void 0) {
        for (const v of ye.getState().layers.values()) if (v.id !== l.id && v.layerNumber === m.layerNumber && v.datatype === m.datatype) {
          Dt.getState().show(`Layer ${m.layerNumber}/${m.datatype} already exists`, "warn");
          return;
        }
      }
      const p = new b0(l, m);
      de.getState().execute(p, {
        library: r,
        renderer: o
      });
    }, [
      l,
      r,
      o
    ]);
    g.useEffect(() => {
      const f = requestAnimationFrame(() => {
        var _a, _b2;
        (_b2 = (_a = s.current) == null ? void 0 : _a.querySelector("[data-tab-index='0']")) == null ? void 0 : _b2.focus();
      });
      return () => cancelAnimationFrame(f);
    }, []), g.useEffect(() => {
      const f = (m) => {
        var _a;
        if (m.key === "Escape") {
          const p = document.activeElement;
          if (p && ((_a = s.current) == null ? void 0 : _a.contains(p)) && p.tagName === "INPUT") return;
          m.preventDefault(), ye.getState().setExpandedLayerId(null);
        }
      };
      return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
    }, []), g.useEffect(() => {
      const f = (m) => {
        s.current && !s.current.contains(m.target) && ye.getState().setExpandedLayerId(null);
      };
      return document.addEventListener("mousedown", f), () => document.removeEventListener("mousedown", f);
    }, []);
    const d = g.useCallback((f) => {
      if (f.key === "Escape" || (f.stopPropagation(), f.key !== "Tab" || !s.current)) return;
      f.preventDefault();
      const m = Array.from(s.current.querySelectorAll("[data-tab-index]")).sort((w, E) => Number(w.dataset.tabIndex) - Number(E.dataset.tabIndex));
      if (m.length === 0) return;
      const p = m.findIndex((w) => w === document.activeElement), v = f.shiftKey ? -1 : 1, b = p === -1 ? 0 : (p + v + m.length) % m.length;
      m[b].focus();
    }, []);
    return y.jsxs("div", {
      ref: s,
      role: "group",
      className: "mx-1 flex w-[calc(100%-8px)] flex-col gap-2 px-2.5 py-2",
      onClick: (f) => f.stopPropagation(),
      onKeyDown: d,
      onMouseDown: (f) => f.stopPropagation(),
      children: [
        y.jsx(g3, {
          label: "Name",
          value: l.name,
          isDark: n,
          onChange: (f) => c({
            name: f
          }),
          tabIdx: 0
        }),
        y.jsx("div", {
          className: Y("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsxs("div", {
          className: "flex flex-col gap-1.5",
          children: [
            y.jsx(Mf, {
              label: "Color",
              isDark: n
            }),
            y.jsx(h3, {
              color: l.color,
              isDark: n,
              onChange: (f) => c({
                color: f
              }),
              hexTabIdx: 1
            })
          ]
        }),
        y.jsx("div", {
          className: Y("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsxs("div", {
          className: "flex flex-col gap-1",
          children: [
            y.jsx(Mf, {
              label: "GDS",
              isDark: n
            }),
            y.jsx(kv, {
              label: "Layer",
              value: l.layerNumber,
              isDark: n,
              onChange: (f) => c({
                layerNumber: f
              }),
              tabIdx: 2
            }),
            y.jsx(kv, {
              label: "Datatype",
              value: l.datatype,
              isDark: n,
              onChange: (f) => c({
                datatype: f
              }),
              tabIdx: 3
            })
          ]
        }),
        y.jsx("div", {
          className: Y("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsxs("div", {
          className: "flex flex-col gap-1.5",
          children: [
            y.jsx(Mf, {
              label: "Fill",
              isDark: n
            }),
            y.jsx(m3, {
              value: l.fillPattern,
              isDark: n,
              onChange: (f) => c({
                fillPattern: f
              }),
              baseTabIdx: 4
            })
          ]
        })
      ]
    });
  }
  function y3({ layer: l, isActive: n, isExpanded: r, isDark: o, onSelect: s, onToggleExpand: c, startEditing: d }) {
    const [f, m] = g.useState(false), [p, v] = g.useState(l.name), b = g.useRef(null);
    g.useEffect(() => {
      d && (m(true), v(l.name), ye.getState().setEditingLayerId(null));
    }, [
      d,
      l.name
    ]), g.useEffect(() => {
      f && b.current && (b.current.focus(), b.current.select());
    }, [
      f
    ]);
    const w = we((L) => L.library), E = we((L) => L.renderer), k = g.useCallback(() => {
      const L = p.trim();
      if (L && L !== l.name && w && E) {
        const R = new b0(l, {
          ...l,
          name: L
        });
        de.getState().execute(R, {
          library: w,
          renderer: E
        });
      } else v(l.name);
      m(false);
    }, [
      p,
      l,
      w,
      E
    ]), S = g.useCallback((L) => {
      L.key === "Enter" ? k() : L.key === "Escape" && (v(l.name), m(false));
    }, [
      k,
      l.name
    ]), C = g.useCallback((L) => {
      L.preventDefault(), L.stopPropagation(), rc.getState().open("layer", {
        x: L.clientX,
        y: L.clientY
      }, String(l.id));
    }, [
      l.id
    ]), _ = g.useCallback((L) => {
      L.stopPropagation(), s(), c();
    }, [
      s,
      c
    ]);
    return y.jsxs("div", {
      className: "flex flex-col gap-0.5",
      children: [
        y.jsxs("button", {
          type: "button",
          className: Y("group relative mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-[7px] py-1.5 text-left transition-colors", n ? o ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : o ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90"),
          onClick: s,
          onContextMenu: C,
          onMouseDown: (L) => L.preventDefault(),
          tabIndex: -1,
          children: [
            y.jsx("span", {
              role: "img",
              className: Y("h-4.5 w-4.5 flex-shrink-0 cursor-pointer rounded border outline-none transition-shadow", o ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30", !l.visible && "opacity-40"),
              style: {
                backgroundColor: l.color
              },
              onClick: _,
              onKeyDown: () => {
              }
            }),
            y.jsx("div", {
              className: "relative h-5 min-w-0 flex-1",
              children: f ? y.jsx("input", {
                ref: b,
                type: "text",
                value: p,
                onChange: (L) => v(L.target.value),
                onBlur: k,
                onKeyDown: S,
                onClick: (L) => L.stopPropagation(),
                className: Y("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", o ? "text-white/90" : "text-gray-900")
              }) : y.jsx("span", {
                className: Y("absolute inset-0 truncate text-sm leading-5 select-none", !l.visible && "opacity-40"),
                onDoubleClick: (L) => {
                  L.stopPropagation(), m(true);
                },
                children: l.name
              })
            }),
            y.jsxs("div", {
              className: Y("flex flex-shrink-0 items-center self-center font-mono text-xs", !l.visible && "opacity-40"),
              children: [
                y.jsx("span", {
                  className: "select-none",
                  children: l.layerNumber
                }),
                y.jsx("span", {
                  className: "px-0.5 opacity-50 select-none",
                  children: "/"
                }),
                y.jsx("span", {
                  className: "select-none",
                  children: l.datatype
                })
              ]
            })
          ]
        }),
        r && y.jsx(p3, {
          layer: l,
          isDark: o
        })
      ]
    });
  }
  function b3() {
    const n = ge((b) => b.theme) === "dark", { getAllLayers: r, activeLayerId: o, setActiveLayer: s } = ye(), c = ye((b) => b.editingLayerId), d = ye((b) => b.expandedLayerId), f = ye((b) => b.setExpandedLayerId), m = r(), p = g.useRef(null), v = g.useCallback((b) => {
      const w = ye.getState().expandedLayerId;
      f(w === b ? null : b);
    }, [
      f
    ]);
    return y.jsx("div", {
      className: "flex h-full flex-col",
      children: y.jsx("div", {
        ref: p,
        className: "flex flex-1 flex-col gap-0.5 overflow-y-auto py-1",
        onWheel: (b) => b.stopPropagation(),
        children: m.map((b) => y.jsx(y3, {
          layer: b,
          isActive: b.id === o,
          isExpanded: d === b.id,
          isDark: n,
          onSelect: () => s(b.id),
          onToggleExpand: () => v(b.id),
          startEditing: c === b.id
        }, b.id))
      })
    });
  }
  function Ht({ label: l, value: n, unit: r, isDark: o, onChange: s, readOnly: c }) {
    const [d, f] = g.useState(false), [m, p] = g.useState(n), v = g.useRef(null), b = g.useRef(false), w = g.useRef(true);
    g.useEffect(() => (w.current = true, () => {
      w.current = false;
    }), []), g.useEffect(() => {
      d || p(n);
    }, [
      n,
      d
    ]), g.useEffect(() => {
      d && v.current && (v.current.focus(), v.current.select());
    }, [
      d
    ]);
    const E = g.useCallback(() => {
      if (b.current) {
        b.current = false, f(false);
        return;
      }
      if (!w.current) return;
      const S = Number.parseFloat(m);
      !Number.isNaN(S) && s && s(S), f(false);
    }, [
      m,
      s
    ]), k = g.useCallback((S) => {
      var _a, _b2;
      S.key === "Enter" ? (S.preventDefault(), (_a = v.current) == null ? void 0 : _a.blur()) : S.key === "Escape" && (S.preventDefault(), S.stopPropagation(), b.current = true, p(n), (_b2 = v.current) == null ? void 0 : _b2.blur());
    }, [
      n
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      "data-field": l,
      children: [
        y.jsx("span", {
          className: Y("text-xs select-none", c ? o ? "text-white/30" : "text-black/30" : o ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsxs("div", {
          className: "flex items-center gap-1",
          children: [
            d && !c ? y.jsx("input", {
              ref: v,
              type: "text",
              value: m,
              onChange: (S) => p(S.target.value),
              onBlur: E,
              onKeyDown: k,
              onClick: (S) => S.stopPropagation(),
              className: Y("w-20 rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none", o ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
            }) : y.jsx("button", {
              type: "button",
              onClick: () => {
                !c && s && f(true);
              },
              onFocus: () => {
                !c && s && f(true);
              },
              className: Y("w-20 rounded border border-transparent px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors", c ? o ? "text-white/30" : "text-black/30" : o ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
              tabIndex: c ? -1 : 0,
              children: n
            }),
            r && y.jsx("span", {
              className: Y("w-6 text-xs select-none", c ? o ? "text-white/20" : "text-black/20" : o ? "text-white/40" : "text-black/40"),
              children: r
            })
          ]
        })
      ]
    });
  }
  function v3({ label: l, value: n, isDark: r, onChange: o }) {
    const [s, c] = g.useState(false), [d, f] = g.useState(n), m = g.useRef(null), p = g.useRef(false), v = g.useRef(true);
    g.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), g.useEffect(() => {
      s || f(n);
    }, [
      n,
      s
    ]), g.useEffect(() => {
      s && m.current && (m.current.focus(), m.current.select());
    }, [
      s
    ]);
    const b = g.useCallback(() => {
      if (p.current) {
        p.current = false, c(false);
        return;
      }
      if (!v.current) return;
      const E = d.trim();
      E && E !== n && o(E), c(false);
    }, [
      d,
      n,
      o
    ]), w = g.useCallback((E) => {
      var _a, _b2;
      E.key === "Enter" ? (E.preventDefault(), (_a = m.current) == null ? void 0 : _a.blur()) : E.key === "Escape" && (E.preventDefault(), E.stopPropagation(), p.current = true, f(n), (_b2 = m.current) == null ? void 0 : _b2.blur());
    }, [
      n
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      "data-field": l,
      children: [
        y.jsx("span", {
          className: Y("text-xs select-none", r ? "text-white/50" : "text-black/50"),
          children: l
        }),
        s ? y.jsx("input", {
          ref: m,
          type: "text",
          value: d,
          onChange: (E) => f(E.target.value),
          onBlur: b,
          onKeyDown: w,
          onClick: (E) => E.stopPropagation(),
          className: Y("w-32 rounded border px-1.5 py-0.5 text-right text-xs outline-none", r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
        }) : y.jsx("button", {
          type: "button",
          onClick: () => c(true),
          onFocus: () => c(true),
          className: Y("w-32 truncate rounded border border-transparent px-1.5 py-0.5 text-right text-xs outline-none transition-colors", r ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
          tabIndex: 0,
          children: n
        })
      ]
    });
  }
  function x3({ label: l, value: n, isDark: r, onChange: o }) {
    const [s, c] = g.useState(false), [d, f] = g.useState(n), m = g.useRef(null), p = g.useRef(false), v = g.useRef(true);
    g.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), g.useEffect(() => {
      s || f(n);
    }, [
      n,
      s
    ]), g.useEffect(() => {
      s && m.current && (m.current.focus(), m.current.select());
    }, [
      s
    ]);
    const b = g.useCallback(() => {
      if (p.current) {
        p.current = false, c(false);
        return;
      }
      if (!v.current) return;
      const S = d.trim();
      S && S !== n && o(S), c(false);
    }, [
      d,
      n,
      o
    ]), w = g.useCallback((S) => {
      var _a, _b2;
      S.key === "Enter" && !S.shiftKey ? (S.preventDefault(), (_a = m.current) == null ? void 0 : _a.blur()) : S.key === "Escape" && (S.preventDefault(), S.stopPropagation(), p.current = true, f(n), (_b2 = m.current) == null ? void 0 : _b2.blur());
    }, [
      n
    ]), E = n.split(`
`), k = E.length > 2 ? `${E.slice(0, 2).join(`
`)}...` : n;
    return y.jsxs("div", {
      className: "px-3 py-1",
      "data-field": l,
      children: [
        y.jsx("div", {
          className: "flex items-center justify-between gap-2 pb-1",
          children: y.jsx("span", {
            className: Y("text-xs select-none", r ? "text-white/50" : "text-black/50"),
            children: l
          })
        }),
        s ? y.jsx("textarea", {
          ref: m,
          value: d,
          onChange: (S) => f(S.target.value),
          onBlur: b,
          onKeyDown: w,
          onClick: (S) => S.stopPropagation(),
          rows: Math.min(6, Math.max(2, d.split(`
`).length)),
          className: Y("w-full resize-none rounded border px-1.5 py-1 font-mono text-xs leading-relaxed outline-none", r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
        }) : y.jsx("button", {
          type: "button",
          onClick: () => c(true),
          onFocus: () => c(true),
          className: Y("w-full whitespace-pre-wrap rounded border border-transparent px-1.5 py-1 text-left font-mono text-xs leading-relaxed outline-none transition-colors", r ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
          tabIndex: 0,
          children: k || y.jsx("span", {
            className: r ? "text-white/30" : "text-black/30",
            children: "Empty"
          })
        })
      ]
    });
  }
  function jf({ currentLayer: l, currentDatatype: n, isDark: r, onChange: o }) {
    const s = ye((N) => N.getAllLayers)(), [c, d] = g.useState(`${l}:${n}`), [f, m] = g.useState(false), [p, v] = g.useState(-1);
    uc("layer-selector", f);
    const b = g.useRef(null), w = g.useRef(null), E = `${l}:${n}`;
    g.useEffect(() => {
      d(E);
    }, [
      E
    ]);
    const k = s.find((N) => `${N.layerNumber}:${N.datatype}` === c), [S, C] = g.useState({
      top: 0,
      right: 0,
      width: 0
    }), _ = g.useCallback(() => {
      if (!b.current) return;
      const N = b.current.getBoundingClientRect();
      C({
        top: N.bottom + 4,
        right: window.innerWidth - N.right,
        width: Math.max(N.width, 160)
      });
      const A = s.findIndex((H) => `${H.layerNumber}:${H.datatype}` === c);
      v(A >= 0 ? A : 0), m(true);
    }, [
      s,
      c
    ]), L = g.useCallback(() => {
      var _a;
      m(false), (_a = b.current) == null ? void 0 : _a.focus();
    }, []), R = g.useCallback((N) => {
      d(`${N.layerNumber}:${N.datatype}`), o(N.layerNumber, N.datatype), L();
    }, [
      o,
      L
    ]);
    g.useEffect(() => {
      f && w.current && w.current.focus();
    }, [
      f
    ]), g.useEffect(() => {
      if (!f) return;
      const N = (A) => {
        var _a, _b2;
        ((_a = b.current) == null ? void 0 : _a.contains(A.target)) || ((_b2 = w.current) == null ? void 0 : _b2.contains(A.target)) || m(false);
      };
      return document.addEventListener("mousedown", N), () => document.removeEventListener("mousedown", N);
    }, [
      f
    ]);
    const T = g.useCallback((N) => {
      (N.key === "ArrowDown" || N.key === "ArrowUp" || N.key === "Enter" || N.key === " ") && (N.preventDefault(), _());
    }, [
      _
    ]), B = g.useCallback((N) => {
      switch (N.key) {
        case "ArrowDown":
          N.preventDefault(), N.stopPropagation(), v((A) => Math.min(A + 1, s.length - 1));
          break;
        case "ArrowUp":
          N.preventDefault(), N.stopPropagation(), v((A) => Math.max(A - 1, 0));
          break;
        case "Enter":
        case " ": {
          N.preventDefault(), N.stopPropagation();
          const A = s[p];
          A && R(A);
          break;
        }
        case "Escape":
        case "Tab":
          N.preventDefault(), N.stopPropagation(), L();
          break;
      }
    }, [
      s,
      p,
      R,
      L
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      children: [
        y.jsx("span", {
          className: Y("text-xs select-none", r ? "text-white/50" : "text-black/50"),
          children: "Layer"
        }),
        y.jsxs("button", {
          ref: b,
          type: "button",
          onClick: () => f ? L() : _(),
          onKeyDown: T,
          className: Y("flex max-w-36 items-center gap-1.5 rounded-lg border px-1.5 py-0.5 text-xs outline-none transition-colors", r ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 focus-visible:border-white/40" : "border-black/10 bg-black/5 text-black/90 hover:bg-black/10 focus-visible:border-black/40"),
          children: [
            k && y.jsx("div", {
              className: Y("h-3 w-3 flex-shrink-0 rounded-sm border", r ? "border-white/10" : "border-black/10"),
              style: {
                backgroundColor: k.color
              }
            }),
            y.jsx("span", {
              className: "truncate",
              children: k ? k.name : `${l}/${n}`
            }),
            y.jsx("svg", {
              width: "12",
              height: "12",
              viewBox: "0 0 16 16",
              className: Y("flex-shrink-0 transition-transform", f && "rotate-180", r ? "text-white/40" : "text-black/40"),
              children: y.jsx("path", {
                d: "M4 6l4 4 4-4",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5"
              })
            })
          ]
        }),
        f && ni.createPortal(y.jsx("div", {
          ref: w,
          role: "listbox",
          tabIndex: -1,
          onKeyDown: B,
          className: Y("fixed z-50 overflow-y-auto rounded-xl border py-1 shadow-lg outline-none", r ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: {
            top: S.top,
            right: S.right,
            minWidth: S.width,
            maxHeight: 200
          },
          children: s.map((N, A) => {
            const z = `${N.layerNumber}:${N.datatype}` === c, P = A === p;
            return y.jsxs("div", {
              "data-layer-option": true,
              role: "option",
              "aria-selected": z,
              className: Y("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", P ? r ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? "text-white/70" : "text-black/70"),
              onMouseDown: (ee) => {
                ee.preventDefault(), R(N);
              },
              onMouseEnter: () => v(A),
              children: [
                y.jsx("div", {
                  className: Y("h-3.5 w-3.5 flex-shrink-0 rounded-sm border", r ? "border-white/10" : "border-black/10"),
                  style: {
                    backgroundColor: N.color
                  }
                }),
                y.jsx("span", {
                  className: "flex-1 truncate",
                  children: N.name
                }),
                y.jsxs("span", {
                  className: Y("flex-shrink-0 font-mono text-[11px]", r ? "text-white/40" : "text-black/40"),
                  children: [
                    N.layerNumber,
                    "/",
                    N.datatype
                  ]
                }),
                z && y.jsx("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 16 16",
                  className: Y("flex-shrink-0", r ? "text-white/70" : "text-black/70"),
                  children: y.jsx("path", {
                    d: "M3.5 8.5l3 3 6-7",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "1.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  })
                })
              ]
            }, N.id);
          })
        }), document.body)
      ]
    });
  }
  function w3({ sourceInfo: l, isDark: n }) {
    const [r, o] = g.useState(false), [s, c] = g.useState(l.code), d = g.useRef(null);
    g.useEffect(() => {
      c(l.code), o(false);
    }, [
      l.code,
      l.line
    ]);
    const f = g.useCallback(async () => {
      if (s.trim() === l.code.trim()) {
        o(false);
        return;
      }
      await xS({
        file: l.file,
        line: l.line,
        old_code: l.code,
        new_code: s
      }) && o(false);
    }, [
      s,
      l
    ]), m = l.file.split("/").pop() ?? l.file;
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx("div", {
          className: Y("px-3 pt-2.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
          children: "Source"
        }),
        y.jsxs("div", {
          className: "flex items-center justify-between gap-2 px-3 py-0.5",
          children: [
            y.jsx("span", {
              className: Y("text-xs select-none", n ? "text-white/50" : "text-black/50"),
              children: "Location"
            }),
            y.jsxs("span", {
              className: Y("text-xs font-mono tabular-nums select-all", n ? "text-white/80" : "text-black/80"),
              title: `${l.file}:${l.line}`,
              children: [
                m,
                ":",
                l.line
              ]
            })
          ]
        }),
        l.fn && l.fn !== "<module>" && y.jsxs("div", {
          className: "flex items-center justify-between gap-2 px-3 py-0.5",
          children: [
            y.jsx("span", {
              className: Y("text-xs select-none", n ? "text-white/50" : "text-black/50"),
              children: "Function"
            }),
            y.jsxs("span", {
              className: Y("text-xs font-mono select-all", n ? "text-white/80" : "text-black/80"),
              children: [
                l.fn,
                "()"
              ]
            })
          ]
        }),
        y.jsx("div", {
          className: "px-3 py-1",
          children: r ? y.jsx("textarea", {
            ref: d,
            className: Y("w-full rounded px-1.5 py-1 text-[11px] font-mono leading-tight resize-none border", n ? "bg-white/5 text-white/90 border-white/10 focus:border-blue-400/50" : "bg-black/5 text-black/90 border-black/10 focus:border-blue-500/50"),
            value: s,
            rows: Math.min(s.split(`
`).length + 1, 5),
            onChange: (p) => c(p.target.value),
            onKeyDown: (p) => {
              p.key === "Enter" && (p.metaKey || p.ctrlKey) && (p.preventDefault(), f()), p.key === "Escape" && (c(l.code), o(false));
            },
            onBlur: f,
            autoFocus: true
          }) : y.jsx("button", {
            type: "button",
            className: Y("w-full rounded px-1.5 py-1 text-left text-[11px] font-mono leading-tight", "cursor-pointer transition-colors", n ? "bg-white/5 text-white/70 hover:bg-white/10" : "bg-black/5 text-black/70 hover:bg-black/10"),
            onClick: () => o(true),
            title: "Click to edit source (Cmd+Enter to save, Escape to cancel)",
            children: l.code
          })
        })
      ]
    });
  }
  function Pt({ label: l, isDark: n }) {
    return y.jsx("div", {
      className: Y("px-3 pt-2.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function T1({ index: l, x: n, y: r, unit: o, isDark: s, canRemove: c, onChangeX: d, onChangeY: f, onRemove: m, readOnly: p }) {
    return y.jsxs("div", {
      "data-vertex-row": true,
      children: [
        y.jsxs("div", {
          className: "flex items-center justify-between px-3 pt-1.5 pb-0",
          children: [
            y.jsxs("span", {
              className: Y("text-[10px] font-mono select-none", s ? "text-white/30" : "text-black/30"),
              children: [
                "V",
                l
              ]
            }),
            !p && y.jsx("button", {
              type: "button",
              onClick: m,
              disabled: !c,
              className: Y("flex-shrink-0 rounded p-0.5 transition-colors", c ? s ? "text-white/40 hover:bg-white/10 hover:text-white/70" : "text-black/40 hover:bg-black/10 hover:text-black/70" : s ? "cursor-not-allowed text-white/10" : "cursor-not-allowed text-black/10"),
              tabIndex: c ? 0 : -1,
              children: y.jsx("svg", {
                width: "12",
                height: "12",
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                children: y.jsx("path", {
                  d: "M4 8h8",
                  strokeWidth: "1.5",
                  strokeLinecap: "round"
                })
              })
            })
          ]
        }),
        y.jsx(Ht, {
          label: "X",
          value: n,
          unit: o,
          isDark: s,
          onChange: d,
          readOnly: p
        }),
        y.jsx(Ht, {
          label: "Y",
          value: r,
          unit: o,
          isDark: s,
          onChange: f,
          readOnly: p
        })
      ]
    });
  }
  function Mv({ vertices: l, unitInfo: n, isDark: r, onChangeVertex: o, onRemoveVertex: s, onAddVertex: c, readOnly: d, label: f }) {
    const m = l.length / 2, p = m > 3, v = g.useRef(null), [b, w] = g.useState(null);
    g.useEffect(() => {
      if (b === null) return;
      const S = b;
      let C, _ = 0;
      const L = 10, R = () => {
        const T = v.current;
        if (!T) {
          w(null);
          return;
        }
        const B = T.querySelectorAll("[data-vertex-row]");
        if (B.length <= S) {
          if (_++, _ >= L) {
            w(null);
            return;
          }
          C = requestAnimationFrame(R);
          return;
        }
        T.scrollTop = T.scrollHeight;
        const N = B[B.length - 1];
        if (N) {
          const A = N.querySelector("[data-field='X'] button");
          A && A.focus();
        }
        w(null);
      };
      return C = requestAnimationFrame(R), () => cancelAnimationFrame(C);
    }, [
      b
    ]);
    const E = g.useCallback(() => {
      c(), w(m);
    }, [
      c,
      m
    ]), k = [];
    for (let S = 0; S < m; S++) {
      const C = l[S * 2], _ = l[S * 2 + 1], L = ft(C / ve, n), R = ft(-_ / ve, n);
      k.push(y.jsx(T1, {
        index: S,
        x: L,
        y: R,
        unit: n.unit,
        isDark: r,
        canRemove: p,
        onChangeX: (T) => o(S, "x", T),
        onChangeY: (T) => o(S, "y", T),
        onRemove: () => s(S),
        readOnly: d
      }, S));
    }
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(Pt, {
          label: f ?? "Vertices",
          isDark: r
        }),
        y.jsx("div", {
          ref: v,
          className: "flex max-h-48 flex-col overflow-y-auto",
          children: k
        }),
        !d && y.jsx("div", {
          className: "px-3 pt-1",
          children: y.jsxs("button", {
            type: "button",
            onClick: E,
            className: Y("flex w-full items-center justify-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors", r ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-black/10 text-black/50 hover:bg-black/5 hover:text-black/70"),
            children: [
              y.jsx("svg", {
                width: "12",
                height: "12",
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                children: y.jsx("path", {
                  d: "M8 4v8M4 8h8",
                  strokeWidth: "1.5",
                  strokeLinecap: "round"
                })
              }),
              "Add vertex"
            ]
          })
        })
      ]
    });
  }
  function S3() {
    const l = ae((s) => s.selectedIds), n = we((s) => s.library), [r, o] = g.useState(0);
    return g.useEffect(() => {
      if (!n || l.size === 0) return;
      let s;
      const c = () => {
        n.is_dirty() && o((d) => d + 1), s = requestAnimationFrame(c);
      };
      return s = requestAnimationFrame(c), () => cancelAnimationFrame(s);
    }, [
      n,
      l
    ]), g.useMemo(() => {
      if (l.size === 0 || !n) return null;
      let s = null;
      const c = l.values().next().value;
      if (c.startsWith("ref:")) {
        const w = n.get_cell_ref_info(c);
        if (w) {
          const [E, k, S, C, _, L] = w.transform, R = n.get_cell_origin_by_name(w.cell_name), T = R ? R[0] : 0, B = R ? R[1] : 0, A = Math.atan2(S, E) * 180 / Math.PI, H = Math.sqrt(E * E + S * S), z = n.get_cell_ref_array(c);
          let P = null;
          z && z.length === 4 && (P = {
            columns: z[0],
            rows: z[1],
            colSpacing: z[2],
            rowSpacing: z[3]
          }), s = {
            cellName: w.cell_name,
            x: E * T + k * B + _,
            y: S * T + C * B + L,
            tx: _,
            ty: L,
            rotation: A,
            scale: H,
            transform: new Float64Array(w.transform),
            childOriginX: T,
            childOriginY: B,
            array: P,
            refId: c,
            ids: [
              ...l
            ]
          }, w.free();
        }
      }
      const d = [];
      for (const w of l) {
        const E = n.get_element_info(w);
        E && (d.push({
          id: w,
          layer: E.layer,
          datatype: E.datatype,
          vertexCount: E.vertices.length / 2,
          vertices: new Float64Array(E.vertices)
        }), E.free());
      }
      if (d.length === 0) return null;
      const f = n.get_bounds_for_ids([
        ...l
      ]), m = f ? {
        minX: f[0],
        minY: f[1],
        maxX: f[2],
        maxY: f[3]
      } : null, p = d[0].layer, v = d[0].datatype, b = d.some((w) => w.layer !== p || w.datatype !== v);
      return {
        elements: d,
        bounds: m,
        isMixed: b,
        instance: s
      };
    }, [
      l,
      n,
      r
    ]);
  }
  const C3 = {
    unit: "\xB5m",
    scale: 1e3
  };
  function E3() {
    var _a;
    const n = ge((X) => X.theme) === "dark", r = C3, o = S3(), s = we((X) => X.library), c = we((X) => X.renderer), d = me((X) => X.activeCell);
    de((X) => X.undoStack.length + X.redoStack.length);
    const f = tn((X) => X.pathMetadata), m = ae((X) => X.selectedIds), p = Ot((X) => X.images), v = g.useMemo(() => {
      for (const X of m) if (Sn(X)) return Ur(X);
      return null;
    }, [
      m
    ]), b = v ? p.get(v) ?? null : null, w = s == null ? void 0 : s.get_cell_origin(), E = w ? {
      x: w[0],
      y: w[1]
    } : {
      x: 0,
      y: 0
    }, k = g.useRef(E);
    k.current = E;
    const S = g.useRef(void 0), C = g.useRef(void 0), _ = g.useCallback((X) => {
      if (!d || !s || !c || X === d) return;
      const se = new x0(d, X);
      de.getState().execute(se, {
        library: s,
        renderer: c
      });
    }, [
      d,
      s,
      c
    ]), L = g.useCallback((X, se) => {
      if (!s || !c) return;
      const he = se * r.scale, be = X === "y" ? -he * ve : he * ve, je = k.current, Me = new ZS(je.x, je.y, X === "x" ? be : je.x, X === "y" ? be : je.y);
      de.getState().execute(Me, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      r
    ]), R = g.useCallback((X, se) => {
      if (!o || !s || !c) return;
      const he = o.elements.map((je) => je.id), be = new Sy(he, X, se);
      de.getState().execute(be, {
        library: s,
        renderer: c
      }), o.elements.length === 1 && SS(o.elements[0].id, X, se);
    }, [
      o,
      s,
      c
    ]), T = g.useCallback((X) => {
      if (!s) return;
      let se = s.get_element_info(X);
      if (!se) {
        const he = ae.getState().selectedIds;
        if (he.size === 1) {
          const be = he.values().next().value;
          be && (se = s.get_element_info(be));
        }
      }
      se && (Ho(X, new Float64Array(se.vertices)), se.free());
    }, [
      s
    ]), B = g.useCallback((X, se) => {
      if (!(o == null ? void 0 : o.bounds) || !s || !c) return;
      const he = se * r.scale, be = X === "y" ? -he * ve : he * ve, je = o.elements.map((Pe) => Pe.id), Me = new qS(je, o.bounds.minX, o.bounds.minY, X === "x" ? be : o.bounds.minX, X === "y" ? be - (o.bounds.maxY - o.bounds.minY) : o.bounds.minY);
      de.getState().execute(Me, {
        library: s,
        renderer: c
      }), o.elements.length === 1 && T(o.elements[0].id);
    }, [
      o,
      s,
      c,
      r,
      T
    ]), N = g.useCallback((X, se) => {
      if (!(o == null ? void 0 : o.bounds) || !s || !c) return;
      const be = se * r.scale * ve;
      if (be <= 0) return;
      const je = o.bounds.maxX - o.bounds.minX, Me = o.bounds.maxY - o.bounds.minY, Pe = o.elements.map((ke) => ke.id), ht = new $S(Pe, o.bounds, X === "width" ? be : je, X === "height" ? be : Me);
      de.getState().execute(ht, {
        library: s,
        renderer: c
      }), o.elements.length === 1 && T(o.elements[0].id);
    }, [
      o,
      s,
      c,
      r,
      T
    ]), A = g.useCallback((X, se, he) => {
      if (!o || !s || !c) return;
      const be = o.elements[0];
      if (!be) return;
      const je = new Float64Array(be.vertices), Me = he * r.scale, Pe = se === "y" ? -Me * ve : Me * ve;
      je[X * 2 + (se === "x" ? 0 : 1)] = Pe;
      const ht = new zd(be.id, je, "Edit vertex");
      de.getState().execute(ht, {
        library: s,
        renderer: c
      }), Ho(be.id, je);
    }, [
      o,
      s,
      c,
      r
    ]), H = g.useCallback((X) => {
      if (!o || !s || !c) return;
      const se = o.elements[0];
      if (!se || se.vertexCount <= 3) return;
      const he = new Float64Array(se.vertices.length - 2);
      let be = 0;
      for (let Me = 0; Me < se.vertexCount; Me++) Me !== X && (he[be] = se.vertices[Me * 2], he[be + 1] = se.vertices[Me * 2 + 1], be += 2);
      const je = new zd(se.id, he, "Remove vertex");
      de.getState().execute(je, {
        library: s,
        renderer: c
      }), Ho(se.id, he);
    }, [
      o,
      s,
      c
    ]), z = g.useCallback(() => {
      if (!o || !s || !c) return;
      const X = o.elements[0];
      if (!X) return;
      const se = X.vertexCount, he = X.vertices[(se - 1) * 2], be = X.vertices[(se - 1) * 2 + 1], je = X.vertices[0], Me = X.vertices[1], Pe = (he + je) / 2, ht = (be + Me) / 2, ke = new Float64Array(X.vertices.length + 2);
      ke.set(X.vertices), ke[X.vertices.length] = Pe, ke[X.vertices.length + 1] = ht;
      const Xe = new zd(X.id, ke, "Add vertex");
      de.getState().execute(Xe, {
        library: s,
        renderer: c
      }), Ho(X.id, ke);
    }, [
      o,
      s,
      c
    ]), P = g.useRef(null);
    g.useEffect(() => {
      const X = P.current;
      if (!X) return;
      const se = (he) => {
        if (he.key !== "Escape" && he.key === "Tab") {
          he.stopPropagation(), he.preventDefault();
          const be = Array.from(X.querySelectorAll("input, textarea, button:not([tabindex='-1']):not([data-layer-option])"));
          if (be.length === 0) return;
          const je = be.indexOf(document.activeElement), Me = he.shiftKey ? (je - 1 + be.length) % be.length : (je + 1) % be.length;
          be[Me].focus();
        }
      };
      return X.addEventListener("keydown", se), () => X.removeEventListener("keydown", se);
    }, []);
    const ee = ge((X) => X.inspectorFocusRequested), J = ge((X) => X.inspectorFocusField);
    g.useEffect(() => {
      !ee || !P.current || (ge.getState().clearInspectorFocus(), requestAnimationFrame(() => {
        const X = P.current;
        if (!X) return;
        let se = null;
        if (J) {
          const he = X.querySelector(`[data-field="${J}"]`);
          he && (se = he.querySelector("button:not([tabindex='-1']), input, textarea"));
        }
        se || (se = X.querySelector("input, textarea, button:not([tabindex='-1']):not([data-layer-option])")), se && se.focus();
      }));
    }, [
      ee,
      J
    ]);
    const ce = g.useMemo(() => !o || o.elements.length !== 1 ? null : dr(o.elements[0].id), [
      o
    ]), fe = g.useCallback((X) => {
      const se = S.current, he = C.current;
      if (!se || !he || !s || !c || !ae.getState().selectedIds.has(he)) return;
      const be = X * r.scale * ve;
      if (be <= 0) return;
      const je = new ks(he, se, {
        ...se,
        width: be
      }, "Change path width");
      de.getState().execute(je, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      r
    ]), Se = g.useCallback((X) => {
      const se = S.current, he = C.current;
      if (!se || !he || !s || !c || !ae.getState().selectedIds.has(he)) return;
      const be = X * r.scale * ve;
      if (be < 0) return;
      const je = new ks(he, se, {
        ...se,
        cornerRadius: be
      }, "Change path corner radius");
      de.getState().execute(je, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      r
    ]), $ = g.useCallback((X, se, he) => {
      const be = S.current, je = C.current;
      if (!be || !je || !s || !c || !ae.getState().selectedIds.has(je)) return;
      const Me = he * r.scale, Pe = se === "y" ? -Me * ve : Me * ve, ht = be.waypoints.map((Xe, Ue) => Ue !== X ? Xe : se === "x" ? {
        x: Pe,
        y: Xe.y
      } : {
        x: Xe.x,
        y: Pe
      }), ke = new ks(je, be, {
        ...be,
        waypoints: ht
      }, "Edit path waypoint");
      de.getState().execute(ke, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      r
    ]);
    if (!o && b) {
      const X = ft(b.x / ve, r), se = ft(-b.y / ve, r), he = ft(b.width / ve, r), be = ft(b.height / ve, r), je = b.lockAspectRatio, Me = (ke, Xe) => {
        if (!s || !c || !v) return;
        const Ue = Ot.getState().images.get(v);
        if (!Ue) return;
        const wt = Xe * r.scale, mt = ke === "y" ? -wt * ve : wt * ve, ln = new JS(v, Ue.x, Ue.y, ke === "x" ? mt : Ue.x, ke === "y" ? mt : Ue.y);
        de.getState().execute(ln, {
          library: s,
          renderer: c
        });
      }, Pe = (ke, Xe) => {
        if (!s || !c || !v) return;
        const Ue = Ot.getState().images.get(v);
        if (!Ue) return;
        const mt = Xe * r.scale * ve;
        if (mt <= 0) return;
        let ln, hn;
        if (Ue.lockAspectRatio) {
          const il = Ue.naturalHeight / Ue.naturalWidth;
          ke === "width" ? (ln = mt, hn = mt * il) : (hn = mt, ln = mt / il);
        } else ln = ke === "width" ? mt : Ue.width, hn = ke === "height" ? mt : Ue.height;
        const jt = new t2(v, Ue.width, Ue.height, ln, hn);
        de.getState().execute(jt, {
          library: s,
          renderer: c
        });
      }, ht = () => {
        v && Ot.getState().updateImage(v, {
          lockAspectRatio: !je
        });
      };
      return y.jsxs("div", {
        ref: P,
        className: "flex flex-col pb-2",
        onWheel: (ke) => ke.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsx("span", {
              className: Y("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: "Image"
            })
          }),
          y.jsx("div", {
            className: Y("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Pt, {
            label: "File",
            isDark: n
          }),
          y.jsxs("div", {
            className: "flex items-center justify-between gap-2 px-3 py-1",
            children: [
              y.jsx("span", {
                className: Y("text-xs select-none", n ? "text-white/50" : "text-black/50"),
                children: "Name"
              }),
              y.jsx("span", {
                className: Y("max-w-32 truncate text-right text-xs", n ? "text-white/90" : "text-black/90"),
                title: b.filename,
                children: b.filename
              })
            ]
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Pt, {
            label: "Position",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "X",
            value: X,
            unit: r.unit,
            isDark: n,
            onChange: (ke) => Me("x", ke)
          }),
          y.jsx(Ht, {
            label: "Y",
            value: se,
            unit: r.unit,
            isDark: n,
            onChange: (ke) => Me("y", ke)
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Pt, {
            label: "Size",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "W",
            value: he,
            unit: r.unit,
            isDark: n,
            onChange: (ke) => Pe("width", ke)
          }),
          y.jsx(Ht, {
            label: "H",
            value: be,
            unit: r.unit,
            isDark: n,
            onChange: (ke) => Pe("height", ke)
          }),
          y.jsxs("div", {
            className: "flex items-center justify-between gap-2 px-3 py-1.5",
            children: [
              y.jsx("span", {
                className: Y("text-xs select-none", n ? "text-white/50" : "text-black/50"),
                children: "Lock ratio"
              }),
              y.jsxs("button", {
                type: "button",
                onClick: ht,
                className: Y("flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-xs transition-colors", je ? n ? "border-white/20 bg-white/10 text-white/80" : "border-black/20 bg-black/10 text-black/80" : n ? "border-white/10 text-white/40 hover:text-white/60" : "border-black/10 text-black/40 hover:text-black/60"),
                children: [
                  y.jsx("svg", {
                    width: "12",
                    height: "12",
                    viewBox: "0 0 16 16",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "1.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: je ? y.jsxs(y.Fragment, {
                      children: [
                        y.jsx("rect", {
                          x: "3",
                          y: "7",
                          width: "10",
                          height: "7",
                          rx: "1"
                        }),
                        y.jsx("path", {
                          d: "M5 7V5a3 3 0 0 1 6 0v2"
                        })
                      ]
                    }) : y.jsxs(y.Fragment, {
                      children: [
                        y.jsx("rect", {
                          x: "3",
                          y: "7",
                          width: "10",
                          height: "7",
                          rx: "1"
                        }),
                        y.jsx("path", {
                          d: "M5 7V5a3 3 0 0 1 6 0"
                        })
                      ]
                    })
                  }),
                  je ? "On" : "Off"
                ]
              })
            ]
          })
        ]
      });
    }
    if (!o) {
      const X = ft(E.x / ve, r), se = ft(-E.y / ve, r);
      return y.jsxs("div", {
        ref: P,
        className: "flex flex-col pb-2",
        onWheel: (he) => he.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsx("span", {
              className: Y("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: "Cell"
            })
          }),
          y.jsx("div", {
            className: Y("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Pt, {
            label: "Name",
            isDark: n
          }),
          d ? y.jsx(v3, {
            label: "Name",
            value: d,
            isDark: n,
            onChange: _
          }) : y.jsx("div", {
            className: "px-3 py-1",
            children: y.jsx("span", {
              className: Y("text-xs italic select-none", n ? "text-white/40" : "text-black/40"),
              children: "No cell"
            })
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Pt, {
            label: "Origin",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "X",
            value: X,
            unit: r.unit,
            isDark: n,
            onChange: (he) => L("x", he)
          }),
          y.jsx(Ht, {
            label: "Y",
            value: se,
            unit: r.unit,
            isDark: n,
            onChange: (he) => L("y", he)
          })
        ]
      });
    }
    const { elements: F, bounds: ie, isMixed: Ee } = o, pe = F.length === 1, j = F[0], D = F.every((X) => X.id.startsWith("ref:")) || s != null && s.get_group_ids(j.id).length > 1 || ((_a = dr(j.id)) == null ? void 0 : _a.type) === "ref";
    if (pe && s && s.is_text_element(j.id)) {
      const X = s.get_text_element_info(j.id);
      if (X) {
        const se = ft(X.x / ve, r), he = ft(-X.y / ve, r), be = ft(X.height / ve, r), je = (ke, Xe) => {
          if (!c) return;
          const Ue = Xe * r.scale, wt = ke === "y" ? -Ue * ve : Ue * ve, mt = new QS(j.id, X.x, X.y, ke === "x" ? wt : X.x, ke === "y" ? wt : X.y);
          de.getState().execute(mt, {
            library: s,
            renderer: c
          });
        }, Me = (ke) => {
          if (!c || ke === X.text) return;
          const Xe = new KS(j.id, X.text, ke);
          de.getState().execute(Xe, {
            library: s,
            renderer: c
          }), we.getState().bumpSyncGeneration();
        }, Pe = (ke) => {
          if (!c) return;
          const Ue = ke * r.scale * ve;
          if (Ue <= 0) return;
          const wt = new FS(j.id, X.height, Ue);
          de.getState().execute(wt, {
            library: s,
            renderer: c
          }), we.getState().bumpSyncGeneration();
        }, ht = (ke, Xe) => {
          if (!c) return;
          const Ue = new Sy([
            j.id
          ], ke, Xe);
          de.getState().execute(Ue, {
            library: s,
            renderer: c
          }), we.getState().bumpSyncGeneration();
        };
        return y.jsxs("div", {
          ref: P,
          className: "flex flex-col pb-2",
          onWheel: (ke) => ke.stopPropagation(),
          children: [
            y.jsx("div", {
              className: "px-3 pt-2 pb-1",
              children: y.jsx("span", {
                className: Y("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
                children: "Text"
              })
            }),
            y.jsx("div", {
              className: Y("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Pt, {
              label: "Layer",
              isDark: n
            }),
            y.jsx(jf, {
              currentLayer: X.layer,
              currentDatatype: X.datatype,
              isDark: n,
              onChange: ht
            }),
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Pt, {
              label: "Content",
              isDark: n
            }),
            y.jsx(x3, {
              label: "Text",
              value: X.text,
              isDark: n,
              onChange: Me
            }),
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Pt, {
              label: "Position",
              isDark: n
            }),
            y.jsx(Ht, {
              label: "X",
              value: se,
              unit: r.unit,
              isDark: n,
              onChange: (ke) => je("x", ke)
            }),
            y.jsx(Ht, {
              label: "Y",
              value: he,
              unit: r.unit,
              isDark: n,
              onChange: (ke) => je("y", ke)
            }),
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Pt, {
              label: "Size",
              isDark: n
            }),
            y.jsx(Ht, {
              label: "Size",
              value: be,
              unit: r.unit,
              isDark: n,
              onChange: Pe
            }),
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx("div", {
              className: "px-3 pt-2",
              children: y.jsx("button", {
                type: "button",
                onClick: () => {
                  if (!c) return;
                  const ke = new k0([
                    j.id
                  ]);
                  de.getState().execute(ke, {
                    library: s,
                    renderer: c
                  });
                },
                className: Y("flex w-full items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs transition-colors", n ? "border-white/10 text-white/60 hover:bg-white/5 hover:text-white/80" : "border-black/10 text-black/60 hover:bg-black/5 hover:text-black/80"),
                children: "Convert to Polygons"
              })
            })
          ]
        });
      }
    }
    const O = pe && j ? f.get(j.id) : void 0;
    if (S.current = O, C.current = j == null ? void 0 : j.id, O && pe) {
      const X = ft(O.width / ve, r), se = ft(O.cornerRadius / ve, r), he = ie ? ft(ie.minX / ve, r) : "\u2014", be = ie ? ft(-ie.maxY / ve, r) : "\u2014", je = O.waypoints.map((Me, Pe) => {
        const ht = ft(Me.x / ve, r), ke = ft(-Me.y / ve, r);
        return y.jsx(T1, {
          index: Pe,
          x: ht,
          y: ke,
          unit: r.unit,
          isDark: n,
          canRemove: O.waypoints.length > 2,
          onChangeX: (Xe) => $(Pe, "x", Xe),
          onChangeY: (Xe) => $(Pe, "y", Xe),
          onRemove: () => {
            if (O.waypoints.length <= 2) return;
            const Xe = S.current, Ue = C.current;
            if (!Xe || !Ue || !s || !c) return;
            const wt = Xe.waypoints.filter((ln, hn) => hn !== Pe), mt = new ks(Ue, Xe, {
              ...Xe,
              waypoints: wt
            }, "Remove path waypoint");
            de.getState().execute(mt, {
              library: s,
              renderer: c
            });
          }
        }, Pe);
      });
      return y.jsxs("div", {
        ref: P,
        className: "flex flex-col pb-2",
        onWheel: (Me) => Me.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsxs("span", {
              className: Y("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: [
                "Path \xB7 ",
                O.waypoints.length,
                " waypoints"
              ]
            })
          }),
          y.jsx("div", {
            className: Y("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Pt, {
            label: "Layer",
            isDark: n
          }),
          y.jsx(jf, {
            currentLayer: j.layer,
            currentDatatype: j.datatype,
            isDark: n,
            onChange: R
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Pt, {
            label: "Path",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "Width",
            value: X,
            unit: r.unit,
            isDark: n,
            onChange: fe
          }),
          y.jsx(Ht, {
            label: "Radius",
            value: se,
            unit: r.unit,
            isDark: n,
            onChange: Se
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Pt, {
            label: "Position",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "X",
            value: he,
            unit: r.unit,
            isDark: n,
            onChange: (Me) => B("x", Me)
          }),
          y.jsx(Ht, {
            label: "Y",
            value: be,
            unit: r.unit,
            isDark: n,
            onChange: (Me) => B("y", Me)
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Pt, {
            label: "Waypoints",
            isDark: n
          }),
          y.jsx("div", {
            className: "flex max-h-48 flex-col overflow-y-auto",
            children: je
          })
        ]
      });
    }
    const Z = ie ? ft(ie.minX / ve, r) : "\u2014", Q = ie ? ft(-ie.maxY / ve, r) : "\u2014", oe = ie ? ft((ie.maxX - ie.minX) / ve, r) : "\u2014", ue = ie ? ft((ie.maxY - ie.minY) / ve, r) : "\u2014", _e = D || pe;
    return y.jsxs("div", {
      ref: P,
      className: "flex flex-col pb-2",
      onWheel: (X) => X.stopPropagation(),
      children: [
        y.jsx("div", {
          className: "px-3 pt-2 pb-1",
          children: y.jsx("span", {
            className: Y("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
            children: pe ? `Polygon \xB7 ${j.vertexCount} vertices` : `${F.length} elements`
          })
        }),
        y.jsx("div", {
          className: Y("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        !D && y.jsxs(y.Fragment, {
          children: [
            y.jsx(Pt, {
              label: "Layer",
              isDark: n
            }),
            Ee ? y.jsxs("div", {
              className: "flex items-center justify-between gap-2 px-3 py-1",
              children: [
                y.jsx("span", {
                  className: Y("text-xs select-none", n ? "text-white/50" : "text-black/50"),
                  children: "Layer"
                }),
                y.jsx("span", {
                  className: Y("text-xs italic select-none", n ? "text-white/40" : "text-black/40"),
                  children: "Mixed"
                })
              ]
            }) : y.jsx(jf, {
              currentLayer: j.layer,
              currentDatatype: j.datatype,
              isDark: n,
              onChange: R
            }),
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            })
          ]
        }),
        y.jsx(Pt, {
          label: "Position",
          isDark: n
        }),
        y.jsx(Ht, {
          label: "X",
          value: Z,
          unit: r.unit,
          isDark: n,
          onChange: _e ? (X) => B("x", X) : void 0,
          readOnly: !_e
        }),
        y.jsx(Ht, {
          label: "Y",
          value: Q,
          unit: r.unit,
          isDark: n,
          onChange: _e ? (X) => B("y", X) : void 0,
          readOnly: !_e
        }),
        y.jsx("div", {
          className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsx(Pt, {
          label: "Size",
          isDark: n
        }),
        y.jsx(Ht, {
          label: "W",
          value: oe,
          unit: r.unit,
          isDark: n,
          onChange: pe && !D ? (X) => N("width", X) : void 0,
          readOnly: !pe || D
        }),
        y.jsx(Ht, {
          label: "H",
          value: ue,
          unit: r.unit,
          isDark: n,
          onChange: pe && !D ? (X) => N("height", X) : void 0,
          readOnly: !pe || D
        }),
        (pe || D) && y.jsxs(y.Fragment, {
          children: [
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            D && !pe ? F.map((X, se) => y.jsx(Mv, {
              vertices: X.vertices,
              unitInfo: r,
              isDark: n,
              onChangeVertex: A,
              onRemoveVertex: H,
              onAddVertex: z,
              readOnly: true,
              label: F.length > 1 ? `Vertices (${se + 1}/${F.length})` : void 0
            }, X.id)) : y.jsx(Mv, {
              vertices: j.vertices,
              unitInfo: r,
              isDark: n,
              onChangeVertex: A,
              onRemoveVertex: H,
              onAddVertex: z,
              readOnly: D
            })
          ]
        }),
        ce && y.jsxs(y.Fragment, {
          children: [
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(w3, {
              sourceInfo: ce,
              isDark: n
            })
          ]
        })
      ]
    });
  }
  const N1 = [
    {
      id: "layers",
      icon: D4,
      label: "Layers",
      shortcut: "L"
    },
    {
      id: "inspector",
      icon: J_,
      label: "Inspector",
      shortcut: "I"
    }
  ];
  function _3({ isDark: l, onExpand: n }) {
    return y.jsx("div", {
      className: Y("fixed top-4 right-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border py-1", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: N1.map((r) => {
        const o = r.icon;
        return y.jsx(qn, {
          label: r.label,
          shortcut: {
            modifiers: [
              Ie.shift
            ],
            key: r.shortcut
          },
          position: "left",
          children: y.jsx("button", {
            onClick: () => n(r.id),
            className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
            children: y.jsx("div", {
              className: "flex h-4 w-4 items-center justify-center",
              children: y.jsx(o, {
                className: Y("h-4 w-4", l ? "text-white/60" : "text-black/60")
              })
            })
          })
        }, r.id);
      })
    });
  }
  function jv() {
    const n = ge((L) => L.theme) === "dark", r = ge((L) => L.sidebarCollapsed), o = ge((L) => L.toggleSidebarCollapsed), s = ge((L) => L.sidebarWidth), c = ge((L) => L.setSidebarWidth), { isSm: d } = hh(), { handleProps: f } = M1({
      side: "right",
      width: s,
      onResize: c
    }), m = ge((L) => L.sidebarTab), p = ge((L) => L.setSidebarTab), v = Fo((L) => L.isMinimized), [b, w] = g.useState(false), E = g.useRef(null);
    g.useEffect(() => {
      if (!d || !b) return;
      const L = (R) => {
        E.current && !E.current.contains(R.target) && w(false);
      };
      return document.addEventListener("mousedown", L), () => document.removeEventListener("mousedown", L);
    }, [
      d,
      b
    ]);
    const k = g.useCallback((L) => {
      p(L), d ? w(true) : o();
    }, [
      d,
      o,
      p
    ]), C = (v ? 0 : 206) + 24;
    if (r && !(d && b)) return y.jsx(_3, {
      isDark: n,
      onExpand: k
    });
    const _ = d && b;
    return y.jsxs(y.Fragment, {
      children: [
        _ && y.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        y.jsxs("div", {
          ref: E,
          className: Y("fixed top-4 right-4 z-40 rounded-xl border", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", _ && "shadow-xl"),
          style: {
            width: s
          },
          children: [
            y.jsx("div", {
              ...f
            }),
            y.jsxs("div", {
              className: "flex items-center gap-1 px-1 pt-1 pb-[3px]",
              children: [
                N1.map((L) => {
                  const R = L.icon, T = m === L.id;
                  return y.jsx(qn, {
                    label: L.label,
                    shortcut: {
                      modifiers: [
                        Ie.shift
                      ],
                      key: L.shortcut
                    },
                    children: y.jsx("button", {
                      onClick: () => p(L.id),
                      className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", T && (n ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: y.jsx("div", {
                        className: "flex h-4 w-4 items-center justify-center",
                        children: y.jsx(R, {
                          className: Y("h-4 w-4", n ? "text-white/90" : "text-black/90")
                        })
                      })
                    })
                  }, L.id);
                }),
                !d && y.jsx("button", {
                  type: "button",
                  onClick: o,
                  className: Y("ml-auto cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: y.jsx(S1, {
                    className: Y("h-4 w-4", n ? "text-white/60" : "text-black/60")
                  })
                })
              ]
            }),
            y.jsx("div", {
              className: Y("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            y.jsxs("div", {
              className: "overflow-y-auto",
              style: {
                maxHeight: `calc(100vh - ${70 + C}px)`
              },
              onWheel: (L) => L.stopPropagation(),
              children: [
                m === "layers" && y.jsx(b3, {}),
                m === "inspector" && y.jsx(E3, {})
              ]
            })
          ]
        })
      ]
    });
  }
  const k3 = (l) => {
    const n = 1 / (l * ve), r = Xv * n, o = oh(l), s = r / o.scale, c = cS.find((f) => f >= s) ?? s, d = o.unit === "mm" && c >= 1e3 ? c.toExponential(1) : c;
    return {
      length: c * o.scale,
      label: `${d} ${o.unit}`
    };
  }, Lv = "0.1.3";
  function M3({ isDark: l }) {
    return y.jsxs("div", {
      className: "group relative flex items-center gap-1.5",
      children: [
        y.jsx("div", {
          className: "h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500"
        }),
        y.jsxs("span", {
          className: Y("text-[10px] select-none", l ? "text-white/40" : "text-black/40"),
          children: [
            "v",
            Lv
          ]
        }),
        y.jsxs("div", {
          className: Y("pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-56 rounded-lg border p-2.5 text-[11px] leading-relaxed opacity-0 transition-opacity group-hover:opacity-100", l ? "border-white/10 bg-[rgb(29,29,29)] text-white/70" : "border-black/10 bg-[rgb(241,241,241)] text-black/70"),
          children: [
            y.jsxs("span", {
              className: Y("font-medium", l ? "text-white/90" : "text-black/90"),
              children: [
                "Rosette v",
                Lv,
                " Beta"
              ]
            }),
            y.jsx("p", {
              className: "mt-1.5",
              children: "Features may be unstable or incomplete. Not suitable for production use."
            })
          ]
        })
      ]
    });
  }
  function j3({ isDark: l }) {
    const n = Dt((o) => o.message), r = Dt((o) => o.level);
    return n ? y.jsx("div", {
      className: "flex min-w-0 flex-1 items-center justify-center",
      children: y.jsx("span", {
        className: Y("truncate text-[11px] select-none", r === "warn" && (l ? "text-yellow-400/80" : "text-yellow-600/80"), r === "error" && (l ? "text-red-400/80" : "text-red-600/80"), r === "info" && (l ? "text-white/50" : "text-black/50")),
        children: n
      })
    }) : y.jsx("div", {
      className: "flex-1"
    });
  }
  function L3({ isDark: l }) {
    const n = ae((m) => m.selectedIds), r = we((m) => m.library), o = ye((m) => m.layers), s = tn((m) => m.pathMetadata), c = g.useMemo(() => {
      const m = n.size;
      if (m === 0 || !r) return null;
      const p = n.values().next().value, v = p.startsWith("ref:");
      if (m === 1 && v) {
        const S = r.get_cell_ref_info(p);
        if (S) {
          const C = S.cell_name;
          return S.free(), {
            label: `Instance "${C}"`,
            layerNumber: null,
            datatype: null
          };
        }
      }
      if (m === 1 && r.is_text_element(p)) {
        const S = r.get_text_element_info(p);
        if (S) return {
          label: `Text "${S.text.length > 20 ? S.text.slice(0, 20) + "\u2026" : S.text}"`,
          layerNumber: S.layer,
          datatype: S.datatype
        };
      }
      if (m === 1) {
        const S = s.get(p);
        if (S) return {
          label: `Path \xB7 ${S.waypoints.length} waypoints`,
          layerNumber: S.layer,
          datatype: S.datatype
        };
      }
      let b = null, w = null, E = false, k = 0;
      for (const S of n) {
        const C = r.get_element_info(S);
        if (C && (b === null ? (b = C.layer, w = C.datatype) : (C.layer !== b || C.datatype !== w) && (E = true), m === 1 && (k = C.vertices.length / 2), C.free(), E && m > 1)) break;
      }
      return m === 1 ? {
        label: `Polygon \xB7 ${k} vertices`,
        layerNumber: b,
        datatype: w
      } : E ? {
        label: `${m} elements \xB7 Mixed layers`,
        layerNumber: null,
        datatype: null
      } : {
        label: `${m} elements`,
        layerNumber: b,
        datatype: w
      };
    }, [
      n,
      r,
      s
    ]);
    if (!c) return null;
    const d = g.useMemo(() => {
      if (c.layerNumber === null) return null;
      for (const m of o.values()) if (m.layerNumber === c.layerNumber && m.datatype === c.datatype) return {
        name: m.name,
        color: m.color
      };
      return null;
    }, [
      c,
      o
    ]), f = c.layerNumber !== null ? ` \xB7 ${(d == null ? void 0 : d.name) ? `${c.layerNumber}/${c.datatype} ${d.name}` : `${c.layerNumber}/${c.datatype}`}` : "";
    return y.jsxs("div", {
      className: "flex min-w-0 flex-1 items-center justify-center gap-1.5",
      children: [
        d && y.jsx("div", {
          className: "h-2 w-2 flex-shrink-0 rounded-full -translate-y-px",
          style: {
            backgroundColor: d.color
          }
        }),
        y.jsxs("span", {
          className: Y("truncate text-[11px] select-none", l ? "text-white/50" : "text-black/50"),
          children: [
            c.label,
            f
          ]
        })
      ]
    });
  }
  function R3({ isDark: l }) {
    const n = Dt((o) => o.message), r = ae((o) => o.selectedIds.size > 0);
    return n ? y.jsx(j3, {
      isDark: l
    }) : r ? y.jsx(L3, {
      isDark: l
    }) : y.jsx("div", {
      className: "flex-1"
    });
  }
  function Rv({ isDark: l, widthInPixels: n, label: r }) {
    return y.jsxs("div", {
      className: "flex items-center gap-1.5",
      children: [
        y.jsx("div", {
          className: Y("h-px", l ? "bg-white/50" : "bg-black/50"),
          style: {
            width: `${Math.max(n, 20)}px`
          }
        }),
        y.jsx("span", {
          className: Y("text-[10px] select-none pointer-events-none", l ? "text-white/40" : "text-black/40"),
          children: r
        })
      ]
    });
  }
  function Av({ compact: l = false, minimal: n = false }) {
    const r = ge((L) => {
      var _a;
      return (_a = L.cursorWorld) == null ? void 0 : _a.x;
    }), o = ge((L) => {
      var _a;
      return (_a = L.cursorWorld) == null ? void 0 : _a.y;
    }), s = ge((L) => L.theme), c = Oe((L) => L.zoom), d = ge((L) => L.zenMode), f = ge((L) => L.toggleZenMode), m = Fo((L) => L.isMinimized), p = Fo((L) => L.toggle), v = s === "dark", b = g.useMemo(() => oh(c), [
      c
    ]), w = g.useMemo(() => r !== void 0 ? ft(r, b) : "\u2014", [
      r,
      b
    ]), E = g.useMemo(() => o !== void 0 ? ft(o, b) : "\u2014", [
      o,
      b
    ]), { length: k, label: S } = g.useMemo(() => k3(c), [
      c
    ]), C = Math.min(k * c * ve, sS), _ = !l && !n;
    return y.jsxs("div", {
      className: "relative flex-shrink-0",
      children: [
        !_ && y.jsx("div", {
          className: "absolute bottom-full right-3 mb-2 font-mono text-[11px]",
          children: y.jsx(Rv, {
            isDark: v,
            widthInPixels: C,
            label: S
          })
        }),
        y.jsxs("div", {
          className: Y("flex h-6 items-center border-t px-3 font-mono text-[11px]", v ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          children: [
            y.jsxs("div", {
              className: "flex min-w-0 flex-shrink-0 items-center gap-1.5",
              children: [
                !l && !n && y.jsxs(y.Fragment, {
                  children: [
                    y.jsx(M3, {
                      isDark: v
                    }),
                    y.jsx("span", {
                      className: Y("mx-1 select-none pointer-events-none", v ? "text-white/20" : "text-black/20"),
                      children: "\xB7"
                    })
                  ]
                }),
                n ? y.jsxs("span", {
                  className: Y("text-[10px] select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                  children: [
                    w,
                    ", ",
                    E,
                    " ",
                    b.unit
                  ]
                }) : y.jsxs(y.Fragment, {
                  children: [
                    y.jsx("span", {
                      className: Y("select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "x:"
                    }),
                    y.jsx("span", {
                      className: Y("w-18 text-right select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: w
                    }),
                    y.jsx("span", {
                      className: Y("text-[10px] select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: b.unit
                    }),
                    y.jsx("span", {
                      className: Y("mx-1 select-none pointer-events-none", v ? "text-white/20" : "text-black/20"),
                      children: "\xB7"
                    }),
                    y.jsx("span", {
                      className: Y("select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "y:"
                    }),
                    y.jsx("span", {
                      className: Y("w-18 text-right select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: E
                    }),
                    y.jsx("span", {
                      className: Y("text-[10px] select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: b.unit
                    })
                  ]
                })
              ]
            }),
            !n && y.jsx(R3, {
              isDark: v
            }),
            n && y.jsx("div", {
              className: "flex-1"
            }),
            y.jsxs("div", {
              className: "flex flex-shrink-0 items-center gap-2",
              children: [
                _ && y.jsx(Rv, {
                  isDark: v,
                  widthInPixels: C,
                  label: S
                }),
                y.jsx(qn, {
                  label: "Zen Mode",
                  position: "top",
                  children: y.jsx("button", {
                    onClick: f,
                    className: Y("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", d && (v ? "bg-white/10" : "bg-black/10")),
                    children: y.jsx(LM, {
                      width: 14,
                      height: 14,
                      className: Y(v ? "text-white/50" : "text-black/50")
                    })
                  })
                }),
                y.jsx(qn, {
                  label: "Minimap",
                  position: "top",
                  align: "end",
                  children: y.jsx("button", {
                    onClick: p,
                    className: Y("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", !m && (v ? "bg-white/10" : "bg-black/10")),
                    children: y.jsx(tM, {
                      width: 14,
                      height: 14,
                      className: Y(v ? "text-white/50" : "text-black/50")
                    })
                  })
                })
              ]
            })
          ]
        })
      ]
    });
  }
  function A3({ title: l, titleId: n, ...r }, o) {
    return g.createElement("svg", Object.assign({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      "aria-hidden": "true",
      "data-slot": "icon",
      ref: o,
      "aria-labelledby": n
    }, r), l ? g.createElement("title", {
      id: n
    }, l) : null, g.createElement("path", {
      d: "M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 1 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06ZM14.95 3.05a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 8ZM14 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 8ZM7.172 10.828a.75.75 0 0 1 0 1.061L6.11 12.95a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM10.766 7.51a.75.75 0 0 0-1.37.365l-.492 6.861a.75.75 0 0 0 1.204.65l1.043-.799.985 3.678a.75.75 0 0 0 1.45-.388l-.978-3.646 1.292.204a.75.75 0 0 0 .74-1.16l-3.874-5.764Z"
    }));
  }
  const gh = g.forwardRef(A3);
  function T3({ title: l, titleId: n, ...r }, o) {
    return g.createElement("svg", Object.assign({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      stroke: "currentColor",
      "aria-hidden": "true",
      "data-slot": "icon",
      ref: o,
      "aria-labelledby": n
    }, r), l ? g.createElement("title", {
      id: n
    }, l) : null, g.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
    }));
  }
  const ph = g.forwardRef(T3), N3 = [
    {
      id: "select",
      icon: gh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "laser",
      icon: w1,
      label: "Laser Pointer",
      shortcut: "Q"
    },
    {
      id: "pan",
      icon: ph,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: dh,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: fh,
      label: "Zoom",
      shortcut: "Z"
    },
    {
      id: "ruler",
      icon: E1,
      label: "Ruler",
      shortcut: "U"
    }
  ], Tv = [
    {
      id: "rectangle",
      icon: yM,
      label: "Rectangle",
      shortcut: "R"
    },
    {
      id: "polygon",
      icon: Hk,
      label: "Polygon",
      shortcut: "G"
    },
    {
      id: "path",
      icon: Tk,
      label: "Path",
      shortcut: "H"
    },
    {
      id: "text",
      icon: DM,
      label: "Text",
      shortcut: "T"
    }
  ], O3 = [
    {
      id: "select",
      icon: gh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: ph,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: dh,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: fh,
      label: "Zoom",
      shortcut: "Z"
    }
  ], Nv = [
    {
      id: "laser",
      icon: w1,
      label: "Laser Pointer",
      shortcut: "Q"
    },
    {
      id: "ruler",
      icon: E1,
      label: "Ruler",
      shortcut: "U"
    }
  ], D3 = [
    {
      id: "select",
      icon: gh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: ph,
      label: "Pan",
      shortcut: "P"
    }
  ];
  function Ov({ tool: l, isActive: n, onClick: r, isDark: o }) {
    const s = l.icon;
    return y.jsx(qn, {
      label: l.label,
      shortcut: {
        key: l.shortcut
      },
      children: y.jsx("button", {
        onClick: r,
        className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", o ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (o ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(s, {
            className: Y("h-5 w-5", o ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function Dv({ isDark: l }) {
    return y.jsx("div", {
      className: Y("mx-0 h-6 w-[1px]", l ? "bg-white/10" : "bg-black/10")
    });
  }
  function I3({ isDark: l, overflowBaseTools: n, overflowShapeTools: r, showInstance: o, showCommands: s }) {
    const [c, d] = g.useState(false), f = g.useRef(null), m = g.useRef(null), { activeTool: p, setTool: v } = Bt(), b = nn((S) => S.open), w = nn((S) => S.toggle), E = [
      ...n,
      ...r
    ].some((S) => S.id === p);
    g.useEffect(() => {
      if (!c) return;
      const S = (_) => {
        var _a, _b2;
        const L = _.target;
        !((_a = m.current) == null ? void 0 : _a.contains(L)) && !((_b2 = f.current) == null ? void 0 : _b2.contains(L)) && d(false);
      }, C = (_) => {
        _.key === "Escape" && d(false);
      };
      return document.addEventListener("mousedown", S, true), document.addEventListener("keydown", C), () => {
        document.removeEventListener("mousedown", S, true), document.removeEventListener("keydown", C);
      };
    }, [
      c
    ]);
    const k = g.useCallback(() => {
      if (!f.current) return {
        left: 0,
        top: 0
      };
      const S = f.current.getBoundingClientRect(), C = 200;
      let _ = S.left;
      return _ + C > window.innerWidth - 8 && (_ = window.innerWidth - C - 8), {
        left: _,
        top: S.bottom + 8
      };
    }, []);
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(qn, {
          label: "More tools",
          className: c ? "[&>div:last-child]:hidden" : void 0,
          children: y.jsx("button", {
            ref: f,
            onClick: () => d(!c),
            className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", (E || c) && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
            children: y.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: y.jsx(gk, {
                className: Y("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        c && ni.createPortal(y.jsxs("div", {
          ref: m,
          className: Y("fixed z-[9999] min-w-[180px] rounded-xl border p-1 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: (() => {
            const S = k();
            return {
              left: `${S.left}px`,
              top: `${S.top}px`
            };
          })(),
          children: [
            n.length > 0 && y.jsx("div", {
              className: "flex flex-col",
              children: n.map((S) => {
                const C = S.icon, _ = p === S.id;
                return y.jsxs("button", {
                  onClick: () => {
                    v(S.id), d(false);
                  },
                  className: Y("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", _ && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                  children: [
                    y.jsx(C, {
                      className: Y("h-4 w-4", l ? "text-white/90" : "text-black/90")
                    }),
                    y.jsx("span", {
                      className: l ? "text-white/90" : "text-black/90",
                      children: S.label
                    }),
                    y.jsx("kbd", {
                      className: Y("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                      children: S.shortcut
                    })
                  ]
                }, S.id);
              })
            }),
            r.length > 0 && y.jsxs(y.Fragment, {
              children: [
                y.jsx("div", {
                  className: Y("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                y.jsx("div", {
                  className: "flex flex-col",
                  children: r.map((S) => {
                    const C = S.icon, _ = p === S.id;
                    return y.jsxs("button", {
                      onClick: () => {
                        v(S.id), d(false);
                      },
                      className: Y("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", _ && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: [
                        y.jsx(C, {
                          className: Y("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        y.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: S.label
                        }),
                        y.jsx("kbd", {
                          className: Y("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                          children: S.shortcut
                        })
                      ]
                    }, S.id);
                  })
                })
              ]
            }),
            (o || s) && y.jsxs(y.Fragment, {
              children: [
                y.jsx("div", {
                  className: Y("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                y.jsxs("div", {
                  className: "flex flex-col",
                  children: [
                    o && y.jsxs("button", {
                      onClick: () => {
                        b("add instance "), d(false);
                      },
                      className: Y("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        y.jsx(C1, {
                          className: Y("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        y.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: "Instance"
                        }),
                        y.jsx("kbd", {
                          className: Y("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                          children: "I"
                        })
                      ]
                    }),
                    s && y.jsxs("button", {
                      onClick: () => {
                        w(), d(false);
                      },
                      className: Y("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        y.jsx(_1, {
                          className: Y("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        y.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: "Commands"
                        }),
                        y.jsxs("span", {
                          className: "ml-auto flex gap-0.5",
                          children: [
                            y.jsx("kbd", {
                              className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                              children: Ie.mod
                            }),
                            y.jsx("kbd", {
                              className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                              children: "K"
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }), document.body)
      ]
    });
  }
  function Iv({ compact: l = false, minimal: n = false }) {
    const { activeTool: r, setTool: o } = Bt(), c = ge((k) => k.theme) === "dark", d = n ? D3 : l ? O3 : N3, f = !l && !n, m = !l && !n, p = !l && !n, v = !l && !n, b = l || n, w = n ? [
      ...Nv,
      {
        id: "move",
        icon: dh,
        label: "Move",
        shortcut: "M"
      },
      {
        id: "zoom",
        icon: fh,
        label: "Zoom",
        shortcut: "Z"
      }
    ] : l ? Nv : [], E = l || n ? Tv : [];
    return y.jsxs("div", {
      className: Y("fixed top-4 z-50 mx-auto w-fit", l || n ? "left-14 right-14" : "left-0 right-0", "flex items-center gap-1 rounded-xl border px-1 pt-1 pb-[3px]", c ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: [
        d.map((k) => y.jsx(Ov, {
          tool: k,
          isActive: r === k.id,
          onClick: () => o(k.id),
          isDark: c
        }, k.id)),
        f && y.jsxs(y.Fragment, {
          children: [
            y.jsx(Dv, {
              isDark: c
            }),
            Tv.map((k) => y.jsx(Ov, {
              tool: k,
              isActive: r === k.id,
              onClick: () => o(k.id),
              isDark: c
            }, k.id))
          ]
        }),
        m && y.jsx(z3, {
          isDark: c
        }),
        p && y.jsx(H3, {
          isDark: c
        }),
        y.jsx(Dv, {
          isDark: c
        }),
        v && y.jsx(U3, {
          isDark: c
        }),
        b && y.jsx(I3, {
          isDark: c,
          overflowBaseTools: w,
          overflowShapeTools: E,
          showInstance: true,
          showCommands: true
        })
      ]
    });
  }
  const zv = [
    {
      id: "union",
      icon: BM,
      label: "Union",
      kind: "boolean"
    },
    {
      id: "subtract",
      icon: CM,
      label: "Subtract",
      kind: "boolean"
    },
    {
      id: "intersect",
      icon: lk,
      label: "Intersect",
      kind: "boolean"
    },
    {
      id: "xor",
      icon: F4,
      label: "Exclude",
      kind: "boolean"
    },
    {
      id: "align-left",
      icon: y4,
      label: "Align Left",
      kind: "align"
    },
    {
      id: "align-center-h",
      icon: B_,
      label: "Align Center H",
      kind: "align"
    },
    {
      id: "align-right",
      icon: C4,
      label: "Align Right",
      kind: "align"
    },
    {
      id: "center-align",
      icon: a4,
      label: "Center Align",
      kind: "align"
    },
    {
      id: "align-top",
      icon: L4,
      label: "Align Top",
      kind: "align"
    },
    {
      id: "align-center-v",
      icon: P_,
      label: "Align Center V",
      kind: "align"
    },
    {
      id: "align-bottom",
      icon: d4,
      label: "Align Bottom",
      kind: "align"
    },
    {
      id: "origin-align",
      icon: Kk,
      label: "Origin Align",
      kind: "align"
    }
  ];
  function Hv(l) {
    const { library: n, renderer: r } = we.getState();
    if (!n || !r) return;
    const { selectedIds: o, lastSelectedId: s } = ae.getState();
    if (o.size !== 0) if (l.kind === "boolean") {
      if (o.size < 2) return;
      const c = [
        ...o
      ], d = s ?? c[0], f = new j0(c, l.id, d);
      de.getState().execute(f, {
        library: n,
        renderer: r
      });
    } else {
      const c = l.id;
      if (c !== "origin-align" && o.size < 2) return;
      const d = new M0(new Set(o), s, c);
      de.getState().execute(d, {
        library: n,
        renderer: r
      });
    }
  }
  function z3({ isDark: l }) {
    const [n, r] = g.useState(zv[0]), [o, s] = g.useState(false), c = g.useRef(null), d = g.useRef(null), f = g.useRef(null), m = n.icon;
    g.useEffect(() => {
      if (!o) return;
      const R = (T) => {
        T.key === "Escape" && s(false);
      };
      return document.addEventListener("keydown", R), () => {
        document.removeEventListener("keydown", R);
      };
    }, [
      o
    ]);
    const p = g.useCallback(() => {
      f.current = setTimeout(() => s(false), 150);
    }, []), v = g.useCallback(() => {
      f.current && (clearTimeout(f.current), f.current = null);
    }, []), b = g.useCallback(() => {
      v(), s(true);
    }, [
      v
    ]), w = g.useCallback(() => {
      p();
    }, [
      p
    ]), E = g.useCallback(() => {
      v();
    }, [
      v
    ]), k = g.useCallback(() => {
      p();
    }, [
      p
    ]), S = g.useCallback(() => {
      Hv(n);
    }, [
      n
    ]), C = g.useCallback((R) => {
      R.preventDefault(), s(true);
    }, []), _ = g.useCallback((R) => {
      r(R), s(false), setTimeout(() => Hv(R), 0);
    }, []), L = g.useCallback(() => {
      if (!c.current) return {
        left: 0,
        top: 0
      };
      const R = c.current.getBoundingClientRect(), T = 180, B = 160;
      let N = R.left, A = R.bottom + 8;
      return N + T > window.innerWidth - 8 && (N = window.innerWidth - T - 8), A + B > window.innerHeight - 8 && (A = R.top - B - 8), {
        left: N,
        top: A
      };
    }, []);
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(qn, {
          label: n.label,
          className: o ? "[&>div:last-child]:hidden" : void 0,
          children: y.jsx("button", {
            ref: c,
            onClick: S,
            onContextMenu: C,
            onMouseEnter: b,
            onMouseLeave: w,
            className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
            children: y.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: y.jsx(m, {
                className: Y("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        o && ni.createPortal(y.jsx("div", {
          ref: d,
          onMouseEnter: E,
          onMouseLeave: k,
          className: Y("fixed z-[9999] rounded-xl border p-2 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: (() => {
            const R = L();
            return {
              left: `${R.left}px`,
              top: `${R.top}px`
            };
          })(),
          children: y.jsx("div", {
            className: "grid grid-cols-4 gap-1",
            children: zv.map((R) => y.jsx(qn, {
              label: R.label,
              children: y.jsx("button", {
                onClick: () => _(R),
                className: Y("cursor-pointer rounded-lg p-1.5 transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                children: y.jsx(R.icon, {
                  className: Y("h-5 w-5", l ? "text-white/90" : "text-black/90")
                })
              })
            }, R.id))
          })
        }), document.body)
      ]
    });
  }
  function H3({ isDark: l }) {
    const n = nn((c) => c.open), r = nn((c) => c.isOpen), o = nn((c) => c.initialSearch), s = r && !!o;
    return y.jsx(qn, {
      label: "Instance",
      shortcut: {
        key: "I"
      },
      children: y.jsx("button", {
        onClick: () => n("add instance "),
        className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", s && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(C1, {
            className: Y("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function U3({ isDark: l }) {
    const n = nn((c) => c.isOpen), r = nn((c) => c.initialSearch), o = nn((c) => c.toggle), s = n && !r;
    return y.jsx(qn, {
      label: "Commands",
      shortcut: {
        modifiers: [
          Ie.mod
        ],
        key: "K"
      },
      children: y.jsx("button", {
        onClick: o,
        className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", s && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(_1, {
            className: Y("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  const Y3 = 5e3;
  function B3() {
    const [l, n] = g.useState({
      status: "idle"
    }), [r, o] = g.useState(false), s = ge((p) => p.theme) === "dark", c = g.useRef(null), d = g.useRef("");
    g.useEffect(() => {
      if (!Dn) return;
      const p = setTimeout(async () => {
        try {
          n({
            status: "checking"
          });
          const { check: v } = await ut(async () => {
            const { check: w } = await import("./index-DWHWQ1OU.js");
            return {
              check: w
            };
          }, __vite__mapDeps([3,1]), import.meta.url), b = await v();
          b ? (c.current = b, d.current = b.version, n({
            status: "available",
            version: b.version,
            notes: b.body ?? null
          })) : n({
            status: "idle"
          });
        } catch (v) {
          console.warn("[updater] check failed:", v), n({
            status: "idle"
          });
        }
      }, Y3);
      return () => clearTimeout(p);
    }, []);
    const f = g.useCallback(async () => {
      const p = c.current;
      if (p) try {
        const v = d.current;
        n({
          status: "downloading",
          version: v,
          progress: 0
        });
        let b = 0, w = 1;
        await p.downloadAndInstall((E) => {
          switch (E.event) {
            case "Started":
              w = E.data.contentLength ?? 1;
              break;
            case "Progress":
              b += E.data.chunkLength ?? 0, n({
                status: "downloading",
                version: v,
                progress: Math.min(b / w, 1)
              });
              break;
            case "Finished":
              break;
          }
        }), n({
          status: "ready",
          version: v
        });
      } catch (v) {
        console.error("[updater] download failed:", v), n({
          status: "error",
          message: v instanceof Error ? v.message : "Download failed"
        });
      }
    }, []), m = g.useCallback(async () => {
      try {
        const { relaunch: p } = await ut(async () => {
          const { relaunch: v } = await import("./index-BQlnJ-sT.js");
          return {
            relaunch: v
          };
        }, __vite__mapDeps([4,1]), import.meta.url);
        await p();
      } catch (p) {
        console.error("[updater] relaunch failed:", p);
      }
    }, []);
    return !Dn || l.status === "idle" || l.status === "checking" || r ? null : y.jsxs("div", {
      className: Y("fixed bottom-10 right-4 z-[200] flex w-72 flex-col gap-2 rounded-xl border p-3 shadow-lg backdrop-blur-xl animate-[update-toast-in_0.3s_ease-out]", s ? "border-white/10 bg-[rgb(29,29,29)]/95 text-white/90" : "border-black/10 bg-[rgb(241,241,241)]/95 text-black/90"),
      children: [
        y.jsxs("div", {
          className: "flex items-center justify-between",
          children: [
            y.jsx("span", {
              className: "text-xs font-medium",
              children: l.status === "error" ? "Update failed" : "Update available"
            }),
            y.jsx("button", {
              type: "button",
              onClick: () => o(true),
              className: Y("flex h-5 w-5 items-center justify-center rounded transition-colors", s ? "hover:bg-white/10 text-white/40" : "hover:bg-black/10 text-black/40"),
              children: y.jsx("svg", {
                width: "10",
                height: "10",
                viewBox: "0 0 10 10",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                children: y.jsx("path", {
                  d: "M1 1l8 8M9 1l-8 8"
                })
              })
            })
          ]
        }),
        l.status !== "error" && y.jsxs("p", {
          className: Y("text-[11px]", s ? "text-white/50" : "text-black/50"),
          children: [
            "v",
            l.version,
            " is ready to install"
          ]
        }),
        l.status === "error" && y.jsx("p", {
          className: Y("text-[11px]", s ? "text-red-400/80" : "text-red-600/80"),
          children: l.message
        }),
        l.status === "downloading" && y.jsx("div", {
          className: Y("h-1 w-full overflow-hidden rounded-full", s ? "bg-white/10" : "bg-black/10"),
          children: y.jsx("div", {
            className: "h-full rounded-full bg-brand-purple transition-[width] duration-300 ease-out",
            style: {
              width: `${Math.round(l.progress * 100)}%`
            }
          })
        }),
        l.status === "available" && y.jsx("button", {
          type: "button",
          onClick: f,
          className: "mt-0.5 flex h-7 items-center justify-center rounded-lg border border-brand-purple-dark/50 bg-brand-purple px-3 text-xs font-medium text-white shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15 transition-colors hover:bg-brand-purple-light active:translate-y-px",
          children: "Download and install"
        }),
        l.status === "downloading" && y.jsxs("p", {
          className: Y("text-center text-[11px]", s ? "text-white/40" : "text-black/40"),
          children: [
            "Downloading... ",
            Math.round(l.progress * 100),
            "%"
          ]
        }),
        l.status === "ready" && y.jsx("button", {
          type: "button",
          onClick: m,
          className: "mt-0.5 flex h-7 items-center justify-center rounded-lg border border-brand-purple-dark/50 bg-brand-purple px-3 text-xs font-medium text-white shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15 transition-colors hover:bg-brand-purple-light active:translate-y-px",
          children: "Restart to update"
        }),
        l.status === "error" && y.jsx("button", {
          type: "button",
          onClick: () => o(true),
          className: Y("mt-0.5 flex h-7 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors active:translate-y-px", s ? "border-white/10 text-white/70 hover:bg-white/5" : "border-black/10 text-black/70 hover:bg-black/5"),
          children: "Dismiss"
        })
      ]
    });
  }
  function X3() {
    const l = ge((f) => f.theme), n = ge((f) => f.zenMode), { isLg: r, isMd: o, isSm: s } = hh(), c = Zo(), d = g.useRef(null);
    return g.useEffect(() => {
      d.current === null ? r ? (ge.getState().setExplorerCollapsed(false), ge.getState().setSidebarCollapsed(false)) : (ge.getState().setExplorerCollapsed(true), ge.getState().setSidebarCollapsed(true)) : d.current && !r ? (ge.getState().setExplorerCollapsed(true), ge.getState().setSidebarCollapsed(true)) : !d.current && r && (ge.getState().setExplorerCollapsed(false), ge.getState().setSidebarCollapsed(false)), d.current = r;
    }, [
      r
    ]), g.useEffect(() => {
      if (!c) return;
      const f = AS();
      f !== null && (ge.getState().setExplorerWidth(f), ge.getState().setSidebarWidth(f));
    }, [
      c
    ]), g.useEffect(() => {
      if (!Dn || c) return;
      const f = async (m) => {
        if (m.metaKey || m.ctrlKey) {
          if (m.key === "n") m.preventDefault(), await mh();
          else if (m.key === "o") {
            m.preventDefault();
            const v = await Fv();
            v && await Zf(v);
          } else if (m.key === "s" && m.shiftKey) m.preventDefault(), await Kf(true);
          else if (m.key === "s" && !m.shiftKey) m.preventDefault(), await Kf(false);
          else if (m.key === "t") {
            m.preventDefault();
            const v = Ke.getState().activeTabId;
            if (v) {
              Po(v);
              const b = we.getState().library;
              b && $o(v, b);
            }
            window.dispatchEvent(new CustomEvent("rosette-new-tab"));
          } else if (m.key === "w") {
            m.preventDefault();
            const v = Ke.getState().activeTabId;
            v && window.dispatchEvent(new CustomEvent("rosette-close-tab", {
              detail: v
            }));
          } else if (m.key === "[" && m.shiftKey) {
            m.preventDefault();
            const { tabs: v, activeTabId: b } = Ke.getState();
            if (v.length > 1 && b) {
              const E = (v.findIndex((k) => k.id === b) - 1 + v.length) % v.length;
              Da(b, v[E].id), Ke.getState().setActiveTab(v[E].id);
            }
          } else if (m.key === "]" && m.shiftKey) {
            m.preventDefault();
            const { tabs: v, activeTabId: b } = Ke.getState();
            if (v.length > 1 && b) {
              const E = (v.findIndex((k) => k.id === b) + 1) % v.length;
              Da(b, v[E].id), Ke.getState().setActiveTab(v[E].id);
            }
          }
        }
      };
      return window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f);
    }, [
      c
    ]), g.useEffect(() => {
      if (c) return;
      const f = async (m) => {
        const p = m.detail;
        if (!p) return;
        const v = Ke.getState().getTab(p);
        if (!v) return;
        const b = Ke.getState().activeTabId === p;
        if ((b ? v.isDirty || $n.getState().isDirty : v.isDirty) && !await j1()) return;
        const E = Ke.getState(), k = E.tabs.findIndex((S) => S.id === p);
        if (b && E.tabs.length > 1) {
          const S = E.tabs.filter((_) => _.id !== p), C = k < S.length ? S[k].id : S[S.length - 1].id;
          Da(p, C), Ke.getState().closeTab(p), $s(p);
        } else b && E.tabs.length === 1 ? (Ke.getState().closeTab(p), window.dispatchEvent(new CustomEvent("rosette-new-tab")), $s(p)) : (Ke.getState().closeTab(p), $s(p));
      };
      return window.addEventListener("rosette-close-tab", f), () => window.removeEventListener("rosette-close-tab", f);
    }, [
      c
    ]), g.useEffect(() => {
      if (!Dn || c) return;
      let f = null, m = false;
      return (async () => {
        try {
          const { getCurrentWebviewWindow: p } = await ut(async () => {
            const { getCurrentWebviewWindow: w } = await import("./webviewWindow-DoRoZnHQ.js");
            return {
              getCurrentWebviewWindow: w
            };
          }, __vite__mapDeps([5,1,2]), import.meta.url), b = await p().onDragDropEvent(async (w) => {
            if (w.payload.type === "drop") {
              const k = w.payload.paths.find((S) => S.endsWith(".gds") || S.endsWith(".gds2") || S.endsWith(".gdsii"));
              k && await Zf(k);
            }
          });
          m ? b() : f = b;
        } catch {
        }
      })(), () => {
        m = true, f == null ? void 0 : f();
      };
    }, [
      c
    ]), c ? y.jsxs("div", {
      className: `flex h-screen w-screen flex-col ${l === "dark" ? "bg-black" : "bg-white"}`,
      children: [
        y.jsxs("div", {
          className: "relative min-h-0 flex-1",
          children: [
            y.jsx(eb, {}),
            !n && y.jsx(Iv, {
              compact: !r,
              minimal: s
            }),
            !n && y.jsx(Ev, {}),
            !n && y.jsx(jv, {}),
            !s && y.jsx(_v, {}),
            y.jsx(yb, {})
          ]
        }),
        y.jsx(Av, {
          compact: o || s,
          minimal: s
        })
      ]
    }) : y.jsxs("div", {
      className: `flex h-screen w-screen flex-col ${l === "dark" ? "bg-black" : "bg-white"}`,
      children: [
        y.jsxs("div", {
          className: "relative min-h-0 flex-1",
          children: [
            y.jsx(eb, {}),
            !n && y.jsx(Iv, {
              compact: !r,
              minimal: s
            }),
            !n && y.jsx(Ev, {}),
            !n && y.jsx(jv, {}),
            !s && y.jsx(_v, {}),
            y.jsx(yb, {})
          ]
        }),
        y.jsx(Av, {
          compact: o || s,
          minimal: s
        }),
        y.jsx(B3, {})
      ]
    });
  }
  Kw.createRoot(document.getElementById("root")).render(y.jsx(g.StrictMode, {
    children: y.jsx(X3, {})
  }));
})();
