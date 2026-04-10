const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-C2Rw4G7o.js","./core-DxBnVPgq.js","./event-BC8TvpKC.js","./index-DWHWQ1OU.js","./index-BQlnJ-sT.js","./webviewWindow-DoRoZnHQ.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(async () => {
  function oS(l, n) {
    for (var r = 0; r < n.length; r++) {
      const o = n[r];
      if (typeof o != "string" && !Array.isArray(o)) {
        for (const i in o) if (i !== "default" && !(i in l)) {
          const c = Object.getOwnPropertyDescriptor(o, i);
          c && Object.defineProperty(l, i, c.get ? c : {
            enumerable: true,
            get: () => o[i]
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
    for (const i of document.querySelectorAll('link[rel="modulepreload"]')) o(i);
    new MutationObserver((i) => {
      for (const c of i) if (c.type === "childList") for (const d of c.addedNodes) d.tagName === "LINK" && d.rel === "modulepreload" && o(d);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(i) {
      const c = {};
      return i.integrity && (c.integrity = i.integrity), i.referrerPolicy && (c.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? c.credentials = "include" : i.crossOrigin === "anonymous" ? c.credentials = "omit" : c.credentials = "same-origin", c;
    }
    function o(i) {
      if (i.ep) return;
      i.ep = true;
      const c = r(i);
      fetch(i.href, c);
    }
  })();
  function r0(l) {
    return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
  }
  var Td = {
    exports: {}
  }, Vo = {};
  var hy;
  function sS() {
    if (hy) return Vo;
    hy = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
    function r(o, i, c) {
      var d = null;
      if (c !== void 0 && (d = "" + c), i.key !== void 0 && (d = "" + i.key), "key" in i) {
        c = {};
        for (var f in i) f !== "key" && (c[f] = i[f]);
      } else c = i;
      return i = c.ref, {
        $$typeof: l,
        type: o,
        key: d,
        ref: i !== void 0 ? i : null,
        props: c
      };
    }
    return Vo.Fragment = n, Vo.jsx = r, Vo.jsxs = r, Vo;
  }
  var my;
  function iS() {
    return my || (my = 1, Td.exports = sS()), Td.exports;
  }
  var y = iS(), Nd = {
    exports: {}
  }, De = {};
  var gy;
  function cS() {
    if (gy) return De;
    gy = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), c = Symbol.for("react.consumer"), d = Symbol.for("react.context"), f = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), x = Symbol.for("react.activity"), S = Symbol.iterator;
    function C(L) {
      return L === null || typeof L != "object" ? null : (L = S && L[S] || L["@@iterator"], typeof L == "function" ? L : null);
    }
    var _ = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    }, b = Object.assign, E = {};
    function k(L, z, Z) {
      this.props = L, this.context = z, this.refs = E, this.updater = Z || _;
    }
    k.prototype.isReactComponent = {}, k.prototype.setState = function(L, z) {
      if (typeof L != "object" && typeof L != "function" && L != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, L, z, "setState");
    }, k.prototype.forceUpdate = function(L) {
      this.updater.enqueueForceUpdate(this, L, "forceUpdate");
    };
    function O() {
    }
    O.prototype = k.prototype;
    function R(L, z, Z) {
      this.props = L, this.context = z, this.refs = E, this.updater = Z || _;
    }
    var T = R.prototype = new O();
    T.constructor = R, b(T, k.prototype), T.isPureReactComponent = true;
    var N = Array.isArray;
    function I() {
    }
    var A = {
      H: null,
      A: null,
      T: null,
      S: null
    }, D = Object.prototype.hasOwnProperty;
    function U(L, z, Z) {
      var Q = Z.ref;
      return {
        $$typeof: l,
        type: L,
        key: z,
        ref: Q !== void 0 ? Q : null,
        props: Z
      };
    }
    function B(L, z) {
      return U(L.type, z, L.props);
    }
    function ne(L) {
      return typeof L == "object" && L !== null && L.$$typeof === l;
    }
    function W(L) {
      var z = {
        "=": "=0",
        ":": "=2"
      };
      return "$" + L.replace(/[=:]/g, function(Z) {
        return z[Z];
      });
    }
    var J = /\/+/g;
    function fe(L, z) {
      return typeof L == "object" && L !== null && L.key != null ? W("" + L.key) : z.toString(36);
    }
    function xe(L) {
      switch (L.status) {
        case "fulfilled":
          return L.value;
        case "rejected":
          throw L.reason;
        default:
          switch (typeof L.status == "string" ? L.then(I, I) : (L.status = "pending", L.then(function(z) {
            L.status === "pending" && (L.status = "fulfilled", L.value = z);
          }, function(z) {
            L.status === "pending" && (L.status = "rejected", L.reason = z);
          })), L.status) {
            case "fulfilled":
              return L.value;
            case "rejected":
              throw L.reason;
          }
      }
      throw L;
    }
    function $(L, z, Z, Q, te) {
      var ce = typeof L;
      (ce === "undefined" || ce === "boolean") && (L = null);
      var ge = false;
      if (L === null) ge = true;
      else switch (ce) {
        case "bigint":
        case "string":
        case "number":
          ge = true;
          break;
        case "object":
          switch (L.$$typeof) {
            case l:
            case n:
              ge = true;
              break;
            case v:
              return ge = L._init, $(ge(L._payload), z, Z, Q, te);
          }
      }
      if (ge) return te = te(L), ge = Q === "" ? "." + fe(L, 0) : Q, N(te) ? (Z = "", ge != null && (Z = ge.replace(J, "$&/") + "/"), $(te, z, Z, "", function(ee) {
        return ee;
      })) : te != null && (ne(te) && (te = B(te, Z + (te.key == null || L && L.key === te.key ? "" : ("" + te.key).replace(J, "$&/") + "/") + ge)), z.push(te)), 1;
      ge = 0;
      var je = Q === "" ? "." : Q + ":";
      if (N(L)) for (var j = 0; j < L.length; j++) Q = L[j], ce = je + fe(Q, j), ge += $(Q, z, Z, ce, te);
      else if (j = C(L), typeof j == "function") for (L = j.call(L), j = 0; !(Q = L.next()).done; ) Q = Q.value, ce = je + fe(Q, j++), ge += $(Q, z, Z, ce, te);
      else if (ce === "object") {
        if (typeof L.then == "function") return $(xe(L), z, Z, Q, te);
        throw z = String(L), Error("Objects are not valid as a React child (found: " + (z === "[object Object]" ? "object with keys {" + Object.keys(L).join(", ") + "}" : z) + "). If you meant to render a collection of children, use an array instead.");
      }
      return ge;
    }
    function K(L, z, Z) {
      if (L == null) return L;
      var Q = [], te = 0;
      return $(L, Q, "", "", function(ce) {
        return z.call(Z, ce, te++);
      }), Q;
    }
    function me(L) {
      if (L._status === -1) {
        var z = L._result;
        z = z(), z.then(function(Z) {
          (L._status === 0 || L._status === -1) && (L._status = 1, L._result = Z);
        }, function(Z) {
          (L._status === 0 || L._status === -1) && (L._status = 2, L._result = Z);
        }), L._status === -1 && (L._status = 0, L._result = z);
      }
      if (L._status === 1) return L._result.default;
      throw L._result;
    }
    var ye = typeof reportError == "function" ? reportError : function(L) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var z = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: typeof L == "object" && L !== null && typeof L.message == "string" ? String(L.message) : String(L),
          error: L
        });
        if (!window.dispatchEvent(z)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", L);
        return;
      }
      console.error(L);
    }, ke = {
      map: K,
      forEach: function(L, z, Z) {
        K(L, function() {
          z.apply(this, arguments);
        }, Z);
      },
      count: function(L) {
        var z = 0;
        return K(L, function() {
          z++;
        }), z;
      },
      toArray: function(L) {
        return K(L, function(z) {
          return z;
        }) || [];
      },
      only: function(L) {
        if (!ne(L)) throw Error("React.Children.only expected to receive a single React element child.");
        return L;
      }
    };
    return De.Activity = x, De.Children = ke, De.Component = k, De.Fragment = r, De.Profiler = i, De.PureComponent = R, De.StrictMode = o, De.Suspense = m, De.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = A, De.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(L) {
        return A.H.useMemoCache(L);
      }
    }, De.cache = function(L) {
      return function() {
        return L.apply(null, arguments);
      };
    }, De.cacheSignal = function() {
      return null;
    }, De.cloneElement = function(L, z, Z) {
      if (L == null) throw Error("The argument must be a React element, but you passed " + L + ".");
      var Q = b({}, L.props), te = L.key;
      if (z != null) for (ce in z.key !== void 0 && (te = "" + z.key), z) !D.call(z, ce) || ce === "key" || ce === "__self" || ce === "__source" || ce === "ref" && z.ref === void 0 || (Q[ce] = z[ce]);
      var ce = arguments.length - 2;
      if (ce === 1) Q.children = Z;
      else if (1 < ce) {
        for (var ge = Array(ce), je = 0; je < ce; je++) ge[je] = arguments[je + 2];
        Q.children = ge;
      }
      return U(L.type, te, Q);
    }, De.createContext = function(L) {
      return L = {
        $$typeof: d,
        _currentValue: L,
        _currentValue2: L,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      }, L.Provider = L, L.Consumer = {
        $$typeof: c,
        _context: L
      }, L;
    }, De.createElement = function(L, z, Z) {
      var Q, te = {}, ce = null;
      if (z != null) for (Q in z.key !== void 0 && (ce = "" + z.key), z) D.call(z, Q) && Q !== "key" && Q !== "__self" && Q !== "__source" && (te[Q] = z[Q]);
      var ge = arguments.length - 2;
      if (ge === 1) te.children = Z;
      else if (1 < ge) {
        for (var je = Array(ge), j = 0; j < ge; j++) je[j] = arguments[j + 2];
        te.children = je;
      }
      if (L && L.defaultProps) for (Q in ge = L.defaultProps, ge) te[Q] === void 0 && (te[Q] = ge[Q]);
      return U(L, ce, te);
    }, De.createRef = function() {
      return {
        current: null
      };
    }, De.forwardRef = function(L) {
      return {
        $$typeof: f,
        render: L
      };
    }, De.isValidElement = ne, De.lazy = function(L) {
      return {
        $$typeof: v,
        _payload: {
          _status: -1,
          _result: L
        },
        _init: me
      };
    }, De.memo = function(L, z) {
      return {
        $$typeof: p,
        type: L,
        compare: z === void 0 ? null : z
      };
    }, De.startTransition = function(L) {
      var z = A.T, Z = {};
      A.T = Z;
      try {
        var Q = L(), te = A.S;
        te !== null && te(Z, Q), typeof Q == "object" && Q !== null && typeof Q.then == "function" && Q.then(I, ye);
      } catch (ce) {
        ye(ce);
      } finally {
        z !== null && Z.types !== null && (z.types = Z.types), A.T = z;
      }
    }, De.unstable_useCacheRefresh = function() {
      return A.H.useCacheRefresh();
    }, De.use = function(L) {
      return A.H.use(L);
    }, De.useActionState = function(L, z, Z) {
      return A.H.useActionState(L, z, Z);
    }, De.useCallback = function(L, z) {
      return A.H.useCallback(L, z);
    }, De.useContext = function(L) {
      return A.H.useContext(L);
    }, De.useDebugValue = function() {
    }, De.useDeferredValue = function(L, z) {
      return A.H.useDeferredValue(L, z);
    }, De.useEffect = function(L, z) {
      return A.H.useEffect(L, z);
    }, De.useEffectEvent = function(L) {
      return A.H.useEffectEvent(L);
    }, De.useId = function() {
      return A.H.useId();
    }, De.useImperativeHandle = function(L, z, Z) {
      return A.H.useImperativeHandle(L, z, Z);
    }, De.useInsertionEffect = function(L, z) {
      return A.H.useInsertionEffect(L, z);
    }, De.useLayoutEffect = function(L, z) {
      return A.H.useLayoutEffect(L, z);
    }, De.useMemo = function(L, z) {
      return A.H.useMemo(L, z);
    }, De.useOptimistic = function(L, z) {
      return A.H.useOptimistic(L, z);
    }, De.useReducer = function(L, z, Z) {
      return A.H.useReducer(L, z, Z);
    }, De.useRef = function(L) {
      return A.H.useRef(L);
    }, De.useState = function(L) {
      return A.H.useState(L);
    }, De.useSyncExternalStore = function(L, z, Z) {
      return A.H.useSyncExternalStore(L, z, Z);
    }, De.useTransition = function() {
      return A.H.useTransition();
    }, De.version = "19.2.4", De;
  }
  var py;
  function oh() {
    return py || (py = 1, Nd.exports = cS()), Nd.exports;
  }
  var g = oh();
  const Va = r0(g), sh = oS({
    __proto__: null,
    default: Va
  }, [
    g
  ]);
  var Od = {
    exports: {}
  }, $o = {}, Id = {
    exports: {}
  }, Dd = {};
  var yy;
  function uS() {
    return yy || (yy = 1, (function(l) {
      function n($, K) {
        var me = $.length;
        $.push(K);
        e: for (; 0 < me; ) {
          var ye = me - 1 >>> 1, ke = $[ye];
          if (0 < i(ke, K)) $[ye] = K, $[me] = ke, me = ye;
          else break e;
        }
      }
      function r($) {
        return $.length === 0 ? null : $[0];
      }
      function o($) {
        if ($.length === 0) return null;
        var K = $[0], me = $.pop();
        if (me !== K) {
          $[0] = me;
          e: for (var ye = 0, ke = $.length, L = ke >>> 1; ye < L; ) {
            var z = 2 * (ye + 1) - 1, Z = $[z], Q = z + 1, te = $[Q];
            if (0 > i(Z, me)) Q < ke && 0 > i(te, Z) ? ($[ye] = te, $[Q] = me, ye = Q) : ($[ye] = Z, $[z] = me, ye = z);
            else if (Q < ke && 0 > i(te, me)) $[ye] = te, $[Q] = me, ye = Q;
            else break e;
          }
        }
        return K;
      }
      function i($, K) {
        var me = $.sortIndex - K.sortIndex;
        return me !== 0 ? me : $.id - K.id;
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
      var m = [], p = [], v = 1, x = null, S = 3, C = false, _ = false, b = false, E = false, k = typeof setTimeout == "function" ? setTimeout : null, O = typeof clearTimeout == "function" ? clearTimeout : null, R = typeof setImmediate < "u" ? setImmediate : null;
      function T($) {
        for (var K = r(p); K !== null; ) {
          if (K.callback === null) o(p);
          else if (K.startTime <= $) o(p), K.sortIndex = K.expirationTime, n(m, K);
          else break;
          K = r(p);
        }
      }
      function N($) {
        if (b = false, T($), !_) if (r(m) !== null) _ = true, I || (I = true, W());
        else {
          var K = r(p);
          K !== null && xe(N, K.startTime - $);
        }
      }
      var I = false, A = -1, D = 5, U = -1;
      function B() {
        return E ? true : !(l.unstable_now() - U < D);
      }
      function ne() {
        if (E = false, I) {
          var $ = l.unstable_now();
          U = $;
          var K = true;
          try {
            e: {
              _ = false, b && (b = false, O(A), A = -1), C = true;
              var me = S;
              try {
                t: {
                  for (T($), x = r(m); x !== null && !(x.expirationTime > $ && B()); ) {
                    var ye = x.callback;
                    if (typeof ye == "function") {
                      x.callback = null, S = x.priorityLevel;
                      var ke = ye(x.expirationTime <= $);
                      if ($ = l.unstable_now(), typeof ke == "function") {
                        x.callback = ke, T($), K = true;
                        break t;
                      }
                      x === r(m) && o(m), T($);
                    } else o(m);
                    x = r(m);
                  }
                  if (x !== null) K = true;
                  else {
                    var L = r(p);
                    L !== null && xe(N, L.startTime - $), K = false;
                  }
                }
                break e;
              } finally {
                x = null, S = me, C = false;
              }
              K = void 0;
            }
          } finally {
            K ? W() : I = false;
          }
        }
      }
      var W;
      if (typeof R == "function") W = function() {
        R(ne);
      };
      else if (typeof MessageChannel < "u") {
        var J = new MessageChannel(), fe = J.port2;
        J.port1.onmessage = ne, W = function() {
          fe.postMessage(null);
        };
      } else W = function() {
        k(ne, 0);
      };
      function xe($, K) {
        A = k(function() {
          $(l.unstable_now());
        }, K);
      }
      l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function($) {
        $.callback = null;
      }, l.unstable_forceFrameRate = function($) {
        0 > $ || 125 < $ ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : D = 0 < $ ? Math.floor(1e3 / $) : 5;
      }, l.unstable_getCurrentPriorityLevel = function() {
        return S;
      }, l.unstable_next = function($) {
        switch (S) {
          case 1:
          case 2:
          case 3:
            var K = 3;
            break;
          default:
            K = S;
        }
        var me = S;
        S = K;
        try {
          return $();
        } finally {
          S = me;
        }
      }, l.unstable_requestPaint = function() {
        E = true;
      }, l.unstable_runWithPriority = function($, K) {
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
        var me = S;
        S = $;
        try {
          return K();
        } finally {
          S = me;
        }
      }, l.unstable_scheduleCallback = function($, K, me) {
        var ye = l.unstable_now();
        switch (typeof me == "object" && me !== null ? (me = me.delay, me = typeof me == "number" && 0 < me ? ye + me : ye) : me = ye, $) {
          case 1:
            var ke = -1;
            break;
          case 2:
            ke = 250;
            break;
          case 5:
            ke = 1073741823;
            break;
          case 4:
            ke = 1e4;
            break;
          default:
            ke = 5e3;
        }
        return ke = me + ke, $ = {
          id: v++,
          callback: K,
          priorityLevel: $,
          startTime: me,
          expirationTime: ke,
          sortIndex: -1
        }, me > ye ? ($.sortIndex = me, n(p, $), r(m) === null && $ === r(p) && (b ? (O(A), A = -1) : b = true, xe(N, me - ye))) : ($.sortIndex = ke, n(m, $), _ || C || (_ = true, I || (I = true, W()))), $;
      }, l.unstable_shouldYield = B, l.unstable_wrapCallback = function($) {
        var K = S;
        return function() {
          var me = S;
          S = K;
          try {
            return $.apply(this, arguments);
          } finally {
            S = me;
          }
        };
      };
    })(Dd)), Dd;
  }
  var by;
  function dS() {
    return by || (by = 1, Id.exports = uS()), Id.exports;
  }
  var zd = {
    exports: {}
  }, ln = {};
  var vy;
  function fS() {
    if (vy) return ln;
    vy = 1;
    var l = oh();
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
    }, i = Symbol.for("react.portal");
    function c(m, p, v) {
      var x = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: i,
        key: x == null ? null : "" + x,
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
    return ln.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, ln.createPortal = function(m, p) {
      var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11) throw Error(n(299));
      return c(m, p, null, v);
    }, ln.flushSync = function(m) {
      var p = d.T, v = o.p;
      try {
        if (d.T = null, o.p = 2, m) return m();
      } finally {
        d.T = p, o.p = v, o.d.f();
      }
    }, ln.preconnect = function(m, p) {
      typeof m == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, o.d.C(m, p));
    }, ln.prefetchDNS = function(m) {
      typeof m == "string" && o.d.D(m);
    }, ln.preinit = function(m, p) {
      if (typeof m == "string" && p && typeof p.as == "string") {
        var v = p.as, x = f(v, p.crossOrigin), S = typeof p.integrity == "string" ? p.integrity : void 0, C = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
        v === "style" ? o.d.S(m, typeof p.precedence == "string" ? p.precedence : void 0, {
          crossOrigin: x,
          integrity: S,
          fetchPriority: C
        }) : v === "script" && o.d.X(m, {
          crossOrigin: x,
          integrity: S,
          fetchPriority: C,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0
        });
      }
    }, ln.preinitModule = function(m, p) {
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
    }, ln.preload = function(m, p) {
      if (typeof m == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
        var v = p.as, x = f(v, p.crossOrigin);
        o.d.L(m, v, {
          crossOrigin: x,
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
    }, ln.preloadModule = function(m, p) {
      if (typeof m == "string") if (p) {
        var v = f(p.as, p.crossOrigin);
        o.d.m(m, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: v,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else o.d.m(m);
    }, ln.requestFormReset = function(m) {
      o.d.r(m);
    }, ln.unstable_batchedUpdates = function(m, p) {
      return m(p);
    }, ln.useFormState = function(m, p, v) {
      return d.H.useFormState(m, p, v);
    }, ln.useFormStatus = function() {
      return d.H.useHostTransitionStatus();
    }, ln.version = "19.2.4", ln;
  }
  var xy;
  function a0() {
    if (xy) return zd.exports;
    xy = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), zd.exports = fS(), zd.exports;
  }
  var wy;
  function hS() {
    if (wy) return $o;
    wy = 1;
    var l = dS(), n = oh(), r = a0();
    function o(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var a = 2; a < arguments.length; a++) t += "&args[]=" + encodeURIComponent(arguments[a]);
      }
      return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function i(e) {
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
      for (var a = e, s = t; ; ) {
        var u = a.return;
        if (u === null) break;
        var h = u.alternate;
        if (h === null) {
          if (s = u.return, s !== null) {
            a = s;
            continue;
          }
          break;
        }
        if (u.child === h.child) {
          for (h = u.child; h; ) {
            if (h === a) return m(u), e;
            if (h === s) return m(u), t;
            h = h.sibling;
          }
          throw Error(o(188));
        }
        if (a.return !== s.return) a = u, s = h;
        else {
          for (var w = false, M = u.child; M; ) {
            if (M === a) {
              w = true, a = u, s = h;
              break;
            }
            if (M === s) {
              w = true, s = u, a = h;
              break;
            }
            M = M.sibling;
          }
          if (!w) {
            for (M = h.child; M; ) {
              if (M === a) {
                w = true, a = h, s = u;
                break;
              }
              if (M === s) {
                w = true, s = h, a = u;
                break;
              }
              M = M.sibling;
            }
            if (!w) throw Error(o(189));
          }
        }
        if (a.alternate !== s) throw Error(o(190));
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
    var x = Object.assign, S = Symbol.for("react.element"), C = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), E = Symbol.for("react.strict_mode"), k = Symbol.for("react.profiler"), O = Symbol.for("react.consumer"), R = Symbol.for("react.context"), T = Symbol.for("react.forward_ref"), N = Symbol.for("react.suspense"), I = Symbol.for("react.suspense_list"), A = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), U = Symbol.for("react.activity"), B = Symbol.for("react.memo_cache_sentinel"), ne = Symbol.iterator;
    function W(e) {
      return e === null || typeof e != "object" ? null : (e = ne && e[ne] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var J = Symbol.for("react.client.reference");
    function fe(e) {
      if (e == null) return null;
      if (typeof e == "function") return e.$$typeof === J ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case b:
          return "Fragment";
        case k:
          return "Profiler";
        case E:
          return "StrictMode";
        case N:
          return "Suspense";
        case I:
          return "SuspenseList";
        case U:
          return "Activity";
      }
      if (typeof e == "object") switch (e.$$typeof) {
        case _:
          return "Portal";
        case R:
          return e.displayName || "Context";
        case O:
          return (e._context.displayName || "Context") + ".Consumer";
        case T:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case A:
          return t = e.displayName || null, t !== null ? t : fe(e.type) || "Memo";
        case D:
          t = e._payload, e = e._init;
          try {
            return fe(e(t));
          } catch {
          }
      }
      return null;
    }
    var xe = Array.isArray, $ = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, me = {
      pending: false,
      data: null,
      method: null,
      action: null
    }, ye = [], ke = -1;
    function L(e) {
      return {
        current: e
      };
    }
    function z(e) {
      0 > ke || (e.current = ye[ke], ye[ke] = null, ke--);
    }
    function Z(e, t) {
      ke++, ye[ke] = e.current, e.current = t;
    }
    var Q = L(null), te = L(null), ce = L(null), ge = L(null);
    function je(e, t) {
      switch (Z(ce, t), Z(te, e), Z(Q, null), t.nodeType) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Dp(e) : 0;
          break;
        default:
          if (e = t.tagName, t = t.namespaceURI) t = Dp(t), e = zp(t, e);
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
      z(Q), Z(Q, e);
    }
    function j() {
      z(Q), z(te), z(ce);
    }
    function ee(e) {
      e.memoizedState !== null && Z(ge, e);
      var t = Q.current, a = zp(t, e.type);
      t !== a && (Z(te, e), Z(Q, a));
    }
    function oe(e) {
      te.current === e && (z(Q), z(te)), ge.current === e && (z(ge), Yo._currentValue = me);
    }
    var pe, Ee;
    function Se(e) {
      if (pe === void 0) try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        pe = t && t[1] || "", Ee = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
      return `
` + pe + e + Ee;
    }
    var Be = false;
    function Qe(e, t) {
      if (!e || Be) return "";
      Be = true;
      var a = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var s = {
          DetermineComponentFrameRoot: function() {
            try {
              if (t) {
                var se = function() {
                  throw Error();
                };
                if (Object.defineProperty(se.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(se, []);
                  } catch (F) {
                    var P = F;
                  }
                  Reflect.construct(e, [], se);
                } else {
                  try {
                    se.call();
                  } catch (F) {
                    P = F;
                  }
                  e.call(se.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (F) {
                  P = F;
                }
                (se = e()) && typeof se.catch == "function" && se.catch(function() {
                });
              }
            } catch (F) {
              if (F && P && typeof F.stack == "string") return [
                F.stack,
                P.stack
              ];
            }
            return [
              null,
              null
            ];
          }
        };
        s.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var u = Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot, "name");
        u && u.configurable && Object.defineProperty(s.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot"
        });
        var h = s.DetermineComponentFrameRoot(), w = h[0], M = h[1];
        if (w && M) {
          var H = w.split(`
`), G = M.split(`
`);
          for (u = s = 0; s < H.length && !H[s].includes("DetermineComponentFrameRoot"); ) s++;
          for (; u < G.length && !G[u].includes("DetermineComponentFrameRoot"); ) u++;
          if (s === H.length || u === G.length) for (s = H.length - 1, u = G.length - 1; 1 <= s && 0 <= u && H[s] !== G[u]; ) u--;
          for (; 1 <= s && 0 <= u; s--, u--) if (H[s] !== G[u]) {
            if (s !== 1 || u !== 1) do
              if (s--, u--, 0 > u || H[s] !== G[u]) {
                var re = `
` + H[s].replace(" at new ", " at ");
                return e.displayName && re.includes("<anonymous>") && (re = re.replace("<anonymous>", e.displayName)), re;
              }
            while (1 <= s && 0 <= u);
            break;
          }
        }
      } finally {
        Be = false, Error.prepareStackTrace = a;
      }
      return (a = e ? e.displayName || e.name : "") ? Se(a) : "";
    }
    function Ce(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return Se(e.type);
        case 16:
          return Se("Lazy");
        case 13:
          return e.child !== t && t !== null ? Se("Suspense Fallback") : Se("Suspense");
        case 19:
          return Se("SuspenseList");
        case 0:
        case 15:
          return Qe(e.type, false);
        case 11:
          return Qe(e.type.render, false);
        case 1:
          return Qe(e.type, true);
        case 31:
          return Se("Activity");
        default:
          return "";
      }
    }
    function Xe(e) {
      try {
        var t = "", a = null;
        do
          t += Ce(e, a), a = e, e = e.return;
        while (e);
        return t;
      } catch (s) {
        return `
Error generating stack: ` + s.message + `
` + s.stack;
      }
    }
    var Re = Object.prototype.hasOwnProperty, nt = l.unstable_scheduleCallback, Te = l.unstable_cancelCallback, lt = l.unstable_shouldYield, wt = l.unstable_requestPaint, st = l.unstable_now, sn = l.unstable_getCurrentPriorityLevel, ul = l.unstable_ImmediatePriority, dl = l.unstable_UserBlockingPriority, Rn = l.unstable_NormalPriority, ct = l.unstable_LowPriority, Rt = l.unstable_IdlePriority, cn = l.log, qn = l.unstable_setDisableYieldValue, Kt = null, St = null;
    function Pt(e) {
      if (typeof cn == "function" && qn(e), St && typeof St.setStrictMode == "function") try {
        St.setStrictMode(Kt, e);
      } catch {
      }
    }
    var zt = Math.clz32 ? Math.clz32 : Fa, Ul = Math.log, Ka = Math.LN2;
    function Fa(e) {
      return e >>>= 0, e === 0 ? 32 : 31 - (Ul(e) / Ka | 0) | 0;
    }
    var Qr = 256, Wr = 262144, wr = 4194304;
    function el(e) {
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
    function Sr(e, t, a) {
      var s = e.pendingLanes;
      if (s === 0) return 0;
      var u = 0, h = e.suspendedLanes, w = e.pingedLanes;
      e = e.warmLanes;
      var M = s & 134217727;
      return M !== 0 ? (s = M & ~h, s !== 0 ? u = el(s) : (w &= M, w !== 0 ? u = el(w) : a || (a = M & ~e, a !== 0 && (u = el(a))))) : (M = s & ~h, M !== 0 ? u = el(M) : w !== 0 ? u = el(w) : a || (a = s & ~e, a !== 0 && (u = el(a)))), u === 0 ? 0 : t !== 0 && t !== u && (t & h) === 0 && (h = u & -u, a = t & -t, h >= a || h === 32 && (a & 4194048) !== 0) ? t : u;
    }
    function Cr(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function kc(e, t) {
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
    function Er() {
      var e = wr;
      return wr <<= 1, (wr & 62914560) === 0 && (wr = 4194304), e;
    }
    function _r(e) {
      for (var t = [], a = 0; 31 > a; a++) t.push(e);
      return t;
    }
    function fl(e, t) {
      e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
    }
    function xs(e, t, a, s, u, h) {
      var w = e.pendingLanes;
      e.pendingLanes = a, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= a, e.entangledLanes &= a, e.errorRecoveryDisabledLanes &= a, e.shellSuspendCounter = 0;
      var M = e.entanglements, H = e.expirationTimes, G = e.hiddenUpdates;
      for (a = w & ~a; 0 < a; ) {
        var re = 31 - zt(a), se = 1 << re;
        M[re] = 0, H[re] = -1;
        var P = G[re];
        if (P !== null) for (G[re] = null, re = 0; re < P.length; re++) {
          var F = P[re];
          F !== null && (F.lane &= -536870913);
        }
        a &= ~se;
      }
      s !== 0 && Jr(e, s, 0), h !== 0 && u === 0 && e.tag !== 0 && (e.suspendedLanes |= h & ~(w & ~t));
    }
    function Jr(e, t, a) {
      e.pendingLanes |= t, e.suspendedLanes &= ~t;
      var s = 31 - zt(t);
      e.entangledLanes |= t, e.entanglements[s] = e.entanglements[s] | 1073741824 | a & 261930;
    }
    function ea(e, t) {
      var a = e.entangledLanes |= t;
      for (e = e.entanglements; a; ) {
        var s = 31 - zt(a), u = 1 << s;
        u & t | e[s] & t && (e[s] |= t), a &= ~u;
      }
    }
    function ws(e, t) {
      var a = t & -t;
      return a = (a & 42) !== 0 ? 1 : An(a), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
    }
    function An(e) {
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
    function Qa(e) {
      return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
    }
    function Wa() {
      var e = K.p;
      return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : oy(e.type));
    }
    function Ss(e, t) {
      var a = K.p;
      try {
        return K.p = e, t();
      } finally {
        K.p = a;
      }
    }
    var tl = Math.random().toString(36).slice(2), jt = "__reactFiber$" + tl, tn = "__reactProps$" + tl, fn = "__reactContainer$" + tl, Bl = "__reactEvents$" + tl, Rh = "__reactListeners$" + tl, Mc = "__reactHandles$" + tl, le = "__reactResources$" + tl, Oe = "__reactMarker$" + tl;
    function ut(e) {
      delete e[jt], delete e[tn], delete e[Bl], delete e[Rh], delete e[Mc];
    }
    function He(e) {
      var t = e[jt];
      if (t) return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[fn] || a[jt]) {
          if (a = t.alternate, t.child !== null || a !== null && a.child !== null) for (e = $p(e); e !== null; ) {
            if (a = e[jt]) return a;
            e = $p(e);
          }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Je(e) {
      if (e = e[jt] || e[fn]) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
      }
      return null;
    }
    function We(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(o(33));
    }
    function et(e) {
      var t = e[le];
      return t || (t = e[le] = {
        hoistableStyles: /* @__PURE__ */ new Map(),
        hoistableScripts: /* @__PURE__ */ new Map()
      }), t;
    }
    function Ne(e) {
      e[Oe] = true;
    }
    var Ht = /* @__PURE__ */ new Set(), Ct = {};
    function ft(e, t) {
      Nt(e, t), Nt(e + "Capture", t);
    }
    function Nt(e, t) {
      for (Ct[e] = t, e = 0; e < t.length; e++) Ht.add(t[e]);
    }
    var hn = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Gn = {}, hl = {};
    function ml(e) {
      return Re.call(hl, e) ? true : Re.call(Gn, e) ? false : hn.test(e) ? hl[e] = true : (Gn[e] = true, false);
    }
    function gl(e, t, a) {
      if (ml(t)) if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var s = t.toLowerCase().slice(0, 5);
            if (s !== "data-" && s !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + a);
      }
    }
    function pl(e, t, a) {
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
    function nn(e, t, a, s) {
      if (s === null) e.removeAttribute(a);
      else {
        switch (typeof s) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(a);
            return;
        }
        e.setAttributeNS(t, a, "" + s);
      }
    }
    function Ft(e) {
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
    function ta(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function kr(e, t, a) {
      var s = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (!e.hasOwnProperty(t) && typeof s < "u" && typeof s.get == "function" && typeof s.set == "function") {
        var u = s.get, h = s.set;
        return Object.defineProperty(e, t, {
          configurable: true,
          get: function() {
            return u.call(this);
          },
          set: function(w) {
            a = "" + w, h.call(this, w);
          }
        }), Object.defineProperty(e, t, {
          enumerable: s.enumerable
        }), {
          getValue: function() {
            return a;
          },
          setValue: function(w) {
            a = "" + w;
          },
          stopTracking: function() {
            e._valueTracker = null, delete e[t];
          }
        };
      }
    }
    function nl(e) {
      if (!e._valueTracker) {
        var t = ta(e) ? "checked" : "value";
        e._valueTracker = kr(e, t, "" + e[t]);
      }
    }
    function na(e) {
      if (!e) return false;
      var t = e._valueTracker;
      if (!t) return true;
      var a = t.getValue(), s = "";
      return e && (s = ta(e) ? e.checked ? "true" : "false" : e.value), e = s, e !== a ? (t.setValue(e), true) : false;
    }
    function yl(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Cs = /[\n"\\]/g;
    function mn(e) {
      return e.replace(Cs, function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      });
    }
    function Ja(e, t, a, s, u, h, w, M) {
      e.name = "", w != null && typeof w != "function" && typeof w != "symbol" && typeof w != "boolean" ? e.type = w : e.removeAttribute("type"), t != null ? w === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ft(t)) : e.value !== "" + Ft(t) && (e.value = "" + Ft(t)) : w !== "submit" && w !== "reset" || e.removeAttribute("value"), t != null ? la(e, w, Ft(t)) : a != null ? la(e, w, Ft(a)) : s != null && e.removeAttribute("value"), u == null && h != null && (e.defaultChecked = !!h), u != null && (e.checked = u && typeof u != "function" && typeof u != "symbol"), M != null && typeof M != "function" && typeof M != "symbol" && typeof M != "boolean" ? e.name = "" + Ft(M) : e.removeAttribute("name");
    }
    function eo(e, t, a, s, u, h, w, M) {
      if (h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" && (e.type = h), t != null || a != null) {
        if (!(h !== "submit" && h !== "reset" || t != null)) {
          nl(e);
          return;
        }
        a = a != null ? "" + Ft(a) : "", t = t != null ? "" + Ft(t) : a, M || t === e.value || (e.value = t), e.defaultValue = t;
      }
      s = s ?? u, s = typeof s != "function" && typeof s != "symbol" && !!s, e.checked = M ? e.checked : !!s, e.defaultChecked = !!s, w != null && typeof w != "function" && typeof w != "symbol" && typeof w != "boolean" && (e.name = w), nl(e);
    }
    function la(e, t, a) {
      t === "number" && yl(e.ownerDocument) === e || e.defaultValue === "" + a || (e.defaultValue = "" + a);
    }
    function ra(e, t, a, s) {
      if (e = e.options, t) {
        t = {};
        for (var u = 0; u < a.length; u++) t["$" + a[u]] = true;
        for (a = 0; a < e.length; a++) u = t.hasOwnProperty("$" + e[a].value), e[a].selected !== u && (e[a].selected = u), u && s && (e[a].defaultSelected = true);
      } else {
        for (a = "" + Ft(a), t = null, u = 0; u < e.length; u++) {
          if (e[u].value === a) {
            e[u].selected = true, s && (e[u].defaultSelected = true);
            return;
          }
          t !== null || e[u].disabled || (t = e[u]);
        }
        t !== null && (t.selected = true);
      }
    }
    function Ah(e, t, a) {
      if (t != null && (t = "" + Ft(t), t !== e.value && (e.value = t), a == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = a != null ? "" + Ft(a) : "";
    }
    function Th(e, t, a, s) {
      if (t == null) {
        if (s != null) {
          if (a != null) throw Error(o(92));
          if (xe(s)) {
            if (1 < s.length) throw Error(o(93));
            s = s[0];
          }
          a = s;
        }
        a == null && (a = ""), t = a;
      }
      a = Ft(t), e.defaultValue = a, s = e.textContent, s === a && s !== "" && s !== null && (e.value = s), nl(e);
    }
    function aa(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === 3) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var tx = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function Nh(e, t, a) {
      var s = t.indexOf("--") === 0;
      a == null || typeof a == "boolean" || a === "" ? s ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : s ? e.setProperty(t, a) : typeof a != "number" || a === 0 || tx.has(t) ? t === "float" ? e.cssFloat = a : e[t] = ("" + a).trim() : e[t] = a + "px";
    }
    function Oh(e, t, a) {
      if (t != null && typeof t != "object") throw Error(o(62));
      if (e = e.style, a != null) {
        for (var s in a) !a.hasOwnProperty(s) || t != null && t.hasOwnProperty(s) || (s.indexOf("--") === 0 ? e.setProperty(s, "") : s === "float" ? e.cssFloat = "" : e[s] = "");
        for (var u in t) s = t[u], t.hasOwnProperty(u) && a[u] !== s && Nh(e, u, s);
      } else for (var h in t) t.hasOwnProperty(h) && Nh(e, h, t[h]);
    }
    function jc(e) {
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
    var nx = /* @__PURE__ */ new Map([
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
    ]), lx = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Es(e) {
      return lx.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
    }
    function bl() {
    }
    var Lc = null;
    function Rc(e) {
      return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
    }
    var oa = null, sa = null;
    function Ih(e) {
      var t = Je(e);
      if (t && (e = t.stateNode)) {
        var a = e[tn] || null;
        e: switch (e = t.stateNode, t.type) {
          case "input":
            if (Ja(e, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name), t = a.name, a.type === "radio" && t != null) {
              for (a = e; a.parentNode; ) a = a.parentNode;
              for (a = a.querySelectorAll('input[name="' + mn("" + t) + '"][type="radio"]'), t = 0; t < a.length; t++) {
                var s = a[t];
                if (s !== e && s.form === e.form) {
                  var u = s[tn] || null;
                  if (!u) throw Error(o(90));
                  Ja(s, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name);
                }
              }
              for (t = 0; t < a.length; t++) s = a[t], s.form === e.form && na(s);
            }
            break e;
          case "textarea":
            Ah(e, a.value, a.defaultValue);
            break e;
          case "select":
            t = a.value, t != null && ra(e, !!a.multiple, t, false);
        }
      }
    }
    var Ac = false;
    function Dh(e, t, a) {
      if (Ac) return e(t, a);
      Ac = true;
      try {
        var s = e(t);
        return s;
      } finally {
        if (Ac = false, (oa !== null || sa !== null) && (di(), oa && (t = oa, e = sa, sa = oa = null, Ih(t), e))) for (t = 0; t < e.length; t++) Ih(e[t]);
      }
    }
    function to(e, t) {
      var a = e.stateNode;
      if (a === null) return null;
      var s = a[tn] || null;
      if (s === null) return null;
      a = s[t];
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
          (s = !s.disabled) || (e = e.type, s = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !s;
          break e;
        default:
          e = false;
      }
      if (e) return null;
      if (a && typeof a != "function") throw Error(o(231, t, typeof a));
      return a;
    }
    var vl = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Tc = false;
    if (vl) try {
      var no = {};
      Object.defineProperty(no, "passive", {
        get: function() {
          Tc = true;
        }
      }), window.addEventListener("test", no, no), window.removeEventListener("test", no, no);
    } catch {
      Tc = false;
    }
    var Xl = null, Nc = null, _s = null;
    function zh() {
      if (_s) return _s;
      var e, t = Nc, a = t.length, s, u = "value" in Xl ? Xl.value : Xl.textContent, h = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++) ;
      var w = a - e;
      for (s = 1; s <= w && t[a - s] === u[h - s]; s++) ;
      return _s = u.slice(e, 1 < s ? 1 - s : void 0);
    }
    function ks(e) {
      var t = e.keyCode;
      return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
    }
    function Ms() {
      return true;
    }
    function Hh() {
      return false;
    }
    function gn(e) {
      function t(a, s, u, h, w) {
        this._reactName = a, this._targetInst = u, this.type = s, this.nativeEvent = h, this.target = w, this.currentTarget = null;
        for (var M in e) e.hasOwnProperty(M) && (a = e[M], this[M] = a ? a(h) : h[M]);
        return this.isDefaultPrevented = (h.defaultPrevented != null ? h.defaultPrevented : h.returnValue === false) ? Ms : Hh, this.isPropagationStopped = Hh, this;
      }
      return x(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = false), this.isDefaultPrevented = Ms);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = true), this.isPropagationStopped = Ms);
        },
        persist: function() {
        },
        isPersistent: Ms
      }), t;
    }
    var Mr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, js = gn(Mr), lo = x({}, Mr, {
      view: 0,
      detail: 0
    }), rx = gn(lo), Oc, Ic, ro, Ls = x({}, lo, {
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
      getModifierState: zc,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (e !== ro && (ro && e.type === "mousemove" ? (Oc = e.screenX - ro.screenX, Ic = e.screenY - ro.screenY) : Ic = Oc = 0, ro = e), Oc);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Ic;
      }
    }), Yh = gn(Ls), ax = x({}, Ls, {
      dataTransfer: 0
    }), ox = gn(ax), sx = x({}, lo, {
      relatedTarget: 0
    }), Dc = gn(sx), ix = x({}, Mr, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), cx = gn(ix), ux = x({}, Mr, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), dx = gn(ux), fx = x({}, Mr, {
      data: 0
    }), Uh = gn(fx), hx = {
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
    }, mx = {
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
    }, gx = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function px(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = gx[e]) ? !!t[e] : false;
    }
    function zc() {
      return px;
    }
    var yx = x({}, lo, {
      key: function(e) {
        if (e.key) {
          var t = hx[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress" ? (e = ks(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? mx[e.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: zc,
      charCode: function(e) {
        return e.type === "keypress" ? ks(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? ks(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), bx = gn(yx), vx = x({}, Ls, {
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
    }), Bh = gn(vx), xx = x({}, lo, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: zc
    }), wx = gn(xx), Sx = x({}, Mr, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Cx = gn(Sx), Ex = x({}, Ls, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), _x = gn(Ex), kx = x({}, Mr, {
      newState: 0,
      oldState: 0
    }), Mx = gn(kx), jx = [
      9,
      13,
      27,
      32
    ], Hc = vl && "CompositionEvent" in window, ao = null;
    vl && "documentMode" in document && (ao = document.documentMode);
    var Lx = vl && "TextEvent" in window && !ao, Xh = vl && (!Hc || ao && 8 < ao && 11 >= ao), Vh = " ", $h = false;
    function qh(e, t) {
      switch (e) {
        case "keyup":
          return jx.indexOf(t.keyCode) !== -1;
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
    function Gh(e) {
      return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
    }
    var ia = false;
    function Rx(e, t) {
      switch (e) {
        case "compositionend":
          return Gh(t);
        case "keypress":
          return t.which !== 32 ? null : ($h = true, Vh);
        case "textInput":
          return e = t.data, e === Vh && $h ? null : e;
        default:
          return null;
      }
    }
    function Ax(e, t) {
      if (ia) return e === "compositionend" || !Hc && qh(e, t) ? (e = zh(), _s = Nc = Xl = null, ia = false, e) : null;
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
          return Xh && t.locale !== "ko" ? null : t.data;
        default:
          return null;
      }
    }
    var Tx = {
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
    function Ph(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Tx[e.type] : t === "textarea";
    }
    function Zh(e, t, a, s) {
      oa ? sa ? sa.push(s) : sa = [
        s
      ] : oa = s, t = bi(t, "onChange"), 0 < t.length && (a = new js("onChange", "change", null, a, s), e.push({
        event: a,
        listeners: t
      }));
    }
    var oo = null, so = null;
    function Nx(e) {
      Rp(e, 0);
    }
    function Rs(e) {
      var t = We(e);
      if (na(t)) return e;
    }
    function Kh(e, t) {
      if (e === "change") return t;
    }
    var Fh = false;
    if (vl) {
      var Yc;
      if (vl) {
        var Uc = "oninput" in document;
        if (!Uc) {
          var Qh = document.createElement("div");
          Qh.setAttribute("oninput", "return;"), Uc = typeof Qh.oninput == "function";
        }
        Yc = Uc;
      } else Yc = false;
      Fh = Yc && (!document.documentMode || 9 < document.documentMode);
    }
    function Wh() {
      oo && (oo.detachEvent("onpropertychange", Jh), so = oo = null);
    }
    function Jh(e) {
      if (e.propertyName === "value" && Rs(so)) {
        var t = [];
        Zh(t, so, e, Rc(e)), Dh(Nx, t);
      }
    }
    function Ox(e, t, a) {
      e === "focusin" ? (Wh(), oo = t, so = a, oo.attachEvent("onpropertychange", Jh)) : e === "focusout" && Wh();
    }
    function Ix(e) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown") return Rs(so);
    }
    function Dx(e, t) {
      if (e === "click") return Rs(t);
    }
    function zx(e, t) {
      if (e === "input" || e === "change") return Rs(t);
    }
    function Hx(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var wn = typeof Object.is == "function" ? Object.is : Hx;
    function io(e, t) {
      if (wn(e, t)) return true;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null) return false;
      var a = Object.keys(e), s = Object.keys(t);
      if (a.length !== s.length) return false;
      for (s = 0; s < a.length; s++) {
        var u = a[s];
        if (!Re.call(t, u) || !wn(e[u], t[u])) return false;
      }
      return true;
    }
    function em(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function tm(e, t) {
      var a = em(e);
      e = 0;
      for (var s; a; ) {
        if (a.nodeType === 3) {
          if (s = e + a.textContent.length, e <= t && s >= t) return {
            node: a,
            offset: t - e
          };
          e = s;
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
        a = em(a);
      }
    }
    function nm(e, t) {
      return e && t ? e === t ? true : e && e.nodeType === 3 ? false : t && t.nodeType === 3 ? nm(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : false : false;
    }
    function lm(e) {
      e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
      for (var t = yl(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var a = typeof t.contentWindow.location.href == "string";
        } catch {
          a = false;
        }
        if (a) e = t.contentWindow;
        else break;
        t = yl(e.document);
      }
      return t;
    }
    function Bc(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    var Yx = vl && "documentMode" in document && 11 >= document.documentMode, ca = null, Xc = null, co = null, Vc = false;
    function rm(e, t, a) {
      var s = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
      Vc || ca == null || ca !== yl(s) || (s = ca, "selectionStart" in s && Bc(s) ? s = {
        start: s.selectionStart,
        end: s.selectionEnd
      } : (s = (s.ownerDocument && s.ownerDocument.defaultView || window).getSelection(), s = {
        anchorNode: s.anchorNode,
        anchorOffset: s.anchorOffset,
        focusNode: s.focusNode,
        focusOffset: s.focusOffset
      }), co && io(co, s) || (co = s, s = bi(Xc, "onSelect"), 0 < s.length && (t = new js("onSelect", "select", null, t, a), e.push({
        event: t,
        listeners: s
      }), t.target = ca)));
    }
    function jr(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var ua = {
      animationend: jr("Animation", "AnimationEnd"),
      animationiteration: jr("Animation", "AnimationIteration"),
      animationstart: jr("Animation", "AnimationStart"),
      transitionrun: jr("Transition", "TransitionRun"),
      transitionstart: jr("Transition", "TransitionStart"),
      transitioncancel: jr("Transition", "TransitionCancel"),
      transitionend: jr("Transition", "TransitionEnd")
    }, $c = {}, am = {};
    vl && (am = document.createElement("div").style, "AnimationEvent" in window || (delete ua.animationend.animation, delete ua.animationiteration.animation, delete ua.animationstart.animation), "TransitionEvent" in window || delete ua.transitionend.transition);
    function Lr(e) {
      if ($c[e]) return $c[e];
      if (!ua[e]) return e;
      var t = ua[e], a;
      for (a in t) if (t.hasOwnProperty(a) && a in am) return $c[e] = t[a];
      return e;
    }
    var om = Lr("animationend"), sm = Lr("animationiteration"), im = Lr("animationstart"), Ux = Lr("transitionrun"), Bx = Lr("transitionstart"), Xx = Lr("transitioncancel"), cm = Lr("transitionend"), um = /* @__PURE__ */ new Map(), qc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    qc.push("scrollEnd");
    function Pn(e, t) {
      um.set(e, t), ft(t, [
        e
      ]);
    }
    var As = typeof reportError == "function" ? reportError : function(e) {
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
    }, Tn = [], da = 0, Gc = 0;
    function Ts() {
      for (var e = da, t = Gc = da = 0; t < e; ) {
        var a = Tn[t];
        Tn[t++] = null;
        var s = Tn[t];
        Tn[t++] = null;
        var u = Tn[t];
        Tn[t++] = null;
        var h = Tn[t];
        if (Tn[t++] = null, s !== null && u !== null) {
          var w = s.pending;
          w === null ? u.next = u : (u.next = w.next, w.next = u), s.pending = u;
        }
        h !== 0 && dm(a, u, h);
      }
    }
    function Ns(e, t, a, s) {
      Tn[da++] = e, Tn[da++] = t, Tn[da++] = a, Tn[da++] = s, Gc |= s, e.lanes |= s, e = e.alternate, e !== null && (e.lanes |= s);
    }
    function Pc(e, t, a, s) {
      return Ns(e, t, a, s), Os(e);
    }
    function Rr(e, t) {
      return Ns(e, null, null, t), Os(e);
    }
    function dm(e, t, a) {
      e.lanes |= a;
      var s = e.alternate;
      s !== null && (s.lanes |= a);
      for (var u = false, h = e.return; h !== null; ) h.childLanes |= a, s = h.alternate, s !== null && (s.childLanes |= a), h.tag === 22 && (e = h.stateNode, e === null || e._visibility & 1 || (u = true)), e = h, h = h.return;
      return e.tag === 3 ? (h = e.stateNode, u && t !== null && (u = 31 - zt(a), e = h.hiddenUpdates, s = e[u], s === null ? e[u] = [
        t
      ] : s.push(t), t.lane = a | 536870912), h) : null;
    }
    function Os(e) {
      if (50 < To) throw To = 0, nd = null, Error(o(185));
      for (var t = e.return; t !== null; ) e = t, t = e.return;
      return e.tag === 3 ? e.stateNode : null;
    }
    var fa = {};
    function Vx(e, t, a, s) {
      this.tag = e, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = s, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
    }
    function Sn(e, t, a, s) {
      return new Vx(e, t, a, s);
    }
    function Zc(e) {
      return e = e.prototype, !(!e || !e.isReactComponent);
    }
    function xl(e, t) {
      var a = e.alternate;
      return a === null ? (a = Sn(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = e.flags & 65011712, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue, t = e.dependencies, a.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.refCleanup = e.refCleanup, a;
    }
    function fm(e, t) {
      e.flags &= 65011714;
      var a = e.alternate;
      return a === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type, t = a.dependencies, e.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      }), e;
    }
    function Is(e, t, a, s, u, h) {
      var w = 0;
      if (s = e, typeof e == "function") Zc(e) && (w = 1);
      else if (typeof e == "string") w = Zw(e, a, Q.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
      else e: switch (e) {
        case U:
          return e = Sn(31, a, t, u), e.elementType = U, e.lanes = h, e;
        case b:
          return Ar(a.children, u, h, t);
        case E:
          w = 8, u |= 24;
          break;
        case k:
          return e = Sn(12, a, t, u | 2), e.elementType = k, e.lanes = h, e;
        case N:
          return e = Sn(13, a, t, u), e.elementType = N, e.lanes = h, e;
        case I:
          return e = Sn(19, a, t, u), e.elementType = I, e.lanes = h, e;
        default:
          if (typeof e == "object" && e !== null) switch (e.$$typeof) {
            case R:
              w = 10;
              break e;
            case O:
              w = 9;
              break e;
            case T:
              w = 11;
              break e;
            case A:
              w = 14;
              break e;
            case D:
              w = 16, s = null;
              break e;
          }
          w = 29, a = Error(o(130, e === null ? "null" : typeof e, "")), s = null;
      }
      return t = Sn(w, a, t, u), t.elementType = e, t.type = s, t.lanes = h, t;
    }
    function Ar(e, t, a, s) {
      return e = Sn(7, e, s, t), e.lanes = a, e;
    }
    function Kc(e, t, a) {
      return e = Sn(6, e, null, t), e.lanes = a, e;
    }
    function hm(e) {
      var t = Sn(18, null, null, 0);
      return t.stateNode = e, t;
    }
    function Fc(e, t, a) {
      return t = Sn(4, e.children !== null ? e.children : [], e.key, t), t.lanes = a, t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation
      }, t;
    }
    var mm = /* @__PURE__ */ new WeakMap();
    function Nn(e, t) {
      if (typeof e == "object" && e !== null) {
        var a = mm.get(e);
        return a !== void 0 ? a : (t = {
          value: e,
          source: t,
          stack: Xe(t)
        }, mm.set(e, t), t);
      }
      return {
        value: e,
        source: t,
        stack: Xe(t)
      };
    }
    var ha = [], ma = 0, Ds = null, uo = 0, On = [], In = 0, Vl = null, ll = 1, rl = "";
    function wl(e, t) {
      ha[ma++] = uo, ha[ma++] = Ds, Ds = e, uo = t;
    }
    function gm(e, t, a) {
      On[In++] = ll, On[In++] = rl, On[In++] = Vl, Vl = e;
      var s = ll;
      e = rl;
      var u = 32 - zt(s) - 1;
      s &= ~(1 << u), a += 1;
      var h = 32 - zt(t) + u;
      if (30 < h) {
        var w = u - u % 5;
        h = (s & (1 << w) - 1).toString(32), s >>= w, u -= w, ll = 1 << 32 - zt(t) + u | a << u | s, rl = h + e;
      } else ll = 1 << h | a << u | s, rl = e;
    }
    function Qc(e) {
      e.return !== null && (wl(e, 1), gm(e, 1, 0));
    }
    function Wc(e) {
      for (; e === Ds; ) Ds = ha[--ma], ha[ma] = null, uo = ha[--ma], ha[ma] = null;
      for (; e === Vl; ) Vl = On[--In], On[In] = null, rl = On[--In], On[In] = null, ll = On[--In], On[In] = null;
    }
    function pm(e, t) {
      On[In++] = ll, On[In++] = rl, On[In++] = Vl, ll = t.id, rl = t.overflow, Vl = e;
    }
    var Qt = null, Et = null, Fe = false, $l = null, Dn = false, Jc = Error(o(519));
    function ql(e) {
      var t = Error(o(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
      throw fo(Nn(t, e)), Jc;
    }
    function ym(e) {
      var t = e.stateNode, a = e.type, s = e.memoizedProps;
      switch (t[jt] = e, t[tn] = s, a) {
        case "dialog":
          Ge("cancel", t), Ge("close", t);
          break;
        case "iframe":
        case "object":
        case "embed":
          Ge("load", t);
          break;
        case "video":
        case "audio":
          for (a = 0; a < Oo.length; a++) Ge(Oo[a], t);
          break;
        case "source":
          Ge("error", t);
          break;
        case "img":
        case "image":
        case "link":
          Ge("error", t), Ge("load", t);
          break;
        case "details":
          Ge("toggle", t);
          break;
        case "input":
          Ge("invalid", t), eo(t, s.value, s.defaultValue, s.checked, s.defaultChecked, s.type, s.name, true);
          break;
        case "select":
          Ge("invalid", t);
          break;
        case "textarea":
          Ge("invalid", t), Th(t, s.value, s.defaultValue, s.children);
      }
      a = s.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || s.suppressHydrationWarning === true || Op(t.textContent, a) ? (s.popover != null && (Ge("beforetoggle", t), Ge("toggle", t)), s.onScroll != null && Ge("scroll", t), s.onScrollEnd != null && Ge("scrollend", t), s.onClick != null && (t.onclick = bl), t = true) : t = false, t || ql(e, true);
    }
    function bm(e) {
      for (Qt = e.return; Qt; ) switch (Qt.tag) {
        case 5:
        case 31:
        case 13:
          Dn = false;
          return;
        case 27:
        case 3:
          Dn = true;
          return;
        default:
          Qt = Qt.return;
      }
    }
    function ga(e) {
      if (e !== Qt) return false;
      if (!Fe) return bm(e), Fe = true, false;
      var t = e.tag, a;
      if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = e.type, a = !(a !== "form" && a !== "button") || yd(e.type, e.memoizedProps)), a = !a), a && Et && ql(e), bm(e), t === 13) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
        Et = Vp(e);
      } else if (t === 31) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
        Et = Vp(e);
      } else t === 27 ? (t = Et, ar(e.type) ? (e = Sd, Sd = null, Et = e) : Et = t) : Et = Qt ? Hn(e.stateNode.nextSibling) : null;
      return true;
    }
    function Tr() {
      Et = Qt = null, Fe = false;
    }
    function eu() {
      var e = $l;
      return e !== null && (vn === null ? vn = e : vn.push.apply(vn, e), $l = null), e;
    }
    function fo(e) {
      $l === null ? $l = [
        e
      ] : $l.push(e);
    }
    var tu = L(null), Nr = null, Sl = null;
    function Gl(e, t, a) {
      Z(tu, t._currentValue), t._currentValue = a;
    }
    function Cl(e) {
      e._currentValue = tu.current, z(tu);
    }
    function nu(e, t, a) {
      for (; e !== null; ) {
        var s = e.alternate;
        if ((e.childLanes & t) !== t ? (e.childLanes |= t, s !== null && (s.childLanes |= t)) : s !== null && (s.childLanes & t) !== t && (s.childLanes |= t), e === a) break;
        e = e.return;
      }
    }
    function lu(e, t, a, s) {
      var u = e.child;
      for (u !== null && (u.return = e); u !== null; ) {
        var h = u.dependencies;
        if (h !== null) {
          var w = u.child;
          h = h.firstContext;
          e: for (; h !== null; ) {
            var M = h;
            h = u;
            for (var H = 0; H < t.length; H++) if (M.context === t[H]) {
              h.lanes |= a, M = h.alternate, M !== null && (M.lanes |= a), nu(h.return, a, e), s || (w = null);
              break e;
            }
            h = M.next;
          }
        } else if (u.tag === 18) {
          if (w = u.return, w === null) throw Error(o(341));
          w.lanes |= a, h = w.alternate, h !== null && (h.lanes |= a), nu(w, a, e), w = null;
        } else w = u.child;
        if (w !== null) w.return = u;
        else for (w = u; w !== null; ) {
          if (w === e) {
            w = null;
            break;
          }
          if (u = w.sibling, u !== null) {
            u.return = w.return, w = u;
            break;
          }
          w = w.return;
        }
        u = w;
      }
    }
    function pa(e, t, a, s) {
      e = null;
      for (var u = t, h = false; u !== null; ) {
        if (!h) {
          if ((u.flags & 524288) !== 0) h = true;
          else if ((u.flags & 262144) !== 0) break;
        }
        if (u.tag === 10) {
          var w = u.alternate;
          if (w === null) throw Error(o(387));
          if (w = w.memoizedProps, w !== null) {
            var M = u.type;
            wn(u.pendingProps.value, w.value) || (e !== null ? e.push(M) : e = [
              M
            ]);
          }
        } else if (u === ge.current) {
          if (w = u.alternate, w === null) throw Error(o(387));
          w.memoizedState.memoizedState !== u.memoizedState.memoizedState && (e !== null ? e.push(Yo) : e = [
            Yo
          ]);
        }
        u = u.return;
      }
      e !== null && lu(t, e, a, s), t.flags |= 262144;
    }
    function zs(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!wn(e.context._currentValue, e.memoizedValue)) return true;
        e = e.next;
      }
      return false;
    }
    function Or(e) {
      Nr = e, Sl = null, e = e.dependencies, e !== null && (e.firstContext = null);
    }
    function Wt(e) {
      return vm(Nr, e);
    }
    function Hs(e, t) {
      return Nr === null && Or(e), vm(e, t);
    }
    function vm(e, t) {
      var a = t._currentValue;
      if (t = {
        context: t,
        memoizedValue: a,
        next: null
      }, Sl === null) {
        if (e === null) throw Error(o(308));
        Sl = t, e.dependencies = {
          lanes: 0,
          firstContext: t
        }, e.flags |= 524288;
      } else Sl = Sl.next = t;
      return a;
    }
    var $x = typeof AbortController < "u" ? AbortController : function() {
      var e = [], t = this.signal = {
        aborted: false,
        addEventListener: function(a, s) {
          e.push(s);
        }
      };
      this.abort = function() {
        t.aborted = true, e.forEach(function(a) {
          return a();
        });
      };
    }, qx = l.unstable_scheduleCallback, Gx = l.unstable_NormalPriority, Yt = {
      $$typeof: R,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
    function ru() {
      return {
        controller: new $x(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function ho(e) {
      e.refCount--, e.refCount === 0 && qx(Gx, function() {
        e.controller.abort();
      });
    }
    var mo = null, au = 0, ya = 0, ba = null;
    function Px(e, t) {
      if (mo === null) {
        var a = mo = [];
        au = 0, ya = id(), ba = {
          status: "pending",
          value: void 0,
          then: function(s) {
            a.push(s);
          }
        };
      }
      return au++, t.then(xm, xm), t;
    }
    function xm() {
      if (--au === 0 && mo !== null) {
        ba !== null && (ba.status = "fulfilled");
        var e = mo;
        mo = null, ya = 0, ba = null;
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function Zx(e, t) {
      var a = [], s = {
        status: "pending",
        value: null,
        reason: null,
        then: function(u) {
          a.push(u);
        }
      };
      return e.then(function() {
        s.status = "fulfilled", s.value = t;
        for (var u = 0; u < a.length; u++) (0, a[u])(t);
      }, function(u) {
        for (s.status = "rejected", s.reason = u, u = 0; u < a.length; u++) (0, a[u])(void 0);
      }), s;
    }
    var wm = $.S;
    $.S = function(e, t) {
      rp = st(), typeof t == "object" && t !== null && typeof t.then == "function" && Px(e, t), wm !== null && wm(e, t);
    };
    var Ir = L(null);
    function ou() {
      var e = Ir.current;
      return e !== null ? e : vt.pooledCache;
    }
    function Ys(e, t) {
      t === null ? Z(Ir, Ir.current) : Z(Ir, t.pool);
    }
    function Sm() {
      var e = ou();
      return e === null ? null : {
        parent: Yt._currentValue,
        pool: e
      };
    }
    var va = Error(o(460)), su = Error(o(474)), Us = Error(o(542)), Bs = {
      then: function() {
      }
    };
    function Cm(e) {
      return e = e.status, e === "fulfilled" || e === "rejected";
    }
    function Em(e, t, a) {
      switch (a = e[a], a === void 0 ? e.push(t) : a !== t && (t.then(bl, bl), t = a), t.status) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw e = t.reason, km(e), e;
        default:
          if (typeof t.status == "string") t.then(bl, bl);
          else {
            if (e = vt, e !== null && 100 < e.shellSuspendCounter) throw Error(o(482));
            e = t, e.status = "pending", e.then(function(s) {
              if (t.status === "pending") {
                var u = t;
                u.status = "fulfilled", u.value = s;
              }
            }, function(s) {
              if (t.status === "pending") {
                var u = t;
                u.status = "rejected", u.reason = s;
              }
            });
          }
          switch (t.status) {
            case "fulfilled":
              return t.value;
            case "rejected":
              throw e = t.reason, km(e), e;
          }
          throw zr = t, va;
      }
    }
    function Dr(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (a) {
        throw a !== null && typeof a == "object" && typeof a.then == "function" ? (zr = a, va) : a;
      }
    }
    var zr = null;
    function _m() {
      if (zr === null) throw Error(o(459));
      var e = zr;
      return zr = null, e;
    }
    function km(e) {
      if (e === va || e === Us) throw Error(o(483));
    }
    var xa = null, go = 0;
    function Xs(e) {
      var t = go;
      return go += 1, xa === null && (xa = []), Em(xa, e, t);
    }
    function po(e, t) {
      t = t.props.ref, e.ref = t !== void 0 ? t : null;
    }
    function Vs(e, t) {
      throw t.$$typeof === S ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(o(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
    }
    function Mm(e) {
      function t(V, X) {
        if (e) {
          var q = V.deletions;
          q === null ? (V.deletions = [
            X
          ], V.flags |= 16) : q.push(X);
        }
      }
      function a(V, X) {
        if (!e) return null;
        for (; X !== null; ) t(V, X), X = X.sibling;
        return null;
      }
      function s(V) {
        for (var X = /* @__PURE__ */ new Map(); V !== null; ) V.key !== null ? X.set(V.key, V) : X.set(V.index, V), V = V.sibling;
        return X;
      }
      function u(V, X) {
        return V = xl(V, X), V.index = 0, V.sibling = null, V;
      }
      function h(V, X, q) {
        return V.index = q, e ? (q = V.alternate, q !== null ? (q = q.index, q < X ? (V.flags |= 67108866, X) : q) : (V.flags |= 67108866, X)) : (V.flags |= 1048576, X);
      }
      function w(V) {
        return e && V.alternate === null && (V.flags |= 67108866), V;
      }
      function M(V, X, q, ae) {
        return X === null || X.tag !== 6 ? (X = Kc(q, V.mode, ae), X.return = V, X) : (X = u(X, q), X.return = V, X);
      }
      function H(V, X, q, ae) {
        var Le = q.type;
        return Le === b ? re(V, X, q.props.children, ae, q.key) : X !== null && (X.elementType === Le || typeof Le == "object" && Le !== null && Le.$$typeof === D && Dr(Le) === X.type) ? (X = u(X, q.props), po(X, q), X.return = V, X) : (X = Is(q.type, q.key, q.props, null, V.mode, ae), po(X, q), X.return = V, X);
      }
      function G(V, X, q, ae) {
        return X === null || X.tag !== 4 || X.stateNode.containerInfo !== q.containerInfo || X.stateNode.implementation !== q.implementation ? (X = Fc(q, V.mode, ae), X.return = V, X) : (X = u(X, q.children || []), X.return = V, X);
      }
      function re(V, X, q, ae, Le) {
        return X === null || X.tag !== 7 ? (X = Ar(q, V.mode, ae, Le), X.return = V, X) : (X = u(X, q), X.return = V, X);
      }
      function se(V, X, q) {
        if (typeof X == "string" && X !== "" || typeof X == "number" || typeof X == "bigint") return X = Kc("" + X, V.mode, q), X.return = V, X;
        if (typeof X == "object" && X !== null) {
          switch (X.$$typeof) {
            case C:
              return q = Is(X.type, X.key, X.props, null, V.mode, q), po(q, X), q.return = V, q;
            case _:
              return X = Fc(X, V.mode, q), X.return = V, X;
            case D:
              return X = Dr(X), se(V, X, q);
          }
          if (xe(X) || W(X)) return X = Ar(X, V.mode, q, null), X.return = V, X;
          if (typeof X.then == "function") return se(V, Xs(X), q);
          if (X.$$typeof === R) return se(V, Hs(V, X), q);
          Vs(V, X);
        }
        return null;
      }
      function P(V, X, q, ae) {
        var Le = X !== null ? X.key : null;
        if (typeof q == "string" && q !== "" || typeof q == "number" || typeof q == "bigint") return Le !== null ? null : M(V, X, "" + q, ae);
        if (typeof q == "object" && q !== null) {
          switch (q.$$typeof) {
            case C:
              return q.key === Le ? H(V, X, q, ae) : null;
            case _:
              return q.key === Le ? G(V, X, q, ae) : null;
            case D:
              return q = Dr(q), P(V, X, q, ae);
          }
          if (xe(q) || W(q)) return Le !== null ? null : re(V, X, q, ae, null);
          if (typeof q.then == "function") return P(V, X, Xs(q), ae);
          if (q.$$typeof === R) return P(V, X, Hs(V, q), ae);
          Vs(V, q);
        }
        return null;
      }
      function F(V, X, q, ae, Le) {
        if (typeof ae == "string" && ae !== "" || typeof ae == "number" || typeof ae == "bigint") return V = V.get(q) || null, M(X, V, "" + ae, Le);
        if (typeof ae == "object" && ae !== null) {
          switch (ae.$$typeof) {
            case C:
              return V = V.get(ae.key === null ? q : ae.key) || null, H(X, V, ae, Le);
            case _:
              return V = V.get(ae.key === null ? q : ae.key) || null, G(X, V, ae, Le);
            case D:
              return ae = Dr(ae), F(V, X, q, ae, Le);
          }
          if (xe(ae) || W(ae)) return V = V.get(q) || null, re(X, V, ae, Le, null);
          if (typeof ae.then == "function") return F(V, X, q, Xs(ae), Le);
          if (ae.$$typeof === R) return F(V, X, q, Hs(X, ae), Le);
          Vs(X, ae);
        }
        return null;
      }
      function _e(V, X, q, ae) {
        for (var Le = null, rt = null, Me = X, Ve = X = 0, Ke = null; Me !== null && Ve < q.length; Ve++) {
          Me.index > Ve ? (Ke = Me, Me = null) : Ke = Me.sibling;
          var at = P(V, Me, q[Ve], ae);
          if (at === null) {
            Me === null && (Me = Ke);
            break;
          }
          e && Me && at.alternate === null && t(V, Me), X = h(at, X, Ve), rt === null ? Le = at : rt.sibling = at, rt = at, Me = Ke;
        }
        if (Ve === q.length) return a(V, Me), Fe && wl(V, Ve), Le;
        if (Me === null) {
          for (; Ve < q.length; Ve++) Me = se(V, q[Ve], ae), Me !== null && (X = h(Me, X, Ve), rt === null ? Le = Me : rt.sibling = Me, rt = Me);
          return Fe && wl(V, Ve), Le;
        }
        for (Me = s(Me); Ve < q.length; Ve++) Ke = F(Me, V, Ve, q[Ve], ae), Ke !== null && (e && Ke.alternate !== null && Me.delete(Ke.key === null ? Ve : Ke.key), X = h(Ke, X, Ve), rt === null ? Le = Ke : rt.sibling = Ke, rt = Ke);
        return e && Me.forEach(function(ur) {
          return t(V, ur);
        }), Fe && wl(V, Ve), Le;
      }
      function Ae(V, X, q, ae) {
        if (q == null) throw Error(o(151));
        for (var Le = null, rt = null, Me = X, Ve = X = 0, Ke = null, at = q.next(); Me !== null && !at.done; Ve++, at = q.next()) {
          Me.index > Ve ? (Ke = Me, Me = null) : Ke = Me.sibling;
          var ur = P(V, Me, at.value, ae);
          if (ur === null) {
            Me === null && (Me = Ke);
            break;
          }
          e && Me && ur.alternate === null && t(V, Me), X = h(ur, X, Ve), rt === null ? Le = ur : rt.sibling = ur, rt = ur, Me = Ke;
        }
        if (at.done) return a(V, Me), Fe && wl(V, Ve), Le;
        if (Me === null) {
          for (; !at.done; Ve++, at = q.next()) at = se(V, at.value, ae), at !== null && (X = h(at, X, Ve), rt === null ? Le = at : rt.sibling = at, rt = at);
          return Fe && wl(V, Ve), Le;
        }
        for (Me = s(Me); !at.done; Ve++, at = q.next()) at = F(Me, V, Ve, at.value, ae), at !== null && (e && at.alternate !== null && Me.delete(at.key === null ? Ve : at.key), X = h(at, X, Ve), rt === null ? Le = at : rt.sibling = at, rt = at);
        return e && Me.forEach(function(aS) {
          return t(V, aS);
        }), Fe && wl(V, Ve), Le;
      }
      function bt(V, X, q, ae) {
        if (typeof q == "object" && q !== null && q.type === b && q.key === null && (q = q.props.children), typeof q == "object" && q !== null) {
          switch (q.$$typeof) {
            case C:
              e: {
                for (var Le = q.key; X !== null; ) {
                  if (X.key === Le) {
                    if (Le = q.type, Le === b) {
                      if (X.tag === 7) {
                        a(V, X.sibling), ae = u(X, q.props.children), ae.return = V, V = ae;
                        break e;
                      }
                    } else if (X.elementType === Le || typeof Le == "object" && Le !== null && Le.$$typeof === D && Dr(Le) === X.type) {
                      a(V, X.sibling), ae = u(X, q.props), po(ae, q), ae.return = V, V = ae;
                      break e;
                    }
                    a(V, X);
                    break;
                  } else t(V, X);
                  X = X.sibling;
                }
                q.type === b ? (ae = Ar(q.props.children, V.mode, ae, q.key), ae.return = V, V = ae) : (ae = Is(q.type, q.key, q.props, null, V.mode, ae), po(ae, q), ae.return = V, V = ae);
              }
              return w(V);
            case _:
              e: {
                for (Le = q.key; X !== null; ) {
                  if (X.key === Le) if (X.tag === 4 && X.stateNode.containerInfo === q.containerInfo && X.stateNode.implementation === q.implementation) {
                    a(V, X.sibling), ae = u(X, q.children || []), ae.return = V, V = ae;
                    break e;
                  } else {
                    a(V, X);
                    break;
                  }
                  else t(V, X);
                  X = X.sibling;
                }
                ae = Fc(q, V.mode, ae), ae.return = V, V = ae;
              }
              return w(V);
            case D:
              return q = Dr(q), bt(V, X, q, ae);
          }
          if (xe(q)) return _e(V, X, q, ae);
          if (W(q)) {
            if (Le = W(q), typeof Le != "function") throw Error(o(150));
            return q = Le.call(q), Ae(V, X, q, ae);
          }
          if (typeof q.then == "function") return bt(V, X, Xs(q), ae);
          if (q.$$typeof === R) return bt(V, X, Hs(V, q), ae);
          Vs(V, q);
        }
        return typeof q == "string" && q !== "" || typeof q == "number" || typeof q == "bigint" ? (q = "" + q, X !== null && X.tag === 6 ? (a(V, X.sibling), ae = u(X, q), ae.return = V, V = ae) : (a(V, X), ae = Kc(q, V.mode, ae), ae.return = V, V = ae), w(V)) : a(V, X);
      }
      return function(V, X, q, ae) {
        try {
          go = 0;
          var Le = bt(V, X, q, ae);
          return xa = null, Le;
        } catch (Me) {
          if (Me === va || Me === Us) throw Me;
          var rt = Sn(29, Me, null, V.mode);
          return rt.lanes = ae, rt.return = V, rt;
        } finally {
        }
      };
    }
    var Hr = Mm(true), jm = Mm(false), Pl = false;
    function iu(e) {
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
    function cu(e, t) {
      e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        callbacks: null
      });
    }
    function Zl(e) {
      return {
        lane: e,
        tag: 0,
        payload: null,
        callback: null,
        next: null
      };
    }
    function Kl(e, t, a) {
      var s = e.updateQueue;
      if (s === null) return null;
      if (s = s.shared, (it & 2) !== 0) {
        var u = s.pending;
        return u === null ? t.next = t : (t.next = u.next, u.next = t), s.pending = t, t = Os(e), dm(e, null, a), t;
      }
      return Ns(e, s, t, a), Os(e);
    }
    function yo(e, t, a) {
      if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
        var s = t.lanes;
        s &= e.pendingLanes, a |= s, t.lanes = a, ea(e, a);
      }
    }
    function uu(e, t) {
      var a = e.updateQueue, s = e.alternate;
      if (s !== null && (s = s.updateQueue, a === s)) {
        var u = null, h = null;
        if (a = a.firstBaseUpdate, a !== null) {
          do {
            var w = {
              lane: a.lane,
              tag: a.tag,
              payload: a.payload,
              callback: null,
              next: null
            };
            h === null ? u = h = w : h = h.next = w, a = a.next;
          } while (a !== null);
          h === null ? u = h = t : h = h.next = t;
        } else u = h = t;
        a = {
          baseState: s.baseState,
          firstBaseUpdate: u,
          lastBaseUpdate: h,
          shared: s.shared,
          callbacks: s.callbacks
        }, e.updateQueue = a;
        return;
      }
      e = a.lastBaseUpdate, e === null ? a.firstBaseUpdate = t : e.next = t, a.lastBaseUpdate = t;
    }
    var du = false;
    function bo() {
      if (du) {
        var e = ba;
        if (e !== null) throw e;
      }
    }
    function vo(e, t, a, s) {
      du = false;
      var u = e.updateQueue;
      Pl = false;
      var h = u.firstBaseUpdate, w = u.lastBaseUpdate, M = u.shared.pending;
      if (M !== null) {
        u.shared.pending = null;
        var H = M, G = H.next;
        H.next = null, w === null ? h = G : w.next = G, w = H;
        var re = e.alternate;
        re !== null && (re = re.updateQueue, M = re.lastBaseUpdate, M !== w && (M === null ? re.firstBaseUpdate = G : M.next = G, re.lastBaseUpdate = H));
      }
      if (h !== null) {
        var se = u.baseState;
        w = 0, re = G = H = null, M = h;
        do {
          var P = M.lane & -536870913, F = P !== M.lane;
          if (F ? (Ze & P) === P : (s & P) === P) {
            P !== 0 && P === ya && (du = true), re !== null && (re = re.next = {
              lane: 0,
              tag: M.tag,
              payload: M.payload,
              callback: null,
              next: null
            });
            e: {
              var _e = e, Ae = M;
              P = t;
              var bt = a;
              switch (Ae.tag) {
                case 1:
                  if (_e = Ae.payload, typeof _e == "function") {
                    se = _e.call(bt, se, P);
                    break e;
                  }
                  se = _e;
                  break e;
                case 3:
                  _e.flags = _e.flags & -65537 | 128;
                case 0:
                  if (_e = Ae.payload, P = typeof _e == "function" ? _e.call(bt, se, P) : _e, P == null) break e;
                  se = x({}, se, P);
                  break e;
                case 2:
                  Pl = true;
              }
            }
            P = M.callback, P !== null && (e.flags |= 64, F && (e.flags |= 8192), F = u.callbacks, F === null ? u.callbacks = [
              P
            ] : F.push(P));
          } else F = {
            lane: P,
            tag: M.tag,
            payload: M.payload,
            callback: M.callback,
            next: null
          }, re === null ? (G = re = F, H = se) : re = re.next = F, w |= P;
          if (M = M.next, M === null) {
            if (M = u.shared.pending, M === null) break;
            F = M, M = F.next, F.next = null, u.lastBaseUpdate = F, u.shared.pending = null;
          }
        } while (true);
        re === null && (H = se), u.baseState = H, u.firstBaseUpdate = G, u.lastBaseUpdate = re, h === null && (u.shared.lanes = 0), er |= w, e.lanes = w, e.memoizedState = se;
      }
    }
    function Lm(e, t) {
      if (typeof e != "function") throw Error(o(191, e));
      e.call(t);
    }
    function Rm(e, t) {
      var a = e.callbacks;
      if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) Lm(a[e], t);
    }
    var wa = L(null), $s = L(0);
    function Am(e, t) {
      e = Tl, Z($s, e), Z(wa, t), Tl = e | t.baseLanes;
    }
    function fu() {
      Z($s, Tl), Z(wa, wa.current);
    }
    function hu() {
      Tl = $s.current, z(wa), z($s);
    }
    var Cn = L(null), zn = null;
    function Fl(e) {
      var t = e.alternate;
      Z(Ot, Ot.current & 1), Z(Cn, e), zn === null && (t === null || wa.current !== null || t.memoizedState !== null) && (zn = e);
    }
    function mu(e) {
      Z(Ot, Ot.current), Z(Cn, e), zn === null && (zn = e);
    }
    function Tm(e) {
      e.tag === 22 ? (Z(Ot, Ot.current), Z(Cn, e), zn === null && (zn = e)) : Ql();
    }
    function Ql() {
      Z(Ot, Ot.current), Z(Cn, Cn.current);
    }
    function En(e) {
      z(Cn), zn === e && (zn = null), z(Ot);
    }
    var Ot = L(0);
    function qs(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var a = t.memoizedState;
          if (a !== null && (a = a.dehydrated, a === null || xd(a) || wd(a))) return t;
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
    var El = 0, Ye = null, pt = null, Ut = null, Gs = false, Sa = false, Yr = false, Ps = 0, xo = 0, Ca = null, Kx = 0;
    function At() {
      throw Error(o(321));
    }
    function gu(e, t) {
      if (t === null) return false;
      for (var a = 0; a < t.length && a < e.length; a++) if (!wn(e[a], t[a])) return false;
      return true;
    }
    function pu(e, t, a, s, u, h) {
      return El = h, Ye = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, $.H = e === null || e.memoizedState === null ? gg : Au, Yr = false, h = a(s, u), Yr = false, Sa && (h = Om(t, a, s, u)), Nm(e), h;
    }
    function Nm(e) {
      $.H = Co;
      var t = pt !== null && pt.next !== null;
      if (El = 0, Ut = pt = Ye = null, Gs = false, xo = 0, Ca = null, t) throw Error(o(300));
      e === null || Bt || (e = e.dependencies, e !== null && zs(e) && (Bt = true));
    }
    function Om(e, t, a, s) {
      Ye = e;
      var u = 0;
      do {
        if (Sa && (Ca = null), xo = 0, Sa = false, 25 <= u) throw Error(o(301));
        if (u += 1, Ut = pt = null, e.updateQueue != null) {
          var h = e.updateQueue;
          h.lastEffect = null, h.events = null, h.stores = null, h.memoCache != null && (h.memoCache.index = 0);
        }
        $.H = pg, h = t(a, s);
      } while (Sa);
      return h;
    }
    function Fx() {
      var e = $.H, t = e.useState()[0];
      return t = typeof t.then == "function" ? wo(t) : t, e = e.useState()[0], (pt !== null ? pt.memoizedState : null) !== e && (Ye.flags |= 1024), t;
    }
    function yu() {
      var e = Ps !== 0;
      return Ps = 0, e;
    }
    function bu(e, t, a) {
      t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a;
    }
    function vu(e) {
      if (Gs) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Gs = false;
      }
      El = 0, Ut = pt = Ye = null, Sa = false, xo = Ps = 0, Ca = null;
    }
    function un() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Ut === null ? Ye.memoizedState = Ut = e : Ut = Ut.next = e, Ut;
    }
    function It() {
      if (pt === null) {
        var e = Ye.alternate;
        e = e !== null ? e.memoizedState : null;
      } else e = pt.next;
      var t = Ut === null ? Ye.memoizedState : Ut.next;
      if (t !== null) Ut = t, pt = e;
      else {
        if (e === null) throw Ye.alternate === null ? Error(o(467)) : Error(o(310));
        pt = e, e = {
          memoizedState: pt.memoizedState,
          baseState: pt.baseState,
          baseQueue: pt.baseQueue,
          queue: pt.queue,
          next: null
        }, Ut === null ? Ye.memoizedState = Ut = e : Ut = Ut.next = e;
      }
      return Ut;
    }
    function Zs() {
      return {
        lastEffect: null,
        events: null,
        stores: null,
        memoCache: null
      };
    }
    function wo(e) {
      var t = xo;
      return xo += 1, Ca === null && (Ca = []), e = Em(Ca, e, t), t = Ye, (Ut === null ? t.memoizedState : Ut.next) === null && (t = t.alternate, $.H = t === null || t.memoizedState === null ? gg : Au), e;
    }
    function Ks(e) {
      if (e !== null && typeof e == "object") {
        if (typeof e.then == "function") return wo(e);
        if (e.$$typeof === R) return Wt(e);
      }
      throw Error(o(438, String(e)));
    }
    function xu(e) {
      var t = null, a = Ye.updateQueue;
      if (a !== null && (t = a.memoCache), t == null) {
        var s = Ye.alternate;
        s !== null && (s = s.updateQueue, s !== null && (s = s.memoCache, s != null && (t = {
          data: s.data.map(function(u) {
            return u.slice();
          }),
          index: 0
        })));
      }
      if (t == null && (t = {
        data: [],
        index: 0
      }), a === null && (a = Zs(), Ye.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0) for (a = t.data[t.index] = Array(e), s = 0; s < e; s++) a[s] = B;
      return t.index++, a;
    }
    function _l(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Fs(e) {
      var t = It();
      return wu(t, pt, e);
    }
    function wu(e, t, a) {
      var s = e.queue;
      if (s === null) throw Error(o(311));
      s.lastRenderedReducer = a;
      var u = e.baseQueue, h = s.pending;
      if (h !== null) {
        if (u !== null) {
          var w = u.next;
          u.next = h.next, h.next = w;
        }
        t.baseQueue = u = h, s.pending = null;
      }
      if (h = e.baseState, u === null) e.memoizedState = h;
      else {
        t = u.next;
        var M = w = null, H = null, G = t, re = false;
        do {
          var se = G.lane & -536870913;
          if (se !== G.lane ? (Ze & se) === se : (El & se) === se) {
            var P = G.revertLane;
            if (P === 0) H !== null && (H = H.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: G.action,
              hasEagerState: G.hasEagerState,
              eagerState: G.eagerState,
              next: null
            }), se === ya && (re = true);
            else if ((El & P) === P) {
              G = G.next, P === ya && (re = true);
              continue;
            } else se = {
              lane: 0,
              revertLane: G.revertLane,
              gesture: null,
              action: G.action,
              hasEagerState: G.hasEagerState,
              eagerState: G.eagerState,
              next: null
            }, H === null ? (M = H = se, w = h) : H = H.next = se, Ye.lanes |= P, er |= P;
            se = G.action, Yr && a(h, se), h = G.hasEagerState ? G.eagerState : a(h, se);
          } else P = {
            lane: se,
            revertLane: G.revertLane,
            gesture: G.gesture,
            action: G.action,
            hasEagerState: G.hasEagerState,
            eagerState: G.eagerState,
            next: null
          }, H === null ? (M = H = P, w = h) : H = H.next = P, Ye.lanes |= se, er |= se;
          G = G.next;
        } while (G !== null && G !== t);
        if (H === null ? w = h : H.next = M, !wn(h, e.memoizedState) && (Bt = true, re && (a = ba, a !== null))) throw a;
        e.memoizedState = h, e.baseState = w, e.baseQueue = H, s.lastRenderedState = h;
      }
      return u === null && (s.lanes = 0), [
        e.memoizedState,
        s.dispatch
      ];
    }
    function Su(e) {
      var t = It(), a = t.queue;
      if (a === null) throw Error(o(311));
      a.lastRenderedReducer = e;
      var s = a.dispatch, u = a.pending, h = t.memoizedState;
      if (u !== null) {
        a.pending = null;
        var w = u = u.next;
        do
          h = e(h, w.action), w = w.next;
        while (w !== u);
        wn(h, t.memoizedState) || (Bt = true), t.memoizedState = h, t.baseQueue === null && (t.baseState = h), a.lastRenderedState = h;
      }
      return [
        h,
        s
      ];
    }
    function Im(e, t, a) {
      var s = Ye, u = It(), h = Fe;
      if (h) {
        if (a === void 0) throw Error(o(407));
        a = a();
      } else a = t();
      var w = !wn((pt || u).memoizedState, a);
      if (w && (u.memoizedState = a, Bt = true), u = u.queue, _u(Hm.bind(null, s, u, e), [
        e
      ]), u.getSnapshot !== t || w || Ut !== null && Ut.memoizedState.tag & 1) {
        if (s.flags |= 2048, Ea(9, {
          destroy: void 0
        }, zm.bind(null, s, u, a, t), null), vt === null) throw Error(o(349));
        h || (El & 127) !== 0 || Dm(s, t, a);
      }
      return a;
    }
    function Dm(e, t, a) {
      e.flags |= 16384, e = {
        getSnapshot: t,
        value: a
      }, t = Ye.updateQueue, t === null ? (t = Zs(), Ye.updateQueue = t, t.stores = [
        e
      ]) : (a = t.stores, a === null ? t.stores = [
        e
      ] : a.push(e));
    }
    function zm(e, t, a, s) {
      t.value = a, t.getSnapshot = s, Ym(t) && Um(e);
    }
    function Hm(e, t, a) {
      return a(function() {
        Ym(t) && Um(e);
      });
    }
    function Ym(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var a = t();
        return !wn(e, a);
      } catch {
        return true;
      }
    }
    function Um(e) {
      var t = Rr(e, 2);
      t !== null && xn(t, e, 2);
    }
    function Cu(e) {
      var t = un();
      if (typeof e == "function") {
        var a = e;
        if (e = a(), Yr) {
          Pt(true);
          try {
            a();
          } finally {
            Pt(false);
          }
        }
      }
      return t.memoizedState = t.baseState = e, t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: _l,
        lastRenderedState: e
      }, t;
    }
    function Bm(e, t, a, s) {
      return e.baseState = a, wu(e, pt, typeof s == "function" ? s : _l);
    }
    function Qx(e, t, a, s, u) {
      if (Js(e)) throw Error(o(485));
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
          then: function(w) {
            h.listeners.push(w);
          }
        };
        $.T !== null ? a(true) : h.isTransition = false, s(h), a = t.pending, a === null ? (h.next = t.pending = h, Xm(t, h)) : (h.next = a.next, t.pending = a.next = h);
      }
    }
    function Xm(e, t) {
      var a = t.action, s = t.payload, u = e.state;
      if (t.isTransition) {
        var h = $.T, w = {};
        $.T = w;
        try {
          var M = a(u, s), H = $.S;
          H !== null && H(w, M), Vm(e, t, M);
        } catch (G) {
          Eu(e, t, G);
        } finally {
          h !== null && w.types !== null && (h.types = w.types), $.T = h;
        }
      } else try {
        h = a(u, s), Vm(e, t, h);
      } catch (G) {
        Eu(e, t, G);
      }
    }
    function Vm(e, t, a) {
      a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(function(s) {
        $m(e, t, s);
      }, function(s) {
        return Eu(e, t, s);
      }) : $m(e, t, a);
    }
    function $m(e, t, a) {
      t.status = "fulfilled", t.value = a, qm(t), e.state = a, t = e.pending, t !== null && (a = t.next, a === t ? e.pending = null : (a = a.next, t.next = a, Xm(e, a)));
    }
    function Eu(e, t, a) {
      var s = e.pending;
      if (e.pending = null, s !== null) {
        s = s.next;
        do
          t.status = "rejected", t.reason = a, qm(t), t = t.next;
        while (t !== s);
      }
      e.action = null;
    }
    function qm(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function Gm(e, t) {
      return t;
    }
    function Pm(e, t) {
      if (Fe) {
        var a = vt.formState;
        if (a !== null) {
          e: {
            var s = Ye;
            if (Fe) {
              if (Et) {
                t: {
                  for (var u = Et, h = Dn; u.nodeType !== 8; ) {
                    if (!h) {
                      u = null;
                      break t;
                    }
                    if (u = Hn(u.nextSibling), u === null) {
                      u = null;
                      break t;
                    }
                  }
                  h = u.data, u = h === "F!" || h === "F" ? u : null;
                }
                if (u) {
                  Et = Hn(u.nextSibling), s = u.data === "F!";
                  break e;
                }
              }
              ql(s);
            }
            s = false;
          }
          s && (t = a[0]);
        }
      }
      return a = un(), a.memoizedState = a.baseState = t, s = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Gm,
        lastRenderedState: t
      }, a.queue = s, a = fg.bind(null, Ye, s), s.dispatch = a, s = Cu(false), h = Ru.bind(null, Ye, false, s.queue), s = un(), u = {
        state: t,
        dispatch: null,
        action: e,
        pending: null
      }, s.queue = u, a = Qx.bind(null, Ye, u, h, a), u.dispatch = a, s.memoizedState = e, [
        t,
        a,
        false
      ];
    }
    function Zm(e) {
      var t = It();
      return Km(t, pt, e);
    }
    function Km(e, t, a) {
      if (t = wu(e, t, Gm)[0], e = Fs(_l)[0], typeof t == "object" && t !== null && typeof t.then == "function") try {
        var s = wo(t);
      } catch (w) {
        throw w === va ? Us : w;
      }
      else s = t;
      t = It();
      var u = t.queue, h = u.dispatch;
      return a !== t.memoizedState && (Ye.flags |= 2048, Ea(9, {
        destroy: void 0
      }, Wx.bind(null, u, a), null)), [
        s,
        h,
        e
      ];
    }
    function Wx(e, t) {
      e.action = t;
    }
    function Fm(e) {
      var t = It(), a = pt;
      if (a !== null) return Km(t, a, e);
      It(), t = t.memoizedState, a = It();
      var s = a.queue.dispatch;
      return a.memoizedState = e, [
        t,
        s,
        false
      ];
    }
    function Ea(e, t, a, s) {
      return e = {
        tag: e,
        create: a,
        deps: s,
        inst: t,
        next: null
      }, t = Ye.updateQueue, t === null && (t = Zs(), Ye.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = e.next = e : (s = a.next, a.next = e, e.next = s, t.lastEffect = e), e;
    }
    function Qm() {
      return It().memoizedState;
    }
    function Qs(e, t, a, s) {
      var u = un();
      Ye.flags |= e, u.memoizedState = Ea(1 | t, {
        destroy: void 0
      }, a, s === void 0 ? null : s);
    }
    function Ws(e, t, a, s) {
      var u = It();
      s = s === void 0 ? null : s;
      var h = u.memoizedState.inst;
      pt !== null && s !== null && gu(s, pt.memoizedState.deps) ? u.memoizedState = Ea(t, h, a, s) : (Ye.flags |= e, u.memoizedState = Ea(1 | t, h, a, s));
    }
    function Wm(e, t) {
      Qs(8390656, 8, e, t);
    }
    function _u(e, t) {
      Ws(2048, 8, e, t);
    }
    function Jx(e) {
      Ye.flags |= 4;
      var t = Ye.updateQueue;
      if (t === null) t = Zs(), Ye.updateQueue = t, t.events = [
        e
      ];
      else {
        var a = t.events;
        a === null ? t.events = [
          e
        ] : a.push(e);
      }
    }
    function Jm(e) {
      var t = It().memoizedState;
      return Jx({
        ref: t,
        nextImpl: e
      }), function() {
        if ((it & 2) !== 0) throw Error(o(440));
        return t.impl.apply(void 0, arguments);
      };
    }
    function eg(e, t) {
      return Ws(4, 2, e, t);
    }
    function tg(e, t) {
      return Ws(4, 4, e, t);
    }
    function ng(e, t) {
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
    function lg(e, t, a) {
      a = a != null ? a.concat([
        e
      ]) : null, Ws(4, 4, ng.bind(null, t, e), a);
    }
    function ku() {
    }
    function rg(e, t) {
      var a = It();
      t = t === void 0 ? null : t;
      var s = a.memoizedState;
      return t !== null && gu(t, s[1]) ? s[0] : (a.memoizedState = [
        e,
        t
      ], e);
    }
    function ag(e, t) {
      var a = It();
      t = t === void 0 ? null : t;
      var s = a.memoizedState;
      if (t !== null && gu(t, s[1])) return s[0];
      if (s = e(), Yr) {
        Pt(true);
        try {
          e();
        } finally {
          Pt(false);
        }
      }
      return a.memoizedState = [
        s,
        t
      ], s;
    }
    function Mu(e, t, a) {
      return a === void 0 || (El & 1073741824) !== 0 && (Ze & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = a, e = op(), Ye.lanes |= e, er |= e, a);
    }
    function og(e, t, a, s) {
      return wn(a, t) ? a : wa.current !== null ? (e = Mu(e, a, s), wn(e, t) || (Bt = true), e) : (El & 42) === 0 || (El & 1073741824) !== 0 && (Ze & 261930) === 0 ? (Bt = true, e.memoizedState = a) : (e = op(), Ye.lanes |= e, er |= e, t);
    }
    function sg(e, t, a, s, u) {
      var h = K.p;
      K.p = h !== 0 && 8 > h ? h : 8;
      var w = $.T, M = {};
      $.T = M, Ru(e, false, t, a);
      try {
        var H = u(), G = $.S;
        if (G !== null && G(M, H), H !== null && typeof H == "object" && typeof H.then == "function") {
          var re = Zx(H, s);
          So(e, t, re, Mn(e));
        } else So(e, t, s, Mn(e));
      } catch (se) {
        So(e, t, {
          then: function() {
          },
          status: "rejected",
          reason: se
        }, Mn());
      } finally {
        K.p = h, w !== null && M.types !== null && (w.types = M.types), $.T = w;
      }
    }
    function ew() {
    }
    function ju(e, t, a, s) {
      if (e.tag !== 5) throw Error(o(476));
      var u = ig(e).queue;
      sg(e, u, t, me, a === null ? ew : function() {
        return cg(e), a(s);
      });
    }
    function ig(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: me,
        baseState: me,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: _l,
          lastRenderedState: me
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
          lastRenderedReducer: _l,
          lastRenderedState: a
        },
        next: null
      }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
    }
    function cg(e) {
      var t = ig(e);
      t.next === null && (t = e.alternate.memoizedState), So(e, t.next.queue, {}, Mn());
    }
    function Lu() {
      return Wt(Yo);
    }
    function ug() {
      return It().memoizedState;
    }
    function dg() {
      return It().memoizedState;
    }
    function tw(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var a = Mn();
            e = Zl(a);
            var s = Kl(t, e, a);
            s !== null && (xn(s, t, a), yo(s, t, a)), t = {
              cache: ru()
            }, e.payload = t;
            return;
        }
        t = t.return;
      }
    }
    function nw(e, t, a) {
      var s = Mn();
      a = {
        lane: s,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, Js(e) ? hg(t, a) : (a = Pc(e, t, a, s), a !== null && (xn(a, e, s), mg(a, t, s)));
    }
    function fg(e, t, a) {
      var s = Mn();
      So(e, t, a, s);
    }
    function So(e, t, a, s) {
      var u = {
        lane: s,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (Js(e)) hg(t, u);
      else {
        var h = e.alternate;
        if (e.lanes === 0 && (h === null || h.lanes === 0) && (h = t.lastRenderedReducer, h !== null)) try {
          var w = t.lastRenderedState, M = h(w, a);
          if (u.hasEagerState = true, u.eagerState = M, wn(M, w)) return Ns(e, t, u, 0), vt === null && Ts(), false;
        } catch {
        } finally {
        }
        if (a = Pc(e, t, u, s), a !== null) return xn(a, e, s), mg(a, t, s), true;
      }
      return false;
    }
    function Ru(e, t, a, s) {
      if (s = {
        lane: 2,
        revertLane: id(),
        gesture: null,
        action: s,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, Js(e)) {
        if (t) throw Error(o(479));
      } else t = Pc(e, a, s, 2), t !== null && xn(t, e, 2);
    }
    function Js(e) {
      var t = e.alternate;
      return e === Ye || t !== null && t === Ye;
    }
    function hg(e, t) {
      Sa = Gs = true;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function mg(e, t, a) {
      if ((a & 4194048) !== 0) {
        var s = t.lanes;
        s &= e.pendingLanes, a |= s, t.lanes = a, ea(e, a);
      }
    }
    var Co = {
      readContext: Wt,
      use: Ks,
      useCallback: At,
      useContext: At,
      useEffect: At,
      useImperativeHandle: At,
      useLayoutEffect: At,
      useInsertionEffect: At,
      useMemo: At,
      useReducer: At,
      useRef: At,
      useState: At,
      useDebugValue: At,
      useDeferredValue: At,
      useTransition: At,
      useSyncExternalStore: At,
      useId: At,
      useHostTransitionStatus: At,
      useFormState: At,
      useActionState: At,
      useOptimistic: At,
      useMemoCache: At,
      useCacheRefresh: At
    };
    Co.useEffectEvent = At;
    var gg = {
      readContext: Wt,
      use: Ks,
      useCallback: function(e, t) {
        return un().memoizedState = [
          e,
          t === void 0 ? null : t
        ], e;
      },
      useContext: Wt,
      useEffect: Wm,
      useImperativeHandle: function(e, t, a) {
        a = a != null ? a.concat([
          e
        ]) : null, Qs(4194308, 4, ng.bind(null, t, e), a);
      },
      useLayoutEffect: function(e, t) {
        return Qs(4194308, 4, e, t);
      },
      useInsertionEffect: function(e, t) {
        Qs(4, 2, e, t);
      },
      useMemo: function(e, t) {
        var a = un();
        t = t === void 0 ? null : t;
        var s = e();
        if (Yr) {
          Pt(true);
          try {
            e();
          } finally {
            Pt(false);
          }
        }
        return a.memoizedState = [
          s,
          t
        ], s;
      },
      useReducer: function(e, t, a) {
        var s = un();
        if (a !== void 0) {
          var u = a(t);
          if (Yr) {
            Pt(true);
            try {
              a(t);
            } finally {
              Pt(false);
            }
          }
        } else u = t;
        return s.memoizedState = s.baseState = u, e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: u
        }, s.queue = e, e = e.dispatch = nw.bind(null, Ye, e), [
          s.memoizedState,
          e
        ];
      },
      useRef: function(e) {
        var t = un();
        return e = {
          current: e
        }, t.memoizedState = e;
      },
      useState: function(e) {
        e = Cu(e);
        var t = e.queue, a = fg.bind(null, Ye, t);
        return t.dispatch = a, [
          e.memoizedState,
          a
        ];
      },
      useDebugValue: ku,
      useDeferredValue: function(e, t) {
        var a = un();
        return Mu(a, e, t);
      },
      useTransition: function() {
        var e = Cu(false);
        return e = sg.bind(null, Ye, e.queue, true, false), un().memoizedState = e, [
          false,
          e
        ];
      },
      useSyncExternalStore: function(e, t, a) {
        var s = Ye, u = un();
        if (Fe) {
          if (a === void 0) throw Error(o(407));
          a = a();
        } else {
          if (a = t(), vt === null) throw Error(o(349));
          (Ze & 127) !== 0 || Dm(s, t, a);
        }
        u.memoizedState = a;
        var h = {
          value: a,
          getSnapshot: t
        };
        return u.queue = h, Wm(Hm.bind(null, s, h, e), [
          e
        ]), s.flags |= 2048, Ea(9, {
          destroy: void 0
        }, zm.bind(null, s, h, a, t), null), a;
      },
      useId: function() {
        var e = un(), t = vt.identifierPrefix;
        if (Fe) {
          var a = rl, s = ll;
          a = (s & ~(1 << 32 - zt(s) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = Ps++, 0 < a && (t += "H" + a.toString(32)), t += "_";
        } else a = Kx++, t = "_" + t + "r_" + a.toString(32) + "_";
        return e.memoizedState = t;
      },
      useHostTransitionStatus: Lu,
      useFormState: Pm,
      useActionState: Pm,
      useOptimistic: function(e) {
        var t = un();
        t.memoizedState = t.baseState = e;
        var a = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        return t.queue = a, t = Ru.bind(null, Ye, true, a), a.dispatch = t, [
          e,
          t
        ];
      },
      useMemoCache: xu,
      useCacheRefresh: function() {
        return un().memoizedState = tw.bind(null, Ye);
      },
      useEffectEvent: function(e) {
        var t = un(), a = {
          impl: e
        };
        return t.memoizedState = a, function() {
          if ((it & 2) !== 0) throw Error(o(440));
          return a.impl.apply(void 0, arguments);
        };
      }
    }, Au = {
      readContext: Wt,
      use: Ks,
      useCallback: rg,
      useContext: Wt,
      useEffect: _u,
      useImperativeHandle: lg,
      useInsertionEffect: eg,
      useLayoutEffect: tg,
      useMemo: ag,
      useReducer: Fs,
      useRef: Qm,
      useState: function() {
        return Fs(_l);
      },
      useDebugValue: ku,
      useDeferredValue: function(e, t) {
        var a = It();
        return og(a, pt.memoizedState, e, t);
      },
      useTransition: function() {
        var e = Fs(_l)[0], t = It().memoizedState;
        return [
          typeof e == "boolean" ? e : wo(e),
          t
        ];
      },
      useSyncExternalStore: Im,
      useId: ug,
      useHostTransitionStatus: Lu,
      useFormState: Zm,
      useActionState: Zm,
      useOptimistic: function(e, t) {
        var a = It();
        return Bm(a, pt, e, t);
      },
      useMemoCache: xu,
      useCacheRefresh: dg
    };
    Au.useEffectEvent = Jm;
    var pg = {
      readContext: Wt,
      use: Ks,
      useCallback: rg,
      useContext: Wt,
      useEffect: _u,
      useImperativeHandle: lg,
      useInsertionEffect: eg,
      useLayoutEffect: tg,
      useMemo: ag,
      useReducer: Su,
      useRef: Qm,
      useState: function() {
        return Su(_l);
      },
      useDebugValue: ku,
      useDeferredValue: function(e, t) {
        var a = It();
        return pt === null ? Mu(a, e, t) : og(a, pt.memoizedState, e, t);
      },
      useTransition: function() {
        var e = Su(_l)[0], t = It().memoizedState;
        return [
          typeof e == "boolean" ? e : wo(e),
          t
        ];
      },
      useSyncExternalStore: Im,
      useId: ug,
      useHostTransitionStatus: Lu,
      useFormState: Fm,
      useActionState: Fm,
      useOptimistic: function(e, t) {
        var a = It();
        return pt !== null ? Bm(a, pt, e, t) : (a.baseState = e, [
          e,
          a.queue.dispatch
        ]);
      },
      useMemoCache: xu,
      useCacheRefresh: dg
    };
    pg.useEffectEvent = Jm;
    function Tu(e, t, a, s) {
      t = e.memoizedState, a = a(s, t), a = a == null ? t : x({}, t, a), e.memoizedState = a, e.lanes === 0 && (e.updateQueue.baseState = a);
    }
    var Nu = {
      enqueueSetState: function(e, t, a) {
        e = e._reactInternals;
        var s = Mn(), u = Zl(s);
        u.payload = t, a != null && (u.callback = a), t = Kl(e, u, s), t !== null && (xn(t, e, s), yo(t, e, s));
      },
      enqueueReplaceState: function(e, t, a) {
        e = e._reactInternals;
        var s = Mn(), u = Zl(s);
        u.tag = 1, u.payload = t, a != null && (u.callback = a), t = Kl(e, u, s), t !== null && (xn(t, e, s), yo(t, e, s));
      },
      enqueueForceUpdate: function(e, t) {
        e = e._reactInternals;
        var a = Mn(), s = Zl(a);
        s.tag = 2, t != null && (s.callback = t), t = Kl(e, s, a), t !== null && (xn(t, e, a), yo(t, e, a));
      }
    };
    function yg(e, t, a, s, u, h, w) {
      return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(s, h, w) : t.prototype && t.prototype.isPureReactComponent ? !io(a, s) || !io(u, h) : true;
    }
    function bg(e, t, a, s) {
      e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, s), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, s), t.state !== e && Nu.enqueueReplaceState(t, t.state, null);
    }
    function Ur(e, t) {
      var a = t;
      if ("ref" in t) {
        a = {};
        for (var s in t) s !== "ref" && (a[s] = t[s]);
      }
      if (e = e.defaultProps) {
        a === t && (a = x({}, a));
        for (var u in e) a[u] === void 0 && (a[u] = e[u]);
      }
      return a;
    }
    function vg(e) {
      As(e);
    }
    function xg(e) {
      console.error(e);
    }
    function wg(e) {
      As(e);
    }
    function ei(e, t) {
      try {
        var a = e.onUncaughtError;
        a(t.value, {
          componentStack: t.stack
        });
      } catch (s) {
        setTimeout(function() {
          throw s;
        });
      }
    }
    function Sg(e, t, a) {
      try {
        var s = e.onCaughtError;
        s(a.value, {
          componentStack: a.stack,
          errorBoundary: t.tag === 1 ? t.stateNode : null
        });
      } catch (u) {
        setTimeout(function() {
          throw u;
        });
      }
    }
    function Ou(e, t, a) {
      return a = Zl(a), a.tag = 3, a.payload = {
        element: null
      }, a.callback = function() {
        ei(e, t);
      }, a;
    }
    function Cg(e) {
      return e = Zl(e), e.tag = 3, e;
    }
    function Eg(e, t, a, s) {
      var u = a.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var h = s.value;
        e.payload = function() {
          return u(h);
        }, e.callback = function() {
          Sg(t, a, s);
        };
      }
      var w = a.stateNode;
      w !== null && typeof w.componentDidCatch == "function" && (e.callback = function() {
        Sg(t, a, s), typeof u != "function" && (tr === null ? tr = /* @__PURE__ */ new Set([
          this
        ]) : tr.add(this));
        var M = s.stack;
        this.componentDidCatch(s.value, {
          componentStack: M !== null ? M : ""
        });
      });
    }
    function lw(e, t, a, s, u) {
      if (a.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
        if (t = a.alternate, t !== null && pa(t, a, u, true), a = Cn.current, a !== null) {
          switch (a.tag) {
            case 31:
            case 13:
              return zn === null ? fi() : a.alternate === null && Tt === 0 && (Tt = 3), a.flags &= -257, a.flags |= 65536, a.lanes = u, s === Bs ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([
                s
              ]) : t.add(s), ad(e, s, u)), false;
            case 22:
              return a.flags |= 65536, s === Bs ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([
                  s
                ])
              }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([
                s
              ]) : a.add(s)), ad(e, s, u)), false;
          }
          throw Error(o(435, a.tag));
        }
        return ad(e, s, u), fi(), false;
      }
      if (Fe) return t = Cn.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, s !== Jc && (e = Error(o(422), {
        cause: s
      }), fo(Nn(e, a)))) : (s !== Jc && (t = Error(o(423), {
        cause: s
      }), fo(Nn(t, a))), e = e.current.alternate, e.flags |= 65536, u &= -u, e.lanes |= u, s = Nn(s, a), u = Ou(e.stateNode, s, u), uu(e, u), Tt !== 4 && (Tt = 2)), false;
      var h = Error(o(520), {
        cause: s
      });
      if (h = Nn(h, a), Ao === null ? Ao = [
        h
      ] : Ao.push(h), Tt !== 4 && (Tt = 2), t === null) return true;
      s = Nn(s, a), a = t;
      do {
        switch (a.tag) {
          case 3:
            return a.flags |= 65536, e = u & -u, a.lanes |= e, e = Ou(a.stateNode, s, e), uu(a, e), false;
          case 1:
            if (t = a.type, h = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (tr === null || !tr.has(h)))) return a.flags |= 65536, u &= -u, a.lanes |= u, u = Cg(u), Eg(u, e, a, s), uu(a, u), false;
        }
        a = a.return;
      } while (a !== null);
      return false;
    }
    var Iu = Error(o(461)), Bt = false;
    function Jt(e, t, a, s) {
      t.child = e === null ? jm(t, null, a, s) : Hr(t, e.child, a, s);
    }
    function _g(e, t, a, s, u) {
      a = a.render;
      var h = t.ref;
      if ("ref" in s) {
        var w = {};
        for (var M in s) M !== "ref" && (w[M] = s[M]);
      } else w = s;
      return Or(t), s = pu(e, t, a, w, h, u), M = yu(), e !== null && !Bt ? (bu(e, t, u), kl(e, t, u)) : (Fe && M && Qc(t), t.flags |= 1, Jt(e, t, s, u), t.child);
    }
    function kg(e, t, a, s, u) {
      if (e === null) {
        var h = a.type;
        return typeof h == "function" && !Zc(h) && h.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = h, Mg(e, t, h, s, u)) : (e = Is(a.type, null, s, t, t.mode, u), e.ref = t.ref, e.return = t, t.child = e);
      }
      if (h = e.child, !Vu(e, u)) {
        var w = h.memoizedProps;
        if (a = a.compare, a = a !== null ? a : io, a(w, s) && e.ref === t.ref) return kl(e, t, u);
      }
      return t.flags |= 1, e = xl(h, s), e.ref = t.ref, e.return = t, t.child = e;
    }
    function Mg(e, t, a, s, u) {
      if (e !== null) {
        var h = e.memoizedProps;
        if (io(h, s) && e.ref === t.ref) if (Bt = false, t.pendingProps = s = h, Vu(e, u)) (e.flags & 131072) !== 0 && (Bt = true);
        else return t.lanes = e.lanes, kl(e, t, u);
      }
      return Du(e, t, a, s, u);
    }
    function jg(e, t, a, s) {
      var u = s.children, h = e !== null ? e.memoizedState : null;
      if (e === null && t.stateNode === null && (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), s.mode === "hidden") {
        if ((t.flags & 128) !== 0) {
          if (h = h !== null ? h.baseLanes | a : a, e !== null) {
            for (s = t.child = e.child, u = 0; s !== null; ) u = u | s.lanes | s.childLanes, s = s.sibling;
            s = u & ~h;
          } else s = 0, t.child = null;
          return Lg(e, t, h, a, s);
        }
        if ((a & 536870912) !== 0) t.memoizedState = {
          baseLanes: 0,
          cachePool: null
        }, e !== null && Ys(t, h !== null ? h.cachePool : null), h !== null ? Am(t, h) : fu(), Tm(t);
        else return s = t.lanes = 536870912, Lg(e, t, h !== null ? h.baseLanes | a : a, a, s);
      } else h !== null ? (Ys(t, h.cachePool), Am(t, h), Ql(), t.memoizedState = null) : (e !== null && Ys(t, null), fu(), Ql());
      return Jt(e, t, u, a), t.child;
    }
    function Eo(e, t) {
      return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), t.sibling;
    }
    function Lg(e, t, a, s, u) {
      var h = ou();
      return h = h === null ? null : {
        parent: Yt._currentValue,
        pool: h
      }, t.memoizedState = {
        baseLanes: a,
        cachePool: h
      }, e !== null && Ys(t, null), fu(), Tm(t), e !== null && pa(e, t, s, true), t.childLanes = u, null;
    }
    function ti(e, t) {
      return t = li({
        mode: t.mode,
        children: t.children
      }, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
    }
    function Rg(e, t, a) {
      return Hr(t, e.child, null, a), e = ti(t, t.pendingProps), e.flags |= 2, En(t), t.memoizedState = null, e;
    }
    function rw(e, t, a) {
      var s = t.pendingProps, u = (t.flags & 128) !== 0;
      if (t.flags &= -129, e === null) {
        if (Fe) {
          if (s.mode === "hidden") return e = ti(t, s), t.lanes = 536870912, Eo(null, e);
          if (mu(t), (e = Et) ? (e = Xp(e, Dn), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: Vl !== null ? {
              id: ll,
              overflow: rl
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, a = hm(e), a.return = t, t.child = a, Qt = t, Et = null)) : e = null, e === null) throw ql(t);
          return t.lanes = 536870912, null;
        }
        return ti(t, s);
      }
      var h = e.memoizedState;
      if (h !== null) {
        var w = h.dehydrated;
        if (mu(t), u) if (t.flags & 256) t.flags &= -257, t = Rg(e, t, a);
        else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
        else if (Bt || pa(e, t, a, false), u = (a & e.childLanes) !== 0, Bt || u) {
          if (s = vt, s !== null && (w = ws(s, a), w !== 0 && w !== h.retryLane)) throw h.retryLane = w, Rr(e, w), xn(s, e, w), Iu;
          fi(), t = Rg(e, t, a);
        } else e = h.treeContext, Et = Hn(w.nextSibling), Qt = t, Fe = true, $l = null, Dn = false, e !== null && pm(t, e), t = ti(t, s), t.flags |= 4096;
        return t;
      }
      return e = xl(e.child, {
        mode: s.mode,
        children: s.children
      }), e.ref = t.ref, t.child = e, e.return = t, e;
    }
    function ni(e, t) {
      var a = t.ref;
      if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof a != "function" && typeof a != "object") throw Error(o(284));
        (e === null || e.ref !== a) && (t.flags |= 4194816);
      }
    }
    function Du(e, t, a, s, u) {
      return Or(t), a = pu(e, t, a, s, void 0, u), s = yu(), e !== null && !Bt ? (bu(e, t, u), kl(e, t, u)) : (Fe && s && Qc(t), t.flags |= 1, Jt(e, t, a, u), t.child);
    }
    function Ag(e, t, a, s, u, h) {
      return Or(t), t.updateQueue = null, a = Om(t, s, a, u), Nm(e), s = yu(), e !== null && !Bt ? (bu(e, t, h), kl(e, t, h)) : (Fe && s && Qc(t), t.flags |= 1, Jt(e, t, a, h), t.child);
    }
    function Tg(e, t, a, s, u) {
      if (Or(t), t.stateNode === null) {
        var h = fa, w = a.contextType;
        typeof w == "object" && w !== null && (h = Wt(w)), h = new a(s, h), t.memoizedState = h.state !== null && h.state !== void 0 ? h.state : null, h.updater = Nu, t.stateNode = h, h._reactInternals = t, h = t.stateNode, h.props = s, h.state = t.memoizedState, h.refs = {}, iu(t), w = a.contextType, h.context = typeof w == "object" && w !== null ? Wt(w) : fa, h.state = t.memoizedState, w = a.getDerivedStateFromProps, typeof w == "function" && (Tu(t, a, w, s), h.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof h.getSnapshotBeforeUpdate == "function" || typeof h.UNSAFE_componentWillMount != "function" && typeof h.componentWillMount != "function" || (w = h.state, typeof h.componentWillMount == "function" && h.componentWillMount(), typeof h.UNSAFE_componentWillMount == "function" && h.UNSAFE_componentWillMount(), w !== h.state && Nu.enqueueReplaceState(h, h.state, null), vo(t, s, h, u), bo(), h.state = t.memoizedState), typeof h.componentDidMount == "function" && (t.flags |= 4194308), s = true;
      } else if (e === null) {
        h = t.stateNode;
        var M = t.memoizedProps, H = Ur(a, M);
        h.props = H;
        var G = h.context, re = a.contextType;
        w = fa, typeof re == "object" && re !== null && (w = Wt(re));
        var se = a.getDerivedStateFromProps;
        re = typeof se == "function" || typeof h.getSnapshotBeforeUpdate == "function", M = t.pendingProps !== M, re || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (M || G !== w) && bg(t, h, s, w), Pl = false;
        var P = t.memoizedState;
        h.state = P, vo(t, s, h, u), bo(), G = t.memoizedState, M || P !== G || Pl ? (typeof se == "function" && (Tu(t, a, se, s), G = t.memoizedState), (H = Pl || yg(t, a, H, s, P, G, w)) ? (re || typeof h.UNSAFE_componentWillMount != "function" && typeof h.componentWillMount != "function" || (typeof h.componentWillMount == "function" && h.componentWillMount(), typeof h.UNSAFE_componentWillMount == "function" && h.UNSAFE_componentWillMount()), typeof h.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof h.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = s, t.memoizedState = G), h.props = s, h.state = G, h.context = w, s = H) : (typeof h.componentDidMount == "function" && (t.flags |= 4194308), s = false);
      } else {
        h = t.stateNode, cu(e, t), w = t.memoizedProps, re = Ur(a, w), h.props = re, se = t.pendingProps, P = h.context, G = a.contextType, H = fa, typeof G == "object" && G !== null && (H = Wt(G)), M = a.getDerivedStateFromProps, (G = typeof M == "function" || typeof h.getSnapshotBeforeUpdate == "function") || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (w !== se || P !== H) && bg(t, h, s, H), Pl = false, P = t.memoizedState, h.state = P, vo(t, s, h, u), bo();
        var F = t.memoizedState;
        w !== se || P !== F || Pl || e !== null && e.dependencies !== null && zs(e.dependencies) ? (typeof M == "function" && (Tu(t, a, M, s), F = t.memoizedState), (re = Pl || yg(t, a, re, s, P, F, H) || e !== null && e.dependencies !== null && zs(e.dependencies)) ? (G || typeof h.UNSAFE_componentWillUpdate != "function" && typeof h.componentWillUpdate != "function" || (typeof h.componentWillUpdate == "function" && h.componentWillUpdate(s, F, H), typeof h.UNSAFE_componentWillUpdate == "function" && h.UNSAFE_componentWillUpdate(s, F, H)), typeof h.componentDidUpdate == "function" && (t.flags |= 4), typeof h.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof h.componentDidUpdate != "function" || w === e.memoizedProps && P === e.memoizedState || (t.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || w === e.memoizedProps && P === e.memoizedState || (t.flags |= 1024), t.memoizedProps = s, t.memoizedState = F), h.props = s, h.state = F, h.context = H, s = re) : (typeof h.componentDidUpdate != "function" || w === e.memoizedProps && P === e.memoizedState || (t.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || w === e.memoizedProps && P === e.memoizedState || (t.flags |= 1024), s = false);
      }
      return h = s, ni(e, t), s = (t.flags & 128) !== 0, h || s ? (h = t.stateNode, a = s && typeof a.getDerivedStateFromError != "function" ? null : h.render(), t.flags |= 1, e !== null && s ? (t.child = Hr(t, e.child, null, u), t.child = Hr(t, null, a, u)) : Jt(e, t, a, u), t.memoizedState = h.state, e = t.child) : e = kl(e, t, u), e;
    }
    function Ng(e, t, a, s) {
      return Tr(), t.flags |= 256, Jt(e, t, a, s), t.child;
    }
    var zu = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    };
    function Hu(e) {
      return {
        baseLanes: e,
        cachePool: Sm()
      };
    }
    function Yu(e, t, a) {
      return e = e !== null ? e.childLanes & ~a : 0, t && (e |= kn), e;
    }
    function Og(e, t, a) {
      var s = t.pendingProps, u = false, h = (t.flags & 128) !== 0, w;
      if ((w = h) || (w = e !== null && e.memoizedState === null ? false : (Ot.current & 2) !== 0), w && (u = true, t.flags &= -129), w = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
        if (Fe) {
          if (u ? Fl(t) : Ql(), (e = Et) ? (e = Xp(e, Dn), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: Vl !== null ? {
              id: ll,
              overflow: rl
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, a = hm(e), a.return = t, t.child = a, Qt = t, Et = null)) : e = null, e === null) throw ql(t);
          return wd(e) ? t.lanes = 32 : t.lanes = 536870912, null;
        }
        var M = s.children;
        return s = s.fallback, u ? (Ql(), u = t.mode, M = li({
          mode: "hidden",
          children: M
        }, u), s = Ar(s, u, a, null), M.return = t, s.return = t, M.sibling = s, t.child = M, s = t.child, s.memoizedState = Hu(a), s.childLanes = Yu(e, w, a), t.memoizedState = zu, Eo(null, s)) : (Fl(t), Uu(t, M));
      }
      var H = e.memoizedState;
      if (H !== null && (M = H.dehydrated, M !== null)) {
        if (h) t.flags & 256 ? (Fl(t), t.flags &= -257, t = Bu(e, t, a)) : t.memoizedState !== null ? (Ql(), t.child = e.child, t.flags |= 128, t = null) : (Ql(), M = s.fallback, u = t.mode, s = li({
          mode: "visible",
          children: s.children
        }, u), M = Ar(M, u, a, null), M.flags |= 2, s.return = t, M.return = t, s.sibling = M, t.child = s, Hr(t, e.child, null, a), s = t.child, s.memoizedState = Hu(a), s.childLanes = Yu(e, w, a), t.memoizedState = zu, t = Eo(null, s));
        else if (Fl(t), wd(M)) {
          if (w = M.nextSibling && M.nextSibling.dataset, w) var G = w.dgst;
          w = G, s = Error(o(419)), s.stack = "", s.digest = w, fo({
            value: s,
            source: null,
            stack: null
          }), t = Bu(e, t, a);
        } else if (Bt || pa(e, t, a, false), w = (a & e.childLanes) !== 0, Bt || w) {
          if (w = vt, w !== null && (s = ws(w, a), s !== 0 && s !== H.retryLane)) throw H.retryLane = s, Rr(e, s), xn(w, e, s), Iu;
          xd(M) || fi(), t = Bu(e, t, a);
        } else xd(M) ? (t.flags |= 192, t.child = e.child, t = null) : (e = H.treeContext, Et = Hn(M.nextSibling), Qt = t, Fe = true, $l = null, Dn = false, e !== null && pm(t, e), t = Uu(t, s.children), t.flags |= 4096);
        return t;
      }
      return u ? (Ql(), M = s.fallback, u = t.mode, H = e.child, G = H.sibling, s = xl(H, {
        mode: "hidden",
        children: s.children
      }), s.subtreeFlags = H.subtreeFlags & 65011712, G !== null ? M = xl(G, M) : (M = Ar(M, u, a, null), M.flags |= 2), M.return = t, s.return = t, s.sibling = M, t.child = s, Eo(null, s), s = t.child, M = e.child.memoizedState, M === null ? M = Hu(a) : (u = M.cachePool, u !== null ? (H = Yt._currentValue, u = u.parent !== H ? {
        parent: H,
        pool: H
      } : u) : u = Sm(), M = {
        baseLanes: M.baseLanes | a,
        cachePool: u
      }), s.memoizedState = M, s.childLanes = Yu(e, w, a), t.memoizedState = zu, Eo(e.child, s)) : (Fl(t), a = e.child, e = a.sibling, a = xl(a, {
        mode: "visible",
        children: s.children
      }), a.return = t, a.sibling = null, e !== null && (w = t.deletions, w === null ? (t.deletions = [
        e
      ], t.flags |= 16) : w.push(e)), t.child = a, t.memoizedState = null, a);
    }
    function Uu(e, t) {
      return t = li({
        mode: "visible",
        children: t
      }, e.mode), t.return = e, e.child = t;
    }
    function li(e, t) {
      return e = Sn(22, e, null, t), e.lanes = 0, e;
    }
    function Bu(e, t, a) {
      return Hr(t, e.child, null, a), e = Uu(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
    }
    function Ig(e, t, a) {
      e.lanes |= t;
      var s = e.alternate;
      s !== null && (s.lanes |= t), nu(e.return, t, a);
    }
    function Xu(e, t, a, s, u, h) {
      var w = e.memoizedState;
      w === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: s,
        tail: a,
        tailMode: u,
        treeForkCount: h
      } : (w.isBackwards = t, w.rendering = null, w.renderingStartTime = 0, w.last = s, w.tail = a, w.tailMode = u, w.treeForkCount = h);
    }
    function Dg(e, t, a) {
      var s = t.pendingProps, u = s.revealOrder, h = s.tail;
      s = s.children;
      var w = Ot.current, M = (w & 2) !== 0;
      if (M ? (w = w & 1 | 2, t.flags |= 128) : w &= 1, Z(Ot, w), Jt(e, t, s, a), s = Fe ? uo : 0, !M && e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Ig(e, a, t);
        else if (e.tag === 19) Ig(e, a, t);
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
          for (a = t.child, u = null; a !== null; ) e = a.alternate, e !== null && qs(e) === null && (u = a), a = a.sibling;
          a = u, a === null ? (u = t.child, t.child = null) : (u = a.sibling, a.sibling = null), Xu(t, false, u, a, h, s);
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (a = null, u = t.child, t.child = null; u !== null; ) {
            if (e = u.alternate, e !== null && qs(e) === null) {
              t.child = u;
              break;
            }
            e = u.sibling, u.sibling = a, a = u, u = e;
          }
          Xu(t, true, a, null, h, s);
          break;
        case "together":
          Xu(t, false, null, null, void 0, s);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function kl(e, t, a) {
      if (e !== null && (t.dependencies = e.dependencies), er |= t.lanes, (a & t.childLanes) === 0) if (e !== null) {
        if (pa(e, t, a, false), (a & t.childLanes) === 0) return null;
      } else return null;
      if (e !== null && t.child !== e.child) throw Error(o(153));
      if (t.child !== null) {
        for (e = t.child, a = xl(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null; ) e = e.sibling, a = a.sibling = xl(e, e.pendingProps), a.return = t;
        a.sibling = null;
      }
      return t.child;
    }
    function Vu(e, t) {
      return (e.lanes & t) !== 0 ? true : (e = e.dependencies, !!(e !== null && zs(e)));
    }
    function aw(e, t, a) {
      switch (t.tag) {
        case 3:
          je(t, t.stateNode.containerInfo), Gl(t, Yt, e.memoizedState.cache), Tr();
          break;
        case 27:
        case 5:
          ee(t);
          break;
        case 4:
          je(t, t.stateNode.containerInfo);
          break;
        case 10:
          Gl(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return t.flags |= 128, mu(t), null;
          break;
        case 13:
          var s = t.memoizedState;
          if (s !== null) return s.dehydrated !== null ? (Fl(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? Og(e, t, a) : (Fl(t), e = kl(e, t, a), e !== null ? e.sibling : null);
          Fl(t);
          break;
        case 19:
          var u = (e.flags & 128) !== 0;
          if (s = (a & t.childLanes) !== 0, s || (pa(e, t, a, false), s = (a & t.childLanes) !== 0), u) {
            if (s) return Dg(e, t, a);
            t.flags |= 128;
          }
          if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), Z(Ot, Ot.current), s) break;
          return null;
        case 22:
          return t.lanes = 0, jg(e, t, a, t.pendingProps);
        case 24:
          Gl(t, Yt, e.memoizedState.cache);
      }
      return kl(e, t, a);
    }
    function zg(e, t, a) {
      if (e !== null) if (e.memoizedProps !== t.pendingProps) Bt = true;
      else {
        if (!Vu(e, a) && (t.flags & 128) === 0) return Bt = false, aw(e, t, a);
        Bt = (e.flags & 131072) !== 0;
      }
      else Bt = false, Fe && (t.flags & 1048576) !== 0 && gm(t, uo, t.index);
      switch (t.lanes = 0, t.tag) {
        case 16:
          e: {
            var s = t.pendingProps;
            if (e = Dr(t.elementType), t.type = e, typeof e == "function") Zc(e) ? (s = Ur(e, s), t.tag = 1, t = Tg(null, t, e, s, a)) : (t.tag = 0, t = Du(null, t, e, s, a));
            else {
              if (e != null) {
                var u = e.$$typeof;
                if (u === T) {
                  t.tag = 11, t = _g(null, t, e, s, a);
                  break e;
                } else if (u === A) {
                  t.tag = 14, t = kg(null, t, e, s, a);
                  break e;
                }
              }
              throw t = fe(e) || e, Error(o(306, t, ""));
            }
          }
          return t;
        case 0:
          return Du(e, t, t.type, t.pendingProps, a);
        case 1:
          return s = t.type, u = Ur(s, t.pendingProps), Tg(e, t, s, u, a);
        case 3:
          e: {
            if (je(t, t.stateNode.containerInfo), e === null) throw Error(o(387));
            s = t.pendingProps;
            var h = t.memoizedState;
            u = h.element, cu(e, t), vo(t, s, null, a);
            var w = t.memoizedState;
            if (s = w.cache, Gl(t, Yt, s), s !== h.cache && lu(t, [
              Yt
            ], a, true), bo(), s = w.element, h.isDehydrated) if (h = {
              element: s,
              isDehydrated: false,
              cache: w.cache
            }, t.updateQueue.baseState = h, t.memoizedState = h, t.flags & 256) {
              t = Ng(e, t, s, a);
              break e;
            } else if (s !== u) {
              u = Nn(Error(o(424)), t), fo(u), t = Ng(e, t, s, a);
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (Et = Hn(e.firstChild), Qt = t, Fe = true, $l = null, Dn = true, a = jm(t, null, s, a), t.child = a; a; ) a.flags = a.flags & -3 | 4096, a = a.sibling;
            }
            else {
              if (Tr(), s === u) {
                t = kl(e, t, a);
                break e;
              }
              Jt(e, t, s, a);
            }
            t = t.child;
          }
          return t;
        case 26:
          return ni(e, t), e === null ? (a = Zp(t.type, null, t.pendingProps, null)) ? t.memoizedState = a : Fe || (a = t.type, e = t.pendingProps, s = vi(ce.current).createElement(a), s[jt] = t, s[tn] = e, en(s, a, e), Ne(s), t.stateNode = s) : t.memoizedState = Zp(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
        case 27:
          return ee(t), e === null && Fe && (s = t.stateNode = qp(t.type, t.pendingProps, ce.current), Qt = t, Dn = true, u = Et, ar(t.type) ? (Sd = u, Et = Hn(s.firstChild)) : Et = u), Jt(e, t, t.pendingProps.children, a), ni(e, t), e === null && (t.flags |= 4194304), t.child;
        case 5:
          return e === null && Fe && ((u = s = Et) && (s = Iw(s, t.type, t.pendingProps, Dn), s !== null ? (t.stateNode = s, Qt = t, Et = Hn(s.firstChild), Dn = false, u = true) : u = false), u || ql(t)), ee(t), u = t.type, h = t.pendingProps, w = e !== null ? e.memoizedProps : null, s = h.children, yd(u, h) ? s = null : w !== null && yd(u, w) && (t.flags |= 32), t.memoizedState !== null && (u = pu(e, t, Fx, null, null, a), Yo._currentValue = u), ni(e, t), Jt(e, t, s, a), t.child;
        case 6:
          return e === null && Fe && ((e = a = Et) && (a = Dw(a, t.pendingProps, Dn), a !== null ? (t.stateNode = a, Qt = t, Et = null, e = true) : e = false), e || ql(t)), null;
        case 13:
          return Og(e, t, a);
        case 4:
          return je(t, t.stateNode.containerInfo), s = t.pendingProps, e === null ? t.child = Hr(t, null, s, a) : Jt(e, t, s, a), t.child;
        case 11:
          return _g(e, t, t.type, t.pendingProps, a);
        case 7:
          return Jt(e, t, t.pendingProps, a), t.child;
        case 8:
          return Jt(e, t, t.pendingProps.children, a), t.child;
        case 12:
          return Jt(e, t, t.pendingProps.children, a), t.child;
        case 10:
          return s = t.pendingProps, Gl(t, t.type, s.value), Jt(e, t, s.children, a), t.child;
        case 9:
          return u = t.type._context, s = t.pendingProps.children, Or(t), u = Wt(u), s = s(u), t.flags |= 1, Jt(e, t, s, a), t.child;
        case 14:
          return kg(e, t, t.type, t.pendingProps, a);
        case 15:
          return Mg(e, t, t.type, t.pendingProps, a);
        case 19:
          return Dg(e, t, a);
        case 31:
          return rw(e, t, a);
        case 22:
          return jg(e, t, a, t.pendingProps);
        case 24:
          return Or(t), s = Wt(Yt), e === null ? (u = ou(), u === null && (u = vt, h = ru(), u.pooledCache = h, h.refCount++, h !== null && (u.pooledCacheLanes |= a), u = h), t.memoizedState = {
            parent: s,
            cache: u
          }, iu(t), Gl(t, Yt, u)) : ((e.lanes & a) !== 0 && (cu(e, t), vo(t, null, null, a), bo()), u = e.memoizedState, h = t.memoizedState, u.parent !== s ? (u = {
            parent: s,
            cache: s
          }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), Gl(t, Yt, s)) : (s = h.cache, Gl(t, Yt, s), s !== u.cache && lu(t, [
            Yt
          ], a, true))), Jt(e, t, t.pendingProps.children, a), t.child;
        case 29:
          throw t.pendingProps;
      }
      throw Error(o(156, t.tag));
    }
    function Ml(e) {
      e.flags |= 4;
    }
    function $u(e, t, a, s, u) {
      if ((t = (e.mode & 32) !== 0) && (t = false), t) {
        if (e.flags |= 16777216, (u & 335544128) === u) if (e.stateNode.complete) e.flags |= 8192;
        else if (up()) e.flags |= 8192;
        else throw zr = Bs, su;
      } else e.flags &= -16777217;
    }
    function Hg(e, t) {
      if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
      else if (e.flags |= 16777216, !Jp(t)) if (up()) e.flags |= 8192;
      else throw zr = Bs, su;
    }
    function ri(e, t) {
      t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Er() : 536870912, e.lanes |= t, ja |= t);
    }
    function _o(e, t) {
      if (!Fe) switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var a = null; t !== null; ) t.alternate !== null && (a = t), t = t.sibling;
          a === null ? e.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = e.tail;
          for (var s = null; a !== null; ) a.alternate !== null && (s = a), a = a.sibling;
          s === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : s.sibling = null;
      }
    }
    function _t(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = 0, s = 0;
      if (t) for (var u = e.child; u !== null; ) a |= u.lanes | u.childLanes, s |= u.subtreeFlags & 65011712, s |= u.flags & 65011712, u.return = e, u = u.sibling;
      else for (u = e.child; u !== null; ) a |= u.lanes | u.childLanes, s |= u.subtreeFlags, s |= u.flags, u.return = e, u = u.sibling;
      return e.subtreeFlags |= s, e.childLanes = a, t;
    }
    function ow(e, t, a) {
      var s = t.pendingProps;
      switch (Wc(t), t.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return _t(t), null;
        case 1:
          return _t(t), null;
        case 3:
          return a = t.stateNode, s = null, e !== null && (s = e.memoizedState.cache), t.memoizedState.cache !== s && (t.flags |= 2048), Cl(Yt), j(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (e === null || e.child === null) && (ga(t) ? Ml(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, eu())), _t(t), null;
        case 26:
          var u = t.type, h = t.memoizedState;
          return e === null ? (Ml(t), h !== null ? (_t(t), Hg(t, h)) : (_t(t), $u(t, u, null, s, a))) : h ? h !== e.memoizedState ? (Ml(t), _t(t), Hg(t, h)) : (_t(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== s && Ml(t), _t(t), $u(t, u, e, s, a)), null;
        case 27:
          if (oe(t), a = ce.current, u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== s && Ml(t);
          else {
            if (!s) {
              if (t.stateNode === null) throw Error(o(166));
              return _t(t), null;
            }
            e = Q.current, ga(t) ? ym(t) : (e = qp(u, s, a), t.stateNode = e, Ml(t));
          }
          return _t(t), null;
        case 5:
          if (oe(t), u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== s && Ml(t);
          else {
            if (!s) {
              if (t.stateNode === null) throw Error(o(166));
              return _t(t), null;
            }
            if (h = Q.current, ga(t)) ym(t);
            else {
              var w = vi(ce.current);
              switch (h) {
                case 1:
                  h = w.createElementNS("http://www.w3.org/2000/svg", u);
                  break;
                case 2:
                  h = w.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                  break;
                default:
                  switch (u) {
                    case "svg":
                      h = w.createElementNS("http://www.w3.org/2000/svg", u);
                      break;
                    case "math":
                      h = w.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                      break;
                    case "script":
                      h = w.createElement("div"), h.innerHTML = "<script><\/script>", h = h.removeChild(h.firstChild);
                      break;
                    case "select":
                      h = typeof s.is == "string" ? w.createElement("select", {
                        is: s.is
                      }) : w.createElement("select"), s.multiple ? h.multiple = true : s.size && (h.size = s.size);
                      break;
                    default:
                      h = typeof s.is == "string" ? w.createElement(u, {
                        is: s.is
                      }) : w.createElement(u);
                  }
              }
              h[jt] = t, h[tn] = s;
              e: for (w = t.child; w !== null; ) {
                if (w.tag === 5 || w.tag === 6) h.appendChild(w.stateNode);
                else if (w.tag !== 4 && w.tag !== 27 && w.child !== null) {
                  w.child.return = w, w = w.child;
                  continue;
                }
                if (w === t) break e;
                for (; w.sibling === null; ) {
                  if (w.return === null || w.return === t) break e;
                  w = w.return;
                }
                w.sibling.return = w.return, w = w.sibling;
              }
              t.stateNode = h;
              e: switch (en(h, u, s), u) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  s = !!s.autoFocus;
                  break e;
                case "img":
                  s = true;
                  break e;
                default:
                  s = false;
              }
              s && Ml(t);
            }
          }
          return _t(t), $u(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a), null;
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== s && Ml(t);
          else {
            if (typeof s != "string" && t.stateNode === null) throw Error(o(166));
            if (e = ce.current, ga(t)) {
              if (e = t.stateNode, a = t.memoizedProps, s = null, u = Qt, u !== null) switch (u.tag) {
                case 27:
                case 5:
                  s = u.memoizedProps;
              }
              e[jt] = t, e = !!(e.nodeValue === a || s !== null && s.suppressHydrationWarning === true || Op(e.nodeValue, a)), e || ql(t, true);
            } else e = vi(e).createTextNode(s), e[jt] = t, t.stateNode = e;
          }
          return _t(t), null;
        case 31:
          if (a = t.memoizedState, e === null || e.memoizedState !== null) {
            if (s = ga(t), a !== null) {
              if (e === null) {
                if (!s) throw Error(o(318));
                if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
                e[jt] = t;
              } else Tr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              _t(t), e = false;
            } else a = eu(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), e = true;
            if (!e) return t.flags & 256 ? (En(t), t) : (En(t), null);
            if ((t.flags & 128) !== 0) throw Error(o(558));
          }
          return _t(t), null;
        case 13:
          if (s = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            if (u = ga(t), s !== null && s.dehydrated !== null) {
              if (e === null) {
                if (!u) throw Error(o(318));
                if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(o(317));
                u[jt] = t;
              } else Tr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              _t(t), u = false;
            } else u = eu(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = u), u = true;
            if (!u) return t.flags & 256 ? (En(t), t) : (En(t), null);
          }
          return En(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = s !== null, e = e !== null && e.memoizedState !== null, a && (s = t.child, u = null, s.alternate !== null && s.alternate.memoizedState !== null && s.alternate.memoizedState.cachePool !== null && (u = s.alternate.memoizedState.cachePool.pool), h = null, s.memoizedState !== null && s.memoizedState.cachePool !== null && (h = s.memoizedState.cachePool.pool), h !== u && (s.flags |= 2048)), a !== e && a && (t.child.flags |= 8192), ri(t, t.updateQueue), _t(t), null);
        case 4:
          return j(), e === null && fd(t.stateNode.containerInfo), _t(t), null;
        case 10:
          return Cl(t.type), _t(t), null;
        case 19:
          if (z(Ot), s = t.memoizedState, s === null) return _t(t), null;
          if (u = (t.flags & 128) !== 0, h = s.rendering, h === null) if (u) _o(s, false);
          else {
            if (Tt !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
              if (h = qs(e), h !== null) {
                for (t.flags |= 128, _o(s, false), e = h.updateQueue, t.updateQueue = e, ri(t, e), t.subtreeFlags = 0, e = a, a = t.child; a !== null; ) fm(a, e), a = a.sibling;
                return Z(Ot, Ot.current & 1 | 2), Fe && wl(t, s.treeForkCount), t.child;
              }
              e = e.sibling;
            }
            s.tail !== null && st() > ci && (t.flags |= 128, u = true, _o(s, false), t.lanes = 4194304);
          }
          else {
            if (!u) if (e = qs(h), e !== null) {
              if (t.flags |= 128, u = true, e = e.updateQueue, t.updateQueue = e, ri(t, e), _o(s, true), s.tail === null && s.tailMode === "hidden" && !h.alternate && !Fe) return _t(t), null;
            } else 2 * st() - s.renderingStartTime > ci && a !== 536870912 && (t.flags |= 128, u = true, _o(s, false), t.lanes = 4194304);
            s.isBackwards ? (h.sibling = t.child, t.child = h) : (e = s.last, e !== null ? e.sibling = h : t.child = h, s.last = h);
          }
          return s.tail !== null ? (e = s.tail, s.rendering = e, s.tail = e.sibling, s.renderingStartTime = st(), e.sibling = null, a = Ot.current, Z(Ot, u ? a & 1 | 2 : a & 1), Fe && wl(t, s.treeForkCount), e) : (_t(t), null);
        case 22:
        case 23:
          return En(t), hu(), s = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== s && (t.flags |= 8192) : s && (t.flags |= 8192), s ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (_t(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : _t(t), a = t.updateQueue, a !== null && ri(t, a.retryQueue), a = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), s = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (s = t.memoizedState.cachePool.pool), s !== a && (t.flags |= 2048), e !== null && z(Ir), null;
        case 24:
          return a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Cl(Yt), _t(t), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(o(156, t.tag));
    }
    function sw(e, t) {
      switch (Wc(t), t.tag) {
        case 1:
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 3:
          return Cl(Yt), j(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
        case 26:
        case 27:
        case 5:
          return oe(t), null;
        case 31:
          if (t.memoizedState !== null) {
            if (En(t), t.alternate === null) throw Error(o(340));
            Tr();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 13:
          if (En(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
            if (t.alternate === null) throw Error(o(340));
            Tr();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 19:
          return z(Ot), null;
        case 4:
          return j(), null;
        case 10:
          return Cl(t.type), null;
        case 22:
        case 23:
          return En(t), hu(), e !== null && z(Ir), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 24:
          return Cl(Yt), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Yg(e, t) {
      switch (Wc(t), t.tag) {
        case 3:
          Cl(Yt), j();
          break;
        case 26:
        case 27:
        case 5:
          oe(t);
          break;
        case 4:
          j();
          break;
        case 31:
          t.memoizedState !== null && En(t);
          break;
        case 13:
          En(t);
          break;
        case 19:
          z(Ot);
          break;
        case 10:
          Cl(t.type);
          break;
        case 22:
        case 23:
          En(t), hu(), e !== null && z(Ir);
          break;
        case 24:
          Cl(Yt);
      }
    }
    function ko(e, t) {
      try {
        var a = t.updateQueue, s = a !== null ? a.lastEffect : null;
        if (s !== null) {
          var u = s.next;
          a = u;
          do {
            if ((a.tag & e) === e) {
              s = void 0;
              var h = a.create, w = a.inst;
              s = h(), w.destroy = s;
            }
            a = a.next;
          } while (a !== u);
        }
      } catch (M) {
        mt(t, t.return, M);
      }
    }
    function Wl(e, t, a) {
      try {
        var s = t.updateQueue, u = s !== null ? s.lastEffect : null;
        if (u !== null) {
          var h = u.next;
          s = h;
          do {
            if ((s.tag & e) === e) {
              var w = s.inst, M = w.destroy;
              if (M !== void 0) {
                w.destroy = void 0, u = t;
                var H = a, G = M;
                try {
                  G();
                } catch (re) {
                  mt(u, H, re);
                }
              }
            }
            s = s.next;
          } while (s !== h);
        }
      } catch (re) {
        mt(t, t.return, re);
      }
    }
    function Ug(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var a = e.stateNode;
        try {
          Rm(t, a);
        } catch (s) {
          mt(e, e.return, s);
        }
      }
    }
    function Bg(e, t, a) {
      a.props = Ur(e.type, e.memoizedProps), a.state = e.memoizedState;
      try {
        a.componentWillUnmount();
      } catch (s) {
        mt(e, t, s);
      }
    }
    function Mo(e, t) {
      try {
        var a = e.ref;
        if (a !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var s = e.stateNode;
              break;
            case 30:
              s = e.stateNode;
              break;
            default:
              s = e.stateNode;
          }
          typeof a == "function" ? e.refCleanup = a(s) : a.current = s;
        }
      } catch (u) {
        mt(e, t, u);
      }
    }
    function al(e, t) {
      var a = e.ref, s = e.refCleanup;
      if (a !== null) if (typeof s == "function") try {
        s();
      } catch (u) {
        mt(e, t, u);
      } finally {
        e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
      }
      else if (typeof a == "function") try {
        a(null);
      } catch (u) {
        mt(e, t, u);
      }
      else a.current = null;
    }
    function Xg(e) {
      var t = e.type, a = e.memoizedProps, s = e.stateNode;
      try {
        e: switch (t) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            a.autoFocus && s.focus();
            break e;
          case "img":
            a.src ? s.src = a.src : a.srcSet && (s.srcset = a.srcSet);
        }
      } catch (u) {
        mt(e, e.return, u);
      }
    }
    function qu(e, t, a) {
      try {
        var s = e.stateNode;
        Lw(s, e.type, a, t), s[tn] = t;
      } catch (u) {
        mt(e, e.return, u);
      }
    }
    function Vg(e) {
      return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ar(e.type) || e.tag === 4;
    }
    function Gu(e) {
      e: for (; ; ) {
        for (; e.sibling === null; ) {
          if (e.return === null || Vg(e.return)) return null;
          e = e.return;
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
          if (e.tag === 27 && ar(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
          e.child.return = e, e = e.child;
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Pu(e, t, a) {
      var s = e.tag;
      if (s === 5 || s === 6) e = e.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(e, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(e), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = bl));
      else if (s !== 4 && (s === 27 && ar(e.type) && (a = e.stateNode, t = null), e = e.child, e !== null)) for (Pu(e, t, a), e = e.sibling; e !== null; ) Pu(e, t, a), e = e.sibling;
    }
    function ai(e, t, a) {
      var s = e.tag;
      if (s === 5 || s === 6) e = e.stateNode, t ? a.insertBefore(e, t) : a.appendChild(e);
      else if (s !== 4 && (s === 27 && ar(e.type) && (a = e.stateNode), e = e.child, e !== null)) for (ai(e, t, a), e = e.sibling; e !== null; ) ai(e, t, a), e = e.sibling;
    }
    function $g(e) {
      var t = e.stateNode, a = e.memoizedProps;
      try {
        for (var s = e.type, u = t.attributes; u.length; ) t.removeAttributeNode(u[0]);
        en(t, s, a), t[jt] = e, t[tn] = a;
      } catch (h) {
        mt(e, e.return, h);
      }
    }
    var jl = false, Xt = false, Zu = false, qg = typeof WeakSet == "function" ? WeakSet : Set, Zt = null;
    function iw(e, t) {
      if (e = e.containerInfo, gd = ki, e = lm(e), Bc(e)) {
        if ("selectionStart" in e) var a = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
        else e: {
          a = (a = e.ownerDocument) && a.defaultView || window;
          var s = a.getSelection && a.getSelection();
          if (s && s.rangeCount !== 0) {
            a = s.anchorNode;
            var u = s.anchorOffset, h = s.focusNode;
            s = s.focusOffset;
            try {
              a.nodeType, h.nodeType;
            } catch {
              a = null;
              break e;
            }
            var w = 0, M = -1, H = -1, G = 0, re = 0, se = e, P = null;
            t: for (; ; ) {
              for (var F; se !== a || u !== 0 && se.nodeType !== 3 || (M = w + u), se !== h || s !== 0 && se.nodeType !== 3 || (H = w + s), se.nodeType === 3 && (w += se.nodeValue.length), (F = se.firstChild) !== null; ) P = se, se = F;
              for (; ; ) {
                if (se === e) break t;
                if (P === a && ++G === u && (M = w), P === h && ++re === s && (H = w), (F = se.nextSibling) !== null) break;
                se = P, P = se.parentNode;
              }
              se = F;
            }
            a = M === -1 || H === -1 ? null : {
              start: M,
              end: H
            };
          } else a = null;
        }
        a = a || {
          start: 0,
          end: 0
        };
      } else a = null;
      for (pd = {
        focusedElem: e,
        selectionRange: a
      }, ki = false, Zt = t; Zt !== null; ) if (t = Zt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, Zt = e;
      else for (; Zt !== null; ) {
        switch (t = Zt, h = t.alternate, e = t.flags, t.tag) {
          case 0:
            if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null)) for (a = 0; a < e.length; a++) u = e[a], u.ref.impl = u.nextImpl;
            break;
          case 11:
          case 15:
            break;
          case 1:
            if ((e & 1024) !== 0 && h !== null) {
              e = void 0, a = t, u = h.memoizedProps, h = h.memoizedState, s = a.stateNode;
              try {
                var _e = Ur(a.type, u);
                e = s.getSnapshotBeforeUpdate(_e, h), s.__reactInternalSnapshotBeforeUpdate = e;
              } catch (Ae) {
                mt(a, a.return, Ae);
              }
            }
            break;
          case 3:
            if ((e & 1024) !== 0) {
              if (e = t.stateNode.containerInfo, a = e.nodeType, a === 9) vd(e);
              else if (a === 1) switch (e.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  vd(e);
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
          e.return = t.return, Zt = e;
          break;
        }
        Zt = t.return;
      }
    }
    function Gg(e, t, a) {
      var s = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          Rl(e, a), s & 4 && ko(5, a);
          break;
        case 1:
          if (Rl(e, a), s & 4) if (e = a.stateNode, t === null) try {
            e.componentDidMount();
          } catch (w) {
            mt(a, a.return, w);
          }
          else {
            var u = Ur(a.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(u, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (w) {
              mt(a, a.return, w);
            }
          }
          s & 64 && Ug(a), s & 512 && Mo(a, a.return);
          break;
        case 3:
          if (Rl(e, a), s & 64 && (e = a.updateQueue, e !== null)) {
            if (t = null, a.child !== null) switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
            try {
              Rm(e, t);
            } catch (w) {
              mt(a, a.return, w);
            }
          }
          break;
        case 27:
          t === null && s & 4 && $g(a);
        case 26:
        case 5:
          Rl(e, a), t === null && s & 4 && Xg(a), s & 512 && Mo(a, a.return);
          break;
        case 12:
          Rl(e, a);
          break;
        case 31:
          Rl(e, a), s & 4 && Kg(e, a);
          break;
        case 13:
          Rl(e, a), s & 4 && Fg(e, a), s & 64 && (e = a.memoizedState, e !== null && (e = e.dehydrated, e !== null && (a = yw.bind(null, a), zw(e, a))));
          break;
        case 22:
          if (s = a.memoizedState !== null || jl, !s) {
            t = t !== null && t.memoizedState !== null || Xt, u = jl;
            var h = Xt;
            jl = s, (Xt = t) && !h ? Al(e, a, (a.subtreeFlags & 8772) !== 0) : Rl(e, a), jl = u, Xt = h;
          }
          break;
        case 30:
          break;
        default:
          Rl(e, a);
      }
    }
    function Pg(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Pg(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && ut(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
    }
    var Lt = null, pn = false;
    function Ll(e, t, a) {
      for (a = a.child; a !== null; ) Zg(e, t, a), a = a.sibling;
    }
    function Zg(e, t, a) {
      if (St && typeof St.onCommitFiberUnmount == "function") try {
        St.onCommitFiberUnmount(Kt, a);
      } catch {
      }
      switch (a.tag) {
        case 26:
          Xt || al(a, t), Ll(e, t, a), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
          break;
        case 27:
          Xt || al(a, t);
          var s = Lt, u = pn;
          ar(a.type) && (Lt = a.stateNode, pn = false), Ll(e, t, a), Do(a.stateNode), Lt = s, pn = u;
          break;
        case 5:
          Xt || al(a, t);
        case 6:
          if (s = Lt, u = pn, Lt = null, Ll(e, t, a), Lt = s, pn = u, Lt !== null) if (pn) try {
            (Lt.nodeType === 9 ? Lt.body : Lt.nodeName === "HTML" ? Lt.ownerDocument.body : Lt).removeChild(a.stateNode);
          } catch (h) {
            mt(a, t, h);
          }
          else try {
            Lt.removeChild(a.stateNode);
          } catch (h) {
            mt(a, t, h);
          }
          break;
        case 18:
          Lt !== null && (pn ? (e = Lt, Up(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, a.stateNode), Da(e)) : Up(Lt, a.stateNode));
          break;
        case 4:
          s = Lt, u = pn, Lt = a.stateNode.containerInfo, pn = true, Ll(e, t, a), Lt = s, pn = u;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          Wl(2, a, t), Xt || Wl(4, a, t), Ll(e, t, a);
          break;
        case 1:
          Xt || (al(a, t), s = a.stateNode, typeof s.componentWillUnmount == "function" && Bg(a, t, s)), Ll(e, t, a);
          break;
        case 21:
          Ll(e, t, a);
          break;
        case 22:
          Xt = (s = Xt) || a.memoizedState !== null, Ll(e, t, a), Xt = s;
          break;
        default:
          Ll(e, t, a);
      }
    }
    function Kg(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
        e = e.dehydrated;
        try {
          Da(e);
        } catch (a) {
          mt(t, t.return, a);
        }
      }
    }
    function Fg(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
        Da(e);
      } catch (a) {
        mt(t, t.return, a);
      }
    }
    function cw(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return t === null && (t = e.stateNode = new qg()), t;
        case 22:
          return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new qg()), t;
        default:
          throw Error(o(435, e.tag));
      }
    }
    function oi(e, t) {
      var a = cw(e);
      t.forEach(function(s) {
        if (!a.has(s)) {
          a.add(s);
          var u = bw.bind(null, e, s);
          s.then(u, u);
        }
      });
    }
    function yn(e, t) {
      var a = t.deletions;
      if (a !== null) for (var s = 0; s < a.length; s++) {
        var u = a[s], h = e, w = t, M = w;
        e: for (; M !== null; ) {
          switch (M.tag) {
            case 27:
              if (ar(M.type)) {
                Lt = M.stateNode, pn = false;
                break e;
              }
              break;
            case 5:
              Lt = M.stateNode, pn = false;
              break e;
            case 3:
            case 4:
              Lt = M.stateNode.containerInfo, pn = true;
              break e;
          }
          M = M.return;
        }
        if (Lt === null) throw Error(o(160));
        Zg(h, w, u), Lt = null, pn = false, h = u.alternate, h !== null && (h.return = null), u.return = null;
      }
      if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) Qg(t, e), t = t.sibling;
    }
    var Zn = null;
    function Qg(e, t) {
      var a = e.alternate, s = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          yn(t, e), bn(e), s & 4 && (Wl(3, e, e.return), ko(3, e), Wl(5, e, e.return));
          break;
        case 1:
          yn(t, e), bn(e), s & 512 && (Xt || a === null || al(a, a.return)), s & 64 && jl && (e = e.updateQueue, e !== null && (s = e.callbacks, s !== null && (a = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = a === null ? s : a.concat(s))));
          break;
        case 26:
          var u = Zn;
          if (yn(t, e), bn(e), s & 512 && (Xt || a === null || al(a, a.return)), s & 4) {
            var h = a !== null ? a.memoizedState : null;
            if (s = e.memoizedState, a === null) if (s === null) if (e.stateNode === null) {
              e: {
                s = e.type, a = e.memoizedProps, u = u.ownerDocument || u;
                t: switch (s) {
                  case "title":
                    h = u.getElementsByTagName("title")[0], (!h || h[Oe] || h[jt] || h.namespaceURI === "http://www.w3.org/2000/svg" || h.hasAttribute("itemprop")) && (h = u.createElement(s), u.head.insertBefore(h, u.querySelector("head > title"))), en(h, s, a), h[jt] = e, Ne(h), s = h;
                    break e;
                  case "link":
                    var w = Qp("link", "href", u).get(s + (a.href || ""));
                    if (w) {
                      for (var M = 0; M < w.length; M++) if (h = w[M], h.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && h.getAttribute("rel") === (a.rel == null ? null : a.rel) && h.getAttribute("title") === (a.title == null ? null : a.title) && h.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                        w.splice(M, 1);
                        break t;
                      }
                    }
                    h = u.createElement(s), en(h, s, a), u.head.appendChild(h);
                    break;
                  case "meta":
                    if (w = Qp("meta", "content", u).get(s + (a.content || ""))) {
                      for (M = 0; M < w.length; M++) if (h = w[M], h.getAttribute("content") === (a.content == null ? null : "" + a.content) && h.getAttribute("name") === (a.name == null ? null : a.name) && h.getAttribute("property") === (a.property == null ? null : a.property) && h.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && h.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                        w.splice(M, 1);
                        break t;
                      }
                    }
                    h = u.createElement(s), en(h, s, a), u.head.appendChild(h);
                    break;
                  default:
                    throw Error(o(468, s));
                }
                h[jt] = e, Ne(h), s = h;
              }
              e.stateNode = s;
            } else Wp(u, e.type, e.stateNode);
            else e.stateNode = Fp(u, s, e.memoizedProps);
            else h !== s ? (h === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : h.count--, s === null ? Wp(u, e.type, e.stateNode) : Fp(u, s, e.memoizedProps)) : s === null && e.stateNode !== null && qu(e, e.memoizedProps, a.memoizedProps);
          }
          break;
        case 27:
          yn(t, e), bn(e), s & 512 && (Xt || a === null || al(a, a.return)), a !== null && s & 4 && qu(e, e.memoizedProps, a.memoizedProps);
          break;
        case 5:
          if (yn(t, e), bn(e), s & 512 && (Xt || a === null || al(a, a.return)), e.flags & 32) {
            u = e.stateNode;
            try {
              aa(u, "");
            } catch (_e) {
              mt(e, e.return, _e);
            }
          }
          s & 4 && e.stateNode != null && (u = e.memoizedProps, qu(e, u, a !== null ? a.memoizedProps : u)), s & 1024 && (Zu = true);
          break;
        case 6:
          if (yn(t, e), bn(e), s & 4) {
            if (e.stateNode === null) throw Error(o(162));
            s = e.memoizedProps, a = e.stateNode;
            try {
              a.nodeValue = s;
            } catch (_e) {
              mt(e, e.return, _e);
            }
          }
          break;
        case 3:
          if (Si = null, u = Zn, Zn = xi(t.containerInfo), yn(t, e), Zn = u, bn(e), s & 4 && a !== null && a.memoizedState.isDehydrated) try {
            Da(t.containerInfo);
          } catch (_e) {
            mt(e, e.return, _e);
          }
          Zu && (Zu = false, Wg(e));
          break;
        case 4:
          s = Zn, Zn = xi(e.stateNode.containerInfo), yn(t, e), bn(e), Zn = s;
          break;
        case 12:
          yn(t, e), bn(e);
          break;
        case 31:
          yn(t, e), bn(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, oi(e, s)));
          break;
        case 13:
          yn(t, e), bn(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (ii = st()), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, oi(e, s)));
          break;
        case 22:
          u = e.memoizedState !== null;
          var H = a !== null && a.memoizedState !== null, G = jl, re = Xt;
          if (jl = G || u, Xt = re || H, yn(t, e), Xt = re, jl = G, bn(e), s & 8192) e: for (t = e.stateNode, t._visibility = u ? t._visibility & -2 : t._visibility | 1, u && (a === null || H || jl || Xt || Br(e)), a = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                H = a = t;
                try {
                  if (h = H.stateNode, u) w = h.style, typeof w.setProperty == "function" ? w.setProperty("display", "none", "important") : w.display = "none";
                  else {
                    M = H.stateNode;
                    var se = H.memoizedProps.style, P = se != null && se.hasOwnProperty("display") ? se.display : null;
                    M.style.display = P == null || typeof P == "boolean" ? "" : ("" + P).trim();
                  }
                } catch (_e) {
                  mt(H, H.return, _e);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                H = t;
                try {
                  H.stateNode.nodeValue = u ? "" : H.memoizedProps;
                } catch (_e) {
                  mt(H, H.return, _e);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                H = t;
                try {
                  var F = H.stateNode;
                  u ? Bp(F, true) : Bp(H.stateNode, false);
                } catch (_e) {
                  mt(H, H.return, _e);
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
          s & 4 && (s = e.updateQueue, s !== null && (a = s.retryQueue, a !== null && (s.retryQueue = null, oi(e, a))));
          break;
        case 19:
          yn(t, e), bn(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, oi(e, s)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          yn(t, e), bn(e);
      }
    }
    function bn(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var a, s = e.return; s !== null; ) {
            if (Vg(s)) {
              a = s;
              break;
            }
            s = s.return;
          }
          if (a == null) throw Error(o(160));
          switch (a.tag) {
            case 27:
              var u = a.stateNode, h = Gu(e);
              ai(e, h, u);
              break;
            case 5:
              var w = a.stateNode;
              a.flags & 32 && (aa(w, ""), a.flags &= -33);
              var M = Gu(e);
              ai(e, M, w);
              break;
            case 3:
            case 4:
              var H = a.stateNode.containerInfo, G = Gu(e);
              Pu(e, G, H);
              break;
            default:
              throw Error(o(161));
          }
        } catch (re) {
          mt(e, e.return, re);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function Wg(e) {
      if (e.subtreeFlags & 1024) for (e = e.child; e !== null; ) {
        var t = e;
        Wg(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
    }
    function Rl(e, t) {
      if (t.subtreeFlags & 8772) for (t = t.child; t !== null; ) Gg(e, t.alternate, t), t = t.sibling;
    }
    function Br(e) {
      for (e = e.child; e !== null; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            Wl(4, t, t.return), Br(t);
            break;
          case 1:
            al(t, t.return);
            var a = t.stateNode;
            typeof a.componentWillUnmount == "function" && Bg(t, t.return, a), Br(t);
            break;
          case 27:
            Do(t.stateNode);
          case 26:
          case 5:
            al(t, t.return), Br(t);
            break;
          case 22:
            t.memoizedState === null && Br(t);
            break;
          case 30:
            Br(t);
            break;
          default:
            Br(t);
        }
        e = e.sibling;
      }
    }
    function Al(e, t, a) {
      for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
        var s = t.alternate, u = e, h = t, w = h.flags;
        switch (h.tag) {
          case 0:
          case 11:
          case 15:
            Al(u, h, a), ko(4, h);
            break;
          case 1:
            if (Al(u, h, a), s = h, u = s.stateNode, typeof u.componentDidMount == "function") try {
              u.componentDidMount();
            } catch (G) {
              mt(s, s.return, G);
            }
            if (s = h, u = s.updateQueue, u !== null) {
              var M = s.stateNode;
              try {
                var H = u.shared.hiddenCallbacks;
                if (H !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < H.length; u++) Lm(H[u], M);
              } catch (G) {
                mt(s, s.return, G);
              }
            }
            a && w & 64 && Ug(h), Mo(h, h.return);
            break;
          case 27:
            $g(h);
          case 26:
          case 5:
            Al(u, h, a), a && s === null && w & 4 && Xg(h), Mo(h, h.return);
            break;
          case 12:
            Al(u, h, a);
            break;
          case 31:
            Al(u, h, a), a && w & 4 && Kg(u, h);
            break;
          case 13:
            Al(u, h, a), a && w & 4 && Fg(u, h);
            break;
          case 22:
            h.memoizedState === null && Al(u, h, a), Mo(h, h.return);
            break;
          case 30:
            break;
          default:
            Al(u, h, a);
        }
        t = t.sibling;
      }
    }
    function Ku(e, t) {
      var a = null;
      e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (e != null && e.refCount++, a != null && ho(a));
    }
    function Fu(e, t) {
      e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ho(e));
    }
    function Kn(e, t, a, s) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) Jg(e, t, a, s), t = t.sibling;
    }
    function Jg(e, t, a, s) {
      var u = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Kn(e, t, a, s), u & 2048 && ko(9, t);
          break;
        case 1:
          Kn(e, t, a, s);
          break;
        case 3:
          Kn(e, t, a, s), u & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ho(e)));
          break;
        case 12:
          if (u & 2048) {
            Kn(e, t, a, s), e = t.stateNode;
            try {
              var h = t.memoizedProps, w = h.id, M = h.onPostCommit;
              typeof M == "function" && M(w, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
            } catch (H) {
              mt(t, t.return, H);
            }
          } else Kn(e, t, a, s);
          break;
        case 31:
          Kn(e, t, a, s);
          break;
        case 13:
          Kn(e, t, a, s);
          break;
        case 23:
          break;
        case 22:
          h = t.stateNode, w = t.alternate, t.memoizedState !== null ? h._visibility & 2 ? Kn(e, t, a, s) : jo(e, t) : h._visibility & 2 ? Kn(e, t, a, s) : (h._visibility |= 2, _a(e, t, a, s, (t.subtreeFlags & 10256) !== 0 || false)), u & 2048 && Ku(w, t);
          break;
        case 24:
          Kn(e, t, a, s), u & 2048 && Fu(t.alternate, t);
          break;
        default:
          Kn(e, t, a, s);
      }
    }
    function _a(e, t, a, s, u) {
      for (u = u && ((t.subtreeFlags & 10256) !== 0 || false), t = t.child; t !== null; ) {
        var h = e, w = t, M = a, H = s, G = w.flags;
        switch (w.tag) {
          case 0:
          case 11:
          case 15:
            _a(h, w, M, H, u), ko(8, w);
            break;
          case 23:
            break;
          case 22:
            var re = w.stateNode;
            w.memoizedState !== null ? re._visibility & 2 ? _a(h, w, M, H, u) : jo(h, w) : (re._visibility |= 2, _a(h, w, M, H, u)), u && G & 2048 && Ku(w.alternate, w);
            break;
          case 24:
            _a(h, w, M, H, u), u && G & 2048 && Fu(w.alternate, w);
            break;
          default:
            _a(h, w, M, H, u);
        }
        t = t.sibling;
      }
    }
    function jo(e, t) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) {
        var a = e, s = t, u = s.flags;
        switch (s.tag) {
          case 22:
            jo(a, s), u & 2048 && Ku(s.alternate, s);
            break;
          case 24:
            jo(a, s), u & 2048 && Fu(s.alternate, s);
            break;
          default:
            jo(a, s);
        }
        t = t.sibling;
      }
    }
    var Lo = 8192;
    function ka(e, t, a) {
      if (e.subtreeFlags & Lo) for (e = e.child; e !== null; ) ep(e, t, a), e = e.sibling;
    }
    function ep(e, t, a) {
      switch (e.tag) {
        case 26:
          ka(e, t, a), e.flags & Lo && e.memoizedState !== null && Kw(a, Zn, e.memoizedState, e.memoizedProps);
          break;
        case 5:
          ka(e, t, a);
          break;
        case 3:
        case 4:
          var s = Zn;
          Zn = xi(e.stateNode.containerInfo), ka(e, t, a), Zn = s;
          break;
        case 22:
          e.memoizedState === null && (s = e.alternate, s !== null && s.memoizedState !== null ? (s = Lo, Lo = 16777216, ka(e, t, a), Lo = s) : ka(e, t, a));
          break;
        default:
          ka(e, t, a);
      }
    }
    function tp(e) {
      var t = e.alternate;
      if (t !== null && (e = t.child, e !== null)) {
        t.child = null;
        do
          t = e.sibling, e.sibling = null, e = t;
        while (e !== null);
      }
    }
    function Ro(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var a = 0; a < t.length; a++) {
          var s = t[a];
          Zt = s, lp(s, e);
        }
        tp(e);
      }
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) np(e), e = e.sibling;
    }
    function np(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Ro(e), e.flags & 2048 && Wl(9, e, e.return);
          break;
        case 3:
          Ro(e);
          break;
        case 12:
          Ro(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, si(e)) : Ro(e);
          break;
        default:
          Ro(e);
      }
    }
    function si(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var a = 0; a < t.length; a++) {
          var s = t[a];
          Zt = s, lp(s, e);
        }
        tp(e);
      }
      for (e = e.child; e !== null; ) {
        switch (t = e, t.tag) {
          case 0:
          case 11:
          case 15:
            Wl(8, t, t.return), si(t);
            break;
          case 22:
            a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, si(t));
            break;
          default:
            si(t);
        }
        e = e.sibling;
      }
    }
    function lp(e, t) {
      for (; Zt !== null; ) {
        var a = Zt;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            Wl(8, a, t);
            break;
          case 23:
          case 22:
            if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
              var s = a.memoizedState.cachePool.pool;
              s != null && s.refCount++;
            }
            break;
          case 24:
            ho(a.memoizedState.cache);
        }
        if (s = a.child, s !== null) s.return = a, Zt = s;
        else e: for (a = e; Zt !== null; ) {
          s = Zt;
          var u = s.sibling, h = s.return;
          if (Pg(s), s === a) {
            Zt = null;
            break e;
          }
          if (u !== null) {
            u.return = h, Zt = u;
            break e;
          }
          Zt = h;
        }
      }
    }
    var uw = {
      getCacheForType: function(e) {
        var t = Wt(Yt), a = t.data.get(e);
        return a === void 0 && (a = e(), t.data.set(e, a)), a;
      },
      cacheSignal: function() {
        return Wt(Yt).controller.signal;
      }
    }, dw = typeof WeakMap == "function" ? WeakMap : Map, it = 0, vt = null, qe = null, Ze = 0, ht = 0, _n = null, Jl = false, Ma = false, Qu = false, Tl = 0, Tt = 0, er = 0, Xr = 0, Wu = 0, kn = 0, ja = 0, Ao = null, vn = null, Ju = false, ii = 0, rp = 0, ci = 1 / 0, ui = null, tr = null, qt = 0, nr = null, La = null, Nl = 0, ed = 0, td = null, ap = null, To = 0, nd = null;
    function Mn() {
      return (it & 2) !== 0 && Ze !== 0 ? Ze & -Ze : $.T !== null ? id() : Wa();
    }
    function op() {
      if (kn === 0) if ((Ze & 536870912) === 0 || Fe) {
        var e = Wr;
        Wr <<= 1, (Wr & 3932160) === 0 && (Wr = 262144), kn = e;
      } else kn = 536870912;
      return e = Cn.current, e !== null && (e.flags |= 32), kn;
    }
    function xn(e, t, a) {
      (e === vt && (ht === 2 || ht === 9) || e.cancelPendingCommit !== null) && (Ra(e, 0), lr(e, Ze, kn, false)), fl(e, a), ((it & 2) === 0 || e !== vt) && (e === vt && ((it & 2) === 0 && (Xr |= a), Tt === 4 && lr(e, Ze, kn, false)), ol(e));
    }
    function sp(e, t, a) {
      if ((it & 6) !== 0) throw Error(o(327));
      var s = !a && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Cr(e, t), u = s ? mw(e, t) : rd(e, t, true), h = s;
      do {
        if (u === 0) {
          Ma && !s && lr(e, t, 0, false);
          break;
        } else {
          if (a = e.current.alternate, h && !fw(a)) {
            u = rd(e, t, false), h = false;
            continue;
          }
          if (u === 2) {
            if (h = t, e.errorRecoveryDisabledLanes & h) var w = 0;
            else w = e.pendingLanes & -536870913, w = w !== 0 ? w : w & 536870912 ? 536870912 : 0;
            if (w !== 0) {
              t = w;
              e: {
                var M = e;
                u = Ao;
                var H = M.current.memoizedState.isDehydrated;
                if (H && (Ra(M, w).flags |= 256), w = rd(M, w, false), w !== 2) {
                  if (Qu && !H) {
                    M.errorRecoveryDisabledLanes |= h, Xr |= h, u = 4;
                    break e;
                  }
                  h = vn, vn = u, h !== null && (vn === null ? vn = h : vn.push.apply(vn, h));
                }
                u = w;
              }
              if (h = false, u !== 2) continue;
            }
          }
          if (u === 1) {
            Ra(e, 0), lr(e, t, 0, true);
            break;
          }
          e: {
            switch (s = e, h = u, h) {
              case 0:
              case 1:
                throw Error(o(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                lr(s, t, kn, !Jl);
                break e;
              case 2:
                vn = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(o(329));
            }
            if ((t & 62914560) === t && (u = ii + 300 - st(), 10 < u)) {
              if (lr(s, t, kn, !Jl), Sr(s, 0, true) !== 0) break e;
              Nl = t, s.timeoutHandle = Hp(ip.bind(null, s, a, vn, ui, Ju, t, kn, Xr, ja, Jl, h, "Throttled", -0, 0), u);
              break e;
            }
            ip(s, a, vn, ui, Ju, t, kn, Xr, ja, Jl, h, null, -0, 0);
          }
        }
        break;
      } while (true);
      ol(e);
    }
    function ip(e, t, a, s, u, h, w, M, H, G, re, se, P, F) {
      if (e.timeoutHandle = -1, se = t.subtreeFlags, se & 8192 || (se & 16785408) === 16785408) {
        se = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: true,
          waitingForViewTransition: false,
          unsuspend: bl
        }, ep(t, h, se);
        var _e = (h & 62914560) === h ? ii - st() : (h & 4194048) === h ? rp - st() : 0;
        if (_e = Fw(se, _e), _e !== null) {
          Nl = h, e.cancelPendingCommit = _e(pp.bind(null, e, t, h, a, s, u, w, M, H, re, se, null, P, F)), lr(e, h, w, !G);
          return;
        }
      }
      pp(e, t, h, a, s, u, w, M, H);
    }
    function fw(e) {
      for (var t = e; ; ) {
        var a = t.tag;
        if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null))) for (var s = 0; s < a.length; s++) {
          var u = a[s], h = u.getSnapshot;
          u = u.value;
          try {
            if (!wn(h(), u)) return false;
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
    function lr(e, t, a, s) {
      t &= ~Wu, t &= ~Xr, e.suspendedLanes |= t, e.pingedLanes &= ~t, s && (e.warmLanes |= t), s = e.expirationTimes;
      for (var u = t; 0 < u; ) {
        var h = 31 - zt(u), w = 1 << h;
        s[h] = -1, u &= ~w;
      }
      a !== 0 && Jr(e, a, t);
    }
    function di() {
      return (it & 6) === 0 ? (No(0), false) : true;
    }
    function ld() {
      if (qe !== null) {
        if (ht === 0) var e = qe.return;
        else e = qe, Sl = Nr = null, vu(e), xa = null, go = 0, e = qe;
        for (; e !== null; ) Yg(e.alternate, e), e = e.return;
        qe = null;
      }
    }
    function Ra(e, t) {
      var a = e.timeoutHandle;
      a !== -1 && (e.timeoutHandle = -1, Tw(a)), a = e.cancelPendingCommit, a !== null && (e.cancelPendingCommit = null, a()), Nl = 0, ld(), vt = e, qe = a = xl(e.current, null), Ze = t, ht = 0, _n = null, Jl = false, Ma = Cr(e, t), Qu = false, ja = kn = Wu = Xr = er = Tt = 0, vn = Ao = null, Ju = false, (t & 8) !== 0 && (t |= t & 32);
      var s = e.entangledLanes;
      if (s !== 0) for (e = e.entanglements, s &= t; 0 < s; ) {
        var u = 31 - zt(s), h = 1 << u;
        t |= e[u], s &= ~h;
      }
      return Tl = t, Ts(), a;
    }
    function cp(e, t) {
      Ye = null, $.H = Co, t === va || t === Us ? (t = _m(), ht = 3) : t === su ? (t = _m(), ht = 4) : ht = t === Iu ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, _n = t, qe === null && (Tt = 1, ei(e, Nn(t, e.current)));
    }
    function up() {
      var e = Cn.current;
      return e === null ? true : (Ze & 4194048) === Ze ? zn === null : (Ze & 62914560) === Ze || (Ze & 536870912) !== 0 ? e === zn : false;
    }
    function dp() {
      var e = $.H;
      return $.H = Co, e === null ? Co : e;
    }
    function fp() {
      var e = $.A;
      return $.A = uw, e;
    }
    function fi() {
      Tt = 4, Jl || (Ze & 4194048) !== Ze && Cn.current !== null || (Ma = true), (er & 134217727) === 0 && (Xr & 134217727) === 0 || vt === null || lr(vt, Ze, kn, false);
    }
    function rd(e, t, a) {
      var s = it;
      it |= 2;
      var u = dp(), h = fp();
      (vt !== e || Ze !== t) && (ui = null, Ra(e, t)), t = false;
      var w = Tt;
      e: do
        try {
          if (ht !== 0 && qe !== null) {
            var M = qe, H = _n;
            switch (ht) {
              case 8:
                ld(), w = 6;
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                Cn.current === null && (t = true);
                var G = ht;
                if (ht = 0, _n = null, Aa(e, M, H, G), a && Ma) {
                  w = 0;
                  break e;
                }
                break;
              default:
                G = ht, ht = 0, _n = null, Aa(e, M, H, G);
            }
          }
          hw(), w = Tt;
          break;
        } catch (re) {
          cp(e, re);
        }
      while (true);
      return t && e.shellSuspendCounter++, Sl = Nr = null, it = s, $.H = u, $.A = h, qe === null && (vt = null, Ze = 0, Ts()), w;
    }
    function hw() {
      for (; qe !== null; ) hp(qe);
    }
    function mw(e, t) {
      var a = it;
      it |= 2;
      var s = dp(), u = fp();
      vt !== e || Ze !== t ? (ui = null, ci = st() + 500, Ra(e, t)) : Ma = Cr(e, t);
      e: do
        try {
          if (ht !== 0 && qe !== null) {
            t = qe;
            var h = _n;
            t: switch (ht) {
              case 1:
                ht = 0, _n = null, Aa(e, t, h, 1);
                break;
              case 2:
              case 9:
                if (Cm(h)) {
                  ht = 0, _n = null, mp(t);
                  break;
                }
                t = function() {
                  ht !== 2 && ht !== 9 || vt !== e || (ht = 7), ol(e);
                }, h.then(t, t);
                break e;
              case 3:
                ht = 7;
                break e;
              case 4:
                ht = 5;
                break e;
              case 7:
                Cm(h) ? (ht = 0, _n = null, mp(t)) : (ht = 0, _n = null, Aa(e, t, h, 7));
                break;
              case 5:
                var w = null;
                switch (qe.tag) {
                  case 26:
                    w = qe.memoizedState;
                  case 5:
                  case 27:
                    var M = qe;
                    if (w ? Jp(w) : M.stateNode.complete) {
                      ht = 0, _n = null;
                      var H = M.sibling;
                      if (H !== null) qe = H;
                      else {
                        var G = M.return;
                        G !== null ? (qe = G, hi(G)) : qe = null;
                      }
                      break t;
                    }
                }
                ht = 0, _n = null, Aa(e, t, h, 5);
                break;
              case 6:
                ht = 0, _n = null, Aa(e, t, h, 6);
                break;
              case 8:
                ld(), Tt = 6;
                break e;
              default:
                throw Error(o(462));
            }
          }
          gw();
          break;
        } catch (re) {
          cp(e, re);
        }
      while (true);
      return Sl = Nr = null, $.H = s, $.A = u, it = a, qe !== null ? 0 : (vt = null, Ze = 0, Ts(), Tt);
    }
    function gw() {
      for (; qe !== null && !lt(); ) hp(qe);
    }
    function hp(e) {
      var t = zg(e.alternate, e, Tl);
      e.memoizedProps = e.pendingProps, t === null ? hi(e) : qe = t;
    }
    function mp(e) {
      var t = e, a = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = Ag(a, t, t.pendingProps, t.type, void 0, Ze);
          break;
        case 11:
          t = Ag(a, t, t.pendingProps, t.type.render, t.ref, Ze);
          break;
        case 5:
          vu(t);
        default:
          Yg(a, t), t = qe = fm(t, Tl), t = zg(a, t, Tl);
      }
      e.memoizedProps = e.pendingProps, t === null ? hi(e) : qe = t;
    }
    function Aa(e, t, a, s) {
      Sl = Nr = null, vu(t), xa = null, go = 0;
      var u = t.return;
      try {
        if (lw(e, u, t, a, Ze)) {
          Tt = 1, ei(e, Nn(a, e.current)), qe = null;
          return;
        }
      } catch (h) {
        if (u !== null) throw qe = u, h;
        Tt = 1, ei(e, Nn(a, e.current)), qe = null;
        return;
      }
      t.flags & 32768 ? (Fe || s === 1 ? e = true : Ma || (Ze & 536870912) !== 0 ? e = false : (Jl = e = true, (s === 2 || s === 9 || s === 3 || s === 6) && (s = Cn.current, s !== null && s.tag === 13 && (s.flags |= 16384))), gp(t, e)) : hi(t);
    }
    function hi(e) {
      var t = e;
      do {
        if ((t.flags & 32768) !== 0) {
          gp(t, Jl);
          return;
        }
        e = t.return;
        var a = ow(t.alternate, t, Tl);
        if (a !== null) {
          qe = a;
          return;
        }
        if (t = t.sibling, t !== null) {
          qe = t;
          return;
        }
        qe = t = e;
      } while (t !== null);
      Tt === 0 && (Tt = 5);
    }
    function gp(e, t) {
      do {
        var a = sw(e.alternate, e);
        if (a !== null) {
          a.flags &= 32767, qe = a;
          return;
        }
        if (a = e.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (e = e.sibling, e !== null)) {
          qe = e;
          return;
        }
        qe = e = a;
      } while (e !== null);
      Tt = 6, qe = null;
    }
    function pp(e, t, a, s, u, h, w, M, H) {
      e.cancelPendingCommit = null;
      do
        mi();
      while (qt !== 0);
      if ((it & 6) !== 0) throw Error(o(327));
      if (t !== null) {
        if (t === e.current) throw Error(o(177));
        if (h = t.lanes | t.childLanes, h |= Gc, xs(e, a, h, w, M, H), e === vt && (qe = vt = null, Ze = 0), La = t, nr = e, Nl = a, ed = h, td = u, ap = s, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, vw(Rn, function() {
          return wp(), null;
        })) : (e.callbackNode = null, e.callbackPriority = 0), s = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || s) {
          s = $.T, $.T = null, u = K.p, K.p = 2, w = it, it |= 4;
          try {
            iw(e, t, a);
          } finally {
            it = w, K.p = u, $.T = s;
          }
        }
        qt = 1, yp(), bp(), vp();
      }
    }
    function yp() {
      if (qt === 1) {
        qt = 0;
        var e = nr, t = La, a = (t.flags & 13878) !== 0;
        if ((t.subtreeFlags & 13878) !== 0 || a) {
          a = $.T, $.T = null;
          var s = K.p;
          K.p = 2;
          var u = it;
          it |= 4;
          try {
            Qg(t, e);
            var h = pd, w = lm(e.containerInfo), M = h.focusedElem, H = h.selectionRange;
            if (w !== M && M && M.ownerDocument && nm(M.ownerDocument.documentElement, M)) {
              if (H !== null && Bc(M)) {
                var G = H.start, re = H.end;
                if (re === void 0 && (re = G), "selectionStart" in M) M.selectionStart = G, M.selectionEnd = Math.min(re, M.value.length);
                else {
                  var se = M.ownerDocument || document, P = se && se.defaultView || window;
                  if (P.getSelection) {
                    var F = P.getSelection(), _e = M.textContent.length, Ae = Math.min(H.start, _e), bt = H.end === void 0 ? Ae : Math.min(H.end, _e);
                    !F.extend && Ae > bt && (w = bt, bt = Ae, Ae = w);
                    var V = tm(M, Ae), X = tm(M, bt);
                    if (V && X && (F.rangeCount !== 1 || F.anchorNode !== V.node || F.anchorOffset !== V.offset || F.focusNode !== X.node || F.focusOffset !== X.offset)) {
                      var q = se.createRange();
                      q.setStart(V.node, V.offset), F.removeAllRanges(), Ae > bt ? (F.addRange(q), F.extend(X.node, X.offset)) : (q.setEnd(X.node, X.offset), F.addRange(q));
                    }
                  }
                }
              }
              for (se = [], F = M; F = F.parentNode; ) F.nodeType === 1 && se.push({
                element: F,
                left: F.scrollLeft,
                top: F.scrollTop
              });
              for (typeof M.focus == "function" && M.focus(), M = 0; M < se.length; M++) {
                var ae = se[M];
                ae.element.scrollLeft = ae.left, ae.element.scrollTop = ae.top;
              }
            }
            ki = !!gd, pd = gd = null;
          } finally {
            it = u, K.p = s, $.T = a;
          }
        }
        e.current = t, qt = 2;
      }
    }
    function bp() {
      if (qt === 2) {
        qt = 0;
        var e = nr, t = La, a = (t.flags & 8772) !== 0;
        if ((t.subtreeFlags & 8772) !== 0 || a) {
          a = $.T, $.T = null;
          var s = K.p;
          K.p = 2;
          var u = it;
          it |= 4;
          try {
            Gg(e, t.alternate, t);
          } finally {
            it = u, K.p = s, $.T = a;
          }
        }
        qt = 3;
      }
    }
    function vp() {
      if (qt === 4 || qt === 3) {
        qt = 0, wt();
        var e = nr, t = La, a = Nl, s = ap;
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? qt = 5 : (qt = 0, La = nr = null, xp(e, e.pendingLanes));
        var u = e.pendingLanes;
        if (u === 0 && (tr = null), Qa(a), t = t.stateNode, St && typeof St.onCommitFiberRoot == "function") try {
          St.onCommitFiberRoot(Kt, t, void 0, (t.current.flags & 128) === 128);
        } catch {
        }
        if (s !== null) {
          t = $.T, u = K.p, K.p = 2, $.T = null;
          try {
            for (var h = e.onRecoverableError, w = 0; w < s.length; w++) {
              var M = s[w];
              h(M.value, {
                componentStack: M.stack
              });
            }
          } finally {
            $.T = t, K.p = u;
          }
        }
        (Nl & 3) !== 0 && mi(), ol(e), u = e.pendingLanes, (a & 261930) !== 0 && (u & 42) !== 0 ? e === nd ? To++ : (To = 0, nd = e) : To = 0, No(0);
      }
    }
    function xp(e, t) {
      (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ho(t)));
    }
    function mi() {
      return yp(), bp(), vp(), wp();
    }
    function wp() {
      if (qt !== 5) return false;
      var e = nr, t = ed;
      ed = 0;
      var a = Qa(Nl), s = $.T, u = K.p;
      try {
        K.p = 32 > a ? 32 : a, $.T = null, a = td, td = null;
        var h = nr, w = Nl;
        if (qt = 0, La = nr = null, Nl = 0, (it & 6) !== 0) throw Error(o(331));
        var M = it;
        if (it |= 4, np(h.current), Jg(h, h.current, w, a), it = M, No(0, false), St && typeof St.onPostCommitFiberRoot == "function") try {
          St.onPostCommitFiberRoot(Kt, h);
        } catch {
        }
        return true;
      } finally {
        K.p = u, $.T = s, xp(e, t);
      }
    }
    function Sp(e, t, a) {
      t = Nn(a, t), t = Ou(e.stateNode, t, 2), e = Kl(e, t, 2), e !== null && (fl(e, 2), ol(e));
    }
    function mt(e, t, a) {
      if (e.tag === 3) Sp(e, e, a);
      else for (; t !== null; ) {
        if (t.tag === 3) {
          Sp(t, e, a);
          break;
        } else if (t.tag === 1) {
          var s = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && (tr === null || !tr.has(s))) {
            e = Nn(a, e), a = Cg(2), s = Kl(t, a, 2), s !== null && (Eg(a, s, t, e), fl(s, 2), ol(s));
            break;
          }
        }
        t = t.return;
      }
    }
    function ad(e, t, a) {
      var s = e.pingCache;
      if (s === null) {
        s = e.pingCache = new dw();
        var u = /* @__PURE__ */ new Set();
        s.set(t, u);
      } else u = s.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), s.set(t, u));
      u.has(a) || (Qu = true, u.add(a), e = pw.bind(null, e, t, a), t.then(e, e));
    }
    function pw(e, t, a) {
      var s = e.pingCache;
      s !== null && s.delete(t), e.pingedLanes |= e.suspendedLanes & a, e.warmLanes &= ~a, vt === e && (Ze & a) === a && (Tt === 4 || Tt === 3 && (Ze & 62914560) === Ze && 300 > st() - ii ? (it & 2) === 0 && Ra(e, 0) : Wu |= a, ja === Ze && (ja = 0)), ol(e);
    }
    function Cp(e, t) {
      t === 0 && (t = Er()), e = Rr(e, t), e !== null && (fl(e, t), ol(e));
    }
    function yw(e) {
      var t = e.memoizedState, a = 0;
      t !== null && (a = t.retryLane), Cp(e, a);
    }
    function bw(e, t) {
      var a = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var s = e.stateNode, u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case 19:
          s = e.stateNode;
          break;
        case 22:
          s = e.stateNode._retryCache;
          break;
        default:
          throw Error(o(314));
      }
      s !== null && s.delete(t), Cp(e, a);
    }
    function vw(e, t) {
      return nt(e, t);
    }
    var gi = null, Ta = null, od = false, pi = false, sd = false, rr = 0;
    function ol(e) {
      e !== Ta && e.next === null && (Ta === null ? gi = Ta = e : Ta = Ta.next = e), pi = true, od || (od = true, ww());
    }
    function No(e, t) {
      if (!sd && pi) {
        sd = true;
        do
          for (var a = false, s = gi; s !== null; ) {
            if (e !== 0) {
              var u = s.pendingLanes;
              if (u === 0) var h = 0;
              else {
                var w = s.suspendedLanes, M = s.pingedLanes;
                h = (1 << 31 - zt(42 | e) + 1) - 1, h &= u & ~(w & ~M), h = h & 201326741 ? h & 201326741 | 1 : h ? h | 2 : 0;
              }
              h !== 0 && (a = true, Mp(s, h));
            } else h = Ze, h = Sr(s, s === vt ? h : 0, s.cancelPendingCommit !== null || s.timeoutHandle !== -1), (h & 3) === 0 || Cr(s, h) || (a = true, Mp(s, h));
            s = s.next;
          }
        while (a);
        sd = false;
      }
    }
    function xw() {
      Ep();
    }
    function Ep() {
      pi = od = false;
      var e = 0;
      rr !== 0 && Aw() && (e = rr);
      for (var t = st(), a = null, s = gi; s !== null; ) {
        var u = s.next, h = _p(s, t);
        h === 0 ? (s.next = null, a === null ? gi = u : a.next = u, u === null && (Ta = a)) : (a = s, (e !== 0 || (h & 3) !== 0) && (pi = true)), s = u;
      }
      qt !== 0 && qt !== 5 || No(e), rr !== 0 && (rr = 0);
    }
    function _p(e, t) {
      for (var a = e.suspendedLanes, s = e.pingedLanes, u = e.expirationTimes, h = e.pendingLanes & -62914561; 0 < h; ) {
        var w = 31 - zt(h), M = 1 << w, H = u[w];
        H === -1 ? ((M & a) === 0 || (M & s) !== 0) && (u[w] = kc(M, t)) : H <= t && (e.expiredLanes |= M), h &= ~M;
      }
      if (t = vt, a = Ze, a = Sr(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), s = e.callbackNode, a === 0 || e === t && (ht === 2 || ht === 9) || e.cancelPendingCommit !== null) return s !== null && s !== null && Te(s), e.callbackNode = null, e.callbackPriority = 0;
      if ((a & 3) === 0 || Cr(e, a)) {
        if (t = a & -a, t === e.callbackPriority) return t;
        switch (s !== null && Te(s), Qa(a)) {
          case 2:
          case 8:
            a = dl;
            break;
          case 32:
            a = Rn;
            break;
          case 268435456:
            a = Rt;
            break;
          default:
            a = Rn;
        }
        return s = kp.bind(null, e), a = nt(a, s), e.callbackPriority = t, e.callbackNode = a, t;
      }
      return s !== null && s !== null && Te(s), e.callbackPriority = 2, e.callbackNode = null, 2;
    }
    function kp(e, t) {
      if (qt !== 0 && qt !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
      var a = e.callbackNode;
      if (mi() && e.callbackNode !== a) return null;
      var s = Ze;
      return s = Sr(e, e === vt ? s : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), s === 0 ? null : (sp(e, s, t), _p(e, st()), e.callbackNode != null && e.callbackNode === a ? kp.bind(null, e) : null);
    }
    function Mp(e, t) {
      if (mi()) return null;
      sp(e, t, true);
    }
    function ww() {
      Nw(function() {
        (it & 6) !== 0 ? nt(ul, xw) : Ep();
      });
    }
    function id() {
      if (rr === 0) {
        var e = ya;
        e === 0 && (e = Qr, Qr <<= 1, (Qr & 261888) === 0 && (Qr = 256)), rr = e;
      }
      return rr;
    }
    function jp(e) {
      return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Es("" + e);
    }
    function Lp(e, t) {
      var a = t.ownerDocument.createElement("input");
      return a.name = t.name, a.value = t.value, e.id && a.setAttribute("form", e.id), t.parentNode.insertBefore(a, t), e = new FormData(e), a.parentNode.removeChild(a), e;
    }
    function Sw(e, t, a, s, u) {
      if (t === "submit" && a && a.stateNode === u) {
        var h = jp((u[tn] || null).action), w = s.submitter;
        w && (t = (t = w[tn] || null) ? jp(t.formAction) : w.getAttribute("formAction"), t !== null && (h = t, w = null));
        var M = new js("action", "action", null, s, u);
        e.push({
          event: M,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (s.defaultPrevented) {
                  if (rr !== 0) {
                    var H = w ? Lp(u, w) : new FormData(u);
                    ju(a, {
                      pending: true,
                      data: H,
                      method: u.method,
                      action: h
                    }, null, H);
                  }
                } else typeof h == "function" && (M.preventDefault(), H = w ? Lp(u, w) : new FormData(u), ju(a, {
                  pending: true,
                  data: H,
                  method: u.method,
                  action: h
                }, h, H));
              },
              currentTarget: u
            }
          ]
        });
      }
    }
    for (var cd = 0; cd < qc.length; cd++) {
      var ud = qc[cd], Cw = ud.toLowerCase(), Ew = ud[0].toUpperCase() + ud.slice(1);
      Pn(Cw, "on" + Ew);
    }
    Pn(om, "onAnimationEnd"), Pn(sm, "onAnimationIteration"), Pn(im, "onAnimationStart"), Pn("dblclick", "onDoubleClick"), Pn("focusin", "onFocus"), Pn("focusout", "onBlur"), Pn(Ux, "onTransitionRun"), Pn(Bx, "onTransitionStart"), Pn(Xx, "onTransitionCancel"), Pn(cm, "onTransitionEnd"), Nt("onMouseEnter", [
      "mouseout",
      "mouseover"
    ]), Nt("onMouseLeave", [
      "mouseout",
      "mouseover"
    ]), Nt("onPointerEnter", [
      "pointerout",
      "pointerover"
    ]), Nt("onPointerLeave", [
      "pointerout",
      "pointerover"
    ]), ft("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), ft("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), ft("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]), ft("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), ft("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), ft("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var Oo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), _w = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Oo));
    function Rp(e, t) {
      t = (t & 4) !== 0;
      for (var a = 0; a < e.length; a++) {
        var s = e[a], u = s.event;
        s = s.listeners;
        e: {
          var h = void 0;
          if (t) for (var w = s.length - 1; 0 <= w; w--) {
            var M = s[w], H = M.instance, G = M.currentTarget;
            if (M = M.listener, H !== h && u.isPropagationStopped()) break e;
            h = M, u.currentTarget = G;
            try {
              h(u);
            } catch (re) {
              As(re);
            }
            u.currentTarget = null, h = H;
          }
          else for (w = 0; w < s.length; w++) {
            if (M = s[w], H = M.instance, G = M.currentTarget, M = M.listener, H !== h && u.isPropagationStopped()) break e;
            h = M, u.currentTarget = G;
            try {
              h(u);
            } catch (re) {
              As(re);
            }
            u.currentTarget = null, h = H;
          }
        }
      }
    }
    function Ge(e, t) {
      var a = t[Bl];
      a === void 0 && (a = t[Bl] = /* @__PURE__ */ new Set());
      var s = e + "__bubble";
      a.has(s) || (Ap(t, e, 2, false), a.add(s));
    }
    function dd(e, t, a) {
      var s = 0;
      t && (s |= 4), Ap(a, e, s, t);
    }
    var yi = "_reactListening" + Math.random().toString(36).slice(2);
    function fd(e) {
      if (!e[yi]) {
        e[yi] = true, Ht.forEach(function(a) {
          a !== "selectionchange" && (_w.has(a) || dd(a, false, e), dd(a, true, e));
        });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[yi] || (t[yi] = true, dd("selectionchange", false, t));
      }
    }
    function Ap(e, t, a, s) {
      switch (oy(t)) {
        case 2:
          var u = Jw;
          break;
        case 8:
          u = eS;
          break;
        default:
          u = Md;
      }
      a = u.bind(null, t, a, e), u = void 0, !Tc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = true), s ? u !== void 0 ? e.addEventListener(t, a, {
        capture: true,
        passive: u
      }) : e.addEventListener(t, a, true) : u !== void 0 ? e.addEventListener(t, a, {
        passive: u
      }) : e.addEventListener(t, a, false);
    }
    function hd(e, t, a, s, u) {
      var h = s;
      if ((t & 1) === 0 && (t & 2) === 0 && s !== null) e: for (; ; ) {
        if (s === null) return;
        var w = s.tag;
        if (w === 3 || w === 4) {
          var M = s.stateNode.containerInfo;
          if (M === u) break;
          if (w === 4) for (w = s.return; w !== null; ) {
            var H = w.tag;
            if ((H === 3 || H === 4) && w.stateNode.containerInfo === u) return;
            w = w.return;
          }
          for (; M !== null; ) {
            if (w = He(M), w === null) return;
            if (H = w.tag, H === 5 || H === 6 || H === 26 || H === 27) {
              s = h = w;
              continue e;
            }
            M = M.parentNode;
          }
        }
        s = s.return;
      }
      Dh(function() {
        var G = h, re = Rc(a), se = [];
        e: {
          var P = um.get(e);
          if (P !== void 0) {
            var F = js, _e = e;
            switch (e) {
              case "keypress":
                if (ks(a) === 0) break e;
              case "keydown":
              case "keyup":
                F = bx;
                break;
              case "focusin":
                _e = "focus", F = Dc;
                break;
              case "focusout":
                _e = "blur", F = Dc;
                break;
              case "beforeblur":
              case "afterblur":
                F = Dc;
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
                F = Yh;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                F = ox;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                F = wx;
                break;
              case om:
              case sm:
              case im:
                F = cx;
                break;
              case cm:
                F = Cx;
                break;
              case "scroll":
              case "scrollend":
                F = rx;
                break;
              case "wheel":
                F = _x;
                break;
              case "copy":
              case "cut":
              case "paste":
                F = dx;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                F = Bh;
                break;
              case "toggle":
              case "beforetoggle":
                F = Mx;
            }
            var Ae = (t & 4) !== 0, bt = !Ae && (e === "scroll" || e === "scrollend"), V = Ae ? P !== null ? P + "Capture" : null : P;
            Ae = [];
            for (var X = G, q; X !== null; ) {
              var ae = X;
              if (q = ae.stateNode, ae = ae.tag, ae !== 5 && ae !== 26 && ae !== 27 || q === null || V === null || (ae = to(X, V), ae != null && Ae.push(Io(X, ae, q))), bt) break;
              X = X.return;
            }
            0 < Ae.length && (P = new F(P, _e, null, a, re), se.push({
              event: P,
              listeners: Ae
            }));
          }
        }
        if ((t & 7) === 0) {
          e: {
            if (P = e === "mouseover" || e === "pointerover", F = e === "mouseout" || e === "pointerout", P && a !== Lc && (_e = a.relatedTarget || a.fromElement) && (He(_e) || _e[fn])) break e;
            if ((F || P) && (P = re.window === re ? re : (P = re.ownerDocument) ? P.defaultView || P.parentWindow : window, F ? (_e = a.relatedTarget || a.toElement, F = G, _e = _e ? He(_e) : null, _e !== null && (bt = c(_e), Ae = _e.tag, _e !== bt || Ae !== 5 && Ae !== 27 && Ae !== 6) && (_e = null)) : (F = null, _e = G), F !== _e)) {
              if (Ae = Yh, ae = "onMouseLeave", V = "onMouseEnter", X = "mouse", (e === "pointerout" || e === "pointerover") && (Ae = Bh, ae = "onPointerLeave", V = "onPointerEnter", X = "pointer"), bt = F == null ? P : We(F), q = _e == null ? P : We(_e), P = new Ae(ae, X + "leave", F, a, re), P.target = bt, P.relatedTarget = q, ae = null, He(re) === G && (Ae = new Ae(V, X + "enter", _e, a, re), Ae.target = q, Ae.relatedTarget = bt, ae = Ae), bt = ae, F && _e) t: {
                for (Ae = kw, V = F, X = _e, q = 0, ae = V; ae; ae = Ae(ae)) q++;
                ae = 0;
                for (var Le = X; Le; Le = Ae(Le)) ae++;
                for (; 0 < q - ae; ) V = Ae(V), q--;
                for (; 0 < ae - q; ) X = Ae(X), ae--;
                for (; q--; ) {
                  if (V === X || X !== null && V === X.alternate) {
                    Ae = V;
                    break t;
                  }
                  V = Ae(V), X = Ae(X);
                }
                Ae = null;
              }
              else Ae = null;
              F !== null && Tp(se, P, F, Ae, false), _e !== null && bt !== null && Tp(se, bt, _e, Ae, true);
            }
          }
          e: {
            if (P = G ? We(G) : window, F = P.nodeName && P.nodeName.toLowerCase(), F === "select" || F === "input" && P.type === "file") var rt = Kh;
            else if (Ph(P)) if (Fh) rt = zx;
            else {
              rt = Ix;
              var Me = Ox;
            }
            else F = P.nodeName, !F || F.toLowerCase() !== "input" || P.type !== "checkbox" && P.type !== "radio" ? G && jc(G.elementType) && (rt = Kh) : rt = Dx;
            if (rt && (rt = rt(e, G))) {
              Zh(se, rt, a, re);
              break e;
            }
            Me && Me(e, P, G), e === "focusout" && G && P.type === "number" && G.memoizedProps.value != null && la(P, "number", P.value);
          }
          switch (Me = G ? We(G) : window, e) {
            case "focusin":
              (Ph(Me) || Me.contentEditable === "true") && (ca = Me, Xc = G, co = null);
              break;
            case "focusout":
              co = Xc = ca = null;
              break;
            case "mousedown":
              Vc = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Vc = false, rm(se, a, re);
              break;
            case "selectionchange":
              if (Yx) break;
            case "keydown":
            case "keyup":
              rm(se, a, re);
          }
          var Ve;
          if (Hc) e: {
            switch (e) {
              case "compositionstart":
                var Ke = "onCompositionStart";
                break e;
              case "compositionend":
                Ke = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Ke = "onCompositionUpdate";
                break e;
            }
            Ke = void 0;
          }
          else ia ? qh(e, a) && (Ke = "onCompositionEnd") : e === "keydown" && a.keyCode === 229 && (Ke = "onCompositionStart");
          Ke && (Xh && a.locale !== "ko" && (ia || Ke !== "onCompositionStart" ? Ke === "onCompositionEnd" && ia && (Ve = zh()) : (Xl = re, Nc = "value" in Xl ? Xl.value : Xl.textContent, ia = true)), Me = bi(G, Ke), 0 < Me.length && (Ke = new Uh(Ke, e, null, a, re), se.push({
            event: Ke,
            listeners: Me
          }), Ve ? Ke.data = Ve : (Ve = Gh(a), Ve !== null && (Ke.data = Ve)))), (Ve = Lx ? Rx(e, a) : Ax(e, a)) && (Ke = bi(G, "onBeforeInput"), 0 < Ke.length && (Me = new Uh("onBeforeInput", "beforeinput", null, a, re), se.push({
            event: Me,
            listeners: Ke
          }), Me.data = Ve)), Sw(se, e, G, a, re);
        }
        Rp(se, t);
      });
    }
    function Io(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function bi(e, t) {
      for (var a = t + "Capture", s = []; e !== null; ) {
        var u = e, h = u.stateNode;
        if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || h === null || (u = to(e, a), u != null && s.unshift(Io(e, u, h)), u = to(e, t), u != null && s.push(Io(e, u, h))), e.tag === 3) return s;
        e = e.return;
      }
      return [];
    }
    function kw(e) {
      if (e === null) return null;
      do
        e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function Tp(e, t, a, s, u) {
      for (var h = t._reactName, w = []; a !== null && a !== s; ) {
        var M = a, H = M.alternate, G = M.stateNode;
        if (M = M.tag, H !== null && H === s) break;
        M !== 5 && M !== 26 && M !== 27 || G === null || (H = G, u ? (G = to(a, h), G != null && w.unshift(Io(a, G, H))) : u || (G = to(a, h), G != null && w.push(Io(a, G, H)))), a = a.return;
      }
      w.length !== 0 && e.push({
        event: t,
        listeners: w
      });
    }
    var Mw = /\r\n?/g, jw = /\u0000|\uFFFD/g;
    function Np(e) {
      return (typeof e == "string" ? e : "" + e).replace(Mw, `
`).replace(jw, "");
    }
    function Op(e, t) {
      return t = Np(t), Np(e) === t;
    }
    function yt(e, t, a, s, u, h) {
      switch (a) {
        case "children":
          typeof s == "string" ? t === "body" || t === "textarea" && s === "" || aa(e, s) : (typeof s == "number" || typeof s == "bigint") && t !== "body" && aa(e, "" + s);
          break;
        case "className":
          pl(e, "class", s);
          break;
        case "tabIndex":
          pl(e, "tabindex", s);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          pl(e, a, s);
          break;
        case "style":
          Oh(e, s, h);
          break;
        case "data":
          if (t !== "object") {
            pl(e, "data", s);
            break;
          }
        case "src":
        case "href":
          if (s === "" && (t !== "a" || a !== "href")) {
            e.removeAttribute(a);
            break;
          }
          if (s == null || typeof s == "function" || typeof s == "symbol" || typeof s == "boolean") {
            e.removeAttribute(a);
            break;
          }
          s = Es("" + s), e.setAttribute(a, s);
          break;
        case "action":
        case "formAction":
          if (typeof s == "function") {
            e.setAttribute(a, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
            break;
          } else typeof h == "function" && (a === "formAction" ? (t !== "input" && yt(e, t, "name", u.name, u, null), yt(e, t, "formEncType", u.formEncType, u, null), yt(e, t, "formMethod", u.formMethod, u, null), yt(e, t, "formTarget", u.formTarget, u, null)) : (yt(e, t, "encType", u.encType, u, null), yt(e, t, "method", u.method, u, null), yt(e, t, "target", u.target, u, null)));
          if (s == null || typeof s == "symbol" || typeof s == "boolean") {
            e.removeAttribute(a);
            break;
          }
          s = Es("" + s), e.setAttribute(a, s);
          break;
        case "onClick":
          s != null && (e.onclick = bl);
          break;
        case "onScroll":
          s != null && Ge("scroll", e);
          break;
        case "onScrollEnd":
          s != null && Ge("scrollend", e);
          break;
        case "dangerouslySetInnerHTML":
          if (s != null) {
            if (typeof s != "object" || !("__html" in s)) throw Error(o(61));
            if (a = s.__html, a != null) {
              if (u.children != null) throw Error(o(60));
              e.innerHTML = a;
            }
          }
          break;
        case "multiple":
          e.multiple = s && typeof s != "function" && typeof s != "symbol";
          break;
        case "muted":
          e.muted = s && typeof s != "function" && typeof s != "symbol";
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
          if (s == null || typeof s == "function" || typeof s == "boolean" || typeof s == "symbol") {
            e.removeAttribute("xlink:href");
            break;
          }
          a = Es("" + s), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a);
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          s != null && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(a, "" + s) : e.removeAttribute(a);
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
          s && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(a, "") : e.removeAttribute(a);
          break;
        case "capture":
        case "download":
          s === true ? e.setAttribute(a, "") : s !== false && s != null && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(a, s) : e.removeAttribute(a);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          s != null && typeof s != "function" && typeof s != "symbol" && !isNaN(s) && 1 <= s ? e.setAttribute(a, s) : e.removeAttribute(a);
          break;
        case "rowSpan":
        case "start":
          s == null || typeof s == "function" || typeof s == "symbol" || isNaN(s) ? e.removeAttribute(a) : e.setAttribute(a, s);
          break;
        case "popover":
          Ge("beforetoggle", e), Ge("toggle", e), gl(e, "popover", s);
          break;
        case "xlinkActuate":
          nn(e, "http://www.w3.org/1999/xlink", "xlink:actuate", s);
          break;
        case "xlinkArcrole":
          nn(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", s);
          break;
        case "xlinkRole":
          nn(e, "http://www.w3.org/1999/xlink", "xlink:role", s);
          break;
        case "xlinkShow":
          nn(e, "http://www.w3.org/1999/xlink", "xlink:show", s);
          break;
        case "xlinkTitle":
          nn(e, "http://www.w3.org/1999/xlink", "xlink:title", s);
          break;
        case "xlinkType":
          nn(e, "http://www.w3.org/1999/xlink", "xlink:type", s);
          break;
        case "xmlBase":
          nn(e, "http://www.w3.org/XML/1998/namespace", "xml:base", s);
          break;
        case "xmlLang":
          nn(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", s);
          break;
        case "xmlSpace":
          nn(e, "http://www.w3.org/XML/1998/namespace", "xml:space", s);
          break;
        case "is":
          gl(e, "is", s);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = nx.get(a) || a, gl(e, a, s));
      }
    }
    function md(e, t, a, s, u, h) {
      switch (a) {
        case "style":
          Oh(e, s, h);
          break;
        case "dangerouslySetInnerHTML":
          if (s != null) {
            if (typeof s != "object" || !("__html" in s)) throw Error(o(61));
            if (a = s.__html, a != null) {
              if (u.children != null) throw Error(o(60));
              e.innerHTML = a;
            }
          }
          break;
        case "children":
          typeof s == "string" ? aa(e, s) : (typeof s == "number" || typeof s == "bigint") && aa(e, "" + s);
          break;
        case "onScroll":
          s != null && Ge("scroll", e);
          break;
        case "onScrollEnd":
          s != null && Ge("scrollend", e);
          break;
        case "onClick":
          s != null && (e.onclick = bl);
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
          if (!Ct.hasOwnProperty(a)) e: {
            if (a[0] === "o" && a[1] === "n" && (u = a.endsWith("Capture"), t = a.slice(2, u ? a.length - 7 : void 0), h = e[tn] || null, h = h != null ? h[a] : null, typeof h == "function" && e.removeEventListener(t, h, u), typeof s == "function")) {
              typeof h != "function" && h !== null && (a in e ? e[a] = null : e.hasAttribute(a) && e.removeAttribute(a)), e.addEventListener(t, s, u);
              break e;
            }
            a in e ? e[a] = s : s === true ? e.setAttribute(a, "") : gl(e, a, s);
          }
      }
    }
    function en(e, t, a) {
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
          Ge("error", e), Ge("load", e);
          var s = false, u = false, h;
          for (h in a) if (a.hasOwnProperty(h)) {
            var w = a[h];
            if (w != null) switch (h) {
              case "src":
                s = true;
                break;
              case "srcSet":
                u = true;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                yt(e, t, h, w, a, null);
            }
          }
          u && yt(e, t, "srcSet", a.srcSet, a, null), s && yt(e, t, "src", a.src, a, null);
          return;
        case "input":
          Ge("invalid", e);
          var M = h = w = u = null, H = null, G = null;
          for (s in a) if (a.hasOwnProperty(s)) {
            var re = a[s];
            if (re != null) switch (s) {
              case "name":
                u = re;
                break;
              case "type":
                w = re;
                break;
              case "checked":
                H = re;
                break;
              case "defaultChecked":
                G = re;
                break;
              case "value":
                h = re;
                break;
              case "defaultValue":
                M = re;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (re != null) throw Error(o(137, t));
                break;
              default:
                yt(e, t, s, re, a, null);
            }
          }
          eo(e, h, M, H, G, w, u, false);
          return;
        case "select":
          Ge("invalid", e), s = w = h = null;
          for (u in a) if (a.hasOwnProperty(u) && (M = a[u], M != null)) switch (u) {
            case "value":
              h = M;
              break;
            case "defaultValue":
              w = M;
              break;
            case "multiple":
              s = M;
            default:
              yt(e, t, u, M, a, null);
          }
          t = h, a = w, e.multiple = !!s, t != null ? ra(e, !!s, t, false) : a != null && ra(e, !!s, a, true);
          return;
        case "textarea":
          Ge("invalid", e), h = u = s = null;
          for (w in a) if (a.hasOwnProperty(w) && (M = a[w], M != null)) switch (w) {
            case "value":
              s = M;
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
              yt(e, t, w, M, a, null);
          }
          Th(e, s, u, h);
          return;
        case "option":
          for (H in a) if (a.hasOwnProperty(H) && (s = a[H], s != null)) switch (H) {
            case "selected":
              e.selected = s && typeof s != "function" && typeof s != "symbol";
              break;
            default:
              yt(e, t, H, s, a, null);
          }
          return;
        case "dialog":
          Ge("beforetoggle", e), Ge("toggle", e), Ge("cancel", e), Ge("close", e);
          break;
        case "iframe":
        case "object":
          Ge("load", e);
          break;
        case "video":
        case "audio":
          for (s = 0; s < Oo.length; s++) Ge(Oo[s], e);
          break;
        case "image":
          Ge("error", e), Ge("load", e);
          break;
        case "details":
          Ge("toggle", e);
          break;
        case "embed":
        case "source":
        case "link":
          Ge("error", e), Ge("load", e);
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
          for (G in a) if (a.hasOwnProperty(G) && (s = a[G], s != null)) switch (G) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(o(137, t));
            default:
              yt(e, t, G, s, a, null);
          }
          return;
        default:
          if (jc(t)) {
            for (re in a) a.hasOwnProperty(re) && (s = a[re], s !== void 0 && md(e, t, re, s, a, void 0));
            return;
          }
      }
      for (M in a) a.hasOwnProperty(M) && (s = a[M], s != null && yt(e, t, M, s, a, null));
    }
    function Lw(e, t, a, s) {
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
          var u = null, h = null, w = null, M = null, H = null, G = null, re = null;
          for (F in a) {
            var se = a[F];
            if (a.hasOwnProperty(F) && se != null) switch (F) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                H = se;
              default:
                s.hasOwnProperty(F) || yt(e, t, F, null, s, se);
            }
          }
          for (var P in s) {
            var F = s[P];
            if (se = a[P], s.hasOwnProperty(P) && (F != null || se != null)) switch (P) {
              case "type":
                h = F;
                break;
              case "name":
                u = F;
                break;
              case "checked":
                G = F;
                break;
              case "defaultChecked":
                re = F;
                break;
              case "value":
                w = F;
                break;
              case "defaultValue":
                M = F;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (F != null) throw Error(o(137, t));
                break;
              default:
                F !== se && yt(e, t, P, F, s, se);
            }
          }
          Ja(e, w, M, H, G, re, h, u);
          return;
        case "select":
          F = w = M = P = null;
          for (h in a) if (H = a[h], a.hasOwnProperty(h) && H != null) switch (h) {
            case "value":
              break;
            case "multiple":
              F = H;
            default:
              s.hasOwnProperty(h) || yt(e, t, h, null, s, H);
          }
          for (u in s) if (h = s[u], H = a[u], s.hasOwnProperty(u) && (h != null || H != null)) switch (u) {
            case "value":
              P = h;
              break;
            case "defaultValue":
              M = h;
              break;
            case "multiple":
              w = h;
            default:
              h !== H && yt(e, t, u, h, s, H);
          }
          t = M, a = w, s = F, P != null ? ra(e, !!a, P, false) : !!s != !!a && (t != null ? ra(e, !!a, t, true) : ra(e, !!a, a ? [] : "", false));
          return;
        case "textarea":
          F = P = null;
          for (M in a) if (u = a[M], a.hasOwnProperty(M) && u != null && !s.hasOwnProperty(M)) switch (M) {
            case "value":
              break;
            case "children":
              break;
            default:
              yt(e, t, M, null, s, u);
          }
          for (w in s) if (u = s[w], h = a[w], s.hasOwnProperty(w) && (u != null || h != null)) switch (w) {
            case "value":
              P = u;
              break;
            case "defaultValue":
              F = u;
              break;
            case "children":
              break;
            case "dangerouslySetInnerHTML":
              if (u != null) throw Error(o(91));
              break;
            default:
              u !== h && yt(e, t, w, u, s, h);
          }
          Ah(e, P, F);
          return;
        case "option":
          for (var _e in a) if (P = a[_e], a.hasOwnProperty(_e) && P != null && !s.hasOwnProperty(_e)) switch (_e) {
            case "selected":
              e.selected = false;
              break;
            default:
              yt(e, t, _e, null, s, P);
          }
          for (H in s) if (P = s[H], F = a[H], s.hasOwnProperty(H) && P !== F && (P != null || F != null)) switch (H) {
            case "selected":
              e.selected = P && typeof P != "function" && typeof P != "symbol";
              break;
            default:
              yt(e, t, H, P, s, F);
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
          for (var Ae in a) P = a[Ae], a.hasOwnProperty(Ae) && P != null && !s.hasOwnProperty(Ae) && yt(e, t, Ae, null, s, P);
          for (G in s) if (P = s[G], F = a[G], s.hasOwnProperty(G) && P !== F && (P != null || F != null)) switch (G) {
            case "children":
            case "dangerouslySetInnerHTML":
              if (P != null) throw Error(o(137, t));
              break;
            default:
              yt(e, t, G, P, s, F);
          }
          return;
        default:
          if (jc(t)) {
            for (var bt in a) P = a[bt], a.hasOwnProperty(bt) && P !== void 0 && !s.hasOwnProperty(bt) && md(e, t, bt, void 0, s, P);
            for (re in s) P = s[re], F = a[re], !s.hasOwnProperty(re) || P === F || P === void 0 && F === void 0 || md(e, t, re, P, s, F);
            return;
          }
      }
      for (var V in a) P = a[V], a.hasOwnProperty(V) && P != null && !s.hasOwnProperty(V) && yt(e, t, V, null, s, P);
      for (se in s) P = s[se], F = a[se], !s.hasOwnProperty(se) || P === F || P == null && F == null || yt(e, t, se, P, s, F);
    }
    function Ip(e) {
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
    function Rw() {
      if (typeof performance.getEntriesByType == "function") {
        for (var e = 0, t = 0, a = performance.getEntriesByType("resource"), s = 0; s < a.length; s++) {
          var u = a[s], h = u.transferSize, w = u.initiatorType, M = u.duration;
          if (h && M && Ip(w)) {
            for (w = 0, M = u.responseEnd, s += 1; s < a.length; s++) {
              var H = a[s], G = H.startTime;
              if (G > M) break;
              var re = H.transferSize, se = H.initiatorType;
              re && Ip(se) && (H = H.responseEnd, w += re * (H < M ? 1 : (M - G) / (H - G)));
            }
            if (--s, t += 8 * (h + w) / (u.duration / 1e3), e++, 10 < e) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
    }
    var gd = null, pd = null;
    function vi(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Dp(e) {
      switch (e) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function zp(e, t) {
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
    function yd(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    var bd = null;
    function Aw() {
      var e = window.event;
      return e && e.type === "popstate" ? e === bd ? false : (bd = e, true) : (bd = null, false);
    }
    var Hp = typeof setTimeout == "function" ? setTimeout : void 0, Tw = typeof clearTimeout == "function" ? clearTimeout : void 0, Yp = typeof Promise == "function" ? Promise : void 0, Nw = typeof queueMicrotask == "function" ? queueMicrotask : typeof Yp < "u" ? function(e) {
      return Yp.resolve(null).then(e).catch(Ow);
    } : Hp;
    function Ow(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function ar(e) {
      return e === "head";
    }
    function Up(e, t) {
      var a = t, s = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === 8) if (a = u.data, a === "/$" || a === "/&") {
          if (s === 0) {
            e.removeChild(u), Da(t);
            return;
          }
          s--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&") s++;
        else if (a === "html") Do(e.ownerDocument.documentElement);
        else if (a === "head") {
          a = e.ownerDocument.head, Do(a);
          for (var h = a.firstChild; h; ) {
            var w = h.nextSibling, M = h.nodeName;
            h[Oe] || M === "SCRIPT" || M === "STYLE" || M === "LINK" && h.rel.toLowerCase() === "stylesheet" || a.removeChild(h), h = w;
          }
        } else a === "body" && Do(e.ownerDocument.body);
        a = u;
      } while (a);
      Da(t);
    }
    function Bp(e, t) {
      var a = e;
      e = 0;
      do {
        var s = a.nextSibling;
        if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), s && s.nodeType === 8) if (a = s.data, a === "/$") {
          if (e === 0) break;
          e--;
        } else a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || e++;
        a = s;
      } while (a);
    }
    function vd(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var a = t;
        switch (t = t.nextSibling, a.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            vd(a), ut(a);
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
    function Iw(e, t, a, s) {
      for (; e.nodeType === 1; ) {
        var u = a;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!s && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
        } else if (s) {
          if (!e[Oe]) switch (t) {
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
        if (e = Hn(e.nextSibling), e === null) break;
      }
      return null;
    }
    function Dw(e, t, a) {
      if (t === "") return null;
      for (; e.nodeType !== 3; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = Hn(e.nextSibling), e === null)) return null;
      return e;
    }
    function Xp(e, t) {
      for (; e.nodeType !== 8; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Hn(e.nextSibling), e === null)) return null;
      return e;
    }
    function xd(e) {
      return e.data === "$?" || e.data === "$~";
    }
    function wd(e) {
      return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
    }
    function zw(e, t) {
      var a = e.ownerDocument;
      if (e.data === "$~") e._reactRetry = t;
      else if (e.data !== "$?" || a.readyState !== "loading") t();
      else {
        var s = function() {
          t(), a.removeEventListener("DOMContentLoaded", s);
        };
        a.addEventListener("DOMContentLoaded", s), e._reactRetry = s;
      }
    }
    function Hn(e) {
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
    var Sd = null;
    function Vp(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var a = e.data;
          if (a === "/$" || a === "/&") {
            if (t === 0) return Hn(e.nextSibling);
            t--;
          } else a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function $p(e) {
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
    function qp(e, t, a) {
      switch (t = vi(a), e) {
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
    function Do(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      ut(e);
    }
    var Yn = /* @__PURE__ */ new Map(), Gp = /* @__PURE__ */ new Set();
    function xi(e) {
      return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
    }
    var Ol = K.d;
    K.d = {
      f: Hw,
      r: Yw,
      D: Uw,
      C: Bw,
      L: Xw,
      m: Vw,
      X: qw,
      S: $w,
      M: Gw
    };
    function Hw() {
      var e = Ol.f(), t = di();
      return e || t;
    }
    function Yw(e) {
      var t = Je(e);
      t !== null && t.tag === 5 && t.type === "form" ? cg(t) : Ol.r(e);
    }
    var Na = typeof document > "u" ? null : document;
    function Pp(e, t, a) {
      var s = Na;
      if (s && typeof t == "string" && t) {
        var u = mn(t);
        u = 'link[rel="' + e + '"][href="' + u + '"]', typeof a == "string" && (u += '[crossorigin="' + a + '"]'), Gp.has(u) || (Gp.add(u), e = {
          rel: e,
          crossOrigin: a,
          href: t
        }, s.querySelector(u) === null && (t = s.createElement("link"), en(t, "link", e), Ne(t), s.head.appendChild(t)));
      }
    }
    function Uw(e) {
      Ol.D(e), Pp("dns-prefetch", e, null);
    }
    function Bw(e, t) {
      Ol.C(e, t), Pp("preconnect", e, t);
    }
    function Xw(e, t, a) {
      Ol.L(e, t, a);
      var s = Na;
      if (s && e && t) {
        var u = 'link[rel="preload"][as="' + mn(t) + '"]';
        t === "image" && a && a.imageSrcSet ? (u += '[imagesrcset="' + mn(a.imageSrcSet) + '"]', typeof a.imageSizes == "string" && (u += '[imagesizes="' + mn(a.imageSizes) + '"]')) : u += '[href="' + mn(e) + '"]';
        var h = u;
        switch (t) {
          case "style":
            h = Oa(e);
            break;
          case "script":
            h = Ia(e);
        }
        Yn.has(h) || (e = x({
          rel: "preload",
          href: t === "image" && a && a.imageSrcSet ? void 0 : e,
          as: t
        }, a), Yn.set(h, e), s.querySelector(u) !== null || t === "style" && s.querySelector(zo(h)) || t === "script" && s.querySelector(Ho(h)) || (t = s.createElement("link"), en(t, "link", e), Ne(t), s.head.appendChild(t)));
      }
    }
    function Vw(e, t) {
      Ol.m(e, t);
      var a = Na;
      if (a && e) {
        var s = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + mn(s) + '"][href="' + mn(e) + '"]', h = u;
        switch (s) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            h = Ia(e);
        }
        if (!Yn.has(h) && (e = x({
          rel: "modulepreload",
          href: e
        }, t), Yn.set(h, e), a.querySelector(u) === null)) {
          switch (s) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (a.querySelector(Ho(h))) return;
          }
          s = a.createElement("link"), en(s, "link", e), Ne(s), a.head.appendChild(s);
        }
      }
    }
    function $w(e, t, a) {
      Ol.S(e, t, a);
      var s = Na;
      if (s && e) {
        var u = et(s).hoistableStyles, h = Oa(e);
        t = t || "default";
        var w = u.get(h);
        if (!w) {
          var M = {
            loading: 0,
            preload: null
          };
          if (w = s.querySelector(zo(h))) M.loading = 5;
          else {
            e = x({
              rel: "stylesheet",
              href: e,
              "data-precedence": t
            }, a), (a = Yn.get(h)) && Cd(e, a);
            var H = w = s.createElement("link");
            Ne(H), en(H, "link", e), H._p = new Promise(function(G, re) {
              H.onload = G, H.onerror = re;
            }), H.addEventListener("load", function() {
              M.loading |= 1;
            }), H.addEventListener("error", function() {
              M.loading |= 2;
            }), M.loading |= 4, wi(w, t, s);
          }
          w = {
            type: "stylesheet",
            instance: w,
            count: 1,
            state: M
          }, u.set(h, w);
        }
      }
    }
    function qw(e, t) {
      Ol.X(e, t);
      var a = Na;
      if (a && e) {
        var s = et(a).hoistableScripts, u = Ia(e), h = s.get(u);
        h || (h = a.querySelector(Ho(u)), h || (e = x({
          src: e,
          async: true
        }, t), (t = Yn.get(u)) && Ed(e, t), h = a.createElement("script"), Ne(h), en(h, "link", e), a.head.appendChild(h)), h = {
          type: "script",
          instance: h,
          count: 1,
          state: null
        }, s.set(u, h));
      }
    }
    function Gw(e, t) {
      Ol.M(e, t);
      var a = Na;
      if (a && e) {
        var s = et(a).hoistableScripts, u = Ia(e), h = s.get(u);
        h || (h = a.querySelector(Ho(u)), h || (e = x({
          src: e,
          async: true,
          type: "module"
        }, t), (t = Yn.get(u)) && Ed(e, t), h = a.createElement("script"), Ne(h), en(h, "link", e), a.head.appendChild(h)), h = {
          type: "script",
          instance: h,
          count: 1,
          state: null
        }, s.set(u, h));
      }
    }
    function Zp(e, t, a, s) {
      var u = (u = ce.current) ? xi(u) : null;
      if (!u) throw Error(o(446));
      switch (e) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof a.precedence == "string" && typeof a.href == "string" ? (t = Oa(a.href), a = et(u).hoistableStyles, s = a.get(t), s || (s = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, a.set(t, s)), s) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        case "link":
          if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
            e = Oa(a.href);
            var h = et(u).hoistableStyles, w = h.get(e);
            if (w || (u = u.ownerDocument || u, w = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: {
                loading: 0,
                preload: null
              }
            }, h.set(e, w), (h = u.querySelector(zo(e))) && !h._p && (w.instance = h, w.state.loading = 5), Yn.has(e) || (a = {
              rel: "preload",
              as: "style",
              href: a.href,
              crossOrigin: a.crossOrigin,
              integrity: a.integrity,
              media: a.media,
              hrefLang: a.hrefLang,
              referrerPolicy: a.referrerPolicy
            }, Yn.set(e, a), h || Pw(u, e, a, w.state))), t && s === null) throw Error(o(528, ""));
            return w;
          }
          if (t && s !== null) throw Error(o(529, ""));
          return null;
        case "script":
          return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ia(a), a = et(u).hoistableScripts, s = a.get(t), s || (s = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, a.set(t, s)), s) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        default:
          throw Error(o(444, e));
      }
    }
    function Oa(e) {
      return 'href="' + mn(e) + '"';
    }
    function zo(e) {
      return 'link[rel="stylesheet"][' + e + "]";
    }
    function Kp(e) {
      return x({}, e, {
        "data-precedence": e.precedence,
        precedence: null
      });
    }
    function Pw(e, t, a, s) {
      e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? s.loading = 1 : (t = e.createElement("link"), s.preload = t, t.addEventListener("load", function() {
        return s.loading |= 1;
      }), t.addEventListener("error", function() {
        return s.loading |= 2;
      }), en(t, "link", a), Ne(t), e.head.appendChild(t));
    }
    function Ia(e) {
      return '[src="' + mn(e) + '"]';
    }
    function Ho(e) {
      return "script[async]" + e;
    }
    function Fp(e, t, a) {
      if (t.count++, t.instance === null) switch (t.type) {
        case "style":
          var s = e.querySelector('style[data-href~="' + mn(a.href) + '"]');
          if (s) return t.instance = s, Ne(s), s;
          var u = x({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return s = (e.ownerDocument || e).createElement("style"), Ne(s), en(s, "style", u), wi(s, a.precedence, e), t.instance = s;
        case "stylesheet":
          u = Oa(a.href);
          var h = e.querySelector(zo(u));
          if (h) return t.state.loading |= 4, t.instance = h, Ne(h), h;
          s = Kp(a), (u = Yn.get(u)) && Cd(s, u), h = (e.ownerDocument || e).createElement("link"), Ne(h);
          var w = h;
          return w._p = new Promise(function(M, H) {
            w.onload = M, w.onerror = H;
          }), en(h, "link", s), t.state.loading |= 4, wi(h, a.precedence, e), t.instance = h;
        case "script":
          return h = Ia(a.src), (u = e.querySelector(Ho(h))) ? (t.instance = u, Ne(u), u) : (s = a, (u = Yn.get(h)) && (s = x({}, a), Ed(s, u)), e = e.ownerDocument || e, u = e.createElement("script"), Ne(u), en(u, "link", s), e.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
      else t.type === "stylesheet" && (t.state.loading & 4) === 0 && (s = t.instance, t.state.loading |= 4, wi(s, a.precedence, e));
      return t.instance;
    }
    function wi(e, t, a) {
      for (var s = a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), u = s.length ? s[s.length - 1] : null, h = u, w = 0; w < s.length; w++) {
        var M = s[w];
        if (M.dataset.precedence === t) h = M;
        else if (h !== u) break;
      }
      h ? h.parentNode.insertBefore(e, h.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(e, t.firstChild));
    }
    function Cd(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
    }
    function Ed(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
    }
    var Si = null;
    function Qp(e, t, a) {
      if (Si === null) {
        var s = /* @__PURE__ */ new Map(), u = Si = /* @__PURE__ */ new Map();
        u.set(a, s);
      } else u = Si, s = u.get(a), s || (s = /* @__PURE__ */ new Map(), u.set(a, s));
      if (s.has(e)) return s;
      for (s.set(e, null), a = a.getElementsByTagName(e), u = 0; u < a.length; u++) {
        var h = a[u];
        if (!(h[Oe] || h[jt] || e === "link" && h.getAttribute("rel") === "stylesheet") && h.namespaceURI !== "http://www.w3.org/2000/svg") {
          var w = h.getAttribute(t) || "";
          w = e + w;
          var M = s.get(w);
          M ? M.push(h) : s.set(w, [
            h
          ]);
        }
      }
      return s;
    }
    function Wp(e, t, a) {
      e = e.ownerDocument || e, e.head.insertBefore(a, t === "title" ? e.querySelector("head > title") : null);
    }
    function Zw(e, t, a) {
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
    function Jp(e) {
      return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
    }
    function Kw(e, t, a, s) {
      if (a.type === "stylesheet" && (typeof s.media != "string" || matchMedia(s.media).matches !== false) && (a.state.loading & 4) === 0) {
        if (a.instance === null) {
          var u = Oa(s.href), h = t.querySelector(zo(u));
          if (h) {
            t = h._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Ci.bind(e), t.then(e, e)), a.state.loading |= 4, a.instance = h, Ne(h);
            return;
          }
          h = t.ownerDocument || t, s = Kp(s), (u = Yn.get(u)) && Cd(s, u), h = h.createElement("link"), Ne(h);
          var w = h;
          w._p = new Promise(function(M, H) {
            w.onload = M, w.onerror = H;
          }), en(h, "link", s), a.instance = h;
        }
        e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (e.count++, a = Ci.bind(e), t.addEventListener("load", a), t.addEventListener("error", a));
      }
    }
    var _d = 0;
    function Fw(e, t) {
      return e.stylesheets && e.count === 0 && _i(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(a) {
        var s = setTimeout(function() {
          if (e.stylesheets && _i(e, e.stylesheets), e.unsuspend) {
            var h = e.unsuspend;
            e.unsuspend = null, h();
          }
        }, 6e4 + t);
        0 < e.imgBytes && _d === 0 && (_d = 62500 * Rw());
        var u = setTimeout(function() {
          if (e.waitingForImages = false, e.count === 0 && (e.stylesheets && _i(e, e.stylesheets), e.unsuspend)) {
            var h = e.unsuspend;
            e.unsuspend = null, h();
          }
        }, (e.imgBytes > _d ? 50 : 800) + t);
        return e.unsuspend = a, function() {
          e.unsuspend = null, clearTimeout(s), clearTimeout(u);
        };
      } : null;
    }
    function Ci() {
      if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
        if (this.stylesheets) _i(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          this.unsuspend = null, e();
        }
      }
    }
    var Ei = null;
    function _i(e, t) {
      e.stylesheets = null, e.unsuspend !== null && (e.count++, Ei = /* @__PURE__ */ new Map(), t.forEach(Qw, e), Ei = null, Ci.call(e));
    }
    function Qw(e, t) {
      if (!(t.state.loading & 4)) {
        var a = Ei.get(e);
        if (a) var s = a.get(null);
        else {
          a = /* @__PURE__ */ new Map(), Ei.set(e, a);
          for (var u = e.querySelectorAll("link[data-precedence],style[data-precedence]"), h = 0; h < u.length; h++) {
            var w = u[h];
            (w.nodeName === "LINK" || w.getAttribute("media") !== "not all") && (a.set(w.dataset.precedence, w), s = w);
          }
          s && a.set(null, s);
        }
        u = t.instance, w = u.getAttribute("data-precedence"), h = a.get(w) || s, h === s && a.set(null, u), a.set(w, u), this.count++, s = Ci.bind(this), u.addEventListener("load", s), u.addEventListener("error", s), h ? h.parentNode.insertBefore(u, h.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(u, e.firstChild)), t.state.loading |= 4;
      }
    }
    var Yo = {
      $$typeof: R,
      Provider: null,
      Consumer: null,
      _currentValue: me,
      _currentValue2: me,
      _threadCount: 0
    };
    function Ww(e, t, a, s, u, h, w, M, H) {
      this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = _r(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = _r(0), this.hiddenUpdates = _r(null), this.identifierPrefix = s, this.onUncaughtError = u, this.onCaughtError = h, this.onRecoverableError = w, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = H, this.incompleteTransitions = /* @__PURE__ */ new Map();
    }
    function ey(e, t, a, s, u, h, w, M, H, G, re, se) {
      return e = new Ww(e, t, a, w, H, G, re, se, M), t = 1, h === true && (t |= 24), h = Sn(3, null, null, t), e.current = h, h.stateNode = e, t = ru(), t.refCount++, e.pooledCache = t, t.refCount++, h.memoizedState = {
        element: s,
        isDehydrated: a,
        cache: t
      }, iu(h), e;
    }
    function ty(e) {
      return e ? (e = fa, e) : fa;
    }
    function ny(e, t, a, s, u, h) {
      u = ty(u), s.context === null ? s.context = u : s.pendingContext = u, s = Zl(t), s.payload = {
        element: a
      }, h = h === void 0 ? null : h, h !== null && (s.callback = h), a = Kl(e, s, t), a !== null && (xn(a, e, t), yo(a, e, t));
    }
    function ly(e, t) {
      if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
        var a = e.retryLane;
        e.retryLane = a !== 0 && a < t ? a : t;
      }
    }
    function kd(e, t) {
      ly(e, t), (e = e.alternate) && ly(e, t);
    }
    function ry(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Rr(e, 67108864);
        t !== null && xn(t, e, 67108864), kd(e, 67108864);
      }
    }
    function ay(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Mn();
        t = An(t);
        var a = Rr(e, t);
        a !== null && xn(a, e, t), kd(e, t);
      }
    }
    var ki = true;
    function Jw(e, t, a, s) {
      var u = $.T;
      $.T = null;
      var h = K.p;
      try {
        K.p = 2, Md(e, t, a, s);
      } finally {
        K.p = h, $.T = u;
      }
    }
    function eS(e, t, a, s) {
      var u = $.T;
      $.T = null;
      var h = K.p;
      try {
        K.p = 8, Md(e, t, a, s);
      } finally {
        K.p = h, $.T = u;
      }
    }
    function Md(e, t, a, s) {
      if (ki) {
        var u = jd(s);
        if (u === null) hd(e, t, s, Mi, a), sy(e, s);
        else if (nS(u, e, t, a, s)) s.stopPropagation();
        else if (sy(e, s), t & 4 && -1 < tS.indexOf(e)) {
          for (; u !== null; ) {
            var h = Je(u);
            if (h !== null) switch (h.tag) {
              case 3:
                if (h = h.stateNode, h.current.memoizedState.isDehydrated) {
                  var w = el(h.pendingLanes);
                  if (w !== 0) {
                    var M = h;
                    for (M.pendingLanes |= 2, M.entangledLanes |= 2; w; ) {
                      var H = 1 << 31 - zt(w);
                      M.entanglements[1] |= H, w &= ~H;
                    }
                    ol(h), (it & 6) === 0 && (ci = st() + 500, No(0));
                  }
                }
                break;
              case 31:
              case 13:
                M = Rr(h, 2), M !== null && xn(M, h, 2), di(), kd(h, 2);
            }
            if (h = jd(s), h === null && hd(e, t, s, Mi, a), h === u) break;
            u = h;
          }
          u !== null && s.stopPropagation();
        } else hd(e, t, s, null, a);
      }
    }
    function jd(e) {
      return e = Rc(e), Ld(e);
    }
    var Mi = null;
    function Ld(e) {
      if (Mi = null, e = He(e), e !== null) {
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
      return Mi = e, null;
    }
    function oy(e) {
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
          switch (sn()) {
            case ul:
              return 2;
            case dl:
              return 8;
            case Rn:
            case ct:
              return 32;
            case Rt:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Rd = false, or = null, sr = null, ir = null, Uo = /* @__PURE__ */ new Map(), Bo = /* @__PURE__ */ new Map(), cr = [], tS = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function sy(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          or = null;
          break;
        case "dragenter":
        case "dragleave":
          sr = null;
          break;
        case "mouseover":
        case "mouseout":
          ir = null;
          break;
        case "pointerover":
        case "pointerout":
          Uo.delete(t.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Bo.delete(t.pointerId);
      }
    }
    function Xo(e, t, a, s, u, h) {
      return e === null || e.nativeEvent !== h ? (e = {
        blockedOn: t,
        domEventName: a,
        eventSystemFlags: s,
        nativeEvent: h,
        targetContainers: [
          u
        ]
      }, t !== null && (t = Je(t), t !== null && ry(t)), e) : (e.eventSystemFlags |= s, t = e.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), e);
    }
    function nS(e, t, a, s, u) {
      switch (t) {
        case "focusin":
          return or = Xo(or, e, t, a, s, u), true;
        case "dragenter":
          return sr = Xo(sr, e, t, a, s, u), true;
        case "mouseover":
          return ir = Xo(ir, e, t, a, s, u), true;
        case "pointerover":
          var h = u.pointerId;
          return Uo.set(h, Xo(Uo.get(h) || null, e, t, a, s, u)), true;
        case "gotpointercapture":
          return h = u.pointerId, Bo.set(h, Xo(Bo.get(h) || null, e, t, a, s, u)), true;
      }
      return false;
    }
    function iy(e) {
      var t = He(e.target);
      if (t !== null) {
        var a = c(t);
        if (a !== null) {
          if (t = a.tag, t === 13) {
            if (t = d(a), t !== null) {
              e.blockedOn = t, Ss(e.priority, function() {
                ay(a);
              });
              return;
            }
          } else if (t === 31) {
            if (t = f(a), t !== null) {
              e.blockedOn = t, Ss(e.priority, function() {
                ay(a);
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
    function ji(e) {
      if (e.blockedOn !== null) return false;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var a = jd(e.nativeEvent);
        if (a === null) {
          a = e.nativeEvent;
          var s = new a.constructor(a.type, a);
          Lc = s, a.target.dispatchEvent(s), Lc = null;
        } else return t = Je(a), t !== null && ry(t), e.blockedOn = a, false;
        t.shift();
      }
      return true;
    }
    function cy(e, t, a) {
      ji(e) && a.delete(t);
    }
    function lS() {
      Rd = false, or !== null && ji(or) && (or = null), sr !== null && ji(sr) && (sr = null), ir !== null && ji(ir) && (ir = null), Uo.forEach(cy), Bo.forEach(cy);
    }
    function Li(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Rd || (Rd = true, l.unstable_scheduleCallback(l.unstable_NormalPriority, lS)));
    }
    var Ri = null;
    function uy(e) {
      Ri !== e && (Ri = e, l.unstable_scheduleCallback(l.unstable_NormalPriority, function() {
        Ri === e && (Ri = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t], s = e[t + 1], u = e[t + 2];
          if (typeof s != "function") {
            if (Ld(s || a) === null) continue;
            break;
          }
          var h = Je(a);
          h !== null && (e.splice(t, 3), t -= 3, ju(h, {
            pending: true,
            data: u,
            method: a.method,
            action: s
          }, s, u));
        }
      }));
    }
    function Da(e) {
      function t(H) {
        return Li(H, e);
      }
      or !== null && Li(or, e), sr !== null && Li(sr, e), ir !== null && Li(ir, e), Uo.forEach(t), Bo.forEach(t);
      for (var a = 0; a < cr.length; a++) {
        var s = cr[a];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; 0 < cr.length && (a = cr[0], a.blockedOn === null); ) iy(a), a.blockedOn === null && cr.shift();
      if (a = (e.ownerDocument || e).$$reactFormReplay, a != null) for (s = 0; s < a.length; s += 3) {
        var u = a[s], h = a[s + 1], w = u[tn] || null;
        if (typeof h == "function") w || uy(a);
        else if (w) {
          var M = null;
          if (h && h.hasAttribute("formAction")) {
            if (u = h, w = h[tn] || null) M = w.formAction;
            else if (Ld(u) !== null) continue;
          } else M = w.action;
          typeof M == "function" ? a[s + 1] = M : (a.splice(s, 3), s -= 3), uy(a);
        }
      }
    }
    function dy() {
      function e(h) {
        h.canIntercept && h.info === "react-transition" && h.intercept({
          handler: function() {
            return new Promise(function(w) {
              return u = w;
            });
          },
          focusReset: "manual",
          scroll: "manual"
        });
      }
      function t() {
        u !== null && (u(), u = null), s || setTimeout(a, 20);
      }
      function a() {
        if (!s && !navigation.transition) {
          var h = navigation.currentEntry;
          h && h.url != null && navigation.navigate(h.url, {
            state: h.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if (typeof navigation == "object") {
        var s = false, u = null;
        return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
          s = true, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), u !== null && (u(), u = null);
        };
      }
    }
    function Ad(e) {
      this._internalRoot = e;
    }
    Ai.prototype.render = Ad.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null) throw Error(o(409));
      var a = t.current, s = Mn();
      ny(a, s, e, t, null, null);
    }, Ai.prototype.unmount = Ad.prototype.unmount = function() {
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        ny(e.current, 2, null, e, null, null), di(), t[fn] = null;
      }
    };
    function Ai(e) {
      this._internalRoot = e;
    }
    Ai.prototype.unstable_scheduleHydration = function(e) {
      if (e) {
        var t = Wa();
        e = {
          blockedOn: null,
          target: e,
          priority: t
        };
        for (var a = 0; a < cr.length && t !== 0 && t < cr[a].priority; a++) ;
        cr.splice(a, 0, e), a === 0 && iy(e);
      }
    };
    var fy = n.version;
    if (fy !== "19.2.4") throw Error(o(527, fy, "19.2.4"));
    K.findDOMNode = function(e) {
      var t = e._reactInternals;
      if (t === void 0) throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
      return e = p(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
    };
    var rS = {
      bundleType: 0,
      version: "19.2.4",
      rendererPackageName: "react-dom",
      currentDispatcherRef: $,
      reconcilerVersion: "19.2.4"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
      var Ti = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Ti.isDisabled && Ti.supportsFiber) try {
        Kt = Ti.inject(rS), St = Ti;
      } catch {
      }
    }
    return $o.createRoot = function(e, t) {
      if (!i(e)) throw Error(o(299));
      var a = false, s = "", u = vg, h = xg, w = wg;
      return t != null && (t.unstable_strictMode === true && (a = true), t.identifierPrefix !== void 0 && (s = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (h = t.onCaughtError), t.onRecoverableError !== void 0 && (w = t.onRecoverableError)), t = ey(e, 1, false, null, null, a, s, null, u, h, w, dy), e[fn] = t.current, fd(e), new Ad(t);
    }, $o.hydrateRoot = function(e, t, a) {
      if (!i(e)) throw Error(o(299));
      var s = false, u = "", h = vg, w = xg, M = wg, H = null;
      return a != null && (a.unstable_strictMode === true && (s = true), a.identifierPrefix !== void 0 && (u = a.identifierPrefix), a.onUncaughtError !== void 0 && (h = a.onUncaughtError), a.onCaughtError !== void 0 && (w = a.onCaughtError), a.onRecoverableError !== void 0 && (M = a.onRecoverableError), a.formState !== void 0 && (H = a.formState)), t = ey(e, 1, true, t, a ?? null, s, u, H, h, w, M, dy), t.context = ty(null), a = t.current, s = Mn(), s = An(s), u = Zl(s), u.callback = null, Kl(a, u, s), a = s, t.current.lanes = a, fl(t, a), ol(t), e[fn] = t.current, fd(e), new Ai(t);
    }, $o.version = "19.2.4", $o;
  }
  var Sy;
  function mS() {
    if (Sy) return Od.exports;
    Sy = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), Od.exports = hS(), Od.exports;
  }
  var gS = mS();
  const pS = "modulepreload", yS = function(l, n) {
    return new URL(l, n).href;
  }, Cy = {}, xt = function(n, r, o) {
    let i = Promise.resolve();
    if (r && r.length > 0) {
      let d = function(v) {
        return Promise.all(v.map((x) => Promise.resolve(x).then((S) => ({
          status: "fulfilled",
          value: S
        }), (S) => ({
          status: "rejected",
          reason: S
        }))));
      };
      const f = document.getElementsByTagName("link"), m = document.querySelector("meta[property=csp-nonce]"), p = (m == null ? void 0 : m.nonce) || (m == null ? void 0 : m.getAttribute("nonce"));
      i = d(r.map((v) => {
        if (v = yS(v, o), v in Cy) return;
        Cy[v] = true;
        const x = v.endsWith(".css"), S = x ? '[rel="stylesheet"]' : "";
        if (!!o) for (let b = f.length - 1; b >= 0; b--) {
          const E = f[b];
          if (E.href === v && (!x || E.rel === "stylesheet")) return;
        }
        else if (document.querySelector(`link[href="${v}"]${S}`)) return;
        const _ = document.createElement("link");
        if (_.rel = x ? "stylesheet" : pS, x || (_.as = "script"), _.crossOrigin = "", _.href = v, p && _.setAttribute("nonce", p), document.head.appendChild(_), x) return new Promise((b, E) => {
          _.addEventListener("load", b), _.addEventListener("error", () => E(new Error(`Unable to preload CSS for ${v}`)));
        });
      }));
    }
    function c(d) {
      const f = new Event("vite:preloadError", {
        cancelable: true
      });
      if (f.payload = d, window.dispatchEvent(f), !f.defaultPrevented) throw d;
    }
    return i.then((d) => {
      for (const f of d || []) f.status === "rejected" && c(f.reason);
      return n().catch(c);
    });
  }, Ey = (l) => {
    let n;
    const r = /* @__PURE__ */ new Set(), o = (p, v) => {
      const x = typeof p == "function" ? p(n) : p;
      if (!Object.is(x, n)) {
        const S = n;
        n = v ?? (typeof x != "object" || x === null) ? x : Object.assign({}, n, x), r.forEach((C) => C(n, S));
      }
    }, i = () => n, f = {
      setState: o,
      getState: i,
      getInitialState: () => m,
      subscribe: (p) => (r.add(p), () => r.delete(p))
    }, m = n = l(o, i, f);
    return f;
  }, bS = ((l) => l ? Ey(l) : Ey), vS = (l) => l;
  function xS(l, n = vS) {
    const r = Va.useSyncExternalStore(l.subscribe, Va.useCallback(() => n(l.getState()), [
      l,
      n
    ]), Va.useCallback(() => n(l.getInitialState()), [
      l,
      n
    ]));
    return Va.useDebugValue(r), r;
  }
  const _y = (l) => {
    const n = bS(l), r = (o) => xS(n, o);
    return Object.assign(r, n), r;
  }, Mt = ((l) => l ? _y(l) : _y);
  function wS(l, n) {
    let r;
    try {
      r = l();
    } catch {
      return;
    }
    return {
      getItem: (i) => {
        var c;
        const d = (m) => m === null ? null : JSON.parse(m, void 0), f = (c = r.getItem(i)) != null ? c : null;
        return f instanceof Promise ? f.then(d) : d(f);
      },
      setItem: (i, c) => r.setItem(i, JSON.stringify(c, void 0)),
      removeItem: (i) => r.removeItem(i)
    };
  }
  const Yf = (l) => (n) => {
    try {
      const r = l(n);
      return r instanceof Promise ? r : {
        then(o) {
          return Yf(o)(r);
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
          return Yf(o)(r);
        }
      };
    }
  }, SS = (l, n) => (r, o, i) => {
    let c = {
      storage: wS(() => window.localStorage),
      partialize: (E) => E,
      version: 0,
      merge: (E, k) => ({
        ...k,
        ...E
      }),
      ...n
    }, d = false, f = 0;
    const m = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
    let v = c.storage;
    if (!v) return l((...E) => {
      console.warn(`[zustand persist middleware] Unable to update item '${c.name}', the given storage is currently unavailable.`), r(...E);
    }, o, i);
    const x = () => {
      const E = c.partialize({
        ...o()
      });
      return v.setItem(c.name, {
        state: E,
        version: c.version
      });
    }, S = i.setState;
    i.setState = (E, k) => (S(E, k), x());
    const C = l((...E) => (r(...E), x()), o, i);
    i.getInitialState = () => C;
    let _;
    const b = () => {
      var E, k;
      if (!v) return;
      const O = ++f;
      d = false, m.forEach((T) => {
        var N;
        return T((N = o()) != null ? N : C);
      });
      const R = ((k = c.onRehydrateStorage) == null ? void 0 : k.call(c, (E = o()) != null ? E : C)) || void 0;
      return Yf(v.getItem.bind(v))(c.name).then((T) => {
        if (T) if (typeof T.version == "number" && T.version !== c.version) {
          if (c.migrate) {
            const N = c.migrate(T.state, T.version);
            return N instanceof Promise ? N.then((I) => [
              true,
              I
            ]) : [
              true,
              N
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
        var N;
        if (O !== f) return;
        const [I, A] = T;
        if (_ = c.merge(A, (N = o()) != null ? N : C), r(_, true), I) return x();
      }).then(() => {
        O === f && (R == null ? void 0 : R(o(), void 0), _ = o(), d = true, p.forEach((T) => T(_)));
      }).catch((T) => {
        O === f && (R == null ? void 0 : R(void 0, T));
      });
    };
    return i.persist = {
      setOptions: (E) => {
        c = {
          ...c,
          ...E
        }, E.storage && (v = E.storage);
      },
      clearStorage: () => {
        v == null ? void 0 : v.removeItem(c.name);
      },
      getOptions: () => c,
      rehydrate: () => b(),
      hasHydrated: () => d,
      onHydrate: (E) => (m.add(E), () => {
        m.delete(E);
      }),
      onFinishHydration: (E) => (p.add(E), () => {
        p.delete(E);
      })
    }, c.skipHydration || b(), _ || C;
  }, ih = SS, Xn = {
    dark: "#44ff44",
    light: "#44ff44"
  }, ac = {
    dark: "#ffffff",
    light: "#000000"
  };
  function Uf() {
    return typeof window > "u" || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function ky(l) {
    return l === "system" ? Uf() : l;
  }
  const es = 288, Ki = 200, Fi = 480, he = Mt()(ih((l, n) => ({
    themeSetting: "system",
    theme: Uf(),
    wasmReady: false,
    cursorWorld: null,
    sidebarTab: "layers",
    inspectorFocusRequested: false,
    inspectorFocusField: null,
    showGrid: true,
    rightClickMode: "context-menu",
    zenMode: false,
    explorerCollapsed: false,
    sidebarCollapsed: false,
    explorerWidth: es,
    sidebarWidth: es,
    setThemeSetting: (r) => l({
      themeSetting: r,
      theme: ky(r)
    }),
    toggleTheme: () => l((r) => {
      const o = r.theme === "dark" ? "light" : "dark";
      return {
        themeSetting: o,
        theme: o
      };
    }),
    syncSystemTheme: () => l((r) => r.themeSetting === "system" ? {
      theme: Uf()
    } : {}),
    setWasmReady: (r) => l({
      wasmReady: r
    }),
    setCursorWorld: (r) => l({
      cursorWorld: r
    }),
    getSelectionColor: () => Xn[n().theme],
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
    toggleRightClickMode: () => l((r) => ({
      rightClickMode: r.rightClickMode === "context-menu" ? "zoom" : "context-menu"
    })),
    setRightClickMode: (r) => l({
      rightClickMode: r
    }),
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
      explorerWidth: Math.round(Math.max(Ki, Math.min(Fi, r)))
    }),
    setSidebarWidth: (r) => l({
      sidebarWidth: Math.round(Math.max(Ki, Math.min(Fi, r)))
    })
  }), {
    name: "rosette-ui",
    partialize: (l) => ({
      themeSetting: l.themeSetting,
      showGrid: l.showGrid,
      rightClickMode: l.rightClickMode,
      zenMode: l.zenMode,
      explorerCollapsed: l.explorerCollapsed,
      sidebarCollapsed: l.sidebarCollapsed,
      explorerWidth: l.explorerWidth,
      sidebarWidth: l.sidebarWidth
    }),
    onRehydrateStorage: () => (l) => {
      if (l) {
        l.theme = ky(l.themeSetting);
        const n = (r) => Math.round(Math.max(Ki, Math.min(Fi, r)));
        l.explorerWidth = n(l.explorerWidth), l.sidebarWidth = n(l.sidebarWidth);
      }
    }
  }));
  typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    he.getState().syncSystemTheme();
  });
  let ts = null, qo = null;
  async function CS() {
    if (ts) return ts;
    if (qo) return qo;
    qo = (async () => {
      const l = await xt(() => import("./rosette_wasm-OjlOW3vf.js"), [], import.meta.url);
      return await l.default(), ts = l, l;
    })();
    try {
      return await qo;
    } catch (l) {
      throw qo = null, l;
    }
  }
  function o0() {
    const [l, n] = g.useState(ts), [r, o] = g.useState(!ts), [i, c] = g.useState(null), d = he((f) => f.setWasmReady);
    return g.useEffect(() => {
      let f = true;
      return CS().then((m) => {
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
      error: i,
      isReady: !!l && !r && !i
    };
  }
  const fc = 1.18, hc = 0.82, ES = 1.5, _S = 0.67, kS = 8, MS = 24, s0 = 100, jS = 200, My = 1e6, jy = 1e3, LS = [
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
  ], Ly = 0.1, i0 = 100, c0 = "'Source Code Pro', monospace", RS = 530, ch = 0.72, be = 50, Qi = Math.pow(2, -6), Hd = 1e-18, Yd = 3, Ue = Mt((l, n) => ({
    zoom: Qi,
    offset: {
      x: 0,
      y: 0
    },
    initialized: false,
    setZoom: (r) => l({
      zoom: Math.max(Hd, Math.min(Yd, r))
    }),
    zoomAt: (r, o, i) => {
      const c = n(), d = Math.max(Hd, Math.min(Yd, c.zoom * r)), f = (o - c.offset.x) / c.zoom, m = (i - c.offset.y) / c.zoom, p = o - f * d, v = i - m * d;
      l({
        zoom: d,
        offset: {
          x: p,
          y: v
        }
      });
    },
    pan: (r, o) => l((i) => ({
      offset: {
        x: i.offset.x + r,
        y: i.offset.y + o
      }
    })),
    setOffset: (r, o) => l({
      offset: {
        x: r,
        y: o
      }
    }),
    reset: (r, o) => l({
      zoom: Qi,
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
    zoomToBounds: (r, o, i, c) => {
      const d = Math.abs(r.maxX - r.minX), f = Math.abs(r.maxY - r.minY), m = 1e3, p = Math.max(d, m), v = Math.max(f, m), x = p * Ly, S = v * Ly, C = p + x * 2, _ = v + S * 2, b = (r.minX + r.maxX) / 2, E = (r.minY + r.maxY) / 2, k = o / C, O = i / _, R = Math.max(Hd, Math.min(k, O, Yd)), T = c ? c.x : o / 2, N = c ? c.y : i / 2, I = {
        x: T - b * R,
        y: N - E * R
      };
      l({
        zoom: R,
        offset: I
      });
    },
    zoomToFit: (r, o, i, c) => {
      if (r) n().zoomToBounds(r, o, i, c);
      else {
        const d = c ? c.x : o / 2, f = c ? c.y : i / 2;
        l({
          zoom: Qi,
          offset: {
            x: d,
            y: f
          },
          initialized: true
        });
      }
    },
    zoomToSelected: (r, o, i, c) => {
      r && n().zoomToBounds(r, o, i, c);
    },
    centerOnBounds: (r, o, i, c) => {
      const d = n(), f = (r.minX + r.maxX) / 2, m = (r.minY + r.maxY) / 2, p = c ? c.x : o / 2, v = c ? c.y : i / 2, x = {
        x: p - f * d.zoom,
        y: v - m * d.zoom
      };
      l({
        offset: x
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
    Ue.subscribe(l), l(Ue.getState());
  }
  function Ni(l) {
    const n = l.replace("#", ""), r = Number.parseInt(n.slice(0, 2), 16) / 255, o = Number.parseInt(n.slice(2, 4), 16) / 255, i = Number.parseInt(n.slice(4, 6), 16) / 255;
    return [
      r,
      o,
      i,
      1
    ];
  }
  function AS(l) {
    const { wasm: n, isReady: r } = o0(), [o, i] = g.useState(null), [c, d] = g.useState(false), [f, m] = g.useState(null), p = g.useRef(null), v = he((k) => k.theme), x = he((k) => k.showGrid), { zoom: S, offset: C } = Ue();
    g.useEffect(() => {
      if (!r || !n || !l) return;
      let k = true;
      async function O() {
        try {
          const R = await n.WasmRenderer.create(l);
          if (!k) {
            R.destroy();
            return;
          }
          R.set_theme(v === "dark");
          const T = Xn[v], [N, I, A, D] = Ni(T);
          R.set_selection_color(N, I, A, D);
          const U = ac[v], [B, ne, W, J] = Ni(U);
          R.set_hover_color(B, ne, W, J), R.set_dpr(window.devicePixelRatio || 1), p.current = R, i(R), d(true);
        } catch (R) {
          console.error("Failed to create renderer:", R), k && m(R);
        }
      }
      return O(), () => {
        k = false, p.current && (p.current.destroy(), p.current = null);
      };
    }, [
      r,
      n,
      l
    ]), g.useEffect(() => {
      if (o && c) {
        o.set_theme(v === "dark");
        const k = Xn[v], [O, R, T, N] = Ni(k);
        o.set_selection_color(O, R, T, N);
        const I = ac[v], [A, D, U, B] = Ni(I);
        o.set_hover_color(A, D, U, B);
      }
    }, [
      o,
      c,
      v
    ]), g.useEffect(() => {
      o && c && o.set_grid_visible(x);
    }, [
      o,
      c,
      x
    ]), g.useEffect(() => {
      if (o && c) {
        const k = window.devicePixelRatio || 1;
        o.set_viewport(C.x * k, C.y * k, S * k);
      }
    }, [
      o,
      c,
      S,
      C.x,
      C.y
    ]);
    const _ = g.useCallback(() => {
      o && c && o.render();
    }, [
      o,
      c
    ]), b = g.useCallback((k, O) => {
      o && c && (o.set_dpr(window.devicePixelRatio || 1), o.resize(k, O));
    }, [
      o,
      c
    ]), E = g.useCallback((k, O) => {
      if (o && c) {
        const R = window.devicePixelRatio || 1, T = o.screen_to_world(k * R, O * R);
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
      render: _,
      resize: b,
      screenToWorld: E
    };
  }
  const Gt = Mt((l) => ({
    activeTool: "select",
    toolSetAt: 0,
    setTool: (n) => l({
      activeTool: n,
      toolSetAt: Date.now()
    })
  })), ie = Mt((l) => ({
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
        const i = r.lastSelectedId === n ? o.size > 0 ? [
          ...o
        ][o.size - 1] : null : r.lastSelectedId;
        return {
          selectedIds: o,
          lastSelectedId: i
        };
      } else return o.add(n), {
        selectedIds: o,
        lastSelectedId: n
      };
    }),
    deselect: (n) => l((r) => {
      const o = new Set(r.selectedIds);
      o.delete(n);
      const i = r.lastSelectedId === n ? o.size > 0 ? [
        ...o
      ][o.size - 1] : null : r.lastSelectedId;
      return {
        selectedIds: o,
        lastSelectedId: i
      };
    }),
    removeFromSelection: (n) => ie.getState().deselect(n),
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
      ][0], i = n.indexOf(o);
      if (i === -1) return {
        selectedIds: /* @__PURE__ */ new Set([
          n[0]
        ]),
        lastSelectedId: n[0]
      };
      const c = (i + 1) % n.length, d = n[c];
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
      ][0], i = n.indexOf(o);
      if (i === -1) {
        const f = n[n.length - 1];
        return {
          selectedIds: /* @__PURE__ */ new Set([
            f
          ]),
          lastSelectedId: f
        };
      }
      const c = (i - 1 + n.length) % n.length, d = n[c];
      return {
        selectedIds: /* @__PURE__ */ new Set([
          d
        ]),
        lastSelectedId: d
      };
    })
  })), ds = Mt((l) => ({
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
  function Ud() {
    return `ruler-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  const Ie = Mt((l, n) => ({
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
      const o = Ud(), i = {
        id: o,
        start: r,
        end: r
      };
      return l((c) => {
        const d = new Map(c.rulers);
        return d.set(o, i), {
          rulers: d,
          activeRulerId: o,
          previewEnd: r
        };
      }), o;
    },
    updatePreview: (r) => {
      const o = n();
      o.activeRulerId && l((i) => {
        const c = new Map(i.rulers), d = c.get(o.activeRulerId);
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
      const i = o.rulers.get(o.activeRulerId);
      if (!i) return null;
      const c = {
        ...i,
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
        const i = new Map(o.rulers);
        return i.delete(r.activeRulerId), {
          rulers: i,
          activeRulerId: null,
          previewEnd: null
        };
      });
    },
    updateEndpoint: (r, o, i) => {
      l((c) => {
        const d = new Map(c.rulers), f = d.get(r);
        return f && d.set(r, {
          ...f,
          [o]: i
        }), {
          rulers: d
        };
      });
    },
    removeRuler: (r) => {
      l((o) => {
        var _a, _b2;
        const i = new Map(o.rulers);
        i.delete(r);
        const c = new Set(o.selectedRulerIds);
        return c.delete(r), {
          rulers: i,
          selectedRulerIds: c,
          hoveredRulerId: o.hoveredRulerId === r ? null : o.hoveredRulerId,
          hoveredEndpoint: ((_a = o.hoveredEndpoint) == null ? void 0 : _a.rulerId) === r ? null : o.hoveredEndpoint,
          draggingEndpoint: ((_b2 = o.draggingEndpoint) == null ? void 0 : _b2.rulerId) === r ? null : o.draggingEndpoint
        };
      });
    },
    removeRulers: (r) => {
      l((o) => {
        const i = new Map(o.rulers), c = new Set(o.selectedRulerIds);
        for (const d of r) i.delete(d), c.delete(d);
        return {
          rulers: i,
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
        const o = n().rulers.get(r.rulerId), i = o ? {
          ...o[r.endpoint]
        } : null;
        l({
          draggingEndpoint: r,
          draggingEndpointOriginal: i
        });
      } else l({
        draggingEndpoint: null
      });
    },
    endDraggingEndpoint: () => {
      const r = n(), { draggingEndpoint: o, draggingEndpointOriginal: i, rulers: c } = r;
      if (!o || !i) return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), null;
      const d = c.get(o.rulerId);
      if (!d) return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), null;
      const f = d[o.endpoint], m = f.x !== i.x || f.y !== i.y;
      return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), m ? {
        rulerId: o.rulerId,
        endpoint: o.endpoint,
        oldPosition: i,
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
      const i = new Set(o.selectedRulerIds);
      return i.has(r) ? i.delete(r) : i.add(r), {
        selectedRulerIds: i
      };
    }),
    addToSelection: (r) => {
      l((o) => {
        const i = new Set(o.selectedRulerIds);
        for (const c of r) i.add(c);
        return {
          selectedRulerIds: i
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
      const i = r.x - o.moveStartPoint.x, c = r.y - o.moveStartPoint.y;
      l((d) => {
        const f = new Map(d.rulers);
        for (const m of o.selectedRulerIds) {
          const p = f.get(m);
          p && f.set(m, {
            ...p,
            start: {
              x: p.start.x + i,
              y: p.start.y + c
            },
            end: {
              x: p.end.x + i,
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
      const r = n(), { selectedRulerIds: o, moveStartPoint: i, moveOriginalPoint: c } = r;
      let d = null;
      if (i && c && o.size > 0) {
        const f = i.x - c.x, m = i.y - c.y;
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
      const i = Ud(), c = {
        id: i,
        start: r,
        end: o
      };
      return l((d) => {
        const f = new Map(d.rulers);
        return f.set(i, c), {
          rulers: f
        };
      }), i;
    },
    restoreRulers: (r) => {
      const o = [];
      return l((i) => {
        const c = new Map(i.rulers);
        for (const d of r) {
          const f = Ud();
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
  })), we = Mt((l) => ({
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
  function u0(l) {
    const n = [
      l.name
    ];
    for (const r of l.children) n.push(...u0(r));
    return n;
  }
  function TS(l) {
    const n = /* @__PURE__ */ new Set(), r = [];
    for (const o of l) for (const i of u0(o)) n.has(i) || (n.add(i), r.push(i));
    return r;
  }
  function d0(l) {
    const n = [];
    if (l.children.length > 0) {
      n.push(l.name);
      for (const r of l.children) n.push(...d0(r));
    }
    return n;
  }
  function f0(l) {
    return [
      ...l
    ].sort((n, r) => n.name.localeCompare(r.name)).map((n) => ({
      ...n,
      children: n.children.length > 0 ? f0(n.children) : n.children
    }));
  }
  function NS(l) {
    function n(o) {
      if (o.children.length === 0) return 1;
      let i = 0;
      for (const c of o.children) i = Math.max(i, n(c));
      return 1 + i;
    }
    let r = 0;
    for (const o of l) r = Math.max(r, n(o));
    return r;
  }
  const de = Mt()(ih((l) => ({
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
    cellListMode: "nested",
    isFocused: false,
    focusedItem: null,
    setProjectName: (n) => l({
      projectName: n
    }),
    setCells: (n) => l((r) => {
      const o = [
        ...n
      ].sort((c, d) => c.localeCompare(d)), i = r.activeCell && o.includes(r.activeCell) ? r.activeCell : o[0] ?? null;
      return {
        cells: o,
        activeCell: i,
        cellsLoaded: true
      };
    }),
    setCellTree: (n) => l((r) => {
      var _a;
      const o = f0(n), i = TS(o), c = NS(o), d = r.expandedCells.size === 0 ? new Set(o.flatMap(d0)) : r.expandedCells, f = r.activeCell && i.includes(r.activeCell) ? r.activeCell : i[0] ?? null, m = ((_a = r.focusedItem) == null ? void 0 : _a.type) === "cell" && !i.includes(r.focusedItem.name) ? null : r.focusedItem;
      return {
        cellTree: o,
        cells: i,
        expandedCells: d,
        activeCell: f,
        focusedItem: m,
        maxTreeDepth: c,
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
      var _a;
      const i = o.cells.map((m) => m === n ? r : m).sort((m, p) => m.localeCompare(p)), c = o.activeCell === n ? r : o.activeCell, d = ((_a = o.focusedItem) == null ? void 0 : _a.type) === "cell" && o.focusedItem.name === n ? {
        type: "cell",
        name: r
      } : o.focusedItem, f = new Set(o.hiddenCells);
      return f.has(n) && (f.delete(n), f.add(r)), {
        cells: i,
        activeCell: c,
        focusedItem: d,
        hiddenCells: f
      };
    }),
    removeCell: (n) => l((r) => {
      var _a;
      const o = r.cells.filter((f) => f !== n), i = r.activeCell === n ? o[0] ?? null : r.activeCell, c = ((_a = r.focusedItem) == null ? void 0 : _a.type) === "cell" && r.focusedItem.name === n ? null : r.focusedItem, d = new Set(r.hiddenCells);
      return d.delete(n), {
        cells: o,
        activeCell: i,
        focusedItem: c,
        hiddenCells: d
      };
    }),
    addCell: (n) => l((r) => r.cells.includes(n) ? r : {
      cells: [
        ...r.cells,
        n
      ].sort((i, c) => i.localeCompare(c))
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
    })),
    setCellListMode: (n) => l({
      cellListMode: n
    }),
    setFocused: (n) => l((r) => {
      if (n) {
        const o = r.activeCell ?? r.cells[0] ?? null;
        return {
          isFocused: true,
          focusedItem: o ? {
            type: "cell",
            name: o
          } : null
        };
      }
      return {
        isFocused: false,
        focusedItem: null
      };
    }),
    setFocusedItem: (n) => l({
      focusedItem: n
    })
  }), {
    name: "rosette-explorer",
    partialize: (l) => ({
      projectName: l.projectName,
      cellListMode: l.cellListMode
    })
  }));
  function uh() {
    const l = de.getState().cells;
    let n = 1, r = `cell${n}`;
    for (; l.includes(r); ) n++, r = `cell${n}`;
    return r;
  }
  de.subscribe((l, n) => {
    l.projectName !== n.projectName && xt(async () => {
      const { useTabsStore: r } = await Promise.resolve().then(() => M0);
      return {
        useTabsStore: r
      };
    }, void 0, import.meta.url).then(({ useTabsStore: r }) => {
      const { activeTabId: o, getActiveTab: i, updateTab: c } = r.getState();
      if (!o) return;
      const d = i();
      d && !d.filePath && c(o, {
        title: l.projectName
      });
    });
  });
  const Wi = Mt((l) => ({
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
  })), dh = "img:";
  function jn(l) {
    return l.startsWith(dh);
  }
  function Gr(l) {
    return l.slice(dh.length);
  }
  function fs(l) {
    return dh + l;
  }
  function as(l, n) {
    const { images: r } = Vt.getState();
    let o = null, i = 1 / 0;
    for (const c of r.values()) if (l >= c.x && l <= c.x + c.width && n >= c.y && n <= c.y + c.height) {
      const d = c.width * c.height;
      d < i && (i = d, o = fs(c.id));
    }
    return o;
  }
  function Ry(l, n, r, o) {
    const { images: i } = Vt.getState(), c = [];
    for (const d of i.values()) {
      const f = d.x + d.width, m = d.y + d.height;
      d.x <= r && f >= l && d.y <= o && m >= n && c.push(fs(d.id));
    }
    return c;
  }
  const Vt = Mt((l, n) => ({
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
      const i = new Map(n().images), c = i.get(r);
      c && (i.set(r, {
        ...c,
        ...o
      }), l({
        images: i
      }));
    },
    clearImages: () => {
      for (const r of n().images.values()) URL.revokeObjectURL(r.url);
      l({
        images: /* @__PURE__ */ new Map()
      });
    }
  }));
  let Vr = null;
  const $t = Mt((l) => ({
    message: null,
    level: "info",
    show: (n, r = "info", o = 3e3) => {
      Vr !== null && clearTimeout(Vr), l({
        message: n,
        level: r
      }), Vr = setTimeout(() => {
        l({
          message: null
        }), Vr = null;
      }, o);
    },
    clear: () => {
      Vr !== null && (clearTimeout(Vr), Vr = null), l({
        message: null
      });
    }
  })), Wn = Mt((l) => ({
    isDirty: false,
    markDirty: () => l({
      isDirty: true
    }),
    markClean: () => l({
      isDirty: false
    })
  }));
  let Bd = null;
  function OS(l) {
    const n = (r) => {
      const o = r.useTabsStore.getState().activeTabId;
      o && r.useTabsStore.getState().updateTab(o, {
        isDirty: l
      });
    };
    Bd ? n(Bd) : xt(() => Promise.resolve().then(() => M0), void 0, import.meta.url).then((r) => {
      Bd = r, n(r);
    });
  }
  Wn.subscribe((l, n) => {
    l.isDirty !== n.isDirty && OS(l.isDirty);
  });
  const Ay = 100, ue = Mt((l, n) => ({
    undoStack: [],
    redoStack: [],
    canUndo: false,
    canRedo: false,
    execute: (r, o) => {
      try {
        r.execute(o);
      } catch (i) {
        $t.getState().show(String(i), "warn");
        return;
      }
      we.getState().bumpSyncGeneration(), Wn.getState().markDirty(), l((i) => {
        const c = [
          ...i.undoStack,
          r
        ];
        return c.length > Ay && c.shift(), {
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
      const i = o[o.length - 1];
      try {
        i.undo(r);
      } catch (c) {
        $t.getState().show(String(c), "warn");
        return;
      }
      we.getState().bumpSyncGeneration(), Wn.getState().markDirty(), l((c) => {
        const d = c.undoStack.slice(0, -1), f = [
          ...c.redoStack,
          i
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
      const i = o[o.length - 1];
      try {
        i.execute(r);
      } catch (c) {
        $t.getState().show(String(c), "warn");
        return;
      }
      we.getState().bumpSyncGeneration(), Wn.getState().markDirty(), l((c) => {
        const d = c.redoStack.slice(0, -1);
        return {
          undoStack: [
            ...c.undoStack,
            i
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
      Wn.getState().markDirty(), l((o) => {
        const i = [
          ...o.undoStack,
          r
        ];
        return i.length > Ay && i.shift(), {
          undoStack: i,
          redoStack: [],
          canUndo: true,
          canRedo: false
        };
      });
    }
  })), Vn = Mt((l) => ({
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
  })), Bf = {
    solid: 0,
    hatched: 1,
    crosshatched: 2,
    dotted: 3,
    horizontal: 4,
    vertical: 5,
    zigzag: 6,
    brick: 7
  }, ns = [
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
  ], Xf = 999, oc = [
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
  ], ve = Mt((l, n) => ({
    layers: new Map(oc.map((r) => [
      r.id,
      r
    ])),
    activeLayerId: 1,
    editingLayerId: null,
    expandedLayerId: null,
    isFocused: false,
    focusedLayerId: null,
    getLayer: (r) => n().layers.get(r),
    getActiveLayer: () => {
      const r = n();
      return r.layers.get(r.activeLayerId);
    },
    setActiveLayer: (r) => l({
      activeLayerId: r
    }),
    setLayer: (r) => l((o) => {
      const i = new Map(o.layers);
      return i.set(r.id, r), {
        layers: i
      };
    }),
    addLayer: (r, o) => {
      const i = n(), c = Array.from(i.layers.values());
      let d = 1;
      const f = new Set(c.map((C) => C.layerNumber));
      for (; f.has(d) && d <= Xf; ) d++;
      if (d > Xf) return c[0];
      const p = Math.max(0, ...c.map((C) => C.id)) + 1, v = new Set(c.map((C) => C.color)), x = o ?? ns.find((C) => !v.has(C)) ?? ns[c.length % ns.length], S = {
        id: p,
        layerNumber: d,
        datatype: 0,
        name: r ?? `layer${d}`,
        color: x,
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      };
      return l((C) => {
        const _ = new Map(C.layers);
        return _.set(S.id, S), {
          layers: _,
          activeLayerId: S.id
        };
      }), S;
    },
    deleteLayer: (r) => l((o) => {
      if (o.layers.size <= 1) return o;
      const i = new Map(o.layers);
      i.delete(r);
      let c = o.activeLayerId;
      o.activeLayerId === r && (c = i.keys().next().value ?? 1);
      const d = o.focusedLayerId === r ? null : o.focusedLayerId;
      return {
        layers: i,
        activeLayerId: c,
        focusedLayerId: d
      };
    }),
    toggleVisibility: (r) => l((o) => {
      const i = o.layers.get(r);
      if (!i) return o;
      const c = new Map(o.layers);
      return c.set(r, {
        ...i,
        visible: !i.visible
      }), {
        layers: c
      };
    }),
    showAllLayers: () => l((r) => {
      const o = new Map(r.layers);
      for (const [i, c] of o) o.set(i, {
        ...c,
        visible: true
      });
      return {
        layers: o
      };
    }),
    hideAllLayers: () => l((r) => {
      const o = new Map(r.layers);
      for (const [i, c] of o) o.set(i, {
        ...c,
        visible: false
      });
      return {
        layers: o
      };
    }),
    getAllLayers: () => Array.from(n().layers.values()).sort((r, o) => r.layerNumber - o.layerNumber || r.datatype - o.datatype),
    layerExists: (r, o) => {
      const i = n().layers;
      for (const c of i.values()) if (c.layerNumber === r && c.datatype === o) return true;
      return false;
    },
    resetLayers: (r) => l(() => {
      var _a;
      const o = new Map(r.map((c) => [
        c.id,
        c
      ])), i = ((_a = r[0]) == null ? void 0 : _a.id) ?? 1;
      return {
        layers: o,
        activeLayerId: i,
        editingLayerId: null,
        expandedLayerId: null,
        isFocused: false,
        focusedLayerId: null
      };
    }),
    setEditingLayerId: (r) => l({
      editingLayerId: r
    }),
    setExpandedLayerId: (r) => l({
      expandedLayerId: r
    }),
    setFocused: (r) => {
      if (r) {
        const i = n().activeLayerId;
        l({
          isFocused: true,
          focusedLayerId: i
        });
      } else l({
        isFocused: false,
        focusedLayerId: null
      });
    },
    setFocusedLayerId: (r) => l({
      focusedLayerId: r
    })
  }));
  function mc(l, n = 0.7) {
    const r = l.replace("#", ""), o = Number.parseInt(r.slice(0, 2), 16) / 255, i = Number.parseInt(r.slice(2, 4), 16) / 255, c = Number.parseInt(r.slice(4, 6), 16) / 255;
    return [
      o,
      i,
      c,
      n
    ];
  }
  function Vf(l) {
    return {
      minX: l[0],
      minY: l[1],
      maxX: l[2],
      maxY: l[3]
    };
  }
  function $f(l) {
    return {
      x: (l.minX + l.maxX) / 2,
      y: (l.minY + l.maxY) / 2
    };
  }
  function IS(l, n) {
    const r = /* @__PURE__ */ new Set(), o = [];
    for (const i of n) {
      if (r.has(i)) continue;
      const d = l.get_group_ids(i).filter((f) => n.has(f));
      for (const f of d) r.add(f);
      d.length > 0 && o.push(d);
    }
    return o;
  }
  function DS(l, n, r, o) {
    const i = IS(l, n);
    if (o === "origin-align") return zS(l, i);
    if (i.length < 2 || !r) return [];
    const c = i.findIndex((v) => v.includes(r));
    if (c === -1) return [];
    const d = l.get_bounds_for_ids(i[c]);
    if (!d) return [];
    const f = Vf(d), m = $f(f), p = [];
    for (let v = 0; v < i.length; v++) {
      if (v === c) continue;
      const x = i[v], S = l.get_bounds_for_ids(x);
      if (!S) continue;
      const C = Vf(S), _ = $f(C);
      let b = 0, E = 0;
      switch (o) {
        case "align-left":
          b = f.minX - C.minX;
          break;
        case "align-center-h":
          b = m.x - _.x;
          break;
        case "align-right":
          b = f.maxX - C.maxX;
          break;
        case "align-top":
          E = f.minY - C.minY;
          break;
        case "align-center-v":
          E = m.y - _.y;
          break;
        case "align-bottom":
          E = f.maxY - C.maxY;
          break;
        case "center-align":
          b = m.x - _.x, E = m.y - _.y;
          break;
      }
      (b !== 0 || E !== 0) && p.push({
        ids: x,
        dx: b,
        dy: E
      });
    }
    return p;
  }
  function zS(l, n) {
    const r = [];
    for (const o of n) {
      const i = l.get_bounds_for_ids(o);
      if (!i) continue;
      const c = $f(Vf(i)), d = -c.x, f = -c.y;
      (d !== 0 || f !== 0) && r.push({
        ids: o,
        dx: d,
        dy: f
      });
    }
    return r;
  }
  const Bn = "__TAURI__" in window;
  async function hs(l, n) {
    const { invoke: r } = await xt(async () => {
      const { invoke: o } = await import("./core-DxBnVPgq.js");
      return {
        invoke: o
      };
    }, [], import.meta.url);
    return r(l, n);
  }
  async function h0(l) {
    const n = await hs("read_gds_bytes", {
      path: l
    });
    return new Uint8Array(n);
  }
  async function m0(l, n) {
    return hs("save_gds", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function g0(l, n) {
    return hs("save_bytes", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function p0() {
    return hs("get_pending_file");
  }
  async function y0() {
    const { open: l } = await xt(async () => {
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
  async function b0(l) {
    const { save: n } = await xt(async () => {
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
  async function v0(l) {
    const { save: n } = await xt(async () => {
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
  async function x0() {
    const { open: l } = await xt(async () => {
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
  async function w0(l) {
    const n = await hs("read_gds_bytes", {
      path: l
    });
    return new Uint8Array(n);
  }
  async function S0(l, n) {
    const { listen: r } = await xt(async () => {
      const { listen: i } = await import("./event-BC8TvpKC.js");
      return {
        listen: i
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    return await r(l, (i) => n(i.payload));
  }
  const C0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    getPendingFile: p0,
    isTauri: Bn,
    listenTauri: S0,
    pickGdsFile: y0,
    pickImageFile: x0,
    pickSaveFile: b0,
    pickSaveImageFile: v0,
    readFileBytes: w0,
    readGdsBytes: h0,
    saveBytes: g0,
    saveGds: m0
  }, Symbol.toStringTag, {
    value: "Module"
  })), E0 = 100 * be, gc = 64, tt = Mt((l, n) => ({
    width: E0,
    cornerRadius: 0,
    numArcPoints: gc,
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
      const i = new Map(n().pathMetadata);
      i.set(r, o), l({
        pathMetadata: i
      });
    },
    removePathMetadata: (r) => {
      const o = new Map(n().pathMetadata);
      o.delete(r), l({
        pathMetadata: o
      });
    },
    removePathMetadataMany: (r) => {
      const o = n().pathMetadata;
      let i = false;
      const c = new Map(o);
      for (const d of r) c.delete(d) && (i = true);
      i && l({
        pathMetadata: c
      });
    },
    translateWaypoints: (r, o, i) => {
      const c = n().pathMetadata;
      let d = false;
      const f = new Map(c);
      for (const m of r) {
        const p = f.get(m);
        p && (f.set(m, {
          ...p,
          waypoints: p.waypoints.map((v) => ({
            x: v.x + o,
            y: v.y + i
          }))
        }), d = true);
      }
      d && l({
        pathMetadata: f
      });
    }
  }));
  function HS() {
    return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  const Pe = Mt((l, n) => ({
    tabs: [],
    activeTabId: null,
    addTab: (r) => {
      const o = HS(), i = {
        id: o,
        title: (r == null ? void 0 : r.title) ?? "untitled",
        filePath: (r == null ? void 0 : r.filePath) ?? null,
        isDirty: false
      };
      return l((c) => ({
        tabs: [
          ...c.tabs,
          i
        ],
        activeTabId: o
      })), o;
    },
    closeTab: (r) => {
      const o = n(), i = o.tabs.findIndex((f) => f.id === r);
      if (i === -1) return false;
      const c = o.tabs.filter((f) => f.id !== r);
      let d = o.activeTabId;
      return o.activeTabId === r && (c.length === 0 ? d = null : i < c.length ? d = c[i].id : d = c[c.length - 1].id), l({
        tabs: c,
        activeTabId: d
      }), true;
    },
    setActiveTab: (r) => {
      n().tabs.some((i) => i.id === r) && l({
        activeTabId: r
      });
    },
    updateTab: (r, o) => {
      l((i) => ({
        tabs: i.tabs.map((c) => c.id === r ? {
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
  })), ms = /* @__PURE__ */ new Map(), gr = /* @__PURE__ */ new Map();
  function os(l) {
    const n = Ue.getState(), r = ie.getState(), o = ue.getState(), i = ve.getState(), c = de.getState(), d = Gt.getState(), f = tt.getState(), m = Ie.getState(), p = Vn.getState(), v = Wn.getState(), x = {
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
        layers: new Map(i.layers),
        activeLayerId: i.activeLayerId
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
    ms.set(l, x), Pe.getState().updateTab(l, {
      isDirty: v.isDirty
    });
  }
  function _0(l) {
    const n = ms.get(l);
    if (!n) return;
    Ue.setState({
      zoom: n.viewport.zoom,
      offset: {
        ...n.viewport.offset
      },
      initialized: n.viewport.initialized
    }), ie.setState({
      selectedIds: new Set(n.selection.selectedIds),
      hoveredId: n.selection.hoveredId,
      lastSelectedId: n.selection.lastSelectedId
    }), ue.setState({
      undoStack: [
        ...n.history.undoStack
      ],
      redoStack: [
        ...n.history.redoStack
      ],
      canUndo: n.history.undoStack.length > 0,
      canRedo: n.history.redoStack.length > 0
    }), ve.setState({
      layers: new Map(n.layers.layers),
      activeLayerId: n.layers.activeLayerId,
      editingLayerId: null,
      expandedLayerId: null,
      isFocused: false,
      focusedLayerId: null
    }), de.setState({
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
      hiddenCells: new Set(n.explorer.hiddenCells),
      isFocused: false,
      focusedItem: null
    }), Gt.setState({
      activeTool: n.tool.activeTool,
      toolSetAt: Date.now()
    }), tt.setState({
      width: n.path.width,
      cornerRadius: n.path.cornerRadius,
      numArcPoints: n.path.numArcPoints,
      pathMetadata: new Map(n.path.pathMetadata)
    }), Ie.setState({
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
    }), Vn.setState({
      elements: [
        ...n.clipboard.elements
      ],
      hasContent: n.clipboard.hasContent
    }), Wn.setState({
      isDirty: n.document.isDirty
    });
    const r = gr.get(l) ?? null;
    we.setState({
      library: r
    }), we.getState().bumpSyncGeneration();
  }
  function Ji(l) {
    ms.delete(l);
    const n = gr.get(l);
    n && (n.free(), gr.delete(l));
  }
  function ls(l, n) {
    gr.set(l, n);
  }
  function ec(l) {
    return gr.get(l) ?? null;
  }
  function $r(l, n) {
    if (l && l !== n) {
      os(l);
      const r = we.getState().library;
      r && gr.set(l, r);
    }
    _0(n);
  }
  function k0() {
    return {
      viewport: {
        zoom: Qi,
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
        layers: new Map(oc.map((l) => [
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
        width: E0,
        cornerRadius: 0,
        numArcPoints: gc,
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
  function tc(l, n) {
    const r = new n.WasmLibrary("rosette");
    try {
      r.add_cell("top");
    } catch {
    }
    r.set_active_cell("top"), gr.set(l, r);
    const o = k0();
    return ms.set(l, o), r;
  }
  function YS(l, n, r) {
    gr.set(l, n);
    const o = {
      ...k0(),
      ...r
    };
    ms.set(l, o);
  }
  const M0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    deleteTabSnapshot: Ji,
    getTabLibrary: ec,
    initNewTab: tc,
    initTabWithLibrary: YS,
    restoreTabSnapshot: _0,
    saveTabSnapshot: os,
    setTabLibrary: ls,
    switchTab: $r,
    useTabsStore: Pe
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  let $a = null, il = null, cl = null, nc = null, Ln = null;
  const rs = /* @__PURE__ */ new Map();
  function pr(l) {
    const n = (il == null ? void 0 : il.get(l)) ?? null;
    if (n) return n;
    if (!l.startsWith("ref:") && $a) {
      const r = $a.active_cell_name();
      let o = $a.get_element_index(l);
      if (o < 0 && rs.has(l) && (o = rs.get(l)), o >= 0) {
        if (rs.set(l, o), cl && r && cl[r]) {
          const i = cl[r];
          if (o < i.length && i[o]) return i[o];
        }
        if (nc && o < nc.length) {
          const i = nc[o];
          if (i) return i;
        }
      }
    }
    return null;
  }
  async function US(l) {
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
  async function zl(l) {
    try {
      const n = await fetch("/api/design/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(l)
      }), r = await n.text();
      if (!n.ok) return $t.getState().show(`Source edit failed (HTTP ${n.status}): ${l.op}`, "error", 5e3), false;
      try {
        const o = JSON.parse(r);
        if (!o.ok) return $t.getState().show(`Source edit failed: ${o.error || l.op}`, "error", 5e3), false;
      } catch {
      }
      return true;
    } catch {
      return $t.getState().show("Source edit failed: could not reach server", "error", 5e3), false;
    }
  }
  function Qo(l, n) {
    const r = pr(l);
    r && (r.type !== "polygon" && r.type !== "path" || zl({
      op: "modify_vertices",
      file: r.file,
      line: r.line,
      old_code: r.code,
      vertices: Array.from(n)
    }));
  }
  function BS(l, n, r) {
    const o = pr(l);
    o && o.type === "ref" && zl({
      op: "move_ref",
      file: o.file,
      line: o.line,
      old_code: o.code,
      dx: n,
      dy: r
    });
  }
  function XS(l, n, r) {
    const o = pr(l);
    o && (o.type !== "polygon" && o.type !== "path" || zl({
      op: "modify_layer",
      file: o.file,
      line: o.line,
      old_code: o.code,
      layer: n,
      datatype: r
    }));
  }
  function VS(l) {
    const n = pr(l);
    n && zl({
      op: "delete_element",
      file: n.file,
      line: n.line,
      old_code: n.code
    });
  }
  function j0(l, n, r) {
    const o = $a == null ? void 0 : $a.active_cell_name(), i = de.getState().cells[0] ?? null;
    if (o && i && o !== i) {
      if (cl && cl[o]) {
        const m = cl[o];
        let p = 0, v = "", x = o;
        for (const S of m) if (S && S.line > p) {
          p = S.line, v = S.file;
          const C = S.code.indexOf(".");
          C > 0 && (x = S.code.substring(0, C).trim());
        }
        if (v && p > 0) {
          zl({
            op: "add_element",
            file: v,
            after_line: p,
            element_type: "polygon",
            vertices: Array.from(l),
            layer: n,
            datatype: r,
            cell_var: x
          });
          return;
        }
      }
      if (Ln && Ln[o]) {
        const m = Ln[o];
        zl({
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
    if (!il || il.size === 0) return;
    let c = 0, d = "", f = "cell";
    for (const m of il.values()) if (m.line > c) {
      c = m.line, d = m.file;
      const p = m.code.indexOf(".");
      p > 0 && (f = m.code.substring(0, p).trim());
    }
    !d || c === 0 || zl({
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
  function L0(l, n, r) {
    const o = de.getState().cells[0] ?? null;
    let i = "", c = "design", d = 0;
    if (n === o && il) for (const m of il.values()) {
      i || (i = m.file);
      const p = m.code.indexOf(".");
      p > 0 && (c = m.code.substring(0, p).trim()), m.type === "ref" && m.line > d && (d = m.line);
    }
    else if (cl && cl[n]) {
      for (const m of cl[n]) if (m && m.type === "ref" && m.line > d) {
        d = m.line, i || (i = m.file);
        const p = m.code.indexOf(".");
        p > 0 && (c = m.code.substring(0, p).trim());
      }
    }
    if (Ln && Ln[n]) {
      const m = Ln[n];
      i || (i = m.file), d || (d = m.line, c = m.var_name);
    }
    if (!d && il) for (const m of il.values()) m.line > d && (d = m.line, i || (i = m.file));
    if (!i || !d) return;
    const f = Ln && Ln[l] ? Ln[l].var_name : l;
    zl({
      op: "add_ref",
      file: i,
      after_line: d,
      cell_name: f,
      parent_var: c,
      transform: r
    });
  }
  function $S(l) {
    if (!Ln || !Ln[l]) return;
    const n = Ln[l];
    zl({
      op: "delete_cell",
      file: n.file,
      cell_name: l,
      var_name: n.var_name
    });
  }
  function qS(l, n, r) {
    if (nc = n, cl = r ?? null, !n || n.length === 0) {
      il = null;
      return;
    }
    const o = /* @__PURE__ */ new Map();
    try {
      const i = l.get_render_polygons();
      for (const c of i) {
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
    il = o.size > 0 ? o : null;
  }
  function qf() {
    return new URLSearchParams(window.location.search).get("design") === "true";
  }
  function ss() {
    return new URLSearchParams(window.location.search).get("embed") === "true";
  }
  function GS() {
    return new URLSearchParams(window.location.search).get("src");
  }
  function PS() {
    const n = new URLSearchParams(window.location.search).get("colors");
    return n ? n.split(",").map((r) => `#${r.trim()}`) : null;
  }
  function ZS() {
    const n = new URLSearchParams(window.location.search).get("fills");
    return n ? n.split(",").map((r) => r.trim()) : null;
  }
  function KS() {
    return new URLSearchParams(window.location.search).get("name");
  }
  function FS() {
    const n = new URLSearchParams(window.location.search).get("panelWidth");
    if (!n) return null;
    const r = Number.parseInt(n, 10);
    return Number.isNaN(r) || r <= 0 ? null : r;
  }
  function QS() {
    const n = new URLSearchParams(window.location.search).get("zoom");
    if (!n) return null;
    const r = Number.parseFloat(n);
    return Number.isNaN(r) || r <= 0 ? null : r;
  }
  function WS() {
    return Bn && !qf() && !ss();
  }
  function JS(l) {
    return l !== null && !Array.isArray(l) && "name" in l && "children" in l;
  }
  function Xd(l, n) {
    for (const r of n.values()) {
      const o = r.visible ? r.opacity ?? 0.7 : 0, [i, c, d, f] = mc(r.color, o);
      l.set_layer_color(r.layerNumber, r.datatype, i, c, d, f);
    }
  }
  const sc = ns;
  function e2(l, n) {
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
    })), i = l.get_used_layers();
    let c = Math.max(0, ...o.map((f) => f.id)) + 1, d = o.length;
    for (let f = 0; f < i.length; f += 2) {
      const m = i[f], p = i[f + 1], v = `${m}/${p}`;
      r.has(v) || (o.push({
        id: c++,
        layerNumber: m,
        datatype: p,
        name: p === 0 ? `layer${m}` : `layer${m}/${p}`,
        color: sc[d % sc.length],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      }), d++);
    }
    return ve.getState().resetLayers(o), true;
  }
  function Vd(l) {
    const n = l.get_used_layers();
    if (n.length === 0) return;
    const r = [];
    for (let o = 0; o < n.length; o += 2) {
      const i = n[o], c = n[o + 1], d = o / 2 + 1, f = (d - 1) % sc.length, m = c === 0 ? `layer${i}` : `layer${i}/${c}`;
      r.push({
        id: d,
        layerNumber: i,
        datatype: c,
        name: m,
        color: sc[f],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      });
    }
    ve.getState().resetLayers(r);
  }
  function $d() {
    ue.getState().clear(), ie.getState().clearSelection(), Ie.getState().clearAllRulers(), Vn.getState().clear(), Wn.getState().markClean();
  }
  function t2(l, n) {
    const r = l.get_cell_tree();
    if (r) {
      de.getState().setCellTree(r);
      const o = l.active_cell_name();
      o && de.getState().setActiveCell(o);
    } else de.getState().setCells([
      "top"
    ]);
    n && de.getState().setProjectName(n);
  }
  function n2(l, n) {
    const [r, o] = g.useState(null), [i, c] = g.useState(false), d = ve((_) => _.layers), f = g.useRef(d), m = g.useRef(0), p = g.useCallback((_) => {
      $a = _, o(_);
    }, []), v = g.useRef(l);
    g.useEffect(() => {
      f.current = d;
    }, [
      d
    ]), g.useEffect(() => {
      v.current = l;
    }, [
      l
    ]), g.useEffect(() => Pe.subscribe((b, E) => {
      if (b.activeTabId && b.activeTabId !== E.activeTabId) {
        const k = ec(b.activeTabId);
        k && (p(k), c(true));
      }
    }), [
      p
    ]), g.useEffect(() => {
      if (!l || !n || qf() || ss()) return;
      const { tabs: _ } = Pe.getState();
      if (_.length > 0) {
        const R = Pe.getState().activeTabId;
        if (R) {
          const T = ec(R);
          if (T) {
            p(T), c(true);
            return;
          }
        }
      }
      const b = de.getState().projectName, E = Pe.getState().addTab({
        title: b
      }), k = tc(E, l), O = k.get_cell_tree();
      O ? de.getState().setCellTree(O) : de.getState().setCells([
        "top"
      ]), p(k), c(true);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n) return;
      const _ = () => {
        const b = Pe.getState().addTab({
          title: "untitled-project"
        }), E = tc(b, l);
        $d(), ve.getState().resetLayers(oc), de.getState().setProjectName("untitled-project");
        const k = E.get_cell_tree();
        k ? de.getState().setCellTree(k) : de.getState().setCells([
          "top"
        ]), de.getState().setActiveCell("top");
        const O = document.getElementById("rosette-canvas");
        if (O) {
          const R = O.getBoundingClientRect();
          Ue.getState().reset(R.width, R.height);
        }
        p(E), c(true), we.getState().bumpSyncGeneration();
      };
      return window.addEventListener("rosette-new-tab", _), () => window.removeEventListener("rosette-new-tab", _);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !WS()) return;
      let _ = false;
      const b = async (k) => {
        if (!_) try {
          const O = Pe.getState().findTabByPath(k);
          if (O) {
            const U = Pe.getState().activeTabId;
            if (U && U !== O.id) {
              $r(U, O.id), Pe.getState().setActiveTab(O.id);
              const B = ec(O.id);
              B && (p(B), c(true));
            }
            return;
          }
          const R = await h0(k);
          if (_) return;
          const T = l.WasmLibrary.from_gds_bytes(R), N = Pe.getState().activeTabId;
          if (N) {
            os(N);
            const U = we.getState().library;
            U && ls(N, U);
          }
          const I = k.split(/[/\\]/).pop() ?? "untitled", A = Pe.getState().addTab({
            title: I,
            filePath: k
          });
          Vd(T), Xd(T, ve.getState().layers), ls(A, T), $d(), t2(T, I);
          const D = document.getElementById("rosette-canvas");
          if (D) {
            const U = D.getBoundingClientRect();
            Ue.getState().reset(U.width, U.height);
          }
          p(T), c(true), we.getState().bumpSyncGeneration();
        } catch (O) {
          console.error("Failed to open GDS file:", O);
        }
      };
      p0().then((k) => {
        k && !_ && b(k);
      });
      let E = null;
      return S0("open-file", b).then((k) => {
        _ ? k() : E = k;
      }), () => {
        _ = true, E == null ? void 0 : E();
      };
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n) return;
      const _ = () => {
        const b = Pe.getState().activeTabId;
        if (b) {
          os(b);
          const T = we.getState().library;
          T && ls(b, T);
        }
        const E = Pe.getState().addTab({
          title: "untitled-project"
        }), k = tc(E, l);
        $d(), ve.getState().resetLayers(oc), de.getState().setProjectName("untitled-project");
        const O = k.get_cell_tree();
        O ? de.getState().setCellTree(O) : de.getState().setCells([
          "top"
        ]), de.getState().setActiveCell("top");
        const R = document.getElementById("rosette-canvas");
        if (R) {
          const T = R.getBoundingClientRect();
          Ue.getState().reset(T.width, T.height);
        }
        p(k), c(true), we.getState().bumpSyncGeneration();
      };
      return window.addEventListener("rosette-new-file", _), () => window.removeEventListener("rosette-new-file", _);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !qf()) return;
      const _ = new EventSource("/api/design/events");
      return _.addEventListener("design", (b) => {
        try {
          const E = JSON.parse(b.data);
          if (E.version < m.current && (m.current = 0), E.version !== m.current && E.json) try {
            const k = l.WasmLibrary.from_library_json(E.json);
            E.layers && E.layers.length > 0 ? e2(k, E.layers) : Vd(k), Xd(k, ve.getState().layers);
            const O = $a;
            p(k), c(true), m.current = E.version, ue.getState().clear();
            const R = [
              ...ie.getState().selectedIds
            ], T = [];
            for (const I of R) if (I.startsWith("ref:")) T.push({
              elemIdx: -1,
              refId: I
            });
            else if (O) {
              let A = O.get_element_index(I);
              A < 0 && (A = rs.get(I) ?? -1), A >= 0 && rs.set(I, A), T.push({
                elemIdx: A,
                refId: ""
              });
            }
            ie.getState().clearSelection(), O && requestAnimationFrame(() => {
              try {
                O.free();
              } catch {
              }
            }), qS(k, E.source_map ?? null, E.child_source_maps ?? null), Ln = E.cell_vars ?? null;
            const N = k.get_cell_tree();
            if (N) {
              const I = de.getState().activeCell;
              de.getState().setCellTree(N), I && de.getState().cells.includes(I) && k.set_active_cell(I);
            } else E.cells && (JS(E.cells) ? de.getState().setCellTree([
              E.cells
            ]) : de.getState().setCells(E.cells));
            if (E.filename && de.getState().setProjectName(E.filename), T.length > 0) {
              const I = /* @__PURE__ */ new Set(), A = k.get_all_ids(), D = /* @__PURE__ */ new Map();
              for (const U of A) if (!U.startsWith("ref:")) {
                const B = k.get_element_index(U);
                B >= 0 && D.set(B, U);
              }
              for (const U of T) if (U.refId) I.add(U.refId);
              else if (U.elemIdx >= 0) {
                const B = D.get(U.elemIdx);
                B && I.add(B);
              }
              I.size > 0 && ie.getState().setSelection(I);
            }
          } catch (k) {
            console.error("Failed to parse design:", k);
          }
        } catch (E) {
          console.error("Failed to parse SSE event:", E);
        }
      }), _.onerror = () => {
        console.warn("SSE connection error, reconnecting...");
      }, () => {
        _.close();
      };
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !ss()) return;
      const _ = GS();
      if (!_ || _.startsWith("//") || /^https?:\/\//i.test(_)) {
        console.error("Embed mode requires a relative ?src= parameter pointing to a JSON file");
        return;
      }
      let b = false;
      return (async () => {
        try {
          const E = await fetch(_);
          if (!E.ok) throw new Error(`Failed to fetch ${_}: ${E.status}`);
          const k = await E.text();
          if (b) return;
          const O = l.WasmLibrary.from_library_json(k);
          Vd(O);
          const R = PS(), T = ZS();
          if (R || T) {
            const D = ve.getState().layers, B = Array.from(D.values()).map((ne, W) => {
              let J = ne;
              return R && W < R.length && (J = {
                ...J,
                color: R[W]
              }), T && W < T.length && T[W] in Bf && (J = {
                ...J,
                fillPattern: T[W]
              }), J;
            });
            ve.getState().resetLayers(B);
          }
          Xd(O, ve.getState().layers);
          const N = we.getState().library;
          N && N.free(), p(O), c(true);
          const I = KS();
          I && de.getState().setProjectName(I);
          const A = O.get_cell_tree();
          if (A) {
            de.getState().setCellTree(A);
            const D = O.active_cell_name();
            D && de.getState().setActiveCell(D);
          }
        } catch (E) {
          console.error("Failed to load embed design:", E);
        }
      })(), () => {
        b = true;
      };
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (r) for (const _ of d.values()) {
        const b = _.visible ? _.opacity ?? 0.7 : 0, [E, k, O, R] = mc(_.color, b);
        r.set_layer_color(_.layerNumber, _.datatype, E, k, O, R), r.set_layer_fill_pattern(_.layerNumber, _.datatype, Bf[_.fillPattern ?? "solid"] ?? 0);
      }
    }, [
      r,
      d
    ]);
    const x = g.useCallback((_, b, E, k, O) => r ? r.add_rectangle(_, b, E, k, O, 0) ?? null : null, [
      r
    ]), S = g.useCallback((_, b) => r ? r.add_polygon(new Float64Array(_), b, 0) ?? null : null, [
      r
    ]), C = g.useCallback(() => {
      r && r.clear_active_cell();
    }, [
      r
    ]);
    return {
      library: r,
      isReady: i,
      addRectangle: x,
      addPolygon: S,
      clearCell: C
    };
  }
  const Ty = 8;
  function Ny(l, n) {
    const r = n.x - l.x, o = n.y - l.y;
    if (r === 0 && o === 0) return n;
    const i = Math.abs(Math.atan2(Math.abs(o), Math.abs(r)) * (180 / Math.PI));
    return i <= Ty ? {
      x: n.x,
      y: l.y
    } : i >= 90 - Ty ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function l2(l, n, r = 64) {
    const o = l.length;
    if (o < 3 || n <= 0) return l;
    const i = [];
    for (let p = 0; p < o - 1; p++) {
      const v = l[p + 1].x - l[p].x, x = l[p + 1].y - l[p].y;
      i.push(Math.sqrt(v * v + x * x));
    }
    const c = o - 2, d = [];
    for (let p = 1; p < o - 1; p++) {
      const v = l[p - 1], x = l[p], S = l[p + 1], C = i[p - 1], _ = i[p];
      if (C < 1e-10 || _ < 1e-10) {
        d.push(null);
        continue;
      }
      const b = (x.x - v.x) / C, E = (x.y - v.y) / C, k = (S.x - x.x) / _, O = (S.y - x.y) / _, R = b * O - E * k, T = b * k + E * O, N = Math.atan2(R, T);
      Math.abs(N) < 1e-6 ? d.push(null) : d.push(N);
    }
    const f = d.map((p) => {
      if (p === null) return 0;
      const v = Math.abs(p) / 2;
      return n * Math.tan(v);
    });
    for (let p = 0; p < 3; p++) for (let v = 0; v < i.length; v++) {
      const x = i[v] * 0.95, S = v > 0 ? v - 1 : null, C = v < c ? v : null, _ = S !== null ? f[S] : 0, b = C !== null ? f[C] : 0, E = _ + b;
      if (E > x && E > 1e-10) {
        const k = x / E;
        S !== null && (f[S] = Math.min(f[S], _ * k)), C !== null && (f[C] = Math.min(f[C], b * k));
      }
    }
    const m = [
      l[0]
    ];
    for (let p = 0; p < c; p++) {
      const v = p + 1, x = l[v], S = d[p];
      if (S === null) {
        m.push(x);
        continue;
      }
      const C = f[p], _ = Math.abs(S) / 2, b = Math.tan(_), E = Math.abs(b) > 1e-10 ? C / b : 0;
      if (E < 1e-6 || C < 1e-6) {
        m.push(x);
        continue;
      }
      const k = l[v - 1], O = l[v + 1], R = i[v - 1], T = i[v], N = (x.x - k.x) / R, I = (x.y - k.y) / R, A = (O.x - x.x) / T, D = (O.y - x.y) / T, U = S > 0 ? 1 : -1, B = x.x + N * -C, ne = x.y + I * -C, W = x.x + A * C, J = x.y + D * C, fe = -I * U, xe = N * U, $ = B + fe * E, K = ne + xe * E, me = B - $, ye = ne - K, ke = Math.min(Math.max(Math.ceil(Math.abs(S) * 180 / Math.PI * 2), 8), r);
      m.push({
        x: B,
        y: ne
      });
      for (let L = 1; L < ke; L++) {
        const z = L / ke, Z = S * z, Q = Math.cos(Z), te = Math.sin(Z);
        m.push({
          x: $ + me * Q - ye * te,
          y: K + me * te + ye * Q
        });
      }
      m.push({
        x: W,
        y: J
      });
    }
    return m.push(l[o - 1]), m;
  }
  function R0(l, n) {
    const r = l.length;
    if (r < 3 || n <= 0) return [];
    const o = [];
    for (let m = 0; m < r - 1; m++) {
      const p = l[m + 1].x - l[m].x, v = l[m + 1].y - l[m].y;
      o.push(Math.sqrt(p * p + v * v));
    }
    const i = r - 2, c = [];
    for (let m = 1; m < r - 1; m++) {
      const p = l[m - 1], v = l[m], x = l[m + 1], S = o[m - 1], C = o[m];
      if (S < 1e-10 || C < 1e-10) {
        c.push(null);
        continue;
      }
      const _ = (v.x - p.x) / S, b = (v.y - p.y) / S, E = (x.x - v.x) / C, k = (x.y - v.y) / C, O = _ * k - b * E, R = _ * E + b * k, T = Math.atan2(O, R);
      c.push(Math.abs(T) < 1e-6 ? null : T);
    }
    const d = c.map((m) => m === null ? 0 : n * Math.tan(Math.abs(m) / 2));
    for (let m = 0; m < 3; m++) for (let p = 0; p < o.length; p++) {
      const v = o[p] * 0.95, x = p > 0 ? p - 1 : null, S = p < i ? p : null, C = x !== null ? d[x] : 0, _ = S !== null ? d[S] : 0, b = C + _;
      if (b > v && b > 1e-10) {
        const E = v / b;
        x !== null && (d[x] = Math.min(d[x], C * E)), S !== null && (d[S] = Math.min(d[S], _ * E));
      }
    }
    const f = [];
    for (let m = 0; m < i; m++) {
      const p = c[m];
      if (p === null) continue;
      const v = Math.abs(p) / 2, x = Math.tan(v);
      if (Math.abs(x) < 1e-10) continue;
      const S = d[m] / x;
      S < n - 1e-6 && f.push({
        cornerIndex: m + 1,
        requested: n,
        actual: S
      });
    }
    return f;
  }
  function ic(l, n) {
    if (n <= 0) return 0;
    const r = R0(l, n);
    return r.length === 0 ? n : Math.min(...r.map((o) => o.actual));
  }
  function r2(l, n, r = 0, o = 64) {
    const i = r > 0 ? l2(l, r, o) : l;
    if (i.length < 2) return [];
    const c = n / 2, d = i.length, f = [], m = [];
    for (let p = 0; p < d; p++) {
      const v = i[p];
      let x, S;
      if (p === 0) {
        const C = i[1], _ = C.x - v.x, b = C.y - v.y, E = Math.sqrt(_ * _ + b * b);
        if (E < 1e-10) continue;
        x = -b / E * c, S = _ / E * c;
      } else if (p === d - 1) {
        const C = i[d - 2], _ = v.x - C.x, b = v.y - C.y, E = Math.sqrt(_ * _ + b * b);
        if (E < 1e-10) continue;
        x = -b / E * c, S = _ / E * c;
      } else {
        const C = i[p - 1], _ = i[p + 1], b = v.x - C.x, E = v.y - C.y, k = Math.sqrt(b * b + E * E), O = _.x - v.x, R = _.y - v.y, T = Math.sqrt(O * O + R * R);
        if (k < 1e-10 || T < 1e-10) continue;
        const N = -E / k, I = b / k, A = -R / T, D = O / T, U = N * A + I * D, B = Math.acos(Math.min(1, Math.max(-1, U))), ne = Math.cos(B / 2), W = ne > 1e-6 ? 1 / ne : 1, J = (N + A) / 2, fe = (I + D) / 2, xe = Math.sqrt(J * J + fe * fe);
        xe < 1e-10 ? (x = N * c, S = I * c) : (x = J / xe * c * W, S = fe / xe * c * W);
      }
      f.push({
        x: v.x + x,
        y: v.y + S
      }), m.push({
        x: v.x - x,
        y: v.y - S
      });
    }
    return m.reverse(), [
      ...f,
      ...m
    ];
  }
  class A0 {
    constructor(n, r, o, i, c, d = 0) {
      __publicField(this, "type", "create-rectangle");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.x = n, this.y = r, this.width = o, this.height = i, this.layer = c, this.datatype = d, this.description = `Create rectangle at (${n}, ${r})`;
    }
    execute(n) {
      const r = n.library.add_rectangle(this.x, this.y, this.width, this.height, this.layer, this.datatype);
      if (r) {
        this.elementId = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ie.getState().select(r);
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
        j0(o, this.layer, this.datatype);
      }
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ie.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  function Yl(l, n) {
    const r = [], o = /* @__PURE__ */ new Set();
    for (const i of n) {
      if (i.startsWith("ref:")) {
        const p = i.split(":")[1];
        if (o.has(p)) continue;
        o.add(p);
        const v = l.get_cell_ref_info(i);
        v && (r.push({
          type: "cell-ref",
          cellName: v.cell_name,
          transform: new Float64Array(v.transform)
        }), v.free());
        continue;
      }
      const c = l.get_cell_ref_info(i);
      if (c) {
        r.push({
          type: "cell-ref",
          cellName: c.cell_name,
          transform: new Float64Array(c.transform)
        }), c.free();
        continue;
      }
      const d = l.get_text_element_info(i);
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
      const f = tt.getState().pathMetadata.get(i);
      if (f) {
        r.push({
          type: "path",
          waypoints: f.waypoints.map((p) => ({
            ...p
          })),
          width: f.width,
          cornerRadius: f.cornerRadius,
          numArcPoints: f.numArcPoints,
          layer: f.layer,
          datatype: f.datatype
        });
        continue;
      }
      const m = l.get_element_info(i);
      m && (r.push({
        type: "polygon",
        vertices: new Float64Array(m.vertices),
        layer: m.layer,
        datatype: m.datatype
      }), m.free());
    }
    return r;
  }
  function Pa(l, n) {
    const r = [];
    for (const o of n) if (o.type === "cell-ref") {
      const i = l.add_cell_ref_with_transform(o.cellName, o.transform);
      i && r.push(i);
    } else if (o.type === "text") {
      const i = l.add_text(o.text, o.x, o.y, o.height, o.layer, o.datatype);
      i && r.push(i);
    } else if (o.type === "path") {
      const i = new Float64Array(o.waypoints.length * 2);
      for (let d = 0; d < o.waypoints.length; d++) i[d * 2] = o.waypoints[d].x, i[d * 2 + 1] = o.waypoints[d].y;
      const c = l.create_path_rounded(i, o.width, o.cornerRadius, o.numArcPoints, o.layer, o.datatype);
      if (c) {
        r.push(c);
        const d = o.waypoints.map((f) => ({
          ...f
        }));
        tt.getState().setPathMetadata(c, {
          waypoints: d,
          width: o.width,
          cornerRadius: o.cornerRadius,
          actualCornerRadius: ic(d, o.cornerRadius),
          numArcPoints: o.numArcPoints,
          layer: o.layer,
          datatype: o.datatype
        });
      }
    } else {
      const i = l.add_polygon(o.vertices, o.layer, o.datatype);
      i && r.push(i);
    }
    return r;
  }
  function fh(l, n) {
    if (new URLSearchParams(window.location.search).get("design") !== "true") return;
    const o = l.library.active_cell_name();
    if (o) for (const i of n) i.type === "cell-ref" && L0(i.cellName, o, Array.from(i.transform));
  }
  class pc {
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
      const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map();
      for (const p of r) {
        const v = n.library.get_cell_ref_info(p);
        if (v) {
          const x = v.cell_name, S = p.startsWith("ref:") ? p.split(":")[1] : p;
          v.free(), c.has(x) || c.set(x, /* @__PURE__ */ new Set()), c.get(x).add(S);
        }
      }
      for (const [p, v] of c) {
        const x = n.library.get_cell_ref_parents(p), S = Array.isArray(x) ? x.length : 0;
        if (S > 0 && v.size >= S) {
          o.add(p);
          for (const C of r) {
            const _ = n.library.get_cell_ref_info(C);
            _ && (_.cell_name === p && i.add(C), _.free());
          }
        }
      }
      if (i.size > 0) {
        r = r.filter((v) => !i.has(v));
        const p = [
          ...o
        ].map((v) => `"${v}"`).join(", ");
        if ($t.getState().show(`Cannot delete last reference to ${p}. Delete the cell from the Explorer instead.`, "warn", 5e3), r.length === 0) return;
      }
      this.snapshots.length === 0 && (this.snapshots = Yl(n.library, r));
      const d = new URLSearchParams(window.location.search).get("design") === "true", f = /* @__PURE__ */ new Map();
      let m = 0;
      for (const p of r) {
        const v = pr(p);
        if (v) {
          const x = `${v.file}:${v.line}`;
          f.has(x) || f.set(x, p);
        } else d && m++;
      }
      m > 0 && d && $t.getState().show(`${m} element(s) deleted from viewer only \u2014 no source tracking available. Changes may revert on reload.`, "warn", 5e3), tt.getState().removePathMetadataMany(r), n.library.remove_elements(r), this.restoredIds = [], on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ie.getState().clearSelection();
      for (const p of f.values()) VS(p);
    }
    undo(n) {
      this.restoredIds = Pa(n.library, this.snapshots), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.restoredIds.length > 0 && ie.getState().setSelection(new Set(this.restoredIds));
    }
  }
  class yc {
    constructor() {
      __publicField(this, "type", "paste-elements");
      __publicField(this, "description");
      __publicField(this, "createdIds", []);
      __publicField(this, "createdPathIds", []);
      __publicField(this, "snapshots");
      const { elements: n } = Vn.getState();
      this.snapshots = n.map((o) => o.type === "cell-ref" ? {
        type: "cell-ref",
        cellName: o.cellName,
        transform: new Float64Array(o.transform)
      } : o.type === "text" ? {
        ...o
      } : o.type === "path" ? {
        type: "path",
        waypoints: o.waypoints.map((i) => ({
          ...i
        })),
        width: o.width,
        cornerRadius: o.cornerRadius,
        numArcPoints: o.numArcPoints,
        layer: o.layer,
        datatype: o.datatype
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
      this.snapshots.length !== 0 && (this.createdIds = Pa(n.library, this.snapshots), this.createdPathIds = this.createdIds.filter((r) => tt.getState().pathMetadata.has(r)), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && ie.getState().setSelection(new Set(this.createdIds)), fh(n, this.snapshots));
    }
    undo(n) {
      tt.getState().removePathMetadataMany(this.createdPathIds), n.library.remove_elements(this.createdIds), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ie.getState().clearSelection();
    }
  }
  class bc {
    constructor(n) {
      __publicField(this, "type", "duplicate-elements");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "createdIds", []);
      __publicField(this, "createdPathIds", []);
      this.elementIds = n;
      const r = n.length;
      this.description = r === 1 ? "Duplicate element" : `Duplicate ${r} elements`;
    }
    execute(n) {
      this.snapshots.length === 0 && (this.snapshots = Yl(n.library, this.elementIds)), this.createdIds = Pa(n.library, this.snapshots), this.createdPathIds = this.createdIds.filter((r) => tt.getState().pathMetadata.has(r)), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && ie.getState().setSelection(new Set(this.createdIds)), fh(n, this.snapshots);
    }
    undo(n) {
      tt.getState().removePathMetadataMany(this.createdPathIds), n.library.remove_elements(this.createdIds), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.elementIds.length > 0 ? ie.getState().setSelection(new Set(this.elementIds)) : ie.getState().clearSelection();
    }
  }
  function a2(l, n, r) {
    if (l.type === "polygon") {
      const o = new Float64Array(l.vertices.length);
      for (let i = 0; i < o.length; i += 2) o[i] = l.vertices[i] + n, o[i + 1] = l.vertices[i + 1] + r;
      return {
        type: "polygon",
        vertices: o,
        layer: l.layer,
        datatype: l.datatype
      };
    }
    if (l.type === "path") return {
      type: "path",
      waypoints: l.waypoints.map((o) => ({
        x: o.x + n,
        y: o.y + r
      })),
      width: l.width,
      cornerRadius: l.cornerRadius,
      numArcPoints: l.numArcPoints,
      layer: l.layer,
      datatype: l.datatype
    };
    if (l.type === "cell-ref") {
      const o = new Float64Array(l.transform);
      return o[4] += n, o[5] += r, {
        type: "cell-ref",
        cellName: l.cellName,
        transform: o
      };
    }
    return {
      type: "text",
      text: l.text,
      x: l.x + n,
      y: l.y + r,
      height: l.height,
      layer: l.layer,
      datatype: l.datatype
    };
  }
  class o2 {
    constructor(n, r, o, i, c) {
      __publicField(this, "type", "create-array");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "createdIds", []);
      __publicField(this, "createdPathIds", []);
      this.elementIds = n, this.columns = r, this.rows = o, this.colSpacing = i, this.rowSpacing = c;
      const d = r * o - 1;
      this.description = d === 1 ? "Create array (1 copy)" : `Create array (${d} copies)`;
    }
    execute(n) {
      this.snapshots.length === 0 && (this.snapshots = Yl(n.library, this.elementIds)), this.createdIds = [];
      const r = [];
      for (let o = 0; o < this.rows; o++) for (let i = 0; i < this.columns; i++) {
        if (o === 0 && i === 0) continue;
        const c = i * this.colSpacing, d = o * this.rowSpacing, f = this.snapshots.map((p) => a2(p, c, d)), m = Pa(n.library, f);
        this.createdIds.push(...m), r.push(...f);
      }
      this.createdPathIds = this.createdIds.filter((o) => tt.getState().pathMetadata.has(o)), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && ie.getState().setSelection(/* @__PURE__ */ new Set([
        ...this.elementIds,
        ...this.createdIds
      ])), fh(n, r);
    }
    undo(n) {
      tt.getState().removePathMetadataMany(this.createdPathIds), n.library.remove_elements(this.createdIds), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.elementIds.length > 0 ? ie.getState().setSelection(new Set(this.elementIds)) : ie.getState().clearSelection();
    }
  }
  class T0 {
    constructor(n, r, o = 0) {
      __publicField(this, "type", "create-polygon");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.points = n, this.layer = r, this.datatype = o, this.description = `Create polygon with ${n.length / 2} vertices`;
    }
    execute(n) {
      const r = n.library.add_polygon(this.points, this.layer, this.datatype);
      r && (this.elementId = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ie.getState().select(r), j0(this.points, this.layer, this.datatype));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ie.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  function Oy(l) {
    const n = l / be / 1e3;
    return n.toFixed(n >= 10 ? 1 : n >= 1 ? 2 : 3);
  }
  function N0(l, n) {
    if (n <= 0) return;
    const r = R0(l, n);
    if (r.length === 0) return;
    const o = Oy(n), i = Math.min(...r.map((f) => f.actual)), c = Oy(i), d = r.length === 1 ? `Bend radius reduced to ${c} \xB5m at corner ${r[0].cornerIndex} (requested ${o} \xB5m)` : `Bend radius reduced at ${r.length} corners (min ${c} \xB5m, requested ${o} \xB5m)`;
    $t.getState().show(d, "warn");
  }
  class O0 {
    constructor(n, r, o, i = 0, c, d = 0, f = gc) {
      __publicField(this, "type", "create-path");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      __publicField(this, "metadata", null);
      this.points = n, this.width = r, this.layer = o, this.datatype = i, this.waypoints = c, this.cornerRadius = d, this.numArcPoints = f, this.description = `Create path with ${n.length / 2} waypoints`;
    }
    execute(n) {
      const r = n.library.create_path_rounded(this.points, this.width, this.cornerRadius, this.numArcPoints, this.layer, this.datatype);
      r && (this.elementId = r, this.metadata ? (this.metadata.actualCornerRadius = ic(this.metadata.waypoints, this.metadata.cornerRadius), tt.getState().setPathMetadata(r, this.metadata)) : this.waypoints && (this.metadata = {
        waypoints: this.waypoints,
        width: this.width,
        cornerRadius: this.cornerRadius,
        actualCornerRadius: ic(this.waypoints, this.cornerRadius),
        numArcPoints: this.numArcPoints,
        layer: this.layer,
        datatype: this.datatype
      }, tt.getState().setPathMetadata(r, this.metadata)), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ie.getState().select(r), this.waypoints && N0(this.waypoints, this.cornerRadius));
    }
    undo(n) {
      if (this.elementId) {
        this.metadata || (this.metadata = tt.getState().pathMetadata.get(this.elementId) ?? null), tt.getState().removePathMetadata(this.elementId), n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ie.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class Go {
    constructor(n, r, o, i) {
      __publicField(this, "type", "edit-path");
      __publicField(this, "description");
      __publicField(this, "currentId");
      __publicField(this, "oldMeta");
      __publicField(this, "newMeta");
      this.currentId = n, this.oldMeta = r, this.newMeta = o, this.description = i;
    }
    execute(n) {
      this.currentId = this.rebuildPath(n, this.currentId, this.newMeta);
    }
    undo(n) {
      this.currentId = this.rebuildPath(n, this.currentId, this.oldMeta);
    }
    rebuildPath(n, r, o) {
      const i = new Float64Array(o.waypoints.length * 2);
      for (let d = 0; d < o.waypoints.length; d++) i[d * 2] = o.waypoints[d].x, i[d * 2 + 1] = o.waypoints[d].y;
      n.library.remove_element(r);
      const c = n.library.create_path_rounded(i, o.width, o.cornerRadius, o.numArcPoints ?? gc, o.layer, o.datatype);
      return c ? (tt.getState().removePathMetadata(r), tt.getState().setPathMetadata(c, {
        ...o,
        actualCornerRadius: ic(o.waypoints, o.cornerRadius)
      }), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ie.getState().select(c), N0(o.waypoints, o.cornerRadius), c) : (n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), r);
    }
  }
  class s2 {
    constructor(n, r, o) {
      __publicField(this, "type", "move-elements");
      __publicField(this, "description");
      this.elementIds = n, this.deltaX = r, this.deltaY = o;
      const i = n.length;
      this.description = i === 1 ? "Move element" : `Move ${i} elements`;
    }
    execute(n) {
      n.library.translate_elements(this.elementIds, this.deltaX, this.deltaY), tt.getState().translateWaypoints(this.elementIds, this.deltaX, this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.translate_elements(this.elementIds, -this.deltaX, -this.deltaY), tt.getState().translateWaypoints(this.elementIds, -this.deltaX, -this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class i2 {
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
        const { rulers: r } = Ie.getState();
        r.has(this.ruler.id) || Ie.setState((o) => {
          const i = new Map(o.rulers);
          return i.set(this.ruler.id, this.ruler), {
            rulers: i
          };
        });
      } else {
        const r = Ie.getState().addRuler(this.ruler.start, this.ruler.end);
        this.ruler = {
          ...this.ruler,
          id: r
        };
      }
    }
    undo(n) {
      Ie.getState().removeRuler(this.ruler.id);
    }
    getRulerId() {
      return this.ruler.id;
    }
  }
  class vc {
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
      const { rulers: r, removeRulers: o } = Ie.getState(), i = this.restoredIds.length > 0 ? this.restoredIds : this.rulerIds;
      if (this.snapshots.length === 0) for (const c of i) {
        const d = r.get(c);
        d && this.snapshots.push({
          ...d
        });
      }
      o(i), this.restoredIds = [];
    }
    undo(n) {
      const r = Ie.getState().restoreRulers(this.snapshots);
      this.restoredIds = r, r.length > 0 && Ie.getState().setSelection(new Set(r));
    }
  }
  class I0 {
    constructor(n, r, o) {
      __publicField(this, "type", "move-rulers");
      __publicField(this, "description");
      this.rulerIds = n, this.deltaX = r, this.deltaY = o;
      const i = n.length;
      this.description = i === 1 ? "Move ruler" : `Move ${i} rulers`;
    }
    execute(n) {
      this.applyDelta(this.deltaX, this.deltaY);
    }
    undo(n) {
      this.applyDelta(-this.deltaX, -this.deltaY);
    }
    applyDelta(n, r) {
      Ie.setState((o) => {
        const i = new Map(o.rulers);
        for (const c of this.rulerIds) {
          const d = i.get(c);
          d && i.set(c, {
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
          rulers: i
        };
      });
    }
  }
  class D0 {
    constructor(n, r, o, i) {
      __publicField(this, "type", "move-ruler-endpoint");
      __publicField(this, "description", "Move ruler endpoint");
      this.rulerId = n, this.endpoint = r, this.oldPosition = o, this.newPosition = i;
    }
    execute(n) {
      Ie.getState().updateEndpoint(this.rulerId, this.endpoint, this.newPosition);
    }
    undo(n) {
      Ie.getState().updateEndpoint(this.rulerId, this.endpoint, this.oldPosition);
    }
  }
  class z0 {
    constructor(n, r) {
      __publicField(this, "type", "add-layer");
      __publicField(this, "description", "Add layer");
      __publicField(this, "createdLayer", null);
      this.name = n, this.color = r;
    }
    execute(n) {
      this.createdLayer ? (ve.getState().setLayer(this.createdLayer), ve.getState().setActiveLayer(this.createdLayer.id)) : this.createdLayer = ve.getState().addLayer(this.name, this.color);
    }
    undo(n) {
      this.createdLayer && ve.getState().deleteLayer(this.createdLayer.id);
    }
  }
  class hh {
    constructor(n) {
      __publicField(this, "type", "delete-layer");
      __publicField(this, "description");
      __publicField(this, "snapshot", null);
      __publicField(this, "elementSnapshots", []);
      __publicField(this, "restoredElementIds", []);
      this.layerId = n, this.description = "Delete layer";
    }
    execute(n) {
      const r = ve.getState();
      if (this.snapshot = r.getLayer(this.layerId) ?? null, !this.snapshot) return;
      const o = this.restoredElementIds.length > 0 ? this.restoredElementIds : n.library.get_elements_on_layer(this.snapshot.layerNumber, this.snapshot.datatype);
      if (this.elementSnapshots.length === 0) for (const i of o) {
        const c = n.library.get_element_info(i);
        c && (this.elementSnapshots.push({
          vertices: new Float64Array(c.vertices),
          layer: c.layer,
          datatype: c.datatype
        }), c.free());
      }
      n.library.remove_elements(o), this.restoredElementIds = [], n.library.remove_layer_color(this.snapshot.layerNumber, this.snapshot.datatype), r.deleteLayer(this.layerId), ie.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      if (!this.snapshot) return;
      ve.getState().setLayer(this.snapshot), ve.getState().setActiveLayer(this.snapshot.id), Gf(this.snapshot, n);
      const r = [];
      for (const o of this.elementSnapshots) {
        const i = n.library.add_polygon(o.vertices, o.layer, o.datatype);
        i && r.push(i);
      }
      this.restoredElementIds = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  function Gf(l, n) {
    const r = l.visible ? l.opacity : 0, [o, i, c, d] = mc(l.color, r);
    n.library.set_layer_color(l.layerNumber, l.datatype, o, i, c, d), n.library.set_layer_fill_pattern(l.layerNumber, l.datatype, Bf[l.fillPattern ?? "solid"] ?? 0);
  }
  class H0 {
    constructor(n, r) {
      __publicField(this, "type", "edit-layer");
      __publicField(this, "description");
      this.oldLayer = n, this.newLayer = r, this.description = `Edit layer "${n.name}"`;
    }
    execute(n) {
      const r = ve.getState();
      (this.oldLayer.layerNumber !== this.newLayer.layerNumber || this.oldLayer.datatype !== this.newLayer.datatype) && n.library.remove_layer_color(this.oldLayer.layerNumber, this.oldLayer.datatype), r.setLayer(this.newLayer), Gf(this.newLayer, n), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      const r = ve.getState();
      (this.oldLayer.layerNumber !== this.newLayer.layerNumber || this.oldLayer.datatype !== this.newLayer.datatype) && n.library.remove_layer_color(this.newLayer.layerNumber, this.newLayer.datatype), r.setLayer(this.oldLayer), Gf(this.oldLayer, n), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Iy {
    constructor(n, r, o) {
      __publicField(this, "type", "change-element-layer");
      __publicField(this, "description");
      __publicField(this, "originals", []);
      __publicField(this, "newIds", []);
      this.elementIds = n, this.newLayer = r, this.newDatatype = o;
      const i = n.length;
      this.description = i === 1 ? "Change element layer" : `Change layer of ${i} elements`;
    }
    execute(n) {
      if (this.originals.length === 0) for (const i of this.elementIds) {
        const c = n.library.get_text_element_info(i);
        if (c) {
          this.originals.push({
            id: i,
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
        const d = n.library.get_element_info(i);
        d && (this.originals.push({
          id: i,
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
      for (const { snapshot: i } of this.originals) {
        let c;
        "type" in i && i.type === "text" ? c = n.library.add_text(i.text, i.x, i.y, i.height, this.newLayer, this.newDatatype) : c = n.library.add_polygon(i.vertices, this.newLayer, this.newDatatype), c && o.push(c);
      }
      this.newIds = o, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), o.length > 0 && ie.getState().setSelection(new Set(o));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const r = [];
      for (const { snapshot: o } of this.originals) {
        let i;
        "type" in o && o.type === "text" ? i = n.library.add_text(o.text, o.x, o.y, o.height, o.layer, o.datatype) : i = n.library.add_polygon(o.vertices, o.layer, o.datatype), i && r.push(i);
      }
      this.newIds = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), r.length > 0 && ie.getState().setSelection(new Set(r));
    }
  }
  class c2 {
    constructor(n, r, o, i) {
      __publicField(this, "type", "resize-elements");
      __publicField(this, "description");
      __publicField(this, "originals", []);
      __publicField(this, "newIds", []);
      this.elementIds = n, this.oldBounds = r, this.newWidth = o, this.newHeight = i;
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
      const r = this.oldBounds.maxX - this.oldBounds.minX, o = this.oldBounds.maxY - this.oldBounds.minY, i = r !== 0 ? this.newWidth / r : 1, c = o !== 0 ? this.newHeight / o : 1, d = this.newIds.length > 0 ? this.newIds : this.elementIds;
      n.library.remove_elements(d);
      const f = [];
      for (const { snapshot: m } of this.originals) {
        const p = new Float64Array(m.vertices.length);
        for (let x = 0; x < m.vertices.length; x += 2) p[x] = this.oldBounds.minX + (m.vertices[x] - this.oldBounds.minX) * i, p[x + 1] = this.oldBounds.minY + (m.vertices[x + 1] - this.oldBounds.minY) * c;
        const v = n.library.add_polygon(p, m.layer, m.datatype);
        v && f.push(v);
      }
      this.newIds = f, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), f.length > 0 && ie.getState().setSelection(new Set(f));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const r = [];
      for (const { snapshot: o } of this.originals) {
        const i = n.library.add_polygon(o.vertices, o.layer, o.datatype);
        i && r.push(i);
      }
      this.newIds = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), r.length > 0 && ie.getState().setSelection(new Set(r));
    }
  }
  class qd {
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
      r && (this.currentId = r, ie.getState().setSelection(/* @__PURE__ */ new Set([
        r
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      if (!this.original) return;
      n.library.remove_element(this.currentId);
      const r = n.library.add_polygon(this.original.vertices, this.original.layer, this.original.datatype);
      r && (this.currentId = r, ie.getState().setSelection(/* @__PURE__ */ new Set([
        r
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class u2 {
    constructor(n, r, o, i, c) {
      __publicField(this, "type", "move-elements-to");
      __publicField(this, "description");
      __publicField(this, "deltaX");
      __publicField(this, "deltaY");
      __publicField(this, "currentIds");
      this.currentIds = [
        ...n
      ], this.deltaX = i - r, this.deltaY = c - o, this.description = n.length === 1 ? "Move element" : `Move ${n.length} elements`;
    }
    execute(n) {
      n.library.translate_elements(this.currentIds, this.deltaX, this.deltaY), tt.getState().translateWaypoints(this.currentIds, this.deltaX, this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.translate_elements(this.currentIds, -this.deltaX, -this.deltaY), tt.getState().translateWaypoints(this.currentIds, -this.deltaX, -this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Gd {
    constructor(n, r, o, i) {
      __publicField(this, "type", "set-instance-transform");
      __publicField(this, "description");
      this.refId = n, this.oldTransform = r, this.newTransform = o, this.description = i ?? "Set instance transform";
    }
    execute(n) {
      n.library.set_cell_ref_transform(this.refId, this.newTransform), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_cell_ref_transform(this.refId, this.oldTransform), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class d2 {
    constructor(n, r, o) {
      __publicField(this, "type", "set-instance-array");
      __publicField(this, "description");
      this.refId = n, this.oldParams = r, this.newParams = o, this.description = "Set instance array";
    }
    execute(n) {
      this.applyParams(n, this.newParams);
    }
    undo(n) {
      this.applyParams(n, this.oldParams);
    }
    applyParams(n, r) {
      r && (r.columns > 1 || r.rows > 1) ? n.library.set_cell_ref_array(this.refId, r.columns, r.rows, r.colSpacing, r.rowSpacing) : n.library.set_cell_ref_array(this.refId, 1, 1, 0, 0), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  function on(l) {
    const n = l.get_cell_tree();
    n && de.getState().setCellTree(n);
  }
  class mh {
    constructor(n) {
      __publicField(this, "type", "add-cell");
      __publicField(this, "description");
      __publicField(this, "cellName");
      this.cellName = n, this.description = `Add cell "${n}"`;
    }
    execute(n) {
      n.library.add_cell(this.cellName), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.remove_cell(this.cellName), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class gh {
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
        const i = n.library.get_cell_ref_parents(this.cellName);
        Array.isArray(i) && (this.parentRefs = i.map((f) => ({
          parent: f.parent,
          transform: new Float64Array(f.transform)
        })));
        const c = n.library.active_cell_name();
        n.library.set_active_cell(this.cellName);
        const d = n.library.get_all_ids();
        d.length > 0 && (this.elementSnapshots = Yl(n.library, d)), c && n.library.set_active_cell(c);
      }
      n.library.remove_cell_cascade(this.cellName), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), new URLSearchParams(window.location.search).get("design") === "true" && $S(this.cellName);
    }
    undo(n) {
      n.library.add_cell(this.cellName);
      const r = n.library.active_cell_name();
      n.library.set_active_cell(this.cellName), n.library.set_cell_origin(this.cellOrigin[0], this.cellOrigin[1]), this.elementSnapshots.length > 0 && Pa(n.library, this.elementSnapshots), r && n.library.set_active_cell(r);
      for (const o of this.parentRefs) n.library.add_cell_ref_to_with_transform(o.parent, this.cellName, o.transform);
      on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class f2 {
    constructor(n, r, o, i) {
      __publicField(this, "type", "set-cell-origin");
      __publicField(this, "description", "Set cell origin");
      this.oldX = n, this.oldY = r, this.newX = o, this.newY = i;
    }
    execute(n) {
      n.library.set_cell_origin(this.newX, this.newY), n.renderer.set_crosshair_origin(this.newX, this.newY), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_cell_origin(this.oldX, this.oldY), n.renderer.set_crosshair_origin(this.oldX, this.oldY), n.renderer.mark_dirty();
    }
  }
  class Y0 {
    constructor(n, r) {
      __publicField(this, "type", "rename-cell");
      __publicField(this, "description");
      this.oldName = n, this.newName = r, this.description = `Rename cell "${n}" to "${r}"`;
    }
    execute(n) {
      const r = de.getState();
      r.activeCell === this.oldName && r.setActiveCell(this.newName), n.library.rename_cell(this.oldName, this.newName), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      const r = de.getState();
      r.activeCell === this.newName && r.setActiveCell(this.oldName), n.library.rename_cell(this.newName, this.oldName), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class U0 {
    constructor(n, r, o) {
      __publicField(this, "type", "add-cell-ref");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.cellName = n, this.x = r, this.y = o, this.description = `Place instance of "${n}"`;
    }
    execute(n) {
      const r = n.library.add_cell_ref(this.cellName, this.x, this.y);
      if (r) {
        this.elementId = r, on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const o = n.library.get_element_index(r);
        if (o >= 0 && ie.getState().select(`ref:${o}:0`), new URLSearchParams(window.location.search).get("design") === "true") {
          const c = n.library.active_cell_name();
          c && L0(this.cellName, c, [
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
        n.library.remove_element(this.elementId), on(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ie.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
  }
  function an(l) {
    return Math.round(l / be) * be;
  }
  function xc() {
    const { activeLayerId: l, layers: n } = ve.getState(), r = n.get(l);
    return {
      layerNumber: (r == null ? void 0 : r.layerNumber) ?? 1,
      datatype: (r == null ? void 0 : r.datatype) ?? 0
    };
  }
  function wc(l) {
    const { zoom: n, offset: r } = Ue.getState(), o = l.getBoundingClientRect(), i = (o.width / 2 - r.x) / n, c = (o.height / 2 - r.y) / n, d = o.width / n, f = o.height / n, m = Math.max(an(d * 0.1 / 2), be), p = Math.max(an(f * 0.1 / 2), be);
    return {
      centerX: i,
      centerY: c,
      halfW: m,
      halfH: p
    };
  }
  function B0(l, n, r) {
    const { centerX: o, centerY: i, halfW: c, halfH: d } = wc(r), f = c * 2, m = d * 2, p = an(o - c), v = an(i - d), { layerNumber: x, datatype: S } = xc(), C = new A0(p, v, f, m, x, S);
    ue.getState().execute(C, {
      library: l,
      renderer: n
    });
  }
  function X0(l, n, r) {
    const { centerX: o, centerY: i, halfW: c, halfH: d } = wc(r), f = new Float64Array([
      an(o - c),
      an(i - d),
      an(o + c),
      an(i - d),
      an(o),
      an(i + d)
    ]), { layerNumber: m, datatype: p } = xc(), v = new T0(f, m, p);
    ue.getState().execute(v, {
      library: l,
      renderer: n
    });
  }
  function V0(l, n, r) {
    const { centerX: o, centerY: i, halfH: c } = wc(r), d = Math.max(an(c), be), { layerNumber: f, datatype: m } = xc(), p = new q0("Text", an(o), an(i), d, f, m);
    ue.getState().execute(p, {
      library: l,
      renderer: n
    }), we.getState().bumpSyncGeneration();
  }
  function $0(l, n, r) {
    const { centerX: o, centerY: i, halfW: c } = wc(r), d = an(o - c), f = an(o + c), m = an(i), p = new Float64Array([
      d,
      m,
      f,
      m
    ]), v = [
      {
        x: d,
        y: m
      },
      {
        x: f,
        y: m
      }
    ], { layerNumber: x, datatype: S } = xc(), { width: C, cornerRadius: _, numArcPoints: b } = tt.getState(), E = new O0(p, C, x, S, v, _, b);
    ue.getState().execute(E, {
      library: l,
      renderer: n
    });
  }
  class q0 {
    constructor(n, r, o, i, c, d = 0) {
      __publicField(this, "type", "create-text");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.text = n, this.x = r, this.y = o, this.height = i, this.layer = c, this.datatype = d, this.description = `Create text "${n.slice(0, 20)}" at (${r}, ${o})`;
    }
    execute(n) {
      const r = n.library.add_text(this.text, this.x, this.y, this.height, this.layer, this.datatype);
      r && (this.elementId = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ie.getState().select(r));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = ie.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class h2 {
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
  class m2 {
    constructor(n, r, o, i, c) {
      __publicField(this, "type", "move-text");
      __publicField(this, "description", "Move text");
      this.elementId = n, this.oldX = r, this.oldY = o, this.newX = i, this.newY = c;
    }
    execute(n) {
      n.library.set_text_position(this.elementId, this.newX, this.newY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_text_position(this.elementId, this.oldX, this.oldY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class g2 {
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
  class G0 {
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
      this.resultIds.length > 0 ? ie.getState().selectAll(this.resultIds) : ie.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      this.resultIds.length > 0 && (n.library.remove_elements(this.resultIds), this.resultIds = []);
      const r = [];
      for (const o of this.snapshots) {
        const i = o.snapshot, c = n.library.add_text(i.text, i.x, i.y, i.height, i.layer, i.datatype);
        c && (o.currentId = c, r.push(c));
      }
      r.length > 0 && ie.getState().selectAll(r), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class P0 {
    constructor(n, r, o) {
      __publicField(this, "type", "align-elements");
      __publicField(this, "description");
      __publicField(this, "deltas", []);
      this.selectedIds = n, this.referenceId = r, this.alignType = o, this.description = `Align elements (${o})`;
    }
    execute(n) {
      this.deltas.length === 0 && (this.deltas = DS(n.library, this.selectedIds, this.referenceId, this.alignType));
      for (const r of this.deltas) n.library.translate_elements(r.ids, r.dx, r.dy), tt.getState().translateWaypoints(r.ids, r.dx, r.dy);
      n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      for (let r = this.deltas.length - 1; r >= 0; r--) {
        const o = this.deltas[r];
        n.library.translate_elements(o.ids, -o.dx, -o.dy), tt.getState().translateWaypoints(o.ids, -o.dx, -o.dy);
      }
      n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Z0 {
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
      this.snapshots.length === 0 && (this.snapshots = Yl(n.library, this.currentIds)), this.resultIds = n.library.boolean_operation(this.currentIds, this.operation, this.currentBaseId), this.resultIds.length > 0 ? ie.getState().selectAll(this.resultIds) : ie.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      this.resultIds.length > 0 && n.library.remove_elements(this.resultIds);
      const r = Pa(n.library, this.snapshots), o = this.currentIds.indexOf(this.currentBaseId);
      this.currentIds = r, o >= 0 && o < r.length && (this.currentBaseId = r[o]), this.resultIds = [], ie.getState().selectAll(r), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class p2 {
    constructor(n) {
      __publicField(this, "type", "add-image");
      __publicField(this, "description", "Insert image");
      this.entry = n;
    }
    execute(n) {
      Vt.getState().addImage(this.entry), ie.getState().select(fs(this.entry.id));
    }
    undo(n) {
      Vt.getState().removeImage(this.entry.id), ie.getState().clearSelection();
    }
  }
  class K0 {
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
      const r = Vt.getState();
      if (this.snapshots.length === 0) for (const o of this.imageIds) {
        const i = r.images.get(o);
        i && this.snapshots.push(i);
      }
      for (const o of this.imageIds) Vt.getState().removeImage(o);
      ie.getState().clearSelection();
    }
    undo(n) {
      const r = [];
      for (const o of this.snapshots) Vt.getState().addImage(o), r.push(fs(o.id));
      r.length > 0 && ie.getState().selectAll(r);
    }
  }
  class y2 {
    constructor(n, r, o, i, c) {
      __publicField(this, "type", "move-image");
      __publicField(this, "description", "Move image");
      this.imageId = n, this.oldX = r, this.oldY = o, this.newX = i, this.newY = c;
    }
    execute(n) {
      Vt.getState().updateImage(this.imageId, {
        x: this.newX,
        y: this.newY
      });
    }
    undo(n) {
      Vt.getState().updateImage(this.imageId, {
        x: this.oldX,
        y: this.oldY
      });
    }
  }
  class b2 {
    constructor(n, r, o) {
      __publicField(this, "type", "move-images");
      __publicField(this, "description", "Move images");
      this.imageIds = n, this.deltaX = r, this.deltaY = o;
    }
    execute(n) {
      const r = Vt.getState();
      for (const o of this.imageIds) {
        const i = Gr(o), c = r.images.get(i);
        c && r.updateImage(i, {
          x: c.x + this.deltaX,
          y: c.y + this.deltaY
        });
      }
    }
    undo(n) {
      const r = Vt.getState();
      for (const o of this.imageIds) {
        const i = Gr(o), c = r.images.get(i);
        c && r.updateImage(i, {
          x: c.x - this.deltaX,
          y: c.y - this.deltaY
        });
      }
    }
  }
  class v2 {
    constructor(n, r, o, i, c) {
      __publicField(this, "type", "resize-image");
      __publicField(this, "description", "Resize image");
      this.imageId = n, this.oldWidth = r, this.oldHeight = o, this.newWidth = i, this.newHeight = c;
    }
    execute(n) {
      Vt.getState().updateImage(this.imageId, {
        width: this.newWidth,
        height: this.newHeight
      });
    }
    undo(n) {
      Vt.getState().updateImage(this.imageId, {
        width: this.oldWidth,
        height: this.oldHeight
      });
    }
  }
  const dn = Mt()((l) => ({
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
  })), Pf = Mt()((l, n) => ({
    stack: [],
    claim: (r) => l((o) => ({
      stack: o.stack.includes(r) ? o.stack : [
        ...o.stack,
        r
      ]
    })),
    release: (r) => l((o) => ({
      stack: o.stack.filter((i) => i !== r)
    })),
    isCanvasActive: () => n().stack.length === 0
  })), rn = Mt((l) => ({
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
  function F0(l) {
    var n, r, o = "";
    if (typeof l == "string" || typeof l == "number") o += l;
    else if (typeof l == "object") if (Array.isArray(l)) {
      var i = l.length;
      for (n = 0; n < i; n++) l[n] && (r = F0(l[n])) && (o && (o += " "), o += r);
    } else for (r in l) l[r] && (o && (o += " "), o += r);
    return o;
  }
  function x2() {
    for (var l, n, r = 0, o = "", i = arguments.length; r < i; r++) (l = arguments[r]) && (n = F0(l)) && (o && (o += " "), o += n);
    return o;
  }
  const ph = "-", w2 = (l) => {
    const n = C2(l), { conflictingClassGroups: r, conflictingClassGroupModifiers: o } = l;
    return {
      getClassGroupId: (d) => {
        const f = d.split(ph);
        return f[0] === "" && f.length !== 1 && f.shift(), Q0(f, n) || S2(d);
      },
      getConflictingClassGroupIds: (d, f) => {
        const m = r[d] || [];
        return f && o[d] ? [
          ...m,
          ...o[d]
        ] : m;
      }
    };
  }, Q0 = (l, n) => {
    var _a;
    if (l.length === 0) return n.classGroupId;
    const r = l[0], o = n.nextPart.get(r), i = o ? Q0(l.slice(1), o) : void 0;
    if (i) return i;
    if (n.validators.length === 0) return;
    const c = l.join(ph);
    return (_a = n.validators.find(({ validator: d }) => d(c))) == null ? void 0 : _a.classGroupId;
  }, Dy = /^\[(.+)\]$/, S2 = (l) => {
    if (Dy.test(l)) {
      const n = Dy.exec(l)[1], r = n == null ? void 0 : n.substring(0, n.indexOf(":"));
      if (r) return "arbitrary.." + r;
    }
  }, C2 = (l) => {
    const { theme: n, prefix: r } = l, o = {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    };
    return _2(Object.entries(l.classGroups), r).forEach(([c, d]) => {
      Zf(d, o, c, n);
    }), o;
  }, Zf = (l, n, r, o) => {
    l.forEach((i) => {
      if (typeof i == "string") {
        const c = i === "" ? n : zy(n, i);
        c.classGroupId = r;
        return;
      }
      if (typeof i == "function") {
        if (E2(i)) {
          Zf(i(o), n, r, o);
          return;
        }
        n.validators.push({
          validator: i,
          classGroupId: r
        });
        return;
      }
      Object.entries(i).forEach(([c, d]) => {
        Zf(d, zy(n, c), r, o);
      });
    });
  }, zy = (l, n) => {
    let r = l;
    return n.split(ph).forEach((o) => {
      r.nextPart.has(o) || r.nextPart.set(o, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      }), r = r.nextPart.get(o);
    }), r;
  }, E2 = (l) => l.isThemeGetter, _2 = (l, n) => n ? l.map(([r, o]) => {
    const i = o.map((c) => typeof c == "string" ? n + c : typeof c == "object" ? Object.fromEntries(Object.entries(c).map(([d, f]) => [
      n + d,
      f
    ])) : c);
    return [
      r,
      i
    ];
  }) : l, k2 = (l) => {
    if (l < 1) return {
      get: () => {
      },
      set: () => {
      }
    };
    let n = 0, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
    const i = (c, d) => {
      r.set(c, d), n++, n > l && (n = 0, o = r, r = /* @__PURE__ */ new Map());
    };
    return {
      get(c) {
        let d = r.get(c);
        if (d !== void 0) return d;
        if ((d = o.get(c)) !== void 0) return i(c, d), d;
      },
      set(c, d) {
        r.has(c) ? r.set(c, d) : i(c, d);
      }
    };
  }, W0 = "!", M2 = (l) => {
    const { separator: n, experimentalParseClassName: r } = l, o = n.length === 1, i = n[0], c = n.length, d = (f) => {
      const m = [];
      let p = 0, v = 0, x;
      for (let E = 0; E < f.length; E++) {
        let k = f[E];
        if (p === 0) {
          if (k === i && (o || f.slice(E, E + c) === n)) {
            m.push(f.slice(v, E)), v = E + c;
            continue;
          }
          if (k === "/") {
            x = E;
            continue;
          }
        }
        k === "[" ? p++ : k === "]" && p--;
      }
      const S = m.length === 0 ? f : f.substring(v), C = S.startsWith(W0), _ = C ? S.substring(1) : S, b = x && x > v ? x - v : void 0;
      return {
        modifiers: m,
        hasImportantModifier: C,
        baseClassName: _,
        maybePostfixModifierPosition: b
      };
    };
    return r ? (f) => r({
      className: f,
      parseClassName: d
    }) : d;
  }, j2 = (l) => {
    if (l.length <= 1) return l;
    const n = [];
    let r = [];
    return l.forEach((o) => {
      o[0] === "[" ? (n.push(...r.sort(), o), r = []) : r.push(o);
    }), n.push(...r.sort()), n;
  }, L2 = (l) => ({
    cache: k2(l.cacheSize),
    parseClassName: M2(l),
    ...w2(l)
  }), R2 = /\s+/, A2 = (l, n) => {
    const { parseClassName: r, getClassGroupId: o, getConflictingClassGroupIds: i } = n, c = [], d = l.trim().split(R2);
    let f = "";
    for (let m = d.length - 1; m >= 0; m -= 1) {
      const p = d[m], { modifiers: v, hasImportantModifier: x, baseClassName: S, maybePostfixModifierPosition: C } = r(p);
      let _ = !!C, b = o(_ ? S.substring(0, C) : S);
      if (!b) {
        if (!_) {
          f = p + (f.length > 0 ? " " + f : f);
          continue;
        }
        if (b = o(S), !b) {
          f = p + (f.length > 0 ? " " + f : f);
          continue;
        }
        _ = false;
      }
      const E = j2(v).join(":"), k = x ? E + W0 : E, O = k + b;
      if (c.includes(O)) continue;
      c.push(O);
      const R = i(b, _);
      for (let T = 0; T < R.length; ++T) {
        const N = R[T];
        c.push(k + N);
      }
      f = p + (f.length > 0 ? " " + f : f);
    }
    return f;
  };
  function T2() {
    let l = 0, n, r, o = "";
    for (; l < arguments.length; ) (n = arguments[l++]) && (r = J0(n)) && (o && (o += " "), o += r);
    return o;
  }
  const J0 = (l) => {
    if (typeof l == "string") return l;
    let n, r = "";
    for (let o = 0; o < l.length; o++) l[o] && (n = J0(l[o])) && (r && (r += " "), r += n);
    return r;
  };
  function N2(l, ...n) {
    let r, o, i, c = d;
    function d(m) {
      const p = n.reduce((v, x) => x(v), l());
      return r = L2(p), o = r.cache.get, i = r.cache.set, c = f, f(m);
    }
    function f(m) {
      const p = o(m);
      if (p) return p;
      const v = A2(m, r);
      return i(m, v), v;
    }
    return function() {
      return c(T2.apply(null, arguments));
    };
  }
  const kt = (l) => {
    const n = (r) => r[l] || [];
    return n.isThemeGetter = true, n;
  }, e1 = /^\[(?:([a-z-]+):)?(.+)\]$/i, O2 = /^\d+\/\d+$/, I2 = /* @__PURE__ */ new Set([
    "px",
    "full",
    "screen"
  ]), D2 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, z2 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, H2 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Y2 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, U2 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Il = (l) => qa(l) || I2.has(l) || O2.test(l), dr = (l) => Za(l, "length", Z2), qa = (l) => !!l && !Number.isNaN(Number(l)), Pd = (l) => Za(l, "number", qa), Po = (l) => !!l && Number.isInteger(Number(l)), B2 = (l) => l.endsWith("%") && qa(l.slice(0, -1)), $e = (l) => e1.test(l), fr = (l) => D2.test(l), X2 = /* @__PURE__ */ new Set([
    "length",
    "size",
    "percentage"
  ]), V2 = (l) => Za(l, X2, t1), $2 = (l) => Za(l, "position", t1), q2 = /* @__PURE__ */ new Set([
    "image",
    "url"
  ]), G2 = (l) => Za(l, q2, F2), P2 = (l) => Za(l, "", K2), Zo = () => true, Za = (l, n, r) => {
    const o = e1.exec(l);
    return o ? o[1] ? typeof n == "string" ? o[1] === n : n.has(o[1]) : r(o[2]) : false;
  }, Z2 = (l) => z2.test(l) && !H2.test(l), t1 = () => false, K2 = (l) => Y2.test(l), F2 = (l) => U2.test(l), Q2 = () => {
    const l = kt("colors"), n = kt("spacing"), r = kt("blur"), o = kt("brightness"), i = kt("borderColor"), c = kt("borderRadius"), d = kt("borderSpacing"), f = kt("borderWidth"), m = kt("contrast"), p = kt("grayscale"), v = kt("hueRotate"), x = kt("invert"), S = kt("gap"), C = kt("gradientColorStops"), _ = kt("gradientColorStopPositions"), b = kt("inset"), E = kt("margin"), k = kt("opacity"), O = kt("padding"), R = kt("saturate"), T = kt("scale"), N = kt("sepia"), I = kt("skew"), A = kt("space"), D = kt("translate"), U = () => [
      "auto",
      "contain",
      "none"
    ], B = () => [
      "auto",
      "hidden",
      "clip",
      "visible",
      "scroll"
    ], ne = () => [
      "auto",
      $e,
      n
    ], W = () => [
      $e,
      n
    ], J = () => [
      "",
      Il,
      dr
    ], fe = () => [
      "auto",
      qa,
      $e
    ], xe = () => [
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
    ], K = () => [
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
    ], me = () => [
      "start",
      "end",
      "center",
      "between",
      "around",
      "evenly",
      "stretch"
    ], ye = () => [
      "",
      "0",
      $e
    ], ke = () => [
      "auto",
      "avoid",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "column"
    ], L = () => [
      qa,
      $e
    ];
    return {
      cacheSize: 500,
      separator: ":",
      theme: {
        colors: [
          Zo
        ],
        spacing: [
          Il,
          dr
        ],
        blur: [
          "none",
          "",
          fr,
          $e
        ],
        brightness: L(),
        borderColor: [
          l
        ],
        borderRadius: [
          "none",
          "",
          "full",
          fr,
          $e
        ],
        borderSpacing: W(),
        borderWidth: J(),
        contrast: L(),
        grayscale: ye(),
        hueRotate: L(),
        invert: ye(),
        gap: W(),
        gradientColorStops: [
          l
        ],
        gradientColorStopPositions: [
          B2,
          dr
        ],
        inset: ne(),
        margin: ne(),
        opacity: L(),
        padding: W(),
        saturate: L(),
        scale: L(),
        sepia: ye(),
        skew: L(),
        space: W(),
        translate: W()
      },
      classGroups: {
        aspect: [
          {
            aspect: [
              "auto",
              "square",
              "video",
              $e
            ]
          }
        ],
        container: [
          "container"
        ],
        columns: [
          {
            columns: [
              fr
            ]
          }
        ],
        "break-after": [
          {
            "break-after": ke()
          }
        ],
        "break-before": [
          {
            "break-before": ke()
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
              ...xe(),
              $e
            ]
          }
        ],
        overflow: [
          {
            overflow: B()
          }
        ],
        "overflow-x": [
          {
            "overflow-x": B()
          }
        ],
        "overflow-y": [
          {
            "overflow-y": B()
          }
        ],
        overscroll: [
          {
            overscroll: U()
          }
        ],
        "overscroll-x": [
          {
            "overscroll-x": U()
          }
        ],
        "overscroll-y": [
          {
            "overscroll-y": U()
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
              b
            ]
          }
        ],
        "inset-x": [
          {
            "inset-x": [
              b
            ]
          }
        ],
        "inset-y": [
          {
            "inset-y": [
              b
            ]
          }
        ],
        start: [
          {
            start: [
              b
            ]
          }
        ],
        end: [
          {
            end: [
              b
            ]
          }
        ],
        top: [
          {
            top: [
              b
            ]
          }
        ],
        right: [
          {
            right: [
              b
            ]
          }
        ],
        bottom: [
          {
            bottom: [
              b
            ]
          }
        ],
        left: [
          {
            left: [
              b
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
              Po,
              $e
            ]
          }
        ],
        basis: [
          {
            basis: ne()
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
              $e
            ]
          }
        ],
        grow: [
          {
            grow: ye()
          }
        ],
        shrink: [
          {
            shrink: ye()
          }
        ],
        order: [
          {
            order: [
              "first",
              "last",
              "none",
              Po,
              $e
            ]
          }
        ],
        "grid-cols": [
          {
            "grid-cols": [
              Zo
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
                  Po,
                  $e
                ]
              },
              $e
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
              Zo
            ]
          }
        ],
        "row-start-end": [
          {
            row: [
              "auto",
              {
                span: [
                  Po,
                  $e
                ]
              },
              $e
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
              $e
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
              $e
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
              ...me()
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
              ...me(),
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
              ...me(),
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
              O
            ]
          }
        ],
        px: [
          {
            px: [
              O
            ]
          }
        ],
        py: [
          {
            py: [
              O
            ]
          }
        ],
        ps: [
          {
            ps: [
              O
            ]
          }
        ],
        pe: [
          {
            pe: [
              O
            ]
          }
        ],
        pt: [
          {
            pt: [
              O
            ]
          }
        ],
        pr: [
          {
            pr: [
              O
            ]
          }
        ],
        pb: [
          {
            pb: [
              O
            ]
          }
        ],
        pl: [
          {
            pl: [
              O
            ]
          }
        ],
        m: [
          {
            m: [
              E
            ]
          }
        ],
        mx: [
          {
            mx: [
              E
            ]
          }
        ],
        my: [
          {
            my: [
              E
            ]
          }
        ],
        ms: [
          {
            ms: [
              E
            ]
          }
        ],
        me: [
          {
            me: [
              E
            ]
          }
        ],
        mt: [
          {
            mt: [
              E
            ]
          }
        ],
        mr: [
          {
            mr: [
              E
            ]
          }
        ],
        mb: [
          {
            mb: [
              E
            ]
          }
        ],
        ml: [
          {
            ml: [
              E
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
              $e,
              n
            ]
          }
        ],
        "min-w": [
          {
            "min-w": [
              $e,
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
              $e,
              n,
              "none",
              "full",
              "min",
              "max",
              "fit",
              "prose",
              {
                screen: [
                  fr
                ]
              },
              fr
            ]
          }
        ],
        h: [
          {
            h: [
              $e,
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
              $e,
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
              $e,
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
              $e,
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
              fr,
              dr
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
              Pd
            ]
          }
        ],
        "font-family": [
          {
            font: [
              Zo
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
              $e
            ]
          }
        ],
        "line-clamp": [
          {
            "line-clamp": [
              "none",
              qa,
              Pd
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
              Il,
              $e
            ]
          }
        ],
        "list-image": [
          {
            "list-image": [
              "none",
              $e
            ]
          }
        ],
        "list-style-type": [
          {
            list: [
              "none",
              "disc",
              "decimal",
              $e
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
              k
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
              k
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
              Il,
              dr
            ]
          }
        ],
        "underline-offset": [
          {
            "underline-offset": [
              "auto",
              Il,
              $e
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
            indent: W()
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
              $e
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
              $e
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
              k
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
              ...xe(),
              $2
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
              V2
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
              G2
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
              _
            ]
          }
        ],
        "gradient-via-pos": [
          {
            via: [
              _
            ]
          }
        ],
        "gradient-to-pos": [
          {
            to: [
              _
            ]
          }
        ],
        "gradient-from": [
          {
            from: [
              C
            ]
          }
        ],
        "gradient-via": [
          {
            via: [
              C
            ]
          }
        ],
        "gradient-to": [
          {
            to: [
              C
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
              k
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
              k
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
              i
            ]
          }
        ],
        "border-color-x": [
          {
            "border-x": [
              i
            ]
          }
        ],
        "border-color-y": [
          {
            "border-y": [
              i
            ]
          }
        ],
        "border-color-s": [
          {
            "border-s": [
              i
            ]
          }
        ],
        "border-color-e": [
          {
            "border-e": [
              i
            ]
          }
        ],
        "border-color-t": [
          {
            "border-t": [
              i
            ]
          }
        ],
        "border-color-r": [
          {
            "border-r": [
              i
            ]
          }
        ],
        "border-color-b": [
          {
            "border-b": [
              i
            ]
          }
        ],
        "border-color-l": [
          {
            "border-l": [
              i
            ]
          }
        ],
        "divide-color": [
          {
            divide: [
              i
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
              Il,
              $e
            ]
          }
        ],
        "outline-w": [
          {
            outline: [
              Il,
              dr
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
            ring: J()
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
              k
            ]
          }
        ],
        "ring-offset-w": [
          {
            "ring-offset": [
              Il,
              dr
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
              fr,
              P2
            ]
          }
        ],
        "shadow-color": [
          {
            shadow: [
              Zo
            ]
          }
        ],
        opacity: [
          {
            opacity: [
              k
            ]
          }
        ],
        "mix-blend": [
          {
            "mix-blend": [
              ...K(),
              "plus-lighter",
              "plus-darker"
            ]
          }
        ],
        "bg-blend": [
          {
            "bg-blend": K()
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
              fr,
              $e
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
              x
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
              N
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
              x
            ]
          }
        ],
        "backdrop-opacity": [
          {
            "backdrop-opacity": [
              k
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
              N
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
              $e
            ]
          }
        ],
        duration: [
          {
            duration: L()
          }
        ],
        ease: [
          {
            ease: [
              "linear",
              "in",
              "out",
              "in-out",
              $e
            ]
          }
        ],
        delay: [
          {
            delay: L()
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
              $e
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
              Po,
              $e
            ]
          }
        ],
        "translate-x": [
          {
            "translate-x": [
              D
            ]
          }
        ],
        "translate-y": [
          {
            "translate-y": [
              D
            ]
          }
        ],
        "skew-x": [
          {
            "skew-x": [
              I
            ]
          }
        ],
        "skew-y": [
          {
            "skew-y": [
              I
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
              $e
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
              $e
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
            "scroll-m": W()
          }
        ],
        "scroll-mx": [
          {
            "scroll-mx": W()
          }
        ],
        "scroll-my": [
          {
            "scroll-my": W()
          }
        ],
        "scroll-ms": [
          {
            "scroll-ms": W()
          }
        ],
        "scroll-me": [
          {
            "scroll-me": W()
          }
        ],
        "scroll-mt": [
          {
            "scroll-mt": W()
          }
        ],
        "scroll-mr": [
          {
            "scroll-mr": W()
          }
        ],
        "scroll-mb": [
          {
            "scroll-mb": W()
          }
        ],
        "scroll-ml": [
          {
            "scroll-ml": W()
          }
        ],
        "scroll-p": [
          {
            "scroll-p": W()
          }
        ],
        "scroll-px": [
          {
            "scroll-px": W()
          }
        ],
        "scroll-py": [
          {
            "scroll-py": W()
          }
        ],
        "scroll-ps": [
          {
            "scroll-ps": W()
          }
        ],
        "scroll-pe": [
          {
            "scroll-pe": W()
          }
        ],
        "scroll-pt": [
          {
            "scroll-pt": W()
          }
        ],
        "scroll-pr": [
          {
            "scroll-pr": W()
          }
        ],
        "scroll-pb": [
          {
            "scroll-pb": W()
          }
        ],
        "scroll-pl": [
          {
            "scroll-pl": W()
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
              $e
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
              Il,
              dr,
              Pd
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
  }, W2 = N2(Q2);
  function Y(...l) {
    return W2(x2(l));
  }
  const Hy = 38, Oi = 16;
  function yr(l) {
    const n = l.getBoundingClientRect(), { zenMode: r, explorerCollapsed: o, sidebarCollapsed: i, explorerWidth: c, sidebarWidth: d } = he.getState();
    let f = 0, m = 0;
    r || (f = o ? Hy + Oi : c + Oi, m = i ? Hy + Oi : d + Oi);
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
  const J2 = typeof navigator < "u" && /Mac|iPod|iPhone|iPad/.test(navigator.platform), ze = {
    mod: J2 ? "\u2318" : "Ctrl",
    shift: "\u21E7",
    backspace: "\u232B"
  };
  function gs() {
    const l = document.getElementById("rosette-canvas"), { library: n } = we.getState();
    if (!l || !n) return;
    const r = n.get_all_bounds(), o = r ? {
      minX: r[0],
      minY: r[1],
      maxX: r[2],
      maxY: r[3]
    } : null, i = yr(l);
    i.width <= 0 || i.height <= 0 || Ue.getState().zoomToFit(o, i.width, i.height, i.screenCenter);
  }
  function qr(l, n) {
    const r = ie.getState().selectedIds;
    if (r.size === 0) return;
    const o = l.get_bounds_for_ids([
      ...r
    ]);
    if (!o) return;
    const i = {
      minX: o[0],
      minY: o[1],
      maxX: o[2],
      maxY: o[3]
    }, c = yr(n);
    Ue.getState().centerOnBounds(i, c.width, c.height, c.screenCenter);
  }
  const eC = /* @__PURE__ */ new Set([
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
  ]);
  function tC(l, n, r) {
    const o = Ue((v) => v.zoomAt), i = Ue((v) => v.pan), c = Ue((v) => v.zoomToSelected), d = Gt((v) => v.setTool), f = g.useRef(/* @__PURE__ */ new Set()), m = g.useRef(false), p = g.useRef(null);
    g.useEffect(() => {
      const v = () => {
        const b = f.current;
        if (b.size === 0) {
          p.current = null;
          return;
        }
        const E = m.current ? MS : kS;
        let k = 0, O = 0;
        b.has("ArrowUp") && (O += E), b.has("ArrowDown") && (O -= E), b.has("ArrowLeft") && (k += E), b.has("ArrowRight") && (k -= E), (k !== 0 || O !== 0) && i(k, O), p.current = requestAnimationFrame(v);
      }, x = () => {
        p.current === null && f.current.size > 0 && (p.current = requestAnimationFrame(v));
      }, S = (b) => {
        const E = l.current;
        if (!E) return;
        if (m.current = b.shiftKey, (b.metaKey || b.ctrlKey) && (b.key === "k" || b.key === "K")) {
          b.preventDefault(), dn.getState().toggle();
          return;
        }
        if (!Pf.getState().isCanvasActive() || b.target instanceof HTMLInputElement || b.target instanceof HTMLTextAreaElement || rn.getState().isEditingText) return;
        if (b.key === "/" && !b.metaKey && !b.ctrlKey && !b.altKey) {
          b.preventDefault(), dn.getState().open();
          return;
        }
        if (eC.has(b.key)) {
          b.preventDefault(), f.current.add(b.key), x();
          return;
        }
        const k = E.getBoundingClientRect(), O = k.width / 2, R = k.height / 2, T = b.shiftKey ? ES : fc, N = b.shiftKey ? _S : hc;
        switch (b.key) {
          case "=":
          case "+":
            b.preventDefault(), o(T, O, R);
            break;
          case "-":
          case "_":
            b.preventDefault(), o(N, O, R);
            break;
        }
        if ((b.metaKey || b.ctrlKey) && (b.key === "a" || b.key === "A")) {
          if (b.preventDefault(), n) {
            const I = n.get_all_ids();
            ie.getState().selectAll(I);
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && (b.key === "c" || b.key === "C") && !b.shiftKey) {
          if (b.preventDefault(), n) {
            const { selectedIds: I } = ie.getState();
            if (I.size > 0) {
              const A = Yl(n, I);
              Vn.getState().copy(A);
            }
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && (b.key === "v" || b.key === "V") && !b.shiftKey) {
          if (b.preventDefault(), n && r && E) {
            const { hasContent: I } = Vn.getState();
            if (I) {
              const A = new yc();
              ue.getState().execute(A, {
                library: n,
                renderer: r
              }), qr(n, E);
            }
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && (b.key === "b" || b.key === "B") && !b.shiftKey) {
          if (b.preventDefault(), n && r && E) {
            const { selectedIds: I } = ie.getState();
            if (I.size > 0) {
              const A = new bc([
                ...I
              ]);
              ue.getState().execute(A, {
                library: n,
                renderer: r
              }), qr(n, E);
            }
          }
          return;
        }
        if (b.key === "Delete" || b.key === "Backspace") {
          b.preventDefault();
          const { selectedRulerIds: I } = Ie.getState();
          if (I.size > 0 && n && r) {
            const A = new vc([
              ...I
            ]);
            ue.getState().execute(A, {
              library: n,
              renderer: r
            });
            return;
          }
          if (n && r) {
            const { selectedIds: A } = ie.getState();
            if (A.size > 0) {
              const D = [], U = [];
              for (const B of A) jn(B) ? D.push(B) : U.push(B);
              if (D.length > 0) {
                const B = new K0(D.map(Gr));
                ue.getState().execute(B, {
                  library: n,
                  renderer: r
                });
              }
              if (U.length > 0) {
                const B = new pc(U);
                ue.getState().execute(B, {
                  library: n,
                  renderer: r
                });
              }
            }
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && b.key === "z" && !b.shiftKey) {
          if (b.preventDefault(), n && r) {
            const { canUndo: I, undo: A } = ue.getState();
            I && A({
              library: n,
              renderer: r
            });
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && ((b.key === "z" || b.key === "Z") && b.shiftKey || b.key === "y" || b.key === "Y")) {
          if (b.preventDefault(), n && r) {
            const { canRedo: I, redo: A } = ue.getState();
            I && A({
              library: n,
              renderer: r
            });
          }
          return;
        }
        if (b.key === "Tab") {
          if (b.preventDefault(), n && E) {
            const I = n.get_group_representative_ids();
            if (I.length > 0) {
              b.shiftKey ? ie.getState().selectPrevious(I) : ie.getState().selectNext(I);
              const D = ie.getState().lastSelectedId;
              if (D) {
                const U = n.get_group_ids(D);
                U.length > 1 && ie.setState({
                  selectedIds: new Set(U),
                  lastSelectedId: D
                });
              }
              qr(n, E);
            }
          }
          return;
        }
        if (b.key === "Enter" && (Gt.getState().activeTool === "rectangle" || Gt.getState().activeTool === "polygon" || Gt.getState().activeTool === "path" || Gt.getState().activeTool === "text")) {
          if (Date.now() - Gt.getState().toolSetAt > 2e3) return;
          if (b.preventDefault(), n && r && E) {
            const A = Gt.getState().activeTool;
            A === "rectangle" ? B0(n, r, E) : A === "polygon" ? X0(n, r, E) : A === "path" ? $0(n, r, E) : V0(n, r, E);
          }
          return;
        }
        if (!(b.metaKey || b.ctrlKey)) switch (b.key) {
          case "Escape":
            b.preventDefault(), Ie.getState().activeRulerId ? Ie.getState().cancelCreation() : Ie.getState().selectedRulerIds.size > 0 ? Ie.getState().clearSelection() : ie.getState().selectedIds.size > 0 ? ie.getState().clearSelection() : d("select");
            break;
          case "v":
          case "V":
            b.preventDefault(), d("select");
            break;
          case "p":
          case "P":
            b.preventDefault(), d("pan");
            break;
          case "q":
          case "Q":
            b.preventDefault(), d("laser");
            break;
          case "z":
          case "Z":
            b.preventDefault(), d("zoom");
            break;
          case "r":
          case "R":
            b.preventDefault(), d("rectangle");
            break;
          case "m":
          case "M":
            b.preventDefault(), d("move");
            break;
          case "g":
          case "G":
            b.preventDefault(), d("polygon");
            break;
          case "h":
          case "H":
            b.preventDefault(), d("path");
            break;
          case "t":
            b.preventDefault(), d("text");
            break;
          case "u":
          case "U":
            b.preventDefault(), d("ruler");
            break;
          case "i":
            b.preventDefault(), dn.getState().open("add instance ");
            break;
          case "f":
            b.preventDefault(), gs();
            break;
          case "F":
            if (b.preventDefault(), n && E) {
              const I = ie.getState().selectedIds;
              if (I.size > 0) {
                const A = n.get_bounds_for_ids([
                  ...I
                ]), D = A ? {
                  minX: A[0],
                  minY: A[1],
                  maxX: A[2],
                  maxY: A[3]
                } : null, U = yr(E);
                c(D, U.width, U.height, U.screenCenter);
              }
            }
            break;
          case "E":
            if (b.shiftKey) {
              b.preventDefault(), he.getState().explorerCollapsed && he.getState().toggleExplorerCollapsed(), de.getState().setFocused(true);
              break;
            }
            b.preventDefault(), ie.getState().selectedIds.size > 0 && he.getState().requestInspectorFocus();
            break;
          case "e":
            b.preventDefault(), ie.getState().selectedIds.size > 0 && he.getState().requestInspectorFocus();
            break;
          case "L":
            b.preventDefault(), he.getState().setSidebarTab("layers"), ve.getState().setFocused(true);
            break;
          case "I":
            b.preventDefault(), he.getState().setSidebarTab("inspector");
            break;
          case "c": {
            if (b.preventDefault(), !n || !r) break;
            const I = uh(), A = new mh(I);
            ue.getState().execute(A, {
              library: n,
              renderer: r
            }), he.getState().explorerCollapsed && he.getState().toggleExplorerCollapsed(), de.getState().setActiveCell(I), de.getState().setEditingCellName(I);
            break;
          }
          case "[": {
            b.preventDefault();
            const { hierarchyLevelLimit: I, maxTreeDepth: A, setHierarchyLevelLimit: D } = de.getState(), U = I === 1 / 0 ? A : I;
            U > 1 && D(U - 1);
            break;
          }
          case "]": {
            b.preventDefault();
            const { hierarchyLevelLimit: I, maxTreeDepth: A, setHierarchyLevelLimit: D } = de.getState(), U = I === 1 / 0 ? A : I;
            U < A ? D(U + 1) : D(1 / 0);
            break;
          }
        }
      }, C = (b) => {
        m.current = b.shiftKey, f.current.delete(b.key);
      }, _ = () => {
        f.current.clear(), m.current = false;
      };
      return window.addEventListener("keydown", S), window.addEventListener("keyup", C), window.addEventListener("blur", _), () => {
        window.removeEventListener("keydown", S), window.removeEventListener("keyup", C), window.removeEventListener("blur", _), p.current !== null && cancelAnimationFrame(p.current);
      };
    }, [
      l,
      o,
      i,
      d,
      n,
      r,
      c
    ]);
  }
  const nC = 500, lC = 3, rC = Mt((l, n) => ({
    points: [],
    opacity: 1,
    isDrawing: false,
    addPoint: (r) => {
      const { points: o, isDrawing: i } = n();
      if (!i) return;
      if (o.length > 0) {
        const d = o[o.length - 1], f = r.x - d.x, m = r.y - d.y;
        if (Math.sqrt(f * f + m * m) < lC) return;
      }
      const c = [
        ...o,
        r
      ];
      c.length > nC && c.shift(), l({
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
  })), aC = 300, Yy = 16, Uy = 2, Zd = 2.5;
  function oC(l, n, r, o) {
    const i = 1 - o;
    return {
      x: i * i * l.x + 2 * i * o * n.x + o * o * r.x,
      y: i * i * l.y + 2 * i * o * n.y + o * o * r.y
    };
  }
  function sC(l) {
    if (l.length <= 2) return l;
    const n = [
      l[0]
    ];
    for (let r = 1; r < l.length - 1; r++) {
      const o = Math.max(0, r - Uy), i = Math.min(l.length - 1, r + Uy);
      let c = 0, d = 0;
      const f = i - o + 1;
      for (let m = o; m <= i; m++) c += l[m].x, d += l[m].y;
      n.push({
        x: c / f,
        y: d / f
      });
    }
    return n.push(l[l.length - 1]), n;
  }
  function iC(l) {
    if (l.length < 3) return l;
    const n = [
      l[0]
    ];
    for (let r = 1; r < l.length - 1; r++) {
      const o = l[r - 1], i = l[r], c = l[r + 1], d = {
        x: (o.x + i.x) / 2,
        y: (o.y + i.y) / 2
      }, f = {
        x: (i.x + c.x) / 2,
        y: (i.y + c.y) / 2
      };
      r === 1 && n.push(d);
      for (let m = 1; m <= Yy; m++) {
        const p = m / Yy;
        n.push(oC(d, i, f, p));
      }
    }
    return n.push(l[l.length - 1]), n;
  }
  function cC(l) {
    if (l.length < 2) return l;
    const n = [
      l[0]
    ];
    let r = 0, o = l[0];
    for (let m = 1; m < l.length; m++) {
      const p = l[m], v = p.x - o.x, x = p.y - o.y, S = Math.sqrt(v * v + x * x);
      if (S < 1e-6) {
        o = p;
        continue;
      }
      const C = v / S, _ = x / S;
      let b = Zd - r;
      for (; b <= S; ) n.push({
        x: o.x + C * b,
        y: o.y + _ * b
      }), b += Zd;
      r = S - (b - Zd), o = p;
    }
    const i = l[l.length - 1], c = n[n.length - 1], d = i.x - c.x, f = i.y - c.y;
    return Math.sqrt(d * d + f * f) > 0.5 && n.push(i), n;
  }
  function uC(l, n) {
    const r = Gt((k) => k.activeTool), { points: o, opacity: i, isDrawing: c, addPoint: d, startDrawing: f, stopDrawing: m, setOpacity: p, reset: v } = rC(), x = g.useRef(null), S = g.useRef(null);
    g.useEffect(() => {
      if (!(!l || !n)) if (o.length === 0) l.clear_laser();
      else {
        const k = sC(o), O = iC(k), R = cC(O), T = window.devicePixelRatio || 1, N = new Float64Array(R.length * 2);
        for (let I = 0; I < R.length; I++) N[I * 2] = R[I].x * T, N[I * 2 + 1] = R[I].y * T;
        l.set_laser_points(N);
      }
    }, [
      l,
      n,
      o
    ]), g.useEffect(() => {
      !l || !n || l.set_laser_opacity(i);
    }, [
      l,
      n,
      i
    ]);
    const C = g.useCallback(() => {
      S.current !== null && cancelAnimationFrame(S.current), x.current = performance.now();
      const k = (O) => {
        if (x.current === null) return;
        const R = O - x.current, T = Math.min(R / aC, 1);
        if (T >= 1) {
          x.current = null, S.current = null, v();
          return;
        }
        p(1 - T), S.current = requestAnimationFrame(k);
      };
      S.current = requestAnimationFrame(k);
    }, [
      v,
      p
    ]), _ = g.useCallback((k) => {
      r !== "laser" || k.button !== 0 || (S.current !== null && (cancelAnimationFrame(S.current), S.current = null, x.current = null), f(), d({
        x: k.clientX,
        y: k.clientY
      }));
    }, [
      r,
      f,
      d
    ]), b = g.useCallback((k) => {
      r !== "laser" || !c || d({
        x: k.clientX,
        y: k.clientY
      });
    }, [
      r,
      c,
      d
    ]), E = g.useCallback(() => {
      r !== "laser" || !c || (m(), C());
    }, [
      r,
      c,
      m,
      C
    ]);
    return g.useEffect(() => () => {
      S.current !== null && cancelAnimationFrame(S.current);
    }, []), g.useEffect(() => {
      r !== "laser" && (S.current !== null && (cancelAnimationFrame(S.current), S.current = null, x.current = null), v());
    }, [
      r,
      v
    ]), {
      handleMouseDown: _,
      handleMouseMove: b,
      handleMouseUp: E,
      isLaserActive: r === "laser"
    };
  }
  const dC = Mt((l, n) => ({
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
      const i = n();
      !i.box || !i.isDrawing || l({
        box: {
          ...i.box,
          width: r - i.box.x,
          height: o - i.box.y
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
  function fC(l) {
    const n = Gt((C) => C.activeTool), { box: r, isDrawing: o, startDrawing: i, updateBox: c, reset: d } = dC(), { zoom: f, offset: m, zoomToBounds: p } = Ue(), v = g.useCallback((C) => {
      if (n !== "zoom" || C.button !== 0) return;
      const _ = l.current;
      if (!_) return;
      const b = _.getBoundingClientRect(), E = C.clientX - b.left, k = C.clientY - b.top;
      i(E, k);
    }, [
      n,
      l,
      i
    ]), x = g.useCallback((C) => {
      if (n !== "zoom" || !o) return;
      const _ = l.current;
      if (!_) return;
      const b = _.getBoundingClientRect(), E = C.clientX - b.left, k = C.clientY - b.top;
      c(E, k);
    }, [
      n,
      o,
      l,
      c
    ]), S = g.useCallback(() => {
      if (n !== "zoom" || !o || !r) {
        d();
        return;
      }
      const C = l.current;
      if (Math.abs(r.width) > 5 && Math.abs(r.height) > 5 && C) {
        const _ = Math.min(r.x, r.x + r.width), b = Math.max(r.x, r.x + r.width), E = Math.min(r.y, r.y + r.height), k = Math.max(r.y, r.y + r.height), O = (_ - m.x) / f, R = (b - m.x) / f, T = (E - m.y) / f, N = (k - m.y) / f, I = {
          minX: O,
          maxX: R,
          minY: T,
          maxY: N
        }, A = yr(C);
        A.width > 0 && A.height > 0 && p(I, A.width, A.height, A.screenCenter);
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
      handleMouseMove: x,
      handleMouseUp: S,
      box: r,
      isZoomActive: n === "zoom",
      isDrawingZoom: o
    };
  }
  function za(l) {
    return Math.round(l / be) * be;
  }
  const Dl = new Float64Array(8), Ko = new Float32Array(4);
  function hC(l, n, r) {
    const o = g.useRef(null), i = g.useRef(false), c = g.useRef([
      0.5,
      0.5,
      0.5,
      0.5
    ]), d = g.useCallback((v) => {
      if (v.button !== 0) return;
      const S = v.currentTarget.getBoundingClientRect(), C = v.clientX - S.left, _ = v.clientY - S.top, b = l(C, _);
      if (!b) return;
      const E = za(b.x), k = za(b.y);
      o.current = {
        x: E,
        y: k
      }, i.current = true;
      const O = ve.getState().activeLayerId, T = ve.getState().layers.get(O);
      if (T) {
        const [N, I, A] = mc(T.color, 0.5);
        c.current = [
          N,
          I,
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
    ]), f = g.useCallback((v, x) => {
      const S = o.current;
      if (!i.current || !S || !r) return false;
      const C = l(v, x);
      if (!C) return false;
      const _ = za(C.x), b = za(C.y), E = Math.min(S.x, _), k = Math.min(S.y, b), O = Math.max(S.x, _), R = Math.max(S.y, b);
      Dl[0] = E, Dl[1] = k, Dl[2] = O, Dl[3] = k, Dl[4] = O, Dl[5] = R, Dl[6] = E, Dl[7] = R;
      const T = c.current;
      return Ko[0] = T[0], Ko[1] = T[1], Ko[2] = T[2], Ko[3] = T[3], r.set_preview_shape(Dl, Ko), r.mark_dirty(), true;
    }, [
      l,
      r
    ]), m = g.useCallback((v, x) => {
      const S = o.current;
      if (!S || !n || !r) return;
      const C = za(v), _ = za(x), b = Math.min(S.x, C), E = Math.min(S.y, _), k = Math.abs(C - S.x), O = Math.abs(_ - S.y);
      if (k > 0 && O > 0) {
        const R = ve.getState().activeLayerId, N = ve.getState().layers.get(R), I = (N == null ? void 0 : N.layerNumber) ?? 1, A = (N == null ? void 0 : N.datatype) ?? 0, D = new A0(b, E, k, O, I, A);
        ue.getState().execute(D, {
          library: n,
          renderer: r
        });
      }
      r.clear_preview(), i.current = false, o.current = null;
    }, [
      n,
      r
    ]), p = g.useCallback(() => {
      i.current = false, o.current = null, r == null ? void 0 : r.clear_preview();
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
  function Ii(l) {
    return Math.round(l / be) * be;
  }
  function By(l, n, r, o) {
    const i = (l.x - n.x) * r, c = (l.y - n.y) * r;
    return Math.sqrt(i * i + c * c) <= o;
  }
  const Xy = 10, Vy = 8, mC = 6;
  function $y(l, n, r) {
    const o = mC / r;
    let i = null, c = null, d = l.x, f = l.y;
    for (const m of n) if (i === null && Math.abs(l.x - m.x) <= o && (d = m.x, i = m), c === null && Math.abs(l.y - m.y) <= o && (f = m.y, c = m), i !== null && c !== null) break;
    return {
      point: {
        x: d,
        y: f
      },
      guides: {
        alignedVertexX: i,
        alignedVertexY: c
      }
    };
  }
  function qy(l, n) {
    const r = n.x - l.x, o = n.y - l.y;
    if (r === 0 && o === 0) return n;
    const i = Math.abs(Math.atan2(Math.abs(o), Math.abs(r)) * (180 / Math.PI));
    return i <= Vy ? {
      x: n.x,
      y: l.y
    } : i >= 90 - Vy ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function gC(l, n, r, o) {
    const [i, c] = g.useState([]), [d, f] = g.useState(false), [m, p] = g.useState(null), [v, x] = g.useState(false), [S, C] = g.useState(null), _ = ve((N) => N.activeLayerId), b = ve((N) => N.layers), E = Gt((N) => N.activeTool);
    g.useEffect(() => {
      E !== "polygon" && (c([]), f(false), p(null), x(false), C(null));
    }, [
      E
    ]);
    const k = g.useCallback((N) => {
      if (!n || !r || N.length < 3) return;
      const I = new Float64Array(N.length * 2);
      for (let ne = 0; ne < N.length; ne++) I[ne * 2] = N[ne].x, I[ne * 2 + 1] = N[ne].y;
      const A = b.get(_), D = (A == null ? void 0 : A.layerNumber) ?? 1, U = (A == null ? void 0 : A.datatype) ?? 0, B = new T0(I, D, U);
      ue.getState().execute(B, {
        library: n,
        renderer: r
      }), c([]), f(false), p(null), x(false);
    }, [
      n,
      r,
      _,
      b
    ]), O = g.useCallback((N) => {
      if (N.button !== 0) return;
      const A = N.currentTarget.getBoundingClientRect(), D = N.clientX - A.left, U = N.clientY - A.top, B = l(D, U);
      if (!B) return;
      let ne = {
        x: Ii(B.x),
        y: Ii(B.y)
      };
      if (i.length > 0 && !N.shiftKey && (ne = $y(ne, i, o).point, ne = qy(i[i.length - 1], ne)), i.length >= 3) {
        const fe = i[0];
        if (By(fe, ne, o, Xy)) {
          k(i);
          return;
        }
      }
      const W = i[i.length - 1];
      if (W && ne.x === W.x && ne.y === W.y) return;
      const J = [
        ...i,
        ne
      ];
      c(J), f(true);
    }, [
      l,
      i,
      o,
      k
    ]), R = g.useCallback((N) => {
      const A = N.currentTarget.getBoundingClientRect(), D = N.clientX - A.left, U = N.clientY - A.top, B = l(D, U);
      if (!B) return;
      let ne = {
        x: Ii(B.x),
        y: Ii(B.y)
      }, W = null;
      if (i.length > 0 && !N.shiftKey) {
        const fe = $y(ne, i, o);
        ne = fe.point, W = fe.guides, ne = qy(i[i.length - 1], ne);
      }
      const J = i.length >= 3 && By(i[0], ne, o, Xy);
      J && (ne = {
        ...i[0]
      }, W = null), x(J), p(ne), C(W);
    }, [
      l,
      i,
      o
    ]), T = g.useCallback(() => {
      c([]), f(false), p(null), x(false), C(null);
    }, []);
    return {
      handleMouseDown: O,
      handleMouseMove: R,
      cancelDrawing: T,
      isDrawing: d,
      points: i,
      cursorPoint: m,
      isNearStart: v,
      alignmentGuides: S
    };
  }
  function Di(l) {
    return Math.round(l / be) * be;
  }
  const pC = 6;
  function Gy(l, n, r) {
    const o = pC / r;
    let i = null, c = null, d = l.x, f = l.y;
    for (const m of n) if (i === null && Math.abs(l.x - m.x) <= o && (d = m.x, i = m), c === null && Math.abs(l.y - m.y) <= o && (f = m.y, c = m), i !== null && c !== null) break;
    return {
      point: {
        x: d,
        y: f
      },
      guides: {
        alignedVertexX: i,
        alignedVertexY: c
      }
    };
  }
  function yC(l, n, r, o) {
    const [i, c] = g.useState([]), [d, f] = g.useState(false), [m, p] = g.useState(null), [v, x] = g.useState(null), S = ve((T) => T.activeLayerId), C = ve((T) => T.layers), _ = Gt((T) => T.activeTool);
    g.useEffect(() => {
      _ !== "path" && (c([]), f(false), p(null), x(null));
    }, [
      _
    ]);
    const b = g.useCallback((T) => {
      if (!n || !r || T.length < 2) return;
      const { width: N, cornerRadius: I, numArcPoints: A } = tt.getState(), D = new Float64Array(T.length * 2);
      for (let J = 0; J < T.length; J++) D[J * 2] = T[J].x, D[J * 2 + 1] = T[J].y;
      const U = C.get(S), B = (U == null ? void 0 : U.layerNumber) ?? 1, ne = (U == null ? void 0 : U.datatype) ?? 0, W = new O0(D, N, B, ne, [
        ...T
      ], I, A);
      ue.getState().execute(W, {
        library: n,
        renderer: r
      }), c([]), f(false), p(null), x(null);
    }, [
      n,
      r,
      S,
      C
    ]), E = g.useCallback((T) => {
      if (T.button !== 0) return;
      const I = T.currentTarget.getBoundingClientRect(), A = T.clientX - I.left, D = T.clientY - I.top, U = l(A, D);
      if (!U) return;
      let B = {
        x: Di(U.x),
        y: Di(U.y)
      };
      if (i.length > 0 && !T.shiftKey && (B = Gy(B, i, o).point, B = Ny(i[i.length - 1], B)), T.detail >= 2 && i.length >= 2) {
        b(i);
        return;
      }
      const ne = i[i.length - 1];
      if (ne && B.x === ne.x && B.y === ne.y) return;
      const W = [
        ...i,
        B
      ];
      c(W), f(true);
    }, [
      l,
      i,
      o,
      b
    ]), k = g.useCallback((T) => {
      const I = T.currentTarget.getBoundingClientRect(), A = T.clientX - I.left, D = T.clientY - I.top, U = l(A, D);
      if (!U) return;
      let B = {
        x: Di(U.x),
        y: Di(U.y)
      }, ne = null;
      if (i.length > 0 && !T.shiftKey) {
        const W = Gy(B, i, o);
        B = W.point, ne = W.guides, B = Ny(i[i.length - 1], B);
      }
      p(B), x(ne);
    }, [
      l,
      i,
      o
    ]), O = g.useCallback((T) => {
      T.key === "Enter" && i.length >= 2 && (T.preventDefault(), b(i));
    }, [
      i,
      b
    ]);
    g.useEffect(() => {
      if (d) return window.addEventListener("keydown", O), () => window.removeEventListener("keydown", O);
    }, [
      d,
      O
    ]);
    const R = g.useCallback(() => {
      c([]), f(false), p(null), x(null);
    }, []);
    return {
      handleMouseDown: E,
      handleMouseMove: k,
      cancelDrawing: R,
      isDrawing: d,
      waypoints: i,
      cursorPoint: m,
      alignmentGuides: v
    };
  }
  const Py = Mt((l, n) => ({
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
      const i = n();
      !i.box || !i.isDrawing || l({
        box: {
          ...i.box,
          width: r - i.box.x,
          height: o - i.box.y
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
  })), Zy = 15;
  function Kf(l) {
    if (!l) return null;
    try {
      const n = l.get_all_vertices();
      return n.length > 0 ? n : null;
    } catch {
      return null;
    }
  }
  function bC(l, n, r, o, i, c) {
    const d = i - r, f = c - o, m = d * d + f * f;
    if (m === 0) {
      const C = (l - r) * (l - r) + (n - o) * (n - o);
      return {
        point: {
          x: r,
          y: o
        },
        distSq: C
      };
    }
    const p = Math.max(0, Math.min(1, ((l - r) * d + (n - o) * f) / m)), v = r + p * d, x = o + p * f, S = (l - v) * (l - v) + (n - x) * (n - x);
    return {
      point: {
        x: v,
        y: x
      },
      distSq: S
    };
  }
  function vC(l, n, r, o, i) {
    let c = null, d = Zy * Zy;
    const f = (l - i.x) / o, m = (n - i.y) / o;
    for (const p of r) {
      const v = p.length / 2;
      if (!(v < 2)) for (let x = 0; x < v; x++) {
        const S = (x + 1) % v, C = p[x * 2], _ = p[x * 2 + 1], b = p[S * 2], E = p[S * 2 + 1], { point: k, distSq: O } = bC(f, m, C, _, b, E), R = O * o * o;
        R < d && (d = R, c = k);
      }
    }
    return c;
  }
  function Ky(l) {
    return Math.round(l / be) * be;
  }
  function xC(l) {
    const n = [];
    let r = 0;
    for (; r < l.length; ) {
      const o = l[r];
      if (r++, o < 2 || r + o * 2 > l.length) break;
      const i = [];
      for (let c = 0; c < o; c++) i.push(l[r], l[r + 1]), r += 2;
      n.push(i);
    }
    return n;
  }
  function Ff(l, n, r, o, i, c, d, f = false) {
    if (!f && i && i.length >= 5) {
      const m = xC(i);
      if (m.length > 0) {
        const p = vC(l, n, m, c, d);
        if (p) return {
          point: p,
          isGeometrySnap: true
        };
      }
    }
    return {
      point: {
        x: Ky(r),
        y: Ky(o)
      },
      isGeometrySnap: false
    };
  }
  const Fy = 5;
  function Qy(l, n) {
    return l.get_group_ids(n);
  }
  function Wy(l, n) {
    const r = /* @__PURE__ */ new Set(), o = [];
    for (const i of n) {
      const c = l.get_group_ids(i);
      for (const d of c) r.has(d) || (r.add(d), o.push(d));
    }
    return o;
  }
  const wC = 8, zi = 12, Qf = 140, Wf = 56;
  function SC(l, n, r, o, i, c) {
    const d = l - r, f = n - o, m = i - r, p = c - o, v = d * m + f * p, x = m * m + p * p;
    if (x === 0) return Math.sqrt(d * d + f * f);
    const S = Math.max(0, Math.min(1, v / x)), C = r + S * m, _ = o + S * p, b = l - C, E = n - _;
    return Math.sqrt(b * b + E * E);
  }
  function Jy(l, n, r, o, i) {
    for (const c of r.values()) {
      const d = c.start.x * o + i.x, f = c.start.y * o + i.y, m = c.end.x * o + i.x, p = c.end.y * o + i.y, v = l - d, x = n - f;
      if (v * v + x * x <= zi * zi) return {
        rulerId: c.id,
        endpoint: "start"
      };
      const S = l - m, C = n - p;
      if (S * S + C * C <= zi * zi) return {
        rulerId: c.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function eb(l, n, r, o, i) {
    for (const c of r.values()) {
      const d = c.start.x * o + i.x, f = c.start.y * o + i.y, m = c.end.x * o + i.x, p = c.end.y * o + i.y, v = (d + m) / 2, x = (f + p) / 2, S = Qf / 2, C = Wf / 2;
      if (l >= v - S && l <= v + S && n >= x - C && n <= x + C || SC(l, n, d, f, m, p) <= wC) return c.id;
    }
    return null;
  }
  function CC(l, n, r, o, i, c, d, f) {
    if (l >= i && l <= d && n >= c && n <= f || r >= i && r <= d && o >= c && o <= f) return true;
    const m = [
      [
        i,
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
        i,
        f,
        d,
        f
      ],
      [
        i,
        c,
        i,
        f
      ]
    ];
    for (const [p, v, x, S] of m) if (EC(l, n, r, o, p, v, x, S)) return true;
    return false;
  }
  function EC(l, n, r, o, i, c, d, f) {
    const m = Hi(i, c, d, f, l, n), p = Hi(i, c, d, f, r, o), v = Hi(l, n, r, o, i, c), x = Hi(l, n, r, o, d, f);
    return !!((m > 0 && p < 0 || m < 0 && p > 0) && (v > 0 && x < 0 || v < 0 && x > 0) || m === 0 && Yi(i, c, d, f, l, n) || p === 0 && Yi(i, c, d, f, r, o) || v === 0 && Yi(l, n, r, o, i, c) || x === 0 && Yi(l, n, r, o, d, f));
  }
  function Hi(l, n, r, o, i, c) {
    return (i - l) * (o - n) - (r - l) * (c - n);
  }
  function Yi(l, n, r, o, i, c) {
    return Math.min(l, r) <= i && i <= Math.max(l, r) && Math.min(n, o) <= c && c <= Math.max(n, o);
  }
  function tb(l, n, r, o, i, c, d) {
    const f = [];
    for (const m of i.values()) {
      const p = m.start.x * c + d.x, v = m.start.y * c + d.y, x = m.end.x * c + d.x, S = m.end.y * c + d.y;
      if (CC(p, v, x, S, l, n, r, o)) {
        f.push(m.id);
        continue;
      }
      const C = (p + x) / 2, _ = (v + S) / 2, b = C - Qf / 2, E = C + Qf / 2, k = _ - Wf / 2, O = _ + Wf / 2;
      b <= r && E >= l && k <= o && O >= n && f.push(m.id);
    }
    return f;
  }
  function _C(l, n, r) {
    const { selectedIds: o, hoveredId: i, clearSelection: c, setHover: d } = ie(), { box: f, isDrawing: m, previewIds: p, startDrawing: v, updateBox: x, setPreviewIds: S, reset: C } = Py(), { zoom: _, offset: b } = Ue(), E = Ie((L) => L.rulers), k = Ie((L) => L.selectedRulerIds), O = Ie((L) => L.selectRuler), R = Ie((L) => L.toggleSelection), T = Ie((L) => L.addToSelection), N = Ie((L) => L.clearSelection), I = Ie((L) => L.setHoveredRuler), A = Ie((L) => L.setHoveredEndpoint), D = Ie((L) => L.setDraggingEndpoint), U = Ie((L) => L.endDraggingEndpoint), B = Ie((L) => L.updateEndpoint), ne = Ie((L) => L.hoveredRulerId), W = Ie((L) => L.hoveredEndpoint), J = Ie((L) => L.draggingEndpoint), fe = Ie((L) => L.setMarqueePreviewIds), xe = Ie((L) => L.setSnapPoint), $ = g.useRef("");
    g.useEffect(() => {
      if (!r) return;
      const L = Array.from(o).filter((z) => !jn(z));
      r.set_selection(L);
    }, [
      r,
      o
    ]), g.useEffect(() => {
      if (r) if (m) {
        const L = Array.from(p).filter((z) => !jn(z));
        r.set_hover_multiple(L);
      } else if (i && !jn(i) && n) {
        const L = Qy(n, i);
        r.set_hover_multiple(L);
      } else r.set_hover(void 0);
    }, [
      r,
      n,
      i,
      m,
      p
    ]);
    const K = g.useCallback((L) => {
      if (L.button !== 0) return;
      const Z = L.currentTarget.getBoundingClientRect(), Q = L.clientX - Z.left, te = L.clientY - Z.top, ce = Jy(Q, te, E, _, b);
      if (ce) {
        O(ce.rulerId), D(ce), c();
        return;
      }
      const ge = eb(Q, te, E, _, b);
      if (ge) {
        L.shiftKey ? T([
          ge
        ]) : L.metaKey || L.ctrlKey ? R(ge) : O(ge), c();
        return;
      }
      k.size > 0 && N();
      const je = l(Q, te);
      if (!je || !n) return;
      let j = n.hit_test(je.x, je.y);
      if (j || (j = as(je.x, je.y) ?? void 0), j) {
        const ee = jn(j) ? [
          j
        ] : Qy(n, j);
        if (L.shiftKey) {
          const oe = ie.getState().selectedIds, pe = /* @__PURE__ */ new Set([
            ...oe,
            ...ee
          ]);
          ie.setState({
            selectedIds: pe,
            lastSelectedId: j
          });
        } else if (L.metaKey || L.ctrlKey) {
          const oe = ie.getState().selectedIds, pe = ee.every((Se) => oe.has(Se)), Ee = new Set(oe);
          if (pe) for (const Se of ee) Ee.delete(Se);
          else for (const Se of ee) Ee.add(Se);
          ie.setState({
            selectedIds: Ee,
            lastSelectedId: j
          });
        } else ie.setState({
          selectedIds: new Set(ee),
          lastSelectedId: j
        });
      } else v(Q, te), !L.shiftKey && !L.metaKey && !L.ctrlKey && c();
    }, [
      l,
      n,
      E,
      _,
      b,
      k,
      c,
      O,
      R,
      T,
      N,
      D,
      v
    ]), me = g.useCallback((L) => {
      const Z = L.currentTarget.getBoundingClientRect(), Q = L.clientX - Z.left, te = L.clientY - Z.top;
      if (J) {
        const j = l(Q, te);
        if (j) {
          const ee = Kf(n), oe = Ff(Q, te, j.x, j.y, ee, _, b, L.shiftKey);
          B(J.rulerId, J.endpoint, oe.point), xe(oe.isGeometrySnap ? oe.point : null);
        }
        return;
      }
      if (m) {
        x(Q, te);
        const j = Py.getState().box;
        if (j) {
          const ee = Math.min(j.x, j.x + j.width), oe = Math.max(j.x, j.x + j.width), pe = Math.min(j.y, j.y + j.height), Ee = Math.max(j.y, j.y + j.height), Se = tb(ee, pe, oe, Ee, E, _, b);
          fe(Se);
          {
            const Be = (ee - b.x) / _, Qe = (oe - b.x) / _, Ce = (pe - b.y) / _, Xe = (Ee - b.y) / _, Re = Math.min(Be, Qe), nt = Math.max(Be, Qe), Te = Math.min(Ce, Xe), lt = Math.max(Ce, Xe), wt = n ? n.hit_test_rect(Re, Te, nt, lt) : [], st = n ? Wy(n, wt) : wt, sn = Ry(Re, Te, nt, lt), ul = [
              ...st,
              ...sn
            ], dl = ul.sort().join(",");
            dl !== $.current && ($.current = dl, S(ul));
          }
        }
        return;
      }
      const ce = Jy(Q, te, E, _, b);
      let ge = null;
      ce ? (((W == null ? void 0 : W.rulerId) !== ce.rulerId || (W == null ? void 0 : W.endpoint) !== ce.endpoint) && A(ce), ne !== ce.rulerId && I(ce.rulerId), ge = ce.rulerId) : (W && A(null), ge = eb(Q, te, E, _, b), ge !== ne && I(ge));
      const je = l(Q, te);
      if (!je || !n) {
        i !== null && d(null);
        return;
      }
      if (ge) i !== null && d(null);
      else {
        let j = n.hit_test(je.x, je.y);
        j || (j = as(je.x, je.y) ?? void 0), (j ?? null) !== i && d(j ?? null);
      }
    }, [
      l,
      n,
      E,
      i,
      ne,
      W,
      J,
      d,
      I,
      A,
      B,
      fe,
      m,
      x,
      _,
      b,
      S,
      xe
    ]), ye = g.useCallback(() => {
      if (J) {
        const Z = U();
        if (xe(null), Z && n && r) {
          const Q = new D0(Z.rulerId, Z.endpoint, Z.oldPosition, Z.newPosition);
          ue.getState().pushCommand(Q);
        }
        return;
      }
      if (!m || !f) {
        C(), fe([]);
        return;
      }
      const L = Math.abs(f.width), z = Math.abs(f.height);
      if (L > Fy || z > Fy) {
        const Z = Math.min(f.x, f.x + f.width), Q = Math.max(f.x, f.x + f.width), te = Math.min(f.y, f.y + f.height), ce = Math.max(f.y, f.y + f.height), ge = tb(Z, te, Q, ce, E, _, b), je = (Z - b.x) / _, j = (Q - b.x) / _, ee = (te - b.y) / _, oe = (ce - b.y) / _, pe = Math.min(je, j), Ee = Math.max(je, j), Se = Math.min(ee, oe), Be = Math.max(ee, oe), Qe = n ? n.hit_test_rect(pe, Se, Ee, Be) : [], Ce = n ? Wy(n, Qe) : Qe, Xe = Ry(pe, Se, Ee, Be);
        ge.length > 0 && T(ge);
        const Re = [
          ...Ce,
          ...Xe
        ];
        if (Re.length > 0) {
          const nt = ie.getState().selectedIds, Te = /* @__PURE__ */ new Set([
            ...nt,
            ...Re
          ]);
          ie.getState().setSelection(Te);
        }
      }
      C(), fe([]);
    }, [
      m,
      f,
      n,
      r,
      E,
      _,
      b,
      J,
      T,
      U,
      C,
      fe,
      xe
    ]), ke = g.useCallback(() => {
      i !== null && d(null), ne !== null && I(null), W !== null && A(null), J !== null && D(null), C(), fe([]);
    }, [
      i,
      ne,
      W,
      J,
      d,
      I,
      A,
      D,
      C,
      fe
    ]);
    return {
      handleMouseDown: K,
      handleMouseMove: me,
      handleMouseUp: ye,
      handleMouseLeave: ke,
      selectedIds: o,
      hoveredId: i,
      hoveredRulerId: ne,
      hoveredEndpoint: W,
      marqueeBox: f,
      isDrawingMarquee: m,
      previewIds: p
    };
  }
  const kC = 8, MC = 140, jC = 56;
  function LC(l, n, r, o, i, c) {
    const d = l - r, f = n - o, m = i - r, p = c - o, v = d * m + f * p, x = m * m + p * p;
    if (x === 0) return Math.sqrt(d * d + f * f);
    const S = Math.max(0, Math.min(1, v / x)), C = r + S * m, _ = o + S * p, b = l - C, E = n - _;
    return Math.sqrt(b * b + E * E);
  }
  function nb(l, n, r, o, i) {
    for (const c of r.values()) {
      const d = c.start.x * o + i.x, f = c.start.y * o + i.y, m = c.end.x * o + i.x, p = c.end.y * o + i.y, v = (d + m) / 2, x = (f + p) / 2, S = MC / 2, C = jC / 2;
      if (l >= v - S && l <= v + S && n >= x - C && n <= x + C || LC(l, n, d, f, m, p) <= kC) return c.id;
    }
    return null;
  }
  function RC(l, n, r) {
    const [o, i] = g.useState(false), [c, d] = g.useState(null), [f, m] = g.useState(null), { zoom: p, offset: v } = Ue(), x = Ie((R) => R.rulers), S = Ie((R) => R.selectRuler), C = g.useRef(null), _ = g.useCallback((R) => {
      if (R.button !== 0) return;
      const N = R.currentTarget.getBoundingClientRect(), I = R.clientX - N.left, A = R.clientY - N.top, D = l(I, A);
      if (!D) return;
      const U = nb(I, A, x, p, v);
      if (U) {
        S(U), ie.getState().clearSelection(), C.current = {
          elementIds: [],
          rulerId: U,
          startWorld: D,
          currentDelta: {
            x: 0,
            y: 0
          }
        }, i(true);
        return;
      }
      let B;
      if (n && (B = n.hit_test(D.x, D.y) ?? void 0), B || (B = as(D.x, D.y) ?? void 0), !B) return;
      S(null);
      const { selectedIds: ne } = ie.getState();
      if (jn(B)) {
        let fe;
        ne.has(B) ? fe = [
          ...ne
        ].filter((xe) => jn(xe)) : (fe = [
          B
        ], ie.getState().select(B)), C.current = {
          elementIds: fe,
          rulerId: null,
          startWorld: D,
          currentDelta: {
            x: 0,
            y: 0
          }
        }, i(true);
        return;
      }
      if (!n) return;
      const W = n.get_group_ids(B);
      let J;
      ne.has(B) ? J = [
        ...ne
      ].filter((fe) => !jn(fe)) : (J = W, ie.getState().setSelection(new Set(W))), C.current = {
        elementIds: J,
        rulerId: null,
        startWorld: D,
        currentDelta: {
          x: 0,
          y: 0
        }
      }, i(true);
    }, [
      l,
      n,
      x,
      p,
      v,
      S
    ]), b = g.useCallback((R) => {
      const N = R.currentTarget.getBoundingClientRect(), I = R.clientX - N.left, A = R.clientY - N.top, D = l(I, A);
      if (!D) return;
      if (!o) {
        const fe = nb(I, A, x, p, v);
        fe !== f && m(fe);
        {
          let xe = null;
          n && (xe = n.hit_test(D.x, D.y) ?? null), xe || (xe = as(D.x, D.y)), xe !== c && d(xe);
        }
        return;
      }
      const U = C.current;
      if (!U) return;
      const B = D.x - U.startWorld.x, ne = D.y - U.startWorld.y, W = B - U.currentDelta.x, J = ne - U.currentDelta.y;
      if (W !== 0 || J !== 0) {
        if (U.rulerId) {
          const fe = Ie.getState().rulers.get(U.rulerId);
          fe && (Ie.getState().updateEndpoint(U.rulerId, "start", {
            x: fe.start.x + W,
            y: fe.start.y + J
          }), Ie.getState().updateEndpoint(U.rulerId, "end", {
            x: fe.end.x + W,
            y: fe.end.y + J
          }));
        } else if (U.elementIds.length > 0 && jn(U.elementIds[0])) {
          const fe = Vt.getState();
          for (const xe of U.elementIds) {
            const $ = Gr(xe), K = fe.images.get($);
            K && fe.updateImage($, {
              x: K.x + W,
              y: K.y + J
            });
          }
        } else n && r && (n.translate_elements(U.elementIds, W, J), tt.getState().translateWaypoints(U.elementIds, W, J), r.sync_from_library(n), r.mark_dirty(), we.getState().bumpSyncGeneration());
        U.currentDelta = {
          x: B,
          y: ne
        };
      }
    }, [
      l,
      n,
      r,
      x,
      p,
      v,
      o,
      c,
      f
    ]), E = g.useCallback(() => {
      if (!o) {
        i(false), C.current = null;
        return;
      }
      const R = C.current;
      if (!R) {
        i(false);
        return;
      }
      const { elementIds: T, rulerId: N, currentDelta: I } = R;
      if (N && (I.x !== 0 || I.y !== 0)) {
        const A = new I0([
          N
        ], I.x, I.y);
        ue.getState().pushCommand(A), i(false), C.current = null;
        return;
      }
      if (T.length > 0 && jn(T[0]) && (I.x !== 0 || I.y !== 0)) {
        const A = new b2(T, I.x, I.y);
        ue.getState().pushCommand(A);
      } else if (n && r && (I.x !== 0 || I.y !== 0)) {
        const A = new s2(T, I.x, I.y);
        ue.getState().pushCommand(A), we.getState().bumpSyncGeneration();
        const D = I.x, U = I.y, B = [
          ...T
        ], ne = n;
        setTimeout(() => {
          const W = /* @__PURE__ */ new Set();
          for (const J of B) {
            const fe = pr(J);
            if (fe) if (fe.type === "ref") {
              const xe = `${fe.file}:${fe.line}`;
              W.has(xe) || (W.add(xe), BS(J, D, U));
            } else {
              const xe = ne.get_element_info(J);
              xe && (Qo(J, new Float64Array(xe.vertices)), xe.free());
            }
          }
        }, 0);
      }
      i(false), C.current = null;
    }, [
      o,
      n,
      r
    ]), k = g.useCallback(() => {
      if (!o) {
        i(false), C.current = null;
        return;
      }
      const R = C.current;
      if (R && (R.currentDelta.x !== 0 || R.currentDelta.y !== 0)) if (R.rulerId) {
        const T = Ie.getState().rulers.get(R.rulerId);
        T && (Ie.getState().updateEndpoint(R.rulerId, "start", {
          x: T.start.x - R.currentDelta.x,
          y: T.start.y - R.currentDelta.y
        }), Ie.getState().updateEndpoint(R.rulerId, "end", {
          x: T.end.x - R.currentDelta.x,
          y: T.end.y - R.currentDelta.y
        }));
      } else if (R.elementIds.length > 0 && jn(R.elementIds[0])) {
        const T = Vt.getState();
        for (const N of R.elementIds) {
          const I = Gr(N), A = T.images.get(I);
          A && T.updateImage(I, {
            x: A.x - R.currentDelta.x,
            y: A.y - R.currentDelta.y
          });
        }
      } else n && r && (n.translate_elements(R.elementIds, -R.currentDelta.x, -R.currentDelta.y), tt.getState().translateWaypoints(R.elementIds, -R.currentDelta.x, -R.currentDelta.y), r.sync_from_library(n), r.mark_dirty());
      i(false), C.current = null;
    }, [
      o,
      n,
      r
    ]), O = g.useCallback(() => {
      o && k(), d(null), m(null);
    }, [
      o,
      k
    ]);
    return {
      handleMouseDown: _,
      handleMouseMove: b,
      handleMouseUp: E,
      handleMouseLeave: O,
      cancelMove: k,
      isMoving: o,
      hoveredId: c,
      hoveredRulerId: f
    };
  }
  function lb(l, n) {
    return l.line < n.line ? true : l.line > n.line ? false : l.column < n.column;
  }
  function yh(l) {
    if (!l || !l.isActive || l.anchor.line === l.focus.line && l.anchor.column === l.focus.column) return null;
    const n = lb(l.anchor, l.focus) ? l.anchor : l.focus, r = lb(l.anchor, l.focus) ? l.focus : l.anchor;
    return {
      start: n,
      end: r
    };
  }
  function AC(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return "";
    const n = yh(l.selection);
    if (!n) return "";
    const r = l.content.split(`
`);
    let o = "";
    for (let i = n.start.line; i <= n.end.line; i++) {
      const c = r[i], d = i === n.start.line ? n.start.column : 0, f = i === n.end.line ? n.end.column : c.length;
      o += c.substring(d, f), i < n.end.line && (o += `
`);
    }
    return o;
  }
  function TC(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return l;
    const n = yh(l.selection);
    if (!n) return l;
    const o = [
      ...l.content.split(`
`)
    ];
    if (n.start.line === n.end.line) {
      const i = o[n.start.line];
      o[n.start.line] = i.substring(0, n.start.column) + i.substring(n.end.column);
    } else {
      const i = o[n.start.line], c = o[n.end.line];
      o[n.start.line] = i.substring(0, n.start.column) + c.substring(n.end.column), o.splice(n.start.line + 1, n.end.line - n.start.line);
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
  function NC(l, n, r) {
    var _a;
    r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation();
    const o = l.content.split(`
`), { line: i, column: c } = l.cursorPosition, d = (r == null ? void 0 : r.shiftKey) || false;
    let f = i, m = c, p = l;
    switch (d && !((_a = l.selection) == null ? void 0 : _a.isActive) && (p = {
      ...l,
      selection: {
        anchor: {
          line: i,
          column: c
        },
        focus: {
          line: i,
          column: c
        },
        isActive: true
      }
    }), n) {
      case "ArrowLeft":
        c > 0 ? m = c - 1 : i > 0 && (f = i - 1, m = o[f].length);
        break;
      case "ArrowRight":
        c < o[i].length ? m = c + 1 : i < o.length - 1 && (f = i + 1, m = 0);
        break;
      case "ArrowUp":
        i > 0 && (f = i - 1, m = Math.min(c, o[f].length));
        break;
      case "ArrowDown":
        i < o.length - 1 && (f = i + 1, m = Math.min(c, o[f].length));
        break;
      case "Home":
        m = 0;
        break;
      case "End":
        m = o[i].length;
        break;
    }
    if (d) {
      const v = {
        line: f,
        column: m
      }, x = p.selection.anchor.line === v.line && p.selection.anchor.column === v.column;
      return {
        ...p,
        cursorPosition: v,
        selection: {
          ...p.selection,
          focus: v,
          isActive: !x
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
  function OC(l, n) {
    if (n.key === "a" && (n.ctrlKey || n.metaKey)) {
      n.preventDefault(), n.stopPropagation();
      const r = l.content.split(`
`), o = r.length - 1, i = r[o].length;
      return {
        ...l,
        cursorPosition: {
          line: o,
          column: i
        },
        selection: {
          anchor: {
            line: 0,
            column: 0
          },
          focus: {
            line: o,
            column: i
          },
          isActive: true
        }
      };
    }
    return n.key === "c" && (n.ctrlKey || n.metaKey) ? (n.preventDefault(), n.stopPropagation(), l) : n.key === "v" && (n.ctrlKey || n.metaKey) ? l : null;
  }
  function rb(l, n, r) {
    var _a;
    if (r && (r.ctrlKey || r.metaKey)) {
      const d = OC(l, r);
      if (d) return d;
    }
    let o = null;
    if (((_a = l.selection) == null ? void 0 : _a.isActive) && (n.length === 1 || n === "Backspace" || n === "Delete") && (l = TC(l), n === "Backspace" || n === "Delete")) return l;
    const i = l.content.split(`
`), c = i[l.cursorPosition.line];
    switch (n) {
      case "Enter": {
        if (r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation(), !(r == null ? void 0 : r.shiftKey)) return null;
        const d = c.slice(0, l.cursorPosition.column), f = c.slice(l.cursorPosition.column), m = [
          ...i
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
            ...i
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
          const d = i[l.cursorPosition.line - 1], f = [
            ...i
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
            ...i
          ];
          d[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column) + c.slice(l.cursorPosition.column + 1), o = {
            ...l,
            content: d.join(`
`),
            cursorPosition: l.cursorPosition,
            selection: void 0
          };
        } else if (l.cursorPosition.line < i.length - 1) {
          const d = i[l.cursorPosition.line + 1], f = [
            ...i
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
        o = NC(l, n, r);
        break;
      default:
        if (n.length === 1) {
          r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation();
          const d = [
            ...i
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
  function ab(l) {
    return Math.round(l / be) * be;
  }
  function IC(l, n, r) {
    const o = rn((p) => p.isEditingText), i = g.useRef(null), c = g.useCallback(() => {
      const p = rn.getState().activeText;
      if (!p || !p.content.trim() || !n || !r) {
        rn.getState().stopEditing();
        return;
      }
      const v = ve.getState().layers.get(ve.getState().activeLayerId), x = (v == null ? void 0 : v.layerNumber) ?? 1, S = (v == null ? void 0 : v.datatype) ?? 0, C = new q0(p.content, p.x, p.y, i0 * be, x, S);
      ue.getState().execute(C, {
        library: n,
        renderer: r
      }), we.getState().bumpSyncGeneration(), rn.getState().stopEditing();
    }, [
      n,
      r
    ]), d = g.useCallback(() => {
      rn.getState().stopEditing();
    }, []), f = g.useCallback((p) => {
      if (p.button !== 0) return;
      const x = p.currentTarget.getBoundingClientRect(), S = p.clientX - x.left, C = p.clientY - x.top, _ = l(S, C);
      if (!_) return;
      if (o) {
        c();
        return;
      }
      const b = ab(_.x), E = ab(_.y);
      rn.getState().startEditing(b, E);
    }, [
      l,
      o,
      c
    ]), m = g.useCallback((p) => {
    }, []);
    return g.useEffect(() => {
      if (!o) return;
      const p = (v) => {
        const x = rn.getState().activeText;
        if (!x) return;
        if (v.key === "Escape") {
          v.preventDefault(), v.stopPropagation(), d(), Gt.getState().setTool("select");
          return;
        }
        if (v.key === "c" && (v.ctrlKey || v.metaKey)) {
          const C = AC(x);
          C && (v.preventDefault(), navigator.clipboard.writeText(C));
          return;
        }
        if (v.key === "v" && (v.ctrlKey || v.metaKey)) {
          v.preventDefault(), v.stopPropagation(), navigator.clipboard.readText().then((C) => {
            if (!C) return;
            const _ = rn.getState().activeText;
            if (!_) return;
            let b = _;
            for (const E of C) {
              const k = rb(b, E === `
` ? "Enter" : E, {
                shiftKey: E === `
`,
                ctrlKey: false,
                metaKey: false,
                preventDefault: () => {
                },
                stopPropagation: () => {
                },
                key: E === `
` ? "Enter" : E
              });
              k && (b = k);
            }
            rn.getState().setActiveText(b);
          });
          return;
        }
        const S = rb(x, v.key, v);
        if (S === null) {
          c();
          return;
        }
        S !== x && (rn.getState().setActiveText(S), rn.getState().resetCursor());
      };
      return window.addEventListener("keydown", p, true), () => window.removeEventListener("keydown", p, true);
    }, [
      o,
      c,
      d
    ]), g.useEffect(() => (o && (i.current = setInterval(() => {
      rn.getState().toggleCursor();
    }, RS)), () => {
      i.current && (clearInterval(i.current), i.current = null);
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
  const ob = 12, DC = 8, zC = 140, HC = 56;
  function sb(l, n, r, o, i) {
    const c = n.x * r + o.x, d = n.y * r + o.y, f = l.x - c, m = l.y - d;
    return f * f + m * m <= i * i;
  }
  function YC(l, n, r, o, i, c) {
    const d = l - r, f = n - o, m = i - r, p = c - o, v = d * m + f * p, x = m * m + p * p;
    if (x === 0) return Math.sqrt(d * d + f * f);
    const S = Math.max(0, Math.min(1, v / x)), C = r + S * m, _ = o + S * p, b = l - C, E = n - _;
    return Math.sqrt(b * b + E * E);
  }
  function UC(l, n, r, o, i, c) {
    const d = r.start.x * o + i.x, f = r.start.y * o + i.y, m = r.end.x * o + i.x, p = r.end.y * o + i.y;
    return YC(l, n, d, f, m, p) <= c;
  }
  function BC(l, n, r, o, i) {
    const c = r.start.x * o + i.x, d = r.start.y * o + i.y, f = r.end.x * o + i.x, m = r.end.y * o + i.y, p = (c + f) / 2, v = (d + m) / 2, x = zC / 2, S = HC / 2;
    return l >= p - x && l <= p + x && n >= v - S && n <= v + S;
  }
  function ib(l, n, r, o, i, c) {
    const d = {
      x: l,
      y: n
    };
    for (const f of r.values()) if (f.id !== c) {
      if (sb(d, f.start, o, i, ob)) return {
        rulerId: f.id,
        endpoint: "start"
      };
      if (sb(d, f.end, o, i, ob)) return {
        rulerId: f.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function cb(l, n, r, o, i, c) {
    for (const d of r.values()) if (d.id !== c && (BC(l, n, d, o, i) || UC(l, n, d, o, i, DC))) return d.id;
    return null;
  }
  function XC(l, n, r, o, i) {
    const c = Gt((K) => K.activeTool), { rulers: d, activeRulerId: f, selectedRulerIds: m, hoveredRulerId: p, draggingEndpoint: v, isMovingRuler: x, startRuler: S, updatePreview: C, finalizeRuler: _, cancelCreation: b, updateEndpoint: E, setHoveredEndpoint: k, setDraggingEndpoint: O, endDraggingEndpoint: R, selectRuler: T, toggleSelection: N, addToSelection: I, clearSelection: A, setHoveredRuler: D, startMoveRuler: U, moveRuler: B, endMoveRuler: ne, setSnapPoint: W } = Ie();
    g.useEffect(() => {
      c !== "ruler" && (f && b(), k(null), D(null));
    }, [
      c,
      f,
      b,
      k,
      D
    ]);
    const J = g.useCallback((K) => {
      if (K.button !== 0) return;
      const ye = K.currentTarget.getBoundingClientRect(), ke = K.clientX - ye.left, L = K.clientY - ye.top, z = l(ke, L);
      if (!z) return;
      const Z = Kf(n), te = Ff(ke, L, z.x, z.y, Z, o, i, K.shiftKey).point, ce = ib(ke, L, d, o, i, f ?? void 0);
      if (ce) {
        K.shiftKey ? I([
          ce.rulerId
        ]) : K.metaKey || K.ctrlKey ? N(ce.rulerId) : T(ce.rulerId), O(ce);
        return;
      }
      const ge = cb(ke, L, d, o, i, f ?? void 0);
      if (ge) {
        K.shiftKey ? I([
          ge
        ]) : K.metaKey || K.ctrlKey ? N(ge) : m.has(ge) ? U(te) : T(ge);
        return;
      }
      if (f) {
        const je = _(te);
        if (W(null), je && n && r) {
          const j = new i2(je);
          ue.getState().pushCommand(j);
        }
      } else m.size > 0 && !K.shiftKey && !K.metaKey && !K.ctrlKey ? A() : m.size === 0 && S(te);
    }, [
      l,
      n,
      r,
      d,
      o,
      i,
      f,
      m,
      S,
      _,
      O,
      T,
      N,
      I,
      A,
      U,
      W
    ]), fe = g.useCallback((K) => {
      const ye = K.currentTarget.getBoundingClientRect(), ke = K.clientX - ye.left, L = K.clientY - ye.top, z = l(ke, L);
      if (!z) return;
      const Z = Kf(n), Q = Ff(ke, L, z.x, z.y, Z, o, i, K.shiftKey), te = Q.point;
      if (x) {
        B(te), W(Q.isGeometrySnap ? te : null);
        return;
      }
      if (v) {
        E(v.rulerId, v.endpoint, te), W(Q.isGeometrySnap ? te : null);
        return;
      }
      if (f) {
        C(te), W(Q.isGeometrySnap ? te : null);
        return;
      }
      const ce = ib(ke, L, d, o, i);
      k(ce);
      const ge = ce ? ce.rulerId : cb(ke, L, d, o, i);
      D(ge), !ce && !ge && m.size === 0 ? W(Q.isGeometrySnap ? te : null) : W(null);
    }, [
      l,
      n,
      d,
      o,
      i,
      f,
      v,
      x,
      m,
      C,
      E,
      B,
      k,
      D,
      W
    ]), xe = g.useCallback(() => {
      if (v) {
        const K = R();
        if (W(null), K && n && r) {
          const me = new D0(K.rulerId, K.endpoint, K.oldPosition, K.newPosition);
          ue.getState().pushCommand(me);
        }
      }
      if (x) {
        const K = ne();
        if (K && n && r) {
          const me = new I0(K.rulerIds, K.deltaX, K.deltaY);
          ue.getState().pushCommand(me);
        }
      }
    }, [
      v,
      x,
      R,
      ne,
      n,
      r,
      W
    ]), $ = g.useCallback(() => {
      b(), k(null), D(null), O(null), W(null);
    }, [
      b,
      k,
      D,
      O,
      W
    ]);
    return {
      handleMouseDown: J,
      handleMouseMove: fe,
      handleMouseUp: xe,
      cancelDrawing: $,
      isCreating: f !== null,
      isDraggingEndpoint: v !== null,
      isMovingRuler: x,
      hoveredRulerId: p,
      selectedRulerIds: m
    };
  }
  const Ui = "#ff0000", Kd = 4;
  function VC() {
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
        backgroundColor: Ui,
        boxShadow: `
          0 0 ${Kd}px ${Ui},
          0 0 ${Kd * 2}px ${Ui},
          0 0 ${Kd * 3}px ${Ui}`,
        opacity: 0.9,
        left: 0,
        top: 0,
        transform: `translate(${l.x - 4}px, ${l.y - 4}px)`,
        willChange: "transform"
      }
    });
  }
  const $C = "rgba(46, 229, 120, 0.1)", qC = "rgba(46, 229, 120, 0.6)";
  function ub({ box: l }) {
    const n = l.width >= 0 ? l.x : l.x + l.width, r = l.height >= 0 ? l.y : l.y + l.height, o = Math.abs(l.width), i = Math.abs(l.height);
    return o < 2 && i < 2 ? null : y.jsx("div", {
      className: "pointer-events-none absolute",
      style: {
        left: n,
        top: r,
        width: o,
        height: i,
        backgroundColor: $C,
        border: `1px solid ${qC}`
      }
    });
  }
  const GC = "rgba(59, 130, 246, 0.1)", PC = "rgba(59, 130, 246, 0.6)";
  function ZC({ box: l }) {
    const n = l.width >= 0 ? l.x : l.x + l.width, r = l.height >= 0 ? l.y : l.y + l.height, o = Math.abs(l.width), i = Math.abs(l.height);
    return o < 2 && i < 2 ? null : y.jsx("div", {
      className: "pointer-events-none absolute",
      style: {
        left: n,
        top: r,
        width: o,
        height: i,
        backgroundColor: GC,
        border: `1px solid ${PC}`
      }
    });
  }
  function KC({ points: l, cursorPoint: n, isNearStart: r, alignmentGuides: o }) {
    var _a;
    const { zoom: i, offset: c } = Ue(), d = ve((R) => R.activeLayerId), p = ((_a = ve((R) => R.layers).get(d)) == null ? void 0 : _a.color) ?? "#888888", v = (R) => ({
      x: R.x * i + c.x,
      y: R.y * i + c.y
    });
    if (l.length === 0) return null;
    const S = (n ? [
      ...l,
      n
    ] : l).map(v), C = S.map((R, T) => `${T === 0 ? "M" : "L"} ${R.x} ${R.y}`).join(" "), _ = l.length >= 3 && n ? `M ${S[S.length - 1].x} ${S[S.length - 1].y} L ${S[0].x} ${S[0].y}` : "", b = S[0], E = n ? v(n) : null, k = (o == null ? void 0 : o.alignedVertexX) ? v(o.alignedVertexX) : null, O = (o == null ? void 0 : o.alignedVertexY) ? v(o.alignedVertexY) : null;
    return y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        E && k && y.jsx("line", {
          x1: k.x,
          y1: k.y,
          x2: E.x,
          y2: E.y,
          stroke: Xn.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        E && O && y.jsx("line", {
          x1: O.x,
          y1: O.y,
          x2: E.x,
          y2: E.y,
          stroke: Xn.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        r && y.jsx("circle", {
          cx: b.x,
          cy: b.y,
          r: 9,
          fill: "none",
          stroke: p,
          strokeWidth: 1.5,
          opacity: 0.5,
          className: "animate-pulse"
        }),
        y.jsx("path", {
          d: C,
          fill: "none",
          stroke: p,
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        _ && y.jsx("path", {
          d: _,
          fill: "none",
          stroke: p,
          strokeWidth: r ? 2 : 1,
          strokeDasharray: r ? "none" : "4 4",
          strokeLinecap: "round",
          opacity: r ? 0.8 : 0.5
        }),
        l.map((R, T) => {
          const N = S[T];
          return y.jsx("circle", {
            cx: N.x,
            cy: N.y,
            r: T === 0 ? 4 : 2.5,
            fill: T === 0 ? p : "white",
            stroke: p,
            strokeWidth: 1
          }, T);
        })
      ]
    });
  }
  function FC({ waypoints: l, cursorPoint: n, alignmentGuides: r }) {
    var _a;
    const { zoom: o, offset: i } = Ue(), c = ve((D) => D.activeLayerId), d = ve((D) => D.layers), f = tt((D) => D.width), m = tt((D) => D.cornerRadius), p = tt((D) => D.numArcPoints), x = ((_a = d.get(c)) == null ? void 0 : _a.color) ?? "#888888", S = (D) => ({
      x: D.x * o + i.x,
      y: D.y * o + i.y
    });
    if (l.length === 0) return null;
    const C = l[l.length - 1], _ = n && C && Math.abs(n.x - C.x) < 1e-6 && Math.abs(n.y - C.y) < 1e-6, b = n && !_ ? [
      ...l,
      n
    ] : l, E = b.map(S), k = E.map((D, U) => `${U === 0 ? "M" : "L"} ${D.x} ${D.y}`).join(" "), R = r2(b, f, m, p).map(S), T = R.length > 0 ? R.map((D, U) => `${U === 0 ? "M" : "L"} ${D.x} ${D.y}`).join(" ") + " Z" : "", N = n ? S(n) : null, I = (r == null ? void 0 : r.alignedVertexX) ? S(r.alignedVertexX) : null, A = (r == null ? void 0 : r.alignedVertexY) ? S(r.alignedVertexY) : null;
    return y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        N && I && y.jsx("line", {
          x1: I.x,
          y1: I.y,
          x2: N.x,
          y2: N.y,
          stroke: Xn.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        N && A && y.jsx("line", {
          x1: A.x,
          y1: A.y,
          x2: N.x,
          y2: N.y,
          stroke: Xn.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        T && y.jsx("path", {
          d: T,
          fill: x,
          fillOpacity: 0.15,
          stroke: "none"
        }),
        T && y.jsx("path", {
          d: T,
          fill: "none",
          stroke: x,
          strokeWidth: 1,
          strokeOpacity: 0.4
        }),
        y.jsx("path", {
          d: k,
          fill: "none",
          stroke: x,
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        l.map((D, U) => {
          const B = E[U];
          return y.jsx("circle", {
            cx: B.x,
            cy: B.y,
            r: U === 0 ? 4 : 2.5,
            fill: U === 0 ? x : "white",
            stroke: x,
            strokeWidth: 1
          }, U);
        })
      ]
    });
  }
  function bh(l) {
    const n = 1 / (l * be), r = s0 * n;
    return r >= My ? {
      unit: "mm",
      scale: My
    } : r >= jy ? {
      unit: "\xB5m",
      scale: jy
    } : {
      unit: "nm",
      scale: 1
    };
  }
  function QC(l) {
    return Number.isFinite(l) ? l : 0;
  }
  function ot(l, n) {
    const r = QC(l) / n.scale;
    return Math.abs(r) >= 1e6 ? r.toExponential(3) : r.toFixed(3);
  }
  const WC = {
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
  }, db = 3, fb = 5, JC = 6, e5 = {
    dark: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: Xn.dark
    },
    light: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: Xn.light
    }
  };
  function t5(l, n) {
    const r = Math.abs(n.x - l.x) / be, o = Math.abs(n.y - l.y) / be, i = Math.sqrt(r * r + o * o);
    return {
      dx: r,
      dy: o,
      diagonal: i
    };
  }
  function n5({ point: l, worldToScreen: n, theme: r }) {
    const o = e5[r], i = n(l), c = JC;
    return y.jsxs("g", {
      children: [
        y.jsx("circle", {
          cx: i.x,
          cy: i.y,
          r: c,
          fill: o.fill,
          stroke: o.stroke,
          strokeWidth: 2
        }),
        y.jsx("line", {
          x1: i.x - c - 2,
          y1: i.y,
          x2: i.x + c + 2,
          y2: i.y,
          stroke: o.stroke,
          strokeWidth: 1.5
        }),
        y.jsx("line", {
          x1: i.x,
          y1: i.y - c - 2,
          x2: i.x,
          y2: i.y + c + 2,
          stroke: o.stroke,
          strokeWidth: 1.5
        })
      ]
    });
  }
  function l5({ ruler: l, worldToScreen: n, hoveredEndpoint: r, isSelected: o, isHovered: i, isDragging: c, theme: d, zoom: f }) {
    const m = WC[d], p = Xn[d], v = n(l.start), x = n(l.end), S = o ? p : i ? m.hover : m.line, C = o ? p : i ? m.hover : m.border, _ = o || i || c ? 2 : 1.5, b = {
      x: (v.x + x.x) / 2,
      y: (v.y + x.y) / 2
    }, { dx: E, dy: k, diagonal: O } = t5(l.start, l.end), R = bh(f), T = `${ot(E, R)} ${R.unit}`, N = `${ot(k, R)} ${R.unit}`, I = `${ot(O, R)} ${R.unit}`, A = 140, D = 56;
    return y.jsxs("g", {
      children: [
        y.jsx("line", {
          x1: v.x,
          y1: v.y,
          x2: x.x,
          y2: x.y,
          stroke: S,
          strokeWidth: _,
          strokeDasharray: "6 4",
          strokeLinecap: "round"
        }),
        y.jsx("foreignObject", {
          x: b.x - A / 2,
          y: b.y - D / 2,
          width: A,
          height: D,
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
                border: `1px solid ${C}`,
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
                    N
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
                    I
                  ]
                })
              ]
            })
          })
        }),
        y.jsx("circle", {
          cx: v.x,
          cy: v.y,
          r: r === "start" ? fb : db,
          fill: o ? p : r === "start" ? m.hover : m.endpoint,
          stroke: o ? p : r === "start" ? m.hover : "none",
          strokeWidth: r === "start" || o ? 2 : 0,
          style: {
            transition: "r 0.1s, fill 0.1s"
          }
        }),
        y.jsx("circle", {
          cx: x.x,
          cy: x.y,
          r: r === "end" ? fb : db,
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
  function r5() {
    const { zoom: l, offset: n } = Ue(), r = he((S) => S.theme), { rulers: o, activeRulerId: i, selectedRulerIds: c, hoveredRulerId: d, marqueePreviewIds: f, hoveredEndpoint: m, draggingEndpoint: p, snapPoint: v } = Ie(), x = (S) => ({
      x: S.x * l + n.x,
      y: S.y * l + n.y
    });
    return o.size === 0 && !v ? null : y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        Array.from(o.values()).map((S) => {
          const C = S.id === i, _ = c.has(S.id), b = S.id === d || f.has(S.id), E = (m == null ? void 0 : m.rulerId) === S.id, k = (p == null ? void 0 : p.rulerId) === S.id;
          return y.jsx(l5, {
            ruler: S,
            worldToScreen: x,
            hoveredEndpoint: E ? m.endpoint : k ? p.endpoint : null,
            isSelected: _,
            isHovered: b && !_,
            isDragging: k || C,
            theme: r,
            zoom: l
          }, S.id);
        }),
        v && y.jsx(n5, {
          point: v,
          worldToScreen: x,
          theme: r
        })
      ]
    });
  }
  const hb = "ref:";
  function n1(l) {
    if (!l.startsWith(hb)) return null;
    const n = l.slice(hb.length), r = n.indexOf(":");
    if (r === -1) return null;
    const o = Number.parseInt(n.slice(0, r), 10);
    return Number.isNaN(o) ? null : o;
  }
  function a5(l) {
    const n = /* @__PURE__ */ new Set();
    for (const r of l) {
      const o = n1(r);
      o !== null && n.add(o);
    }
    return n;
  }
  const Un = 9;
  function o5(l, n, r, o) {
    if (!l) return null;
    const i = `ref:${n}:0`, c = l.get_cell_ref_info(i);
    if (!c) return null;
    const [d, f, m, p, v, x] = c.transform, S = c.cell_name;
    c.free();
    const C = l.get_cell_origin_by_name(S), _ = C ? C[0] : 0, b = C ? C[1] : 0, E = d * _ + f * b + v, k = m * _ + p * b + x;
    return {
      x: E * r + o.x,
      y: k * r + o.y
    };
  }
  function s5() {
    const { zoom: l, offset: n } = Ue(), r = we((x) => x.library), i = he((x) => x.theme) === "dark";
    we((x) => x.syncGeneration), de((x) => x.activeCell);
    const c = ie((x) => x.selectedIds), d = ie((x) => x.hoveredId), f = a5(c);
    if (d) {
      const x = n1(d);
      x !== null && f.add(x);
    }
    if (f.size === 0) return null;
    let m = [];
    if (r) try {
      const x = r.get_instance_label_data();
      x && Array.isArray(x) && (m = x);
    } catch {
      return null;
    }
    const p = m.filter((x) => f.has(x.elementIndex));
    if (p.length === 0) return null;
    const v = i ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
    return y.jsx(y.Fragment, {
      children: p.map((x) => {
        const S = x.minX * l + n.x, C = x.minY * l + n.y, _ = o5(r, x.elementIndex, l, n);
        return y.jsxs("div", {
          children: [
            y.jsx("div", {
              className: Y("pointer-events-none absolute text-[13px] leading-none font-mono select-none", i ? "text-white" : "text-black"),
              style: {
                left: `${S}px`,
                top: `${C}px`,
                transform: "translateY(-100%)",
                paddingBottom: "2px"
              },
              children: x.name
            }),
            _ && y.jsxs("svg", {
              className: "pointer-events-none absolute top-0 left-0 select-none",
              style: {
                width: `${Un * 2 + 1}px`,
                height: `${Un * 2 + 1}px`,
                transform: `translate(${_.x - Un}px, ${_.y - Un}px)`
              },
              viewBox: `0 0 ${Un * 2 + 1} ${Un * 2 + 1}`,
              children: [
                y.jsx("line", {
                  x1: "0",
                  y1: Un,
                  x2: Un * 2,
                  y2: Un,
                  stroke: v,
                  strokeWidth: "1"
                }),
                y.jsx("line", {
                  x1: Un,
                  y1: "0",
                  x2: Un,
                  y2: Un * 2,
                  stroke: v,
                  strokeWidth: "1"
                })
              ]
            })
          ]
        }, `inst-${x.elementIndex}`);
      })
    });
  }
  function i5(l, n) {
    const r = n / ch, o = l.split(`
`), i = Math.max(1, ...o.map((f) => f.length)), c = r * 0.6 * i, d = r * 1.2 * o.length;
    return {
      width: c,
      totalHeight: d
    };
  }
  function c5({ label: l, zoom: n, offset: r, color: o, isSelected: i, isHovered: c }) {
    const d = l.height / ch * n;
    if (d < 1) return null;
    const { width: f, totalHeight: m } = i5(l.text, l.height), p = l.x * n + r.x, v = (l.y - m) * n + r.y, x = i || c;
    let S;
    if (x) {
      const C = f * n, _ = m * n, b = i ? "rgba(68, 255, 68, 0.8)" : o;
      S = {
        position: "absolute",
        left: "-3px",
        top: "-3px",
        width: `${C + 6}px`,
        height: `${_ + 6}px`,
        border: `1.5px solid ${b}`,
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
        fontFamily: c0,
        color: i ? "rgb(68, 255, 68)" : o
      },
      children: [
        x && y.jsx("div", {
          style: S
        }),
        l.text
      ]
    });
  }
  function u5({ zoom: l, offset: n, color: r }) {
    const o = rn((k) => k.activeText), i = rn((k) => k.showCursor);
    if (!o) return null;
    const c = i0 * be / ch * l;
    if (c < 1) return null;
    const d = c * 1.2, f = c * 0.6, m = o.content.split(`
`), p = d * Math.max(1, m.length), v = o.x * l + n.x, x = o.y * l + n.y - p, S = yh(o.selection), C = o.cursorPosition.line, b = o.cursorPosition.column * f, E = C * d;
    return y.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0 select-none",
      style: {
        transform: `translate(${v}px, ${x}px)`,
        fontSize: `${c}px`,
        lineHeight: `${d}px`,
        fontFamily: c0,
        color: r
      },
      children: [
        m.map((k, O) => {
          if (!(S && O >= S.start.line && O <= S.end.line)) return y.jsx("div", {
            style: {
              height: `${d}px`,
              whiteSpace: "pre"
            },
            children: k || "\u200B"
          }, O);
          const T = O === S.start.line ? S.start.column : 0, N = O === S.end.line ? S.end.column : k.length, I = k.substring(0, T), A = k.substring(T, N), D = k.substring(N);
          return y.jsxs("div", {
            style: {
              height: `${d}px`,
              whiteSpace: "pre"
            },
            children: [
              I && y.jsx("span", {
                children: I
              }),
              A && y.jsx("span", {
                style: {
                  backgroundColor: "rgba(65, 105, 225, 0.7)",
                  color: "#ffffff"
                },
                children: A
              }),
              D && y.jsx("span", {
                children: D
              }),
              !k && "\u200B"
            ]
          }, O);
        }),
        i && y.jsx("div", {
          className: "absolute",
          style: {
            left: `${b}px`,
            top: `${E}px`,
            width: "2px",
            height: `${d}px`,
            backgroundColor: r
          }
        })
      ]
    });
  }
  function d5() {
    var _a;
    const { zoom: l, offset: n } = Ue(), r = we((k) => k.library), i = he((k) => k.theme) === "dark", c = rn((k) => k.isEditingText), d = we((k) => k.syncGeneration), f = de((k) => k.activeCell), m = ie((k) => k.selectedIds), p = ie((k) => k.hoveredId), v = ve((k) => k.layers), x = ve((k) => k.activeLayerId), S = g.useMemo(() => {
      if (!r) return [];
      try {
        const k = r.get_text_labels();
        if (k && Array.isArray(k)) return k;
      } catch {
      }
      return [];
    }, [
      r,
      d,
      f
    ]), _ = ((_a = v.get(x)) == null ? void 0 : _a.color) ?? (i ? "#ffffff" : "#000000"), b = (k, O) => {
      for (const R of v.values()) if (R.layerNumber === k && R.datatype === O) return R.color;
      return i ? "#ffffff" : "#000000";
    };
    return S.length > 0 || c ? y.jsxs("div", {
      className: Y("pointer-events-none absolute inset-0 overflow-hidden"),
      children: [
        S.map((k) => y.jsx(c5, {
          label: k,
          zoom: l,
          offset: n,
          color: b(k.layer, k.datatype),
          isSelected: m.has(k.id),
          isHovered: p === k.id
        }, k.id)),
        c && y.jsx(u5, {
          zoom: l,
          offset: n,
          color: _
        })
      ]
    }) : null;
  }
  function f5() {
    const { zoom: l, offset: n } = Ue(), r = ie((S) => S.selectedIds), o = ie((S) => S.hoveredId), i = tt((S) => S.pathMetadata), c = he((S) => S.theme), d = c === "dark" ? Xn.dark : Xn.light, f = c === "dark" ? ac.dark : ac.light, m = (S) => ({
      x: S.x * l + n.x,
      y: S.y * l + n.y
    }), p = [];
    for (const S of r) {
      const C = i.get(S);
      C && C.waypoints.length >= 2 && p.push({
        meta: C,
        color: d
      });
    }
    let v = null;
    if (o && !r.has(o)) {
      const S = i.get(o);
      S && S.waypoints.length >= 2 && (v = {
        meta: S,
        color: f
      });
    }
    const x = v ? [
      ...p,
      v
    ] : p;
    return x.length === 0 ? null : y.jsx("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: x.map(({ meta: S, color: C }, _) => {
        const b = S.waypoints.map(m), E = b.map((k, O) => `${O === 0 ? "M" : "L"} ${k.x} ${k.y}`).join(" ");
        return y.jsxs("g", {
          children: [
            y.jsx("path", {
              d: E,
              fill: "none",
              stroke: C,
              strokeWidth: 1,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeOpacity: 0.8
            }),
            b.map((k, O) => y.jsx("circle", {
              cx: k.x,
              cy: k.y,
              r: 3,
              fill: C,
              fillOpacity: 0.9
            }, O))
          ]
        }, _);
      })
    });
  }
  function h5({ entry: l, zoom: n, offset: r, isSelected: o, isHovered: i, isDark: c }) {
    const d = l.x * n + r.x, f = l.y * n + r.y, m = l.width * n, p = l.height * n;
    if (m < 1 && p < 1) return null;
    const v = o || i, x = o ? "rgba(68, 255, 68, 0.8)" : c ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
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
            border: `1.5px solid ${x}`
          }
        })
      ]
    });
  }
  function m5() {
    const { zoom: l, offset: n } = Ue(), r = Vt((f) => f.images), o = ie((f) => f.selectedIds), i = ie((f) => f.hoveredId), d = he((f) => f.theme) === "dark";
    return r.size === 0 ? null : y.jsx("div", {
      className: Y("pointer-events-none absolute inset-0 overflow-hidden"),
      children: [
        ...r.values()
      ].map((f) => {
        const m = fs(f.id);
        return y.jsx(h5, {
          entry: f,
          zoom: l,
          offset: n,
          isSelected: o.has(m),
          isHovered: i === m,
          isDark: d
        }, f.id);
      })
    });
  }
  function Kr(l, n) {
    g.useEffect(() => {
      if (n) return Pf.getState().claim(l), () => {
        Pf.getState().release(l);
      };
    }, [
      l,
      n
    ]);
  }
  function g5(l) {
    return "separator" in l && l.separator;
  }
  function p5({ library: l, renderer: n, canvasRef: r }) {
    const o = g.useRef(null), { isOpen: i, position: c, variant: d, targetId: f, close: m } = ds(), { selectedIds: p } = ie(), { hasContent: v } = Vn(), S = he((R) => R.theme) === "dark";
    Kr("context-menu", i);
    const C = l ? l.get_all_ids().length > 0 : false, _ = p.size > 0, E = g.useCallback(() => {
      const R = () => {
        if (!l) return;
        const D = Yl(l, p);
        Vn.getState().copy(D), m();
      }, T = () => {
        if (!l || !n) return;
        const D = new yc();
        ue.getState().execute(D, {
          library: l,
          renderer: n
        });
        const U = r.current;
        U && qr(l, U), m();
      }, N = () => {
        if (!l || !n || p.size === 0) return;
        const D = new bc([
          ...p
        ]);
        ue.getState().execute(D, {
          library: l,
          renderer: n
        });
        const U = r.current;
        U && qr(l, U), m();
      }, I = () => {
        if (!l || !n || p.size === 0) return;
        const D = new pc([
          ...p
        ]);
        ue.getState().execute(D, {
          library: l,
          renderer: n
        }), m();
      }, A = () => {
        if (!l) return;
        const D = l.get_all_ids();
        ie.getState().selectAll(D), m();
      };
      if (d === "element") return [
        {
          id: "edit",
          label: "Edit",
          shortcut: {
            key: "E"
          },
          action: () => {
            he.getState().requestInspectorFocus(), m();
          },
          disabled: !_
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
              ze.mod
            ],
            key: "C"
          },
          action: R,
          disabled: !_
        },
        {
          id: "paste",
          label: "Paste",
          shortcut: {
            modifiers: [
              ze.mod
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
              ze.mod
            ],
            key: "B"
          },
          action: N,
          disabled: !_
        },
        {
          id: "sep1",
          separator: true
        },
        {
          id: "delete",
          label: "Delete",
          shortcut: {
            key: ze.backspace
          },
          action: I,
          disabled: !_
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
              ze.mod
            ],
            key: "A"
          },
          action: A,
          disabled: !C
        }
      ];
      if (d === "ruler") {
        const D = () => {
          if (!l || !n) return;
          const { selectedRulerIds: U } = Ie.getState();
          if (U.size > 0) {
            const B = new vc([
              ...U
            ]);
            ue.getState().execute(B, {
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
                ze.mod
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
              key: ze.backspace
            },
            action: D,
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
                ze.mod
              ],
              key: "A"
            },
            action: A,
            disabled: true
          }
        ];
      }
      if (d === "image") {
        const D = () => {
          he.getState().requestInspectorFocus(), m();
        }, U = () => {
          if (!l || !n) return;
          const B = [
            ...p
          ].filter(jn).map(Gr);
          if (B.length > 0) {
            const ne = new K0(B);
            ue.getState().execute(ne, {
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
            action: D,
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
              key: ze.backspace
            },
            action: U,
            disabled: false
          }
        ];
      }
      if (d === "layer") {
        const D = f ? Number(f) : null, U = ve.getState(), B = D !== null ? U.getLayer(D) : void 0, ne = U.layers.size <= 1, W = () => {
          if (!l || !n) return;
          const z = new z0();
          ue.getState().execute(z, {
            library: l,
            renderer: n
          }), m();
        }, J = () => {
          D !== null && ve.getState().setEditingLayerId(D), m();
        }, fe = () => {
          D !== null && ve.getState().toggleVisibility(D), m();
        }, xe = () => {
          if (!l || !n || D === null) return;
          const z = new hh(D);
          ue.getState().execute(z, {
            library: l,
            renderer: n
          }), m();
        }, $ = Array.from(U.layers.values()), K = $.every((z) => z.visible), me = $.every((z) => !z.visible), ye = () => {
          ve.getState().showAllLayers(), m();
        }, ke = () => {
          ve.getState().hideAllLayers(), m();
        };
        return [
          {
            id: "editLayer",
            label: "Edit Layer",
            action: () => {
              D !== null && (ve.getState().setExpandedLayerId(D), ve.getState().setActiveLayer(D), he.getState().setSidebarTab("layers")), m();
            },
            disabled: !B
          },
          {
            id: "addLayer",
            label: "Add Layer",
            action: W,
            disabled: false
          },
          {
            id: "rename",
            label: "Rename Layer",
            action: J,
            disabled: !B
          },
          {
            id: "toggleVisibility",
            label: (B == null ? void 0 : B.visible) ? "Hide Layer" : "Show Layer",
            action: fe,
            disabled: !B
          },
          {
            id: "sep1",
            separator: true
          },
          {
            id: "showAll",
            label: "Show All Layers",
            action: ye,
            disabled: K
          },
          {
            id: "hideAll",
            label: "Hide All Layers",
            action: ke,
            disabled: me
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "delete",
            label: "Delete Layer",
            action: xe,
            disabled: !B || ne
          }
        ];
      }
      if (d === "cell") {
        const D = f, U = de.getState(), B = U.cells.length <= 1, ne = () => {
          if (!l || !n) return;
          const L = uh(), z = new mh(L);
          ue.getState().execute(z, {
            library: l,
            renderer: n
          }), he.getState().explorerCollapsed && he.getState().toggleExplorerCollapsed(), de.getState().setActiveCell(L), de.getState().setEditingCellName(L), m();
        }, W = () => {
          D && de.getState().setEditingCellName(D), m();
        }, J = () => {
          if (!l || !n || !D) return;
          const L = new gh(D);
          ue.getState().execute(L, {
            library: l,
            renderer: n
          }), m();
        }, fe = D ? U.hiddenCells.has(D) : false, xe = () => {
          D && de.getState().toggleCellVisibility(D), m();
        }, $ = U.cells, K = $.every((L) => !U.hiddenCells.has(L)), me = $.every((L) => U.hiddenCells.has(L));
        return [
          {
            id: "addCell",
            label: "Add Cell",
            action: ne,
            disabled: !D
          },
          {
            id: "rename",
            label: "Rename Cell",
            action: W,
            disabled: !D
          },
          {
            id: "toggleVisibility",
            label: fe ? "Show Cell" : "Hide Cell",
            action: xe,
            disabled: !D
          },
          {
            id: "sep1",
            separator: true
          },
          {
            id: "showAllCells",
            label: "Show All Cells",
            action: () => {
              de.getState().showAllCells(), m();
            },
            disabled: K
          },
          {
            id: "hideAllCells",
            label: "Hide All Cells",
            action: () => {
              de.getState().hideAllCells(), m();
            },
            disabled: me
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "viewFlat",
            label: `${U.cellListMode === "flat" ? "\u2713  " : "     "}Flat List`,
            action: () => {
              const { cellListMode: L, setCellListMode: z } = de.getState();
              z(L === "flat" ? "nested" : "flat"), m();
            },
            disabled: false
          },
          {
            id: "sep3",
            separator: true
          },
          {
            id: "delete",
            label: "Delete Cell",
            action: J,
            disabled: !D || B
          }
        ];
      }
      return [
        {
          id: "paste",
          label: "Paste",
          shortcut: {
            modifiers: [
              ze.mod
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
              ze.mod
            ],
            key: "A"
          },
          action: A,
          disabled: !C
        }
      ];
    }, [
      d,
      l,
      n,
      p,
      _,
      v,
      C,
      m,
      r,
      f
    ])();
    g.useEffect(() => {
      if (!i) return;
      const R = (T) => {
        o.current && !o.current.contains(T.target) && m();
      };
      return document.addEventListener("mousedown", R), () => document.removeEventListener("mousedown", R);
    }, [
      i,
      m
    ]), g.useEffect(() => {
      if (!i) return;
      const R = (T) => {
        T.key === "Escape" && (T.preventDefault(), m());
      };
      return document.addEventListener("keydown", R), () => document.removeEventListener("keydown", R);
    }, [
      i,
      m
    ]);
    const [k, O] = g.useState(c);
    return g.useLayoutEffect(() => {
      if (!i || !o.current) {
        O(c);
        return;
      }
      const T = o.current.getBoundingClientRect(), N = 8;
      let { x: I, y: A } = c;
      I + T.width + N > window.innerWidth && (I = window.innerWidth - T.width - N), A + T.height + N > window.innerHeight && (A = window.innerHeight - T.height - N), I < N && (I = N), A < N && (A = N), O({
        x: I,
        y: A
      });
    }, [
      i,
      c
    ]), i ? y.jsx("div", {
      ref: o,
      className: Y("fixed z-50 min-w-[170px] rounded-xl border py-1", S ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      style: {
        left: k.x,
        top: k.y
      },
      children: E.map((R) => {
        var _a;
        if (g5(R)) return y.jsx("div", {
          className: Y("my-1 h-px", S ? "bg-white/10" : "bg-black/10")
        }, R.id);
        const T = R;
        return y.jsxs("button", {
          className: Y("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs", "transition-colors", T.disabled ? "opacity-40" : S ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
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
                (_a = T.shortcut.modifiers) == null ? void 0 : _a.map((N) => y.jsx("kbd", {
                  className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", S ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: N
                }, N)),
                y.jsx("kbd", {
                  className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", S ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: T.shortcut.key
                })
              ]
            })
          ]
        }, T.id);
      })
    }) : null;
  }
  const mb = "rosette-canvas";
  function gb() {
    const l = g.useRef(null), n = g.useRef(null), r = g.useRef({
      x: 0,
      y: 0
    }), o = g.useRef(null), i = g.useRef(null), [c, d] = g.useState(false), [f, m] = g.useState(false), [p, v] = g.useState(null), x = g.useRef(false), S = g.useRef(null), { wasm: C, isReady: _ } = o0(), { renderer: b, isReady: E, render: k, resize: O, screenToWorld: R, error: T } = AS(c ? mb : null), { library: N } = n2(C, _);
    g.useEffect(() => (we.getState().setLibrary(N), () => we.getState().setLibrary(null)), [
      N
    ]), g.useEffect(() => (we.getState().setRenderer(b), () => we.getState().setRenderer(null)), [
      b
    ]);
    const { zoomAt: I, pan: A, initOffset: D, zoom: U, offset: B } = Ue(), ne = he((le) => le.setCursorWorld), W = he((le) => le.theme), J = Gt((le) => le.activeTool), { handleMouseDown: fe, handleMouseMove: xe, handleMouseUp: $, isLaserActive: K } = uC(b, E), { handleMouseDown: me, handleMouseMove: ye, handleMouseUp: ke, box: L, isZoomActive: z, isDrawingZoom: Z } = fC(n), { handleMouseDown: Q, handleMouseMove: te, finalizeRectangle: ce, cancelDrawing: ge } = hC(R, N, b), { handleMouseDown: je, handleMouseMove: j, handleMouseUp: ee, handleMouseLeave: oe, hoveredId: pe, hoveredRulerId: Ee, marqueeBox: Se, isDrawingMarquee: Be } = _C(R, N, b), { handleMouseDown: Qe, handleMouseMove: Ce, handleMouseUp: Xe, handleMouseLeave: Re, hoveredRulerId: nt } = RC(R, N, b), { handleMouseDown: Te, handleMouseMove: lt, cancelDrawing: wt, points: st, cursorPoint: sn, isNearStart: ul, alignmentGuides: dl } = gC(R, N, b, U), { handleMouseDown: Rn, handleMouseMove: ct, cancelDrawing: Rt, waypoints: cn, cursorPoint: qn, alignmentGuides: Kt } = yC(R, N, b, U), { handleMouseDown: St, handleMouseMove: Pt, handleMouseUp: zt, cancelDrawing: Ul, isCreating: Ka, isDraggingEndpoint: Fa, isMovingRuler: Qr, hoveredRulerId: Wr } = XC(R, N, b, U, B), { handleMouseDown: wr, handleMouseMove: el, cancelEditing: Sr, isEditing: Cr } = IC(R, N, b);
    g.useEffect(() => {
      const le = l.current, Oe = n.current;
      if (!le || !Oe) return;
      const ut = () => {
        const Je = le.getBoundingClientRect(), We = Math.floor(Je.width), et = Math.floor(Je.height);
        if (We > 0 && et > 0) {
          const Ne = window.devicePixelRatio || 1;
          Oe.width = Math.floor(We * Ne), Oe.height = Math.floor(et * Ne), Oe.style.width = `${We}px`, Oe.style.height = `${et}px`, D(We, et), c || d(true), O(Math.floor(We * Ne), Math.floor(et * Ne)), k();
        }
      };
      ut();
      const He = new ResizeObserver(ut);
      return He.observe(le), () => He.disconnect();
    }, [
      O,
      k,
      c,
      D
    ]), g.useEffect(() => {
      if (!E) return;
      let le;
      const Oe = () => {
        k(), le = requestAnimationFrame(Oe);
      };
      return Oe(), () => cancelAnimationFrame(le);
    }, [
      E,
      k
    ]);
    const kc = ve((le) => le.layers);
    g.useEffect(() => {
      !b || !N || (b.sync_from_library(N), b.mark_dirty());
    }, [
      b,
      N,
      kc
    ]);
    const Er = de((le) => le.activeCell);
    g.useEffect(() => {
      if (!N || !b || !Er) return;
      N.active_cell_name() !== Er && (N.set_active_cell(Er), b.sync_from_library(N), b.mark_dirty(), gs());
    }, [
      N,
      b,
      Er
    ]);
    const _r = de((le) => le.hierarchyLevelLimit);
    g.useEffect(() => {
      if (!N || !b) return;
      const le = _r === 1 / 0 ? 0 : _r;
      N.set_hierarchy_depth_limit(le), b.sync_from_library(N), b.mark_dirty();
    }, [
      N,
      b,
      _r
    ]);
    const fl = de((le) => le.hiddenCells);
    g.useEffect(() => {
      if (!N || !b) return;
      const le = new Set(N.get_hidden_cells());
      for (const Oe of le) fl.has(Oe) || N.set_cell_visibility(Oe, true);
      for (const Oe of fl) le.has(Oe) || N.set_cell_visibility(Oe, false);
      b.sync_from_library(N), b.mark_dirty();
    }, [
      N,
      b,
      fl
    ]);
    const xs = g.useRef(false), Jr = g.useRef(null);
    g.useEffect(() => {
      const le = n.current;
      if (!N || !le) return;
      const Oe = N.get_all_bounds();
      if (!Oe) return;
      const ut = {
        minX: Oe[0],
        minY: Oe[1],
        maxX: Oe[2],
        maxY: Oe[3]
      }, He = yr(le);
      if (He.width <= 0 || He.height <= 0) return;
      const Je = Jr.current !== null && Jr.current !== N;
      if (!xs.current || Je) {
        Ue.getState().zoomToFit(ut, He.width, He.height, He.screenCenter);
        const et = ss() ? QS() : null;
        if (et !== null) {
          const Ne = He.screenCenter ?? {
            x: He.width / 2,
            y: He.height / 2
          };
          Ue.getState().zoomAt(et, Ne.x, Ne.y);
        }
        xs.current = true;
      }
      Jr.current = N;
    }, [
      N
    ]);
    const ea = g.useCallback((le) => {
      le.preventDefault();
      const Oe = n.current;
      if (!Oe) return;
      const ut = Oe.getBoundingClientRect(), He = le.clientX - ut.left, Je = le.clientY - ut.top, We = le.ctrlKey || Math.abs(le.deltaY) < 50;
      let et;
      We ? et = Math.pow(2, -le.deltaY * 0.01) : et = le.deltaY > 0 ? hc : fc, I(et, He, Je);
    }, [
      I
    ]), ws = g.useCallback((le) => {
      if (le.button === 2 && he.getState().rightClickMode === "zoom") {
        const Oe = n.current;
        if (!Oe) return;
        const ut = Oe.getBoundingClientRect(), He = le.clientX - ut.left, Je = le.clientY - ut.top;
        x.current = true;
        const We = {
          x: He,
          y: Je,
          width: 0,
          height: 0
        };
        S.current = We, v(We);
        return;
      }
      if (J === "laser" && le.button === 0) {
        fe(le);
        return;
      }
      if (J === "zoom" && le.button === 0) {
        me(le);
        return;
      }
      if (J === "rectangle" && le.button === 0) {
        Q(le);
        return;
      }
      if (J === "select" && le.button === 0) {
        je(le);
        return;
      }
      if (J === "move" && le.button === 0) {
        Qe(le);
        return;
      }
      if (J === "polygon" && le.button === 0) {
        Te(le);
        return;
      }
      if (J === "path" && le.button === 0) {
        Rn(le);
        return;
      }
      if (J === "ruler" && le.button === 0) {
        St(le);
        return;
      }
      if (J === "text" && le.button === 0) {
        wr(le);
        return;
      }
      (le.button === 1 || le.button === 0 && J === "pan") && (m(true), r.current = {
        x: le.clientX,
        y: le.clientY
      });
    }, [
      J,
      fe,
      me,
      Q,
      je,
      Qe,
      Te,
      Rn,
      St,
      wr
    ]), An = g.useRef(0);
    g.useEffect(() => () => {
      An.current && cancelAnimationFrame(An.current);
    }, []), g.useEffect(() => {
      const le = o.current;
      if (!le) return;
      const Oe = (le.x - B.x) / U, ut = (le.y - B.y) / U, He = Math.trunc(Oe / be), Je = Math.trunc(ut / be);
      ne({
        x: He,
        y: -Je
      });
    }, [
      U,
      B,
      ne
    ]);
    const Qa = g.useCallback((le) => {
      const Oe = n.current;
      if (!Oe) return;
      const ut = Oe.getBoundingClientRect(), He = le.clientX - ut.left, Je = le.clientY - ut.top;
      o.current = {
        x: He,
        y: Je
      };
      let We = false;
      x.current && v((Ne) => {
        if (!Ne) return Ne;
        const Ht = {
          ...Ne,
          width: He - Ne.x,
          height: Je - Ne.y
        };
        return S.current = Ht, Ht;
      }), J === "laser" && xe(le), J === "zoom" && ye(le), J === "rectangle" && te(He, Je) && (We = true), J === "select" && j(le), J === "move" && Ce(le), J === "polygon" && lt(le), J === "path" && ct(le), J === "ruler" && Pt(le), J === "text" && el(le);
      const et = R(He, Je);
      if (i.current = et, An.current === 0 && (An.current = requestAnimationFrame(() => {
        An.current = 0;
        const Ne = i.current;
        if (Ne) {
          const Ht = Math.trunc(Ne.x / be), Ct = Math.trunc(Ne.y / be);
          ne({
            x: Ht,
            y: -Ct
          });
        } else ne(null);
      })), f) {
        const Ne = le.clientX - r.current.x, Ht = le.clientY - r.current.y;
        r.current = {
          x: le.clientX,
          y: le.clientY
        }, A(Ne, Ht);
      }
      We && k();
    }, [
      A,
      R,
      ne,
      f,
      J,
      xe,
      ye,
      te,
      j,
      Ce,
      lt,
      ct,
      Pt,
      el,
      k
    ]), Wa = g.useCallback(() => {
      if (!x.current) return;
      x.current = false;
      const le = S.current;
      if (S.current = null, v(null), !le) return;
      const Oe = n.current;
      if (Math.abs(le.width) > 5 && Math.abs(le.height) > 5 && Oe) {
        const { zoom: ut, offset: He } = Ue.getState(), Je = Math.min(le.x, le.x + le.width), We = Math.max(le.x, le.x + le.width), et = Math.min(le.y, le.y + le.height), Ne = Math.max(le.y, le.y + le.height), Ht = {
          minX: (Je - He.x) / ut,
          maxX: (We - He.x) / ut,
          minY: (et - He.y) / ut,
          maxY: (Ne - He.y) / ut
        }, Ct = yr(Oe);
        Ct.width > 0 && Ct.height > 0 && Ue.getState().zoomToBounds(Ht, Ct.width, Ct.height, Ct.screenCenter);
      }
    }, []), Ss = g.useCallback(() => {
      Wa(), J === "laser" && $(), J === "zoom" && ke(), J === "rectangle" && i.current && ce(i.current.x, i.current.y), J === "select" && ee(), J === "move" && Xe(), J === "ruler" && zt(), m(false);
    }, [
      J,
      Wa,
      $,
      ke,
      ce,
      ee,
      Xe,
      zt
    ]), tl = g.useCallback(() => {
      m(false), x.current && (x.current = false, S.current = null, v(null)), ge(), wt(), Rt(), Ul(), Sr(), oe(), Re(), An.current && (cancelAnimationFrame(An.current), An.current = 0), o.current = null, ne(null);
    }, [
      ne,
      ge,
      wt,
      Rt,
      Ul,
      Sr,
      oe,
      Re
    ]), jt = ds((le) => le.open), tn = g.useCallback((le) => {
      if (le.preventDefault(), he.getState().rightClickMode === "zoom") return;
      const Oe = n.current;
      if (!Oe) return;
      const ut = Oe.getBoundingClientRect(), He = le.clientX - ut.left, Je = le.clientY - ut.top, We = R(He, Je);
      if (!We) return;
      const { rulers: et, selectedRulerIds: Ne, selectRuler: Ht } = Ie.getState();
      for (const ft of et.values()) {
        const Nt = ft.start.x * U + B.x, hn = ft.start.y * U + B.y, Gn = ft.end.x * U + B.x, hl = ft.end.y * U + B.y, ml = (Nt + Gn) / 2, gl = (hn + hl) / 2, pl = 70, nn = 28;
        if (He >= ml - pl && He <= ml + pl && Je >= gl - nn && Je <= gl + nn) {
          Ne.has(ft.id) || Ht(ft.id), jt("ruler", {
            x: le.clientX,
            y: le.clientY
          }, ft.id);
          return;
        }
        const Ft = He - Nt, ta = Je - hn, kr = Gn - Nt, nl = hl - hn, na = Ft * kr + ta * nl, yl = kr * kr + nl * nl;
        if (yl > 0) {
          const Cs = Math.max(0, Math.min(1, na / yl)), mn = Nt + Cs * kr, Ja = hn + Cs * nl, eo = He - mn, la = Je - Ja;
          if (Math.sqrt(eo * eo + la * la) <= 8) {
            Ne.has(ft.id) || Ht(ft.id), jt("ruler", {
              x: le.clientX,
              y: le.clientY
            }, ft.id);
            return;
          }
        }
      }
      if (N) {
        const ft = N.hit_test(We.x, We.y);
        if (ft) {
          const Nt = N.get_group_ids(ft), { selectedIds: hn, setSelection: Gn } = ie.getState();
          Nt.every((ml) => hn.has(ml)) || Gn(new Set(Nt)), jt("element", {
            x: le.clientX,
            y: le.clientY
          }, ft);
          return;
        }
      }
      const Ct = as(We.x, We.y);
      if (Ct) {
        const { selectedIds: ft } = ie.getState();
        ft.has(Ct) || ie.getState().select(Ct), jt("image", {
          x: le.clientX,
          y: le.clientY
        }, Ct);
        return;
      }
      jt("canvas", {
        x: le.clientX,
        y: le.clientY
      });
    }, [
      N,
      R,
      jt,
      U,
      B
    ]), fn = Wi((le) => le.cellName), Bl = g.useRef(null);
    if (g.useEffect(() => {
      if (!fn) return;
      const le = n.current;
      if (!le || !b || !N) return;
      const { bounds: Oe, origin: ut } = Wi.getState(), He = (We) => {
        if (!Oe) return;
        const et = le.getBoundingClientRect(), Ne = We.clientX - et.left, Ht = We.clientY - et.top, Ct = R(Ne, Ht);
        if (!Ct) return;
        const ft = Ct.x - ut.x, Nt = Ct.y - ut.y, hn = Oe[0] + ft, Gn = Oe[1] + Nt, hl = Oe[2] + ft, ml = Oe[3] + Nt, gl = new Float64Array([
          hn,
          Gn,
          hl,
          Gn,
          hl,
          ml,
          hn,
          ml
        ]), pl = new Float32Array([
          0.5,
          0.5,
          0.5,
          0
        ]);
        b.set_preview_shape(gl, pl);
        const { zoom: nn, offset: Ft } = Ue.getState(), ta = 9 / nn, nl = he.getState().theme === "dark" ? new Float32Array([
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
        if (b.set_preview_origin(Ct.x, Ct.y, ta, nl), b.mark_dirty(), Bl.current) {
          const na = hn * nn + Ft.x, yl = Gn * nn + Ft.y;
          Bl.current.style.transform = `translate(${na}px, ${yl}px) translateY(-100%)`, Bl.current.style.display = "block";
        }
      }, Je = (We) => {
        const et = le.getBoundingClientRect(), Ne = We.clientX - et.left, Ht = We.clientY - et.top, Ct = R(Ne, Ht);
        b.clear_preview(), b.mark_dirty();
        const ft = Ne >= 0 && Ht >= 0 && Ne <= et.width && Ht <= et.height;
        if (Ct && ft) {
          const Nt = N.active_cell_name();
          if (Nt && Nt !== fn && N.can_instance_cell(Nt, fn)) {
            const hn = new U0(fn, Ct.x, Ct.y);
            ue.getState().execute(hn, {
              library: N,
              renderer: b
            });
          }
        }
        Wi.getState().endDrag();
      };
      return document.addEventListener("mousemove", He), document.addEventListener("mouseup", Je), () => {
        document.removeEventListener("mousemove", He), document.removeEventListener("mouseup", Je), b.clear_preview(), b.mark_dirty();
      };
    }, [
      fn,
      N,
      b,
      R
    ]), g.useEffect(() => {
      const le = n.current;
      if (le) return le.addEventListener("wheel", ea, {
        passive: false
      }), () => le.removeEventListener("wheel", ea);
    }, [
      ea
    ]), tC(n, N, b), T) return y.jsx("div", {
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
            children: T.message
          }),
          y.jsx("p", {
            className: "mt-4 text-xs opacity-50",
            children: "WebGPU may not be supported in your browser. Try Chrome 113+, Safari 17+, or Edge 113+."
          })
        ]
      })
    });
    const Mc = (() => {
      if (f || Qr) return "cursor-grabbing";
      if (J === "pan") return "cursor-grab";
      if (J === "move") return "cursor-move";
      if (K) return "cursor-none";
      if (z || J === "rectangle" || J === "polygon" || J === "path") return "cursor-crosshair";
      if (J === "text") return Cr ? "cursor-text" : "cursor-crosshair";
      if (J === "ruler") return Fa ? "cursor-grabbing" : Ka ? "cursor-crosshair" : Wr ? "cursor-pointer" : "cursor-crosshair";
      if (J === "select") {
        if (Be) return "cursor-crosshair";
        if (Ee || pe) return "cursor-pointer";
      }
      return "cursor-default";
    })();
    return y.jsxs("div", {
      ref: l,
      className: "relative h-full w-full select-none overflow-hidden",
      children: [
        y.jsx("canvas", {
          ref: n,
          id: mb,
          className: Mc,
          onMouseDown: ws,
          onMouseMove: Qa,
          onMouseUp: Ss,
          onMouseLeave: tl,
          onContextMenu: tn
        }),
        K && !f && y.jsx(VC, {}),
        Z && L && y.jsx(ub, {
          box: L
        }),
        p && y.jsx(ub, {
          box: p
        }),
        Be && Se && y.jsx(ZC, {
          box: Se
        }),
        J === "polygon" && st.length > 0 && y.jsx(KC, {
          points: st,
          cursorPoint: sn,
          isNearStart: ul,
          alignmentGuides: dl
        }),
        J === "path" && cn.length > 0 && y.jsx(FC, {
          waypoints: cn,
          cursorPoint: qn,
          alignmentGuides: Kt
        }),
        fn && y.jsx("div", {
          ref: Bl,
          className: `pointer-events-none absolute top-0 left-0 text-[13px] leading-none font-mono select-none ${W === "dark" ? "text-white" : "text-black"}`,
          style: {
            display: "none",
            paddingBottom: "2px"
          },
          children: fn
        }),
        y.jsx(m5, {}),
        y.jsx(f5, {}),
        y.jsx(s5, {}),
        y.jsx(d5, {}),
        y.jsx(r5, {}),
        y.jsx(p5, {
          library: N,
          renderer: b,
          canvasRef: n
        })
      ]
    });
  }
  var pb = 1, y5 = 0.9, b5 = 0.8, v5 = 0.17, Fd = 0.1, Qd = 0.999, x5 = 0.9999, w5 = 0.99, S5 = /[\\\/_+.#"@\[\(\{&]/, C5 = /[\\\/_+.#"@\[\(\{&]/g, E5 = /[\s-]/, l1 = /[\s-]/g;
  function Jf(l, n, r, o, i, c, d) {
    if (c === n.length) return i === l.length ? pb : w5;
    var f = `${i},${c}`;
    if (d[f] !== void 0) return d[f];
    for (var m = o.charAt(c), p = r.indexOf(m, i), v = 0, x, S, C, _; p >= 0; ) x = Jf(l, n, r, o, p + 1, c + 1, d), x > v && (p === i ? x *= pb : S5.test(l.charAt(p - 1)) ? (x *= b5, C = l.slice(i, p - 1).match(C5), C && i > 0 && (x *= Math.pow(Qd, C.length))) : E5.test(l.charAt(p - 1)) ? (x *= y5, _ = l.slice(i, p - 1).match(l1), _ && i > 0 && (x *= Math.pow(Qd, _.length))) : (x *= v5, i > 0 && (x *= Math.pow(Qd, p - i))), l.charAt(p) !== n.charAt(c) && (x *= x5)), (x < Fd && r.charAt(p - 1) === o.charAt(c + 1) || o.charAt(c + 1) === o.charAt(c) && r.charAt(p - 1) !== o.charAt(c)) && (S = Jf(l, n, r, o, p + 1, c + 2, d), S * Fd > x && (x = S * Fd)), x > v && (v = x), p = r.indexOf(m, p + 1);
    return d[f] = v, v;
  }
  function yb(l) {
    return l.toLowerCase().replace(l1, " ");
  }
  function _5(l, n, r) {
    return l = r && r.length > 0 ? `${l + " " + r.join(" ")}` : l, Jf(l, n, yb(l), yb(n), 0, 0, {});
  }
  function mr(l, n, { checkForDefaultPrevented: r = true } = {}) {
    return function(i) {
      if (l == null ? void 0 : l(i), r === false || !i.defaultPrevented) return n == null ? void 0 : n(i);
    };
  }
  function bb(l, n) {
    if (typeof l == "function") return l(n);
    l != null && (l.current = n);
  }
  function br(...l) {
    return (n) => {
      let r = false;
      const o = l.map((i) => {
        const c = bb(i, n);
        return !r && typeof c == "function" && (r = true), c;
      });
      if (r) return () => {
        for (let i = 0; i < o.length; i++) {
          const c = o[i];
          typeof c == "function" ? c() : bb(l[i], null);
        }
      };
    };
  }
  function Fr(...l) {
    return g.useCallback(br(...l), l);
  }
  function k5(l, n) {
    const r = g.createContext(n), o = (c) => {
      const { children: d, ...f } = c, m = g.useMemo(() => f, Object.values(f));
      return y.jsx(r.Provider, {
        value: m,
        children: d
      });
    };
    o.displayName = l + "Provider";
    function i(c) {
      const d = g.useContext(r);
      if (d) return d;
      if (n !== void 0) return n;
      throw new Error(`\`${c}\` must be used within \`${l}\``);
    }
    return [
      o,
      i
    ];
  }
  function M5(l, n = []) {
    let r = [];
    function o(c, d) {
      const f = g.createContext(d), m = r.length;
      r = [
        ...r,
        d
      ];
      const p = (x) => {
        var _a;
        const { scope: S, children: C, ..._ } = x, b = ((_a = S == null ? void 0 : S[l]) == null ? void 0 : _a[m]) || f, E = g.useMemo(() => _, Object.values(_));
        return y.jsx(b.Provider, {
          value: E,
          children: C
        });
      };
      p.displayName = c + "Provider";
      function v(x, S) {
        var _a;
        const C = ((_a = S == null ? void 0 : S[l]) == null ? void 0 : _a[m]) || f, _ = g.useContext(C);
        if (_) return _;
        if (d !== void 0) return d;
        throw new Error(`\`${x}\` must be used within \`${c}\``);
      }
      return [
        p,
        v
      ];
    }
    const i = () => {
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
    return i.scopeName = l, [
      o,
      j5(i, ...n)
    ];
  }
  function j5(...l) {
    const n = l[0];
    if (l.length === 1) return n;
    const r = () => {
      const o = l.map((i) => ({
        useScope: i(),
        scopeName: i.scopeName
      }));
      return function(c) {
        const d = o.reduce((f, { useScope: m, scopeName: p }) => {
          const x = m(c)[`__scope${p}`];
          return {
            ...f,
            ...x
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
  var is = (globalThis == null ? void 0 : globalThis.document) ? g.useLayoutEffect : () => {
  }, L5 = sh[" useId ".trim().toString()] || (() => {
  }), R5 = 0;
  function Hl(l) {
    const [n, r] = g.useState(L5());
    return is(() => {
      r((o) => o ?? String(R5++));
    }, [
      l
    ]), n ? `radix-${n}` : "";
  }
  var A5 = sh[" useInsertionEffect ".trim().toString()] || is;
  function T5({ prop: l, defaultProp: n, onChange: r = () => {
  }, caller: o }) {
    const [i, c, d] = N5({
      defaultProp: n,
      onChange: r
    }), f = l !== void 0, m = f ? l : i;
    {
      const v = g.useRef(l !== void 0);
      g.useEffect(() => {
        const x = v.current;
        x !== f && console.warn(`${o} is changing from ${x ? "controlled" : "uncontrolled"} to ${f ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`), v.current = f;
      }, [
        f,
        o
      ]);
    }
    const p = g.useCallback((v) => {
      var _a;
      if (f) {
        const x = O5(v) ? v(l) : v;
        x !== l && ((_a = d.current) == null ? void 0 : _a.call(d, x));
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
  function N5({ defaultProp: l, onChange: n }) {
    const [r, o] = g.useState(l), i = g.useRef(r), c = g.useRef(n);
    return A5(() => {
      c.current = n;
    }, [
      n
    ]), g.useEffect(() => {
      var _a;
      i.current !== r && ((_a = c.current) == null ? void 0 : _a.call(c, r), i.current = r);
    }, [
      r,
      i
    ]), [
      r,
      o,
      c
    ];
  }
  function O5(l) {
    return typeof l == "function";
  }
  var ps = a0();
  const I5 = r0(ps);
  function ys(l) {
    const n = D5(l), r = g.forwardRef((o, i) => {
      const { children: c, ...d } = o, f = g.Children.toArray(c), m = f.find(H5);
      if (m) {
        const p = m.props.children, v = f.map((x) => x === m ? g.Children.count(p) > 1 ? g.Children.only(null) : g.isValidElement(p) ? p.props.children : null : x);
        return y.jsx(n, {
          ...d,
          ref: i,
          children: g.isValidElement(p) ? g.cloneElement(p, void 0, v) : null
        });
      }
      return y.jsx(n, {
        ...d,
        ref: i,
        children: c
      });
    });
    return r.displayName = `${l}.Slot`, r;
  }
  function D5(l) {
    const n = g.forwardRef((r, o) => {
      const { children: i, ...c } = r;
      if (g.isValidElement(i)) {
        const d = U5(i), f = Y5(c, i.props);
        return i.type !== g.Fragment && (f.ref = o ? br(o, d) : d), g.cloneElement(i, f);
      }
      return g.Children.count(i) > 1 ? g.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var z5 = Symbol("radix.slottable");
  function H5(l) {
    return g.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === z5;
  }
  function Y5(l, n) {
    const r = {
      ...n
    };
    for (const o in n) {
      const i = l[o], c = n[o];
      /^on[A-Z]/.test(o) ? i && c ? r[o] = (...f) => {
        const m = c(...f);
        return i(...f), m;
      } : i && (r[o] = i) : o === "style" ? r[o] = {
        ...i,
        ...c
      } : o === "className" && (r[o] = [
        i,
        c
      ].filter(Boolean).join(" "));
    }
    return {
      ...l,
      ...r
    };
  }
  function U5(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, r = n && "isReactWarning" in n && n.isReactWarning;
    return r ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, r = n && "isReactWarning" in n && n.isReactWarning, r ? l.props.ref : l.props.ref || l.ref);
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
  ], r1 = B5.reduce((l, n) => {
    const r = ys(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, m = d ? r : n;
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
  function X5(l, n) {
    l && ps.flushSync(() => l.dispatchEvent(n));
  }
  function cs(l) {
    const n = g.useRef(l);
    return g.useEffect(() => {
      n.current = l;
    }), g.useMemo(() => (...r) => {
      var _a;
      return (_a = n.current) == null ? void 0 : _a.call(n, ...r);
    }, []);
  }
  function V5(l, n = globalThis == null ? void 0 : globalThis.document) {
    const r = cs(l);
    g.useEffect(() => {
      const o = (i) => {
        i.key === "Escape" && r(i);
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
  var $5 = "DismissableLayer", eh = "dismissableLayer.update", q5 = "dismissableLayer.pointerDownOutside", G5 = "dismissableLayer.focusOutside", vb, a1 = g.createContext({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  }), o1 = g.forwardRef((l, n) => {
    const { disableOutsidePointerEvents: r = false, onEscapeKeyDown: o, onPointerDownOutside: i, onFocusOutside: c, onInteractOutside: d, onDismiss: f, ...m } = l, p = g.useContext(a1), [v, x] = g.useState(null), S = (v == null ? void 0 : v.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, C] = g.useState({}), _ = Fr(n, (A) => x(A)), b = Array.from(p.layers), [E] = [
      ...p.layersWithOutsidePointerEventsDisabled
    ].slice(-1), k = b.indexOf(E), O = v ? b.indexOf(v) : -1, R = p.layersWithOutsidePointerEventsDisabled.size > 0, T = O >= k, N = K5((A) => {
      const D = A.target, U = [
        ...p.branches
      ].some((B) => B.contains(D));
      !T || U || (i == null ? void 0 : i(A), d == null ? void 0 : d(A), A.defaultPrevented || (f == null ? void 0 : f()));
    }, S), I = F5((A) => {
      const D = A.target;
      [
        ...p.branches
      ].some((B) => B.contains(D)) || (c == null ? void 0 : c(A), d == null ? void 0 : d(A), A.defaultPrevented || (f == null ? void 0 : f()));
    }, S);
    return V5((A) => {
      O === p.layers.size - 1 && (o == null ? void 0 : o(A), !A.defaultPrevented && f && (A.preventDefault(), f()));
    }, S), g.useEffect(() => {
      if (v) return r && (p.layersWithOutsidePointerEventsDisabled.size === 0 && (vb = S.body.style.pointerEvents, S.body.style.pointerEvents = "none"), p.layersWithOutsidePointerEventsDisabled.add(v)), p.layers.add(v), xb(), () => {
        r && p.layersWithOutsidePointerEventsDisabled.size === 1 && (S.body.style.pointerEvents = vb);
      };
    }, [
      v,
      S,
      r,
      p
    ]), g.useEffect(() => () => {
      v && (p.layers.delete(v), p.layersWithOutsidePointerEventsDisabled.delete(v), xb());
    }, [
      v,
      p
    ]), g.useEffect(() => {
      const A = () => C({});
      return document.addEventListener(eh, A), () => document.removeEventListener(eh, A);
    }, []), y.jsx(r1.div, {
      ...m,
      ref: _,
      style: {
        pointerEvents: R ? T ? "auto" : "none" : void 0,
        ...l.style
      },
      onFocusCapture: mr(l.onFocusCapture, I.onFocusCapture),
      onBlurCapture: mr(l.onBlurCapture, I.onBlurCapture),
      onPointerDownCapture: mr(l.onPointerDownCapture, N.onPointerDownCapture)
    });
  });
  o1.displayName = $5;
  var P5 = "DismissableLayerBranch", Z5 = g.forwardRef((l, n) => {
    const r = g.useContext(a1), o = g.useRef(null), i = Fr(n, o);
    return g.useEffect(() => {
      const c = o.current;
      if (c) return r.branches.add(c), () => {
        r.branches.delete(c);
      };
    }, [
      r.branches
    ]), y.jsx(r1.div, {
      ...l,
      ref: i
    });
  });
  Z5.displayName = P5;
  function K5(l, n = globalThis == null ? void 0 : globalThis.document) {
    const r = cs(l), o = g.useRef(false), i = g.useRef(() => {
    });
    return g.useEffect(() => {
      const c = (f) => {
        if (f.target && !o.current) {
          let m = function() {
            s1(q5, r, p, {
              discrete: true
            });
          };
          const p = {
            originalEvent: f
          };
          f.pointerType === "touch" ? (n.removeEventListener("click", i.current), i.current = m, n.addEventListener("click", i.current, {
            once: true
          })) : m();
        } else n.removeEventListener("click", i.current);
        o.current = false;
      }, d = window.setTimeout(() => {
        n.addEventListener("pointerdown", c);
      }, 0);
      return () => {
        window.clearTimeout(d), n.removeEventListener("pointerdown", c), n.removeEventListener("click", i.current);
      };
    }, [
      n,
      r
    ]), {
      onPointerDownCapture: () => o.current = true
    };
  }
  function F5(l, n = globalThis == null ? void 0 : globalThis.document) {
    const r = cs(l), o = g.useRef(false);
    return g.useEffect(() => {
      const i = (c) => {
        c.target && !o.current && s1(G5, r, {
          originalEvent: c
        }, {
          discrete: false
        });
      };
      return n.addEventListener("focusin", i), () => n.removeEventListener("focusin", i);
    }, [
      n,
      r
    ]), {
      onFocusCapture: () => o.current = true,
      onBlurCapture: () => o.current = false
    };
  }
  function xb() {
    const l = new CustomEvent(eh);
    document.dispatchEvent(l);
  }
  function s1(l, n, r, { discrete: o }) {
    const i = r.originalEvent.target, c = new CustomEvent(l, {
      bubbles: false,
      cancelable: true,
      detail: r
    });
    n && i.addEventListener(l, n, {
      once: true
    }), o ? X5(i, c) : i.dispatchEvent(c);
  }
  var Q5 = [
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
  ], W5 = Q5.reduce((l, n) => {
    const r = ys(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, m = d ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), Wd = "focusScope.autoFocusOnMount", Jd = "focusScope.autoFocusOnUnmount", wb = {
    bubbles: false,
    cancelable: true
  }, J5 = "FocusScope", i1 = g.forwardRef((l, n) => {
    const { loop: r = false, trapped: o = false, onMountAutoFocus: i, onUnmountAutoFocus: c, ...d } = l, [f, m] = g.useState(null), p = cs(i), v = cs(c), x = g.useRef(null), S = Fr(n, (b) => m(b)), C = g.useRef({
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
        let b = function(R) {
          if (C.paused || !f) return;
          const T = R.target;
          f.contains(T) ? x.current = T : hr(x.current, {
            select: true
          });
        }, E = function(R) {
          if (C.paused || !f) return;
          const T = R.relatedTarget;
          T !== null && (f.contains(T) || hr(x.current, {
            select: true
          }));
        }, k = function(R) {
          if (document.activeElement === document.body) for (const N of R) N.removedNodes.length > 0 && hr(f);
        };
        document.addEventListener("focusin", b), document.addEventListener("focusout", E);
        const O = new MutationObserver(k);
        return f && O.observe(f, {
          childList: true,
          subtree: true
        }), () => {
          document.removeEventListener("focusin", b), document.removeEventListener("focusout", E), O.disconnect();
        };
      }
    }, [
      o,
      f,
      C.paused
    ]), g.useEffect(() => {
      if (f) {
        Cb.add(C);
        const b = document.activeElement;
        if (!f.contains(b)) {
          const k = new CustomEvent(Wd, wb);
          f.addEventListener(Wd, p), f.dispatchEvent(k), k.defaultPrevented || (eE(aE(c1(f)), {
            select: true
          }), document.activeElement === b && hr(f));
        }
        return () => {
          f.removeEventListener(Wd, p), setTimeout(() => {
            const k = new CustomEvent(Jd, wb);
            f.addEventListener(Jd, v), f.dispatchEvent(k), k.defaultPrevented || hr(b ?? document.body, {
              select: true
            }), f.removeEventListener(Jd, v), Cb.remove(C);
          }, 0);
        };
      }
    }, [
      f,
      p,
      v,
      C
    ]);
    const _ = g.useCallback((b) => {
      if (!r && !o || C.paused) return;
      const E = b.key === "Tab" && !b.altKey && !b.ctrlKey && !b.metaKey, k = document.activeElement;
      if (E && k) {
        const O = b.currentTarget, [R, T] = tE(O);
        R && T ? !b.shiftKey && k === T ? (b.preventDefault(), r && hr(R, {
          select: true
        })) : b.shiftKey && k === R && (b.preventDefault(), r && hr(T, {
          select: true
        })) : k === O && b.preventDefault();
      }
    }, [
      r,
      o,
      C.paused
    ]);
    return y.jsx(W5.div, {
      tabIndex: -1,
      ...d,
      ref: S,
      onKeyDown: _
    });
  });
  i1.displayName = J5;
  function eE(l, { select: n = false } = {}) {
    const r = document.activeElement;
    for (const o of l) if (hr(o, {
      select: n
    }), document.activeElement !== r) return;
  }
  function tE(l) {
    const n = c1(l), r = Sb(n, l), o = Sb(n.reverse(), l);
    return [
      r,
      o
    ];
  }
  function c1(l) {
    const n = [], r = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (o) => {
        const i = o.tagName === "INPUT" && o.type === "hidden";
        return o.disabled || o.hidden || i ? NodeFilter.FILTER_SKIP : o.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    for (; r.nextNode(); ) n.push(r.currentNode);
    return n;
  }
  function Sb(l, n) {
    for (const r of l) if (!nE(r, {
      upTo: n
    })) return r;
  }
  function nE(l, { upTo: n }) {
    if (getComputedStyle(l).visibility === "hidden") return true;
    for (; l; ) {
      if (n !== void 0 && l === n) return false;
      if (getComputedStyle(l).display === "none") return true;
      l = l.parentElement;
    }
    return false;
  }
  function lE(l) {
    return l instanceof HTMLInputElement && "select" in l;
  }
  function hr(l, { select: n = false } = {}) {
    if (l && l.focus) {
      const r = document.activeElement;
      l.focus({
        preventScroll: true
      }), l !== r && lE(l) && n && l.select();
    }
  }
  var Cb = rE();
  function rE() {
    let l = [];
    return {
      add(n) {
        const r = l[0];
        n !== r && (r == null ? void 0 : r.pause()), l = Eb(l, n), l.unshift(n);
      },
      remove(n) {
        var _a;
        l = Eb(l, n), (_a = l[0]) == null ? void 0 : _a.resume();
      }
    };
  }
  function Eb(l, n) {
    const r = [
      ...l
    ], o = r.indexOf(n);
    return o !== -1 && r.splice(o, 1), r;
  }
  function aE(l) {
    return l.filter((n) => n.tagName !== "A");
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
  ], sE = oE.reduce((l, n) => {
    const r = ys(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, m = d ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), iE = "Portal", u1 = g.forwardRef((l, n) => {
    var _a;
    const { container: r, ...o } = l, [i, c] = g.useState(false);
    is(() => c(true), []);
    const d = r || i && ((_a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _a.body);
    return d ? I5.createPortal(y.jsx(sE.div, {
      ...o,
      ref: n
    }), d) : null;
  });
  u1.displayName = iE;
  function cE(l, n) {
    return g.useReducer((r, o) => n[r][o] ?? r, l);
  }
  var Sc = (l) => {
    const { present: n, children: r } = l, o = uE(n), i = typeof r == "function" ? r({
      present: o.isPresent
    }) : g.Children.only(r), c = Fr(o.ref, dE(i));
    return typeof r == "function" || o.isPresent ? g.cloneElement(i, {
      ref: c
    }) : null;
  };
  Sc.displayName = "Presence";
  function uE(l) {
    const [n, r] = g.useState(), o = g.useRef(null), i = g.useRef(l), c = g.useRef("none"), d = l ? "mounted" : "unmounted", [f, m] = cE(d, {
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
      const p = Bi(o.current);
      c.current = f === "mounted" ? p : "none";
    }, [
      f
    ]), is(() => {
      const p = o.current, v = i.current;
      if (v !== l) {
        const S = c.current, C = Bi(p);
        l ? m("MOUNT") : C === "none" || (p == null ? void 0 : p.display) === "none" ? m("UNMOUNT") : m(v && S !== C ? "ANIMATION_OUT" : "UNMOUNT"), i.current = l;
      }
    }, [
      l,
      m
    ]), is(() => {
      if (n) {
        let p;
        const v = n.ownerDocument.defaultView ?? window, x = (C) => {
          const b = Bi(o.current).includes(CSS.escape(C.animationName));
          if (C.target === n && b && (m("ANIMATION_END"), !i.current)) {
            const E = n.style.animationFillMode;
            n.style.animationFillMode = "forwards", p = v.setTimeout(() => {
              n.style.animationFillMode === "forwards" && (n.style.animationFillMode = E);
            });
          }
        }, S = (C) => {
          C.target === n && (c.current = Bi(o.current));
        };
        return n.addEventListener("animationstart", S), n.addEventListener("animationcancel", x), n.addEventListener("animationend", x), () => {
          v.clearTimeout(p), n.removeEventListener("animationstart", S), n.removeEventListener("animationcancel", x), n.removeEventListener("animationend", x);
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
  function Bi(l) {
    return (l == null ? void 0 : l.animationName) || "none";
  }
  function dE(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, r = n && "isReactWarning" in n && n.isReactWarning;
    return r ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, r = n && "isReactWarning" in n && n.isReactWarning, r ? l.props.ref : l.props.ref || l.ref);
  }
  var fE = [
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
  ], bs = fE.reduce((l, n) => {
    const r = ys(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, m = d ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), ef = 0;
  function hE() {
    g.useEffect(() => {
      const l = document.querySelectorAll("[data-radix-focus-guard]");
      return document.body.insertAdjacentElement("afterbegin", l[0] ?? _b()), document.body.insertAdjacentElement("beforeend", l[1] ?? _b()), ef++, () => {
        ef === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((n) => n.remove()), ef--;
      };
    }, []);
  }
  function _b() {
    const l = document.createElement("span");
    return l.setAttribute("data-radix-focus-guard", ""), l.tabIndex = 0, l.style.outline = "none", l.style.opacity = "0", l.style.position = "fixed", l.style.pointerEvents = "none", l;
  }
  var sl = function() {
    return sl = Object.assign || function(n) {
      for (var r, o = 1, i = arguments.length; o < i; o++) {
        r = arguments[o];
        for (var c in r) Object.prototype.hasOwnProperty.call(r, c) && (n[c] = r[c]);
      }
      return n;
    }, sl.apply(this, arguments);
  };
  function d1(l, n) {
    var r = {};
    for (var o in l) Object.prototype.hasOwnProperty.call(l, o) && n.indexOf(o) < 0 && (r[o] = l[o]);
    if (l != null && typeof Object.getOwnPropertySymbols == "function") for (var i = 0, o = Object.getOwnPropertySymbols(l); i < o.length; i++) n.indexOf(o[i]) < 0 && Object.prototype.propertyIsEnumerable.call(l, o[i]) && (r[o[i]] = l[o[i]]);
    return r;
  }
  function mE(l, n, r) {
    if (r || arguments.length === 2) for (var o = 0, i = n.length, c; o < i; o++) (c || !(o in n)) && (c || (c = Array.prototype.slice.call(n, 0, o)), c[o] = n[o]);
    return l.concat(c || Array.prototype.slice.call(n));
  }
  var lc = "right-scroll-bar-position", rc = "width-before-scroll-bar", gE = "with-scroll-bars-hidden", pE = "--removed-body-scroll-bar-size";
  function tf(l, n) {
    return typeof l == "function" ? l(n) : l && (l.current = n), l;
  }
  function yE(l, n) {
    var r = g.useState(function() {
      return {
        value: l,
        callback: n,
        facade: {
          get current() {
            return r.value;
          },
          set current(o) {
            var i = r.value;
            i !== o && (r.value = o, r.callback(o, i));
          }
        }
      };
    })[0];
    return r.callback = n, r.facade;
  }
  var bE = typeof window < "u" ? g.useLayoutEffect : g.useEffect, kb = /* @__PURE__ */ new WeakMap();
  function vE(l, n) {
    var r = yE(null, function(o) {
      return l.forEach(function(i) {
        return tf(i, o);
      });
    });
    return bE(function() {
      var o = kb.get(r);
      if (o) {
        var i = new Set(o), c = new Set(l), d = r.current;
        i.forEach(function(f) {
          c.has(f) || tf(f, null);
        }), c.forEach(function(f) {
          i.has(f) || tf(f, d);
        });
      }
      kb.set(r, l);
    }, [
      l
    ]), r;
  }
  function xE(l) {
    return l;
  }
  function wE(l, n) {
    n === void 0 && (n = xE);
    var r = [], o = false, i = {
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
    return i;
  }
  function SE(l) {
    l === void 0 && (l = {});
    var n = wE(null);
    return n.options = sl({
      async: true,
      ssr: false
    }, l), n;
  }
  var f1 = function(l) {
    var n = l.sideCar, r = d1(l, [
      "sideCar"
    ]);
    if (!n) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    var o = n.read();
    if (!o) throw new Error("Sidecar medium not found");
    return g.createElement(o, sl({}, r));
  };
  f1.isSideCarExport = true;
  function CE(l, n) {
    return l.useMedium(n), f1;
  }
  var h1 = SE(), nf = function() {
  }, Cc = g.forwardRef(function(l, n) {
    var r = g.useRef(null), o = g.useState({
      onScrollCapture: nf,
      onWheelCapture: nf,
      onTouchMoveCapture: nf
    }), i = o[0], c = o[1], d = l.forwardProps, f = l.children, m = l.className, p = l.removeScrollBar, v = l.enabled, x = l.shards, S = l.sideCar, C = l.noRelative, _ = l.noIsolation, b = l.inert, E = l.allowPinchZoom, k = l.as, O = k === void 0 ? "div" : k, R = l.gapMode, T = d1(l, [
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
    ]), N = S, I = vE([
      r,
      n
    ]), A = sl(sl({}, T), i);
    return g.createElement(g.Fragment, null, v && g.createElement(N, {
      sideCar: h1,
      removeScrollBar: p,
      shards: x,
      noRelative: C,
      noIsolation: _,
      inert: b,
      setCallbacks: c,
      allowPinchZoom: !!E,
      lockRef: r,
      gapMode: R
    }), d ? g.cloneElement(g.Children.only(f), sl(sl({}, A), {
      ref: I
    })) : g.createElement(O, sl({}, A, {
      className: m,
      ref: I
    }), f));
  });
  Cc.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  Cc.classNames = {
    fullWidth: rc,
    zeroRight: lc
  };
  var EE = function() {
    if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
  };
  function _E() {
    if (!document) return null;
    var l = document.createElement("style");
    l.type = "text/css";
    var n = EE();
    return n && l.setAttribute("nonce", n), l;
  }
  function kE(l, n) {
    l.styleSheet ? l.styleSheet.cssText = n : l.appendChild(document.createTextNode(n));
  }
  function ME(l) {
    var n = document.head || document.getElementsByTagName("head")[0];
    n.appendChild(l);
  }
  var jE = function() {
    var l = 0, n = null;
    return {
      add: function(r) {
        l == 0 && (n = _E()) && (kE(n, r), ME(n)), l++;
      },
      remove: function() {
        l--, !l && n && (n.parentNode && n.parentNode.removeChild(n), n = null);
      }
    };
  }, LE = function() {
    var l = jE();
    return function(n, r) {
      g.useEffect(function() {
        return l.add(n), function() {
          l.remove();
        };
      }, [
        n && r
      ]);
    };
  }, m1 = function() {
    var l = LE(), n = function(r) {
      var o = r.styles, i = r.dynamic;
      return l(o, i), null;
    };
    return n;
  }, RE = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  }, lf = function(l) {
    return parseInt(l || "", 10) || 0;
  }, AE = function(l) {
    var n = window.getComputedStyle(document.body), r = n[l === "padding" ? "paddingLeft" : "marginLeft"], o = n[l === "padding" ? "paddingTop" : "marginTop"], i = n[l === "padding" ? "paddingRight" : "marginRight"];
    return [
      lf(r),
      lf(o),
      lf(i)
    ];
  }, TE = function(l) {
    if (l === void 0 && (l = "margin"), typeof window > "u") return RE;
    var n = AE(l), r = document.documentElement.clientWidth, o = window.innerWidth;
    return {
      left: n[0],
      top: n[1],
      right: n[2],
      gap: Math.max(0, o - r + n[2] - n[0])
    };
  }, NE = m1(), Ga = "data-scroll-locked", OE = function(l, n, r, o) {
    var i = l.left, c = l.top, d = l.right, f = l.gap;
    return r === void 0 && (r = "margin"), `
  .`.concat(gE, ` {
   overflow: hidden `).concat(o, `;
   padding-right: `).concat(f, "px ").concat(o, `;
  }
  body[`).concat(Ga, `] {
    overflow: hidden `).concat(o, `;
    overscroll-behavior: contain;
    `).concat([
      n && "position: relative ".concat(o, ";"),
      r === "margin" && `
    padding-left: `.concat(i, `px;
    padding-top: `).concat(c, `px;
    padding-right: `).concat(d, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(f, "px ").concat(o, `;
    `),
      r === "padding" && "padding-right: ".concat(f, "px ").concat(o, ";")
    ].filter(Boolean).join(""), `
  }
  
  .`).concat(lc, ` {
    right: `).concat(f, "px ").concat(o, `;
  }
  
  .`).concat(rc, ` {
    margin-right: `).concat(f, "px ").concat(o, `;
  }
  
  .`).concat(lc, " .").concat(lc, ` {
    right: 0 `).concat(o, `;
  }
  
  .`).concat(rc, " .").concat(rc, ` {
    margin-right: 0 `).concat(o, `;
  }
  
  body[`).concat(Ga, `] {
    `).concat(pE, ": ").concat(f, `px;
  }
`);
  }, Mb = function() {
    var l = parseInt(document.body.getAttribute(Ga) || "0", 10);
    return isFinite(l) ? l : 0;
  }, IE = function() {
    g.useEffect(function() {
      return document.body.setAttribute(Ga, (Mb() + 1).toString()), function() {
        var l = Mb() - 1;
        l <= 0 ? document.body.removeAttribute(Ga) : document.body.setAttribute(Ga, l.toString());
      };
    }, []);
  }, DE = function(l) {
    var n = l.noRelative, r = l.noImportant, o = l.gapMode, i = o === void 0 ? "margin" : o;
    IE();
    var c = g.useMemo(function() {
      return TE(i);
    }, [
      i
    ]);
    return g.createElement(NE, {
      styles: OE(c, !n, i, r ? "" : "!important")
    });
  }, th = false;
  if (typeof window < "u") try {
    var Xi = Object.defineProperty({}, "passive", {
      get: function() {
        return th = true, true;
      }
    });
    window.addEventListener("test", Xi, Xi), window.removeEventListener("test", Xi, Xi);
  } catch {
    th = false;
  }
  var Ha = th ? {
    passive: false
  } : false, zE = function(l) {
    return l.tagName === "TEXTAREA";
  }, g1 = function(l, n) {
    if (!(l instanceof Element)) return false;
    var r = window.getComputedStyle(l);
    return r[n] !== "hidden" && !(r.overflowY === r.overflowX && !zE(l) && r[n] === "visible");
  }, HE = function(l) {
    return g1(l, "overflowY");
  }, YE = function(l) {
    return g1(l, "overflowX");
  }, jb = function(l, n) {
    var r = n.ownerDocument, o = n;
    do {
      typeof ShadowRoot < "u" && o instanceof ShadowRoot && (o = o.host);
      var i = p1(l, o);
      if (i) {
        var c = y1(l, o), d = c[1], f = c[2];
        if (d > f) return true;
      }
      o = o.parentNode;
    } while (o && o !== r.body);
    return false;
  }, UE = function(l) {
    var n = l.scrollTop, r = l.scrollHeight, o = l.clientHeight;
    return [
      n,
      r,
      o
    ];
  }, BE = function(l) {
    var n = l.scrollLeft, r = l.scrollWidth, o = l.clientWidth;
    return [
      n,
      r,
      o
    ];
  }, p1 = function(l, n) {
    return l === "v" ? HE(n) : YE(n);
  }, y1 = function(l, n) {
    return l === "v" ? UE(n) : BE(n);
  }, XE = function(l, n) {
    return l === "h" && n === "rtl" ? -1 : 1;
  }, VE = function(l, n, r, o, i) {
    var c = XE(l, window.getComputedStyle(n).direction), d = c * o, f = r.target, m = n.contains(f), p = false, v = d > 0, x = 0, S = 0;
    do {
      if (!f) break;
      var C = y1(l, f), _ = C[0], b = C[1], E = C[2], k = b - E - c * _;
      (_ || k) && p1(l, f) && (x += k, S += _);
      var O = f.parentNode;
      f = O && O.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? O.host : O;
    } while (!m && f !== document.body || m && (n.contains(f) || n === f));
    return (v && Math.abs(x) < 1 || !v && Math.abs(S) < 1) && (p = true), p;
  }, Vi = function(l) {
    return "changedTouches" in l ? [
      l.changedTouches[0].clientX,
      l.changedTouches[0].clientY
    ] : [
      0,
      0
    ];
  }, Lb = function(l) {
    return [
      l.deltaX,
      l.deltaY
    ];
  }, Rb = function(l) {
    return l && "current" in l ? l.current : l;
  }, $E = function(l, n) {
    return l[0] === n[0] && l[1] === n[1];
  }, qE = function(l) {
    return `
  .block-interactivity-`.concat(l, ` {pointer-events: none;}
  .allow-interactivity-`).concat(l, ` {pointer-events: all;}
`);
  }, GE = 0, Ya = [];
  function PE(l) {
    var n = g.useRef([]), r = g.useRef([
      0,
      0
    ]), o = g.useRef(), i = g.useState(GE++)[0], c = g.useState(m1)[0], d = g.useRef(l);
    g.useEffect(function() {
      d.current = l;
    }, [
      l
    ]), g.useEffect(function() {
      if (l.inert) {
        document.body.classList.add("block-interactivity-".concat(i));
        var b = mE([
          l.lockRef.current
        ], (l.shards || []).map(Rb), true).filter(Boolean);
        return b.forEach(function(E) {
          return E.classList.add("allow-interactivity-".concat(i));
        }), function() {
          document.body.classList.remove("block-interactivity-".concat(i)), b.forEach(function(E) {
            return E.classList.remove("allow-interactivity-".concat(i));
          });
        };
      }
    }, [
      l.inert,
      l.lockRef.current,
      l.shards
    ]);
    var f = g.useCallback(function(b, E) {
      if ("touches" in b && b.touches.length === 2 || b.type === "wheel" && b.ctrlKey) return !d.current.allowPinchZoom;
      var k = Vi(b), O = r.current, R = "deltaX" in b ? b.deltaX : O[0] - k[0], T = "deltaY" in b ? b.deltaY : O[1] - k[1], N, I = b.target, A = Math.abs(R) > Math.abs(T) ? "h" : "v";
      if ("touches" in b && A === "h" && I.type === "range") return false;
      var D = window.getSelection(), U = D && D.anchorNode, B = U ? U === I || U.contains(I) : false;
      if (B) return false;
      var ne = jb(A, I);
      if (!ne) return true;
      if (ne ? N = A : (N = A === "v" ? "h" : "v", ne = jb(A, I)), !ne) return false;
      if (!o.current && "changedTouches" in b && (R || T) && (o.current = N), !N) return true;
      var W = o.current || N;
      return VE(W, E, b, W === "h" ? R : T);
    }, []), m = g.useCallback(function(b) {
      var E = b;
      if (!(!Ya.length || Ya[Ya.length - 1] !== c)) {
        var k = "deltaY" in E ? Lb(E) : Vi(E), O = n.current.filter(function(N) {
          return N.name === E.type && (N.target === E.target || E.target === N.shadowParent) && $E(N.delta, k);
        })[0];
        if (O && O.should) {
          E.cancelable && E.preventDefault();
          return;
        }
        if (!O) {
          var R = (d.current.shards || []).map(Rb).filter(Boolean).filter(function(N) {
            return N.contains(E.target);
          }), T = R.length > 0 ? f(E, R[0]) : !d.current.noIsolation;
          T && E.cancelable && E.preventDefault();
        }
      }
    }, []), p = g.useCallback(function(b, E, k, O) {
      var R = {
        name: b,
        delta: E,
        target: k,
        should: O,
        shadowParent: ZE(k)
      };
      n.current.push(R), setTimeout(function() {
        n.current = n.current.filter(function(T) {
          return T !== R;
        });
      }, 1);
    }, []), v = g.useCallback(function(b) {
      r.current = Vi(b), o.current = void 0;
    }, []), x = g.useCallback(function(b) {
      p(b.type, Lb(b), b.target, f(b, l.lockRef.current));
    }, []), S = g.useCallback(function(b) {
      p(b.type, Vi(b), b.target, f(b, l.lockRef.current));
    }, []);
    g.useEffect(function() {
      return Ya.push(c), l.setCallbacks({
        onScrollCapture: x,
        onWheelCapture: x,
        onTouchMoveCapture: S
      }), document.addEventListener("wheel", m, Ha), document.addEventListener("touchmove", m, Ha), document.addEventListener("touchstart", v, Ha), function() {
        Ya = Ya.filter(function(b) {
          return b !== c;
        }), document.removeEventListener("wheel", m, Ha), document.removeEventListener("touchmove", m, Ha), document.removeEventListener("touchstart", v, Ha);
      };
    }, []);
    var C = l.removeScrollBar, _ = l.inert;
    return g.createElement(g.Fragment, null, _ ? g.createElement(c, {
      styles: qE(i)
    }) : null, C ? g.createElement(DE, {
      noRelative: l.noRelative,
      gapMode: l.gapMode
    }) : null);
  }
  function ZE(l) {
    for (var n = null; l !== null; ) l instanceof ShadowRoot && (n = l.host, l = l.host), l = l.parentNode;
    return n;
  }
  const KE = CE(h1, PE);
  var b1 = g.forwardRef(function(l, n) {
    return g.createElement(Cc, sl({}, l, {
      ref: n,
      sideCar: KE
    }));
  });
  b1.classNames = Cc.classNames;
  var FE = function(l) {
    if (typeof document > "u") return null;
    var n = Array.isArray(l) ? l[0] : l;
    return n.ownerDocument.body;
  }, Ua = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakMap(), qi = {}, rf = 0, v1 = function(l) {
    return l && (l.host || v1(l.parentNode));
  }, QE = function(l, n) {
    return n.map(function(r) {
      if (l.contains(r)) return r;
      var o = v1(r);
      return o && l.contains(o) ? o : (console.error("aria-hidden", r, "in not contained inside", l, ". Doing nothing"), null);
    }).filter(function(r) {
      return !!r;
    });
  }, WE = function(l, n, r, o) {
    var i = QE(n, Array.isArray(l) ? l : [
      l
    ]);
    qi[r] || (qi[r] = /* @__PURE__ */ new WeakMap());
    var c = qi[r], d = [], f = /* @__PURE__ */ new Set(), m = new Set(i), p = function(x) {
      !x || f.has(x) || (f.add(x), p(x.parentNode));
    };
    i.forEach(p);
    var v = function(x) {
      !x || m.has(x) || Array.prototype.forEach.call(x.children, function(S) {
        if (f.has(S)) v(S);
        else try {
          var C = S.getAttribute(o), _ = C !== null && C !== "false", b = (Ua.get(S) || 0) + 1, E = (c.get(S) || 0) + 1;
          Ua.set(S, b), c.set(S, E), d.push(S), b === 1 && _ && $i.set(S, true), E === 1 && S.setAttribute(r, "true"), _ || S.setAttribute(o, "true");
        } catch (k) {
          console.error("aria-hidden: cannot operate on ", S, k);
        }
      });
    };
    return v(n), f.clear(), rf++, function() {
      d.forEach(function(x) {
        var S = Ua.get(x) - 1, C = c.get(x) - 1;
        Ua.set(x, S), c.set(x, C), S || ($i.has(x) || x.removeAttribute(o), $i.delete(x)), C || x.removeAttribute(r);
      }), rf--, rf || (Ua = /* @__PURE__ */ new WeakMap(), Ua = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakMap(), qi = {});
    };
  }, JE = function(l, n, r) {
    r === void 0 && (r = "data-aria-hidden");
    var o = Array.from(Array.isArray(l) ? l : [
      l
    ]), i = FE(l);
    return i ? (o.push.apply(o, Array.from(i.querySelectorAll("[aria-live], script"))), WE(o, i, r, "aria-hidden")) : function() {
      return null;
    };
  }, Ec = "Dialog", [x1] = M5(Ec), [e_, Jn] = x1(Ec), w1 = (l) => {
    const { __scopeDialog: n, children: r, open: o, defaultOpen: i, onOpenChange: c, modal: d = true } = l, f = g.useRef(null), m = g.useRef(null), [p, v] = T5({
      prop: o,
      defaultProp: i ?? false,
      onChange: c,
      caller: Ec
    });
    return y.jsx(e_, {
      scope: n,
      triggerRef: f,
      contentRef: m,
      contentId: Hl(),
      titleId: Hl(),
      descriptionId: Hl(),
      open: p,
      onOpenChange: v,
      onOpenToggle: g.useCallback(() => v((x) => !x), [
        v
      ]),
      modal: d,
      children: r
    });
  };
  w1.displayName = Ec;
  var S1 = "DialogTrigger", t_ = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, i = Jn(S1, r), c = Fr(n, i.triggerRef);
    return y.jsx(bs.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": i.open,
      "aria-controls": i.contentId,
      "data-state": wh(i.open),
      ...o,
      ref: c,
      onClick: mr(l.onClick, i.onOpenToggle)
    });
  });
  t_.displayName = S1;
  var vh = "DialogPortal", [n_, C1] = x1(vh, {
    forceMount: void 0
  }), E1 = (l) => {
    const { __scopeDialog: n, forceMount: r, children: o, container: i } = l, c = Jn(vh, n);
    return y.jsx(n_, {
      scope: n,
      forceMount: r,
      children: g.Children.map(o, (d) => y.jsx(Sc, {
        present: r || c.open,
        children: y.jsx(u1, {
          asChild: true,
          container: i,
          children: d
        })
      }))
    });
  };
  E1.displayName = vh;
  var cc = "DialogOverlay", _1 = g.forwardRef((l, n) => {
    const r = C1(cc, l.__scopeDialog), { forceMount: o = r.forceMount, ...i } = l, c = Jn(cc, l.__scopeDialog);
    return c.modal ? y.jsx(Sc, {
      present: o || c.open,
      children: y.jsx(r_, {
        ...i,
        ref: n
      })
    }) : null;
  });
  _1.displayName = cc;
  var l_ = ys("DialogOverlay.RemoveScroll"), r_ = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, i = Jn(cc, r);
    return y.jsx(b1, {
      as: l_,
      allowPinchZoom: true,
      shards: [
        i.contentRef
      ],
      children: y.jsx(bs.div, {
        "data-state": wh(i.open),
        ...o,
        ref: n,
        style: {
          pointerEvents: "auto",
          ...o.style
        }
      })
    });
  }), Pr = "DialogContent", k1 = g.forwardRef((l, n) => {
    const r = C1(Pr, l.__scopeDialog), { forceMount: o = r.forceMount, ...i } = l, c = Jn(Pr, l.__scopeDialog);
    return y.jsx(Sc, {
      present: o || c.open,
      children: c.modal ? y.jsx(a_, {
        ...i,
        ref: n
      }) : y.jsx(o_, {
        ...i,
        ref: n
      })
    });
  });
  k1.displayName = Pr;
  var a_ = g.forwardRef((l, n) => {
    const r = Jn(Pr, l.__scopeDialog), o = g.useRef(null), i = Fr(n, r.contentRef, o);
    return g.useEffect(() => {
      const c = o.current;
      if (c) return JE(c);
    }, []), y.jsx(M1, {
      ...l,
      ref: i,
      trapFocus: r.open,
      disableOutsidePointerEvents: true,
      onCloseAutoFocus: mr(l.onCloseAutoFocus, (c) => {
        var _a;
        c.preventDefault(), (_a = r.triggerRef.current) == null ? void 0 : _a.focus();
      }),
      onPointerDownOutside: mr(l.onPointerDownOutside, (c) => {
        const d = c.detail.originalEvent, f = d.button === 0 && d.ctrlKey === true;
        (d.button === 2 || f) && c.preventDefault();
      }),
      onFocusOutside: mr(l.onFocusOutside, (c) => c.preventDefault())
    });
  }), o_ = g.forwardRef((l, n) => {
    const r = Jn(Pr, l.__scopeDialog), o = g.useRef(false), i = g.useRef(false);
    return y.jsx(M1, {
      ...l,
      ref: n,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      onCloseAutoFocus: (c) => {
        var _a, _b2;
        (_a = l.onCloseAutoFocus) == null ? void 0 : _a.call(l, c), c.defaultPrevented || (o.current || ((_b2 = r.triggerRef.current) == null ? void 0 : _b2.focus()), c.preventDefault()), o.current = false, i.current = false;
      },
      onInteractOutside: (c) => {
        var _a, _b2;
        (_a = l.onInteractOutside) == null ? void 0 : _a.call(l, c), c.defaultPrevented || (o.current = true, c.detail.originalEvent.type === "pointerdown" && (i.current = true));
        const d = c.target;
        ((_b2 = r.triggerRef.current) == null ? void 0 : _b2.contains(d)) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && i.current && c.preventDefault();
      }
    });
  }), M1 = g.forwardRef((l, n) => {
    const { __scopeDialog: r, trapFocus: o, onOpenAutoFocus: i, onCloseAutoFocus: c, ...d } = l, f = Jn(Pr, r), m = g.useRef(null), p = Fr(n, m);
    return hE(), y.jsxs(y.Fragment, {
      children: [
        y.jsx(i1, {
          asChild: true,
          loop: true,
          trapped: o,
          onMountAutoFocus: i,
          onUnmountAutoFocus: c,
          children: y.jsx(o1, {
            role: "dialog",
            id: f.contentId,
            "aria-describedby": f.descriptionId,
            "aria-labelledby": f.titleId,
            "data-state": wh(f.open),
            ...d,
            ref: p,
            onDismiss: () => f.onOpenChange(false)
          })
        }),
        y.jsxs(y.Fragment, {
          children: [
            y.jsx(u_, {
              titleId: f.titleId
            }),
            y.jsx(f_, {
              contentRef: m,
              descriptionId: f.descriptionId
            })
          ]
        })
      ]
    });
  }), xh = "DialogTitle", s_ = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, i = Jn(xh, r);
    return y.jsx(bs.h2, {
      id: i.titleId,
      ...o,
      ref: n
    });
  });
  s_.displayName = xh;
  var j1 = "DialogDescription", i_ = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, i = Jn(j1, r);
    return y.jsx(bs.p, {
      id: i.descriptionId,
      ...o,
      ref: n
    });
  });
  i_.displayName = j1;
  var L1 = "DialogClose", c_ = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, i = Jn(L1, r);
    return y.jsx(bs.button, {
      type: "button",
      ...o,
      ref: n,
      onClick: mr(l.onClick, () => i.onOpenChange(false))
    });
  });
  c_.displayName = L1;
  function wh(l) {
    return l ? "open" : "closed";
  }
  var R1 = "DialogTitleWarning", [uj, A1] = k5(R1, {
    contentName: Pr,
    titleName: xh,
    docsSlug: "dialog"
  }), u_ = ({ titleId: l }) => {
    const n = A1(R1), r = `\`${n.contentName}\` requires a \`${n.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${n.docsSlug}`;
    return g.useEffect(() => {
      l && (document.getElementById(l) || console.error(r));
    }, [
      r,
      l
    ]), null;
  }, d_ = "DialogDescriptionWarning", f_ = ({ contentRef: l, descriptionId: n }) => {
    const o = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${A1(d_).contentName}}.`;
    return g.useEffect(() => {
      var _a;
      const i = (_a = l.current) == null ? void 0 : _a.getAttribute("aria-describedby");
      n && i && (document.getElementById(n) || console.warn(o));
    }, [
      o,
      l,
      n
    ]), null;
  }, h_ = w1, m_ = E1, g_ = _1, p_ = k1, y_ = Symbol.for("react.lazy"), uc = sh[" use ".trim().toString()];
  function b_(l) {
    return typeof l == "object" && l !== null && "then" in l;
  }
  function T1(l) {
    return l != null && typeof l == "object" && "$$typeof" in l && l.$$typeof === y_ && "_payload" in l && b_(l._payload);
  }
  function v_(l) {
    const n = x_(l), r = g.forwardRef((o, i) => {
      let { children: c, ...d } = o;
      T1(c) && typeof uc == "function" && (c = uc(c._payload));
      const f = g.Children.toArray(c), m = f.find(S_);
      if (m) {
        const p = m.props.children, v = f.map((x) => x === m ? g.Children.count(p) > 1 ? g.Children.only(null) : g.isValidElement(p) ? p.props.children : null : x);
        return y.jsx(n, {
          ...d,
          ref: i,
          children: g.isValidElement(p) ? g.cloneElement(p, void 0, v) : null
        });
      }
      return y.jsx(n, {
        ...d,
        ref: i,
        children: c
      });
    });
    return r.displayName = `${l}.Slot`, r;
  }
  function x_(l) {
    const n = g.forwardRef((r, o) => {
      let { children: i, ...c } = r;
      if (T1(i) && typeof uc == "function" && (i = uc(i._payload)), g.isValidElement(i)) {
        const d = E_(i), f = C_(c, i.props);
        return i.type !== g.Fragment && (f.ref = o ? br(o, d) : d), g.cloneElement(i, f);
      }
      return g.Children.count(i) > 1 ? g.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var w_ = Symbol("radix.slottable");
  function S_(l) {
    return g.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === w_;
  }
  function C_(l, n) {
    const r = {
      ...n
    };
    for (const o in n) {
      const i = l[o], c = n[o];
      /^on[A-Z]/.test(o) ? i && c ? r[o] = (...f) => {
        const m = c(...f);
        return i(...f), m;
      } : i && (r[o] = i) : o === "style" ? r[o] = {
        ...i,
        ...c
      } : o === "className" && (r[o] = [
        i,
        c
      ].filter(Boolean).join(" "));
    }
    return {
      ...l,
      ...r
    };
  }
  function E_(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, r = n && "isReactWarning" in n && n.isReactWarning;
    return r ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, r = n && "isReactWarning" in n && n.isReactWarning, r ? l.props.ref : l.props.ref || l.ref);
  }
  var __ = [
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
  ], xr = __.reduce((l, n) => {
    const r = v_(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, m = d ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), Fo = '[cmdk-group=""]', af = '[cmdk-group-items=""]', k_ = '[cmdk-group-heading=""]', N1 = '[cmdk-item=""]', Ab = `${N1}:not([aria-disabled="true"])`, nh = "cmdk-item-select", Ba = "data-value", M_ = (l, n, r) => _5(l, n, r), O1 = g.createContext(void 0), vs = () => g.useContext(O1), I1 = g.createContext(void 0), Sh = () => g.useContext(I1), D1 = g.createContext(void 0), z1 = g.forwardRef((l, n) => {
    let r = Xa(() => {
      var z, Z;
      return {
        search: "",
        value: (Z = (z = l.value) != null ? z : l.defaultValue) != null ? Z : "",
        selectedItemId: void 0,
        filtered: {
          count: 0,
          items: /* @__PURE__ */ new Map(),
          groups: /* @__PURE__ */ new Set()
        }
      };
    }), o = Xa(() => /* @__PURE__ */ new Set()), i = Xa(() => /* @__PURE__ */ new Map()), c = Xa(() => /* @__PURE__ */ new Map()), d = Xa(() => /* @__PURE__ */ new Set()), f = H1(l), { label: m, children: p, value: v, onValueChange: x, filter: S, shouldFilter: C, loop: _, disablePointerSelection: b = false, vimBindings: E = true, ...k } = l, O = Hl(), R = Hl(), T = Hl(), N = g.useRef(null), I = H_();
    Zr(() => {
      if (v !== void 0) {
        let z = v.trim();
        r.current.value = z, A.emit();
      }
    }, [
      v
    ]), Zr(() => {
      I(6, J);
    }, []);
    let A = g.useMemo(() => ({
      subscribe: (z) => (d.current.add(z), () => d.current.delete(z)),
      snapshot: () => r.current,
      setState: (z, Z, Q) => {
        var te, ce, ge, je;
        if (!Object.is(r.current[z], Z)) {
          if (r.current[z] = Z, z === "search") W(), B(), I(1, ne);
          else if (z === "value") {
            if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
              let j = document.getElementById(T);
              j ? j.focus() : (te = document.getElementById(O)) == null || te.focus();
            }
            if (I(7, () => {
              var j;
              r.current.selectedItemId = (j = fe()) == null ? void 0 : j.id, A.emit();
            }), Q || I(5, J), ((ce = f.current) == null ? void 0 : ce.value) !== void 0) {
              let j = Z ?? "";
              (je = (ge = f.current).onValueChange) == null || je.call(ge, j);
              return;
            }
          }
          A.emit();
        }
      },
      emit: () => {
        d.current.forEach((z) => z());
      }
    }), []), D = g.useMemo(() => ({
      value: (z, Z, Q) => {
        var te;
        Z !== ((te = c.current.get(z)) == null ? void 0 : te.value) && (c.current.set(z, {
          value: Z,
          keywords: Q
        }), r.current.filtered.items.set(z, U(Z, Q)), I(2, () => {
          B(), A.emit();
        }));
      },
      item: (z, Z) => (o.current.add(z), Z && (i.current.has(Z) ? i.current.get(Z).add(z) : i.current.set(Z, /* @__PURE__ */ new Set([
        z
      ]))), I(3, () => {
        W(), B(), r.current.value || ne(), A.emit();
      }), () => {
        c.current.delete(z), o.current.delete(z), r.current.filtered.items.delete(z);
        let Q = fe();
        I(4, () => {
          W(), (Q == null ? void 0 : Q.getAttribute("id")) === z && ne(), A.emit();
        });
      }),
      group: (z) => (i.current.has(z) || i.current.set(z, /* @__PURE__ */ new Set()), () => {
        c.current.delete(z), i.current.delete(z);
      }),
      filter: () => f.current.shouldFilter,
      label: m || l["aria-label"],
      getDisablePointerSelection: () => f.current.disablePointerSelection,
      listId: O,
      inputId: T,
      labelId: R,
      listInnerRef: N
    }), []);
    function U(z, Z) {
      var Q, te;
      let ce = (te = (Q = f.current) == null ? void 0 : Q.filter) != null ? te : M_;
      return z ? ce(z, r.current.search, Z) : 0;
    }
    function B() {
      if (!r.current.search || f.current.shouldFilter === false) return;
      let z = r.current.filtered.items, Z = [];
      r.current.filtered.groups.forEach((te) => {
        let ce = i.current.get(te), ge = 0;
        ce.forEach((je) => {
          let j = z.get(je);
          ge = Math.max(j, ge);
        }), Z.push([
          te,
          ge
        ]);
      });
      let Q = N.current;
      xe().sort((te, ce) => {
        var ge, je;
        let j = te.getAttribute("id"), ee = ce.getAttribute("id");
        return ((ge = z.get(ee)) != null ? ge : 0) - ((je = z.get(j)) != null ? je : 0);
      }).forEach((te) => {
        let ce = te.closest(af);
        ce ? ce.appendChild(te.parentElement === ce ? te : te.closest(`${af} > *`)) : Q.appendChild(te.parentElement === Q ? te : te.closest(`${af} > *`));
      }), Z.sort((te, ce) => ce[1] - te[1]).forEach((te) => {
        var ce;
        let ge = (ce = N.current) == null ? void 0 : ce.querySelector(`${Fo}[${Ba}="${encodeURIComponent(te[0])}"]`);
        ge == null ? void 0 : ge.parentElement.appendChild(ge);
      });
    }
    function ne() {
      let z = xe().find((Q) => Q.getAttribute("aria-disabled") !== "true"), Z = z == null ? void 0 : z.getAttribute(Ba);
      A.setState("value", Z || void 0);
    }
    function W() {
      var z, Z, Q, te;
      if (!r.current.search || f.current.shouldFilter === false) {
        r.current.filtered.count = o.current.size;
        return;
      }
      r.current.filtered.groups = /* @__PURE__ */ new Set();
      let ce = 0;
      for (let ge of o.current) {
        let je = (Z = (z = c.current.get(ge)) == null ? void 0 : z.value) != null ? Z : "", j = (te = (Q = c.current.get(ge)) == null ? void 0 : Q.keywords) != null ? te : [], ee = U(je, j);
        r.current.filtered.items.set(ge, ee), ee > 0 && ce++;
      }
      for (let [ge, je] of i.current) for (let j of je) if (r.current.filtered.items.get(j) > 0) {
        r.current.filtered.groups.add(ge);
        break;
      }
      r.current.filtered.count = ce;
    }
    function J() {
      var z, Z, Q;
      let te = fe();
      te && (((z = te.parentElement) == null ? void 0 : z.firstChild) === te && ((Q = (Z = te.closest(Fo)) == null ? void 0 : Z.querySelector(k_)) == null || Q.scrollIntoView({
        block: "nearest"
      })), te.scrollIntoView({
        block: "nearest"
      }));
    }
    function fe() {
      var z;
      return (z = N.current) == null ? void 0 : z.querySelector(`${N1}[aria-selected="true"]`);
    }
    function xe() {
      var z;
      return Array.from(((z = N.current) == null ? void 0 : z.querySelectorAll(Ab)) || []);
    }
    function $(z) {
      let Z = xe()[z];
      Z && A.setState("value", Z.getAttribute(Ba));
    }
    function K(z) {
      var Z;
      let Q = fe(), te = xe(), ce = te.findIndex((je) => je === Q), ge = te[ce + z];
      (Z = f.current) != null && Z.loop && (ge = ce + z < 0 ? te[te.length - 1] : ce + z === te.length ? te[0] : te[ce + z]), ge && A.setState("value", ge.getAttribute(Ba));
    }
    function me(z) {
      let Z = fe(), Q = Z == null ? void 0 : Z.closest(Fo), te;
      for (; Q && !te; ) Q = z > 0 ? D_(Q, Fo) : z_(Q, Fo), te = Q == null ? void 0 : Q.querySelector(Ab);
      te ? A.setState("value", te.getAttribute(Ba)) : K(z);
    }
    let ye = () => $(xe().length - 1), ke = (z) => {
      z.preventDefault(), z.metaKey ? ye() : z.altKey ? me(1) : K(1);
    }, L = (z) => {
      z.preventDefault(), z.metaKey ? $(0) : z.altKey ? me(-1) : K(-1);
    };
    return g.createElement(xr.div, {
      ref: n,
      tabIndex: -1,
      ...k,
      "cmdk-root": "",
      onKeyDown: (z) => {
        var Z;
        (Z = k.onKeyDown) == null || Z.call(k, z);
        let Q = z.nativeEvent.isComposing || z.keyCode === 229;
        if (!(z.defaultPrevented || Q)) switch (z.key) {
          case "n":
          case "j": {
            E && z.ctrlKey && ke(z);
            break;
          }
          case "ArrowDown": {
            ke(z);
            break;
          }
          case "p":
          case "k": {
            E && z.ctrlKey && L(z);
            break;
          }
          case "ArrowUp": {
            L(z);
            break;
          }
          case "Home": {
            z.preventDefault(), $(0);
            break;
          }
          case "End": {
            z.preventDefault(), ye();
            break;
          }
          case "Enter": {
            z.preventDefault();
            let te = fe();
            if (te) {
              let ce = new Event(nh);
              te.dispatchEvent(ce);
            }
          }
        }
      }
    }, g.createElement("label", {
      "cmdk-label": "",
      htmlFor: D.inputId,
      id: D.labelId,
      style: U_
    }, m), _c(l, (z) => g.createElement(I1.Provider, {
      value: A
    }, g.createElement(O1.Provider, {
      value: D
    }, z))));
  }), j_ = g.forwardRef((l, n) => {
    var r, o;
    let i = Hl(), c = g.useRef(null), d = g.useContext(D1), f = vs(), m = H1(l), p = (o = (r = m.current) == null ? void 0 : r.forceMount) != null ? o : d == null ? void 0 : d.forceMount;
    Zr(() => {
      if (!p) return f.item(i, d == null ? void 0 : d.id);
    }, [
      p
    ]);
    let v = Y1(i, c, [
      l.value,
      l.children,
      c
    ], l.keywords), x = Sh(), S = vr((I) => I.value && I.value === v.current), C = vr((I) => p || f.filter() === false ? true : I.search ? I.filtered.items.get(i) > 0 : true);
    g.useEffect(() => {
      let I = c.current;
      if (!(!I || l.disabled)) return I.addEventListener(nh, _), () => I.removeEventListener(nh, _);
    }, [
      C,
      l.onSelect,
      l.disabled
    ]);
    function _() {
      var I, A;
      b(), (A = (I = m.current).onSelect) == null || A.call(I, v.current);
    }
    function b() {
      x.setState("value", v.current, true);
    }
    if (!C) return null;
    let { disabled: E, value: k, onSelect: O, forceMount: R, keywords: T, ...N } = l;
    return g.createElement(xr.div, {
      ref: br(c, n),
      ...N,
      id: i,
      "cmdk-item": "",
      role: "option",
      "aria-disabled": !!E,
      "aria-selected": !!S,
      "data-disabled": !!E,
      "data-selected": !!S,
      onPointerMove: E || f.getDisablePointerSelection() ? void 0 : b,
      onClick: E ? void 0 : _
    }, l.children);
  }), L_ = g.forwardRef((l, n) => {
    let { heading: r, children: o, forceMount: i, ...c } = l, d = Hl(), f = g.useRef(null), m = g.useRef(null), p = Hl(), v = vs(), x = vr((C) => i || v.filter() === false ? true : C.search ? C.filtered.groups.has(d) : true);
    Zr(() => v.group(d), []), Y1(d, f, [
      l.value,
      l.heading,
      m
    ]);
    let S = g.useMemo(() => ({
      id: d,
      forceMount: i
    }), [
      i
    ]);
    return g.createElement(xr.div, {
      ref: br(f, n),
      ...c,
      "cmdk-group": "",
      role: "presentation",
      hidden: x ? void 0 : true
    }, r && g.createElement("div", {
      ref: m,
      "cmdk-group-heading": "",
      "aria-hidden": true,
      id: p
    }, r), _c(l, (C) => g.createElement("div", {
      "cmdk-group-items": "",
      role: "group",
      "aria-labelledby": r ? p : void 0
    }, g.createElement(D1.Provider, {
      value: S
    }, C))));
  }), R_ = g.forwardRef((l, n) => {
    let { alwaysRender: r, ...o } = l, i = g.useRef(null), c = vr((d) => !d.search);
    return !r && !c ? null : g.createElement(xr.div, {
      ref: br(i, n),
      ...o,
      "cmdk-separator": "",
      role: "separator"
    });
  }), A_ = g.forwardRef((l, n) => {
    let { onValueChange: r, ...o } = l, i = l.value != null, c = Sh(), d = vr((p) => p.search), f = vr((p) => p.selectedItemId), m = vs();
    return g.useEffect(() => {
      l.value != null && c.setState("search", l.value);
    }, [
      l.value
    ]), g.createElement(xr.input, {
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
      value: i ? l.value : d,
      onChange: (p) => {
        i || c.setState("search", p.target.value), r == null ? void 0 : r(p.target.value);
      }
    });
  }), T_ = g.forwardRef((l, n) => {
    let { children: r, label: o = "Suggestions", ...i } = l, c = g.useRef(null), d = g.useRef(null), f = vr((p) => p.selectedItemId), m = vs();
    return g.useEffect(() => {
      if (d.current && c.current) {
        let p = d.current, v = c.current, x, S = new ResizeObserver(() => {
          x = requestAnimationFrame(() => {
            let C = p.offsetHeight;
            v.style.setProperty("--cmdk-list-height", C.toFixed(1) + "px");
          });
        });
        return S.observe(p), () => {
          cancelAnimationFrame(x), S.unobserve(p);
        };
      }
    }, []), g.createElement(xr.div, {
      ref: br(c, n),
      ...i,
      "cmdk-list": "",
      role: "listbox",
      tabIndex: -1,
      "aria-activedescendant": f,
      "aria-label": o,
      id: m.listId
    }, _c(l, (p) => g.createElement("div", {
      ref: br(d, m.listInnerRef),
      "cmdk-list-sizer": ""
    }, p)));
  }), N_ = g.forwardRef((l, n) => {
    let { open: r, onOpenChange: o, overlayClassName: i, contentClassName: c, container: d, ...f } = l;
    return g.createElement(h_, {
      open: r,
      onOpenChange: o
    }, g.createElement(m_, {
      container: d
    }, g.createElement(g_, {
      "cmdk-overlay": "",
      className: i
    }), g.createElement(p_, {
      "aria-label": l.label,
      "cmdk-dialog": "",
      className: c
    }, g.createElement(z1, {
      ref: n,
      ...f
    }))));
  }), O_ = g.forwardRef((l, n) => vr((r) => r.filtered.count === 0) ? g.createElement(xr.div, {
    ref: n,
    ...l,
    "cmdk-empty": "",
    role: "presentation"
  }) : null), I_ = g.forwardRef((l, n) => {
    let { progress: r, children: o, label: i = "Loading...", ...c } = l;
    return g.createElement(xr.div, {
      ref: n,
      ...c,
      "cmdk-loading": "",
      role: "progressbar",
      "aria-valuenow": r,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-label": i
    }, _c(l, (d) => g.createElement("div", {
      "aria-hidden": true
    }, d)));
  }), Wo = Object.assign(z1, {
    List: T_,
    Item: j_,
    Input: A_,
    Group: L_,
    Separator: R_,
    Dialog: N_,
    Empty: O_,
    Loading: I_
  });
  function D_(l, n) {
    let r = l.nextElementSibling;
    for (; r; ) {
      if (r.matches(n)) return r;
      r = r.nextElementSibling;
    }
  }
  function z_(l, n) {
    let r = l.previousElementSibling;
    for (; r; ) {
      if (r.matches(n)) return r;
      r = r.previousElementSibling;
    }
  }
  function H1(l) {
    let n = g.useRef(l);
    return Zr(() => {
      n.current = l;
    }), n;
  }
  var Zr = typeof window > "u" ? g.useEffect : g.useLayoutEffect;
  function Xa(l) {
    let n = g.useRef();
    return n.current === void 0 && (n.current = l()), n;
  }
  function vr(l) {
    let n = Sh(), r = () => l(n.snapshot());
    return g.useSyncExternalStore(n.subscribe, r, r);
  }
  function Y1(l, n, r, o = []) {
    let i = g.useRef(), c = vs();
    return Zr(() => {
      var d;
      let f = (() => {
        var p;
        for (let v of r) {
          if (typeof v == "string") return v.trim();
          if (typeof v == "object" && "current" in v) return v.current ? (p = v.current.textContent) == null ? void 0 : p.trim() : i.current;
        }
      })(), m = o.map((p) => p.trim());
      c.value(l, f, m), (d = n.current) == null || d.setAttribute(Ba, f), i.current = f;
    }), i;
  }
  var H_ = () => {
    let [l, n] = g.useState(), r = Xa(() => /* @__PURE__ */ new Map());
    return Zr(() => {
      r.current.forEach((o) => o()), r.current = /* @__PURE__ */ new Map();
    }, [
      l
    ]), (o, i) => {
      r.current.set(o, i), n({});
    };
  };
  function Y_(l) {
    let n = l.type;
    return typeof n == "function" ? n(l.props) : "render" in n ? n.render(l.props) : l;
  }
  function _c({ asChild: l, children: n }, r) {
    return l && g.isValidElement(n) ? g.cloneElement(Y_(n), {
      ref: n.ref
    }, r(n.props.children)) : r(n);
  }
  var U_ = {
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
  const us = Mt()(ih((l) => ({
    isMinimized: true,
    toggle: () => l((n) => ({
      isMinimized: !n.isMinimized
    }))
  }), {
    name: "rosette-minimap",
    partialize: (l) => ({
      isMinimized: l.isMinimized
    })
  })), Ch = Mt()((l) => ({
    isOpen: false,
    elementIds: [],
    open: (n) => l({
      isOpen: true,
      elementIds: n
    }),
    close: () => l({
      isOpen: false,
      elementIds: []
    })
  })), B_ = "image/png,image/jpeg,image/svg+xml,image/webp,image/gif,image/bmp";
  function X_(l) {
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
  function V_(l) {
    return l.replace(/\\/g, "/").split("/").pop() ?? l;
  }
  function U1(l) {
    return new Promise((n, r) => {
      const o = new Image();
      o.onload = () => n({
        naturalWidth: o.naturalWidth,
        naturalHeight: o.naturalHeight
      }), o.onerror = () => r(new Error("Failed to decode image")), o.src = l;
    });
  }
  function $_() {
    return new Promise((l) => {
      const n = document.createElement("input");
      n.type = "file", n.accept = B_, n.style.display = "none", n.addEventListener("change", async () => {
        var _a;
        const r = (_a = n.files) == null ? void 0 : _a[0];
        if (!r) {
          l(null);
          return;
        }
        const o = URL.createObjectURL(r);
        try {
          const { naturalWidth: i, naturalHeight: c } = await U1(o);
          l({
            url: o,
            filename: r.name,
            naturalWidth: i,
            naturalHeight: c
          });
        } catch {
          URL.revokeObjectURL(o), l(null);
        }
      }), n.addEventListener("cancel", () => l(null)), document.body.appendChild(n), n.click(), document.body.removeChild(n);
    });
  }
  async function q_() {
    const l = await x0();
    if (!l) return null;
    const n = V_(l), r = X_(n), o = await w0(l), i = new Blob([
      o.buffer
    ], {
      type: r
    }), c = URL.createObjectURL(i);
    try {
      const { naturalWidth: d, naturalHeight: f } = await U1(c);
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
  function G_(l) {
    const { zoom: n, offset: r } = Ue.getState(), o = document.getElementById("rosette-canvas");
    if (!o) return;
    const i = o.getBoundingClientRect(), c = (i.width / 2 - r.x) / n, d = (i.height / 2 - r.y) / n, m = i.width / n * 0.2, p = l.naturalHeight / l.naturalWidth, v = m * p, x = c - m / 2, S = d - v / 2, C = {
      id: crypto.randomUUID(),
      url: l.url,
      filename: l.filename,
      x,
      y: S,
      width: m,
      height: v,
      naturalWidth: l.naturalWidth,
      naturalHeight: l.naturalHeight,
      lockAspectRatio: true
    }, { library: _, renderer: b } = we.getState();
    if (_ && b) {
      const E = new p2(C);
      ue.getState().execute(E, {
        library: _,
        renderer: b
      });
    }
  }
  async function P_() {
    const l = Bn ? await q_() : await $_();
    l && G_(l);
  }
  function Z_() {
    const { setThemeSetting: l } = he.getState(), { close: n } = dn.getState(), { setTool: r } = Gt.getState();
    return [
      {
        id: "file-new",
        type: "command",
        name: "File: New",
        shortcut: {
          modifiers: [
            ze.mod
          ],
          key: "N"
        },
        action: async () => {
          n();
          const { handleNewFile: i } = await xt(async () => {
            const { handleNewFile: c } = await Promise.resolve().then(() => Qn);
            return {
              handleNewFile: c
            };
          }, void 0, import.meta.url);
          await i();
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
              ze.mod
            ],
            key: "O"
          },
          action: async () => {
            n();
            const { emitOpenFile: i } = await xt(async () => {
              const { emitOpenFile: f } = await Promise.resolve().then(() => Qn);
              return {
                emitOpenFile: f
              };
            }, void 0, import.meta.url), { pickGdsFile: c } = await xt(async () => {
              const { pickGdsFile: f } = await Promise.resolve().then(() => C0);
              return {
                pickGdsFile: f
              };
            }, void 0, import.meta.url), d = await c();
            d && await i(d);
          },
          searchableText: "File open gds load import"
        },
        {
          id: "file-save",
          type: "command",
          name: "File: Save",
          shortcut: {
            modifiers: [
              ze.mod
            ],
            key: "S"
          },
          action: async () => {
            n();
            const { handleSave: i } = await xt(async () => {
              const { handleSave: c } = await Promise.resolve().then(() => Qn);
              return {
                handleSave: c
              };
            }, void 0, import.meta.url);
            await i(false);
          },
          searchableText: "File save gds export write"
        },
        {
          id: "file-save-as",
          type: "command",
          name: "File: Save As",
          shortcut: {
            modifiers: [
              ze.mod,
              "\u21E7"
            ],
            key: "S"
          },
          action: async () => {
            n();
            const { handleSave: i } = await xt(async () => {
              const { handleSave: c } = await Promise.resolve().then(() => Qn);
              return {
                handleSave: c
              };
            }, void 0, import.meta.url);
            await i(true);
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
          const { handleScreenshot: i } = await xt(async () => {
            const { handleScreenshot: c } = await Promise.resolve().then(() => Qn);
            return {
              handleScreenshot: c
            };
          }, void 0, import.meta.url);
          await i();
        },
        searchableText: "File export screenshot image png capture canvas save picture"
      },
      {
        id: "file-screenshot-clipboard",
        type: "command",
        name: "File: Copy Screenshot to Clipboard",
        action: async () => {
          n();
          const { handleScreenshotToClipboard: i } = await xt(async () => {
            const { handleScreenshotToClipboard: c } = await Promise.resolve().then(() => Qn);
            return {
              handleScreenshotToClipboard: c
            };
          }, void 0, import.meta.url);
          await i();
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
          us.getState().toggle(), n();
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
        id: "view-toggle-right-click-mode",
        type: "command",
        name: `View: Toggle Right Click Mode (${he.getState().rightClickMode === "context-menu" ? "Menu" : "Zoom"})`,
        action: () => {
          he.getState().toggleRightClickMode(), n();
        },
        searchableText: "Toggle right click mode context menu zoom out canvas mouse button"
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
        id: "view-focus-explorer",
        type: "command",
        name: "View: Focus Explorer",
        shortcut: {
          modifiers: [
            ze.shift
          ],
          key: "E"
        },
        action: () => {
          he.getState().explorerCollapsed && he.getState().toggleExplorerCollapsed(), de.getState().setFocused(true), n();
        },
        searchableText: "Focus explorer panel cells tree navigate keyboard"
      },
      {
        id: "view-focus-layers",
        type: "command",
        name: "View: Focus Layers",
        shortcut: {
          modifiers: [
            ze.shift
          ],
          key: "L"
        },
        action: () => {
          he.getState().setSidebarTab("layers"), ve.getState().setFocused(true), n();
        },
        searchableText: "Focus layers panel navigate keyboard"
      },
      {
        id: "view-zoom-in",
        type: "command",
        name: "View: Zoom In",
        shortcut: {
          key: "+"
        },
        action: () => {
          const i = document.getElementById("rosette-canvas");
          if (i) {
            const c = i.getBoundingClientRect();
            Ue.getState().zoomAt(fc, c.width / 2, c.height / 2);
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
          const i = document.getElementById("rosette-canvas");
          if (i) {
            const c = i.getBoundingClientRect();
            Ue.getState().zoomAt(hc, c.width / 2, c.height / 2);
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
          gs(), n();
        },
        searchableText: "Zoom to fit all objects view"
      },
      {
        id: "view-zoom-to-selection",
        type: "command",
        name: "View: Zoom to Selection",
        shortcut: {
          modifiers: [
            ze.shift
          ],
          key: "F"
        },
        action: () => {
          const i = document.getElementById("rosette-canvas"), { library: c } = we.getState();
          if (i && c) {
            const d = ie.getState().selectedIds;
            if (d.size > 0) {
              const f = c.get_bounds_for_ids([
                ...d
              ]), m = f ? {
                minX: f[0],
                minY: f[1],
                maxX: f[2],
                maxY: f[3]
              } : null, p = yr(i);
              Ue.getState().zoomToSelected(m, p.width, p.height, p.screenCenter);
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
        id: "ruler-clear-all",
        type: "command",
        name: "Ruler: Clear All",
        action: () => {
          const { rulers: i } = Ie.getState();
          if (i.size === 0) {
            n();
            return;
          }
          const { library: c, renderer: d } = we.getState();
          if (!c || !d) {
            n();
            return;
          }
          const f = new vc([
            ...i.keys()
          ]);
          ue.getState().execute(f, {
            library: c,
            renderer: d
          }), n();
        },
        searchableText: "Ruler clear all remove delete measurements"
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
          const { library: i, renderer: c } = we.getState(), d = document.getElementById("rosette-canvas");
          i && c && d && B0(i, c, d), n();
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
          const { library: i, renderer: c } = we.getState(), d = document.getElementById("rosette-canvas");
          i && c && d && X0(i, c, d), n();
        },
        searchableText: "Add polygon create shape triangle place"
      },
      {
        id: "add-path",
        type: "command",
        name: "Add: Path",
        shortcut: {
          key: "H",
          then: "\u21B5"
        },
        action: () => {
          const { library: i, renderer: c } = we.getState(), d = document.getElementById("rosette-canvas");
          i && c && d && $0(i, c, d), n();
        },
        searchableText: "Add path create waveguide route place"
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
          const { library: i, renderer: c } = we.getState(), d = document.getElementById("rosette-canvas");
          i && c && d && V0(i, c, d), n();
        },
        searchableText: "Add text create label annotation place"
      },
      {
        id: "insert-image",
        type: "command",
        name: "Insert: Image",
        action: () => {
          P_(), n();
        },
        searchableText: "Insert image picture photo reference overlay annotation"
      },
      {
        id: "edit-undo",
        type: "command",
        name: "Edit: Undo",
        shortcut: {
          modifiers: [
            ze.mod
          ],
          key: "Z"
        },
        action: () => {
          const { library: i, renderer: c } = we.getState();
          if (i && c) {
            const { canUndo: d, undo: f } = ue.getState();
            d && f({
              library: i,
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
            ze.mod,
            ze.shift
          ],
          key: "Z"
        },
        action: () => {
          const { library: i, renderer: c } = we.getState();
          if (i && c) {
            const { canRedo: d, redo: f } = ue.getState();
            d && f({
              library: i,
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
            ze.mod
          ],
          key: "C"
        },
        action: () => {
          const { library: i } = we.getState(), { selectedIds: c } = ie.getState();
          if (!i || c.size === 0) {
            n();
            return;
          }
          const d = Yl(i, c);
          Vn.getState().copy(d), n();
        },
        searchableText: "Copy selection clipboard"
      },
      {
        id: "edit-paste",
        type: "command",
        name: "Edit: Paste",
        shortcut: {
          modifiers: [
            ze.mod
          ],
          key: "V"
        },
        action: () => {
          const { library: i, renderer: c } = we.getState();
          if (!i || !c || !Vn.getState().hasContent) {
            n();
            return;
          }
          const d = new yc();
          ue.getState().execute(d, {
            library: i,
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
            ze.mod
          ],
          key: "B"
        },
        action: () => {
          const { library: i, renderer: c } = we.getState(), { selectedIds: d } = ie.getState();
          if (!i || !c || d.size === 0) {
            n();
            return;
          }
          const f = new bc([
            ...d
          ]);
          ue.getState().execute(f, {
            library: i,
            renderer: c
          }), n();
        },
        searchableText: "Duplicate selection clone"
      },
      {
        id: "edit-create-array",
        type: "command",
        name: "Edit: Create Array from Selection",
        action: () => {
          const { selectedIds: i } = ie.getState();
          if (i.size === 0) {
            n();
            return;
          }
          Ch.getState().open([
            ...i
          ]), n();
        },
        searchableText: "Create array grid duplicate copies repeat tile"
      },
      {
        id: "edit-delete",
        type: "command",
        name: "Edit: Delete Selection",
        shortcut: {
          key: ze.backspace
        },
        action: () => {
          const { library: i, renderer: c } = we.getState(), { selectedIds: d } = ie.getState();
          if (!i || !c || d.size === 0) {
            n();
            return;
          }
          const f = new pc([
            ...d
          ]);
          ue.getState().execute(f, {
            library: i,
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
          ie.getState().selectedIds.size > 0 && he.getState().requestInspectorFocus(), n();
        },
        searchableText: "Edit selection inspector properties focus"
      },
      {
        id: "edit-select-all",
        type: "command",
        name: "Edit: Select All",
        shortcut: {
          modifiers: [
            ze.mod
          ],
          key: "A"
        },
        action: () => {
          const { library: i } = we.getState();
          if (!i) {
            n();
            return;
          }
          const c = i.get_all_ids();
          ie.getState().selectAll(c), n();
        },
        searchableText: "Select all elements"
      },
      {
        id: "edit-text-to-polygons",
        type: "command",
        name: "Edit: Convert Text to Polygons",
        action: () => {
          const { selectedIds: i } = ie.getState(), { library: c, renderer: d } = we.getState();
          if (!c || !d || i.size === 0) {
            n();
            return;
          }
          const f = [
            ...i
          ].filter((p) => c.is_text_element(p));
          if (f.length === 0) {
            n();
            return;
          }
          const m = new G0(f);
          ue.getState().execute(m, {
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
          const { library: i, renderer: c } = we.getState();
          if (!i || !c) {
            n();
            return;
          }
          const d = new z0();
          ue.getState().execute(d, {
            library: i,
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
          const { library: i, renderer: c } = we.getState(), { activeLayerId: d, layers: f } = ve.getState();
          if (!i || !c || f.size <= 1) {
            n();
            return;
          }
          const m = new hh(d);
          ue.getState().execute(m, {
            library: i,
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
          const { activeLayerId: i } = ve.getState();
          ve.getState().setExpandedLayerId(i), he.getState().setSidebarTab("layers"), n();
        },
        searchableText: "Edit active layer color fill pattern properties"
      },
      {
        id: "layer-rename",
        type: "layer",
        name: "Layer: Rename Active",
        action: () => {
          const { activeLayerId: i } = ve.getState();
          ve.getState().setEditingLayerId(i), n();
        },
        searchableText: "Rename active layer"
      },
      {
        id: "layer-toggle-visibility",
        type: "layer",
        name: "Layer: Toggle Active Visibility",
        action: () => {
          const { activeLayerId: i } = ve.getState();
          ve.getState().toggleVisibility(i), n();
        },
        searchableText: "Toggle active layer visibility show hide"
      },
      {
        id: "layer-show-all",
        type: "layer",
        name: "Layer: Show All",
        action: () => {
          ve.getState().showAllLayers(), n();
        },
        searchableText: "Show all layers visible"
      },
      {
        id: "layer-hide-all",
        type: "layer",
        name: "Layer: Hide All",
        action: () => {
          ve.getState().hideAllLayers(), n();
        },
        searchableText: "Hide all layers invisible"
      },
      ...ve.getState().getAllLayers().map((i) => ({
        id: `layer-activate-${i.id}`,
        type: "layer",
        name: `Layer: Set Active: ${i.name}`,
        color: i.color,
        action: () => {
          ve.getState().setActiveLayer(i.id), n();
        },
        searchableText: `Layer set active ${i.name} switch`
      })),
      {
        id: "cell-add",
        type: "cell",
        name: "Cell: Add",
        shortcut: {
          key: "C"
        },
        action: () => {
          const { library: i, renderer: c } = we.getState();
          if (!i || !c) {
            n();
            return;
          }
          const d = uh(), f = new mh(d);
          ue.getState().execute(f, {
            library: i,
            renderer: c
          }), he.getState().explorerCollapsed && he.getState().toggleExplorerCollapsed(), de.getState().setActiveCell(d), de.getState().setEditingCellName(d), n();
        },
        searchableText: "Add new cell create"
      },
      {
        id: "cell-delete",
        type: "cell",
        name: "Cell: Delete Active",
        action: () => {
          const { library: i, renderer: c } = we.getState(), { activeCell: d, cells: f } = de.getState();
          if (!i || !c || !d || f.length <= 1) {
            n();
            return;
          }
          const m = new gh(d);
          ue.getState().execute(m, {
            library: i,
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
          const { activeCell: i } = de.getState();
          i && de.getState().setEditingCellName(i), n();
        },
        searchableText: "Rename active cell"
      },
      {
        id: "cell-change-origin",
        type: "cell",
        name: "Cell: Change Origin",
        action: () => {
          ie.getState().clearSelection(), he.getState().requestInspectorFocusField("X"), n();
        },
        searchableText: "Cell change origin position offset set move"
      },
      {
        id: "cell-toggle-visibility",
        type: "cell",
        name: "Cell: Toggle Active Visibility",
        action: () => {
          const { activeCell: i } = de.getState();
          i && de.getState().toggleCellVisibility(i), n();
        },
        searchableText: "Toggle cell visibility hide show active"
      },
      {
        id: "cell-show-all",
        type: "cell",
        name: "Cell: Show All",
        action: () => {
          de.getState().showAllCells(), n();
        },
        searchableText: "Show all cells visible unhide"
      },
      {
        id: "cell-hide-all",
        type: "cell",
        name: "Cell: Hide All",
        action: () => {
          de.getState().hideAllCells(), n();
        },
        searchableText: "Hide all cells invisible"
      },
      {
        id: "cell-toggle-flat-list",
        type: "cell",
        name: "Cell: Toggle Flat List",
        action: () => {
          const { cellListMode: i, setCellListMode: c } = de.getState();
          c(i === "flat" ? "nested" : "flat"), n();
        },
        searchableText: "Toggle flat list nested tree hierarchy cell explorer view"
      },
      ...de.getState().cells.map((i) => ({
        id: `cell-activate-${i}`,
        type: "cell",
        name: `Cell: Set Active: ${i}`,
        action: () => {
          de.getState().setActiveCell(i), n();
        },
        searchableText: `Cell set active ${i} switch`
      })),
      ...de.getState().cells.filter((i) => i !== de.getState().activeCell).map((i) => ({
        id: `cell-instance-${i}`,
        type: "cell",
        name: `Cell: Add Instance: ${i}`,
        action: () => {
          const { library: c, renderer: d } = we.getState(), f = de.getState().activeCell;
          if (!c || !d || !f) {
            n();
            return;
          }
          if (!c.can_instance_cell(f, i)) {
            n();
            return;
          }
          const { zoom: m, offset: p } = Ue.getState(), v = window.innerWidth / 2, x = window.innerHeight / 2, S = (v - p.x) / m, C = (x - p.y) / m, _ = new U0(i, S, C);
          ue.getState().execute(_, {
            library: c,
            renderer: d
          }), n();
        },
        searchableText: `Cell add instance ${i} place ref reference`
      })),
      {
        id: "hierarchy-level-down",
        type: "command",
        name: "Hierarchy: Decrease Level",
        shortcut: {
          key: "["
        },
        action: () => {
          const { hierarchyLevelLimit: i, maxTreeDepth: c, setHierarchyLevelLimit: d } = de.getState(), f = i === 1 / 0 ? c : i;
          f > 1 && d(f - 1), n();
        },
        searchableText: "Hierarchy decrease level down less shallow depth"
      },
      {
        id: "hierarchy-level-up",
        type: "command",
        name: "Hierarchy: Increase Level",
        shortcut: {
          key: "]"
        },
        action: () => {
          const { hierarchyLevelLimit: i, maxTreeDepth: c, setHierarchyLevelLimit: d } = de.getState(), f = i === 1 / 0 ? c : i;
          f < c ? d(f + 1) : d(1 / 0), n();
        },
        searchableText: "Hierarchy increase level up more deeper depth"
      },
      {
        id: "hierarchy-set-max-level",
        type: "command",
        name: "Hierarchy: Show All Levels",
        action: () => {
          const { setHierarchyLevelLimit: i } = de.getState();
          i(1 / 0), n();
        },
        searchableText: "Hierarchy show all levels max depth expand full"
      },
      {
        id: "hierarchy-set-level",
        type: "command",
        name: "Hierarchy: Set Level",
        action: () => {
          n(), requestAnimationFrame(() => {
            const i = document.getElementById("hierarchy-level-input");
            i && (i.focus(), i.select());
          });
        },
        searchableText: "Hierarchy set level depth limit change"
      },
      ...Q_(n),
      ...W_(n)
    ];
  }
  const K_ = [
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
  ], F_ = [
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
  function Q_(l) {
    return F_.map((n) => ({
      id: `boolean-${n.id}`,
      type: "command",
      name: `Boolean: ${n.name}`,
      action: () => {
        const { library: r, renderer: o } = we.getState();
        if (!r || !o) {
          l();
          return;
        }
        const { selectedIds: i, lastSelectedId: c } = ie.getState();
        if (i.size < 2) {
          l();
          return;
        }
        const d = [
          ...i
        ], f = c ?? d[0], m = new Z0(d, n.id, f);
        ue.getState().execute(m, {
          library: r,
          renderer: o
        }), l();
      },
      searchableText: n.search
    }));
  }
  function W_(l) {
    return K_.map((n) => ({
      id: `align-${n.id}`,
      type: "command",
      name: `Align: ${n.name}`,
      action: () => {
        const { library: r, renderer: o } = we.getState();
        if (!r || !o) {
          l();
          return;
        }
        const { selectedIds: i, lastSelectedId: c } = ie.getState();
        if (i.size === 0) {
          l();
          return;
        }
        if (n.id !== "origin-align" && i.size < 2) {
          l();
          return;
        }
        const d = new P0(new Set(i), c, n.id);
        ue.getState().execute(d, {
          library: r,
          renderer: o
        }), l();
      },
      searchableText: n.search
    }));
  }
  function J_({ shortcut: l }) {
    var _a;
    const r = he((i) => i.theme) === "dark", o = Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", r ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10");
    return y.jsxs("span", {
      className: "flex items-center gap-0.5",
      children: [
        (_a = l.modifiers) == null ? void 0 : _a.map((i, c) => y.jsx("kbd", {
          className: o,
          children: i
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
  function ek({ item: l }) {
    const r = he((o) => o.theme) === "dark";
    return y.jsxs(Wo.Item, {
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
        l.shortcut && y.jsx(J_, {
          shortcut: l.shortcut
        })
      ]
    });
  }
  function Tb() {
    const n = he((x) => x.theme) === "dark", r = dn((x) => x.isOpen), o = dn((x) => x.close);
    Kr("command-palette", r);
    const [i, c] = g.useState(""), d = g.useRef(null), f = g.useMemo(() => Z_(), [
      r
    ]), m = g.useMemo(() => {
      const x = i.toLowerCase();
      return f.filter((S) => S.searchableText.toLowerCase().includes(x));
    }, [
      f,
      i
    ]), p = g.useMemo(() => [
      ...m
    ].sort((x, S) => x.name.localeCompare(S.name)), [
      m
    ]), v = g.useCallback((x) => {
      const S = x.target;
      S instanceof Node && d.current && !d.current.contains(S) && o();
    }, [
      o
    ]);
    return g.useEffect(() => {
      if (!r) {
        c("");
        return;
      }
      return c(dn.getState().initialSearch), document.addEventListener("mousedown", v), () => {
        document.removeEventListener("mousedown", v);
      };
    }, [
      r,
      v
    ]), r ? y.jsx("div", {
      className: "fixed inset-0 z-[200]",
      children: y.jsx(Wo, {
        className: "fixed inset-0 flex items-start justify-center px-4 pt-[min(15vh,120px)]",
        shouldFilter: false,
        loop: true,
        label: "Command Menu",
        onKeyDown: (x) => {
          x.key === "Escape" && (x.preventDefault(), o());
        },
        children: y.jsxs("div", {
          ref: d,
          className: Y("w-full max-w-[560px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          children: [
            y.jsx(Wo.Input, {
              value: i,
              onValueChange: c,
              placeholder: "Type a command or search...",
              className: Y("w-full border-b bg-transparent px-4 py-3 text-sm outline-none", n ? "border-white/10 text-white/90 placeholder:text-white/50" : "border-black/10 text-gray-900 placeholder:text-gray-500"),
              autoFocus: true
            }),
            y.jsxs(Wo.List, {
              className: "max-h-[320px] overflow-y-auto p-1",
              onWheel: (x) => x.stopPropagation(),
              children: [
                y.jsx(Wo.Empty, {
                  className: Y("px-3 py-2 text-sm", n ? "text-white/50" : "text-gray-500"),
                  children: "No matching commands"
                }),
                p.map((x) => y.jsx(ek, {
                  item: x
                }, x.id))
              ]
            })
          ]
        })
      })
    }) : null;
  }
  const dt = Va.createContext({});
  var tk = Object.defineProperty, Nb = Object.getOwnPropertySymbols, nk = Object.prototype.hasOwnProperty, lk = Object.prototype.propertyIsEnumerable, Ob = (l, n, r) => n in l ? tk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, of = (l, n) => {
    for (var r in n || (n = {})) nk.call(n, r) && Ob(l, r, n[r]);
    if (Nb) for (var r of Nb(n)) lk.call(n, r) && Ob(l, r, n[r]);
    return l;
  };
  const rk = (l, n) => {
    const r = g.useContext(dt), o = of(of({}, r), l);
    return g.createElement("svg", of({
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
  }, ak = g.forwardRef(rk);
  var ok = ak, sk = Object.defineProperty, Ib = Object.getOwnPropertySymbols, ik = Object.prototype.hasOwnProperty, ck = Object.prototype.propertyIsEnumerable, Db = (l, n, r) => n in l ? sk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, sf = (l, n) => {
    for (var r in n || (n = {})) ik.call(n, r) && Db(l, r, n[r]);
    if (Ib) for (var r of Ib(n)) ck.call(n, r) && Db(l, r, n[r]);
    return l;
  };
  const uk = (l, n) => {
    const r = g.useContext(dt), o = sf(sf({}, r), l);
    return g.createElement("svg", sf({
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
  }, dk = g.forwardRef(uk);
  var fk = dk, hk = Object.defineProperty, zb = Object.getOwnPropertySymbols, mk = Object.prototype.hasOwnProperty, gk = Object.prototype.propertyIsEnumerable, Hb = (l, n, r) => n in l ? hk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, cf = (l, n) => {
    for (var r in n || (n = {})) mk.call(n, r) && Hb(l, r, n[r]);
    if (zb) for (var r of zb(n)) gk.call(n, r) && Hb(l, r, n[r]);
    return l;
  };
  const pk = (l, n) => {
    const r = g.useContext(dt), o = cf(cf({}, r), l);
    return g.createElement("svg", cf({
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
  }, yk = g.forwardRef(pk);
  var bk = yk, vk = Object.defineProperty, Yb = Object.getOwnPropertySymbols, xk = Object.prototype.hasOwnProperty, wk = Object.prototype.propertyIsEnumerable, Ub = (l, n, r) => n in l ? vk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, uf = (l, n) => {
    for (var r in n || (n = {})) xk.call(n, r) && Ub(l, r, n[r]);
    if (Yb) for (var r of Yb(n)) wk.call(n, r) && Ub(l, r, n[r]);
    return l;
  };
  const Sk = (l, n) => {
    const r = g.useContext(dt), o = uf(uf({}, r), l);
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
  }, Ck = g.forwardRef(Sk);
  var Ek = Ck, _k = Object.defineProperty, Bb = Object.getOwnPropertySymbols, kk = Object.prototype.hasOwnProperty, Mk = Object.prototype.propertyIsEnumerable, Xb = (l, n, r) => n in l ? _k(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, df = (l, n) => {
    for (var r in n || (n = {})) kk.call(n, r) && Xb(l, r, n[r]);
    if (Bb) for (var r of Bb(n)) Mk.call(n, r) && Xb(l, r, n[r]);
    return l;
  };
  const jk = (l, n) => {
    const r = g.useContext(dt), o = df(df({}, r), l);
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
      d: "M22 21L2 21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 15V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V15C16 16.1046 15.1046 17 14 17H10C8.89543 17 8 16.1046 8 15Z",
      stroke: "currentColor"
    }));
  }, Lk = g.forwardRef(jk);
  var Rk = Lk, Ak = Object.defineProperty, Vb = Object.getOwnPropertySymbols, Tk = Object.prototype.hasOwnProperty, Nk = Object.prototype.propertyIsEnumerable, $b = (l, n, r) => n in l ? Ak(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, ff = (l, n) => {
    for (var r in n || (n = {})) Tk.call(n, r) && $b(l, r, n[r]);
    if (Vb) for (var r of Vb(n)) Nk.call(n, r) && $b(l, r, n[r]);
    return l;
  };
  const Ok = (l, n) => {
    const r = g.useContext(dt), o = ff(ff({}, r), l);
    return g.createElement("svg", ff({
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
  }, Ik = g.forwardRef(Ok);
  var Dk = Ik, zk = Object.defineProperty, qb = Object.getOwnPropertySymbols, Hk = Object.prototype.hasOwnProperty, Yk = Object.prototype.propertyIsEnumerable, Gb = (l, n, r) => n in l ? zk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, hf = (l, n) => {
    for (var r in n || (n = {})) Hk.call(n, r) && Gb(l, r, n[r]);
    if (qb) for (var r of qb(n)) Yk.call(n, r) && Gb(l, r, n[r]);
    return l;
  };
  const Uk = (l, n) => {
    const r = g.useContext(dt), o = hf(hf({}, r), l);
    return g.createElement("svg", hf({
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
  }, Bk = g.forwardRef(Uk);
  var Xk = Bk, Vk = Object.defineProperty, Pb = Object.getOwnPropertySymbols, $k = Object.prototype.hasOwnProperty, qk = Object.prototype.propertyIsEnumerable, Zb = (l, n, r) => n in l ? Vk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, mf = (l, n) => {
    for (var r in n || (n = {})) $k.call(n, r) && Zb(l, r, n[r]);
    if (Pb) for (var r of Pb(n)) qk.call(n, r) && Zb(l, r, n[r]);
    return l;
  };
  const Gk = (l, n) => {
    const r = g.useContext(dt), o = mf(mf({}, r), l);
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
      d: "M22 3L2 3",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 19V9C8 7.89543 8.89543 7 10 7H14C15.1046 7 16 7.89543 16 9V19C16 20.1046 15.1046 21 14 21H10C8.89543 21 8 20.1046 8 19Z",
      stroke: "currentColor"
    }));
  }, Pk = g.forwardRef(Gk);
  var Zk = Pk, Kk = Object.defineProperty, Kb = Object.getOwnPropertySymbols, Fk = Object.prototype.hasOwnProperty, Qk = Object.prototype.propertyIsEnumerable, Fb = (l, n, r) => n in l ? Kk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, gf = (l, n) => {
    for (var r in n || (n = {})) Fk.call(n, r) && Fb(l, r, n[r]);
    if (Kb) for (var r of Kb(n)) Qk.call(n, r) && Fb(l, r, n[r]);
    return l;
  };
  const Wk = (l, n) => {
    const r = g.useContext(dt), o = gf(gf({}, r), l);
    return g.createElement("svg", gf({
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
  }, Jk = g.forwardRef(Wk);
  var e4 = Jk, t4 = Object.defineProperty, Qb = Object.getOwnPropertySymbols, n4 = Object.prototype.hasOwnProperty, l4 = Object.prototype.propertyIsEnumerable, Wb = (l, n, r) => n in l ? t4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, pf = (l, n) => {
    for (var r in n || (n = {})) n4.call(n, r) && Wb(l, r, n[r]);
    if (Qb) for (var r of Qb(n)) l4.call(n, r) && Wb(l, r, n[r]);
    return l;
  };
  const r4 = (l, n) => {
    const r = g.useContext(dt), o = pf(pf({}, r), l);
    return g.createElement("svg", pf({
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
  }, a4 = g.forwardRef(r4);
  var Eh = a4, o4 = Object.defineProperty, Jb = Object.getOwnPropertySymbols, s4 = Object.prototype.hasOwnProperty, i4 = Object.prototype.propertyIsEnumerable, ev = (l, n, r) => n in l ? o4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, yf = (l, n) => {
    for (var r in n || (n = {})) s4.call(n, r) && ev(l, r, n[r]);
    if (Jb) for (var r of Jb(n)) i4.call(n, r) && ev(l, r, n[r]);
    return l;
  };
  const c4 = (l, n) => {
    const r = g.useContext(dt), o = yf(yf({}, r), l);
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
      d: "M3 20C11 20 21 4 21 4",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, u4 = g.forwardRef(c4);
  var B1 = u4, d4 = Object.defineProperty, tv = Object.getOwnPropertySymbols, f4 = Object.prototype.hasOwnProperty, h4 = Object.prototype.propertyIsEnumerable, nv = (l, n, r) => n in l ? d4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, bf = (l, n) => {
    for (var r in n || (n = {})) f4.call(n, r) && nv(l, r, n[r]);
    if (tv) for (var r of tv(n)) h4.call(n, r) && nv(l, r, n[r]);
    return l;
  };
  const m4 = (l, n) => {
    const r = g.useContext(dt), o = bf(bf({}, r), l);
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
  }, g4 = g.forwardRef(m4);
  var p4 = g4, y4 = Object.defineProperty, lv = Object.getOwnPropertySymbols, b4 = Object.prototype.hasOwnProperty, v4 = Object.prototype.propertyIsEnumerable, rv = (l, n, r) => n in l ? y4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, vf = (l, n) => {
    for (var r in n || (n = {})) b4.call(n, r) && rv(l, r, n[r]);
    if (lv) for (var r of lv(n)) v4.call(n, r) && rv(l, r, n[r]);
    return l;
  };
  const x4 = (l, n) => {
    const r = g.useContext(dt), o = vf(vf({}, r), l);
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
  }, w4 = g.forwardRef(x4);
  var S4 = w4, C4 = Object.defineProperty, av = Object.getOwnPropertySymbols, E4 = Object.prototype.hasOwnProperty, _4 = Object.prototype.propertyIsEnumerable, ov = (l, n, r) => n in l ? C4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, xf = (l, n) => {
    for (var r in n || (n = {})) E4.call(n, r) && ov(l, r, n[r]);
    if (av) for (var r of av(n)) _4.call(n, r) && ov(l, r, n[r]);
    return l;
  };
  const k4 = (l, n) => {
    const r = g.useContext(dt), o = xf(xf({}, r), l);
    return g.createElement("svg", xf({
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
  }, M4 = g.forwardRef(k4);
  var j4 = M4, L4 = Object.defineProperty, sv = Object.getOwnPropertySymbols, R4 = Object.prototype.hasOwnProperty, A4 = Object.prototype.propertyIsEnumerable, iv = (l, n, r) => n in l ? L4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, wf = (l, n) => {
    for (var r in n || (n = {})) R4.call(n, r) && iv(l, r, n[r]);
    if (sv) for (var r of sv(n)) A4.call(n, r) && iv(l, r, n[r]);
    return l;
  };
  const T4 = (l, n) => {
    const r = g.useContext(dt), o = wf(wf({}, r), l);
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
  }, N4 = g.forwardRef(T4);
  var O4 = N4, I4 = Object.defineProperty, cv = Object.getOwnPropertySymbols, D4 = Object.prototype.hasOwnProperty, z4 = Object.prototype.propertyIsEnumerable, uv = (l, n, r) => n in l ? I4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Sf = (l, n) => {
    for (var r in n || (n = {})) D4.call(n, r) && uv(l, r, n[r]);
    if (cv) for (var r of cv(n)) z4.call(n, r) && uv(l, r, n[r]);
    return l;
  };
  const H4 = (l, n) => {
    const r = g.useContext(dt), o = Sf(Sf({}, r), l);
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
      d: "M15 6L9 12L15 18",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, Y4 = g.forwardRef(H4);
  var U4 = Y4, B4 = Object.defineProperty, dv = Object.getOwnPropertySymbols, X4 = Object.prototype.hasOwnProperty, V4 = Object.prototype.propertyIsEnumerable, fv = (l, n, r) => n in l ? B4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Cf = (l, n) => {
    for (var r in n || (n = {})) X4.call(n, r) && fv(l, r, n[r]);
    if (dv) for (var r of dv(n)) V4.call(n, r) && fv(l, r, n[r]);
    return l;
  };
  const $4 = (l, n) => {
    const r = g.useContext(dt), o = Cf(Cf({}, r), l);
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
      d: "M9 6L15 12L9 18",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, q4 = g.forwardRef($4);
  var X1 = q4, G4 = Object.defineProperty, hv = Object.getOwnPropertySymbols, P4 = Object.prototype.hasOwnProperty, Z4 = Object.prototype.propertyIsEnumerable, mv = (l, n, r) => n in l ? G4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Ef = (l, n) => {
    for (var r in n || (n = {})) P4.call(n, r) && mv(l, r, n[r]);
    if (hv) for (var r of hv(n)) Z4.call(n, r) && mv(l, r, n[r]);
    return l;
  };
  const K4 = (l, n) => {
    const r = g.useContext(dt), o = Ef(Ef({}, r), l);
    return g.createElement("svg", Ef({
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
  }, F4 = g.forwardRef(K4);
  var Q4 = F4, W4 = Object.defineProperty, gv = Object.getOwnPropertySymbols, J4 = Object.prototype.hasOwnProperty, eM = Object.prototype.propertyIsEnumerable, pv = (l, n, r) => n in l ? W4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, _f = (l, n) => {
    for (var r in n || (n = {})) J4.call(n, r) && pv(l, r, n[r]);
    if (gv) for (var r of gv(n)) eM.call(n, r) && pv(l, r, n[r]);
    return l;
  };
  const tM = (l, n) => {
    const r = g.useContext(dt), o = _f(_f({}, r), l);
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
      d: "M11.6473 2.25623C11.8576 2.10344 12.1424 2.10344 12.3527 2.25623L22.1089 9.34458C22.3192 9.49737 22.4072 9.76819 22.3269 10.0154L18.6003 21.4846C18.52 21.7318 18.2896 21.8992 18.0297 21.8992H5.97029C5.71035 21.8992 5.47998 21.7318 5.39965 21.4846L1.67309 10.0154C1.59276 9.76819 1.68076 9.49737 1.89105 9.34458L11.6473 2.25623Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, nM = g.forwardRef(tM);
  var lM = nM, rM = Object.defineProperty, yv = Object.getOwnPropertySymbols, aM = Object.prototype.hasOwnProperty, oM = Object.prototype.propertyIsEnumerable, bv = (l, n, r) => n in l ? rM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, kf = (l, n) => {
    for (var r in n || (n = {})) aM.call(n, r) && bv(l, r, n[r]);
    if (yv) for (var r of yv(n)) oM.call(n, r) && bv(l, r, n[r]);
    return l;
  };
  const sM = (l, n) => {
    const r = g.useContext(dt), o = kf(kf({}, r), l);
    return g.createElement("svg", kf({
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
  }, iM = g.forwardRef(sM);
  var V1 = iM, cM = Object.defineProperty, vv = Object.getOwnPropertySymbols, uM = Object.prototype.hasOwnProperty, dM = Object.prototype.propertyIsEnumerable, xv = (l, n, r) => n in l ? cM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Mf = (l, n) => {
    for (var r in n || (n = {})) uM.call(n, r) && xv(l, r, n[r]);
    if (vv) for (var r of vv(n)) dM.call(n, r) && xv(l, r, n[r]);
    return l;
  };
  const fM = (l, n) => {
    const r = g.useContext(dt), o = Mf(Mf({}, r), l);
    return g.createElement("svg", Mf({
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
  }, hM = g.forwardRef(fM);
  var mM = hM, gM = Object.defineProperty, wv = Object.getOwnPropertySymbols, pM = Object.prototype.hasOwnProperty, yM = Object.prototype.propertyIsEnumerable, Sv = (l, n, r) => n in l ? gM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, jf = (l, n) => {
    for (var r in n || (n = {})) pM.call(n, r) && Sv(l, r, n[r]);
    if (wv) for (var r of wv(n)) yM.call(n, r) && Sv(l, r, n[r]);
    return l;
  };
  const bM = (l, n) => {
    const r = g.useContext(dt), o = jf(jf({}, r), l);
    return g.createElement("svg", jf({
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
  }, vM = g.forwardRef(bM);
  var xM = vM, wM = Object.defineProperty, Cv = Object.getOwnPropertySymbols, SM = Object.prototype.hasOwnProperty, CM = Object.prototype.propertyIsEnumerable, Ev = (l, n, r) => n in l ? wM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Lf = (l, n) => {
    for (var r in n || (n = {})) SM.call(n, r) && Ev(l, r, n[r]);
    if (Cv) for (var r of Cv(n)) CM.call(n, r) && Ev(l, r, n[r]);
    return l;
  };
  const EM = (l, n) => {
    const r = g.useContext(dt), o = Lf(Lf({}, r), l);
    return g.createElement("svg", Lf({
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
  }, _M = g.forwardRef(EM);
  var $1 = _M, kM = Object.defineProperty, _v = Object.getOwnPropertySymbols, MM = Object.prototype.hasOwnProperty, jM = Object.prototype.propertyIsEnumerable, kv = (l, n, r) => n in l ? kM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Rf = (l, n) => {
    for (var r in n || (n = {})) MM.call(n, r) && kv(l, r, n[r]);
    if (_v) for (var r of _v(n)) jM.call(n, r) && kv(l, r, n[r]);
    return l;
  };
  const LM = (l, n) => {
    const r = g.useContext(dt), o = Rf(Rf({}, r), l);
    return g.createElement("svg", Rf({
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
  }, RM = g.forwardRef(LM);
  var q1 = RM, AM = Object.defineProperty, Mv = Object.getOwnPropertySymbols, TM = Object.prototype.hasOwnProperty, NM = Object.prototype.propertyIsEnumerable, jv = (l, n, r) => n in l ? AM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Af = (l, n) => {
    for (var r in n || (n = {})) TM.call(n, r) && jv(l, r, n[r]);
    if (Mv) for (var r of Mv(n)) NM.call(n, r) && jv(l, r, n[r]);
    return l;
  };
  const OM = (l, n) => {
    const r = g.useContext(dt), o = Af(Af({}, r), l);
    return g.createElement("svg", Af({
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
  }, IM = g.forwardRef(OM);
  var DM = IM, zM = Object.defineProperty, Lv = Object.getOwnPropertySymbols, HM = Object.prototype.hasOwnProperty, YM = Object.prototype.propertyIsEnumerable, Rv = (l, n, r) => n in l ? zM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Tf = (l, n) => {
    for (var r in n || (n = {})) HM.call(n, r) && Rv(l, r, n[r]);
    if (Lv) for (var r of Lv(n)) YM.call(n, r) && Rv(l, r, n[r]);
    return l;
  };
  const UM = (l, n) => {
    const r = g.useContext(dt), o = Tf(Tf({}, r), l);
    return g.createElement("svg", Tf({
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
  }, BM = g.forwardRef(UM);
  var XM = BM, VM = Object.defineProperty, Av = Object.getOwnPropertySymbols, $M = Object.prototype.hasOwnProperty, qM = Object.prototype.propertyIsEnumerable, Tv = (l, n, r) => n in l ? VM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Nf = (l, n) => {
    for (var r in n || (n = {})) $M.call(n, r) && Tv(l, r, n[r]);
    if (Av) for (var r of Av(n)) qM.call(n, r) && Tv(l, r, n[r]);
    return l;
  };
  const GM = (l, n) => {
    const r = g.useContext(dt), o = Nf(Nf({}, r), l);
    return g.createElement("svg", Nf({
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
  }, PM = g.forwardRef(GM);
  var ZM = PM, KM = Object.defineProperty, Nv = Object.getOwnPropertySymbols, FM = Object.prototype.hasOwnProperty, QM = Object.prototype.propertyIsEnumerable, Ov = (l, n, r) => n in l ? KM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Of = (l, n) => {
    for (var r in n || (n = {})) FM.call(n, r) && Ov(l, r, n[r]);
    if (Nv) for (var r of Nv(n)) QM.call(n, r) && Ov(l, r, n[r]);
    return l;
  };
  const WM = (l, n) => {
    const r = g.useContext(dt), o = Of(Of({}, r), l);
    return g.createElement("svg", Of({
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
  }, JM = g.forwardRef(WM);
  var e3 = JM, t3 = Object.defineProperty, Iv = Object.getOwnPropertySymbols, n3 = Object.prototype.hasOwnProperty, l3 = Object.prototype.propertyIsEnumerable, Dv = (l, n, r) => n in l ? t3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, If = (l, n) => {
    for (var r in n || (n = {})) n3.call(n, r) && Dv(l, r, n[r]);
    if (Iv) for (var r of Iv(n)) l3.call(n, r) && Dv(l, r, n[r]);
    return l;
  };
  const r3 = (l, n) => {
    const r = g.useContext(dt), o = If(If({}, r), l);
    return g.createElement("svg", If({
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
  }, a3 = g.forwardRef(r3);
  var o3 = a3, s3 = Object.defineProperty, zv = Object.getOwnPropertySymbols, i3 = Object.prototype.hasOwnProperty, c3 = Object.prototype.propertyIsEnumerable, Hv = (l, n, r) => n in l ? s3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Df = (l, n) => {
    for (var r in n || (n = {})) i3.call(n, r) && Hv(l, r, n[r]);
    if (zv) for (var r of zv(n)) c3.call(n, r) && Hv(l, r, n[r]);
    return l;
  };
  const u3 = (l, n) => {
    const r = g.useContext(dt), o = Df(Df({}, r), l);
    return g.createElement("svg", Df({
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
  }, d3 = g.forwardRef(u3);
  var _h = d3;
  const Gi = {
    md: 768,
    lg: 1120
  };
  function G1() {
    if (typeof window > "u") return {
      isLg: true,
      isMd: false,
      isSm: false
    };
    const l = window.innerWidth;
    return {
      isLg: l >= Gi.lg,
      isMd: l >= Gi.md && l < Gi.lg,
      isSm: l < Gi.md
    };
  }
  let Jo = G1();
  const lh = /* @__PURE__ */ new Set();
  function f3(l) {
    return lh.add(l), () => lh.delete(l);
  }
  function h3() {
    return Jo;
  }
  if (typeof window < "u") {
    const l = () => {
      const n = G1();
      if (n.isLg !== Jo.isLg || n.isMd !== Jo.isMd || n.isSm !== Jo.isSm) {
        Jo = n;
        for (const r of lh) r();
      }
    };
    window.addEventListener("resize", l);
  }
  function kh() {
    return g.useSyncExternalStore(f3, h3, () => ({
      isLg: true,
      isMd: false,
      isSm: false
    }));
  }
  const m3 = 8;
  function P1({ side: l, width: n, onResize: r }) {
    const [o, i] = g.useState(false), c = g.useRef(0), d = g.useRef(0), f = g.useCallback((v) => {
      const x = Math.max(Ki, Math.min(Fi, v));
      return Math.abs(x - es) <= m3 ? es : Math.round(x);
    }, []), m = g.useCallback((v) => {
      if (v.button !== 0) return;
      v.preventDefault(), v.stopPropagation(), c.current = v.clientX, d.current = n, i(true), document.body.style.userSelect = "none", document.body.style.cursor = "col-resize";
      const x = (C) => {
        const _ = C.clientX - c.current, b = l === "left" ? d.current + _ : d.current - _;
        r(f(b));
      }, S = () => {
        document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", S), document.body.style.userSelect = "", document.body.style.cursor = "", i(false);
      };
      document.addEventListener("mousemove", x), document.addEventListener("mouseup", S);
    }, [
      l,
      n,
      r,
      f
    ]), p = g.useCallback(() => {
      r(es);
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
  async function rh(l) {
    const { emit: n } = await xt(async () => {
      const { emit: r } = await import("./event-BC8TvpKC.js");
      return {
        emit: r
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    await n("open-file", l);
  }
  async function ah(l) {
    var _a;
    const n = we.getState().library;
    if (n) try {
      let r = null;
      if (l || (r = ((_a = Pe.getState().getActiveTab()) == null ? void 0 : _a.filePath) ?? null), r || (r = await b0()), !r) return;
      !r.endsWith(".gds") && !r.endsWith(".gds2") && !r.endsWith(".gdsii") && (r += ".gds");
      const o = n.to_gds();
      await m0(r, o), Wn.getState().markClean();
      const i = Pe.getState().activeTabId;
      if (i) {
        const c = r.split(/[/\\]/).pop() ?? "untitled";
        Pe.getState().updateTab(i, {
          filePath: r,
          title: c,
          isDirty: false
        });
      }
      $t.getState().show(`Saved to ${r.split("/").pop()}`);
    } catch (r) {
      console.error("Failed to save GDS file:", r), $t.getState().show(`Save failed: ${r}`, "error");
    }
  }
  async function Z1() {
    if (!Wn.getState().isDirty) return true;
    if (Bn) {
      const { ask: l } = await xt(async () => {
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
  async function Mh() {
    window.dispatchEvent(new CustomEvent("rosette-new-file"));
  }
  async function K1() {
    const { renderer: l } = we.getState();
    if (!l) throw new Error("Renderer not ready");
    const n = await l.capture_screenshot(), r = new DataView(n.buffer, n.byteOffset, n.byteLength), o = r.getUint32(0, true), i = r.getUint32(4, true), c = n.slice(8), d = document.createElement("canvas");
    d.width = o, d.height = i;
    const f = d.getContext("2d");
    if (!f) throw new Error("Failed to create 2D context");
    const m = new ImageData(new Uint8ClampedArray(c.buffer, c.byteOffset, c.byteLength), o, i);
    return f.putImageData(m, 0, 0), new Promise((p, v) => {
      d.toBlob((x) => x ? p(x) : v(new Error("PNG encoding failed")), "image/png");
    });
  }
  async function g3() {
    try {
      const l = await K1();
      if (Bn) {
        let n = await v0();
        if (!n) return;
        n.endsWith(".png") || (n += ".png");
        const r = new Uint8Array(await l.arrayBuffer());
        await g0(n, r), $t.getState().show(`Screenshot saved to ${n.split("/").pop()}`);
      } else {
        const n = URL.createObjectURL(l), r = document.createElement("a");
        r.href = n, r.download = "screenshot.png", document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(n), $t.getState().show("Screenshot downloaded");
      }
    } catch (l) {
      console.error("Screenshot failed:", l), $t.getState().show(`Screenshot failed: ${l}`, "error");
    }
  }
  async function p3() {
    try {
      const l = await K1();
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": l
        })
      ]), $t.getState().show("Screenshot copied to clipboard");
    } catch (l) {
      console.error("Screenshot to clipboard failed:", l), $t.getState().show(`Screenshot to clipboard failed: ${l}`, "error");
    }
  }
  const Qn = Object.freeze(Object.defineProperty({
    __proto__: null,
    confirmDiscardChanges: Z1,
    emitOpenFile: rh,
    handleNewFile: Mh,
    handleSave: ah,
    handleScreenshot: g3,
    handleScreenshotToClipboard: p3
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function $n({ label: l, shortcut: n, position: r = "bottom", align: o = "center", className: i, children: c }) {
    var _a;
    const d = he((v) => v.theme) === "dark", f = Y("inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border px-1 text-[11px]", d ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"), p = r === "left" || r === "right" ? Y("top-1/2 -translate-y-1/2", r === "left" ? "right-full mr-3" : "left-full ml-3") : Y(o === "end" ? "right-0" : "left-1/2 -translate-x-1/2", r === "bottom" ? "top-full mt-2" : "bottom-full mb-2");
    return y.jsxs("div", {
      className: Y("group relative", i),
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
  function y3(l) {
    return "separator" in l && l.separator;
  }
  function b3(l, n, r, o = "nested") {
    if (o === "flat" || !l) return n;
    const i = [];
    function c(d) {
      for (const f of d) i.push(f.name), f.children.length > 0 && r.has(f.name) && c(f.children);
    }
    return c(l), i;
  }
  function v3(l, n) {
    if (!l) return null;
    function r(o, i) {
      for (const c of o) {
        if (c.name === n) return i;
        const d = r(c.children, c.name);
        if (d !== null) return d;
      }
      return null;
    }
    return r(l, null);
  }
  function Yv(l, n) {
    if (!l) return null;
    function r(o) {
      for (const i of o) {
        if (i.name === n) return i;
        const c = r(i.children);
        if (c) return c;
      }
      return null;
    }
    return r(l);
  }
  function Uv(l, n, r, o, i = "nested") {
    const c = [];
    if (l.length > 1) for (const f of l) c.push({
      type: "tab",
      id: f.id
    });
    const d = b3(n, r, o, i);
    for (const f of d) c.push({
      type: "cell",
      name: f
    });
    return c;
  }
  function F1(l, n) {
    return l === null || n === null ? l === n : l.type !== n.type ? false : l.type === "tab" && n.type === "tab" ? l.id === n.id : l.type === "cell" && n.type === "cell" ? l.name === n.name : false;
  }
  function x3(l, n) {
    return n ? l.findIndex((r) => F1(r, n)) : -1;
  }
  function w3({ expanded: l, isDark: n }) {
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
  function S3({ buildItems: l, isDark: n, onAction: r }) {
    const o = g.useRef(null), [i, c] = g.useState(false), [, d] = g.useState(0), f = l();
    return g.useLayoutEffect(() => {
      o.current && o.current.getBoundingClientRect().right > window.innerWidth - 8 && c(true);
    }, []), y.jsx("div", {
      ref: o,
      className: Y("absolute -top-1 z-50 ml-1 min-w-[170px] rounded-xl border py-1", i ? "right-full mr-1" : "left-full", n ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      children: f.map((m) => {
        var _a;
        return y3(m) ? y.jsx("div", {
          className: Y("my-1 h-px", n ? "bg-white/10" : "bg-black/10")
        }, m.id) : y.jsxs("button", {
          className: Y("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors", m.disabled ? "opacity-40" : n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          disabled: m.disabled,
          onClick: () => {
            m.disabled || (Promise.resolve(m.action()).catch((p) => console.error("Menu action failed:", p)), m.keepOpen ? d((p) => p + 1) : r());
          },
          children: [
            y.jsx("span", {
              children: m.label
            }),
            m.shortcut && y.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = m.shortcut.modifiers) == null ? void 0 : _a.map((p) => y.jsx("kbd", {
                  className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: p
                }, p)),
                y.jsx("kbd", {
                  className: Y("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: m.shortcut.key
                })
              ]
            })
          ]
        }, m.id);
      })
    });
  }
  function C3({ isDark: l }) {
    const [n, r] = g.useState(false), [o, i] = g.useState(null), c = g.useRef(null);
    Kr("explorer-menu", n);
    const d = g.useCallback(() => {
      r(false), i(null);
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
                ze.mod
              ],
              key: "N"
            },
            action: async () => {
              await Mh();
            },
            disabled: false
          },
          {
            id: "file-open",
            label: "Open...",
            shortcut: {
              modifiers: [
                ze.mod
              ],
              key: "O"
            },
            action: async () => {
              const { pickGdsFile: m } = await xt(async () => {
                const { pickGdsFile: x } = await Promise.resolve().then(() => C0);
                return {
                  pickGdsFile: x
                };
              }, void 0, import.meta.url), { emitOpenFile: p } = await xt(async () => {
                const { emitOpenFile: x } = await Promise.resolve().then(() => Qn);
                return {
                  emitOpenFile: x
                };
              }, void 0, import.meta.url), v = await m();
              v && await p(v);
            },
            disabled: !Bn
          },
          {
            id: "file-save",
            label: "Save",
            shortcut: {
              modifiers: [
                ze.mod
              ],
              key: "S"
            },
            action: async () => {
              const { handleSave: m } = await xt(async () => {
                const { handleSave: p } = await Promise.resolve().then(() => Qn);
                return {
                  handleSave: p
                };
              }, void 0, import.meta.url);
              await m(false);
            },
            disabled: !Bn
          },
          {
            id: "file-save-as",
            label: "Save As...",
            shortcut: {
              modifiers: [
                ze.mod,
                ze.shift
              ],
              key: "S"
            },
            action: async () => {
              const { handleSave: m } = await xt(async () => {
                const { handleSave: p } = await Promise.resolve().then(() => Qn);
                return {
                  handleSave: p
                };
              }, void 0, import.meta.url);
              await m(true);
            },
            disabled: !Bn
          },
          {
            id: "sep-file-1",
            separator: true
          },
          {
            id: "file-screenshot",
            label: "Export Screenshot",
            action: async () => {
              const { handleScreenshot: m } = await xt(async () => {
                const { handleScreenshot: p } = await Promise.resolve().then(() => Qn);
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
              const { handleScreenshotToClipboard: m } = await xt(async () => {
                const { handleScreenshotToClipboard: p } = await Promise.resolve().then(() => Qn);
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
          const { library: m, renderer: p } = we.getState(), { canUndo: v, canRedo: x } = ue.getState(), { selectedIds: S } = ie.getState(), { hasContent: C } = Vn.getState(), { selectedRulerIds: _ } = Ie.getState(), b = S.size > 0, E = _.size > 0, k = m ? m.get_all_ids().length > 0 : false;
          return [
            {
              id: "undo",
              label: "Undo",
              shortcut: {
                modifiers: [
                  ze.mod
                ],
                key: "Z"
              },
              action: () => {
                m && p && ue.getState().undo({
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
                  ze.mod,
                  ze.shift
                ],
                key: "Z"
              },
              action: () => {
                m && p && ue.getState().redo({
                  library: m,
                  renderer: p
                });
              },
              disabled: !x
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
                  ze.mod
                ],
                key: "C"
              },
              action: () => {
                if (!m) return;
                const O = ie.getState().selectedIds, R = Yl(m, O);
                Vn.getState().copy(R);
              },
              disabled: !b
            },
            {
              id: "paste",
              label: "Paste",
              shortcut: {
                modifiers: [
                  ze.mod
                ],
                key: "V"
              },
              action: () => {
                if (!m || !p) return;
                const O = new yc();
                ue.getState().execute(O, {
                  library: m,
                  renderer: p
                });
                const R = document.querySelector("canvas");
                R && qr(m, R);
              },
              disabled: !C
            },
            {
              id: "duplicate",
              label: "Duplicate",
              shortcut: {
                modifiers: [
                  ze.mod
                ],
                key: "B"
              },
              action: () => {
                if (!m || !p) return;
                const O = ie.getState().selectedIds;
                if (O.size === 0) return;
                const R = new bc([
                  ...O
                ]);
                ue.getState().execute(R, {
                  library: m,
                  renderer: p
                });
                const T = document.querySelector("canvas");
                T && qr(m, T);
              },
              disabled: !b
            },
            {
              id: "create-array",
              label: "Create Array\u2026",
              action: () => {
                const O = ie.getState().selectedIds;
                O.size !== 0 && Ch.getState().open([
                  ...O
                ]);
              },
              disabled: !b
            },
            {
              id: "sep-edit-2",
              separator: true
            },
            {
              id: "delete",
              label: "Delete",
              shortcut: {
                key: ze.backspace
              },
              action: () => {
                if (!m || !p) return;
                const O = Ie.getState().selectedRulerIds;
                if (O.size > 0) {
                  const N = new vc([
                    ...O
                  ]);
                  ue.getState().execute(N, {
                    library: m,
                    renderer: p
                  });
                  return;
                }
                const R = ie.getState().selectedIds;
                if (R.size === 0) return;
                const T = new pc([
                  ...R
                ]);
                ue.getState().execute(T, {
                  library: m,
                  renderer: p
                });
              },
              disabled: !b && !E
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
                  ze.mod
                ],
                key: "A"
              },
              action: () => {
                if (!m) return;
                const O = m.get_all_ids();
                ie.getState().selectAll(O);
              },
              disabled: !k
            }
          ];
        }
      },
      {
        id: "view",
        label: "View",
        buildItems: () => {
          const { library: m } = we.getState(), { selectedIds: p } = ie.getState(), v = p.size > 0;
          return [
            {
              id: "zoomIn",
              label: "Zoom In",
              shortcut: {
                key: "+"
              },
              action: () => {
                const x = document.querySelector("canvas");
                if (!x) return;
                const S = x.getBoundingClientRect();
                Ue.getState().zoomAt(fc, S.width / 2, S.height / 2);
              },
              disabled: false,
              keepOpen: true
            },
            {
              id: "zoomOut",
              label: "Zoom Out",
              shortcut: {
                key: "-"
              },
              action: () => {
                const x = document.querySelector("canvas");
                if (!x) return;
                const S = x.getBoundingClientRect();
                Ue.getState().zoomAt(hc, S.width / 2, S.height / 2);
              },
              disabled: false,
              keepOpen: true
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
                gs();
              },
              disabled: false
            },
            {
              id: "fitSelection",
              label: "Fit Selection",
              shortcut: {
                modifiers: [
                  ze.shift
                ],
                key: "F"
              },
              action: () => {
                const x = document.querySelector("canvas");
                if (!x || !m) return;
                const S = ie.getState().selectedIds;
                if (S.size === 0) return;
                const C = m.get_bounds_for_ids([
                  ...S
                ]), _ = C ? {
                  minX: C[0],
                  minY: C[1],
                  maxX: C[2],
                  maxY: C[3]
                } : null, b = yr(x);
                Ue.getState().zoomToSelected(_, b.width, b.height, b.screenCenter);
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
          const { themeSetting: m, showGrid: p, rightClickMode: v } = he.getState();
          return [
            {
              id: "theme-light",
              label: `${m === "light" ? "\u2713  " : "     "}Light`,
              action: () => he.getState().setThemeSetting("light"),
              disabled: false,
              keepOpen: true
            },
            {
              id: "theme-dark",
              label: `${m === "dark" ? "\u2713  " : "     "}Dark`,
              action: () => he.getState().setThemeSetting("dark"),
              disabled: false,
              keepOpen: true
            },
            {
              id: "theme-system",
              label: `${m === "system" ? "\u2713  " : "     "}System`,
              action: () => he.getState().setThemeSetting("system"),
              disabled: false,
              keepOpen: true
            },
            {
              id: "sep-prefs-1",
              separator: true
            },
            {
              id: "show-grid",
              label: `${p ? "\u2713  " : "     "}Show Grid`,
              action: () => he.getState().toggleGrid(),
              disabled: false,
              keepOpen: true
            },
            {
              id: "right-click-zoom",
              label: `${v === "zoom" ? "\u2713  " : "     "}Right Click Zoom`,
              action: () => he.getState().toggleRightClickMode(),
              disabled: false,
              keepOpen: true
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
            r((m) => !m), i(null);
          },
          className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
          children: y.jsx("div", {
            className: "flex h-4 w-4 items-center justify-center",
            children: y.jsx(j4, {
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
                onMouseEnter: () => i(m.id),
                onClick: () => i(o === m.id ? null : m.id),
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
              o === m.id && y.jsx(S3, {
                buildItems: m.buildItems,
                isDark: l,
                onAction: d
              })
            ]
          }, m.id))
        })
      ]
    });
  }
  function Q1({ name: l, isActive: n, isFocused: r, isDark: o, depth: i, hasChildren: c, isExpanded: d, isHidden: f, onToggleExpand: m, onSelect: p, onRename: v, startEditing: x, canDrag: S }) {
    const [C, _] = g.useState(false), [b, E] = g.useState(l), k = g.useRef(null), O = g.useRef(null);
    g.useEffect(() => {
      r && O.current && O.current.scrollIntoView({
        block: "nearest"
      });
    }, [
      r
    ]), g.useEffect(() => {
      x && (_(true), E(l), de.getState().setEditingCellName(null));
    }, [
      x,
      l
    ]), g.useEffect(() => {
      C && k.current && (k.current.focus(), k.current.select());
    }, [
      C
    ]);
    const R = g.useCallback(() => {
      const D = b.trim();
      D && D !== l ? v(D) : E(l), _(false);
    }, [
      b,
      l,
      v
    ]), T = g.useCallback((D) => {
      D.key === "Enter" ? R() : D.key === "Escape" && (E(l), _(false));
    }, [
      R,
      l
    ]), N = g.useCallback((D) => {
      D.preventDefault(), D.stopPropagation(), ds.getState().open("cell", {
        x: D.clientX,
        y: D.clientY
      }, l);
    }, [
      l
    ]), I = g.useCallback((D) => {
      D.stopPropagation(), m();
    }, [
      m
    ]), A = g.useCallback((D) => {
      if (D.button !== 0 || !S || C) {
        S || D.preventDefault();
        return;
      }
      const U = {
        x: D.clientX,
        y: D.clientY
      };
      let B = false;
      const ne = (J) => {
        const fe = J.clientX - U.x, xe = J.clientY - U.y;
        if (!(!B && fe * fe + xe * xe < 25) && !B) {
          B = true;
          const { library: $ } = we.getState();
          if (!$) return;
          const K = $.get_cell_bounds(l) ?? null, me = $.get_cell_origin_by_name(l), ye = {
            x: me ? me[0] : 0,
            y: me ? me[1] : 0
          };
          Wi.getState().startDrag(l, K, ye);
        }
      }, W = () => {
        document.removeEventListener("mousemove", ne), document.removeEventListener("mouseup", W);
      };
      document.addEventListener("mousemove", ne), document.addEventListener("mouseup", W);
    }, [
      S,
      C,
      l
    ]);
    return y.jsxs("button", {
      ref: O,
      type: "button",
      className: Y("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center rounded-lg py-1.5 text-left transition-colors focus:outline-none", n ? o ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? o ? "bg-[rgb(44,44,44)] text-white/90" : "bg-[rgb(227,227,227)] text-black/90" : o ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90", r && (o ? "ring-1 ring-white/25" : "ring-1 ring-black/20")),
      style: {
        paddingLeft: `${7 + i * 10}px`,
        paddingRight: "7px"
      },
      onClick: p,
      onContextMenu: N,
      onMouseDown: A,
      tabIndex: -1,
      children: [
        c ? y.jsx("button", {
          type: "button",
          className: "mr-0.5 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center bg-transparent border-none p-0",
          onClick: I,
          children: y.jsx(w3, {
            expanded: d,
            isDark: o
          })
        }) : y.jsx("span", {
          className: "mr-0.5 h-4 w-4 flex-shrink-0"
        }),
        y.jsx("div", {
          className: "relative h-5 min-w-0 flex-1",
          children: C ? y.jsx("input", {
            ref: k,
            type: "text",
            value: b,
            onChange: (D) => E(D.target.value),
            onBlur: R,
            onKeyDown: T,
            onClick: (D) => D.stopPropagation(),
            className: Y("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", o ? "text-white/90" : "text-black/90")
          }) : y.jsx("span", {
            className: Y("absolute inset-0 truncate text-sm leading-5 select-none", f && "opacity-40"),
            onDoubleClick: (D) => {
              D.stopPropagation(), _(true), E(l);
            },
            children: l
          })
        })
      ]
    });
  }
  function W1({ node: l, depth: n, isDark: r, activeCell: o, focusedCellName: i, editingCellName: c, expandedCells: d, hiddenCells: f, onSelect: m, onRename: p, onToggleExpand: v }) {
    const x = l.children.length > 0, S = d.has(l.name), C = l.name !== o;
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(Q1, {
          name: l.name,
          isActive: l.name === o,
          isFocused: l.name === i,
          isDark: r,
          depth: n,
          hasChildren: x,
          isExpanded: S,
          isHidden: f.has(l.name),
          onToggleExpand: () => v(l.name),
          onSelect: () => m(l.name),
          onRename: (_) => p(l.name, _),
          startEditing: c === l.name,
          canDrag: C
        }),
        x && S && l.children.map((_) => y.jsx(W1, {
          node: _,
          depth: n + 1,
          isDark: r,
          activeCell: o,
          focusedCellName: i,
          editingCellName: c,
          expandedCells: d,
          hiddenCells: f,
          onSelect: m,
          onRename: p,
          onToggleExpand: v
        }, `${l.name}/${_.name}`))
      ]
    });
  }
  function E3({ tab: l, isActive: n, isFocused: r, isDark: o, onSelect: i, onClose: c, onMiddleClick: d }) {
    const f = g.useRef(null);
    return g.useEffect(() => {
      r && f.current && f.current.scrollIntoView({
        block: "nearest"
      });
    }, [
      r
    ]), y.jsxs("div", {
      ref: f,
      role: "tab",
      tabIndex: 0,
      "aria-selected": n,
      className: Y("group mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-1.5 rounded-lg py-1.5 pr-1 pl-2 transition-colors", n ? o ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? o ? "bg-[rgb(44,44,44)] text-white/90" : "bg-[rgb(227,227,227)] text-black/90" : o ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90", r && (o ? "ring-1 ring-white/25" : "ring-1 ring-black/20")),
      onClick: i,
      onKeyDown: (m) => {
        (m.key === "Enter" || m.key === " ") && (m.preventDefault(), i());
      },
      onMouseDown: d,
      children: [
        l.isDirty ? y.jsx("span", {
          className: Y("h-1.5 w-1.5 flex-shrink-0 rounded-full", o ? "bg-white/50" : "bg-black/50")
        }) : y.jsx("span", {
          className: "h-1.5 w-1.5 flex-shrink-0"
        }),
        y.jsx("span", {
          className: "min-w-0 flex-1 truncate text-sm select-none",
          children: l.title
        }),
        y.jsx("button", {
          type: "button",
          onClick: c,
          className: Y("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm transition-opacity", "opacity-0 group-hover:opacity-100", o ? "hover:bg-white/15 text-white/50 hover:text-white/80" : "hover:bg-black/15 text-black/50 hover:text-black/80"),
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
  function _3({ isDark: l, focusedItem: n }) {
    const r = Pe((f) => f.tabs), o = Pe((f) => f.activeTabId), i = g.useCallback((f) => {
      f !== o && ($r(o, f), Pe.getState().setActiveTab(f));
    }, [
      o
    ]), c = g.useCallback(async (f, m) => {
      f.stopPropagation(), window.dispatchEvent(new CustomEvent("rosette-close-tab", {
        detail: m
      }));
    }, []), d = g.useCallback((f, m) => {
      f.button === 1 && (f.preventDefault(), window.dispatchEvent(new CustomEvent("rosette-close-tab", {
        detail: m
      })));
    }, []);
    return r.length <= 1 ? null : y.jsxs(y.Fragment, {
      children: [
        y.jsx("div", {
          className: "flex flex-col gap-0.5 py-1",
          children: r.map((f) => y.jsx(E3, {
            tab: f,
            isActive: f.id === o,
            isFocused: (n == null ? void 0 : n.type) === "tab" && n.id === f.id,
            isDark: l,
            onSelect: () => i(f.id),
            onClose: (m) => c(m, f.id),
            onMiddleClick: (m) => d(m, f.id)
          }, f.id))
        }),
        y.jsx("div", {
          className: Y("h-px", l ? "bg-white/10" : "bg-black/10")
        })
      ]
    });
  }
  function k3({ isDark: l, onExpand: n }) {
    const r = Pe((o) => o.tabs.length);
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
          children: y.jsx(X1, {
            className: Y("h-4 w-4", l ? "text-white/60" : "text-black/60")
          })
        })
      ]
    });
  }
  function Bv() {
    const n = he((j) => j.theme) === "dark", r = he((j) => j.explorerCollapsed), o = he((j) => j.toggleExplorerCollapsed), i = he((j) => j.explorerWidth), c = he((j) => j.setExplorerWidth), { isSm: d } = kh(), { handleProps: f } = P1({
      side: "left",
      width: i,
      onResize: c
    }), m = de((j) => j.projectName), p = de((j) => j.setProjectName), v = de((j) => j.cells), x = de((j) => j.cellTree), S = de((j) => j.activeCell), C = de((j) => j.setActiveCell), _ = de((j) => j.editingCellName), b = de((j) => j.expandedCells), E = de((j) => j.toggleExpanded), k = de((j) => j.cellsLoaded), O = de((j) => j.hierarchyLevelLimit), R = de((j) => j.setHierarchyLevelLimit), T = de((j) => j.maxTreeDepth), N = de((j) => j.hiddenCells), I = de((j) => j.cellListMode), A = de((j) => j.isFocused), D = de((j) => j.focusedItem), U = de((j) => j.setFocused), B = de((j) => j.setFocusedItem);
    Kr("explorer-panel", A);
    const [ne, W] = g.useState(false), J = g.useRef(null);
    g.useEffect(() => {
      if (!d || !ne) return;
      const j = (ee) => {
        J.current && !J.current.contains(ee.target) && W(false);
      };
      return document.addEventListener("mousedown", j), () => document.removeEventListener("mousedown", j);
    }, [
      d,
      ne
    ]);
    const fe = (j, ee) => j === 1 / 0 ? ee > 0 ? ee.toString() : "" : j.toString(), [xe, $] = g.useState(fe(O, T));
    g.useEffect(() => {
      $(fe(O, T));
    }, [
      O,
      T
    ]);
    const [K, me] = g.useState(false), [ye, ke] = g.useState(m), L = g.useRef(null);
    g.useEffect(() => {
      K && L.current && (L.current.focus(), L.current.select());
    }, [
      K
    ]);
    const z = g.useCallback(() => {
      const j = ye.trim();
      j && j !== m ? p(j) : ke(m), me(false);
    }, [
      ye,
      m,
      p
    ]), Z = g.useCallback((j) => {
      j.key === "Enter" ? z() : j.key === "Escape" && (ke(m), me(false));
    }, [
      z,
      m
    ]), Q = g.useCallback((j, ee) => {
      const { library: oe, renderer: pe } = we.getState();
      if (oe && pe) {
        const Ee = new Y0(j, ee);
        ue.getState().execute(Ee, {
          library: oe,
          renderer: pe
        });
      } else de.getState().renameCell(j, ee);
    }, []), te = g.useCallback((j) => {
      j === S && v.length <= 1 || C(j === S ? null : j);
    }, [
      S,
      v.length,
      C
    ]), ce = g.useCallback((j) => {
      j.target === j.currentTarget && (j.preventDefault(), ds.getState().open("cell", {
        x: j.clientX,
        y: j.clientY
      }));
    }, []);
    g.useEffect(() => {
      if (!A) return;
      const j = (ee) => {
        J.current && !J.current.contains(ee.target) && U(false);
      };
      return document.addEventListener("mousedown", j), () => document.removeEventListener("mousedown", j);
    }, [
      A,
      U
    ]), g.useEffect(() => {
      if (!A) return;
      const j = (ee) => {
        if (ee.target instanceof HTMLInputElement || ee.target instanceof HTMLTextAreaElement) return;
        const { focusedItem: oe, cellTree: pe, cells: Ee, expandedCells: Se, activeCell: Be, editingCellName: Qe, cellListMode: Ce } = de.getState();
        if (Qe) return;
        const Xe = Pe.getState().tabs, Re = Uv(Xe, pe, Ee, Se, Ce);
        if (Re.length === 0) return;
        const nt = x3(Re, oe);
        switch (ee.key) {
          case "ArrowDown": {
            ee.preventDefault();
            const Te = nt < Re.length - 1 ? nt + 1 : 0;
            B(Re[Te]);
            break;
          }
          case "ArrowUp": {
            ee.preventDefault();
            const Te = nt > 0 ? nt - 1 : Re.length - 1;
            B(Re[Te]);
            break;
          }
          case "ArrowRight": {
            if (ee.preventDefault(), (oe == null ? void 0 : oe.type) === "cell" && pe && Ce === "nested") {
              const Te = Yv(pe, oe.name);
              Te && Te.children.length > 0 && !Se.has(oe.name) ? E(oe.name) : Te && Te.children.length > 0 && Se.has(oe.name) && B({
                type: "cell",
                name: Te.children[0].name
              });
            }
            break;
          }
          case "ArrowLeft": {
            if (ee.preventDefault(), (oe == null ? void 0 : oe.type) === "cell" && pe && Ce === "nested") {
              const Te = Yv(pe, oe.name);
              if (Te && Te.children.length > 0 && Se.has(oe.name)) E(oe.name);
              else {
                const lt = v3(pe, oe.name);
                lt && B({
                  type: "cell",
                  name: lt
                });
              }
            }
            break;
          }
          case " ": {
            if (ee.preventDefault(), !oe) break;
            if (oe.type === "tab") {
              const Te = Pe.getState().activeTabId;
              oe.id !== Te && ($r(Te, oe.id), Pe.getState().setActiveTab(oe.id));
            } else oe.name === Be ? Ee.length > 1 && C(null) : C(oe.name);
            break;
          }
          case "Enter": {
            ee.preventDefault(), (oe == null ? void 0 : oe.type) === "cell" && de.getState().setEditingCellName(oe.name);
            break;
          }
          case "Delete":
          case "Backspace": {
            if (ee.preventDefault(), !oe) break;
            if (oe.type === "tab") {
              const Te = nt;
              window.dispatchEvent(new CustomEvent("rosette-close-tab", {
                detail: oe.id
              })), setTimeout(() => {
                const lt = de.getState(), wt = Pe.getState().tabs, st = Uv(wt, lt.cellTree, lt.cells, lt.expandedCells, lt.cellListMode);
                if (st.length === 0) B(null);
                else {
                  const sn = Math.min(Te, st.length - 1);
                  B(st[sn]);
                }
              }, 0);
            } else if (Ee.length > 1) {
              const { library: Te, renderer: lt } = we.getState();
              if (Te && lt) {
                const wt = nt < Re.length - 1 ? nt + 1 : nt - 1, st = wt >= 0 ? Re[wt] : null, sn = new gh(oe.name);
                ue.getState().execute(sn, {
                  library: Te,
                  renderer: lt
                }), st && !F1(st, oe) && B(st);
              }
            }
            break;
          }
          case "z":
          case "Z": {
            if (!(ee.metaKey || ee.ctrlKey)) return;
            ee.preventDefault();
            const { library: lt, renderer: wt } = we.getState();
            if (!lt || !wt) break;
            ee.shiftKey ? ue.getState().redo({
              library: lt,
              renderer: wt
            }) : ue.getState().undo({
              library: lt,
              renderer: wt
            });
            break;
          }
          case "Escape": {
            ee.preventDefault(), U(false);
            break;
          }
          default:
            return;
        }
      };
      return document.addEventListener("keydown", j), () => document.removeEventListener("keydown", j);
    }, [
      A,
      U,
      B,
      C,
      E
    ]);
    const ge = g.useCallback(() => {
      d ? W(true) : o();
    }, [
      d,
      o
    ]);
    if (r && !(d && ne)) return y.jsx(k3, {
      isDark: n,
      onExpand: ge
    });
    const je = d && ne;
    return y.jsxs(y.Fragment, {
      children: [
        je && y.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        y.jsxs("div", {
          ref: J,
          className: Y("fixed top-4 left-4 z-40 rounded-xl border transition-opacity duration-200", k ? "opacity-100" : "pointer-events-none opacity-0", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", je && "shadow-xl"),
          style: {
            width: i
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
                  children: K ? y.jsx("input", {
                    ref: L,
                    type: "text",
                    value: ye,
                    onChange: (j) => ke(j.target.value),
                    onBlur: z,
                    onKeyDown: Z,
                    onClick: (j) => j.stopPropagation(),
                    className: Y("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-xs font-medium leading-5 outline-none focus:ring-0", n ? "text-white/90" : "text-black/90")
                  }) : y.jsx("button", {
                    type: "button",
                    className: Y("absolute inset-0 cursor-text truncate border-0 bg-transparent p-0 text-left text-xs font-medium leading-5 select-none focus:outline-none", n ? "text-white/60" : "text-black/60"),
                    onClick: () => {
                      ke(m), me(true);
                    },
                    children: m
                  })
                }),
                !d && y.jsx("button", {
                  type: "button",
                  onClick: o,
                  className: Y("flex-shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: y.jsx(U4, {
                    className: Y("h-4 w-4", n ? "text-white/60" : "text-black/60")
                  })
                }),
                y.jsx(C3, {
                  isDark: n
                })
              ]
            }),
            y.jsx("div", {
              className: Y("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            y.jsx(_3, {
              isDark: n,
              focusedItem: A ? D : null
            }),
            y.jsx("div", {
              className: "flex flex-col gap-0.5 overflow-y-auto py-1",
              style: {
                maxHeight: "calc(100vh - 176px)"
              },
              onWheel: (j) => j.stopPropagation(),
              onContextMenu: ce,
              children: x && I === "nested" ? x.map((j) => y.jsx(W1, {
                node: j,
                depth: 0,
                isDark: n,
                activeCell: S,
                focusedCellName: A && (D == null ? void 0 : D.type) === "cell" ? D.name : null,
                editingCellName: _,
                expandedCells: b,
                hiddenCells: N,
                onSelect: te,
                onRename: Q,
                onToggleExpand: E
              }, j.name)) : v.map((j) => y.jsx(Q1, {
                name: j,
                isActive: j === S,
                isFocused: A && (D == null ? void 0 : D.type) === "cell" && D.name === j,
                isDark: n,
                depth: 0,
                hasChildren: false,
                isExpanded: false,
                isHidden: N.has(j),
                onToggleExpand: () => {
                },
                onSelect: () => te(j),
                onRename: (ee) => Q(j, ee),
                startEditing: _ === j,
                canDrag: j !== S
              }, j))
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
                      value: xe,
                      onChange: (j) => {
                        const ee = j.target.value;
                        $(ee);
                        const oe = parseInt(ee, 10);
                        !isNaN(oe) && oe >= 1 && R(oe);
                      },
                      onBlur: () => {
                        const j = parseInt(xe, 10) || T, ee = Math.max(1, Math.min(j, T));
                        R(ee), $(ee.toString());
                      },
                      onKeyDown: (j) => {
                        if (j.key === "Enter") {
                          const ee = parseInt(xe, 10) || T, oe = Math.max(1, Math.min(ee, T));
                          R(oe), $(oe.toString()), j.currentTarget.blur();
                        } else j.key === "Escape" && j.currentTarget.blur();
                      },
                      className: Y("h-6 w-12 rounded-lg border px-2 text-xs tabular-nums outline-none", n ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
                    }),
                    y.jsx($n, {
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
  function M3(l, n) {
    if (l.length < 4) return null;
    let r = l[0], o = l[1], i = l[2], c = l[3];
    if (!Number.isFinite(r) || !Number.isFinite(o) || !Number.isFinite(i) || !Number.isFinite(c)) return null;
    const d = Math.max((i - r) * 0.05, (c - o) * 0.05, 1);
    r -= d, o -= d, i += d, c += d;
    const f = i - r, m = c - o, p = n / f, v = n / m, x = Math.min(p, v), S = f * x, C = m * x, _ = (n - S) / 2, b = (n - C) / 2;
    return {
      minX: r,
      minY: o,
      maxX: i,
      maxY: c,
      width: f,
      height: m,
      scale: x,
      offsetX: _,
      offsetY: b
    };
  }
  function dc(l, n, r) {
    return {
      x: (l - r.minX) * r.scale + r.offsetX,
      y: (n - r.minY) * r.scale + r.offsetY
    };
  }
  function j3(l, n, r) {
    return {
      x: r.minX + (l - r.offsetX) / r.scale,
      y: r.minY + (n - r.offsetY) / r.scale
    };
  }
  function L3(l, n, r) {
    for (const [, o, i] of r) {
      if (o.length < 3) continue;
      const c = Math.round(i[0] * 255), d = Math.round(i[1] * 255), f = Math.round(i[2] * 255), m = i[3];
      l.fillStyle = `rgba(${c},${d},${f},${m})`, l.beginPath();
      const p = dc(o[0][0], o[0][1], n);
      l.moveTo(p.x, p.y);
      for (let v = 1; v < o.length; v++) {
        const x = dc(o[v][0], o[v][1], n);
        l.lineTo(x.x, x.y);
      }
      l.closePath(), l.fill();
    }
  }
  function R3(l, n, r, o, i, c, d) {
    const f = -r.x / o, m = -r.y / o, p = f + i / o, v = m + c / o, x = dc(f, m, n), S = dc(p, v, n), C = x.x, _ = x.y, b = S.x - x.x, E = S.y - x.y;
    l.strokeStyle = d.viewportStroke, l.lineWidth = 1.5, l.setLineDash([
      3,
      3
    ]), l.strokeRect(C, _, b, E), l.fillStyle = d.viewportFill, l.fillRect(C, _, b, E), l.setLineDash([]);
  }
  function A3(l) {
    return {
      canvasBg: l ? "rgb(29,29,29)" : "rgb(241,241,241)",
      viewportStroke: l ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
      viewportFill: l ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    };
  }
  const Fn = 180;
  function Xv() {
    const l = g.useRef(null), n = g.useRef(null), r = g.useRef(null), o = g.useRef(null), [i, c] = g.useState(false), d = Ue((A) => A.zoom), f = Ue((A) => A.offset), m = he((A) => A.theme), p = we((A) => A.library), v = ve((A) => A.layers), x = us((A) => A.isMinimized), S = ue((A) => A.undoStack.length), C = ue((A) => A.redoStack.length), _ = m === "dark", b = g.useMemo(() => A3(_), [
      _
    ]);
    g.useEffect(() => {
      const A = l.current;
      if (!A) return;
      const D = (U) => {
        const B = document.getElementById("rosette-canvas");
        B && (U.preventDefault(), B.dispatchEvent(new WheelEvent("wheel", U)));
      };
      return A.addEventListener("wheel", D, {
        passive: false
      }), () => A.removeEventListener("wheel", D);
    }, []);
    const E = g.useCallback(() => {
      var _a;
      return ((_a = document.getElementById("rosette-canvas")) == null ? void 0 : _a.getBoundingClientRect()) ?? null;
    }, []), k = g.useCallback((A) => {
      var _a;
      const D = o.current;
      if (!D) return;
      const U = (_a = n.current) == null ? void 0 : _a.getBoundingClientRect();
      if (!U) return;
      const B = A.clientX - U.left, ne = A.clientY - U.top, W = j3(B, ne, D), J = E();
      if (!J) return;
      const fe = -(W.x * d) + J.width / 2, xe = -(W.y * d) + J.height / 2;
      Ue.getState().setOffset(fe, xe);
    }, [
      d,
      E
    ]), O = g.useCallback((A) => {
      A.stopPropagation(), c(true), k(A);
    }, [
      k
    ]), R = g.useCallback((A) => {
      i && k(A);
    }, [
      i,
      k
    ]), T = g.useCallback(() => {
      c(false);
    }, []), N = g.useCallback(() => {
      c(false);
    }, []);
    if (g.useEffect(() => {
      if (x || !p) return;
      const A = p.get_all_bounds();
      if (!A) {
        o.current = null, r.current = null;
        return;
      }
      const D = M3(A, Fn);
      if (!D) {
        o.current = null, r.current = null;
        return;
      }
      o.current = D;
      let U;
      try {
        U = p.get_render_polygons();
      } catch {
        r.current = null;
        return;
      }
      if (!U || U.length === 0) {
        r.current = null;
        return;
      }
      const B = /* @__PURE__ */ new Set();
      for (const [, fe] of v) fe.visible || B.add(`${fe.layerNumber}:${fe.datatype}`);
      let ne = U;
      B.size > 0 && (ne = U.filter(([fe]) => {
        const xe = p.get_element_info(fe);
        if (!xe) return true;
        const $ = `${xe.layer}:${xe.datatype}`, K = B.has($);
        return xe.free(), !K;
      }));
      const W = document.createElement("canvas");
      W.width = Fn, W.height = Fn;
      const J = W.getContext("2d");
      J && (J.clearRect(0, 0, Fn, Fn), L3(J, D, ne), r.current = W);
    }, [
      p,
      v,
      x,
      S,
      C
    ]), g.useEffect(() => {
      if (x) return;
      const A = n.current;
      if (!A) return;
      const D = A.getContext("2d");
      if (!D) return;
      const U = o.current;
      if (D.clearRect(0, 0, Fn, Fn), D.fillStyle = b.canvasBg, D.fillRect(0, 0, Fn, Fn), r.current && D.drawImage(r.current, 0, 0), U) {
        const B = E();
        B && B.width > 0 && B.height > 0 && R3(D, U, f, d, B.width, B.height, b);
      }
    }, [
      d,
      f,
      x,
      b,
      E,
      S,
      C
    ]), x) return null;
    const I = `rounded-xl border p-1 ${_ ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"}`;
    return y.jsx("div", {
      className: "pointer-events-none absolute bottom-4 right-4 select-none",
      children: y.jsx("div", {
        ref: l,
        className: `pointer-events-auto relative ${I}`,
        children: y.jsx("canvas", {
          ref: n,
          width: Fn,
          height: Fn,
          className: "pointer-events-auto cursor-move rounded-lg",
          onMouseDown: O,
          onMouseMove: R,
          onMouseUp: T,
          onMouseLeave: N
        })
      })
    });
  }
  const T3 = ns, N3 = [
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
  function O3({ pattern: l, className: n }) {
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
  function I3({ color: l, isDark: n, onChange: r, hexTabIdx: o }) {
    const [i, c] = g.useState(l), d = g.useRef(null);
    g.useEffect(() => {
      c(l);
    }, [
      l
    ]);
    const f = g.useCallback(() => {
      const p = i.trim().replace(/^#?/, "#");
      /^#[0-9a-fA-F]{6}$/.test(p) ? r(p.toLowerCase()) : c(l);
    }, [
      i,
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
          children: T3.map((p) => y.jsx("button", {
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
              value: i,
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
  function D3({ value: l, isDark: n, onChange: r, baseTabIdx: o }) {
    return y.jsx("div", {
      className: "grid grid-cols-4 gap-1",
      children: N3.map((i, c) => {
        const d = l === i.id;
        return y.jsx("button", {
          type: "button",
          "data-tab-index": o != null ? o + c : void 0,
          onClick: (f) => {
            f.stopPropagation(), r(i.id);
          },
          className: Y("flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1 text-[10px] outline-none transition-colors", d ? n ? "border-white/20 bg-white/10 text-white/90" : "border-black/20 bg-black/10 text-black/90" : n ? "border-white/5 text-white/40 hover:border-white/15 hover:text-white/70 focus:border-white/15 focus:text-white/70" : "border-black/5 text-black/40 hover:border-black/15 hover:text-black/70 focus:border-black/15 focus:text-black/70"),
          tabIndex: -1,
          children: y.jsx(O3, {
            pattern: i.id
          })
        }, i.id);
      })
    });
  }
  function Vv({ label: l, value: n, isDark: r, onChange: o, tabIdx: i }) {
    const [c, d] = g.useState(String(n)), [f, m] = g.useState(false), p = g.useRef(null);
    g.useEffect(() => {
      f || d(String(n));
    }, [
      n,
      f
    ]);
    const v = g.useCallback(() => {
      const x = Number.parseInt(c, 10);
      !Number.isNaN(x) && x >= 0 && x <= Xf && x !== n ? o(x) : d(String(n));
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
          "data-tab-index": i,
          onChange: (x) => d(x.target.value),
          onFocus: (x) => {
            m(true), x.target.select();
          },
          onBlur: () => {
            m(false), v();
          },
          onKeyDown: (x) => {
            var _a, _b2;
            x.key === "Enter" ? (x.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : x.key === "Escape" && (x.preventDefault(), x.stopPropagation(), d(String(n)), (_b2 = p.current) == null ? void 0 : _b2.blur());
          },
          onClick: (x) => x.stopPropagation(),
          tabIndex: -1,
          className: Y("w-16 cursor-text rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors", f ? r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : r ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function z3({ label: l, value: n, isDark: r, onChange: o, tabIdx: i }) {
    const [c, d] = g.useState(n), [f, m] = g.useState(false), p = g.useRef(null);
    g.useEffect(() => {
      f || d(n);
    }, [
      n,
      f
    ]);
    const v = g.useCallback(() => {
      const x = c.trim();
      x && x !== n ? o(x) : d(n);
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
          "data-tab-index": i,
          onChange: (x) => d(x.target.value),
          onFocus: (x) => {
            m(true), x.target.select();
          },
          onBlur: () => {
            m(false), v();
          },
          onKeyDown: (x) => {
            var _a, _b2;
            x.key === "Enter" ? (x.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : x.key === "Escape" && (x.preventDefault(), x.stopPropagation(), d(n), (_b2 = p.current) == null ? void 0 : _b2.blur());
          },
          onClick: (x) => x.stopPropagation(),
          tabIndex: -1,
          className: Y("w-28 cursor-text truncate rounded border px-1.5 py-0.5 text-right text-xs outline-none transition-colors", f ? r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : r ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function zf({ label: l, isDark: n }) {
    return y.jsx("span", {
      className: Y("text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function H3({ layer: l, isDark: n }) {
    const r = we((f) => f.library), o = we((f) => f.renderer), i = g.useRef(null), c = g.useCallback((f) => {
      if (!r || !o) return;
      const m = {
        ...l,
        ...f
      };
      if (f.layerNumber !== void 0 || f.datatype !== void 0) {
        for (const v of ve.getState().layers.values()) if (v.id !== l.id && v.layerNumber === m.layerNumber && v.datatype === m.datatype) {
          $t.getState().show(`Layer ${m.layerNumber}/${m.datatype} already exists`, "warn");
          return;
        }
      }
      const p = new H0(l, m);
      ue.getState().execute(p, {
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
        (_b2 = (_a = i.current) == null ? void 0 : _a.querySelector("[data-tab-index='0']")) == null ? void 0 : _b2.focus();
      });
      return () => cancelAnimationFrame(f);
    }, []), g.useEffect(() => {
      const f = (m) => {
        var _a;
        if (m.key === "Escape") {
          const p = document.activeElement;
          if (p && ((_a = i.current) == null ? void 0 : _a.contains(p)) && p.tagName === "INPUT") return;
          m.preventDefault(), ve.getState().setExpandedLayerId(null);
        }
      };
      return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
    }, []), g.useEffect(() => {
      const f = (m) => {
        i.current && !i.current.contains(m.target) && ve.getState().setExpandedLayerId(null);
      };
      return document.addEventListener("mousedown", f), () => document.removeEventListener("mousedown", f);
    }, []);
    const d = g.useCallback((f) => {
      if (f.key === "Escape" || (f.stopPropagation(), f.key !== "Tab" || !i.current)) return;
      f.preventDefault();
      const m = Array.from(i.current.querySelectorAll("[data-tab-index]")).sort((S, C) => Number(S.dataset.tabIndex) - Number(C.dataset.tabIndex));
      if (m.length === 0) return;
      const p = m.findIndex((S) => S === document.activeElement), v = f.shiftKey ? -1 : 1, x = p === -1 ? 0 : (p + v + m.length) % m.length;
      m[x].focus();
    }, []);
    return y.jsxs("div", {
      ref: i,
      role: "group",
      className: "mx-1 flex w-[calc(100%-8px)] flex-col gap-2 px-2.5 py-2",
      onClick: (f) => f.stopPropagation(),
      onKeyDown: d,
      onMouseDown: (f) => f.stopPropagation(),
      children: [
        y.jsx(z3, {
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
            y.jsx(zf, {
              label: "Color",
              isDark: n
            }),
            y.jsx(I3, {
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
            y.jsx(zf, {
              label: "GDS",
              isDark: n
            }),
            y.jsx(Vv, {
              label: "Layer",
              value: l.layerNumber,
              isDark: n,
              onChange: (f) => c({
                layerNumber: f
              }),
              tabIdx: 2
            }),
            y.jsx(Vv, {
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
            y.jsx(zf, {
              label: "Fill",
              isDark: n
            }),
            y.jsx(D3, {
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
  function Y3({ layer: l, isActive: n, isFocused: r, isExpanded: o, isDark: i, onSelect: c, onToggleExpand: d, startEditing: f }) {
    const [m, p] = g.useState(false), [v, x] = g.useState(l.name), S = g.useRef(null), C = g.useRef(null);
    g.useEffect(() => {
      r && C.current && C.current.scrollIntoView({
        block: "nearest"
      });
    }, [
      r
    ]), g.useEffect(() => {
      f && (p(true), x(l.name), ve.getState().setEditingLayerId(null));
    }, [
      f,
      l.name
    ]), g.useEffect(() => {
      m && S.current && (S.current.focus(), S.current.select());
    }, [
      m
    ]);
    const _ = we((N) => N.library), b = we((N) => N.renderer), E = g.useCallback(() => {
      const N = v.trim();
      if (N && N !== l.name && _ && b) {
        const I = new H0(l, {
          ...l,
          name: N
        });
        ue.getState().execute(I, {
          library: _,
          renderer: b
        });
      } else x(l.name);
      p(false);
    }, [
      v,
      l,
      _,
      b
    ]), k = g.useCallback((N) => {
      N.key === "Enter" ? E() : N.key === "Escape" && (x(l.name), p(false));
    }, [
      E,
      l.name
    ]), O = g.useCallback((N) => {
      N.preventDefault(), N.stopPropagation(), ds.getState().open("layer", {
        x: N.clientX,
        y: N.clientY
      }, String(l.id));
    }, [
      l.id
    ]), R = g.useCallback((N) => {
      N.stopPropagation(), c(), d();
    }, [
      c,
      d
    ]), T = g.useCallback((N) => {
      o && N.stopPropagation();
    }, [
      o
    ]);
    return y.jsxs("div", {
      className: "flex flex-col gap-0.5",
      children: [
        y.jsxs("button", {
          ref: C,
          type: "button",
          className: Y("group relative mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-[7px] py-1.5 text-left transition-colors", n ? i ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? i ? "bg-[rgb(44,44,44)] text-white/90" : "bg-[rgb(227,227,227)] text-black/90" : i ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90", r && (i ? "ring-1 ring-white/25" : "ring-1 ring-black/20")),
          onClick: c,
          onContextMenu: O,
          onMouseDown: (N) => N.preventDefault(),
          tabIndex: -1,
          children: [
            y.jsx("span", {
              role: "img",
              className: Y("h-4.5 w-4.5 flex-shrink-0 cursor-pointer rounded border outline-none transition-shadow", i ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30", !l.visible && "opacity-40"),
              style: {
                backgroundColor: l.color
              },
              onClick: R,
              onMouseDown: T,
              onKeyDown: () => {
              }
            }),
            y.jsx("div", {
              className: "relative h-5 min-w-0 flex-1",
              children: m ? y.jsx("input", {
                ref: S,
                type: "text",
                value: v,
                onChange: (N) => x(N.target.value),
                onBlur: E,
                onKeyDown: k,
                onClick: (N) => N.stopPropagation(),
                className: Y("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", i ? "text-white/90" : "text-gray-900")
              }) : y.jsx("span", {
                className: Y("absolute inset-0 truncate text-sm leading-5 select-none", !l.visible && "opacity-40"),
                onDoubleClick: (N) => {
                  N.stopPropagation(), p(true);
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
        o && y.jsx(H3, {
          layer: l,
          isDark: i
        })
      ]
    });
  }
  function U3() {
    const n = he((b) => b.theme) === "dark", { getAllLayers: r, activeLayerId: o, setActiveLayer: i } = ve(), c = ve((b) => b.editingLayerId), d = ve((b) => b.expandedLayerId), f = ve((b) => b.setExpandedLayerId), m = ve((b) => b.isFocused), p = ve((b) => b.focusedLayerId), v = ve((b) => b.setFocused), x = ve((b) => b.setFocusedLayerId);
    Kr("layers-panel", m);
    const S = r(), C = g.useRef(null), _ = g.useCallback((b) => {
      const E = ve.getState().expandedLayerId;
      f(E === b ? null : b);
    }, [
      f
    ]);
    return g.useEffect(() => {
      if (!m) return;
      const b = (E) => {
        C.current && !C.current.contains(E.target) && v(false);
      };
      return document.addEventListener("mousedown", b), () => document.removeEventListener("mousedown", b);
    }, [
      m,
      v
    ]), g.useEffect(() => {
      if (!m) return;
      const b = (E) => {
        if (E.target instanceof HTMLInputElement || E.target instanceof HTMLTextAreaElement) return;
        const { focusedLayerId: k, editingLayerId: O, expandedLayerId: R } = ve.getState();
        if (O || R) return;
        const T = ve.getState().getAllLayers();
        if (T.length === 0) return;
        const N = k != null ? T.findIndex((I) => I.id === k) : -1;
        switch (E.key) {
          case "ArrowDown": {
            E.preventDefault();
            const I = N < T.length - 1 ? N + 1 : 0;
            x(T[I].id);
            break;
          }
          case "ArrowUp": {
            E.preventDefault();
            const I = N > 0 ? N - 1 : T.length - 1;
            x(T[I].id);
            break;
          }
          case " ": {
            E.preventDefault(), k != null && i(k);
            break;
          }
          case "Enter": {
            if (E.preventDefault(), k != null) {
              const I = ve.getState().expandedLayerId;
              f(I === k ? null : k);
            }
            break;
          }
          case "Delete":
          case "Backspace": {
            if (E.preventDefault(), k != null && T.length > 1) {
              const { library: I, renderer: A } = we.getState();
              if (I && A) {
                const D = N < T.length - 1 ? N + 1 : N - 1, U = D >= 0 ? T[D].id : null, B = new hh(k);
                ue.getState().execute(B, {
                  library: I,
                  renderer: A
                }), U != null && U !== k && x(U);
              }
            }
            break;
          }
          case "z":
          case "Z": {
            if (!(E.metaKey || E.ctrlKey)) return;
            E.preventDefault();
            const { library: A, renderer: D } = we.getState();
            if (!A || !D) break;
            E.shiftKey ? ue.getState().redo({
              library: A,
              renderer: D
            }) : ue.getState().undo({
              library: A,
              renderer: D
            });
            break;
          }
          case "Escape": {
            E.preventDefault(), v(false);
            break;
          }
          default:
            return;
        }
      };
      return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
    }, [
      m,
      v,
      x,
      i,
      f
    ]), y.jsx("div", {
      className: "flex h-full flex-col",
      children: y.jsx("div", {
        ref: C,
        className: "flex flex-1 flex-col gap-0.5 overflow-y-auto py-1",
        onWheel: (b) => b.stopPropagation(),
        children: S.map((b) => y.jsx(Y3, {
          layer: b,
          isActive: b.id === o,
          isFocused: m && b.id === p,
          isExpanded: d === b.id,
          isDark: n,
          onSelect: () => i(b.id),
          onToggleExpand: () => _(b.id),
          startEditing: c === b.id
        }, b.id))
      })
    });
  }
  function gt({ label: l, value: n, unit: r, isDark: o, onChange: i, readOnly: c }) {
    const [d, f] = g.useState(false), [m, p] = g.useState(n), v = g.useRef(null), x = g.useRef(false), S = g.useRef(true);
    g.useEffect(() => (S.current = true, () => {
      S.current = false;
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
    const C = g.useCallback(() => {
      if (x.current) {
        x.current = false, f(false);
        return;
      }
      if (!S.current) return;
      const b = Number.parseFloat(m);
      !Number.isNaN(b) && i && i(b), f(false);
    }, [
      m,
      i
    ]), _ = g.useCallback((b) => {
      var _a, _b2;
      b.key === "Enter" ? (b.preventDefault(), (_a = v.current) == null ? void 0 : _a.blur()) : b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), x.current = true, p(n), (_b2 = v.current) == null ? void 0 : _b2.blur());
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
              onChange: (b) => p(b.target.value),
              onBlur: C,
              onKeyDown: _,
              onClick: (b) => b.stopPropagation(),
              className: Y("w-20 rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none", o ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
            }) : y.jsx("button", {
              type: "button",
              onClick: () => {
                !c && i && f(true);
              },
              onFocus: () => {
                !c && i && f(true);
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
  function B3({ label: l, value: n, isDark: r, onChange: o }) {
    const [i, c] = g.useState(false), [d, f] = g.useState(n), m = g.useRef(null), p = g.useRef(false), v = g.useRef(true);
    g.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), g.useEffect(() => {
      i || f(n);
    }, [
      n,
      i
    ]), g.useEffect(() => {
      i && m.current && (m.current.focus(), m.current.select());
    }, [
      i
    ]);
    const x = g.useCallback(() => {
      if (p.current) {
        p.current = false, c(false);
        return;
      }
      if (!v.current) return;
      const C = d.trim();
      C && C !== n && o(C), c(false);
    }, [
      d,
      n,
      o
    ]), S = g.useCallback((C) => {
      var _a, _b2;
      C.key === "Enter" ? (C.preventDefault(), (_a = m.current) == null ? void 0 : _a.blur()) : C.key === "Escape" && (C.preventDefault(), C.stopPropagation(), p.current = true, f(n), (_b2 = m.current) == null ? void 0 : _b2.blur());
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
        i ? y.jsx("input", {
          ref: m,
          type: "text",
          value: d,
          onChange: (C) => f(C.target.value),
          onBlur: x,
          onKeyDown: S,
          onClick: (C) => C.stopPropagation(),
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
  function X3({ label: l, value: n, isDark: r, onChange: o }) {
    const [i, c] = g.useState(false), [d, f] = g.useState(n), m = g.useRef(null), p = g.useRef(false), v = g.useRef(true);
    g.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), g.useEffect(() => {
      i || f(n);
    }, [
      n,
      i
    ]), g.useEffect(() => {
      i && m.current && (m.current.focus(), m.current.select());
    }, [
      i
    ]);
    const x = g.useCallback(() => {
      if (p.current) {
        p.current = false, c(false);
        return;
      }
      if (!v.current) return;
      const b = d.trim();
      b && b !== n && o(b), c(false);
    }, [
      d,
      n,
      o
    ]), S = g.useCallback((b) => {
      var _a, _b2;
      b.key === "Enter" && !b.shiftKey ? (b.preventDefault(), (_a = m.current) == null ? void 0 : _a.blur()) : b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), p.current = true, f(n), (_b2 = m.current) == null ? void 0 : _b2.blur());
    }, [
      n
    ]), C = n.split(`
`), _ = C.length > 2 ? `${C.slice(0, 2).join(`
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
        i ? y.jsx("textarea", {
          ref: m,
          value: d,
          onChange: (b) => f(b.target.value),
          onBlur: x,
          onKeyDown: S,
          onClick: (b) => b.stopPropagation(),
          rows: Math.min(6, Math.max(2, d.split(`
`).length)),
          className: Y("w-full resize-none rounded border px-1.5 py-1 font-mono text-xs leading-relaxed outline-none", r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
        }) : y.jsx("button", {
          type: "button",
          onClick: () => c(true),
          onFocus: () => c(true),
          className: Y("w-full whitespace-pre-wrap rounded border border-transparent px-1.5 py-1 text-left font-mono text-xs leading-relaxed outline-none transition-colors", r ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
          tabIndex: 0,
          children: _ || y.jsx("span", {
            className: r ? "text-white/30" : "text-black/30",
            children: "Empty"
          })
        })
      ]
    });
  }
  function Hf({ currentLayer: l, currentDatatype: n, isDark: r, onChange: o }) {
    const i = ve((I) => I.getAllLayers)(), [c, d] = g.useState(`${l}:${n}`), [f, m] = g.useState(false), [p, v] = g.useState(-1);
    Kr("layer-selector", f);
    const x = g.useRef(null), S = g.useRef(null), C = `${l}:${n}`;
    g.useEffect(() => {
      d(C);
    }, [
      C
    ]);
    const _ = i.find((I) => `${I.layerNumber}:${I.datatype}` === c), [b, E] = g.useState({
      top: 0,
      right: 0,
      width: 0
    }), k = g.useCallback(() => {
      if (!x.current) return;
      const I = x.current.getBoundingClientRect();
      E({
        top: I.bottom + 4,
        right: window.innerWidth - I.right,
        width: Math.max(I.width, 160)
      });
      const A = i.findIndex((D) => `${D.layerNumber}:${D.datatype}` === c);
      v(A >= 0 ? A : 0), m(true);
    }, [
      i,
      c
    ]), O = g.useCallback(() => {
      var _a;
      m(false), (_a = x.current) == null ? void 0 : _a.focus();
    }, []), R = g.useCallback((I) => {
      d(`${I.layerNumber}:${I.datatype}`), o(I.layerNumber, I.datatype), O();
    }, [
      o,
      O
    ]);
    g.useEffect(() => {
      f && S.current && S.current.focus();
    }, [
      f
    ]), g.useEffect(() => {
      if (!f) return;
      const I = (A) => {
        var _a, _b2;
        ((_a = x.current) == null ? void 0 : _a.contains(A.target)) || ((_b2 = S.current) == null ? void 0 : _b2.contains(A.target)) || m(false);
      };
      return document.addEventListener("mousedown", I), () => document.removeEventListener("mousedown", I);
    }, [
      f
    ]);
    const T = g.useCallback((I) => {
      (I.key === "ArrowDown" || I.key === "ArrowUp" || I.key === "Enter" || I.key === " ") && (I.preventDefault(), k());
    }, [
      k
    ]), N = g.useCallback((I) => {
      switch (I.key) {
        case "ArrowDown":
          I.preventDefault(), I.stopPropagation(), v((A) => Math.min(A + 1, i.length - 1));
          break;
        case "ArrowUp":
          I.preventDefault(), I.stopPropagation(), v((A) => Math.max(A - 1, 0));
          break;
        case "Enter":
        case " ": {
          I.preventDefault(), I.stopPropagation();
          const A = i[p];
          A && R(A);
          break;
        }
        case "Escape":
        case "Tab":
          I.preventDefault(), I.stopPropagation(), O();
          break;
      }
    }, [
      i,
      p,
      R,
      O
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      children: [
        y.jsx("span", {
          className: Y("text-xs select-none", r ? "text-white/50" : "text-black/50"),
          children: "Layer"
        }),
        y.jsxs("button", {
          ref: x,
          type: "button",
          onClick: () => f ? O() : k(),
          onKeyDown: T,
          className: Y("flex max-w-36 items-center gap-1.5 rounded-lg border px-1.5 py-0.5 text-xs outline-none transition-colors", r ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 focus-visible:border-white/40" : "border-black/10 bg-black/5 text-black/90 hover:bg-black/10 focus-visible:border-black/40"),
          children: [
            _ && y.jsx("div", {
              className: Y("h-3 w-3 flex-shrink-0 rounded-sm border", r ? "border-white/10" : "border-black/10"),
              style: {
                backgroundColor: _.color
              }
            }),
            y.jsx("span", {
              className: "truncate",
              children: _ ? _.name : `${l}/${n}`
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
        f && ps.createPortal(y.jsx("div", {
          ref: S,
          role: "listbox",
          tabIndex: -1,
          onKeyDown: N,
          className: Y("fixed z-50 overflow-y-auto rounded-xl border py-1 shadow-lg outline-none", r ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: {
            top: b.top,
            right: b.right,
            minWidth: b.width,
            maxHeight: 200
          },
          children: i.map((I, A) => {
            const U = `${I.layerNumber}:${I.datatype}` === c, B = A === p;
            return y.jsxs("div", {
              "data-layer-option": true,
              role: "option",
              "aria-selected": U,
              className: Y("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", B ? r ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? "text-white/70" : "text-black/70"),
              onMouseDown: (ne) => {
                ne.preventDefault(), R(I);
              },
              onMouseEnter: () => v(A),
              children: [
                y.jsx("div", {
                  className: Y("h-3.5 w-3.5 flex-shrink-0 rounded-sm border", r ? "border-white/10" : "border-black/10"),
                  style: {
                    backgroundColor: I.color
                  }
                }),
                y.jsx("span", {
                  className: "flex-1 truncate",
                  children: I.name
                }),
                y.jsxs("span", {
                  className: Y("flex-shrink-0 font-mono text-[11px]", r ? "text-white/40" : "text-black/40"),
                  children: [
                    I.layerNumber,
                    "/",
                    I.datatype
                  ]
                }),
                U && y.jsx("svg", {
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
            }, I.id);
          })
        }), document.body)
      ]
    });
  }
  function $v({ sourceInfo: l, isDark: n }) {
    const [r, o] = g.useState(false), [i, c] = g.useState(l.code), d = g.useRef(null);
    g.useEffect(() => {
      c(l.code), o(false);
    }, [
      l.code,
      l.line
    ]);
    const f = g.useCallback(async () => {
      if (i.trim() === l.code.trim()) {
        o(false);
        return;
      }
      await US({
        file: l.file,
        line: l.line,
        old_code: l.code,
        new_code: i
      }) && o(false);
    }, [
      i,
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
            value: i,
            rows: Math.min(i.split(`
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
  function Dt({ label: l, isDark: n }) {
    return y.jsx("div", {
      className: Y("px-3 pt-2.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function J1({ index: l, x: n, y: r, unit: o, isDark: i, canRemove: c, onChangeX: d, onChangeY: f, onRemove: m, readOnly: p }) {
    return y.jsxs("div", {
      "data-vertex-row": true,
      children: [
        y.jsxs("div", {
          className: "flex items-center justify-between px-3 pt-1.5 pb-0",
          children: [
            y.jsxs("span", {
              className: Y("text-[10px] font-mono select-none", i ? "text-white/30" : "text-black/30"),
              children: [
                "V",
                l
              ]
            }),
            !p && y.jsx("button", {
              type: "button",
              onClick: m,
              disabled: !c,
              className: Y("flex-shrink-0 rounded p-0.5 transition-colors", c ? i ? "text-white/40 hover:bg-white/10 hover:text-white/70" : "text-black/40 hover:bg-black/10 hover:text-black/70" : i ? "cursor-not-allowed text-white/10" : "cursor-not-allowed text-black/10"),
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
        y.jsx(gt, {
          label: "X",
          value: n,
          unit: o,
          isDark: i,
          onChange: d,
          readOnly: p
        }),
        y.jsx(gt, {
          label: "Y",
          value: r,
          unit: o,
          isDark: i,
          onChange: f,
          readOnly: p
        })
      ]
    });
  }
  function qv({ vertices: l, unitInfo: n, isDark: r, onChangeVertex: o, onRemoveVertex: i, onAddVertex: c, readOnly: d, label: f }) {
    const m = l.length / 2, p = m > 3, v = g.useRef(null), [x, S] = g.useState(null);
    g.useEffect(() => {
      if (x === null) return;
      const b = x;
      let E, k = 0;
      const O = 10, R = () => {
        const T = v.current;
        if (!T) {
          S(null);
          return;
        }
        const N = T.querySelectorAll("[data-vertex-row]");
        if (N.length <= b) {
          if (k++, k >= O) {
            S(null);
            return;
          }
          E = requestAnimationFrame(R);
          return;
        }
        T.scrollTop = T.scrollHeight;
        const I = N[N.length - 1];
        if (I) {
          const A = I.querySelector("[data-field='X'] button");
          A && A.focus();
        }
        S(null);
      };
      return E = requestAnimationFrame(R), () => cancelAnimationFrame(E);
    }, [
      x
    ]);
    const C = g.useCallback(() => {
      c(), S(m);
    }, [
      c,
      m
    ]), _ = [];
    for (let b = 0; b < m; b++) {
      const E = l[b * 2], k = l[b * 2 + 1], O = ot(E / be, n), R = ot(-k / be, n);
      _.push(y.jsx(J1, {
        index: b,
        x: O,
        y: R,
        unit: n.unit,
        isDark: r,
        canRemove: p,
        onChangeX: (T) => o(b, "x", T),
        onChangeY: (T) => o(b, "y", T),
        onRemove: () => i(b),
        readOnly: d
      }, b));
    }
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(Dt, {
          label: f ?? "Vertices",
          isDark: r
        }),
        y.jsx("div", {
          ref: v,
          className: "flex max-h-48 flex-col overflow-y-auto",
          children: _
        }),
        !d && y.jsx("div", {
          className: "px-3 pt-1",
          children: y.jsxs("button", {
            type: "button",
            onClick: C,
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
  function V3() {
    const l = ie((i) => i.selectedIds), n = we((i) => i.library), [r, o] = g.useState(0);
    return g.useEffect(() => {
      if (!n || l.size === 0) return;
      let i;
      const c = () => {
        n.is_dirty() && o((d) => d + 1), i = requestAnimationFrame(c);
      };
      return i = requestAnimationFrame(c), () => cancelAnimationFrame(i);
    }, [
      n,
      l
    ]), g.useMemo(() => {
      if (l.size === 0 || !n) return null;
      let i = null;
      const c = l.values().next().value;
      if (c.startsWith("ref:")) {
        const S = n.get_cell_ref_info(c);
        if (S) {
          const [C, _, b, E, k, O] = S.transform, R = n.get_cell_origin_by_name(S.cell_name), T = R ? R[0] : 0, N = R ? R[1] : 0, A = Math.atan2(b, C) * 180 / Math.PI, D = Math.sqrt(C * C + b * b), U = n.get_cell_ref_array(c);
          let B = null;
          U && U.length === 4 && (B = {
            columns: U[0],
            rows: U[1],
            colSpacing: U[2],
            rowSpacing: U[3]
          }), i = {
            cellName: S.cell_name,
            x: C * T + _ * N + k,
            y: b * T + E * N + O,
            tx: k,
            ty: O,
            rotation: A,
            scale: D,
            transform: new Float64Array(S.transform),
            childOriginX: T,
            childOriginY: N,
            array: B,
            refId: c,
            ids: [
              ...l
            ]
          }, S.free();
        }
      }
      const d = [];
      for (const S of l) {
        const C = n.get_element_info(S);
        C && (d.push({
          id: S,
          layer: C.layer,
          datatype: C.datatype,
          vertexCount: C.vertices.length / 2,
          vertices: new Float64Array(C.vertices)
        }), C.free());
      }
      if (d.length === 0) return null;
      const f = n.get_bounds_for_ids([
        ...l
      ]), m = f ? {
        minX: f[0],
        minY: f[1],
        maxX: f[2],
        maxY: f[3]
      } : null, p = d[0].layer, v = d[0].datatype, x = d.some((S) => S.layer !== p || S.datatype !== v);
      return {
        elements: d,
        bounds: m,
        isMixed: x,
        instance: i
      };
    }, [
      l,
      n,
      r
    ]);
  }
  const $3 = {
    unit: "\xB5m",
    scale: 1e3
  };
  function q3() {
    var _a, _b2, _c2, _d, _e;
    const n = he((j) => j.theme) === "dark", r = $3, o = V3(), i = we((j) => j.library), c = we((j) => j.renderer), d = de((j) => j.activeCell);
    ue((j) => j.undoStack.length + j.redoStack.length);
    const f = tt((j) => j.pathMetadata), m = ie((j) => j.selectedIds), p = Vt((j) => j.images), v = g.useMemo(() => {
      for (const j of m) if (jn(j)) return Gr(j);
      return null;
    }, [
      m
    ]), x = v ? p.get(v) ?? null : null, S = i == null ? void 0 : i.get_cell_origin(), C = S ? {
      x: S[0],
      y: S[1]
    } : {
      x: 0,
      y: 0
    }, _ = g.useRef(C);
    _.current = C;
    const b = g.useRef(void 0), E = g.useRef(void 0), k = g.useCallback((j) => {
      if (!d || !i || !c || j === d) return;
      const ee = new Y0(d, j);
      ue.getState().execute(ee, {
        library: i,
        renderer: c
      });
    }, [
      d,
      i,
      c
    ]), O = g.useCallback((j, ee) => {
      if (!i || !c) return;
      const oe = ee * r.scale, pe = j === "y" ? -oe * be : oe * be, Ee = _.current, Se = new f2(Ee.x, Ee.y, j === "x" ? pe : Ee.x, j === "y" ? pe : Ee.y);
      ue.getState().execute(Se, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c,
      r
    ]), R = g.useCallback((j, ee) => {
      if (!o || !i || !c) return;
      const oe = o.elements.map((Ee) => Ee.id), pe = new Iy(oe, j, ee);
      ue.getState().execute(pe, {
        library: i,
        renderer: c
      }), o.elements.length === 1 && XS(o.elements[0].id, j, ee);
    }, [
      o,
      i,
      c
    ]), T = g.useCallback((j) => {
      if (!i) return;
      let ee = i.get_element_info(j);
      if (!ee) {
        const oe = ie.getState().selectedIds;
        if (oe.size === 1) {
          const pe = oe.values().next().value;
          pe && (ee = i.get_element_info(pe));
        }
      }
      ee && (Qo(j, new Float64Array(ee.vertices)), ee.free());
    }, [
      i
    ]), N = g.useCallback((j, ee) => {
      if (!(o == null ? void 0 : o.bounds) || !i || !c) return;
      const oe = ee * r.scale, pe = j === "y" ? -oe * be : oe * be, Ee = o.elements.map((Be) => Be.id), Se = new u2(Ee, o.bounds.minX, o.bounds.minY, j === "x" ? pe : o.bounds.minX, j === "y" ? pe - (o.bounds.maxY - o.bounds.minY) : o.bounds.minY);
      ue.getState().execute(Se, {
        library: i,
        renderer: c
      }), o.elements.length === 1 && T(o.elements[0].id);
    }, [
      o,
      i,
      c,
      r,
      T
    ]), I = g.useCallback((j, ee) => {
      if (!(o == null ? void 0 : o.bounds) || !i || !c) return;
      const pe = ee * r.scale * be;
      if (pe <= 0) return;
      const Ee = o.bounds.maxX - o.bounds.minX, Se = o.bounds.maxY - o.bounds.minY, Be = o.elements.map((Ce) => Ce.id), Qe = new c2(Be, o.bounds, j === "width" ? pe : Ee, j === "height" ? pe : Se);
      ue.getState().execute(Qe, {
        library: i,
        renderer: c
      }), o.elements.length === 1 && T(o.elements[0].id);
    }, [
      o,
      i,
      c,
      r,
      T
    ]), A = g.useCallback((j, ee, oe) => {
      if (!o || !i || !c) return;
      const pe = o.elements[0];
      if (!pe) return;
      const Ee = new Float64Array(pe.vertices), Se = oe * r.scale, Be = ee === "y" ? -Se * be : Se * be;
      Ee[j * 2 + (ee === "x" ? 0 : 1)] = Be;
      const Qe = new qd(pe.id, Ee, "Edit vertex");
      ue.getState().execute(Qe, {
        library: i,
        renderer: c
      }), Qo(pe.id, Ee);
    }, [
      o,
      i,
      c,
      r
    ]), D = g.useCallback((j) => {
      if (!o || !i || !c) return;
      const ee = o.elements[0];
      if (!ee || ee.vertexCount <= 3) return;
      const oe = new Float64Array(ee.vertices.length - 2);
      let pe = 0;
      for (let Se = 0; Se < ee.vertexCount; Se++) Se !== j && (oe[pe] = ee.vertices[Se * 2], oe[pe + 1] = ee.vertices[Se * 2 + 1], pe += 2);
      const Ee = new qd(ee.id, oe, "Remove vertex");
      ue.getState().execute(Ee, {
        library: i,
        renderer: c
      }), Qo(ee.id, oe);
    }, [
      o,
      i,
      c
    ]), U = g.useCallback(() => {
      if (!o || !i || !c) return;
      const j = o.elements[0];
      if (!j) return;
      const ee = j.vertexCount, oe = j.vertices[(ee - 1) * 2], pe = j.vertices[(ee - 1) * 2 + 1], Ee = j.vertices[0], Se = j.vertices[1], Be = (oe + Ee) / 2, Qe = (pe + Se) / 2, Ce = new Float64Array(j.vertices.length + 2);
      Ce.set(j.vertices), Ce[j.vertices.length] = Be, Ce[j.vertices.length + 1] = Qe;
      const Xe = new qd(j.id, Ce, "Add vertex");
      ue.getState().execute(Xe, {
        library: i,
        renderer: c
      }), Qo(j.id, Ce);
    }, [
      o,
      i,
      c
    ]), B = g.useRef(null);
    g.useEffect(() => {
      const j = B.current;
      if (!j) return;
      const ee = (oe) => {
        if (oe.key !== "Escape" && oe.key === "Tab") {
          oe.stopPropagation(), oe.preventDefault();
          const pe = Array.from(j.querySelectorAll("input, textarea, button:not([tabindex='-1']):not([data-layer-option])"));
          if (pe.length === 0) return;
          const Ee = pe.indexOf(document.activeElement), Se = oe.shiftKey ? (Ee - 1 + pe.length) % pe.length : (Ee + 1) % pe.length;
          pe[Se].focus();
        }
      };
      return j.addEventListener("keydown", ee), () => j.removeEventListener("keydown", ee);
    }, []);
    const ne = he((j) => j.inspectorFocusRequested), W = he((j) => j.inspectorFocusField);
    g.useEffect(() => {
      !ne || !B.current || (he.getState().clearInspectorFocus(), requestAnimationFrame(() => {
        const j = B.current;
        if (!j) return;
        let ee = null;
        if (W) {
          const oe = j.querySelector(`[data-field="${W}"]`);
          oe && (ee = oe.querySelector("button:not([tabindex='-1']), input, textarea"));
        }
        ee || (ee = j.querySelector("input, textarea, button:not([tabindex='-1']):not([data-layer-option])")), ee && ee.focus();
      }));
    }, [
      ne,
      W
    ]);
    const J = g.useMemo(() => !o || o.elements.length !== 1 ? null : pr(o.elements[0].id), [
      o
    ]), fe = g.useCallback((j) => {
      const ee = b.current, oe = E.current;
      if (!ee || !oe || !i || !c || !ie.getState().selectedIds.has(oe)) return;
      const pe = j * r.scale * be;
      if (pe <= 0) return;
      const Ee = new Go(oe, ee, {
        ...ee,
        width: pe
      }, "Change path width");
      ue.getState().execute(Ee, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c,
      r
    ]), xe = g.useCallback((j) => {
      const ee = b.current, oe = E.current;
      if (!ee || !oe || !i || !c || !ie.getState().selectedIds.has(oe)) return;
      const pe = j * r.scale * be;
      if (pe < 0) return;
      const Ee = new Go(oe, ee, {
        ...ee,
        cornerRadius: pe
      }, "Change path corner radius");
      ue.getState().execute(Ee, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c,
      r
    ]), $ = g.useCallback((j, ee, oe) => {
      const pe = b.current, Ee = E.current;
      if (!pe || !Ee || !i || !c || !ie.getState().selectedIds.has(Ee)) return;
      const Se = oe * r.scale, Be = ee === "y" ? -Se * be : Se * be, Qe = pe.waypoints.map((Xe, Re) => Re !== j ? Xe : ee === "x" ? {
        x: Be,
        y: Xe.y
      } : {
        x: Xe.x,
        y: Be
      }), Ce = new Go(Ee, pe, {
        ...pe,
        waypoints: Qe
      }, "Edit path waypoint");
      ue.getState().execute(Ce, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c,
      r
    ]), K = g.useCallback(() => {
      const j = b.current, ee = E.current;
      if (!j || !ee || !i || !c || !ie.getState().selectedIds.has(ee)) return;
      const oe = j.waypoints, pe = oe[oe.length - 1], Ee = oe[oe.length - 2];
      let Se = pe.x - Ee.x, Be = pe.y - Ee.y;
      Se === 0 && Be === 0 && (Se = be);
      const Qe = {
        x: pe.x + Se,
        y: pe.y + Be
      }, Ce = new Go(ee, j, {
        ...j,
        waypoints: [
          ...oe,
          Qe
        ]
      }, "Add path waypoint");
      ue.getState().execute(Ce, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c
    ]);
    if (!o && x) {
      const j = ot(x.x / be, r), ee = ot(-x.y / be, r), oe = ot(x.width / be, r), pe = ot(x.height / be, r), Ee = x.lockAspectRatio, Se = (Ce, Xe) => {
        if (!i || !c || !v) return;
        const Re = Vt.getState().images.get(v);
        if (!Re) return;
        const nt = Xe * r.scale, Te = Ce === "y" ? -nt * be : nt * be, lt = new y2(v, Re.x, Re.y, Ce === "x" ? Te : Re.x, Ce === "y" ? Te : Re.y);
        ue.getState().execute(lt, {
          library: i,
          renderer: c
        });
      }, Be = (Ce, Xe) => {
        if (!i || !c || !v) return;
        const Re = Vt.getState().images.get(v);
        if (!Re) return;
        const Te = Xe * r.scale * be;
        if (Te <= 0) return;
        let lt, wt;
        if (Re.lockAspectRatio) {
          const sn = Re.naturalHeight / Re.naturalWidth;
          Ce === "width" ? (lt = Te, wt = Te * sn) : (wt = Te, lt = Te / sn);
        } else lt = Ce === "width" ? Te : Re.width, wt = Ce === "height" ? Te : Re.height;
        const st = new v2(v, Re.width, Re.height, lt, wt);
        ue.getState().execute(st, {
          library: i,
          renderer: c
        });
      }, Qe = () => {
        v && Vt.getState().updateImage(v, {
          lockAspectRatio: !Ee
        });
      };
      return y.jsxs("div", {
        ref: B,
        className: "flex flex-col pb-2",
        onWheel: (Ce) => Ce.stopPropagation(),
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
          y.jsx(Dt, {
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
                title: x.filename,
                children: x.filename
              })
            ]
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Position",
            isDark: n
          }),
          y.jsx(gt, {
            label: "X",
            value: j,
            unit: r.unit,
            isDark: n,
            onChange: (Ce) => Se("x", Ce)
          }),
          y.jsx(gt, {
            label: "Y",
            value: ee,
            unit: r.unit,
            isDark: n,
            onChange: (Ce) => Se("y", Ce)
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Size",
            isDark: n
          }),
          y.jsx(gt, {
            label: "W",
            value: oe,
            unit: r.unit,
            isDark: n,
            onChange: (Ce) => Be("width", Ce)
          }),
          y.jsx(gt, {
            label: "H",
            value: pe,
            unit: r.unit,
            isDark: n,
            onChange: (Ce) => Be("height", Ce)
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
                onClick: Qe,
                className: Y("flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-xs transition-colors", Ee ? n ? "border-white/20 bg-white/10 text-white/80" : "border-black/20 bg-black/10 text-black/80" : n ? "border-white/10 text-white/40 hover:text-white/60" : "border-black/10 text-black/40 hover:text-black/60"),
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
                    children: Ee ? y.jsxs(y.Fragment, {
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
                  Ee ? "On" : "Off"
                ]
              })
            ]
          })
        ]
      });
    }
    if (!o) {
      const j = ot(C.x / be, r), ee = ot(-C.y / be, r);
      return y.jsxs("div", {
        ref: B,
        className: "flex flex-col pb-2",
        onWheel: (oe) => oe.stopPropagation(),
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
          y.jsx(Dt, {
            label: "Name",
            isDark: n
          }),
          d ? y.jsx(B3, {
            label: "Name",
            value: d,
            isDark: n,
            onChange: k
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
          y.jsx(Dt, {
            label: "Origin",
            isDark: n
          }),
          y.jsx(gt, {
            label: "X",
            value: j,
            unit: r.unit,
            isDark: n,
            onChange: (oe) => O("x", oe)
          }),
          y.jsx(gt, {
            label: "Y",
            value: ee,
            unit: r.unit,
            isDark: n,
            onChange: (oe) => O("y", oe)
          })
        ]
      });
    }
    const { elements: me, bounds: ye, isMixed: ke } = o, L = me.length === 1, z = me[0], Z = me.every((j) => j.id.startsWith("ref:")) || i != null && i.get_group_ids(z.id).length > 1 || ((_a = pr(z.id)) == null ? void 0 : _a.type) === "ref";
    if (L && i && i.is_text_element(z.id)) {
      const j = i.get_text_element_info(z.id);
      if (j) {
        const ee = ot(j.x / be, r), oe = ot(-j.y / be, r), pe = ot(j.height / be, r), Ee = (Ce, Xe) => {
          if (!c) return;
          const Re = Xe * r.scale, nt = Ce === "y" ? -Re * be : Re * be, Te = new m2(z.id, j.x, j.y, Ce === "x" ? nt : j.x, Ce === "y" ? nt : j.y);
          ue.getState().execute(Te, {
            library: i,
            renderer: c
          });
        }, Se = (Ce) => {
          if (!c || Ce === j.text) return;
          const Xe = new h2(z.id, j.text, Ce);
          ue.getState().execute(Xe, {
            library: i,
            renderer: c
          }), we.getState().bumpSyncGeneration();
        }, Be = (Ce) => {
          if (!c) return;
          const Re = Ce * r.scale * be;
          if (Re <= 0) return;
          const nt = new g2(z.id, j.height, Re);
          ue.getState().execute(nt, {
            library: i,
            renderer: c
          }), we.getState().bumpSyncGeneration();
        }, Qe = (Ce, Xe) => {
          if (!c) return;
          const Re = new Iy([
            z.id
          ], Ce, Xe);
          ue.getState().execute(Re, {
            library: i,
            renderer: c
          }), we.getState().bumpSyncGeneration();
        };
        return y.jsxs("div", {
          ref: B,
          className: "flex flex-col pb-2",
          onWheel: (Ce) => Ce.stopPropagation(),
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
            y.jsx(Dt, {
              label: "Layer",
              isDark: n
            }),
            y.jsx(Hf, {
              currentLayer: j.layer,
              currentDatatype: j.datatype,
              isDark: n,
              onChange: Qe
            }),
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Dt, {
              label: "Content",
              isDark: n
            }),
            y.jsx(X3, {
              label: "Text",
              value: j.text,
              isDark: n,
              onChange: Se
            }),
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Dt, {
              label: "Position",
              isDark: n
            }),
            y.jsx(gt, {
              label: "X",
              value: ee,
              unit: r.unit,
              isDark: n,
              onChange: (Ce) => Ee("x", Ce)
            }),
            y.jsx(gt, {
              label: "Y",
              value: oe,
              unit: r.unit,
              isDark: n,
              onChange: (Ce) => Ee("y", Ce)
            }),
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Dt, {
              label: "Size",
              isDark: n
            }),
            y.jsx(gt, {
              label: "Size",
              value: pe,
              unit: r.unit,
              isDark: n,
              onChange: Be
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
                  const Ce = new G0([
                    z.id
                  ]);
                  ue.getState().execute(Ce, {
                    library: i,
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
    const Q = L && z ? f.get(z.id) : void 0;
    if (b.current = Q, E.current = z == null ? void 0 : z.id, Q && L) {
      const j = ot(Q.width / be, r), ee = ot((Q.actualCornerRadius ?? Q.cornerRadius) / be, r), oe = ye ? ot(ye.minX / be, r) : "\u2014", pe = ye ? ot(-ye.maxY / be, r) : "\u2014", Ee = Q.waypoints.map((Se, Be) => {
        const Qe = ot(Se.x / be, r), Ce = ot(-Se.y / be, r);
        return y.jsx(J1, {
          index: Be,
          x: Qe,
          y: Ce,
          unit: r.unit,
          isDark: n,
          canRemove: Q.waypoints.length > 2,
          onChangeX: (Xe) => $(Be, "x", Xe),
          onChangeY: (Xe) => $(Be, "y", Xe),
          onRemove: () => {
            if (Q.waypoints.length <= 2) return;
            const Xe = b.current, Re = E.current;
            if (!Xe || !Re || !i || !c) return;
            const nt = Xe.waypoints.filter((lt, wt) => wt !== Be), Te = new Go(Re, Xe, {
              ...Xe,
              waypoints: nt
            }, "Remove path waypoint");
            ue.getState().execute(Te, {
              library: i,
              renderer: c
            });
          }
        }, Be);
      });
      return y.jsxs("div", {
        ref: B,
        className: "flex flex-col pb-2",
        onWheel: (Se) => Se.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsxs("span", {
              className: Y("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: [
                "Path \xB7 ",
                Q.waypoints.length,
                " waypoints"
              ]
            })
          }),
          y.jsx("div", {
            className: Y("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Layer",
            isDark: n
          }),
          y.jsx(Hf, {
            currentLayer: z.layer,
            currentDatatype: z.datatype,
            isDark: n,
            onChange: R
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Path",
            isDark: n
          }),
          y.jsx(gt, {
            label: "Width",
            value: j,
            unit: r.unit,
            isDark: n,
            onChange: fe
          }),
          y.jsx(gt, {
            label: "Radius",
            value: ee,
            unit: r.unit,
            isDark: n,
            onChange: xe
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Position",
            isDark: n
          }),
          y.jsx(gt, {
            label: "X",
            value: oe,
            unit: r.unit,
            isDark: n,
            onChange: (Se) => N("x", Se)
          }),
          y.jsx(gt, {
            label: "Y",
            value: pe,
            unit: r.unit,
            isDark: n,
            onChange: (Se) => N("y", Se)
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Waypoints",
            isDark: n
          }),
          y.jsx("div", {
            className: "flex max-h-48 flex-col overflow-y-auto",
            children: Ee
          }),
          y.jsx("div", {
            className: "px-3 pt-1",
            children: y.jsxs("button", {
              type: "button",
              onClick: K,
              className: Y("flex w-full items-center justify-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors", n ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-black/10 text-black/50 hover:bg-black/5 hover:text-black/70"),
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
                "Add waypoint"
              ]
            })
          })
        ]
      });
    }
    if (o.instance) {
      const j = o.instance, ee = ot(j.tx / be, r), oe = ot(-j.ty / be, r), pe = ye ? ot((ye.maxX - ye.minX) / be, r) : "\u2014", Ee = ye ? ot((ye.maxY - ye.minY) / be, r) : "\u2014", Se = Number.isFinite(j.rotation) ? j.rotation.toFixed(3) : "0.000", Be = Number.isFinite(j.scale) ? j.scale.toFixed(3) : "1.000", Qe = ((_b2 = j.array) == null ? void 0 : _b2.columns) ?? 1, Ce = ((_c2 = j.array) == null ? void 0 : _c2.rows) ?? 1, Xe = ((_d = j.array) == null ? void 0 : _d.colSpacing) ?? 0, Re = ((_e = j.array) == null ? void 0 : _e.rowSpacing) ?? 0, nt = Qe > 1 || Ce > 1, Te = ot(Xe / be, r), lt = ot(Re / be, r), wt = j.transform[0] * j.transform[3] - j.transform[1] * j.transform[2] < 0, st = (ct, Rt, cn, qn) => {
        const Kt = ct * Math.PI / 180, St = Math.cos(Kt), Pt = Math.sin(Kt), zt = Rt * St, Ul = wt ? Rt * Pt : -Rt * Pt, Ka = Rt * Pt, Fa = wt ? -Rt * St : Rt * St;
        return new Float64Array([
          zt,
          Ul,
          Ka,
          Fa,
          cn,
          qn
        ]);
      }, sn = (ct, Rt) => {
        if (!i || !c) return;
        const cn = Rt * r.scale, qn = ct === "y" ? -cn * be : cn * be, Kt = new Float64Array(j.transform);
        ct === "x" ? Kt[4] = qn : Kt[5] = qn;
        const St = new Gd(j.refId, j.transform, Kt, "Move instance");
        ue.getState().execute(St, {
          library: i,
          renderer: c
        });
      }, ul = (ct) => {
        if (!i || !c) return;
        const Rt = st(ct, j.scale, j.tx, j.ty), cn = new Gd(j.refId, j.transform, Rt, "Rotate instance");
        ue.getState().execute(cn, {
          library: i,
          renderer: c
        });
      }, dl = (ct) => {
        if (!i || !c || ct <= 0) return;
        const Rt = st(j.rotation, ct, j.tx, j.ty), cn = new Gd(j.refId, j.transform, Rt, "Scale instance");
        ue.getState().execute(cn, {
          library: i,
          renderer: c
        });
      }, Rn = (ct, Rt) => {
        if (!i || !c) return;
        const cn = j.array;
        let qn = Qe, Kt = Ce, St = Xe, Pt = Re;
        switch (ct) {
          case "columns":
            qn = Math.max(1, Math.round(Rt));
            break;
          case "rows":
            Kt = Math.max(1, Math.round(Rt));
            break;
          case "colSpacing":
            St = Rt * r.scale * be;
            break;
          case "rowSpacing":
            Pt = Rt * r.scale * be;
            break;
        }
        const zt = {
          columns: qn,
          rows: Kt,
          colSpacing: St,
          rowSpacing: Pt
        }, Ul = new d2(j.refId, cn, zt);
        ue.getState().execute(Ul, {
          library: i,
          renderer: c
        });
      };
      return y.jsxs("div", {
        ref: B,
        className: "flex flex-col pb-2",
        onWheel: (ct) => ct.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsxs("span", {
              className: Y("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: [
                "Instance \xB7 ",
                j.cellName
              ]
            })
          }),
          y.jsx("div", {
            className: Y("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Position",
            isDark: n
          }),
          y.jsx(gt, {
            label: "X",
            value: ee,
            unit: r.unit,
            isDark: n,
            onChange: (ct) => sn("x", ct)
          }),
          y.jsx(gt, {
            label: "Y",
            value: oe,
            unit: r.unit,
            isDark: n,
            onChange: (ct) => sn("y", ct)
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Transform",
            isDark: n
          }),
          y.jsx(gt, {
            label: "Rotation",
            value: Se,
            unit: "\xB0",
            isDark: n,
            onChange: ul
          }),
          y.jsx(gt, {
            label: "Scale",
            value: Be,
            isDark: n,
            onChange: dl
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Array",
            isDark: n
          }),
          y.jsx(gt, {
            label: "Columns",
            value: String(Qe),
            isDark: n,
            onChange: (ct) => Rn("columns", ct)
          }),
          y.jsx(gt, {
            label: "Rows",
            value: String(Ce),
            isDark: n,
            onChange: (ct) => Rn("rows", ct)
          }),
          nt && y.jsxs(y.Fragment, {
            children: [
              y.jsx(gt, {
                label: "Col gap",
                value: Te,
                unit: r.unit,
                isDark: n,
                onChange: (ct) => Rn("colSpacing", ct)
              }),
              y.jsx(gt, {
                label: "Row gap",
                value: lt,
                unit: r.unit,
                isDark: n,
                onChange: (ct) => Rn("rowSpacing", ct)
              })
            ]
          }),
          y.jsx("div", {
            className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Dt, {
            label: "Size",
            isDark: n
          }),
          y.jsx(gt, {
            label: "W",
            value: pe,
            unit: r.unit,
            isDark: n,
            readOnly: true
          }),
          y.jsx(gt, {
            label: "H",
            value: Ee,
            unit: r.unit,
            isDark: n,
            readOnly: true
          }),
          J && y.jsxs(y.Fragment, {
            children: [
              y.jsx("div", {
                className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
              }),
              y.jsx($v, {
                sourceInfo: J,
                isDark: n
              })
            ]
          })
        ]
      });
    }
    const te = ye ? ot(ye.minX / be, r) : "\u2014", ce = ye ? ot(-ye.maxY / be, r) : "\u2014", ge = ye ? ot((ye.maxX - ye.minX) / be, r) : "\u2014", je = ye ? ot((ye.maxY - ye.minY) / be, r) : "\u2014";
    return y.jsxs("div", {
      ref: B,
      className: "flex flex-col pb-2",
      onWheel: (j) => j.stopPropagation(),
      children: [
        y.jsx("div", {
          className: "px-3 pt-2 pb-1",
          children: y.jsx("span", {
            className: Y("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
            children: L ? `Polygon \xB7 ${z.vertexCount} vertices` : `${me.length} elements`
          })
        }),
        y.jsx("div", {
          className: Y("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        !Z && y.jsxs(y.Fragment, {
          children: [
            y.jsx(Dt, {
              label: "Layer",
              isDark: n
            }),
            ke ? y.jsxs("div", {
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
            }) : y.jsx(Hf, {
              currentLayer: z.layer,
              currentDatatype: z.datatype,
              isDark: n,
              onChange: R
            }),
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            })
          ]
        }),
        y.jsx(Dt, {
          label: "Position",
          isDark: n
        }),
        y.jsx(gt, {
          label: "X",
          value: te,
          unit: r.unit,
          isDark: n,
          onChange: (j) => N("x", j),
          readOnly: false
        }),
        y.jsx(gt, {
          label: "Y",
          value: ce,
          unit: r.unit,
          isDark: n,
          onChange: (j) => N("y", j),
          readOnly: false
        }),
        y.jsx("div", {
          className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsx(Dt, {
          label: "Size",
          isDark: n
        }),
        y.jsx(gt, {
          label: "W",
          value: ge,
          unit: r.unit,
          isDark: n,
          onChange: L && !Z ? (j) => I("width", j) : void 0,
          readOnly: !L || Z
        }),
        y.jsx(gt, {
          label: "H",
          value: je,
          unit: r.unit,
          isDark: n,
          onChange: L && !Z ? (j) => I("height", j) : void 0,
          readOnly: !L || Z
        }),
        (L || Z) && y.jsxs(y.Fragment, {
          children: [
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            Z && !L ? me.map((j, ee) => y.jsx(qv, {
              vertices: j.vertices,
              unitInfo: r,
              isDark: n,
              onChangeVertex: A,
              onRemoveVertex: D,
              onAddVertex: U,
              readOnly: true,
              label: me.length > 1 ? `Vertices (${ee + 1}/${me.length})` : void 0
            }, j.id)) : y.jsx(qv, {
              vertices: z.vertices,
              unitInfo: r,
              isDark: n,
              onChangeVertex: A,
              onRemoveVertex: D,
              onAddVertex: U,
              readOnly: Z
            })
          ]
        }),
        J && y.jsxs(y.Fragment, {
          children: [
            y.jsx("div", {
              className: Y("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx($v, {
              sourceInfo: J,
              isDark: n
            })
          ]
        })
      ]
    });
  }
  const ex = [
    {
      id: "layers",
      icon: e4,
      label: "Layers",
      shortcut: "L"
    },
    {
      id: "inspector",
      icon: bk,
      label: "Inspector",
      shortcut: "I"
    }
  ];
  function G3({ isDark: l, onExpand: n }) {
    return y.jsx("div", {
      className: Y("fixed top-4 right-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border py-1", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: ex.map((r) => {
        const o = r.icon;
        return y.jsx($n, {
          label: r.label,
          shortcut: {
            modifiers: [
              ze.shift
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
  function Gv() {
    const n = he((O) => O.theme) === "dark", r = he((O) => O.sidebarCollapsed), o = he((O) => O.toggleSidebarCollapsed), i = he((O) => O.sidebarWidth), c = he((O) => O.setSidebarWidth), { isSm: d } = kh(), { handleProps: f } = P1({
      side: "right",
      width: i,
      onResize: c
    }), m = he((O) => O.sidebarTab), p = he((O) => O.setSidebarTab), v = us((O) => O.isMinimized), [x, S] = g.useState(false), C = g.useRef(null);
    g.useEffect(() => {
      if (!d || !x) return;
      const O = (R) => {
        C.current && !C.current.contains(R.target) && S(false);
      };
      return document.addEventListener("mousedown", O), () => document.removeEventListener("mousedown", O);
    }, [
      d,
      x
    ]);
    const _ = g.useCallback((O) => {
      p(O), d ? S(true) : o();
    }, [
      d,
      o,
      p
    ]), E = (v ? 0 : 206) + 24;
    if (r && !(d && x)) return y.jsx(G3, {
      isDark: n,
      onExpand: _
    });
    const k = d && x;
    return y.jsxs(y.Fragment, {
      children: [
        k && y.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        y.jsxs("div", {
          ref: C,
          className: Y("fixed top-4 right-4 z-40 rounded-xl border", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", k && "shadow-xl"),
          style: {
            width: i
          },
          children: [
            y.jsx("div", {
              ...f
            }),
            y.jsxs("div", {
              className: "flex items-center gap-1 px-1 pt-1 pb-[3px]",
              children: [
                ex.map((O) => {
                  const R = O.icon, T = m === O.id;
                  return y.jsx($n, {
                    label: O.label,
                    shortcut: {
                      modifiers: [
                        ze.shift
                      ],
                      key: O.shortcut
                    },
                    children: y.jsx("button", {
                      onClick: () => p(O.id),
                      className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", T && (n ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: y.jsx("div", {
                        className: "flex h-4 w-4 items-center justify-center",
                        children: y.jsx(R, {
                          className: Y("h-4 w-4", n ? "text-white/90" : "text-black/90")
                        })
                      })
                    })
                  }, O.id);
                }),
                !d && y.jsx("button", {
                  type: "button",
                  onClick: o,
                  className: Y("ml-auto cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: y.jsx(X1, {
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
                maxHeight: `calc(100vh - ${70 + E}px)`
              },
              onWheel: (O) => O.stopPropagation(),
              children: [
                m === "layers" && y.jsx(U3, {}),
                m === "inspector" && y.jsx(q3, {})
              ]
            })
          ]
        })
      ]
    });
  }
  const P3 = (l) => {
    const n = 1 / (l * be), r = s0 * n, o = bh(l), i = r / o.scale, c = LS.find((f) => f >= i) ?? i, d = o.unit === "mm" && c >= 1e3 ? c.toExponential(1) : c;
    return {
      length: c * o.scale,
      label: `${d} ${o.unit}`
    };
  }, Pv = "0.1.8";
  function Z3({ isDark: l }) {
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
            Pv
          ]
        }),
        y.jsxs("div", {
          className: Y("pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-56 rounded-lg border p-2.5 text-[11px] leading-relaxed opacity-0 transition-opacity group-hover:opacity-100", l ? "border-white/10 bg-[rgb(29,29,29)] text-white/70" : "border-black/10 bg-[rgb(241,241,241)] text-black/70"),
          children: [
            y.jsxs("span", {
              className: Y("font-medium", l ? "text-white/90" : "text-black/90"),
              children: [
                "Rosette v",
                Pv,
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
  function K3({ isDark: l }) {
    const n = $t((o) => o.message), r = $t((o) => o.level);
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
  function F3({ isDark: l }) {
    const n = ie((m) => m.selectedIds), r = we((m) => m.library), o = ve((m) => m.layers), i = tt((m) => m.pathMetadata), c = g.useMemo(() => {
      const m = n.size;
      if (m === 0 || !r) return null;
      const p = n.values().next().value, v = p.startsWith("ref:");
      if (m === 1 && v) {
        const b = r.get_cell_ref_info(p);
        if (b) {
          const E = b.cell_name;
          return b.free(), {
            label: `Instance "${E}"`,
            layerNumber: null,
            datatype: null
          };
        }
      }
      if (m === 1 && r.is_text_element(p)) {
        const b = r.get_text_element_info(p);
        if (b) return {
          label: `Text "${b.text.length > 20 ? b.text.slice(0, 20) + "\u2026" : b.text}"`,
          layerNumber: b.layer,
          datatype: b.datatype
        };
      }
      if (m === 1) {
        const b = i.get(p);
        if (b) return {
          label: `Path \xB7 ${b.waypoints.length} waypoints`,
          layerNumber: b.layer,
          datatype: b.datatype
        };
      }
      let x = null, S = null, C = false, _ = 0;
      for (const b of n) {
        const E = r.get_element_info(b);
        if (E && (x === null ? (x = E.layer, S = E.datatype) : (E.layer !== x || E.datatype !== S) && (C = true), m === 1 && (_ = E.vertices.length / 2), E.free(), C && m > 1)) break;
      }
      return m === 1 ? {
        label: `Polygon \xB7 ${_} vertices`,
        layerNumber: x,
        datatype: S
      } : C ? {
        label: `${m} elements \xB7 Mixed layers`,
        layerNumber: null,
        datatype: null
      } : {
        label: `${m} elements`,
        layerNumber: x,
        datatype: S
      };
    }, [
      n,
      r,
      i
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
  function Q3({ isDark: l }) {
    const n = $t((o) => o.message), r = ie((o) => o.selectedIds.size > 0);
    return n ? y.jsx(K3, {
      isDark: l
    }) : r ? y.jsx(F3, {
      isDark: l
    }) : y.jsx("div", {
      className: "flex-1"
    });
  }
  function Zv({ isDark: l, widthInPixels: n, label: r }) {
    return y.jsxs("div", {
      className: "flex items-center gap-1.5",
      children: [
        y.jsx("div", {
          className: Y("h-px", l ? "bg-white/50" : "bg-black/50"),
          style: {
            width: `${Math.max(n, 20)}px`
          }
        }),
        y.jsx($n, {
          label: "Zoom to Fit",
          position: "top",
          children: y.jsx("button", {
            onClick: gs,
            className: Y("flex cursor-pointer items-center justify-center rounded p-0.5 text-[10px] select-none transition-colors focus:outline-none", l ? "text-white/40 hover:text-white/70" : "text-black/40 hover:text-black/70"),
            children: r
          })
        })
      ]
    });
  }
  function Kv({ compact: l = false, minimal: n = false }) {
    const r = he((O) => {
      var _a;
      return (_a = O.cursorWorld) == null ? void 0 : _a.x;
    }), o = he((O) => {
      var _a;
      return (_a = O.cursorWorld) == null ? void 0 : _a.y;
    }), i = he((O) => O.theme), c = Ue((O) => O.zoom), d = he((O) => O.zenMode), f = he((O) => O.toggleZenMode), m = us((O) => O.isMinimized), p = us((O) => O.toggle), v = i === "dark", x = g.useMemo(() => bh(c), [
      c
    ]), S = g.useMemo(() => r !== void 0 ? ot(r, x) : "\u2014", [
      r,
      x
    ]), C = g.useMemo(() => o !== void 0 ? ot(o, x) : "\u2014", [
      o,
      x
    ]), { length: _, label: b } = g.useMemo(() => P3(c), [
      c
    ]), E = Math.min(_ * c * be, jS), k = !l && !n;
    return y.jsxs("div", {
      className: "relative flex-shrink-0",
      children: [
        !k && y.jsx("div", {
          className: "absolute bottom-full right-3 mb-2 font-mono text-[11px]",
          children: y.jsx(Zv, {
            isDark: v,
            widthInPixels: E,
            label: b
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
                    y.jsx(Z3, {
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
                    S,
                    ", ",
                    C,
                    " ",
                    x.unit
                  ]
                }) : y.jsxs(y.Fragment, {
                  children: [
                    y.jsx("span", {
                      className: Y("leading-none select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "x:"
                    }),
                    y.jsx("span", {
                      className: Y("w-18 text-right leading-none select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: S
                    }),
                    y.jsx("span", {
                      className: Y("text-[10px] leading-none select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: x.unit
                    }),
                    y.jsx("span", {
                      className: Y("mx-1 leading-none select-none pointer-events-none", v ? "text-white/20" : "text-black/20"),
                      children: "\xB7"
                    }),
                    y.jsx("span", {
                      className: Y("leading-none select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "y:"
                    }),
                    y.jsx("span", {
                      className: Y("w-18 text-right leading-none select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: C
                    }),
                    y.jsx("span", {
                      className: Y("text-[10px] leading-none select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: x.unit
                    })
                  ]
                })
              ]
            }),
            !n && y.jsx(Q3, {
              isDark: v
            }),
            n && y.jsx("div", {
              className: "flex-1"
            }),
            y.jsxs("div", {
              className: "flex flex-shrink-0 items-center gap-2",
              children: [
                k && y.jsx(Zv, {
                  isDark: v,
                  widthInPixels: E,
                  label: b
                }),
                y.jsx($n, {
                  label: "Zen Mode",
                  position: "top",
                  children: y.jsx("button", {
                    onClick: f,
                    className: Y("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", d && (v ? "bg-white/10" : "bg-black/10")),
                    children: y.jsx(ZM, {
                      width: 14,
                      height: 14,
                      className: Y(v ? "text-white/50" : "text-black/50")
                    })
                  })
                }),
                y.jsx($n, {
                  label: "Minimap",
                  position: "top",
                  align: "end",
                  children: y.jsx("button", {
                    onClick: p,
                    className: Y("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", !m && (v ? "bg-white/10" : "bg-black/10")),
                    children: y.jsx(xM, {
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
  function W3({ title: l, titleId: n, ...r }, o) {
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
  const jh = g.forwardRef(W3);
  function J3({ title: l, titleId: n, ...r }, o) {
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
  const Lh = g.forwardRef(J3), ej = [
    {
      id: "select",
      icon: jh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "laser",
      icon: B1,
      label: "Laser Pointer",
      shortcut: "Q"
    },
    {
      id: "pan",
      icon: Lh,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: Eh,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: _h,
      label: "Zoom",
      shortcut: "Z"
    },
    {
      id: "ruler",
      icon: $1,
      label: "Ruler",
      shortcut: "U"
    }
  ], Fv = [
    {
      id: "rectangle",
      icon: DM,
      label: "Rectangle",
      shortcut: "R"
    },
    {
      id: "polygon",
      icon: lM,
      label: "Polygon",
      shortcut: "G"
    },
    {
      id: "path",
      icon: Q4,
      label: "Path",
      shortcut: "H"
    },
    {
      id: "text",
      icon: e3,
      label: "Text",
      shortcut: "T"
    }
  ], tj = [
    {
      id: "select",
      icon: jh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: Lh,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: Eh,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: _h,
      label: "Zoom",
      shortcut: "Z"
    }
  ], Qv = [
    {
      id: "laser",
      icon: B1,
      label: "Laser Pointer",
      shortcut: "Q"
    },
    {
      id: "ruler",
      icon: $1,
      label: "Ruler",
      shortcut: "U"
    }
  ], nj = [
    {
      id: "select",
      icon: jh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: Lh,
      label: "Pan",
      shortcut: "P"
    }
  ];
  function Wv({ tool: l, isActive: n, onClick: r, isDark: o }) {
    const i = l.icon;
    return y.jsx($n, {
      label: l.label,
      shortcut: {
        key: l.shortcut
      },
      children: y.jsx("button", {
        onClick: r,
        className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", o ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (o ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(i, {
            className: Y("h-5 w-5", o ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function Jv({ isDark: l }) {
    return y.jsx("div", {
      className: Y("mx-0 h-6 w-[1px]", l ? "bg-white/10" : "bg-black/10")
    });
  }
  function lj({ isDark: l, overflowBaseTools: n, overflowShapeTools: r, showInstance: o, showCommands: i }) {
    const [c, d] = g.useState(false), f = g.useRef(null), m = g.useRef(null), { activeTool: p, setTool: v } = Gt(), x = dn((b) => b.open), S = dn((b) => b.toggle), C = [
      ...n,
      ...r
    ].some((b) => b.id === p);
    g.useEffect(() => {
      if (!c) return;
      const b = (k) => {
        var _a, _b2;
        const O = k.target;
        !((_a = m.current) == null ? void 0 : _a.contains(O)) && !((_b2 = f.current) == null ? void 0 : _b2.contains(O)) && d(false);
      }, E = (k) => {
        k.key === "Escape" && d(false);
      };
      return document.addEventListener("mousedown", b, true), document.addEventListener("keydown", E), () => {
        document.removeEventListener("mousedown", b, true), document.removeEventListener("keydown", E);
      };
    }, [
      c
    ]);
    const _ = g.useCallback(() => {
      if (!f.current) return {
        left: 0,
        top: 0
      };
      const b = f.current.getBoundingClientRect(), E = 200;
      let k = b.left;
      return k + E > window.innerWidth - 8 && (k = window.innerWidth - E - 8), {
        left: k,
        top: b.bottom + 8
      };
    }, []);
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx($n, {
          label: "More tools",
          className: c ? "[&>div:last-child]:hidden" : void 0,
          children: y.jsx("button", {
            ref: f,
            onClick: () => d(!c),
            className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", (C || c) && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
            children: y.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: y.jsx(O4, {
                className: Y("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        c && ps.createPortal(y.jsxs("div", {
          ref: m,
          className: Y("fixed z-[9999] min-w-[180px] rounded-xl border p-1 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: (() => {
            const b = _();
            return {
              left: `${b.left}px`,
              top: `${b.top}px`
            };
          })(),
          children: [
            n.length > 0 && y.jsx("div", {
              className: "flex flex-col",
              children: n.map((b) => {
                const E = b.icon, k = p === b.id;
                return y.jsxs("button", {
                  onClick: () => {
                    v(b.id), d(false);
                  },
                  className: Y("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", k && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                  children: [
                    y.jsx(E, {
                      className: Y("h-4 w-4", l ? "text-white/90" : "text-black/90")
                    }),
                    y.jsx("span", {
                      className: l ? "text-white/90" : "text-black/90",
                      children: b.label
                    }),
                    y.jsx("kbd", {
                      className: Y("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                      children: b.shortcut
                    })
                  ]
                }, b.id);
              })
            }),
            r.length > 0 && y.jsxs(y.Fragment, {
              children: [
                y.jsx("div", {
                  className: Y("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                y.jsx("div", {
                  className: "flex flex-col",
                  children: r.map((b) => {
                    const E = b.icon, k = p === b.id;
                    return y.jsxs("button", {
                      onClick: () => {
                        v(b.id), d(false);
                      },
                      className: Y("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", k && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: [
                        y.jsx(E, {
                          className: Y("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        y.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: b.label
                        }),
                        y.jsx("kbd", {
                          className: Y("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                          children: b.shortcut
                        })
                      ]
                    }, b.id);
                  })
                })
              ]
            }),
            (o || i) && y.jsxs(y.Fragment, {
              children: [
                y.jsx("div", {
                  className: Y("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                y.jsxs("div", {
                  className: "flex flex-col",
                  children: [
                    o && y.jsxs("button", {
                      onClick: () => {
                        x("add instance "), d(false);
                      },
                      className: Y("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        y.jsx(V1, {
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
                    i && y.jsxs("button", {
                      onClick: () => {
                        S(), d(false);
                      },
                      className: Y("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        y.jsx(q1, {
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
                              children: ze.mod
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
  function e0({ compact: l = false, minimal: n = false }) {
    const { activeTool: r, setTool: o } = Gt(), c = he((_) => _.theme) === "dark", d = n ? nj : l ? tj : ej, f = !l && !n, m = !l && !n, p = !l && !n, v = !l && !n, x = l || n, S = n ? [
      ...Qv,
      {
        id: "move",
        icon: Eh,
        label: "Move",
        shortcut: "M"
      },
      {
        id: "zoom",
        icon: _h,
        label: "Zoom",
        shortcut: "Z"
      }
    ] : l ? Qv : [], C = l || n ? Fv : [];
    return y.jsxs("div", {
      className: Y("fixed top-4 z-50 mx-auto w-fit", l || n ? "left-14 right-14" : "left-0 right-0", "flex items-center gap-1 rounded-xl border px-1 pt-1 pb-[3px]", c ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: [
        d.map((_) => y.jsx(Wv, {
          tool: _,
          isActive: r === _.id,
          onClick: () => o(_.id),
          isDark: c
        }, _.id)),
        f && y.jsxs(y.Fragment, {
          children: [
            y.jsx(Jv, {
              isDark: c
            }),
            Fv.map((_) => y.jsx(Wv, {
              tool: _,
              isActive: r === _.id,
              onClick: () => o(_.id),
              isDark: c
            }, _.id))
          ]
        }),
        m && y.jsx(rj, {
          isDark: c
        }),
        p && y.jsx(aj, {
          isDark: c
        }),
        y.jsx(Jv, {
          isDark: c
        }),
        v && y.jsx(oj, {
          isDark: c
        }),
        x && y.jsx(lj, {
          isDark: c,
          overflowBaseTools: S,
          overflowShapeTools: C,
          showInstance: true,
          showCommands: true
        })
      ]
    });
  }
  const t0 = [
    {
      id: "union",
      icon: o3,
      label: "Union",
      kind: "boolean"
    },
    {
      id: "subtract",
      icon: XM,
      label: "Subtract",
      kind: "boolean"
    },
    {
      id: "intersect",
      icon: S4,
      label: "Intersect",
      kind: "boolean"
    },
    {
      id: "xor",
      icon: p4,
      label: "Exclude",
      kind: "boolean"
    },
    {
      id: "align-left",
      icon: Dk,
      label: "Align Left",
      kind: "align"
    },
    {
      id: "align-center-h",
      icon: ok,
      label: "Align Center H",
      kind: "align"
    },
    {
      id: "align-right",
      icon: Xk,
      label: "Align Right",
      kind: "align"
    },
    {
      id: "center-align",
      icon: Ek,
      label: "Center Align",
      kind: "align"
    },
    {
      id: "align-top",
      icon: Zk,
      label: "Align Top",
      kind: "align"
    },
    {
      id: "align-center-v",
      icon: fk,
      label: "Align Center V",
      kind: "align"
    },
    {
      id: "align-bottom",
      icon: Rk,
      label: "Align Bottom",
      kind: "align"
    },
    {
      id: "origin-align",
      icon: mM,
      label: "Origin Align",
      kind: "align"
    }
  ];
  function n0(l) {
    const { library: n, renderer: r } = we.getState();
    if (!n || !r) return;
    const { selectedIds: o, lastSelectedId: i } = ie.getState();
    if (o.size !== 0) if (l.kind === "boolean") {
      if (o.size < 2) return;
      const c = [
        ...o
      ], d = i ?? c[0], f = new Z0(c, l.id, d);
      ue.getState().execute(f, {
        library: n,
        renderer: r
      });
    } else {
      const c = l.id;
      if (c !== "origin-align" && o.size < 2) return;
      const d = new P0(new Set(o), i, c);
      ue.getState().execute(d, {
        library: n,
        renderer: r
      });
    }
  }
  function rj({ isDark: l }) {
    const [n, r] = g.useState(t0[0]), [o, i] = g.useState(false), c = g.useRef(null), d = g.useRef(null), f = g.useRef(null), m = n.icon;
    g.useEffect(() => {
      if (!o) return;
      const R = (T) => {
        T.key === "Escape" && i(false);
      };
      return document.addEventListener("keydown", R), () => {
        document.removeEventListener("keydown", R);
      };
    }, [
      o
    ]);
    const p = g.useCallback(() => {
      f.current = setTimeout(() => i(false), 150);
    }, []), v = g.useCallback(() => {
      f.current && (clearTimeout(f.current), f.current = null);
    }, []), x = g.useCallback(() => {
      v(), i(true);
    }, [
      v
    ]), S = g.useCallback(() => {
      p();
    }, [
      p
    ]), C = g.useCallback(() => {
      v();
    }, [
      v
    ]), _ = g.useCallback(() => {
      p();
    }, [
      p
    ]), b = g.useCallback(() => {
      n0(n);
    }, [
      n
    ]), E = g.useCallback((R) => {
      R.preventDefault(), i(true);
    }, []), k = g.useCallback((R) => {
      r(R), i(false), setTimeout(() => n0(R), 0);
    }, []), O = g.useCallback((R) => {
      if (d.current = R, !R || !c.current) return;
      const T = c.current.getBoundingClientRect(), N = R.getBoundingClientRect();
      let A = T.left + T.width / 2 - N.width / 2, D = T.bottom + 9;
      A + N.width > window.innerWidth - 8 && (A = window.innerWidth - N.width - 8), A < 8 && (A = 8), D + N.height > window.innerHeight - 8 && (D = T.top - N.height - 8), R.style.left = `${A}px`, R.style.top = `${D}px`, R.style.visibility = "visible";
    }, []);
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx($n, {
          label: n.label,
          className: o ? "[&>div:last-child]:hidden" : void 0,
          children: y.jsx("button", {
            ref: c,
            onClick: b,
            onContextMenu: E,
            onMouseEnter: x,
            onMouseLeave: S,
            className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
            children: y.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: y.jsx(m, {
                className: Y("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        o && ps.createPortal(y.jsx("div", {
          ref: O,
          onMouseEnter: C,
          onMouseLeave: _,
          className: Y("fixed z-[9999] rounded-xl border p-2 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: {
            visibility: "hidden"
          },
          children: y.jsx("div", {
            className: "grid grid-cols-4 gap-1",
            children: t0.map((R) => y.jsx($n, {
              label: R.label,
              className: "[&>div:last-child]:mt-0.5",
              children: y.jsx("button", {
                onClick: () => k(R),
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
  function aj({ isDark: l }) {
    const n = dn((c) => c.open), r = dn((c) => c.isOpen), o = dn((c) => c.initialSearch), i = r && !!o;
    return y.jsx($n, {
      label: "Instance",
      shortcut: {
        key: "I"
      },
      children: y.jsx("button", {
        onClick: () => n("add instance "),
        className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", i && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(V1, {
            className: Y("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function oj({ isDark: l }) {
    const n = dn((c) => c.isOpen), r = dn((c) => c.initialSearch), o = dn((c) => c.toggle), i = n && !r;
    return y.jsx($n, {
      label: "Commands",
      shortcut: {
        modifiers: [
          ze.mod
        ],
        key: "K"
      },
      children: y.jsx("button", {
        onClick: o,
        className: Y("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", i && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(q1, {
            className: Y("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  const sj = 5e3;
  function ij() {
    const [l, n] = g.useState({
      status: "idle"
    }), [r, o] = g.useState(false), i = he((p) => p.theme) === "dark", c = g.useRef(null), d = g.useRef("");
    g.useEffect(() => {
      if (!Bn) return;
      const p = setTimeout(async () => {
        try {
          n({
            status: "checking"
          });
          const { check: v } = await xt(async () => {
            const { check: S } = await import("./index-DWHWQ1OU.js");
            return {
              check: S
            };
          }, __vite__mapDeps([3,1]), import.meta.url), x = await v();
          x ? (c.current = x, d.current = x.version, n({
            status: "available",
            version: x.version,
            notes: x.body ?? null
          })) : n({
            status: "idle"
          });
        } catch (v) {
          console.warn("[updater] check failed:", v), n({
            status: "idle"
          });
        }
      }, sj);
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
        let x = 0, S = 1;
        await p.downloadAndInstall((C) => {
          switch (C.event) {
            case "Started":
              S = C.data.contentLength ?? 1;
              break;
            case "Progress":
              x += C.data.chunkLength ?? 0, n({
                status: "downloading",
                version: v,
                progress: Math.min(x / S, 1)
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
        const { relaunch: p } = await xt(async () => {
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
    return !Bn || l.status === "idle" || l.status === "checking" || r ? null : y.jsxs("div", {
      className: Y("fixed bottom-10 right-4 z-[200] flex w-72 flex-col gap-2 rounded-xl border p-3 shadow-lg backdrop-blur-xl animate-[update-toast-in_0.3s_ease-out]", i ? "border-white/10 bg-[rgb(29,29,29)]/95 text-white/90" : "border-black/10 bg-[rgb(241,241,241)]/95 text-black/90"),
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
              className: Y("flex h-5 w-5 items-center justify-center rounded transition-colors", i ? "hover:bg-white/10 text-white/40" : "hover:bg-black/10 text-black/40"),
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
          className: Y("text-[11px]", i ? "text-white/50" : "text-black/50"),
          children: [
            "v",
            l.version,
            " is ready to install"
          ]
        }),
        l.status === "error" && y.jsx("p", {
          className: Y("text-[11px]", i ? "text-red-400/80" : "text-red-600/80"),
          children: l.message
        }),
        l.status === "downloading" && y.jsx("div", {
          className: Y("h-1 w-full overflow-hidden rounded-full", i ? "bg-white/10" : "bg-black/10"),
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
          className: Y("text-center text-[11px]", i ? "text-white/40" : "text-black/40"),
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
          className: Y("mt-0.5 flex h-7 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors active:translate-y-px", i ? "border-white/10 text-white/70 hover:bg-white/5" : "border-black/10 text-black/70 hover:bg-black/5"),
          children: "Dismiss"
        })
      ]
    });
  }
  const Pi = 1e3;
  function Zi({ label: l, value: n, onChange: r, isDark: o, unit: i, min: c, step: d, integer: f, autoFocus: m, onSubmit: p }) {
    const v = g.useRef(null);
    g.useEffect(() => {
      m && v.current && v.current.select();
    }, [
      m
    ]);
    const [x, S] = g.useState(String(n));
    g.useEffect(() => {
      S(String(n));
    }, [
      n
    ]);
    const C = g.useCallback((_) => {
      const b = Number.parseFloat(_);
      if (Number.isNaN(b)) return;
      const E = c !== void 0 ? Math.max(c, b) : b, k = f ? Math.round(E) : E;
      r(k), S(String(k));
    }, [
      r,
      c,
      f
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-3",
      children: [
        y.jsx("label", {
          className: Y("text-xs select-none", o ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsxs("div", {
          className: "flex items-center gap-1",
          children: [
            y.jsx("input", {
              ref: v,
              type: "text",
              inputMode: "decimal",
              value: x,
              onChange: (_) => S(_.target.value),
              onBlur: () => C(x),
              onKeyDown: (_) => {
                var _a;
                if (_.key === "Enter") _.preventDefault(), C(x), p == null ? void 0 : p();
                else if (_.key === "Tab") {
                  const b = (_a = v.current) == null ? void 0 : _a.closest("form");
                  if (b) {
                    const E = Array.from(b.querySelectorAll("input")), k = E.indexOf(v.current);
                    if (k >= 0) {
                      const O = _.shiftKey ? (k - 1 + E.length) % E.length : (k + 1) % E.length;
                      _.preventDefault(), C(x), E[O].focus(), E[O].select();
                    }
                  }
                }
              },
              className: Y("w-20 rounded border px-1.5 py-1 text-right font-mono text-xs outline-none", o ? "border-white/10 bg-white/5 text-white/90 focus:border-white/30" : "border-black/10 bg-black/5 text-black/90 focus:border-black/30"),
              step: d,
              autoFocus: m
            }),
            i && y.jsx("span", {
              className: Y("w-6 text-xs select-none", o ? "text-white/40" : "text-black/40"),
              children: i
            })
          ]
        })
      ]
    });
  }
  function l0() {
    const { isOpen: l, elementIds: n, close: r } = Ch(), o = we((B) => B.library), i = we((B) => B.renderer), d = he((B) => B.theme) === "dark";
    Kr("array-dialog", l);
    const [f, m] = g.useState(2), [p, v] = g.useState(1), [x, S] = g.useState(0), [C, _] = g.useState(0), b = g.useRef(f), E = g.useRef(p), k = g.useRef(x), O = g.useRef(C), R = g.useCallback((B) => {
      b.current = B, m(B);
    }, []), T = g.useCallback((B) => {
      E.current = B, v(B);
    }, []), N = g.useCallback((B) => {
      k.current = B, S(B);
    }, []), I = g.useCallback((B) => {
      O.current = B, _(B);
    }, []), A = g.useRef(null);
    g.useEffect(() => {
      if (!l || !o || n.length === 0) return;
      const B = o.get_bounds_for_ids(n);
      if (B) {
        const ne = B[2] - B[0], W = B[3] - B[1], J = ne / be / Pi, fe = W / be / Pi;
        N(Math.round(J * 1e3) / 1e3), I(Math.round(fe * 1e3) / 1e3);
      }
      R(2), T(1);
    }, [
      l,
      o,
      n,
      R,
      T,
      N,
      I
    ]), g.useEffect(() => {
      if (!l) return;
      const B = (ne) => {
        A.current && !A.current.contains(ne.target) && r();
      };
      return document.addEventListener("mousedown", B), () => document.removeEventListener("mousedown", B);
    }, [
      l,
      r
    ]);
    const D = g.useCallback(() => {
      if (!o || !i) return;
      const B = b.current, ne = E.current, W = k.current, J = O.current;
      if (B < 1 || ne < 1) return;
      if (B === 1 && ne === 1) {
        r();
        return;
      }
      const fe = W * Pi * be, xe = -(J * Pi * be), $ = new o2(n, B, ne, fe, xe);
      ue.getState().execute($, {
        library: o,
        renderer: i
      }), r();
    }, [
      o,
      i,
      n,
      r
    ]);
    if (!l) return null;
    const U = f * p - 1;
    return y.jsx("div", {
      className: "fixed inset-0 z-[200]",
      children: y.jsx("div", {
        className: "fixed inset-0 flex items-start justify-center px-4 pt-[min(25vh,200px)]",
        children: y.jsxs("div", {
          ref: A,
          role: "dialog",
          "aria-label": "Create Array",
          className: Y("w-full max-w-[320px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl", d ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          onKeyDown: (B) => {
            B.key === "Escape" && (B.preventDefault(), r());
          },
          children: [
            y.jsx("div", {
              className: Y("border-b px-4 py-3 text-sm font-medium select-none", d ? "border-white/10 text-white/90" : "border-black/10 text-black/90"),
              children: "Create Array"
            }),
            y.jsxs("form", {
              className: "flex flex-col gap-2 px-4 py-3",
              onSubmit: (B) => {
                B.preventDefault(), D();
              },
              children: [
                y.jsx(Zi, {
                  label: "Columns",
                  value: f,
                  onChange: R,
                  isDark: d,
                  min: 1,
                  step: 1,
                  integer: true,
                  autoFocus: true,
                  onSubmit: D
                }),
                y.jsx(Zi, {
                  label: "Rows",
                  value: p,
                  onChange: T,
                  isDark: d,
                  min: 1,
                  step: 1,
                  integer: true,
                  onSubmit: D
                }),
                y.jsx(Zi, {
                  label: "Col spacing",
                  value: x,
                  onChange: N,
                  isDark: d,
                  unit: "\xB5m",
                  step: 0.1,
                  onSubmit: D
                }),
                y.jsx(Zi, {
                  label: "Row spacing",
                  value: C,
                  onChange: I,
                  isDark: d,
                  unit: "\xB5m",
                  step: 0.1,
                  onSubmit: D
                })
              ]
            }),
            y.jsxs("div", {
              className: Y("flex items-center justify-between border-t px-4 py-3", d ? "border-white/10" : "border-black/10"),
              children: [
                y.jsx("span", {
                  className: Y("text-xs select-none", d ? "text-white/40" : "text-black/40"),
                  children: U > 0 ? `${U} ${U === 1 ? "copy" : "copies"} will be created` : "No copies to create"
                }),
                y.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    y.jsx("button", {
                      type: "button",
                      onClick: r,
                      className: Y("rounded-lg border px-3 py-1.5 text-xs transition-colors", d ? "border-white/10 text-white/70 hover:bg-white/5" : "border-black/10 text-black/70 hover:bg-black/5"),
                      children: "Cancel"
                    }),
                    y.jsx("button", {
                      type: "button",
                      onClick: D,
                      disabled: U === 0,
                      className: Y("rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors", U === 0 ? "cursor-not-allowed opacity-40" : d ? "border-white/20 bg-white/10 text-white/90 hover:bg-white/15" : "border-black/20 bg-black/10 text-black/90 hover:bg-black/15"),
                      children: "Create"
                    })
                  ]
                })
              ]
            })
          ]
        })
      })
    });
  }
  function cj() {
    const l = he((f) => f.theme), n = he((f) => f.zenMode), { isLg: r, isMd: o, isSm: i } = kh(), c = ss(), d = g.useRef(null);
    return g.useEffect(() => {
      d.current === null ? r ? (he.getState().setExplorerCollapsed(false), he.getState().setSidebarCollapsed(false)) : (he.getState().setExplorerCollapsed(true), he.getState().setSidebarCollapsed(true)) : d.current && !r ? (he.getState().setExplorerCollapsed(true), he.getState().setSidebarCollapsed(true)) : !d.current && r && (he.getState().setExplorerCollapsed(false), he.getState().setSidebarCollapsed(false)), d.current = r;
    }, [
      r
    ]), g.useEffect(() => {
      if (!c) return;
      const f = FS();
      f !== null && (he.getState().setExplorerWidth(f), he.getState().setSidebarWidth(f));
    }, [
      c
    ]), g.useEffect(() => {
      if (!Bn || c) return;
      const f = async (m) => {
        if (m.metaKey || m.ctrlKey) {
          if (m.key === "n") m.preventDefault(), await Mh();
          else if (m.key === "o") {
            m.preventDefault();
            const v = await y0();
            v && await rh(v);
          } else if (m.key === "s" && m.shiftKey) m.preventDefault(), await ah(true);
          else if (m.key === "s" && !m.shiftKey) m.preventDefault(), await ah(false);
          else if (m.key === "t") {
            m.preventDefault();
            const v = Pe.getState().activeTabId;
            if (v) {
              os(v);
              const x = we.getState().library;
              x && ls(v, x);
            }
            window.dispatchEvent(new CustomEvent("rosette-new-tab"));
          } else if (m.key === "w") {
            m.preventDefault();
            const v = Pe.getState().activeTabId;
            v && window.dispatchEvent(new CustomEvent("rosette-close-tab", {
              detail: v
            }));
          } else if (m.key === "[" && m.shiftKey) {
            m.preventDefault();
            const { tabs: v, activeTabId: x } = Pe.getState();
            if (v.length > 1 && x) {
              const C = (v.findIndex((_) => _.id === x) - 1 + v.length) % v.length;
              $r(x, v[C].id), Pe.getState().setActiveTab(v[C].id);
            }
          } else if (m.key === "]" && m.shiftKey) {
            m.preventDefault();
            const { tabs: v, activeTabId: x } = Pe.getState();
            if (v.length > 1 && x) {
              const C = (v.findIndex((_) => _.id === x) + 1) % v.length;
              $r(x, v[C].id), Pe.getState().setActiveTab(v[C].id);
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
        const v = Pe.getState().getTab(p);
        if (!v) return;
        const x = Pe.getState().activeTabId === p;
        if ((x ? v.isDirty || Wn.getState().isDirty : v.isDirty) && !await Z1()) return;
        const C = Pe.getState(), _ = C.tabs.findIndex((b) => b.id === p);
        if (x && C.tabs.length > 1) {
          const b = C.tabs.filter((k) => k.id !== p), E = _ < b.length ? b[_].id : b[b.length - 1].id;
          $r(p, E), Pe.getState().closeTab(p), Ji(p);
        } else x && C.tabs.length === 1 ? (Pe.getState().closeTab(p), window.dispatchEvent(new CustomEvent("rosette-new-tab")), Ji(p)) : (Pe.getState().closeTab(p), Ji(p));
      };
      return window.addEventListener("rosette-close-tab", f), () => window.removeEventListener("rosette-close-tab", f);
    }, [
      c
    ]), g.useEffect(() => {
      if (!Bn || c) return;
      let f = null, m = false;
      return (async () => {
        try {
          const { getCurrentWebviewWindow: p } = await xt(async () => {
            const { getCurrentWebviewWindow: S } = await import("./webviewWindow-DoRoZnHQ.js");
            return {
              getCurrentWebviewWindow: S
            };
          }, __vite__mapDeps([5,1,2]), import.meta.url), x = await p().onDragDropEvent(async (S) => {
            if (S.payload.type === "drop") {
              const _ = S.payload.paths.find((b) => b.endsWith(".gds") || b.endsWith(".gds2") || b.endsWith(".gdsii"));
              _ && await rh(_);
            }
          });
          m ? x() : f = x;
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
            y.jsx(gb, {}),
            !n && y.jsx(e0, {
              compact: !r,
              minimal: i
            }),
            !n && y.jsx(Bv, {}),
            !n && y.jsx(Gv, {}),
            !i && y.jsx(Xv, {}),
            y.jsx(Tb, {}),
            y.jsx(l0, {})
          ]
        }),
        y.jsx(Kv, {
          compact: o || i,
          minimal: i
        })
      ]
    }) : y.jsxs("div", {
      className: `flex h-screen w-screen flex-col ${l === "dark" ? "bg-black" : "bg-white"}`,
      children: [
        y.jsxs("div", {
          className: "relative min-h-0 flex-1",
          children: [
            y.jsx(gb, {}),
            !n && y.jsx(e0, {
              compact: !r,
              minimal: i
            }),
            !n && y.jsx(Bv, {}),
            !n && y.jsx(Gv, {}),
            !i && y.jsx(Xv, {}),
            y.jsx(Tb, {}),
            y.jsx(l0, {})
          ]
        }),
        y.jsx(Kv, {
          compact: o || i,
          minimal: i
        }),
        y.jsx(ij, {})
      ]
    });
  }
  gS.createRoot(document.getElementById("root")).render(y.jsx(g.StrictMode, {
    children: y.jsx(cj, {})
  }));
})();
