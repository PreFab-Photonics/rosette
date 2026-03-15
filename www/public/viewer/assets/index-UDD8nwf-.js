const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-F3OG0nQy.js","./core-mPlcS5K-.js","./event-DRyjiKX_.js","./webviewWindow-C3TqIfWq.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(async () => {
  function rS(l, n) {
    for (var a = 0; a < n.length; a++) {
      const i = n[a];
      if (typeof i != "string" && !Array.isArray(i)) {
        for (const s in i) if (s !== "default" && !(s in l)) {
          const c = Object.getOwnPropertyDescriptor(i, s);
          c && Object.defineProperty(l, s, c.get ? c : {
            enumerable: true,
            get: () => i[s]
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
    for (const s of document.querySelectorAll('link[rel="modulepreload"]')) i(s);
    new MutationObserver((s) => {
      for (const c of s) if (c.type === "childList") for (const f of c.addedNodes) f.tagName === "LINK" && f.rel === "modulepreload" && i(f);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function a(s) {
      const c = {};
      return s.integrity && (c.integrity = s.integrity), s.referrerPolicy && (c.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? c.credentials = "include" : s.crossOrigin === "anonymous" ? c.credentials = "omit" : c.credentials = "same-origin", c;
    }
    function i(s) {
      if (s.ep) return;
      s.ep = true;
      const c = a(s);
      fetch(s.href, c);
    }
  })();
  function hv(l) {
    return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
  }
  var Ju = {
    exports: {}
  }, xo = {};
  var Rg;
  function aS() {
    if (Rg) return xo;
    Rg = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
    function a(i, s, c) {
      var f = null;
      if (c !== void 0 && (f = "" + c), s.key !== void 0 && (f = "" + s.key), "key" in s) {
        c = {};
        for (var h in s) h !== "key" && (c[h] = s[h]);
      } else c = s;
      return s = c.ref, {
        $$typeof: l,
        type: i,
        key: f,
        ref: s !== void 0 ? s : null,
        props: c
      };
    }
    return xo.Fragment = n, xo.jsx = a, xo.jsxs = a, xo;
  }
  var Lg;
  function oS() {
    return Lg || (Lg = 1, Ju.exports = aS()), Ju.exports;
  }
  var b = oS(), ed = {
    exports: {}
  }, je = {};
  var Ag;
  function iS() {
    if (Ag) return je;
    Ag = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), a = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), s = Symbol.for("react.profiler"), c = Symbol.for("react.consumer"), f = Symbol.for("react.context"), h = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), g = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), y = Symbol.for("react.activity"), S = Symbol.iterator;
    function E(j) {
      return j === null || typeof j != "object" ? null : (j = S && j[S] || j["@@iterator"], typeof j == "function" ? j : null);
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
    }, w = Object.assign, C = {};
    function _(j, D, z) {
      this.props = j, this.context = D, this.refs = C, this.updater = z || k;
    }
    _.prototype.isReactComponent = {}, _.prototype.setState = function(j, D) {
      if (typeof j != "object" && typeof j != "function" && j != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, j, D, "setState");
    }, _.prototype.forceUpdate = function(j) {
      this.updater.enqueueForceUpdate(this, j, "forceUpdate");
    };
    function R() {
    }
    R.prototype = _.prototype;
    function A(j, D, z) {
      this.props = j, this.context = D, this.refs = C, this.updater = z || k;
    }
    var T = A.prototype = new R();
    T.constructor = A, w(T, _.prototype), T.isPureReactComponent = true;
    var B = Array.isArray;
    function N() {
    }
    var L = {
      H: null,
      A: null,
      T: null,
      S: null
    }, U = Object.prototype.hasOwnProperty;
    function X(j, D, z) {
      var O = z.ref;
      return {
        $$typeof: l,
        type: j,
        key: D,
        ref: O !== void 0 ? O : null,
        props: z
      };
    }
    function J(j, D) {
      return X(j.type, D, j.props);
    }
    function ae(j) {
      return typeof j == "object" && j !== null && j.$$typeof === l;
    }
    function te(j) {
      var D = {
        "=": "=0",
        ":": "=2"
      };
      return "$" + j.replace(/[=:]/g, function(z) {
        return D[z];
      });
    }
    var ce = /\/+/g;
    function ie(j, D) {
      return typeof j == "object" && j !== null && j.key != null ? te("" + j.key) : D.toString(36);
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
    function $(j, D, z, O, Y) {
      var Q = typeof j;
      (Q === "undefined" || Q === "boolean") && (j = null);
      var W = false;
      if (j === null) W = true;
      else switch (Q) {
        case "bigint":
        case "string":
        case "number":
          W = true;
          break;
        case "object":
          switch (j.$$typeof) {
            case l:
            case n:
              W = true;
              break;
            case v:
              return W = j._init, $(W(j._payload), D, z, O, Y);
          }
      }
      if (W) return Y = Y(j), W = O === "" ? "." + ie(j, 0) : O, B(Y) ? (z = "", W != null && (z = W.replace(ce, "$&/") + "/"), $(Y, D, z, "", function(Me) {
        return Me;
      })) : Y != null && (ae(Y) && (Y = J(Y, z + (Y.key == null || j && j.key === Y.key ? "" : ("" + Y.key).replace(ce, "$&/") + "/") + W)), D.push(Y)), 1;
      W = 0;
      var de = O === "" ? "." : O + ":";
      if (B(j)) for (var oe = 0; oe < j.length; oe++) O = j[oe], Q = de + ie(O, oe), W += $(O, D, z, Q, Y);
      else if (oe = E(j), typeof oe == "function") for (j = oe.call(j), oe = 0; !(O = j.next()).done; ) O = O.value, Q = de + ie(O, oe++), W += $(O, D, z, Q, Y);
      else if (Q === "object") {
        if (typeof j.then == "function") return $(Se(j), D, z, O, Y);
        throw D = String(j), Error("Objects are not valid as a React child (found: " + (D === "[object Object]" ? "object with keys {" + Object.keys(j).join(", ") + "}" : D) + "). If you meant to render a collection of children, use an array instead.");
      }
      return W;
    }
    function P(j, D, z) {
      if (j == null) return j;
      var O = [], Y = 0;
      return $(j, O, "", "", function(Q) {
        return D.call(z, Q, Y++);
      }), O;
    }
    function ue(j) {
      if (j._status === -1) {
        var D = j._result;
        D = D(), D.then(function(z) {
          (j._status === 0 || j._status === -1) && (j._status = 1, j._result = z);
        }, function(z) {
          (j._status === 0 || j._status === -1) && (j._status = 2, j._result = z);
        }), j._status === -1 && (j._status = 0, j._result = D);
      }
      if (j._status === 1) return j._result.default;
      throw j._result;
    }
    var xe = typeof reportError == "function" ? reportError : function(j) {
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
    }, be = {
      map: P,
      forEach: function(j, D, z) {
        P(j, function() {
          D.apply(this, arguments);
        }, z);
      },
      count: function(j) {
        var D = 0;
        return P(j, function() {
          D++;
        }), D;
      },
      toArray: function(j) {
        return P(j, function(D) {
          return D;
        }) || [];
      },
      only: function(j) {
        if (!ae(j)) throw Error("React.Children.only expected to receive a single React element child.");
        return j;
      }
    };
    return je.Activity = y, je.Children = be, je.Component = _, je.Fragment = a, je.Profiler = s, je.PureComponent = A, je.StrictMode = i, je.Suspense = p, je.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = L, je.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(j) {
        return L.H.useMemoCache(j);
      }
    }, je.cache = function(j) {
      return function() {
        return j.apply(null, arguments);
      };
    }, je.cacheSignal = function() {
      return null;
    }, je.cloneElement = function(j, D, z) {
      if (j == null) throw Error("The argument must be a React element, but you passed " + j + ".");
      var O = w({}, j.props), Y = j.key;
      if (D != null) for (Q in D.key !== void 0 && (Y = "" + D.key), D) !U.call(D, Q) || Q === "key" || Q === "__self" || Q === "__source" || Q === "ref" && D.ref === void 0 || (O[Q] = D[Q]);
      var Q = arguments.length - 2;
      if (Q === 1) O.children = z;
      else if (1 < Q) {
        for (var W = Array(Q), de = 0; de < Q; de++) W[de] = arguments[de + 2];
        O.children = W;
      }
      return X(j.type, Y, O);
    }, je.createContext = function(j) {
      return j = {
        $$typeof: f,
        _currentValue: j,
        _currentValue2: j,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      }, j.Provider = j, j.Consumer = {
        $$typeof: c,
        _context: j
      }, j;
    }, je.createElement = function(j, D, z) {
      var O, Y = {}, Q = null;
      if (D != null) for (O in D.key !== void 0 && (Q = "" + D.key), D) U.call(D, O) && O !== "key" && O !== "__self" && O !== "__source" && (Y[O] = D[O]);
      var W = arguments.length - 2;
      if (W === 1) Y.children = z;
      else if (1 < W) {
        for (var de = Array(W), oe = 0; oe < W; oe++) de[oe] = arguments[oe + 2];
        Y.children = de;
      }
      if (j && j.defaultProps) for (O in W = j.defaultProps, W) Y[O] === void 0 && (Y[O] = W[O]);
      return X(j, Q, Y);
    }, je.createRef = function() {
      return {
        current: null
      };
    }, je.forwardRef = function(j) {
      return {
        $$typeof: h,
        render: j
      };
    }, je.isValidElement = ae, je.lazy = function(j) {
      return {
        $$typeof: v,
        _payload: {
          _status: -1,
          _result: j
        },
        _init: ue
      };
    }, je.memo = function(j, D) {
      return {
        $$typeof: g,
        type: j,
        compare: D === void 0 ? null : D
      };
    }, je.startTransition = function(j) {
      var D = L.T, z = {};
      L.T = z;
      try {
        var O = j(), Y = L.S;
        Y !== null && Y(z, O), typeof O == "object" && O !== null && typeof O.then == "function" && O.then(N, xe);
      } catch (Q) {
        xe(Q);
      } finally {
        D !== null && z.types !== null && (D.types = z.types), L.T = D;
      }
    }, je.unstable_useCacheRefresh = function() {
      return L.H.useCacheRefresh();
    }, je.use = function(j) {
      return L.H.use(j);
    }, je.useActionState = function(j, D, z) {
      return L.H.useActionState(j, D, z);
    }, je.useCallback = function(j, D) {
      return L.H.useCallback(j, D);
    }, je.useContext = function(j) {
      return L.H.useContext(j);
    }, je.useDebugValue = function() {
    }, je.useDeferredValue = function(j, D) {
      return L.H.useDeferredValue(j, D);
    }, je.useEffect = function(j, D) {
      return L.H.useEffect(j, D);
    }, je.useEffectEvent = function(j) {
      return L.H.useEffectEvent(j);
    }, je.useId = function() {
      return L.H.useId();
    }, je.useImperativeHandle = function(j, D, z) {
      return L.H.useImperativeHandle(j, D, z);
    }, je.useInsertionEffect = function(j, D) {
      return L.H.useInsertionEffect(j, D);
    }, je.useLayoutEffect = function(j, D) {
      return L.H.useLayoutEffect(j, D);
    }, je.useMemo = function(j, D) {
      return L.H.useMemo(j, D);
    }, je.useOptimistic = function(j, D) {
      return L.H.useOptimistic(j, D);
    }, je.useReducer = function(j, D, z) {
      return L.H.useReducer(j, D, z);
    }, je.useRef = function(j) {
      return L.H.useRef(j);
    }, je.useState = function(j) {
      return L.H.useState(j);
    }, je.useSyncExternalStore = function(j, D, z) {
      return L.H.useSyncExternalStore(j, D, z);
    }, je.useTransition = function() {
      return L.H.useTransition();
    }, je.version = "19.2.4", je;
  }
  var Tg;
  function Ef() {
    return Tg || (Tg = 1, ed.exports = iS()), ed.exports;
  }
  var m = Ef();
  const xa = hv(m), _f = rS({
    __proto__: null,
    default: xa
  }, [
    m
  ]);
  var td = {
    exports: {}
  }, So = {}, nd = {
    exports: {}
  }, ld = {};
  var Ng;
  function sS() {
    return Ng || (Ng = 1, (function(l) {
      function n($, P) {
        var ue = $.length;
        $.push(P);
        e: for (; 0 < ue; ) {
          var xe = ue - 1 >>> 1, be = $[xe];
          if (0 < s(be, P)) $[xe] = P, $[ue] = be, ue = xe;
          else break e;
        }
      }
      function a($) {
        return $.length === 0 ? null : $[0];
      }
      function i($) {
        if ($.length === 0) return null;
        var P = $[0], ue = $.pop();
        if (ue !== P) {
          $[0] = ue;
          e: for (var xe = 0, be = $.length, j = be >>> 1; xe < j; ) {
            var D = 2 * (xe + 1) - 1, z = $[D], O = D + 1, Y = $[O];
            if (0 > s(z, ue)) O < be && 0 > s(Y, z) ? ($[xe] = Y, $[O] = ue, xe = O) : ($[xe] = z, $[D] = ue, xe = D);
            else if (O < be && 0 > s(Y, ue)) $[xe] = Y, $[O] = ue, xe = O;
            else break e;
          }
        }
        return P;
      }
      function s($, P) {
        var ue = $.sortIndex - P.sortIndex;
        return ue !== 0 ? ue : $.id - P.id;
      }
      if (l.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
        var c = performance;
        l.unstable_now = function() {
          return c.now();
        };
      } else {
        var f = Date, h = f.now();
        l.unstable_now = function() {
          return f.now() - h;
        };
      }
      var p = [], g = [], v = 1, y = null, S = 3, E = false, k = false, w = false, C = false, _ = typeof setTimeout == "function" ? setTimeout : null, R = typeof clearTimeout == "function" ? clearTimeout : null, A = typeof setImmediate < "u" ? setImmediate : null;
      function T($) {
        for (var P = a(g); P !== null; ) {
          if (P.callback === null) i(g);
          else if (P.startTime <= $) i(g), P.sortIndex = P.expirationTime, n(p, P);
          else break;
          P = a(g);
        }
      }
      function B($) {
        if (w = false, T($), !k) if (a(p) !== null) k = true, N || (N = true, te());
        else {
          var P = a(g);
          P !== null && Se(B, P.startTime - $);
        }
      }
      var N = false, L = -1, U = 5, X = -1;
      function J() {
        return C ? true : !(l.unstable_now() - X < U);
      }
      function ae() {
        if (C = false, N) {
          var $ = l.unstable_now();
          X = $;
          var P = true;
          try {
            e: {
              k = false, w && (w = false, R(L), L = -1), E = true;
              var ue = S;
              try {
                t: {
                  for (T($), y = a(p); y !== null && !(y.expirationTime > $ && J()); ) {
                    var xe = y.callback;
                    if (typeof xe == "function") {
                      y.callback = null, S = y.priorityLevel;
                      var be = xe(y.expirationTime <= $);
                      if ($ = l.unstable_now(), typeof be == "function") {
                        y.callback = be, T($), P = true;
                        break t;
                      }
                      y === a(p) && i(p), T($);
                    } else i(p);
                    y = a(p);
                  }
                  if (y !== null) P = true;
                  else {
                    var j = a(g);
                    j !== null && Se(B, j.startTime - $), P = false;
                  }
                }
                break e;
              } finally {
                y = null, S = ue, E = false;
              }
              P = void 0;
            }
          } finally {
            P ? te() : N = false;
          }
        }
      }
      var te;
      if (typeof A == "function") te = function() {
        A(ae);
      };
      else if (typeof MessageChannel < "u") {
        var ce = new MessageChannel(), ie = ce.port2;
        ce.port1.onmessage = ae, te = function() {
          ie.postMessage(null);
        };
      } else te = function() {
        _(ae, 0);
      };
      function Se($, P) {
        L = _(function() {
          $(l.unstable_now());
        }, P);
      }
      l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function($) {
        $.callback = null;
      }, l.unstable_forceFrameRate = function($) {
        0 > $ || 125 < $ ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : U = 0 < $ ? Math.floor(1e3 / $) : 5;
      }, l.unstable_getCurrentPriorityLevel = function() {
        return S;
      }, l.unstable_next = function($) {
        switch (S) {
          case 1:
          case 2:
          case 3:
            var P = 3;
            break;
          default:
            P = S;
        }
        var ue = S;
        S = P;
        try {
          return $();
        } finally {
          S = ue;
        }
      }, l.unstable_requestPaint = function() {
        C = true;
      }, l.unstable_runWithPriority = function($, P) {
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
        var ue = S;
        S = $;
        try {
          return P();
        } finally {
          S = ue;
        }
      }, l.unstable_scheduleCallback = function($, P, ue) {
        var xe = l.unstable_now();
        switch (typeof ue == "object" && ue !== null ? (ue = ue.delay, ue = typeof ue == "number" && 0 < ue ? xe + ue : xe) : ue = xe, $) {
          case 1:
            var be = -1;
            break;
          case 2:
            be = 250;
            break;
          case 5:
            be = 1073741823;
            break;
          case 4:
            be = 1e4;
            break;
          default:
            be = 5e3;
        }
        return be = ue + be, $ = {
          id: v++,
          callback: P,
          priorityLevel: $,
          startTime: ue,
          expirationTime: be,
          sortIndex: -1
        }, ue > xe ? ($.sortIndex = ue, n(g, $), a(p) === null && $ === a(g) && (w ? (R(L), L = -1) : w = true, Se(B, ue - xe))) : ($.sortIndex = be, n(p, $), k || E || (k = true, N || (N = true, te()))), $;
      }, l.unstable_shouldYield = J, l.unstable_wrapCallback = function($) {
        var P = S;
        return function() {
          var ue = S;
          S = P;
          try {
            return $.apply(this, arguments);
          } finally {
            S = ue;
          }
        };
      };
    })(ld)), ld;
  }
  var Og;
  function cS() {
    return Og || (Og = 1, nd.exports = sS()), nd.exports;
  }
  var rd = {
    exports: {}
  }, zt = {};
  var Dg;
  function uS() {
    if (Dg) return zt;
    Dg = 1;
    var l = Ef();
    function n(p) {
      var g = "https://react.dev/errors/" + p;
      if (1 < arguments.length) {
        g += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var v = 2; v < arguments.length; v++) g += "&args[]=" + encodeURIComponent(arguments[v]);
      }
      return "Minified React error #" + p + "; visit " + g + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function a() {
    }
    var i = {
      d: {
        f: a,
        r: function() {
          throw Error(n(522));
        },
        D: a,
        C: a,
        L: a,
        m: a,
        X: a,
        S: a,
        M: a
      },
      p: 0,
      findDOMNode: null
    }, s = Symbol.for("react.portal");
    function c(p, g, v) {
      var y = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: s,
        key: y == null ? null : "" + y,
        children: p,
        containerInfo: g,
        implementation: v
      };
    }
    var f = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function h(p, g) {
      if (p === "font") return "";
      if (typeof g == "string") return g === "use-credentials" ? g : "";
    }
    return zt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, zt.createPortal = function(p, g) {
      var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!g || g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11) throw Error(n(299));
      return c(p, g, null, v);
    }, zt.flushSync = function(p) {
      var g = f.T, v = i.p;
      try {
        if (f.T = null, i.p = 2, p) return p();
      } finally {
        f.T = g, i.p = v, i.d.f();
      }
    }, zt.preconnect = function(p, g) {
      typeof p == "string" && (g ? (g = g.crossOrigin, g = typeof g == "string" ? g === "use-credentials" ? g : "" : void 0) : g = null, i.d.C(p, g));
    }, zt.prefetchDNS = function(p) {
      typeof p == "string" && i.d.D(p);
    }, zt.preinit = function(p, g) {
      if (typeof p == "string" && g && typeof g.as == "string") {
        var v = g.as, y = h(v, g.crossOrigin), S = typeof g.integrity == "string" ? g.integrity : void 0, E = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
        v === "style" ? i.d.S(p, typeof g.precedence == "string" ? g.precedence : void 0, {
          crossOrigin: y,
          integrity: S,
          fetchPriority: E
        }) : v === "script" && i.d.X(p, {
          crossOrigin: y,
          integrity: S,
          fetchPriority: E,
          nonce: typeof g.nonce == "string" ? g.nonce : void 0
        });
      }
    }, zt.preinitModule = function(p, g) {
      if (typeof p == "string") if (typeof g == "object" && g !== null) {
        if (g.as == null || g.as === "script") {
          var v = h(g.as, g.crossOrigin);
          i.d.M(p, {
            crossOrigin: v,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
            nonce: typeof g.nonce == "string" ? g.nonce : void 0
          });
        }
      } else g == null && i.d.M(p);
    }, zt.preload = function(p, g) {
      if (typeof p == "string" && typeof g == "object" && g !== null && typeof g.as == "string") {
        var v = g.as, y = h(v, g.crossOrigin);
        i.d.L(p, v, {
          crossOrigin: y,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0,
          nonce: typeof g.nonce == "string" ? g.nonce : void 0,
          type: typeof g.type == "string" ? g.type : void 0,
          fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0,
          referrerPolicy: typeof g.referrerPolicy == "string" ? g.referrerPolicy : void 0,
          imageSrcSet: typeof g.imageSrcSet == "string" ? g.imageSrcSet : void 0,
          imageSizes: typeof g.imageSizes == "string" ? g.imageSizes : void 0,
          media: typeof g.media == "string" ? g.media : void 0
        });
      }
    }, zt.preloadModule = function(p, g) {
      if (typeof p == "string") if (g) {
        var v = h(g.as, g.crossOrigin);
        i.d.m(p, {
          as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
          crossOrigin: v,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0
        });
      } else i.d.m(p);
    }, zt.requestFormReset = function(p) {
      i.d.r(p);
    }, zt.unstable_batchedUpdates = function(p, g) {
      return p(g);
    }, zt.useFormState = function(p, g, v) {
      return f.H.useFormState(p, g, v);
    }, zt.useFormStatus = function() {
      return f.H.useHostTransitionStatus();
    }, zt.version = "19.2.4", zt;
  }
  var zg;
  function mv() {
    if (zg) return rd.exports;
    zg = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), rd.exports = uS(), rd.exports;
  }
  var Ig;
  function dS() {
    if (Ig) return So;
    Ig = 1;
    var l = cS(), n = Ef(), a = mv();
    function i(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var r = 2; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
      }
      return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function s(e) {
      return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
    }
    function c(e) {
      var t = e, r = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do
          t = e, (t.flags & 4098) !== 0 && (r = t.return), e = t.return;
        while (e);
      }
      return t.tag === 3 ? r : null;
    }
    function f(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
      }
      return null;
    }
    function h(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
      }
      return null;
    }
    function p(e) {
      if (c(e) !== e) throw Error(i(188));
    }
    function g(e) {
      var t = e.alternate;
      if (!t) {
        if (t = c(e), t === null) throw Error(i(188));
        return t !== e ? null : e;
      }
      for (var r = e, o = t; ; ) {
        var u = r.return;
        if (u === null) break;
        var d = u.alternate;
        if (d === null) {
          if (o = u.return, o !== null) {
            r = o;
            continue;
          }
          break;
        }
        if (u.child === d.child) {
          for (d = u.child; d; ) {
            if (d === r) return p(u), e;
            if (d === o) return p(u), t;
            d = d.sibling;
          }
          throw Error(i(188));
        }
        if (r.return !== o.return) r = u, o = d;
        else {
          for (var x = false, M = u.child; M; ) {
            if (M === r) {
              x = true, r = u, o = d;
              break;
            }
            if (M === o) {
              x = true, o = u, r = d;
              break;
            }
            M = M.sibling;
          }
          if (!x) {
            for (M = d.child; M; ) {
              if (M === r) {
                x = true, r = d, o = u;
                break;
              }
              if (M === o) {
                x = true, o = d, r = u;
                break;
              }
              M = M.sibling;
            }
            if (!x) throw Error(i(189));
          }
        }
        if (r.alternate !== o) throw Error(i(190));
      }
      if (r.tag !== 3) throw Error(i(188));
      return r.stateNode.current === r ? e : t;
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
    var y = Object.assign, S = Symbol.for("react.element"), E = Symbol.for("react.transitional.element"), k = Symbol.for("react.portal"), w = Symbol.for("react.fragment"), C = Symbol.for("react.strict_mode"), _ = Symbol.for("react.profiler"), R = Symbol.for("react.consumer"), A = Symbol.for("react.context"), T = Symbol.for("react.forward_ref"), B = Symbol.for("react.suspense"), N = Symbol.for("react.suspense_list"), L = Symbol.for("react.memo"), U = Symbol.for("react.lazy"), X = Symbol.for("react.activity"), J = Symbol.for("react.memo_cache_sentinel"), ae = Symbol.iterator;
    function te(e) {
      return e === null || typeof e != "object" ? null : (e = ae && e[ae] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var ce = Symbol.for("react.client.reference");
    function ie(e) {
      if (e == null) return null;
      if (typeof e == "function") return e.$$typeof === ce ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case w:
          return "Fragment";
        case _:
          return "Profiler";
        case C:
          return "StrictMode";
        case B:
          return "Suspense";
        case N:
          return "SuspenseList";
        case X:
          return "Activity";
      }
      if (typeof e == "object") switch (e.$$typeof) {
        case k:
          return "Portal";
        case A:
          return e.displayName || "Context";
        case R:
          return (e._context.displayName || "Context") + ".Consumer";
        case T:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case L:
          return t = e.displayName || null, t !== null ? t : ie(e.type) || "Memo";
        case U:
          t = e._payload, e = e._init;
          try {
            return ie(e(t));
          } catch {
          }
      }
      return null;
    }
    var Se = Array.isArray, $ = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, P = a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ue = {
      pending: false,
      data: null,
      method: null,
      action: null
    }, xe = [], be = -1;
    function j(e) {
      return {
        current: e
      };
    }
    function D(e) {
      0 > be || (e.current = xe[be], xe[be] = null, be--);
    }
    function z(e, t) {
      be++, xe[be] = e.current, e.current = t;
    }
    var O = j(null), Y = j(null), Q = j(null), W = j(null);
    function de(e, t) {
      switch (z(Q, t), z(Y, e), z(O, null), t.nodeType) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Wp(e) : 0;
          break;
        default:
          if (e = t.tagName, t = t.namespaceURI) t = Wp(t), e = Jp(t, e);
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
      D(O), z(O, e);
    }
    function oe() {
      D(O), D(Y), D(Q);
    }
    function Me(e) {
      e.memoizedState !== null && z(W, e);
      var t = O.current, r = Jp(t, e.type);
      t !== r && (z(Y, e), z(O, r));
    }
    function Xe(e) {
      Y.current === e && (D(O), D(Y)), W.current === e && (D(W), go._currentValue = ue);
    }
    var Re, Ie;
    function Ve(e) {
      if (Re === void 0) try {
        throw Error();
      } catch (r) {
        var t = r.stack.trim().match(/\n( *(at )?)/);
        Re = t && t[1] || "", Ie = -1 < r.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < r.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
      return `
` + Re + e + Ie;
    }
    var Mt = false;
    function Yt(e, t) {
      if (!e || Mt) return "";
      Mt = true;
      var r = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var o = {
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
                  } catch (F) {
                    var K = F;
                  }
                  Reflect.construct(e, [], re);
                } else {
                  try {
                    re.call();
                  } catch (F) {
                    K = F;
                  }
                  e.call(re.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (F) {
                  K = F;
                }
                (re = e()) && typeof re.catch == "function" && re.catch(function() {
                });
              }
            } catch (F) {
              if (F && K && typeof F.stack == "string") return [
                F.stack,
                K.stack
              ];
            }
            return [
              null,
              null
            ];
          }
        };
        o.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var u = Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot, "name");
        u && u.configurable && Object.defineProperty(o.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot"
        });
        var d = o.DetermineComponentFrameRoot(), x = d[0], M = d[1];
        if (x && M) {
          var I = x.split(`
`), Z = M.split(`
`);
          for (u = o = 0; o < I.length && !I[o].includes("DetermineComponentFrameRoot"); ) o++;
          for (; u < Z.length && !Z[u].includes("DetermineComponentFrameRoot"); ) u++;
          if (o === I.length || u === Z.length) for (o = I.length - 1, u = Z.length - 1; 1 <= o && 0 <= u && I[o] !== Z[u]; ) u--;
          for (; 1 <= o && 0 <= u; o--, u--) if (I[o] !== Z[u]) {
            if (o !== 1 || u !== 1) do
              if (o--, u--, 0 > u || I[o] !== Z[u]) {
                var ee = `
` + I[o].replace(" at new ", " at ");
                return e.displayName && ee.includes("<anonymous>") && (ee = ee.replace("<anonymous>", e.displayName)), ee;
              }
            while (1 <= o && 0 <= u);
            break;
          }
        }
      } finally {
        Mt = false, Error.prepareStackTrace = r;
      }
      return (r = e ? e.displayName || e.name : "") ? Ve(r) : "";
    }
    function _n(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return Ve(e.type);
        case 16:
          return Ve("Lazy");
        case 13:
          return e.child !== t && t !== null ? Ve("Suspense Fallback") : Ve("Suspense");
        case 19:
          return Ve("SuspenseList");
        case 0:
        case 15:
          return Yt(e.type, false);
        case 11:
          return Yt(e.type.render, false);
        case 1:
          return Yt(e.type, true);
        case 31:
          return Ve("Activity");
        default:
          return "";
      }
    }
    function fn(e) {
      try {
        var t = "", r = null;
        do
          t += _n(e, r), r = e, e = e.return;
        while (e);
        return t;
      } catch (o) {
        return `
Error generating stack: ` + o.message + `
` + o.stack;
      }
    }
    var Dn = Object.prototype.hasOwnProperty, bl = l.unstable_scheduleCallback, er = l.unstable_cancelCallback, _a = l.unstable_shouldYield, Ma = l.unstable_requestPaint, Ct = l.unstable_now, tr = l.unstable_getCurrentPriorityLevel, ka = l.unstable_ImmediatePriority, ja = l.unstable_UserBlockingPriority, Lr = l.unstable_NormalPriority, qs = l.unstable_LowPriority, Ra = l.unstable_IdlePriority, Bo = l.log, Xo = l.unstable_setDisableYieldValue, vl = null, Ut = null;
    function zn(e) {
      if (typeof Bo == "function" && Xo(e), Ut && typeof Ut.setStrictMode == "function") try {
        Ut.setStrictMode(vl, e);
      } catch {
      }
    }
    var Bt = Math.clz32 ? Math.clz32 : $o, Gs = Math.log, Vo = Math.LN2;
    function $o(e) {
      return e >>>= 0, e === 0 ? 32 : 31 - (Gs(e) / Vo | 0) | 0;
    }
    var nr = 256, Ar = 262144, Tr = 4194304;
    function hn(e) {
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
    function xl(e, t, r) {
      var o = e.pendingLanes;
      if (o === 0) return 0;
      var u = 0, d = e.suspendedLanes, x = e.pingedLanes;
      e = e.warmLanes;
      var M = o & 134217727;
      return M !== 0 ? (o = M & ~d, o !== 0 ? u = hn(o) : (x &= M, x !== 0 ? u = hn(x) : r || (r = M & ~e, r !== 0 && (u = hn(r))))) : (M = o & ~d, M !== 0 ? u = hn(M) : x !== 0 ? u = hn(x) : r || (r = o & ~e, r !== 0 && (u = hn(r)))), u === 0 ? 0 : t !== 0 && t !== u && (t & d) === 0 && (d = u & -u, r = t & -t, d >= r || d === 32 && (r & 4194048) !== 0) ? t : u;
    }
    function Kn(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function qo(e, t) {
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
    function Nr() {
      var e = Tr;
      return Tr <<= 1, (Tr & 62914560) === 0 && (Tr = 4194304), e;
    }
    function lr(e) {
      for (var t = [], r = 0; 31 > r; r++) t.push(e);
      return t;
    }
    function rr(e, t) {
      e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
    }
    function In(e, t, r, o, u, d) {
      var x = e.pendingLanes;
      e.pendingLanes = r, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= r, e.entangledLanes &= r, e.errorRecoveryDisabledLanes &= r, e.shellSuspendCounter = 0;
      var M = e.entanglements, I = e.expirationTimes, Z = e.hiddenUpdates;
      for (r = x & ~r; 0 < r; ) {
        var ee = 31 - Bt(r), re = 1 << ee;
        M[ee] = 0, I[ee] = -1;
        var K = Z[ee];
        if (K !== null) for (Z[ee] = null, ee = 0; ee < K.length; ee++) {
          var F = K[ee];
          F !== null && (F.lane &= -536870913);
        }
        r &= ~re;
      }
      o !== 0 && Go(e, o, 0), d !== 0 && u === 0 && e.tag !== 0 && (e.suspendedLanes |= d & ~(x & ~t));
    }
    function Go(e, t, r) {
      e.pendingLanes |= t, e.suspendedLanes &= ~t;
      var o = 31 - Bt(t);
      e.entangledLanes |= t, e.entanglements[o] = e.entanglements[o] | 1073741824 | r & 261930;
    }
    function Zo(e, t) {
      var r = e.entangledLanes |= t;
      for (e = e.entanglements; r; ) {
        var o = 31 - Bt(r), u = 1 << o;
        u & t | e[o] & t && (e[o] |= t), r &= ~u;
      }
    }
    function Ko(e, t) {
      var r = t & -t;
      return r = (r & 42) !== 0 ? 1 : Pn(r), (r & (e.suspendedLanes | t)) !== 0 ? 0 : r;
    }
    function Pn(e) {
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
    function La(e) {
      return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
    }
    function Hn() {
      var e = P.p;
      return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : wg(e.type));
    }
    function ar(e, t) {
      var r = P.p;
      try {
        return P.p = e, t();
      } finally {
        P.p = r;
      }
    }
    var Qn = Math.random().toString(36).slice(2), Et = "__reactFiber$" + Qn, le = "__reactProps$" + Qn, _e = "__reactContainer$" + Qn, We = "__reactEvents$" + Qn, He = "__reactListeners$" + Qn, ot = "__reactHandles$" + Qn, ut = "__reactResources$" + Qn, Ze = "__reactMarker$" + Qn;
    function lt(e) {
      delete e[Et], delete e[le], delete e[We], delete e[He], delete e[ot];
    }
    function Pe(e) {
      var t = e[Et];
      if (t) return t;
      for (var r = e.parentNode; r; ) {
        if (t = r[_e] || r[Et]) {
          if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = og(e); e !== null; ) {
            if (r = e[Et]) return r;
            e = og(e);
          }
          return t;
        }
        e = r, r = e.parentNode;
      }
      return null;
    }
    function at(e) {
      if (e = e[Et] || e[_e]) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
      }
      return null;
    }
    function Lt(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(i(33));
    }
    function kt(e) {
      var t = e[ut];
      return t || (t = e[ut] = {
        hoistableStyles: /* @__PURE__ */ new Map(),
        hoistableScripts: /* @__PURE__ */ new Map()
      }), t;
    }
    function Je(e) {
      e[Ze] = true;
    }
    var Mn = /* @__PURE__ */ new Set(), Sl = {};
    function tn(e, t) {
      kn(e, t), kn(e + "Capture", t);
    }
    function kn(e, t) {
      for (Sl[e] = t, e = 0; e < t.length; e++) Mn.add(t[e]);
    }
    var Aa = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), wl = {}, Yn = {};
    function Cl(e) {
      return Dn.call(Yn, e) ? true : Dn.call(wl, e) ? false : Aa.test(e) ? Yn[e] = true : (wl[e] = true, false);
    }
    function or(e, t, r) {
      if (Cl(t)) if (r === null) e.removeAttribute(t);
      else {
        switch (typeof r) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var o = t.toLowerCase().slice(0, 5);
            if (o !== "data-" && o !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + r);
      }
    }
    function Fn(e, t, r) {
      if (r === null) e.removeAttribute(t);
      else {
        switch (typeof r) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, "" + r);
      }
    }
    function Gt(e, t, r, o) {
      if (o === null) e.removeAttribute(r);
      else {
        switch (typeof o) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(r);
            return;
        }
        e.setAttributeNS(t, r, "" + o);
      }
    }
    function Dt(e) {
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
    function Po(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Qo(e, t, r) {
      var o = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (!e.hasOwnProperty(t) && typeof o < "u" && typeof o.get == "function" && typeof o.set == "function") {
        var u = o.get, d = o.set;
        return Object.defineProperty(e, t, {
          configurable: true,
          get: function() {
            return u.call(this);
          },
          set: function(x) {
            r = "" + x, d.call(this, x);
          }
        }), Object.defineProperty(e, t, {
          enumerable: o.enumerable
        }), {
          getValue: function() {
            return r;
          },
          setValue: function(x) {
            r = "" + x;
          },
          stopTracking: function() {
            e._valueTracker = null, delete e[t];
          }
        };
      }
    }
    function Or(e) {
      if (!e._valueTracker) {
        var t = Po(e) ? "checked" : "value";
        e._valueTracker = Qo(e, t, "" + e[t]);
      }
    }
    function qf(e) {
      if (!e) return false;
      var t = e._valueTracker;
      if (!t) return true;
      var r = t.getValue(), o = "";
      return e && (o = Po(e) ? e.checked ? "true" : "false" : e.value), e = o, e !== r ? (t.setValue(e), true) : false;
    }
    function Fo(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var W1 = /[\n"\\]/g;
    function mn(e) {
      return e.replace(W1, function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      });
    }
    function Zs(e, t, r, o, u, d, x, M) {
      e.name = "", x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" ? e.type = x : e.removeAttribute("type"), t != null ? x === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Dt(t)) : e.value !== "" + Dt(t) && (e.value = "" + Dt(t)) : x !== "submit" && x !== "reset" || e.removeAttribute("value"), t != null ? Ks(e, x, Dt(t)) : r != null ? Ks(e, x, Dt(r)) : o != null && e.removeAttribute("value"), u == null && d != null && (e.defaultChecked = !!d), u != null && (e.checked = u && typeof u != "function" && typeof u != "symbol"), M != null && typeof M != "function" && typeof M != "symbol" && typeof M != "boolean" ? e.name = "" + Dt(M) : e.removeAttribute("name");
    }
    function Gf(e, t, r, o, u, d, x, M) {
      if (d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (e.type = d), t != null || r != null) {
        if (!(d !== "submit" && d !== "reset" || t != null)) {
          Or(e);
          return;
        }
        r = r != null ? "" + Dt(r) : "", t = t != null ? "" + Dt(t) : r, M || t === e.value || (e.value = t), e.defaultValue = t;
      }
      o = o ?? u, o = typeof o != "function" && typeof o != "symbol" && !!o, e.checked = M ? e.checked : !!o, e.defaultChecked = !!o, x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" && (e.name = x), Or(e);
    }
    function Ks(e, t, r) {
      t === "number" && Fo(e.ownerDocument) === e || e.defaultValue === "" + r || (e.defaultValue = "" + r);
    }
    function Dr(e, t, r, o) {
      if (e = e.options, t) {
        t = {};
        for (var u = 0; u < r.length; u++) t["$" + r[u]] = true;
        for (r = 0; r < e.length; r++) u = t.hasOwnProperty("$" + e[r].value), e[r].selected !== u && (e[r].selected = u), u && o && (e[r].defaultSelected = true);
      } else {
        for (r = "" + Dt(r), t = null, u = 0; u < e.length; u++) {
          if (e[u].value === r) {
            e[u].selected = true, o && (e[u].defaultSelected = true);
            return;
          }
          t !== null || e[u].disabled || (t = e[u]);
        }
        t !== null && (t.selected = true);
      }
    }
    function Zf(e, t, r) {
      if (t != null && (t = "" + Dt(t), t !== e.value && (e.value = t), r == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = r != null ? "" + Dt(r) : "";
    }
    function Kf(e, t, r, o) {
      if (t == null) {
        if (o != null) {
          if (r != null) throw Error(i(92));
          if (Se(o)) {
            if (1 < o.length) throw Error(i(93));
            o = o[0];
          }
          r = o;
        }
        r == null && (r = ""), t = r;
      }
      r = Dt(t), e.defaultValue = r, o = e.textContent, o === r && o !== "" && o !== null && (e.value = o), Or(e);
    }
    function zr(e, t) {
      if (t) {
        var r = e.firstChild;
        if (r && r === e.lastChild && r.nodeType === 3) {
          r.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var J1 = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function Pf(e, t, r) {
      var o = t.indexOf("--") === 0;
      r == null || typeof r == "boolean" || r === "" ? o ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : o ? e.setProperty(t, r) : typeof r != "number" || r === 0 || J1.has(t) ? t === "float" ? e.cssFloat = r : e[t] = ("" + r).trim() : e[t] = r + "px";
    }
    function Qf(e, t, r) {
      if (t != null && typeof t != "object") throw Error(i(62));
      if (e = e.style, r != null) {
        for (var o in r) !r.hasOwnProperty(o) || t != null && t.hasOwnProperty(o) || (o.indexOf("--") === 0 ? e.setProperty(o, "") : o === "float" ? e.cssFloat = "" : e[o] = "");
        for (var u in t) o = t[u], t.hasOwnProperty(u) && r[u] !== o && Pf(e, u, o);
      } else for (var d in t) t.hasOwnProperty(d) && Pf(e, d, t[d]);
    }
    function Ps(e) {
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
    var e0 = /* @__PURE__ */ new Map([
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
    ]), t0 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Wo(e) {
      return t0.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
    }
    function Wn() {
    }
    var Qs = null;
    function Fs(e) {
      return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
    }
    var Ir = null, Hr = null;
    function Ff(e) {
      var t = at(e);
      if (t && (e = t.stateNode)) {
        var r = e[le] || null;
        e: switch (e = t.stateNode, t.type) {
          case "input":
            if (Zs(e, r.value, r.defaultValue, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name), t = r.name, r.type === "radio" && t != null) {
              for (r = e; r.parentNode; ) r = r.parentNode;
              for (r = r.querySelectorAll('input[name="' + mn("" + t) + '"][type="radio"]'), t = 0; t < r.length; t++) {
                var o = r[t];
                if (o !== e && o.form === e.form) {
                  var u = o[le] || null;
                  if (!u) throw Error(i(90));
                  Zs(o, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name);
                }
              }
              for (t = 0; t < r.length; t++) o = r[t], o.form === e.form && qf(o);
            }
            break e;
          case "textarea":
            Zf(e, r.value, r.defaultValue);
            break e;
          case "select":
            t = r.value, t != null && Dr(e, !!r.multiple, t, false);
        }
      }
    }
    var Ws = false;
    function Wf(e, t, r) {
      if (Ws) return e(t, r);
      Ws = true;
      try {
        var o = e(t);
        return o;
      } finally {
        if (Ws = false, (Ir !== null || Hr !== null) && (Yi(), Ir && (t = Ir, e = Hr, Hr = Ir = null, Ff(t), e))) for (t = 0; t < e.length; t++) Ff(e[t]);
      }
    }
    function Ta(e, t) {
      var r = e.stateNode;
      if (r === null) return null;
      var o = r[le] || null;
      if (o === null) return null;
      r = o[t];
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
          (o = !o.disabled) || (e = e.type, o = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !o;
          break e;
        default:
          e = false;
      }
      if (e) return null;
      if (r && typeof r != "function") throw Error(i(231, t, typeof r));
      return r;
    }
    var Jn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Js = false;
    if (Jn) try {
      var Na = {};
      Object.defineProperty(Na, "passive", {
        get: function() {
          Js = true;
        }
      }), window.addEventListener("test", Na, Na), window.removeEventListener("test", Na, Na);
    } catch {
      Js = false;
    }
    var El = null, ec = null, Jo = null;
    function Jf() {
      if (Jo) return Jo;
      var e, t = ec, r = t.length, o, u = "value" in El ? El.value : El.textContent, d = u.length;
      for (e = 0; e < r && t[e] === u[e]; e++) ;
      var x = r - e;
      for (o = 1; o <= x && t[r - o] === u[d - o]; o++) ;
      return Jo = u.slice(e, 1 < o ? 1 - o : void 0);
    }
    function ei(e) {
      var t = e.keyCode;
      return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
    }
    function ti() {
      return true;
    }
    function eh() {
      return false;
    }
    function Zt(e) {
      function t(r, o, u, d, x) {
        this._reactName = r, this._targetInst = u, this.type = o, this.nativeEvent = d, this.target = x, this.currentTarget = null;
        for (var M in e) e.hasOwnProperty(M) && (r = e[M], this[M] = r ? r(d) : d[M]);
        return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === false) ? ti : eh, this.isPropagationStopped = eh, this;
      }
      return y(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var r = this.nativeEvent;
          r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = false), this.isDefaultPrevented = ti);
        },
        stopPropagation: function() {
          var r = this.nativeEvent;
          r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = true), this.isPropagationStopped = ti);
        },
        persist: function() {
        },
        isPersistent: ti
      }), t;
    }
    var ir = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, ni = Zt(ir), Oa = y({}, ir, {
      view: 0,
      detail: 0
    }), n0 = Zt(Oa), tc, nc, Da, li = y({}, Oa, {
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
      getModifierState: rc,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (e !== Da && (Da && e.type === "mousemove" ? (tc = e.screenX - Da.screenX, nc = e.screenY - Da.screenY) : nc = tc = 0, Da = e), tc);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : nc;
      }
    }), th = Zt(li), l0 = y({}, li, {
      dataTransfer: 0
    }), r0 = Zt(l0), a0 = y({}, Oa, {
      relatedTarget: 0
    }), lc = Zt(a0), o0 = y({}, ir, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), i0 = Zt(o0), s0 = y({}, ir, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), c0 = Zt(s0), u0 = y({}, ir, {
      data: 0
    }), nh = Zt(u0), d0 = {
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
    }, f0 = {
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
    }, h0 = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function m0(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = h0[e]) ? !!t[e] : false;
    }
    function rc() {
      return m0;
    }
    var p0 = y({}, Oa, {
      key: function(e) {
        if (e.key) {
          var t = d0[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress" ? (e = ei(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? f0[e.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: rc,
      charCode: function(e) {
        return e.type === "keypress" ? ei(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? ei(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), g0 = Zt(p0), y0 = y({}, li, {
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
    }), lh = Zt(y0), b0 = y({}, Oa, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: rc
    }), v0 = Zt(b0), x0 = y({}, ir, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), S0 = Zt(x0), w0 = y({}, li, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), C0 = Zt(w0), E0 = y({}, ir, {
      newState: 0,
      oldState: 0
    }), _0 = Zt(E0), M0 = [
      9,
      13,
      27,
      32
    ], ac = Jn && "CompositionEvent" in window, za = null;
    Jn && "documentMode" in document && (za = document.documentMode);
    var k0 = Jn && "TextEvent" in window && !za, rh = Jn && (!ac || za && 8 < za && 11 >= za), ah = " ", oh = false;
    function ih(e, t) {
      switch (e) {
        case "keyup":
          return M0.indexOf(t.keyCode) !== -1;
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
    function sh(e) {
      return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
    }
    var Yr = false;
    function j0(e, t) {
      switch (e) {
        case "compositionend":
          return sh(t);
        case "keypress":
          return t.which !== 32 ? null : (oh = true, ah);
        case "textInput":
          return e = t.data, e === ah && oh ? null : e;
        default:
          return null;
      }
    }
    function R0(e, t) {
      if (Yr) return e === "compositionend" || !ac && ih(e, t) ? (e = Jf(), Jo = ec = El = null, Yr = false, e) : null;
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
          return rh && t.locale !== "ko" ? null : t.data;
        default:
          return null;
      }
    }
    var L0 = {
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
    function ch(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!L0[e.type] : t === "textarea";
    }
    function uh(e, t, r, o) {
      Ir ? Hr ? Hr.push(o) : Hr = [
        o
      ] : Ir = o, t = Gi(t, "onChange"), 0 < t.length && (r = new ni("onChange", "change", null, r, o), e.push({
        event: r,
        listeners: t
      }));
    }
    var Ia = null, Ha = null;
    function A0(e) {
      Gp(e, 0);
    }
    function ri(e) {
      var t = Lt(e);
      if (qf(t)) return e;
    }
    function dh(e, t) {
      if (e === "change") return t;
    }
    var fh = false;
    if (Jn) {
      var oc;
      if (Jn) {
        var ic = "oninput" in document;
        if (!ic) {
          var hh = document.createElement("div");
          hh.setAttribute("oninput", "return;"), ic = typeof hh.oninput == "function";
        }
        oc = ic;
      } else oc = false;
      fh = oc && (!document.documentMode || 9 < document.documentMode);
    }
    function mh() {
      Ia && (Ia.detachEvent("onpropertychange", ph), Ha = Ia = null);
    }
    function ph(e) {
      if (e.propertyName === "value" && ri(Ha)) {
        var t = [];
        uh(t, Ha, e, Fs(e)), Wf(A0, t);
      }
    }
    function T0(e, t, r) {
      e === "focusin" ? (mh(), Ia = t, Ha = r, Ia.attachEvent("onpropertychange", ph)) : e === "focusout" && mh();
    }
    function N0(e) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown") return ri(Ha);
    }
    function O0(e, t) {
      if (e === "click") return ri(t);
    }
    function D0(e, t) {
      if (e === "input" || e === "change") return ri(t);
    }
    function z0(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var nn = typeof Object.is == "function" ? Object.is : z0;
    function Ya(e, t) {
      if (nn(e, t)) return true;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null) return false;
      var r = Object.keys(e), o = Object.keys(t);
      if (r.length !== o.length) return false;
      for (o = 0; o < r.length; o++) {
        var u = r[o];
        if (!Dn.call(t, u) || !nn(e[u], t[u])) return false;
      }
      return true;
    }
    function gh(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function yh(e, t) {
      var r = gh(e);
      e = 0;
      for (var o; r; ) {
        if (r.nodeType === 3) {
          if (o = e + r.textContent.length, e <= t && o >= t) return {
            node: r,
            offset: t - e
          };
          e = o;
        }
        e: {
          for (; r; ) {
            if (r.nextSibling) {
              r = r.nextSibling;
              break e;
            }
            r = r.parentNode;
          }
          r = void 0;
        }
        r = gh(r);
      }
    }
    function bh(e, t) {
      return e && t ? e === t ? true : e && e.nodeType === 3 ? false : t && t.nodeType === 3 ? bh(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : false : false;
    }
    function vh(e) {
      e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
      for (var t = Fo(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var r = typeof t.contentWindow.location.href == "string";
        } catch {
          r = false;
        }
        if (r) e = t.contentWindow;
        else break;
        t = Fo(e.document);
      }
      return t;
    }
    function sc(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    var I0 = Jn && "documentMode" in document && 11 >= document.documentMode, Ur = null, cc = null, Ua = null, uc = false;
    function xh(e, t, r) {
      var o = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
      uc || Ur == null || Ur !== Fo(o) || (o = Ur, "selectionStart" in o && sc(o) ? o = {
        start: o.selectionStart,
        end: o.selectionEnd
      } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = {
        anchorNode: o.anchorNode,
        anchorOffset: o.anchorOffset,
        focusNode: o.focusNode,
        focusOffset: o.focusOffset
      }), Ua && Ya(Ua, o) || (Ua = o, o = Gi(cc, "onSelect"), 0 < o.length && (t = new ni("onSelect", "select", null, t, r), e.push({
        event: t,
        listeners: o
      }), t.target = Ur)));
    }
    function sr(e, t) {
      var r = {};
      return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r;
    }
    var Br = {
      animationend: sr("Animation", "AnimationEnd"),
      animationiteration: sr("Animation", "AnimationIteration"),
      animationstart: sr("Animation", "AnimationStart"),
      transitionrun: sr("Transition", "TransitionRun"),
      transitionstart: sr("Transition", "TransitionStart"),
      transitioncancel: sr("Transition", "TransitionCancel"),
      transitionend: sr("Transition", "TransitionEnd")
    }, dc = {}, Sh = {};
    Jn && (Sh = document.createElement("div").style, "AnimationEvent" in window || (delete Br.animationend.animation, delete Br.animationiteration.animation, delete Br.animationstart.animation), "TransitionEvent" in window || delete Br.transitionend.transition);
    function cr(e) {
      if (dc[e]) return dc[e];
      if (!Br[e]) return e;
      var t = Br[e], r;
      for (r in t) if (t.hasOwnProperty(r) && r in Sh) return dc[e] = t[r];
      return e;
    }
    var wh = cr("animationend"), Ch = cr("animationiteration"), Eh = cr("animationstart"), H0 = cr("transitionrun"), Y0 = cr("transitionstart"), U0 = cr("transitioncancel"), _h = cr("transitionend"), Mh = /* @__PURE__ */ new Map(), fc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    fc.push("scrollEnd");
    function jn(e, t) {
      Mh.set(e, t), tn(t, [
        e
      ]);
    }
    var ai = typeof reportError == "function" ? reportError : function(e) {
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
    }, pn = [], Xr = 0, hc = 0;
    function oi() {
      for (var e = Xr, t = hc = Xr = 0; t < e; ) {
        var r = pn[t];
        pn[t++] = null;
        var o = pn[t];
        pn[t++] = null;
        var u = pn[t];
        pn[t++] = null;
        var d = pn[t];
        if (pn[t++] = null, o !== null && u !== null) {
          var x = o.pending;
          x === null ? u.next = u : (u.next = x.next, x.next = u), o.pending = u;
        }
        d !== 0 && kh(r, u, d);
      }
    }
    function ii(e, t, r, o) {
      pn[Xr++] = e, pn[Xr++] = t, pn[Xr++] = r, pn[Xr++] = o, hc |= o, e.lanes |= o, e = e.alternate, e !== null && (e.lanes |= o);
    }
    function mc(e, t, r, o) {
      return ii(e, t, r, o), si(e);
    }
    function ur(e, t) {
      return ii(e, null, null, t), si(e);
    }
    function kh(e, t, r) {
      e.lanes |= r;
      var o = e.alternate;
      o !== null && (o.lanes |= r);
      for (var u = false, d = e.return; d !== null; ) d.childLanes |= r, o = d.alternate, o !== null && (o.childLanes |= r), d.tag === 22 && (e = d.stateNode, e === null || e._visibility & 1 || (u = true)), e = d, d = d.return;
      return e.tag === 3 ? (d = e.stateNode, u && t !== null && (u = 31 - Bt(r), e = d.hiddenUpdates, o = e[u], o === null ? e[u] = [
        t
      ] : o.push(t), t.lane = r | 536870912), d) : null;
    }
    function si(e) {
      if (50 < so) throw so = 0, Cu = null, Error(i(185));
      for (var t = e.return; t !== null; ) e = t, t = e.return;
      return e.tag === 3 ? e.stateNode : null;
    }
    var Vr = {};
    function B0(e, t, r, o) {
      this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
    }
    function ln(e, t, r, o) {
      return new B0(e, t, r, o);
    }
    function pc(e) {
      return e = e.prototype, !(!e || !e.isReactComponent);
    }
    function el(e, t) {
      var r = e.alternate;
      return r === null ? (r = ln(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 65011712, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r.refCleanup = e.refCleanup, r;
    }
    function jh(e, t) {
      e.flags &= 65011714;
      var r = e.alternate;
      return r === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = r.childLanes, e.lanes = r.lanes, e.child = r.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = r.memoizedProps, e.memoizedState = r.memoizedState, e.updateQueue = r.updateQueue, e.type = r.type, t = r.dependencies, e.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      }), e;
    }
    function ci(e, t, r, o, u, d) {
      var x = 0;
      if (o = e, typeof e == "function") pc(e) && (x = 1);
      else if (typeof e == "string") x = Gx(e, r, O.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
      else e: switch (e) {
        case X:
          return e = ln(31, r, t, u), e.elementType = X, e.lanes = d, e;
        case w:
          return dr(r.children, u, d, t);
        case C:
          x = 8, u |= 24;
          break;
        case _:
          return e = ln(12, r, t, u | 2), e.elementType = _, e.lanes = d, e;
        case B:
          return e = ln(13, r, t, u), e.elementType = B, e.lanes = d, e;
        case N:
          return e = ln(19, r, t, u), e.elementType = N, e.lanes = d, e;
        default:
          if (typeof e == "object" && e !== null) switch (e.$$typeof) {
            case A:
              x = 10;
              break e;
            case R:
              x = 9;
              break e;
            case T:
              x = 11;
              break e;
            case L:
              x = 14;
              break e;
            case U:
              x = 16, o = null;
              break e;
          }
          x = 29, r = Error(i(130, e === null ? "null" : typeof e, "")), o = null;
      }
      return t = ln(x, r, t, u), t.elementType = e, t.type = o, t.lanes = d, t;
    }
    function dr(e, t, r, o) {
      return e = ln(7, e, o, t), e.lanes = r, e;
    }
    function gc(e, t, r) {
      return e = ln(6, e, null, t), e.lanes = r, e;
    }
    function Rh(e) {
      var t = ln(18, null, null, 0);
      return t.stateNode = e, t;
    }
    function yc(e, t, r) {
      return t = ln(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation
      }, t;
    }
    var Lh = /* @__PURE__ */ new WeakMap();
    function gn(e, t) {
      if (typeof e == "object" && e !== null) {
        var r = Lh.get(e);
        return r !== void 0 ? r : (t = {
          value: e,
          source: t,
          stack: fn(t)
        }, Lh.set(e, t), t);
      }
      return {
        value: e,
        source: t,
        stack: fn(t)
      };
    }
    var $r = [], qr = 0, ui = null, Ba = 0, yn = [], bn = 0, _l = null, Un = 1, Bn = "";
    function tl(e, t) {
      $r[qr++] = Ba, $r[qr++] = ui, ui = e, Ba = t;
    }
    function Ah(e, t, r) {
      yn[bn++] = Un, yn[bn++] = Bn, yn[bn++] = _l, _l = e;
      var o = Un;
      e = Bn;
      var u = 32 - Bt(o) - 1;
      o &= ~(1 << u), r += 1;
      var d = 32 - Bt(t) + u;
      if (30 < d) {
        var x = u - u % 5;
        d = (o & (1 << x) - 1).toString(32), o >>= x, u -= x, Un = 1 << 32 - Bt(t) + u | r << u | o, Bn = d + e;
      } else Un = 1 << d | r << u | o, Bn = e;
    }
    function bc(e) {
      e.return !== null && (tl(e, 1), Ah(e, 1, 0));
    }
    function vc(e) {
      for (; e === ui; ) ui = $r[--qr], $r[qr] = null, Ba = $r[--qr], $r[qr] = null;
      for (; e === _l; ) _l = yn[--bn], yn[bn] = null, Bn = yn[--bn], yn[bn] = null, Un = yn[--bn], yn[bn] = null;
    }
    function Th(e, t) {
      yn[bn++] = Un, yn[bn++] = Bn, yn[bn++] = _l, Un = t.id, Bn = t.overflow, _l = e;
    }
    var At = null, it = null, Be = false, Ml = null, vn = false, xc = Error(i(519));
    function kl(e) {
      var t = Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
      throw Xa(gn(t, e)), xc;
    }
    function Nh(e) {
      var t = e.stateNode, r = e.type, o = e.memoizedProps;
      switch (t[Et] = e, t[le] = o, r) {
        case "dialog":
          De("cancel", t), De("close", t);
          break;
        case "iframe":
        case "object":
        case "embed":
          De("load", t);
          break;
        case "video":
        case "audio":
          for (r = 0; r < uo.length; r++) De(uo[r], t);
          break;
        case "source":
          De("error", t);
          break;
        case "img":
        case "image":
        case "link":
          De("error", t), De("load", t);
          break;
        case "details":
          De("toggle", t);
          break;
        case "input":
          De("invalid", t), Gf(t, o.value, o.defaultValue, o.checked, o.defaultChecked, o.type, o.name, true);
          break;
        case "select":
          De("invalid", t);
          break;
        case "textarea":
          De("invalid", t), Kf(t, o.value, o.defaultValue, o.children);
      }
      r = o.children, typeof r != "string" && typeof r != "number" && typeof r != "bigint" || t.textContent === "" + r || o.suppressHydrationWarning === true || Qp(t.textContent, r) ? (o.popover != null && (De("beforetoggle", t), De("toggle", t)), o.onScroll != null && De("scroll", t), o.onScrollEnd != null && De("scrollend", t), o.onClick != null && (t.onclick = Wn), t = true) : t = false, t || kl(e, true);
    }
    function Oh(e) {
      for (At = e.return; At; ) switch (At.tag) {
        case 5:
        case 31:
        case 13:
          vn = false;
          return;
        case 27:
        case 3:
          vn = true;
          return;
        default:
          At = At.return;
      }
    }
    function Gr(e) {
      if (e !== At) return false;
      if (!Be) return Oh(e), Be = true, false;
      var t = e.tag, r;
      if ((r = t !== 3 && t !== 27) && ((r = t === 5) && (r = e.type, r = !(r !== "form" && r !== "button") || Hu(e.type, e.memoizedProps)), r = !r), r && it && kl(e), Oh(e), t === 13) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(i(317));
        it = ag(e);
      } else if (t === 31) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(i(317));
        it = ag(e);
      } else t === 27 ? (t = it, Bl(e.type) ? (e = Vu, Vu = null, it = e) : it = t) : it = At ? Sn(e.stateNode.nextSibling) : null;
      return true;
    }
    function fr() {
      it = At = null, Be = false;
    }
    function Sc() {
      var e = Ml;
      return e !== null && (Ft === null ? Ft = e : Ft.push.apply(Ft, e), Ml = null), e;
    }
    function Xa(e) {
      Ml === null ? Ml = [
        e
      ] : Ml.push(e);
    }
    var wc = j(null), hr = null, nl = null;
    function jl(e, t, r) {
      z(wc, t._currentValue), t._currentValue = r;
    }
    function ll(e) {
      e._currentValue = wc.current, D(wc);
    }
    function Cc(e, t, r) {
      for (; e !== null; ) {
        var o = e.alternate;
        if ((e.childLanes & t) !== t ? (e.childLanes |= t, o !== null && (o.childLanes |= t)) : o !== null && (o.childLanes & t) !== t && (o.childLanes |= t), e === r) break;
        e = e.return;
      }
    }
    function Ec(e, t, r, o) {
      var u = e.child;
      for (u !== null && (u.return = e); u !== null; ) {
        var d = u.dependencies;
        if (d !== null) {
          var x = u.child;
          d = d.firstContext;
          e: for (; d !== null; ) {
            var M = d;
            d = u;
            for (var I = 0; I < t.length; I++) if (M.context === t[I]) {
              d.lanes |= r, M = d.alternate, M !== null && (M.lanes |= r), Cc(d.return, r, e), o || (x = null);
              break e;
            }
            d = M.next;
          }
        } else if (u.tag === 18) {
          if (x = u.return, x === null) throw Error(i(341));
          x.lanes |= r, d = x.alternate, d !== null && (d.lanes |= r), Cc(x, r, e), x = null;
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
    function Zr(e, t, r, o) {
      e = null;
      for (var u = t, d = false; u !== null; ) {
        if (!d) {
          if ((u.flags & 524288) !== 0) d = true;
          else if ((u.flags & 262144) !== 0) break;
        }
        if (u.tag === 10) {
          var x = u.alternate;
          if (x === null) throw Error(i(387));
          if (x = x.memoizedProps, x !== null) {
            var M = u.type;
            nn(u.pendingProps.value, x.value) || (e !== null ? e.push(M) : e = [
              M
            ]);
          }
        } else if (u === W.current) {
          if (x = u.alternate, x === null) throw Error(i(387));
          x.memoizedState.memoizedState !== u.memoizedState.memoizedState && (e !== null ? e.push(go) : e = [
            go
          ]);
        }
        u = u.return;
      }
      e !== null && Ec(t, e, r, o), t.flags |= 262144;
    }
    function di(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!nn(e.context._currentValue, e.memoizedValue)) return true;
        e = e.next;
      }
      return false;
    }
    function mr(e) {
      hr = e, nl = null, e = e.dependencies, e !== null && (e.firstContext = null);
    }
    function Tt(e) {
      return Dh(hr, e);
    }
    function fi(e, t) {
      return hr === null && mr(e), Dh(e, t);
    }
    function Dh(e, t) {
      var r = t._currentValue;
      if (t = {
        context: t,
        memoizedValue: r,
        next: null
      }, nl === null) {
        if (e === null) throw Error(i(308));
        nl = t, e.dependencies = {
          lanes: 0,
          firstContext: t
        }, e.flags |= 524288;
      } else nl = nl.next = t;
      return r;
    }
    var X0 = typeof AbortController < "u" ? AbortController : function() {
      var e = [], t = this.signal = {
        aborted: false,
        addEventListener: function(r, o) {
          e.push(o);
        }
      };
      this.abort = function() {
        t.aborted = true, e.forEach(function(r) {
          return r();
        });
      };
    }, V0 = l.unstable_scheduleCallback, $0 = l.unstable_NormalPriority, vt = {
      $$typeof: A,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
    function _c() {
      return {
        controller: new X0(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function Va(e) {
      e.refCount--, e.refCount === 0 && V0($0, function() {
        e.controller.abort();
      });
    }
    var $a = null, Mc = 0, Kr = 0, Pr = null;
    function q0(e, t) {
      if ($a === null) {
        var r = $a = [];
        Mc = 0, Kr = Ru(), Pr = {
          status: "pending",
          value: void 0,
          then: function(o) {
            r.push(o);
          }
        };
      }
      return Mc++, t.then(zh, zh), t;
    }
    function zh() {
      if (--Mc === 0 && $a !== null) {
        Pr !== null && (Pr.status = "fulfilled");
        var e = $a;
        $a = null, Kr = 0, Pr = null;
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function G0(e, t) {
      var r = [], o = {
        status: "pending",
        value: null,
        reason: null,
        then: function(u) {
          r.push(u);
        }
      };
      return e.then(function() {
        o.status = "fulfilled", o.value = t;
        for (var u = 0; u < r.length; u++) (0, r[u])(t);
      }, function(u) {
        for (o.status = "rejected", o.reason = u, u = 0; u < r.length; u++) (0, r[u])(void 0);
      }), o;
    }
    var Ih = $.S;
    $.S = function(e, t) {
      xp = Ct(), typeof t == "object" && t !== null && typeof t.then == "function" && q0(e, t), Ih !== null && Ih(e, t);
    };
    var pr = j(null);
    function kc() {
      var e = pr.current;
      return e !== null ? e : rt.pooledCache;
    }
    function hi(e, t) {
      t === null ? z(pr, pr.current) : z(pr, t.pool);
    }
    function Hh() {
      var e = kc();
      return e === null ? null : {
        parent: vt._currentValue,
        pool: e
      };
    }
    var Qr = Error(i(460)), jc = Error(i(474)), mi = Error(i(542)), pi = {
      then: function() {
      }
    };
    function Yh(e) {
      return e = e.status, e === "fulfilled" || e === "rejected";
    }
    function Uh(e, t, r) {
      switch (r = e[r], r === void 0 ? e.push(t) : r !== t && (t.then(Wn, Wn), t = r), t.status) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw e = t.reason, Xh(e), e;
        default:
          if (typeof t.status == "string") t.then(Wn, Wn);
          else {
            if (e = rt, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
            e = t, e.status = "pending", e.then(function(o) {
              if (t.status === "pending") {
                var u = t;
                u.status = "fulfilled", u.value = o;
              }
            }, function(o) {
              if (t.status === "pending") {
                var u = t;
                u.status = "rejected", u.reason = o;
              }
            });
          }
          switch (t.status) {
            case "fulfilled":
              return t.value;
            case "rejected":
              throw e = t.reason, Xh(e), e;
          }
          throw yr = t, Qr;
      }
    }
    function gr(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (r) {
        throw r !== null && typeof r == "object" && typeof r.then == "function" ? (yr = r, Qr) : r;
      }
    }
    var yr = null;
    function Bh() {
      if (yr === null) throw Error(i(459));
      var e = yr;
      return yr = null, e;
    }
    function Xh(e) {
      if (e === Qr || e === mi) throw Error(i(483));
    }
    var Fr = null, qa = 0;
    function gi(e) {
      var t = qa;
      return qa += 1, Fr === null && (Fr = []), Uh(Fr, e, t);
    }
    function Ga(e, t) {
      t = t.props.ref, e.ref = t !== void 0 ? t : null;
    }
    function yi(e, t) {
      throw t.$$typeof === S ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
    }
    function Vh(e) {
      function t(V, H) {
        if (e) {
          var G = V.deletions;
          G === null ? (V.deletions = [
            H
          ], V.flags |= 16) : G.push(H);
        }
      }
      function r(V, H) {
        if (!e) return null;
        for (; H !== null; ) t(V, H), H = H.sibling;
        return null;
      }
      function o(V) {
        for (var H = /* @__PURE__ */ new Map(); V !== null; ) V.key !== null ? H.set(V.key, V) : H.set(V.index, V), V = V.sibling;
        return H;
      }
      function u(V, H) {
        return V = el(V, H), V.index = 0, V.sibling = null, V;
      }
      function d(V, H, G) {
        return V.index = G, e ? (G = V.alternate, G !== null ? (G = G.index, G < H ? (V.flags |= 67108866, H) : G) : (V.flags |= 67108866, H)) : (V.flags |= 1048576, H);
      }
      function x(V) {
        return e && V.alternate === null && (V.flags |= 67108866), V;
      }
      function M(V, H, G, ne) {
        return H === null || H.tag !== 6 ? (H = gc(G, V.mode, ne), H.return = V, H) : (H = u(H, G), H.return = V, H);
      }
      function I(V, H, G, ne) {
        var we = G.type;
        return we === w ? ee(V, H, G.props.children, ne, G.key) : H !== null && (H.elementType === we || typeof we == "object" && we !== null && we.$$typeof === U && gr(we) === H.type) ? (H = u(H, G.props), Ga(H, G), H.return = V, H) : (H = ci(G.type, G.key, G.props, null, V.mode, ne), Ga(H, G), H.return = V, H);
      }
      function Z(V, H, G, ne) {
        return H === null || H.tag !== 4 || H.stateNode.containerInfo !== G.containerInfo || H.stateNode.implementation !== G.implementation ? (H = yc(G, V.mode, ne), H.return = V, H) : (H = u(H, G.children || []), H.return = V, H);
      }
      function ee(V, H, G, ne, we) {
        return H === null || H.tag !== 7 ? (H = dr(G, V.mode, ne, we), H.return = V, H) : (H = u(H, G), H.return = V, H);
      }
      function re(V, H, G) {
        if (typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint") return H = gc("" + H, V.mode, G), H.return = V, H;
        if (typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case E:
              return G = ci(H.type, H.key, H.props, null, V.mode, G), Ga(G, H), G.return = V, G;
            case k:
              return H = yc(H, V.mode, G), H.return = V, H;
            case U:
              return H = gr(H), re(V, H, G);
          }
          if (Se(H) || te(H)) return H = dr(H, V.mode, G, null), H.return = V, H;
          if (typeof H.then == "function") return re(V, gi(H), G);
          if (H.$$typeof === A) return re(V, fi(V, H), G);
          yi(V, H);
        }
        return null;
      }
      function K(V, H, G, ne) {
        var we = H !== null ? H.key : null;
        if (typeof G == "string" && G !== "" || typeof G == "number" || typeof G == "bigint") return we !== null ? null : M(V, H, "" + G, ne);
        if (typeof G == "object" && G !== null) {
          switch (G.$$typeof) {
            case E:
              return G.key === we ? I(V, H, G, ne) : null;
            case k:
              return G.key === we ? Z(V, H, G, ne) : null;
            case U:
              return G = gr(G), K(V, H, G, ne);
          }
          if (Se(G) || te(G)) return we !== null ? null : ee(V, H, G, ne, null);
          if (typeof G.then == "function") return K(V, H, gi(G), ne);
          if (G.$$typeof === A) return K(V, H, fi(V, G), ne);
          yi(V, G);
        }
        return null;
      }
      function F(V, H, G, ne, we) {
        if (typeof ne == "string" && ne !== "" || typeof ne == "number" || typeof ne == "bigint") return V = V.get(G) || null, M(H, V, "" + ne, we);
        if (typeof ne == "object" && ne !== null) {
          switch (ne.$$typeof) {
            case E:
              return V = V.get(ne.key === null ? G : ne.key) || null, I(H, V, ne, we);
            case k:
              return V = V.get(ne.key === null ? G : ne.key) || null, Z(H, V, ne, we);
            case U:
              return ne = gr(ne), F(V, H, G, ne, we);
          }
          if (Se(ne) || te(ne)) return V = V.get(G) || null, ee(H, V, ne, we, null);
          if (typeof ne.then == "function") return F(V, H, G, gi(ne), we);
          if (ne.$$typeof === A) return F(V, H, G, fi(H, ne), we);
          yi(H, ne);
        }
        return null;
      }
      function pe(V, H, G, ne) {
        for (var we = null, $e = null, ge = H, Ae = H = 0, Ue = null; ge !== null && Ae < G.length; Ae++) {
          ge.index > Ae ? (Ue = ge, ge = null) : Ue = ge.sibling;
          var qe = K(V, ge, G[Ae], ne);
          if (qe === null) {
            ge === null && (ge = Ue);
            break;
          }
          e && ge && qe.alternate === null && t(V, ge), H = d(qe, H, Ae), $e === null ? we = qe : $e.sibling = qe, $e = qe, ge = Ue;
        }
        if (Ae === G.length) return r(V, ge), Be && tl(V, Ae), we;
        if (ge === null) {
          for (; Ae < G.length; Ae++) ge = re(V, G[Ae], ne), ge !== null && (H = d(ge, H, Ae), $e === null ? we = ge : $e.sibling = ge, $e = ge);
          return Be && tl(V, Ae), we;
        }
        for (ge = o(ge); Ae < G.length; Ae++) Ue = F(ge, V, Ae, G[Ae], ne), Ue !== null && (e && Ue.alternate !== null && ge.delete(Ue.key === null ? Ae : Ue.key), H = d(Ue, H, Ae), $e === null ? we = Ue : $e.sibling = Ue, $e = Ue);
        return e && ge.forEach(function(Gl) {
          return t(V, Gl);
        }), Be && tl(V, Ae), we;
      }
      function Ee(V, H, G, ne) {
        if (G == null) throw Error(i(151));
        for (var we = null, $e = null, ge = H, Ae = H = 0, Ue = null, qe = G.next(); ge !== null && !qe.done; Ae++, qe = G.next()) {
          ge.index > Ae ? (Ue = ge, ge = null) : Ue = ge.sibling;
          var Gl = K(V, ge, qe.value, ne);
          if (Gl === null) {
            ge === null && (ge = Ue);
            break;
          }
          e && ge && Gl.alternate === null && t(V, ge), H = d(Gl, H, Ae), $e === null ? we = Gl : $e.sibling = Gl, $e = Gl, ge = Ue;
        }
        if (qe.done) return r(V, ge), Be && tl(V, Ae), we;
        if (ge === null) {
          for (; !qe.done; Ae++, qe = G.next()) qe = re(V, qe.value, ne), qe !== null && (H = d(qe, H, Ae), $e === null ? we = qe : $e.sibling = qe, $e = qe);
          return Be && tl(V, Ae), we;
        }
        for (ge = o(ge); !qe.done; Ae++, qe = G.next()) qe = F(ge, V, Ae, qe.value, ne), qe !== null && (e && qe.alternate !== null && ge.delete(qe.key === null ? Ae : qe.key), H = d(qe, H, Ae), $e === null ? we = qe : $e.sibling = qe, $e = qe);
        return e && ge.forEach(function(lS) {
          return t(V, lS);
        }), Be && tl(V, Ae), we;
      }
      function nt(V, H, G, ne) {
        if (typeof G == "object" && G !== null && G.type === w && G.key === null && (G = G.props.children), typeof G == "object" && G !== null) {
          switch (G.$$typeof) {
            case E:
              e: {
                for (var we = G.key; H !== null; ) {
                  if (H.key === we) {
                    if (we = G.type, we === w) {
                      if (H.tag === 7) {
                        r(V, H.sibling), ne = u(H, G.props.children), ne.return = V, V = ne;
                        break e;
                      }
                    } else if (H.elementType === we || typeof we == "object" && we !== null && we.$$typeof === U && gr(we) === H.type) {
                      r(V, H.sibling), ne = u(H, G.props), Ga(ne, G), ne.return = V, V = ne;
                      break e;
                    }
                    r(V, H);
                    break;
                  } else t(V, H);
                  H = H.sibling;
                }
                G.type === w ? (ne = dr(G.props.children, V.mode, ne, G.key), ne.return = V, V = ne) : (ne = ci(G.type, G.key, G.props, null, V.mode, ne), Ga(ne, G), ne.return = V, V = ne);
              }
              return x(V);
            case k:
              e: {
                for (we = G.key; H !== null; ) {
                  if (H.key === we) if (H.tag === 4 && H.stateNode.containerInfo === G.containerInfo && H.stateNode.implementation === G.implementation) {
                    r(V, H.sibling), ne = u(H, G.children || []), ne.return = V, V = ne;
                    break e;
                  } else {
                    r(V, H);
                    break;
                  }
                  else t(V, H);
                  H = H.sibling;
                }
                ne = yc(G, V.mode, ne), ne.return = V, V = ne;
              }
              return x(V);
            case U:
              return G = gr(G), nt(V, H, G, ne);
          }
          if (Se(G)) return pe(V, H, G, ne);
          if (te(G)) {
            if (we = te(G), typeof we != "function") throw Error(i(150));
            return G = we.call(G), Ee(V, H, G, ne);
          }
          if (typeof G.then == "function") return nt(V, H, gi(G), ne);
          if (G.$$typeof === A) return nt(V, H, fi(V, G), ne);
          yi(V, G);
        }
        return typeof G == "string" && G !== "" || typeof G == "number" || typeof G == "bigint" ? (G = "" + G, H !== null && H.tag === 6 ? (r(V, H.sibling), ne = u(H, G), ne.return = V, V = ne) : (r(V, H), ne = gc(G, V.mode, ne), ne.return = V, V = ne), x(V)) : r(V, H);
      }
      return function(V, H, G, ne) {
        try {
          qa = 0;
          var we = nt(V, H, G, ne);
          return Fr = null, we;
        } catch (ge) {
          if (ge === Qr || ge === mi) throw ge;
          var $e = ln(29, ge, null, V.mode);
          return $e.lanes = ne, $e.return = V, $e;
        } finally {
        }
      };
    }
    var br = Vh(true), $h = Vh(false), Rl = false;
    function Rc(e) {
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
    function Lc(e, t) {
      e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        callbacks: null
      });
    }
    function Ll(e) {
      return {
        lane: e,
        tag: 0,
        payload: null,
        callback: null,
        next: null
      };
    }
    function Al(e, t, r) {
      var o = e.updateQueue;
      if (o === null) return null;
      if (o = o.shared, (Ge & 2) !== 0) {
        var u = o.pending;
        return u === null ? t.next = t : (t.next = u.next, u.next = t), o.pending = t, t = si(e), kh(e, null, r), t;
      }
      return ii(e, o, t, r), si(e);
    }
    function Za(e, t, r) {
      if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194048) !== 0)) {
        var o = t.lanes;
        o &= e.pendingLanes, r |= o, t.lanes = r, Zo(e, r);
      }
    }
    function Ac(e, t) {
      var r = e.updateQueue, o = e.alternate;
      if (o !== null && (o = o.updateQueue, r === o)) {
        var u = null, d = null;
        if (r = r.firstBaseUpdate, r !== null) {
          do {
            var x = {
              lane: r.lane,
              tag: r.tag,
              payload: r.payload,
              callback: null,
              next: null
            };
            d === null ? u = d = x : d = d.next = x, r = r.next;
          } while (r !== null);
          d === null ? u = d = t : d = d.next = t;
        } else u = d = t;
        r = {
          baseState: o.baseState,
          firstBaseUpdate: u,
          lastBaseUpdate: d,
          shared: o.shared,
          callbacks: o.callbacks
        }, e.updateQueue = r;
        return;
      }
      e = r.lastBaseUpdate, e === null ? r.firstBaseUpdate = t : e.next = t, r.lastBaseUpdate = t;
    }
    var Tc = false;
    function Ka() {
      if (Tc) {
        var e = Pr;
        if (e !== null) throw e;
      }
    }
    function Pa(e, t, r, o) {
      Tc = false;
      var u = e.updateQueue;
      Rl = false;
      var d = u.firstBaseUpdate, x = u.lastBaseUpdate, M = u.shared.pending;
      if (M !== null) {
        u.shared.pending = null;
        var I = M, Z = I.next;
        I.next = null, x === null ? d = Z : x.next = Z, x = I;
        var ee = e.alternate;
        ee !== null && (ee = ee.updateQueue, M = ee.lastBaseUpdate, M !== x && (M === null ? ee.firstBaseUpdate = Z : M.next = Z, ee.lastBaseUpdate = I));
      }
      if (d !== null) {
        var re = u.baseState;
        x = 0, ee = Z = I = null, M = d;
        do {
          var K = M.lane & -536870913, F = K !== M.lane;
          if (F ? (Ye & K) === K : (o & K) === K) {
            K !== 0 && K === Kr && (Tc = true), ee !== null && (ee = ee.next = {
              lane: 0,
              tag: M.tag,
              payload: M.payload,
              callback: null,
              next: null
            });
            e: {
              var pe = e, Ee = M;
              K = t;
              var nt = r;
              switch (Ee.tag) {
                case 1:
                  if (pe = Ee.payload, typeof pe == "function") {
                    re = pe.call(nt, re, K);
                    break e;
                  }
                  re = pe;
                  break e;
                case 3:
                  pe.flags = pe.flags & -65537 | 128;
                case 0:
                  if (pe = Ee.payload, K = typeof pe == "function" ? pe.call(nt, re, K) : pe, K == null) break e;
                  re = y({}, re, K);
                  break e;
                case 2:
                  Rl = true;
              }
            }
            K = M.callback, K !== null && (e.flags |= 64, F && (e.flags |= 8192), F = u.callbacks, F === null ? u.callbacks = [
              K
            ] : F.push(K));
          } else F = {
            lane: K,
            tag: M.tag,
            payload: M.payload,
            callback: M.callback,
            next: null
          }, ee === null ? (Z = ee = F, I = re) : ee = ee.next = F, x |= K;
          if (M = M.next, M === null) {
            if (M = u.shared.pending, M === null) break;
            F = M, M = F.next, F.next = null, u.lastBaseUpdate = F, u.shared.pending = null;
          }
        } while (true);
        ee === null && (I = re), u.baseState = I, u.firstBaseUpdate = Z, u.lastBaseUpdate = ee, d === null && (u.shared.lanes = 0), zl |= x, e.lanes = x, e.memoizedState = re;
      }
    }
    function qh(e, t) {
      if (typeof e != "function") throw Error(i(191, e));
      e.call(t);
    }
    function Gh(e, t) {
      var r = e.callbacks;
      if (r !== null) for (e.callbacks = null, e = 0; e < r.length; e++) qh(r[e], t);
    }
    var Wr = j(null), bi = j(0);
    function Zh(e, t) {
      e = fl, z(bi, e), z(Wr, t), fl = e | t.baseLanes;
    }
    function Nc() {
      z(bi, fl), z(Wr, Wr.current);
    }
    function Oc() {
      fl = bi.current, D(Wr), D(bi);
    }
    var rn = j(null), xn = null;
    function Tl(e) {
      var t = e.alternate;
      z(yt, yt.current & 1), z(rn, e), xn === null && (t === null || Wr.current !== null || t.memoizedState !== null) && (xn = e);
    }
    function Dc(e) {
      z(yt, yt.current), z(rn, e), xn === null && (xn = e);
    }
    function Kh(e) {
      e.tag === 22 ? (z(yt, yt.current), z(rn, e), xn === null && (xn = e)) : Nl();
    }
    function Nl() {
      z(yt, yt.current), z(rn, rn.current);
    }
    function an(e) {
      D(rn), xn === e && (xn = null), D(yt);
    }
    var yt = j(0);
    function vi(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var r = t.memoizedState;
          if (r !== null && (r = r.dehydrated, r === null || Bu(r) || Xu(r))) return t;
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
    var rl = 0, Le = null, et = null, xt = null, xi = false, Jr = false, vr = false, Si = 0, Qa = 0, ea = null, Z0 = 0;
    function ft() {
      throw Error(i(321));
    }
    function zc(e, t) {
      if (t === null) return false;
      for (var r = 0; r < t.length && r < e.length; r++) if (!nn(e[r], t[r])) return false;
      return true;
    }
    function Ic(e, t, r, o, u, d) {
      return rl = d, Le = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, $.H = e === null || e.memoizedState === null ? Am : Wc, vr = false, d = r(o, u), vr = false, Jr && (d = Qh(t, r, o, u)), Ph(e), d;
    }
    function Ph(e) {
      $.H = Ja;
      var t = et !== null && et.next !== null;
      if (rl = 0, xt = et = Le = null, xi = false, Qa = 0, ea = null, t) throw Error(i(300));
      e === null || St || (e = e.dependencies, e !== null && di(e) && (St = true));
    }
    function Qh(e, t, r, o) {
      Le = e;
      var u = 0;
      do {
        if (Jr && (ea = null), Qa = 0, Jr = false, 25 <= u) throw Error(i(301));
        if (u += 1, xt = et = null, e.updateQueue != null) {
          var d = e.updateQueue;
          d.lastEffect = null, d.events = null, d.stores = null, d.memoCache != null && (d.memoCache.index = 0);
        }
        $.H = Tm, d = t(r, o);
      } while (Jr);
      return d;
    }
    function K0() {
      var e = $.H, t = e.useState()[0];
      return t = typeof t.then == "function" ? Fa(t) : t, e = e.useState()[0], (et !== null ? et.memoizedState : null) !== e && (Le.flags |= 1024), t;
    }
    function Hc() {
      var e = Si !== 0;
      return Si = 0, e;
    }
    function Yc(e, t, r) {
      t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~r;
    }
    function Uc(e) {
      if (xi) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        xi = false;
      }
      rl = 0, xt = et = Le = null, Jr = false, Qa = Si = 0, ea = null;
    }
    function Xt() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return xt === null ? Le.memoizedState = xt = e : xt = xt.next = e, xt;
    }
    function bt() {
      if (et === null) {
        var e = Le.alternate;
        e = e !== null ? e.memoizedState : null;
      } else e = et.next;
      var t = xt === null ? Le.memoizedState : xt.next;
      if (t !== null) xt = t, et = e;
      else {
        if (e === null) throw Le.alternate === null ? Error(i(467)) : Error(i(310));
        et = e, e = {
          memoizedState: et.memoizedState,
          baseState: et.baseState,
          baseQueue: et.baseQueue,
          queue: et.queue,
          next: null
        }, xt === null ? Le.memoizedState = xt = e : xt = xt.next = e;
      }
      return xt;
    }
    function wi() {
      return {
        lastEffect: null,
        events: null,
        stores: null,
        memoCache: null
      };
    }
    function Fa(e) {
      var t = Qa;
      return Qa += 1, ea === null && (ea = []), e = Uh(ea, e, t), t = Le, (xt === null ? t.memoizedState : xt.next) === null && (t = t.alternate, $.H = t === null || t.memoizedState === null ? Am : Wc), e;
    }
    function Ci(e) {
      if (e !== null && typeof e == "object") {
        if (typeof e.then == "function") return Fa(e);
        if (e.$$typeof === A) return Tt(e);
      }
      throw Error(i(438, String(e)));
    }
    function Bc(e) {
      var t = null, r = Le.updateQueue;
      if (r !== null && (t = r.memoCache), t == null) {
        var o = Le.alternate;
        o !== null && (o = o.updateQueue, o !== null && (o = o.memoCache, o != null && (t = {
          data: o.data.map(function(u) {
            return u.slice();
          }),
          index: 0
        })));
      }
      if (t == null && (t = {
        data: [],
        index: 0
      }), r === null && (r = wi(), Le.updateQueue = r), r.memoCache = t, r = t.data[t.index], r === void 0) for (r = t.data[t.index] = Array(e), o = 0; o < e; o++) r[o] = J;
      return t.index++, r;
    }
    function al(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Ei(e) {
      var t = bt();
      return Xc(t, et, e);
    }
    function Xc(e, t, r) {
      var o = e.queue;
      if (o === null) throw Error(i(311));
      o.lastRenderedReducer = r;
      var u = e.baseQueue, d = o.pending;
      if (d !== null) {
        if (u !== null) {
          var x = u.next;
          u.next = d.next, d.next = x;
        }
        t.baseQueue = u = d, o.pending = null;
      }
      if (d = e.baseState, u === null) e.memoizedState = d;
      else {
        t = u.next;
        var M = x = null, I = null, Z = t, ee = false;
        do {
          var re = Z.lane & -536870913;
          if (re !== Z.lane ? (Ye & re) === re : (rl & re) === re) {
            var K = Z.revertLane;
            if (K === 0) I !== null && (I = I.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: Z.action,
              hasEagerState: Z.hasEagerState,
              eagerState: Z.eagerState,
              next: null
            }), re === Kr && (ee = true);
            else if ((rl & K) === K) {
              Z = Z.next, K === Kr && (ee = true);
              continue;
            } else re = {
              lane: 0,
              revertLane: Z.revertLane,
              gesture: null,
              action: Z.action,
              hasEagerState: Z.hasEagerState,
              eagerState: Z.eagerState,
              next: null
            }, I === null ? (M = I = re, x = d) : I = I.next = re, Le.lanes |= K, zl |= K;
            re = Z.action, vr && r(d, re), d = Z.hasEagerState ? Z.eagerState : r(d, re);
          } else K = {
            lane: re,
            revertLane: Z.revertLane,
            gesture: Z.gesture,
            action: Z.action,
            hasEagerState: Z.hasEagerState,
            eagerState: Z.eagerState,
            next: null
          }, I === null ? (M = I = K, x = d) : I = I.next = K, Le.lanes |= re, zl |= re;
          Z = Z.next;
        } while (Z !== null && Z !== t);
        if (I === null ? x = d : I.next = M, !nn(d, e.memoizedState) && (St = true, ee && (r = Pr, r !== null))) throw r;
        e.memoizedState = d, e.baseState = x, e.baseQueue = I, o.lastRenderedState = d;
      }
      return u === null && (o.lanes = 0), [
        e.memoizedState,
        o.dispatch
      ];
    }
    function Vc(e) {
      var t = bt(), r = t.queue;
      if (r === null) throw Error(i(311));
      r.lastRenderedReducer = e;
      var o = r.dispatch, u = r.pending, d = t.memoizedState;
      if (u !== null) {
        r.pending = null;
        var x = u = u.next;
        do
          d = e(d, x.action), x = x.next;
        while (x !== u);
        nn(d, t.memoizedState) || (St = true), t.memoizedState = d, t.baseQueue === null && (t.baseState = d), r.lastRenderedState = d;
      }
      return [
        d,
        o
      ];
    }
    function Fh(e, t, r) {
      var o = Le, u = bt(), d = Be;
      if (d) {
        if (r === void 0) throw Error(i(407));
        r = r();
      } else r = t();
      var x = !nn((et || u).memoizedState, r);
      if (x && (u.memoizedState = r, St = true), u = u.queue, Gc(em.bind(null, o, u, e), [
        e
      ]), u.getSnapshot !== t || x || xt !== null && xt.memoizedState.tag & 1) {
        if (o.flags |= 2048, ta(9, {
          destroy: void 0
        }, Jh.bind(null, o, u, r, t), null), rt === null) throw Error(i(349));
        d || (rl & 127) !== 0 || Wh(o, t, r);
      }
      return r;
    }
    function Wh(e, t, r) {
      e.flags |= 16384, e = {
        getSnapshot: t,
        value: r
      }, t = Le.updateQueue, t === null ? (t = wi(), Le.updateQueue = t, t.stores = [
        e
      ]) : (r = t.stores, r === null ? t.stores = [
        e
      ] : r.push(e));
    }
    function Jh(e, t, r, o) {
      t.value = r, t.getSnapshot = o, tm(t) && nm(e);
    }
    function em(e, t, r) {
      return r(function() {
        tm(t) && nm(e);
      });
    }
    function tm(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var r = t();
        return !nn(e, r);
      } catch {
        return true;
      }
    }
    function nm(e) {
      var t = ur(e, 2);
      t !== null && Wt(t, e, 2);
    }
    function $c(e) {
      var t = Xt();
      if (typeof e == "function") {
        var r = e;
        if (e = r(), vr) {
          zn(true);
          try {
            r();
          } finally {
            zn(false);
          }
        }
      }
      return t.memoizedState = t.baseState = e, t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: al,
        lastRenderedState: e
      }, t;
    }
    function lm(e, t, r, o) {
      return e.baseState = r, Xc(e, et, typeof o == "function" ? o : al);
    }
    function P0(e, t, r, o, u) {
      if (ki(e)) throw Error(i(485));
      if (e = t.action, e !== null) {
        var d = {
          payload: u,
          action: e,
          next: null,
          isTransition: true,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(x) {
            d.listeners.push(x);
          }
        };
        $.T !== null ? r(true) : d.isTransition = false, o(d), r = t.pending, r === null ? (d.next = t.pending = d, rm(t, d)) : (d.next = r.next, t.pending = r.next = d);
      }
    }
    function rm(e, t) {
      var r = t.action, o = t.payload, u = e.state;
      if (t.isTransition) {
        var d = $.T, x = {};
        $.T = x;
        try {
          var M = r(u, o), I = $.S;
          I !== null && I(x, M), am(e, t, M);
        } catch (Z) {
          qc(e, t, Z);
        } finally {
          d !== null && x.types !== null && (d.types = x.types), $.T = d;
        }
      } else try {
        d = r(u, o), am(e, t, d);
      } catch (Z) {
        qc(e, t, Z);
      }
    }
    function am(e, t, r) {
      r !== null && typeof r == "object" && typeof r.then == "function" ? r.then(function(o) {
        om(e, t, o);
      }, function(o) {
        return qc(e, t, o);
      }) : om(e, t, r);
    }
    function om(e, t, r) {
      t.status = "fulfilled", t.value = r, im(t), e.state = r, t = e.pending, t !== null && (r = t.next, r === t ? e.pending = null : (r = r.next, t.next = r, rm(e, r)));
    }
    function qc(e, t, r) {
      var o = e.pending;
      if (e.pending = null, o !== null) {
        o = o.next;
        do
          t.status = "rejected", t.reason = r, im(t), t = t.next;
        while (t !== o);
      }
      e.action = null;
    }
    function im(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function sm(e, t) {
      return t;
    }
    function cm(e, t) {
      if (Be) {
        var r = rt.formState;
        if (r !== null) {
          e: {
            var o = Le;
            if (Be) {
              if (it) {
                t: {
                  for (var u = it, d = vn; u.nodeType !== 8; ) {
                    if (!d) {
                      u = null;
                      break t;
                    }
                    if (u = Sn(u.nextSibling), u === null) {
                      u = null;
                      break t;
                    }
                  }
                  d = u.data, u = d === "F!" || d === "F" ? u : null;
                }
                if (u) {
                  it = Sn(u.nextSibling), o = u.data === "F!";
                  break e;
                }
              }
              kl(o);
            }
            o = false;
          }
          o && (t = r[0]);
        }
      }
      return r = Xt(), r.memoizedState = r.baseState = t, o = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: sm,
        lastRenderedState: t
      }, r.queue = o, r = jm.bind(null, Le, o), o.dispatch = r, o = $c(false), d = Fc.bind(null, Le, false, o.queue), o = Xt(), u = {
        state: t,
        dispatch: null,
        action: e,
        pending: null
      }, o.queue = u, r = P0.bind(null, Le, u, d, r), u.dispatch = r, o.memoizedState = e, [
        t,
        r,
        false
      ];
    }
    function um(e) {
      var t = bt();
      return dm(t, et, e);
    }
    function dm(e, t, r) {
      if (t = Xc(e, t, sm)[0], e = Ei(al)[0], typeof t == "object" && t !== null && typeof t.then == "function") try {
        var o = Fa(t);
      } catch (x) {
        throw x === Qr ? mi : x;
      }
      else o = t;
      t = bt();
      var u = t.queue, d = u.dispatch;
      return r !== t.memoizedState && (Le.flags |= 2048, ta(9, {
        destroy: void 0
      }, Q0.bind(null, u, r), null)), [
        o,
        d,
        e
      ];
    }
    function Q0(e, t) {
      e.action = t;
    }
    function fm(e) {
      var t = bt(), r = et;
      if (r !== null) return dm(t, r, e);
      bt(), t = t.memoizedState, r = bt();
      var o = r.queue.dispatch;
      return r.memoizedState = e, [
        t,
        o,
        false
      ];
    }
    function ta(e, t, r, o) {
      return e = {
        tag: e,
        create: r,
        deps: o,
        inst: t,
        next: null
      }, t = Le.updateQueue, t === null && (t = wi(), Le.updateQueue = t), r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (o = r.next, r.next = e, e.next = o, t.lastEffect = e), e;
    }
    function hm() {
      return bt().memoizedState;
    }
    function _i(e, t, r, o) {
      var u = Xt();
      Le.flags |= e, u.memoizedState = ta(1 | t, {
        destroy: void 0
      }, r, o === void 0 ? null : o);
    }
    function Mi(e, t, r, o) {
      var u = bt();
      o = o === void 0 ? null : o;
      var d = u.memoizedState.inst;
      et !== null && o !== null && zc(o, et.memoizedState.deps) ? u.memoizedState = ta(t, d, r, o) : (Le.flags |= e, u.memoizedState = ta(1 | t, d, r, o));
    }
    function mm(e, t) {
      _i(8390656, 8, e, t);
    }
    function Gc(e, t) {
      Mi(2048, 8, e, t);
    }
    function F0(e) {
      Le.flags |= 4;
      var t = Le.updateQueue;
      if (t === null) t = wi(), Le.updateQueue = t, t.events = [
        e
      ];
      else {
        var r = t.events;
        r === null ? t.events = [
          e
        ] : r.push(e);
      }
    }
    function pm(e) {
      var t = bt().memoizedState;
      return F0({
        ref: t,
        nextImpl: e
      }), function() {
        if ((Ge & 2) !== 0) throw Error(i(440));
        return t.impl.apply(void 0, arguments);
      };
    }
    function gm(e, t) {
      return Mi(4, 2, e, t);
    }
    function ym(e, t) {
      return Mi(4, 4, e, t);
    }
    function bm(e, t) {
      if (typeof t == "function") {
        e = e();
        var r = t(e);
        return function() {
          typeof r == "function" ? r() : t(null);
        };
      }
      if (t != null) return e = e(), t.current = e, function() {
        t.current = null;
      };
    }
    function vm(e, t, r) {
      r = r != null ? r.concat([
        e
      ]) : null, Mi(4, 4, bm.bind(null, t, e), r);
    }
    function Zc() {
    }
    function xm(e, t) {
      var r = bt();
      t = t === void 0 ? null : t;
      var o = r.memoizedState;
      return t !== null && zc(t, o[1]) ? o[0] : (r.memoizedState = [
        e,
        t
      ], e);
    }
    function Sm(e, t) {
      var r = bt();
      t = t === void 0 ? null : t;
      var o = r.memoizedState;
      if (t !== null && zc(t, o[1])) return o[0];
      if (o = e(), vr) {
        zn(true);
        try {
          e();
        } finally {
          zn(false);
        }
      }
      return r.memoizedState = [
        o,
        t
      ], o;
    }
    function Kc(e, t, r) {
      return r === void 0 || (rl & 1073741824) !== 0 && (Ye & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = r, e = wp(), Le.lanes |= e, zl |= e, r);
    }
    function wm(e, t, r, o) {
      return nn(r, t) ? r : Wr.current !== null ? (e = Kc(e, r, o), nn(e, t) || (St = true), e) : (rl & 42) === 0 || (rl & 1073741824) !== 0 && (Ye & 261930) === 0 ? (St = true, e.memoizedState = r) : (e = wp(), Le.lanes |= e, zl |= e, t);
    }
    function Cm(e, t, r, o, u) {
      var d = P.p;
      P.p = d !== 0 && 8 > d ? d : 8;
      var x = $.T, M = {};
      $.T = M, Fc(e, false, t, r);
      try {
        var I = u(), Z = $.S;
        if (Z !== null && Z(M, I), I !== null && typeof I == "object" && typeof I.then == "function") {
          var ee = G0(I, o);
          Wa(e, t, ee, cn(e));
        } else Wa(e, t, o, cn(e));
      } catch (re) {
        Wa(e, t, {
          then: function() {
          },
          status: "rejected",
          reason: re
        }, cn());
      } finally {
        P.p = d, x !== null && M.types !== null && (x.types = M.types), $.T = x;
      }
    }
    function W0() {
    }
    function Pc(e, t, r, o) {
      if (e.tag !== 5) throw Error(i(476));
      var u = Em(e).queue;
      Cm(e, u, t, ue, r === null ? W0 : function() {
        return _m(e), r(o);
      });
    }
    function Em(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: ue,
        baseState: ue,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: al,
          lastRenderedState: ue
        },
        next: null
      };
      var r = {};
      return t.next = {
        memoizedState: r,
        baseState: r,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: al,
          lastRenderedState: r
        },
        next: null
      }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
    }
    function _m(e) {
      var t = Em(e);
      t.next === null && (t = e.alternate.memoizedState), Wa(e, t.next.queue, {}, cn());
    }
    function Qc() {
      return Tt(go);
    }
    function Mm() {
      return bt().memoizedState;
    }
    function km() {
      return bt().memoizedState;
    }
    function J0(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var r = cn();
            e = Ll(r);
            var o = Al(t, e, r);
            o !== null && (Wt(o, t, r), Za(o, t, r)), t = {
              cache: _c()
            }, e.payload = t;
            return;
        }
        t = t.return;
      }
    }
    function ex(e, t, r) {
      var o = cn();
      r = {
        lane: o,
        revertLane: 0,
        gesture: null,
        action: r,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, ki(e) ? Rm(t, r) : (r = mc(e, t, r, o), r !== null && (Wt(r, e, o), Lm(r, t, o)));
    }
    function jm(e, t, r) {
      var o = cn();
      Wa(e, t, r, o);
    }
    function Wa(e, t, r, o) {
      var u = {
        lane: o,
        revertLane: 0,
        gesture: null,
        action: r,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (ki(e)) Rm(t, u);
      else {
        var d = e.alternate;
        if (e.lanes === 0 && (d === null || d.lanes === 0) && (d = t.lastRenderedReducer, d !== null)) try {
          var x = t.lastRenderedState, M = d(x, r);
          if (u.hasEagerState = true, u.eagerState = M, nn(M, x)) return ii(e, t, u, 0), rt === null && oi(), false;
        } catch {
        } finally {
        }
        if (r = mc(e, t, u, o), r !== null) return Wt(r, e, o), Lm(r, t, o), true;
      }
      return false;
    }
    function Fc(e, t, r, o) {
      if (o = {
        lane: 2,
        revertLane: Ru(),
        gesture: null,
        action: o,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, ki(e)) {
        if (t) throw Error(i(479));
      } else t = mc(e, r, o, 2), t !== null && Wt(t, e, 2);
    }
    function ki(e) {
      var t = e.alternate;
      return e === Le || t !== null && t === Le;
    }
    function Rm(e, t) {
      Jr = xi = true;
      var r = e.pending;
      r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t;
    }
    function Lm(e, t, r) {
      if ((r & 4194048) !== 0) {
        var o = t.lanes;
        o &= e.pendingLanes, r |= o, t.lanes = r, Zo(e, r);
      }
    }
    var Ja = {
      readContext: Tt,
      use: Ci,
      useCallback: ft,
      useContext: ft,
      useEffect: ft,
      useImperativeHandle: ft,
      useLayoutEffect: ft,
      useInsertionEffect: ft,
      useMemo: ft,
      useReducer: ft,
      useRef: ft,
      useState: ft,
      useDebugValue: ft,
      useDeferredValue: ft,
      useTransition: ft,
      useSyncExternalStore: ft,
      useId: ft,
      useHostTransitionStatus: ft,
      useFormState: ft,
      useActionState: ft,
      useOptimistic: ft,
      useMemoCache: ft,
      useCacheRefresh: ft
    };
    Ja.useEffectEvent = ft;
    var Am = {
      readContext: Tt,
      use: Ci,
      useCallback: function(e, t) {
        return Xt().memoizedState = [
          e,
          t === void 0 ? null : t
        ], e;
      },
      useContext: Tt,
      useEffect: mm,
      useImperativeHandle: function(e, t, r) {
        r = r != null ? r.concat([
          e
        ]) : null, _i(4194308, 4, bm.bind(null, t, e), r);
      },
      useLayoutEffect: function(e, t) {
        return _i(4194308, 4, e, t);
      },
      useInsertionEffect: function(e, t) {
        _i(4, 2, e, t);
      },
      useMemo: function(e, t) {
        var r = Xt();
        t = t === void 0 ? null : t;
        var o = e();
        if (vr) {
          zn(true);
          try {
            e();
          } finally {
            zn(false);
          }
        }
        return r.memoizedState = [
          o,
          t
        ], o;
      },
      useReducer: function(e, t, r) {
        var o = Xt();
        if (r !== void 0) {
          var u = r(t);
          if (vr) {
            zn(true);
            try {
              r(t);
            } finally {
              zn(false);
            }
          }
        } else u = t;
        return o.memoizedState = o.baseState = u, e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: u
        }, o.queue = e, e = e.dispatch = ex.bind(null, Le, e), [
          o.memoizedState,
          e
        ];
      },
      useRef: function(e) {
        var t = Xt();
        return e = {
          current: e
        }, t.memoizedState = e;
      },
      useState: function(e) {
        e = $c(e);
        var t = e.queue, r = jm.bind(null, Le, t);
        return t.dispatch = r, [
          e.memoizedState,
          r
        ];
      },
      useDebugValue: Zc,
      useDeferredValue: function(e, t) {
        var r = Xt();
        return Kc(r, e, t);
      },
      useTransition: function() {
        var e = $c(false);
        return e = Cm.bind(null, Le, e.queue, true, false), Xt().memoizedState = e, [
          false,
          e
        ];
      },
      useSyncExternalStore: function(e, t, r) {
        var o = Le, u = Xt();
        if (Be) {
          if (r === void 0) throw Error(i(407));
          r = r();
        } else {
          if (r = t(), rt === null) throw Error(i(349));
          (Ye & 127) !== 0 || Wh(o, t, r);
        }
        u.memoizedState = r;
        var d = {
          value: r,
          getSnapshot: t
        };
        return u.queue = d, mm(em.bind(null, o, d, e), [
          e
        ]), o.flags |= 2048, ta(9, {
          destroy: void 0
        }, Jh.bind(null, o, d, r, t), null), r;
      },
      useId: function() {
        var e = Xt(), t = rt.identifierPrefix;
        if (Be) {
          var r = Bn, o = Un;
          r = (o & ~(1 << 32 - Bt(o) - 1)).toString(32) + r, t = "_" + t + "R_" + r, r = Si++, 0 < r && (t += "H" + r.toString(32)), t += "_";
        } else r = Z0++, t = "_" + t + "r_" + r.toString(32) + "_";
        return e.memoizedState = t;
      },
      useHostTransitionStatus: Qc,
      useFormState: cm,
      useActionState: cm,
      useOptimistic: function(e) {
        var t = Xt();
        t.memoizedState = t.baseState = e;
        var r = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        return t.queue = r, t = Fc.bind(null, Le, true, r), r.dispatch = t, [
          e,
          t
        ];
      },
      useMemoCache: Bc,
      useCacheRefresh: function() {
        return Xt().memoizedState = J0.bind(null, Le);
      },
      useEffectEvent: function(e) {
        var t = Xt(), r = {
          impl: e
        };
        return t.memoizedState = r, function() {
          if ((Ge & 2) !== 0) throw Error(i(440));
          return r.impl.apply(void 0, arguments);
        };
      }
    }, Wc = {
      readContext: Tt,
      use: Ci,
      useCallback: xm,
      useContext: Tt,
      useEffect: Gc,
      useImperativeHandle: vm,
      useInsertionEffect: gm,
      useLayoutEffect: ym,
      useMemo: Sm,
      useReducer: Ei,
      useRef: hm,
      useState: function() {
        return Ei(al);
      },
      useDebugValue: Zc,
      useDeferredValue: function(e, t) {
        var r = bt();
        return wm(r, et.memoizedState, e, t);
      },
      useTransition: function() {
        var e = Ei(al)[0], t = bt().memoizedState;
        return [
          typeof e == "boolean" ? e : Fa(e),
          t
        ];
      },
      useSyncExternalStore: Fh,
      useId: Mm,
      useHostTransitionStatus: Qc,
      useFormState: um,
      useActionState: um,
      useOptimistic: function(e, t) {
        var r = bt();
        return lm(r, et, e, t);
      },
      useMemoCache: Bc,
      useCacheRefresh: km
    };
    Wc.useEffectEvent = pm;
    var Tm = {
      readContext: Tt,
      use: Ci,
      useCallback: xm,
      useContext: Tt,
      useEffect: Gc,
      useImperativeHandle: vm,
      useInsertionEffect: gm,
      useLayoutEffect: ym,
      useMemo: Sm,
      useReducer: Vc,
      useRef: hm,
      useState: function() {
        return Vc(al);
      },
      useDebugValue: Zc,
      useDeferredValue: function(e, t) {
        var r = bt();
        return et === null ? Kc(r, e, t) : wm(r, et.memoizedState, e, t);
      },
      useTransition: function() {
        var e = Vc(al)[0], t = bt().memoizedState;
        return [
          typeof e == "boolean" ? e : Fa(e),
          t
        ];
      },
      useSyncExternalStore: Fh,
      useId: Mm,
      useHostTransitionStatus: Qc,
      useFormState: fm,
      useActionState: fm,
      useOptimistic: function(e, t) {
        var r = bt();
        return et !== null ? lm(r, et, e, t) : (r.baseState = e, [
          e,
          r.queue.dispatch
        ]);
      },
      useMemoCache: Bc,
      useCacheRefresh: km
    };
    Tm.useEffectEvent = pm;
    function Jc(e, t, r, o) {
      t = e.memoizedState, r = r(o, t), r = r == null ? t : y({}, t, r), e.memoizedState = r, e.lanes === 0 && (e.updateQueue.baseState = r);
    }
    var eu = {
      enqueueSetState: function(e, t, r) {
        e = e._reactInternals;
        var o = cn(), u = Ll(o);
        u.payload = t, r != null && (u.callback = r), t = Al(e, u, o), t !== null && (Wt(t, e, o), Za(t, e, o));
      },
      enqueueReplaceState: function(e, t, r) {
        e = e._reactInternals;
        var o = cn(), u = Ll(o);
        u.tag = 1, u.payload = t, r != null && (u.callback = r), t = Al(e, u, o), t !== null && (Wt(t, e, o), Za(t, e, o));
      },
      enqueueForceUpdate: function(e, t) {
        e = e._reactInternals;
        var r = cn(), o = Ll(r);
        o.tag = 2, t != null && (o.callback = t), t = Al(e, o, r), t !== null && (Wt(t, e, r), Za(t, e, r));
      }
    };
    function Nm(e, t, r, o, u, d, x) {
      return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(o, d, x) : t.prototype && t.prototype.isPureReactComponent ? !Ya(r, o) || !Ya(u, d) : true;
    }
    function Om(e, t, r, o) {
      e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, o), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, o), t.state !== e && eu.enqueueReplaceState(t, t.state, null);
    }
    function xr(e, t) {
      var r = t;
      if ("ref" in t) {
        r = {};
        for (var o in t) o !== "ref" && (r[o] = t[o]);
      }
      if (e = e.defaultProps) {
        r === t && (r = y({}, r));
        for (var u in e) r[u] === void 0 && (r[u] = e[u]);
      }
      return r;
    }
    function Dm(e) {
      ai(e);
    }
    function zm(e) {
      console.error(e);
    }
    function Im(e) {
      ai(e);
    }
    function ji(e, t) {
      try {
        var r = e.onUncaughtError;
        r(t.value, {
          componentStack: t.stack
        });
      } catch (o) {
        setTimeout(function() {
          throw o;
        });
      }
    }
    function Hm(e, t, r) {
      try {
        var o = e.onCaughtError;
        o(r.value, {
          componentStack: r.stack,
          errorBoundary: t.tag === 1 ? t.stateNode : null
        });
      } catch (u) {
        setTimeout(function() {
          throw u;
        });
      }
    }
    function tu(e, t, r) {
      return r = Ll(r), r.tag = 3, r.payload = {
        element: null
      }, r.callback = function() {
        ji(e, t);
      }, r;
    }
    function Ym(e) {
      return e = Ll(e), e.tag = 3, e;
    }
    function Um(e, t, r, o) {
      var u = r.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var d = o.value;
        e.payload = function() {
          return u(d);
        }, e.callback = function() {
          Hm(t, r, o);
        };
      }
      var x = r.stateNode;
      x !== null && typeof x.componentDidCatch == "function" && (e.callback = function() {
        Hm(t, r, o), typeof u != "function" && (Il === null ? Il = /* @__PURE__ */ new Set([
          this
        ]) : Il.add(this));
        var M = o.stack;
        this.componentDidCatch(o.value, {
          componentStack: M !== null ? M : ""
        });
      });
    }
    function tx(e, t, r, o, u) {
      if (r.flags |= 32768, o !== null && typeof o == "object" && typeof o.then == "function") {
        if (t = r.alternate, t !== null && Zr(t, r, u, true), r = rn.current, r !== null) {
          switch (r.tag) {
            case 31:
            case 13:
              return xn === null ? Ui() : r.alternate === null && ht === 0 && (ht = 3), r.flags &= -257, r.flags |= 65536, r.lanes = u, o === pi ? r.flags |= 16384 : (t = r.updateQueue, t === null ? r.updateQueue = /* @__PURE__ */ new Set([
                o
              ]) : t.add(o), Mu(e, o, u)), false;
            case 22:
              return r.flags |= 65536, o === pi ? r.flags |= 16384 : (t = r.updateQueue, t === null ? (t = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([
                  o
                ])
              }, r.updateQueue = t) : (r = t.retryQueue, r === null ? t.retryQueue = /* @__PURE__ */ new Set([
                o
              ]) : r.add(o)), Mu(e, o, u)), false;
          }
          throw Error(i(435, r.tag));
        }
        return Mu(e, o, u), Ui(), false;
      }
      if (Be) return t = rn.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, o !== xc && (e = Error(i(422), {
        cause: o
      }), Xa(gn(e, r)))) : (o !== xc && (t = Error(i(423), {
        cause: o
      }), Xa(gn(t, r))), e = e.current.alternate, e.flags |= 65536, u &= -u, e.lanes |= u, o = gn(o, r), u = tu(e.stateNode, o, u), Ac(e, u), ht !== 4 && (ht = 2)), false;
      var d = Error(i(520), {
        cause: o
      });
      if (d = gn(d, r), io === null ? io = [
        d
      ] : io.push(d), ht !== 4 && (ht = 2), t === null) return true;
      o = gn(o, r), r = t;
      do {
        switch (r.tag) {
          case 3:
            return r.flags |= 65536, e = u & -u, r.lanes |= e, e = tu(r.stateNode, o, e), Ac(r, e), false;
          case 1:
            if (t = r.type, d = r.stateNode, (r.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || d !== null && typeof d.componentDidCatch == "function" && (Il === null || !Il.has(d)))) return r.flags |= 65536, u &= -u, r.lanes |= u, u = Ym(u), Um(u, e, r, o), Ac(r, u), false;
        }
        r = r.return;
      } while (r !== null);
      return false;
    }
    var nu = Error(i(461)), St = false;
    function Nt(e, t, r, o) {
      t.child = e === null ? $h(t, null, r, o) : br(t, e.child, r, o);
    }
    function Bm(e, t, r, o, u) {
      r = r.render;
      var d = t.ref;
      if ("ref" in o) {
        var x = {};
        for (var M in o) M !== "ref" && (x[M] = o[M]);
      } else x = o;
      return mr(t), o = Ic(e, t, r, x, d, u), M = Hc(), e !== null && !St ? (Yc(e, t, u), ol(e, t, u)) : (Be && M && bc(t), t.flags |= 1, Nt(e, t, o, u), t.child);
    }
    function Xm(e, t, r, o, u) {
      if (e === null) {
        var d = r.type;
        return typeof d == "function" && !pc(d) && d.defaultProps === void 0 && r.compare === null ? (t.tag = 15, t.type = d, Vm(e, t, d, o, u)) : (e = ci(r.type, null, o, t, t.mode, u), e.ref = t.ref, e.return = t, t.child = e);
      }
      if (d = e.child, !uu(e, u)) {
        var x = d.memoizedProps;
        if (r = r.compare, r = r !== null ? r : Ya, r(x, o) && e.ref === t.ref) return ol(e, t, u);
      }
      return t.flags |= 1, e = el(d, o), e.ref = t.ref, e.return = t, t.child = e;
    }
    function Vm(e, t, r, o, u) {
      if (e !== null) {
        var d = e.memoizedProps;
        if (Ya(d, o) && e.ref === t.ref) if (St = false, t.pendingProps = o = d, uu(e, u)) (e.flags & 131072) !== 0 && (St = true);
        else return t.lanes = e.lanes, ol(e, t, u);
      }
      return lu(e, t, r, o, u);
    }
    function $m(e, t, r, o) {
      var u = o.children, d = e !== null ? e.memoizedState : null;
      if (e === null && t.stateNode === null && (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), o.mode === "hidden") {
        if ((t.flags & 128) !== 0) {
          if (d = d !== null ? d.baseLanes | r : r, e !== null) {
            for (o = t.child = e.child, u = 0; o !== null; ) u = u | o.lanes | o.childLanes, o = o.sibling;
            o = u & ~d;
          } else o = 0, t.child = null;
          return qm(e, t, d, r, o);
        }
        if ((r & 536870912) !== 0) t.memoizedState = {
          baseLanes: 0,
          cachePool: null
        }, e !== null && hi(t, d !== null ? d.cachePool : null), d !== null ? Zh(t, d) : Nc(), Kh(t);
        else return o = t.lanes = 536870912, qm(e, t, d !== null ? d.baseLanes | r : r, r, o);
      } else d !== null ? (hi(t, d.cachePool), Zh(t, d), Nl(), t.memoizedState = null) : (e !== null && hi(t, null), Nc(), Nl());
      return Nt(e, t, u, r), t.child;
    }
    function eo(e, t) {
      return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), t.sibling;
    }
    function qm(e, t, r, o, u) {
      var d = kc();
      return d = d === null ? null : {
        parent: vt._currentValue,
        pool: d
      }, t.memoizedState = {
        baseLanes: r,
        cachePool: d
      }, e !== null && hi(t, null), Nc(), Kh(t), e !== null && Zr(e, t, o, true), t.childLanes = u, null;
    }
    function Ri(e, t) {
      return t = Ai({
        mode: t.mode,
        children: t.children
      }, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
    }
    function Gm(e, t, r) {
      return br(t, e.child, null, r), e = Ri(t, t.pendingProps), e.flags |= 2, an(t), t.memoizedState = null, e;
    }
    function nx(e, t, r) {
      var o = t.pendingProps, u = (t.flags & 128) !== 0;
      if (t.flags &= -129, e === null) {
        if (Be) {
          if (o.mode === "hidden") return e = Ri(t, o), t.lanes = 536870912, eo(null, e);
          if (Dc(t), (e = it) ? (e = rg(e, vn), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: _l !== null ? {
              id: Un,
              overflow: Bn
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, r = Rh(e), r.return = t, t.child = r, At = t, it = null)) : e = null, e === null) throw kl(t);
          return t.lanes = 536870912, null;
        }
        return Ri(t, o);
      }
      var d = e.memoizedState;
      if (d !== null) {
        var x = d.dehydrated;
        if (Dc(t), u) if (t.flags & 256) t.flags &= -257, t = Gm(e, t, r);
        else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
        else throw Error(i(558));
        else if (St || Zr(e, t, r, false), u = (r & e.childLanes) !== 0, St || u) {
          if (o = rt, o !== null && (x = Ko(o, r), x !== 0 && x !== d.retryLane)) throw d.retryLane = x, ur(e, x), Wt(o, e, x), nu;
          Ui(), t = Gm(e, t, r);
        } else e = d.treeContext, it = Sn(x.nextSibling), At = t, Be = true, Ml = null, vn = false, e !== null && Th(t, e), t = Ri(t, o), t.flags |= 4096;
        return t;
      }
      return e = el(e.child, {
        mode: o.mode,
        children: o.children
      }), e.ref = t.ref, t.child = e, e.return = t, e;
    }
    function Li(e, t) {
      var r = t.ref;
      if (r === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof r != "function" && typeof r != "object") throw Error(i(284));
        (e === null || e.ref !== r) && (t.flags |= 4194816);
      }
    }
    function lu(e, t, r, o, u) {
      return mr(t), r = Ic(e, t, r, o, void 0, u), o = Hc(), e !== null && !St ? (Yc(e, t, u), ol(e, t, u)) : (Be && o && bc(t), t.flags |= 1, Nt(e, t, r, u), t.child);
    }
    function Zm(e, t, r, o, u, d) {
      return mr(t), t.updateQueue = null, r = Qh(t, o, r, u), Ph(e), o = Hc(), e !== null && !St ? (Yc(e, t, d), ol(e, t, d)) : (Be && o && bc(t), t.flags |= 1, Nt(e, t, r, d), t.child);
    }
    function Km(e, t, r, o, u) {
      if (mr(t), t.stateNode === null) {
        var d = Vr, x = r.contextType;
        typeof x == "object" && x !== null && (d = Tt(x)), d = new r(o, d), t.memoizedState = d.state !== null && d.state !== void 0 ? d.state : null, d.updater = eu, t.stateNode = d, d._reactInternals = t, d = t.stateNode, d.props = o, d.state = t.memoizedState, d.refs = {}, Rc(t), x = r.contextType, d.context = typeof x == "object" && x !== null ? Tt(x) : Vr, d.state = t.memoizedState, x = r.getDerivedStateFromProps, typeof x == "function" && (Jc(t, r, x, o), d.state = t.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof d.getSnapshotBeforeUpdate == "function" || typeof d.UNSAFE_componentWillMount != "function" && typeof d.componentWillMount != "function" || (x = d.state, typeof d.componentWillMount == "function" && d.componentWillMount(), typeof d.UNSAFE_componentWillMount == "function" && d.UNSAFE_componentWillMount(), x !== d.state && eu.enqueueReplaceState(d, d.state, null), Pa(t, o, d, u), Ka(), d.state = t.memoizedState), typeof d.componentDidMount == "function" && (t.flags |= 4194308), o = true;
      } else if (e === null) {
        d = t.stateNode;
        var M = t.memoizedProps, I = xr(r, M);
        d.props = I;
        var Z = d.context, ee = r.contextType;
        x = Vr, typeof ee == "object" && ee !== null && (x = Tt(ee));
        var re = r.getDerivedStateFromProps;
        ee = typeof re == "function" || typeof d.getSnapshotBeforeUpdate == "function", M = t.pendingProps !== M, ee || typeof d.UNSAFE_componentWillReceiveProps != "function" && typeof d.componentWillReceiveProps != "function" || (M || Z !== x) && Om(t, d, o, x), Rl = false;
        var K = t.memoizedState;
        d.state = K, Pa(t, o, d, u), Ka(), Z = t.memoizedState, M || K !== Z || Rl ? (typeof re == "function" && (Jc(t, r, re, o), Z = t.memoizedState), (I = Rl || Nm(t, r, I, o, K, Z, x)) ? (ee || typeof d.UNSAFE_componentWillMount != "function" && typeof d.componentWillMount != "function" || (typeof d.componentWillMount == "function" && d.componentWillMount(), typeof d.UNSAFE_componentWillMount == "function" && d.UNSAFE_componentWillMount()), typeof d.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof d.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = o, t.memoizedState = Z), d.props = o, d.state = Z, d.context = x, o = I) : (typeof d.componentDidMount == "function" && (t.flags |= 4194308), o = false);
      } else {
        d = t.stateNode, Lc(e, t), x = t.memoizedProps, ee = xr(r, x), d.props = ee, re = t.pendingProps, K = d.context, Z = r.contextType, I = Vr, typeof Z == "object" && Z !== null && (I = Tt(Z)), M = r.getDerivedStateFromProps, (Z = typeof M == "function" || typeof d.getSnapshotBeforeUpdate == "function") || typeof d.UNSAFE_componentWillReceiveProps != "function" && typeof d.componentWillReceiveProps != "function" || (x !== re || K !== I) && Om(t, d, o, I), Rl = false, K = t.memoizedState, d.state = K, Pa(t, o, d, u), Ka();
        var F = t.memoizedState;
        x !== re || K !== F || Rl || e !== null && e.dependencies !== null && di(e.dependencies) ? (typeof M == "function" && (Jc(t, r, M, o), F = t.memoizedState), (ee = Rl || Nm(t, r, ee, o, K, F, I) || e !== null && e.dependencies !== null && di(e.dependencies)) ? (Z || typeof d.UNSAFE_componentWillUpdate != "function" && typeof d.componentWillUpdate != "function" || (typeof d.componentWillUpdate == "function" && d.componentWillUpdate(o, F, I), typeof d.UNSAFE_componentWillUpdate == "function" && d.UNSAFE_componentWillUpdate(o, F, I)), typeof d.componentDidUpdate == "function" && (t.flags |= 4), typeof d.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof d.componentDidUpdate != "function" || x === e.memoizedProps && K === e.memoizedState || (t.flags |= 4), typeof d.getSnapshotBeforeUpdate != "function" || x === e.memoizedProps && K === e.memoizedState || (t.flags |= 1024), t.memoizedProps = o, t.memoizedState = F), d.props = o, d.state = F, d.context = I, o = ee) : (typeof d.componentDidUpdate != "function" || x === e.memoizedProps && K === e.memoizedState || (t.flags |= 4), typeof d.getSnapshotBeforeUpdate != "function" || x === e.memoizedProps && K === e.memoizedState || (t.flags |= 1024), o = false);
      }
      return d = o, Li(e, t), o = (t.flags & 128) !== 0, d || o ? (d = t.stateNode, r = o && typeof r.getDerivedStateFromError != "function" ? null : d.render(), t.flags |= 1, e !== null && o ? (t.child = br(t, e.child, null, u), t.child = br(t, null, r, u)) : Nt(e, t, r, u), t.memoizedState = d.state, e = t.child) : e = ol(e, t, u), e;
    }
    function Pm(e, t, r, o) {
      return fr(), t.flags |= 256, Nt(e, t, r, o), t.child;
    }
    var ru = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    };
    function au(e) {
      return {
        baseLanes: e,
        cachePool: Hh()
      };
    }
    function ou(e, t, r) {
      return e = e !== null ? e.childLanes & ~r : 0, t && (e |= sn), e;
    }
    function Qm(e, t, r) {
      var o = t.pendingProps, u = false, d = (t.flags & 128) !== 0, x;
      if ((x = d) || (x = e !== null && e.memoizedState === null ? false : (yt.current & 2) !== 0), x && (u = true, t.flags &= -129), x = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
        if (Be) {
          if (u ? Tl(t) : Nl(), (e = it) ? (e = rg(e, vn), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: _l !== null ? {
              id: Un,
              overflow: Bn
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, r = Rh(e), r.return = t, t.child = r, At = t, it = null)) : e = null, e === null) throw kl(t);
          return Xu(e) ? t.lanes = 32 : t.lanes = 536870912, null;
        }
        var M = o.children;
        return o = o.fallback, u ? (Nl(), u = t.mode, M = Ai({
          mode: "hidden",
          children: M
        }, u), o = dr(o, u, r, null), M.return = t, o.return = t, M.sibling = o, t.child = M, o = t.child, o.memoizedState = au(r), o.childLanes = ou(e, x, r), t.memoizedState = ru, eo(null, o)) : (Tl(t), iu(t, M));
      }
      var I = e.memoizedState;
      if (I !== null && (M = I.dehydrated, M !== null)) {
        if (d) t.flags & 256 ? (Tl(t), t.flags &= -257, t = su(e, t, r)) : t.memoizedState !== null ? (Nl(), t.child = e.child, t.flags |= 128, t = null) : (Nl(), M = o.fallback, u = t.mode, o = Ai({
          mode: "visible",
          children: o.children
        }, u), M = dr(M, u, r, null), M.flags |= 2, o.return = t, M.return = t, o.sibling = M, t.child = o, br(t, e.child, null, r), o = t.child, o.memoizedState = au(r), o.childLanes = ou(e, x, r), t.memoizedState = ru, t = eo(null, o));
        else if (Tl(t), Xu(M)) {
          if (x = M.nextSibling && M.nextSibling.dataset, x) var Z = x.dgst;
          x = Z, o = Error(i(419)), o.stack = "", o.digest = x, Xa({
            value: o,
            source: null,
            stack: null
          }), t = su(e, t, r);
        } else if (St || Zr(e, t, r, false), x = (r & e.childLanes) !== 0, St || x) {
          if (x = rt, x !== null && (o = Ko(x, r), o !== 0 && o !== I.retryLane)) throw I.retryLane = o, ur(e, o), Wt(x, e, o), nu;
          Bu(M) || Ui(), t = su(e, t, r);
        } else Bu(M) ? (t.flags |= 192, t.child = e.child, t = null) : (e = I.treeContext, it = Sn(M.nextSibling), At = t, Be = true, Ml = null, vn = false, e !== null && Th(t, e), t = iu(t, o.children), t.flags |= 4096);
        return t;
      }
      return u ? (Nl(), M = o.fallback, u = t.mode, I = e.child, Z = I.sibling, o = el(I, {
        mode: "hidden",
        children: o.children
      }), o.subtreeFlags = I.subtreeFlags & 65011712, Z !== null ? M = el(Z, M) : (M = dr(M, u, r, null), M.flags |= 2), M.return = t, o.return = t, o.sibling = M, t.child = o, eo(null, o), o = t.child, M = e.child.memoizedState, M === null ? M = au(r) : (u = M.cachePool, u !== null ? (I = vt._currentValue, u = u.parent !== I ? {
        parent: I,
        pool: I
      } : u) : u = Hh(), M = {
        baseLanes: M.baseLanes | r,
        cachePool: u
      }), o.memoizedState = M, o.childLanes = ou(e, x, r), t.memoizedState = ru, eo(e.child, o)) : (Tl(t), r = e.child, e = r.sibling, r = el(r, {
        mode: "visible",
        children: o.children
      }), r.return = t, r.sibling = null, e !== null && (x = t.deletions, x === null ? (t.deletions = [
        e
      ], t.flags |= 16) : x.push(e)), t.child = r, t.memoizedState = null, r);
    }
    function iu(e, t) {
      return t = Ai({
        mode: "visible",
        children: t
      }, e.mode), t.return = e, e.child = t;
    }
    function Ai(e, t) {
      return e = ln(22, e, null, t), e.lanes = 0, e;
    }
    function su(e, t, r) {
      return br(t, e.child, null, r), e = iu(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
    }
    function Fm(e, t, r) {
      e.lanes |= t;
      var o = e.alternate;
      o !== null && (o.lanes |= t), Cc(e.return, t, r);
    }
    function cu(e, t, r, o, u, d) {
      var x = e.memoizedState;
      x === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: o,
        tail: r,
        tailMode: u,
        treeForkCount: d
      } : (x.isBackwards = t, x.rendering = null, x.renderingStartTime = 0, x.last = o, x.tail = r, x.tailMode = u, x.treeForkCount = d);
    }
    function Wm(e, t, r) {
      var o = t.pendingProps, u = o.revealOrder, d = o.tail;
      o = o.children;
      var x = yt.current, M = (x & 2) !== 0;
      if (M ? (x = x & 1 | 2, t.flags |= 128) : x &= 1, z(yt, x), Nt(e, t, o, r), o = Be ? Ba : 0, !M && e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Fm(e, r, t);
        else if (e.tag === 19) Fm(e, r, t);
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
          for (r = t.child, u = null; r !== null; ) e = r.alternate, e !== null && vi(e) === null && (u = r), r = r.sibling;
          r = u, r === null ? (u = t.child, t.child = null) : (u = r.sibling, r.sibling = null), cu(t, false, u, r, d, o);
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (r = null, u = t.child, t.child = null; u !== null; ) {
            if (e = u.alternate, e !== null && vi(e) === null) {
              t.child = u;
              break;
            }
            e = u.sibling, u.sibling = r, r = u, u = e;
          }
          cu(t, true, r, null, d, o);
          break;
        case "together":
          cu(t, false, null, null, void 0, o);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function ol(e, t, r) {
      if (e !== null && (t.dependencies = e.dependencies), zl |= t.lanes, (r & t.childLanes) === 0) if (e !== null) {
        if (Zr(e, t, r, false), (r & t.childLanes) === 0) return null;
      } else return null;
      if (e !== null && t.child !== e.child) throw Error(i(153));
      if (t.child !== null) {
        for (e = t.child, r = el(e, e.pendingProps), t.child = r, r.return = t; e.sibling !== null; ) e = e.sibling, r = r.sibling = el(e, e.pendingProps), r.return = t;
        r.sibling = null;
      }
      return t.child;
    }
    function uu(e, t) {
      return (e.lanes & t) !== 0 ? true : (e = e.dependencies, !!(e !== null && di(e)));
    }
    function lx(e, t, r) {
      switch (t.tag) {
        case 3:
          de(t, t.stateNode.containerInfo), jl(t, vt, e.memoizedState.cache), fr();
          break;
        case 27:
        case 5:
          Me(t);
          break;
        case 4:
          de(t, t.stateNode.containerInfo);
          break;
        case 10:
          jl(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return t.flags |= 128, Dc(t), null;
          break;
        case 13:
          var o = t.memoizedState;
          if (o !== null) return o.dehydrated !== null ? (Tl(t), t.flags |= 128, null) : (r & t.child.childLanes) !== 0 ? Qm(e, t, r) : (Tl(t), e = ol(e, t, r), e !== null ? e.sibling : null);
          Tl(t);
          break;
        case 19:
          var u = (e.flags & 128) !== 0;
          if (o = (r & t.childLanes) !== 0, o || (Zr(e, t, r, false), o = (r & t.childLanes) !== 0), u) {
            if (o) return Wm(e, t, r);
            t.flags |= 128;
          }
          if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), z(yt, yt.current), o) break;
          return null;
        case 22:
          return t.lanes = 0, $m(e, t, r, t.pendingProps);
        case 24:
          jl(t, vt, e.memoizedState.cache);
      }
      return ol(e, t, r);
    }
    function Jm(e, t, r) {
      if (e !== null) if (e.memoizedProps !== t.pendingProps) St = true;
      else {
        if (!uu(e, r) && (t.flags & 128) === 0) return St = false, lx(e, t, r);
        St = (e.flags & 131072) !== 0;
      }
      else St = false, Be && (t.flags & 1048576) !== 0 && Ah(t, Ba, t.index);
      switch (t.lanes = 0, t.tag) {
        case 16:
          e: {
            var o = t.pendingProps;
            if (e = gr(t.elementType), t.type = e, typeof e == "function") pc(e) ? (o = xr(e, o), t.tag = 1, t = Km(null, t, e, o, r)) : (t.tag = 0, t = lu(null, t, e, o, r));
            else {
              if (e != null) {
                var u = e.$$typeof;
                if (u === T) {
                  t.tag = 11, t = Bm(null, t, e, o, r);
                  break e;
                } else if (u === L) {
                  t.tag = 14, t = Xm(null, t, e, o, r);
                  break e;
                }
              }
              throw t = ie(e) || e, Error(i(306, t, ""));
            }
          }
          return t;
        case 0:
          return lu(e, t, t.type, t.pendingProps, r);
        case 1:
          return o = t.type, u = xr(o, t.pendingProps), Km(e, t, o, u, r);
        case 3:
          e: {
            if (de(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
            o = t.pendingProps;
            var d = t.memoizedState;
            u = d.element, Lc(e, t), Pa(t, o, null, r);
            var x = t.memoizedState;
            if (o = x.cache, jl(t, vt, o), o !== d.cache && Ec(t, [
              vt
            ], r, true), Ka(), o = x.element, d.isDehydrated) if (d = {
              element: o,
              isDehydrated: false,
              cache: x.cache
            }, t.updateQueue.baseState = d, t.memoizedState = d, t.flags & 256) {
              t = Pm(e, t, o, r);
              break e;
            } else if (o !== u) {
              u = gn(Error(i(424)), t), Xa(u), t = Pm(e, t, o, r);
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (it = Sn(e.firstChild), At = t, Be = true, Ml = null, vn = true, r = $h(t, null, o, r), t.child = r; r; ) r.flags = r.flags & -3 | 4096, r = r.sibling;
            }
            else {
              if (fr(), o === u) {
                t = ol(e, t, r);
                break e;
              }
              Nt(e, t, o, r);
            }
            t = t.child;
          }
          return t;
        case 26:
          return Li(e, t), e === null ? (r = ug(t.type, null, t.pendingProps, null)) ? t.memoizedState = r : Be || (r = t.type, e = t.pendingProps, o = Zi(Q.current).createElement(r), o[Et] = t, o[le] = e, Ot(o, r, e), Je(o), t.stateNode = o) : t.memoizedState = ug(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
        case 27:
          return Me(t), e === null && Be && (o = t.stateNode = ig(t.type, t.pendingProps, Q.current), At = t, vn = true, u = it, Bl(t.type) ? (Vu = u, it = Sn(o.firstChild)) : it = u), Nt(e, t, t.pendingProps.children, r), Li(e, t), e === null && (t.flags |= 4194304), t.child;
        case 5:
          return e === null && Be && ((u = o = it) && (o = Nx(o, t.type, t.pendingProps, vn), o !== null ? (t.stateNode = o, At = t, it = Sn(o.firstChild), vn = false, u = true) : u = false), u || kl(t)), Me(t), u = t.type, d = t.pendingProps, x = e !== null ? e.memoizedProps : null, o = d.children, Hu(u, d) ? o = null : x !== null && Hu(u, x) && (t.flags |= 32), t.memoizedState !== null && (u = Ic(e, t, K0, null, null, r), go._currentValue = u), Li(e, t), Nt(e, t, o, r), t.child;
        case 6:
          return e === null && Be && ((e = r = it) && (r = Ox(r, t.pendingProps, vn), r !== null ? (t.stateNode = r, At = t, it = null, e = true) : e = false), e || kl(t)), null;
        case 13:
          return Qm(e, t, r);
        case 4:
          return de(t, t.stateNode.containerInfo), o = t.pendingProps, e === null ? t.child = br(t, null, o, r) : Nt(e, t, o, r), t.child;
        case 11:
          return Bm(e, t, t.type, t.pendingProps, r);
        case 7:
          return Nt(e, t, t.pendingProps, r), t.child;
        case 8:
          return Nt(e, t, t.pendingProps.children, r), t.child;
        case 12:
          return Nt(e, t, t.pendingProps.children, r), t.child;
        case 10:
          return o = t.pendingProps, jl(t, t.type, o.value), Nt(e, t, o.children, r), t.child;
        case 9:
          return u = t.type._context, o = t.pendingProps.children, mr(t), u = Tt(u), o = o(u), t.flags |= 1, Nt(e, t, o, r), t.child;
        case 14:
          return Xm(e, t, t.type, t.pendingProps, r);
        case 15:
          return Vm(e, t, t.type, t.pendingProps, r);
        case 19:
          return Wm(e, t, r);
        case 31:
          return nx(e, t, r);
        case 22:
          return $m(e, t, r, t.pendingProps);
        case 24:
          return mr(t), o = Tt(vt), e === null ? (u = kc(), u === null && (u = rt, d = _c(), u.pooledCache = d, d.refCount++, d !== null && (u.pooledCacheLanes |= r), u = d), t.memoizedState = {
            parent: o,
            cache: u
          }, Rc(t), jl(t, vt, u)) : ((e.lanes & r) !== 0 && (Lc(e, t), Pa(t, null, null, r), Ka()), u = e.memoizedState, d = t.memoizedState, u.parent !== o ? (u = {
            parent: o,
            cache: o
          }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), jl(t, vt, o)) : (o = d.cache, jl(t, vt, o), o !== u.cache && Ec(t, [
            vt
          ], r, true))), Nt(e, t, t.pendingProps.children, r), t.child;
        case 29:
          throw t.pendingProps;
      }
      throw Error(i(156, t.tag));
    }
    function il(e) {
      e.flags |= 4;
    }
    function du(e, t, r, o, u) {
      if ((t = (e.mode & 32) !== 0) && (t = false), t) {
        if (e.flags |= 16777216, (u & 335544128) === u) if (e.stateNode.complete) e.flags |= 8192;
        else if (Mp()) e.flags |= 8192;
        else throw yr = pi, jc;
      } else e.flags &= -16777217;
    }
    function ep(e, t) {
      if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
      else if (e.flags |= 16777216, !pg(t)) if (Mp()) e.flags |= 8192;
      else throw yr = pi, jc;
    }
    function Ti(e, t) {
      t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Nr() : 536870912, e.lanes |= t, aa |= t);
    }
    function to(e, t) {
      if (!Be) switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var r = null; t !== null; ) t.alternate !== null && (r = t), t = t.sibling;
          r === null ? e.tail = null : r.sibling = null;
          break;
        case "collapsed":
          r = e.tail;
          for (var o = null; r !== null; ) r.alternate !== null && (o = r), r = r.sibling;
          o === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : o.sibling = null;
      }
    }
    function st(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, r = 0, o = 0;
      if (t) for (var u = e.child; u !== null; ) r |= u.lanes | u.childLanes, o |= u.subtreeFlags & 65011712, o |= u.flags & 65011712, u.return = e, u = u.sibling;
      else for (u = e.child; u !== null; ) r |= u.lanes | u.childLanes, o |= u.subtreeFlags, o |= u.flags, u.return = e, u = u.sibling;
      return e.subtreeFlags |= o, e.childLanes = r, t;
    }
    function rx(e, t, r) {
      var o = t.pendingProps;
      switch (vc(t), t.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return st(t), null;
        case 1:
          return st(t), null;
        case 3:
          return r = t.stateNode, o = null, e !== null && (o = e.memoizedState.cache), t.memoizedState.cache !== o && (t.flags |= 2048), ll(vt), oe(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (Gr(t) ? il(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Sc())), st(t), null;
        case 26:
          var u = t.type, d = t.memoizedState;
          return e === null ? (il(t), d !== null ? (st(t), ep(t, d)) : (st(t), du(t, u, null, o, r))) : d ? d !== e.memoizedState ? (il(t), st(t), ep(t, d)) : (st(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== o && il(t), st(t), du(t, u, e, o, r)), null;
        case 27:
          if (Xe(t), r = Q.current, u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== o && il(t);
          else {
            if (!o) {
              if (t.stateNode === null) throw Error(i(166));
              return st(t), null;
            }
            e = O.current, Gr(t) ? Nh(t) : (e = ig(u, o, r), t.stateNode = e, il(t));
          }
          return st(t), null;
        case 5:
          if (Xe(t), u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== o && il(t);
          else {
            if (!o) {
              if (t.stateNode === null) throw Error(i(166));
              return st(t), null;
            }
            if (d = O.current, Gr(t)) Nh(t);
            else {
              var x = Zi(Q.current);
              switch (d) {
                case 1:
                  d = x.createElementNS("http://www.w3.org/2000/svg", u);
                  break;
                case 2:
                  d = x.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                  break;
                default:
                  switch (u) {
                    case "svg":
                      d = x.createElementNS("http://www.w3.org/2000/svg", u);
                      break;
                    case "math":
                      d = x.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                      break;
                    case "script":
                      d = x.createElement("div"), d.innerHTML = "<script><\/script>", d = d.removeChild(d.firstChild);
                      break;
                    case "select":
                      d = typeof o.is == "string" ? x.createElement("select", {
                        is: o.is
                      }) : x.createElement("select"), o.multiple ? d.multiple = true : o.size && (d.size = o.size);
                      break;
                    default:
                      d = typeof o.is == "string" ? x.createElement(u, {
                        is: o.is
                      }) : x.createElement(u);
                  }
              }
              d[Et] = t, d[le] = o;
              e: for (x = t.child; x !== null; ) {
                if (x.tag === 5 || x.tag === 6) d.appendChild(x.stateNode);
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
              t.stateNode = d;
              e: switch (Ot(d, u, o), u) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = true;
                  break e;
                default:
                  o = false;
              }
              o && il(t);
            }
          }
          return st(t), du(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, r), null;
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== o && il(t);
          else {
            if (typeof o != "string" && t.stateNode === null) throw Error(i(166));
            if (e = Q.current, Gr(t)) {
              if (e = t.stateNode, r = t.memoizedProps, o = null, u = At, u !== null) switch (u.tag) {
                case 27:
                case 5:
                  o = u.memoizedProps;
              }
              e[Et] = t, e = !!(e.nodeValue === r || o !== null && o.suppressHydrationWarning === true || Qp(e.nodeValue, r)), e || kl(t, true);
            } else e = Zi(e).createTextNode(o), e[Et] = t, t.stateNode = e;
          }
          return st(t), null;
        case 31:
          if (r = t.memoizedState, e === null || e.memoizedState !== null) {
            if (o = Gr(t), r !== null) {
              if (e === null) {
                if (!o) throw Error(i(318));
                if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(i(557));
                e[Et] = t;
              } else fr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              st(t), e = false;
            } else r = Sc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = r), e = true;
            if (!e) return t.flags & 256 ? (an(t), t) : (an(t), null);
            if ((t.flags & 128) !== 0) throw Error(i(558));
          }
          return st(t), null;
        case 13:
          if (o = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            if (u = Gr(t), o !== null && o.dehydrated !== null) {
              if (e === null) {
                if (!u) throw Error(i(318));
                if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(i(317));
                u[Et] = t;
              } else fr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              st(t), u = false;
            } else u = Sc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = u), u = true;
            if (!u) return t.flags & 256 ? (an(t), t) : (an(t), null);
          }
          return an(t), (t.flags & 128) !== 0 ? (t.lanes = r, t) : (r = o !== null, e = e !== null && e.memoizedState !== null, r && (o = t.child, u = null, o.alternate !== null && o.alternate.memoizedState !== null && o.alternate.memoizedState.cachePool !== null && (u = o.alternate.memoizedState.cachePool.pool), d = null, o.memoizedState !== null && o.memoizedState.cachePool !== null && (d = o.memoizedState.cachePool.pool), d !== u && (o.flags |= 2048)), r !== e && r && (t.child.flags |= 8192), Ti(t, t.updateQueue), st(t), null);
        case 4:
          return oe(), e === null && Nu(t.stateNode.containerInfo), st(t), null;
        case 10:
          return ll(t.type), st(t), null;
        case 19:
          if (D(yt), o = t.memoizedState, o === null) return st(t), null;
          if (u = (t.flags & 128) !== 0, d = o.rendering, d === null) if (u) to(o, false);
          else {
            if (ht !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
              if (d = vi(e), d !== null) {
                for (t.flags |= 128, to(o, false), e = d.updateQueue, t.updateQueue = e, Ti(t, e), t.subtreeFlags = 0, e = r, r = t.child; r !== null; ) jh(r, e), r = r.sibling;
                return z(yt, yt.current & 1 | 2), Be && tl(t, o.treeForkCount), t.child;
              }
              e = e.sibling;
            }
            o.tail !== null && Ct() > Ii && (t.flags |= 128, u = true, to(o, false), t.lanes = 4194304);
          }
          else {
            if (!u) if (e = vi(d), e !== null) {
              if (t.flags |= 128, u = true, e = e.updateQueue, t.updateQueue = e, Ti(t, e), to(o, true), o.tail === null && o.tailMode === "hidden" && !d.alternate && !Be) return st(t), null;
            } else 2 * Ct() - o.renderingStartTime > Ii && r !== 536870912 && (t.flags |= 128, u = true, to(o, false), t.lanes = 4194304);
            o.isBackwards ? (d.sibling = t.child, t.child = d) : (e = o.last, e !== null ? e.sibling = d : t.child = d, o.last = d);
          }
          return o.tail !== null ? (e = o.tail, o.rendering = e, o.tail = e.sibling, o.renderingStartTime = Ct(), e.sibling = null, r = yt.current, z(yt, u ? r & 1 | 2 : r & 1), Be && tl(t, o.treeForkCount), e) : (st(t), null);
        case 22:
        case 23:
          return an(t), Oc(), o = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== o && (t.flags |= 8192) : o && (t.flags |= 8192), o ? (r & 536870912) !== 0 && (t.flags & 128) === 0 && (st(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : st(t), r = t.updateQueue, r !== null && Ti(t, r.retryQueue), r = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (r = e.memoizedState.cachePool.pool), o = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (o = t.memoizedState.cachePool.pool), o !== r && (t.flags |= 2048), e !== null && D(pr), null;
        case 24:
          return r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), ll(vt), st(t), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(i(156, t.tag));
    }
    function ax(e, t) {
      switch (vc(t), t.tag) {
        case 1:
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 3:
          return ll(vt), oe(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
        case 26:
        case 27:
        case 5:
          return Xe(t), null;
        case 31:
          if (t.memoizedState !== null) {
            if (an(t), t.alternate === null) throw Error(i(340));
            fr();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 13:
          if (an(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
            if (t.alternate === null) throw Error(i(340));
            fr();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 19:
          return D(yt), null;
        case 4:
          return oe(), null;
        case 10:
          return ll(t.type), null;
        case 22:
        case 23:
          return an(t), Oc(), e !== null && D(pr), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 24:
          return ll(vt), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function tp(e, t) {
      switch (vc(t), t.tag) {
        case 3:
          ll(vt), oe();
          break;
        case 26:
        case 27:
        case 5:
          Xe(t);
          break;
        case 4:
          oe();
          break;
        case 31:
          t.memoizedState !== null && an(t);
          break;
        case 13:
          an(t);
          break;
        case 19:
          D(yt);
          break;
        case 10:
          ll(t.type);
          break;
        case 22:
        case 23:
          an(t), Oc(), e !== null && D(pr);
          break;
        case 24:
          ll(vt);
      }
    }
    function no(e, t) {
      try {
        var r = t.updateQueue, o = r !== null ? r.lastEffect : null;
        if (o !== null) {
          var u = o.next;
          r = u;
          do {
            if ((r.tag & e) === e) {
              o = void 0;
              var d = r.create, x = r.inst;
              o = d(), x.destroy = o;
            }
            r = r.next;
          } while (r !== u);
        }
      } catch (M) {
        Fe(t, t.return, M);
      }
    }
    function Ol(e, t, r) {
      try {
        var o = t.updateQueue, u = o !== null ? o.lastEffect : null;
        if (u !== null) {
          var d = u.next;
          o = d;
          do {
            if ((o.tag & e) === e) {
              var x = o.inst, M = x.destroy;
              if (M !== void 0) {
                x.destroy = void 0, u = t;
                var I = r, Z = M;
                try {
                  Z();
                } catch (ee) {
                  Fe(u, I, ee);
                }
              }
            }
            o = o.next;
          } while (o !== d);
        }
      } catch (ee) {
        Fe(t, t.return, ee);
      }
    }
    function np(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var r = e.stateNode;
        try {
          Gh(t, r);
        } catch (o) {
          Fe(e, e.return, o);
        }
      }
    }
    function lp(e, t, r) {
      r.props = xr(e.type, e.memoizedProps), r.state = e.memoizedState;
      try {
        r.componentWillUnmount();
      } catch (o) {
        Fe(e, t, o);
      }
    }
    function lo(e, t) {
      try {
        var r = e.ref;
        if (r !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var o = e.stateNode;
              break;
            case 30:
              o = e.stateNode;
              break;
            default:
              o = e.stateNode;
          }
          typeof r == "function" ? e.refCleanup = r(o) : r.current = o;
        }
      } catch (u) {
        Fe(e, t, u);
      }
    }
    function Xn(e, t) {
      var r = e.ref, o = e.refCleanup;
      if (r !== null) if (typeof o == "function") try {
        o();
      } catch (u) {
        Fe(e, t, u);
      } finally {
        e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
      }
      else if (typeof r == "function") try {
        r(null);
      } catch (u) {
        Fe(e, t, u);
      }
      else r.current = null;
    }
    function rp(e) {
      var t = e.type, r = e.memoizedProps, o = e.stateNode;
      try {
        e: switch (t) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            r.autoFocus && o.focus();
            break e;
          case "img":
            r.src ? o.src = r.src : r.srcSet && (o.srcset = r.srcSet);
        }
      } catch (u) {
        Fe(e, e.return, u);
      }
    }
    function fu(e, t, r) {
      try {
        var o = e.stateNode;
        kx(o, e.type, r, t), o[le] = t;
      } catch (u) {
        Fe(e, e.return, u);
      }
    }
    function ap(e) {
      return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Bl(e.type) || e.tag === 4;
    }
    function hu(e) {
      e: for (; ; ) {
        for (; e.sibling === null; ) {
          if (e.return === null || ap(e.return)) return null;
          e = e.return;
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
          if (e.tag === 27 && Bl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
          e.child.return = e, e = e.child;
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function mu(e, t, r) {
      var o = e.tag;
      if (o === 5 || o === 6) e = e.stateNode, t ? (r.nodeType === 9 ? r.body : r.nodeName === "HTML" ? r.ownerDocument.body : r).insertBefore(e, t) : (t = r.nodeType === 9 ? r.body : r.nodeName === "HTML" ? r.ownerDocument.body : r, t.appendChild(e), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = Wn));
      else if (o !== 4 && (o === 27 && Bl(e.type) && (r = e.stateNode, t = null), e = e.child, e !== null)) for (mu(e, t, r), e = e.sibling; e !== null; ) mu(e, t, r), e = e.sibling;
    }
    function Ni(e, t, r) {
      var o = e.tag;
      if (o === 5 || o === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e);
      else if (o !== 4 && (o === 27 && Bl(e.type) && (r = e.stateNode), e = e.child, e !== null)) for (Ni(e, t, r), e = e.sibling; e !== null; ) Ni(e, t, r), e = e.sibling;
    }
    function op(e) {
      var t = e.stateNode, r = e.memoizedProps;
      try {
        for (var o = e.type, u = t.attributes; u.length; ) t.removeAttributeNode(u[0]);
        Ot(t, o, r), t[Et] = e, t[le] = r;
      } catch (d) {
        Fe(e, e.return, d);
      }
    }
    var sl = false, wt = false, pu = false, ip = typeof WeakSet == "function" ? WeakSet : Set, jt = null;
    function ox(e, t) {
      if (e = e.containerInfo, zu = es, e = vh(e), sc(e)) {
        if ("selectionStart" in e) var r = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
        else e: {
          r = (r = e.ownerDocument) && r.defaultView || window;
          var o = r.getSelection && r.getSelection();
          if (o && o.rangeCount !== 0) {
            r = o.anchorNode;
            var u = o.anchorOffset, d = o.focusNode;
            o = o.focusOffset;
            try {
              r.nodeType, d.nodeType;
            } catch {
              r = null;
              break e;
            }
            var x = 0, M = -1, I = -1, Z = 0, ee = 0, re = e, K = null;
            t: for (; ; ) {
              for (var F; re !== r || u !== 0 && re.nodeType !== 3 || (M = x + u), re !== d || o !== 0 && re.nodeType !== 3 || (I = x + o), re.nodeType === 3 && (x += re.nodeValue.length), (F = re.firstChild) !== null; ) K = re, re = F;
              for (; ; ) {
                if (re === e) break t;
                if (K === r && ++Z === u && (M = x), K === d && ++ee === o && (I = x), (F = re.nextSibling) !== null) break;
                re = K, K = re.parentNode;
              }
              re = F;
            }
            r = M === -1 || I === -1 ? null : {
              start: M,
              end: I
            };
          } else r = null;
        }
        r = r || {
          start: 0,
          end: 0
        };
      } else r = null;
      for (Iu = {
        focusedElem: e,
        selectionRange: r
      }, es = false, jt = t; jt !== null; ) if (t = jt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, jt = e;
      else for (; jt !== null; ) {
        switch (t = jt, d = t.alternate, e = t.flags, t.tag) {
          case 0:
            if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null)) for (r = 0; r < e.length; r++) u = e[r], u.ref.impl = u.nextImpl;
            break;
          case 11:
          case 15:
            break;
          case 1:
            if ((e & 1024) !== 0 && d !== null) {
              e = void 0, r = t, u = d.memoizedProps, d = d.memoizedState, o = r.stateNode;
              try {
                var pe = xr(r.type, u);
                e = o.getSnapshotBeforeUpdate(pe, d), o.__reactInternalSnapshotBeforeUpdate = e;
              } catch (Ee) {
                Fe(r, r.return, Ee);
              }
            }
            break;
          case 3:
            if ((e & 1024) !== 0) {
              if (e = t.stateNode.containerInfo, r = e.nodeType, r === 9) Uu(e);
              else if (r === 1) switch (e.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Uu(e);
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
            if ((e & 1024) !== 0) throw Error(i(163));
        }
        if (e = t.sibling, e !== null) {
          e.return = t.return, jt = e;
          break;
        }
        jt = t.return;
      }
    }
    function sp(e, t, r) {
      var o = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          ul(e, r), o & 4 && no(5, r);
          break;
        case 1:
          if (ul(e, r), o & 4) if (e = r.stateNode, t === null) try {
            e.componentDidMount();
          } catch (x) {
            Fe(r, r.return, x);
          }
          else {
            var u = xr(r.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(u, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (x) {
              Fe(r, r.return, x);
            }
          }
          o & 64 && np(r), o & 512 && lo(r, r.return);
          break;
        case 3:
          if (ul(e, r), o & 64 && (e = r.updateQueue, e !== null)) {
            if (t = null, r.child !== null) switch (r.child.tag) {
              case 27:
              case 5:
                t = r.child.stateNode;
                break;
              case 1:
                t = r.child.stateNode;
            }
            try {
              Gh(e, t);
            } catch (x) {
              Fe(r, r.return, x);
            }
          }
          break;
        case 27:
          t === null && o & 4 && op(r);
        case 26:
        case 5:
          ul(e, r), t === null && o & 4 && rp(r), o & 512 && lo(r, r.return);
          break;
        case 12:
          ul(e, r);
          break;
        case 31:
          ul(e, r), o & 4 && dp(e, r);
          break;
        case 13:
          ul(e, r), o & 4 && fp(e, r), o & 64 && (e = r.memoizedState, e !== null && (e = e.dehydrated, e !== null && (r = px.bind(null, r), Dx(e, r))));
          break;
        case 22:
          if (o = r.memoizedState !== null || sl, !o) {
            t = t !== null && t.memoizedState !== null || wt, u = sl;
            var d = wt;
            sl = o, (wt = t) && !d ? dl(e, r, (r.subtreeFlags & 8772) !== 0) : ul(e, r), sl = u, wt = d;
          }
          break;
        case 30:
          break;
        default:
          ul(e, r);
      }
    }
    function cp(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, cp(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && lt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
    }
    var dt = null, Kt = false;
    function cl(e, t, r) {
      for (r = r.child; r !== null; ) up(e, t, r), r = r.sibling;
    }
    function up(e, t, r) {
      if (Ut && typeof Ut.onCommitFiberUnmount == "function") try {
        Ut.onCommitFiberUnmount(vl, r);
      } catch {
      }
      switch (r.tag) {
        case 26:
          wt || Xn(r, t), cl(e, t, r), r.memoizedState ? r.memoizedState.count-- : r.stateNode && (r = r.stateNode, r.parentNode.removeChild(r));
          break;
        case 27:
          wt || Xn(r, t);
          var o = dt, u = Kt;
          Bl(r.type) && (dt = r.stateNode, Kt = false), cl(e, t, r), ho(r.stateNode), dt = o, Kt = u;
          break;
        case 5:
          wt || Xn(r, t);
        case 6:
          if (o = dt, u = Kt, dt = null, cl(e, t, r), dt = o, Kt = u, dt !== null) if (Kt) try {
            (dt.nodeType === 9 ? dt.body : dt.nodeName === "HTML" ? dt.ownerDocument.body : dt).removeChild(r.stateNode);
          } catch (d) {
            Fe(r, t, d);
          }
          else try {
            dt.removeChild(r.stateNode);
          } catch (d) {
            Fe(r, t, d);
          }
          break;
        case 18:
          dt !== null && (Kt ? (e = dt, ng(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, r.stateNode), ha(e)) : ng(dt, r.stateNode));
          break;
        case 4:
          o = dt, u = Kt, dt = r.stateNode.containerInfo, Kt = true, cl(e, t, r), dt = o, Kt = u;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          Ol(2, r, t), wt || Ol(4, r, t), cl(e, t, r);
          break;
        case 1:
          wt || (Xn(r, t), o = r.stateNode, typeof o.componentWillUnmount == "function" && lp(r, t, o)), cl(e, t, r);
          break;
        case 21:
          cl(e, t, r);
          break;
        case 22:
          wt = (o = wt) || r.memoizedState !== null, cl(e, t, r), wt = o;
          break;
        default:
          cl(e, t, r);
      }
    }
    function dp(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
        e = e.dehydrated;
        try {
          ha(e);
        } catch (r) {
          Fe(t, t.return, r);
        }
      }
    }
    function fp(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
        ha(e);
      } catch (r) {
        Fe(t, t.return, r);
      }
    }
    function ix(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return t === null && (t = e.stateNode = new ip()), t;
        case 22:
          return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new ip()), t;
        default:
          throw Error(i(435, e.tag));
      }
    }
    function Oi(e, t) {
      var r = ix(e);
      t.forEach(function(o) {
        if (!r.has(o)) {
          r.add(o);
          var u = gx.bind(null, e, o);
          o.then(u, u);
        }
      });
    }
    function Pt(e, t) {
      var r = t.deletions;
      if (r !== null) for (var o = 0; o < r.length; o++) {
        var u = r[o], d = e, x = t, M = x;
        e: for (; M !== null; ) {
          switch (M.tag) {
            case 27:
              if (Bl(M.type)) {
                dt = M.stateNode, Kt = false;
                break e;
              }
              break;
            case 5:
              dt = M.stateNode, Kt = false;
              break e;
            case 3:
            case 4:
              dt = M.stateNode.containerInfo, Kt = true;
              break e;
          }
          M = M.return;
        }
        if (dt === null) throw Error(i(160));
        up(d, x, u), dt = null, Kt = false, d = u.alternate, d !== null && (d.return = null), u.return = null;
      }
      if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) hp(t, e), t = t.sibling;
    }
    var Rn = null;
    function hp(e, t) {
      var r = e.alternate, o = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Pt(t, e), Qt(e), o & 4 && (Ol(3, e, e.return), no(3, e), Ol(5, e, e.return));
          break;
        case 1:
          Pt(t, e), Qt(e), o & 512 && (wt || r === null || Xn(r, r.return)), o & 64 && sl && (e = e.updateQueue, e !== null && (o = e.callbacks, o !== null && (r = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = r === null ? o : r.concat(o))));
          break;
        case 26:
          var u = Rn;
          if (Pt(t, e), Qt(e), o & 512 && (wt || r === null || Xn(r, r.return)), o & 4) {
            var d = r !== null ? r.memoizedState : null;
            if (o = e.memoizedState, r === null) if (o === null) if (e.stateNode === null) {
              e: {
                o = e.type, r = e.memoizedProps, u = u.ownerDocument || u;
                t: switch (o) {
                  case "title":
                    d = u.getElementsByTagName("title")[0], (!d || d[Ze] || d[Et] || d.namespaceURI === "http://www.w3.org/2000/svg" || d.hasAttribute("itemprop")) && (d = u.createElement(o), u.head.insertBefore(d, u.querySelector("head > title"))), Ot(d, o, r), d[Et] = e, Je(d), o = d;
                    break e;
                  case "link":
                    var x = hg("link", "href", u).get(o + (r.href || ""));
                    if (x) {
                      for (var M = 0; M < x.length; M++) if (d = x[M], d.getAttribute("href") === (r.href == null || r.href === "" ? null : r.href) && d.getAttribute("rel") === (r.rel == null ? null : r.rel) && d.getAttribute("title") === (r.title == null ? null : r.title) && d.getAttribute("crossorigin") === (r.crossOrigin == null ? null : r.crossOrigin)) {
                        x.splice(M, 1);
                        break t;
                      }
                    }
                    d = u.createElement(o), Ot(d, o, r), u.head.appendChild(d);
                    break;
                  case "meta":
                    if (x = hg("meta", "content", u).get(o + (r.content || ""))) {
                      for (M = 0; M < x.length; M++) if (d = x[M], d.getAttribute("content") === (r.content == null ? null : "" + r.content) && d.getAttribute("name") === (r.name == null ? null : r.name) && d.getAttribute("property") === (r.property == null ? null : r.property) && d.getAttribute("http-equiv") === (r.httpEquiv == null ? null : r.httpEquiv) && d.getAttribute("charset") === (r.charSet == null ? null : r.charSet)) {
                        x.splice(M, 1);
                        break t;
                      }
                    }
                    d = u.createElement(o), Ot(d, o, r), u.head.appendChild(d);
                    break;
                  default:
                    throw Error(i(468, o));
                }
                d[Et] = e, Je(d), o = d;
              }
              e.stateNode = o;
            } else mg(u, e.type, e.stateNode);
            else e.stateNode = fg(u, o, e.memoizedProps);
            else d !== o ? (d === null ? r.stateNode !== null && (r = r.stateNode, r.parentNode.removeChild(r)) : d.count--, o === null ? mg(u, e.type, e.stateNode) : fg(u, o, e.memoizedProps)) : o === null && e.stateNode !== null && fu(e, e.memoizedProps, r.memoizedProps);
          }
          break;
        case 27:
          Pt(t, e), Qt(e), o & 512 && (wt || r === null || Xn(r, r.return)), r !== null && o & 4 && fu(e, e.memoizedProps, r.memoizedProps);
          break;
        case 5:
          if (Pt(t, e), Qt(e), o & 512 && (wt || r === null || Xn(r, r.return)), e.flags & 32) {
            u = e.stateNode;
            try {
              zr(u, "");
            } catch (pe) {
              Fe(e, e.return, pe);
            }
          }
          o & 4 && e.stateNode != null && (u = e.memoizedProps, fu(e, u, r !== null ? r.memoizedProps : u)), o & 1024 && (pu = true);
          break;
        case 6:
          if (Pt(t, e), Qt(e), o & 4) {
            if (e.stateNode === null) throw Error(i(162));
            o = e.memoizedProps, r = e.stateNode;
            try {
              r.nodeValue = o;
            } catch (pe) {
              Fe(e, e.return, pe);
            }
          }
          break;
        case 3:
          if (Qi = null, u = Rn, Rn = Ki(t.containerInfo), Pt(t, e), Rn = u, Qt(e), o & 4 && r !== null && r.memoizedState.isDehydrated) try {
            ha(t.containerInfo);
          } catch (pe) {
            Fe(e, e.return, pe);
          }
          pu && (pu = false, mp(e));
          break;
        case 4:
          o = Rn, Rn = Ki(e.stateNode.containerInfo), Pt(t, e), Qt(e), Rn = o;
          break;
        case 12:
          Pt(t, e), Qt(e);
          break;
        case 31:
          Pt(t, e), Qt(e), o & 4 && (o = e.updateQueue, o !== null && (e.updateQueue = null, Oi(e, o)));
          break;
        case 13:
          Pt(t, e), Qt(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (zi = Ct()), o & 4 && (o = e.updateQueue, o !== null && (e.updateQueue = null, Oi(e, o)));
          break;
        case 22:
          u = e.memoizedState !== null;
          var I = r !== null && r.memoizedState !== null, Z = sl, ee = wt;
          if (sl = Z || u, wt = ee || I, Pt(t, e), wt = ee, sl = Z, Qt(e), o & 8192) e: for (t = e.stateNode, t._visibility = u ? t._visibility & -2 : t._visibility | 1, u && (r === null || I || sl || wt || Sr(e)), r = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (r === null) {
                I = r = t;
                try {
                  if (d = I.stateNode, u) x = d.style, typeof x.setProperty == "function" ? x.setProperty("display", "none", "important") : x.display = "none";
                  else {
                    M = I.stateNode;
                    var re = I.memoizedProps.style, K = re != null && re.hasOwnProperty("display") ? re.display : null;
                    M.style.display = K == null || typeof K == "boolean" ? "" : ("" + K).trim();
                  }
                } catch (pe) {
                  Fe(I, I.return, pe);
                }
              }
            } else if (t.tag === 6) {
              if (r === null) {
                I = t;
                try {
                  I.stateNode.nodeValue = u ? "" : I.memoizedProps;
                } catch (pe) {
                  Fe(I, I.return, pe);
                }
              }
            } else if (t.tag === 18) {
              if (r === null) {
                I = t;
                try {
                  var F = I.stateNode;
                  u ? lg(F, true) : lg(I.stateNode, false);
                } catch (pe) {
                  Fe(I, I.return, pe);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              r === t && (r = null), t = t.return;
            }
            r === t && (r = null), t.sibling.return = t.return, t = t.sibling;
          }
          o & 4 && (o = e.updateQueue, o !== null && (r = o.retryQueue, r !== null && (o.retryQueue = null, Oi(e, r))));
          break;
        case 19:
          Pt(t, e), Qt(e), o & 4 && (o = e.updateQueue, o !== null && (e.updateQueue = null, Oi(e, o)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          Pt(t, e), Qt(e);
      }
    }
    function Qt(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var r, o = e.return; o !== null; ) {
            if (ap(o)) {
              r = o;
              break;
            }
            o = o.return;
          }
          if (r == null) throw Error(i(160));
          switch (r.tag) {
            case 27:
              var u = r.stateNode, d = hu(e);
              Ni(e, d, u);
              break;
            case 5:
              var x = r.stateNode;
              r.flags & 32 && (zr(x, ""), r.flags &= -33);
              var M = hu(e);
              Ni(e, M, x);
              break;
            case 3:
            case 4:
              var I = r.stateNode.containerInfo, Z = hu(e);
              mu(e, Z, I);
              break;
            default:
              throw Error(i(161));
          }
        } catch (ee) {
          Fe(e, e.return, ee);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function mp(e) {
      if (e.subtreeFlags & 1024) for (e = e.child; e !== null; ) {
        var t = e;
        mp(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
    }
    function ul(e, t) {
      if (t.subtreeFlags & 8772) for (t = t.child; t !== null; ) sp(e, t.alternate, t), t = t.sibling;
    }
    function Sr(e) {
      for (e = e.child; e !== null; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            Ol(4, t, t.return), Sr(t);
            break;
          case 1:
            Xn(t, t.return);
            var r = t.stateNode;
            typeof r.componentWillUnmount == "function" && lp(t, t.return, r), Sr(t);
            break;
          case 27:
            ho(t.stateNode);
          case 26:
          case 5:
            Xn(t, t.return), Sr(t);
            break;
          case 22:
            t.memoizedState === null && Sr(t);
            break;
          case 30:
            Sr(t);
            break;
          default:
            Sr(t);
        }
        e = e.sibling;
      }
    }
    function dl(e, t, r) {
      for (r = r && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
        var o = t.alternate, u = e, d = t, x = d.flags;
        switch (d.tag) {
          case 0:
          case 11:
          case 15:
            dl(u, d, r), no(4, d);
            break;
          case 1:
            if (dl(u, d, r), o = d, u = o.stateNode, typeof u.componentDidMount == "function") try {
              u.componentDidMount();
            } catch (Z) {
              Fe(o, o.return, Z);
            }
            if (o = d, u = o.updateQueue, u !== null) {
              var M = o.stateNode;
              try {
                var I = u.shared.hiddenCallbacks;
                if (I !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < I.length; u++) qh(I[u], M);
              } catch (Z) {
                Fe(o, o.return, Z);
              }
            }
            r && x & 64 && np(d), lo(d, d.return);
            break;
          case 27:
            op(d);
          case 26:
          case 5:
            dl(u, d, r), r && o === null && x & 4 && rp(d), lo(d, d.return);
            break;
          case 12:
            dl(u, d, r);
            break;
          case 31:
            dl(u, d, r), r && x & 4 && dp(u, d);
            break;
          case 13:
            dl(u, d, r), r && x & 4 && fp(u, d);
            break;
          case 22:
            d.memoizedState === null && dl(u, d, r), lo(d, d.return);
            break;
          case 30:
            break;
          default:
            dl(u, d, r);
        }
        t = t.sibling;
      }
    }
    function gu(e, t) {
      var r = null;
      e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (r = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== r && (e != null && e.refCount++, r != null && Va(r));
    }
    function yu(e, t) {
      e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Va(e));
    }
    function Ln(e, t, r, o) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) pp(e, t, r, o), t = t.sibling;
    }
    function pp(e, t, r, o) {
      var u = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Ln(e, t, r, o), u & 2048 && no(9, t);
          break;
        case 1:
          Ln(e, t, r, o);
          break;
        case 3:
          Ln(e, t, r, o), u & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Va(e)));
          break;
        case 12:
          if (u & 2048) {
            Ln(e, t, r, o), e = t.stateNode;
            try {
              var d = t.memoizedProps, x = d.id, M = d.onPostCommit;
              typeof M == "function" && M(x, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
            } catch (I) {
              Fe(t, t.return, I);
            }
          } else Ln(e, t, r, o);
          break;
        case 31:
          Ln(e, t, r, o);
          break;
        case 13:
          Ln(e, t, r, o);
          break;
        case 23:
          break;
        case 22:
          d = t.stateNode, x = t.alternate, t.memoizedState !== null ? d._visibility & 2 ? Ln(e, t, r, o) : ro(e, t) : d._visibility & 2 ? Ln(e, t, r, o) : (d._visibility |= 2, na(e, t, r, o, (t.subtreeFlags & 10256) !== 0 || false)), u & 2048 && gu(x, t);
          break;
        case 24:
          Ln(e, t, r, o), u & 2048 && yu(t.alternate, t);
          break;
        default:
          Ln(e, t, r, o);
      }
    }
    function na(e, t, r, o, u) {
      for (u = u && ((t.subtreeFlags & 10256) !== 0 || false), t = t.child; t !== null; ) {
        var d = e, x = t, M = r, I = o, Z = x.flags;
        switch (x.tag) {
          case 0:
          case 11:
          case 15:
            na(d, x, M, I, u), no(8, x);
            break;
          case 23:
            break;
          case 22:
            var ee = x.stateNode;
            x.memoizedState !== null ? ee._visibility & 2 ? na(d, x, M, I, u) : ro(d, x) : (ee._visibility |= 2, na(d, x, M, I, u)), u && Z & 2048 && gu(x.alternate, x);
            break;
          case 24:
            na(d, x, M, I, u), u && Z & 2048 && yu(x.alternate, x);
            break;
          default:
            na(d, x, M, I, u);
        }
        t = t.sibling;
      }
    }
    function ro(e, t) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) {
        var r = e, o = t, u = o.flags;
        switch (o.tag) {
          case 22:
            ro(r, o), u & 2048 && gu(o.alternate, o);
            break;
          case 24:
            ro(r, o), u & 2048 && yu(o.alternate, o);
            break;
          default:
            ro(r, o);
        }
        t = t.sibling;
      }
    }
    var ao = 8192;
    function la(e, t, r) {
      if (e.subtreeFlags & ao) for (e = e.child; e !== null; ) gp(e, t, r), e = e.sibling;
    }
    function gp(e, t, r) {
      switch (e.tag) {
        case 26:
          la(e, t, r), e.flags & ao && e.memoizedState !== null && Zx(r, Rn, e.memoizedState, e.memoizedProps);
          break;
        case 5:
          la(e, t, r);
          break;
        case 3:
        case 4:
          var o = Rn;
          Rn = Ki(e.stateNode.containerInfo), la(e, t, r), Rn = o;
          break;
        case 22:
          e.memoizedState === null && (o = e.alternate, o !== null && o.memoizedState !== null ? (o = ao, ao = 16777216, la(e, t, r), ao = o) : la(e, t, r));
          break;
        default:
          la(e, t, r);
      }
    }
    function yp(e) {
      var t = e.alternate;
      if (t !== null && (e = t.child, e !== null)) {
        t.child = null;
        do
          t = e.sibling, e.sibling = null, e = t;
        while (e !== null);
      }
    }
    function oo(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var r = 0; r < t.length; r++) {
          var o = t[r];
          jt = o, vp(o, e);
        }
        yp(e);
      }
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) bp(e), e = e.sibling;
    }
    function bp(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          oo(e), e.flags & 2048 && Ol(9, e, e.return);
          break;
        case 3:
          oo(e);
          break;
        case 12:
          oo(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Di(e)) : oo(e);
          break;
        default:
          oo(e);
      }
    }
    function Di(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var r = 0; r < t.length; r++) {
          var o = t[r];
          jt = o, vp(o, e);
        }
        yp(e);
      }
      for (e = e.child; e !== null; ) {
        switch (t = e, t.tag) {
          case 0:
          case 11:
          case 15:
            Ol(8, t, t.return), Di(t);
            break;
          case 22:
            r = t.stateNode, r._visibility & 2 && (r._visibility &= -3, Di(t));
            break;
          default:
            Di(t);
        }
        e = e.sibling;
      }
    }
    function vp(e, t) {
      for (; jt !== null; ) {
        var r = jt;
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            Ol(8, r, t);
            break;
          case 23:
          case 22:
            if (r.memoizedState !== null && r.memoizedState.cachePool !== null) {
              var o = r.memoizedState.cachePool.pool;
              o != null && o.refCount++;
            }
            break;
          case 24:
            Va(r.memoizedState.cache);
        }
        if (o = r.child, o !== null) o.return = r, jt = o;
        else e: for (r = e; jt !== null; ) {
          o = jt;
          var u = o.sibling, d = o.return;
          if (cp(o), o === r) {
            jt = null;
            break e;
          }
          if (u !== null) {
            u.return = d, jt = u;
            break e;
          }
          jt = d;
        }
      }
    }
    var sx = {
      getCacheForType: function(e) {
        var t = Tt(vt), r = t.data.get(e);
        return r === void 0 && (r = e(), t.data.set(e, r)), r;
      },
      cacheSignal: function() {
        return Tt(vt).controller.signal;
      }
    }, cx = typeof WeakMap == "function" ? WeakMap : Map, Ge = 0, rt = null, Oe = null, Ye = 0, Qe = 0, on = null, Dl = false, ra = false, bu = false, fl = 0, ht = 0, zl = 0, wr = 0, vu = 0, sn = 0, aa = 0, io = null, Ft = null, xu = false, zi = 0, xp = 0, Ii = 1 / 0, Hi = null, Il = null, _t = 0, Hl = null, oa = null, hl = 0, Su = 0, wu = null, Sp = null, so = 0, Cu = null;
    function cn() {
      return (Ge & 2) !== 0 && Ye !== 0 ? Ye & -Ye : $.T !== null ? Ru() : Hn();
    }
    function wp() {
      if (sn === 0) if ((Ye & 536870912) === 0 || Be) {
        var e = Ar;
        Ar <<= 1, (Ar & 3932160) === 0 && (Ar = 262144), sn = e;
      } else sn = 536870912;
      return e = rn.current, e !== null && (e.flags |= 32), sn;
    }
    function Wt(e, t, r) {
      (e === rt && (Qe === 2 || Qe === 9) || e.cancelPendingCommit !== null) && (ia(e, 0), Yl(e, Ye, sn, false)), rr(e, r), ((Ge & 2) === 0 || e !== rt) && (e === rt && ((Ge & 2) === 0 && (wr |= r), ht === 4 && Yl(e, Ye, sn, false)), Vn(e));
    }
    function Cp(e, t, r) {
      if ((Ge & 6) !== 0) throw Error(i(327));
      var o = !r && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Kn(e, t), u = o ? fx(e, t) : _u(e, t, true), d = o;
      do {
        if (u === 0) {
          ra && !o && Yl(e, t, 0, false);
          break;
        } else {
          if (r = e.current.alternate, d && !ux(r)) {
            u = _u(e, t, false), d = false;
            continue;
          }
          if (u === 2) {
            if (d = t, e.errorRecoveryDisabledLanes & d) var x = 0;
            else x = e.pendingLanes & -536870913, x = x !== 0 ? x : x & 536870912 ? 536870912 : 0;
            if (x !== 0) {
              t = x;
              e: {
                var M = e;
                u = io;
                var I = M.current.memoizedState.isDehydrated;
                if (I && (ia(M, x).flags |= 256), x = _u(M, x, false), x !== 2) {
                  if (bu && !I) {
                    M.errorRecoveryDisabledLanes |= d, wr |= d, u = 4;
                    break e;
                  }
                  d = Ft, Ft = u, d !== null && (Ft === null ? Ft = d : Ft.push.apply(Ft, d));
                }
                u = x;
              }
              if (d = false, u !== 2) continue;
            }
          }
          if (u === 1) {
            ia(e, 0), Yl(e, t, 0, true);
            break;
          }
          e: {
            switch (o = e, d = u, d) {
              case 0:
              case 1:
                throw Error(i(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                Yl(o, t, sn, !Dl);
                break e;
              case 2:
                Ft = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(i(329));
            }
            if ((t & 62914560) === t && (u = zi + 300 - Ct(), 10 < u)) {
              if (Yl(o, t, sn, !Dl), xl(o, 0, true) !== 0) break e;
              hl = t, o.timeoutHandle = eg(Ep.bind(null, o, r, Ft, Hi, xu, t, sn, wr, aa, Dl, d, "Throttled", -0, 0), u);
              break e;
            }
            Ep(o, r, Ft, Hi, xu, t, sn, wr, aa, Dl, d, null, -0, 0);
          }
        }
        break;
      } while (true);
      Vn(e);
    }
    function Ep(e, t, r, o, u, d, x, M, I, Z, ee, re, K, F) {
      if (e.timeoutHandle = -1, re = t.subtreeFlags, re & 8192 || (re & 16785408) === 16785408) {
        re = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: true,
          waitingForViewTransition: false,
          unsuspend: Wn
        }, gp(t, d, re);
        var pe = (d & 62914560) === d ? zi - Ct() : (d & 4194048) === d ? xp - Ct() : 0;
        if (pe = Kx(re, pe), pe !== null) {
          hl = d, e.cancelPendingCommit = pe(Tp.bind(null, e, t, d, r, o, u, x, M, I, ee, re, null, K, F)), Yl(e, d, x, !Z);
          return;
        }
      }
      Tp(e, t, d, r, o, u, x, M, I);
    }
    function ux(e) {
      for (var t = e; ; ) {
        var r = t.tag;
        if ((r === 0 || r === 11 || r === 15) && t.flags & 16384 && (r = t.updateQueue, r !== null && (r = r.stores, r !== null))) for (var o = 0; o < r.length; o++) {
          var u = r[o], d = u.getSnapshot;
          u = u.value;
          try {
            if (!nn(d(), u)) return false;
          } catch {
            return false;
          }
        }
        if (r = t.child, t.subtreeFlags & 16384 && r !== null) r.return = t, t = r;
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
    function Yl(e, t, r, o) {
      t &= ~vu, t &= ~wr, e.suspendedLanes |= t, e.pingedLanes &= ~t, o && (e.warmLanes |= t), o = e.expirationTimes;
      for (var u = t; 0 < u; ) {
        var d = 31 - Bt(u), x = 1 << d;
        o[d] = -1, u &= ~x;
      }
      r !== 0 && Go(e, r, t);
    }
    function Yi() {
      return (Ge & 6) === 0 ? (co(0), false) : true;
    }
    function Eu() {
      if (Oe !== null) {
        if (Qe === 0) var e = Oe.return;
        else e = Oe, nl = hr = null, Uc(e), Fr = null, qa = 0, e = Oe;
        for (; e !== null; ) tp(e.alternate, e), e = e.return;
        Oe = null;
      }
    }
    function ia(e, t) {
      var r = e.timeoutHandle;
      r !== -1 && (e.timeoutHandle = -1, Lx(r)), r = e.cancelPendingCommit, r !== null && (e.cancelPendingCommit = null, r()), hl = 0, Eu(), rt = e, Oe = r = el(e.current, null), Ye = t, Qe = 0, on = null, Dl = false, ra = Kn(e, t), bu = false, aa = sn = vu = wr = zl = ht = 0, Ft = io = null, xu = false, (t & 8) !== 0 && (t |= t & 32);
      var o = e.entangledLanes;
      if (o !== 0) for (e = e.entanglements, o &= t; 0 < o; ) {
        var u = 31 - Bt(o), d = 1 << u;
        t |= e[u], o &= ~d;
      }
      return fl = t, oi(), r;
    }
    function _p(e, t) {
      Le = null, $.H = Ja, t === Qr || t === mi ? (t = Bh(), Qe = 3) : t === jc ? (t = Bh(), Qe = 4) : Qe = t === nu ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, on = t, Oe === null && (ht = 1, ji(e, gn(t, e.current)));
    }
    function Mp() {
      var e = rn.current;
      return e === null ? true : (Ye & 4194048) === Ye ? xn === null : (Ye & 62914560) === Ye || (Ye & 536870912) !== 0 ? e === xn : false;
    }
    function kp() {
      var e = $.H;
      return $.H = Ja, e === null ? Ja : e;
    }
    function jp() {
      var e = $.A;
      return $.A = sx, e;
    }
    function Ui() {
      ht = 4, Dl || (Ye & 4194048) !== Ye && rn.current !== null || (ra = true), (zl & 134217727) === 0 && (wr & 134217727) === 0 || rt === null || Yl(rt, Ye, sn, false);
    }
    function _u(e, t, r) {
      var o = Ge;
      Ge |= 2;
      var u = kp(), d = jp();
      (rt !== e || Ye !== t) && (Hi = null, ia(e, t)), t = false;
      var x = ht;
      e: do
        try {
          if (Qe !== 0 && Oe !== null) {
            var M = Oe, I = on;
            switch (Qe) {
              case 8:
                Eu(), x = 6;
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                rn.current === null && (t = true);
                var Z = Qe;
                if (Qe = 0, on = null, sa(e, M, I, Z), r && ra) {
                  x = 0;
                  break e;
                }
                break;
              default:
                Z = Qe, Qe = 0, on = null, sa(e, M, I, Z);
            }
          }
          dx(), x = ht;
          break;
        } catch (ee) {
          _p(e, ee);
        }
      while (true);
      return t && e.shellSuspendCounter++, nl = hr = null, Ge = o, $.H = u, $.A = d, Oe === null && (rt = null, Ye = 0, oi()), x;
    }
    function dx() {
      for (; Oe !== null; ) Rp(Oe);
    }
    function fx(e, t) {
      var r = Ge;
      Ge |= 2;
      var o = kp(), u = jp();
      rt !== e || Ye !== t ? (Hi = null, Ii = Ct() + 500, ia(e, t)) : ra = Kn(e, t);
      e: do
        try {
          if (Qe !== 0 && Oe !== null) {
            t = Oe;
            var d = on;
            t: switch (Qe) {
              case 1:
                Qe = 0, on = null, sa(e, t, d, 1);
                break;
              case 2:
              case 9:
                if (Yh(d)) {
                  Qe = 0, on = null, Lp(t);
                  break;
                }
                t = function() {
                  Qe !== 2 && Qe !== 9 || rt !== e || (Qe = 7), Vn(e);
                }, d.then(t, t);
                break e;
              case 3:
                Qe = 7;
                break e;
              case 4:
                Qe = 5;
                break e;
              case 7:
                Yh(d) ? (Qe = 0, on = null, Lp(t)) : (Qe = 0, on = null, sa(e, t, d, 7));
                break;
              case 5:
                var x = null;
                switch (Oe.tag) {
                  case 26:
                    x = Oe.memoizedState;
                  case 5:
                  case 27:
                    var M = Oe;
                    if (x ? pg(x) : M.stateNode.complete) {
                      Qe = 0, on = null;
                      var I = M.sibling;
                      if (I !== null) Oe = I;
                      else {
                        var Z = M.return;
                        Z !== null ? (Oe = Z, Bi(Z)) : Oe = null;
                      }
                      break t;
                    }
                }
                Qe = 0, on = null, sa(e, t, d, 5);
                break;
              case 6:
                Qe = 0, on = null, sa(e, t, d, 6);
                break;
              case 8:
                Eu(), ht = 6;
                break e;
              default:
                throw Error(i(462));
            }
          }
          hx();
          break;
        } catch (ee) {
          _p(e, ee);
        }
      while (true);
      return nl = hr = null, $.H = o, $.A = u, Ge = r, Oe !== null ? 0 : (rt = null, Ye = 0, oi(), ht);
    }
    function hx() {
      for (; Oe !== null && !_a(); ) Rp(Oe);
    }
    function Rp(e) {
      var t = Jm(e.alternate, e, fl);
      e.memoizedProps = e.pendingProps, t === null ? Bi(e) : Oe = t;
    }
    function Lp(e) {
      var t = e, r = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = Zm(r, t, t.pendingProps, t.type, void 0, Ye);
          break;
        case 11:
          t = Zm(r, t, t.pendingProps, t.type.render, t.ref, Ye);
          break;
        case 5:
          Uc(t);
        default:
          tp(r, t), t = Oe = jh(t, fl), t = Jm(r, t, fl);
      }
      e.memoizedProps = e.pendingProps, t === null ? Bi(e) : Oe = t;
    }
    function sa(e, t, r, o) {
      nl = hr = null, Uc(t), Fr = null, qa = 0;
      var u = t.return;
      try {
        if (tx(e, u, t, r, Ye)) {
          ht = 1, ji(e, gn(r, e.current)), Oe = null;
          return;
        }
      } catch (d) {
        if (u !== null) throw Oe = u, d;
        ht = 1, ji(e, gn(r, e.current)), Oe = null;
        return;
      }
      t.flags & 32768 ? (Be || o === 1 ? e = true : ra || (Ye & 536870912) !== 0 ? e = false : (Dl = e = true, (o === 2 || o === 9 || o === 3 || o === 6) && (o = rn.current, o !== null && o.tag === 13 && (o.flags |= 16384))), Ap(t, e)) : Bi(t);
    }
    function Bi(e) {
      var t = e;
      do {
        if ((t.flags & 32768) !== 0) {
          Ap(t, Dl);
          return;
        }
        e = t.return;
        var r = rx(t.alternate, t, fl);
        if (r !== null) {
          Oe = r;
          return;
        }
        if (t = t.sibling, t !== null) {
          Oe = t;
          return;
        }
        Oe = t = e;
      } while (t !== null);
      ht === 0 && (ht = 5);
    }
    function Ap(e, t) {
      do {
        var r = ax(e.alternate, e);
        if (r !== null) {
          r.flags &= 32767, Oe = r;
          return;
        }
        if (r = e.return, r !== null && (r.flags |= 32768, r.subtreeFlags = 0, r.deletions = null), !t && (e = e.sibling, e !== null)) {
          Oe = e;
          return;
        }
        Oe = e = r;
      } while (e !== null);
      ht = 6, Oe = null;
    }
    function Tp(e, t, r, o, u, d, x, M, I) {
      e.cancelPendingCommit = null;
      do
        Xi();
      while (_t !== 0);
      if ((Ge & 6) !== 0) throw Error(i(327));
      if (t !== null) {
        if (t === e.current) throw Error(i(177));
        if (d = t.lanes | t.childLanes, d |= hc, In(e, r, d, x, M, I), e === rt && (Oe = rt = null, Ye = 0), oa = t, Hl = e, hl = r, Su = d, wu = u, Sp = o, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, yx(Lr, function() {
          return Ip(), null;
        })) : (e.callbackNode = null, e.callbackPriority = 0), o = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || o) {
          o = $.T, $.T = null, u = P.p, P.p = 2, x = Ge, Ge |= 4;
          try {
            ox(e, t, r);
          } finally {
            Ge = x, P.p = u, $.T = o;
          }
        }
        _t = 1, Np(), Op(), Dp();
      }
    }
    function Np() {
      if (_t === 1) {
        _t = 0;
        var e = Hl, t = oa, r = (t.flags & 13878) !== 0;
        if ((t.subtreeFlags & 13878) !== 0 || r) {
          r = $.T, $.T = null;
          var o = P.p;
          P.p = 2;
          var u = Ge;
          Ge |= 4;
          try {
            hp(t, e);
            var d = Iu, x = vh(e.containerInfo), M = d.focusedElem, I = d.selectionRange;
            if (x !== M && M && M.ownerDocument && bh(M.ownerDocument.documentElement, M)) {
              if (I !== null && sc(M)) {
                var Z = I.start, ee = I.end;
                if (ee === void 0 && (ee = Z), "selectionStart" in M) M.selectionStart = Z, M.selectionEnd = Math.min(ee, M.value.length);
                else {
                  var re = M.ownerDocument || document, K = re && re.defaultView || window;
                  if (K.getSelection) {
                    var F = K.getSelection(), pe = M.textContent.length, Ee = Math.min(I.start, pe), nt = I.end === void 0 ? Ee : Math.min(I.end, pe);
                    !F.extend && Ee > nt && (x = nt, nt = Ee, Ee = x);
                    var V = yh(M, Ee), H = yh(M, nt);
                    if (V && H && (F.rangeCount !== 1 || F.anchorNode !== V.node || F.anchorOffset !== V.offset || F.focusNode !== H.node || F.focusOffset !== H.offset)) {
                      var G = re.createRange();
                      G.setStart(V.node, V.offset), F.removeAllRanges(), Ee > nt ? (F.addRange(G), F.extend(H.node, H.offset)) : (G.setEnd(H.node, H.offset), F.addRange(G));
                    }
                  }
                }
              }
              for (re = [], F = M; F = F.parentNode; ) F.nodeType === 1 && re.push({
                element: F,
                left: F.scrollLeft,
                top: F.scrollTop
              });
              for (typeof M.focus == "function" && M.focus(), M = 0; M < re.length; M++) {
                var ne = re[M];
                ne.element.scrollLeft = ne.left, ne.element.scrollTop = ne.top;
              }
            }
            es = !!zu, Iu = zu = null;
          } finally {
            Ge = u, P.p = o, $.T = r;
          }
        }
        e.current = t, _t = 2;
      }
    }
    function Op() {
      if (_t === 2) {
        _t = 0;
        var e = Hl, t = oa, r = (t.flags & 8772) !== 0;
        if ((t.subtreeFlags & 8772) !== 0 || r) {
          r = $.T, $.T = null;
          var o = P.p;
          P.p = 2;
          var u = Ge;
          Ge |= 4;
          try {
            sp(e, t.alternate, t);
          } finally {
            Ge = u, P.p = o, $.T = r;
          }
        }
        _t = 3;
      }
    }
    function Dp() {
      if (_t === 4 || _t === 3) {
        _t = 0, Ma();
        var e = Hl, t = oa, r = hl, o = Sp;
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? _t = 5 : (_t = 0, oa = Hl = null, zp(e, e.pendingLanes));
        var u = e.pendingLanes;
        if (u === 0 && (Il = null), La(r), t = t.stateNode, Ut && typeof Ut.onCommitFiberRoot == "function") try {
          Ut.onCommitFiberRoot(vl, t, void 0, (t.current.flags & 128) === 128);
        } catch {
        }
        if (o !== null) {
          t = $.T, u = P.p, P.p = 2, $.T = null;
          try {
            for (var d = e.onRecoverableError, x = 0; x < o.length; x++) {
              var M = o[x];
              d(M.value, {
                componentStack: M.stack
              });
            }
          } finally {
            $.T = t, P.p = u;
          }
        }
        (hl & 3) !== 0 && Xi(), Vn(e), u = e.pendingLanes, (r & 261930) !== 0 && (u & 42) !== 0 ? e === Cu ? so++ : (so = 0, Cu = e) : so = 0, co(0);
      }
    }
    function zp(e, t) {
      (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Va(t)));
    }
    function Xi() {
      return Np(), Op(), Dp(), Ip();
    }
    function Ip() {
      if (_t !== 5) return false;
      var e = Hl, t = Su;
      Su = 0;
      var r = La(hl), o = $.T, u = P.p;
      try {
        P.p = 32 > r ? 32 : r, $.T = null, r = wu, wu = null;
        var d = Hl, x = hl;
        if (_t = 0, oa = Hl = null, hl = 0, (Ge & 6) !== 0) throw Error(i(331));
        var M = Ge;
        if (Ge |= 4, bp(d.current), pp(d, d.current, x, r), Ge = M, co(0, false), Ut && typeof Ut.onPostCommitFiberRoot == "function") try {
          Ut.onPostCommitFiberRoot(vl, d);
        } catch {
        }
        return true;
      } finally {
        P.p = u, $.T = o, zp(e, t);
      }
    }
    function Hp(e, t, r) {
      t = gn(r, t), t = tu(e.stateNode, t, 2), e = Al(e, t, 2), e !== null && (rr(e, 2), Vn(e));
    }
    function Fe(e, t, r) {
      if (e.tag === 3) Hp(e, e, r);
      else for (; t !== null; ) {
        if (t.tag === 3) {
          Hp(t, e, r);
          break;
        } else if (t.tag === 1) {
          var o = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Il === null || !Il.has(o))) {
            e = gn(r, e), r = Ym(2), o = Al(t, r, 2), o !== null && (Um(r, o, t, e), rr(o, 2), Vn(o));
            break;
          }
        }
        t = t.return;
      }
    }
    function Mu(e, t, r) {
      var o = e.pingCache;
      if (o === null) {
        o = e.pingCache = new cx();
        var u = /* @__PURE__ */ new Set();
        o.set(t, u);
      } else u = o.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), o.set(t, u));
      u.has(r) || (bu = true, u.add(r), e = mx.bind(null, e, t, r), t.then(e, e));
    }
    function mx(e, t, r) {
      var o = e.pingCache;
      o !== null && o.delete(t), e.pingedLanes |= e.suspendedLanes & r, e.warmLanes &= ~r, rt === e && (Ye & r) === r && (ht === 4 || ht === 3 && (Ye & 62914560) === Ye && 300 > Ct() - zi ? (Ge & 2) === 0 && ia(e, 0) : vu |= r, aa === Ye && (aa = 0)), Vn(e);
    }
    function Yp(e, t) {
      t === 0 && (t = Nr()), e = ur(e, t), e !== null && (rr(e, t), Vn(e));
    }
    function px(e) {
      var t = e.memoizedState, r = 0;
      t !== null && (r = t.retryLane), Yp(e, r);
    }
    function gx(e, t) {
      var r = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var o = e.stateNode, u = e.memoizedState;
          u !== null && (r = u.retryLane);
          break;
        case 19:
          o = e.stateNode;
          break;
        case 22:
          o = e.stateNode._retryCache;
          break;
        default:
          throw Error(i(314));
      }
      o !== null && o.delete(t), Yp(e, r);
    }
    function yx(e, t) {
      return bl(e, t);
    }
    var Vi = null, ca = null, ku = false, $i = false, ju = false, Ul = 0;
    function Vn(e) {
      e !== ca && e.next === null && (ca === null ? Vi = ca = e : ca = ca.next = e), $i = true, ku || (ku = true, vx());
    }
    function co(e, t) {
      if (!ju && $i) {
        ju = true;
        do
          for (var r = false, o = Vi; o !== null; ) {
            if (e !== 0) {
              var u = o.pendingLanes;
              if (u === 0) var d = 0;
              else {
                var x = o.suspendedLanes, M = o.pingedLanes;
                d = (1 << 31 - Bt(42 | e) + 1) - 1, d &= u & ~(x & ~M), d = d & 201326741 ? d & 201326741 | 1 : d ? d | 2 : 0;
              }
              d !== 0 && (r = true, Vp(o, d));
            } else d = Ye, d = xl(o, o === rt ? d : 0, o.cancelPendingCommit !== null || o.timeoutHandle !== -1), (d & 3) === 0 || Kn(o, d) || (r = true, Vp(o, d));
            o = o.next;
          }
        while (r);
        ju = false;
      }
    }
    function bx() {
      Up();
    }
    function Up() {
      $i = ku = false;
      var e = 0;
      Ul !== 0 && Rx() && (e = Ul);
      for (var t = Ct(), r = null, o = Vi; o !== null; ) {
        var u = o.next, d = Bp(o, t);
        d === 0 ? (o.next = null, r === null ? Vi = u : r.next = u, u === null && (ca = r)) : (r = o, (e !== 0 || (d & 3) !== 0) && ($i = true)), o = u;
      }
      _t !== 0 && _t !== 5 || co(e), Ul !== 0 && (Ul = 0);
    }
    function Bp(e, t) {
      for (var r = e.suspendedLanes, o = e.pingedLanes, u = e.expirationTimes, d = e.pendingLanes & -62914561; 0 < d; ) {
        var x = 31 - Bt(d), M = 1 << x, I = u[x];
        I === -1 ? ((M & r) === 0 || (M & o) !== 0) && (u[x] = qo(M, t)) : I <= t && (e.expiredLanes |= M), d &= ~M;
      }
      if (t = rt, r = Ye, r = xl(e, e === t ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), o = e.callbackNode, r === 0 || e === t && (Qe === 2 || Qe === 9) || e.cancelPendingCommit !== null) return o !== null && o !== null && er(o), e.callbackNode = null, e.callbackPriority = 0;
      if ((r & 3) === 0 || Kn(e, r)) {
        if (t = r & -r, t === e.callbackPriority) return t;
        switch (o !== null && er(o), La(r)) {
          case 2:
          case 8:
            r = ja;
            break;
          case 32:
            r = Lr;
            break;
          case 268435456:
            r = Ra;
            break;
          default:
            r = Lr;
        }
        return o = Xp.bind(null, e), r = bl(r, o), e.callbackPriority = t, e.callbackNode = r, t;
      }
      return o !== null && o !== null && er(o), e.callbackPriority = 2, e.callbackNode = null, 2;
    }
    function Xp(e, t) {
      if (_t !== 0 && _t !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
      var r = e.callbackNode;
      if (Xi() && e.callbackNode !== r) return null;
      var o = Ye;
      return o = xl(e, e === rt ? o : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), o === 0 ? null : (Cp(e, o, t), Bp(e, Ct()), e.callbackNode != null && e.callbackNode === r ? Xp.bind(null, e) : null);
    }
    function Vp(e, t) {
      if (Xi()) return null;
      Cp(e, t, true);
    }
    function vx() {
      Ax(function() {
        (Ge & 6) !== 0 ? bl(ka, bx) : Up();
      });
    }
    function Ru() {
      if (Ul === 0) {
        var e = Kr;
        e === 0 && (e = nr, nr <<= 1, (nr & 261888) === 0 && (nr = 256)), Ul = e;
      }
      return Ul;
    }
    function $p(e) {
      return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Wo("" + e);
    }
    function qp(e, t) {
      var r = t.ownerDocument.createElement("input");
      return r.name = t.name, r.value = t.value, e.id && r.setAttribute("form", e.id), t.parentNode.insertBefore(r, t), e = new FormData(e), r.parentNode.removeChild(r), e;
    }
    function xx(e, t, r, o, u) {
      if (t === "submit" && r && r.stateNode === u) {
        var d = $p((u[le] || null).action), x = o.submitter;
        x && (t = (t = x[le] || null) ? $p(t.formAction) : x.getAttribute("formAction"), t !== null && (d = t, x = null));
        var M = new ni("action", "action", null, o, u);
        e.push({
          event: M,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (o.defaultPrevented) {
                  if (Ul !== 0) {
                    var I = x ? qp(u, x) : new FormData(u);
                    Pc(r, {
                      pending: true,
                      data: I,
                      method: u.method,
                      action: d
                    }, null, I);
                  }
                } else typeof d == "function" && (M.preventDefault(), I = x ? qp(u, x) : new FormData(u), Pc(r, {
                  pending: true,
                  data: I,
                  method: u.method,
                  action: d
                }, d, I));
              },
              currentTarget: u
            }
          ]
        });
      }
    }
    for (var Lu = 0; Lu < fc.length; Lu++) {
      var Au = fc[Lu], Sx = Au.toLowerCase(), wx = Au[0].toUpperCase() + Au.slice(1);
      jn(Sx, "on" + wx);
    }
    jn(wh, "onAnimationEnd"), jn(Ch, "onAnimationIteration"), jn(Eh, "onAnimationStart"), jn("dblclick", "onDoubleClick"), jn("focusin", "onFocus"), jn("focusout", "onBlur"), jn(H0, "onTransitionRun"), jn(Y0, "onTransitionStart"), jn(U0, "onTransitionCancel"), jn(_h, "onTransitionEnd"), kn("onMouseEnter", [
      "mouseout",
      "mouseover"
    ]), kn("onMouseLeave", [
      "mouseout",
      "mouseover"
    ]), kn("onPointerEnter", [
      "pointerout",
      "pointerover"
    ]), kn("onPointerLeave", [
      "pointerout",
      "pointerover"
    ]), tn("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), tn("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), tn("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]), tn("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), tn("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), tn("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var uo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Cx = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(uo));
    function Gp(e, t) {
      t = (t & 4) !== 0;
      for (var r = 0; r < e.length; r++) {
        var o = e[r], u = o.event;
        o = o.listeners;
        e: {
          var d = void 0;
          if (t) for (var x = o.length - 1; 0 <= x; x--) {
            var M = o[x], I = M.instance, Z = M.currentTarget;
            if (M = M.listener, I !== d && u.isPropagationStopped()) break e;
            d = M, u.currentTarget = Z;
            try {
              d(u);
            } catch (ee) {
              ai(ee);
            }
            u.currentTarget = null, d = I;
          }
          else for (x = 0; x < o.length; x++) {
            if (M = o[x], I = M.instance, Z = M.currentTarget, M = M.listener, I !== d && u.isPropagationStopped()) break e;
            d = M, u.currentTarget = Z;
            try {
              d(u);
            } catch (ee) {
              ai(ee);
            }
            u.currentTarget = null, d = I;
          }
        }
      }
    }
    function De(e, t) {
      var r = t[We];
      r === void 0 && (r = t[We] = /* @__PURE__ */ new Set());
      var o = e + "__bubble";
      r.has(o) || (Zp(t, e, 2, false), r.add(o));
    }
    function Tu(e, t, r) {
      var o = 0;
      t && (o |= 4), Zp(r, e, o, t);
    }
    var qi = "_reactListening" + Math.random().toString(36).slice(2);
    function Nu(e) {
      if (!e[qi]) {
        e[qi] = true, Mn.forEach(function(r) {
          r !== "selectionchange" && (Cx.has(r) || Tu(r, false, e), Tu(r, true, e));
        });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[qi] || (t[qi] = true, Tu("selectionchange", false, t));
      }
    }
    function Zp(e, t, r, o) {
      switch (wg(t)) {
        case 2:
          var u = Fx;
          break;
        case 8:
          u = Wx;
          break;
        default:
          u = Ku;
      }
      r = u.bind(null, t, r, e), u = void 0, !Js || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = true), o ? u !== void 0 ? e.addEventListener(t, r, {
        capture: true,
        passive: u
      }) : e.addEventListener(t, r, true) : u !== void 0 ? e.addEventListener(t, r, {
        passive: u
      }) : e.addEventListener(t, r, false);
    }
    function Ou(e, t, r, o, u) {
      var d = o;
      if ((t & 1) === 0 && (t & 2) === 0 && o !== null) e: for (; ; ) {
        if (o === null) return;
        var x = o.tag;
        if (x === 3 || x === 4) {
          var M = o.stateNode.containerInfo;
          if (M === u) break;
          if (x === 4) for (x = o.return; x !== null; ) {
            var I = x.tag;
            if ((I === 3 || I === 4) && x.stateNode.containerInfo === u) return;
            x = x.return;
          }
          for (; M !== null; ) {
            if (x = Pe(M), x === null) return;
            if (I = x.tag, I === 5 || I === 6 || I === 26 || I === 27) {
              o = d = x;
              continue e;
            }
            M = M.parentNode;
          }
        }
        o = o.return;
      }
      Wf(function() {
        var Z = d, ee = Fs(r), re = [];
        e: {
          var K = Mh.get(e);
          if (K !== void 0) {
            var F = ni, pe = e;
            switch (e) {
              case "keypress":
                if (ei(r) === 0) break e;
              case "keydown":
              case "keyup":
                F = g0;
                break;
              case "focusin":
                pe = "focus", F = lc;
                break;
              case "focusout":
                pe = "blur", F = lc;
                break;
              case "beforeblur":
              case "afterblur":
                F = lc;
                break;
              case "click":
                if (r.button === 2) break e;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                F = th;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                F = r0;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                F = v0;
                break;
              case wh:
              case Ch:
              case Eh:
                F = i0;
                break;
              case _h:
                F = S0;
                break;
              case "scroll":
              case "scrollend":
                F = n0;
                break;
              case "wheel":
                F = C0;
                break;
              case "copy":
              case "cut":
              case "paste":
                F = c0;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                F = lh;
                break;
              case "toggle":
              case "beforetoggle":
                F = _0;
            }
            var Ee = (t & 4) !== 0, nt = !Ee && (e === "scroll" || e === "scrollend"), V = Ee ? K !== null ? K + "Capture" : null : K;
            Ee = [];
            for (var H = Z, G; H !== null; ) {
              var ne = H;
              if (G = ne.stateNode, ne = ne.tag, ne !== 5 && ne !== 26 && ne !== 27 || G === null || V === null || (ne = Ta(H, V), ne != null && Ee.push(fo(H, ne, G))), nt) break;
              H = H.return;
            }
            0 < Ee.length && (K = new F(K, pe, null, r, ee), re.push({
              event: K,
              listeners: Ee
            }));
          }
        }
        if ((t & 7) === 0) {
          e: {
            if (K = e === "mouseover" || e === "pointerover", F = e === "mouseout" || e === "pointerout", K && r !== Qs && (pe = r.relatedTarget || r.fromElement) && (Pe(pe) || pe[_e])) break e;
            if ((F || K) && (K = ee.window === ee ? ee : (K = ee.ownerDocument) ? K.defaultView || K.parentWindow : window, F ? (pe = r.relatedTarget || r.toElement, F = Z, pe = pe ? Pe(pe) : null, pe !== null && (nt = c(pe), Ee = pe.tag, pe !== nt || Ee !== 5 && Ee !== 27 && Ee !== 6) && (pe = null)) : (F = null, pe = Z), F !== pe)) {
              if (Ee = th, ne = "onMouseLeave", V = "onMouseEnter", H = "mouse", (e === "pointerout" || e === "pointerover") && (Ee = lh, ne = "onPointerLeave", V = "onPointerEnter", H = "pointer"), nt = F == null ? K : Lt(F), G = pe == null ? K : Lt(pe), K = new Ee(ne, H + "leave", F, r, ee), K.target = nt, K.relatedTarget = G, ne = null, Pe(ee) === Z && (Ee = new Ee(V, H + "enter", pe, r, ee), Ee.target = G, Ee.relatedTarget = nt, ne = Ee), nt = ne, F && pe) t: {
                for (Ee = Ex, V = F, H = pe, G = 0, ne = V; ne; ne = Ee(ne)) G++;
                ne = 0;
                for (var we = H; we; we = Ee(we)) ne++;
                for (; 0 < G - ne; ) V = Ee(V), G--;
                for (; 0 < ne - G; ) H = Ee(H), ne--;
                for (; G--; ) {
                  if (V === H || H !== null && V === H.alternate) {
                    Ee = V;
                    break t;
                  }
                  V = Ee(V), H = Ee(H);
                }
                Ee = null;
              }
              else Ee = null;
              F !== null && Kp(re, K, F, Ee, false), pe !== null && nt !== null && Kp(re, nt, pe, Ee, true);
            }
          }
          e: {
            if (K = Z ? Lt(Z) : window, F = K.nodeName && K.nodeName.toLowerCase(), F === "select" || F === "input" && K.type === "file") var $e = dh;
            else if (ch(K)) if (fh) $e = D0;
            else {
              $e = N0;
              var ge = T0;
            }
            else F = K.nodeName, !F || F.toLowerCase() !== "input" || K.type !== "checkbox" && K.type !== "radio" ? Z && Ps(Z.elementType) && ($e = dh) : $e = O0;
            if ($e && ($e = $e(e, Z))) {
              uh(re, $e, r, ee);
              break e;
            }
            ge && ge(e, K, Z), e === "focusout" && Z && K.type === "number" && Z.memoizedProps.value != null && Ks(K, "number", K.value);
          }
          switch (ge = Z ? Lt(Z) : window, e) {
            case "focusin":
              (ch(ge) || ge.contentEditable === "true") && (Ur = ge, cc = Z, Ua = null);
              break;
            case "focusout":
              Ua = cc = Ur = null;
              break;
            case "mousedown":
              uc = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              uc = false, xh(re, r, ee);
              break;
            case "selectionchange":
              if (I0) break;
            case "keydown":
            case "keyup":
              xh(re, r, ee);
          }
          var Ae;
          if (ac) e: {
            switch (e) {
              case "compositionstart":
                var Ue = "onCompositionStart";
                break e;
              case "compositionend":
                Ue = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Ue = "onCompositionUpdate";
                break e;
            }
            Ue = void 0;
          }
          else Yr ? ih(e, r) && (Ue = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (Ue = "onCompositionStart");
          Ue && (rh && r.locale !== "ko" && (Yr || Ue !== "onCompositionStart" ? Ue === "onCompositionEnd" && Yr && (Ae = Jf()) : (El = ee, ec = "value" in El ? El.value : El.textContent, Yr = true)), ge = Gi(Z, Ue), 0 < ge.length && (Ue = new nh(Ue, e, null, r, ee), re.push({
            event: Ue,
            listeners: ge
          }), Ae ? Ue.data = Ae : (Ae = sh(r), Ae !== null && (Ue.data = Ae)))), (Ae = k0 ? j0(e, r) : R0(e, r)) && (Ue = Gi(Z, "onBeforeInput"), 0 < Ue.length && (ge = new nh("onBeforeInput", "beforeinput", null, r, ee), re.push({
            event: ge,
            listeners: Ue
          }), ge.data = Ae)), xx(re, e, Z, r, ee);
        }
        Gp(re, t);
      });
    }
    function fo(e, t, r) {
      return {
        instance: e,
        listener: t,
        currentTarget: r
      };
    }
    function Gi(e, t) {
      for (var r = t + "Capture", o = []; e !== null; ) {
        var u = e, d = u.stateNode;
        if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || d === null || (u = Ta(e, r), u != null && o.unshift(fo(e, u, d)), u = Ta(e, t), u != null && o.push(fo(e, u, d))), e.tag === 3) return o;
        e = e.return;
      }
      return [];
    }
    function Ex(e) {
      if (e === null) return null;
      do
        e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function Kp(e, t, r, o, u) {
      for (var d = t._reactName, x = []; r !== null && r !== o; ) {
        var M = r, I = M.alternate, Z = M.stateNode;
        if (M = M.tag, I !== null && I === o) break;
        M !== 5 && M !== 26 && M !== 27 || Z === null || (I = Z, u ? (Z = Ta(r, d), Z != null && x.unshift(fo(r, Z, I))) : u || (Z = Ta(r, d), Z != null && x.push(fo(r, Z, I)))), r = r.return;
      }
      x.length !== 0 && e.push({
        event: t,
        listeners: x
      });
    }
    var _x = /\r\n?/g, Mx = /\u0000|\uFFFD/g;
    function Pp(e) {
      return (typeof e == "string" ? e : "" + e).replace(_x, `
`).replace(Mx, "");
    }
    function Qp(e, t) {
      return t = Pp(t), Pp(e) === t;
    }
    function tt(e, t, r, o, u, d) {
      switch (r) {
        case "children":
          typeof o == "string" ? t === "body" || t === "textarea" && o === "" || zr(e, o) : (typeof o == "number" || typeof o == "bigint") && t !== "body" && zr(e, "" + o);
          break;
        case "className":
          Fn(e, "class", o);
          break;
        case "tabIndex":
          Fn(e, "tabindex", o);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          Fn(e, r, o);
          break;
        case "style":
          Qf(e, o, d);
          break;
        case "data":
          if (t !== "object") {
            Fn(e, "data", o);
            break;
          }
        case "src":
        case "href":
          if (o === "" && (t !== "a" || r !== "href")) {
            e.removeAttribute(r);
            break;
          }
          if (o == null || typeof o == "function" || typeof o == "symbol" || typeof o == "boolean") {
            e.removeAttribute(r);
            break;
          }
          o = Wo("" + o), e.setAttribute(r, o);
          break;
        case "action":
        case "formAction":
          if (typeof o == "function") {
            e.setAttribute(r, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
            break;
          } else typeof d == "function" && (r === "formAction" ? (t !== "input" && tt(e, t, "name", u.name, u, null), tt(e, t, "formEncType", u.formEncType, u, null), tt(e, t, "formMethod", u.formMethod, u, null), tt(e, t, "formTarget", u.formTarget, u, null)) : (tt(e, t, "encType", u.encType, u, null), tt(e, t, "method", u.method, u, null), tt(e, t, "target", u.target, u, null)));
          if (o == null || typeof o == "symbol" || typeof o == "boolean") {
            e.removeAttribute(r);
            break;
          }
          o = Wo("" + o), e.setAttribute(r, o);
          break;
        case "onClick":
          o != null && (e.onclick = Wn);
          break;
        case "onScroll":
          o != null && De("scroll", e);
          break;
        case "onScrollEnd":
          o != null && De("scrollend", e);
          break;
        case "dangerouslySetInnerHTML":
          if (o != null) {
            if (typeof o != "object" || !("__html" in o)) throw Error(i(61));
            if (r = o.__html, r != null) {
              if (u.children != null) throw Error(i(60));
              e.innerHTML = r;
            }
          }
          break;
        case "multiple":
          e.multiple = o && typeof o != "function" && typeof o != "symbol";
          break;
        case "muted":
          e.muted = o && typeof o != "function" && typeof o != "symbol";
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
          if (o == null || typeof o == "function" || typeof o == "boolean" || typeof o == "symbol") {
            e.removeAttribute("xlink:href");
            break;
          }
          r = Wo("" + o), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", r);
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          o != null && typeof o != "function" && typeof o != "symbol" ? e.setAttribute(r, "" + o) : e.removeAttribute(r);
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
          o && typeof o != "function" && typeof o != "symbol" ? e.setAttribute(r, "") : e.removeAttribute(r);
          break;
        case "capture":
        case "download":
          o === true ? e.setAttribute(r, "") : o !== false && o != null && typeof o != "function" && typeof o != "symbol" ? e.setAttribute(r, o) : e.removeAttribute(r);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          o != null && typeof o != "function" && typeof o != "symbol" && !isNaN(o) && 1 <= o ? e.setAttribute(r, o) : e.removeAttribute(r);
          break;
        case "rowSpan":
        case "start":
          o == null || typeof o == "function" || typeof o == "symbol" || isNaN(o) ? e.removeAttribute(r) : e.setAttribute(r, o);
          break;
        case "popover":
          De("beforetoggle", e), De("toggle", e), or(e, "popover", o);
          break;
        case "xlinkActuate":
          Gt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", o);
          break;
        case "xlinkArcrole":
          Gt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", o);
          break;
        case "xlinkRole":
          Gt(e, "http://www.w3.org/1999/xlink", "xlink:role", o);
          break;
        case "xlinkShow":
          Gt(e, "http://www.w3.org/1999/xlink", "xlink:show", o);
          break;
        case "xlinkTitle":
          Gt(e, "http://www.w3.org/1999/xlink", "xlink:title", o);
          break;
        case "xlinkType":
          Gt(e, "http://www.w3.org/1999/xlink", "xlink:type", o);
          break;
        case "xmlBase":
          Gt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", o);
          break;
        case "xmlLang":
          Gt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", o);
          break;
        case "xmlSpace":
          Gt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", o);
          break;
        case "is":
          or(e, "is", o);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          (!(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (r = e0.get(r) || r, or(e, r, o));
      }
    }
    function Du(e, t, r, o, u, d) {
      switch (r) {
        case "style":
          Qf(e, o, d);
          break;
        case "dangerouslySetInnerHTML":
          if (o != null) {
            if (typeof o != "object" || !("__html" in o)) throw Error(i(61));
            if (r = o.__html, r != null) {
              if (u.children != null) throw Error(i(60));
              e.innerHTML = r;
            }
          }
          break;
        case "children":
          typeof o == "string" ? zr(e, o) : (typeof o == "number" || typeof o == "bigint") && zr(e, "" + o);
          break;
        case "onScroll":
          o != null && De("scroll", e);
          break;
        case "onScrollEnd":
          o != null && De("scrollend", e);
          break;
        case "onClick":
          o != null && (e.onclick = Wn);
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
          if (!Sl.hasOwnProperty(r)) e: {
            if (r[0] === "o" && r[1] === "n" && (u = r.endsWith("Capture"), t = r.slice(2, u ? r.length - 7 : void 0), d = e[le] || null, d = d != null ? d[r] : null, typeof d == "function" && e.removeEventListener(t, d, u), typeof o == "function")) {
              typeof d != "function" && d !== null && (r in e ? e[r] = null : e.hasAttribute(r) && e.removeAttribute(r)), e.addEventListener(t, o, u);
              break e;
            }
            r in e ? e[r] = o : o === true ? e.setAttribute(r, "") : or(e, r, o);
          }
      }
    }
    function Ot(e, t, r) {
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
          De("error", e), De("load", e);
          var o = false, u = false, d;
          for (d in r) if (r.hasOwnProperty(d)) {
            var x = r[d];
            if (x != null) switch (d) {
              case "src":
                o = true;
                break;
              case "srcSet":
                u = true;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(i(137, t));
              default:
                tt(e, t, d, x, r, null);
            }
          }
          u && tt(e, t, "srcSet", r.srcSet, r, null), o && tt(e, t, "src", r.src, r, null);
          return;
        case "input":
          De("invalid", e);
          var M = d = x = u = null, I = null, Z = null;
          for (o in r) if (r.hasOwnProperty(o)) {
            var ee = r[o];
            if (ee != null) switch (o) {
              case "name":
                u = ee;
                break;
              case "type":
                x = ee;
                break;
              case "checked":
                I = ee;
                break;
              case "defaultChecked":
                Z = ee;
                break;
              case "value":
                d = ee;
                break;
              case "defaultValue":
                M = ee;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (ee != null) throw Error(i(137, t));
                break;
              default:
                tt(e, t, o, ee, r, null);
            }
          }
          Gf(e, d, M, I, Z, x, u, false);
          return;
        case "select":
          De("invalid", e), o = x = d = null;
          for (u in r) if (r.hasOwnProperty(u) && (M = r[u], M != null)) switch (u) {
            case "value":
              d = M;
              break;
            case "defaultValue":
              x = M;
              break;
            case "multiple":
              o = M;
            default:
              tt(e, t, u, M, r, null);
          }
          t = d, r = x, e.multiple = !!o, t != null ? Dr(e, !!o, t, false) : r != null && Dr(e, !!o, r, true);
          return;
        case "textarea":
          De("invalid", e), d = u = o = null;
          for (x in r) if (r.hasOwnProperty(x) && (M = r[x], M != null)) switch (x) {
            case "value":
              o = M;
              break;
            case "defaultValue":
              u = M;
              break;
            case "children":
              d = M;
              break;
            case "dangerouslySetInnerHTML":
              if (M != null) throw Error(i(91));
              break;
            default:
              tt(e, t, x, M, r, null);
          }
          Kf(e, o, u, d);
          return;
        case "option":
          for (I in r) if (r.hasOwnProperty(I) && (o = r[I], o != null)) switch (I) {
            case "selected":
              e.selected = o && typeof o != "function" && typeof o != "symbol";
              break;
            default:
              tt(e, t, I, o, r, null);
          }
          return;
        case "dialog":
          De("beforetoggle", e), De("toggle", e), De("cancel", e), De("close", e);
          break;
        case "iframe":
        case "object":
          De("load", e);
          break;
        case "video":
        case "audio":
          for (o = 0; o < uo.length; o++) De(uo[o], e);
          break;
        case "image":
          De("error", e), De("load", e);
          break;
        case "details":
          De("toggle", e);
          break;
        case "embed":
        case "source":
        case "link":
          De("error", e), De("load", e);
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
          for (Z in r) if (r.hasOwnProperty(Z) && (o = r[Z], o != null)) switch (Z) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(i(137, t));
            default:
              tt(e, t, Z, o, r, null);
          }
          return;
        default:
          if (Ps(t)) {
            for (ee in r) r.hasOwnProperty(ee) && (o = r[ee], o !== void 0 && Du(e, t, ee, o, r, void 0));
            return;
          }
      }
      for (M in r) r.hasOwnProperty(M) && (o = r[M], o != null && tt(e, t, M, o, r, null));
    }
    function kx(e, t, r, o) {
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
          var u = null, d = null, x = null, M = null, I = null, Z = null, ee = null;
          for (F in r) {
            var re = r[F];
            if (r.hasOwnProperty(F) && re != null) switch (F) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                I = re;
              default:
                o.hasOwnProperty(F) || tt(e, t, F, null, o, re);
            }
          }
          for (var K in o) {
            var F = o[K];
            if (re = r[K], o.hasOwnProperty(K) && (F != null || re != null)) switch (K) {
              case "type":
                d = F;
                break;
              case "name":
                u = F;
                break;
              case "checked":
                Z = F;
                break;
              case "defaultChecked":
                ee = F;
                break;
              case "value":
                x = F;
                break;
              case "defaultValue":
                M = F;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (F != null) throw Error(i(137, t));
                break;
              default:
                F !== re && tt(e, t, K, F, o, re);
            }
          }
          Zs(e, x, M, I, Z, ee, d, u);
          return;
        case "select":
          F = x = M = K = null;
          for (d in r) if (I = r[d], r.hasOwnProperty(d) && I != null) switch (d) {
            case "value":
              break;
            case "multiple":
              F = I;
            default:
              o.hasOwnProperty(d) || tt(e, t, d, null, o, I);
          }
          for (u in o) if (d = o[u], I = r[u], o.hasOwnProperty(u) && (d != null || I != null)) switch (u) {
            case "value":
              K = d;
              break;
            case "defaultValue":
              M = d;
              break;
            case "multiple":
              x = d;
            default:
              d !== I && tt(e, t, u, d, o, I);
          }
          t = M, r = x, o = F, K != null ? Dr(e, !!r, K, false) : !!o != !!r && (t != null ? Dr(e, !!r, t, true) : Dr(e, !!r, r ? [] : "", false));
          return;
        case "textarea":
          F = K = null;
          for (M in r) if (u = r[M], r.hasOwnProperty(M) && u != null && !o.hasOwnProperty(M)) switch (M) {
            case "value":
              break;
            case "children":
              break;
            default:
              tt(e, t, M, null, o, u);
          }
          for (x in o) if (u = o[x], d = r[x], o.hasOwnProperty(x) && (u != null || d != null)) switch (x) {
            case "value":
              K = u;
              break;
            case "defaultValue":
              F = u;
              break;
            case "children":
              break;
            case "dangerouslySetInnerHTML":
              if (u != null) throw Error(i(91));
              break;
            default:
              u !== d && tt(e, t, x, u, o, d);
          }
          Zf(e, K, F);
          return;
        case "option":
          for (var pe in r) if (K = r[pe], r.hasOwnProperty(pe) && K != null && !o.hasOwnProperty(pe)) switch (pe) {
            case "selected":
              e.selected = false;
              break;
            default:
              tt(e, t, pe, null, o, K);
          }
          for (I in o) if (K = o[I], F = r[I], o.hasOwnProperty(I) && K !== F && (K != null || F != null)) switch (I) {
            case "selected":
              e.selected = K && typeof K != "function" && typeof K != "symbol";
              break;
            default:
              tt(e, t, I, K, o, F);
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
          for (var Ee in r) K = r[Ee], r.hasOwnProperty(Ee) && K != null && !o.hasOwnProperty(Ee) && tt(e, t, Ee, null, o, K);
          for (Z in o) if (K = o[Z], F = r[Z], o.hasOwnProperty(Z) && K !== F && (K != null || F != null)) switch (Z) {
            case "children":
            case "dangerouslySetInnerHTML":
              if (K != null) throw Error(i(137, t));
              break;
            default:
              tt(e, t, Z, K, o, F);
          }
          return;
        default:
          if (Ps(t)) {
            for (var nt in r) K = r[nt], r.hasOwnProperty(nt) && K !== void 0 && !o.hasOwnProperty(nt) && Du(e, t, nt, void 0, o, K);
            for (ee in o) K = o[ee], F = r[ee], !o.hasOwnProperty(ee) || K === F || K === void 0 && F === void 0 || Du(e, t, ee, K, o, F);
            return;
          }
      }
      for (var V in r) K = r[V], r.hasOwnProperty(V) && K != null && !o.hasOwnProperty(V) && tt(e, t, V, null, o, K);
      for (re in o) K = o[re], F = r[re], !o.hasOwnProperty(re) || K === F || K == null && F == null || tt(e, t, re, K, o, F);
    }
    function Fp(e) {
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
    function jx() {
      if (typeof performance.getEntriesByType == "function") {
        for (var e = 0, t = 0, r = performance.getEntriesByType("resource"), o = 0; o < r.length; o++) {
          var u = r[o], d = u.transferSize, x = u.initiatorType, M = u.duration;
          if (d && M && Fp(x)) {
            for (x = 0, M = u.responseEnd, o += 1; o < r.length; o++) {
              var I = r[o], Z = I.startTime;
              if (Z > M) break;
              var ee = I.transferSize, re = I.initiatorType;
              ee && Fp(re) && (I = I.responseEnd, x += ee * (I < M ? 1 : (M - Z) / (I - Z)));
            }
            if (--o, t += 8 * (d + x) / (u.duration / 1e3), e++, 10 < e) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
    }
    var zu = null, Iu = null;
    function Zi(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Wp(e) {
      switch (e) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function Jp(e, t) {
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
    function Hu(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    var Yu = null;
    function Rx() {
      var e = window.event;
      return e && e.type === "popstate" ? e === Yu ? false : (Yu = e, true) : (Yu = null, false);
    }
    var eg = typeof setTimeout == "function" ? setTimeout : void 0, Lx = typeof clearTimeout == "function" ? clearTimeout : void 0, tg = typeof Promise == "function" ? Promise : void 0, Ax = typeof queueMicrotask == "function" ? queueMicrotask : typeof tg < "u" ? function(e) {
      return tg.resolve(null).then(e).catch(Tx);
    } : eg;
    function Tx(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function Bl(e) {
      return e === "head";
    }
    function ng(e, t) {
      var r = t, o = 0;
      do {
        var u = r.nextSibling;
        if (e.removeChild(r), u && u.nodeType === 8) if (r = u.data, r === "/$" || r === "/&") {
          if (o === 0) {
            e.removeChild(u), ha(t);
            return;
          }
          o--;
        } else if (r === "$" || r === "$?" || r === "$~" || r === "$!" || r === "&") o++;
        else if (r === "html") ho(e.ownerDocument.documentElement);
        else if (r === "head") {
          r = e.ownerDocument.head, ho(r);
          for (var d = r.firstChild; d; ) {
            var x = d.nextSibling, M = d.nodeName;
            d[Ze] || M === "SCRIPT" || M === "STYLE" || M === "LINK" && d.rel.toLowerCase() === "stylesheet" || r.removeChild(d), d = x;
          }
        } else r === "body" && ho(e.ownerDocument.body);
        r = u;
      } while (r);
      ha(t);
    }
    function lg(e, t) {
      var r = e;
      e = 0;
      do {
        var o = r.nextSibling;
        if (r.nodeType === 1 ? t ? (r._stashedDisplay = r.style.display, r.style.display = "none") : (r.style.display = r._stashedDisplay || "", r.getAttribute("style") === "" && r.removeAttribute("style")) : r.nodeType === 3 && (t ? (r._stashedText = r.nodeValue, r.nodeValue = "") : r.nodeValue = r._stashedText || ""), o && o.nodeType === 8) if (r = o.data, r === "/$") {
          if (e === 0) break;
          e--;
        } else r !== "$" && r !== "$?" && r !== "$~" && r !== "$!" || e++;
        r = o;
      } while (r);
    }
    function Uu(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var r = t;
        switch (t = t.nextSibling, r.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            Uu(r), lt(r);
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if (r.rel.toLowerCase() === "stylesheet") continue;
        }
        e.removeChild(r);
      }
    }
    function Nx(e, t, r, o) {
      for (; e.nodeType === 1; ) {
        var u = r;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!o && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
        } else if (o) {
          if (!e[Ze]) switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (d = e.getAttribute("rel"), d === "stylesheet" && e.hasAttribute("data-precedence")) break;
              if (d !== u.rel || e.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || e.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || e.getAttribute("title") !== (u.title == null ? null : u.title)) break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (d = e.getAttribute("src"), (d !== (u.src == null ? null : u.src) || e.getAttribute("type") !== (u.type == null ? null : u.type) || e.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && d && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
              return e;
            default:
              return e;
          }
        } else if (t === "input" && e.type === "hidden") {
          var d = u.name == null ? null : "" + u.name;
          if (u.type === "hidden" && e.getAttribute("name") === d) return e;
        } else return e;
        if (e = Sn(e.nextSibling), e === null) break;
      }
      return null;
    }
    function Ox(e, t, r) {
      if (t === "") return null;
      for (; e.nodeType !== 3; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !r || (e = Sn(e.nextSibling), e === null)) return null;
      return e;
    }
    function rg(e, t) {
      for (; e.nodeType !== 8; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Sn(e.nextSibling), e === null)) return null;
      return e;
    }
    function Bu(e) {
      return e.data === "$?" || e.data === "$~";
    }
    function Xu(e) {
      return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
    }
    function Dx(e, t) {
      var r = e.ownerDocument;
      if (e.data === "$~") e._reactRetry = t;
      else if (e.data !== "$?" || r.readyState !== "loading") t();
      else {
        var o = function() {
          t(), r.removeEventListener("DOMContentLoaded", o);
        };
        r.addEventListener("DOMContentLoaded", o), e._reactRetry = o;
      }
    }
    function Sn(e) {
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
    var Vu = null;
    function ag(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var r = e.data;
          if (r === "/$" || r === "/&") {
            if (t === 0) return Sn(e.nextSibling);
            t--;
          } else r !== "$" && r !== "$!" && r !== "$?" && r !== "$~" && r !== "&" || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function og(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var r = e.data;
          if (r === "$" || r === "$!" || r === "$?" || r === "$~" || r === "&") {
            if (t === 0) return e;
            t--;
          } else r !== "/$" && r !== "/&" || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function ig(e, t, r) {
      switch (t = Zi(r), e) {
        case "html":
          if (e = t.documentElement, !e) throw Error(i(452));
          return e;
        case "head":
          if (e = t.head, !e) throw Error(i(453));
          return e;
        case "body":
          if (e = t.body, !e) throw Error(i(454));
          return e;
        default:
          throw Error(i(451));
      }
    }
    function ho(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      lt(e);
    }
    var wn = /* @__PURE__ */ new Map(), sg = /* @__PURE__ */ new Set();
    function Ki(e) {
      return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
    }
    var ml = P.d;
    P.d = {
      f: zx,
      r: Ix,
      D: Hx,
      C: Yx,
      L: Ux,
      m: Bx,
      X: Vx,
      S: Xx,
      M: $x
    };
    function zx() {
      var e = ml.f(), t = Yi();
      return e || t;
    }
    function Ix(e) {
      var t = at(e);
      t !== null && t.tag === 5 && t.type === "form" ? _m(t) : ml.r(e);
    }
    var ua = typeof document > "u" ? null : document;
    function cg(e, t, r) {
      var o = ua;
      if (o && typeof t == "string" && t) {
        var u = mn(t);
        u = 'link[rel="' + e + '"][href="' + u + '"]', typeof r == "string" && (u += '[crossorigin="' + r + '"]'), sg.has(u) || (sg.add(u), e = {
          rel: e,
          crossOrigin: r,
          href: t
        }, o.querySelector(u) === null && (t = o.createElement("link"), Ot(t, "link", e), Je(t), o.head.appendChild(t)));
      }
    }
    function Hx(e) {
      ml.D(e), cg("dns-prefetch", e, null);
    }
    function Yx(e, t) {
      ml.C(e, t), cg("preconnect", e, t);
    }
    function Ux(e, t, r) {
      ml.L(e, t, r);
      var o = ua;
      if (o && e && t) {
        var u = 'link[rel="preload"][as="' + mn(t) + '"]';
        t === "image" && r && r.imageSrcSet ? (u += '[imagesrcset="' + mn(r.imageSrcSet) + '"]', typeof r.imageSizes == "string" && (u += '[imagesizes="' + mn(r.imageSizes) + '"]')) : u += '[href="' + mn(e) + '"]';
        var d = u;
        switch (t) {
          case "style":
            d = da(e);
            break;
          case "script":
            d = fa(e);
        }
        wn.has(d) || (e = y({
          rel: "preload",
          href: t === "image" && r && r.imageSrcSet ? void 0 : e,
          as: t
        }, r), wn.set(d, e), o.querySelector(u) !== null || t === "style" && o.querySelector(mo(d)) || t === "script" && o.querySelector(po(d)) || (t = o.createElement("link"), Ot(t, "link", e), Je(t), o.head.appendChild(t)));
      }
    }
    function Bx(e, t) {
      ml.m(e, t);
      var r = ua;
      if (r && e) {
        var o = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + mn(o) + '"][href="' + mn(e) + '"]', d = u;
        switch (o) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            d = fa(e);
        }
        if (!wn.has(d) && (e = y({
          rel: "modulepreload",
          href: e
        }, t), wn.set(d, e), r.querySelector(u) === null)) {
          switch (o) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (r.querySelector(po(d))) return;
          }
          o = r.createElement("link"), Ot(o, "link", e), Je(o), r.head.appendChild(o);
        }
      }
    }
    function Xx(e, t, r) {
      ml.S(e, t, r);
      var o = ua;
      if (o && e) {
        var u = kt(o).hoistableStyles, d = da(e);
        t = t || "default";
        var x = u.get(d);
        if (!x) {
          var M = {
            loading: 0,
            preload: null
          };
          if (x = o.querySelector(mo(d))) M.loading = 5;
          else {
            e = y({
              rel: "stylesheet",
              href: e,
              "data-precedence": t
            }, r), (r = wn.get(d)) && $u(e, r);
            var I = x = o.createElement("link");
            Je(I), Ot(I, "link", e), I._p = new Promise(function(Z, ee) {
              I.onload = Z, I.onerror = ee;
            }), I.addEventListener("load", function() {
              M.loading |= 1;
            }), I.addEventListener("error", function() {
              M.loading |= 2;
            }), M.loading |= 4, Pi(x, t, o);
          }
          x = {
            type: "stylesheet",
            instance: x,
            count: 1,
            state: M
          }, u.set(d, x);
        }
      }
    }
    function Vx(e, t) {
      ml.X(e, t);
      var r = ua;
      if (r && e) {
        var o = kt(r).hoistableScripts, u = fa(e), d = o.get(u);
        d || (d = r.querySelector(po(u)), d || (e = y({
          src: e,
          async: true
        }, t), (t = wn.get(u)) && qu(e, t), d = r.createElement("script"), Je(d), Ot(d, "link", e), r.head.appendChild(d)), d = {
          type: "script",
          instance: d,
          count: 1,
          state: null
        }, o.set(u, d));
      }
    }
    function $x(e, t) {
      ml.M(e, t);
      var r = ua;
      if (r && e) {
        var o = kt(r).hoistableScripts, u = fa(e), d = o.get(u);
        d || (d = r.querySelector(po(u)), d || (e = y({
          src: e,
          async: true,
          type: "module"
        }, t), (t = wn.get(u)) && qu(e, t), d = r.createElement("script"), Je(d), Ot(d, "link", e), r.head.appendChild(d)), d = {
          type: "script",
          instance: d,
          count: 1,
          state: null
        }, o.set(u, d));
      }
    }
    function ug(e, t, r, o) {
      var u = (u = Q.current) ? Ki(u) : null;
      if (!u) throw Error(i(446));
      switch (e) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof r.precedence == "string" && typeof r.href == "string" ? (t = da(r.href), r = kt(u).hoistableStyles, o = r.get(t), o || (o = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, r.set(t, o)), o) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        case "link":
          if (r.rel === "stylesheet" && typeof r.href == "string" && typeof r.precedence == "string") {
            e = da(r.href);
            var d = kt(u).hoistableStyles, x = d.get(e);
            if (x || (u = u.ownerDocument || u, x = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: {
                loading: 0,
                preload: null
              }
            }, d.set(e, x), (d = u.querySelector(mo(e))) && !d._p && (x.instance = d, x.state.loading = 5), wn.has(e) || (r = {
              rel: "preload",
              as: "style",
              href: r.href,
              crossOrigin: r.crossOrigin,
              integrity: r.integrity,
              media: r.media,
              hrefLang: r.hrefLang,
              referrerPolicy: r.referrerPolicy
            }, wn.set(e, r), d || qx(u, e, r, x.state))), t && o === null) throw Error(i(528, ""));
            return x;
          }
          if (t && o !== null) throw Error(i(529, ""));
          return null;
        case "script":
          return t = r.async, r = r.src, typeof r == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = fa(r), r = kt(u).hoistableScripts, o = r.get(t), o || (o = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, r.set(t, o)), o) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        default:
          throw Error(i(444, e));
      }
    }
    function da(e) {
      return 'href="' + mn(e) + '"';
    }
    function mo(e) {
      return 'link[rel="stylesheet"][' + e + "]";
    }
    function dg(e) {
      return y({}, e, {
        "data-precedence": e.precedence,
        precedence: null
      });
    }
    function qx(e, t, r, o) {
      e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? o.loading = 1 : (t = e.createElement("link"), o.preload = t, t.addEventListener("load", function() {
        return o.loading |= 1;
      }), t.addEventListener("error", function() {
        return o.loading |= 2;
      }), Ot(t, "link", r), Je(t), e.head.appendChild(t));
    }
    function fa(e) {
      return '[src="' + mn(e) + '"]';
    }
    function po(e) {
      return "script[async]" + e;
    }
    function fg(e, t, r) {
      if (t.count++, t.instance === null) switch (t.type) {
        case "style":
          var o = e.querySelector('style[data-href~="' + mn(r.href) + '"]');
          if (o) return t.instance = o, Je(o), o;
          var u = y({}, r, {
            "data-href": r.href,
            "data-precedence": r.precedence,
            href: null,
            precedence: null
          });
          return o = (e.ownerDocument || e).createElement("style"), Je(o), Ot(o, "style", u), Pi(o, r.precedence, e), t.instance = o;
        case "stylesheet":
          u = da(r.href);
          var d = e.querySelector(mo(u));
          if (d) return t.state.loading |= 4, t.instance = d, Je(d), d;
          o = dg(r), (u = wn.get(u)) && $u(o, u), d = (e.ownerDocument || e).createElement("link"), Je(d);
          var x = d;
          return x._p = new Promise(function(M, I) {
            x.onload = M, x.onerror = I;
          }), Ot(d, "link", o), t.state.loading |= 4, Pi(d, r.precedence, e), t.instance = d;
        case "script":
          return d = fa(r.src), (u = e.querySelector(po(d))) ? (t.instance = u, Je(u), u) : (o = r, (u = wn.get(d)) && (o = y({}, r), qu(o, u)), e = e.ownerDocument || e, u = e.createElement("script"), Je(u), Ot(u, "link", o), e.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(i(443, t.type));
      }
      else t.type === "stylesheet" && (t.state.loading & 4) === 0 && (o = t.instance, t.state.loading |= 4, Pi(o, r.precedence, e));
      return t.instance;
    }
    function Pi(e, t, r) {
      for (var o = r.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), u = o.length ? o[o.length - 1] : null, d = u, x = 0; x < o.length; x++) {
        var M = o[x];
        if (M.dataset.precedence === t) d = M;
        else if (d !== u) break;
      }
      d ? d.parentNode.insertBefore(e, d.nextSibling) : (t = r.nodeType === 9 ? r.head : r, t.insertBefore(e, t.firstChild));
    }
    function $u(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
    }
    function qu(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
    }
    var Qi = null;
    function hg(e, t, r) {
      if (Qi === null) {
        var o = /* @__PURE__ */ new Map(), u = Qi = /* @__PURE__ */ new Map();
        u.set(r, o);
      } else u = Qi, o = u.get(r), o || (o = /* @__PURE__ */ new Map(), u.set(r, o));
      if (o.has(e)) return o;
      for (o.set(e, null), r = r.getElementsByTagName(e), u = 0; u < r.length; u++) {
        var d = r[u];
        if (!(d[Ze] || d[Et] || e === "link" && d.getAttribute("rel") === "stylesheet") && d.namespaceURI !== "http://www.w3.org/2000/svg") {
          var x = d.getAttribute(t) || "";
          x = e + x;
          var M = o.get(x);
          M ? M.push(d) : o.set(x, [
            d
          ]);
        }
      }
      return o;
    }
    function mg(e, t, r) {
      e = e.ownerDocument || e, e.head.insertBefore(r, t === "title" ? e.querySelector("head > title") : null);
    }
    function Gx(e, t, r) {
      if (r === 1 || t.itemProp != null) return false;
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
    function pg(e) {
      return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
    }
    function Zx(e, t, r, o) {
      if (r.type === "stylesheet" && (typeof o.media != "string" || matchMedia(o.media).matches !== false) && (r.state.loading & 4) === 0) {
        if (r.instance === null) {
          var u = da(o.href), d = t.querySelector(mo(u));
          if (d) {
            t = d._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Fi.bind(e), t.then(e, e)), r.state.loading |= 4, r.instance = d, Je(d);
            return;
          }
          d = t.ownerDocument || t, o = dg(o), (u = wn.get(u)) && $u(o, u), d = d.createElement("link"), Je(d);
          var x = d;
          x._p = new Promise(function(M, I) {
            x.onload = M, x.onerror = I;
          }), Ot(d, "link", o), r.instance = d;
        }
        e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(r, t), (t = r.state.preload) && (r.state.loading & 3) === 0 && (e.count++, r = Fi.bind(e), t.addEventListener("load", r), t.addEventListener("error", r));
      }
    }
    var Gu = 0;
    function Kx(e, t) {
      return e.stylesheets && e.count === 0 && Ji(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(r) {
        var o = setTimeout(function() {
          if (e.stylesheets && Ji(e, e.stylesheets), e.unsuspend) {
            var d = e.unsuspend;
            e.unsuspend = null, d();
          }
        }, 6e4 + t);
        0 < e.imgBytes && Gu === 0 && (Gu = 62500 * jx());
        var u = setTimeout(function() {
          if (e.waitingForImages = false, e.count === 0 && (e.stylesheets && Ji(e, e.stylesheets), e.unsuspend)) {
            var d = e.unsuspend;
            e.unsuspend = null, d();
          }
        }, (e.imgBytes > Gu ? 50 : 800) + t);
        return e.unsuspend = r, function() {
          e.unsuspend = null, clearTimeout(o), clearTimeout(u);
        };
      } : null;
    }
    function Fi() {
      if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
        if (this.stylesheets) Ji(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          this.unsuspend = null, e();
        }
      }
    }
    var Wi = null;
    function Ji(e, t) {
      e.stylesheets = null, e.unsuspend !== null && (e.count++, Wi = /* @__PURE__ */ new Map(), t.forEach(Px, e), Wi = null, Fi.call(e));
    }
    function Px(e, t) {
      if (!(t.state.loading & 4)) {
        var r = Wi.get(e);
        if (r) var o = r.get(null);
        else {
          r = /* @__PURE__ */ new Map(), Wi.set(e, r);
          for (var u = e.querySelectorAll("link[data-precedence],style[data-precedence]"), d = 0; d < u.length; d++) {
            var x = u[d];
            (x.nodeName === "LINK" || x.getAttribute("media") !== "not all") && (r.set(x.dataset.precedence, x), o = x);
          }
          o && r.set(null, o);
        }
        u = t.instance, x = u.getAttribute("data-precedence"), d = r.get(x) || o, d === o && r.set(null, u), r.set(x, u), this.count++, o = Fi.bind(this), u.addEventListener("load", o), u.addEventListener("error", o), d ? d.parentNode.insertBefore(u, d.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(u, e.firstChild)), t.state.loading |= 4;
      }
    }
    var go = {
      $$typeof: A,
      Provider: null,
      Consumer: null,
      _currentValue: ue,
      _currentValue2: ue,
      _threadCount: 0
    };
    function Qx(e, t, r, o, u, d, x, M, I) {
      this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = lr(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = lr(0), this.hiddenUpdates = lr(null), this.identifierPrefix = o, this.onUncaughtError = u, this.onCaughtError = d, this.onRecoverableError = x, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = I, this.incompleteTransitions = /* @__PURE__ */ new Map();
    }
    function gg(e, t, r, o, u, d, x, M, I, Z, ee, re) {
      return e = new Qx(e, t, r, x, I, Z, ee, re, M), t = 1, d === true && (t |= 24), d = ln(3, null, null, t), e.current = d, d.stateNode = e, t = _c(), t.refCount++, e.pooledCache = t, t.refCount++, d.memoizedState = {
        element: o,
        isDehydrated: r,
        cache: t
      }, Rc(d), e;
    }
    function yg(e) {
      return e ? (e = Vr, e) : Vr;
    }
    function bg(e, t, r, o, u, d) {
      u = yg(u), o.context === null ? o.context = u : o.pendingContext = u, o = Ll(t), o.payload = {
        element: r
      }, d = d === void 0 ? null : d, d !== null && (o.callback = d), r = Al(e, o, t), r !== null && (Wt(r, e, t), Za(r, e, t));
    }
    function vg(e, t) {
      if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
        var r = e.retryLane;
        e.retryLane = r !== 0 && r < t ? r : t;
      }
    }
    function Zu(e, t) {
      vg(e, t), (e = e.alternate) && vg(e, t);
    }
    function xg(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = ur(e, 67108864);
        t !== null && Wt(t, e, 67108864), Zu(e, 67108864);
      }
    }
    function Sg(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = cn();
        t = Pn(t);
        var r = ur(e, t);
        r !== null && Wt(r, e, t), Zu(e, t);
      }
    }
    var es = true;
    function Fx(e, t, r, o) {
      var u = $.T;
      $.T = null;
      var d = P.p;
      try {
        P.p = 2, Ku(e, t, r, o);
      } finally {
        P.p = d, $.T = u;
      }
    }
    function Wx(e, t, r, o) {
      var u = $.T;
      $.T = null;
      var d = P.p;
      try {
        P.p = 8, Ku(e, t, r, o);
      } finally {
        P.p = d, $.T = u;
      }
    }
    function Ku(e, t, r, o) {
      if (es) {
        var u = Pu(o);
        if (u === null) Ou(e, t, o, ts, r), Cg(e, o);
        else if (eS(u, e, t, r, o)) o.stopPropagation();
        else if (Cg(e, o), t & 4 && -1 < Jx.indexOf(e)) {
          for (; u !== null; ) {
            var d = at(u);
            if (d !== null) switch (d.tag) {
              case 3:
                if (d = d.stateNode, d.current.memoizedState.isDehydrated) {
                  var x = hn(d.pendingLanes);
                  if (x !== 0) {
                    var M = d;
                    for (M.pendingLanes |= 2, M.entangledLanes |= 2; x; ) {
                      var I = 1 << 31 - Bt(x);
                      M.entanglements[1] |= I, x &= ~I;
                    }
                    Vn(d), (Ge & 6) === 0 && (Ii = Ct() + 500, co(0));
                  }
                }
                break;
              case 31:
              case 13:
                M = ur(d, 2), M !== null && Wt(M, d, 2), Yi(), Zu(d, 2);
            }
            if (d = Pu(o), d === null && Ou(e, t, o, ts, r), d === u) break;
            u = d;
          }
          u !== null && o.stopPropagation();
        } else Ou(e, t, o, null, r);
      }
    }
    function Pu(e) {
      return e = Fs(e), Qu(e);
    }
    var ts = null;
    function Qu(e) {
      if (ts = null, e = Pe(e), e !== null) {
        var t = c(e);
        if (t === null) e = null;
        else {
          var r = t.tag;
          if (r === 13) {
            if (e = f(t), e !== null) return e;
            e = null;
          } else if (r === 31) {
            if (e = h(t), e !== null) return e;
            e = null;
          } else if (r === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return ts = e, null;
    }
    function wg(e) {
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
          switch (tr()) {
            case ka:
              return 2;
            case ja:
              return 8;
            case Lr:
            case qs:
              return 32;
            case Ra:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Fu = false, Xl = null, Vl = null, $l = null, yo = /* @__PURE__ */ new Map(), bo = /* @__PURE__ */ new Map(), ql = [], Jx = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function Cg(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Xl = null;
          break;
        case "dragenter":
        case "dragleave":
          Vl = null;
          break;
        case "mouseover":
        case "mouseout":
          $l = null;
          break;
        case "pointerover":
        case "pointerout":
          yo.delete(t.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          bo.delete(t.pointerId);
      }
    }
    function vo(e, t, r, o, u, d) {
      return e === null || e.nativeEvent !== d ? (e = {
        blockedOn: t,
        domEventName: r,
        eventSystemFlags: o,
        nativeEvent: d,
        targetContainers: [
          u
        ]
      }, t !== null && (t = at(t), t !== null && xg(t)), e) : (e.eventSystemFlags |= o, t = e.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), e);
    }
    function eS(e, t, r, o, u) {
      switch (t) {
        case "focusin":
          return Xl = vo(Xl, e, t, r, o, u), true;
        case "dragenter":
          return Vl = vo(Vl, e, t, r, o, u), true;
        case "mouseover":
          return $l = vo($l, e, t, r, o, u), true;
        case "pointerover":
          var d = u.pointerId;
          return yo.set(d, vo(yo.get(d) || null, e, t, r, o, u)), true;
        case "gotpointercapture":
          return d = u.pointerId, bo.set(d, vo(bo.get(d) || null, e, t, r, o, u)), true;
      }
      return false;
    }
    function Eg(e) {
      var t = Pe(e.target);
      if (t !== null) {
        var r = c(t);
        if (r !== null) {
          if (t = r.tag, t === 13) {
            if (t = f(r), t !== null) {
              e.blockedOn = t, ar(e.priority, function() {
                Sg(r);
              });
              return;
            }
          } else if (t === 31) {
            if (t = h(r), t !== null) {
              e.blockedOn = t, ar(e.priority, function() {
                Sg(r);
              });
              return;
            }
          } else if (t === 3 && r.stateNode.current.memoizedState.isDehydrated) {
            e.blockedOn = r.tag === 3 ? r.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function ns(e) {
      if (e.blockedOn !== null) return false;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var r = Pu(e.nativeEvent);
        if (r === null) {
          r = e.nativeEvent;
          var o = new r.constructor(r.type, r);
          Qs = o, r.target.dispatchEvent(o), Qs = null;
        } else return t = at(r), t !== null && xg(t), e.blockedOn = r, false;
        t.shift();
      }
      return true;
    }
    function _g(e, t, r) {
      ns(e) && r.delete(t);
    }
    function tS() {
      Fu = false, Xl !== null && ns(Xl) && (Xl = null), Vl !== null && ns(Vl) && (Vl = null), $l !== null && ns($l) && ($l = null), yo.forEach(_g), bo.forEach(_g);
    }
    function ls(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Fu || (Fu = true, l.unstable_scheduleCallback(l.unstable_NormalPriority, tS)));
    }
    var rs = null;
    function Mg(e) {
      rs !== e && (rs = e, l.unstable_scheduleCallback(l.unstable_NormalPriority, function() {
        rs === e && (rs = null);
        for (var t = 0; t < e.length; t += 3) {
          var r = e[t], o = e[t + 1], u = e[t + 2];
          if (typeof o != "function") {
            if (Qu(o || r) === null) continue;
            break;
          }
          var d = at(r);
          d !== null && (e.splice(t, 3), t -= 3, Pc(d, {
            pending: true,
            data: u,
            method: r.method,
            action: o
          }, o, u));
        }
      }));
    }
    function ha(e) {
      function t(I) {
        return ls(I, e);
      }
      Xl !== null && ls(Xl, e), Vl !== null && ls(Vl, e), $l !== null && ls($l, e), yo.forEach(t), bo.forEach(t);
      for (var r = 0; r < ql.length; r++) {
        var o = ql[r];
        o.blockedOn === e && (o.blockedOn = null);
      }
      for (; 0 < ql.length && (r = ql[0], r.blockedOn === null); ) Eg(r), r.blockedOn === null && ql.shift();
      if (r = (e.ownerDocument || e).$$reactFormReplay, r != null) for (o = 0; o < r.length; o += 3) {
        var u = r[o], d = r[o + 1], x = u[le] || null;
        if (typeof d == "function") x || Mg(r);
        else if (x) {
          var M = null;
          if (d && d.hasAttribute("formAction")) {
            if (u = d, x = d[le] || null) M = x.formAction;
            else if (Qu(u) !== null) continue;
          } else M = x.action;
          typeof M == "function" ? r[o + 1] = M : (r.splice(o, 3), o -= 3), Mg(r);
        }
      }
    }
    function kg() {
      function e(d) {
        d.canIntercept && d.info === "react-transition" && d.intercept({
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
        u !== null && (u(), u = null), o || setTimeout(r, 20);
      }
      function r() {
        if (!o && !navigation.transition) {
          var d = navigation.currentEntry;
          d && d.url != null && navigation.navigate(d.url, {
            state: d.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if (typeof navigation == "object") {
        var o = false, u = null;
        return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(r, 100), function() {
          o = true, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), u !== null && (u(), u = null);
        };
      }
    }
    function Wu(e) {
      this._internalRoot = e;
    }
    as.prototype.render = Wu.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null) throw Error(i(409));
      var r = t.current, o = cn();
      bg(r, o, e, t, null, null);
    }, as.prototype.unmount = Wu.prototype.unmount = function() {
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        bg(e.current, 2, null, e, null, null), Yi(), t[_e] = null;
      }
    };
    function as(e) {
      this._internalRoot = e;
    }
    as.prototype.unstable_scheduleHydration = function(e) {
      if (e) {
        var t = Hn();
        e = {
          blockedOn: null,
          target: e,
          priority: t
        };
        for (var r = 0; r < ql.length && t !== 0 && t < ql[r].priority; r++) ;
        ql.splice(r, 0, e), r === 0 && Eg(e);
      }
    };
    var jg = n.version;
    if (jg !== "19.2.4") throw Error(i(527, jg, "19.2.4"));
    P.findDOMNode = function(e) {
      var t = e._reactInternals;
      if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
      return e = g(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
    };
    var nS = {
      bundleType: 0,
      version: "19.2.4",
      rendererPackageName: "react-dom",
      currentDispatcherRef: $,
      reconcilerVersion: "19.2.4"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
      var os = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!os.isDisabled && os.supportsFiber) try {
        vl = os.inject(nS), Ut = os;
      } catch {
      }
    }
    return So.createRoot = function(e, t) {
      if (!s(e)) throw Error(i(299));
      var r = false, o = "", u = Dm, d = zm, x = Im;
      return t != null && (t.unstable_strictMode === true && (r = true), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (d = t.onCaughtError), t.onRecoverableError !== void 0 && (x = t.onRecoverableError)), t = gg(e, 1, false, null, null, r, o, null, u, d, x, kg), e[_e] = t.current, Nu(e), new Wu(t);
    }, So.hydrateRoot = function(e, t, r) {
      if (!s(e)) throw Error(i(299));
      var o = false, u = "", d = Dm, x = zm, M = Im, I = null;
      return r != null && (r.unstable_strictMode === true && (o = true), r.identifierPrefix !== void 0 && (u = r.identifierPrefix), r.onUncaughtError !== void 0 && (d = r.onUncaughtError), r.onCaughtError !== void 0 && (x = r.onCaughtError), r.onRecoverableError !== void 0 && (M = r.onRecoverableError), r.formState !== void 0 && (I = r.formState)), t = gg(e, 1, true, t, r ?? null, o, u, I, d, x, M, kg), t.context = yg(null), r = t.current, o = cn(), o = Pn(o), u = Ll(o), u.callback = null, Al(r, u, o), r = o, t.current.lanes = r, rr(t, r), Vn(t), e[_e] = t.current, Nu(e), new as(t);
    }, So.version = "19.2.4", So;
  }
  var Hg;
  function fS() {
    if (Hg) return td.exports;
    Hg = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), td.exports = dS(), td.exports;
  }
  var hS = fS();
  const mS = "modulepreload", pS = function(l, n) {
    return new URL(l, n).href;
  }, Yg = {}, pt = function(n, a, i) {
    let s = Promise.resolve();
    if (a && a.length > 0) {
      let f = function(v) {
        return Promise.all(v.map((y) => Promise.resolve(y).then((S) => ({
          status: "fulfilled",
          value: S
        }), (S) => ({
          status: "rejected",
          reason: S
        }))));
      };
      const h = document.getElementsByTagName("link"), p = document.querySelector("meta[property=csp-nonce]"), g = (p == null ? void 0 : p.nonce) || (p == null ? void 0 : p.getAttribute("nonce"));
      s = f(a.map((v) => {
        if (v = pS(v, i), v in Yg) return;
        Yg[v] = true;
        const y = v.endsWith(".css"), S = y ? '[rel="stylesheet"]' : "";
        if (!!i) for (let w = h.length - 1; w >= 0; w--) {
          const C = h[w];
          if (C.href === v && (!y || C.rel === "stylesheet")) return;
        }
        else if (document.querySelector(`link[href="${v}"]${S}`)) return;
        const k = document.createElement("link");
        if (k.rel = y ? "stylesheet" : mS, y || (k.as = "script"), k.crossOrigin = "", k.href = v, g && k.setAttribute("nonce", g), document.head.appendChild(k), y) return new Promise((w, C) => {
          k.addEventListener("load", w), k.addEventListener("error", () => C(new Error(`Unable to preload CSS for ${v}`)));
        });
      }));
    }
    function c(f) {
      const h = new Event("vite:preloadError", {
        cancelable: true
      });
      if (h.payload = f, window.dispatchEvent(h), !h.defaultPrevented) throw f;
    }
    return s.then((f) => {
      for (const h of f || []) h.status === "rejected" && c(h.reason);
      return n().catch(c);
    });
  }, Ug = (l) => {
    let n;
    const a = /* @__PURE__ */ new Set(), i = (g, v) => {
      const y = typeof g == "function" ? g(n) : g;
      if (!Object.is(y, n)) {
        const S = n;
        n = v ?? (typeof y != "object" || y === null) ? y : Object.assign({}, n, y), a.forEach((E) => E(n, S));
      }
    }, s = () => n, h = {
      setState: i,
      getState: s,
      getInitialState: () => p,
      subscribe: (g) => (a.add(g), () => a.delete(g))
    }, p = n = l(i, s, h);
    return h;
  }, gS = ((l) => l ? Ug(l) : Ug), yS = (l) => l;
  function bS(l, n = yS) {
    const a = xa.useSyncExternalStore(l.subscribe, xa.useCallback(() => n(l.getState()), [
      l,
      n
    ]), xa.useCallback(() => n(l.getInitialState()), [
      l,
      n
    ]));
    return xa.useDebugValue(a), a;
  }
  const Bg = (l) => {
    const n = gS(l), a = (i) => bS(n, i);
    return Object.assign(a, n), a;
  }, gt = ((l) => l ? Bg(l) : Bg);
  function vS(l, n) {
    let a;
    try {
      a = l();
    } catch {
      return;
    }
    return {
      getItem: (s) => {
        var c;
        const f = (p) => p === null ? null : JSON.parse(p, void 0), h = (c = a.getItem(s)) != null ? c : null;
        return h instanceof Promise ? h.then(f) : f(h);
      },
      setItem: (s, c) => a.setItem(s, JSON.stringify(c, void 0)),
      removeItem: (s) => a.removeItem(s)
    };
  }
  const nf = (l) => (n) => {
    try {
      const a = l(n);
      return a instanceof Promise ? a : {
        then(i) {
          return nf(i)(a);
        },
        catch(i) {
          return this;
        }
      };
    } catch (a) {
      return {
        then(i) {
          return this;
        },
        catch(i) {
          return nf(i)(a);
        }
      };
    }
  }, xS = (l, n) => (a, i, s) => {
    let c = {
      storage: vS(() => window.localStorage),
      partialize: (C) => C,
      version: 0,
      merge: (C, _) => ({
        ..._,
        ...C
      }),
      ...n
    }, f = false, h = 0;
    const p = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
    let v = c.storage;
    if (!v) return l((...C) => {
      console.warn(`[zustand persist middleware] Unable to update item '${c.name}', the given storage is currently unavailable.`), a(...C);
    }, i, s);
    const y = () => {
      const C = c.partialize({
        ...i()
      });
      return v.setItem(c.name, {
        state: C,
        version: c.version
      });
    }, S = s.setState;
    s.setState = (C, _) => (S(C, _), y());
    const E = l((...C) => (a(...C), y()), i, s);
    s.getInitialState = () => E;
    let k;
    const w = () => {
      var C, _;
      if (!v) return;
      const R = ++h;
      f = false, p.forEach((T) => {
        var B;
        return T((B = i()) != null ? B : E);
      });
      const A = ((_ = c.onRehydrateStorage) == null ? void 0 : _.call(c, (C = i()) != null ? C : E)) || void 0;
      return nf(v.getItem.bind(v))(c.name).then((T) => {
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
        if (R !== h) return;
        const [N, L] = T;
        if (k = c.merge(L, (B = i()) != null ? B : E), a(k, true), N) return y();
      }).then(() => {
        R === h && (A == null ? void 0 : A(k, void 0), k = i(), f = true, g.forEach((T) => T(k)));
      }).catch((T) => {
        R === h && (A == null ? void 0 : A(void 0, T));
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
      rehydrate: () => w(),
      hasHydrated: () => f,
      onHydrate: (C) => (p.add(C), () => {
        p.delete(C);
      }),
      onFinishHydration: (C) => (g.add(C), () => {
        g.delete(C);
      })
    }, c.skipHydration || w(), k || E;
  }, Mf = xS, En = {
    dark: "#44ff44",
    light: "#44ff44"
  }, ks = {
    dark: "#ffffff",
    light: "#000000"
  };
  function lf() {
    return typeof window > "u" || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function Xg(l) {
    return l === "system" ? lf() : l;
  }
  const Ro = 288, ws = 200, Cs = 480, he = gt()(Mf((l, n) => ({
    themeSetting: "system",
    theme: lf(),
    wasmReady: false,
    cursorWorld: null,
    sidebarTab: "layers",
    inspectorFocusRequested: false,
    inspectorFocusField: null,
    showGrid: true,
    zenMode: false,
    explorerCollapsed: false,
    sidebarCollapsed: false,
    explorerWidth: Ro,
    sidebarWidth: Ro,
    setThemeSetting: (a) => l({
      themeSetting: a,
      theme: Xg(a)
    }),
    toggleTheme: () => l((a) => {
      const i = a.theme === "dark" ? "light" : "dark";
      return {
        themeSetting: i,
        theme: i
      };
    }),
    syncSystemTheme: () => l((a) => a.themeSetting === "system" ? {
      theme: lf()
    } : {}),
    setWasmReady: (a) => l({
      wasmReady: a
    }),
    setCursorWorld: (a) => l({
      cursorWorld: a
    }),
    getSelectionColor: () => En[n().theme],
    setSidebarTab: (a) => l({
      sidebarTab: a
    }),
    requestInspectorFocus: () => l({
      sidebarTab: "inspector",
      inspectorFocusRequested: true,
      inspectorFocusField: null
    }),
    requestInspectorFocusField: (a) => l({
      sidebarTab: "inspector",
      inspectorFocusRequested: true,
      inspectorFocusField: a
    }),
    clearInspectorFocus: () => l({
      inspectorFocusRequested: false,
      inspectorFocusField: null
    }),
    toggleGrid: () => l((a) => ({
      showGrid: !a.showGrid
    })),
    toggleZenMode: () => l((a) => ({
      zenMode: !a.zenMode
    })),
    toggleExplorerCollapsed: () => l((a) => ({
      explorerCollapsed: !a.explorerCollapsed
    })),
    toggleSidebarCollapsed: () => l((a) => ({
      sidebarCollapsed: !a.sidebarCollapsed
    })),
    setExplorerCollapsed: (a) => l({
      explorerCollapsed: a
    }),
    setSidebarCollapsed: (a) => l({
      sidebarCollapsed: a
    }),
    setExplorerWidth: (a) => l({
      explorerWidth: Math.round(Math.max(ws, Math.min(Cs, a)))
    }),
    setSidebarWidth: (a) => l({
      sidebarWidth: Math.round(Math.max(ws, Math.min(Cs, a)))
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
        l.theme = Xg(l.themeSetting);
        const n = (a) => Math.round(Math.max(ws, Math.min(Cs, a)));
        l.explorerWidth = n(l.explorerWidth), l.sidebarWidth = n(l.sidebarWidth);
      }
    }
  }));
  typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    he.getState().syncSystemTheme();
  });
  let Lo = null, wo = null;
  async function SS() {
    if (Lo) return Lo;
    if (wo) return wo;
    wo = (async () => {
      const l = await pt(() => import("./rosette_wasm-C3ZjVAVy.js"), [], import.meta.url);
      return await l.default(), Lo = l, l;
    })();
    try {
      return await wo;
    } catch (l) {
      throw wo = null, l;
    }
  }
  function pv() {
    const [l, n] = m.useState(Lo), [a, i] = m.useState(!Lo), [s, c] = m.useState(null), f = he((h) => h.setWasmReady);
    return m.useEffect(() => {
      let h = true;
      return SS().then((p) => {
        h && (n(p), i(false), f(true));
      }).catch((p) => {
        console.error("Failed to load WASM module:", p), h && (c(p), i(false));
      }), () => {
        h = false;
      };
    }, [
      f
    ]), {
      wasm: l,
      isLoading: a,
      error: s,
      isReady: !!l && !a && !s
    };
  }
  const Ts = 1.18, Ns = 0.82, wS = 1.5, CS = 0.67, ES = 8, _S = 24, gv = 100, MS = 200, Vg = 1e6, $g = 1e3, kS = [
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
  ], qg = 0.1, yv = 100, bv = "monospace", jS = 530, kf = 0.72, ve = 50, ad = Math.pow(2, -6), od = 1e-18, id = 3, ze = gt((l, n) => ({
    zoom: ad,
    offset: {
      x: 0,
      y: 0
    },
    initialized: false,
    setZoom: (a) => l({
      zoom: Math.max(od, Math.min(id, a))
    }),
    zoomAt: (a, i, s) => {
      const c = n(), f = Math.max(od, Math.min(id, c.zoom * a)), h = (i - c.offset.x) / c.zoom, p = (s - c.offset.y) / c.zoom, g = i - h * f, v = s - p * f;
      l({
        zoom: f,
        offset: {
          x: g,
          y: v
        }
      });
    },
    pan: (a, i) => l((s) => ({
      offset: {
        x: s.offset.x + a,
        y: s.offset.y + i
      }
    })),
    setOffset: (a, i) => l({
      offset: {
        x: a,
        y: i
      }
    }),
    reset: (a, i) => l({
      zoom: ad,
      offset: {
        x: a / 2,
        y: i / 2
      },
      initialized: true
    }),
    initOffset: (a, i) => {
      n().initialized || l({
        offset: {
          x: a / 2,
          y: i / 2
        },
        initialized: true
      });
    },
    zoomToBounds: (a, i, s, c) => {
      const f = Math.abs(a.maxX - a.minX), h = Math.abs(a.maxY - a.minY), p = 1e3, g = Math.max(f, p), v = Math.max(h, p), y = g * qg, S = v * qg, E = g + y * 2, k = v + S * 2, w = (a.minX + a.maxX) / 2, C = (a.minY + a.maxY) / 2, _ = i / E, R = s / k, A = Math.max(od, Math.min(_, R, id)), T = c ? c.x : i / 2, B = c ? c.y : s / 2, N = {
        x: T - w * A,
        y: B - C * A
      };
      l({
        zoom: A,
        offset: N
      });
    },
    zoomToFit: (a, i, s, c) => {
      if (a) n().zoomToBounds(a, i, s, c);
      else {
        const f = c ? c.x : i / 2, h = c ? c.y : s / 2;
        l({
          zoom: ad,
          offset: {
            x: f,
            y: h
          },
          initialized: true
        });
      }
    },
    zoomToSelected: (a, i, s, c) => {
      a && n().zoomToBounds(a, i, s, c);
    },
    centerOnBounds: (a, i, s, c) => {
      const f = n(), h = (a.minX + a.maxX) / 2, p = (a.minY + a.maxY) / 2, g = c ? c.x : i / 2, v = c ? c.y : s / 2, y = {
        x: g - h * f.zoom,
        y: v - p * f.zoom
      };
      l({
        offset: y
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
    ze.subscribe(l), l(ze.getState());
  }
  function is(l) {
    const n = l.replace("#", ""), a = Number.parseInt(n.slice(0, 2), 16) / 255, i = Number.parseInt(n.slice(2, 4), 16) / 255, s = Number.parseInt(n.slice(4, 6), 16) / 255;
    return [
      a,
      i,
      s,
      1
    ];
  }
  function RS(l) {
    const { wasm: n, isReady: a } = pv(), [i, s] = m.useState(null), [c, f] = m.useState(false), [h, p] = m.useState(null), g = m.useRef(null), v = he((_) => _.theme), y = he((_) => _.showGrid), { zoom: S, offset: E } = ze();
    m.useEffect(() => {
      if (!a || !n || !l) return;
      let _ = true;
      async function R() {
        try {
          const A = await n.WasmRenderer.create(l);
          if (!_) {
            A.destroy();
            return;
          }
          A.set_theme(v === "dark");
          const T = En[v], [B, N, L, U] = is(T);
          A.set_selection_color(B, N, L, U);
          const X = ks[v], [J, ae, te, ce] = is(X);
          A.set_hover_color(J, ae, te, ce), A.set_dpr(window.devicePixelRatio || 1), g.current = A, s(A), f(true);
        } catch (A) {
          console.error("Failed to create renderer:", A), _ && p(A);
        }
      }
      return R(), () => {
        _ = false, g.current && (g.current.destroy(), g.current = null);
      };
    }, [
      a,
      n,
      l
    ]), m.useEffect(() => {
      if (i && c) {
        i.set_theme(v === "dark");
        const _ = En[v], [R, A, T, B] = is(_);
        i.set_selection_color(R, A, T, B);
        const N = ks[v], [L, U, X, J] = is(N);
        i.set_hover_color(L, U, X, J);
      }
    }, [
      i,
      c,
      v
    ]), m.useEffect(() => {
      i && c && i.set_grid_visible(y);
    }, [
      i,
      c,
      y
    ]), m.useEffect(() => {
      if (i && c) {
        const _ = window.devicePixelRatio || 1;
        i.set_viewport(E.x * _, E.y * _, S * _);
      }
    }, [
      i,
      c,
      S,
      E.x,
      E.y
    ]);
    const k = m.useCallback(() => {
      i && c && i.render();
    }, [
      i,
      c
    ]), w = m.useCallback((_, R) => {
      i && c && (i.set_dpr(window.devicePixelRatio || 1), i.resize(_, R));
    }, [
      i,
      c
    ]), C = m.useCallback((_, R) => {
      if (i && c) {
        const A = window.devicePixelRatio || 1, T = i.screen_to_world(_ * A, R * A);
        return {
          x: T[0],
          y: T[1]
        };
      }
      return null;
    }, [
      i,
      c
    ]);
    return {
      renderer: i,
      isReady: c,
      error: h,
      render: k,
      resize: w,
      screenToWorld: C
    };
  }
  const Ht = gt((l) => ({
    activeTool: "select",
    toolSetAt: 0,
    setTool: (n) => l({
      activeTool: n,
      toolSetAt: Date.now()
    })
  })), se = gt((l) => ({
    selectedIds: /* @__PURE__ */ new Set(),
    hoveredId: null,
    lastSelectedId: null,
    select: (n) => l({
      selectedIds: /* @__PURE__ */ new Set([
        n
      ]),
      lastSelectedId: n
    }),
    addToSelection: (n) => l((a) => ({
      selectedIds: /* @__PURE__ */ new Set([
        ...a.selectedIds,
        n
      ]),
      lastSelectedId: n
    })),
    toggleSelection: (n) => l((a) => {
      const i = new Set(a.selectedIds);
      if (i.has(n)) {
        i.delete(n);
        const s = a.lastSelectedId === n ? i.size > 0 ? [
          ...i
        ][i.size - 1] : null : a.lastSelectedId;
        return {
          selectedIds: i,
          lastSelectedId: s
        };
      } else return i.add(n), {
        selectedIds: i,
        lastSelectedId: n
      };
    }),
    deselect: (n) => l((a) => {
      const i = new Set(a.selectedIds);
      i.delete(n);
      const s = a.lastSelectedId === n ? i.size > 0 ? [
        ...i
      ][i.size - 1] : null : a.lastSelectedId;
      return {
        selectedIds: i,
        lastSelectedId: s
      };
    }),
    removeFromSelection: (n) => se.getState().deselect(n),
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
    selectNext: (n) => l((a) => {
      if (n.length === 0) return a;
      if (a.selectedIds.size === 0) return {
        selectedIds: /* @__PURE__ */ new Set([
          n[0]
        ]),
        lastSelectedId: n[0]
      };
      const i = a.lastSelectedId ?? [
        ...a.selectedIds
      ][0], s = n.indexOf(i);
      if (s === -1) return {
        selectedIds: /* @__PURE__ */ new Set([
          n[0]
        ]),
        lastSelectedId: n[0]
      };
      const c = (s + 1) % n.length, f = n[c];
      return {
        selectedIds: /* @__PURE__ */ new Set([
          f
        ]),
        lastSelectedId: f
      };
    }),
    selectPrevious: (n) => l((a) => {
      if (n.length === 0) return a;
      if (a.selectedIds.size === 0) {
        const h = n[n.length - 1];
        return {
          selectedIds: /* @__PURE__ */ new Set([
            h
          ]),
          lastSelectedId: h
        };
      }
      const i = a.lastSelectedId ?? [
        ...a.selectedIds
      ][0], s = n.indexOf(i);
      if (s === -1) {
        const h = n[n.length - 1];
        return {
          selectedIds: /* @__PURE__ */ new Set([
            h
          ]),
          lastSelectedId: h
        };
      }
      const c = (s - 1 + n.length) % n.length, f = n[c];
      return {
        selectedIds: /* @__PURE__ */ new Set([
          f
        ]),
        lastSelectedId: f
      };
    })
  })), Os = gt((l) => ({
    isOpen: false,
    position: {
      x: 0,
      y: 0
    },
    variant: "canvas",
    targetId: null,
    open: (n, a, i = null) => l({
      isOpen: true,
      position: a,
      variant: n,
      targetId: i
    }),
    close: () => l({
      isOpen: false
    })
  }));
  function sd() {
    return `ruler-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  const ke = gt((l, n) => ({
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
    startRuler: (a) => {
      const i = sd(), s = {
        id: i,
        start: a,
        end: a
      };
      return l((c) => {
        const f = new Map(c.rulers);
        return f.set(i, s), {
          rulers: f,
          activeRulerId: i,
          previewEnd: a
        };
      }), i;
    },
    updatePreview: (a) => {
      const i = n();
      i.activeRulerId && l((s) => {
        const c = new Map(s.rulers), f = c.get(i.activeRulerId);
        return f && c.set(i.activeRulerId, {
          ...f,
          end: a
        }), {
          rulers: c,
          previewEnd: a
        };
      });
    },
    finalizeRuler: (a) => {
      const i = n();
      if (!i.activeRulerId) return null;
      const s = i.rulers.get(i.activeRulerId);
      if (!s) return null;
      const c = {
        ...s,
        end: a
      };
      return l((f) => {
        const h = new Map(f.rulers);
        return h.set(i.activeRulerId, c), {
          rulers: h,
          activeRulerId: null,
          previewEnd: null
        };
      }), c;
    },
    cancelCreation: () => {
      const a = n();
      a.activeRulerId && l((i) => {
        const s = new Map(i.rulers);
        return s.delete(a.activeRulerId), {
          rulers: s,
          activeRulerId: null,
          previewEnd: null
        };
      });
    },
    updateEndpoint: (a, i, s) => {
      l((c) => {
        const f = new Map(c.rulers), h = f.get(a);
        return h && f.set(a, {
          ...h,
          [i]: s
        }), {
          rulers: f
        };
      });
    },
    removeRuler: (a) => {
      l((i) => {
        var _a, _b2;
        const s = new Map(i.rulers);
        s.delete(a);
        const c = new Set(i.selectedRulerIds);
        return c.delete(a), {
          rulers: s,
          selectedRulerIds: c,
          hoveredRulerId: i.hoveredRulerId === a ? null : i.hoveredRulerId,
          hoveredEndpoint: ((_a = i.hoveredEndpoint) == null ? void 0 : _a.rulerId) === a ? null : i.hoveredEndpoint,
          draggingEndpoint: ((_b2 = i.draggingEndpoint) == null ? void 0 : _b2.rulerId) === a ? null : i.draggingEndpoint
        };
      });
    },
    removeRulers: (a) => {
      l((i) => {
        const s = new Map(i.rulers), c = new Set(i.selectedRulerIds);
        for (const f of a) s.delete(f), c.delete(f);
        return {
          rulers: s,
          selectedRulerIds: c,
          hoveredRulerId: a.includes(i.hoveredRulerId ?? "") ? null : i.hoveredRulerId,
          hoveredEndpoint: i.hoveredEndpoint && a.includes(i.hoveredEndpoint.rulerId) ? null : i.hoveredEndpoint,
          draggingEndpoint: i.draggingEndpoint && a.includes(i.draggingEndpoint.rulerId) ? null : i.draggingEndpoint
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
    setHoveredEndpoint: (a) => l({
      hoveredEndpoint: a
    }),
    setDraggingEndpoint: (a) => {
      if (a) {
        const i = n().rulers.get(a.rulerId), s = i ? {
          ...i[a.endpoint]
        } : null;
        l({
          draggingEndpoint: a,
          draggingEndpointOriginal: s
        });
      } else l({
        draggingEndpoint: null
      });
    },
    endDraggingEndpoint: () => {
      const a = n(), { draggingEndpoint: i, draggingEndpointOriginal: s, rulers: c } = a;
      if (!i || !s) return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), null;
      const f = c.get(i.rulerId);
      if (!f) return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), null;
      const h = f[i.endpoint], p = h.x !== s.x || h.y !== s.y;
      return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), p ? {
        rulerId: i.rulerId,
        endpoint: i.endpoint,
        oldPosition: s,
        newPosition: {
          ...h
        }
      } : null;
    },
    selectRuler: (a) => l({
      selectedRulerIds: a ? /* @__PURE__ */ new Set([
        a
      ]) : /* @__PURE__ */ new Set()
    }),
    toggleSelection: (a) => l((i) => {
      const s = new Set(i.selectedRulerIds);
      return s.has(a) ? s.delete(a) : s.add(a), {
        selectedRulerIds: s
      };
    }),
    addToSelection: (a) => {
      l((i) => {
        const s = new Set(i.selectedRulerIds);
        for (const c of a) s.add(c);
        return {
          selectedRulerIds: s
        };
      });
    },
    setSelection: (a) => l({
      selectedRulerIds: a
    }),
    clearSelection: () => l({
      selectedRulerIds: /* @__PURE__ */ new Set()
    }),
    setHoveredRuler: (a) => l({
      hoveredRulerId: a
    }),
    setMarqueePreviewIds: (a) => l({
      marqueePreviewIds: new Set(a)
    }),
    startMoveRuler: (a) => {
      n().selectedRulerIds.size !== 0 && l({
        isMovingRuler: true,
        moveStartPoint: a,
        moveOriginalPoint: a
      });
    },
    moveRuler: (a) => {
      const i = n();
      if (!i.isMovingRuler || i.selectedRulerIds.size === 0 || !i.moveStartPoint) return;
      const s = a.x - i.moveStartPoint.x, c = a.y - i.moveStartPoint.y;
      l((f) => {
        const h = new Map(f.rulers);
        for (const p of i.selectedRulerIds) {
          const g = h.get(p);
          g && h.set(p, {
            ...g,
            start: {
              x: g.start.x + s,
              y: g.start.y + c
            },
            end: {
              x: g.end.x + s,
              y: g.end.y + c
            }
          });
        }
        return {
          rulers: h,
          moveStartPoint: a
        };
      });
    },
    endMoveRuler: () => {
      const a = n(), { selectedRulerIds: i, moveStartPoint: s, moveOriginalPoint: c } = a;
      let f = null;
      if (s && c && i.size > 0) {
        const h = s.x - c.x, p = s.y - c.y;
        (h !== 0 || p !== 0) && (f = {
          rulerIds: [
            ...i
          ],
          deltaX: h,
          deltaY: p
        });
      }
      return l({
        isMovingRuler: false,
        moveStartPoint: null,
        moveOriginalPoint: null
      }), f;
    },
    deleteSelectedRulers: () => {
      const a = n();
      a.selectedRulerIds.size > 0 && n().removeRulers(Array.from(a.selectedRulerIds));
    },
    addRuler: (a, i) => {
      const s = sd(), c = {
        id: s,
        start: a,
        end: i
      };
      return l((f) => {
        const h = new Map(f.rulers);
        return h.set(s, c), {
          rulers: h
        };
      }), s;
    },
    restoreRulers: (a) => {
      const i = [];
      return l((s) => {
        const c = new Map(s.rulers);
        for (const f of a) {
          const h = sd();
          c.set(h, {
            ...f,
            id: h
          }), i.push(h);
        }
        return {
          rulers: c
        };
      }), i;
    },
    setSnapPoint: (a) => l({
      snapPoint: a
    })
  })), Ce = gt((l) => ({
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
  function vv(l) {
    const n = [
      l.name
    ];
    for (const a of l.children) n.push(...vv(a));
    return n;
  }
  function LS(l) {
    const n = /* @__PURE__ */ new Set(), a = [];
    for (const i of l) for (const s of vv(i)) n.has(s) || (n.add(s), a.push(s));
    return a;
  }
  function xv(l) {
    const n = [];
    if (l.children.length > 0) {
      n.push(l.name);
      for (const a of l.children) n.push(...xv(a));
    }
    return n;
  }
  function AS(l) {
    function n(i) {
      if (i.children.length === 0) return 1;
      let s = 0;
      for (const c of i.children) s = Math.max(s, n(c));
      return 1 + s;
    }
    let a = 0;
    for (const i of l) a = Math.max(a, n(i));
    return a;
  }
  const ye = gt()(Mf((l) => ({
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
    setCells: (n) => l((a) => {
      const i = a.activeCell && n.includes(a.activeCell) ? a.activeCell : n[0] ?? null;
      return {
        cells: n,
        activeCell: i,
        cellsLoaded: true
      };
    }),
    setCellTree: (n) => l((a) => {
      const i = LS(n), s = AS(n), c = a.expandedCells.size === 0 ? new Set(n.flatMap(xv)) : a.expandedCells, f = a.activeCell && i.includes(a.activeCell) ? a.activeCell : i[0] ?? null;
      return {
        cellTree: n,
        cells: i,
        expandedCells: c,
        activeCell: f,
        maxTreeDepth: s,
        cellsLoaded: true
      };
    }),
    toggleExpanded: (n) => l((a) => {
      const i = new Set(a.expandedCells);
      return i.has(n) ? i.delete(n) : i.add(n), {
        expandedCells: i
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
    renameCell: (n, a) => l((i) => {
      const s = i.cells.map((h) => h === n ? a : h), c = i.activeCell === n ? a : i.activeCell, f = new Set(i.hiddenCells);
      return f.has(n) && (f.delete(n), f.add(a)), {
        cells: s,
        activeCell: c,
        hiddenCells: f
      };
    }),
    removeCell: (n) => l((a) => {
      const i = a.cells.filter((f) => f !== n), s = a.activeCell === n ? i[0] ?? null : a.activeCell, c = new Set(a.hiddenCells);
      return c.delete(n), {
        cells: i,
        activeCell: s,
        hiddenCells: c
      };
    }),
    addCell: (n) => l((a) => a.cells.includes(n) ? a : {
      cells: [
        ...a.cells,
        n
      ]
    }),
    toggleCellVisibility: (n) => l((a) => {
      const i = new Set(a.hiddenCells);
      return i.has(n) ? i.delete(n) : i.add(n), {
        hiddenCells: i
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
  })), Es = gt((l) => ({
    cellName: null,
    bounds: null,
    origin: {
      x: 0,
      y: 0
    },
    startDrag: (n, a, i) => l({
      cellName: n,
      bounds: a,
      origin: i
    }),
    endDrag: () => l({
      cellName: null,
      bounds: null,
      origin: {
        x: 0,
        y: 0
      }
    })
  }));
  let Cr = null;
  const $t = gt((l) => ({
    message: null,
    level: "info",
    show: (n, a = "info", i = 3e3) => {
      Cr !== null && clearTimeout(Cr), l({
        message: n,
        level: a
      }), Cr = setTimeout(() => {
        l({
          message: null
        }), Cr = null;
      }, i);
    },
    clear: () => {
      Cr !== null && (clearTimeout(Cr), Cr = null), l({
        message: null
      });
    }
  })), Er = gt((l) => ({
    isDirty: false,
    markDirty: () => l({
      isDirty: true
    }),
    markClean: () => l({
      isDirty: false
    })
  })), Gg = 100, fe = gt((l, n) => ({
    undoStack: [],
    redoStack: [],
    canUndo: false,
    canRedo: false,
    execute: (a, i) => {
      try {
        a.execute(i);
      } catch (s) {
        $t.getState().show(String(s), "warn");
        return;
      }
      Ce.getState().bumpSyncGeneration(), Er.getState().markDirty(), l((s) => {
        const c = [
          ...s.undoStack,
          a
        ];
        return c.length > Gg && c.shift(), {
          undoStack: c,
          redoStack: [],
          canUndo: true,
          canRedo: false
        };
      });
    },
    undo: (a) => {
      const { undoStack: i } = n();
      if (i.length === 0) return;
      const s = i[i.length - 1];
      try {
        s.undo(a);
      } catch (c) {
        $t.getState().show(String(c), "warn");
        return;
      }
      Ce.getState().bumpSyncGeneration(), Er.getState().markDirty(), l((c) => {
        const f = c.undoStack.slice(0, -1), h = [
          ...c.redoStack,
          s
        ];
        return {
          undoStack: f,
          redoStack: h,
          canUndo: f.length > 0,
          canRedo: true
        };
      });
    },
    redo: (a) => {
      const { redoStack: i } = n();
      if (i.length === 0) return;
      const s = i[i.length - 1];
      try {
        s.execute(a);
      } catch (c) {
        $t.getState().show(String(c), "warn");
        return;
      }
      Ce.getState().bumpSyncGeneration(), Er.getState().markDirty(), l((c) => {
        const f = c.redoStack.slice(0, -1);
        return {
          undoStack: [
            ...c.undoStack,
            s
          ],
          redoStack: f,
          canUndo: true,
          canRedo: f.length > 0
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
    pushCommand: (a) => {
      Er.getState().markDirty(), l((i) => {
        const s = [
          ...i.undoStack,
          a
        ];
        return s.length > Gg && s.shift(), {
          undoStack: s,
          redoStack: [],
          canUndo: true,
          canRedo: false
        };
      });
    }
  })), Gn = gt((l) => ({
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
  })), rf = {
    solid: 0,
    hatched: 1,
    crosshatched: 2,
    dotted: 3,
    horizontal: 4,
    vertical: 5,
    zigzag: 6,
    brick: 7
  }, Ao = [
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
  ], af = 999, TS = [
    {
      id: 1,
      layerNumber: 1,
      datatype: 0,
      name: "core",
      color: "#ff69b4",
      visible: true,
      fillPattern: "solid",
      opacity: 0.7
    },
    {
      id: 2,
      layerNumber: 2,
      datatype: 0,
      name: "clad",
      color: "#78909c",
      visible: true,
      fillPattern: "solid",
      opacity: 0.7
    }
  ], me = gt((l, n) => ({
    layers: new Map(TS.map((a) => [
      a.id,
      a
    ])),
    activeLayerId: 1,
    editingLayerId: null,
    expandedLayerId: null,
    getLayer: (a) => n().layers.get(a),
    getActiveLayer: () => {
      const a = n();
      return a.layers.get(a.activeLayerId);
    },
    setActiveLayer: (a) => l({
      activeLayerId: a
    }),
    setLayer: (a) => l((i) => {
      const s = new Map(i.layers);
      return s.set(a.id, a), {
        layers: s
      };
    }),
    addLayer: (a, i) => {
      const s = n(), c = Array.from(s.layers.values());
      let f = 1;
      const h = new Set(c.map((E) => E.layerNumber));
      for (; h.has(f) && f <= af; ) f++;
      if (f > af) return c[0];
      const g = Math.max(0, ...c.map((E) => E.id)) + 1, v = new Set(c.map((E) => E.color)), y = i ?? Ao.find((E) => !v.has(E)) ?? Ao[c.length % Ao.length], S = {
        id: g,
        layerNumber: f,
        datatype: 0,
        name: a ?? `layer${f}`,
        color: y,
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      };
      return l((E) => {
        const k = new Map(E.layers);
        return k.set(S.id, S), {
          layers: k,
          activeLayerId: S.id
        };
      }), S;
    },
    deleteLayer: (a) => l((i) => {
      if (i.layers.size <= 1) return i;
      const s = new Map(i.layers);
      s.delete(a);
      let c = i.activeLayerId;
      return i.activeLayerId === a && (c = s.keys().next().value ?? 1), {
        layers: s,
        activeLayerId: c
      };
    }),
    toggleVisibility: (a) => l((i) => {
      const s = i.layers.get(a);
      if (!s) return i;
      const c = new Map(i.layers);
      return c.set(a, {
        ...s,
        visible: !s.visible
      }), {
        layers: c
      };
    }),
    showAllLayers: () => l((a) => {
      const i = new Map(a.layers);
      for (const [s, c] of i) i.set(s, {
        ...c,
        visible: true
      });
      return {
        layers: i
      };
    }),
    hideAllLayers: () => l((a) => {
      const i = new Map(a.layers);
      for (const [s, c] of i) i.set(s, {
        ...c,
        visible: false
      });
      return {
        layers: i
      };
    }),
    getAllLayers: () => Array.from(n().layers.values()).sort((a, i) => a.layerNumber - i.layerNumber),
    layerExists: (a, i) => {
      const s = n().layers;
      for (const c of s.values()) if (c.layerNumber === a && c.datatype === i) return true;
      return false;
    },
    resetLayers: (a) => l(() => {
      var _a;
      const i = new Map(a.map((c) => [
        c.id,
        c
      ])), s = ((_a = a[0]) == null ? void 0 : _a.id) ?? 1;
      return {
        layers: i,
        activeLayerId: s,
        editingLayerId: null,
        expandedLayerId: null
      };
    }),
    setEditingLayerId: (a) => l({
      editingLayerId: a
    }),
    setExpandedLayerId: (a) => l({
      expandedLayerId: a
    })
  }));
  function Ds(l, n = 0.7) {
    const a = l.replace("#", ""), i = Number.parseInt(a.slice(0, 2), 16) / 255, s = Number.parseInt(a.slice(2, 4), 16) / 255, c = Number.parseInt(a.slice(4, 6), 16) / 255;
    return [
      i,
      s,
      c,
      n
    ];
  }
  function of(l) {
    return {
      minX: l[0],
      minY: l[1],
      maxX: l[2],
      maxY: l[3]
    };
  }
  function sf(l) {
    return {
      x: (l.minX + l.maxX) / 2,
      y: (l.minY + l.maxY) / 2
    };
  }
  function NS(l, n) {
    const a = /* @__PURE__ */ new Set(), i = [];
    for (const s of n) {
      if (a.has(s)) continue;
      const f = l.get_group_ids(s).filter((h) => n.has(h));
      for (const h of f) a.add(h);
      f.length > 0 && i.push(f);
    }
    return i;
  }
  function OS(l, n, a, i) {
    const s = NS(l, n);
    if (i === "origin-align") return DS(l, s);
    if (s.length < 2 || !a) return [];
    const c = s.findIndex((v) => v.includes(a));
    if (c === -1) return [];
    const f = l.get_bounds_for_ids(s[c]);
    if (!f) return [];
    const h = of(f), p = sf(h), g = [];
    for (let v = 0; v < s.length; v++) {
      if (v === c) continue;
      const y = s[v], S = l.get_bounds_for_ids(y);
      if (!S) continue;
      const E = of(S), k = sf(E);
      let w = 0, C = 0;
      switch (i) {
        case "align-left":
          w = h.minX - E.minX;
          break;
        case "align-center-h":
          w = p.x - k.x;
          break;
        case "align-right":
          w = h.maxX - E.maxX;
          break;
        case "align-top":
          C = h.minY - E.minY;
          break;
        case "align-center-v":
          C = p.y - k.y;
          break;
        case "align-bottom":
          C = h.maxY - E.maxY;
          break;
        case "center-align":
          w = p.x - k.x, C = p.y - k.y;
          break;
      }
      (w !== 0 || C !== 0) && g.push({
        ids: y,
        dx: w,
        dy: C
      });
    }
    return g;
  }
  function DS(l, n) {
    const a = [];
    for (const i of n) {
      const s = l.get_bounds_for_ids(i);
      if (!s) continue;
      const c = sf(of(s)), f = -c.x, h = -c.y;
      (f !== 0 || h !== 0) && a.push({
        ids: i,
        dx: f,
        dy: h
      });
    }
    return a;
  }
  const zS = 500 * ve, jf = 64, dn = gt((l, n) => ({
    width: zS,
    cornerRadius: 0,
    numArcPoints: jf,
    setWidth: (a) => l({
      width: a
    }),
    setCornerRadius: (a) => l({
      cornerRadius: a
    }),
    setNumArcPoints: (a) => l({
      numArcPoints: a
    }),
    pathMetadata: /* @__PURE__ */ new Map(),
    setPathMetadata: (a, i) => {
      const s = new Map(n().pathMetadata);
      s.set(a, i), l({
        pathMetadata: s
      });
    },
    removePathMetadata: (a) => {
      const i = new Map(n().pathMetadata);
      i.delete(a), l({
        pathMetadata: i
      });
    }
  })), Zg = 8;
  function Kg(l, n) {
    const a = n.x - l.x, i = n.y - l.y;
    if (a === 0 && i === 0) return n;
    const s = Math.abs(Math.atan2(Math.abs(i), Math.abs(a)) * (180 / Math.PI));
    return s <= Zg ? {
      x: n.x,
      y: l.y
    } : s >= 90 - Zg ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function IS(l, n, a = 64) {
    const i = l.length;
    if (i < 3 || n <= 0) return l;
    const s = [];
    for (let g = 0; g < i - 1; g++) {
      const v = l[g + 1].x - l[g].x, y = l[g + 1].y - l[g].y;
      s.push(Math.sqrt(v * v + y * y));
    }
    const c = i - 2, f = [];
    for (let g = 1; g < i - 1; g++) {
      const v = l[g - 1], y = l[g], S = l[g + 1], E = s[g - 1], k = s[g];
      if (E < 1e-10 || k < 1e-10) {
        f.push(null);
        continue;
      }
      const w = (y.x - v.x) / E, C = (y.y - v.y) / E, _ = (S.x - y.x) / k, R = (S.y - y.y) / k, A = w * R - C * _, T = w * _ + C * R, B = Math.atan2(A, T);
      Math.abs(B) < 1e-6 ? f.push(null) : f.push(B);
    }
    const h = f.map((g) => {
      if (g === null) return 0;
      const v = Math.abs(g) / 2;
      return n * Math.tan(v);
    });
    for (let g = 0; g < 3; g++) for (let v = 0; v < s.length; v++) {
      const y = s[v] * 0.95, S = v > 0 ? v - 1 : null, E = v < c ? v : null, k = S !== null ? h[S] : 0, w = E !== null ? h[E] : 0, C = k + w;
      if (C > y && C > 1e-10) {
        const _ = y / C;
        S !== null && (h[S] = Math.min(h[S], k * _)), E !== null && (h[E] = Math.min(h[E], w * _));
      }
    }
    const p = [
      l[0]
    ];
    for (let g = 0; g < c; g++) {
      const v = g + 1, y = l[v], S = f[g];
      if (S === null) {
        p.push(y);
        continue;
      }
      const E = h[g], k = Math.abs(S) / 2, w = Math.tan(k), C = Math.abs(w) > 1e-10 ? E / w : 0;
      if (C < 1e-6 || E < 1e-6) {
        p.push(y);
        continue;
      }
      const _ = l[v - 1], R = l[v + 1], A = s[v - 1], T = s[v], B = (y.x - _.x) / A, N = (y.y - _.y) / A, L = (R.x - y.x) / T, U = (R.y - y.y) / T, X = S > 0 ? 1 : -1, J = y.x + B * -E, ae = y.y + N * -E, te = y.x + L * E, ce = y.y + U * E, ie = -N * X, Se = B * X, $ = J + ie * C, P = ae + Se * C, ue = J - $, xe = ae - P, be = Math.min(Math.max(Math.ceil(Math.abs(S) * 180 / Math.PI * 2), 8), a);
      p.push({
        x: J,
        y: ae
      });
      for (let j = 1; j < be; j++) {
        const D = j / be, z = S * D, O = Math.cos(z), Y = Math.sin(z);
        p.push({
          x: $ + ue * O - xe * Y,
          y: P + ue * Y + xe * O
        });
      }
      p.push({
        x: te,
        y: ce
      });
    }
    return p.push(l[i - 1]), p;
  }
  function HS(l, n) {
    const a = l.length;
    if (a < 3 || n <= 0) return [];
    const i = [];
    for (let p = 0; p < a - 1; p++) {
      const g = l[p + 1].x - l[p].x, v = l[p + 1].y - l[p].y;
      i.push(Math.sqrt(g * g + v * v));
    }
    const s = a - 2, c = [];
    for (let p = 1; p < a - 1; p++) {
      const g = l[p - 1], v = l[p], y = l[p + 1], S = i[p - 1], E = i[p];
      if (S < 1e-10 || E < 1e-10) {
        c.push(null);
        continue;
      }
      const k = (v.x - g.x) / S, w = (v.y - g.y) / S, C = (y.x - v.x) / E, _ = (y.y - v.y) / E, R = k * _ - w * C, A = k * C + w * _, T = Math.atan2(R, A);
      c.push(Math.abs(T) < 1e-6 ? null : T);
    }
    const f = c.map((p) => p === null ? 0 : n * Math.tan(Math.abs(p) / 2));
    for (let p = 0; p < 3; p++) for (let g = 0; g < i.length; g++) {
      const v = i[g] * 0.95, y = g > 0 ? g - 1 : null, S = g < s ? g : null, E = y !== null ? f[y] : 0, k = S !== null ? f[S] : 0, w = E + k;
      if (w > v && w > 1e-10) {
        const C = v / w;
        y !== null && (f[y] = Math.min(f[y], E * C)), S !== null && (f[S] = Math.min(f[S], k * C));
      }
    }
    const h = [];
    for (let p = 0; p < s; p++) {
      const g = c[p];
      if (g === null) continue;
      const v = Math.abs(g) / 2, y = Math.tan(v);
      if (Math.abs(y) < 1e-10) continue;
      const S = f[p] / y;
      S < n - 1e-6 && h.push({
        cornerIndex: p + 1,
        requested: n,
        actual: S
      });
    }
    return h;
  }
  function YS(l, n, a = 0, i = 64) {
    const s = a > 0 ? IS(l, a, i) : l;
    if (s.length < 2) return [];
    const c = n / 2, f = s.length, h = [], p = [];
    for (let g = 0; g < f; g++) {
      const v = s[g];
      if (g === 0) {
        const y = s[1], S = y.x - v.x, E = y.y - v.y, k = Math.sqrt(S * S + E * E);
        if (k < 1e-10) continue;
        const w = -E / k, C = S / k;
        h.push({
          x: v.x + w * c,
          y: v.y + C * c
        }), p.push({
          x: v.x - w * c,
          y: v.y - C * c
        });
      } else if (g === f - 1) {
        const y = s[f - 2], S = v.x - y.x, E = v.y - y.y, k = Math.sqrt(S * S + E * E);
        if (k < 1e-10) continue;
        const w = -E / k, C = S / k;
        h.push({
          x: v.x + w * c,
          y: v.y + C * c
        }), p.push({
          x: v.x - w * c,
          y: v.y - C * c
        });
      } else {
        const y = s[g - 1], S = s[g + 1], E = v.x - y.x, k = v.y - y.y, w = Math.sqrt(E * E + k * k), C = S.x - v.x, _ = S.y - v.y, R = Math.sqrt(C * C + _ * _);
        if (w < 1e-10 || R < 1e-10) continue;
        const A = -k / w, T = E / w, B = -_ / R, N = C / R, L = A + B, U = T + N, X = Math.sqrt(L * L + U * U);
        if (X < 1e-10) h.push({
          x: v.x + A * c,
          y: v.y + T * c
        }), p.push({
          x: v.x - A * c,
          y: v.y - T * c
        });
        else {
          const J = L / X, ae = U / X, te = J * A + ae * T;
          if (Math.abs(te) < 1e-6) h.push({
            x: v.x + A * c,
            y: v.y + T * c
          }), p.push({
            x: v.x - A * c,
            y: v.y - T * c
          });
          else {
            const ce = Math.max(-2 * c, Math.min(2 * c, c / te));
            h.push({
              x: v.x + J * ce,
              y: v.y + ae * ce
            }), p.push({
              x: v.x - J * ce,
              y: v.y - ae * ce
            });
          }
        }
      }
    }
    return p.reverse(), [
      ...h,
      ...p
    ];
  }
  class Sv {
    constructor(n, a, i, s, c, f = 0) {
      __publicField(this, "type", "create-rectangle");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.x = n, this.y = a, this.width = i, this.height = s, this.layer = c, this.datatype = f, this.description = `Create rectangle at (${n}, ${a})`;
    }
    execute(n) {
      const a = n.library.add_rectangle(this.x, this.y, this.width, this.height, this.layer, this.datatype);
      a && (this.elementId = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), se.getState().select(a));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: i } = se.getState();
        a.has(this.elementId) && i(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  function jr(l, n) {
    const a = [], i = /* @__PURE__ */ new Set();
    for (const s of n) {
      if (s.startsWith("ref:")) {
        const p = s.split(":")[1];
        if (i.has(p)) continue;
        i.add(p);
        const g = l.get_cell_ref_info(s);
        g && (a.push({
          type: "cell-ref",
          cellName: g.cell_name,
          transform: new Float64Array(g.transform)
        }), g.free());
        continue;
      }
      const c = l.get_cell_ref_info(s);
      if (c) {
        a.push({
          type: "cell-ref",
          cellName: c.cell_name,
          transform: new Float64Array(c.transform)
        }), c.free();
        continue;
      }
      const f = l.get_text_element_info(s);
      if (f) {
        a.push({
          type: "text",
          text: f.text,
          x: f.x,
          y: f.y,
          height: f.height,
          layer: f.layer,
          datatype: f.datatype
        });
        continue;
      }
      const h = l.get_element_info(s);
      h && (a.push({
        type: "polygon",
        vertices: new Float64Array(h.vertices),
        layer: h.layer,
        datatype: h.datatype
      }), h.free());
    }
    return a;
  }
  function zs(l, n) {
    const a = [];
    for (const i of n) if (i.type === "cell-ref") {
      const s = l.add_cell_ref_with_transform(i.cellName, i.transform);
      s && a.push(s);
    } else if (i.type === "text") {
      const s = l.add_text(i.text, i.x, i.y, i.height, i.layer, i.datatype);
      s && a.push(s);
    } else {
      const s = l.add_polygon(i.vertices, i.layer, i.datatype);
      s && a.push(s);
    }
    return a;
  }
  class Is {
    constructor(n) {
      __publicField(this, "type", "delete-elements");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "restoredIds", []);
      this.elementIds = n;
      const a = n.length;
      this.description = a === 1 ? "Delete element" : `Delete ${a} elements`;
    }
    execute(n) {
      const a = this.restoredIds.length > 0 ? this.restoredIds : this.elementIds;
      this.snapshots.length === 0 && (this.snapshots = jr(n.library, a)), n.library.remove_elements(a), this.restoredIds = [], en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), se.getState().clearSelection();
    }
    undo(n) {
      this.restoredIds = zs(n.library, this.snapshots), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.restoredIds.length > 0 && se.getState().setSelection(new Set(this.restoredIds));
    }
  }
  class Hs {
    constructor() {
      __publicField(this, "type", "paste-elements");
      __publicField(this, "description");
      __publicField(this, "createdIds", []);
      __publicField(this, "snapshots");
      const { elements: n } = Gn.getState();
      this.snapshots = n.map((i) => i.type === "cell-ref" ? {
        type: "cell-ref",
        cellName: i.cellName,
        transform: new Float64Array(i.transform)
      } : i.type === "text" ? {
        ...i
      } : {
        type: "polygon",
        vertices: new Float64Array(i.vertices),
        layer: i.layer,
        datatype: i.datatype
      });
      const a = this.snapshots.length;
      this.description = a === 1 ? "Paste element" : `Paste ${a} elements`;
    }
    execute(n) {
      this.snapshots.length !== 0 && (this.createdIds = zs(n.library, this.snapshots), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && se.getState().setSelection(new Set(this.createdIds)));
    }
    undo(n) {
      n.library.remove_elements(this.createdIds), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), se.getState().clearSelection();
    }
  }
  class Ys {
    constructor(n) {
      __publicField(this, "type", "duplicate-elements");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "createdIds", []);
      this.elementIds = n;
      const a = n.length;
      this.description = a === 1 ? "Duplicate element" : `Duplicate ${a} elements`;
    }
    execute(n) {
      this.snapshots.length === 0 && (this.snapshots = jr(n.library, this.elementIds)), this.createdIds = zs(n.library, this.snapshots), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && se.getState().setSelection(new Set(this.createdIds));
    }
    undo(n) {
      n.library.remove_elements(this.createdIds), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.elementIds.length > 0 ? se.getState().setSelection(new Set(this.elementIds)) : se.getState().clearSelection();
    }
  }
  class wv {
    constructor(n, a, i = 0) {
      __publicField(this, "type", "create-polygon");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.points = n, this.layer = a, this.datatype = i, this.description = `Create polygon with ${n.length / 2} vertices`;
    }
    execute(n) {
      const a = n.library.add_polygon(this.points, this.layer, this.datatype);
      a && (this.elementId = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), se.getState().select(a));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: i } = se.getState();
        a.has(this.elementId) && i(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  function Pg(l) {
    const n = l / ve / 1e3;
    return n.toFixed(n >= 10 ? 1 : n >= 1 ? 2 : 3);
  }
  function Cv(l, n) {
    if (n <= 0) return;
    const a = HS(l, n);
    if (a.length === 0) return;
    const i = Pg(n), s = Math.min(...a.map((h) => h.actual)), c = Pg(s), f = a.length === 1 ? `Bend radius reduced to ${c} \xB5m at corner ${a[0].cornerIndex} (requested ${i} \xB5m)` : `Bend radius reduced at ${a.length} corners (min ${c} \xB5m, requested ${i} \xB5m)`;
    $t.getState().show(f, "warn");
  }
  class US {
    constructor(n, a, i, s = 0, c, f = 0, h = jf) {
      __publicField(this, "type", "create-path");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      __publicField(this, "metadata", null);
      this.points = n, this.width = a, this.layer = i, this.datatype = s, this.waypoints = c, this.cornerRadius = f, this.numArcPoints = h, this.description = `Create path with ${n.length / 2} waypoints`;
    }
    execute(n) {
      const a = n.library.create_path_rounded(this.points, this.width, this.cornerRadius, this.numArcPoints, this.layer, this.datatype);
      a && (this.elementId = a, this.metadata ? dn.getState().setPathMetadata(a, this.metadata) : this.waypoints && (this.metadata = {
        waypoints: this.waypoints,
        width: this.width,
        cornerRadius: this.cornerRadius,
        numArcPoints: this.numArcPoints,
        layer: this.layer,
        datatype: this.datatype
      }, dn.getState().setPathMetadata(a, this.metadata)), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), se.getState().select(a), this.waypoints && Cv(this.waypoints, this.cornerRadius));
    }
    undo(n) {
      if (this.elementId) {
        this.metadata || (this.metadata = dn.getState().pathMetadata.get(this.elementId) ?? null), dn.getState().removePathMetadata(this.elementId), n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: i } = se.getState();
        a.has(this.elementId) && i(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class ss {
    constructor(n, a, i, s) {
      __publicField(this, "type", "edit-path");
      __publicField(this, "description");
      __publicField(this, "currentId");
      __publicField(this, "oldMeta");
      __publicField(this, "newMeta");
      this.currentId = n, this.oldMeta = a, this.newMeta = i, this.description = s;
    }
    execute(n) {
      this.currentId = this.rebuildPath(n, this.currentId, this.newMeta);
    }
    undo(n) {
      this.currentId = this.rebuildPath(n, this.currentId, this.oldMeta);
    }
    rebuildPath(n, a, i) {
      const s = new Float64Array(i.waypoints.length * 2);
      for (let f = 0; f < i.waypoints.length; f++) s[f * 2] = i.waypoints[f].x, s[f * 2 + 1] = i.waypoints[f].y;
      n.library.remove_element(a);
      const c = n.library.create_path_rounded(s, i.width, i.cornerRadius, i.numArcPoints ?? jf, i.layer, i.datatype);
      return c ? (dn.getState().removePathMetadata(a), dn.getState().setPathMetadata(c, {
        ...i
      }), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), se.getState().select(c), Cv(i.waypoints, i.cornerRadius), c) : (n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), a);
    }
  }
  class BS {
    constructor(n, a, i) {
      __publicField(this, "type", "move-elements");
      __publicField(this, "description");
      this.elementIds = n, this.deltaX = a, this.deltaY = i;
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
  class XS {
    constructor(n, a) {
      __publicField(this, "type", "create-ruler");
      __publicField(this, "description", "Create ruler");
      __publicField(this, "ruler");
      __publicField(this, "alreadyCreated");
      "id" in n ? (this.ruler = n, this.alreadyCreated = true) : (this.ruler = {
        id: "",
        start: n,
        end: a
      }, this.alreadyCreated = false);
    }
    execute(n) {
      if (this.alreadyCreated) {
        const { rulers: a } = ke.getState();
        a.has(this.ruler.id) || ke.setState((i) => {
          const s = new Map(i.rulers);
          return s.set(this.ruler.id, this.ruler), {
            rulers: s
          };
        });
      } else {
        const a = ke.getState().addRuler(this.ruler.start, this.ruler.end);
        this.ruler = {
          ...this.ruler,
          id: a
        };
      }
    }
    undo(n) {
      ke.getState().removeRuler(this.ruler.id);
    }
    getRulerId() {
      return this.ruler.id;
    }
  }
  class Rf {
    constructor(n) {
      __publicField(this, "type", "delete-rulers");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "restoredIds", []);
      this.rulerIds = n;
      const a = n.length;
      this.description = a === 1 ? "Delete ruler" : `Delete ${a} rulers`;
    }
    execute(n) {
      const { rulers: a, removeRulers: i } = ke.getState(), s = this.restoredIds.length > 0 ? this.restoredIds : this.rulerIds;
      if (this.snapshots.length === 0) for (const c of s) {
        const f = a.get(c);
        f && this.snapshots.push({
          ...f
        });
      }
      i(s), this.restoredIds = [];
    }
    undo(n) {
      const a = ke.getState().restoreRulers(this.snapshots);
      this.restoredIds = a, a.length > 0 && ke.getState().setSelection(new Set(a));
    }
  }
  class Ev {
    constructor(n, a, i) {
      __publicField(this, "type", "move-rulers");
      __publicField(this, "description");
      this.rulerIds = n, this.deltaX = a, this.deltaY = i;
      const s = n.length;
      this.description = s === 1 ? "Move ruler" : `Move ${s} rulers`;
    }
    execute(n) {
      this.applyDelta(this.deltaX, this.deltaY);
    }
    undo(n) {
      this.applyDelta(-this.deltaX, -this.deltaY);
    }
    applyDelta(n, a) {
      ke.setState((i) => {
        const s = new Map(i.rulers);
        for (const c of this.rulerIds) {
          const f = s.get(c);
          f && s.set(c, {
            ...f,
            start: {
              x: f.start.x + n,
              y: f.start.y + a
            },
            end: {
              x: f.end.x + n,
              y: f.end.y + a
            }
          });
        }
        return {
          rulers: s
        };
      });
    }
  }
  class _v {
    constructor(n, a, i, s) {
      __publicField(this, "type", "move-ruler-endpoint");
      __publicField(this, "description", "Move ruler endpoint");
      this.rulerId = n, this.endpoint = a, this.oldPosition = i, this.newPosition = s;
    }
    execute(n) {
      ke.getState().updateEndpoint(this.rulerId, this.endpoint, this.newPosition);
    }
    undo(n) {
      ke.getState().updateEndpoint(this.rulerId, this.endpoint, this.oldPosition);
    }
  }
  class Mv {
    constructor(n, a) {
      __publicField(this, "type", "add-layer");
      __publicField(this, "description", "Add layer");
      __publicField(this, "createdLayer", null);
      this.name = n, this.color = a;
    }
    execute(n) {
      this.createdLayer ? (me.getState().setLayer(this.createdLayer), me.getState().setActiveLayer(this.createdLayer.id)) : this.createdLayer = me.getState().addLayer(this.name, this.color);
    }
    undo(n) {
      this.createdLayer && me.getState().deleteLayer(this.createdLayer.id);
    }
  }
  class kv {
    constructor(n) {
      __publicField(this, "type", "delete-layer");
      __publicField(this, "description");
      __publicField(this, "snapshot", null);
      __publicField(this, "elementSnapshots", []);
      __publicField(this, "restoredElementIds", []);
      this.layerId = n, this.description = "Delete layer";
    }
    execute(n) {
      const a = me.getState();
      if (this.snapshot = a.getLayer(this.layerId) ?? null, !this.snapshot) return;
      const i = this.restoredElementIds.length > 0 ? this.restoredElementIds : n.library.get_elements_on_layer(this.snapshot.layerNumber, this.snapshot.datatype);
      if (this.elementSnapshots.length === 0) for (const s of i) {
        const c = n.library.get_element_info(s);
        c && (this.elementSnapshots.push({
          vertices: new Float64Array(c.vertices),
          layer: c.layer,
          datatype: c.datatype
        }), c.free());
      }
      n.library.remove_elements(i), this.restoredElementIds = [], n.library.remove_layer_color(this.snapshot.layerNumber, this.snapshot.datatype), a.deleteLayer(this.layerId), se.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      if (!this.snapshot) return;
      me.getState().setLayer(this.snapshot), me.getState().setActiveLayer(this.snapshot.id), cf(this.snapshot, n);
      const a = [];
      for (const i of this.elementSnapshots) {
        const s = n.library.add_polygon(i.vertices, i.layer, i.datatype);
        s && a.push(s);
      }
      this.restoredElementIds = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  function cf(l, n) {
    const a = l.visible ? l.opacity : 0, [i, s, c, f] = Ds(l.color, a);
    n.library.set_layer_color(l.layerNumber, l.datatype, i, s, c, f), n.library.set_layer_fill_pattern(l.layerNumber, l.datatype, rf[l.fillPattern ?? "solid"] ?? 0);
  }
  class jv {
    constructor(n, a) {
      __publicField(this, "type", "edit-layer");
      __publicField(this, "description");
      this.oldLayer = n, this.newLayer = a, this.description = `Edit layer "${n.name}"`;
    }
    execute(n) {
      const a = me.getState();
      (this.oldLayer.layerNumber !== this.newLayer.layerNumber || this.oldLayer.datatype !== this.newLayer.datatype) && n.library.remove_layer_color(this.oldLayer.layerNumber, this.oldLayer.datatype), a.setLayer(this.newLayer), cf(this.newLayer, n), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      const a = me.getState();
      (this.oldLayer.layerNumber !== this.newLayer.layerNumber || this.oldLayer.datatype !== this.newLayer.datatype) && n.library.remove_layer_color(this.newLayer.layerNumber, this.newLayer.datatype), a.setLayer(this.oldLayer), cf(this.oldLayer, n), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Qg {
    constructor(n, a, i) {
      __publicField(this, "type", "change-element-layer");
      __publicField(this, "description");
      __publicField(this, "originals", []);
      __publicField(this, "newIds", []);
      this.elementIds = n, this.newLayer = a, this.newDatatype = i;
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
        const f = n.library.get_element_info(s);
        f && (this.originals.push({
          id: s,
          snapshot: {
            vertices: new Float64Array(f.vertices),
            layer: f.layer,
            datatype: f.datatype
          }
        }), f.free());
      }
      const a = this.newIds.length > 0 ? this.newIds : this.elementIds;
      n.library.remove_elements(a);
      const i = [];
      for (const { snapshot: s } of this.originals) {
        let c;
        "type" in s && s.type === "text" ? c = n.library.add_text(s.text, s.x, s.y, s.height, this.newLayer, this.newDatatype) : c = n.library.add_polygon(s.vertices, this.newLayer, this.newDatatype), c && i.push(c);
      }
      this.newIds = i, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), i.length > 0 && se.getState().setSelection(new Set(i));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const a = [];
      for (const { snapshot: i } of this.originals) {
        let s;
        "type" in i && i.type === "text" ? s = n.library.add_text(i.text, i.x, i.y, i.height, i.layer, i.datatype) : s = n.library.add_polygon(i.vertices, i.layer, i.datatype), s && a.push(s);
      }
      this.newIds = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), a.length > 0 && se.getState().setSelection(new Set(a));
    }
  }
  class VS {
    constructor(n, a, i, s) {
      __publicField(this, "type", "resize-elements");
      __publicField(this, "description");
      __publicField(this, "originals", []);
      __publicField(this, "newIds", []);
      this.elementIds = n, this.oldBounds = a, this.newWidth = i, this.newHeight = s;
      const c = n.length;
      this.description = c === 1 ? "Resize element" : `Resize ${c} elements`;
    }
    execute(n) {
      if (this.originals.length === 0) for (const p of this.elementIds) {
        const g = n.library.get_element_info(p);
        g && (this.originals.push({
          id: p,
          snapshot: {
            vertices: new Float64Array(g.vertices),
            layer: g.layer,
            datatype: g.datatype
          }
        }), g.free());
      }
      const a = this.oldBounds.maxX - this.oldBounds.minX, i = this.oldBounds.maxY - this.oldBounds.minY, s = a !== 0 ? this.newWidth / a : 1, c = i !== 0 ? this.newHeight / i : 1, f = this.newIds.length > 0 ? this.newIds : this.elementIds;
      n.library.remove_elements(f);
      const h = [];
      for (const { snapshot: p } of this.originals) {
        const g = new Float64Array(p.vertices.length);
        for (let y = 0; y < p.vertices.length; y += 2) g[y] = this.oldBounds.minX + (p.vertices[y] - this.oldBounds.minX) * s, g[y + 1] = this.oldBounds.minY + (p.vertices[y + 1] - this.oldBounds.minY) * c;
        const v = n.library.add_polygon(g, p.layer, p.datatype);
        v && h.push(v);
      }
      this.newIds = h, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), h.length > 0 && se.getState().setSelection(new Set(h));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const a = [];
      for (const { snapshot: i } of this.originals) {
        const s = n.library.add_polygon(i.vertices, i.layer, i.datatype);
        s && a.push(s);
      }
      this.newIds = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), a.length > 0 && se.getState().setSelection(new Set(a));
    }
  }
  class cd {
    constructor(n, a, i) {
      __publicField(this, "type", "edit-vertices");
      __publicField(this, "description");
      __publicField(this, "original", null);
      __publicField(this, "currentId");
      this.newVertices = a, this.currentId = n, this.description = i ?? "Edit vertices";
    }
    execute(n) {
      if (!this.original) {
        const i = n.library.get_element_info(this.currentId);
        if (!i) return;
        this.original = {
          vertices: new Float64Array(i.vertices),
          layer: i.layer,
          datatype: i.datatype
        }, i.free();
      }
      n.library.remove_element(this.currentId);
      const a = n.library.add_polygon(this.newVertices, this.original.layer, this.original.datatype);
      a && (this.currentId = a, se.getState().setSelection(/* @__PURE__ */ new Set([
        a
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      if (!this.original) return;
      n.library.remove_element(this.currentId);
      const a = n.library.add_polygon(this.original.vertices, this.original.layer, this.original.datatype);
      a && (this.currentId = a, se.getState().setSelection(/* @__PURE__ */ new Set([
        a
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class $S {
    constructor(n, a, i, s, c) {
      __publicField(this, "type", "move-elements-to");
      __publicField(this, "description");
      __publicField(this, "deltaX");
      __publicField(this, "deltaY");
      __publicField(this, "currentIds");
      this.currentIds = [
        ...n
      ], this.deltaX = s - a, this.deltaY = c - i, this.description = n.length === 1 ? "Move element" : `Move ${n.length} elements`;
    }
    execute(n) {
      n.library.translate_elements(this.currentIds, this.deltaX, this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.translate_elements(this.currentIds, -this.deltaX, -this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  function en(l) {
    const n = l.get_cell_tree();
    n && ye.getState().setCellTree(n);
  }
  class Rv {
    constructor(n) {
      __publicField(this, "type", "add-cell");
      __publicField(this, "description");
      __publicField(this, "cellName");
      this.cellName = n, this.description = `Add cell "${n}"`;
    }
    execute(n) {
      n.library.add_cell(this.cellName), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.remove_cell(this.cellName), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Lv {
    constructor(n) {
      __publicField(this, "type", "delete-cell");
      __publicField(this, "description");
      __publicField(this, "cellName");
      this.cellName = n, this.description = `Delete cell "${n}"`;
    }
    execute(n) {
      n.library.remove_cell(this.cellName), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.add_cell(this.cellName), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class qS {
    constructor(n, a, i, s) {
      __publicField(this, "type", "set-cell-origin");
      __publicField(this, "description", "Set cell origin");
      this.oldX = n, this.oldY = a, this.newX = i, this.newY = s;
    }
    execute(n) {
      n.library.set_cell_origin(this.newX, this.newY), n.renderer.set_crosshair_origin(this.newX, this.newY), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_cell_origin(this.oldX, this.oldY), n.renderer.set_crosshair_origin(this.oldX, this.oldY), n.renderer.mark_dirty();
    }
  }
  class Av {
    constructor(n, a) {
      __publicField(this, "type", "rename-cell");
      __publicField(this, "description");
      this.oldName = n, this.newName = a, this.description = `Rename cell "${n}" to "${a}"`;
    }
    execute(n) {
      n.library.rename_cell(this.oldName, this.newName), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.rename_cell(this.newName, this.oldName), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Tv {
    constructor(n, a, i) {
      __publicField(this, "type", "add-cell-ref");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.cellName = n, this.x = a, this.y = i, this.description = `Place instance of "${n}"`;
    }
    execute(n) {
      const a = n.library.add_cell_ref(this.cellName, this.x, this.y);
      if (a) {
        this.elementId = a, en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const i = n.library.get_element_index(a);
        i >= 0 && se.getState().select(`ref:${i}:0`);
      }
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), en(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: i } = se.getState();
        a.has(this.elementId) && i(this.elementId);
      }
    }
  }
  function un(l) {
    return Math.round(l / ve) * ve;
  }
  function Lf() {
    const { activeLayerId: l, layers: n } = me.getState(), a = n.get(l);
    return {
      layerNumber: (a == null ? void 0 : a.layerNumber) ?? 1,
      datatype: (a == null ? void 0 : a.datatype) ?? 0
    };
  }
  function Af(l) {
    const { zoom: n, offset: a } = ze.getState(), i = l.getBoundingClientRect(), s = (i.width / 2 - a.x) / n, c = (i.height / 2 - a.y) / n, f = i.width / n, h = i.height / n, p = Math.max(un(f * 0.1 / 2), ve), g = Math.max(un(h * 0.1 / 2), ve);
    return {
      centerX: s,
      centerY: c,
      halfW: p,
      halfH: g
    };
  }
  function Nv(l, n, a) {
    const { centerX: i, centerY: s, halfW: c, halfH: f } = Af(a), h = c * 2, p = f * 2, g = un(i - c), v = un(s - f), { layerNumber: y, datatype: S } = Lf(), E = new Sv(g, v, h, p, y, S);
    fe.getState().execute(E, {
      library: l,
      renderer: n
    });
  }
  function Ov(l, n, a) {
    const { centerX: i, centerY: s, halfW: c, halfH: f } = Af(a), h = new Float64Array([
      un(i - c),
      un(s - f),
      un(i + c),
      un(s - f),
      un(i),
      un(s + f)
    ]), { layerNumber: p, datatype: g } = Lf(), v = new wv(h, p, g);
    fe.getState().execute(v, {
      library: l,
      renderer: n
    });
  }
  function Dv(l, n, a) {
    const { centerX: i, centerY: s, halfH: c } = Af(a), f = Math.max(un(c), ve), { layerNumber: h, datatype: p } = Lf(), g = new zv("Text", un(i), un(s), f, h, p);
    fe.getState().execute(g, {
      library: l,
      renderer: n
    }), Ce.getState().bumpSyncGeneration();
  }
  class zv {
    constructor(n, a, i, s, c, f = 0) {
      __publicField(this, "type", "create-text");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.text = n, this.x = a, this.y = i, this.height = s, this.layer = c, this.datatype = f, this.description = `Create text "${n.slice(0, 20)}" at (${a}, ${i})`;
    }
    execute(n) {
      const a = n.library.add_text(this.text, this.x, this.y, this.height, this.layer, this.datatype);
      a && (this.elementId = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), se.getState().select(a));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: i } = se.getState();
        a.has(this.elementId) && i(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class GS {
    constructor(n, a, i) {
      __publicField(this, "type", "update-text-content");
      __publicField(this, "description", "Update text content");
      this.elementId = n, this.oldText = a, this.newText = i;
    }
    execute(n) {
      n.library.update_text(this.elementId, this.newText), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.update_text(this.elementId, this.oldText), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class ZS {
    constructor(n, a, i, s, c) {
      __publicField(this, "type", "move-text");
      __publicField(this, "description", "Move text");
      this.elementId = n, this.oldX = a, this.oldY = i, this.newX = s, this.newY = c;
    }
    execute(n) {
      n.library.set_text_position(this.elementId, this.newX, this.newY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_text_position(this.elementId, this.oldX, this.oldY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class KS {
    constructor(n, a, i) {
      __publicField(this, "type", "set-text-height");
      __publicField(this, "description", "Set text height");
      this.elementId = n, this.oldHeight = a, this.newHeight = i;
    }
    execute(n) {
      n.library.set_text_height(this.elementId, this.newHeight), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_text_height(this.elementId, this.oldHeight), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Iv {
    constructor(n, a, i) {
      __publicField(this, "type", "align-elements");
      __publicField(this, "description");
      __publicField(this, "deltas", []);
      this.selectedIds = n, this.referenceId = a, this.alignType = i, this.description = `Align elements (${i})`;
    }
    execute(n) {
      this.deltas.length === 0 && (this.deltas = OS(n.library, this.selectedIds, this.referenceId, this.alignType));
      for (const a of this.deltas) n.library.translate_elements(a.ids, a.dx, a.dy);
      n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      for (let a = this.deltas.length - 1; a >= 0; a--) {
        const i = this.deltas[a];
        n.library.translate_elements(i.ids, -i.dx, -i.dy);
      }
      n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Hv {
    constructor(n, a, i) {
      __publicField(this, "type", "boolean-operation");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "currentIds");
      __publicField(this, "currentBaseId");
      __publicField(this, "resultIds", []);
      this.operation = a, this.description = `Boolean ${a}`, this.currentIds = [
        ...n
      ], this.currentBaseId = i;
    }
    execute(n) {
      this.snapshots.length === 0 && (this.snapshots = jr(n.library, this.currentIds)), this.resultIds = n.library.boolean_operation(this.currentIds, this.operation, this.currentBaseId), this.resultIds.length > 0 ? se.getState().selectAll(this.resultIds) : se.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      this.resultIds.length > 0 && n.library.remove_elements(this.resultIds);
      const a = zs(n.library, this.snapshots), i = this.currentIds.indexOf(this.currentBaseId);
      this.currentIds = a, i >= 0 && i < a.length && (this.currentBaseId = a[i]), this.resultIds = [], se.getState().selectAll(a), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  const qt = gt()((l) => ({
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
  })), uf = gt()((l, n) => ({
    stack: [],
    claim: (a) => l((i) => ({
      stack: i.stack.includes(a) ? i.stack : [
        ...i.stack,
        a
      ]
    })),
    release: (a) => l((i) => ({
      stack: i.stack.filter((s) => s !== a)
    })),
    isCanvasActive: () => n().stack.length === 0
  })), It = gt((l) => ({
    activeText: null,
    showCursor: true,
    isEditingText: false,
    startEditing: (n, a) => l({
      activeText: {
        x: n,
        y: a,
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
  function Yv(l) {
    var n, a, i = "";
    if (typeof l == "string" || typeof l == "number") i += l;
    else if (typeof l == "object") if (Array.isArray(l)) {
      var s = l.length;
      for (n = 0; n < s; n++) l[n] && (a = Yv(l[n])) && (i && (i += " "), i += a);
    } else for (a in l) l[a] && (i && (i += " "), i += a);
    return i;
  }
  function PS() {
    for (var l, n, a = 0, i = "", s = arguments.length; a < s; a++) (l = arguments[a]) && (n = Yv(l)) && (i && (i += " "), i += n);
    return i;
  }
  const Tf = "-", QS = (l) => {
    const n = WS(l), { conflictingClassGroups: a, conflictingClassGroupModifiers: i } = l;
    return {
      getClassGroupId: (f) => {
        const h = f.split(Tf);
        return h[0] === "" && h.length !== 1 && h.shift(), Uv(h, n) || FS(f);
      },
      getConflictingClassGroupIds: (f, h) => {
        const p = a[f] || [];
        return h && i[f] ? [
          ...p,
          ...i[f]
        ] : p;
      }
    };
  }, Uv = (l, n) => {
    var _a;
    if (l.length === 0) return n.classGroupId;
    const a = l[0], i = n.nextPart.get(a), s = i ? Uv(l.slice(1), i) : void 0;
    if (s) return s;
    if (n.validators.length === 0) return;
    const c = l.join(Tf);
    return (_a = n.validators.find(({ validator: f }) => f(c))) == null ? void 0 : _a.classGroupId;
  }, Fg = /^\[(.+)\]$/, FS = (l) => {
    if (Fg.test(l)) {
      const n = Fg.exec(l)[1], a = n == null ? void 0 : n.substring(0, n.indexOf(":"));
      if (a) return "arbitrary.." + a;
    }
  }, WS = (l) => {
    const { theme: n, prefix: a } = l, i = {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    };
    return e2(Object.entries(l.classGroups), a).forEach(([c, f]) => {
      df(f, i, c, n);
    }), i;
  }, df = (l, n, a, i) => {
    l.forEach((s) => {
      if (typeof s == "string") {
        const c = s === "" ? n : Wg(n, s);
        c.classGroupId = a;
        return;
      }
      if (typeof s == "function") {
        if (JS(s)) {
          df(s(i), n, a, i);
          return;
        }
        n.validators.push({
          validator: s,
          classGroupId: a
        });
        return;
      }
      Object.entries(s).forEach(([c, f]) => {
        df(f, Wg(n, c), a, i);
      });
    });
  }, Wg = (l, n) => {
    let a = l;
    return n.split(Tf).forEach((i) => {
      a.nextPart.has(i) || a.nextPart.set(i, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      }), a = a.nextPart.get(i);
    }), a;
  }, JS = (l) => l.isThemeGetter, e2 = (l, n) => n ? l.map(([a, i]) => {
    const s = i.map((c) => typeof c == "string" ? n + c : typeof c == "object" ? Object.fromEntries(Object.entries(c).map(([f, h]) => [
      n + f,
      h
    ])) : c);
    return [
      a,
      s
    ];
  }) : l, t2 = (l) => {
    if (l < 1) return {
      get: () => {
      },
      set: () => {
      }
    };
    let n = 0, a = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
    const s = (c, f) => {
      a.set(c, f), n++, n > l && (n = 0, i = a, a = /* @__PURE__ */ new Map());
    };
    return {
      get(c) {
        let f = a.get(c);
        if (f !== void 0) return f;
        if ((f = i.get(c)) !== void 0) return s(c, f), f;
      },
      set(c, f) {
        a.has(c) ? a.set(c, f) : s(c, f);
      }
    };
  }, Bv = "!", n2 = (l) => {
    const { separator: n, experimentalParseClassName: a } = l, i = n.length === 1, s = n[0], c = n.length, f = (h) => {
      const p = [];
      let g = 0, v = 0, y;
      for (let C = 0; C < h.length; C++) {
        let _ = h[C];
        if (g === 0) {
          if (_ === s && (i || h.slice(C, C + c) === n)) {
            p.push(h.slice(v, C)), v = C + c;
            continue;
          }
          if (_ === "/") {
            y = C;
            continue;
          }
        }
        _ === "[" ? g++ : _ === "]" && g--;
      }
      const S = p.length === 0 ? h : h.substring(v), E = S.startsWith(Bv), k = E ? S.substring(1) : S, w = y && y > v ? y - v : void 0;
      return {
        modifiers: p,
        hasImportantModifier: E,
        baseClassName: k,
        maybePostfixModifierPosition: w
      };
    };
    return a ? (h) => a({
      className: h,
      parseClassName: f
    }) : f;
  }, l2 = (l) => {
    if (l.length <= 1) return l;
    const n = [];
    let a = [];
    return l.forEach((i) => {
      i[0] === "[" ? (n.push(...a.sort(), i), a = []) : a.push(i);
    }), n.push(...a.sort()), n;
  }, r2 = (l) => ({
    cache: t2(l.cacheSize),
    parseClassName: n2(l),
    ...QS(l)
  }), a2 = /\s+/, o2 = (l, n) => {
    const { parseClassName: a, getClassGroupId: i, getConflictingClassGroupIds: s } = n, c = [], f = l.trim().split(a2);
    let h = "";
    for (let p = f.length - 1; p >= 0; p -= 1) {
      const g = f[p], { modifiers: v, hasImportantModifier: y, baseClassName: S, maybePostfixModifierPosition: E } = a(g);
      let k = !!E, w = i(k ? S.substring(0, E) : S);
      if (!w) {
        if (!k) {
          h = g + (h.length > 0 ? " " + h : h);
          continue;
        }
        if (w = i(S), !w) {
          h = g + (h.length > 0 ? " " + h : h);
          continue;
        }
        k = false;
      }
      const C = l2(v).join(":"), _ = y ? C + Bv : C, R = _ + w;
      if (c.includes(R)) continue;
      c.push(R);
      const A = s(w, k);
      for (let T = 0; T < A.length; ++T) {
        const B = A[T];
        c.push(_ + B);
      }
      h = g + (h.length > 0 ? " " + h : h);
    }
    return h;
  };
  function i2() {
    let l = 0, n, a, i = "";
    for (; l < arguments.length; ) (n = arguments[l++]) && (a = Xv(n)) && (i && (i += " "), i += a);
    return i;
  }
  const Xv = (l) => {
    if (typeof l == "string") return l;
    let n, a = "";
    for (let i = 0; i < l.length; i++) l[i] && (n = Xv(l[i])) && (a && (a += " "), a += n);
    return a;
  };
  function s2(l, ...n) {
    let a, i, s, c = f;
    function f(p) {
      const g = n.reduce((v, y) => y(v), l());
      return a = r2(g), i = a.cache.get, s = a.cache.set, c = h, h(p);
    }
    function h(p) {
      const g = i(p);
      if (g) return g;
      const v = o2(p, a);
      return s(p, v), v;
    }
    return function() {
      return c(i2.apply(null, arguments));
    };
  }
  const ct = (l) => {
    const n = (a) => a[l] || [];
    return n.isThemeGetter = true, n;
  }, Vv = /^\[(?:([a-z-]+):)?(.+)\]$/i, c2 = /^\d+\/\d+$/, u2 = /* @__PURE__ */ new Set([
    "px",
    "full",
    "screen"
  ]), d2 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, f2 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, h2 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, m2 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, p2 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, pl = (l) => Sa(l) || u2.has(l) || c2.test(l), Zl = (l) => Ca(l, "length", C2), Sa = (l) => !!l && !Number.isNaN(Number(l)), ud = (l) => Ca(l, "number", Sa), Co = (l) => !!l && Number.isInteger(Number(l)), g2 = (l) => l.endsWith("%") && Sa(l.slice(0, -1)), Te = (l) => Vv.test(l), Kl = (l) => d2.test(l), y2 = /* @__PURE__ */ new Set([
    "length",
    "size",
    "percentage"
  ]), b2 = (l) => Ca(l, y2, $v), v2 = (l) => Ca(l, "position", $v), x2 = /* @__PURE__ */ new Set([
    "image",
    "url"
  ]), S2 = (l) => Ca(l, x2, _2), w2 = (l) => Ca(l, "", E2), Eo = () => true, Ca = (l, n, a) => {
    const i = Vv.exec(l);
    return i ? i[1] ? typeof n == "string" ? i[1] === n : n.has(i[1]) : a(i[2]) : false;
  }, C2 = (l) => f2.test(l) && !h2.test(l), $v = () => false, E2 = (l) => m2.test(l), _2 = (l) => p2.test(l), M2 = () => {
    const l = ct("colors"), n = ct("spacing"), a = ct("blur"), i = ct("brightness"), s = ct("borderColor"), c = ct("borderRadius"), f = ct("borderSpacing"), h = ct("borderWidth"), p = ct("contrast"), g = ct("grayscale"), v = ct("hueRotate"), y = ct("invert"), S = ct("gap"), E = ct("gradientColorStops"), k = ct("gradientColorStopPositions"), w = ct("inset"), C = ct("margin"), _ = ct("opacity"), R = ct("padding"), A = ct("saturate"), T = ct("scale"), B = ct("sepia"), N = ct("skew"), L = ct("space"), U = ct("translate"), X = () => [
      "auto",
      "contain",
      "none"
    ], J = () => [
      "auto",
      "hidden",
      "clip",
      "visible",
      "scroll"
    ], ae = () => [
      "auto",
      Te,
      n
    ], te = () => [
      Te,
      n
    ], ce = () => [
      "",
      pl,
      Zl
    ], ie = () => [
      "auto",
      Sa,
      Te
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
    ], P = () => [
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
    ], ue = () => [
      "start",
      "end",
      "center",
      "between",
      "around",
      "evenly",
      "stretch"
    ], xe = () => [
      "",
      "0",
      Te
    ], be = () => [
      "auto",
      "avoid",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "column"
    ], j = () => [
      Sa,
      Te
    ];
    return {
      cacheSize: 500,
      separator: ":",
      theme: {
        colors: [
          Eo
        ],
        spacing: [
          pl,
          Zl
        ],
        blur: [
          "none",
          "",
          Kl,
          Te
        ],
        brightness: j(),
        borderColor: [
          l
        ],
        borderRadius: [
          "none",
          "",
          "full",
          Kl,
          Te
        ],
        borderSpacing: te(),
        borderWidth: ce(),
        contrast: j(),
        grayscale: xe(),
        hueRotate: j(),
        invert: xe(),
        gap: te(),
        gradientColorStops: [
          l
        ],
        gradientColorStopPositions: [
          g2,
          Zl
        ],
        inset: ae(),
        margin: ae(),
        opacity: j(),
        padding: te(),
        saturate: j(),
        scale: j(),
        sepia: xe(),
        skew: j(),
        space: te(),
        translate: te()
      },
      classGroups: {
        aspect: [
          {
            aspect: [
              "auto",
              "square",
              "video",
              Te
            ]
          }
        ],
        container: [
          "container"
        ],
        columns: [
          {
            columns: [
              Kl
            ]
          }
        ],
        "break-after": [
          {
            "break-after": be()
          }
        ],
        "break-before": [
          {
            "break-before": be()
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
              Te
            ]
          }
        ],
        overflow: [
          {
            overflow: J()
          }
        ],
        "overflow-x": [
          {
            "overflow-x": J()
          }
        ],
        "overflow-y": [
          {
            "overflow-y": J()
          }
        ],
        overscroll: [
          {
            overscroll: X()
          }
        ],
        "overscroll-x": [
          {
            "overscroll-x": X()
          }
        ],
        "overscroll-y": [
          {
            "overscroll-y": X()
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
              w
            ]
          }
        ],
        "inset-x": [
          {
            "inset-x": [
              w
            ]
          }
        ],
        "inset-y": [
          {
            "inset-y": [
              w
            ]
          }
        ],
        start: [
          {
            start: [
              w
            ]
          }
        ],
        end: [
          {
            end: [
              w
            ]
          }
        ],
        top: [
          {
            top: [
              w
            ]
          }
        ],
        right: [
          {
            right: [
              w
            ]
          }
        ],
        bottom: [
          {
            bottom: [
              w
            ]
          }
        ],
        left: [
          {
            left: [
              w
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
              Co,
              Te
            ]
          }
        ],
        basis: [
          {
            basis: ae()
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
              Te
            ]
          }
        ],
        grow: [
          {
            grow: xe()
          }
        ],
        shrink: [
          {
            shrink: xe()
          }
        ],
        order: [
          {
            order: [
              "first",
              "last",
              "none",
              Co,
              Te
            ]
          }
        ],
        "grid-cols": [
          {
            "grid-cols": [
              Eo
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
                  Co,
                  Te
                ]
              },
              Te
            ]
          }
        ],
        "col-start": [
          {
            "col-start": ie()
          }
        ],
        "col-end": [
          {
            "col-end": ie()
          }
        ],
        "grid-rows": [
          {
            "grid-rows": [
              Eo
            ]
          }
        ],
        "row-start-end": [
          {
            row: [
              "auto",
              {
                span: [
                  Co,
                  Te
                ]
              },
              Te
            ]
          }
        ],
        "row-start": [
          {
            "row-start": ie()
          }
        ],
        "row-end": [
          {
            "row-end": ie()
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
              Te
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
              Te
            ]
          }
        ],
        gap: [
          {
            gap: [
              S
            ]
          }
        ],
        "gap-x": [
          {
            "gap-x": [
              S
            ]
          }
        ],
        "gap-y": [
          {
            "gap-y": [
              S
            ]
          }
        ],
        "justify-content": [
          {
            justify: [
              "normal",
              ...ue()
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
              ...ue(),
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
              ...ue(),
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
              R
            ]
          }
        ],
        px: [
          {
            px: [
              R
            ]
          }
        ],
        py: [
          {
            py: [
              R
            ]
          }
        ],
        ps: [
          {
            ps: [
              R
            ]
          }
        ],
        pe: [
          {
            pe: [
              R
            ]
          }
        ],
        pt: [
          {
            pt: [
              R
            ]
          }
        ],
        pr: [
          {
            pr: [
              R
            ]
          }
        ],
        pb: [
          {
            pb: [
              R
            ]
          }
        ],
        pl: [
          {
            pl: [
              R
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
              L
            ]
          }
        ],
        "space-x-reverse": [
          "space-x-reverse"
        ],
        "space-y": [
          {
            "space-y": [
              L
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
              Te,
              n
            ]
          }
        ],
        "min-w": [
          {
            "min-w": [
              Te,
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
              Te,
              n,
              "none",
              "full",
              "min",
              "max",
              "fit",
              "prose",
              {
                screen: [
                  Kl
                ]
              },
              Kl
            ]
          }
        ],
        h: [
          {
            h: [
              Te,
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
              Te,
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
              Te,
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
              Te,
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
              Kl,
              Zl
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
              ud
            ]
          }
        ],
        "font-family": [
          {
            font: [
              Eo
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
              Te
            ]
          }
        ],
        "line-clamp": [
          {
            "line-clamp": [
              "none",
              Sa,
              ud
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
              pl,
              Te
            ]
          }
        ],
        "list-image": [
          {
            "list-image": [
              "none",
              Te
            ]
          }
        ],
        "list-style-type": [
          {
            list: [
              "none",
              "disc",
              "decimal",
              Te
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
              pl,
              Zl
            ]
          }
        ],
        "underline-offset": [
          {
            "underline-offset": [
              "auto",
              pl,
              Te
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
            indent: te()
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
              Te
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
              Te
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
              v2
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
              b2
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
              S2
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
              h
            ]
          }
        ],
        "border-w-x": [
          {
            "border-x": [
              h
            ]
          }
        ],
        "border-w-y": [
          {
            "border-y": [
              h
            ]
          }
        ],
        "border-w-s": [
          {
            "border-s": [
              h
            ]
          }
        ],
        "border-w-e": [
          {
            "border-e": [
              h
            ]
          }
        ],
        "border-w-t": [
          {
            "border-t": [
              h
            ]
          }
        ],
        "border-w-r": [
          {
            "border-r": [
              h
            ]
          }
        ],
        "border-w-b": [
          {
            "border-b": [
              h
            ]
          }
        ],
        "border-w-l": [
          {
            "border-l": [
              h
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
              h
            ]
          }
        ],
        "divide-x-reverse": [
          "divide-x-reverse"
        ],
        "divide-y": [
          {
            "divide-y": [
              h
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
              pl,
              Te
            ]
          }
        ],
        "outline-w": [
          {
            outline: [
              pl,
              Zl
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
              pl,
              Zl
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
              Kl,
              w2
            ]
          }
        ],
        "shadow-color": [
          {
            shadow: [
              Eo
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
              ...P(),
              "plus-lighter",
              "plus-darker"
            ]
          }
        ],
        "bg-blend": [
          {
            "bg-blend": P()
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
              a
            ]
          }
        ],
        brightness: [
          {
            brightness: [
              i
            ]
          }
        ],
        contrast: [
          {
            contrast: [
              p
            ]
          }
        ],
        "drop-shadow": [
          {
            "drop-shadow": [
              "",
              "none",
              Kl,
              Te
            ]
          }
        ],
        grayscale: [
          {
            grayscale: [
              g
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
              y
            ]
          }
        ],
        saturate: [
          {
            saturate: [
              A
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
              a
            ]
          }
        ],
        "backdrop-brightness": [
          {
            "backdrop-brightness": [
              i
            ]
          }
        ],
        "backdrop-contrast": [
          {
            "backdrop-contrast": [
              p
            ]
          }
        ],
        "backdrop-grayscale": [
          {
            "backdrop-grayscale": [
              g
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
              y
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
              A
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
              f
            ]
          }
        ],
        "border-spacing-x": [
          {
            "border-spacing-x": [
              f
            ]
          }
        ],
        "border-spacing-y": [
          {
            "border-spacing-y": [
              f
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
              Te
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
              Te
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
              Te
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
              Co,
              Te
            ]
          }
        ],
        "translate-x": [
          {
            "translate-x": [
              U
            ]
          }
        ],
        "translate-y": [
          {
            "translate-y": [
              U
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
              Te
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
              Te
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
            "scroll-m": te()
          }
        ],
        "scroll-mx": [
          {
            "scroll-mx": te()
          }
        ],
        "scroll-my": [
          {
            "scroll-my": te()
          }
        ],
        "scroll-ms": [
          {
            "scroll-ms": te()
          }
        ],
        "scroll-me": [
          {
            "scroll-me": te()
          }
        ],
        "scroll-mt": [
          {
            "scroll-mt": te()
          }
        ],
        "scroll-mr": [
          {
            "scroll-mr": te()
          }
        ],
        "scroll-mb": [
          {
            "scroll-mb": te()
          }
        ],
        "scroll-ml": [
          {
            "scroll-ml": te()
          }
        ],
        "scroll-p": [
          {
            "scroll-p": te()
          }
        ],
        "scroll-px": [
          {
            "scroll-px": te()
          }
        ],
        "scroll-py": [
          {
            "scroll-py": te()
          }
        ],
        "scroll-ps": [
          {
            "scroll-ps": te()
          }
        ],
        "scroll-pe": [
          {
            "scroll-pe": te()
          }
        ],
        "scroll-pt": [
          {
            "scroll-pt": te()
          }
        ],
        "scroll-pr": [
          {
            "scroll-pr": te()
          }
        ],
        "scroll-pb": [
          {
            "scroll-pb": te()
          }
        ],
        "scroll-pl": [
          {
            "scroll-pl": te()
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
              Te
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
              pl,
              Zl,
              ud
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
  }, k2 = s2(M2);
  function q(...l) {
    return k2(PS(l));
  }
  const Jg = 38, cs = 16;
  function Zn(l) {
    const n = l.getBoundingClientRect(), { zenMode: a, explorerCollapsed: i, sidebarCollapsed: s, explorerWidth: c, sidebarWidth: f } = he.getState();
    let h = 0, p = 0;
    a || (h = i ? Jg + cs : c + cs, p = s ? Jg + cs : f + cs);
    const g = Math.max(1, n.width - h - p), v = n.height;
    return {
      width: g,
      height: v,
      screenCenter: {
        x: h + g / 2,
        y: v / 2
      }
    };
  }
  const j2 = typeof navigator < "u" && /Mac|iPod|iPhone|iPad/.test(navigator.platform), Ne = {
    mod: j2 ? "\u2318" : "Ctrl",
    shift: "\u21E7",
    backspace: "\u232B"
  };
  function _r(l, n) {
    const a = se.getState().selectedIds;
    if (a.size === 0) return;
    const i = l.get_bounds_for_ids([
      ...a
    ]);
    if (!i) return;
    const s = {
      minX: i[0],
      minY: i[1],
      maxX: i[2],
      maxY: i[3]
    }, c = Zn(n);
    ze.getState().centerOnBounds(s, c.width, c.height, c.screenCenter);
  }
  const R2 = /* @__PURE__ */ new Set([
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
  ]);
  function L2(l, n, a) {
    const i = ze((y) => y.zoomAt), s = ze((y) => y.pan), c = ze((y) => y.zoomToFit), f = ze((y) => y.zoomToSelected), h = Ht((y) => y.setTool), p = m.useRef(/* @__PURE__ */ new Set()), g = m.useRef(false), v = m.useRef(null);
    m.useEffect(() => {
      const y = () => {
        const C = p.current;
        if (C.size === 0) {
          v.current = null;
          return;
        }
        const _ = g.current ? _S : ES;
        let R = 0, A = 0;
        C.has("ArrowUp") && (A += _), C.has("ArrowDown") && (A -= _), C.has("ArrowLeft") && (R += _), C.has("ArrowRight") && (R -= _), (R !== 0 || A !== 0) && s(R, A), v.current = requestAnimationFrame(y);
      }, S = () => {
        v.current === null && p.current.size > 0 && (v.current = requestAnimationFrame(y));
      }, E = (C) => {
        const _ = l.current;
        if (!_) return;
        if (g.current = C.shiftKey, (C.metaKey || C.ctrlKey) && (C.key === "k" || C.key === "K")) {
          C.preventDefault(), qt.getState().toggle();
          return;
        }
        if (!uf.getState().isCanvasActive() || C.target instanceof HTMLInputElement || C.target instanceof HTMLTextAreaElement || It.getState().isEditingText) return;
        if (C.key === "/" && !C.metaKey && !C.ctrlKey && !C.altKey) {
          C.preventDefault(), qt.getState().open();
          return;
        }
        if (R2.has(C.key)) {
          C.preventDefault(), p.current.add(C.key), S();
          return;
        }
        const R = _.getBoundingClientRect(), A = R.width / 2, T = R.height / 2, B = C.shiftKey ? wS : Ts, N = C.shiftKey ? CS : Ns;
        switch (C.key) {
          case "=":
          case "+":
            C.preventDefault(), i(B, A, T);
            break;
          case "-":
          case "_":
            C.preventDefault(), i(N, A, T);
            break;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "a" || C.key === "A")) {
          if (C.preventDefault(), n) {
            const L = n.get_all_ids();
            se.getState().selectAll(L);
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "c" || C.key === "C") && !C.shiftKey) {
          if (C.preventDefault(), n) {
            const { selectedIds: L } = se.getState();
            if (L.size > 0) {
              const U = jr(n, L);
              Gn.getState().copy(U);
            }
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "v" || C.key === "V") && !C.shiftKey) {
          if (C.preventDefault(), n && a && _) {
            const { hasContent: L } = Gn.getState();
            if (L) {
              const U = new Hs();
              fe.getState().execute(U, {
                library: n,
                renderer: a
              }), _r(n, _);
            }
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "b" || C.key === "B") && !C.shiftKey) {
          if (C.preventDefault(), n && a && _) {
            const { selectedIds: L } = se.getState();
            if (L.size > 0) {
              const U = new Ys([
                ...L
              ]);
              fe.getState().execute(U, {
                library: n,
                renderer: a
              }), _r(n, _);
            }
          }
          return;
        }
        if (C.key === "Delete" || C.key === "Backspace") {
          C.preventDefault();
          const { selectedRulerIds: L } = ke.getState();
          if (L.size > 0 && n && a) {
            const U = new Rf([
              ...L
            ]);
            fe.getState().execute(U, {
              library: n,
              renderer: a
            });
            return;
          }
          if (n && a) {
            const { selectedIds: U } = se.getState();
            if (U.size > 0) {
              const X = new Is([
                ...U
              ]);
              fe.getState().execute(X, {
                library: n,
                renderer: a
              });
            }
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && C.key === "z" && !C.shiftKey) {
          if (C.preventDefault(), n && a) {
            const { canUndo: L, undo: U } = fe.getState();
            L && U({
              library: n,
              renderer: a
            });
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && ((C.key === "z" || C.key === "Z") && C.shiftKey || C.key === "y" || C.key === "Y")) {
          if (C.preventDefault(), n && a) {
            const { canRedo: L, redo: U } = fe.getState();
            L && U({
              library: n,
              renderer: a
            });
          }
          return;
        }
        if (C.key === "Tab") {
          if (C.preventDefault(), n && _) {
            const L = n.get_group_representative_ids();
            if (L.length > 0) {
              C.shiftKey ? se.getState().selectPrevious(L) : se.getState().selectNext(L);
              const X = se.getState().lastSelectedId;
              if (X) {
                const J = n.get_group_ids(X);
                J.length > 1 && se.setState({
                  selectedIds: new Set(J),
                  lastSelectedId: X
                });
              }
              _r(n, _);
            }
          }
          return;
        }
        if (C.key === "Enter" && (Ht.getState().activeTool === "rectangle" || Ht.getState().activeTool === "polygon" || Ht.getState().activeTool === "text")) {
          if (Date.now() - Ht.getState().toolSetAt > 2e3) return;
          if (C.preventDefault(), n && a && _) {
            const U = Ht.getState().activeTool;
            U === "rectangle" ? Nv(n, a, _) : U === "polygon" ? Ov(n, a, _) : Dv(n, a, _);
          }
          return;
        }
        if (!(C.metaKey || C.ctrlKey)) switch (C.key) {
          case "Escape":
            C.preventDefault(), ke.getState().activeRulerId ? ke.getState().cancelCreation() : ke.getState().selectedRulerIds.size > 0 ? ke.getState().clearSelection() : se.getState().selectedIds.size > 0 ? se.getState().clearSelection() : h("select");
            break;
          case "v":
          case "V":
            C.preventDefault(), h("select");
            break;
          case "p":
          case "P":
            C.preventDefault(), h("pan");
            break;
          case "q":
          case "Q":
            C.preventDefault(), h("laser");
            break;
          case "z":
          case "Z":
            C.preventDefault(), h("zoom");
            break;
          case "r":
          case "R":
            C.preventDefault(), h("rectangle");
            break;
          case "m":
          case "M":
            C.preventDefault(), h("move");
            break;
          case "g":
          case "G":
            C.preventDefault(), h("polygon");
            break;
          case "h":
          case "H":
            C.preventDefault(), h("path");
            break;
          case "t":
            C.preventDefault(), h("text");
            break;
          case "u":
          case "U":
            C.preventDefault(), h("ruler");
            break;
          case "i":
            C.preventDefault(), qt.getState().open("add instance ");
            break;
          case "f":
            if (C.preventDefault(), n && _) {
              const L = n.get_all_bounds(), U = L ? {
                minX: L[0],
                minY: L[1],
                maxX: L[2],
                maxY: L[3]
              } : null, X = Zn(_);
              c(U, X.width, X.height, X.screenCenter);
            }
            break;
          case "F":
            if (C.preventDefault(), n && _) {
              const L = se.getState().selectedIds;
              if (L.size > 0) {
                const U = n.get_bounds_for_ids([
                  ...L
                ]), X = U ? {
                  minX: U[0],
                  minY: U[1],
                  maxX: U[2],
                  maxY: U[3]
                } : null, J = Zn(_);
                f(X, J.width, J.height, J.screenCenter);
              }
            }
            break;
          case "e":
          case "E":
            C.preventDefault(), se.getState().selectedIds.size > 0 && he.getState().requestInspectorFocus();
            break;
          case "L":
            C.preventDefault(), he.getState().setSidebarTab("layers");
            break;
          case "I":
            C.preventDefault(), he.getState().setSidebarTab("inspector");
            break;
        }
      }, k = (C) => {
        g.current = C.shiftKey, p.current.delete(C.key);
      }, w = () => {
        p.current.clear(), g.current = false;
      };
      return window.addEventListener("keydown", E), window.addEventListener("keyup", k), window.addEventListener("blur", w), () => {
        window.removeEventListener("keydown", E), window.removeEventListener("keyup", k), window.removeEventListener("blur", w), v.current !== null && cancelAnimationFrame(v.current);
      };
    }, [
      l,
      i,
      s,
      h,
      n,
      a,
      c,
      f
    ]);
  }
  const A2 = 500, T2 = 1, N2 = gt((l, n) => ({
    points: [],
    opacity: 1,
    isDrawing: false,
    addPoint: (a) => {
      const { points: i, isDrawing: s } = n();
      if (!s) return;
      if (i.length > 0) {
        const f = i[i.length - 1], h = a.x - f.x, p = a.y - f.y;
        if (Math.sqrt(h * h + p * p) < T2) return;
      }
      const c = [
        ...i,
        a
      ];
      c.length > A2 && c.shift(), l({
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
    setOpacity: (a) => {
      l({
        opacity: Math.max(0, Math.min(1, a))
      });
    },
    reset: () => {
      l({
        points: [],
        opacity: 1,
        isDrawing: false
      });
    }
  })), O2 = 300, ey = 16;
  function D2(l, n, a, i) {
    const s = 1 - i;
    return {
      x: s * s * l.x + 2 * s * i * n.x + i * i * a.x,
      y: s * s * l.y + 2 * s * i * n.y + i * i * a.y
    };
  }
  function z2(l) {
    if (l.length < 3) return l;
    const n = [
      l[0]
    ];
    for (let a = 1; a < l.length - 1; a++) {
      const i = l[a - 1], s = l[a], c = l[a + 1], f = {
        x: (i.x + s.x) / 2,
        y: (i.y + s.y) / 2
      }, h = {
        x: (s.x + c.x) / 2,
        y: (s.y + c.y) / 2
      };
      a === 1 && n.push(f);
      for (let p = 1; p <= ey; p++) {
        const g = p / ey;
        n.push(D2(f, s, h, g));
      }
    }
    return n.push(l[l.length - 1]), n;
  }
  function I2(l, n) {
    const a = Ht((_) => _.activeTool), { points: i, opacity: s, isDrawing: c, addPoint: f, startDrawing: h, stopDrawing: p, setOpacity: g, reset: v } = N2(), y = m.useRef(null), S = m.useRef(null);
    m.useEffect(() => {
      if (!(!l || !n)) if (i.length === 0) l.clear_laser();
      else {
        const _ = z2(i), R = window.devicePixelRatio || 1, A = new Float64Array(_.length * 2);
        for (let T = 0; T < _.length; T++) A[T * 2] = _[T].x * R, A[T * 2 + 1] = _[T].y * R;
        l.set_laser_points(A);
      }
    }, [
      l,
      n,
      i
    ]), m.useEffect(() => {
      !l || !n || l.set_laser_opacity(s);
    }, [
      l,
      n,
      s
    ]);
    const E = m.useCallback(() => {
      S.current !== null && cancelAnimationFrame(S.current), y.current = performance.now();
      const _ = (R) => {
        if (y.current === null) return;
        const A = R - y.current, T = Math.min(A / O2, 1);
        if (T >= 1) {
          y.current = null, S.current = null, v();
          return;
        }
        g(1 - T), S.current = requestAnimationFrame(_);
      };
      S.current = requestAnimationFrame(_);
    }, [
      v,
      g
    ]), k = m.useCallback((_) => {
      a !== "laser" || _.button !== 0 || (S.current !== null && (cancelAnimationFrame(S.current), S.current = null, y.current = null), h(), f({
        x: _.clientX,
        y: _.clientY
      }));
    }, [
      a,
      h,
      f
    ]), w = m.useCallback((_) => {
      a !== "laser" || !c || f({
        x: _.clientX,
        y: _.clientY
      });
    }, [
      a,
      c,
      f
    ]), C = m.useCallback(() => {
      a !== "laser" || !c || (p(), E());
    }, [
      a,
      c,
      p,
      E
    ]);
    return m.useEffect(() => () => {
      S.current !== null && cancelAnimationFrame(S.current);
    }, []), m.useEffect(() => {
      a !== "laser" && (S.current !== null && (cancelAnimationFrame(S.current), S.current = null, y.current = null), v());
    }, [
      a,
      v
    ]), {
      handleMouseDown: k,
      handleMouseMove: w,
      handleMouseUp: C,
      isLaserActive: a === "laser"
    };
  }
  const H2 = gt((l, n) => ({
    box: null,
    isDrawing: false,
    startDrawing: (a, i) => l({
      box: {
        x: a,
        y: i,
        width: 0,
        height: 0
      },
      isDrawing: true
    }),
    updateBox: (a, i) => {
      const s = n();
      !s.box || !s.isDrawing || l({
        box: {
          ...s.box,
          width: a - s.box.x,
          height: i - s.box.y
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
  function Y2(l) {
    const n = Ht((E) => E.activeTool), { box: a, isDrawing: i, startDrawing: s, updateBox: c, reset: f } = H2(), { zoom: h, offset: p, zoomToBounds: g } = ze(), v = m.useCallback((E) => {
      if (n !== "zoom" || E.button !== 0) return;
      const k = l.current;
      if (!k) return;
      const w = k.getBoundingClientRect(), C = E.clientX - w.left, _ = E.clientY - w.top;
      s(C, _);
    }, [
      n,
      l,
      s
    ]), y = m.useCallback((E) => {
      if (n !== "zoom" || !i) return;
      const k = l.current;
      if (!k) return;
      const w = k.getBoundingClientRect(), C = E.clientX - w.left, _ = E.clientY - w.top;
      c(C, _);
    }, [
      n,
      i,
      l,
      c
    ]), S = m.useCallback(() => {
      if (n !== "zoom" || !i || !a) {
        f();
        return;
      }
      const E = l.current;
      if (Math.abs(a.width) > 5 && Math.abs(a.height) > 5 && E) {
        const k = Math.min(a.x, a.x + a.width), w = Math.max(a.x, a.x + a.width), C = Math.min(a.y, a.y + a.height), _ = Math.max(a.y, a.y + a.height), R = (k - p.x) / h, A = (w - p.x) / h, T = (C - p.y) / h, B = (_ - p.y) / h, N = {
          minX: R,
          maxX: A,
          minY: T,
          maxY: B
        }, L = Zn(E);
        L.width > 0 && L.height > 0 && g(N, L.width, L.height, L.screenCenter);
      }
      f();
    }, [
      n,
      i,
      a,
      h,
      p,
      g,
      f,
      l
    ]);
    return m.useEffect(() => {
      n !== "zoom" && f();
    }, [
      n,
      f
    ]), {
      handleMouseDown: v,
      handleMouseMove: y,
      handleMouseUp: S,
      box: a,
      isZoomActive: n === "zoom",
      isDrawingZoom: i
    };
  }
  function ma(l) {
    return Math.round(l / ve) * ve;
  }
  const gl = new Float64Array(8), _o = new Float32Array(4);
  function U2(l, n, a) {
    const i = m.useRef(null), s = m.useRef(false), c = m.useRef([
      0.5,
      0.5,
      0.5,
      0.5
    ]), f = m.useCallback((v) => {
      if (v.button !== 0) return;
      const S = v.currentTarget.getBoundingClientRect(), E = v.clientX - S.left, k = v.clientY - S.top, w = l(E, k);
      if (!w) return;
      const C = ma(w.x), _ = ma(w.y);
      i.current = {
        x: C,
        y: _
      }, s.current = true;
      const R = me.getState().activeLayerId, T = me.getState().layers.get(R);
      if (T) {
        const [B, N, L] = Ds(T.color, 0.5);
        c.current = [
          B,
          N,
          L,
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
    ]), h = m.useCallback((v, y) => {
      const S = i.current;
      if (!s.current || !S || !a) return false;
      const E = l(v, y);
      if (!E) return false;
      const k = ma(E.x), w = ma(E.y), C = Math.min(S.x, k), _ = Math.min(S.y, w), R = Math.max(S.x, k), A = Math.max(S.y, w);
      gl[0] = C, gl[1] = _, gl[2] = R, gl[3] = _, gl[4] = R, gl[5] = A, gl[6] = C, gl[7] = A;
      const T = c.current;
      return _o[0] = T[0], _o[1] = T[1], _o[2] = T[2], _o[3] = T[3], a.set_preview_shape(gl, _o), a.mark_dirty(), true;
    }, [
      l,
      a
    ]), p = m.useCallback((v, y) => {
      const S = i.current;
      if (!S || !n || !a) return;
      const E = ma(v), k = ma(y), w = Math.min(S.x, E), C = Math.min(S.y, k), _ = Math.abs(E - S.x), R = Math.abs(k - S.y);
      if (_ > 0 && R > 0) {
        const A = me.getState().activeLayerId, B = me.getState().layers.get(A), N = (B == null ? void 0 : B.layerNumber) ?? 1, L = (B == null ? void 0 : B.datatype) ?? 0, U = new Sv(w, C, _, R, N, L);
        fe.getState().execute(U, {
          library: n,
          renderer: a
        });
      }
      a.clear_preview(), s.current = false, i.current = null;
    }, [
      n,
      a
    ]), g = m.useCallback(() => {
      s.current = false, i.current = null, a == null ? void 0 : a.clear_preview();
    }, [
      a
    ]);
    return {
      handleMouseDown: f,
      handleMouseMove: h,
      finalizeRectangle: p,
      cancelDrawing: g
    };
  }
  function us(l) {
    return Math.round(l / ve) * ve;
  }
  function ty(l, n, a, i) {
    const s = (l.x - n.x) * a, c = (l.y - n.y) * a;
    return Math.sqrt(s * s + c * c) <= i;
  }
  const ny = 10, ly = 8, B2 = 6;
  function ry(l, n, a) {
    const i = B2 / a;
    let s = null, c = null, f = l.x, h = l.y;
    for (const p of n) if (s === null && Math.abs(l.x - p.x) <= i && (f = p.x, s = p), c === null && Math.abs(l.y - p.y) <= i && (h = p.y, c = p), s !== null && c !== null) break;
    return {
      point: {
        x: f,
        y: h
      },
      guides: {
        alignedVertexX: s,
        alignedVertexY: c
      }
    };
  }
  function ay(l, n) {
    const a = n.x - l.x, i = n.y - l.y;
    if (a === 0 && i === 0) return n;
    const s = Math.abs(Math.atan2(Math.abs(i), Math.abs(a)) * (180 / Math.PI));
    return s <= ly ? {
      x: n.x,
      y: l.y
    } : s >= 90 - ly ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function X2(l, n, a, i) {
    const [s, c] = m.useState([]), [f, h] = m.useState(false), [p, g] = m.useState(null), [v, y] = m.useState(false), [S, E] = m.useState(null), k = me((B) => B.activeLayerId), w = me((B) => B.layers), C = Ht((B) => B.activeTool);
    m.useEffect(() => {
      C !== "polygon" && (c([]), h(false), g(null), y(false), E(null));
    }, [
      C
    ]);
    const _ = m.useCallback((B) => {
      if (!n || !a || B.length < 3) return;
      const N = new Float64Array(B.length * 2);
      for (let ae = 0; ae < B.length; ae++) N[ae * 2] = B[ae].x, N[ae * 2 + 1] = B[ae].y;
      const L = w.get(k), U = (L == null ? void 0 : L.layerNumber) ?? 1, X = (L == null ? void 0 : L.datatype) ?? 0, J = new wv(N, U, X);
      fe.getState().execute(J, {
        library: n,
        renderer: a
      }), c([]), h(false), g(null), y(false);
    }, [
      n,
      a,
      k,
      w
    ]), R = m.useCallback((B) => {
      if (B.button !== 0) return;
      const L = B.currentTarget.getBoundingClientRect(), U = B.clientX - L.left, X = B.clientY - L.top, J = l(U, X);
      if (!J) return;
      let ae = {
        x: us(J.x),
        y: us(J.y)
      };
      if (s.length > 0 && !B.shiftKey && (ae = ry(ae, s, i).point, ae = ay(s[s.length - 1], ae)), s.length >= 3) {
        const ie = s[0];
        if (ty(ie, ae, i, ny)) {
          _(s);
          return;
        }
      }
      const te = s[s.length - 1];
      if (te && ae.x === te.x && ae.y === te.y) return;
      const ce = [
        ...s,
        ae
      ];
      c(ce), h(true);
    }, [
      l,
      s,
      i,
      _
    ]), A = m.useCallback((B) => {
      const L = B.currentTarget.getBoundingClientRect(), U = B.clientX - L.left, X = B.clientY - L.top, J = l(U, X);
      if (!J) return;
      let ae = {
        x: us(J.x),
        y: us(J.y)
      }, te = null;
      if (s.length > 0 && !B.shiftKey) {
        const ie = ry(ae, s, i);
        ae = ie.point, te = ie.guides, ae = ay(s[s.length - 1], ae);
      }
      const ce = s.length >= 3 && ty(s[0], ae, i, ny);
      ce && (ae = {
        ...s[0]
      }, te = null), y(ce), g(ae), E(te);
    }, [
      l,
      s,
      i
    ]), T = m.useCallback(() => {
      c([]), h(false), g(null), y(false), E(null);
    }, []);
    return {
      handleMouseDown: R,
      handleMouseMove: A,
      cancelDrawing: T,
      isDrawing: f,
      points: s,
      cursorPoint: p,
      isNearStart: v,
      alignmentGuides: S
    };
  }
  function ds(l) {
    return Math.round(l / ve) * ve;
  }
  const V2 = 6;
  function oy(l, n, a) {
    const i = V2 / a;
    let s = null, c = null, f = l.x, h = l.y;
    for (const p of n) if (s === null && Math.abs(l.x - p.x) <= i && (f = p.x, s = p), c === null && Math.abs(l.y - p.y) <= i && (h = p.y, c = p), s !== null && c !== null) break;
    return {
      point: {
        x: f,
        y: h
      },
      guides: {
        alignedVertexX: s,
        alignedVertexY: c
      }
    };
  }
  function $2(l, n, a, i) {
    const [s, c] = m.useState([]), [f, h] = m.useState(false), [p, g] = m.useState(null), [v, y] = m.useState(null), S = me((T) => T.activeLayerId), E = me((T) => T.layers), k = Ht((T) => T.activeTool);
    m.useEffect(() => {
      k !== "path" && (c([]), h(false), g(null), y(null));
    }, [
      k
    ]);
    const w = m.useCallback((T) => {
      if (!n || !a || T.length < 2) return;
      const { width: B, cornerRadius: N, numArcPoints: L } = dn.getState(), U = new Float64Array(T.length * 2);
      for (let ce = 0; ce < T.length; ce++) U[ce * 2] = T[ce].x, U[ce * 2 + 1] = T[ce].y;
      const X = E.get(S), J = (X == null ? void 0 : X.layerNumber) ?? 1, ae = (X == null ? void 0 : X.datatype) ?? 0, te = new US(U, B, J, ae, [
        ...T
      ], N, L);
      fe.getState().execute(te, {
        library: n,
        renderer: a
      }), c([]), h(false), g(null), y(null);
    }, [
      n,
      a,
      S,
      E
    ]), C = m.useCallback((T) => {
      if (T.button !== 0) return;
      const N = T.currentTarget.getBoundingClientRect(), L = T.clientX - N.left, U = T.clientY - N.top, X = l(L, U);
      if (!X) return;
      let J = {
        x: ds(X.x),
        y: ds(X.y)
      };
      if (s.length > 0 && !T.shiftKey && (J = oy(J, s, i).point, J = Kg(s[s.length - 1], J)), T.detail >= 2 && s.length >= 2) {
        w(s);
        return;
      }
      const ae = s[s.length - 1];
      if (ae && J.x === ae.x && J.y === ae.y) return;
      const te = [
        ...s,
        J
      ];
      c(te), h(true);
    }, [
      l,
      s,
      i,
      w
    ]), _ = m.useCallback((T) => {
      const N = T.currentTarget.getBoundingClientRect(), L = T.clientX - N.left, U = T.clientY - N.top, X = l(L, U);
      if (!X) return;
      let J = {
        x: ds(X.x),
        y: ds(X.y)
      }, ae = null;
      if (s.length > 0 && !T.shiftKey) {
        const te = oy(J, s, i);
        J = te.point, ae = te.guides, J = Kg(s[s.length - 1], J);
      }
      g(J), y(ae);
    }, [
      l,
      s,
      i
    ]), R = m.useCallback((T) => {
      T.key === "Enter" && s.length >= 2 && (T.preventDefault(), w(s));
    }, [
      s,
      w
    ]);
    m.useEffect(() => {
      if (f) return window.addEventListener("keydown", R), () => window.removeEventListener("keydown", R);
    }, [
      f,
      R
    ]);
    const A = m.useCallback(() => {
      c([]), h(false), g(null), y(null);
    }, []);
    return {
      handleMouseDown: C,
      handleMouseMove: _,
      cancelDrawing: A,
      isDrawing: f,
      waypoints: s,
      cursorPoint: p,
      alignmentGuides: v
    };
  }
  const iy = gt((l, n) => ({
    box: null,
    isDrawing: false,
    previewIds: /* @__PURE__ */ new Set(),
    startDrawing: (a, i) => l({
      box: {
        x: a,
        y: i,
        width: 0,
        height: 0
      },
      isDrawing: true,
      previewIds: /* @__PURE__ */ new Set()
    }),
    updateBox: (a, i) => {
      const s = n();
      !s.box || !s.isDrawing || l({
        box: {
          ...s.box,
          width: a - s.box.x,
          height: i - s.box.y
        }
      });
    },
    setPreviewIds: (a) => l({
      previewIds: new Set(a)
    }),
    reset: () => l({
      box: null,
      isDrawing: false,
      previewIds: /* @__PURE__ */ new Set()
    })
  })), sy = 15;
  function ff(l) {
    if (!l) return null;
    try {
      const n = l.get_all_vertices();
      return n.length > 0 ? n : null;
    } catch {
      return null;
    }
  }
  function q2(l, n, a, i, s, c) {
    const f = s - a, h = c - i, p = f * f + h * h;
    if (p === 0) {
      const E = (l - a) * (l - a) + (n - i) * (n - i);
      return {
        point: {
          x: a,
          y: i
        },
        distSq: E
      };
    }
    const g = Math.max(0, Math.min(1, ((l - a) * f + (n - i) * h) / p)), v = a + g * f, y = i + g * h, S = (l - v) * (l - v) + (n - y) * (n - y);
    return {
      point: {
        x: v,
        y
      },
      distSq: S
    };
  }
  function G2(l, n, a, i, s) {
    let c = null, f = sy * sy;
    const h = (l - s.x) / i, p = (n - s.y) / i;
    for (const g of a) {
      const v = g.length / 2;
      if (!(v < 2)) for (let y = 0; y < v; y++) {
        const S = (y + 1) % v, E = g[y * 2], k = g[y * 2 + 1], w = g[S * 2], C = g[S * 2 + 1], { point: _, distSq: R } = q2(h, p, E, k, w, C), A = R * i * i;
        A < f && (f = A, c = _);
      }
    }
    return c;
  }
  function cy(l) {
    return Math.round(l / ve) * ve;
  }
  function Z2(l) {
    const n = [];
    let a = 0;
    for (; a < l.length; ) {
      const i = l[a];
      if (a++, i < 2 || a + i * 2 > l.length) break;
      const s = [];
      for (let c = 0; c < i; c++) s.push(l[a], l[a + 1]), a += 2;
      n.push(s);
    }
    return n;
  }
  function hf(l, n, a, i, s, c, f, h = false) {
    if (!h && s && s.length >= 5) {
      const p = Z2(s);
      if (p.length > 0) {
        const g = G2(l, n, p, c, f);
        if (g) return {
          point: g,
          isGeometrySnap: true
        };
      }
    }
    return {
      point: {
        x: cy(a),
        y: cy(i)
      },
      isGeometrySnap: false
    };
  }
  const uy = 5;
  function dy(l, n) {
    return l.get_group_ids(n);
  }
  function fy(l, n) {
    const a = /* @__PURE__ */ new Set(), i = [];
    for (const s of n) {
      const c = l.get_group_ids(s);
      for (const f of c) a.has(f) || (a.add(f), i.push(f));
    }
    return i;
  }
  const K2 = 8, fs = 12, mf = 140, pf = 56;
  function P2(l, n, a, i, s, c) {
    const f = l - a, h = n - i, p = s - a, g = c - i, v = f * p + h * g, y = p * p + g * g;
    if (y === 0) return Math.sqrt(f * f + h * h);
    const S = Math.max(0, Math.min(1, v / y)), E = a + S * p, k = i + S * g, w = l - E, C = n - k;
    return Math.sqrt(w * w + C * C);
  }
  function hy(l, n, a, i, s) {
    for (const c of a.values()) {
      const f = c.start.x * i + s.x, h = c.start.y * i + s.y, p = c.end.x * i + s.x, g = c.end.y * i + s.y, v = l - f, y = n - h;
      if (v * v + y * y <= fs * fs) return {
        rulerId: c.id,
        endpoint: "start"
      };
      const S = l - p, E = n - g;
      if (S * S + E * E <= fs * fs) return {
        rulerId: c.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function my(l, n, a, i, s) {
    for (const c of a.values()) {
      const f = c.start.x * i + s.x, h = c.start.y * i + s.y, p = c.end.x * i + s.x, g = c.end.y * i + s.y, v = (f + p) / 2, y = (h + g) / 2, S = mf / 2, E = pf / 2;
      if (l >= v - S && l <= v + S && n >= y - E && n <= y + E || P2(l, n, f, h, p, g) <= K2) return c.id;
    }
    return null;
  }
  function Q2(l, n, a, i, s, c, f, h) {
    if (l >= s && l <= f && n >= c && n <= h || a >= s && a <= f && i >= c && i <= h) return true;
    const p = [
      [
        s,
        c,
        f,
        c
      ],
      [
        f,
        c,
        f,
        h
      ],
      [
        s,
        h,
        f,
        h
      ],
      [
        s,
        c,
        s,
        h
      ]
    ];
    for (const [g, v, y, S] of p) if (F2(l, n, a, i, g, v, y, S)) return true;
    return false;
  }
  function F2(l, n, a, i, s, c, f, h) {
    const p = hs(s, c, f, h, l, n), g = hs(s, c, f, h, a, i), v = hs(l, n, a, i, s, c), y = hs(l, n, a, i, f, h);
    return !!((p > 0 && g < 0 || p < 0 && g > 0) && (v > 0 && y < 0 || v < 0 && y > 0) || p === 0 && ms(s, c, f, h, l, n) || g === 0 && ms(s, c, f, h, a, i) || v === 0 && ms(l, n, a, i, s, c) || y === 0 && ms(l, n, a, i, f, h));
  }
  function hs(l, n, a, i, s, c) {
    return (s - l) * (i - n) - (a - l) * (c - n);
  }
  function ms(l, n, a, i, s, c) {
    return Math.min(l, a) <= s && s <= Math.max(l, a) && Math.min(n, i) <= c && c <= Math.max(n, i);
  }
  function py(l, n, a, i, s, c, f) {
    const h = [];
    for (const p of s.values()) {
      const g = p.start.x * c + f.x, v = p.start.y * c + f.y, y = p.end.x * c + f.x, S = p.end.y * c + f.y;
      if (Q2(g, v, y, S, l, n, a, i)) {
        h.push(p.id);
        continue;
      }
      const E = (g + y) / 2, k = (v + S) / 2, w = E - mf / 2, C = E + mf / 2, _ = k - pf / 2, R = k + pf / 2;
      w <= a && C >= l && _ <= i && R >= n && h.push(p.id);
    }
    return h;
  }
  function W2(l, n, a) {
    const { selectedIds: i, hoveredId: s, clearSelection: c, setHover: f } = se(), { box: h, isDrawing: p, previewIds: g, startDrawing: v, updateBox: y, setPreviewIds: S, reset: E } = iy(), { zoom: k, offset: w } = ze(), C = ke((j) => j.rulers), _ = ke((j) => j.selectedRulerIds), R = ke((j) => j.selectRuler), A = ke((j) => j.toggleSelection), T = ke((j) => j.addToSelection), B = ke((j) => j.clearSelection), N = ke((j) => j.setHoveredRuler), L = ke((j) => j.setHoveredEndpoint), U = ke((j) => j.setDraggingEndpoint), X = ke((j) => j.endDraggingEndpoint), J = ke((j) => j.updateEndpoint), ae = ke((j) => j.hoveredRulerId), te = ke((j) => j.hoveredEndpoint), ce = ke((j) => j.draggingEndpoint), ie = ke((j) => j.setMarqueePreviewIds), Se = ke((j) => j.setSnapPoint), $ = m.useRef("");
    m.useEffect(() => {
      a && a.set_selection(Array.from(i));
    }, [
      a,
      i
    ]), m.useEffect(() => {
      if (a) if (p) a.set_hover_multiple(Array.from(g));
      else if (s && n) {
        const j = dy(n, s);
        a.set_hover_multiple(j);
      } else a.set_hover(s ?? void 0);
    }, [
      a,
      n,
      s,
      p,
      g
    ]);
    const P = m.useCallback((j) => {
      if (j.button !== 0) return;
      const z = j.currentTarget.getBoundingClientRect(), O = j.clientX - z.left, Y = j.clientY - z.top, Q = hy(O, Y, C, k, w);
      if (Q) {
        R(Q.rulerId), U(Q), c();
        return;
      }
      const W = my(O, Y, C, k, w);
      if (W) {
        j.shiftKey ? T([
          W
        ]) : j.metaKey || j.ctrlKey ? A(W) : R(W), c();
        return;
      }
      _.size > 0 && B();
      const de = l(O, Y);
      if (!de || !n) return;
      const oe = n.hit_test(de.x, de.y);
      if (oe) {
        const Me = dy(n, oe);
        if (j.shiftKey) {
          const Xe = se.getState().selectedIds, Re = /* @__PURE__ */ new Set([
            ...Xe,
            ...Me
          ]);
          se.setState({
            selectedIds: Re,
            lastSelectedId: oe
          });
        } else if (j.metaKey || j.ctrlKey) {
          const Xe = se.getState().selectedIds, Re = Me.every((Ve) => Xe.has(Ve)), Ie = new Set(Xe);
          if (Re) for (const Ve of Me) Ie.delete(Ve);
          else for (const Ve of Me) Ie.add(Ve);
          se.setState({
            selectedIds: Ie,
            lastSelectedId: oe
          });
        } else se.setState({
          selectedIds: new Set(Me),
          lastSelectedId: oe
        });
      } else v(O, Y), !j.shiftKey && !j.metaKey && !j.ctrlKey && c();
    }, [
      l,
      n,
      C,
      k,
      w,
      _,
      c,
      R,
      A,
      T,
      B,
      U,
      v
    ]), ue = m.useCallback((j) => {
      const z = j.currentTarget.getBoundingClientRect(), O = j.clientX - z.left, Y = j.clientY - z.top;
      if (ce) {
        const oe = l(O, Y);
        if (oe) {
          const Me = ff(n), Xe = hf(O, Y, oe.x, oe.y, Me, k, w, j.shiftKey);
          J(ce.rulerId, ce.endpoint, Xe.point), Se(Xe.isGeometrySnap ? Xe.point : null);
        }
        return;
      }
      if (p) {
        y(O, Y);
        const oe = iy.getState().box;
        if (oe) {
          const Me = Math.min(oe.x, oe.x + oe.width), Xe = Math.max(oe.x, oe.x + oe.width), Re = Math.min(oe.y, oe.y + oe.height), Ie = Math.max(oe.y, oe.y + oe.height), Ve = py(Me, Re, Xe, Ie, C, k, w);
          if (ie(Ve), n) {
            const Mt = (Me - w.x) / k, Yt = (Xe - w.x) / k, _n = (Re - w.y) / k, fn = (Ie - w.y) / k, Dn = Math.min(Mt, Yt), bl = Math.max(Mt, Yt), er = Math.min(_n, fn), _a = Math.max(_n, fn), Ma = n.hit_test_rect(Dn, er, bl, _a), Ct = fy(n, Ma), tr = Ct.sort().join(",");
            tr !== $.current && ($.current = tr, S(Ct));
          }
        }
        return;
      }
      const Q = hy(O, Y, C, k, w);
      let W = null;
      Q ? (((te == null ? void 0 : te.rulerId) !== Q.rulerId || (te == null ? void 0 : te.endpoint) !== Q.endpoint) && L(Q), ae !== Q.rulerId && N(Q.rulerId), W = Q.rulerId) : (te && L(null), W = my(O, Y, C, k, w), W !== ae && N(W));
      const de = l(O, Y);
      if (!de || !n) {
        s !== null && f(null);
        return;
      }
      if (W) s !== null && f(null);
      else {
        const oe = n.hit_test(de.x, de.y);
        oe !== s && f(oe ?? null);
      }
    }, [
      l,
      n,
      C,
      s,
      ae,
      te,
      ce,
      f,
      N,
      L,
      J,
      ie,
      p,
      y,
      k,
      w,
      S,
      Se
    ]), xe = m.useCallback(() => {
      if (ce) {
        const z = X();
        if (Se(null), z && n && a) {
          const O = new _v(z.rulerId, z.endpoint, z.oldPosition, z.newPosition);
          fe.getState().pushCommand(O);
        }
        return;
      }
      if (!p || !h) {
        E(), ie([]);
        return;
      }
      const j = Math.abs(h.width), D = Math.abs(h.height);
      if (j > uy || D > uy) {
        const z = Math.min(h.x, h.x + h.width), O = Math.max(h.x, h.x + h.width), Y = Math.min(h.y, h.y + h.height), Q = Math.max(h.y, h.y + h.height), W = py(z, Y, O, Q, C, k, w), de = (z - w.x) / k, oe = (O - w.x) / k, Me = (Y - w.y) / k, Xe = (Q - w.y) / k, Re = Math.min(de, oe), Ie = Math.max(de, oe), Ve = Math.min(Me, Xe), Mt = Math.max(Me, Xe), Yt = n ? n.hit_test_rect(Re, Ve, Ie, Mt) : [], _n = n ? fy(n, Yt) : Yt;
        if (W.length > 0 && T(W), _n.length > 0) {
          const fn = se.getState().selectedIds, Dn = /* @__PURE__ */ new Set([
            ...fn,
            ..._n
          ]);
          se.getState().setSelection(Dn);
        }
      }
      E(), ie([]);
    }, [
      p,
      h,
      n,
      a,
      C,
      k,
      w,
      ce,
      T,
      X,
      E,
      ie,
      Se
    ]), be = m.useCallback(() => {
      s !== null && f(null), ae !== null && N(null), te !== null && L(null), ce !== null && U(null), E(), ie([]);
    }, [
      s,
      ae,
      te,
      ce,
      f,
      N,
      L,
      U,
      E,
      ie
    ]);
    return {
      handleMouseDown: P,
      handleMouseMove: ue,
      handleMouseUp: xe,
      handleMouseLeave: be,
      selectedIds: i,
      hoveredId: s,
      hoveredRulerId: ae,
      hoveredEndpoint: te,
      marqueeBox: h,
      isDrawingMarquee: p,
      previewIds: g
    };
  }
  const J2 = 8, ew = 140, tw = 56;
  function nw(l, n, a, i, s, c) {
    const f = l - a, h = n - i, p = s - a, g = c - i, v = f * p + h * g, y = p * p + g * g;
    if (y === 0) return Math.sqrt(f * f + h * h);
    const S = Math.max(0, Math.min(1, v / y)), E = a + S * p, k = i + S * g, w = l - E, C = n - k;
    return Math.sqrt(w * w + C * C);
  }
  function gy(l, n, a, i, s) {
    for (const c of a.values()) {
      const f = c.start.x * i + s.x, h = c.start.y * i + s.y, p = c.end.x * i + s.x, g = c.end.y * i + s.y, v = (f + p) / 2, y = (h + g) / 2, S = ew / 2, E = tw / 2;
      if (l >= v - S && l <= v + S && n >= y - E && n <= y + E || nw(l, n, f, h, p, g) <= J2) return c.id;
    }
    return null;
  }
  function lw(l, n, a) {
    const [i, s] = m.useState(false), [c, f] = m.useState(null), [h, p] = m.useState(null), { zoom: g, offset: v } = ze(), y = ke((A) => A.rulers), S = ke((A) => A.selectRuler), E = m.useRef(null), k = m.useCallback((A) => {
      if (A.button !== 0) return;
      const B = A.currentTarget.getBoundingClientRect(), N = A.clientX - B.left, L = A.clientY - B.top, U = l(N, L);
      if (!U) return;
      const X = gy(N, L, y, g, v);
      if (X) {
        S(X), se.getState().clearSelection(), E.current = {
          elementIds: [],
          rulerId: X,
          startWorld: U,
          currentDelta: {
            x: 0,
            y: 0
          }
        }, s(true);
        return;
      }
      if (!n) return;
      const J = n.hit_test(U.x, U.y);
      if (!J) return;
      const ae = n.get_group_ids(J);
      S(null);
      const { selectedIds: te } = se.getState();
      let ce;
      te.has(J) ? ce = [
        ...te
      ] : (ce = ae, se.getState().setSelection(new Set(ae))), E.current = {
        elementIds: ce,
        rulerId: null,
        startWorld: U,
        currentDelta: {
          x: 0,
          y: 0
        }
      }, s(true);
    }, [
      l,
      n,
      y,
      g,
      v,
      S
    ]), w = m.useCallback((A) => {
      const B = A.currentTarget.getBoundingClientRect(), N = A.clientX - B.left, L = A.clientY - B.top, U = l(N, L);
      if (!U) return;
      if (!i) {
        const ie = gy(N, L, y, g, v);
        if (ie !== h && p(ie), n) {
          const Se = n.hit_test(U.x, U.y);
          Se !== c && f(Se ?? null);
        }
        return;
      }
      const X = E.current;
      if (!X) return;
      const J = U.x - X.startWorld.x, ae = U.y - X.startWorld.y, te = J - X.currentDelta.x, ce = ae - X.currentDelta.y;
      if (te !== 0 || ce !== 0) {
        if (X.rulerId) {
          const ie = ke.getState().rulers.get(X.rulerId);
          ie && (ke.getState().updateEndpoint(X.rulerId, "start", {
            x: ie.start.x + te,
            y: ie.start.y + ce
          }), ke.getState().updateEndpoint(X.rulerId, "end", {
            x: ie.end.x + te,
            y: ie.end.y + ce
          }));
        } else n && a && (n.translate_elements(X.elementIds, te, ce), a.sync_from_library(n), a.mark_dirty(), Ce.getState().bumpSyncGeneration());
        X.currentDelta = {
          x: J,
          y: ae
        };
      }
    }, [
      l,
      n,
      a,
      y,
      g,
      v,
      i,
      c,
      h
    ]), C = m.useCallback(() => {
      if (!i) {
        s(false), E.current = null;
        return;
      }
      const A = E.current;
      if (!A) {
        s(false);
        return;
      }
      const { elementIds: T, rulerId: B, currentDelta: N } = A;
      if (B && (N.x !== 0 || N.y !== 0)) {
        const L = new Ev([
          B
        ], N.x, N.y);
        fe.getState().pushCommand(L), s(false), E.current = null;
        return;
      }
      if (n && a && (N.x !== 0 || N.y !== 0)) {
        n.translate_elements(T, -N.x, -N.y), a.sync_from_library(n);
        const L = new BS(T, N.x, N.y);
        fe.getState().execute(L, {
          library: n,
          renderer: a
        });
      }
      s(false), E.current = null;
    }, [
      i,
      n,
      a
    ]), _ = m.useCallback(() => {
      if (!i) {
        s(false), E.current = null;
        return;
      }
      const A = E.current;
      if (A && (A.currentDelta.x !== 0 || A.currentDelta.y !== 0)) if (A.rulerId) {
        const T = ke.getState().rulers.get(A.rulerId);
        T && (ke.getState().updateEndpoint(A.rulerId, "start", {
          x: T.start.x - A.currentDelta.x,
          y: T.start.y - A.currentDelta.y
        }), ke.getState().updateEndpoint(A.rulerId, "end", {
          x: T.end.x - A.currentDelta.x,
          y: T.end.y - A.currentDelta.y
        }));
      } else n && a && (n.translate_elements(A.elementIds, -A.currentDelta.x, -A.currentDelta.y), a.sync_from_library(n), a.mark_dirty());
      s(false), E.current = null;
    }, [
      i,
      n,
      a
    ]), R = m.useCallback(() => {
      i && _(), f(null), p(null);
    }, [
      i,
      _
    ]);
    return {
      handleMouseDown: k,
      handleMouseMove: w,
      handleMouseUp: C,
      handleMouseLeave: R,
      cancelMove: _,
      isMoving: i,
      hoveredId: c,
      hoveredRulerId: h
    };
  }
  function yy(l, n) {
    return l.line < n.line ? true : l.line > n.line ? false : l.column < n.column;
  }
  function Nf(l) {
    if (!l || !l.isActive || l.anchor.line === l.focus.line && l.anchor.column === l.focus.column) return null;
    const n = yy(l.anchor, l.focus) ? l.anchor : l.focus, a = yy(l.anchor, l.focus) ? l.focus : l.anchor;
    return {
      start: n,
      end: a
    };
  }
  function rw(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return "";
    const n = Nf(l.selection);
    if (!n) return "";
    const a = l.content.split(`
`);
    let i = "";
    for (let s = n.start.line; s <= n.end.line; s++) {
      const c = a[s], f = s === n.start.line ? n.start.column : 0, h = s === n.end.line ? n.end.column : c.length;
      i += c.substring(f, h), s < n.end.line && (i += `
`);
    }
    return i;
  }
  function aw(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return l;
    const n = Nf(l.selection);
    if (!n) return l;
    const i = [
      ...l.content.split(`
`)
    ];
    if (n.start.line === n.end.line) {
      const s = i[n.start.line];
      i[n.start.line] = s.substring(0, n.start.column) + s.substring(n.end.column);
    } else {
      const s = i[n.start.line], c = i[n.end.line];
      i[n.start.line] = s.substring(0, n.start.column) + c.substring(n.end.column), i.splice(n.start.line + 1, n.end.line - n.start.line);
    }
    return {
      ...l,
      content: i.join(`
`),
      cursorPosition: {
        line: n.start.line,
        column: n.start.column
      },
      selection: void 0
    };
  }
  function ow(l, n, a) {
    var _a;
    a == null ? void 0 : a.preventDefault(), a == null ? void 0 : a.stopPropagation();
    const i = l.content.split(`
`), { line: s, column: c } = l.cursorPosition, f = (a == null ? void 0 : a.shiftKey) || false;
    let h = s, p = c, g = l;
    switch (f && !((_a = l.selection) == null ? void 0 : _a.isActive) && (g = {
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
        c > 0 ? p = c - 1 : s > 0 && (h = s - 1, p = i[h].length);
        break;
      case "ArrowRight":
        c < i[s].length ? p = c + 1 : s < i.length - 1 && (h = s + 1, p = 0);
        break;
      case "ArrowUp":
        s > 0 && (h = s - 1, p = Math.min(c, i[h].length));
        break;
      case "ArrowDown":
        s < i.length - 1 && (h = s + 1, p = Math.min(c, i[h].length));
        break;
      case "Home":
        p = 0;
        break;
      case "End":
        p = i[s].length;
        break;
    }
    if (f) {
      const v = {
        line: h,
        column: p
      }, y = g.selection.anchor.line === v.line && g.selection.anchor.column === v.column;
      return {
        ...g,
        cursorPosition: v,
        selection: {
          ...g.selection,
          focus: v,
          isActive: !y
        }
      };
    }
    return {
      ...g,
      cursorPosition: {
        line: h,
        column: p
      },
      selection: void 0
    };
  }
  function iw(l, n) {
    if (n.key === "a" && (n.ctrlKey || n.metaKey)) {
      n.preventDefault(), n.stopPropagation();
      const a = l.content.split(`
`), i = a.length - 1, s = a[i].length;
      return {
        ...l,
        cursorPosition: {
          line: i,
          column: s
        },
        selection: {
          anchor: {
            line: 0,
            column: 0
          },
          focus: {
            line: i,
            column: s
          },
          isActive: true
        }
      };
    }
    return n.key === "c" && (n.ctrlKey || n.metaKey) ? (n.preventDefault(), n.stopPropagation(), l) : n.key === "v" && (n.ctrlKey || n.metaKey) ? l : null;
  }
  function by(l, n, a) {
    var _a;
    if (a && (a.ctrlKey || a.metaKey)) {
      const f = iw(l, a);
      if (f) return f;
    }
    let i = null;
    if (((_a = l.selection) == null ? void 0 : _a.isActive) && (n.length === 1 || n === "Backspace" || n === "Delete") && (l = aw(l), n === "Backspace" || n === "Delete")) return l;
    const s = l.content.split(`
`), c = s[l.cursorPosition.line];
    switch (n) {
      case "Enter": {
        if (a == null ? void 0 : a.preventDefault(), a == null ? void 0 : a.stopPropagation(), !(a == null ? void 0 : a.shiftKey)) return null;
        const f = c.slice(0, l.cursorPosition.column), h = c.slice(l.cursorPosition.column), p = [
          ...s
        ];
        p[l.cursorPosition.line] = f, p.splice(l.cursorPosition.line + 1, 0, h), i = {
          ...l,
          content: p.join(`
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
        if (a == null ? void 0 : a.preventDefault(), a == null ? void 0 : a.stopPropagation(), l.cursorPosition.column > 0) {
          const f = [
            ...s
          ];
          f[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column - 1) + c.slice(l.cursorPosition.column), i = {
            ...l,
            content: f.join(`
`),
            cursorPosition: {
              ...l.cursorPosition,
              column: l.cursorPosition.column - 1
            },
            selection: void 0
          };
        } else if (l.cursorPosition.line > 0) {
          const f = s[l.cursorPosition.line - 1], h = [
            ...s
          ];
          h.splice(l.cursorPosition.line - 1, 2, f + c), i = {
            ...l,
            content: h.join(`
`),
            cursorPosition: {
              line: l.cursorPosition.line - 1,
              column: f.length
            },
            selection: void 0
          };
        }
        break;
      }
      case "Delete": {
        if (a == null ? void 0 : a.preventDefault(), a == null ? void 0 : a.stopPropagation(), l.cursorPosition.column < c.length) {
          const f = [
            ...s
          ];
          f[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column) + c.slice(l.cursorPosition.column + 1), i = {
            ...l,
            content: f.join(`
`),
            cursorPosition: l.cursorPosition,
            selection: void 0
          };
        } else if (l.cursorPosition.line < s.length - 1) {
          const f = s[l.cursorPosition.line + 1], h = [
            ...s
          ];
          h.splice(l.cursorPosition.line, 2, c + f), i = {
            ...l,
            content: h.join(`
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
        i = ow(l, n, a);
        break;
      default:
        if (n.length === 1) {
          a == null ? void 0 : a.preventDefault(), a == null ? void 0 : a.stopPropagation();
          const f = [
            ...s
          ];
          f[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column) + n + c.slice(l.cursorPosition.column), i = {
            ...l,
            content: f.join(`
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
    return i || l;
  }
  function vy(l) {
    return Math.round(l / ve) * ve;
  }
  function sw(l, n, a) {
    const i = It((g) => g.isEditingText), s = m.useRef(null), c = m.useCallback(() => {
      const g = It.getState().activeText;
      if (!g || !g.content.trim() || !n || !a) {
        It.getState().stopEditing();
        return;
      }
      const v = me.getState().layers.get(me.getState().activeLayerId), y = (v == null ? void 0 : v.layerNumber) ?? 1, S = (v == null ? void 0 : v.datatype) ?? 0, E = new zv(g.content, g.x, g.y, yv * ve, y, S);
      fe.getState().execute(E, {
        library: n,
        renderer: a
      }), Ce.getState().bumpSyncGeneration(), It.getState().stopEditing();
    }, [
      n,
      a
    ]), f = m.useCallback(() => {
      It.getState().stopEditing();
    }, []), h = m.useCallback((g) => {
      if (g.button !== 0) return;
      const y = g.currentTarget.getBoundingClientRect(), S = g.clientX - y.left, E = g.clientY - y.top, k = l(S, E);
      if (!k) return;
      if (i) {
        c();
        return;
      }
      const w = vy(k.x), C = vy(k.y);
      It.getState().startEditing(w, C);
    }, [
      l,
      i,
      c
    ]), p = m.useCallback((g) => {
    }, []);
    return m.useEffect(() => {
      if (!i) return;
      const g = (v) => {
        const y = It.getState().activeText;
        if (!y) return;
        if (v.key === "Escape") {
          v.preventDefault(), v.stopPropagation(), f(), Ht.getState().setTool("select");
          return;
        }
        if (v.key === "c" && (v.ctrlKey || v.metaKey)) {
          const E = rw(y);
          E && (v.preventDefault(), navigator.clipboard.writeText(E));
          return;
        }
        if (v.key === "v" && (v.ctrlKey || v.metaKey)) {
          v.preventDefault(), v.stopPropagation(), navigator.clipboard.readText().then((E) => {
            if (!E) return;
            const k = It.getState().activeText;
            if (!k) return;
            let w = k;
            for (const C of E) {
              const _ = by(w, C === `
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
              _ && (w = _);
            }
            It.getState().setActiveText(w);
          });
          return;
        }
        const S = by(y, v.key, v);
        if (S === null) {
          c();
          return;
        }
        S !== y && (It.getState().setActiveText(S), It.getState().resetCursor());
      };
      return window.addEventListener("keydown", g, true), () => window.removeEventListener("keydown", g, true);
    }, [
      i,
      c,
      f
    ]), m.useEffect(() => (i && (s.current = setInterval(() => {
      It.getState().toggleCursor();
    }, jS)), () => {
      s.current && (clearInterval(s.current), s.current = null);
    }), [
      i
    ]), {
      handleMouseDown: h,
      handleMouseMove: p,
      commitText: c,
      cancelEditing: f,
      isEditing: i
    };
  }
  const qn = "__TAURI__" in window;
  async function Ea(l, n) {
    const { invoke: a } = await pt(async () => {
      const { invoke: i } = await import("./core-mPlcS5K-.js");
      return {
        invoke: i
      };
    }, [], import.meta.url);
    return a(l, n);
  }
  async function qv(l) {
    const n = await Ea("read_gds_bytes", {
      path: l
    });
    return new Uint8Array(n);
  }
  async function Gv(l, n) {
    return Ea("save_gds", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function Zv(l, n) {
    return Ea("save_bytes", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function Kv() {
    return Ea("get_pending_file");
  }
  async function Pv() {
    return Ea("get_current_file");
  }
  async function Qv(l) {
    return Ea("set_current_file", {
      path: l
    });
  }
  async function Fv() {
    const { open: l } = await pt(async () => {
      const { open: a } = await import("./index-F3OG0nQy.js");
      return {
        open: a
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
    const { save: n } = await pt(async () => {
      const { save: i } = await import("./index-F3OG0nQy.js");
      return {
        save: i
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
    const { save: n } = await pt(async () => {
      const { save: a } = await import("./index-F3OG0nQy.js");
      return {
        save: a
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
  async function e1(l, n) {
    const { listen: a } = await pt(async () => {
      const { listen: s } = await import("./event-DRyjiKX_.js");
      return {
        listen: s
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    return await a(l, (s) => n(s.payload));
  }
  const t1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    getCurrentFile: Pv,
    getPendingFile: Kv,
    isTauri: qn,
    listenTauri: e1,
    pickGdsFile: Fv,
    pickSaveFile: Wv,
    pickSaveImageFile: Jv,
    readGdsBytes: qv,
    saveBytes: Zv,
    saveGds: Gv,
    setCurrentFile: Qv
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  let Rt = null;
  function gf() {
    return new URLSearchParams(window.location.search).get("design") === "true";
  }
  function To() {
    return new URLSearchParams(window.location.search).get("embed") === "true";
  }
  function cw() {
    return new URLSearchParams(window.location.search).get("src");
  }
  function uw() {
    const n = new URLSearchParams(window.location.search).get("colors");
    return n ? n.split(",").map((a) => `#${a.trim()}`) : null;
  }
  function dw() {
    const n = new URLSearchParams(window.location.search).get("fills");
    return n ? n.split(",").map((a) => a.trim()) : null;
  }
  function fw() {
    return new URLSearchParams(window.location.search).get("name");
  }
  function hw() {
    const n = new URLSearchParams(window.location.search).get("zoom");
    if (!n) return null;
    const a = Number.parseFloat(n);
    return Number.isNaN(a) || a <= 0 ? null : a;
  }
  function mw() {
    return qn && !gf() && !To();
  }
  function pw(l) {
    return l !== null && !Array.isArray(l) && "name" in l && "children" in l;
  }
  function dd(l, n) {
    for (const a of n.values()) {
      const i = a.visible ? a.opacity ?? 0.7 : 0, [s, c, f, h] = Ds(a.color, i);
      l.set_layer_color(a.layerNumber, a.datatype, s, c, f, h);
    }
  }
  const js = Ao;
  function gw(l, n) {
    if (n.length === 0) return false;
    const a = new Set(n.map((h) => `${h.layerNumber}/${h.datatype}`)), i = n.map((h) => ({
      id: h.id,
      layerNumber: h.layerNumber,
      datatype: h.datatype,
      name: h.name,
      color: h.color,
      visible: h.visible ?? true,
      fillPattern: h.fillPattern ?? "solid",
      opacity: h.opacity ?? 0.7
    })), s = l.get_used_layers();
    let c = Math.max(0, ...i.map((h) => h.id)) + 1, f = i.length;
    for (let h = 0; h < s.length; h += 2) {
      const p = s[h], g = s[h + 1], v = `${p}/${g}`;
      a.has(v) || (i.push({
        id: c++,
        layerNumber: p,
        datatype: g,
        name: g === 0 ? `layer${p}` : `layer${p}/${g}`,
        color: js[f % js.length],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      }), f++);
    }
    return me.getState().resetLayers(i), true;
  }
  function fd(l) {
    const n = l.get_used_layers();
    if (n.length === 0) return;
    const a = [];
    for (let i = 0; i < n.length; i += 2) {
      const s = n[i], c = n[i + 1], f = i / 2 + 1, h = (f - 1) % js.length, p = c === 0 ? `layer${s}` : `layer${s}/${c}`;
      a.push({
        id: f,
        layerNumber: s,
        datatype: c,
        name: p,
        color: js[h],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      });
    }
    me.getState().resetLayers(a);
  }
  function yw(l, n) {
    const [a, i] = m.useState(Rt), [s, c] = m.useState(!!Rt), f = me((E) => E.layers), h = m.useRef(f), p = m.useRef(0), g = m.useRef(l);
    m.useEffect(() => {
      h.current = f;
    }, [
      f
    ]), m.useEffect(() => {
      g.current = l;
    }, [
      l
    ]), m.useEffect(() => {
      if (!l || !n || gf() || To()) return;
      if (!Rt) {
        const k = new l.WasmLibrary("rosette");
        try {
          k.add_cell("top");
        } catch {
        }
        k.set_active_cell("top"), Rt = k;
      }
      const E = Rt.get_cell_tree();
      E ? ye.getState().setCellTree(E) : ye.getState().setCells([
        "top"
      ]), i(Rt), c(true);
    }, [
      l,
      n
    ]), m.useEffect(() => {
      if (!l || !n || !mw()) return;
      let E = false;
      const k = async (C) => {
        if (!E) try {
          const _ = await qv(C);
          if (E) return;
          const R = l.WasmLibrary.from_gds_bytes(_);
          fd(R), dd(R, me.getState().layers), Rt && Rt.free(), Rt = R, i(R), c(true);
          const A = C.split(/[/\\]/).pop();
          A && ye.getState().setProjectName(A);
          const T = R.get_cell_tree();
          if (T) {
            ye.getState().setCellTree(T);
            const B = R.active_cell_name();
            B && ye.getState().setActiveCell(B);
          }
        } catch (_) {
          console.error("Failed to open GDS file:", _);
        }
      };
      Kv().then((C) => {
        C && !E && k(C);
      });
      let w = null;
      return e1("open-file", k).then((C) => {
        E ? C() : w = C;
      }), () => {
        E = true, w == null ? void 0 : w();
      };
    }, [
      l,
      n
    ]), m.useEffect(() => {
      if (!l || !n) return;
      const E = () => {
        const k = new l.WasmLibrary("rosette");
        try {
          k.add_cell("top");
        } catch {
        }
        k.set_active_cell("top"), Rt && Rt.free(), Rt = k, i(k), c(true), ye.getState().setProjectName("untitled-project");
        const w = k.get_cell_tree();
        w ? ye.getState().setCellTree(w) : ye.getState().setCells([
          "top"
        ]), ye.getState().setActiveCell("top");
        const C = document.getElementById("rosette-canvas");
        if (C) {
          const _ = C.getBoundingClientRect();
          ze.getState().reset(_.width, _.height);
        }
        Ce.getState().bumpSyncGeneration();
      };
      return window.addEventListener("rosette-new-file", E), () => window.removeEventListener("rosette-new-file", E);
    }, [
      l,
      n
    ]), m.useEffect(() => {
      if (!l || !n || !gf()) return;
      const E = new EventSource("/api/design/events");
      return E.addEventListener("design", (k) => {
        try {
          const w = JSON.parse(k.data);
          if (w.version < p.current && (p.current = 0), w.version !== p.current && w.json) try {
            const C = l.WasmLibrary.from_library_json(w.json);
            w.layers && w.layers.length > 0 ? gw(C, w.layers) : fd(C), dd(C, me.getState().layers), Rt && Rt.free(), Rt = C, i(C), c(true), p.current = w.version;
            const _ = C.get_cell_tree();
            if (_) {
              ye.getState().setCellTree(_);
              const R = C.active_cell_name();
              R && ye.getState().setActiveCell(R);
            } else w.cells && (pw(w.cells) ? ye.getState().setCellTree([
              w.cells
            ]) : ye.getState().setCells(w.cells));
            w.filename && ye.getState().setProjectName(w.filename);
          } catch (C) {
            console.error("Failed to parse design:", C);
          }
        } catch (w) {
          console.error("Failed to parse SSE event:", w);
        }
      }), E.onerror = () => {
        console.warn("SSE connection error, reconnecting...");
      }, () => {
        E.close();
      };
    }, [
      l,
      n
    ]), m.useEffect(() => {
      if (!l || !n || !To()) return;
      const E = cw();
      if (!E || E.startsWith("//") || /^https?:\/\//i.test(E)) {
        console.error("Embed mode requires a relative ?src= parameter pointing to a JSON file");
        return;
      }
      let k = false;
      return (async () => {
        try {
          const w = await fetch(E);
          if (!w.ok) throw new Error(`Failed to fetch ${E}: ${w.status}`);
          const C = await w.text();
          if (k) return;
          const _ = l.WasmLibrary.from_library_json(C);
          fd(_);
          const R = uw(), A = dw();
          if (R || A) {
            const N = me.getState().layers, U = Array.from(N.values()).map((X, J) => {
              let ae = X;
              return R && J < R.length && (ae = {
                ...ae,
                color: R[J]
              }), A && J < A.length && A[J] in rf && (ae = {
                ...ae,
                fillPattern: A[J]
              }), ae;
            });
            me.getState().resetLayers(U);
          }
          dd(_, me.getState().layers), Rt && Rt.free(), Rt = _, i(_), c(true);
          const T = fw();
          T && ye.getState().setProjectName(T);
          const B = _.get_cell_tree();
          if (B) {
            ye.getState().setCellTree(B);
            const N = _.active_cell_name();
            N && ye.getState().setActiveCell(N);
          }
        } catch (w) {
          console.error("Failed to load embed design:", w);
        }
      })(), () => {
        k = true;
      };
    }, [
      l,
      n
    ]), m.useEffect(() => {
      if (a) for (const E of f.values()) {
        const k = E.visible ? E.opacity ?? 0.7 : 0, [w, C, _, R] = Ds(E.color, k);
        a.set_layer_color(E.layerNumber, E.datatype, w, C, _, R), a.set_layer_fill_pattern(E.layerNumber, E.datatype, rf[E.fillPattern ?? "solid"] ?? 0);
      }
    }, [
      a,
      f
    ]);
    const v = m.useCallback((E, k, w, C, _) => a ? a.add_rectangle(E, k, w, C, _, 0) ?? null : null, [
      a
    ]), y = m.useCallback((E, k) => a ? a.add_polygon(new Float64Array(E), k, 0) ?? null : null, [
      a
    ]), S = m.useCallback(() => {
      a && a.clear_active_cell();
    }, [
      a
    ]);
    return {
      library: a,
      isReady: s,
      addRectangle: v,
      addPolygon: y,
      clearCell: S
    };
  }
  const xy = 12, bw = 8, vw = 140, xw = 56;
  function Sy(l, n, a, i, s) {
    const c = n.x * a + i.x, f = n.y * a + i.y, h = l.x - c, p = l.y - f;
    return h * h + p * p <= s * s;
  }
  function Sw(l, n, a, i, s, c) {
    const f = l - a, h = n - i, p = s - a, g = c - i, v = f * p + h * g, y = p * p + g * g;
    if (y === 0) return Math.sqrt(f * f + h * h);
    const S = Math.max(0, Math.min(1, v / y)), E = a + S * p, k = i + S * g, w = l - E, C = n - k;
    return Math.sqrt(w * w + C * C);
  }
  function ww(l, n, a, i, s, c) {
    const f = a.start.x * i + s.x, h = a.start.y * i + s.y, p = a.end.x * i + s.x, g = a.end.y * i + s.y;
    return Sw(l, n, f, h, p, g) <= c;
  }
  function Cw(l, n, a, i, s) {
    const c = a.start.x * i + s.x, f = a.start.y * i + s.y, h = a.end.x * i + s.x, p = a.end.y * i + s.y, g = (c + h) / 2, v = (f + p) / 2, y = vw / 2, S = xw / 2;
    return l >= g - y && l <= g + y && n >= v - S && n <= v + S;
  }
  function wy(l, n, a, i, s, c) {
    const f = {
      x: l,
      y: n
    };
    for (const h of a.values()) if (h.id !== c) {
      if (Sy(f, h.start, i, s, xy)) return {
        rulerId: h.id,
        endpoint: "start"
      };
      if (Sy(f, h.end, i, s, xy)) return {
        rulerId: h.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function Cy(l, n, a, i, s, c) {
    for (const f of a.values()) if (f.id !== c && (Cw(l, n, f, i, s) || ww(l, n, f, i, s, bw))) return f.id;
    return null;
  }
  function Ew(l, n, a, i, s) {
    const c = Ht((P) => P.activeTool), { rulers: f, activeRulerId: h, selectedRulerIds: p, hoveredRulerId: g, draggingEndpoint: v, isMovingRuler: y, startRuler: S, updatePreview: E, finalizeRuler: k, cancelCreation: w, updateEndpoint: C, setHoveredEndpoint: _, setDraggingEndpoint: R, endDraggingEndpoint: A, selectRuler: T, toggleSelection: B, addToSelection: N, clearSelection: L, setHoveredRuler: U, startMoveRuler: X, moveRuler: J, endMoveRuler: ae, setSnapPoint: te } = ke();
    m.useEffect(() => {
      c !== "ruler" && (h && w(), _(null), U(null));
    }, [
      c,
      h,
      w,
      _,
      U
    ]);
    const ce = m.useCallback((P) => {
      if (P.button !== 0) return;
      const xe = P.currentTarget.getBoundingClientRect(), be = P.clientX - xe.left, j = P.clientY - xe.top, D = l(be, j);
      if (!D) return;
      const z = ff(n), Y = hf(be, j, D.x, D.y, z, i, s, P.shiftKey).point, Q = wy(be, j, f, i, s, h ?? void 0);
      if (Q) {
        P.shiftKey ? N([
          Q.rulerId
        ]) : P.metaKey || P.ctrlKey ? B(Q.rulerId) : T(Q.rulerId), R(Q);
        return;
      }
      const W = Cy(be, j, f, i, s, h ?? void 0);
      if (W) {
        P.shiftKey ? N([
          W
        ]) : P.metaKey || P.ctrlKey ? B(W) : p.has(W) ? X(Y) : T(W);
        return;
      }
      if (h) {
        const de = k(Y);
        if (te(null), de && n && a) {
          const oe = new XS(de);
          fe.getState().pushCommand(oe);
        }
      } else p.size > 0 && !P.shiftKey && !P.metaKey && !P.ctrlKey ? L() : p.size === 0 && S(Y);
    }, [
      l,
      n,
      a,
      f,
      i,
      s,
      h,
      p,
      S,
      k,
      R,
      T,
      B,
      N,
      L,
      X,
      te
    ]), ie = m.useCallback((P) => {
      const xe = P.currentTarget.getBoundingClientRect(), be = P.clientX - xe.left, j = P.clientY - xe.top, D = l(be, j);
      if (!D) return;
      const z = ff(n), O = hf(be, j, D.x, D.y, z, i, s, P.shiftKey), Y = O.point;
      if (y) {
        J(Y), te(O.isGeometrySnap ? Y : null);
        return;
      }
      if (v) {
        C(v.rulerId, v.endpoint, Y), te(O.isGeometrySnap ? Y : null);
        return;
      }
      if (h) {
        E(Y), te(O.isGeometrySnap ? Y : null);
        return;
      }
      const Q = wy(be, j, f, i, s);
      _(Q);
      const W = Q ? Q.rulerId : Cy(be, j, f, i, s);
      U(W), !Q && !W && p.size === 0 ? te(O.isGeometrySnap ? Y : null) : te(null);
    }, [
      l,
      n,
      f,
      i,
      s,
      h,
      v,
      y,
      p,
      E,
      C,
      J,
      _,
      U,
      te
    ]), Se = m.useCallback(() => {
      if (v) {
        const P = A();
        if (te(null), P && n && a) {
          const ue = new _v(P.rulerId, P.endpoint, P.oldPosition, P.newPosition);
          fe.getState().pushCommand(ue);
        }
      }
      if (y) {
        const P = ae();
        if (P && n && a) {
          const ue = new Ev(P.rulerIds, P.deltaX, P.deltaY);
          fe.getState().pushCommand(ue);
        }
      }
    }, [
      v,
      y,
      A,
      ae,
      n,
      a,
      te
    ]), $ = m.useCallback(() => {
      w(), _(null), U(null), R(null), te(null);
    }, [
      w,
      _,
      U,
      R,
      te
    ]);
    return {
      handleMouseDown: ce,
      handleMouseMove: ie,
      handleMouseUp: Se,
      cancelDrawing: $,
      isCreating: h !== null,
      isDraggingEndpoint: v !== null,
      isMovingRuler: y,
      hoveredRulerId: g,
      selectedRulerIds: p
    };
  }
  const ps = "#ff0000", hd = 4;
  function _w() {
    const [l, n] = m.useState({
      x: 0,
      y: 0
    });
    return m.useEffect(() => {
      const a = (i) => {
        n({
          x: i.clientX,
          y: i.clientY
        });
      };
      return window.addEventListener("mousemove", a), () => window.removeEventListener("mousemove", a);
    }, []), b.jsx("div", {
      className: "pointer-events-none fixed z-50",
      style: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: ps,
        boxShadow: `
          0 0 ${hd}px ${ps},
          0 0 ${hd * 2}px ${ps},
          0 0 ${hd * 3}px ${ps}`,
        opacity: 0.9,
        left: 0,
        top: 0,
        transform: `translate(${l.x - 4}px, ${l.y - 4}px)`,
        willChange: "transform"
      }
    });
  }
  const Mw = "rgba(46, 229, 120, 0.1)", kw = "rgba(46, 229, 120, 0.6)";
  function jw({ box: l }) {
    const n = l.width >= 0 ? l.x : l.x + l.width, a = l.height >= 0 ? l.y : l.y + l.height, i = Math.abs(l.width), s = Math.abs(l.height);
    return i < 2 && s < 2 ? null : b.jsx("div", {
      className: "pointer-events-none absolute",
      style: {
        left: n,
        top: a,
        width: i,
        height: s,
        backgroundColor: Mw,
        border: `1px solid ${kw}`
      }
    });
  }
  const Rw = "rgba(59, 130, 246, 0.1)", Lw = "rgba(59, 130, 246, 0.6)";
  function Aw({ box: l }) {
    const n = l.width >= 0 ? l.x : l.x + l.width, a = l.height >= 0 ? l.y : l.y + l.height, i = Math.abs(l.width), s = Math.abs(l.height);
    return i < 2 && s < 2 ? null : b.jsx("div", {
      className: "pointer-events-none absolute",
      style: {
        left: n,
        top: a,
        width: i,
        height: s,
        backgroundColor: Rw,
        border: `1px solid ${Lw}`
      }
    });
  }
  function Tw({ points: l, cursorPoint: n, isNearStart: a, alignmentGuides: i }) {
    var _a;
    const { zoom: s, offset: c } = ze(), f = me((A) => A.activeLayerId), g = ((_a = me((A) => A.layers).get(f)) == null ? void 0 : _a.color) ?? "#888888", v = (A) => ({
      x: A.x * s + c.x,
      y: A.y * s + c.y
    });
    if (l.length === 0) return null;
    const S = (n ? [
      ...l,
      n
    ] : l).map(v), E = S.map((A, T) => `${T === 0 ? "M" : "L"} ${A.x} ${A.y}`).join(" "), k = l.length >= 3 && n ? `M ${S[S.length - 1].x} ${S[S.length - 1].y} L ${S[0].x} ${S[0].y}` : "", w = S[0], C = n ? v(n) : null, _ = (i == null ? void 0 : i.alignedVertexX) ? v(i.alignedVertexX) : null, R = (i == null ? void 0 : i.alignedVertexY) ? v(i.alignedVertexY) : null;
    return b.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        C && _ && b.jsx("line", {
          x1: _.x,
          y1: _.y,
          x2: C.x,
          y2: C.y,
          stroke: En.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        C && R && b.jsx("line", {
          x1: R.x,
          y1: R.y,
          x2: C.x,
          y2: C.y,
          stroke: En.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        a && b.jsx("circle", {
          cx: w.x,
          cy: w.y,
          r: 9,
          fill: "none",
          stroke: g,
          strokeWidth: 1.5,
          opacity: 0.5,
          className: "animate-pulse"
        }),
        b.jsx("path", {
          d: E,
          fill: "none",
          stroke: g,
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        k && b.jsx("path", {
          d: k,
          fill: "none",
          stroke: g,
          strokeWidth: a ? 2 : 1,
          strokeDasharray: a ? "none" : "4 4",
          strokeLinecap: "round",
          opacity: a ? 0.8 : 0.5
        }),
        l.map((A, T) => {
          const B = S[T];
          return b.jsx("circle", {
            cx: B.x,
            cy: B.y,
            r: T === 0 ? 4 : 2.5,
            fill: T === 0 ? g : "white",
            stroke: g,
            strokeWidth: 1
          }, T);
        })
      ]
    });
  }
  function Nw({ waypoints: l, cursorPoint: n, alignmentGuides: a }) {
    var _a;
    const { zoom: i, offset: s } = ze(), c = me((N) => N.activeLayerId), f = me((N) => N.layers), h = dn((N) => N.width), p = dn((N) => N.cornerRadius), g = dn((N) => N.numArcPoints), y = ((_a = f.get(c)) == null ? void 0 : _a.color) ?? "#888888", S = (N) => ({
      x: N.x * i + s.x,
      y: N.y * i + s.y
    });
    if (l.length === 0) return null;
    const E = n ? [
      ...l,
      n
    ] : l, k = E.map(S), w = k.map((N, L) => `${L === 0 ? "M" : "L"} ${N.x} ${N.y}`).join(" "), _ = YS(E, h, p, g).map(S), R = _.length > 0 ? _.map((N, L) => `${L === 0 ? "M" : "L"} ${N.x} ${N.y}`).join(" ") + " Z" : "", A = n ? S(n) : null, T = (a == null ? void 0 : a.alignedVertexX) ? S(a.alignedVertexX) : null, B = (a == null ? void 0 : a.alignedVertexY) ? S(a.alignedVertexY) : null;
    return b.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        A && T && b.jsx("line", {
          x1: T.x,
          y1: T.y,
          x2: A.x,
          y2: A.y,
          stroke: En.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        A && B && b.jsx("line", {
          x1: B.x,
          y1: B.y,
          x2: A.x,
          y2: A.y,
          stroke: En.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        R && b.jsx("path", {
          d: R,
          fill: y,
          fillOpacity: 0.15,
          stroke: "none"
        }),
        R && b.jsx("path", {
          d: R,
          fill: "none",
          stroke: y,
          strokeWidth: 1,
          strokeOpacity: 0.4
        }),
        b.jsx("path", {
          d: w,
          fill: "none",
          stroke: y,
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        l.map((N, L) => {
          const U = k[L];
          return b.jsx("circle", {
            cx: U.x,
            cy: U.y,
            r: L === 0 ? 4 : 2.5,
            fill: L === 0 ? y : "white",
            stroke: y,
            strokeWidth: 1
          }, L);
        })
      ]
    });
  }
  function Of(l) {
    const n = 1 / (l * ve), a = gv * n;
    return a >= Vg ? {
      unit: "mm",
      scale: Vg
    } : a >= $g ? {
      unit: "\xB5m",
      scale: $g
    } : {
      unit: "nm",
      scale: 1
    };
  }
  function Ow(l) {
    return Number.isFinite(l) ? l : 0;
  }
  function mt(l, n) {
    const a = Ow(l) / n.scale;
    return Math.abs(a) >= 1e6 ? a.toExponential(3) : a.toFixed(3);
  }
  const Dw = {
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
  }, Ey = 3, _y = 5, zw = 6, Iw = {
    dark: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: En.dark
    },
    light: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: En.light
    }
  };
  function Hw(l, n) {
    const a = Math.abs(n.x - l.x) / ve, i = Math.abs(n.y - l.y) / ve, s = Math.sqrt(a * a + i * i);
    return {
      dx: a,
      dy: i,
      diagonal: s
    };
  }
  function Yw({ point: l, worldToScreen: n, theme: a }) {
    const i = Iw[a], s = n(l), c = zw;
    return b.jsxs("g", {
      children: [
        b.jsx("circle", {
          cx: s.x,
          cy: s.y,
          r: c,
          fill: i.fill,
          stroke: i.stroke,
          strokeWidth: 2
        }),
        b.jsx("line", {
          x1: s.x - c - 2,
          y1: s.y,
          x2: s.x + c + 2,
          y2: s.y,
          stroke: i.stroke,
          strokeWidth: 1.5
        }),
        b.jsx("line", {
          x1: s.x,
          y1: s.y - c - 2,
          x2: s.x,
          y2: s.y + c + 2,
          stroke: i.stroke,
          strokeWidth: 1.5
        })
      ]
    });
  }
  function Uw({ ruler: l, worldToScreen: n, hoveredEndpoint: a, isSelected: i, isHovered: s, isDragging: c, theme: f, zoom: h }) {
    const p = Dw[f], g = En[f], v = n(l.start), y = n(l.end), S = i ? g : s ? p.hover : p.line, E = i ? g : s ? p.hover : p.border, k = i || s || c ? 2 : 1.5, w = {
      x: (v.x + y.x) / 2,
      y: (v.y + y.y) / 2
    }, { dx: C, dy: _, diagonal: R } = Hw(l.start, l.end), A = Of(h), T = `${mt(C, A)} ${A.unit}`, B = `${mt(_, A)} ${A.unit}`, N = `${mt(R, A)} ${A.unit}`, L = 140, U = 56;
    return b.jsxs("g", {
      children: [
        b.jsx("line", {
          x1: v.x,
          y1: v.y,
          x2: y.x,
          y2: y.y,
          stroke: S,
          strokeWidth: k,
          strokeDasharray: "6 4",
          strokeLinecap: "round"
        }),
        b.jsx("foreignObject", {
          x: w.x - L / 2,
          y: w.y - U / 2,
          width: L,
          height: U,
          overflow: "visible",
          children: b.jsx("div", {
            style: {
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: b.jsxs("div", {
              style: {
                backgroundColor: p.background,
                border: `1px solid ${E}`,
                borderRadius: "4px",
                padding: "4px 8px",
                fontFamily: "monospace",
                fontSize: "11px",
                color: p.text,
                lineHeight: "14px",
                whiteSpace: "nowrap"
              },
              children: [
                b.jsxs("div", {
                  children: [
                    b.jsx("span", {
                      style: {
                        opacity: 0.7
                      },
                      children: "\u0394x"
                    }),
                    " ",
                    T
                  ]
                }),
                b.jsxs("div", {
                  children: [
                    b.jsx("span", {
                      style: {
                        opacity: 0.7
                      },
                      children: "\u0394y"
                    }),
                    " ",
                    B
                  ]
                }),
                b.jsxs("div", {
                  children: [
                    b.jsx("span", {
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
        b.jsx("circle", {
          cx: v.x,
          cy: v.y,
          r: a === "start" ? _y : Ey,
          fill: i ? g : a === "start" ? p.hover : p.endpoint,
          stroke: i ? g : a === "start" ? p.hover : "none",
          strokeWidth: a === "start" || i ? 2 : 0,
          style: {
            transition: "r 0.1s, fill 0.1s"
          }
        }),
        b.jsx("circle", {
          cx: y.x,
          cy: y.y,
          r: a === "end" ? _y : Ey,
          fill: i ? g : a === "end" ? p.hover : p.endpoint,
          stroke: i ? g : a === "end" ? p.hover : "none",
          strokeWidth: a === "end" || i ? 2 : 0,
          style: {
            transition: "r 0.1s, fill 0.1s"
          }
        })
      ]
    });
  }
  function Bw() {
    const { zoom: l, offset: n } = ze(), a = he((S) => S.theme), { rulers: i, activeRulerId: s, selectedRulerIds: c, hoveredRulerId: f, marqueePreviewIds: h, hoveredEndpoint: p, draggingEndpoint: g, snapPoint: v } = ke(), y = (S) => ({
      x: S.x * l + n.x,
      y: S.y * l + n.y
    });
    return i.size === 0 && !v ? null : b.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        Array.from(i.values()).map((S) => {
          const E = S.id === s, k = c.has(S.id), w = S.id === f || h.has(S.id), C = (p == null ? void 0 : p.rulerId) === S.id, _ = (g == null ? void 0 : g.rulerId) === S.id;
          return b.jsx(Uw, {
            ruler: S,
            worldToScreen: y,
            hoveredEndpoint: C ? p.endpoint : _ ? g.endpoint : null,
            isSelected: k,
            isHovered: w && !k,
            isDragging: _ || E,
            theme: a,
            zoom: l
          }, S.id);
        }),
        v && b.jsx(Yw, {
          point: v,
          worldToScreen: y,
          theme: a
        })
      ]
    });
  }
  const My = "ref:";
  function n1(l) {
    if (!l.startsWith(My)) return null;
    const n = l.slice(My.length), a = n.indexOf(":");
    if (a === -1) return null;
    const i = Number.parseInt(n.slice(0, a), 10);
    return Number.isNaN(i) ? null : i;
  }
  function Xw(l) {
    const n = /* @__PURE__ */ new Set();
    for (const a of l) {
      const i = n1(a);
      i !== null && n.add(i);
    }
    return n;
  }
  const Cn = 9;
  function Vw(l, n, a, i) {
    if (!l) return null;
    const s = `ref:${n}:0`, c = l.get_cell_ref_info(s);
    if (!c) return null;
    const [f, h, p, g, v, y] = c.transform, S = c.cell_name;
    c.free();
    const E = l.get_cell_origin_by_name(S), k = E ? E[0] : 0, w = E ? E[1] : 0, C = f * k + h * w + v, _ = p * k + g * w + y;
    return {
      x: C * a + i.x,
      y: _ * a + i.y
    };
  }
  function $w() {
    const { zoom: l, offset: n } = ze(), a = Ce((y) => y.library), s = he((y) => y.theme) === "dark";
    Ce((y) => y.syncGeneration), ye((y) => y.activeCell);
    const c = se((y) => y.selectedIds), f = se((y) => y.hoveredId), h = Xw(c);
    if (f) {
      const y = n1(f);
      y !== null && h.add(y);
    }
    if (h.size === 0) return null;
    let p = [];
    if (a) try {
      const y = a.get_instance_label_data();
      y && Array.isArray(y) && (p = y);
    } catch {
      return null;
    }
    const g = p.filter((y) => h.has(y.elementIndex));
    if (g.length === 0) return null;
    const v = s ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
    return b.jsx(b.Fragment, {
      children: g.map((y) => {
        const S = y.minX * l + n.x, E = y.minY * l + n.y, k = Vw(a, y.elementIndex, l, n);
        return b.jsxs("div", {
          children: [
            b.jsx("div", {
              className: q("pointer-events-none absolute text-[13px] leading-none font-mono select-none", s ? "text-white" : "text-black"),
              style: {
                left: `${S}px`,
                top: `${E}px`,
                transform: "translateY(-100%)",
                paddingBottom: "2px"
              },
              children: y.name
            }),
            k && b.jsxs("svg", {
              className: "pointer-events-none absolute top-0 left-0 select-none",
              style: {
                width: `${Cn * 2 + 1}px`,
                height: `${Cn * 2 + 1}px`,
                transform: `translate(${k.x - Cn}px, ${k.y - Cn}px)`
              },
              viewBox: `0 0 ${Cn * 2 + 1} ${Cn * 2 + 1}`,
              children: [
                b.jsx("line", {
                  x1: "0",
                  y1: Cn,
                  x2: Cn * 2,
                  y2: Cn,
                  stroke: v,
                  strokeWidth: "1"
                }),
                b.jsx("line", {
                  x1: Cn,
                  y1: "0",
                  x2: Cn,
                  y2: Cn * 2,
                  stroke: v,
                  strokeWidth: "1"
                })
              ]
            })
          ]
        }, `inst-${y.elementIndex}`);
      })
    });
  }
  function qw(l, n) {
    const a = n / kf, i = l.split(`
`), s = Math.max(1, ...i.map((h) => h.length)), c = a * 0.6 * s, f = a * 1.2 * i.length;
    return {
      width: c,
      totalHeight: f
    };
  }
  function Gw({ label: l, zoom: n, offset: a, color: i, isSelected: s, isHovered: c }) {
    const f = l.height / kf * n;
    if (f < 1) return null;
    const { width: h, totalHeight: p } = qw(l.text, l.height), g = l.x * n + a.x, v = (l.y - p) * n + a.y, y = s || c;
    let S;
    if (y) {
      const E = h * n, k = p * n, w = s ? "rgba(68, 255, 68, 0.8)" : i;
      S = {
        position: "absolute",
        left: "-3px",
        top: "-3px",
        width: `${E + 6}px`,
        height: `${k + 6}px`,
        border: `1.5px solid ${w}`,
        borderRadius: "1px",
        pointerEvents: "none"
      };
    }
    return b.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0 select-none whitespace-pre",
      style: {
        transform: `translate(${g}px, ${v}px)`,
        fontSize: `${f}px`,
        lineHeight: 1.2,
        fontFamily: bv,
        color: s ? "rgb(68, 255, 68)" : i
      },
      children: [
        y && b.jsx("div", {
          style: S
        }),
        l.text
      ]
    });
  }
  function Zw({ zoom: l, offset: n, color: a }) {
    const i = It((_) => _.activeText), s = It((_) => _.showCursor);
    if (!i) return null;
    const c = yv * ve / kf * l;
    if (c < 1) return null;
    const f = c * 1.2, h = c * 0.6, p = i.content.split(`
`), g = f * Math.max(1, p.length), v = i.x * l + n.x, y = i.y * l + n.y - g, S = Nf(i.selection), E = i.cursorPosition.line, w = i.cursorPosition.column * h, C = E * f;
    return b.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0 select-none",
      style: {
        transform: `translate(${v}px, ${y}px)`,
        fontSize: `${c}px`,
        lineHeight: `${f}px`,
        fontFamily: bv,
        color: a
      },
      children: [
        p.map((_, R) => {
          if (!(S && R >= S.start.line && R <= S.end.line)) return b.jsx("div", {
            style: {
              height: `${f}px`,
              whiteSpace: "pre"
            },
            children: _ || "\u200B"
          }, R);
          const T = R === S.start.line ? S.start.column : 0, B = R === S.end.line ? S.end.column : _.length, N = _.substring(0, T), L = _.substring(T, B), U = _.substring(B);
          return b.jsxs("div", {
            style: {
              height: `${f}px`,
              whiteSpace: "pre"
            },
            children: [
              N && b.jsx("span", {
                children: N
              }),
              L && b.jsx("span", {
                style: {
                  backgroundColor: "rgba(65, 105, 225, 0.7)",
                  color: "#ffffff"
                },
                children: L
              }),
              U && b.jsx("span", {
                children: U
              }),
              !_ && "\u200B"
            ]
          }, R);
        }),
        s && b.jsx("div", {
          className: "absolute",
          style: {
            left: `${w}px`,
            top: `${C}px`,
            width: "2px",
            height: `${f}px`,
            backgroundColor: a
          }
        })
      ]
    });
  }
  function Kw() {
    var _a;
    const { zoom: l, offset: n } = ze(), a = Ce((_) => _.library), s = he((_) => _.theme) === "dark", c = It((_) => _.isEditingText), f = Ce((_) => _.syncGeneration), h = ye((_) => _.activeCell), p = se((_) => _.selectedIds), g = se((_) => _.hoveredId), v = me((_) => _.layers), y = me((_) => _.activeLayerId), S = m.useMemo(() => {
      if (!a) return [];
      try {
        const _ = a.get_text_labels();
        if (_ && Array.isArray(_)) return _;
      } catch {
      }
      return [];
    }, [
      a,
      f,
      h
    ]), k = ((_a = v.get(y)) == null ? void 0 : _a.color) ?? (s ? "#ffffff" : "#000000"), w = (_, R) => {
      for (const A of v.values()) if (A.layerNumber === _ && A.datatype === R) return A.color;
      return s ? "#ffffff" : "#000000";
    };
    return S.length > 0 || c ? b.jsxs("div", {
      className: q("pointer-events-none absolute inset-0 overflow-hidden"),
      children: [
        S.map((_) => b.jsx(Gw, {
          label: _,
          zoom: l,
          offset: n,
          color: w(_.layer, _.datatype),
          isSelected: p.has(_.id),
          isHovered: g === _.id
        }, _.id)),
        c && b.jsx(Zw, {
          zoom: l,
          offset: n,
          color: k
        })
      ]
    }) : null;
  }
  function Pw() {
    const { zoom: l, offset: n } = ze(), a = se((S) => S.selectedIds), i = se((S) => S.hoveredId), s = dn((S) => S.pathMetadata), c = he((S) => S.theme), f = c === "dark" ? En.dark : En.light, h = c === "dark" ? ks.dark : ks.light, p = (S) => ({
      x: S.x * l + n.x,
      y: S.y * l + n.y
    }), g = [];
    for (const S of a) {
      const E = s.get(S);
      E && E.waypoints.length >= 2 && g.push({
        meta: E,
        color: f
      });
    }
    let v = null;
    if (i && !a.has(i)) {
      const S = s.get(i);
      S && S.waypoints.length >= 2 && (v = {
        meta: S,
        color: h
      });
    }
    const y = v ? [
      ...g,
      v
    ] : g;
    return y.length === 0 ? null : b.jsx("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: y.map(({ meta: S, color: E }, k) => {
        const w = S.waypoints.map(p), C = w.map((_, R) => `${R === 0 ? "M" : "L"} ${_.x} ${_.y}`).join(" ");
        return b.jsxs("g", {
          children: [
            b.jsx("path", {
              d: C,
              fill: "none",
              stroke: E,
              strokeWidth: 1,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeOpacity: 0.8
            }),
            w.map((_, R) => b.jsx("circle", {
              cx: _.x,
              cy: _.y,
              r: 3,
              fill: E,
              fillOpacity: 0.9
            }, R))
          ]
        }, k);
      })
    });
  }
  function Us(l, n) {
    m.useEffect(() => {
      if (n) return uf.getState().claim(l), () => {
        uf.getState().release(l);
      };
    }, [
      l,
      n
    ]);
  }
  function Qw(l) {
    return "separator" in l && l.separator;
  }
  function Fw({ library: l, renderer: n, canvasRef: a }) {
    const i = m.useRef(null), { isOpen: s, position: c, variant: f, targetId: h, close: p } = Os(), { selectedIds: g } = se(), { hasContent: v } = Gn(), S = he((A) => A.theme) === "dark";
    Us("context-menu", s);
    const E = l ? l.get_all_ids().length > 0 : false, k = g.size > 0, C = m.useCallback(() => {
      const A = () => {
        if (!l) return;
        const U = jr(l, g);
        Gn.getState().copy(U), p();
      }, T = () => {
        if (!l || !n) return;
        const U = new Hs();
        fe.getState().execute(U, {
          library: l,
          renderer: n
        });
        const X = a.current;
        X && _r(l, X), p();
      }, B = () => {
        if (!l || !n || g.size === 0) return;
        const U = new Ys([
          ...g
        ]);
        fe.getState().execute(U, {
          library: l,
          renderer: n
        });
        const X = a.current;
        X && _r(l, X), p();
      }, N = () => {
        if (!l || !n || g.size === 0) return;
        const U = new Is([
          ...g
        ]);
        fe.getState().execute(U, {
          library: l,
          renderer: n
        }), p();
      }, L = () => {
        if (!l) return;
        const U = l.get_all_ids();
        se.getState().selectAll(U), p();
      };
      if (f === "element") return [
        {
          id: "edit",
          label: "Edit",
          shortcut: {
            key: "E"
          },
          action: () => {
            he.getState().requestInspectorFocus(), p();
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
              Ne.mod
            ],
            key: "C"
          },
          action: A,
          disabled: !k
        },
        {
          id: "paste",
          label: "Paste",
          shortcut: {
            modifiers: [
              Ne.mod
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
              Ne.mod
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
            key: Ne.backspace
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
              Ne.mod
            ],
            key: "A"
          },
          action: L,
          disabled: !E
        }
      ];
      if (f === "ruler") {
        const U = () => {
          if (!l || !n) return;
          const { selectedRulerIds: X } = ke.getState();
          if (X.size > 0) {
            const J = new Rf([
              ...X
            ]);
            fe.getState().execute(J, {
              library: l,
              renderer: n
            });
          }
          p();
        };
        return [
          {
            id: "paste",
            label: "Paste",
            shortcut: {
              modifiers: [
                Ne.mod
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
              key: Ne.backspace
            },
            action: U,
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
                Ne.mod
              ],
              key: "A"
            },
            action: L,
            disabled: true
          }
        ];
      }
      if (f === "layer") {
        const U = h ? Number(h) : null, X = me.getState(), J = U !== null ? X.getLayer(U) : void 0, ae = X.layers.size <= 1, te = () => {
          if (!l || !n) return;
          const D = new Mv();
          fe.getState().execute(D, {
            library: l,
            renderer: n
          }), p();
        }, ce = () => {
          U !== null && me.getState().setEditingLayerId(U), p();
        }, ie = () => {
          U !== null && me.getState().toggleVisibility(U), p();
        }, Se = () => {
          if (!l || !n || U === null) return;
          const D = new kv(U);
          fe.getState().execute(D, {
            library: l,
            renderer: n
          }), p();
        }, $ = Array.from(X.layers.values()), P = $.every((D) => D.visible), ue = $.every((D) => !D.visible), xe = () => {
          me.getState().showAllLayers(), p();
        }, be = () => {
          me.getState().hideAllLayers(), p();
        };
        return [
          {
            id: "editLayer",
            label: "Edit Layer",
            action: () => {
              U !== null && (me.getState().setExpandedLayerId(U), me.getState().setActiveLayer(U), he.getState().setSidebarTab("layers")), p();
            },
            disabled: !J
          },
          {
            id: "addLayer",
            label: "Add Layer",
            action: te,
            disabled: false
          },
          {
            id: "rename",
            label: "Rename Layer",
            action: ce,
            disabled: !J
          },
          {
            id: "toggleVisibility",
            label: (J == null ? void 0 : J.visible) ? "Hide Layer" : "Show Layer",
            action: ie,
            disabled: !J
          },
          {
            id: "sep1",
            separator: true
          },
          {
            id: "showAll",
            label: "Show All Layers",
            action: xe,
            disabled: P
          },
          {
            id: "hideAll",
            label: "Hide All Layers",
            action: be,
            disabled: ue
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "delete",
            label: "Delete Layer",
            action: Se,
            disabled: !J || ae
          }
        ];
      }
      if (f === "cell") {
        const U = h, X = ye.getState(), J = X.cells.length <= 1, ae = () => {
          if (!l || !n) return;
          const j = X.cells;
          let D = 1, z = `cell${D}`;
          for (; j.includes(z); ) D++, z = `cell${D}`;
          const O = new Rv(z);
          fe.getState().execute(O, {
            library: l,
            renderer: n
          }), p();
        }, te = () => {
          U && ye.getState().setEditingCellName(U), p();
        }, ce = () => {
          if (!l || !n || !U) return;
          const j = new Lv(U);
          fe.getState().execute(j, {
            library: l,
            renderer: n
          }), p();
        }, ie = U ? X.hiddenCells.has(U) : false, Se = () => {
          U && ye.getState().toggleCellVisibility(U), p();
        }, $ = X.cells, P = $.every((j) => !X.hiddenCells.has(j)), ue = $.every((j) => X.hiddenCells.has(j));
        return [
          {
            id: "addCell",
            label: "Add Cell",
            action: ae,
            disabled: false
          },
          {
            id: "rename",
            label: "Rename Cell",
            action: te,
            disabled: !U
          },
          {
            id: "toggleVisibility",
            label: ie ? "Show Cell" : "Hide Cell",
            action: Se,
            disabled: !U
          },
          {
            id: "sep1",
            separator: true
          },
          {
            id: "showAllCells",
            label: "Show All Cells",
            action: () => {
              ye.getState().showAllCells(), p();
            },
            disabled: P
          },
          {
            id: "hideAllCells",
            label: "Hide All Cells",
            action: () => {
              ye.getState().hideAllCells(), p();
            },
            disabled: ue
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "delete",
            label: "Delete Cell",
            action: ce,
            disabled: !U || J
          }
        ];
      }
      return [
        {
          id: "paste",
          label: "Paste",
          shortcut: {
            modifiers: [
              Ne.mod
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
              Ne.mod
            ],
            key: "A"
          },
          action: L,
          disabled: !E
        }
      ];
    }, [
      f,
      l,
      n,
      g,
      k,
      v,
      E,
      p,
      a,
      h
    ])();
    m.useEffect(() => {
      if (!s) return;
      const A = (T) => {
        i.current && !i.current.contains(T.target) && p();
      };
      return document.addEventListener("mousedown", A), () => document.removeEventListener("mousedown", A);
    }, [
      s,
      p
    ]), m.useEffect(() => {
      if (!s) return;
      const A = (T) => {
        T.key === "Escape" && (T.preventDefault(), p());
      };
      return document.addEventListener("keydown", A), () => document.removeEventListener("keydown", A);
    }, [
      s,
      p
    ]);
    const [_, R] = m.useState(c);
    return m.useLayoutEffect(() => {
      if (!s || !i.current) {
        R(c);
        return;
      }
      const T = i.current.getBoundingClientRect(), B = 8;
      let { x: N, y: L } = c;
      N + T.width + B > window.innerWidth && (N = window.innerWidth - T.width - B), L + T.height + B > window.innerHeight && (L = window.innerHeight - T.height - B), N < B && (N = B), L < B && (L = B), R({
        x: N,
        y: L
      });
    }, [
      s,
      c
    ]), s ? b.jsx("div", {
      ref: i,
      className: q("fixed z-50 min-w-[170px] rounded-xl border py-1", S ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      style: {
        left: _.x,
        top: _.y
      },
      children: C.map((A) => {
        var _a;
        if (Qw(A)) return b.jsx("div", {
          className: q("my-1 h-px", S ? "bg-white/10" : "bg-black/10")
        }, A.id);
        const T = A;
        return b.jsxs("button", {
          className: q("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs", "transition-colors", T.disabled ? "opacity-40" : S ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          onClick: () => {
            T.disabled || T.action();
          },
          disabled: T.disabled,
          children: [
            b.jsx("span", {
              children: T.label
            }),
            T.shortcut && b.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = T.shortcut.modifiers) == null ? void 0 : _a.map((B) => b.jsx("kbd", {
                  className: q("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", S ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: B
                }, B)),
                b.jsx("kbd", {
                  className: q("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", S ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: T.shortcut.key
                })
              ]
            })
          ]
        }, T.id);
      })
    }) : null;
  }
  const ky = "rosette-canvas";
  function jy() {
    const l = m.useRef(null), n = m.useRef(null), a = m.useRef({
      x: 0,
      y: 0
    }), i = m.useRef(null), s = m.useRef(null), [c, f] = m.useState(false), [h, p] = m.useState(false), { wasm: g, isReady: v } = pv(), { renderer: y, isReady: S, render: E, resize: k, screenToWorld: w, error: C } = RS(c ? ky : null), { library: _ } = yw(g, v);
    m.useEffect(() => (Ce.getState().setLibrary(_), () => Ce.getState().setLibrary(null)), [
      _
    ]), m.useEffect(() => (Ce.getState().setRenderer(y), () => Ce.getState().setRenderer(null)), [
      y
    ]);
    const { zoomAt: R, pan: A, initOffset: T, zoom: B, offset: N } = ze(), L = he((le) => le.setCursorWorld), U = he((le) => le.theme), X = Ht((le) => le.activeTool), { handleMouseDown: J, handleMouseMove: ae, handleMouseUp: te, isLaserActive: ce } = I2(y, S), { handleMouseDown: ie, handleMouseMove: Se, handleMouseUp: $, box: P, isZoomActive: ue, isDrawingZoom: xe } = Y2(n), { handleMouseDown: be, handleMouseMove: j, finalizeRectangle: D, cancelDrawing: z } = U2(w, _, y), { handleMouseDown: O, handleMouseMove: Y, handleMouseUp: Q, handleMouseLeave: W, hoveredId: de, hoveredRulerId: oe, marqueeBox: Me, isDrawingMarquee: Xe } = W2(w, _, y), { handleMouseDown: Re, handleMouseMove: Ie, handleMouseUp: Ve, handleMouseLeave: Mt, hoveredRulerId: Yt } = lw(w, _, y), { handleMouseDown: _n, handleMouseMove: fn, cancelDrawing: Dn, points: bl, cursorPoint: er, isNearStart: _a, alignmentGuides: Ma } = X2(w, _, y, B), { handleMouseDown: Ct, handleMouseMove: tr, cancelDrawing: ka, waypoints: ja, cursorPoint: Lr, alignmentGuides: qs } = $2(w, _, y, B), { handleMouseDown: Ra, handleMouseMove: Bo, handleMouseUp: Xo, cancelDrawing: vl, isCreating: Ut, isDraggingEndpoint: zn, isMovingRuler: Bt, hoveredRulerId: Gs } = Ew(w, _, y, B, N), { handleMouseDown: Vo, handleMouseMove: $o, cancelEditing: nr, isEditing: Ar } = sw(w, _, y);
    m.useEffect(() => {
      const le = l.current, _e = n.current;
      if (!le || !_e) return;
      const We = () => {
        const ot = le.getBoundingClientRect(), ut = Math.floor(ot.width), Ze = Math.floor(ot.height);
        if (ut > 0 && Ze > 0) {
          const lt = window.devicePixelRatio || 1;
          _e.width = Math.floor(ut * lt), _e.height = Math.floor(Ze * lt), _e.style.width = `${ut}px`, _e.style.height = `${Ze}px`, T(ut, Ze), c || f(true), k(Math.floor(ut * lt), Math.floor(Ze * lt)), E();
        }
      };
      We();
      const He = new ResizeObserver(We);
      return He.observe(le), () => He.disconnect();
    }, [
      k,
      E,
      c,
      T
    ]), m.useEffect(() => {
      if (!S) return;
      let le;
      const _e = () => {
        E(), le = requestAnimationFrame(_e);
      };
      return _e(), () => cancelAnimationFrame(le);
    }, [
      S,
      E
    ]);
    const Tr = me((le) => le.layers);
    m.useEffect(() => {
      !y || !_ || (y.sync_from_library(_), y.mark_dirty());
    }, [
      y,
      _,
      Tr
    ]);
    const hn = ye((le) => le.activeCell);
    m.useEffect(() => {
      if (!_ || !y || !hn) return;
      if (_.active_cell_name() !== hn) {
        _.set_active_cell(hn), y.sync_from_library(_), y.mark_dirty();
        const _e = n.current;
        if (_e) {
          const We = _.get_all_bounds(), He = Zn(_e);
          if (We && He.width > 0 && He.height > 0) {
            const ot = {
              minX: We[0],
              minY: We[1],
              maxX: We[2],
              maxY: We[3]
            };
            ze.getState().zoomToFit(ot, He.width, He.height, He.screenCenter);
          }
        }
      }
    }, [
      _,
      y,
      hn
    ]);
    const xl = ye((le) => le.hierarchyLevelLimit);
    m.useEffect(() => {
      if (!_ || !y) return;
      const le = xl === 1 / 0 ? 0 : xl;
      _.set_hierarchy_depth_limit(le), y.sync_from_library(_), y.mark_dirty();
    }, [
      _,
      y,
      xl
    ]);
    const Kn = ye((le) => le.hiddenCells);
    m.useEffect(() => {
      if (!_ || !y) return;
      const le = new Set(_.get_hidden_cells());
      for (const _e of le) Kn.has(_e) || _.set_cell_visibility(_e, true);
      for (const _e of Kn) le.has(_e) || _.set_cell_visibility(_e, false);
      y.sync_from_library(_), y.mark_dirty();
    }, [
      _,
      y,
      Kn
    ]);
    const qo = m.useRef(false), Nr = m.useRef(null);
    m.useEffect(() => {
      const le = n.current;
      if (!_ || !le) return;
      const _e = _.get_all_bounds();
      if (!_e) return;
      const We = {
        minX: _e[0],
        minY: _e[1],
        maxX: _e[2],
        maxY: _e[3]
      }, He = Zn(le);
      if (He.width <= 0 || He.height <= 0) return;
      const ot = Nr.current !== null && Nr.current !== _;
      if (!qo.current || ot) {
        ze.getState().zoomToFit(We, He.width, He.height, He.screenCenter);
        const Ze = To() ? hw() : null;
        if (Ze !== null) {
          const lt = He.screenCenter ?? {
            x: He.width / 2,
            y: He.height / 2
          };
          ze.getState().zoomAt(Ze, lt.x, lt.y);
        }
        qo.current = true;
      }
      Nr.current = _;
    }, [
      _
    ]);
    const lr = m.useCallback((le) => {
      le.preventDefault();
      const _e = n.current;
      if (!_e) return;
      const We = _e.getBoundingClientRect(), He = le.clientX - We.left, ot = le.clientY - We.top, ut = le.ctrlKey || Math.abs(le.deltaY) < 50;
      let Ze;
      ut ? Ze = Math.pow(2, -le.deltaY * 0.01) : Ze = le.deltaY > 0 ? Ns : Ts, R(Ze, He, ot);
    }, [
      R
    ]), rr = m.useCallback((le) => {
      if (X === "laser" && le.button === 0) {
        J(le);
        return;
      }
      if (X === "zoom" && le.button === 0) {
        ie(le);
        return;
      }
      if (X === "rectangle" && le.button === 0) {
        be(le);
        return;
      }
      if (X === "select" && le.button === 0) {
        O(le);
        return;
      }
      if (X === "move" && le.button === 0) {
        Re(le);
        return;
      }
      if (X === "polygon" && le.button === 0) {
        _n(le);
        return;
      }
      if (X === "path" && le.button === 0) {
        Ct(le);
        return;
      }
      if (X === "ruler" && le.button === 0) {
        Ra(le);
        return;
      }
      if (X === "text" && le.button === 0) {
        Vo(le);
        return;
      }
      (le.button === 1 || le.button === 0 && X === "pan") && (p(true), a.current = {
        x: le.clientX,
        y: le.clientY
      });
    }, [
      X,
      J,
      ie,
      be,
      O,
      Re,
      _n,
      Ct,
      Ra,
      Vo
    ]), In = m.useRef(0);
    m.useEffect(() => () => {
      In.current && cancelAnimationFrame(In.current);
    }, []), m.useEffect(() => {
      const le = i.current;
      if (!le) return;
      const _e = (le.x - N.x) / B, We = (le.y - N.y) / B, He = Math.trunc(_e / ve), ot = Math.trunc(We / ve);
      L({
        x: He,
        y: -ot
      });
    }, [
      B,
      N,
      L
    ]);
    const Go = m.useCallback((le) => {
      const _e = n.current;
      if (!_e) return;
      const We = _e.getBoundingClientRect(), He = le.clientX - We.left, ot = le.clientY - We.top;
      i.current = {
        x: He,
        y: ot
      };
      let ut = false;
      X === "laser" && ae(le), X === "zoom" && Se(le), X === "rectangle" && j(He, ot) && (ut = true), X === "select" && Y(le), X === "move" && Ie(le), X === "polygon" && fn(le), X === "path" && tr(le), X === "ruler" && Bo(le), X === "text" && $o(le);
      const Ze = w(He, ot);
      if (s.current = Ze, In.current === 0 && (In.current = requestAnimationFrame(() => {
        In.current = 0;
        const lt = s.current;
        if (lt) {
          const Pe = Math.trunc(lt.x / ve), at = Math.trunc(lt.y / ve);
          L({
            x: Pe,
            y: -at
          });
        } else L(null);
      })), h) {
        const lt = le.clientX - a.current.x, Pe = le.clientY - a.current.y;
        a.current = {
          x: le.clientX,
          y: le.clientY
        }, A(lt, Pe);
      }
      ut && E();
    }, [
      A,
      w,
      L,
      h,
      X,
      ae,
      Se,
      j,
      Y,
      Ie,
      fn,
      tr,
      Bo,
      $o,
      E
    ]), Zo = m.useCallback(() => {
      X === "laser" && te(), X === "zoom" && $(), X === "rectangle" && s.current && D(s.current.x, s.current.y), X === "select" && Q(), X === "move" && Ve(), X === "ruler" && Xo(), p(false);
    }, [
      X,
      te,
      $,
      D,
      Q,
      Ve,
      Xo
    ]), Ko = m.useCallback(() => {
      p(false), z(), Dn(), ka(), vl(), nr(), W(), Mt(), In.current && (cancelAnimationFrame(In.current), In.current = 0), i.current = null, L(null);
    }, [
      L,
      z,
      Dn,
      ka,
      vl,
      nr,
      W,
      Mt
    ]), Pn = Os((le) => le.open), La = m.useCallback((le) => {
      le.preventDefault();
      const _e = n.current;
      if (!_e) return;
      const We = _e.getBoundingClientRect(), He = le.clientX - We.left, ot = le.clientY - We.top, ut = w(He, ot);
      if (!ut) return;
      const { rulers: Ze, selectRuler: lt } = ke.getState();
      for (const Pe of Ze.values()) {
        const at = Pe.start.x * B + N.x, Lt = Pe.start.y * B + N.y, kt = Pe.end.x * B + N.x, Je = Pe.end.y * B + N.y, Mn = (at + kt) / 2, Sl = (Lt + Je) / 2, tn = 70, kn = 28;
        if (He >= Mn - tn && He <= Mn + tn && ot >= Sl - kn && ot <= Sl + kn) {
          lt(Pe.id), Pn("ruler", {
            x: le.clientX,
            y: le.clientY
          }, Pe.id);
          return;
        }
        const Aa = He - at, wl = ot - Lt, Yn = kt - at, Cl = Je - Lt, or = Aa * Yn + wl * Cl, Fn = Yn * Yn + Cl * Cl;
        if (Fn > 0) {
          const Gt = Math.max(0, Math.min(1, or / Fn)), Dt = at + Gt * Yn, Po = Lt + Gt * Cl, Qo = He - Dt, Or = ot - Po;
          if (Math.sqrt(Qo * Qo + Or * Or) <= 8) {
            lt(Pe.id), Pn("ruler", {
              x: le.clientX,
              y: le.clientY
            }, Pe.id);
            return;
          }
        }
      }
      if (_) {
        const Pe = _.hit_test(ut.x, ut.y);
        if (Pe) {
          const at = _.get_group_ids(Pe), { selectedIds: Lt, setSelection: kt } = se.getState();
          at.every((Mn) => Lt.has(Mn)) || kt(new Set(at)), Pn("element", {
            x: le.clientX,
            y: le.clientY
          }, Pe);
          return;
        }
      }
      Pn("canvas", {
        x: le.clientX,
        y: le.clientY
      });
    }, [
      _,
      w,
      Pn,
      B,
      N
    ]), Hn = Es((le) => le.cellName), ar = m.useRef(null);
    if (m.useEffect(() => {
      if (!Hn) return;
      const le = n.current;
      if (!le || !y || !_) return;
      const { bounds: _e, origin: We } = Es.getState(), He = (ut) => {
        if (!_e) return;
        const Ze = le.getBoundingClientRect(), lt = ut.clientX - Ze.left, Pe = ut.clientY - Ze.top, at = w(lt, Pe);
        if (!at) return;
        const Lt = at.x - We.x, kt = at.y - We.y, Je = _e[0] + Lt, Mn = _e[1] + kt, Sl = _e[2] + Lt, tn = _e[3] + kt, kn = new Float64Array([
          Je,
          Mn,
          Sl,
          Mn,
          Sl,
          tn,
          Je,
          tn
        ]), Aa = new Float32Array([
          0.5,
          0.5,
          0.5,
          0
        ]);
        y.set_preview_shape(kn, Aa);
        const { zoom: wl, offset: Yn } = ze.getState(), Cl = 9 / wl, Fn = he.getState().theme === "dark" ? new Float32Array([
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
        if (y.set_preview_origin(at.x, at.y, Cl, Fn), y.mark_dirty(), ar.current) {
          const Gt = Je * wl + Yn.x, Dt = Mn * wl + Yn.y;
          ar.current.style.transform = `translate(${Gt}px, ${Dt}px) translateY(-100%)`, ar.current.style.display = "block";
        }
      }, ot = (ut) => {
        const Ze = le.getBoundingClientRect(), lt = ut.clientX - Ze.left, Pe = ut.clientY - Ze.top, at = w(lt, Pe);
        y.clear_preview(), y.mark_dirty();
        const Lt = lt >= 0 && Pe >= 0 && lt <= Ze.width && Pe <= Ze.height;
        if (at && Lt) {
          const kt = _.active_cell_name();
          if (kt && kt !== Hn && _.can_instance_cell(kt, Hn)) {
            const Je = new Tv(Hn, at.x, at.y);
            fe.getState().execute(Je, {
              library: _,
              renderer: y
            });
          }
        }
        Es.getState().endDrag();
      };
      return document.addEventListener("mousemove", He), document.addEventListener("mouseup", ot), () => {
        document.removeEventListener("mousemove", He), document.removeEventListener("mouseup", ot), y.clear_preview(), y.mark_dirty();
      };
    }, [
      Hn,
      _,
      y,
      w
    ]), m.useEffect(() => {
      const le = n.current;
      if (le) return le.addEventListener("wheel", lr, {
        passive: false
      }), () => le.removeEventListener("wheel", lr);
    }, [
      lr
    ]), L2(n, _, y), C) return b.jsx("div", {
      className: "flex h-full w-full items-center justify-center bg-red-950 text-red-200",
      children: b.jsxs("div", {
        className: "text-center",
        children: [
          b.jsx("p", {
            className: "text-lg font-semibold",
            children: "Failed to initialize renderer"
          }),
          b.jsx("p", {
            className: "mt-2 text-sm opacity-75",
            children: C.message
          }),
          b.jsx("p", {
            className: "mt-4 text-xs opacity-50",
            children: "WebGPU may not be supported in your browser. Try Chrome 113+, Safari 17+, or Edge 113+."
          })
        ]
      })
    });
    const Et = (() => {
      if (h || Bt) return "cursor-grabbing";
      if (X === "pan") return "cursor-grab";
      if (X === "move") return "cursor-move";
      if (ce) return "cursor-none";
      if (ue || X === "rectangle" || X === "polygon" || X === "path") return "cursor-crosshair";
      if (X === "text") return Ar ? "cursor-text" : "cursor-crosshair";
      if (X === "ruler") return zn ? "cursor-grabbing" : Ut ? "cursor-crosshair" : Gs ? "cursor-pointer" : "cursor-crosshair";
      if (X === "select") {
        if (Xe) return "cursor-crosshair";
        if (oe || de) return "cursor-pointer";
      }
      return "cursor-default";
    })();
    return b.jsxs("div", {
      ref: l,
      className: "relative h-full w-full select-none overflow-hidden",
      children: [
        b.jsx("canvas", {
          ref: n,
          id: ky,
          className: Et,
          onMouseDown: rr,
          onMouseMove: Go,
          onMouseUp: Zo,
          onMouseLeave: Ko,
          onContextMenu: La
        }),
        ce && !h && b.jsx(_w, {}),
        xe && P && b.jsx(jw, {
          box: P
        }),
        Xe && Me && b.jsx(Aw, {
          box: Me
        }),
        X === "polygon" && bl.length > 0 && b.jsx(Tw, {
          points: bl,
          cursorPoint: er,
          isNearStart: _a,
          alignmentGuides: Ma
        }),
        X === "path" && ja.length > 0 && b.jsx(Nw, {
          waypoints: ja,
          cursorPoint: Lr,
          alignmentGuides: qs
        }),
        Hn && b.jsx("div", {
          ref: ar,
          className: `pointer-events-none absolute top-0 left-0 text-[13px] leading-none font-mono select-none ${U === "dark" ? "text-white" : "text-black"}`,
          style: {
            display: "none",
            paddingBottom: "2px"
          },
          children: Hn
        }),
        b.jsx(Pw, {}),
        b.jsx($w, {}),
        b.jsx(Kw, {}),
        b.jsx(Bw, {}),
        b.jsx(Fw, {
          library: _,
          renderer: y,
          canvasRef: n
        })
      ]
    });
  }
  var Ry = 1, Ww = 0.9, Jw = 0.8, e5 = 0.17, md = 0.1, pd = 0.999, t5 = 0.9999, n5 = 0.99, l5 = /[\\\/_+.#"@\[\(\{&]/, r5 = /[\\\/_+.#"@\[\(\{&]/g, a5 = /[\s-]/, l1 = /[\s-]/g;
  function yf(l, n, a, i, s, c, f) {
    if (c === n.length) return s === l.length ? Ry : n5;
    var h = `${s},${c}`;
    if (f[h] !== void 0) return f[h];
    for (var p = i.charAt(c), g = a.indexOf(p, s), v = 0, y, S, E, k; g >= 0; ) y = yf(l, n, a, i, g + 1, c + 1, f), y > v && (g === s ? y *= Ry : l5.test(l.charAt(g - 1)) ? (y *= Jw, E = l.slice(s, g - 1).match(r5), E && s > 0 && (y *= Math.pow(pd, E.length))) : a5.test(l.charAt(g - 1)) ? (y *= Ww, k = l.slice(s, g - 1).match(l1), k && s > 0 && (y *= Math.pow(pd, k.length))) : (y *= e5, s > 0 && (y *= Math.pow(pd, g - s))), l.charAt(g) !== n.charAt(c) && (y *= t5)), (y < md && a.charAt(g - 1) === i.charAt(c + 1) || i.charAt(c + 1) === i.charAt(c) && a.charAt(g - 1) !== i.charAt(c)) && (S = yf(l, n, a, i, g + 1, c + 2, f), S * md > y && (y = S * md)), y > v && (v = y), g = a.indexOf(p, g + 1);
    return f[h] = v, v;
  }
  function Ly(l) {
    return l.toLowerCase().replace(l1, " ");
  }
  function o5(l, n, a) {
    return l = a && a.length > 0 ? `${l + " " + a.join(" ")}` : l, yf(l, n, Ly(l), Ly(n), 0, 0, {});
  }
  function Ql(l, n, { checkForDefaultPrevented: a = true } = {}) {
    return function(s) {
      if (l == null ? void 0 : l(s), a === false || !s.defaultPrevented) return n == null ? void 0 : n(s);
    };
  }
  function Ay(l, n) {
    if (typeof l == "function") return l(n);
    l != null && (l.current = n);
  }
  function Fl(...l) {
    return (n) => {
      let a = false;
      const i = l.map((s) => {
        const c = Ay(s, n);
        return !a && typeof c == "function" && (a = true), c;
      });
      if (a) return () => {
        for (let s = 0; s < i.length; s++) {
          const c = i[s];
          typeof c == "function" ? c() : Ay(l[s], null);
        }
      };
    };
  }
  function Rr(...l) {
    return m.useCallback(Fl(...l), l);
  }
  function i5(l, n) {
    const a = m.createContext(n), i = (c) => {
      const { children: f, ...h } = c, p = m.useMemo(() => h, Object.values(h));
      return b.jsx(a.Provider, {
        value: p,
        children: f
      });
    };
    i.displayName = l + "Provider";
    function s(c) {
      const f = m.useContext(a);
      if (f) return f;
      if (n !== void 0) return n;
      throw new Error(`\`${c}\` must be used within \`${l}\``);
    }
    return [
      i,
      s
    ];
  }
  function s5(l, n = []) {
    let a = [];
    function i(c, f) {
      const h = m.createContext(f), p = a.length;
      a = [
        ...a,
        f
      ];
      const g = (y) => {
        var _a;
        const { scope: S, children: E, ...k } = y, w = ((_a = S == null ? void 0 : S[l]) == null ? void 0 : _a[p]) || h, C = m.useMemo(() => k, Object.values(k));
        return b.jsx(w.Provider, {
          value: C,
          children: E
        });
      };
      g.displayName = c + "Provider";
      function v(y, S) {
        var _a;
        const E = ((_a = S == null ? void 0 : S[l]) == null ? void 0 : _a[p]) || h, k = m.useContext(E);
        if (k) return k;
        if (f !== void 0) return f;
        throw new Error(`\`${y}\` must be used within \`${c}\``);
      }
      return [
        g,
        v
      ];
    }
    const s = () => {
      const c = a.map((f) => m.createContext(f));
      return function(h) {
        const p = (h == null ? void 0 : h[l]) || c;
        return m.useMemo(() => ({
          [`__scope${l}`]: {
            ...h,
            [l]: p
          }
        }), [
          h,
          p
        ]);
      };
    };
    return s.scopeName = l, [
      i,
      c5(s, ...n)
    ];
  }
  function c5(...l) {
    const n = l[0];
    if (l.length === 1) return n;
    const a = () => {
      const i = l.map((s) => ({
        useScope: s(),
        scopeName: s.scopeName
      }));
      return function(c) {
        const f = i.reduce((h, { useScope: p, scopeName: g }) => {
          const y = p(c)[`__scope${g}`];
          return {
            ...h,
            ...y
          };
        }, {});
        return m.useMemo(() => ({
          [`__scope${n.scopeName}`]: f
        }), [
          f
        ]);
      };
    };
    return a.scopeName = n.scopeName, a;
  }
  var No = (globalThis == null ? void 0 : globalThis.document) ? m.useLayoutEffect : () => {
  }, u5 = _f[" useId ".trim().toString()] || (() => {
  }), d5 = 0;
  function yl(l) {
    const [n, a] = m.useState(u5());
    return No(() => {
      a((i) => i ?? String(d5++));
    }, [
      l
    ]), n ? `radix-${n}` : "";
  }
  var f5 = _f[" useInsertionEffect ".trim().toString()] || No;
  function h5({ prop: l, defaultProp: n, onChange: a = () => {
  }, caller: i }) {
    const [s, c, f] = m5({
      defaultProp: n,
      onChange: a
    }), h = l !== void 0, p = h ? l : s;
    {
      const v = m.useRef(l !== void 0);
      m.useEffect(() => {
        const y = v.current;
        y !== h && console.warn(`${i} is changing from ${y ? "controlled" : "uncontrolled"} to ${h ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`), v.current = h;
      }, [
        h,
        i
      ]);
    }
    const g = m.useCallback((v) => {
      var _a;
      if (h) {
        const y = p5(v) ? v(l) : v;
        y !== l && ((_a = f.current) == null ? void 0 : _a.call(f, y));
      } else c(v);
    }, [
      h,
      l,
      c,
      f
    ]);
    return [
      p,
      g
    ];
  }
  function m5({ defaultProp: l, onChange: n }) {
    const [a, i] = m.useState(l), s = m.useRef(a), c = m.useRef(n);
    return f5(() => {
      c.current = n;
    }, [
      n
    ]), m.useEffect(() => {
      var _a;
      s.current !== a && ((_a = c.current) == null ? void 0 : _a.call(c, a), s.current = a);
    }, [
      a,
      s
    ]), [
      a,
      i,
      c
    ];
  }
  function p5(l) {
    return typeof l == "function";
  }
  var Io = mv();
  const g5 = hv(Io);
  function Ho(l) {
    const n = y5(l), a = m.forwardRef((i, s) => {
      const { children: c, ...f } = i, h = m.Children.toArray(c), p = h.find(v5);
      if (p) {
        const g = p.props.children, v = h.map((y) => y === p ? m.Children.count(g) > 1 ? m.Children.only(null) : m.isValidElement(g) ? g.props.children : null : y);
        return b.jsx(n, {
          ...f,
          ref: s,
          children: m.isValidElement(g) ? m.cloneElement(g, void 0, v) : null
        });
      }
      return b.jsx(n, {
        ...f,
        ref: s,
        children: c
      });
    });
    return a.displayName = `${l}.Slot`, a;
  }
  function y5(l) {
    const n = m.forwardRef((a, i) => {
      const { children: s, ...c } = a;
      if (m.isValidElement(s)) {
        const f = S5(s), h = x5(c, s.props);
        return s.type !== m.Fragment && (h.ref = i ? Fl(i, f) : f), m.cloneElement(s, h);
      }
      return m.Children.count(s) > 1 ? m.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var b5 = Symbol("radix.slottable");
  function v5(l) {
    return m.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === b5;
  }
  function x5(l, n) {
    const a = {
      ...n
    };
    for (const i in n) {
      const s = l[i], c = n[i];
      /^on[A-Z]/.test(i) ? s && c ? a[i] = (...h) => {
        const p = c(...h);
        return s(...h), p;
      } : s && (a[i] = s) : i === "style" ? a[i] = {
        ...s,
        ...c
      } : i === "className" && (a[i] = [
        s,
        c
      ].filter(Boolean).join(" "));
    }
    return {
      ...l,
      ...a
    };
  }
  function S5(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, a = n && "isReactWarning" in n && n.isReactWarning;
    return a ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, a = n && "isReactWarning" in n && n.isReactWarning, a ? l.props.ref : l.props.ref || l.ref);
  }
  var w5 = [
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
  ], r1 = w5.reduce((l, n) => {
    const a = Ho(`Primitive.${n}`), i = m.forwardRef((s, c) => {
      const { asChild: f, ...h } = s, p = f ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), b.jsx(p, {
        ...h,
        ref: c
      });
    });
    return i.displayName = `Primitive.${n}`, {
      ...l,
      [n]: i
    };
  }, {});
  function C5(l, n) {
    l && Io.flushSync(() => l.dispatchEvent(n));
  }
  function Oo(l) {
    const n = m.useRef(l);
    return m.useEffect(() => {
      n.current = l;
    }), m.useMemo(() => (...a) => {
      var _a;
      return (_a = n.current) == null ? void 0 : _a.call(n, ...a);
    }, []);
  }
  function E5(l, n = globalThis == null ? void 0 : globalThis.document) {
    const a = Oo(l);
    m.useEffect(() => {
      const i = (s) => {
        s.key === "Escape" && a(s);
      };
      return n.addEventListener("keydown", i, {
        capture: true
      }), () => n.removeEventListener("keydown", i, {
        capture: true
      });
    }, [
      a,
      n
    ]);
  }
  var _5 = "DismissableLayer", bf = "dismissableLayer.update", M5 = "dismissableLayer.pointerDownOutside", k5 = "dismissableLayer.focusOutside", Ty, a1 = m.createContext({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  }), o1 = m.forwardRef((l, n) => {
    const { disableOutsidePointerEvents: a = false, onEscapeKeyDown: i, onPointerDownOutside: s, onFocusOutside: c, onInteractOutside: f, onDismiss: h, ...p } = l, g = m.useContext(a1), [v, y] = m.useState(null), S = (v == null ? void 0 : v.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, E] = m.useState({}), k = Rr(n, (L) => y(L)), w = Array.from(g.layers), [C] = [
      ...g.layersWithOutsidePointerEventsDisabled
    ].slice(-1), _ = w.indexOf(C), R = v ? w.indexOf(v) : -1, A = g.layersWithOutsidePointerEventsDisabled.size > 0, T = R >= _, B = L5((L) => {
      const U = L.target, X = [
        ...g.branches
      ].some((J) => J.contains(U));
      !T || X || (s == null ? void 0 : s(L), f == null ? void 0 : f(L), L.defaultPrevented || (h == null ? void 0 : h()));
    }, S), N = A5((L) => {
      const U = L.target;
      [
        ...g.branches
      ].some((J) => J.contains(U)) || (c == null ? void 0 : c(L), f == null ? void 0 : f(L), L.defaultPrevented || (h == null ? void 0 : h()));
    }, S);
    return E5((L) => {
      R === g.layers.size - 1 && (i == null ? void 0 : i(L), !L.defaultPrevented && h && (L.preventDefault(), h()));
    }, S), m.useEffect(() => {
      if (v) return a && (g.layersWithOutsidePointerEventsDisabled.size === 0 && (Ty = S.body.style.pointerEvents, S.body.style.pointerEvents = "none"), g.layersWithOutsidePointerEventsDisabled.add(v)), g.layers.add(v), Ny(), () => {
        a && g.layersWithOutsidePointerEventsDisabled.size === 1 && (S.body.style.pointerEvents = Ty);
      };
    }, [
      v,
      S,
      a,
      g
    ]), m.useEffect(() => () => {
      v && (g.layers.delete(v), g.layersWithOutsidePointerEventsDisabled.delete(v), Ny());
    }, [
      v,
      g
    ]), m.useEffect(() => {
      const L = () => E({});
      return document.addEventListener(bf, L), () => document.removeEventListener(bf, L);
    }, []), b.jsx(r1.div, {
      ...p,
      ref: k,
      style: {
        pointerEvents: A ? T ? "auto" : "none" : void 0,
        ...l.style
      },
      onFocusCapture: Ql(l.onFocusCapture, N.onFocusCapture),
      onBlurCapture: Ql(l.onBlurCapture, N.onBlurCapture),
      onPointerDownCapture: Ql(l.onPointerDownCapture, B.onPointerDownCapture)
    });
  });
  o1.displayName = _5;
  var j5 = "DismissableLayerBranch", R5 = m.forwardRef((l, n) => {
    const a = m.useContext(a1), i = m.useRef(null), s = Rr(n, i);
    return m.useEffect(() => {
      const c = i.current;
      if (c) return a.branches.add(c), () => {
        a.branches.delete(c);
      };
    }, [
      a.branches
    ]), b.jsx(r1.div, {
      ...l,
      ref: s
    });
  });
  R5.displayName = j5;
  function L5(l, n = globalThis == null ? void 0 : globalThis.document) {
    const a = Oo(l), i = m.useRef(false), s = m.useRef(() => {
    });
    return m.useEffect(() => {
      const c = (h) => {
        if (h.target && !i.current) {
          let p = function() {
            i1(M5, a, g, {
              discrete: true
            });
          };
          const g = {
            originalEvent: h
          };
          h.pointerType === "touch" ? (n.removeEventListener("click", s.current), s.current = p, n.addEventListener("click", s.current, {
            once: true
          })) : p();
        } else n.removeEventListener("click", s.current);
        i.current = false;
      }, f = window.setTimeout(() => {
        n.addEventListener("pointerdown", c);
      }, 0);
      return () => {
        window.clearTimeout(f), n.removeEventListener("pointerdown", c), n.removeEventListener("click", s.current);
      };
    }, [
      n,
      a
    ]), {
      onPointerDownCapture: () => i.current = true
    };
  }
  function A5(l, n = globalThis == null ? void 0 : globalThis.document) {
    const a = Oo(l), i = m.useRef(false);
    return m.useEffect(() => {
      const s = (c) => {
        c.target && !i.current && i1(k5, a, {
          originalEvent: c
        }, {
          discrete: false
        });
      };
      return n.addEventListener("focusin", s), () => n.removeEventListener("focusin", s);
    }, [
      n,
      a
    ]), {
      onFocusCapture: () => i.current = true,
      onBlurCapture: () => i.current = false
    };
  }
  function Ny() {
    const l = new CustomEvent(bf);
    document.dispatchEvent(l);
  }
  function i1(l, n, a, { discrete: i }) {
    const s = a.originalEvent.target, c = new CustomEvent(l, {
      bubbles: false,
      cancelable: true,
      detail: a
    });
    n && s.addEventListener(l, n, {
      once: true
    }), i ? C5(s, c) : s.dispatchEvent(c);
  }
  var T5 = [
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
  ], N5 = T5.reduce((l, n) => {
    const a = Ho(`Primitive.${n}`), i = m.forwardRef((s, c) => {
      const { asChild: f, ...h } = s, p = f ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), b.jsx(p, {
        ...h,
        ref: c
      });
    });
    return i.displayName = `Primitive.${n}`, {
      ...l,
      [n]: i
    };
  }, {}), gd = "focusScope.autoFocusOnMount", yd = "focusScope.autoFocusOnUnmount", Oy = {
    bubbles: false,
    cancelable: true
  }, O5 = "FocusScope", s1 = m.forwardRef((l, n) => {
    const { loop: a = false, trapped: i = false, onMountAutoFocus: s, onUnmountAutoFocus: c, ...f } = l, [h, p] = m.useState(null), g = Oo(s), v = Oo(c), y = m.useRef(null), S = Rr(n, (w) => p(w)), E = m.useRef({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    }).current;
    m.useEffect(() => {
      if (i) {
        let w = function(A) {
          if (E.paused || !h) return;
          const T = A.target;
          h.contains(T) ? y.current = T : Pl(y.current, {
            select: true
          });
        }, C = function(A) {
          if (E.paused || !h) return;
          const T = A.relatedTarget;
          T !== null && (h.contains(T) || Pl(y.current, {
            select: true
          }));
        }, _ = function(A) {
          if (document.activeElement === document.body) for (const B of A) B.removedNodes.length > 0 && Pl(h);
        };
        document.addEventListener("focusin", w), document.addEventListener("focusout", C);
        const R = new MutationObserver(_);
        return h && R.observe(h, {
          childList: true,
          subtree: true
        }), () => {
          document.removeEventListener("focusin", w), document.removeEventListener("focusout", C), R.disconnect();
        };
      }
    }, [
      i,
      h,
      E.paused
    ]), m.useEffect(() => {
      if (h) {
        zy.add(E);
        const w = document.activeElement;
        if (!h.contains(w)) {
          const _ = new CustomEvent(gd, Oy);
          h.addEventListener(gd, g), h.dispatchEvent(_), _.defaultPrevented || (D5(U5(c1(h)), {
            select: true
          }), document.activeElement === w && Pl(h));
        }
        return () => {
          h.removeEventListener(gd, g), setTimeout(() => {
            const _ = new CustomEvent(yd, Oy);
            h.addEventListener(yd, v), h.dispatchEvent(_), _.defaultPrevented || Pl(w ?? document.body, {
              select: true
            }), h.removeEventListener(yd, v), zy.remove(E);
          }, 0);
        };
      }
    }, [
      h,
      g,
      v,
      E
    ]);
    const k = m.useCallback((w) => {
      if (!a && !i || E.paused) return;
      const C = w.key === "Tab" && !w.altKey && !w.ctrlKey && !w.metaKey, _ = document.activeElement;
      if (C && _) {
        const R = w.currentTarget, [A, T] = z5(R);
        A && T ? !w.shiftKey && _ === T ? (w.preventDefault(), a && Pl(A, {
          select: true
        })) : w.shiftKey && _ === A && (w.preventDefault(), a && Pl(T, {
          select: true
        })) : _ === R && w.preventDefault();
      }
    }, [
      a,
      i,
      E.paused
    ]);
    return b.jsx(N5.div, {
      tabIndex: -1,
      ...f,
      ref: S,
      onKeyDown: k
    });
  });
  s1.displayName = O5;
  function D5(l, { select: n = false } = {}) {
    const a = document.activeElement;
    for (const i of l) if (Pl(i, {
      select: n
    }), document.activeElement !== a) return;
  }
  function z5(l) {
    const n = c1(l), a = Dy(n, l), i = Dy(n.reverse(), l);
    return [
      a,
      i
    ];
  }
  function c1(l) {
    const n = [], a = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (i) => {
        const s = i.tagName === "INPUT" && i.type === "hidden";
        return i.disabled || i.hidden || s ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    for (; a.nextNode(); ) n.push(a.currentNode);
    return n;
  }
  function Dy(l, n) {
    for (const a of l) if (!I5(a, {
      upTo: n
    })) return a;
  }
  function I5(l, { upTo: n }) {
    if (getComputedStyle(l).visibility === "hidden") return true;
    for (; l; ) {
      if (n !== void 0 && l === n) return false;
      if (getComputedStyle(l).display === "none") return true;
      l = l.parentElement;
    }
    return false;
  }
  function H5(l) {
    return l instanceof HTMLInputElement && "select" in l;
  }
  function Pl(l, { select: n = false } = {}) {
    if (l && l.focus) {
      const a = document.activeElement;
      l.focus({
        preventScroll: true
      }), l !== a && H5(l) && n && l.select();
    }
  }
  var zy = Y5();
  function Y5() {
    let l = [];
    return {
      add(n) {
        const a = l[0];
        n !== a && (a == null ? void 0 : a.pause()), l = Iy(l, n), l.unshift(n);
      },
      remove(n) {
        var _a;
        l = Iy(l, n), (_a = l[0]) == null ? void 0 : _a.resume();
      }
    };
  }
  function Iy(l, n) {
    const a = [
      ...l
    ], i = a.indexOf(n);
    return i !== -1 && a.splice(i, 1), a;
  }
  function U5(l) {
    return l.filter((n) => n.tagName !== "A");
  }
  var B5 = [
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
  ], X5 = B5.reduce((l, n) => {
    const a = Ho(`Primitive.${n}`), i = m.forwardRef((s, c) => {
      const { asChild: f, ...h } = s, p = f ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), b.jsx(p, {
        ...h,
        ref: c
      });
    });
    return i.displayName = `Primitive.${n}`, {
      ...l,
      [n]: i
    };
  }, {}), V5 = "Portal", u1 = m.forwardRef((l, n) => {
    var _a;
    const { container: a, ...i } = l, [s, c] = m.useState(false);
    No(() => c(true), []);
    const f = a || s && ((_a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _a.body);
    return f ? g5.createPortal(b.jsx(X5.div, {
      ...i,
      ref: n
    }), f) : null;
  });
  u1.displayName = V5;
  function $5(l, n) {
    return m.useReducer((a, i) => n[a][i] ?? a, l);
  }
  var Bs = (l) => {
    const { present: n, children: a } = l, i = q5(n), s = typeof a == "function" ? a({
      present: i.isPresent
    }) : m.Children.only(a), c = Rr(i.ref, G5(s));
    return typeof a == "function" || i.isPresent ? m.cloneElement(s, {
      ref: c
    }) : null;
  };
  Bs.displayName = "Presence";
  function q5(l) {
    const [n, a] = m.useState(), i = m.useRef(null), s = m.useRef(l), c = m.useRef("none"), f = l ? "mounted" : "unmounted", [h, p] = $5(f, {
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
    return m.useEffect(() => {
      const g = gs(i.current);
      c.current = h === "mounted" ? g : "none";
    }, [
      h
    ]), No(() => {
      const g = i.current, v = s.current;
      if (v !== l) {
        const S = c.current, E = gs(g);
        l ? p("MOUNT") : E === "none" || (g == null ? void 0 : g.display) === "none" ? p("UNMOUNT") : p(v && S !== E ? "ANIMATION_OUT" : "UNMOUNT"), s.current = l;
      }
    }, [
      l,
      p
    ]), No(() => {
      if (n) {
        let g;
        const v = n.ownerDocument.defaultView ?? window, y = (E) => {
          const w = gs(i.current).includes(CSS.escape(E.animationName));
          if (E.target === n && w && (p("ANIMATION_END"), !s.current)) {
            const C = n.style.animationFillMode;
            n.style.animationFillMode = "forwards", g = v.setTimeout(() => {
              n.style.animationFillMode === "forwards" && (n.style.animationFillMode = C);
            });
          }
        }, S = (E) => {
          E.target === n && (c.current = gs(i.current));
        };
        return n.addEventListener("animationstart", S), n.addEventListener("animationcancel", y), n.addEventListener("animationend", y), () => {
          v.clearTimeout(g), n.removeEventListener("animationstart", S), n.removeEventListener("animationcancel", y), n.removeEventListener("animationend", y);
        };
      } else p("ANIMATION_END");
    }, [
      n,
      p
    ]), {
      isPresent: [
        "mounted",
        "unmountSuspended"
      ].includes(h),
      ref: m.useCallback((g) => {
        i.current = g ? getComputedStyle(g) : null, a(g);
      }, [])
    };
  }
  function gs(l) {
    return (l == null ? void 0 : l.animationName) || "none";
  }
  function G5(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, a = n && "isReactWarning" in n && n.isReactWarning;
    return a ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, a = n && "isReactWarning" in n && n.isReactWarning, a ? l.props.ref : l.props.ref || l.ref);
  }
  var Z5 = [
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
  ], Yo = Z5.reduce((l, n) => {
    const a = Ho(`Primitive.${n}`), i = m.forwardRef((s, c) => {
      const { asChild: f, ...h } = s, p = f ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), b.jsx(p, {
        ...h,
        ref: c
      });
    });
    return i.displayName = `Primitive.${n}`, {
      ...l,
      [n]: i
    };
  }, {}), bd = 0;
  function K5() {
    m.useEffect(() => {
      const l = document.querySelectorAll("[data-radix-focus-guard]");
      return document.body.insertAdjacentElement("afterbegin", l[0] ?? Hy()), document.body.insertAdjacentElement("beforeend", l[1] ?? Hy()), bd++, () => {
        bd === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((n) => n.remove()), bd--;
      };
    }, []);
  }
  function Hy() {
    const l = document.createElement("span");
    return l.setAttribute("data-radix-focus-guard", ""), l.tabIndex = 0, l.style.outline = "none", l.style.opacity = "0", l.style.position = "fixed", l.style.pointerEvents = "none", l;
  }
  var $n = function() {
    return $n = Object.assign || function(n) {
      for (var a, i = 1, s = arguments.length; i < s; i++) {
        a = arguments[i];
        for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (n[c] = a[c]);
      }
      return n;
    }, $n.apply(this, arguments);
  };
  function d1(l, n) {
    var a = {};
    for (var i in l) Object.prototype.hasOwnProperty.call(l, i) && n.indexOf(i) < 0 && (a[i] = l[i]);
    if (l != null && typeof Object.getOwnPropertySymbols == "function") for (var s = 0, i = Object.getOwnPropertySymbols(l); s < i.length; s++) n.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(l, i[s]) && (a[i[s]] = l[i[s]]);
    return a;
  }
  function P5(l, n, a) {
    if (a || arguments.length === 2) for (var i = 0, s = n.length, c; i < s; i++) (c || !(i in n)) && (c || (c = Array.prototype.slice.call(n, 0, i)), c[i] = n[i]);
    return l.concat(c || Array.prototype.slice.call(n));
  }
  var _s = "right-scroll-bar-position", Ms = "width-before-scroll-bar", Q5 = "with-scroll-bars-hidden", F5 = "--removed-body-scroll-bar-size";
  function vd(l, n) {
    return typeof l == "function" ? l(n) : l && (l.current = n), l;
  }
  function W5(l, n) {
    var a = m.useState(function() {
      return {
        value: l,
        callback: n,
        facade: {
          get current() {
            return a.value;
          },
          set current(i) {
            var s = a.value;
            s !== i && (a.value = i, a.callback(i, s));
          }
        }
      };
    })[0];
    return a.callback = n, a.facade;
  }
  var J5 = typeof window < "u" ? m.useLayoutEffect : m.useEffect, Yy = /* @__PURE__ */ new WeakMap();
  function eC(l, n) {
    var a = W5(null, function(i) {
      return l.forEach(function(s) {
        return vd(s, i);
      });
    });
    return J5(function() {
      var i = Yy.get(a);
      if (i) {
        var s = new Set(i), c = new Set(l), f = a.current;
        s.forEach(function(h) {
          c.has(h) || vd(h, null);
        }), c.forEach(function(h) {
          s.has(h) || vd(h, f);
        });
      }
      Yy.set(a, l);
    }, [
      l
    ]), a;
  }
  function tC(l) {
    return l;
  }
  function nC(l, n) {
    n === void 0 && (n = tC);
    var a = [], i = false, s = {
      read: function() {
        if (i) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        return a.length ? a[a.length - 1] : l;
      },
      useMedium: function(c) {
        var f = n(c, i);
        return a.push(f), function() {
          a = a.filter(function(h) {
            return h !== f;
          });
        };
      },
      assignSyncMedium: function(c) {
        for (i = true; a.length; ) {
          var f = a;
          a = [], f.forEach(c);
        }
        a = {
          push: function(h) {
            return c(h);
          },
          filter: function() {
            return a;
          }
        };
      },
      assignMedium: function(c) {
        i = true;
        var f = [];
        if (a.length) {
          var h = a;
          a = [], h.forEach(c), f = a;
        }
        var p = function() {
          var v = f;
          f = [], v.forEach(c);
        }, g = function() {
          return Promise.resolve().then(p);
        };
        g(), a = {
          push: function(v) {
            f.push(v), g();
          },
          filter: function(v) {
            return f = f.filter(v), a;
          }
        };
      }
    };
    return s;
  }
  function lC(l) {
    l === void 0 && (l = {});
    var n = nC(null);
    return n.options = $n({
      async: true,
      ssr: false
    }, l), n;
  }
  var f1 = function(l) {
    var n = l.sideCar, a = d1(l, [
      "sideCar"
    ]);
    if (!n) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    var i = n.read();
    if (!i) throw new Error("Sidecar medium not found");
    return m.createElement(i, $n({}, a));
  };
  f1.isSideCarExport = true;
  function rC(l, n) {
    return l.useMedium(n), f1;
  }
  var h1 = lC(), xd = function() {
  }, Xs = m.forwardRef(function(l, n) {
    var a = m.useRef(null), i = m.useState({
      onScrollCapture: xd,
      onWheelCapture: xd,
      onTouchMoveCapture: xd
    }), s = i[0], c = i[1], f = l.forwardProps, h = l.children, p = l.className, g = l.removeScrollBar, v = l.enabled, y = l.shards, S = l.sideCar, E = l.noRelative, k = l.noIsolation, w = l.inert, C = l.allowPinchZoom, _ = l.as, R = _ === void 0 ? "div" : _, A = l.gapMode, T = d1(l, [
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
    ]), B = S, N = eC([
      a,
      n
    ]), L = $n($n({}, T), s);
    return m.createElement(m.Fragment, null, v && m.createElement(B, {
      sideCar: h1,
      removeScrollBar: g,
      shards: y,
      noRelative: E,
      noIsolation: k,
      inert: w,
      setCallbacks: c,
      allowPinchZoom: !!C,
      lockRef: a,
      gapMode: A
    }), f ? m.cloneElement(m.Children.only(h), $n($n({}, L), {
      ref: N
    })) : m.createElement(R, $n({}, L, {
      className: p,
      ref: N
    }), h));
  });
  Xs.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  Xs.classNames = {
    fullWidth: Ms,
    zeroRight: _s
  };
  var aC = function() {
    if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
  };
  function oC() {
    if (!document) return null;
    var l = document.createElement("style");
    l.type = "text/css";
    var n = aC();
    return n && l.setAttribute("nonce", n), l;
  }
  function iC(l, n) {
    l.styleSheet ? l.styleSheet.cssText = n : l.appendChild(document.createTextNode(n));
  }
  function sC(l) {
    var n = document.head || document.getElementsByTagName("head")[0];
    n.appendChild(l);
  }
  var cC = function() {
    var l = 0, n = null;
    return {
      add: function(a) {
        l == 0 && (n = oC()) && (iC(n, a), sC(n)), l++;
      },
      remove: function() {
        l--, !l && n && (n.parentNode && n.parentNode.removeChild(n), n = null);
      }
    };
  }, uC = function() {
    var l = cC();
    return function(n, a) {
      m.useEffect(function() {
        return l.add(n), function() {
          l.remove();
        };
      }, [
        n && a
      ]);
    };
  }, m1 = function() {
    var l = uC(), n = function(a) {
      var i = a.styles, s = a.dynamic;
      return l(i, s), null;
    };
    return n;
  }, dC = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  }, Sd = function(l) {
    return parseInt(l || "", 10) || 0;
  }, fC = function(l) {
    var n = window.getComputedStyle(document.body), a = n[l === "padding" ? "paddingLeft" : "marginLeft"], i = n[l === "padding" ? "paddingTop" : "marginTop"], s = n[l === "padding" ? "paddingRight" : "marginRight"];
    return [
      Sd(a),
      Sd(i),
      Sd(s)
    ];
  }, hC = function(l) {
    if (l === void 0 && (l = "margin"), typeof window > "u") return dC;
    var n = fC(l), a = document.documentElement.clientWidth, i = window.innerWidth;
    return {
      left: n[0],
      top: n[1],
      right: n[2],
      gap: Math.max(0, i - a + n[2] - n[0])
    };
  }, mC = m1(), wa = "data-scroll-locked", pC = function(l, n, a, i) {
    var s = l.left, c = l.top, f = l.right, h = l.gap;
    return a === void 0 && (a = "margin"), `
  .`.concat(Q5, ` {
   overflow: hidden `).concat(i, `;
   padding-right: `).concat(h, "px ").concat(i, `;
  }
  body[`).concat(wa, `] {
    overflow: hidden `).concat(i, `;
    overscroll-behavior: contain;
    `).concat([
      n && "position: relative ".concat(i, ";"),
      a === "margin" && `
    padding-left: `.concat(s, `px;
    padding-top: `).concat(c, `px;
    padding-right: `).concat(f, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(h, "px ").concat(i, `;
    `),
      a === "padding" && "padding-right: ".concat(h, "px ").concat(i, ";")
    ].filter(Boolean).join(""), `
  }
  
  .`).concat(_s, ` {
    right: `).concat(h, "px ").concat(i, `;
  }
  
  .`).concat(Ms, ` {
    margin-right: `).concat(h, "px ").concat(i, `;
  }
  
  .`).concat(_s, " .").concat(_s, ` {
    right: 0 `).concat(i, `;
  }
  
  .`).concat(Ms, " .").concat(Ms, ` {
    margin-right: 0 `).concat(i, `;
  }
  
  body[`).concat(wa, `] {
    `).concat(F5, ": ").concat(h, `px;
  }
`);
  }, Uy = function() {
    var l = parseInt(document.body.getAttribute(wa) || "0", 10);
    return isFinite(l) ? l : 0;
  }, gC = function() {
    m.useEffect(function() {
      return document.body.setAttribute(wa, (Uy() + 1).toString()), function() {
        var l = Uy() - 1;
        l <= 0 ? document.body.removeAttribute(wa) : document.body.setAttribute(wa, l.toString());
      };
    }, []);
  }, yC = function(l) {
    var n = l.noRelative, a = l.noImportant, i = l.gapMode, s = i === void 0 ? "margin" : i;
    gC();
    var c = m.useMemo(function() {
      return hC(s);
    }, [
      s
    ]);
    return m.createElement(mC, {
      styles: pC(c, !n, s, a ? "" : "!important")
    });
  }, vf = false;
  if (typeof window < "u") try {
    var ys = Object.defineProperty({}, "passive", {
      get: function() {
        return vf = true, true;
      }
    });
    window.addEventListener("test", ys, ys), window.removeEventListener("test", ys, ys);
  } catch {
    vf = false;
  }
  var pa = vf ? {
    passive: false
  } : false, bC = function(l) {
    return l.tagName === "TEXTAREA";
  }, p1 = function(l, n) {
    if (!(l instanceof Element)) return false;
    var a = window.getComputedStyle(l);
    return a[n] !== "hidden" && !(a.overflowY === a.overflowX && !bC(l) && a[n] === "visible");
  }, vC = function(l) {
    return p1(l, "overflowY");
  }, xC = function(l) {
    return p1(l, "overflowX");
  }, By = function(l, n) {
    var a = n.ownerDocument, i = n;
    do {
      typeof ShadowRoot < "u" && i instanceof ShadowRoot && (i = i.host);
      var s = g1(l, i);
      if (s) {
        var c = y1(l, i), f = c[1], h = c[2];
        if (f > h) return true;
      }
      i = i.parentNode;
    } while (i && i !== a.body);
    return false;
  }, SC = function(l) {
    var n = l.scrollTop, a = l.scrollHeight, i = l.clientHeight;
    return [
      n,
      a,
      i
    ];
  }, wC = function(l) {
    var n = l.scrollLeft, a = l.scrollWidth, i = l.clientWidth;
    return [
      n,
      a,
      i
    ];
  }, g1 = function(l, n) {
    return l === "v" ? vC(n) : xC(n);
  }, y1 = function(l, n) {
    return l === "v" ? SC(n) : wC(n);
  }, CC = function(l, n) {
    return l === "h" && n === "rtl" ? -1 : 1;
  }, EC = function(l, n, a, i, s) {
    var c = CC(l, window.getComputedStyle(n).direction), f = c * i, h = a.target, p = n.contains(h), g = false, v = f > 0, y = 0, S = 0;
    do {
      if (!h) break;
      var E = y1(l, h), k = E[0], w = E[1], C = E[2], _ = w - C - c * k;
      (k || _) && g1(l, h) && (y += _, S += k);
      var R = h.parentNode;
      h = R && R.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? R.host : R;
    } while (!p && h !== document.body || p && (n.contains(h) || n === h));
    return (v && Math.abs(y) < 1 || !v && Math.abs(S) < 1) && (g = true), g;
  }, bs = function(l) {
    return "changedTouches" in l ? [
      l.changedTouches[0].clientX,
      l.changedTouches[0].clientY
    ] : [
      0,
      0
    ];
  }, Xy = function(l) {
    return [
      l.deltaX,
      l.deltaY
    ];
  }, Vy = function(l) {
    return l && "current" in l ? l.current : l;
  }, _C = function(l, n) {
    return l[0] === n[0] && l[1] === n[1];
  }, MC = function(l) {
    return `
  .block-interactivity-`.concat(l, ` {pointer-events: none;}
  .allow-interactivity-`).concat(l, ` {pointer-events: all;}
`);
  }, kC = 0, ga = [];
  function jC(l) {
    var n = m.useRef([]), a = m.useRef([
      0,
      0
    ]), i = m.useRef(), s = m.useState(kC++)[0], c = m.useState(m1)[0], f = m.useRef(l);
    m.useEffect(function() {
      f.current = l;
    }, [
      l
    ]), m.useEffect(function() {
      if (l.inert) {
        document.body.classList.add("block-interactivity-".concat(s));
        var w = P5([
          l.lockRef.current
        ], (l.shards || []).map(Vy), true).filter(Boolean);
        return w.forEach(function(C) {
          return C.classList.add("allow-interactivity-".concat(s));
        }), function() {
          document.body.classList.remove("block-interactivity-".concat(s)), w.forEach(function(C) {
            return C.classList.remove("allow-interactivity-".concat(s));
          });
        };
      }
    }, [
      l.inert,
      l.lockRef.current,
      l.shards
    ]);
    var h = m.useCallback(function(w, C) {
      if ("touches" in w && w.touches.length === 2 || w.type === "wheel" && w.ctrlKey) return !f.current.allowPinchZoom;
      var _ = bs(w), R = a.current, A = "deltaX" in w ? w.deltaX : R[0] - _[0], T = "deltaY" in w ? w.deltaY : R[1] - _[1], B, N = w.target, L = Math.abs(A) > Math.abs(T) ? "h" : "v";
      if ("touches" in w && L === "h" && N.type === "range") return false;
      var U = window.getSelection(), X = U && U.anchorNode, J = X ? X === N || X.contains(N) : false;
      if (J) return false;
      var ae = By(L, N);
      if (!ae) return true;
      if (ae ? B = L : (B = L === "v" ? "h" : "v", ae = By(L, N)), !ae) return false;
      if (!i.current && "changedTouches" in w && (A || T) && (i.current = B), !B) return true;
      var te = i.current || B;
      return EC(te, C, w, te === "h" ? A : T);
    }, []), p = m.useCallback(function(w) {
      var C = w;
      if (!(!ga.length || ga[ga.length - 1] !== c)) {
        var _ = "deltaY" in C ? Xy(C) : bs(C), R = n.current.filter(function(B) {
          return B.name === C.type && (B.target === C.target || C.target === B.shadowParent) && _C(B.delta, _);
        })[0];
        if (R && R.should) {
          C.cancelable && C.preventDefault();
          return;
        }
        if (!R) {
          var A = (f.current.shards || []).map(Vy).filter(Boolean).filter(function(B) {
            return B.contains(C.target);
          }), T = A.length > 0 ? h(C, A[0]) : !f.current.noIsolation;
          T && C.cancelable && C.preventDefault();
        }
      }
    }, []), g = m.useCallback(function(w, C, _, R) {
      var A = {
        name: w,
        delta: C,
        target: _,
        should: R,
        shadowParent: RC(_)
      };
      n.current.push(A), setTimeout(function() {
        n.current = n.current.filter(function(T) {
          return T !== A;
        });
      }, 1);
    }, []), v = m.useCallback(function(w) {
      a.current = bs(w), i.current = void 0;
    }, []), y = m.useCallback(function(w) {
      g(w.type, Xy(w), w.target, h(w, l.lockRef.current));
    }, []), S = m.useCallback(function(w) {
      g(w.type, bs(w), w.target, h(w, l.lockRef.current));
    }, []);
    m.useEffect(function() {
      return ga.push(c), l.setCallbacks({
        onScrollCapture: y,
        onWheelCapture: y,
        onTouchMoveCapture: S
      }), document.addEventListener("wheel", p, pa), document.addEventListener("touchmove", p, pa), document.addEventListener("touchstart", v, pa), function() {
        ga = ga.filter(function(w) {
          return w !== c;
        }), document.removeEventListener("wheel", p, pa), document.removeEventListener("touchmove", p, pa), document.removeEventListener("touchstart", v, pa);
      };
    }, []);
    var E = l.removeScrollBar, k = l.inert;
    return m.createElement(m.Fragment, null, k ? m.createElement(c, {
      styles: MC(s)
    }) : null, E ? m.createElement(yC, {
      noRelative: l.noRelative,
      gapMode: l.gapMode
    }) : null);
  }
  function RC(l) {
    for (var n = null; l !== null; ) l instanceof ShadowRoot && (n = l.host, l = l.host), l = l.parentNode;
    return n;
  }
  const LC = rC(h1, jC);
  var b1 = m.forwardRef(function(l, n) {
    return m.createElement(Xs, $n({}, l, {
      ref: n,
      sideCar: LC
    }));
  });
  b1.classNames = Xs.classNames;
  var AC = function(l) {
    if (typeof document > "u") return null;
    var n = Array.isArray(l) ? l[0] : l;
    return n.ownerDocument.body;
  }, ya = /* @__PURE__ */ new WeakMap(), vs = /* @__PURE__ */ new WeakMap(), xs = {}, wd = 0, v1 = function(l) {
    return l && (l.host || v1(l.parentNode));
  }, TC = function(l, n) {
    return n.map(function(a) {
      if (l.contains(a)) return a;
      var i = v1(a);
      return i && l.contains(i) ? i : (console.error("aria-hidden", a, "in not contained inside", l, ". Doing nothing"), null);
    }).filter(function(a) {
      return !!a;
    });
  }, NC = function(l, n, a, i) {
    var s = TC(n, Array.isArray(l) ? l : [
      l
    ]);
    xs[a] || (xs[a] = /* @__PURE__ */ new WeakMap());
    var c = xs[a], f = [], h = /* @__PURE__ */ new Set(), p = new Set(s), g = function(y) {
      !y || h.has(y) || (h.add(y), g(y.parentNode));
    };
    s.forEach(g);
    var v = function(y) {
      !y || p.has(y) || Array.prototype.forEach.call(y.children, function(S) {
        if (h.has(S)) v(S);
        else try {
          var E = S.getAttribute(i), k = E !== null && E !== "false", w = (ya.get(S) || 0) + 1, C = (c.get(S) || 0) + 1;
          ya.set(S, w), c.set(S, C), f.push(S), w === 1 && k && vs.set(S, true), C === 1 && S.setAttribute(a, "true"), k || S.setAttribute(i, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", S, _);
        }
      });
    };
    return v(n), h.clear(), wd++, function() {
      f.forEach(function(y) {
        var S = ya.get(y) - 1, E = c.get(y) - 1;
        ya.set(y, S), c.set(y, E), S || (vs.has(y) || y.removeAttribute(i), vs.delete(y)), E || y.removeAttribute(a);
      }), wd--, wd || (ya = /* @__PURE__ */ new WeakMap(), ya = /* @__PURE__ */ new WeakMap(), vs = /* @__PURE__ */ new WeakMap(), xs = {});
    };
  }, OC = function(l, n, a) {
    a === void 0 && (a = "data-aria-hidden");
    var i = Array.from(Array.isArray(l) ? l : [
      l
    ]), s = AC(l);
    return s ? (i.push.apply(i, Array.from(s.querySelectorAll("[aria-live], script"))), NC(i, s, a, "aria-hidden")) : function() {
      return null;
    };
  }, Vs = "Dialog", [x1] = s5(Vs), [DC, On] = x1(Vs), S1 = (l) => {
    const { __scopeDialog: n, children: a, open: i, defaultOpen: s, onOpenChange: c, modal: f = true } = l, h = m.useRef(null), p = m.useRef(null), [g, v] = h5({
      prop: i,
      defaultProp: s ?? false,
      onChange: c,
      caller: Vs
    });
    return b.jsx(DC, {
      scope: n,
      triggerRef: h,
      contentRef: p,
      contentId: yl(),
      titleId: yl(),
      descriptionId: yl(),
      open: g,
      onOpenChange: v,
      onOpenToggle: m.useCallback(() => v((y) => !y), [
        v
      ]),
      modal: f,
      children: a
    });
  };
  S1.displayName = Vs;
  var w1 = "DialogTrigger", zC = m.forwardRef((l, n) => {
    const { __scopeDialog: a, ...i } = l, s = On(w1, a), c = Rr(n, s.triggerRef);
    return b.jsx(Yo.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": s.open,
      "aria-controls": s.contentId,
      "data-state": If(s.open),
      ...i,
      ref: c,
      onClick: Ql(l.onClick, s.onOpenToggle)
    });
  });
  zC.displayName = w1;
  var Df = "DialogPortal", [IC, C1] = x1(Df, {
    forceMount: void 0
  }), E1 = (l) => {
    const { __scopeDialog: n, forceMount: a, children: i, container: s } = l, c = On(Df, n);
    return b.jsx(IC, {
      scope: n,
      forceMount: a,
      children: m.Children.map(i, (f) => b.jsx(Bs, {
        present: a || c.open,
        children: b.jsx(u1, {
          asChild: true,
          container: s,
          children: f
        })
      }))
    });
  };
  E1.displayName = Df;
  var Rs = "DialogOverlay", _1 = m.forwardRef((l, n) => {
    const a = C1(Rs, l.__scopeDialog), { forceMount: i = a.forceMount, ...s } = l, c = On(Rs, l.__scopeDialog);
    return c.modal ? b.jsx(Bs, {
      present: i || c.open,
      children: b.jsx(YC, {
        ...s,
        ref: n
      })
    }) : null;
  });
  _1.displayName = Rs;
  var HC = Ho("DialogOverlay.RemoveScroll"), YC = m.forwardRef((l, n) => {
    const { __scopeDialog: a, ...i } = l, s = On(Rs, a);
    return b.jsx(b1, {
      as: HC,
      allowPinchZoom: true,
      shards: [
        s.contentRef
      ],
      children: b.jsx(Yo.div, {
        "data-state": If(s.open),
        ...i,
        ref: n,
        style: {
          pointerEvents: "auto",
          ...i.style
        }
      })
    });
  }), Mr = "DialogContent", M1 = m.forwardRef((l, n) => {
    const a = C1(Mr, l.__scopeDialog), { forceMount: i = a.forceMount, ...s } = l, c = On(Mr, l.__scopeDialog);
    return b.jsx(Bs, {
      present: i || c.open,
      children: c.modal ? b.jsx(UC, {
        ...s,
        ref: n
      }) : b.jsx(BC, {
        ...s,
        ref: n
      })
    });
  });
  M1.displayName = Mr;
  var UC = m.forwardRef((l, n) => {
    const a = On(Mr, l.__scopeDialog), i = m.useRef(null), s = Rr(n, a.contentRef, i);
    return m.useEffect(() => {
      const c = i.current;
      if (c) return OC(c);
    }, []), b.jsx(k1, {
      ...l,
      ref: s,
      trapFocus: a.open,
      disableOutsidePointerEvents: true,
      onCloseAutoFocus: Ql(l.onCloseAutoFocus, (c) => {
        var _a;
        c.preventDefault(), (_a = a.triggerRef.current) == null ? void 0 : _a.focus();
      }),
      onPointerDownOutside: Ql(l.onPointerDownOutside, (c) => {
        const f = c.detail.originalEvent, h = f.button === 0 && f.ctrlKey === true;
        (f.button === 2 || h) && c.preventDefault();
      }),
      onFocusOutside: Ql(l.onFocusOutside, (c) => c.preventDefault())
    });
  }), BC = m.forwardRef((l, n) => {
    const a = On(Mr, l.__scopeDialog), i = m.useRef(false), s = m.useRef(false);
    return b.jsx(k1, {
      ...l,
      ref: n,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      onCloseAutoFocus: (c) => {
        var _a, _b2;
        (_a = l.onCloseAutoFocus) == null ? void 0 : _a.call(l, c), c.defaultPrevented || (i.current || ((_b2 = a.triggerRef.current) == null ? void 0 : _b2.focus()), c.preventDefault()), i.current = false, s.current = false;
      },
      onInteractOutside: (c) => {
        var _a, _b2;
        (_a = l.onInteractOutside) == null ? void 0 : _a.call(l, c), c.defaultPrevented || (i.current = true, c.detail.originalEvent.type === "pointerdown" && (s.current = true));
        const f = c.target;
        ((_b2 = a.triggerRef.current) == null ? void 0 : _b2.contains(f)) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && s.current && c.preventDefault();
      }
    });
  }), k1 = m.forwardRef((l, n) => {
    const { __scopeDialog: a, trapFocus: i, onOpenAutoFocus: s, onCloseAutoFocus: c, ...f } = l, h = On(Mr, a), p = m.useRef(null), g = Rr(n, p);
    return K5(), b.jsxs(b.Fragment, {
      children: [
        b.jsx(s1, {
          asChild: true,
          loop: true,
          trapped: i,
          onMountAutoFocus: s,
          onUnmountAutoFocus: c,
          children: b.jsx(o1, {
            role: "dialog",
            id: h.contentId,
            "aria-describedby": h.descriptionId,
            "aria-labelledby": h.titleId,
            "data-state": If(h.open),
            ...f,
            ref: g,
            onDismiss: () => h.onOpenChange(false)
          })
        }),
        b.jsxs(b.Fragment, {
          children: [
            b.jsx(qC, {
              titleId: h.titleId
            }),
            b.jsx(ZC, {
              contentRef: p,
              descriptionId: h.descriptionId
            })
          ]
        })
      ]
    });
  }), zf = "DialogTitle", XC = m.forwardRef((l, n) => {
    const { __scopeDialog: a, ...i } = l, s = On(zf, a);
    return b.jsx(Yo.h2, {
      id: s.titleId,
      ...i,
      ref: n
    });
  });
  XC.displayName = zf;
  var j1 = "DialogDescription", VC = m.forwardRef((l, n) => {
    const { __scopeDialog: a, ...i } = l, s = On(j1, a);
    return b.jsx(Yo.p, {
      id: s.descriptionId,
      ...i,
      ref: n
    });
  });
  VC.displayName = j1;
  var R1 = "DialogClose", $C = m.forwardRef((l, n) => {
    const { __scopeDialog: a, ...i } = l, s = On(R1, a);
    return b.jsx(Yo.button, {
      type: "button",
      ...i,
      ref: n,
      onClick: Ql(l.onClick, () => s.onOpenChange(false))
    });
  });
  $C.displayName = R1;
  function If(l) {
    return l ? "open" : "closed";
  }
  var L1 = "DialogTitleWarning", [TM, A1] = i5(L1, {
    contentName: Mr,
    titleName: zf,
    docsSlug: "dialog"
  }), qC = ({ titleId: l }) => {
    const n = A1(L1), a = `\`${n.contentName}\` requires a \`${n.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${n.docsSlug}`;
    return m.useEffect(() => {
      l && (document.getElementById(l) || console.error(a));
    }, [
      a,
      l
    ]), null;
  }, GC = "DialogDescriptionWarning", ZC = ({ contentRef: l, descriptionId: n }) => {
    const i = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${A1(GC).contentName}}.`;
    return m.useEffect(() => {
      var _a;
      const s = (_a = l.current) == null ? void 0 : _a.getAttribute("aria-describedby");
      n && s && (document.getElementById(n) || console.warn(i));
    }, [
      i,
      l,
      n
    ]), null;
  }, KC = S1, PC = E1, QC = _1, FC = M1, WC = Symbol.for("react.lazy"), Ls = _f[" use ".trim().toString()];
  function JC(l) {
    return typeof l == "object" && l !== null && "then" in l;
  }
  function T1(l) {
    return l != null && typeof l == "object" && "$$typeof" in l && l.$$typeof === WC && "_payload" in l && JC(l._payload);
  }
  function eE(l) {
    const n = tE(l), a = m.forwardRef((i, s) => {
      let { children: c, ...f } = i;
      T1(c) && typeof Ls == "function" && (c = Ls(c._payload));
      const h = m.Children.toArray(c), p = h.find(lE);
      if (p) {
        const g = p.props.children, v = h.map((y) => y === p ? m.Children.count(g) > 1 ? m.Children.only(null) : m.isValidElement(g) ? g.props.children : null : y);
        return b.jsx(n, {
          ...f,
          ref: s,
          children: m.isValidElement(g) ? m.cloneElement(g, void 0, v) : null
        });
      }
      return b.jsx(n, {
        ...f,
        ref: s,
        children: c
      });
    });
    return a.displayName = `${l}.Slot`, a;
  }
  function tE(l) {
    const n = m.forwardRef((a, i) => {
      let { children: s, ...c } = a;
      if (T1(s) && typeof Ls == "function" && (s = Ls(s._payload)), m.isValidElement(s)) {
        const f = aE(s), h = rE(c, s.props);
        return s.type !== m.Fragment && (h.ref = i ? Fl(i, f) : f), m.cloneElement(s, h);
      }
      return m.Children.count(s) > 1 ? m.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var nE = Symbol("radix.slottable");
  function lE(l) {
    return m.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === nE;
  }
  function rE(l, n) {
    const a = {
      ...n
    };
    for (const i in n) {
      const s = l[i], c = n[i];
      /^on[A-Z]/.test(i) ? s && c ? a[i] = (...h) => {
        const p = c(...h);
        return s(...h), p;
      } : s && (a[i] = s) : i === "style" ? a[i] = {
        ...s,
        ...c
      } : i === "className" && (a[i] = [
        s,
        c
      ].filter(Boolean).join(" "));
    }
    return {
      ...l,
      ...a
    };
  }
  function aE(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, a = n && "isReactWarning" in n && n.isReactWarning;
    return a ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, a = n && "isReactWarning" in n && n.isReactWarning, a ? l.props.ref : l.props.ref || l.ref);
  }
  var oE = [
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
  ], Jl = oE.reduce((l, n) => {
    const a = eE(`Primitive.${n}`), i = m.forwardRef((s, c) => {
      const { asChild: f, ...h } = s, p = f ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), b.jsx(p, {
        ...h,
        ref: c
      });
    });
    return i.displayName = `Primitive.${n}`, {
      ...l,
      [n]: i
    };
  }, {}), Mo = '[cmdk-group=""]', Cd = '[cmdk-group-items=""]', iE = '[cmdk-group-heading=""]', N1 = '[cmdk-item=""]', $y = `${N1}:not([aria-disabled="true"])`, xf = "cmdk-item-select", ba = "data-value", sE = (l, n, a) => o5(l, n, a), O1 = m.createContext(void 0), Uo = () => m.useContext(O1), D1 = m.createContext(void 0), Hf = () => m.useContext(D1), z1 = m.createContext(void 0), I1 = m.forwardRef((l, n) => {
    let a = va(() => {
      var D, z;
      return {
        search: "",
        value: (z = (D = l.value) != null ? D : l.defaultValue) != null ? z : "",
        selectedItemId: void 0,
        filtered: {
          count: 0,
          items: /* @__PURE__ */ new Map(),
          groups: /* @__PURE__ */ new Set()
        }
      };
    }), i = va(() => /* @__PURE__ */ new Set()), s = va(() => /* @__PURE__ */ new Map()), c = va(() => /* @__PURE__ */ new Map()), f = va(() => /* @__PURE__ */ new Set()), h = H1(l), { label: p, children: g, value: v, onValueChange: y, filter: S, shouldFilter: E, loop: k, disablePointerSelection: w = false, vimBindings: C = true, ..._ } = l, R = yl(), A = yl(), T = yl(), B = m.useRef(null), N = vE();
    kr(() => {
      if (v !== void 0) {
        let D = v.trim();
        a.current.value = D, L.emit();
      }
    }, [
      v
    ]), kr(() => {
      N(6, ce);
    }, []);
    let L = m.useMemo(() => ({
      subscribe: (D) => (f.current.add(D), () => f.current.delete(D)),
      snapshot: () => a.current,
      setState: (D, z, O) => {
        var Y, Q, W, de;
        if (!Object.is(a.current[D], z)) {
          if (a.current[D] = z, D === "search") te(), J(), N(1, ae);
          else if (D === "value") {
            if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
              let oe = document.getElementById(T);
              oe ? oe.focus() : (Y = document.getElementById(R)) == null || Y.focus();
            }
            if (N(7, () => {
              var oe;
              a.current.selectedItemId = (oe = ie()) == null ? void 0 : oe.id, L.emit();
            }), O || N(5, ce), ((Q = h.current) == null ? void 0 : Q.value) !== void 0) {
              let oe = z ?? "";
              (de = (W = h.current).onValueChange) == null || de.call(W, oe);
              return;
            }
          }
          L.emit();
        }
      },
      emit: () => {
        f.current.forEach((D) => D());
      }
    }), []), U = m.useMemo(() => ({
      value: (D, z, O) => {
        var Y;
        z !== ((Y = c.current.get(D)) == null ? void 0 : Y.value) && (c.current.set(D, {
          value: z,
          keywords: O
        }), a.current.filtered.items.set(D, X(z, O)), N(2, () => {
          J(), L.emit();
        }));
      },
      item: (D, z) => (i.current.add(D), z && (s.current.has(z) ? s.current.get(z).add(D) : s.current.set(z, /* @__PURE__ */ new Set([
        D
      ]))), N(3, () => {
        te(), J(), a.current.value || ae(), L.emit();
      }), () => {
        c.current.delete(D), i.current.delete(D), a.current.filtered.items.delete(D);
        let O = ie();
        N(4, () => {
          te(), (O == null ? void 0 : O.getAttribute("id")) === D && ae(), L.emit();
        });
      }),
      group: (D) => (s.current.has(D) || s.current.set(D, /* @__PURE__ */ new Set()), () => {
        c.current.delete(D), s.current.delete(D);
      }),
      filter: () => h.current.shouldFilter,
      label: p || l["aria-label"],
      getDisablePointerSelection: () => h.current.disablePointerSelection,
      listId: R,
      inputId: T,
      labelId: A,
      listInnerRef: B
    }), []);
    function X(D, z) {
      var O, Y;
      let Q = (Y = (O = h.current) == null ? void 0 : O.filter) != null ? Y : sE;
      return D ? Q(D, a.current.search, z) : 0;
    }
    function J() {
      if (!a.current.search || h.current.shouldFilter === false) return;
      let D = a.current.filtered.items, z = [];
      a.current.filtered.groups.forEach((Y) => {
        let Q = s.current.get(Y), W = 0;
        Q.forEach((de) => {
          let oe = D.get(de);
          W = Math.max(oe, W);
        }), z.push([
          Y,
          W
        ]);
      });
      let O = B.current;
      Se().sort((Y, Q) => {
        var W, de;
        let oe = Y.getAttribute("id"), Me = Q.getAttribute("id");
        return ((W = D.get(Me)) != null ? W : 0) - ((de = D.get(oe)) != null ? de : 0);
      }).forEach((Y) => {
        let Q = Y.closest(Cd);
        Q ? Q.appendChild(Y.parentElement === Q ? Y : Y.closest(`${Cd} > *`)) : O.appendChild(Y.parentElement === O ? Y : Y.closest(`${Cd} > *`));
      }), z.sort((Y, Q) => Q[1] - Y[1]).forEach((Y) => {
        var Q;
        let W = (Q = B.current) == null ? void 0 : Q.querySelector(`${Mo}[${ba}="${encodeURIComponent(Y[0])}"]`);
        W == null ? void 0 : W.parentElement.appendChild(W);
      });
    }
    function ae() {
      let D = Se().find((O) => O.getAttribute("aria-disabled") !== "true"), z = D == null ? void 0 : D.getAttribute(ba);
      L.setState("value", z || void 0);
    }
    function te() {
      var D, z, O, Y;
      if (!a.current.search || h.current.shouldFilter === false) {
        a.current.filtered.count = i.current.size;
        return;
      }
      a.current.filtered.groups = /* @__PURE__ */ new Set();
      let Q = 0;
      for (let W of i.current) {
        let de = (z = (D = c.current.get(W)) == null ? void 0 : D.value) != null ? z : "", oe = (Y = (O = c.current.get(W)) == null ? void 0 : O.keywords) != null ? Y : [], Me = X(de, oe);
        a.current.filtered.items.set(W, Me), Me > 0 && Q++;
      }
      for (let [W, de] of s.current) for (let oe of de) if (a.current.filtered.items.get(oe) > 0) {
        a.current.filtered.groups.add(W);
        break;
      }
      a.current.filtered.count = Q;
    }
    function ce() {
      var D, z, O;
      let Y = ie();
      Y && (((D = Y.parentElement) == null ? void 0 : D.firstChild) === Y && ((O = (z = Y.closest(Mo)) == null ? void 0 : z.querySelector(iE)) == null || O.scrollIntoView({
        block: "nearest"
      })), Y.scrollIntoView({
        block: "nearest"
      }));
    }
    function ie() {
      var D;
      return (D = B.current) == null ? void 0 : D.querySelector(`${N1}[aria-selected="true"]`);
    }
    function Se() {
      var D;
      return Array.from(((D = B.current) == null ? void 0 : D.querySelectorAll($y)) || []);
    }
    function $(D) {
      let z = Se()[D];
      z && L.setState("value", z.getAttribute(ba));
    }
    function P(D) {
      var z;
      let O = ie(), Y = Se(), Q = Y.findIndex((de) => de === O), W = Y[Q + D];
      (z = h.current) != null && z.loop && (W = Q + D < 0 ? Y[Y.length - 1] : Q + D === Y.length ? Y[0] : Y[Q + D]), W && L.setState("value", W.getAttribute(ba));
    }
    function ue(D) {
      let z = ie(), O = z == null ? void 0 : z.closest(Mo), Y;
      for (; O && !Y; ) O = D > 0 ? yE(O, Mo) : bE(O, Mo), Y = O == null ? void 0 : O.querySelector($y);
      Y ? L.setState("value", Y.getAttribute(ba)) : P(D);
    }
    let xe = () => $(Se().length - 1), be = (D) => {
      D.preventDefault(), D.metaKey ? xe() : D.altKey ? ue(1) : P(1);
    }, j = (D) => {
      D.preventDefault(), D.metaKey ? $(0) : D.altKey ? ue(-1) : P(-1);
    };
    return m.createElement(Jl.div, {
      ref: n,
      tabIndex: -1,
      ..._,
      "cmdk-root": "",
      onKeyDown: (D) => {
        var z;
        (z = _.onKeyDown) == null || z.call(_, D);
        let O = D.nativeEvent.isComposing || D.keyCode === 229;
        if (!(D.defaultPrevented || O)) switch (D.key) {
          case "n":
          case "j": {
            C && D.ctrlKey && be(D);
            break;
          }
          case "ArrowDown": {
            be(D);
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
            D.preventDefault(), xe();
            break;
          }
          case "Enter": {
            D.preventDefault();
            let Y = ie();
            if (Y) {
              let Q = new Event(xf);
              Y.dispatchEvent(Q);
            }
          }
        }
      }
    }, m.createElement("label", {
      "cmdk-label": "",
      htmlFor: U.inputId,
      id: U.labelId,
      style: SE
    }, p), $s(l, (D) => m.createElement(D1.Provider, {
      value: L
    }, m.createElement(O1.Provider, {
      value: U
    }, D))));
  }), cE = m.forwardRef((l, n) => {
    var a, i;
    let s = yl(), c = m.useRef(null), f = m.useContext(z1), h = Uo(), p = H1(l), g = (i = (a = p.current) == null ? void 0 : a.forceMount) != null ? i : f == null ? void 0 : f.forceMount;
    kr(() => {
      if (!g) return h.item(s, f == null ? void 0 : f.id);
    }, [
      g
    ]);
    let v = Y1(s, c, [
      l.value,
      l.children,
      c
    ], l.keywords), y = Hf(), S = Wl((N) => N.value && N.value === v.current), E = Wl((N) => g || h.filter() === false ? true : N.search ? N.filtered.items.get(s) > 0 : true);
    m.useEffect(() => {
      let N = c.current;
      if (!(!N || l.disabled)) return N.addEventListener(xf, k), () => N.removeEventListener(xf, k);
    }, [
      E,
      l.onSelect,
      l.disabled
    ]);
    function k() {
      var N, L;
      w(), (L = (N = p.current).onSelect) == null || L.call(N, v.current);
    }
    function w() {
      y.setState("value", v.current, true);
    }
    if (!E) return null;
    let { disabled: C, value: _, onSelect: R, forceMount: A, keywords: T, ...B } = l;
    return m.createElement(Jl.div, {
      ref: Fl(c, n),
      ...B,
      id: s,
      "cmdk-item": "",
      role: "option",
      "aria-disabled": !!C,
      "aria-selected": !!S,
      "data-disabled": !!C,
      "data-selected": !!S,
      onPointerMove: C || h.getDisablePointerSelection() ? void 0 : w,
      onClick: C ? void 0 : k
    }, l.children);
  }), uE = m.forwardRef((l, n) => {
    let { heading: a, children: i, forceMount: s, ...c } = l, f = yl(), h = m.useRef(null), p = m.useRef(null), g = yl(), v = Uo(), y = Wl((E) => s || v.filter() === false ? true : E.search ? E.filtered.groups.has(f) : true);
    kr(() => v.group(f), []), Y1(f, h, [
      l.value,
      l.heading,
      p
    ]);
    let S = m.useMemo(() => ({
      id: f,
      forceMount: s
    }), [
      s
    ]);
    return m.createElement(Jl.div, {
      ref: Fl(h, n),
      ...c,
      "cmdk-group": "",
      role: "presentation",
      hidden: y ? void 0 : true
    }, a && m.createElement("div", {
      ref: p,
      "cmdk-group-heading": "",
      "aria-hidden": true,
      id: g
    }, a), $s(l, (E) => m.createElement("div", {
      "cmdk-group-items": "",
      role: "group",
      "aria-labelledby": a ? g : void 0
    }, m.createElement(z1.Provider, {
      value: S
    }, E))));
  }), dE = m.forwardRef((l, n) => {
    let { alwaysRender: a, ...i } = l, s = m.useRef(null), c = Wl((f) => !f.search);
    return !a && !c ? null : m.createElement(Jl.div, {
      ref: Fl(s, n),
      ...i,
      "cmdk-separator": "",
      role: "separator"
    });
  }), fE = m.forwardRef((l, n) => {
    let { onValueChange: a, ...i } = l, s = l.value != null, c = Hf(), f = Wl((g) => g.search), h = Wl((g) => g.selectedItemId), p = Uo();
    return m.useEffect(() => {
      l.value != null && c.setState("search", l.value);
    }, [
      l.value
    ]), m.createElement(Jl.input, {
      ref: n,
      ...i,
      "cmdk-input": "",
      autoComplete: "off",
      autoCorrect: "off",
      spellCheck: false,
      "aria-autocomplete": "list",
      role: "combobox",
      "aria-expanded": true,
      "aria-controls": p.listId,
      "aria-labelledby": p.labelId,
      "aria-activedescendant": h,
      id: p.inputId,
      type: "text",
      value: s ? l.value : f,
      onChange: (g) => {
        s || c.setState("search", g.target.value), a == null ? void 0 : a(g.target.value);
      }
    });
  }), hE = m.forwardRef((l, n) => {
    let { children: a, label: i = "Suggestions", ...s } = l, c = m.useRef(null), f = m.useRef(null), h = Wl((g) => g.selectedItemId), p = Uo();
    return m.useEffect(() => {
      if (f.current && c.current) {
        let g = f.current, v = c.current, y, S = new ResizeObserver(() => {
          y = requestAnimationFrame(() => {
            let E = g.offsetHeight;
            v.style.setProperty("--cmdk-list-height", E.toFixed(1) + "px");
          });
        });
        return S.observe(g), () => {
          cancelAnimationFrame(y), S.unobserve(g);
        };
      }
    }, []), m.createElement(Jl.div, {
      ref: Fl(c, n),
      ...s,
      "cmdk-list": "",
      role: "listbox",
      tabIndex: -1,
      "aria-activedescendant": h,
      "aria-label": i,
      id: p.listId
    }, $s(l, (g) => m.createElement("div", {
      ref: Fl(f, p.listInnerRef),
      "cmdk-list-sizer": ""
    }, g)));
  }), mE = m.forwardRef((l, n) => {
    let { open: a, onOpenChange: i, overlayClassName: s, contentClassName: c, container: f, ...h } = l;
    return m.createElement(KC, {
      open: a,
      onOpenChange: i
    }, m.createElement(PC, {
      container: f
    }, m.createElement(QC, {
      "cmdk-overlay": "",
      className: s
    }), m.createElement(FC, {
      "aria-label": l.label,
      "cmdk-dialog": "",
      className: c
    }, m.createElement(I1, {
      ref: n,
      ...h
    }))));
  }), pE = m.forwardRef((l, n) => Wl((a) => a.filtered.count === 0) ? m.createElement(Jl.div, {
    ref: n,
    ...l,
    "cmdk-empty": "",
    role: "presentation"
  }) : null), gE = m.forwardRef((l, n) => {
    let { progress: a, children: i, label: s = "Loading...", ...c } = l;
    return m.createElement(Jl.div, {
      ref: n,
      ...c,
      "cmdk-loading": "",
      role: "progressbar",
      "aria-valuenow": a,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-label": s
    }, $s(l, (f) => m.createElement("div", {
      "aria-hidden": true
    }, f)));
  }), ko = Object.assign(I1, {
    List: hE,
    Item: cE,
    Input: fE,
    Group: uE,
    Separator: dE,
    Dialog: mE,
    Empty: pE,
    Loading: gE
  });
  function yE(l, n) {
    let a = l.nextElementSibling;
    for (; a; ) {
      if (a.matches(n)) return a;
      a = a.nextElementSibling;
    }
  }
  function bE(l, n) {
    let a = l.previousElementSibling;
    for (; a; ) {
      if (a.matches(n)) return a;
      a = a.previousElementSibling;
    }
  }
  function H1(l) {
    let n = m.useRef(l);
    return kr(() => {
      n.current = l;
    }), n;
  }
  var kr = typeof window > "u" ? m.useEffect : m.useLayoutEffect;
  function va(l) {
    let n = m.useRef();
    return n.current === void 0 && (n.current = l()), n;
  }
  function Wl(l) {
    let n = Hf(), a = () => l(n.snapshot());
    return m.useSyncExternalStore(n.subscribe, a, a);
  }
  function Y1(l, n, a, i = []) {
    let s = m.useRef(), c = Uo();
    return kr(() => {
      var f;
      let h = (() => {
        var g;
        for (let v of a) {
          if (typeof v == "string") return v.trim();
          if (typeof v == "object" && "current" in v) return v.current ? (g = v.current.textContent) == null ? void 0 : g.trim() : s.current;
        }
      })(), p = i.map((g) => g.trim());
      c.value(l, h, p), (f = n.current) == null || f.setAttribute(ba, h), s.current = h;
    }), s;
  }
  var vE = () => {
    let [l, n] = m.useState(), a = va(() => /* @__PURE__ */ new Map());
    return kr(() => {
      a.current.forEach((i) => i()), a.current = /* @__PURE__ */ new Map();
    }, [
      l
    ]), (i, s) => {
      a.current.set(i, s), n({});
    };
  };
  function xE(l) {
    let n = l.type;
    return typeof n == "function" ? n(l.props) : "render" in n ? n.render(l.props) : l;
  }
  function $s({ asChild: l, children: n }, a) {
    return l && m.isValidElement(n) ? m.cloneElement(xE(n), {
      ref: n.ref
    }, a(n.props.children)) : a(n);
  }
  var SE = {
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
  const Do = gt()(Mf((l) => ({
    isMinimized: true,
    toggle: () => l((n) => ({
      isMinimized: !n.isMinimized
    }))
  }), {
    name: "rosette-minimap",
    partialize: (l) => ({
      isMinimized: l.isMinimized
    })
  }));
  function wE() {
    const { setThemeSetting: l } = he.getState(), { close: n } = qt.getState(), { setTool: a } = Ht.getState();
    return [
      {
        id: "file-new",
        type: "command",
        name: "File: New",
        shortcut: {
          modifiers: [
            Ne.mod
          ],
          key: "N"
        },
        action: async () => {
          n();
          const { handleNewFile: s } = await pt(async () => {
            const { handleNewFile: c } = await Promise.resolve().then(() => Tn);
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
              Ne.mod
            ],
            key: "O"
          },
          action: async () => {
            n();
            const { confirmDiscardChanges: s, emitOpenFile: c } = await pt(async () => {
              const { confirmDiscardChanges: g, emitOpenFile: v } = await Promise.resolve().then(() => Tn);
              return {
                confirmDiscardChanges: g,
                emitOpenFile: v
              };
            }, void 0, import.meta.url);
            if (!await s()) return;
            const { pickGdsFile: h } = await pt(async () => {
              const { pickGdsFile: g } = await Promise.resolve().then(() => t1);
              return {
                pickGdsFile: g
              };
            }, void 0, import.meta.url), p = await h();
            p && await c(p);
          },
          searchableText: "File open gds load import"
        },
        {
          id: "file-save",
          type: "command",
          name: "File: Save",
          shortcut: {
            modifiers: [
              Ne.mod
            ],
            key: "S"
          },
          action: async () => {
            n();
            const { handleSave: s } = await pt(async () => {
              const { handleSave: c } = await Promise.resolve().then(() => Tn);
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
              Ne.mod,
              "\u21E7"
            ],
            key: "S"
          },
          action: async () => {
            n();
            const { handleSave: s } = await pt(async () => {
              const { handleSave: c } = await Promise.resolve().then(() => Tn);
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
          const { handleScreenshot: s } = await pt(async () => {
            const { handleScreenshot: c } = await Promise.resolve().then(() => Tn);
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
          const { handleScreenshotToClipboard: s } = await pt(async () => {
            const { handleScreenshotToClipboard: c } = await Promise.resolve().then(() => Tn);
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
          Do.getState().toggle(), n();
        },
        searchableText: "Toggle minimap show hide overview map"
      },
      {
        id: "view-toggle-grid",
        type: "command",
        name: "View: Toggle Grid",
        action: () => {
          he.getState().toggleGrid(), n();
        },
        searchableText: "Toggle grid show hide dots points"
      },
      {
        id: "view-toggle-zen-mode",
        type: "command",
        name: "View: Toggle Zen Mode",
        action: () => {
          he.getState().toggleZenMode(), n();
        },
        searchableText: "Toggle zen mode focus distraction free hide toolbar explorer sidebar panels"
      },
      {
        id: "view-show-layers",
        type: "command",
        name: "View: Show Layers Panel",
        action: () => {
          he.getState().setSidebarTab("layers"), n();
        },
        searchableText: "Show layers panel sidebar switch tab"
      },
      {
        id: "view-show-inspector",
        type: "command",
        name: "View: Show Inspector Panel",
        action: () => {
          he.getState().setSidebarTab("inspector"), n();
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
            ze.getState().zoomAt(Ts, c.width / 2, c.height / 2);
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
            ze.getState().zoomAt(Ns, c.width / 2, c.height / 2);
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
          const s = document.getElementById("rosette-canvas"), { library: c } = Ce.getState();
          if (s && c) {
            const f = c.get_all_bounds(), h = f ? {
              minX: f[0],
              minY: f[1],
              maxX: f[2],
              maxY: f[3]
            } : null, p = Zn(s);
            ze.getState().zoomToFit(h, p.width, p.height, p.screenCenter);
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
            Ne.shift
          ],
          key: "F"
        },
        action: () => {
          const s = document.getElementById("rosette-canvas"), { library: c } = Ce.getState();
          if (s && c) {
            const f = se.getState().selectedIds;
            if (f.size > 0) {
              const h = c.get_bounds_for_ids([
                ...f
              ]), p = h ? {
                minX: h[0],
                minY: h[1],
                maxX: h[2],
                maxY: h[3]
              } : null, g = Zn(s);
              ze.getState().zoomToSelected(p, g.width, g.height, g.screenCenter);
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
          a("select"), n();
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
          a("laser"), n();
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
          a("pan"), n();
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
          a("move"), n();
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
          a("zoom"), n();
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
          a("ruler"), n();
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
          a("rectangle"), n();
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
          a("polygon"), n();
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
          a("path"), n();
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
          a("text"), n();
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
          const { library: s, renderer: c } = Ce.getState(), f = document.getElementById("rosette-canvas");
          s && c && f && Nv(s, c, f), n();
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
          const { library: s, renderer: c } = Ce.getState(), f = document.getElementById("rosette-canvas");
          s && c && f && Ov(s, c, f), n();
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
          const { library: s, renderer: c } = Ce.getState(), f = document.getElementById("rosette-canvas");
          s && c && f && Dv(s, c, f), n();
        },
        searchableText: "Add text create label annotation place"
      },
      {
        id: "edit-undo",
        type: "command",
        name: "Edit: Undo",
        shortcut: {
          modifiers: [
            Ne.mod
          ],
          key: "Z"
        },
        action: () => {
          const { library: s, renderer: c } = Ce.getState();
          if (s && c) {
            const { canUndo: f, undo: h } = fe.getState();
            f && h({
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
            Ne.mod,
            Ne.shift
          ],
          key: "Z"
        },
        action: () => {
          const { library: s, renderer: c } = Ce.getState();
          if (s && c) {
            const { canRedo: f, redo: h } = fe.getState();
            f && h({
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
            Ne.mod
          ],
          key: "C"
        },
        action: () => {
          const { library: s } = Ce.getState(), { selectedIds: c } = se.getState();
          if (!s || c.size === 0) {
            n();
            return;
          }
          const f = jr(s, c);
          Gn.getState().copy(f), n();
        },
        searchableText: "Copy selection clipboard"
      },
      {
        id: "edit-paste",
        type: "command",
        name: "Edit: Paste",
        shortcut: {
          modifiers: [
            Ne.mod
          ],
          key: "V"
        },
        action: () => {
          const { library: s, renderer: c } = Ce.getState();
          if (!s || !c || !Gn.getState().hasContent) {
            n();
            return;
          }
          const f = new Hs();
          fe.getState().execute(f, {
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
            Ne.mod
          ],
          key: "B"
        },
        action: () => {
          const { library: s, renderer: c } = Ce.getState(), { selectedIds: f } = se.getState();
          if (!s || !c || f.size === 0) {
            n();
            return;
          }
          const h = new Ys([
            ...f
          ]);
          fe.getState().execute(h, {
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
          key: Ne.backspace
        },
        action: () => {
          const { library: s, renderer: c } = Ce.getState(), { selectedIds: f } = se.getState();
          if (!s || !c || f.size === 0) {
            n();
            return;
          }
          const h = new Is([
            ...f
          ]);
          fe.getState().execute(h, {
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
          se.getState().selectedIds.size > 0 && he.getState().requestInspectorFocus(), n();
        },
        searchableText: "Edit selection inspector properties focus"
      },
      {
        id: "edit-select-all",
        type: "command",
        name: "Edit: Select All",
        shortcut: {
          modifiers: [
            Ne.mod
          ],
          key: "A"
        },
        action: () => {
          const { library: s } = Ce.getState();
          if (!s) {
            n();
            return;
          }
          const c = s.get_all_ids();
          se.getState().selectAll(c), n();
        },
        searchableText: "Select all elements"
      },
      {
        id: "layer-add",
        type: "layer",
        name: "Layer: Add",
        action: () => {
          const { library: s, renderer: c } = Ce.getState();
          if (!s || !c) {
            n();
            return;
          }
          const f = new Mv();
          fe.getState().execute(f, {
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
          const { library: s, renderer: c } = Ce.getState(), { activeLayerId: f, layers: h } = me.getState();
          if (!s || !c || h.size <= 1) {
            n();
            return;
          }
          const p = new kv(f);
          fe.getState().execute(p, {
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
          const { activeLayerId: s } = me.getState();
          me.getState().setExpandedLayerId(s), he.getState().setSidebarTab("layers"), n();
        },
        searchableText: "Edit active layer color fill pattern properties"
      },
      {
        id: "layer-rename",
        type: "layer",
        name: "Layer: Rename Active",
        action: () => {
          const { activeLayerId: s } = me.getState();
          me.getState().setEditingLayerId(s), n();
        },
        searchableText: "Rename active layer"
      },
      {
        id: "layer-toggle-visibility",
        type: "layer",
        name: "Layer: Toggle Active Visibility",
        action: () => {
          const { activeLayerId: s } = me.getState();
          me.getState().toggleVisibility(s), n();
        },
        searchableText: "Toggle active layer visibility show hide"
      },
      {
        id: "layer-show-all",
        type: "layer",
        name: "Layer: Show All",
        action: () => {
          me.getState().showAllLayers(), n();
        },
        searchableText: "Show all layers visible"
      },
      {
        id: "layer-hide-all",
        type: "layer",
        name: "Layer: Hide All",
        action: () => {
          me.getState().hideAllLayers(), n();
        },
        searchableText: "Hide all layers invisible"
      },
      ...me.getState().getAllLayers().map((s) => ({
        id: `layer-activate-${s.id}`,
        type: "layer",
        name: `Layer: Set Active: ${s.name}`,
        color: s.color,
        action: () => {
          me.getState().setActiveLayer(s.id), n();
        },
        searchableText: `Layer set active ${s.name} switch`
      })),
      {
        id: "cell-add",
        type: "cell",
        name: "Cell: Add",
        action: () => {
          const { library: s, renderer: c } = Ce.getState();
          if (!s || !c) {
            n();
            return;
          }
          const f = ye.getState().cells;
          let h = 1, p = `cell${h}`;
          for (; f.includes(p); ) h++, p = `cell${h}`;
          const g = new Rv(p);
          fe.getState().execute(g, {
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
          const { library: s, renderer: c } = Ce.getState(), { activeCell: f, cells: h } = ye.getState();
          if (!s || !c || !f || h.length <= 1) {
            n();
            return;
          }
          const p = new Lv(f);
          fe.getState().execute(p, {
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
          const { activeCell: s } = ye.getState();
          s && ye.getState().setEditingCellName(s), n();
        },
        searchableText: "Rename active cell"
      },
      {
        id: "cell-change-origin",
        type: "cell",
        name: "Cell: Change Origin",
        action: () => {
          se.getState().clearSelection(), he.getState().requestInspectorFocusField("X"), n();
        },
        searchableText: "Cell change origin position offset set move"
      },
      {
        id: "cell-toggle-visibility",
        type: "cell",
        name: "Cell: Toggle Active Visibility",
        action: () => {
          const { activeCell: s } = ye.getState();
          s && ye.getState().toggleCellVisibility(s), n();
        },
        searchableText: "Toggle cell visibility hide show active"
      },
      {
        id: "cell-show-all",
        type: "cell",
        name: "Cell: Show All",
        action: () => {
          ye.getState().showAllCells(), n();
        },
        searchableText: "Show all cells visible unhide"
      },
      {
        id: "cell-hide-all",
        type: "cell",
        name: "Cell: Hide All",
        action: () => {
          ye.getState().hideAllCells(), n();
        },
        searchableText: "Hide all cells invisible"
      },
      ...ye.getState().cells.map((s) => ({
        id: `cell-activate-${s}`,
        type: "cell",
        name: `Cell: Set Active: ${s}`,
        action: () => {
          ye.getState().setActiveCell(s), n();
        },
        searchableText: `Cell set active ${s} switch`
      })),
      ...ye.getState().cells.filter((s) => s !== ye.getState().activeCell).map((s) => ({
        id: `cell-instance-${s}`,
        type: "cell",
        name: `Cell: Add Instance: ${s}`,
        action: () => {
          const { library: c, renderer: f } = Ce.getState(), h = ye.getState().activeCell;
          if (!c || !f || !h) {
            n();
            return;
          }
          if (!c.can_instance_cell(h, s)) {
            n();
            return;
          }
          const { zoom: p, offset: g } = ze.getState(), v = window.innerWidth / 2, y = window.innerHeight / 2, S = (v - g.x) / p, E = (y - g.y) / p, k = new Tv(s, S, E);
          fe.getState().execute(k, {
            library: c,
            renderer: f
          }), n();
        },
        searchableText: `Cell add instance ${s} place ref reference`
      })),
      {
        id: "hierarchy-set-max-level",
        type: "command",
        name: "Hierarchy: Show All Levels",
        action: () => {
          const { setHierarchyLevelLimit: s } = ye.getState();
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
      ..._E(n),
      ...ME(n)
    ];
  }
  const CE = [
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
  ], EE = [
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
  function _E(l) {
    return EE.map((n) => ({
      id: `boolean-${n.id}`,
      type: "command",
      name: `Boolean: ${n.name}`,
      action: () => {
        const { library: a, renderer: i } = Ce.getState();
        if (!a || !i) {
          l();
          return;
        }
        const { selectedIds: s, lastSelectedId: c } = se.getState();
        if (s.size < 2) {
          l();
          return;
        }
        const f = [
          ...s
        ], h = c ?? f[0], p = new Hv(f, n.id, h);
        fe.getState().execute(p, {
          library: a,
          renderer: i
        }), l();
      },
      searchableText: n.search
    }));
  }
  function ME(l) {
    return CE.map((n) => ({
      id: `align-${n.id}`,
      type: "command",
      name: `Align: ${n.name}`,
      action: () => {
        const { library: a, renderer: i } = Ce.getState();
        if (!a || !i) {
          l();
          return;
        }
        const { selectedIds: s, lastSelectedId: c } = se.getState();
        if (s.size === 0) {
          l();
          return;
        }
        if (n.id !== "origin-align" && s.size < 2) {
          l();
          return;
        }
        const f = new Iv(new Set(s), c, n.id);
        fe.getState().execute(f, {
          library: a,
          renderer: i
        }), l();
      },
      searchableText: n.search
    }));
  }
  function kE({ shortcut: l }) {
    var _a;
    const a = he((s) => s.theme) === "dark", i = q("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", a ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10");
    return b.jsxs("span", {
      className: "flex items-center gap-0.5",
      children: [
        (_a = l.modifiers) == null ? void 0 : _a.map((s, c) => b.jsx("kbd", {
          className: i,
          children: s
        }, c)),
        b.jsx("kbd", {
          className: i,
          children: l.key
        }),
        l.then && b.jsxs(b.Fragment, {
          children: [
            b.jsx("span", {
              className: q("px-1 text-[11px]", a ? "text-white/50" : "text-gray-500"),
              children: "then"
            }),
            b.jsx("kbd", {
              className: i,
              children: l.then
            })
          ]
        })
      ]
    });
  }
  function jE({ item: l }) {
    const a = he((i) => i.theme) === "dark";
    return b.jsxs(ko.Item, {
      value: l.searchableText,
      onSelect: l.action,
      className: q("flex cursor-pointer items-center justify-between rounded-lg px-3 py-2", a ? "text-white/80 aria-selected:bg-[rgb(54,54,54)] aria-selected:text-white" : "text-gray-700 aria-selected:bg-[rgb(217,217,217)] aria-selected:text-gray-900"),
      children: [
        b.jsx("span", {
          className: "text-sm",
          children: l.name
        }),
        l.color && b.jsx("span", {
          className: q("inline-block h-3.5 w-3.5 shrink-0 rounded border", a ? "border-white/15" : "border-black/15"),
          style: {
            backgroundColor: l.color
          }
        }),
        l.shortcut && b.jsx(kE, {
          shortcut: l.shortcut
        })
      ]
    });
  }
  function qy() {
    const n = he((y) => y.theme) === "dark", a = qt((y) => y.isOpen), i = qt((y) => y.close);
    Us("command-palette", a);
    const [s, c] = m.useState(""), f = m.useRef(null), h = m.useMemo(() => wE(), [
      a
    ]), p = m.useMemo(() => {
      const y = s.toLowerCase();
      return h.filter((S) => S.searchableText.toLowerCase().includes(y));
    }, [
      h,
      s
    ]), g = m.useMemo(() => [
      ...p
    ].sort((y, S) => y.name.localeCompare(S.name)), [
      p
    ]), v = m.useCallback((y) => {
      const S = y.target;
      S instanceof Node && f.current && !f.current.contains(S) && i();
    }, [
      i
    ]);
    return m.useEffect(() => {
      if (!a) {
        c("");
        return;
      }
      return c(qt.getState().initialSearch), document.addEventListener("mousedown", v), () => {
        document.removeEventListener("mousedown", v);
      };
    }, [
      a,
      v
    ]), a ? b.jsx("div", {
      className: "fixed inset-0 z-[200]",
      children: b.jsx(ko, {
        className: "fixed inset-0 flex items-start justify-center px-4 pt-[min(15vh,120px)]",
        shouldFilter: false,
        loop: true,
        label: "Command Menu",
        onKeyDown: (y) => {
          y.key === "Escape" && (y.preventDefault(), i());
        },
        children: b.jsxs("div", {
          ref: f,
          className: q("w-full max-w-[560px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          children: [
            b.jsx(ko.Input, {
              value: s,
              onValueChange: c,
              placeholder: "Type a command or search...",
              className: q("w-full border-b bg-transparent px-4 py-3 text-sm outline-none", n ? "border-white/10 text-white/90 placeholder:text-white/50" : "border-black/10 text-gray-900 placeholder:text-gray-500"),
              autoFocus: true
            }),
            b.jsxs(ko.List, {
              className: "max-h-[320px] overflow-y-auto p-1",
              onWheel: (y) => y.stopPropagation(),
              children: [
                b.jsx(ko.Empty, {
                  className: q("px-3 py-2 text-sm", n ? "text-white/50" : "text-gray-500"),
                  children: "No matching commands"
                }),
                g.map((y) => b.jsx(jE, {
                  item: y
                }, y.id))
              ]
            })
          ]
        })
      })
    }) : null;
  }
  const Ke = xa.createContext({});
  var RE = Object.defineProperty, Gy = Object.getOwnPropertySymbols, LE = Object.prototype.hasOwnProperty, AE = Object.prototype.propertyIsEnumerable, Zy = (l, n, a) => n in l ? RE(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Ed = (l, n) => {
    for (var a in n || (n = {})) LE.call(n, a) && Zy(l, a, n[a]);
    if (Gy) for (var a of Gy(n)) AE.call(n, a) && Zy(l, a, n[a]);
    return l;
  };
  const TE = (l, n) => {
    const a = m.useContext(Ke), i = Ed(Ed({}, a), l);
    return m.createElement("svg", Ed({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M12 22L12 2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M19 16H5C3.89543 16 3 15.1046 3 14L3 10C3 8.89543 3.89543 8 5 8H19C20.1046 8 21 8.89543 21 10V14C21 15.1046 20.1046 16 19 16Z",
      stroke: "currentColor"
    }));
  }, NE = m.forwardRef(TE);
  var OE = NE, DE = Object.defineProperty, Ky = Object.getOwnPropertySymbols, zE = Object.prototype.hasOwnProperty, IE = Object.prototype.propertyIsEnumerable, Py = (l, n, a) => n in l ? DE(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, _d = (l, n) => {
    for (var a in n || (n = {})) zE.call(n, a) && Py(l, a, n[a]);
    if (Ky) for (var a of Ky(n)) IE.call(n, a) && Py(l, a, n[a]);
    return l;
  };
  const HE = (l, n) => {
    const a = m.useContext(Ke), i = _d(_d({}, a), l);
    return m.createElement("svg", _d({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M22 12L2 12",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M8 19V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V19C16 20.1046 15.1046 21 14 21H10C8.89543 21 8 20.1046 8 19Z",
      stroke: "currentColor"
    }));
  }, YE = m.forwardRef(HE);
  var UE = YE, BE = Object.defineProperty, Qy = Object.getOwnPropertySymbols, XE = Object.prototype.hasOwnProperty, VE = Object.prototype.propertyIsEnumerable, Fy = (l, n, a) => n in l ? BE(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Md = (l, n) => {
    for (var a in n || (n = {})) XE.call(n, a) && Fy(l, a, n[a]);
    if (Qy) for (var a of Qy(n)) VE.call(n, a) && Fy(l, a, n[a]);
    return l;
  };
  const $E = (l, n) => {
    const a = m.useContext(Ke), i = Md(Md({}, a), l);
    return m.createElement("svg", Md({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M3 21L3 3L9 3V15L21 15V21H3Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M13 19V21",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), m.createElement("path", {
      d: "M9 19V21",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), m.createElement("path", {
      d: "M3 7H5",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), m.createElement("path", {
      d: "M3 11H5",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), m.createElement("path", {
      d: "M3 15H5",
      stroke: "currentColor",
      strokeLinecap: "round"
    }), m.createElement("path", {
      d: "M17 19V21",
      stroke: "currentColor",
      strokeLinecap: "round"
    }));
  }, qE = m.forwardRef($E);
  var GE = qE, ZE = Object.defineProperty, Wy = Object.getOwnPropertySymbols, KE = Object.prototype.hasOwnProperty, PE = Object.prototype.propertyIsEnumerable, Jy = (l, n, a) => n in l ? ZE(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, kd = (l, n) => {
    for (var a in n || (n = {})) KE.call(n, a) && Jy(l, a, n[a]);
    if (Wy) for (var a of Wy(n)) PE.call(n, a) && Jy(l, a, n[a]);
    return l;
  };
  const QE = (l, n) => {
    const a = m.useContext(Ke), i = kd(kd({}, a), l);
    return m.createElement("svg", kd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M4 16.01L4.01 15.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4 20.01L4.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4 8.01L4.01 7.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4 4.01L4.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4 12.01L4.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M8 20.01L8.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 20.01L12.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M16 20.01L16.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 20.01L20.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 16.01L20.01 15.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 12.01L20.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 8.01L20.01 7.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 4.01L20.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M16 4.01L16.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 4.01L12.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M8 4.01L8.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M8 16V8H16V16H8Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, FE = m.forwardRef(QE);
  var WE = FE, JE = Object.defineProperty, eb = Object.getOwnPropertySymbols, e4 = Object.prototype.hasOwnProperty, t4 = Object.prototype.propertyIsEnumerable, tb = (l, n, a) => n in l ? JE(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, jd = (l, n) => {
    for (var a in n || (n = {})) e4.call(n, a) && tb(l, a, n[a]);
    if (eb) for (var a of eb(n)) t4.call(n, a) && tb(l, a, n[a]);
    return l;
  };
  const n4 = (l, n) => {
    const a = m.useContext(Ke), i = jd(jd({}, a), l);
    return m.createElement("svg", jd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M22 21L2 21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M8 15V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V15C16 16.1046 15.1046 17 14 17H10C8.89543 17 8 16.1046 8 15Z",
      stroke: "currentColor"
    }));
  }, l4 = m.forwardRef(n4);
  var r4 = l4, a4 = Object.defineProperty, nb = Object.getOwnPropertySymbols, o4 = Object.prototype.hasOwnProperty, i4 = Object.prototype.propertyIsEnumerable, lb = (l, n, a) => n in l ? a4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Rd = (l, n) => {
    for (var a in n || (n = {})) o4.call(n, a) && lb(l, a, n[a]);
    if (nb) for (var a of nb(n)) i4.call(n, a) && lb(l, a, n[a]);
    return l;
  };
  const s4 = (l, n) => {
    const a = m.useContext(Ke), i = Rd(Rd({}, a), l);
    return m.createElement("svg", Rd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M3 22L3 2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M19 16H9C7.89543 16 7 15.1046 7 14V10C7 8.89543 7.89543 8 9 8H19C20.1046 8 21 8.89543 21 10V14C21 15.1046 20.1046 16 19 16Z",
      stroke: "currentColor"
    }));
  }, c4 = m.forwardRef(s4);
  var u4 = c4, d4 = Object.defineProperty, rb = Object.getOwnPropertySymbols, f4 = Object.prototype.hasOwnProperty, h4 = Object.prototype.propertyIsEnumerable, ab = (l, n, a) => n in l ? d4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Ld = (l, n) => {
    for (var a in n || (n = {})) f4.call(n, a) && ab(l, a, n[a]);
    if (rb) for (var a of rb(n)) h4.call(n, a) && ab(l, a, n[a]);
    return l;
  };
  const m4 = (l, n) => {
    const a = m.useContext(Ke), i = Ld(Ld({}, a), l);
    return m.createElement("svg", Ld({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M21 22V2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M15 16H5C3.89543 16 3 15.1046 3 14L3 10C3 8.89543 3.89543 8 5 8H15C16.1046 8 17 8.89543 17 10V14C17 15.1046 16.1046 16 15 16Z",
      stroke: "currentColor"
    }));
  }, p4 = m.forwardRef(m4);
  var g4 = p4, y4 = Object.defineProperty, ob = Object.getOwnPropertySymbols, b4 = Object.prototype.hasOwnProperty, v4 = Object.prototype.propertyIsEnumerable, ib = (l, n, a) => n in l ? y4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Ad = (l, n) => {
    for (var a in n || (n = {})) b4.call(n, a) && ib(l, a, n[a]);
    if (ob) for (var a of ob(n)) v4.call(n, a) && ib(l, a, n[a]);
    return l;
  };
  const x4 = (l, n) => {
    const a = m.useContext(Ke), i = Ad(Ad({}, a), l);
    return m.createElement("svg", Ad({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M22 3L2 3",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M8 19V9C8 7.89543 8.89543 7 10 7H14C15.1046 7 16 7.89543 16 9V19C16 20.1046 15.1046 21 14 21H10C8.89543 21 8 20.1046 8 19Z",
      stroke: "currentColor"
    }));
  }, S4 = m.forwardRef(x4);
  var w4 = S4, C4 = Object.defineProperty, sb = Object.getOwnPropertySymbols, E4 = Object.prototype.hasOwnProperty, _4 = Object.prototype.propertyIsEnumerable, cb = (l, n, a) => n in l ? C4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Td = (l, n) => {
    for (var a in n || (n = {})) E4.call(n, a) && cb(l, a, n[a]);
    if (sb) for (var a of sb(n)) _4.call(n, a) && cb(l, a, n[a]);
    return l;
  };
  const M4 = (l, n) => {
    const a = m.useContext(Ke), i = Td(Td({}, a), l);
    return m.createElement("svg", Td({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M5.21173 15.1113L2.52473 12.4243C2.29041 12.1899 2.29041 11.8101 2.52473 11.5757L5.21173 8.88873C5.44605 8.65442 5.82595 8.65442 6.06026 8.88873L8.74727 11.5757C8.98158 11.8101 8.98158 12.1899 8.74727 12.4243L6.06026 15.1113C5.82595 15.3456 5.44605 15.3456 5.21173 15.1113Z",
      stroke: "currentColor"
    }), m.createElement("path", {
      d: "M11.5757 21.475L8.88874 18.788C8.65443 18.5537 8.65443 18.1738 8.88874 17.9395L11.5757 15.2525C11.8101 15.0182 12.19 15.0182 12.4243 15.2525L15.1113 17.9395C15.3456 18.1738 15.3456 18.5537 15.1113 18.788L12.4243 21.475C12.19 21.7094 11.8101 21.7094 11.5757 21.475Z",
      stroke: "currentColor"
    }), m.createElement("path", {
      d: "M11.5757 8.7475L8.88874 6.06049C8.65443 5.82618 8.65443 5.44628 8.88874 5.21197L11.5757 2.52496C11.8101 2.29065 12.19 2.29065 12.4243 2.52496L15.1113 5.21197C15.3456 5.44628 15.3456 5.82618 15.1113 6.06049L12.4243 8.7475C12.19 8.98181 11.8101 8.98181 11.5757 8.7475Z",
      stroke: "currentColor"
    }), m.createElement("path", {
      d: "M17.9396 15.1113L15.2526 12.4243C15.0183 12.1899 15.0183 11.8101 15.2526 11.5757L17.9396 8.88873C18.174 8.65442 18.5539 8.65442 18.7882 8.88873L21.4752 11.5757C21.7095 11.8101 21.7095 12.1899 21.4752 12.4243L18.7882 15.1113C18.5539 15.3456 18.174 15.3456 17.9396 15.1113Z",
      stroke: "currentColor"
    }));
  }, k4 = m.forwardRef(M4);
  var j4 = k4, R4 = Object.defineProperty, ub = Object.getOwnPropertySymbols, L4 = Object.prototype.hasOwnProperty, A4 = Object.prototype.propertyIsEnumerable, db = (l, n, a) => n in l ? R4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Nd = (l, n) => {
    for (var a in n || (n = {})) L4.call(n, a) && db(l, a, n[a]);
    if (ub) for (var a of ub(n)) A4.call(n, a) && db(l, a, n[a]);
    return l;
  };
  const T4 = (l, n) => {
    const a = m.useContext(Ke), i = Nd(Nd({}, a), l);
    return m.createElement("svg", Nd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M12 12L4 4M4 4V8M4 4H8",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 12L20 4M20 4V8M20 4H16",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 12L4 20M4 20V16M4 20H8",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 12L20 20M20 20V16M20 20H16",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, N4 = m.forwardRef(T4);
  var Yf = N4, O4 = Object.defineProperty, fb = Object.getOwnPropertySymbols, D4 = Object.prototype.hasOwnProperty, z4 = Object.prototype.propertyIsEnumerable, hb = (l, n, a) => n in l ? O4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Od = (l, n) => {
    for (var a in n || (n = {})) D4.call(n, a) && hb(l, a, n[a]);
    if (fb) for (var a of fb(n)) z4.call(n, a) && hb(l, a, n[a]);
    return l;
  };
  const I4 = (l, n) => {
    const a = m.useContext(Ke), i = Od(Od({}, a), l);
    return m.createElement("svg", Od({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M3 20C11 20 21 4 21 4",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, H4 = m.forwardRef(I4);
  var U1 = H4, Y4 = Object.defineProperty, mb = Object.getOwnPropertySymbols, U4 = Object.prototype.hasOwnProperty, B4 = Object.prototype.propertyIsEnumerable, pb = (l, n, a) => n in l ? Y4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Dd = (l, n) => {
    for (var a in n || (n = {})) U4.call(n, a) && pb(l, a, n[a]);
    if (mb) for (var a of mb(n)) B4.call(n, a) && pb(l, a, n[a]);
    return l;
  };
  const X4 = (l, n) => {
    const a = m.useContext(Ke), i = Dd(Dd({}, a), l);
    return m.createElement("svg", Dd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M10.5 15H9.6C9.26863 15 9 15.2686 9 15.6V20.4C9 20.7314 9.26863 21 9.6 21H20.4C20.7314 21 21 20.7314 21 20.4V9.6C21 9.26863 20.7314 9 20.4 9H15.6C15.2686 9 15 9.26863 15 9.6V10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M13.5 15H14.4C14.7314 15 15 14.7314 15 14.4V13.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M9 13.5V14.4C9 14.7314 8.73137 15 8.4 15H3.6C3.26863 15 3 14.7314 3 14.4V3.6C3 3.26863 3.26863 3 3.6 3H14.4C14.7314 3 15 3.26863 15 3.6V8.4C15 8.73137 14.7314 9 14.4 9H13.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M9 10.5V9.6C9 9.26863 9.26863 9 9.6 9H10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, V4 = m.forwardRef(X4);
  var $4 = V4, q4 = Object.defineProperty, gb = Object.getOwnPropertySymbols, G4 = Object.prototype.hasOwnProperty, Z4 = Object.prototype.propertyIsEnumerable, yb = (l, n, a) => n in l ? q4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, zd = (l, n) => {
    for (var a in n || (n = {})) G4.call(n, a) && yb(l, a, n[a]);
    if (gb) for (var a of gb(n)) Z4.call(n, a) && yb(l, a, n[a]);
    return l;
  };
  const K4 = (l, n) => {
    const a = m.useContext(Ke), i = zd(zd({}, a), l);
    return m.createElement("svg", zd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M21 13.5V16.5M13.5 21H16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M16.5 9H9.6C9.26863 9 9 9.26863 9 9.6V16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M10.5 21H9.6C9.26863 21 9 20.7314 9 20.4V19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M21 19.5V20.4C21 20.7314 20.7314 21 20.4 21H19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M19.5 9H20.4C20.7314 9 21 9.26863 21 9.6V10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M3 10.5V7.5M7.5 3H10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M7.5 15H14.4C14.7314 15 15 14.7314 15 14.4V7.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4.5 15H3.6C3.26863 15 3 14.7314 3 14.4V13.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M3 4.5V3.6C3 3.26863 3.26863 3 3.6 3H4.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M13.5 3H14.4C14.7314 3 15 3.26863 15 3.6V4.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, P4 = m.forwardRef(K4);
  var Q4 = P4, F4 = Object.defineProperty, bb = Object.getOwnPropertySymbols, W4 = Object.prototype.hasOwnProperty, J4 = Object.prototype.propertyIsEnumerable, vb = (l, n, a) => n in l ? F4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Id = (l, n) => {
    for (var a in n || (n = {})) W4.call(n, a) && vb(l, a, n[a]);
    if (bb) for (var a of bb(n)) J4.call(n, a) && vb(l, a, n[a]);
    return l;
  };
  const e_ = (l, n) => {
    const a = m.useContext(Ke), i = Id(Id({}, a), l);
    return m.createElement("svg", Id({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M3 5H21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M3 12H21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M3 19H21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, t_ = m.forwardRef(e_);
  var n_ = t_, l_ = Object.defineProperty, xb = Object.getOwnPropertySymbols, r_ = Object.prototype.hasOwnProperty, a_ = Object.prototype.propertyIsEnumerable, Sb = (l, n, a) => n in l ? l_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Hd = (l, n) => {
    for (var a in n || (n = {})) r_.call(n, a) && Sb(l, a, n[a]);
    if (xb) for (var a of xb(n)) a_.call(n, a) && Sb(l, a, n[a]);
    return l;
  };
  const o_ = (l, n) => {
    const a = m.useContext(Ke), i = Hd(Hd({}, a), l);
    return m.createElement("svg", Hd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M20 12.5C20.2761 12.5 20.5 12.2761 20.5 12C20.5 11.7239 20.2761 11.5 20 11.5C19.7239 11.5 19.5 11.7239 19.5 12C19.5 12.2761 19.7239 12.5 20 12.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4 12.5C4.27614 12.5 4.5 12.2761 4.5 12C4.5 11.7239 4.27614 11.5 4 11.5C3.72386 11.5 3.5 11.7239 3.5 12C3.5 12.2761 3.72386 12.5 4 12.5Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, i_ = m.forwardRef(o_);
  var s_ = i_, c_ = Object.defineProperty, wb = Object.getOwnPropertySymbols, u_ = Object.prototype.hasOwnProperty, d_ = Object.prototype.propertyIsEnumerable, Cb = (l, n, a) => n in l ? c_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Yd = (l, n) => {
    for (var a in n || (n = {})) u_.call(n, a) && Cb(l, a, n[a]);
    if (wb) for (var a of wb(n)) d_.call(n, a) && Cb(l, a, n[a]);
    return l;
  };
  const f_ = (l, n) => {
    const a = m.useContext(Ke), i = Yd(Yd({}, a), l);
    return m.createElement("svg", Yd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M15 6L9 12L15 18",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, h_ = m.forwardRef(f_);
  var m_ = h_, p_ = Object.defineProperty, Eb = Object.getOwnPropertySymbols, g_ = Object.prototype.hasOwnProperty, y_ = Object.prototype.propertyIsEnumerable, _b = (l, n, a) => n in l ? p_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Ud = (l, n) => {
    for (var a in n || (n = {})) g_.call(n, a) && _b(l, a, n[a]);
    if (Eb) for (var a of Eb(n)) y_.call(n, a) && _b(l, a, n[a]);
    return l;
  };
  const b_ = (l, n) => {
    const a = m.useContext(Ke), i = Ud(Ud({}, a), l);
    return m.createElement("svg", Ud({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M9 6L15 12L9 18",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, v_ = m.forwardRef(b_);
  var B1 = v_, x_ = Object.defineProperty, Mb = Object.getOwnPropertySymbols, S_ = Object.prototype.hasOwnProperty, w_ = Object.prototype.propertyIsEnumerable, kb = (l, n, a) => n in l ? x_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Bd = (l, n) => {
    for (var a in n || (n = {})) S_.call(n, a) && kb(l, a, n[a]);
    if (Mb) for (var a of Mb(n)) w_.call(n, a) && kb(l, a, n[a]);
    return l;
  };
  const C_ = (l, n) => {
    const a = m.useContext(Ke), i = Bd(Bd({}, a), l);
    return m.createElement("svg", Bd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M18 16.5V3M18 3L21.5 6.5M18 3L14.5 6.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M18 16.5C18 18.433 16.433 20 14.5 20C12.567 20 11 18.433 11 16.5V7.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M11 7.5C11 5.567 9.433 4 7.5 4C5.567 4 4 5.567 4 7.5V19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, E_ = m.forwardRef(C_);
  var __ = E_, M_ = Object.defineProperty, jb = Object.getOwnPropertySymbols, k_ = Object.prototype.hasOwnProperty, j_ = Object.prototype.propertyIsEnumerable, Rb = (l, n, a) => n in l ? M_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Xd = (l, n) => {
    for (var a in n || (n = {})) k_.call(n, a) && Rb(l, a, n[a]);
    if (jb) for (var a of jb(n)) j_.call(n, a) && Rb(l, a, n[a]);
    return l;
  };
  const R_ = (l, n) => {
    const a = m.useContext(Ke), i = Xd(Xd({}, a), l);
    return m.createElement("svg", Xd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M11.6473 2.25623C11.8576 2.10344 12.1424 2.10344 12.3527 2.25623L22.1089 9.34458C22.3192 9.49737 22.4072 9.76819 22.3269 10.0154L18.6003 21.4846C18.52 21.7318 18.2896 21.8992 18.0297 21.8992H5.97029C5.71035 21.8992 5.47998 21.7318 5.39965 21.4846L1.67309 10.0154C1.59276 9.76819 1.68076 9.49737 1.89105 9.34458L11.6473 2.25623Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, L_ = m.forwardRef(R_);
  var A_ = L_, T_ = Object.defineProperty, Lb = Object.getOwnPropertySymbols, N_ = Object.prototype.hasOwnProperty, O_ = Object.prototype.propertyIsEnumerable, Ab = (l, n, a) => n in l ? T_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Vd = (l, n) => {
    for (var a in n || (n = {})) N_.call(n, a) && Ab(l, a, n[a]);
    if (Lb) for (var a of Lb(n)) O_.call(n, a) && Ab(l, a, n[a]);
    return l;
  };
  const D_ = (l, n) => {
    const a = m.useContext(Ke), i = Vd(Vd({}, a), l);
    return m.createElement("svg", Vd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M9 12H12M15 12H12M12 12V9M12 12V15",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, z_ = m.forwardRef(D_);
  var X1 = z_, I_ = Object.defineProperty, Tb = Object.getOwnPropertySymbols, H_ = Object.prototype.hasOwnProperty, Y_ = Object.prototype.propertyIsEnumerable, Nb = (l, n, a) => n in l ? I_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, $d = (l, n) => {
    for (var a in n || (n = {})) H_.call(n, a) && Nb(l, a, n[a]);
    if (Tb) for (var a of Tb(n)) Y_.call(n, a) && Nb(l, a, n[a]);
    return l;
  };
  const U_ = (l, n) => {
    const a = m.useContext(Ke), i = $d($d({}, a), l);
    return m.createElement("svg", $d({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M4 16.01L4.01 15.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4 20.01L4.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4 8.01L4.01 7.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4 4.01L4.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4 12.01L4.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 12.01L12.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M8 20.01L8.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 20.01L12.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M16 20.01L16.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 20.01L20.01 19.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 16.01L20.01 15.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 12.01L20.01 11.9989",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 8.01L20.01 7.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M20 4.01L20.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M16 4.01L16.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 4.01L12.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M8 4.01L8.01 3.99889",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, B_ = m.forwardRef(U_);
  var X_ = B_, V_ = Object.defineProperty, Ob = Object.getOwnPropertySymbols, $_ = Object.prototype.hasOwnProperty, q_ = Object.prototype.propertyIsEnumerable, Db = (l, n, a) => n in l ? V_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, qd = (l, n) => {
    for (var a in n || (n = {})) $_.call(n, a) && Db(l, a, n[a]);
    if (Ob) for (var a of Ob(n)) q_.call(n, a) && Db(l, a, n[a]);
    return l;
  };
  const G_ = (l, n) => {
    const a = m.useContext(Ke), i = qd(qd({}, a), l);
    return m.createElement("svg", qd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 19V21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M5 12H3",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 5V3",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M19 12H21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, Z_ = m.forwardRef(G_);
  var K_ = Z_, P_ = Object.defineProperty, zb = Object.getOwnPropertySymbols, Q_ = Object.prototype.hasOwnProperty, F_ = Object.prototype.propertyIsEnumerable, Ib = (l, n, a) => n in l ? P_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Gd = (l, n) => {
    for (var a in n || (n = {})) Q_.call(n, a) && Ib(l, a, n[a]);
    if (zb) for (var a of zb(n)) F_.call(n, a) && Ib(l, a, n[a]);
    return l;
  };
  const W_ = (l, n) => {
    const a = m.useContext(Ke), i = Gd(Gd({}, a), l);
    return m.createElement("svg", Gd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M16 7V2.6C16 2.26863 15.7314 2 15.4 2H8.6C8.26863 2 8 2.26863 8 2.6V21.4C8 21.7314 8.26863 22 8.6 22H15.4C15.7314 22 16 21.7314 16 21.4V17M16 7H13M16 7V12M16 12H13M16 12V17M16 17H13",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, J_ = m.forwardRef(W_);
  var V1 = J_, e3 = Object.defineProperty, Hb = Object.getOwnPropertySymbols, t3 = Object.prototype.hasOwnProperty, n3 = Object.prototype.propertyIsEnumerable, Yb = (l, n, a) => n in l ? e3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Zd = (l, n) => {
    for (var a in n || (n = {})) t3.call(n, a) && Yb(l, a, n[a]);
    if (Hb) for (var a of Hb(n)) n3.call(n, a) && Yb(l, a, n[a]);
    return l;
  };
  const l3 = (l, n) => {
    const a = m.useContext(Ke), i = Zd(Zd({}, a), l);
    return m.createElement("svg", Zd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M10 16L14 8",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, r3 = m.forwardRef(l3);
  var $1 = r3, a3 = Object.defineProperty, Ub = Object.getOwnPropertySymbols, o3 = Object.prototype.hasOwnProperty, i3 = Object.prototype.propertyIsEnumerable, Bb = (l, n, a) => n in l ? a3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Kd = (l, n) => {
    for (var a in n || (n = {})) o3.call(n, a) && Bb(l, a, n[a]);
    if (Ub) for (var a of Ub(n)) i3.call(n, a) && Bb(l, a, n[a]);
    return l;
  };
  const s3 = (l, n) => {
    const a = m.useContext(Ke), i = Kd(Kd({}, a), l);
    return m.createElement("svg", Kd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z",
      stroke: "currentColor"
    }), m.createElement("path", {
      d: "M3 4C3.55228 4 4 3.55228 4 3C4 2.44772 3.55228 2 3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M21 22C21.5523 22 22 21.5523 22 21C22 20.4477 21.5523 20 21 20C20.4477 20 20 20.4477 20 21C20 21.5523 20.4477 22 21 22Z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, c3 = m.forwardRef(s3);
  var u3 = c3, d3 = Object.defineProperty, Xb = Object.getOwnPropertySymbols, f3 = Object.prototype.hasOwnProperty, h3 = Object.prototype.propertyIsEnumerable, Vb = (l, n, a) => n in l ? d3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Pd = (l, n) => {
    for (var a in n || (n = {})) f3.call(n, a) && Vb(l, a, n[a]);
    if (Xb) for (var a of Xb(n)) h3.call(n, a) && Vb(l, a, n[a]);
    return l;
  };
  const m3 = (l, n) => {
    const a = m.useContext(Ke), i = Pd(Pd({}, a), l);
    return m.createElement("svg", Pd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M15 3.6V14.4C15 14.7314 14.7314 15 14.4 15H3.6C3.26863 15 3 14.7314 3 14.4V3.6C3 3.26863 3.26863 3 3.6 3H14.4C14.7314 3 15 3.26863 15 3.6Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M13.5 21H16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M21 13.5V16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M21 19.5V20.4C21 20.7314 20.7314 21 20.4 21H19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M10.5 21H9.6C9.26863 21 9 20.7314 9 20.4V19.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M19.5 9H20.4C20.7314 9 21 9.26863 21 9.6V10.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M16.5 9H9.6C9.26863 9 9 9.26863 9 9.6V16.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, p3 = m.forwardRef(m3);
  var g3 = p3, y3 = Object.defineProperty, $b = Object.getOwnPropertySymbols, b3 = Object.prototype.hasOwnProperty, v3 = Object.prototype.propertyIsEnumerable, qb = (l, n, a) => n in l ? y3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Qd = (l, n) => {
    for (var a in n || (n = {})) b3.call(n, a) && qb(l, a, n[a]);
    if ($b) for (var a of $b(n)) v3.call(n, a) && qb(l, a, n[a]);
    return l;
  };
  const x3 = (l, n) => {
    const a = m.useContext(Ke), i = Qd(Qd({}, a), l);
    return m.createElement("svg", Qd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M12 2V6",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 18V22",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M22 12H18",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M6 12H2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M4.92896 4.92896L7.75738 7.75738",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M16.2427 16.2427L19.0711 19.0711",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M19.071 4.92896L16.2426 7.75738",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M7.75732 16.2427L4.9289 19.0711",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, S3 = m.forwardRef(x3);
  var w3 = S3, C3 = Object.defineProperty, Gb = Object.getOwnPropertySymbols, E3 = Object.prototype.hasOwnProperty, _3 = Object.prototype.propertyIsEnumerable, Zb = (l, n, a) => n in l ? C3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Fd = (l, n) => {
    for (var a in n || (n = {})) E3.call(n, a) && Zb(l, a, n[a]);
    if (Gb) for (var a of Gb(n)) _3.call(n, a) && Zb(l, a, n[a]);
    return l;
  };
  const M3 = (l, n) => {
    const a = m.useContext(Ke), i = Fd(Fd({}, a), l);
    return m.createElement("svg", Fd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M19 7V5L5 5V7",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M12 5L12 19M12 19H10M12 19H14",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, k3 = m.forwardRef(M3);
  var j3 = k3, R3 = Object.defineProperty, Kb = Object.getOwnPropertySymbols, L3 = Object.prototype.hasOwnProperty, A3 = Object.prototype.propertyIsEnumerable, Pb = (l, n, a) => n in l ? R3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Wd = (l, n) => {
    for (var a in n || (n = {})) L3.call(n, a) && Pb(l, a, n[a]);
    if (Kb) for (var a of Kb(n)) A3.call(n, a) && Pb(l, a, n[a]);
    return l;
  };
  const T3 = (l, n) => {
    const a = m.useContext(Ke), i = Wd(Wd({}, a), l);
    return m.createElement("svg", Wd({
      width: "1.5em",
      height: "1.5em",
      strokeWidth: 1.5,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M15 9H20.4C20.7314 9 21 9.26863 21 9.6V20.4C21 20.7314 20.7314 21 20.4 21H9.6C9.26863 21 9 20.7314 9 20.4V15",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M15 9V3.6C15 3.26863 14.7314 3 14.4 3H3.6C3.26863 3 3 3.26863 3 3.6V14.4C3 14.7314 3.26863 15 3.6 15H9",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, N3 = m.forwardRef(T3);
  var O3 = N3, D3 = Object.defineProperty, Qb = Object.getOwnPropertySymbols, z3 = Object.prototype.hasOwnProperty, I3 = Object.prototype.propertyIsEnumerable, Fb = (l, n, a) => n in l ? D3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Jd = (l, n) => {
    for (var a in n || (n = {})) z3.call(n, a) && Fb(l, a, n[a]);
    if (Qb) for (var a of Qb(n)) I3.call(n, a) && Fb(l, a, n[a]);
    return l;
  };
  const H3 = (l, n) => {
    const a = m.useContext(Ke), i = Jd(Jd({}, a), l);
    return m.createElement("svg", Jd({
      width: "1.5em",
      height: "1.5em",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      color: "currentColor",
      ref: n
    }, i), m.createElement("path", {
      d: "M8 11H11M14 11H11M11 11V8M11 11V14",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M17 17L21 21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), m.createElement("path", {
      d: "M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, Y3 = m.forwardRef(H3);
  var Uf = Y3;
  const Ss = {
    md: 768,
    lg: 1120
  };
  function q1() {
    if (typeof window > "u") return {
      isLg: true,
      isMd: false,
      isSm: false
    };
    const l = window.innerWidth;
    return {
      isLg: l >= Ss.lg,
      isMd: l >= Ss.md && l < Ss.lg,
      isSm: l < Ss.md
    };
  }
  let jo = q1();
  const Sf = /* @__PURE__ */ new Set();
  function U3(l) {
    return Sf.add(l), () => Sf.delete(l);
  }
  function B3() {
    return jo;
  }
  if (typeof window < "u") {
    const l = () => {
      const n = q1();
      if (n.isLg !== jo.isLg || n.isMd !== jo.isMd || n.isSm !== jo.isSm) {
        jo = n;
        for (const a of Sf) a();
      }
    };
    window.addEventListener("resize", l);
  }
  function Bf() {
    return m.useSyncExternalStore(U3, B3, () => ({
      isLg: true,
      isMd: false,
      isSm: false
    }));
  }
  const X3 = 8;
  function G1({ side: l, width: n, onResize: a }) {
    const [i, s] = m.useState(false), c = m.useRef(0), f = m.useRef(0), h = m.useCallback((v) => {
      const y = Math.max(ws, Math.min(Cs, v));
      return Math.abs(y - Ro) <= X3 ? Ro : Math.round(y);
    }, []), p = m.useCallback((v) => {
      if (v.button !== 0) return;
      v.preventDefault(), v.stopPropagation(), c.current = v.clientX, f.current = n, s(true), document.body.style.userSelect = "none", document.body.style.cursor = "col-resize";
      const y = (E) => {
        const k = E.clientX - c.current, w = l === "left" ? f.current + k : f.current - k;
        a(h(w));
      }, S = () => {
        document.removeEventListener("mousemove", y), document.removeEventListener("mouseup", S), document.body.style.userSelect = "", document.body.style.cursor = "", s(false);
      };
      document.addEventListener("mousemove", y), document.addEventListener("mouseup", S);
    }, [
      l,
      n,
      a,
      h
    ]), g = m.useCallback(() => {
      a(Ro);
    }, [
      a
    ]);
    return {
      handleProps: {
        onMouseDown: p,
        onDoubleClick: g,
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
      isResizing: i
    };
  }
  async function wf(l) {
    const { emit: n } = await pt(async () => {
      const { emit: a } = await import("./event-DRyjiKX_.js");
      return {
        emit: a
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    await n("open-file", l);
  }
  async function Cf(l) {
    const n = Ce.getState().library;
    if (n) try {
      let a = null;
      if (l || (a = await Pv()), a || (a = await Wv()), !a) return;
      !a.endsWith(".gds") && !a.endsWith(".gds2") && !a.endsWith(".gdsii") && (a += ".gds");
      const i = n.to_gds();
      await Gv(a, i), Er.getState().markClean(), $t.getState().show(`Saved to ${a.split("/").pop()}`);
    } catch (a) {
      console.error("Failed to save GDS file:", a), $t.getState().show(`Save failed: ${a}`, "error");
    }
  }
  async function zo() {
    if (!Er.getState().isDirty) return true;
    if (qn) {
      const { ask: l } = await pt(async () => {
        const { ask: n } = await import("./index-F3OG0nQy.js");
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
  async function Xf() {
    await zo() && (fe.getState().clear(), se.getState().clearSelection(), ke.getState().clearAllRulers(), Gn.getState().clear(), me.getState().resetLayers([]), Er.getState().markClean(), qn && await Qv(null), window.dispatchEvent(new CustomEvent("rosette-new-file")));
  }
  async function Z1() {
    const { renderer: l } = Ce.getState();
    if (!l) throw new Error("Renderer not ready");
    const n = await l.capture_screenshot(), a = new DataView(n.buffer, n.byteOffset, n.byteLength), i = a.getUint32(0, true), s = a.getUint32(4, true), c = n.slice(8), f = document.createElement("canvas");
    f.width = i, f.height = s;
    const h = f.getContext("2d");
    if (!h) throw new Error("Failed to create 2D context");
    const p = new ImageData(new Uint8ClampedArray(c.buffer, c.byteOffset, c.byteLength), i, s);
    return h.putImageData(p, 0, 0), new Promise((g, v) => {
      f.toBlob((y) => y ? g(y) : v(new Error("PNG encoding failed")), "image/png");
    });
  }
  async function V3() {
    try {
      const l = await Z1();
      if (qn) {
        let n = await Jv();
        if (!n) return;
        n.endsWith(".png") || (n += ".png");
        const a = new Uint8Array(await l.arrayBuffer());
        await Zv(n, a), $t.getState().show(`Screenshot saved to ${n.split("/").pop()}`);
      } else {
        const n = URL.createObjectURL(l), a = document.createElement("a");
        a.href = n, a.download = "screenshot.png", document.body.appendChild(a), a.click(), document.body.removeChild(a), URL.revokeObjectURL(n), $t.getState().show("Screenshot downloaded");
      }
    } catch (l) {
      console.error("Screenshot failed:", l), $t.getState().show(`Screenshot failed: ${l}`, "error");
    }
  }
  async function $3() {
    try {
      const l = await Z1();
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": l
        })
      ]), $t.getState().show("Screenshot copied to clipboard");
    } catch (l) {
      console.error("Screenshot to clipboard failed:", l), $t.getState().show(`Screenshot to clipboard failed: ${l}`, "error");
    }
  }
  const Tn = Object.freeze(Object.defineProperty({
    __proto__: null,
    confirmDiscardChanges: zo,
    emitOpenFile: wf,
    handleNewFile: Xf,
    handleSave: Cf,
    handleScreenshot: V3,
    handleScreenshotToClipboard: $3
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function Nn({ label: l, shortcut: n, position: a = "bottom", align: i = "center", className: s, children: c }) {
    var _a;
    const f = he((v) => v.theme) === "dark", h = q("inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border px-1 text-[11px]", f ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"), g = a === "left" || a === "right" ? q("top-1/2 -translate-y-1/2", a === "left" ? "right-full mr-3" : "left-full ml-3") : q(i === "end" ? "right-0" : "left-1/2 -translate-x-1/2", a === "bottom" ? "top-full mt-2" : "bottom-full mb-2");
    return b.jsxs("div", {
      className: q("group relative", s),
      children: [
        c,
        b.jsxs("div", {
          className: q("pointer-events-none select-none absolute z-50 flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100", g, f ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
          children: [
            b.jsx("span", {
              children: l
            }),
            n && b.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = n.modifiers) == null ? void 0 : _a.map((v) => b.jsx("kbd", {
                  className: h,
                  children: v
                }, v)),
                b.jsx("kbd", {
                  className: h,
                  children: n.key
                })
              ]
            })
          ]
        })
      ]
    });
  }
  function q3(l) {
    return "separator" in l && l.separator;
  }
  function G3({ expanded: l, isDark: n }) {
    return b.jsx("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      className: q("flex-shrink-0 transition-transform duration-150", l ? "rotate-90" : "rotate-0", n ? "text-white/40" : "text-black/40"),
      children: b.jsx("path", {
        d: "M6 4l4 4-4 4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5"
      })
    });
  }
  function Z3({ items: l, isDark: n, onAction: a }) {
    const i = m.useRef(null), [s, c] = m.useState(false);
    return m.useLayoutEffect(() => {
      i.current && i.current.getBoundingClientRect().right > window.innerWidth - 8 && c(true);
    }, []), b.jsx("div", {
      ref: i,
      className: q("absolute -top-1 z-50 ml-1 min-w-[170px] rounded-xl border py-1", s ? "right-full mr-1" : "left-full", n ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      children: l.map((f) => {
        var _a;
        return q3(f) ? b.jsx("div", {
          className: q("my-1 h-px", n ? "bg-white/10" : "bg-black/10")
        }, f.id) : b.jsxs("button", {
          className: q("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors", f.disabled ? "opacity-40" : n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          disabled: f.disabled,
          onClick: () => {
            f.disabled || (Promise.resolve(f.action()).catch((h) => console.error("Menu action failed:", h)), a());
          },
          children: [
            b.jsx("span", {
              children: f.label
            }),
            f.shortcut && b.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = f.shortcut.modifiers) == null ? void 0 : _a.map((h) => b.jsx("kbd", {
                  className: q("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: h
                }, h)),
                b.jsx("kbd", {
                  className: q("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: f.shortcut.key
                })
              ]
            })
          ]
        }, f.id);
      })
    });
  }
  function K3({ isDark: l }) {
    const [n, a] = m.useState(false), [i, s] = m.useState(null), c = m.useRef(null);
    Us("explorer-menu", n);
    const f = m.useCallback(() => {
      a(false), s(null);
    }, []);
    m.useEffect(() => {
      if (!n) return;
      const p = (g) => {
        c.current && !c.current.contains(g.target) && f();
      };
      return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
    }, [
      n,
      f
    ]), m.useEffect(() => {
      if (!n) return;
      const p = (g) => {
        g.key === "Escape" && (g.preventDefault(), f());
      };
      return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
    }, [
      n,
      f
    ]);
    const h = [
      {
        id: "file",
        label: "File",
        buildItems: () => [
          {
            id: "file-new",
            label: "New",
            shortcut: {
              modifiers: [
                Ne.mod
              ],
              key: "N"
            },
            action: async () => {
              await Xf();
            },
            disabled: false
          },
          {
            id: "file-open",
            label: "Open...",
            shortcut: {
              modifiers: [
                Ne.mod
              ],
              key: "O"
            },
            action: async () => {
              if (!await zo()) return;
              const { pickGdsFile: g } = await pt(async () => {
                const { pickGdsFile: S } = await Promise.resolve().then(() => t1);
                return {
                  pickGdsFile: S
                };
              }, void 0, import.meta.url), { emitOpenFile: v } = await pt(async () => {
                const { emitOpenFile: S } = await Promise.resolve().then(() => Tn);
                return {
                  emitOpenFile: S
                };
              }, void 0, import.meta.url), y = await g();
              y && await v(y);
            },
            disabled: !qn
          },
          {
            id: "file-save",
            label: "Save",
            shortcut: {
              modifiers: [
                Ne.mod
              ],
              key: "S"
            },
            action: async () => {
              const { handleSave: p } = await pt(async () => {
                const { handleSave: g } = await Promise.resolve().then(() => Tn);
                return {
                  handleSave: g
                };
              }, void 0, import.meta.url);
              await p(false);
            },
            disabled: !qn
          },
          {
            id: "file-save-as",
            label: "Save As...",
            shortcut: {
              modifiers: [
                Ne.mod,
                Ne.shift
              ],
              key: "S"
            },
            action: async () => {
              const { handleSave: p } = await pt(async () => {
                const { handleSave: g } = await Promise.resolve().then(() => Tn);
                return {
                  handleSave: g
                };
              }, void 0, import.meta.url);
              await p(true);
            },
            disabled: !qn
          },
          {
            id: "sep-file-1",
            separator: true
          },
          {
            id: "file-screenshot",
            label: "Export Screenshot",
            action: async () => {
              const { handleScreenshot: p } = await pt(async () => {
                const { handleScreenshot: g } = await Promise.resolve().then(() => Tn);
                return {
                  handleScreenshot: g
                };
              }, void 0, import.meta.url);
              await p();
            },
            disabled: false
          },
          {
            id: "file-screenshot-clipboard",
            label: "Copy Screenshot",
            action: async () => {
              const { handleScreenshotToClipboard: p } = await pt(async () => {
                const { handleScreenshotToClipboard: g } = await Promise.resolve().then(() => Tn);
                return {
                  handleScreenshotToClipboard: g
                };
              }, void 0, import.meta.url);
              await p();
            },
            disabled: false
          }
        ]
      },
      {
        id: "edit",
        label: "Edit",
        buildItems: () => {
          const { library: p, renderer: g } = Ce.getState(), { canUndo: v, canRedo: y } = fe.getState(), { selectedIds: S } = se.getState(), { hasContent: E } = Gn.getState(), { selectedRulerIds: k } = ke.getState(), w = S.size > 0, C = k.size > 0, _ = p ? p.get_all_ids().length > 0 : false;
          return [
            {
              id: "undo",
              label: "Undo",
              shortcut: {
                modifiers: [
                  Ne.mod
                ],
                key: "Z"
              },
              action: () => {
                p && g && fe.getState().undo({
                  library: p,
                  renderer: g
                });
              },
              disabled: !v
            },
            {
              id: "redo",
              label: "Redo",
              shortcut: {
                modifiers: [
                  Ne.mod,
                  Ne.shift
                ],
                key: "Z"
              },
              action: () => {
                p && g && fe.getState().redo({
                  library: p,
                  renderer: g
                });
              },
              disabled: !y
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
                  Ne.mod
                ],
                key: "C"
              },
              action: () => {
                if (!p) return;
                const R = se.getState().selectedIds, A = jr(p, R);
                Gn.getState().copy(A);
              },
              disabled: !w
            },
            {
              id: "paste",
              label: "Paste",
              shortcut: {
                modifiers: [
                  Ne.mod
                ],
                key: "V"
              },
              action: () => {
                if (!p || !g) return;
                const R = new Hs();
                fe.getState().execute(R, {
                  library: p,
                  renderer: g
                });
                const A = document.querySelector("canvas");
                A && _r(p, A);
              },
              disabled: !E
            },
            {
              id: "duplicate",
              label: "Duplicate",
              shortcut: {
                modifiers: [
                  Ne.mod
                ],
                key: "B"
              },
              action: () => {
                if (!p || !g) return;
                const R = se.getState().selectedIds;
                if (R.size === 0) return;
                const A = new Ys([
                  ...R
                ]);
                fe.getState().execute(A, {
                  library: p,
                  renderer: g
                });
                const T = document.querySelector("canvas");
                T && _r(p, T);
              },
              disabled: !w
            },
            {
              id: "sep-edit-2",
              separator: true
            },
            {
              id: "delete",
              label: "Delete",
              shortcut: {
                key: Ne.backspace
              },
              action: () => {
                if (!p || !g) return;
                const R = ke.getState().selectedRulerIds;
                if (R.size > 0) {
                  const B = new Rf([
                    ...R
                  ]);
                  fe.getState().execute(B, {
                    library: p,
                    renderer: g
                  });
                  return;
                }
                const A = se.getState().selectedIds;
                if (A.size === 0) return;
                const T = new Is([
                  ...A
                ]);
                fe.getState().execute(T, {
                  library: p,
                  renderer: g
                });
              },
              disabled: !w && !C
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
                  Ne.mod
                ],
                key: "A"
              },
              action: () => {
                if (!p) return;
                const R = p.get_all_ids();
                se.getState().selectAll(R);
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
          const { library: p } = Ce.getState(), { selectedIds: g } = se.getState(), v = g.size > 0;
          return [
            {
              id: "zoomIn",
              label: "Zoom In",
              shortcut: {
                key: "+"
              },
              action: () => {
                const y = document.querySelector("canvas");
                if (!y) return;
                const S = y.getBoundingClientRect();
                ze.getState().zoomAt(Ts, S.width / 2, S.height / 2);
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
                const y = document.querySelector("canvas");
                if (!y) return;
                const S = y.getBoundingClientRect();
                ze.getState().zoomAt(Ns, S.width / 2, S.height / 2);
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
                const y = document.querySelector("canvas");
                if (!y || !p) return;
                const S = p.get_all_bounds(), E = S ? {
                  minX: S[0],
                  minY: S[1],
                  maxX: S[2],
                  maxY: S[3]
                } : null, k = Zn(y);
                ze.getState().zoomToFit(E, k.width, k.height, k.screenCenter);
              },
              disabled: false
            },
            {
              id: "fitSelection",
              label: "Fit Selection",
              shortcut: {
                modifiers: [
                  Ne.shift
                ],
                key: "F"
              },
              action: () => {
                const y = document.querySelector("canvas");
                if (!y || !p) return;
                const S = se.getState().selectedIds;
                if (S.size === 0) return;
                const E = p.get_bounds_for_ids([
                  ...S
                ]), k = E ? {
                  minX: E[0],
                  minY: E[1],
                  maxX: E[2],
                  maxY: E[3]
                } : null, w = Zn(y);
                ze.getState().zoomToSelected(k, w.width, w.height, w.screenCenter);
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
          const { themeSetting: p, showGrid: g } = he.getState();
          return [
            {
              id: "theme-light",
              label: `${p === "light" ? "\u2713  " : "     "}Light`,
              action: () => he.getState().setThemeSetting("light"),
              disabled: false
            },
            {
              id: "theme-dark",
              label: `${p === "dark" ? "\u2713  " : "     "}Dark`,
              action: () => he.getState().setThemeSetting("dark"),
              disabled: false
            },
            {
              id: "theme-system",
              label: `${p === "system" ? "\u2713  " : "     "}System`,
              action: () => he.getState().setThemeSetting("system"),
              disabled: false
            },
            {
              id: "sep-prefs-1",
              separator: true
            },
            {
              id: "show-grid",
              label: `${g ? "\u2713  " : "     "}Show Grid`,
              action: () => he.getState().toggleGrid(),
              disabled: false
            }
          ];
        }
      }
    ];
    return b.jsxs("div", {
      ref: c,
      className: "relative ml-auto flex-shrink-0",
      children: [
        b.jsx("button", {
          type: "button",
          onClick: () => {
            a((p) => !p), s(null);
          },
          className: q("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
          children: b.jsx("div", {
            className: "flex h-4 w-4 items-center justify-center",
            children: b.jsx(n_, {
              className: q("h-4 w-4", l ? "text-white/60" : "text-black/60")
            })
          })
        }),
        n && b.jsx("div", {
          className: q("absolute top-full right-0 z-50 mt-1 min-w-[140px] rounded-xl border py-1", l ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
          children: h.map((p) => b.jsxs("div", {
            className: "relative",
            children: [
              b.jsxs("button", {
                type: "button",
                className: q("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", i === p.id && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                onMouseEnter: () => s(p.id),
                onClick: () => s(i === p.id ? null : p.id),
                children: [
                  b.jsx("span", {
                    children: p.label
                  }),
                  b.jsx("svg", {
                    width: "12",
                    height: "12",
                    viewBox: "0 0 16 16",
                    className: "flex-shrink-0",
                    children: b.jsx("path", {
                      d: "M6 4l4 4-4 4",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1.5"
                    })
                  })
                ]
              }),
              i === p.id && b.jsx(Z3, {
                items: p.buildItems(),
                isDark: l,
                onAction: f
              })
            ]
          }, p.id))
        })
      ]
    });
  }
  function K1({ name: l, isActive: n, isDark: a, depth: i, hasChildren: s, isExpanded: c, isHidden: f, onToggleExpand: h, onSelect: p, onRename: g, startEditing: v, canDrag: y }) {
    const [S, E] = m.useState(false), [k, w] = m.useState(l), C = m.useRef(null);
    m.useEffect(() => {
      v && (E(true), w(l), ye.getState().setEditingCellName(null));
    }, [
      v,
      l
    ]), m.useEffect(() => {
      S && C.current && (C.current.focus(), C.current.select());
    }, [
      S
    ]);
    const _ = m.useCallback(() => {
      const N = k.trim();
      N && N !== l ? g(N) : w(l), E(false);
    }, [
      k,
      l,
      g
    ]), R = m.useCallback((N) => {
      N.key === "Enter" ? _() : N.key === "Escape" && (w(l), E(false));
    }, [
      _,
      l
    ]), A = m.useCallback((N) => {
      N.preventDefault(), N.stopPropagation(), Os.getState().open("cell", {
        x: N.clientX,
        y: N.clientY
      }, l);
    }, [
      l
    ]), T = m.useCallback((N) => {
      N.stopPropagation(), h();
    }, [
      h
    ]), B = m.useCallback((N) => {
      if (N.button !== 0 || !y || S) {
        y || N.preventDefault();
        return;
      }
      const L = {
        x: N.clientX,
        y: N.clientY
      };
      let U = false;
      const X = (ae) => {
        const te = ae.clientX - L.x, ce = ae.clientY - L.y;
        if (!(!U && te * te + ce * ce < 25) && !U) {
          U = true;
          const { library: ie } = Ce.getState();
          if (!ie) return;
          const Se = ie.get_cell_bounds(l) ?? null, $ = ie.get_cell_origin_by_name(l), P = {
            x: $ ? $[0] : 0,
            y: $ ? $[1] : 0
          };
          Es.getState().startDrag(l, Se, P);
        }
      }, J = () => {
        document.removeEventListener("mousemove", X), document.removeEventListener("mouseup", J);
      };
      document.addEventListener("mousemove", X), document.addEventListener("mouseup", J);
    }, [
      y,
      S,
      l
    ]);
    return b.jsxs("button", {
      type: "button",
      className: q("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center rounded-lg py-1.5 text-left transition-colors focus:outline-none", n ? a ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : a ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90"),
      style: {
        paddingLeft: `${7 + i * 10}px`,
        paddingRight: "7px"
      },
      onClick: p,
      onContextMenu: A,
      onMouseDown: B,
      tabIndex: -1,
      children: [
        s ? b.jsx("span", {
          className: "mr-0.5 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center",
          onClick: T,
          onKeyDown: (N) => {
            (N.key === "Enter" || N.key === " ") && (N.stopPropagation(), h());
          },
          children: b.jsx(G3, {
            expanded: c,
            isDark: a
          })
        }) : b.jsx("span", {
          className: "mr-0.5 h-4 w-4 flex-shrink-0"
        }),
        b.jsx("div", {
          className: "relative h-5 min-w-0 flex-1",
          children: S ? b.jsx("input", {
            ref: C,
            type: "text",
            value: k,
            onChange: (N) => w(N.target.value),
            onBlur: _,
            onKeyDown: R,
            onClick: (N) => N.stopPropagation(),
            className: q("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", a ? "text-white/90" : "text-black/90")
          }) : b.jsx("span", {
            className: q("absolute inset-0 truncate text-sm leading-5 select-none", f && "opacity-40"),
            onDoubleClick: (N) => {
              N.stopPropagation(), E(true), w(l);
            },
            children: l
          })
        })
      ]
    });
  }
  function P1({ node: l, depth: n, isDark: a, activeCell: i, editingCellName: s, expandedCells: c, hiddenCells: f, onSelect: h, onRename: p, onToggleExpand: g }) {
    const v = l.children.length > 0, y = c.has(l.name), S = l.name !== i;
    return b.jsxs(b.Fragment, {
      children: [
        b.jsx(K1, {
          name: l.name,
          isActive: l.name === i,
          isDark: a,
          depth: n,
          hasChildren: v,
          isExpanded: y,
          isHidden: f.has(l.name),
          onToggleExpand: () => g(l.name),
          onSelect: () => h(l.name),
          onRename: (E) => p(l.name, E),
          startEditing: s === l.name,
          canDrag: S
        }),
        v && y && l.children.map((E) => b.jsx(P1, {
          node: E,
          depth: n + 1,
          isDark: a,
          activeCell: i,
          editingCellName: s,
          expandedCells: c,
          hiddenCells: f,
          onSelect: h,
          onRename: p,
          onToggleExpand: g
        }, `${l.name}/${E.name}`))
      ]
    });
  }
  function P3({ isDark: l, onExpand: n }) {
    return b.jsxs("div", {
      className: q("fixed top-4 left-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border pt-[4.5px] pb-[5px]", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: [
        b.jsx("div", {
          className: "p-1",
          children: b.jsx("img", {
            src: "/icon.svg",
            alt: "",
            draggable: false,
            className: q("h-5 w-5 select-none pointer-events-none rounded border", l ? "border-white/40" : "border-black/40")
          })
        }),
        b.jsx("div", {
          className: q("mx-1 h-px w-5", l ? "bg-white/10" : "bg-black/10")
        }),
        b.jsx("button", {
          type: "button",
          onClick: n,
          className: q("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          children: b.jsx(B1, {
            className: q("h-4 w-4", l ? "text-white/60" : "text-black/60")
          })
        })
      ]
    });
  }
  function Wb() {
    const n = he((z) => z.theme) === "dark", a = he((z) => z.explorerCollapsed), i = he((z) => z.toggleExplorerCollapsed), s = he((z) => z.explorerWidth), c = he((z) => z.setExplorerWidth), { isSm: f } = Bf(), { handleProps: h } = G1({
      side: "left",
      width: s,
      onResize: c
    }), p = ye((z) => z.projectName), g = ye((z) => z.setProjectName), v = ye((z) => z.cells), y = ye((z) => z.cellTree), S = ye((z) => z.activeCell), E = ye((z) => z.setActiveCell), k = ye((z) => z.editingCellName), w = ye((z) => z.expandedCells), C = ye((z) => z.toggleExpanded), _ = ye((z) => z.cellsLoaded), R = ye((z) => z.hierarchyLevelLimit), A = ye((z) => z.setHierarchyLevelLimit), T = ye((z) => z.maxTreeDepth), B = ye((z) => z.hiddenCells), [N, L] = m.useState(false), U = m.useRef(null);
    m.useEffect(() => {
      if (!f || !N) return;
      const z = (O) => {
        U.current && !U.current.contains(O.target) && L(false);
      };
      return document.addEventListener("mousedown", z), () => document.removeEventListener("mousedown", z);
    }, [
      f,
      N
    ]);
    const X = (z, O) => z === 1 / 0 ? O > 0 ? O.toString() : "" : z.toString(), [J, ae] = m.useState(X(R, T));
    m.useEffect(() => {
      ae(X(R, T));
    }, [
      R,
      T
    ]);
    const [te, ce] = m.useState(false), [ie, Se] = m.useState(p), $ = m.useRef(null);
    m.useEffect(() => {
      te && $.current && ($.current.focus(), $.current.select());
    }, [
      te
    ]);
    const P = m.useCallback(() => {
      const z = ie.trim();
      z && z !== p ? g(z) : Se(p), ce(false);
    }, [
      ie,
      p,
      g
    ]), ue = m.useCallback((z) => {
      z.key === "Enter" ? P() : z.key === "Escape" && (Se(p), ce(false));
    }, [
      P,
      p
    ]), xe = m.useCallback((z, O) => {
      const { library: Y, renderer: Q } = Ce.getState();
      if (Y && Q) {
        const W = new Av(z, O);
        fe.getState().execute(W, {
          library: Y,
          renderer: Q
        });
      } else ye.getState().renameCell(z, O);
    }, []), be = m.useCallback((z) => {
      z === S && v.length <= 1 || E(z === S ? null : z);
    }, [
      S,
      v.length,
      E
    ]), j = m.useCallback(() => {
      f ? L(true) : i();
    }, [
      f,
      i
    ]);
    if (a && !(f && N)) return b.jsx(P3, {
      isDark: n,
      onExpand: j
    });
    const D = f && N;
    return b.jsxs(b.Fragment, {
      children: [
        D && b.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        b.jsxs("div", {
          ref: U,
          className: q("fixed top-4 left-4 z-40 rounded-xl border transition-opacity duration-200", _ ? "opacity-100" : "pointer-events-none opacity-0", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", D && "shadow-xl"),
          style: {
            width: s
          },
          children: [
            b.jsx("div", {
              ...h
            }),
            b.jsxs("div", {
              className: "flex items-center gap-1 px-1 pt-1 pb-[3px]",
              children: [
                b.jsx("div", {
                  className: "flex-shrink-0 p-1",
                  children: b.jsx("img", {
                    src: "/icon.svg",
                    alt: "",
                    draggable: false,
                    className: q("h-5 w-5 select-none pointer-events-none rounded border", n ? "border-white/40" : "border-black/40")
                  })
                }),
                b.jsx("div", {
                  className: "relative h-5 min-w-0 flex-1",
                  children: te ? b.jsx("input", {
                    ref: $,
                    type: "text",
                    value: ie,
                    onChange: (z) => Se(z.target.value),
                    onBlur: P,
                    onKeyDown: ue,
                    onClick: (z) => z.stopPropagation(),
                    className: q("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-xs font-medium leading-5 outline-none focus:ring-0", n ? "text-white/90" : "text-black/90")
                  }) : b.jsx("button", {
                    type: "button",
                    className: q("absolute inset-0 cursor-text truncate border-0 bg-transparent p-0 text-left text-xs font-medium leading-5 select-none focus:outline-none", n ? "text-white/60" : "text-black/60"),
                    onClick: () => {
                      Se(p), ce(true);
                    },
                    children: p
                  })
                }),
                !f && b.jsx("button", {
                  type: "button",
                  onClick: i,
                  className: q("flex-shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: b.jsx(m_, {
                    className: q("h-4 w-4", n ? "text-white/60" : "text-black/60")
                  })
                }),
                b.jsx(K3, {
                  isDark: n
                })
              ]
            }),
            b.jsx("div", {
              className: q("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            b.jsx("div", {
              className: "flex flex-col gap-0.5 overflow-y-auto py-1",
              style: {
                maxHeight: "calc(100vh - 176px)"
              },
              onWheel: (z) => z.stopPropagation(),
              children: y ? y.map((z) => b.jsx(P1, {
                node: z,
                depth: 0,
                isDark: n,
                activeCell: S,
                editingCellName: k,
                expandedCells: w,
                hiddenCells: B,
                onSelect: be,
                onRename: xe,
                onToggleExpand: C
              }, z.name)) : v.map((z) => b.jsx(K1, {
                name: z,
                isActive: z === S,
                isDark: n,
                depth: 0,
                hasChildren: false,
                isExpanded: false,
                isHidden: B.has(z),
                onToggleExpand: () => {
                },
                onSelect: () => be(z),
                onRename: (O) => xe(z, O),
                startEditing: k === z,
                canDrag: z !== S
              }, z))
            }),
            b.jsx("div", {
              className: q("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            b.jsxs("div", {
              className: "flex items-center justify-between pl-2 pr-[5.5px] py-1.5",
              children: [
                b.jsx("span", {
                  className: q("text-xs select-none pointer-events-none", n ? "text-white/40" : "text-black/40"),
                  children: "Level"
                }),
                b.jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [
                    b.jsx("input", {
                      id: "hierarchy-level-input",
                      type: "number",
                      min: "1",
                      max: T,
                      value: J,
                      onChange: (z) => {
                        const O = z.target.value;
                        ae(O);
                        const Y = parseInt(O, 10);
                        !isNaN(Y) && Y >= 1 && A(Y);
                      },
                      onBlur: () => {
                        const z = parseInt(J, 10) || T, O = Math.max(1, Math.min(z, T));
                        A(O), ae(O.toString());
                      },
                      onKeyDown: (z) => {
                        if (z.key === "Enter") {
                          const O = parseInt(J, 10) || T, Y = Math.max(1, Math.min(O, T));
                          A(Y), ae(Y.toString()), z.currentTarget.blur();
                        } else z.key === "Escape" && z.currentTarget.blur();
                      },
                      className: q("h-6 w-12 rounded-lg border px-2 text-xs tabular-nums outline-none", n ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
                    }),
                    b.jsx(Nn, {
                      label: "All levels",
                      position: "bottom",
                      children: b.jsx("button", {
                        type: "button",
                        onClick: () => A(1 / 0),
                        className: q("flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border transition-colors", n ? "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/90" : "border-black/10 bg-black/5 text-black/40 hover:bg-black/10 hover:text-black/90"),
                        children: b.jsxs("svg", {
                          width: "14",
                          height: "14",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          children: [
                            b.jsx("polygon", {
                              points: "12 2 2 7 12 12 22 7 12 2"
                            }),
                            b.jsx("polyline", {
                              points: "2 17 12 22 22 17"
                            }),
                            b.jsx("polyline", {
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
  function Q3(l, n) {
    if (l.length < 4) return null;
    let a = l[0], i = l[1], s = l[2], c = l[3];
    if (!Number.isFinite(a) || !Number.isFinite(i) || !Number.isFinite(s) || !Number.isFinite(c)) return null;
    const f = Math.max((s - a) * 0.05, (c - i) * 0.05, 1);
    a -= f, i -= f, s += f, c += f;
    const h = s - a, p = c - i, g = n / h, v = n / p, y = Math.min(g, v), S = h * y, E = p * y, k = (n - S) / 2, w = (n - E) / 2;
    return {
      minX: a,
      minY: i,
      maxX: s,
      maxY: c,
      width: h,
      height: p,
      scale: y,
      offsetX: k,
      offsetY: w
    };
  }
  function As(l, n, a) {
    return {
      x: (l - a.minX) * a.scale + a.offsetX,
      y: (n - a.minY) * a.scale + a.offsetY
    };
  }
  function F3(l, n, a) {
    return {
      x: a.minX + (l - a.offsetX) / a.scale,
      y: a.minY + (n - a.offsetY) / a.scale
    };
  }
  function W3(l, n, a) {
    for (const [, i, s] of a) {
      if (i.length < 3) continue;
      const c = Math.round(s[0] * 255), f = Math.round(s[1] * 255), h = Math.round(s[2] * 255), p = s[3];
      l.fillStyle = `rgba(${c},${f},${h},${p})`, l.beginPath();
      const g = As(i[0][0], i[0][1], n);
      l.moveTo(g.x, g.y);
      for (let v = 1; v < i.length; v++) {
        const y = As(i[v][0], i[v][1], n);
        l.lineTo(y.x, y.y);
      }
      l.closePath(), l.fill();
    }
  }
  function J3(l, n, a, i, s, c, f) {
    const h = -a.x / i, p = -a.y / i, g = h + s / i, v = p + c / i, y = As(h, p, n), S = As(g, v, n), E = y.x, k = y.y, w = S.x - y.x, C = S.y - y.y;
    l.strokeStyle = f.viewportStroke, l.lineWidth = 1.5, l.setLineDash([
      3,
      3
    ]), l.strokeRect(E, k, w, C), l.fillStyle = f.viewportFill, l.fillRect(E, k, w, C), l.setLineDash([]);
  }
  function eM(l) {
    return {
      canvasBg: l ? "rgb(29,29,29)" : "rgb(241,241,241)",
      viewportStroke: l ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
      viewportFill: l ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    };
  }
  const An = 180;
  function Jb() {
    const l = m.useRef(null), n = m.useRef(null), a = m.useRef(null), i = m.useRef(null), [s, c] = m.useState(false), f = ze((L) => L.zoom), h = ze((L) => L.offset), p = he((L) => L.theme), g = Ce((L) => L.library), v = me((L) => L.layers), y = Do((L) => L.isMinimized), S = fe((L) => L.undoStack.length), E = fe((L) => L.redoStack.length), k = p === "dark", w = m.useMemo(() => eM(k), [
      k
    ]);
    m.useEffect(() => {
      const L = l.current;
      if (!L) return;
      const U = (X) => {
        const J = document.getElementById("rosette-canvas");
        J && (X.preventDefault(), J.dispatchEvent(new WheelEvent("wheel", X)));
      };
      return L.addEventListener("wheel", U, {
        passive: false
      }), () => L.removeEventListener("wheel", U);
    }, []);
    const C = m.useCallback(() => {
      var _a;
      return ((_a = document.getElementById("rosette-canvas")) == null ? void 0 : _a.getBoundingClientRect()) ?? null;
    }, []), _ = m.useCallback((L) => {
      var _a;
      const U = i.current;
      if (!U) return;
      const X = (_a = n.current) == null ? void 0 : _a.getBoundingClientRect();
      if (!X) return;
      const J = L.clientX - X.left, ae = L.clientY - X.top, te = F3(J, ae, U), ce = C();
      if (!ce) return;
      const ie = -(te.x * f) + ce.width / 2, Se = -(te.y * f) + ce.height / 2;
      ze.getState().setOffset(ie, Se);
    }, [
      f,
      C
    ]), R = m.useCallback((L) => {
      L.stopPropagation(), c(true), _(L);
    }, [
      _
    ]), A = m.useCallback((L) => {
      s && _(L);
    }, [
      s,
      _
    ]), T = m.useCallback(() => {
      c(false);
    }, []), B = m.useCallback(() => {
      c(false);
    }, []);
    if (m.useEffect(() => {
      if (y || !g) return;
      const L = g.get_all_bounds();
      if (!L) {
        i.current = null, a.current = null;
        return;
      }
      const U = Q3(L, An);
      if (!U) {
        i.current = null, a.current = null;
        return;
      }
      i.current = U;
      let X;
      try {
        X = g.get_render_polygons();
      } catch {
        a.current = null;
        return;
      }
      if (!X || X.length === 0) {
        a.current = null;
        return;
      }
      const J = /* @__PURE__ */ new Set();
      for (const [, ie] of v) ie.visible || J.add(`${ie.layerNumber}:${ie.datatype}`);
      let ae = X;
      J.size > 0 && (ae = X.filter(([ie]) => {
        const Se = g.get_element_info(ie);
        if (!Se) return true;
        const $ = `${Se.layer}:${Se.datatype}`, P = J.has($);
        return Se.free(), !P;
      }));
      const te = document.createElement("canvas");
      te.width = An, te.height = An;
      const ce = te.getContext("2d");
      ce && (ce.clearRect(0, 0, An, An), W3(ce, U, ae), a.current = te);
    }, [
      g,
      v,
      y,
      S,
      E
    ]), m.useEffect(() => {
      if (y) return;
      const L = n.current;
      if (!L) return;
      const U = L.getContext("2d");
      if (!U) return;
      const X = i.current;
      if (U.clearRect(0, 0, An, An), U.fillStyle = w.canvasBg, U.fillRect(0, 0, An, An), a.current && U.drawImage(a.current, 0, 0), X) {
        const J = C();
        J && J.width > 0 && J.height > 0 && J3(U, X, h, f, J.width, J.height, w);
      }
    }, [
      f,
      h,
      y,
      w,
      C,
      S,
      E
    ]), y) return null;
    const N = `rounded-xl border p-1 ${k ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"}`;
    return b.jsx("div", {
      className: "pointer-events-none absolute bottom-4 right-4 select-none",
      children: b.jsx("div", {
        ref: l,
        className: `pointer-events-auto relative ${N}`,
        children: b.jsx("canvas", {
          ref: n,
          width: An,
          height: An,
          className: "pointer-events-auto cursor-move rounded-lg",
          onMouseDown: R,
          onMouseMove: A,
          onMouseUp: T,
          onMouseLeave: B
        })
      })
    });
  }
  const tM = Ao, nM = [
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
  function lM({ pattern: l, className: n }) {
    return b.jsxs("svg", {
      width: 14,
      height: 14,
      viewBox: "0 0 14 14",
      className: n,
      children: [
        b.jsx("rect", {
          x: "0",
          y: "0",
          width: 14,
          height: 14,
          fill: "currentColor",
          opacity: "0.15",
          rx: "1"
        }),
        l === "solid" && b.jsx("rect", {
          x: "1",
          y: "1",
          width: 12,
          height: 12,
          fill: "currentColor",
          opacity: "0.5",
          rx: "0.5"
        }),
        l === "hatched" && b.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            b.jsx("line", {
              x1: "0",
              y1: "4",
              x2: "4",
              y2: "0"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "9",
              x2: "9",
              y2: "0"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "14",
              x2: "14",
              y2: "0"
            }),
            b.jsx("line", {
              x1: "5",
              y1: "14",
              x2: "14",
              y2: "5"
            }),
            b.jsx("line", {
              x1: "10",
              y1: "14",
              x2: "14",
              y2: "10"
            })
          ]
        }),
        l === "crosshatched" && b.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            b.jsx("line", {
              x1: "0",
              y1: "4",
              x2: "4",
              y2: "0"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "9",
              x2: "9",
              y2: "0"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "14",
              x2: "14",
              y2: "0"
            }),
            b.jsx("line", {
              x1: "5",
              y1: "14",
              x2: "14",
              y2: "5"
            }),
            b.jsx("line", {
              x1: "10",
              y1: "14",
              x2: "14",
              y2: "10"
            }),
            b.jsx("line", {
              x1: "10",
              y1: "0",
              x2: "14",
              y2: "4"
            }),
            b.jsx("line", {
              x1: "5",
              y1: "0",
              x2: "14",
              y2: "9"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "0",
              x2: "14",
              y2: "14"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "5",
              x2: "9",
              y2: "14"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "10",
              x2: "4",
              y2: "14"
            })
          ]
        }),
        l === "dotted" && b.jsxs("g", {
          fill: "currentColor",
          opacity: "0.6",
          children: [
            b.jsx("circle", {
              cx: "3.5",
              cy: "3.5",
              r: "1"
            }),
            b.jsx("circle", {
              cx: "10.5",
              cy: "3.5",
              r: "1"
            }),
            b.jsx("circle", {
              cx: "3.5",
              cy: "10.5",
              r: "1"
            }),
            b.jsx("circle", {
              cx: "10.5",
              cy: "10.5",
              r: "1"
            }),
            b.jsx("circle", {
              cx: "7",
              cy: "7",
              r: "1"
            })
          ]
        }),
        l === "horizontal" && b.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            b.jsx("line", {
              x1: "0",
              y1: "3.5",
              x2: "14",
              y2: "3.5"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "7",
              x2: "14",
              y2: "7"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "10.5",
              x2: "14",
              y2: "10.5"
            })
          ]
        }),
        l === "vertical" && b.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            b.jsx("line", {
              x1: "3.5",
              y1: "0",
              x2: "3.5",
              y2: "14"
            }),
            b.jsx("line", {
              x1: "7",
              y1: "0",
              x2: "7",
              y2: "14"
            }),
            b.jsx("line", {
              x1: "10.5",
              y1: "0",
              x2: "10.5",
              y2: "14"
            })
          ]
        }),
        l === "zigzag" && b.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          fill: "none",
          children: [
            b.jsx("polyline", {
              points: "0,5 3.5,2 7,5 10.5,2 14,5"
            }),
            b.jsx("polyline", {
              points: "0,10 3.5,7 7,10 10.5,7 14,10"
            })
          ]
        }),
        l === "brick" && b.jsxs("g", {
          stroke: "currentColor",
          strokeWidth: "1",
          opacity: "0.6",
          children: [
            b.jsx("line", {
              x1: "0",
              y1: "3.5",
              x2: "14",
              y2: "3.5"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "7",
              x2: "14",
              y2: "7"
            }),
            b.jsx("line", {
              x1: "0",
              y1: "10.5",
              x2: "14",
              y2: "10.5"
            }),
            b.jsx("line", {
              x1: "3.5",
              y1: "0",
              x2: "3.5",
              y2: "3.5"
            }),
            b.jsx("line", {
              x1: "10.5",
              y1: "0",
              x2: "10.5",
              y2: "3.5"
            }),
            b.jsx("line", {
              x1: "7",
              y1: "3.5",
              x2: "7",
              y2: "7"
            }),
            b.jsx("line", {
              x1: "3.5",
              y1: "7",
              x2: "3.5",
              y2: "10.5"
            }),
            b.jsx("line", {
              x1: "10.5",
              y1: "7",
              x2: "10.5",
              y2: "10.5"
            }),
            b.jsx("line", {
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
  function rM({ color: l, isDark: n, onChange: a, hexTabIdx: i }) {
    const [s, c] = m.useState(l), f = m.useRef(null);
    m.useEffect(() => {
      c(l);
    }, [
      l
    ]);
    const h = m.useCallback(() => {
      const g = s.trim().replace(/^#?/, "#");
      /^#[0-9a-fA-F]{6}$/.test(g) ? a(g.toLowerCase()) : c(l);
    }, [
      s,
      l,
      a
    ]), p = m.useCallback((g) => {
      var _a, _b2;
      g.key === "Enter" ? (g.preventDefault(), (_a = f.current) == null ? void 0 : _a.blur()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), c(l), (_b2 = f.current) == null ? void 0 : _b2.blur());
    }, [
      l
    ]);
    return b.jsxs("div", {
      className: "flex flex-col gap-1.5",
      children: [
        b.jsx("div", {
          className: "grid grid-cols-8 gap-1",
          children: tM.map((g) => b.jsx("button", {
            type: "button",
            onClick: (v) => {
              v.stopPropagation(), a(g);
            },
            className: q("h-5 w-full rounded border outline-none transition-all", g === l ? "ring-1 ring-offset-1 " + (n ? "ring-white/60 ring-offset-[rgb(29,29,29)]" : "ring-black/60 ring-offset-[rgb(241,241,241)]") : n ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30"),
            style: {
              backgroundColor: g
            },
            tabIndex: -1
          }, g))
        }),
        b.jsxs("div", {
          className: "flex items-center gap-1.5",
          children: [
            b.jsx("div", {
              className: q("h-5 w-5 flex-shrink-0 rounded border", n ? "border-white/10" : "border-black/10"),
              style: {
                backgroundColor: l
              }
            }),
            b.jsx("input", {
              ref: f,
              type: "text",
              value: s,
              "data-tab-index": i,
              onChange: (g) => c(g.target.value),
              onBlur: h,
              onKeyDown: p,
              onClick: (g) => g.stopPropagation(),
              tabIndex: -1,
              className: q("h-6 min-w-0 flex-1 rounded border px-1.5 font-mono text-xs outline-none", n ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
            })
          ]
        })
      ]
    });
  }
  function aM({ value: l, isDark: n, onChange: a, baseTabIdx: i }) {
    return b.jsx("div", {
      className: "grid grid-cols-4 gap-1",
      children: nM.map((s, c) => {
        const f = l === s.id;
        return b.jsx("button", {
          type: "button",
          "data-tab-index": i != null ? i + c : void 0,
          onClick: (h) => {
            h.stopPropagation(), a(s.id);
          },
          className: q("flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1 text-[10px] outline-none transition-colors", f ? n ? "border-white/20 bg-white/10 text-white/90" : "border-black/20 bg-black/10 text-black/90" : n ? "border-white/5 text-white/40 hover:border-white/15 hover:text-white/70 focus:border-white/15 focus:text-white/70" : "border-black/5 text-black/40 hover:border-black/15 hover:text-black/70 focus:border-black/15 focus:text-black/70"),
          tabIndex: -1,
          children: b.jsx(lM, {
            pattern: s.id
          })
        }, s.id);
      })
    });
  }
  function ev({ label: l, value: n, isDark: a, onChange: i, tabIdx: s }) {
    const [c, f] = m.useState(String(n)), [h, p] = m.useState(false), g = m.useRef(null);
    m.useEffect(() => {
      h || f(String(n));
    }, [
      n,
      h
    ]);
    const v = m.useCallback(() => {
      const y = Number.parseInt(c, 10);
      !Number.isNaN(y) && y >= 0 && y <= af && y !== n ? i(y) : f(String(n));
    }, [
      c,
      n,
      i
    ]);
    return b.jsxs("div", {
      className: "flex items-center justify-between",
      children: [
        b.jsx("span", {
          className: q("text-xs select-none", a ? "text-white/50" : "text-black/50"),
          children: l
        }),
        b.jsx("input", {
          ref: g,
          type: "text",
          value: c,
          "data-tab-index": s,
          onChange: (y) => f(y.target.value),
          onFocus: (y) => {
            p(true), y.target.select();
          },
          onBlur: () => {
            p(false), v();
          },
          onKeyDown: (y) => {
            var _a, _b2;
            y.key === "Enter" ? (y.preventDefault(), (_a = g.current) == null ? void 0 : _a.blur()) : y.key === "Escape" && (y.preventDefault(), y.stopPropagation(), f(String(n)), (_b2 = g.current) == null ? void 0 : _b2.blur());
          },
          onClick: (y) => y.stopPropagation(),
          tabIndex: -1,
          className: q("w-16 cursor-text rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors", h ? a ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : a ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function oM({ label: l, value: n, isDark: a, onChange: i, tabIdx: s }) {
    const [c, f] = m.useState(n), [h, p] = m.useState(false), g = m.useRef(null);
    m.useEffect(() => {
      h || f(n);
    }, [
      n,
      h
    ]);
    const v = m.useCallback(() => {
      const y = c.trim();
      y && y !== n ? i(y) : f(n);
    }, [
      c,
      n,
      i
    ]);
    return b.jsxs("div", {
      className: "flex items-center justify-between",
      children: [
        b.jsx("span", {
          className: q("text-xs select-none", a ? "text-white/50" : "text-black/50"),
          children: l
        }),
        b.jsx("input", {
          ref: g,
          type: "text",
          value: c,
          "data-tab-index": s,
          onChange: (y) => f(y.target.value),
          onFocus: (y) => {
            p(true), y.target.select();
          },
          onBlur: () => {
            p(false), v();
          },
          onKeyDown: (y) => {
            var _a, _b2;
            y.key === "Enter" ? (y.preventDefault(), (_a = g.current) == null ? void 0 : _a.blur()) : y.key === "Escape" && (y.preventDefault(), y.stopPropagation(), f(n), (_b2 = g.current) == null ? void 0 : _b2.blur());
          },
          onClick: (y) => y.stopPropagation(),
          tabIndex: -1,
          className: q("w-28 cursor-text truncate rounded border px-1.5 py-0.5 text-right text-xs outline-none transition-colors", h ? a ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : a ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function ef({ label: l, isDark: n }) {
    return b.jsx("span", {
      className: q("text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function iM({ layer: l, isDark: n }) {
    const a = Ce((h) => h.library), i = Ce((h) => h.renderer), s = m.useRef(null), c = m.useCallback((h) => {
      if (!a || !i) return;
      const p = {
        ...l,
        ...h
      };
      if (h.layerNumber !== void 0 || h.datatype !== void 0) {
        for (const v of me.getState().layers.values()) if (v.id !== l.id && v.layerNumber === p.layerNumber && v.datatype === p.datatype) {
          $t.getState().show(`Layer ${p.layerNumber}/${p.datatype} already exists`, "warn");
          return;
        }
      }
      const g = new jv(l, p);
      fe.getState().execute(g, {
        library: a,
        renderer: i
      });
    }, [
      l,
      a,
      i
    ]);
    m.useEffect(() => {
      const h = requestAnimationFrame(() => {
        var _a, _b2;
        (_b2 = (_a = s.current) == null ? void 0 : _a.querySelector("[data-tab-index='0']")) == null ? void 0 : _b2.focus();
      });
      return () => cancelAnimationFrame(h);
    }, []), m.useEffect(() => {
      const h = (p) => {
        var _a;
        if (p.key === "Escape") {
          const g = document.activeElement;
          if (g && ((_a = s.current) == null ? void 0 : _a.contains(g)) && g.tagName === "INPUT") return;
          p.preventDefault(), me.getState().setExpandedLayerId(null);
        }
      };
      return document.addEventListener("keydown", h), () => document.removeEventListener("keydown", h);
    }, []), m.useEffect(() => {
      const h = (p) => {
        s.current && !s.current.contains(p.target) && me.getState().setExpandedLayerId(null);
      };
      return document.addEventListener("mousedown", h), () => document.removeEventListener("mousedown", h);
    }, []);
    const f = m.useCallback((h) => {
      if (h.key === "Escape" || (h.stopPropagation(), h.key !== "Tab" || !s.current)) return;
      h.preventDefault();
      const p = Array.from(s.current.querySelectorAll("[data-tab-index]")).sort((S, E) => Number(S.dataset.tabIndex) - Number(E.dataset.tabIndex));
      if (p.length === 0) return;
      const g = p.findIndex((S) => S === document.activeElement), v = h.shiftKey ? -1 : 1, y = g === -1 ? 0 : (g + v + p.length) % p.length;
      p[y].focus();
    }, []);
    return b.jsxs("div", {
      ref: s,
      role: "group",
      className: "mx-1 flex w-[calc(100%-8px)] flex-col gap-2 px-2.5 py-2",
      onClick: (h) => h.stopPropagation(),
      onKeyDown: f,
      onMouseDown: (h) => h.stopPropagation(),
      children: [
        b.jsx(oM, {
          label: "Name",
          value: l.name,
          isDark: n,
          onChange: (h) => c({
            name: h
          }),
          tabIdx: 0
        }),
        b.jsx("div", {
          className: q("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        b.jsxs("div", {
          className: "flex flex-col gap-1.5",
          children: [
            b.jsx(ef, {
              label: "Color",
              isDark: n
            }),
            b.jsx(rM, {
              color: l.color,
              isDark: n,
              onChange: (h) => c({
                color: h
              }),
              hexTabIdx: 1
            })
          ]
        }),
        b.jsx("div", {
          className: q("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        b.jsxs("div", {
          className: "flex flex-col gap-1",
          children: [
            b.jsx(ef, {
              label: "GDS",
              isDark: n
            }),
            b.jsx(ev, {
              label: "Layer",
              value: l.layerNumber,
              isDark: n,
              onChange: (h) => c({
                layerNumber: h
              }),
              tabIdx: 2
            }),
            b.jsx(ev, {
              label: "Datatype",
              value: l.datatype,
              isDark: n,
              onChange: (h) => c({
                datatype: h
              }),
              tabIdx: 3
            })
          ]
        }),
        b.jsx("div", {
          className: q("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        b.jsxs("div", {
          className: "flex flex-col gap-1.5",
          children: [
            b.jsx(ef, {
              label: "Fill",
              isDark: n
            }),
            b.jsx(aM, {
              value: l.fillPattern,
              isDark: n,
              onChange: (h) => c({
                fillPattern: h
              }),
              baseTabIdx: 4
            })
          ]
        })
      ]
    });
  }
  function sM({ layer: l, isActive: n, isExpanded: a, isDark: i, onSelect: s, onToggleExpand: c, startEditing: f }) {
    const [h, p] = m.useState(false), [g, v] = m.useState(l.name), y = m.useRef(null);
    m.useEffect(() => {
      f && (p(true), v(l.name), me.getState().setEditingLayerId(null));
    }, [
      f,
      l.name
    ]), m.useEffect(() => {
      h && y.current && (y.current.focus(), y.current.select());
    }, [
      h
    ]);
    const S = Ce((R) => R.library), E = Ce((R) => R.renderer), k = m.useCallback(() => {
      const R = g.trim();
      if (R && R !== l.name && S && E) {
        const A = new jv(l, {
          ...l,
          name: R
        });
        fe.getState().execute(A, {
          library: S,
          renderer: E
        });
      } else v(l.name);
      p(false);
    }, [
      g,
      l,
      S,
      E
    ]), w = m.useCallback((R) => {
      R.key === "Enter" ? k() : R.key === "Escape" && (v(l.name), p(false));
    }, [
      k,
      l.name
    ]), C = m.useCallback((R) => {
      R.preventDefault(), R.stopPropagation(), Os.getState().open("layer", {
        x: R.clientX,
        y: R.clientY
      }, String(l.id));
    }, [
      l.id
    ]), _ = m.useCallback((R) => {
      R.stopPropagation(), s(), c();
    }, [
      s,
      c
    ]);
    return b.jsxs("div", {
      className: "flex flex-col gap-0.5",
      children: [
        b.jsxs("button", {
          type: "button",
          className: q("group relative mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-[7px] py-1.5 text-left transition-colors", n ? i ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : i ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90"),
          onClick: s,
          onContextMenu: C,
          onMouseDown: (R) => R.preventDefault(),
          tabIndex: -1,
          children: [
            b.jsx("span", {
              role: "img",
              className: q("h-4.5 w-4.5 flex-shrink-0 cursor-pointer rounded border outline-none transition-shadow", i ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30", !l.visible && "opacity-40"),
              style: {
                backgroundColor: l.color
              },
              onClick: _,
              onKeyDown: () => {
              }
            }),
            b.jsx("div", {
              className: "relative h-5 min-w-0 flex-1",
              children: h ? b.jsx("input", {
                ref: y,
                type: "text",
                value: g,
                onChange: (R) => v(R.target.value),
                onBlur: k,
                onKeyDown: w,
                onClick: (R) => R.stopPropagation(),
                className: q("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", i ? "text-white/90" : "text-gray-900")
              }) : b.jsx("span", {
                className: q("absolute inset-0 truncate text-sm leading-5 select-none", !l.visible && "opacity-40"),
                onDoubleClick: (R) => {
                  R.stopPropagation(), p(true);
                },
                children: l.name
              })
            }),
            b.jsxs("div", {
              className: q("flex flex-shrink-0 items-center self-center font-mono text-xs", !l.visible && "opacity-40"),
              children: [
                b.jsx("span", {
                  className: "select-none",
                  children: l.layerNumber
                }),
                b.jsx("span", {
                  className: "px-0.5 opacity-50 select-none",
                  children: "/"
                }),
                b.jsx("span", {
                  className: "select-none",
                  children: l.datatype
                })
              ]
            })
          ]
        }),
        a && b.jsx(iM, {
          layer: l,
          isDark: i
        })
      ]
    });
  }
  function cM() {
    const n = he((y) => y.theme) === "dark", { getAllLayers: a, activeLayerId: i, setActiveLayer: s } = me(), c = me((y) => y.editingLayerId), f = me((y) => y.expandedLayerId), h = me((y) => y.setExpandedLayerId), p = a(), g = m.useRef(null), v = m.useCallback((y) => {
      const S = me.getState().expandedLayerId;
      h(S === y ? null : y);
    }, [
      h
    ]);
    return b.jsx("div", {
      className: "flex h-full flex-col",
      children: b.jsx("div", {
        ref: g,
        className: "flex flex-1 flex-col gap-0.5 overflow-y-auto py-1",
        onWheel: (y) => y.stopPropagation(),
        children: p.map((y) => b.jsx(sM, {
          layer: y,
          isActive: y.id === i,
          isExpanded: f === y.id,
          isDark: n,
          onSelect: () => s(y.id),
          onToggleExpand: () => v(y.id),
          startEditing: c === y.id
        }, y.id))
      })
    });
  }
  function Vt({ label: l, value: n, unit: a, isDark: i, onChange: s, readOnly: c }) {
    const [f, h] = m.useState(false), [p, g] = m.useState(n), v = m.useRef(null), y = m.useRef(false), S = m.useRef(true);
    m.useEffect(() => (S.current = true, () => {
      S.current = false;
    }), []), m.useEffect(() => {
      f || g(n);
    }, [
      n,
      f
    ]), m.useEffect(() => {
      f && v.current && (v.current.focus(), v.current.select());
    }, [
      f
    ]);
    const E = m.useCallback(() => {
      if (y.current) {
        y.current = false, h(false);
        return;
      }
      if (!S.current) return;
      const w = Number.parseFloat(p);
      !Number.isNaN(w) && s && s(w), h(false);
    }, [
      p,
      s
    ]), k = m.useCallback((w) => {
      var _a, _b2;
      w.key === "Enter" ? (w.preventDefault(), (_a = v.current) == null ? void 0 : _a.blur()) : w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), y.current = true, g(n), (_b2 = v.current) == null ? void 0 : _b2.blur());
    }, [
      n
    ]);
    return b.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      "data-field": l,
      children: [
        b.jsx("span", {
          className: q("text-xs select-none", c ? i ? "text-white/30" : "text-black/30" : i ? "text-white/50" : "text-black/50"),
          children: l
        }),
        b.jsxs("div", {
          className: "flex items-center gap-1",
          children: [
            f && !c ? b.jsx("input", {
              ref: v,
              type: "text",
              value: p,
              onChange: (w) => g(w.target.value),
              onBlur: E,
              onKeyDown: k,
              onClick: (w) => w.stopPropagation(),
              className: q("w-20 rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none", i ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
            }) : b.jsx("button", {
              type: "button",
              onClick: () => {
                !c && s && h(true);
              },
              onFocus: () => {
                !c && s && h(true);
              },
              className: q("w-20 rounded border border-transparent px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors", c ? i ? "text-white/30" : "text-black/30" : i ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
              tabIndex: c ? -1 : 0,
              children: n
            }),
            a && b.jsx("span", {
              className: q("w-6 text-xs select-none", c ? i ? "text-white/20" : "text-black/20" : i ? "text-white/40" : "text-black/40"),
              children: a
            })
          ]
        })
      ]
    });
  }
  function uM({ label: l, value: n, isDark: a, onChange: i }) {
    const [s, c] = m.useState(false), [f, h] = m.useState(n), p = m.useRef(null), g = m.useRef(false), v = m.useRef(true);
    m.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), m.useEffect(() => {
      s || h(n);
    }, [
      n,
      s
    ]), m.useEffect(() => {
      s && p.current && (p.current.focus(), p.current.select());
    }, [
      s
    ]);
    const y = m.useCallback(() => {
      if (g.current) {
        g.current = false, c(false);
        return;
      }
      if (!v.current) return;
      const E = f.trim();
      E && E !== n && i(E), c(false);
    }, [
      f,
      n,
      i
    ]), S = m.useCallback((E) => {
      var _a, _b2;
      E.key === "Enter" ? (E.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : E.key === "Escape" && (E.preventDefault(), E.stopPropagation(), g.current = true, h(n), (_b2 = p.current) == null ? void 0 : _b2.blur());
    }, [
      n
    ]);
    return b.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      "data-field": l,
      children: [
        b.jsx("span", {
          className: q("text-xs select-none", a ? "text-white/50" : "text-black/50"),
          children: l
        }),
        s ? b.jsx("input", {
          ref: p,
          type: "text",
          value: f,
          onChange: (E) => h(E.target.value),
          onBlur: y,
          onKeyDown: S,
          onClick: (E) => E.stopPropagation(),
          className: q("w-32 rounded border px-1.5 py-0.5 text-right text-xs outline-none", a ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
        }) : b.jsx("button", {
          type: "button",
          onClick: () => c(true),
          onFocus: () => c(true),
          className: q("w-32 truncate rounded border border-transparent px-1.5 py-0.5 text-right text-xs outline-none transition-colors", a ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
          tabIndex: 0,
          children: n
        })
      ]
    });
  }
  function dM({ label: l, value: n, isDark: a, onChange: i }) {
    const [s, c] = m.useState(false), [f, h] = m.useState(n), p = m.useRef(null), g = m.useRef(false), v = m.useRef(true);
    m.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), m.useEffect(() => {
      s || h(n);
    }, [
      n,
      s
    ]), m.useEffect(() => {
      s && p.current && (p.current.focus(), p.current.select());
    }, [
      s
    ]);
    const y = m.useCallback(() => {
      if (g.current) {
        g.current = false, c(false);
        return;
      }
      if (!v.current) return;
      const w = f.trim();
      w && w !== n && i(w), c(false);
    }, [
      f,
      n,
      i
    ]), S = m.useCallback((w) => {
      var _a, _b2;
      w.key === "Enter" && !w.shiftKey ? (w.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), g.current = true, h(n), (_b2 = p.current) == null ? void 0 : _b2.blur());
    }, [
      n
    ]), E = n.split(`
`), k = E.length > 2 ? `${E.slice(0, 2).join(`
`)}...` : n;
    return b.jsxs("div", {
      className: "px-3 py-1",
      "data-field": l,
      children: [
        b.jsx("div", {
          className: "flex items-center justify-between gap-2 pb-1",
          children: b.jsx("span", {
            className: q("text-xs select-none", a ? "text-white/50" : "text-black/50"),
            children: l
          })
        }),
        s ? b.jsx("textarea", {
          ref: p,
          value: f,
          onChange: (w) => h(w.target.value),
          onBlur: y,
          onKeyDown: S,
          onClick: (w) => w.stopPropagation(),
          rows: Math.min(6, Math.max(2, f.split(`
`).length)),
          className: q("w-full resize-none rounded border px-1.5 py-1 font-mono text-xs leading-relaxed outline-none", a ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
        }) : b.jsx("button", {
          type: "button",
          onClick: () => c(true),
          onFocus: () => c(true),
          className: q("w-full whitespace-pre-wrap rounded border border-transparent px-1.5 py-1 text-left font-mono text-xs leading-relaxed outline-none transition-colors", a ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
          tabIndex: 0,
          children: k || b.jsx("span", {
            className: a ? "text-white/30" : "text-black/30",
            children: "Empty"
          })
        })
      ]
    });
  }
  function tf({ currentLayer: l, currentDatatype: n, isDark: a, onChange: i }) {
    const s = me((N) => N.getAllLayers)(), [c, f] = m.useState(`${l}:${n}`), [h, p] = m.useState(false), [g, v] = m.useState(-1);
    Us("layer-selector", h);
    const y = m.useRef(null), S = m.useRef(null), E = `${l}:${n}`;
    m.useEffect(() => {
      f(E);
    }, [
      E
    ]);
    const k = s.find((N) => `${N.layerNumber}:${N.datatype}` === c), [w, C] = m.useState({
      top: 0,
      right: 0,
      width: 0
    }), _ = m.useCallback(() => {
      if (!y.current) return;
      const N = y.current.getBoundingClientRect();
      C({
        top: N.bottom + 4,
        right: window.innerWidth - N.right,
        width: Math.max(N.width, 160)
      });
      const L = s.findIndex((U) => `${U.layerNumber}:${U.datatype}` === c);
      v(L >= 0 ? L : 0), p(true);
    }, [
      s,
      c
    ]), R = m.useCallback(() => {
      var _a;
      p(false), (_a = y.current) == null ? void 0 : _a.focus();
    }, []), A = m.useCallback((N) => {
      f(`${N.layerNumber}:${N.datatype}`), i(N.layerNumber, N.datatype), R();
    }, [
      i,
      R
    ]);
    m.useEffect(() => {
      h && S.current && S.current.focus();
    }, [
      h
    ]), m.useEffect(() => {
      if (!h) return;
      const N = (L) => {
        var _a, _b2;
        ((_a = y.current) == null ? void 0 : _a.contains(L.target)) || ((_b2 = S.current) == null ? void 0 : _b2.contains(L.target)) || p(false);
      };
      return document.addEventListener("mousedown", N), () => document.removeEventListener("mousedown", N);
    }, [
      h
    ]);
    const T = m.useCallback((N) => {
      (N.key === "ArrowDown" || N.key === "ArrowUp" || N.key === "Enter" || N.key === " ") && (N.preventDefault(), _());
    }, [
      _
    ]), B = m.useCallback((N) => {
      switch (N.key) {
        case "ArrowDown":
          N.preventDefault(), N.stopPropagation(), v((L) => Math.min(L + 1, s.length - 1));
          break;
        case "ArrowUp":
          N.preventDefault(), N.stopPropagation(), v((L) => Math.max(L - 1, 0));
          break;
        case "Enter":
        case " ": {
          N.preventDefault(), N.stopPropagation();
          const L = s[g];
          L && A(L);
          break;
        }
        case "Escape":
        case "Tab":
          N.preventDefault(), N.stopPropagation(), R();
          break;
      }
    }, [
      s,
      g,
      A,
      R
    ]);
    return b.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      children: [
        b.jsx("span", {
          className: q("text-xs select-none", a ? "text-white/50" : "text-black/50"),
          children: "Layer"
        }),
        b.jsxs("button", {
          ref: y,
          type: "button",
          onClick: () => h ? R() : _(),
          onKeyDown: T,
          className: q("flex max-w-36 items-center gap-1.5 rounded-lg border px-1.5 py-0.5 text-xs outline-none transition-colors", a ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 focus-visible:border-white/40" : "border-black/10 bg-black/5 text-black/90 hover:bg-black/10 focus-visible:border-black/40"),
          children: [
            k && b.jsx("div", {
              className: q("h-3 w-3 flex-shrink-0 rounded-sm border", a ? "border-white/10" : "border-black/10"),
              style: {
                backgroundColor: k.color
              }
            }),
            b.jsx("span", {
              className: "truncate",
              children: k ? k.name : `${l}/${n}`
            }),
            b.jsx("svg", {
              width: "12",
              height: "12",
              viewBox: "0 0 16 16",
              className: q("flex-shrink-0 transition-transform", h && "rotate-180", a ? "text-white/40" : "text-black/40"),
              children: b.jsx("path", {
                d: "M4 6l4 4 4-4",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5"
              })
            })
          ]
        }),
        h && Io.createPortal(b.jsx("div", {
          ref: S,
          tabIndex: -1,
          onKeyDown: B,
          className: q("fixed z-50 overflow-y-auto rounded-xl border py-1 shadow-lg outline-none", a ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: {
            top: w.top,
            right: w.right,
            minWidth: w.width,
            maxHeight: 200
          },
          children: s.map((N, L) => {
            const X = `${N.layerNumber}:${N.datatype}` === c, J = L === g;
            return b.jsxs("div", {
              "data-layer-option": true,
              role: "option",
              "aria-selected": X,
              className: q("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", J ? a ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : a ? "text-white/70" : "text-black/70"),
              onMouseDown: (ae) => {
                ae.preventDefault(), A(N);
              },
              onMouseEnter: () => v(L),
              children: [
                b.jsx("div", {
                  className: q("h-3.5 w-3.5 flex-shrink-0 rounded-sm border", a ? "border-white/10" : "border-black/10"),
                  style: {
                    backgroundColor: N.color
                  }
                }),
                b.jsx("span", {
                  className: "flex-1 truncate",
                  children: N.name
                }),
                b.jsxs("span", {
                  className: q("flex-shrink-0 font-mono text-[11px]", a ? "text-white/40" : "text-black/40"),
                  children: [
                    N.layerNumber,
                    "/",
                    N.datatype
                  ]
                }),
                X && b.jsx("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 16 16",
                  className: q("flex-shrink-0", a ? "text-white/70" : "text-black/70"),
                  children: b.jsx("path", {
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
  function Jt({ label: l, isDark: n }) {
    return b.jsx("div", {
      className: q("px-3 pt-2.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function Q1({ index: l, x: n, y: a, unit: i, isDark: s, canRemove: c, onChangeX: f, onChangeY: h, onRemove: p, readOnly: g }) {
    return b.jsxs("div", {
      "data-vertex-row": true,
      children: [
        b.jsxs("div", {
          className: "flex items-center justify-between px-3 pt-1.5 pb-0",
          children: [
            b.jsxs("span", {
              className: q("text-[10px] font-mono select-none", s ? "text-white/30" : "text-black/30"),
              children: [
                "V",
                l
              ]
            }),
            !g && b.jsx("button", {
              type: "button",
              onClick: p,
              disabled: !c,
              className: q("flex-shrink-0 rounded p-0.5 transition-colors", c ? s ? "text-white/40 hover:bg-white/10 hover:text-white/70" : "text-black/40 hover:bg-black/10 hover:text-black/70" : s ? "cursor-not-allowed text-white/10" : "cursor-not-allowed text-black/10"),
              tabIndex: c ? 0 : -1,
              children: b.jsx("svg", {
                width: "12",
                height: "12",
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                children: b.jsx("path", {
                  d: "M4 8h8",
                  strokeWidth: "1.5",
                  strokeLinecap: "round"
                })
              })
            })
          ]
        }),
        b.jsx(Vt, {
          label: "X",
          value: n,
          unit: i,
          isDark: s,
          onChange: f,
          readOnly: g
        }),
        b.jsx(Vt, {
          label: "Y",
          value: a,
          unit: i,
          isDark: s,
          onChange: h,
          readOnly: g
        })
      ]
    });
  }
  function tv({ vertices: l, unitInfo: n, isDark: a, onChangeVertex: i, onRemoveVertex: s, onAddVertex: c, readOnly: f, label: h }) {
    const p = l.length / 2, g = p > 3, v = m.useRef(null), [y, S] = m.useState(null);
    m.useEffect(() => {
      if (y === null) return;
      const w = y;
      let C, _ = 0;
      const R = 10, A = () => {
        const T = v.current;
        if (!T) {
          S(null);
          return;
        }
        const B = T.querySelectorAll("[data-vertex-row]");
        if (B.length <= w) {
          if (_++, _ >= R) {
            S(null);
            return;
          }
          C = requestAnimationFrame(A);
          return;
        }
        T.scrollTop = T.scrollHeight;
        const N = B[B.length - 1];
        if (N) {
          const L = N.querySelector("[data-field='X'] button");
          L && L.focus();
        }
        S(null);
      };
      return C = requestAnimationFrame(A), () => cancelAnimationFrame(C);
    }, [
      y
    ]);
    const E = m.useCallback(() => {
      c(), S(p);
    }, [
      c,
      p
    ]), k = [];
    for (let w = 0; w < p; w++) {
      const C = l[w * 2], _ = l[w * 2 + 1], R = mt(C / ve, n), A = mt(-_ / ve, n);
      k.push(b.jsx(Q1, {
        index: w,
        x: R,
        y: A,
        unit: n.unit,
        isDark: a,
        canRemove: g,
        onChangeX: (T) => i(w, "x", T),
        onChangeY: (T) => i(w, "y", T),
        onRemove: () => s(w),
        readOnly: f
      }, w));
    }
    return b.jsxs(b.Fragment, {
      children: [
        b.jsx(Jt, {
          label: h ?? "Vertices",
          isDark: a
        }),
        b.jsx("div", {
          ref: v,
          className: "flex max-h-48 flex-col overflow-y-auto",
          children: k
        }),
        !f && b.jsx("div", {
          className: "px-3 pt-1",
          children: b.jsxs("button", {
            type: "button",
            onClick: E,
            className: q("flex w-full items-center justify-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors", a ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-black/10 text-black/50 hover:bg-black/5 hover:text-black/70"),
            children: [
              b.jsx("svg", {
                width: "12",
                height: "12",
                viewBox: "0 0 16 16",
                fill: "none",
                stroke: "currentColor",
                children: b.jsx("path", {
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
  function fM() {
    const l = se((s) => s.selectedIds), n = Ce((s) => s.library), [a, i] = m.useState(0);
    return m.useEffect(() => {
      if (!n || l.size === 0) return;
      let s;
      const c = () => {
        n.is_dirty() && i((f) => f + 1), s = requestAnimationFrame(c);
      };
      return s = requestAnimationFrame(c), () => cancelAnimationFrame(s);
    }, [
      n,
      l
    ]), m.useMemo(() => {
      if (l.size === 0 || !n) return null;
      let s = null;
      const c = l.values().next().value;
      if (c.startsWith("ref:")) {
        const S = n.get_cell_ref_info(c);
        if (S) {
          const [E, k, w, C, _, R] = S.transform, A = n.get_cell_origin_by_name(S.cell_name), T = A ? A[0] : 0, B = A ? A[1] : 0, L = Math.atan2(w, E) * 180 / Math.PI, U = Math.sqrt(E * E + w * w), X = n.get_cell_ref_array(c);
          let J = null;
          X && X.length === 4 && (J = {
            columns: X[0],
            rows: X[1],
            colSpacing: X[2],
            rowSpacing: X[3]
          }), s = {
            cellName: S.cell_name,
            x: E * T + k * B + _,
            y: w * T + C * B + R,
            tx: _,
            ty: R,
            rotation: L,
            scale: U,
            transform: new Float64Array(S.transform),
            childOriginX: T,
            childOriginY: B,
            array: J,
            refId: c,
            ids: [
              ...l
            ]
          }, S.free();
        }
      }
      const f = [];
      for (const S of l) {
        const E = n.get_element_info(S);
        E && (f.push({
          id: S,
          layer: E.layer,
          datatype: E.datatype,
          vertexCount: E.vertices.length / 2,
          vertices: new Float64Array(E.vertices)
        }), E.free());
      }
      if (f.length === 0) return null;
      const h = n.get_bounds_for_ids([
        ...l
      ]), p = h ? {
        minX: h[0],
        minY: h[1],
        maxX: h[2],
        maxY: h[3]
      } : null, g = f[0].layer, v = f[0].datatype, y = f.some((S) => S.layer !== g || S.datatype !== v);
      return {
        elements: f,
        bounds: p,
        isMixed: y,
        instance: s
      };
    }, [
      l,
      n,
      a
    ]);
  }
  const hM = {
    unit: "\xB5m",
    scale: 1e3
  };
  function mM() {
    const n = he((O) => O.theme) === "dark", a = hM, i = fM(), s = Ce((O) => O.library), c = Ce((O) => O.renderer), f = ye((O) => O.activeCell), h = ye((O) => O.cellTree), p = m.useMemo(() => {
      if (!f || !h) return false;
      const O = (Q) => {
        for (const W of Q) {
          if (W.name === f) return W;
          const de = O(W.children);
          if (de) return de;
        }
      }, Y = O(h);
      return Y ? Y.children.length > 0 : false;
    }, [
      f,
      h
    ]);
    fe((O) => O.undoStack.length + O.redoStack.length);
    const g = dn((O) => O.pathMetadata), v = s == null ? void 0 : s.get_cell_origin(), y = v ? {
      x: v[0],
      y: v[1]
    } : {
      x: 0,
      y: 0
    }, S = m.useRef(y);
    S.current = y;
    const E = m.useRef(void 0), k = m.useRef(void 0), w = m.useCallback((O) => {
      if (!f || !s || !c || O === f) return;
      const Y = new Av(f, O);
      fe.getState().execute(Y, {
        library: s,
        renderer: c
      });
    }, [
      f,
      s,
      c
    ]), C = m.useCallback((O, Y) => {
      if (!s || !c) return;
      const Q = Y * a.scale, W = O === "y" ? -Q * ve : Q * ve, de = S.current, oe = new qS(de.x, de.y, O === "x" ? W : de.x, O === "y" ? W : de.y);
      fe.getState().execute(oe, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      a
    ]), _ = m.useCallback((O, Y) => {
      if (!i || !s || !c) return;
      const Q = i.elements.map((de) => de.id), W = new Qg(Q, O, Y);
      fe.getState().execute(W, {
        library: s,
        renderer: c
      });
    }, [
      i,
      s,
      c
    ]), R = m.useCallback((O, Y) => {
      if (!(i == null ? void 0 : i.bounds) || !s || !c) return;
      const Q = Y * a.scale, W = O === "y" ? -Q * ve : Q * ve, de = i.elements.map((Me) => Me.id), oe = new $S(de, i.bounds.minX, i.bounds.minY, O === "x" ? W : i.bounds.minX, O === "y" ? W - (i.bounds.maxY - i.bounds.minY) : i.bounds.minY);
      fe.getState().execute(oe, {
        library: s,
        renderer: c
      });
    }, [
      i,
      s,
      c,
      a
    ]), A = m.useCallback((O, Y) => {
      if (!(i == null ? void 0 : i.bounds) || !s || !c) return;
      const W = Y * a.scale * ve;
      if (W <= 0) return;
      const de = i.bounds.maxX - i.bounds.minX, oe = i.bounds.maxY - i.bounds.minY, Me = i.elements.map((Re) => Re.id), Xe = new VS(Me, i.bounds, O === "width" ? W : de, O === "height" ? W : oe);
      fe.getState().execute(Xe, {
        library: s,
        renderer: c
      });
    }, [
      i,
      s,
      c,
      a
    ]), T = m.useCallback((O, Y, Q) => {
      if (!i || !s || !c) return;
      const W = i.elements[0];
      if (!W) return;
      const de = new Float64Array(W.vertices), oe = Q * a.scale, Me = Y === "y" ? -oe * ve : oe * ve;
      de[O * 2 + (Y === "x" ? 0 : 1)] = Me;
      const Xe = new cd(W.id, de, "Edit vertex");
      fe.getState().execute(Xe, {
        library: s,
        renderer: c
      });
    }, [
      i,
      s,
      c,
      a
    ]), B = m.useCallback((O) => {
      if (!i || !s || !c) return;
      const Y = i.elements[0];
      if (!Y || Y.vertexCount <= 3) return;
      const Q = new Float64Array(Y.vertices.length - 2);
      let W = 0;
      for (let oe = 0; oe < Y.vertexCount; oe++) oe !== O && (Q[W] = Y.vertices[oe * 2], Q[W + 1] = Y.vertices[oe * 2 + 1], W += 2);
      const de = new cd(Y.id, Q, "Remove vertex");
      fe.getState().execute(de, {
        library: s,
        renderer: c
      });
    }, [
      i,
      s,
      c
    ]), N = m.useCallback(() => {
      if (!i || !s || !c) return;
      const O = i.elements[0];
      if (!O) return;
      const Y = O.vertexCount, Q = O.vertices[(Y - 1) * 2], W = O.vertices[(Y - 1) * 2 + 1], de = O.vertices[0], oe = O.vertices[1], Me = (Q + de) / 2, Xe = (W + oe) / 2, Re = new Float64Array(O.vertices.length + 2);
      Re.set(O.vertices), Re[O.vertices.length] = Me, Re[O.vertices.length + 1] = Xe;
      const Ie = new cd(O.id, Re, "Add vertex");
      fe.getState().execute(Ie, {
        library: s,
        renderer: c
      });
    }, [
      i,
      s,
      c
    ]), L = m.useRef(null);
    m.useEffect(() => {
      const O = L.current;
      if (!O) return;
      const Y = (Q) => {
        if (Q.key !== "Escape" && Q.key === "Tab") {
          Q.stopPropagation(), Q.preventDefault();
          const W = Array.from(O.querySelectorAll("input, button:not([tabindex='-1']):not([data-layer-option])"));
          if (W.length === 0) return;
          const de = W.indexOf(document.activeElement), oe = Q.shiftKey ? (de - 1 + W.length) % W.length : (de + 1) % W.length;
          W[oe].focus();
        }
      };
      return O.addEventListener("keydown", Y), () => O.removeEventListener("keydown", Y);
    }, []);
    const U = he((O) => O.inspectorFocusRequested), X = he((O) => O.inspectorFocusField);
    m.useEffect(() => {
      !U || !L.current || (he.getState().clearInspectorFocus(), requestAnimationFrame(() => {
        const O = L.current;
        if (!O) return;
        let Y = null;
        if (X) {
          const Q = O.querySelector(`[data-field="${X}"]`);
          Q && (Y = Q.querySelector("button:not([tabindex='-1']), input"));
        }
        Y || (Y = O.querySelector("input, button:not([tabindex='-1']):not([data-layer-option])")), Y && Y.focus();
      }));
    }, [
      U,
      X
    ]);
    const J = m.useCallback((O) => {
      const Y = E.current, Q = k.current;
      if (!Y || !Q || !s || !c || !se.getState().selectedIds.has(Q)) return;
      const W = O * a.scale * ve;
      if (W <= 0) return;
      const de = new ss(Q, Y, {
        ...Y,
        width: W
      }, "Change path width");
      fe.getState().execute(de, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      a
    ]), ae = m.useCallback((O) => {
      const Y = E.current, Q = k.current;
      if (!Y || !Q || !s || !c || !se.getState().selectedIds.has(Q)) return;
      const W = O * a.scale * ve;
      if (W < 0) return;
      const de = new ss(Q, Y, {
        ...Y,
        cornerRadius: W
      }, "Change path corner radius");
      fe.getState().execute(de, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      a
    ]), te = m.useCallback((O, Y, Q) => {
      const W = E.current, de = k.current;
      if (!W || !de || !s || !c || !se.getState().selectedIds.has(de)) return;
      const oe = Q * a.scale, Me = Y === "y" ? -oe * ve : oe * ve, Xe = W.waypoints.map((Ie, Ve) => Ve !== O ? Ie : Y === "x" ? {
        x: Me,
        y: Ie.y
      } : {
        x: Ie.x,
        y: Me
      }), Re = new ss(de, W, {
        ...W,
        waypoints: Xe
      }, "Edit path waypoint");
      fe.getState().execute(Re, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      a
    ]);
    if (!i) {
      const O = mt(y.x / ve, a), Y = mt(-y.y / ve, a);
      return b.jsxs("div", {
        ref: L,
        className: "flex flex-col pb-2",
        onWheel: (Q) => Q.stopPropagation(),
        children: [
          b.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: b.jsx("span", {
              className: q("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: "Cell"
            })
          }),
          b.jsx("div", {
            className: q("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          b.jsx(Jt, {
            label: "Name",
            isDark: n
          }),
          f ? b.jsx(uM, {
            label: "Name",
            value: f,
            isDark: n,
            onChange: w
          }) : b.jsx("div", {
            className: "px-3 py-1",
            children: b.jsx("span", {
              className: q("text-xs italic select-none", n ? "text-white/40" : "text-black/40"),
              children: "No cell"
            })
          }),
          b.jsx("div", {
            className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          b.jsx(Jt, {
            label: "Origin",
            isDark: n
          }),
          b.jsx(Vt, {
            label: "X",
            value: O,
            unit: a.unit,
            isDark: n,
            onChange: (Q) => C("x", Q)
          }),
          b.jsx(Vt, {
            label: "Y",
            value: Y,
            unit: a.unit,
            isDark: n,
            onChange: (Q) => C("y", Q)
          })
        ]
      });
    }
    const { elements: ce, bounds: ie, isMixed: Se } = i, $ = ce.length === 1, P = ce[0];
    if ($ && s && s.is_text_element(P.id)) {
      const O = s.get_text_element_info(P.id);
      if (O) {
        const Y = mt(O.x / ve, a), Q = mt(-O.y / ve, a), W = mt(O.height / ve, a), de = (Re, Ie) => {
          if (!c) return;
          const Ve = Ie * a.scale, Mt = Re === "y" ? -Ve * ve : Ve * ve, Yt = new ZS(P.id, O.x, O.y, Re === "x" ? Mt : O.x, Re === "y" ? Mt : O.y);
          fe.getState().execute(Yt, {
            library: s,
            renderer: c
          });
        }, oe = (Re) => {
          if (!c || Re === O.text) return;
          const Ie = new GS(P.id, O.text, Re);
          fe.getState().execute(Ie, {
            library: s,
            renderer: c
          }), Ce.getState().bumpSyncGeneration();
        }, Me = (Re) => {
          if (!c) return;
          const Ve = Re * a.scale * ve;
          if (Ve <= 0) return;
          const Mt = new KS(P.id, O.height, Ve);
          fe.getState().execute(Mt, {
            library: s,
            renderer: c
          }), Ce.getState().bumpSyncGeneration();
        }, Xe = (Re, Ie) => {
          if (!c) return;
          const Ve = new Qg([
            P.id
          ], Re, Ie);
          fe.getState().execute(Ve, {
            library: s,
            renderer: c
          }), Ce.getState().bumpSyncGeneration();
        };
        return b.jsxs("div", {
          ref: L,
          className: "flex flex-col pb-2",
          onWheel: (Re) => Re.stopPropagation(),
          children: [
            b.jsx("div", {
              className: "px-3 pt-2 pb-1",
              children: b.jsx("span", {
                className: q("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
                children: "Text"
              })
            }),
            b.jsx("div", {
              className: q("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            b.jsx(Jt, {
              label: "Layer",
              isDark: n
            }),
            b.jsx(tf, {
              currentLayer: O.layer,
              currentDatatype: O.datatype,
              isDark: n,
              onChange: Xe
            }),
            b.jsx("div", {
              className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            b.jsx(Jt, {
              label: "Content",
              isDark: n
            }),
            b.jsx(dM, {
              label: "Text",
              value: O.text,
              isDark: n,
              onChange: oe
            }),
            b.jsx("div", {
              className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            b.jsx(Jt, {
              label: "Position",
              isDark: n
            }),
            b.jsx(Vt, {
              label: "X",
              value: Y,
              unit: a.unit,
              isDark: n,
              onChange: (Re) => de("x", Re)
            }),
            b.jsx(Vt, {
              label: "Y",
              value: Q,
              unit: a.unit,
              isDark: n,
              onChange: (Re) => de("y", Re)
            }),
            b.jsx("div", {
              className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            b.jsx(Jt, {
              label: "Size",
              isDark: n
            }),
            b.jsx(Vt, {
              label: "Size",
              value: W,
              unit: a.unit,
              isDark: n,
              onChange: Me
            })
          ]
        });
      }
    }
    const ue = $ && P ? g.get(P.id) : void 0;
    if (E.current = ue, k.current = P == null ? void 0 : P.id, ue && $) {
      const O = mt(ue.width / ve, a), Y = mt(ue.cornerRadius / ve, a), Q = ie ? mt(ie.minX / ve, a) : "\u2014", W = ie ? mt(-ie.maxY / ve, a) : "\u2014", de = ue.waypoints.map((oe, Me) => {
        const Xe = mt(oe.x / ve, a), Re = mt(-oe.y / ve, a);
        return b.jsx(Q1, {
          index: Me,
          x: Xe,
          y: Re,
          unit: a.unit,
          isDark: n,
          canRemove: ue.waypoints.length > 2,
          onChangeX: (Ie) => te(Me, "x", Ie),
          onChangeY: (Ie) => te(Me, "y", Ie),
          onRemove: () => {
            if (ue.waypoints.length <= 2) return;
            const Ie = E.current, Ve = k.current;
            if (!Ie || !Ve || !s || !c) return;
            const Mt = Ie.waypoints.filter((_n, fn) => fn !== Me), Yt = new ss(Ve, Ie, {
              ...Ie,
              waypoints: Mt
            }, "Remove path waypoint");
            fe.getState().execute(Yt, {
              library: s,
              renderer: c
            });
          }
        }, Me);
      });
      return b.jsxs("div", {
        ref: L,
        className: "flex flex-col pb-2",
        onWheel: (oe) => oe.stopPropagation(),
        children: [
          b.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: b.jsxs("span", {
              className: q("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: [
                "Path \xB7 ",
                ue.waypoints.length,
                " waypoints"
              ]
            })
          }),
          b.jsx("div", {
            className: q("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          b.jsx(Jt, {
            label: "Layer",
            isDark: n
          }),
          b.jsx(tf, {
            currentLayer: P.layer,
            currentDatatype: P.datatype,
            isDark: n,
            onChange: _
          }),
          b.jsx("div", {
            className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          b.jsx(Jt, {
            label: "Path",
            isDark: n
          }),
          b.jsx(Vt, {
            label: "Width",
            value: O,
            unit: a.unit,
            isDark: n,
            onChange: J
          }),
          b.jsx(Vt, {
            label: "Radius",
            value: Y,
            unit: a.unit,
            isDark: n,
            onChange: ae
          }),
          b.jsx("div", {
            className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          b.jsx(Jt, {
            label: "Position",
            isDark: n
          }),
          b.jsx(Vt, {
            label: "X",
            value: Q,
            unit: a.unit,
            isDark: n,
            onChange: (oe) => R("x", oe)
          }),
          b.jsx(Vt, {
            label: "Y",
            value: W,
            unit: a.unit,
            isDark: n,
            onChange: (oe) => R("y", oe)
          }),
          b.jsx("div", {
            className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          b.jsx(Jt, {
            label: "Waypoints",
            isDark: n
          }),
          b.jsx("div", {
            className: "flex max-h-48 flex-col overflow-y-auto",
            children: de
          })
        ]
      });
    }
    const xe = ie ? mt(ie.minX / ve, a) : "\u2014", be = ie ? mt(-ie.maxY / ve, a) : "\u2014", j = ie ? mt((ie.maxX - ie.minX) / ve, a) : "\u2014", D = ie ? mt((ie.maxY - ie.minY) / ve, a) : "\u2014", z = p || $;
    return b.jsxs("div", {
      ref: L,
      className: "flex flex-col pb-2",
      onWheel: (O) => O.stopPropagation(),
      children: [
        b.jsx("div", {
          className: "px-3 pt-2 pb-1",
          children: b.jsx("span", {
            className: q("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
            children: $ ? `Polygon \xB7 ${P.vertexCount} vertices` : `${ce.length} elements`
          })
        }),
        b.jsx("div", {
          className: q("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        !p && b.jsxs(b.Fragment, {
          children: [
            b.jsx(Jt, {
              label: "Layer",
              isDark: n
            }),
            Se ? b.jsxs("div", {
              className: "flex items-center justify-between gap-2 px-3 py-1",
              children: [
                b.jsx("span", {
                  className: q("text-xs select-none", n ? "text-white/50" : "text-black/50"),
                  children: "Layer"
                }),
                b.jsx("span", {
                  className: q("text-xs italic select-none", n ? "text-white/40" : "text-black/40"),
                  children: "Mixed"
                })
              ]
            }) : b.jsx(tf, {
              currentLayer: P.layer,
              currentDatatype: P.datatype,
              isDark: n,
              onChange: _
            }),
            b.jsx("div", {
              className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            })
          ]
        }),
        b.jsx(Jt, {
          label: "Position",
          isDark: n
        }),
        b.jsx(Vt, {
          label: "X",
          value: xe,
          unit: a.unit,
          isDark: n,
          onChange: z ? (O) => R("x", O) : void 0,
          readOnly: !z
        }),
        b.jsx(Vt, {
          label: "Y",
          value: be,
          unit: a.unit,
          isDark: n,
          onChange: z ? (O) => R("y", O) : void 0,
          readOnly: !z
        }),
        b.jsx("div", {
          className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        b.jsx(Jt, {
          label: "Size",
          isDark: n
        }),
        b.jsx(Vt, {
          label: "W",
          value: j,
          unit: a.unit,
          isDark: n,
          onChange: $ && !p ? (O) => A("width", O) : void 0,
          readOnly: !$ || p
        }),
        b.jsx(Vt, {
          label: "H",
          value: D,
          unit: a.unit,
          isDark: n,
          onChange: $ && !p ? (O) => A("height", O) : void 0,
          readOnly: !$ || p
        }),
        ($ || p) && b.jsxs(b.Fragment, {
          children: [
            b.jsx("div", {
              className: q("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            p && !$ ? ce.map((O, Y) => b.jsx(tv, {
              vertices: O.vertices,
              unitInfo: a,
              isDark: n,
              onChangeVertex: T,
              onRemoveVertex: B,
              onAddVertex: N,
              readOnly: true,
              label: ce.length > 1 ? `Vertices (${Y + 1}/${ce.length})` : void 0
            }, O.id)) : b.jsx(tv, {
              vertices: P.vertices,
              unitInfo: a,
              isDark: n,
              onChangeVertex: T,
              onRemoveVertex: B,
              onAddVertex: N,
              readOnly: p
            })
          ]
        })
      ]
    });
  }
  const F1 = [
    {
      id: "layers",
      icon: j4,
      label: "Layers",
      shortcut: "L"
    },
    {
      id: "inspector",
      icon: GE,
      label: "Inspector",
      shortcut: "I"
    }
  ];
  function pM({ isDark: l, onExpand: n }) {
    return b.jsx("div", {
      className: q("fixed top-4 right-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border py-1", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: F1.map((a) => {
        const i = a.icon;
        return b.jsx(Nn, {
          label: a.label,
          shortcut: {
            modifiers: [
              Ne.shift
            ],
            key: a.shortcut
          },
          position: "left",
          children: b.jsx("button", {
            onClick: () => n(a.id),
            className: q("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
            children: b.jsx("div", {
              className: "flex h-4 w-4 items-center justify-center",
              children: b.jsx(i, {
                className: q("h-4 w-4", l ? "text-white/60" : "text-black/60")
              })
            })
          })
        }, a.id);
      })
    });
  }
  function nv() {
    const n = he((R) => R.theme) === "dark", a = he((R) => R.sidebarCollapsed), i = he((R) => R.toggleSidebarCollapsed), s = he((R) => R.sidebarWidth), c = he((R) => R.setSidebarWidth), { isSm: f } = Bf(), { handleProps: h } = G1({
      side: "right",
      width: s,
      onResize: c
    }), p = he((R) => R.sidebarTab), g = he((R) => R.setSidebarTab), v = Do((R) => R.isMinimized), [y, S] = m.useState(false), E = m.useRef(null);
    m.useEffect(() => {
      if (!f || !y) return;
      const R = (A) => {
        E.current && !E.current.contains(A.target) && S(false);
      };
      return document.addEventListener("mousedown", R), () => document.removeEventListener("mousedown", R);
    }, [
      f,
      y
    ]);
    const k = m.useCallback((R) => {
      g(R), f ? S(true) : i();
    }, [
      f,
      i,
      g
    ]), C = (v ? 0 : 206) + 24;
    if (a && !(f && y)) return b.jsx(pM, {
      isDark: n,
      onExpand: k
    });
    const _ = f && y;
    return b.jsxs(b.Fragment, {
      children: [
        _ && b.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        b.jsxs("div", {
          ref: E,
          className: q("fixed top-4 right-4 z-40 rounded-xl border", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", _ && "shadow-xl"),
          style: {
            width: s
          },
          children: [
            b.jsx("div", {
              ...h
            }),
            b.jsxs("div", {
              className: "flex items-center gap-1 px-1 pt-1 pb-[3px]",
              children: [
                F1.map((R) => {
                  const A = R.icon, T = p === R.id;
                  return b.jsx(Nn, {
                    label: R.label,
                    shortcut: {
                      modifiers: [
                        Ne.shift
                      ],
                      key: R.shortcut
                    },
                    children: b.jsx("button", {
                      onClick: () => g(R.id),
                      className: q("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", T && (n ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: b.jsx("div", {
                        className: "flex h-4 w-4 items-center justify-center",
                        children: b.jsx(A, {
                          className: q("h-4 w-4", n ? "text-white/90" : "text-black/90")
                        })
                      })
                    })
                  }, R.id);
                }),
                !f && b.jsx("button", {
                  type: "button",
                  onClick: i,
                  className: q("ml-auto cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: b.jsx(B1, {
                    className: q("h-4 w-4", n ? "text-white/60" : "text-black/60")
                  })
                })
              ]
            }),
            b.jsx("div", {
              className: q("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            b.jsxs("div", {
              className: "overflow-y-auto",
              style: {
                maxHeight: `calc(100vh - ${70 + C}px)`
              },
              onWheel: (R) => R.stopPropagation(),
              children: [
                p === "layers" && b.jsx(cM, {}),
                p === "inspector" && b.jsx(mM, {})
              ]
            })
          ]
        })
      ]
    });
  }
  const gM = (l) => {
    const n = 1 / (l * ve), a = gv * n, i = Of(l), s = a / i.scale, c = kS.find((h) => h >= s) ?? s, f = i.unit === "mm" && c >= 1e3 ? c.toExponential(1) : c;
    return {
      length: c * i.scale,
      label: `${f} ${i.unit}`
    };
  }, lv = "0.1.0";
  function yM({ isDark: l }) {
    return b.jsxs("div", {
      className: "group relative flex items-center gap-1.5",
      children: [
        b.jsx("div", {
          className: "h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500"
        }),
        b.jsxs("span", {
          className: q("text-[10px] select-none", l ? "text-white/40" : "text-black/40"),
          children: [
            "v",
            lv
          ]
        }),
        b.jsxs("div", {
          className: q("pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-56 rounded-lg border p-2.5 text-[11px] leading-relaxed opacity-0 transition-opacity group-hover:opacity-100", l ? "border-white/10 bg-[rgb(29,29,29)] text-white/70" : "border-black/10 bg-[rgb(241,241,241)] text-black/70"),
          children: [
            b.jsxs("span", {
              className: q("font-medium", l ? "text-white/90" : "text-black/90"),
              children: [
                "Rosette v",
                lv,
                " Beta"
              ]
            }),
            b.jsx("p", {
              className: "mt-1.5",
              children: "Features may be unstable or incomplete. Not suitable for production use."
            })
          ]
        })
      ]
    });
  }
  function bM({ isDark: l }) {
    const n = $t((i) => i.message), a = $t((i) => i.level);
    return n ? b.jsx("div", {
      className: "flex min-w-0 flex-1 items-center justify-center",
      children: b.jsx("span", {
        className: q("truncate text-[11px] select-none", a === "warn" && (l ? "text-yellow-400/80" : "text-yellow-600/80"), a === "error" && (l ? "text-red-400/80" : "text-red-600/80"), a === "info" && (l ? "text-white/50" : "text-black/50")),
        children: n
      })
    }) : b.jsx("div", {
      className: "flex-1"
    });
  }
  function vM({ isDark: l }) {
    const n = se((p) => p.selectedIds), a = Ce((p) => p.library), i = me((p) => p.layers), s = dn((p) => p.pathMetadata), c = m.useMemo(() => {
      const p = n.size;
      if (p === 0 || !a) return null;
      const g = n.values().next().value, v = g.startsWith("ref:");
      if (p === 1 && v) {
        const w = a.get_cell_ref_info(g);
        if (w) {
          const C = w.cell_name;
          return w.free(), {
            label: `Instance "${C}"`,
            layerNumber: null,
            datatype: null
          };
        }
      }
      if (p === 1 && a.is_text_element(g)) {
        const w = a.get_text_element_info(g);
        if (w) return {
          label: `Text "${w.text.length > 20 ? w.text.slice(0, 20) + "\u2026" : w.text}"`,
          layerNumber: w.layer,
          datatype: w.datatype
        };
      }
      if (p === 1) {
        const w = s.get(g);
        if (w) return {
          label: `Path \xB7 ${w.waypoints.length} waypoints`,
          layerNumber: w.layer,
          datatype: w.datatype
        };
      }
      let y = null, S = null, E = false, k = 0;
      for (const w of n) {
        const C = a.get_element_info(w);
        if (C && (y === null ? (y = C.layer, S = C.datatype) : (C.layer !== y || C.datatype !== S) && (E = true), p === 1 && (k = C.vertices.length / 2), C.free(), E && p > 1)) break;
      }
      return p === 1 ? {
        label: `Polygon \xB7 ${k} vertices`,
        layerNumber: y,
        datatype: S
      } : E ? {
        label: `${p} elements \xB7 Mixed layers`,
        layerNumber: null,
        datatype: null
      } : {
        label: `${p} elements`,
        layerNumber: y,
        datatype: S
      };
    }, [
      n,
      a,
      s
    ]);
    if (!c) return null;
    const f = m.useMemo(() => {
      if (c.layerNumber === null) return null;
      for (const p of i.values()) if (p.layerNumber === c.layerNumber && p.datatype === c.datatype) return {
        name: p.name,
        color: p.color
      };
      return null;
    }, [
      c,
      i
    ]), h = c.layerNumber !== null ? ` \xB7 ${(f == null ? void 0 : f.name) ? `${c.layerNumber}/${c.datatype} ${f.name}` : `${c.layerNumber}/${c.datatype}`}` : "";
    return b.jsxs("div", {
      className: "flex min-w-0 flex-1 items-center justify-center gap-1.5",
      children: [
        f && b.jsx("div", {
          className: "h-2 w-2 flex-shrink-0 rounded-full -translate-y-px",
          style: {
            backgroundColor: f.color
          }
        }),
        b.jsxs("span", {
          className: q("truncate text-[11px] select-none", l ? "text-white/50" : "text-black/50"),
          children: [
            c.label,
            h
          ]
        })
      ]
    });
  }
  function xM({ isDark: l }) {
    const n = $t((i) => i.message), a = se((i) => i.selectedIds.size > 0);
    return n ? b.jsx(bM, {
      isDark: l
    }) : a ? b.jsx(vM, {
      isDark: l
    }) : b.jsx("div", {
      className: "flex-1"
    });
  }
  function rv({ isDark: l, widthInPixels: n, label: a }) {
    return b.jsxs("div", {
      className: "flex items-center gap-1.5",
      children: [
        b.jsx("div", {
          className: q("h-px", l ? "bg-white/50" : "bg-black/50"),
          style: {
            width: `${Math.max(n, 20)}px`
          }
        }),
        b.jsx("span", {
          className: q("text-[10px] select-none pointer-events-none", l ? "text-white/40" : "text-black/40"),
          children: a
        })
      ]
    });
  }
  function av({ compact: l = false, minimal: n = false }) {
    const a = he((R) => {
      var _a;
      return (_a = R.cursorWorld) == null ? void 0 : _a.x;
    }), i = he((R) => {
      var _a;
      return (_a = R.cursorWorld) == null ? void 0 : _a.y;
    }), s = he((R) => R.theme), c = ze((R) => R.zoom), f = he((R) => R.zenMode), h = he((R) => R.toggleZenMode), p = Do((R) => R.isMinimized), g = Do((R) => R.toggle), v = s === "dark", y = m.useMemo(() => Of(c), [
      c
    ]), S = m.useMemo(() => a !== void 0 ? mt(a, y) : "\u2014", [
      a,
      y
    ]), E = m.useMemo(() => i !== void 0 ? mt(i, y) : "\u2014", [
      i,
      y
    ]), { length: k, label: w } = m.useMemo(() => gM(c), [
      c
    ]), C = Math.min(k * c * ve, MS), _ = !l && !n;
    return b.jsxs("div", {
      className: "relative flex-shrink-0",
      children: [
        !_ && b.jsx("div", {
          className: "absolute bottom-full right-3 mb-2 font-mono text-[11px]",
          children: b.jsx(rv, {
            isDark: v,
            widthInPixels: C,
            label: w
          })
        }),
        b.jsxs("div", {
          className: q("flex h-6 items-center border-t px-3 font-mono text-[11px]", v ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          children: [
            b.jsxs("div", {
              className: "flex min-w-0 flex-shrink-0 items-center gap-1.5",
              children: [
                !l && !n && b.jsxs(b.Fragment, {
                  children: [
                    b.jsx(yM, {
                      isDark: v
                    }),
                    b.jsx("span", {
                      className: q("mx-1 select-none pointer-events-none", v ? "text-white/20" : "text-black/20"),
                      children: "\xB7"
                    })
                  ]
                }),
                n ? b.jsxs("span", {
                  className: q("text-[10px] select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                  children: [
                    S,
                    ", ",
                    E,
                    " ",
                    y.unit
                  ]
                }) : b.jsxs(b.Fragment, {
                  children: [
                    b.jsx("span", {
                      className: q("select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "x:"
                    }),
                    b.jsx("span", {
                      className: q("w-18 text-right select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: S
                    }),
                    b.jsx("span", {
                      className: q("text-[10px] select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: y.unit
                    }),
                    b.jsx("span", {
                      className: q("mx-1 select-none pointer-events-none", v ? "text-white/20" : "text-black/20"),
                      children: "\xB7"
                    }),
                    b.jsx("span", {
                      className: q("select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "y:"
                    }),
                    b.jsx("span", {
                      className: q("w-18 text-right select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: E
                    }),
                    b.jsx("span", {
                      className: q("text-[10px] select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: y.unit
                    })
                  ]
                })
              ]
            }),
            !n && b.jsx(xM, {
              isDark: v
            }),
            n && b.jsx("div", {
              className: "flex-1"
            }),
            b.jsxs("div", {
              className: "flex flex-shrink-0 items-center gap-2",
              children: [
                _ && b.jsx(rv, {
                  isDark: v,
                  widthInPixels: C,
                  label: w
                }),
                b.jsx(Nn, {
                  label: "Zen Mode",
                  position: "top",
                  children: b.jsx("button", {
                    onClick: h,
                    className: q("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", f && (v ? "bg-white/10" : "bg-black/10")),
                    children: b.jsx(w3, {
                      width: 14,
                      height: 14,
                      className: q(v ? "text-white/50" : "text-black/50")
                    })
                  })
                }),
                b.jsx(Nn, {
                  label: "Minimap",
                  position: "top",
                  align: "end",
                  children: b.jsx("button", {
                    onClick: g,
                    className: q("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", !p && (v ? "bg-white/10" : "bg-black/10")),
                    children: b.jsx(K_, {
                      width: 14,
                      height: 14,
                      className: q(v ? "text-white/50" : "text-black/50")
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
  function SM({ title: l, titleId: n, ...a }, i) {
    return m.createElement("svg", Object.assign({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      "aria-hidden": "true",
      "data-slot": "icon",
      ref: i,
      "aria-labelledby": n
    }, a), l ? m.createElement("title", {
      id: n
    }, l) : null, m.createElement("path", {
      d: "M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 1 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06ZM14.95 3.05a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 8ZM14 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 8ZM7.172 10.828a.75.75 0 0 1 0 1.061L6.11 12.95a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM10.766 7.51a.75.75 0 0 0-1.37.365l-.492 6.861a.75.75 0 0 0 1.204.65l1.043-.799.985 3.678a.75.75 0 0 0 1.45-.388l-.978-3.646 1.292.204a.75.75 0 0 0 .74-1.16l-3.874-5.764Z"
    }));
  }
  const Vf = m.forwardRef(SM);
  function wM({ title: l, titleId: n, ...a }, i) {
    return m.createElement("svg", Object.assign({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      strokeWidth: 1.5,
      stroke: "currentColor",
      "aria-hidden": "true",
      "data-slot": "icon",
      ref: i,
      "aria-labelledby": n
    }, a), l ? m.createElement("title", {
      id: n
    }, l) : null, m.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
    }));
  }
  const $f = m.forwardRef(wM), CM = [
    {
      id: "select",
      icon: Vf,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "laser",
      icon: U1,
      label: "Laser Pointer",
      shortcut: "Q"
    },
    {
      id: "pan",
      icon: $f,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: Yf,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: Uf,
      label: "Zoom",
      shortcut: "Z"
    },
    {
      id: "ruler",
      icon: V1,
      label: "Ruler",
      shortcut: "U"
    }
  ], ov = [
    {
      id: "rectangle",
      icon: u3,
      label: "Rectangle",
      shortcut: "R"
    },
    {
      id: "polygon",
      icon: A_,
      label: "Polygon",
      shortcut: "G"
    },
    {
      id: "path",
      icon: __,
      label: "Path",
      shortcut: "H"
    },
    {
      id: "text",
      icon: j3,
      label: "Text",
      shortcut: "T"
    }
  ], EM = [
    {
      id: "select",
      icon: Vf,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: $f,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: Yf,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: Uf,
      label: "Zoom",
      shortcut: "Z"
    }
  ], iv = [
    {
      id: "laser",
      icon: U1,
      label: "Laser Pointer",
      shortcut: "Q"
    },
    {
      id: "ruler",
      icon: V1,
      label: "Ruler",
      shortcut: "U"
    }
  ], _M = [
    {
      id: "select",
      icon: Vf,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: $f,
      label: "Pan",
      shortcut: "P"
    }
  ];
  function sv({ tool: l, isActive: n, onClick: a, isDark: i }) {
    const s = l.icon;
    return b.jsx(Nn, {
      label: l.label,
      shortcut: {
        key: l.shortcut
      },
      children: b.jsx("button", {
        onClick: a,
        className: q("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", i ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (i ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: b.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: b.jsx(s, {
            className: q("h-5 w-5", i ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function cv({ isDark: l }) {
    return b.jsx("div", {
      className: q("mx-0 h-6 w-[1px]", l ? "bg-white/10" : "bg-black/10")
    });
  }
  function MM({ isDark: l, overflowBaseTools: n, overflowShapeTools: a, showInstance: i, showCommands: s }) {
    const [c, f] = m.useState(false), h = m.useRef(null), p = m.useRef(null), { activeTool: g, setTool: v } = Ht(), y = qt((w) => w.open), S = qt((w) => w.toggle), E = [
      ...n,
      ...a
    ].some((w) => w.id === g);
    m.useEffect(() => {
      if (!c) return;
      const w = (_) => {
        var _a, _b2;
        const R = _.target;
        !((_a = p.current) == null ? void 0 : _a.contains(R)) && !((_b2 = h.current) == null ? void 0 : _b2.contains(R)) && f(false);
      }, C = (_) => {
        _.key === "Escape" && f(false);
      };
      return document.addEventListener("mousedown", w, true), document.addEventListener("keydown", C), () => {
        document.removeEventListener("mousedown", w, true), document.removeEventListener("keydown", C);
      };
    }, [
      c
    ]);
    const k = m.useCallback(() => {
      if (!h.current) return {
        left: 0,
        top: 0
      };
      const w = h.current.getBoundingClientRect(), C = 200;
      let _ = w.left;
      return _ + C > window.innerWidth - 8 && (_ = window.innerWidth - C - 8), {
        left: _,
        top: w.bottom + 8
      };
    }, []);
    return b.jsxs(b.Fragment, {
      children: [
        b.jsx(Nn, {
          label: "More tools",
          className: c ? "[&>div:last-child]:hidden" : void 0,
          children: b.jsx("button", {
            ref: h,
            onClick: () => f(!c),
            className: q("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", (E || c) && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
            children: b.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: b.jsx(s_, {
                className: q("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        c && Io.createPortal(b.jsxs("div", {
          ref: p,
          className: q("fixed z-[9999] min-w-[180px] rounded-xl border p-1 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: (() => {
            const w = k();
            return {
              left: `${w.left}px`,
              top: `${w.top}px`
            };
          })(),
          children: [
            n.length > 0 && b.jsx("div", {
              className: "flex flex-col",
              children: n.map((w) => {
                const C = w.icon, _ = g === w.id;
                return b.jsxs("button", {
                  onClick: () => {
                    v(w.id), f(false);
                  },
                  className: q("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", _ && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                  children: [
                    b.jsx(C, {
                      className: q("h-4 w-4", l ? "text-white/90" : "text-black/90")
                    }),
                    b.jsx("span", {
                      className: l ? "text-white/90" : "text-black/90",
                      children: w.label
                    }),
                    b.jsx("kbd", {
                      className: q("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                      children: w.shortcut
                    })
                  ]
                }, w.id);
              })
            }),
            a.length > 0 && b.jsxs(b.Fragment, {
              children: [
                b.jsx("div", {
                  className: q("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                b.jsx("div", {
                  className: "flex flex-col",
                  children: a.map((w) => {
                    const C = w.icon, _ = g === w.id;
                    return b.jsxs("button", {
                      onClick: () => {
                        v(w.id), f(false);
                      },
                      className: q("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", _ && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: [
                        b.jsx(C, {
                          className: q("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        b.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: w.label
                        }),
                        b.jsx("kbd", {
                          className: q("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                          children: w.shortcut
                        })
                      ]
                    }, w.id);
                  })
                })
              ]
            }),
            (i || s) && b.jsxs(b.Fragment, {
              children: [
                b.jsx("div", {
                  className: q("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                b.jsxs("div", {
                  className: "flex flex-col",
                  children: [
                    i && b.jsxs("button", {
                      onClick: () => {
                        y("add instance "), f(false);
                      },
                      className: q("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        b.jsx(X1, {
                          className: q("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        b.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: "Instance"
                        }),
                        b.jsx("kbd", {
                          className: q("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                          children: "I"
                        })
                      ]
                    }),
                    s && b.jsxs("button", {
                      onClick: () => {
                        S(), f(false);
                      },
                      className: q("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        b.jsx($1, {
                          className: q("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        b.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: "Commands"
                        }),
                        b.jsxs("span", {
                          className: "ml-auto flex gap-0.5",
                          children: [
                            b.jsx("kbd", {
                              className: q("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                              children: Ne.mod
                            }),
                            b.jsx("kbd", {
                              className: q("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
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
  function uv({ compact: l = false, minimal: n = false }) {
    const { activeTool: a, setTool: i } = Ht(), c = he((k) => k.theme) === "dark", f = n ? _M : l ? EM : CM, h = !l && !n, p = !l && !n, g = !l && !n, v = !l && !n, y = l || n, S = n ? [
      ...iv,
      {
        id: "move",
        icon: Yf,
        label: "Move",
        shortcut: "M"
      },
      {
        id: "zoom",
        icon: Uf,
        label: "Zoom",
        shortcut: "Z"
      }
    ] : l ? iv : [], E = l || n ? ov : [];
    return b.jsxs("div", {
      className: q("fixed top-4 z-50 mx-auto w-fit", l || n ? "left-14 right-14" : "left-0 right-0", "flex items-center gap-1 rounded-xl border px-1 pt-1 pb-[3px]", c ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: [
        f.map((k) => b.jsx(sv, {
          tool: k,
          isActive: a === k.id,
          onClick: () => i(k.id),
          isDark: c
        }, k.id)),
        h && b.jsxs(b.Fragment, {
          children: [
            b.jsx(cv, {
              isDark: c
            }),
            ov.map((k) => b.jsx(sv, {
              tool: k,
              isActive: a === k.id,
              onClick: () => i(k.id),
              isDark: c
            }, k.id))
          ]
        }),
        p && b.jsx(jM, {
          isDark: c
        }),
        g && b.jsx(RM, {
          isDark: c
        }),
        b.jsx(cv, {
          isDark: c
        }),
        v && b.jsx(LM, {
          isDark: c
        }),
        y && b.jsx(MM, {
          isDark: c,
          overflowBaseTools: S,
          overflowShapeTools: E,
          showInstance: true,
          showCommands: true
        })
      ]
    });
  }
  const kM = 300, dv = [
    {
      id: "union",
      icon: O3,
      label: "Union",
      kind: "boolean"
    },
    {
      id: "subtract",
      icon: g3,
      label: "Subtract",
      kind: "boolean"
    },
    {
      id: "intersect",
      icon: Q4,
      label: "Intersect",
      kind: "boolean"
    },
    {
      id: "xor",
      icon: $4,
      label: "Exclude",
      kind: "boolean"
    },
    {
      id: "align-left",
      icon: u4,
      label: "Align Left",
      kind: "align"
    },
    {
      id: "align-center-h",
      icon: OE,
      label: "Align Center H",
      kind: "align"
    },
    {
      id: "align-right",
      icon: g4,
      label: "Align Right",
      kind: "align"
    },
    {
      id: "center-align",
      icon: WE,
      label: "Center Align",
      kind: "align"
    },
    {
      id: "align-top",
      icon: w4,
      label: "Align Top",
      kind: "align"
    },
    {
      id: "align-center-v",
      icon: UE,
      label: "Align Center V",
      kind: "align"
    },
    {
      id: "align-bottom",
      icon: r4,
      label: "Align Bottom",
      kind: "align"
    },
    {
      id: "origin-align",
      icon: X_,
      label: "Origin Align",
      kind: "align"
    }
  ];
  function fv(l) {
    const { library: n, renderer: a } = Ce.getState();
    if (!n || !a) return;
    const { selectedIds: i, lastSelectedId: s } = se.getState();
    if (i.size !== 0) if (l.kind === "boolean") {
      if (i.size < 2) return;
      const c = [
        ...i
      ], f = s ?? c[0], h = new Hv(c, l.id, f);
      fe.getState().execute(h, {
        library: n,
        renderer: a
      });
    } else {
      const c = l.id;
      if (c !== "origin-align" && i.size < 2) return;
      const f = new Iv(new Set(i), s, c);
      fe.getState().execute(f, {
        library: n,
        renderer: a
      });
    }
  }
  function jM({ isDark: l }) {
    const [n, a] = m.useState(dv[0]), [i, s] = m.useState(false), c = m.useRef(null), f = m.useRef(null), h = m.useRef(null), p = n.icon;
    m.useEffect(() => {
      if (!i) return;
      const C = (R) => {
        var _a, _b2;
        const A = R.target;
        !((_a = f.current) == null ? void 0 : _a.contains(A)) && !((_b2 = c.current) == null ? void 0 : _b2.contains(A)) && s(false);
      }, _ = (R) => {
        R.key === "Escape" && s(false);
      };
      return document.addEventListener("mousedown", C, true), document.addEventListener("keydown", _), () => {
        document.removeEventListener("mousedown", C, true), document.removeEventListener("keydown", _);
      };
    }, [
      i
    ]);
    const g = m.useCallback(() => {
      s(true);
    }, []), v = m.useCallback(() => {
      i || fv(n);
    }, [
      n,
      i
    ]), y = m.useCallback((C) => {
      C.preventDefault(), g();
    }, [
      g
    ]), S = m.useCallback((C) => {
      C.button === 0 && (h.current = setTimeout(g, kM));
    }, [
      g
    ]), E = m.useCallback(() => {
      h.current && (clearTimeout(h.current), h.current = null);
    }, []), k = m.useCallback((C) => {
      a(C), s(false), setTimeout(() => fv(C), 0);
    }, []), w = m.useCallback(() => {
      if (!c.current) return {
        left: 0,
        top: 0
      };
      const C = c.current.getBoundingClientRect(), _ = 180, R = 160;
      let A = C.left, T = C.bottom + 8;
      return A + _ > window.innerWidth - 8 && (A = window.innerWidth - _ - 8), T + R > window.innerHeight - 8 && (T = C.top - R - 8), {
        left: A,
        top: T
      };
    }, []);
    return b.jsxs(b.Fragment, {
      children: [
        b.jsx(Nn, {
          label: n.label,
          className: i ? "[&>div:last-child]:hidden" : void 0,
          children: b.jsx("button", {
            ref: c,
            onClick: v,
            onContextMenu: y,
            onMouseDown: S,
            onMouseUp: E,
            onMouseLeave: E,
            className: q("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
            children: b.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: b.jsx(p, {
                className: q("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        i && Io.createPortal(b.jsx("div", {
          ref: f,
          className: q("fixed z-[9999] rounded-xl border p-2 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: (() => {
            const C = w();
            return {
              left: `${C.left}px`,
              top: `${C.top}px`
            };
          })(),
          children: b.jsx("div", {
            className: "grid grid-cols-4 gap-1",
            children: dv.map((C) => b.jsx(Nn, {
              label: C.label,
              children: b.jsx("button", {
                onClick: () => k(C),
                className: q("cursor-pointer rounded-lg p-1.5 transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                children: b.jsx(C.icon, {
                  className: q("h-5 w-5", l ? "text-white/90" : "text-black/90")
                })
              })
            }, C.id))
          })
        }), document.body)
      ]
    });
  }
  function RM({ isDark: l }) {
    const n = qt((c) => c.open), a = qt((c) => c.isOpen), i = qt((c) => c.initialSearch), s = a && !!i;
    return b.jsx(Nn, {
      label: "Instance",
      shortcut: {
        key: "I"
      },
      children: b.jsx("button", {
        onClick: () => n("add instance "),
        className: q("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", s && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: b.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: b.jsx(X1, {
            className: q("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function LM({ isDark: l }) {
    const n = qt((c) => c.isOpen), a = qt((c) => c.initialSearch), i = qt((c) => c.toggle), s = n && !a;
    return b.jsx(Nn, {
      label: "Commands",
      shortcut: {
        modifiers: [
          Ne.mod
        ],
        key: "K"
      },
      children: b.jsx("button", {
        onClick: i,
        className: q("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", s && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: b.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: b.jsx($1, {
            className: q("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function AM() {
    const l = he((h) => h.theme), n = he((h) => h.zenMode), { isLg: a, isMd: i, isSm: s } = Bf(), c = To(), f = m.useRef(null);
    return m.useEffect(() => {
      f.current === null ? a && (he.getState().setExplorerCollapsed(false), he.getState().setSidebarCollapsed(false)) : f.current && !a ? (he.getState().setExplorerCollapsed(true), he.getState().setSidebarCollapsed(true)) : !f.current && a && (he.getState().setExplorerCollapsed(false), he.getState().setSidebarCollapsed(false)), f.current = a;
    }, [
      a
    ]), m.useEffect(() => {
      if (!qn || c) return;
      const h = async (p) => {
        if (p.metaKey || p.ctrlKey) if (p.key === "n") p.preventDefault(), await Xf();
        else if (p.key === "o") {
          if (p.preventDefault(), !await zo()) return;
          const y = await Fv();
          y && await wf(y);
        } else p.key === "s" && p.shiftKey ? (p.preventDefault(), await Cf(true)) : p.key === "s" && (p.preventDefault(), await Cf(false));
      };
      return window.addEventListener("keydown", h), () => window.removeEventListener("keydown", h);
    }, [
      c
    ]), m.useEffect(() => {
      if (!qn || c) return;
      let h = null, p = false;
      return (async () => {
        try {
          const { getCurrentWebviewWindow: g } = await pt(async () => {
            const { getCurrentWebviewWindow: S } = await import("./webviewWindow-C3TqIfWq.js");
            return {
              getCurrentWebviewWindow: S
            };
          }, __vite__mapDeps([3,1,2]), import.meta.url), y = await g().onDragDropEvent(async (S) => {
            if (S.payload.type === "drop") {
              const k = S.payload.paths.find((w) => w.endsWith(".gds") || w.endsWith(".gds2") || w.endsWith(".gdsii"));
              if (k) {
                if (!await zo()) return;
                await wf(k);
              }
            }
          });
          p ? y() : h = y;
        } catch {
        }
      })(), () => {
        p = true, h == null ? void 0 : h();
      };
    }, [
      c
    ]), c ? b.jsxs("div", {
      className: `flex h-screen w-screen flex-col ${l === "dark" ? "bg-black" : "bg-white"}`,
      children: [
        b.jsxs("div", {
          className: "relative min-h-0 flex-1",
          children: [
            b.jsx(jy, {}),
            !n && b.jsx(uv, {
              compact: false,
              minimal: false
            }),
            !n && b.jsx(Wb, {}),
            !n && b.jsx(nv, {}),
            b.jsx(Jb, {}),
            b.jsx(qy, {})
          ]
        }),
        b.jsx(av, {
          compact: i || s,
          minimal: s
        })
      ]
    }) : b.jsxs("div", {
      className: `flex h-screen w-screen flex-col ${l === "dark" ? "bg-black" : "bg-white"}`,
      children: [
        b.jsxs("div", {
          className: "relative min-h-0 flex-1",
          children: [
            b.jsx(jy, {}),
            !n && b.jsx(uv, {
              compact: !a,
              minimal: s
            }),
            !n && b.jsx(Wb, {}),
            !n && b.jsx(nv, {}),
            !s && b.jsx(Jb, {}),
            b.jsx(qy, {})
          ]
        }),
        b.jsx(av, {
          compact: i || s,
          minimal: s
        })
      ]
    });
  }
  hS.createRoot(document.getElementById("root")).render(b.jsx(m.StrictMode, {
    children: b.jsx(AM, {})
  }));
})();
