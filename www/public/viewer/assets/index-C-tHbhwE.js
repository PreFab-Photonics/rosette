const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-C2Rw4G7o.js","./core-DxBnVPgq.js","./event-BC8TvpKC.js","./index-DWHWQ1OU.js","./index-BQlnJ-sT.js","./webviewWindow-DoRoZnHQ.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(async () => {
  function iS(l, n) {
    for (var a = 0; a < n.length; a++) {
      const o = n[a];
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
    function a(i) {
      const c = {};
      return i.integrity && (c.integrity = i.integrity), i.referrerPolicy && (c.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? c.credentials = "include" : i.crossOrigin === "anonymous" ? c.credentials = "omit" : c.credentials = "same-origin", c;
    }
    function o(i) {
      if (i.ep) return;
      i.ep = true;
      const c = a(i);
      fetch(i.href, c);
    }
  })();
  function l0(l) {
    return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
  }
  var Ed = {
    exports: {}
  }, Yo = {};
  var oy;
  function cS() {
    if (oy) return Yo;
    oy = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
    function a(o, i, c) {
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
    return Yo.Fragment = n, Yo.jsx = a, Yo.jsxs = a, Yo;
  }
  var sy;
  function uS() {
    return sy || (sy = 1, Ed.exports = cS()), Ed.exports;
  }
  var y = uS(), kd = {
    exports: {}
  }, De = {};
  var iy;
  function dS() {
    if (iy) return De;
    iy = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), a = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), c = Symbol.for("react.consumer"), d = Symbol.for("react.context"), f = Symbol.for("react.forward_ref"), h = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), x = Symbol.for("react.activity"), S = Symbol.iterator;
    function E(L) {
      return L === null || typeof L != "object" ? null : (L = S && L[S] || L["@@iterator"], typeof L == "function" ? L : null);
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
    }, b = Object.assign, C = {};
    function _(L, I, Z) {
      this.props = L, this.context = I, this.refs = C, this.updater = Z || k;
    }
    _.prototype.isReactComponent = {}, _.prototype.setState = function(L, I) {
      if (typeof L != "object" && typeof L != "function" && L != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, L, I, "setState");
    }, _.prototype.forceUpdate = function(L) {
      this.updater.enqueueForceUpdate(this, L, "forceUpdate");
    };
    function R() {
    }
    R.prototype = _.prototype;
    function j(L, I, Z) {
      this.props = L, this.context = I, this.refs = C, this.updater = Z || k;
    }
    var A = j.prototype = new R();
    A.constructor = j, b(A, _.prototype), A.isPureReactComponent = true;
    var N = Array.isArray;
    function T() {
    }
    var O = {
      H: null,
      A: null,
      T: null,
      S: null
    }, D = Object.prototype.hasOwnProperty;
    function H(L, I, Z) {
      var W = Z.ref;
      return {
        $$typeof: l,
        type: L,
        key: I,
        ref: W !== void 0 ? W : null,
        props: Z
      };
    }
    function $(L, I) {
      return H(L.type, I, L.props);
    }
    function te(L) {
      return typeof L == "object" && L !== null && L.$$typeof === l;
    }
    function J(L) {
      var I = {
        "=": "=0",
        ":": "=2"
      };
      return "$" + L.replace(/[=:]/g, function(Z) {
        return I[Z];
      });
    }
    var ee = /\/+/g;
    function ge(L, I) {
      return typeof L == "object" && L !== null && L.key != null ? J("" + L.key) : I.toString(36);
    }
    function Ce(L) {
      switch (L.status) {
        case "fulfilled":
          return L.value;
        case "rejected":
          throw L.reason;
        default:
          switch (typeof L.status == "string" ? L.then(T, T) : (L.status = "pending", L.then(function(I) {
            L.status === "pending" && (L.status = "fulfilled", L.value = I);
          }, function(I) {
            L.status === "pending" && (L.status = "rejected", L.reason = I);
          })), L.status) {
            case "fulfilled":
              return L.value;
            case "rejected":
              throw L.reason;
          }
      }
      throw L;
    }
    function V(L, I, Z, W, G) {
      var se = typeof L;
      (se === "undefined" || se === "boolean") && (L = null);
      var Y = false;
      if (L === null) Y = true;
      else switch (se) {
        case "bigint":
        case "string":
        case "number":
          Y = true;
          break;
        case "object":
          switch (L.$$typeof) {
            case l:
            case n:
              Y = true;
              break;
            case v:
              return Y = L._init, V(Y(L._payload), I, Z, W, G);
          }
      }
      if (Y) return G = G(L), Y = W === "" ? "." + ge(L, 0) : W, N(G) ? (Z = "", Y != null && (Z = Y.replace(ee, "$&/") + "/"), V(G, I, Z, "", function(oe) {
        return oe;
      })) : G != null && (te(G) && (G = $(G, Z + (G.key == null || L && L.key === G.key ? "" : ("" + G.key).replace(ee, "$&/") + "/") + Y)), I.push(G)), 1;
      Y = 0;
      var re = W === "" ? "." : W + ":";
      if (N(L)) for (var z = 0; z < L.length; z++) W = L[z], se = re + ge(W, z), Y += V(W, I, Z, se, G);
      else if (z = E(L), typeof z == "function") for (L = z.call(L), z = 0; !(W = L.next()).done; ) W = W.value, se = re + ge(W, z++), Y += V(W, I, Z, se, G);
      else if (se === "object") {
        if (typeof L.then == "function") return V(Ce(L), I, Z, W, G);
        throw I = String(L), Error("Objects are not valid as a React child (found: " + (I === "[object Object]" ? "object with keys {" + Object.keys(L).join(", ") + "}" : I) + "). If you meant to render a collection of children, use an array instead.");
      }
      return Y;
    }
    function P(L, I, Z) {
      if (L == null) return L;
      var W = [], G = 0;
      return V(L, W, "", "", function(se) {
        return I.call(Z, se, G++);
      }), W;
    }
    function pe(L) {
      if (L._status === -1) {
        var I = L._result;
        I = I(), I.then(function(Z) {
          (L._status === 0 || L._status === -1) && (L._status = 1, L._result = Z);
        }, function(Z) {
          (L._status === 0 || L._status === -1) && (L._status = 2, L._result = Z);
        }), L._status === -1 && (L._status = 0, L._result = I);
      }
      if (L._status === 1) return L._result.default;
      throw L._result;
    }
    var xe = typeof reportError == "function" ? reportError : function(L) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var I = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: typeof L == "object" && L !== null && typeof L.message == "string" ? String(L.message) : String(L),
          error: L
        });
        if (!window.dispatchEvent(I)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", L);
        return;
      }
      console.error(L);
    }, be = {
      map: P,
      forEach: function(L, I, Z) {
        P(L, function() {
          I.apply(this, arguments);
        }, Z);
      },
      count: function(L) {
        var I = 0;
        return P(L, function() {
          I++;
        }), I;
      },
      toArray: function(L) {
        return P(L, function(I) {
          return I;
        }) || [];
      },
      only: function(L) {
        if (!te(L)) throw Error("React.Children.only expected to receive a single React element child.");
        return L;
      }
    };
    return De.Activity = x, De.Children = be, De.Component = _, De.Fragment = a, De.Profiler = i, De.PureComponent = j, De.StrictMode = o, De.Suspense = h, De.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = O, De.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(L) {
        return O.H.useMemoCache(L);
      }
    }, De.cache = function(L) {
      return function() {
        return L.apply(null, arguments);
      };
    }, De.cacheSignal = function() {
      return null;
    }, De.cloneElement = function(L, I, Z) {
      if (L == null) throw Error("The argument must be a React element, but you passed " + L + ".");
      var W = b({}, L.props), G = L.key;
      if (I != null) for (se in I.key !== void 0 && (G = "" + I.key), I) !D.call(I, se) || se === "key" || se === "__self" || se === "__source" || se === "ref" && I.ref === void 0 || (W[se] = I[se]);
      var se = arguments.length - 2;
      if (se === 1) W.children = Z;
      else if (1 < se) {
        for (var Y = Array(se), re = 0; re < se; re++) Y[re] = arguments[re + 2];
        W.children = Y;
      }
      return H(L.type, G, W);
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
    }, De.createElement = function(L, I, Z) {
      var W, G = {}, se = null;
      if (I != null) for (W in I.key !== void 0 && (se = "" + I.key), I) D.call(I, W) && W !== "key" && W !== "__self" && W !== "__source" && (G[W] = I[W]);
      var Y = arguments.length - 2;
      if (Y === 1) G.children = Z;
      else if (1 < Y) {
        for (var re = Array(Y), z = 0; z < Y; z++) re[z] = arguments[z + 2];
        G.children = re;
      }
      if (L && L.defaultProps) for (W in Y = L.defaultProps, Y) G[W] === void 0 && (G[W] = Y[W]);
      return H(L, se, G);
    }, De.createRef = function() {
      return {
        current: null
      };
    }, De.forwardRef = function(L) {
      return {
        $$typeof: f,
        render: L
      };
    }, De.isValidElement = te, De.lazy = function(L) {
      return {
        $$typeof: v,
        _payload: {
          _status: -1,
          _result: L
        },
        _init: pe
      };
    }, De.memo = function(L, I) {
      return {
        $$typeof: p,
        type: L,
        compare: I === void 0 ? null : I
      };
    }, De.startTransition = function(L) {
      var I = O.T, Z = {};
      O.T = Z;
      try {
        var W = L(), G = O.S;
        G !== null && G(Z, W), typeof W == "object" && W !== null && typeof W.then == "function" && W.then(T, xe);
      } catch (se) {
        xe(se);
      } finally {
        I !== null && Z.types !== null && (I.types = Z.types), O.T = I;
      }
    }, De.unstable_useCacheRefresh = function() {
      return O.H.useCacheRefresh();
    }, De.use = function(L) {
      return O.H.use(L);
    }, De.useActionState = function(L, I, Z) {
      return O.H.useActionState(L, I, Z);
    }, De.useCallback = function(L, I) {
      return O.H.useCallback(L, I);
    }, De.useContext = function(L) {
      return O.H.useContext(L);
    }, De.useDebugValue = function() {
    }, De.useDeferredValue = function(L, I) {
      return O.H.useDeferredValue(L, I);
    }, De.useEffect = function(L, I) {
      return O.H.useEffect(L, I);
    }, De.useEffectEvent = function(L) {
      return O.H.useEffectEvent(L);
    }, De.useId = function() {
      return O.H.useId();
    }, De.useImperativeHandle = function(L, I, Z) {
      return O.H.useImperativeHandle(L, I, Z);
    }, De.useInsertionEffect = function(L, I) {
      return O.H.useInsertionEffect(L, I);
    }, De.useLayoutEffect = function(L, I) {
      return O.H.useLayoutEffect(L, I);
    }, De.useMemo = function(L, I) {
      return O.H.useMemo(L, I);
    }, De.useOptimistic = function(L, I) {
      return O.H.useOptimistic(L, I);
    }, De.useReducer = function(L, I, Z) {
      return O.H.useReducer(L, I, Z);
    }, De.useRef = function(L) {
      return O.H.useRef(L);
    }, De.useState = function(L) {
      return O.H.useState(L);
    }, De.useSyncExternalStore = function(L, I, Z) {
      return O.H.useSyncExternalStore(L, I, Z);
    }, De.useTransition = function() {
      return O.H.useTransition();
    }, De.version = "19.2.4", De;
  }
  var cy;
  function Wf() {
    return cy || (cy = 1, kd.exports = dS()), kd.exports;
  }
  var g = Wf();
  const Xr = l0(g), Jf = iS({
    __proto__: null,
    default: Xr
  }, [
    g
  ]);
  var _d = {
    exports: {}
  }, Bo = {}, Md = {
    exports: {}
  }, jd = {};
  var uy;
  function fS() {
    return uy || (uy = 1, (function(l) {
      function n(V, P) {
        var pe = V.length;
        V.push(P);
        e: for (; 0 < pe; ) {
          var xe = pe - 1 >>> 1, be = V[xe];
          if (0 < i(be, P)) V[xe] = P, V[pe] = be, pe = xe;
          else break e;
        }
      }
      function a(V) {
        return V.length === 0 ? null : V[0];
      }
      function o(V) {
        if (V.length === 0) return null;
        var P = V[0], pe = V.pop();
        if (pe !== P) {
          V[0] = pe;
          e: for (var xe = 0, be = V.length, L = be >>> 1; xe < L; ) {
            var I = 2 * (xe + 1) - 1, Z = V[I], W = I + 1, G = V[W];
            if (0 > i(Z, pe)) W < be && 0 > i(G, Z) ? (V[xe] = G, V[W] = pe, xe = W) : (V[xe] = Z, V[I] = pe, xe = I);
            else if (W < be && 0 > i(G, pe)) V[xe] = G, V[W] = pe, xe = W;
            else break e;
          }
        }
        return P;
      }
      function i(V, P) {
        var pe = V.sortIndex - P.sortIndex;
        return pe !== 0 ? pe : V.id - P.id;
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
      var h = [], p = [], v = 1, x = null, S = 3, E = false, k = false, b = false, C = false, _ = typeof setTimeout == "function" ? setTimeout : null, R = typeof clearTimeout == "function" ? clearTimeout : null, j = typeof setImmediate < "u" ? setImmediate : null;
      function A(V) {
        for (var P = a(p); P !== null; ) {
          if (P.callback === null) o(p);
          else if (P.startTime <= V) o(p), P.sortIndex = P.expirationTime, n(h, P);
          else break;
          P = a(p);
        }
      }
      function N(V) {
        if (b = false, A(V), !k) if (a(h) !== null) k = true, T || (T = true, J());
        else {
          var P = a(p);
          P !== null && Ce(N, P.startTime - V);
        }
      }
      var T = false, O = -1, D = 5, H = -1;
      function $() {
        return C ? true : !(l.unstable_now() - H < D);
      }
      function te() {
        if (C = false, T) {
          var V = l.unstable_now();
          H = V;
          var P = true;
          try {
            e: {
              k = false, b && (b = false, R(O), O = -1), E = true;
              var pe = S;
              try {
                t: {
                  for (A(V), x = a(h); x !== null && !(x.expirationTime > V && $()); ) {
                    var xe = x.callback;
                    if (typeof xe == "function") {
                      x.callback = null, S = x.priorityLevel;
                      var be = xe(x.expirationTime <= V);
                      if (V = l.unstable_now(), typeof be == "function") {
                        x.callback = be, A(V), P = true;
                        break t;
                      }
                      x === a(h) && o(h), A(V);
                    } else o(h);
                    x = a(h);
                  }
                  if (x !== null) P = true;
                  else {
                    var L = a(p);
                    L !== null && Ce(N, L.startTime - V), P = false;
                  }
                }
                break e;
              } finally {
                x = null, S = pe, E = false;
              }
              P = void 0;
            }
          } finally {
            P ? J() : T = false;
          }
        }
      }
      var J;
      if (typeof j == "function") J = function() {
        j(te);
      };
      else if (typeof MessageChannel < "u") {
        var ee = new MessageChannel(), ge = ee.port2;
        ee.port1.onmessage = te, J = function() {
          ge.postMessage(null);
        };
      } else J = function() {
        _(te, 0);
      };
      function Ce(V, P) {
        O = _(function() {
          V(l.unstable_now());
        }, P);
      }
      l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function(V) {
        V.callback = null;
      }, l.unstable_forceFrameRate = function(V) {
        0 > V || 125 < V ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : D = 0 < V ? Math.floor(1e3 / V) : 5;
      }, l.unstable_getCurrentPriorityLevel = function() {
        return S;
      }, l.unstable_next = function(V) {
        switch (S) {
          case 1:
          case 2:
          case 3:
            var P = 3;
            break;
          default:
            P = S;
        }
        var pe = S;
        S = P;
        try {
          return V();
        } finally {
          S = pe;
        }
      }, l.unstable_requestPaint = function() {
        C = true;
      }, l.unstable_runWithPriority = function(V, P) {
        switch (V) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            V = 3;
        }
        var pe = S;
        S = V;
        try {
          return P();
        } finally {
          S = pe;
        }
      }, l.unstable_scheduleCallback = function(V, P, pe) {
        var xe = l.unstable_now();
        switch (typeof pe == "object" && pe !== null ? (pe = pe.delay, pe = typeof pe == "number" && 0 < pe ? xe + pe : xe) : pe = xe, V) {
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
        return be = pe + be, V = {
          id: v++,
          callback: P,
          priorityLevel: V,
          startTime: pe,
          expirationTime: be,
          sortIndex: -1
        }, pe > xe ? (V.sortIndex = pe, n(p, V), a(h) === null && V === a(p) && (b ? (R(O), O = -1) : b = true, Ce(N, pe - xe))) : (V.sortIndex = be, n(h, V), k || E || (k = true, T || (T = true, J()))), V;
      }, l.unstable_shouldYield = $, l.unstable_wrapCallback = function(V) {
        var P = S;
        return function() {
          var pe = S;
          S = P;
          try {
            return V.apply(this, arguments);
          } finally {
            S = pe;
          }
        };
      };
    })(jd)), jd;
  }
  var dy;
  function hS() {
    return dy || (dy = 1, Md.exports = fS()), Md.exports;
  }
  var Ld = {
    exports: {}
  }, ln = {};
  var fy;
  function mS() {
    if (fy) return ln;
    fy = 1;
    var l = Wf();
    function n(h) {
      var p = "https://react.dev/errors/" + h;
      if (1 < arguments.length) {
        p += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var v = 2; v < arguments.length; v++) p += "&args[]=" + encodeURIComponent(arguments[v]);
      }
      return "Minified React error #" + h + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function a() {
    }
    var o = {
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
    }, i = Symbol.for("react.portal");
    function c(h, p, v) {
      var x = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: i,
        key: x == null ? null : "" + x,
        children: h,
        containerInfo: p,
        implementation: v
      };
    }
    var d = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function f(h, p) {
      if (h === "font") return "";
      if (typeof p == "string") return p === "use-credentials" ? p : "";
    }
    return ln.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, ln.createPortal = function(h, p) {
      var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11) throw Error(n(299));
      return c(h, p, null, v);
    }, ln.flushSync = function(h) {
      var p = d.T, v = o.p;
      try {
        if (d.T = null, o.p = 2, h) return h();
      } finally {
        d.T = p, o.p = v, o.d.f();
      }
    }, ln.preconnect = function(h, p) {
      typeof h == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, o.d.C(h, p));
    }, ln.prefetchDNS = function(h) {
      typeof h == "string" && o.d.D(h);
    }, ln.preinit = function(h, p) {
      if (typeof h == "string" && p && typeof p.as == "string") {
        var v = p.as, x = f(v, p.crossOrigin), S = typeof p.integrity == "string" ? p.integrity : void 0, E = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
        v === "style" ? o.d.S(h, typeof p.precedence == "string" ? p.precedence : void 0, {
          crossOrigin: x,
          integrity: S,
          fetchPriority: E
        }) : v === "script" && o.d.X(h, {
          crossOrigin: x,
          integrity: S,
          fetchPriority: E,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0
        });
      }
    }, ln.preinitModule = function(h, p) {
      if (typeof h == "string") if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var v = f(p.as, p.crossOrigin);
          o.d.M(h, {
            crossOrigin: v,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && o.d.M(h);
    }, ln.preload = function(h, p) {
      if (typeof h == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
        var v = p.as, x = f(v, p.crossOrigin);
        o.d.L(h, v, {
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
    }, ln.preloadModule = function(h, p) {
      if (typeof h == "string") if (p) {
        var v = f(p.as, p.crossOrigin);
        o.d.m(h, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: v,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else o.d.m(h);
    }, ln.requestFormReset = function(h) {
      o.d.r(h);
    }, ln.unstable_batchedUpdates = function(h, p) {
      return h(p);
    }, ln.useFormState = function(h, p, v) {
      return d.H.useFormState(h, p, v);
    }, ln.useFormStatus = function() {
      return d.H.useHostTransitionStatus();
    }, ln.version = "19.2.4", ln;
  }
  var hy;
  function a0() {
    if (hy) return Ld.exports;
    hy = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), Ld.exports = mS(), Ld.exports;
  }
  var my;
  function gS() {
    if (my) return Bo;
    my = 1;
    var l = hS(), n = Wf(), a = a0();
    function o(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var r = 2; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
      }
      return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function i(e) {
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
    function h(e) {
      if (c(e) !== e) throw Error(o(188));
    }
    function p(e) {
      var t = e.alternate;
      if (!t) {
        if (t = c(e), t === null) throw Error(o(188));
        return t !== e ? null : e;
      }
      for (var r = e, s = t; ; ) {
        var u = r.return;
        if (u === null) break;
        var m = u.alternate;
        if (m === null) {
          if (s = u.return, s !== null) {
            r = s;
            continue;
          }
          break;
        }
        if (u.child === m.child) {
          for (m = u.child; m; ) {
            if (m === r) return h(u), e;
            if (m === s) return h(u), t;
            m = m.sibling;
          }
          throw Error(o(188));
        }
        if (r.return !== s.return) r = u, s = m;
        else {
          for (var w = false, M = u.child; M; ) {
            if (M === r) {
              w = true, r = u, s = m;
              break;
            }
            if (M === s) {
              w = true, s = u, r = m;
              break;
            }
            M = M.sibling;
          }
          if (!w) {
            for (M = m.child; M; ) {
              if (M === r) {
                w = true, r = m, s = u;
                break;
              }
              if (M === s) {
                w = true, s = m, r = u;
                break;
              }
              M = M.sibling;
            }
            if (!w) throw Error(o(189));
          }
        }
        if (r.alternate !== s) throw Error(o(190));
      }
      if (r.tag !== 3) throw Error(o(188));
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
    var x = Object.assign, S = Symbol.for("react.element"), E = Symbol.for("react.transitional.element"), k = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), C = Symbol.for("react.strict_mode"), _ = Symbol.for("react.profiler"), R = Symbol.for("react.consumer"), j = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), N = Symbol.for("react.suspense"), T = Symbol.for("react.suspense_list"), O = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), H = Symbol.for("react.activity"), $ = Symbol.for("react.memo_cache_sentinel"), te = Symbol.iterator;
    function J(e) {
      return e === null || typeof e != "object" ? null : (e = te && e[te] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var ee = Symbol.for("react.client.reference");
    function ge(e) {
      if (e == null) return null;
      if (typeof e == "function") return e.$$typeof === ee ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case b:
          return "Fragment";
        case _:
          return "Profiler";
        case C:
          return "StrictMode";
        case N:
          return "Suspense";
        case T:
          return "SuspenseList";
        case H:
          return "Activity";
      }
      if (typeof e == "object") switch (e.$$typeof) {
        case k:
          return "Portal";
        case j:
          return e.displayName || "Context";
        case R:
          return (e._context.displayName || "Context") + ".Consumer";
        case A:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case O:
          return t = e.displayName || null, t !== null ? t : ge(e.type) || "Memo";
        case D:
          t = e._payload, e = e._init;
          try {
            return ge(e(t));
          } catch {
          }
      }
      return null;
    }
    var Ce = Array.isArray, V = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, P = a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, pe = {
      pending: false,
      data: null,
      method: null,
      action: null
    }, xe = [], be = -1;
    function L(e) {
      return {
        current: e
      };
    }
    function I(e) {
      0 > be || (e.current = xe[be], xe[be] = null, be--);
    }
    function Z(e, t) {
      be++, xe[be] = e.current, e.current = t;
    }
    var W = L(null), G = L(null), se = L(null), Y = L(null);
    function re(e, t) {
      switch (Z(se, t), Z(G, e), Z(W, null), t.nodeType) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Lp(e) : 0;
          break;
        default:
          if (e = t.tagName, t = t.namespaceURI) t = Lp(t), e = Rp(t, e);
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
      I(W), Z(W, e);
    }
    function z() {
      I(W), I(G), I(se);
    }
    function oe(e) {
      e.memoizedState !== null && Z(Y, e);
      var t = W.current, r = Rp(t, e.type);
      t !== r && (Z(G, e), Z(W, r));
    }
    function de(e) {
      G.current === e && (I(W), I(G)), Y.current === e && (I(Y), Io._currentValue = pe);
    }
    var _e, Ee;
    function je(e) {
      if (_e === void 0) try {
        throw Error();
      } catch (r) {
        var t = r.stack.trim().match(/\n( *(at )?)/);
        _e = t && t[1] || "", Ee = -1 < r.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < r.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
      return `
` + _e + e + Ee;
    }
    var we = false;
    function ze(e, t) {
      if (!e || we) return "";
      we = true;
      var r = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var s = {
          DetermineComponentFrameRoot: function() {
            try {
              if (t) {
                var ce = function() {
                  throw Error();
                };
                if (Object.defineProperty(ce.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(ce, []);
                  } catch (ne) {
                    var Q = ne;
                  }
                  Reflect.construct(e, [], ce);
                } else {
                  try {
                    ce.call();
                  } catch (ne) {
                    Q = ne;
                  }
                  e.call(ce.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (ne) {
                  Q = ne;
                }
                (ce = e()) && typeof ce.catch == "function" && ce.catch(function() {
                });
              }
            } catch (ne) {
              if (ne && Q && typeof ne.stack == "string") return [
                ne.stack,
                Q.stack
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
        var m = s.DetermineComponentFrameRoot(), w = m[0], M = m[1];
        if (w && M) {
          var X = w.split(`
`), F = M.split(`
`);
          for (u = s = 0; s < X.length && !X[s].includes("DetermineComponentFrameRoot"); ) s++;
          for (; u < F.length && !F[u].includes("DetermineComponentFrameRoot"); ) u++;
          if (s === X.length || u === F.length) for (s = X.length - 1, u = F.length - 1; 1 <= s && 0 <= u && X[s] !== F[u]; ) u--;
          for (; 1 <= s && 0 <= u; s--, u--) if (X[s] !== F[u]) {
            if (s !== 1 || u !== 1) do
              if (s--, u--, 0 > u || X[s] !== F[u]) {
                var ae = `
` + X[s].replace(" at new ", " at ");
                return e.displayName && ae.includes("<anonymous>") && (ae = ae.replace("<anonymous>", e.displayName)), ae;
              }
            while (1 <= s && 0 <= u);
            break;
          }
        }
      } finally {
        we = false, Error.prepareStackTrace = r;
      }
      return (r = e ? e.displayName || e.name : "") ? je(r) : "";
    }
    function Ae(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return je(e.type);
        case 16:
          return je("Lazy");
        case 13:
          return e.child !== t && t !== null ? je("Suspense Fallback") : je("Suspense");
        case 19:
          return je("SuspenseList");
        case 0:
        case 15:
          return ze(e.type, false);
        case 11:
          return ze(e.type.render, false);
        case 1:
          return ze(e.type, true);
        case 31:
          return je("Activity");
        default:
          return "";
      }
    }
    function qe(e) {
      try {
        var t = "", r = null;
        do
          t += Ae(e, r), r = e, e = e.return;
        while (e);
        return t;
      } catch (s) {
        return `
Error generating stack: ` + s.message + `
` + s.stack;
      }
    }
    var Be = Object.prototype.hasOwnProperty, Qe = l.unstable_scheduleCallback, Xe = l.unstable_cancelCallback, vt = l.unstable_shouldYield, jt = l.unstable_requestPaint, ft = l.unstable_now, Rn = l.unstable_getCurrentPriorityLevel, cl = l.unstable_ImmediatePriority, ul = l.unstable_UserBlockingPriority, An = l.unstable_NormalPriority, st = l.unstable_LowPriority, At = l.unstable_IdlePriority, on = l.log, qn = l.unstable_setDisableYieldValue, Kt = null, Ct = null;
    function Gt(e) {
      if (typeof on == "function" && qn(e), Ct && typeof Ct.setStrictMode == "function") try {
        Ct.setStrictMode(Kt, e);
      } catch {
      }
    }
    var Ht = Math.clz32 ? Math.clz32 : Gr, Yl = Math.log, qr = Math.LN2;
    function Gr(e) {
      return e >>>= 0, e === 0 ? 32 : 31 - (Yl(e) / qr | 0) | 0;
    }
    var Ka = 256, Fa = 262144, ba = 4194304;
    function tl(e) {
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
    function va(e, t, r) {
      var s = e.pendingLanes;
      if (s === 0) return 0;
      var u = 0, m = e.suspendedLanes, w = e.pingedLanes;
      e = e.warmLanes;
      var M = s & 134217727;
      return M !== 0 ? (s = M & ~m, s !== 0 ? u = tl(s) : (w &= M, w !== 0 ? u = tl(w) : r || (r = M & ~e, r !== 0 && (u = tl(r))))) : (M = s & ~m, M !== 0 ? u = tl(M) : w !== 0 ? u = tl(w) : r || (r = s & ~e, r !== 0 && (u = tl(r)))), u === 0 ? 0 : t !== 0 && t !== u && (t & m) === 0 && (m = u & -u, r = t & -t, m >= r || m === 32 && (r & 4194048) !== 0) ? t : u;
    }
    function xa(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function bc(e, t) {
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
    function wa() {
      var e = ba;
      return ba <<= 1, (ba & 62914560) === 0 && (ba = 4194304), e;
    }
    function Sa(e) {
      for (var t = [], r = 0; 31 > r; r++) t.push(e);
      return t;
    }
    function dl(e, t) {
      e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
    }
    function ys(e, t, r, s, u, m) {
      var w = e.pendingLanes;
      e.pendingLanes = r, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= r, e.entangledLanes &= r, e.errorRecoveryDisabledLanes &= r, e.shellSuspendCounter = 0;
      var M = e.entanglements, X = e.expirationTimes, F = e.hiddenUpdates;
      for (r = w & ~r; 0 < r; ) {
        var ae = 31 - Ht(r), ce = 1 << ae;
        M[ae] = 0, X[ae] = -1;
        var Q = F[ae];
        if (Q !== null) for (F[ae] = null, ae = 0; ae < Q.length; ae++) {
          var ne = Q[ae];
          ne !== null && (ne.lane &= -536870913);
        }
        r &= ~ce;
      }
      s !== 0 && Qa(e, s, 0), m !== 0 && u === 0 && e.tag !== 0 && (e.suspendedLanes |= m & ~(w & ~t));
    }
    function Qa(e, t, r) {
      e.pendingLanes |= t, e.suspendedLanes &= ~t;
      var s = 31 - Ht(t);
      e.entangledLanes |= t, e.entanglements[s] = e.entanglements[s] | 1073741824 | r & 261930;
    }
    function Wa(e, t) {
      var r = e.entangledLanes |= t;
      for (e = e.entanglements; r; ) {
        var s = 31 - Ht(r), u = 1 << s;
        u & t | e[s] & t && (e[s] |= t), r &= ~u;
      }
    }
    function bs(e, t) {
      var r = t & -t;
      return r = (r & 42) !== 0 ? 1 : Nn(r), (r & (e.suspendedLanes | t)) !== 0 ? 0 : r;
    }
    function Nn(e) {
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
    function Pr(e) {
      return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
    }
    function Zr() {
      var e = P.p;
      return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Jp(e.type));
    }
    function vs(e, t) {
      var r = P.p;
      try {
        return P.p = e, t();
      } finally {
        P.p = r;
      }
    }
    var nl = Math.random().toString(36).slice(2), Lt = "__reactFiber$" + nl, tn = "__reactProps$" + nl, dn = "__reactContainer$" + nl, Bl = "__reactEvents$" + nl, Ch = "__reactListeners$" + nl, vc = "__reactHandles$" + nl, le = "__reactResources$" + nl, Te = "__reactMarker$" + nl;
    function it(e) {
      delete e[Lt], delete e[tn], delete e[Bl], delete e[Ch], delete e[vc];
    }
    function He(e) {
      var t = e[Lt];
      if (t) return t;
      for (var r = e.parentNode; r; ) {
        if (t = r[dn] || r[Lt]) {
          if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = zp(e); e !== null; ) {
            if (r = e[Lt]) return r;
            e = zp(e);
          }
          return t;
        }
        e = r, r = e.parentNode;
      }
      return null;
    }
    function nt(e) {
      if (e = e[Lt] || e[dn]) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
      }
      return null;
    }
    function Je(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(o(33));
    }
    function lt(e) {
      var t = e[le];
      return t || (t = e[le] = {
        hoistableStyles: /* @__PURE__ */ new Map(),
        hoistableScripts: /* @__PURE__ */ new Map()
      }), t;
    }
    function Ne(e) {
      e[Te] = true;
    }
    var Yt = /* @__PURE__ */ new Set(), Et = {};
    function ht(e, t) {
      It(e, t), It(e + "Capture", t);
    }
    function It(e, t) {
      for (Et[e] = t, e = 0; e < t.length; e++) Yt.add(t[e]);
    }
    var fn = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Gn = {}, fl = {};
    function hl(e) {
      return Be.call(fl, e) ? true : Be.call(Gn, e) ? false : fn.test(e) ? fl[e] = true : (Gn[e] = true, false);
    }
    function ml(e, t, r) {
      if (hl(t)) if (r === null) e.removeAttribute(t);
      else {
        switch (typeof r) {
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
        e.setAttribute(t, "" + r);
      }
    }
    function gl(e, t, r) {
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
    function nn(e, t, r, s) {
      if (s === null) e.removeAttribute(r);
      else {
        switch (typeof s) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            e.removeAttribute(r);
            return;
        }
        e.setAttributeNS(t, r, "" + s);
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
    function Ja(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Ca(e, t, r) {
      var s = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (!e.hasOwnProperty(t) && typeof s < "u" && typeof s.get == "function" && typeof s.set == "function") {
        var u = s.get, m = s.set;
        return Object.defineProperty(e, t, {
          configurable: true,
          get: function() {
            return u.call(this);
          },
          set: function(w) {
            r = "" + w, m.call(this, w);
          }
        }), Object.defineProperty(e, t, {
          enumerable: s.enumerable
        }), {
          getValue: function() {
            return r;
          },
          setValue: function(w) {
            r = "" + w;
          },
          stopTracking: function() {
            e._valueTracker = null, delete e[t];
          }
        };
      }
    }
    function ll(e) {
      if (!e._valueTracker) {
        var t = Ja(e) ? "checked" : "value";
        e._valueTracker = Ca(e, t, "" + e[t]);
      }
    }
    function er(e) {
      if (!e) return false;
      var t = e._valueTracker;
      if (!t) return true;
      var r = t.getValue(), s = "";
      return e && (s = Ja(e) ? e.checked ? "true" : "false" : e.value), e = s, e !== r ? (t.setValue(e), true) : false;
    }
    function pl(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var xs = /[\n"\\]/g;
    function hn(e) {
      return e.replace(xs, function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      });
    }
    function Kr(e, t, r, s, u, m, w, M) {
      e.name = "", w != null && typeof w != "function" && typeof w != "symbol" && typeof w != "boolean" ? e.type = w : e.removeAttribute("type"), t != null ? w === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ft(t)) : e.value !== "" + Ft(t) && (e.value = "" + Ft(t)) : w !== "submit" && w !== "reset" || e.removeAttribute("value"), t != null ? tr(e, w, Ft(t)) : r != null ? tr(e, w, Ft(r)) : s != null && e.removeAttribute("value"), u == null && m != null && (e.defaultChecked = !!m), u != null && (e.checked = u && typeof u != "function" && typeof u != "symbol"), M != null && typeof M != "function" && typeof M != "symbol" && typeof M != "boolean" ? e.name = "" + Ft(M) : e.removeAttribute("name");
    }
    function Fr(e, t, r, s, u, m, w, M) {
      if (m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" && (e.type = m), t != null || r != null) {
        if (!(m !== "submit" && m !== "reset" || t != null)) {
          ll(e);
          return;
        }
        r = r != null ? "" + Ft(r) : "", t = t != null ? "" + Ft(t) : r, M || t === e.value || (e.value = t), e.defaultValue = t;
      }
      s = s ?? u, s = typeof s != "function" && typeof s != "symbol" && !!s, e.checked = M ? e.checked : !!s, e.defaultChecked = !!s, w != null && typeof w != "function" && typeof w != "symbol" && typeof w != "boolean" && (e.name = w), ll(e);
    }
    function tr(e, t, r) {
      t === "number" && pl(e.ownerDocument) === e || e.defaultValue === "" + r || (e.defaultValue = "" + r);
    }
    function nr(e, t, r, s) {
      if (e = e.options, t) {
        t = {};
        for (var u = 0; u < r.length; u++) t["$" + r[u]] = true;
        for (r = 0; r < e.length; r++) u = t.hasOwnProperty("$" + e[r].value), e[r].selected !== u && (e[r].selected = u), u && s && (e[r].defaultSelected = true);
      } else {
        for (r = "" + Ft(r), t = null, u = 0; u < e.length; u++) {
          if (e[u].value === r) {
            e[u].selected = true, s && (e[u].defaultSelected = true);
            return;
          }
          t !== null || e[u].disabled || (t = e[u]);
        }
        t !== null && (t.selected = true);
      }
    }
    function Eh(e, t, r) {
      if (t != null && (t = "" + Ft(t), t !== e.value && (e.value = t), r == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = r != null ? "" + Ft(r) : "";
    }
    function kh(e, t, r, s) {
      if (t == null) {
        if (s != null) {
          if (r != null) throw Error(o(92));
          if (Ce(s)) {
            if (1 < s.length) throw Error(o(93));
            s = s[0];
          }
          r = s;
        }
        r == null && (r = ""), t = r;
      }
      r = Ft(t), e.defaultValue = r, s = e.textContent, s === r && s !== "" && s !== null && (e.value = s), ll(e);
    }
    function lr(e, t) {
      if (t) {
        var r = e.firstChild;
        if (r && r === e.lastChild && r.nodeType === 3) {
          r.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var lx = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function _h(e, t, r) {
      var s = t.indexOf("--") === 0;
      r == null || typeof r == "boolean" || r === "" ? s ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : s ? e.setProperty(t, r) : typeof r != "number" || r === 0 || lx.has(t) ? t === "float" ? e.cssFloat = r : e[t] = ("" + r).trim() : e[t] = r + "px";
    }
    function Mh(e, t, r) {
      if (t != null && typeof t != "object") throw Error(o(62));
      if (e = e.style, r != null) {
        for (var s in r) !r.hasOwnProperty(s) || t != null && t.hasOwnProperty(s) || (s.indexOf("--") === 0 ? e.setProperty(s, "") : s === "float" ? e.cssFloat = "" : e[s] = "");
        for (var u in t) s = t[u], t.hasOwnProperty(u) && r[u] !== s && _h(e, u, s);
      } else for (var m in t) t.hasOwnProperty(m) && _h(e, m, t[m]);
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
    var ax = /* @__PURE__ */ new Map([
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
    ]), rx = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function ws(e) {
      return rx.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
    }
    function yl() {
    }
    var wc = null;
    function Sc(e) {
      return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
    }
    var ar = null, rr = null;
    function jh(e) {
      var t = nt(e);
      if (t && (e = t.stateNode)) {
        var r = e[tn] || null;
        e: switch (e = t.stateNode, t.type) {
          case "input":
            if (Kr(e, r.value, r.defaultValue, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name), t = r.name, r.type === "radio" && t != null) {
              for (r = e; r.parentNode; ) r = r.parentNode;
              for (r = r.querySelectorAll('input[name="' + hn("" + t) + '"][type="radio"]'), t = 0; t < r.length; t++) {
                var s = r[t];
                if (s !== e && s.form === e.form) {
                  var u = s[tn] || null;
                  if (!u) throw Error(o(90));
                  Kr(s, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name);
                }
              }
              for (t = 0; t < r.length; t++) s = r[t], s.form === e.form && er(s);
            }
            break e;
          case "textarea":
            Eh(e, r.value, r.defaultValue);
            break e;
          case "select":
            t = r.value, t != null && nr(e, !!r.multiple, t, false);
        }
      }
    }
    var Cc = false;
    function Lh(e, t, r) {
      if (Cc) return e(t, r);
      Cc = true;
      try {
        var s = e(t);
        return s;
      } finally {
        if (Cc = false, (ar !== null || rr !== null) && (ii(), ar && (t = ar, e = rr, rr = ar = null, jh(t), e))) for (t = 0; t < e.length; t++) jh(e[t]);
      }
    }
    function Qr(e, t) {
      var r = e.stateNode;
      if (r === null) return null;
      var s = r[tn] || null;
      if (s === null) return null;
      r = s[t];
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
      if (r && typeof r != "function") throw Error(o(231, t, typeof r));
      return r;
    }
    var bl = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Ec = false;
    if (bl) try {
      var Wr = {};
      Object.defineProperty(Wr, "passive", {
        get: function() {
          Ec = true;
        }
      }), window.addEventListener("test", Wr, Wr), window.removeEventListener("test", Wr, Wr);
    } catch {
      Ec = false;
    }
    var Xl = null, kc = null, Ss = null;
    function Rh() {
      if (Ss) return Ss;
      var e, t = kc, r = t.length, s, u = "value" in Xl ? Xl.value : Xl.textContent, m = u.length;
      for (e = 0; e < r && t[e] === u[e]; e++) ;
      var w = r - e;
      for (s = 1; s <= w && t[r - s] === u[m - s]; s++) ;
      return Ss = u.slice(e, 1 < s ? 1 - s : void 0);
    }
    function Cs(e) {
      var t = e.keyCode;
      return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
    }
    function Es() {
      return true;
    }
    function Ah() {
      return false;
    }
    function mn(e) {
      function t(r, s, u, m, w) {
        this._reactName = r, this._targetInst = u, this.type = s, this.nativeEvent = m, this.target = w, this.currentTarget = null;
        for (var M in e) e.hasOwnProperty(M) && (r = e[M], this[M] = r ? r(m) : m[M]);
        return this.isDefaultPrevented = (m.defaultPrevented != null ? m.defaultPrevented : m.returnValue === false) ? Es : Ah, this.isPropagationStopped = Ah, this;
      }
      return x(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var r = this.nativeEvent;
          r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = false), this.isDefaultPrevented = Es);
        },
        stopPropagation: function() {
          var r = this.nativeEvent;
          r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = true), this.isPropagationStopped = Es);
        },
        persist: function() {
        },
        isPersistent: Es
      }), t;
    }
    var Ea = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, ks = mn(Ea), Jr = x({}, Ea, {
      view: 0,
      detail: 0
    }), ox = mn(Jr), _c, Mc, eo, _s = x({}, Jr, {
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
        return "movementX" in e ? e.movementX : (e !== eo && (eo && e.type === "mousemove" ? (_c = e.screenX - eo.screenX, Mc = e.screenY - eo.screenY) : Mc = _c = 0, eo = e), _c);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Mc;
      }
    }), Nh = mn(_s), sx = x({}, _s, {
      dataTransfer: 0
    }), ix = mn(sx), cx = x({}, Jr, {
      relatedTarget: 0
    }), jc = mn(cx), ux = x({}, Ea, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), dx = mn(ux), fx = x({}, Ea, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), hx = mn(fx), mx = x({}, Ea, {
      data: 0
    }), Th = mn(mx), gx = {
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
    }, px = {
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
    }, yx = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function bx(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = yx[e]) ? !!t[e] : false;
    }
    function Lc() {
      return bx;
    }
    var vx = x({}, Jr, {
      key: function(e) {
        if (e.key) {
          var t = gx[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress" ? (e = Cs(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? px[e.keyCode] || "Unidentified" : "";
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
        return e.type === "keypress" ? Cs(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Cs(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), xx = mn(vx), wx = x({}, _s, {
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
    }), Oh = mn(wx), Sx = x({}, Jr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Lc
    }), Cx = mn(Sx), Ex = x({}, Ea, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), kx = mn(Ex), _x = x({}, _s, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), Mx = mn(_x), jx = x({}, Ea, {
      newState: 0,
      oldState: 0
    }), Lx = mn(jx), Rx = [
      9,
      13,
      27,
      32
    ], Rc = bl && "CompositionEvent" in window, to = null;
    bl && "documentMode" in document && (to = document.documentMode);
    var Ax = bl && "TextEvent" in window && !to, Ih = bl && (!Rc || to && 8 < to && 11 >= to), Dh = " ", zh = false;
    function Hh(e, t) {
      switch (e) {
        case "keyup":
          return Rx.indexOf(t.keyCode) !== -1;
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
    function Yh(e) {
      return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
    }
    var or = false;
    function Nx(e, t) {
      switch (e) {
        case "compositionend":
          return Yh(t);
        case "keypress":
          return t.which !== 32 ? null : (zh = true, Dh);
        case "textInput":
          return e = t.data, e === Dh && zh ? null : e;
        default:
          return null;
      }
    }
    function Tx(e, t) {
      if (or) return e === "compositionend" || !Rc && Hh(e, t) ? (e = Rh(), Ss = kc = Xl = null, or = false, e) : null;
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
          return Ih && t.locale !== "ko" ? null : t.data;
        default:
          return null;
      }
    }
    var Ox = {
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
    function Bh(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Ox[e.type] : t === "textarea";
    }
    function Xh(e, t, r, s) {
      ar ? rr ? rr.push(s) : rr = [
        s
      ] : ar = s, t = gi(t, "onChange"), 0 < t.length && (r = new ks("onChange", "change", null, r, s), e.push({
        event: r,
        listeners: t
      }));
    }
    var no = null, lo = null;
    function Ix(e) {
      Cp(e, 0);
    }
    function Ms(e) {
      var t = Je(e);
      if (er(t)) return e;
    }
    function Uh(e, t) {
      if (e === "change") return t;
    }
    var $h = false;
    if (bl) {
      var Ac;
      if (bl) {
        var Nc = "oninput" in document;
        if (!Nc) {
          var Vh = document.createElement("div");
          Vh.setAttribute("oninput", "return;"), Nc = typeof Vh.oninput == "function";
        }
        Ac = Nc;
      } else Ac = false;
      $h = Ac && (!document.documentMode || 9 < document.documentMode);
    }
    function qh() {
      no && (no.detachEvent("onpropertychange", Gh), lo = no = null);
    }
    function Gh(e) {
      if (e.propertyName === "value" && Ms(lo)) {
        var t = [];
        Xh(t, lo, e, Sc(e)), Lh(Ix, t);
      }
    }
    function Dx(e, t, r) {
      e === "focusin" ? (qh(), no = t, lo = r, no.attachEvent("onpropertychange", Gh)) : e === "focusout" && qh();
    }
    function zx(e) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ms(lo);
    }
    function Hx(e, t) {
      if (e === "click") return Ms(t);
    }
    function Yx(e, t) {
      if (e === "input" || e === "change") return Ms(t);
    }
    function Bx(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var wn = typeof Object.is == "function" ? Object.is : Bx;
    function ao(e, t) {
      if (wn(e, t)) return true;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null) return false;
      var r = Object.keys(e), s = Object.keys(t);
      if (r.length !== s.length) return false;
      for (s = 0; s < r.length; s++) {
        var u = r[s];
        if (!Be.call(t, u) || !wn(e[u], t[u])) return false;
      }
      return true;
    }
    function Ph(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function Zh(e, t) {
      var r = Ph(e);
      e = 0;
      for (var s; r; ) {
        if (r.nodeType === 3) {
          if (s = e + r.textContent.length, e <= t && s >= t) return {
            node: r,
            offset: t - e
          };
          e = s;
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
        r = Ph(r);
      }
    }
    function Kh(e, t) {
      return e && t ? e === t ? true : e && e.nodeType === 3 ? false : t && t.nodeType === 3 ? Kh(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : false : false;
    }
    function Fh(e) {
      e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
      for (var t = pl(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var r = typeof t.contentWindow.location.href == "string";
        } catch {
          r = false;
        }
        if (r) e = t.contentWindow;
        else break;
        t = pl(e.document);
      }
      return t;
    }
    function Tc(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    var Xx = bl && "documentMode" in document && 11 >= document.documentMode, sr = null, Oc = null, ro = null, Ic = false;
    function Qh(e, t, r) {
      var s = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
      Ic || sr == null || sr !== pl(s) || (s = sr, "selectionStart" in s && Tc(s) ? s = {
        start: s.selectionStart,
        end: s.selectionEnd
      } : (s = (s.ownerDocument && s.ownerDocument.defaultView || window).getSelection(), s = {
        anchorNode: s.anchorNode,
        anchorOffset: s.anchorOffset,
        focusNode: s.focusNode,
        focusOffset: s.focusOffset
      }), ro && ao(ro, s) || (ro = s, s = gi(Oc, "onSelect"), 0 < s.length && (t = new ks("onSelect", "select", null, t, r), e.push({
        event: t,
        listeners: s
      }), t.target = sr)));
    }
    function ka(e, t) {
      var r = {};
      return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r;
    }
    var ir = {
      animationend: ka("Animation", "AnimationEnd"),
      animationiteration: ka("Animation", "AnimationIteration"),
      animationstart: ka("Animation", "AnimationStart"),
      transitionrun: ka("Transition", "TransitionRun"),
      transitionstart: ka("Transition", "TransitionStart"),
      transitioncancel: ka("Transition", "TransitionCancel"),
      transitionend: ka("Transition", "TransitionEnd")
    }, Dc = {}, Wh = {};
    bl && (Wh = document.createElement("div").style, "AnimationEvent" in window || (delete ir.animationend.animation, delete ir.animationiteration.animation, delete ir.animationstart.animation), "TransitionEvent" in window || delete ir.transitionend.transition);
    function _a(e) {
      if (Dc[e]) return Dc[e];
      if (!ir[e]) return e;
      var t = ir[e], r;
      for (r in t) if (t.hasOwnProperty(r) && r in Wh) return Dc[e] = t[r];
      return e;
    }
    var Jh = _a("animationend"), em = _a("animationiteration"), tm = _a("animationstart"), Ux = _a("transitionrun"), $x = _a("transitionstart"), Vx = _a("transitioncancel"), nm = _a("transitionend"), lm = /* @__PURE__ */ new Map(), zc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    zc.push("scrollEnd");
    function Pn(e, t) {
      lm.set(e, t), ht(t, [
        e
      ]);
    }
    var js = typeof reportError == "function" ? reportError : function(e) {
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
    }, Tn = [], cr = 0, Hc = 0;
    function Ls() {
      for (var e = cr, t = Hc = cr = 0; t < e; ) {
        var r = Tn[t];
        Tn[t++] = null;
        var s = Tn[t];
        Tn[t++] = null;
        var u = Tn[t];
        Tn[t++] = null;
        var m = Tn[t];
        if (Tn[t++] = null, s !== null && u !== null) {
          var w = s.pending;
          w === null ? u.next = u : (u.next = w.next, w.next = u), s.pending = u;
        }
        m !== 0 && am(r, u, m);
      }
    }
    function Rs(e, t, r, s) {
      Tn[cr++] = e, Tn[cr++] = t, Tn[cr++] = r, Tn[cr++] = s, Hc |= s, e.lanes |= s, e = e.alternate, e !== null && (e.lanes |= s);
    }
    function Yc(e, t, r, s) {
      return Rs(e, t, r, s), As(e);
    }
    function Ma(e, t) {
      return Rs(e, null, null, t), As(e);
    }
    function am(e, t, r) {
      e.lanes |= r;
      var s = e.alternate;
      s !== null && (s.lanes |= r);
      for (var u = false, m = e.return; m !== null; ) m.childLanes |= r, s = m.alternate, s !== null && (s.childLanes |= r), m.tag === 22 && (e = m.stateNode, e === null || e._visibility & 1 || (u = true)), e = m, m = m.return;
      return e.tag === 3 ? (m = e.stateNode, u && t !== null && (u = 31 - Ht(r), e = m.hiddenUpdates, s = e[u], s === null ? e[u] = [
        t
      ] : s.push(t), t.lane = r | 536870912), m) : null;
    }
    function As(e) {
      if (50 < jo) throw jo = 0, Zu = null, Error(o(185));
      for (var t = e.return; t !== null; ) e = t, t = e.return;
      return e.tag === 3 ? e.stateNode : null;
    }
    var ur = {};
    function qx(e, t, r, s) {
      this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = s, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
    }
    function Sn(e, t, r, s) {
      return new qx(e, t, r, s);
    }
    function Bc(e) {
      return e = e.prototype, !(!e || !e.isReactComponent);
    }
    function vl(e, t) {
      var r = e.alternate;
      return r === null ? (r = Sn(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 65011712, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r.refCleanup = e.refCleanup, r;
    }
    function rm(e, t) {
      e.flags &= 65011714;
      var r = e.alternate;
      return r === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = r.childLanes, e.lanes = r.lanes, e.child = r.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = r.memoizedProps, e.memoizedState = r.memoizedState, e.updateQueue = r.updateQueue, e.type = r.type, t = r.dependencies, e.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      }), e;
    }
    function Ns(e, t, r, s, u, m) {
      var w = 0;
      if (s = e, typeof e == "function") Bc(e) && (w = 1);
      else if (typeof e == "string") w = Fw(e, r, W.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
      else e: switch (e) {
        case H:
          return e = Sn(31, r, t, u), e.elementType = H, e.lanes = m, e;
        case b:
          return ja(r.children, u, m, t);
        case C:
          w = 8, u |= 24;
          break;
        case _:
          return e = Sn(12, r, t, u | 2), e.elementType = _, e.lanes = m, e;
        case N:
          return e = Sn(13, r, t, u), e.elementType = N, e.lanes = m, e;
        case T:
          return e = Sn(19, r, t, u), e.elementType = T, e.lanes = m, e;
        default:
          if (typeof e == "object" && e !== null) switch (e.$$typeof) {
            case j:
              w = 10;
              break e;
            case R:
              w = 9;
              break e;
            case A:
              w = 11;
              break e;
            case O:
              w = 14;
              break e;
            case D:
              w = 16, s = null;
              break e;
          }
          w = 29, r = Error(o(130, e === null ? "null" : typeof e, "")), s = null;
      }
      return t = Sn(w, r, t, u), t.elementType = e, t.type = s, t.lanes = m, t;
    }
    function ja(e, t, r, s) {
      return e = Sn(7, e, s, t), e.lanes = r, e;
    }
    function Xc(e, t, r) {
      return e = Sn(6, e, null, t), e.lanes = r, e;
    }
    function om(e) {
      var t = Sn(18, null, null, 0);
      return t.stateNode = e, t;
    }
    function Uc(e, t, r) {
      return t = Sn(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation
      }, t;
    }
    var sm = /* @__PURE__ */ new WeakMap();
    function On(e, t) {
      if (typeof e == "object" && e !== null) {
        var r = sm.get(e);
        return r !== void 0 ? r : (t = {
          value: e,
          source: t,
          stack: qe(t)
        }, sm.set(e, t), t);
      }
      return {
        value: e,
        source: t,
        stack: qe(t)
      };
    }
    var dr = [], fr = 0, Ts = null, oo = 0, In = [], Dn = 0, Ul = null, al = 1, rl = "";
    function xl(e, t) {
      dr[fr++] = oo, dr[fr++] = Ts, Ts = e, oo = t;
    }
    function im(e, t, r) {
      In[Dn++] = al, In[Dn++] = rl, In[Dn++] = Ul, Ul = e;
      var s = al;
      e = rl;
      var u = 32 - Ht(s) - 1;
      s &= ~(1 << u), r += 1;
      var m = 32 - Ht(t) + u;
      if (30 < m) {
        var w = u - u % 5;
        m = (s & (1 << w) - 1).toString(32), s >>= w, u -= w, al = 1 << 32 - Ht(t) + u | r << u | s, rl = m + e;
      } else al = 1 << m | r << u | s, rl = e;
    }
    function $c(e) {
      e.return !== null && (xl(e, 1), im(e, 1, 0));
    }
    function Vc(e) {
      for (; e === Ts; ) Ts = dr[--fr], dr[fr] = null, oo = dr[--fr], dr[fr] = null;
      for (; e === Ul; ) Ul = In[--Dn], In[Dn] = null, rl = In[--Dn], In[Dn] = null, al = In[--Dn], In[Dn] = null;
    }
    function cm(e, t) {
      In[Dn++] = al, In[Dn++] = rl, In[Dn++] = Ul, al = t.id, rl = t.overflow, Ul = e;
    }
    var Qt = null, kt = null, We = false, $l = null, zn = false, qc = Error(o(519));
    function Vl(e) {
      var t = Error(o(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
      throw so(On(t, e)), qc;
    }
    function um(e) {
      var t = e.stateNode, r = e.type, s = e.memoizedProps;
      switch (t[Lt] = e, t[tn] = s, r) {
        case "dialog":
          Pe("cancel", t), Pe("close", t);
          break;
        case "iframe":
        case "object":
        case "embed":
          Pe("load", t);
          break;
        case "video":
        case "audio":
          for (r = 0; r < Ro.length; r++) Pe(Ro[r], t);
          break;
        case "source":
          Pe("error", t);
          break;
        case "img":
        case "image":
        case "link":
          Pe("error", t), Pe("load", t);
          break;
        case "details":
          Pe("toggle", t);
          break;
        case "input":
          Pe("invalid", t), Fr(t, s.value, s.defaultValue, s.checked, s.defaultChecked, s.type, s.name, true);
          break;
        case "select":
          Pe("invalid", t);
          break;
        case "textarea":
          Pe("invalid", t), kh(t, s.value, s.defaultValue, s.children);
      }
      r = s.children, typeof r != "string" && typeof r != "number" && typeof r != "bigint" || t.textContent === "" + r || s.suppressHydrationWarning === true || Mp(t.textContent, r) ? (s.popover != null && (Pe("beforetoggle", t), Pe("toggle", t)), s.onScroll != null && Pe("scroll", t), s.onScrollEnd != null && Pe("scrollend", t), s.onClick != null && (t.onclick = yl), t = true) : t = false, t || Vl(e, true);
    }
    function dm(e) {
      for (Qt = e.return; Qt; ) switch (Qt.tag) {
        case 5:
        case 31:
        case 13:
          zn = false;
          return;
        case 27:
        case 3:
          zn = true;
          return;
        default:
          Qt = Qt.return;
      }
    }
    function hr(e) {
      if (e !== Qt) return false;
      if (!We) return dm(e), We = true, false;
      var t = e.tag, r;
      if ((r = t !== 3 && t !== 27) && ((r = t === 5) && (r = e.type, r = !(r !== "form" && r !== "button") || cd(e.type, e.memoizedProps)), r = !r), r && kt && Vl(e), dm(e), t === 13) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
        kt = Dp(e);
      } else if (t === 31) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
        kt = Dp(e);
      } else t === 27 ? (t = kt, aa(e.type) ? (e = md, md = null, kt = e) : kt = t) : kt = Qt ? Yn(e.stateNode.nextSibling) : null;
      return true;
    }
    function La() {
      kt = Qt = null, We = false;
    }
    function Gc() {
      var e = $l;
      return e !== null && (bn === null ? bn = e : bn.push.apply(bn, e), $l = null), e;
    }
    function so(e) {
      $l === null ? $l = [
        e
      ] : $l.push(e);
    }
    var Pc = L(null), Ra = null, wl = null;
    function ql(e, t, r) {
      Z(Pc, t._currentValue), t._currentValue = r;
    }
    function Sl(e) {
      e._currentValue = Pc.current, I(Pc);
    }
    function Zc(e, t, r) {
      for (; e !== null; ) {
        var s = e.alternate;
        if ((e.childLanes & t) !== t ? (e.childLanes |= t, s !== null && (s.childLanes |= t)) : s !== null && (s.childLanes & t) !== t && (s.childLanes |= t), e === r) break;
        e = e.return;
      }
    }
    function Kc(e, t, r, s) {
      var u = e.child;
      for (u !== null && (u.return = e); u !== null; ) {
        var m = u.dependencies;
        if (m !== null) {
          var w = u.child;
          m = m.firstContext;
          e: for (; m !== null; ) {
            var M = m;
            m = u;
            for (var X = 0; X < t.length; X++) if (M.context === t[X]) {
              m.lanes |= r, M = m.alternate, M !== null && (M.lanes |= r), Zc(m.return, r, e), s || (w = null);
              break e;
            }
            m = M.next;
          }
        } else if (u.tag === 18) {
          if (w = u.return, w === null) throw Error(o(341));
          w.lanes |= r, m = w.alternate, m !== null && (m.lanes |= r), Zc(w, r, e), w = null;
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
    function mr(e, t, r, s) {
      e = null;
      for (var u = t, m = false; u !== null; ) {
        if (!m) {
          if ((u.flags & 524288) !== 0) m = true;
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
        } else if (u === Y.current) {
          if (w = u.alternate, w === null) throw Error(o(387));
          w.memoizedState.memoizedState !== u.memoizedState.memoizedState && (e !== null ? e.push(Io) : e = [
            Io
          ]);
        }
        u = u.return;
      }
      e !== null && Kc(t, e, r, s), t.flags |= 262144;
    }
    function Os(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!wn(e.context._currentValue, e.memoizedValue)) return true;
        e = e.next;
      }
      return false;
    }
    function Aa(e) {
      Ra = e, wl = null, e = e.dependencies, e !== null && (e.firstContext = null);
    }
    function Wt(e) {
      return fm(Ra, e);
    }
    function Is(e, t) {
      return Ra === null && Aa(e), fm(e, t);
    }
    function fm(e, t) {
      var r = t._currentValue;
      if (t = {
        context: t,
        memoizedValue: r,
        next: null
      }, wl === null) {
        if (e === null) throw Error(o(308));
        wl = t, e.dependencies = {
          lanes: 0,
          firstContext: t
        }, e.flags |= 524288;
      } else wl = wl.next = t;
      return r;
    }
    var Gx = typeof AbortController < "u" ? AbortController : function() {
      var e = [], t = this.signal = {
        aborted: false,
        addEventListener: function(r, s) {
          e.push(s);
        }
      };
      this.abort = function() {
        t.aborted = true, e.forEach(function(r) {
          return r();
        });
      };
    }, Px = l.unstable_scheduleCallback, Zx = l.unstable_NormalPriority, Bt = {
      $$typeof: j,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
    function Fc() {
      return {
        controller: new Gx(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function io(e) {
      e.refCount--, e.refCount === 0 && Px(Zx, function() {
        e.controller.abort();
      });
    }
    var co = null, Qc = 0, gr = 0, pr = null;
    function Kx(e, t) {
      if (co === null) {
        var r = co = [];
        Qc = 0, gr = ed(), pr = {
          status: "pending",
          value: void 0,
          then: function(s) {
            r.push(s);
          }
        };
      }
      return Qc++, t.then(hm, hm), t;
    }
    function hm() {
      if (--Qc === 0 && co !== null) {
        pr !== null && (pr.status = "fulfilled");
        var e = co;
        co = null, gr = 0, pr = null;
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function Fx(e, t) {
      var r = [], s = {
        status: "pending",
        value: null,
        reason: null,
        then: function(u) {
          r.push(u);
        }
      };
      return e.then(function() {
        s.status = "fulfilled", s.value = t;
        for (var u = 0; u < r.length; u++) (0, r[u])(t);
      }, function(u) {
        for (s.status = "rejected", s.reason = u, u = 0; u < r.length; u++) (0, r[u])(void 0);
      }), s;
    }
    var mm = V.S;
    V.S = function(e, t) {
      Qg = ft(), typeof t == "object" && t !== null && typeof t.then == "function" && Kx(e, t), mm !== null && mm(e, t);
    };
    var Na = L(null);
    function Wc() {
      var e = Na.current;
      return e !== null ? e : xt.pooledCache;
    }
    function Ds(e, t) {
      t === null ? Z(Na, Na.current) : Z(Na, t.pool);
    }
    function gm() {
      var e = Wc();
      return e === null ? null : {
        parent: Bt._currentValue,
        pool: e
      };
    }
    var yr = Error(o(460)), Jc = Error(o(474)), zs = Error(o(542)), Hs = {
      then: function() {
      }
    };
    function pm(e) {
      return e = e.status, e === "fulfilled" || e === "rejected";
    }
    function ym(e, t, r) {
      switch (r = e[r], r === void 0 ? e.push(t) : r !== t && (t.then(yl, yl), t = r), t.status) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw e = t.reason, vm(e), e;
        default:
          if (typeof t.status == "string") t.then(yl, yl);
          else {
            if (e = xt, e !== null && 100 < e.shellSuspendCounter) throw Error(o(482));
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
              throw e = t.reason, vm(e), e;
          }
          throw Oa = t, yr;
      }
    }
    function Ta(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (r) {
        throw r !== null && typeof r == "object" && typeof r.then == "function" ? (Oa = r, yr) : r;
      }
    }
    var Oa = null;
    function bm() {
      if (Oa === null) throw Error(o(459));
      var e = Oa;
      return Oa = null, e;
    }
    function vm(e) {
      if (e === yr || e === zs) throw Error(o(483));
    }
    var br = null, uo = 0;
    function Ys(e) {
      var t = uo;
      return uo += 1, br === null && (br = []), ym(br, e, t);
    }
    function fo(e, t) {
      t = t.props.ref, e.ref = t !== void 0 ? t : null;
    }
    function Bs(e, t) {
      throw t.$$typeof === S ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(o(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
    }
    function xm(e) {
      function t(q, U) {
        if (e) {
          var K = q.deletions;
          K === null ? (q.deletions = [
            U
          ], q.flags |= 16) : K.push(U);
        }
      }
      function r(q, U) {
        if (!e) return null;
        for (; U !== null; ) t(q, U), U = U.sibling;
        return null;
      }
      function s(q) {
        for (var U = /* @__PURE__ */ new Map(); q !== null; ) q.key !== null ? U.set(q.key, q) : U.set(q.index, q), q = q.sibling;
        return U;
      }
      function u(q, U) {
        return q = vl(q, U), q.index = 0, q.sibling = null, q;
      }
      function m(q, U, K) {
        return q.index = K, e ? (K = q.alternate, K !== null ? (K = K.index, K < U ? (q.flags |= 67108866, U) : K) : (q.flags |= 67108866, U)) : (q.flags |= 1048576, U);
      }
      function w(q) {
        return e && q.alternate === null && (q.flags |= 67108866), q;
      }
      function M(q, U, K, ie) {
        return U === null || U.tag !== 6 ? (U = Xc(K, q.mode, ie), U.return = q, U) : (U = u(U, K), U.return = q, U);
      }
      function X(q, U, K, ie) {
        var Le = K.type;
        return Le === b ? ae(q, U, K.props.children, ie, K.key) : U !== null && (U.elementType === Le || typeof Le == "object" && Le !== null && Le.$$typeof === D && Ta(Le) === U.type) ? (U = u(U, K.props), fo(U, K), U.return = q, U) : (U = Ns(K.type, K.key, K.props, null, q.mode, ie), fo(U, K), U.return = q, U);
      }
      function F(q, U, K, ie) {
        return U === null || U.tag !== 4 || U.stateNode.containerInfo !== K.containerInfo || U.stateNode.implementation !== K.implementation ? (U = Uc(K, q.mode, ie), U.return = q, U) : (U = u(U, K.children || []), U.return = q, U);
      }
      function ae(q, U, K, ie, Le) {
        return U === null || U.tag !== 7 ? (U = ja(K, q.mode, ie, Le), U.return = q, U) : (U = u(U, K), U.return = q, U);
      }
      function ce(q, U, K) {
        if (typeof U == "string" && U !== "" || typeof U == "number" || typeof U == "bigint") return U = Xc("" + U, q.mode, K), U.return = q, U;
        if (typeof U == "object" && U !== null) {
          switch (U.$$typeof) {
            case E:
              return K = Ns(U.type, U.key, U.props, null, q.mode, K), fo(K, U), K.return = q, K;
            case k:
              return U = Uc(U, q.mode, K), U.return = q, U;
            case D:
              return U = Ta(U), ce(q, U, K);
          }
          if (Ce(U) || J(U)) return U = ja(U, q.mode, K, null), U.return = q, U;
          if (typeof U.then == "function") return ce(q, Ys(U), K);
          if (U.$$typeof === j) return ce(q, Is(q, U), K);
          Bs(q, U);
        }
        return null;
      }
      function Q(q, U, K, ie) {
        var Le = U !== null ? U.key : null;
        if (typeof K == "string" && K !== "" || typeof K == "number" || typeof K == "bigint") return Le !== null ? null : M(q, U, "" + K, ie);
        if (typeof K == "object" && K !== null) {
          switch (K.$$typeof) {
            case E:
              return K.key === Le ? X(q, U, K, ie) : null;
            case k:
              return K.key === Le ? F(q, U, K, ie) : null;
            case D:
              return K = Ta(K), Q(q, U, K, ie);
          }
          if (Ce(K) || J(K)) return Le !== null ? null : ae(q, U, K, ie, null);
          if (typeof K.then == "function") return Q(q, U, Ys(K), ie);
          if (K.$$typeof === j) return Q(q, U, Is(q, K), ie);
          Bs(q, K);
        }
        return null;
      }
      function ne(q, U, K, ie, Le) {
        if (typeof ie == "string" && ie !== "" || typeof ie == "number" || typeof ie == "bigint") return q = q.get(K) || null, M(U, q, "" + ie, Le);
        if (typeof ie == "object" && ie !== null) {
          switch (ie.$$typeof) {
            case E:
              return q = q.get(ie.key === null ? K : ie.key) || null, X(U, q, ie, Le);
            case k:
              return q = q.get(ie.key === null ? K : ie.key) || null, F(U, q, ie, Le);
            case D:
              return ie = Ta(ie), ne(q, U, K, ie, Le);
          }
          if (Ce(ie) || J(ie)) return q = q.get(K) || null, ae(U, q, ie, Le, null);
          if (typeof ie.then == "function") return ne(q, U, K, Ys(ie), Le);
          if (ie.$$typeof === j) return ne(q, U, K, Is(U, ie), Le);
          Bs(U, ie);
        }
        return null;
      }
      function ke(q, U, K, ie) {
        for (var Le = null, at = null, Me = U, $e = U = 0, Fe = null; Me !== null && $e < K.length; $e++) {
          Me.index > $e ? (Fe = Me, Me = null) : Fe = Me.sibling;
          var rt = Q(q, Me, K[$e], ie);
          if (rt === null) {
            Me === null && (Me = Fe);
            break;
          }
          e && Me && rt.alternate === null && t(q, Me), U = m(rt, U, $e), at === null ? Le = rt : at.sibling = rt, at = rt, Me = Fe;
        }
        if ($e === K.length) return r(q, Me), We && xl(q, $e), Le;
        if (Me === null) {
          for (; $e < K.length; $e++) Me = ce(q, K[$e], ie), Me !== null && (U = m(Me, U, $e), at === null ? Le = Me : at.sibling = Me, at = Me);
          return We && xl(q, $e), Le;
        }
        for (Me = s(Me); $e < K.length; $e++) Fe = ne(Me, q, $e, K[$e], ie), Fe !== null && (e && Fe.alternate !== null && Me.delete(Fe.key === null ? $e : Fe.key), U = m(Fe, U, $e), at === null ? Le = Fe : at.sibling = Fe, at = Fe);
        return e && Me.forEach(function(ca) {
          return t(q, ca);
        }), We && xl(q, $e), Le;
      }
      function Re(q, U, K, ie) {
        if (K == null) throw Error(o(151));
        for (var Le = null, at = null, Me = U, $e = U = 0, Fe = null, rt = K.next(); Me !== null && !rt.done; $e++, rt = K.next()) {
          Me.index > $e ? (Fe = Me, Me = null) : Fe = Me.sibling;
          var ca = Q(q, Me, rt.value, ie);
          if (ca === null) {
            Me === null && (Me = Fe);
            break;
          }
          e && Me && ca.alternate === null && t(q, Me), U = m(ca, U, $e), at === null ? Le = ca : at.sibling = ca, at = ca, Me = Fe;
        }
        if (rt.done) return r(q, Me), We && xl(q, $e), Le;
        if (Me === null) {
          for (; !rt.done; $e++, rt = K.next()) rt = ce(q, rt.value, ie), rt !== null && (U = m(rt, U, $e), at === null ? Le = rt : at.sibling = rt, at = rt);
          return We && xl(q, $e), Le;
        }
        for (Me = s(Me); !rt.done; $e++, rt = K.next()) rt = ne(Me, q, $e, rt.value, ie), rt !== null && (e && rt.alternate !== null && Me.delete(rt.key === null ? $e : rt.key), U = m(rt, U, $e), at === null ? Le = rt : at.sibling = rt, at = rt);
        return e && Me.forEach(function(sS) {
          return t(q, sS);
        }), We && xl(q, $e), Le;
      }
      function bt(q, U, K, ie) {
        if (typeof K == "object" && K !== null && K.type === b && K.key === null && (K = K.props.children), typeof K == "object" && K !== null) {
          switch (K.$$typeof) {
            case E:
              e: {
                for (var Le = K.key; U !== null; ) {
                  if (U.key === Le) {
                    if (Le = K.type, Le === b) {
                      if (U.tag === 7) {
                        r(q, U.sibling), ie = u(U, K.props.children), ie.return = q, q = ie;
                        break e;
                      }
                    } else if (U.elementType === Le || typeof Le == "object" && Le !== null && Le.$$typeof === D && Ta(Le) === U.type) {
                      r(q, U.sibling), ie = u(U, K.props), fo(ie, K), ie.return = q, q = ie;
                      break e;
                    }
                    r(q, U);
                    break;
                  } else t(q, U);
                  U = U.sibling;
                }
                K.type === b ? (ie = ja(K.props.children, q.mode, ie, K.key), ie.return = q, q = ie) : (ie = Ns(K.type, K.key, K.props, null, q.mode, ie), fo(ie, K), ie.return = q, q = ie);
              }
              return w(q);
            case k:
              e: {
                for (Le = K.key; U !== null; ) {
                  if (U.key === Le) if (U.tag === 4 && U.stateNode.containerInfo === K.containerInfo && U.stateNode.implementation === K.implementation) {
                    r(q, U.sibling), ie = u(U, K.children || []), ie.return = q, q = ie;
                    break e;
                  } else {
                    r(q, U);
                    break;
                  }
                  else t(q, U);
                  U = U.sibling;
                }
                ie = Uc(K, q.mode, ie), ie.return = q, q = ie;
              }
              return w(q);
            case D:
              return K = Ta(K), bt(q, U, K, ie);
          }
          if (Ce(K)) return ke(q, U, K, ie);
          if (J(K)) {
            if (Le = J(K), typeof Le != "function") throw Error(o(150));
            return K = Le.call(K), Re(q, U, K, ie);
          }
          if (typeof K.then == "function") return bt(q, U, Ys(K), ie);
          if (K.$$typeof === j) return bt(q, U, Is(q, K), ie);
          Bs(q, K);
        }
        return typeof K == "string" && K !== "" || typeof K == "number" || typeof K == "bigint" ? (K = "" + K, U !== null && U.tag === 6 ? (r(q, U.sibling), ie = u(U, K), ie.return = q, q = ie) : (r(q, U), ie = Xc(K, q.mode, ie), ie.return = q, q = ie), w(q)) : r(q, U);
      }
      return function(q, U, K, ie) {
        try {
          uo = 0;
          var Le = bt(q, U, K, ie);
          return br = null, Le;
        } catch (Me) {
          if (Me === yr || Me === zs) throw Me;
          var at = Sn(29, Me, null, q.mode);
          return at.lanes = ie, at.return = q, at;
        } finally {
        }
      };
    }
    var Ia = xm(true), wm = xm(false), Gl = false;
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
    function Pl(e) {
      return {
        lane: e,
        tag: 0,
        payload: null,
        callback: null,
        next: null
      };
    }
    function Zl(e, t, r) {
      var s = e.updateQueue;
      if (s === null) return null;
      if (s = s.shared, (ot & 2) !== 0) {
        var u = s.pending;
        return u === null ? t.next = t : (t.next = u.next, u.next = t), s.pending = t, t = As(e), am(e, null, r), t;
      }
      return Rs(e, s, t, r), As(e);
    }
    function ho(e, t, r) {
      if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194048) !== 0)) {
        var s = t.lanes;
        s &= e.pendingLanes, r |= s, t.lanes = r, Wa(e, r);
      }
    }
    function nu(e, t) {
      var r = e.updateQueue, s = e.alternate;
      if (s !== null && (s = s.updateQueue, r === s)) {
        var u = null, m = null;
        if (r = r.firstBaseUpdate, r !== null) {
          do {
            var w = {
              lane: r.lane,
              tag: r.tag,
              payload: r.payload,
              callback: null,
              next: null
            };
            m === null ? u = m = w : m = m.next = w, r = r.next;
          } while (r !== null);
          m === null ? u = m = t : m = m.next = t;
        } else u = m = t;
        r = {
          baseState: s.baseState,
          firstBaseUpdate: u,
          lastBaseUpdate: m,
          shared: s.shared,
          callbacks: s.callbacks
        }, e.updateQueue = r;
        return;
      }
      e = r.lastBaseUpdate, e === null ? r.firstBaseUpdate = t : e.next = t, r.lastBaseUpdate = t;
    }
    var lu = false;
    function mo() {
      if (lu) {
        var e = pr;
        if (e !== null) throw e;
      }
    }
    function go(e, t, r, s) {
      lu = false;
      var u = e.updateQueue;
      Gl = false;
      var m = u.firstBaseUpdate, w = u.lastBaseUpdate, M = u.shared.pending;
      if (M !== null) {
        u.shared.pending = null;
        var X = M, F = X.next;
        X.next = null, w === null ? m = F : w.next = F, w = X;
        var ae = e.alternate;
        ae !== null && (ae = ae.updateQueue, M = ae.lastBaseUpdate, M !== w && (M === null ? ae.firstBaseUpdate = F : M.next = F, ae.lastBaseUpdate = X));
      }
      if (m !== null) {
        var ce = u.baseState;
        w = 0, ae = F = X = null, M = m;
        do {
          var Q = M.lane & -536870913, ne = Q !== M.lane;
          if (ne ? (Ke & Q) === Q : (s & Q) === Q) {
            Q !== 0 && Q === gr && (lu = true), ae !== null && (ae = ae.next = {
              lane: 0,
              tag: M.tag,
              payload: M.payload,
              callback: null,
              next: null
            });
            e: {
              var ke = e, Re = M;
              Q = t;
              var bt = r;
              switch (Re.tag) {
                case 1:
                  if (ke = Re.payload, typeof ke == "function") {
                    ce = ke.call(bt, ce, Q);
                    break e;
                  }
                  ce = ke;
                  break e;
                case 3:
                  ke.flags = ke.flags & -65537 | 128;
                case 0:
                  if (ke = Re.payload, Q = typeof ke == "function" ? ke.call(bt, ce, Q) : ke, Q == null) break e;
                  ce = x({}, ce, Q);
                  break e;
                case 2:
                  Gl = true;
              }
            }
            Q = M.callback, Q !== null && (e.flags |= 64, ne && (e.flags |= 8192), ne = u.callbacks, ne === null ? u.callbacks = [
              Q
            ] : ne.push(Q));
          } else ne = {
            lane: Q,
            tag: M.tag,
            payload: M.payload,
            callback: M.callback,
            next: null
          }, ae === null ? (F = ae = ne, X = ce) : ae = ae.next = ne, w |= Q;
          if (M = M.next, M === null) {
            if (M = u.shared.pending, M === null) break;
            ne = M, M = ne.next, ne.next = null, u.lastBaseUpdate = ne, u.shared.pending = null;
          }
        } while (true);
        ae === null && (X = ce), u.baseState = X, u.firstBaseUpdate = F, u.lastBaseUpdate = ae, m === null && (u.shared.lanes = 0), Jl |= w, e.lanes = w, e.memoizedState = ce;
      }
    }
    function Sm(e, t) {
      if (typeof e != "function") throw Error(o(191, e));
      e.call(t);
    }
    function Cm(e, t) {
      var r = e.callbacks;
      if (r !== null) for (e.callbacks = null, e = 0; e < r.length; e++) Sm(r[e], t);
    }
    var vr = L(null), Xs = L(0);
    function Em(e, t) {
      e = Al, Z(Xs, e), Z(vr, t), Al = e | t.baseLanes;
    }
    function au() {
      Z(Xs, Al), Z(vr, vr.current);
    }
    function ru() {
      Al = Xs.current, I(vr), I(Xs);
    }
    var Cn = L(null), Hn = null;
    function Kl(e) {
      var t = e.alternate;
      Z(Dt, Dt.current & 1), Z(Cn, e), Hn === null && (t === null || vr.current !== null || t.memoizedState !== null) && (Hn = e);
    }
    function ou(e) {
      Z(Dt, Dt.current), Z(Cn, e), Hn === null && (Hn = e);
    }
    function km(e) {
      e.tag === 22 ? (Z(Dt, Dt.current), Z(Cn, e), Hn === null && (Hn = e)) : Fl();
    }
    function Fl() {
      Z(Dt, Dt.current), Z(Cn, Cn.current);
    }
    function En(e) {
      I(Cn), Hn === e && (Hn = null), I(Dt);
    }
    var Dt = L(0);
    function Us(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var r = t.memoizedState;
          if (r !== null && (r = r.dehydrated, r === null || fd(r) || hd(r))) return t;
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
    var Cl = 0, Ue = null, pt = null, Xt = null, $s = false, xr = false, Da = false, Vs = 0, po = 0, wr = null, Qx = 0;
    function Nt() {
      throw Error(o(321));
    }
    function su(e, t) {
      if (t === null) return false;
      for (var r = 0; r < t.length && r < e.length; r++) if (!wn(e[r], t[r])) return false;
      return true;
    }
    function iu(e, t, r, s, u, m) {
      return Cl = m, Ue = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, V.H = e === null || e.memoizedState === null ? ig : Cu, Da = false, m = r(s, u), Da = false, xr && (m = Mm(t, r, s, u)), _m(e), m;
    }
    function _m(e) {
      V.H = vo;
      var t = pt !== null && pt.next !== null;
      if (Cl = 0, Xt = pt = Ue = null, $s = false, po = 0, wr = null, t) throw Error(o(300));
      e === null || Ut || (e = e.dependencies, e !== null && Os(e) && (Ut = true));
    }
    function Mm(e, t, r, s) {
      Ue = e;
      var u = 0;
      do {
        if (xr && (wr = null), po = 0, xr = false, 25 <= u) throw Error(o(301));
        if (u += 1, Xt = pt = null, e.updateQueue != null) {
          var m = e.updateQueue;
          m.lastEffect = null, m.events = null, m.stores = null, m.memoCache != null && (m.memoCache.index = 0);
        }
        V.H = cg, m = t(r, s);
      } while (xr);
      return m;
    }
    function Wx() {
      var e = V.H, t = e.useState()[0];
      return t = typeof t.then == "function" ? yo(t) : t, e = e.useState()[0], (pt !== null ? pt.memoizedState : null) !== e && (Ue.flags |= 1024), t;
    }
    function cu() {
      var e = Vs !== 0;
      return Vs = 0, e;
    }
    function uu(e, t, r) {
      t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~r;
    }
    function du(e) {
      if ($s) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        $s = false;
      }
      Cl = 0, Xt = pt = Ue = null, xr = false, po = Vs = 0, wr = null;
    }
    function sn() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Xt === null ? Ue.memoizedState = Xt = e : Xt = Xt.next = e, Xt;
    }
    function zt() {
      if (pt === null) {
        var e = Ue.alternate;
        e = e !== null ? e.memoizedState : null;
      } else e = pt.next;
      var t = Xt === null ? Ue.memoizedState : Xt.next;
      if (t !== null) Xt = t, pt = e;
      else {
        if (e === null) throw Ue.alternate === null ? Error(o(467)) : Error(o(310));
        pt = e, e = {
          memoizedState: pt.memoizedState,
          baseState: pt.baseState,
          baseQueue: pt.baseQueue,
          queue: pt.queue,
          next: null
        }, Xt === null ? Ue.memoizedState = Xt = e : Xt = Xt.next = e;
      }
      return Xt;
    }
    function qs() {
      return {
        lastEffect: null,
        events: null,
        stores: null,
        memoCache: null
      };
    }
    function yo(e) {
      var t = po;
      return po += 1, wr === null && (wr = []), e = ym(wr, e, t), t = Ue, (Xt === null ? t.memoizedState : Xt.next) === null && (t = t.alternate, V.H = t === null || t.memoizedState === null ? ig : Cu), e;
    }
    function Gs(e) {
      if (e !== null && typeof e == "object") {
        if (typeof e.then == "function") return yo(e);
        if (e.$$typeof === j) return Wt(e);
      }
      throw Error(o(438, String(e)));
    }
    function fu(e) {
      var t = null, r = Ue.updateQueue;
      if (r !== null && (t = r.memoCache), t == null) {
        var s = Ue.alternate;
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
      }), r === null && (r = qs(), Ue.updateQueue = r), r.memoCache = t, r = t.data[t.index], r === void 0) for (r = t.data[t.index] = Array(e), s = 0; s < e; s++) r[s] = $;
      return t.index++, r;
    }
    function El(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Ps(e) {
      var t = zt();
      return hu(t, pt, e);
    }
    function hu(e, t, r) {
      var s = e.queue;
      if (s === null) throw Error(o(311));
      s.lastRenderedReducer = r;
      var u = e.baseQueue, m = s.pending;
      if (m !== null) {
        if (u !== null) {
          var w = u.next;
          u.next = m.next, m.next = w;
        }
        t.baseQueue = u = m, s.pending = null;
      }
      if (m = e.baseState, u === null) e.memoizedState = m;
      else {
        t = u.next;
        var M = w = null, X = null, F = t, ae = false;
        do {
          var ce = F.lane & -536870913;
          if (ce !== F.lane ? (Ke & ce) === ce : (Cl & ce) === ce) {
            var Q = F.revertLane;
            if (Q === 0) X !== null && (X = X.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: F.action,
              hasEagerState: F.hasEagerState,
              eagerState: F.eagerState,
              next: null
            }), ce === gr && (ae = true);
            else if ((Cl & Q) === Q) {
              F = F.next, Q === gr && (ae = true);
              continue;
            } else ce = {
              lane: 0,
              revertLane: F.revertLane,
              gesture: null,
              action: F.action,
              hasEagerState: F.hasEagerState,
              eagerState: F.eagerState,
              next: null
            }, X === null ? (M = X = ce, w = m) : X = X.next = ce, Ue.lanes |= Q, Jl |= Q;
            ce = F.action, Da && r(m, ce), m = F.hasEagerState ? F.eagerState : r(m, ce);
          } else Q = {
            lane: ce,
            revertLane: F.revertLane,
            gesture: F.gesture,
            action: F.action,
            hasEagerState: F.hasEagerState,
            eagerState: F.eagerState,
            next: null
          }, X === null ? (M = X = Q, w = m) : X = X.next = Q, Ue.lanes |= ce, Jl |= ce;
          F = F.next;
        } while (F !== null && F !== t);
        if (X === null ? w = m : X.next = M, !wn(m, e.memoizedState) && (Ut = true, ae && (r = pr, r !== null))) throw r;
        e.memoizedState = m, e.baseState = w, e.baseQueue = X, s.lastRenderedState = m;
      }
      return u === null && (s.lanes = 0), [
        e.memoizedState,
        s.dispatch
      ];
    }
    function mu(e) {
      var t = zt(), r = t.queue;
      if (r === null) throw Error(o(311));
      r.lastRenderedReducer = e;
      var s = r.dispatch, u = r.pending, m = t.memoizedState;
      if (u !== null) {
        r.pending = null;
        var w = u = u.next;
        do
          m = e(m, w.action), w = w.next;
        while (w !== u);
        wn(m, t.memoizedState) || (Ut = true), t.memoizedState = m, t.baseQueue === null && (t.baseState = m), r.lastRenderedState = m;
      }
      return [
        m,
        s
      ];
    }
    function jm(e, t, r) {
      var s = Ue, u = zt(), m = We;
      if (m) {
        if (r === void 0) throw Error(o(407));
        r = r();
      } else r = t();
      var w = !wn((pt || u).memoizedState, r);
      if (w && (u.memoizedState = r, Ut = true), u = u.queue, yu(Am.bind(null, s, u, e), [
        e
      ]), u.getSnapshot !== t || w || Xt !== null && Xt.memoizedState.tag & 1) {
        if (s.flags |= 2048, Sr(9, {
          destroy: void 0
        }, Rm.bind(null, s, u, r, t), null), xt === null) throw Error(o(349));
        m || (Cl & 127) !== 0 || Lm(s, t, r);
      }
      return r;
    }
    function Lm(e, t, r) {
      e.flags |= 16384, e = {
        getSnapshot: t,
        value: r
      }, t = Ue.updateQueue, t === null ? (t = qs(), Ue.updateQueue = t, t.stores = [
        e
      ]) : (r = t.stores, r === null ? t.stores = [
        e
      ] : r.push(e));
    }
    function Rm(e, t, r, s) {
      t.value = r, t.getSnapshot = s, Nm(t) && Tm(e);
    }
    function Am(e, t, r) {
      return r(function() {
        Nm(t) && Tm(e);
      });
    }
    function Nm(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var r = t();
        return !wn(e, r);
      } catch {
        return true;
      }
    }
    function Tm(e) {
      var t = Ma(e, 2);
      t !== null && vn(t, e, 2);
    }
    function gu(e) {
      var t = sn();
      if (typeof e == "function") {
        var r = e;
        if (e = r(), Da) {
          Gt(true);
          try {
            r();
          } finally {
            Gt(false);
          }
        }
      }
      return t.memoizedState = t.baseState = e, t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: El,
        lastRenderedState: e
      }, t;
    }
    function Om(e, t, r, s) {
      return e.baseState = r, hu(e, pt, typeof s == "function" ? s : El);
    }
    function Jx(e, t, r, s, u) {
      if (Fs(e)) throw Error(o(485));
      if (e = t.action, e !== null) {
        var m = {
          payload: u,
          action: e,
          next: null,
          isTransition: true,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(w) {
            m.listeners.push(w);
          }
        };
        V.T !== null ? r(true) : m.isTransition = false, s(m), r = t.pending, r === null ? (m.next = t.pending = m, Im(t, m)) : (m.next = r.next, t.pending = r.next = m);
      }
    }
    function Im(e, t) {
      var r = t.action, s = t.payload, u = e.state;
      if (t.isTransition) {
        var m = V.T, w = {};
        V.T = w;
        try {
          var M = r(u, s), X = V.S;
          X !== null && X(w, M), Dm(e, t, M);
        } catch (F) {
          pu(e, t, F);
        } finally {
          m !== null && w.types !== null && (m.types = w.types), V.T = m;
        }
      } else try {
        m = r(u, s), Dm(e, t, m);
      } catch (F) {
        pu(e, t, F);
      }
    }
    function Dm(e, t, r) {
      r !== null && typeof r == "object" && typeof r.then == "function" ? r.then(function(s) {
        zm(e, t, s);
      }, function(s) {
        return pu(e, t, s);
      }) : zm(e, t, r);
    }
    function zm(e, t, r) {
      t.status = "fulfilled", t.value = r, Hm(t), e.state = r, t = e.pending, t !== null && (r = t.next, r === t ? e.pending = null : (r = r.next, t.next = r, Im(e, r)));
    }
    function pu(e, t, r) {
      var s = e.pending;
      if (e.pending = null, s !== null) {
        s = s.next;
        do
          t.status = "rejected", t.reason = r, Hm(t), t = t.next;
        while (t !== s);
      }
      e.action = null;
    }
    function Hm(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function Ym(e, t) {
      return t;
    }
    function Bm(e, t) {
      if (We) {
        var r = xt.formState;
        if (r !== null) {
          e: {
            var s = Ue;
            if (We) {
              if (kt) {
                t: {
                  for (var u = kt, m = zn; u.nodeType !== 8; ) {
                    if (!m) {
                      u = null;
                      break t;
                    }
                    if (u = Yn(u.nextSibling), u === null) {
                      u = null;
                      break t;
                    }
                  }
                  m = u.data, u = m === "F!" || m === "F" ? u : null;
                }
                if (u) {
                  kt = Yn(u.nextSibling), s = u.data === "F!";
                  break e;
                }
              }
              Vl(s);
            }
            s = false;
          }
          s && (t = r[0]);
        }
      }
      return r = sn(), r.memoizedState = r.baseState = t, s = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ym,
        lastRenderedState: t
      }, r.queue = s, r = rg.bind(null, Ue, s), s.dispatch = r, s = gu(false), m = Su.bind(null, Ue, false, s.queue), s = sn(), u = {
        state: t,
        dispatch: null,
        action: e,
        pending: null
      }, s.queue = u, r = Jx.bind(null, Ue, u, m, r), u.dispatch = r, s.memoizedState = e, [
        t,
        r,
        false
      ];
    }
    function Xm(e) {
      var t = zt();
      return Um(t, pt, e);
    }
    function Um(e, t, r) {
      if (t = hu(e, t, Ym)[0], e = Ps(El)[0], typeof t == "object" && t !== null && typeof t.then == "function") try {
        var s = yo(t);
      } catch (w) {
        throw w === yr ? zs : w;
      }
      else s = t;
      t = zt();
      var u = t.queue, m = u.dispatch;
      return r !== t.memoizedState && (Ue.flags |= 2048, Sr(9, {
        destroy: void 0
      }, ew.bind(null, u, r), null)), [
        s,
        m,
        e
      ];
    }
    function ew(e, t) {
      e.action = t;
    }
    function $m(e) {
      var t = zt(), r = pt;
      if (r !== null) return Um(t, r, e);
      zt(), t = t.memoizedState, r = zt();
      var s = r.queue.dispatch;
      return r.memoizedState = e, [
        t,
        s,
        false
      ];
    }
    function Sr(e, t, r, s) {
      return e = {
        tag: e,
        create: r,
        deps: s,
        inst: t,
        next: null
      }, t = Ue.updateQueue, t === null && (t = qs(), Ue.updateQueue = t), r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (s = r.next, r.next = e, e.next = s, t.lastEffect = e), e;
    }
    function Vm() {
      return zt().memoizedState;
    }
    function Zs(e, t, r, s) {
      var u = sn();
      Ue.flags |= e, u.memoizedState = Sr(1 | t, {
        destroy: void 0
      }, r, s === void 0 ? null : s);
    }
    function Ks(e, t, r, s) {
      var u = zt();
      s = s === void 0 ? null : s;
      var m = u.memoizedState.inst;
      pt !== null && s !== null && su(s, pt.memoizedState.deps) ? u.memoizedState = Sr(t, m, r, s) : (Ue.flags |= e, u.memoizedState = Sr(1 | t, m, r, s));
    }
    function qm(e, t) {
      Zs(8390656, 8, e, t);
    }
    function yu(e, t) {
      Ks(2048, 8, e, t);
    }
    function tw(e) {
      Ue.flags |= 4;
      var t = Ue.updateQueue;
      if (t === null) t = qs(), Ue.updateQueue = t, t.events = [
        e
      ];
      else {
        var r = t.events;
        r === null ? t.events = [
          e
        ] : r.push(e);
      }
    }
    function Gm(e) {
      var t = zt().memoizedState;
      return tw({
        ref: t,
        nextImpl: e
      }), function() {
        if ((ot & 2) !== 0) throw Error(o(440));
        return t.impl.apply(void 0, arguments);
      };
    }
    function Pm(e, t) {
      return Ks(4, 2, e, t);
    }
    function Zm(e, t) {
      return Ks(4, 4, e, t);
    }
    function Km(e, t) {
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
    function Fm(e, t, r) {
      r = r != null ? r.concat([
        e
      ]) : null, Ks(4, 4, Km.bind(null, t, e), r);
    }
    function bu() {
    }
    function Qm(e, t) {
      var r = zt();
      t = t === void 0 ? null : t;
      var s = r.memoizedState;
      return t !== null && su(t, s[1]) ? s[0] : (r.memoizedState = [
        e,
        t
      ], e);
    }
    function Wm(e, t) {
      var r = zt();
      t = t === void 0 ? null : t;
      var s = r.memoizedState;
      if (t !== null && su(t, s[1])) return s[0];
      if (s = e(), Da) {
        Gt(true);
        try {
          e();
        } finally {
          Gt(false);
        }
      }
      return r.memoizedState = [
        s,
        t
      ], s;
    }
    function vu(e, t, r) {
      return r === void 0 || (Cl & 1073741824) !== 0 && (Ke & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = r, e = Jg(), Ue.lanes |= e, Jl |= e, r);
    }
    function Jm(e, t, r, s) {
      return wn(r, t) ? r : vr.current !== null ? (e = vu(e, r, s), wn(e, t) || (Ut = true), e) : (Cl & 42) === 0 || (Cl & 1073741824) !== 0 && (Ke & 261930) === 0 ? (Ut = true, e.memoizedState = r) : (e = Jg(), Ue.lanes |= e, Jl |= e, t);
    }
    function eg(e, t, r, s, u) {
      var m = P.p;
      P.p = m !== 0 && 8 > m ? m : 8;
      var w = V.T, M = {};
      V.T = M, Su(e, false, t, r);
      try {
        var X = u(), F = V.S;
        if (F !== null && F(M, X), X !== null && typeof X == "object" && typeof X.then == "function") {
          var ae = Fx(X, s);
          bo(e, t, ae, Mn(e));
        } else bo(e, t, s, Mn(e));
      } catch (ce) {
        bo(e, t, {
          then: function() {
          },
          status: "rejected",
          reason: ce
        }, Mn());
      } finally {
        P.p = m, w !== null && M.types !== null && (w.types = M.types), V.T = w;
      }
    }
    function nw() {
    }
    function xu(e, t, r, s) {
      if (e.tag !== 5) throw Error(o(476));
      var u = tg(e).queue;
      eg(e, u, t, pe, r === null ? nw : function() {
        return ng(e), r(s);
      });
    }
    function tg(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: pe,
        baseState: pe,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: El,
          lastRenderedState: pe
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
          lastRenderedReducer: El,
          lastRenderedState: r
        },
        next: null
      }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
    }
    function ng(e) {
      var t = tg(e);
      t.next === null && (t = e.alternate.memoizedState), bo(e, t.next.queue, {}, Mn());
    }
    function wu() {
      return Wt(Io);
    }
    function lg() {
      return zt().memoizedState;
    }
    function ag() {
      return zt().memoizedState;
    }
    function lw(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var r = Mn();
            e = Pl(r);
            var s = Zl(t, e, r);
            s !== null && (vn(s, t, r), ho(s, t, r)), t = {
              cache: Fc()
            }, e.payload = t;
            return;
        }
        t = t.return;
      }
    }
    function aw(e, t, r) {
      var s = Mn();
      r = {
        lane: s,
        revertLane: 0,
        gesture: null,
        action: r,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, Fs(e) ? og(t, r) : (r = Yc(e, t, r, s), r !== null && (vn(r, e, s), sg(r, t, s)));
    }
    function rg(e, t, r) {
      var s = Mn();
      bo(e, t, r, s);
    }
    function bo(e, t, r, s) {
      var u = {
        lane: s,
        revertLane: 0,
        gesture: null,
        action: r,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (Fs(e)) og(t, u);
      else {
        var m = e.alternate;
        if (e.lanes === 0 && (m === null || m.lanes === 0) && (m = t.lastRenderedReducer, m !== null)) try {
          var w = t.lastRenderedState, M = m(w, r);
          if (u.hasEagerState = true, u.eagerState = M, wn(M, w)) return Rs(e, t, u, 0), xt === null && Ls(), false;
        } catch {
        } finally {
        }
        if (r = Yc(e, t, u, s), r !== null) return vn(r, e, s), sg(r, t, s), true;
      }
      return false;
    }
    function Su(e, t, r, s) {
      if (s = {
        lane: 2,
        revertLane: ed(),
        gesture: null,
        action: s,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, Fs(e)) {
        if (t) throw Error(o(479));
      } else t = Yc(e, r, s, 2), t !== null && vn(t, e, 2);
    }
    function Fs(e) {
      var t = e.alternate;
      return e === Ue || t !== null && t === Ue;
    }
    function og(e, t) {
      xr = $s = true;
      var r = e.pending;
      r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t;
    }
    function sg(e, t, r) {
      if ((r & 4194048) !== 0) {
        var s = t.lanes;
        s &= e.pendingLanes, r |= s, t.lanes = r, Wa(e, r);
      }
    }
    var vo = {
      readContext: Wt,
      use: Gs,
      useCallback: Nt,
      useContext: Nt,
      useEffect: Nt,
      useImperativeHandle: Nt,
      useLayoutEffect: Nt,
      useInsertionEffect: Nt,
      useMemo: Nt,
      useReducer: Nt,
      useRef: Nt,
      useState: Nt,
      useDebugValue: Nt,
      useDeferredValue: Nt,
      useTransition: Nt,
      useSyncExternalStore: Nt,
      useId: Nt,
      useHostTransitionStatus: Nt,
      useFormState: Nt,
      useActionState: Nt,
      useOptimistic: Nt,
      useMemoCache: Nt,
      useCacheRefresh: Nt
    };
    vo.useEffectEvent = Nt;
    var ig = {
      readContext: Wt,
      use: Gs,
      useCallback: function(e, t) {
        return sn().memoizedState = [
          e,
          t === void 0 ? null : t
        ], e;
      },
      useContext: Wt,
      useEffect: qm,
      useImperativeHandle: function(e, t, r) {
        r = r != null ? r.concat([
          e
        ]) : null, Zs(4194308, 4, Km.bind(null, t, e), r);
      },
      useLayoutEffect: function(e, t) {
        return Zs(4194308, 4, e, t);
      },
      useInsertionEffect: function(e, t) {
        Zs(4, 2, e, t);
      },
      useMemo: function(e, t) {
        var r = sn();
        t = t === void 0 ? null : t;
        var s = e();
        if (Da) {
          Gt(true);
          try {
            e();
          } finally {
            Gt(false);
          }
        }
        return r.memoizedState = [
          s,
          t
        ], s;
      },
      useReducer: function(e, t, r) {
        var s = sn();
        if (r !== void 0) {
          var u = r(t);
          if (Da) {
            Gt(true);
            try {
              r(t);
            } finally {
              Gt(false);
            }
          }
        } else u = t;
        return s.memoizedState = s.baseState = u, e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: u
        }, s.queue = e, e = e.dispatch = aw.bind(null, Ue, e), [
          s.memoizedState,
          e
        ];
      },
      useRef: function(e) {
        var t = sn();
        return e = {
          current: e
        }, t.memoizedState = e;
      },
      useState: function(e) {
        e = gu(e);
        var t = e.queue, r = rg.bind(null, Ue, t);
        return t.dispatch = r, [
          e.memoizedState,
          r
        ];
      },
      useDebugValue: bu,
      useDeferredValue: function(e, t) {
        var r = sn();
        return vu(r, e, t);
      },
      useTransition: function() {
        var e = gu(false);
        return e = eg.bind(null, Ue, e.queue, true, false), sn().memoizedState = e, [
          false,
          e
        ];
      },
      useSyncExternalStore: function(e, t, r) {
        var s = Ue, u = sn();
        if (We) {
          if (r === void 0) throw Error(o(407));
          r = r();
        } else {
          if (r = t(), xt === null) throw Error(o(349));
          (Ke & 127) !== 0 || Lm(s, t, r);
        }
        u.memoizedState = r;
        var m = {
          value: r,
          getSnapshot: t
        };
        return u.queue = m, qm(Am.bind(null, s, m, e), [
          e
        ]), s.flags |= 2048, Sr(9, {
          destroy: void 0
        }, Rm.bind(null, s, m, r, t), null), r;
      },
      useId: function() {
        var e = sn(), t = xt.identifierPrefix;
        if (We) {
          var r = rl, s = al;
          r = (s & ~(1 << 32 - Ht(s) - 1)).toString(32) + r, t = "_" + t + "R_" + r, r = Vs++, 0 < r && (t += "H" + r.toString(32)), t += "_";
        } else r = Qx++, t = "_" + t + "r_" + r.toString(32) + "_";
        return e.memoizedState = t;
      },
      useHostTransitionStatus: wu,
      useFormState: Bm,
      useActionState: Bm,
      useOptimistic: function(e) {
        var t = sn();
        t.memoizedState = t.baseState = e;
        var r = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        return t.queue = r, t = Su.bind(null, Ue, true, r), r.dispatch = t, [
          e,
          t
        ];
      },
      useMemoCache: fu,
      useCacheRefresh: function() {
        return sn().memoizedState = lw.bind(null, Ue);
      },
      useEffectEvent: function(e) {
        var t = sn(), r = {
          impl: e
        };
        return t.memoizedState = r, function() {
          if ((ot & 2) !== 0) throw Error(o(440));
          return r.impl.apply(void 0, arguments);
        };
      }
    }, Cu = {
      readContext: Wt,
      use: Gs,
      useCallback: Qm,
      useContext: Wt,
      useEffect: yu,
      useImperativeHandle: Fm,
      useInsertionEffect: Pm,
      useLayoutEffect: Zm,
      useMemo: Wm,
      useReducer: Ps,
      useRef: Vm,
      useState: function() {
        return Ps(El);
      },
      useDebugValue: bu,
      useDeferredValue: function(e, t) {
        var r = zt();
        return Jm(r, pt.memoizedState, e, t);
      },
      useTransition: function() {
        var e = Ps(El)[0], t = zt().memoizedState;
        return [
          typeof e == "boolean" ? e : yo(e),
          t
        ];
      },
      useSyncExternalStore: jm,
      useId: lg,
      useHostTransitionStatus: wu,
      useFormState: Xm,
      useActionState: Xm,
      useOptimistic: function(e, t) {
        var r = zt();
        return Om(r, pt, e, t);
      },
      useMemoCache: fu,
      useCacheRefresh: ag
    };
    Cu.useEffectEvent = Gm;
    var cg = {
      readContext: Wt,
      use: Gs,
      useCallback: Qm,
      useContext: Wt,
      useEffect: yu,
      useImperativeHandle: Fm,
      useInsertionEffect: Pm,
      useLayoutEffect: Zm,
      useMemo: Wm,
      useReducer: mu,
      useRef: Vm,
      useState: function() {
        return mu(El);
      },
      useDebugValue: bu,
      useDeferredValue: function(e, t) {
        var r = zt();
        return pt === null ? vu(r, e, t) : Jm(r, pt.memoizedState, e, t);
      },
      useTransition: function() {
        var e = mu(El)[0], t = zt().memoizedState;
        return [
          typeof e == "boolean" ? e : yo(e),
          t
        ];
      },
      useSyncExternalStore: jm,
      useId: lg,
      useHostTransitionStatus: wu,
      useFormState: $m,
      useActionState: $m,
      useOptimistic: function(e, t) {
        var r = zt();
        return pt !== null ? Om(r, pt, e, t) : (r.baseState = e, [
          e,
          r.queue.dispatch
        ]);
      },
      useMemoCache: fu,
      useCacheRefresh: ag
    };
    cg.useEffectEvent = Gm;
    function Eu(e, t, r, s) {
      t = e.memoizedState, r = r(s, t), r = r == null ? t : x({}, t, r), e.memoizedState = r, e.lanes === 0 && (e.updateQueue.baseState = r);
    }
    var ku = {
      enqueueSetState: function(e, t, r) {
        e = e._reactInternals;
        var s = Mn(), u = Pl(s);
        u.payload = t, r != null && (u.callback = r), t = Zl(e, u, s), t !== null && (vn(t, e, s), ho(t, e, s));
      },
      enqueueReplaceState: function(e, t, r) {
        e = e._reactInternals;
        var s = Mn(), u = Pl(s);
        u.tag = 1, u.payload = t, r != null && (u.callback = r), t = Zl(e, u, s), t !== null && (vn(t, e, s), ho(t, e, s));
      },
      enqueueForceUpdate: function(e, t) {
        e = e._reactInternals;
        var r = Mn(), s = Pl(r);
        s.tag = 2, t != null && (s.callback = t), t = Zl(e, s, r), t !== null && (vn(t, e, r), ho(t, e, r));
      }
    };
    function ug(e, t, r, s, u, m, w) {
      return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(s, m, w) : t.prototype && t.prototype.isPureReactComponent ? !ao(r, s) || !ao(u, m) : true;
    }
    function dg(e, t, r, s) {
      e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, s), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, s), t.state !== e && ku.enqueueReplaceState(t, t.state, null);
    }
    function za(e, t) {
      var r = t;
      if ("ref" in t) {
        r = {};
        for (var s in t) s !== "ref" && (r[s] = t[s]);
      }
      if (e = e.defaultProps) {
        r === t && (r = x({}, r));
        for (var u in e) r[u] === void 0 && (r[u] = e[u]);
      }
      return r;
    }
    function fg(e) {
      js(e);
    }
    function hg(e) {
      console.error(e);
    }
    function mg(e) {
      js(e);
    }
    function Qs(e, t) {
      try {
        var r = e.onUncaughtError;
        r(t.value, {
          componentStack: t.stack
        });
      } catch (s) {
        setTimeout(function() {
          throw s;
        });
      }
    }
    function gg(e, t, r) {
      try {
        var s = e.onCaughtError;
        s(r.value, {
          componentStack: r.stack,
          errorBoundary: t.tag === 1 ? t.stateNode : null
        });
      } catch (u) {
        setTimeout(function() {
          throw u;
        });
      }
    }
    function _u(e, t, r) {
      return r = Pl(r), r.tag = 3, r.payload = {
        element: null
      }, r.callback = function() {
        Qs(e, t);
      }, r;
    }
    function pg(e) {
      return e = Pl(e), e.tag = 3, e;
    }
    function yg(e, t, r, s) {
      var u = r.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var m = s.value;
        e.payload = function() {
          return u(m);
        }, e.callback = function() {
          gg(t, r, s);
        };
      }
      var w = r.stateNode;
      w !== null && typeof w.componentDidCatch == "function" && (e.callback = function() {
        gg(t, r, s), typeof u != "function" && (ea === null ? ea = /* @__PURE__ */ new Set([
          this
        ]) : ea.add(this));
        var M = s.stack;
        this.componentDidCatch(s.value, {
          componentStack: M !== null ? M : ""
        });
      });
    }
    function rw(e, t, r, s, u) {
      if (r.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
        if (t = r.alternate, t !== null && mr(t, r, u, true), r = Cn.current, r !== null) {
          switch (r.tag) {
            case 31:
            case 13:
              return Hn === null ? ci() : r.alternate === null && Tt === 0 && (Tt = 3), r.flags &= -257, r.flags |= 65536, r.lanes = u, s === Hs ? r.flags |= 16384 : (t = r.updateQueue, t === null ? r.updateQueue = /* @__PURE__ */ new Set([
                s
              ]) : t.add(s), Qu(e, s, u)), false;
            case 22:
              return r.flags |= 65536, s === Hs ? r.flags |= 16384 : (t = r.updateQueue, t === null ? (t = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([
                  s
                ])
              }, r.updateQueue = t) : (r = t.retryQueue, r === null ? t.retryQueue = /* @__PURE__ */ new Set([
                s
              ]) : r.add(s)), Qu(e, s, u)), false;
          }
          throw Error(o(435, r.tag));
        }
        return Qu(e, s, u), ci(), false;
      }
      if (We) return t = Cn.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, s !== qc && (e = Error(o(422), {
        cause: s
      }), so(On(e, r)))) : (s !== qc && (t = Error(o(423), {
        cause: s
      }), so(On(t, r))), e = e.current.alternate, e.flags |= 65536, u &= -u, e.lanes |= u, s = On(s, r), u = _u(e.stateNode, s, u), nu(e, u), Tt !== 4 && (Tt = 2)), false;
      var m = Error(o(520), {
        cause: s
      });
      if (m = On(m, r), Mo === null ? Mo = [
        m
      ] : Mo.push(m), Tt !== 4 && (Tt = 2), t === null) return true;
      s = On(s, r), r = t;
      do {
        switch (r.tag) {
          case 3:
            return r.flags |= 65536, e = u & -u, r.lanes |= e, e = _u(r.stateNode, s, e), nu(r, e), false;
          case 1:
            if (t = r.type, m = r.stateNode, (r.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || m !== null && typeof m.componentDidCatch == "function" && (ea === null || !ea.has(m)))) return r.flags |= 65536, u &= -u, r.lanes |= u, u = pg(u), yg(u, e, r, s), nu(r, u), false;
        }
        r = r.return;
      } while (r !== null);
      return false;
    }
    var Mu = Error(o(461)), Ut = false;
    function Jt(e, t, r, s) {
      t.child = e === null ? wm(t, null, r, s) : Ia(t, e.child, r, s);
    }
    function bg(e, t, r, s, u) {
      r = r.render;
      var m = t.ref;
      if ("ref" in s) {
        var w = {};
        for (var M in s) M !== "ref" && (w[M] = s[M]);
      } else w = s;
      return Aa(t), s = iu(e, t, r, w, m, u), M = cu(), e !== null && !Ut ? (uu(e, t, u), kl(e, t, u)) : (We && M && $c(t), t.flags |= 1, Jt(e, t, s, u), t.child);
    }
    function vg(e, t, r, s, u) {
      if (e === null) {
        var m = r.type;
        return typeof m == "function" && !Bc(m) && m.defaultProps === void 0 && r.compare === null ? (t.tag = 15, t.type = m, xg(e, t, m, s, u)) : (e = Ns(r.type, null, s, t, t.mode, u), e.ref = t.ref, e.return = t, t.child = e);
      }
      if (m = e.child, !Iu(e, u)) {
        var w = m.memoizedProps;
        if (r = r.compare, r = r !== null ? r : ao, r(w, s) && e.ref === t.ref) return kl(e, t, u);
      }
      return t.flags |= 1, e = vl(m, s), e.ref = t.ref, e.return = t, t.child = e;
    }
    function xg(e, t, r, s, u) {
      if (e !== null) {
        var m = e.memoizedProps;
        if (ao(m, s) && e.ref === t.ref) if (Ut = false, t.pendingProps = s = m, Iu(e, u)) (e.flags & 131072) !== 0 && (Ut = true);
        else return t.lanes = e.lanes, kl(e, t, u);
      }
      return ju(e, t, r, s, u);
    }
    function wg(e, t, r, s) {
      var u = s.children, m = e !== null ? e.memoizedState : null;
      if (e === null && t.stateNode === null && (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), s.mode === "hidden") {
        if ((t.flags & 128) !== 0) {
          if (m = m !== null ? m.baseLanes | r : r, e !== null) {
            for (s = t.child = e.child, u = 0; s !== null; ) u = u | s.lanes | s.childLanes, s = s.sibling;
            s = u & ~m;
          } else s = 0, t.child = null;
          return Sg(e, t, m, r, s);
        }
        if ((r & 536870912) !== 0) t.memoizedState = {
          baseLanes: 0,
          cachePool: null
        }, e !== null && Ds(t, m !== null ? m.cachePool : null), m !== null ? Em(t, m) : au(), km(t);
        else return s = t.lanes = 536870912, Sg(e, t, m !== null ? m.baseLanes | r : r, r, s);
      } else m !== null ? (Ds(t, m.cachePool), Em(t, m), Fl(), t.memoizedState = null) : (e !== null && Ds(t, null), au(), Fl());
      return Jt(e, t, u, r), t.child;
    }
    function xo(e, t) {
      return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), t.sibling;
    }
    function Sg(e, t, r, s, u) {
      var m = Wc();
      return m = m === null ? null : {
        parent: Bt._currentValue,
        pool: m
      }, t.memoizedState = {
        baseLanes: r,
        cachePool: m
      }, e !== null && Ds(t, null), au(), km(t), e !== null && mr(e, t, s, true), t.childLanes = u, null;
    }
    function Ws(e, t) {
      return t = ei({
        mode: t.mode,
        children: t.children
      }, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
    }
    function Cg(e, t, r) {
      return Ia(t, e.child, null, r), e = Ws(t, t.pendingProps), e.flags |= 2, En(t), t.memoizedState = null, e;
    }
    function ow(e, t, r) {
      var s = t.pendingProps, u = (t.flags & 128) !== 0;
      if (t.flags &= -129, e === null) {
        if (We) {
          if (s.mode === "hidden") return e = Ws(t, s), t.lanes = 536870912, xo(null, e);
          if (ou(t), (e = kt) ? (e = Ip(e, zn), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: Ul !== null ? {
              id: al,
              overflow: rl
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, r = om(e), r.return = t, t.child = r, Qt = t, kt = null)) : e = null, e === null) throw Vl(t);
          return t.lanes = 536870912, null;
        }
        return Ws(t, s);
      }
      var m = e.memoizedState;
      if (m !== null) {
        var w = m.dehydrated;
        if (ou(t), u) if (t.flags & 256) t.flags &= -257, t = Cg(e, t, r);
        else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
        else if (Ut || mr(e, t, r, false), u = (r & e.childLanes) !== 0, Ut || u) {
          if (s = xt, s !== null && (w = bs(s, r), w !== 0 && w !== m.retryLane)) throw m.retryLane = w, Ma(e, w), vn(s, e, w), Mu;
          ci(), t = Cg(e, t, r);
        } else e = m.treeContext, kt = Yn(w.nextSibling), Qt = t, We = true, $l = null, zn = false, e !== null && cm(t, e), t = Ws(t, s), t.flags |= 4096;
        return t;
      }
      return e = vl(e.child, {
        mode: s.mode,
        children: s.children
      }), e.ref = t.ref, t.child = e, e.return = t, e;
    }
    function Js(e, t) {
      var r = t.ref;
      if (r === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof r != "function" && typeof r != "object") throw Error(o(284));
        (e === null || e.ref !== r) && (t.flags |= 4194816);
      }
    }
    function ju(e, t, r, s, u) {
      return Aa(t), r = iu(e, t, r, s, void 0, u), s = cu(), e !== null && !Ut ? (uu(e, t, u), kl(e, t, u)) : (We && s && $c(t), t.flags |= 1, Jt(e, t, r, u), t.child);
    }
    function Eg(e, t, r, s, u, m) {
      return Aa(t), t.updateQueue = null, r = Mm(t, s, r, u), _m(e), s = cu(), e !== null && !Ut ? (uu(e, t, m), kl(e, t, m)) : (We && s && $c(t), t.flags |= 1, Jt(e, t, r, m), t.child);
    }
    function kg(e, t, r, s, u) {
      if (Aa(t), t.stateNode === null) {
        var m = ur, w = r.contextType;
        typeof w == "object" && w !== null && (m = Wt(w)), m = new r(s, m), t.memoizedState = m.state !== null && m.state !== void 0 ? m.state : null, m.updater = ku, t.stateNode = m, m._reactInternals = t, m = t.stateNode, m.props = s, m.state = t.memoizedState, m.refs = {}, eu(t), w = r.contextType, m.context = typeof w == "object" && w !== null ? Wt(w) : ur, m.state = t.memoizedState, w = r.getDerivedStateFromProps, typeof w == "function" && (Eu(t, r, w, s), m.state = t.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof m.getSnapshotBeforeUpdate == "function" || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (w = m.state, typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount(), w !== m.state && ku.enqueueReplaceState(m, m.state, null), go(t, s, m, u), mo(), m.state = t.memoizedState), typeof m.componentDidMount == "function" && (t.flags |= 4194308), s = true;
      } else if (e === null) {
        m = t.stateNode;
        var M = t.memoizedProps, X = za(r, M);
        m.props = X;
        var F = m.context, ae = r.contextType;
        w = ur, typeof ae == "object" && ae !== null && (w = Wt(ae));
        var ce = r.getDerivedStateFromProps;
        ae = typeof ce == "function" || typeof m.getSnapshotBeforeUpdate == "function", M = t.pendingProps !== M, ae || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (M || F !== w) && dg(t, m, s, w), Gl = false;
        var Q = t.memoizedState;
        m.state = Q, go(t, s, m, u), mo(), F = t.memoizedState, M || Q !== F || Gl ? (typeof ce == "function" && (Eu(t, r, ce, s), F = t.memoizedState), (X = Gl || ug(t, r, X, s, Q, F, w)) ? (ae || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = s, t.memoizedState = F), m.props = s, m.state = F, m.context = w, s = X) : (typeof m.componentDidMount == "function" && (t.flags |= 4194308), s = false);
      } else {
        m = t.stateNode, tu(e, t), w = t.memoizedProps, ae = za(r, w), m.props = ae, ce = t.pendingProps, Q = m.context, F = r.contextType, X = ur, typeof F == "object" && F !== null && (X = Wt(F)), M = r.getDerivedStateFromProps, (F = typeof M == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (w !== ce || Q !== X) && dg(t, m, s, X), Gl = false, Q = t.memoizedState, m.state = Q, go(t, s, m, u), mo();
        var ne = t.memoizedState;
        w !== ce || Q !== ne || Gl || e !== null && e.dependencies !== null && Os(e.dependencies) ? (typeof M == "function" && (Eu(t, r, M, s), ne = t.memoizedState), (ae = Gl || ug(t, r, ae, s, Q, ne, X) || e !== null && e.dependencies !== null && Os(e.dependencies)) ? (F || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(s, ne, X), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(s, ne, X)), typeof m.componentDidUpdate == "function" && (t.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || w === e.memoizedProps && Q === e.memoizedState || (t.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || w === e.memoizedProps && Q === e.memoizedState || (t.flags |= 1024), t.memoizedProps = s, t.memoizedState = ne), m.props = s, m.state = ne, m.context = X, s = ae) : (typeof m.componentDidUpdate != "function" || w === e.memoizedProps && Q === e.memoizedState || (t.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || w === e.memoizedProps && Q === e.memoizedState || (t.flags |= 1024), s = false);
      }
      return m = s, Js(e, t), s = (t.flags & 128) !== 0, m || s ? (m = t.stateNode, r = s && typeof r.getDerivedStateFromError != "function" ? null : m.render(), t.flags |= 1, e !== null && s ? (t.child = Ia(t, e.child, null, u), t.child = Ia(t, null, r, u)) : Jt(e, t, r, u), t.memoizedState = m.state, e = t.child) : e = kl(e, t, u), e;
    }
    function _g(e, t, r, s) {
      return La(), t.flags |= 256, Jt(e, t, r, s), t.child;
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
        cachePool: gm()
      };
    }
    function Au(e, t, r) {
      return e = e !== null ? e.childLanes & ~r : 0, t && (e |= _n), e;
    }
    function Mg(e, t, r) {
      var s = t.pendingProps, u = false, m = (t.flags & 128) !== 0, w;
      if ((w = m) || (w = e !== null && e.memoizedState === null ? false : (Dt.current & 2) !== 0), w && (u = true, t.flags &= -129), w = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
        if (We) {
          if (u ? Kl(t) : Fl(), (e = kt) ? (e = Ip(e, zn), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: Ul !== null ? {
              id: al,
              overflow: rl
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, r = om(e), r.return = t, t.child = r, Qt = t, kt = null)) : e = null, e === null) throw Vl(t);
          return hd(e) ? t.lanes = 32 : t.lanes = 536870912, null;
        }
        var M = s.children;
        return s = s.fallback, u ? (Fl(), u = t.mode, M = ei({
          mode: "hidden",
          children: M
        }, u), s = ja(s, u, r, null), M.return = t, s.return = t, M.sibling = s, t.child = M, s = t.child, s.memoizedState = Ru(r), s.childLanes = Au(e, w, r), t.memoizedState = Lu, xo(null, s)) : (Kl(t), Nu(t, M));
      }
      var X = e.memoizedState;
      if (X !== null && (M = X.dehydrated, M !== null)) {
        if (m) t.flags & 256 ? (Kl(t), t.flags &= -257, t = Tu(e, t, r)) : t.memoizedState !== null ? (Fl(), t.child = e.child, t.flags |= 128, t = null) : (Fl(), M = s.fallback, u = t.mode, s = ei({
          mode: "visible",
          children: s.children
        }, u), M = ja(M, u, r, null), M.flags |= 2, s.return = t, M.return = t, s.sibling = M, t.child = s, Ia(t, e.child, null, r), s = t.child, s.memoizedState = Ru(r), s.childLanes = Au(e, w, r), t.memoizedState = Lu, t = xo(null, s));
        else if (Kl(t), hd(M)) {
          if (w = M.nextSibling && M.nextSibling.dataset, w) var F = w.dgst;
          w = F, s = Error(o(419)), s.stack = "", s.digest = w, so({
            value: s,
            source: null,
            stack: null
          }), t = Tu(e, t, r);
        } else if (Ut || mr(e, t, r, false), w = (r & e.childLanes) !== 0, Ut || w) {
          if (w = xt, w !== null && (s = bs(w, r), s !== 0 && s !== X.retryLane)) throw X.retryLane = s, Ma(e, s), vn(w, e, s), Mu;
          fd(M) || ci(), t = Tu(e, t, r);
        } else fd(M) ? (t.flags |= 192, t.child = e.child, t = null) : (e = X.treeContext, kt = Yn(M.nextSibling), Qt = t, We = true, $l = null, zn = false, e !== null && cm(t, e), t = Nu(t, s.children), t.flags |= 4096);
        return t;
      }
      return u ? (Fl(), M = s.fallback, u = t.mode, X = e.child, F = X.sibling, s = vl(X, {
        mode: "hidden",
        children: s.children
      }), s.subtreeFlags = X.subtreeFlags & 65011712, F !== null ? M = vl(F, M) : (M = ja(M, u, r, null), M.flags |= 2), M.return = t, s.return = t, s.sibling = M, t.child = s, xo(null, s), s = t.child, M = e.child.memoizedState, M === null ? M = Ru(r) : (u = M.cachePool, u !== null ? (X = Bt._currentValue, u = u.parent !== X ? {
        parent: X,
        pool: X
      } : u) : u = gm(), M = {
        baseLanes: M.baseLanes | r,
        cachePool: u
      }), s.memoizedState = M, s.childLanes = Au(e, w, r), t.memoizedState = Lu, xo(e.child, s)) : (Kl(t), r = e.child, e = r.sibling, r = vl(r, {
        mode: "visible",
        children: s.children
      }), r.return = t, r.sibling = null, e !== null && (w = t.deletions, w === null ? (t.deletions = [
        e
      ], t.flags |= 16) : w.push(e)), t.child = r, t.memoizedState = null, r);
    }
    function Nu(e, t) {
      return t = ei({
        mode: "visible",
        children: t
      }, e.mode), t.return = e, e.child = t;
    }
    function ei(e, t) {
      return e = Sn(22, e, null, t), e.lanes = 0, e;
    }
    function Tu(e, t, r) {
      return Ia(t, e.child, null, r), e = Nu(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
    }
    function jg(e, t, r) {
      e.lanes |= t;
      var s = e.alternate;
      s !== null && (s.lanes |= t), Zc(e.return, t, r);
    }
    function Ou(e, t, r, s, u, m) {
      var w = e.memoizedState;
      w === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: s,
        tail: r,
        tailMode: u,
        treeForkCount: m
      } : (w.isBackwards = t, w.rendering = null, w.renderingStartTime = 0, w.last = s, w.tail = r, w.tailMode = u, w.treeForkCount = m);
    }
    function Lg(e, t, r) {
      var s = t.pendingProps, u = s.revealOrder, m = s.tail;
      s = s.children;
      var w = Dt.current, M = (w & 2) !== 0;
      if (M ? (w = w & 1 | 2, t.flags |= 128) : w &= 1, Z(Dt, w), Jt(e, t, s, r), s = We ? oo : 0, !M && e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && jg(e, r, t);
        else if (e.tag === 19) jg(e, r, t);
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
          for (r = t.child, u = null; r !== null; ) e = r.alternate, e !== null && Us(e) === null && (u = r), r = r.sibling;
          r = u, r === null ? (u = t.child, t.child = null) : (u = r.sibling, r.sibling = null), Ou(t, false, u, r, m, s);
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (r = null, u = t.child, t.child = null; u !== null; ) {
            if (e = u.alternate, e !== null && Us(e) === null) {
              t.child = u;
              break;
            }
            e = u.sibling, u.sibling = r, r = u, u = e;
          }
          Ou(t, true, r, null, m, s);
          break;
        case "together":
          Ou(t, false, null, null, void 0, s);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function kl(e, t, r) {
      if (e !== null && (t.dependencies = e.dependencies), Jl |= t.lanes, (r & t.childLanes) === 0) if (e !== null) {
        if (mr(e, t, r, false), (r & t.childLanes) === 0) return null;
      } else return null;
      if (e !== null && t.child !== e.child) throw Error(o(153));
      if (t.child !== null) {
        for (e = t.child, r = vl(e, e.pendingProps), t.child = r, r.return = t; e.sibling !== null; ) e = e.sibling, r = r.sibling = vl(e, e.pendingProps), r.return = t;
        r.sibling = null;
      }
      return t.child;
    }
    function Iu(e, t) {
      return (e.lanes & t) !== 0 ? true : (e = e.dependencies, !!(e !== null && Os(e)));
    }
    function sw(e, t, r) {
      switch (t.tag) {
        case 3:
          re(t, t.stateNode.containerInfo), ql(t, Bt, e.memoizedState.cache), La();
          break;
        case 27:
        case 5:
          oe(t);
          break;
        case 4:
          re(t, t.stateNode.containerInfo);
          break;
        case 10:
          ql(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return t.flags |= 128, ou(t), null;
          break;
        case 13:
          var s = t.memoizedState;
          if (s !== null) return s.dehydrated !== null ? (Kl(t), t.flags |= 128, null) : (r & t.child.childLanes) !== 0 ? Mg(e, t, r) : (Kl(t), e = kl(e, t, r), e !== null ? e.sibling : null);
          Kl(t);
          break;
        case 19:
          var u = (e.flags & 128) !== 0;
          if (s = (r & t.childLanes) !== 0, s || (mr(e, t, r, false), s = (r & t.childLanes) !== 0), u) {
            if (s) return Lg(e, t, r);
            t.flags |= 128;
          }
          if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), Z(Dt, Dt.current), s) break;
          return null;
        case 22:
          return t.lanes = 0, wg(e, t, r, t.pendingProps);
        case 24:
          ql(t, Bt, e.memoizedState.cache);
      }
      return kl(e, t, r);
    }
    function Rg(e, t, r) {
      if (e !== null) if (e.memoizedProps !== t.pendingProps) Ut = true;
      else {
        if (!Iu(e, r) && (t.flags & 128) === 0) return Ut = false, sw(e, t, r);
        Ut = (e.flags & 131072) !== 0;
      }
      else Ut = false, We && (t.flags & 1048576) !== 0 && im(t, oo, t.index);
      switch (t.lanes = 0, t.tag) {
        case 16:
          e: {
            var s = t.pendingProps;
            if (e = Ta(t.elementType), t.type = e, typeof e == "function") Bc(e) ? (s = za(e, s), t.tag = 1, t = kg(null, t, e, s, r)) : (t.tag = 0, t = ju(null, t, e, s, r));
            else {
              if (e != null) {
                var u = e.$$typeof;
                if (u === A) {
                  t.tag = 11, t = bg(null, t, e, s, r);
                  break e;
                } else if (u === O) {
                  t.tag = 14, t = vg(null, t, e, s, r);
                  break e;
                }
              }
              throw t = ge(e) || e, Error(o(306, t, ""));
            }
          }
          return t;
        case 0:
          return ju(e, t, t.type, t.pendingProps, r);
        case 1:
          return s = t.type, u = za(s, t.pendingProps), kg(e, t, s, u, r);
        case 3:
          e: {
            if (re(t, t.stateNode.containerInfo), e === null) throw Error(o(387));
            s = t.pendingProps;
            var m = t.memoizedState;
            u = m.element, tu(e, t), go(t, s, null, r);
            var w = t.memoizedState;
            if (s = w.cache, ql(t, Bt, s), s !== m.cache && Kc(t, [
              Bt
            ], r, true), mo(), s = w.element, m.isDehydrated) if (m = {
              element: s,
              isDehydrated: false,
              cache: w.cache
            }, t.updateQueue.baseState = m, t.memoizedState = m, t.flags & 256) {
              t = _g(e, t, s, r);
              break e;
            } else if (s !== u) {
              u = On(Error(o(424)), t), so(u), t = _g(e, t, s, r);
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (kt = Yn(e.firstChild), Qt = t, We = true, $l = null, zn = true, r = wm(t, null, s, r), t.child = r; r; ) r.flags = r.flags & -3 | 4096, r = r.sibling;
            }
            else {
              if (La(), s === u) {
                t = kl(e, t, r);
                break e;
              }
              Jt(e, t, s, r);
            }
            t = t.child;
          }
          return t;
        case 26:
          return Js(e, t), e === null ? (r = Xp(t.type, null, t.pendingProps, null)) ? t.memoizedState = r : We || (r = t.type, e = t.pendingProps, s = pi(se.current).createElement(r), s[Lt] = t, s[tn] = e, en(s, r, e), Ne(s), t.stateNode = s) : t.memoizedState = Xp(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
        case 27:
          return oe(t), e === null && We && (s = t.stateNode = Hp(t.type, t.pendingProps, se.current), Qt = t, zn = true, u = kt, aa(t.type) ? (md = u, kt = Yn(s.firstChild)) : kt = u), Jt(e, t, t.pendingProps.children, r), Js(e, t), e === null && (t.flags |= 4194304), t.child;
        case 5:
          return e === null && We && ((u = s = kt) && (s = zw(s, t.type, t.pendingProps, zn), s !== null ? (t.stateNode = s, Qt = t, kt = Yn(s.firstChild), zn = false, u = true) : u = false), u || Vl(t)), oe(t), u = t.type, m = t.pendingProps, w = e !== null ? e.memoizedProps : null, s = m.children, cd(u, m) ? s = null : w !== null && cd(u, w) && (t.flags |= 32), t.memoizedState !== null && (u = iu(e, t, Wx, null, null, r), Io._currentValue = u), Js(e, t), Jt(e, t, s, r), t.child;
        case 6:
          return e === null && We && ((e = r = kt) && (r = Hw(r, t.pendingProps, zn), r !== null ? (t.stateNode = r, Qt = t, kt = null, e = true) : e = false), e || Vl(t)), null;
        case 13:
          return Mg(e, t, r);
        case 4:
          return re(t, t.stateNode.containerInfo), s = t.pendingProps, e === null ? t.child = Ia(t, null, s, r) : Jt(e, t, s, r), t.child;
        case 11:
          return bg(e, t, t.type, t.pendingProps, r);
        case 7:
          return Jt(e, t, t.pendingProps, r), t.child;
        case 8:
          return Jt(e, t, t.pendingProps.children, r), t.child;
        case 12:
          return Jt(e, t, t.pendingProps.children, r), t.child;
        case 10:
          return s = t.pendingProps, ql(t, t.type, s.value), Jt(e, t, s.children, r), t.child;
        case 9:
          return u = t.type._context, s = t.pendingProps.children, Aa(t), u = Wt(u), s = s(u), t.flags |= 1, Jt(e, t, s, r), t.child;
        case 14:
          return vg(e, t, t.type, t.pendingProps, r);
        case 15:
          return xg(e, t, t.type, t.pendingProps, r);
        case 19:
          return Lg(e, t, r);
        case 31:
          return ow(e, t, r);
        case 22:
          return wg(e, t, r, t.pendingProps);
        case 24:
          return Aa(t), s = Wt(Bt), e === null ? (u = Wc(), u === null && (u = xt, m = Fc(), u.pooledCache = m, m.refCount++, m !== null && (u.pooledCacheLanes |= r), u = m), t.memoizedState = {
            parent: s,
            cache: u
          }, eu(t), ql(t, Bt, u)) : ((e.lanes & r) !== 0 && (tu(e, t), go(t, null, null, r), mo()), u = e.memoizedState, m = t.memoizedState, u.parent !== s ? (u = {
            parent: s,
            cache: s
          }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), ql(t, Bt, s)) : (s = m.cache, ql(t, Bt, s), s !== u.cache && Kc(t, [
            Bt
          ], r, true))), Jt(e, t, t.pendingProps.children, r), t.child;
        case 29:
          throw t.pendingProps;
      }
      throw Error(o(156, t.tag));
    }
    function _l(e) {
      e.flags |= 4;
    }
    function Du(e, t, r, s, u) {
      if ((t = (e.mode & 32) !== 0) && (t = false), t) {
        if (e.flags |= 16777216, (u & 335544128) === u) if (e.stateNode.complete) e.flags |= 8192;
        else if (lp()) e.flags |= 8192;
        else throw Oa = Hs, Jc;
      } else e.flags &= -16777217;
    }
    function Ag(e, t) {
      if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
      else if (e.flags |= 16777216, !Gp(t)) if (lp()) e.flags |= 8192;
      else throw Oa = Hs, Jc;
    }
    function ti(e, t) {
      t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? wa() : 536870912, e.lanes |= t, _r |= t);
    }
    function wo(e, t) {
      if (!We) switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var r = null; t !== null; ) t.alternate !== null && (r = t), t = t.sibling;
          r === null ? e.tail = null : r.sibling = null;
          break;
        case "collapsed":
          r = e.tail;
          for (var s = null; r !== null; ) r.alternate !== null && (s = r), r = r.sibling;
          s === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : s.sibling = null;
      }
    }
    function _t(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, r = 0, s = 0;
      if (t) for (var u = e.child; u !== null; ) r |= u.lanes | u.childLanes, s |= u.subtreeFlags & 65011712, s |= u.flags & 65011712, u.return = e, u = u.sibling;
      else for (u = e.child; u !== null; ) r |= u.lanes | u.childLanes, s |= u.subtreeFlags, s |= u.flags, u.return = e, u = u.sibling;
      return e.subtreeFlags |= s, e.childLanes = r, t;
    }
    function iw(e, t, r) {
      var s = t.pendingProps;
      switch (Vc(t), t.tag) {
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
          return r = t.stateNode, s = null, e !== null && (s = e.memoizedState.cache), t.memoizedState.cache !== s && (t.flags |= 2048), Sl(Bt), z(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (hr(t) ? _l(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Gc())), _t(t), null;
        case 26:
          var u = t.type, m = t.memoizedState;
          return e === null ? (_l(t), m !== null ? (_t(t), Ag(t, m)) : (_t(t), Du(t, u, null, s, r))) : m ? m !== e.memoizedState ? (_l(t), _t(t), Ag(t, m)) : (_t(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== s && _l(t), _t(t), Du(t, u, e, s, r)), null;
        case 27:
          if (de(t), r = se.current, u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== s && _l(t);
          else {
            if (!s) {
              if (t.stateNode === null) throw Error(o(166));
              return _t(t), null;
            }
            e = W.current, hr(t) ? um(t) : (e = Hp(u, s, r), t.stateNode = e, _l(t));
          }
          return _t(t), null;
        case 5:
          if (de(t), u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== s && _l(t);
          else {
            if (!s) {
              if (t.stateNode === null) throw Error(o(166));
              return _t(t), null;
            }
            if (m = W.current, hr(t)) um(t);
            else {
              var w = pi(se.current);
              switch (m) {
                case 1:
                  m = w.createElementNS("http://www.w3.org/2000/svg", u);
                  break;
                case 2:
                  m = w.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                  break;
                default:
                  switch (u) {
                    case "svg":
                      m = w.createElementNS("http://www.w3.org/2000/svg", u);
                      break;
                    case "math":
                      m = w.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                      break;
                    case "script":
                      m = w.createElement("div"), m.innerHTML = "<script><\/script>", m = m.removeChild(m.firstChild);
                      break;
                    case "select":
                      m = typeof s.is == "string" ? w.createElement("select", {
                        is: s.is
                      }) : w.createElement("select"), s.multiple ? m.multiple = true : s.size && (m.size = s.size);
                      break;
                    default:
                      m = typeof s.is == "string" ? w.createElement(u, {
                        is: s.is
                      }) : w.createElement(u);
                  }
              }
              m[Lt] = t, m[tn] = s;
              e: for (w = t.child; w !== null; ) {
                if (w.tag === 5 || w.tag === 6) m.appendChild(w.stateNode);
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
              t.stateNode = m;
              e: switch (en(m, u, s), u) {
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
              s && _l(t);
            }
          }
          return _t(t), Du(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, r), null;
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== s && _l(t);
          else {
            if (typeof s != "string" && t.stateNode === null) throw Error(o(166));
            if (e = se.current, hr(t)) {
              if (e = t.stateNode, r = t.memoizedProps, s = null, u = Qt, u !== null) switch (u.tag) {
                case 27:
                case 5:
                  s = u.memoizedProps;
              }
              e[Lt] = t, e = !!(e.nodeValue === r || s !== null && s.suppressHydrationWarning === true || Mp(e.nodeValue, r)), e || Vl(t, true);
            } else e = pi(e).createTextNode(s), e[Lt] = t, t.stateNode = e;
          }
          return _t(t), null;
        case 31:
          if (r = t.memoizedState, e === null || e.memoizedState !== null) {
            if (s = hr(t), r !== null) {
              if (e === null) {
                if (!s) throw Error(o(318));
                if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
                e[Lt] = t;
              } else La(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              _t(t), e = false;
            } else r = Gc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = r), e = true;
            if (!e) return t.flags & 256 ? (En(t), t) : (En(t), null);
            if ((t.flags & 128) !== 0) throw Error(o(558));
          }
          return _t(t), null;
        case 13:
          if (s = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            if (u = hr(t), s !== null && s.dehydrated !== null) {
              if (e === null) {
                if (!u) throw Error(o(318));
                if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(o(317));
                u[Lt] = t;
              } else La(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              _t(t), u = false;
            } else u = Gc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = u), u = true;
            if (!u) return t.flags & 256 ? (En(t), t) : (En(t), null);
          }
          return En(t), (t.flags & 128) !== 0 ? (t.lanes = r, t) : (r = s !== null, e = e !== null && e.memoizedState !== null, r && (s = t.child, u = null, s.alternate !== null && s.alternate.memoizedState !== null && s.alternate.memoizedState.cachePool !== null && (u = s.alternate.memoizedState.cachePool.pool), m = null, s.memoizedState !== null && s.memoizedState.cachePool !== null && (m = s.memoizedState.cachePool.pool), m !== u && (s.flags |= 2048)), r !== e && r && (t.child.flags |= 8192), ti(t, t.updateQueue), _t(t), null);
        case 4:
          return z(), e === null && ad(t.stateNode.containerInfo), _t(t), null;
        case 10:
          return Sl(t.type), _t(t), null;
        case 19:
          if (I(Dt), s = t.memoizedState, s === null) return _t(t), null;
          if (u = (t.flags & 128) !== 0, m = s.rendering, m === null) if (u) wo(s, false);
          else {
            if (Tt !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
              if (m = Us(e), m !== null) {
                for (t.flags |= 128, wo(s, false), e = m.updateQueue, t.updateQueue = e, ti(t, e), t.subtreeFlags = 0, e = r, r = t.child; r !== null; ) rm(r, e), r = r.sibling;
                return Z(Dt, Dt.current & 1 | 2), We && xl(t, s.treeForkCount), t.child;
              }
              e = e.sibling;
            }
            s.tail !== null && ft() > oi && (t.flags |= 128, u = true, wo(s, false), t.lanes = 4194304);
          }
          else {
            if (!u) if (e = Us(m), e !== null) {
              if (t.flags |= 128, u = true, e = e.updateQueue, t.updateQueue = e, ti(t, e), wo(s, true), s.tail === null && s.tailMode === "hidden" && !m.alternate && !We) return _t(t), null;
            } else 2 * ft() - s.renderingStartTime > oi && r !== 536870912 && (t.flags |= 128, u = true, wo(s, false), t.lanes = 4194304);
            s.isBackwards ? (m.sibling = t.child, t.child = m) : (e = s.last, e !== null ? e.sibling = m : t.child = m, s.last = m);
          }
          return s.tail !== null ? (e = s.tail, s.rendering = e, s.tail = e.sibling, s.renderingStartTime = ft(), e.sibling = null, r = Dt.current, Z(Dt, u ? r & 1 | 2 : r & 1), We && xl(t, s.treeForkCount), e) : (_t(t), null);
        case 22:
        case 23:
          return En(t), ru(), s = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== s && (t.flags |= 8192) : s && (t.flags |= 8192), s ? (r & 536870912) !== 0 && (t.flags & 128) === 0 && (_t(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : _t(t), r = t.updateQueue, r !== null && ti(t, r.retryQueue), r = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (r = e.memoizedState.cachePool.pool), s = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (s = t.memoizedState.cachePool.pool), s !== r && (t.flags |= 2048), e !== null && I(Na), null;
        case 24:
          return r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Sl(Bt), _t(t), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(o(156, t.tag));
    }
    function cw(e, t) {
      switch (Vc(t), t.tag) {
        case 1:
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 3:
          return Sl(Bt), z(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
        case 26:
        case 27:
        case 5:
          return de(t), null;
        case 31:
          if (t.memoizedState !== null) {
            if (En(t), t.alternate === null) throw Error(o(340));
            La();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 13:
          if (En(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
            if (t.alternate === null) throw Error(o(340));
            La();
          }
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 19:
          return I(Dt), null;
        case 4:
          return z(), null;
        case 10:
          return Sl(t.type), null;
        case 22:
        case 23:
          return En(t), ru(), e !== null && I(Na), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 24:
          return Sl(Bt), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Ng(e, t) {
      switch (Vc(t), t.tag) {
        case 3:
          Sl(Bt), z();
          break;
        case 26:
        case 27:
        case 5:
          de(t);
          break;
        case 4:
          z();
          break;
        case 31:
          t.memoizedState !== null && En(t);
          break;
        case 13:
          En(t);
          break;
        case 19:
          I(Dt);
          break;
        case 10:
          Sl(t.type);
          break;
        case 22:
        case 23:
          En(t), ru(), e !== null && I(Na);
          break;
        case 24:
          Sl(Bt);
      }
    }
    function So(e, t) {
      try {
        var r = t.updateQueue, s = r !== null ? r.lastEffect : null;
        if (s !== null) {
          var u = s.next;
          r = u;
          do {
            if ((r.tag & e) === e) {
              s = void 0;
              var m = r.create, w = r.inst;
              s = m(), w.destroy = s;
            }
            r = r.next;
          } while (r !== u);
        }
      } catch (M) {
        gt(t, t.return, M);
      }
    }
    function Ql(e, t, r) {
      try {
        var s = t.updateQueue, u = s !== null ? s.lastEffect : null;
        if (u !== null) {
          var m = u.next;
          s = m;
          do {
            if ((s.tag & e) === e) {
              var w = s.inst, M = w.destroy;
              if (M !== void 0) {
                w.destroy = void 0, u = t;
                var X = r, F = M;
                try {
                  F();
                } catch (ae) {
                  gt(u, X, ae);
                }
              }
            }
            s = s.next;
          } while (s !== m);
        }
      } catch (ae) {
        gt(t, t.return, ae);
      }
    }
    function Tg(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var r = e.stateNode;
        try {
          Cm(t, r);
        } catch (s) {
          gt(e, e.return, s);
        }
      }
    }
    function Og(e, t, r) {
      r.props = za(e.type, e.memoizedProps), r.state = e.memoizedState;
      try {
        r.componentWillUnmount();
      } catch (s) {
        gt(e, t, s);
      }
    }
    function Co(e, t) {
      try {
        var r = e.ref;
        if (r !== null) {
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
          typeof r == "function" ? e.refCleanup = r(s) : r.current = s;
        }
      } catch (u) {
        gt(e, t, u);
      }
    }
    function ol(e, t) {
      var r = e.ref, s = e.refCleanup;
      if (r !== null) if (typeof s == "function") try {
        s();
      } catch (u) {
        gt(e, t, u);
      } finally {
        e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
      }
      else if (typeof r == "function") try {
        r(null);
      } catch (u) {
        gt(e, t, u);
      }
      else r.current = null;
    }
    function Ig(e) {
      var t = e.type, r = e.memoizedProps, s = e.stateNode;
      try {
        e: switch (t) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            r.autoFocus && s.focus();
            break e;
          case "img":
            r.src ? s.src = r.src : r.srcSet && (s.srcset = r.srcSet);
        }
      } catch (u) {
        gt(e, e.return, u);
      }
    }
    function zu(e, t, r) {
      try {
        var s = e.stateNode;
        Aw(s, e.type, r, t), s[tn] = t;
      } catch (u) {
        gt(e, e.return, u);
      }
    }
    function Dg(e) {
      return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && aa(e.type) || e.tag === 4;
    }
    function Hu(e) {
      e: for (; ; ) {
        for (; e.sibling === null; ) {
          if (e.return === null || Dg(e.return)) return null;
          e = e.return;
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
          if (e.tag === 27 && aa(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
          e.child.return = e, e = e.child;
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Yu(e, t, r) {
      var s = e.tag;
      if (s === 5 || s === 6) e = e.stateNode, t ? (r.nodeType === 9 ? r.body : r.nodeName === "HTML" ? r.ownerDocument.body : r).insertBefore(e, t) : (t = r.nodeType === 9 ? r.body : r.nodeName === "HTML" ? r.ownerDocument.body : r, t.appendChild(e), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = yl));
      else if (s !== 4 && (s === 27 && aa(e.type) && (r = e.stateNode, t = null), e = e.child, e !== null)) for (Yu(e, t, r), e = e.sibling; e !== null; ) Yu(e, t, r), e = e.sibling;
    }
    function ni(e, t, r) {
      var s = e.tag;
      if (s === 5 || s === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e);
      else if (s !== 4 && (s === 27 && aa(e.type) && (r = e.stateNode), e = e.child, e !== null)) for (ni(e, t, r), e = e.sibling; e !== null; ) ni(e, t, r), e = e.sibling;
    }
    function zg(e) {
      var t = e.stateNode, r = e.memoizedProps;
      try {
        for (var s = e.type, u = t.attributes; u.length; ) t.removeAttributeNode(u[0]);
        en(t, s, r), t[Lt] = e, t[tn] = r;
      } catch (m) {
        gt(e, e.return, m);
      }
    }
    var Ml = false, $t = false, Bu = false, Hg = typeof WeakSet == "function" ? WeakSet : Set, Pt = null;
    function uw(e, t) {
      if (e = e.containerInfo, sd = Ci, e = Fh(e), Tc(e)) {
        if ("selectionStart" in e) var r = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
        else e: {
          r = (r = e.ownerDocument) && r.defaultView || window;
          var s = r.getSelection && r.getSelection();
          if (s && s.rangeCount !== 0) {
            r = s.anchorNode;
            var u = s.anchorOffset, m = s.focusNode;
            s = s.focusOffset;
            try {
              r.nodeType, m.nodeType;
            } catch {
              r = null;
              break e;
            }
            var w = 0, M = -1, X = -1, F = 0, ae = 0, ce = e, Q = null;
            t: for (; ; ) {
              for (var ne; ce !== r || u !== 0 && ce.nodeType !== 3 || (M = w + u), ce !== m || s !== 0 && ce.nodeType !== 3 || (X = w + s), ce.nodeType === 3 && (w += ce.nodeValue.length), (ne = ce.firstChild) !== null; ) Q = ce, ce = ne;
              for (; ; ) {
                if (ce === e) break t;
                if (Q === r && ++F === u && (M = w), Q === m && ++ae === s && (X = w), (ne = ce.nextSibling) !== null) break;
                ce = Q, Q = ce.parentNode;
              }
              ce = ne;
            }
            r = M === -1 || X === -1 ? null : {
              start: M,
              end: X
            };
          } else r = null;
        }
        r = r || {
          start: 0,
          end: 0
        };
      } else r = null;
      for (id = {
        focusedElem: e,
        selectionRange: r
      }, Ci = false, Pt = t; Pt !== null; ) if (t = Pt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, Pt = e;
      else for (; Pt !== null; ) {
        switch (t = Pt, m = t.alternate, e = t.flags, t.tag) {
          case 0:
            if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null)) for (r = 0; r < e.length; r++) u = e[r], u.ref.impl = u.nextImpl;
            break;
          case 11:
          case 15:
            break;
          case 1:
            if ((e & 1024) !== 0 && m !== null) {
              e = void 0, r = t, u = m.memoizedProps, m = m.memoizedState, s = r.stateNode;
              try {
                var ke = za(r.type, u);
                e = s.getSnapshotBeforeUpdate(ke, m), s.__reactInternalSnapshotBeforeUpdate = e;
              } catch (Re) {
                gt(r, r.return, Re);
              }
            }
            break;
          case 3:
            if ((e & 1024) !== 0) {
              if (e = t.stateNode.containerInfo, r = e.nodeType, r === 9) dd(e);
              else if (r === 1) switch (e.nodeName) {
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
          e.return = t.return, Pt = e;
          break;
        }
        Pt = t.return;
      }
    }
    function Yg(e, t, r) {
      var s = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          Ll(e, r), s & 4 && So(5, r);
          break;
        case 1:
          if (Ll(e, r), s & 4) if (e = r.stateNode, t === null) try {
            e.componentDidMount();
          } catch (w) {
            gt(r, r.return, w);
          }
          else {
            var u = za(r.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(u, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (w) {
              gt(r, r.return, w);
            }
          }
          s & 64 && Tg(r), s & 512 && Co(r, r.return);
          break;
        case 3:
          if (Ll(e, r), s & 64 && (e = r.updateQueue, e !== null)) {
            if (t = null, r.child !== null) switch (r.child.tag) {
              case 27:
              case 5:
                t = r.child.stateNode;
                break;
              case 1:
                t = r.child.stateNode;
            }
            try {
              Cm(e, t);
            } catch (w) {
              gt(r, r.return, w);
            }
          }
          break;
        case 27:
          t === null && s & 4 && zg(r);
        case 26:
        case 5:
          Ll(e, r), t === null && s & 4 && Ig(r), s & 512 && Co(r, r.return);
          break;
        case 12:
          Ll(e, r);
          break;
        case 31:
          Ll(e, r), s & 4 && Ug(e, r);
          break;
        case 13:
          Ll(e, r), s & 4 && $g(e, r), s & 64 && (e = r.memoizedState, e !== null && (e = e.dehydrated, e !== null && (r = vw.bind(null, r), Yw(e, r))));
          break;
        case 22:
          if (s = r.memoizedState !== null || Ml, !s) {
            t = t !== null && t.memoizedState !== null || $t, u = Ml;
            var m = $t;
            Ml = s, ($t = t) && !m ? Rl(e, r, (r.subtreeFlags & 8772) !== 0) : Ll(e, r), Ml = u, $t = m;
          }
          break;
        case 30:
          break;
        default:
          Ll(e, r);
      }
    }
    function Bg(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Bg(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && it(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
    }
    var Rt = null, gn = false;
    function jl(e, t, r) {
      for (r = r.child; r !== null; ) Xg(e, t, r), r = r.sibling;
    }
    function Xg(e, t, r) {
      if (Ct && typeof Ct.onCommitFiberUnmount == "function") try {
        Ct.onCommitFiberUnmount(Kt, r);
      } catch {
      }
      switch (r.tag) {
        case 26:
          $t || ol(r, t), jl(e, t, r), r.memoizedState ? r.memoizedState.count-- : r.stateNode && (r = r.stateNode, r.parentNode.removeChild(r));
          break;
        case 27:
          $t || ol(r, t);
          var s = Rt, u = gn;
          aa(r.type) && (Rt = r.stateNode, gn = false), jl(e, t, r), No(r.stateNode), Rt = s, gn = u;
          break;
        case 5:
          $t || ol(r, t);
        case 6:
          if (s = Rt, u = gn, Rt = null, jl(e, t, r), Rt = s, gn = u, Rt !== null) if (gn) try {
            (Rt.nodeType === 9 ? Rt.body : Rt.nodeName === "HTML" ? Rt.ownerDocument.body : Rt).removeChild(r.stateNode);
          } catch (m) {
            gt(r, t, m);
          }
          else try {
            Rt.removeChild(r.stateNode);
          } catch (m) {
            gt(r, t, m);
          }
          break;
        case 18:
          Rt !== null && (gn ? (e = Rt, Tp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, r.stateNode), Or(e)) : Tp(Rt, r.stateNode));
          break;
        case 4:
          s = Rt, u = gn, Rt = r.stateNode.containerInfo, gn = true, jl(e, t, r), Rt = s, gn = u;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          Ql(2, r, t), $t || Ql(4, r, t), jl(e, t, r);
          break;
        case 1:
          $t || (ol(r, t), s = r.stateNode, typeof s.componentWillUnmount == "function" && Og(r, t, s)), jl(e, t, r);
          break;
        case 21:
          jl(e, t, r);
          break;
        case 22:
          $t = (s = $t) || r.memoizedState !== null, jl(e, t, r), $t = s;
          break;
        default:
          jl(e, t, r);
      }
    }
    function Ug(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
        e = e.dehydrated;
        try {
          Or(e);
        } catch (r) {
          gt(t, t.return, r);
        }
      }
    }
    function $g(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
        Or(e);
      } catch (r) {
        gt(t, t.return, r);
      }
    }
    function dw(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return t === null && (t = e.stateNode = new Hg()), t;
        case 22:
          return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Hg()), t;
        default:
          throw Error(o(435, e.tag));
      }
    }
    function li(e, t) {
      var r = dw(e);
      t.forEach(function(s) {
        if (!r.has(s)) {
          r.add(s);
          var u = xw.bind(null, e, s);
          s.then(u, u);
        }
      });
    }
    function pn(e, t) {
      var r = t.deletions;
      if (r !== null) for (var s = 0; s < r.length; s++) {
        var u = r[s], m = e, w = t, M = w;
        e: for (; M !== null; ) {
          switch (M.tag) {
            case 27:
              if (aa(M.type)) {
                Rt = M.stateNode, gn = false;
                break e;
              }
              break;
            case 5:
              Rt = M.stateNode, gn = false;
              break e;
            case 3:
            case 4:
              Rt = M.stateNode.containerInfo, gn = true;
              break e;
          }
          M = M.return;
        }
        if (Rt === null) throw Error(o(160));
        Xg(m, w, u), Rt = null, gn = false, m = u.alternate, m !== null && (m.return = null), u.return = null;
      }
      if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) Vg(t, e), t = t.sibling;
    }
    var Zn = null;
    function Vg(e, t) {
      var r = e.alternate, s = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          pn(t, e), yn(e), s & 4 && (Ql(3, e, e.return), So(3, e), Ql(5, e, e.return));
          break;
        case 1:
          pn(t, e), yn(e), s & 512 && ($t || r === null || ol(r, r.return)), s & 64 && Ml && (e = e.updateQueue, e !== null && (s = e.callbacks, s !== null && (r = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = r === null ? s : r.concat(s))));
          break;
        case 26:
          var u = Zn;
          if (pn(t, e), yn(e), s & 512 && ($t || r === null || ol(r, r.return)), s & 4) {
            var m = r !== null ? r.memoizedState : null;
            if (s = e.memoizedState, r === null) if (s === null) if (e.stateNode === null) {
              e: {
                s = e.type, r = e.memoizedProps, u = u.ownerDocument || u;
                t: switch (s) {
                  case "title":
                    m = u.getElementsByTagName("title")[0], (!m || m[Te] || m[Lt] || m.namespaceURI === "http://www.w3.org/2000/svg" || m.hasAttribute("itemprop")) && (m = u.createElement(s), u.head.insertBefore(m, u.querySelector("head > title"))), en(m, s, r), m[Lt] = e, Ne(m), s = m;
                    break e;
                  case "link":
                    var w = Vp("link", "href", u).get(s + (r.href || ""));
                    if (w) {
                      for (var M = 0; M < w.length; M++) if (m = w[M], m.getAttribute("href") === (r.href == null || r.href === "" ? null : r.href) && m.getAttribute("rel") === (r.rel == null ? null : r.rel) && m.getAttribute("title") === (r.title == null ? null : r.title) && m.getAttribute("crossorigin") === (r.crossOrigin == null ? null : r.crossOrigin)) {
                        w.splice(M, 1);
                        break t;
                      }
                    }
                    m = u.createElement(s), en(m, s, r), u.head.appendChild(m);
                    break;
                  case "meta":
                    if (w = Vp("meta", "content", u).get(s + (r.content || ""))) {
                      for (M = 0; M < w.length; M++) if (m = w[M], m.getAttribute("content") === (r.content == null ? null : "" + r.content) && m.getAttribute("name") === (r.name == null ? null : r.name) && m.getAttribute("property") === (r.property == null ? null : r.property) && m.getAttribute("http-equiv") === (r.httpEquiv == null ? null : r.httpEquiv) && m.getAttribute("charset") === (r.charSet == null ? null : r.charSet)) {
                        w.splice(M, 1);
                        break t;
                      }
                    }
                    m = u.createElement(s), en(m, s, r), u.head.appendChild(m);
                    break;
                  default:
                    throw Error(o(468, s));
                }
                m[Lt] = e, Ne(m), s = m;
              }
              e.stateNode = s;
            } else qp(u, e.type, e.stateNode);
            else e.stateNode = $p(u, s, e.memoizedProps);
            else m !== s ? (m === null ? r.stateNode !== null && (r = r.stateNode, r.parentNode.removeChild(r)) : m.count--, s === null ? qp(u, e.type, e.stateNode) : $p(u, s, e.memoizedProps)) : s === null && e.stateNode !== null && zu(e, e.memoizedProps, r.memoizedProps);
          }
          break;
        case 27:
          pn(t, e), yn(e), s & 512 && ($t || r === null || ol(r, r.return)), r !== null && s & 4 && zu(e, e.memoizedProps, r.memoizedProps);
          break;
        case 5:
          if (pn(t, e), yn(e), s & 512 && ($t || r === null || ol(r, r.return)), e.flags & 32) {
            u = e.stateNode;
            try {
              lr(u, "");
            } catch (ke) {
              gt(e, e.return, ke);
            }
          }
          s & 4 && e.stateNode != null && (u = e.memoizedProps, zu(e, u, r !== null ? r.memoizedProps : u)), s & 1024 && (Bu = true);
          break;
        case 6:
          if (pn(t, e), yn(e), s & 4) {
            if (e.stateNode === null) throw Error(o(162));
            s = e.memoizedProps, r = e.stateNode;
            try {
              r.nodeValue = s;
            } catch (ke) {
              gt(e, e.return, ke);
            }
          }
          break;
        case 3:
          if (vi = null, u = Zn, Zn = yi(t.containerInfo), pn(t, e), Zn = u, yn(e), s & 4 && r !== null && r.memoizedState.isDehydrated) try {
            Or(t.containerInfo);
          } catch (ke) {
            gt(e, e.return, ke);
          }
          Bu && (Bu = false, qg(e));
          break;
        case 4:
          s = Zn, Zn = yi(e.stateNode.containerInfo), pn(t, e), yn(e), Zn = s;
          break;
        case 12:
          pn(t, e), yn(e);
          break;
        case 31:
          pn(t, e), yn(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, li(e, s)));
          break;
        case 13:
          pn(t, e), yn(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (ri = ft()), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, li(e, s)));
          break;
        case 22:
          u = e.memoizedState !== null;
          var X = r !== null && r.memoizedState !== null, F = Ml, ae = $t;
          if (Ml = F || u, $t = ae || X, pn(t, e), $t = ae, Ml = F, yn(e), s & 8192) e: for (t = e.stateNode, t._visibility = u ? t._visibility & -2 : t._visibility | 1, u && (r === null || X || Ml || $t || Ha(e)), r = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (r === null) {
                X = r = t;
                try {
                  if (m = X.stateNode, u) w = m.style, typeof w.setProperty == "function" ? w.setProperty("display", "none", "important") : w.display = "none";
                  else {
                    M = X.stateNode;
                    var ce = X.memoizedProps.style, Q = ce != null && ce.hasOwnProperty("display") ? ce.display : null;
                    M.style.display = Q == null || typeof Q == "boolean" ? "" : ("" + Q).trim();
                  }
                } catch (ke) {
                  gt(X, X.return, ke);
                }
              }
            } else if (t.tag === 6) {
              if (r === null) {
                X = t;
                try {
                  X.stateNode.nodeValue = u ? "" : X.memoizedProps;
                } catch (ke) {
                  gt(X, X.return, ke);
                }
              }
            } else if (t.tag === 18) {
              if (r === null) {
                X = t;
                try {
                  var ne = X.stateNode;
                  u ? Op(ne, true) : Op(X.stateNode, false);
                } catch (ke) {
                  gt(X, X.return, ke);
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
          s & 4 && (s = e.updateQueue, s !== null && (r = s.retryQueue, r !== null && (s.retryQueue = null, li(e, r))));
          break;
        case 19:
          pn(t, e), yn(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, li(e, s)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          pn(t, e), yn(e);
      }
    }
    function yn(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var r, s = e.return; s !== null; ) {
            if (Dg(s)) {
              r = s;
              break;
            }
            s = s.return;
          }
          if (r == null) throw Error(o(160));
          switch (r.tag) {
            case 27:
              var u = r.stateNode, m = Hu(e);
              ni(e, m, u);
              break;
            case 5:
              var w = r.stateNode;
              r.flags & 32 && (lr(w, ""), r.flags &= -33);
              var M = Hu(e);
              ni(e, M, w);
              break;
            case 3:
            case 4:
              var X = r.stateNode.containerInfo, F = Hu(e);
              Yu(e, F, X);
              break;
            default:
              throw Error(o(161));
          }
        } catch (ae) {
          gt(e, e.return, ae);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function qg(e) {
      if (e.subtreeFlags & 1024) for (e = e.child; e !== null; ) {
        var t = e;
        qg(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
    }
    function Ll(e, t) {
      if (t.subtreeFlags & 8772) for (t = t.child; t !== null; ) Yg(e, t.alternate, t), t = t.sibling;
    }
    function Ha(e) {
      for (e = e.child; e !== null; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            Ql(4, t, t.return), Ha(t);
            break;
          case 1:
            ol(t, t.return);
            var r = t.stateNode;
            typeof r.componentWillUnmount == "function" && Og(t, t.return, r), Ha(t);
            break;
          case 27:
            No(t.stateNode);
          case 26:
          case 5:
            ol(t, t.return), Ha(t);
            break;
          case 22:
            t.memoizedState === null && Ha(t);
            break;
          case 30:
            Ha(t);
            break;
          default:
            Ha(t);
        }
        e = e.sibling;
      }
    }
    function Rl(e, t, r) {
      for (r = r && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
        var s = t.alternate, u = e, m = t, w = m.flags;
        switch (m.tag) {
          case 0:
          case 11:
          case 15:
            Rl(u, m, r), So(4, m);
            break;
          case 1:
            if (Rl(u, m, r), s = m, u = s.stateNode, typeof u.componentDidMount == "function") try {
              u.componentDidMount();
            } catch (F) {
              gt(s, s.return, F);
            }
            if (s = m, u = s.updateQueue, u !== null) {
              var M = s.stateNode;
              try {
                var X = u.shared.hiddenCallbacks;
                if (X !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < X.length; u++) Sm(X[u], M);
              } catch (F) {
                gt(s, s.return, F);
              }
            }
            r && w & 64 && Tg(m), Co(m, m.return);
            break;
          case 27:
            zg(m);
          case 26:
          case 5:
            Rl(u, m, r), r && s === null && w & 4 && Ig(m), Co(m, m.return);
            break;
          case 12:
            Rl(u, m, r);
            break;
          case 31:
            Rl(u, m, r), r && w & 4 && Ug(u, m);
            break;
          case 13:
            Rl(u, m, r), r && w & 4 && $g(u, m);
            break;
          case 22:
            m.memoizedState === null && Rl(u, m, r), Co(m, m.return);
            break;
          case 30:
            break;
          default:
            Rl(u, m, r);
        }
        t = t.sibling;
      }
    }
    function Xu(e, t) {
      var r = null;
      e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (r = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== r && (e != null && e.refCount++, r != null && io(r));
    }
    function Uu(e, t) {
      e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && io(e));
    }
    function Kn(e, t, r, s) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) Gg(e, t, r, s), t = t.sibling;
    }
    function Gg(e, t, r, s) {
      var u = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Kn(e, t, r, s), u & 2048 && So(9, t);
          break;
        case 1:
          Kn(e, t, r, s);
          break;
        case 3:
          Kn(e, t, r, s), u & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && io(e)));
          break;
        case 12:
          if (u & 2048) {
            Kn(e, t, r, s), e = t.stateNode;
            try {
              var m = t.memoizedProps, w = m.id, M = m.onPostCommit;
              typeof M == "function" && M(w, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
            } catch (X) {
              gt(t, t.return, X);
            }
          } else Kn(e, t, r, s);
          break;
        case 31:
          Kn(e, t, r, s);
          break;
        case 13:
          Kn(e, t, r, s);
          break;
        case 23:
          break;
        case 22:
          m = t.stateNode, w = t.alternate, t.memoizedState !== null ? m._visibility & 2 ? Kn(e, t, r, s) : Eo(e, t) : m._visibility & 2 ? Kn(e, t, r, s) : (m._visibility |= 2, Cr(e, t, r, s, (t.subtreeFlags & 10256) !== 0 || false)), u & 2048 && Xu(w, t);
          break;
        case 24:
          Kn(e, t, r, s), u & 2048 && Uu(t.alternate, t);
          break;
        default:
          Kn(e, t, r, s);
      }
    }
    function Cr(e, t, r, s, u) {
      for (u = u && ((t.subtreeFlags & 10256) !== 0 || false), t = t.child; t !== null; ) {
        var m = e, w = t, M = r, X = s, F = w.flags;
        switch (w.tag) {
          case 0:
          case 11:
          case 15:
            Cr(m, w, M, X, u), So(8, w);
            break;
          case 23:
            break;
          case 22:
            var ae = w.stateNode;
            w.memoizedState !== null ? ae._visibility & 2 ? Cr(m, w, M, X, u) : Eo(m, w) : (ae._visibility |= 2, Cr(m, w, M, X, u)), u && F & 2048 && Xu(w.alternate, w);
            break;
          case 24:
            Cr(m, w, M, X, u), u && F & 2048 && Uu(w.alternate, w);
            break;
          default:
            Cr(m, w, M, X, u);
        }
        t = t.sibling;
      }
    }
    function Eo(e, t) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) {
        var r = e, s = t, u = s.flags;
        switch (s.tag) {
          case 22:
            Eo(r, s), u & 2048 && Xu(s.alternate, s);
            break;
          case 24:
            Eo(r, s), u & 2048 && Uu(s.alternate, s);
            break;
          default:
            Eo(r, s);
        }
        t = t.sibling;
      }
    }
    var ko = 8192;
    function Er(e, t, r) {
      if (e.subtreeFlags & ko) for (e = e.child; e !== null; ) Pg(e, t, r), e = e.sibling;
    }
    function Pg(e, t, r) {
      switch (e.tag) {
        case 26:
          Er(e, t, r), e.flags & ko && e.memoizedState !== null && Qw(r, Zn, e.memoizedState, e.memoizedProps);
          break;
        case 5:
          Er(e, t, r);
          break;
        case 3:
        case 4:
          var s = Zn;
          Zn = yi(e.stateNode.containerInfo), Er(e, t, r), Zn = s;
          break;
        case 22:
          e.memoizedState === null && (s = e.alternate, s !== null && s.memoizedState !== null ? (s = ko, ko = 16777216, Er(e, t, r), ko = s) : Er(e, t, r));
          break;
        default:
          Er(e, t, r);
      }
    }
    function Zg(e) {
      var t = e.alternate;
      if (t !== null && (e = t.child, e !== null)) {
        t.child = null;
        do
          t = e.sibling, e.sibling = null, e = t;
        while (e !== null);
      }
    }
    function _o(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var r = 0; r < t.length; r++) {
          var s = t[r];
          Pt = s, Fg(s, e);
        }
        Zg(e);
      }
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) Kg(e), e = e.sibling;
    }
    function Kg(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          _o(e), e.flags & 2048 && Ql(9, e, e.return);
          break;
        case 3:
          _o(e);
          break;
        case 12:
          _o(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, ai(e)) : _o(e);
          break;
        default:
          _o(e);
      }
    }
    function ai(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var r = 0; r < t.length; r++) {
          var s = t[r];
          Pt = s, Fg(s, e);
        }
        Zg(e);
      }
      for (e = e.child; e !== null; ) {
        switch (t = e, t.tag) {
          case 0:
          case 11:
          case 15:
            Ql(8, t, t.return), ai(t);
            break;
          case 22:
            r = t.stateNode, r._visibility & 2 && (r._visibility &= -3, ai(t));
            break;
          default:
            ai(t);
        }
        e = e.sibling;
      }
    }
    function Fg(e, t) {
      for (; Pt !== null; ) {
        var r = Pt;
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            Ql(8, r, t);
            break;
          case 23:
          case 22:
            if (r.memoizedState !== null && r.memoizedState.cachePool !== null) {
              var s = r.memoizedState.cachePool.pool;
              s != null && s.refCount++;
            }
            break;
          case 24:
            io(r.memoizedState.cache);
        }
        if (s = r.child, s !== null) s.return = r, Pt = s;
        else e: for (r = e; Pt !== null; ) {
          s = Pt;
          var u = s.sibling, m = s.return;
          if (Bg(s), s === r) {
            Pt = null;
            break e;
          }
          if (u !== null) {
            u.return = m, Pt = u;
            break e;
          }
          Pt = m;
        }
      }
    }
    var fw = {
      getCacheForType: function(e) {
        var t = Wt(Bt), r = t.data.get(e);
        return r === void 0 && (r = e(), t.data.set(e, r)), r;
      },
      cacheSignal: function() {
        return Wt(Bt).controller.signal;
      }
    }, hw = typeof WeakMap == "function" ? WeakMap : Map, ot = 0, xt = null, Ge = null, Ke = 0, mt = 0, kn = null, Wl = false, kr = false, $u = false, Al = 0, Tt = 0, Jl = 0, Ya = 0, Vu = 0, _n = 0, _r = 0, Mo = null, bn = null, qu = false, ri = 0, Qg = 0, oi = 1 / 0, si = null, ea = null, Vt = 0, ta = null, Mr = null, Nl = 0, Gu = 0, Pu = null, Wg = null, jo = 0, Zu = null;
    function Mn() {
      return (ot & 2) !== 0 && Ke !== 0 ? Ke & -Ke : V.T !== null ? ed() : Zr();
    }
    function Jg() {
      if (_n === 0) if ((Ke & 536870912) === 0 || We) {
        var e = Fa;
        Fa <<= 1, (Fa & 3932160) === 0 && (Fa = 262144), _n = e;
      } else _n = 536870912;
      return e = Cn.current, e !== null && (e.flags |= 32), _n;
    }
    function vn(e, t, r) {
      (e === xt && (mt === 2 || mt === 9) || e.cancelPendingCommit !== null) && (jr(e, 0), na(e, Ke, _n, false)), dl(e, r), ((ot & 2) === 0 || e !== xt) && (e === xt && ((ot & 2) === 0 && (Ya |= r), Tt === 4 && na(e, Ke, _n, false)), sl(e));
    }
    function ep(e, t, r) {
      if ((ot & 6) !== 0) throw Error(o(327));
      var s = !r && (t & 127) === 0 && (t & e.expiredLanes) === 0 || xa(e, t), u = s ? pw(e, t) : Fu(e, t, true), m = s;
      do {
        if (u === 0) {
          kr && !s && na(e, t, 0, false);
          break;
        } else {
          if (r = e.current.alternate, m && !mw(r)) {
            u = Fu(e, t, false), m = false;
            continue;
          }
          if (u === 2) {
            if (m = t, e.errorRecoveryDisabledLanes & m) var w = 0;
            else w = e.pendingLanes & -536870913, w = w !== 0 ? w : w & 536870912 ? 536870912 : 0;
            if (w !== 0) {
              t = w;
              e: {
                var M = e;
                u = Mo;
                var X = M.current.memoizedState.isDehydrated;
                if (X && (jr(M, w).flags |= 256), w = Fu(M, w, false), w !== 2) {
                  if ($u && !X) {
                    M.errorRecoveryDisabledLanes |= m, Ya |= m, u = 4;
                    break e;
                  }
                  m = bn, bn = u, m !== null && (bn === null ? bn = m : bn.push.apply(bn, m));
                }
                u = w;
              }
              if (m = false, u !== 2) continue;
            }
          }
          if (u === 1) {
            jr(e, 0), na(e, t, 0, true);
            break;
          }
          e: {
            switch (s = e, m = u, m) {
              case 0:
              case 1:
                throw Error(o(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                na(s, t, _n, !Wl);
                break e;
              case 2:
                bn = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(o(329));
            }
            if ((t & 62914560) === t && (u = ri + 300 - ft(), 10 < u)) {
              if (na(s, t, _n, !Wl), va(s, 0, true) !== 0) break e;
              Nl = t, s.timeoutHandle = Ap(tp.bind(null, s, r, bn, si, qu, t, _n, Ya, _r, Wl, m, "Throttled", -0, 0), u);
              break e;
            }
            tp(s, r, bn, si, qu, t, _n, Ya, _r, Wl, m, null, -0, 0);
          }
        }
        break;
      } while (true);
      sl(e);
    }
    function tp(e, t, r, s, u, m, w, M, X, F, ae, ce, Q, ne) {
      if (e.timeoutHandle = -1, ce = t.subtreeFlags, ce & 8192 || (ce & 16785408) === 16785408) {
        ce = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: true,
          waitingForViewTransition: false,
          unsuspend: yl
        }, Pg(t, m, ce);
        var ke = (m & 62914560) === m ? ri - ft() : (m & 4194048) === m ? Qg - ft() : 0;
        if (ke = Ww(ce, ke), ke !== null) {
          Nl = m, e.cancelPendingCommit = ke(cp.bind(null, e, t, m, r, s, u, w, M, X, ae, ce, null, Q, ne)), na(e, m, w, !F);
          return;
        }
      }
      cp(e, t, m, r, s, u, w, M, X);
    }
    function mw(e) {
      for (var t = e; ; ) {
        var r = t.tag;
        if ((r === 0 || r === 11 || r === 15) && t.flags & 16384 && (r = t.updateQueue, r !== null && (r = r.stores, r !== null))) for (var s = 0; s < r.length; s++) {
          var u = r[s], m = u.getSnapshot;
          u = u.value;
          try {
            if (!wn(m(), u)) return false;
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
    function na(e, t, r, s) {
      t &= ~Vu, t &= ~Ya, e.suspendedLanes |= t, e.pingedLanes &= ~t, s && (e.warmLanes |= t), s = e.expirationTimes;
      for (var u = t; 0 < u; ) {
        var m = 31 - Ht(u), w = 1 << m;
        s[m] = -1, u &= ~w;
      }
      r !== 0 && Qa(e, r, t);
    }
    function ii() {
      return (ot & 6) === 0 ? (Lo(0), false) : true;
    }
    function Ku() {
      if (Ge !== null) {
        if (mt === 0) var e = Ge.return;
        else e = Ge, wl = Ra = null, du(e), br = null, uo = 0, e = Ge;
        for (; e !== null; ) Ng(e.alternate, e), e = e.return;
        Ge = null;
      }
    }
    function jr(e, t) {
      var r = e.timeoutHandle;
      r !== -1 && (e.timeoutHandle = -1, Ow(r)), r = e.cancelPendingCommit, r !== null && (e.cancelPendingCommit = null, r()), Nl = 0, Ku(), xt = e, Ge = r = vl(e.current, null), Ke = t, mt = 0, kn = null, Wl = false, kr = xa(e, t), $u = false, _r = _n = Vu = Ya = Jl = Tt = 0, bn = Mo = null, qu = false, (t & 8) !== 0 && (t |= t & 32);
      var s = e.entangledLanes;
      if (s !== 0) for (e = e.entanglements, s &= t; 0 < s; ) {
        var u = 31 - Ht(s), m = 1 << u;
        t |= e[u], s &= ~m;
      }
      return Al = t, Ls(), r;
    }
    function np(e, t) {
      Ue = null, V.H = vo, t === yr || t === zs ? (t = bm(), mt = 3) : t === Jc ? (t = bm(), mt = 4) : mt = t === Mu ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, kn = t, Ge === null && (Tt = 1, Qs(e, On(t, e.current)));
    }
    function lp() {
      var e = Cn.current;
      return e === null ? true : (Ke & 4194048) === Ke ? Hn === null : (Ke & 62914560) === Ke || (Ke & 536870912) !== 0 ? e === Hn : false;
    }
    function ap() {
      var e = V.H;
      return V.H = vo, e === null ? vo : e;
    }
    function rp() {
      var e = V.A;
      return V.A = fw, e;
    }
    function ci() {
      Tt = 4, Wl || (Ke & 4194048) !== Ke && Cn.current !== null || (kr = true), (Jl & 134217727) === 0 && (Ya & 134217727) === 0 || xt === null || na(xt, Ke, _n, false);
    }
    function Fu(e, t, r) {
      var s = ot;
      ot |= 2;
      var u = ap(), m = rp();
      (xt !== e || Ke !== t) && (si = null, jr(e, t)), t = false;
      var w = Tt;
      e: do
        try {
          if (mt !== 0 && Ge !== null) {
            var M = Ge, X = kn;
            switch (mt) {
              case 8:
                Ku(), w = 6;
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                Cn.current === null && (t = true);
                var F = mt;
                if (mt = 0, kn = null, Lr(e, M, X, F), r && kr) {
                  w = 0;
                  break e;
                }
                break;
              default:
                F = mt, mt = 0, kn = null, Lr(e, M, X, F);
            }
          }
          gw(), w = Tt;
          break;
        } catch (ae) {
          np(e, ae);
        }
      while (true);
      return t && e.shellSuspendCounter++, wl = Ra = null, ot = s, V.H = u, V.A = m, Ge === null && (xt = null, Ke = 0, Ls()), w;
    }
    function gw() {
      for (; Ge !== null; ) op(Ge);
    }
    function pw(e, t) {
      var r = ot;
      ot |= 2;
      var s = ap(), u = rp();
      xt !== e || Ke !== t ? (si = null, oi = ft() + 500, jr(e, t)) : kr = xa(e, t);
      e: do
        try {
          if (mt !== 0 && Ge !== null) {
            t = Ge;
            var m = kn;
            t: switch (mt) {
              case 1:
                mt = 0, kn = null, Lr(e, t, m, 1);
                break;
              case 2:
              case 9:
                if (pm(m)) {
                  mt = 0, kn = null, sp(t);
                  break;
                }
                t = function() {
                  mt !== 2 && mt !== 9 || xt !== e || (mt = 7), sl(e);
                }, m.then(t, t);
                break e;
              case 3:
                mt = 7;
                break e;
              case 4:
                mt = 5;
                break e;
              case 7:
                pm(m) ? (mt = 0, kn = null, sp(t)) : (mt = 0, kn = null, Lr(e, t, m, 7));
                break;
              case 5:
                var w = null;
                switch (Ge.tag) {
                  case 26:
                    w = Ge.memoizedState;
                  case 5:
                  case 27:
                    var M = Ge;
                    if (w ? Gp(w) : M.stateNode.complete) {
                      mt = 0, kn = null;
                      var X = M.sibling;
                      if (X !== null) Ge = X;
                      else {
                        var F = M.return;
                        F !== null ? (Ge = F, ui(F)) : Ge = null;
                      }
                      break t;
                    }
                }
                mt = 0, kn = null, Lr(e, t, m, 5);
                break;
              case 6:
                mt = 0, kn = null, Lr(e, t, m, 6);
                break;
              case 8:
                Ku(), Tt = 6;
                break e;
              default:
                throw Error(o(462));
            }
          }
          yw();
          break;
        } catch (ae) {
          np(e, ae);
        }
      while (true);
      return wl = Ra = null, V.H = s, V.A = u, ot = r, Ge !== null ? 0 : (xt = null, Ke = 0, Ls(), Tt);
    }
    function yw() {
      for (; Ge !== null && !vt(); ) op(Ge);
    }
    function op(e) {
      var t = Rg(e.alternate, e, Al);
      e.memoizedProps = e.pendingProps, t === null ? ui(e) : Ge = t;
    }
    function sp(e) {
      var t = e, r = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = Eg(r, t, t.pendingProps, t.type, void 0, Ke);
          break;
        case 11:
          t = Eg(r, t, t.pendingProps, t.type.render, t.ref, Ke);
          break;
        case 5:
          du(t);
        default:
          Ng(r, t), t = Ge = rm(t, Al), t = Rg(r, t, Al);
      }
      e.memoizedProps = e.pendingProps, t === null ? ui(e) : Ge = t;
    }
    function Lr(e, t, r, s) {
      wl = Ra = null, du(t), br = null, uo = 0;
      var u = t.return;
      try {
        if (rw(e, u, t, r, Ke)) {
          Tt = 1, Qs(e, On(r, e.current)), Ge = null;
          return;
        }
      } catch (m) {
        if (u !== null) throw Ge = u, m;
        Tt = 1, Qs(e, On(r, e.current)), Ge = null;
        return;
      }
      t.flags & 32768 ? (We || s === 1 ? e = true : kr || (Ke & 536870912) !== 0 ? e = false : (Wl = e = true, (s === 2 || s === 9 || s === 3 || s === 6) && (s = Cn.current, s !== null && s.tag === 13 && (s.flags |= 16384))), ip(t, e)) : ui(t);
    }
    function ui(e) {
      var t = e;
      do {
        if ((t.flags & 32768) !== 0) {
          ip(t, Wl);
          return;
        }
        e = t.return;
        var r = iw(t.alternate, t, Al);
        if (r !== null) {
          Ge = r;
          return;
        }
        if (t = t.sibling, t !== null) {
          Ge = t;
          return;
        }
        Ge = t = e;
      } while (t !== null);
      Tt === 0 && (Tt = 5);
    }
    function ip(e, t) {
      do {
        var r = cw(e.alternate, e);
        if (r !== null) {
          r.flags &= 32767, Ge = r;
          return;
        }
        if (r = e.return, r !== null && (r.flags |= 32768, r.subtreeFlags = 0, r.deletions = null), !t && (e = e.sibling, e !== null)) {
          Ge = e;
          return;
        }
        Ge = e = r;
      } while (e !== null);
      Tt = 6, Ge = null;
    }
    function cp(e, t, r, s, u, m, w, M, X) {
      e.cancelPendingCommit = null;
      do
        di();
      while (Vt !== 0);
      if ((ot & 6) !== 0) throw Error(o(327));
      if (t !== null) {
        if (t === e.current) throw Error(o(177));
        if (m = t.lanes | t.childLanes, m |= Hc, ys(e, r, m, w, M, X), e === xt && (Ge = xt = null, Ke = 0), Mr = t, ta = e, Nl = r, Gu = m, Pu = u, Wg = s, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, ww(An, function() {
          return mp(), null;
        })) : (e.callbackNode = null, e.callbackPriority = 0), s = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || s) {
          s = V.T, V.T = null, u = P.p, P.p = 2, w = ot, ot |= 4;
          try {
            uw(e, t, r);
          } finally {
            ot = w, P.p = u, V.T = s;
          }
        }
        Vt = 1, up(), dp(), fp();
      }
    }
    function up() {
      if (Vt === 1) {
        Vt = 0;
        var e = ta, t = Mr, r = (t.flags & 13878) !== 0;
        if ((t.subtreeFlags & 13878) !== 0 || r) {
          r = V.T, V.T = null;
          var s = P.p;
          P.p = 2;
          var u = ot;
          ot |= 4;
          try {
            Vg(t, e);
            var m = id, w = Fh(e.containerInfo), M = m.focusedElem, X = m.selectionRange;
            if (w !== M && M && M.ownerDocument && Kh(M.ownerDocument.documentElement, M)) {
              if (X !== null && Tc(M)) {
                var F = X.start, ae = X.end;
                if (ae === void 0 && (ae = F), "selectionStart" in M) M.selectionStart = F, M.selectionEnd = Math.min(ae, M.value.length);
                else {
                  var ce = M.ownerDocument || document, Q = ce && ce.defaultView || window;
                  if (Q.getSelection) {
                    var ne = Q.getSelection(), ke = M.textContent.length, Re = Math.min(X.start, ke), bt = X.end === void 0 ? Re : Math.min(X.end, ke);
                    !ne.extend && Re > bt && (w = bt, bt = Re, Re = w);
                    var q = Zh(M, Re), U = Zh(M, bt);
                    if (q && U && (ne.rangeCount !== 1 || ne.anchorNode !== q.node || ne.anchorOffset !== q.offset || ne.focusNode !== U.node || ne.focusOffset !== U.offset)) {
                      var K = ce.createRange();
                      K.setStart(q.node, q.offset), ne.removeAllRanges(), Re > bt ? (ne.addRange(K), ne.extend(U.node, U.offset)) : (K.setEnd(U.node, U.offset), ne.addRange(K));
                    }
                  }
                }
              }
              for (ce = [], ne = M; ne = ne.parentNode; ) ne.nodeType === 1 && ce.push({
                element: ne,
                left: ne.scrollLeft,
                top: ne.scrollTop
              });
              for (typeof M.focus == "function" && M.focus(), M = 0; M < ce.length; M++) {
                var ie = ce[M];
                ie.element.scrollLeft = ie.left, ie.element.scrollTop = ie.top;
              }
            }
            Ci = !!sd, id = sd = null;
          } finally {
            ot = u, P.p = s, V.T = r;
          }
        }
        e.current = t, Vt = 2;
      }
    }
    function dp() {
      if (Vt === 2) {
        Vt = 0;
        var e = ta, t = Mr, r = (t.flags & 8772) !== 0;
        if ((t.subtreeFlags & 8772) !== 0 || r) {
          r = V.T, V.T = null;
          var s = P.p;
          P.p = 2;
          var u = ot;
          ot |= 4;
          try {
            Yg(e, t.alternate, t);
          } finally {
            ot = u, P.p = s, V.T = r;
          }
        }
        Vt = 3;
      }
    }
    function fp() {
      if (Vt === 4 || Vt === 3) {
        Vt = 0, jt();
        var e = ta, t = Mr, r = Nl, s = Wg;
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Vt = 5 : (Vt = 0, Mr = ta = null, hp(e, e.pendingLanes));
        var u = e.pendingLanes;
        if (u === 0 && (ea = null), Pr(r), t = t.stateNode, Ct && typeof Ct.onCommitFiberRoot == "function") try {
          Ct.onCommitFiberRoot(Kt, t, void 0, (t.current.flags & 128) === 128);
        } catch {
        }
        if (s !== null) {
          t = V.T, u = P.p, P.p = 2, V.T = null;
          try {
            for (var m = e.onRecoverableError, w = 0; w < s.length; w++) {
              var M = s[w];
              m(M.value, {
                componentStack: M.stack
              });
            }
          } finally {
            V.T = t, P.p = u;
          }
        }
        (Nl & 3) !== 0 && di(), sl(e), u = e.pendingLanes, (r & 261930) !== 0 && (u & 42) !== 0 ? e === Zu ? jo++ : (jo = 0, Zu = e) : jo = 0, Lo(0);
      }
    }
    function hp(e, t) {
      (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, io(t)));
    }
    function di() {
      return up(), dp(), fp(), mp();
    }
    function mp() {
      if (Vt !== 5) return false;
      var e = ta, t = Gu;
      Gu = 0;
      var r = Pr(Nl), s = V.T, u = P.p;
      try {
        P.p = 32 > r ? 32 : r, V.T = null, r = Pu, Pu = null;
        var m = ta, w = Nl;
        if (Vt = 0, Mr = ta = null, Nl = 0, (ot & 6) !== 0) throw Error(o(331));
        var M = ot;
        if (ot |= 4, Kg(m.current), Gg(m, m.current, w, r), ot = M, Lo(0, false), Ct && typeof Ct.onPostCommitFiberRoot == "function") try {
          Ct.onPostCommitFiberRoot(Kt, m);
        } catch {
        }
        return true;
      } finally {
        P.p = u, V.T = s, hp(e, t);
      }
    }
    function gp(e, t, r) {
      t = On(r, t), t = _u(e.stateNode, t, 2), e = Zl(e, t, 2), e !== null && (dl(e, 2), sl(e));
    }
    function gt(e, t, r) {
      if (e.tag === 3) gp(e, e, r);
      else for (; t !== null; ) {
        if (t.tag === 3) {
          gp(t, e, r);
          break;
        } else if (t.tag === 1) {
          var s = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && (ea === null || !ea.has(s))) {
            e = On(r, e), r = pg(2), s = Zl(t, r, 2), s !== null && (yg(r, s, t, e), dl(s, 2), sl(s));
            break;
          }
        }
        t = t.return;
      }
    }
    function Qu(e, t, r) {
      var s = e.pingCache;
      if (s === null) {
        s = e.pingCache = new hw();
        var u = /* @__PURE__ */ new Set();
        s.set(t, u);
      } else u = s.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), s.set(t, u));
      u.has(r) || ($u = true, u.add(r), e = bw.bind(null, e, t, r), t.then(e, e));
    }
    function bw(e, t, r) {
      var s = e.pingCache;
      s !== null && s.delete(t), e.pingedLanes |= e.suspendedLanes & r, e.warmLanes &= ~r, xt === e && (Ke & r) === r && (Tt === 4 || Tt === 3 && (Ke & 62914560) === Ke && 300 > ft() - ri ? (ot & 2) === 0 && jr(e, 0) : Vu |= r, _r === Ke && (_r = 0)), sl(e);
    }
    function pp(e, t) {
      t === 0 && (t = wa()), e = Ma(e, t), e !== null && (dl(e, t), sl(e));
    }
    function vw(e) {
      var t = e.memoizedState, r = 0;
      t !== null && (r = t.retryLane), pp(e, r);
    }
    function xw(e, t) {
      var r = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var s = e.stateNode, u = e.memoizedState;
          u !== null && (r = u.retryLane);
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
      s !== null && s.delete(t), pp(e, r);
    }
    function ww(e, t) {
      return Qe(e, t);
    }
    var fi = null, Rr = null, Wu = false, hi = false, Ju = false, la = 0;
    function sl(e) {
      e !== Rr && e.next === null && (Rr === null ? fi = Rr = e : Rr = Rr.next = e), hi = true, Wu || (Wu = true, Cw());
    }
    function Lo(e, t) {
      if (!Ju && hi) {
        Ju = true;
        do
          for (var r = false, s = fi; s !== null; ) {
            if (e !== 0) {
              var u = s.pendingLanes;
              if (u === 0) var m = 0;
              else {
                var w = s.suspendedLanes, M = s.pingedLanes;
                m = (1 << 31 - Ht(42 | e) + 1) - 1, m &= u & ~(w & ~M), m = m & 201326741 ? m & 201326741 | 1 : m ? m | 2 : 0;
              }
              m !== 0 && (r = true, xp(s, m));
            } else m = Ke, m = va(s, s === xt ? m : 0, s.cancelPendingCommit !== null || s.timeoutHandle !== -1), (m & 3) === 0 || xa(s, m) || (r = true, xp(s, m));
            s = s.next;
          }
        while (r);
        Ju = false;
      }
    }
    function Sw() {
      yp();
    }
    function yp() {
      hi = Wu = false;
      var e = 0;
      la !== 0 && Tw() && (e = la);
      for (var t = ft(), r = null, s = fi; s !== null; ) {
        var u = s.next, m = bp(s, t);
        m === 0 ? (s.next = null, r === null ? fi = u : r.next = u, u === null && (Rr = r)) : (r = s, (e !== 0 || (m & 3) !== 0) && (hi = true)), s = u;
      }
      Vt !== 0 && Vt !== 5 || Lo(e), la !== 0 && (la = 0);
    }
    function bp(e, t) {
      for (var r = e.suspendedLanes, s = e.pingedLanes, u = e.expirationTimes, m = e.pendingLanes & -62914561; 0 < m; ) {
        var w = 31 - Ht(m), M = 1 << w, X = u[w];
        X === -1 ? ((M & r) === 0 || (M & s) !== 0) && (u[w] = bc(M, t)) : X <= t && (e.expiredLanes |= M), m &= ~M;
      }
      if (t = xt, r = Ke, r = va(e, e === t ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), s = e.callbackNode, r === 0 || e === t && (mt === 2 || mt === 9) || e.cancelPendingCommit !== null) return s !== null && s !== null && Xe(s), e.callbackNode = null, e.callbackPriority = 0;
      if ((r & 3) === 0 || xa(e, r)) {
        if (t = r & -r, t === e.callbackPriority) return t;
        switch (s !== null && Xe(s), Pr(r)) {
          case 2:
          case 8:
            r = ul;
            break;
          case 32:
            r = An;
            break;
          case 268435456:
            r = At;
            break;
          default:
            r = An;
        }
        return s = vp.bind(null, e), r = Qe(r, s), e.callbackPriority = t, e.callbackNode = r, t;
      }
      return s !== null && s !== null && Xe(s), e.callbackPriority = 2, e.callbackNode = null, 2;
    }
    function vp(e, t) {
      if (Vt !== 0 && Vt !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
      var r = e.callbackNode;
      if (di() && e.callbackNode !== r) return null;
      var s = Ke;
      return s = va(e, e === xt ? s : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), s === 0 ? null : (ep(e, s, t), bp(e, ft()), e.callbackNode != null && e.callbackNode === r ? vp.bind(null, e) : null);
    }
    function xp(e, t) {
      if (di()) return null;
      ep(e, t, true);
    }
    function Cw() {
      Iw(function() {
        (ot & 6) !== 0 ? Qe(cl, Sw) : yp();
      });
    }
    function ed() {
      if (la === 0) {
        var e = gr;
        e === 0 && (e = Ka, Ka <<= 1, (Ka & 261888) === 0 && (Ka = 256)), la = e;
      }
      return la;
    }
    function wp(e) {
      return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : ws("" + e);
    }
    function Sp(e, t) {
      var r = t.ownerDocument.createElement("input");
      return r.name = t.name, r.value = t.value, e.id && r.setAttribute("form", e.id), t.parentNode.insertBefore(r, t), e = new FormData(e), r.parentNode.removeChild(r), e;
    }
    function Ew(e, t, r, s, u) {
      if (t === "submit" && r && r.stateNode === u) {
        var m = wp((u[tn] || null).action), w = s.submitter;
        w && (t = (t = w[tn] || null) ? wp(t.formAction) : w.getAttribute("formAction"), t !== null && (m = t, w = null));
        var M = new ks("action", "action", null, s, u);
        e.push({
          event: M,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (s.defaultPrevented) {
                  if (la !== 0) {
                    var X = w ? Sp(u, w) : new FormData(u);
                    xu(r, {
                      pending: true,
                      data: X,
                      method: u.method,
                      action: m
                    }, null, X);
                  }
                } else typeof m == "function" && (M.preventDefault(), X = w ? Sp(u, w) : new FormData(u), xu(r, {
                  pending: true,
                  data: X,
                  method: u.method,
                  action: m
                }, m, X));
              },
              currentTarget: u
            }
          ]
        });
      }
    }
    for (var td = 0; td < zc.length; td++) {
      var nd = zc[td], kw = nd.toLowerCase(), _w = nd[0].toUpperCase() + nd.slice(1);
      Pn(kw, "on" + _w);
    }
    Pn(Jh, "onAnimationEnd"), Pn(em, "onAnimationIteration"), Pn(tm, "onAnimationStart"), Pn("dblclick", "onDoubleClick"), Pn("focusin", "onFocus"), Pn("focusout", "onBlur"), Pn(Ux, "onTransitionRun"), Pn($x, "onTransitionStart"), Pn(Vx, "onTransitionCancel"), Pn(nm, "onTransitionEnd"), It("onMouseEnter", [
      "mouseout",
      "mouseover"
    ]), It("onMouseLeave", [
      "mouseout",
      "mouseover"
    ]), It("onPointerEnter", [
      "pointerout",
      "pointerover"
    ]), It("onPointerLeave", [
      "pointerout",
      "pointerover"
    ]), ht("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), ht("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), ht("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]), ht("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), ht("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), ht("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var Ro = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Mw = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ro));
    function Cp(e, t) {
      t = (t & 4) !== 0;
      for (var r = 0; r < e.length; r++) {
        var s = e[r], u = s.event;
        s = s.listeners;
        e: {
          var m = void 0;
          if (t) for (var w = s.length - 1; 0 <= w; w--) {
            var M = s[w], X = M.instance, F = M.currentTarget;
            if (M = M.listener, X !== m && u.isPropagationStopped()) break e;
            m = M, u.currentTarget = F;
            try {
              m(u);
            } catch (ae) {
              js(ae);
            }
            u.currentTarget = null, m = X;
          }
          else for (w = 0; w < s.length; w++) {
            if (M = s[w], X = M.instance, F = M.currentTarget, M = M.listener, X !== m && u.isPropagationStopped()) break e;
            m = M, u.currentTarget = F;
            try {
              m(u);
            } catch (ae) {
              js(ae);
            }
            u.currentTarget = null, m = X;
          }
        }
      }
    }
    function Pe(e, t) {
      var r = t[Bl];
      r === void 0 && (r = t[Bl] = /* @__PURE__ */ new Set());
      var s = e + "__bubble";
      r.has(s) || (Ep(t, e, 2, false), r.add(s));
    }
    function ld(e, t, r) {
      var s = 0;
      t && (s |= 4), Ep(r, e, s, t);
    }
    var mi = "_reactListening" + Math.random().toString(36).slice(2);
    function ad(e) {
      if (!e[mi]) {
        e[mi] = true, Yt.forEach(function(r) {
          r !== "selectionchange" && (Mw.has(r) || ld(r, false, e), ld(r, true, e));
        });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[mi] || (t[mi] = true, ld("selectionchange", false, t));
      }
    }
    function Ep(e, t, r, s) {
      switch (Jp(t)) {
        case 2:
          var u = tS;
          break;
        case 8:
          u = nS;
          break;
        default:
          u = vd;
      }
      r = u.bind(null, t, r, e), u = void 0, !Ec || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = true), s ? u !== void 0 ? e.addEventListener(t, r, {
        capture: true,
        passive: u
      }) : e.addEventListener(t, r, true) : u !== void 0 ? e.addEventListener(t, r, {
        passive: u
      }) : e.addEventListener(t, r, false);
    }
    function rd(e, t, r, s, u) {
      var m = s;
      if ((t & 1) === 0 && (t & 2) === 0 && s !== null) e: for (; ; ) {
        if (s === null) return;
        var w = s.tag;
        if (w === 3 || w === 4) {
          var M = s.stateNode.containerInfo;
          if (M === u) break;
          if (w === 4) for (w = s.return; w !== null; ) {
            var X = w.tag;
            if ((X === 3 || X === 4) && w.stateNode.containerInfo === u) return;
            w = w.return;
          }
          for (; M !== null; ) {
            if (w = He(M), w === null) return;
            if (X = w.tag, X === 5 || X === 6 || X === 26 || X === 27) {
              s = m = w;
              continue e;
            }
            M = M.parentNode;
          }
        }
        s = s.return;
      }
      Lh(function() {
        var F = m, ae = Sc(r), ce = [];
        e: {
          var Q = lm.get(e);
          if (Q !== void 0) {
            var ne = ks, ke = e;
            switch (e) {
              case "keypress":
                if (Cs(r) === 0) break e;
              case "keydown":
              case "keyup":
                ne = xx;
                break;
              case "focusin":
                ke = "focus", ne = jc;
                break;
              case "focusout":
                ke = "blur", ne = jc;
                break;
              case "beforeblur":
              case "afterblur":
                ne = jc;
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
                ne = Nh;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                ne = ix;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                ne = Cx;
                break;
              case Jh:
              case em:
              case tm:
                ne = dx;
                break;
              case nm:
                ne = kx;
                break;
              case "scroll":
              case "scrollend":
                ne = ox;
                break;
              case "wheel":
                ne = Mx;
                break;
              case "copy":
              case "cut":
              case "paste":
                ne = hx;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                ne = Oh;
                break;
              case "toggle":
              case "beforetoggle":
                ne = Lx;
            }
            var Re = (t & 4) !== 0, bt = !Re && (e === "scroll" || e === "scrollend"), q = Re ? Q !== null ? Q + "Capture" : null : Q;
            Re = [];
            for (var U = F, K; U !== null; ) {
              var ie = U;
              if (K = ie.stateNode, ie = ie.tag, ie !== 5 && ie !== 26 && ie !== 27 || K === null || q === null || (ie = Qr(U, q), ie != null && Re.push(Ao(U, ie, K))), bt) break;
              U = U.return;
            }
            0 < Re.length && (Q = new ne(Q, ke, null, r, ae), ce.push({
              event: Q,
              listeners: Re
            }));
          }
        }
        if ((t & 7) === 0) {
          e: {
            if (Q = e === "mouseover" || e === "pointerover", ne = e === "mouseout" || e === "pointerout", Q && r !== wc && (ke = r.relatedTarget || r.fromElement) && (He(ke) || ke[dn])) break e;
            if ((ne || Q) && (Q = ae.window === ae ? ae : (Q = ae.ownerDocument) ? Q.defaultView || Q.parentWindow : window, ne ? (ke = r.relatedTarget || r.toElement, ne = F, ke = ke ? He(ke) : null, ke !== null && (bt = c(ke), Re = ke.tag, ke !== bt || Re !== 5 && Re !== 27 && Re !== 6) && (ke = null)) : (ne = null, ke = F), ne !== ke)) {
              if (Re = Nh, ie = "onMouseLeave", q = "onMouseEnter", U = "mouse", (e === "pointerout" || e === "pointerover") && (Re = Oh, ie = "onPointerLeave", q = "onPointerEnter", U = "pointer"), bt = ne == null ? Q : Je(ne), K = ke == null ? Q : Je(ke), Q = new Re(ie, U + "leave", ne, r, ae), Q.target = bt, Q.relatedTarget = K, ie = null, He(ae) === F && (Re = new Re(q, U + "enter", ke, r, ae), Re.target = K, Re.relatedTarget = bt, ie = Re), bt = ie, ne && ke) t: {
                for (Re = jw, q = ne, U = ke, K = 0, ie = q; ie; ie = Re(ie)) K++;
                ie = 0;
                for (var Le = U; Le; Le = Re(Le)) ie++;
                for (; 0 < K - ie; ) q = Re(q), K--;
                for (; 0 < ie - K; ) U = Re(U), ie--;
                for (; K--; ) {
                  if (q === U || U !== null && q === U.alternate) {
                    Re = q;
                    break t;
                  }
                  q = Re(q), U = Re(U);
                }
                Re = null;
              }
              else Re = null;
              ne !== null && kp(ce, Q, ne, Re, false), ke !== null && bt !== null && kp(ce, bt, ke, Re, true);
            }
          }
          e: {
            if (Q = F ? Je(F) : window, ne = Q.nodeName && Q.nodeName.toLowerCase(), ne === "select" || ne === "input" && Q.type === "file") var at = Uh;
            else if (Bh(Q)) if ($h) at = Yx;
            else {
              at = zx;
              var Me = Dx;
            }
            else ne = Q.nodeName, !ne || ne.toLowerCase() !== "input" || Q.type !== "checkbox" && Q.type !== "radio" ? F && xc(F.elementType) && (at = Uh) : at = Hx;
            if (at && (at = at(e, F))) {
              Xh(ce, at, r, ae);
              break e;
            }
            Me && Me(e, Q, F), e === "focusout" && F && Q.type === "number" && F.memoizedProps.value != null && tr(Q, "number", Q.value);
          }
          switch (Me = F ? Je(F) : window, e) {
            case "focusin":
              (Bh(Me) || Me.contentEditable === "true") && (sr = Me, Oc = F, ro = null);
              break;
            case "focusout":
              ro = Oc = sr = null;
              break;
            case "mousedown":
              Ic = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Ic = false, Qh(ce, r, ae);
              break;
            case "selectionchange":
              if (Xx) break;
            case "keydown":
            case "keyup":
              Qh(ce, r, ae);
          }
          var $e;
          if (Rc) e: {
            switch (e) {
              case "compositionstart":
                var Fe = "onCompositionStart";
                break e;
              case "compositionend":
                Fe = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Fe = "onCompositionUpdate";
                break e;
            }
            Fe = void 0;
          }
          else or ? Hh(e, r) && (Fe = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (Fe = "onCompositionStart");
          Fe && (Ih && r.locale !== "ko" && (or || Fe !== "onCompositionStart" ? Fe === "onCompositionEnd" && or && ($e = Rh()) : (Xl = ae, kc = "value" in Xl ? Xl.value : Xl.textContent, or = true)), Me = gi(F, Fe), 0 < Me.length && (Fe = new Th(Fe, e, null, r, ae), ce.push({
            event: Fe,
            listeners: Me
          }), $e ? Fe.data = $e : ($e = Yh(r), $e !== null && (Fe.data = $e)))), ($e = Ax ? Nx(e, r) : Tx(e, r)) && (Fe = gi(F, "onBeforeInput"), 0 < Fe.length && (Me = new Th("onBeforeInput", "beforeinput", null, r, ae), ce.push({
            event: Me,
            listeners: Fe
          }), Me.data = $e)), Ew(ce, e, F, r, ae);
        }
        Cp(ce, t);
      });
    }
    function Ao(e, t, r) {
      return {
        instance: e,
        listener: t,
        currentTarget: r
      };
    }
    function gi(e, t) {
      for (var r = t + "Capture", s = []; e !== null; ) {
        var u = e, m = u.stateNode;
        if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || m === null || (u = Qr(e, r), u != null && s.unshift(Ao(e, u, m)), u = Qr(e, t), u != null && s.push(Ao(e, u, m))), e.tag === 3) return s;
        e = e.return;
      }
      return [];
    }
    function jw(e) {
      if (e === null) return null;
      do
        e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function kp(e, t, r, s, u) {
      for (var m = t._reactName, w = []; r !== null && r !== s; ) {
        var M = r, X = M.alternate, F = M.stateNode;
        if (M = M.tag, X !== null && X === s) break;
        M !== 5 && M !== 26 && M !== 27 || F === null || (X = F, u ? (F = Qr(r, m), F != null && w.unshift(Ao(r, F, X))) : u || (F = Qr(r, m), F != null && w.push(Ao(r, F, X)))), r = r.return;
      }
      w.length !== 0 && e.push({
        event: t,
        listeners: w
      });
    }
    var Lw = /\r\n?/g, Rw = /\u0000|\uFFFD/g;
    function _p(e) {
      return (typeof e == "string" ? e : "" + e).replace(Lw, `
`).replace(Rw, "");
    }
    function Mp(e, t) {
      return t = _p(t), _p(e) === t;
    }
    function yt(e, t, r, s, u, m) {
      switch (r) {
        case "children":
          typeof s == "string" ? t === "body" || t === "textarea" && s === "" || lr(e, s) : (typeof s == "number" || typeof s == "bigint") && t !== "body" && lr(e, "" + s);
          break;
        case "className":
          gl(e, "class", s);
          break;
        case "tabIndex":
          gl(e, "tabindex", s);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          gl(e, r, s);
          break;
        case "style":
          Mh(e, s, m);
          break;
        case "data":
          if (t !== "object") {
            gl(e, "data", s);
            break;
          }
        case "src":
        case "href":
          if (s === "" && (t !== "a" || r !== "href")) {
            e.removeAttribute(r);
            break;
          }
          if (s == null || typeof s == "function" || typeof s == "symbol" || typeof s == "boolean") {
            e.removeAttribute(r);
            break;
          }
          s = ws("" + s), e.setAttribute(r, s);
          break;
        case "action":
        case "formAction":
          if (typeof s == "function") {
            e.setAttribute(r, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
            break;
          } else typeof m == "function" && (r === "formAction" ? (t !== "input" && yt(e, t, "name", u.name, u, null), yt(e, t, "formEncType", u.formEncType, u, null), yt(e, t, "formMethod", u.formMethod, u, null), yt(e, t, "formTarget", u.formTarget, u, null)) : (yt(e, t, "encType", u.encType, u, null), yt(e, t, "method", u.method, u, null), yt(e, t, "target", u.target, u, null)));
          if (s == null || typeof s == "symbol" || typeof s == "boolean") {
            e.removeAttribute(r);
            break;
          }
          s = ws("" + s), e.setAttribute(r, s);
          break;
        case "onClick":
          s != null && (e.onclick = yl);
          break;
        case "onScroll":
          s != null && Pe("scroll", e);
          break;
        case "onScrollEnd":
          s != null && Pe("scrollend", e);
          break;
        case "dangerouslySetInnerHTML":
          if (s != null) {
            if (typeof s != "object" || !("__html" in s)) throw Error(o(61));
            if (r = s.__html, r != null) {
              if (u.children != null) throw Error(o(60));
              e.innerHTML = r;
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
          r = ws("" + s), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", r);
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          s != null && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(r, "" + s) : e.removeAttribute(r);
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
          s && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(r, "") : e.removeAttribute(r);
          break;
        case "capture":
        case "download":
          s === true ? e.setAttribute(r, "") : s !== false && s != null && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(r, s) : e.removeAttribute(r);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          s != null && typeof s != "function" && typeof s != "symbol" && !isNaN(s) && 1 <= s ? e.setAttribute(r, s) : e.removeAttribute(r);
          break;
        case "rowSpan":
        case "start":
          s == null || typeof s == "function" || typeof s == "symbol" || isNaN(s) ? e.removeAttribute(r) : e.setAttribute(r, s);
          break;
        case "popover":
          Pe("beforetoggle", e), Pe("toggle", e), ml(e, "popover", s);
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
          ml(e, "is", s);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          (!(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (r = ax.get(r) || r, ml(e, r, s));
      }
    }
    function od(e, t, r, s, u, m) {
      switch (r) {
        case "style":
          Mh(e, s, m);
          break;
        case "dangerouslySetInnerHTML":
          if (s != null) {
            if (typeof s != "object" || !("__html" in s)) throw Error(o(61));
            if (r = s.__html, r != null) {
              if (u.children != null) throw Error(o(60));
              e.innerHTML = r;
            }
          }
          break;
        case "children":
          typeof s == "string" ? lr(e, s) : (typeof s == "number" || typeof s == "bigint") && lr(e, "" + s);
          break;
        case "onScroll":
          s != null && Pe("scroll", e);
          break;
        case "onScrollEnd":
          s != null && Pe("scrollend", e);
          break;
        case "onClick":
          s != null && (e.onclick = yl);
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
          if (!Et.hasOwnProperty(r)) e: {
            if (r[0] === "o" && r[1] === "n" && (u = r.endsWith("Capture"), t = r.slice(2, u ? r.length - 7 : void 0), m = e[tn] || null, m = m != null ? m[r] : null, typeof m == "function" && e.removeEventListener(t, m, u), typeof s == "function")) {
              typeof m != "function" && m !== null && (r in e ? e[r] = null : e.hasAttribute(r) && e.removeAttribute(r)), e.addEventListener(t, s, u);
              break e;
            }
            r in e ? e[r] = s : s === true ? e.setAttribute(r, "") : ml(e, r, s);
          }
      }
    }
    function en(e, t, r) {
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
          Pe("error", e), Pe("load", e);
          var s = false, u = false, m;
          for (m in r) if (r.hasOwnProperty(m)) {
            var w = r[m];
            if (w != null) switch (m) {
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
                yt(e, t, m, w, r, null);
            }
          }
          u && yt(e, t, "srcSet", r.srcSet, r, null), s && yt(e, t, "src", r.src, r, null);
          return;
        case "input":
          Pe("invalid", e);
          var M = m = w = u = null, X = null, F = null;
          for (s in r) if (r.hasOwnProperty(s)) {
            var ae = r[s];
            if (ae != null) switch (s) {
              case "name":
                u = ae;
                break;
              case "type":
                w = ae;
                break;
              case "checked":
                X = ae;
                break;
              case "defaultChecked":
                F = ae;
                break;
              case "value":
                m = ae;
                break;
              case "defaultValue":
                M = ae;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (ae != null) throw Error(o(137, t));
                break;
              default:
                yt(e, t, s, ae, r, null);
            }
          }
          Fr(e, m, M, X, F, w, u, false);
          return;
        case "select":
          Pe("invalid", e), s = w = m = null;
          for (u in r) if (r.hasOwnProperty(u) && (M = r[u], M != null)) switch (u) {
            case "value":
              m = M;
              break;
            case "defaultValue":
              w = M;
              break;
            case "multiple":
              s = M;
            default:
              yt(e, t, u, M, r, null);
          }
          t = m, r = w, e.multiple = !!s, t != null ? nr(e, !!s, t, false) : r != null && nr(e, !!s, r, true);
          return;
        case "textarea":
          Pe("invalid", e), m = u = s = null;
          for (w in r) if (r.hasOwnProperty(w) && (M = r[w], M != null)) switch (w) {
            case "value":
              s = M;
              break;
            case "defaultValue":
              u = M;
              break;
            case "children":
              m = M;
              break;
            case "dangerouslySetInnerHTML":
              if (M != null) throw Error(o(91));
              break;
            default:
              yt(e, t, w, M, r, null);
          }
          kh(e, s, u, m);
          return;
        case "option":
          for (X in r) if (r.hasOwnProperty(X) && (s = r[X], s != null)) switch (X) {
            case "selected":
              e.selected = s && typeof s != "function" && typeof s != "symbol";
              break;
            default:
              yt(e, t, X, s, r, null);
          }
          return;
        case "dialog":
          Pe("beforetoggle", e), Pe("toggle", e), Pe("cancel", e), Pe("close", e);
          break;
        case "iframe":
        case "object":
          Pe("load", e);
          break;
        case "video":
        case "audio":
          for (s = 0; s < Ro.length; s++) Pe(Ro[s], e);
          break;
        case "image":
          Pe("error", e), Pe("load", e);
          break;
        case "details":
          Pe("toggle", e);
          break;
        case "embed":
        case "source":
        case "link":
          Pe("error", e), Pe("load", e);
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
          for (F in r) if (r.hasOwnProperty(F) && (s = r[F], s != null)) switch (F) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(o(137, t));
            default:
              yt(e, t, F, s, r, null);
          }
          return;
        default:
          if (xc(t)) {
            for (ae in r) r.hasOwnProperty(ae) && (s = r[ae], s !== void 0 && od(e, t, ae, s, r, void 0));
            return;
          }
      }
      for (M in r) r.hasOwnProperty(M) && (s = r[M], s != null && yt(e, t, M, s, r, null));
    }
    function Aw(e, t, r, s) {
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
          var u = null, m = null, w = null, M = null, X = null, F = null, ae = null;
          for (ne in r) {
            var ce = r[ne];
            if (r.hasOwnProperty(ne) && ce != null) switch (ne) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                X = ce;
              default:
                s.hasOwnProperty(ne) || yt(e, t, ne, null, s, ce);
            }
          }
          for (var Q in s) {
            var ne = s[Q];
            if (ce = r[Q], s.hasOwnProperty(Q) && (ne != null || ce != null)) switch (Q) {
              case "type":
                m = ne;
                break;
              case "name":
                u = ne;
                break;
              case "checked":
                F = ne;
                break;
              case "defaultChecked":
                ae = ne;
                break;
              case "value":
                w = ne;
                break;
              case "defaultValue":
                M = ne;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (ne != null) throw Error(o(137, t));
                break;
              default:
                ne !== ce && yt(e, t, Q, ne, s, ce);
            }
          }
          Kr(e, w, M, X, F, ae, m, u);
          return;
        case "select":
          ne = w = M = Q = null;
          for (m in r) if (X = r[m], r.hasOwnProperty(m) && X != null) switch (m) {
            case "value":
              break;
            case "multiple":
              ne = X;
            default:
              s.hasOwnProperty(m) || yt(e, t, m, null, s, X);
          }
          for (u in s) if (m = s[u], X = r[u], s.hasOwnProperty(u) && (m != null || X != null)) switch (u) {
            case "value":
              Q = m;
              break;
            case "defaultValue":
              M = m;
              break;
            case "multiple":
              w = m;
            default:
              m !== X && yt(e, t, u, m, s, X);
          }
          t = M, r = w, s = ne, Q != null ? nr(e, !!r, Q, false) : !!s != !!r && (t != null ? nr(e, !!r, t, true) : nr(e, !!r, r ? [] : "", false));
          return;
        case "textarea":
          ne = Q = null;
          for (M in r) if (u = r[M], r.hasOwnProperty(M) && u != null && !s.hasOwnProperty(M)) switch (M) {
            case "value":
              break;
            case "children":
              break;
            default:
              yt(e, t, M, null, s, u);
          }
          for (w in s) if (u = s[w], m = r[w], s.hasOwnProperty(w) && (u != null || m != null)) switch (w) {
            case "value":
              Q = u;
              break;
            case "defaultValue":
              ne = u;
              break;
            case "children":
              break;
            case "dangerouslySetInnerHTML":
              if (u != null) throw Error(o(91));
              break;
            default:
              u !== m && yt(e, t, w, u, s, m);
          }
          Eh(e, Q, ne);
          return;
        case "option":
          for (var ke in r) if (Q = r[ke], r.hasOwnProperty(ke) && Q != null && !s.hasOwnProperty(ke)) switch (ke) {
            case "selected":
              e.selected = false;
              break;
            default:
              yt(e, t, ke, null, s, Q);
          }
          for (X in s) if (Q = s[X], ne = r[X], s.hasOwnProperty(X) && Q !== ne && (Q != null || ne != null)) switch (X) {
            case "selected":
              e.selected = Q && typeof Q != "function" && typeof Q != "symbol";
              break;
            default:
              yt(e, t, X, Q, s, ne);
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
          for (var Re in r) Q = r[Re], r.hasOwnProperty(Re) && Q != null && !s.hasOwnProperty(Re) && yt(e, t, Re, null, s, Q);
          for (F in s) if (Q = s[F], ne = r[F], s.hasOwnProperty(F) && Q !== ne && (Q != null || ne != null)) switch (F) {
            case "children":
            case "dangerouslySetInnerHTML":
              if (Q != null) throw Error(o(137, t));
              break;
            default:
              yt(e, t, F, Q, s, ne);
          }
          return;
        default:
          if (xc(t)) {
            for (var bt in r) Q = r[bt], r.hasOwnProperty(bt) && Q !== void 0 && !s.hasOwnProperty(bt) && od(e, t, bt, void 0, s, Q);
            for (ae in s) Q = s[ae], ne = r[ae], !s.hasOwnProperty(ae) || Q === ne || Q === void 0 && ne === void 0 || od(e, t, ae, Q, s, ne);
            return;
          }
      }
      for (var q in r) Q = r[q], r.hasOwnProperty(q) && Q != null && !s.hasOwnProperty(q) && yt(e, t, q, null, s, Q);
      for (ce in s) Q = s[ce], ne = r[ce], !s.hasOwnProperty(ce) || Q === ne || Q == null && ne == null || yt(e, t, ce, Q, s, ne);
    }
    function jp(e) {
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
    function Nw() {
      if (typeof performance.getEntriesByType == "function") {
        for (var e = 0, t = 0, r = performance.getEntriesByType("resource"), s = 0; s < r.length; s++) {
          var u = r[s], m = u.transferSize, w = u.initiatorType, M = u.duration;
          if (m && M && jp(w)) {
            for (w = 0, M = u.responseEnd, s += 1; s < r.length; s++) {
              var X = r[s], F = X.startTime;
              if (F > M) break;
              var ae = X.transferSize, ce = X.initiatorType;
              ae && jp(ce) && (X = X.responseEnd, w += ae * (X < M ? 1 : (M - F) / (X - F)));
            }
            if (--s, t += 8 * (m + w) / (u.duration / 1e3), e++, 10 < e) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
    }
    var sd = null, id = null;
    function pi(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Lp(e) {
      switch (e) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function Rp(e, t) {
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
    function Tw() {
      var e = window.event;
      return e && e.type === "popstate" ? e === ud ? false : (ud = e, true) : (ud = null, false);
    }
    var Ap = typeof setTimeout == "function" ? setTimeout : void 0, Ow = typeof clearTimeout == "function" ? clearTimeout : void 0, Np = typeof Promise == "function" ? Promise : void 0, Iw = typeof queueMicrotask == "function" ? queueMicrotask : typeof Np < "u" ? function(e) {
      return Np.resolve(null).then(e).catch(Dw);
    } : Ap;
    function Dw(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function aa(e) {
      return e === "head";
    }
    function Tp(e, t) {
      var r = t, s = 0;
      do {
        var u = r.nextSibling;
        if (e.removeChild(r), u && u.nodeType === 8) if (r = u.data, r === "/$" || r === "/&") {
          if (s === 0) {
            e.removeChild(u), Or(t);
            return;
          }
          s--;
        } else if (r === "$" || r === "$?" || r === "$~" || r === "$!" || r === "&") s++;
        else if (r === "html") No(e.ownerDocument.documentElement);
        else if (r === "head") {
          r = e.ownerDocument.head, No(r);
          for (var m = r.firstChild; m; ) {
            var w = m.nextSibling, M = m.nodeName;
            m[Te] || M === "SCRIPT" || M === "STYLE" || M === "LINK" && m.rel.toLowerCase() === "stylesheet" || r.removeChild(m), m = w;
          }
        } else r === "body" && No(e.ownerDocument.body);
        r = u;
      } while (r);
      Or(t);
    }
    function Op(e, t) {
      var r = e;
      e = 0;
      do {
        var s = r.nextSibling;
        if (r.nodeType === 1 ? t ? (r._stashedDisplay = r.style.display, r.style.display = "none") : (r.style.display = r._stashedDisplay || "", r.getAttribute("style") === "" && r.removeAttribute("style")) : r.nodeType === 3 && (t ? (r._stashedText = r.nodeValue, r.nodeValue = "") : r.nodeValue = r._stashedText || ""), s && s.nodeType === 8) if (r = s.data, r === "/$") {
          if (e === 0) break;
          e--;
        } else r !== "$" && r !== "$?" && r !== "$~" && r !== "$!" || e++;
        r = s;
      } while (r);
    }
    function dd(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var r = t;
        switch (t = t.nextSibling, r.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            dd(r), it(r);
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
    function zw(e, t, r, s) {
      for (; e.nodeType === 1; ) {
        var u = r;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!s && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
        } else if (s) {
          if (!e[Te]) switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (m = e.getAttribute("rel"), m === "stylesheet" && e.hasAttribute("data-precedence")) break;
              if (m !== u.rel || e.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || e.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || e.getAttribute("title") !== (u.title == null ? null : u.title)) break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (m = e.getAttribute("src"), (m !== (u.src == null ? null : u.src) || e.getAttribute("type") !== (u.type == null ? null : u.type) || e.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && m && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
              return e;
            default:
              return e;
          }
        } else if (t === "input" && e.type === "hidden") {
          var m = u.name == null ? null : "" + u.name;
          if (u.type === "hidden" && e.getAttribute("name") === m) return e;
        } else return e;
        if (e = Yn(e.nextSibling), e === null) break;
      }
      return null;
    }
    function Hw(e, t, r) {
      if (t === "") return null;
      for (; e.nodeType !== 3; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !r || (e = Yn(e.nextSibling), e === null)) return null;
      return e;
    }
    function Ip(e, t) {
      for (; e.nodeType !== 8; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Yn(e.nextSibling), e === null)) return null;
      return e;
    }
    function fd(e) {
      return e.data === "$?" || e.data === "$~";
    }
    function hd(e) {
      return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
    }
    function Yw(e, t) {
      var r = e.ownerDocument;
      if (e.data === "$~") e._reactRetry = t;
      else if (e.data !== "$?" || r.readyState !== "loading") t();
      else {
        var s = function() {
          t(), r.removeEventListener("DOMContentLoaded", s);
        };
        r.addEventListener("DOMContentLoaded", s), e._reactRetry = s;
      }
    }
    function Yn(e) {
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
    function Dp(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var r = e.data;
          if (r === "/$" || r === "/&") {
            if (t === 0) return Yn(e.nextSibling);
            t--;
          } else r !== "$" && r !== "$!" && r !== "$?" && r !== "$~" && r !== "&" || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function zp(e) {
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
    function Hp(e, t, r) {
      switch (t = pi(r), e) {
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
    function No(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      it(e);
    }
    var Bn = /* @__PURE__ */ new Map(), Yp = /* @__PURE__ */ new Set();
    function yi(e) {
      return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
    }
    var Tl = P.d;
    P.d = {
      f: Bw,
      r: Xw,
      D: Uw,
      C: $w,
      L: Vw,
      m: qw,
      X: Pw,
      S: Gw,
      M: Zw
    };
    function Bw() {
      var e = Tl.f(), t = ii();
      return e || t;
    }
    function Xw(e) {
      var t = nt(e);
      t !== null && t.tag === 5 && t.type === "form" ? ng(t) : Tl.r(e);
    }
    var Ar = typeof document > "u" ? null : document;
    function Bp(e, t, r) {
      var s = Ar;
      if (s && typeof t == "string" && t) {
        var u = hn(t);
        u = 'link[rel="' + e + '"][href="' + u + '"]', typeof r == "string" && (u += '[crossorigin="' + r + '"]'), Yp.has(u) || (Yp.add(u), e = {
          rel: e,
          crossOrigin: r,
          href: t
        }, s.querySelector(u) === null && (t = s.createElement("link"), en(t, "link", e), Ne(t), s.head.appendChild(t)));
      }
    }
    function Uw(e) {
      Tl.D(e), Bp("dns-prefetch", e, null);
    }
    function $w(e, t) {
      Tl.C(e, t), Bp("preconnect", e, t);
    }
    function Vw(e, t, r) {
      Tl.L(e, t, r);
      var s = Ar;
      if (s && e && t) {
        var u = 'link[rel="preload"][as="' + hn(t) + '"]';
        t === "image" && r && r.imageSrcSet ? (u += '[imagesrcset="' + hn(r.imageSrcSet) + '"]', typeof r.imageSizes == "string" && (u += '[imagesizes="' + hn(r.imageSizes) + '"]')) : u += '[href="' + hn(e) + '"]';
        var m = u;
        switch (t) {
          case "style":
            m = Nr(e);
            break;
          case "script":
            m = Tr(e);
        }
        Bn.has(m) || (e = x({
          rel: "preload",
          href: t === "image" && r && r.imageSrcSet ? void 0 : e,
          as: t
        }, r), Bn.set(m, e), s.querySelector(u) !== null || t === "style" && s.querySelector(To(m)) || t === "script" && s.querySelector(Oo(m)) || (t = s.createElement("link"), en(t, "link", e), Ne(t), s.head.appendChild(t)));
      }
    }
    function qw(e, t) {
      Tl.m(e, t);
      var r = Ar;
      if (r && e) {
        var s = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + hn(s) + '"][href="' + hn(e) + '"]', m = u;
        switch (s) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            m = Tr(e);
        }
        if (!Bn.has(m) && (e = x({
          rel: "modulepreload",
          href: e
        }, t), Bn.set(m, e), r.querySelector(u) === null)) {
          switch (s) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (r.querySelector(Oo(m))) return;
          }
          s = r.createElement("link"), en(s, "link", e), Ne(s), r.head.appendChild(s);
        }
      }
    }
    function Gw(e, t, r) {
      Tl.S(e, t, r);
      var s = Ar;
      if (s && e) {
        var u = lt(s).hoistableStyles, m = Nr(e);
        t = t || "default";
        var w = u.get(m);
        if (!w) {
          var M = {
            loading: 0,
            preload: null
          };
          if (w = s.querySelector(To(m))) M.loading = 5;
          else {
            e = x({
              rel: "stylesheet",
              href: e,
              "data-precedence": t
            }, r), (r = Bn.get(m)) && gd(e, r);
            var X = w = s.createElement("link");
            Ne(X), en(X, "link", e), X._p = new Promise(function(F, ae) {
              X.onload = F, X.onerror = ae;
            }), X.addEventListener("load", function() {
              M.loading |= 1;
            }), X.addEventListener("error", function() {
              M.loading |= 2;
            }), M.loading |= 4, bi(w, t, s);
          }
          w = {
            type: "stylesheet",
            instance: w,
            count: 1,
            state: M
          }, u.set(m, w);
        }
      }
    }
    function Pw(e, t) {
      Tl.X(e, t);
      var r = Ar;
      if (r && e) {
        var s = lt(r).hoistableScripts, u = Tr(e), m = s.get(u);
        m || (m = r.querySelector(Oo(u)), m || (e = x({
          src: e,
          async: true
        }, t), (t = Bn.get(u)) && pd(e, t), m = r.createElement("script"), Ne(m), en(m, "link", e), r.head.appendChild(m)), m = {
          type: "script",
          instance: m,
          count: 1,
          state: null
        }, s.set(u, m));
      }
    }
    function Zw(e, t) {
      Tl.M(e, t);
      var r = Ar;
      if (r && e) {
        var s = lt(r).hoistableScripts, u = Tr(e), m = s.get(u);
        m || (m = r.querySelector(Oo(u)), m || (e = x({
          src: e,
          async: true,
          type: "module"
        }, t), (t = Bn.get(u)) && pd(e, t), m = r.createElement("script"), Ne(m), en(m, "link", e), r.head.appendChild(m)), m = {
          type: "script",
          instance: m,
          count: 1,
          state: null
        }, s.set(u, m));
      }
    }
    function Xp(e, t, r, s) {
      var u = (u = se.current) ? yi(u) : null;
      if (!u) throw Error(o(446));
      switch (e) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof r.precedence == "string" && typeof r.href == "string" ? (t = Nr(r.href), r = lt(u).hoistableStyles, s = r.get(t), s || (s = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, r.set(t, s)), s) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        case "link":
          if (r.rel === "stylesheet" && typeof r.href == "string" && typeof r.precedence == "string") {
            e = Nr(r.href);
            var m = lt(u).hoistableStyles, w = m.get(e);
            if (w || (u = u.ownerDocument || u, w = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: {
                loading: 0,
                preload: null
              }
            }, m.set(e, w), (m = u.querySelector(To(e))) && !m._p && (w.instance = m, w.state.loading = 5), Bn.has(e) || (r = {
              rel: "preload",
              as: "style",
              href: r.href,
              crossOrigin: r.crossOrigin,
              integrity: r.integrity,
              media: r.media,
              hrefLang: r.hrefLang,
              referrerPolicy: r.referrerPolicy
            }, Bn.set(e, r), m || Kw(u, e, r, w.state))), t && s === null) throw Error(o(528, ""));
            return w;
          }
          if (t && s !== null) throw Error(o(529, ""));
          return null;
        case "script":
          return t = r.async, r = r.src, typeof r == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Tr(r), r = lt(u).hoistableScripts, s = r.get(t), s || (s = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, r.set(t, s)), s) : {
            type: "void",
            instance: null,
            count: 0,
            state: null
          };
        default:
          throw Error(o(444, e));
      }
    }
    function Nr(e) {
      return 'href="' + hn(e) + '"';
    }
    function To(e) {
      return 'link[rel="stylesheet"][' + e + "]";
    }
    function Up(e) {
      return x({}, e, {
        "data-precedence": e.precedence,
        precedence: null
      });
    }
    function Kw(e, t, r, s) {
      e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? s.loading = 1 : (t = e.createElement("link"), s.preload = t, t.addEventListener("load", function() {
        return s.loading |= 1;
      }), t.addEventListener("error", function() {
        return s.loading |= 2;
      }), en(t, "link", r), Ne(t), e.head.appendChild(t));
    }
    function Tr(e) {
      return '[src="' + hn(e) + '"]';
    }
    function Oo(e) {
      return "script[async]" + e;
    }
    function $p(e, t, r) {
      if (t.count++, t.instance === null) switch (t.type) {
        case "style":
          var s = e.querySelector('style[data-href~="' + hn(r.href) + '"]');
          if (s) return t.instance = s, Ne(s), s;
          var u = x({}, r, {
            "data-href": r.href,
            "data-precedence": r.precedence,
            href: null,
            precedence: null
          });
          return s = (e.ownerDocument || e).createElement("style"), Ne(s), en(s, "style", u), bi(s, r.precedence, e), t.instance = s;
        case "stylesheet":
          u = Nr(r.href);
          var m = e.querySelector(To(u));
          if (m) return t.state.loading |= 4, t.instance = m, Ne(m), m;
          s = Up(r), (u = Bn.get(u)) && gd(s, u), m = (e.ownerDocument || e).createElement("link"), Ne(m);
          var w = m;
          return w._p = new Promise(function(M, X) {
            w.onload = M, w.onerror = X;
          }), en(m, "link", s), t.state.loading |= 4, bi(m, r.precedence, e), t.instance = m;
        case "script":
          return m = Tr(r.src), (u = e.querySelector(Oo(m))) ? (t.instance = u, Ne(u), u) : (s = r, (u = Bn.get(m)) && (s = x({}, r), pd(s, u)), e = e.ownerDocument || e, u = e.createElement("script"), Ne(u), en(u, "link", s), e.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
      else t.type === "stylesheet" && (t.state.loading & 4) === 0 && (s = t.instance, t.state.loading |= 4, bi(s, r.precedence, e));
      return t.instance;
    }
    function bi(e, t, r) {
      for (var s = r.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), u = s.length ? s[s.length - 1] : null, m = u, w = 0; w < s.length; w++) {
        var M = s[w];
        if (M.dataset.precedence === t) m = M;
        else if (m !== u) break;
      }
      m ? m.parentNode.insertBefore(e, m.nextSibling) : (t = r.nodeType === 9 ? r.head : r, t.insertBefore(e, t.firstChild));
    }
    function gd(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
    }
    function pd(e, t) {
      e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
    }
    var vi = null;
    function Vp(e, t, r) {
      if (vi === null) {
        var s = /* @__PURE__ */ new Map(), u = vi = /* @__PURE__ */ new Map();
        u.set(r, s);
      } else u = vi, s = u.get(r), s || (s = /* @__PURE__ */ new Map(), u.set(r, s));
      if (s.has(e)) return s;
      for (s.set(e, null), r = r.getElementsByTagName(e), u = 0; u < r.length; u++) {
        var m = r[u];
        if (!(m[Te] || m[Lt] || e === "link" && m.getAttribute("rel") === "stylesheet") && m.namespaceURI !== "http://www.w3.org/2000/svg") {
          var w = m.getAttribute(t) || "";
          w = e + w;
          var M = s.get(w);
          M ? M.push(m) : s.set(w, [
            m
          ]);
        }
      }
      return s;
    }
    function qp(e, t, r) {
      e = e.ownerDocument || e, e.head.insertBefore(r, t === "title" ? e.querySelector("head > title") : null);
    }
    function Fw(e, t, r) {
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
    function Gp(e) {
      return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
    }
    function Qw(e, t, r, s) {
      if (r.type === "stylesheet" && (typeof s.media != "string" || matchMedia(s.media).matches !== false) && (r.state.loading & 4) === 0) {
        if (r.instance === null) {
          var u = Nr(s.href), m = t.querySelector(To(u));
          if (m) {
            t = m._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = xi.bind(e), t.then(e, e)), r.state.loading |= 4, r.instance = m, Ne(m);
            return;
          }
          m = t.ownerDocument || t, s = Up(s), (u = Bn.get(u)) && gd(s, u), m = m.createElement("link"), Ne(m);
          var w = m;
          w._p = new Promise(function(M, X) {
            w.onload = M, w.onerror = X;
          }), en(m, "link", s), r.instance = m;
        }
        e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(r, t), (t = r.state.preload) && (r.state.loading & 3) === 0 && (e.count++, r = xi.bind(e), t.addEventListener("load", r), t.addEventListener("error", r));
      }
    }
    var yd = 0;
    function Ww(e, t) {
      return e.stylesheets && e.count === 0 && Si(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(r) {
        var s = setTimeout(function() {
          if (e.stylesheets && Si(e, e.stylesheets), e.unsuspend) {
            var m = e.unsuspend;
            e.unsuspend = null, m();
          }
        }, 6e4 + t);
        0 < e.imgBytes && yd === 0 && (yd = 62500 * Nw());
        var u = setTimeout(function() {
          if (e.waitingForImages = false, e.count === 0 && (e.stylesheets && Si(e, e.stylesheets), e.unsuspend)) {
            var m = e.unsuspend;
            e.unsuspend = null, m();
          }
        }, (e.imgBytes > yd ? 50 : 800) + t);
        return e.unsuspend = r, function() {
          e.unsuspend = null, clearTimeout(s), clearTimeout(u);
        };
      } : null;
    }
    function xi() {
      if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
        if (this.stylesheets) Si(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          this.unsuspend = null, e();
        }
      }
    }
    var wi = null;
    function Si(e, t) {
      e.stylesheets = null, e.unsuspend !== null && (e.count++, wi = /* @__PURE__ */ new Map(), t.forEach(Jw, e), wi = null, xi.call(e));
    }
    function Jw(e, t) {
      if (!(t.state.loading & 4)) {
        var r = wi.get(e);
        if (r) var s = r.get(null);
        else {
          r = /* @__PURE__ */ new Map(), wi.set(e, r);
          for (var u = e.querySelectorAll("link[data-precedence],style[data-precedence]"), m = 0; m < u.length; m++) {
            var w = u[m];
            (w.nodeName === "LINK" || w.getAttribute("media") !== "not all") && (r.set(w.dataset.precedence, w), s = w);
          }
          s && r.set(null, s);
        }
        u = t.instance, w = u.getAttribute("data-precedence"), m = r.get(w) || s, m === s && r.set(null, u), r.set(w, u), this.count++, s = xi.bind(this), u.addEventListener("load", s), u.addEventListener("error", s), m ? m.parentNode.insertBefore(u, m.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(u, e.firstChild)), t.state.loading |= 4;
      }
    }
    var Io = {
      $$typeof: j,
      Provider: null,
      Consumer: null,
      _currentValue: pe,
      _currentValue2: pe,
      _threadCount: 0
    };
    function eS(e, t, r, s, u, m, w, M, X) {
      this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Sa(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Sa(0), this.hiddenUpdates = Sa(null), this.identifierPrefix = s, this.onUncaughtError = u, this.onCaughtError = m, this.onRecoverableError = w, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = X, this.incompleteTransitions = /* @__PURE__ */ new Map();
    }
    function Pp(e, t, r, s, u, m, w, M, X, F, ae, ce) {
      return e = new eS(e, t, r, w, X, F, ae, ce, M), t = 1, m === true && (t |= 24), m = Sn(3, null, null, t), e.current = m, m.stateNode = e, t = Fc(), t.refCount++, e.pooledCache = t, t.refCount++, m.memoizedState = {
        element: s,
        isDehydrated: r,
        cache: t
      }, eu(m), e;
    }
    function Zp(e) {
      return e ? (e = ur, e) : ur;
    }
    function Kp(e, t, r, s, u, m) {
      u = Zp(u), s.context === null ? s.context = u : s.pendingContext = u, s = Pl(t), s.payload = {
        element: r
      }, m = m === void 0 ? null : m, m !== null && (s.callback = m), r = Zl(e, s, t), r !== null && (vn(r, e, t), ho(r, e, t));
    }
    function Fp(e, t) {
      if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
        var r = e.retryLane;
        e.retryLane = r !== 0 && r < t ? r : t;
      }
    }
    function bd(e, t) {
      Fp(e, t), (e = e.alternate) && Fp(e, t);
    }
    function Qp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Ma(e, 67108864);
        t !== null && vn(t, e, 67108864), bd(e, 67108864);
      }
    }
    function Wp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Mn();
        t = Nn(t);
        var r = Ma(e, t);
        r !== null && vn(r, e, t), bd(e, t);
      }
    }
    var Ci = true;
    function tS(e, t, r, s) {
      var u = V.T;
      V.T = null;
      var m = P.p;
      try {
        P.p = 2, vd(e, t, r, s);
      } finally {
        P.p = m, V.T = u;
      }
    }
    function nS(e, t, r, s) {
      var u = V.T;
      V.T = null;
      var m = P.p;
      try {
        P.p = 8, vd(e, t, r, s);
      } finally {
        P.p = m, V.T = u;
      }
    }
    function vd(e, t, r, s) {
      if (Ci) {
        var u = xd(s);
        if (u === null) rd(e, t, s, Ei, r), ey(e, s);
        else if (aS(u, e, t, r, s)) s.stopPropagation();
        else if (ey(e, s), t & 4 && -1 < lS.indexOf(e)) {
          for (; u !== null; ) {
            var m = nt(u);
            if (m !== null) switch (m.tag) {
              case 3:
                if (m = m.stateNode, m.current.memoizedState.isDehydrated) {
                  var w = tl(m.pendingLanes);
                  if (w !== 0) {
                    var M = m;
                    for (M.pendingLanes |= 2, M.entangledLanes |= 2; w; ) {
                      var X = 1 << 31 - Ht(w);
                      M.entanglements[1] |= X, w &= ~X;
                    }
                    sl(m), (ot & 6) === 0 && (oi = ft() + 500, Lo(0));
                  }
                }
                break;
              case 31:
              case 13:
                M = Ma(m, 2), M !== null && vn(M, m, 2), ii(), bd(m, 2);
            }
            if (m = xd(s), m === null && rd(e, t, s, Ei, r), m === u) break;
            u = m;
          }
          u !== null && s.stopPropagation();
        } else rd(e, t, s, null, r);
      }
    }
    function xd(e) {
      return e = Sc(e), wd(e);
    }
    var Ei = null;
    function wd(e) {
      if (Ei = null, e = He(e), e !== null) {
        var t = c(e);
        if (t === null) e = null;
        else {
          var r = t.tag;
          if (r === 13) {
            if (e = d(t), e !== null) return e;
            e = null;
          } else if (r === 31) {
            if (e = f(t), e !== null) return e;
            e = null;
          } else if (r === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return Ei = e, null;
    }
    function Jp(e) {
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
          switch (Rn()) {
            case cl:
              return 2;
            case ul:
              return 8;
            case An:
            case st:
              return 32;
            case At:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Sd = false, ra = null, oa = null, sa = null, Do = /* @__PURE__ */ new Map(), zo = /* @__PURE__ */ new Map(), ia = [], lS = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function ey(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          ra = null;
          break;
        case "dragenter":
        case "dragleave":
          oa = null;
          break;
        case "mouseover":
        case "mouseout":
          sa = null;
          break;
        case "pointerover":
        case "pointerout":
          Do.delete(t.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          zo.delete(t.pointerId);
      }
    }
    function Ho(e, t, r, s, u, m) {
      return e === null || e.nativeEvent !== m ? (e = {
        blockedOn: t,
        domEventName: r,
        eventSystemFlags: s,
        nativeEvent: m,
        targetContainers: [
          u
        ]
      }, t !== null && (t = nt(t), t !== null && Qp(t)), e) : (e.eventSystemFlags |= s, t = e.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), e);
    }
    function aS(e, t, r, s, u) {
      switch (t) {
        case "focusin":
          return ra = Ho(ra, e, t, r, s, u), true;
        case "dragenter":
          return oa = Ho(oa, e, t, r, s, u), true;
        case "mouseover":
          return sa = Ho(sa, e, t, r, s, u), true;
        case "pointerover":
          var m = u.pointerId;
          return Do.set(m, Ho(Do.get(m) || null, e, t, r, s, u)), true;
        case "gotpointercapture":
          return m = u.pointerId, zo.set(m, Ho(zo.get(m) || null, e, t, r, s, u)), true;
      }
      return false;
    }
    function ty(e) {
      var t = He(e.target);
      if (t !== null) {
        var r = c(t);
        if (r !== null) {
          if (t = r.tag, t === 13) {
            if (t = d(r), t !== null) {
              e.blockedOn = t, vs(e.priority, function() {
                Wp(r);
              });
              return;
            }
          } else if (t === 31) {
            if (t = f(r), t !== null) {
              e.blockedOn = t, vs(e.priority, function() {
                Wp(r);
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
    function ki(e) {
      if (e.blockedOn !== null) return false;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var r = xd(e.nativeEvent);
        if (r === null) {
          r = e.nativeEvent;
          var s = new r.constructor(r.type, r);
          wc = s, r.target.dispatchEvent(s), wc = null;
        } else return t = nt(r), t !== null && Qp(t), e.blockedOn = r, false;
        t.shift();
      }
      return true;
    }
    function ny(e, t, r) {
      ki(e) && r.delete(t);
    }
    function rS() {
      Sd = false, ra !== null && ki(ra) && (ra = null), oa !== null && ki(oa) && (oa = null), sa !== null && ki(sa) && (sa = null), Do.forEach(ny), zo.forEach(ny);
    }
    function _i(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Sd || (Sd = true, l.unstable_scheduleCallback(l.unstable_NormalPriority, rS)));
    }
    var Mi = null;
    function ly(e) {
      Mi !== e && (Mi = e, l.unstable_scheduleCallback(l.unstable_NormalPriority, function() {
        Mi === e && (Mi = null);
        for (var t = 0; t < e.length; t += 3) {
          var r = e[t], s = e[t + 1], u = e[t + 2];
          if (typeof s != "function") {
            if (wd(s || r) === null) continue;
            break;
          }
          var m = nt(r);
          m !== null && (e.splice(t, 3), t -= 3, xu(m, {
            pending: true,
            data: u,
            method: r.method,
            action: s
          }, s, u));
        }
      }));
    }
    function Or(e) {
      function t(X) {
        return _i(X, e);
      }
      ra !== null && _i(ra, e), oa !== null && _i(oa, e), sa !== null && _i(sa, e), Do.forEach(t), zo.forEach(t);
      for (var r = 0; r < ia.length; r++) {
        var s = ia[r];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; 0 < ia.length && (r = ia[0], r.blockedOn === null); ) ty(r), r.blockedOn === null && ia.shift();
      if (r = (e.ownerDocument || e).$$reactFormReplay, r != null) for (s = 0; s < r.length; s += 3) {
        var u = r[s], m = r[s + 1], w = u[tn] || null;
        if (typeof m == "function") w || ly(r);
        else if (w) {
          var M = null;
          if (m && m.hasAttribute("formAction")) {
            if (u = m, w = m[tn] || null) M = w.formAction;
            else if (wd(u) !== null) continue;
          } else M = w.action;
          typeof M == "function" ? r[s + 1] = M : (r.splice(s, 3), s -= 3), ly(r);
        }
      }
    }
    function ay() {
      function e(m) {
        m.canIntercept && m.info === "react-transition" && m.intercept({
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
        u !== null && (u(), u = null), s || setTimeout(r, 20);
      }
      function r() {
        if (!s && !navigation.transition) {
          var m = navigation.currentEntry;
          m && m.url != null && navigation.navigate(m.url, {
            state: m.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if (typeof navigation == "object") {
        var s = false, u = null;
        return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(r, 100), function() {
          s = true, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), u !== null && (u(), u = null);
        };
      }
    }
    function Cd(e) {
      this._internalRoot = e;
    }
    ji.prototype.render = Cd.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null) throw Error(o(409));
      var r = t.current, s = Mn();
      Kp(r, s, e, t, null, null);
    }, ji.prototype.unmount = Cd.prototype.unmount = function() {
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        Kp(e.current, 2, null, e, null, null), ii(), t[dn] = null;
      }
    };
    function ji(e) {
      this._internalRoot = e;
    }
    ji.prototype.unstable_scheduleHydration = function(e) {
      if (e) {
        var t = Zr();
        e = {
          blockedOn: null,
          target: e,
          priority: t
        };
        for (var r = 0; r < ia.length && t !== 0 && t < ia[r].priority; r++) ;
        ia.splice(r, 0, e), r === 0 && ty(e);
      }
    };
    var ry = n.version;
    if (ry !== "19.2.4") throw Error(o(527, ry, "19.2.4"));
    P.findDOMNode = function(e) {
      var t = e._reactInternals;
      if (t === void 0) throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
      return e = p(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
    };
    var oS = {
      bundleType: 0,
      version: "19.2.4",
      rendererPackageName: "react-dom",
      currentDispatcherRef: V,
      reconcilerVersion: "19.2.4"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
      var Li = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Li.isDisabled && Li.supportsFiber) try {
        Kt = Li.inject(oS), Ct = Li;
      } catch {
      }
    }
    return Bo.createRoot = function(e, t) {
      if (!i(e)) throw Error(o(299));
      var r = false, s = "", u = fg, m = hg, w = mg;
      return t != null && (t.unstable_strictMode === true && (r = true), t.identifierPrefix !== void 0 && (s = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (m = t.onCaughtError), t.onRecoverableError !== void 0 && (w = t.onRecoverableError)), t = Pp(e, 1, false, null, null, r, s, null, u, m, w, ay), e[dn] = t.current, ad(e), new Cd(t);
    }, Bo.hydrateRoot = function(e, t, r) {
      if (!i(e)) throw Error(o(299));
      var s = false, u = "", m = fg, w = hg, M = mg, X = null;
      return r != null && (r.unstable_strictMode === true && (s = true), r.identifierPrefix !== void 0 && (u = r.identifierPrefix), r.onUncaughtError !== void 0 && (m = r.onUncaughtError), r.onCaughtError !== void 0 && (w = r.onCaughtError), r.onRecoverableError !== void 0 && (M = r.onRecoverableError), r.formState !== void 0 && (X = r.formState)), t = Pp(e, 1, true, t, r ?? null, s, u, X, m, w, M, ay), t.context = Zp(null), r = t.current, s = Mn(), s = Nn(s), u = Pl(s), u.callback = null, Zl(r, u, s), r = s, t.current.lanes = r, dl(t, r), sl(t), e[dn] = t.current, ad(e), new ji(t);
    }, Bo.version = "19.2.4", Bo;
  }
  var gy;
  function pS() {
    if (gy) return _d.exports;
    gy = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), _d.exports = gS(), _d.exports;
  }
  var yS = pS();
  const bS = "modulepreload", vS = function(l, n) {
    return new URL(l, n).href;
  }, py = {}, wt = function(n, a, o) {
    let i = Promise.resolve();
    if (a && a.length > 0) {
      let d = function(v) {
        return Promise.all(v.map((x) => Promise.resolve(x).then((S) => ({
          status: "fulfilled",
          value: S
        }), (S) => ({
          status: "rejected",
          reason: S
        }))));
      };
      const f = document.getElementsByTagName("link"), h = document.querySelector("meta[property=csp-nonce]"), p = (h == null ? void 0 : h.nonce) || (h == null ? void 0 : h.getAttribute("nonce"));
      i = d(a.map((v) => {
        if (v = vS(v, o), v in py) return;
        py[v] = true;
        const x = v.endsWith(".css"), S = x ? '[rel="stylesheet"]' : "";
        if (!!o) for (let b = f.length - 1; b >= 0; b--) {
          const C = f[b];
          if (C.href === v && (!x || C.rel === "stylesheet")) return;
        }
        else if (document.querySelector(`link[href="${v}"]${S}`)) return;
        const k = document.createElement("link");
        if (k.rel = x ? "stylesheet" : bS, x || (k.as = "script"), k.crossOrigin = "", k.href = v, p && k.setAttribute("nonce", p), document.head.appendChild(k), x) return new Promise((b, C) => {
          k.addEventListener("load", b), k.addEventListener("error", () => C(new Error(`Unable to preload CSS for ${v}`)));
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
  }, yy = (l) => {
    let n;
    const a = /* @__PURE__ */ new Set(), o = (p, v) => {
      const x = typeof p == "function" ? p(n) : p;
      if (!Object.is(x, n)) {
        const S = n;
        n = v ?? (typeof x != "object" || x === null) ? x : Object.assign({}, n, x), a.forEach((E) => E(n, S));
      }
    }, i = () => n, f = {
      setState: o,
      getState: i,
      getInitialState: () => h,
      subscribe: (p) => (a.add(p), () => a.delete(p))
    }, h = n = l(o, i, f);
    return f;
  }, xS = ((l) => l ? yy(l) : yy), wS = (l) => l;
  function SS(l, n = wS) {
    const a = Xr.useSyncExternalStore(l.subscribe, Xr.useCallback(() => n(l.getState()), [
      l,
      n
    ]), Xr.useCallback(() => n(l.getInitialState()), [
      l,
      n
    ]));
    return Xr.useDebugValue(a), a;
  }
  const by = (l) => {
    const n = xS(l), a = (o) => SS(n, o);
    return Object.assign(a, n), a;
  }, St = ((l) => l ? by(l) : by);
  function CS(l, n) {
    let a;
    try {
      a = l();
    } catch {
      return;
    }
    return {
      getItem: (i) => {
        var c;
        const d = (h) => h === null ? null : JSON.parse(h, void 0), f = (c = a.getItem(i)) != null ? c : null;
        return f instanceof Promise ? f.then(d) : d(f);
      },
      setItem: (i, c) => a.setItem(i, JSON.stringify(c, void 0)),
      removeItem: (i) => a.removeItem(i)
    };
  }
  const Af = (l) => (n) => {
    try {
      const a = l(n);
      return a instanceof Promise ? a : {
        then(o) {
          return Af(o)(a);
        },
        catch(o) {
          return this;
        }
      };
    } catch (a) {
      return {
        then(o) {
          return this;
        },
        catch(o) {
          return Af(o)(a);
        }
      };
    }
  }, ES = (l, n) => (a, o, i) => {
    let c = {
      storage: CS(() => window.localStorage),
      partialize: (C) => C,
      version: 0,
      merge: (C, _) => ({
        ..._,
        ...C
      }),
      ...n
    }, d = false, f = 0;
    const h = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
    let v = c.storage;
    if (!v) return l((...C) => {
      console.warn(`[zustand persist middleware] Unable to update item '${c.name}', the given storage is currently unavailable.`), a(...C);
    }, o, i);
    const x = () => {
      const C = c.partialize({
        ...o()
      });
      return v.setItem(c.name, {
        state: C,
        version: c.version
      });
    }, S = i.setState;
    i.setState = (C, _) => (S(C, _), x());
    const E = l((...C) => (a(...C), x()), o, i);
    i.getInitialState = () => E;
    let k;
    const b = () => {
      var C, _;
      if (!v) return;
      const R = ++f;
      d = false, h.forEach((A) => {
        var N;
        return A((N = o()) != null ? N : E);
      });
      const j = ((_ = c.onRehydrateStorage) == null ? void 0 : _.call(c, (C = o()) != null ? C : E)) || void 0;
      return Af(v.getItem.bind(v))(c.name).then((A) => {
        if (A) if (typeof A.version == "number" && A.version !== c.version) {
          if (c.migrate) {
            const N = c.migrate(A.state, A.version);
            return N instanceof Promise ? N.then((T) => [
              true,
              T
            ]) : [
              true,
              N
            ];
          }
          console.error("State loaded from storage couldn't be migrated since no migrate function was provided");
        } else return [
          false,
          A.state
        ];
        return [
          false,
          void 0
        ];
      }).then((A) => {
        var N;
        if (R !== f) return;
        const [T, O] = A;
        if (k = c.merge(O, (N = o()) != null ? N : E), a(k, true), T) return x();
      }).then(() => {
        R === f && (j == null ? void 0 : j(o(), void 0), k = o(), d = true, p.forEach((A) => A(k)));
      }).catch((A) => {
        R === f && (j == null ? void 0 : j(void 0, A));
      });
    };
    return i.persist = {
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
      rehydrate: () => b(),
      hasHydrated: () => d,
      onHydrate: (C) => (h.add(C), () => {
        h.delete(C);
      }),
      onFinishHydration: (C) => (p.add(C), () => {
        p.delete(C);
      })
    }, c.skipHydration || b(), k || E;
  }, eh = ES, $n = {
    dark: "#44ff44",
    light: "#44ff44"
  }, tc = {
    dark: "#ffffff",
    light: "#000000"
  };
  function Nf() {
    return typeof window > "u" || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function vy(l) {
    return l === "system" ? Nf() : l;
  }
  const Ko = 288, Gi = 200, Pi = 480, me = St()(eh((l, n) => ({
    themeSetting: "system",
    theme: Nf(),
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
    explorerWidth: Ko,
    sidebarWidth: Ko,
    setThemeSetting: (a) => l({
      themeSetting: a,
      theme: vy(a)
    }),
    toggleTheme: () => l((a) => {
      const o = a.theme === "dark" ? "light" : "dark";
      return {
        themeSetting: o,
        theme: o
      };
    }),
    syncSystemTheme: () => l((a) => a.themeSetting === "system" ? {
      theme: Nf()
    } : {}),
    setWasmReady: (a) => l({
      wasmReady: a
    }),
    setCursorWorld: (a) => l({
      cursorWorld: a
    }),
    getSelectionColor: () => $n[n().theme],
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
    toggleRightClickMode: () => l((a) => ({
      rightClickMode: a.rightClickMode === "context-menu" ? "zoom" : "context-menu"
    })),
    setRightClickMode: (a) => l({
      rightClickMode: a
    }),
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
      explorerWidth: Math.round(Math.max(Gi, Math.min(Pi, a)))
    }),
    setSidebarWidth: (a) => l({
      sidebarWidth: Math.round(Math.max(Gi, Math.min(Pi, a)))
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
        l.theme = vy(l.themeSetting);
        const n = (a) => Math.round(Math.max(Gi, Math.min(Pi, a)));
        l.explorerWidth = n(l.explorerWidth), l.sidebarWidth = n(l.sidebarWidth);
      }
    }
  }));
  typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    me.getState().syncSystemTheme();
  });
  let Fo = null, Xo = null;
  async function kS() {
    if (Fo) return Fo;
    if (Xo) return Xo;
    Xo = (async () => {
      const l = await wt(() => import("./rosette_wasm-BQLmpKYd.js"), [], import.meta.url);
      return await l.default(), Fo = l, l;
    })();
    try {
      return await Xo;
    } catch (l) {
      throw Xo = null, l;
    }
  }
  function r0() {
    const [l, n] = g.useState(Fo), [a, o] = g.useState(!Fo), [i, c] = g.useState(null), d = me((f) => f.setWasmReady);
    return g.useEffect(() => {
      let f = true;
      return kS().then((h) => {
        f && (n(h), o(false), d(true));
      }).catch((h) => {
        console.error("Failed to load WASM module:", h), f && (c(h), o(false));
      }), () => {
        f = false;
      };
    }, [
      d
    ]), {
      wasm: l,
      isLoading: a,
      error: i,
      isReady: !!l && !a && !i
    };
  }
  const oc = 1.18, sc = 0.82, _S = 1.5, MS = 0.67, jS = 8, LS = 24, o0 = 100, RS = 200, xy = 1e6, wy = 1e3, AS = [
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
  ], Sy = 0.1, s0 = 100, i0 = "'Source Code Pro', monospace", NS = 530, th = 0.72, ye = 50, Zi = Math.pow(2, -6), Rd = 1e-18, Ad = 3, Ye = St((l, n) => ({
    zoom: Zi,
    offset: {
      x: 0,
      y: 0
    },
    initialized: false,
    setZoom: (a) => l({
      zoom: Math.max(Rd, Math.min(Ad, a))
    }),
    zoomAt: (a, o, i) => {
      const c = n(), d = Math.max(Rd, Math.min(Ad, c.zoom * a)), f = (o - c.offset.x) / c.zoom, h = (i - c.offset.y) / c.zoom, p = o - f * d, v = i - h * d;
      l({
        zoom: d,
        offset: {
          x: p,
          y: v
        }
      });
    },
    pan: (a, o) => l((i) => ({
      offset: {
        x: i.offset.x + a,
        y: i.offset.y + o
      }
    })),
    setOffset: (a, o) => l({
      offset: {
        x: a,
        y: o
      }
    }),
    reset: (a, o) => l({
      zoom: Zi,
      offset: {
        x: a / 2,
        y: o / 2
      },
      initialized: true
    }),
    initOffset: (a, o) => {
      n().initialized || l({
        offset: {
          x: a / 2,
          y: o / 2
        },
        initialized: true
      });
    },
    zoomToBounds: (a, o, i, c) => {
      const d = Math.abs(a.maxX - a.minX), f = Math.abs(a.maxY - a.minY), h = 1e3, p = Math.max(d, h), v = Math.max(f, h), x = p * Sy, S = v * Sy, E = p + x * 2, k = v + S * 2, b = (a.minX + a.maxX) / 2, C = (a.minY + a.maxY) / 2, _ = o / E, R = i / k, j = Math.max(Rd, Math.min(_, R, Ad)), A = c ? c.x : o / 2, N = c ? c.y : i / 2, T = {
        x: A - b * j,
        y: N - C * j
      };
      l({
        zoom: j,
        offset: T
      });
    },
    zoomToFit: (a, o, i, c) => {
      if (a) n().zoomToBounds(a, o, i, c);
      else {
        const d = c ? c.x : o / 2, f = c ? c.y : i / 2;
        l({
          zoom: Zi,
          offset: {
            x: d,
            y: f
          },
          initialized: true
        });
      }
    },
    zoomToSelected: (a, o, i, c) => {
      a && n().zoomToBounds(a, o, i, c);
    },
    centerOnBounds: (a, o, i, c) => {
      const d = n(), f = (a.minX + a.maxX) / 2, h = (a.minY + a.maxY) / 2, p = c ? c.x : o / 2, v = c ? c.y : i / 2, x = {
        x: p - f * d.zoom,
        y: v - h * d.zoom
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
    Ye.subscribe(l), l(Ye.getState());
  }
  function Ri(l) {
    const n = l.replace("#", ""), a = Number.parseInt(n.slice(0, 2), 16) / 255, o = Number.parseInt(n.slice(2, 4), 16) / 255, i = Number.parseInt(n.slice(4, 6), 16) / 255;
    return [
      a,
      o,
      i,
      1
    ];
  }
  function TS(l) {
    const { wasm: n, isReady: a } = r0(), [o, i] = g.useState(null), [c, d] = g.useState(false), [f, h] = g.useState(null), p = g.useRef(null), v = me((_) => _.theme), x = me((_) => _.showGrid), { zoom: S, offset: E } = Ye();
    g.useEffect(() => {
      if (!a || !n || !l) return;
      let _ = true;
      async function R() {
        try {
          const j = await n.WasmRenderer.create(l);
          if (!_) {
            j.destroy();
            return;
          }
          j.set_theme(v === "dark");
          const A = $n[v], [N, T, O, D] = Ri(A);
          j.set_selection_color(N, T, O, D);
          const H = tc[v], [$, te, J, ee] = Ri(H);
          j.set_hover_color($, te, J, ee), j.set_dpr(window.devicePixelRatio || 1), p.current = j, i(j), d(true);
        } catch (j) {
          console.error("Failed to create renderer:", j), _ && h(j);
        }
      }
      return R(), () => {
        _ = false, p.current && (p.current.destroy(), p.current = null);
      };
    }, [
      a,
      n,
      l
    ]), g.useEffect(() => {
      if (o && c) {
        o.set_theme(v === "dark");
        const _ = $n[v], [R, j, A, N] = Ri(_);
        o.set_selection_color(R, j, A, N);
        const T = tc[v], [O, D, H, $] = Ri(T);
        o.set_hover_color(O, D, H, $);
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
        const _ = window.devicePixelRatio || 1;
        o.set_viewport(E.x * _, E.y * _, S * _);
      }
    }, [
      o,
      c,
      S,
      E.x,
      E.y
    ]);
    const k = g.useCallback(() => {
      o && c && o.render();
    }, [
      o,
      c
    ]), b = g.useCallback((_, R) => {
      o && c && (o.set_dpr(window.devicePixelRatio || 1), o.resize(_, R));
    }, [
      o,
      c
    ]), C = g.useCallback((_, R) => {
      if (o && c) {
        const j = window.devicePixelRatio || 1, A = o.screen_to_world(_ * j, R * j);
        return {
          x: A[0],
          y: A[1]
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
      resize: b,
      screenToWorld: C
    };
  }
  const qt = St((l) => ({
    activeTool: "select",
    toolSetAt: 0,
    setTool: (n) => l({
      activeTool: n,
      toolSetAt: Date.now()
    })
  })), ue = St((l) => ({
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
      const o = new Set(a.selectedIds);
      if (o.has(n)) {
        o.delete(n);
        const i = a.lastSelectedId === n ? o.size > 0 ? [
          ...o
        ][o.size - 1] : null : a.lastSelectedId;
        return {
          selectedIds: o,
          lastSelectedId: i
        };
      } else return o.add(n), {
        selectedIds: o,
        lastSelectedId: n
      };
    }),
    deselect: (n) => l((a) => {
      const o = new Set(a.selectedIds);
      o.delete(n);
      const i = a.lastSelectedId === n ? o.size > 0 ? [
        ...o
      ][o.size - 1] : null : a.lastSelectedId;
      return {
        selectedIds: o,
        lastSelectedId: i
      };
    }),
    removeFromSelection: (n) => ue.getState().deselect(n),
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
      const o = a.lastSelectedId ?? [
        ...a.selectedIds
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
    selectPrevious: (n) => l((a) => {
      if (n.length === 0) return a;
      if (a.selectedIds.size === 0) {
        const f = n[n.length - 1];
        return {
          selectedIds: /* @__PURE__ */ new Set([
            f
          ]),
          lastSelectedId: f
        };
      }
      const o = a.lastSelectedId ?? [
        ...a.selectedIds
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
  })), cs = St((l) => ({
    isOpen: false,
    position: {
      x: 0,
      y: 0
    },
    variant: "canvas",
    targetId: null,
    open: (n, a, o = null) => l({
      isOpen: true,
      position: a,
      variant: n,
      targetId: o
    }),
    close: () => l({
      isOpen: false
    })
  }));
  function Nd() {
    return `ruler-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  const Oe = St((l, n) => ({
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
      const o = Nd(), i = {
        id: o,
        start: a,
        end: a
      };
      return l((c) => {
        const d = new Map(c.rulers);
        return d.set(o, i), {
          rulers: d,
          activeRulerId: o,
          previewEnd: a
        };
      }), o;
    },
    updatePreview: (a) => {
      const o = n();
      o.activeRulerId && l((i) => {
        const c = new Map(i.rulers), d = c.get(o.activeRulerId);
        return d && c.set(o.activeRulerId, {
          ...d,
          end: a
        }), {
          rulers: c,
          previewEnd: a
        };
      });
    },
    finalizeRuler: (a) => {
      const o = n();
      if (!o.activeRulerId) return null;
      const i = o.rulers.get(o.activeRulerId);
      if (!i) return null;
      const c = {
        ...i,
        end: a
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
      const a = n();
      a.activeRulerId && l((o) => {
        const i = new Map(o.rulers);
        return i.delete(a.activeRulerId), {
          rulers: i,
          activeRulerId: null,
          previewEnd: null
        };
      });
    },
    updateEndpoint: (a, o, i) => {
      l((c) => {
        const d = new Map(c.rulers), f = d.get(a);
        return f && d.set(a, {
          ...f,
          [o]: i
        }), {
          rulers: d
        };
      });
    },
    removeRuler: (a) => {
      l((o) => {
        var _a, _b2;
        const i = new Map(o.rulers);
        i.delete(a);
        const c = new Set(o.selectedRulerIds);
        return c.delete(a), {
          rulers: i,
          selectedRulerIds: c,
          hoveredRulerId: o.hoveredRulerId === a ? null : o.hoveredRulerId,
          hoveredEndpoint: ((_a = o.hoveredEndpoint) == null ? void 0 : _a.rulerId) === a ? null : o.hoveredEndpoint,
          draggingEndpoint: ((_b2 = o.draggingEndpoint) == null ? void 0 : _b2.rulerId) === a ? null : o.draggingEndpoint
        };
      });
    },
    removeRulers: (a) => {
      l((o) => {
        const i = new Map(o.rulers), c = new Set(o.selectedRulerIds);
        for (const d of a) i.delete(d), c.delete(d);
        return {
          rulers: i,
          selectedRulerIds: c,
          hoveredRulerId: a.includes(o.hoveredRulerId ?? "") ? null : o.hoveredRulerId,
          hoveredEndpoint: o.hoveredEndpoint && a.includes(o.hoveredEndpoint.rulerId) ? null : o.hoveredEndpoint,
          draggingEndpoint: o.draggingEndpoint && a.includes(o.draggingEndpoint.rulerId) ? null : o.draggingEndpoint
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
        const o = n().rulers.get(a.rulerId), i = o ? {
          ...o[a.endpoint]
        } : null;
        l({
          draggingEndpoint: a,
          draggingEndpointOriginal: i
        });
      } else l({
        draggingEndpoint: null
      });
    },
    endDraggingEndpoint: () => {
      const a = n(), { draggingEndpoint: o, draggingEndpointOriginal: i, rulers: c } = a;
      if (!o || !i) return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), null;
      const d = c.get(o.rulerId);
      if (!d) return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), null;
      const f = d[o.endpoint], h = f.x !== i.x || f.y !== i.y;
      return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), h ? {
        rulerId: o.rulerId,
        endpoint: o.endpoint,
        oldPosition: i,
        newPosition: {
          ...f
        }
      } : null;
    },
    selectRuler: (a) => l({
      selectedRulerIds: a ? /* @__PURE__ */ new Set([
        a
      ]) : /* @__PURE__ */ new Set()
    }),
    toggleSelection: (a) => l((o) => {
      const i = new Set(o.selectedRulerIds);
      return i.has(a) ? i.delete(a) : i.add(a), {
        selectedRulerIds: i
      };
    }),
    addToSelection: (a) => {
      l((o) => {
        const i = new Set(o.selectedRulerIds);
        for (const c of a) i.add(c);
        return {
          selectedRulerIds: i
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
      const o = n();
      if (!o.isMovingRuler || o.selectedRulerIds.size === 0 || !o.moveStartPoint) return;
      const i = a.x - o.moveStartPoint.x, c = a.y - o.moveStartPoint.y;
      l((d) => {
        const f = new Map(d.rulers);
        for (const h of o.selectedRulerIds) {
          const p = f.get(h);
          p && f.set(h, {
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
          moveStartPoint: a
        };
      });
    },
    endMoveRuler: () => {
      const a = n(), { selectedRulerIds: o, moveStartPoint: i, moveOriginalPoint: c } = a;
      let d = null;
      if (i && c && o.size > 0) {
        const f = i.x - c.x, h = i.y - c.y;
        (f !== 0 || h !== 0) && (d = {
          rulerIds: [
            ...o
          ],
          deltaX: f,
          deltaY: h
        });
      }
      return l({
        isMovingRuler: false,
        moveStartPoint: null,
        moveOriginalPoint: null
      }), d;
    },
    deleteSelectedRulers: () => {
      const a = n();
      a.selectedRulerIds.size > 0 && n().removeRulers(Array.from(a.selectedRulerIds));
    },
    addRuler: (a, o) => {
      const i = Nd(), c = {
        id: i,
        start: a,
        end: o
      };
      return l((d) => {
        const f = new Map(d.rulers);
        return f.set(i, c), {
          rulers: f
        };
      }), i;
    },
    restoreRulers: (a) => {
      const o = [];
      return l((i) => {
        const c = new Map(i.rulers);
        for (const d of a) {
          const f = Nd();
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
    setSnapPoint: (a) => l({
      snapPoint: a
    })
  })), Se = St((l) => ({
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
  function c0(l) {
    const n = [
      l.name
    ];
    for (const a of l.children) n.push(...c0(a));
    return n;
  }
  function OS(l) {
    const n = /* @__PURE__ */ new Set(), a = [];
    for (const o of l) for (const i of c0(o)) n.has(i) || (n.add(i), a.push(i));
    return a;
  }
  function u0(l) {
    const n = [];
    if (l.children.length > 0) {
      n.push(l.name);
      for (const a of l.children) n.push(...u0(a));
    }
    return n;
  }
  function d0(l) {
    return [
      ...l
    ].sort((n, a) => n.name.localeCompare(a.name)).map((n) => ({
      ...n,
      children: n.children.length > 0 ? d0(n.children) : n.children
    }));
  }
  function IS(l) {
    function n(o) {
      if (o.children.length === 0) return 1;
      let i = 0;
      for (const c of o.children) i = Math.max(i, n(c));
      return 1 + i;
    }
    let a = 0;
    for (const o of l) a = Math.max(a, n(o));
    return a;
  }
  const he = St()(eh((l) => ({
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
    setCells: (n) => l((a) => {
      const o = [
        ...n
      ].sort((c, d) => c.localeCompare(d)), i = a.activeCell && o.includes(a.activeCell) ? a.activeCell : o[0] ?? null;
      return {
        cells: o,
        activeCell: i,
        cellsLoaded: true
      };
    }),
    setCellTree: (n) => l((a) => {
      var _a;
      const o = d0(n), i = OS(o), c = IS(o), d = a.expandedCells.size === 0 ? new Set(o.flatMap(u0)) : a.expandedCells, f = a.activeCell && i.includes(a.activeCell) ? a.activeCell : i[0] ?? null, h = ((_a = a.focusedItem) == null ? void 0 : _a.type) === "cell" && !i.includes(a.focusedItem.name) ? null : a.focusedItem;
      return {
        cellTree: o,
        cells: i,
        expandedCells: d,
        activeCell: f,
        focusedItem: h,
        maxTreeDepth: c,
        cellsLoaded: true
      };
    }),
    toggleExpanded: (n) => l((a) => {
      const o = new Set(a.expandedCells);
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
    renameCell: (n, a) => l((o) => {
      var _a;
      const i = o.cells.map((h) => h === n ? a : h).sort((h, p) => h.localeCompare(p)), c = o.activeCell === n ? a : o.activeCell, d = ((_a = o.focusedItem) == null ? void 0 : _a.type) === "cell" && o.focusedItem.name === n ? {
        type: "cell",
        name: a
      } : o.focusedItem, f = new Set(o.hiddenCells);
      return f.has(n) && (f.delete(n), f.add(a)), {
        cells: i,
        activeCell: c,
        focusedItem: d,
        hiddenCells: f
      };
    }),
    removeCell: (n) => l((a) => {
      var _a;
      const o = a.cells.filter((f) => f !== n), i = a.activeCell === n ? o[0] ?? null : a.activeCell, c = ((_a = a.focusedItem) == null ? void 0 : _a.type) === "cell" && a.focusedItem.name === n ? null : a.focusedItem, d = new Set(a.hiddenCells);
      return d.delete(n), {
        cells: o,
        activeCell: i,
        focusedItem: c,
        hiddenCells: d
      };
    }),
    addCell: (n) => l((a) => a.cells.includes(n) ? a : {
      cells: [
        ...a.cells,
        n
      ].sort((i, c) => i.localeCompare(c))
    }),
    toggleCellVisibility: (n) => l((a) => {
      const o = new Set(a.hiddenCells);
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
    setFocused: (n) => l((a) => {
      if (n) {
        const o = a.activeCell ?? a.cells[0] ?? null;
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
  function nh() {
    const l = he.getState().cells;
    let n = 1, a = `cell${n}`;
    for (; l.includes(a); ) n++, a = `cell${n}`;
    return a;
  }
  he.subscribe((l, n) => {
    l.projectName !== n.projectName && wt(async () => {
      const { useTabsStore: a } = await Promise.resolve().then(() => t1);
      return {
        useTabsStore: a
      };
    }, void 0, import.meta.url).then(({ useTabsStore: a }) => {
      const { activeTabId: o, getActiveTab: i, updateTab: c } = a.getState();
      if (!o) return;
      const d = i();
      d && !d.filePath && c(o, {
        title: l.projectName
      });
    });
  });
  const Ki = St((l) => ({
    cellName: null,
    bounds: null,
    origin: {
      x: 0,
      y: 0
    },
    startDrag: (n, a, o) => l({
      cellName: n,
      bounds: a,
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
  })), lh = "img:";
  function xn(l) {
    return l.startsWith(lh);
  }
  function Ln(l) {
    return l.slice(lh.length);
  }
  function Ga(l) {
    return lh + l;
  }
  function es(l, n) {
    const { images: a } = ut.getState(), o = he.getState().activeCell;
    let i = null, c = 1 / 0;
    for (const d of a.values()) if (d.cellName === o && l >= d.x && l <= d.x + d.width && n >= d.y && n <= d.y + d.height) {
      const f = d.width * d.height;
      f < c && (c = f, i = Ga(d.id));
    }
    return i;
  }
  function Cy(l, n, a, o) {
    const { images: i } = ut.getState(), c = he.getState().activeCell, d = [];
    for (const f of i.values()) {
      if (f.cellName !== c) continue;
      const h = f.x + f.width, p = f.y + f.height;
      f.x <= a && h >= l && f.y <= o && p >= n && d.push(Ga(f.id));
    }
    return d;
  }
  const ut = St((l, n) => ({
    images: /* @__PURE__ */ new Map(),
    addImage: (a) => {
      const o = new Map(n().images);
      o.set(a.id, a), l({
        images: o
      });
    },
    removeImage: (a) => {
      const o = new Map(n().images);
      o.delete(a), l({
        images: o
      });
    },
    updateImage: (a, o) => {
      const i = new Map(n().images), c = i.get(a);
      c && (i.set(a, {
        ...c,
        ...o
      }), l({
        images: i
      }));
    },
    clearImages: () => {
      for (const a of n().images.values()) URL.revokeObjectURL(a.url);
      l({
        images: /* @__PURE__ */ new Map()
      });
    }
  }));
  let Ba = null;
  const cn = St((l) => ({
    message: null,
    level: "info",
    show: (n, a = "info", o = 3e3) => {
      Ba !== null && clearTimeout(Ba), l({
        message: n,
        level: a
      }), Ba = setTimeout(() => {
        l({
          message: null
        }), Ba = null;
      }, o);
    },
    clear: () => {
      Ba !== null && (clearTimeout(Ba), Ba = null), l({
        message: null
      });
    }
  })), Wn = St((l) => ({
    isDirty: false,
    markDirty: () => l({
      isDirty: true
    }),
    markClean: () => l({
      isDirty: false
    })
  }));
  let Td = null;
  function DS(l) {
    const n = (a) => {
      const o = a.useTabsStore.getState().activeTabId;
      o && a.useTabsStore.getState().updateTab(o, {
        isDirty: l
      });
    };
    Td ? n(Td) : wt(() => Promise.resolve().then(() => t1), void 0, import.meta.url).then((a) => {
      Td = a, n(a);
    });
  }
  Wn.subscribe((l, n) => {
    l.isDirty !== n.isDirty && DS(l.isDirty);
  });
  const Ey = 100, fe = St((l, n) => ({
    undoStack: [],
    redoStack: [],
    canUndo: false,
    canRedo: false,
    execute: (a, o) => {
      try {
        a.execute(o);
      } catch (i) {
        cn.getState().show(String(i), "warn");
        return;
      }
      Se.getState().bumpSyncGeneration(), Wn.getState().markDirty(), l((i) => {
        const c = [
          ...i.undoStack,
          a
        ];
        return c.length > Ey && c.shift(), {
          undoStack: c,
          redoStack: [],
          canUndo: true,
          canRedo: false
        };
      });
    },
    undo: (a) => {
      const { undoStack: o } = n();
      if (o.length === 0) return;
      const i = o[o.length - 1];
      try {
        i.undo(a);
      } catch (c) {
        cn.getState().show(String(c), "warn");
        return;
      }
      Se.getState().bumpSyncGeneration(), Wn.getState().markDirty(), l((c) => {
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
    redo: (a) => {
      const { redoStack: o } = n();
      if (o.length === 0) return;
      const i = o[o.length - 1];
      try {
        i.execute(a);
      } catch (c) {
        cn.getState().show(String(c), "warn");
        return;
      }
      Se.getState().bumpSyncGeneration(), Wn.getState().markDirty(), l((c) => {
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
    pushCommand: (a) => {
      Wn.getState().markDirty(), l((o) => {
        const i = [
          ...o.undoStack,
          a
        ];
        return i.length > Ey && i.shift(), {
          undoStack: i,
          redoStack: [],
          canUndo: true,
          canRedo: false
        };
      });
    }
  })), jn = St((l) => ({
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
  })), Tf = {
    solid: 0,
    hatched: 1,
    crosshatched: 2,
    dotted: 3,
    horizontal: 4,
    vertical: 5,
    zigzag: 6,
    brick: 7
  }, Qo = [
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
  ], Of = 999, Wo = [
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
      name: "text",
      color: "#607d8b",
      visible: true,
      fillPattern: "dotted",
      opacity: 0.7
    }
  ], ve = St((l, n) => ({
    layers: new Map(Wo.map((a) => [
      a.id,
      a
    ])),
    activeLayerId: 1,
    editingLayerId: null,
    expandedLayerId: null,
    isFocused: false,
    focusedLayerId: null,
    getLayer: (a) => n().layers.get(a),
    getActiveLayer: () => {
      const a = n();
      return a.layers.get(a.activeLayerId);
    },
    setActiveLayer: (a) => l({
      activeLayerId: a
    }),
    setLayer: (a) => l((o) => {
      const i = new Map(o.layers);
      return i.set(a.id, a), {
        layers: i
      };
    }),
    addLayer: (a, o) => {
      const i = n(), c = Array.from(i.layers.values());
      let d = 1;
      const f = new Set(c.map((E) => E.layerNumber));
      for (; f.has(d) && d <= Of; ) d++;
      if (d > Of) return c[0];
      const p = Math.max(0, ...c.map((E) => E.id)) + 1, v = new Set(c.map((E) => E.color)), x = o ?? Qo.find((E) => !v.has(E)) ?? Qo[c.length % Qo.length], S = {
        id: p,
        layerNumber: d,
        datatype: 0,
        name: a ?? `layer${d}`,
        color: x,
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
    deleteLayer: (a) => l((o) => {
      if (o.layers.size <= 1) return o;
      const i = new Map(o.layers);
      i.delete(a);
      let c = o.activeLayerId;
      o.activeLayerId === a && (c = i.keys().next().value ?? 1);
      const d = o.focusedLayerId === a ? null : o.focusedLayerId;
      return {
        layers: i,
        activeLayerId: c,
        focusedLayerId: d
      };
    }),
    toggleVisibility: (a) => l((o) => {
      const i = o.layers.get(a);
      if (!i) return o;
      const c = new Map(o.layers);
      return c.set(a, {
        ...i,
        visible: !i.visible
      }), {
        layers: c
      };
    }),
    showAllLayers: () => l((a) => {
      const o = new Map(a.layers);
      for (const [i, c] of o) o.set(i, {
        ...c,
        visible: true
      });
      return {
        layers: o
      };
    }),
    hideAllLayers: () => l((a) => {
      const o = new Map(a.layers);
      for (const [i, c] of o) o.set(i, {
        ...c,
        visible: false
      });
      return {
        layers: o
      };
    }),
    getAllLayers: () => Array.from(n().layers.values()).sort((a, o) => a.layerNumber - o.layerNumber || a.datatype - o.datatype),
    layerExists: (a, o) => {
      const i = n().layers;
      for (const c of i.values()) if (c.layerNumber === a && c.datatype === o) return true;
      return false;
    },
    resetLayers: (a) => l(() => {
      var _a;
      const o = new Map(a.map((c) => [
        c.id,
        c
      ])), i = ((_a = a[0]) == null ? void 0 : _a.id) ?? 1;
      return {
        layers: o,
        activeLayerId: i,
        editingLayerId: null,
        expandedLayerId: null,
        isFocused: false,
        focusedLayerId: null
      };
    }),
    setEditingLayerId: (a) => l({
      editingLayerId: a
    }),
    setExpandedLayerId: (a) => l({
      expandedLayerId: a
    }),
    setFocused: (a) => {
      if (a) {
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
    setFocusedLayerId: (a) => l({
      focusedLayerId: a
    })
  }));
  function ic(l, n = 0.7) {
    const a = l.replace("#", ""), o = Number.parseInt(a.slice(0, 2), 16) / 255, i = Number.parseInt(a.slice(2, 4), 16) / 255, c = Number.parseInt(a.slice(4, 6), 16) / 255;
    return [
      o,
      i,
      c,
      n
    ];
  }
  function If(l) {
    return {
      minX: l[0],
      minY: l[1],
      maxX: l[2],
      maxY: l[3]
    };
  }
  function Df(l) {
    return {
      x: (l.minX + l.maxX) / 2,
      y: (l.minY + l.maxY) / 2
    };
  }
  function zS(l, n) {
    const a = /* @__PURE__ */ new Set(), o = [];
    for (const i of n) {
      if (a.has(i)) continue;
      const d = l.get_group_ids(i).filter((f) => n.has(f));
      for (const f of d) a.add(f);
      d.length > 0 && o.push(d);
    }
    return o;
  }
  function HS(l, n, a, o) {
    const i = zS(l, n);
    if (o === "origin-align") return YS(l, i);
    if (i.length < 2 || !a) return [];
    const c = i.findIndex((v) => v.includes(a));
    if (c === -1) return [];
    const d = l.get_bounds_for_ids(i[c]);
    if (!d) return [];
    const f = If(d), h = Df(f), p = [];
    for (let v = 0; v < i.length; v++) {
      if (v === c) continue;
      const x = i[v], S = l.get_bounds_for_ids(x);
      if (!S) continue;
      const E = If(S), k = Df(E);
      let b = 0, C = 0;
      switch (o) {
        case "align-left":
          b = f.minX - E.minX;
          break;
        case "align-center-h":
          b = h.x - k.x;
          break;
        case "align-right":
          b = f.maxX - E.maxX;
          break;
        case "align-top":
          C = f.minY - E.minY;
          break;
        case "align-center-v":
          C = h.y - k.y;
          break;
        case "align-bottom":
          C = f.maxY - E.maxY;
          break;
        case "center-align":
          b = h.x - k.x, C = h.y - k.y;
          break;
      }
      (b !== 0 || C !== 0) && p.push({
        ids: x,
        dx: b,
        dy: C
      });
    }
    return p;
  }
  function YS(l, n) {
    const a = [];
    for (const o of n) {
      const i = l.get_bounds_for_ids(o);
      if (!i) continue;
      const c = Df(If(i)), d = -c.x, f = -c.y;
      (d !== 0 || f !== 0) && a.push({
        ids: o,
        dx: d,
        dy: f
      });
    }
    return a;
  }
  const f0 = 100 * ye, cc = 64, tt = St((l, n) => ({
    width: f0,
    cornerRadius: 0,
    numArcPoints: cc,
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
    setPathMetadata: (a, o) => {
      const i = new Map(n().pathMetadata);
      i.set(a, o), l({
        pathMetadata: i
      });
    },
    removePathMetadata: (a) => {
      const o = new Map(n().pathMetadata);
      o.delete(a), l({
        pathMetadata: o
      });
    },
    removePathMetadataMany: (a) => {
      const o = n().pathMetadata;
      let i = false;
      const c = new Map(o);
      for (const d of a) c.delete(d) && (i = true);
      i && l({
        pathMetadata: c
      });
    },
    translateWaypoints: (a, o, i) => {
      const c = n().pathMetadata;
      let d = false;
      const f = new Map(c);
      for (const h of a) {
        const p = f.get(h);
        p && (f.set(h, {
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
  })), ky = 8;
  function _y(l, n) {
    const a = n.x - l.x, o = n.y - l.y;
    if (a === 0 && o === 0) return n;
    const i = Math.abs(Math.atan2(Math.abs(o), Math.abs(a)) * (180 / Math.PI));
    return i <= ky ? {
      x: n.x,
      y: l.y
    } : i >= 90 - ky ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function BS(l, n, a = 64) {
    const o = l.length;
    if (o < 3 || n <= 0) return l;
    const i = [];
    for (let p = 0; p < o - 1; p++) {
      const v = l[p + 1].x - l[p].x, x = l[p + 1].y - l[p].y;
      i.push(Math.sqrt(v * v + x * x));
    }
    const c = o - 2, d = [];
    for (let p = 1; p < o - 1; p++) {
      const v = l[p - 1], x = l[p], S = l[p + 1], E = i[p - 1], k = i[p];
      if (E < 1e-10 || k < 1e-10) {
        d.push(null);
        continue;
      }
      const b = (x.x - v.x) / E, C = (x.y - v.y) / E, _ = (S.x - x.x) / k, R = (S.y - x.y) / k, j = b * R - C * _, A = b * _ + C * R, N = Math.atan2(j, A);
      Math.abs(N) < 1e-6 ? d.push(null) : d.push(N);
    }
    const f = d.map((p) => {
      if (p === null) return 0;
      const v = Math.abs(p) / 2;
      return n * Math.tan(v);
    });
    for (let p = 0; p < 3; p++) for (let v = 0; v < i.length; v++) {
      const x = i[v] * 0.95, S = v > 0 ? v - 1 : null, E = v < c ? v : null, k = S !== null ? f[S] : 0, b = E !== null ? f[E] : 0, C = k + b;
      if (C > x && C > 1e-10) {
        const _ = x / C;
        S !== null && (f[S] = Math.min(f[S], k * _)), E !== null && (f[E] = Math.min(f[E], b * _));
      }
    }
    const h = [
      l[0]
    ];
    for (let p = 0; p < c; p++) {
      const v = p + 1, x = l[v], S = d[p];
      if (S === null) {
        h.push(x);
        continue;
      }
      const E = f[p], k = Math.abs(S) / 2, b = Math.tan(k), C = Math.abs(b) > 1e-10 ? E / b : 0;
      if (C < 1e-6 || E < 1e-6) {
        h.push(x);
        continue;
      }
      const _ = l[v - 1], R = l[v + 1], j = i[v - 1], A = i[v], N = (x.x - _.x) / j, T = (x.y - _.y) / j, O = (R.x - x.x) / A, D = (R.y - x.y) / A, H = S > 0 ? 1 : -1, $ = x.x + N * -E, te = x.y + T * -E, J = x.x + O * E, ee = x.y + D * E, ge = -T * H, Ce = N * H, V = $ + ge * C, P = te + Ce * C, pe = $ - V, xe = te - P, be = Math.min(Math.max(Math.ceil(Math.abs(S) * 180 / Math.PI * 2), 8), a);
      h.push({
        x: $,
        y: te
      });
      for (let L = 1; L < be; L++) {
        const I = L / be, Z = S * I, W = Math.cos(Z), G = Math.sin(Z);
        h.push({
          x: V + pe * W - xe * G,
          y: P + pe * G + xe * W
        });
      }
      h.push({
        x: J,
        y: ee
      });
    }
    return h.push(l[o - 1]), h;
  }
  function h0(l, n = 0) {
    const a = l.length;
    if (a < 2) return 0;
    if (n <= 0 || a < 3) {
      let h = 0;
      for (let p = 1; p < a; p++) {
        const v = l[p].x - l[p - 1].x, x = l[p].y - l[p - 1].y;
        h += Math.sqrt(v * v + x * x);
      }
      return h;
    }
    const o = [];
    for (let h = 0; h < a - 1; h++) {
      const p = l[h + 1].x - l[h].x, v = l[h + 1].y - l[h].y;
      o.push(Math.sqrt(p * p + v * v));
    }
    const i = a - 2, c = [];
    for (let h = 1; h < a - 1; h++) {
      const p = l[h - 1], v = l[h], x = l[h + 1], S = o[h - 1], E = o[h];
      if (S < 1e-10 || E < 1e-10) {
        c.push(null);
        continue;
      }
      const k = (v.x - p.x) / S, b = (v.y - p.y) / S, C = (x.x - v.x) / E, _ = (x.y - v.y) / E, R = k * _ - b * C, j = k * C + b * _, A = Math.atan2(R, j);
      c.push(Math.abs(A) < 1e-6 ? null : A);
    }
    const d = c.map((h) => h === null ? 0 : n * Math.tan(Math.abs(h) / 2));
    for (let h = 0; h < 3; h++) for (let p = 0; p < o.length; p++) {
      const v = o[p] * 0.95, x = p > 0 ? p - 1 : null, S = p < i ? p : null, E = x !== null ? d[x] : 0, k = S !== null ? d[S] : 0, b = E + k;
      if (b > v && b > 1e-10) {
        const C = v / b;
        x !== null && (d[x] = Math.min(d[x], E * C)), S !== null && (d[S] = Math.min(d[S], k * C));
      }
    }
    let f = 0;
    for (let h = 0; h < o.length; h++) f += o[h];
    for (let h = 0; h < i; h++) {
      const p = c[h];
      if (p === null) continue;
      const v = Math.abs(p) / 2, x = Math.tan(v);
      if (Math.abs(x) < 1e-10) continue;
      const S = d[h] / x;
      f -= d[h] * 2, f += S * Math.abs(p);
    }
    return Math.max(0, f);
  }
  function m0(l, n) {
    const a = l.length;
    if (a < 3 || n <= 0) return [];
    const o = [];
    for (let h = 0; h < a - 1; h++) {
      const p = l[h + 1].x - l[h].x, v = l[h + 1].y - l[h].y;
      o.push(Math.sqrt(p * p + v * v));
    }
    const i = a - 2, c = [];
    for (let h = 1; h < a - 1; h++) {
      const p = l[h - 1], v = l[h], x = l[h + 1], S = o[h - 1], E = o[h];
      if (S < 1e-10 || E < 1e-10) {
        c.push(null);
        continue;
      }
      const k = (v.x - p.x) / S, b = (v.y - p.y) / S, C = (x.x - v.x) / E, _ = (x.y - v.y) / E, R = k * _ - b * C, j = k * C + b * _, A = Math.atan2(R, j);
      c.push(Math.abs(A) < 1e-6 ? null : A);
    }
    const d = c.map((h) => h === null ? 0 : n * Math.tan(Math.abs(h) / 2));
    for (let h = 0; h < 3; h++) for (let p = 0; p < o.length; p++) {
      const v = o[p] * 0.95, x = p > 0 ? p - 1 : null, S = p < i ? p : null, E = x !== null ? d[x] : 0, k = S !== null ? d[S] : 0, b = E + k;
      if (b > v && b > 1e-10) {
        const C = v / b;
        x !== null && (d[x] = Math.min(d[x], E * C)), S !== null && (d[S] = Math.min(d[S], k * C));
      }
    }
    const f = [];
    for (let h = 0; h < i; h++) {
      const p = c[h];
      if (p === null) continue;
      const v = Math.abs(p) / 2, x = Math.tan(v);
      if (Math.abs(x) < 1e-10) continue;
      const S = d[h] / x;
      S < n - 1e-6 && f.push({
        cornerIndex: h + 1,
        requested: n,
        actual: S
      });
    }
    return f;
  }
  function nc(l, n) {
    if (n <= 0) return 0;
    const a = m0(l, n);
    return a.length === 0 ? n : Math.min(...a.map((o) => o.actual));
  }
  function XS(l, n, a = 0, o = 64) {
    const i = a > 0 ? BS(l, a, o) : l;
    if (i.length < 2) return [];
    const c = n / 2, d = i.length, f = [], h = [];
    for (let p = 0; p < d; p++) {
      const v = i[p];
      let x, S;
      if (p === 0) {
        const E = i[1], k = E.x - v.x, b = E.y - v.y, C = Math.sqrt(k * k + b * b);
        if (C < 1e-10) continue;
        x = -b / C * c, S = k / C * c;
      } else if (p === d - 1) {
        const E = i[d - 2], k = v.x - E.x, b = v.y - E.y, C = Math.sqrt(k * k + b * b);
        if (C < 1e-10) continue;
        x = -b / C * c, S = k / C * c;
      } else {
        const E = i[p - 1], k = i[p + 1], b = v.x - E.x, C = v.y - E.y, _ = Math.sqrt(b * b + C * C), R = k.x - v.x, j = k.y - v.y, A = Math.sqrt(R * R + j * j);
        if (_ < 1e-10 || A < 1e-10) continue;
        const N = -C / _, T = b / _, O = -j / A, D = R / A, H = N * O + T * D, $ = Math.acos(Math.min(1, Math.max(-1, H))), te = Math.cos($ / 2), J = te > 1e-6 ? 1 / te : 1, ee = (N + O) / 2, ge = (T + D) / 2, Ce = Math.sqrt(ee * ee + ge * ge);
        Ce < 1e-10 ? (x = N * c, S = T * c) : (x = ee / Ce * c * J, S = ge / Ce * c * J);
      }
      f.push({
        x: v.x + x,
        y: v.y + S
      }), h.push({
        x: v.x - x,
        y: v.y - S
      });
    }
    return h.reverse(), [
      ...f,
      ...h
    ];
  }
  class g0 {
    constructor(n, a, o, i, c, d = 0) {
      __publicField(this, "type", "create-rectangle");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.x = n, this.y = a, this.width = o, this.height = i, this.layer = c, this.datatype = d, this.description = `Create rectangle at (${n}, ${a})`;
    }
    execute(n) {
      const a = n.library.add_rectangle(this.x, this.y, this.width, this.height, this.layer, this.datatype);
      a && (this.elementId = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ue.getState().select(a));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: o } = ue.getState();
        a.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  function Jn(l, n) {
    const a = [], o = /* @__PURE__ */ new Set();
    for (const i of n) {
      if (i.startsWith("img:")) {
        const p = Ln(i), v = ut.getState().images.get(p);
        v && a.push({
          type: "image",
          url: v.url,
          filename: v.filename,
          x: v.x,
          y: v.y,
          width: v.width,
          height: v.height,
          naturalWidth: v.naturalWidth,
          naturalHeight: v.naturalHeight,
          lockAspectRatio: v.lockAspectRatio
        });
        continue;
      }
      if (i.startsWith("ref:")) {
        const p = i.split(":")[1];
        if (o.has(p)) continue;
        o.add(p);
        const v = l.get_cell_ref_info(i);
        if (v) {
          const x = l.get_cell_ref_array(i);
          a.push({
            type: "cell-ref",
            cellName: v.cell_name,
            transform: new Float64Array(v.transform),
            repetition: x ? new Float64Array(x) : null
          }), v.free();
        }
        continue;
      }
      const c = l.get_cell_ref_info(i);
      if (c) {
        const p = l.get_cell_ref_array(i);
        a.push({
          type: "cell-ref",
          cellName: c.cell_name,
          transform: new Float64Array(c.transform),
          repetition: p ? new Float64Array(p) : null
        }), c.free();
        continue;
      }
      const d = l.get_text_element_info(i);
      if (d) {
        a.push({
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
        a.push({
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
      const h = l.get_element_info(i);
      h && (a.push({
        type: "polygon",
        vertices: new Float64Array(h.vertices),
        layer: h.layer,
        datatype: h.datatype
      }), h.free());
    }
    return a;
  }
  function Pa(l, n) {
    const a = [];
    for (const o of n) if (o.type === "cell-ref") {
      const i = l.add_cell_ref_with_transform(o.cellName, o.transform);
      i && (o.repetition && l.set_cell_ref_array(i, o.repetition[0], o.repetition[1], o.repetition[2], o.repetition[3]), a.push(i));
    } else if (o.type === "text") {
      const i = l.add_text(o.text, o.x, o.y, o.height, o.layer, o.datatype);
      i && a.push(i);
    } else if (o.type === "path") {
      const i = new Float64Array(o.waypoints.length * 2);
      for (let d = 0; d < o.waypoints.length; d++) i[d * 2] = o.waypoints[d].x, i[d * 2 + 1] = o.waypoints[d].y;
      const c = l.create_path_rounded(i, o.width, o.cornerRadius, o.numArcPoints, o.layer, o.datatype);
      if (c) {
        a.push(c);
        const d = o.waypoints.map((f) => ({
          ...f
        }));
        tt.getState().setPathMetadata(c, {
          waypoints: d,
          width: o.width,
          cornerRadius: o.cornerRadius,
          actualCornerRadius: nc(d, o.cornerRadius),
          numArcPoints: o.numArcPoints,
          layer: o.layer,
          datatype: o.datatype
        });
      }
    } else if (o.type === "image") {
      const i = crypto.randomUUID(), c = {
        id: i,
        url: o.url,
        filename: o.filename,
        x: o.x,
        y: o.y,
        width: o.width,
        height: o.height,
        naturalWidth: o.naturalWidth,
        naturalHeight: o.naturalHeight,
        lockAspectRatio: o.lockAspectRatio,
        cellName: he.getState().activeCell ?? ""
      };
      ut.getState().addImage(c), a.push(Ga(i));
    } else {
      const i = l.add_polygon(o.vertices, o.layer, o.datatype);
      i && a.push(i);
    }
    return a;
  }
  class uc {
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
      let a = this.restoredIds.length > 0 ? this.restoredIds : this.elementIds;
      this.snapshots.length === 0 && (this.snapshots = Jn(n.library, a)), tt.getState().removePathMetadataMany(a);
      const o = [], i = [];
      for (const c of a) c.startsWith("img:") ? o.push(c) : i.push(c);
      for (const c of o) ut.getState().removeImage(Ln(c));
      i.length > 0 && n.library.remove_elements(i), this.restoredIds = [], Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ue.getState().clearSelection();
    }
    undo(n) {
      this.restoredIds = Pa(n.library, this.snapshots), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.restoredIds.length > 0 && ue.getState().setSelection(new Set(this.restoredIds));
    }
  }
  class ts {
    constructor() {
      __publicField(this, "type", "paste-elements");
      __publicField(this, "description");
      __publicField(this, "createdIds", []);
      __publicField(this, "createdPathIds", []);
      __publicField(this, "snapshots");
      const { elements: n } = jn.getState();
      this.snapshots = n.map((o) => o.type === "cell-ref" ? {
        type: "cell-ref",
        cellName: o.cellName,
        transform: new Float64Array(o.transform),
        repetition: o.repetition ? new Float64Array(o.repetition) : null
      } : o.type === "text" ? {
        ...o
      } : o.type === "image" ? {
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
      const a = this.snapshots.length;
      this.description = a === 1 ? "Paste element" : `Paste ${a} elements`;
    }
    execute(n) {
      this.snapshots.length !== 0 && (this.createdIds = Pa(n.library, this.snapshots), this.createdPathIds = this.createdIds.filter((a) => tt.getState().pathMetadata.has(a)), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && ue.getState().setSelection(new Set(this.createdIds)));
    }
    undo(n) {
      tt.getState().removePathMetadataMany(this.createdPathIds);
      const a = [], o = [];
      for (const i of this.createdIds) i.startsWith("img:") ? a.push(i) : o.push(i);
      for (const i of a) ut.getState().removeImage(Ln(i));
      o.length > 0 && n.library.remove_elements(o), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ue.getState().clearSelection();
    }
  }
  class ns {
    constructor(n) {
      __publicField(this, "type", "duplicate-elements");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "createdIds", []);
      __publicField(this, "createdPathIds", []);
      this.elementIds = n;
      const a = n.length;
      this.description = a === 1 ? "Duplicate element" : `Duplicate ${a} elements`;
    }
    execute(n) {
      this.snapshots.length === 0 && (this.snapshots = Jn(n.library, this.elementIds)), this.createdIds = Pa(n.library, this.snapshots), this.createdPathIds = this.createdIds.filter((a) => tt.getState().pathMetadata.has(a)), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && ue.getState().setSelection(new Set(this.createdIds));
    }
    undo(n) {
      tt.getState().removePathMetadataMany(this.createdPathIds);
      const a = [], o = [];
      for (const i of this.createdIds) i.startsWith("img:") ? a.push(i) : o.push(i);
      for (const i of a) ut.getState().removeImage(Ln(i));
      o.length > 0 && n.library.remove_elements(o), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.elementIds.length > 0 ? ue.getState().setSelection(new Set(this.elementIds)) : ue.getState().clearSelection();
    }
  }
  function US(l, n, a) {
    if (l.type === "polygon") {
      const o = new Float64Array(l.vertices.length);
      for (let i = 0; i < o.length; i += 2) o[i] = l.vertices[i] + n, o[i + 1] = l.vertices[i + 1] + a;
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
        y: o.y + a
      })),
      width: l.width,
      cornerRadius: l.cornerRadius,
      numArcPoints: l.numArcPoints,
      layer: l.layer,
      datatype: l.datatype
    };
    if (l.type === "cell-ref") {
      const o = new Float64Array(l.transform);
      return o[4] += n, o[5] += a, {
        type: "cell-ref",
        cellName: l.cellName,
        transform: o,
        repetition: l.repetition ? new Float64Array(l.repetition) : null
      };
    }
    return l.type === "image" ? {
      ...l,
      x: l.x + n,
      y: l.y + a
    } : {
      type: "text",
      text: l.text,
      x: l.x + n,
      y: l.y + a,
      height: l.height,
      layer: l.layer,
      datatype: l.datatype
    };
  }
  class $S {
    constructor(n, a, o, i, c) {
      __publicField(this, "type", "create-array");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "createdIds", []);
      __publicField(this, "createdPathIds", []);
      this.elementIds = n, this.columns = a, this.rows = o, this.colSpacing = i, this.rowSpacing = c;
      const d = a * o - 1;
      this.description = d === 1 ? "Create array (1 copy)" : `Create array (${d} copies)`;
    }
    execute(n) {
      this.snapshots.length === 0 && (this.snapshots = Jn(n.library, this.elementIds)), this.createdIds = [];
      const a = [];
      for (let o = 0; o < this.rows; o++) for (let i = 0; i < this.columns; i++) {
        if (o === 0 && i === 0) continue;
        const c = i * this.colSpacing, d = o * this.rowSpacing, f = this.snapshots.map((p) => US(p, c, d)), h = Pa(n.library, f);
        this.createdIds.push(...h), a.push(...f);
      }
      this.createdPathIds = this.createdIds.filter((o) => tt.getState().pathMetadata.has(o)), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && ue.getState().setSelection(/* @__PURE__ */ new Set([
        ...this.elementIds,
        ...this.createdIds
      ]));
    }
    undo(n) {
      tt.getState().removePathMetadataMany(this.createdPathIds);
      const a = [], o = [];
      for (const i of this.createdIds) i.startsWith("img:") ? a.push(i) : o.push(i);
      for (const i of a) ut.getState().removeImage(Ln(i));
      o.length > 0 && n.library.remove_elements(o), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.elementIds.length > 0 ? ue.getState().setSelection(new Set(this.elementIds)) : ue.getState().clearSelection();
    }
  }
  class p0 {
    constructor(n, a, o = 0) {
      __publicField(this, "type", "create-polygon");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.points = n, this.layer = a, this.datatype = o, this.description = `Create polygon with ${n.length / 2} vertices`;
    }
    execute(n) {
      const a = n.library.add_polygon(this.points, this.layer, this.datatype);
      a && (this.elementId = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ue.getState().select(a));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: o } = ue.getState();
        a.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  function My(l) {
    const n = l / ye / 1e3;
    return n.toFixed(n >= 10 ? 1 : n >= 1 ? 2 : 3);
  }
  function y0(l, n) {
    if (n <= 0) return;
    const a = m0(l, n);
    if (a.length === 0) return;
    const o = My(n), i = Math.min(...a.map((f) => f.actual)), c = My(i), d = a.length === 1 ? `Bend radius reduced to ${c} \xB5m at corner ${a[0].cornerIndex} (requested ${o} \xB5m)` : `Bend radius reduced at ${a.length} corners (min ${c} \xB5m, requested ${o} \xB5m)`;
    cn.getState().show(d, "warn");
  }
  class b0 {
    constructor(n, a, o, i = 0, c, d = 0, f = cc) {
      __publicField(this, "type", "create-path");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      __publicField(this, "metadata", null);
      this.points = n, this.width = a, this.layer = o, this.datatype = i, this.waypoints = c, this.cornerRadius = d, this.numArcPoints = f, this.description = `Create path with ${n.length / 2} waypoints`;
    }
    execute(n) {
      const a = n.library.create_path_rounded(this.points, this.width, this.cornerRadius, this.numArcPoints, this.layer, this.datatype);
      a && (this.elementId = a, this.metadata ? (this.metadata.actualCornerRadius = nc(this.metadata.waypoints, this.metadata.cornerRadius), tt.getState().setPathMetadata(a, this.metadata)) : this.waypoints && (this.metadata = {
        waypoints: this.waypoints,
        width: this.width,
        cornerRadius: this.cornerRadius,
        actualCornerRadius: nc(this.waypoints, this.cornerRadius),
        numArcPoints: this.numArcPoints,
        layer: this.layer,
        datatype: this.datatype
      }, tt.getState().setPathMetadata(a, this.metadata)), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ue.getState().select(a), this.waypoints && y0(this.waypoints, this.cornerRadius));
    }
    undo(n) {
      if (this.elementId) {
        this.metadata || (this.metadata = tt.getState().pathMetadata.get(this.elementId) ?? null), tt.getState().removePathMetadata(this.elementId), n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: o } = ue.getState();
        a.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class Uo {
    constructor(n, a, o, i) {
      __publicField(this, "type", "edit-path");
      __publicField(this, "description");
      __publicField(this, "currentId");
      __publicField(this, "oldMeta");
      __publicField(this, "newMeta");
      this.currentId = n, this.oldMeta = a, this.newMeta = o, this.description = i;
    }
    execute(n) {
      this.currentId = this.rebuildPath(n, this.currentId, this.newMeta);
    }
    undo(n) {
      this.currentId = this.rebuildPath(n, this.currentId, this.oldMeta);
    }
    rebuildPath(n, a, o) {
      const i = new Float64Array(o.waypoints.length * 2);
      for (let d = 0; d < o.waypoints.length; d++) i[d * 2] = o.waypoints[d].x, i[d * 2 + 1] = o.waypoints[d].y;
      n.library.remove_element(a);
      const c = n.library.create_path_rounded(i, o.width, o.cornerRadius, o.numArcPoints ?? cc, o.layer, o.datatype);
      return c ? (tt.getState().removePathMetadata(a), tt.getState().setPathMetadata(c, {
        ...o,
        actualCornerRadius: nc(o.waypoints, o.cornerRadius)
      }), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ue.getState().select(c), y0(o.waypoints, o.cornerRadius), c) : (n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), a);
    }
  }
  class VS {
    constructor(n, a, o) {
      __publicField(this, "type", "move-elements");
      __publicField(this, "description");
      this.elementIds = n, this.deltaX = a, this.deltaY = o;
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
  class qS {
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
        const { rulers: a } = Oe.getState();
        a.has(this.ruler.id) || Oe.setState((o) => {
          const i = new Map(o.rulers);
          return i.set(this.ruler.id, this.ruler), {
            rulers: i
          };
        });
      } else {
        const a = Oe.getState().addRuler(this.ruler.start, this.ruler.end);
        this.ruler = {
          ...this.ruler,
          id: a
        };
      }
    }
    undo(n) {
      Oe.getState().removeRuler(this.ruler.id);
    }
    getRulerId() {
      return this.ruler.id;
    }
  }
  class dc {
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
      const { rulers: a, removeRulers: o } = Oe.getState(), i = this.restoredIds.length > 0 ? this.restoredIds : this.rulerIds;
      if (this.snapshots.length === 0) for (const c of i) {
        const d = a.get(c);
        d && this.snapshots.push({
          ...d
        });
      }
      o(i), this.restoredIds = [];
    }
    undo(n) {
      const a = Oe.getState().restoreRulers(this.snapshots);
      this.restoredIds = a, a.length > 0 && Oe.getState().setSelection(new Set(a));
    }
  }
  class v0 {
    constructor(n, a, o) {
      __publicField(this, "type", "move-rulers");
      __publicField(this, "description");
      this.rulerIds = n, this.deltaX = a, this.deltaY = o;
      const i = n.length;
      this.description = i === 1 ? "Move ruler" : `Move ${i} rulers`;
    }
    execute(n) {
      this.applyDelta(this.deltaX, this.deltaY);
    }
    undo(n) {
      this.applyDelta(-this.deltaX, -this.deltaY);
    }
    applyDelta(n, a) {
      Oe.setState((o) => {
        const i = new Map(o.rulers);
        for (const c of this.rulerIds) {
          const d = i.get(c);
          d && i.set(c, {
            ...d,
            start: {
              x: d.start.x + n,
              y: d.start.y + a
            },
            end: {
              x: d.end.x + n,
              y: d.end.y + a
            }
          });
        }
        return {
          rulers: i
        };
      });
    }
  }
  class x0 {
    constructor(n, a, o, i) {
      __publicField(this, "type", "move-ruler-endpoint");
      __publicField(this, "description", "Move ruler endpoint");
      this.rulerId = n, this.endpoint = a, this.oldPosition = o, this.newPosition = i;
    }
    execute(n) {
      Oe.getState().updateEndpoint(this.rulerId, this.endpoint, this.newPosition);
    }
    undo(n) {
      Oe.getState().updateEndpoint(this.rulerId, this.endpoint, this.oldPosition);
    }
  }
  class w0 {
    constructor(n, a) {
      __publicField(this, "type", "add-layer");
      __publicField(this, "description", "Add layer");
      __publicField(this, "createdLayer", null);
      this.name = n, this.color = a;
    }
    execute(n) {
      this.createdLayer ? (ve.getState().setLayer(this.createdLayer), ve.getState().setActiveLayer(this.createdLayer.id)) : this.createdLayer = ve.getState().addLayer(this.name, this.color);
    }
    undo(n) {
      this.createdLayer && ve.getState().deleteLayer(this.createdLayer.id);
    }
  }
  class ah {
    constructor(n) {
      __publicField(this, "type", "delete-layer");
      __publicField(this, "description");
      __publicField(this, "snapshot", null);
      __publicField(this, "elementSnapshots", []);
      __publicField(this, "restoredElementIds", []);
      this.layerId = n, this.description = "Delete layer";
    }
    execute(n) {
      const a = ve.getState();
      if (this.snapshot = a.getLayer(this.layerId) ?? null, !this.snapshot) return;
      const o = this.restoredElementIds.length > 0 ? this.restoredElementIds : n.library.get_elements_on_layer(this.snapshot.layerNumber, this.snapshot.datatype);
      if (this.elementSnapshots.length === 0) for (const i of o) {
        const c = n.library.get_element_info(i);
        c && (this.elementSnapshots.push({
          vertices: new Float64Array(c.vertices),
          layer: c.layer,
          datatype: c.datatype
        }), c.free());
      }
      n.library.remove_elements(o), this.restoredElementIds = [], n.library.remove_layer_color(this.snapshot.layerNumber, this.snapshot.datatype), a.deleteLayer(this.layerId), ue.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      if (!this.snapshot) return;
      ve.getState().setLayer(this.snapshot), ve.getState().setActiveLayer(this.snapshot.id), zf(this.snapshot, n);
      const a = [];
      for (const o of this.elementSnapshots) {
        const i = n.library.add_polygon(o.vertices, o.layer, o.datatype);
        i && a.push(i);
      }
      this.restoredElementIds = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  function zf(l, n) {
    const a = l.visible ? l.opacity : 0, [o, i, c, d] = ic(l.color, a);
    n.library.set_layer_color(l.layerNumber, l.datatype, o, i, c, d), n.library.set_layer_fill_pattern(l.layerNumber, l.datatype, Tf[l.fillPattern ?? "solid"] ?? 0);
  }
  class S0 {
    constructor(n, a) {
      __publicField(this, "type", "edit-layer");
      __publicField(this, "description");
      this.oldLayer = n, this.newLayer = a, this.description = `Edit layer "${n.name}"`;
    }
    execute(n) {
      const a = ve.getState();
      (this.oldLayer.layerNumber !== this.newLayer.layerNumber || this.oldLayer.datatype !== this.newLayer.datatype) && n.library.remove_layer_color(this.oldLayer.layerNumber, this.oldLayer.datatype), a.setLayer(this.newLayer), zf(this.newLayer, n), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      const a = ve.getState();
      (this.oldLayer.layerNumber !== this.newLayer.layerNumber || this.oldLayer.datatype !== this.newLayer.datatype) && n.library.remove_layer_color(this.newLayer.layerNumber, this.newLayer.datatype), a.setLayer(this.oldLayer), zf(this.oldLayer, n), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class jy {
    constructor(n, a, o) {
      __publicField(this, "type", "change-element-layer");
      __publicField(this, "description");
      __publicField(this, "originals", []);
      __publicField(this, "newIds", []);
      this.elementIds = n, this.newLayer = a, this.newDatatype = o;
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
      const a = this.newIds.length > 0 ? this.newIds : this.elementIds;
      n.library.remove_elements(a);
      const o = [];
      for (const { snapshot: i } of this.originals) {
        let c;
        "type" in i && i.type === "text" ? c = n.library.add_text(i.text, i.x, i.y, i.height, this.newLayer, this.newDatatype) : c = n.library.add_polygon(i.vertices, this.newLayer, this.newDatatype), c && o.push(c);
      }
      this.newIds = o, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), o.length > 0 && ue.getState().setSelection(new Set(o));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const a = [];
      for (const { snapshot: o } of this.originals) {
        let i;
        "type" in o && o.type === "text" ? i = n.library.add_text(o.text, o.x, o.y, o.height, o.layer, o.datatype) : i = n.library.add_polygon(o.vertices, o.layer, o.datatype), i && a.push(i);
      }
      this.newIds = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), a.length > 0 && ue.getState().setSelection(new Set(a));
    }
  }
  class GS {
    constructor(n, a, o, i) {
      __publicField(this, "type", "resize-elements");
      __publicField(this, "description");
      __publicField(this, "originals", []);
      __publicField(this, "newIds", []);
      this.elementIds = n, this.oldBounds = a, this.newWidth = o, this.newHeight = i;
      const c = n.length;
      this.description = c === 1 ? "Resize element" : `Resize ${c} elements`;
    }
    execute(n) {
      if (this.originals.length === 0) for (const h of this.elementIds) {
        const p = n.library.get_element_info(h);
        p && (this.originals.push({
          id: h,
          snapshot: {
            vertices: new Float64Array(p.vertices),
            layer: p.layer,
            datatype: p.datatype
          }
        }), p.free());
      }
      const a = this.oldBounds.maxX - this.oldBounds.minX, o = this.oldBounds.maxY - this.oldBounds.minY, i = a !== 0 ? this.newWidth / a : 1, c = o !== 0 ? this.newHeight / o : 1, d = this.newIds.length > 0 ? this.newIds : this.elementIds;
      n.library.remove_elements(d);
      const f = [];
      for (const { snapshot: h } of this.originals) {
        const p = new Float64Array(h.vertices.length);
        for (let x = 0; x < h.vertices.length; x += 2) p[x] = this.oldBounds.minX + (h.vertices[x] - this.oldBounds.minX) * i, p[x + 1] = this.oldBounds.minY + (h.vertices[x + 1] - this.oldBounds.minY) * c;
        const v = n.library.add_polygon(p, h.layer, h.datatype);
        v && f.push(v);
      }
      this.newIds = f, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), f.length > 0 && ue.getState().setSelection(new Set(f));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const a = [];
      for (const { snapshot: o } of this.originals) {
        const i = n.library.add_polygon(o.vertices, o.layer, o.datatype);
        i && a.push(i);
      }
      this.newIds = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), a.length > 0 && ue.getState().setSelection(new Set(a));
    }
  }
  class Od {
    constructor(n, a, o) {
      __publicField(this, "type", "edit-vertices");
      __publicField(this, "description");
      __publicField(this, "original", null);
      __publicField(this, "currentId");
      this.newVertices = a, this.currentId = n, this.description = o ?? "Edit vertices";
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
      const a = n.library.add_polygon(this.newVertices, this.original.layer, this.original.datatype);
      a && (this.currentId = a, ue.getState().setSelection(/* @__PURE__ */ new Set([
        a
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      if (!this.original) return;
      n.library.remove_element(this.currentId);
      const a = n.library.add_polygon(this.original.vertices, this.original.layer, this.original.datatype);
      a && (this.currentId = a, ue.getState().setSelection(/* @__PURE__ */ new Set([
        a
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class PS {
    constructor(n, a, o, i, c) {
      __publicField(this, "type", "move-elements-to");
      __publicField(this, "description");
      __publicField(this, "deltaX");
      __publicField(this, "deltaY");
      __publicField(this, "currentIds");
      this.currentIds = [
        ...n
      ], this.deltaX = i - a, this.deltaY = c - o, this.description = n.length === 1 ? "Move element" : `Move ${n.length} elements`;
    }
    execute(n) {
      n.library.translate_elements(this.currentIds, this.deltaX, this.deltaY), tt.getState().translateWaypoints(this.currentIds, this.deltaX, this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.translate_elements(this.currentIds, -this.deltaX, -this.deltaY), tt.getState().translateWaypoints(this.currentIds, -this.deltaX, -this.deltaY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class Id {
    constructor(n, a, o, i) {
      __publicField(this, "type", "set-instance-transform");
      __publicField(this, "description");
      this.refId = n, this.oldTransform = a, this.newTransform = o, this.description = i ?? "Set instance transform";
    }
    execute(n) {
      n.library.set_cell_ref_transform(this.refId, this.newTransform), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_cell_ref_transform(this.refId, this.oldTransform), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class ZS {
    constructor(n, a, o) {
      __publicField(this, "type", "set-instance-array");
      __publicField(this, "description");
      this.refId = n, this.oldParams = a, this.newParams = o, this.description = "Set instance array";
    }
    execute(n) {
      this.applyParams(n, this.newParams);
    }
    undo(n) {
      this.applyParams(n, this.oldParams);
    }
    applyParams(n, a) {
      a && (a.columns > 1 || a.rows > 1) ? n.library.set_cell_ref_array(this.refId, a.columns, a.rows, a.colSpacing, a.rowSpacing) : n.library.set_cell_ref_array(this.refId, 1, 1, 0, 0), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  function Zt(l) {
    const n = l.get_cell_tree();
    n && he.getState().setCellTree(n);
  }
  class rh {
    constructor(n) {
      __publicField(this, "type", "add-cell");
      __publicField(this, "description");
      __publicField(this, "cellName");
      this.cellName = n, this.description = `Add cell "${n}"`;
    }
    execute(n) {
      n.library.add_cell(this.cellName), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.remove_cell(this.cellName), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class oh {
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
        const a = n.library.get_cell_origin_by_name(this.cellName);
        a && (this.cellOrigin = [
          a[0],
          a[1]
        ]);
        const o = n.library.get_cell_ref_parents(this.cellName);
        Array.isArray(o) && (this.parentRefs = o.map((d) => ({
          parent: d.parent,
          transform: new Float64Array(d.transform)
        })));
        const i = n.library.active_cell_name();
        n.library.set_active_cell(this.cellName);
        const c = n.library.get_all_ids();
        c.length > 0 && (this.elementSnapshots = Jn(n.library, c)), i && n.library.set_active_cell(i);
      }
      n.library.remove_cell_cascade(this.cellName), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.add_cell(this.cellName);
      const a = n.library.active_cell_name();
      n.library.set_active_cell(this.cellName), n.library.set_cell_origin(this.cellOrigin[0], this.cellOrigin[1]), this.elementSnapshots.length > 0 && Pa(n.library, this.elementSnapshots), a && n.library.set_active_cell(a);
      for (const o of this.parentRefs) n.library.add_cell_ref_to_with_transform(o.parent, this.cellName, o.transform);
      Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class C0 {
    constructor(n) {
      __publicField(this, "type", "flatten-cell");
      __publicField(this, "description");
      __publicField(this, "cellName");
      __publicField(this, "originalSnapshots", []);
      __publicField(this, "originalOrigin", [
        0,
        0
      ]);
      this.cellName = n, this.description = `Flatten cell "${n}"`;
    }
    execute(n) {
      const a = n.library.active_cell_name();
      if (n.library.set_active_cell(this.cellName), this.originalSnapshots.length === 0) {
        const d = n.library.get_cell_origin();
        d && (this.originalOrigin = [
          d[0],
          d[1]
        ]);
        const f = n.library.get_all_ids();
        f.length > 0 && (this.originalSnapshots = Jn(n.library, f));
      }
      const o = n.library.get_all_ids(), i = tt.getState(), c = o.filter((d) => i.pathMetadata.has(d));
      c.length > 0 && i.removePathMetadataMany(c), n.library.flatten_active_cell(), ue.getState().clearSelection(), a && a !== this.cellName && n.library.set_active_cell(a), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      const a = n.library.active_cell_name();
      n.library.set_active_cell(this.cellName), n.library.clear_active_cell(), n.library.set_cell_origin(this.originalOrigin[0], this.originalOrigin[1]), this.originalSnapshots.length > 0 && Pa(n.library, this.originalSnapshots), ue.getState().clearSelection(), a && a !== this.cellName && n.library.set_active_cell(a), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class KS {
    constructor(n, a, o, i) {
      __publicField(this, "type", "set-cell-origin");
      __publicField(this, "description", "Set cell origin");
      this.oldX = n, this.oldY = a, this.newX = o, this.newY = i;
    }
    execute(n) {
      n.library.set_cell_origin(this.newX, this.newY), n.renderer.set_crosshair_origin(this.newX, this.newY), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_cell_origin(this.oldX, this.oldY), n.renderer.set_crosshair_origin(this.oldX, this.oldY), n.renderer.mark_dirty();
    }
  }
  class E0 {
    constructor(n, a) {
      __publicField(this, "type", "rename-cell");
      __publicField(this, "description");
      this.oldName = n, this.newName = a, this.description = `Rename cell "${n}" to "${a}"`;
    }
    execute(n) {
      const a = he.getState();
      a.activeCell === this.oldName && a.setActiveCell(this.newName), n.library.rename_cell(this.oldName, this.newName), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      const a = he.getState();
      a.activeCell === this.newName && a.setActiveCell(this.oldName), n.library.rename_cell(this.newName, this.oldName), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class k0 {
    constructor(n, a, o) {
      __publicField(this, "type", "add-cell-ref");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.cellName = n, this.x = a, this.y = o, this.description = `Place instance of "${n}"`;
    }
    execute(n) {
      const a = n.library.add_cell_ref(this.cellName, this.x, this.y);
      if (a) {
        this.elementId = a, Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const o = n.library.get_element_index(a);
        o >= 0 && ue.getState().select(`ref:${o}:0`);
      }
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), Zt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: o } = ue.getState();
        a.has(this.elementId) && o(this.elementId);
      }
    }
  }
  function rn(l) {
    return Math.round(l / ye) * ye;
  }
  function fc() {
    const { activeLayerId: l, layers: n } = ve.getState(), a = n.get(l);
    return {
      layerNumber: (a == null ? void 0 : a.layerNumber) ?? 1,
      datatype: (a == null ? void 0 : a.datatype) ?? 0
    };
  }
  function hc(l) {
    const { zoom: n, offset: a } = Ye.getState(), o = l.getBoundingClientRect(), i = (o.width / 2 - a.x) / n, c = (o.height / 2 - a.y) / n, d = o.width / n, f = o.height / n, h = Math.max(rn(d * 0.1 / 2), ye), p = Math.max(rn(f * 0.1 / 2), ye);
    return {
      centerX: i,
      centerY: c,
      halfW: h,
      halfH: p
    };
  }
  function _0(l, n, a) {
    const { centerX: o, centerY: i, halfW: c, halfH: d } = hc(a), f = c * 2, h = d * 2, p = rn(o - c), v = rn(i - d), { layerNumber: x, datatype: S } = fc(), E = new g0(p, v, f, h, x, S);
    fe.getState().execute(E, {
      library: l,
      renderer: n
    });
  }
  function M0(l, n, a) {
    const { centerX: o, centerY: i, halfW: c, halfH: d } = hc(a), f = new Float64Array([
      rn(o - c),
      rn(i - d),
      rn(o + c),
      rn(i - d),
      rn(o),
      rn(i + d)
    ]), { layerNumber: h, datatype: p } = fc(), v = new p0(f, h, p);
    fe.getState().execute(v, {
      library: l,
      renderer: n
    });
  }
  function j0(l, n, a) {
    const { centerX: o, centerY: i, halfH: c } = hc(a), d = Math.max(rn(c), ye), { layerNumber: f, datatype: h } = fc(), p = new R0("Text", rn(o), rn(i), d, f, h);
    fe.getState().execute(p, {
      library: l,
      renderer: n
    }), Se.getState().bumpSyncGeneration();
  }
  function L0(l, n, a) {
    const { centerX: o, centerY: i, halfW: c } = hc(a), d = rn(o - c), f = rn(o + c), h = rn(i), p = new Float64Array([
      d,
      h,
      f,
      h
    ]), v = [
      {
        x: d,
        y: h
      },
      {
        x: f,
        y: h
      }
    ], { layerNumber: x, datatype: S } = fc(), { width: E, cornerRadius: k, numArcPoints: b } = tt.getState(), C = new b0(p, E, x, S, v, k, b);
    fe.getState().execute(C, {
      library: l,
      renderer: n
    });
  }
  class R0 {
    constructor(n, a, o, i, c, d = 0) {
      __publicField(this, "type", "create-text");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.text = n, this.x = a, this.y = o, this.height = i, this.layer = c, this.datatype = d, this.description = `Create text "${n.slice(0, 20)}" at (${a}, ${o})`;
    }
    execute(n) {
      const a = n.library.add_text(this.text, this.x, this.y, this.height, this.layer, this.datatype);
      a && (this.elementId = a, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), ue.getState().select(a));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: a, removeFromSelection: o } = ue.getState();
        a.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class FS {
    constructor(n, a, o) {
      __publicField(this, "type", "update-text-content");
      __publicField(this, "description", "Update text content");
      this.elementId = n, this.oldText = a, this.newText = o;
    }
    execute(n) {
      n.library.update_text(this.elementId, this.newText), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.update_text(this.elementId, this.oldText), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class QS {
    constructor(n, a, o, i, c) {
      __publicField(this, "type", "move-text");
      __publicField(this, "description", "Move text");
      this.elementId = n, this.oldX = a, this.oldY = o, this.newX = i, this.newY = c;
    }
    execute(n) {
      n.library.set_text_position(this.elementId, this.newX, this.newY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_text_position(this.elementId, this.oldX, this.oldY), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class WS {
    constructor(n, a, o) {
      __publicField(this, "type", "set-text-height");
      __publicField(this, "description", "Set text height");
      this.elementId = n, this.oldHeight = a, this.newHeight = o;
    }
    execute(n) {
      n.library.set_text_height(this.elementId, this.newHeight), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      n.library.set_text_height(this.elementId, this.oldHeight), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class A0 {
    constructor(n) {
      __publicField(this, "type", "text-to-polygons");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "resultIds", []);
      this.textElementIds = n, this.description = n.length === 1 ? "Convert text to polygons" : `Convert ${n.length} texts to polygons`;
    }
    execute(n) {
      if (this.snapshots.length === 0) for (const a of this.textElementIds) {
        const o = n.library.get_text_element_info(a);
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
          currentId: a
        });
      }
      this.resultIds = [];
      for (const a of this.snapshots) {
        const o = n.library.text_to_polygons(a.currentId);
        this.resultIds.push(...o);
      }
      this.resultIds.length > 0 ? ue.getState().selectAll(this.resultIds) : ue.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      this.resultIds.length > 0 && (n.library.remove_elements(this.resultIds), this.resultIds = []);
      const a = [];
      for (const o of this.snapshots) {
        const i = o.snapshot, c = n.library.add_text(i.text, i.x, i.y, i.height, i.layer, i.datatype);
        c && (o.currentId = c, a.push(c));
      }
      a.length > 0 && ue.getState().selectAll(a), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class N0 {
    constructor(n, a, o) {
      __publicField(this, "type", "align-elements");
      __publicField(this, "description");
      __publicField(this, "deltas", []);
      this.selectedIds = n, this.referenceId = a, this.alignType = o, this.description = `Align elements (${o})`;
    }
    execute(n) {
      this.deltas.length === 0 && (this.deltas = HS(n.library, this.selectedIds, this.referenceId, this.alignType));
      for (const a of this.deltas) n.library.translate_elements(a.ids, a.dx, a.dy), tt.getState().translateWaypoints(a.ids, a.dx, a.dy);
      n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      for (let a = this.deltas.length - 1; a >= 0; a--) {
        const o = this.deltas[a];
        n.library.translate_elements(o.ids, -o.dx, -o.dy), tt.getState().translateWaypoints(o.ids, -o.dx, -o.dy);
      }
      n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class T0 {
    constructor(n, a, o) {
      __publicField(this, "type", "boolean-operation");
      __publicField(this, "description");
      __publicField(this, "snapshots", []);
      __publicField(this, "currentIds");
      __publicField(this, "currentBaseId");
      __publicField(this, "resultIds", []);
      this.operation = a, this.description = `Boolean ${a}`, this.currentIds = [
        ...n
      ], this.currentBaseId = o;
    }
    execute(n) {
      this.snapshots.length === 0 && (this.snapshots = Jn(n.library, this.currentIds)), this.resultIds = n.library.boolean_operation(this.currentIds, this.operation, this.currentBaseId), this.resultIds.length > 0 ? ue.getState().selectAll(this.resultIds) : ue.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      this.resultIds.length > 0 && n.library.remove_elements(this.resultIds);
      const a = Pa(n.library, this.snapshots), o = this.currentIds.indexOf(this.currentBaseId);
      this.currentIds = a, o >= 0 && o < a.length && (this.currentBaseId = a[o]), this.resultIds = [], ue.getState().selectAll(a), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class JS {
    constructor(n) {
      __publicField(this, "type", "add-image");
      __publicField(this, "description", "Insert image");
      this.entry = n;
    }
    execute(n) {
      ut.getState().addImage(this.entry), ue.getState().select(Ga(this.entry.id));
    }
    undo(n) {
      ut.getState().removeImage(this.entry.id), ue.getState().clearSelection();
    }
  }
  class O0 {
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
      const a = ut.getState();
      if (this.snapshots.length === 0) for (const o of this.imageIds) {
        const i = a.images.get(o);
        i && this.snapshots.push(i);
      }
      for (const o of this.imageIds) ut.getState().removeImage(o);
      ue.getState().clearSelection();
    }
    undo(n) {
      const a = [];
      for (const o of this.snapshots) ut.getState().addImage(o), a.push(Ga(o.id));
      a.length > 0 && ue.getState().selectAll(a);
    }
  }
  class e2 {
    constructor(n, a, o, i, c) {
      __publicField(this, "type", "move-image");
      __publicField(this, "description", "Move image");
      this.imageId = n, this.oldX = a, this.oldY = o, this.newX = i, this.newY = c;
    }
    execute(n) {
      ut.getState().updateImage(this.imageId, {
        x: this.newX,
        y: this.newY
      });
    }
    undo(n) {
      ut.getState().updateImage(this.imageId, {
        x: this.oldX,
        y: this.oldY
      });
    }
  }
  class t2 {
    constructor(n, a, o) {
      __publicField(this, "type", "move-images");
      __publicField(this, "description", "Move images");
      this.imageIds = n, this.deltaX = a, this.deltaY = o;
    }
    execute(n) {
      const a = ut.getState();
      for (const o of this.imageIds) {
        const i = Ln(o), c = a.images.get(i);
        c && a.updateImage(i, {
          x: c.x + this.deltaX,
          y: c.y + this.deltaY
        });
      }
    }
    undo(n) {
      const a = ut.getState();
      for (const o of this.imageIds) {
        const i = Ln(o), c = a.images.get(i);
        c && a.updateImage(i, {
          x: c.x - this.deltaX,
          y: c.y - this.deltaY
        });
      }
    }
  }
  class n2 {
    constructor(n, a, o, i, c) {
      __publicField(this, "type", "resize-image");
      __publicField(this, "description", "Resize image");
      this.imageId = n, this.oldWidth = a, this.oldHeight = o, this.newWidth = i, this.newHeight = c;
    }
    execute(n) {
      ut.getState().updateImage(this.imageId, {
        width: this.newWidth,
        height: this.newHeight
      });
    }
    undo(n) {
      ut.getState().updateImage(this.imageId, {
        width: this.oldWidth,
        height: this.oldHeight
      });
    }
  }
  const un = St()((l) => ({
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
  })), Hf = St()((l, n) => ({
    stack: [],
    claim: (a) => l((o) => ({
      stack: o.stack.includes(a) ? o.stack : [
        ...o.stack,
        a
      ]
    })),
    release: (a) => l((o) => ({
      stack: o.stack.filter((i) => i !== a)
    })),
    isCanvasActive: () => n().stack.length === 0
  })), an = St((l) => ({
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
  function I0(l) {
    var n, a, o = "";
    if (typeof l == "string" || typeof l == "number") o += l;
    else if (typeof l == "object") if (Array.isArray(l)) {
      var i = l.length;
      for (n = 0; n < i; n++) l[n] && (a = I0(l[n])) && (o && (o += " "), o += a);
    } else for (a in l) l[a] && (o && (o += " "), o += a);
    return o;
  }
  function l2() {
    for (var l, n, a = 0, o = "", i = arguments.length; a < i; a++) (l = arguments[a]) && (n = I0(l)) && (o && (o += " "), o += n);
    return o;
  }
  const sh = "-", a2 = (l) => {
    const n = o2(l), { conflictingClassGroups: a, conflictingClassGroupModifiers: o } = l;
    return {
      getClassGroupId: (d) => {
        const f = d.split(sh);
        return f[0] === "" && f.length !== 1 && f.shift(), D0(f, n) || r2(d);
      },
      getConflictingClassGroupIds: (d, f) => {
        const h = a[d] || [];
        return f && o[d] ? [
          ...h,
          ...o[d]
        ] : h;
      }
    };
  }, D0 = (l, n) => {
    var _a;
    if (l.length === 0) return n.classGroupId;
    const a = l[0], o = n.nextPart.get(a), i = o ? D0(l.slice(1), o) : void 0;
    if (i) return i;
    if (n.validators.length === 0) return;
    const c = l.join(sh);
    return (_a = n.validators.find(({ validator: d }) => d(c))) == null ? void 0 : _a.classGroupId;
  }, Ly = /^\[(.+)\]$/, r2 = (l) => {
    if (Ly.test(l)) {
      const n = Ly.exec(l)[1], a = n == null ? void 0 : n.substring(0, n.indexOf(":"));
      if (a) return "arbitrary.." + a;
    }
  }, o2 = (l) => {
    const { theme: n, prefix: a } = l, o = {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    };
    return i2(Object.entries(l.classGroups), a).forEach(([c, d]) => {
      Yf(d, o, c, n);
    }), o;
  }, Yf = (l, n, a, o) => {
    l.forEach((i) => {
      if (typeof i == "string") {
        const c = i === "" ? n : Ry(n, i);
        c.classGroupId = a;
        return;
      }
      if (typeof i == "function") {
        if (s2(i)) {
          Yf(i(o), n, a, o);
          return;
        }
        n.validators.push({
          validator: i,
          classGroupId: a
        });
        return;
      }
      Object.entries(i).forEach(([c, d]) => {
        Yf(d, Ry(n, c), a, o);
      });
    });
  }, Ry = (l, n) => {
    let a = l;
    return n.split(sh).forEach((o) => {
      a.nextPart.has(o) || a.nextPart.set(o, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      }), a = a.nextPart.get(o);
    }), a;
  }, s2 = (l) => l.isThemeGetter, i2 = (l, n) => n ? l.map(([a, o]) => {
    const i = o.map((c) => typeof c == "string" ? n + c : typeof c == "object" ? Object.fromEntries(Object.entries(c).map(([d, f]) => [
      n + d,
      f
    ])) : c);
    return [
      a,
      i
    ];
  }) : l, c2 = (l) => {
    if (l < 1) return {
      get: () => {
      },
      set: () => {
      }
    };
    let n = 0, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
    const i = (c, d) => {
      a.set(c, d), n++, n > l && (n = 0, o = a, a = /* @__PURE__ */ new Map());
    };
    return {
      get(c) {
        let d = a.get(c);
        if (d !== void 0) return d;
        if ((d = o.get(c)) !== void 0) return i(c, d), d;
      },
      set(c, d) {
        a.has(c) ? a.set(c, d) : i(c, d);
      }
    };
  }, z0 = "!", u2 = (l) => {
    const { separator: n, experimentalParseClassName: a } = l, o = n.length === 1, i = n[0], c = n.length, d = (f) => {
      const h = [];
      let p = 0, v = 0, x;
      for (let C = 0; C < f.length; C++) {
        let _ = f[C];
        if (p === 0) {
          if (_ === i && (o || f.slice(C, C + c) === n)) {
            h.push(f.slice(v, C)), v = C + c;
            continue;
          }
          if (_ === "/") {
            x = C;
            continue;
          }
        }
        _ === "[" ? p++ : _ === "]" && p--;
      }
      const S = h.length === 0 ? f : f.substring(v), E = S.startsWith(z0), k = E ? S.substring(1) : S, b = x && x > v ? x - v : void 0;
      return {
        modifiers: h,
        hasImportantModifier: E,
        baseClassName: k,
        maybePostfixModifierPosition: b
      };
    };
    return a ? (f) => a({
      className: f,
      parseClassName: d
    }) : d;
  }, d2 = (l) => {
    if (l.length <= 1) return l;
    const n = [];
    let a = [];
    return l.forEach((o) => {
      o[0] === "[" ? (n.push(...a.sort(), o), a = []) : a.push(o);
    }), n.push(...a.sort()), n;
  }, f2 = (l) => ({
    cache: c2(l.cacheSize),
    parseClassName: u2(l),
    ...a2(l)
  }), h2 = /\s+/, m2 = (l, n) => {
    const { parseClassName: a, getClassGroupId: o, getConflictingClassGroupIds: i } = n, c = [], d = l.trim().split(h2);
    let f = "";
    for (let h = d.length - 1; h >= 0; h -= 1) {
      const p = d[h], { modifiers: v, hasImportantModifier: x, baseClassName: S, maybePostfixModifierPosition: E } = a(p);
      let k = !!E, b = o(k ? S.substring(0, E) : S);
      if (!b) {
        if (!k) {
          f = p + (f.length > 0 ? " " + f : f);
          continue;
        }
        if (b = o(S), !b) {
          f = p + (f.length > 0 ? " " + f : f);
          continue;
        }
        k = false;
      }
      const C = d2(v).join(":"), _ = x ? C + z0 : C, R = _ + b;
      if (c.includes(R)) continue;
      c.push(R);
      const j = i(b, k);
      for (let A = 0; A < j.length; ++A) {
        const N = j[A];
        c.push(_ + N);
      }
      f = p + (f.length > 0 ? " " + f : f);
    }
    return f;
  };
  function g2() {
    let l = 0, n, a, o = "";
    for (; l < arguments.length; ) (n = arguments[l++]) && (a = H0(n)) && (o && (o += " "), o += a);
    return o;
  }
  const H0 = (l) => {
    if (typeof l == "string") return l;
    let n, a = "";
    for (let o = 0; o < l.length; o++) l[o] && (n = H0(l[o])) && (a && (a += " "), a += n);
    return a;
  };
  function p2(l, ...n) {
    let a, o, i, c = d;
    function d(h) {
      const p = n.reduce((v, x) => x(v), l());
      return a = f2(p), o = a.cache.get, i = a.cache.set, c = f, f(h);
    }
    function f(h) {
      const p = o(h);
      if (p) return p;
      const v = m2(h, a);
      return i(h, v), v;
    }
    return function() {
      return c(g2.apply(null, arguments));
    };
  }
  const Mt = (l) => {
    const n = (a) => a[l] || [];
    return n.isThemeGetter = true, n;
  }, Y0 = /^\[(?:([a-z-]+):)?(.+)\]$/i, y2 = /^\d+\/\d+$/, b2 = /* @__PURE__ */ new Set([
    "px",
    "full",
    "screen"
  ]), v2 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, x2 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, w2 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, S2 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, C2 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ol = (l) => Ur(l) || b2.has(l) || y2.test(l), ua = (l) => Vr(l, "length", A2), Ur = (l) => !!l && !Number.isNaN(Number(l)), Dd = (l) => Vr(l, "number", Ur), $o = (l) => !!l && Number.isInteger(Number(l)), E2 = (l) => l.endsWith("%") && Ur(l.slice(0, -1)), Ve = (l) => Y0.test(l), da = (l) => v2.test(l), k2 = /* @__PURE__ */ new Set([
    "length",
    "size",
    "percentage"
  ]), _2 = (l) => Vr(l, k2, B0), M2 = (l) => Vr(l, "position", B0), j2 = /* @__PURE__ */ new Set([
    "image",
    "url"
  ]), L2 = (l) => Vr(l, j2, T2), R2 = (l) => Vr(l, "", N2), Vo = () => true, Vr = (l, n, a) => {
    const o = Y0.exec(l);
    return o ? o[1] ? typeof n == "string" ? o[1] === n : n.has(o[1]) : a(o[2]) : false;
  }, A2 = (l) => x2.test(l) && !w2.test(l), B0 = () => false, N2 = (l) => S2.test(l), T2 = (l) => C2.test(l), O2 = () => {
    const l = Mt("colors"), n = Mt("spacing"), a = Mt("blur"), o = Mt("brightness"), i = Mt("borderColor"), c = Mt("borderRadius"), d = Mt("borderSpacing"), f = Mt("borderWidth"), h = Mt("contrast"), p = Mt("grayscale"), v = Mt("hueRotate"), x = Mt("invert"), S = Mt("gap"), E = Mt("gradientColorStops"), k = Mt("gradientColorStopPositions"), b = Mt("inset"), C = Mt("margin"), _ = Mt("opacity"), R = Mt("padding"), j = Mt("saturate"), A = Mt("scale"), N = Mt("sepia"), T = Mt("skew"), O = Mt("space"), D = Mt("translate"), H = () => [
      "auto",
      "contain",
      "none"
    ], $ = () => [
      "auto",
      "hidden",
      "clip",
      "visible",
      "scroll"
    ], te = () => [
      "auto",
      Ve,
      n
    ], J = () => [
      Ve,
      n
    ], ee = () => [
      "",
      Ol,
      ua
    ], ge = () => [
      "auto",
      Ur,
      Ve
    ], Ce = () => [
      "bottom",
      "center",
      "left",
      "left-bottom",
      "left-top",
      "right",
      "right-bottom",
      "right-top",
      "top"
    ], V = () => [
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
    ], pe = () => [
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
      Ve
    ], be = () => [
      "auto",
      "avoid",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "column"
    ], L = () => [
      Ur,
      Ve
    ];
    return {
      cacheSize: 500,
      separator: ":",
      theme: {
        colors: [
          Vo
        ],
        spacing: [
          Ol,
          ua
        ],
        blur: [
          "none",
          "",
          da,
          Ve
        ],
        brightness: L(),
        borderColor: [
          l
        ],
        borderRadius: [
          "none",
          "",
          "full",
          da,
          Ve
        ],
        borderSpacing: J(),
        borderWidth: ee(),
        contrast: L(),
        grayscale: xe(),
        hueRotate: L(),
        invert: xe(),
        gap: J(),
        gradientColorStops: [
          l
        ],
        gradientColorStopPositions: [
          E2,
          ua
        ],
        inset: te(),
        margin: te(),
        opacity: L(),
        padding: J(),
        saturate: L(),
        scale: L(),
        sepia: xe(),
        skew: L(),
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
              Ve
            ]
          }
        ],
        container: [
          "container"
        ],
        columns: [
          {
            columns: [
              da
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
              ...Ce(),
              Ve
            ]
          }
        ],
        overflow: [
          {
            overflow: $()
          }
        ],
        "overflow-x": [
          {
            "overflow-x": $()
          }
        ],
        "overflow-y": [
          {
            "overflow-y": $()
          }
        ],
        overscroll: [
          {
            overscroll: H()
          }
        ],
        "overscroll-x": [
          {
            "overscroll-x": H()
          }
        ],
        "overscroll-y": [
          {
            "overscroll-y": H()
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
              $o,
              Ve
            ]
          }
        ],
        basis: [
          {
            basis: te()
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
              Ve
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
              $o,
              Ve
            ]
          }
        ],
        "grid-cols": [
          {
            "grid-cols": [
              Vo
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
                  $o,
                  Ve
                ]
              },
              Ve
            ]
          }
        ],
        "col-start": [
          {
            "col-start": ge()
          }
        ],
        "col-end": [
          {
            "col-end": ge()
          }
        ],
        "grid-rows": [
          {
            "grid-rows": [
              Vo
            ]
          }
        ],
        "row-start-end": [
          {
            row: [
              "auto",
              {
                span: [
                  $o,
                  Ve
                ]
              },
              Ve
            ]
          }
        ],
        "row-start": [
          {
            "row-start": ge()
          }
        ],
        "row-end": [
          {
            "row-end": ge()
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
              Ve
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
              Ve
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
              ...pe()
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
              ...pe(),
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
              ...pe(),
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
              O
            ]
          }
        ],
        "space-x-reverse": [
          "space-x-reverse"
        ],
        "space-y": [
          {
            "space-y": [
              O
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
              Ve,
              n
            ]
          }
        ],
        "min-w": [
          {
            "min-w": [
              Ve,
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
              Ve,
              n,
              "none",
              "full",
              "min",
              "max",
              "fit",
              "prose",
              {
                screen: [
                  da
                ]
              },
              da
            ]
          }
        ],
        h: [
          {
            h: [
              Ve,
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
              Ve,
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
              Ve,
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
              Ve,
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
              da,
              ua
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
              Dd
            ]
          }
        ],
        "font-family": [
          {
            font: [
              Vo
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
              Ve
            ]
          }
        ],
        "line-clamp": [
          {
            "line-clamp": [
              "none",
              Ur,
              Dd
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
              Ol,
              Ve
            ]
          }
        ],
        "list-image": [
          {
            "list-image": [
              "none",
              Ve
            ]
          }
        ],
        "list-style-type": [
          {
            list: [
              "none",
              "disc",
              "decimal",
              Ve
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
              ...V(),
              "wavy"
            ]
          }
        ],
        "text-decoration-thickness": [
          {
            decoration: [
              "auto",
              "from-font",
              Ol,
              ua
            ]
          }
        ],
        "underline-offset": [
          {
            "underline-offset": [
              "auto",
              Ol,
              Ve
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
              Ve
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
              Ve
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
              ...Ce(),
              M2
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
              L2
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
              ...V(),
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
            divide: V()
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
              ...V()
            ]
          }
        ],
        "outline-offset": [
          {
            "outline-offset": [
              Ol,
              Ve
            ]
          }
        ],
        "outline-w": [
          {
            outline: [
              Ol,
              ua
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
            ring: ee()
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
              Ol,
              ua
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
              da,
              R2
            ]
          }
        ],
        "shadow-color": [
          {
            shadow: [
              Vo
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
              o
            ]
          }
        ],
        contrast: [
          {
            contrast: [
              h
            ]
          }
        ],
        "drop-shadow": [
          {
            "drop-shadow": [
              "",
              "none",
              da,
              Ve
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
              j
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
              a
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
              h
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
              _
            ]
          }
        ],
        "backdrop-saturate": [
          {
            "backdrop-saturate": [
              j
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
              Ve
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
              Ve
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
              Ve
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
              A
            ]
          }
        ],
        "scale-x": [
          {
            "scale-x": [
              A
            ]
          }
        ],
        "scale-y": [
          {
            "scale-y": [
              A
            ]
          }
        ],
        rotate: [
          {
            rotate: [
              $o,
              Ve
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
              T
            ]
          }
        ],
        "skew-y": [
          {
            "skew-y": [
              T
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
              Ve
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
              Ve
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
              Ve
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
              Ol,
              ua,
              Dd
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
  }, I2 = p2(O2);
  function B(...l) {
    return I2(l2(l));
  }
  const Ay = 38, Ai = 16;
  function zl(l) {
    const n = l.getBoundingClientRect(), { zenMode: a, explorerCollapsed: o, sidebarCollapsed: i, explorerWidth: c, sidebarWidth: d } = me.getState();
    let f = 0, h = 0;
    a || (f = o ? Ay + Ai : c + Ai, h = i ? Ay + Ai : d + Ai);
    const p = Math.max(1, n.width - f - h), v = n.height;
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
  function ls() {
    const { images: l } = ut.getState(), n = he.getState().activeCell, a = [];
    for (const o of l.values()) o.cellName === n && a.push(Ga(o.id));
    return a;
  }
  function X0(l, n) {
    return l ? n ? {
      minX: Math.min(l.minX, n.minX),
      minY: Math.min(l.minY, n.minY),
      maxX: Math.max(l.maxX, n.maxX),
      maxY: Math.max(l.maxY, n.maxY)
    } : l : n;
  }
  function z2(l, n) {
    const [a, o, i, c, d, f] = n, h = [
      {
        x: l.x,
        y: l.y
      },
      {
        x: l.x + l.width,
        y: l.y
      },
      {
        x: l.x + l.width,
        y: l.y + l.height
      },
      {
        x: l.x,
        y: l.y + l.height
      }
    ];
    let p = 1 / 0, v = 1 / 0, x = -1 / 0, S = -1 / 0;
    for (const E of h) {
      const k = a * E.x + o * E.y + d, b = i * E.x + c * E.y + f;
      p = Math.min(p, k), v = Math.min(v, b), x = Math.max(x, k), S = Math.max(S, b);
    }
    return {
      minX: p,
      minY: v,
      maxX: x,
      maxY: S
    };
  }
  function H2() {
    const { images: l } = ut.getState(), n = he.getState().activeCell, { library: a } = Se.getState();
    let o = 1 / 0, i = 1 / 0, c = -1 / 0, d = -1 / 0, f = false;
    for (const h of l.values()) h.cellName === n && (f = true, o = Math.min(o, h.x), i = Math.min(i, h.y), c = Math.max(c, h.x + h.width), d = Math.max(d, h.y + h.height));
    if (a && l.size > 0) try {
      const h = a.get_instance_cell_contexts();
      if (h) for (const p of h) for (const v of l.values()) {
        if (v.cellName !== p.cellName) continue;
        f = true;
        const x = z2(v, p.transform);
        o = Math.min(o, x.minX), i = Math.min(i, x.minY), c = Math.max(c, x.maxX), d = Math.max(d, x.maxY);
      }
    } catch {
    }
    return f ? {
      minX: o,
      minY: i,
      maxX: c,
      maxY: d
    } : null;
  }
  function ih(l) {
    const { images: n } = ut.getState();
    let a = 1 / 0, o = 1 / 0, i = -1 / 0, c = -1 / 0, d = false;
    for (const f of l) {
      if (!xn(f)) continue;
      const h = n.get(Ln(f));
      h && (d = true, a = Math.min(a, h.x), o = Math.min(o, h.y), i = Math.max(i, h.x + h.width), c = Math.max(c, h.y + h.height));
    }
    return d ? {
      minX: a,
      minY: o,
      maxX: i,
      maxY: c
    } : null;
  }
  function us() {
    const l = document.getElementById("rosette-canvas"), { library: n } = Se.getState();
    if (!l || !n) return;
    const a = n.get_all_bounds(), o = a ? {
      minX: a[0],
      minY: a[1],
      maxX: a[2],
      maxY: a[3]
    } : null, i = H2(), c = X0(o, i), d = zl(l);
    d.width <= 0 || d.height <= 0 || Ye.getState().zoomToFit(c, d.width, d.height, d.screenCenter);
  }
  function Xa(l, n) {
    const a = ue.getState().selectedIds;
    if (a.size === 0) return;
    const o = l.get_bounds_for_ids([
      ...a
    ]), i = o ? {
      minX: o[0],
      minY: o[1],
      maxX: o[2],
      maxY: o[3]
    } : null, c = ih(a), d = X0(i, c);
    if (!d) return;
    const f = zl(n);
    Ye.getState().centerOnBounds(d, f.width, f.height, f.screenCenter);
  }
  const Y2 = /* @__PURE__ */ new Set([
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
  ]);
  function B2(l, n, a) {
    const o = Ye((v) => v.zoomAt), i = Ye((v) => v.pan), c = Ye((v) => v.zoomToSelected), d = qt((v) => v.setTool), f = g.useRef(/* @__PURE__ */ new Set()), h = g.useRef(false), p = g.useRef(null);
    g.useEffect(() => {
      const v = () => {
        const b = f.current;
        if (b.size === 0) {
          p.current = null;
          return;
        }
        const C = h.current ? LS : jS;
        let _ = 0, R = 0;
        b.has("ArrowUp") && (R += C), b.has("ArrowDown") && (R -= C), b.has("ArrowLeft") && (_ += C), b.has("ArrowRight") && (_ -= C), (_ !== 0 || R !== 0) && i(_, R), p.current = requestAnimationFrame(v);
      }, x = () => {
        p.current === null && f.current.size > 0 && (p.current = requestAnimationFrame(v));
      }, S = (b) => {
        const C = l.current;
        if (!C) return;
        if (h.current = b.shiftKey, (b.metaKey || b.ctrlKey) && (b.key === "k" || b.key === "K")) {
          b.preventDefault(), un.getState().toggle();
          return;
        }
        if (!Hf.getState().isCanvasActive() || b.target instanceof HTMLInputElement || b.target instanceof HTMLTextAreaElement || an.getState().isEditingText) return;
        if (b.key === "/" && !b.metaKey && !b.ctrlKey && !b.altKey) {
          b.preventDefault(), un.getState().open();
          return;
        }
        if (Y2.has(b.key)) {
          b.preventDefault(), f.current.add(b.key), x();
          return;
        }
        const _ = C.getBoundingClientRect(), R = _.width / 2, j = _.height / 2, A = b.shiftKey ? _S : oc, N = b.shiftKey ? MS : sc;
        switch (b.key) {
          case "=":
          case "+":
            b.preventDefault(), o(A, R, j);
            break;
          case "-":
          case "_":
            b.preventDefault(), o(N, R, j);
            break;
        }
        if ((b.metaKey || b.ctrlKey) && (b.key === "a" || b.key === "A")) {
          if (b.preventDefault(), n) {
            const T = [
              ...n.get_all_ids(),
              ...ls()
            ];
            ue.getState().selectAll(T);
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && (b.key === "c" || b.key === "C") && !b.shiftKey) {
          if (b.preventDefault(), n) {
            const { selectedIds: T } = ue.getState();
            if (T.size > 0) {
              const O = Jn(n, T);
              jn.getState().copy(O);
            }
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && (b.key === "v" || b.key === "V") && !b.shiftKey) {
          if (b.preventDefault(), n && a && C) {
            const { hasContent: T } = jn.getState();
            if (T) {
              const O = new ts();
              fe.getState().execute(O, {
                library: n,
                renderer: a
              }), Xa(n, C);
            }
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && (b.key === "b" || b.key === "B") && !b.shiftKey) {
          if (b.preventDefault(), n && a && C) {
            const { selectedIds: T } = ue.getState();
            if (T.size > 0) {
              const O = new ns([
                ...T
              ]);
              fe.getState().execute(O, {
                library: n,
                renderer: a
              }), Xa(n, C);
            }
          }
          return;
        }
        if (b.key === "Delete" || b.key === "Backspace") {
          b.preventDefault();
          const { selectedRulerIds: T } = Oe.getState();
          if (T.size > 0 && n && a) {
            const O = new dc([
              ...T
            ]);
            fe.getState().execute(O, {
              library: n,
              renderer: a
            });
            return;
          }
          if (n && a) {
            const { selectedIds: O } = ue.getState();
            if (O.size > 0) {
              const D = [], H = [];
              for (const $ of O) xn($) ? D.push($) : H.push($);
              if (D.length > 0) {
                const $ = new O0(D.map(Ln));
                fe.getState().execute($, {
                  library: n,
                  renderer: a
                });
              }
              if (H.length > 0) {
                const $ = new uc(H);
                fe.getState().execute($, {
                  library: n,
                  renderer: a
                });
              }
            }
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && b.key === "z" && !b.shiftKey) {
          if (b.preventDefault(), n && a) {
            const { canUndo: T, undo: O } = fe.getState();
            T && O({
              library: n,
              renderer: a
            });
          }
          return;
        }
        if ((b.metaKey || b.ctrlKey) && ((b.key === "z" || b.key === "Z") && b.shiftKey || b.key === "y" || b.key === "Y")) {
          if (b.preventDefault(), n && a) {
            const { canRedo: T, redo: O } = fe.getState();
            T && O({
              library: n,
              renderer: a
            });
          }
          return;
        }
        if (b.key === "Tab") {
          if (b.preventDefault(), n && C) {
            const T = [
              ...n.get_group_representative_ids(),
              ...ls()
            ];
            if (T.length > 0) {
              b.shiftKey ? ue.getState().selectPrevious(T) : ue.getState().selectNext(T);
              const D = ue.getState().lastSelectedId;
              if (D && !D.startsWith("img:")) {
                const H = n.get_group_ids(D);
                H.length > 1 && ue.setState({
                  selectedIds: new Set(H),
                  lastSelectedId: D
                });
              }
              Xa(n, C);
            }
          }
          return;
        }
        if (b.key === "Enter" && (qt.getState().activeTool === "rectangle" || qt.getState().activeTool === "polygon" || qt.getState().activeTool === "path" || qt.getState().activeTool === "text")) {
          if (Date.now() - qt.getState().toolSetAt > 2e3) return;
          if (b.preventDefault(), n && a && C) {
            const O = qt.getState().activeTool;
            O === "rectangle" ? _0(n, a, C) : O === "polygon" ? M0(n, a, C) : O === "path" ? L0(n, a, C) : j0(n, a, C);
          }
          return;
        }
        if (!(b.metaKey || b.ctrlKey)) switch (b.key) {
          case "Escape":
            b.preventDefault(), Oe.getState().activeRulerId ? Oe.getState().cancelCreation() : Oe.getState().selectedRulerIds.size > 0 ? Oe.getState().clearSelection() : ue.getState().selectedIds.size > 0 ? ue.getState().clearSelection() : d("select");
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
            b.preventDefault(), un.getState().open("add instance ");
            break;
          case "f":
            b.preventDefault(), us();
            break;
          case "F":
            if (b.preventDefault(), n && C) {
              const T = ue.getState().selectedIds;
              if (T.size > 0) {
                const O = n.get_bounds_for_ids([
                  ...T
                ]), D = O ? {
                  minX: O[0],
                  minY: O[1],
                  maxX: O[2],
                  maxY: O[3]
                } : null, H = ih(T);
                let $;
                D && H ? $ = {
                  minX: Math.min(D.minX, H.minX),
                  minY: Math.min(D.minY, H.minY),
                  maxX: Math.max(D.maxX, H.maxX),
                  maxY: Math.max(D.maxY, H.maxY)
                } : $ = D ?? H;
                const te = zl(C);
                c($, te.width, te.height, te.screenCenter);
              }
            }
            break;
          case "E":
            if (b.shiftKey) {
              b.preventDefault(), me.getState().explorerCollapsed && me.getState().toggleExplorerCollapsed(), he.getState().setFocused(true);
              break;
            }
            b.preventDefault(), ue.getState().selectedIds.size > 0 && me.getState().requestInspectorFocus();
            break;
          case "e":
            b.preventDefault(), ue.getState().selectedIds.size > 0 && me.getState().requestInspectorFocus();
            break;
          case "L":
            b.preventDefault(), me.getState().setSidebarTab("layers"), ve.getState().setFocused(true);
            break;
          case "I":
            b.preventDefault(), me.getState().setSidebarTab("inspector");
            break;
          case "c": {
            if (b.preventDefault(), !n || !a) break;
            const T = nh(), O = new rh(T);
            fe.getState().execute(O, {
              library: n,
              renderer: a
            }), me.getState().explorerCollapsed && me.getState().toggleExplorerCollapsed(), he.getState().setActiveCell(T), he.getState().setEditingCellName(T);
            break;
          }
          case "[": {
            b.preventDefault();
            const { hierarchyLevelLimit: T, maxTreeDepth: O, setHierarchyLevelLimit: D } = he.getState(), H = T === 1 / 0 ? O : T;
            H > 1 && D(H - 1);
            break;
          }
          case "]": {
            b.preventDefault();
            const { hierarchyLevelLimit: T, maxTreeDepth: O, setHierarchyLevelLimit: D } = he.getState(), H = T === 1 / 0 ? O : T;
            H < O ? D(H + 1) : D(1 / 0);
            break;
          }
        }
      }, E = (b) => {
        h.current = b.shiftKey, f.current.delete(b.key);
      }, k = () => {
        f.current.clear(), h.current = false;
      };
      return window.addEventListener("keydown", S), window.addEventListener("keyup", E), window.addEventListener("blur", k), () => {
        window.removeEventListener("keydown", S), window.removeEventListener("keyup", E), window.removeEventListener("blur", k), p.current !== null && cancelAnimationFrame(p.current);
      };
    }, [
      l,
      o,
      i,
      d,
      n,
      a,
      c
    ]);
  }
  const X2 = 500, U2 = 3, $2 = St((l, n) => ({
    points: [],
    opacity: 1,
    isDrawing: false,
    addPoint: (a) => {
      const { points: o, isDrawing: i } = n();
      if (!i) return;
      if (o.length > 0) {
        const d = o[o.length - 1], f = a.x - d.x, h = a.y - d.y;
        if (Math.sqrt(f * f + h * h) < U2) return;
      }
      const c = [
        ...o,
        a
      ];
      c.length > X2 && c.shift(), l({
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
  })), V2 = 300, Ny = 16, Ty = 2, zd = 2.5;
  function q2(l, n, a, o) {
    const i = 1 - o;
    return {
      x: i * i * l.x + 2 * i * o * n.x + o * o * a.x,
      y: i * i * l.y + 2 * i * o * n.y + o * o * a.y
    };
  }
  function G2(l) {
    if (l.length <= 2) return l;
    const n = [
      l[0]
    ];
    for (let a = 1; a < l.length - 1; a++) {
      const o = Math.max(0, a - Ty), i = Math.min(l.length - 1, a + Ty);
      let c = 0, d = 0;
      const f = i - o + 1;
      for (let h = o; h <= i; h++) c += l[h].x, d += l[h].y;
      n.push({
        x: c / f,
        y: d / f
      });
    }
    return n.push(l[l.length - 1]), n;
  }
  function P2(l) {
    if (l.length < 3) return l;
    const n = [
      l[0]
    ];
    for (let a = 1; a < l.length - 1; a++) {
      const o = l[a - 1], i = l[a], c = l[a + 1], d = {
        x: (o.x + i.x) / 2,
        y: (o.y + i.y) / 2
      }, f = {
        x: (i.x + c.x) / 2,
        y: (i.y + c.y) / 2
      };
      a === 1 && n.push(d);
      for (let h = 1; h <= Ny; h++) {
        const p = h / Ny;
        n.push(q2(d, i, f, p));
      }
    }
    return n.push(l[l.length - 1]), n;
  }
  function Z2(l) {
    if (l.length < 2) return l;
    const n = [
      l[0]
    ];
    let a = 0, o = l[0];
    for (let h = 1; h < l.length; h++) {
      const p = l[h], v = p.x - o.x, x = p.y - o.y, S = Math.sqrt(v * v + x * x);
      if (S < 1e-6) {
        o = p;
        continue;
      }
      const E = v / S, k = x / S;
      let b = zd - a;
      for (; b <= S; ) n.push({
        x: o.x + E * b,
        y: o.y + k * b
      }), b += zd;
      a = S - (b - zd), o = p;
    }
    const i = l[l.length - 1], c = n[n.length - 1], d = i.x - c.x, f = i.y - c.y;
    return Math.sqrt(d * d + f * f) > 0.5 && n.push(i), n;
  }
  function K2(l, n) {
    const a = qt((_) => _.activeTool), { points: o, opacity: i, isDrawing: c, addPoint: d, startDrawing: f, stopDrawing: h, setOpacity: p, reset: v } = $2(), x = g.useRef(null), S = g.useRef(null);
    g.useEffect(() => {
      if (!(!l || !n)) if (o.length === 0) l.clear_laser();
      else {
        const _ = G2(o), R = P2(_), j = Z2(R), A = window.devicePixelRatio || 1, N = new Float64Array(j.length * 2);
        for (let T = 0; T < j.length; T++) N[T * 2] = j[T].x * A, N[T * 2 + 1] = j[T].y * A;
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
    const E = g.useCallback(() => {
      S.current !== null && cancelAnimationFrame(S.current), x.current = performance.now();
      const _ = (R) => {
        if (x.current === null) return;
        const j = R - x.current, A = Math.min(j / V2, 1);
        if (A >= 1) {
          x.current = null, S.current = null, v();
          return;
        }
        p(1 - A), S.current = requestAnimationFrame(_);
      };
      S.current = requestAnimationFrame(_);
    }, [
      v,
      p
    ]), k = g.useCallback((_) => {
      a !== "laser" || _.button !== 0 || (S.current !== null && (cancelAnimationFrame(S.current), S.current = null, x.current = null), f(), d({
        x: _.clientX,
        y: _.clientY
      }));
    }, [
      a,
      f,
      d
    ]), b = g.useCallback((_) => {
      a !== "laser" || !c || d({
        x: _.clientX,
        y: _.clientY
      });
    }, [
      a,
      c,
      d
    ]), C = g.useCallback(() => {
      a !== "laser" || !c || (h(), E());
    }, [
      a,
      c,
      h,
      E
    ]);
    return g.useEffect(() => () => {
      S.current !== null && cancelAnimationFrame(S.current);
    }, []), g.useEffect(() => {
      a !== "laser" && (S.current !== null && (cancelAnimationFrame(S.current), S.current = null, x.current = null), v());
    }, [
      a,
      v
    ]), {
      handleMouseDown: k,
      handleMouseMove: b,
      handleMouseUp: C,
      isLaserActive: a === "laser"
    };
  }
  const F2 = St((l, n) => ({
    box: null,
    isDrawing: false,
    startDrawing: (a, o) => l({
      box: {
        x: a,
        y: o,
        width: 0,
        height: 0
      },
      isDrawing: true
    }),
    updateBox: (a, o) => {
      const i = n();
      !i.box || !i.isDrawing || l({
        box: {
          ...i.box,
          width: a - i.box.x,
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
  function Q2(l) {
    const n = qt((E) => E.activeTool), { box: a, isDrawing: o, startDrawing: i, updateBox: c, reset: d } = F2(), { zoom: f, offset: h, zoomToBounds: p } = Ye(), v = g.useCallback((E) => {
      if (n !== "zoom" || E.button !== 0) return;
      const k = l.current;
      if (!k) return;
      const b = k.getBoundingClientRect(), C = E.clientX - b.left, _ = E.clientY - b.top;
      i(C, _);
    }, [
      n,
      l,
      i
    ]), x = g.useCallback((E) => {
      if (n !== "zoom" || !o) return;
      const k = l.current;
      if (!k) return;
      const b = k.getBoundingClientRect(), C = E.clientX - b.left, _ = E.clientY - b.top;
      c(C, _);
    }, [
      n,
      o,
      l,
      c
    ]), S = g.useCallback(() => {
      if (n !== "zoom" || !o || !a) {
        d();
        return;
      }
      const E = l.current;
      if (Math.abs(a.width) > 5 && Math.abs(a.height) > 5 && E) {
        const k = Math.min(a.x, a.x + a.width), b = Math.max(a.x, a.x + a.width), C = Math.min(a.y, a.y + a.height), _ = Math.max(a.y, a.y + a.height), R = (k - h.x) / f, j = (b - h.x) / f, A = (C - h.y) / f, N = (_ - h.y) / f, T = {
          minX: R,
          maxX: j,
          minY: A,
          maxY: N
        }, O = zl(E);
        O.width > 0 && O.height > 0 && p(T, O.width, O.height, O.screenCenter);
      }
      d();
    }, [
      n,
      o,
      a,
      f,
      h,
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
      box: a,
      isZoomActive: n === "zoom",
      isDrawingZoom: o
    };
  }
  function Ir(l) {
    return Math.round(l / ye) * ye;
  }
  const Il = new Float64Array(8), qo = new Float32Array(4);
  function W2(l, n, a) {
    const o = g.useRef(null), i = g.useRef(false), c = g.useRef([
      0.5,
      0.5,
      0.5,
      0.5
    ]), d = g.useCallback((v) => {
      if (v.button !== 0) return;
      const S = v.currentTarget.getBoundingClientRect(), E = v.clientX - S.left, k = v.clientY - S.top, b = l(E, k);
      if (!b) return;
      const C = Ir(b.x), _ = Ir(b.y);
      o.current = {
        x: C,
        y: _
      }, i.current = true;
      const R = ve.getState().activeLayerId, A = ve.getState().layers.get(R);
      if (A) {
        const [N, T, O] = ic(A.color, 0.5);
        c.current = [
          N,
          T,
          O,
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
      if (!i.current || !S || !a) return false;
      const E = l(v, x);
      if (!E) return false;
      const k = Ir(E.x), b = Ir(E.y), C = Math.min(S.x, k), _ = Math.min(S.y, b), R = Math.max(S.x, k), j = Math.max(S.y, b);
      Il[0] = C, Il[1] = _, Il[2] = R, Il[3] = _, Il[4] = R, Il[5] = j, Il[6] = C, Il[7] = j;
      const A = c.current;
      return qo[0] = A[0], qo[1] = A[1], qo[2] = A[2], qo[3] = A[3], a.set_preview_shape(Il, qo), a.mark_dirty(), true;
    }, [
      l,
      a
    ]), h = g.useCallback((v, x) => {
      const S = o.current;
      if (!S || !n || !a) return;
      const E = Ir(v), k = Ir(x), b = Math.min(S.x, E), C = Math.min(S.y, k), _ = Math.abs(E - S.x), R = Math.abs(k - S.y);
      if (_ > 0 && R > 0) {
        const j = ve.getState().activeLayerId, N = ve.getState().layers.get(j), T = (N == null ? void 0 : N.layerNumber) ?? 1, O = (N == null ? void 0 : N.datatype) ?? 0, D = new g0(b, C, _, R, T, O);
        fe.getState().execute(D, {
          library: n,
          renderer: a
        });
      }
      a.clear_preview(), i.current = false, o.current = null;
    }, [
      n,
      a
    ]), p = g.useCallback(() => {
      i.current = false, o.current = null, a == null ? void 0 : a.clear_preview();
    }, [
      a
    ]);
    return {
      handleMouseDown: d,
      handleMouseMove: f,
      finalizeRectangle: h,
      cancelDrawing: p
    };
  }
  function Ni(l) {
    return Math.round(l / ye) * ye;
  }
  function Oy(l, n, a, o) {
    const i = (l.x - n.x) * a, c = (l.y - n.y) * a;
    return Math.sqrt(i * i + c * c) <= o;
  }
  const Iy = 10, Dy = 8, J2 = 6;
  function zy(l, n, a) {
    const o = J2 / a;
    let i = null, c = null, d = l.x, f = l.y;
    for (const h of n) if (i === null && Math.abs(l.x - h.x) <= o && (d = h.x, i = h), c === null && Math.abs(l.y - h.y) <= o && (f = h.y, c = h), i !== null && c !== null) break;
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
  function Hy(l, n) {
    const a = n.x - l.x, o = n.y - l.y;
    if (a === 0 && o === 0) return n;
    const i = Math.abs(Math.atan2(Math.abs(o), Math.abs(a)) * (180 / Math.PI));
    return i <= Dy ? {
      x: n.x,
      y: l.y
    } : i >= 90 - Dy ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function eC(l, n, a, o) {
    const [i, c] = g.useState([]), [d, f] = g.useState(false), [h, p] = g.useState(null), [v, x] = g.useState(false), [S, E] = g.useState(null), k = ve((N) => N.activeLayerId), b = ve((N) => N.layers), C = qt((N) => N.activeTool);
    g.useEffect(() => {
      C !== "polygon" && (c([]), f(false), p(null), x(false), E(null));
    }, [
      C
    ]);
    const _ = g.useCallback((N) => {
      if (!n || !a || N.length < 3) return;
      const T = new Float64Array(N.length * 2);
      for (let te = 0; te < N.length; te++) T[te * 2] = N[te].x, T[te * 2 + 1] = N[te].y;
      const O = b.get(k), D = (O == null ? void 0 : O.layerNumber) ?? 1, H = (O == null ? void 0 : O.datatype) ?? 0, $ = new p0(T, D, H);
      fe.getState().execute($, {
        library: n,
        renderer: a
      }), c([]), f(false), p(null), x(false);
    }, [
      n,
      a,
      k,
      b
    ]), R = g.useCallback((N) => {
      if (N.button !== 0) return;
      const O = N.currentTarget.getBoundingClientRect(), D = N.clientX - O.left, H = N.clientY - O.top, $ = l(D, H);
      if (!$) return;
      let te = {
        x: Ni($.x),
        y: Ni($.y)
      };
      if (i.length > 0 && !N.shiftKey && (te = zy(te, i, o).point, te = Hy(i[i.length - 1], te)), i.length >= 3) {
        const ge = i[0];
        if (Oy(ge, te, o, Iy)) {
          _(i);
          return;
        }
      }
      const J = i[i.length - 1];
      if (J && te.x === J.x && te.y === J.y) return;
      const ee = [
        ...i,
        te
      ];
      c(ee), f(true);
    }, [
      l,
      i,
      o,
      _
    ]), j = g.useCallback((N) => {
      const O = N.currentTarget.getBoundingClientRect(), D = N.clientX - O.left, H = N.clientY - O.top, $ = l(D, H);
      if (!$) return;
      let te = {
        x: Ni($.x),
        y: Ni($.y)
      }, J = null;
      if (i.length > 0 && !N.shiftKey) {
        const ge = zy(te, i, o);
        te = ge.point, J = ge.guides, te = Hy(i[i.length - 1], te);
      }
      const ee = i.length >= 3 && Oy(i[0], te, o, Iy);
      ee && (te = {
        ...i[0]
      }, J = null), x(ee), p(te), E(J);
    }, [
      l,
      i,
      o
    ]), A = g.useCallback(() => {
      c([]), f(false), p(null), x(false), E(null);
    }, []);
    return {
      handleMouseDown: R,
      handleMouseMove: j,
      cancelDrawing: A,
      isDrawing: d,
      points: i,
      cursorPoint: h,
      isNearStart: v,
      alignmentGuides: S
    };
  }
  function Ti(l) {
    return Math.round(l / ye) * ye;
  }
  const tC = 6;
  function Yy(l, n, a) {
    const o = tC / a;
    let i = null, c = null, d = l.x, f = l.y;
    for (const h of n) if (i === null && Math.abs(l.x - h.x) <= o && (d = h.x, i = h), c === null && Math.abs(l.y - h.y) <= o && (f = h.y, c = h), i !== null && c !== null) break;
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
  function nC(l, n, a, o) {
    const [i, c] = g.useState([]), [d, f] = g.useState(false), [h, p] = g.useState(null), [v, x] = g.useState(null), S = ve((A) => A.activeLayerId), E = ve((A) => A.layers), k = qt((A) => A.activeTool);
    g.useEffect(() => {
      k !== "path" && (c([]), f(false), p(null), x(null));
    }, [
      k
    ]);
    const b = g.useCallback((A) => {
      if (!n || !a || A.length < 2) return;
      const { width: N, cornerRadius: T, numArcPoints: O } = tt.getState(), D = new Float64Array(A.length * 2);
      for (let ee = 0; ee < A.length; ee++) D[ee * 2] = A[ee].x, D[ee * 2 + 1] = A[ee].y;
      const H = E.get(S), $ = (H == null ? void 0 : H.layerNumber) ?? 1, te = (H == null ? void 0 : H.datatype) ?? 0, J = new b0(D, N, $, te, [
        ...A
      ], T, O);
      fe.getState().execute(J, {
        library: n,
        renderer: a
      }), c([]), f(false), p(null), x(null);
    }, [
      n,
      a,
      S,
      E
    ]), C = g.useCallback((A) => {
      if (A.button !== 0) return;
      const T = A.currentTarget.getBoundingClientRect(), O = A.clientX - T.left, D = A.clientY - T.top, H = l(O, D);
      if (!H) return;
      let $ = {
        x: Ti(H.x),
        y: Ti(H.y)
      };
      if (i.length > 0 && !A.shiftKey && ($ = Yy($, i, o).point, $ = _y(i[i.length - 1], $)), A.detail >= 2 && i.length >= 2) {
        b(i);
        return;
      }
      const te = i[i.length - 1];
      if (te && $.x === te.x && $.y === te.y) return;
      const J = [
        ...i,
        $
      ];
      c(J), f(true);
    }, [
      l,
      i,
      o,
      b
    ]), _ = g.useCallback((A) => {
      const T = A.currentTarget.getBoundingClientRect(), O = A.clientX - T.left, D = A.clientY - T.top, H = l(O, D);
      if (!H) return;
      let $ = {
        x: Ti(H.x),
        y: Ti(H.y)
      }, te = null;
      if (i.length > 0 && !A.shiftKey) {
        const J = Yy($, i, o);
        $ = J.point, te = J.guides, $ = _y(i[i.length - 1], $);
      }
      p($), x(te);
    }, [
      l,
      i,
      o
    ]), R = g.useCallback((A) => {
      A.key === "Enter" && i.length >= 2 && (A.preventDefault(), b(i));
    }, [
      i,
      b
    ]);
    g.useEffect(() => {
      if (d) return window.addEventListener("keydown", R), () => window.removeEventListener("keydown", R);
    }, [
      d,
      R
    ]);
    const j = g.useCallback(() => {
      c([]), f(false), p(null), x(null);
    }, []);
    return {
      handleMouseDown: C,
      handleMouseMove: _,
      cancelDrawing: j,
      isDrawing: d,
      waypoints: i,
      cursorPoint: h,
      alignmentGuides: v
    };
  }
  const By = St((l, n) => ({
    box: null,
    isDrawing: false,
    previewIds: /* @__PURE__ */ new Set(),
    startDrawing: (a, o) => l({
      box: {
        x: a,
        y: o,
        width: 0,
        height: 0
      },
      isDrawing: true,
      previewIds: /* @__PURE__ */ new Set()
    }),
    updateBox: (a, o) => {
      const i = n();
      !i.box || !i.isDrawing || l({
        box: {
          ...i.box,
          width: a - i.box.x,
          height: o - i.box.y
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
  })), Xy = 15;
  function Bf(l) {
    if (!l) return null;
    try {
      const n = l.get_all_vertices();
      return n.length > 0 ? n : null;
    } catch {
      return null;
    }
  }
  function lC(l, n, a, o, i, c) {
    const d = i - a, f = c - o, h = d * d + f * f;
    if (h === 0) {
      const E = (l - a) * (l - a) + (n - o) * (n - o);
      return {
        point: {
          x: a,
          y: o
        },
        distSq: E
      };
    }
    const p = Math.max(0, Math.min(1, ((l - a) * d + (n - o) * f) / h)), v = a + p * d, x = o + p * f, S = (l - v) * (l - v) + (n - x) * (n - x);
    return {
      point: {
        x: v,
        y: x
      },
      distSq: S
    };
  }
  function aC(l, n, a, o, i) {
    let c = null, d = Xy * Xy;
    const f = (l - i.x) / o, h = (n - i.y) / o;
    for (const p of a) {
      const v = p.length / 2;
      if (!(v < 2)) for (let x = 0; x < v; x++) {
        const S = (x + 1) % v, E = p[x * 2], k = p[x * 2 + 1], b = p[S * 2], C = p[S * 2 + 1], { point: _, distSq: R } = lC(f, h, E, k, b, C), j = R * o * o;
        j < d && (d = j, c = _);
      }
    }
    return c;
  }
  function Uy(l) {
    return Math.round(l / ye) * ye;
  }
  function rC(l) {
    const n = [];
    let a = 0;
    for (; a < l.length; ) {
      const o = l[a];
      if (a++, o < 2 || a + o * 2 > l.length) break;
      const i = [];
      for (let c = 0; c < o; c++) i.push(l[a], l[a + 1]), a += 2;
      n.push(i);
    }
    return n;
  }
  function Xf(l, n, a, o, i, c, d, f = false) {
    if (!f && i && i.length >= 5) {
      const h = rC(i);
      if (h.length > 0) {
        const p = aC(l, n, h, c, d);
        if (p) return {
          point: p,
          isGeometrySnap: true
        };
      }
    }
    return {
      point: {
        x: Uy(a),
        y: Uy(o)
      },
      isGeometrySnap: false
    };
  }
  const $y = 5;
  function Vy(l, n) {
    return l.get_group_ids(n);
  }
  function qy(l, n) {
    const a = /* @__PURE__ */ new Set(), o = [], i = /* @__PURE__ */ new Set();
    for (const c of n) {
      if (c.startsWith("ref:")) {
        const f = c.substring(4, c.indexOf(":", 4));
        if (i.has(f)) {
          a.has(c) || (a.add(c), o.push(c));
          continue;
        }
        i.add(f);
      }
      const d = l.get_group_ids(c);
      for (const f of d) a.has(f) || (a.add(f), o.push(f));
    }
    return o;
  }
  const oC = 8, Oi = 12, Uf = 140, $f = 56;
  function sC(l, n, a, o, i, c) {
    const d = l - a, f = n - o, h = i - a, p = c - o, v = d * h + f * p, x = h * h + p * p;
    if (x === 0) return Math.sqrt(d * d + f * f);
    const S = Math.max(0, Math.min(1, v / x)), E = a + S * h, k = o + S * p, b = l - E, C = n - k;
    return Math.sqrt(b * b + C * C);
  }
  function Gy(l, n, a, o, i) {
    for (const c of a.values()) {
      const d = c.start.x * o + i.x, f = c.start.y * o + i.y, h = c.end.x * o + i.x, p = c.end.y * o + i.y, v = l - d, x = n - f;
      if (v * v + x * x <= Oi * Oi) return {
        rulerId: c.id,
        endpoint: "start"
      };
      const S = l - h, E = n - p;
      if (S * S + E * E <= Oi * Oi) return {
        rulerId: c.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function Py(l, n, a, o, i) {
    for (const c of a.values()) {
      const d = c.start.x * o + i.x, f = c.start.y * o + i.y, h = c.end.x * o + i.x, p = c.end.y * o + i.y, v = (d + h) / 2, x = (f + p) / 2, S = Uf / 2, E = $f / 2;
      if (l >= v - S && l <= v + S && n >= x - E && n <= x + E || sC(l, n, d, f, h, p) <= oC) return c.id;
    }
    return null;
  }
  function iC(l, n, a, o, i, c, d, f) {
    if (l >= i && l <= d && n >= c && n <= f || a >= i && a <= d && o >= c && o <= f) return true;
    const h = [
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
    for (const [p, v, x, S] of h) if (cC(l, n, a, o, p, v, x, S)) return true;
    return false;
  }
  function cC(l, n, a, o, i, c, d, f) {
    const h = Ii(i, c, d, f, l, n), p = Ii(i, c, d, f, a, o), v = Ii(l, n, a, o, i, c), x = Ii(l, n, a, o, d, f);
    return !!((h > 0 && p < 0 || h < 0 && p > 0) && (v > 0 && x < 0 || v < 0 && x > 0) || h === 0 && Di(i, c, d, f, l, n) || p === 0 && Di(i, c, d, f, a, o) || v === 0 && Di(l, n, a, o, i, c) || x === 0 && Di(l, n, a, o, d, f));
  }
  function Ii(l, n, a, o, i, c) {
    return (i - l) * (o - n) - (a - l) * (c - n);
  }
  function Di(l, n, a, o, i, c) {
    return Math.min(l, a) <= i && i <= Math.max(l, a) && Math.min(n, o) <= c && c <= Math.max(n, o);
  }
  function Zy(l, n, a, o, i, c, d) {
    const f = [];
    for (const h of i.values()) {
      const p = h.start.x * c + d.x, v = h.start.y * c + d.y, x = h.end.x * c + d.x, S = h.end.y * c + d.y;
      if (iC(p, v, x, S, l, n, a, o)) {
        f.push(h.id);
        continue;
      }
      const E = (p + x) / 2, k = (v + S) / 2, b = E - Uf / 2, C = E + Uf / 2, _ = k - $f / 2, R = k + $f / 2;
      b <= a && C >= l && _ <= o && R >= n && f.push(h.id);
    }
    return f;
  }
  function uC(l, n, a) {
    const { selectedIds: o, hoveredId: i, clearSelection: c, setHover: d } = ue(), { box: f, isDrawing: h, previewIds: p, startDrawing: v, updateBox: x, setPreviewIds: S, reset: E } = By(), { zoom: k, offset: b } = Ye(), C = Oe((L) => L.rulers), _ = Oe((L) => L.selectedRulerIds), R = Oe((L) => L.selectRuler), j = Oe((L) => L.toggleSelection), A = Oe((L) => L.addToSelection), N = Oe((L) => L.clearSelection), T = Oe((L) => L.setHoveredRuler), O = Oe((L) => L.setHoveredEndpoint), D = Oe((L) => L.setDraggingEndpoint), H = Oe((L) => L.endDraggingEndpoint), $ = Oe((L) => L.updateEndpoint), te = Oe((L) => L.hoveredRulerId), J = Oe((L) => L.hoveredEndpoint), ee = Oe((L) => L.draggingEndpoint), ge = Oe((L) => L.setMarqueePreviewIds), Ce = Oe((L) => L.setSnapPoint), V = g.useRef("");
    g.useEffect(() => {
      if (!a) return;
      const L = Array.from(o).filter((I) => !xn(I));
      a.set_selection(L);
    }, [
      a,
      o
    ]), g.useEffect(() => {
      if (a) if (h) {
        const L = Array.from(p).filter((I) => !xn(I));
        a.set_hover_multiple(L);
      } else if (i && !xn(i) && n) {
        const L = Vy(n, i);
        a.set_hover_multiple(L);
      } else a.set_hover(void 0);
    }, [
      a,
      n,
      i,
      h,
      p
    ]);
    const P = g.useCallback((L) => {
      if (L.button !== 0) return;
      const Z = L.currentTarget.getBoundingClientRect(), W = L.clientX - Z.left, G = L.clientY - Z.top, se = Gy(W, G, C, k, b);
      if (se) {
        R(se.rulerId), D(se), c();
        return;
      }
      const Y = Py(W, G, C, k, b);
      if (Y) {
        L.shiftKey ? A([
          Y
        ]) : L.metaKey || L.ctrlKey ? j(Y) : R(Y), c();
        return;
      }
      _.size > 0 && N();
      const re = l(W, G);
      if (!re || !n) return;
      let z = n.hit_test(re.x, re.y);
      if (z || (z = es(re.x, re.y) ?? void 0), z) {
        const oe = xn(z) ? [
          z
        ] : Vy(n, z);
        if (L.shiftKey) {
          const de = ue.getState().selectedIds, _e = /* @__PURE__ */ new Set([
            ...de,
            ...oe
          ]);
          ue.setState({
            selectedIds: _e,
            lastSelectedId: z
          });
        } else if (L.metaKey || L.ctrlKey) {
          const de = ue.getState().selectedIds, _e = oe.every((je) => de.has(je)), Ee = new Set(de);
          if (_e) for (const je of oe) Ee.delete(je);
          else for (const je of oe) Ee.add(je);
          ue.setState({
            selectedIds: Ee,
            lastSelectedId: z
          });
        } else ue.setState({
          selectedIds: new Set(oe),
          lastSelectedId: z
        });
      } else v(W, G), !L.shiftKey && !L.metaKey && !L.ctrlKey && c();
    }, [
      l,
      n,
      C,
      k,
      b,
      _,
      c,
      R,
      j,
      A,
      N,
      D,
      v
    ]), pe = g.useCallback((L) => {
      const Z = L.currentTarget.getBoundingClientRect(), W = L.clientX - Z.left, G = L.clientY - Z.top;
      if (ee) {
        const z = l(W, G);
        if (z) {
          const oe = Bf(n), de = Xf(W, G, z.x, z.y, oe, k, b, L.shiftKey);
          $(ee.rulerId, ee.endpoint, de.point), Ce(de.isGeometrySnap ? de.point : null);
        }
        return;
      }
      if (h) {
        x(W, G);
        const z = By.getState().box;
        if (z) {
          const oe = Math.min(z.x, z.x + z.width), de = Math.max(z.x, z.x + z.width), _e = Math.min(z.y, z.y + z.height), Ee = Math.max(z.y, z.y + z.height), je = Zy(oe, _e, de, Ee, C, k, b);
          ge(je);
          {
            const we = (oe - b.x) / k, ze = (de - b.x) / k, Ae = (_e - b.y) / k, qe = (Ee - b.y) / k, Be = Math.min(we, ze), Qe = Math.max(we, ze), Xe = Math.min(Ae, qe), vt = Math.max(Ae, qe), jt = n ? n.hit_test_rect(Be, Xe, Qe, vt) : [], ft = n ? qy(n, jt) : jt, Rn = Cy(Be, Xe, Qe, vt), cl = [
              ...ft,
              ...Rn
            ], ul = cl.sort().join(",");
            ul !== V.current && (V.current = ul, S(cl));
          }
        }
        return;
      }
      const se = Gy(W, G, C, k, b);
      let Y = null;
      se ? (((J == null ? void 0 : J.rulerId) !== se.rulerId || (J == null ? void 0 : J.endpoint) !== se.endpoint) && O(se), te !== se.rulerId && T(se.rulerId), Y = se.rulerId) : (J && O(null), Y = Py(W, G, C, k, b), Y !== te && T(Y));
      const re = l(W, G);
      if (!re || !n) {
        i !== null && d(null);
        return;
      }
      if (Y) i !== null && d(null);
      else {
        let z = n.hit_test(re.x, re.y);
        z || (z = es(re.x, re.y) ?? void 0), (z ?? null) !== i && d(z ?? null);
      }
    }, [
      l,
      n,
      C,
      i,
      te,
      J,
      ee,
      d,
      T,
      O,
      $,
      ge,
      h,
      x,
      k,
      b,
      S,
      Ce
    ]), xe = g.useCallback(() => {
      if (ee) {
        const Z = H();
        if (Ce(null), Z && n && a) {
          const W = new x0(Z.rulerId, Z.endpoint, Z.oldPosition, Z.newPosition);
          fe.getState().pushCommand(W);
        }
        return;
      }
      if (!h || !f) {
        E(), ge([]);
        return;
      }
      const L = Math.abs(f.width), I = Math.abs(f.height);
      if (L > $y || I > $y) {
        const Z = Math.min(f.x, f.x + f.width), W = Math.max(f.x, f.x + f.width), G = Math.min(f.y, f.y + f.height), se = Math.max(f.y, f.y + f.height), Y = Zy(Z, G, W, se, C, k, b), re = (Z - b.x) / k, z = (W - b.x) / k, oe = (G - b.y) / k, de = (se - b.y) / k, _e = Math.min(re, z), Ee = Math.max(re, z), je = Math.min(oe, de), we = Math.max(oe, de), ze = n ? n.hit_test_rect(_e, je, Ee, we) : [], Ae = n ? qy(n, ze) : ze, qe = Cy(_e, je, Ee, we);
        Y.length > 0 && A(Y);
        const Be = [
          ...Ae,
          ...qe
        ];
        if (Be.length > 0) {
          const Qe = ue.getState().selectedIds, Xe = /* @__PURE__ */ new Set([
            ...Qe,
            ...Be
          ]);
          ue.getState().setSelection(Xe);
        }
      }
      E(), ge([]);
    }, [
      h,
      f,
      n,
      a,
      C,
      k,
      b,
      ee,
      A,
      H,
      E,
      ge,
      Ce
    ]), be = g.useCallback(() => {
      i !== null && d(null), te !== null && T(null), J !== null && O(null), ee !== null && D(null), E(), ge([]);
    }, [
      i,
      te,
      J,
      ee,
      d,
      T,
      O,
      D,
      E,
      ge
    ]);
    return {
      handleMouseDown: P,
      handleMouseMove: pe,
      handleMouseUp: xe,
      handleMouseLeave: be,
      selectedIds: o,
      hoveredId: i,
      hoveredRulerId: te,
      hoveredEndpoint: J,
      marqueeBox: f,
      isDrawingMarquee: h,
      previewIds: p
    };
  }
  const dC = 8, fC = 140, hC = 56;
  function mC(l, n, a, o, i, c) {
    const d = l - a, f = n - o, h = i - a, p = c - o, v = d * h + f * p, x = h * h + p * p;
    if (x === 0) return Math.sqrt(d * d + f * f);
    const S = Math.max(0, Math.min(1, v / x)), E = a + S * h, k = o + S * p, b = l - E, C = n - k;
    return Math.sqrt(b * b + C * C);
  }
  function Ky(l, n, a, o, i) {
    for (const c of a.values()) {
      const d = c.start.x * o + i.x, f = c.start.y * o + i.y, h = c.end.x * o + i.x, p = c.end.y * o + i.y, v = (d + h) / 2, x = (f + p) / 2, S = fC / 2, E = hC / 2;
      if (l >= v - S && l <= v + S && n >= x - E && n <= x + E || mC(l, n, d, f, h, p) <= dC) return c.id;
    }
    return null;
  }
  function gC(l, n, a) {
    const [o, i] = g.useState(false), [c, d] = g.useState(null), [f, h] = g.useState(null), { zoom: p, offset: v } = Ye(), x = Oe((j) => j.rulers), S = Oe((j) => j.selectRuler), E = g.useRef(null), k = g.useCallback((j) => {
      if (j.button !== 0) return;
      const N = j.currentTarget.getBoundingClientRect(), T = j.clientX - N.left, O = j.clientY - N.top, D = l(T, O);
      if (!D) return;
      const H = Ky(T, O, x, p, v);
      if (H) {
        S(H), ue.getState().clearSelection(), E.current = {
          elementIds: [],
          rulerId: H,
          startWorld: D,
          currentDelta: {
            x: 0,
            y: 0
          }
        }, i(true);
        return;
      }
      let $;
      if (n && ($ = n.hit_test(D.x, D.y) ?? void 0), $ || ($ = es(D.x, D.y) ?? void 0), !$) return;
      S(null);
      const { selectedIds: te } = ue.getState();
      if (xn($)) {
        let ge;
        te.has($) ? ge = [
          ...te
        ].filter((Ce) => xn(Ce)) : (ge = [
          $
        ], ue.getState().select($)), E.current = {
          elementIds: ge,
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
      const J = n.get_group_ids($);
      let ee;
      te.has($) ? ee = [
        ...te
      ].filter((ge) => !xn(ge)) : (ee = J, ue.getState().setSelection(new Set(J))), E.current = {
        elementIds: ee,
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
    ]), b = g.useCallback((j) => {
      const N = j.currentTarget.getBoundingClientRect(), T = j.clientX - N.left, O = j.clientY - N.top, D = l(T, O);
      if (!D) return;
      if (!o) {
        const ge = Ky(T, O, x, p, v);
        ge !== f && h(ge);
        {
          let Ce = null;
          n && (Ce = n.hit_test(D.x, D.y) ?? null), Ce || (Ce = es(D.x, D.y)), Ce !== c && d(Ce);
        }
        return;
      }
      const H = E.current;
      if (!H) return;
      const $ = D.x - H.startWorld.x, te = D.y - H.startWorld.y, J = $ - H.currentDelta.x, ee = te - H.currentDelta.y;
      if (J !== 0 || ee !== 0) {
        if (H.rulerId) {
          const ge = Oe.getState().rulers.get(H.rulerId);
          ge && (Oe.getState().updateEndpoint(H.rulerId, "start", {
            x: ge.start.x + J,
            y: ge.start.y + ee
          }), Oe.getState().updateEndpoint(H.rulerId, "end", {
            x: ge.end.x + J,
            y: ge.end.y + ee
          }));
        } else if (H.elementIds.length > 0 && xn(H.elementIds[0])) {
          const ge = ut.getState();
          for (const Ce of H.elementIds) {
            const V = Ln(Ce), P = ge.images.get(V);
            P && ge.updateImage(V, {
              x: P.x + J,
              y: P.y + ee
            });
          }
        } else n && a && (n.translate_elements(H.elementIds, J, ee), tt.getState().translateWaypoints(H.elementIds, J, ee), a.sync_from_library(n), a.mark_dirty(), Se.getState().bumpSyncGeneration());
        H.currentDelta = {
          x: $,
          y: te
        };
      }
    }, [
      l,
      n,
      a,
      x,
      p,
      v,
      o,
      c,
      f
    ]), C = g.useCallback(() => {
      if (!o) {
        i(false), E.current = null;
        return;
      }
      const j = E.current;
      if (!j) {
        i(false);
        return;
      }
      const { elementIds: A, rulerId: N, currentDelta: T } = j;
      if (N && (T.x !== 0 || T.y !== 0)) {
        const O = new v0([
          N
        ], T.x, T.y);
        fe.getState().pushCommand(O), i(false), E.current = null;
        return;
      }
      if (A.length > 0 && xn(A[0]) && (T.x !== 0 || T.y !== 0)) {
        const O = new t2(A, T.x, T.y);
        fe.getState().pushCommand(O);
      } else if (n && a && (T.x !== 0 || T.y !== 0)) {
        const O = new VS(A, T.x, T.y);
        fe.getState().pushCommand(O), Se.getState().bumpSyncGeneration();
      }
      i(false), E.current = null;
    }, [
      o,
      n,
      a
    ]), _ = g.useCallback(() => {
      if (!o) {
        i(false), E.current = null;
        return;
      }
      const j = E.current;
      if (j && (j.currentDelta.x !== 0 || j.currentDelta.y !== 0)) if (j.rulerId) {
        const A = Oe.getState().rulers.get(j.rulerId);
        A && (Oe.getState().updateEndpoint(j.rulerId, "start", {
          x: A.start.x - j.currentDelta.x,
          y: A.start.y - j.currentDelta.y
        }), Oe.getState().updateEndpoint(j.rulerId, "end", {
          x: A.end.x - j.currentDelta.x,
          y: A.end.y - j.currentDelta.y
        }));
      } else if (j.elementIds.length > 0 && xn(j.elementIds[0])) {
        const A = ut.getState();
        for (const N of j.elementIds) {
          const T = Ln(N), O = A.images.get(T);
          O && A.updateImage(T, {
            x: O.x - j.currentDelta.x,
            y: O.y - j.currentDelta.y
          });
        }
      } else n && a && (n.translate_elements(j.elementIds, -j.currentDelta.x, -j.currentDelta.y), tt.getState().translateWaypoints(j.elementIds, -j.currentDelta.x, -j.currentDelta.y), a.sync_from_library(n), a.mark_dirty());
      i(false), E.current = null;
    }, [
      o,
      n,
      a
    ]), R = g.useCallback(() => {
      o && _(), d(null), h(null);
    }, [
      o,
      _
    ]);
    return {
      handleMouseDown: k,
      handleMouseMove: b,
      handleMouseUp: C,
      handleMouseLeave: R,
      cancelMove: _,
      isMoving: o,
      hoveredId: c,
      hoveredRulerId: f
    };
  }
  function Fy(l, n) {
    return l.line < n.line ? true : l.line > n.line ? false : l.column < n.column;
  }
  function ch(l) {
    if (!l || !l.isActive || l.anchor.line === l.focus.line && l.anchor.column === l.focus.column) return null;
    const n = Fy(l.anchor, l.focus) ? l.anchor : l.focus, a = Fy(l.anchor, l.focus) ? l.focus : l.anchor;
    return {
      start: n,
      end: a
    };
  }
  function pC(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return "";
    const n = ch(l.selection);
    if (!n) return "";
    const a = l.content.split(`
`);
    let o = "";
    for (let i = n.start.line; i <= n.end.line; i++) {
      const c = a[i], d = i === n.start.line ? n.start.column : 0, f = i === n.end.line ? n.end.column : c.length;
      o += c.substring(d, f), i < n.end.line && (o += `
`);
    }
    return o;
  }
  function yC(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return l;
    const n = ch(l.selection);
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
  function bC(l, n, a) {
    var _a;
    a == null ? void 0 : a.preventDefault(), a == null ? void 0 : a.stopPropagation();
    const o = l.content.split(`
`), { line: i, column: c } = l.cursorPosition, d = (a == null ? void 0 : a.shiftKey) || false;
    let f = i, h = c, p = l;
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
        c > 0 ? h = c - 1 : i > 0 && (f = i - 1, h = o[f].length);
        break;
      case "ArrowRight":
        c < o[i].length ? h = c + 1 : i < o.length - 1 && (f = i + 1, h = 0);
        break;
      case "ArrowUp":
        i > 0 && (f = i - 1, h = Math.min(c, o[f].length));
        break;
      case "ArrowDown":
        i < o.length - 1 && (f = i + 1, h = Math.min(c, o[f].length));
        break;
      case "Home":
        h = 0;
        break;
      case "End":
        h = o[i].length;
        break;
    }
    if (d) {
      const v = {
        line: f,
        column: h
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
        column: h
      },
      selection: void 0
    };
  }
  function vC(l, n) {
    if (n.key === "a" && (n.ctrlKey || n.metaKey)) {
      n.preventDefault(), n.stopPropagation();
      const a = l.content.split(`
`), o = a.length - 1, i = a[o].length;
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
  function Qy(l, n, a) {
    var _a;
    if (a && (a.ctrlKey || a.metaKey)) {
      const d = vC(l, a);
      if (d) return d;
    }
    let o = null;
    if (((_a = l.selection) == null ? void 0 : _a.isActive) && (n.length === 1 || n === "Backspace" || n === "Delete") && (l = yC(l), n === "Backspace" || n === "Delete")) return l;
    const i = l.content.split(`
`), c = i[l.cursorPosition.line];
    switch (n) {
      case "Enter": {
        if (a == null ? void 0 : a.preventDefault(), a == null ? void 0 : a.stopPropagation(), !(a == null ? void 0 : a.shiftKey)) return null;
        const d = c.slice(0, l.cursorPosition.column), f = c.slice(l.cursorPosition.column), h = [
          ...i
        ];
        h[l.cursorPosition.line] = d, h.splice(l.cursorPosition.line + 1, 0, f), o = {
          ...l,
          content: h.join(`
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
        if (a == null ? void 0 : a.preventDefault(), a == null ? void 0 : a.stopPropagation(), l.cursorPosition.column < c.length) {
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
        o = bC(l, n, a);
        break;
      default:
        if (n.length === 1) {
          a == null ? void 0 : a.preventDefault(), a == null ? void 0 : a.stopPropagation();
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
  function Wy(l) {
    return Math.round(l / ye) * ye;
  }
  function xC(l, n, a) {
    const o = an((p) => p.isEditingText), i = g.useRef(null), c = g.useCallback(() => {
      const p = an.getState().activeText;
      if (!p || !p.content.trim() || !n || !a) {
        an.getState().stopEditing();
        return;
      }
      const v = ve.getState().layers.get(ve.getState().activeLayerId), x = (v == null ? void 0 : v.layerNumber) ?? 1, S = (v == null ? void 0 : v.datatype) ?? 0, E = new R0(p.content, p.x, p.y, s0 * ye, x, S);
      fe.getState().execute(E, {
        library: n,
        renderer: a
      }), Se.getState().bumpSyncGeneration(), an.getState().stopEditing();
    }, [
      n,
      a
    ]), d = g.useCallback(() => {
      an.getState().stopEditing();
    }, []), f = g.useCallback((p) => {
      if (p.button !== 0) return;
      const x = p.currentTarget.getBoundingClientRect(), S = p.clientX - x.left, E = p.clientY - x.top, k = l(S, E);
      if (!k) return;
      if (o) {
        c();
        return;
      }
      const b = Wy(k.x), C = Wy(k.y);
      an.getState().startEditing(b, C);
    }, [
      l,
      o,
      c
    ]), h = g.useCallback((p) => {
    }, []);
    return g.useEffect(() => {
      if (!o) return;
      const p = (v) => {
        const x = an.getState().activeText;
        if (!x) return;
        if (v.key === "Escape") {
          v.preventDefault(), v.stopPropagation(), d(), qt.getState().setTool("select");
          return;
        }
        if (v.key === "c" && (v.ctrlKey || v.metaKey)) {
          const E = pC(x);
          E && (v.preventDefault(), navigator.clipboard.writeText(E));
          return;
        }
        if (v.key === "v" && (v.ctrlKey || v.metaKey)) {
          v.preventDefault(), v.stopPropagation(), navigator.clipboard.readText().then((E) => {
            if (!E) return;
            const k = an.getState().activeText;
            if (!k) return;
            let b = k;
            for (const C of E) {
              const _ = Qy(b, C === `
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
              _ && (b = _);
            }
            an.getState().setActiveText(b);
          });
          return;
        }
        const S = Qy(x, v.key, v);
        if (S === null) {
          c();
          return;
        }
        S !== x && (an.getState().setActiveText(S), an.getState().resetCursor());
      };
      return window.addEventListener("keydown", p, true), () => window.removeEventListener("keydown", p, true);
    }, [
      o,
      c,
      d
    ]), g.useEffect(() => (o && (i.current = setInterval(() => {
      an.getState().toggleCursor();
    }, NS)), () => {
      i.current && (clearInterval(i.current), i.current = null);
    }), [
      o
    ]), {
      handleMouseDown: f,
      handleMouseMove: h,
      commitText: c,
      cancelEditing: d,
      isEditing: o
    };
  }
  const Un = "__TAURI__" in window;
  async function ds(l, n) {
    const { invoke: a } = await wt(async () => {
      const { invoke: o } = await import("./core-DxBnVPgq.js");
      return {
        invoke: o
      };
    }, [], import.meta.url);
    return a(l, n);
  }
  async function U0(l) {
    const n = await ds("read_gds_bytes", {
      path: l
    });
    return new Uint8Array(n);
  }
  async function $0(l, n) {
    return ds("save_gds", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function V0(l, n) {
    return ds("save_bytes", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function q0() {
    return ds("get_pending_file");
  }
  async function G0() {
    const { open: l } = await wt(async () => {
      const { open: a } = await import("./index-C2Rw4G7o.js");
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
  async function P0(l) {
    const { save: n } = await wt(async () => {
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
  async function Z0(l) {
    const { save: n } = await wt(async () => {
      const { save: a } = await import("./index-C2Rw4G7o.js");
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
  async function K0() {
    const { open: l } = await wt(async () => {
      const { open: a } = await import("./index-C2Rw4G7o.js");
      return {
        open: a
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
  async function F0(l) {
    const n = await ds("read_gds_bytes", {
      path: l
    });
    return new Uint8Array(n);
  }
  async function Q0(l, n) {
    const { listen: a } = await wt(async () => {
      const { listen: i } = await import("./event-BC8TvpKC.js");
      return {
        listen: i
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    return await a(l, (i) => n(i.payload));
  }
  const W0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    getPendingFile: q0,
    isTauri: Un,
    listenTauri: Q0,
    pickGdsFile: G0,
    pickImageFile: K0,
    pickSaveFile: P0,
    pickSaveImageFile: Z0,
    readFileBytes: F0,
    readGdsBytes: U0,
    saveBytes: V0,
    saveGds: $0
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function wC() {
    return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  const Ze = St((l, n) => ({
    tabs: [],
    activeTabId: null,
    addTab: (a) => {
      const o = wC(), i = {
        id: o,
        title: (a == null ? void 0 : a.title) ?? "untitled",
        filePath: (a == null ? void 0 : a.filePath) ?? null,
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
    closeTab: (a) => {
      const o = n(), i = o.tabs.findIndex((f) => f.id === a);
      if (i === -1) return false;
      const c = o.tabs.filter((f) => f.id !== a);
      let d = o.activeTabId;
      return o.activeTabId === a && (c.length === 0 ? d = null : i < c.length ? d = c[i].id : d = c[c.length - 1].id), l({
        tabs: c,
        activeTabId: d
      }), true;
    },
    setActiveTab: (a) => {
      n().tabs.some((i) => i.id === a) && l({
        activeTabId: a
      });
    },
    updateTab: (a, o) => {
      l((i) => ({
        tabs: i.tabs.map((c) => c.id === a ? {
          ...c,
          ...o
        } : c)
      }));
    },
    getActiveTab: () => {
      const a = n();
      return a.activeTabId ? a.tabs.find((o) => o.id === a.activeTabId) ?? null : null;
    },
    getTab: (a) => n().tabs.find((o) => o.id === a),
    findTabByPath: (a) => n().tabs.find((o) => o.filePath === a)
  })), fs = /* @__PURE__ */ new Map(), ma = /* @__PURE__ */ new Map();
  function as(l) {
    const n = Ye.getState(), a = ue.getState(), o = fe.getState(), i = ve.getState(), c = he.getState(), d = qt.getState(), f = tt.getState(), h = Oe.getState(), p = jn.getState(), v = Wn.getState(), x = {
      viewport: {
        zoom: n.zoom,
        offset: {
          ...n.offset
        },
        initialized: n.initialized
      },
      selection: {
        selectedIds: new Set(a.selectedIds),
        hoveredId: a.hoveredId,
        lastSelectedId: a.lastSelectedId
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
        rulers: new Map(h.rulers),
        selectedRulerIds: new Set(h.selectedRulerIds)
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
    fs.set(l, x), Ze.getState().updateTab(l, {
      isDirty: v.isDirty
    });
  }
  function J0(l) {
    const n = fs.get(l);
    if (!n) return;
    Ye.setState({
      zoom: n.viewport.zoom,
      offset: {
        ...n.viewport.offset
      },
      initialized: n.viewport.initialized
    }), ue.setState({
      selectedIds: new Set(n.selection.selectedIds),
      hoveredId: n.selection.hoveredId,
      lastSelectedId: n.selection.lastSelectedId
    }), fe.setState({
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
    }), he.setState({
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
    }), qt.setState({
      activeTool: n.tool.activeTool,
      toolSetAt: Date.now()
    }), tt.setState({
      width: n.path.width,
      cornerRadius: n.path.cornerRadius,
      numArcPoints: n.path.numArcPoints,
      pathMetadata: new Map(n.path.pathMetadata)
    }), Oe.setState({
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
    }), jn.setState({
      elements: [
        ...n.clipboard.elements
      ],
      hasContent: n.clipboard.hasContent
    }), Wn.setState({
      isDirty: n.document.isDirty
    });
    const a = ma.get(l) ?? null;
    Se.setState({
      library: a
    }), Se.getState().bumpSyncGeneration();
  }
  function Fi(l) {
    fs.delete(l);
    const n = ma.get(l);
    n && (n.free(), ma.delete(l));
  }
  function Jo(l, n) {
    ma.set(l, n);
  }
  function Qi(l) {
    return ma.get(l) ?? null;
  }
  function Ua(l, n) {
    if (l && l !== n) {
      as(l);
      const a = Se.getState().library;
      a && ma.set(l, a);
    }
    J0(n);
  }
  function e1() {
    return {
      viewport: {
        zoom: Zi,
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
        layers: new Map(Wo.map((l) => [
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
        width: f0,
        cornerRadius: 0,
        numArcPoints: cc,
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
  function Wi(l, n) {
    const a = new n.WasmLibrary("rosette");
    try {
      a.add_cell("top");
    } catch {
    }
    a.set_active_cell("top"), ma.set(l, a);
    const o = e1();
    return fs.set(l, o), a;
  }
  function SC(l, n, a) {
    ma.set(l, n);
    const o = {
      ...e1(),
      ...a
    };
    fs.set(l, o);
  }
  const t1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    deleteTabSnapshot: Fi,
    getTabLibrary: Qi,
    initNewTab: Wi,
    initTabWithLibrary: SC,
    restoreTabSnapshot: J0,
    saveTabSnapshot: as,
    setTabLibrary: Jo,
    switchTab: Ua,
    useTabsStore: Ze
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  let Jy = null;
  const eb = /* @__PURE__ */ new Map();
  function Vf() {
    return new URLSearchParams(window.location.search).get("design") === "true";
  }
  function rs() {
    return new URLSearchParams(window.location.search).get("embed") === "true";
  }
  function CC() {
    return new URLSearchParams(window.location.search).get("src");
  }
  function EC() {
    const n = new URLSearchParams(window.location.search).get("colors");
    return n ? n.split(",").map((a) => `#${a.trim()}`) : null;
  }
  function kC() {
    const n = new URLSearchParams(window.location.search).get("fills");
    return n ? n.split(",").map((a) => a.trim()) : null;
  }
  function _C() {
    return new URLSearchParams(window.location.search).get("name");
  }
  function MC() {
    const n = new URLSearchParams(window.location.search).get("panelWidth");
    if (!n) return null;
    const a = Number.parseInt(n, 10);
    return Number.isNaN(a) || a <= 0 ? null : a;
  }
  function jC() {
    const n = new URLSearchParams(window.location.search).get("zoom");
    if (!n) return null;
    const a = Number.parseFloat(n);
    return Number.isNaN(a) || a <= 0 ? null : a;
  }
  function LC() {
    return Un && !Vf() && !rs();
  }
  function RC(l) {
    return l !== null && !Array.isArray(l) && "name" in l && "children" in l;
  }
  function Hd(l, n) {
    for (const a of n.values()) {
      const o = a.visible ? a.opacity ?? 0.7 : 0, [i, c, d, f] = ic(a.color, o);
      l.set_layer_color(a.layerNumber, a.datatype, i, c, d, f);
    }
  }
  const lc = Qo;
  function AC(l, n) {
    if (n.length === 0) return false;
    const a = new Set(n.map((f) => `${f.layerNumber}/${f.datatype}`)), o = n.map((f) => ({
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
      const h = i[f], p = i[f + 1], v = `${h}/${p}`;
      a.has(v) || (o.push({
        id: c++,
        layerNumber: h,
        datatype: p,
        name: p === 0 ? `layer${h}` : `layer${h}/${p}`,
        color: lc[d % lc.length],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      }), d++);
    }
    return ve.getState().resetLayers(o), true;
  }
  function Yd(l) {
    const n = l.get_used_layers();
    if (n.length === 0) return;
    const a = [];
    for (let o = 0; o < n.length; o += 2) {
      const i = n[o], c = n[o + 1], d = o / 2 + 1, f = (d - 1) % lc.length, h = c === 0 ? `layer${i}` : `layer${i}/${c}`;
      a.push({
        id: d,
        layerNumber: i,
        datatype: c,
        name: h,
        color: lc[f],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      });
    }
    ve.getState().resetLayers(a);
  }
  function Bd() {
    fe.getState().clear(), ue.getState().clearSelection(), Oe.getState().clearAllRulers(), jn.getState().clear(), Wn.getState().markClean();
  }
  function NC(l, n) {
    const a = l.get_cell_tree();
    if (a) {
      he.getState().setCellTree(a);
      const o = l.active_cell_name();
      o && he.getState().setActiveCell(o);
    } else he.getState().setCells([
      "top"
    ]);
    n && he.getState().setProjectName(n);
  }
  function TC(l, n) {
    const [a, o] = g.useState(null), [i, c] = g.useState(false), d = ve((k) => k.layers), f = g.useRef(d), h = g.useRef(0), p = g.useCallback((k) => {
      Jy = k, o(k);
    }, []), v = g.useRef(l);
    g.useEffect(() => {
      f.current = d;
    }, [
      d
    ]), g.useEffect(() => {
      v.current = l;
    }, [
      l
    ]), g.useEffect(() => Ze.subscribe((b, C) => {
      if (b.activeTabId && b.activeTabId !== C.activeTabId) {
        const _ = Qi(b.activeTabId);
        _ && (p(_), c(true));
      }
    }), [
      p
    ]), g.useEffect(() => {
      if (!l || !n || Vf() || rs()) return;
      he.getState().setProjectName("untitled-project"), ve.getState().resetLayers(Wo);
      const { tabs: k } = Ze.getState();
      if (k.length > 0) {
        const j = Ze.getState().activeTabId;
        if (j) {
          const A = Qi(j);
          if (A) {
            p(A), c(true);
            return;
          }
        }
      }
      const b = he.getState().projectName, C = Ze.getState().addTab({
        title: b
      }), _ = Wi(C, l), R = _.get_cell_tree();
      R ? he.getState().setCellTree(R) : he.getState().setCells([
        "top"
      ]), p(_), c(true);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n) return;
      const k = () => {
        const b = Ze.getState().addTab({
          title: "untitled-project"
        }), C = Wi(b, l);
        Bd(), ve.getState().resetLayers(Wo), he.getState().setProjectName("untitled-project");
        const _ = C.get_cell_tree();
        _ ? he.getState().setCellTree(_) : he.getState().setCells([
          "top"
        ]), he.getState().setActiveCell("top");
        const R = document.getElementById("rosette-canvas");
        if (R) {
          const j = R.getBoundingClientRect();
          Ye.getState().reset(j.width, j.height);
        }
        p(C), c(true), Se.getState().bumpSyncGeneration();
      };
      return window.addEventListener("rosette-new-tab", k), () => window.removeEventListener("rosette-new-tab", k);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !LC()) return;
      let k = false;
      const b = async (_) => {
        if (!k) try {
          const R = Ze.getState().findTabByPath(_);
          if (R) {
            const H = Ze.getState().activeTabId;
            if (H && H !== R.id) {
              Ua(H, R.id), Ze.getState().setActiveTab(R.id);
              const $ = Qi(R.id);
              $ && (p($), c(true));
            }
            return;
          }
          const j = await U0(_);
          if (k) return;
          const A = l.WasmLibrary.from_gds_bytes(j), N = Ze.getState().activeTabId;
          if (N) {
            as(N);
            const H = Se.getState().library;
            H && Jo(N, H);
          }
          const T = _.split(/[/\\]/).pop() ?? "untitled", O = Ze.getState().addTab({
            title: T,
            filePath: _
          });
          Yd(A), Hd(A, ve.getState().layers), Jo(O, A), Bd(), NC(A, T);
          const D = document.getElementById("rosette-canvas");
          if (D) {
            const H = D.getBoundingClientRect();
            Ye.getState().reset(H.width, H.height);
          }
          p(A), c(true), Se.getState().bumpSyncGeneration();
        } catch (R) {
          console.error("Failed to open GDS file:", R);
        }
      };
      q0().then((_) => {
        _ && !k && b(_);
      });
      let C = null;
      return Q0("open-file", b).then((_) => {
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
        const b = Ze.getState().activeTabId;
        if (b) {
          as(b);
          const A = Se.getState().library;
          A && Jo(b, A);
        }
        const C = Ze.getState().addTab({
          title: "untitled-project"
        }), _ = Wi(C, l);
        Bd(), ve.getState().resetLayers(Wo), he.getState().setProjectName("untitled-project");
        const R = _.get_cell_tree();
        R ? he.getState().setCellTree(R) : he.getState().setCells([
          "top"
        ]), he.getState().setActiveCell("top");
        const j = document.getElementById("rosette-canvas");
        if (j) {
          const A = j.getBoundingClientRect();
          Ye.getState().reset(A.width, A.height);
        }
        p(_), c(true), Se.getState().bumpSyncGeneration();
      };
      return window.addEventListener("rosette-new-file", k), () => window.removeEventListener("rosette-new-file", k);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !Vf()) return;
      const k = new EventSource("/api/design/events");
      return k.addEventListener("design", (b) => {
        try {
          const C = JSON.parse(b.data);
          if (C.version < h.current && (h.current = 0), C.version !== h.current && C.json) try {
            const _ = l.WasmLibrary.from_library_json(C.json);
            C.layers && C.layers.length > 0 ? AC(_, C.layers) : Yd(_), Hd(_, ve.getState().layers);
            const R = Jy;
            p(_), c(true), h.current = C.version, fe.getState().clear();
            const j = [
              ...ue.getState().selectedIds
            ], A = [];
            for (const T of j) if (T.startsWith("ref:")) A.push({
              elemIdx: -1,
              refId: T
            });
            else if (R) {
              let O = R.get_element_index(T);
              O < 0 && (O = eb.get(T) ?? -1), O >= 0 && eb.set(T, O), A.push({
                elemIdx: O,
                refId: ""
              });
            }
            ue.getState().clearSelection(), R && requestAnimationFrame(() => {
              try {
                R.free();
              } catch {
              }
            });
            const N = _.get_cell_tree();
            if (N) {
              const T = he.getState().activeCell;
              he.getState().setCellTree(N), T && he.getState().cells.includes(T) && _.set_active_cell(T);
            } else C.cells && (RC(C.cells) ? he.getState().setCellTree([
              C.cells
            ]) : he.getState().setCells(C.cells));
            if (C.filename && he.getState().setProjectName(C.filename), A.length > 0) {
              const T = /* @__PURE__ */ new Set(), O = _.get_all_ids(), D = /* @__PURE__ */ new Map();
              for (const H of O) if (!H.startsWith("ref:")) {
                const $ = _.get_element_index(H);
                $ >= 0 && D.set($, H);
              }
              for (const H of A) if (H.refId) T.add(H.refId);
              else if (H.elemIdx >= 0) {
                const $ = D.get(H.elemIdx);
                $ && T.add($);
              }
              T.size > 0 && ue.getState().setSelection(T);
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
      if (!l || !n || !rs()) return;
      const k = CC();
      if (!k || k.startsWith("//") || /^https?:\/\//i.test(k)) {
        console.error("Embed mode requires a relative ?src= parameter pointing to a JSON file");
        return;
      }
      let b = false;
      return (async () => {
        try {
          const C = await fetch(k);
          if (!C.ok) throw new Error(`Failed to fetch ${k}: ${C.status}`);
          const _ = await C.text();
          if (b) return;
          const R = l.WasmLibrary.from_library_json(_);
          Yd(R);
          const j = EC(), A = kC();
          if (j || A) {
            const D = ve.getState().layers, $ = Array.from(D.values()).map((te, J) => {
              let ee = te;
              return j && J < j.length && (ee = {
                ...ee,
                color: j[J]
              }), A && J < A.length && A[J] in Tf && (ee = {
                ...ee,
                fillPattern: A[J]
              }), ee;
            });
            ve.getState().resetLayers($);
          }
          Hd(R, ve.getState().layers);
          const N = Se.getState().library;
          N && N.free(), p(R), c(true);
          const T = _C();
          T && he.getState().setProjectName(T);
          const O = R.get_cell_tree();
          if (O) {
            he.getState().setCellTree(O);
            const D = R.active_cell_name();
            D && he.getState().setActiveCell(D);
          }
        } catch (C) {
          console.error("Failed to load embed design:", C);
        }
      })(), () => {
        b = true;
      };
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (a) for (const k of d.values()) {
        const b = k.visible ? k.opacity ?? 0.7 : 0, [C, _, R, j] = ic(k.color, b);
        a.set_layer_color(k.layerNumber, k.datatype, C, _, R, j), a.set_layer_fill_pattern(k.layerNumber, k.datatype, Tf[k.fillPattern ?? "solid"] ?? 0);
      }
    }, [
      a,
      d
    ]);
    const x = g.useCallback((k, b, C, _, R) => a ? a.add_rectangle(k, b, C, _, R, 0) ?? null : null, [
      a
    ]), S = g.useCallback((k, b) => a ? a.add_polygon(new Float64Array(k), b, 0) ?? null : null, [
      a
    ]), E = g.useCallback(() => {
      a && a.clear_active_cell();
    }, [
      a
    ]);
    return {
      library: a,
      isReady: i,
      addRectangle: x,
      addPolygon: S,
      clearCell: E
    };
  }
  const tb = 12, OC = 8, IC = 140, DC = 56;
  function nb(l, n, a, o, i) {
    const c = n.x * a + o.x, d = n.y * a + o.y, f = l.x - c, h = l.y - d;
    return f * f + h * h <= i * i;
  }
  function zC(l, n, a, o, i, c) {
    const d = l - a, f = n - o, h = i - a, p = c - o, v = d * h + f * p, x = h * h + p * p;
    if (x === 0) return Math.sqrt(d * d + f * f);
    const S = Math.max(0, Math.min(1, v / x)), E = a + S * h, k = o + S * p, b = l - E, C = n - k;
    return Math.sqrt(b * b + C * C);
  }
  function HC(l, n, a, o, i, c) {
    const d = a.start.x * o + i.x, f = a.start.y * o + i.y, h = a.end.x * o + i.x, p = a.end.y * o + i.y;
    return zC(l, n, d, f, h, p) <= c;
  }
  function YC(l, n, a, o, i) {
    const c = a.start.x * o + i.x, d = a.start.y * o + i.y, f = a.end.x * o + i.x, h = a.end.y * o + i.y, p = (c + f) / 2, v = (d + h) / 2, x = IC / 2, S = DC / 2;
    return l >= p - x && l <= p + x && n >= v - S && n <= v + S;
  }
  function lb(l, n, a, o, i, c) {
    const d = {
      x: l,
      y: n
    };
    for (const f of a.values()) if (f.id !== c) {
      if (nb(d, f.start, o, i, tb)) return {
        rulerId: f.id,
        endpoint: "start"
      };
      if (nb(d, f.end, o, i, tb)) return {
        rulerId: f.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function ab(l, n, a, o, i, c) {
    for (const d of a.values()) if (d.id !== c && (YC(l, n, d, o, i) || HC(l, n, d, o, i, OC))) return d.id;
    return null;
  }
  function BC(l, n, a, o, i) {
    const c = qt((P) => P.activeTool), { rulers: d, activeRulerId: f, selectedRulerIds: h, hoveredRulerId: p, draggingEndpoint: v, isMovingRuler: x, startRuler: S, updatePreview: E, finalizeRuler: k, cancelCreation: b, updateEndpoint: C, setHoveredEndpoint: _, setDraggingEndpoint: R, endDraggingEndpoint: j, selectRuler: A, toggleSelection: N, addToSelection: T, clearSelection: O, setHoveredRuler: D, startMoveRuler: H, moveRuler: $, endMoveRuler: te, setSnapPoint: J } = Oe();
    g.useEffect(() => {
      c !== "ruler" && (f && b(), _(null), D(null));
    }, [
      c,
      f,
      b,
      _,
      D
    ]);
    const ee = g.useCallback((P) => {
      if (P.button !== 0) return;
      const xe = P.currentTarget.getBoundingClientRect(), be = P.clientX - xe.left, L = P.clientY - xe.top, I = l(be, L);
      if (!I) return;
      const Z = Bf(n), G = Xf(be, L, I.x, I.y, Z, o, i, P.shiftKey).point, se = lb(be, L, d, o, i, f ?? void 0);
      if (se) {
        P.shiftKey ? T([
          se.rulerId
        ]) : P.metaKey || P.ctrlKey ? N(se.rulerId) : A(se.rulerId), R(se);
        return;
      }
      const Y = ab(be, L, d, o, i, f ?? void 0);
      if (Y) {
        P.shiftKey ? T([
          Y
        ]) : P.metaKey || P.ctrlKey ? N(Y) : h.has(Y) ? H(G) : A(Y);
        return;
      }
      if (f) {
        const re = k(G);
        if (J(null), re && n && a) {
          const z = new qS(re);
          fe.getState().pushCommand(z);
        }
      } else h.size > 0 && !P.shiftKey && !P.metaKey && !P.ctrlKey ? O() : h.size === 0 && S(G);
    }, [
      l,
      n,
      a,
      d,
      o,
      i,
      f,
      h,
      S,
      k,
      R,
      A,
      N,
      T,
      O,
      H,
      J
    ]), ge = g.useCallback((P) => {
      const xe = P.currentTarget.getBoundingClientRect(), be = P.clientX - xe.left, L = P.clientY - xe.top, I = l(be, L);
      if (!I) return;
      const Z = Bf(n), W = Xf(be, L, I.x, I.y, Z, o, i, P.shiftKey), G = W.point;
      if (x) {
        $(G), J(W.isGeometrySnap ? G : null);
        return;
      }
      if (v) {
        C(v.rulerId, v.endpoint, G), J(W.isGeometrySnap ? G : null);
        return;
      }
      if (f) {
        E(G), J(W.isGeometrySnap ? G : null);
        return;
      }
      const se = lb(be, L, d, o, i);
      _(se);
      const Y = se ? se.rulerId : ab(be, L, d, o, i);
      D(Y), !se && !Y && h.size === 0 ? J(W.isGeometrySnap ? G : null) : J(null);
    }, [
      l,
      n,
      d,
      o,
      i,
      f,
      v,
      x,
      h,
      E,
      C,
      $,
      _,
      D,
      J
    ]), Ce = g.useCallback(() => {
      if (v) {
        const P = j();
        if (J(null), P && n && a) {
          const pe = new x0(P.rulerId, P.endpoint, P.oldPosition, P.newPosition);
          fe.getState().pushCommand(pe);
        }
      }
      if (x) {
        const P = te();
        if (P && n && a) {
          const pe = new v0(P.rulerIds, P.deltaX, P.deltaY);
          fe.getState().pushCommand(pe);
        }
      }
    }, [
      v,
      x,
      j,
      te,
      n,
      a,
      J
    ]), V = g.useCallback(() => {
      b(), _(null), D(null), R(null), J(null);
    }, [
      b,
      _,
      D,
      R,
      J
    ]);
    return {
      handleMouseDown: ee,
      handleMouseMove: ge,
      handleMouseUp: Ce,
      cancelDrawing: V,
      isCreating: f !== null,
      isDraggingEndpoint: v !== null,
      isMovingRuler: x,
      hoveredRulerId: p,
      selectedRulerIds: h
    };
  }
  const zi = "#ff0000", Xd = 4;
  function XC() {
    const [l, n] = g.useState({
      x: 0,
      y: 0
    });
    return g.useEffect(() => {
      const a = (o) => {
        n({
          x: o.clientX,
          y: o.clientY
        });
      };
      return window.addEventListener("mousemove", a), () => window.removeEventListener("mousemove", a);
    }, []), y.jsx("div", {
      className: "pointer-events-none fixed z-50",
      style: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: zi,
        boxShadow: `
          0 0 ${Xd}px ${zi},
          0 0 ${Xd * 2}px ${zi},
          0 0 ${Xd * 3}px ${zi}`,
        opacity: 0.9,
        left: 0,
        top: 0,
        transform: `translate(${l.x - 4}px, ${l.y - 4}px)`,
        willChange: "transform"
      }
    });
  }
  const UC = "rgba(46, 229, 120, 0.1)", $C = "rgba(46, 229, 120, 0.6)";
  function rb({ box: l }) {
    const n = l.width >= 0 ? l.x : l.x + l.width, a = l.height >= 0 ? l.y : l.y + l.height, o = Math.abs(l.width), i = Math.abs(l.height);
    return o < 2 && i < 2 ? null : y.jsx("div", {
      className: "pointer-events-none absolute",
      style: {
        left: n,
        top: a,
        width: o,
        height: i,
        backgroundColor: UC,
        border: `1px solid ${$C}`
      }
    });
  }
  const VC = "rgba(59, 130, 246, 0.1)", qC = "rgba(59, 130, 246, 0.6)";
  function GC({ box: l }) {
    const n = l.width >= 0 ? l.x : l.x + l.width, a = l.height >= 0 ? l.y : l.y + l.height, o = Math.abs(l.width), i = Math.abs(l.height);
    return o < 2 && i < 2 ? null : y.jsx("div", {
      className: "pointer-events-none absolute",
      style: {
        left: n,
        top: a,
        width: o,
        height: i,
        backgroundColor: VC,
        border: `1px solid ${qC}`
      }
    });
  }
  function PC({ points: l, cursorPoint: n, isNearStart: a, alignmentGuides: o }) {
    var _a;
    const { zoom: i, offset: c } = Ye(), d = ve((j) => j.activeLayerId), p = ((_a = ve((j) => j.layers).get(d)) == null ? void 0 : _a.color) ?? "#888888", v = (j) => ({
      x: j.x * i + c.x,
      y: j.y * i + c.y
    });
    if (l.length === 0) return null;
    const S = (n ? [
      ...l,
      n
    ] : l).map(v), E = S.map((j, A) => `${A === 0 ? "M" : "L"} ${j.x} ${j.y}`).join(" "), k = l.length >= 3 && n ? `M ${S[S.length - 1].x} ${S[S.length - 1].y} L ${S[0].x} ${S[0].y}` : "", b = S[0], C = n ? v(n) : null, _ = (o == null ? void 0 : o.alignedVertexX) ? v(o.alignedVertexX) : null, R = (o == null ? void 0 : o.alignedVertexY) ? v(o.alignedVertexY) : null;
    return y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        C && _ && y.jsx("line", {
          x1: _.x,
          y1: _.y,
          x2: C.x,
          y2: C.y,
          stroke: $n.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        C && R && y.jsx("line", {
          x1: R.x,
          y1: R.y,
          x2: C.x,
          y2: C.y,
          stroke: $n.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        a && y.jsx("circle", {
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
          strokeWidth: a ? 2 : 1,
          strokeDasharray: a ? "none" : "4 4",
          strokeLinecap: "round",
          opacity: a ? 0.8 : 0.5
        }),
        l.map((j, A) => {
          const N = S[A];
          return y.jsx("circle", {
            cx: N.x,
            cy: N.y,
            r: A === 0 ? 4 : 2.5,
            fill: A === 0 ? p : "white",
            stroke: p,
            strokeWidth: 1
          }, A);
        })
      ]
    });
  }
  function ZC({ waypoints: l, cursorPoint: n, alignmentGuides: a }) {
    var _a;
    const { zoom: o, offset: i } = Ye(), c = ve((D) => D.activeLayerId), d = ve((D) => D.layers), f = tt((D) => D.width), h = tt((D) => D.cornerRadius), p = tt((D) => D.numArcPoints), x = ((_a = d.get(c)) == null ? void 0 : _a.color) ?? "#888888", S = (D) => ({
      x: D.x * o + i.x,
      y: D.y * o + i.y
    });
    if (l.length === 0) return null;
    const E = l[l.length - 1], k = n && E && Math.abs(n.x - E.x) < 1e-6 && Math.abs(n.y - E.y) < 1e-6, b = n && !k ? [
      ...l,
      n
    ] : l, C = b.map(S), _ = C.map((D, H) => `${H === 0 ? "M" : "L"} ${D.x} ${D.y}`).join(" "), j = XS(b, f, h, p).map(S), A = j.length > 0 ? j.map((D, H) => `${H === 0 ? "M" : "L"} ${D.x} ${D.y}`).join(" ") + " Z" : "", N = n ? S(n) : null, T = (a == null ? void 0 : a.alignedVertexX) ? S(a.alignedVertexX) : null, O = (a == null ? void 0 : a.alignedVertexY) ? S(a.alignedVertexY) : null;
    return y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        N && T && y.jsx("line", {
          x1: T.x,
          y1: T.y,
          x2: N.x,
          y2: N.y,
          stroke: $n.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        N && O && y.jsx("line", {
          x1: O.x,
          y1: O.y,
          x2: N.x,
          y2: N.y,
          stroke: $n.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        A && y.jsx("path", {
          d: A,
          fill: x,
          fillOpacity: 0.15,
          stroke: "none"
        }),
        A && y.jsx("path", {
          d: A,
          fill: "none",
          stroke: x,
          strokeWidth: 1,
          strokeOpacity: 0.4
        }),
        y.jsx("path", {
          d: _,
          fill: "none",
          stroke: x,
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        l.map((D, H) => {
          const $ = C[H];
          return y.jsx("circle", {
            cx: $.x,
            cy: $.y,
            r: H === 0 ? 4 : 2.5,
            fill: H === 0 ? x : "white",
            stroke: x,
            strokeWidth: 1
          }, H);
        })
      ]
    });
  }
  function uh(l) {
    const n = 1 / (l * ye), a = o0 * n;
    return a >= xy ? {
      unit: "mm",
      scale: xy
    } : a >= wy ? {
      unit: "\xB5m",
      scale: wy
    } : {
      unit: "nm",
      scale: 1
    };
  }
  function KC(l) {
    return Number.isFinite(l) ? l : 0;
  }
  function et(l, n) {
    const a = KC(l) / n.scale;
    return Math.abs(a) >= 1e6 ? a.toExponential(3) : a.toFixed(3);
  }
  const FC = {
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
  }, ob = 3, sb = 5, QC = 6, WC = {
    dark: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: $n.dark
    },
    light: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: $n.light
    }
  };
  function JC(l, n) {
    const a = Math.abs(n.x - l.x) / ye, o = Math.abs(n.y - l.y) / ye, i = Math.sqrt(a * a + o * o);
    return {
      dx: a,
      dy: o,
      diagonal: i
    };
  }
  function e5({ point: l, worldToScreen: n, theme: a }) {
    const o = WC[a], i = n(l), c = QC;
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
  function t5({ ruler: l, worldToScreen: n, hoveredEndpoint: a, isSelected: o, isHovered: i, isDragging: c, theme: d, zoom: f }) {
    const h = FC[d], p = $n[d], v = n(l.start), x = n(l.end), S = o ? p : i ? h.hover : h.line, E = o ? p : i ? h.hover : h.border, k = o || i || c ? 2 : 1.5, b = {
      x: (v.x + x.x) / 2,
      y: (v.y + x.y) / 2
    }, { dx: C, dy: _, diagonal: R } = JC(l.start, l.end), j = uh(f), A = `${et(C, j)} ${j.unit}`, N = `${et(_, j)} ${j.unit}`, T = `${et(R, j)} ${j.unit}`, O = 140, D = 56;
    return y.jsxs("g", {
      children: [
        y.jsx("line", {
          x1: v.x,
          y1: v.y,
          x2: x.x,
          y2: x.y,
          stroke: S,
          strokeWidth: k,
          strokeDasharray: "6 4",
          strokeLinecap: "round"
        }),
        y.jsx("foreignObject", {
          x: b.x - O / 2,
          y: b.y - D / 2,
          width: O,
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
                backgroundColor: h.background,
                border: `1px solid ${E}`,
                borderRadius: "4px",
                padding: "4px 8px",
                fontFamily: "monospace",
                fontSize: "11px",
                color: h.text,
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
                    A
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
                    T
                  ]
                })
              ]
            })
          })
        }),
        y.jsx("circle", {
          cx: v.x,
          cy: v.y,
          r: a === "start" ? sb : ob,
          fill: o ? p : a === "start" ? h.hover : h.endpoint,
          stroke: o ? p : a === "start" ? h.hover : "none",
          strokeWidth: a === "start" || o ? 2 : 0,
          style: {
            transition: "r 0.1s, fill 0.1s"
          }
        }),
        y.jsx("circle", {
          cx: x.x,
          cy: x.y,
          r: a === "end" ? sb : ob,
          fill: o ? p : a === "end" ? h.hover : h.endpoint,
          stroke: o ? p : a === "end" ? h.hover : "none",
          strokeWidth: a === "end" || o ? 2 : 0,
          style: {
            transition: "r 0.1s, fill 0.1s"
          }
        })
      ]
    });
  }
  function n5() {
    const { zoom: l, offset: n } = Ye(), a = me((S) => S.theme), { rulers: o, activeRulerId: i, selectedRulerIds: c, hoveredRulerId: d, marqueePreviewIds: f, hoveredEndpoint: h, draggingEndpoint: p, snapPoint: v } = Oe(), x = (S) => ({
      x: S.x * l + n.x,
      y: S.y * l + n.y
    });
    return o.size === 0 && !v ? null : y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        Array.from(o.values()).map((S) => {
          const E = S.id === i, k = c.has(S.id), b = S.id === d || f.has(S.id), C = (h == null ? void 0 : h.rulerId) === S.id, _ = (p == null ? void 0 : p.rulerId) === S.id;
          return y.jsx(t5, {
            ruler: S,
            worldToScreen: x,
            hoveredEndpoint: C ? h.endpoint : _ ? p.endpoint : null,
            isSelected: k,
            isHovered: b && !k,
            isDragging: _ || E,
            theme: a,
            zoom: l
          }, S.id);
        }),
        v && y.jsx(e5, {
          point: v,
          worldToScreen: x,
          theme: a
        })
      ]
    });
  }
  const ib = "ref:";
  function n1(l) {
    if (!l.startsWith(ib)) return null;
    const n = l.slice(ib.length), a = n.indexOf(":");
    if (a === -1) return null;
    const o = Number.parseInt(n.slice(0, a), 10);
    return Number.isNaN(o) ? null : o;
  }
  function l5(l) {
    const n = /* @__PURE__ */ new Set();
    for (const a of l) {
      const o = n1(a);
      o !== null && n.add(o);
    }
    return n;
  }
  const Xn = 9;
  function a5(l, n, a, o) {
    if (!l) return null;
    const i = `ref:${n}:0`, c = l.get_cell_ref_info(i);
    if (!c) return null;
    const [d, f, h, p, v, x] = c.transform, S = c.cell_name;
    c.free();
    const E = l.get_cell_origin_by_name(S), k = E ? E[0] : 0, b = E ? E[1] : 0, C = d * k + f * b + v, _ = h * k + p * b + x;
    return {
      x: C * a + o.x,
      y: _ * a + o.y
    };
  }
  function r5() {
    const { zoom: l, offset: n } = Ye(), a = Se((x) => x.library), i = me((x) => x.theme) === "dark";
    Se((x) => x.syncGeneration), he((x) => x.activeCell);
    const c = ue((x) => x.selectedIds), d = ue((x) => x.hoveredId), f = l5(c);
    if (d) {
      const x = n1(d);
      x !== null && f.add(x);
    }
    if (f.size === 0) return null;
    let h = [];
    if (a) try {
      const x = a.get_instance_label_data();
      x && Array.isArray(x) && (h = x);
    } catch {
      return null;
    }
    const p = h.filter((x) => f.has(x.elementIndex));
    if (p.length === 0) return null;
    const v = i ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
    return y.jsx(y.Fragment, {
      children: p.map((x) => {
        const S = x.minX * l + n.x, E = x.minY * l + n.y, k = a5(a, x.elementIndex, l, n);
        return y.jsxs("div", {
          children: [
            y.jsx("div", {
              className: B("pointer-events-none absolute text-[13px] leading-none font-mono select-none", i ? "text-white" : "text-black"),
              style: {
                left: `${S}px`,
                top: `${E}px`,
                transform: "translateY(-100%)",
                paddingBottom: "2px"
              },
              children: x.columns != null && x.rows != null ? `${x.name} [${x.columns}\xD7${x.rows}]` : x.name
            }),
            k && y.jsxs("svg", {
              className: "pointer-events-none absolute top-0 left-0 select-none",
              style: {
                width: `${Xn * 2 + 1}px`,
                height: `${Xn * 2 + 1}px`,
                transform: `translate(${k.x - Xn}px, ${k.y - Xn}px)`
              },
              viewBox: `0 0 ${Xn * 2 + 1} ${Xn * 2 + 1}`,
              children: [
                y.jsx("line", {
                  x1: "0",
                  y1: Xn,
                  x2: Xn * 2,
                  y2: Xn,
                  stroke: v,
                  strokeWidth: "1"
                }),
                y.jsx("line", {
                  x1: Xn,
                  y1: "0",
                  x2: Xn,
                  y2: Xn * 2,
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
  function o5(l, n) {
    const a = n / th, o = l.split(`
`), i = Math.max(1, ...o.map((f) => f.length)), c = a * 0.6 * i, d = a * 1.2 * o.length;
    return {
      width: c,
      totalHeight: d
    };
  }
  function s5({ label: l, zoom: n, offset: a, color: o, isSelected: i, isHovered: c }) {
    const d = l.height / th * n;
    if (d < 1) return null;
    const { width: f, totalHeight: h } = o5(l.text, l.height), p = l.x * n + a.x, v = (l.y - h) * n + a.y, x = i || c;
    let S;
    if (x) {
      const E = f * n, k = h * n, b = i ? "rgba(68, 255, 68, 0.8)" : o;
      S = {
        position: "absolute",
        left: "-3px",
        top: "-3px",
        width: `${E + 6}px`,
        height: `${k + 6}px`,
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
        fontFamily: i0,
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
  function i5({ zoom: l, offset: n, color: a }) {
    const o = an((_) => _.activeText), i = an((_) => _.showCursor);
    if (!o) return null;
    const c = s0 * ye / th * l;
    if (c < 1) return null;
    const d = c * 1.2, f = c * 0.6, h = o.content.split(`
`), p = d * Math.max(1, h.length), v = o.x * l + n.x, x = o.y * l + n.y - p, S = ch(o.selection), E = o.cursorPosition.line, b = o.cursorPosition.column * f, C = E * d;
    return y.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0 select-none",
      style: {
        transform: `translate(${v}px, ${x}px)`,
        fontSize: `${c}px`,
        lineHeight: `${d}px`,
        fontFamily: i0,
        color: a
      },
      children: [
        h.map((_, R) => {
          if (!(S && R >= S.start.line && R <= S.end.line)) return y.jsx("div", {
            style: {
              height: `${d}px`,
              whiteSpace: "pre"
            },
            children: _ || "\u200B"
          }, R);
          const A = R === S.start.line ? S.start.column : 0, N = R === S.end.line ? S.end.column : _.length, T = _.substring(0, A), O = _.substring(A, N), D = _.substring(N);
          return y.jsxs("div", {
            style: {
              height: `${d}px`,
              whiteSpace: "pre"
            },
            children: [
              T && y.jsx("span", {
                children: T
              }),
              O && y.jsx("span", {
                style: {
                  backgroundColor: "rgba(65, 105, 225, 0.7)",
                  color: "#ffffff"
                },
                children: O
              }),
              D && y.jsx("span", {
                children: D
              }),
              !_ && "\u200B"
            ]
          }, R);
        }),
        i && y.jsx("div", {
          className: "absolute",
          style: {
            left: `${b}px`,
            top: `${C}px`,
            width: "2px",
            height: `${d}px`,
            backgroundColor: a
          }
        })
      ]
    });
  }
  function c5() {
    var _a;
    const { zoom: l, offset: n } = Ye(), a = Se((_) => _.library), i = me((_) => _.theme) === "dark", c = an((_) => _.isEditingText), d = Se((_) => _.syncGeneration), f = he((_) => _.activeCell), h = ue((_) => _.selectedIds), p = ue((_) => _.hoveredId), v = ve((_) => _.layers), x = ve((_) => _.activeLayerId), S = g.useMemo(() => {
      if (!a) return [];
      try {
        const _ = a.get_text_labels();
        if (_ && Array.isArray(_)) return _;
      } catch {
      }
      return [];
    }, [
      a,
      d,
      f
    ]), k = ((_a = v.get(x)) == null ? void 0 : _a.color) ?? (i ? "#ffffff" : "#000000"), b = (_, R) => {
      for (const j of v.values()) if (j.layerNumber === _ && j.datatype === R) return j.color;
      return i ? "#ffffff" : "#000000";
    };
    return S.length > 0 || c ? y.jsxs("div", {
      className: B("pointer-events-none absolute inset-0 overflow-hidden"),
      children: [
        S.map((_) => y.jsx(s5, {
          label: _,
          zoom: l,
          offset: n,
          color: b(_.layer, _.datatype),
          isSelected: h.has(_.id),
          isHovered: p === _.id
        }, _.id)),
        c && y.jsx(i5, {
          zoom: l,
          offset: n,
          color: k
        })
      ]
    }) : null;
  }
  function u5() {
    const { zoom: l, offset: n } = Ye(), a = ue((S) => S.selectedIds), o = ue((S) => S.hoveredId), i = tt((S) => S.pathMetadata), c = me((S) => S.theme), d = c === "dark" ? $n.dark : $n.light, f = c === "dark" ? tc.dark : tc.light, h = (S) => ({
      x: S.x * l + n.x,
      y: S.y * l + n.y
    }), p = [];
    for (const S of a) {
      const E = i.get(S);
      E && E.waypoints.length >= 2 && p.push({
        meta: E,
        color: d
      });
    }
    let v = null;
    if (o && !a.has(o)) {
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
      children: x.map(({ meta: S, color: E }, k) => {
        const b = S.waypoints.map(h), C = b.map((_, R) => `${R === 0 ? "M" : "L"} ${_.x} ${_.y}`).join(" ");
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
            b.map((_, R) => y.jsx("circle", {
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
  function d5({ entry: l, zoom: n, offset: a, isSelected: o, isHovered: i, isDark: c }) {
    const d = l.x * n + a.x, f = l.y * n + a.y, h = l.width * n, p = l.height * n;
    if (h < 1 && p < 1) return null;
    const v = o || i, x = o ? "rgba(68, 255, 68, 0.8)" : c ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
    return y.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0",
      style: {
        transform: `translate(${d}px, ${f}px)`,
        width: `${h}px`,
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
  function f5({ entry: l, transform: n, zoom: a, offset: o }) {
    const [i, c, d, f, h, p] = n, v = l.x, x = l.y, S = i * v + c * x + h, E = d * v + f * x + p, k = S * a + o.x, b = E * a + o.y, C = i * a, _ = c * a, R = d * a, j = f * a, A = Math.abs(C * l.width) + Math.abs(_ * l.height), N = Math.abs(R * l.width) + Math.abs(j * l.height);
    return A < 1 && N < 1 ? null : y.jsx("div", {
      className: "pointer-events-none absolute top-0 left-0",
      style: {
        width: `${l.width}px`,
        height: `${l.height}px`,
        transformOrigin: "0 0",
        transform: `matrix(${C}, ${R}, ${_}, ${j}, ${k}, ${b})`
      },
      children: y.jsx("img", {
        src: l.url,
        alt: l.filename,
        className: "block h-full w-full",
        style: {
          objectFit: "fill"
        },
        draggable: false
      })
    });
  }
  function h5() {
    const { zoom: l, offset: n } = Ye(), a = ut((b) => b.images), o = he((b) => b.activeCell), i = Se((b) => b.library), c = ue((b) => b.selectedIds), d = ue((b) => b.hoveredId), h = me((b) => b.theme) === "dark", p = fe((b) => b.undoStack.length), v = fe((b) => b.redoStack.length), x = Se((b) => b.renderer), S = g.useRef(/* @__PURE__ */ new Set());
    g.useEffect(() => {
      if (!i || !x) return;
      const b = /* @__PURE__ */ new Map();
      for (const C of a.values()) {
        const _ = b.get(C.cellName);
        _ ? (_[0] = Math.min(_[0], C.x), _[1] = Math.min(_[1], C.y), _[2] = Math.max(_[2], C.x + C.width), _[3] = Math.max(_[3], C.y + C.height)) : b.set(C.cellName, [
          C.x,
          C.y,
          C.x + C.width,
          C.y + C.height
        ]);
      }
      for (const C of S.current) b.has(C) || i.set_cell_image_bounds(C, null);
      for (const [C, _] of b) i.set_cell_image_bounds(C, new Float64Array(_));
      S.current = new Set(b.keys()), x.sync_from_library(i), x.mark_dirty();
    }, [
      a,
      i,
      x
    ]);
    const E = g.useMemo(() => {
      if (!i) return [];
      try {
        return i.get_instance_cell_contexts() ?? [];
      } catch {
        return [];
      }
    }, [
      i,
      o,
      p,
      v
    ]), k = g.useMemo(() => {
      if (E.length === 0 || a.size === 0) return [];
      const b = /* @__PURE__ */ new Map();
      for (const _ of a.values()) {
        const R = b.get(_.cellName);
        R ? R.push(_) : b.set(_.cellName, [
          _
        ]);
      }
      const C = [];
      for (let _ = 0; _ < E.length; _++) {
        const R = E[_], j = b.get(R.cellName);
        if (j) for (const A of j) C.push({
          entry: A,
          transform: R.transform,
          key: `inst-${_}-${A.id}`
        });
      }
      return C;
    }, [
      E,
      a
    ]);
    return a.size === 0 && k.length === 0 ? null : y.jsxs("div", {
      className: B("pointer-events-none absolute inset-0 overflow-hidden"),
      children: [
        k.map(({ entry: b, transform: C, key: _ }) => y.jsx(f5, {
          entry: b,
          transform: C,
          zoom: l,
          offset: n
        }, _)),
        [
          ...a.values()
        ].filter((b) => b.cellName === o).map((b) => {
          const C = Ga(b.id);
          return y.jsx(d5, {
            entry: b,
            zoom: l,
            offset: n,
            isSelected: c.has(C),
            isHovered: d === C,
            isDark: h
          }, b.id);
        })
      ]
    });
  }
  function Hl(l, n) {
    g.useEffect(() => {
      if (n) return Hf.getState().claim(l), () => {
        Hf.getState().release(l);
      };
    }, [
      l,
      n
    ]);
  }
  function m5(l) {
    return "separator" in l && l.separator;
  }
  function g5({ library: l, renderer: n, canvasRef: a }) {
    const o = g.useRef(null), { isOpen: i, position: c, variant: d, targetId: f, close: h } = cs(), { selectedIds: p } = ue(), { hasContent: v } = jn(), S = me((j) => j.theme) === "dark";
    Hl("context-menu", i);
    const E = l ? l.get_all_ids().length > 0 : false, k = p.size > 0, C = g.useCallback(() => {
      const j = () => {
        if (!l) return;
        const D = Jn(l, p);
        jn.getState().copy(D), h();
      }, A = () => {
        if (!l || !n) return;
        const D = new ts();
        fe.getState().execute(D, {
          library: l,
          renderer: n
        });
        const H = a.current;
        H && Xa(l, H), h();
      }, N = () => {
        if (!l || !n || p.size === 0) return;
        const D = new ns([
          ...p
        ]);
        fe.getState().execute(D, {
          library: l,
          renderer: n
        });
        const H = a.current;
        H && Xa(l, H), h();
      }, T = () => {
        if (!l || !n || p.size === 0) return;
        const D = new uc([
          ...p
        ]);
        fe.getState().execute(D, {
          library: l,
          renderer: n
        }), h();
      }, O = () => {
        if (!l) return;
        const D = [
          ...l.get_all_ids(),
          ...ls()
        ];
        ue.getState().selectAll(D), h();
      };
      if (d === "element") return [
        {
          id: "edit",
          label: "Edit",
          shortcut: {
            key: "E"
          },
          action: () => {
            me.getState().requestInspectorFocus(), h();
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
          action: j,
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
          action: A,
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
          action: N,
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
          action: T,
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
          action: O,
          disabled: !E
        }
      ];
      if (d === "ruler") {
        const D = () => {
          if (!l || !n) return;
          const { selectedRulerIds: H } = Oe.getState();
          if (H.size > 0) {
            const $ = new dc([
              ...H
            ]);
            fe.getState().execute($, {
              library: l,
              renderer: n
            });
          }
          h();
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
            action: A,
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
                Ie.mod
              ],
              key: "A"
            },
            action: O,
            disabled: true
          }
        ];
      }
      if (d === "image") {
        const D = () => {
          me.getState().requestInspectorFocus(), h();
        }, H = () => {
          if (!l) return;
          const ee = Jn(l, p);
          jn.getState().copy(ee), h();
        }, $ = () => {
          if (!l || !n) return;
          const ee = new ts();
          fe.getState().execute(ee, {
            library: l,
            renderer: n
          }), h();
        }, te = () => {
          if (!l || !n || p.size === 0) return;
          const ee = new ns([
            ...p
          ]);
          fe.getState().execute(ee, {
            library: l,
            renderer: n
          }), h();
        }, J = () => {
          if (!l || !n) return;
          const ee = [
            ...p
          ].filter(xn).map(Ln);
          if (ee.length > 0) {
            const ge = new O0(ee);
            fe.getState().execute(ge, {
              library: l,
              renderer: n
            });
          }
          h();
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
            id: "copy",
            label: "Copy",
            shortcut: {
              modifiers: [
                Ie.mod
              ],
              key: "C"
            },
            action: H,
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
            action: $,
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
            action: te,
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
            action: J,
            disabled: false
          }
        ];
      }
      if (d === "layer") {
        const D = f ? Number(f) : null, H = ve.getState(), $ = D !== null ? H.getLayer(D) : void 0, te = H.layers.size <= 1, J = () => {
          if (!l || !n) return;
          const I = new w0();
          fe.getState().execute(I, {
            library: l,
            renderer: n
          }), h();
        }, ee = () => {
          D !== null && ve.getState().setEditingLayerId(D), h();
        }, ge = () => {
          D !== null && ve.getState().toggleVisibility(D), h();
        }, Ce = () => {
          if (!l || !n || D === null) return;
          const I = new ah(D);
          fe.getState().execute(I, {
            library: l,
            renderer: n
          }), h();
        }, V = Array.from(H.layers.values()), P = V.every((I) => I.visible), pe = V.every((I) => !I.visible), xe = () => {
          ve.getState().showAllLayers(), h();
        }, be = () => {
          ve.getState().hideAllLayers(), h();
        };
        return [
          {
            id: "editLayer",
            label: "Edit Layer",
            action: () => {
              D !== null && (ve.getState().setExpandedLayerId(D), ve.getState().setActiveLayer(D), me.getState().setSidebarTab("layers")), h();
            },
            disabled: !$
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
            action: ee,
            disabled: !$
          },
          {
            id: "toggleVisibility",
            label: ($ == null ? void 0 : $.visible) ? "Hide Layer" : "Show Layer",
            action: ge,
            disabled: !$
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
            disabled: pe
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "delete",
            label: "Delete Layer",
            action: Ce,
            disabled: !$ || te
          }
        ];
      }
      if (d === "cell") {
        const D = f, H = he.getState(), $ = H.cells.length <= 1, te = () => {
          if (!l || !n) return;
          const Z = nh(), W = new rh(Z);
          fe.getState().execute(W, {
            library: l,
            renderer: n
          }), me.getState().explorerCollapsed && me.getState().toggleExplorerCollapsed(), he.getState().setActiveCell(Z), he.getState().setEditingCellName(Z), h();
        }, J = () => {
          D && he.getState().setEditingCellName(D), h();
        }, ee = () => {
          if (!l || !n || !D) return;
          const Z = new C0(D);
          fe.getState().execute(Z, {
            library: l,
            renderer: n
          }), h();
        }, ge = (() => {
          if (!D || !H.cellTree) return false;
          const Z = (W) => {
            for (const G of W) {
              if (G.name === D) return G.children.length > 0;
              if (Z(G.children)) return true;
            }
            return false;
          };
          return Z(H.cellTree);
        })(), Ce = () => {
          if (!l || !n || !D) return;
          const Z = new oh(D);
          fe.getState().execute(Z, {
            library: l,
            renderer: n
          }), h();
        }, V = D ? H.hiddenCells.has(D) : false, P = () => {
          D && he.getState().toggleCellVisibility(D), h();
        }, pe = H.cells, xe = pe.every((Z) => !H.hiddenCells.has(Z)), be = pe.every((Z) => H.hiddenCells.has(Z));
        return [
          {
            id: "addCell",
            label: "Add Cell",
            action: te,
            disabled: !D
          },
          {
            id: "rename",
            label: "Rename Cell",
            action: J,
            disabled: !D
          },
          {
            id: "flattenCell",
            label: "Flatten Cell",
            action: ee,
            disabled: !D || !ge
          },
          {
            id: "toggleVisibility",
            label: V ? "Show Cell" : "Hide Cell",
            action: P,
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
              he.getState().showAllCells(), h();
            },
            disabled: xe
          },
          {
            id: "hideAllCells",
            label: "Hide All Cells",
            action: () => {
              he.getState().hideAllCells(), h();
            },
            disabled: be
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "viewFlat",
            label: `${H.cellListMode === "flat" ? "\u2713  " : "     "}Flat List`,
            action: () => {
              const { cellListMode: Z, setCellListMode: W } = he.getState();
              W(Z === "flat" ? "nested" : "flat"), h();
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
            action: Ce,
            disabled: !D || $
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
          action: A,
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
          action: O,
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
      h,
      a,
      f
    ])();
    g.useEffect(() => {
      if (!i) return;
      const j = (A) => {
        o.current && !o.current.contains(A.target) && h();
      };
      return document.addEventListener("mousedown", j), () => document.removeEventListener("mousedown", j);
    }, [
      i,
      h
    ]), g.useEffect(() => {
      if (!i) return;
      const j = (A) => {
        A.key === "Escape" && (A.preventDefault(), h());
      };
      return document.addEventListener("keydown", j), () => document.removeEventListener("keydown", j);
    }, [
      i,
      h
    ]);
    const [_, R] = g.useState(c);
    return g.useLayoutEffect(() => {
      if (!i || !o.current) {
        R(c);
        return;
      }
      const A = o.current.getBoundingClientRect(), N = 8;
      let { x: T, y: O } = c;
      T + A.width + N > window.innerWidth && (T = window.innerWidth - A.width - N), O + A.height + N > window.innerHeight && (O = window.innerHeight - A.height - N), T < N && (T = N), O < N && (O = N), R({
        x: T,
        y: O
      });
    }, [
      i,
      c
    ]), i ? y.jsx("div", {
      ref: o,
      className: B("fixed z-50 min-w-[170px] rounded-xl border py-1", S ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      style: {
        left: _.x,
        top: _.y
      },
      children: C.map((j) => {
        var _a;
        if (m5(j)) return y.jsx("div", {
          className: B("my-1 h-px", S ? "bg-white/10" : "bg-black/10")
        }, j.id);
        const A = j;
        return y.jsxs("button", {
          className: B("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs", "transition-colors", A.disabled ? "opacity-40" : S ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          onClick: () => {
            A.disabled || A.action();
          },
          disabled: A.disabled,
          children: [
            y.jsx("span", {
              children: A.label
            }),
            A.shortcut && y.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = A.shortcut.modifiers) == null ? void 0 : _a.map((N) => y.jsx("kbd", {
                  className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", S ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: N
                }, N)),
                y.jsx("kbd", {
                  className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", S ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: A.shortcut.key
                })
              ]
            })
          ]
        }, A.id);
      })
    }) : null;
  }
  const cb = "rosette-canvas";
  function ub() {
    const l = g.useRef(null), n = g.useRef(null), a = g.useRef({
      x: 0,
      y: 0
    }), o = g.useRef(null), i = g.useRef(null), [c, d] = g.useState(false), [f, h] = g.useState(false), [p, v] = g.useState(null), x = g.useRef(false), S = g.useRef(null), { wasm: E, isReady: k } = r0(), { renderer: b, isReady: C, render: _, resize: R, screenToWorld: j, error: A } = TS(c ? cb : null), { library: N } = TC(E, k);
    g.useEffect(() => (Se.getState().setLibrary(N), () => Se.getState().setLibrary(null)), [
      N
    ]), g.useEffect(() => (Se.getState().setRenderer(b), () => Se.getState().setRenderer(null)), [
      b
    ]);
    const { zoomAt: T, pan: O, initOffset: D, zoom: H, offset: $ } = Ye(), te = me((le) => le.setCursorWorld), J = me((le) => le.theme), ee = qt((le) => le.activeTool), { handleMouseDown: ge, handleMouseMove: Ce, handleMouseUp: V, isLaserActive: P } = K2(b, C), { handleMouseDown: pe, handleMouseMove: xe, handleMouseUp: be, box: L, isZoomActive: I, isDrawingZoom: Z } = Q2(n), { handleMouseDown: W, handleMouseMove: G, finalizeRectangle: se, cancelDrawing: Y } = W2(j, N, b), { handleMouseDown: re, handleMouseMove: z, handleMouseUp: oe, handleMouseLeave: de, hoveredId: _e, hoveredRulerId: Ee, marqueeBox: je, isDrawingMarquee: we } = uC(j, N, b), { handleMouseDown: ze, handleMouseMove: Ae, handleMouseUp: qe, handleMouseLeave: Be, hoveredRulerId: Qe } = gC(j, N, b), { handleMouseDown: Xe, handleMouseMove: vt, cancelDrawing: jt, points: ft, cursorPoint: Rn, isNearStart: cl, alignmentGuides: ul } = eC(j, N, b, H), { handleMouseDown: An, handleMouseMove: st, cancelDrawing: At, waypoints: on, cursorPoint: qn, alignmentGuides: Kt } = nC(j, N, b, H), { handleMouseDown: Ct, handleMouseMove: Gt, handleMouseUp: Ht, cancelDrawing: Yl, isCreating: qr, isDraggingEndpoint: Gr, isMovingRuler: Ka, hoveredRulerId: Fa } = BC(j, N, b, H, $), { handleMouseDown: ba, handleMouseMove: tl, cancelEditing: va, isEditing: xa } = xC(j, N, b);
    g.useEffect(() => {
      const le = l.current, Te = n.current;
      if (!le || !Te) return;
      const it = () => {
        const nt = le.getBoundingClientRect(), Je = Math.floor(nt.width), lt = Math.floor(nt.height);
        if (Je > 0 && lt > 0) {
          const Ne = window.devicePixelRatio || 1;
          Te.width = Math.floor(Je * Ne), Te.height = Math.floor(lt * Ne), Te.style.width = `${Je}px`, Te.style.height = `${lt}px`, D(Je, lt), c || d(true), R(Math.floor(Je * Ne), Math.floor(lt * Ne)), _();
        }
      };
      it();
      const He = new ResizeObserver(it);
      return He.observe(le), () => He.disconnect();
    }, [
      R,
      _,
      c,
      D
    ]), g.useEffect(() => {
      if (!C) return;
      let le;
      const Te = () => {
        _(), le = requestAnimationFrame(Te);
      };
      return Te(), () => cancelAnimationFrame(le);
    }, [
      C,
      _
    ]);
    const bc = ve((le) => le.layers);
    g.useEffect(() => {
      !b || !N || (b.sync_from_library(N), b.mark_dirty());
    }, [
      b,
      N,
      bc
    ]);
    const wa = he((le) => le.activeCell);
    g.useEffect(() => {
      if (!N || !b || !wa) return;
      N.active_cell_name() !== wa && (N.set_active_cell(wa), b.sync_from_library(N), b.mark_dirty(), us());
    }, [
      N,
      b,
      wa
    ]);
    const Sa = he((le) => le.hierarchyLevelLimit);
    g.useEffect(() => {
      if (!N || !b) return;
      const le = Sa === 1 / 0 ? 0 : Sa;
      N.set_hierarchy_depth_limit(le), b.sync_from_library(N), b.mark_dirty();
    }, [
      N,
      b,
      Sa
    ]);
    const dl = he((le) => le.hiddenCells);
    g.useEffect(() => {
      if (!N || !b) return;
      const le = new Set(N.get_hidden_cells());
      for (const Te of le) dl.has(Te) || N.set_cell_visibility(Te, true);
      for (const Te of dl) le.has(Te) || N.set_cell_visibility(Te, false);
      b.sync_from_library(N), b.mark_dirty();
    }, [
      N,
      b,
      dl
    ]);
    const ys = g.useRef(false), Qa = g.useRef(null);
    g.useEffect(() => {
      const le = n.current;
      if (!N || !le) return;
      const Te = N.get_all_bounds();
      if (!Te) return;
      const it = {
        minX: Te[0],
        minY: Te[1],
        maxX: Te[2],
        maxY: Te[3]
      }, He = zl(le);
      if (He.width <= 0 || He.height <= 0) return;
      const nt = Qa.current !== null && Qa.current !== N;
      if (!ys.current || nt) {
        Ye.getState().zoomToFit(it, He.width, He.height, He.screenCenter);
        const lt = rs() ? jC() : null;
        if (lt !== null) {
          const Ne = He.screenCenter ?? {
            x: He.width / 2,
            y: He.height / 2
          };
          Ye.getState().zoomAt(lt, Ne.x, Ne.y);
        }
        ys.current = true;
      }
      Qa.current = N;
    }, [
      N
    ]);
    const Wa = g.useCallback((le) => {
      le.preventDefault();
      const Te = n.current;
      if (!Te) return;
      const it = Te.getBoundingClientRect(), He = le.clientX - it.left, nt = le.clientY - it.top, Je = le.ctrlKey || Math.abs(le.deltaY) < 50;
      let lt;
      Je ? lt = Math.pow(2, -le.deltaY * 0.01) : lt = le.deltaY > 0 ? sc : oc, T(lt, He, nt);
    }, [
      T
    ]), bs = g.useCallback((le) => {
      if (le.button === 2 && me.getState().rightClickMode === "zoom") {
        const Te = n.current;
        if (!Te) return;
        const it = Te.getBoundingClientRect(), He = le.clientX - it.left, nt = le.clientY - it.top;
        x.current = true;
        const Je = {
          x: He,
          y: nt,
          width: 0,
          height: 0
        };
        S.current = Je, v(Je);
        return;
      }
      if (ee === "laser" && le.button === 0) {
        ge(le);
        return;
      }
      if (ee === "zoom" && le.button === 0) {
        pe(le);
        return;
      }
      if (ee === "rectangle" && le.button === 0) {
        W(le);
        return;
      }
      if (ee === "select" && le.button === 0) {
        re(le);
        return;
      }
      if (ee === "move" && le.button === 0) {
        ze(le);
        return;
      }
      if (ee === "polygon" && le.button === 0) {
        Xe(le);
        return;
      }
      if (ee === "path" && le.button === 0) {
        An(le);
        return;
      }
      if (ee === "ruler" && le.button === 0) {
        Ct(le);
        return;
      }
      if (ee === "text" && le.button === 0) {
        ba(le);
        return;
      }
      (le.button === 1 || le.button === 0 && ee === "pan") && (h(true), a.current = {
        x: le.clientX,
        y: le.clientY
      });
    }, [
      ee,
      ge,
      pe,
      W,
      re,
      ze,
      Xe,
      An,
      Ct,
      ba
    ]), Nn = g.useRef(0);
    g.useEffect(() => () => {
      Nn.current && cancelAnimationFrame(Nn.current);
    }, []), g.useEffect(() => {
      const le = o.current;
      if (!le) return;
      const Te = (le.x - $.x) / H, it = (le.y - $.y) / H, He = Math.trunc(Te / ye), nt = Math.trunc(it / ye);
      te({
        x: He,
        y: -nt
      });
    }, [
      H,
      $,
      te
    ]);
    const Pr = g.useCallback((le) => {
      const Te = n.current;
      if (!Te) return;
      const it = Te.getBoundingClientRect(), He = le.clientX - it.left, nt = le.clientY - it.top;
      o.current = {
        x: He,
        y: nt
      };
      let Je = false;
      x.current && v((Ne) => {
        if (!Ne) return Ne;
        const Yt = {
          ...Ne,
          width: He - Ne.x,
          height: nt - Ne.y
        };
        return S.current = Yt, Yt;
      }), ee === "laser" && Ce(le), ee === "zoom" && xe(le), ee === "rectangle" && G(He, nt) && (Je = true), ee === "select" && z(le), ee === "move" && Ae(le), ee === "polygon" && vt(le), ee === "path" && st(le), ee === "ruler" && Gt(le), ee === "text" && tl(le);
      const lt = j(He, nt);
      if (i.current = lt, Nn.current === 0 && (Nn.current = requestAnimationFrame(() => {
        Nn.current = 0;
        const Ne = i.current;
        if (Ne) {
          const Yt = Math.trunc(Ne.x / ye), Et = Math.trunc(Ne.y / ye);
          te({
            x: Yt,
            y: -Et
          });
        } else te(null);
      })), f) {
        const Ne = le.clientX - a.current.x, Yt = le.clientY - a.current.y;
        a.current = {
          x: le.clientX,
          y: le.clientY
        }, O(Ne, Yt);
      }
      Je && _();
    }, [
      O,
      j,
      te,
      f,
      ee,
      Ce,
      xe,
      G,
      z,
      Ae,
      vt,
      st,
      Gt,
      tl,
      _
    ]), Zr = g.useCallback(() => {
      if (!x.current) return;
      x.current = false;
      const le = S.current;
      if (S.current = null, v(null), !le) return;
      const Te = n.current;
      if (Math.abs(le.width) > 5 && Math.abs(le.height) > 5 && Te) {
        const { zoom: it, offset: He } = Ye.getState(), nt = Math.min(le.x, le.x + le.width), Je = Math.max(le.x, le.x + le.width), lt = Math.min(le.y, le.y + le.height), Ne = Math.max(le.y, le.y + le.height), Yt = {
          minX: (nt - He.x) / it,
          maxX: (Je - He.x) / it,
          minY: (lt - He.y) / it,
          maxY: (Ne - He.y) / it
        }, Et = zl(Te);
        Et.width > 0 && Et.height > 0 && Ye.getState().zoomToBounds(Yt, Et.width, Et.height, Et.screenCenter);
      }
    }, []), vs = g.useCallback(() => {
      Zr(), ee === "laser" && V(), ee === "zoom" && be(), ee === "rectangle" && i.current && se(i.current.x, i.current.y), ee === "select" && oe(), ee === "move" && qe(), ee === "ruler" && Ht(), h(false);
    }, [
      ee,
      Zr,
      V,
      be,
      se,
      oe,
      qe,
      Ht
    ]), nl = g.useCallback(() => {
      h(false), x.current && (x.current = false, S.current = null, v(null)), Y(), jt(), At(), Yl(), va(), de(), Be(), Nn.current && (cancelAnimationFrame(Nn.current), Nn.current = 0), o.current = null, te(null);
    }, [
      te,
      Y,
      jt,
      At,
      Yl,
      va,
      de,
      Be
    ]), Lt = cs((le) => le.open), tn = g.useCallback((le) => {
      if (le.preventDefault(), me.getState().rightClickMode === "zoom") return;
      const Te = n.current;
      if (!Te) return;
      const it = Te.getBoundingClientRect(), He = le.clientX - it.left, nt = le.clientY - it.top, Je = j(He, nt);
      if (!Je) return;
      const { rulers: lt, selectedRulerIds: Ne, selectRuler: Yt } = Oe.getState();
      for (const ht of lt.values()) {
        const It = ht.start.x * H + $.x, fn = ht.start.y * H + $.y, Gn = ht.end.x * H + $.x, fl = ht.end.y * H + $.y, hl = (It + Gn) / 2, ml = (fn + fl) / 2, gl = 70, nn = 28;
        if (He >= hl - gl && He <= hl + gl && nt >= ml - nn && nt <= ml + nn) {
          Ne.has(ht.id) || Yt(ht.id), Lt("ruler", {
            x: le.clientX,
            y: le.clientY
          }, ht.id);
          return;
        }
        const Ft = He - It, Ja = nt - fn, Ca = Gn - It, ll = fl - fn, er = Ft * Ca + Ja * ll, pl = Ca * Ca + ll * ll;
        if (pl > 0) {
          const xs = Math.max(0, Math.min(1, er / pl)), hn = It + xs * Ca, Kr = fn + xs * ll, Fr = He - hn, tr = nt - Kr;
          if (Math.sqrt(Fr * Fr + tr * tr) <= 8) {
            Ne.has(ht.id) || Yt(ht.id), Lt("ruler", {
              x: le.clientX,
              y: le.clientY
            }, ht.id);
            return;
          }
        }
      }
      if (N) {
        const ht = N.hit_test(Je.x, Je.y);
        if (ht) {
          const It = N.get_group_ids(ht), { selectedIds: fn, setSelection: Gn } = ue.getState();
          It.every((hl) => fn.has(hl)) || Gn(new Set(It)), Lt("element", {
            x: le.clientX,
            y: le.clientY
          }, ht);
          return;
        }
      }
      const Et = es(Je.x, Je.y);
      if (Et) {
        const { selectedIds: ht } = ue.getState();
        ht.has(Et) || ue.getState().select(Et), Lt("image", {
          x: le.clientX,
          y: le.clientY
        }, Et);
        return;
      }
      Lt("canvas", {
        x: le.clientX,
        y: le.clientY
      });
    }, [
      N,
      j,
      Lt,
      H,
      $
    ]), dn = Ki((le) => le.cellName), Bl = g.useRef(null);
    if (g.useEffect(() => {
      if (!dn) return;
      const le = n.current;
      if (!le || !b || !N) return;
      const { bounds: Te, origin: it } = Ki.getState(), He = (Je) => {
        if (!Te) return;
        const lt = le.getBoundingClientRect(), Ne = Je.clientX - lt.left, Yt = Je.clientY - lt.top, Et = j(Ne, Yt);
        if (!Et) return;
        const ht = Et.x - it.x, It = Et.y - it.y, fn = Te[0] + ht, Gn = Te[1] + It, fl = Te[2] + ht, hl = Te[3] + It, ml = new Float64Array([
          fn,
          Gn,
          fl,
          Gn,
          fl,
          hl,
          fn,
          hl
        ]), gl = new Float32Array([
          0.5,
          0.5,
          0.5,
          0
        ]);
        b.set_preview_shape(ml, gl);
        const { zoom: nn, offset: Ft } = Ye.getState(), Ja = 9 / nn, ll = me.getState().theme === "dark" ? new Float32Array([
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
        if (b.set_preview_origin(Et.x, Et.y, Ja, ll), b.mark_dirty(), Bl.current) {
          const er = fn * nn + Ft.x, pl = Gn * nn + Ft.y;
          Bl.current.style.transform = `translate(${er}px, ${pl}px) translateY(-100%)`, Bl.current.style.display = "block";
        }
      }, nt = (Je) => {
        const lt = le.getBoundingClientRect(), Ne = Je.clientX - lt.left, Yt = Je.clientY - lt.top, Et = j(Ne, Yt);
        b.clear_preview(), b.mark_dirty();
        const ht = Ne >= 0 && Yt >= 0 && Ne <= lt.width && Yt <= lt.height;
        if (Et && ht) {
          const It = N.active_cell_name();
          if (It && It !== dn && N.can_instance_cell(It, dn)) {
            const fn = new k0(dn, Et.x, Et.y);
            fe.getState().execute(fn, {
              library: N,
              renderer: b
            });
          }
        }
        Ki.getState().endDrag();
      };
      return document.addEventListener("mousemove", He), document.addEventListener("mouseup", nt), () => {
        document.removeEventListener("mousemove", He), document.removeEventListener("mouseup", nt), b.clear_preview(), b.mark_dirty();
      };
    }, [
      dn,
      N,
      b,
      j
    ]), g.useEffect(() => {
      const le = n.current;
      if (le) return le.addEventListener("wheel", Wa, {
        passive: false
      }), () => le.removeEventListener("wheel", Wa);
    }, [
      Wa
    ]), B2(n, N, b), A) return y.jsx("div", {
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
            children: A.message
          }),
          y.jsx("p", {
            className: "mt-4 text-xs opacity-50",
            children: "WebGPU may not be supported in your browser. Try Chrome 113+, Safari 17+, or Edge 113+."
          })
        ]
      })
    });
    const vc = (() => {
      if (f || Ka) return "cursor-grabbing";
      if (ee === "pan") return "cursor-grab";
      if (ee === "move") return "cursor-move";
      if (P) return "cursor-none";
      if (I || ee === "rectangle" || ee === "polygon" || ee === "path") return "cursor-crosshair";
      if (ee === "text") return xa ? "cursor-text" : "cursor-crosshair";
      if (ee === "ruler") return Gr ? "cursor-grabbing" : qr ? "cursor-crosshair" : Fa ? "cursor-pointer" : "cursor-crosshair";
      if (ee === "select") {
        if (we) return "cursor-crosshair";
        if (Ee || _e) return "cursor-pointer";
      }
      return "cursor-default";
    })();
    return y.jsxs("div", {
      ref: l,
      className: "relative h-full w-full select-none overflow-hidden",
      children: [
        y.jsx("canvas", {
          ref: n,
          id: cb,
          className: vc,
          onMouseDown: bs,
          onMouseMove: Pr,
          onMouseUp: vs,
          onMouseLeave: nl,
          onContextMenu: tn
        }),
        P && !f && y.jsx(XC, {}),
        Z && L && y.jsx(rb, {
          box: L
        }),
        p && y.jsx(rb, {
          box: p
        }),
        we && je && y.jsx(GC, {
          box: je
        }),
        ee === "polygon" && ft.length > 0 && y.jsx(PC, {
          points: ft,
          cursorPoint: Rn,
          isNearStart: cl,
          alignmentGuides: ul
        }),
        ee === "path" && on.length > 0 && y.jsx(ZC, {
          waypoints: on,
          cursorPoint: qn,
          alignmentGuides: Kt
        }),
        dn && y.jsx("div", {
          ref: Bl,
          className: `pointer-events-none absolute top-0 left-0 text-[13px] leading-none font-mono select-none ${J === "dark" ? "text-white" : "text-black"}`,
          style: {
            display: "none",
            paddingBottom: "2px"
          },
          children: dn
        }),
        y.jsx(h5, {}),
        y.jsx(u5, {}),
        y.jsx(r5, {}),
        y.jsx(c5, {}),
        y.jsx(n5, {}),
        y.jsx(g5, {
          library: N,
          renderer: b,
          canvasRef: n
        })
      ]
    });
  }
  var db = 1, p5 = 0.9, y5 = 0.8, b5 = 0.17, Ud = 0.1, $d = 0.999, v5 = 0.9999, x5 = 0.99, w5 = /[\\\/_+.#"@\[\(\{&]/, S5 = /[\\\/_+.#"@\[\(\{&]/g, C5 = /[\s-]/, l1 = /[\s-]/g;
  function qf(l, n, a, o, i, c, d) {
    if (c === n.length) return i === l.length ? db : x5;
    var f = `${i},${c}`;
    if (d[f] !== void 0) return d[f];
    for (var h = o.charAt(c), p = a.indexOf(h, i), v = 0, x, S, E, k; p >= 0; ) x = qf(l, n, a, o, p + 1, c + 1, d), x > v && (p === i ? x *= db : w5.test(l.charAt(p - 1)) ? (x *= y5, E = l.slice(i, p - 1).match(S5), E && i > 0 && (x *= Math.pow($d, E.length))) : C5.test(l.charAt(p - 1)) ? (x *= p5, k = l.slice(i, p - 1).match(l1), k && i > 0 && (x *= Math.pow($d, k.length))) : (x *= b5, i > 0 && (x *= Math.pow($d, p - i))), l.charAt(p) !== n.charAt(c) && (x *= v5)), (x < Ud && a.charAt(p - 1) === o.charAt(c + 1) || o.charAt(c + 1) === o.charAt(c) && a.charAt(p - 1) !== o.charAt(c)) && (S = qf(l, n, a, o, p + 1, c + 2, d), S * Ud > x && (x = S * Ud)), x > v && (v = x), p = a.indexOf(h, p + 1);
    return d[f] = v, v;
  }
  function fb(l) {
    return l.toLowerCase().replace(l1, " ");
  }
  function E5(l, n, a) {
    return l = a && a.length > 0 ? `${l + " " + a.join(" ")}` : l, qf(l, n, fb(l), fb(n), 0, 0, {});
  }
  function ha(l, n, { checkForDefaultPrevented: a = true } = {}) {
    return function(i) {
      if (l == null ? void 0 : l(i), a === false || !i.defaultPrevented) return n == null ? void 0 : n(i);
    };
  }
  function hb(l, n) {
    if (typeof l == "function") return l(n);
    l != null && (l.current = n);
  }
  function ga(...l) {
    return (n) => {
      let a = false;
      const o = l.map((i) => {
        const c = hb(i, n);
        return !a && typeof c == "function" && (a = true), c;
      });
      if (a) return () => {
        for (let i = 0; i < o.length; i++) {
          const c = o[i];
          typeof c == "function" ? c() : hb(l[i], null);
        }
      };
    };
  }
  function Za(...l) {
    return g.useCallback(ga(...l), l);
  }
  function k5(l, n) {
    const a = g.createContext(n), o = (c) => {
      const { children: d, ...f } = c, h = g.useMemo(() => f, Object.values(f));
      return y.jsx(a.Provider, {
        value: h,
        children: d
      });
    };
    o.displayName = l + "Provider";
    function i(c) {
      const d = g.useContext(a);
      if (d) return d;
      if (n !== void 0) return n;
      throw new Error(`\`${c}\` must be used within \`${l}\``);
    }
    return [
      o,
      i
    ];
  }
  function _5(l, n = []) {
    let a = [];
    function o(c, d) {
      const f = g.createContext(d), h = a.length;
      a = [
        ...a,
        d
      ];
      const p = (x) => {
        var _a;
        const { scope: S, children: E, ...k } = x, b = ((_a = S == null ? void 0 : S[l]) == null ? void 0 : _a[h]) || f, C = g.useMemo(() => k, Object.values(k));
        return y.jsx(b.Provider, {
          value: C,
          children: E
        });
      };
      p.displayName = c + "Provider";
      function v(x, S) {
        var _a;
        const E = ((_a = S == null ? void 0 : S[l]) == null ? void 0 : _a[h]) || f, k = g.useContext(E);
        if (k) return k;
        if (d !== void 0) return d;
        throw new Error(`\`${x}\` must be used within \`${c}\``);
      }
      return [
        p,
        v
      ];
    }
    const i = () => {
      const c = a.map((d) => g.createContext(d));
      return function(f) {
        const h = (f == null ? void 0 : f[l]) || c;
        return g.useMemo(() => ({
          [`__scope${l}`]: {
            ...f,
            [l]: h
          }
        }), [
          f,
          h
        ]);
      };
    };
    return i.scopeName = l, [
      o,
      M5(i, ...n)
    ];
  }
  function M5(...l) {
    const n = l[0];
    if (l.length === 1) return n;
    const a = () => {
      const o = l.map((i) => ({
        useScope: i(),
        scopeName: i.scopeName
      }));
      return function(c) {
        const d = o.reduce((f, { useScope: h, scopeName: p }) => {
          const x = h(c)[`__scope${p}`];
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
    return a.scopeName = n.scopeName, a;
  }
  var os = (globalThis == null ? void 0 : globalThis.document) ? g.useLayoutEffect : () => {
  }, j5 = Jf[" useId ".trim().toString()] || (() => {
  }), L5 = 0;
  function Dl(l) {
    const [n, a] = g.useState(j5());
    return os(() => {
      a((o) => o ?? String(L5++));
    }, [
      l
    ]), n ? `radix-${n}` : "";
  }
  var R5 = Jf[" useInsertionEffect ".trim().toString()] || os;
  function A5({ prop: l, defaultProp: n, onChange: a = () => {
  }, caller: o }) {
    const [i, c, d] = N5({
      defaultProp: n,
      onChange: a
    }), f = l !== void 0, h = f ? l : i;
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
        const x = T5(v) ? v(l) : v;
        x !== l && ((_a = d.current) == null ? void 0 : _a.call(d, x));
      } else c(v);
    }, [
      f,
      l,
      c,
      d
    ]);
    return [
      h,
      p
    ];
  }
  function N5({ defaultProp: l, onChange: n }) {
    const [a, o] = g.useState(l), i = g.useRef(a), c = g.useRef(n);
    return R5(() => {
      c.current = n;
    }, [
      n
    ]), g.useEffect(() => {
      var _a;
      i.current !== a && ((_a = c.current) == null ? void 0 : _a.call(c, a), i.current = a);
    }, [
      a,
      i
    ]), [
      a,
      o,
      c
    ];
  }
  function T5(l) {
    return typeof l == "function";
  }
  var hs = a0();
  const O5 = l0(hs);
  function ms(l) {
    const n = I5(l), a = g.forwardRef((o, i) => {
      const { children: c, ...d } = o, f = g.Children.toArray(c), h = f.find(z5);
      if (h) {
        const p = h.props.children, v = f.map((x) => x === h ? g.Children.count(p) > 1 ? g.Children.only(null) : g.isValidElement(p) ? p.props.children : null : x);
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
    return a.displayName = `${l}.Slot`, a;
  }
  function I5(l) {
    const n = g.forwardRef((a, o) => {
      const { children: i, ...c } = a;
      if (g.isValidElement(i)) {
        const d = Y5(i), f = H5(c, i.props);
        return i.type !== g.Fragment && (f.ref = o ? ga(o, d) : d), g.cloneElement(i, f);
      }
      return g.Children.count(i) > 1 ? g.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var D5 = Symbol("radix.slottable");
  function z5(l) {
    return g.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === D5;
  }
  function H5(l, n) {
    const a = {
      ...n
    };
    for (const o in n) {
      const i = l[o], c = n[o];
      /^on[A-Z]/.test(o) ? i && c ? a[o] = (...f) => {
        const h = c(...f);
        return i(...f), h;
      } : i && (a[o] = i) : o === "style" ? a[o] = {
        ...i,
        ...c
      } : o === "className" && (a[o] = [
        i,
        c
      ].filter(Boolean).join(" "));
    }
    return {
      ...l,
      ...a
    };
  }
  function Y5(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, a = n && "isReactWarning" in n && n.isReactWarning;
    return a ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, a = n && "isReactWarning" in n && n.isReactWarning, a ? l.props.ref : l.props.ref || l.ref);
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
  ], a1 = B5.reduce((l, n) => {
    const a = ms(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, h = d ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(h, {
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
    l && hs.flushSync(() => l.dispatchEvent(n));
  }
  function ss(l) {
    const n = g.useRef(l);
    return g.useEffect(() => {
      n.current = l;
    }), g.useMemo(() => (...a) => {
      var _a;
      return (_a = n.current) == null ? void 0 : _a.call(n, ...a);
    }, []);
  }
  function U5(l, n = globalThis == null ? void 0 : globalThis.document) {
    const a = ss(l);
    g.useEffect(() => {
      const o = (i) => {
        i.key === "Escape" && a(i);
      };
      return n.addEventListener("keydown", o, {
        capture: true
      }), () => n.removeEventListener("keydown", o, {
        capture: true
      });
    }, [
      a,
      n
    ]);
  }
  var $5 = "DismissableLayer", Gf = "dismissableLayer.update", V5 = "dismissableLayer.pointerDownOutside", q5 = "dismissableLayer.focusOutside", mb, r1 = g.createContext({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  }), o1 = g.forwardRef((l, n) => {
    const { disableOutsidePointerEvents: a = false, onEscapeKeyDown: o, onPointerDownOutside: i, onFocusOutside: c, onInteractOutside: d, onDismiss: f, ...h } = l, p = g.useContext(r1), [v, x] = g.useState(null), S = (v == null ? void 0 : v.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, E] = g.useState({}), k = Za(n, (O) => x(O)), b = Array.from(p.layers), [C] = [
      ...p.layersWithOutsidePointerEventsDisabled
    ].slice(-1), _ = b.indexOf(C), R = v ? b.indexOf(v) : -1, j = p.layersWithOutsidePointerEventsDisabled.size > 0, A = R >= _, N = Z5((O) => {
      const D = O.target, H = [
        ...p.branches
      ].some(($) => $.contains(D));
      !A || H || (i == null ? void 0 : i(O), d == null ? void 0 : d(O), O.defaultPrevented || (f == null ? void 0 : f()));
    }, S), T = K5((O) => {
      const D = O.target;
      [
        ...p.branches
      ].some(($) => $.contains(D)) || (c == null ? void 0 : c(O), d == null ? void 0 : d(O), O.defaultPrevented || (f == null ? void 0 : f()));
    }, S);
    return U5((O) => {
      R === p.layers.size - 1 && (o == null ? void 0 : o(O), !O.defaultPrevented && f && (O.preventDefault(), f()));
    }, S), g.useEffect(() => {
      if (v) return a && (p.layersWithOutsidePointerEventsDisabled.size === 0 && (mb = S.body.style.pointerEvents, S.body.style.pointerEvents = "none"), p.layersWithOutsidePointerEventsDisabled.add(v)), p.layers.add(v), gb(), () => {
        a && p.layersWithOutsidePointerEventsDisabled.size === 1 && (S.body.style.pointerEvents = mb);
      };
    }, [
      v,
      S,
      a,
      p
    ]), g.useEffect(() => () => {
      v && (p.layers.delete(v), p.layersWithOutsidePointerEventsDisabled.delete(v), gb());
    }, [
      v,
      p
    ]), g.useEffect(() => {
      const O = () => E({});
      return document.addEventListener(Gf, O), () => document.removeEventListener(Gf, O);
    }, []), y.jsx(a1.div, {
      ...h,
      ref: k,
      style: {
        pointerEvents: j ? A ? "auto" : "none" : void 0,
        ...l.style
      },
      onFocusCapture: ha(l.onFocusCapture, T.onFocusCapture),
      onBlurCapture: ha(l.onBlurCapture, T.onBlurCapture),
      onPointerDownCapture: ha(l.onPointerDownCapture, N.onPointerDownCapture)
    });
  });
  o1.displayName = $5;
  var G5 = "DismissableLayerBranch", P5 = g.forwardRef((l, n) => {
    const a = g.useContext(r1), o = g.useRef(null), i = Za(n, o);
    return g.useEffect(() => {
      const c = o.current;
      if (c) return a.branches.add(c), () => {
        a.branches.delete(c);
      };
    }, [
      a.branches
    ]), y.jsx(a1.div, {
      ...l,
      ref: i
    });
  });
  P5.displayName = G5;
  function Z5(l, n = globalThis == null ? void 0 : globalThis.document) {
    const a = ss(l), o = g.useRef(false), i = g.useRef(() => {
    });
    return g.useEffect(() => {
      const c = (f) => {
        if (f.target && !o.current) {
          let h = function() {
            s1(V5, a, p, {
              discrete: true
            });
          };
          const p = {
            originalEvent: f
          };
          f.pointerType === "touch" ? (n.removeEventListener("click", i.current), i.current = h, n.addEventListener("click", i.current, {
            once: true
          })) : h();
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
      a
    ]), {
      onPointerDownCapture: () => o.current = true
    };
  }
  function K5(l, n = globalThis == null ? void 0 : globalThis.document) {
    const a = ss(l), o = g.useRef(false);
    return g.useEffect(() => {
      const i = (c) => {
        c.target && !o.current && s1(q5, a, {
          originalEvent: c
        }, {
          discrete: false
        });
      };
      return n.addEventListener("focusin", i), () => n.removeEventListener("focusin", i);
    }, [
      n,
      a
    ]), {
      onFocusCapture: () => o.current = true,
      onBlurCapture: () => o.current = false
    };
  }
  function gb() {
    const l = new CustomEvent(Gf);
    document.dispatchEvent(l);
  }
  function s1(l, n, a, { discrete: o }) {
    const i = a.originalEvent.target, c = new CustomEvent(l, {
      bubbles: false,
      cancelable: true,
      detail: a
    });
    n && i.addEventListener(l, n, {
      once: true
    }), o ? X5(i, c) : i.dispatchEvent(c);
  }
  var F5 = [
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
  ], Q5 = F5.reduce((l, n) => {
    const a = ms(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, h = d ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(h, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), Vd = "focusScope.autoFocusOnMount", qd = "focusScope.autoFocusOnUnmount", pb = {
    bubbles: false,
    cancelable: true
  }, W5 = "FocusScope", i1 = g.forwardRef((l, n) => {
    const { loop: a = false, trapped: o = false, onMountAutoFocus: i, onUnmountAutoFocus: c, ...d } = l, [f, h] = g.useState(null), p = ss(i), v = ss(c), x = g.useRef(null), S = Za(n, (b) => h(b)), E = g.useRef({
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
        let b = function(j) {
          if (E.paused || !f) return;
          const A = j.target;
          f.contains(A) ? x.current = A : fa(x.current, {
            select: true
          });
        }, C = function(j) {
          if (E.paused || !f) return;
          const A = j.relatedTarget;
          A !== null && (f.contains(A) || fa(x.current, {
            select: true
          }));
        }, _ = function(j) {
          if (document.activeElement === document.body) for (const N of j) N.removedNodes.length > 0 && fa(f);
        };
        document.addEventListener("focusin", b), document.addEventListener("focusout", C);
        const R = new MutationObserver(_);
        return f && R.observe(f, {
          childList: true,
          subtree: true
        }), () => {
          document.removeEventListener("focusin", b), document.removeEventListener("focusout", C), R.disconnect();
        };
      }
    }, [
      o,
      f,
      E.paused
    ]), g.useEffect(() => {
      if (f) {
        bb.add(E);
        const b = document.activeElement;
        if (!f.contains(b)) {
          const _ = new CustomEvent(Vd, pb);
          f.addEventListener(Vd, p), f.dispatchEvent(_), _.defaultPrevented || (J5(aE(c1(f)), {
            select: true
          }), document.activeElement === b && fa(f));
        }
        return () => {
          f.removeEventListener(Vd, p), setTimeout(() => {
            const _ = new CustomEvent(qd, pb);
            f.addEventListener(qd, v), f.dispatchEvent(_), _.defaultPrevented || fa(b ?? document.body, {
              select: true
            }), f.removeEventListener(qd, v), bb.remove(E);
          }, 0);
        };
      }
    }, [
      f,
      p,
      v,
      E
    ]);
    const k = g.useCallback((b) => {
      if (!a && !o || E.paused) return;
      const C = b.key === "Tab" && !b.altKey && !b.ctrlKey && !b.metaKey, _ = document.activeElement;
      if (C && _) {
        const R = b.currentTarget, [j, A] = eE(R);
        j && A ? !b.shiftKey && _ === A ? (b.preventDefault(), a && fa(j, {
          select: true
        })) : b.shiftKey && _ === j && (b.preventDefault(), a && fa(A, {
          select: true
        })) : _ === R && b.preventDefault();
      }
    }, [
      a,
      o,
      E.paused
    ]);
    return y.jsx(Q5.div, {
      tabIndex: -1,
      ...d,
      ref: S,
      onKeyDown: k
    });
  });
  i1.displayName = W5;
  function J5(l, { select: n = false } = {}) {
    const a = document.activeElement;
    for (const o of l) if (fa(o, {
      select: n
    }), document.activeElement !== a) return;
  }
  function eE(l) {
    const n = c1(l), a = yb(n, l), o = yb(n.reverse(), l);
    return [
      a,
      o
    ];
  }
  function c1(l) {
    const n = [], a = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (o) => {
        const i = o.tagName === "INPUT" && o.type === "hidden";
        return o.disabled || o.hidden || i ? NodeFilter.FILTER_SKIP : o.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    for (; a.nextNode(); ) n.push(a.currentNode);
    return n;
  }
  function yb(l, n) {
    for (const a of l) if (!tE(a, {
      upTo: n
    })) return a;
  }
  function tE(l, { upTo: n }) {
    if (getComputedStyle(l).visibility === "hidden") return true;
    for (; l; ) {
      if (n !== void 0 && l === n) return false;
      if (getComputedStyle(l).display === "none") return true;
      l = l.parentElement;
    }
    return false;
  }
  function nE(l) {
    return l instanceof HTMLInputElement && "select" in l;
  }
  function fa(l, { select: n = false } = {}) {
    if (l && l.focus) {
      const a = document.activeElement;
      l.focus({
        preventScroll: true
      }), l !== a && nE(l) && n && l.select();
    }
  }
  var bb = lE();
  function lE() {
    let l = [];
    return {
      add(n) {
        const a = l[0];
        n !== a && (a == null ? void 0 : a.pause()), l = vb(l, n), l.unshift(n);
      },
      remove(n) {
        var _a;
        l = vb(l, n), (_a = l[0]) == null ? void 0 : _a.resume();
      }
    };
  }
  function vb(l, n) {
    const a = [
      ...l
    ], o = a.indexOf(n);
    return o !== -1 && a.splice(o, 1), a;
  }
  function aE(l) {
    return l.filter((n) => n.tagName !== "A");
  }
  var rE = [
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
  ], oE = rE.reduce((l, n) => {
    const a = ms(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, h = d ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(h, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), sE = "Portal", u1 = g.forwardRef((l, n) => {
    var _a;
    const { container: a, ...o } = l, [i, c] = g.useState(false);
    os(() => c(true), []);
    const d = a || i && ((_a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _a.body);
    return d ? O5.createPortal(y.jsx(oE.div, {
      ...o,
      ref: n
    }), d) : null;
  });
  u1.displayName = sE;
  function iE(l, n) {
    return g.useReducer((a, o) => n[a][o] ?? a, l);
  }
  var mc = (l) => {
    const { present: n, children: a } = l, o = cE(n), i = typeof a == "function" ? a({
      present: o.isPresent
    }) : g.Children.only(a), c = Za(o.ref, uE(i));
    return typeof a == "function" || o.isPresent ? g.cloneElement(i, {
      ref: c
    }) : null;
  };
  mc.displayName = "Presence";
  function cE(l) {
    const [n, a] = g.useState(), o = g.useRef(null), i = g.useRef(l), c = g.useRef("none"), d = l ? "mounted" : "unmounted", [f, h] = iE(d, {
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
      const p = Hi(o.current);
      c.current = f === "mounted" ? p : "none";
    }, [
      f
    ]), os(() => {
      const p = o.current, v = i.current;
      if (v !== l) {
        const S = c.current, E = Hi(p);
        l ? h("MOUNT") : E === "none" || (p == null ? void 0 : p.display) === "none" ? h("UNMOUNT") : h(v && S !== E ? "ANIMATION_OUT" : "UNMOUNT"), i.current = l;
      }
    }, [
      l,
      h
    ]), os(() => {
      if (n) {
        let p;
        const v = n.ownerDocument.defaultView ?? window, x = (E) => {
          const b = Hi(o.current).includes(CSS.escape(E.animationName));
          if (E.target === n && b && (h("ANIMATION_END"), !i.current)) {
            const C = n.style.animationFillMode;
            n.style.animationFillMode = "forwards", p = v.setTimeout(() => {
              n.style.animationFillMode === "forwards" && (n.style.animationFillMode = C);
            });
          }
        }, S = (E) => {
          E.target === n && (c.current = Hi(o.current));
        };
        return n.addEventListener("animationstart", S), n.addEventListener("animationcancel", x), n.addEventListener("animationend", x), () => {
          v.clearTimeout(p), n.removeEventListener("animationstart", S), n.removeEventListener("animationcancel", x), n.removeEventListener("animationend", x);
        };
      } else h("ANIMATION_END");
    }, [
      n,
      h
    ]), {
      isPresent: [
        "mounted",
        "unmountSuspended"
      ].includes(f),
      ref: g.useCallback((p) => {
        o.current = p ? getComputedStyle(p) : null, a(p);
      }, [])
    };
  }
  function Hi(l) {
    return (l == null ? void 0 : l.animationName) || "none";
  }
  function uE(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, a = n && "isReactWarning" in n && n.isReactWarning;
    return a ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, a = n && "isReactWarning" in n && n.isReactWarning, a ? l.props.ref : l.props.ref || l.ref);
  }
  var dE = [
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
  ], gs = dE.reduce((l, n) => {
    const a = ms(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, h = d ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(h, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), Gd = 0;
  function fE() {
    g.useEffect(() => {
      const l = document.querySelectorAll("[data-radix-focus-guard]");
      return document.body.insertAdjacentElement("afterbegin", l[0] ?? xb()), document.body.insertAdjacentElement("beforeend", l[1] ?? xb()), Gd++, () => {
        Gd === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((n) => n.remove()), Gd--;
      };
    }, []);
  }
  function xb() {
    const l = document.createElement("span");
    return l.setAttribute("data-radix-focus-guard", ""), l.tabIndex = 0, l.style.outline = "none", l.style.opacity = "0", l.style.position = "fixed", l.style.pointerEvents = "none", l;
  }
  var il = function() {
    return il = Object.assign || function(n) {
      for (var a, o = 1, i = arguments.length; o < i; o++) {
        a = arguments[o];
        for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (n[c] = a[c]);
      }
      return n;
    }, il.apply(this, arguments);
  };
  function d1(l, n) {
    var a = {};
    for (var o in l) Object.prototype.hasOwnProperty.call(l, o) && n.indexOf(o) < 0 && (a[o] = l[o]);
    if (l != null && typeof Object.getOwnPropertySymbols == "function") for (var i = 0, o = Object.getOwnPropertySymbols(l); i < o.length; i++) n.indexOf(o[i]) < 0 && Object.prototype.propertyIsEnumerable.call(l, o[i]) && (a[o[i]] = l[o[i]]);
    return a;
  }
  function hE(l, n, a) {
    if (a || arguments.length === 2) for (var o = 0, i = n.length, c; o < i; o++) (c || !(o in n)) && (c || (c = Array.prototype.slice.call(n, 0, o)), c[o] = n[o]);
    return l.concat(c || Array.prototype.slice.call(n));
  }
  var Ji = "right-scroll-bar-position", ec = "width-before-scroll-bar", mE = "with-scroll-bars-hidden", gE = "--removed-body-scroll-bar-size";
  function Pd(l, n) {
    return typeof l == "function" ? l(n) : l && (l.current = n), l;
  }
  function pE(l, n) {
    var a = g.useState(function() {
      return {
        value: l,
        callback: n,
        facade: {
          get current() {
            return a.value;
          },
          set current(o) {
            var i = a.value;
            i !== o && (a.value = o, a.callback(o, i));
          }
        }
      };
    })[0];
    return a.callback = n, a.facade;
  }
  var yE = typeof window < "u" ? g.useLayoutEffect : g.useEffect, wb = /* @__PURE__ */ new WeakMap();
  function bE(l, n) {
    var a = pE(null, function(o) {
      return l.forEach(function(i) {
        return Pd(i, o);
      });
    });
    return yE(function() {
      var o = wb.get(a);
      if (o) {
        var i = new Set(o), c = new Set(l), d = a.current;
        i.forEach(function(f) {
          c.has(f) || Pd(f, null);
        }), c.forEach(function(f) {
          i.has(f) || Pd(f, d);
        });
      }
      wb.set(a, l);
    }, [
      l
    ]), a;
  }
  function vE(l) {
    return l;
  }
  function xE(l, n) {
    n === void 0 && (n = vE);
    var a = [], o = false, i = {
      read: function() {
        if (o) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        return a.length ? a[a.length - 1] : l;
      },
      useMedium: function(c) {
        var d = n(c, o);
        return a.push(d), function() {
          a = a.filter(function(f) {
            return f !== d;
          });
        };
      },
      assignSyncMedium: function(c) {
        for (o = true; a.length; ) {
          var d = a;
          a = [], d.forEach(c);
        }
        a = {
          push: function(f) {
            return c(f);
          },
          filter: function() {
            return a;
          }
        };
      },
      assignMedium: function(c) {
        o = true;
        var d = [];
        if (a.length) {
          var f = a;
          a = [], f.forEach(c), d = a;
        }
        var h = function() {
          var v = d;
          d = [], v.forEach(c);
        }, p = function() {
          return Promise.resolve().then(h);
        };
        p(), a = {
          push: function(v) {
            d.push(v), p();
          },
          filter: function(v) {
            return d = d.filter(v), a;
          }
        };
      }
    };
    return i;
  }
  function wE(l) {
    l === void 0 && (l = {});
    var n = xE(null);
    return n.options = il({
      async: true,
      ssr: false
    }, l), n;
  }
  var f1 = function(l) {
    var n = l.sideCar, a = d1(l, [
      "sideCar"
    ]);
    if (!n) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    var o = n.read();
    if (!o) throw new Error("Sidecar medium not found");
    return g.createElement(o, il({}, a));
  };
  f1.isSideCarExport = true;
  function SE(l, n) {
    return l.useMedium(n), f1;
  }
  var h1 = wE(), Zd = function() {
  }, gc = g.forwardRef(function(l, n) {
    var a = g.useRef(null), o = g.useState({
      onScrollCapture: Zd,
      onWheelCapture: Zd,
      onTouchMoveCapture: Zd
    }), i = o[0], c = o[1], d = l.forwardProps, f = l.children, h = l.className, p = l.removeScrollBar, v = l.enabled, x = l.shards, S = l.sideCar, E = l.noRelative, k = l.noIsolation, b = l.inert, C = l.allowPinchZoom, _ = l.as, R = _ === void 0 ? "div" : _, j = l.gapMode, A = d1(l, [
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
    ]), N = S, T = bE([
      a,
      n
    ]), O = il(il({}, A), i);
    return g.createElement(g.Fragment, null, v && g.createElement(N, {
      sideCar: h1,
      removeScrollBar: p,
      shards: x,
      noRelative: E,
      noIsolation: k,
      inert: b,
      setCallbacks: c,
      allowPinchZoom: !!C,
      lockRef: a,
      gapMode: j
    }), d ? g.cloneElement(g.Children.only(f), il(il({}, O), {
      ref: T
    })) : g.createElement(R, il({}, O, {
      className: h,
      ref: T
    }), f));
  });
  gc.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  gc.classNames = {
    fullWidth: ec,
    zeroRight: Ji
  };
  var CE = function() {
    if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
  };
  function EE() {
    if (!document) return null;
    var l = document.createElement("style");
    l.type = "text/css";
    var n = CE();
    return n && l.setAttribute("nonce", n), l;
  }
  function kE(l, n) {
    l.styleSheet ? l.styleSheet.cssText = n : l.appendChild(document.createTextNode(n));
  }
  function _E(l) {
    var n = document.head || document.getElementsByTagName("head")[0];
    n.appendChild(l);
  }
  var ME = function() {
    var l = 0, n = null;
    return {
      add: function(a) {
        l == 0 && (n = EE()) && (kE(n, a), _E(n)), l++;
      },
      remove: function() {
        l--, !l && n && (n.parentNode && n.parentNode.removeChild(n), n = null);
      }
    };
  }, jE = function() {
    var l = ME();
    return function(n, a) {
      g.useEffect(function() {
        return l.add(n), function() {
          l.remove();
        };
      }, [
        n && a
      ]);
    };
  }, m1 = function() {
    var l = jE(), n = function(a) {
      var o = a.styles, i = a.dynamic;
      return l(o, i), null;
    };
    return n;
  }, LE = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  }, Kd = function(l) {
    return parseInt(l || "", 10) || 0;
  }, RE = function(l) {
    var n = window.getComputedStyle(document.body), a = n[l === "padding" ? "paddingLeft" : "marginLeft"], o = n[l === "padding" ? "paddingTop" : "marginTop"], i = n[l === "padding" ? "paddingRight" : "marginRight"];
    return [
      Kd(a),
      Kd(o),
      Kd(i)
    ];
  }, AE = function(l) {
    if (l === void 0 && (l = "margin"), typeof window > "u") return LE;
    var n = RE(l), a = document.documentElement.clientWidth, o = window.innerWidth;
    return {
      left: n[0],
      top: n[1],
      right: n[2],
      gap: Math.max(0, o - a + n[2] - n[0])
    };
  }, NE = m1(), $r = "data-scroll-locked", TE = function(l, n, a, o) {
    var i = l.left, c = l.top, d = l.right, f = l.gap;
    return a === void 0 && (a = "margin"), `
  .`.concat(mE, ` {
   overflow: hidden `).concat(o, `;
   padding-right: `).concat(f, "px ").concat(o, `;
  }
  body[`).concat($r, `] {
    overflow: hidden `).concat(o, `;
    overscroll-behavior: contain;
    `).concat([
      n && "position: relative ".concat(o, ";"),
      a === "margin" && `
    padding-left: `.concat(i, `px;
    padding-top: `).concat(c, `px;
    padding-right: `).concat(d, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(f, "px ").concat(o, `;
    `),
      a === "padding" && "padding-right: ".concat(f, "px ").concat(o, ";")
    ].filter(Boolean).join(""), `
  }
  
  .`).concat(Ji, ` {
    right: `).concat(f, "px ").concat(o, `;
  }
  
  .`).concat(ec, ` {
    margin-right: `).concat(f, "px ").concat(o, `;
  }
  
  .`).concat(Ji, " .").concat(Ji, ` {
    right: 0 `).concat(o, `;
  }
  
  .`).concat(ec, " .").concat(ec, ` {
    margin-right: 0 `).concat(o, `;
  }
  
  body[`).concat($r, `] {
    `).concat(gE, ": ").concat(f, `px;
  }
`);
  }, Sb = function() {
    var l = parseInt(document.body.getAttribute($r) || "0", 10);
    return isFinite(l) ? l : 0;
  }, OE = function() {
    g.useEffect(function() {
      return document.body.setAttribute($r, (Sb() + 1).toString()), function() {
        var l = Sb() - 1;
        l <= 0 ? document.body.removeAttribute($r) : document.body.setAttribute($r, l.toString());
      };
    }, []);
  }, IE = function(l) {
    var n = l.noRelative, a = l.noImportant, o = l.gapMode, i = o === void 0 ? "margin" : o;
    OE();
    var c = g.useMemo(function() {
      return AE(i);
    }, [
      i
    ]);
    return g.createElement(NE, {
      styles: TE(c, !n, i, a ? "" : "!important")
    });
  }, Pf = false;
  if (typeof window < "u") try {
    var Yi = Object.defineProperty({}, "passive", {
      get: function() {
        return Pf = true, true;
      }
    });
    window.addEventListener("test", Yi, Yi), window.removeEventListener("test", Yi, Yi);
  } catch {
    Pf = false;
  }
  var Dr = Pf ? {
    passive: false
  } : false, DE = function(l) {
    return l.tagName === "TEXTAREA";
  }, g1 = function(l, n) {
    if (!(l instanceof Element)) return false;
    var a = window.getComputedStyle(l);
    return a[n] !== "hidden" && !(a.overflowY === a.overflowX && !DE(l) && a[n] === "visible");
  }, zE = function(l) {
    return g1(l, "overflowY");
  }, HE = function(l) {
    return g1(l, "overflowX");
  }, Cb = function(l, n) {
    var a = n.ownerDocument, o = n;
    do {
      typeof ShadowRoot < "u" && o instanceof ShadowRoot && (o = o.host);
      var i = p1(l, o);
      if (i) {
        var c = y1(l, o), d = c[1], f = c[2];
        if (d > f) return true;
      }
      o = o.parentNode;
    } while (o && o !== a.body);
    return false;
  }, YE = function(l) {
    var n = l.scrollTop, a = l.scrollHeight, o = l.clientHeight;
    return [
      n,
      a,
      o
    ];
  }, BE = function(l) {
    var n = l.scrollLeft, a = l.scrollWidth, o = l.clientWidth;
    return [
      n,
      a,
      o
    ];
  }, p1 = function(l, n) {
    return l === "v" ? zE(n) : HE(n);
  }, y1 = function(l, n) {
    return l === "v" ? YE(n) : BE(n);
  }, XE = function(l, n) {
    return l === "h" && n === "rtl" ? -1 : 1;
  }, UE = function(l, n, a, o, i) {
    var c = XE(l, window.getComputedStyle(n).direction), d = c * o, f = a.target, h = n.contains(f), p = false, v = d > 0, x = 0, S = 0;
    do {
      if (!f) break;
      var E = y1(l, f), k = E[0], b = E[1], C = E[2], _ = b - C - c * k;
      (k || _) && p1(l, f) && (x += _, S += k);
      var R = f.parentNode;
      f = R && R.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? R.host : R;
    } while (!h && f !== document.body || h && (n.contains(f) || n === f));
    return (v && Math.abs(x) < 1 || !v && Math.abs(S) < 1) && (p = true), p;
  }, Bi = function(l) {
    return "changedTouches" in l ? [
      l.changedTouches[0].clientX,
      l.changedTouches[0].clientY
    ] : [
      0,
      0
    ];
  }, Eb = function(l) {
    return [
      l.deltaX,
      l.deltaY
    ];
  }, kb = function(l) {
    return l && "current" in l ? l.current : l;
  }, $E = function(l, n) {
    return l[0] === n[0] && l[1] === n[1];
  }, VE = function(l) {
    return `
  .block-interactivity-`.concat(l, ` {pointer-events: none;}
  .allow-interactivity-`).concat(l, ` {pointer-events: all;}
`);
  }, qE = 0, zr = [];
  function GE(l) {
    var n = g.useRef([]), a = g.useRef([
      0,
      0
    ]), o = g.useRef(), i = g.useState(qE++)[0], c = g.useState(m1)[0], d = g.useRef(l);
    g.useEffect(function() {
      d.current = l;
    }, [
      l
    ]), g.useEffect(function() {
      if (l.inert) {
        document.body.classList.add("block-interactivity-".concat(i));
        var b = hE([
          l.lockRef.current
        ], (l.shards || []).map(kb), true).filter(Boolean);
        return b.forEach(function(C) {
          return C.classList.add("allow-interactivity-".concat(i));
        }), function() {
          document.body.classList.remove("block-interactivity-".concat(i)), b.forEach(function(C) {
            return C.classList.remove("allow-interactivity-".concat(i));
          });
        };
      }
    }, [
      l.inert,
      l.lockRef.current,
      l.shards
    ]);
    var f = g.useCallback(function(b, C) {
      if ("touches" in b && b.touches.length === 2 || b.type === "wheel" && b.ctrlKey) return !d.current.allowPinchZoom;
      var _ = Bi(b), R = a.current, j = "deltaX" in b ? b.deltaX : R[0] - _[0], A = "deltaY" in b ? b.deltaY : R[1] - _[1], N, T = b.target, O = Math.abs(j) > Math.abs(A) ? "h" : "v";
      if ("touches" in b && O === "h" && T.type === "range") return false;
      var D = window.getSelection(), H = D && D.anchorNode, $ = H ? H === T || H.contains(T) : false;
      if ($) return false;
      var te = Cb(O, T);
      if (!te) return true;
      if (te ? N = O : (N = O === "v" ? "h" : "v", te = Cb(O, T)), !te) return false;
      if (!o.current && "changedTouches" in b && (j || A) && (o.current = N), !N) return true;
      var J = o.current || N;
      return UE(J, C, b, J === "h" ? j : A);
    }, []), h = g.useCallback(function(b) {
      var C = b;
      if (!(!zr.length || zr[zr.length - 1] !== c)) {
        var _ = "deltaY" in C ? Eb(C) : Bi(C), R = n.current.filter(function(N) {
          return N.name === C.type && (N.target === C.target || C.target === N.shadowParent) && $E(N.delta, _);
        })[0];
        if (R && R.should) {
          C.cancelable && C.preventDefault();
          return;
        }
        if (!R) {
          var j = (d.current.shards || []).map(kb).filter(Boolean).filter(function(N) {
            return N.contains(C.target);
          }), A = j.length > 0 ? f(C, j[0]) : !d.current.noIsolation;
          A && C.cancelable && C.preventDefault();
        }
      }
    }, []), p = g.useCallback(function(b, C, _, R) {
      var j = {
        name: b,
        delta: C,
        target: _,
        should: R,
        shadowParent: PE(_)
      };
      n.current.push(j), setTimeout(function() {
        n.current = n.current.filter(function(A) {
          return A !== j;
        });
      }, 1);
    }, []), v = g.useCallback(function(b) {
      a.current = Bi(b), o.current = void 0;
    }, []), x = g.useCallback(function(b) {
      p(b.type, Eb(b), b.target, f(b, l.lockRef.current));
    }, []), S = g.useCallback(function(b) {
      p(b.type, Bi(b), b.target, f(b, l.lockRef.current));
    }, []);
    g.useEffect(function() {
      return zr.push(c), l.setCallbacks({
        onScrollCapture: x,
        onWheelCapture: x,
        onTouchMoveCapture: S
      }), document.addEventListener("wheel", h, Dr), document.addEventListener("touchmove", h, Dr), document.addEventListener("touchstart", v, Dr), function() {
        zr = zr.filter(function(b) {
          return b !== c;
        }), document.removeEventListener("wheel", h, Dr), document.removeEventListener("touchmove", h, Dr), document.removeEventListener("touchstart", v, Dr);
      };
    }, []);
    var E = l.removeScrollBar, k = l.inert;
    return g.createElement(g.Fragment, null, k ? g.createElement(c, {
      styles: VE(i)
    }) : null, E ? g.createElement(IE, {
      noRelative: l.noRelative,
      gapMode: l.gapMode
    }) : null);
  }
  function PE(l) {
    for (var n = null; l !== null; ) l instanceof ShadowRoot && (n = l.host, l = l.host), l = l.parentNode;
    return n;
  }
  const ZE = SE(h1, GE);
  var b1 = g.forwardRef(function(l, n) {
    return g.createElement(gc, il({}, l, {
      ref: n,
      sideCar: ZE
    }));
  });
  b1.classNames = gc.classNames;
  var KE = function(l) {
    if (typeof document > "u") return null;
    var n = Array.isArray(l) ? l[0] : l;
    return n.ownerDocument.body;
  }, Hr = /* @__PURE__ */ new WeakMap(), Xi = /* @__PURE__ */ new WeakMap(), Ui = {}, Fd = 0, v1 = function(l) {
    return l && (l.host || v1(l.parentNode));
  }, FE = function(l, n) {
    return n.map(function(a) {
      if (l.contains(a)) return a;
      var o = v1(a);
      return o && l.contains(o) ? o : (console.error("aria-hidden", a, "in not contained inside", l, ". Doing nothing"), null);
    }).filter(function(a) {
      return !!a;
    });
  }, QE = function(l, n, a, o) {
    var i = FE(n, Array.isArray(l) ? l : [
      l
    ]);
    Ui[a] || (Ui[a] = /* @__PURE__ */ new WeakMap());
    var c = Ui[a], d = [], f = /* @__PURE__ */ new Set(), h = new Set(i), p = function(x) {
      !x || f.has(x) || (f.add(x), p(x.parentNode));
    };
    i.forEach(p);
    var v = function(x) {
      !x || h.has(x) || Array.prototype.forEach.call(x.children, function(S) {
        if (f.has(S)) v(S);
        else try {
          var E = S.getAttribute(o), k = E !== null && E !== "false", b = (Hr.get(S) || 0) + 1, C = (c.get(S) || 0) + 1;
          Hr.set(S, b), c.set(S, C), d.push(S), b === 1 && k && Xi.set(S, true), C === 1 && S.setAttribute(a, "true"), k || S.setAttribute(o, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", S, _);
        }
      });
    };
    return v(n), f.clear(), Fd++, function() {
      d.forEach(function(x) {
        var S = Hr.get(x) - 1, E = c.get(x) - 1;
        Hr.set(x, S), c.set(x, E), S || (Xi.has(x) || x.removeAttribute(o), Xi.delete(x)), E || x.removeAttribute(a);
      }), Fd--, Fd || (Hr = /* @__PURE__ */ new WeakMap(), Hr = /* @__PURE__ */ new WeakMap(), Xi = /* @__PURE__ */ new WeakMap(), Ui = {});
    };
  }, WE = function(l, n, a) {
    a === void 0 && (a = "data-aria-hidden");
    var o = Array.from(Array.isArray(l) ? l : [
      l
    ]), i = KE(l);
    return i ? (o.push.apply(o, Array.from(i.querySelectorAll("[aria-live], script"))), QE(o, i, a, "aria-hidden")) : function() {
      return null;
    };
  }, pc = "Dialog", [x1] = _5(pc), [JE, el] = x1(pc), w1 = (l) => {
    const { __scopeDialog: n, children: a, open: o, defaultOpen: i, onOpenChange: c, modal: d = true } = l, f = g.useRef(null), h = g.useRef(null), [p, v] = A5({
      prop: o,
      defaultProp: i ?? false,
      onChange: c,
      caller: pc
    });
    return y.jsx(JE, {
      scope: n,
      triggerRef: f,
      contentRef: h,
      contentId: Dl(),
      titleId: Dl(),
      descriptionId: Dl(),
      open: p,
      onOpenChange: v,
      onOpenToggle: g.useCallback(() => v((x) => !x), [
        v
      ]),
      modal: d,
      children: a
    });
  };
  w1.displayName = pc;
  var S1 = "DialogTrigger", ek = g.forwardRef((l, n) => {
    const { __scopeDialog: a, ...o } = l, i = el(S1, a), c = Za(n, i.triggerRef);
    return y.jsx(gs.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": i.open,
      "aria-controls": i.contentId,
      "data-state": hh(i.open),
      ...o,
      ref: c,
      onClick: ha(l.onClick, i.onOpenToggle)
    });
  });
  ek.displayName = S1;
  var dh = "DialogPortal", [tk, C1] = x1(dh, {
    forceMount: void 0
  }), E1 = (l) => {
    const { __scopeDialog: n, forceMount: a, children: o, container: i } = l, c = el(dh, n);
    return y.jsx(tk, {
      scope: n,
      forceMount: a,
      children: g.Children.map(o, (d) => y.jsx(mc, {
        present: a || c.open,
        children: y.jsx(u1, {
          asChild: true,
          container: i,
          children: d
        })
      }))
    });
  };
  E1.displayName = dh;
  var ac = "DialogOverlay", k1 = g.forwardRef((l, n) => {
    const a = C1(ac, l.__scopeDialog), { forceMount: o = a.forceMount, ...i } = l, c = el(ac, l.__scopeDialog);
    return c.modal ? y.jsx(mc, {
      present: o || c.open,
      children: y.jsx(lk, {
        ...i,
        ref: n
      })
    }) : null;
  });
  k1.displayName = ac;
  var nk = ms("DialogOverlay.RemoveScroll"), lk = g.forwardRef((l, n) => {
    const { __scopeDialog: a, ...o } = l, i = el(ac, a);
    return y.jsx(b1, {
      as: nk,
      allowPinchZoom: true,
      shards: [
        i.contentRef
      ],
      children: y.jsx(gs.div, {
        "data-state": hh(i.open),
        ...o,
        ref: n,
        style: {
          pointerEvents: "auto",
          ...o.style
        }
      })
    });
  }), Va = "DialogContent", _1 = g.forwardRef((l, n) => {
    const a = C1(Va, l.__scopeDialog), { forceMount: o = a.forceMount, ...i } = l, c = el(Va, l.__scopeDialog);
    return y.jsx(mc, {
      present: o || c.open,
      children: c.modal ? y.jsx(ak, {
        ...i,
        ref: n
      }) : y.jsx(rk, {
        ...i,
        ref: n
      })
    });
  });
  _1.displayName = Va;
  var ak = g.forwardRef((l, n) => {
    const a = el(Va, l.__scopeDialog), o = g.useRef(null), i = Za(n, a.contentRef, o);
    return g.useEffect(() => {
      const c = o.current;
      if (c) return WE(c);
    }, []), y.jsx(M1, {
      ...l,
      ref: i,
      trapFocus: a.open,
      disableOutsidePointerEvents: true,
      onCloseAutoFocus: ha(l.onCloseAutoFocus, (c) => {
        var _a;
        c.preventDefault(), (_a = a.triggerRef.current) == null ? void 0 : _a.focus();
      }),
      onPointerDownOutside: ha(l.onPointerDownOutside, (c) => {
        const d = c.detail.originalEvent, f = d.button === 0 && d.ctrlKey === true;
        (d.button === 2 || f) && c.preventDefault();
      }),
      onFocusOutside: ha(l.onFocusOutside, (c) => c.preventDefault())
    });
  }), rk = g.forwardRef((l, n) => {
    const a = el(Va, l.__scopeDialog), o = g.useRef(false), i = g.useRef(false);
    return y.jsx(M1, {
      ...l,
      ref: n,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      onCloseAutoFocus: (c) => {
        var _a, _b2;
        (_a = l.onCloseAutoFocus) == null ? void 0 : _a.call(l, c), c.defaultPrevented || (o.current || ((_b2 = a.triggerRef.current) == null ? void 0 : _b2.focus()), c.preventDefault()), o.current = false, i.current = false;
      },
      onInteractOutside: (c) => {
        var _a, _b2;
        (_a = l.onInteractOutside) == null ? void 0 : _a.call(l, c), c.defaultPrevented || (o.current = true, c.detail.originalEvent.type === "pointerdown" && (i.current = true));
        const d = c.target;
        ((_b2 = a.triggerRef.current) == null ? void 0 : _b2.contains(d)) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && i.current && c.preventDefault();
      }
    });
  }), M1 = g.forwardRef((l, n) => {
    const { __scopeDialog: a, trapFocus: o, onOpenAutoFocus: i, onCloseAutoFocus: c, ...d } = l, f = el(Va, a), h = g.useRef(null), p = Za(n, h);
    return fE(), y.jsxs(y.Fragment, {
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
            "data-state": hh(f.open),
            ...d,
            ref: p,
            onDismiss: () => f.onOpenChange(false)
          })
        }),
        y.jsxs(y.Fragment, {
          children: [
            y.jsx(ck, {
              titleId: f.titleId
            }),
            y.jsx(dk, {
              contentRef: h,
              descriptionId: f.descriptionId
            })
          ]
        })
      ]
    });
  }), fh = "DialogTitle", ok = g.forwardRef((l, n) => {
    const { __scopeDialog: a, ...o } = l, i = el(fh, a);
    return y.jsx(gs.h2, {
      id: i.titleId,
      ...o,
      ref: n
    });
  });
  ok.displayName = fh;
  var j1 = "DialogDescription", sk = g.forwardRef((l, n) => {
    const { __scopeDialog: a, ...o } = l, i = el(j1, a);
    return y.jsx(gs.p, {
      id: i.descriptionId,
      ...o,
      ref: n
    });
  });
  sk.displayName = j1;
  var L1 = "DialogClose", ik = g.forwardRef((l, n) => {
    const { __scopeDialog: a, ...o } = l, i = el(L1, a);
    return y.jsx(gs.button, {
      type: "button",
      ...o,
      ref: n,
      onClick: ha(l.onClick, () => i.onOpenChange(false))
    });
  });
  ik.displayName = L1;
  function hh(l) {
    return l ? "open" : "closed";
  }
  var R1 = "DialogTitleWarning", [uj, A1] = k5(R1, {
    contentName: Va,
    titleName: fh,
    docsSlug: "dialog"
  }), ck = ({ titleId: l }) => {
    const n = A1(R1), a = `\`${n.contentName}\` requires a \`${n.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${n.docsSlug}`;
    return g.useEffect(() => {
      l && (document.getElementById(l) || console.error(a));
    }, [
      a,
      l
    ]), null;
  }, uk = "DialogDescriptionWarning", dk = ({ contentRef: l, descriptionId: n }) => {
    const o = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${A1(uk).contentName}}.`;
    return g.useEffect(() => {
      var _a;
      const i = (_a = l.current) == null ? void 0 : _a.getAttribute("aria-describedby");
      n && i && (document.getElementById(n) || console.warn(o));
    }, [
      o,
      l,
      n
    ]), null;
  }, fk = w1, hk = E1, mk = k1, gk = _1, pk = Symbol.for("react.lazy"), rc = Jf[" use ".trim().toString()];
  function yk(l) {
    return typeof l == "object" && l !== null && "then" in l;
  }
  function N1(l) {
    return l != null && typeof l == "object" && "$$typeof" in l && l.$$typeof === pk && "_payload" in l && yk(l._payload);
  }
  function bk(l) {
    const n = vk(l), a = g.forwardRef((o, i) => {
      let { children: c, ...d } = o;
      N1(c) && typeof rc == "function" && (c = rc(c._payload));
      const f = g.Children.toArray(c), h = f.find(wk);
      if (h) {
        const p = h.props.children, v = f.map((x) => x === h ? g.Children.count(p) > 1 ? g.Children.only(null) : g.isValidElement(p) ? p.props.children : null : x);
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
    return a.displayName = `${l}.Slot`, a;
  }
  function vk(l) {
    const n = g.forwardRef((a, o) => {
      let { children: i, ...c } = a;
      if (N1(i) && typeof rc == "function" && (i = rc(i._payload)), g.isValidElement(i)) {
        const d = Ck(i), f = Sk(c, i.props);
        return i.type !== g.Fragment && (f.ref = o ? ga(o, d) : d), g.cloneElement(i, f);
      }
      return g.Children.count(i) > 1 ? g.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var xk = Symbol("radix.slottable");
  function wk(l) {
    return g.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === xk;
  }
  function Sk(l, n) {
    const a = {
      ...n
    };
    for (const o in n) {
      const i = l[o], c = n[o];
      /^on[A-Z]/.test(o) ? i && c ? a[o] = (...f) => {
        const h = c(...f);
        return i(...f), h;
      } : i && (a[o] = i) : o === "style" ? a[o] = {
        ...i,
        ...c
      } : o === "className" && (a[o] = [
        i,
        c
      ].filter(Boolean).join(" "));
    }
    return {
      ...l,
      ...a
    };
  }
  function Ck(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, a = n && "isReactWarning" in n && n.isReactWarning;
    return a ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, a = n && "isReactWarning" in n && n.isReactWarning, a ? l.props.ref : l.props.ref || l.ref);
  }
  var Ek = [
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
  ], ya = Ek.reduce((l, n) => {
    const a = bk(`Primitive.${n}`), o = g.forwardRef((i, c) => {
      const { asChild: d, ...f } = i, h = d ? a : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(h, {
        ...f,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), Go = '[cmdk-group=""]', Qd = '[cmdk-group-items=""]', kk = '[cmdk-group-heading=""]', T1 = '[cmdk-item=""]', _b = `${T1}:not([aria-disabled="true"])`, Zf = "cmdk-item-select", Yr = "data-value", _k = (l, n, a) => E5(l, n, a), O1 = g.createContext(void 0), ps = () => g.useContext(O1), I1 = g.createContext(void 0), mh = () => g.useContext(I1), D1 = g.createContext(void 0), z1 = g.forwardRef((l, n) => {
    let a = Br(() => {
      var I, Z;
      return {
        search: "",
        value: (Z = (I = l.value) != null ? I : l.defaultValue) != null ? Z : "",
        selectedItemId: void 0,
        filtered: {
          count: 0,
          items: /* @__PURE__ */ new Map(),
          groups: /* @__PURE__ */ new Set()
        }
      };
    }), o = Br(() => /* @__PURE__ */ new Set()), i = Br(() => /* @__PURE__ */ new Map()), c = Br(() => /* @__PURE__ */ new Map()), d = Br(() => /* @__PURE__ */ new Set()), f = H1(l), { label: h, children: p, value: v, onValueChange: x, filter: S, shouldFilter: E, loop: k, disablePointerSelection: b = false, vimBindings: C = true, ..._ } = l, R = Dl(), j = Dl(), A = Dl(), N = g.useRef(null), T = zk();
    qa(() => {
      if (v !== void 0) {
        let I = v.trim();
        a.current.value = I, O.emit();
      }
    }, [
      v
    ]), qa(() => {
      T(6, ee);
    }, []);
    let O = g.useMemo(() => ({
      subscribe: (I) => (d.current.add(I), () => d.current.delete(I)),
      snapshot: () => a.current,
      setState: (I, Z, W) => {
        var G, se, Y, re;
        if (!Object.is(a.current[I], Z)) {
          if (a.current[I] = Z, I === "search") J(), $(), T(1, te);
          else if (I === "value") {
            if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
              let z = document.getElementById(A);
              z ? z.focus() : (G = document.getElementById(R)) == null || G.focus();
            }
            if (T(7, () => {
              var z;
              a.current.selectedItemId = (z = ge()) == null ? void 0 : z.id, O.emit();
            }), W || T(5, ee), ((se = f.current) == null ? void 0 : se.value) !== void 0) {
              let z = Z ?? "";
              (re = (Y = f.current).onValueChange) == null || re.call(Y, z);
              return;
            }
          }
          O.emit();
        }
      },
      emit: () => {
        d.current.forEach((I) => I());
      }
    }), []), D = g.useMemo(() => ({
      value: (I, Z, W) => {
        var G;
        Z !== ((G = c.current.get(I)) == null ? void 0 : G.value) && (c.current.set(I, {
          value: Z,
          keywords: W
        }), a.current.filtered.items.set(I, H(Z, W)), T(2, () => {
          $(), O.emit();
        }));
      },
      item: (I, Z) => (o.current.add(I), Z && (i.current.has(Z) ? i.current.get(Z).add(I) : i.current.set(Z, /* @__PURE__ */ new Set([
        I
      ]))), T(3, () => {
        J(), $(), a.current.value || te(), O.emit();
      }), () => {
        c.current.delete(I), o.current.delete(I), a.current.filtered.items.delete(I);
        let W = ge();
        T(4, () => {
          J(), (W == null ? void 0 : W.getAttribute("id")) === I && te(), O.emit();
        });
      }),
      group: (I) => (i.current.has(I) || i.current.set(I, /* @__PURE__ */ new Set()), () => {
        c.current.delete(I), i.current.delete(I);
      }),
      filter: () => f.current.shouldFilter,
      label: h || l["aria-label"],
      getDisablePointerSelection: () => f.current.disablePointerSelection,
      listId: R,
      inputId: A,
      labelId: j,
      listInnerRef: N
    }), []);
    function H(I, Z) {
      var W, G;
      let se = (G = (W = f.current) == null ? void 0 : W.filter) != null ? G : _k;
      return I ? se(I, a.current.search, Z) : 0;
    }
    function $() {
      if (!a.current.search || f.current.shouldFilter === false) return;
      let I = a.current.filtered.items, Z = [];
      a.current.filtered.groups.forEach((G) => {
        let se = i.current.get(G), Y = 0;
        se.forEach((re) => {
          let z = I.get(re);
          Y = Math.max(z, Y);
        }), Z.push([
          G,
          Y
        ]);
      });
      let W = N.current;
      Ce().sort((G, se) => {
        var Y, re;
        let z = G.getAttribute("id"), oe = se.getAttribute("id");
        return ((Y = I.get(oe)) != null ? Y : 0) - ((re = I.get(z)) != null ? re : 0);
      }).forEach((G) => {
        let se = G.closest(Qd);
        se ? se.appendChild(G.parentElement === se ? G : G.closest(`${Qd} > *`)) : W.appendChild(G.parentElement === W ? G : G.closest(`${Qd} > *`));
      }), Z.sort((G, se) => se[1] - G[1]).forEach((G) => {
        var se;
        let Y = (se = N.current) == null ? void 0 : se.querySelector(`${Go}[${Yr}="${encodeURIComponent(G[0])}"]`);
        Y == null ? void 0 : Y.parentElement.appendChild(Y);
      });
    }
    function te() {
      let I = Ce().find((W) => W.getAttribute("aria-disabled") !== "true"), Z = I == null ? void 0 : I.getAttribute(Yr);
      O.setState("value", Z || void 0);
    }
    function J() {
      var I, Z, W, G;
      if (!a.current.search || f.current.shouldFilter === false) {
        a.current.filtered.count = o.current.size;
        return;
      }
      a.current.filtered.groups = /* @__PURE__ */ new Set();
      let se = 0;
      for (let Y of o.current) {
        let re = (Z = (I = c.current.get(Y)) == null ? void 0 : I.value) != null ? Z : "", z = (G = (W = c.current.get(Y)) == null ? void 0 : W.keywords) != null ? G : [], oe = H(re, z);
        a.current.filtered.items.set(Y, oe), oe > 0 && se++;
      }
      for (let [Y, re] of i.current) for (let z of re) if (a.current.filtered.items.get(z) > 0) {
        a.current.filtered.groups.add(Y);
        break;
      }
      a.current.filtered.count = se;
    }
    function ee() {
      var I, Z, W;
      let G = ge();
      G && (((I = G.parentElement) == null ? void 0 : I.firstChild) === G && ((W = (Z = G.closest(Go)) == null ? void 0 : Z.querySelector(kk)) == null || W.scrollIntoView({
        block: "nearest"
      })), G.scrollIntoView({
        block: "nearest"
      }));
    }
    function ge() {
      var I;
      return (I = N.current) == null ? void 0 : I.querySelector(`${T1}[aria-selected="true"]`);
    }
    function Ce() {
      var I;
      return Array.from(((I = N.current) == null ? void 0 : I.querySelectorAll(_b)) || []);
    }
    function V(I) {
      let Z = Ce()[I];
      Z && O.setState("value", Z.getAttribute(Yr));
    }
    function P(I) {
      var Z;
      let W = ge(), G = Ce(), se = G.findIndex((re) => re === W), Y = G[se + I];
      (Z = f.current) != null && Z.loop && (Y = se + I < 0 ? G[G.length - 1] : se + I === G.length ? G[0] : G[se + I]), Y && O.setState("value", Y.getAttribute(Yr));
    }
    function pe(I) {
      let Z = ge(), W = Z == null ? void 0 : Z.closest(Go), G;
      for (; W && !G; ) W = I > 0 ? Ik(W, Go) : Dk(W, Go), G = W == null ? void 0 : W.querySelector(_b);
      G ? O.setState("value", G.getAttribute(Yr)) : P(I);
    }
    let xe = () => V(Ce().length - 1), be = (I) => {
      I.preventDefault(), I.metaKey ? xe() : I.altKey ? pe(1) : P(1);
    }, L = (I) => {
      I.preventDefault(), I.metaKey ? V(0) : I.altKey ? pe(-1) : P(-1);
    };
    return g.createElement(ya.div, {
      ref: n,
      tabIndex: -1,
      ..._,
      "cmdk-root": "",
      onKeyDown: (I) => {
        var Z;
        (Z = _.onKeyDown) == null || Z.call(_, I);
        let W = I.nativeEvent.isComposing || I.keyCode === 229;
        if (!(I.defaultPrevented || W)) switch (I.key) {
          case "n":
          case "j": {
            C && I.ctrlKey && be(I);
            break;
          }
          case "ArrowDown": {
            be(I);
            break;
          }
          case "p":
          case "k": {
            C && I.ctrlKey && L(I);
            break;
          }
          case "ArrowUp": {
            L(I);
            break;
          }
          case "Home": {
            I.preventDefault(), V(0);
            break;
          }
          case "End": {
            I.preventDefault(), xe();
            break;
          }
          case "Enter": {
            I.preventDefault();
            let G = ge();
            if (G) {
              let se = new Event(Zf);
              G.dispatchEvent(se);
            }
          }
        }
      }
    }, g.createElement("label", {
      "cmdk-label": "",
      htmlFor: D.inputId,
      id: D.labelId,
      style: Yk
    }, h), yc(l, (I) => g.createElement(I1.Provider, {
      value: O
    }, g.createElement(O1.Provider, {
      value: D
    }, I))));
  }), Mk = g.forwardRef((l, n) => {
    var a, o;
    let i = Dl(), c = g.useRef(null), d = g.useContext(D1), f = ps(), h = H1(l), p = (o = (a = h.current) == null ? void 0 : a.forceMount) != null ? o : d == null ? void 0 : d.forceMount;
    qa(() => {
      if (!p) return f.item(i, d == null ? void 0 : d.id);
    }, [
      p
    ]);
    let v = Y1(i, c, [
      l.value,
      l.children,
      c
    ], l.keywords), x = mh(), S = pa((T) => T.value && T.value === v.current), E = pa((T) => p || f.filter() === false ? true : T.search ? T.filtered.items.get(i) > 0 : true);
    g.useEffect(() => {
      let T = c.current;
      if (!(!T || l.disabled)) return T.addEventListener(Zf, k), () => T.removeEventListener(Zf, k);
    }, [
      E,
      l.onSelect,
      l.disabled
    ]);
    function k() {
      var T, O;
      b(), (O = (T = h.current).onSelect) == null || O.call(T, v.current);
    }
    function b() {
      x.setState("value", v.current, true);
    }
    if (!E) return null;
    let { disabled: C, value: _, onSelect: R, forceMount: j, keywords: A, ...N } = l;
    return g.createElement(ya.div, {
      ref: ga(c, n),
      ...N,
      id: i,
      "cmdk-item": "",
      role: "option",
      "aria-disabled": !!C,
      "aria-selected": !!S,
      "data-disabled": !!C,
      "data-selected": !!S,
      onPointerMove: C || f.getDisablePointerSelection() ? void 0 : b,
      onClick: C ? void 0 : k
    }, l.children);
  }), jk = g.forwardRef((l, n) => {
    let { heading: a, children: o, forceMount: i, ...c } = l, d = Dl(), f = g.useRef(null), h = g.useRef(null), p = Dl(), v = ps(), x = pa((E) => i || v.filter() === false ? true : E.search ? E.filtered.groups.has(d) : true);
    qa(() => v.group(d), []), Y1(d, f, [
      l.value,
      l.heading,
      h
    ]);
    let S = g.useMemo(() => ({
      id: d,
      forceMount: i
    }), [
      i
    ]);
    return g.createElement(ya.div, {
      ref: ga(f, n),
      ...c,
      "cmdk-group": "",
      role: "presentation",
      hidden: x ? void 0 : true
    }, a && g.createElement("div", {
      ref: h,
      "cmdk-group-heading": "",
      "aria-hidden": true,
      id: p
    }, a), yc(l, (E) => g.createElement("div", {
      "cmdk-group-items": "",
      role: "group",
      "aria-labelledby": a ? p : void 0
    }, g.createElement(D1.Provider, {
      value: S
    }, E))));
  }), Lk = g.forwardRef((l, n) => {
    let { alwaysRender: a, ...o } = l, i = g.useRef(null), c = pa((d) => !d.search);
    return !a && !c ? null : g.createElement(ya.div, {
      ref: ga(i, n),
      ...o,
      "cmdk-separator": "",
      role: "separator"
    });
  }), Rk = g.forwardRef((l, n) => {
    let { onValueChange: a, ...o } = l, i = l.value != null, c = mh(), d = pa((p) => p.search), f = pa((p) => p.selectedItemId), h = ps();
    return g.useEffect(() => {
      l.value != null && c.setState("search", l.value);
    }, [
      l.value
    ]), g.createElement(ya.input, {
      ref: n,
      ...o,
      "cmdk-input": "",
      autoComplete: "off",
      autoCorrect: "off",
      spellCheck: false,
      "aria-autocomplete": "list",
      role: "combobox",
      "aria-expanded": true,
      "aria-controls": h.listId,
      "aria-labelledby": h.labelId,
      "aria-activedescendant": f,
      id: h.inputId,
      type: "text",
      value: i ? l.value : d,
      onChange: (p) => {
        i || c.setState("search", p.target.value), a == null ? void 0 : a(p.target.value);
      }
    });
  }), Ak = g.forwardRef((l, n) => {
    let { children: a, label: o = "Suggestions", ...i } = l, c = g.useRef(null), d = g.useRef(null), f = pa((p) => p.selectedItemId), h = ps();
    return g.useEffect(() => {
      if (d.current && c.current) {
        let p = d.current, v = c.current, x, S = new ResizeObserver(() => {
          x = requestAnimationFrame(() => {
            let E = p.offsetHeight;
            v.style.setProperty("--cmdk-list-height", E.toFixed(1) + "px");
          });
        });
        return S.observe(p), () => {
          cancelAnimationFrame(x), S.unobserve(p);
        };
      }
    }, []), g.createElement(ya.div, {
      ref: ga(c, n),
      ...i,
      "cmdk-list": "",
      role: "listbox",
      tabIndex: -1,
      "aria-activedescendant": f,
      "aria-label": o,
      id: h.listId
    }, yc(l, (p) => g.createElement("div", {
      ref: ga(d, h.listInnerRef),
      "cmdk-list-sizer": ""
    }, p)));
  }), Nk = g.forwardRef((l, n) => {
    let { open: a, onOpenChange: o, overlayClassName: i, contentClassName: c, container: d, ...f } = l;
    return g.createElement(fk, {
      open: a,
      onOpenChange: o
    }, g.createElement(hk, {
      container: d
    }, g.createElement(mk, {
      "cmdk-overlay": "",
      className: i
    }), g.createElement(gk, {
      "aria-label": l.label,
      "cmdk-dialog": "",
      className: c
    }, g.createElement(z1, {
      ref: n,
      ...f
    }))));
  }), Tk = g.forwardRef((l, n) => pa((a) => a.filtered.count === 0) ? g.createElement(ya.div, {
    ref: n,
    ...l,
    "cmdk-empty": "",
    role: "presentation"
  }) : null), Ok = g.forwardRef((l, n) => {
    let { progress: a, children: o, label: i = "Loading...", ...c } = l;
    return g.createElement(ya.div, {
      ref: n,
      ...c,
      "cmdk-loading": "",
      role: "progressbar",
      "aria-valuenow": a,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-label": i
    }, yc(l, (d) => g.createElement("div", {
      "aria-hidden": true
    }, d)));
  }), Po = Object.assign(z1, {
    List: Ak,
    Item: Mk,
    Input: Rk,
    Group: jk,
    Separator: Lk,
    Dialog: Nk,
    Empty: Tk,
    Loading: Ok
  });
  function Ik(l, n) {
    let a = l.nextElementSibling;
    for (; a; ) {
      if (a.matches(n)) return a;
      a = a.nextElementSibling;
    }
  }
  function Dk(l, n) {
    let a = l.previousElementSibling;
    for (; a; ) {
      if (a.matches(n)) return a;
      a = a.previousElementSibling;
    }
  }
  function H1(l) {
    let n = g.useRef(l);
    return qa(() => {
      n.current = l;
    }), n;
  }
  var qa = typeof window > "u" ? g.useEffect : g.useLayoutEffect;
  function Br(l) {
    let n = g.useRef();
    return n.current === void 0 && (n.current = l()), n;
  }
  function pa(l) {
    let n = mh(), a = () => l(n.snapshot());
    return g.useSyncExternalStore(n.subscribe, a, a);
  }
  function Y1(l, n, a, o = []) {
    let i = g.useRef(), c = ps();
    return qa(() => {
      var d;
      let f = (() => {
        var p;
        for (let v of a) {
          if (typeof v == "string") return v.trim();
          if (typeof v == "object" && "current" in v) return v.current ? (p = v.current.textContent) == null ? void 0 : p.trim() : i.current;
        }
      })(), h = o.map((p) => p.trim());
      c.value(l, f, h), (d = n.current) == null || d.setAttribute(Yr, f), i.current = f;
    }), i;
  }
  var zk = () => {
    let [l, n] = g.useState(), a = Br(() => /* @__PURE__ */ new Map());
    return qa(() => {
      a.current.forEach((o) => o()), a.current = /* @__PURE__ */ new Map();
    }, [
      l
    ]), (o, i) => {
      a.current.set(o, i), n({});
    };
  };
  function Hk(l) {
    let n = l.type;
    return typeof n == "function" ? n(l.props) : "render" in n ? n.render(l.props) : l;
  }
  function yc({ asChild: l, children: n }, a) {
    return l && g.isValidElement(n) ? g.cloneElement(Hk(n), {
      ref: n.ref
    }, a(n.props.children)) : a(n);
  }
  var Yk = {
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
  const is = St()(eh((l) => ({
    isMinimized: true,
    toggle: () => l((n) => ({
      isMinimized: !n.isMinimized
    }))
  }), {
    name: "rosette-minimap",
    partialize: (l) => ({
      isMinimized: l.isMinimized
    })
  })), gh = St()((l) => ({
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
  })), ph = St()((l) => ({
    isOpen: false,
    open: () => l({
      isOpen: true
    }),
    close: () => l({
      isOpen: false
    })
  })), B1 = St()((l) => ({
    isOpen: false,
    layerAreas: [],
    totalArea: 0,
    cellName: "",
    open: () => {
      const n = Se.getState().library, a = he.getState().activeCell;
      if (!n || !a) return;
      const o = n.get_area_by_layer(), i = ve.getState().layers, c = /* @__PURE__ */ new Map();
      for (const h of i.values()) c.set(`${h.layerNumber}:${h.datatype}`, {
        name: h.name,
        color: h.color
      });
      const d = [];
      let f = 0;
      for (let h = 0; h < o.length; h += 3) {
        const p = o[h], v = o[h + 1], x = o[h + 2], S = `${p}:${v}`, E = c.get(S);
        d.push({
          layerNumber: p,
          datatype: v,
          area: x,
          name: (E == null ? void 0 : E.name) ?? `Layer ${p}`,
          color: (E == null ? void 0 : E.color) ?? "#888888"
        }), f += x;
      }
      l({
        isOpen: true,
        layerAreas: d,
        totalArea: f,
        cellName: a
      });
    },
    close: () => l({
      isOpen: false
    })
  })), Bk = "image/png,image/jpeg,image/svg+xml,image/webp,image/gif,image/bmp";
  function Xk(l) {
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
  function Uk(l) {
    return l.replace(/\\/g, "/").split("/").pop() ?? l;
  }
  function X1(l) {
    return new Promise((n, a) => {
      const o = new Image();
      o.onload = () => n({
        naturalWidth: o.naturalWidth,
        naturalHeight: o.naturalHeight
      }), o.onerror = () => a(new Error("Failed to decode image")), o.src = l;
    });
  }
  function $k() {
    return new Promise((l) => {
      const n = document.createElement("input");
      n.type = "file", n.accept = Bk, n.style.display = "none", n.addEventListener("change", async () => {
        var _a;
        const a = (_a = n.files) == null ? void 0 : _a[0];
        if (!a) {
          l(null);
          return;
        }
        const o = URL.createObjectURL(a);
        try {
          const { naturalWidth: i, naturalHeight: c } = await X1(o);
          l({
            url: o,
            filename: a.name,
            naturalWidth: i,
            naturalHeight: c
          });
        } catch {
          URL.revokeObjectURL(o), l(null);
        }
      }), n.addEventListener("cancel", () => l(null)), document.body.appendChild(n), n.click(), document.body.removeChild(n);
    });
  }
  async function Vk() {
    const l = await K0();
    if (!l) return null;
    const n = Uk(l), a = Xk(n), o = await F0(l), i = new Blob([
      o.buffer
    ], {
      type: a
    }), c = URL.createObjectURL(i);
    try {
      const { naturalWidth: d, naturalHeight: f } = await X1(c);
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
  function qk(l) {
    const { zoom: n, offset: a } = Ye.getState(), o = document.getElementById("rosette-canvas");
    if (!o) return;
    const i = o.getBoundingClientRect(), c = (i.width / 2 - a.x) / n, d = (i.height / 2 - a.y) / n, h = i.width / n * 0.2, p = l.naturalHeight / l.naturalWidth, v = h * p, x = c - h / 2, S = d - v / 2, E = {
      id: crypto.randomUUID(),
      url: l.url,
      filename: l.filename,
      x,
      y: S,
      width: h,
      height: v,
      naturalWidth: l.naturalWidth,
      naturalHeight: l.naturalHeight,
      lockAspectRatio: true,
      cellName: he.getState().activeCell ?? ""
    }, { library: k, renderer: b } = Se.getState();
    if (k && b) {
      const C = new JS(E);
      fe.getState().execute(C, {
        library: k,
        renderer: b
      });
    }
  }
  async function Gk() {
    const l = Un ? await Vk() : await $k();
    l && qk(l);
  }
  function Pk() {
    const { setThemeSetting: l } = me.getState(), { close: n } = un.getState(), { setTool: a } = qt.getState();
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
          const { handleNewFile: i } = await wt(async () => {
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
              Ie.mod
            ],
            key: "O"
          },
          action: async () => {
            n();
            const { emitOpenFile: i } = await wt(async () => {
              const { emitOpenFile: f } = await Promise.resolve().then(() => Qn);
              return {
                emitOpenFile: f
              };
            }, void 0, import.meta.url), { pickGdsFile: c } = await wt(async () => {
              const { pickGdsFile: f } = await Promise.resolve().then(() => W0);
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
              Ie.mod
            ],
            key: "S"
          },
          action: async () => {
            n();
            const { handleSave: i } = await wt(async () => {
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
              Ie.mod,
              "\u21E7"
            ],
            key: "S"
          },
          action: async () => {
            n();
            const { handleSave: i } = await wt(async () => {
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
          const { handleScreenshot: i } = await wt(async () => {
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
          const { handleScreenshotToClipboard: i } = await wt(async () => {
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
          is.getState().toggle(), n();
        },
        searchableText: "Toggle minimap show hide overview map"
      },
      {
        id: "view-toggle-grid",
        type: "command",
        name: "View: Toggle Grid",
        action: () => {
          me.getState().toggleGrid(), n();
        },
        searchableText: "Toggle grid show hide dots points"
      },
      {
        id: "view-toggle-zen-mode",
        type: "command",
        name: "View: Toggle Zen Mode",
        action: () => {
          me.getState().toggleZenMode(), n();
        },
        searchableText: "Toggle zen mode focus distraction free hide toolbar explorer sidebar panels"
      },
      {
        id: "view-toggle-right-click-mode",
        type: "command",
        name: `View: Toggle Right Click Mode (${me.getState().rightClickMode === "context-menu" ? "Menu" : "Zoom"})`,
        action: () => {
          me.getState().toggleRightClickMode(), n();
        },
        searchableText: "Toggle right click mode context menu zoom out canvas mouse button"
      },
      {
        id: "view-show-layers",
        type: "command",
        name: "View: Show Layers Panel",
        action: () => {
          me.getState().setSidebarTab("layers"), n();
        },
        searchableText: "Show layers panel sidebar switch tab"
      },
      {
        id: "view-show-inspector",
        type: "command",
        name: "View: Show Inspector Panel",
        action: () => {
          me.getState().setSidebarTab("inspector"), n();
        },
        searchableText: "Show inspector panel sidebar switch tab properties"
      },
      {
        id: "view-focus-explorer",
        type: "command",
        name: "View: Focus Explorer",
        shortcut: {
          modifiers: [
            Ie.shift
          ],
          key: "E"
        },
        action: () => {
          me.getState().explorerCollapsed && me.getState().toggleExplorerCollapsed(), he.getState().setFocused(true), n();
        },
        searchableText: "Focus explorer panel cells tree navigate keyboard"
      },
      {
        id: "view-focus-layers",
        type: "command",
        name: "View: Focus Layers",
        shortcut: {
          modifiers: [
            Ie.shift
          ],
          key: "L"
        },
        action: () => {
          me.getState().setSidebarTab("layers"), ve.getState().setFocused(true), n();
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
            Ye.getState().zoomAt(oc, c.width / 2, c.height / 2);
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
            Ye.getState().zoomAt(sc, c.width / 2, c.height / 2);
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
          us(), n();
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
          const i = document.getElementById("rosette-canvas"), { library: c } = Se.getState();
          if (i && c) {
            const d = ue.getState().selectedIds;
            if (d.size > 0) {
              const f = c.get_bounds_for_ids([
                ...d
              ]), h = f ? {
                minX: f[0],
                minY: f[1],
                maxX: f[2],
                maxY: f[3]
              } : null, p = ih(d);
              let v;
              h && p ? v = {
                minX: Math.min(h.minX, p.minX),
                minY: Math.min(h.minY, p.minY),
                maxX: Math.max(h.maxX, p.maxX),
                maxY: Math.max(h.maxY, p.maxY)
              } : v = h ?? p;
              const x = zl(i);
              Ye.getState().zoomToSelected(v, x.width, x.height, x.screenCenter);
            }
          }
          n();
        },
        searchableText: "Zoom to fit selection selected elements"
      },
      {
        id: "view-go-to",
        type: "command",
        name: "View: Go to Coordinate",
        action: () => {
          ph.getState().open(), n();
        },
        searchableText: "Go to coordinate position navigate pan center xy jump move"
      },
      {
        id: "view-calculate-area",
        type: "command",
        name: "View: Calculate Area",
        action: () => {
          B1.getState().open(), n();
        },
        searchableText: "Calculate area size surface layer polygon cell measure coverage"
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
        id: "ruler-clear-all",
        type: "command",
        name: "Ruler: Clear All",
        action: () => {
          const { rulers: i } = Oe.getState();
          if (i.size === 0) {
            n();
            return;
          }
          const { library: c, renderer: d } = Se.getState();
          if (!c || !d) {
            n();
            return;
          }
          const f = new dc([
            ...i.keys()
          ]);
          fe.getState().execute(f, {
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
          const { library: i, renderer: c } = Se.getState(), d = document.getElementById("rosette-canvas");
          i && c && d && _0(i, c, d), n();
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
          const { library: i, renderer: c } = Se.getState(), d = document.getElementById("rosette-canvas");
          i && c && d && M0(i, c, d), n();
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
          const { library: i, renderer: c } = Se.getState(), d = document.getElementById("rosette-canvas");
          i && c && d && L0(i, c, d), n();
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
          const { library: i, renderer: c } = Se.getState(), d = document.getElementById("rosette-canvas");
          i && c && d && j0(i, c, d), n();
        },
        searchableText: "Add text create label annotation place"
      },
      {
        id: "insert-image",
        type: "command",
        name: "Insert: Image",
        action: () => {
          Gk(), n();
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
          const { library: i, renderer: c } = Se.getState();
          if (i && c) {
            const { canUndo: d, undo: f } = fe.getState();
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
            Ie.mod,
            Ie.shift
          ],
          key: "Z"
        },
        action: () => {
          const { library: i, renderer: c } = Se.getState();
          if (i && c) {
            const { canRedo: d, redo: f } = fe.getState();
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
            Ie.mod
          ],
          key: "C"
        },
        action: () => {
          const { library: i } = Se.getState(), { selectedIds: c } = ue.getState();
          if (!i || c.size === 0) {
            n();
            return;
          }
          const d = Jn(i, c);
          jn.getState().copy(d), n();
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
          const { library: i, renderer: c } = Se.getState();
          if (!i || !c || !jn.getState().hasContent) {
            n();
            return;
          }
          const d = new ts();
          fe.getState().execute(d, {
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
            Ie.mod
          ],
          key: "B"
        },
        action: () => {
          const { library: i, renderer: c } = Se.getState(), { selectedIds: d } = ue.getState();
          if (!i || !c || d.size === 0) {
            n();
            return;
          }
          const f = new ns([
            ...d
          ]);
          fe.getState().execute(f, {
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
          const { selectedIds: i } = ue.getState();
          if (i.size === 0) {
            n();
            return;
          }
          gh.getState().open([
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
          key: Ie.backspace
        },
        action: () => {
          const { library: i, renderer: c } = Se.getState(), { selectedIds: d } = ue.getState();
          if (!i || !c || d.size === 0) {
            n();
            return;
          }
          const f = new uc([
            ...d
          ]);
          fe.getState().execute(f, {
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
          ue.getState().selectedIds.size > 0 && me.getState().requestInspectorFocus(), n();
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
          const { library: i } = Se.getState();
          if (!i) {
            n();
            return;
          }
          const c = [
            ...i.get_all_ids(),
            ...ls()
          ];
          ue.getState().selectAll(c), n();
        },
        searchableText: "Select all elements"
      },
      {
        id: "edit-text-to-polygons",
        type: "command",
        name: "Edit: Convert Text to Polygons",
        action: () => {
          const { selectedIds: i } = ue.getState(), { library: c, renderer: d } = Se.getState();
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
          const h = new A0(f);
          fe.getState().execute(h, {
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
          const { library: i, renderer: c } = Se.getState();
          if (!i || !c) {
            n();
            return;
          }
          const d = new w0();
          fe.getState().execute(d, {
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
          const { library: i, renderer: c } = Se.getState(), { activeLayerId: d, layers: f } = ve.getState();
          if (!i || !c || f.size <= 1) {
            n();
            return;
          }
          const h = new ah(d);
          fe.getState().execute(h, {
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
          ve.getState().setExpandedLayerId(i), me.getState().setSidebarTab("layers"), n();
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
          const { library: i, renderer: c } = Se.getState();
          if (!i || !c) {
            n();
            return;
          }
          const d = nh(), f = new rh(d);
          fe.getState().execute(f, {
            library: i,
            renderer: c
          }), me.getState().explorerCollapsed && me.getState().toggleExplorerCollapsed(), he.getState().setActiveCell(d), he.getState().setEditingCellName(d), n();
        },
        searchableText: "Add new cell create"
      },
      {
        id: "cell-delete",
        type: "cell",
        name: "Cell: Delete Active",
        action: () => {
          const { library: i, renderer: c } = Se.getState(), { activeCell: d, cells: f } = he.getState();
          if (!i || !c || !d || f.length <= 1) {
            n();
            return;
          }
          const h = new oh(d);
          fe.getState().execute(h, {
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
          const { activeCell: i } = he.getState();
          i && he.getState().setEditingCellName(i), n();
        },
        searchableText: "Rename active cell"
      },
      {
        id: "cell-change-origin",
        type: "cell",
        name: "Cell: Change Origin",
        action: () => {
          ue.getState().clearSelection(), me.getState().requestInspectorFocusField("X"), n();
        },
        searchableText: "Cell change origin position offset set move"
      },
      {
        id: "cell-flatten",
        type: "cell",
        name: "Cell: Flatten Active",
        action: () => {
          const { library: i, renderer: c } = Se.getState(), { activeCell: d, cellTree: f } = he.getState();
          if (!i || !c || !d) {
            n();
            return;
          }
          const h = (v) => {
            if (!v) return false;
            for (const x of v) {
              if (x.name === d) return x.children.length > 0;
              if (h(x.children)) return true;
            }
            return false;
          };
          if (!h(f)) {
            n();
            return;
          }
          const p = new C0(d);
          fe.getState().execute(p, {
            library: i,
            renderer: c
          }), n();
        },
        searchableText: "Flatten cell inline expand resolve references hierarchy instances"
      },
      {
        id: "cell-toggle-visibility",
        type: "cell",
        name: "Cell: Toggle Active Visibility",
        action: () => {
          const { activeCell: i } = he.getState();
          i && he.getState().toggleCellVisibility(i), n();
        },
        searchableText: "Toggle cell visibility hide show active"
      },
      {
        id: "cell-show-all",
        type: "cell",
        name: "Cell: Show All",
        action: () => {
          he.getState().showAllCells(), n();
        },
        searchableText: "Show all cells visible unhide"
      },
      {
        id: "cell-hide-all",
        type: "cell",
        name: "Cell: Hide All",
        action: () => {
          he.getState().hideAllCells(), n();
        },
        searchableText: "Hide all cells invisible"
      },
      {
        id: "cell-toggle-flat-list",
        type: "cell",
        name: "Cell: Toggle Flat List",
        action: () => {
          const { cellListMode: i, setCellListMode: c } = he.getState();
          c(i === "flat" ? "nested" : "flat"), n();
        },
        searchableText: "Toggle flat list nested tree hierarchy cell explorer view"
      },
      ...he.getState().cells.map((i) => ({
        id: `cell-activate-${i}`,
        type: "cell",
        name: `Cell: Set Active: ${i}`,
        action: () => {
          he.getState().setActiveCell(i), n();
        },
        searchableText: `Cell set active ${i} switch`
      })),
      ...he.getState().cells.filter((i) => i !== he.getState().activeCell).map((i) => ({
        id: `cell-instance-${i}`,
        type: "cell",
        name: `Cell: Add Instance: ${i}`,
        action: () => {
          const { library: c, renderer: d } = Se.getState(), f = he.getState().activeCell;
          if (!c || !d || !f) {
            n();
            return;
          }
          if (!c.can_instance_cell(f, i)) {
            n();
            return;
          }
          const { zoom: h, offset: p } = Ye.getState(), v = window.innerWidth / 2, x = window.innerHeight / 2, S = (v - p.x) / h, E = (x - p.y) / h, k = new k0(i, S, E);
          fe.getState().execute(k, {
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
          const { hierarchyLevelLimit: i, maxTreeDepth: c, setHierarchyLevelLimit: d } = he.getState(), f = i === 1 / 0 ? c : i;
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
          const { hierarchyLevelLimit: i, maxTreeDepth: c, setHierarchyLevelLimit: d } = he.getState(), f = i === 1 / 0 ? c : i;
          f < c ? d(f + 1) : d(1 / 0), n();
        },
        searchableText: "Hierarchy increase level up more deeper depth"
      },
      {
        id: "hierarchy-set-max-level",
        type: "command",
        name: "Hierarchy: Show All Levels",
        action: () => {
          const { setHierarchyLevelLimit: i } = he.getState();
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
      ...Fk(n),
      ...Qk(n)
    ];
  }
  const Zk = [
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
  ], Kk = [
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
  function Fk(l) {
    return Kk.map((n) => ({
      id: `boolean-${n.id}`,
      type: "command",
      name: `Boolean: ${n.name}`,
      action: () => {
        const { library: a, renderer: o } = Se.getState();
        if (!a || !o) {
          l();
          return;
        }
        const { selectedIds: i, lastSelectedId: c } = ue.getState();
        if (i.size < 2) {
          l();
          return;
        }
        const d = [
          ...i
        ], f = c ?? d[0], h = new T0(d, n.id, f);
        fe.getState().execute(h, {
          library: a,
          renderer: o
        }), l();
      },
      searchableText: n.search
    }));
  }
  function Qk(l) {
    return Zk.map((n) => ({
      id: `align-${n.id}`,
      type: "command",
      name: `Align: ${n.name}`,
      action: () => {
        const { library: a, renderer: o } = Se.getState();
        if (!a || !o) {
          l();
          return;
        }
        const { selectedIds: i, lastSelectedId: c } = ue.getState();
        if (i.size === 0) {
          l();
          return;
        }
        if (n.id !== "origin-align" && i.size < 2) {
          l();
          return;
        }
        const d = new N0(new Set(i), c, n.id);
        fe.getState().execute(d, {
          library: a,
          renderer: o
        }), l();
      },
      searchableText: n.search
    }));
  }
  function Wk({ shortcut: l }) {
    var _a;
    const a = me((i) => i.theme) === "dark", o = B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", a ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10");
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
              className: B("px-1 text-[11px]", a ? "text-white/50" : "text-gray-500"),
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
  function Jk({ item: l }) {
    const a = me((o) => o.theme) === "dark";
    return y.jsxs(Po.Item, {
      value: l.searchableText,
      onSelect: l.action,
      className: B("flex cursor-pointer items-center justify-between rounded-lg px-3 py-2", a ? "text-white/80 aria-selected:bg-[rgb(54,54,54)] aria-selected:text-white" : "text-gray-700 aria-selected:bg-[rgb(217,217,217)] aria-selected:text-gray-900"),
      children: [
        y.jsx("span", {
          className: "text-sm",
          children: l.name
        }),
        l.color && y.jsx("span", {
          className: B("inline-block h-3.5 w-3.5 shrink-0 rounded border", a ? "border-white/15" : "border-black/15"),
          style: {
            backgroundColor: l.color
          }
        }),
        l.shortcut && y.jsx(Wk, {
          shortcut: l.shortcut
        })
      ]
    });
  }
  function Mb() {
    const n = me((x) => x.theme) === "dark", a = un((x) => x.isOpen), o = un((x) => x.close);
    Hl("command-palette", a);
    const [i, c] = g.useState(""), d = g.useRef(null), f = g.useMemo(() => Pk(), [
      a
    ]), h = g.useMemo(() => {
      const x = i.toLowerCase();
      return f.filter((S) => S.searchableText.toLowerCase().includes(x));
    }, [
      f,
      i
    ]), p = g.useMemo(() => [
      ...h
    ].sort((x, S) => x.name.localeCompare(S.name)), [
      h
    ]), v = g.useCallback((x) => {
      const S = x.target;
      S instanceof Node && d.current && !d.current.contains(S) && o();
    }, [
      o
    ]);
    return g.useEffect(() => {
      if (!a) {
        c("");
        return;
      }
      return c(un.getState().initialSearch), document.addEventListener("mousedown", v), () => {
        document.removeEventListener("mousedown", v);
      };
    }, [
      a,
      v
    ]), a ? y.jsx("div", {
      className: "fixed inset-0 z-[200]",
      children: y.jsx(Po, {
        className: "fixed inset-0 flex items-start justify-center px-4 pt-[min(15vh,120px)]",
        shouldFilter: false,
        loop: true,
        label: "Command Menu",
        onKeyDown: (x) => {
          x.key === "Escape" && (x.preventDefault(), o());
        },
        children: y.jsxs("div", {
          ref: d,
          className: B("w-full max-w-[560px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          children: [
            y.jsx(Po.Input, {
              value: i,
              onValueChange: c,
              placeholder: "Type a command or search...",
              className: B("w-full border-b bg-transparent px-4 py-3 text-sm outline-none", n ? "border-white/10 text-white/90 placeholder:text-white/50" : "border-black/10 text-gray-900 placeholder:text-gray-500"),
              autoFocus: true
            }),
            y.jsxs(Po.List, {
              className: "max-h-[320px] overflow-y-auto p-1",
              onWheel: (x) => x.stopPropagation(),
              children: [
                y.jsx(Po.Empty, {
                  className: B("px-3 py-2 text-sm", n ? "text-white/50" : "text-gray-500"),
                  children: "No matching commands"
                }),
                p.map((x) => y.jsx(Jk, {
                  item: x
                }, x.id))
              ]
            })
          ]
        })
      })
    }) : null;
  }
  const dt = Xr.createContext({});
  var e_ = Object.defineProperty, jb = Object.getOwnPropertySymbols, t_ = Object.prototype.hasOwnProperty, n_ = Object.prototype.propertyIsEnumerable, Lb = (l, n, a) => n in l ? e_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Wd = (l, n) => {
    for (var a in n || (n = {})) t_.call(n, a) && Lb(l, a, n[a]);
    if (jb) for (var a of jb(n)) n_.call(n, a) && Lb(l, a, n[a]);
    return l;
  };
  const l_ = (l, n) => {
    const a = g.useContext(dt), o = Wd(Wd({}, a), l);
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
      d: "M12 22L12 2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M19 16H5C3.89543 16 3 15.1046 3 14L3 10C3 8.89543 3.89543 8 5 8H19C20.1046 8 21 8.89543 21 10V14C21 15.1046 20.1046 16 19 16Z",
      stroke: "currentColor"
    }));
  }, a_ = g.forwardRef(l_);
  var r_ = a_, o_ = Object.defineProperty, Rb = Object.getOwnPropertySymbols, s_ = Object.prototype.hasOwnProperty, i_ = Object.prototype.propertyIsEnumerable, Ab = (l, n, a) => n in l ? o_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Jd = (l, n) => {
    for (var a in n || (n = {})) s_.call(n, a) && Ab(l, a, n[a]);
    if (Rb) for (var a of Rb(n)) i_.call(n, a) && Ab(l, a, n[a]);
    return l;
  };
  const c_ = (l, n) => {
    const a = g.useContext(dt), o = Jd(Jd({}, a), l);
    return g.createElement("svg", Jd({
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
  }, u_ = g.forwardRef(c_);
  var d_ = u_, f_ = Object.defineProperty, Nb = Object.getOwnPropertySymbols, h_ = Object.prototype.hasOwnProperty, m_ = Object.prototype.propertyIsEnumerable, Tb = (l, n, a) => n in l ? f_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, ef = (l, n) => {
    for (var a in n || (n = {})) h_.call(n, a) && Tb(l, a, n[a]);
    if (Nb) for (var a of Nb(n)) m_.call(n, a) && Tb(l, a, n[a]);
    return l;
  };
  const g_ = (l, n) => {
    const a = g.useContext(dt), o = ef(ef({}, a), l);
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
  }, p_ = g.forwardRef(g_);
  var y_ = p_, b_ = Object.defineProperty, Ob = Object.getOwnPropertySymbols, v_ = Object.prototype.hasOwnProperty, x_ = Object.prototype.propertyIsEnumerable, Ib = (l, n, a) => n in l ? b_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, tf = (l, n) => {
    for (var a in n || (n = {})) v_.call(n, a) && Ib(l, a, n[a]);
    if (Ob) for (var a of Ob(n)) x_.call(n, a) && Ib(l, a, n[a]);
    return l;
  };
  const w_ = (l, n) => {
    const a = g.useContext(dt), o = tf(tf({}, a), l);
    return g.createElement("svg", tf({
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
  }, S_ = g.forwardRef(w_);
  var C_ = S_, E_ = Object.defineProperty, Db = Object.getOwnPropertySymbols, k_ = Object.prototype.hasOwnProperty, __ = Object.prototype.propertyIsEnumerable, zb = (l, n, a) => n in l ? E_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, nf = (l, n) => {
    for (var a in n || (n = {})) k_.call(n, a) && zb(l, a, n[a]);
    if (Db) for (var a of Db(n)) __.call(n, a) && zb(l, a, n[a]);
    return l;
  };
  const M_ = (l, n) => {
    const a = g.useContext(dt), o = nf(nf({}, a), l);
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
      d: "M22 21L2 21",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 15V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V15C16 16.1046 15.1046 17 14 17H10C8.89543 17 8 16.1046 8 15Z",
      stroke: "currentColor"
    }));
  }, j_ = g.forwardRef(M_);
  var L_ = j_, R_ = Object.defineProperty, Hb = Object.getOwnPropertySymbols, A_ = Object.prototype.hasOwnProperty, N_ = Object.prototype.propertyIsEnumerable, Yb = (l, n, a) => n in l ? R_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, lf = (l, n) => {
    for (var a in n || (n = {})) A_.call(n, a) && Yb(l, a, n[a]);
    if (Hb) for (var a of Hb(n)) N_.call(n, a) && Yb(l, a, n[a]);
    return l;
  };
  const T_ = (l, n) => {
    const a = g.useContext(dt), o = lf(lf({}, a), l);
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
      d: "M3 22L3 2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M19 16H9C7.89543 16 7 15.1046 7 14V10C7 8.89543 7.89543 8 9 8H19C20.1046 8 21 8.89543 21 10V14C21 15.1046 20.1046 16 19 16Z",
      stroke: "currentColor"
    }));
  }, O_ = g.forwardRef(T_);
  var I_ = O_, D_ = Object.defineProperty, Bb = Object.getOwnPropertySymbols, z_ = Object.prototype.hasOwnProperty, H_ = Object.prototype.propertyIsEnumerable, Xb = (l, n, a) => n in l ? D_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, af = (l, n) => {
    for (var a in n || (n = {})) z_.call(n, a) && Xb(l, a, n[a]);
    if (Bb) for (var a of Bb(n)) H_.call(n, a) && Xb(l, a, n[a]);
    return l;
  };
  const Y_ = (l, n) => {
    const a = g.useContext(dt), o = af(af({}, a), l);
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
      d: "M21 22V2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M15 16H5C3.89543 16 3 15.1046 3 14L3 10C3 8.89543 3.89543 8 5 8H15C16.1046 8 17 8.89543 17 10V14C17 15.1046 16.1046 16 15 16Z",
      stroke: "currentColor"
    }));
  }, B_ = g.forwardRef(Y_);
  var X_ = B_, U_ = Object.defineProperty, Ub = Object.getOwnPropertySymbols, $_ = Object.prototype.hasOwnProperty, V_ = Object.prototype.propertyIsEnumerable, $b = (l, n, a) => n in l ? U_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, rf = (l, n) => {
    for (var a in n || (n = {})) $_.call(n, a) && $b(l, a, n[a]);
    if (Ub) for (var a of Ub(n)) V_.call(n, a) && $b(l, a, n[a]);
    return l;
  };
  const q_ = (l, n) => {
    const a = g.useContext(dt), o = rf(rf({}, a), l);
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
      d: "M22 3L2 3",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 19V9C8 7.89543 8.89543 7 10 7H14C15.1046 7 16 7.89543 16 9V19C16 20.1046 15.1046 21 14 21H10C8.89543 21 8 20.1046 8 19Z",
      stroke: "currentColor"
    }));
  }, G_ = g.forwardRef(q_);
  var P_ = G_, Z_ = Object.defineProperty, Vb = Object.getOwnPropertySymbols, K_ = Object.prototype.hasOwnProperty, F_ = Object.prototype.propertyIsEnumerable, qb = (l, n, a) => n in l ? Z_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, of = (l, n) => {
    for (var a in n || (n = {})) K_.call(n, a) && qb(l, a, n[a]);
    if (Vb) for (var a of Vb(n)) F_.call(n, a) && qb(l, a, n[a]);
    return l;
  };
  const Q_ = (l, n) => {
    const a = g.useContext(dt), o = of(of({}, a), l);
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
  }, W_ = g.forwardRef(Q_);
  var J_ = W_, eM = Object.defineProperty, Gb = Object.getOwnPropertySymbols, tM = Object.prototype.hasOwnProperty, nM = Object.prototype.propertyIsEnumerable, Pb = (l, n, a) => n in l ? eM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, sf = (l, n) => {
    for (var a in n || (n = {})) tM.call(n, a) && Pb(l, a, n[a]);
    if (Gb) for (var a of Gb(n)) nM.call(n, a) && Pb(l, a, n[a]);
    return l;
  };
  const lM = (l, n) => {
    const a = g.useContext(dt), o = sf(sf({}, a), l);
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
  }, aM = g.forwardRef(lM);
  var yh = aM, rM = Object.defineProperty, Zb = Object.getOwnPropertySymbols, oM = Object.prototype.hasOwnProperty, sM = Object.prototype.propertyIsEnumerable, Kb = (l, n, a) => n in l ? rM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, cf = (l, n) => {
    for (var a in n || (n = {})) oM.call(n, a) && Kb(l, a, n[a]);
    if (Zb) for (var a of Zb(n)) sM.call(n, a) && Kb(l, a, n[a]);
    return l;
  };
  const iM = (l, n) => {
    const a = g.useContext(dt), o = cf(cf({}, a), l);
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
      d: "M3 20C11 20 21 4 21 4",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, cM = g.forwardRef(iM);
  var U1 = cM, uM = Object.defineProperty, Fb = Object.getOwnPropertySymbols, dM = Object.prototype.hasOwnProperty, fM = Object.prototype.propertyIsEnumerable, Qb = (l, n, a) => n in l ? uM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, uf = (l, n) => {
    for (var a in n || (n = {})) dM.call(n, a) && Qb(l, a, n[a]);
    if (Fb) for (var a of Fb(n)) fM.call(n, a) && Qb(l, a, n[a]);
    return l;
  };
  const hM = (l, n) => {
    const a = g.useContext(dt), o = uf(uf({}, a), l);
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
  }, mM = g.forwardRef(hM);
  var gM = mM, pM = Object.defineProperty, Wb = Object.getOwnPropertySymbols, yM = Object.prototype.hasOwnProperty, bM = Object.prototype.propertyIsEnumerable, Jb = (l, n, a) => n in l ? pM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, df = (l, n) => {
    for (var a in n || (n = {})) yM.call(n, a) && Jb(l, a, n[a]);
    if (Wb) for (var a of Wb(n)) bM.call(n, a) && Jb(l, a, n[a]);
    return l;
  };
  const vM = (l, n) => {
    const a = g.useContext(dt), o = df(df({}, a), l);
    return g.createElement("svg", df({
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
  }, xM = g.forwardRef(vM);
  var wM = xM, SM = Object.defineProperty, ev = Object.getOwnPropertySymbols, CM = Object.prototype.hasOwnProperty, EM = Object.prototype.propertyIsEnumerable, tv = (l, n, a) => n in l ? SM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, ff = (l, n) => {
    for (var a in n || (n = {})) CM.call(n, a) && tv(l, a, n[a]);
    if (ev) for (var a of ev(n)) EM.call(n, a) && tv(l, a, n[a]);
    return l;
  };
  const kM = (l, n) => {
    const a = g.useContext(dt), o = ff(ff({}, a), l);
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
  }, _M = g.forwardRef(kM);
  var MM = _M, jM = Object.defineProperty, nv = Object.getOwnPropertySymbols, LM = Object.prototype.hasOwnProperty, RM = Object.prototype.propertyIsEnumerable, lv = (l, n, a) => n in l ? jM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, hf = (l, n) => {
    for (var a in n || (n = {})) LM.call(n, a) && lv(l, a, n[a]);
    if (nv) for (var a of nv(n)) RM.call(n, a) && lv(l, a, n[a]);
    return l;
  };
  const AM = (l, n) => {
    const a = g.useContext(dt), o = hf(hf({}, a), l);
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
  }, NM = g.forwardRef(AM);
  var TM = NM, OM = Object.defineProperty, av = Object.getOwnPropertySymbols, IM = Object.prototype.hasOwnProperty, DM = Object.prototype.propertyIsEnumerable, rv = (l, n, a) => n in l ? OM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, mf = (l, n) => {
    for (var a in n || (n = {})) IM.call(n, a) && rv(l, a, n[a]);
    if (av) for (var a of av(n)) DM.call(n, a) && rv(l, a, n[a]);
    return l;
  };
  const zM = (l, n) => {
    const a = g.useContext(dt), o = mf(mf({}, a), l);
    return g.createElement("svg", mf({
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
  }, HM = g.forwardRef(zM);
  var YM = HM, BM = Object.defineProperty, ov = Object.getOwnPropertySymbols, XM = Object.prototype.hasOwnProperty, UM = Object.prototype.propertyIsEnumerable, sv = (l, n, a) => n in l ? BM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, gf = (l, n) => {
    for (var a in n || (n = {})) XM.call(n, a) && sv(l, a, n[a]);
    if (ov) for (var a of ov(n)) UM.call(n, a) && sv(l, a, n[a]);
    return l;
  };
  const $M = (l, n) => {
    const a = g.useContext(dt), o = gf(gf({}, a), l);
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
      d: "M9 6L15 12L9 18",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, VM = g.forwardRef($M);
  var $1 = VM, qM = Object.defineProperty, iv = Object.getOwnPropertySymbols, GM = Object.prototype.hasOwnProperty, PM = Object.prototype.propertyIsEnumerable, cv = (l, n, a) => n in l ? qM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, pf = (l, n) => {
    for (var a in n || (n = {})) GM.call(n, a) && cv(l, a, n[a]);
    if (iv) for (var a of iv(n)) PM.call(n, a) && cv(l, a, n[a]);
    return l;
  };
  const ZM = (l, n) => {
    const a = g.useContext(dt), o = pf(pf({}, a), l);
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
  }, KM = g.forwardRef(ZM);
  var FM = KM, QM = Object.defineProperty, uv = Object.getOwnPropertySymbols, WM = Object.prototype.hasOwnProperty, JM = Object.prototype.propertyIsEnumerable, dv = (l, n, a) => n in l ? QM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, yf = (l, n) => {
    for (var a in n || (n = {})) WM.call(n, a) && dv(l, a, n[a]);
    if (uv) for (var a of uv(n)) JM.call(n, a) && dv(l, a, n[a]);
    return l;
  };
  const e4 = (l, n) => {
    const a = g.useContext(dt), o = yf(yf({}, a), l);
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
      d: "M11.6473 2.25623C11.8576 2.10344 12.1424 2.10344 12.3527 2.25623L22.1089 9.34458C22.3192 9.49737 22.4072 9.76819 22.3269 10.0154L18.6003 21.4846C18.52 21.7318 18.2896 21.8992 18.0297 21.8992H5.97029C5.71035 21.8992 5.47998 21.7318 5.39965 21.4846L1.67309 10.0154C1.59276 9.76819 1.68076 9.49737 1.89105 9.34458L11.6473 2.25623Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }, t4 = g.forwardRef(e4);
  var n4 = t4, l4 = Object.defineProperty, fv = Object.getOwnPropertySymbols, a4 = Object.prototype.hasOwnProperty, r4 = Object.prototype.propertyIsEnumerable, hv = (l, n, a) => n in l ? l4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, bf = (l, n) => {
    for (var a in n || (n = {})) a4.call(n, a) && hv(l, a, n[a]);
    if (fv) for (var a of fv(n)) r4.call(n, a) && hv(l, a, n[a]);
    return l;
  };
  const o4 = (l, n) => {
    const a = g.useContext(dt), o = bf(bf({}, a), l);
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
  }, s4 = g.forwardRef(o4);
  var V1 = s4, i4 = Object.defineProperty, mv = Object.getOwnPropertySymbols, c4 = Object.prototype.hasOwnProperty, u4 = Object.prototype.propertyIsEnumerable, gv = (l, n, a) => n in l ? i4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, vf = (l, n) => {
    for (var a in n || (n = {})) c4.call(n, a) && gv(l, a, n[a]);
    if (mv) for (var a of mv(n)) u4.call(n, a) && gv(l, a, n[a]);
    return l;
  };
  const d4 = (l, n) => {
    const a = g.useContext(dt), o = vf(vf({}, a), l);
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
  }, f4 = g.forwardRef(d4);
  var h4 = f4, m4 = Object.defineProperty, pv = Object.getOwnPropertySymbols, g4 = Object.prototype.hasOwnProperty, p4 = Object.prototype.propertyIsEnumerable, yv = (l, n, a) => n in l ? m4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, xf = (l, n) => {
    for (var a in n || (n = {})) g4.call(n, a) && yv(l, a, n[a]);
    if (pv) for (var a of pv(n)) p4.call(n, a) && yv(l, a, n[a]);
    return l;
  };
  const y4 = (l, n) => {
    const a = g.useContext(dt), o = xf(xf({}, a), l);
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
  }, b4 = g.forwardRef(y4);
  var v4 = b4, x4 = Object.defineProperty, bv = Object.getOwnPropertySymbols, w4 = Object.prototype.hasOwnProperty, S4 = Object.prototype.propertyIsEnumerable, vv = (l, n, a) => n in l ? x4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, wf = (l, n) => {
    for (var a in n || (n = {})) w4.call(n, a) && vv(l, a, n[a]);
    if (bv) for (var a of bv(n)) S4.call(n, a) && vv(l, a, n[a]);
    return l;
  };
  const C4 = (l, n) => {
    const a = g.useContext(dt), o = wf(wf({}, a), l);
    return g.createElement("svg", wf({
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
  }, E4 = g.forwardRef(C4);
  var q1 = E4, k4 = Object.defineProperty, xv = Object.getOwnPropertySymbols, _4 = Object.prototype.hasOwnProperty, M4 = Object.prototype.propertyIsEnumerable, wv = (l, n, a) => n in l ? k4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Sf = (l, n) => {
    for (var a in n || (n = {})) _4.call(n, a) && wv(l, a, n[a]);
    if (xv) for (var a of xv(n)) M4.call(n, a) && wv(l, a, n[a]);
    return l;
  };
  const j4 = (l, n) => {
    const a = g.useContext(dt), o = Sf(Sf({}, a), l);
    return g.createElement("svg", Sf({
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
  }, L4 = g.forwardRef(j4);
  var G1 = L4, R4 = Object.defineProperty, Sv = Object.getOwnPropertySymbols, A4 = Object.prototype.hasOwnProperty, N4 = Object.prototype.propertyIsEnumerable, Cv = (l, n, a) => n in l ? R4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Cf = (l, n) => {
    for (var a in n || (n = {})) A4.call(n, a) && Cv(l, a, n[a]);
    if (Sv) for (var a of Sv(n)) N4.call(n, a) && Cv(l, a, n[a]);
    return l;
  };
  const T4 = (l, n) => {
    const a = g.useContext(dt), o = Cf(Cf({}, a), l);
    return g.createElement("svg", Cf({
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
  }, O4 = g.forwardRef(T4);
  var I4 = O4, D4 = Object.defineProperty, Ev = Object.getOwnPropertySymbols, z4 = Object.prototype.hasOwnProperty, H4 = Object.prototype.propertyIsEnumerable, kv = (l, n, a) => n in l ? D4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Ef = (l, n) => {
    for (var a in n || (n = {})) z4.call(n, a) && kv(l, a, n[a]);
    if (Ev) for (var a of Ev(n)) H4.call(n, a) && kv(l, a, n[a]);
    return l;
  };
  const Y4 = (l, n) => {
    const a = g.useContext(dt), o = Ef(Ef({}, a), l);
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
  }, B4 = g.forwardRef(Y4);
  var X4 = B4, U4 = Object.defineProperty, _v = Object.getOwnPropertySymbols, $4 = Object.prototype.hasOwnProperty, V4 = Object.prototype.propertyIsEnumerable, Mv = (l, n, a) => n in l ? U4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, kf = (l, n) => {
    for (var a in n || (n = {})) $4.call(n, a) && Mv(l, a, n[a]);
    if (_v) for (var a of _v(n)) V4.call(n, a) && Mv(l, a, n[a]);
    return l;
  };
  const q4 = (l, n) => {
    const a = g.useContext(dt), o = kf(kf({}, a), l);
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
  }, G4 = g.forwardRef(q4);
  var P4 = G4, Z4 = Object.defineProperty, jv = Object.getOwnPropertySymbols, K4 = Object.prototype.hasOwnProperty, F4 = Object.prototype.propertyIsEnumerable, Lv = (l, n, a) => n in l ? Z4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, _f = (l, n) => {
    for (var a in n || (n = {})) K4.call(n, a) && Lv(l, a, n[a]);
    if (jv) for (var a of jv(n)) F4.call(n, a) && Lv(l, a, n[a]);
    return l;
  };
  const Q4 = (l, n) => {
    const a = g.useContext(dt), o = _f(_f({}, a), l);
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
  }, W4 = g.forwardRef(Q4);
  var J4 = W4, e3 = Object.defineProperty, Rv = Object.getOwnPropertySymbols, t3 = Object.prototype.hasOwnProperty, n3 = Object.prototype.propertyIsEnumerable, Av = (l, n, a) => n in l ? e3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, Mf = (l, n) => {
    for (var a in n || (n = {})) t3.call(n, a) && Av(l, a, n[a]);
    if (Rv) for (var a of Rv(n)) n3.call(n, a) && Av(l, a, n[a]);
    return l;
  };
  const l3 = (l, n) => {
    const a = g.useContext(dt), o = Mf(Mf({}, a), l);
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
  }, a3 = g.forwardRef(l3);
  var r3 = a3, o3 = Object.defineProperty, Nv = Object.getOwnPropertySymbols, s3 = Object.prototype.hasOwnProperty, i3 = Object.prototype.propertyIsEnumerable, Tv = (l, n, a) => n in l ? o3(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: a
  }) : l[n] = a, jf = (l, n) => {
    for (var a in n || (n = {})) s3.call(n, a) && Tv(l, a, n[a]);
    if (Nv) for (var a of Nv(n)) i3.call(n, a) && Tv(l, a, n[a]);
    return l;
  };
  const c3 = (l, n) => {
    const a = g.useContext(dt), o = jf(jf({}, a), l);
    return g.createElement("svg", jf({
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
  }, u3 = g.forwardRef(c3);
  var bh = u3;
  const $i = {
    md: 768,
    lg: 1120
  };
  function P1() {
    if (typeof window > "u") return {
      isLg: true,
      isMd: false,
      isSm: false
    };
    const l = window.innerWidth;
    return {
      isLg: l >= $i.lg,
      isMd: l >= $i.md && l < $i.lg,
      isSm: l < $i.md
    };
  }
  let Zo = P1();
  const Kf = /* @__PURE__ */ new Set();
  function d3(l) {
    return Kf.add(l), () => Kf.delete(l);
  }
  function f3() {
    return Zo;
  }
  if (typeof window < "u") {
    const l = () => {
      const n = P1();
      if (n.isLg !== Zo.isLg || n.isMd !== Zo.isMd || n.isSm !== Zo.isSm) {
        Zo = n;
        for (const a of Kf) a();
      }
    };
    window.addEventListener("resize", l);
  }
  function vh() {
    return g.useSyncExternalStore(d3, f3, () => ({
      isLg: true,
      isMd: false,
      isSm: false
    }));
  }
  const h3 = 8;
  function Z1({ side: l, width: n, onResize: a }) {
    const [o, i] = g.useState(false), c = g.useRef(0), d = g.useRef(0), f = g.useCallback((v) => {
      const x = Math.max(Gi, Math.min(Pi, v));
      return Math.abs(x - Ko) <= h3 ? Ko : Math.round(x);
    }, []), h = g.useCallback((v) => {
      if (v.button !== 0) return;
      v.preventDefault(), v.stopPropagation(), c.current = v.clientX, d.current = n, i(true), document.body.style.userSelect = "none", document.body.style.cursor = "col-resize";
      const x = (E) => {
        const k = E.clientX - c.current, b = l === "left" ? d.current + k : d.current - k;
        a(f(b));
      }, S = () => {
        document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", S), document.body.style.userSelect = "", document.body.style.cursor = "", i(false);
      };
      document.addEventListener("mousemove", x), document.addEventListener("mouseup", S);
    }, [
      l,
      n,
      a,
      f
    ]), p = g.useCallback(() => {
      a(Ko);
    }, [
      a
    ]);
    return {
      handleProps: {
        onMouseDown: h,
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
  async function Ff(l) {
    const { emit: n } = await wt(async () => {
      const { emit: a } = await import("./event-BC8TvpKC.js");
      return {
        emit: a
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    await n("open-file", l);
  }
  async function Qf(l) {
    var _a;
    const n = Se.getState().library;
    if (n) try {
      let a = null;
      if (l || (a = ((_a = Ze.getState().getActiveTab()) == null ? void 0 : _a.filePath) ?? null), a || (a = await P0()), !a) return;
      !a.endsWith(".gds") && !a.endsWith(".gds2") && !a.endsWith(".gdsii") && (a += ".gds");
      const o = n.to_gds();
      await $0(a, o), Wn.getState().markClean();
      const i = Ze.getState().activeTabId;
      if (i) {
        const c = a.split(/[/\\]/).pop() ?? "untitled";
        Ze.getState().updateTab(i, {
          filePath: a,
          title: c,
          isDirty: false
        });
      }
      cn.getState().show(`Saved to ${a.split("/").pop()}`);
    } catch (a) {
      console.error("Failed to save GDS file:", a), cn.getState().show(`Save failed: ${a}`, "error");
    }
  }
  async function K1() {
    if (!Wn.getState().isDirty) return true;
    if (Un) {
      const { ask: l } = await wt(async () => {
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
  async function xh() {
    window.dispatchEvent(new CustomEvent("rosette-new-file"));
  }
  async function F1() {
    const { renderer: l } = Se.getState();
    if (!l) throw new Error("Renderer not ready");
    const n = await l.capture_screenshot(), a = new DataView(n.buffer, n.byteOffset, n.byteLength), o = a.getUint32(0, true), i = a.getUint32(4, true), c = n.slice(8), d = document.createElement("canvas");
    d.width = o, d.height = i;
    const f = d.getContext("2d");
    if (!f) throw new Error("Failed to create 2D context");
    const h = new ImageData(new Uint8ClampedArray(c.buffer, c.byteOffset, c.byteLength), o, i);
    return f.putImageData(h, 0, 0), new Promise((p, v) => {
      d.toBlob((x) => x ? p(x) : v(new Error("PNG encoding failed")), "image/png");
    });
  }
  async function m3() {
    try {
      const l = await F1();
      if (Un) {
        let n = await Z0();
        if (!n) return;
        n.endsWith(".png") || (n += ".png");
        const a = new Uint8Array(await l.arrayBuffer());
        await V0(n, a), cn.getState().show(`Screenshot saved to ${n.split("/").pop()}`);
      } else {
        const n = URL.createObjectURL(l), a = document.createElement("a");
        a.href = n, a.download = "screenshot.png", document.body.appendChild(a), a.click(), document.body.removeChild(a), URL.revokeObjectURL(n), cn.getState().show("Screenshot downloaded");
      }
    } catch (l) {
      console.error("Screenshot failed:", l), cn.getState().show(`Screenshot failed: ${l}`, "error");
    }
  }
  async function g3() {
    try {
      const l = await F1();
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": l
        })
      ]), cn.getState().show("Screenshot copied to clipboard");
    } catch (l) {
      console.error("Screenshot to clipboard failed:", l), cn.getState().show(`Screenshot to clipboard failed: ${l}`, "error");
    }
  }
  const Qn = Object.freeze(Object.defineProperty({
    __proto__: null,
    confirmDiscardChanges: K1,
    emitOpenFile: Ff,
    handleNewFile: xh,
    handleSave: Qf,
    handleScreenshot: m3,
    handleScreenshotToClipboard: g3
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function Vn({ label: l, shortcut: n, position: a = "bottom", align: o = "center", className: i, children: c }) {
    var _a;
    const d = me((v) => v.theme) === "dark", f = B("inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border px-1 text-[11px]", d ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"), p = a === "left" || a === "right" ? B("top-1/2 -translate-y-1/2", a === "left" ? "right-full mr-3" : "left-full ml-3") : B(o === "end" ? "right-0" : "left-1/2 -translate-x-1/2", a === "bottom" ? "top-full mt-2" : "bottom-full mb-2");
    return y.jsxs("div", {
      className: B("group relative", i),
      children: [
        c,
        y.jsxs("div", {
          className: B("pointer-events-none select-none absolute z-50 flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100", p, d ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
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
  function p3(l) {
    return "separator" in l && l.separator;
  }
  function y3(l, n, a, o = "nested") {
    if (o === "flat" || !l) return n;
    const i = [];
    function c(d) {
      for (const f of d) i.push(f.name), f.children.length > 0 && a.has(f.name) && c(f.children);
    }
    return c(l), i;
  }
  function b3(l, n) {
    if (!l) return null;
    function a(o, i) {
      for (const c of o) {
        if (c.name === n) return i;
        const d = a(c.children, c.name);
        if (d !== null) return d;
      }
      return null;
    }
    return a(l, null);
  }
  function Ov(l, n) {
    if (!l) return null;
    function a(o) {
      for (const i of o) {
        if (i.name === n) return i;
        const c = a(i.children);
        if (c) return c;
      }
      return null;
    }
    return a(l);
  }
  function Iv(l, n, a, o, i = "nested") {
    const c = [];
    if (l.length > 1) for (const f of l) c.push({
      type: "tab",
      id: f.id
    });
    const d = y3(n, a, o, i);
    for (const f of d) c.push({
      type: "cell",
      name: f
    });
    return c;
  }
  function Q1(l, n) {
    return l === null || n === null ? l === n : l.type !== n.type ? false : l.type === "tab" && n.type === "tab" ? l.id === n.id : l.type === "cell" && n.type === "cell" ? l.name === n.name : false;
  }
  function v3(l, n) {
    return n ? l.findIndex((a) => Q1(a, n)) : -1;
  }
  function x3({ expanded: l, isDark: n }) {
    return y.jsx("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      className: B("flex-shrink-0 transition-transform duration-150", l ? "rotate-90" : "rotate-0", n ? "text-white/40" : "text-black/40"),
      children: y.jsx("path", {
        d: "M6 4l4 4-4 4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5"
      })
    });
  }
  function w3({ buildItems: l, isDark: n, onAction: a }) {
    const o = g.useRef(null), [i, c] = g.useState(false), [, d] = g.useState(0), f = l();
    return g.useLayoutEffect(() => {
      o.current && o.current.getBoundingClientRect().right > window.innerWidth - 8 && c(true);
    }, []), y.jsx("div", {
      ref: o,
      className: B("absolute -top-1 z-50 ml-1 min-w-[170px] rounded-xl border py-1", i ? "right-full mr-1" : "left-full", n ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      children: f.map((h) => {
        var _a;
        return p3(h) ? y.jsx("div", {
          className: B("my-1 h-px", n ? "bg-white/10" : "bg-black/10")
        }, h.id) : y.jsxs("button", {
          className: B("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors", h.disabled ? "opacity-40" : n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          disabled: h.disabled,
          onClick: () => {
            h.disabled || (Promise.resolve(h.action()).catch((p) => console.error("Menu action failed:", p)), h.keepOpen ? d((p) => p + 1) : a());
          },
          children: [
            y.jsx("span", {
              children: h.label
            }),
            h.shortcut && y.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = h.shortcut.modifiers) == null ? void 0 : _a.map((p) => y.jsx("kbd", {
                  className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: p
                }, p)),
                y.jsx("kbd", {
                  className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: h.shortcut.key
                })
              ]
            })
          ]
        }, h.id);
      })
    });
  }
  function S3({ isDark: l }) {
    const [n, a] = g.useState(false), [o, i] = g.useState(null), c = g.useRef(null);
    Hl("explorer-menu", n);
    const d = g.useCallback(() => {
      a(false), i(null);
    }, []);
    g.useEffect(() => {
      if (!n) return;
      const h = (p) => {
        c.current && !c.current.contains(p.target) && d();
      };
      return document.addEventListener("mousedown", h), () => document.removeEventListener("mousedown", h);
    }, [
      n,
      d
    ]), g.useEffect(() => {
      if (!n) return;
      const h = (p) => {
        p.key === "Escape" && (p.preventDefault(), d());
      };
      return document.addEventListener("keydown", h), () => document.removeEventListener("keydown", h);
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
              await xh();
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
              const { pickGdsFile: h } = await wt(async () => {
                const { pickGdsFile: x } = await Promise.resolve().then(() => W0);
                return {
                  pickGdsFile: x
                };
              }, void 0, import.meta.url), { emitOpenFile: p } = await wt(async () => {
                const { emitOpenFile: x } = await Promise.resolve().then(() => Qn);
                return {
                  emitOpenFile: x
                };
              }, void 0, import.meta.url), v = await h();
              v && await p(v);
            },
            disabled: !Un
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
              const { handleSave: h } = await wt(async () => {
                const { handleSave: p } = await Promise.resolve().then(() => Qn);
                return {
                  handleSave: p
                };
              }, void 0, import.meta.url);
              await h(false);
            },
            disabled: !Un
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
              const { handleSave: h } = await wt(async () => {
                const { handleSave: p } = await Promise.resolve().then(() => Qn);
                return {
                  handleSave: p
                };
              }, void 0, import.meta.url);
              await h(true);
            },
            disabled: !Un
          },
          {
            id: "sep-file-1",
            separator: true
          },
          {
            id: "file-screenshot",
            label: "Export Screenshot",
            action: async () => {
              const { handleScreenshot: h } = await wt(async () => {
                const { handleScreenshot: p } = await Promise.resolve().then(() => Qn);
                return {
                  handleScreenshot: p
                };
              }, void 0, import.meta.url);
              await h();
            },
            disabled: false
          },
          {
            id: "file-screenshot-clipboard",
            label: "Copy Screenshot",
            action: async () => {
              const { handleScreenshotToClipboard: h } = await wt(async () => {
                const { handleScreenshotToClipboard: p } = await Promise.resolve().then(() => Qn);
                return {
                  handleScreenshotToClipboard: p
                };
              }, void 0, import.meta.url);
              await h();
            },
            disabled: false
          }
        ]
      },
      {
        id: "edit",
        label: "Edit",
        buildItems: () => {
          const { library: h, renderer: p } = Se.getState(), { canUndo: v, canRedo: x } = fe.getState(), { selectedIds: S } = ue.getState(), { hasContent: E } = jn.getState(), { selectedRulerIds: k } = Oe.getState(), b = S.size > 0, C = k.size > 0, _ = h ? h.get_all_ids().length > 0 : false;
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
                h && p && fe.getState().undo({
                  library: h,
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
                h && p && fe.getState().redo({
                  library: h,
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
                  Ie.mod
                ],
                key: "C"
              },
              action: () => {
                if (!h) return;
                const R = ue.getState().selectedIds, j = Jn(h, R);
                jn.getState().copy(j);
              },
              disabled: !b
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
                if (!h || !p) return;
                const R = new ts();
                fe.getState().execute(R, {
                  library: h,
                  renderer: p
                });
                const j = document.querySelector("canvas");
                j && Xa(h, j);
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
                if (!h || !p) return;
                const R = ue.getState().selectedIds;
                if (R.size === 0) return;
                const j = new ns([
                  ...R
                ]);
                fe.getState().execute(j, {
                  library: h,
                  renderer: p
                });
                const A = document.querySelector("canvas");
                A && Xa(h, A);
              },
              disabled: !b
            },
            {
              id: "create-array",
              label: "Create Array\u2026",
              action: () => {
                const R = ue.getState().selectedIds;
                R.size !== 0 && gh.getState().open([
                  ...R
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
                key: Ie.backspace
              },
              action: () => {
                if (!h || !p) return;
                const R = Oe.getState().selectedRulerIds;
                if (R.size > 0) {
                  const N = new dc([
                    ...R
                  ]);
                  fe.getState().execute(N, {
                    library: h,
                    renderer: p
                  });
                  return;
                }
                const j = ue.getState().selectedIds;
                if (j.size === 0) return;
                const A = new uc([
                  ...j
                ]);
                fe.getState().execute(A, {
                  library: h,
                  renderer: p
                });
              },
              disabled: !b && !C
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
                if (!h) return;
                const R = [
                  ...h.get_all_ids(),
                  ...ls()
                ];
                ue.getState().selectAll(R);
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
          const { library: h } = Se.getState(), { selectedIds: p } = ue.getState(), v = p.size > 0;
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
                Ye.getState().zoomAt(oc, S.width / 2, S.height / 2);
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
                Ye.getState().zoomAt(sc, S.width / 2, S.height / 2);
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
                us();
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
                const x = document.querySelector("canvas");
                if (!x || !h) return;
                const S = ue.getState().selectedIds;
                if (S.size === 0) return;
                const E = h.get_bounds_for_ids([
                  ...S
                ]), k = E ? {
                  minX: E[0],
                  minY: E[1],
                  maxX: E[2],
                  maxY: E[3]
                } : null, b = zl(x);
                Ye.getState().zoomToSelected(k, b.width, b.height, b.screenCenter);
              },
              disabled: !v
            },
            {
              id: "sep-view-2",
              separator: true
            },
            {
              id: "goToCoordinate",
              label: "Go to Coordinate\u2026",
              action: () => {
                ph.getState().open();
              },
              disabled: false
            }
          ];
        }
      },
      {
        id: "preferences",
        label: "Preferences",
        buildItems: () => {
          const { themeSetting: h, showGrid: p, rightClickMode: v } = me.getState();
          return [
            {
              id: "theme-light",
              label: `${h === "light" ? "\u2713  " : "     "}Light`,
              action: () => me.getState().setThemeSetting("light"),
              disabled: false,
              keepOpen: true
            },
            {
              id: "theme-dark",
              label: `${h === "dark" ? "\u2713  " : "     "}Dark`,
              action: () => me.getState().setThemeSetting("dark"),
              disabled: false,
              keepOpen: true
            },
            {
              id: "theme-system",
              label: `${h === "system" ? "\u2713  " : "     "}System`,
              action: () => me.getState().setThemeSetting("system"),
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
              action: () => me.getState().toggleGrid(),
              disabled: false,
              keepOpen: true
            },
            {
              id: "right-click-zoom",
              label: `${v === "zoom" ? "\u2713  " : "     "}Right Click Zoom`,
              action: () => me.getState().toggleRightClickMode(),
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
            a((h) => !h), i(null);
          },
          className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
          children: y.jsx("div", {
            className: "flex h-4 w-4 items-center justify-center",
            children: y.jsx(MM, {
              className: B("h-4 w-4", l ? "text-white/60" : "text-black/60")
            })
          })
        }),
        n && y.jsx("div", {
          className: B("absolute top-full right-0 z-50 mt-1 min-w-[140px] rounded-xl border py-1", l ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
          children: f.map((h) => y.jsxs("div", {
            className: "relative",
            children: [
              y.jsxs("button", {
                type: "button",
                className: B("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", o === h.id && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                onMouseEnter: () => i(h.id),
                onClick: () => i(o === h.id ? null : h.id),
                children: [
                  y.jsx("span", {
                    children: h.label
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
              o === h.id && y.jsx(w3, {
                buildItems: h.buildItems,
                isDark: l,
                onAction: d
              })
            ]
          }, h.id))
        })
      ]
    });
  }
  function W1({ name: l, isActive: n, isFocused: a, isDark: o, depth: i, hasChildren: c, isExpanded: d, isHidden: f, onToggleExpand: h, onSelect: p, onRename: v, startEditing: x, canDrag: S }) {
    const [E, k] = g.useState(false), [b, C] = g.useState(l), _ = g.useRef(null), R = g.useRef(null);
    g.useEffect(() => {
      a && R.current && R.current.scrollIntoView({
        block: "nearest"
      });
    }, [
      a
    ]), g.useEffect(() => {
      x && (k(true), C(l), he.getState().setEditingCellName(null));
    }, [
      x,
      l
    ]), g.useEffect(() => {
      E && _.current && (_.current.focus(), _.current.select());
    }, [
      E
    ]);
    const j = g.useCallback(() => {
      const D = b.trim();
      D && D !== l ? v(D) : C(l), k(false);
    }, [
      b,
      l,
      v
    ]), A = g.useCallback((D) => {
      D.key === "Enter" ? j() : D.key === "Escape" && (C(l), k(false));
    }, [
      j,
      l
    ]), N = g.useCallback((D) => {
      D.preventDefault(), D.stopPropagation(), cs.getState().open("cell", {
        x: D.clientX,
        y: D.clientY
      }, l);
    }, [
      l
    ]), T = g.useCallback((D) => {
      D.stopPropagation(), h();
    }, [
      h
    ]), O = g.useCallback((D) => {
      if (D.button !== 0 || !S || E) {
        S || D.preventDefault();
        return;
      }
      const H = {
        x: D.clientX,
        y: D.clientY
      };
      let $ = false;
      const te = (ee) => {
        const ge = ee.clientX - H.x, Ce = ee.clientY - H.y;
        if (!(!$ && ge * ge + Ce * Ce < 25) && !$) {
          $ = true;
          const { library: V } = Se.getState();
          if (!V) return;
          const P = V.get_cell_bounds(l) ?? null, pe = V.get_cell_origin_by_name(l), xe = {
            x: pe ? pe[0] : 0,
            y: pe ? pe[1] : 0
          };
          Ki.getState().startDrag(l, P, xe);
        }
      }, J = () => {
        document.removeEventListener("mousemove", te), document.removeEventListener("mouseup", J);
      };
      document.addEventListener("mousemove", te), document.addEventListener("mouseup", J);
    }, [
      S,
      E,
      l
    ]);
    return y.jsxs("button", {
      ref: R,
      type: "button",
      className: B("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center rounded-lg py-1.5 text-left transition-colors focus:outline-none", n ? o ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : a ? o ? "bg-[rgb(44,44,44)] text-white/90" : "bg-[rgb(227,227,227)] text-black/90" : o ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90", a && (o ? "ring-1 ring-white/25" : "ring-1 ring-black/20")),
      style: {
        paddingLeft: `${7 + i * 10}px`,
        paddingRight: "7px"
      },
      onClick: p,
      onContextMenu: N,
      onMouseDown: O,
      tabIndex: -1,
      children: [
        c ? y.jsx("button", {
          type: "button",
          className: "mr-0.5 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center bg-transparent border-none p-0",
          onClick: T,
          children: y.jsx(x3, {
            expanded: d,
            isDark: o
          })
        }) : y.jsx("span", {
          className: "mr-0.5 h-4 w-4 flex-shrink-0"
        }),
        y.jsx("div", {
          className: "relative h-5 min-w-0 flex-1",
          children: E ? y.jsx("input", {
            ref: _,
            type: "text",
            value: b,
            onChange: (D) => C(D.target.value),
            onBlur: j,
            onKeyDown: A,
            onClick: (D) => D.stopPropagation(),
            className: B("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", o ? "text-white/90" : "text-black/90")
          }) : y.jsx("span", {
            className: B("absolute inset-0 truncate text-sm leading-5 select-none", f && "opacity-40"),
            onDoubleClick: (D) => {
              D.stopPropagation(), k(true), C(l);
            },
            children: l
          })
        })
      ]
    });
  }
  function J1({ node: l, depth: n, isDark: a, activeCell: o, focusedCellName: i, editingCellName: c, expandedCells: d, hiddenCells: f, onSelect: h, onRename: p, onToggleExpand: v }) {
    const x = l.children.length > 0, S = d.has(l.name), E = l.name !== o;
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(W1, {
          name: l.name,
          isActive: l.name === o,
          isFocused: l.name === i,
          isDark: a,
          depth: n,
          hasChildren: x,
          isExpanded: S,
          isHidden: f.has(l.name),
          onToggleExpand: () => v(l.name),
          onSelect: () => h(l.name),
          onRename: (k) => p(l.name, k),
          startEditing: c === l.name,
          canDrag: E
        }),
        x && S && l.children.map((k) => y.jsx(J1, {
          node: k,
          depth: n + 1,
          isDark: a,
          activeCell: o,
          focusedCellName: i,
          editingCellName: c,
          expandedCells: d,
          hiddenCells: f,
          onSelect: h,
          onRename: p,
          onToggleExpand: v
        }, `${l.name}/${k.name}`))
      ]
    });
  }
  function C3({ tab: l, isActive: n, isFocused: a, isDark: o, onSelect: i, onClose: c, onMiddleClick: d }) {
    const f = g.useRef(null);
    return g.useEffect(() => {
      a && f.current && f.current.scrollIntoView({
        block: "nearest"
      });
    }, [
      a
    ]), y.jsxs("div", {
      ref: f,
      role: "tab",
      tabIndex: 0,
      "aria-selected": n,
      className: B("group mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-1.5 rounded-lg py-1.5 pr-1 pl-2 transition-colors", n ? o ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : a ? o ? "bg-[rgb(44,44,44)] text-white/90" : "bg-[rgb(227,227,227)] text-black/90" : o ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90", a && (o ? "ring-1 ring-white/25" : "ring-1 ring-black/20")),
      onClick: i,
      onKeyDown: (h) => {
        (h.key === "Enter" || h.key === " ") && (h.preventDefault(), i());
      },
      onMouseDown: d,
      children: [
        l.isDirty ? y.jsx("span", {
          className: B("h-1.5 w-1.5 flex-shrink-0 rounded-full", o ? "bg-white/50" : "bg-black/50")
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
          className: B("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm transition-opacity", "opacity-0 group-hover:opacity-100", o ? "hover:bg-white/15 text-white/50 hover:text-white/80" : "hover:bg-black/15 text-black/50 hover:text-black/80"),
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
  function E3({ isDark: l, focusedItem: n }) {
    const a = Ze((f) => f.tabs), o = Ze((f) => f.activeTabId), i = g.useCallback((f) => {
      f !== o && (Ua(o, f), Ze.getState().setActiveTab(f));
    }, [
      o
    ]), c = g.useCallback(async (f, h) => {
      f.stopPropagation(), window.dispatchEvent(new CustomEvent("rosette-close-tab", {
        detail: h
      }));
    }, []), d = g.useCallback((f, h) => {
      f.button === 1 && (f.preventDefault(), window.dispatchEvent(new CustomEvent("rosette-close-tab", {
        detail: h
      })));
    }, []);
    return a.length <= 1 ? null : y.jsxs(y.Fragment, {
      children: [
        y.jsx("div", {
          className: "flex flex-col gap-0.5 py-1",
          children: a.map((f) => y.jsx(C3, {
            tab: f,
            isActive: f.id === o,
            isFocused: (n == null ? void 0 : n.type) === "tab" && n.id === f.id,
            isDark: l,
            onSelect: () => i(f.id),
            onClose: (h) => c(h, f.id),
            onMiddleClick: (h) => d(h, f.id)
          }, f.id))
        }),
        y.jsx("div", {
          className: B("h-px", l ? "bg-white/10" : "bg-black/10")
        })
      ]
    });
  }
  function k3({ isDark: l, onExpand: n }) {
    const a = Ze((o) => o.tabs.length);
    return y.jsxs("div", {
      className: B("fixed top-4 left-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border pt-[4.5px] pb-[5px]", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: [
        y.jsxs("div", {
          className: "relative p-1",
          children: [
            y.jsx("img", {
              src: "/icon.svg",
              alt: "",
              draggable: false,
              className: B("h-5 w-5 select-none pointer-events-none rounded border", l ? "border-white/40" : "border-black/40")
            }),
            a > 1 && y.jsx("span", {
              className: B("absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-0.5 text-[9px] font-medium leading-none", l ? "bg-white/20 text-white/80" : "bg-black/20 text-black/80"),
              children: a
            })
          ]
        }),
        y.jsx("div", {
          className: B("mx-1 h-px w-5", l ? "bg-white/10" : "bg-black/10")
        }),
        y.jsx("button", {
          type: "button",
          onClick: n,
          className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          children: y.jsx($1, {
            className: B("h-4 w-4", l ? "text-white/60" : "text-black/60")
          })
        })
      ]
    });
  }
  function Dv() {
    const n = me((z) => z.theme) === "dark", a = me((z) => z.explorerCollapsed), o = me((z) => z.toggleExplorerCollapsed), i = me((z) => z.explorerWidth), c = me((z) => z.setExplorerWidth), { isSm: d } = vh(), { handleProps: f } = Z1({
      side: "left",
      width: i,
      onResize: c
    }), h = he((z) => z.projectName), p = he((z) => z.setProjectName), v = he((z) => z.cells), x = he((z) => z.cellTree), S = he((z) => z.activeCell), E = he((z) => z.setActiveCell), k = he((z) => z.editingCellName), b = he((z) => z.expandedCells), C = he((z) => z.toggleExpanded), _ = he((z) => z.cellsLoaded), R = he((z) => z.hierarchyLevelLimit), j = he((z) => z.setHierarchyLevelLimit), A = he((z) => z.maxTreeDepth), N = he((z) => z.hiddenCells), T = he((z) => z.cellListMode), O = he((z) => z.isFocused), D = he((z) => z.focusedItem), H = he((z) => z.setFocused), $ = he((z) => z.setFocusedItem);
    Hl("explorer-panel", O);
    const [te, J] = g.useState(false), ee = g.useRef(null);
    g.useEffect(() => {
      if (!d || !te) return;
      const z = (oe) => {
        ee.current && !ee.current.contains(oe.target) && J(false);
      };
      return document.addEventListener("mousedown", z), () => document.removeEventListener("mousedown", z);
    }, [
      d,
      te
    ]);
    const ge = (z, oe) => z === 1 / 0 ? oe > 0 ? oe.toString() : "" : z.toString(), [Ce, V] = g.useState(ge(R, A));
    g.useEffect(() => {
      V(ge(R, A));
    }, [
      R,
      A
    ]);
    const [P, pe] = g.useState(false), [xe, be] = g.useState(h), L = g.useRef(null);
    g.useEffect(() => {
      P && L.current && (L.current.focus(), L.current.select());
    }, [
      P
    ]);
    const I = g.useCallback(() => {
      const z = xe.trim();
      z && z !== h ? p(z) : be(h), pe(false);
    }, [
      xe,
      h,
      p
    ]), Z = g.useCallback((z) => {
      z.key === "Enter" ? I() : z.key === "Escape" && (be(h), pe(false));
    }, [
      I,
      h
    ]), W = g.useCallback((z, oe) => {
      const { library: de, renderer: _e } = Se.getState();
      if (de && _e) {
        const Ee = new E0(z, oe);
        fe.getState().execute(Ee, {
          library: de,
          renderer: _e
        });
      } else he.getState().renameCell(z, oe);
    }, []), G = g.useCallback((z) => {
      z === S && v.length <= 1 || E(z === S ? null : z);
    }, [
      S,
      v.length,
      E
    ]), se = g.useCallback((z) => {
      z.target === z.currentTarget && (z.preventDefault(), cs.getState().open("cell", {
        x: z.clientX,
        y: z.clientY
      }));
    }, []);
    g.useEffect(() => {
      if (!O) return;
      const z = (oe) => {
        ee.current && !ee.current.contains(oe.target) && H(false);
      };
      return document.addEventListener("mousedown", z), () => document.removeEventListener("mousedown", z);
    }, [
      O,
      H
    ]), g.useEffect(() => {
      if (!O) return;
      const z = (oe) => {
        if (oe.target instanceof HTMLInputElement || oe.target instanceof HTMLTextAreaElement) return;
        const { focusedItem: de, cellTree: _e, cells: Ee, expandedCells: je, activeCell: we, editingCellName: ze, cellListMode: Ae } = he.getState();
        if (ze) return;
        const qe = Ze.getState().tabs, Be = Iv(qe, _e, Ee, je, Ae);
        if (Be.length === 0) return;
        const Qe = v3(Be, de);
        switch (oe.key) {
          case "ArrowDown": {
            oe.preventDefault();
            const Xe = Qe < Be.length - 1 ? Qe + 1 : 0;
            $(Be[Xe]);
            break;
          }
          case "ArrowUp": {
            oe.preventDefault();
            const Xe = Qe > 0 ? Qe - 1 : Be.length - 1;
            $(Be[Xe]);
            break;
          }
          case "ArrowRight": {
            if (oe.preventDefault(), (de == null ? void 0 : de.type) === "cell" && _e && Ae === "nested") {
              const Xe = Ov(_e, de.name);
              Xe && Xe.children.length > 0 && !je.has(de.name) ? C(de.name) : Xe && Xe.children.length > 0 && je.has(de.name) && $({
                type: "cell",
                name: Xe.children[0].name
              });
            }
            break;
          }
          case "ArrowLeft": {
            if (oe.preventDefault(), (de == null ? void 0 : de.type) === "cell" && _e && Ae === "nested") {
              const Xe = Ov(_e, de.name);
              if (Xe && Xe.children.length > 0 && je.has(de.name)) C(de.name);
              else {
                const vt = b3(_e, de.name);
                vt && $({
                  type: "cell",
                  name: vt
                });
              }
            }
            break;
          }
          case " ": {
            if (oe.preventDefault(), !de) break;
            if (de.type === "tab") {
              const Xe = Ze.getState().activeTabId;
              de.id !== Xe && (Ua(Xe, de.id), Ze.getState().setActiveTab(de.id));
            } else de.name === we ? Ee.length > 1 && E(null) : E(de.name);
            break;
          }
          case "Enter": {
            oe.preventDefault(), (de == null ? void 0 : de.type) === "cell" && he.getState().setEditingCellName(de.name);
            break;
          }
          case "Delete":
          case "Backspace": {
            if (oe.preventDefault(), !de) break;
            if (de.type === "tab") {
              const Xe = Qe;
              window.dispatchEvent(new CustomEvent("rosette-close-tab", {
                detail: de.id
              })), setTimeout(() => {
                const vt = he.getState(), jt = Ze.getState().tabs, ft = Iv(jt, vt.cellTree, vt.cells, vt.expandedCells, vt.cellListMode);
                if (ft.length === 0) $(null);
                else {
                  const Rn = Math.min(Xe, ft.length - 1);
                  $(ft[Rn]);
                }
              }, 0);
            } else if (Ee.length > 1) {
              const { library: Xe, renderer: vt } = Se.getState();
              if (Xe && vt) {
                const jt = Qe < Be.length - 1 ? Qe + 1 : Qe - 1, ft = jt >= 0 ? Be[jt] : null, Rn = new oh(de.name);
                fe.getState().execute(Rn, {
                  library: Xe,
                  renderer: vt
                }), ft && !Q1(ft, de) && $(ft);
              }
            }
            break;
          }
          case "z":
          case "Z": {
            if (!(oe.metaKey || oe.ctrlKey)) return;
            oe.preventDefault();
            const { library: vt, renderer: jt } = Se.getState();
            if (!vt || !jt) break;
            oe.shiftKey ? fe.getState().redo({
              library: vt,
              renderer: jt
            }) : fe.getState().undo({
              library: vt,
              renderer: jt
            });
            break;
          }
          case "Escape": {
            oe.preventDefault(), H(false);
            break;
          }
          default:
            return;
        }
      };
      return document.addEventListener("keydown", z), () => document.removeEventListener("keydown", z);
    }, [
      O,
      H,
      $,
      E,
      C
    ]);
    const Y = g.useCallback(() => {
      d ? J(true) : o();
    }, [
      d,
      o
    ]);
    if (a && !(d && te)) return y.jsx(k3, {
      isDark: n,
      onExpand: Y
    });
    const re = d && te;
    return y.jsxs(y.Fragment, {
      children: [
        re && y.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        y.jsxs("div", {
          ref: ee,
          className: B("fixed top-4 left-4 z-40 rounded-xl border transition-opacity duration-200", _ ? "opacity-100" : "pointer-events-none opacity-0", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", re && "shadow-xl"),
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
                    className: B("h-5 w-5 select-none pointer-events-none rounded border", n ? "border-white/40" : "border-black/40")
                  })
                }),
                y.jsx("div", {
                  className: "relative h-5 min-w-0 flex-1",
                  children: P ? y.jsx("input", {
                    ref: L,
                    type: "text",
                    value: xe,
                    onChange: (z) => be(z.target.value),
                    onBlur: I,
                    onKeyDown: Z,
                    onClick: (z) => z.stopPropagation(),
                    className: B("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-xs font-medium leading-5 outline-none focus:ring-0", n ? "text-white/90" : "text-black/90")
                  }) : y.jsx("button", {
                    type: "button",
                    className: B("absolute inset-0 cursor-text truncate border-0 bg-transparent p-0 text-left text-xs font-medium leading-5 select-none focus:outline-none", n ? "text-white/60" : "text-black/60"),
                    onClick: () => {
                      be(h), pe(true);
                    },
                    children: h
                  })
                }),
                !d && y.jsx("button", {
                  type: "button",
                  onClick: o,
                  className: B("flex-shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: y.jsx(YM, {
                    className: B("h-4 w-4", n ? "text-white/60" : "text-black/60")
                  })
                }),
                y.jsx(S3, {
                  isDark: n
                })
              ]
            }),
            y.jsx("div", {
              className: B("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            y.jsx(E3, {
              isDark: n,
              focusedItem: O ? D : null
            }),
            y.jsx("div", {
              className: "flex flex-col gap-0.5 overflow-y-auto py-1",
              style: {
                maxHeight: "calc(100vh - 176px)"
              },
              onWheel: (z) => z.stopPropagation(),
              onContextMenu: se,
              children: x && T === "nested" ? x.map((z) => y.jsx(J1, {
                node: z,
                depth: 0,
                isDark: n,
                activeCell: S,
                focusedCellName: O && (D == null ? void 0 : D.type) === "cell" ? D.name : null,
                editingCellName: k,
                expandedCells: b,
                hiddenCells: N,
                onSelect: G,
                onRename: W,
                onToggleExpand: C
              }, z.name)) : v.map((z) => y.jsx(W1, {
                name: z,
                isActive: z === S,
                isFocused: O && (D == null ? void 0 : D.type) === "cell" && D.name === z,
                isDark: n,
                depth: 0,
                hasChildren: false,
                isExpanded: false,
                isHidden: N.has(z),
                onToggleExpand: () => {
                },
                onSelect: () => G(z),
                onRename: (oe) => W(z, oe),
                startEditing: k === z,
                canDrag: z !== S
              }, z))
            }),
            y.jsx("div", {
              className: B("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            y.jsxs("div", {
              className: "flex items-center justify-between pl-2 pr-[5.5px] py-1.5",
              children: [
                y.jsx("span", {
                  className: B("text-xs select-none pointer-events-none", n ? "text-white/40" : "text-black/40"),
                  children: "Level"
                }),
                y.jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [
                    y.jsx("input", {
                      id: "hierarchy-level-input",
                      type: "number",
                      min: "1",
                      max: A,
                      value: Ce,
                      onChange: (z) => {
                        const oe = z.target.value;
                        V(oe);
                        const de = parseInt(oe, 10);
                        !isNaN(de) && de >= 1 && j(de);
                      },
                      onBlur: () => {
                        const z = parseInt(Ce, 10) || A, oe = Math.max(1, Math.min(z, A));
                        j(oe), V(oe.toString());
                      },
                      onKeyDown: (z) => {
                        if (z.key === "Enter") {
                          const oe = parseInt(Ce, 10) || A, de = Math.max(1, Math.min(oe, A));
                          j(de), V(de.toString()), z.currentTarget.blur();
                        } else z.key === "Escape" && z.currentTarget.blur();
                      },
                      className: B("h-6 w-12 rounded-lg border px-2 text-xs tabular-nums outline-none", n ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
                    }),
                    y.jsx(Vn, {
                      label: "All levels",
                      position: "bottom",
                      children: y.jsx("button", {
                        type: "button",
                        onClick: () => j(1 / 0),
                        className: B("flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border transition-colors", n ? "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/90" : "border-black/10 bg-black/5 text-black/40 hover:bg-black/10 hover:text-black/90"),
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
  function _3(l, n) {
    if (l.length < 4) return null;
    let a = l[0], o = l[1], i = l[2], c = l[3];
    if (!Number.isFinite(a) || !Number.isFinite(o) || !Number.isFinite(i) || !Number.isFinite(c)) return null;
    const d = Math.max((i - a) * 0.05, (c - o) * 0.05, 1);
    a -= d, o -= d, i += d, c += d;
    const f = i - a, h = c - o, p = n / f, v = n / h, x = Math.min(p, v), S = f * x, E = h * x, k = (n - S) / 2, b = (n - E) / 2;
    return {
      minX: a,
      minY: o,
      maxX: i,
      maxY: c,
      width: f,
      height: h,
      scale: x,
      offsetX: k,
      offsetY: b
    };
  }
  function $a(l, n, a) {
    return {
      x: (l - a.minX) * a.scale + a.offsetX,
      y: (n - a.minY) * a.scale + a.offsetY
    };
  }
  function M3(l, n, a) {
    return {
      x: a.minX + (l - a.offsetX) / a.scale,
      y: a.minY + (n - a.offsetY) / a.scale
    };
  }
  function j3(l, n, a) {
    for (const [, o, i] of a) {
      if (o.length < 3) continue;
      const c = Math.round(i[0] * 255), d = Math.round(i[1] * 255), f = Math.round(i[2] * 255), h = i[3];
      l.fillStyle = `rgba(${c},${d},${f},${h})`, l.beginPath();
      const p = $a(o[0][0], o[0][1], n);
      l.moveTo(p.x, p.y);
      for (let v = 1; v < o.length; v++) {
        const x = $a(o[v][0], o[v][1], n);
        l.lineTo(x.x, x.y);
      }
      l.closePath(), l.fill();
    }
  }
  function L3(l, n, a, o, i, c, d) {
    const f = -a.x / o, h = -a.y / o, p = f + i / o, v = h + c / o, x = $a(f, h, n), S = $a(p, v, n), E = x.x, k = x.y, b = S.x - x.x, C = S.y - x.y;
    l.strokeStyle = d.viewportStroke, l.lineWidth = 1.5, l.setLineDash([
      3,
      3
    ]), l.strokeRect(E, k, b, C), l.fillStyle = d.viewportFill, l.fillRect(E, k, b, C), l.setLineDash([]);
  }
  function R3(l) {
    return {
      canvasBg: l ? "rgb(29,29,29)" : "rgb(241,241,241)",
      viewportStroke: l ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
      viewportFill: l ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    };
  }
  const Fn = 180;
  function zv() {
    const l = g.useRef(null), n = g.useRef(null), a = g.useRef(null), o = g.useRef(null), [i, c] = g.useState(false), d = Ye((H) => H.zoom), f = Ye((H) => H.offset), h = me((H) => H.theme), p = Se((H) => H.library), v = ve((H) => H.layers), x = is((H) => H.isMinimized), S = fe((H) => H.undoStack.length), E = fe((H) => H.redoStack.length), k = ut((H) => H.images), b = he((H) => H.activeCell), C = h === "dark", _ = g.useMemo(() => R3(C), [
      C
    ]);
    g.useEffect(() => {
      const H = l.current;
      if (!H) return;
      const $ = (te) => {
        const J = document.getElementById("rosette-canvas");
        J && (te.preventDefault(), J.dispatchEvent(new WheelEvent("wheel", te)));
      };
      return H.addEventListener("wheel", $, {
        passive: false
      }), () => H.removeEventListener("wheel", $);
    }, []);
    const R = g.useCallback(() => {
      var _a;
      return ((_a = document.getElementById("rosette-canvas")) == null ? void 0 : _a.getBoundingClientRect()) ?? null;
    }, []), j = g.useCallback((H) => {
      var _a;
      const $ = o.current;
      if (!$) return;
      const te = (_a = n.current) == null ? void 0 : _a.getBoundingClientRect();
      if (!te) return;
      const J = H.clientX - te.left, ee = H.clientY - te.top, ge = M3(J, ee, $), Ce = R();
      if (!Ce) return;
      const V = -(ge.x * d) + Ce.width / 2, P = -(ge.y * d) + Ce.height / 2;
      Ye.getState().setOffset(V, P);
    }, [
      d,
      R
    ]), A = g.useCallback((H) => {
      H.stopPropagation(), c(true), j(H);
    }, [
      j
    ]), N = g.useCallback((H) => {
      i && j(H);
    }, [
      i,
      j
    ]), T = g.useCallback(() => {
      c(false);
    }, []), O = g.useCallback(() => {
      c(false);
    }, []);
    if (g.useEffect(() => {
      if (x || !p) return;
      const H = p.get_all_bounds(), $ = [
        ...k.values()
      ].filter((G) => G.cellName === b);
      let te = [];
      try {
        te = p.get_instance_cell_contexts() ?? [];
      } catch {
      }
      const J = /* @__PURE__ */ new Map();
      if (te.length > 0) for (const G of k.values()) {
        const se = J.get(G.cellName);
        se ? se.push(G) : J.set(G.cellName, [
          G
        ]);
      }
      let ee = H ?? null, ge = 1 / 0, Ce = 1 / 0, V = -1 / 0, P = -1 / 0, pe = false;
      for (const G of $) pe = true, ge = Math.min(ge, G.x), Ce = Math.min(Ce, G.y), V = Math.max(V, G.x + G.width), P = Math.max(P, G.y + G.height);
      for (const G of te) {
        const se = J.get(G.cellName);
        if (!se) continue;
        const [Y, re, z, oe, de, _e] = G.transform;
        for (const Ee of se) {
          pe = true;
          const je = [
            [
              Ee.x,
              Ee.y
            ],
            [
              Ee.x + Ee.width,
              Ee.y
            ],
            [
              Ee.x + Ee.width,
              Ee.y + Ee.height
            ],
            [
              Ee.x,
              Ee.y + Ee.height
            ]
          ];
          for (const [we, ze] of je) {
            const Ae = Y * we + re * ze + de, qe = z * we + oe * ze + _e;
            ge = Math.min(ge, Ae), Ce = Math.min(Ce, qe), V = Math.max(V, Ae), P = Math.max(P, qe);
          }
        }
      }
      if (pe && (ee ? ee = new Float64Array([
        Math.min(ee[0], ge),
        Math.min(ee[1], Ce),
        Math.max(ee[2], V),
        Math.max(ee[3], P)
      ]) : ee = new Float64Array([
        ge,
        Ce,
        V,
        P
      ])), !ee) {
        o.current = null, a.current = null;
        return;
      }
      const xe = _3(ee, Fn);
      if (!xe) {
        o.current = null, a.current = null;
        return;
      }
      o.current = xe;
      let be;
      try {
        be = p.get_render_polygons();
      } catch {
        a.current = null;
        return;
      }
      const L = /* @__PURE__ */ new Set();
      for (const [, G] of v) G.visible || L.add(`${G.layerNumber}:${G.datatype}`);
      let I = be ?? [];
      L.size > 0 && I.length > 0 && (I = I.filter(([G]) => {
        const se = p.get_element_info(G);
        if (!se) return true;
        const Y = `${se.layer}:${se.datatype}`, re = L.has(Y);
        return se.free(), !re;
      }));
      const Z = document.createElement("canvas");
      Z.width = Fn, Z.height = Fn;
      const W = Z.getContext("2d");
      if (W) {
        if (W.clearRect(0, 0, Fn, Fn), j3(W, xe, I), pe) {
          W.fillStyle = "rgba(200, 200, 200, 0.3)", W.strokeStyle = "rgba(200, 200, 200, 0.5)", W.lineWidth = 0.5;
          for (const G of $) {
            const se = $a(G.x, G.y, xe), Y = $a(G.x + G.width, G.y + G.height, xe), re = Y.x - se.x, z = Y.y - se.y;
            W.fillRect(se.x, se.y, re, z), W.strokeRect(se.x, se.y, re, z);
          }
          for (const G of te) {
            const se = J.get(G.cellName);
            if (!se) continue;
            const [Y, re, z, oe, de, _e] = G.transform;
            for (const Ee of se) {
              const je = [
                [
                  Ee.x,
                  Ee.y
                ],
                [
                  Ee.x + Ee.width,
                  Ee.y
                ],
                [
                  Ee.x + Ee.width,
                  Ee.y + Ee.height
                ],
                [
                  Ee.x,
                  Ee.y + Ee.height
                ]
              ];
              W.beginPath();
              for (let we = 0; we < je.length; we++) {
                const [ze, Ae] = je[we], qe = Y * ze + re * Ae + de, Be = z * ze + oe * Ae + _e, Qe = $a(qe, Be, xe);
                we === 0 ? W.moveTo(Qe.x, Qe.y) : W.lineTo(Qe.x, Qe.y);
              }
              W.closePath(), W.fill(), W.stroke();
            }
          }
        }
        a.current = Z;
      }
    }, [
      p,
      v,
      x,
      S,
      E,
      k,
      b
    ]), g.useEffect(() => {
      if (x) return;
      const H = n.current;
      if (!H) return;
      const $ = H.getContext("2d");
      if (!$) return;
      const te = o.current;
      if ($.clearRect(0, 0, Fn, Fn), $.fillStyle = _.canvasBg, $.fillRect(0, 0, Fn, Fn), a.current && $.drawImage(a.current, 0, 0), te) {
        const J = R();
        J && J.width > 0 && J.height > 0 && L3($, te, f, d, J.width, J.height, _);
      }
    }, [
      d,
      f,
      x,
      _,
      R,
      S,
      E,
      k,
      b
    ]), x) return null;
    const D = `rounded-xl border p-1 ${C ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"}`;
    return y.jsx("div", {
      className: "pointer-events-none absolute bottom-4 right-4 select-none",
      children: y.jsx("div", {
        ref: l,
        className: `pointer-events-auto relative ${D}`,
        children: y.jsx("canvas", {
          ref: n,
          width: Fn,
          height: Fn,
          className: "pointer-events-auto cursor-move rounded-lg",
          onMouseDown: A,
          onMouseMove: N,
          onMouseUp: T,
          onMouseLeave: O
        })
      })
    });
  }
  const A3 = Qo, N3 = [
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
  function T3({ pattern: l, className: n }) {
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
  function O3({ color: l, isDark: n, onChange: a, hexTabIdx: o }) {
    const [i, c] = g.useState(l), d = g.useRef(null);
    g.useEffect(() => {
      c(l);
    }, [
      l
    ]);
    const f = g.useCallback(() => {
      const p = i.trim().replace(/^#?/, "#");
      /^#[0-9a-fA-F]{6}$/.test(p) ? a(p.toLowerCase()) : c(l);
    }, [
      i,
      l,
      a
    ]), h = g.useCallback((p) => {
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
          children: A3.map((p) => y.jsx("button", {
            type: "button",
            onClick: (v) => {
              v.stopPropagation(), a(p);
            },
            className: B("h-5 w-full rounded border outline-none transition-all", p === l ? "ring-1 ring-offset-1 " + (n ? "ring-white/60 ring-offset-[rgb(29,29,29)]" : "ring-black/60 ring-offset-[rgb(241,241,241)]") : n ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30"),
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
              className: B("h-5 w-5 flex-shrink-0 rounded border", n ? "border-white/10" : "border-black/10"),
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
              onKeyDown: h,
              onClick: (p) => p.stopPropagation(),
              tabIndex: -1,
              className: B("h-6 min-w-0 flex-1 rounded border px-1.5 font-mono text-xs outline-none", n ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
            })
          ]
        })
      ]
    });
  }
  function I3({ value: l, isDark: n, onChange: a, baseTabIdx: o }) {
    return y.jsx("div", {
      className: "grid grid-cols-4 gap-1",
      children: N3.map((i, c) => {
        const d = l === i.id;
        return y.jsx("button", {
          type: "button",
          "data-tab-index": o != null ? o + c : void 0,
          onClick: (f) => {
            f.stopPropagation(), a(i.id);
          },
          className: B("flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1 text-[10px] outline-none transition-colors", d ? n ? "border-white/20 bg-white/10 text-white/90" : "border-black/20 bg-black/10 text-black/90" : n ? "border-white/5 text-white/40 hover:border-white/15 hover:text-white/70 focus:border-white/15 focus:text-white/70" : "border-black/5 text-black/40 hover:border-black/15 hover:text-black/70 focus:border-black/15 focus:text-black/70"),
          tabIndex: -1,
          children: y.jsx(T3, {
            pattern: i.id
          })
        }, i.id);
      })
    });
  }
  function Hv({ label: l, value: n, isDark: a, onChange: o, tabIdx: i }) {
    const [c, d] = g.useState(String(n)), [f, h] = g.useState(false), p = g.useRef(null);
    g.useEffect(() => {
      f || d(String(n));
    }, [
      n,
      f
    ]);
    const v = g.useCallback(() => {
      const x = Number.parseInt(c, 10);
      !Number.isNaN(x) && x >= 0 && x <= Of && x !== n ? o(x) : d(String(n));
    }, [
      c,
      n,
      o
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between",
      children: [
        y.jsx("span", {
          className: B("text-xs select-none", a ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsx("input", {
          ref: p,
          type: "text",
          value: c,
          "data-tab-index": i,
          onChange: (x) => d(x.target.value),
          onFocus: (x) => {
            h(true), x.target.select();
          },
          onBlur: () => {
            h(false), v();
          },
          onKeyDown: (x) => {
            var _a, _b2;
            x.key === "Enter" ? (x.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : x.key === "Escape" && (x.preventDefault(), x.stopPropagation(), d(String(n)), (_b2 = p.current) == null ? void 0 : _b2.blur());
          },
          onClick: (x) => x.stopPropagation(),
          tabIndex: -1,
          className: B("w-16 cursor-text rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors", f ? a ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : a ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function D3({ label: l, value: n, isDark: a, onChange: o, tabIdx: i }) {
    const [c, d] = g.useState(n), [f, h] = g.useState(false), p = g.useRef(null);
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
          className: B("text-xs select-none", a ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsx("input", {
          ref: p,
          type: "text",
          value: c,
          "data-tab-index": i,
          onChange: (x) => d(x.target.value),
          onFocus: (x) => {
            h(true), x.target.select();
          },
          onBlur: () => {
            h(false), v();
          },
          onKeyDown: (x) => {
            var _a, _b2;
            x.key === "Enter" ? (x.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : x.key === "Escape" && (x.preventDefault(), x.stopPropagation(), d(n), (_b2 = p.current) == null ? void 0 : _b2.blur());
          },
          onClick: (x) => x.stopPropagation(),
          tabIndex: -1,
          className: B("w-28 cursor-text truncate rounded border px-1.5 py-0.5 text-right text-xs outline-none transition-colors", f ? a ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : a ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function Lf({ label: l, isDark: n }) {
    return y.jsx("span", {
      className: B("text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function z3({ layer: l, isDark: n }) {
    const a = Se((f) => f.library), o = Se((f) => f.renderer), i = g.useRef(null), c = g.useCallback((f) => {
      if (!a || !o) return;
      const h = {
        ...l,
        ...f
      };
      if (f.layerNumber !== void 0 || f.datatype !== void 0) {
        for (const v of ve.getState().layers.values()) if (v.id !== l.id && v.layerNumber === h.layerNumber && v.datatype === h.datatype) {
          cn.getState().show(`Layer ${h.layerNumber}/${h.datatype} already exists`, "warn");
          return;
        }
      }
      const p = new S0(l, h);
      fe.getState().execute(p, {
        library: a,
        renderer: o
      });
    }, [
      l,
      a,
      o
    ]);
    g.useEffect(() => {
      const f = requestAnimationFrame(() => {
        var _a, _b2;
        (_b2 = (_a = i.current) == null ? void 0 : _a.querySelector("[data-tab-index='0']")) == null ? void 0 : _b2.focus();
      });
      return () => cancelAnimationFrame(f);
    }, []), g.useEffect(() => {
      const f = (h) => {
        var _a;
        if (h.key === "Escape") {
          const p = document.activeElement;
          if (p && ((_a = i.current) == null ? void 0 : _a.contains(p)) && p.tagName === "INPUT") return;
          h.preventDefault(), ve.getState().setExpandedLayerId(null);
        }
      };
      return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
    }, []), g.useEffect(() => {
      const f = (h) => {
        i.current && !i.current.contains(h.target) && ve.getState().setExpandedLayerId(null);
      };
      return document.addEventListener("mousedown", f), () => document.removeEventListener("mousedown", f);
    }, []);
    const d = g.useCallback((f) => {
      if (f.key === "Escape" || (f.stopPropagation(), f.key !== "Tab" || !i.current)) return;
      f.preventDefault();
      const h = Array.from(i.current.querySelectorAll("[data-tab-index]")).sort((S, E) => Number(S.dataset.tabIndex) - Number(E.dataset.tabIndex));
      if (h.length === 0) return;
      const p = h.findIndex((S) => S === document.activeElement), v = f.shiftKey ? -1 : 1, x = p === -1 ? 0 : (p + v + h.length) % h.length;
      h[x].focus();
    }, []);
    return y.jsxs("div", {
      ref: i,
      role: "group",
      className: "mx-1 flex w-[calc(100%-8px)] flex-col gap-2 px-2.5 py-2",
      onClick: (f) => f.stopPropagation(),
      onKeyDown: d,
      onMouseDown: (f) => f.stopPropagation(),
      children: [
        y.jsx(D3, {
          label: "Name",
          value: l.name,
          isDark: n,
          onChange: (f) => c({
            name: f
          }),
          tabIdx: 0
        }),
        y.jsx("div", {
          className: B("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsxs("div", {
          className: "flex flex-col gap-1.5",
          children: [
            y.jsx(Lf, {
              label: "Color",
              isDark: n
            }),
            y.jsx(O3, {
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
          className: B("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsxs("div", {
          className: "flex flex-col gap-1",
          children: [
            y.jsx(Lf, {
              label: "GDS",
              isDark: n
            }),
            y.jsx(Hv, {
              label: "Layer",
              value: l.layerNumber,
              isDark: n,
              onChange: (f) => c({
                layerNumber: f
              }),
              tabIdx: 2
            }),
            y.jsx(Hv, {
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
          className: B("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsxs("div", {
          className: "flex flex-col gap-1.5",
          children: [
            y.jsx(Lf, {
              label: "Fill",
              isDark: n
            }),
            y.jsx(I3, {
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
  function H3({ layer: l, isActive: n, isFocused: a, isExpanded: o, isDark: i, onSelect: c, onToggleExpand: d, startEditing: f }) {
    const [h, p] = g.useState(false), [v, x] = g.useState(l.name), S = g.useRef(null), E = g.useRef(null);
    g.useEffect(() => {
      a && E.current && E.current.scrollIntoView({
        block: "nearest"
      });
    }, [
      a
    ]), g.useEffect(() => {
      f && (p(true), x(l.name), ve.getState().setEditingLayerId(null));
    }, [
      f,
      l.name
    ]), g.useEffect(() => {
      h && S.current && (S.current.focus(), S.current.select());
    }, [
      h
    ]);
    const k = Se((N) => N.library), b = Se((N) => N.renderer), C = g.useCallback(() => {
      const N = v.trim();
      if (N && N !== l.name && k && b) {
        const T = new S0(l, {
          ...l,
          name: N
        });
        fe.getState().execute(T, {
          library: k,
          renderer: b
        });
      } else x(l.name);
      p(false);
    }, [
      v,
      l,
      k,
      b
    ]), _ = g.useCallback((N) => {
      N.key === "Enter" ? C() : N.key === "Escape" && (x(l.name), p(false));
    }, [
      C,
      l.name
    ]), R = g.useCallback((N) => {
      N.preventDefault(), N.stopPropagation(), cs.getState().open("layer", {
        x: N.clientX,
        y: N.clientY
      }, String(l.id));
    }, [
      l.id
    ]), j = g.useCallback((N) => {
      N.stopPropagation(), c(), d();
    }, [
      c,
      d
    ]), A = g.useCallback((N) => {
      o && N.stopPropagation();
    }, [
      o
    ]);
    return y.jsxs("div", {
      className: "flex flex-col gap-0.5",
      children: [
        y.jsxs("button", {
          ref: E,
          type: "button",
          className: B("group relative mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-[7px] py-1.5 text-left transition-colors", n ? i ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : a ? i ? "bg-[rgb(44,44,44)] text-white/90" : "bg-[rgb(227,227,227)] text-black/90" : i ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90", a && (i ? "ring-1 ring-white/25" : "ring-1 ring-black/20")),
          onClick: c,
          onContextMenu: R,
          onMouseDown: (N) => N.preventDefault(),
          tabIndex: -1,
          children: [
            y.jsx("span", {
              role: "img",
              className: B("h-4.5 w-4.5 flex-shrink-0 cursor-pointer rounded border outline-none transition-shadow", i ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30", !l.visible && "opacity-40"),
              style: {
                backgroundColor: l.color
              },
              onClick: j,
              onMouseDown: A,
              onKeyDown: () => {
              }
            }),
            y.jsx("div", {
              className: "relative h-5 min-w-0 flex-1",
              children: h ? y.jsx("input", {
                ref: S,
                type: "text",
                value: v,
                onChange: (N) => x(N.target.value),
                onBlur: C,
                onKeyDown: _,
                onClick: (N) => N.stopPropagation(),
                className: B("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", i ? "text-white/90" : "text-gray-900")
              }) : y.jsx("span", {
                className: B("absolute inset-0 truncate text-sm leading-5 select-none", !l.visible && "opacity-40"),
                onDoubleClick: (N) => {
                  N.stopPropagation(), p(true);
                },
                children: l.name
              })
            }),
            y.jsxs("div", {
              className: B("flex flex-shrink-0 items-center self-center font-mono text-xs", !l.visible && "opacity-40"),
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
        o && y.jsx(z3, {
          layer: l,
          isDark: i
        })
      ]
    });
  }
  function Y3() {
    const n = me((b) => b.theme) === "dark", { getAllLayers: a, activeLayerId: o, setActiveLayer: i } = ve(), c = ve((b) => b.editingLayerId), d = ve((b) => b.expandedLayerId), f = ve((b) => b.setExpandedLayerId), h = ve((b) => b.isFocused), p = ve((b) => b.focusedLayerId), v = ve((b) => b.setFocused), x = ve((b) => b.setFocusedLayerId);
    Hl("layers-panel", h);
    const S = a(), E = g.useRef(null), k = g.useCallback((b) => {
      const C = ve.getState().expandedLayerId;
      f(C === b ? null : b);
    }, [
      f
    ]);
    return g.useEffect(() => {
      if (!h) return;
      const b = (C) => {
        E.current && !E.current.contains(C.target) && v(false);
      };
      return document.addEventListener("mousedown", b), () => document.removeEventListener("mousedown", b);
    }, [
      h,
      v
    ]), g.useEffect(() => {
      if (!h) return;
      const b = (C) => {
        if (C.target instanceof HTMLInputElement || C.target instanceof HTMLTextAreaElement) return;
        const { focusedLayerId: _, editingLayerId: R, expandedLayerId: j } = ve.getState();
        if (R || j) return;
        const A = ve.getState().getAllLayers();
        if (A.length === 0) return;
        const N = _ != null ? A.findIndex((T) => T.id === _) : -1;
        switch (C.key) {
          case "ArrowDown": {
            C.preventDefault();
            const T = N < A.length - 1 ? N + 1 : 0;
            x(A[T].id);
            break;
          }
          case "ArrowUp": {
            C.preventDefault();
            const T = N > 0 ? N - 1 : A.length - 1;
            x(A[T].id);
            break;
          }
          case " ": {
            C.preventDefault(), _ != null && i(_);
            break;
          }
          case "Enter": {
            if (C.preventDefault(), _ != null) {
              const T = ve.getState().expandedLayerId;
              f(T === _ ? null : _);
            }
            break;
          }
          case "Delete":
          case "Backspace": {
            if (C.preventDefault(), _ != null && A.length > 1) {
              const { library: T, renderer: O } = Se.getState();
              if (T && O) {
                const D = N < A.length - 1 ? N + 1 : N - 1, H = D >= 0 ? A[D].id : null, $ = new ah(_);
                fe.getState().execute($, {
                  library: T,
                  renderer: O
                }), H != null && H !== _ && x(H);
              }
            }
            break;
          }
          case "z":
          case "Z": {
            if (!(C.metaKey || C.ctrlKey)) return;
            C.preventDefault();
            const { library: O, renderer: D } = Se.getState();
            if (!O || !D) break;
            C.shiftKey ? fe.getState().redo({
              library: O,
              renderer: D
            }) : fe.getState().undo({
              library: O,
              renderer: D
            });
            break;
          }
          case "Escape": {
            C.preventDefault(), v(false);
            break;
          }
          default:
            return;
        }
      };
      return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
    }, [
      h,
      v,
      x,
      i,
      f
    ]), y.jsx("div", {
      className: "flex h-full flex-col",
      children: y.jsx("div", {
        ref: E,
        className: "flex flex-1 flex-col gap-0.5 overflow-y-auto py-1",
        onWheel: (b) => b.stopPropagation(),
        children: S.map((b) => y.jsx(H3, {
          layer: b,
          isActive: b.id === o,
          isFocused: h && b.id === p,
          isExpanded: d === b.id,
          isDark: n,
          onSelect: () => i(b.id),
          onToggleExpand: () => k(b.id),
          startEditing: c === b.id
        }, b.id))
      })
    });
  }
  function ct({ label: l, value: n, unit: a, isDark: o, onChange: i, readOnly: c }) {
    const [d, f] = g.useState(false), [h, p] = g.useState(n), v = g.useRef(null), x = g.useRef(false), S = g.useRef(true);
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
    const E = g.useCallback(() => {
      if (x.current) {
        x.current = false, f(false);
        return;
      }
      if (!S.current) return;
      const b = Number.parseFloat(h);
      !Number.isNaN(b) && i && i(b), f(false);
    }, [
      h,
      i
    ]), k = g.useCallback((b) => {
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
          className: B("text-xs select-none", c ? o ? "text-white/30" : "text-black/30" : o ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsxs("div", {
          className: "flex items-center gap-1",
          children: [
            d && !c ? y.jsx("input", {
              ref: v,
              type: "text",
              value: h,
              onChange: (b) => p(b.target.value),
              onBlur: E,
              onKeyDown: k,
              onClick: (b) => b.stopPropagation(),
              className: B("w-20 rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none", o ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
            }) : y.jsx("button", {
              type: "button",
              onClick: () => {
                !c && i && (p(n), f(true));
              },
              onFocus: () => {
                !c && i && (p(n), f(true));
              },
              className: B("w-20 rounded border border-transparent px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors", c ? o ? "text-white/30" : "text-black/30" : o ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
              tabIndex: c ? -1 : 0,
              children: n
            }),
            a && y.jsx("span", {
              className: B("w-6 text-xs select-none", c ? o ? "text-white/20" : "text-black/20" : o ? "text-white/40" : "text-black/40"),
              children: a
            })
          ]
        })
      ]
    });
  }
  function B3({ label: l, value: n, isDark: a, onChange: o }) {
    const [i, c] = g.useState(false), [d, f] = g.useState(n), h = g.useRef(null), p = g.useRef(false), v = g.useRef(true);
    g.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), g.useEffect(() => {
      i || f(n);
    }, [
      n,
      i
    ]), g.useEffect(() => {
      i && h.current && (h.current.focus(), h.current.select());
    }, [
      i
    ]);
    const x = g.useCallback(() => {
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
    ]), S = g.useCallback((E) => {
      var _a, _b2;
      E.key === "Enter" ? (E.preventDefault(), (_a = h.current) == null ? void 0 : _a.blur()) : E.key === "Escape" && (E.preventDefault(), E.stopPropagation(), p.current = true, f(n), (_b2 = h.current) == null ? void 0 : _b2.blur());
    }, [
      n
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      "data-field": l,
      children: [
        y.jsx("span", {
          className: B("text-xs select-none", a ? "text-white/50" : "text-black/50"),
          children: l
        }),
        i ? y.jsx("input", {
          ref: h,
          type: "text",
          value: d,
          onChange: (E) => f(E.target.value),
          onBlur: x,
          onKeyDown: S,
          onClick: (E) => E.stopPropagation(),
          className: B("w-32 rounded border px-1.5 py-0.5 text-right text-xs outline-none", a ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
        }) : y.jsx("button", {
          type: "button",
          onClick: () => c(true),
          onFocus: () => c(true),
          className: B("w-32 truncate rounded border border-transparent px-1.5 py-0.5 text-right text-xs outline-none transition-colors", a ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
          tabIndex: 0,
          children: n
        })
      ]
    });
  }
  function X3({ label: l, value: n, isDark: a, onChange: o }) {
    const [i, c] = g.useState(false), [d, f] = g.useState(n), h = g.useRef(null), p = g.useRef(false), v = g.useRef(true);
    g.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), g.useEffect(() => {
      i || f(n);
    }, [
      n,
      i
    ]), g.useEffect(() => {
      i && h.current && (h.current.focus(), h.current.select());
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
      b.key === "Enter" && !b.shiftKey ? (b.preventDefault(), (_a = h.current) == null ? void 0 : _a.blur()) : b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), p.current = true, f(n), (_b2 = h.current) == null ? void 0 : _b2.blur());
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
            className: B("text-xs select-none", a ? "text-white/50" : "text-black/50"),
            children: l
          })
        }),
        i ? y.jsx("textarea", {
          ref: h,
          value: d,
          onChange: (b) => f(b.target.value),
          onBlur: x,
          onKeyDown: S,
          onClick: (b) => b.stopPropagation(),
          rows: Math.min(6, Math.max(2, d.split(`
`).length)),
          className: B("w-full resize-none rounded border px-1.5 py-1 font-mono text-xs leading-relaxed outline-none", a ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
        }) : y.jsx("button", {
          type: "button",
          onClick: () => c(true),
          onFocus: () => c(true),
          className: B("w-full whitespace-pre-wrap rounded border border-transparent px-1.5 py-1 text-left font-mono text-xs leading-relaxed outline-none transition-colors", a ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
          tabIndex: 0,
          children: k || y.jsx("span", {
            className: a ? "text-white/30" : "text-black/30",
            children: "Empty"
          })
        })
      ]
    });
  }
  function Rf({ currentLayer: l, currentDatatype: n, isDark: a, onChange: o }) {
    const i = ve((T) => T.getAllLayers)(), [c, d] = g.useState(`${l}:${n}`), [f, h] = g.useState(false), [p, v] = g.useState(-1);
    Hl("layer-selector", f);
    const x = g.useRef(null), S = g.useRef(null), E = `${l}:${n}`;
    g.useEffect(() => {
      d(E);
    }, [
      E
    ]);
    const k = i.find((T) => `${T.layerNumber}:${T.datatype}` === c), [b, C] = g.useState({
      top: 0,
      right: 0,
      width: 0
    }), _ = g.useCallback(() => {
      if (!x.current) return;
      const T = x.current.getBoundingClientRect();
      C({
        top: T.bottom + 4,
        right: window.innerWidth - T.right,
        width: Math.max(T.width, 160)
      });
      const O = i.findIndex((D) => `${D.layerNumber}:${D.datatype}` === c);
      v(O >= 0 ? O : 0), h(true);
    }, [
      i,
      c
    ]), R = g.useCallback(() => {
      var _a;
      h(false), (_a = x.current) == null ? void 0 : _a.focus();
    }, []), j = g.useCallback((T) => {
      d(`${T.layerNumber}:${T.datatype}`), o(T.layerNumber, T.datatype), R();
    }, [
      o,
      R
    ]);
    g.useEffect(() => {
      f && S.current && S.current.focus();
    }, [
      f
    ]), g.useEffect(() => {
      if (!f) return;
      const T = (O) => {
        var _a, _b2;
        ((_a = x.current) == null ? void 0 : _a.contains(O.target)) || ((_b2 = S.current) == null ? void 0 : _b2.contains(O.target)) || h(false);
      };
      return document.addEventListener("mousedown", T), () => document.removeEventListener("mousedown", T);
    }, [
      f
    ]);
    const A = g.useCallback((T) => {
      (T.key === "ArrowDown" || T.key === "ArrowUp" || T.key === "Enter" || T.key === " ") && (T.preventDefault(), _());
    }, [
      _
    ]), N = g.useCallback((T) => {
      switch (T.key) {
        case "ArrowDown":
          T.preventDefault(), T.stopPropagation(), v((O) => Math.min(O + 1, i.length - 1));
          break;
        case "ArrowUp":
          T.preventDefault(), T.stopPropagation(), v((O) => Math.max(O - 1, 0));
          break;
        case "Enter":
        case " ": {
          T.preventDefault(), T.stopPropagation();
          const O = i[p];
          O && j(O);
          break;
        }
        case "Escape":
        case "Tab":
          T.preventDefault(), T.stopPropagation(), R();
          break;
      }
    }, [
      i,
      p,
      j,
      R
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      children: [
        y.jsx("span", {
          className: B("text-xs select-none", a ? "text-white/50" : "text-black/50"),
          children: "Layer"
        }),
        y.jsxs("button", {
          ref: x,
          type: "button",
          onClick: () => f ? R() : _(),
          onKeyDown: A,
          className: B("flex max-w-36 items-center gap-1.5 rounded-lg border px-1.5 py-0.5 text-xs outline-none transition-colors", a ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 focus-visible:border-white/40" : "border-black/10 bg-black/5 text-black/90 hover:bg-black/10 focus-visible:border-black/40"),
          children: [
            k && y.jsx("div", {
              className: B("h-3 w-3 flex-shrink-0 rounded-sm border", a ? "border-white/10" : "border-black/10"),
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
              className: B("flex-shrink-0 transition-transform", f && "rotate-180", a ? "text-white/40" : "text-black/40"),
              children: y.jsx("path", {
                d: "M4 6l4 4 4-4",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5"
              })
            })
          ]
        }),
        f && hs.createPortal(y.jsx("div", {
          ref: S,
          role: "listbox",
          tabIndex: -1,
          onKeyDown: N,
          className: B("fixed z-50 overflow-y-auto rounded-xl border py-1 shadow-lg outline-none", a ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: {
            top: b.top,
            right: b.right,
            minWidth: b.width,
            maxHeight: 200
          },
          children: i.map((T, O) => {
            const H = `${T.layerNumber}:${T.datatype}` === c, $ = O === p;
            return y.jsxs("div", {
              "data-layer-option": true,
              role: "option",
              "aria-selected": H,
              className: B("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", $ ? a ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : a ? "text-white/70" : "text-black/70"),
              onMouseDown: (te) => {
                te.preventDefault(), j(T);
              },
              onMouseEnter: () => v(O),
              children: [
                y.jsx("div", {
                  className: B("h-3.5 w-3.5 flex-shrink-0 rounded-sm border", a ? "border-white/10" : "border-black/10"),
                  style: {
                    backgroundColor: T.color
                  }
                }),
                y.jsx("span", {
                  className: "flex-1 truncate",
                  children: T.name
                }),
                y.jsxs("span", {
                  className: B("flex-shrink-0 font-mono text-[11px]", a ? "text-white/40" : "text-black/40"),
                  children: [
                    T.layerNumber,
                    "/",
                    T.datatype
                  ]
                }),
                H && y.jsx("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 16 16",
                  className: B("flex-shrink-0", a ? "text-white/70" : "text-black/70"),
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
            }, T.id);
          })
        }), document.body)
      ]
    });
  }
  function Ot({ label: l, isDark: n }) {
    return y.jsx("div", {
      className: B("px-3 pt-2.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function ex({ index: l, x: n, y: a, unit: o, isDark: i, canRemove: c, onChangeX: d, onChangeY: f, onRemove: h, readOnly: p }) {
    return y.jsxs("div", {
      "data-vertex-row": true,
      children: [
        y.jsxs("div", {
          className: "flex items-center justify-between px-3 pt-1.5 pb-0",
          children: [
            y.jsxs("span", {
              className: B("text-[10px] font-mono select-none", i ? "text-white/30" : "text-black/30"),
              children: [
                "V",
                l
              ]
            }),
            !p && y.jsx("button", {
              type: "button",
              onClick: h,
              disabled: !c,
              className: B("flex-shrink-0 rounded p-0.5 transition-colors", c ? i ? "text-white/40 hover:bg-white/10 hover:text-white/70" : "text-black/40 hover:bg-black/10 hover:text-black/70" : i ? "cursor-not-allowed text-white/10" : "cursor-not-allowed text-black/10"),
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
        y.jsx(ct, {
          label: "X",
          value: n,
          unit: o,
          isDark: i,
          onChange: d,
          readOnly: p
        }),
        y.jsx(ct, {
          label: "Y",
          value: a,
          unit: o,
          isDark: i,
          onChange: f,
          readOnly: p
        })
      ]
    });
  }
  function Yv({ vertices: l, unitInfo: n, isDark: a, onChangeVertex: o, onRemoveVertex: i, onAddVertex: c, readOnly: d, label: f }) {
    const h = l.length / 2, p = h > 3, v = g.useRef(null), [x, S] = g.useState(null);
    g.useEffect(() => {
      if (x === null) return;
      const b = x;
      let C, _ = 0;
      const R = 10, j = () => {
        const A = v.current;
        if (!A) {
          S(null);
          return;
        }
        const N = A.querySelectorAll("[data-vertex-row]");
        if (N.length <= b) {
          if (_++, _ >= R) {
            S(null);
            return;
          }
          C = requestAnimationFrame(j);
          return;
        }
        A.scrollTop = A.scrollHeight;
        const T = N[N.length - 1];
        if (T) {
          const O = T.querySelector("[data-field='X'] button");
          O && O.focus();
        }
        S(null);
      };
      return C = requestAnimationFrame(j), () => cancelAnimationFrame(C);
    }, [
      x
    ]);
    const E = g.useCallback(() => {
      c(), S(h);
    }, [
      c,
      h
    ]), k = [];
    for (let b = 0; b < h; b++) {
      const C = l[b * 2], _ = l[b * 2 + 1], R = et(C / ye, n), j = et(-_ / ye, n);
      k.push(y.jsx(ex, {
        index: b,
        x: R,
        y: j,
        unit: n.unit,
        isDark: a,
        canRemove: p,
        onChangeX: (A) => o(b, "x", A),
        onChangeY: (A) => o(b, "y", A),
        onRemove: () => i(b),
        readOnly: d
      }, b));
    }
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(Ot, {
          label: f ?? "Vertices",
          isDark: a
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
            className: B("flex w-full items-center justify-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors", a ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-black/10 text-black/50 hover:bg-black/5 hover:text-black/70"),
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
  function U3() {
    const l = ue((i) => i.selectedIds), n = Se((i) => i.library), [a, o] = g.useState(0);
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
          const [E, k, b, C, _, R] = S.transform, j = n.get_cell_origin_by_name(S.cell_name), A = j ? j[0] : 0, N = j ? j[1] : 0, O = Math.atan2(b, E) * 180 / Math.PI, D = Math.sqrt(E * E + b * b), H = n.get_cell_ref_array(c);
          let $ = null;
          H && H.length === 4 && ($ = {
            columns: H[0],
            rows: H[1],
            colSpacing: H[2],
            rowSpacing: H[3]
          }), i = {
            cellName: S.cell_name,
            x: E * A + k * N + _,
            y: b * A + C * N + R,
            tx: _,
            ty: R,
            rotation: O,
            scale: D,
            transform: new Float64Array(S.transform),
            childOriginX: A,
            childOriginY: N,
            array: $,
            refId: c,
            ids: [
              ...l
            ]
          }, S.free();
        }
      }
      const d = [];
      for (const S of l) {
        const E = n.get_element_info(S);
        E && (d.push({
          id: S,
          layer: E.layer,
          datatype: E.datatype,
          vertexCount: E.vertices.length / 2,
          vertices: new Float64Array(E.vertices)
        }), E.free());
      }
      if (d.length === 0) return null;
      const f = n.get_bounds_for_ids([
        ...l
      ]), h = f ? {
        minX: f[0],
        minY: f[1],
        maxX: f[2],
        maxY: f[3]
      } : null, p = d[0].layer, v = d[0].datatype, x = d.some((S) => S.layer !== p || S.datatype !== v);
      return {
        elements: d,
        bounds: h,
        isMixed: x,
        instance: i
      };
    }, [
      l,
      n,
      a
    ]);
  }
  const $3 = {
    unit: "\xB5m",
    scale: 1e3
  };
  function V3() {
    var _a, _b2, _c, _d2;
    const n = me((Y) => Y.theme) === "dark", a = $3, o = U3(), i = Se((Y) => Y.library), c = Se((Y) => Y.renderer), d = he((Y) => Y.activeCell);
    fe((Y) => Y.undoStack.length + Y.redoStack.length);
    const f = tt((Y) => Y.pathMetadata), h = ue((Y) => Y.selectedIds), p = ut((Y) => Y.images), v = g.useMemo(() => {
      for (const Y of h) if (xn(Y)) return Ln(Y);
      return null;
    }, [
      h
    ]), x = v ? p.get(v) ?? null : null, S = i == null ? void 0 : i.get_cell_origin(), E = S ? {
      x: S[0],
      y: S[1]
    } : {
      x: 0,
      y: 0
    }, k = g.useRef(E);
    k.current = E;
    const b = g.useRef(void 0), C = g.useRef(void 0), _ = g.useCallback((Y) => {
      if (!d || !i || !c || Y === d) return;
      const re = new E0(d, Y);
      fe.getState().execute(re, {
        library: i,
        renderer: c
      });
    }, [
      d,
      i,
      c
    ]), R = g.useCallback((Y, re) => {
      if (!i || !c) return;
      const z = re * a.scale, oe = Y === "y" ? -z * ye : z * ye, de = k.current, _e = new KS(de.x, de.y, Y === "x" ? oe : de.x, Y === "y" ? oe : de.y);
      fe.getState().execute(_e, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c,
      a
    ]), j = g.useCallback((Y, re) => {
      if (!o || !i || !c) return;
      const z = o.elements.map((de) => de.id), oe = new jy(z, Y, re);
      fe.getState().execute(oe, {
        library: i,
        renderer: c
      });
    }, [
      o,
      i,
      c
    ]), A = g.useCallback((Y, re) => {
      if (!(o == null ? void 0 : o.bounds) || !i || !c) return;
      const z = re * a.scale, oe = Y === "y" ? -z * ye : z * ye, de = o.elements.map((Ee) => Ee.id), _e = new PS(de, o.bounds.minX, o.bounds.minY, Y === "x" ? oe : o.bounds.minX, Y === "y" ? oe - (o.bounds.maxY - o.bounds.minY) : o.bounds.minY);
      fe.getState().execute(_e, {
        library: i,
        renderer: c
      });
    }, [
      o,
      i,
      c,
      a
    ]), N = g.useCallback((Y, re) => {
      if (!(o == null ? void 0 : o.bounds) || !i || !c) return;
      const oe = re * a.scale * ye;
      if (oe <= 0) return;
      const de = o.bounds.maxX - o.bounds.minX, _e = o.bounds.maxY - o.bounds.minY, Ee = o.elements.map((we) => we.id), je = new GS(Ee, o.bounds, Y === "width" ? oe : de, Y === "height" ? oe : _e);
      fe.getState().execute(je, {
        library: i,
        renderer: c
      });
    }, [
      o,
      i,
      c,
      a
    ]), T = g.useCallback((Y, re, z) => {
      if (!o || !i || !c) return;
      const oe = o.elements[0];
      if (!oe) return;
      const de = new Float64Array(oe.vertices), _e = z * a.scale, Ee = re === "y" ? -_e * ye : _e * ye;
      de[Y * 2 + (re === "x" ? 0 : 1)] = Ee;
      const je = new Od(oe.id, de, "Edit vertex");
      fe.getState().execute(je, {
        library: i,
        renderer: c
      });
    }, [
      o,
      i,
      c,
      a
    ]), O = g.useCallback((Y) => {
      if (!o || !i || !c) return;
      const re = o.elements[0];
      if (!re || re.vertexCount <= 3) return;
      const z = new Float64Array(re.vertices.length - 2);
      let oe = 0;
      for (let _e = 0; _e < re.vertexCount; _e++) _e !== Y && (z[oe] = re.vertices[_e * 2], z[oe + 1] = re.vertices[_e * 2 + 1], oe += 2);
      const de = new Od(re.id, z, "Remove vertex");
      fe.getState().execute(de, {
        library: i,
        renderer: c
      });
    }, [
      o,
      i,
      c
    ]), D = g.useCallback(() => {
      if (!o || !i || !c) return;
      const Y = o.elements[0];
      if (!Y) return;
      const re = Y.vertexCount, z = Y.vertices[(re - 1) * 2], oe = Y.vertices[(re - 1) * 2 + 1], de = Y.vertices[0], _e = Y.vertices[1], Ee = (z + de) / 2, je = (oe + _e) / 2, we = new Float64Array(Y.vertices.length + 2);
      we.set(Y.vertices), we[Y.vertices.length] = Ee, we[Y.vertices.length + 1] = je;
      const ze = new Od(Y.id, we, "Add vertex");
      fe.getState().execute(ze, {
        library: i,
        renderer: c
      });
    }, [
      o,
      i,
      c
    ]), H = g.useRef(null);
    g.useEffect(() => {
      const Y = H.current;
      if (!Y) return;
      const re = (z) => {
        if (z.key !== "Escape" && z.key === "Tab") {
          z.stopPropagation(), z.preventDefault();
          const oe = Array.from(Y.querySelectorAll("input, textarea, button:not([tabindex='-1']):not([data-layer-option])"));
          if (oe.length === 0) return;
          const de = oe.indexOf(document.activeElement), _e = z.shiftKey ? (de - 1 + oe.length) % oe.length : (de + 1) % oe.length;
          oe[_e].focus();
        }
      };
      return Y.addEventListener("keydown", re), () => Y.removeEventListener("keydown", re);
    }, []);
    const $ = me((Y) => Y.inspectorFocusRequested), te = me((Y) => Y.inspectorFocusField);
    g.useEffect(() => {
      !$ || !H.current || (me.getState().clearInspectorFocus(), requestAnimationFrame(() => {
        const Y = H.current;
        if (!Y) return;
        let re = null;
        if (te) {
          const z = Y.querySelector(`[data-field="${te}"]`);
          z && (re = z.querySelector("button:not([tabindex='-1']), input, textarea"));
        }
        re || (re = Y.querySelector("input, textarea, button:not([tabindex='-1']):not([data-layer-option])")), re && re.focus();
      }));
    }, [
      $,
      te
    ]);
    const J = g.useCallback((Y) => {
      const re = b.current, z = C.current;
      if (!re || !z || !i || !c || !ue.getState().selectedIds.has(z)) return;
      const oe = Y * a.scale * ye;
      if (oe <= 0) return;
      const de = new Uo(z, re, {
        ...re,
        width: oe
      }, "Change path width");
      fe.getState().execute(de, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c,
      a
    ]), ee = g.useCallback((Y) => {
      const re = b.current, z = C.current;
      if (!re || !z || !i || !c || !ue.getState().selectedIds.has(z)) return;
      const oe = Y * a.scale * ye;
      if (oe < 0) return;
      const de = new Uo(z, re, {
        ...re,
        cornerRadius: oe
      }, "Change path corner radius");
      fe.getState().execute(de, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c,
      a
    ]), ge = g.useCallback((Y, re, z) => {
      const oe = b.current, de = C.current;
      if (!oe || !de || !i || !c || !ue.getState().selectedIds.has(de)) return;
      const _e = z * a.scale, Ee = re === "y" ? -_e * ye : _e * ye, je = oe.waypoints.map((ze, Ae) => Ae !== Y ? ze : re === "x" ? {
        x: Ee,
        y: ze.y
      } : {
        x: ze.x,
        y: Ee
      }), we = new Uo(de, oe, {
        ...oe,
        waypoints: je
      }, "Edit path waypoint");
      fe.getState().execute(we, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c,
      a
    ]), Ce = g.useCallback(() => {
      const Y = b.current, re = C.current;
      if (!Y || !re || !i || !c || !ue.getState().selectedIds.has(re)) return;
      const z = Y.waypoints, oe = z[z.length - 1], de = z[z.length - 2];
      let _e = oe.x - de.x, Ee = oe.y - de.y;
      _e === 0 && Ee === 0 && (_e = ye);
      const je = {
        x: oe.x + _e,
        y: oe.y + Ee
      }, we = new Uo(re, Y, {
        ...Y,
        waypoints: [
          ...z,
          je
        ]
      }, "Add path waypoint");
      fe.getState().execute(we, {
        library: i,
        renderer: c
      });
    }, [
      i,
      c
    ]);
    if (!o && x) {
      const Y = et(x.x / ye, a), re = et(-x.y / ye, a), z = et(x.width / ye, a), oe = et(x.height / ye, a), de = x.lockAspectRatio, _e = (we, ze) => {
        if (!i || !c || !v) return;
        const Ae = ut.getState().images.get(v);
        if (!Ae) return;
        const qe = ze * a.scale, Be = we === "y" ? -qe * ye : qe * ye, Qe = new e2(v, Ae.x, Ae.y, we === "x" ? Be : Ae.x, we === "y" ? Be : Ae.y);
        fe.getState().execute(Qe, {
          library: i,
          renderer: c
        });
      }, Ee = (we, ze) => {
        if (!i || !c || !v) return;
        const Ae = ut.getState().images.get(v);
        if (!Ae) return;
        const Be = ze * a.scale * ye;
        if (Be <= 0) return;
        let Qe, Xe;
        if (Ae.lockAspectRatio) {
          const jt = Ae.naturalHeight / Ae.naturalWidth;
          we === "width" ? (Qe = Be, Xe = Be * jt) : (Xe = Be, Qe = Be / jt);
        } else Qe = we === "width" ? Be : Ae.width, Xe = we === "height" ? Be : Ae.height;
        const vt = new n2(v, Ae.width, Ae.height, Qe, Xe);
        fe.getState().execute(vt, {
          library: i,
          renderer: c
        });
      }, je = () => {
        v && ut.getState().updateImage(v, {
          lockAspectRatio: !de
        });
      };
      return y.jsxs("div", {
        ref: H,
        className: "flex flex-col pb-2",
        onWheel: (we) => we.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsx("span", {
              className: B("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: "Image"
            })
          }),
          y.jsx("div", {
            className: B("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "File",
            isDark: n
          }),
          y.jsxs("div", {
            className: "flex items-center justify-between gap-2 px-3 py-1",
            children: [
              y.jsx("span", {
                className: B("text-xs select-none", n ? "text-white/50" : "text-black/50"),
                children: "Name"
              }),
              y.jsx("span", {
                className: B("max-w-32 truncate text-right text-xs", n ? "text-white/90" : "text-black/90"),
                title: x.filename,
                children: x.filename
              })
            ]
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Position",
            isDark: n
          }),
          y.jsx(ct, {
            label: "X",
            value: Y,
            unit: a.unit,
            isDark: n,
            onChange: (we) => _e("x", we)
          }),
          y.jsx(ct, {
            label: "Y",
            value: re,
            unit: a.unit,
            isDark: n,
            onChange: (we) => _e("y", we)
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Size",
            isDark: n
          }),
          y.jsx(ct, {
            label: "W",
            value: z,
            unit: a.unit,
            isDark: n,
            onChange: (we) => Ee("width", we)
          }),
          y.jsx(ct, {
            label: "H",
            value: oe,
            unit: a.unit,
            isDark: n,
            onChange: (we) => Ee("height", we)
          }),
          y.jsxs("div", {
            className: "flex items-center justify-between gap-2 px-3 py-1.5",
            children: [
              y.jsx("span", {
                className: B("text-xs select-none", n ? "text-white/50" : "text-black/50"),
                children: "Lock ratio"
              }),
              y.jsxs("button", {
                type: "button",
                onClick: je,
                className: B("flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-xs transition-colors", de ? n ? "border-white/20 bg-white/10 text-white/80" : "border-black/20 bg-black/10 text-black/80" : n ? "border-white/10 text-white/40 hover:text-white/60" : "border-black/10 text-black/40 hover:text-black/60"),
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
                    children: de ? y.jsxs(y.Fragment, {
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
                  de ? "On" : "Off"
                ]
              })
            ]
          })
        ]
      });
    }
    if (!o) {
      const Y = et(E.x / ye, a), re = et(-E.y / ye, a);
      return y.jsxs("div", {
        ref: H,
        className: "flex flex-col pb-2",
        onWheel: (z) => z.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsx("span", {
              className: B("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: "Cell"
            })
          }),
          y.jsx("div", {
            className: B("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Name",
            isDark: n
          }),
          d ? y.jsx(B3, {
            label: "Name",
            value: d,
            isDark: n,
            onChange: _
          }) : y.jsx("div", {
            className: "px-3 py-1",
            children: y.jsx("span", {
              className: B("text-xs italic select-none", n ? "text-white/40" : "text-black/40"),
              children: "No cell"
            })
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Origin",
            isDark: n
          }),
          y.jsx(ct, {
            label: "X",
            value: Y,
            unit: a.unit,
            isDark: n,
            onChange: (z) => R("x", z)
          }),
          y.jsx(ct, {
            label: "Y",
            value: re,
            unit: a.unit,
            isDark: n,
            onChange: (z) => R("y", z)
          })
        ]
      });
    }
    const { elements: V, bounds: P, isMixed: pe } = o, xe = V.length === 1, be = V[0], L = V.every((Y) => Y.id.startsWith("ref:")) || i != null && i.get_group_ids(be.id).length > 1;
    if (xe && i && i.is_text_element(be.id)) {
      const Y = i.get_text_element_info(be.id);
      if (Y) {
        const re = et(Y.x / ye, a), z = et(-Y.y / ye, a), oe = et(Y.height / ye, a), de = (we, ze) => {
          if (!c) return;
          const Ae = ze * a.scale, qe = we === "y" ? -Ae * ye : Ae * ye, Be = new QS(be.id, Y.x, Y.y, we === "x" ? qe : Y.x, we === "y" ? qe : Y.y);
          fe.getState().execute(Be, {
            library: i,
            renderer: c
          });
        }, _e = (we) => {
          if (!c || we === Y.text) return;
          const ze = new FS(be.id, Y.text, we);
          fe.getState().execute(ze, {
            library: i,
            renderer: c
          }), Se.getState().bumpSyncGeneration();
        }, Ee = (we) => {
          if (!c) return;
          const Ae = we * a.scale * ye;
          if (Ae <= 0) return;
          const qe = new WS(be.id, Y.height, Ae);
          fe.getState().execute(qe, {
            library: i,
            renderer: c
          }), Se.getState().bumpSyncGeneration();
        }, je = (we, ze) => {
          if (!c) return;
          const Ae = new jy([
            be.id
          ], we, ze);
          fe.getState().execute(Ae, {
            library: i,
            renderer: c
          }), Se.getState().bumpSyncGeneration();
        };
        return y.jsxs("div", {
          ref: H,
          className: "flex flex-col pb-2",
          onWheel: (we) => we.stopPropagation(),
          children: [
            y.jsx("div", {
              className: "px-3 pt-2 pb-1",
              children: y.jsx("span", {
                className: B("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
                children: "Text"
              })
            }),
            y.jsx("div", {
              className: B("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Ot, {
              label: "Layer",
              isDark: n
            }),
            y.jsx(Rf, {
              currentLayer: Y.layer,
              currentDatatype: Y.datatype,
              isDark: n,
              onChange: je
            }),
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Ot, {
              label: "Content",
              isDark: n
            }),
            y.jsx(X3, {
              label: "Text",
              value: Y.text,
              isDark: n,
              onChange: _e
            }),
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Ot, {
              label: "Position",
              isDark: n
            }),
            y.jsx(ct, {
              label: "X",
              value: re,
              unit: a.unit,
              isDark: n,
              onChange: (we) => de("x", we)
            }),
            y.jsx(ct, {
              label: "Y",
              value: z,
              unit: a.unit,
              isDark: n,
              onChange: (we) => de("y", we)
            }),
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Ot, {
              label: "Size",
              isDark: n
            }),
            y.jsx(ct, {
              label: "Size",
              value: oe,
              unit: a.unit,
              isDark: n,
              onChange: Ee
            }),
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx("div", {
              className: "px-3 pt-2",
              children: y.jsx("button", {
                type: "button",
                onClick: () => {
                  if (!c) return;
                  const we = new A0([
                    be.id
                  ]);
                  fe.getState().execute(we, {
                    library: i,
                    renderer: c
                  });
                },
                className: B("flex w-full items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs transition-colors", n ? "border-white/10 text-white/60 hover:bg-white/5 hover:text-white/80" : "border-black/10 text-black/60 hover:bg-black/5 hover:text-black/80"),
                children: "Convert to Polygons"
              })
            })
          ]
        });
      }
    }
    const I = xe && be ? f.get(be.id) : void 0;
    if (b.current = I, C.current = be == null ? void 0 : be.id, I && xe) {
      const Y = et(I.width / ye, a), re = et((I.actualCornerRadius ?? I.cornerRadius) / ye, a), z = h0(I.waypoints, I.actualCornerRadius ?? I.cornerRadius), oe = et(z / ye, a), de = P ? et(P.minX / ye, a) : "\u2014", _e = P ? et(-P.maxY / ye, a) : "\u2014", Ee = I.waypoints.map((je, we) => {
        const ze = et(je.x / ye, a), Ae = et(-je.y / ye, a);
        return y.jsx(ex, {
          index: we,
          x: ze,
          y: Ae,
          unit: a.unit,
          isDark: n,
          canRemove: I.waypoints.length > 2,
          onChangeX: (qe) => ge(we, "x", qe),
          onChangeY: (qe) => ge(we, "y", qe),
          onRemove: () => {
            if (I.waypoints.length <= 2) return;
            const qe = b.current, Be = C.current;
            if (!qe || !Be || !i || !c) return;
            const Qe = qe.waypoints.filter((vt, jt) => jt !== we), Xe = new Uo(Be, qe, {
              ...qe,
              waypoints: Qe
            }, "Remove path waypoint");
            fe.getState().execute(Xe, {
              library: i,
              renderer: c
            });
          }
        }, we);
      });
      return y.jsxs("div", {
        ref: H,
        className: "flex flex-col pb-2",
        onWheel: (je) => je.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsxs("span", {
              className: B("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: [
                "Path \xB7 ",
                I.waypoints.length,
                " waypoints \xB7 length: ",
                oe,
                " ",
                a.unit
              ]
            })
          }),
          y.jsx("div", {
            className: B("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Layer",
            isDark: n
          }),
          y.jsx(Rf, {
            currentLayer: be.layer,
            currentDatatype: be.datatype,
            isDark: n,
            onChange: j
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Path",
            isDark: n
          }),
          y.jsx(ct, {
            label: "Width",
            value: Y,
            unit: a.unit,
            isDark: n,
            onChange: J
          }),
          y.jsx(ct, {
            label: "Radius",
            value: re,
            unit: a.unit,
            isDark: n,
            onChange: ee
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Position",
            isDark: n
          }),
          y.jsx(ct, {
            label: "X",
            value: de,
            unit: a.unit,
            isDark: n,
            onChange: (je) => A("x", je)
          }),
          y.jsx(ct, {
            label: "Y",
            value: _e,
            unit: a.unit,
            isDark: n,
            onChange: (je) => A("y", je)
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
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
              onClick: Ce,
              className: B("flex w-full items-center justify-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors", n ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-black/10 text-black/50 hover:bg-black/5 hover:text-black/70"),
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
      const Y = o.instance, re = et(Y.tx / ye, a), z = et(-Y.ty / ye, a), oe = P ? et((P.maxX - P.minX) / ye, a) : "\u2014", de = P ? et((P.maxY - P.minY) / ye, a) : "\u2014", _e = Number.isFinite(Y.rotation) ? Y.rotation.toFixed(3) : "0.000", Ee = Number.isFinite(Y.scale) ? Y.scale.toFixed(3) : "1.000", je = i == null ? void 0 : i.get_cell_path_length(Y.cellName), we = je != null ? et(je, a) : null, ze = ((_a = Y.array) == null ? void 0 : _a.columns) ?? 1, Ae = ((_b2 = Y.array) == null ? void 0 : _b2.rows) ?? 1, qe = ((_c = Y.array) == null ? void 0 : _c.colSpacing) ?? 0, Be = ((_d2 = Y.array) == null ? void 0 : _d2.rowSpacing) ?? 0, Qe = ze > 1 || Ae > 1, Xe = et(qe / ye, a), vt = et(Be / ye, a), jt = Y.transform[0] * Y.transform[3] - Y.transform[1] * Y.transform[2] < 0, ft = (st, At, on, qn) => {
        const Kt = st * Math.PI / 180, Ct = Math.cos(Kt), Gt = Math.sin(Kt), Ht = At * Ct, Yl = jt ? At * Gt : -At * Gt, qr = At * Gt, Gr = jt ? -At * Ct : At * Ct;
        return new Float64Array([
          Ht,
          Yl,
          qr,
          Gr,
          on,
          qn
        ]);
      }, Rn = (st, At) => {
        if (!i || !c) return;
        const on = At * a.scale, qn = st === "y" ? -on * ye : on * ye, Kt = new Float64Array(Y.transform);
        st === "x" ? Kt[4] = qn : Kt[5] = qn;
        const Ct = new Id(Y.refId, Y.transform, Kt, "Move instance");
        fe.getState().execute(Ct, {
          library: i,
          renderer: c
        });
      }, cl = (st) => {
        if (!i || !c) return;
        const At = ft(st, Y.scale, Y.tx, Y.ty), on = new Id(Y.refId, Y.transform, At, "Rotate instance");
        fe.getState().execute(on, {
          library: i,
          renderer: c
        });
      }, ul = (st) => {
        if (!i || !c || st <= 0) return;
        const At = ft(Y.rotation, st, Y.tx, Y.ty), on = new Id(Y.refId, Y.transform, At, "Scale instance");
        fe.getState().execute(on, {
          library: i,
          renderer: c
        });
      }, An = (st, At) => {
        if (!i || !c) return;
        const on = Y.array;
        let qn = ze, Kt = Ae, Ct = qe, Gt = Be;
        switch (st) {
          case "columns":
            qn = Math.max(1, Math.round(At));
            break;
          case "rows":
            Kt = Math.max(1, Math.round(At));
            break;
          case "colSpacing":
            Ct = At * a.scale * ye;
            break;
          case "rowSpacing":
            Gt = At * a.scale * ye;
            break;
        }
        const Ht = {
          columns: qn,
          rows: Kt,
          colSpacing: Ct,
          rowSpacing: Gt
        }, Yl = new ZS(Y.refId, on, Ht);
        fe.getState().execute(Yl, {
          library: i,
          renderer: c
        });
      };
      return y.jsxs("div", {
        ref: H,
        className: "flex flex-col pb-2",
        onWheel: (st) => st.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsxs("span", {
              className: B("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: [
                "Instance \xB7 ",
                Y.cellName
              ]
            })
          }),
          y.jsx("div", {
            className: B("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Position",
            isDark: n
          }),
          y.jsx(ct, {
            label: "X",
            value: re,
            unit: a.unit,
            isDark: n,
            onChange: (st) => Rn("x", st)
          }),
          y.jsx(ct, {
            label: "Y",
            value: z,
            unit: a.unit,
            isDark: n,
            onChange: (st) => Rn("y", st)
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Transform",
            isDark: n
          }),
          y.jsx(ct, {
            label: "Rotation",
            value: _e,
            unit: "\xB0",
            isDark: n,
            onChange: cl
          }),
          y.jsx(ct, {
            label: "Scale",
            value: Ee,
            isDark: n,
            onChange: ul
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Array",
            isDark: n
          }),
          y.jsx(ct, {
            label: "Columns",
            value: String(ze),
            isDark: n,
            onChange: (st) => An("columns", st)
          }),
          y.jsx(ct, {
            label: "Rows",
            value: String(Ae),
            isDark: n,
            onChange: (st) => An("rows", st)
          }),
          Qe && y.jsxs(y.Fragment, {
            children: [
              y.jsx(ct, {
                label: "Col pitch",
                value: Xe,
                unit: a.unit,
                isDark: n,
                onChange: (st) => An("colSpacing", st)
              }),
              y.jsx(ct, {
                label: "Row pitch",
                value: vt,
                unit: a.unit,
                isDark: n,
                onChange: (st) => An("rowSpacing", st)
              })
            ]
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Ot, {
            label: "Size",
            isDark: n
          }),
          y.jsx(ct, {
            label: "W",
            value: oe,
            unit: a.unit,
            isDark: n,
            readOnly: true
          }),
          y.jsx(ct, {
            label: "H",
            value: de,
            unit: a.unit,
            isDark: n,
            readOnly: true
          }),
          we != null && y.jsxs(y.Fragment, {
            children: [
              y.jsx("div", {
                className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
              }),
              y.jsx(Ot, {
                label: "Path",
                isDark: n
              }),
              y.jsx(ct, {
                label: "Length",
                value: we,
                unit: a.unit,
                isDark: n,
                readOnly: true
              })
            ]
          })
        ]
      });
    }
    const Z = P ? et(P.minX / ye, a) : "\u2014", W = P ? et(-P.maxY / ye, a) : "\u2014", G = P ? et((P.maxX - P.minX) / ye, a) : "\u2014", se = P ? et((P.maxY - P.minY) / ye, a) : "\u2014";
    return y.jsxs("div", {
      ref: H,
      className: "flex flex-col pb-2",
      onWheel: (Y) => Y.stopPropagation(),
      children: [
        y.jsx("div", {
          className: "px-3 pt-2 pb-1",
          children: y.jsx("span", {
            className: B("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
            children: xe ? `Polygon \xB7 ${be.vertexCount} vertices` : `${V.length} elements`
          })
        }),
        y.jsx("div", {
          className: B("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        !L && y.jsxs(y.Fragment, {
          children: [
            y.jsx(Ot, {
              label: "Layer",
              isDark: n
            }),
            pe ? y.jsxs("div", {
              className: "flex items-center justify-between gap-2 px-3 py-1",
              children: [
                y.jsx("span", {
                  className: B("text-xs select-none", n ? "text-white/50" : "text-black/50"),
                  children: "Layer"
                }),
                y.jsx("span", {
                  className: B("text-xs italic select-none", n ? "text-white/40" : "text-black/40"),
                  children: "Mixed"
                })
              ]
            }) : y.jsx(Rf, {
              currentLayer: be.layer,
              currentDatatype: be.datatype,
              isDark: n,
              onChange: j
            }),
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            })
          ]
        }),
        y.jsx(Ot, {
          label: "Position",
          isDark: n
        }),
        y.jsx(ct, {
          label: "X",
          value: Z,
          unit: a.unit,
          isDark: n,
          onChange: (Y) => A("x", Y),
          readOnly: false
        }),
        y.jsx(ct, {
          label: "Y",
          value: W,
          unit: a.unit,
          isDark: n,
          onChange: (Y) => A("y", Y),
          readOnly: false
        }),
        y.jsx("div", {
          className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsx(Ot, {
          label: "Size",
          isDark: n
        }),
        y.jsx(ct, {
          label: "W",
          value: G,
          unit: a.unit,
          isDark: n,
          onChange: xe && !L ? (Y) => N("width", Y) : void 0,
          readOnly: !xe || L
        }),
        y.jsx(ct, {
          label: "H",
          value: se,
          unit: a.unit,
          isDark: n,
          onChange: xe && !L ? (Y) => N("height", Y) : void 0,
          readOnly: !xe || L
        }),
        (xe || L) && y.jsxs(y.Fragment, {
          children: [
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            L && !xe ? V.map((Y, re) => y.jsx(Yv, {
              vertices: Y.vertices,
              unitInfo: a,
              isDark: n,
              onChangeVertex: T,
              onRemoveVertex: O,
              onAddVertex: D,
              readOnly: true,
              label: V.length > 1 ? `Vertices (${re + 1}/${V.length})` : void 0
            }, Y.id)) : y.jsx(Yv, {
              vertices: be.vertices,
              unitInfo: a,
              isDark: n,
              onChangeVertex: T,
              onRemoveVertex: O,
              onAddVertex: D,
              readOnly: L
            })
          ]
        })
      ]
    });
  }
  const tx = [
    {
      id: "layers",
      icon: J_,
      label: "Layers",
      shortcut: "L"
    },
    {
      id: "inspector",
      icon: y_,
      label: "Inspector",
      shortcut: "I"
    }
  ];
  function q3({ isDark: l, onExpand: n }) {
    return y.jsx("div", {
      className: B("fixed top-4 right-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border py-1", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: tx.map((a) => {
        const o = a.icon;
        return y.jsx(Vn, {
          label: a.label,
          shortcut: {
            modifiers: [
              Ie.shift
            ],
            key: a.shortcut
          },
          position: "left",
          children: y.jsx("button", {
            onClick: () => n(a.id),
            className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
            children: y.jsx("div", {
              className: "flex h-4 w-4 items-center justify-center",
              children: y.jsx(o, {
                className: B("h-4 w-4", l ? "text-white/60" : "text-black/60")
              })
            })
          })
        }, a.id);
      })
    });
  }
  function Bv() {
    const n = me((R) => R.theme) === "dark", a = me((R) => R.sidebarCollapsed), o = me((R) => R.toggleSidebarCollapsed), i = me((R) => R.sidebarWidth), c = me((R) => R.setSidebarWidth), { isSm: d } = vh(), { handleProps: f } = Z1({
      side: "right",
      width: i,
      onResize: c
    }), h = me((R) => R.sidebarTab), p = me((R) => R.setSidebarTab), v = is((R) => R.isMinimized), [x, S] = g.useState(false), E = g.useRef(null);
    g.useEffect(() => {
      if (!d || !x) return;
      const R = (j) => {
        E.current && !E.current.contains(j.target) && S(false);
      };
      return document.addEventListener("mousedown", R), () => document.removeEventListener("mousedown", R);
    }, [
      d,
      x
    ]);
    const k = g.useCallback((R) => {
      p(R), d ? S(true) : o();
    }, [
      d,
      o,
      p
    ]), C = (v ? 0 : 206) + 24;
    if (a && !(d && x)) return y.jsx(q3, {
      isDark: n,
      onExpand: k
    });
    const _ = d && x;
    return y.jsxs(y.Fragment, {
      children: [
        _ && y.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        y.jsxs("div", {
          ref: E,
          className: B("fixed top-4 right-4 z-40 rounded-xl border", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", _ && "shadow-xl"),
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
                tx.map((R) => {
                  const j = R.icon, A = h === R.id;
                  return y.jsx(Vn, {
                    label: R.label,
                    shortcut: {
                      modifiers: [
                        Ie.shift
                      ],
                      key: R.shortcut
                    },
                    children: y.jsx("button", {
                      onClick: () => p(R.id),
                      className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", A && (n ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: y.jsx("div", {
                        className: "flex h-4 w-4 items-center justify-center",
                        children: y.jsx(j, {
                          className: B("h-4 w-4", n ? "text-white/90" : "text-black/90")
                        })
                      })
                    })
                  }, R.id);
                }),
                !d && y.jsx("button", {
                  type: "button",
                  onClick: o,
                  className: B("ml-auto cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: y.jsx($1, {
                    className: B("h-4 w-4", n ? "text-white/60" : "text-black/60")
                  })
                })
              ]
            }),
            y.jsx("div", {
              className: B("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            y.jsxs("div", {
              className: "overflow-y-auto",
              style: {
                maxHeight: `calc(100vh - ${70 + C}px)`
              },
              onWheel: (R) => R.stopPropagation(),
              children: [
                h === "layers" && y.jsx(Y3, {}),
                h === "inspector" && y.jsx(V3, {})
              ]
            })
          ]
        })
      ]
    });
  }
  const G3 = (l) => {
    const n = 1 / (l * ye), a = o0 * n, o = uh(l), i = a / o.scale, c = AS.find((f) => f >= i) ?? i, d = o.unit === "mm" && c >= 1e3 ? c.toExponential(1) : c;
    return {
      length: c * o.scale,
      label: `${d} ${o.unit}`
    };
  }, Xv = "0.3.0";
  function P3({ isDark: l }) {
    return y.jsxs("div", {
      className: "group relative flex items-center gap-1.5",
      children: [
        y.jsx("div", {
          className: "h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500"
        }),
        y.jsxs("span", {
          className: B("text-[10px] select-none", l ? "text-white/40" : "text-black/40"),
          children: [
            "v",
            Xv
          ]
        }),
        y.jsxs("div", {
          className: B("pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-56 rounded-lg border p-2.5 text-[11px] leading-relaxed opacity-0 transition-opacity group-hover:opacity-100", l ? "border-white/10 bg-[rgb(29,29,29)] text-white/70" : "border-black/10 bg-[rgb(241,241,241)] text-black/70"),
          children: [
            y.jsxs("span", {
              className: B("font-medium", l ? "text-white/90" : "text-black/90"),
              children: [
                "Rosette v",
                Xv,
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
  function Z3({ isDark: l }) {
    const n = cn((o) => o.message), a = cn((o) => o.level);
    return n ? y.jsx("div", {
      className: "flex min-w-0 flex-1 items-center justify-center",
      children: y.jsx("span", {
        className: B("truncate text-[11px] select-none", a === "warn" && (l ? "text-yellow-400/80" : "text-yellow-600/80"), a === "error" && (l ? "text-red-400/80" : "text-red-600/80"), a === "info" && (l ? "text-white/50" : "text-black/50")),
        children: n
      })
    }) : y.jsx("div", {
      className: "flex-1"
    });
  }
  function K3({ isDark: l }) {
    const n = ue((h) => h.selectedIds), a = Se((h) => h.library), o = ve((h) => h.layers), i = tt((h) => h.pathMetadata), c = g.useMemo(() => {
      const h = n.size;
      if (h === 0 || !a) return null;
      const p = n.values().next().value, v = p.startsWith("ref:");
      if (h === 1 && v) {
        const b = a.get_cell_ref_info(p);
        if (b) {
          const C = b.cell_name;
          b.free();
          const _ = a.get_cell_path_length(C), R = _ != null ? ` \xB7 length: ${(_ / 1e3).toFixed(3)} \xB5m` : "";
          return {
            label: `Instance "${C}"${R}`,
            layerNumber: null,
            datatype: null
          };
        }
      }
      if (h === 1 && a.is_text_element(p)) {
        const b = a.get_text_element_info(p);
        if (b) return {
          label: `Text "${b.text.length > 20 ? b.text.slice(0, 20) + "\u2026" : b.text}"`,
          layerNumber: b.layer,
          datatype: b.datatype
        };
      }
      if (h === 1) {
        const b = i.get(p);
        if (b) {
          const R = (h0(b.waypoints, b.actualCornerRadius ?? b.cornerRadius) / ye / 1e3).toFixed(3);
          return {
            label: `Path \xB7 ${b.waypoints.length} waypoints \xB7 length: ${R} \xB5m`,
            layerNumber: b.layer,
            datatype: b.datatype
          };
        }
      }
      let x = null, S = null, E = false, k = 0;
      for (const b of n) {
        const C = a.get_element_info(b);
        if (C && (x === null ? (x = C.layer, S = C.datatype) : (C.layer !== x || C.datatype !== S) && (E = true), h === 1 && (k = C.vertices.length / 2), C.free(), E && h > 1)) break;
      }
      return h === 1 ? {
        label: `Polygon \xB7 ${k} vertices`,
        layerNumber: x,
        datatype: S
      } : E ? {
        label: `${h} elements \xB7 Mixed layers`,
        layerNumber: null,
        datatype: null
      } : {
        label: `${h} elements`,
        layerNumber: x,
        datatype: S
      };
    }, [
      n,
      a,
      i
    ]);
    if (!c) return null;
    const d = g.useMemo(() => {
      if (c.layerNumber === null) return null;
      for (const h of o.values()) if (h.layerNumber === c.layerNumber && h.datatype === c.datatype) return {
        name: h.name,
        color: h.color
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
          className: B("truncate text-[11px] select-none", l ? "text-white/50" : "text-black/50"),
          children: [
            c.label,
            f
          ]
        })
      ]
    });
  }
  function F3({ isDark: l }) {
    const n = cn((o) => o.message), a = ue((o) => o.selectedIds.size > 0);
    return n ? y.jsx(Z3, {
      isDark: l
    }) : a ? y.jsx(K3, {
      isDark: l
    }) : y.jsx("div", {
      className: "flex-1"
    });
  }
  function Uv({ isDark: l, widthInPixels: n, label: a }) {
    return y.jsxs("div", {
      className: "flex items-center gap-1.5",
      children: [
        y.jsx("div", {
          className: B("h-px", l ? "bg-white/50" : "bg-black/50"),
          style: {
            width: `${Math.max(n, 20)}px`
          }
        }),
        y.jsx(Vn, {
          label: "Zoom to Fit",
          position: "top",
          children: y.jsx("button", {
            onClick: us,
            className: B("flex cursor-pointer items-center justify-center rounded p-0.5 text-[10px] select-none transition-colors focus:outline-none", l ? "text-white/40 hover:text-white/70" : "text-black/40 hover:text-black/70"),
            children: a
          })
        })
      ]
    });
  }
  function $v({ compact: l = false, minimal: n = false }) {
    const a = me((R) => {
      var _a;
      return (_a = R.cursorWorld) == null ? void 0 : _a.x;
    }), o = me((R) => {
      var _a;
      return (_a = R.cursorWorld) == null ? void 0 : _a.y;
    }), i = me((R) => R.theme), c = Ye((R) => R.zoom), d = me((R) => R.zenMode), f = me((R) => R.toggleZenMode), h = is((R) => R.isMinimized), p = is((R) => R.toggle), v = i === "dark", x = g.useMemo(() => uh(c), [
      c
    ]), S = g.useMemo(() => a !== void 0 ? et(a, x) : "\u2014", [
      a,
      x
    ]), E = g.useMemo(() => o !== void 0 ? et(o, x) : "\u2014", [
      o,
      x
    ]), { length: k, label: b } = g.useMemo(() => G3(c), [
      c
    ]), C = Math.min(k * c * ye, RS), _ = !l && !n;
    return y.jsxs("div", {
      className: "relative flex-shrink-0",
      children: [
        !_ && y.jsx("div", {
          className: "absolute bottom-full right-3 mb-2 font-mono text-[11px]",
          children: y.jsx(Uv, {
            isDark: v,
            widthInPixels: C,
            label: b
          })
        }),
        y.jsxs("div", {
          className: B("flex h-6 items-center border-t px-3 font-mono text-[11px]", v ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          children: [
            y.jsxs("div", {
              className: "flex min-w-0 flex-shrink-0 items-center gap-1.5",
              children: [
                !l && !n && y.jsxs(y.Fragment, {
                  children: [
                    y.jsx(P3, {
                      isDark: v
                    }),
                    y.jsx("span", {
                      className: B("mx-1 select-none pointer-events-none", v ? "text-white/20" : "text-black/20"),
                      children: "\xB7"
                    })
                  ]
                }),
                n ? y.jsxs("span", {
                  className: B("text-[10px] select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                  children: [
                    S,
                    ", ",
                    E,
                    " ",
                    x.unit
                  ]
                }) : y.jsxs(y.Fragment, {
                  children: [
                    y.jsx("span", {
                      className: B("leading-none select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "x:"
                    }),
                    y.jsx("span", {
                      className: B("w-18 text-right leading-none select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: S
                    }),
                    y.jsx("span", {
                      className: B("text-[10px] leading-none select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: x.unit
                    }),
                    y.jsx("span", {
                      className: B("mx-1 leading-none select-none pointer-events-none", v ? "text-white/20" : "text-black/20"),
                      children: "\xB7"
                    }),
                    y.jsx("span", {
                      className: B("leading-none select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "y:"
                    }),
                    y.jsx("span", {
                      className: B("w-18 text-right leading-none select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: E
                    }),
                    y.jsx("span", {
                      className: B("text-[10px] leading-none select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: x.unit
                    })
                  ]
                })
              ]
            }),
            !n && y.jsx(F3, {
              isDark: v
            }),
            n && y.jsx("div", {
              className: "flex-1"
            }),
            y.jsxs("div", {
              className: "flex flex-shrink-0 items-center gap-2",
              children: [
                _ && y.jsx(Uv, {
                  isDark: v,
                  widthInPixels: C,
                  label: b
                }),
                y.jsx(Vn, {
                  label: "Zen Mode",
                  position: "top",
                  children: y.jsx("button", {
                    onClick: f,
                    className: B("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", d && (v ? "bg-white/10" : "bg-black/10")),
                    children: y.jsx(P4, {
                      width: 14,
                      height: 14,
                      className: B(v ? "text-white/50" : "text-black/50")
                    })
                  })
                }),
                y.jsx(Vn, {
                  label: "Minimap",
                  position: "top",
                  align: "end",
                  children: y.jsx("button", {
                    onClick: p,
                    className: B("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", !h && (v ? "bg-white/10" : "bg-black/10")),
                    children: y.jsx(v4, {
                      width: 14,
                      height: 14,
                      className: B(v ? "text-white/50" : "text-black/50")
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
  function Q3({ title: l, titleId: n, ...a }, o) {
    return g.createElement("svg", Object.assign({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      "aria-hidden": "true",
      "data-slot": "icon",
      ref: o,
      "aria-labelledby": n
    }, a), l ? g.createElement("title", {
      id: n
    }, l) : null, g.createElement("path", {
      d: "M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 1 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06ZM14.95 3.05a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 8ZM14 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 8ZM7.172 10.828a.75.75 0 0 1 0 1.061L6.11 12.95a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM10.766 7.51a.75.75 0 0 0-1.37.365l-.492 6.861a.75.75 0 0 0 1.204.65l1.043-.799.985 3.678a.75.75 0 0 0 1.45-.388l-.978-3.646 1.292.204a.75.75 0 0 0 .74-1.16l-3.874-5.764Z"
    }));
  }
  const wh = g.forwardRef(Q3);
  function W3({ title: l, titleId: n, ...a }, o) {
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
    }, a), l ? g.createElement("title", {
      id: n
    }, l) : null, g.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
    }));
  }
  const Sh = g.forwardRef(W3), J3 = [
    {
      id: "select",
      icon: wh,
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
      icon: Sh,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: yh,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: bh,
      label: "Zoom",
      shortcut: "Z"
    },
    {
      id: "ruler",
      icon: q1,
      label: "Ruler",
      shortcut: "U"
    }
  ], Vv = [
    {
      id: "rectangle",
      icon: I4,
      label: "Rectangle",
      shortcut: "R"
    },
    {
      id: "polygon",
      icon: n4,
      label: "Polygon",
      shortcut: "G"
    },
    {
      id: "path",
      icon: FM,
      label: "Path",
      shortcut: "H"
    },
    {
      id: "text",
      icon: J4,
      label: "Text",
      shortcut: "T"
    }
  ], ej = [
    {
      id: "select",
      icon: wh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: Sh,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: yh,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: bh,
      label: "Zoom",
      shortcut: "Z"
    }
  ], qv = [
    {
      id: "laser",
      icon: U1,
      label: "Laser Pointer",
      shortcut: "Q"
    },
    {
      id: "ruler",
      icon: q1,
      label: "Ruler",
      shortcut: "U"
    }
  ], tj = [
    {
      id: "select",
      icon: wh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: Sh,
      label: "Pan",
      shortcut: "P"
    }
  ];
  function Gv({ tool: l, isActive: n, onClick: a, isDark: o }) {
    const i = l.icon;
    return y.jsx(Vn, {
      label: l.label,
      shortcut: {
        key: l.shortcut
      },
      children: y.jsx("button", {
        onClick: a,
        className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", o ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (o ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(i, {
            className: B("h-5 w-5", o ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function Pv({ isDark: l }) {
    return y.jsx("div", {
      className: B("mx-0 h-6 w-[1px]", l ? "bg-white/10" : "bg-black/10")
    });
  }
  function nj({ isDark: l, overflowBaseTools: n, overflowShapeTools: a, showInstance: o, showCommands: i }) {
    const [c, d] = g.useState(false), f = g.useRef(null), h = g.useRef(null), { activeTool: p, setTool: v } = qt(), x = un((b) => b.open), S = un((b) => b.toggle), E = [
      ...n,
      ...a
    ].some((b) => b.id === p);
    g.useEffect(() => {
      if (!c) return;
      const b = (_) => {
        var _a, _b2;
        const R = _.target;
        !((_a = h.current) == null ? void 0 : _a.contains(R)) && !((_b2 = f.current) == null ? void 0 : _b2.contains(R)) && d(false);
      }, C = (_) => {
        _.key === "Escape" && d(false);
      };
      return document.addEventListener("mousedown", b, true), document.addEventListener("keydown", C), () => {
        document.removeEventListener("mousedown", b, true), document.removeEventListener("keydown", C);
      };
    }, [
      c
    ]);
    const k = g.useCallback(() => {
      if (!f.current) return {
        left: 0,
        top: 0
      };
      const b = f.current.getBoundingClientRect(), C = 200;
      let _ = b.left;
      return _ + C > window.innerWidth - 8 && (_ = window.innerWidth - C - 8), {
        left: _,
        top: b.bottom + 8
      };
    }, []);
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(Vn, {
          label: "More tools",
          className: c ? "[&>div:last-child]:hidden" : void 0,
          children: y.jsx("button", {
            ref: f,
            onClick: () => d(!c),
            className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", (E || c) && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
            children: y.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: y.jsx(TM, {
                className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        c && hs.createPortal(y.jsxs("div", {
          ref: h,
          className: B("fixed z-[9999] min-w-[180px] rounded-xl border p-1 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: (() => {
            const b = k();
            return {
              left: `${b.left}px`,
              top: `${b.top}px`
            };
          })(),
          children: [
            n.length > 0 && y.jsx("div", {
              className: "flex flex-col",
              children: n.map((b) => {
                const C = b.icon, _ = p === b.id;
                return y.jsxs("button", {
                  onClick: () => {
                    v(b.id), d(false);
                  },
                  className: B("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", _ && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                  children: [
                    y.jsx(C, {
                      className: B("h-4 w-4", l ? "text-white/90" : "text-black/90")
                    }),
                    y.jsx("span", {
                      className: l ? "text-white/90" : "text-black/90",
                      children: b.label
                    }),
                    y.jsx("kbd", {
                      className: B("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                      children: b.shortcut
                    })
                  ]
                }, b.id);
              })
            }),
            a.length > 0 && y.jsxs(y.Fragment, {
              children: [
                y.jsx("div", {
                  className: B("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                y.jsx("div", {
                  className: "flex flex-col",
                  children: a.map((b) => {
                    const C = b.icon, _ = p === b.id;
                    return y.jsxs("button", {
                      onClick: () => {
                        v(b.id), d(false);
                      },
                      className: B("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", _ && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: [
                        y.jsx(C, {
                          className: B("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        y.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: b.label
                        }),
                        y.jsx("kbd", {
                          className: B("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
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
                  className: B("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                y.jsxs("div", {
                  className: "flex flex-col",
                  children: [
                    o && y.jsxs("button", {
                      onClick: () => {
                        x("add instance "), d(false);
                      },
                      className: B("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        y.jsx(V1, {
                          className: B("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        y.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: "Instance"
                        }),
                        y.jsx("kbd", {
                          className: B("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                          children: "I"
                        })
                      ]
                    }),
                    i && y.jsxs("button", {
                      onClick: () => {
                        S(), d(false);
                      },
                      className: B("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        y.jsx(G1, {
                          className: B("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        y.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: "Commands"
                        }),
                        y.jsxs("span", {
                          className: "ml-auto flex gap-0.5",
                          children: [
                            y.jsx("kbd", {
                              className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                              children: Ie.mod
                            }),
                            y.jsx("kbd", {
                              className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
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
  function Zv({ compact: l = false, minimal: n = false }) {
    const { activeTool: a, setTool: o } = qt(), c = me((k) => k.theme) === "dark", d = n ? tj : l ? ej : J3, f = !l && !n, h = !l && !n, p = !l && !n, v = !l && !n, x = l || n, S = n ? [
      ...qv,
      {
        id: "move",
        icon: yh,
        label: "Move",
        shortcut: "M"
      },
      {
        id: "zoom",
        icon: bh,
        label: "Zoom",
        shortcut: "Z"
      }
    ] : l ? qv : [], E = l || n ? Vv : [];
    return y.jsxs("div", {
      className: B("fixed top-4 z-50 mx-auto w-fit", l || n ? "left-14 right-14" : "left-0 right-0", "flex items-center gap-1 rounded-xl border px-1 pt-1 pb-[3px]", c ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: [
        d.map((k) => y.jsx(Gv, {
          tool: k,
          isActive: a === k.id,
          onClick: () => o(k.id),
          isDark: c
        }, k.id)),
        f && y.jsxs(y.Fragment, {
          children: [
            y.jsx(Pv, {
              isDark: c
            }),
            Vv.map((k) => y.jsx(Gv, {
              tool: k,
              isActive: a === k.id,
              onClick: () => o(k.id),
              isDark: c
            }, k.id))
          ]
        }),
        h && y.jsx(lj, {
          isDark: c
        }),
        p && y.jsx(aj, {
          isDark: c
        }),
        y.jsx(Pv, {
          isDark: c
        }),
        v && y.jsx(rj, {
          isDark: c
        }),
        x && y.jsx(nj, {
          isDark: c,
          overflowBaseTools: S,
          overflowShapeTools: E,
          showInstance: true,
          showCommands: true
        })
      ]
    });
  }
  const Kv = [
    {
      id: "union",
      icon: r3,
      label: "Union",
      kind: "boolean"
    },
    {
      id: "subtract",
      icon: X4,
      label: "Subtract",
      kind: "boolean"
    },
    {
      id: "intersect",
      icon: wM,
      label: "Intersect",
      kind: "boolean"
    },
    {
      id: "xor",
      icon: gM,
      label: "Exclude",
      kind: "boolean"
    },
    {
      id: "align-left",
      icon: I_,
      label: "Align Left",
      kind: "align"
    },
    {
      id: "align-center-h",
      icon: r_,
      label: "Align Center H",
      kind: "align"
    },
    {
      id: "align-right",
      icon: X_,
      label: "Align Right",
      kind: "align"
    },
    {
      id: "center-align",
      icon: C_,
      label: "Center Align",
      kind: "align"
    },
    {
      id: "align-top",
      icon: P_,
      label: "Align Top",
      kind: "align"
    },
    {
      id: "align-center-v",
      icon: d_,
      label: "Align Center V",
      kind: "align"
    },
    {
      id: "align-bottom",
      icon: L_,
      label: "Align Bottom",
      kind: "align"
    },
    {
      id: "origin-align",
      icon: h4,
      label: "Origin Align",
      kind: "align"
    }
  ];
  function Fv(l) {
    const { library: n, renderer: a } = Se.getState();
    if (!n || !a) return;
    const { selectedIds: o, lastSelectedId: i } = ue.getState();
    if (o.size !== 0) if (l.kind === "boolean") {
      if (o.size < 2) return;
      const c = [
        ...o
      ], d = i ?? c[0], f = new T0(c, l.id, d);
      fe.getState().execute(f, {
        library: n,
        renderer: a
      });
    } else {
      const c = l.id;
      if (c !== "origin-align" && o.size < 2) return;
      const d = new N0(new Set(o), i, c);
      fe.getState().execute(d, {
        library: n,
        renderer: a
      });
    }
  }
  function lj({ isDark: l }) {
    const [n, a] = g.useState(Kv[0]), [o, i] = g.useState(false), c = g.useRef(null), d = g.useRef(null), f = g.useRef(null), h = n.icon;
    g.useEffect(() => {
      if (!o) return;
      const j = (A) => {
        A.key === "Escape" && i(false);
      };
      return document.addEventListener("keydown", j), () => {
        document.removeEventListener("keydown", j);
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
    ]), E = g.useCallback(() => {
      v();
    }, [
      v
    ]), k = g.useCallback(() => {
      p();
    }, [
      p
    ]), b = g.useCallback(() => {
      Fv(n);
    }, [
      n
    ]), C = g.useCallback((j) => {
      j.preventDefault(), i(true);
    }, []), _ = g.useCallback((j) => {
      a(j), i(false), setTimeout(() => Fv(j), 0);
    }, []), R = g.useCallback((j) => {
      if (d.current = j, !j || !c.current) return;
      const A = c.current.getBoundingClientRect(), N = j.getBoundingClientRect();
      let O = A.left + A.width / 2 - N.width / 2, D = A.bottom + 9;
      O + N.width > window.innerWidth - 8 && (O = window.innerWidth - N.width - 8), O < 8 && (O = 8), D + N.height > window.innerHeight - 8 && (D = A.top - N.height - 8), j.style.left = `${O}px`, j.style.top = `${D}px`, j.style.visibility = "visible";
    }, []);
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(Vn, {
          label: n.label,
          className: o ? "[&>div:last-child]:hidden" : void 0,
          children: y.jsx("button", {
            ref: c,
            onClick: b,
            onContextMenu: C,
            onMouseEnter: x,
            onMouseLeave: S,
            className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
            children: y.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: y.jsx(h, {
                className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        o && hs.createPortal(y.jsx("div", {
          ref: R,
          onMouseEnter: E,
          onMouseLeave: k,
          className: B("fixed z-[9999] rounded-xl border p-2 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: {
            visibility: "hidden"
          },
          children: y.jsx("div", {
            className: "grid grid-cols-4 gap-1",
            children: Kv.map((j) => y.jsx(Vn, {
              label: j.label,
              className: "[&>div:last-child]:mt-0.5",
              children: y.jsx("button", {
                onClick: () => _(j),
                className: B("cursor-pointer rounded-lg p-1.5 transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                children: y.jsx(j.icon, {
                  className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
                })
              })
            }, j.id))
          })
        }), document.body)
      ]
    });
  }
  function aj({ isDark: l }) {
    const n = un((c) => c.open), a = un((c) => c.isOpen), o = un((c) => c.initialSearch), i = a && !!o;
    return y.jsx(Vn, {
      label: "Instance",
      shortcut: {
        key: "I"
      },
      children: y.jsx("button", {
        onClick: () => n("add instance "),
        className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", i && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(V1, {
            className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function rj({ isDark: l }) {
    const n = un((c) => c.isOpen), a = un((c) => c.initialSearch), o = un((c) => c.toggle), i = n && !a;
    return y.jsx(Vn, {
      label: "Commands",
      shortcut: {
        modifiers: [
          Ie.mod
        ],
        key: "K"
      },
      children: y.jsx("button", {
        onClick: o,
        className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", i && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(G1, {
            className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  const oj = 5e3;
  function sj() {
    const [l, n] = g.useState({
      status: "idle"
    }), [a, o] = g.useState(false), i = me((p) => p.theme) === "dark", c = g.useRef(null), d = g.useRef("");
    g.useEffect(() => {
      if (!Un) return;
      const p = setTimeout(async () => {
        try {
          n({
            status: "checking"
          });
          const { check: v } = await wt(async () => {
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
      }, oj);
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
        await p.downloadAndInstall((E) => {
          switch (E.event) {
            case "Started":
              S = E.data.contentLength ?? 1;
              break;
            case "Progress":
              x += E.data.chunkLength ?? 0, n({
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
    }, []), h = g.useCallback(async () => {
      try {
        const { relaunch: p } = await wt(async () => {
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
    return !Un || l.status === "idle" || l.status === "checking" || a ? null : y.jsxs("div", {
      className: B("fixed bottom-10 right-4 z-[200] flex w-72 flex-col gap-2 rounded-xl border p-3 shadow-lg backdrop-blur-xl animate-[update-toast-in_0.3s_ease-out]", i ? "border-white/10 bg-[rgb(29,29,29)]/95 text-white/90" : "border-black/10 bg-[rgb(241,241,241)]/95 text-black/90"),
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
              className: B("flex h-5 w-5 items-center justify-center rounded transition-colors", i ? "hover:bg-white/10 text-white/40" : "hover:bg-black/10 text-black/40"),
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
          className: B("text-[11px]", i ? "text-white/50" : "text-black/50"),
          children: [
            "v",
            l.version,
            " is ready to install"
          ]
        }),
        l.status === "error" && y.jsx("p", {
          className: B("text-[11px]", i ? "text-red-400/80" : "text-red-600/80"),
          children: l.message
        }),
        l.status === "downloading" && y.jsx("div", {
          className: B("h-1 w-full overflow-hidden rounded-full", i ? "bg-white/10" : "bg-black/10"),
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
          className: B("text-center text-[11px]", i ? "text-white/40" : "text-black/40"),
          children: [
            "Downloading... ",
            Math.round(l.progress * 100),
            "%"
          ]
        }),
        l.status === "ready" && y.jsx("button", {
          type: "button",
          onClick: h,
          className: "mt-0.5 flex h-7 items-center justify-center rounded-lg border border-brand-purple-dark/50 bg-brand-purple px-3 text-xs font-medium text-white shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15 transition-colors hover:bg-brand-purple-light active:translate-y-px",
          children: "Restart to update"
        }),
        l.status === "error" && y.jsx("button", {
          type: "button",
          onClick: () => o(true),
          className: B("mt-0.5 flex h-7 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors active:translate-y-px", i ? "border-white/10 text-white/70 hover:bg-white/5" : "border-black/10 text-black/70 hover:bg-black/5"),
          children: "Dismiss"
        })
      ]
    });
  }
  const Vi = 1e3;
  function qi({ label: l, value: n, onChange: a, isDark: o, unit: i, min: c, step: d, integer: f, autoFocus: h, onSubmit: p }) {
    const v = g.useRef(null);
    g.useEffect(() => {
      h && v.current && v.current.select();
    }, [
      h
    ]);
    const [x, S] = g.useState(String(n));
    g.useEffect(() => {
      S(String(n));
    }, [
      n
    ]);
    const E = g.useCallback((k) => {
      const b = Number.parseFloat(k);
      if (Number.isNaN(b)) return;
      const C = c !== void 0 ? Math.max(c, b) : b, _ = f ? Math.round(C) : C;
      a(_), S(String(_));
    }, [
      a,
      c,
      f
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-3",
      children: [
        y.jsx("label", {
          className: B("text-xs select-none", o ? "text-white/50" : "text-black/50"),
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
              onChange: (k) => S(k.target.value),
              onBlur: () => E(x),
              onKeyDown: (k) => {
                var _a;
                if (k.key === "Enter") k.preventDefault(), E(x), p == null ? void 0 : p();
                else if (k.key === "Tab") {
                  const b = (_a = v.current) == null ? void 0 : _a.closest("form");
                  if (b) {
                    const C = Array.from(b.querySelectorAll("input")), _ = C.indexOf(v.current);
                    if (_ >= 0) {
                      const R = k.shiftKey ? (_ - 1 + C.length) % C.length : (_ + 1) % C.length;
                      k.preventDefault(), E(x), C[R].focus(), C[R].select();
                    }
                  }
                }
              },
              className: B("w-20 rounded border px-1.5 py-1 text-right font-mono text-xs outline-none", o ? "border-white/10 bg-white/5 text-white/90 focus:border-white/30" : "border-black/10 bg-black/5 text-black/90 focus:border-black/30"),
              step: d,
              autoFocus: h
            }),
            i && y.jsx("span", {
              className: B("w-6 text-xs select-none", o ? "text-white/40" : "text-black/40"),
              children: i
            })
          ]
        })
      ]
    });
  }
  function Qv() {
    const { isOpen: l, elementIds: n, close: a } = gh(), o = Se(($) => $.library), i = Se(($) => $.renderer), d = me(($) => $.theme) === "dark";
    Hl("array-dialog", l);
    const [f, h] = g.useState(2), [p, v] = g.useState(1), [x, S] = g.useState(0), [E, k] = g.useState(0), b = g.useRef(f), C = g.useRef(p), _ = g.useRef(x), R = g.useRef(E), j = g.useCallback(($) => {
      b.current = $, h($);
    }, []), A = g.useCallback(($) => {
      C.current = $, v($);
    }, []), N = g.useCallback(($) => {
      _.current = $, S($);
    }, []), T = g.useCallback(($) => {
      R.current = $, k($);
    }, []), O = g.useRef(null);
    g.useEffect(() => {
      if (!l || !o || n.length === 0) return;
      const $ = o.get_bounds_for_ids(n);
      if ($) {
        const te = $[2] - $[0], J = $[3] - $[1], ee = te / ye / Vi, ge = J / ye / Vi;
        N(Math.round(ee * 1e3) / 1e3), T(Math.round(ge * 1e3) / 1e3);
      }
      j(2), A(1);
    }, [
      l,
      o,
      n,
      j,
      A,
      N,
      T
    ]), g.useEffect(() => {
      if (!l) return;
      const $ = (te) => {
        O.current && !O.current.contains(te.target) && a();
      };
      return document.addEventListener("mousedown", $), () => document.removeEventListener("mousedown", $);
    }, [
      l,
      a
    ]);
    const D = g.useCallback(() => {
      if (!o || !i) return;
      const $ = b.current, te = C.current, J = _.current, ee = R.current;
      if ($ < 1 || te < 1) return;
      if ($ === 1 && te === 1) {
        a();
        return;
      }
      const ge = J * Vi * ye, Ce = -(ee * Vi * ye), V = new $S(n, $, te, ge, Ce);
      fe.getState().execute(V, {
        library: o,
        renderer: i
      }), a();
    }, [
      o,
      i,
      n,
      a
    ]);
    if (!l) return null;
    const H = f * p - 1;
    return y.jsx("div", {
      className: "fixed inset-0 z-[200]",
      children: y.jsx("div", {
        className: "fixed inset-0 flex items-start justify-center px-4 pt-[min(25vh,200px)]",
        children: y.jsxs("div", {
          ref: O,
          role: "dialog",
          "aria-label": "Create Array",
          className: B("w-full max-w-[320px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl", d ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          onKeyDown: ($) => {
            $.key === "Escape" && ($.preventDefault(), a());
          },
          children: [
            y.jsx("div", {
              className: B("border-b px-4 py-3 text-sm font-medium select-none", d ? "border-white/10 text-white/90" : "border-black/10 text-black/90"),
              children: "Create Array"
            }),
            y.jsxs("form", {
              className: "flex flex-col gap-2 px-4 py-3",
              onSubmit: ($) => {
                $.preventDefault(), D();
              },
              children: [
                y.jsx(qi, {
                  label: "Columns",
                  value: f,
                  onChange: j,
                  isDark: d,
                  min: 1,
                  step: 1,
                  integer: true,
                  autoFocus: true,
                  onSubmit: D
                }),
                y.jsx(qi, {
                  label: "Rows",
                  value: p,
                  onChange: A,
                  isDark: d,
                  min: 1,
                  step: 1,
                  integer: true,
                  onSubmit: D
                }),
                y.jsx(qi, {
                  label: "Col pitch",
                  value: x,
                  onChange: N,
                  isDark: d,
                  unit: "\xB5m",
                  step: 0.1,
                  onSubmit: D
                }),
                y.jsx(qi, {
                  label: "Row pitch",
                  value: E,
                  onChange: T,
                  isDark: d,
                  unit: "\xB5m",
                  step: 0.1,
                  onSubmit: D
                })
              ]
            }),
            y.jsxs("div", {
              className: B("flex items-center justify-between border-t px-4 py-3", d ? "border-white/10" : "border-black/10"),
              children: [
                y.jsx("span", {
                  className: B("text-xs select-none", d ? "text-white/40" : "text-black/40"),
                  children: H > 0 ? `${H} ${H === 1 ? "copy" : "copies"} will be created` : "No copies to create"
                }),
                y.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    y.jsx("button", {
                      type: "button",
                      onClick: a,
                      className: B("rounded-lg border px-3 py-1.5 text-xs transition-colors", d ? "border-white/10 text-white/70 hover:bg-white/5" : "border-black/10 text-black/70 hover:bg-black/5"),
                      children: "Cancel"
                    }),
                    y.jsx("button", {
                      type: "button",
                      onClick: D,
                      disabled: H === 0,
                      className: B("rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors", H === 0 ? "cursor-not-allowed opacity-40" : d ? "border-white/20 bg-white/10 text-white/90 hover:bg-white/15" : "border-black/20 bg-black/10 text-black/90 hover:bg-black/15"),
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
  const Wv = 1e3;
  function Jv({ label: l, value: n, onChange: a, isDark: o, autoFocus: i, onSubmit: c }) {
    const d = g.useRef(null);
    g.useEffect(() => {
      if (i && d.current) {
        const v = d.current;
        requestAnimationFrame(() => {
          v.focus(), v.select();
        });
      }
    }, [
      i
    ]);
    const [f, h] = g.useState(String(n));
    g.useEffect(() => {
      h(String(n));
    }, [
      n
    ]);
    const p = g.useCallback((v) => {
      const x = Number.parseFloat(v);
      Number.isNaN(x) || (a(x), h(String(x)));
    }, [
      a
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-3",
      children: [
        y.jsx("label", {
          className: B("text-xs select-none", o ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsxs("div", {
          className: "flex items-center gap-1",
          children: [
            y.jsx("input", {
              ref: d,
              type: "text",
              inputMode: "decimal",
              value: f,
              onChange: (v) => h(v.target.value),
              onBlur: () => p(f),
              onKeyDown: (v) => {
                var _a;
                if (v.key === "Enter") v.preventDefault(), p(f), c == null ? void 0 : c();
                else if (v.key === "Tab") {
                  const x = (_a = d.current) == null ? void 0 : _a.closest("form");
                  if (x) {
                    const S = Array.from(x.querySelectorAll("input")), E = S.indexOf(d.current);
                    if (E >= 0) {
                      const k = v.shiftKey ? (E - 1 + S.length) % S.length : (E + 1) % S.length;
                      v.preventDefault(), p(f), S[k].focus(), S[k].select();
                    }
                  }
                }
              },
              className: B("w-20 rounded border px-1.5 py-1 text-right font-mono text-xs outline-none", o ? "border-white/10 bg-white/5 text-white/90 focus:border-white/30" : "border-black/10 bg-black/5 text-black/90 focus:border-black/30"),
              step: 0.1,
              autoFocus: i
            }),
            y.jsx("span", {
              className: B("w-6 text-xs select-none", o ? "text-white/40" : "text-black/40"),
              children: "\xB5m"
            })
          ]
        })
      ]
    });
  }
  function e0() {
    const { isOpen: l, close: n } = ph(), o = me((k) => k.theme) === "dark";
    Hl("goto-dialog", l);
    const [i, c] = g.useState(0), [d, f] = g.useState(0), h = g.useRef(i), p = g.useRef(d), v = g.useCallback((k) => {
      h.current = k, c(k);
    }, []), x = g.useCallback((k) => {
      p.current = k, f(k);
    }, []), S = g.useRef(null);
    g.useEffect(() => {
      l && (v(0), x(0));
    }, [
      l,
      v,
      x
    ]), g.useEffect(() => {
      if (!l) return;
      const k = (b) => {
        S.current && !S.current.contains(b.target) && n();
      };
      return document.addEventListener("mousedown", k), () => document.removeEventListener("mousedown", k);
    }, [
      l,
      n
    ]);
    const E = g.useCallback(() => {
      const k = document.getElementById("rosette-canvas") ?? document.querySelector("canvas");
      if (!k) {
        n();
        return;
      }
      const b = h.current * Wv * ye, C = -(p.current * Wv * ye), _ = {
        minX: b,
        minY: C,
        maxX: b,
        maxY: C
      }, R = zl(k);
      Ye.getState().centerOnBounds(_, R.width, R.height, R.screenCenter), n();
    }, [
      n
    ]);
    return l ? y.jsx("div", {
      className: "fixed inset-0 z-[200]",
      children: y.jsx("div", {
        className: "fixed inset-0 flex items-start justify-center px-4 pt-[min(25vh,200px)]",
        children: y.jsxs("div", {
          ref: S,
          role: "dialog",
          "aria-label": "Go to Coordinate",
          className: B("w-full max-w-[320px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl", o ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          onKeyDown: (k) => {
            k.key === "Escape" && (k.preventDefault(), n());
          },
          children: [
            y.jsx("div", {
              className: B("border-b px-4 py-3 text-sm font-medium select-none", o ? "border-white/10 text-white/90" : "border-black/10 text-black/90"),
              children: "Go to Coordinate"
            }),
            y.jsxs("form", {
              className: "flex flex-col gap-2 px-4 py-3",
              onSubmit: (k) => {
                k.preventDefault(), E();
              },
              children: [
                y.jsx(Jv, {
                  label: "X",
                  value: i,
                  onChange: v,
                  isDark: o,
                  autoFocus: true,
                  onSubmit: E
                }),
                y.jsx(Jv, {
                  label: "Y",
                  value: d,
                  onChange: x,
                  isDark: o,
                  onSubmit: E
                })
              ]
            }),
            y.jsx("div", {
              className: B("flex items-center justify-end border-t px-4 py-3", o ? "border-white/10" : "border-black/10"),
              children: y.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  y.jsx("button", {
                    type: "button",
                    onClick: n,
                    className: B("rounded-lg border px-3 py-1.5 text-xs transition-colors", o ? "border-white/10 text-white/70 hover:bg-white/5" : "border-black/10 text-black/70 hover:bg-black/5"),
                    children: "Cancel"
                  }),
                  y.jsx("button", {
                    type: "button",
                    onClick: E,
                    className: B("rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors", o ? "border-white/20 bg-white/10 text-white/90 hover:bg-white/15" : "border-black/20 bg-black/10 text-black/90 hover:bg-black/15"),
                    children: "Go To"
                  })
                ]
              })
            })
          ]
        })
      })
    }) : null;
  }
  const t0 = 1e3;
  function nx(l) {
    const n = l / (ye * ye * t0 * t0);
    return n === 0 ? "0" : n >= 1 ? n.toFixed(2) : n.toPrecision(4);
  }
  function ij({ item: l, isDark: n }) {
    return y.jsxs("tr", {
      className: B("border-b last:border-b-0", n ? "border-white/5" : "border-black/5"),
      children: [
        y.jsx("td", {
          className: "py-1.5 pr-2 pl-0",
          children: y.jsx("span", {
            className: B("inline-block h-3 w-3 rounded border", n ? "border-white/15" : "border-black/15"),
            style: {
              backgroundColor: l.color
            }
          })
        }),
        y.jsx("td", {
          className: B("py-1.5 pr-3 text-xs", n ? "text-white/80" : "text-black/80"),
          children: l.name
        }),
        y.jsxs("td", {
          className: B("py-1.5 pr-3 font-mono text-xs", n ? "text-white/40" : "text-black/40"),
          children: [
            l.layerNumber,
            "/",
            l.datatype
          ]
        }),
        y.jsx("td", {
          className: B("py-1.5 text-right font-mono text-xs", n ? "text-white/80" : "text-black/80"),
          children: nx(l.area)
        })
      ]
    });
  }
  function n0() {
    const { isOpen: l, close: n, layerAreas: a, totalArea: o, cellName: i } = B1(), d = me((p) => p.theme) === "dark";
    Hl("area-dialog", l);
    const f = g.useRef(null), h = g.useCallback((p) => {
      f.current && !f.current.contains(p.target) && n();
    }, [
      n
    ]);
    return g.useEffect(() => {
      var _a;
      if (l) return (_a = f.current) == null ? void 0 : _a.focus(), document.addEventListener("mousedown", h), () => document.removeEventListener("mousedown", h);
    }, [
      l,
      h
    ]), l ? y.jsx("div", {
      className: "fixed inset-0 z-[200]",
      children: y.jsx("div", {
        className: "fixed inset-0 flex items-start justify-center px-4 pt-[min(20vh,160px)]",
        children: y.jsxs("div", {
          ref: f,
          role: "dialog",
          "aria-label": "Area Calculator",
          className: B("w-full max-w-[420px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl outline-none", d ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          onKeyDown: (p) => {
            p.key === "Escape" && (p.preventDefault(), n());
          },
          tabIndex: -1,
          children: [
            y.jsxs("div", {
              className: B("border-b px-4 py-3 text-sm font-medium select-none", d ? "border-white/10 text-white/90" : "border-black/10 text-black/90"),
              children: [
                "Area: ",
                i
              ]
            }),
            y.jsx("div", {
              className: "max-h-[320px] overflow-y-auto px-4 py-3",
              onWheel: (p) => p.stopPropagation(),
              children: a.length === 0 ? y.jsx("p", {
                className: B("text-xs", d ? "text-white/50" : "text-black/50"),
                children: "No geometry in this cell."
              }) : y.jsxs("table", {
                className: "w-full",
                children: [
                  y.jsx("thead", {
                    children: y.jsxs("tr", {
                      className: B("border-b text-left text-[11px]", d ? "border-white/10 text-white/40" : "border-black/10 text-black/40"),
                      children: [
                        y.jsx("th", {
                          className: "pb-1.5 pr-2 font-normal"
                        }),
                        y.jsx("th", {
                          className: "pb-1.5 pr-3 font-normal",
                          children: "Layer"
                        }),
                        y.jsx("th", {
                          className: "pb-1.5 pr-3 font-normal",
                          children: "L/D"
                        }),
                        y.jsx("th", {
                          className: "pb-1.5 text-right font-normal",
                          children: "\xB5m\xB2"
                        })
                      ]
                    })
                  }),
                  y.jsx("tbody", {
                    children: a.map((p) => y.jsx(ij, {
                      item: p,
                      isDark: d
                    }, `${p.layerNumber}:${p.datatype}`))
                  })
                ]
              })
            }),
            y.jsxs("div", {
              className: B("flex items-center justify-between border-t px-4 py-3", d ? "border-white/10" : "border-black/10"),
              children: [
                a.length > 0 ? y.jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [
                    y.jsx("span", {
                      className: B("text-xs font-medium select-none", d ? "text-white/60" : "text-black/60"),
                      children: "Total"
                    }),
                    y.jsxs("span", {
                      className: B("font-mono text-xs font-medium", d ? "text-white/90" : "text-black/90"),
                      children: [
                        nx(o),
                        " ",
                        "\xB5m\xB2"
                      ]
                    })
                  ]
                }) : y.jsx("div", {}),
                y.jsx("button", {
                  type: "button",
                  onClick: n,
                  className: B("rounded-lg border px-3 py-1.5 text-xs transition-colors", d ? "border-white/10 text-white/70 hover:bg-white/5" : "border-black/10 text-black/70 hover:bg-black/5"),
                  children: "Close"
                })
              ]
            })
          ]
        })
      })
    }) : null;
  }
  function cj() {
    const l = me((f) => f.theme), n = me((f) => f.zenMode), { isLg: a, isMd: o, isSm: i } = vh(), c = rs(), d = g.useRef(null);
    return g.useEffect(() => {
      d.current === null ? a ? (me.getState().setExplorerCollapsed(false), me.getState().setSidebarCollapsed(false)) : (me.getState().setExplorerCollapsed(true), me.getState().setSidebarCollapsed(true)) : d.current && !a ? (me.getState().setExplorerCollapsed(true), me.getState().setSidebarCollapsed(true)) : !d.current && a && (me.getState().setExplorerCollapsed(false), me.getState().setSidebarCollapsed(false)), d.current = a;
    }, [
      a
    ]), g.useEffect(() => {
      if (!c) return;
      const f = MC();
      f !== null && (me.getState().setExplorerWidth(f), me.getState().setSidebarWidth(f));
    }, [
      c
    ]), g.useEffect(() => {
      if (!Un || c) return;
      const f = async (h) => {
        if (h.metaKey || h.ctrlKey) {
          if (h.key === "n") h.preventDefault(), await xh();
          else if (h.key === "o") {
            h.preventDefault();
            const v = await G0();
            v && await Ff(v);
          } else if (h.key === "s" && h.shiftKey) h.preventDefault(), await Qf(true);
          else if (h.key === "s" && !h.shiftKey) h.preventDefault(), await Qf(false);
          else if (h.key === "t") {
            h.preventDefault();
            const v = Ze.getState().activeTabId;
            if (v) {
              as(v);
              const x = Se.getState().library;
              x && Jo(v, x);
            }
            window.dispatchEvent(new CustomEvent("rosette-new-tab"));
          } else if (h.key === "w") {
            h.preventDefault();
            const v = Ze.getState().activeTabId;
            v && window.dispatchEvent(new CustomEvent("rosette-close-tab", {
              detail: v
            }));
          } else if (h.key === "[" && h.shiftKey) {
            h.preventDefault();
            const { tabs: v, activeTabId: x } = Ze.getState();
            if (v.length > 1 && x) {
              const E = (v.findIndex((k) => k.id === x) - 1 + v.length) % v.length;
              Ua(x, v[E].id), Ze.getState().setActiveTab(v[E].id);
            }
          } else if (h.key === "]" && h.shiftKey) {
            h.preventDefault();
            const { tabs: v, activeTabId: x } = Ze.getState();
            if (v.length > 1 && x) {
              const E = (v.findIndex((k) => k.id === x) + 1) % v.length;
              Ua(x, v[E].id), Ze.getState().setActiveTab(v[E].id);
            }
          }
        }
      };
      return window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f);
    }, [
      c
    ]), g.useEffect(() => {
      if (c) return;
      const f = async (h) => {
        const p = h.detail;
        if (!p) return;
        const v = Ze.getState().getTab(p);
        if (!v) return;
        const x = Ze.getState().activeTabId === p;
        if ((x ? v.isDirty || Wn.getState().isDirty : v.isDirty) && !await K1()) return;
        const E = Ze.getState(), k = E.tabs.findIndex((b) => b.id === p);
        if (x && E.tabs.length > 1) {
          const b = E.tabs.filter((_) => _.id !== p), C = k < b.length ? b[k].id : b[b.length - 1].id;
          Ua(p, C), Ze.getState().closeTab(p), Fi(p);
        } else x && E.tabs.length === 1 ? (Ze.getState().closeTab(p), window.dispatchEvent(new CustomEvent("rosette-new-tab")), Fi(p)) : (Ze.getState().closeTab(p), Fi(p));
      };
      return window.addEventListener("rosette-close-tab", f), () => window.removeEventListener("rosette-close-tab", f);
    }, [
      c
    ]), g.useEffect(() => {
      if (!Un || c) return;
      let f = null, h = false;
      return (async () => {
        try {
          const { getCurrentWebviewWindow: p } = await wt(async () => {
            const { getCurrentWebviewWindow: S } = await import("./webviewWindow-DoRoZnHQ.js");
            return {
              getCurrentWebviewWindow: S
            };
          }, __vite__mapDeps([5,1,2]), import.meta.url), x = await p().onDragDropEvent(async (S) => {
            if (S.payload.type === "drop") {
              const k = S.payload.paths.find((b) => b.endsWith(".gds") || b.endsWith(".gds2") || b.endsWith(".gdsii"));
              k && await Ff(k);
            }
          });
          h ? x() : f = x;
        } catch {
        }
      })(), () => {
        h = true, f == null ? void 0 : f();
      };
    }, [
      c
    ]), c ? y.jsxs("div", {
      className: `flex h-screen w-screen flex-col ${l === "dark" ? "bg-black" : "bg-white"}`,
      children: [
        y.jsxs("div", {
          className: "relative min-h-0 flex-1",
          children: [
            y.jsx(ub, {}),
            !n && y.jsx(Zv, {
              compact: !a,
              minimal: i
            }),
            !n && y.jsx(Dv, {}),
            !n && y.jsx(Bv, {}),
            !i && y.jsx(zv, {}),
            y.jsx(Mb, {}),
            y.jsx(Qv, {}),
            y.jsx(e0, {}),
            y.jsx(n0, {})
          ]
        }),
        y.jsx($v, {
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
            y.jsx(ub, {}),
            !n && y.jsx(Zv, {
              compact: !a,
              minimal: i
            }),
            !n && y.jsx(Dv, {}),
            !n && y.jsx(Bv, {}),
            !i && y.jsx(zv, {}),
            y.jsx(Mb, {}),
            y.jsx(Qv, {}),
            y.jsx(e0, {}),
            y.jsx(n0, {})
          ]
        }),
        y.jsx($v, {
          compact: o || i,
          minimal: i
        }),
        y.jsx(sj, {})
      ]
    });
  }
  yS.createRoot(document.getElementById("root")).render(y.jsx(g.StrictMode, {
    children: y.jsx(cj, {})
  }));
})();
