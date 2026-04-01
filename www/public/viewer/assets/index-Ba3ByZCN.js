const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-C2Rw4G7o.js","./core-DxBnVPgq.js","./event-BC8TvpKC.js","./index-DWHWQ1OU.js","./index-BQlnJ-sT.js","./webviewWindow-DoRoZnHQ.js"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(async () => {
  function Vw(l, n) {
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
      for (const c of s) if (c.type === "childList") for (const f of c.addedNodes) f.tagName === "LINK" && f.rel === "modulepreload" && o(f);
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
  function Vv(l) {
    return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
  }
  var Ed = {
    exports: {}
  }, To = {};
  var ny;
  function $w() {
    if (ny) return To;
    ny = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
    function r(o, s, c) {
      var f = null;
      if (c !== void 0 && (f = "" + c), s.key !== void 0 && (f = "" + s.key), "key" in s) {
        c = {};
        for (var d in s) d !== "key" && (c[d] = s[d]);
      } else c = s;
      return s = c.ref, {
        $$typeof: l,
        type: o,
        key: f,
        ref: s !== void 0 ? s : null,
        props: c
      };
    }
    return To.Fragment = n, To.jsx = r, To.jsxs = r, To;
  }
  var ly;
  function qw() {
    return ly || (ly = 1, Ed.exports = $w()), Ed.exports;
  }
  var y = qw(), _d = {
    exports: {}
  }, De = {};
  var ry;
  function Gw() {
    if (ry) return De;
    ry = 1;
    var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), s = Symbol.for("react.profiler"), c = Symbol.for("react.consumer"), f = Symbol.for("react.context"), d = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), b = Symbol.for("react.activity"), S = Symbol.iterator;
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
    }, w = Object.assign, C = {};
    function _(L, D, $) {
      this.props = L, this.context = D, this.refs = C, this.updater = $ || k;
    }
    _.prototype.isReactComponent = {}, _.prototype.setState = function(L, D) {
      if (typeof L != "object" && typeof L != "function" && L != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, L, D, "setState");
    }, _.prototype.forceUpdate = function(L) {
      this.updater.enqueueForceUpdate(this, L, "forceUpdate");
    };
    function T() {
    }
    T.prototype = _.prototype;
    function A(L, D, $) {
      this.props = L, this.context = D, this.refs = C, this.updater = $ || k;
    }
    var j = A.prototype = new T();
    j.constructor = A, w(j, _.prototype), j.isPureReactComponent = true;
    var U = Array.isArray;
    function N() {
    }
    var R = {
      H: null,
      A: null,
      T: null,
      S: null
    }, O = Object.prototype.hasOwnProperty;
    function H(L, D, $) {
      var J = $.ref;
      return {
        $$typeof: l,
        type: L,
        key: D,
        ref: J !== void 0 ? J : null,
        props: $
      };
    }
    function G(L, D) {
      return H(L.type, D, L.props);
    }
    function te(L) {
      return typeof L == "object" && L !== null && L.$$typeof === l;
    }
    function ee(L) {
      var D = {
        "=": "=0",
        ":": "=2"
      };
      return "$" + L.replace(/[=:]/g, function($) {
        return D[$];
      });
    }
    var fe = /\/+/g;
    function me(L, D) {
      return typeof L == "object" && L !== null && L.key != null ? ee("" + L.key) : D.toString(36);
    }
    function Ee(L) {
      switch (L.status) {
        case "fulfilled":
          return L.value;
        case "rejected":
          throw L.reason;
        default:
          switch (typeof L.status == "string" ? L.then(N, N) : (L.status = "pending", L.then(function(D) {
            L.status === "pending" && (L.status = "fulfilled", L.value = D);
          }, function(D) {
            L.status === "pending" && (L.status = "rejected", L.reason = D);
          })), L.status) {
            case "fulfilled":
              return L.value;
            case "rejected":
              throw L.reason;
          }
      }
      throw L;
    }
    function q(L, D, $, J, W) {
      var ie = typeof L;
      (ie === "undefined" || ie === "boolean") && (L = null);
      var X = false;
      if (L === null) X = true;
      else switch (ie) {
        case "bigint":
        case "string":
        case "number":
          X = true;
          break;
        case "object":
          switch (L.$$typeof) {
            case l:
            case n:
              X = true;
              break;
            case v:
              return X = L._init, q(X(L._payload), D, $, J, W);
          }
      }
      if (X) return W = W(L), X = J === "" ? "." + me(L, 0) : J, U(W) ? ($ = "", X != null && ($ = X.replace(fe, "$&/") + "/"), q(W, D, $, "", function(se) {
        return se;
      })) : W != null && (te(W) && (W = G(W, $ + (W.key == null || L && L.key === W.key ? "" : ("" + W.key).replace(fe, "$&/") + "/") + X)), D.push(W)), 1;
      X = 0;
      var ue = J === "" ? "." : J + ":";
      if (U(L)) for (var I = 0; I < L.length; I++) J = L[I], ie = ue + me(J, I), X += q(J, D, $, ie, W);
      else if (I = E(L), typeof I == "function") for (L = I.call(L), I = 0; !(J = L.next()).done; ) J = J.value, ie = ue + me(J, I++), X += q(J, D, $, ie, W);
      else if (ie === "object") {
        if (typeof L.then == "function") return q(Ee(L), D, $, J, W);
        throw D = String(L), Error("Objects are not valid as a React child (found: " + (D === "[object Object]" ? "object with keys {" + Object.keys(L).join(", ") + "}" : D) + "). If you meant to render a collection of children, use an array instead.");
      }
      return X;
    }
    function F(L, D, $) {
      if (L == null) return L;
      var J = [], W = 0;
      return q(L, J, "", "", function(ie) {
        return D.call($, ie, W++);
      }), J;
    }
    function ce(L) {
      if (L._status === -1) {
        var D = L._result;
        D = D(), D.then(function($) {
          (L._status === 0 || L._status === -1) && (L._status = 1, L._result = $);
        }, function($) {
          (L._status === 0 || L._status === -1) && (L._status = 2, L._result = $);
        }), L._status === -1 && (L._status = 0, L._result = D);
      }
      if (L._status === 1) return L._result.default;
      throw L._result;
    }
    var _e = typeof reportError == "function" ? reportError : function(L) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var D = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: typeof L == "object" && L !== null && typeof L.message == "string" ? String(L.message) : String(L),
          error: L
        });
        if (!window.dispatchEvent(D)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", L);
        return;
      }
      console.error(L);
    }, be = {
      map: F,
      forEach: function(L, D, $) {
        F(L, function() {
          D.apply(this, arguments);
        }, $);
      },
      count: function(L) {
        var D = 0;
        return F(L, function() {
          D++;
        }), D;
      },
      toArray: function(L) {
        return F(L, function(D) {
          return D;
        }) || [];
      },
      only: function(L) {
        if (!te(L)) throw Error("React.Children.only expected to receive a single React element child.");
        return L;
      }
    };
    return De.Activity = b, De.Children = be, De.Component = _, De.Fragment = r, De.Profiler = s, De.PureComponent = A, De.StrictMode = o, De.Suspense = m, De.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = R, De.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(L) {
        return R.H.useMemoCache(L);
      }
    }, De.cache = function(L) {
      return function() {
        return L.apply(null, arguments);
      };
    }, De.cacheSignal = function() {
      return null;
    }, De.cloneElement = function(L, D, $) {
      if (L == null) throw Error("The argument must be a React element, but you passed " + L + ".");
      var J = w({}, L.props), W = L.key;
      if (D != null) for (ie in D.key !== void 0 && (W = "" + D.key), D) !O.call(D, ie) || ie === "key" || ie === "__self" || ie === "__source" || ie === "ref" && D.ref === void 0 || (J[ie] = D[ie]);
      var ie = arguments.length - 2;
      if (ie === 1) J.children = $;
      else if (1 < ie) {
        for (var X = Array(ie), ue = 0; ue < ie; ue++) X[ue] = arguments[ue + 2];
        J.children = X;
      }
      return H(L.type, W, J);
    }, De.createContext = function(L) {
      return L = {
        $$typeof: f,
        _currentValue: L,
        _currentValue2: L,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      }, L.Provider = L, L.Consumer = {
        $$typeof: c,
        _context: L
      }, L;
    }, De.createElement = function(L, D, $) {
      var J, W = {}, ie = null;
      if (D != null) for (J in D.key !== void 0 && (ie = "" + D.key), D) O.call(D, J) && J !== "key" && J !== "__self" && J !== "__source" && (W[J] = D[J]);
      var X = arguments.length - 2;
      if (X === 1) W.children = $;
      else if (1 < X) {
        for (var ue = Array(X), I = 0; I < X; I++) ue[I] = arguments[I + 2];
        W.children = ue;
      }
      if (L && L.defaultProps) for (J in X = L.defaultProps, X) W[J] === void 0 && (W[J] = X[J]);
      return H(L, ie, W);
    }, De.createRef = function() {
      return {
        current: null
      };
    }, De.forwardRef = function(L) {
      return {
        $$typeof: d,
        render: L
      };
    }, De.isValidElement = te, De.lazy = function(L) {
      return {
        $$typeof: v,
        _payload: {
          _status: -1,
          _result: L
        },
        _init: ce
      };
    }, De.memo = function(L, D) {
      return {
        $$typeof: p,
        type: L,
        compare: D === void 0 ? null : D
      };
    }, De.startTransition = function(L) {
      var D = R.T, $ = {};
      R.T = $;
      try {
        var J = L(), W = R.S;
        W !== null && W($, J), typeof J == "object" && J !== null && typeof J.then == "function" && J.then(N, _e);
      } catch (ie) {
        _e(ie);
      } finally {
        D !== null && $.types !== null && (D.types = $.types), R.T = D;
      }
    }, De.unstable_useCacheRefresh = function() {
      return R.H.useCacheRefresh();
    }, De.use = function(L) {
      return R.H.use(L);
    }, De.useActionState = function(L, D, $) {
      return R.H.useActionState(L, D, $);
    }, De.useCallback = function(L, D) {
      return R.H.useCallback(L, D);
    }, De.useContext = function(L) {
      return R.H.useContext(L);
    }, De.useDebugValue = function() {
    }, De.useDeferredValue = function(L, D) {
      return R.H.useDeferredValue(L, D);
    }, De.useEffect = function(L, D) {
      return R.H.useEffect(L, D);
    }, De.useEffectEvent = function(L) {
      return R.H.useEffectEvent(L);
    }, De.useId = function() {
      return R.H.useId();
    }, De.useImperativeHandle = function(L, D, $) {
      return R.H.useImperativeHandle(L, D, $);
    }, De.useInsertionEffect = function(L, D) {
      return R.H.useInsertionEffect(L, D);
    }, De.useLayoutEffect = function(L, D) {
      return R.H.useLayoutEffect(L, D);
    }, De.useMemo = function(L, D) {
      return R.H.useMemo(L, D);
    }, De.useOptimistic = function(L, D) {
      return R.H.useOptimistic(L, D);
    }, De.useReducer = function(L, D, $) {
      return R.H.useReducer(L, D, $);
    }, De.useRef = function(L) {
      return R.H.useRef(L);
    }, De.useState = function(L) {
      return R.H.useState(L);
    }, De.useSyncExternalStore = function(L, D, $) {
      return R.H.useSyncExternalStore(L, D, $);
    }, De.useTransition = function() {
      return R.H.useTransition();
    }, De.version = "19.2.4", De;
  }
  var ay;
  function Ff() {
    return ay || (ay = 1, _d.exports = Gw()), _d.exports;
  }
  var g = Ff();
  const Da = Vv(g), Qf = Vw({
    __proto__: null,
    default: Da
  }, [
    g
  ]);
  var kd = {
    exports: {}
  }, No = {}, Md = {
    exports: {}
  }, jd = {};
  var oy;
  function Pw() {
    return oy || (oy = 1, (function(l) {
      function n(q, F) {
        var ce = q.length;
        q.push(F);
        e: for (; 0 < ce; ) {
          var _e = ce - 1 >>> 1, be = q[_e];
          if (0 < s(be, F)) q[_e] = F, q[ce] = be, ce = _e;
          else break e;
        }
      }
      function r(q) {
        return q.length === 0 ? null : q[0];
      }
      function o(q) {
        if (q.length === 0) return null;
        var F = q[0], ce = q.pop();
        if (ce !== F) {
          q[0] = ce;
          e: for (var _e = 0, be = q.length, L = be >>> 1; _e < L; ) {
            var D = 2 * (_e + 1) - 1, $ = q[D], J = D + 1, W = q[J];
            if (0 > s($, ce)) J < be && 0 > s(W, $) ? (q[_e] = W, q[J] = ce, _e = J) : (q[_e] = $, q[D] = ce, _e = D);
            else if (J < be && 0 > s(W, ce)) q[_e] = W, q[J] = ce, _e = J;
            else break e;
          }
        }
        return F;
      }
      function s(q, F) {
        var ce = q.sortIndex - F.sortIndex;
        return ce !== 0 ? ce : q.id - F.id;
      }
      if (l.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
        var c = performance;
        l.unstable_now = function() {
          return c.now();
        };
      } else {
        var f = Date, d = f.now();
        l.unstable_now = function() {
          return f.now() - d;
        };
      }
      var m = [], p = [], v = 1, b = null, S = 3, E = false, k = false, w = false, C = false, _ = typeof setTimeout == "function" ? setTimeout : null, T = typeof clearTimeout == "function" ? clearTimeout : null, A = typeof setImmediate < "u" ? setImmediate : null;
      function j(q) {
        for (var F = r(p); F !== null; ) {
          if (F.callback === null) o(p);
          else if (F.startTime <= q) o(p), F.sortIndex = F.expirationTime, n(m, F);
          else break;
          F = r(p);
        }
      }
      function U(q) {
        if (w = false, j(q), !k) if (r(m) !== null) k = true, N || (N = true, ee());
        else {
          var F = r(p);
          F !== null && Ee(U, F.startTime - q);
        }
      }
      var N = false, R = -1, O = 5, H = -1;
      function G() {
        return C ? true : !(l.unstable_now() - H < O);
      }
      function te() {
        if (C = false, N) {
          var q = l.unstable_now();
          H = q;
          var F = true;
          try {
            e: {
              k = false, w && (w = false, T(R), R = -1), E = true;
              var ce = S;
              try {
                t: {
                  for (j(q), b = r(m); b !== null && !(b.expirationTime > q && G()); ) {
                    var _e = b.callback;
                    if (typeof _e == "function") {
                      b.callback = null, S = b.priorityLevel;
                      var be = _e(b.expirationTime <= q);
                      if (q = l.unstable_now(), typeof be == "function") {
                        b.callback = be, j(q), F = true;
                        break t;
                      }
                      b === r(m) && o(m), j(q);
                    } else o(m);
                    b = r(m);
                  }
                  if (b !== null) F = true;
                  else {
                    var L = r(p);
                    L !== null && Ee(U, L.startTime - q), F = false;
                  }
                }
                break e;
              } finally {
                b = null, S = ce, E = false;
              }
              F = void 0;
            }
          } finally {
            F ? ee() : N = false;
          }
        }
      }
      var ee;
      if (typeof A == "function") ee = function() {
        A(te);
      };
      else if (typeof MessageChannel < "u") {
        var fe = new MessageChannel(), me = fe.port2;
        fe.port1.onmessage = te, ee = function() {
          me.postMessage(null);
        };
      } else ee = function() {
        _(te, 0);
      };
      function Ee(q, F) {
        R = _(function() {
          q(l.unstable_now());
        }, F);
      }
      l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function(q) {
        q.callback = null;
      }, l.unstable_forceFrameRate = function(q) {
        0 > q || 125 < q ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : O = 0 < q ? Math.floor(1e3 / q) : 5;
      }, l.unstable_getCurrentPriorityLevel = function() {
        return S;
      }, l.unstable_next = function(q) {
        switch (S) {
          case 1:
          case 2:
          case 3:
            var F = 3;
            break;
          default:
            F = S;
        }
        var ce = S;
        S = F;
        try {
          return q();
        } finally {
          S = ce;
        }
      }, l.unstable_requestPaint = function() {
        C = true;
      }, l.unstable_runWithPriority = function(q, F) {
        switch (q) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            q = 3;
        }
        var ce = S;
        S = q;
        try {
          return F();
        } finally {
          S = ce;
        }
      }, l.unstable_scheduleCallback = function(q, F, ce) {
        var _e = l.unstable_now();
        switch (typeof ce == "object" && ce !== null ? (ce = ce.delay, ce = typeof ce == "number" && 0 < ce ? _e + ce : _e) : ce = _e, q) {
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
        return be = ce + be, q = {
          id: v++,
          callback: F,
          priorityLevel: q,
          startTime: ce,
          expirationTime: be,
          sortIndex: -1
        }, ce > _e ? (q.sortIndex = ce, n(p, q), r(m) === null && q === r(p) && (w ? (T(R), R = -1) : w = true, Ee(U, ce - _e))) : (q.sortIndex = be, n(m, q), k || E || (k = true, N || (N = true, ee()))), q;
      }, l.unstable_shouldYield = G, l.unstable_wrapCallback = function(q) {
        var F = S;
        return function() {
          var ce = S;
          S = F;
          try {
            return q.apply(this, arguments);
          } finally {
            S = ce;
          }
        };
      };
    })(jd)), jd;
  }
  var iy;
  function Kw() {
    return iy || (iy = 1, Md.exports = Pw()), Md.exports;
  }
  var Ld = {
    exports: {}
  }, Zt = {};
  var sy;
  function Zw() {
    if (sy) return Zt;
    sy = 1;
    var l = Ff();
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
    var f = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function d(m, p) {
      if (m === "font") return "";
      if (typeof p == "string") return p === "use-credentials" ? p : "";
    }
    return Zt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Zt.createPortal = function(m, p) {
      var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11) throw Error(n(299));
      return c(m, p, null, v);
    }, Zt.flushSync = function(m) {
      var p = f.T, v = o.p;
      try {
        if (f.T = null, o.p = 2, m) return m();
      } finally {
        f.T = p, o.p = v, o.d.f();
      }
    }, Zt.preconnect = function(m, p) {
      typeof m == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, o.d.C(m, p));
    }, Zt.prefetchDNS = function(m) {
      typeof m == "string" && o.d.D(m);
    }, Zt.preinit = function(m, p) {
      if (typeof m == "string" && p && typeof p.as == "string") {
        var v = p.as, b = d(v, p.crossOrigin), S = typeof p.integrity == "string" ? p.integrity : void 0, E = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
        v === "style" ? o.d.S(m, typeof p.precedence == "string" ? p.precedence : void 0, {
          crossOrigin: b,
          integrity: S,
          fetchPriority: E
        }) : v === "script" && o.d.X(m, {
          crossOrigin: b,
          integrity: S,
          fetchPriority: E,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0
        });
      }
    }, Zt.preinitModule = function(m, p) {
      if (typeof m == "string") if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var v = d(p.as, p.crossOrigin);
          o.d.M(m, {
            crossOrigin: v,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && o.d.M(m);
    }, Zt.preload = function(m, p) {
      if (typeof m == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
        var v = p.as, b = d(v, p.crossOrigin);
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
        var v = d(p.as, p.crossOrigin);
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
      return f.H.useFormState(m, p, v);
    }, Zt.useFormStatus = function() {
      return f.H.useHostTransitionStatus();
    }, Zt.version = "19.2.4", Zt;
  }
  var cy;
  function $v() {
    if (cy) return Ld.exports;
    cy = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), Ld.exports = Zw(), Ld.exports;
  }
  var uy;
  function Fw() {
    if (uy) return No;
    uy = 1;
    var l = Kw(), n = Ff(), r = $v();
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
    function f(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
      }
      return null;
    }
    function d(e) {
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
    var b = Object.assign, S = Symbol.for("react.element"), E = Symbol.for("react.transitional.element"), k = Symbol.for("react.portal"), w = Symbol.for("react.fragment"), C = Symbol.for("react.strict_mode"), _ = Symbol.for("react.profiler"), T = Symbol.for("react.consumer"), A = Symbol.for("react.context"), j = Symbol.for("react.forward_ref"), U = Symbol.for("react.suspense"), N = Symbol.for("react.suspense_list"), R = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), H = Symbol.for("react.activity"), G = Symbol.for("react.memo_cache_sentinel"), te = Symbol.iterator;
    function ee(e) {
      return e === null || typeof e != "object" ? null : (e = te && e[te] || e["@@iterator"], typeof e == "function" ? e : null);
    }
    var fe = Symbol.for("react.client.reference");
    function me(e) {
      if (e == null) return null;
      if (typeof e == "function") return e.$$typeof === fe ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case w:
          return "Fragment";
        case _:
          return "Profiler";
        case C:
          return "StrictMode";
        case U:
          return "Suspense";
        case N:
          return "SuspenseList";
        case H:
          return "Activity";
      }
      if (typeof e == "object") switch (e.$$typeof) {
        case k:
          return "Portal";
        case A:
          return e.displayName || "Context";
        case T:
          return (e._context.displayName || "Context") + ".Consumer";
        case j:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case R:
          return t = e.displayName || null, t !== null ? t : me(e.type) || "Memo";
        case O:
          t = e._payload, e = e._init;
          try {
            return me(e(t));
          } catch {
          }
      }
      return null;
    }
    var Ee = Array.isArray, q = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, F = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ce = {
      pending: false,
      data: null,
      method: null,
      action: null
    }, _e = [], be = -1;
    function L(e) {
      return {
        current: e
      };
    }
    function D(e) {
      0 > be || (e.current = _e[be], _e[be] = null, be--);
    }
    function $(e, t) {
      be++, _e[be] = e.current, e.current = t;
    }
    var J = L(null), W = L(null), ie = L(null), X = L(null);
    function ue(e, t) {
      switch ($(ie, t), $(W, e), $(J, null), t.nodeType) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? _p(e) : 0;
          break;
        default:
          if (e = t.tagName, t = t.namespaceURI) t = _p(t), e = kp(t, e);
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
      D(J), $(J, e);
    }
    function I() {
      D(J), D(W), D(ie);
    }
    function se(e) {
      e.memoizedState !== null && $(X, e);
      var t = J.current, a = kp(t, e.type);
      t !== a && ($(W, e), $(J, a));
    }
    function ge(e) {
      W.current === e && (D(J), D(W)), X.current === e && (D(X), jo._currentValue = ce);
    }
    var ve, Le;
    function Me(e) {
      if (ve === void 0) try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        ve = t && t[1] || "", Le = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
      return `
` + ve + e + Le;
    }
    var $e = false;
    function Ze(e, t) {
      if (!e || $e) return "";
      $e = true;
      var a = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var i = {
          DetermineComponentFrameRoot: function() {
            try {
              if (t) {
                var ae = function() {
                  throw Error();
                };
                if (Object.defineProperty(ae.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(ae, []);
                  } catch (Q) {
                    var Z = Q;
                  }
                  Reflect.construct(e, [], ae);
                } else {
                  try {
                    ae.call();
                  } catch (Q) {
                    Z = Q;
                  }
                  e.call(ae.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (Q) {
                  Z = Q;
                }
                (ae = e()) && typeof ae.catch == "function" && ae.catch(function() {
                });
              }
            } catch (Q) {
              if (Q && Z && typeof Q.stack == "string") return [
                Q.stack,
                Z.stack
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
          var z = x.split(`
`), K = M.split(`
`);
          for (u = i = 0; i < z.length && !z[i].includes("DetermineComponentFrameRoot"); ) i++;
          for (; u < K.length && !K[u].includes("DetermineComponentFrameRoot"); ) u++;
          if (i === z.length || u === K.length) for (i = z.length - 1, u = K.length - 1; 1 <= i && 0 <= u && z[i] !== K[u]; ) u--;
          for (; 1 <= i && 0 <= u; i--, u--) if (z[i] !== K[u]) {
            if (i !== 1 || u !== 1) do
              if (i--, u--, 0 > u || z[i] !== K[u]) {
                var ne = `
` + z[i].replace(" at new ", " at ");
                return e.displayName && ne.includes("<anonymous>") && (ne = ne.replace("<anonymous>", e.displayName)), ne;
              }
            while (1 <= i && 0 <= u);
            break;
          }
        }
      } finally {
        $e = false, Error.prepareStackTrace = a;
      }
      return (a = e ? e.displayName || e.name : "") ? Me(a) : "";
    }
    function we(e, t) {
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
          return Ze(e.type, false);
        case 11:
          return Ze(e.type.render, false);
        case 1:
          return Ze(e.type, true);
        case 31:
          return Me("Activity");
        default:
          return "";
      }
    }
    function je(e) {
      try {
        var t = "", a = null;
        do
          t += we(e, a), a = e, e = e.return;
        while (e);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    var Ae = Object.prototype.hasOwnProperty, et = l.unstable_scheduleCallback, Fe = l.unstable_cancelCallback, Ut = l.unstable_shouldYield, hn = l.unstable_requestPaint, jt = l.unstable_now, il = l.unstable_getCurrentPriorityLevel, Rl = l.unstable_ImmediatePriority, Al = l.unstable_UserBlockingPriority, $r = l.unstable_NormalPriority, gc = l.unstable_LowPriority, Ba = l.unstable_IdlePriority, ii = l.log, si = l.unstable_setDisableYieldValue, Tl = null, Wt = null;
    function Pn(e) {
      if (typeof ii == "function" && si(e), Wt && typeof Wt.setStrictMode == "function") try {
        Wt.setStrictMode(Tl, e);
      } catch {
      }
    }
    var Jt = Math.clz32 ? Math.clz32 : ui, pc = Math.log, ci = Math.LN2;
    function ui(e) {
      return e >>>= 0, e === 0 ? 32 : 31 - (pc(e) / ci | 0) | 0;
    }
    var pr = 256, qr = 262144, Gr = 4194304;
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
    function di(e, t) {
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
    function Pr() {
      var e = Gr;
      return Gr <<= 1, (Gr & 62914560) === 0 && (Gr = 4194304), e;
    }
    function yr(e) {
      for (var t = [], a = 0; 31 > a; a++) t.push(e);
      return t;
    }
    function br(e, t) {
      e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
    }
    function Kn(e, t, a, i, u, h) {
      var x = e.pendingLanes;
      e.pendingLanes = a, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= a, e.entangledLanes &= a, e.errorRecoveryDisabledLanes &= a, e.shellSuspendCounter = 0;
      var M = e.entanglements, z = e.expirationTimes, K = e.hiddenUpdates;
      for (a = x & ~a; 0 < a; ) {
        var ne = 31 - Jt(a), ae = 1 << ne;
        M[ne] = 0, z[ne] = -1;
        var Z = K[ne];
        if (Z !== null) for (K[ne] = null, ne = 0; ne < Z.length; ne++) {
          var Q = Z[ne];
          Q !== null && (Q.lane &= -536870913);
        }
        a &= ~ae;
      }
      i !== 0 && fi(e, i, 0), h !== 0 && u === 0 && e.tag !== 0 && (e.suspendedLanes |= h & ~(x & ~t));
    }
    function fi(e, t, a) {
      e.pendingLanes |= t, e.suspendedLanes &= ~t;
      var i = 31 - Jt(t);
      e.entangledLanes |= t, e.entanglements[i] = e.entanglements[i] | 1073741824 | a & 261930;
    }
    function hi(e, t) {
      var a = e.entangledLanes |= t;
      for (e = e.entanglements; a; ) {
        var i = 31 - Jt(a), u = 1 << i;
        u & t | e[i] & t && (e[i] |= t), a &= ~u;
      }
    }
    function mi(e, t) {
      var a = t & -t;
      return a = (a & 42) !== 0 ? 1 : Zn(a), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
    }
    function Zn(e) {
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
    function Xa(e) {
      return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
    }
    function Fn() {
      var e = F.p;
      return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Zp(e.type));
    }
    function vr(e, t) {
      var a = F.p;
      try {
        return F.p = e, t();
      } finally {
        F.p = a;
      }
    }
    var cl = Math.random().toString(36).slice(2), It = "__reactFiber$" + cl, le = "__reactProps$" + cl, Oe = "__reactContainer$" + cl, it = "__reactEvents$" + cl, qe = "__reactListeners$" + cl, pt = "__reactHandles$" + cl, mt = "__reactResources$" + cl, nt = "__reactMarker$" + cl;
    function dt(e) {
      delete e[It], delete e[le], delete e[it], delete e[qe], delete e[pt];
    }
    function Et(e) {
      var t = e[It];
      if (t) return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[Oe] || a[It]) {
          if (a = t.alternate, t.child !== null || a !== null && a.child !== null) for (e = Np(e); e !== null; ) {
            if (a = e[It]) return a;
            e = Np(e);
          }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Qe(e) {
      if (e = e[It] || e[Oe]) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
      }
      return null;
    }
    function Yt(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(o(33));
    }
    function Lt(e) {
      var t = e[mt];
      return t || (t = e[mt] = {
        hoistableStyles: /* @__PURE__ */ new Map(),
        hoistableScripts: /* @__PURE__ */ new Map()
      }), t;
    }
    function rt(e) {
      e[nt] = true;
    }
    var Qn = /* @__PURE__ */ new Set(), Wn = {};
    function mn(e, t) {
      Hn(e, t), Hn(e + "Capture", t);
    }
    function Hn(e, t) {
      for (Wn[e] = t, e = 0; e < t.length; e++) Qn.add(t[e]);
    }
    var Kr = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ol = {}, xr = {};
    function Dl(e) {
      return Ae.call(xr, e) ? true : Ae.call(Ol, e) ? false : Kr.test(e) ? xr[e] = true : (Ol[e] = true, false);
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
    function Vt(e) {
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
    function gi(e) {
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
        var t = gi(e) ? "checked" : "value";
        e._valueTracker = yc(e, t, "" + e[t]);
      }
    }
    function Va(e) {
      if (!e) return false;
      var t = e._valueTracker;
      if (!t) return true;
      var a = t.getValue(), i = "";
      return e && (i = gi(e) ? e.checked ? "true" : "false" : e.value), e = i, e !== a ? (t.setValue(e), true) : false;
    }
    function pi(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var z1 = /[\n"\\]/g;
    function _n(e) {
      return e.replace(z1, function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      });
    }
    function bc(e, t, a, i, u, h, x, M) {
      e.name = "", x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" ? e.type = x : e.removeAttribute("type"), t != null ? x === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Vt(t)) : e.value !== "" + Vt(t) && (e.value = "" + Vt(t)) : x !== "submit" && x !== "reset" || e.removeAttribute("value"), t != null ? vc(e, x, Vt(t)) : a != null ? vc(e, x, Vt(a)) : i != null && e.removeAttribute("value"), u == null && h != null && (e.defaultChecked = !!h), u != null && (e.checked = u && typeof u != "function" && typeof u != "symbol"), M != null && typeof M != "function" && typeof M != "symbol" && typeof M != "boolean" ? e.name = "" + Vt(M) : e.removeAttribute("name");
    }
    function vh(e, t, a, i, u, h, x, M) {
      if (h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" && (e.type = h), t != null || a != null) {
        if (!(h !== "submit" && h !== "reset" || t != null)) {
          Zr(e);
          return;
        }
        a = a != null ? "" + Vt(a) : "", t = t != null ? "" + Vt(t) : a, M || t === e.value || (e.value = t), e.defaultValue = t;
      }
      i = i ?? u, i = typeof i != "function" && typeof i != "symbol" && !!i, e.checked = M ? e.checked : !!i, e.defaultChecked = !!i, x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" && (e.name = x), Zr(e);
    }
    function vc(e, t, a) {
      t === "number" && pi(e.ownerDocument) === e || e.defaultValue === "" + a || (e.defaultValue = "" + a);
    }
    function Fr(e, t, a, i) {
      if (e = e.options, t) {
        t = {};
        for (var u = 0; u < a.length; u++) t["$" + a[u]] = true;
        for (a = 0; a < e.length; a++) u = t.hasOwnProperty("$" + e[a].value), e[a].selected !== u && (e[a].selected = u), u && i && (e[a].defaultSelected = true);
      } else {
        for (a = "" + Vt(a), t = null, u = 0; u < e.length; u++) {
          if (e[u].value === a) {
            e[u].selected = true, i && (e[u].defaultSelected = true);
            return;
          }
          t !== null || e[u].disabled || (t = e[u]);
        }
        t !== null && (t.selected = true);
      }
    }
    function xh(e, t, a) {
      if (t != null && (t = "" + Vt(t), t !== e.value && (e.value = t), a == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = a != null ? "" + Vt(a) : "";
    }
    function wh(e, t, a, i) {
      if (t == null) {
        if (i != null) {
          if (a != null) throw Error(o(92));
          if (Ee(i)) {
            if (1 < i.length) throw Error(o(93));
            i = i[0];
          }
          a = i;
        }
        a == null && (a = ""), t = a;
      }
      a = Vt(t), e.defaultValue = a, i = e.textContent, i === a && i !== "" && i !== null && (e.value = i), Zr(e);
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
    var H1 = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function Sh(e, t, a) {
      var i = t.indexOf("--") === 0;
      a == null || typeof a == "boolean" || a === "" ? i ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : i ? e.setProperty(t, a) : typeof a != "number" || a === 0 || H1.has(t) ? t === "float" ? e.cssFloat = a : e[t] = ("" + a).trim() : e[t] = a + "px";
    }
    function Ch(e, t, a) {
      if (t != null && typeof t != "object") throw Error(o(62));
      if (e = e.style, a != null) {
        for (var i in a) !a.hasOwnProperty(i) || t != null && t.hasOwnProperty(i) || (i.indexOf("--") === 0 ? e.setProperty(i, "") : i === "float" ? e.cssFloat = "" : e[i] = "");
        for (var u in t) i = t[u], t.hasOwnProperty(u) && a[u] !== i && Sh(e, u, i);
      } else for (var h in t) t.hasOwnProperty(h) && Sh(e, h, t[h]);
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
    var U1 = /* @__PURE__ */ new Map([
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
    ]), Y1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function yi(e) {
      return Y1.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
    }
    function ul() {
    }
    var wc = null;
    function Sc(e) {
      return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
    }
    var Wr = null, Jr = null;
    function Eh(e) {
      var t = Qe(e);
      if (t && (e = t.stateNode)) {
        var a = e[le] || null;
        e: switch (e = t.stateNode, t.type) {
          case "input":
            if (bc(e, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name), t = a.name, a.type === "radio" && t != null) {
              for (a = e; a.parentNode; ) a = a.parentNode;
              for (a = a.querySelectorAll('input[name="' + _n("" + t) + '"][type="radio"]'), t = 0; t < a.length; t++) {
                var i = a[t];
                if (i !== e && i.form === e.form) {
                  var u = i[le] || null;
                  if (!u) throw Error(o(90));
                  bc(i, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name);
                }
              }
              for (t = 0; t < a.length; t++) i = a[t], i.form === e.form && Va(i);
            }
            break e;
          case "textarea":
            xh(e, a.value, a.defaultValue);
            break e;
          case "select":
            t = a.value, t != null && Fr(e, !!a.multiple, t, false);
        }
      }
    }
    var Cc = false;
    function _h(e, t, a) {
      if (Cc) return e(t, a);
      Cc = true;
      try {
        var i = e(t);
        return i;
      } finally {
        if (Cc = false, (Wr !== null || Jr !== null) && (rs(), Wr && (t = Wr, e = Jr, Jr = Wr = null, Eh(t), e))) for (t = 0; t < e.length; t++) Eh(e[t]);
      }
    }
    function $a(e, t) {
      var a = e.stateNode;
      if (a === null) return null;
      var i = a[le] || null;
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
      var qa = {};
      Object.defineProperty(qa, "passive", {
        get: function() {
          Ec = true;
        }
      }), window.addEventListener("test", qa, qa), window.removeEventListener("test", qa, qa);
    } catch {
      Ec = false;
    }
    var zl = null, _c = null, bi = null;
    function kh() {
      if (bi) return bi;
      var e, t = _c, a = t.length, i, u = "value" in zl ? zl.value : zl.textContent, h = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++) ;
      var x = a - e;
      for (i = 1; i <= x && t[a - i] === u[h - i]; i++) ;
      return bi = u.slice(e, 1 < i ? 1 - i : void 0);
    }
    function vi(e) {
      var t = e.keyCode;
      return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
    }
    function xi() {
      return true;
    }
    function Mh() {
      return false;
    }
    function an(e) {
      function t(a, i, u, h, x) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = h, this.target = x, this.currentTarget = null;
        for (var M in e) e.hasOwnProperty(M) && (a = e[M], this[M] = a ? a(h) : h[M]);
        return this.isDefaultPrevented = (h.defaultPrevented != null ? h.defaultPrevented : h.returnValue === false) ? xi : Mh, this.isPropagationStopped = Mh, this;
      }
      return b(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = false), this.isDefaultPrevented = xi);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = true), this.isPropagationStopped = xi);
        },
        persist: function() {
        },
        isPersistent: xi
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
    }, wi = an(wr), Ga = b({}, wr, {
      view: 0,
      detail: 0
    }), B1 = an(Ga), kc, Mc, Pa, Si = b({}, Ga, {
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
        return "movementX" in e ? e.movementX : (e !== Pa && (Pa && e.type === "mousemove" ? (kc = e.screenX - Pa.screenX, Mc = e.screenY - Pa.screenY) : Mc = kc = 0, Pa = e), kc);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Mc;
      }
    }), jh = an(Si), X1 = b({}, Si, {
      dataTransfer: 0
    }), V1 = an(X1), $1 = b({}, Ga, {
      relatedTarget: 0
    }), jc = an($1), q1 = b({}, wr, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), G1 = an(q1), P1 = b({}, wr, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), K1 = an(P1), Z1 = b({}, wr, {
      data: 0
    }), Lh = an(Z1), F1 = {
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
    }, Q1 = {
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
    }, W1 = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function J1(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = W1[e]) ? !!t[e] : false;
    }
    function Lc() {
      return J1;
    }
    var ex = b({}, Ga, {
      key: function(e) {
        if (e.key) {
          var t = F1[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress" ? (e = vi(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Q1[e.keyCode] || "Unidentified" : "";
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
        return e.type === "keypress" ? vi(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? vi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), tx = an(ex), nx = b({}, Si, {
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
    }), Rh = an(nx), lx = b({}, Ga, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Lc
    }), rx = an(lx), ax = b({}, wr, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ox = an(ax), ix = b({}, Si, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), sx = an(ix), cx = b({}, wr, {
      newState: 0,
      oldState: 0
    }), ux = an(cx), dx = [
      9,
      13,
      27,
      32
    ], Rc = dl && "CompositionEvent" in window, Ka = null;
    dl && "documentMode" in document && (Ka = document.documentMode);
    var fx = dl && "TextEvent" in window && !Ka, Ah = dl && (!Rc || Ka && 8 < Ka && 11 >= Ka), Th = " ", Nh = false;
    function Oh(e, t) {
      switch (e) {
        case "keyup":
          return dx.indexOf(t.keyCode) !== -1;
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
    function Dh(e) {
      return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
    }
    var ea = false;
    function hx(e, t) {
      switch (e) {
        case "compositionend":
          return Dh(t);
        case "keypress":
          return t.which !== 32 ? null : (Nh = true, Th);
        case "textInput":
          return e = t.data, e === Th && Nh ? null : e;
        default:
          return null;
      }
    }
    function mx(e, t) {
      if (ea) return e === "compositionend" || !Rc && Oh(e, t) ? (e = kh(), bi = _c = zl = null, ea = false, e) : null;
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
          return Ah && t.locale !== "ko" ? null : t.data;
        default:
          return null;
      }
    }
    var gx = {
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
    function Ih(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!gx[e.type] : t === "textarea";
    }
    function zh(e, t, a, i) {
      Wr ? Jr ? Jr.push(i) : Jr = [
        i
      ] : Wr = i, t = ds(t, "onChange"), 0 < t.length && (a = new wi("onChange", "change", null, a, i), e.push({
        event: a,
        listeners: t
      }));
    }
    var Za = null, Fa = null;
    function px(e) {
      vp(e, 0);
    }
    function Ci(e) {
      var t = Yt(e);
      if (Va(t)) return e;
    }
    function Hh(e, t) {
      if (e === "change") return t;
    }
    var Uh = false;
    if (dl) {
      var Ac;
      if (dl) {
        var Tc = "oninput" in document;
        if (!Tc) {
          var Yh = document.createElement("div");
          Yh.setAttribute("oninput", "return;"), Tc = typeof Yh.oninput == "function";
        }
        Ac = Tc;
      } else Ac = false;
      Uh = Ac && (!document.documentMode || 9 < document.documentMode);
    }
    function Bh() {
      Za && (Za.detachEvent("onpropertychange", Xh), Fa = Za = null);
    }
    function Xh(e) {
      if (e.propertyName === "value" && Ci(Fa)) {
        var t = [];
        zh(t, Fa, e, Sc(e)), _h(px, t);
      }
    }
    function yx(e, t, a) {
      e === "focusin" ? (Bh(), Za = t, Fa = a, Za.attachEvent("onpropertychange", Xh)) : e === "focusout" && Bh();
    }
    function bx(e) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ci(Fa);
    }
    function vx(e, t) {
      if (e === "click") return Ci(t);
    }
    function xx(e, t) {
      if (e === "input" || e === "change") return Ci(t);
    }
    function wx(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var gn = typeof Object.is == "function" ? Object.is : wx;
    function Qa(e, t) {
      if (gn(e, t)) return true;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null) return false;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length) return false;
      for (i = 0; i < a.length; i++) {
        var u = a[i];
        if (!Ae.call(t, u) || !gn(e[u], t[u])) return false;
      }
      return true;
    }
    function Vh(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function $h(e, t) {
      var a = Vh(e);
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
        a = Vh(a);
      }
    }
    function qh(e, t) {
      return e && t ? e === t ? true : e && e.nodeType === 3 ? false : t && t.nodeType === 3 ? qh(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : false : false;
    }
    function Gh(e) {
      e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
      for (var t = pi(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var a = typeof t.contentWindow.location.href == "string";
        } catch {
          a = false;
        }
        if (a) e = t.contentWindow;
        else break;
        t = pi(e.document);
      }
      return t;
    }
    function Nc(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    var Sx = dl && "documentMode" in document && 11 >= document.documentMode, ta = null, Oc = null, Wa = null, Dc = false;
    function Ph(e, t, a) {
      var i = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
      Dc || ta == null || ta !== pi(i) || (i = ta, "selectionStart" in i && Nc(i) ? i = {
        start: i.selectionStart,
        end: i.selectionEnd
      } : (i = (i.ownerDocument && i.ownerDocument.defaultView || window).getSelection(), i = {
        anchorNode: i.anchorNode,
        anchorOffset: i.anchorOffset,
        focusNode: i.focusNode,
        focusOffset: i.focusOffset
      }), Wa && Qa(Wa, i) || (Wa = i, i = ds(Oc, "onSelect"), 0 < i.length && (t = new wi("onSelect", "select", null, t, a), e.push({
        event: t,
        listeners: i
      }), t.target = ta)));
    }
    function Sr(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var na = {
      animationend: Sr("Animation", "AnimationEnd"),
      animationiteration: Sr("Animation", "AnimationIteration"),
      animationstart: Sr("Animation", "AnimationStart"),
      transitionrun: Sr("Transition", "TransitionRun"),
      transitionstart: Sr("Transition", "TransitionStart"),
      transitioncancel: Sr("Transition", "TransitionCancel"),
      transitionend: Sr("Transition", "TransitionEnd")
    }, Ic = {}, Kh = {};
    dl && (Kh = document.createElement("div").style, "AnimationEvent" in window || (delete na.animationend.animation, delete na.animationiteration.animation, delete na.animationstart.animation), "TransitionEvent" in window || delete na.transitionend.transition);
    function Cr(e) {
      if (Ic[e]) return Ic[e];
      if (!na[e]) return e;
      var t = na[e], a;
      for (a in t) if (t.hasOwnProperty(a) && a in Kh) return Ic[e] = t[a];
      return e;
    }
    var Zh = Cr("animationend"), Fh = Cr("animationiteration"), Qh = Cr("animationstart"), Cx = Cr("transitionrun"), Ex = Cr("transitionstart"), _x = Cr("transitioncancel"), Wh = Cr("transitionend"), Jh = /* @__PURE__ */ new Map(), zc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    zc.push("scrollEnd");
    function Un(e, t) {
      Jh.set(e, t), mn(t, [
        e
      ]);
    }
    var Ei = typeof reportError == "function" ? reportError : function(e) {
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
    }, kn = [], la = 0, Hc = 0;
    function _i() {
      for (var e = la, t = Hc = la = 0; t < e; ) {
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
        h !== 0 && em(a, u, h);
      }
    }
    function ki(e, t, a, i) {
      kn[la++] = e, kn[la++] = t, kn[la++] = a, kn[la++] = i, Hc |= i, e.lanes |= i, e = e.alternate, e !== null && (e.lanes |= i);
    }
    function Uc(e, t, a, i) {
      return ki(e, t, a, i), Mi(e);
    }
    function Er(e, t) {
      return ki(e, null, null, t), Mi(e);
    }
    function em(e, t, a) {
      e.lanes |= a;
      var i = e.alternate;
      i !== null && (i.lanes |= a);
      for (var u = false, h = e.return; h !== null; ) h.childLanes |= a, i = h.alternate, i !== null && (i.childLanes |= a), h.tag === 22 && (e = h.stateNode, e === null || e._visibility & 1 || (u = true)), e = h, h = h.return;
      return e.tag === 3 ? (h = e.stateNode, u && t !== null && (u = 31 - Jt(a), e = h.hiddenUpdates, i = e[u], i === null ? e[u] = [
        t
      ] : i.push(t), t.lane = a | 536870912), h) : null;
    }
    function Mi(e) {
      if (50 < wo) throw wo = 0, Ku = null, Error(o(185));
      for (var t = e.return; t !== null; ) e = t, t = e.return;
      return e.tag === 3 ? e.stateNode : null;
    }
    var ra = {};
    function kx(e, t, a, i) {
      this.tag = e, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = i, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
    }
    function pn(e, t, a, i) {
      return new kx(e, t, a, i);
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
    function tm(e, t) {
      e.flags &= 65011714;
      var a = e.alternate;
      return a === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type, t = a.dependencies, e.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
      }), e;
    }
    function ji(e, t, a, i, u, h) {
      var x = 0;
      if (i = e, typeof e == "function") Yc(e) && (x = 1);
      else if (typeof e == "string") x = Aw(e, a, J.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
      else e: switch (e) {
        case H:
          return e = pn(31, a, t, u), e.elementType = H, e.lanes = h, e;
        case w:
          return _r(a.children, u, h, t);
        case C:
          x = 8, u |= 24;
          break;
        case _:
          return e = pn(12, a, t, u | 2), e.elementType = _, e.lanes = h, e;
        case U:
          return e = pn(13, a, t, u), e.elementType = U, e.lanes = h, e;
        case N:
          return e = pn(19, a, t, u), e.elementType = N, e.lanes = h, e;
        default:
          if (typeof e == "object" && e !== null) switch (e.$$typeof) {
            case A:
              x = 10;
              break e;
            case T:
              x = 9;
              break e;
            case j:
              x = 11;
              break e;
            case R:
              x = 14;
              break e;
            case O:
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
    function nm(e) {
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
    var lm = /* @__PURE__ */ new WeakMap();
    function Mn(e, t) {
      if (typeof e == "object" && e !== null) {
        var a = lm.get(e);
        return a !== void 0 ? a : (t = {
          value: e,
          source: t,
          stack: je(t)
        }, lm.set(e, t), t);
      }
      return {
        value: e,
        source: t,
        stack: je(t)
      };
    }
    var aa = [], oa = 0, Li = null, Ja = 0, jn = [], Ln = 0, Hl = null, el = 1, tl = "";
    function hl(e, t) {
      aa[oa++] = Ja, aa[oa++] = Li, Li = e, Ja = t;
    }
    function rm(e, t, a) {
      jn[Ln++] = el, jn[Ln++] = tl, jn[Ln++] = Hl, Hl = e;
      var i = el;
      e = tl;
      var u = 32 - Jt(i) - 1;
      i &= ~(1 << u), a += 1;
      var h = 32 - Jt(t) + u;
      if (30 < h) {
        var x = u - u % 5;
        h = (i & (1 << x) - 1).toString(32), i >>= x, u -= x, el = 1 << 32 - Jt(t) + u | a << u | i, tl = h + e;
      } else el = 1 << h | a << u | i, tl = e;
    }
    function Vc(e) {
      e.return !== null && (hl(e, 1), rm(e, 1, 0));
    }
    function $c(e) {
      for (; e === Li; ) Li = aa[--oa], aa[oa] = null, Ja = aa[--oa], aa[oa] = null;
      for (; e === Hl; ) Hl = jn[--Ln], jn[Ln] = null, tl = jn[--Ln], jn[Ln] = null, el = jn[--Ln], jn[Ln] = null;
    }
    function am(e, t) {
      jn[Ln++] = el, jn[Ln++] = tl, jn[Ln++] = Hl, el = t.id, tl = t.overflow, Hl = e;
    }
    var $t = null, yt = null, Ke = false, Ul = null, Rn = false, qc = Error(o(519));
    function Yl(e) {
      var t = Error(o(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
      throw eo(Mn(t, e)), qc;
    }
    function om(e) {
      var t = e.stateNode, a = e.type, i = e.memoizedProps;
      switch (t[It] = e, t[le] = i, a) {
        case "dialog":
          Xe("cancel", t), Xe("close", t);
          break;
        case "iframe":
        case "object":
        case "embed":
          Xe("load", t);
          break;
        case "video":
        case "audio":
          for (a = 0; a < Co.length; a++) Xe(Co[a], t);
          break;
        case "source":
          Xe("error", t);
          break;
        case "img":
        case "image":
        case "link":
          Xe("error", t), Xe("load", t);
          break;
        case "details":
          Xe("toggle", t);
          break;
        case "input":
          Xe("invalid", t), vh(t, i.value, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name, true);
          break;
        case "select":
          Xe("invalid", t);
          break;
        case "textarea":
          Xe("invalid", t), wh(t, i.value, i.defaultValue, i.children);
      }
      a = i.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || i.suppressHydrationWarning === true || Cp(t.textContent, a) ? (i.popover != null && (Xe("beforetoggle", t), Xe("toggle", t)), i.onScroll != null && Xe("scroll", t), i.onScrollEnd != null && Xe("scrollend", t), i.onClick != null && (t.onclick = ul), t = true) : t = false, t || Yl(e, true);
    }
    function im(e) {
      for ($t = e.return; $t; ) switch ($t.tag) {
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
          $t = $t.return;
      }
    }
    function ia(e) {
      if (e !== $t) return false;
      if (!Ke) return im(e), Ke = true, false;
      var t = e.tag, a;
      if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = e.type, a = !(a !== "form" && a !== "button") || cd(e.type, e.memoizedProps)), a = !a), a && yt && Yl(e), im(e), t === 13) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
        yt = Tp(e);
      } else if (t === 31) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
        yt = Tp(e);
      } else t === 27 ? (t = yt, er(e.type) ? (e = md, md = null, yt = e) : yt = t) : yt = $t ? Tn(e.stateNode.nextSibling) : null;
      return true;
    }
    function kr() {
      yt = $t = null, Ke = false;
    }
    function Gc() {
      var e = Ul;
      return e !== null && (un === null ? un = e : un.push.apply(un, e), Ul = null), e;
    }
    function eo(e) {
      Ul === null ? Ul = [
        e
      ] : Ul.push(e);
    }
    var Pc = L(null), Mr = null, ml = null;
    function Bl(e, t, a) {
      $(Pc, t._currentValue), t._currentValue = a;
    }
    function gl(e) {
      e._currentValue = Pc.current, D(Pc);
    }
    function Kc(e, t, a) {
      for (; e !== null; ) {
        var i = e.alternate;
        if ((e.childLanes & t) !== t ? (e.childLanes |= t, i !== null && (i.childLanes |= t)) : i !== null && (i.childLanes & t) !== t && (i.childLanes |= t), e === a) break;
        e = e.return;
      }
    }
    function Zc(e, t, a, i) {
      var u = e.child;
      for (u !== null && (u.return = e); u !== null; ) {
        var h = u.dependencies;
        if (h !== null) {
          var x = u.child;
          h = h.firstContext;
          e: for (; h !== null; ) {
            var M = h;
            h = u;
            for (var z = 0; z < t.length; z++) if (M.context === t[z]) {
              h.lanes |= a, M = h.alternate, M !== null && (M.lanes |= a), Kc(h.return, a, e), i || (x = null);
              break e;
            }
            h = M.next;
          }
        } else if (u.tag === 18) {
          if (x = u.return, x === null) throw Error(o(341));
          x.lanes |= a, h = x.alternate, h !== null && (h.lanes |= a), Kc(x, a, e), x = null;
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
    function sa(e, t, a, i) {
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
        } else if (u === X.current) {
          if (x = u.alternate, x === null) throw Error(o(387));
          x.memoizedState.memoizedState !== u.memoizedState.memoizedState && (e !== null ? e.push(jo) : e = [
            jo
          ]);
        }
        u = u.return;
      }
      e !== null && Zc(t, e, a, i), t.flags |= 262144;
    }
    function Ri(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!gn(e.context._currentValue, e.memoizedValue)) return true;
        e = e.next;
      }
      return false;
    }
    function jr(e) {
      Mr = e, ml = null, e = e.dependencies, e !== null && (e.firstContext = null);
    }
    function qt(e) {
      return sm(Mr, e);
    }
    function Ai(e, t) {
      return Mr === null && jr(e), sm(e, t);
    }
    function sm(e, t) {
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
    var Mx = typeof AbortController < "u" ? AbortController : function() {
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
    }, jx = l.unstable_scheduleCallback, Lx = l.unstable_NormalPriority, Rt = {
      $$typeof: A,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
    function Fc() {
      return {
        controller: new Mx(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function to(e) {
      e.refCount--, e.refCount === 0 && jx(Lx, function() {
        e.controller.abort();
      });
    }
    var no = null, Qc = 0, ca = 0, ua = null;
    function Rx(e, t) {
      if (no === null) {
        var a = no = [];
        Qc = 0, ca = ed(), ua = {
          status: "pending",
          value: void 0,
          then: function(i) {
            a.push(i);
          }
        };
      }
      return Qc++, t.then(cm, cm), t;
    }
    function cm() {
      if (--Qc === 0 && no !== null) {
        ua !== null && (ua.status = "fulfilled");
        var e = no;
        no = null, ca = 0, ua = null;
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function Ax(e, t) {
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
    var um = q.S;
    q.S = function(e, t) {
      Pg = jt(), typeof t == "object" && t !== null && typeof t.then == "function" && Rx(e, t), um !== null && um(e, t);
    };
    var Lr = L(null);
    function Wc() {
      var e = Lr.current;
      return e !== null ? e : ft.pooledCache;
    }
    function Ti(e, t) {
      t === null ? $(Lr, Lr.current) : $(Lr, t.pool);
    }
    function dm() {
      var e = Wc();
      return e === null ? null : {
        parent: Rt._currentValue,
        pool: e
      };
    }
    var da = Error(o(460)), Jc = Error(o(474)), Ni = Error(o(542)), Oi = {
      then: function() {
      }
    };
    function fm(e) {
      return e = e.status, e === "fulfilled" || e === "rejected";
    }
    function hm(e, t, a) {
      switch (a = e[a], a === void 0 ? e.push(t) : a !== t && (t.then(ul, ul), t = a), t.status) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw e = t.reason, gm(e), e;
        default:
          if (typeof t.status == "string") t.then(ul, ul);
          else {
            if (e = ft, e !== null && 100 < e.shellSuspendCounter) throw Error(o(482));
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
              throw e = t.reason, gm(e), e;
          }
          throw Ar = t, da;
      }
    }
    function Rr(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (a) {
        throw a !== null && typeof a == "object" && typeof a.then == "function" ? (Ar = a, da) : a;
      }
    }
    var Ar = null;
    function mm() {
      if (Ar === null) throw Error(o(459));
      var e = Ar;
      return Ar = null, e;
    }
    function gm(e) {
      if (e === da || e === Ni) throw Error(o(483));
    }
    var fa = null, lo = 0;
    function Di(e) {
      var t = lo;
      return lo += 1, fa === null && (fa = []), hm(fa, e, t);
    }
    function ro(e, t) {
      t = t.props.ref, e.ref = t !== void 0 ? t : null;
    }
    function Ii(e, t) {
      throw t.$$typeof === S ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(o(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
    }
    function pm(e) {
      function t(V, Y) {
        if (e) {
          var P = V.deletions;
          P === null ? (V.deletions = [
            Y
          ], V.flags |= 16) : P.push(Y);
        }
      }
      function a(V, Y) {
        if (!e) return null;
        for (; Y !== null; ) t(V, Y), Y = Y.sibling;
        return null;
      }
      function i(V) {
        for (var Y = /* @__PURE__ */ new Map(); V !== null; ) V.key !== null ? Y.set(V.key, V) : Y.set(V.index, V), V = V.sibling;
        return Y;
      }
      function u(V, Y) {
        return V = fl(V, Y), V.index = 0, V.sibling = null, V;
      }
      function h(V, Y, P) {
        return V.index = P, e ? (P = V.alternate, P !== null ? (P = P.index, P < Y ? (V.flags |= 67108866, Y) : P) : (V.flags |= 67108866, Y)) : (V.flags |= 1048576, Y);
      }
      function x(V) {
        return e && V.alternate === null && (V.flags |= 67108866), V;
      }
      function M(V, Y, P, re) {
        return Y === null || Y.tag !== 6 ? (Y = Bc(P, V.mode, re), Y.return = V, Y) : (Y = u(Y, P), Y.return = V, Y);
      }
      function z(V, Y, P, re) {
        var Re = P.type;
        return Re === w ? ne(V, Y, P.props.children, re, P.key) : Y !== null && (Y.elementType === Re || typeof Re == "object" && Re !== null && Re.$$typeof === O && Rr(Re) === Y.type) ? (Y = u(Y, P.props), ro(Y, P), Y.return = V, Y) : (Y = ji(P.type, P.key, P.props, null, V.mode, re), ro(Y, P), Y.return = V, Y);
      }
      function K(V, Y, P, re) {
        return Y === null || Y.tag !== 4 || Y.stateNode.containerInfo !== P.containerInfo || Y.stateNode.implementation !== P.implementation ? (Y = Xc(P, V.mode, re), Y.return = V, Y) : (Y = u(Y, P.children || []), Y.return = V, Y);
      }
      function ne(V, Y, P, re, Re) {
        return Y === null || Y.tag !== 7 ? (Y = _r(P, V.mode, re, Re), Y.return = V, Y) : (Y = u(Y, P), Y.return = V, Y);
      }
      function ae(V, Y, P) {
        if (typeof Y == "string" && Y !== "" || typeof Y == "number" || typeof Y == "bigint") return Y = Bc("" + Y, V.mode, P), Y.return = V, Y;
        if (typeof Y == "object" && Y !== null) {
          switch (Y.$$typeof) {
            case E:
              return P = ji(Y.type, Y.key, Y.props, null, V.mode, P), ro(P, Y), P.return = V, P;
            case k:
              return Y = Xc(Y, V.mode, P), Y.return = V, Y;
            case O:
              return Y = Rr(Y), ae(V, Y, P);
          }
          if (Ee(Y) || ee(Y)) return Y = _r(Y, V.mode, P, null), Y.return = V, Y;
          if (typeof Y.then == "function") return ae(V, Di(Y), P);
          if (Y.$$typeof === A) return ae(V, Ai(V, Y), P);
          Ii(V, Y);
        }
        return null;
      }
      function Z(V, Y, P, re) {
        var Re = Y !== null ? Y.key : null;
        if (typeof P == "string" && P !== "" || typeof P == "number" || typeof P == "bigint") return Re !== null ? null : M(V, Y, "" + P, re);
        if (typeof P == "object" && P !== null) {
          switch (P.$$typeof) {
            case E:
              return P.key === Re ? z(V, Y, P, re) : null;
            case k:
              return P.key === Re ? K(V, Y, P, re) : null;
            case O:
              return P = Rr(P), Z(V, Y, P, re);
          }
          if (Ee(P) || ee(P)) return Re !== null ? null : ne(V, Y, P, re, null);
          if (typeof P.then == "function") return Z(V, Y, Di(P), re);
          if (P.$$typeof === A) return Z(V, Y, Ai(V, P), re);
          Ii(V, P);
        }
        return null;
      }
      function Q(V, Y, P, re, Re) {
        if (typeof re == "string" && re !== "" || typeof re == "number" || typeof re == "bigint") return V = V.get(P) || null, M(Y, V, "" + re, Re);
        if (typeof re == "object" && re !== null) {
          switch (re.$$typeof) {
            case E:
              return V = V.get(re.key === null ? P : re.key) || null, z(Y, V, re, Re);
            case k:
              return V = V.get(re.key === null ? P : re.key) || null, K(Y, V, re, Re);
            case O:
              return re = Rr(re), Q(V, Y, P, re, Re);
          }
          if (Ee(re) || ee(re)) return V = V.get(P) || null, ne(Y, V, re, Re, null);
          if (typeof re.then == "function") return Q(V, Y, P, Di(re), Re);
          if (re.$$typeof === A) return Q(V, Y, P, Ai(Y, re), Re);
          Ii(Y, re);
        }
        return null;
      }
      function Ce(V, Y, P, re) {
        for (var Re = null, We = null, ke = Y, Ue = Y = 0, Pe = null; ke !== null && Ue < P.length; Ue++) {
          ke.index > Ue ? (Pe = ke, ke = null) : Pe = ke.sibling;
          var Je = Z(V, ke, P[Ue], re);
          if (Je === null) {
            ke === null && (ke = Pe);
            break;
          }
          e && ke && Je.alternate === null && t(V, ke), Y = h(Je, Y, Ue), We === null ? Re = Je : We.sibling = Je, We = Je, ke = Pe;
        }
        if (Ue === P.length) return a(V, ke), Ke && hl(V, Ue), Re;
        if (ke === null) {
          for (; Ue < P.length; Ue++) ke = ae(V, P[Ue], re), ke !== null && (Y = h(ke, Y, Ue), We === null ? Re = ke : We.sibling = ke, We = ke);
          return Ke && hl(V, Ue), Re;
        }
        for (ke = i(ke); Ue < P.length; Ue++) Pe = Q(ke, V, Ue, P[Ue], re), Pe !== null && (e && Pe.alternate !== null && ke.delete(Pe.key === null ? Ue : Pe.key), Y = h(Pe, Y, Ue), We === null ? Re = Pe : We.sibling = Pe, We = Pe);
        return e && ke.forEach(function(ar) {
          return t(V, ar);
        }), Ke && hl(V, Ue), Re;
      }
      function Te(V, Y, P, re) {
        if (P == null) throw Error(o(151));
        for (var Re = null, We = null, ke = Y, Ue = Y = 0, Pe = null, Je = P.next(); ke !== null && !Je.done; Ue++, Je = P.next()) {
          ke.index > Ue ? (Pe = ke, ke = null) : Pe = ke.sibling;
          var ar = Z(V, ke, Je.value, re);
          if (ar === null) {
            ke === null && (ke = Pe);
            break;
          }
          e && ke && ar.alternate === null && t(V, ke), Y = h(ar, Y, Ue), We === null ? Re = ar : We.sibling = ar, We = ar, ke = Pe;
        }
        if (Je.done) return a(V, ke), Ke && hl(V, Ue), Re;
        if (ke === null) {
          for (; !Je.done; Ue++, Je = P.next()) Je = ae(V, Je.value, re), Je !== null && (Y = h(Je, Y, Ue), We === null ? Re = Je : We.sibling = Je, We = Je);
          return Ke && hl(V, Ue), Re;
        }
        for (ke = i(ke); !Je.done; Ue++, Je = P.next()) Je = Q(ke, V, Ue, Je.value, re), Je !== null && (e && Je.alternate !== null && ke.delete(Je.key === null ? Ue : Je.key), Y = h(Je, Y, Ue), We === null ? Re = Je : We.sibling = Je, We = Je);
        return e && ke.forEach(function(Xw) {
          return t(V, Xw);
        }), Ke && hl(V, Ue), Re;
      }
      function ut(V, Y, P, re) {
        if (typeof P == "object" && P !== null && P.type === w && P.key === null && (P = P.props.children), typeof P == "object" && P !== null) {
          switch (P.$$typeof) {
            case E:
              e: {
                for (var Re = P.key; Y !== null; ) {
                  if (Y.key === Re) {
                    if (Re = P.type, Re === w) {
                      if (Y.tag === 7) {
                        a(V, Y.sibling), re = u(Y, P.props.children), re.return = V, V = re;
                        break e;
                      }
                    } else if (Y.elementType === Re || typeof Re == "object" && Re !== null && Re.$$typeof === O && Rr(Re) === Y.type) {
                      a(V, Y.sibling), re = u(Y, P.props), ro(re, P), re.return = V, V = re;
                      break e;
                    }
                    a(V, Y);
                    break;
                  } else t(V, Y);
                  Y = Y.sibling;
                }
                P.type === w ? (re = _r(P.props.children, V.mode, re, P.key), re.return = V, V = re) : (re = ji(P.type, P.key, P.props, null, V.mode, re), ro(re, P), re.return = V, V = re);
              }
              return x(V);
            case k:
              e: {
                for (Re = P.key; Y !== null; ) {
                  if (Y.key === Re) if (Y.tag === 4 && Y.stateNode.containerInfo === P.containerInfo && Y.stateNode.implementation === P.implementation) {
                    a(V, Y.sibling), re = u(Y, P.children || []), re.return = V, V = re;
                    break e;
                  } else {
                    a(V, Y);
                    break;
                  }
                  else t(V, Y);
                  Y = Y.sibling;
                }
                re = Xc(P, V.mode, re), re.return = V, V = re;
              }
              return x(V);
            case O:
              return P = Rr(P), ut(V, Y, P, re);
          }
          if (Ee(P)) return Ce(V, Y, P, re);
          if (ee(P)) {
            if (Re = ee(P), typeof Re != "function") throw Error(o(150));
            return P = Re.call(P), Te(V, Y, P, re);
          }
          if (typeof P.then == "function") return ut(V, Y, Di(P), re);
          if (P.$$typeof === A) return ut(V, Y, Ai(V, P), re);
          Ii(V, P);
        }
        return typeof P == "string" && P !== "" || typeof P == "number" || typeof P == "bigint" ? (P = "" + P, Y !== null && Y.tag === 6 ? (a(V, Y.sibling), re = u(Y, P), re.return = V, V = re) : (a(V, Y), re = Bc(P, V.mode, re), re.return = V, V = re), x(V)) : a(V, Y);
      }
      return function(V, Y, P, re) {
        try {
          lo = 0;
          var Re = ut(V, Y, P, re);
          return fa = null, Re;
        } catch (ke) {
          if (ke === da || ke === Ni) throw ke;
          var We = pn(29, ke, null, V.mode);
          return We.lanes = re, We.return = V, We;
        } finally {
        }
      };
    }
    var Tr = pm(true), ym = pm(false), Xl = false;
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
      if (i = i.shared, (tt & 2) !== 0) {
        var u = i.pending;
        return u === null ? t.next = t : (t.next = u.next, u.next = t), i.pending = t, t = Mi(e), em(e, null, a), t;
      }
      return ki(e, i, t, a), Mi(e);
    }
    function ao(e, t, a) {
      if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
        var i = t.lanes;
        i &= e.pendingLanes, a |= i, t.lanes = a, hi(e, a);
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
    function oo() {
      if (lu) {
        var e = ua;
        if (e !== null) throw e;
      }
    }
    function io(e, t, a, i) {
      lu = false;
      var u = e.updateQueue;
      Xl = false;
      var h = u.firstBaseUpdate, x = u.lastBaseUpdate, M = u.shared.pending;
      if (M !== null) {
        u.shared.pending = null;
        var z = M, K = z.next;
        z.next = null, x === null ? h = K : x.next = K, x = z;
        var ne = e.alternate;
        ne !== null && (ne = ne.updateQueue, M = ne.lastBaseUpdate, M !== x && (M === null ? ne.firstBaseUpdate = K : M.next = K, ne.lastBaseUpdate = z));
      }
      if (h !== null) {
        var ae = u.baseState;
        x = 0, ne = K = z = null, M = h;
        do {
          var Z = M.lane & -536870913, Q = Z !== M.lane;
          if (Q ? (Ge & Z) === Z : (i & Z) === Z) {
            Z !== 0 && Z === ca && (lu = true), ne !== null && (ne = ne.next = {
              lane: 0,
              tag: M.tag,
              payload: M.payload,
              callback: null,
              next: null
            });
            e: {
              var Ce = e, Te = M;
              Z = t;
              var ut = a;
              switch (Te.tag) {
                case 1:
                  if (Ce = Te.payload, typeof Ce == "function") {
                    ae = Ce.call(ut, ae, Z);
                    break e;
                  }
                  ae = Ce;
                  break e;
                case 3:
                  Ce.flags = Ce.flags & -65537 | 128;
                case 0:
                  if (Ce = Te.payload, Z = typeof Ce == "function" ? Ce.call(ut, ae, Z) : Ce, Z == null) break e;
                  ae = b({}, ae, Z);
                  break e;
                case 2:
                  Xl = true;
              }
            }
            Z = M.callback, Z !== null && (e.flags |= 64, Q && (e.flags |= 8192), Q = u.callbacks, Q === null ? u.callbacks = [
              Z
            ] : Q.push(Z));
          } else Q = {
            lane: Z,
            tag: M.tag,
            payload: M.payload,
            callback: M.callback,
            next: null
          }, ne === null ? (K = ne = Q, z = ae) : ne = ne.next = Q, x |= Z;
          if (M = M.next, M === null) {
            if (M = u.shared.pending, M === null) break;
            Q = M, M = Q.next, Q.next = null, u.lastBaseUpdate = Q, u.shared.pending = null;
          }
        } while (true);
        ne === null && (z = ae), u.baseState = z, u.firstBaseUpdate = K, u.lastBaseUpdate = ne, h === null && (u.shared.lanes = 0), Zl |= x, e.lanes = x, e.memoizedState = ae;
      }
    }
    function bm(e, t) {
      if (typeof e != "function") throw Error(o(191, e));
      e.call(t);
    }
    function vm(e, t) {
      var a = e.callbacks;
      if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) bm(a[e], t);
    }
    var ha = L(null), zi = L(0);
    function xm(e, t) {
      e = El, $(zi, e), $(ha, t), El = e | t.baseLanes;
    }
    function ru() {
      $(zi, El), $(ha, ha.current);
    }
    function au() {
      El = zi.current, D(ha), D(zi);
    }
    var yn = L(null), An = null;
    function ql(e) {
      var t = e.alternate;
      $(_t, _t.current & 1), $(yn, e), An === null && (t === null || ha.current !== null || t.memoizedState !== null) && (An = e);
    }
    function ou(e) {
      $(_t, _t.current), $(yn, e), An === null && (An = e);
    }
    function wm(e) {
      e.tag === 22 ? ($(_t, _t.current), $(yn, e), An === null && (An = e)) : Gl();
    }
    function Gl() {
      $(_t, _t.current), $(yn, yn.current);
    }
    function bn(e) {
      D(yn), An === e && (An = null), D(_t);
    }
    var _t = L(0);
    function Hi(e) {
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
    var pl = 0, He = null, st = null, At = null, Ui = false, ma = false, Nr = false, Yi = 0, so = 0, ga = null, Tx = 0;
    function St() {
      throw Error(o(321));
    }
    function iu(e, t) {
      if (t === null) return false;
      for (var a = 0; a < t.length && a < e.length; a++) if (!gn(e[a], t[a])) return false;
      return true;
    }
    function su(e, t, a, i, u, h) {
      return pl = h, He = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, q.H = e === null || e.memoizedState === null ? rg : Cu, Nr = false, h = a(i, u), Nr = false, ma && (h = Cm(t, a, i, u)), Sm(e), h;
    }
    function Sm(e) {
      q.H = fo;
      var t = st !== null && st.next !== null;
      if (pl = 0, At = st = He = null, Ui = false, so = 0, ga = null, t) throw Error(o(300));
      e === null || Tt || (e = e.dependencies, e !== null && Ri(e) && (Tt = true));
    }
    function Cm(e, t, a, i) {
      He = e;
      var u = 0;
      do {
        if (ma && (ga = null), so = 0, ma = false, 25 <= u) throw Error(o(301));
        if (u += 1, At = st = null, e.updateQueue != null) {
          var h = e.updateQueue;
          h.lastEffect = null, h.events = null, h.stores = null, h.memoCache != null && (h.memoCache.index = 0);
        }
        q.H = ag, h = t(a, i);
      } while (ma);
      return h;
    }
    function Nx() {
      var e = q.H, t = e.useState()[0];
      return t = typeof t.then == "function" ? co(t) : t, e = e.useState()[0], (st !== null ? st.memoizedState : null) !== e && (He.flags |= 1024), t;
    }
    function cu() {
      var e = Yi !== 0;
      return Yi = 0, e;
    }
    function uu(e, t, a) {
      t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a;
    }
    function du(e) {
      if (Ui) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Ui = false;
      }
      pl = 0, At = st = He = null, ma = false, so = Yi = 0, ga = null;
    }
    function en() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return At === null ? He.memoizedState = At = e : At = At.next = e, At;
    }
    function kt() {
      if (st === null) {
        var e = He.alternate;
        e = e !== null ? e.memoizedState : null;
      } else e = st.next;
      var t = At === null ? He.memoizedState : At.next;
      if (t !== null) At = t, st = e;
      else {
        if (e === null) throw He.alternate === null ? Error(o(467)) : Error(o(310));
        st = e, e = {
          memoizedState: st.memoizedState,
          baseState: st.baseState,
          baseQueue: st.baseQueue,
          queue: st.queue,
          next: null
        }, At === null ? He.memoizedState = At = e : At = At.next = e;
      }
      return At;
    }
    function Bi() {
      return {
        lastEffect: null,
        events: null,
        stores: null,
        memoCache: null
      };
    }
    function co(e) {
      var t = so;
      return so += 1, ga === null && (ga = []), e = hm(ga, e, t), t = He, (At === null ? t.memoizedState : At.next) === null && (t = t.alternate, q.H = t === null || t.memoizedState === null ? rg : Cu), e;
    }
    function Xi(e) {
      if (e !== null && typeof e == "object") {
        if (typeof e.then == "function") return co(e);
        if (e.$$typeof === A) return qt(e);
      }
      throw Error(o(438, String(e)));
    }
    function fu(e) {
      var t = null, a = He.updateQueue;
      if (a !== null && (t = a.memoCache), t == null) {
        var i = He.alternate;
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
      }), a === null && (a = Bi(), He.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0) for (a = t.data[t.index] = Array(e), i = 0; i < e; i++) a[i] = G;
      return t.index++, a;
    }
    function yl(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Vi(e) {
      var t = kt();
      return hu(t, st, e);
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
        var M = x = null, z = null, K = t, ne = false;
        do {
          var ae = K.lane & -536870913;
          if (ae !== K.lane ? (Ge & ae) === ae : (pl & ae) === ae) {
            var Z = K.revertLane;
            if (Z === 0) z !== null && (z = z.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: K.action,
              hasEagerState: K.hasEagerState,
              eagerState: K.eagerState,
              next: null
            }), ae === ca && (ne = true);
            else if ((pl & Z) === Z) {
              K = K.next, Z === ca && (ne = true);
              continue;
            } else ae = {
              lane: 0,
              revertLane: K.revertLane,
              gesture: null,
              action: K.action,
              hasEagerState: K.hasEagerState,
              eagerState: K.eagerState,
              next: null
            }, z === null ? (M = z = ae, x = h) : z = z.next = ae, He.lanes |= Z, Zl |= Z;
            ae = K.action, Nr && a(h, ae), h = K.hasEagerState ? K.eagerState : a(h, ae);
          } else Z = {
            lane: ae,
            revertLane: K.revertLane,
            gesture: K.gesture,
            action: K.action,
            hasEagerState: K.hasEagerState,
            eagerState: K.eagerState,
            next: null
          }, z === null ? (M = z = Z, x = h) : z = z.next = Z, He.lanes |= ae, Zl |= ae;
          K = K.next;
        } while (K !== null && K !== t);
        if (z === null ? x = h : z.next = M, !gn(h, e.memoizedState) && (Tt = true, ne && (a = ua, a !== null))) throw a;
        e.memoizedState = h, e.baseState = x, e.baseQueue = z, i.lastRenderedState = h;
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
    function Em(e, t, a) {
      var i = He, u = kt(), h = Ke;
      if (h) {
        if (a === void 0) throw Error(o(407));
        a = a();
      } else a = t();
      var x = !gn((st || u).memoizedState, a);
      if (x && (u.memoizedState = a, Tt = true), u = u.queue, yu(Mm.bind(null, i, u, e), [
        e
      ]), u.getSnapshot !== t || x || At !== null && At.memoizedState.tag & 1) {
        if (i.flags |= 2048, pa(9, {
          destroy: void 0
        }, km.bind(null, i, u, a, t), null), ft === null) throw Error(o(349));
        h || (pl & 127) !== 0 || _m(i, t, a);
      }
      return a;
    }
    function _m(e, t, a) {
      e.flags |= 16384, e = {
        getSnapshot: t,
        value: a
      }, t = He.updateQueue, t === null ? (t = Bi(), He.updateQueue = t, t.stores = [
        e
      ]) : (a = t.stores, a === null ? t.stores = [
        e
      ] : a.push(e));
    }
    function km(e, t, a, i) {
      t.value = a, t.getSnapshot = i, jm(t) && Lm(e);
    }
    function Mm(e, t, a) {
      return a(function() {
        jm(t) && Lm(e);
      });
    }
    function jm(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var a = t();
        return !gn(e, a);
      } catch {
        return true;
      }
    }
    function Lm(e) {
      var t = Er(e, 2);
      t !== null && dn(t, e, 2);
    }
    function gu(e) {
      var t = en();
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
    function Rm(e, t, a, i) {
      return e.baseState = a, hu(e, st, typeof i == "function" ? i : yl);
    }
    function Ox(e, t, a, i, u) {
      if (Gi(e)) throw Error(o(485));
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
        q.T !== null ? a(true) : h.isTransition = false, i(h), a = t.pending, a === null ? (h.next = t.pending = h, Am(t, h)) : (h.next = a.next, t.pending = a.next = h);
      }
    }
    function Am(e, t) {
      var a = t.action, i = t.payload, u = e.state;
      if (t.isTransition) {
        var h = q.T, x = {};
        q.T = x;
        try {
          var M = a(u, i), z = q.S;
          z !== null && z(x, M), Tm(e, t, M);
        } catch (K) {
          pu(e, t, K);
        } finally {
          h !== null && x.types !== null && (h.types = x.types), q.T = h;
        }
      } else try {
        h = a(u, i), Tm(e, t, h);
      } catch (K) {
        pu(e, t, K);
      }
    }
    function Tm(e, t, a) {
      a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(function(i) {
        Nm(e, t, i);
      }, function(i) {
        return pu(e, t, i);
      }) : Nm(e, t, a);
    }
    function Nm(e, t, a) {
      t.status = "fulfilled", t.value = a, Om(t), e.state = a, t = e.pending, t !== null && (a = t.next, a === t ? e.pending = null : (a = a.next, t.next = a, Am(e, a)));
    }
    function pu(e, t, a) {
      var i = e.pending;
      if (e.pending = null, i !== null) {
        i = i.next;
        do
          t.status = "rejected", t.reason = a, Om(t), t = t.next;
        while (t !== i);
      }
      e.action = null;
    }
    function Om(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function Dm(e, t) {
      return t;
    }
    function Im(e, t) {
      if (Ke) {
        var a = ft.formState;
        if (a !== null) {
          e: {
            var i = He;
            if (Ke) {
              if (yt) {
                t: {
                  for (var u = yt, h = Rn; u.nodeType !== 8; ) {
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
                  yt = Tn(u.nextSibling), i = u.data === "F!";
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
      return a = en(), a.memoizedState = a.baseState = t, i = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Dm,
        lastRenderedState: t
      }, a.queue = i, a = tg.bind(null, He, i), i.dispatch = a, i = gu(false), h = Su.bind(null, He, false, i.queue), i = en(), u = {
        state: t,
        dispatch: null,
        action: e,
        pending: null
      }, i.queue = u, a = Ox.bind(null, He, u, h, a), u.dispatch = a, i.memoizedState = e, [
        t,
        a,
        false
      ];
    }
    function zm(e) {
      var t = kt();
      return Hm(t, st, e);
    }
    function Hm(e, t, a) {
      if (t = hu(e, t, Dm)[0], e = Vi(yl)[0], typeof t == "object" && t !== null && typeof t.then == "function") try {
        var i = co(t);
      } catch (x) {
        throw x === da ? Ni : x;
      }
      else i = t;
      t = kt();
      var u = t.queue, h = u.dispatch;
      return a !== t.memoizedState && (He.flags |= 2048, pa(9, {
        destroy: void 0
      }, Dx.bind(null, u, a), null)), [
        i,
        h,
        e
      ];
    }
    function Dx(e, t) {
      e.action = t;
    }
    function Um(e) {
      var t = kt(), a = st;
      if (a !== null) return Hm(t, a, e);
      kt(), t = t.memoizedState, a = kt();
      var i = a.queue.dispatch;
      return a.memoizedState = e, [
        t,
        i,
        false
      ];
    }
    function pa(e, t, a, i) {
      return e = {
        tag: e,
        create: a,
        deps: i,
        inst: t,
        next: null
      }, t = He.updateQueue, t === null && (t = Bi(), He.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = e.next = e : (i = a.next, a.next = e, e.next = i, t.lastEffect = e), e;
    }
    function Ym() {
      return kt().memoizedState;
    }
    function $i(e, t, a, i) {
      var u = en();
      He.flags |= e, u.memoizedState = pa(1 | t, {
        destroy: void 0
      }, a, i === void 0 ? null : i);
    }
    function qi(e, t, a, i) {
      var u = kt();
      i = i === void 0 ? null : i;
      var h = u.memoizedState.inst;
      st !== null && i !== null && iu(i, st.memoizedState.deps) ? u.memoizedState = pa(t, h, a, i) : (He.flags |= e, u.memoizedState = pa(1 | t, h, a, i));
    }
    function Bm(e, t) {
      $i(8390656, 8, e, t);
    }
    function yu(e, t) {
      qi(2048, 8, e, t);
    }
    function Ix(e) {
      He.flags |= 4;
      var t = He.updateQueue;
      if (t === null) t = Bi(), He.updateQueue = t, t.events = [
        e
      ];
      else {
        var a = t.events;
        a === null ? t.events = [
          e
        ] : a.push(e);
      }
    }
    function Xm(e) {
      var t = kt().memoizedState;
      return Ix({
        ref: t,
        nextImpl: e
      }), function() {
        if ((tt & 2) !== 0) throw Error(o(440));
        return t.impl.apply(void 0, arguments);
      };
    }
    function Vm(e, t) {
      return qi(4, 2, e, t);
    }
    function $m(e, t) {
      return qi(4, 4, e, t);
    }
    function qm(e, t) {
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
    function Gm(e, t, a) {
      a = a != null ? a.concat([
        e
      ]) : null, qi(4, 4, qm.bind(null, t, e), a);
    }
    function bu() {
    }
    function Pm(e, t) {
      var a = kt();
      t = t === void 0 ? null : t;
      var i = a.memoizedState;
      return t !== null && iu(t, i[1]) ? i[0] : (a.memoizedState = [
        e,
        t
      ], e);
    }
    function Km(e, t) {
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
      return a === void 0 || (pl & 1073741824) !== 0 && (Ge & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = a, e = Zg(), He.lanes |= e, Zl |= e, a);
    }
    function Zm(e, t, a, i) {
      return gn(a, t) ? a : ha.current !== null ? (e = vu(e, a, i), gn(e, t) || (Tt = true), e) : (pl & 42) === 0 || (pl & 1073741824) !== 0 && (Ge & 261930) === 0 ? (Tt = true, e.memoizedState = a) : (e = Zg(), He.lanes |= e, Zl |= e, t);
    }
    function Fm(e, t, a, i, u) {
      var h = F.p;
      F.p = h !== 0 && 8 > h ? h : 8;
      var x = q.T, M = {};
      q.T = M, Su(e, false, t, a);
      try {
        var z = u(), K = q.S;
        if (K !== null && K(M, z), z !== null && typeof z == "object" && typeof z.then == "function") {
          var ne = Ax(z, i);
          uo(e, t, ne, wn(e));
        } else uo(e, t, i, wn(e));
      } catch (ae) {
        uo(e, t, {
          then: function() {
          },
          status: "rejected",
          reason: ae
        }, wn());
      } finally {
        F.p = h, x !== null && M.types !== null && (x.types = M.types), q.T = x;
      }
    }
    function zx() {
    }
    function xu(e, t, a, i) {
      if (e.tag !== 5) throw Error(o(476));
      var u = Qm(e).queue;
      Fm(e, u, t, ce, a === null ? zx : function() {
        return Wm(e), a(i);
      });
    }
    function Qm(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: ce,
        baseState: ce,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: yl,
          lastRenderedState: ce
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
    function Wm(e) {
      var t = Qm(e);
      t.next === null && (t = e.alternate.memoizedState), uo(e, t.next.queue, {}, wn());
    }
    function wu() {
      return qt(jo);
    }
    function Jm() {
      return kt().memoizedState;
    }
    function eg() {
      return kt().memoizedState;
    }
    function Hx(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var a = wn();
            e = Vl(a);
            var i = $l(t, e, a);
            i !== null && (dn(i, t, a), ao(i, t, a)), t = {
              cache: Fc()
            }, e.payload = t;
            return;
        }
        t = t.return;
      }
    }
    function Ux(e, t, a) {
      var i = wn();
      a = {
        lane: i,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: false,
        eagerState: null,
        next: null
      }, Gi(e) ? ng(t, a) : (a = Uc(e, t, a, i), a !== null && (dn(a, e, i), lg(a, t, i)));
    }
    function tg(e, t, a) {
      var i = wn();
      uo(e, t, a, i);
    }
    function uo(e, t, a, i) {
      var u = {
        lane: i,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: false,
        eagerState: null,
        next: null
      };
      if (Gi(e)) ng(t, u);
      else {
        var h = e.alternate;
        if (e.lanes === 0 && (h === null || h.lanes === 0) && (h = t.lastRenderedReducer, h !== null)) try {
          var x = t.lastRenderedState, M = h(x, a);
          if (u.hasEagerState = true, u.eagerState = M, gn(M, x)) return ki(e, t, u, 0), ft === null && _i(), false;
        } catch {
        } finally {
        }
        if (a = Uc(e, t, u, i), a !== null) return dn(a, e, i), lg(a, t, i), true;
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
      }, Gi(e)) {
        if (t) throw Error(o(479));
      } else t = Uc(e, a, i, 2), t !== null && dn(t, e, 2);
    }
    function Gi(e) {
      var t = e.alternate;
      return e === He || t !== null && t === He;
    }
    function ng(e, t) {
      ma = Ui = true;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function lg(e, t, a) {
      if ((a & 4194048) !== 0) {
        var i = t.lanes;
        i &= e.pendingLanes, a |= i, t.lanes = a, hi(e, a);
      }
    }
    var fo = {
      readContext: qt,
      use: Xi,
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
    fo.useEffectEvent = St;
    var rg = {
      readContext: qt,
      use: Xi,
      useCallback: function(e, t) {
        return en().memoizedState = [
          e,
          t === void 0 ? null : t
        ], e;
      },
      useContext: qt,
      useEffect: Bm,
      useImperativeHandle: function(e, t, a) {
        a = a != null ? a.concat([
          e
        ]) : null, $i(4194308, 4, qm.bind(null, t, e), a);
      },
      useLayoutEffect: function(e, t) {
        return $i(4194308, 4, e, t);
      },
      useInsertionEffect: function(e, t) {
        $i(4, 2, e, t);
      },
      useMemo: function(e, t) {
        var a = en();
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
        var i = en();
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
        }, i.queue = e, e = e.dispatch = Ux.bind(null, He, e), [
          i.memoizedState,
          e
        ];
      },
      useRef: function(e) {
        var t = en();
        return e = {
          current: e
        }, t.memoizedState = e;
      },
      useState: function(e) {
        e = gu(e);
        var t = e.queue, a = tg.bind(null, He, t);
        return t.dispatch = a, [
          e.memoizedState,
          a
        ];
      },
      useDebugValue: bu,
      useDeferredValue: function(e, t) {
        var a = en();
        return vu(a, e, t);
      },
      useTransition: function() {
        var e = gu(false);
        return e = Fm.bind(null, He, e.queue, true, false), en().memoizedState = e, [
          false,
          e
        ];
      },
      useSyncExternalStore: function(e, t, a) {
        var i = He, u = en();
        if (Ke) {
          if (a === void 0) throw Error(o(407));
          a = a();
        } else {
          if (a = t(), ft === null) throw Error(o(349));
          (Ge & 127) !== 0 || _m(i, t, a);
        }
        u.memoizedState = a;
        var h = {
          value: a,
          getSnapshot: t
        };
        return u.queue = h, Bm(Mm.bind(null, i, h, e), [
          e
        ]), i.flags |= 2048, pa(9, {
          destroy: void 0
        }, km.bind(null, i, h, a, t), null), a;
      },
      useId: function() {
        var e = en(), t = ft.identifierPrefix;
        if (Ke) {
          var a = tl, i = el;
          a = (i & ~(1 << 32 - Jt(i) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = Yi++, 0 < a && (t += "H" + a.toString(32)), t += "_";
        } else a = Tx++, t = "_" + t + "r_" + a.toString(32) + "_";
        return e.memoizedState = t;
      },
      useHostTransitionStatus: wu,
      useFormState: Im,
      useActionState: Im,
      useOptimistic: function(e) {
        var t = en();
        t.memoizedState = t.baseState = e;
        var a = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        return t.queue = a, t = Su.bind(null, He, true, a), a.dispatch = t, [
          e,
          t
        ];
      },
      useMemoCache: fu,
      useCacheRefresh: function() {
        return en().memoizedState = Hx.bind(null, He);
      },
      useEffectEvent: function(e) {
        var t = en(), a = {
          impl: e
        };
        return t.memoizedState = a, function() {
          if ((tt & 2) !== 0) throw Error(o(440));
          return a.impl.apply(void 0, arguments);
        };
      }
    }, Cu = {
      readContext: qt,
      use: Xi,
      useCallback: Pm,
      useContext: qt,
      useEffect: yu,
      useImperativeHandle: Gm,
      useInsertionEffect: Vm,
      useLayoutEffect: $m,
      useMemo: Km,
      useReducer: Vi,
      useRef: Ym,
      useState: function() {
        return Vi(yl);
      },
      useDebugValue: bu,
      useDeferredValue: function(e, t) {
        var a = kt();
        return Zm(a, st.memoizedState, e, t);
      },
      useTransition: function() {
        var e = Vi(yl)[0], t = kt().memoizedState;
        return [
          typeof e == "boolean" ? e : co(e),
          t
        ];
      },
      useSyncExternalStore: Em,
      useId: Jm,
      useHostTransitionStatus: wu,
      useFormState: zm,
      useActionState: zm,
      useOptimistic: function(e, t) {
        var a = kt();
        return Rm(a, st, e, t);
      },
      useMemoCache: fu,
      useCacheRefresh: eg
    };
    Cu.useEffectEvent = Xm;
    var ag = {
      readContext: qt,
      use: Xi,
      useCallback: Pm,
      useContext: qt,
      useEffect: yu,
      useImperativeHandle: Gm,
      useInsertionEffect: Vm,
      useLayoutEffect: $m,
      useMemo: Km,
      useReducer: mu,
      useRef: Ym,
      useState: function() {
        return mu(yl);
      },
      useDebugValue: bu,
      useDeferredValue: function(e, t) {
        var a = kt();
        return st === null ? vu(a, e, t) : Zm(a, st.memoizedState, e, t);
      },
      useTransition: function() {
        var e = mu(yl)[0], t = kt().memoizedState;
        return [
          typeof e == "boolean" ? e : co(e),
          t
        ];
      },
      useSyncExternalStore: Em,
      useId: Jm,
      useHostTransitionStatus: wu,
      useFormState: Um,
      useActionState: Um,
      useOptimistic: function(e, t) {
        var a = kt();
        return st !== null ? Rm(a, st, e, t) : (a.baseState = e, [
          e,
          a.queue.dispatch
        ]);
      },
      useMemoCache: fu,
      useCacheRefresh: eg
    };
    ag.useEffectEvent = Xm;
    function Eu(e, t, a, i) {
      t = e.memoizedState, a = a(i, t), a = a == null ? t : b({}, t, a), e.memoizedState = a, e.lanes === 0 && (e.updateQueue.baseState = a);
    }
    var _u = {
      enqueueSetState: function(e, t, a) {
        e = e._reactInternals;
        var i = wn(), u = Vl(i);
        u.payload = t, a != null && (u.callback = a), t = $l(e, u, i), t !== null && (dn(t, e, i), ao(t, e, i));
      },
      enqueueReplaceState: function(e, t, a) {
        e = e._reactInternals;
        var i = wn(), u = Vl(i);
        u.tag = 1, u.payload = t, a != null && (u.callback = a), t = $l(e, u, i), t !== null && (dn(t, e, i), ao(t, e, i));
      },
      enqueueForceUpdate: function(e, t) {
        e = e._reactInternals;
        var a = wn(), i = Vl(a);
        i.tag = 2, t != null && (i.callback = t), t = $l(e, i, a), t !== null && (dn(t, e, a), ao(t, e, a));
      }
    };
    function og(e, t, a, i, u, h, x) {
      return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(i, h, x) : t.prototype && t.prototype.isPureReactComponent ? !Qa(a, i) || !Qa(u, h) : true;
    }
    function ig(e, t, a, i) {
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
    function sg(e) {
      Ei(e);
    }
    function cg(e) {
      console.error(e);
    }
    function ug(e) {
      Ei(e);
    }
    function Pi(e, t) {
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
    function dg(e, t, a) {
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
        Pi(e, t);
      }, a;
    }
    function fg(e) {
      return e = Vl(e), e.tag = 3, e;
    }
    function hg(e, t, a, i) {
      var u = a.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var h = i.value;
        e.payload = function() {
          return u(h);
        }, e.callback = function() {
          dg(t, a, i);
        };
      }
      var x = a.stateNode;
      x !== null && typeof x.componentDidCatch == "function" && (e.callback = function() {
        dg(t, a, i), typeof u != "function" && (Fl === null ? Fl = /* @__PURE__ */ new Set([
          this
        ]) : Fl.add(this));
        var M = i.stack;
        this.componentDidCatch(i.value, {
          componentStack: M !== null ? M : ""
        });
      });
    }
    function Yx(e, t, a, i, u) {
      if (a.flags |= 32768, i !== null && typeof i == "object" && typeof i.then == "function") {
        if (t = a.alternate, t !== null && sa(t, a, u, true), a = yn.current, a !== null) {
          switch (a.tag) {
            case 31:
            case 13:
              return An === null ? as() : a.alternate === null && Ct === 0 && (Ct = 3), a.flags &= -257, a.flags |= 65536, a.lanes = u, i === Oi ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([
                i
              ]) : t.add(i), Qu(e, i, u)), false;
            case 22:
              return a.flags |= 65536, i === Oi ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([
                  i
                ])
              }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([
                i
              ]) : a.add(i)), Qu(e, i, u)), false;
          }
          throw Error(o(435, a.tag));
        }
        return Qu(e, i, u), as(), false;
      }
      if (Ke) return t = yn.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, i !== qc && (e = Error(o(422), {
        cause: i
      }), eo(Mn(e, a)))) : (i !== qc && (t = Error(o(423), {
        cause: i
      }), eo(Mn(t, a))), e = e.current.alternate, e.flags |= 65536, u &= -u, e.lanes |= u, i = Mn(i, a), u = ku(e.stateNode, i, u), nu(e, u), Ct !== 4 && (Ct = 2)), false;
      var h = Error(o(520), {
        cause: i
      });
      if (h = Mn(h, a), xo === null ? xo = [
        h
      ] : xo.push(h), Ct !== 4 && (Ct = 2), t === null) return true;
      i = Mn(i, a), a = t;
      do {
        switch (a.tag) {
          case 3:
            return a.flags |= 65536, e = u & -u, a.lanes |= e, e = ku(a.stateNode, i, e), nu(a, e), false;
          case 1:
            if (t = a.type, h = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (Fl === null || !Fl.has(h)))) return a.flags |= 65536, u &= -u, a.lanes |= u, u = fg(u), hg(u, e, a, i), nu(a, u), false;
        }
        a = a.return;
      } while (a !== null);
      return false;
    }
    var Mu = Error(o(461)), Tt = false;
    function Gt(e, t, a, i) {
      t.child = e === null ? ym(t, null, a, i) : Tr(t, e.child, a, i);
    }
    function mg(e, t, a, i, u) {
      a = a.render;
      var h = t.ref;
      if ("ref" in i) {
        var x = {};
        for (var M in i) M !== "ref" && (x[M] = i[M]);
      } else x = i;
      return jr(t), i = su(e, t, a, x, h, u), M = cu(), e !== null && !Tt ? (uu(e, t, u), bl(e, t, u)) : (Ke && M && Vc(t), t.flags |= 1, Gt(e, t, i, u), t.child);
    }
    function gg(e, t, a, i, u) {
      if (e === null) {
        var h = a.type;
        return typeof h == "function" && !Yc(h) && h.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = h, pg(e, t, h, i, u)) : (e = ji(a.type, null, i, t, t.mode, u), e.ref = t.ref, e.return = t, t.child = e);
      }
      if (h = e.child, !Du(e, u)) {
        var x = h.memoizedProps;
        if (a = a.compare, a = a !== null ? a : Qa, a(x, i) && e.ref === t.ref) return bl(e, t, u);
      }
      return t.flags |= 1, e = fl(h, i), e.ref = t.ref, e.return = t, t.child = e;
    }
    function pg(e, t, a, i, u) {
      if (e !== null) {
        var h = e.memoizedProps;
        if (Qa(h, i) && e.ref === t.ref) if (Tt = false, t.pendingProps = i = h, Du(e, u)) (e.flags & 131072) !== 0 && (Tt = true);
        else return t.lanes = e.lanes, bl(e, t, u);
      }
      return ju(e, t, a, i, u);
    }
    function yg(e, t, a, i) {
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
          return bg(e, t, h, a, i);
        }
        if ((a & 536870912) !== 0) t.memoizedState = {
          baseLanes: 0,
          cachePool: null
        }, e !== null && Ti(t, h !== null ? h.cachePool : null), h !== null ? xm(t, h) : ru(), wm(t);
        else return i = t.lanes = 536870912, bg(e, t, h !== null ? h.baseLanes | a : a, a, i);
      } else h !== null ? (Ti(t, h.cachePool), xm(t, h), Gl(), t.memoizedState = null) : (e !== null && Ti(t, null), ru(), Gl());
      return Gt(e, t, u, a), t.child;
    }
    function ho(e, t) {
      return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), t.sibling;
    }
    function bg(e, t, a, i, u) {
      var h = Wc();
      return h = h === null ? null : {
        parent: Rt._currentValue,
        pool: h
      }, t.memoizedState = {
        baseLanes: a,
        cachePool: h
      }, e !== null && Ti(t, null), ru(), wm(t), e !== null && sa(e, t, i, true), t.childLanes = u, null;
    }
    function Ki(e, t) {
      return t = Fi({
        mode: t.mode,
        children: t.children
      }, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
    }
    function vg(e, t, a) {
      return Tr(t, e.child, null, a), e = Ki(t, t.pendingProps), e.flags |= 2, bn(t), t.memoizedState = null, e;
    }
    function Bx(e, t, a) {
      var i = t.pendingProps, u = (t.flags & 128) !== 0;
      if (t.flags &= -129, e === null) {
        if (Ke) {
          if (i.mode === "hidden") return e = Ki(t, i), t.lanes = 536870912, ho(null, e);
          if (ou(t), (e = yt) ? (e = Ap(e, Rn), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: Hl !== null ? {
              id: el,
              overflow: tl
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, a = nm(e), a.return = t, t.child = a, $t = t, yt = null)) : e = null, e === null) throw Yl(t);
          return t.lanes = 536870912, null;
        }
        return Ki(t, i);
      }
      var h = e.memoizedState;
      if (h !== null) {
        var x = h.dehydrated;
        if (ou(t), u) if (t.flags & 256) t.flags &= -257, t = vg(e, t, a);
        else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
        else if (Tt || sa(e, t, a, false), u = (a & e.childLanes) !== 0, Tt || u) {
          if (i = ft, i !== null && (x = mi(i, a), x !== 0 && x !== h.retryLane)) throw h.retryLane = x, Er(e, x), dn(i, e, x), Mu;
          as(), t = vg(e, t, a);
        } else e = h.treeContext, yt = Tn(x.nextSibling), $t = t, Ke = true, Ul = null, Rn = false, e !== null && am(t, e), t = Ki(t, i), t.flags |= 4096;
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
      return jr(t), a = su(e, t, a, i, void 0, u), i = cu(), e !== null && !Tt ? (uu(e, t, u), bl(e, t, u)) : (Ke && i && Vc(t), t.flags |= 1, Gt(e, t, a, u), t.child);
    }
    function xg(e, t, a, i, u, h) {
      return jr(t), t.updateQueue = null, a = Cm(t, i, a, u), Sm(e), i = cu(), e !== null && !Tt ? (uu(e, t, h), bl(e, t, h)) : (Ke && i && Vc(t), t.flags |= 1, Gt(e, t, a, h), t.child);
    }
    function wg(e, t, a, i, u) {
      if (jr(t), t.stateNode === null) {
        var h = ra, x = a.contextType;
        typeof x == "object" && x !== null && (h = qt(x)), h = new a(i, h), t.memoizedState = h.state !== null && h.state !== void 0 ? h.state : null, h.updater = _u, t.stateNode = h, h._reactInternals = t, h = t.stateNode, h.props = i, h.state = t.memoizedState, h.refs = {}, eu(t), x = a.contextType, h.context = typeof x == "object" && x !== null ? qt(x) : ra, h.state = t.memoizedState, x = a.getDerivedStateFromProps, typeof x == "function" && (Eu(t, a, x, i), h.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof h.getSnapshotBeforeUpdate == "function" || typeof h.UNSAFE_componentWillMount != "function" && typeof h.componentWillMount != "function" || (x = h.state, typeof h.componentWillMount == "function" && h.componentWillMount(), typeof h.UNSAFE_componentWillMount == "function" && h.UNSAFE_componentWillMount(), x !== h.state && _u.enqueueReplaceState(h, h.state, null), io(t, i, h, u), oo(), h.state = t.memoizedState), typeof h.componentDidMount == "function" && (t.flags |= 4194308), i = true;
      } else if (e === null) {
        h = t.stateNode;
        var M = t.memoizedProps, z = Or(a, M);
        h.props = z;
        var K = h.context, ne = a.contextType;
        x = ra, typeof ne == "object" && ne !== null && (x = qt(ne));
        var ae = a.getDerivedStateFromProps;
        ne = typeof ae == "function" || typeof h.getSnapshotBeforeUpdate == "function", M = t.pendingProps !== M, ne || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (M || K !== x) && ig(t, h, i, x), Xl = false;
        var Z = t.memoizedState;
        h.state = Z, io(t, i, h, u), oo(), K = t.memoizedState, M || Z !== K || Xl ? (typeof ae == "function" && (Eu(t, a, ae, i), K = t.memoizedState), (z = Xl || og(t, a, z, i, Z, K, x)) ? (ne || typeof h.UNSAFE_componentWillMount != "function" && typeof h.componentWillMount != "function" || (typeof h.componentWillMount == "function" && h.componentWillMount(), typeof h.UNSAFE_componentWillMount == "function" && h.UNSAFE_componentWillMount()), typeof h.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof h.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = i, t.memoizedState = K), h.props = i, h.state = K, h.context = x, i = z) : (typeof h.componentDidMount == "function" && (t.flags |= 4194308), i = false);
      } else {
        h = t.stateNode, tu(e, t), x = t.memoizedProps, ne = Or(a, x), h.props = ne, ae = t.pendingProps, Z = h.context, K = a.contextType, z = ra, typeof K == "object" && K !== null && (z = qt(K)), M = a.getDerivedStateFromProps, (K = typeof M == "function" || typeof h.getSnapshotBeforeUpdate == "function") || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (x !== ae || Z !== z) && ig(t, h, i, z), Xl = false, Z = t.memoizedState, h.state = Z, io(t, i, h, u), oo();
        var Q = t.memoizedState;
        x !== ae || Z !== Q || Xl || e !== null && e.dependencies !== null && Ri(e.dependencies) ? (typeof M == "function" && (Eu(t, a, M, i), Q = t.memoizedState), (ne = Xl || og(t, a, ne, i, Z, Q, z) || e !== null && e.dependencies !== null && Ri(e.dependencies)) ? (K || typeof h.UNSAFE_componentWillUpdate != "function" && typeof h.componentWillUpdate != "function" || (typeof h.componentWillUpdate == "function" && h.componentWillUpdate(i, Q, z), typeof h.UNSAFE_componentWillUpdate == "function" && h.UNSAFE_componentWillUpdate(i, Q, z)), typeof h.componentDidUpdate == "function" && (t.flags |= 4), typeof h.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof h.componentDidUpdate != "function" || x === e.memoizedProps && Z === e.memoizedState || (t.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || x === e.memoizedProps && Z === e.memoizedState || (t.flags |= 1024), t.memoizedProps = i, t.memoizedState = Q), h.props = i, h.state = Q, h.context = z, i = ne) : (typeof h.componentDidUpdate != "function" || x === e.memoizedProps && Z === e.memoizedState || (t.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || x === e.memoizedProps && Z === e.memoizedState || (t.flags |= 1024), i = false);
      }
      return h = i, Zi(e, t), i = (t.flags & 128) !== 0, h || i ? (h = t.stateNode, a = i && typeof a.getDerivedStateFromError != "function" ? null : h.render(), t.flags |= 1, e !== null && i ? (t.child = Tr(t, e.child, null, u), t.child = Tr(t, null, a, u)) : Gt(e, t, a, u), t.memoizedState = h.state, e = t.child) : e = bl(e, t, u), e;
    }
    function Sg(e, t, a, i) {
      return kr(), t.flags |= 256, Gt(e, t, a, i), t.child;
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
        cachePool: dm()
      };
    }
    function Au(e, t, a) {
      return e = e !== null ? e.childLanes & ~a : 0, t && (e |= xn), e;
    }
    function Cg(e, t, a) {
      var i = t.pendingProps, u = false, h = (t.flags & 128) !== 0, x;
      if ((x = h) || (x = e !== null && e.memoizedState === null ? false : (_t.current & 2) !== 0), x && (u = true, t.flags &= -129), x = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
        if (Ke) {
          if (u ? ql(t) : Gl(), (e = yt) ? (e = Ap(e, Rn), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
            dehydrated: e,
            treeContext: Hl !== null ? {
              id: el,
              overflow: tl
            } : null,
            retryLane: 536870912,
            hydrationErrors: null
          }, a = nm(e), a.return = t, t.child = a, $t = t, yt = null)) : e = null, e === null) throw Yl(t);
          return hd(e) ? t.lanes = 32 : t.lanes = 536870912, null;
        }
        var M = i.children;
        return i = i.fallback, u ? (Gl(), u = t.mode, M = Fi({
          mode: "hidden",
          children: M
        }, u), i = _r(i, u, a, null), M.return = t, i.return = t, M.sibling = i, t.child = M, i = t.child, i.memoizedState = Ru(a), i.childLanes = Au(e, x, a), t.memoizedState = Lu, ho(null, i)) : (ql(t), Tu(t, M));
      }
      var z = e.memoizedState;
      if (z !== null && (M = z.dehydrated, M !== null)) {
        if (h) t.flags & 256 ? (ql(t), t.flags &= -257, t = Nu(e, t, a)) : t.memoizedState !== null ? (Gl(), t.child = e.child, t.flags |= 128, t = null) : (Gl(), M = i.fallback, u = t.mode, i = Fi({
          mode: "visible",
          children: i.children
        }, u), M = _r(M, u, a, null), M.flags |= 2, i.return = t, M.return = t, i.sibling = M, t.child = i, Tr(t, e.child, null, a), i = t.child, i.memoizedState = Ru(a), i.childLanes = Au(e, x, a), t.memoizedState = Lu, t = ho(null, i));
        else if (ql(t), hd(M)) {
          if (x = M.nextSibling && M.nextSibling.dataset, x) var K = x.dgst;
          x = K, i = Error(o(419)), i.stack = "", i.digest = x, eo({
            value: i,
            source: null,
            stack: null
          }), t = Nu(e, t, a);
        } else if (Tt || sa(e, t, a, false), x = (a & e.childLanes) !== 0, Tt || x) {
          if (x = ft, x !== null && (i = mi(x, a), i !== 0 && i !== z.retryLane)) throw z.retryLane = i, Er(e, i), dn(x, e, i), Mu;
          fd(M) || as(), t = Nu(e, t, a);
        } else fd(M) ? (t.flags |= 192, t.child = e.child, t = null) : (e = z.treeContext, yt = Tn(M.nextSibling), $t = t, Ke = true, Ul = null, Rn = false, e !== null && am(t, e), t = Tu(t, i.children), t.flags |= 4096);
        return t;
      }
      return u ? (Gl(), M = i.fallback, u = t.mode, z = e.child, K = z.sibling, i = fl(z, {
        mode: "hidden",
        children: i.children
      }), i.subtreeFlags = z.subtreeFlags & 65011712, K !== null ? M = fl(K, M) : (M = _r(M, u, a, null), M.flags |= 2), M.return = t, i.return = t, i.sibling = M, t.child = i, ho(null, i), i = t.child, M = e.child.memoizedState, M === null ? M = Ru(a) : (u = M.cachePool, u !== null ? (z = Rt._currentValue, u = u.parent !== z ? {
        parent: z,
        pool: z
      } : u) : u = dm(), M = {
        baseLanes: M.baseLanes | a,
        cachePool: u
      }), i.memoizedState = M, i.childLanes = Au(e, x, a), t.memoizedState = Lu, ho(e.child, i)) : (ql(t), a = e.child, e = a.sibling, a = fl(a, {
        mode: "visible",
        children: i.children
      }), a.return = t, a.sibling = null, e !== null && (x = t.deletions, x === null ? (t.deletions = [
        e
      ], t.flags |= 16) : x.push(e)), t.child = a, t.memoizedState = null, a);
    }
    function Tu(e, t) {
      return t = Fi({
        mode: "visible",
        children: t
      }, e.mode), t.return = e, e.child = t;
    }
    function Fi(e, t) {
      return e = pn(22, e, null, t), e.lanes = 0, e;
    }
    function Nu(e, t, a) {
      return Tr(t, e.child, null, a), e = Tu(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
    }
    function Eg(e, t, a) {
      e.lanes |= t;
      var i = e.alternate;
      i !== null && (i.lanes |= t), Kc(e.return, t, a);
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
    function _g(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, h = i.tail;
      i = i.children;
      var x = _t.current, M = (x & 2) !== 0;
      if (M ? (x = x & 1 | 2, t.flags |= 128) : x &= 1, $(_t, x), Gt(e, t, i, a), i = Ke ? Ja : 0, !M && e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Eg(e, a, t);
        else if (e.tag === 19) Eg(e, a, t);
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
          for (a = t.child, u = null; a !== null; ) e = a.alternate, e !== null && Hi(e) === null && (u = a), a = a.sibling;
          a = u, a === null ? (u = t.child, t.child = null) : (u = a.sibling, a.sibling = null), Ou(t, false, u, a, h, i);
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (a = null, u = t.child, t.child = null; u !== null; ) {
            if (e = u.alternate, e !== null && Hi(e) === null) {
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
      if (e !== null && (t.dependencies = e.dependencies), Zl |= t.lanes, (a & t.childLanes) === 0) if (e !== null) {
        if (sa(e, t, a, false), (a & t.childLanes) === 0) return null;
      } else return null;
      if (e !== null && t.child !== e.child) throw Error(o(153));
      if (t.child !== null) {
        for (e = t.child, a = fl(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null; ) e = e.sibling, a = a.sibling = fl(e, e.pendingProps), a.return = t;
        a.sibling = null;
      }
      return t.child;
    }
    function Du(e, t) {
      return (e.lanes & t) !== 0 ? true : (e = e.dependencies, !!(e !== null && Ri(e)));
    }
    function Xx(e, t, a) {
      switch (t.tag) {
        case 3:
          ue(t, t.stateNode.containerInfo), Bl(t, Rt, e.memoizedState.cache), kr();
          break;
        case 27:
        case 5:
          se(t);
          break;
        case 4:
          ue(t, t.stateNode.containerInfo);
          break;
        case 10:
          Bl(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return t.flags |= 128, ou(t), null;
          break;
        case 13:
          var i = t.memoizedState;
          if (i !== null) return i.dehydrated !== null ? (ql(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? Cg(e, t, a) : (ql(t), e = bl(e, t, a), e !== null ? e.sibling : null);
          ql(t);
          break;
        case 19:
          var u = (e.flags & 128) !== 0;
          if (i = (a & t.childLanes) !== 0, i || (sa(e, t, a, false), i = (a & t.childLanes) !== 0), u) {
            if (i) return _g(e, t, a);
            t.flags |= 128;
          }
          if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), $(_t, _t.current), i) break;
          return null;
        case 22:
          return t.lanes = 0, yg(e, t, a, t.pendingProps);
        case 24:
          Bl(t, Rt, e.memoizedState.cache);
      }
      return bl(e, t, a);
    }
    function kg(e, t, a) {
      if (e !== null) if (e.memoizedProps !== t.pendingProps) Tt = true;
      else {
        if (!Du(e, a) && (t.flags & 128) === 0) return Tt = false, Xx(e, t, a);
        Tt = (e.flags & 131072) !== 0;
      }
      else Tt = false, Ke && (t.flags & 1048576) !== 0 && rm(t, Ja, t.index);
      switch (t.lanes = 0, t.tag) {
        case 16:
          e: {
            var i = t.pendingProps;
            if (e = Rr(t.elementType), t.type = e, typeof e == "function") Yc(e) ? (i = Or(e, i), t.tag = 1, t = wg(null, t, e, i, a)) : (t.tag = 0, t = ju(null, t, e, i, a));
            else {
              if (e != null) {
                var u = e.$$typeof;
                if (u === j) {
                  t.tag = 11, t = mg(null, t, e, i, a);
                  break e;
                } else if (u === R) {
                  t.tag = 14, t = gg(null, t, e, i, a);
                  break e;
                }
              }
              throw t = me(e) || e, Error(o(306, t, ""));
            }
          }
          return t;
        case 0:
          return ju(e, t, t.type, t.pendingProps, a);
        case 1:
          return i = t.type, u = Or(i, t.pendingProps), wg(e, t, i, u, a);
        case 3:
          e: {
            if (ue(t, t.stateNode.containerInfo), e === null) throw Error(o(387));
            i = t.pendingProps;
            var h = t.memoizedState;
            u = h.element, tu(e, t), io(t, i, null, a);
            var x = t.memoizedState;
            if (i = x.cache, Bl(t, Rt, i), i !== h.cache && Zc(t, [
              Rt
            ], a, true), oo(), i = x.element, h.isDehydrated) if (h = {
              element: i,
              isDehydrated: false,
              cache: x.cache
            }, t.updateQueue.baseState = h, t.memoizedState = h, t.flags & 256) {
              t = Sg(e, t, i, a);
              break e;
            } else if (i !== u) {
              u = Mn(Error(o(424)), t), eo(u), t = Sg(e, t, i, a);
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (yt = Tn(e.firstChild), $t = t, Ke = true, Ul = null, Rn = true, a = ym(t, null, i, a), t.child = a; a; ) a.flags = a.flags & -3 | 4096, a = a.sibling;
            }
            else {
              if (kr(), i === u) {
                t = bl(e, t, a);
                break e;
              }
              Gt(e, t, i, a);
            }
            t = t.child;
          }
          return t;
        case 26:
          return Zi(e, t), e === null ? (a = zp(t.type, null, t.pendingProps, null)) ? t.memoizedState = a : Ke || (a = t.type, e = t.pendingProps, i = fs(ie.current).createElement(a), i[It] = t, i[le] = e, Pt(i, a, e), rt(i), t.stateNode = i) : t.memoizedState = zp(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
        case 27:
          return se(t), e === null && Ke && (i = t.stateNode = Op(t.type, t.pendingProps, ie.current), $t = t, Rn = true, u = yt, er(t.type) ? (md = u, yt = Tn(i.firstChild)) : yt = u), Gt(e, t, t.pendingProps.children, a), Zi(e, t), e === null && (t.flags |= 4194304), t.child;
        case 5:
          return e === null && Ke && ((u = i = yt) && (i = bw(i, t.type, t.pendingProps, Rn), i !== null ? (t.stateNode = i, $t = t, yt = Tn(i.firstChild), Rn = false, u = true) : u = false), u || Yl(t)), se(t), u = t.type, h = t.pendingProps, x = e !== null ? e.memoizedProps : null, i = h.children, cd(u, h) ? i = null : x !== null && cd(u, x) && (t.flags |= 32), t.memoizedState !== null && (u = su(e, t, Nx, null, null, a), jo._currentValue = u), Zi(e, t), Gt(e, t, i, a), t.child;
        case 6:
          return e === null && Ke && ((e = a = yt) && (a = vw(a, t.pendingProps, Rn), a !== null ? (t.stateNode = a, $t = t, yt = null, e = true) : e = false), e || Yl(t)), null;
        case 13:
          return Cg(e, t, a);
        case 4:
          return ue(t, t.stateNode.containerInfo), i = t.pendingProps, e === null ? t.child = Tr(t, null, i, a) : Gt(e, t, i, a), t.child;
        case 11:
          return mg(e, t, t.type, t.pendingProps, a);
        case 7:
          return Gt(e, t, t.pendingProps, a), t.child;
        case 8:
          return Gt(e, t, t.pendingProps.children, a), t.child;
        case 12:
          return Gt(e, t, t.pendingProps.children, a), t.child;
        case 10:
          return i = t.pendingProps, Bl(t, t.type, i.value), Gt(e, t, i.children, a), t.child;
        case 9:
          return u = t.type._context, i = t.pendingProps.children, jr(t), u = qt(u), i = i(u), t.flags |= 1, Gt(e, t, i, a), t.child;
        case 14:
          return gg(e, t, t.type, t.pendingProps, a);
        case 15:
          return pg(e, t, t.type, t.pendingProps, a);
        case 19:
          return _g(e, t, a);
        case 31:
          return Bx(e, t, a);
        case 22:
          return yg(e, t, a, t.pendingProps);
        case 24:
          return jr(t), i = qt(Rt), e === null ? (u = Wc(), u === null && (u = ft, h = Fc(), u.pooledCache = h, h.refCount++, h !== null && (u.pooledCacheLanes |= a), u = h), t.memoizedState = {
            parent: i,
            cache: u
          }, eu(t), Bl(t, Rt, u)) : ((e.lanes & a) !== 0 && (tu(e, t), io(t, null, null, a), oo()), u = e.memoizedState, h = t.memoizedState, u.parent !== i ? (u = {
            parent: i,
            cache: i
          }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), Bl(t, Rt, i)) : (i = h.cache, Bl(t, Rt, i), i !== u.cache && Zc(t, [
            Rt
          ], a, true))), Gt(e, t, t.pendingProps.children, a), t.child;
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
        else if (Jg()) e.flags |= 8192;
        else throw Ar = Oi, Jc;
      } else e.flags &= -16777217;
    }
    function Mg(e, t) {
      if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
      else if (e.flags |= 16777216, !Xp(t)) if (Jg()) e.flags |= 8192;
      else throw Ar = Oi, Jc;
    }
    function Qi(e, t) {
      t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Pr() : 536870912, e.lanes |= t, xa |= t);
    }
    function mo(e, t) {
      if (!Ke) switch (e.tailMode) {
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
    function bt(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = 0, i = 0;
      if (t) for (var u = e.child; u !== null; ) a |= u.lanes | u.childLanes, i |= u.subtreeFlags & 65011712, i |= u.flags & 65011712, u.return = e, u = u.sibling;
      else for (u = e.child; u !== null; ) a |= u.lanes | u.childLanes, i |= u.subtreeFlags, i |= u.flags, u.return = e, u = u.sibling;
      return e.subtreeFlags |= i, e.childLanes = a, t;
    }
    function Vx(e, t, a) {
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
          return bt(t), null;
        case 1:
          return bt(t), null;
        case 3:
          return a = t.stateNode, i = null, e !== null && (i = e.memoizedState.cache), t.memoizedState.cache !== i && (t.flags |= 2048), gl(Rt), I(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (e === null || e.child === null) && (ia(t) ? vl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Gc())), bt(t), null;
        case 26:
          var u = t.type, h = t.memoizedState;
          return e === null ? (vl(t), h !== null ? (bt(t), Mg(t, h)) : (bt(t), Iu(t, u, null, i, a))) : h ? h !== e.memoizedState ? (vl(t), bt(t), Mg(t, h)) : (bt(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== i && vl(t), bt(t), Iu(t, u, e, i, a)), null;
        case 27:
          if (ge(t), a = ie.current, u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== i && vl(t);
          else {
            if (!i) {
              if (t.stateNode === null) throw Error(o(166));
              return bt(t), null;
            }
            e = J.current, ia(t) ? om(t) : (e = Op(u, i, a), t.stateNode = e, vl(t));
          }
          return bt(t), null;
        case 5:
          if (ge(t), u = t.type, e !== null && t.stateNode != null) e.memoizedProps !== i && vl(t);
          else {
            if (!i) {
              if (t.stateNode === null) throw Error(o(166));
              return bt(t), null;
            }
            if (h = J.current, ia(t)) om(t);
            else {
              var x = fs(ie.current);
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
              h[It] = t, h[le] = i;
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
              e: switch (Pt(h, u, i), u) {
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
          return bt(t), Iu(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a), null;
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== i && vl(t);
          else {
            if (typeof i != "string" && t.stateNode === null) throw Error(o(166));
            if (e = ie.current, ia(t)) {
              if (e = t.stateNode, a = t.memoizedProps, i = null, u = $t, u !== null) switch (u.tag) {
                case 27:
                case 5:
                  i = u.memoizedProps;
              }
              e[It] = t, e = !!(e.nodeValue === a || i !== null && i.suppressHydrationWarning === true || Cp(e.nodeValue, a)), e || Yl(t, true);
            } else e = fs(e).createTextNode(i), e[It] = t, t.stateNode = e;
          }
          return bt(t), null;
        case 31:
          if (a = t.memoizedState, e === null || e.memoizedState !== null) {
            if (i = ia(t), a !== null) {
              if (e === null) {
                if (!i) throw Error(o(318));
                if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
                e[It] = t;
              } else kr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              bt(t), e = false;
            } else a = Gc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), e = true;
            if (!e) return t.flags & 256 ? (bn(t), t) : (bn(t), null);
            if ((t.flags & 128) !== 0) throw Error(o(558));
          }
          return bt(t), null;
        case 13:
          if (i = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            if (u = ia(t), i !== null && i.dehydrated !== null) {
              if (e === null) {
                if (!u) throw Error(o(318));
                if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(o(317));
                u[It] = t;
              } else kr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
              bt(t), u = false;
            } else u = Gc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = u), u = true;
            if (!u) return t.flags & 256 ? (bn(t), t) : (bn(t), null);
          }
          return bn(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = i !== null, e = e !== null && e.memoizedState !== null, a && (i = t.child, u = null, i.alternate !== null && i.alternate.memoizedState !== null && i.alternate.memoizedState.cachePool !== null && (u = i.alternate.memoizedState.cachePool.pool), h = null, i.memoizedState !== null && i.memoizedState.cachePool !== null && (h = i.memoizedState.cachePool.pool), h !== u && (i.flags |= 2048)), a !== e && a && (t.child.flags |= 8192), Qi(t, t.updateQueue), bt(t), null);
        case 4:
          return I(), e === null && rd(t.stateNode.containerInfo), bt(t), null;
        case 10:
          return gl(t.type), bt(t), null;
        case 19:
          if (D(_t), i = t.memoizedState, i === null) return bt(t), null;
          if (u = (t.flags & 128) !== 0, h = i.rendering, h === null) if (u) mo(i, false);
          else {
            if (Ct !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
              if (h = Hi(e), h !== null) {
                for (t.flags |= 128, mo(i, false), e = h.updateQueue, t.updateQueue = e, Qi(t, e), t.subtreeFlags = 0, e = a, a = t.child; a !== null; ) tm(a, e), a = a.sibling;
                return $(_t, _t.current & 1 | 2), Ke && hl(t, i.treeForkCount), t.child;
              }
              e = e.sibling;
            }
            i.tail !== null && jt() > ns && (t.flags |= 128, u = true, mo(i, false), t.lanes = 4194304);
          }
          else {
            if (!u) if (e = Hi(h), e !== null) {
              if (t.flags |= 128, u = true, e = e.updateQueue, t.updateQueue = e, Qi(t, e), mo(i, true), i.tail === null && i.tailMode === "hidden" && !h.alternate && !Ke) return bt(t), null;
            } else 2 * jt() - i.renderingStartTime > ns && a !== 536870912 && (t.flags |= 128, u = true, mo(i, false), t.lanes = 4194304);
            i.isBackwards ? (h.sibling = t.child, t.child = h) : (e = i.last, e !== null ? e.sibling = h : t.child = h, i.last = h);
          }
          return i.tail !== null ? (e = i.tail, i.rendering = e, i.tail = e.sibling, i.renderingStartTime = jt(), e.sibling = null, a = _t.current, $(_t, u ? a & 1 | 2 : a & 1), Ke && hl(t, i.treeForkCount), e) : (bt(t), null);
        case 22:
        case 23:
          return bn(t), au(), i = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== i && (t.flags |= 8192) : i && (t.flags |= 8192), i ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (bt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : bt(t), a = t.updateQueue, a !== null && Qi(t, a.retryQueue), a = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), i = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (i = t.memoizedState.cachePool.pool), i !== a && (t.flags |= 2048), e !== null && D(Lr), null;
        case 24:
          return a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), gl(Rt), bt(t), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(o(156, t.tag));
    }
    function $x(e, t) {
      switch ($c(t), t.tag) {
        case 1:
          return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 3:
          return gl(Rt), I(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
        case 26:
        case 27:
        case 5:
          return ge(t), null;
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
          return I(), null;
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
    function jg(e, t) {
      switch ($c(t), t.tag) {
        case 3:
          gl(Rt), I();
          break;
        case 26:
        case 27:
        case 5:
          ge(t);
          break;
        case 4:
          I();
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
    function go(e, t) {
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
        ot(t, t.return, M);
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
                var z = a, K = M;
                try {
                  K();
                } catch (ne) {
                  ot(u, z, ne);
                }
              }
            }
            i = i.next;
          } while (i !== h);
        }
      } catch (ne) {
        ot(t, t.return, ne);
      }
    }
    function Lg(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var a = e.stateNode;
        try {
          vm(t, a);
        } catch (i) {
          ot(e, e.return, i);
        }
      }
    }
    function Rg(e, t, a) {
      a.props = Or(e.type, e.memoizedProps), a.state = e.memoizedState;
      try {
        a.componentWillUnmount();
      } catch (i) {
        ot(e, t, i);
      }
    }
    function po(e, t) {
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
        ot(e, t, u);
      }
    }
    function nl(e, t) {
      var a = e.ref, i = e.refCleanup;
      if (a !== null) if (typeof i == "function") try {
        i();
      } catch (u) {
        ot(e, t, u);
      } finally {
        e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
      }
      else if (typeof a == "function") try {
        a(null);
      } catch (u) {
        ot(e, t, u);
      }
      else a.current = null;
    }
    function Ag(e) {
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
        ot(e, e.return, u);
      }
    }
    function zu(e, t, a) {
      try {
        var i = e.stateNode;
        fw(i, e.type, a, t), i[le] = t;
      } catch (u) {
        ot(e, e.return, u);
      }
    }
    function Tg(e) {
      return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && er(e.type) || e.tag === 4;
    }
    function Hu(e) {
      e: for (; ; ) {
        for (; e.sibling === null; ) {
          if (e.return === null || Tg(e.return)) return null;
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
    function Wi(e, t, a) {
      var i = e.tag;
      if (i === 5 || i === 6) e = e.stateNode, t ? a.insertBefore(e, t) : a.appendChild(e);
      else if (i !== 4 && (i === 27 && er(e.type) && (a = e.stateNode), e = e.child, e !== null)) for (Wi(e, t, a), e = e.sibling; e !== null; ) Wi(e, t, a), e = e.sibling;
    }
    function Ng(e) {
      var t = e.stateNode, a = e.memoizedProps;
      try {
        for (var i = e.type, u = t.attributes; u.length; ) t.removeAttributeNode(u[0]);
        Pt(t, i, a), t[It] = e, t[le] = a;
      } catch (h) {
        ot(e, e.return, h);
      }
    }
    var xl = false, Nt = false, Yu = false, Og = typeof WeakSet == "function" ? WeakSet : Set, Bt = null;
    function qx(e, t) {
      if (e = e.containerInfo, id = vs, e = Gh(e), Nc(e)) {
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
            var x = 0, M = -1, z = -1, K = 0, ne = 0, ae = e, Z = null;
            t: for (; ; ) {
              for (var Q; ae !== a || u !== 0 && ae.nodeType !== 3 || (M = x + u), ae !== h || i !== 0 && ae.nodeType !== 3 || (z = x + i), ae.nodeType === 3 && (x += ae.nodeValue.length), (Q = ae.firstChild) !== null; ) Z = ae, ae = Q;
              for (; ; ) {
                if (ae === e) break t;
                if (Z === a && ++K === u && (M = x), Z === h && ++ne === i && (z = x), (Q = ae.nextSibling) !== null) break;
                ae = Z, Z = ae.parentNode;
              }
              ae = Q;
            }
            a = M === -1 || z === -1 ? null : {
              start: M,
              end: z
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
      }, vs = false, Bt = t; Bt !== null; ) if (t = Bt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, Bt = e;
      else for (; Bt !== null; ) {
        switch (t = Bt, h = t.alternate, e = t.flags, t.tag) {
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
                var Ce = Or(a.type, u);
                e = i.getSnapshotBeforeUpdate(Ce, h), i.__reactInternalSnapshotBeforeUpdate = e;
              } catch (Te) {
                ot(a, a.return, Te);
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
          e.return = t.return, Bt = e;
          break;
        }
        Bt = t.return;
      }
    }
    function Dg(e, t, a) {
      var i = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          Sl(e, a), i & 4 && go(5, a);
          break;
        case 1:
          if (Sl(e, a), i & 4) if (e = a.stateNode, t === null) try {
            e.componentDidMount();
          } catch (x) {
            ot(a, a.return, x);
          }
          else {
            var u = Or(a.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(u, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (x) {
              ot(a, a.return, x);
            }
          }
          i & 64 && Lg(a), i & 512 && po(a, a.return);
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
              vm(e, t);
            } catch (x) {
              ot(a, a.return, x);
            }
          }
          break;
        case 27:
          t === null && i & 4 && Ng(a);
        case 26:
        case 5:
          Sl(e, a), t === null && i & 4 && Ag(a), i & 512 && po(a, a.return);
          break;
        case 12:
          Sl(e, a);
          break;
        case 31:
          Sl(e, a), i & 4 && Hg(e, a);
          break;
        case 13:
          Sl(e, a), i & 4 && Ug(e, a), i & 64 && (e = a.memoizedState, e !== null && (e = e.dehydrated, e !== null && (a = ew.bind(null, a), xw(e, a))));
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
    function Ig(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Ig(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && dt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
    }
    var xt = null, on = false;
    function wl(e, t, a) {
      for (a = a.child; a !== null; ) zg(e, t, a), a = a.sibling;
    }
    function zg(e, t, a) {
      if (Wt && typeof Wt.onCommitFiberUnmount == "function") try {
        Wt.onCommitFiberUnmount(Tl, a);
      } catch {
      }
      switch (a.tag) {
        case 26:
          Nt || nl(a, t), wl(e, t, a), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
          break;
        case 27:
          Nt || nl(a, t);
          var i = xt, u = on;
          er(a.type) && (xt = a.stateNode, on = false), wl(e, t, a), _o(a.stateNode), xt = i, on = u;
          break;
        case 5:
          Nt || nl(a, t);
        case 6:
          if (i = xt, u = on, xt = null, wl(e, t, a), xt = i, on = u, xt !== null) if (on) try {
            (xt.nodeType === 9 ? xt.body : xt.nodeName === "HTML" ? xt.ownerDocument.body : xt).removeChild(a.stateNode);
          } catch (h) {
            ot(a, t, h);
          }
          else try {
            xt.removeChild(a.stateNode);
          } catch (h) {
            ot(a, t, h);
          }
          break;
        case 18:
          xt !== null && (on ? (e = xt, Lp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, a.stateNode), ja(e)) : Lp(xt, a.stateNode));
          break;
        case 4:
          i = xt, u = on, xt = a.stateNode.containerInfo, on = true, wl(e, t, a), xt = i, on = u;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          Pl(2, a, t), Nt || Pl(4, a, t), wl(e, t, a);
          break;
        case 1:
          Nt || (nl(a, t), i = a.stateNode, typeof i.componentWillUnmount == "function" && Rg(a, t, i)), wl(e, t, a);
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
    function Hg(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
        e = e.dehydrated;
        try {
          ja(e);
        } catch (a) {
          ot(t, t.return, a);
        }
      }
    }
    function Ug(e, t) {
      if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
        ja(e);
      } catch (a) {
        ot(t, t.return, a);
      }
    }
    function Gx(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return t === null && (t = e.stateNode = new Og()), t;
        case 22:
          return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Og()), t;
        default:
          throw Error(o(435, e.tag));
      }
    }
    function Ji(e, t) {
      var a = Gx(e);
      t.forEach(function(i) {
        if (!a.has(i)) {
          a.add(i);
          var u = tw.bind(null, e, i);
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
                xt = M.stateNode, on = false;
                break e;
              }
              break;
            case 5:
              xt = M.stateNode, on = false;
              break e;
            case 3:
            case 4:
              xt = M.stateNode.containerInfo, on = true;
              break e;
          }
          M = M.return;
        }
        if (xt === null) throw Error(o(160));
        zg(h, x, u), xt = null, on = false, h = u.alternate, h !== null && (h.return = null), u.return = null;
      }
      if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) Yg(t, e), t = t.sibling;
    }
    var Yn = null;
    function Yg(e, t) {
      var a = e.alternate, i = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          sn(t, e), cn(e), i & 4 && (Pl(3, e, e.return), go(3, e), Pl(5, e, e.return));
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
                    h = u.getElementsByTagName("title")[0], (!h || h[nt] || h[It] || h.namespaceURI === "http://www.w3.org/2000/svg" || h.hasAttribute("itemprop")) && (h = u.createElement(i), u.head.insertBefore(h, u.querySelector("head > title"))), Pt(h, i, a), h[It] = e, rt(h), i = h;
                    break e;
                  case "link":
                    var x = Yp("link", "href", u).get(i + (a.href || ""));
                    if (x) {
                      for (var M = 0; M < x.length; M++) if (h = x[M], h.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && h.getAttribute("rel") === (a.rel == null ? null : a.rel) && h.getAttribute("title") === (a.title == null ? null : a.title) && h.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                        x.splice(M, 1);
                        break t;
                      }
                    }
                    h = u.createElement(i), Pt(h, i, a), u.head.appendChild(h);
                    break;
                  case "meta":
                    if (x = Yp("meta", "content", u).get(i + (a.content || ""))) {
                      for (M = 0; M < x.length; M++) if (h = x[M], h.getAttribute("content") === (a.content == null ? null : "" + a.content) && h.getAttribute("name") === (a.name == null ? null : a.name) && h.getAttribute("property") === (a.property == null ? null : a.property) && h.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && h.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                        x.splice(M, 1);
                        break t;
                      }
                    }
                    h = u.createElement(i), Pt(h, i, a), u.head.appendChild(h);
                    break;
                  default:
                    throw Error(o(468, i));
                }
                h[It] = e, rt(h), i = h;
              }
              e.stateNode = i;
            } else Bp(u, e.type, e.stateNode);
            else e.stateNode = Up(u, i, e.memoizedProps);
            else h !== i ? (h === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : h.count--, i === null ? Bp(u, e.type, e.stateNode) : Up(u, i, e.memoizedProps)) : i === null && e.stateNode !== null && zu(e, e.memoizedProps, a.memoizedProps);
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
            } catch (Ce) {
              ot(e, e.return, Ce);
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
            } catch (Ce) {
              ot(e, e.return, Ce);
            }
          }
          break;
        case 3:
          if (gs = null, u = Yn, Yn = hs(t.containerInfo), sn(t, e), Yn = u, cn(e), i & 4 && a !== null && a.memoizedState.isDehydrated) try {
            ja(t.containerInfo);
          } catch (Ce) {
            ot(e, e.return, Ce);
          }
          Yu && (Yu = false, Bg(e));
          break;
        case 4:
          i = Yn, Yn = hs(e.stateNode.containerInfo), sn(t, e), cn(e), Yn = i;
          break;
        case 12:
          sn(t, e), cn(e);
          break;
        case 31:
          sn(t, e), cn(e), i & 4 && (i = e.updateQueue, i !== null && (e.updateQueue = null, Ji(e, i)));
          break;
        case 13:
          sn(t, e), cn(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (ts = jt()), i & 4 && (i = e.updateQueue, i !== null && (e.updateQueue = null, Ji(e, i)));
          break;
        case 22:
          u = e.memoizedState !== null;
          var z = a !== null && a.memoizedState !== null, K = xl, ne = Nt;
          if (xl = K || u, Nt = ne || z, sn(t, e), Nt = ne, xl = K, cn(e), i & 8192) e: for (t = e.stateNode, t._visibility = u ? t._visibility & -2 : t._visibility | 1, u && (a === null || z || xl || Nt || Dr(e)), a = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                z = a = t;
                try {
                  if (h = z.stateNode, u) x = h.style, typeof x.setProperty == "function" ? x.setProperty("display", "none", "important") : x.display = "none";
                  else {
                    M = z.stateNode;
                    var ae = z.memoizedProps.style, Z = ae != null && ae.hasOwnProperty("display") ? ae.display : null;
                    M.style.display = Z == null || typeof Z == "boolean" ? "" : ("" + Z).trim();
                  }
                } catch (Ce) {
                  ot(z, z.return, Ce);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                z = t;
                try {
                  z.stateNode.nodeValue = u ? "" : z.memoizedProps;
                } catch (Ce) {
                  ot(z, z.return, Ce);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                z = t;
                try {
                  var Q = z.stateNode;
                  u ? Rp(Q, true) : Rp(z.stateNode, false);
                } catch (Ce) {
                  ot(z, z.return, Ce);
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
          i & 4 && (i = e.updateQueue, i !== null && (a = i.retryQueue, a !== null && (i.retryQueue = null, Ji(e, a))));
          break;
        case 19:
          sn(t, e), cn(e), i & 4 && (i = e.updateQueue, i !== null && (e.updateQueue = null, Ji(e, i)));
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
            if (Tg(i)) {
              a = i;
              break;
            }
            i = i.return;
          }
          if (a == null) throw Error(o(160));
          switch (a.tag) {
            case 27:
              var u = a.stateNode, h = Hu(e);
              Wi(e, h, u);
              break;
            case 5:
              var x = a.stateNode;
              a.flags & 32 && (Qr(x, ""), a.flags &= -33);
              var M = Hu(e);
              Wi(e, M, x);
              break;
            case 3:
            case 4:
              var z = a.stateNode.containerInfo, K = Hu(e);
              Uu(e, K, z);
              break;
            default:
              throw Error(o(161));
          }
        } catch (ne) {
          ot(e, e.return, ne);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function Bg(e) {
      if (e.subtreeFlags & 1024) for (e = e.child; e !== null; ) {
        var t = e;
        Bg(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
    }
    function Sl(e, t) {
      if (t.subtreeFlags & 8772) for (t = t.child; t !== null; ) Dg(e, t.alternate, t), t = t.sibling;
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
            typeof a.componentWillUnmount == "function" && Rg(t, t.return, a), Dr(t);
            break;
          case 27:
            _o(t.stateNode);
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
            Cl(u, h, a), go(4, h);
            break;
          case 1:
            if (Cl(u, h, a), i = h, u = i.stateNode, typeof u.componentDidMount == "function") try {
              u.componentDidMount();
            } catch (K) {
              ot(i, i.return, K);
            }
            if (i = h, u = i.updateQueue, u !== null) {
              var M = i.stateNode;
              try {
                var z = u.shared.hiddenCallbacks;
                if (z !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < z.length; u++) bm(z[u], M);
              } catch (K) {
                ot(i, i.return, K);
              }
            }
            a && x & 64 && Lg(h), po(h, h.return);
            break;
          case 27:
            Ng(h);
          case 26:
          case 5:
            Cl(u, h, a), a && i === null && x & 4 && Ag(h), po(h, h.return);
            break;
          case 12:
            Cl(u, h, a);
            break;
          case 31:
            Cl(u, h, a), a && x & 4 && Hg(u, h);
            break;
          case 13:
            Cl(u, h, a), a && x & 4 && Ug(u, h);
            break;
          case 22:
            h.memoizedState === null && Cl(u, h, a), po(h, h.return);
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
      e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (e != null && e.refCount++, a != null && to(a));
    }
    function Xu(e, t) {
      e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && to(e));
    }
    function Bn(e, t, a, i) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) Xg(e, t, a, i), t = t.sibling;
    }
    function Xg(e, t, a, i) {
      var u = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Bn(e, t, a, i), u & 2048 && go(9, t);
          break;
        case 1:
          Bn(e, t, a, i);
          break;
        case 3:
          Bn(e, t, a, i), u & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && to(e)));
          break;
        case 12:
          if (u & 2048) {
            Bn(e, t, a, i), e = t.stateNode;
            try {
              var h = t.memoizedProps, x = h.id, M = h.onPostCommit;
              typeof M == "function" && M(x, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
            } catch (z) {
              ot(t, t.return, z);
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
          h = t.stateNode, x = t.alternate, t.memoizedState !== null ? h._visibility & 2 ? Bn(e, t, a, i) : yo(e, t) : h._visibility & 2 ? Bn(e, t, a, i) : (h._visibility |= 2, ya(e, t, a, i, (t.subtreeFlags & 10256) !== 0 || false)), u & 2048 && Bu(x, t);
          break;
        case 24:
          Bn(e, t, a, i), u & 2048 && Xu(t.alternate, t);
          break;
        default:
          Bn(e, t, a, i);
      }
    }
    function ya(e, t, a, i, u) {
      for (u = u && ((t.subtreeFlags & 10256) !== 0 || false), t = t.child; t !== null; ) {
        var h = e, x = t, M = a, z = i, K = x.flags;
        switch (x.tag) {
          case 0:
          case 11:
          case 15:
            ya(h, x, M, z, u), go(8, x);
            break;
          case 23:
            break;
          case 22:
            var ne = x.stateNode;
            x.memoizedState !== null ? ne._visibility & 2 ? ya(h, x, M, z, u) : yo(h, x) : (ne._visibility |= 2, ya(h, x, M, z, u)), u && K & 2048 && Bu(x.alternate, x);
            break;
          case 24:
            ya(h, x, M, z, u), u && K & 2048 && Xu(x.alternate, x);
            break;
          default:
            ya(h, x, M, z, u);
        }
        t = t.sibling;
      }
    }
    function yo(e, t) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) {
        var a = e, i = t, u = i.flags;
        switch (i.tag) {
          case 22:
            yo(a, i), u & 2048 && Bu(i.alternate, i);
            break;
          case 24:
            yo(a, i), u & 2048 && Xu(i.alternate, i);
            break;
          default:
            yo(a, i);
        }
        t = t.sibling;
      }
    }
    var bo = 8192;
    function ba(e, t, a) {
      if (e.subtreeFlags & bo) for (e = e.child; e !== null; ) Vg(e, t, a), e = e.sibling;
    }
    function Vg(e, t, a) {
      switch (e.tag) {
        case 26:
          ba(e, t, a), e.flags & bo && e.memoizedState !== null && Tw(a, Yn, e.memoizedState, e.memoizedProps);
          break;
        case 5:
          ba(e, t, a);
          break;
        case 3:
        case 4:
          var i = Yn;
          Yn = hs(e.stateNode.containerInfo), ba(e, t, a), Yn = i;
          break;
        case 22:
          e.memoizedState === null && (i = e.alternate, i !== null && i.memoizedState !== null ? (i = bo, bo = 16777216, ba(e, t, a), bo = i) : ba(e, t, a));
          break;
        default:
          ba(e, t, a);
      }
    }
    function $g(e) {
      var t = e.alternate;
      if (t !== null && (e = t.child, e !== null)) {
        t.child = null;
        do
          t = e.sibling, e.sibling = null, e = t;
        while (e !== null);
      }
    }
    function vo(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var a = 0; a < t.length; a++) {
          var i = t[a];
          Bt = i, Gg(i, e);
        }
        $g(e);
      }
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) qg(e), e = e.sibling;
    }
    function qg(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          vo(e), e.flags & 2048 && Pl(9, e, e.return);
          break;
        case 3:
          vo(e);
          break;
        case 12:
          vo(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, es(e)) : vo(e);
          break;
        default:
          vo(e);
      }
    }
    function es(e) {
      var t = e.deletions;
      if ((e.flags & 16) !== 0) {
        if (t !== null) for (var a = 0; a < t.length; a++) {
          var i = t[a];
          Bt = i, Gg(i, e);
        }
        $g(e);
      }
      for (e = e.child; e !== null; ) {
        switch (t = e, t.tag) {
          case 0:
          case 11:
          case 15:
            Pl(8, t, t.return), es(t);
            break;
          case 22:
            a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, es(t));
            break;
          default:
            es(t);
        }
        e = e.sibling;
      }
    }
    function Gg(e, t) {
      for (; Bt !== null; ) {
        var a = Bt;
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
            to(a.memoizedState.cache);
        }
        if (i = a.child, i !== null) i.return = a, Bt = i;
        else e: for (a = e; Bt !== null; ) {
          i = Bt;
          var u = i.sibling, h = i.return;
          if (Ig(i), i === a) {
            Bt = null;
            break e;
          }
          if (u !== null) {
            u.return = h, Bt = u;
            break e;
          }
          Bt = h;
        }
      }
    }
    var Px = {
      getCacheForType: function(e) {
        var t = qt(Rt), a = t.data.get(e);
        return a === void 0 && (a = e(), t.data.set(e, a)), a;
      },
      cacheSignal: function() {
        return qt(Rt).controller.signal;
      }
    }, Kx = typeof WeakMap == "function" ? WeakMap : Map, tt = 0, ft = null, Be = null, Ge = 0, at = 0, vn = null, Kl = false, va = false, Vu = false, El = 0, Ct = 0, Zl = 0, Ir = 0, $u = 0, xn = 0, xa = 0, xo = null, un = null, qu = false, ts = 0, Pg = 0, ns = 1 / 0, ls = null, Fl = null, zt = 0, Ql = null, wa = null, _l = 0, Gu = 0, Pu = null, Kg = null, wo = 0, Ku = null;
    function wn() {
      return (tt & 2) !== 0 && Ge !== 0 ? Ge & -Ge : q.T !== null ? ed() : Fn();
    }
    function Zg() {
      if (xn === 0) if ((Ge & 536870912) === 0 || Ke) {
        var e = qr;
        qr <<= 1, (qr & 3932160) === 0 && (qr = 262144), xn = e;
      } else xn = 536870912;
      return e = yn.current, e !== null && (e.flags |= 32), xn;
    }
    function dn(e, t, a) {
      (e === ft && (at === 2 || at === 9) || e.cancelPendingCommit !== null) && (Sa(e, 0), Wl(e, Ge, xn, false)), br(e, a), ((tt & 2) === 0 || e !== ft) && (e === ft && ((tt & 2) === 0 && (Ir |= a), Ct === 4 && Wl(e, Ge, xn, false)), ll(e));
    }
    function Fg(e, t, a) {
      if ((tt & 6) !== 0) throw Error(o(327));
      var i = !a && (t & 127) === 0 && (t & e.expiredLanes) === 0 || sl(e, t), u = i ? Qx(e, t) : Fu(e, t, true), h = i;
      do {
        if (u === 0) {
          va && !i && Wl(e, t, 0, false);
          break;
        } else {
          if (a = e.current.alternate, h && !Zx(a)) {
            u = Fu(e, t, false), h = false;
            continue;
          }
          if (u === 2) {
            if (h = t, e.errorRecoveryDisabledLanes & h) var x = 0;
            else x = e.pendingLanes & -536870913, x = x !== 0 ? x : x & 536870912 ? 536870912 : 0;
            if (x !== 0) {
              t = x;
              e: {
                var M = e;
                u = xo;
                var z = M.current.memoizedState.isDehydrated;
                if (z && (Sa(M, x).flags |= 256), x = Fu(M, x, false), x !== 2) {
                  if (Vu && !z) {
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
            Sa(e, 0), Wl(e, t, 0, true);
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
                Wl(i, t, xn, !Kl);
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
            if ((t & 62914560) === t && (u = ts + 300 - jt(), 10 < u)) {
              if (Wl(i, t, xn, !Kl), Nl(i, 0, true) !== 0) break e;
              _l = t, i.timeoutHandle = Mp(Qg.bind(null, i, a, un, ls, qu, t, xn, Ir, xa, Kl, h, "Throttled", -0, 0), u);
              break e;
            }
            Qg(i, a, un, ls, qu, t, xn, Ir, xa, Kl, h, null, -0, 0);
          }
        }
        break;
      } while (true);
      ll(e);
    }
    function Qg(e, t, a, i, u, h, x, M, z, K, ne, ae, Z, Q) {
      if (e.timeoutHandle = -1, ae = t.subtreeFlags, ae & 8192 || (ae & 16785408) === 16785408) {
        ae = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: true,
          waitingForViewTransition: false,
          unsuspend: ul
        }, Vg(t, h, ae);
        var Ce = (h & 62914560) === h ? ts - jt() : (h & 4194048) === h ? Pg - jt() : 0;
        if (Ce = Nw(ae, Ce), Ce !== null) {
          _l = h, e.cancelPendingCommit = Ce(ap.bind(null, e, t, h, a, i, u, x, M, z, ne, ae, null, Z, Q)), Wl(e, h, x, !K);
          return;
        }
      }
      ap(e, t, h, a, i, u, x, M, z);
    }
    function Zx(e) {
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
        var h = 31 - Jt(u), x = 1 << h;
        i[h] = -1, u &= ~x;
      }
      a !== 0 && fi(e, a, t);
    }
    function rs() {
      return (tt & 6) === 0 ? (So(0), false) : true;
    }
    function Zu() {
      if (Be !== null) {
        if (at === 0) var e = Be.return;
        else e = Be, ml = Mr = null, du(e), fa = null, lo = 0, e = Be;
        for (; e !== null; ) jg(e.alternate, e), e = e.return;
        Be = null;
      }
    }
    function Sa(e, t) {
      var a = e.timeoutHandle;
      a !== -1 && (e.timeoutHandle = -1, gw(a)), a = e.cancelPendingCommit, a !== null && (e.cancelPendingCommit = null, a()), _l = 0, Zu(), ft = e, Be = a = fl(e.current, null), Ge = t, at = 0, vn = null, Kl = false, va = sl(e, t), Vu = false, xa = xn = $u = Ir = Zl = Ct = 0, un = xo = null, qu = false, (t & 8) !== 0 && (t |= t & 32);
      var i = e.entangledLanes;
      if (i !== 0) for (e = e.entanglements, i &= t; 0 < i; ) {
        var u = 31 - Jt(i), h = 1 << u;
        t |= e[u], i &= ~h;
      }
      return El = t, _i(), a;
    }
    function Wg(e, t) {
      He = null, q.H = fo, t === da || t === Ni ? (t = mm(), at = 3) : t === Jc ? (t = mm(), at = 4) : at = t === Mu ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, vn = t, Be === null && (Ct = 1, Pi(e, Mn(t, e.current)));
    }
    function Jg() {
      var e = yn.current;
      return e === null ? true : (Ge & 4194048) === Ge ? An === null : (Ge & 62914560) === Ge || (Ge & 536870912) !== 0 ? e === An : false;
    }
    function ep() {
      var e = q.H;
      return q.H = fo, e === null ? fo : e;
    }
    function tp() {
      var e = q.A;
      return q.A = Px, e;
    }
    function as() {
      Ct = 4, Kl || (Ge & 4194048) !== Ge && yn.current !== null || (va = true), (Zl & 134217727) === 0 && (Ir & 134217727) === 0 || ft === null || Wl(ft, Ge, xn, false);
    }
    function Fu(e, t, a) {
      var i = tt;
      tt |= 2;
      var u = ep(), h = tp();
      (ft !== e || Ge !== t) && (ls = null, Sa(e, t)), t = false;
      var x = Ct;
      e: do
        try {
          if (at !== 0 && Be !== null) {
            var M = Be, z = vn;
            switch (at) {
              case 8:
                Zu(), x = 6;
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                yn.current === null && (t = true);
                var K = at;
                if (at = 0, vn = null, Ca(e, M, z, K), a && va) {
                  x = 0;
                  break e;
                }
                break;
              default:
                K = at, at = 0, vn = null, Ca(e, M, z, K);
            }
          }
          Fx(), x = Ct;
          break;
        } catch (ne) {
          Wg(e, ne);
        }
      while (true);
      return t && e.shellSuspendCounter++, ml = Mr = null, tt = i, q.H = u, q.A = h, Be === null && (ft = null, Ge = 0, _i()), x;
    }
    function Fx() {
      for (; Be !== null; ) np(Be);
    }
    function Qx(e, t) {
      var a = tt;
      tt |= 2;
      var i = ep(), u = tp();
      ft !== e || Ge !== t ? (ls = null, ns = jt() + 500, Sa(e, t)) : va = sl(e, t);
      e: do
        try {
          if (at !== 0 && Be !== null) {
            t = Be;
            var h = vn;
            t: switch (at) {
              case 1:
                at = 0, vn = null, Ca(e, t, h, 1);
                break;
              case 2:
              case 9:
                if (fm(h)) {
                  at = 0, vn = null, lp(t);
                  break;
                }
                t = function() {
                  at !== 2 && at !== 9 || ft !== e || (at = 7), ll(e);
                }, h.then(t, t);
                break e;
              case 3:
                at = 7;
                break e;
              case 4:
                at = 5;
                break e;
              case 7:
                fm(h) ? (at = 0, vn = null, lp(t)) : (at = 0, vn = null, Ca(e, t, h, 7));
                break;
              case 5:
                var x = null;
                switch (Be.tag) {
                  case 26:
                    x = Be.memoizedState;
                  case 5:
                  case 27:
                    var M = Be;
                    if (x ? Xp(x) : M.stateNode.complete) {
                      at = 0, vn = null;
                      var z = M.sibling;
                      if (z !== null) Be = z;
                      else {
                        var K = M.return;
                        K !== null ? (Be = K, os(K)) : Be = null;
                      }
                      break t;
                    }
                }
                at = 0, vn = null, Ca(e, t, h, 5);
                break;
              case 6:
                at = 0, vn = null, Ca(e, t, h, 6);
                break;
              case 8:
                Zu(), Ct = 6;
                break e;
              default:
                throw Error(o(462));
            }
          }
          Wx();
          break;
        } catch (ne) {
          Wg(e, ne);
        }
      while (true);
      return ml = Mr = null, q.H = i, q.A = u, tt = a, Be !== null ? 0 : (ft = null, Ge = 0, _i(), Ct);
    }
    function Wx() {
      for (; Be !== null && !Ut(); ) np(Be);
    }
    function np(e) {
      var t = kg(e.alternate, e, El);
      e.memoizedProps = e.pendingProps, t === null ? os(e) : Be = t;
    }
    function lp(e) {
      var t = e, a = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = xg(a, t, t.pendingProps, t.type, void 0, Ge);
          break;
        case 11:
          t = xg(a, t, t.pendingProps, t.type.render, t.ref, Ge);
          break;
        case 5:
          du(t);
        default:
          jg(a, t), t = Be = tm(t, El), t = kg(a, t, El);
      }
      e.memoizedProps = e.pendingProps, t === null ? os(e) : Be = t;
    }
    function Ca(e, t, a, i) {
      ml = Mr = null, du(t), fa = null, lo = 0;
      var u = t.return;
      try {
        if (Yx(e, u, t, a, Ge)) {
          Ct = 1, Pi(e, Mn(a, e.current)), Be = null;
          return;
        }
      } catch (h) {
        if (u !== null) throw Be = u, h;
        Ct = 1, Pi(e, Mn(a, e.current)), Be = null;
        return;
      }
      t.flags & 32768 ? (Ke || i === 1 ? e = true : va || (Ge & 536870912) !== 0 ? e = false : (Kl = e = true, (i === 2 || i === 9 || i === 3 || i === 6) && (i = yn.current, i !== null && i.tag === 13 && (i.flags |= 16384))), rp(t, e)) : os(t);
    }
    function os(e) {
      var t = e;
      do {
        if ((t.flags & 32768) !== 0) {
          rp(t, Kl);
          return;
        }
        e = t.return;
        var a = Vx(t.alternate, t, El);
        if (a !== null) {
          Be = a;
          return;
        }
        if (t = t.sibling, t !== null) {
          Be = t;
          return;
        }
        Be = t = e;
      } while (t !== null);
      Ct === 0 && (Ct = 5);
    }
    function rp(e, t) {
      do {
        var a = $x(e.alternate, e);
        if (a !== null) {
          a.flags &= 32767, Be = a;
          return;
        }
        if (a = e.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (e = e.sibling, e !== null)) {
          Be = e;
          return;
        }
        Be = e = a;
      } while (e !== null);
      Ct = 6, Be = null;
    }
    function ap(e, t, a, i, u, h, x, M, z) {
      e.cancelPendingCommit = null;
      do
        is();
      while (zt !== 0);
      if ((tt & 6) !== 0) throw Error(o(327));
      if (t !== null) {
        if (t === e.current) throw Error(o(177));
        if (h = t.lanes | t.childLanes, h |= Hc, Kn(e, a, h, x, M, z), e === ft && (Be = ft = null, Ge = 0), wa = t, Ql = e, _l = a, Gu = h, Pu = u, Kg = i, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, nw($r, function() {
          return up(), null;
        })) : (e.callbackNode = null, e.callbackPriority = 0), i = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || i) {
          i = q.T, q.T = null, u = F.p, F.p = 2, x = tt, tt |= 4;
          try {
            qx(e, t, a);
          } finally {
            tt = x, F.p = u, q.T = i;
          }
        }
        zt = 1, op(), ip(), sp();
      }
    }
    function op() {
      if (zt === 1) {
        zt = 0;
        var e = Ql, t = wa, a = (t.flags & 13878) !== 0;
        if ((t.subtreeFlags & 13878) !== 0 || a) {
          a = q.T, q.T = null;
          var i = F.p;
          F.p = 2;
          var u = tt;
          tt |= 4;
          try {
            Yg(t, e);
            var h = sd, x = Gh(e.containerInfo), M = h.focusedElem, z = h.selectionRange;
            if (x !== M && M && M.ownerDocument && qh(M.ownerDocument.documentElement, M)) {
              if (z !== null && Nc(M)) {
                var K = z.start, ne = z.end;
                if (ne === void 0 && (ne = K), "selectionStart" in M) M.selectionStart = K, M.selectionEnd = Math.min(ne, M.value.length);
                else {
                  var ae = M.ownerDocument || document, Z = ae && ae.defaultView || window;
                  if (Z.getSelection) {
                    var Q = Z.getSelection(), Ce = M.textContent.length, Te = Math.min(z.start, Ce), ut = z.end === void 0 ? Te : Math.min(z.end, Ce);
                    !Q.extend && Te > ut && (x = ut, ut = Te, Te = x);
                    var V = $h(M, Te), Y = $h(M, ut);
                    if (V && Y && (Q.rangeCount !== 1 || Q.anchorNode !== V.node || Q.anchorOffset !== V.offset || Q.focusNode !== Y.node || Q.focusOffset !== Y.offset)) {
                      var P = ae.createRange();
                      P.setStart(V.node, V.offset), Q.removeAllRanges(), Te > ut ? (Q.addRange(P), Q.extend(Y.node, Y.offset)) : (P.setEnd(Y.node, Y.offset), Q.addRange(P));
                    }
                  }
                }
              }
              for (ae = [], Q = M; Q = Q.parentNode; ) Q.nodeType === 1 && ae.push({
                element: Q,
                left: Q.scrollLeft,
                top: Q.scrollTop
              });
              for (typeof M.focus == "function" && M.focus(), M = 0; M < ae.length; M++) {
                var re = ae[M];
                re.element.scrollLeft = re.left, re.element.scrollTop = re.top;
              }
            }
            vs = !!id, sd = id = null;
          } finally {
            tt = u, F.p = i, q.T = a;
          }
        }
        e.current = t, zt = 2;
      }
    }
    function ip() {
      if (zt === 2) {
        zt = 0;
        var e = Ql, t = wa, a = (t.flags & 8772) !== 0;
        if ((t.subtreeFlags & 8772) !== 0 || a) {
          a = q.T, q.T = null;
          var i = F.p;
          F.p = 2;
          var u = tt;
          tt |= 4;
          try {
            Dg(e, t.alternate, t);
          } finally {
            tt = u, F.p = i, q.T = a;
          }
        }
        zt = 3;
      }
    }
    function sp() {
      if (zt === 4 || zt === 3) {
        zt = 0, hn();
        var e = Ql, t = wa, a = _l, i = Kg;
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? zt = 5 : (zt = 0, wa = Ql = null, cp(e, e.pendingLanes));
        var u = e.pendingLanes;
        if (u === 0 && (Fl = null), Xa(a), t = t.stateNode, Wt && typeof Wt.onCommitFiberRoot == "function") try {
          Wt.onCommitFiberRoot(Tl, t, void 0, (t.current.flags & 128) === 128);
        } catch {
        }
        if (i !== null) {
          t = q.T, u = F.p, F.p = 2, q.T = null;
          try {
            for (var h = e.onRecoverableError, x = 0; x < i.length; x++) {
              var M = i[x];
              h(M.value, {
                componentStack: M.stack
              });
            }
          } finally {
            q.T = t, F.p = u;
          }
        }
        (_l & 3) !== 0 && is(), ll(e), u = e.pendingLanes, (a & 261930) !== 0 && (u & 42) !== 0 ? e === Ku ? wo++ : (wo = 0, Ku = e) : wo = 0, So(0);
      }
    }
    function cp(e, t) {
      (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, to(t)));
    }
    function is() {
      return op(), ip(), sp(), up();
    }
    function up() {
      if (zt !== 5) return false;
      var e = Ql, t = Gu;
      Gu = 0;
      var a = Xa(_l), i = q.T, u = F.p;
      try {
        F.p = 32 > a ? 32 : a, q.T = null, a = Pu, Pu = null;
        var h = Ql, x = _l;
        if (zt = 0, wa = Ql = null, _l = 0, (tt & 6) !== 0) throw Error(o(331));
        var M = tt;
        if (tt |= 4, qg(h.current), Xg(h, h.current, x, a), tt = M, So(0, false), Wt && typeof Wt.onPostCommitFiberRoot == "function") try {
          Wt.onPostCommitFiberRoot(Tl, h);
        } catch {
        }
        return true;
      } finally {
        F.p = u, q.T = i, cp(e, t);
      }
    }
    function dp(e, t, a) {
      t = Mn(a, t), t = ku(e.stateNode, t, 2), e = $l(e, t, 2), e !== null && (br(e, 2), ll(e));
    }
    function ot(e, t, a) {
      if (e.tag === 3) dp(e, e, a);
      else for (; t !== null; ) {
        if (t.tag === 3) {
          dp(t, e, a);
          break;
        } else if (t.tag === 1) {
          var i = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof i.componentDidCatch == "function" && (Fl === null || !Fl.has(i))) {
            e = Mn(a, e), a = fg(2), i = $l(t, a, 2), i !== null && (hg(a, i, t, e), br(i, 2), ll(i));
            break;
          }
        }
        t = t.return;
      }
    }
    function Qu(e, t, a) {
      var i = e.pingCache;
      if (i === null) {
        i = e.pingCache = new Kx();
        var u = /* @__PURE__ */ new Set();
        i.set(t, u);
      } else u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u));
      u.has(a) || (Vu = true, u.add(a), e = Jx.bind(null, e, t, a), t.then(e, e));
    }
    function Jx(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t), e.pingedLanes |= e.suspendedLanes & a, e.warmLanes &= ~a, ft === e && (Ge & a) === a && (Ct === 4 || Ct === 3 && (Ge & 62914560) === Ge && 300 > jt() - ts ? (tt & 2) === 0 && Sa(e, 0) : $u |= a, xa === Ge && (xa = 0)), ll(e);
    }
    function fp(e, t) {
      t === 0 && (t = Pr()), e = Er(e, t), e !== null && (br(e, t), ll(e));
    }
    function ew(e) {
      var t = e.memoizedState, a = 0;
      t !== null && (a = t.retryLane), fp(e, a);
    }
    function tw(e, t) {
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
      i !== null && i.delete(t), fp(e, a);
    }
    function nw(e, t) {
      return et(e, t);
    }
    var ss = null, Ea = null, Wu = false, cs = false, Ju = false, Jl = 0;
    function ll(e) {
      e !== Ea && e.next === null && (Ea === null ? ss = Ea = e : Ea = Ea.next = e), cs = true, Wu || (Wu = true, rw());
    }
    function So(e, t) {
      if (!Ju && cs) {
        Ju = true;
        do
          for (var a = false, i = ss; i !== null; ) {
            if (e !== 0) {
              var u = i.pendingLanes;
              if (u === 0) var h = 0;
              else {
                var x = i.suspendedLanes, M = i.pingedLanes;
                h = (1 << 31 - Jt(42 | e) + 1) - 1, h &= u & ~(x & ~M), h = h & 201326741 ? h & 201326741 | 1 : h ? h | 2 : 0;
              }
              h !== 0 && (a = true, pp(i, h));
            } else h = Ge, h = Nl(i, i === ft ? h : 0, i.cancelPendingCommit !== null || i.timeoutHandle !== -1), (h & 3) === 0 || sl(i, h) || (a = true, pp(i, h));
            i = i.next;
          }
        while (a);
        Ju = false;
      }
    }
    function lw() {
      hp();
    }
    function hp() {
      cs = Wu = false;
      var e = 0;
      Jl !== 0 && mw() && (e = Jl);
      for (var t = jt(), a = null, i = ss; i !== null; ) {
        var u = i.next, h = mp(i, t);
        h === 0 ? (i.next = null, a === null ? ss = u : a.next = u, u === null && (Ea = a)) : (a = i, (e !== 0 || (h & 3) !== 0) && (cs = true)), i = u;
      }
      zt !== 0 && zt !== 5 || So(e), Jl !== 0 && (Jl = 0);
    }
    function mp(e, t) {
      for (var a = e.suspendedLanes, i = e.pingedLanes, u = e.expirationTimes, h = e.pendingLanes & -62914561; 0 < h; ) {
        var x = 31 - Jt(h), M = 1 << x, z = u[x];
        z === -1 ? ((M & a) === 0 || (M & i) !== 0) && (u[x] = di(M, t)) : z <= t && (e.expiredLanes |= M), h &= ~M;
      }
      if (t = ft, a = Ge, a = Nl(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), i = e.callbackNode, a === 0 || e === t && (at === 2 || at === 9) || e.cancelPendingCommit !== null) return i !== null && i !== null && Fe(i), e.callbackNode = null, e.callbackPriority = 0;
      if ((a & 3) === 0 || sl(e, a)) {
        if (t = a & -a, t === e.callbackPriority) return t;
        switch (i !== null && Fe(i), Xa(a)) {
          case 2:
          case 8:
            a = Al;
            break;
          case 32:
            a = $r;
            break;
          case 268435456:
            a = Ba;
            break;
          default:
            a = $r;
        }
        return i = gp.bind(null, e), a = et(a, i), e.callbackPriority = t, e.callbackNode = a, t;
      }
      return i !== null && i !== null && Fe(i), e.callbackPriority = 2, e.callbackNode = null, 2;
    }
    function gp(e, t) {
      if (zt !== 0 && zt !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
      var a = e.callbackNode;
      if (is() && e.callbackNode !== a) return null;
      var i = Ge;
      return i = Nl(e, e === ft ? i : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), i === 0 ? null : (Fg(e, i, t), mp(e, jt()), e.callbackNode != null && e.callbackNode === a ? gp.bind(null, e) : null);
    }
    function pp(e, t) {
      if (is()) return null;
      Fg(e, t, true);
    }
    function rw() {
      pw(function() {
        (tt & 6) !== 0 ? et(Rl, lw) : hp();
      });
    }
    function ed() {
      if (Jl === 0) {
        var e = ca;
        e === 0 && (e = pr, pr <<= 1, (pr & 261888) === 0 && (pr = 256)), Jl = e;
      }
      return Jl;
    }
    function yp(e) {
      return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : yi("" + e);
    }
    function bp(e, t) {
      var a = t.ownerDocument.createElement("input");
      return a.name = t.name, a.value = t.value, e.id && a.setAttribute("form", e.id), t.parentNode.insertBefore(a, t), e = new FormData(e), a.parentNode.removeChild(a), e;
    }
    function aw(e, t, a, i, u) {
      if (t === "submit" && a && a.stateNode === u) {
        var h = yp((u[le] || null).action), x = i.submitter;
        x && (t = (t = x[le] || null) ? yp(t.formAction) : x.getAttribute("formAction"), t !== null && (h = t, x = null));
        var M = new wi("action", "action", null, i, u);
        e.push({
          event: M,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (i.defaultPrevented) {
                  if (Jl !== 0) {
                    var z = x ? bp(u, x) : new FormData(u);
                    xu(a, {
                      pending: true,
                      data: z,
                      method: u.method,
                      action: h
                    }, null, z);
                  }
                } else typeof h == "function" && (M.preventDefault(), z = x ? bp(u, x) : new FormData(u), xu(a, {
                  pending: true,
                  data: z,
                  method: u.method,
                  action: h
                }, h, z));
              },
              currentTarget: u
            }
          ]
        });
      }
    }
    for (var td = 0; td < zc.length; td++) {
      var nd = zc[td], ow = nd.toLowerCase(), iw = nd[0].toUpperCase() + nd.slice(1);
      Un(ow, "on" + iw);
    }
    Un(Zh, "onAnimationEnd"), Un(Fh, "onAnimationIteration"), Un(Qh, "onAnimationStart"), Un("dblclick", "onDoubleClick"), Un("focusin", "onFocus"), Un("focusout", "onBlur"), Un(Cx, "onTransitionRun"), Un(Ex, "onTransitionStart"), Un(_x, "onTransitionCancel"), Un(Wh, "onTransitionEnd"), Hn("onMouseEnter", [
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
    var Co = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), sw = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Co));
    function vp(e, t) {
      t = (t & 4) !== 0;
      for (var a = 0; a < e.length; a++) {
        var i = e[a], u = i.event;
        i = i.listeners;
        e: {
          var h = void 0;
          if (t) for (var x = i.length - 1; 0 <= x; x--) {
            var M = i[x], z = M.instance, K = M.currentTarget;
            if (M = M.listener, z !== h && u.isPropagationStopped()) break e;
            h = M, u.currentTarget = K;
            try {
              h(u);
            } catch (ne) {
              Ei(ne);
            }
            u.currentTarget = null, h = z;
          }
          else for (x = 0; x < i.length; x++) {
            if (M = i[x], z = M.instance, K = M.currentTarget, M = M.listener, z !== h && u.isPropagationStopped()) break e;
            h = M, u.currentTarget = K;
            try {
              h(u);
            } catch (ne) {
              Ei(ne);
            }
            u.currentTarget = null, h = z;
          }
        }
      }
    }
    function Xe(e, t) {
      var a = t[it];
      a === void 0 && (a = t[it] = /* @__PURE__ */ new Set());
      var i = e + "__bubble";
      a.has(i) || (xp(t, e, 2, false), a.add(i));
    }
    function ld(e, t, a) {
      var i = 0;
      t && (i |= 4), xp(a, e, i, t);
    }
    var us = "_reactListening" + Math.random().toString(36).slice(2);
    function rd(e) {
      if (!e[us]) {
        e[us] = true, Qn.forEach(function(a) {
          a !== "selectionchange" && (sw.has(a) || ld(a, false, e), ld(a, true, e));
        });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[us] || (t[us] = true, ld("selectionchange", false, t));
      }
    }
    function xp(e, t, a, i) {
      switch (Zp(t)) {
        case 2:
          var u = Iw;
          break;
        case 8:
          u = zw;
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
            var z = x.tag;
            if ((z === 3 || z === 4) && x.stateNode.containerInfo === u) return;
            x = x.return;
          }
          for (; M !== null; ) {
            if (x = Et(M), x === null) return;
            if (z = x.tag, z === 5 || z === 6 || z === 26 || z === 27) {
              i = h = x;
              continue e;
            }
            M = M.parentNode;
          }
        }
        i = i.return;
      }
      _h(function() {
        var K = h, ne = Sc(a), ae = [];
        e: {
          var Z = Jh.get(e);
          if (Z !== void 0) {
            var Q = wi, Ce = e;
            switch (e) {
              case "keypress":
                if (vi(a) === 0) break e;
              case "keydown":
              case "keyup":
                Q = tx;
                break;
              case "focusin":
                Ce = "focus", Q = jc;
                break;
              case "focusout":
                Ce = "blur", Q = jc;
                break;
              case "beforeblur":
              case "afterblur":
                Q = jc;
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
                Q = jh;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                Q = V1;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                Q = rx;
                break;
              case Zh:
              case Fh:
              case Qh:
                Q = G1;
                break;
              case Wh:
                Q = ox;
                break;
              case "scroll":
              case "scrollend":
                Q = B1;
                break;
              case "wheel":
                Q = sx;
                break;
              case "copy":
              case "cut":
              case "paste":
                Q = K1;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                Q = Rh;
                break;
              case "toggle":
              case "beforetoggle":
                Q = ux;
            }
            var Te = (t & 4) !== 0, ut = !Te && (e === "scroll" || e === "scrollend"), V = Te ? Z !== null ? Z + "Capture" : null : Z;
            Te = [];
            for (var Y = K, P; Y !== null; ) {
              var re = Y;
              if (P = re.stateNode, re = re.tag, re !== 5 && re !== 26 && re !== 27 || P === null || V === null || (re = $a(Y, V), re != null && Te.push(Eo(Y, re, P))), ut) break;
              Y = Y.return;
            }
            0 < Te.length && (Z = new Q(Z, Ce, null, a, ne), ae.push({
              event: Z,
              listeners: Te
            }));
          }
        }
        if ((t & 7) === 0) {
          e: {
            if (Z = e === "mouseover" || e === "pointerover", Q = e === "mouseout" || e === "pointerout", Z && a !== wc && (Ce = a.relatedTarget || a.fromElement) && (Et(Ce) || Ce[Oe])) break e;
            if ((Q || Z) && (Z = ne.window === ne ? ne : (Z = ne.ownerDocument) ? Z.defaultView || Z.parentWindow : window, Q ? (Ce = a.relatedTarget || a.toElement, Q = K, Ce = Ce ? Et(Ce) : null, Ce !== null && (ut = c(Ce), Te = Ce.tag, Ce !== ut || Te !== 5 && Te !== 27 && Te !== 6) && (Ce = null)) : (Q = null, Ce = K), Q !== Ce)) {
              if (Te = jh, re = "onMouseLeave", V = "onMouseEnter", Y = "mouse", (e === "pointerout" || e === "pointerover") && (Te = Rh, re = "onPointerLeave", V = "onPointerEnter", Y = "pointer"), ut = Q == null ? Z : Yt(Q), P = Ce == null ? Z : Yt(Ce), Z = new Te(re, Y + "leave", Q, a, ne), Z.target = ut, Z.relatedTarget = P, re = null, Et(ne) === K && (Te = new Te(V, Y + "enter", Ce, a, ne), Te.target = P, Te.relatedTarget = ut, re = Te), ut = re, Q && Ce) t: {
                for (Te = cw, V = Q, Y = Ce, P = 0, re = V; re; re = Te(re)) P++;
                re = 0;
                for (var Re = Y; Re; Re = Te(Re)) re++;
                for (; 0 < P - re; ) V = Te(V), P--;
                for (; 0 < re - P; ) Y = Te(Y), re--;
                for (; P--; ) {
                  if (V === Y || Y !== null && V === Y.alternate) {
                    Te = V;
                    break t;
                  }
                  V = Te(V), Y = Te(Y);
                }
                Te = null;
              }
              else Te = null;
              Q !== null && wp(ae, Z, Q, Te, false), Ce !== null && ut !== null && wp(ae, ut, Ce, Te, true);
            }
          }
          e: {
            if (Z = K ? Yt(K) : window, Q = Z.nodeName && Z.nodeName.toLowerCase(), Q === "select" || Q === "input" && Z.type === "file") var We = Hh;
            else if (Ih(Z)) if (Uh) We = xx;
            else {
              We = bx;
              var ke = yx;
            }
            else Q = Z.nodeName, !Q || Q.toLowerCase() !== "input" || Z.type !== "checkbox" && Z.type !== "radio" ? K && xc(K.elementType) && (We = Hh) : We = vx;
            if (We && (We = We(e, K))) {
              zh(ae, We, a, ne);
              break e;
            }
            ke && ke(e, Z, K), e === "focusout" && K && Z.type === "number" && K.memoizedProps.value != null && vc(Z, "number", Z.value);
          }
          switch (ke = K ? Yt(K) : window, e) {
            case "focusin":
              (Ih(ke) || ke.contentEditable === "true") && (ta = ke, Oc = K, Wa = null);
              break;
            case "focusout":
              Wa = Oc = ta = null;
              break;
            case "mousedown":
              Dc = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Dc = false, Ph(ae, a, ne);
              break;
            case "selectionchange":
              if (Sx) break;
            case "keydown":
            case "keyup":
              Ph(ae, a, ne);
          }
          var Ue;
          if (Rc) e: {
            switch (e) {
              case "compositionstart":
                var Pe = "onCompositionStart";
                break e;
              case "compositionend":
                Pe = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Pe = "onCompositionUpdate";
                break e;
            }
            Pe = void 0;
          }
          else ea ? Oh(e, a) && (Pe = "onCompositionEnd") : e === "keydown" && a.keyCode === 229 && (Pe = "onCompositionStart");
          Pe && (Ah && a.locale !== "ko" && (ea || Pe !== "onCompositionStart" ? Pe === "onCompositionEnd" && ea && (Ue = kh()) : (zl = ne, _c = "value" in zl ? zl.value : zl.textContent, ea = true)), ke = ds(K, Pe), 0 < ke.length && (Pe = new Lh(Pe, e, null, a, ne), ae.push({
            event: Pe,
            listeners: ke
          }), Ue ? Pe.data = Ue : (Ue = Dh(a), Ue !== null && (Pe.data = Ue)))), (Ue = fx ? hx(e, a) : mx(e, a)) && (Pe = ds(K, "onBeforeInput"), 0 < Pe.length && (ke = new Lh("onBeforeInput", "beforeinput", null, a, ne), ae.push({
            event: ke,
            listeners: Pe
          }), ke.data = Ue)), aw(ae, e, K, a, ne);
        }
        vp(ae, t);
      });
    }
    function Eo(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function ds(e, t) {
      for (var a = t + "Capture", i = []; e !== null; ) {
        var u = e, h = u.stateNode;
        if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || h === null || (u = $a(e, a), u != null && i.unshift(Eo(e, u, h)), u = $a(e, t), u != null && i.push(Eo(e, u, h))), e.tag === 3) return i;
        e = e.return;
      }
      return [];
    }
    function cw(e) {
      if (e === null) return null;
      do
        e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function wp(e, t, a, i, u) {
      for (var h = t._reactName, x = []; a !== null && a !== i; ) {
        var M = a, z = M.alternate, K = M.stateNode;
        if (M = M.tag, z !== null && z === i) break;
        M !== 5 && M !== 26 && M !== 27 || K === null || (z = K, u ? (K = $a(a, h), K != null && x.unshift(Eo(a, K, z))) : u || (K = $a(a, h), K != null && x.push(Eo(a, K, z)))), a = a.return;
      }
      x.length !== 0 && e.push({
        event: t,
        listeners: x
      });
    }
    var uw = /\r\n?/g, dw = /\u0000|\uFFFD/g;
    function Sp(e) {
      return (typeof e == "string" ? e : "" + e).replace(uw, `
`).replace(dw, "");
    }
    function Cp(e, t) {
      return t = Sp(t), Sp(e) === t;
    }
    function ct(e, t, a, i, u, h) {
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
          Ch(e, i, h);
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
          i = yi("" + i), e.setAttribute(a, i);
          break;
        case "action":
        case "formAction":
          if (typeof i == "function") {
            e.setAttribute(a, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
            break;
          } else typeof h == "function" && (a === "formAction" ? (t !== "input" && ct(e, t, "name", u.name, u, null), ct(e, t, "formEncType", u.formEncType, u, null), ct(e, t, "formMethod", u.formMethod, u, null), ct(e, t, "formTarget", u.formTarget, u, null)) : (ct(e, t, "encType", u.encType, u, null), ct(e, t, "method", u.method, u, null), ct(e, t, "target", u.target, u, null)));
          if (i == null || typeof i == "symbol" || typeof i == "boolean") {
            e.removeAttribute(a);
            break;
          }
          i = yi("" + i), e.setAttribute(a, i);
          break;
        case "onClick":
          i != null && (e.onclick = ul);
          break;
        case "onScroll":
          i != null && Xe("scroll", e);
          break;
        case "onScrollEnd":
          i != null && Xe("scrollend", e);
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
          a = yi("" + i), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a);
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
          Xe("beforetoggle", e), Xe("toggle", e), Jn(e, "popover", i);
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
          (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = U1.get(a) || a, Jn(e, a, i));
      }
    }
    function od(e, t, a, i, u, h) {
      switch (a) {
        case "style":
          Ch(e, i, h);
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
          i != null && Xe("scroll", e);
          break;
        case "onScrollEnd":
          i != null && Xe("scrollend", e);
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
            if (a[0] === "o" && a[1] === "n" && (u = a.endsWith("Capture"), t = a.slice(2, u ? a.length - 7 : void 0), h = e[le] || null, h = h != null ? h[a] : null, typeof h == "function" && e.removeEventListener(t, h, u), typeof i == "function")) {
              typeof h != "function" && h !== null && (a in e ? e[a] = null : e.hasAttribute(a) && e.removeAttribute(a)), e.addEventListener(t, i, u);
              break e;
            }
            a in e ? e[a] = i : i === true ? e.setAttribute(a, "") : Jn(e, a, i);
          }
      }
    }
    function Pt(e, t, a) {
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
          Xe("error", e), Xe("load", e);
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
                ct(e, t, h, x, a, null);
            }
          }
          u && ct(e, t, "srcSet", a.srcSet, a, null), i && ct(e, t, "src", a.src, a, null);
          return;
        case "input":
          Xe("invalid", e);
          var M = h = x = u = null, z = null, K = null;
          for (i in a) if (a.hasOwnProperty(i)) {
            var ne = a[i];
            if (ne != null) switch (i) {
              case "name":
                u = ne;
                break;
              case "type":
                x = ne;
                break;
              case "checked":
                z = ne;
                break;
              case "defaultChecked":
                K = ne;
                break;
              case "value":
                h = ne;
                break;
              case "defaultValue":
                M = ne;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (ne != null) throw Error(o(137, t));
                break;
              default:
                ct(e, t, i, ne, a, null);
            }
          }
          vh(e, h, M, z, K, x, u, false);
          return;
        case "select":
          Xe("invalid", e), i = x = h = null;
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
              ct(e, t, u, M, a, null);
          }
          t = h, a = x, e.multiple = !!i, t != null ? Fr(e, !!i, t, false) : a != null && Fr(e, !!i, a, true);
          return;
        case "textarea":
          Xe("invalid", e), h = u = i = null;
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
              ct(e, t, x, M, a, null);
          }
          wh(e, i, u, h);
          return;
        case "option":
          for (z in a) if (a.hasOwnProperty(z) && (i = a[z], i != null)) switch (z) {
            case "selected":
              e.selected = i && typeof i != "function" && typeof i != "symbol";
              break;
            default:
              ct(e, t, z, i, a, null);
          }
          return;
        case "dialog":
          Xe("beforetoggle", e), Xe("toggle", e), Xe("cancel", e), Xe("close", e);
          break;
        case "iframe":
        case "object":
          Xe("load", e);
          break;
        case "video":
        case "audio":
          for (i = 0; i < Co.length; i++) Xe(Co[i], e);
          break;
        case "image":
          Xe("error", e), Xe("load", e);
          break;
        case "details":
          Xe("toggle", e);
          break;
        case "embed":
        case "source":
        case "link":
          Xe("error", e), Xe("load", e);
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
          for (K in a) if (a.hasOwnProperty(K) && (i = a[K], i != null)) switch (K) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(o(137, t));
            default:
              ct(e, t, K, i, a, null);
          }
          return;
        default:
          if (xc(t)) {
            for (ne in a) a.hasOwnProperty(ne) && (i = a[ne], i !== void 0 && od(e, t, ne, i, a, void 0));
            return;
          }
      }
      for (M in a) a.hasOwnProperty(M) && (i = a[M], i != null && ct(e, t, M, i, a, null));
    }
    function fw(e, t, a, i) {
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
          var u = null, h = null, x = null, M = null, z = null, K = null, ne = null;
          for (Q in a) {
            var ae = a[Q];
            if (a.hasOwnProperty(Q) && ae != null) switch (Q) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                z = ae;
              default:
                i.hasOwnProperty(Q) || ct(e, t, Q, null, i, ae);
            }
          }
          for (var Z in i) {
            var Q = i[Z];
            if (ae = a[Z], i.hasOwnProperty(Z) && (Q != null || ae != null)) switch (Z) {
              case "type":
                h = Q;
                break;
              case "name":
                u = Q;
                break;
              case "checked":
                K = Q;
                break;
              case "defaultChecked":
                ne = Q;
                break;
              case "value":
                x = Q;
                break;
              case "defaultValue":
                M = Q;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (Q != null) throw Error(o(137, t));
                break;
              default:
                Q !== ae && ct(e, t, Z, Q, i, ae);
            }
          }
          bc(e, x, M, z, K, ne, h, u);
          return;
        case "select":
          Q = x = M = Z = null;
          for (h in a) if (z = a[h], a.hasOwnProperty(h) && z != null) switch (h) {
            case "value":
              break;
            case "multiple":
              Q = z;
            default:
              i.hasOwnProperty(h) || ct(e, t, h, null, i, z);
          }
          for (u in i) if (h = i[u], z = a[u], i.hasOwnProperty(u) && (h != null || z != null)) switch (u) {
            case "value":
              Z = h;
              break;
            case "defaultValue":
              M = h;
              break;
            case "multiple":
              x = h;
            default:
              h !== z && ct(e, t, u, h, i, z);
          }
          t = M, a = x, i = Q, Z != null ? Fr(e, !!a, Z, false) : !!i != !!a && (t != null ? Fr(e, !!a, t, true) : Fr(e, !!a, a ? [] : "", false));
          return;
        case "textarea":
          Q = Z = null;
          for (M in a) if (u = a[M], a.hasOwnProperty(M) && u != null && !i.hasOwnProperty(M)) switch (M) {
            case "value":
              break;
            case "children":
              break;
            default:
              ct(e, t, M, null, i, u);
          }
          for (x in i) if (u = i[x], h = a[x], i.hasOwnProperty(x) && (u != null || h != null)) switch (x) {
            case "value":
              Z = u;
              break;
            case "defaultValue":
              Q = u;
              break;
            case "children":
              break;
            case "dangerouslySetInnerHTML":
              if (u != null) throw Error(o(91));
              break;
            default:
              u !== h && ct(e, t, x, u, i, h);
          }
          xh(e, Z, Q);
          return;
        case "option":
          for (var Ce in a) if (Z = a[Ce], a.hasOwnProperty(Ce) && Z != null && !i.hasOwnProperty(Ce)) switch (Ce) {
            case "selected":
              e.selected = false;
              break;
            default:
              ct(e, t, Ce, null, i, Z);
          }
          for (z in i) if (Z = i[z], Q = a[z], i.hasOwnProperty(z) && Z !== Q && (Z != null || Q != null)) switch (z) {
            case "selected":
              e.selected = Z && typeof Z != "function" && typeof Z != "symbol";
              break;
            default:
              ct(e, t, z, Z, i, Q);
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
          for (var Te in a) Z = a[Te], a.hasOwnProperty(Te) && Z != null && !i.hasOwnProperty(Te) && ct(e, t, Te, null, i, Z);
          for (K in i) if (Z = i[K], Q = a[K], i.hasOwnProperty(K) && Z !== Q && (Z != null || Q != null)) switch (K) {
            case "children":
            case "dangerouslySetInnerHTML":
              if (Z != null) throw Error(o(137, t));
              break;
            default:
              ct(e, t, K, Z, i, Q);
          }
          return;
        default:
          if (xc(t)) {
            for (var ut in a) Z = a[ut], a.hasOwnProperty(ut) && Z !== void 0 && !i.hasOwnProperty(ut) && od(e, t, ut, void 0, i, Z);
            for (ne in i) Z = i[ne], Q = a[ne], !i.hasOwnProperty(ne) || Z === Q || Z === void 0 && Q === void 0 || od(e, t, ne, Z, i, Q);
            return;
          }
      }
      for (var V in a) Z = a[V], a.hasOwnProperty(V) && Z != null && !i.hasOwnProperty(V) && ct(e, t, V, null, i, Z);
      for (ae in i) Z = i[ae], Q = a[ae], !i.hasOwnProperty(ae) || Z === Q || Z == null && Q == null || ct(e, t, ae, Z, i, Q);
    }
    function Ep(e) {
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
    function hw() {
      if (typeof performance.getEntriesByType == "function") {
        for (var e = 0, t = 0, a = performance.getEntriesByType("resource"), i = 0; i < a.length; i++) {
          var u = a[i], h = u.transferSize, x = u.initiatorType, M = u.duration;
          if (h && M && Ep(x)) {
            for (x = 0, M = u.responseEnd, i += 1; i < a.length; i++) {
              var z = a[i], K = z.startTime;
              if (K > M) break;
              var ne = z.transferSize, ae = z.initiatorType;
              ne && Ep(ae) && (z = z.responseEnd, x += ne * (z < M ? 1 : (M - K) / (z - K)));
            }
            if (--i, t += 8 * (h + x) / (u.duration / 1e3), e++, 10 < e) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
    }
    var id = null, sd = null;
    function fs(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function _p(e) {
      switch (e) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function kp(e, t) {
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
    function mw() {
      var e = window.event;
      return e && e.type === "popstate" ? e === ud ? false : (ud = e, true) : (ud = null, false);
    }
    var Mp = typeof setTimeout == "function" ? setTimeout : void 0, gw = typeof clearTimeout == "function" ? clearTimeout : void 0, jp = typeof Promise == "function" ? Promise : void 0, pw = typeof queueMicrotask == "function" ? queueMicrotask : typeof jp < "u" ? function(e) {
      return jp.resolve(null).then(e).catch(yw);
    } : Mp;
    function yw(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function er(e) {
      return e === "head";
    }
    function Lp(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === 8) if (a = u.data, a === "/$" || a === "/&") {
          if (i === 0) {
            e.removeChild(u), ja(t);
            return;
          }
          i--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&") i++;
        else if (a === "html") _o(e.ownerDocument.documentElement);
        else if (a === "head") {
          a = e.ownerDocument.head, _o(a);
          for (var h = a.firstChild; h; ) {
            var x = h.nextSibling, M = h.nodeName;
            h[nt] || M === "SCRIPT" || M === "STYLE" || M === "LINK" && h.rel.toLowerCase() === "stylesheet" || a.removeChild(h), h = x;
          }
        } else a === "body" && _o(e.ownerDocument.body);
        a = u;
      } while (a);
      ja(t);
    }
    function Rp(e, t) {
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
            dd(a), dt(a);
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
    function bw(e, t, a, i) {
      for (; e.nodeType === 1; ) {
        var u = a;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!i && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
        } else if (i) {
          if (!e[nt]) switch (t) {
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
    function vw(e, t, a) {
      if (t === "") return null;
      for (; e.nodeType !== 3; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = Tn(e.nextSibling), e === null)) return null;
      return e;
    }
    function Ap(e, t) {
      for (; e.nodeType !== 8; ) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Tn(e.nextSibling), e === null)) return null;
      return e;
    }
    function fd(e) {
      return e.data === "$?" || e.data === "$~";
    }
    function hd(e) {
      return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
    }
    function xw(e, t) {
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
    function Tp(e) {
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
    function Np(e) {
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
    function Op(e, t, a) {
      switch (t = fs(a), e) {
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
    function _o(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      dt(e);
    }
    var Nn = /* @__PURE__ */ new Map(), Dp = /* @__PURE__ */ new Set();
    function hs(e) {
      return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
    }
    var kl = F.d;
    F.d = {
      f: ww,
      r: Sw,
      D: Cw,
      C: Ew,
      L: _w,
      m: kw,
      X: jw,
      S: Mw,
      M: Lw
    };
    function ww() {
      var e = kl.f(), t = rs();
      return e || t;
    }
    function Sw(e) {
      var t = Qe(e);
      t !== null && t.tag === 5 && t.type === "form" ? Wm(t) : kl.r(e);
    }
    var _a = typeof document > "u" ? null : document;
    function Ip(e, t, a) {
      var i = _a;
      if (i && typeof t == "string" && t) {
        var u = _n(t);
        u = 'link[rel="' + e + '"][href="' + u + '"]', typeof a == "string" && (u += '[crossorigin="' + a + '"]'), Dp.has(u) || (Dp.add(u), e = {
          rel: e,
          crossOrigin: a,
          href: t
        }, i.querySelector(u) === null && (t = i.createElement("link"), Pt(t, "link", e), rt(t), i.head.appendChild(t)));
      }
    }
    function Cw(e) {
      kl.D(e), Ip("dns-prefetch", e, null);
    }
    function Ew(e, t) {
      kl.C(e, t), Ip("preconnect", e, t);
    }
    function _w(e, t, a) {
      kl.L(e, t, a);
      var i = _a;
      if (i && e && t) {
        var u = 'link[rel="preload"][as="' + _n(t) + '"]';
        t === "image" && a && a.imageSrcSet ? (u += '[imagesrcset="' + _n(a.imageSrcSet) + '"]', typeof a.imageSizes == "string" && (u += '[imagesizes="' + _n(a.imageSizes) + '"]')) : u += '[href="' + _n(e) + '"]';
        var h = u;
        switch (t) {
          case "style":
            h = ka(e);
            break;
          case "script":
            h = Ma(e);
        }
        Nn.has(h) || (e = b({
          rel: "preload",
          href: t === "image" && a && a.imageSrcSet ? void 0 : e,
          as: t
        }, a), Nn.set(h, e), i.querySelector(u) !== null || t === "style" && i.querySelector(ko(h)) || t === "script" && i.querySelector(Mo(h)) || (t = i.createElement("link"), Pt(t, "link", e), rt(t), i.head.appendChild(t)));
      }
    }
    function kw(e, t) {
      kl.m(e, t);
      var a = _a;
      if (a && e) {
        var i = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + _n(i) + '"][href="' + _n(e) + '"]', h = u;
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            h = Ma(e);
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
              if (a.querySelector(Mo(h))) return;
          }
          i = a.createElement("link"), Pt(i, "link", e), rt(i), a.head.appendChild(i);
        }
      }
    }
    function Mw(e, t, a) {
      kl.S(e, t, a);
      var i = _a;
      if (i && e) {
        var u = Lt(i).hoistableStyles, h = ka(e);
        t = t || "default";
        var x = u.get(h);
        if (!x) {
          var M = {
            loading: 0,
            preload: null
          };
          if (x = i.querySelector(ko(h))) M.loading = 5;
          else {
            e = b({
              rel: "stylesheet",
              href: e,
              "data-precedence": t
            }, a), (a = Nn.get(h)) && gd(e, a);
            var z = x = i.createElement("link");
            rt(z), Pt(z, "link", e), z._p = new Promise(function(K, ne) {
              z.onload = K, z.onerror = ne;
            }), z.addEventListener("load", function() {
              M.loading |= 1;
            }), z.addEventListener("error", function() {
              M.loading |= 2;
            }), M.loading |= 4, ms(x, t, i);
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
    function jw(e, t) {
      kl.X(e, t);
      var a = _a;
      if (a && e) {
        var i = Lt(a).hoistableScripts, u = Ma(e), h = i.get(u);
        h || (h = a.querySelector(Mo(u)), h || (e = b({
          src: e,
          async: true
        }, t), (t = Nn.get(u)) && pd(e, t), h = a.createElement("script"), rt(h), Pt(h, "link", e), a.head.appendChild(h)), h = {
          type: "script",
          instance: h,
          count: 1,
          state: null
        }, i.set(u, h));
      }
    }
    function Lw(e, t) {
      kl.M(e, t);
      var a = _a;
      if (a && e) {
        var i = Lt(a).hoistableScripts, u = Ma(e), h = i.get(u);
        h || (h = a.querySelector(Mo(u)), h || (e = b({
          src: e,
          async: true,
          type: "module"
        }, t), (t = Nn.get(u)) && pd(e, t), h = a.createElement("script"), rt(h), Pt(h, "link", e), a.head.appendChild(h)), h = {
          type: "script",
          instance: h,
          count: 1,
          state: null
        }, i.set(u, h));
      }
    }
    function zp(e, t, a, i) {
      var u = (u = ie.current) ? hs(u) : null;
      if (!u) throw Error(o(446));
      switch (e) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof a.precedence == "string" && typeof a.href == "string" ? (t = ka(a.href), a = Lt(u).hoistableStyles, i = a.get(t), i || (i = {
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
            e = ka(a.href);
            var h = Lt(u).hoistableStyles, x = h.get(e);
            if (x || (u = u.ownerDocument || u, x = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: {
                loading: 0,
                preload: null
              }
            }, h.set(e, x), (h = u.querySelector(ko(e))) && !h._p && (x.instance = h, x.state.loading = 5), Nn.has(e) || (a = {
              rel: "preload",
              as: "style",
              href: a.href,
              crossOrigin: a.crossOrigin,
              integrity: a.integrity,
              media: a.media,
              hrefLang: a.hrefLang,
              referrerPolicy: a.referrerPolicy
            }, Nn.set(e, a), h || Rw(u, e, a, x.state))), t && i === null) throw Error(o(528, ""));
            return x;
          }
          if (t && i !== null) throw Error(o(529, ""));
          return null;
        case "script":
          return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ma(a), a = Lt(u).hoistableScripts, i = a.get(t), i || (i = {
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
    function ka(e) {
      return 'href="' + _n(e) + '"';
    }
    function ko(e) {
      return 'link[rel="stylesheet"][' + e + "]";
    }
    function Hp(e) {
      return b({}, e, {
        "data-precedence": e.precedence,
        precedence: null
      });
    }
    function Rw(e, t, a, i) {
      e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? i.loading = 1 : (t = e.createElement("link"), i.preload = t, t.addEventListener("load", function() {
        return i.loading |= 1;
      }), t.addEventListener("error", function() {
        return i.loading |= 2;
      }), Pt(t, "link", a), rt(t), e.head.appendChild(t));
    }
    function Ma(e) {
      return '[src="' + _n(e) + '"]';
    }
    function Mo(e) {
      return "script[async]" + e;
    }
    function Up(e, t, a) {
      if (t.count++, t.instance === null) switch (t.type) {
        case "style":
          var i = e.querySelector('style[data-href~="' + _n(a.href) + '"]');
          if (i) return t.instance = i, rt(i), i;
          var u = b({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return i = (e.ownerDocument || e).createElement("style"), rt(i), Pt(i, "style", u), ms(i, a.precedence, e), t.instance = i;
        case "stylesheet":
          u = ka(a.href);
          var h = e.querySelector(ko(u));
          if (h) return t.state.loading |= 4, t.instance = h, rt(h), h;
          i = Hp(a), (u = Nn.get(u)) && gd(i, u), h = (e.ownerDocument || e).createElement("link"), rt(h);
          var x = h;
          return x._p = new Promise(function(M, z) {
            x.onload = M, x.onerror = z;
          }), Pt(h, "link", i), t.state.loading |= 4, ms(h, a.precedence, e), t.instance = h;
        case "script":
          return h = Ma(a.src), (u = e.querySelector(Mo(h))) ? (t.instance = u, rt(u), u) : (i = a, (u = Nn.get(h)) && (i = b({}, a), pd(i, u)), e = e.ownerDocument || e, u = e.createElement("script"), rt(u), Pt(u, "link", i), e.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
      else t.type === "stylesheet" && (t.state.loading & 4) === 0 && (i = t.instance, t.state.loading |= 4, ms(i, a.precedence, e));
      return t.instance;
    }
    function ms(e, t, a) {
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
    var gs = null;
    function Yp(e, t, a) {
      if (gs === null) {
        var i = /* @__PURE__ */ new Map(), u = gs = /* @__PURE__ */ new Map();
        u.set(a, i);
      } else u = gs, i = u.get(a), i || (i = /* @__PURE__ */ new Map(), u.set(a, i));
      if (i.has(e)) return i;
      for (i.set(e, null), a = a.getElementsByTagName(e), u = 0; u < a.length; u++) {
        var h = a[u];
        if (!(h[nt] || h[It] || e === "link" && h.getAttribute("rel") === "stylesheet") && h.namespaceURI !== "http://www.w3.org/2000/svg") {
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
    function Bp(e, t, a) {
      e = e.ownerDocument || e, e.head.insertBefore(a, t === "title" ? e.querySelector("head > title") : null);
    }
    function Aw(e, t, a) {
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
    function Xp(e) {
      return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
    }
    function Tw(e, t, a, i) {
      if (a.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== false) && (a.state.loading & 4) === 0) {
        if (a.instance === null) {
          var u = ka(i.href), h = t.querySelector(ko(u));
          if (h) {
            t = h._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = ps.bind(e), t.then(e, e)), a.state.loading |= 4, a.instance = h, rt(h);
            return;
          }
          h = t.ownerDocument || t, i = Hp(i), (u = Nn.get(u)) && gd(i, u), h = h.createElement("link"), rt(h);
          var x = h;
          x._p = new Promise(function(M, z) {
            x.onload = M, x.onerror = z;
          }), Pt(h, "link", i), a.instance = h;
        }
        e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (e.count++, a = ps.bind(e), t.addEventListener("load", a), t.addEventListener("error", a));
      }
    }
    var yd = 0;
    function Nw(e, t) {
      return e.stylesheets && e.count === 0 && bs(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(a) {
        var i = setTimeout(function() {
          if (e.stylesheets && bs(e, e.stylesheets), e.unsuspend) {
            var h = e.unsuspend;
            e.unsuspend = null, h();
          }
        }, 6e4 + t);
        0 < e.imgBytes && yd === 0 && (yd = 62500 * hw());
        var u = setTimeout(function() {
          if (e.waitingForImages = false, e.count === 0 && (e.stylesheets && bs(e, e.stylesheets), e.unsuspend)) {
            var h = e.unsuspend;
            e.unsuspend = null, h();
          }
        }, (e.imgBytes > yd ? 50 : 800) + t);
        return e.unsuspend = a, function() {
          e.unsuspend = null, clearTimeout(i), clearTimeout(u);
        };
      } : null;
    }
    function ps() {
      if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
        if (this.stylesheets) bs(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          this.unsuspend = null, e();
        }
      }
    }
    var ys = null;
    function bs(e, t) {
      e.stylesheets = null, e.unsuspend !== null && (e.count++, ys = /* @__PURE__ */ new Map(), t.forEach(Ow, e), ys = null, ps.call(e));
    }
    function Ow(e, t) {
      if (!(t.state.loading & 4)) {
        var a = ys.get(e);
        if (a) var i = a.get(null);
        else {
          a = /* @__PURE__ */ new Map(), ys.set(e, a);
          for (var u = e.querySelectorAll("link[data-precedence],style[data-precedence]"), h = 0; h < u.length; h++) {
            var x = u[h];
            (x.nodeName === "LINK" || x.getAttribute("media") !== "not all") && (a.set(x.dataset.precedence, x), i = x);
          }
          i && a.set(null, i);
        }
        u = t.instance, x = u.getAttribute("data-precedence"), h = a.get(x) || i, h === i && a.set(null, u), a.set(x, u), this.count++, i = ps.bind(this), u.addEventListener("load", i), u.addEventListener("error", i), h ? h.parentNode.insertBefore(u, h.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(u, e.firstChild)), t.state.loading |= 4;
      }
    }
    var jo = {
      $$typeof: A,
      Provider: null,
      Consumer: null,
      _currentValue: ce,
      _currentValue2: ce,
      _threadCount: 0
    };
    function Dw(e, t, a, i, u, h, x, M, z) {
      this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = yr(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = yr(0), this.hiddenUpdates = yr(null), this.identifierPrefix = i, this.onUncaughtError = u, this.onCaughtError = h, this.onRecoverableError = x, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = z, this.incompleteTransitions = /* @__PURE__ */ new Map();
    }
    function Vp(e, t, a, i, u, h, x, M, z, K, ne, ae) {
      return e = new Dw(e, t, a, x, z, K, ne, ae, M), t = 1, h === true && (t |= 24), h = pn(3, null, null, t), e.current = h, h.stateNode = e, t = Fc(), t.refCount++, e.pooledCache = t, t.refCount++, h.memoizedState = {
        element: i,
        isDehydrated: a,
        cache: t
      }, eu(h), e;
    }
    function $p(e) {
      return e ? (e = ra, e) : ra;
    }
    function qp(e, t, a, i, u, h) {
      u = $p(u), i.context === null ? i.context = u : i.pendingContext = u, i = Vl(t), i.payload = {
        element: a
      }, h = h === void 0 ? null : h, h !== null && (i.callback = h), a = $l(e, i, t), a !== null && (dn(a, e, t), ao(a, e, t));
    }
    function Gp(e, t) {
      if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
        var a = e.retryLane;
        e.retryLane = a !== 0 && a < t ? a : t;
      }
    }
    function bd(e, t) {
      Gp(e, t), (e = e.alternate) && Gp(e, t);
    }
    function Pp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = Er(e, 67108864);
        t !== null && dn(t, e, 67108864), bd(e, 67108864);
      }
    }
    function Kp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = wn();
        t = Zn(t);
        var a = Er(e, t);
        a !== null && dn(a, e, t), bd(e, t);
      }
    }
    var vs = true;
    function Iw(e, t, a, i) {
      var u = q.T;
      q.T = null;
      var h = F.p;
      try {
        F.p = 2, vd(e, t, a, i);
      } finally {
        F.p = h, q.T = u;
      }
    }
    function zw(e, t, a, i) {
      var u = q.T;
      q.T = null;
      var h = F.p;
      try {
        F.p = 8, vd(e, t, a, i);
      } finally {
        F.p = h, q.T = u;
      }
    }
    function vd(e, t, a, i) {
      if (vs) {
        var u = xd(i);
        if (u === null) ad(e, t, i, xs, a), Fp(e, i);
        else if (Uw(u, e, t, a, i)) i.stopPropagation();
        else if (Fp(e, i), t & 4 && -1 < Hw.indexOf(e)) {
          for (; u !== null; ) {
            var h = Qe(u);
            if (h !== null) switch (h.tag) {
              case 3:
                if (h = h.stateNode, h.current.memoizedState.isDehydrated) {
                  var x = En(h.pendingLanes);
                  if (x !== 0) {
                    var M = h;
                    for (M.pendingLanes |= 2, M.entangledLanes |= 2; x; ) {
                      var z = 1 << 31 - Jt(x);
                      M.entanglements[1] |= z, x &= ~z;
                    }
                    ll(h), (tt & 6) === 0 && (ns = jt() + 500, So(0));
                  }
                }
                break;
              case 31:
              case 13:
                M = Er(h, 2), M !== null && dn(M, h, 2), rs(), bd(h, 2);
            }
            if (h = xd(i), h === null && ad(e, t, i, xs, a), h === u) break;
            u = h;
          }
          u !== null && i.stopPropagation();
        } else ad(e, t, i, null, a);
      }
    }
    function xd(e) {
      return e = Sc(e), wd(e);
    }
    var xs = null;
    function wd(e) {
      if (xs = null, e = Et(e), e !== null) {
        var t = c(e);
        if (t === null) e = null;
        else {
          var a = t.tag;
          if (a === 13) {
            if (e = f(t), e !== null) return e;
            e = null;
          } else if (a === 31) {
            if (e = d(t), e !== null) return e;
            e = null;
          } else if (a === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return xs = e, null;
    }
    function Zp(e) {
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
            case $r:
            case gc:
              return 32;
            case Ba:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Sd = false, tr = null, nr = null, lr = null, Lo = /* @__PURE__ */ new Map(), Ro = /* @__PURE__ */ new Map(), rr = [], Hw = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function Fp(e, t) {
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
          Lo.delete(t.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Ro.delete(t.pointerId);
      }
    }
    function Ao(e, t, a, i, u, h) {
      return e === null || e.nativeEvent !== h ? (e = {
        blockedOn: t,
        domEventName: a,
        eventSystemFlags: i,
        nativeEvent: h,
        targetContainers: [
          u
        ]
      }, t !== null && (t = Qe(t), t !== null && Pp(t)), e) : (e.eventSystemFlags |= i, t = e.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), e);
    }
    function Uw(e, t, a, i, u) {
      switch (t) {
        case "focusin":
          return tr = Ao(tr, e, t, a, i, u), true;
        case "dragenter":
          return nr = Ao(nr, e, t, a, i, u), true;
        case "mouseover":
          return lr = Ao(lr, e, t, a, i, u), true;
        case "pointerover":
          var h = u.pointerId;
          return Lo.set(h, Ao(Lo.get(h) || null, e, t, a, i, u)), true;
        case "gotpointercapture":
          return h = u.pointerId, Ro.set(h, Ao(Ro.get(h) || null, e, t, a, i, u)), true;
      }
      return false;
    }
    function Qp(e) {
      var t = Et(e.target);
      if (t !== null) {
        var a = c(t);
        if (a !== null) {
          if (t = a.tag, t === 13) {
            if (t = f(a), t !== null) {
              e.blockedOn = t, vr(e.priority, function() {
                Kp(a);
              });
              return;
            }
          } else if (t === 31) {
            if (t = d(a), t !== null) {
              e.blockedOn = t, vr(e.priority, function() {
                Kp(a);
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
    function ws(e) {
      if (e.blockedOn !== null) return false;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var a = xd(e.nativeEvent);
        if (a === null) {
          a = e.nativeEvent;
          var i = new a.constructor(a.type, a);
          wc = i, a.target.dispatchEvent(i), wc = null;
        } else return t = Qe(a), t !== null && Pp(t), e.blockedOn = a, false;
        t.shift();
      }
      return true;
    }
    function Wp(e, t, a) {
      ws(e) && a.delete(t);
    }
    function Yw() {
      Sd = false, tr !== null && ws(tr) && (tr = null), nr !== null && ws(nr) && (nr = null), lr !== null && ws(lr) && (lr = null), Lo.forEach(Wp), Ro.forEach(Wp);
    }
    function Ss(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Sd || (Sd = true, l.unstable_scheduleCallback(l.unstable_NormalPriority, Yw)));
    }
    var Cs = null;
    function Jp(e) {
      Cs !== e && (Cs = e, l.unstable_scheduleCallback(l.unstable_NormalPriority, function() {
        Cs === e && (Cs = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t], i = e[t + 1], u = e[t + 2];
          if (typeof i != "function") {
            if (wd(i || a) === null) continue;
            break;
          }
          var h = Qe(a);
          h !== null && (e.splice(t, 3), t -= 3, xu(h, {
            pending: true,
            data: u,
            method: a.method,
            action: i
          }, i, u));
        }
      }));
    }
    function ja(e) {
      function t(z) {
        return Ss(z, e);
      }
      tr !== null && Ss(tr, e), nr !== null && Ss(nr, e), lr !== null && Ss(lr, e), Lo.forEach(t), Ro.forEach(t);
      for (var a = 0; a < rr.length; a++) {
        var i = rr[a];
        i.blockedOn === e && (i.blockedOn = null);
      }
      for (; 0 < rr.length && (a = rr[0], a.blockedOn === null); ) Qp(a), a.blockedOn === null && rr.shift();
      if (a = (e.ownerDocument || e).$$reactFormReplay, a != null) for (i = 0; i < a.length; i += 3) {
        var u = a[i], h = a[i + 1], x = u[le] || null;
        if (typeof h == "function") x || Jp(a);
        else if (x) {
          var M = null;
          if (h && h.hasAttribute("formAction")) {
            if (u = h, x = h[le] || null) M = x.formAction;
            else if (wd(u) !== null) continue;
          } else M = x.action;
          typeof M == "function" ? a[i + 1] = M : (a.splice(i, 3), i -= 3), Jp(a);
        }
      }
    }
    function ey() {
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
    Es.prototype.render = Cd.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null) throw Error(o(409));
      var a = t.current, i = wn();
      qp(a, i, e, t, null, null);
    }, Es.prototype.unmount = Cd.prototype.unmount = function() {
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        qp(e.current, 2, null, e, null, null), rs(), t[Oe] = null;
      }
    };
    function Es(e) {
      this._internalRoot = e;
    }
    Es.prototype.unstable_scheduleHydration = function(e) {
      if (e) {
        var t = Fn();
        e = {
          blockedOn: null,
          target: e,
          priority: t
        };
        for (var a = 0; a < rr.length && t !== 0 && t < rr[a].priority; a++) ;
        rr.splice(a, 0, e), a === 0 && Qp(e);
      }
    };
    var ty = n.version;
    if (ty !== "19.2.4") throw Error(o(527, ty, "19.2.4"));
    F.findDOMNode = function(e) {
      var t = e._reactInternals;
      if (t === void 0) throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
      return e = p(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
    };
    var Bw = {
      bundleType: 0,
      version: "19.2.4",
      rendererPackageName: "react-dom",
      currentDispatcherRef: q,
      reconcilerVersion: "19.2.4"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
      var _s = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!_s.isDisabled && _s.supportsFiber) try {
        Tl = _s.inject(Bw), Wt = _s;
      } catch {
      }
    }
    return No.createRoot = function(e, t) {
      if (!s(e)) throw Error(o(299));
      var a = false, i = "", u = sg, h = cg, x = ug;
      return t != null && (t.unstable_strictMode === true && (a = true), t.identifierPrefix !== void 0 && (i = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (h = t.onCaughtError), t.onRecoverableError !== void 0 && (x = t.onRecoverableError)), t = Vp(e, 1, false, null, null, a, i, null, u, h, x, ey), e[Oe] = t.current, rd(e), new Cd(t);
    }, No.hydrateRoot = function(e, t, a) {
      if (!s(e)) throw Error(o(299));
      var i = false, u = "", h = sg, x = cg, M = ug, z = null;
      return a != null && (a.unstable_strictMode === true && (i = true), a.identifierPrefix !== void 0 && (u = a.identifierPrefix), a.onUncaughtError !== void 0 && (h = a.onUncaughtError), a.onCaughtError !== void 0 && (x = a.onCaughtError), a.onRecoverableError !== void 0 && (M = a.onRecoverableError), a.formState !== void 0 && (z = a.formState)), t = Vp(e, 1, true, t, a ?? null, i, u, z, h, x, M, ey), t.context = $p(null), a = t.current, i = wn(), i = Zn(i), u = Vl(i), u.callback = null, $l(a, u, i), a = i, t.current.lanes = a, br(t, a), ll(t), e[Oe] = t.current, rd(e), new Es(t);
    }, No.version = "19.2.4", No;
  }
  var dy;
  function Qw() {
    if (dy) return kd.exports;
    dy = 1;
    function l() {
      if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (n) {
        console.error(n);
      }
    }
    return l(), kd.exports = Fw(), kd.exports;
  }
  var Ww = Qw();
  const Jw = "modulepreload", eS = function(l, n) {
    return new URL(l, n).href;
  }, fy = {}, ht = function(n, r, o) {
    let s = Promise.resolve();
    if (r && r.length > 0) {
      let f = function(v) {
        return Promise.all(v.map((b) => Promise.resolve(b).then((S) => ({
          status: "fulfilled",
          value: S
        }), (S) => ({
          status: "rejected",
          reason: S
        }))));
      };
      const d = document.getElementsByTagName("link"), m = document.querySelector("meta[property=csp-nonce]"), p = (m == null ? void 0 : m.nonce) || (m == null ? void 0 : m.getAttribute("nonce"));
      s = f(r.map((v) => {
        if (v = eS(v, o), v in fy) return;
        fy[v] = true;
        const b = v.endsWith(".css"), S = b ? '[rel="stylesheet"]' : "";
        if (!!o) for (let w = d.length - 1; w >= 0; w--) {
          const C = d[w];
          if (C.href === v && (!b || C.rel === "stylesheet")) return;
        }
        else if (document.querySelector(`link[href="${v}"]${S}`)) return;
        const k = document.createElement("link");
        if (k.rel = b ? "stylesheet" : Jw, b || (k.as = "script"), k.crossOrigin = "", k.href = v, p && k.setAttribute("nonce", p), document.head.appendChild(k), b) return new Promise((w, C) => {
          k.addEventListener("load", w), k.addEventListener("error", () => C(new Error(`Unable to preload CSS for ${v}`)));
        });
      }));
    }
    function c(f) {
      const d = new Event("vite:preloadError", {
        cancelable: true
      });
      if (d.payload = f, window.dispatchEvent(d), !d.defaultPrevented) throw f;
    }
    return s.then((f) => {
      for (const d of f || []) d.status === "rejected" && c(d.reason);
      return n().catch(c);
    });
  }, hy = (l) => {
    let n;
    const r = /* @__PURE__ */ new Set(), o = (p, v) => {
      const b = typeof p == "function" ? p(n) : p;
      if (!Object.is(b, n)) {
        const S = n;
        n = v ?? (typeof b != "object" || b === null) ? b : Object.assign({}, n, b), r.forEach((E) => E(n, S));
      }
    }, s = () => n, d = {
      setState: o,
      getState: s,
      getInitialState: () => m,
      subscribe: (p) => (r.add(p), () => r.delete(p))
    }, m = n = l(o, s, d);
    return d;
  }, tS = ((l) => l ? hy(l) : hy), nS = (l) => l;
  function lS(l, n = nS) {
    const r = Da.useSyncExternalStore(l.subscribe, Da.useCallback(() => n(l.getState()), [
      l,
      n
    ]), Da.useCallback(() => n(l.getInitialState()), [
      l,
      n
    ]));
    return Da.useDebugValue(r), r;
  }
  const my = (l) => {
    const n = tS(l), r = (o) => lS(n, o);
    return Object.assign(r, n), r;
  }, wt = ((l) => l ? my(l) : my);
  function rS(l, n) {
    let r;
    try {
      r = l();
    } catch {
      return;
    }
    return {
      getItem: (s) => {
        var c;
        const f = (m) => m === null ? null : JSON.parse(m, void 0), d = (c = r.getItem(s)) != null ? c : null;
        return d instanceof Promise ? d.then(f) : f(d);
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
  }, aS = (l, n) => (r, o, s) => {
    let c = {
      storage: rS(() => window.localStorage),
      partialize: (C) => C,
      version: 0,
      merge: (C, _) => ({
        ..._,
        ...C
      }),
      ...n
    }, f = false, d = 0;
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
    }, S = s.setState;
    s.setState = (C, _) => (S(C, _), b());
    const E = l((...C) => (r(...C), b()), o, s);
    s.getInitialState = () => E;
    let k;
    const w = () => {
      var C, _;
      if (!v) return;
      const T = ++d;
      f = false, m.forEach((j) => {
        var U;
        return j((U = o()) != null ? U : E);
      });
      const A = ((_ = c.onRehydrateStorage) == null ? void 0 : _.call(c, (C = o()) != null ? C : E)) || void 0;
      return Lf(v.getItem.bind(v))(c.name).then((j) => {
        if (j) if (typeof j.version == "number" && j.version !== c.version) {
          if (c.migrate) {
            const U = c.migrate(j.state, j.version);
            return U instanceof Promise ? U.then((N) => [
              true,
              N
            ]) : [
              true,
              U
            ];
          }
          console.error("State loaded from storage couldn't be migrated since no migrate function was provided");
        } else return [
          false,
          j.state
        ];
        return [
          false,
          void 0
        ];
      }).then((j) => {
        var U;
        if (T !== d) return;
        const [N, R] = j;
        if (k = c.merge(R, (U = o()) != null ? U : E), r(k, true), N) return b();
      }).then(() => {
        T === d && (A == null ? void 0 : A(o(), void 0), k = o(), f = true, p.forEach((j) => j(k)));
      }).catch((j) => {
        T === d && (A == null ? void 0 : A(void 0, j));
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
      onHydrate: (C) => (m.add(C), () => {
        m.delete(C);
      }),
      onFinishHydration: (C) => (p.add(C), () => {
        p.delete(C);
      })
    }, c.skipHydration || w(), k || E;
  }, Wf = aS, In = {
    dark: "#44ff44",
    light: "#44ff44"
  }, Qs = {
    dark: "#ffffff",
    light: "#000000"
  };
  function Rf() {
    return typeof window > "u" || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function gy(l) {
    return l === "system" ? Rf() : l;
  }
  const Xo = 288, Bs = 200, Xs = 480, pe = wt()(Wf((l, n) => ({
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
    explorerWidth: Xo,
    sidebarWidth: Xo,
    setThemeSetting: (r) => l({
      themeSetting: r,
      theme: gy(r)
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
      explorerWidth: Math.round(Math.max(Bs, Math.min(Xs, r)))
    }),
    setSidebarWidth: (r) => l({
      sidebarWidth: Math.round(Math.max(Bs, Math.min(Xs, r)))
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
        l.theme = gy(l.themeSetting);
        const n = (r) => Math.round(Math.max(Bs, Math.min(Xs, r)));
        l.explorerWidth = n(l.explorerWidth), l.sidebarWidth = n(l.sidebarWidth);
      }
    }
  }));
  typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    pe.getState().syncSystemTheme();
  });
  let Vo = null, Oo = null;
  async function oS() {
    if (Vo) return Vo;
    if (Oo) return Oo;
    Oo = (async () => {
      const l = await ht(() => import("./rosette_wasm-cIIIflpl.js"), [], import.meta.url);
      return await l.default(), Vo = l, l;
    })();
    try {
      return await Oo;
    } catch (l) {
      throw Oo = null, l;
    }
  }
  function qv() {
    const [l, n] = g.useState(Vo), [r, o] = g.useState(!Vo), [s, c] = g.useState(null), f = pe((d) => d.setWasmReady);
    return g.useEffect(() => {
      let d = true;
      return oS().then((m) => {
        d && (n(m), o(false), f(true));
      }).catch((m) => {
        console.error("Failed to load WASM module:", m), d && (c(m), o(false));
      }), () => {
        d = false;
      };
    }, [
      f
    ]), {
      wasm: l,
      isLoading: r,
      error: s,
      isReady: !!l && !r && !s
    };
  }
  const lc = 1.18, rc = 0.82, iS = 1.5, sS = 0.67, cS = 8, uS = 24, Gv = 100, dS = 200, py = 1e6, yy = 1e3, fS = [
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
  ], by = 0.1, Pv = 100, Kv = "'Source Code Pro', monospace", hS = 530, Jf = 0.72, Se = 50, Vs = Math.pow(2, -6), Rd = 1e-18, Ad = 3, ze = wt((l, n) => ({
    zoom: Vs,
    offset: {
      x: 0,
      y: 0
    },
    initialized: false,
    setZoom: (r) => l({
      zoom: Math.max(Rd, Math.min(Ad, r))
    }),
    zoomAt: (r, o, s) => {
      const c = n(), f = Math.max(Rd, Math.min(Ad, c.zoom * r)), d = (o - c.offset.x) / c.zoom, m = (s - c.offset.y) / c.zoom, p = o - d * f, v = s - m * f;
      l({
        zoom: f,
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
      zoom: Vs,
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
      const f = Math.abs(r.maxX - r.minX), d = Math.abs(r.maxY - r.minY), m = 1e3, p = Math.max(f, m), v = Math.max(d, m), b = p * by, S = v * by, E = p + b * 2, k = v + S * 2, w = (r.minX + r.maxX) / 2, C = (r.minY + r.maxY) / 2, _ = o / E, T = s / k, A = Math.max(Rd, Math.min(_, T, Ad)), j = c ? c.x : o / 2, U = c ? c.y : s / 2, N = {
        x: j - w * A,
        y: U - C * A
      };
      l({
        zoom: A,
        offset: N
      });
    },
    zoomToFit: (r, o, s, c) => {
      if (r) n().zoomToBounds(r, o, s, c);
      else {
        const f = c ? c.x : o / 2, d = c ? c.y : s / 2;
        l({
          zoom: Vs,
          offset: {
            x: f,
            y: d
          },
          initialized: true
        });
      }
    },
    zoomToSelected: (r, o, s, c) => {
      r && n().zoomToBounds(r, o, s, c);
    },
    centerOnBounds: (r, o, s, c) => {
      const f = n(), d = (r.minX + r.maxX) / 2, m = (r.minY + r.maxY) / 2, p = c ? c.x : o / 2, v = c ? c.y : s / 2, b = {
        x: p - d * f.zoom,
        y: v - m * f.zoom
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
    ze.subscribe(l), l(ze.getState());
  }
  function ks(l) {
    const n = l.replace("#", ""), r = Number.parseInt(n.slice(0, 2), 16) / 255, o = Number.parseInt(n.slice(2, 4), 16) / 255, s = Number.parseInt(n.slice(4, 6), 16) / 255;
    return [
      r,
      o,
      s,
      1
    ];
  }
  function mS(l) {
    const { wasm: n, isReady: r } = qv(), [o, s] = g.useState(null), [c, f] = g.useState(false), [d, m] = g.useState(null), p = g.useRef(null), v = pe((_) => _.theme), b = pe((_) => _.showGrid), { zoom: S, offset: E } = ze();
    g.useEffect(() => {
      if (!r || !n || !l) return;
      let _ = true;
      async function T() {
        try {
          const A = await n.WasmRenderer.create(l);
          if (!_) {
            A.destroy();
            return;
          }
          A.set_theme(v === "dark");
          const j = In[v], [U, N, R, O] = ks(j);
          A.set_selection_color(U, N, R, O);
          const H = Qs[v], [G, te, ee, fe] = ks(H);
          A.set_hover_color(G, te, ee, fe), A.set_dpr(window.devicePixelRatio || 1), p.current = A, s(A), f(true);
        } catch (A) {
          console.error("Failed to create renderer:", A), _ && m(A);
        }
      }
      return T(), () => {
        _ = false, p.current && (p.current.destroy(), p.current = null);
      };
    }, [
      r,
      n,
      l
    ]), g.useEffect(() => {
      if (o && c) {
        o.set_theme(v === "dark");
        const _ = In[v], [T, A, j, U] = ks(_);
        o.set_selection_color(T, A, j, U);
        const N = Qs[v], [R, O, H, G] = ks(N);
        o.set_hover_color(R, O, H, G);
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
    ]), w = g.useCallback((_, T) => {
      o && c && (o.set_dpr(window.devicePixelRatio || 1), o.resize(_, T));
    }, [
      o,
      c
    ]), C = g.useCallback((_, T) => {
      if (o && c) {
        const A = window.devicePixelRatio || 1, j = o.screen_to_world(_ * A, T * A);
        return {
          x: j[0],
          y: j[1]
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
      error: d,
      render: k,
      resize: w,
      screenToWorld: C
    };
  }
  const Xt = wt((l) => ({
    activeTool: "select",
    toolSetAt: 0,
    setTool: (n) => l({
      activeTool: n,
      toolSetAt: Date.now()
    })
  })), oe = wt((l) => ({
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
    removeFromSelection: (n) => oe.getState().deselect(n),
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
      const c = (s + 1) % n.length, f = n[c];
      return {
        selectedIds: /* @__PURE__ */ new Set([
          f
        ]),
        lastSelectedId: f
      };
    }),
    selectPrevious: (n) => l((r) => {
      if (n.length === 0) return r;
      if (r.selectedIds.size === 0) {
        const d = n[n.length - 1];
        return {
          selectedIds: /* @__PURE__ */ new Set([
            d
          ]),
          lastSelectedId: d
        };
      }
      const o = r.lastSelectedId ?? [
        ...r.selectedIds
      ][0], s = n.indexOf(o);
      if (s === -1) {
        const d = n[n.length - 1];
        return {
          selectedIds: /* @__PURE__ */ new Set([
            d
          ]),
          lastSelectedId: d
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
  })), ac = wt((l) => ({
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
  const Ne = wt((l, n) => ({
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
        const f = new Map(c.rulers);
        return f.set(o, s), {
          rulers: f,
          activeRulerId: o,
          previewEnd: r
        };
      }), o;
    },
    updatePreview: (r) => {
      const o = n();
      o.activeRulerId && l((s) => {
        const c = new Map(s.rulers), f = c.get(o.activeRulerId);
        return f && c.set(o.activeRulerId, {
          ...f,
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
      return l((f) => {
        const d = new Map(f.rulers);
        return d.set(o.activeRulerId, c), {
          rulers: d,
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
        const f = new Map(c.rulers), d = f.get(r);
        return d && f.set(r, {
          ...d,
          [o]: s
        }), {
          rulers: f
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
        for (const f of r) s.delete(f), c.delete(f);
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
      const f = c.get(o.rulerId);
      if (!f) return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), null;
      const d = f[o.endpoint], m = d.x !== s.x || d.y !== s.y;
      return l({
        draggingEndpoint: null,
        draggingEndpointOriginal: null
      }), m ? {
        rulerId: o.rulerId,
        endpoint: o.endpoint,
        oldPosition: s,
        newPosition: {
          ...d
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
      l((f) => {
        const d = new Map(f.rulers);
        for (const m of o.selectedRulerIds) {
          const p = d.get(m);
          p && d.set(m, {
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
          rulers: d,
          moveStartPoint: r
        };
      });
    },
    endMoveRuler: () => {
      const r = n(), { selectedRulerIds: o, moveStartPoint: s, moveOriginalPoint: c } = r;
      let f = null;
      if (s && c && o.size > 0) {
        const d = s.x - c.x, m = s.y - c.y;
        (d !== 0 || m !== 0) && (f = {
          rulerIds: [
            ...o
          ],
          deltaX: d,
          deltaY: m
        });
      }
      return l({
        isMovingRuler: false,
        moveStartPoint: null,
        moveOriginalPoint: null
      }), f;
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
      return l((f) => {
        const d = new Map(f.rulers);
        return d.set(s, c), {
          rulers: d
        };
      }), s;
    },
    restoreRulers: (r) => {
      const o = [];
      return l((s) => {
        const c = new Map(s.rulers);
        for (const f of r) {
          const d = Td();
          c.set(d, {
            ...f,
            id: d
          }), o.push(d);
        }
        return {
          rulers: c
        };
      }), o;
    },
    setSnapPoint: (r) => l({
      snapPoint: r
    })
  })), xe = wt((l) => ({
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
  function Zv(l) {
    const n = [
      l.name
    ];
    for (const r of l.children) n.push(...Zv(r));
    return n;
  }
  function gS(l) {
    const n = /* @__PURE__ */ new Set(), r = [];
    for (const o of l) for (const s of Zv(o)) n.has(s) || (n.add(s), r.push(s));
    return r;
  }
  function Fv(l) {
    const n = [];
    if (l.children.length > 0) {
      n.push(l.name);
      for (const r of l.children) n.push(...Fv(r));
    }
    return n;
  }
  function pS(l) {
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
  const he = wt()(Wf((l) => ({
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
    isFocused: false,
    focusedItem: null,
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
      var _a;
      const o = gS(n), s = pS(n), c = r.expandedCells.size === 0 ? new Set(n.flatMap(Fv)) : r.expandedCells, f = r.activeCell && o.includes(r.activeCell) ? r.activeCell : o[0] ?? null, d = ((_a = r.focusedItem) == null ? void 0 : _a.type) === "cell" && !o.includes(r.focusedItem.name) ? null : r.focusedItem;
      return {
        cellTree: n,
        cells: o,
        expandedCells: c,
        activeCell: f,
        focusedItem: d,
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
      var _a;
      const s = o.cells.map((m) => m === n ? r : m), c = o.activeCell === n ? r : o.activeCell, f = ((_a = o.focusedItem) == null ? void 0 : _a.type) === "cell" && o.focusedItem.name === n ? {
        type: "cell",
        name: r
      } : o.focusedItem, d = new Set(o.hiddenCells);
      return d.has(n) && (d.delete(n), d.add(r)), {
        cells: s,
        activeCell: c,
        focusedItem: f,
        hiddenCells: d
      };
    }),
    removeCell: (n) => l((r) => {
      var _a;
      const o = r.cells.filter((d) => d !== n), s = r.activeCell === n ? o[0] ?? null : r.activeCell, c = ((_a = r.focusedItem) == null ? void 0 : _a.type) === "cell" && r.focusedItem.name === n ? null : r.focusedItem, f = new Set(r.hiddenCells);
      return f.delete(n), {
        cells: o,
        activeCell: s,
        focusedItem: c,
        hiddenCells: f
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
    })),
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
      projectName: l.projectName
    })
  }));
  he.subscribe((l, n) => {
    l.projectName !== n.projectName && ht(async () => {
      const { useTabsStore: r } = await Promise.resolve().then(() => d0);
      return {
        useTabsStore: r
      };
    }, void 0, import.meta.url).then(({ useTabsStore: r }) => {
      const { activeTabId: o, getActiveTab: s, updateTab: c } = r.getState();
      if (!o) return;
      const f = s();
      f && !f.filePath && c(o, {
        title: l.projectName
      });
    });
  });
  const $s = wt((l) => ({
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
  function Yr(l) {
    return l.slice(eh.length);
  }
  function Jo(l) {
    return eh + l;
  }
  function Po(l, n) {
    const { images: r } = Ot.getState();
    let o = null, s = 1 / 0;
    for (const c of r.values()) if (l >= c.x && l <= c.x + c.width && n >= c.y && n <= c.y + c.height) {
      const f = c.width * c.height;
      f < s && (s = f, o = Jo(c.id));
    }
    return o;
  }
  function vy(l, n, r, o) {
    const { images: s } = Ot.getState(), c = [];
    for (const f of s.values()) {
      const d = f.x + f.width, m = f.y + f.height;
      f.x <= r && d >= l && f.y <= o && m >= n && c.push(Jo(f.id));
    }
    return c;
  }
  const Ot = wt((l, n) => ({
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
  const Dt = wt((l) => ({
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
  })), $n = wt((l) => ({
    isDirty: false,
    markDirty: () => l({
      isDirty: true
    }),
    markClean: () => l({
      isDirty: false
    })
  }));
  let Nd = null;
  function yS(l) {
    const n = (r) => {
      const o = r.useTabsStore.getState().activeTabId;
      o && r.useTabsStore.getState().updateTab(o, {
        isDirty: l
      });
    };
    Nd ? n(Nd) : ht(() => Promise.resolve().then(() => d0), void 0, import.meta.url).then((r) => {
      Nd = r, n(r);
    });
  }
  $n.subscribe((l, n) => {
    l.isDirty !== n.isDirty && yS(l.isDirty);
  });
  const xy = 100, de = wt((l, n) => ({
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
      xe.getState().bumpSyncGeneration(), $n.getState().markDirty(), l((s) => {
        const c = [
          ...s.undoStack,
          r
        ];
        return c.length > xy && c.shift(), {
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
      xe.getState().bumpSyncGeneration(), $n.getState().markDirty(), l((c) => {
        const f = c.undoStack.slice(0, -1), d = [
          ...c.redoStack,
          s
        ];
        return {
          undoStack: f,
          redoStack: d,
          canUndo: f.length > 0,
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
      xe.getState().bumpSyncGeneration(), $n.getState().markDirty(), l((c) => {
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
    pushCommand: (r) => {
      $n.getState().markDirty(), l((o) => {
        const s = [
          ...o.undoStack,
          r
        ];
        return s.length > xy && s.shift(), {
          undoStack: s,
          redoStack: [],
          canUndo: true,
          canRedo: false
        };
      });
    }
  })), zn = wt((l) => ({
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
  }, $o = [
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
  ], Tf = 999, Ws = [
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
  ], ye = wt((l, n) => ({
    layers: new Map(Ws.map((r) => [
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
      const s = new Map(o.layers);
      return s.set(r.id, r), {
        layers: s
      };
    }),
    addLayer: (r, o) => {
      const s = n(), c = Array.from(s.layers.values());
      let f = 1;
      const d = new Set(c.map((E) => E.layerNumber));
      for (; d.has(f) && f <= Tf; ) f++;
      if (f > Tf) return c[0];
      const p = Math.max(0, ...c.map((E) => E.id)) + 1, v = new Set(c.map((E) => E.color)), b = o ?? $o.find((E) => !v.has(E)) ?? $o[c.length % $o.length], S = {
        id: p,
        layerNumber: f,
        datatype: 0,
        name: r ?? `layer${f}`,
        color: b,
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
    deleteLayer: (r) => l((o) => {
      if (o.layers.size <= 1) return o;
      const s = new Map(o.layers);
      s.delete(r);
      let c = o.activeLayerId;
      o.activeLayerId === r && (c = s.keys().next().value ?? 1);
      const f = o.focusedLayerId === r ? null : o.focusedLayerId;
      return {
        layers: s,
        activeLayerId: c,
        focusedLayerId: f
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
        const s = n().activeLayerId;
        l({
          isFocused: true,
          focusedLayerId: s
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
  function oc(l, n = 0.7) {
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
  function bS(l, n) {
    const r = /* @__PURE__ */ new Set(), o = [];
    for (const s of n) {
      if (r.has(s)) continue;
      const f = l.get_group_ids(s).filter((d) => n.has(d));
      for (const d of f) r.add(d);
      f.length > 0 && o.push(f);
    }
    return o;
  }
  function vS(l, n, r, o) {
    const s = bS(l, n);
    if (o === "origin-align") return xS(l, s);
    if (s.length < 2 || !r) return [];
    const c = s.findIndex((v) => v.includes(r));
    if (c === -1) return [];
    const f = l.get_bounds_for_ids(s[c]);
    if (!f) return [];
    const d = Nf(f), m = Of(d), p = [];
    for (let v = 0; v < s.length; v++) {
      if (v === c) continue;
      const b = s[v], S = l.get_bounds_for_ids(b);
      if (!S) continue;
      const E = Nf(S), k = Of(E);
      let w = 0, C = 0;
      switch (o) {
        case "align-left":
          w = d.minX - E.minX;
          break;
        case "align-center-h":
          w = m.x - k.x;
          break;
        case "align-right":
          w = d.maxX - E.maxX;
          break;
        case "align-top":
          C = d.minY - E.minY;
          break;
        case "align-center-v":
          C = m.y - k.y;
          break;
        case "align-bottom":
          C = d.maxY - E.maxY;
          break;
        case "center-align":
          w = m.x - k.x, C = m.y - k.y;
          break;
      }
      (w !== 0 || C !== 0) && p.push({
        ids: b,
        dx: w,
        dy: C
      });
    }
    return p;
  }
  function xS(l, n) {
    const r = [];
    for (const o of n) {
      const s = l.get_bounds_for_ids(o);
      if (!s) continue;
      const c = Of(Nf(s)), f = -c.x, d = -c.y;
      (f !== 0 || d !== 0) && r.push({
        ids: o,
        dx: f,
        dy: d
      });
    }
    return r;
  }
  const Dn = "__TAURI__" in window;
  async function ei(l, n) {
    const { invoke: r } = await ht(async () => {
      const { invoke: o } = await import("./core-DxBnVPgq.js");
      return {
        invoke: o
      };
    }, [], import.meta.url);
    return r(l, n);
  }
  async function Qv(l) {
    const n = await ei("read_gds_bytes", {
      path: l
    });
    return new Uint8Array(n);
  }
  async function Wv(l, n) {
    return ei("save_gds", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function Jv(l, n) {
    return ei("save_bytes", {
      path: l,
      bytes: Array.from(n)
    });
  }
  async function e0() {
    return ei("get_pending_file");
  }
  async function t0() {
    const { open: l } = await ht(async () => {
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
  async function n0(l) {
    const { save: n } = await ht(async () => {
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
  async function l0(l) {
    const { save: n } = await ht(async () => {
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
  async function r0() {
    const { open: l } = await ht(async () => {
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
  async function a0(l) {
    const n = await ei("read_gds_bytes", {
      path: l
    });
    return new Uint8Array(n);
  }
  async function o0(l, n) {
    const { listen: r } = await ht(async () => {
      const { listen: s } = await import("./event-BC8TvpKC.js");
      return {
        listen: s
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    return await r(l, (s) => n(s.payload));
  }
  const i0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    getPendingFile: e0,
    isTauri: Dn,
    listenTauri: o0,
    pickGdsFile: t0,
    pickImageFile: r0,
    pickSaveFile: n0,
    pickSaveImageFile: l0,
    readFileBytes: a0,
    readGdsBytes: Qv,
    saveBytes: Jv,
    saveGds: Wv
  }, Symbol.toStringTag, {
    value: "Module"
  })), s0 = 500 * Se, ic = 64, nn = wt((l, n) => ({
    width: s0,
    cornerRadius: 0,
    numArcPoints: ic,
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
  function wS() {
    return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  const Ve = wt((l, n) => ({
    tabs: [],
    activeTabId: null,
    addTab: (r) => {
      const o = wS(), s = {
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
      const o = n(), s = o.tabs.findIndex((d) => d.id === r);
      if (s === -1) return false;
      const c = o.tabs.filter((d) => d.id !== r);
      let f = o.activeTabId;
      return o.activeTabId === r && (c.length === 0 ? f = null : s < c.length ? f = c[s].id : f = c[c.length - 1].id), l({
        tabs: c,
        activeTabId: f
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
  })), ti = /* @__PURE__ */ new Map(), ur = /* @__PURE__ */ new Map();
  function Ko(l) {
    const n = ze.getState(), r = oe.getState(), o = de.getState(), s = ye.getState(), c = he.getState(), f = Xt.getState(), d = nn.getState(), m = Ne.getState(), p = zn.getState(), v = $n.getState(), b = {
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
        activeTool: f.activeTool
      },
      path: {
        width: d.width,
        cornerRadius: d.cornerRadius,
        numArcPoints: d.numArcPoints,
        pathMetadata: new Map(d.pathMetadata)
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
    ti.set(l, b), Ve.getState().updateTab(l, {
      isDirty: v.isDirty
    });
  }
  function c0(l) {
    const n = ti.get(l);
    if (!n) return;
    ze.setState({
      zoom: n.viewport.zoom,
      offset: {
        ...n.viewport.offset
      },
      initialized: n.viewport.initialized
    }), oe.setState({
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
    }), Xt.setState({
      activeTool: n.tool.activeTool,
      toolSetAt: Date.now()
    }), nn.setState({
      width: n.path.width,
      cornerRadius: n.path.cornerRadius,
      numArcPoints: n.path.numArcPoints,
      pathMetadata: new Map(n.path.pathMetadata)
    }), Ne.setState({
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
    xe.setState({
      library: r
    }), xe.getState().bumpSyncGeneration();
  }
  function qs(l) {
    ti.delete(l);
    const n = ur.get(l);
    n && (n.free(), ur.delete(l));
  }
  function qo(l, n) {
    ur.set(l, n);
  }
  function Gs(l) {
    return ur.get(l) ?? null;
  }
  function Hr(l, n) {
    if (l && l !== n) {
      Ko(l);
      const r = xe.getState().library;
      r && ur.set(l, r);
    }
    c0(n);
  }
  function u0() {
    return {
      viewport: {
        zoom: Vs,
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
        layers: new Map(Ws.map((l) => [
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
        width: s0,
        cornerRadius: 0,
        numArcPoints: ic,
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
  function Ps(l, n) {
    const r = new n.WasmLibrary("rosette");
    try {
      r.add_cell("top");
    } catch {
    }
    r.set_active_cell("top"), ur.set(l, r);
    const o = u0();
    return ti.set(l, o), r;
  }
  function SS(l, n, r) {
    ur.set(l, n);
    const o = {
      ...u0(),
      ...r
    };
    ti.set(l, o);
  }
  const d0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    deleteTabSnapshot: qs,
    getTabLibrary: Gs,
    initNewTab: Ps,
    initTabWithLibrary: SS,
    restoreTabSnapshot: c0,
    saveTabSnapshot: Ko,
    setTabLibrary: qo,
    switchTab: Hr,
    useTabsStore: Ve
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  let Ia = null, fn = null, tn = null, Ks = null, Mt = null;
  const Go = /* @__PURE__ */ new Map();
  function dr(l) {
    const n = (fn == null ? void 0 : fn.get(l)) ?? null;
    if (n) return n;
    if (!l.startsWith("ref:") && Ia) {
      const r = Ia.active_cell_name();
      let o = Ia.get_element_index(l);
      if (o < 0 && Go.has(l) && (o = Go.get(l)), o >= 0) {
        if (Go.set(l, o), tn && r && tn[r]) {
          const s = tn[r];
          if (o < s.length && s[o]) return s[o];
        }
        if (Ks && o < Ks.length) {
          const s = Ks[o];
          if (s) return s;
        }
      }
    }
    return null;
  }
  async function CS(l) {
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
  function Uo(l, n) {
    const r = dr(l);
    r && (r.type !== "polygon" && r.type !== "path" || al({
      op: "modify_vertices",
      file: r.file,
      line: r.line,
      old_code: r.code,
      vertices: Array.from(n)
    }));
  }
  function ES(l, n, r) {
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
  function _S(l, n, r) {
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
  function kS(l) {
    const n = dr(l);
    n && al({
      op: "delete_element",
      file: n.file,
      line: n.line,
      old_code: n.code
    });
  }
  function f0(l, n, r) {
    const o = Ia == null ? void 0 : Ia.active_cell_name(), s = he.getState().cells[0] ?? null;
    if (o && s && o !== s) {
      if (tn && tn[o]) {
        const m = tn[o];
        let p = 0, v = "", b = o;
        for (const S of m) if (S && S.line > p) {
          p = S.line, v = S.file;
          const E = S.code.indexOf(".");
          E > 0 && (b = S.code.substring(0, E).trim());
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
    let c = 0, f = "", d = "cell";
    for (const m of fn.values()) if (m.line > c) {
      c = m.line, f = m.file;
      const p = m.code.indexOf(".");
      p > 0 && (d = m.code.substring(0, p).trim());
    }
    !f || c === 0 || al({
      op: "add_element",
      file: f,
      after_line: c,
      element_type: "polygon",
      vertices: Array.from(l),
      layer: n,
      datatype: r,
      cell_var: d
    });
  }
  function MS(l, n) {
    const r = he.getState().cells[0] ?? null;
    let o = "", s = "design", c = 0;
    if (tn) for (const d of Object.values(tn)) for (const m of d) m && m.line > c && (c = m.line, o || (o = m.file));
    if (!c && Mt) for (const [d, m] of Object.entries(Mt)) d !== r && m.line > c && (c = m.line, o || (o = m.file));
    let f = 0;
    if (n === r && fn) for (const d of fn.values()) {
      o || (o = d.file);
      const m = d.code.indexOf(".");
      m > 0 && (s = d.code.substring(0, m).trim()), d.type === "ref" && d.line > f && (f = d.line);
    }
    else if (tn && tn[n]) {
      for (const d of tn[n]) if (d && d.type === "ref" && d.line > f) {
        f = d.line, o || (o = d.file);
        const m = d.code.indexOf(".");
        m > 0 && (s = d.code.substring(0, m).trim());
      }
    }
    if (Mt && Mt[n]) {
      const d = Mt[n];
      o || (o = d.file, s = d.var_name);
    }
    if (!f && fn) for (const d of fn.values()) d.line > f && (f = d.line, o || (o = d.file));
    c || (c = f), f || (f = c), !(!o || !c || !f) && (Mt || (Mt = {}), Mt[l] = {
      var_name: l,
      file: o,
      line: c + 1
    }, al({
      op: "add_cell",
      file: o,
      def_after_line: c,
      ref_after_line: f,
      cell_name: l,
      parent_var: s
    }));
  }
  function h0(l, n, r) {
    const o = he.getState().cells[0] ?? null;
    let s = "", c = "design", f = 0;
    if (n === o && fn) for (const m of fn.values()) {
      s || (s = m.file);
      const p = m.code.indexOf(".");
      p > 0 && (c = m.code.substring(0, p).trim()), m.type === "ref" && m.line > f && (f = m.line);
    }
    else if (tn && tn[n]) {
      for (const m of tn[n]) if (m && m.type === "ref" && m.line > f) {
        f = m.line, s || (s = m.file);
        const p = m.code.indexOf(".");
        p > 0 && (c = m.code.substring(0, p).trim());
      }
    }
    if (Mt && Mt[n]) {
      const m = Mt[n];
      s || (s = m.file), f || (f = m.line, c = m.var_name);
    }
    if (!f && fn) for (const m of fn.values()) m.line > f && (f = m.line, s || (s = m.file));
    if (!s || !f) return;
    const d = Mt && Mt[l] ? Mt[l].var_name : l;
    al({
      op: "add_ref",
      file: s,
      after_line: f,
      cell_name: d,
      parent_var: c,
      transform: r
    });
  }
  function jS(l) {
    if (!Mt || !Mt[l]) return;
    const n = Mt[l];
    al({
      op: "delete_cell",
      file: n.file,
      cell_name: l,
      var_name: n.var_name
    });
  }
  function LS(l, n, r) {
    if (Ks = n, tn = r ?? null, !n || n.length === 0) {
      fn = null;
      return;
    }
    const o = /* @__PURE__ */ new Map();
    try {
      const s = l.get_render_polygons();
      for (const c of s) {
        const f = c[0];
        if (f) if (f.startsWith("ref:")) {
          const d = f.indexOf(":", 4), m = parseInt(f.substring(4, d > 0 ? d : void 0), 10);
          if (m >= 0 && m < n.length) {
            const p = n[m];
            p && o.set(f, p);
          }
        } else {
          const d = l.get_element_index(f);
          if (d >= 0 && d < n.length) {
            const m = n[d];
            m && o.set(f, m);
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
  function RS() {
    return new URLSearchParams(window.location.search).get("src");
  }
  function AS() {
    const n = new URLSearchParams(window.location.search).get("colors");
    return n ? n.split(",").map((r) => `#${r.trim()}`) : null;
  }
  function TS() {
    const n = new URLSearchParams(window.location.search).get("fills");
    return n ? n.split(",").map((r) => r.trim()) : null;
  }
  function NS() {
    return new URLSearchParams(window.location.search).get("name");
  }
  function OS() {
    const n = new URLSearchParams(window.location.search).get("panelWidth");
    if (!n) return null;
    const r = Number.parseInt(n, 10);
    return Number.isNaN(r) || r <= 0 ? null : r;
  }
  function DS() {
    const n = new URLSearchParams(window.location.search).get("zoom");
    if (!n) return null;
    const r = Number.parseFloat(n);
    return Number.isNaN(r) || r <= 0 ? null : r;
  }
  function IS() {
    return Dn && !Df() && !Zo();
  }
  function zS(l) {
    return l !== null && !Array.isArray(l) && "name" in l && "children" in l;
  }
  function Od(l, n) {
    for (const r of n.values()) {
      const o = r.visible ? r.opacity ?? 0.7 : 0, [s, c, f, d] = oc(r.color, o);
      l.set_layer_color(r.layerNumber, r.datatype, s, c, f, d);
    }
  }
  const Js = $o;
  function HS(l, n) {
    if (n.length === 0) return false;
    const r = new Set(n.map((d) => `${d.layerNumber}/${d.datatype}`)), o = n.map((d) => ({
      id: d.id,
      layerNumber: d.layerNumber,
      datatype: d.datatype,
      name: d.name,
      color: d.color,
      visible: d.visible ?? true,
      fillPattern: d.fillPattern ?? "solid",
      opacity: d.opacity ?? 0.7
    })), s = l.get_used_layers();
    let c = Math.max(0, ...o.map((d) => d.id)) + 1, f = o.length;
    for (let d = 0; d < s.length; d += 2) {
      const m = s[d], p = s[d + 1], v = `${m}/${p}`;
      r.has(v) || (o.push({
        id: c++,
        layerNumber: m,
        datatype: p,
        name: p === 0 ? `layer${m}` : `layer${m}/${p}`,
        color: Js[f % Js.length],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      }), f++);
    }
    return ye.getState().resetLayers(o), true;
  }
  function Dd(l) {
    const n = l.get_used_layers();
    if (n.length === 0) return;
    const r = [];
    for (let o = 0; o < n.length; o += 2) {
      const s = n[o], c = n[o + 1], f = o / 2 + 1, d = (f - 1) % Js.length, m = c === 0 ? `layer${s}` : `layer${s}/${c}`;
      r.push({
        id: f,
        layerNumber: s,
        datatype: c,
        name: m,
        color: Js[d],
        visible: true,
        fillPattern: "solid",
        opacity: 0.7
      });
    }
    ye.getState().resetLayers(r);
  }
  function Id() {
    de.getState().clear(), oe.getState().clearSelection(), Ne.getState().clearAllRulers(), zn.getState().clear(), $n.getState().markClean();
  }
  function US(l, n) {
    const r = l.get_cell_tree();
    if (r) {
      he.getState().setCellTree(r);
      const o = l.active_cell_name();
      o && he.getState().setActiveCell(o);
    } else he.getState().setCells([
      "top"
    ]);
    n && he.getState().setProjectName(n);
  }
  function YS(l, n) {
    const [r, o] = g.useState(null), [s, c] = g.useState(false), f = ye((k) => k.layers), d = g.useRef(f), m = g.useRef(0), p = g.useCallback((k) => {
      Ia = k, o(k);
    }, []), v = g.useRef(l);
    g.useEffect(() => {
      d.current = f;
    }, [
      f
    ]), g.useEffect(() => {
      v.current = l;
    }, [
      l
    ]), g.useEffect(() => Ve.subscribe((w, C) => {
      if (w.activeTabId && w.activeTabId !== C.activeTabId) {
        const _ = Gs(w.activeTabId);
        _ && (p(_), c(true));
      }
    }), [
      p
    ]), g.useEffect(() => {
      if (!l || !n || Df() || Zo()) return;
      const { tabs: k } = Ve.getState();
      if (k.length > 0) {
        const A = Ve.getState().activeTabId;
        if (A) {
          const j = Gs(A);
          if (j) {
            p(j), c(true);
            return;
          }
        }
      }
      const w = he.getState().projectName, C = Ve.getState().addTab({
        title: w
      }), _ = Ps(C, l), T = _.get_cell_tree();
      T ? he.getState().setCellTree(T) : he.getState().setCells([
        "top"
      ]), p(_), c(true);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n) return;
      const k = () => {
        const w = Ve.getState().addTab({
          title: "untitled-project"
        }), C = Ps(w, l);
        Id(), ye.getState().resetLayers(Ws), he.getState().setProjectName("untitled-project");
        const _ = C.get_cell_tree();
        _ ? he.getState().setCellTree(_) : he.getState().setCells([
          "top"
        ]), he.getState().setActiveCell("top");
        const T = document.getElementById("rosette-canvas");
        if (T) {
          const A = T.getBoundingClientRect();
          ze.getState().reset(A.width, A.height);
        }
        p(C), c(true), xe.getState().bumpSyncGeneration();
      };
      return window.addEventListener("rosette-new-tab", k), () => window.removeEventListener("rosette-new-tab", k);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !IS()) return;
      let k = false;
      const w = async (_) => {
        if (!k) try {
          const T = Ve.getState().findTabByPath(_);
          if (T) {
            const H = Ve.getState().activeTabId;
            if (H && H !== T.id) {
              Hr(H, T.id), Ve.getState().setActiveTab(T.id);
              const G = Gs(T.id);
              G && (p(G), c(true));
            }
            return;
          }
          const A = await Qv(_);
          if (k) return;
          const j = l.WasmLibrary.from_gds_bytes(A), U = Ve.getState().activeTabId;
          if (U) {
            Ko(U);
            const H = xe.getState().library;
            H && qo(U, H);
          }
          const N = _.split(/[/\\]/).pop() ?? "untitled", R = Ve.getState().addTab({
            title: N,
            filePath: _
          });
          Dd(j), Od(j, ye.getState().layers), qo(R, j), Id(), US(j, N);
          const O = document.getElementById("rosette-canvas");
          if (O) {
            const H = O.getBoundingClientRect();
            ze.getState().reset(H.width, H.height);
          }
          p(j), c(true), xe.getState().bumpSyncGeneration();
        } catch (T) {
          console.error("Failed to open GDS file:", T);
        }
      };
      e0().then((_) => {
        _ && !k && w(_);
      });
      let C = null;
      return o0("open-file", w).then((_) => {
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
        const w = Ve.getState().activeTabId;
        if (w) {
          Ko(w);
          const j = xe.getState().library;
          j && qo(w, j);
        }
        const C = Ve.getState().addTab({
          title: "untitled-project"
        }), _ = Ps(C, l);
        Id(), ye.getState().resetLayers(Ws), he.getState().setProjectName("untitled-project");
        const T = _.get_cell_tree();
        T ? he.getState().setCellTree(T) : he.getState().setCells([
          "top"
        ]), he.getState().setActiveCell("top");
        const A = document.getElementById("rosette-canvas");
        if (A) {
          const j = A.getBoundingClientRect();
          ze.getState().reset(j.width, j.height);
        }
        p(_), c(true), xe.getState().bumpSyncGeneration();
      };
      return window.addEventListener("rosette-new-file", k), () => window.removeEventListener("rosette-new-file", k);
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (!l || !n || !Df()) return;
      const k = new EventSource("/api/design/events");
      return k.addEventListener("design", (w) => {
        try {
          const C = JSON.parse(w.data);
          if (C.version < m.current && (m.current = 0), C.version !== m.current && C.json) try {
            const _ = l.WasmLibrary.from_library_json(C.json);
            C.layers && C.layers.length > 0 ? HS(_, C.layers) : Dd(_), Od(_, ye.getState().layers);
            const T = Ia;
            p(_), c(true), m.current = C.version, de.getState().clear();
            const A = [
              ...oe.getState().selectedIds
            ], j = [];
            for (const N of A) if (N.startsWith("ref:")) j.push({
              elemIdx: -1,
              refId: N
            });
            else if (T) {
              let R = T.get_element_index(N);
              R < 0 && (R = Go.get(N) ?? -1), R >= 0 && Go.set(N, R), j.push({
                elemIdx: R,
                refId: ""
              });
            }
            oe.getState().clearSelection(), T && requestAnimationFrame(() => {
              try {
                T.free();
              } catch {
              }
            }), LS(_, C.source_map ?? null, C.child_source_maps ?? null), Mt = C.cell_vars ?? null;
            const U = _.get_cell_tree();
            if (U) {
              const N = he.getState().activeCell;
              he.getState().setCellTree(U), N && he.getState().cells.includes(N) && _.set_active_cell(N);
            } else C.cells && (zS(C.cells) ? he.getState().setCellTree([
              C.cells
            ]) : he.getState().setCells(C.cells));
            if (C.filename && he.getState().setProjectName(C.filename), j.length > 0) {
              const N = /* @__PURE__ */ new Set(), R = _.get_all_ids(), O = /* @__PURE__ */ new Map();
              for (const H of R) if (!H.startsWith("ref:")) {
                const G = _.get_element_index(H);
                G >= 0 && O.set(G, H);
              }
              for (const H of j) if (H.refId) N.add(H.refId);
              else if (H.elemIdx >= 0) {
                const G = O.get(H.elemIdx);
                G && N.add(G);
              }
              N.size > 0 && oe.getState().setSelection(N);
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
      const k = RS();
      if (!k || k.startsWith("//") || /^https?:\/\//i.test(k)) {
        console.error("Embed mode requires a relative ?src= parameter pointing to a JSON file");
        return;
      }
      let w = false;
      return (async () => {
        try {
          const C = await fetch(k);
          if (!C.ok) throw new Error(`Failed to fetch ${k}: ${C.status}`);
          const _ = await C.text();
          if (w) return;
          const T = l.WasmLibrary.from_library_json(_);
          Dd(T);
          const A = AS(), j = TS();
          if (A || j) {
            const O = ye.getState().layers, G = Array.from(O.values()).map((te, ee) => {
              let fe = te;
              return A && ee < A.length && (fe = {
                ...fe,
                color: A[ee]
              }), j && ee < j.length && j[ee] in Af && (fe = {
                ...fe,
                fillPattern: j[ee]
              }), fe;
            });
            ye.getState().resetLayers(G);
          }
          Od(T, ye.getState().layers);
          const U = xe.getState().library;
          U && U.free(), p(T), c(true);
          const N = NS();
          N && he.getState().setProjectName(N);
          const R = T.get_cell_tree();
          if (R) {
            he.getState().setCellTree(R);
            const O = T.active_cell_name();
            O && he.getState().setActiveCell(O);
          }
        } catch (C) {
          console.error("Failed to load embed design:", C);
        }
      })(), () => {
        w = true;
      };
    }, [
      l,
      n,
      p
    ]), g.useEffect(() => {
      if (r) for (const k of f.values()) {
        const w = k.visible ? k.opacity ?? 0.7 : 0, [C, _, T, A] = oc(k.color, w);
        r.set_layer_color(k.layerNumber, k.datatype, C, _, T, A), r.set_layer_fill_pattern(k.layerNumber, k.datatype, Af[k.fillPattern ?? "solid"] ?? 0);
      }
    }, [
      r,
      f
    ]);
    const b = g.useCallback((k, w, C, _, T) => r ? r.add_rectangle(k, w, C, _, T, 0) ?? null : null, [
      r
    ]), S = g.useCallback((k, w) => r ? r.add_polygon(new Float64Array(k), w, 0) ?? null : null, [
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
      addPolygon: S,
      clearCell: E
    };
  }
  const wy = 8;
  function Sy(l, n) {
    const r = n.x - l.x, o = n.y - l.y;
    if (r === 0 && o === 0) return n;
    const s = Math.abs(Math.atan2(Math.abs(o), Math.abs(r)) * (180 / Math.PI));
    return s <= wy ? {
      x: n.x,
      y: l.y
    } : s >= 90 - wy ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function BS(l, n, r = 64) {
    const o = l.length;
    if (o < 3 || n <= 0) return l;
    const s = [];
    for (let p = 0; p < o - 1; p++) {
      const v = l[p + 1].x - l[p].x, b = l[p + 1].y - l[p].y;
      s.push(Math.sqrt(v * v + b * b));
    }
    const c = o - 2, f = [];
    for (let p = 1; p < o - 1; p++) {
      const v = l[p - 1], b = l[p], S = l[p + 1], E = s[p - 1], k = s[p];
      if (E < 1e-10 || k < 1e-10) {
        f.push(null);
        continue;
      }
      const w = (b.x - v.x) / E, C = (b.y - v.y) / E, _ = (S.x - b.x) / k, T = (S.y - b.y) / k, A = w * T - C * _, j = w * _ + C * T, U = Math.atan2(A, j);
      Math.abs(U) < 1e-6 ? f.push(null) : f.push(U);
    }
    const d = f.map((p) => {
      if (p === null) return 0;
      const v = Math.abs(p) / 2;
      return n * Math.tan(v);
    });
    for (let p = 0; p < 3; p++) for (let v = 0; v < s.length; v++) {
      const b = s[v] * 0.95, S = v > 0 ? v - 1 : null, E = v < c ? v : null, k = S !== null ? d[S] : 0, w = E !== null ? d[E] : 0, C = k + w;
      if (C > b && C > 1e-10) {
        const _ = b / C;
        S !== null && (d[S] = Math.min(d[S], k * _)), E !== null && (d[E] = Math.min(d[E], w * _));
      }
    }
    const m = [
      l[0]
    ];
    for (let p = 0; p < c; p++) {
      const v = p + 1, b = l[v], S = f[p];
      if (S === null) {
        m.push(b);
        continue;
      }
      const E = d[p], k = Math.abs(S) / 2, w = Math.tan(k), C = Math.abs(w) > 1e-10 ? E / w : 0;
      if (C < 1e-6 || E < 1e-6) {
        m.push(b);
        continue;
      }
      const _ = l[v - 1], T = l[v + 1], A = s[v - 1], j = s[v], U = (b.x - _.x) / A, N = (b.y - _.y) / A, R = (T.x - b.x) / j, O = (T.y - b.y) / j, H = S > 0 ? 1 : -1, G = b.x + U * -E, te = b.y + N * -E, ee = b.x + R * E, fe = b.y + O * E, me = -N * H, Ee = U * H, q = G + me * C, F = te + Ee * C, ce = G - q, _e = te - F, be = Math.min(Math.max(Math.ceil(Math.abs(S) * 180 / Math.PI * 2), 8), r);
      m.push({
        x: G,
        y: te
      });
      for (let L = 1; L < be; L++) {
        const D = L / be, $ = S * D, J = Math.cos($), W = Math.sin($);
        m.push({
          x: q + ce * J - _e * W,
          y: F + ce * W + _e * J
        });
      }
      m.push({
        x: ee,
        y: fe
      });
    }
    return m.push(l[o - 1]), m;
  }
  function XS(l, n) {
    const r = l.length;
    if (r < 3 || n <= 0) return [];
    const o = [];
    for (let m = 0; m < r - 1; m++) {
      const p = l[m + 1].x - l[m].x, v = l[m + 1].y - l[m].y;
      o.push(Math.sqrt(p * p + v * v));
    }
    const s = r - 2, c = [];
    for (let m = 1; m < r - 1; m++) {
      const p = l[m - 1], v = l[m], b = l[m + 1], S = o[m - 1], E = o[m];
      if (S < 1e-10 || E < 1e-10) {
        c.push(null);
        continue;
      }
      const k = (v.x - p.x) / S, w = (v.y - p.y) / S, C = (b.x - v.x) / E, _ = (b.y - v.y) / E, T = k * _ - w * C, A = k * C + w * _, j = Math.atan2(T, A);
      c.push(Math.abs(j) < 1e-6 ? null : j);
    }
    const f = c.map((m) => m === null ? 0 : n * Math.tan(Math.abs(m) / 2));
    for (let m = 0; m < 3; m++) for (let p = 0; p < o.length; p++) {
      const v = o[p] * 0.95, b = p > 0 ? p - 1 : null, S = p < s ? p : null, E = b !== null ? f[b] : 0, k = S !== null ? f[S] : 0, w = E + k;
      if (w > v && w > 1e-10) {
        const C = v / w;
        b !== null && (f[b] = Math.min(f[b], E * C)), S !== null && (f[S] = Math.min(f[S], k * C));
      }
    }
    const d = [];
    for (let m = 0; m < s; m++) {
      const p = c[m];
      if (p === null) continue;
      const v = Math.abs(p) / 2, b = Math.tan(v);
      if (Math.abs(b) < 1e-10) continue;
      const S = f[m] / b;
      S < n - 1e-6 && d.push({
        cornerIndex: m + 1,
        requested: n,
        actual: S
      });
    }
    return d;
  }
  function VS(l, n, r = 0, o = 64) {
    const s = r > 0 ? BS(l, r, o) : l;
    if (s.length < 2) return [];
    const c = n / 2, f = s.length, d = [], m = [];
    for (let p = 0; p < f; p++) {
      const v = s[p];
      if (p === 0) {
        const b = s[1], S = b.x - v.x, E = b.y - v.y, k = Math.sqrt(S * S + E * E);
        if (k < 1e-10) continue;
        const w = -E / k, C = S / k;
        d.push({
          x: v.x + w * c,
          y: v.y + C * c
        }), m.push({
          x: v.x - w * c,
          y: v.y - C * c
        });
      } else if (p === f - 1) {
        const b = s[f - 2], S = v.x - b.x, E = v.y - b.y, k = Math.sqrt(S * S + E * E);
        if (k < 1e-10) continue;
        const w = -E / k, C = S / k;
        d.push({
          x: v.x + w * c,
          y: v.y + C * c
        }), m.push({
          x: v.x - w * c,
          y: v.y - C * c
        });
      } else {
        const b = s[p - 1], S = s[p + 1], E = v.x - b.x, k = v.y - b.y, w = Math.sqrt(E * E + k * k), C = S.x - v.x, _ = S.y - v.y, T = Math.sqrt(C * C + _ * _);
        if (w < 1e-10 || T < 1e-10) continue;
        const A = -k / w, j = E / w, U = -_ / T, N = C / T, R = A + U, O = j + N, H = Math.sqrt(R * R + O * O);
        if (H < 1e-10) d.push({
          x: v.x + A * c,
          y: v.y + j * c
        }), m.push({
          x: v.x - A * c,
          y: v.y - j * c
        });
        else {
          const G = R / H, te = O / H, ee = G * A + te * j;
          if (Math.abs(ee) < 1e-6) d.push({
            x: v.x + A * c,
            y: v.y + j * c
          }), m.push({
            x: v.x - A * c,
            y: v.y - j * c
          });
          else {
            const fe = Math.max(-2 * c, Math.min(2 * c, c / ee));
            d.push({
              x: v.x + G * fe,
              y: v.y + te * fe
            }), m.push({
              x: v.x - G * fe,
              y: v.y - te * fe
            });
          }
        }
      }
    }
    return m.reverse(), [
      ...d,
      ...m
    ];
  }
  class m0 {
    constructor(n, r, o, s, c, f = 0) {
      __publicField(this, "type", "create-rectangle");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.x = n, this.y = r, this.width = o, this.height = s, this.layer = c, this.datatype = f, this.description = `Create rectangle at (${n}, ${r})`;
    }
    execute(n) {
      const r = n.library.add_rectangle(this.x, this.y, this.width, this.height, this.layer, this.datatype);
      if (r) {
        this.elementId = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), oe.getState().select(r);
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
        f0(o, this.layer, this.datatype);
      }
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = oe.getState();
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
      const f = l.get_text_element_info(s);
      if (f) {
        r.push({
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
      const d = l.get_element_info(s);
      d && (r.push({
        type: "polygon",
        vertices: new Float64Array(d.vertices),
        layer: d.layer,
        datatype: d.datatype
      }), d.free());
    }
    return r;
  }
  function ni(l, n) {
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
  function g0(l, n) {
    if (new URLSearchParams(window.location.search).get("design") !== "true") return;
    const o = l.library.active_cell_name();
    if (o) for (const s of n) s.type === "cell-ref" && h0(s.cellName, o, Array.from(s.transform));
  }
  class sc {
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
          const b = v.cell_name, S = p.startsWith("ref:") ? p.split(":")[1] : p;
          v.free(), c.has(b) || c.set(b, /* @__PURE__ */ new Set()), c.get(b).add(S);
        }
      }
      for (const [p, v] of c) {
        const b = n.library.get_cell_ref_parents(p), S = Array.isArray(b) ? b.length : 0;
        if (S > 0 && v.size >= S) {
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
      const f = new URLSearchParams(window.location.search).get("design") === "true", d = /* @__PURE__ */ new Map();
      let m = 0;
      for (const p of r) {
        const v = dr(p);
        if (v) {
          const b = `${v.file}:${v.line}`;
          d.has(b) || d.set(b, p);
        } else f && m++;
      }
      m > 0 && f && Dt.getState().show(`${m} element(s) deleted from viewer only \u2014 no source tracking available. Changes may revert on reload.`, "warn", 5e3), n.library.remove_elements(r), this.restoredIds = [], Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), oe.getState().clearSelection();
      for (const p of d.values()) kS(p);
    }
    undo(n) {
      this.restoredIds = ni(n.library, this.snapshots), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.restoredIds.length > 0 && oe.getState().setSelection(new Set(this.restoredIds));
    }
  }
  class cc {
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
      this.snapshots.length !== 0 && (this.createdIds = ni(n.library, this.snapshots), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && oe.getState().setSelection(new Set(this.createdIds)), g0(n, this.snapshots));
    }
    undo(n) {
      n.library.remove_elements(this.createdIds), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), oe.getState().clearSelection();
    }
  }
  class uc {
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
      this.snapshots.length === 0 && (this.snapshots = mr(n.library, this.elementIds)), this.createdIds = ni(n.library, this.snapshots), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.createdIds.length > 0 && oe.getState().setSelection(new Set(this.createdIds)), g0(n, this.snapshots);
    }
    undo(n) {
      n.library.remove_elements(this.createdIds), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), this.elementIds.length > 0 ? oe.getState().setSelection(new Set(this.elementIds)) : oe.getState().clearSelection();
    }
  }
  class p0 {
    constructor(n, r, o = 0) {
      __publicField(this, "type", "create-polygon");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.points = n, this.layer = r, this.datatype = o, this.description = `Create polygon with ${n.length / 2} vertices`;
    }
    execute(n) {
      const r = n.library.add_polygon(this.points, this.layer, this.datatype);
      r && (this.elementId = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), oe.getState().select(r), f0(this.points, this.layer, this.datatype));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = oe.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  function Cy(l) {
    const n = l / Se / 1e3;
    return n.toFixed(n >= 10 ? 1 : n >= 1 ? 2 : 3);
  }
  function y0(l, n) {
    if (n <= 0) return;
    const r = XS(l, n);
    if (r.length === 0) return;
    const o = Cy(n), s = Math.min(...r.map((d) => d.actual)), c = Cy(s), f = r.length === 1 ? `Bend radius reduced to ${c} \xB5m at corner ${r[0].cornerIndex} (requested ${o} \xB5m)` : `Bend radius reduced at ${r.length} corners (min ${c} \xB5m, requested ${o} \xB5m)`;
    Dt.getState().show(f, "warn");
  }
  class $S {
    constructor(n, r, o, s = 0, c, f = 0, d = ic) {
      __publicField(this, "type", "create-path");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      __publicField(this, "metadata", null);
      this.points = n, this.width = r, this.layer = o, this.datatype = s, this.waypoints = c, this.cornerRadius = f, this.numArcPoints = d, this.description = `Create path with ${n.length / 2} waypoints`;
    }
    execute(n) {
      const r = n.library.create_path_rounded(this.points, this.width, this.cornerRadius, this.numArcPoints, this.layer, this.datatype);
      r && (this.elementId = r, this.metadata ? nn.getState().setPathMetadata(r, this.metadata) : this.waypoints && (this.metadata = {
        waypoints: this.waypoints,
        width: this.width,
        cornerRadius: this.cornerRadius,
        numArcPoints: this.numArcPoints,
        layer: this.layer,
        datatype: this.datatype
      }, nn.getState().setPathMetadata(r, this.metadata)), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), oe.getState().select(r), this.waypoints && y0(this.waypoints, this.cornerRadius));
    }
    undo(n) {
      if (this.elementId) {
        this.metadata || (this.metadata = nn.getState().pathMetadata.get(this.elementId) ?? null), nn.getState().removePathMetadata(this.elementId), n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = oe.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class Ms {
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
      for (let f = 0; f < o.waypoints.length; f++) s[f * 2] = o.waypoints[f].x, s[f * 2 + 1] = o.waypoints[f].y;
      n.library.remove_element(r);
      const c = n.library.create_path_rounded(s, o.width, o.cornerRadius, o.numArcPoints ?? ic, o.layer, o.datatype);
      return c ? (nn.getState().removePathMetadata(r), nn.getState().setPathMetadata(c, {
        ...o
      }), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), oe.getState().select(c), y0(o.waypoints, o.cornerRadius), c) : (n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), r);
    }
  }
  class qS {
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
  class GS {
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
        const { rulers: r } = Ne.getState();
        r.has(this.ruler.id) || Ne.setState((o) => {
          const s = new Map(o.rulers);
          return s.set(this.ruler.id, this.ruler), {
            rulers: s
          };
        });
      } else {
        const r = Ne.getState().addRuler(this.ruler.start, this.ruler.end);
        this.ruler = {
          ...this.ruler,
          id: r
        };
      }
    }
    undo(n) {
      Ne.getState().removeRuler(this.ruler.id);
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
      const { rulers: r, removeRulers: o } = Ne.getState(), s = this.restoredIds.length > 0 ? this.restoredIds : this.rulerIds;
      if (this.snapshots.length === 0) for (const c of s) {
        const f = r.get(c);
        f && this.snapshots.push({
          ...f
        });
      }
      o(s), this.restoredIds = [];
    }
    undo(n) {
      const r = Ne.getState().restoreRulers(this.snapshots);
      this.restoredIds = r, r.length > 0 && Ne.getState().setSelection(new Set(r));
    }
  }
  class b0 {
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
      Ne.setState((o) => {
        const s = new Map(o.rulers);
        for (const c of this.rulerIds) {
          const f = s.get(c);
          f && s.set(c, {
            ...f,
            start: {
              x: f.start.x + n,
              y: f.start.y + r
            },
            end: {
              x: f.end.x + n,
              y: f.end.y + r
            }
          });
        }
        return {
          rulers: s
        };
      });
    }
  }
  class v0 {
    constructor(n, r, o, s) {
      __publicField(this, "type", "move-ruler-endpoint");
      __publicField(this, "description", "Move ruler endpoint");
      this.rulerId = n, this.endpoint = r, this.oldPosition = o, this.newPosition = s;
    }
    execute(n) {
      Ne.getState().updateEndpoint(this.rulerId, this.endpoint, this.newPosition);
    }
    undo(n) {
      Ne.getState().updateEndpoint(this.rulerId, this.endpoint, this.oldPosition);
    }
  }
  class x0 {
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
  class nh {
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
      n.library.remove_elements(o), this.restoredElementIds = [], n.library.remove_layer_color(this.snapshot.layerNumber, this.snapshot.datatype), r.deleteLayer(this.layerId), oe.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
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
    const r = l.visible ? l.opacity : 0, [o, s, c, f] = oc(l.color, r);
    n.library.set_layer_color(l.layerNumber, l.datatype, o, s, c, f), n.library.set_layer_fill_pattern(l.layerNumber, l.datatype, Af[l.fillPattern ?? "solid"] ?? 0);
  }
  class w0 {
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
  class Ey {
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
      const r = this.newIds.length > 0 ? this.newIds : this.elementIds;
      n.library.remove_elements(r);
      const o = [];
      for (const { snapshot: s } of this.originals) {
        let c;
        "type" in s && s.type === "text" ? c = n.library.add_text(s.text, s.x, s.y, s.height, this.newLayer, this.newDatatype) : c = n.library.add_polygon(s.vertices, this.newLayer, this.newDatatype), c && o.push(c);
      }
      this.newIds = o, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), o.length > 0 && oe.getState().setSelection(new Set(o));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const r = [];
      for (const { snapshot: o } of this.originals) {
        let s;
        "type" in o && o.type === "text" ? s = n.library.add_text(o.text, o.x, o.y, o.height, o.layer, o.datatype) : s = n.library.add_polygon(o.vertices, o.layer, o.datatype), s && r.push(s);
      }
      this.newIds = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), r.length > 0 && oe.getState().setSelection(new Set(r));
    }
  }
  class PS {
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
      const r = this.oldBounds.maxX - this.oldBounds.minX, o = this.oldBounds.maxY - this.oldBounds.minY, s = r !== 0 ? this.newWidth / r : 1, c = o !== 0 ? this.newHeight / o : 1, f = this.newIds.length > 0 ? this.newIds : this.elementIds;
      n.library.remove_elements(f);
      const d = [];
      for (const { snapshot: m } of this.originals) {
        const p = new Float64Array(m.vertices.length);
        for (let b = 0; b < m.vertices.length; b += 2) p[b] = this.oldBounds.minX + (m.vertices[b] - this.oldBounds.minX) * s, p[b + 1] = this.oldBounds.minY + (m.vertices[b + 1] - this.oldBounds.minY) * c;
        const v = n.library.add_polygon(p, m.layer, m.datatype);
        v && d.push(v);
      }
      this.newIds = d, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), d.length > 0 && oe.getState().setSelection(new Set(d));
    }
    undo(n) {
      n.library.remove_elements(this.newIds);
      const r = [];
      for (const { snapshot: o } of this.originals) {
        const s = n.library.add_polygon(o.vertices, o.layer, o.datatype);
        s && r.push(s);
      }
      this.newIds = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), r.length > 0 && oe.getState().setSelection(new Set(r));
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
      r && (this.currentId = r, oe.getState().setSelection(/* @__PURE__ */ new Set([
        r
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      if (!this.original) return;
      n.library.remove_element(this.currentId);
      const r = n.library.add_polygon(this.original.vertices, this.original.layer, this.original.datatype);
      r && (this.currentId = r, oe.getState().setSelection(/* @__PURE__ */ new Set([
        r
      ]))), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class KS {
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
    n && he.getState().setCellTree(n);
  }
  class ZS {
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
  class FS {
    constructor(n, r) {
      __publicField(this, "type", "add-child-cell");
      __publicField(this, "description");
      this.cellName = n, this.parentCellName = r, this.description = `Add child cell "${n}" to "${r}"`;
    }
    execute(n) {
      n.library.add_cell(this.cellName), n.library.add_cell_ref_to(this.parentCellName, this.cellName, 0, 0), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), new URLSearchParams(window.location.search).get("design") === "true" && MS(this.cellName, this.parentCellName);
    }
    undo(n) {
      n.library.remove_cell_cascade(this.cellName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class lh {
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
        Array.isArray(s) && (this.parentRefs = s.map((d) => ({
          parent: d.parent,
          transform: new Float64Array(d.transform)
        })));
        const c = n.library.active_cell_name();
        n.library.set_active_cell(this.cellName);
        const f = n.library.get_all_ids();
        f.length > 0 && (this.elementSnapshots = mr(n.library, f)), c && n.library.set_active_cell(c);
      }
      n.library.remove_cell_cascade(this.cellName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), new URLSearchParams(window.location.search).get("design") === "true" && jS(this.cellName);
    }
    undo(n) {
      n.library.add_cell(this.cellName);
      const r = n.library.active_cell_name();
      n.library.set_active_cell(this.cellName), n.library.set_cell_origin(this.cellOrigin[0], this.cellOrigin[1]), this.elementSnapshots.length > 0 && ni(n.library, this.elementSnapshots), r && n.library.set_active_cell(r);
      for (const o of this.parentRefs) n.library.add_cell_ref_to_with_transform(o.parent, this.cellName, o.transform);
      Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class QS {
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
  class S0 {
    constructor(n, r) {
      __publicField(this, "type", "rename-cell");
      __publicField(this, "description");
      this.oldName = n, this.newName = r, this.description = `Rename cell "${n}" to "${r}"`;
    }
    execute(n) {
      const r = he.getState();
      r.activeCell === this.oldName && r.setActiveCell(this.newName), n.library.rename_cell(this.oldName, this.newName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      const r = he.getState();
      r.activeCell === this.newName && r.setActiveCell(this.oldName), n.library.rename_cell(this.newName, this.oldName), Qt(n.library), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class C0 {
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
        if (o >= 0 && oe.getState().select(`ref:${o}:0`), new URLSearchParams(window.location.search).get("design") === "true") {
          const c = n.library.active_cell_name();
          c && h0(this.cellName, c, [
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
        const { selectedIds: r, removeFromSelection: o } = oe.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
  }
  function Cn(l) {
    return Math.round(l / Se) * Se;
  }
  function rh() {
    const { activeLayerId: l, layers: n } = ye.getState(), r = n.get(l);
    return {
      layerNumber: (r == null ? void 0 : r.layerNumber) ?? 1,
      datatype: (r == null ? void 0 : r.datatype) ?? 0
    };
  }
  function ah(l) {
    const { zoom: n, offset: r } = ze.getState(), o = l.getBoundingClientRect(), s = (o.width / 2 - r.x) / n, c = (o.height / 2 - r.y) / n, f = o.width / n, d = o.height / n, m = Math.max(Cn(f * 0.1 / 2), Se), p = Math.max(Cn(d * 0.1 / 2), Se);
    return {
      centerX: s,
      centerY: c,
      halfW: m,
      halfH: p
    };
  }
  function E0(l, n, r) {
    const { centerX: o, centerY: s, halfW: c, halfH: f } = ah(r), d = c * 2, m = f * 2, p = Cn(o - c), v = Cn(s - f), { layerNumber: b, datatype: S } = rh(), E = new m0(p, v, d, m, b, S);
    de.getState().execute(E, {
      library: l,
      renderer: n
    });
  }
  function _0(l, n, r) {
    const { centerX: o, centerY: s, halfW: c, halfH: f } = ah(r), d = new Float64Array([
      Cn(o - c),
      Cn(s - f),
      Cn(o + c),
      Cn(s - f),
      Cn(o),
      Cn(s + f)
    ]), { layerNumber: m, datatype: p } = rh(), v = new p0(d, m, p);
    de.getState().execute(v, {
      library: l,
      renderer: n
    });
  }
  function k0(l, n, r) {
    const { centerX: o, centerY: s, halfH: c } = ah(r), f = Math.max(Cn(c), Se), { layerNumber: d, datatype: m } = rh(), p = new M0("Text", Cn(o), Cn(s), f, d, m);
    de.getState().execute(p, {
      library: l,
      renderer: n
    }), xe.getState().bumpSyncGeneration();
  }
  class M0 {
    constructor(n, r, o, s, c, f = 0) {
      __publicField(this, "type", "create-text");
      __publicField(this, "description");
      __publicField(this, "elementId", null);
      this.text = n, this.x = r, this.y = o, this.height = s, this.layer = c, this.datatype = f, this.description = `Create text "${n.slice(0, 20)}" at (${r}, ${o})`;
    }
    execute(n) {
      const r = n.library.add_text(this.text, this.x, this.y, this.height, this.layer, this.datatype);
      r && (this.elementId = r, n.renderer.sync_from_library(n.library), n.renderer.mark_dirty(), oe.getState().select(r));
    }
    undo(n) {
      if (this.elementId) {
        n.library.remove_element(this.elementId), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
        const { selectedIds: r, removeFromSelection: o } = oe.getState();
        r.has(this.elementId) && o(this.elementId);
      }
    }
    getElementId() {
      return this.elementId;
    }
  }
  class WS {
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
  class JS {
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
  class e2 {
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
  class j0 {
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
      this.resultIds.length > 0 ? oe.getState().selectAll(this.resultIds) : oe.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      this.resultIds.length > 0 && (n.library.remove_elements(this.resultIds), this.resultIds = []);
      const r = [];
      for (const o of this.snapshots) {
        const s = o.snapshot, c = n.library.add_text(s.text, s.x, s.y, s.height, s.layer, s.datatype);
        c && (o.currentId = c, r.push(c));
      }
      r.length > 0 && oe.getState().selectAll(r), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class L0 {
    constructor(n, r, o) {
      __publicField(this, "type", "align-elements");
      __publicField(this, "description");
      __publicField(this, "deltas", []);
      this.selectedIds = n, this.referenceId = r, this.alignType = o, this.description = `Align elements (${o})`;
    }
    execute(n) {
      this.deltas.length === 0 && (this.deltas = vS(n.library, this.selectedIds, this.referenceId, this.alignType));
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
  class R0 {
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
      this.snapshots.length === 0 && (this.snapshots = mr(n.library, this.currentIds)), this.resultIds = n.library.boolean_operation(this.currentIds, this.operation, this.currentBaseId), this.resultIds.length > 0 ? oe.getState().selectAll(this.resultIds) : oe.getState().clearSelection(), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
    undo(n) {
      this.resultIds.length > 0 && n.library.remove_elements(this.resultIds);
      const r = ni(n.library, this.snapshots), o = this.currentIds.indexOf(this.currentBaseId);
      this.currentIds = r, o >= 0 && o < r.length && (this.currentBaseId = r[o]), this.resultIds = [], oe.getState().selectAll(r), n.renderer.sync_from_library(n.library), n.renderer.mark_dirty();
    }
  }
  class t2 {
    constructor(n) {
      __publicField(this, "type", "add-image");
      __publicField(this, "description", "Insert image");
      this.entry = n;
    }
    execute(n) {
      Ot.getState().addImage(this.entry), oe.getState().select(Jo(this.entry.id));
    }
    undo(n) {
      Ot.getState().removeImage(this.entry.id), oe.getState().clearSelection();
    }
  }
  class A0 {
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
      oe.getState().clearSelection();
    }
    undo(n) {
      const r = [];
      for (const o of this.snapshots) Ot.getState().addImage(o), r.push(Jo(o.id));
      r.length > 0 && oe.getState().selectAll(r);
    }
  }
  class n2 {
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
  class l2 {
    constructor(n, r, o) {
      __publicField(this, "type", "move-images");
      __publicField(this, "description", "Move images");
      this.imageIds = n, this.deltaX = r, this.deltaY = o;
    }
    execute(n) {
      const r = Ot.getState();
      for (const o of this.imageIds) {
        const s = Yr(o), c = r.images.get(s);
        c && r.updateImage(s, {
          x: c.x + this.deltaX,
          y: c.y + this.deltaY
        });
      }
    }
    undo(n) {
      const r = Ot.getState();
      for (const o of this.imageIds) {
        const s = Yr(o), c = r.images.get(s);
        c && r.updateImage(s, {
          x: c.x - this.deltaX,
          y: c.y - this.deltaY
        });
      }
    }
  }
  class r2 {
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
  const ln = wt()((l) => ({
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
  })), zf = wt()((l, n) => ({
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
  })), Ft = wt((l) => ({
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
  function T0(l) {
    var n, r, o = "";
    if (typeof l == "string" || typeof l == "number") o += l;
    else if (typeof l == "object") if (Array.isArray(l)) {
      var s = l.length;
      for (n = 0; n < s; n++) l[n] && (r = T0(l[n])) && (o && (o += " "), o += r);
    } else for (r in l) l[r] && (o && (o += " "), o += r);
    return o;
  }
  function a2() {
    for (var l, n, r = 0, o = "", s = arguments.length; r < s; r++) (l = arguments[r]) && (n = T0(l)) && (o && (o += " "), o += n);
    return o;
  }
  const oh = "-", o2 = (l) => {
    const n = s2(l), { conflictingClassGroups: r, conflictingClassGroupModifiers: o } = l;
    return {
      getClassGroupId: (f) => {
        const d = f.split(oh);
        return d[0] === "" && d.length !== 1 && d.shift(), N0(d, n) || i2(f);
      },
      getConflictingClassGroupIds: (f, d) => {
        const m = r[f] || [];
        return d && o[f] ? [
          ...m,
          ...o[f]
        ] : m;
      }
    };
  }, N0 = (l, n) => {
    var _a;
    if (l.length === 0) return n.classGroupId;
    const r = l[0], o = n.nextPart.get(r), s = o ? N0(l.slice(1), o) : void 0;
    if (s) return s;
    if (n.validators.length === 0) return;
    const c = l.join(oh);
    return (_a = n.validators.find(({ validator: f }) => f(c))) == null ? void 0 : _a.classGroupId;
  }, _y = /^\[(.+)\]$/, i2 = (l) => {
    if (_y.test(l)) {
      const n = _y.exec(l)[1], r = n == null ? void 0 : n.substring(0, n.indexOf(":"));
      if (r) return "arbitrary.." + r;
    }
  }, s2 = (l) => {
    const { theme: n, prefix: r } = l, o = {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    };
    return u2(Object.entries(l.classGroups), r).forEach(([c, f]) => {
      Hf(f, o, c, n);
    }), o;
  }, Hf = (l, n, r, o) => {
    l.forEach((s) => {
      if (typeof s == "string") {
        const c = s === "" ? n : ky(n, s);
        c.classGroupId = r;
        return;
      }
      if (typeof s == "function") {
        if (c2(s)) {
          Hf(s(o), n, r, o);
          return;
        }
        n.validators.push({
          validator: s,
          classGroupId: r
        });
        return;
      }
      Object.entries(s).forEach(([c, f]) => {
        Hf(f, ky(n, c), r, o);
      });
    });
  }, ky = (l, n) => {
    let r = l;
    return n.split(oh).forEach((o) => {
      r.nextPart.has(o) || r.nextPart.set(o, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      }), r = r.nextPart.get(o);
    }), r;
  }, c2 = (l) => l.isThemeGetter, u2 = (l, n) => n ? l.map(([r, o]) => {
    const s = o.map((c) => typeof c == "string" ? n + c : typeof c == "object" ? Object.fromEntries(Object.entries(c).map(([f, d]) => [
      n + f,
      d
    ])) : c);
    return [
      r,
      s
    ];
  }) : l, d2 = (l) => {
    if (l < 1) return {
      get: () => {
      },
      set: () => {
      }
    };
    let n = 0, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
    const s = (c, f) => {
      r.set(c, f), n++, n > l && (n = 0, o = r, r = /* @__PURE__ */ new Map());
    };
    return {
      get(c) {
        let f = r.get(c);
        if (f !== void 0) return f;
        if ((f = o.get(c)) !== void 0) return s(c, f), f;
      },
      set(c, f) {
        r.has(c) ? r.set(c, f) : s(c, f);
      }
    };
  }, O0 = "!", f2 = (l) => {
    const { separator: n, experimentalParseClassName: r } = l, o = n.length === 1, s = n[0], c = n.length, f = (d) => {
      const m = [];
      let p = 0, v = 0, b;
      for (let C = 0; C < d.length; C++) {
        let _ = d[C];
        if (p === 0) {
          if (_ === s && (o || d.slice(C, C + c) === n)) {
            m.push(d.slice(v, C)), v = C + c;
            continue;
          }
          if (_ === "/") {
            b = C;
            continue;
          }
        }
        _ === "[" ? p++ : _ === "]" && p--;
      }
      const S = m.length === 0 ? d : d.substring(v), E = S.startsWith(O0), k = E ? S.substring(1) : S, w = b && b > v ? b - v : void 0;
      return {
        modifiers: m,
        hasImportantModifier: E,
        baseClassName: k,
        maybePostfixModifierPosition: w
      };
    };
    return r ? (d) => r({
      className: d,
      parseClassName: f
    }) : f;
  }, h2 = (l) => {
    if (l.length <= 1) return l;
    const n = [];
    let r = [];
    return l.forEach((o) => {
      o[0] === "[" ? (n.push(...r.sort(), o), r = []) : r.push(o);
    }), n.push(...r.sort()), n;
  }, m2 = (l) => ({
    cache: d2(l.cacheSize),
    parseClassName: f2(l),
    ...o2(l)
  }), g2 = /\s+/, p2 = (l, n) => {
    const { parseClassName: r, getClassGroupId: o, getConflictingClassGroupIds: s } = n, c = [], f = l.trim().split(g2);
    let d = "";
    for (let m = f.length - 1; m >= 0; m -= 1) {
      const p = f[m], { modifiers: v, hasImportantModifier: b, baseClassName: S, maybePostfixModifierPosition: E } = r(p);
      let k = !!E, w = o(k ? S.substring(0, E) : S);
      if (!w) {
        if (!k) {
          d = p + (d.length > 0 ? " " + d : d);
          continue;
        }
        if (w = o(S), !w) {
          d = p + (d.length > 0 ? " " + d : d);
          continue;
        }
        k = false;
      }
      const C = h2(v).join(":"), _ = b ? C + O0 : C, T = _ + w;
      if (c.includes(T)) continue;
      c.push(T);
      const A = s(w, k);
      for (let j = 0; j < A.length; ++j) {
        const U = A[j];
        c.push(_ + U);
      }
      d = p + (d.length > 0 ? " " + d : d);
    }
    return d;
  };
  function y2() {
    let l = 0, n, r, o = "";
    for (; l < arguments.length; ) (n = arguments[l++]) && (r = D0(n)) && (o && (o += " "), o += r);
    return o;
  }
  const D0 = (l) => {
    if (typeof l == "string") return l;
    let n, r = "";
    for (let o = 0; o < l.length; o++) l[o] && (n = D0(l[o])) && (r && (r += " "), r += n);
    return r;
  };
  function b2(l, ...n) {
    let r, o, s, c = f;
    function f(m) {
      const p = n.reduce((v, b) => b(v), l());
      return r = m2(p), o = r.cache.get, s = r.cache.set, c = d, d(m);
    }
    function d(m) {
      const p = o(m);
      if (p) return p;
      const v = p2(m, r);
      return s(m, v), v;
    }
    return function() {
      return c(y2.apply(null, arguments));
    };
  }
  const vt = (l) => {
    const n = (r) => r[l] || [];
    return n.isThemeGetter = true, n;
  }, I0 = /^\[(?:([a-z-]+):)?(.+)\]$/i, v2 = /^\d+\/\d+$/, x2 = /* @__PURE__ */ new Set([
    "px",
    "full",
    "screen"
  ]), w2 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, S2 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, C2 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, E2 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, _2 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ml = (l) => za(l) || x2.has(l) || v2.test(l), or = (l) => Ua(l, "length", N2), za = (l) => !!l && !Number.isNaN(Number(l)), Hd = (l) => Ua(l, "number", za), Do = (l) => !!l && Number.isInteger(Number(l)), k2 = (l) => l.endsWith("%") && za(l.slice(0, -1)), Ye = (l) => I0.test(l), ir = (l) => w2.test(l), M2 = /* @__PURE__ */ new Set([
    "length",
    "size",
    "percentage"
  ]), j2 = (l) => Ua(l, M2, z0), L2 = (l) => Ua(l, "position", z0), R2 = /* @__PURE__ */ new Set([
    "image",
    "url"
  ]), A2 = (l) => Ua(l, R2, D2), T2 = (l) => Ua(l, "", O2), Io = () => true, Ua = (l, n, r) => {
    const o = I0.exec(l);
    return o ? o[1] ? typeof n == "string" ? o[1] === n : n.has(o[1]) : r(o[2]) : false;
  }, N2 = (l) => S2.test(l) && !C2.test(l), z0 = () => false, O2 = (l) => E2.test(l), D2 = (l) => _2.test(l), I2 = () => {
    const l = vt("colors"), n = vt("spacing"), r = vt("blur"), o = vt("brightness"), s = vt("borderColor"), c = vt("borderRadius"), f = vt("borderSpacing"), d = vt("borderWidth"), m = vt("contrast"), p = vt("grayscale"), v = vt("hueRotate"), b = vt("invert"), S = vt("gap"), E = vt("gradientColorStops"), k = vt("gradientColorStopPositions"), w = vt("inset"), C = vt("margin"), _ = vt("opacity"), T = vt("padding"), A = vt("saturate"), j = vt("scale"), U = vt("sepia"), N = vt("skew"), R = vt("space"), O = vt("translate"), H = () => [
      "auto",
      "contain",
      "none"
    ], G = () => [
      "auto",
      "hidden",
      "clip",
      "visible",
      "scroll"
    ], te = () => [
      "auto",
      Ye,
      n
    ], ee = () => [
      Ye,
      n
    ], fe = () => [
      "",
      Ml,
      or
    ], me = () => [
      "auto",
      za,
      Ye
    ], Ee = () => [
      "bottom",
      "center",
      "left",
      "left-bottom",
      "left-top",
      "right",
      "right-bottom",
      "right-top",
      "top"
    ], q = () => [
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
    ], ce = () => [
      "start",
      "end",
      "center",
      "between",
      "around",
      "evenly",
      "stretch"
    ], _e = () => [
      "",
      "0",
      Ye
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
      za,
      Ye
    ];
    return {
      cacheSize: 500,
      separator: ":",
      theme: {
        colors: [
          Io
        ],
        spacing: [
          Ml,
          or
        ],
        blur: [
          "none",
          "",
          ir,
          Ye
        ],
        brightness: L(),
        borderColor: [
          l
        ],
        borderRadius: [
          "none",
          "",
          "full",
          ir,
          Ye
        ],
        borderSpacing: ee(),
        borderWidth: fe(),
        contrast: L(),
        grayscale: _e(),
        hueRotate: L(),
        invert: _e(),
        gap: ee(),
        gradientColorStops: [
          l
        ],
        gradientColorStopPositions: [
          k2,
          or
        ],
        inset: te(),
        margin: te(),
        opacity: L(),
        padding: ee(),
        saturate: L(),
        scale: L(),
        sepia: _e(),
        skew: L(),
        space: ee(),
        translate: ee()
      },
      classGroups: {
        aspect: [
          {
            aspect: [
              "auto",
              "square",
              "video",
              Ye
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
              ...Ee(),
              Ye
            ]
          }
        ],
        overflow: [
          {
            overflow: G()
          }
        ],
        "overflow-x": [
          {
            "overflow-x": G()
          }
        ],
        "overflow-y": [
          {
            "overflow-y": G()
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
              Do,
              Ye
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
              Ye
            ]
          }
        ],
        grow: [
          {
            grow: _e()
          }
        ],
        shrink: [
          {
            shrink: _e()
          }
        ],
        order: [
          {
            order: [
              "first",
              "last",
              "none",
              Do,
              Ye
            ]
          }
        ],
        "grid-cols": [
          {
            "grid-cols": [
              Io
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
                  Do,
                  Ye
                ]
              },
              Ye
            ]
          }
        ],
        "col-start": [
          {
            "col-start": me()
          }
        ],
        "col-end": [
          {
            "col-end": me()
          }
        ],
        "grid-rows": [
          {
            "grid-rows": [
              Io
            ]
          }
        ],
        "row-start-end": [
          {
            row: [
              "auto",
              {
                span: [
                  Do,
                  Ye
                ]
              },
              Ye
            ]
          }
        ],
        "row-start": [
          {
            "row-start": me()
          }
        ],
        "row-end": [
          {
            "row-end": me()
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
              Ye
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
              Ye
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
              ...ce()
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
              ...ce(),
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
              ...ce(),
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
              T
            ]
          }
        ],
        px: [
          {
            px: [
              T
            ]
          }
        ],
        py: [
          {
            py: [
              T
            ]
          }
        ],
        ps: [
          {
            ps: [
              T
            ]
          }
        ],
        pe: [
          {
            pe: [
              T
            ]
          }
        ],
        pt: [
          {
            pt: [
              T
            ]
          }
        ],
        pr: [
          {
            pr: [
              T
            ]
          }
        ],
        pb: [
          {
            pb: [
              T
            ]
          }
        ],
        pl: [
          {
            pl: [
              T
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
              R
            ]
          }
        ],
        "space-x-reverse": [
          "space-x-reverse"
        ],
        "space-y": [
          {
            "space-y": [
              R
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
              Ye,
              n
            ]
          }
        ],
        "min-w": [
          {
            "min-w": [
              Ye,
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
              Ye,
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
              Ye,
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
              Ye,
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
              Ye,
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
              Ye,
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
              Io
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
              Ye
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
              Ye
            ]
          }
        ],
        "list-image": [
          {
            "list-image": [
              "none",
              Ye
            ]
          }
        ],
        "list-style-type": [
          {
            list: [
              "none",
              "disc",
              "decimal",
              Ye
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
              ...q(),
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
              Ye
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
            indent: ee()
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
              Ye
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
              Ye
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
              ...Ee(),
              L2
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
              j2
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
              A2
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
              d
            ]
          }
        ],
        "border-w-x": [
          {
            "border-x": [
              d
            ]
          }
        ],
        "border-w-y": [
          {
            "border-y": [
              d
            ]
          }
        ],
        "border-w-s": [
          {
            "border-s": [
              d
            ]
          }
        ],
        "border-w-e": [
          {
            "border-e": [
              d
            ]
          }
        ],
        "border-w-t": [
          {
            "border-t": [
              d
            ]
          }
        ],
        "border-w-r": [
          {
            "border-r": [
              d
            ]
          }
        ],
        "border-w-b": [
          {
            "border-b": [
              d
            ]
          }
        ],
        "border-w-l": [
          {
            "border-l": [
              d
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
              ...q(),
              "hidden"
            ]
          }
        ],
        "divide-x": [
          {
            "divide-x": [
              d
            ]
          }
        ],
        "divide-x-reverse": [
          "divide-x-reverse"
        ],
        "divide-y": [
          {
            "divide-y": [
              d
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
            divide: q()
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
              ...q()
            ]
          }
        ],
        "outline-offset": [
          {
            "outline-offset": [
              Ml,
              Ye
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
            ring: fe()
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
              T2
            ]
          }
        ],
        "shadow-color": [
          {
            shadow: [
              Io
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
              Ye
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
              A
            ]
          }
        ],
        sepia: [
          {
            sepia: [
              U
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
              A
            ]
          }
        ],
        "backdrop-sepia": [
          {
            "backdrop-sepia": [
              U
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
              Ye
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
              Ye
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
              Ye
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
              j
            ]
          }
        ],
        "scale-x": [
          {
            "scale-x": [
              j
            ]
          }
        ],
        "scale-y": [
          {
            "scale-y": [
              j
            ]
          }
        ],
        rotate: [
          {
            rotate: [
              Do,
              Ye
            ]
          }
        ],
        "translate-x": [
          {
            "translate-x": [
              O
            ]
          }
        ],
        "translate-y": [
          {
            "translate-y": [
              O
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
              Ye
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
              Ye
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
            "scroll-m": ee()
          }
        ],
        "scroll-mx": [
          {
            "scroll-mx": ee()
          }
        ],
        "scroll-my": [
          {
            "scroll-my": ee()
          }
        ],
        "scroll-ms": [
          {
            "scroll-ms": ee()
          }
        ],
        "scroll-me": [
          {
            "scroll-me": ee()
          }
        ],
        "scroll-mt": [
          {
            "scroll-mt": ee()
          }
        ],
        "scroll-mr": [
          {
            "scroll-mr": ee()
          }
        ],
        "scroll-mb": [
          {
            "scroll-mb": ee()
          }
        ],
        "scroll-ml": [
          {
            "scroll-ml": ee()
          }
        ],
        "scroll-p": [
          {
            "scroll-p": ee()
          }
        ],
        "scroll-px": [
          {
            "scroll-px": ee()
          }
        ],
        "scroll-py": [
          {
            "scroll-py": ee()
          }
        ],
        "scroll-ps": [
          {
            "scroll-ps": ee()
          }
        ],
        "scroll-pe": [
          {
            "scroll-pe": ee()
          }
        ],
        "scroll-pt": [
          {
            "scroll-pt": ee()
          }
        ],
        "scroll-pr": [
          {
            "scroll-pr": ee()
          }
        ],
        "scroll-pb": [
          {
            "scroll-pb": ee()
          }
        ],
        "scroll-pl": [
          {
            "scroll-pl": ee()
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
              Ye
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
  }, z2 = b2(I2);
  function B(...l) {
    return z2(a2(l));
  }
  const My = 38, js = 16;
  function ol(l) {
    const n = l.getBoundingClientRect(), { zenMode: r, explorerCollapsed: o, sidebarCollapsed: s, explorerWidth: c, sidebarWidth: f } = pe.getState();
    let d = 0, m = 0;
    r || (d = o ? My + js : c + js, m = s ? My + js : f + js);
    const p = Math.max(1, n.width - d - m), v = n.height;
    return {
      width: p,
      height: v,
      screenCenter: {
        x: d + p / 2,
        y: v / 2
      }
    };
  }
  const H2 = typeof navigator < "u" && /Mac|iPod|iPhone|iPad/.test(navigator.platform), Ie = {
    mod: H2 ? "\u2318" : "Ctrl",
    shift: "\u21E7",
    backspace: "\u232B"
  };
  function Ur(l, n) {
    const r = oe.getState().selectedIds;
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
    ze.getState().centerOnBounds(s, c.width, c.height, c.screenCenter);
  }
  const U2 = /* @__PURE__ */ new Set([
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
  ]);
  function Y2(l, n, r) {
    const o = ze((b) => b.zoomAt), s = ze((b) => b.pan), c = ze((b) => b.zoomToFit), f = ze((b) => b.zoomToSelected), d = Xt((b) => b.setTool), m = g.useRef(/* @__PURE__ */ new Set()), p = g.useRef(false), v = g.useRef(null);
    g.useEffect(() => {
      const b = () => {
        const C = m.current;
        if (C.size === 0) {
          v.current = null;
          return;
        }
        const _ = p.current ? uS : cS;
        let T = 0, A = 0;
        C.has("ArrowUp") && (A += _), C.has("ArrowDown") && (A -= _), C.has("ArrowLeft") && (T += _), C.has("ArrowRight") && (T -= _), (T !== 0 || A !== 0) && s(T, A), v.current = requestAnimationFrame(b);
      }, S = () => {
        v.current === null && m.current.size > 0 && (v.current = requestAnimationFrame(b));
      }, E = (C) => {
        const _ = l.current;
        if (!_) return;
        if (p.current = C.shiftKey, (C.metaKey || C.ctrlKey) && (C.key === "k" || C.key === "K")) {
          C.preventDefault(), ln.getState().toggle();
          return;
        }
        if (!zf.getState().isCanvasActive() || C.target instanceof HTMLInputElement || C.target instanceof HTMLTextAreaElement || Ft.getState().isEditingText) return;
        if (C.key === "/" && !C.metaKey && !C.ctrlKey && !C.altKey) {
          C.preventDefault(), ln.getState().open();
          return;
        }
        if (U2.has(C.key)) {
          C.preventDefault(), m.current.add(C.key), S();
          return;
        }
        const T = _.getBoundingClientRect(), A = T.width / 2, j = T.height / 2, U = C.shiftKey ? iS : lc, N = C.shiftKey ? sS : rc;
        switch (C.key) {
          case "=":
          case "+":
            C.preventDefault(), o(U, A, j);
            break;
          case "-":
          case "_":
            C.preventDefault(), o(N, A, j);
            break;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "a" || C.key === "A")) {
          if (C.preventDefault(), n) {
            const R = n.get_all_ids();
            oe.getState().selectAll(R);
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "c" || C.key === "C") && !C.shiftKey) {
          if (C.preventDefault(), n) {
            const { selectedIds: R } = oe.getState();
            if (R.size > 0) {
              const O = mr(n, R);
              zn.getState().copy(O);
            }
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "v" || C.key === "V") && !C.shiftKey) {
          if (C.preventDefault(), n && r && _) {
            const { hasContent: R } = zn.getState();
            if (R) {
              const O = new cc();
              de.getState().execute(O, {
                library: n,
                renderer: r
              }), Ur(n, _);
            }
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && (C.key === "b" || C.key === "B") && !C.shiftKey) {
          if (C.preventDefault(), n && r && _) {
            const { selectedIds: R } = oe.getState();
            if (R.size > 0) {
              const O = new uc([
                ...R
              ]);
              de.getState().execute(O, {
                library: n,
                renderer: r
              }), Ur(n, _);
            }
          }
          return;
        }
        if (C.key === "Delete" || C.key === "Backspace") {
          C.preventDefault();
          const { selectedRulerIds: R } = Ne.getState();
          if (R.size > 0 && n && r) {
            const O = new th([
              ...R
            ]);
            de.getState().execute(O, {
              library: n,
              renderer: r
            });
            return;
          }
          if (n && r) {
            const { selectedIds: O } = oe.getState();
            if (O.size > 0) {
              const H = [], G = [];
              for (const te of O) Sn(te) ? H.push(te) : G.push(te);
              if (H.length > 0) {
                const te = new A0(H.map(Yr));
                de.getState().execute(te, {
                  library: n,
                  renderer: r
                });
              }
              if (G.length > 0) {
                const te = new sc(G);
                de.getState().execute(te, {
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
            const { canUndo: R, undo: O } = de.getState();
            R && O({
              library: n,
              renderer: r
            });
          }
          return;
        }
        if ((C.metaKey || C.ctrlKey) && ((C.key === "z" || C.key === "Z") && C.shiftKey || C.key === "y" || C.key === "Y")) {
          if (C.preventDefault(), n && r) {
            const { canRedo: R, redo: O } = de.getState();
            R && O({
              library: n,
              renderer: r
            });
          }
          return;
        }
        if (C.key === "Tab") {
          if (C.preventDefault(), n && _) {
            const R = n.get_group_representative_ids();
            if (R.length > 0) {
              C.shiftKey ? oe.getState().selectPrevious(R) : oe.getState().selectNext(R);
              const H = oe.getState().lastSelectedId;
              if (H) {
                const G = n.get_group_ids(H);
                G.length > 1 && oe.setState({
                  selectedIds: new Set(G),
                  lastSelectedId: H
                });
              }
              Ur(n, _);
            }
          }
          return;
        }
        if (C.key === "Enter" && (Xt.getState().activeTool === "rectangle" || Xt.getState().activeTool === "polygon" || Xt.getState().activeTool === "text")) {
          if (Date.now() - Xt.getState().toolSetAt > 2e3) return;
          if (C.preventDefault(), n && r && _) {
            const O = Xt.getState().activeTool;
            O === "rectangle" ? E0(n, r, _) : O === "polygon" ? _0(n, r, _) : k0(n, r, _);
          }
          return;
        }
        if (!(C.metaKey || C.ctrlKey)) switch (C.key) {
          case "Escape":
            C.preventDefault(), Ne.getState().activeRulerId ? Ne.getState().cancelCreation() : Ne.getState().selectedRulerIds.size > 0 ? Ne.getState().clearSelection() : oe.getState().selectedIds.size > 0 ? oe.getState().clearSelection() : d("select");
            break;
          case "v":
          case "V":
            C.preventDefault(), d("select");
            break;
          case "p":
          case "P":
            C.preventDefault(), d("pan");
            break;
          case "q":
          case "Q":
            C.preventDefault(), d("laser");
            break;
          case "z":
          case "Z":
            C.preventDefault(), d("zoom");
            break;
          case "r":
          case "R":
            C.preventDefault(), d("rectangle");
            break;
          case "m":
          case "M":
            C.preventDefault(), d("move");
            break;
          case "g":
          case "G":
            C.preventDefault(), d("polygon");
            break;
          case "h":
          case "H":
            C.preventDefault(), d("path");
            break;
          case "t":
            C.preventDefault(), d("text");
            break;
          case "u":
          case "U":
            C.preventDefault(), d("ruler");
            break;
          case "i":
            C.preventDefault(), ln.getState().open("add instance ");
            break;
          case "f":
            if (C.preventDefault(), n && _) {
              const R = n.get_all_bounds(), O = R ? {
                minX: R[0],
                minY: R[1],
                maxX: R[2],
                maxY: R[3]
              } : null, H = ol(_);
              c(O, H.width, H.height, H.screenCenter);
            }
            break;
          case "F":
            if (C.preventDefault(), n && _) {
              const R = oe.getState().selectedIds;
              if (R.size > 0) {
                const O = n.get_bounds_for_ids([
                  ...R
                ]), H = O ? {
                  minX: O[0],
                  minY: O[1],
                  maxX: O[2],
                  maxY: O[3]
                } : null, G = ol(_);
                f(H, G.width, G.height, G.screenCenter);
              }
            }
            break;
          case "E":
            if (C.shiftKey) {
              C.preventDefault(), pe.getState().explorerCollapsed && pe.getState().toggleExplorerCollapsed(), he.getState().setFocused(true);
              break;
            }
            C.preventDefault(), oe.getState().selectedIds.size > 0 && pe.getState().requestInspectorFocus();
            break;
          case "e":
            C.preventDefault(), oe.getState().selectedIds.size > 0 && pe.getState().requestInspectorFocus();
            break;
          case "L":
            C.preventDefault(), pe.getState().setSidebarTab("layers"), ye.getState().setFocused(true);
            break;
          case "I":
            C.preventDefault(), pe.getState().setSidebarTab("inspector");
            break;
        }
      }, k = (C) => {
        p.current = C.shiftKey, m.current.delete(C.key);
      }, w = () => {
        m.current.clear(), p.current = false;
      };
      return window.addEventListener("keydown", E), window.addEventListener("keyup", k), window.addEventListener("blur", w), () => {
        window.removeEventListener("keydown", E), window.removeEventListener("keyup", k), window.removeEventListener("blur", w), v.current !== null && cancelAnimationFrame(v.current);
      };
    }, [
      l,
      o,
      s,
      d,
      n,
      r,
      c,
      f
    ]);
  }
  const B2 = 500, X2 = 1, V2 = wt((l, n) => ({
    points: [],
    opacity: 1,
    isDrawing: false,
    addPoint: (r) => {
      const { points: o, isDrawing: s } = n();
      if (!s) return;
      if (o.length > 0) {
        const f = o[o.length - 1], d = r.x - f.x, m = r.y - f.y;
        if (Math.sqrt(d * d + m * m) < X2) return;
      }
      const c = [
        ...o,
        r
      ];
      c.length > B2 && c.shift(), l({
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
  })), $2 = 300, jy = 16;
  function q2(l, n, r, o) {
    const s = 1 - o;
    return {
      x: s * s * l.x + 2 * s * o * n.x + o * o * r.x,
      y: s * s * l.y + 2 * s * o * n.y + o * o * r.y
    };
  }
  function G2(l) {
    if (l.length < 3) return l;
    const n = [
      l[0]
    ];
    for (let r = 1; r < l.length - 1; r++) {
      const o = l[r - 1], s = l[r], c = l[r + 1], f = {
        x: (o.x + s.x) / 2,
        y: (o.y + s.y) / 2
      }, d = {
        x: (s.x + c.x) / 2,
        y: (s.y + c.y) / 2
      };
      r === 1 && n.push(f);
      for (let m = 1; m <= jy; m++) {
        const p = m / jy;
        n.push(q2(f, s, d, p));
      }
    }
    return n.push(l[l.length - 1]), n;
  }
  function P2(l, n) {
    const r = Xt((_) => _.activeTool), { points: o, opacity: s, isDrawing: c, addPoint: f, startDrawing: d, stopDrawing: m, setOpacity: p, reset: v } = V2(), b = g.useRef(null), S = g.useRef(null);
    g.useEffect(() => {
      if (!(!l || !n)) if (o.length === 0) l.clear_laser();
      else {
        const _ = G2(o), T = window.devicePixelRatio || 1, A = new Float64Array(_.length * 2);
        for (let j = 0; j < _.length; j++) A[j * 2] = _[j].x * T, A[j * 2 + 1] = _[j].y * T;
        l.set_laser_points(A);
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
      S.current !== null && cancelAnimationFrame(S.current), b.current = performance.now();
      const _ = (T) => {
        if (b.current === null) return;
        const A = T - b.current, j = Math.min(A / $2, 1);
        if (j >= 1) {
          b.current = null, S.current = null, v();
          return;
        }
        p(1 - j), S.current = requestAnimationFrame(_);
      };
      S.current = requestAnimationFrame(_);
    }, [
      v,
      p
    ]), k = g.useCallback((_) => {
      r !== "laser" || _.button !== 0 || (S.current !== null && (cancelAnimationFrame(S.current), S.current = null, b.current = null), d(), f({
        x: _.clientX,
        y: _.clientY
      }));
    }, [
      r,
      d,
      f
    ]), w = g.useCallback((_) => {
      r !== "laser" || !c || f({
        x: _.clientX,
        y: _.clientY
      });
    }, [
      r,
      c,
      f
    ]), C = g.useCallback(() => {
      r !== "laser" || !c || (m(), E());
    }, [
      r,
      c,
      m,
      E
    ]);
    return g.useEffect(() => () => {
      S.current !== null && cancelAnimationFrame(S.current);
    }, []), g.useEffect(() => {
      r !== "laser" && (S.current !== null && (cancelAnimationFrame(S.current), S.current = null, b.current = null), v());
    }, [
      r,
      v
    ]), {
      handleMouseDown: k,
      handleMouseMove: w,
      handleMouseUp: C,
      isLaserActive: r === "laser"
    };
  }
  const K2 = wt((l, n) => ({
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
  function Z2(l) {
    const n = Xt((E) => E.activeTool), { box: r, isDrawing: o, startDrawing: s, updateBox: c, reset: f } = K2(), { zoom: d, offset: m, zoomToBounds: p } = ze(), v = g.useCallback((E) => {
      if (n !== "zoom" || E.button !== 0) return;
      const k = l.current;
      if (!k) return;
      const w = k.getBoundingClientRect(), C = E.clientX - w.left, _ = E.clientY - w.top;
      s(C, _);
    }, [
      n,
      l,
      s
    ]), b = g.useCallback((E) => {
      if (n !== "zoom" || !o) return;
      const k = l.current;
      if (!k) return;
      const w = k.getBoundingClientRect(), C = E.clientX - w.left, _ = E.clientY - w.top;
      c(C, _);
    }, [
      n,
      o,
      l,
      c
    ]), S = g.useCallback(() => {
      if (n !== "zoom" || !o || !r) {
        f();
        return;
      }
      const E = l.current;
      if (Math.abs(r.width) > 5 && Math.abs(r.height) > 5 && E) {
        const k = Math.min(r.x, r.x + r.width), w = Math.max(r.x, r.x + r.width), C = Math.min(r.y, r.y + r.height), _ = Math.max(r.y, r.y + r.height), T = (k - m.x) / d, A = (w - m.x) / d, j = (C - m.y) / d, U = (_ - m.y) / d, N = {
          minX: T,
          maxX: A,
          minY: j,
          maxY: U
        }, R = ol(E);
        R.width > 0 && R.height > 0 && p(N, R.width, R.height, R.screenCenter);
      }
      f();
    }, [
      n,
      o,
      r,
      d,
      m,
      p,
      f,
      l
    ]);
    return g.useEffect(() => {
      n !== "zoom" && f();
    }, [
      n,
      f
    ]), {
      handleMouseDown: v,
      handleMouseMove: b,
      handleMouseUp: S,
      box: r,
      isZoomActive: n === "zoom",
      isDrawingZoom: o
    };
  }
  function La(l) {
    return Math.round(l / Se) * Se;
  }
  const jl = new Float64Array(8), zo = new Float32Array(4);
  function F2(l, n, r) {
    const o = g.useRef(null), s = g.useRef(false), c = g.useRef([
      0.5,
      0.5,
      0.5,
      0.5
    ]), f = g.useCallback((v) => {
      if (v.button !== 0) return;
      const S = v.currentTarget.getBoundingClientRect(), E = v.clientX - S.left, k = v.clientY - S.top, w = l(E, k);
      if (!w) return;
      const C = La(w.x), _ = La(w.y);
      o.current = {
        x: C,
        y: _
      }, s.current = true;
      const T = ye.getState().activeLayerId, j = ye.getState().layers.get(T);
      if (j) {
        const [U, N, R] = oc(j.color, 0.5);
        c.current = [
          U,
          N,
          R,
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
    ]), d = g.useCallback((v, b) => {
      const S = o.current;
      if (!s.current || !S || !r) return false;
      const E = l(v, b);
      if (!E) return false;
      const k = La(E.x), w = La(E.y), C = Math.min(S.x, k), _ = Math.min(S.y, w), T = Math.max(S.x, k), A = Math.max(S.y, w);
      jl[0] = C, jl[1] = _, jl[2] = T, jl[3] = _, jl[4] = T, jl[5] = A, jl[6] = C, jl[7] = A;
      const j = c.current;
      return zo[0] = j[0], zo[1] = j[1], zo[2] = j[2], zo[3] = j[3], r.set_preview_shape(jl, zo), r.mark_dirty(), true;
    }, [
      l,
      r
    ]), m = g.useCallback((v, b) => {
      const S = o.current;
      if (!S || !n || !r) return;
      const E = La(v), k = La(b), w = Math.min(S.x, E), C = Math.min(S.y, k), _ = Math.abs(E - S.x), T = Math.abs(k - S.y);
      if (_ > 0 && T > 0) {
        const A = ye.getState().activeLayerId, U = ye.getState().layers.get(A), N = (U == null ? void 0 : U.layerNumber) ?? 1, R = (U == null ? void 0 : U.datatype) ?? 0, O = new m0(w, C, _, T, N, R);
        de.getState().execute(O, {
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
      handleMouseDown: f,
      handleMouseMove: d,
      finalizeRectangle: m,
      cancelDrawing: p
    };
  }
  function Ls(l) {
    return Math.round(l / Se) * Se;
  }
  function Ly(l, n, r, o) {
    const s = (l.x - n.x) * r, c = (l.y - n.y) * r;
    return Math.sqrt(s * s + c * c) <= o;
  }
  const Ry = 10, Ay = 8, Q2 = 6;
  function Ty(l, n, r) {
    const o = Q2 / r;
    let s = null, c = null, f = l.x, d = l.y;
    for (const m of n) if (s === null && Math.abs(l.x - m.x) <= o && (f = m.x, s = m), c === null && Math.abs(l.y - m.y) <= o && (d = m.y, c = m), s !== null && c !== null) break;
    return {
      point: {
        x: f,
        y: d
      },
      guides: {
        alignedVertexX: s,
        alignedVertexY: c
      }
    };
  }
  function Ny(l, n) {
    const r = n.x - l.x, o = n.y - l.y;
    if (r === 0 && o === 0) return n;
    const s = Math.abs(Math.atan2(Math.abs(o), Math.abs(r)) * (180 / Math.PI));
    return s <= Ay ? {
      x: n.x,
      y: l.y
    } : s >= 90 - Ay ? {
      x: l.x,
      y: n.y
    } : n;
  }
  function W2(l, n, r, o) {
    const [s, c] = g.useState([]), [f, d] = g.useState(false), [m, p] = g.useState(null), [v, b] = g.useState(false), [S, E] = g.useState(null), k = ye((U) => U.activeLayerId), w = ye((U) => U.layers), C = Xt((U) => U.activeTool);
    g.useEffect(() => {
      C !== "polygon" && (c([]), d(false), p(null), b(false), E(null));
    }, [
      C
    ]);
    const _ = g.useCallback((U) => {
      if (!n || !r || U.length < 3) return;
      const N = new Float64Array(U.length * 2);
      for (let te = 0; te < U.length; te++) N[te * 2] = U[te].x, N[te * 2 + 1] = U[te].y;
      const R = w.get(k), O = (R == null ? void 0 : R.layerNumber) ?? 1, H = (R == null ? void 0 : R.datatype) ?? 0, G = new p0(N, O, H);
      de.getState().execute(G, {
        library: n,
        renderer: r
      }), c([]), d(false), p(null), b(false);
    }, [
      n,
      r,
      k,
      w
    ]), T = g.useCallback((U) => {
      if (U.button !== 0) return;
      const R = U.currentTarget.getBoundingClientRect(), O = U.clientX - R.left, H = U.clientY - R.top, G = l(O, H);
      if (!G) return;
      let te = {
        x: Ls(G.x),
        y: Ls(G.y)
      };
      if (s.length > 0 && !U.shiftKey && (te = Ty(te, s, o).point, te = Ny(s[s.length - 1], te)), s.length >= 3) {
        const me = s[0];
        if (Ly(me, te, o, Ry)) {
          _(s);
          return;
        }
      }
      const ee = s[s.length - 1];
      if (ee && te.x === ee.x && te.y === ee.y) return;
      const fe = [
        ...s,
        te
      ];
      c(fe), d(true);
    }, [
      l,
      s,
      o,
      _
    ]), A = g.useCallback((U) => {
      const R = U.currentTarget.getBoundingClientRect(), O = U.clientX - R.left, H = U.clientY - R.top, G = l(O, H);
      if (!G) return;
      let te = {
        x: Ls(G.x),
        y: Ls(G.y)
      }, ee = null;
      if (s.length > 0 && !U.shiftKey) {
        const me = Ty(te, s, o);
        te = me.point, ee = me.guides, te = Ny(s[s.length - 1], te);
      }
      const fe = s.length >= 3 && Ly(s[0], te, o, Ry);
      fe && (te = {
        ...s[0]
      }, ee = null), b(fe), p(te), E(ee);
    }, [
      l,
      s,
      o
    ]), j = g.useCallback(() => {
      c([]), d(false), p(null), b(false), E(null);
    }, []);
    return {
      handleMouseDown: T,
      handleMouseMove: A,
      cancelDrawing: j,
      isDrawing: f,
      points: s,
      cursorPoint: m,
      isNearStart: v,
      alignmentGuides: S
    };
  }
  function Rs(l) {
    return Math.round(l / Se) * Se;
  }
  const J2 = 6;
  function Oy(l, n, r) {
    const o = J2 / r;
    let s = null, c = null, f = l.x, d = l.y;
    for (const m of n) if (s === null && Math.abs(l.x - m.x) <= o && (f = m.x, s = m), c === null && Math.abs(l.y - m.y) <= o && (d = m.y, c = m), s !== null && c !== null) break;
    return {
      point: {
        x: f,
        y: d
      },
      guides: {
        alignedVertexX: s,
        alignedVertexY: c
      }
    };
  }
  function e5(l, n, r, o) {
    const [s, c] = g.useState([]), [f, d] = g.useState(false), [m, p] = g.useState(null), [v, b] = g.useState(null), S = ye((j) => j.activeLayerId), E = ye((j) => j.layers), k = Xt((j) => j.activeTool);
    g.useEffect(() => {
      k !== "path" && (c([]), d(false), p(null), b(null));
    }, [
      k
    ]);
    const w = g.useCallback((j) => {
      if (!n || !r || j.length < 2) return;
      const { width: U, cornerRadius: N, numArcPoints: R } = nn.getState(), O = new Float64Array(j.length * 2);
      for (let fe = 0; fe < j.length; fe++) O[fe * 2] = j[fe].x, O[fe * 2 + 1] = j[fe].y;
      const H = E.get(S), G = (H == null ? void 0 : H.layerNumber) ?? 1, te = (H == null ? void 0 : H.datatype) ?? 0, ee = new $S(O, U, G, te, [
        ...j
      ], N, R);
      de.getState().execute(ee, {
        library: n,
        renderer: r
      }), c([]), d(false), p(null), b(null);
    }, [
      n,
      r,
      S,
      E
    ]), C = g.useCallback((j) => {
      if (j.button !== 0) return;
      const N = j.currentTarget.getBoundingClientRect(), R = j.clientX - N.left, O = j.clientY - N.top, H = l(R, O);
      if (!H) return;
      let G = {
        x: Rs(H.x),
        y: Rs(H.y)
      };
      if (s.length > 0 && !j.shiftKey && (G = Oy(G, s, o).point, G = Sy(s[s.length - 1], G)), j.detail >= 2 && s.length >= 2) {
        w(s);
        return;
      }
      const te = s[s.length - 1];
      if (te && G.x === te.x && G.y === te.y) return;
      const ee = [
        ...s,
        G
      ];
      c(ee), d(true);
    }, [
      l,
      s,
      o,
      w
    ]), _ = g.useCallback((j) => {
      const N = j.currentTarget.getBoundingClientRect(), R = j.clientX - N.left, O = j.clientY - N.top, H = l(R, O);
      if (!H) return;
      let G = {
        x: Rs(H.x),
        y: Rs(H.y)
      }, te = null;
      if (s.length > 0 && !j.shiftKey) {
        const ee = Oy(G, s, o);
        G = ee.point, te = ee.guides, G = Sy(s[s.length - 1], G);
      }
      p(G), b(te);
    }, [
      l,
      s,
      o
    ]), T = g.useCallback((j) => {
      j.key === "Enter" && s.length >= 2 && (j.preventDefault(), w(s));
    }, [
      s,
      w
    ]);
    g.useEffect(() => {
      if (f) return window.addEventListener("keydown", T), () => window.removeEventListener("keydown", T);
    }, [
      f,
      T
    ]);
    const A = g.useCallback(() => {
      c([]), d(false), p(null), b(null);
    }, []);
    return {
      handleMouseDown: C,
      handleMouseMove: _,
      cancelDrawing: A,
      isDrawing: f,
      waypoints: s,
      cursorPoint: m,
      alignmentGuides: v
    };
  }
  const Dy = wt((l, n) => ({
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
  })), Iy = 15;
  function Uf(l) {
    if (!l) return null;
    try {
      const n = l.get_all_vertices();
      return n.length > 0 ? n : null;
    } catch {
      return null;
    }
  }
  function t5(l, n, r, o, s, c) {
    const f = s - r, d = c - o, m = f * f + d * d;
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
    const p = Math.max(0, Math.min(1, ((l - r) * f + (n - o) * d) / m)), v = r + p * f, b = o + p * d, S = (l - v) * (l - v) + (n - b) * (n - b);
    return {
      point: {
        x: v,
        y: b
      },
      distSq: S
    };
  }
  function n5(l, n, r, o, s) {
    let c = null, f = Iy * Iy;
    const d = (l - s.x) / o, m = (n - s.y) / o;
    for (const p of r) {
      const v = p.length / 2;
      if (!(v < 2)) for (let b = 0; b < v; b++) {
        const S = (b + 1) % v, E = p[b * 2], k = p[b * 2 + 1], w = p[S * 2], C = p[S * 2 + 1], { point: _, distSq: T } = t5(d, m, E, k, w, C), A = T * o * o;
        A < f && (f = A, c = _);
      }
    }
    return c;
  }
  function zy(l) {
    return Math.round(l / Se) * Se;
  }
  function l5(l) {
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
  function Yf(l, n, r, o, s, c, f, d = false) {
    if (!d && s && s.length >= 5) {
      const m = l5(s);
      if (m.length > 0) {
        const p = n5(l, n, m, c, f);
        if (p) return {
          point: p,
          isGeometrySnap: true
        };
      }
    }
    return {
      point: {
        x: zy(r),
        y: zy(o)
      },
      isGeometrySnap: false
    };
  }
  const Hy = 5;
  function Uy(l, n) {
    return l.get_group_ids(n);
  }
  function Yy(l, n) {
    const r = /* @__PURE__ */ new Set(), o = [];
    for (const s of n) {
      const c = l.get_group_ids(s);
      for (const f of c) r.has(f) || (r.add(f), o.push(f));
    }
    return o;
  }
  const r5 = 8, As = 12, Bf = 140, Xf = 56;
  function a5(l, n, r, o, s, c) {
    const f = l - r, d = n - o, m = s - r, p = c - o, v = f * m + d * p, b = m * m + p * p;
    if (b === 0) return Math.sqrt(f * f + d * d);
    const S = Math.max(0, Math.min(1, v / b)), E = r + S * m, k = o + S * p, w = l - E, C = n - k;
    return Math.sqrt(w * w + C * C);
  }
  function By(l, n, r, o, s) {
    for (const c of r.values()) {
      const f = c.start.x * o + s.x, d = c.start.y * o + s.y, m = c.end.x * o + s.x, p = c.end.y * o + s.y, v = l - f, b = n - d;
      if (v * v + b * b <= As * As) return {
        rulerId: c.id,
        endpoint: "start"
      };
      const S = l - m, E = n - p;
      if (S * S + E * E <= As * As) return {
        rulerId: c.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function Xy(l, n, r, o, s) {
    for (const c of r.values()) {
      const f = c.start.x * o + s.x, d = c.start.y * o + s.y, m = c.end.x * o + s.x, p = c.end.y * o + s.y, v = (f + m) / 2, b = (d + p) / 2, S = Bf / 2, E = Xf / 2;
      if (l >= v - S && l <= v + S && n >= b - E && n <= b + E || a5(l, n, f, d, m, p) <= r5) return c.id;
    }
    return null;
  }
  function o5(l, n, r, o, s, c, f, d) {
    if (l >= s && l <= f && n >= c && n <= d || r >= s && r <= f && o >= c && o <= d) return true;
    const m = [
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
        d
      ],
      [
        s,
        d,
        f,
        d
      ],
      [
        s,
        c,
        s,
        d
      ]
    ];
    for (const [p, v, b, S] of m) if (i5(l, n, r, o, p, v, b, S)) return true;
    return false;
  }
  function i5(l, n, r, o, s, c, f, d) {
    const m = Ts(s, c, f, d, l, n), p = Ts(s, c, f, d, r, o), v = Ts(l, n, r, o, s, c), b = Ts(l, n, r, o, f, d);
    return !!((m > 0 && p < 0 || m < 0 && p > 0) && (v > 0 && b < 0 || v < 0 && b > 0) || m === 0 && Ns(s, c, f, d, l, n) || p === 0 && Ns(s, c, f, d, r, o) || v === 0 && Ns(l, n, r, o, s, c) || b === 0 && Ns(l, n, r, o, f, d));
  }
  function Ts(l, n, r, o, s, c) {
    return (s - l) * (o - n) - (r - l) * (c - n);
  }
  function Ns(l, n, r, o, s, c) {
    return Math.min(l, r) <= s && s <= Math.max(l, r) && Math.min(n, o) <= c && c <= Math.max(n, o);
  }
  function Vy(l, n, r, o, s, c, f) {
    const d = [];
    for (const m of s.values()) {
      const p = m.start.x * c + f.x, v = m.start.y * c + f.y, b = m.end.x * c + f.x, S = m.end.y * c + f.y;
      if (o5(p, v, b, S, l, n, r, o)) {
        d.push(m.id);
        continue;
      }
      const E = (p + b) / 2, k = (v + S) / 2, w = E - Bf / 2, C = E + Bf / 2, _ = k - Xf / 2, T = k + Xf / 2;
      w <= r && C >= l && _ <= o && T >= n && d.push(m.id);
    }
    return d;
  }
  function s5(l, n, r) {
    const { selectedIds: o, hoveredId: s, clearSelection: c, setHover: f } = oe(), { box: d, isDrawing: m, previewIds: p, startDrawing: v, updateBox: b, setPreviewIds: S, reset: E } = Dy(), { zoom: k, offset: w } = ze(), C = Ne((L) => L.rulers), _ = Ne((L) => L.selectedRulerIds), T = Ne((L) => L.selectRuler), A = Ne((L) => L.toggleSelection), j = Ne((L) => L.addToSelection), U = Ne((L) => L.clearSelection), N = Ne((L) => L.setHoveredRuler), R = Ne((L) => L.setHoveredEndpoint), O = Ne((L) => L.setDraggingEndpoint), H = Ne((L) => L.endDraggingEndpoint), G = Ne((L) => L.updateEndpoint), te = Ne((L) => L.hoveredRulerId), ee = Ne((L) => L.hoveredEndpoint), fe = Ne((L) => L.draggingEndpoint), me = Ne((L) => L.setMarqueePreviewIds), Ee = Ne((L) => L.setSnapPoint), q = g.useRef("");
    g.useEffect(() => {
      if (!r) return;
      const L = Array.from(o).filter((D) => !Sn(D));
      r.set_selection(L);
    }, [
      r,
      o
    ]), g.useEffect(() => {
      if (r) if (m) {
        const L = Array.from(p).filter((D) => !Sn(D));
        r.set_hover_multiple(L);
      } else if (s && !Sn(s) && n) {
        const L = Uy(n, s);
        r.set_hover_multiple(L);
      } else r.set_hover(void 0);
    }, [
      r,
      n,
      s,
      m,
      p
    ]);
    const F = g.useCallback((L) => {
      if (L.button !== 0) return;
      const $ = L.currentTarget.getBoundingClientRect(), J = L.clientX - $.left, W = L.clientY - $.top, ie = By(J, W, C, k, w);
      if (ie) {
        T(ie.rulerId), O(ie), c();
        return;
      }
      const X = Xy(J, W, C, k, w);
      if (X) {
        L.shiftKey ? j([
          X
        ]) : L.metaKey || L.ctrlKey ? A(X) : T(X), c();
        return;
      }
      _.size > 0 && U();
      const ue = l(J, W);
      if (!ue || !n) return;
      let I = n.hit_test(ue.x, ue.y);
      if (I || (I = Po(ue.x, ue.y) ?? void 0), I) {
        const se = Sn(I) ? [
          I
        ] : Uy(n, I);
        if (L.shiftKey) {
          const ge = oe.getState().selectedIds, ve = /* @__PURE__ */ new Set([
            ...ge,
            ...se
          ]);
          oe.setState({
            selectedIds: ve,
            lastSelectedId: I
          });
        } else if (L.metaKey || L.ctrlKey) {
          const ge = oe.getState().selectedIds, ve = se.every((Me) => ge.has(Me)), Le = new Set(ge);
          if (ve) for (const Me of se) Le.delete(Me);
          else for (const Me of se) Le.add(Me);
          oe.setState({
            selectedIds: Le,
            lastSelectedId: I
          });
        } else oe.setState({
          selectedIds: new Set(se),
          lastSelectedId: I
        });
      } else v(J, W), !L.shiftKey && !L.metaKey && !L.ctrlKey && c();
    }, [
      l,
      n,
      C,
      k,
      w,
      _,
      c,
      T,
      A,
      j,
      U,
      O,
      v
    ]), ce = g.useCallback((L) => {
      const $ = L.currentTarget.getBoundingClientRect(), J = L.clientX - $.left, W = L.clientY - $.top;
      if (fe) {
        const I = l(J, W);
        if (I) {
          const se = Uf(n), ge = Yf(J, W, I.x, I.y, se, k, w, L.shiftKey);
          G(fe.rulerId, fe.endpoint, ge.point), Ee(ge.isGeometrySnap ? ge.point : null);
        }
        return;
      }
      if (m) {
        b(J, W);
        const I = Dy.getState().box;
        if (I) {
          const se = Math.min(I.x, I.x + I.width), ge = Math.max(I.x, I.x + I.width), ve = Math.min(I.y, I.y + I.height), Le = Math.max(I.y, I.y + I.height), Me = Vy(se, ve, ge, Le, C, k, w);
          me(Me);
          {
            const $e = (se - w.x) / k, Ze = (ge - w.x) / k, we = (ve - w.y) / k, je = (Le - w.y) / k, Ae = Math.min($e, Ze), et = Math.max($e, Ze), Fe = Math.min(we, je), Ut = Math.max(we, je), hn = n ? n.hit_test_rect(Ae, Fe, et, Ut) : [], jt = n ? Yy(n, hn) : hn, il = vy(Ae, Fe, et, Ut), Rl = [
              ...jt,
              ...il
            ], Al = Rl.sort().join(",");
            Al !== q.current && (q.current = Al, S(Rl));
          }
        }
        return;
      }
      const ie = By(J, W, C, k, w);
      let X = null;
      ie ? (((ee == null ? void 0 : ee.rulerId) !== ie.rulerId || (ee == null ? void 0 : ee.endpoint) !== ie.endpoint) && R(ie), te !== ie.rulerId && N(ie.rulerId), X = ie.rulerId) : (ee && R(null), X = Xy(J, W, C, k, w), X !== te && N(X));
      const ue = l(J, W);
      if (!ue || !n) {
        s !== null && f(null);
        return;
      }
      if (X) s !== null && f(null);
      else {
        let I = n.hit_test(ue.x, ue.y);
        I || (I = Po(ue.x, ue.y) ?? void 0), (I ?? null) !== s && f(I ?? null);
      }
    }, [
      l,
      n,
      C,
      s,
      te,
      ee,
      fe,
      f,
      N,
      R,
      G,
      me,
      m,
      b,
      k,
      w,
      S,
      Ee
    ]), _e = g.useCallback(() => {
      if (fe) {
        const $ = H();
        if (Ee(null), $ && n && r) {
          const J = new v0($.rulerId, $.endpoint, $.oldPosition, $.newPosition);
          de.getState().pushCommand(J);
        }
        return;
      }
      if (!m || !d) {
        E(), me([]);
        return;
      }
      const L = Math.abs(d.width), D = Math.abs(d.height);
      if (L > Hy || D > Hy) {
        const $ = Math.min(d.x, d.x + d.width), J = Math.max(d.x, d.x + d.width), W = Math.min(d.y, d.y + d.height), ie = Math.max(d.y, d.y + d.height), X = Vy($, W, J, ie, C, k, w), ue = ($ - w.x) / k, I = (J - w.x) / k, se = (W - w.y) / k, ge = (ie - w.y) / k, ve = Math.min(ue, I), Le = Math.max(ue, I), Me = Math.min(se, ge), $e = Math.max(se, ge), Ze = n ? n.hit_test_rect(ve, Me, Le, $e) : [], we = n ? Yy(n, Ze) : Ze, je = vy(ve, Me, Le, $e);
        X.length > 0 && j(X);
        const Ae = [
          ...we,
          ...je
        ];
        if (Ae.length > 0) {
          const et = oe.getState().selectedIds, Fe = /* @__PURE__ */ new Set([
            ...et,
            ...Ae
          ]);
          oe.getState().setSelection(Fe);
        }
      }
      E(), me([]);
    }, [
      m,
      d,
      n,
      r,
      C,
      k,
      w,
      fe,
      j,
      H,
      E,
      me,
      Ee
    ]), be = g.useCallback(() => {
      s !== null && f(null), te !== null && N(null), ee !== null && R(null), fe !== null && O(null), E(), me([]);
    }, [
      s,
      te,
      ee,
      fe,
      f,
      N,
      R,
      O,
      E,
      me
    ]);
    return {
      handleMouseDown: F,
      handleMouseMove: ce,
      handleMouseUp: _e,
      handleMouseLeave: be,
      selectedIds: o,
      hoveredId: s,
      hoveredRulerId: te,
      hoveredEndpoint: ee,
      marqueeBox: d,
      isDrawingMarquee: m,
      previewIds: p
    };
  }
  const c5 = 8, u5 = 140, d5 = 56;
  function f5(l, n, r, o, s, c) {
    const f = l - r, d = n - o, m = s - r, p = c - o, v = f * m + d * p, b = m * m + p * p;
    if (b === 0) return Math.sqrt(f * f + d * d);
    const S = Math.max(0, Math.min(1, v / b)), E = r + S * m, k = o + S * p, w = l - E, C = n - k;
    return Math.sqrt(w * w + C * C);
  }
  function $y(l, n, r, o, s) {
    for (const c of r.values()) {
      const f = c.start.x * o + s.x, d = c.start.y * o + s.y, m = c.end.x * o + s.x, p = c.end.y * o + s.y, v = (f + m) / 2, b = (d + p) / 2, S = u5 / 2, E = d5 / 2;
      if (l >= v - S && l <= v + S && n >= b - E && n <= b + E || f5(l, n, f, d, m, p) <= c5) return c.id;
    }
    return null;
  }
  function h5(l, n, r) {
    const [o, s] = g.useState(false), [c, f] = g.useState(null), [d, m] = g.useState(null), { zoom: p, offset: v } = ze(), b = Ne((A) => A.rulers), S = Ne((A) => A.selectRuler), E = g.useRef(null), k = g.useCallback((A) => {
      if (A.button !== 0) return;
      const U = A.currentTarget.getBoundingClientRect(), N = A.clientX - U.left, R = A.clientY - U.top, O = l(N, R);
      if (!O) return;
      const H = $y(N, R, b, p, v);
      if (H) {
        S(H), oe.getState().clearSelection(), E.current = {
          elementIds: [],
          rulerId: H,
          startWorld: O,
          currentDelta: {
            x: 0,
            y: 0
          }
        }, s(true);
        return;
      }
      let G;
      if (n && (G = n.hit_test(O.x, O.y) ?? void 0), G || (G = Po(O.x, O.y) ?? void 0), !G) return;
      S(null);
      const { selectedIds: te } = oe.getState();
      if (Sn(G)) {
        let me;
        te.has(G) ? me = [
          ...te
        ].filter((Ee) => Sn(Ee)) : (me = [
          G
        ], oe.getState().select(G)), E.current = {
          elementIds: me,
          rulerId: null,
          startWorld: O,
          currentDelta: {
            x: 0,
            y: 0
          }
        }, s(true);
        return;
      }
      if (!n) return;
      const ee = n.get_group_ids(G);
      let fe;
      te.has(G) ? fe = [
        ...te
      ].filter((me) => !Sn(me)) : (fe = ee, oe.getState().setSelection(new Set(ee))), E.current = {
        elementIds: fe,
        rulerId: null,
        startWorld: O,
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
      S
    ]), w = g.useCallback((A) => {
      const U = A.currentTarget.getBoundingClientRect(), N = A.clientX - U.left, R = A.clientY - U.top, O = l(N, R);
      if (!O) return;
      if (!o) {
        const me = $y(N, R, b, p, v);
        me !== d && m(me);
        {
          let Ee = null;
          n && (Ee = n.hit_test(O.x, O.y) ?? null), Ee || (Ee = Po(O.x, O.y)), Ee !== c && f(Ee);
        }
        return;
      }
      const H = E.current;
      if (!H) return;
      const G = O.x - H.startWorld.x, te = O.y - H.startWorld.y, ee = G - H.currentDelta.x, fe = te - H.currentDelta.y;
      if (ee !== 0 || fe !== 0) {
        if (H.rulerId) {
          const me = Ne.getState().rulers.get(H.rulerId);
          me && (Ne.getState().updateEndpoint(H.rulerId, "start", {
            x: me.start.x + ee,
            y: me.start.y + fe
          }), Ne.getState().updateEndpoint(H.rulerId, "end", {
            x: me.end.x + ee,
            y: me.end.y + fe
          }));
        } else if (H.elementIds.length > 0 && Sn(H.elementIds[0])) {
          const me = Ot.getState();
          for (const Ee of H.elementIds) {
            const q = Yr(Ee), F = me.images.get(q);
            F && me.updateImage(q, {
              x: F.x + ee,
              y: F.y + fe
            });
          }
        } else n && r && (n.translate_elements(H.elementIds, ee, fe), r.sync_from_library(n), r.mark_dirty(), xe.getState().bumpSyncGeneration());
        H.currentDelta = {
          x: G,
          y: te
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
      d
    ]), C = g.useCallback(() => {
      if (!o) {
        s(false), E.current = null;
        return;
      }
      const A = E.current;
      if (!A) {
        s(false);
        return;
      }
      const { elementIds: j, rulerId: U, currentDelta: N } = A;
      if (U && (N.x !== 0 || N.y !== 0)) {
        const R = new b0([
          U
        ], N.x, N.y);
        de.getState().pushCommand(R), s(false), E.current = null;
        return;
      }
      if (j.length > 0 && Sn(j[0]) && (N.x !== 0 || N.y !== 0)) {
        const R = new l2(j, N.x, N.y);
        de.getState().pushCommand(R);
      } else if (n && r && (N.x !== 0 || N.y !== 0)) {
        n.translate_elements(j, -N.x, -N.y), r.sync_from_library(n);
        const R = new qS(j, N.x, N.y);
        de.getState().execute(R, {
          library: n,
          renderer: r
        });
        const O = /* @__PURE__ */ new Set();
        for (const H of j) {
          const G = dr(H);
          if (!G) {
            console.warn("[move] no source for", H.slice(0, 8), "\u2014 edit skipped");
            continue;
          }
          if (G.type === "ref") {
            const te = `${G.file}:${G.line}`;
            O.has(te) || (O.add(te), ES(H, N.x, N.y));
          } else {
            const te = n.get_element_info(H);
            te && (Uo(H, new Float64Array(te.vertices)), te.free());
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
      const A = E.current;
      if (A && (A.currentDelta.x !== 0 || A.currentDelta.y !== 0)) if (A.rulerId) {
        const j = Ne.getState().rulers.get(A.rulerId);
        j && (Ne.getState().updateEndpoint(A.rulerId, "start", {
          x: j.start.x - A.currentDelta.x,
          y: j.start.y - A.currentDelta.y
        }), Ne.getState().updateEndpoint(A.rulerId, "end", {
          x: j.end.x - A.currentDelta.x,
          y: j.end.y - A.currentDelta.y
        }));
      } else if (A.elementIds.length > 0 && Sn(A.elementIds[0])) {
        const j = Ot.getState();
        for (const U of A.elementIds) {
          const N = Yr(U), R = j.images.get(N);
          R && j.updateImage(N, {
            x: R.x - A.currentDelta.x,
            y: R.y - A.currentDelta.y
          });
        }
      } else n && r && (n.translate_elements(A.elementIds, -A.currentDelta.x, -A.currentDelta.y), r.sync_from_library(n), r.mark_dirty());
      s(false), E.current = null;
    }, [
      o,
      n,
      r
    ]), T = g.useCallback(() => {
      o && _(), f(null), m(null);
    }, [
      o,
      _
    ]);
    return {
      handleMouseDown: k,
      handleMouseMove: w,
      handleMouseUp: C,
      handleMouseLeave: T,
      cancelMove: _,
      isMoving: o,
      hoveredId: c,
      hoveredRulerId: d
    };
  }
  function qy(l, n) {
    return l.line < n.line ? true : l.line > n.line ? false : l.column < n.column;
  }
  function ih(l) {
    if (!l || !l.isActive || l.anchor.line === l.focus.line && l.anchor.column === l.focus.column) return null;
    const n = qy(l.anchor, l.focus) ? l.anchor : l.focus, r = qy(l.anchor, l.focus) ? l.focus : l.anchor;
    return {
      start: n,
      end: r
    };
  }
  function m5(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return "";
    const n = ih(l.selection);
    if (!n) return "";
    const r = l.content.split(`
`);
    let o = "";
    for (let s = n.start.line; s <= n.end.line; s++) {
      const c = r[s], f = s === n.start.line ? n.start.column : 0, d = s === n.end.line ? n.end.column : c.length;
      o += c.substring(f, d), s < n.end.line && (o += `
`);
    }
    return o;
  }
  function g5(l) {
    var _a;
    if (!((_a = l.selection) == null ? void 0 : _a.isActive)) return l;
    const n = ih(l.selection);
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
  function p5(l, n, r) {
    var _a;
    r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation();
    const o = l.content.split(`
`), { line: s, column: c } = l.cursorPosition, f = (r == null ? void 0 : r.shiftKey) || false;
    let d = s, m = c, p = l;
    switch (f && !((_a = l.selection) == null ? void 0 : _a.isActive) && (p = {
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
        c > 0 ? m = c - 1 : s > 0 && (d = s - 1, m = o[d].length);
        break;
      case "ArrowRight":
        c < o[s].length ? m = c + 1 : s < o.length - 1 && (d = s + 1, m = 0);
        break;
      case "ArrowUp":
        s > 0 && (d = s - 1, m = Math.min(c, o[d].length));
        break;
      case "ArrowDown":
        s < o.length - 1 && (d = s + 1, m = Math.min(c, o[d].length));
        break;
      case "Home":
        m = 0;
        break;
      case "End":
        m = o[s].length;
        break;
    }
    if (f) {
      const v = {
        line: d,
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
        line: d,
        column: m
      },
      selection: void 0
    };
  }
  function y5(l, n) {
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
  function Gy(l, n, r) {
    var _a;
    if (r && (r.ctrlKey || r.metaKey)) {
      const f = y5(l, r);
      if (f) return f;
    }
    let o = null;
    if (((_a = l.selection) == null ? void 0 : _a.isActive) && (n.length === 1 || n === "Backspace" || n === "Delete") && (l = g5(l), n === "Backspace" || n === "Delete")) return l;
    const s = l.content.split(`
`), c = s[l.cursorPosition.line];
    switch (n) {
      case "Enter": {
        if (r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation(), !(r == null ? void 0 : r.shiftKey)) return null;
        const f = c.slice(0, l.cursorPosition.column), d = c.slice(l.cursorPosition.column), m = [
          ...s
        ];
        m[l.cursorPosition.line] = f, m.splice(l.cursorPosition.line + 1, 0, d), o = {
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
          const f = [
            ...s
          ];
          f[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column - 1) + c.slice(l.cursorPosition.column), o = {
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
          const f = s[l.cursorPosition.line - 1], d = [
            ...s
          ];
          d.splice(l.cursorPosition.line - 1, 2, f + c), o = {
            ...l,
            content: d.join(`
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
        if (r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation(), l.cursorPosition.column < c.length) {
          const f = [
            ...s
          ];
          f[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column) + c.slice(l.cursorPosition.column + 1), o = {
            ...l,
            content: f.join(`
`),
            cursorPosition: l.cursorPosition,
            selection: void 0
          };
        } else if (l.cursorPosition.line < s.length - 1) {
          const f = s[l.cursorPosition.line + 1], d = [
            ...s
          ];
          d.splice(l.cursorPosition.line, 2, c + f), o = {
            ...l,
            content: d.join(`
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
        o = p5(l, n, r);
        break;
      default:
        if (n.length === 1) {
          r == null ? void 0 : r.preventDefault(), r == null ? void 0 : r.stopPropagation();
          const f = [
            ...s
          ];
          f[l.cursorPosition.line] = c.slice(0, l.cursorPosition.column) + n + c.slice(l.cursorPosition.column), o = {
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
    return o || l;
  }
  function Py(l) {
    return Math.round(l / Se) * Se;
  }
  function b5(l, n, r) {
    const o = Ft((p) => p.isEditingText), s = g.useRef(null), c = g.useCallback(() => {
      const p = Ft.getState().activeText;
      if (!p || !p.content.trim() || !n || !r) {
        Ft.getState().stopEditing();
        return;
      }
      const v = ye.getState().layers.get(ye.getState().activeLayerId), b = (v == null ? void 0 : v.layerNumber) ?? 1, S = (v == null ? void 0 : v.datatype) ?? 0, E = new M0(p.content, p.x, p.y, Pv * Se, b, S);
      de.getState().execute(E, {
        library: n,
        renderer: r
      }), xe.getState().bumpSyncGeneration(), Ft.getState().stopEditing();
    }, [
      n,
      r
    ]), f = g.useCallback(() => {
      Ft.getState().stopEditing();
    }, []), d = g.useCallback((p) => {
      if (p.button !== 0) return;
      const b = p.currentTarget.getBoundingClientRect(), S = p.clientX - b.left, E = p.clientY - b.top, k = l(S, E);
      if (!k) return;
      if (o) {
        c();
        return;
      }
      const w = Py(k.x), C = Py(k.y);
      Ft.getState().startEditing(w, C);
    }, [
      l,
      o,
      c
    ]), m = g.useCallback((p) => {
    }, []);
    return g.useEffect(() => {
      if (!o) return;
      const p = (v) => {
        const b = Ft.getState().activeText;
        if (!b) return;
        if (v.key === "Escape") {
          v.preventDefault(), v.stopPropagation(), f(), Xt.getState().setTool("select");
          return;
        }
        if (v.key === "c" && (v.ctrlKey || v.metaKey)) {
          const E = m5(b);
          E && (v.preventDefault(), navigator.clipboard.writeText(E));
          return;
        }
        if (v.key === "v" && (v.ctrlKey || v.metaKey)) {
          v.preventDefault(), v.stopPropagation(), navigator.clipboard.readText().then((E) => {
            if (!E) return;
            const k = Ft.getState().activeText;
            if (!k) return;
            let w = k;
            for (const C of E) {
              const _ = Gy(w, C === `
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
            Ft.getState().setActiveText(w);
          });
          return;
        }
        const S = Gy(b, v.key, v);
        if (S === null) {
          c();
          return;
        }
        S !== b && (Ft.getState().setActiveText(S), Ft.getState().resetCursor());
      };
      return window.addEventListener("keydown", p, true), () => window.removeEventListener("keydown", p, true);
    }, [
      o,
      c,
      f
    ]), g.useEffect(() => (o && (s.current = setInterval(() => {
      Ft.getState().toggleCursor();
    }, hS)), () => {
      s.current && (clearInterval(s.current), s.current = null);
    }), [
      o
    ]), {
      handleMouseDown: d,
      handleMouseMove: m,
      commitText: c,
      cancelEditing: f,
      isEditing: o
    };
  }
  const Ky = 12, v5 = 8, x5 = 140, w5 = 56;
  function Zy(l, n, r, o, s) {
    const c = n.x * r + o.x, f = n.y * r + o.y, d = l.x - c, m = l.y - f;
    return d * d + m * m <= s * s;
  }
  function S5(l, n, r, o, s, c) {
    const f = l - r, d = n - o, m = s - r, p = c - o, v = f * m + d * p, b = m * m + p * p;
    if (b === 0) return Math.sqrt(f * f + d * d);
    const S = Math.max(0, Math.min(1, v / b)), E = r + S * m, k = o + S * p, w = l - E, C = n - k;
    return Math.sqrt(w * w + C * C);
  }
  function C5(l, n, r, o, s, c) {
    const f = r.start.x * o + s.x, d = r.start.y * o + s.y, m = r.end.x * o + s.x, p = r.end.y * o + s.y;
    return S5(l, n, f, d, m, p) <= c;
  }
  function E5(l, n, r, o, s) {
    const c = r.start.x * o + s.x, f = r.start.y * o + s.y, d = r.end.x * o + s.x, m = r.end.y * o + s.y, p = (c + d) / 2, v = (f + m) / 2, b = x5 / 2, S = w5 / 2;
    return l >= p - b && l <= p + b && n >= v - S && n <= v + S;
  }
  function Fy(l, n, r, o, s, c) {
    const f = {
      x: l,
      y: n
    };
    for (const d of r.values()) if (d.id !== c) {
      if (Zy(f, d.start, o, s, Ky)) return {
        rulerId: d.id,
        endpoint: "start"
      };
      if (Zy(f, d.end, o, s, Ky)) return {
        rulerId: d.id,
        endpoint: "end"
      };
    }
    return null;
  }
  function Qy(l, n, r, o, s, c) {
    for (const f of r.values()) if (f.id !== c && (E5(l, n, f, o, s) || C5(l, n, f, o, s, v5))) return f.id;
    return null;
  }
  function _5(l, n, r, o, s) {
    const c = Xt((F) => F.activeTool), { rulers: f, activeRulerId: d, selectedRulerIds: m, hoveredRulerId: p, draggingEndpoint: v, isMovingRuler: b, startRuler: S, updatePreview: E, finalizeRuler: k, cancelCreation: w, updateEndpoint: C, setHoveredEndpoint: _, setDraggingEndpoint: T, endDraggingEndpoint: A, selectRuler: j, toggleSelection: U, addToSelection: N, clearSelection: R, setHoveredRuler: O, startMoveRuler: H, moveRuler: G, endMoveRuler: te, setSnapPoint: ee } = Ne();
    g.useEffect(() => {
      c !== "ruler" && (d && w(), _(null), O(null));
    }, [
      c,
      d,
      w,
      _,
      O
    ]);
    const fe = g.useCallback((F) => {
      if (F.button !== 0) return;
      const _e = F.currentTarget.getBoundingClientRect(), be = F.clientX - _e.left, L = F.clientY - _e.top, D = l(be, L);
      if (!D) return;
      const $ = Uf(n), W = Yf(be, L, D.x, D.y, $, o, s, F.shiftKey).point, ie = Fy(be, L, f, o, s, d ?? void 0);
      if (ie) {
        F.shiftKey ? N([
          ie.rulerId
        ]) : F.metaKey || F.ctrlKey ? U(ie.rulerId) : j(ie.rulerId), T(ie);
        return;
      }
      const X = Qy(be, L, f, o, s, d ?? void 0);
      if (X) {
        F.shiftKey ? N([
          X
        ]) : F.metaKey || F.ctrlKey ? U(X) : m.has(X) ? H(W) : j(X);
        return;
      }
      if (d) {
        const ue = k(W);
        if (ee(null), ue && n && r) {
          const I = new GS(ue);
          de.getState().pushCommand(I);
        }
      } else m.size > 0 && !F.shiftKey && !F.metaKey && !F.ctrlKey ? R() : m.size === 0 && S(W);
    }, [
      l,
      n,
      r,
      f,
      o,
      s,
      d,
      m,
      S,
      k,
      T,
      j,
      U,
      N,
      R,
      H,
      ee
    ]), me = g.useCallback((F) => {
      const _e = F.currentTarget.getBoundingClientRect(), be = F.clientX - _e.left, L = F.clientY - _e.top, D = l(be, L);
      if (!D) return;
      const $ = Uf(n), J = Yf(be, L, D.x, D.y, $, o, s, F.shiftKey), W = J.point;
      if (b) {
        G(W), ee(J.isGeometrySnap ? W : null);
        return;
      }
      if (v) {
        C(v.rulerId, v.endpoint, W), ee(J.isGeometrySnap ? W : null);
        return;
      }
      if (d) {
        E(W), ee(J.isGeometrySnap ? W : null);
        return;
      }
      const ie = Fy(be, L, f, o, s);
      _(ie);
      const X = ie ? ie.rulerId : Qy(be, L, f, o, s);
      O(X), !ie && !X && m.size === 0 ? ee(J.isGeometrySnap ? W : null) : ee(null);
    }, [
      l,
      n,
      f,
      o,
      s,
      d,
      v,
      b,
      m,
      E,
      C,
      G,
      _,
      O,
      ee
    ]), Ee = g.useCallback(() => {
      if (v) {
        const F = A();
        if (ee(null), F && n && r) {
          const ce = new v0(F.rulerId, F.endpoint, F.oldPosition, F.newPosition);
          de.getState().pushCommand(ce);
        }
      }
      if (b) {
        const F = te();
        if (F && n && r) {
          const ce = new b0(F.rulerIds, F.deltaX, F.deltaY);
          de.getState().pushCommand(ce);
        }
      }
    }, [
      v,
      b,
      A,
      te,
      n,
      r,
      ee
    ]), q = g.useCallback(() => {
      w(), _(null), O(null), T(null), ee(null);
    }, [
      w,
      _,
      O,
      T,
      ee
    ]);
    return {
      handleMouseDown: fe,
      handleMouseMove: me,
      handleMouseUp: Ee,
      cancelDrawing: q,
      isCreating: d !== null,
      isDraggingEndpoint: v !== null,
      isMovingRuler: b,
      hoveredRulerId: p,
      selectedRulerIds: m
    };
  }
  const Os = "#ff0000", Ud = 4;
  function k5() {
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
        backgroundColor: Os,
        boxShadow: `
          0 0 ${Ud}px ${Os},
          0 0 ${Ud * 2}px ${Os},
          0 0 ${Ud * 3}px ${Os}`,
        opacity: 0.9,
        left: 0,
        top: 0,
        transform: `translate(${l.x - 4}px, ${l.y - 4}px)`,
        willChange: "transform"
      }
    });
  }
  const M5 = "rgba(46, 229, 120, 0.1)", j5 = "rgba(46, 229, 120, 0.6)";
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
  const R5 = "rgba(59, 130, 246, 0.1)", A5 = "rgba(59, 130, 246, 0.6)";
  function T5({ box: l }) {
    const n = l.width >= 0 ? l.x : l.x + l.width, r = l.height >= 0 ? l.y : l.y + l.height, o = Math.abs(l.width), s = Math.abs(l.height);
    return o < 2 && s < 2 ? null : y.jsx("div", {
      className: "pointer-events-none absolute",
      style: {
        left: n,
        top: r,
        width: o,
        height: s,
        backgroundColor: R5,
        border: `1px solid ${A5}`
      }
    });
  }
  function N5({ points: l, cursorPoint: n, isNearStart: r, alignmentGuides: o }) {
    var _a;
    const { zoom: s, offset: c } = ze(), f = ye((A) => A.activeLayerId), p = ((_a = ye((A) => A.layers).get(f)) == null ? void 0 : _a.color) ?? "#888888", v = (A) => ({
      x: A.x * s + c.x,
      y: A.y * s + c.y
    });
    if (l.length === 0) return null;
    const S = (n ? [
      ...l,
      n
    ] : l).map(v), E = S.map((A, j) => `${j === 0 ? "M" : "L"} ${A.x} ${A.y}`).join(" "), k = l.length >= 3 && n ? `M ${S[S.length - 1].x} ${S[S.length - 1].y} L ${S[0].x} ${S[0].y}` : "", w = S[0], C = n ? v(n) : null, _ = (o == null ? void 0 : o.alignedVertexX) ? v(o.alignedVertexX) : null, T = (o == null ? void 0 : o.alignedVertexY) ? v(o.alignedVertexY) : null;
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
        C && T && y.jsx("line", {
          x1: T.x,
          y1: T.y,
          x2: C.x,
          y2: C.y,
          stroke: In.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        r && y.jsx("circle", {
          cx: w.x,
          cy: w.y,
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
        l.map((A, j) => {
          const U = S[j];
          return y.jsx("circle", {
            cx: U.x,
            cy: U.y,
            r: j === 0 ? 4 : 2.5,
            fill: j === 0 ? p : "white",
            stroke: p,
            strokeWidth: 1
          }, j);
        })
      ]
    });
  }
  function O5({ waypoints: l, cursorPoint: n, alignmentGuides: r }) {
    var _a;
    const { zoom: o, offset: s } = ze(), c = ye((N) => N.activeLayerId), f = ye((N) => N.layers), d = nn((N) => N.width), m = nn((N) => N.cornerRadius), p = nn((N) => N.numArcPoints), b = ((_a = f.get(c)) == null ? void 0 : _a.color) ?? "#888888", S = (N) => ({
      x: N.x * o + s.x,
      y: N.y * o + s.y
    });
    if (l.length === 0) return null;
    const E = n ? [
      ...l,
      n
    ] : l, k = E.map(S), w = k.map((N, R) => `${R === 0 ? "M" : "L"} ${N.x} ${N.y}`).join(" "), _ = VS(E, d, m, p).map(S), T = _.length > 0 ? _.map((N, R) => `${R === 0 ? "M" : "L"} ${N.x} ${N.y}`).join(" ") + " Z" : "", A = n ? S(n) : null, j = (r == null ? void 0 : r.alignedVertexX) ? S(r.alignedVertexX) : null, U = (r == null ? void 0 : r.alignedVertexY) ? S(r.alignedVertexY) : null;
    return y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        A && j && y.jsx("line", {
          x1: j.x,
          y1: j.y,
          x2: A.x,
          y2: A.y,
          stroke: In.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        A && U && y.jsx("line", {
          x1: U.x,
          y1: U.y,
          x2: A.x,
          y2: A.y,
          stroke: In.dark,
          strokeWidth: 1,
          strokeDasharray: "3 3",
          opacity: 0.5
        }),
        T && y.jsx("path", {
          d: T,
          fill: b,
          fillOpacity: 0.15,
          stroke: "none"
        }),
        T && y.jsx("path", {
          d: T,
          fill: "none",
          stroke: b,
          strokeWidth: 1,
          strokeOpacity: 0.4
        }),
        y.jsx("path", {
          d: w,
          fill: "none",
          stroke: b,
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        l.map((N, R) => {
          const O = k[R];
          return y.jsx("circle", {
            cx: O.x,
            cy: O.y,
            r: R === 0 ? 4 : 2.5,
            fill: R === 0 ? b : "white",
            stroke: b,
            strokeWidth: 1
          }, R);
        })
      ]
    });
  }
  function sh(l) {
    const n = 1 / (l * Se), r = Gv * n;
    return r >= py ? {
      unit: "mm",
      scale: py
    } : r >= yy ? {
      unit: "\xB5m",
      scale: yy
    } : {
      unit: "nm",
      scale: 1
    };
  }
  function D5(l) {
    return Number.isFinite(l) ? l : 0;
  }
  function gt(l, n) {
    const r = D5(l) / n.scale;
    return Math.abs(r) >= 1e6 ? r.toExponential(3) : r.toFixed(3);
  }
  const I5 = {
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
  }, Wy = 3, Jy = 5, z5 = 6, H5 = {
    dark: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: In.dark
    },
    light: {
      fill: "rgba(68, 255, 68, 0.3)",
      stroke: In.light
    }
  };
  function U5(l, n) {
    const r = Math.abs(n.x - l.x) / Se, o = Math.abs(n.y - l.y) / Se, s = Math.sqrt(r * r + o * o);
    return {
      dx: r,
      dy: o,
      diagonal: s
    };
  }
  function Y5({ point: l, worldToScreen: n, theme: r }) {
    const o = H5[r], s = n(l), c = z5;
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
  function B5({ ruler: l, worldToScreen: n, hoveredEndpoint: r, isSelected: o, isHovered: s, isDragging: c, theme: f, zoom: d }) {
    const m = I5[f], p = In[f], v = n(l.start), b = n(l.end), S = o ? p : s ? m.hover : m.line, E = o ? p : s ? m.hover : m.border, k = o || s || c ? 2 : 1.5, w = {
      x: (v.x + b.x) / 2,
      y: (v.y + b.y) / 2
    }, { dx: C, dy: _, diagonal: T } = U5(l.start, l.end), A = sh(d), j = `${gt(C, A)} ${A.unit}`, U = `${gt(_, A)} ${A.unit}`, N = `${gt(T, A)} ${A.unit}`, R = 140, O = 56;
    return y.jsxs("g", {
      children: [
        y.jsx("line", {
          x1: v.x,
          y1: v.y,
          x2: b.x,
          y2: b.y,
          stroke: S,
          strokeWidth: k,
          strokeDasharray: "6 4",
          strokeLinecap: "round"
        }),
        y.jsx("foreignObject", {
          x: w.x - R / 2,
          y: w.y - O / 2,
          width: R,
          height: O,
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
                    j
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
                    U
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
          r: r === "start" ? Jy : Wy,
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
          r: r === "end" ? Jy : Wy,
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
  function X5() {
    const { zoom: l, offset: n } = ze(), r = pe((S) => S.theme), { rulers: o, activeRulerId: s, selectedRulerIds: c, hoveredRulerId: f, marqueePreviewIds: d, hoveredEndpoint: m, draggingEndpoint: p, snapPoint: v } = Ne(), b = (S) => ({
      x: S.x * l + n.x,
      y: S.y * l + n.y
    });
    return o.size === 0 && !v ? null : y.jsxs("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: [
        Array.from(o.values()).map((S) => {
          const E = S.id === s, k = c.has(S.id), w = S.id === f || d.has(S.id), C = (m == null ? void 0 : m.rulerId) === S.id, _ = (p == null ? void 0 : p.rulerId) === S.id;
          return y.jsx(B5, {
            ruler: S,
            worldToScreen: b,
            hoveredEndpoint: C ? m.endpoint : _ ? p.endpoint : null,
            isSelected: k,
            isHovered: w && !k,
            isDragging: _ || E,
            theme: r,
            zoom: l
          }, S.id);
        }),
        v && y.jsx(Y5, {
          point: v,
          worldToScreen: b,
          theme: r
        })
      ]
    });
  }
  const eb = "ref:";
  function H0(l) {
    if (!l.startsWith(eb)) return null;
    const n = l.slice(eb.length), r = n.indexOf(":");
    if (r === -1) return null;
    const o = Number.parseInt(n.slice(0, r), 10);
    return Number.isNaN(o) ? null : o;
  }
  function V5(l) {
    const n = /* @__PURE__ */ new Set();
    for (const r of l) {
      const o = H0(r);
      o !== null && n.add(o);
    }
    return n;
  }
  const On = 9;
  function $5(l, n, r, o) {
    if (!l) return null;
    const s = `ref:${n}:0`, c = l.get_cell_ref_info(s);
    if (!c) return null;
    const [f, d, m, p, v, b] = c.transform, S = c.cell_name;
    c.free();
    const E = l.get_cell_origin_by_name(S), k = E ? E[0] : 0, w = E ? E[1] : 0, C = f * k + d * w + v, _ = m * k + p * w + b;
    return {
      x: C * r + o.x,
      y: _ * r + o.y
    };
  }
  function q5() {
    const { zoom: l, offset: n } = ze(), r = xe((b) => b.library), s = pe((b) => b.theme) === "dark";
    xe((b) => b.syncGeneration), he((b) => b.activeCell);
    const c = oe((b) => b.selectedIds), f = oe((b) => b.hoveredId), d = V5(c);
    if (f) {
      const b = H0(f);
      b !== null && d.add(b);
    }
    if (d.size === 0) return null;
    let m = [];
    if (r) try {
      const b = r.get_instance_label_data();
      b && Array.isArray(b) && (m = b);
    } catch {
      return null;
    }
    const p = m.filter((b) => d.has(b.elementIndex));
    if (p.length === 0) return null;
    const v = s ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
    return y.jsx(y.Fragment, {
      children: p.map((b) => {
        const S = b.minX * l + n.x, E = b.minY * l + n.y, k = $5(r, b.elementIndex, l, n);
        return y.jsxs("div", {
          children: [
            y.jsx("div", {
              className: B("pointer-events-none absolute text-[13px] leading-none font-mono select-none", s ? "text-white" : "text-black"),
              style: {
                left: `${S}px`,
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
  function G5(l, n) {
    const r = n / Jf, o = l.split(`
`), s = Math.max(1, ...o.map((d) => d.length)), c = r * 0.6 * s, f = r * 1.2 * o.length;
    return {
      width: c,
      totalHeight: f
    };
  }
  function P5({ label: l, zoom: n, offset: r, color: o, isSelected: s, isHovered: c }) {
    const f = l.height / Jf * n;
    if (f < 1) return null;
    const { width: d, totalHeight: m } = G5(l.text, l.height), p = l.x * n + r.x, v = (l.y - m) * n + r.y, b = s || c;
    let S;
    if (b) {
      const E = d * n, k = m * n, w = s ? "rgba(68, 255, 68, 0.8)" : o;
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
    return y.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0 select-none whitespace-pre",
      style: {
        transform: `translate(${p}px, ${v}px)`,
        fontSize: `${f}px`,
        lineHeight: 1.2,
        fontFamily: Kv,
        color: s ? "rgb(68, 255, 68)" : o
      },
      children: [
        b && y.jsx("div", {
          style: S
        }),
        l.text
      ]
    });
  }
  function K5({ zoom: l, offset: n, color: r }) {
    const o = Ft((_) => _.activeText), s = Ft((_) => _.showCursor);
    if (!o) return null;
    const c = Pv * Se / Jf * l;
    if (c < 1) return null;
    const f = c * 1.2, d = c * 0.6, m = o.content.split(`
`), p = f * Math.max(1, m.length), v = o.x * l + n.x, b = o.y * l + n.y - p, S = ih(o.selection), E = o.cursorPosition.line, w = o.cursorPosition.column * d, C = E * f;
    return y.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0 select-none",
      style: {
        transform: `translate(${v}px, ${b}px)`,
        fontSize: `${c}px`,
        lineHeight: `${f}px`,
        fontFamily: Kv,
        color: r
      },
      children: [
        m.map((_, T) => {
          if (!(S && T >= S.start.line && T <= S.end.line)) return y.jsx("div", {
            style: {
              height: `${f}px`,
              whiteSpace: "pre"
            },
            children: _ || "\u200B"
          }, T);
          const j = T === S.start.line ? S.start.column : 0, U = T === S.end.line ? S.end.column : _.length, N = _.substring(0, j), R = _.substring(j, U), O = _.substring(U);
          return y.jsxs("div", {
            style: {
              height: `${f}px`,
              whiteSpace: "pre"
            },
            children: [
              N && y.jsx("span", {
                children: N
              }),
              R && y.jsx("span", {
                style: {
                  backgroundColor: "rgba(65, 105, 225, 0.7)",
                  color: "#ffffff"
                },
                children: R
              }),
              O && y.jsx("span", {
                children: O
              }),
              !_ && "\u200B"
            ]
          }, T);
        }),
        s && y.jsx("div", {
          className: "absolute",
          style: {
            left: `${w}px`,
            top: `${C}px`,
            width: "2px",
            height: `${f}px`,
            backgroundColor: r
          }
        })
      ]
    });
  }
  function Z5() {
    var _a;
    const { zoom: l, offset: n } = ze(), r = xe((_) => _.library), s = pe((_) => _.theme) === "dark", c = Ft((_) => _.isEditingText), f = xe((_) => _.syncGeneration), d = he((_) => _.activeCell), m = oe((_) => _.selectedIds), p = oe((_) => _.hoveredId), v = ye((_) => _.layers), b = ye((_) => _.activeLayerId), S = g.useMemo(() => {
      if (!r) return [];
      try {
        const _ = r.get_text_labels();
        if (_ && Array.isArray(_)) return _;
      } catch {
      }
      return [];
    }, [
      r,
      f,
      d
    ]), k = ((_a = v.get(b)) == null ? void 0 : _a.color) ?? (s ? "#ffffff" : "#000000"), w = (_, T) => {
      for (const A of v.values()) if (A.layerNumber === _ && A.datatype === T) return A.color;
      return s ? "#ffffff" : "#000000";
    };
    return S.length > 0 || c ? y.jsxs("div", {
      className: B("pointer-events-none absolute inset-0 overflow-hidden"),
      children: [
        S.map((_) => y.jsx(P5, {
          label: _,
          zoom: l,
          offset: n,
          color: w(_.layer, _.datatype),
          isSelected: m.has(_.id),
          isHovered: p === _.id
        }, _.id)),
        c && y.jsx(K5, {
          zoom: l,
          offset: n,
          color: k
        })
      ]
    }) : null;
  }
  function F5() {
    const { zoom: l, offset: n } = ze(), r = oe((S) => S.selectedIds), o = oe((S) => S.hoveredId), s = nn((S) => S.pathMetadata), c = pe((S) => S.theme), f = c === "dark" ? In.dark : In.light, d = c === "dark" ? Qs.dark : Qs.light, m = (S) => ({
      x: S.x * l + n.x,
      y: S.y * l + n.y
    }), p = [];
    for (const S of r) {
      const E = s.get(S);
      E && E.waypoints.length >= 2 && p.push({
        meta: E,
        color: f
      });
    }
    let v = null;
    if (o && !r.has(o)) {
      const S = s.get(o);
      S && S.waypoints.length >= 2 && (v = {
        meta: S,
        color: d
      });
    }
    const b = v ? [
      ...p,
      v
    ] : p;
    return b.length === 0 ? null : y.jsx("svg", {
      className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
      children: b.map(({ meta: S, color: E }, k) => {
        const w = S.waypoints.map(m), C = w.map((_, T) => `${T === 0 ? "M" : "L"} ${_.x} ${_.y}`).join(" ");
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
            w.map((_, T) => y.jsx("circle", {
              cx: _.x,
              cy: _.y,
              r: 3,
              fill: E,
              fillOpacity: 0.9
            }, T))
          ]
        }, k);
      })
    });
  }
  function Q5({ entry: l, zoom: n, offset: r, isSelected: o, isHovered: s, isDark: c }) {
    const f = l.x * n + r.x, d = l.y * n + r.y, m = l.width * n, p = l.height * n;
    if (m < 1 && p < 1) return null;
    const v = o || s, b = o ? "rgba(68, 255, 68, 0.8)" : c ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
    return y.jsxs("div", {
      className: "pointer-events-none absolute top-0 left-0",
      style: {
        transform: `translate(${f}px, ${d}px)`,
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
  function W5() {
    const { zoom: l, offset: n } = ze(), r = Ot((d) => d.images), o = oe((d) => d.selectedIds), s = oe((d) => d.hoveredId), f = pe((d) => d.theme) === "dark";
    return r.size === 0 ? null : y.jsx("div", {
      className: B("pointer-events-none absolute inset-0 overflow-hidden"),
      children: [
        ...r.values()
      ].map((d) => {
        const m = Jo(d.id);
        return y.jsx(Q5, {
          entry: d,
          zoom: l,
          offset: n,
          isSelected: o.has(m),
          isHovered: s === m,
          isDark: f
        }, d.id);
      })
    });
  }
  function Ya(l, n) {
    g.useEffect(() => {
      if (n) return zf.getState().claim(l), () => {
        zf.getState().release(l);
      };
    }, [
      l,
      n
    ]);
  }
  function J5(l) {
    return "separator" in l && l.separator;
  }
  function eC({ library: l, renderer: n, canvasRef: r }) {
    const o = g.useRef(null), { isOpen: s, position: c, variant: f, targetId: d, close: m } = ac(), { selectedIds: p } = oe(), { hasContent: v } = zn(), S = pe((A) => A.theme) === "dark";
    Ya("context-menu", s);
    const E = l ? l.get_all_ids().length > 0 : false, k = p.size > 0, C = g.useCallback(() => {
      const A = () => {
        if (!l) return;
        const O = mr(l, p);
        zn.getState().copy(O), m();
      }, j = () => {
        if (!l || !n) return;
        const O = new cc();
        de.getState().execute(O, {
          library: l,
          renderer: n
        });
        const H = r.current;
        H && Ur(l, H), m();
      }, U = () => {
        if (!l || !n || p.size === 0) return;
        const O = new uc([
          ...p
        ]);
        de.getState().execute(O, {
          library: l,
          renderer: n
        });
        const H = r.current;
        H && Ur(l, H), m();
      }, N = () => {
        if (!l || !n || p.size === 0) return;
        const O = new sc([
          ...p
        ]);
        de.getState().execute(O, {
          library: l,
          renderer: n
        }), m();
      }, R = () => {
        if (!l) return;
        const O = l.get_all_ids();
        oe.getState().selectAll(O), m();
      };
      if (f === "element") return [
        {
          id: "edit",
          label: "Edit",
          shortcut: {
            key: "E"
          },
          action: () => {
            pe.getState().requestInspectorFocus(), m();
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
          action: A,
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
          action: j,
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
          action: U,
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
          action: R,
          disabled: !E
        }
      ];
      if (f === "ruler") {
        const O = () => {
          if (!l || !n) return;
          const { selectedRulerIds: H } = Ne.getState();
          if (H.size > 0) {
            const G = new th([
              ...H
            ]);
            de.getState().execute(G, {
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
            action: j,
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
            action: O,
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
            action: R,
            disabled: true
          }
        ];
      }
      if (f === "image") {
        const O = () => {
          pe.getState().requestInspectorFocus(), m();
        }, H = () => {
          if (!l || !n) return;
          const G = [
            ...p
          ].filter(Sn).map(Yr);
          if (G.length > 0) {
            const te = new A0(G);
            de.getState().execute(te, {
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
            action: O,
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
            action: H,
            disabled: false
          }
        ];
      }
      if (f === "layer") {
        const O = d ? Number(d) : null, H = ye.getState(), G = O !== null ? H.getLayer(O) : void 0, te = H.layers.size <= 1, ee = () => {
          if (!l || !n) return;
          const D = new x0();
          de.getState().execute(D, {
            library: l,
            renderer: n
          }), m();
        }, fe = () => {
          O !== null && ye.getState().setEditingLayerId(O), m();
        }, me = () => {
          O !== null && ye.getState().toggleVisibility(O), m();
        }, Ee = () => {
          if (!l || !n || O === null) return;
          const D = new nh(O);
          de.getState().execute(D, {
            library: l,
            renderer: n
          }), m();
        }, q = Array.from(H.layers.values()), F = q.every((D) => D.visible), ce = q.every((D) => !D.visible), _e = () => {
          ye.getState().showAllLayers(), m();
        }, be = () => {
          ye.getState().hideAllLayers(), m();
        };
        return [
          {
            id: "editLayer",
            label: "Edit Layer",
            action: () => {
              O !== null && (ye.getState().setExpandedLayerId(O), ye.getState().setActiveLayer(O), pe.getState().setSidebarTab("layers")), m();
            },
            disabled: !G
          },
          {
            id: "addLayer",
            label: "Add Layer",
            action: ee,
            disabled: false
          },
          {
            id: "rename",
            label: "Rename Layer",
            action: fe,
            disabled: !G
          },
          {
            id: "toggleVisibility",
            label: (G == null ? void 0 : G.visible) ? "Hide Layer" : "Show Layer",
            action: me,
            disabled: !G
          },
          {
            id: "sep1",
            separator: true
          },
          {
            id: "showAll",
            label: "Show All Layers",
            action: _e,
            disabled: F
          },
          {
            id: "hideAll",
            label: "Hide All Layers",
            action: be,
            disabled: ce
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "delete",
            label: "Delete Layer",
            action: Ee,
            disabled: !G || te
          }
        ];
      }
      if (f === "cell") {
        const O = d, H = he.getState(), G = H.cells.length <= 1, te = () => {
          var _a;
          const $ = ((_a = l.get_cell_names) == null ? void 0 : _a.call(l)) ?? H.cells;
          let J = 1, W = `cell${J}`;
          for (; $.includes(W); ) J++, W = `cell${J}`;
          return W;
        }, ee = ($) => {
          const J = H.cellTree;
          if (!J) return null;
          const W = (ie, X) => {
            for (const ue of ie) {
              if (ue.name === $) return X;
              const I = W(ue.children, ue.name);
              if (I != null) return I;
            }
            return null;
          };
          return W(J, null);
        }, fe = () => {
          if (!l || !n || !O) return;
          const $ = te(), W = ee(O) ?? O, ie = new FS($, W);
          de.getState().execute(ie, {
            library: l,
            renderer: n
          }), m();
        }, me = () => {
          O && he.getState().setEditingCellName(O), m();
        }, Ee = () => {
          if (!l || !n || !O) return;
          const $ = new lh(O);
          de.getState().execute($, {
            library: l,
            renderer: n
          }), m();
        }, q = O ? H.hiddenCells.has(O) : false, F = () => {
          O && he.getState().toggleCellVisibility(O), m();
        }, ce = H.cells, _e = ce.every(($) => !H.hiddenCells.has($)), be = ce.every(($) => H.hiddenCells.has($));
        return [
          {
            id: "addCell",
            label: "Add Cell",
            action: fe,
            disabled: !O
          },
          {
            id: "rename",
            label: "Rename Cell",
            action: me,
            disabled: !O
          },
          {
            id: "toggleVisibility",
            label: q ? "Show Cell" : "Hide Cell",
            action: F,
            disabled: !O
          },
          {
            id: "sep1",
            separator: true
          },
          {
            id: "showAllCells",
            label: "Show All Cells",
            action: () => {
              he.getState().showAllCells(), m();
            },
            disabled: _e
          },
          {
            id: "hideAllCells",
            label: "Hide All Cells",
            action: () => {
              he.getState().hideAllCells(), m();
            },
            disabled: be
          },
          {
            id: "sep2",
            separator: true
          },
          {
            id: "delete",
            label: "Delete Cell",
            action: Ee,
            disabled: !O || G
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
          action: j,
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
          action: R,
          disabled: !E
        }
      ];
    }, [
      f,
      l,
      n,
      p,
      k,
      v,
      E,
      m,
      r,
      d
    ])();
    g.useEffect(() => {
      if (!s) return;
      const A = (j) => {
        o.current && !o.current.contains(j.target) && m();
      };
      return document.addEventListener("mousedown", A), () => document.removeEventListener("mousedown", A);
    }, [
      s,
      m
    ]), g.useEffect(() => {
      if (!s) return;
      const A = (j) => {
        j.key === "Escape" && (j.preventDefault(), m());
      };
      return document.addEventListener("keydown", A), () => document.removeEventListener("keydown", A);
    }, [
      s,
      m
    ]);
    const [_, T] = g.useState(c);
    return g.useLayoutEffect(() => {
      if (!s || !o.current) {
        T(c);
        return;
      }
      const j = o.current.getBoundingClientRect(), U = 8;
      let { x: N, y: R } = c;
      N + j.width + U > window.innerWidth && (N = window.innerWidth - j.width - U), R + j.height + U > window.innerHeight && (R = window.innerHeight - j.height - U), N < U && (N = U), R < U && (R = U), T({
        x: N,
        y: R
      });
    }, [
      s,
      c
    ]), s ? y.jsx("div", {
      ref: o,
      className: B("fixed z-50 min-w-[170px] rounded-xl border py-1", S ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      style: {
        left: _.x,
        top: _.y
      },
      children: C.map((A) => {
        var _a;
        if (J5(A)) return y.jsx("div", {
          className: B("my-1 h-px", S ? "bg-white/10" : "bg-black/10")
        }, A.id);
        const j = A;
        return y.jsxs("button", {
          className: B("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs", "transition-colors", j.disabled ? "opacity-40" : S ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          onClick: () => {
            j.disabled || j.action();
          },
          disabled: j.disabled,
          children: [
            y.jsx("span", {
              children: j.label
            }),
            j.shortcut && y.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = j.shortcut.modifiers) == null ? void 0 : _a.map((U) => y.jsx("kbd", {
                  className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", S ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: U
                }, U)),
                y.jsx("kbd", {
                  className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", S ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: j.shortcut.key
                })
              ]
            })
          ]
        }, j.id);
      })
    }) : null;
  }
  const tb = "rosette-canvas";
  function nb() {
    const l = g.useRef(null), n = g.useRef(null), r = g.useRef({
      x: 0,
      y: 0
    }), o = g.useRef(null), s = g.useRef(null), [c, f] = g.useState(false), [d, m] = g.useState(false), { wasm: p, isReady: v } = qv(), { renderer: b, isReady: S, render: E, resize: k, screenToWorld: w, error: C } = mS(c ? tb : null), { library: _ } = YS(p, v);
    g.useEffect(() => (xe.getState().setLibrary(_), () => xe.getState().setLibrary(null)), [
      _
    ]), g.useEffect(() => (xe.getState().setRenderer(b), () => xe.getState().setRenderer(null)), [
      b
    ]);
    const { zoomAt: T, pan: A, initOffset: j, zoom: U, offset: N } = ze(), R = pe((le) => le.setCursorWorld), O = pe((le) => le.theme), H = Xt((le) => le.activeTool), { handleMouseDown: G, handleMouseMove: te, handleMouseUp: ee, isLaserActive: fe } = P2(b, S), { handleMouseDown: me, handleMouseMove: Ee, handleMouseUp: q, box: F, isZoomActive: ce, isDrawingZoom: _e } = Z2(n), { handleMouseDown: be, handleMouseMove: L, finalizeRectangle: D, cancelDrawing: $ } = F2(w, _, b), { handleMouseDown: J, handleMouseMove: W, handleMouseUp: ie, handleMouseLeave: X, hoveredId: ue, hoveredRulerId: I, marqueeBox: se, isDrawingMarquee: ge } = s5(w, _, b), { handleMouseDown: ve, handleMouseMove: Le, handleMouseUp: Me, handleMouseLeave: $e, hoveredRulerId: Ze } = h5(w, _, b), { handleMouseDown: we, handleMouseMove: je, cancelDrawing: Ae, points: et, cursorPoint: Fe, isNearStart: Ut, alignmentGuides: hn } = W2(w, _, b, U), { handleMouseDown: jt, handleMouseMove: il, cancelDrawing: Rl, waypoints: Al, cursorPoint: $r, alignmentGuides: gc } = e5(w, _, b, U), { handleMouseDown: Ba, handleMouseMove: ii, handleMouseUp: si, cancelDrawing: Tl, isCreating: Wt, isDraggingEndpoint: Pn, isMovingRuler: Jt, hoveredRulerId: pc } = _5(w, _, b, U, N), { handleMouseDown: ci, handleMouseMove: ui, cancelEditing: pr, isEditing: qr } = b5(w, _, b);
    g.useEffect(() => {
      const le = l.current, Oe = n.current;
      if (!le || !Oe) return;
      const it = () => {
        const pt = le.getBoundingClientRect(), mt = Math.floor(pt.width), nt = Math.floor(pt.height);
        if (mt > 0 && nt > 0) {
          const dt = window.devicePixelRatio || 1;
          Oe.width = Math.floor(mt * dt), Oe.height = Math.floor(nt * dt), Oe.style.width = `${mt}px`, Oe.style.height = `${nt}px`, j(mt, nt), c || f(true), k(Math.floor(mt * dt), Math.floor(nt * dt)), E();
        }
      };
      it();
      const qe = new ResizeObserver(it);
      return qe.observe(le), () => qe.disconnect();
    }, [
      k,
      E,
      c,
      j
    ]), g.useEffect(() => {
      if (!S) return;
      let le;
      const Oe = () => {
        E(), le = requestAnimationFrame(Oe);
      };
      return Oe(), () => cancelAnimationFrame(le);
    }, [
      S,
      E
    ]);
    const Gr = ye((le) => le.layers);
    g.useEffect(() => {
      !b || !_ || (b.sync_from_library(_), b.mark_dirty());
    }, [
      b,
      _,
      Gr
    ]);
    const En = he((le) => le.activeCell);
    g.useEffect(() => {
      if (!_ || !b || !En) return;
      if (_.active_cell_name() !== En) {
        _.set_active_cell(En), b.sync_from_library(_), b.mark_dirty();
        const Oe = n.current;
        if (Oe) {
          const it = _.get_all_bounds(), qe = ol(Oe);
          if (it && qe.width > 0 && qe.height > 0) {
            const pt = {
              minX: it[0],
              minY: it[1],
              maxX: it[2],
              maxY: it[3]
            };
            ze.getState().zoomToFit(pt, qe.width, qe.height, qe.screenCenter);
          }
        }
      }
    }, [
      _,
      b,
      En
    ]);
    const Nl = he((le) => le.hierarchyLevelLimit);
    g.useEffect(() => {
      if (!_ || !b) return;
      const le = Nl === 1 / 0 ? 0 : Nl;
      _.set_hierarchy_depth_limit(le), b.sync_from_library(_), b.mark_dirty();
    }, [
      _,
      b,
      Nl
    ]);
    const sl = he((le) => le.hiddenCells);
    g.useEffect(() => {
      if (!_ || !b) return;
      const le = new Set(_.get_hidden_cells());
      for (const Oe of le) sl.has(Oe) || _.set_cell_visibility(Oe, true);
      for (const Oe of sl) le.has(Oe) || _.set_cell_visibility(Oe, false);
      b.sync_from_library(_), b.mark_dirty();
    }, [
      _,
      b,
      sl
    ]);
    const di = g.useRef(false), Pr = g.useRef(null);
    g.useEffect(() => {
      const le = n.current;
      if (!_ || !le) return;
      const Oe = _.get_all_bounds();
      if (!Oe) return;
      const it = {
        minX: Oe[0],
        minY: Oe[1],
        maxX: Oe[2],
        maxY: Oe[3]
      }, qe = ol(le);
      if (qe.width <= 0 || qe.height <= 0) return;
      const pt = Pr.current !== null && Pr.current !== _;
      if (!di.current || pt) {
        ze.getState().zoomToFit(it, qe.width, qe.height, qe.screenCenter);
        const nt = Zo() ? DS() : null;
        if (nt !== null) {
          const dt = qe.screenCenter ?? {
            x: qe.width / 2,
            y: qe.height / 2
          };
          ze.getState().zoomAt(nt, dt.x, dt.y);
        }
        di.current = true;
      }
      Pr.current = _;
    }, [
      _
    ]);
    const yr = g.useCallback((le) => {
      le.preventDefault();
      const Oe = n.current;
      if (!Oe) return;
      const it = Oe.getBoundingClientRect(), qe = le.clientX - it.left, pt = le.clientY - it.top, mt = le.ctrlKey || Math.abs(le.deltaY) < 50;
      let nt;
      mt ? nt = Math.pow(2, -le.deltaY * 0.01) : nt = le.deltaY > 0 ? rc : lc, T(nt, qe, pt);
    }, [
      T
    ]), br = g.useCallback((le) => {
      if (H === "laser" && le.button === 0) {
        G(le);
        return;
      }
      if (H === "zoom" && le.button === 0) {
        me(le);
        return;
      }
      if (H === "rectangle" && le.button === 0) {
        be(le);
        return;
      }
      if (H === "select" && le.button === 0) {
        J(le);
        return;
      }
      if (H === "move" && le.button === 0) {
        ve(le);
        return;
      }
      if (H === "polygon" && le.button === 0) {
        we(le);
        return;
      }
      if (H === "path" && le.button === 0) {
        jt(le);
        return;
      }
      if (H === "ruler" && le.button === 0) {
        Ba(le);
        return;
      }
      if (H === "text" && le.button === 0) {
        ci(le);
        return;
      }
      (le.button === 1 || le.button === 0 && H === "pan") && (m(true), r.current = {
        x: le.clientX,
        y: le.clientY
      });
    }, [
      H,
      G,
      me,
      be,
      J,
      ve,
      we,
      jt,
      Ba,
      ci
    ]), Kn = g.useRef(0);
    g.useEffect(() => () => {
      Kn.current && cancelAnimationFrame(Kn.current);
    }, []), g.useEffect(() => {
      const le = o.current;
      if (!le) return;
      const Oe = (le.x - N.x) / U, it = (le.y - N.y) / U, qe = Math.trunc(Oe / Se), pt = Math.trunc(it / Se);
      R({
        x: qe,
        y: -pt
      });
    }, [
      U,
      N,
      R
    ]);
    const fi = g.useCallback((le) => {
      const Oe = n.current;
      if (!Oe) return;
      const it = Oe.getBoundingClientRect(), qe = le.clientX - it.left, pt = le.clientY - it.top;
      o.current = {
        x: qe,
        y: pt
      };
      let mt = false;
      H === "laser" && te(le), H === "zoom" && Ee(le), H === "rectangle" && L(qe, pt) && (mt = true), H === "select" && W(le), H === "move" && Le(le), H === "polygon" && je(le), H === "path" && il(le), H === "ruler" && ii(le), H === "text" && ui(le);
      const nt = w(qe, pt);
      if (s.current = nt, Kn.current === 0 && (Kn.current = requestAnimationFrame(() => {
        Kn.current = 0;
        const dt = s.current;
        if (dt) {
          const Et = Math.trunc(dt.x / Se), Qe = Math.trunc(dt.y / Se);
          R({
            x: Et,
            y: -Qe
          });
        } else R(null);
      })), d) {
        const dt = le.clientX - r.current.x, Et = le.clientY - r.current.y;
        r.current = {
          x: le.clientX,
          y: le.clientY
        }, A(dt, Et);
      }
      mt && E();
    }, [
      A,
      w,
      R,
      d,
      H,
      te,
      Ee,
      L,
      W,
      Le,
      je,
      il,
      ii,
      ui,
      E
    ]), hi = g.useCallback(() => {
      H === "laser" && ee(), H === "zoom" && q(), H === "rectangle" && s.current && D(s.current.x, s.current.y), H === "select" && ie(), H === "move" && Me(), H === "ruler" && si(), m(false);
    }, [
      H,
      ee,
      q,
      D,
      ie,
      Me,
      si
    ]), mi = g.useCallback(() => {
      m(false), $(), Ae(), Rl(), Tl(), pr(), X(), $e(), Kn.current && (cancelAnimationFrame(Kn.current), Kn.current = 0), o.current = null, R(null);
    }, [
      R,
      $,
      Ae,
      Rl,
      Tl,
      pr,
      X,
      $e
    ]), Zn = ac((le) => le.open), Xa = g.useCallback((le) => {
      le.preventDefault();
      const Oe = n.current;
      if (!Oe) return;
      const it = Oe.getBoundingClientRect(), qe = le.clientX - it.left, pt = le.clientY - it.top, mt = w(qe, pt);
      if (!mt) return;
      const { rulers: nt, selectRuler: dt } = Ne.getState();
      for (const Qe of nt.values()) {
        const Yt = Qe.start.x * U + N.x, Lt = Qe.start.y * U + N.y, rt = Qe.end.x * U + N.x, Qn = Qe.end.y * U + N.y, Wn = (Yt + rt) / 2, mn = (Lt + Qn) / 2, Hn = 70, Kr = 28;
        if (qe >= Wn - Hn && qe <= Wn + Hn && pt >= mn - Kr && pt <= mn + Kr) {
          dt(Qe.id), Zn("ruler", {
            x: le.clientX,
            y: le.clientY
          }, Qe.id);
          return;
        }
        const Ol = qe - Yt, xr = pt - Lt, Dl = rt - Yt, Jn = Qn - Lt, Il = Ol * Dl + xr * Jn, rn = Dl * Dl + Jn * Jn;
        if (rn > 0) {
          const Vt = Math.max(0, Math.min(1, Il / rn)), gi = Yt + Vt * Dl, yc = Lt + Vt * Jn, Zr = qe - gi, Va = pt - yc;
          if (Math.sqrt(Zr * Zr + Va * Va) <= 8) {
            dt(Qe.id), Zn("ruler", {
              x: le.clientX,
              y: le.clientY
            }, Qe.id);
            return;
          }
        }
      }
      if (_) {
        const Qe = _.hit_test(mt.x, mt.y);
        if (Qe) {
          const Yt = _.get_group_ids(Qe), { selectedIds: Lt, setSelection: rt } = oe.getState();
          Yt.every((Wn) => Lt.has(Wn)) || rt(new Set(Yt)), Zn("element", {
            x: le.clientX,
            y: le.clientY
          }, Qe);
          return;
        }
      }
      const Et = Po(mt.x, mt.y);
      if (Et) {
        const { selectedIds: Qe } = oe.getState();
        Qe.has(Et) || oe.getState().select(Et), Zn("image", {
          x: le.clientX,
          y: le.clientY
        }, Et);
        return;
      }
      Zn("canvas", {
        x: le.clientX,
        y: le.clientY
      });
    }, [
      _,
      w,
      Zn,
      U,
      N
    ]), Fn = $s((le) => le.cellName), vr = g.useRef(null);
    if (g.useEffect(() => {
      if (!Fn) return;
      const le = n.current;
      if (!le || !b || !_) return;
      const { bounds: Oe, origin: it } = $s.getState(), qe = (mt) => {
        if (!Oe) return;
        const nt = le.getBoundingClientRect(), dt = mt.clientX - nt.left, Et = mt.clientY - nt.top, Qe = w(dt, Et);
        if (!Qe) return;
        const Yt = Qe.x - it.x, Lt = Qe.y - it.y, rt = Oe[0] + Yt, Qn = Oe[1] + Lt, Wn = Oe[2] + Yt, mn = Oe[3] + Lt, Hn = new Float64Array([
          rt,
          Qn,
          Wn,
          Qn,
          Wn,
          mn,
          rt,
          mn
        ]), Kr = new Float32Array([
          0.5,
          0.5,
          0.5,
          0
        ]);
        b.set_preview_shape(Hn, Kr);
        const { zoom: Ol, offset: xr } = ze.getState(), Dl = 9 / Ol, Il = pe.getState().theme === "dark" ? new Float32Array([
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
        if (b.set_preview_origin(Qe.x, Qe.y, Dl, Il), b.mark_dirty(), vr.current) {
          const rn = rt * Ol + xr.x, Vt = Qn * Ol + xr.y;
          vr.current.style.transform = `translate(${rn}px, ${Vt}px) translateY(-100%)`, vr.current.style.display = "block";
        }
      }, pt = (mt) => {
        const nt = le.getBoundingClientRect(), dt = mt.clientX - nt.left, Et = mt.clientY - nt.top, Qe = w(dt, Et);
        b.clear_preview(), b.mark_dirty();
        const Yt = dt >= 0 && Et >= 0 && dt <= nt.width && Et <= nt.height;
        if (Qe && Yt) {
          const Lt = _.active_cell_name();
          if (Lt && Lt !== Fn && _.can_instance_cell(Lt, Fn)) {
            const rt = new C0(Fn, Qe.x, Qe.y);
            de.getState().execute(rt, {
              library: _,
              renderer: b
            });
          }
        }
        $s.getState().endDrag();
      };
      return document.addEventListener("mousemove", qe), document.addEventListener("mouseup", pt), () => {
        document.removeEventListener("mousemove", qe), document.removeEventListener("mouseup", pt), b.clear_preview(), b.mark_dirty();
      };
    }, [
      Fn,
      _,
      b,
      w
    ]), g.useEffect(() => {
      const le = n.current;
      if (le) return le.addEventListener("wheel", yr, {
        passive: false
      }), () => le.removeEventListener("wheel", yr);
    }, [
      yr
    ]), Y2(n, _, b), C) return y.jsx("div", {
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
      if (d || Jt) return "cursor-grabbing";
      if (H === "pan") return "cursor-grab";
      if (H === "move") return "cursor-move";
      if (fe) return "cursor-none";
      if (ce || H === "rectangle" || H === "polygon" || H === "path") return "cursor-crosshair";
      if (H === "text") return qr ? "cursor-text" : "cursor-crosshair";
      if (H === "ruler") return Pn ? "cursor-grabbing" : Wt ? "cursor-crosshair" : pc ? "cursor-pointer" : "cursor-crosshair";
      if (H === "select") {
        if (ge) return "cursor-crosshair";
        if (I || ue) return "cursor-pointer";
      }
      return "cursor-default";
    })();
    return y.jsxs("div", {
      ref: l,
      className: "relative h-full w-full select-none overflow-hidden",
      children: [
        y.jsx("canvas", {
          ref: n,
          id: tb,
          className: It,
          onMouseDown: br,
          onMouseMove: fi,
          onMouseUp: hi,
          onMouseLeave: mi,
          onContextMenu: Xa
        }),
        fe && !d && y.jsx(k5, {}),
        _e && F && y.jsx(L5, {
          box: F
        }),
        ge && se && y.jsx(T5, {
          box: se
        }),
        H === "polygon" && et.length > 0 && y.jsx(N5, {
          points: et,
          cursorPoint: Fe,
          isNearStart: Ut,
          alignmentGuides: hn
        }),
        H === "path" && Al.length > 0 && y.jsx(O5, {
          waypoints: Al,
          cursorPoint: $r,
          alignmentGuides: gc
        }),
        Fn && y.jsx("div", {
          ref: vr,
          className: `pointer-events-none absolute top-0 left-0 text-[13px] leading-none font-mono select-none ${O === "dark" ? "text-white" : "text-black"}`,
          style: {
            display: "none",
            paddingBottom: "2px"
          },
          children: Fn
        }),
        y.jsx(W5, {}),
        y.jsx(F5, {}),
        y.jsx(q5, {}),
        y.jsx(Z5, {}),
        y.jsx(X5, {}),
        y.jsx(eC, {
          library: _,
          renderer: b,
          canvasRef: n
        })
      ]
    });
  }
  var lb = 1, tC = 0.9, nC = 0.8, lC = 0.17, Yd = 0.1, Bd = 0.999, rC = 0.9999, aC = 0.99, oC = /[\\\/_+.#"@\[\(\{&]/, iC = /[\\\/_+.#"@\[\(\{&]/g, sC = /[\s-]/, U0 = /[\s-]/g;
  function Vf(l, n, r, o, s, c, f) {
    if (c === n.length) return s === l.length ? lb : aC;
    var d = `${s},${c}`;
    if (f[d] !== void 0) return f[d];
    for (var m = o.charAt(c), p = r.indexOf(m, s), v = 0, b, S, E, k; p >= 0; ) b = Vf(l, n, r, o, p + 1, c + 1, f), b > v && (p === s ? b *= lb : oC.test(l.charAt(p - 1)) ? (b *= nC, E = l.slice(s, p - 1).match(iC), E && s > 0 && (b *= Math.pow(Bd, E.length))) : sC.test(l.charAt(p - 1)) ? (b *= tC, k = l.slice(s, p - 1).match(U0), k && s > 0 && (b *= Math.pow(Bd, k.length))) : (b *= lC, s > 0 && (b *= Math.pow(Bd, p - s))), l.charAt(p) !== n.charAt(c) && (b *= rC)), (b < Yd && r.charAt(p - 1) === o.charAt(c + 1) || o.charAt(c + 1) === o.charAt(c) && r.charAt(p - 1) !== o.charAt(c)) && (S = Vf(l, n, r, o, p + 1, c + 2, f), S * Yd > b && (b = S * Yd)), b > v && (v = b), p = r.indexOf(m, p + 1);
    return f[d] = v, v;
  }
  function rb(l) {
    return l.toLowerCase().replace(U0, " ");
  }
  function cC(l, n, r) {
    return l = r && r.length > 0 ? `${l + " " + r.join(" ")}` : l, Vf(l, n, rb(l), rb(n), 0, 0, {});
  }
  function cr(l, n, { checkForDefaultPrevented: r = true } = {}) {
    return function(s) {
      if (l == null ? void 0 : l(s), r === false || !s.defaultPrevented) return n == null ? void 0 : n(s);
    };
  }
  function ab(l, n) {
    if (typeof l == "function") return l(n);
    l != null && (l.current = n);
  }
  function fr(...l) {
    return (n) => {
      let r = false;
      const o = l.map((s) => {
        const c = ab(s, n);
        return !r && typeof c == "function" && (r = true), c;
      });
      if (r) return () => {
        for (let s = 0; s < o.length; s++) {
          const c = o[s];
          typeof c == "function" ? c() : ab(l[s], null);
        }
      };
    };
  }
  function Vr(...l) {
    return g.useCallback(fr(...l), l);
  }
  function uC(l, n) {
    const r = g.createContext(n), o = (c) => {
      const { children: f, ...d } = c, m = g.useMemo(() => d, Object.values(d));
      return y.jsx(r.Provider, {
        value: m,
        children: f
      });
    };
    o.displayName = l + "Provider";
    function s(c) {
      const f = g.useContext(r);
      if (f) return f;
      if (n !== void 0) return n;
      throw new Error(`\`${c}\` must be used within \`${l}\``);
    }
    return [
      o,
      s
    ];
  }
  function dC(l, n = []) {
    let r = [];
    function o(c, f) {
      const d = g.createContext(f), m = r.length;
      r = [
        ...r,
        f
      ];
      const p = (b) => {
        var _a;
        const { scope: S, children: E, ...k } = b, w = ((_a = S == null ? void 0 : S[l]) == null ? void 0 : _a[m]) || d, C = g.useMemo(() => k, Object.values(k));
        return y.jsx(w.Provider, {
          value: C,
          children: E
        });
      };
      p.displayName = c + "Provider";
      function v(b, S) {
        var _a;
        const E = ((_a = S == null ? void 0 : S[l]) == null ? void 0 : _a[m]) || d, k = g.useContext(E);
        if (k) return k;
        if (f !== void 0) return f;
        throw new Error(`\`${b}\` must be used within \`${c}\``);
      }
      return [
        p,
        v
      ];
    }
    const s = () => {
      const c = r.map((f) => g.createContext(f));
      return function(d) {
        const m = (d == null ? void 0 : d[l]) || c;
        return g.useMemo(() => ({
          [`__scope${l}`]: {
            ...d,
            [l]: m
          }
        }), [
          d,
          m
        ]);
      };
    };
    return s.scopeName = l, [
      o,
      fC(s, ...n)
    ];
  }
  function fC(...l) {
    const n = l[0];
    if (l.length === 1) return n;
    const r = () => {
      const o = l.map((s) => ({
        useScope: s(),
        scopeName: s.scopeName
      }));
      return function(c) {
        const f = o.reduce((d, { useScope: m, scopeName: p }) => {
          const b = m(c)[`__scope${p}`];
          return {
            ...d,
            ...b
          };
        }, {});
        return g.useMemo(() => ({
          [`__scope${n.scopeName}`]: f
        }), [
          f
        ]);
      };
    };
    return r.scopeName = n.scopeName, r;
  }
  var Fo = (globalThis == null ? void 0 : globalThis.document) ? g.useLayoutEffect : () => {
  }, hC = Qf[" useId ".trim().toString()] || (() => {
  }), mC = 0;
  function Ll(l) {
    const [n, r] = g.useState(hC());
    return Fo(() => {
      r((o) => o ?? String(mC++));
    }, [
      l
    ]), n ? `radix-${n}` : "";
  }
  var gC = Qf[" useInsertionEffect ".trim().toString()] || Fo;
  function pC({ prop: l, defaultProp: n, onChange: r = () => {
  }, caller: o }) {
    const [s, c, f] = yC({
      defaultProp: n,
      onChange: r
    }), d = l !== void 0, m = d ? l : s;
    {
      const v = g.useRef(l !== void 0);
      g.useEffect(() => {
        const b = v.current;
        b !== d && console.warn(`${o} is changing from ${b ? "controlled" : "uncontrolled"} to ${d ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`), v.current = d;
      }, [
        d,
        o
      ]);
    }
    const p = g.useCallback((v) => {
      var _a;
      if (d) {
        const b = bC(v) ? v(l) : v;
        b !== l && ((_a = f.current) == null ? void 0 : _a.call(f, b));
      } else c(v);
    }, [
      d,
      l,
      c,
      f
    ]);
    return [
      m,
      p
    ];
  }
  function yC({ defaultProp: l, onChange: n }) {
    const [r, o] = g.useState(l), s = g.useRef(r), c = g.useRef(n);
    return gC(() => {
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
  function bC(l) {
    return typeof l == "function";
  }
  var li = $v();
  const vC = Vv(li);
  function ri(l) {
    const n = xC(l), r = g.forwardRef((o, s) => {
      const { children: c, ...f } = o, d = g.Children.toArray(c), m = d.find(SC);
      if (m) {
        const p = m.props.children, v = d.map((b) => b === m ? g.Children.count(p) > 1 ? g.Children.only(null) : g.isValidElement(p) ? p.props.children : null : b);
        return y.jsx(n, {
          ...f,
          ref: s,
          children: g.isValidElement(p) ? g.cloneElement(p, void 0, v) : null
        });
      }
      return y.jsx(n, {
        ...f,
        ref: s,
        children: c
      });
    });
    return r.displayName = `${l}.Slot`, r;
  }
  function xC(l) {
    const n = g.forwardRef((r, o) => {
      const { children: s, ...c } = r;
      if (g.isValidElement(s)) {
        const f = EC(s), d = CC(c, s.props);
        return s.type !== g.Fragment && (d.ref = o ? fr(o, f) : f), g.cloneElement(s, d);
      }
      return g.Children.count(s) > 1 ? g.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var wC = Symbol("radix.slottable");
  function SC(l) {
    return g.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === wC;
  }
  function CC(l, n) {
    const r = {
      ...n
    };
    for (const o in n) {
      const s = l[o], c = n[o];
      /^on[A-Z]/.test(o) ? s && c ? r[o] = (...d) => {
        const m = c(...d);
        return s(...d), m;
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
  function EC(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, r = n && "isReactWarning" in n && n.isReactWarning;
    return r ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, r = n && "isReactWarning" in n && n.isReactWarning, r ? l.props.ref : l.props.ref || l.ref);
  }
  var _C = [
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
  ], Y0 = _C.reduce((l, n) => {
    const r = ri(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: f, ...d } = s, m = f ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...d,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {});
  function kC(l, n) {
    l && li.flushSync(() => l.dispatchEvent(n));
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
  function MC(l, n = globalThis == null ? void 0 : globalThis.document) {
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
  var jC = "DismissableLayer", $f = "dismissableLayer.update", LC = "dismissableLayer.pointerDownOutside", RC = "dismissableLayer.focusOutside", ob, B0 = g.createContext({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  }), X0 = g.forwardRef((l, n) => {
    const { disableOutsidePointerEvents: r = false, onEscapeKeyDown: o, onPointerDownOutside: s, onFocusOutside: c, onInteractOutside: f, onDismiss: d, ...m } = l, p = g.useContext(B0), [v, b] = g.useState(null), S = (v == null ? void 0 : v.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, E] = g.useState({}), k = Vr(n, (R) => b(R)), w = Array.from(p.layers), [C] = [
      ...p.layersWithOutsidePointerEventsDisabled
    ].slice(-1), _ = w.indexOf(C), T = v ? w.indexOf(v) : -1, A = p.layersWithOutsidePointerEventsDisabled.size > 0, j = T >= _, U = NC((R) => {
      const O = R.target, H = [
        ...p.branches
      ].some((G) => G.contains(O));
      !j || H || (s == null ? void 0 : s(R), f == null ? void 0 : f(R), R.defaultPrevented || (d == null ? void 0 : d()));
    }, S), N = OC((R) => {
      const O = R.target;
      [
        ...p.branches
      ].some((G) => G.contains(O)) || (c == null ? void 0 : c(R), f == null ? void 0 : f(R), R.defaultPrevented || (d == null ? void 0 : d()));
    }, S);
    return MC((R) => {
      T === p.layers.size - 1 && (o == null ? void 0 : o(R), !R.defaultPrevented && d && (R.preventDefault(), d()));
    }, S), g.useEffect(() => {
      if (v) return r && (p.layersWithOutsidePointerEventsDisabled.size === 0 && (ob = S.body.style.pointerEvents, S.body.style.pointerEvents = "none"), p.layersWithOutsidePointerEventsDisabled.add(v)), p.layers.add(v), ib(), () => {
        r && p.layersWithOutsidePointerEventsDisabled.size === 1 && (S.body.style.pointerEvents = ob);
      };
    }, [
      v,
      S,
      r,
      p
    ]), g.useEffect(() => () => {
      v && (p.layers.delete(v), p.layersWithOutsidePointerEventsDisabled.delete(v), ib());
    }, [
      v,
      p
    ]), g.useEffect(() => {
      const R = () => E({});
      return document.addEventListener($f, R), () => document.removeEventListener($f, R);
    }, []), y.jsx(Y0.div, {
      ...m,
      ref: k,
      style: {
        pointerEvents: A ? j ? "auto" : "none" : void 0,
        ...l.style
      },
      onFocusCapture: cr(l.onFocusCapture, N.onFocusCapture),
      onBlurCapture: cr(l.onBlurCapture, N.onBlurCapture),
      onPointerDownCapture: cr(l.onPointerDownCapture, U.onPointerDownCapture)
    });
  });
  X0.displayName = jC;
  var AC = "DismissableLayerBranch", TC = g.forwardRef((l, n) => {
    const r = g.useContext(B0), o = g.useRef(null), s = Vr(n, o);
    return g.useEffect(() => {
      const c = o.current;
      if (c) return r.branches.add(c), () => {
        r.branches.delete(c);
      };
    }, [
      r.branches
    ]), y.jsx(Y0.div, {
      ...l,
      ref: s
    });
  });
  TC.displayName = AC;
  function NC(l, n = globalThis == null ? void 0 : globalThis.document) {
    const r = Qo(l), o = g.useRef(false), s = g.useRef(() => {
    });
    return g.useEffect(() => {
      const c = (d) => {
        if (d.target && !o.current) {
          let m = function() {
            V0(LC, r, p, {
              discrete: true
            });
          };
          const p = {
            originalEvent: d
          };
          d.pointerType === "touch" ? (n.removeEventListener("click", s.current), s.current = m, n.addEventListener("click", s.current, {
            once: true
          })) : m();
        } else n.removeEventListener("click", s.current);
        o.current = false;
      }, f = window.setTimeout(() => {
        n.addEventListener("pointerdown", c);
      }, 0);
      return () => {
        window.clearTimeout(f), n.removeEventListener("pointerdown", c), n.removeEventListener("click", s.current);
      };
    }, [
      n,
      r
    ]), {
      onPointerDownCapture: () => o.current = true
    };
  }
  function OC(l, n = globalThis == null ? void 0 : globalThis.document) {
    const r = Qo(l), o = g.useRef(false);
    return g.useEffect(() => {
      const s = (c) => {
        c.target && !o.current && V0(RC, r, {
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
  function ib() {
    const l = new CustomEvent($f);
    document.dispatchEvent(l);
  }
  function V0(l, n, r, { discrete: o }) {
    const s = r.originalEvent.target, c = new CustomEvent(l, {
      bubbles: false,
      cancelable: true,
      detail: r
    });
    n && s.addEventListener(l, n, {
      once: true
    }), o ? kC(s, c) : s.dispatchEvent(c);
  }
  var DC = [
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
  ], IC = DC.reduce((l, n) => {
    const r = ri(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: f, ...d } = s, m = f ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...d,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), Xd = "focusScope.autoFocusOnMount", Vd = "focusScope.autoFocusOnUnmount", sb = {
    bubbles: false,
    cancelable: true
  }, zC = "FocusScope", $0 = g.forwardRef((l, n) => {
    const { loop: r = false, trapped: o = false, onMountAutoFocus: s, onUnmountAutoFocus: c, ...f } = l, [d, m] = g.useState(null), p = Qo(s), v = Qo(c), b = g.useRef(null), S = Vr(n, (w) => m(w)), E = g.useRef({
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
        let w = function(A) {
          if (E.paused || !d) return;
          const j = A.target;
          d.contains(j) ? b.current = j : sr(b.current, {
            select: true
          });
        }, C = function(A) {
          if (E.paused || !d) return;
          const j = A.relatedTarget;
          j !== null && (d.contains(j) || sr(b.current, {
            select: true
          }));
        }, _ = function(A) {
          if (document.activeElement === document.body) for (const U of A) U.removedNodes.length > 0 && sr(d);
        };
        document.addEventListener("focusin", w), document.addEventListener("focusout", C);
        const T = new MutationObserver(_);
        return d && T.observe(d, {
          childList: true,
          subtree: true
        }), () => {
          document.removeEventListener("focusin", w), document.removeEventListener("focusout", C), T.disconnect();
        };
      }
    }, [
      o,
      d,
      E.paused
    ]), g.useEffect(() => {
      if (d) {
        ub.add(E);
        const w = document.activeElement;
        if (!d.contains(w)) {
          const _ = new CustomEvent(Xd, sb);
          d.addEventListener(Xd, p), d.dispatchEvent(_), _.defaultPrevented || (HC(VC(q0(d)), {
            select: true
          }), document.activeElement === w && sr(d));
        }
        return () => {
          d.removeEventListener(Xd, p), setTimeout(() => {
            const _ = new CustomEvent(Vd, sb);
            d.addEventListener(Vd, v), d.dispatchEvent(_), _.defaultPrevented || sr(w ?? document.body, {
              select: true
            }), d.removeEventListener(Vd, v), ub.remove(E);
          }, 0);
        };
      }
    }, [
      d,
      p,
      v,
      E
    ]);
    const k = g.useCallback((w) => {
      if (!r && !o || E.paused) return;
      const C = w.key === "Tab" && !w.altKey && !w.ctrlKey && !w.metaKey, _ = document.activeElement;
      if (C && _) {
        const T = w.currentTarget, [A, j] = UC(T);
        A && j ? !w.shiftKey && _ === j ? (w.preventDefault(), r && sr(A, {
          select: true
        })) : w.shiftKey && _ === A && (w.preventDefault(), r && sr(j, {
          select: true
        })) : _ === T && w.preventDefault();
      }
    }, [
      r,
      o,
      E.paused
    ]);
    return y.jsx(IC.div, {
      tabIndex: -1,
      ...f,
      ref: S,
      onKeyDown: k
    });
  });
  $0.displayName = zC;
  function HC(l, { select: n = false } = {}) {
    const r = document.activeElement;
    for (const o of l) if (sr(o, {
      select: n
    }), document.activeElement !== r) return;
  }
  function UC(l) {
    const n = q0(l), r = cb(n, l), o = cb(n.reverse(), l);
    return [
      r,
      o
    ];
  }
  function q0(l) {
    const n = [], r = document.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (o) => {
        const s = o.tagName === "INPUT" && o.type === "hidden";
        return o.disabled || o.hidden || s ? NodeFilter.FILTER_SKIP : o.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    for (; r.nextNode(); ) n.push(r.currentNode);
    return n;
  }
  function cb(l, n) {
    for (const r of l) if (!YC(r, {
      upTo: n
    })) return r;
  }
  function YC(l, { upTo: n }) {
    if (getComputedStyle(l).visibility === "hidden") return true;
    for (; l; ) {
      if (n !== void 0 && l === n) return false;
      if (getComputedStyle(l).display === "none") return true;
      l = l.parentElement;
    }
    return false;
  }
  function BC(l) {
    return l instanceof HTMLInputElement && "select" in l;
  }
  function sr(l, { select: n = false } = {}) {
    if (l && l.focus) {
      const r = document.activeElement;
      l.focus({
        preventScroll: true
      }), l !== r && BC(l) && n && l.select();
    }
  }
  var ub = XC();
  function XC() {
    let l = [];
    return {
      add(n) {
        const r = l[0];
        n !== r && (r == null ? void 0 : r.pause()), l = db(l, n), l.unshift(n);
      },
      remove(n) {
        var _a;
        l = db(l, n), (_a = l[0]) == null ? void 0 : _a.resume();
      }
    };
  }
  function db(l, n) {
    const r = [
      ...l
    ], o = r.indexOf(n);
    return o !== -1 && r.splice(o, 1), r;
  }
  function VC(l) {
    return l.filter((n) => n.tagName !== "A");
  }
  var $C = [
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
  ], qC = $C.reduce((l, n) => {
    const r = ri(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: f, ...d } = s, m = f ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...d,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), GC = "Portal", G0 = g.forwardRef((l, n) => {
    var _a;
    const { container: r, ...o } = l, [s, c] = g.useState(false);
    Fo(() => c(true), []);
    const f = r || s && ((_a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _a.body);
    return f ? vC.createPortal(y.jsx(qC.div, {
      ...o,
      ref: n
    }), f) : null;
  });
  G0.displayName = GC;
  function PC(l, n) {
    return g.useReducer((r, o) => n[r][o] ?? r, l);
  }
  var dc = (l) => {
    const { present: n, children: r } = l, o = KC(n), s = typeof r == "function" ? r({
      present: o.isPresent
    }) : g.Children.only(r), c = Vr(o.ref, ZC(s));
    return typeof r == "function" || o.isPresent ? g.cloneElement(s, {
      ref: c
    }) : null;
  };
  dc.displayName = "Presence";
  function KC(l) {
    const [n, r] = g.useState(), o = g.useRef(null), s = g.useRef(l), c = g.useRef("none"), f = l ? "mounted" : "unmounted", [d, m] = PC(f, {
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
      const p = Ds(o.current);
      c.current = d === "mounted" ? p : "none";
    }, [
      d
    ]), Fo(() => {
      const p = o.current, v = s.current;
      if (v !== l) {
        const S = c.current, E = Ds(p);
        l ? m("MOUNT") : E === "none" || (p == null ? void 0 : p.display) === "none" ? m("UNMOUNT") : m(v && S !== E ? "ANIMATION_OUT" : "UNMOUNT"), s.current = l;
      }
    }, [
      l,
      m
    ]), Fo(() => {
      if (n) {
        let p;
        const v = n.ownerDocument.defaultView ?? window, b = (E) => {
          const w = Ds(o.current).includes(CSS.escape(E.animationName));
          if (E.target === n && w && (m("ANIMATION_END"), !s.current)) {
            const C = n.style.animationFillMode;
            n.style.animationFillMode = "forwards", p = v.setTimeout(() => {
              n.style.animationFillMode === "forwards" && (n.style.animationFillMode = C);
            });
          }
        }, S = (E) => {
          E.target === n && (c.current = Ds(o.current));
        };
        return n.addEventListener("animationstart", S), n.addEventListener("animationcancel", b), n.addEventListener("animationend", b), () => {
          v.clearTimeout(p), n.removeEventListener("animationstart", S), n.removeEventListener("animationcancel", b), n.removeEventListener("animationend", b);
        };
      } else m("ANIMATION_END");
    }, [
      n,
      m
    ]), {
      isPresent: [
        "mounted",
        "unmountSuspended"
      ].includes(d),
      ref: g.useCallback((p) => {
        o.current = p ? getComputedStyle(p) : null, r(p);
      }, [])
    };
  }
  function Ds(l) {
    return (l == null ? void 0 : l.animationName) || "none";
  }
  function ZC(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, r = n && "isReactWarning" in n && n.isReactWarning;
    return r ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, r = n && "isReactWarning" in n && n.isReactWarning, r ? l.props.ref : l.props.ref || l.ref);
  }
  var FC = [
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
  ], ai = FC.reduce((l, n) => {
    const r = ri(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: f, ...d } = s, m = f ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...d,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), $d = 0;
  function QC() {
    g.useEffect(() => {
      const l = document.querySelectorAll("[data-radix-focus-guard]");
      return document.body.insertAdjacentElement("afterbegin", l[0] ?? fb()), document.body.insertAdjacentElement("beforeend", l[1] ?? fb()), $d++, () => {
        $d === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((n) => n.remove()), $d--;
      };
    }, []);
  }
  function fb() {
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
  function P0(l, n) {
    var r = {};
    for (var o in l) Object.prototype.hasOwnProperty.call(l, o) && n.indexOf(o) < 0 && (r[o] = l[o]);
    if (l != null && typeof Object.getOwnPropertySymbols == "function") for (var s = 0, o = Object.getOwnPropertySymbols(l); s < o.length; s++) n.indexOf(o[s]) < 0 && Object.prototype.propertyIsEnumerable.call(l, o[s]) && (r[o[s]] = l[o[s]]);
    return r;
  }
  function WC(l, n, r) {
    if (r || arguments.length === 2) for (var o = 0, s = n.length, c; o < s; o++) (c || !(o in n)) && (c || (c = Array.prototype.slice.call(n, 0, o)), c[o] = n[o]);
    return l.concat(c || Array.prototype.slice.call(n));
  }
  var Zs = "right-scroll-bar-position", Fs = "width-before-scroll-bar", JC = "with-scroll-bars-hidden", eE = "--removed-body-scroll-bar-size";
  function qd(l, n) {
    return typeof l == "function" ? l(n) : l && (l.current = n), l;
  }
  function tE(l, n) {
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
  var nE = typeof window < "u" ? g.useLayoutEffect : g.useEffect, hb = /* @__PURE__ */ new WeakMap();
  function lE(l, n) {
    var r = tE(null, function(o) {
      return l.forEach(function(s) {
        return qd(s, o);
      });
    });
    return nE(function() {
      var o = hb.get(r);
      if (o) {
        var s = new Set(o), c = new Set(l), f = r.current;
        s.forEach(function(d) {
          c.has(d) || qd(d, null);
        }), c.forEach(function(d) {
          s.has(d) || qd(d, f);
        });
      }
      hb.set(r, l);
    }, [
      l
    ]), r;
  }
  function rE(l) {
    return l;
  }
  function aE(l, n) {
    n === void 0 && (n = rE);
    var r = [], o = false, s = {
      read: function() {
        if (o) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        return r.length ? r[r.length - 1] : l;
      },
      useMedium: function(c) {
        var f = n(c, o);
        return r.push(f), function() {
          r = r.filter(function(d) {
            return d !== f;
          });
        };
      },
      assignSyncMedium: function(c) {
        for (o = true; r.length; ) {
          var f = r;
          r = [], f.forEach(c);
        }
        r = {
          push: function(d) {
            return c(d);
          },
          filter: function() {
            return r;
          }
        };
      },
      assignMedium: function(c) {
        o = true;
        var f = [];
        if (r.length) {
          var d = r;
          r = [], d.forEach(c), f = r;
        }
        var m = function() {
          var v = f;
          f = [], v.forEach(c);
        }, p = function() {
          return Promise.resolve().then(m);
        };
        p(), r = {
          push: function(v) {
            f.push(v), p();
          },
          filter: function(v) {
            return f = f.filter(v), r;
          }
        };
      }
    };
    return s;
  }
  function oE(l) {
    l === void 0 && (l = {});
    var n = aE(null);
    return n.options = rl({
      async: true,
      ssr: false
    }, l), n;
  }
  var K0 = function(l) {
    var n = l.sideCar, r = P0(l, [
      "sideCar"
    ]);
    if (!n) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    var o = n.read();
    if (!o) throw new Error("Sidecar medium not found");
    return g.createElement(o, rl({}, r));
  };
  K0.isSideCarExport = true;
  function iE(l, n) {
    return l.useMedium(n), K0;
  }
  var Z0 = oE(), Gd = function() {
  }, fc = g.forwardRef(function(l, n) {
    var r = g.useRef(null), o = g.useState({
      onScrollCapture: Gd,
      onWheelCapture: Gd,
      onTouchMoveCapture: Gd
    }), s = o[0], c = o[1], f = l.forwardProps, d = l.children, m = l.className, p = l.removeScrollBar, v = l.enabled, b = l.shards, S = l.sideCar, E = l.noRelative, k = l.noIsolation, w = l.inert, C = l.allowPinchZoom, _ = l.as, T = _ === void 0 ? "div" : _, A = l.gapMode, j = P0(l, [
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
    ]), U = S, N = lE([
      r,
      n
    ]), R = rl(rl({}, j), s);
    return g.createElement(g.Fragment, null, v && g.createElement(U, {
      sideCar: Z0,
      removeScrollBar: p,
      shards: b,
      noRelative: E,
      noIsolation: k,
      inert: w,
      setCallbacks: c,
      allowPinchZoom: !!C,
      lockRef: r,
      gapMode: A
    }), f ? g.cloneElement(g.Children.only(d), rl(rl({}, R), {
      ref: N
    })) : g.createElement(T, rl({}, R, {
      className: m,
      ref: N
    }), d));
  });
  fc.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  fc.classNames = {
    fullWidth: Fs,
    zeroRight: Zs
  };
  var sE = function() {
    if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
  };
  function cE() {
    if (!document) return null;
    var l = document.createElement("style");
    l.type = "text/css";
    var n = sE();
    return n && l.setAttribute("nonce", n), l;
  }
  function uE(l, n) {
    l.styleSheet ? l.styleSheet.cssText = n : l.appendChild(document.createTextNode(n));
  }
  function dE(l) {
    var n = document.head || document.getElementsByTagName("head")[0];
    n.appendChild(l);
  }
  var fE = function() {
    var l = 0, n = null;
    return {
      add: function(r) {
        l == 0 && (n = cE()) && (uE(n, r), dE(n)), l++;
      },
      remove: function() {
        l--, !l && n && (n.parentNode && n.parentNode.removeChild(n), n = null);
      }
    };
  }, hE = function() {
    var l = fE();
    return function(n, r) {
      g.useEffect(function() {
        return l.add(n), function() {
          l.remove();
        };
      }, [
        n && r
      ]);
    };
  }, F0 = function() {
    var l = hE(), n = function(r) {
      var o = r.styles, s = r.dynamic;
      return l(o, s), null;
    };
    return n;
  }, mE = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  }, Pd = function(l) {
    return parseInt(l || "", 10) || 0;
  }, gE = function(l) {
    var n = window.getComputedStyle(document.body), r = n[l === "padding" ? "paddingLeft" : "marginLeft"], o = n[l === "padding" ? "paddingTop" : "marginTop"], s = n[l === "padding" ? "paddingRight" : "marginRight"];
    return [
      Pd(r),
      Pd(o),
      Pd(s)
    ];
  }, pE = function(l) {
    if (l === void 0 && (l = "margin"), typeof window > "u") return mE;
    var n = gE(l), r = document.documentElement.clientWidth, o = window.innerWidth;
    return {
      left: n[0],
      top: n[1],
      right: n[2],
      gap: Math.max(0, o - r + n[2] - n[0])
    };
  }, yE = F0(), Ha = "data-scroll-locked", bE = function(l, n, r, o) {
    var s = l.left, c = l.top, f = l.right, d = l.gap;
    return r === void 0 && (r = "margin"), `
  .`.concat(JC, ` {
   overflow: hidden `).concat(o, `;
   padding-right: `).concat(d, "px ").concat(o, `;
  }
  body[`).concat(Ha, `] {
    overflow: hidden `).concat(o, `;
    overscroll-behavior: contain;
    `).concat([
      n && "position: relative ".concat(o, ";"),
      r === "margin" && `
    padding-left: `.concat(s, `px;
    padding-top: `).concat(c, `px;
    padding-right: `).concat(f, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(d, "px ").concat(o, `;
    `),
      r === "padding" && "padding-right: ".concat(d, "px ").concat(o, ";")
    ].filter(Boolean).join(""), `
  }
  
  .`).concat(Zs, ` {
    right: `).concat(d, "px ").concat(o, `;
  }
  
  .`).concat(Fs, ` {
    margin-right: `).concat(d, "px ").concat(o, `;
  }
  
  .`).concat(Zs, " .").concat(Zs, ` {
    right: 0 `).concat(o, `;
  }
  
  .`).concat(Fs, " .").concat(Fs, ` {
    margin-right: 0 `).concat(o, `;
  }
  
  body[`).concat(Ha, `] {
    `).concat(eE, ": ").concat(d, `px;
  }
`);
  }, mb = function() {
    var l = parseInt(document.body.getAttribute(Ha) || "0", 10);
    return isFinite(l) ? l : 0;
  }, vE = function() {
    g.useEffect(function() {
      return document.body.setAttribute(Ha, (mb() + 1).toString()), function() {
        var l = mb() - 1;
        l <= 0 ? document.body.removeAttribute(Ha) : document.body.setAttribute(Ha, l.toString());
      };
    }, []);
  }, xE = function(l) {
    var n = l.noRelative, r = l.noImportant, o = l.gapMode, s = o === void 0 ? "margin" : o;
    vE();
    var c = g.useMemo(function() {
      return pE(s);
    }, [
      s
    ]);
    return g.createElement(yE, {
      styles: bE(c, !n, s, r ? "" : "!important")
    });
  }, qf = false;
  if (typeof window < "u") try {
    var Is = Object.defineProperty({}, "passive", {
      get: function() {
        return qf = true, true;
      }
    });
    window.addEventListener("test", Is, Is), window.removeEventListener("test", Is, Is);
  } catch {
    qf = false;
  }
  var Ra = qf ? {
    passive: false
  } : false, wE = function(l) {
    return l.tagName === "TEXTAREA";
  }, Q0 = function(l, n) {
    if (!(l instanceof Element)) return false;
    var r = window.getComputedStyle(l);
    return r[n] !== "hidden" && !(r.overflowY === r.overflowX && !wE(l) && r[n] === "visible");
  }, SE = function(l) {
    return Q0(l, "overflowY");
  }, CE = function(l) {
    return Q0(l, "overflowX");
  }, gb = function(l, n) {
    var r = n.ownerDocument, o = n;
    do {
      typeof ShadowRoot < "u" && o instanceof ShadowRoot && (o = o.host);
      var s = W0(l, o);
      if (s) {
        var c = J0(l, o), f = c[1], d = c[2];
        if (f > d) return true;
      }
      o = o.parentNode;
    } while (o && o !== r.body);
    return false;
  }, EE = function(l) {
    var n = l.scrollTop, r = l.scrollHeight, o = l.clientHeight;
    return [
      n,
      r,
      o
    ];
  }, _E = function(l) {
    var n = l.scrollLeft, r = l.scrollWidth, o = l.clientWidth;
    return [
      n,
      r,
      o
    ];
  }, W0 = function(l, n) {
    return l === "v" ? SE(n) : CE(n);
  }, J0 = function(l, n) {
    return l === "v" ? EE(n) : _E(n);
  }, kE = function(l, n) {
    return l === "h" && n === "rtl" ? -1 : 1;
  }, ME = function(l, n, r, o, s) {
    var c = kE(l, window.getComputedStyle(n).direction), f = c * o, d = r.target, m = n.contains(d), p = false, v = f > 0, b = 0, S = 0;
    do {
      if (!d) break;
      var E = J0(l, d), k = E[0], w = E[1], C = E[2], _ = w - C - c * k;
      (k || _) && W0(l, d) && (b += _, S += k);
      var T = d.parentNode;
      d = T && T.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? T.host : T;
    } while (!m && d !== document.body || m && (n.contains(d) || n === d));
    return (v && Math.abs(b) < 1 || !v && Math.abs(S) < 1) && (p = true), p;
  }, zs = function(l) {
    return "changedTouches" in l ? [
      l.changedTouches[0].clientX,
      l.changedTouches[0].clientY
    ] : [
      0,
      0
    ];
  }, pb = function(l) {
    return [
      l.deltaX,
      l.deltaY
    ];
  }, yb = function(l) {
    return l && "current" in l ? l.current : l;
  }, jE = function(l, n) {
    return l[0] === n[0] && l[1] === n[1];
  }, LE = function(l) {
    return `
  .block-interactivity-`.concat(l, ` {pointer-events: none;}
  .allow-interactivity-`).concat(l, ` {pointer-events: all;}
`);
  }, RE = 0, Aa = [];
  function AE(l) {
    var n = g.useRef([]), r = g.useRef([
      0,
      0
    ]), o = g.useRef(), s = g.useState(RE++)[0], c = g.useState(F0)[0], f = g.useRef(l);
    g.useEffect(function() {
      f.current = l;
    }, [
      l
    ]), g.useEffect(function() {
      if (l.inert) {
        document.body.classList.add("block-interactivity-".concat(s));
        var w = WC([
          l.lockRef.current
        ], (l.shards || []).map(yb), true).filter(Boolean);
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
    var d = g.useCallback(function(w, C) {
      if ("touches" in w && w.touches.length === 2 || w.type === "wheel" && w.ctrlKey) return !f.current.allowPinchZoom;
      var _ = zs(w), T = r.current, A = "deltaX" in w ? w.deltaX : T[0] - _[0], j = "deltaY" in w ? w.deltaY : T[1] - _[1], U, N = w.target, R = Math.abs(A) > Math.abs(j) ? "h" : "v";
      if ("touches" in w && R === "h" && N.type === "range") return false;
      var O = window.getSelection(), H = O && O.anchorNode, G = H ? H === N || H.contains(N) : false;
      if (G) return false;
      var te = gb(R, N);
      if (!te) return true;
      if (te ? U = R : (U = R === "v" ? "h" : "v", te = gb(R, N)), !te) return false;
      if (!o.current && "changedTouches" in w && (A || j) && (o.current = U), !U) return true;
      var ee = o.current || U;
      return ME(ee, C, w, ee === "h" ? A : j);
    }, []), m = g.useCallback(function(w) {
      var C = w;
      if (!(!Aa.length || Aa[Aa.length - 1] !== c)) {
        var _ = "deltaY" in C ? pb(C) : zs(C), T = n.current.filter(function(U) {
          return U.name === C.type && (U.target === C.target || C.target === U.shadowParent) && jE(U.delta, _);
        })[0];
        if (T && T.should) {
          C.cancelable && C.preventDefault();
          return;
        }
        if (!T) {
          var A = (f.current.shards || []).map(yb).filter(Boolean).filter(function(U) {
            return U.contains(C.target);
          }), j = A.length > 0 ? d(C, A[0]) : !f.current.noIsolation;
          j && C.cancelable && C.preventDefault();
        }
      }
    }, []), p = g.useCallback(function(w, C, _, T) {
      var A = {
        name: w,
        delta: C,
        target: _,
        should: T,
        shadowParent: TE(_)
      };
      n.current.push(A), setTimeout(function() {
        n.current = n.current.filter(function(j) {
          return j !== A;
        });
      }, 1);
    }, []), v = g.useCallback(function(w) {
      r.current = zs(w), o.current = void 0;
    }, []), b = g.useCallback(function(w) {
      p(w.type, pb(w), w.target, d(w, l.lockRef.current));
    }, []), S = g.useCallback(function(w) {
      p(w.type, zs(w), w.target, d(w, l.lockRef.current));
    }, []);
    g.useEffect(function() {
      return Aa.push(c), l.setCallbacks({
        onScrollCapture: b,
        onWheelCapture: b,
        onTouchMoveCapture: S
      }), document.addEventListener("wheel", m, Ra), document.addEventListener("touchmove", m, Ra), document.addEventListener("touchstart", v, Ra), function() {
        Aa = Aa.filter(function(w) {
          return w !== c;
        }), document.removeEventListener("wheel", m, Ra), document.removeEventListener("touchmove", m, Ra), document.removeEventListener("touchstart", v, Ra);
      };
    }, []);
    var E = l.removeScrollBar, k = l.inert;
    return g.createElement(g.Fragment, null, k ? g.createElement(c, {
      styles: LE(s)
    }) : null, E ? g.createElement(xE, {
      noRelative: l.noRelative,
      gapMode: l.gapMode
    }) : null);
  }
  function TE(l) {
    for (var n = null; l !== null; ) l instanceof ShadowRoot && (n = l.host, l = l.host), l = l.parentNode;
    return n;
  }
  const NE = iE(Z0, AE);
  var e1 = g.forwardRef(function(l, n) {
    return g.createElement(fc, rl({}, l, {
      ref: n,
      sideCar: NE
    }));
  });
  e1.classNames = fc.classNames;
  var OE = function(l) {
    if (typeof document > "u") return null;
    var n = Array.isArray(l) ? l[0] : l;
    return n.ownerDocument.body;
  }, Ta = /* @__PURE__ */ new WeakMap(), Hs = /* @__PURE__ */ new WeakMap(), Us = {}, Kd = 0, t1 = function(l) {
    return l && (l.host || t1(l.parentNode));
  }, DE = function(l, n) {
    return n.map(function(r) {
      if (l.contains(r)) return r;
      var o = t1(r);
      return o && l.contains(o) ? o : (console.error("aria-hidden", r, "in not contained inside", l, ". Doing nothing"), null);
    }).filter(function(r) {
      return !!r;
    });
  }, IE = function(l, n, r, o) {
    var s = DE(n, Array.isArray(l) ? l : [
      l
    ]);
    Us[r] || (Us[r] = /* @__PURE__ */ new WeakMap());
    var c = Us[r], f = [], d = /* @__PURE__ */ new Set(), m = new Set(s), p = function(b) {
      !b || d.has(b) || (d.add(b), p(b.parentNode));
    };
    s.forEach(p);
    var v = function(b) {
      !b || m.has(b) || Array.prototype.forEach.call(b.children, function(S) {
        if (d.has(S)) v(S);
        else try {
          var E = S.getAttribute(o), k = E !== null && E !== "false", w = (Ta.get(S) || 0) + 1, C = (c.get(S) || 0) + 1;
          Ta.set(S, w), c.set(S, C), f.push(S), w === 1 && k && Hs.set(S, true), C === 1 && S.setAttribute(r, "true"), k || S.setAttribute(o, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", S, _);
        }
      });
    };
    return v(n), d.clear(), Kd++, function() {
      f.forEach(function(b) {
        var S = Ta.get(b) - 1, E = c.get(b) - 1;
        Ta.set(b, S), c.set(b, E), S || (Hs.has(b) || b.removeAttribute(o), Hs.delete(b)), E || b.removeAttribute(r);
      }), Kd--, Kd || (Ta = /* @__PURE__ */ new WeakMap(), Ta = /* @__PURE__ */ new WeakMap(), Hs = /* @__PURE__ */ new WeakMap(), Us = {});
    };
  }, zE = function(l, n, r) {
    r === void 0 && (r = "data-aria-hidden");
    var o = Array.from(Array.isArray(l) ? l : [
      l
    ]), s = OE(l);
    return s ? (o.push.apply(o, Array.from(s.querySelectorAll("[aria-live], script"))), IE(o, s, r, "aria-hidden")) : function() {
      return null;
    };
  }, hc = "Dialog", [n1] = dC(hc), [HE, Gn] = n1(hc), l1 = (l) => {
    const { __scopeDialog: n, children: r, open: o, defaultOpen: s, onOpenChange: c, modal: f = true } = l, d = g.useRef(null), m = g.useRef(null), [p, v] = pC({
      prop: o,
      defaultProp: s ?? false,
      onChange: c,
      caller: hc
    });
    return y.jsx(HE, {
      scope: n,
      triggerRef: d,
      contentRef: m,
      contentId: Ll(),
      titleId: Ll(),
      descriptionId: Ll(),
      open: p,
      onOpenChange: v,
      onOpenToggle: g.useCallback(() => v((b) => !b), [
        v
      ]),
      modal: f,
      children: r
    });
  };
  l1.displayName = hc;
  var r1 = "DialogTrigger", UE = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(r1, r), c = Vr(n, s.triggerRef);
    return y.jsx(ai.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": s.open,
      "aria-controls": s.contentId,
      "data-state": dh(s.open),
      ...o,
      ref: c,
      onClick: cr(l.onClick, s.onOpenToggle)
    });
  });
  UE.displayName = r1;
  var ch = "DialogPortal", [YE, a1] = n1(ch, {
    forceMount: void 0
  }), o1 = (l) => {
    const { __scopeDialog: n, forceMount: r, children: o, container: s } = l, c = Gn(ch, n);
    return y.jsx(YE, {
      scope: n,
      forceMount: r,
      children: g.Children.map(o, (f) => y.jsx(dc, {
        present: r || c.open,
        children: y.jsx(G0, {
          asChild: true,
          container: s,
          children: f
        })
      }))
    });
  };
  o1.displayName = ch;
  var ec = "DialogOverlay", i1 = g.forwardRef((l, n) => {
    const r = a1(ec, l.__scopeDialog), { forceMount: o = r.forceMount, ...s } = l, c = Gn(ec, l.__scopeDialog);
    return c.modal ? y.jsx(dc, {
      present: o || c.open,
      children: y.jsx(XE, {
        ...s,
        ref: n
      })
    }) : null;
  });
  i1.displayName = ec;
  var BE = ri("DialogOverlay.RemoveScroll"), XE = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(ec, r);
    return y.jsx(e1, {
      as: BE,
      allowPinchZoom: true,
      shards: [
        s.contentRef
      ],
      children: y.jsx(ai.div, {
        "data-state": dh(s.open),
        ...o,
        ref: n,
        style: {
          pointerEvents: "auto",
          ...o.style
        }
      })
    });
  }), Br = "DialogContent", s1 = g.forwardRef((l, n) => {
    const r = a1(Br, l.__scopeDialog), { forceMount: o = r.forceMount, ...s } = l, c = Gn(Br, l.__scopeDialog);
    return y.jsx(dc, {
      present: o || c.open,
      children: c.modal ? y.jsx(VE, {
        ...s,
        ref: n
      }) : y.jsx($E, {
        ...s,
        ref: n
      })
    });
  });
  s1.displayName = Br;
  var VE = g.forwardRef((l, n) => {
    const r = Gn(Br, l.__scopeDialog), o = g.useRef(null), s = Vr(n, r.contentRef, o);
    return g.useEffect(() => {
      const c = o.current;
      if (c) return zE(c);
    }, []), y.jsx(c1, {
      ...l,
      ref: s,
      trapFocus: r.open,
      disableOutsidePointerEvents: true,
      onCloseAutoFocus: cr(l.onCloseAutoFocus, (c) => {
        var _a;
        c.preventDefault(), (_a = r.triggerRef.current) == null ? void 0 : _a.focus();
      }),
      onPointerDownOutside: cr(l.onPointerDownOutside, (c) => {
        const f = c.detail.originalEvent, d = f.button === 0 && f.ctrlKey === true;
        (f.button === 2 || d) && c.preventDefault();
      }),
      onFocusOutside: cr(l.onFocusOutside, (c) => c.preventDefault())
    });
  }), $E = g.forwardRef((l, n) => {
    const r = Gn(Br, l.__scopeDialog), o = g.useRef(false), s = g.useRef(false);
    return y.jsx(c1, {
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
        const f = c.target;
        ((_b2 = r.triggerRef.current) == null ? void 0 : _b2.contains(f)) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && s.current && c.preventDefault();
      }
    });
  }), c1 = g.forwardRef((l, n) => {
    const { __scopeDialog: r, trapFocus: o, onOpenAutoFocus: s, onCloseAutoFocus: c, ...f } = l, d = Gn(Br, r), m = g.useRef(null), p = Vr(n, m);
    return QC(), y.jsxs(y.Fragment, {
      children: [
        y.jsx($0, {
          asChild: true,
          loop: true,
          trapped: o,
          onMountAutoFocus: s,
          onUnmountAutoFocus: c,
          children: y.jsx(X0, {
            role: "dialog",
            id: d.contentId,
            "aria-describedby": d.descriptionId,
            "aria-labelledby": d.titleId,
            "data-state": dh(d.open),
            ...f,
            ref: p,
            onDismiss: () => d.onOpenChange(false)
          })
        }),
        y.jsxs(y.Fragment, {
          children: [
            y.jsx(KE, {
              titleId: d.titleId
            }),
            y.jsx(FE, {
              contentRef: m,
              descriptionId: d.descriptionId
            })
          ]
        })
      ]
    });
  }), uh = "DialogTitle", qE = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(uh, r);
    return y.jsx(ai.h2, {
      id: s.titleId,
      ...o,
      ref: n
    });
  });
  qE.displayName = uh;
  var u1 = "DialogDescription", GE = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(u1, r);
    return y.jsx(ai.p, {
      id: s.descriptionId,
      ...o,
      ref: n
    });
  });
  GE.displayName = u1;
  var d1 = "DialogClose", PE = g.forwardRef((l, n) => {
    const { __scopeDialog: r, ...o } = l, s = Gn(d1, r);
    return y.jsx(ai.button, {
      type: "button",
      ...o,
      ref: n,
      onClick: cr(l.onClick, () => s.onOpenChange(false))
    });
  });
  PE.displayName = d1;
  function dh(l) {
    return l ? "open" : "closed";
  }
  var f1 = "DialogTitleWarning", [Z3, h1] = uC(f1, {
    contentName: Br,
    titleName: uh,
    docsSlug: "dialog"
  }), KE = ({ titleId: l }) => {
    const n = h1(f1), r = `\`${n.contentName}\` requires a \`${n.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${n.docsSlug}`;
    return g.useEffect(() => {
      l && (document.getElementById(l) || console.error(r));
    }, [
      r,
      l
    ]), null;
  }, ZE = "DialogDescriptionWarning", FE = ({ contentRef: l, descriptionId: n }) => {
    const o = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${h1(ZE).contentName}}.`;
    return g.useEffect(() => {
      var _a;
      const s = (_a = l.current) == null ? void 0 : _a.getAttribute("aria-describedby");
      n && s && (document.getElementById(n) || console.warn(o));
    }, [
      o,
      l,
      n
    ]), null;
  }, QE = l1, WE = o1, JE = i1, e_ = s1, t_ = Symbol.for("react.lazy"), tc = Qf[" use ".trim().toString()];
  function n_(l) {
    return typeof l == "object" && l !== null && "then" in l;
  }
  function m1(l) {
    return l != null && typeof l == "object" && "$$typeof" in l && l.$$typeof === t_ && "_payload" in l && n_(l._payload);
  }
  function l_(l) {
    const n = r_(l), r = g.forwardRef((o, s) => {
      let { children: c, ...f } = o;
      m1(c) && typeof tc == "function" && (c = tc(c._payload));
      const d = g.Children.toArray(c), m = d.find(o_);
      if (m) {
        const p = m.props.children, v = d.map((b) => b === m ? g.Children.count(p) > 1 ? g.Children.only(null) : g.isValidElement(p) ? p.props.children : null : b);
        return y.jsx(n, {
          ...f,
          ref: s,
          children: g.isValidElement(p) ? g.cloneElement(p, void 0, v) : null
        });
      }
      return y.jsx(n, {
        ...f,
        ref: s,
        children: c
      });
    });
    return r.displayName = `${l}.Slot`, r;
  }
  function r_(l) {
    const n = g.forwardRef((r, o) => {
      let { children: s, ...c } = r;
      if (m1(s) && typeof tc == "function" && (s = tc(s._payload)), g.isValidElement(s)) {
        const f = s_(s), d = i_(c, s.props);
        return s.type !== g.Fragment && (d.ref = o ? fr(o, f) : f), g.cloneElement(s, d);
      }
      return g.Children.count(s) > 1 ? g.Children.only(null) : null;
    });
    return n.displayName = `${l}.SlotClone`, n;
  }
  var a_ = Symbol("radix.slottable");
  function o_(l) {
    return g.isValidElement(l) && typeof l.type == "function" && "__radixId" in l.type && l.type.__radixId === a_;
  }
  function i_(l, n) {
    const r = {
      ...n
    };
    for (const o in n) {
      const s = l[o], c = n[o];
      /^on[A-Z]/.test(o) ? s && c ? r[o] = (...d) => {
        const m = c(...d);
        return s(...d), m;
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
  function s_(l) {
    var _a, _b2;
    let n = (_a = Object.getOwnPropertyDescriptor(l.props, "ref")) == null ? void 0 : _a.get, r = n && "isReactWarning" in n && n.isReactWarning;
    return r ? l.ref : (n = (_b2 = Object.getOwnPropertyDescriptor(l, "ref")) == null ? void 0 : _b2.get, r = n && "isReactWarning" in n && n.isReactWarning, r ? l.props.ref : l.props.ref || l.ref);
  }
  var c_ = [
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
  ], gr = c_.reduce((l, n) => {
    const r = l_(`Primitive.${n}`), o = g.forwardRef((s, c) => {
      const { asChild: f, ...d } = s, m = f ? r : n;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), y.jsx(m, {
        ...d,
        ref: c
      });
    });
    return o.displayName = `Primitive.${n}`, {
      ...l,
      [n]: o
    };
  }, {}), Ho = '[cmdk-group=""]', Zd = '[cmdk-group-items=""]', u_ = '[cmdk-group-heading=""]', g1 = '[cmdk-item=""]', bb = `${g1}:not([aria-disabled="true"])`, Gf = "cmdk-item-select", Na = "data-value", d_ = (l, n, r) => cC(l, n, r), p1 = g.createContext(void 0), oi = () => g.useContext(p1), y1 = g.createContext(void 0), fh = () => g.useContext(y1), b1 = g.createContext(void 0), v1 = g.forwardRef((l, n) => {
    let r = Oa(() => {
      var D, $;
      return {
        search: "",
        value: ($ = (D = l.value) != null ? D : l.defaultValue) != null ? $ : "",
        selectedItemId: void 0,
        filtered: {
          count: 0,
          items: /* @__PURE__ */ new Map(),
          groups: /* @__PURE__ */ new Set()
        }
      };
    }), o = Oa(() => /* @__PURE__ */ new Set()), s = Oa(() => /* @__PURE__ */ new Map()), c = Oa(() => /* @__PURE__ */ new Map()), f = Oa(() => /* @__PURE__ */ new Set()), d = x1(l), { label: m, children: p, value: v, onValueChange: b, filter: S, shouldFilter: E, loop: k, disablePointerSelection: w = false, vimBindings: C = true, ..._ } = l, T = Ll(), A = Ll(), j = Ll(), U = g.useRef(null), N = S_();
    Xr(() => {
      if (v !== void 0) {
        let D = v.trim();
        r.current.value = D, R.emit();
      }
    }, [
      v
    ]), Xr(() => {
      N(6, fe);
    }, []);
    let R = g.useMemo(() => ({
      subscribe: (D) => (f.current.add(D), () => f.current.delete(D)),
      snapshot: () => r.current,
      setState: (D, $, J) => {
        var W, ie, X, ue;
        if (!Object.is(r.current[D], $)) {
          if (r.current[D] = $, D === "search") ee(), G(), N(1, te);
          else if (D === "value") {
            if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
              let I = document.getElementById(j);
              I ? I.focus() : (W = document.getElementById(T)) == null || W.focus();
            }
            if (N(7, () => {
              var I;
              r.current.selectedItemId = (I = me()) == null ? void 0 : I.id, R.emit();
            }), J || N(5, fe), ((ie = d.current) == null ? void 0 : ie.value) !== void 0) {
              let I = $ ?? "";
              (ue = (X = d.current).onValueChange) == null || ue.call(X, I);
              return;
            }
          }
          R.emit();
        }
      },
      emit: () => {
        f.current.forEach((D) => D());
      }
    }), []), O = g.useMemo(() => ({
      value: (D, $, J) => {
        var W;
        $ !== ((W = c.current.get(D)) == null ? void 0 : W.value) && (c.current.set(D, {
          value: $,
          keywords: J
        }), r.current.filtered.items.set(D, H($, J)), N(2, () => {
          G(), R.emit();
        }));
      },
      item: (D, $) => (o.current.add(D), $ && (s.current.has($) ? s.current.get($).add(D) : s.current.set($, /* @__PURE__ */ new Set([
        D
      ]))), N(3, () => {
        ee(), G(), r.current.value || te(), R.emit();
      }), () => {
        c.current.delete(D), o.current.delete(D), r.current.filtered.items.delete(D);
        let J = me();
        N(4, () => {
          ee(), (J == null ? void 0 : J.getAttribute("id")) === D && te(), R.emit();
        });
      }),
      group: (D) => (s.current.has(D) || s.current.set(D, /* @__PURE__ */ new Set()), () => {
        c.current.delete(D), s.current.delete(D);
      }),
      filter: () => d.current.shouldFilter,
      label: m || l["aria-label"],
      getDisablePointerSelection: () => d.current.disablePointerSelection,
      listId: T,
      inputId: j,
      labelId: A,
      listInnerRef: U
    }), []);
    function H(D, $) {
      var J, W;
      let ie = (W = (J = d.current) == null ? void 0 : J.filter) != null ? W : d_;
      return D ? ie(D, r.current.search, $) : 0;
    }
    function G() {
      if (!r.current.search || d.current.shouldFilter === false) return;
      let D = r.current.filtered.items, $ = [];
      r.current.filtered.groups.forEach((W) => {
        let ie = s.current.get(W), X = 0;
        ie.forEach((ue) => {
          let I = D.get(ue);
          X = Math.max(I, X);
        }), $.push([
          W,
          X
        ]);
      });
      let J = U.current;
      Ee().sort((W, ie) => {
        var X, ue;
        let I = W.getAttribute("id"), se = ie.getAttribute("id");
        return ((X = D.get(se)) != null ? X : 0) - ((ue = D.get(I)) != null ? ue : 0);
      }).forEach((W) => {
        let ie = W.closest(Zd);
        ie ? ie.appendChild(W.parentElement === ie ? W : W.closest(`${Zd} > *`)) : J.appendChild(W.parentElement === J ? W : W.closest(`${Zd} > *`));
      }), $.sort((W, ie) => ie[1] - W[1]).forEach((W) => {
        var ie;
        let X = (ie = U.current) == null ? void 0 : ie.querySelector(`${Ho}[${Na}="${encodeURIComponent(W[0])}"]`);
        X == null ? void 0 : X.parentElement.appendChild(X);
      });
    }
    function te() {
      let D = Ee().find((J) => J.getAttribute("aria-disabled") !== "true"), $ = D == null ? void 0 : D.getAttribute(Na);
      R.setState("value", $ || void 0);
    }
    function ee() {
      var D, $, J, W;
      if (!r.current.search || d.current.shouldFilter === false) {
        r.current.filtered.count = o.current.size;
        return;
      }
      r.current.filtered.groups = /* @__PURE__ */ new Set();
      let ie = 0;
      for (let X of o.current) {
        let ue = ($ = (D = c.current.get(X)) == null ? void 0 : D.value) != null ? $ : "", I = (W = (J = c.current.get(X)) == null ? void 0 : J.keywords) != null ? W : [], se = H(ue, I);
        r.current.filtered.items.set(X, se), se > 0 && ie++;
      }
      for (let [X, ue] of s.current) for (let I of ue) if (r.current.filtered.items.get(I) > 0) {
        r.current.filtered.groups.add(X);
        break;
      }
      r.current.filtered.count = ie;
    }
    function fe() {
      var D, $, J;
      let W = me();
      W && (((D = W.parentElement) == null ? void 0 : D.firstChild) === W && ((J = ($ = W.closest(Ho)) == null ? void 0 : $.querySelector(u_)) == null || J.scrollIntoView({
        block: "nearest"
      })), W.scrollIntoView({
        block: "nearest"
      }));
    }
    function me() {
      var D;
      return (D = U.current) == null ? void 0 : D.querySelector(`${g1}[aria-selected="true"]`);
    }
    function Ee() {
      var D;
      return Array.from(((D = U.current) == null ? void 0 : D.querySelectorAll(bb)) || []);
    }
    function q(D) {
      let $ = Ee()[D];
      $ && R.setState("value", $.getAttribute(Na));
    }
    function F(D) {
      var $;
      let J = me(), W = Ee(), ie = W.findIndex((ue) => ue === J), X = W[ie + D];
      ($ = d.current) != null && $.loop && (X = ie + D < 0 ? W[W.length - 1] : ie + D === W.length ? W[0] : W[ie + D]), X && R.setState("value", X.getAttribute(Na));
    }
    function ce(D) {
      let $ = me(), J = $ == null ? void 0 : $.closest(Ho), W;
      for (; J && !W; ) J = D > 0 ? x_(J, Ho) : w_(J, Ho), W = J == null ? void 0 : J.querySelector(bb);
      W ? R.setState("value", W.getAttribute(Na)) : F(D);
    }
    let _e = () => q(Ee().length - 1), be = (D) => {
      D.preventDefault(), D.metaKey ? _e() : D.altKey ? ce(1) : F(1);
    }, L = (D) => {
      D.preventDefault(), D.metaKey ? q(0) : D.altKey ? ce(-1) : F(-1);
    };
    return g.createElement(gr.div, {
      ref: n,
      tabIndex: -1,
      ..._,
      "cmdk-root": "",
      onKeyDown: (D) => {
        var $;
        ($ = _.onKeyDown) == null || $.call(_, D);
        let J = D.nativeEvent.isComposing || D.keyCode === 229;
        if (!(D.defaultPrevented || J)) switch (D.key) {
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
            C && D.ctrlKey && L(D);
            break;
          }
          case "ArrowUp": {
            L(D);
            break;
          }
          case "Home": {
            D.preventDefault(), q(0);
            break;
          }
          case "End": {
            D.preventDefault(), _e();
            break;
          }
          case "Enter": {
            D.preventDefault();
            let W = me();
            if (W) {
              let ie = new Event(Gf);
              W.dispatchEvent(ie);
            }
          }
        }
      }
    }, g.createElement("label", {
      "cmdk-label": "",
      htmlFor: O.inputId,
      id: O.labelId,
      style: E_
    }, m), mc(l, (D) => g.createElement(y1.Provider, {
      value: R
    }, g.createElement(p1.Provider, {
      value: O
    }, D))));
  }), f_ = g.forwardRef((l, n) => {
    var r, o;
    let s = Ll(), c = g.useRef(null), f = g.useContext(b1), d = oi(), m = x1(l), p = (o = (r = m.current) == null ? void 0 : r.forceMount) != null ? o : f == null ? void 0 : f.forceMount;
    Xr(() => {
      if (!p) return d.item(s, f == null ? void 0 : f.id);
    }, [
      p
    ]);
    let v = w1(s, c, [
      l.value,
      l.children,
      c
    ], l.keywords), b = fh(), S = hr((N) => N.value && N.value === v.current), E = hr((N) => p || d.filter() === false ? true : N.search ? N.filtered.items.get(s) > 0 : true);
    g.useEffect(() => {
      let N = c.current;
      if (!(!N || l.disabled)) return N.addEventListener(Gf, k), () => N.removeEventListener(Gf, k);
    }, [
      E,
      l.onSelect,
      l.disabled
    ]);
    function k() {
      var N, R;
      w(), (R = (N = m.current).onSelect) == null || R.call(N, v.current);
    }
    function w() {
      b.setState("value", v.current, true);
    }
    if (!E) return null;
    let { disabled: C, value: _, onSelect: T, forceMount: A, keywords: j, ...U } = l;
    return g.createElement(gr.div, {
      ref: fr(c, n),
      ...U,
      id: s,
      "cmdk-item": "",
      role: "option",
      "aria-disabled": !!C,
      "aria-selected": !!S,
      "data-disabled": !!C,
      "data-selected": !!S,
      onPointerMove: C || d.getDisablePointerSelection() ? void 0 : w,
      onClick: C ? void 0 : k
    }, l.children);
  }), h_ = g.forwardRef((l, n) => {
    let { heading: r, children: o, forceMount: s, ...c } = l, f = Ll(), d = g.useRef(null), m = g.useRef(null), p = Ll(), v = oi(), b = hr((E) => s || v.filter() === false ? true : E.search ? E.filtered.groups.has(f) : true);
    Xr(() => v.group(f), []), w1(f, d, [
      l.value,
      l.heading,
      m
    ]);
    let S = g.useMemo(() => ({
      id: f,
      forceMount: s
    }), [
      s
    ]);
    return g.createElement(gr.div, {
      ref: fr(d, n),
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
    }, g.createElement(b1.Provider, {
      value: S
    }, E))));
  }), m_ = g.forwardRef((l, n) => {
    let { alwaysRender: r, ...o } = l, s = g.useRef(null), c = hr((f) => !f.search);
    return !r && !c ? null : g.createElement(gr.div, {
      ref: fr(s, n),
      ...o,
      "cmdk-separator": "",
      role: "separator"
    });
  }), g_ = g.forwardRef((l, n) => {
    let { onValueChange: r, ...o } = l, s = l.value != null, c = fh(), f = hr((p) => p.search), d = hr((p) => p.selectedItemId), m = oi();
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
      "aria-activedescendant": d,
      id: m.inputId,
      type: "text",
      value: s ? l.value : f,
      onChange: (p) => {
        s || c.setState("search", p.target.value), r == null ? void 0 : r(p.target.value);
      }
    });
  }), p_ = g.forwardRef((l, n) => {
    let { children: r, label: o = "Suggestions", ...s } = l, c = g.useRef(null), f = g.useRef(null), d = hr((p) => p.selectedItemId), m = oi();
    return g.useEffect(() => {
      if (f.current && c.current) {
        let p = f.current, v = c.current, b, S = new ResizeObserver(() => {
          b = requestAnimationFrame(() => {
            let E = p.offsetHeight;
            v.style.setProperty("--cmdk-list-height", E.toFixed(1) + "px");
          });
        });
        return S.observe(p), () => {
          cancelAnimationFrame(b), S.unobserve(p);
        };
      }
    }, []), g.createElement(gr.div, {
      ref: fr(c, n),
      ...s,
      "cmdk-list": "",
      role: "listbox",
      tabIndex: -1,
      "aria-activedescendant": d,
      "aria-label": o,
      id: m.listId
    }, mc(l, (p) => g.createElement("div", {
      ref: fr(f, m.listInnerRef),
      "cmdk-list-sizer": ""
    }, p)));
  }), y_ = g.forwardRef((l, n) => {
    let { open: r, onOpenChange: o, overlayClassName: s, contentClassName: c, container: f, ...d } = l;
    return g.createElement(QE, {
      open: r,
      onOpenChange: o
    }, g.createElement(WE, {
      container: f
    }, g.createElement(JE, {
      "cmdk-overlay": "",
      className: s
    }), g.createElement(e_, {
      "aria-label": l.label,
      "cmdk-dialog": "",
      className: c
    }, g.createElement(v1, {
      ref: n,
      ...d
    }))));
  }), b_ = g.forwardRef((l, n) => hr((r) => r.filtered.count === 0) ? g.createElement(gr.div, {
    ref: n,
    ...l,
    "cmdk-empty": "",
    role: "presentation"
  }) : null), v_ = g.forwardRef((l, n) => {
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
    }, mc(l, (f) => g.createElement("div", {
      "aria-hidden": true
    }, f)));
  }), Yo = Object.assign(v1, {
    List: p_,
    Item: f_,
    Input: g_,
    Group: h_,
    Separator: m_,
    Dialog: y_,
    Empty: b_,
    Loading: v_
  });
  function x_(l, n) {
    let r = l.nextElementSibling;
    for (; r; ) {
      if (r.matches(n)) return r;
      r = r.nextElementSibling;
    }
  }
  function w_(l, n) {
    let r = l.previousElementSibling;
    for (; r; ) {
      if (r.matches(n)) return r;
      r = r.previousElementSibling;
    }
  }
  function x1(l) {
    let n = g.useRef(l);
    return Xr(() => {
      n.current = l;
    }), n;
  }
  var Xr = typeof window > "u" ? g.useEffect : g.useLayoutEffect;
  function Oa(l) {
    let n = g.useRef();
    return n.current === void 0 && (n.current = l()), n;
  }
  function hr(l) {
    let n = fh(), r = () => l(n.snapshot());
    return g.useSyncExternalStore(n.subscribe, r, r);
  }
  function w1(l, n, r, o = []) {
    let s = g.useRef(), c = oi();
    return Xr(() => {
      var f;
      let d = (() => {
        var p;
        for (let v of r) {
          if (typeof v == "string") return v.trim();
          if (typeof v == "object" && "current" in v) return v.current ? (p = v.current.textContent) == null ? void 0 : p.trim() : s.current;
        }
      })(), m = o.map((p) => p.trim());
      c.value(l, d, m), (f = n.current) == null || f.setAttribute(Na, d), s.current = d;
    }), s;
  }
  var S_ = () => {
    let [l, n] = g.useState(), r = Oa(() => /* @__PURE__ */ new Map());
    return Xr(() => {
      r.current.forEach((o) => o()), r.current = /* @__PURE__ */ new Map();
    }, [
      l
    ]), (o, s) => {
      r.current.set(o, s), n({});
    };
  };
  function C_(l) {
    let n = l.type;
    return typeof n == "function" ? n(l.props) : "render" in n ? n.render(l.props) : l;
  }
  function mc({ asChild: l, children: n }, r) {
    return l && g.isValidElement(n) ? g.cloneElement(C_(n), {
      ref: n.ref
    }, r(n.props.children)) : r(n);
  }
  var E_ = {
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
  const Wo = wt()(Wf((l) => ({
    isMinimized: true,
    toggle: () => l((n) => ({
      isMinimized: !n.isMinimized
    }))
  }), {
    name: "rosette-minimap",
    partialize: (l) => ({
      isMinimized: l.isMinimized
    })
  })), __ = "image/png,image/jpeg,image/svg+xml,image/webp,image/gif,image/bmp";
  function k_(l) {
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
  function M_(l) {
    return l.replace(/\\/g, "/").split("/").pop() ?? l;
  }
  function S1(l) {
    return new Promise((n, r) => {
      const o = new Image();
      o.onload = () => n({
        naturalWidth: o.naturalWidth,
        naturalHeight: o.naturalHeight
      }), o.onerror = () => r(new Error("Failed to decode image")), o.src = l;
    });
  }
  function j_() {
    return new Promise((l) => {
      const n = document.createElement("input");
      n.type = "file", n.accept = __, n.style.display = "none", n.addEventListener("change", async () => {
        var _a;
        const r = (_a = n.files) == null ? void 0 : _a[0];
        if (!r) {
          l(null);
          return;
        }
        const o = URL.createObjectURL(r);
        try {
          const { naturalWidth: s, naturalHeight: c } = await S1(o);
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
  async function L_() {
    const l = await r0();
    if (!l) return null;
    const n = M_(l), r = k_(n), o = await a0(l), s = new Blob([
      o.buffer
    ], {
      type: r
    }), c = URL.createObjectURL(s);
    try {
      const { naturalWidth: f, naturalHeight: d } = await S1(c);
      return {
        url: c,
        filename: n,
        naturalWidth: f,
        naturalHeight: d
      };
    } catch {
      return URL.revokeObjectURL(c), null;
    }
  }
  function R_(l) {
    const { zoom: n, offset: r } = ze.getState(), o = document.getElementById("rosette-canvas");
    if (!o) return;
    const s = o.getBoundingClientRect(), c = (s.width / 2 - r.x) / n, f = (s.height / 2 - r.y) / n, m = s.width / n * 0.2, p = l.naturalHeight / l.naturalWidth, v = m * p, b = c - m / 2, S = f - v / 2, E = {
      id: crypto.randomUUID(),
      url: l.url,
      filename: l.filename,
      x: b,
      y: S,
      width: m,
      height: v,
      naturalWidth: l.naturalWidth,
      naturalHeight: l.naturalHeight,
      lockAspectRatio: true
    }, { library: k, renderer: w } = xe.getState();
    if (k && w) {
      const C = new t2(E);
      de.getState().execute(C, {
        library: k,
        renderer: w
      });
    }
  }
  async function A_() {
    const l = Dn ? await L_() : await j_();
    l && R_(l);
  }
  function T_() {
    const { setThemeSetting: l } = pe.getState(), { close: n } = ln.getState(), { setTool: r } = Xt.getState();
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
          const { handleNewFile: s } = await ht(async () => {
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
            const { emitOpenFile: s } = await ht(async () => {
              const { emitOpenFile: d } = await Promise.resolve().then(() => Vn);
              return {
                emitOpenFile: d
              };
            }, void 0, import.meta.url), { pickGdsFile: c } = await ht(async () => {
              const { pickGdsFile: d } = await Promise.resolve().then(() => i0);
              return {
                pickGdsFile: d
              };
            }, void 0, import.meta.url), f = await c();
            f && await s(f);
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
            const { handleSave: s } = await ht(async () => {
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
            const { handleSave: s } = await ht(async () => {
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
          const { handleScreenshot: s } = await ht(async () => {
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
          const { handleScreenshotToClipboard: s } = await ht(async () => {
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
          Wo.getState().toggle(), n();
        },
        searchableText: "Toggle minimap show hide overview map"
      },
      {
        id: "view-toggle-grid",
        type: "command",
        name: "View: Toggle Grid",
        action: () => {
          pe.getState().toggleGrid(), n();
        },
        searchableText: "Toggle grid show hide dots points"
      },
      {
        id: "view-toggle-zen-mode",
        type: "command",
        name: "View: Toggle Zen Mode",
        action: () => {
          pe.getState().toggleZenMode(), n();
        },
        searchableText: "Toggle zen mode focus distraction free hide toolbar explorer sidebar panels"
      },
      {
        id: "view-show-layers",
        type: "command",
        name: "View: Show Layers Panel",
        action: () => {
          pe.getState().setSidebarTab("layers"), n();
        },
        searchableText: "Show layers panel sidebar switch tab"
      },
      {
        id: "view-show-inspector",
        type: "command",
        name: "View: Show Inspector Panel",
        action: () => {
          pe.getState().setSidebarTab("inspector"), n();
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
          pe.getState().explorerCollapsed && pe.getState().toggleExplorerCollapsed(), he.getState().setFocused(true), n();
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
          pe.getState().setSidebarTab("layers"), ye.getState().setFocused(true), n();
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
          const s = document.getElementById("rosette-canvas");
          if (s) {
            const c = s.getBoundingClientRect();
            ze.getState().zoomAt(lc, c.width / 2, c.height / 2);
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
            ze.getState().zoomAt(rc, c.width / 2, c.height / 2);
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
          const s = document.getElementById("rosette-canvas"), { library: c } = xe.getState();
          if (s && c) {
            const f = c.get_all_bounds(), d = f ? {
              minX: f[0],
              minY: f[1],
              maxX: f[2],
              maxY: f[3]
            } : null, m = ol(s);
            ze.getState().zoomToFit(d, m.width, m.height, m.screenCenter);
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
          const s = document.getElementById("rosette-canvas"), { library: c } = xe.getState();
          if (s && c) {
            const f = oe.getState().selectedIds;
            if (f.size > 0) {
              const d = c.get_bounds_for_ids([
                ...f
              ]), m = d ? {
                minX: d[0],
                minY: d[1],
                maxX: d[2],
                maxY: d[3]
              } : null, p = ol(s);
              ze.getState().zoomToSelected(m, p.width, p.height, p.screenCenter);
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
          const { library: s, renderer: c } = xe.getState(), f = document.getElementById("rosette-canvas");
          s && c && f && E0(s, c, f), n();
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
          const { library: s, renderer: c } = xe.getState(), f = document.getElementById("rosette-canvas");
          s && c && f && _0(s, c, f), n();
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
          const { library: s, renderer: c } = xe.getState(), f = document.getElementById("rosette-canvas");
          s && c && f && k0(s, c, f), n();
        },
        searchableText: "Add text create label annotation place"
      },
      {
        id: "insert-image",
        type: "command",
        name: "Insert: Image",
        action: () => {
          A_(), n();
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
          const { library: s, renderer: c } = xe.getState();
          if (s && c) {
            const { canUndo: f, undo: d } = de.getState();
            f && d({
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
          const { library: s, renderer: c } = xe.getState();
          if (s && c) {
            const { canRedo: f, redo: d } = de.getState();
            f && d({
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
          const { library: s } = xe.getState(), { selectedIds: c } = oe.getState();
          if (!s || c.size === 0) {
            n();
            return;
          }
          const f = mr(s, c);
          zn.getState().copy(f), n();
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
          const { library: s, renderer: c } = xe.getState();
          if (!s || !c || !zn.getState().hasContent) {
            n();
            return;
          }
          const f = new cc();
          de.getState().execute(f, {
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
          const { library: s, renderer: c } = xe.getState(), { selectedIds: f } = oe.getState();
          if (!s || !c || f.size === 0) {
            n();
            return;
          }
          const d = new uc([
            ...f
          ]);
          de.getState().execute(d, {
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
          const { library: s, renderer: c } = xe.getState(), { selectedIds: f } = oe.getState();
          if (!s || !c || f.size === 0) {
            n();
            return;
          }
          const d = new sc([
            ...f
          ]);
          de.getState().execute(d, {
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
          oe.getState().selectedIds.size > 0 && pe.getState().requestInspectorFocus(), n();
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
          const { library: s } = xe.getState();
          if (!s) {
            n();
            return;
          }
          const c = s.get_all_ids();
          oe.getState().selectAll(c), n();
        },
        searchableText: "Select all elements"
      },
      {
        id: "edit-text-to-polygons",
        type: "command",
        name: "Edit: Convert Text to Polygons",
        action: () => {
          const { selectedIds: s } = oe.getState(), { library: c, renderer: f } = xe.getState();
          if (!c || !f || s.size === 0) {
            n();
            return;
          }
          const d = [
            ...s
          ].filter((p) => c.is_text_element(p));
          if (d.length === 0) {
            n();
            return;
          }
          const m = new j0(d);
          de.getState().execute(m, {
            library: c,
            renderer: f
          }), n();
        },
        searchableText: "Convert text to polygons outline vectorize font"
      },
      {
        id: "layer-add",
        type: "layer",
        name: "Layer: Add",
        action: () => {
          const { library: s, renderer: c } = xe.getState();
          if (!s || !c) {
            n();
            return;
          }
          const f = new x0();
          de.getState().execute(f, {
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
          const { library: s, renderer: c } = xe.getState(), { activeLayerId: f, layers: d } = ye.getState();
          if (!s || !c || d.size <= 1) {
            n();
            return;
          }
          const m = new nh(f);
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
          ye.getState().setExpandedLayerId(s), pe.getState().setSidebarTab("layers"), n();
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
          const { library: s, renderer: c } = xe.getState();
          if (!s || !c) {
            n();
            return;
          }
          const f = he.getState().cells;
          let d = 1, m = `cell${d}`;
          for (; f.includes(m); ) d++, m = `cell${d}`;
          const p = new ZS(m);
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
          const { library: s, renderer: c } = xe.getState(), { activeCell: f, cells: d } = he.getState();
          if (!s || !c || !f || d.length <= 1) {
            n();
            return;
          }
          const m = new lh(f);
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
          const { activeCell: s } = he.getState();
          s && he.getState().setEditingCellName(s), n();
        },
        searchableText: "Rename active cell"
      },
      {
        id: "cell-change-origin",
        type: "cell",
        name: "Cell: Change Origin",
        action: () => {
          oe.getState().clearSelection(), pe.getState().requestInspectorFocusField("X"), n();
        },
        searchableText: "Cell change origin position offset set move"
      },
      {
        id: "cell-toggle-visibility",
        type: "cell",
        name: "Cell: Toggle Active Visibility",
        action: () => {
          const { activeCell: s } = he.getState();
          s && he.getState().toggleCellVisibility(s), n();
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
      ...he.getState().cells.map((s) => ({
        id: `cell-activate-${s}`,
        type: "cell",
        name: `Cell: Set Active: ${s}`,
        action: () => {
          he.getState().setActiveCell(s), n();
        },
        searchableText: `Cell set active ${s} switch`
      })),
      ...he.getState().cells.filter((s) => s !== he.getState().activeCell).map((s) => ({
        id: `cell-instance-${s}`,
        type: "cell",
        name: `Cell: Add Instance: ${s}`,
        action: () => {
          const { library: c, renderer: f } = xe.getState(), d = he.getState().activeCell;
          if (!c || !f || !d) {
            n();
            return;
          }
          if (!c.can_instance_cell(d, s)) {
            n();
            return;
          }
          const { zoom: m, offset: p } = ze.getState(), v = window.innerWidth / 2, b = window.innerHeight / 2, S = (v - p.x) / m, E = (b - p.y) / m, k = new C0(s, S, E);
          de.getState().execute(k, {
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
          const { setHierarchyLevelLimit: s } = he.getState();
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
      ...D_(n),
      ...I_(n)
    ];
  }
  const N_ = [
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
  ], O_ = [
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
  function D_(l) {
    return O_.map((n) => ({
      id: `boolean-${n.id}`,
      type: "command",
      name: `Boolean: ${n.name}`,
      action: () => {
        const { library: r, renderer: o } = xe.getState();
        if (!r || !o) {
          l();
          return;
        }
        const { selectedIds: s, lastSelectedId: c } = oe.getState();
        if (s.size < 2) {
          l();
          return;
        }
        const f = [
          ...s
        ], d = c ?? f[0], m = new R0(f, n.id, d);
        de.getState().execute(m, {
          library: r,
          renderer: o
        }), l();
      },
      searchableText: n.search
    }));
  }
  function I_(l) {
    return N_.map((n) => ({
      id: `align-${n.id}`,
      type: "command",
      name: `Align: ${n.name}`,
      action: () => {
        const { library: r, renderer: o } = xe.getState();
        if (!r || !o) {
          l();
          return;
        }
        const { selectedIds: s, lastSelectedId: c } = oe.getState();
        if (s.size === 0) {
          l();
          return;
        }
        if (n.id !== "origin-align" && s.size < 2) {
          l();
          return;
        }
        const f = new L0(new Set(s), c, n.id);
        de.getState().execute(f, {
          library: r,
          renderer: o
        }), l();
      },
      searchableText: n.search
    }));
  }
  function z_({ shortcut: l }) {
    var _a;
    const r = pe((s) => s.theme) === "dark", o = B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", r ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10");
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
              className: B("px-1 text-[11px]", r ? "text-white/50" : "text-gray-500"),
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
  function H_({ item: l }) {
    const r = pe((o) => o.theme) === "dark";
    return y.jsxs(Yo.Item, {
      value: l.searchableText,
      onSelect: l.action,
      className: B("flex cursor-pointer items-center justify-between rounded-lg px-3 py-2", r ? "text-white/80 aria-selected:bg-[rgb(54,54,54)] aria-selected:text-white" : "text-gray-700 aria-selected:bg-[rgb(217,217,217)] aria-selected:text-gray-900"),
      children: [
        y.jsx("span", {
          className: "text-sm",
          children: l.name
        }),
        l.color && y.jsx("span", {
          className: B("inline-block h-3.5 w-3.5 shrink-0 rounded border", r ? "border-white/15" : "border-black/15"),
          style: {
            backgroundColor: l.color
          }
        }),
        l.shortcut && y.jsx(z_, {
          shortcut: l.shortcut
        })
      ]
    });
  }
  function vb() {
    const n = pe((b) => b.theme) === "dark", r = ln((b) => b.isOpen), o = ln((b) => b.close);
    Ya("command-palette", r);
    const [s, c] = g.useState(""), f = g.useRef(null), d = g.useMemo(() => T_(), [
      r
    ]), m = g.useMemo(() => {
      const b = s.toLowerCase();
      return d.filter((S) => S.searchableText.toLowerCase().includes(b));
    }, [
      d,
      s
    ]), p = g.useMemo(() => [
      ...m
    ].sort((b, S) => b.name.localeCompare(S.name)), [
      m
    ]), v = g.useCallback((b) => {
      const S = b.target;
      S instanceof Node && f.current && !f.current.contains(S) && o();
    }, [
      o
    ]);
    return g.useEffect(() => {
      if (!r) {
        c("");
        return;
      }
      return c(ln.getState().initialSearch), document.addEventListener("mousedown", v), () => {
        document.removeEventListener("mousedown", v);
      };
    }, [
      r,
      v
    ]), r ? y.jsx("div", {
      className: "fixed inset-0 z-[200]",
      children: y.jsx(Yo, {
        className: "fixed inset-0 flex items-start justify-center px-4 pt-[min(15vh,120px)]",
        shouldFilter: false,
        loop: true,
        label: "Command Menu",
        onKeyDown: (b) => {
          b.key === "Escape" && (b.preventDefault(), o());
        },
        children: y.jsxs("div", {
          ref: f,
          className: B("w-full max-w-[560px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          children: [
            y.jsx(Yo.Input, {
              value: s,
              onValueChange: c,
              placeholder: "Type a command or search...",
              className: B("w-full border-b bg-transparent px-4 py-3 text-sm outline-none", n ? "border-white/10 text-white/90 placeholder:text-white/50" : "border-black/10 text-gray-900 placeholder:text-gray-500"),
              autoFocus: true
            }),
            y.jsxs(Yo.List, {
              className: "max-h-[320px] overflow-y-auto p-1",
              onWheel: (b) => b.stopPropagation(),
              children: [
                y.jsx(Yo.Empty, {
                  className: B("px-3 py-2 text-sm", n ? "text-white/50" : "text-gray-500"),
                  children: "No matching commands"
                }),
                p.map((b) => y.jsx(H_, {
                  item: b
                }, b.id))
              ]
            })
          ]
        })
      })
    }) : null;
  }
  const lt = Da.createContext({});
  var U_ = Object.defineProperty, xb = Object.getOwnPropertySymbols, Y_ = Object.prototype.hasOwnProperty, B_ = Object.prototype.propertyIsEnumerable, wb = (l, n, r) => n in l ? U_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Fd = (l, n) => {
    for (var r in n || (n = {})) Y_.call(n, r) && wb(l, r, n[r]);
    if (xb) for (var r of xb(n)) B_.call(n, r) && wb(l, r, n[r]);
    return l;
  };
  const X_ = (l, n) => {
    const r = g.useContext(lt), o = Fd(Fd({}, r), l);
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
      d: "M12 22L12 2",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M19 16H5C3.89543 16 3 15.1046 3 14L3 10C3 8.89543 3.89543 8 5 8H19C20.1046 8 21 8.89543 21 10V14C21 15.1046 20.1046 16 19 16Z",
      stroke: "currentColor"
    }));
  }, V_ = g.forwardRef(X_);
  var $_ = V_, q_ = Object.defineProperty, Sb = Object.getOwnPropertySymbols, G_ = Object.prototype.hasOwnProperty, P_ = Object.prototype.propertyIsEnumerable, Cb = (l, n, r) => n in l ? q_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Qd = (l, n) => {
    for (var r in n || (n = {})) G_.call(n, r) && Cb(l, r, n[r]);
    if (Sb) for (var r of Sb(n)) P_.call(n, r) && Cb(l, r, n[r]);
    return l;
  };
  const K_ = (l, n) => {
    const r = g.useContext(lt), o = Qd(Qd({}, r), l);
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
      d: "M22 12L2 12",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), g.createElement("path", {
      d: "M8 19V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V19C16 20.1046 15.1046 21 14 21H10C8.89543 21 8 20.1046 8 19Z",
      stroke: "currentColor"
    }));
  }, Z_ = g.forwardRef(K_);
  var F_ = Z_, Q_ = Object.defineProperty, Eb = Object.getOwnPropertySymbols, W_ = Object.prototype.hasOwnProperty, J_ = Object.prototype.propertyIsEnumerable, _b = (l, n, r) => n in l ? Q_(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Wd = (l, n) => {
    for (var r in n || (n = {})) W_.call(n, r) && _b(l, r, n[r]);
    if (Eb) for (var r of Eb(n)) J_.call(n, r) && _b(l, r, n[r]);
    return l;
  };
  const e4 = (l, n) => {
    const r = g.useContext(lt), o = Wd(Wd({}, r), l);
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
  }, t4 = g.forwardRef(e4);
  var n4 = t4, l4 = Object.defineProperty, kb = Object.getOwnPropertySymbols, r4 = Object.prototype.hasOwnProperty, a4 = Object.prototype.propertyIsEnumerable, Mb = (l, n, r) => n in l ? l4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Jd = (l, n) => {
    for (var r in n || (n = {})) r4.call(n, r) && Mb(l, r, n[r]);
    if (kb) for (var r of kb(n)) a4.call(n, r) && Mb(l, r, n[r]);
    return l;
  };
  const o4 = (l, n) => {
    const r = g.useContext(lt), o = Jd(Jd({}, r), l);
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
  }, i4 = g.forwardRef(o4);
  var s4 = i4, c4 = Object.defineProperty, jb = Object.getOwnPropertySymbols, u4 = Object.prototype.hasOwnProperty, d4 = Object.prototype.propertyIsEnumerable, Lb = (l, n, r) => n in l ? c4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, ef = (l, n) => {
    for (var r in n || (n = {})) u4.call(n, r) && Lb(l, r, n[r]);
    if (jb) for (var r of jb(n)) d4.call(n, r) && Lb(l, r, n[r]);
    return l;
  };
  const f4 = (l, n) => {
    const r = g.useContext(lt), o = ef(ef({}, r), l);
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
  }, h4 = g.forwardRef(f4);
  var m4 = h4, g4 = Object.defineProperty, Rb = Object.getOwnPropertySymbols, p4 = Object.prototype.hasOwnProperty, y4 = Object.prototype.propertyIsEnumerable, Ab = (l, n, r) => n in l ? g4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, tf = (l, n) => {
    for (var r in n || (n = {})) p4.call(n, r) && Ab(l, r, n[r]);
    if (Rb) for (var r of Rb(n)) y4.call(n, r) && Ab(l, r, n[r]);
    return l;
  };
  const b4 = (l, n) => {
    const r = g.useContext(lt), o = tf(tf({}, r), l);
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
  }, v4 = g.forwardRef(b4);
  var x4 = v4, w4 = Object.defineProperty, Tb = Object.getOwnPropertySymbols, S4 = Object.prototype.hasOwnProperty, C4 = Object.prototype.propertyIsEnumerable, Nb = (l, n, r) => n in l ? w4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, nf = (l, n) => {
    for (var r in n || (n = {})) S4.call(n, r) && Nb(l, r, n[r]);
    if (Tb) for (var r of Tb(n)) C4.call(n, r) && Nb(l, r, n[r]);
    return l;
  };
  const E4 = (l, n) => {
    const r = g.useContext(lt), o = nf(nf({}, r), l);
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
  }, _4 = g.forwardRef(E4);
  var k4 = _4, M4 = Object.defineProperty, Ob = Object.getOwnPropertySymbols, j4 = Object.prototype.hasOwnProperty, L4 = Object.prototype.propertyIsEnumerable, Db = (l, n, r) => n in l ? M4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, lf = (l, n) => {
    for (var r in n || (n = {})) j4.call(n, r) && Db(l, r, n[r]);
    if (Ob) for (var r of Ob(n)) L4.call(n, r) && Db(l, r, n[r]);
    return l;
  };
  const R4 = (l, n) => {
    const r = g.useContext(lt), o = lf(lf({}, r), l);
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
  }, A4 = g.forwardRef(R4);
  var T4 = A4, N4 = Object.defineProperty, Ib = Object.getOwnPropertySymbols, O4 = Object.prototype.hasOwnProperty, D4 = Object.prototype.propertyIsEnumerable, zb = (l, n, r) => n in l ? N4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, rf = (l, n) => {
    for (var r in n || (n = {})) O4.call(n, r) && zb(l, r, n[r]);
    if (Ib) for (var r of Ib(n)) D4.call(n, r) && zb(l, r, n[r]);
    return l;
  };
  const I4 = (l, n) => {
    const r = g.useContext(lt), o = rf(rf({}, r), l);
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
  }, z4 = g.forwardRef(I4);
  var H4 = z4, U4 = Object.defineProperty, Hb = Object.getOwnPropertySymbols, Y4 = Object.prototype.hasOwnProperty, B4 = Object.prototype.propertyIsEnumerable, Ub = (l, n, r) => n in l ? U4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, af = (l, n) => {
    for (var r in n || (n = {})) Y4.call(n, r) && Ub(l, r, n[r]);
    if (Hb) for (var r of Hb(n)) B4.call(n, r) && Ub(l, r, n[r]);
    return l;
  };
  const X4 = (l, n) => {
    const r = g.useContext(lt), o = af(af({}, r), l);
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
  }, V4 = g.forwardRef(X4);
  var hh = V4, $4 = Object.defineProperty, Yb = Object.getOwnPropertySymbols, q4 = Object.prototype.hasOwnProperty, G4 = Object.prototype.propertyIsEnumerable, Bb = (l, n, r) => n in l ? $4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, of = (l, n) => {
    for (var r in n || (n = {})) q4.call(n, r) && Bb(l, r, n[r]);
    if (Yb) for (var r of Yb(n)) G4.call(n, r) && Bb(l, r, n[r]);
    return l;
  };
  const P4 = (l, n) => {
    const r = g.useContext(lt), o = of(of({}, r), l);
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
  }, K4 = g.forwardRef(P4);
  var C1 = K4, Z4 = Object.defineProperty, Xb = Object.getOwnPropertySymbols, F4 = Object.prototype.hasOwnProperty, Q4 = Object.prototype.propertyIsEnumerable, Vb = (l, n, r) => n in l ? Z4(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, sf = (l, n) => {
    for (var r in n || (n = {})) F4.call(n, r) && Vb(l, r, n[r]);
    if (Xb) for (var r of Xb(n)) Q4.call(n, r) && Vb(l, r, n[r]);
    return l;
  };
  const W4 = (l, n) => {
    const r = g.useContext(lt), o = sf(sf({}, r), l);
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
  }, J4 = g.forwardRef(W4);
  var ek = J4, tk = Object.defineProperty, $b = Object.getOwnPropertySymbols, nk = Object.prototype.hasOwnProperty, lk = Object.prototype.propertyIsEnumerable, qb = (l, n, r) => n in l ? tk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, cf = (l, n) => {
    for (var r in n || (n = {})) nk.call(n, r) && qb(l, r, n[r]);
    if ($b) for (var r of $b(n)) lk.call(n, r) && qb(l, r, n[r]);
    return l;
  };
  const rk = (l, n) => {
    const r = g.useContext(lt), o = cf(cf({}, r), l);
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
  }, ak = g.forwardRef(rk);
  var ok = ak, ik = Object.defineProperty, Gb = Object.getOwnPropertySymbols, sk = Object.prototype.hasOwnProperty, ck = Object.prototype.propertyIsEnumerable, Pb = (l, n, r) => n in l ? ik(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, uf = (l, n) => {
    for (var r in n || (n = {})) sk.call(n, r) && Pb(l, r, n[r]);
    if (Gb) for (var r of Gb(n)) ck.call(n, r) && Pb(l, r, n[r]);
    return l;
  };
  const uk = (l, n) => {
    const r = g.useContext(lt), o = uf(uf({}, r), l);
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
  }, dk = g.forwardRef(uk);
  var fk = dk, hk = Object.defineProperty, Kb = Object.getOwnPropertySymbols, mk = Object.prototype.hasOwnProperty, gk = Object.prototype.propertyIsEnumerable, Zb = (l, n, r) => n in l ? hk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, df = (l, n) => {
    for (var r in n || (n = {})) mk.call(n, r) && Zb(l, r, n[r]);
    if (Kb) for (var r of Kb(n)) gk.call(n, r) && Zb(l, r, n[r]);
    return l;
  };
  const pk = (l, n) => {
    const r = g.useContext(lt), o = df(df({}, r), l);
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
  }, yk = g.forwardRef(pk);
  var bk = yk, vk = Object.defineProperty, Fb = Object.getOwnPropertySymbols, xk = Object.prototype.hasOwnProperty, wk = Object.prototype.propertyIsEnumerable, Qb = (l, n, r) => n in l ? vk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, ff = (l, n) => {
    for (var r in n || (n = {})) xk.call(n, r) && Qb(l, r, n[r]);
    if (Fb) for (var r of Fb(n)) wk.call(n, r) && Qb(l, r, n[r]);
    return l;
  };
  const Sk = (l, n) => {
    const r = g.useContext(lt), o = ff(ff({}, r), l);
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
  }, Ck = g.forwardRef(Sk);
  var Ek = Ck, _k = Object.defineProperty, Wb = Object.getOwnPropertySymbols, kk = Object.prototype.hasOwnProperty, Mk = Object.prototype.propertyIsEnumerable, Jb = (l, n, r) => n in l ? _k(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, hf = (l, n) => {
    for (var r in n || (n = {})) kk.call(n, r) && Jb(l, r, n[r]);
    if (Wb) for (var r of Wb(n)) Mk.call(n, r) && Jb(l, r, n[r]);
    return l;
  };
  const jk = (l, n) => {
    const r = g.useContext(lt), o = hf(hf({}, r), l);
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
  }, Lk = g.forwardRef(jk);
  var E1 = Lk, Rk = Object.defineProperty, ev = Object.getOwnPropertySymbols, Ak = Object.prototype.hasOwnProperty, Tk = Object.prototype.propertyIsEnumerable, tv = (l, n, r) => n in l ? Rk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, mf = (l, n) => {
    for (var r in n || (n = {})) Ak.call(n, r) && tv(l, r, n[r]);
    if (ev) for (var r of ev(n)) Tk.call(n, r) && tv(l, r, n[r]);
    return l;
  };
  const Nk = (l, n) => {
    const r = g.useContext(lt), o = mf(mf({}, r), l);
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
  }, Ok = g.forwardRef(Nk);
  var Dk = Ok, Ik = Object.defineProperty, nv = Object.getOwnPropertySymbols, zk = Object.prototype.hasOwnProperty, Hk = Object.prototype.propertyIsEnumerable, lv = (l, n, r) => n in l ? Ik(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, gf = (l, n) => {
    for (var r in n || (n = {})) zk.call(n, r) && lv(l, r, n[r]);
    if (nv) for (var r of nv(n)) Hk.call(n, r) && lv(l, r, n[r]);
    return l;
  };
  const Uk = (l, n) => {
    const r = g.useContext(lt), o = gf(gf({}, r), l);
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
  }, Yk = g.forwardRef(Uk);
  var Bk = Yk, Xk = Object.defineProperty, rv = Object.getOwnPropertySymbols, Vk = Object.prototype.hasOwnProperty, $k = Object.prototype.propertyIsEnumerable, av = (l, n, r) => n in l ? Xk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, pf = (l, n) => {
    for (var r in n || (n = {})) Vk.call(n, r) && av(l, r, n[r]);
    if (rv) for (var r of rv(n)) $k.call(n, r) && av(l, r, n[r]);
    return l;
  };
  const qk = (l, n) => {
    const r = g.useContext(lt), o = pf(pf({}, r), l);
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
  }, Gk = g.forwardRef(qk);
  var _1 = Gk, Pk = Object.defineProperty, ov = Object.getOwnPropertySymbols, Kk = Object.prototype.hasOwnProperty, Zk = Object.prototype.propertyIsEnumerable, iv = (l, n, r) => n in l ? Pk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, yf = (l, n) => {
    for (var r in n || (n = {})) Kk.call(n, r) && iv(l, r, n[r]);
    if (ov) for (var r of ov(n)) Zk.call(n, r) && iv(l, r, n[r]);
    return l;
  };
  const Fk = (l, n) => {
    const r = g.useContext(lt), o = yf(yf({}, r), l);
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
  }, Qk = g.forwardRef(Fk);
  var Wk = Qk, Jk = Object.defineProperty, sv = Object.getOwnPropertySymbols, eM = Object.prototype.hasOwnProperty, tM = Object.prototype.propertyIsEnumerable, cv = (l, n, r) => n in l ? Jk(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, bf = (l, n) => {
    for (var r in n || (n = {})) eM.call(n, r) && cv(l, r, n[r]);
    if (sv) for (var r of sv(n)) tM.call(n, r) && cv(l, r, n[r]);
    return l;
  };
  const nM = (l, n) => {
    const r = g.useContext(lt), o = bf(bf({}, r), l);
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
  }, lM = g.forwardRef(nM);
  var rM = lM, aM = Object.defineProperty, uv = Object.getOwnPropertySymbols, oM = Object.prototype.hasOwnProperty, iM = Object.prototype.propertyIsEnumerable, dv = (l, n, r) => n in l ? aM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, vf = (l, n) => {
    for (var r in n || (n = {})) oM.call(n, r) && dv(l, r, n[r]);
    if (uv) for (var r of uv(n)) iM.call(n, r) && dv(l, r, n[r]);
    return l;
  };
  const sM = (l, n) => {
    const r = g.useContext(lt), o = vf(vf({}, r), l);
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
  }, cM = g.forwardRef(sM);
  var k1 = cM, uM = Object.defineProperty, fv = Object.getOwnPropertySymbols, dM = Object.prototype.hasOwnProperty, fM = Object.prototype.propertyIsEnumerable, hv = (l, n, r) => n in l ? uM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, xf = (l, n) => {
    for (var r in n || (n = {})) dM.call(n, r) && hv(l, r, n[r]);
    if (fv) for (var r of fv(n)) fM.call(n, r) && hv(l, r, n[r]);
    return l;
  };
  const hM = (l, n) => {
    const r = g.useContext(lt), o = xf(xf({}, r), l);
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
  }, mM = g.forwardRef(hM);
  var M1 = mM, gM = Object.defineProperty, mv = Object.getOwnPropertySymbols, pM = Object.prototype.hasOwnProperty, yM = Object.prototype.propertyIsEnumerable, gv = (l, n, r) => n in l ? gM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, wf = (l, n) => {
    for (var r in n || (n = {})) pM.call(n, r) && gv(l, r, n[r]);
    if (mv) for (var r of mv(n)) yM.call(n, r) && gv(l, r, n[r]);
    return l;
  };
  const bM = (l, n) => {
    const r = g.useContext(lt), o = wf(wf({}, r), l);
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
  }, vM = g.forwardRef(bM);
  var xM = vM, wM = Object.defineProperty, pv = Object.getOwnPropertySymbols, SM = Object.prototype.hasOwnProperty, CM = Object.prototype.propertyIsEnumerable, yv = (l, n, r) => n in l ? wM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Sf = (l, n) => {
    for (var r in n || (n = {})) SM.call(n, r) && yv(l, r, n[r]);
    if (pv) for (var r of pv(n)) CM.call(n, r) && yv(l, r, n[r]);
    return l;
  };
  const EM = (l, n) => {
    const r = g.useContext(lt), o = Sf(Sf({}, r), l);
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
  }, _M = g.forwardRef(EM);
  var kM = _M, MM = Object.defineProperty, bv = Object.getOwnPropertySymbols, jM = Object.prototype.hasOwnProperty, LM = Object.prototype.propertyIsEnumerable, vv = (l, n, r) => n in l ? MM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Cf = (l, n) => {
    for (var r in n || (n = {})) jM.call(n, r) && vv(l, r, n[r]);
    if (bv) for (var r of bv(n)) LM.call(n, r) && vv(l, r, n[r]);
    return l;
  };
  const RM = (l, n) => {
    const r = g.useContext(lt), o = Cf(Cf({}, r), l);
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
  }, AM = g.forwardRef(RM);
  var TM = AM, NM = Object.defineProperty, xv = Object.getOwnPropertySymbols, OM = Object.prototype.hasOwnProperty, DM = Object.prototype.propertyIsEnumerable, wv = (l, n, r) => n in l ? NM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, Ef = (l, n) => {
    for (var r in n || (n = {})) OM.call(n, r) && wv(l, r, n[r]);
    if (xv) for (var r of xv(n)) DM.call(n, r) && wv(l, r, n[r]);
    return l;
  };
  const IM = (l, n) => {
    const r = g.useContext(lt), o = Ef(Ef({}, r), l);
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
  }, zM = g.forwardRef(IM);
  var HM = zM, UM = Object.defineProperty, Sv = Object.getOwnPropertySymbols, YM = Object.prototype.hasOwnProperty, BM = Object.prototype.propertyIsEnumerable, Cv = (l, n, r) => n in l ? UM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, _f = (l, n) => {
    for (var r in n || (n = {})) YM.call(n, r) && Cv(l, r, n[r]);
    if (Sv) for (var r of Sv(n)) BM.call(n, r) && Cv(l, r, n[r]);
    return l;
  };
  const XM = (l, n) => {
    const r = g.useContext(lt), o = _f(_f({}, r), l);
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
  }, VM = g.forwardRef(XM);
  var $M = VM, qM = Object.defineProperty, Ev = Object.getOwnPropertySymbols, GM = Object.prototype.hasOwnProperty, PM = Object.prototype.propertyIsEnumerable, _v = (l, n, r) => n in l ? qM(l, n, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: r
  }) : l[n] = r, kf = (l, n) => {
    for (var r in n || (n = {})) GM.call(n, r) && _v(l, r, n[r]);
    if (Ev) for (var r of Ev(n)) PM.call(n, r) && _v(l, r, n[r]);
    return l;
  };
  const KM = (l, n) => {
    const r = g.useContext(lt), o = kf(kf({}, r), l);
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
  }, ZM = g.forwardRef(KM);
  var mh = ZM;
  const Ys = {
    md: 768,
    lg: 1120
  };
  function j1() {
    if (typeof window > "u") return {
      isLg: true,
      isMd: false,
      isSm: false
    };
    const l = window.innerWidth;
    return {
      isLg: l >= Ys.lg,
      isMd: l >= Ys.md && l < Ys.lg,
      isSm: l < Ys.md
    };
  }
  let Bo = j1();
  const Pf = /* @__PURE__ */ new Set();
  function FM(l) {
    return Pf.add(l), () => Pf.delete(l);
  }
  function QM() {
    return Bo;
  }
  if (typeof window < "u") {
    const l = () => {
      const n = j1();
      if (n.isLg !== Bo.isLg || n.isMd !== Bo.isMd || n.isSm !== Bo.isSm) {
        Bo = n;
        for (const r of Pf) r();
      }
    };
    window.addEventListener("resize", l);
  }
  function gh() {
    return g.useSyncExternalStore(FM, QM, () => ({
      isLg: true,
      isMd: false,
      isSm: false
    }));
  }
  const WM = 8;
  function L1({ side: l, width: n, onResize: r }) {
    const [o, s] = g.useState(false), c = g.useRef(0), f = g.useRef(0), d = g.useCallback((v) => {
      const b = Math.max(Bs, Math.min(Xs, v));
      return Math.abs(b - Xo) <= WM ? Xo : Math.round(b);
    }, []), m = g.useCallback((v) => {
      if (v.button !== 0) return;
      v.preventDefault(), v.stopPropagation(), c.current = v.clientX, f.current = n, s(true), document.body.style.userSelect = "none", document.body.style.cursor = "col-resize";
      const b = (E) => {
        const k = E.clientX - c.current, w = l === "left" ? f.current + k : f.current - k;
        r(d(w));
      }, S = () => {
        document.removeEventListener("mousemove", b), document.removeEventListener("mouseup", S), document.body.style.userSelect = "", document.body.style.cursor = "", s(false);
      };
      document.addEventListener("mousemove", b), document.addEventListener("mouseup", S);
    }, [
      l,
      n,
      r,
      d
    ]), p = g.useCallback(() => {
      r(Xo);
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
  async function Kf(l) {
    const { emit: n } = await ht(async () => {
      const { emit: r } = await import("./event-BC8TvpKC.js");
      return {
        emit: r
      };
    }, __vite__mapDeps([2,1]), import.meta.url);
    await n("open-file", l);
  }
  async function Zf(l) {
    var _a;
    const n = xe.getState().library;
    if (n) try {
      let r = null;
      if (l || (r = ((_a = Ve.getState().getActiveTab()) == null ? void 0 : _a.filePath) ?? null), r || (r = await n0()), !r) return;
      !r.endsWith(".gds") && !r.endsWith(".gds2") && !r.endsWith(".gdsii") && (r += ".gds");
      const o = n.to_gds();
      await Wv(r, o), $n.getState().markClean();
      const s = Ve.getState().activeTabId;
      if (s) {
        const c = r.split(/[/\\]/).pop() ?? "untitled";
        Ve.getState().updateTab(s, {
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
  async function R1() {
    if (!$n.getState().isDirty) return true;
    if (Dn) {
      const { ask: l } = await ht(async () => {
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
  async function ph() {
    window.dispatchEvent(new CustomEvent("rosette-new-file"));
  }
  async function A1() {
    const { renderer: l } = xe.getState();
    if (!l) throw new Error("Renderer not ready");
    const n = await l.capture_screenshot(), r = new DataView(n.buffer, n.byteOffset, n.byteLength), o = r.getUint32(0, true), s = r.getUint32(4, true), c = n.slice(8), f = document.createElement("canvas");
    f.width = o, f.height = s;
    const d = f.getContext("2d");
    if (!d) throw new Error("Failed to create 2D context");
    const m = new ImageData(new Uint8ClampedArray(c.buffer, c.byteOffset, c.byteLength), o, s);
    return d.putImageData(m, 0, 0), new Promise((p, v) => {
      f.toBlob((b) => b ? p(b) : v(new Error("PNG encoding failed")), "image/png");
    });
  }
  async function JM() {
    try {
      const l = await A1();
      if (Dn) {
        let n = await l0();
        if (!n) return;
        n.endsWith(".png") || (n += ".png");
        const r = new Uint8Array(await l.arrayBuffer());
        await Jv(n, r), Dt.getState().show(`Screenshot saved to ${n.split("/").pop()}`);
      } else {
        const n = URL.createObjectURL(l), r = document.createElement("a");
        r.href = n, r.download = "screenshot.png", document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(n), Dt.getState().show("Screenshot downloaded");
      }
    } catch (l) {
      console.error("Screenshot failed:", l), Dt.getState().show(`Screenshot failed: ${l}`, "error");
    }
  }
  async function e3() {
    try {
      const l = await A1();
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
    confirmDiscardChanges: R1,
    emitOpenFile: Kf,
    handleNewFile: ph,
    handleSave: Zf,
    handleScreenshot: JM,
    handleScreenshotToClipboard: e3
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function qn({ label: l, shortcut: n, position: r = "bottom", align: o = "center", className: s, children: c }) {
    var _a;
    const f = pe((v) => v.theme) === "dark", d = B("inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border px-1 text-[11px]", f ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"), p = r === "left" || r === "right" ? B("top-1/2 -translate-y-1/2", r === "left" ? "right-full mr-3" : "left-full ml-3") : B(o === "end" ? "right-0" : "left-1/2 -translate-x-1/2", r === "bottom" ? "top-full mt-2" : "bottom-full mb-2");
    return y.jsxs("div", {
      className: B("group relative", s),
      children: [
        c,
        y.jsxs("div", {
          className: B("pointer-events-none select-none absolute z-50 flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100", p, f ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
          children: [
            y.jsx("span", {
              children: l
            }),
            n && y.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = n.modifiers) == null ? void 0 : _a.map((v) => y.jsx("kbd", {
                  className: d,
                  children: v
                }, v)),
                y.jsx("kbd", {
                  className: d,
                  children: n.key
                })
              ]
            })
          ]
        })
      ]
    });
  }
  function t3(l) {
    return "separator" in l && l.separator;
  }
  function n3(l, n, r) {
    if (!l) return n;
    const o = [];
    function s(c) {
      for (const f of c) o.push(f.name), f.children.length > 0 && r.has(f.name) && s(f.children);
    }
    return s(l), o;
  }
  function l3(l, n) {
    if (!l) return null;
    function r(o, s) {
      for (const c of o) {
        if (c.name === n) return s;
        const f = r(c.children, c.name);
        if (f !== null) return f;
      }
      return null;
    }
    return r(l, null);
  }
  function kv(l, n) {
    if (!l) return null;
    function r(o) {
      for (const s of o) {
        if (s.name === n) return s;
        const c = r(s.children);
        if (c) return c;
      }
      return null;
    }
    return r(l);
  }
  function Mv(l, n, r, o) {
    const s = [];
    if (l.length > 1) for (const f of l) s.push({
      type: "tab",
      id: f.id
    });
    const c = n3(n, r, o);
    for (const f of c) s.push({
      type: "cell",
      name: f
    });
    return s;
  }
  function T1(l, n) {
    return l === null || n === null ? l === n : l.type !== n.type ? false : l.type === "tab" && n.type === "tab" ? l.id === n.id : l.type === "cell" && n.type === "cell" ? l.name === n.name : false;
  }
  function r3(l, n) {
    return n ? l.findIndex((r) => T1(r, n)) : -1;
  }
  function a3({ expanded: l, isDark: n }) {
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
  function o3({ items: l, isDark: n, onAction: r }) {
    const o = g.useRef(null), [s, c] = g.useState(false);
    return g.useLayoutEffect(() => {
      o.current && o.current.getBoundingClientRect().right > window.innerWidth - 8 && c(true);
    }, []), y.jsx("div", {
      ref: o,
      className: B("absolute -top-1 z-50 ml-1 min-w-[170px] rounded-xl border py-1", s ? "right-full mr-1" : "left-full", n ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
      children: l.map((f) => {
        var _a;
        return t3(f) ? y.jsx("div", {
          className: B("my-1 h-px", n ? "bg-white/10" : "bg-black/10")
        }, f.id) : y.jsxs("button", {
          className: B("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors", f.disabled ? "opacity-40" : n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
          disabled: f.disabled,
          onClick: () => {
            f.disabled || (Promise.resolve(f.action()).catch((d) => console.error("Menu action failed:", d)), r());
          },
          children: [
            y.jsx("span", {
              children: f.label
            }),
            f.shortcut && y.jsxs("span", {
              className: "flex gap-0.5",
              children: [
                (_a = f.shortcut.modifiers) == null ? void 0 : _a.map((d) => y.jsx("kbd", {
                  className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: d
                }, d)),
                y.jsx("kbd", {
                  className: B("inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]", n ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10"),
                  children: f.shortcut.key
                })
              ]
            })
          ]
        }, f.id);
      })
    });
  }
  function i3({ isDark: l }) {
    const [n, r] = g.useState(false), [o, s] = g.useState(null), c = g.useRef(null);
    Ya("explorer-menu", n);
    const f = g.useCallback(() => {
      r(false), s(null);
    }, []);
    g.useEffect(() => {
      if (!n) return;
      const m = (p) => {
        c.current && !c.current.contains(p.target) && f();
      };
      return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
    }, [
      n,
      f
    ]), g.useEffect(() => {
      if (!n) return;
      const m = (p) => {
        p.key === "Escape" && (p.preventDefault(), f());
      };
      return document.addEventListener("keydown", m), () => document.removeEventListener("keydown", m);
    }, [
      n,
      f
    ]);
    const d = [
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
              await ph();
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
              const { pickGdsFile: m } = await ht(async () => {
                const { pickGdsFile: b } = await Promise.resolve().then(() => i0);
                return {
                  pickGdsFile: b
                };
              }, void 0, import.meta.url), { emitOpenFile: p } = await ht(async () => {
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
              const { handleSave: m } = await ht(async () => {
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
              const { handleSave: m } = await ht(async () => {
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
              const { handleScreenshot: m } = await ht(async () => {
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
              const { handleScreenshotToClipboard: m } = await ht(async () => {
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
          const { library: m, renderer: p } = xe.getState(), { canUndo: v, canRedo: b } = de.getState(), { selectedIds: S } = oe.getState(), { hasContent: E } = zn.getState(), { selectedRulerIds: k } = Ne.getState(), w = S.size > 0, C = k.size > 0, _ = m ? m.get_all_ids().length > 0 : false;
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
                const T = oe.getState().selectedIds, A = mr(m, T);
                zn.getState().copy(A);
              },
              disabled: !w
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
                const T = new cc();
                de.getState().execute(T, {
                  library: m,
                  renderer: p
                });
                const A = document.querySelector("canvas");
                A && Ur(m, A);
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
                const T = oe.getState().selectedIds;
                if (T.size === 0) return;
                const A = new uc([
                  ...T
                ]);
                de.getState().execute(A, {
                  library: m,
                  renderer: p
                });
                const j = document.querySelector("canvas");
                j && Ur(m, j);
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
                key: Ie.backspace
              },
              action: () => {
                if (!m || !p) return;
                const T = Ne.getState().selectedRulerIds;
                if (T.size > 0) {
                  const U = new th([
                    ...T
                  ]);
                  de.getState().execute(U, {
                    library: m,
                    renderer: p
                  });
                  return;
                }
                const A = oe.getState().selectedIds;
                if (A.size === 0) return;
                const j = new sc([
                  ...A
                ]);
                de.getState().execute(j, {
                  library: m,
                  renderer: p
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
                  Ie.mod
                ],
                key: "A"
              },
              action: () => {
                if (!m) return;
                const T = m.get_all_ids();
                oe.getState().selectAll(T);
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
          const { library: m } = xe.getState(), { selectedIds: p } = oe.getState(), v = p.size > 0;
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
                const S = b.getBoundingClientRect();
                ze.getState().zoomAt(lc, S.width / 2, S.height / 2);
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
                const S = b.getBoundingClientRect();
                ze.getState().zoomAt(rc, S.width / 2, S.height / 2);
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
                const S = m.get_all_bounds(), E = S ? {
                  minX: S[0],
                  minY: S[1],
                  maxX: S[2],
                  maxY: S[3]
                } : null, k = ol(b);
                ze.getState().zoomToFit(E, k.width, k.height, k.screenCenter);
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
                const S = oe.getState().selectedIds;
                if (S.size === 0) return;
                const E = m.get_bounds_for_ids([
                  ...S
                ]), k = E ? {
                  minX: E[0],
                  minY: E[1],
                  maxX: E[2],
                  maxY: E[3]
                } : null, w = ol(b);
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
          const { themeSetting: m, showGrid: p } = pe.getState();
          return [
            {
              id: "theme-light",
              label: `${m === "light" ? "\u2713  " : "     "}Light`,
              action: () => pe.getState().setThemeSetting("light"),
              disabled: false
            },
            {
              id: "theme-dark",
              label: `${m === "dark" ? "\u2713  " : "     "}Dark`,
              action: () => pe.getState().setThemeSetting("dark"),
              disabled: false
            },
            {
              id: "theme-system",
              label: `${m === "system" ? "\u2713  " : "     "}System`,
              action: () => pe.getState().setThemeSetting("system"),
              disabled: false
            },
            {
              id: "sep-prefs-1",
              separator: true
            },
            {
              id: "show-grid",
              label: `${p ? "\u2713  " : "     "}Show Grid`,
              action: () => pe.getState().toggleGrid(),
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
          className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
          children: y.jsx("div", {
            className: "flex h-4 w-4 items-center justify-center",
            children: y.jsx(fk, {
              className: B("h-4 w-4", l ? "text-white/60" : "text-black/60")
            })
          })
        }),
        n && y.jsx("div", {
          className: B("absolute top-full right-0 z-50 mt-1 min-w-[140px] rounded-xl border py-1", l ? "border-white/10 bg-[rgb(29,29,29)] text-white/90" : "border-black/10 bg-[rgb(241,241,241)] text-black/90"),
          children: d.map((m) => y.jsxs("div", {
            className: "relative",
            children: [
              y.jsxs("button", {
                type: "button",
                className: B("mx-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", o === m.id && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
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
              o === m.id && y.jsx(o3, {
                items: m.buildItems(),
                isDark: l,
                onAction: f
              })
            ]
          }, m.id))
        })
      ]
    });
  }
  function N1({ name: l, isActive: n, isFocused: r, isDark: o, depth: s, hasChildren: c, isExpanded: f, isHidden: d, onToggleExpand: m, onSelect: p, onRename: v, startEditing: b, canDrag: S }) {
    const [E, k] = g.useState(false), [w, C] = g.useState(l), _ = g.useRef(null), T = g.useRef(null);
    g.useEffect(() => {
      r && T.current && T.current.scrollIntoView({
        block: "nearest"
      });
    }, [
      r
    ]), g.useEffect(() => {
      b && (k(true), C(l), he.getState().setEditingCellName(null));
    }, [
      b,
      l
    ]), g.useEffect(() => {
      E && _.current && (_.current.focus(), _.current.select());
    }, [
      E
    ]);
    const A = g.useCallback(() => {
      const O = w.trim();
      O && O !== l ? v(O) : C(l), k(false);
    }, [
      w,
      l,
      v
    ]), j = g.useCallback((O) => {
      O.key === "Enter" ? A() : O.key === "Escape" && (C(l), k(false));
    }, [
      A,
      l
    ]), U = g.useCallback((O) => {
      O.preventDefault(), O.stopPropagation(), ac.getState().open("cell", {
        x: O.clientX,
        y: O.clientY
      }, l);
    }, [
      l
    ]), N = g.useCallback((O) => {
      O.stopPropagation(), m();
    }, [
      m
    ]), R = g.useCallback((O) => {
      if (O.button !== 0 || !S || E) {
        S || O.preventDefault();
        return;
      }
      const H = {
        x: O.clientX,
        y: O.clientY
      };
      let G = false;
      const te = (fe) => {
        const me = fe.clientX - H.x, Ee = fe.clientY - H.y;
        if (!(!G && me * me + Ee * Ee < 25) && !G) {
          G = true;
          const { library: q } = xe.getState();
          if (!q) return;
          const F = q.get_cell_bounds(l) ?? null, ce = q.get_cell_origin_by_name(l), _e = {
            x: ce ? ce[0] : 0,
            y: ce ? ce[1] : 0
          };
          $s.getState().startDrag(l, F, _e);
        }
      }, ee = () => {
        document.removeEventListener("mousemove", te), document.removeEventListener("mouseup", ee);
      };
      document.addEventListener("mousemove", te), document.addEventListener("mouseup", ee);
    }, [
      S,
      E,
      l
    ]);
    return y.jsxs("button", {
      ref: T,
      type: "button",
      className: B("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center rounded-lg py-1.5 text-left transition-colors focus:outline-none", n ? o ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? o ? "bg-[rgb(44,44,44)] text-white/90" : "bg-[rgb(227,227,227)] text-black/90" : o ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90", r && (o ? "ring-1 ring-white/25" : "ring-1 ring-black/20")),
      style: {
        paddingLeft: `${7 + s * 10}px`,
        paddingRight: "7px"
      },
      onClick: p,
      onContextMenu: U,
      onMouseDown: R,
      tabIndex: -1,
      children: [
        c ? y.jsx("button", {
          type: "button",
          className: "mr-0.5 flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center bg-transparent border-none p-0",
          onClick: N,
          children: y.jsx(a3, {
            expanded: f,
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
            value: w,
            onChange: (O) => C(O.target.value),
            onBlur: A,
            onKeyDown: j,
            onClick: (O) => O.stopPropagation(),
            className: B("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", o ? "text-white/90" : "text-black/90")
          }) : y.jsx("span", {
            className: B("absolute inset-0 truncate text-sm leading-5 select-none", d && "opacity-40"),
            onDoubleClick: (O) => {
              O.stopPropagation(), k(true), C(l);
            },
            children: l
          })
        })
      ]
    });
  }
  function O1({ node: l, depth: n, isDark: r, activeCell: o, focusedCellName: s, editingCellName: c, expandedCells: f, hiddenCells: d, onSelect: m, onRename: p, onToggleExpand: v }) {
    const b = l.children.length > 0, S = f.has(l.name), E = l.name !== o;
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(N1, {
          name: l.name,
          isActive: l.name === o,
          isFocused: l.name === s,
          isDark: r,
          depth: n,
          hasChildren: b,
          isExpanded: S,
          isHidden: d.has(l.name),
          onToggleExpand: () => v(l.name),
          onSelect: () => m(l.name),
          onRename: (k) => p(l.name, k),
          startEditing: c === l.name,
          canDrag: E
        }),
        b && S && l.children.map((k) => y.jsx(O1, {
          node: k,
          depth: n + 1,
          isDark: r,
          activeCell: o,
          focusedCellName: s,
          editingCellName: c,
          expandedCells: f,
          hiddenCells: d,
          onSelect: m,
          onRename: p,
          onToggleExpand: v
        }, `${l.name}/${k.name}`))
      ]
    });
  }
  function s3({ tab: l, isActive: n, isFocused: r, isDark: o, onSelect: s, onClose: c, onMiddleClick: f }) {
    const d = g.useRef(null);
    return g.useEffect(() => {
      r && d.current && d.current.scrollIntoView({
        block: "nearest"
      });
    }, [
      r
    ]), y.jsxs("div", {
      ref: d,
      role: "tab",
      tabIndex: 0,
      "aria-selected": n,
      className: B("group mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-1.5 rounded-lg py-1.5 pr-1 pl-2 transition-colors", n ? o ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? o ? "bg-[rgb(44,44,44)] text-white/90" : "bg-[rgb(227,227,227)] text-black/90" : o ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90", r && (o ? "ring-1 ring-white/25" : "ring-1 ring-black/20")),
      onClick: s,
      onKeyDown: (m) => {
        (m.key === "Enter" || m.key === " ") && (m.preventDefault(), s());
      },
      onMouseDown: f,
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
  function c3({ isDark: l, focusedItem: n }) {
    const r = Ve((d) => d.tabs), o = Ve((d) => d.activeTabId), s = g.useCallback((d) => {
      d !== o && (Hr(o, d), Ve.getState().setActiveTab(d));
    }, [
      o
    ]), c = g.useCallback(async (d, m) => {
      d.stopPropagation(), window.dispatchEvent(new CustomEvent("rosette-close-tab", {
        detail: m
      }));
    }, []), f = g.useCallback((d, m) => {
      d.button === 1 && (d.preventDefault(), window.dispatchEvent(new CustomEvent("rosette-close-tab", {
        detail: m
      })));
    }, []);
    return r.length <= 1 ? null : y.jsxs(y.Fragment, {
      children: [
        y.jsx("div", {
          className: "flex flex-col gap-0.5 py-1",
          children: r.map((d) => y.jsx(s3, {
            tab: d,
            isActive: d.id === o,
            isFocused: (n == null ? void 0 : n.type) === "tab" && n.id === d.id,
            isDark: l,
            onSelect: () => s(d.id),
            onClose: (m) => c(m, d.id),
            onMiddleClick: (m) => f(m, d.id)
          }, d.id))
        }),
        y.jsx("div", {
          className: B("h-px", l ? "bg-white/10" : "bg-black/10")
        })
      ]
    });
  }
  function u3({ isDark: l, onExpand: n }) {
    const r = Ve((o) => o.tabs.length);
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
            r > 1 && y.jsx("span", {
              className: B("absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-0.5 text-[9px] font-medium leading-none", l ? "bg-white/20 text-white/80" : "bg-black/20 text-black/80"),
              children: r
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
          children: y.jsx(E1, {
            className: B("h-4 w-4", l ? "text-white/60" : "text-black/60")
          })
        })
      ]
    });
  }
  function jv() {
    const n = pe((X) => X.theme) === "dark", r = pe((X) => X.explorerCollapsed), o = pe((X) => X.toggleExplorerCollapsed), s = pe((X) => X.explorerWidth), c = pe((X) => X.setExplorerWidth), { isSm: f } = gh(), { handleProps: d } = L1({
      side: "left",
      width: s,
      onResize: c
    }), m = he((X) => X.projectName), p = he((X) => X.setProjectName), v = he((X) => X.cells), b = he((X) => X.cellTree), S = he((X) => X.activeCell), E = he((X) => X.setActiveCell), k = he((X) => X.editingCellName), w = he((X) => X.expandedCells), C = he((X) => X.toggleExpanded), _ = he((X) => X.cellsLoaded), T = he((X) => X.hierarchyLevelLimit), A = he((X) => X.setHierarchyLevelLimit), j = he((X) => X.maxTreeDepth), U = he((X) => X.hiddenCells), N = he((X) => X.isFocused), R = he((X) => X.focusedItem), O = he((X) => X.setFocused), H = he((X) => X.setFocusedItem);
    Ya("explorer-panel", N);
    const [G, te] = g.useState(false), ee = g.useRef(null);
    g.useEffect(() => {
      if (!f || !G) return;
      const X = (ue) => {
        ee.current && !ee.current.contains(ue.target) && te(false);
      };
      return document.addEventListener("mousedown", X), () => document.removeEventListener("mousedown", X);
    }, [
      f,
      G
    ]);
    const fe = (X, ue) => X === 1 / 0 ? ue > 0 ? ue.toString() : "" : X.toString(), [me, Ee] = g.useState(fe(T, j));
    g.useEffect(() => {
      Ee(fe(T, j));
    }, [
      T,
      j
    ]);
    const [q, F] = g.useState(false), [ce, _e] = g.useState(m), be = g.useRef(null);
    g.useEffect(() => {
      q && be.current && (be.current.focus(), be.current.select());
    }, [
      q
    ]);
    const L = g.useCallback(() => {
      const X = ce.trim();
      X && X !== m ? p(X) : _e(m), F(false);
    }, [
      ce,
      m,
      p
    ]), D = g.useCallback((X) => {
      X.key === "Enter" ? L() : X.key === "Escape" && (_e(m), F(false));
    }, [
      L,
      m
    ]), $ = g.useCallback((X, ue) => {
      const { library: I, renderer: se } = xe.getState();
      if (I && se) {
        const ge = new S0(X, ue);
        de.getState().execute(ge, {
          library: I,
          renderer: se
        });
      } else he.getState().renameCell(X, ue);
    }, []), J = g.useCallback((X) => {
      X === S && v.length <= 1 || E(X === S ? null : X);
    }, [
      S,
      v.length,
      E
    ]);
    g.useEffect(() => {
      if (!N) return;
      const X = (ue) => {
        ee.current && !ee.current.contains(ue.target) && O(false);
      };
      return document.addEventListener("mousedown", X), () => document.removeEventListener("mousedown", X);
    }, [
      N,
      O
    ]), g.useEffect(() => {
      if (!N) return;
      const X = (ue) => {
        if (ue.target instanceof HTMLInputElement || ue.target instanceof HTMLTextAreaElement) return;
        const { focusedItem: I, cellTree: se, cells: ge, expandedCells: ve, activeCell: Le, editingCellName: Me } = he.getState();
        if (Me) return;
        const $e = Ve.getState().tabs, Ze = Mv($e, se, ge, ve);
        if (Ze.length === 0) return;
        const we = r3(Ze, I);
        switch (ue.key) {
          case "ArrowDown": {
            ue.preventDefault();
            const je = we < Ze.length - 1 ? we + 1 : 0;
            H(Ze[je]);
            break;
          }
          case "ArrowUp": {
            ue.preventDefault();
            const je = we > 0 ? we - 1 : Ze.length - 1;
            H(Ze[je]);
            break;
          }
          case "ArrowRight": {
            if (ue.preventDefault(), (I == null ? void 0 : I.type) === "cell" && se) {
              const je = kv(se, I.name);
              je && je.children.length > 0 && !ve.has(I.name) ? C(I.name) : je && je.children.length > 0 && ve.has(I.name) && H({
                type: "cell",
                name: je.children[0].name
              });
            }
            break;
          }
          case "ArrowLeft": {
            if (ue.preventDefault(), (I == null ? void 0 : I.type) === "cell" && se) {
              const je = kv(se, I.name);
              if (je && je.children.length > 0 && ve.has(I.name)) C(I.name);
              else {
                const Ae = l3(se, I.name);
                Ae && H({
                  type: "cell",
                  name: Ae
                });
              }
            }
            break;
          }
          case " ": {
            if (ue.preventDefault(), !I) break;
            if (I.type === "tab") {
              const je = Ve.getState().activeTabId;
              I.id !== je && (Hr(je, I.id), Ve.getState().setActiveTab(I.id));
            } else I.name === Le ? ge.length > 1 && E(null) : E(I.name);
            break;
          }
          case "Enter": {
            ue.preventDefault(), (I == null ? void 0 : I.type) === "cell" && he.getState().setEditingCellName(I.name);
            break;
          }
          case "Delete":
          case "Backspace": {
            if (ue.preventDefault(), !I) break;
            if (I.type === "tab") {
              const je = we;
              window.dispatchEvent(new CustomEvent("rosette-close-tab", {
                detail: I.id
              })), setTimeout(() => {
                const Ae = he.getState(), et = Ve.getState().tabs, Fe = Mv(et, Ae.cellTree, Ae.cells, Ae.expandedCells);
                if (Fe.length === 0) H(null);
                else {
                  const Ut = Math.min(je, Fe.length - 1);
                  H(Fe[Ut]);
                }
              }, 0);
            } else if (ge.length > 1) {
              const { library: je, renderer: Ae } = xe.getState();
              if (je && Ae) {
                const et = we < Ze.length - 1 ? we + 1 : we - 1, Fe = et >= 0 ? Ze[et] : null, Ut = new lh(I.name);
                de.getState().execute(Ut, {
                  library: je,
                  renderer: Ae
                }), Fe && !T1(Fe, I) && H(Fe);
              }
            }
            break;
          }
          case "z":
          case "Z": {
            if (!(ue.metaKey || ue.ctrlKey)) return;
            ue.preventDefault();
            const { library: Ae, renderer: et } = xe.getState();
            if (!Ae || !et) break;
            ue.shiftKey ? de.getState().redo({
              library: Ae,
              renderer: et
            }) : de.getState().undo({
              library: Ae,
              renderer: et
            });
            break;
          }
          case "Escape": {
            ue.preventDefault(), O(false);
            break;
          }
          default:
            return;
        }
      };
      return document.addEventListener("keydown", X), () => document.removeEventListener("keydown", X);
    }, [
      N,
      O,
      H,
      E,
      C
    ]);
    const W = g.useCallback(() => {
      f ? te(true) : o();
    }, [
      f,
      o
    ]);
    if (r && !(f && G)) return y.jsx(u3, {
      isDark: n,
      onExpand: W
    });
    const ie = f && G;
    return y.jsxs(y.Fragment, {
      children: [
        ie && y.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        y.jsxs("div", {
          ref: ee,
          className: B("fixed top-4 left-4 z-40 rounded-xl border transition-opacity duration-200", _ ? "opacity-100" : "pointer-events-none opacity-0", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", ie && "shadow-xl"),
          style: {
            width: s
          },
          children: [
            y.jsx("div", {
              ...d
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
                  children: q ? y.jsx("input", {
                    ref: be,
                    type: "text",
                    value: ce,
                    onChange: (X) => _e(X.target.value),
                    onBlur: L,
                    onKeyDown: D,
                    onClick: (X) => X.stopPropagation(),
                    className: B("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-xs font-medium leading-5 outline-none focus:ring-0", n ? "text-white/90" : "text-black/90")
                  }) : y.jsx("button", {
                    type: "button",
                    className: B("absolute inset-0 cursor-text truncate border-0 bg-transparent p-0 text-left text-xs font-medium leading-5 select-none focus:outline-none", n ? "text-white/60" : "text-black/60"),
                    onClick: () => {
                      _e(m), F(true);
                    },
                    children: m
                  })
                }),
                !f && y.jsx("button", {
                  type: "button",
                  onClick: o,
                  className: B("flex-shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: y.jsx(Ek, {
                    className: B("h-4 w-4", n ? "text-white/60" : "text-black/60")
                  })
                }),
                y.jsx(i3, {
                  isDark: n
                })
              ]
            }),
            y.jsx("div", {
              className: B("h-px", n ? "bg-white/10" : "bg-black/10")
            }),
            y.jsx(c3, {
              isDark: n,
              focusedItem: N ? R : null
            }),
            y.jsx("div", {
              className: "flex flex-col gap-0.5 overflow-y-auto py-1",
              style: {
                maxHeight: "calc(100vh - 176px)"
              },
              onWheel: (X) => X.stopPropagation(),
              children: b ? b.map((X) => y.jsx(O1, {
                node: X,
                depth: 0,
                isDark: n,
                activeCell: S,
                focusedCellName: N && (R == null ? void 0 : R.type) === "cell" ? R.name : null,
                editingCellName: k,
                expandedCells: w,
                hiddenCells: U,
                onSelect: J,
                onRename: $,
                onToggleExpand: C
              }, X.name)) : v.map((X) => y.jsx(N1, {
                name: X,
                isActive: X === S,
                isFocused: N && (R == null ? void 0 : R.type) === "cell" && R.name === X,
                isDark: n,
                depth: 0,
                hasChildren: false,
                isExpanded: false,
                isHidden: U.has(X),
                onToggleExpand: () => {
                },
                onSelect: () => J(X),
                onRename: (ue) => $(X, ue),
                startEditing: k === X,
                canDrag: X !== S
              }, X))
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
                      max: j,
                      value: me,
                      onChange: (X) => {
                        const ue = X.target.value;
                        Ee(ue);
                        const I = parseInt(ue, 10);
                        !isNaN(I) && I >= 1 && A(I);
                      },
                      onBlur: () => {
                        const X = parseInt(me, 10) || j, ue = Math.max(1, Math.min(X, j));
                        A(ue), Ee(ue.toString());
                      },
                      onKeyDown: (X) => {
                        if (X.key === "Enter") {
                          const ue = parseInt(me, 10) || j, I = Math.max(1, Math.min(ue, j));
                          A(I), Ee(I.toString()), X.currentTarget.blur();
                        } else X.key === "Escape" && X.currentTarget.blur();
                      },
                      className: B("h-6 w-12 rounded-lg border px-2 text-xs tabular-nums outline-none", n ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
                    }),
                    y.jsx(qn, {
                      label: "All levels",
                      position: "bottom",
                      children: y.jsx("button", {
                        type: "button",
                        onClick: () => A(1 / 0),
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
  function d3(l, n) {
    if (l.length < 4) return null;
    let r = l[0], o = l[1], s = l[2], c = l[3];
    if (!Number.isFinite(r) || !Number.isFinite(o) || !Number.isFinite(s) || !Number.isFinite(c)) return null;
    const f = Math.max((s - r) * 0.05, (c - o) * 0.05, 1);
    r -= f, o -= f, s += f, c += f;
    const d = s - r, m = c - o, p = n / d, v = n / m, b = Math.min(p, v), S = d * b, E = m * b, k = (n - S) / 2, w = (n - E) / 2;
    return {
      minX: r,
      minY: o,
      maxX: s,
      maxY: c,
      width: d,
      height: m,
      scale: b,
      offsetX: k,
      offsetY: w
    };
  }
  function nc(l, n, r) {
    return {
      x: (l - r.minX) * r.scale + r.offsetX,
      y: (n - r.minY) * r.scale + r.offsetY
    };
  }
  function f3(l, n, r) {
    return {
      x: r.minX + (l - r.offsetX) / r.scale,
      y: r.minY + (n - r.offsetY) / r.scale
    };
  }
  function h3(l, n, r) {
    for (const [, o, s] of r) {
      if (o.length < 3) continue;
      const c = Math.round(s[0] * 255), f = Math.round(s[1] * 255), d = Math.round(s[2] * 255), m = s[3];
      l.fillStyle = `rgba(${c},${f},${d},${m})`, l.beginPath();
      const p = nc(o[0][0], o[0][1], n);
      l.moveTo(p.x, p.y);
      for (let v = 1; v < o.length; v++) {
        const b = nc(o[v][0], o[v][1], n);
        l.lineTo(b.x, b.y);
      }
      l.closePath(), l.fill();
    }
  }
  function m3(l, n, r, o, s, c, f) {
    const d = -r.x / o, m = -r.y / o, p = d + s / o, v = m + c / o, b = nc(d, m, n), S = nc(p, v, n), E = b.x, k = b.y, w = S.x - b.x, C = S.y - b.y;
    l.strokeStyle = f.viewportStroke, l.lineWidth = 1.5, l.setLineDash([
      3,
      3
    ]), l.strokeRect(E, k, w, C), l.fillStyle = f.viewportFill, l.fillRect(E, k, w, C), l.setLineDash([]);
  }
  function g3(l) {
    return {
      canvasBg: l ? "rgb(29,29,29)" : "rgb(241,241,241)",
      viewportStroke: l ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
      viewportFill: l ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    };
  }
  const Xn = 180;
  function Lv() {
    const l = g.useRef(null), n = g.useRef(null), r = g.useRef(null), o = g.useRef(null), [s, c] = g.useState(false), f = ze((R) => R.zoom), d = ze((R) => R.offset), m = pe((R) => R.theme), p = xe((R) => R.library), v = ye((R) => R.layers), b = Wo((R) => R.isMinimized), S = de((R) => R.undoStack.length), E = de((R) => R.redoStack.length), k = m === "dark", w = g.useMemo(() => g3(k), [
      k
    ]);
    g.useEffect(() => {
      const R = l.current;
      if (!R) return;
      const O = (H) => {
        const G = document.getElementById("rosette-canvas");
        G && (H.preventDefault(), G.dispatchEvent(new WheelEvent("wheel", H)));
      };
      return R.addEventListener("wheel", O, {
        passive: false
      }), () => R.removeEventListener("wheel", O);
    }, []);
    const C = g.useCallback(() => {
      var _a;
      return ((_a = document.getElementById("rosette-canvas")) == null ? void 0 : _a.getBoundingClientRect()) ?? null;
    }, []), _ = g.useCallback((R) => {
      var _a;
      const O = o.current;
      if (!O) return;
      const H = (_a = n.current) == null ? void 0 : _a.getBoundingClientRect();
      if (!H) return;
      const G = R.clientX - H.left, te = R.clientY - H.top, ee = f3(G, te, O), fe = C();
      if (!fe) return;
      const me = -(ee.x * f) + fe.width / 2, Ee = -(ee.y * f) + fe.height / 2;
      ze.getState().setOffset(me, Ee);
    }, [
      f,
      C
    ]), T = g.useCallback((R) => {
      R.stopPropagation(), c(true), _(R);
    }, [
      _
    ]), A = g.useCallback((R) => {
      s && _(R);
    }, [
      s,
      _
    ]), j = g.useCallback(() => {
      c(false);
    }, []), U = g.useCallback(() => {
      c(false);
    }, []);
    if (g.useEffect(() => {
      if (b || !p) return;
      const R = p.get_all_bounds();
      if (!R) {
        o.current = null, r.current = null;
        return;
      }
      const O = d3(R, Xn);
      if (!O) {
        o.current = null, r.current = null;
        return;
      }
      o.current = O;
      let H;
      try {
        H = p.get_render_polygons();
      } catch {
        r.current = null;
        return;
      }
      if (!H || H.length === 0) {
        r.current = null;
        return;
      }
      const G = /* @__PURE__ */ new Set();
      for (const [, me] of v) me.visible || G.add(`${me.layerNumber}:${me.datatype}`);
      let te = H;
      G.size > 0 && (te = H.filter(([me]) => {
        const Ee = p.get_element_info(me);
        if (!Ee) return true;
        const q = `${Ee.layer}:${Ee.datatype}`, F = G.has(q);
        return Ee.free(), !F;
      }));
      const ee = document.createElement("canvas");
      ee.width = Xn, ee.height = Xn;
      const fe = ee.getContext("2d");
      fe && (fe.clearRect(0, 0, Xn, Xn), h3(fe, O, te), r.current = ee);
    }, [
      p,
      v,
      b,
      S,
      E
    ]), g.useEffect(() => {
      if (b) return;
      const R = n.current;
      if (!R) return;
      const O = R.getContext("2d");
      if (!O) return;
      const H = o.current;
      if (O.clearRect(0, 0, Xn, Xn), O.fillStyle = w.canvasBg, O.fillRect(0, 0, Xn, Xn), r.current && O.drawImage(r.current, 0, 0), H) {
        const G = C();
        G && G.width > 0 && G.height > 0 && m3(O, H, d, f, G.width, G.height, w);
      }
    }, [
      f,
      d,
      b,
      w,
      C,
      S,
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
          onMouseDown: T,
          onMouseMove: A,
          onMouseUp: j,
          onMouseLeave: U
        })
      })
    });
  }
  const p3 = $o, y3 = [
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
  function b3({ pattern: l, className: n }) {
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
  function v3({ color: l, isDark: n, onChange: r, hexTabIdx: o }) {
    const [s, c] = g.useState(l), f = g.useRef(null);
    g.useEffect(() => {
      c(l);
    }, [
      l
    ]);
    const d = g.useCallback(() => {
      const p = s.trim().replace(/^#?/, "#");
      /^#[0-9a-fA-F]{6}$/.test(p) ? r(p.toLowerCase()) : c(l);
    }, [
      s,
      l,
      r
    ]), m = g.useCallback((p) => {
      var _a, _b2;
      p.key === "Enter" ? (p.preventDefault(), (_a = f.current) == null ? void 0 : _a.blur()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), c(l), (_b2 = f.current) == null ? void 0 : _b2.blur());
    }, [
      l
    ]);
    return y.jsxs("div", {
      className: "flex flex-col gap-1.5",
      children: [
        y.jsx("div", {
          className: "grid grid-cols-8 gap-1",
          children: p3.map((p) => y.jsx("button", {
            type: "button",
            onClick: (v) => {
              v.stopPropagation(), r(p);
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
              ref: f,
              type: "text",
              value: s,
              "data-tab-index": o,
              onChange: (p) => c(p.target.value),
              onBlur: d,
              onKeyDown: m,
              onClick: (p) => p.stopPropagation(),
              tabIndex: -1,
              className: B("h-6 min-w-0 flex-1 rounded border px-1.5 font-mono text-xs outline-none", n ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
            })
          ]
        })
      ]
    });
  }
  function x3({ value: l, isDark: n, onChange: r, baseTabIdx: o }) {
    return y.jsx("div", {
      className: "grid grid-cols-4 gap-1",
      children: y3.map((s, c) => {
        const f = l === s.id;
        return y.jsx("button", {
          type: "button",
          "data-tab-index": o != null ? o + c : void 0,
          onClick: (d) => {
            d.stopPropagation(), r(s.id);
          },
          className: B("flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1 text-[10px] outline-none transition-colors", f ? n ? "border-white/20 bg-white/10 text-white/90" : "border-black/20 bg-black/10 text-black/90" : n ? "border-white/5 text-white/40 hover:border-white/15 hover:text-white/70 focus:border-white/15 focus:text-white/70" : "border-black/5 text-black/40 hover:border-black/15 hover:text-black/70 focus:border-black/15 focus:text-black/70"),
          tabIndex: -1,
          children: y.jsx(b3, {
            pattern: s.id
          })
        }, s.id);
      })
    });
  }
  function Rv({ label: l, value: n, isDark: r, onChange: o, tabIdx: s }) {
    const [c, f] = g.useState(String(n)), [d, m] = g.useState(false), p = g.useRef(null);
    g.useEffect(() => {
      d || f(String(n));
    }, [
      n,
      d
    ]);
    const v = g.useCallback(() => {
      const b = Number.parseInt(c, 10);
      !Number.isNaN(b) && b >= 0 && b <= Tf && b !== n ? o(b) : f(String(n));
    }, [
      c,
      n,
      o
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between",
      children: [
        y.jsx("span", {
          className: B("text-xs select-none", r ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsx("input", {
          ref: p,
          type: "text",
          value: c,
          "data-tab-index": s,
          onChange: (b) => f(b.target.value),
          onFocus: (b) => {
            m(true), b.target.select();
          },
          onBlur: () => {
            m(false), v();
          },
          onKeyDown: (b) => {
            var _a, _b2;
            b.key === "Enter" ? (b.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), f(String(n)), (_b2 = p.current) == null ? void 0 : _b2.blur());
          },
          onClick: (b) => b.stopPropagation(),
          tabIndex: -1,
          className: B("w-16 cursor-text rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors", d ? r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : r ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function w3({ label: l, value: n, isDark: r, onChange: o, tabIdx: s }) {
    const [c, f] = g.useState(n), [d, m] = g.useState(false), p = g.useRef(null);
    g.useEffect(() => {
      d || f(n);
    }, [
      n,
      d
    ]);
    const v = g.useCallback(() => {
      const b = c.trim();
      b && b !== n ? o(b) : f(n);
    }, [
      c,
      n,
      o
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between",
      children: [
        y.jsx("span", {
          className: B("text-xs select-none", r ? "text-white/50" : "text-black/50"),
          children: l
        }),
        y.jsx("input", {
          ref: p,
          type: "text",
          value: c,
          "data-tab-index": s,
          onChange: (b) => f(b.target.value),
          onFocus: (b) => {
            m(true), b.target.select();
          },
          onBlur: () => {
            m(false), v();
          },
          onKeyDown: (b) => {
            var _a, _b2;
            b.key === "Enter" ? (b.preventDefault(), (_a = p.current) == null ? void 0 : _a.blur()) : b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), f(n), (_b2 = p.current) == null ? void 0 : _b2.blur());
          },
          onClick: (b) => b.stopPropagation(),
          tabIndex: -1,
          className: B("w-28 cursor-text truncate rounded border px-1.5 py-0.5 text-right text-xs outline-none transition-colors", d ? r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90" : r ? "border-transparent text-white/90 hover:bg-white/5" : "border-transparent text-black/90 hover:bg-black/5")
        })
      ]
    });
  }
  function Mf({ label: l, isDark: n }) {
    return y.jsx("span", {
      className: B("text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function S3({ layer: l, isDark: n }) {
    const r = xe((d) => d.library), o = xe((d) => d.renderer), s = g.useRef(null), c = g.useCallback((d) => {
      if (!r || !o) return;
      const m = {
        ...l,
        ...d
      };
      if (d.layerNumber !== void 0 || d.datatype !== void 0) {
        for (const v of ye.getState().layers.values()) if (v.id !== l.id && v.layerNumber === m.layerNumber && v.datatype === m.datatype) {
          Dt.getState().show(`Layer ${m.layerNumber}/${m.datatype} already exists`, "warn");
          return;
        }
      }
      const p = new w0(l, m);
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
      const d = requestAnimationFrame(() => {
        var _a, _b2;
        (_b2 = (_a = s.current) == null ? void 0 : _a.querySelector("[data-tab-index='0']")) == null ? void 0 : _b2.focus();
      });
      return () => cancelAnimationFrame(d);
    }, []), g.useEffect(() => {
      const d = (m) => {
        var _a;
        if (m.key === "Escape") {
          const p = document.activeElement;
          if (p && ((_a = s.current) == null ? void 0 : _a.contains(p)) && p.tagName === "INPUT") return;
          m.preventDefault(), ye.getState().setExpandedLayerId(null);
        }
      };
      return document.addEventListener("keydown", d), () => document.removeEventListener("keydown", d);
    }, []), g.useEffect(() => {
      const d = (m) => {
        s.current && !s.current.contains(m.target) && ye.getState().setExpandedLayerId(null);
      };
      return document.addEventListener("mousedown", d), () => document.removeEventListener("mousedown", d);
    }, []);
    const f = g.useCallback((d) => {
      if (d.key === "Escape" || (d.stopPropagation(), d.key !== "Tab" || !s.current)) return;
      d.preventDefault();
      const m = Array.from(s.current.querySelectorAll("[data-tab-index]")).sort((S, E) => Number(S.dataset.tabIndex) - Number(E.dataset.tabIndex));
      if (m.length === 0) return;
      const p = m.findIndex((S) => S === document.activeElement), v = d.shiftKey ? -1 : 1, b = p === -1 ? 0 : (p + v + m.length) % m.length;
      m[b].focus();
    }, []);
    return y.jsxs("div", {
      ref: s,
      role: "group",
      className: "mx-1 flex w-[calc(100%-8px)] flex-col gap-2 px-2.5 py-2",
      onClick: (d) => d.stopPropagation(),
      onKeyDown: f,
      onMouseDown: (d) => d.stopPropagation(),
      children: [
        y.jsx(w3, {
          label: "Name",
          value: l.name,
          isDark: n,
          onChange: (d) => c({
            name: d
          }),
          tabIdx: 0
        }),
        y.jsx("div", {
          className: B("h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsxs("div", {
          className: "flex flex-col gap-1.5",
          children: [
            y.jsx(Mf, {
              label: "Color",
              isDark: n
            }),
            y.jsx(v3, {
              color: l.color,
              isDark: n,
              onChange: (d) => c({
                color: d
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
            y.jsx(Mf, {
              label: "GDS",
              isDark: n
            }),
            y.jsx(Rv, {
              label: "Layer",
              value: l.layerNumber,
              isDark: n,
              onChange: (d) => c({
                layerNumber: d
              }),
              tabIdx: 2
            }),
            y.jsx(Rv, {
              label: "Datatype",
              value: l.datatype,
              isDark: n,
              onChange: (d) => c({
                datatype: d
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
            y.jsx(Mf, {
              label: "Fill",
              isDark: n
            }),
            y.jsx(x3, {
              value: l.fillPattern,
              isDark: n,
              onChange: (d) => c({
                fillPattern: d
              }),
              baseTabIdx: 4
            })
          ]
        })
      ]
    });
  }
  function C3({ layer: l, isActive: n, isFocused: r, isExpanded: o, isDark: s, onSelect: c, onToggleExpand: f, startEditing: d }) {
    const [m, p] = g.useState(false), [v, b] = g.useState(l.name), S = g.useRef(null), E = g.useRef(null);
    g.useEffect(() => {
      r && E.current && E.current.scrollIntoView({
        block: "nearest"
      });
    }, [
      r
    ]), g.useEffect(() => {
      d && (p(true), b(l.name), ye.getState().setEditingLayerId(null));
    }, [
      d,
      l.name
    ]), g.useEffect(() => {
      m && S.current && (S.current.focus(), S.current.select());
    }, [
      m
    ]);
    const k = xe((j) => j.library), w = xe((j) => j.renderer), C = g.useCallback(() => {
      const j = v.trim();
      if (j && j !== l.name && k && w) {
        const U = new w0(l, {
          ...l,
          name: j
        });
        de.getState().execute(U, {
          library: k,
          renderer: w
        });
      } else b(l.name);
      p(false);
    }, [
      v,
      l,
      k,
      w
    ]), _ = g.useCallback((j) => {
      j.key === "Enter" ? C() : j.key === "Escape" && (b(l.name), p(false));
    }, [
      C,
      l.name
    ]), T = g.useCallback((j) => {
      j.preventDefault(), j.stopPropagation(), ac.getState().open("layer", {
        x: j.clientX,
        y: j.clientY
      }, String(l.id));
    }, [
      l.id
    ]), A = g.useCallback((j) => {
      j.stopPropagation(), c(), f();
    }, [
      c,
      f
    ]);
    return y.jsxs("div", {
      className: "flex flex-col gap-0.5",
      children: [
        y.jsxs("button", {
          ref: E,
          type: "button",
          className: B("group relative mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-[7px] py-1.5 text-left transition-colors", n ? s ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? s ? "bg-[rgb(44,44,44)] text-white/90" : "bg-[rgb(227,227,227)] text-black/90" : s ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90" : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90", r && (s ? "ring-1 ring-white/25" : "ring-1 ring-black/20")),
          onClick: c,
          onContextMenu: T,
          onMouseDown: (j) => j.preventDefault(),
          tabIndex: -1,
          children: [
            y.jsx("span", {
              role: "img",
              className: B("h-4.5 w-4.5 flex-shrink-0 cursor-pointer rounded border outline-none transition-shadow", s ? "border-white/10 hover:border-white/30" : "border-black/10 hover:border-black/30", !l.visible && "opacity-40"),
              style: {
                backgroundColor: l.color
              },
              onClick: A,
              onKeyDown: () => {
              }
            }),
            y.jsx("div", {
              className: "relative h-5 min-w-0 flex-1",
              children: m ? y.jsx("input", {
                ref: S,
                type: "text",
                value: v,
                onChange: (j) => b(j.target.value),
                onBlur: C,
                onKeyDown: _,
                onClick: (j) => j.stopPropagation(),
                className: B("absolute inset-0 m-0 box-border w-full border-0 bg-transparent p-0 text-sm leading-5 outline-none focus:ring-0", s ? "text-white/90" : "text-gray-900")
              }) : y.jsx("span", {
                className: B("absolute inset-0 truncate text-sm leading-5 select-none", !l.visible && "opacity-40"),
                onDoubleClick: (j) => {
                  j.stopPropagation(), p(true);
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
        o && y.jsx(S3, {
          layer: l,
          isDark: s
        })
      ]
    });
  }
  function E3() {
    const n = pe((w) => w.theme) === "dark", { getAllLayers: r, activeLayerId: o, setActiveLayer: s } = ye(), c = ye((w) => w.editingLayerId), f = ye((w) => w.expandedLayerId), d = ye((w) => w.setExpandedLayerId), m = ye((w) => w.isFocused), p = ye((w) => w.focusedLayerId), v = ye((w) => w.setFocused), b = ye((w) => w.setFocusedLayerId);
    Ya("layers-panel", m);
    const S = r(), E = g.useRef(null), k = g.useCallback((w) => {
      const C = ye.getState().expandedLayerId;
      d(C === w ? null : w);
    }, [
      d
    ]);
    return g.useEffect(() => {
      if (!m) return;
      const w = (C) => {
        E.current && !E.current.contains(C.target) && v(false);
      };
      return document.addEventListener("mousedown", w), () => document.removeEventListener("mousedown", w);
    }, [
      m,
      v
    ]), g.useEffect(() => {
      if (!m) return;
      const w = (C) => {
        if (C.target instanceof HTMLInputElement || C.target instanceof HTMLTextAreaElement) return;
        const { focusedLayerId: _, editingLayerId: T, expandedLayerId: A } = ye.getState();
        if (T || A) return;
        const j = ye.getState().getAllLayers();
        if (j.length === 0) return;
        const U = _ != null ? j.findIndex((N) => N.id === _) : -1;
        switch (C.key) {
          case "ArrowDown": {
            C.preventDefault();
            const N = U < j.length - 1 ? U + 1 : 0;
            b(j[N].id);
            break;
          }
          case "ArrowUp": {
            C.preventDefault();
            const N = U > 0 ? U - 1 : j.length - 1;
            b(j[N].id);
            break;
          }
          case " ": {
            C.preventDefault(), _ != null && s(_);
            break;
          }
          case "Enter": {
            if (C.preventDefault(), _ != null) {
              const N = ye.getState().expandedLayerId;
              d(N === _ ? null : _);
            }
            break;
          }
          case "Delete":
          case "Backspace": {
            if (C.preventDefault(), _ != null && j.length > 1) {
              const { library: N, renderer: R } = xe.getState();
              if (N && R) {
                const O = U < j.length - 1 ? U + 1 : U - 1, H = O >= 0 ? j[O].id : null, G = new nh(_);
                de.getState().execute(G, {
                  library: N,
                  renderer: R
                }), H != null && H !== _ && b(H);
              }
            }
            break;
          }
          case "z":
          case "Z": {
            if (!(C.metaKey || C.ctrlKey)) return;
            C.preventDefault();
            const { library: R, renderer: O } = xe.getState();
            if (!R || !O) break;
            C.shiftKey ? de.getState().redo({
              library: R,
              renderer: O
            }) : de.getState().undo({
              library: R,
              renderer: O
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
      return document.addEventListener("keydown", w), () => document.removeEventListener("keydown", w);
    }, [
      m,
      v,
      b,
      s,
      d
    ]), y.jsx("div", {
      className: "flex h-full flex-col",
      children: y.jsx("div", {
        ref: E,
        className: "flex flex-1 flex-col gap-0.5 overflow-y-auto py-1",
        onWheel: (w) => w.stopPropagation(),
        children: S.map((w) => y.jsx(C3, {
          layer: w,
          isActive: w.id === o,
          isFocused: m && w.id === p,
          isExpanded: f === w.id,
          isDark: n,
          onSelect: () => s(w.id),
          onToggleExpand: () => k(w.id),
          startEditing: c === w.id
        }, w.id))
      })
    });
  }
  function Ht({ label: l, value: n, unit: r, isDark: o, onChange: s, readOnly: c }) {
    const [f, d] = g.useState(false), [m, p] = g.useState(n), v = g.useRef(null), b = g.useRef(false), S = g.useRef(true);
    g.useEffect(() => (S.current = true, () => {
      S.current = false;
    }), []), g.useEffect(() => {
      f || p(n);
    }, [
      n,
      f
    ]), g.useEffect(() => {
      f && v.current && (v.current.focus(), v.current.select());
    }, [
      f
    ]);
    const E = g.useCallback(() => {
      if (b.current) {
        b.current = false, d(false);
        return;
      }
      if (!S.current) return;
      const w = Number.parseFloat(m);
      !Number.isNaN(w) && s && s(w), d(false);
    }, [
      m,
      s
    ]), k = g.useCallback((w) => {
      var _a, _b2;
      w.key === "Enter" ? (w.preventDefault(), (_a = v.current) == null ? void 0 : _a.blur()) : w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), b.current = true, p(n), (_b2 = v.current) == null ? void 0 : _b2.blur());
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
            f && !c ? y.jsx("input", {
              ref: v,
              type: "text",
              value: m,
              onChange: (w) => p(w.target.value),
              onBlur: E,
              onKeyDown: k,
              onClick: (w) => w.stopPropagation(),
              className: B("w-20 rounded border px-1.5 py-0.5 text-right font-mono text-xs outline-none", o ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
            }) : y.jsx("button", {
              type: "button",
              onClick: () => {
                !c && s && d(true);
              },
              onFocus: () => {
                !c && s && d(true);
              },
              className: B("w-20 rounded border border-transparent px-1.5 py-0.5 text-right font-mono text-xs outline-none transition-colors", c ? o ? "text-white/30" : "text-black/30" : o ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
              tabIndex: c ? -1 : 0,
              children: n
            }),
            r && y.jsx("span", {
              className: B("w-6 text-xs select-none", c ? o ? "text-white/20" : "text-black/20" : o ? "text-white/40" : "text-black/40"),
              children: r
            })
          ]
        })
      ]
    });
  }
  function _3({ label: l, value: n, isDark: r, onChange: o }) {
    const [s, c] = g.useState(false), [f, d] = g.useState(n), m = g.useRef(null), p = g.useRef(false), v = g.useRef(true);
    g.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), g.useEffect(() => {
      s || d(n);
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
      const E = f.trim();
      E && E !== n && o(E), c(false);
    }, [
      f,
      n,
      o
    ]), S = g.useCallback((E) => {
      var _a, _b2;
      E.key === "Enter" ? (E.preventDefault(), (_a = m.current) == null ? void 0 : _a.blur()) : E.key === "Escape" && (E.preventDefault(), E.stopPropagation(), p.current = true, d(n), (_b2 = m.current) == null ? void 0 : _b2.blur());
    }, [
      n
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      "data-field": l,
      children: [
        y.jsx("span", {
          className: B("text-xs select-none", r ? "text-white/50" : "text-black/50"),
          children: l
        }),
        s ? y.jsx("input", {
          ref: m,
          type: "text",
          value: f,
          onChange: (E) => d(E.target.value),
          onBlur: b,
          onKeyDown: S,
          onClick: (E) => E.stopPropagation(),
          className: B("w-32 rounded border px-1.5 py-0.5 text-right text-xs outline-none", r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
        }) : y.jsx("button", {
          type: "button",
          onClick: () => c(true),
          onFocus: () => c(true),
          className: B("w-32 truncate rounded border border-transparent px-1.5 py-0.5 text-right text-xs outline-none transition-colors", r ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
          tabIndex: 0,
          children: n
        })
      ]
    });
  }
  function k3({ label: l, value: n, isDark: r, onChange: o }) {
    const [s, c] = g.useState(false), [f, d] = g.useState(n), m = g.useRef(null), p = g.useRef(false), v = g.useRef(true);
    g.useEffect(() => (v.current = true, () => {
      v.current = false;
    }), []), g.useEffect(() => {
      s || d(n);
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
      const w = f.trim();
      w && w !== n && o(w), c(false);
    }, [
      f,
      n,
      o
    ]), S = g.useCallback((w) => {
      var _a, _b2;
      w.key === "Enter" && !w.shiftKey ? (w.preventDefault(), (_a = m.current) == null ? void 0 : _a.blur()) : w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), p.current = true, d(n), (_b2 = m.current) == null ? void 0 : _b2.blur());
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
            className: B("text-xs select-none", r ? "text-white/50" : "text-black/50"),
            children: l
          })
        }),
        s ? y.jsx("textarea", {
          ref: m,
          value: f,
          onChange: (w) => d(w.target.value),
          onBlur: b,
          onKeyDown: S,
          onClick: (w) => w.stopPropagation(),
          rows: Math.min(6, Math.max(2, f.split(`
`).length)),
          className: B("w-full resize-none rounded border px-1.5 py-1 font-mono text-xs leading-relaxed outline-none", r ? "border-white/10 bg-white/5 text-white/90" : "border-black/10 bg-black/5 text-black/90")
        }) : y.jsx("button", {
          type: "button",
          onClick: () => c(true),
          onFocus: () => c(true),
          className: B("w-full whitespace-pre-wrap rounded border border-transparent px-1.5 py-1 text-left font-mono text-xs leading-relaxed outline-none transition-colors", r ? "cursor-text text-white/90 hover:bg-white/5" : "cursor-text text-black/90 hover:bg-black/5"),
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
    const s = ye((N) => N.getAllLayers)(), [c, f] = g.useState(`${l}:${n}`), [d, m] = g.useState(false), [p, v] = g.useState(-1);
    Ya("layer-selector", d);
    const b = g.useRef(null), S = g.useRef(null), E = `${l}:${n}`;
    g.useEffect(() => {
      f(E);
    }, [
      E
    ]);
    const k = s.find((N) => `${N.layerNumber}:${N.datatype}` === c), [w, C] = g.useState({
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
      const R = s.findIndex((O) => `${O.layerNumber}:${O.datatype}` === c);
      v(R >= 0 ? R : 0), m(true);
    }, [
      s,
      c
    ]), T = g.useCallback(() => {
      var _a;
      m(false), (_a = b.current) == null ? void 0 : _a.focus();
    }, []), A = g.useCallback((N) => {
      f(`${N.layerNumber}:${N.datatype}`), o(N.layerNumber, N.datatype), T();
    }, [
      o,
      T
    ]);
    g.useEffect(() => {
      d && S.current && S.current.focus();
    }, [
      d
    ]), g.useEffect(() => {
      if (!d) return;
      const N = (R) => {
        var _a, _b2;
        ((_a = b.current) == null ? void 0 : _a.contains(R.target)) || ((_b2 = S.current) == null ? void 0 : _b2.contains(R.target)) || m(false);
      };
      return document.addEventListener("mousedown", N), () => document.removeEventListener("mousedown", N);
    }, [
      d
    ]);
    const j = g.useCallback((N) => {
      (N.key === "ArrowDown" || N.key === "ArrowUp" || N.key === "Enter" || N.key === " ") && (N.preventDefault(), _());
    }, [
      _
    ]), U = g.useCallback((N) => {
      switch (N.key) {
        case "ArrowDown":
          N.preventDefault(), N.stopPropagation(), v((R) => Math.min(R + 1, s.length - 1));
          break;
        case "ArrowUp":
          N.preventDefault(), N.stopPropagation(), v((R) => Math.max(R - 1, 0));
          break;
        case "Enter":
        case " ": {
          N.preventDefault(), N.stopPropagation();
          const R = s[p];
          R && A(R);
          break;
        }
        case "Escape":
        case "Tab":
          N.preventDefault(), N.stopPropagation(), T();
          break;
      }
    }, [
      s,
      p,
      A,
      T
    ]);
    return y.jsxs("div", {
      className: "flex items-center justify-between gap-2 px-3 py-1",
      children: [
        y.jsx("span", {
          className: B("text-xs select-none", r ? "text-white/50" : "text-black/50"),
          children: "Layer"
        }),
        y.jsxs("button", {
          ref: b,
          type: "button",
          onClick: () => d ? T() : _(),
          onKeyDown: j,
          className: B("flex max-w-36 items-center gap-1.5 rounded-lg border px-1.5 py-0.5 text-xs outline-none transition-colors", r ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 focus-visible:border-white/40" : "border-black/10 bg-black/5 text-black/90 hover:bg-black/10 focus-visible:border-black/40"),
          children: [
            k && y.jsx("div", {
              className: B("h-3 w-3 flex-shrink-0 rounded-sm border", r ? "border-white/10" : "border-black/10"),
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
              className: B("flex-shrink-0 transition-transform", d && "rotate-180", r ? "text-white/40" : "text-black/40"),
              children: y.jsx("path", {
                d: "M4 6l4 4 4-4",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5"
              })
            })
          ]
        }),
        d && li.createPortal(y.jsx("div", {
          ref: S,
          role: "listbox",
          tabIndex: -1,
          onKeyDown: U,
          className: B("fixed z-50 overflow-y-auto rounded-xl border py-1 shadow-lg outline-none", r ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: {
            top: w.top,
            right: w.right,
            minWidth: w.width,
            maxHeight: 200
          },
          children: s.map((N, R) => {
            const H = `${N.layerNumber}:${N.datatype}` === c, G = R === p;
            return y.jsxs("div", {
              "data-layer-option": true,
              role: "option",
              "aria-selected": H,
              className: B("mx-1 flex w-[calc(100%-8px)] cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", G ? r ? "bg-[rgb(54,54,54)] text-white/90" : "bg-[rgb(217,217,217)] text-black/90" : r ? "text-white/70" : "text-black/70"),
              onMouseDown: (te) => {
                te.preventDefault(), A(N);
              },
              onMouseEnter: () => v(R),
              children: [
                y.jsx("div", {
                  className: B("h-3.5 w-3.5 flex-shrink-0 rounded-sm border", r ? "border-white/10" : "border-black/10"),
                  style: {
                    backgroundColor: N.color
                  }
                }),
                y.jsx("span", {
                  className: "flex-1 truncate",
                  children: N.name
                }),
                y.jsxs("span", {
                  className: B("flex-shrink-0 font-mono text-[11px]", r ? "text-white/40" : "text-black/40"),
                  children: [
                    N.layerNumber,
                    "/",
                    N.datatype
                  ]
                }),
                H && y.jsx("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 16 16",
                  className: B("flex-shrink-0", r ? "text-white/70" : "text-black/70"),
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
  function M3({ sourceInfo: l, isDark: n }) {
    const [r, o] = g.useState(false), [s, c] = g.useState(l.code), f = g.useRef(null);
    g.useEffect(() => {
      c(l.code), o(false);
    }, [
      l.code,
      l.line
    ]);
    const d = g.useCallback(async () => {
      if (s.trim() === l.code.trim()) {
        o(false);
        return;
      }
      await CS({
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
          className: B("px-3 pt-2.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
          children: "Source"
        }),
        y.jsxs("div", {
          className: "flex items-center justify-between gap-2 px-3 py-0.5",
          children: [
            y.jsx("span", {
              className: B("text-xs select-none", n ? "text-white/50" : "text-black/50"),
              children: "Location"
            }),
            y.jsxs("span", {
              className: B("text-xs font-mono tabular-nums select-all", n ? "text-white/80" : "text-black/80"),
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
              className: B("text-xs select-none", n ? "text-white/50" : "text-black/50"),
              children: "Function"
            }),
            y.jsxs("span", {
              className: B("text-xs font-mono select-all", n ? "text-white/80" : "text-black/80"),
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
            ref: f,
            className: B("w-full rounded px-1.5 py-1 text-[11px] font-mono leading-tight resize-none border", n ? "bg-white/5 text-white/90 border-white/10 focus:border-blue-400/50" : "bg-black/5 text-black/90 border-black/10 focus:border-blue-500/50"),
            value: s,
            rows: Math.min(s.split(`
`).length + 1, 5),
            onChange: (p) => c(p.target.value),
            onKeyDown: (p) => {
              p.key === "Enter" && (p.metaKey || p.ctrlKey) && (p.preventDefault(), d()), p.key === "Escape" && (c(l.code), o(false));
            },
            onBlur: d,
            autoFocus: true
          }) : y.jsx("button", {
            type: "button",
            className: B("w-full rounded px-1.5 py-1 text-left text-[11px] font-mono leading-tight", "cursor-pointer transition-colors", n ? "bg-white/5 text-white/70 hover:bg-white/10" : "bg-black/5 text-black/70 hover:bg-black/10"),
            onClick: () => o(true),
            title: "Click to edit source (Cmd+Enter to save, Escape to cancel)",
            children: l.code
          })
        })
      ]
    });
  }
  function Kt({ label: l, isDark: n }) {
    return y.jsx("div", {
      className: B("px-3 pt-2.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider select-none", n ? "text-white/30" : "text-black/30"),
      children: l
    });
  }
  function D1({ index: l, x: n, y: r, unit: o, isDark: s, canRemove: c, onChangeX: f, onChangeY: d, onRemove: m, readOnly: p }) {
    return y.jsxs("div", {
      "data-vertex-row": true,
      children: [
        y.jsxs("div", {
          className: "flex items-center justify-between px-3 pt-1.5 pb-0",
          children: [
            y.jsxs("span", {
              className: B("text-[10px] font-mono select-none", s ? "text-white/30" : "text-black/30"),
              children: [
                "V",
                l
              ]
            }),
            !p && y.jsx("button", {
              type: "button",
              onClick: m,
              disabled: !c,
              className: B("flex-shrink-0 rounded p-0.5 transition-colors", c ? s ? "text-white/40 hover:bg-white/10 hover:text-white/70" : "text-black/40 hover:bg-black/10 hover:text-black/70" : s ? "cursor-not-allowed text-white/10" : "cursor-not-allowed text-black/10"),
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
          onChange: f,
          readOnly: p
        }),
        y.jsx(Ht, {
          label: "Y",
          value: r,
          unit: o,
          isDark: s,
          onChange: d,
          readOnly: p
        })
      ]
    });
  }
  function Av({ vertices: l, unitInfo: n, isDark: r, onChangeVertex: o, onRemoveVertex: s, onAddVertex: c, readOnly: f, label: d }) {
    const m = l.length / 2, p = m > 3, v = g.useRef(null), [b, S] = g.useState(null);
    g.useEffect(() => {
      if (b === null) return;
      const w = b;
      let C, _ = 0;
      const T = 10, A = () => {
        const j = v.current;
        if (!j) {
          S(null);
          return;
        }
        const U = j.querySelectorAll("[data-vertex-row]");
        if (U.length <= w) {
          if (_++, _ >= T) {
            S(null);
            return;
          }
          C = requestAnimationFrame(A);
          return;
        }
        j.scrollTop = j.scrollHeight;
        const N = U[U.length - 1];
        if (N) {
          const R = N.querySelector("[data-field='X'] button");
          R && R.focus();
        }
        S(null);
      };
      return C = requestAnimationFrame(A), () => cancelAnimationFrame(C);
    }, [
      b
    ]);
    const E = g.useCallback(() => {
      c(), S(m);
    }, [
      c,
      m
    ]), k = [];
    for (let w = 0; w < m; w++) {
      const C = l[w * 2], _ = l[w * 2 + 1], T = gt(C / Se, n), A = gt(-_ / Se, n);
      k.push(y.jsx(D1, {
        index: w,
        x: T,
        y: A,
        unit: n.unit,
        isDark: r,
        canRemove: p,
        onChangeX: (j) => o(w, "x", j),
        onChangeY: (j) => o(w, "y", j),
        onRemove: () => s(w),
        readOnly: f
      }, w));
    }
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(Kt, {
          label: d ?? "Vertices",
          isDark: r
        }),
        y.jsx("div", {
          ref: v,
          className: "flex max-h-48 flex-col overflow-y-auto",
          children: k
        }),
        !f && y.jsx("div", {
          className: "px-3 pt-1",
          children: y.jsxs("button", {
            type: "button",
            onClick: E,
            className: B("flex w-full items-center justify-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors", r ? "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70" : "border-black/10 text-black/50 hover:bg-black/5 hover:text-black/70"),
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
  function j3() {
    const l = oe((s) => s.selectedIds), n = xe((s) => s.library), [r, o] = g.useState(0);
    return g.useEffect(() => {
      if (!n || l.size === 0) return;
      let s;
      const c = () => {
        n.is_dirty() && o((f) => f + 1), s = requestAnimationFrame(c);
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
        const S = n.get_cell_ref_info(c);
        if (S) {
          const [E, k, w, C, _, T] = S.transform, A = n.get_cell_origin_by_name(S.cell_name), j = A ? A[0] : 0, U = A ? A[1] : 0, R = Math.atan2(w, E) * 180 / Math.PI, O = Math.sqrt(E * E + w * w), H = n.get_cell_ref_array(c);
          let G = null;
          H && H.length === 4 && (G = {
            columns: H[0],
            rows: H[1],
            colSpacing: H[2],
            rowSpacing: H[3]
          }), s = {
            cellName: S.cell_name,
            x: E * j + k * U + _,
            y: w * j + C * U + T,
            tx: _,
            ty: T,
            rotation: R,
            scale: O,
            transform: new Float64Array(S.transform),
            childOriginX: j,
            childOriginY: U,
            array: G,
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
      const d = n.get_bounds_for_ids([
        ...l
      ]), m = d ? {
        minX: d[0],
        minY: d[1],
        maxX: d[2],
        maxY: d[3]
      } : null, p = f[0].layer, v = f[0].datatype, b = f.some((S) => S.layer !== p || S.datatype !== v);
      return {
        elements: f,
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
  const L3 = {
    unit: "\xB5m",
    scale: 1e3
  };
  function R3() {
    var _a;
    const n = pe((I) => I.theme) === "dark", r = L3, o = j3(), s = xe((I) => I.library), c = xe((I) => I.renderer), f = he((I) => I.activeCell);
    de((I) => I.undoStack.length + I.redoStack.length);
    const d = nn((I) => I.pathMetadata), m = oe((I) => I.selectedIds), p = Ot((I) => I.images), v = g.useMemo(() => {
      for (const I of m) if (Sn(I)) return Yr(I);
      return null;
    }, [
      m
    ]), b = v ? p.get(v) ?? null : null, S = s == null ? void 0 : s.get_cell_origin(), E = S ? {
      x: S[0],
      y: S[1]
    } : {
      x: 0,
      y: 0
    }, k = g.useRef(E);
    k.current = E;
    const w = g.useRef(void 0), C = g.useRef(void 0), _ = g.useCallback((I) => {
      if (!f || !s || !c || I === f) return;
      const se = new S0(f, I);
      de.getState().execute(se, {
        library: s,
        renderer: c
      });
    }, [
      f,
      s,
      c
    ]), T = g.useCallback((I, se) => {
      if (!s || !c) return;
      const ge = se * r.scale, ve = I === "y" ? -ge * Se : ge * Se, Le = k.current, Me = new QS(Le.x, Le.y, I === "x" ? ve : Le.x, I === "y" ? ve : Le.y);
      de.getState().execute(Me, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      r
    ]), A = g.useCallback((I, se) => {
      if (!o || !s || !c) return;
      const ge = o.elements.map((Le) => Le.id), ve = new Ey(ge, I, se);
      de.getState().execute(ve, {
        library: s,
        renderer: c
      }), o.elements.length === 1 && _S(o.elements[0].id, I, se);
    }, [
      o,
      s,
      c
    ]), j = g.useCallback((I) => {
      if (!s) return;
      let se = s.get_element_info(I);
      if (!se) {
        const ge = oe.getState().selectedIds;
        if (ge.size === 1) {
          const ve = ge.values().next().value;
          ve && (se = s.get_element_info(ve));
        }
      }
      se && (Uo(I, new Float64Array(se.vertices)), se.free());
    }, [
      s
    ]), U = g.useCallback((I, se) => {
      if (!(o == null ? void 0 : o.bounds) || !s || !c) return;
      const ge = se * r.scale, ve = I === "y" ? -ge * Se : ge * Se, Le = o.elements.map(($e) => $e.id), Me = new KS(Le, o.bounds.minX, o.bounds.minY, I === "x" ? ve : o.bounds.minX, I === "y" ? ve - (o.bounds.maxY - o.bounds.minY) : o.bounds.minY);
      de.getState().execute(Me, {
        library: s,
        renderer: c
      }), o.elements.length === 1 && j(o.elements[0].id);
    }, [
      o,
      s,
      c,
      r,
      j
    ]), N = g.useCallback((I, se) => {
      if (!(o == null ? void 0 : o.bounds) || !s || !c) return;
      const ve = se * r.scale * Se;
      if (ve <= 0) return;
      const Le = o.bounds.maxX - o.bounds.minX, Me = o.bounds.maxY - o.bounds.minY, $e = o.elements.map((we) => we.id), Ze = new PS($e, o.bounds, I === "width" ? ve : Le, I === "height" ? ve : Me);
      de.getState().execute(Ze, {
        library: s,
        renderer: c
      }), o.elements.length === 1 && j(o.elements[0].id);
    }, [
      o,
      s,
      c,
      r,
      j
    ]), R = g.useCallback((I, se, ge) => {
      if (!o || !s || !c) return;
      const ve = o.elements[0];
      if (!ve) return;
      const Le = new Float64Array(ve.vertices), Me = ge * r.scale, $e = se === "y" ? -Me * Se : Me * Se;
      Le[I * 2 + (se === "x" ? 0 : 1)] = $e;
      const Ze = new zd(ve.id, Le, "Edit vertex");
      de.getState().execute(Ze, {
        library: s,
        renderer: c
      }), Uo(ve.id, Le);
    }, [
      o,
      s,
      c,
      r
    ]), O = g.useCallback((I) => {
      if (!o || !s || !c) return;
      const se = o.elements[0];
      if (!se || se.vertexCount <= 3) return;
      const ge = new Float64Array(se.vertices.length - 2);
      let ve = 0;
      for (let Me = 0; Me < se.vertexCount; Me++) Me !== I && (ge[ve] = se.vertices[Me * 2], ge[ve + 1] = se.vertices[Me * 2 + 1], ve += 2);
      const Le = new zd(se.id, ge, "Remove vertex");
      de.getState().execute(Le, {
        library: s,
        renderer: c
      }), Uo(se.id, ge);
    }, [
      o,
      s,
      c
    ]), H = g.useCallback(() => {
      if (!o || !s || !c) return;
      const I = o.elements[0];
      if (!I) return;
      const se = I.vertexCount, ge = I.vertices[(se - 1) * 2], ve = I.vertices[(se - 1) * 2 + 1], Le = I.vertices[0], Me = I.vertices[1], $e = (ge + Le) / 2, Ze = (ve + Me) / 2, we = new Float64Array(I.vertices.length + 2);
      we.set(I.vertices), we[I.vertices.length] = $e, we[I.vertices.length + 1] = Ze;
      const je = new zd(I.id, we, "Add vertex");
      de.getState().execute(je, {
        library: s,
        renderer: c
      }), Uo(I.id, we);
    }, [
      o,
      s,
      c
    ]), G = g.useRef(null);
    g.useEffect(() => {
      const I = G.current;
      if (!I) return;
      const se = (ge) => {
        if (ge.key !== "Escape" && ge.key === "Tab") {
          ge.stopPropagation(), ge.preventDefault();
          const ve = Array.from(I.querySelectorAll("input, textarea, button:not([tabindex='-1']):not([data-layer-option])"));
          if (ve.length === 0) return;
          const Le = ve.indexOf(document.activeElement), Me = ge.shiftKey ? (Le - 1 + ve.length) % ve.length : (Le + 1) % ve.length;
          ve[Me].focus();
        }
      };
      return I.addEventListener("keydown", se), () => I.removeEventListener("keydown", se);
    }, []);
    const te = pe((I) => I.inspectorFocusRequested), ee = pe((I) => I.inspectorFocusField);
    g.useEffect(() => {
      !te || !G.current || (pe.getState().clearInspectorFocus(), requestAnimationFrame(() => {
        const I = G.current;
        if (!I) return;
        let se = null;
        if (ee) {
          const ge = I.querySelector(`[data-field="${ee}"]`);
          ge && (se = ge.querySelector("button:not([tabindex='-1']), input, textarea"));
        }
        se || (se = I.querySelector("input, textarea, button:not([tabindex='-1']):not([data-layer-option])")), se && se.focus();
      }));
    }, [
      te,
      ee
    ]);
    const fe = g.useMemo(() => !o || o.elements.length !== 1 ? null : dr(o.elements[0].id), [
      o
    ]), me = g.useCallback((I) => {
      const se = w.current, ge = C.current;
      if (!se || !ge || !s || !c || !oe.getState().selectedIds.has(ge)) return;
      const ve = I * r.scale * Se;
      if (ve <= 0) return;
      const Le = new Ms(ge, se, {
        ...se,
        width: ve
      }, "Change path width");
      de.getState().execute(Le, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      r
    ]), Ee = g.useCallback((I) => {
      const se = w.current, ge = C.current;
      if (!se || !ge || !s || !c || !oe.getState().selectedIds.has(ge)) return;
      const ve = I * r.scale * Se;
      if (ve < 0) return;
      const Le = new Ms(ge, se, {
        ...se,
        cornerRadius: ve
      }, "Change path corner radius");
      de.getState().execute(Le, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      r
    ]), q = g.useCallback((I, se, ge) => {
      const ve = w.current, Le = C.current;
      if (!ve || !Le || !s || !c || !oe.getState().selectedIds.has(Le)) return;
      const Me = ge * r.scale, $e = se === "y" ? -Me * Se : Me * Se, Ze = ve.waypoints.map((je, Ae) => Ae !== I ? je : se === "x" ? {
        x: $e,
        y: je.y
      } : {
        x: je.x,
        y: $e
      }), we = new Ms(Le, ve, {
        ...ve,
        waypoints: Ze
      }, "Edit path waypoint");
      de.getState().execute(we, {
        library: s,
        renderer: c
      });
    }, [
      s,
      c,
      r
    ]);
    if (!o && b) {
      const I = gt(b.x / Se, r), se = gt(-b.y / Se, r), ge = gt(b.width / Se, r), ve = gt(b.height / Se, r), Le = b.lockAspectRatio, Me = (we, je) => {
        if (!s || !c || !v) return;
        const Ae = Ot.getState().images.get(v);
        if (!Ae) return;
        const et = je * r.scale, Fe = we === "y" ? -et * Se : et * Se, Ut = new n2(v, Ae.x, Ae.y, we === "x" ? Fe : Ae.x, we === "y" ? Fe : Ae.y);
        de.getState().execute(Ut, {
          library: s,
          renderer: c
        });
      }, $e = (we, je) => {
        if (!s || !c || !v) return;
        const Ae = Ot.getState().images.get(v);
        if (!Ae) return;
        const Fe = je * r.scale * Se;
        if (Fe <= 0) return;
        let Ut, hn;
        if (Ae.lockAspectRatio) {
          const il = Ae.naturalHeight / Ae.naturalWidth;
          we === "width" ? (Ut = Fe, hn = Fe * il) : (hn = Fe, Ut = Fe / il);
        } else Ut = we === "width" ? Fe : Ae.width, hn = we === "height" ? Fe : Ae.height;
        const jt = new r2(v, Ae.width, Ae.height, Ut, hn);
        de.getState().execute(jt, {
          library: s,
          renderer: c
        });
      }, Ze = () => {
        v && Ot.getState().updateImage(v, {
          lockAspectRatio: !Le
        });
      };
      return y.jsxs("div", {
        ref: G,
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
          y.jsx(Kt, {
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
                title: b.filename,
                children: b.filename
              })
            ]
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Kt, {
            label: "Position",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "X",
            value: I,
            unit: r.unit,
            isDark: n,
            onChange: (we) => Me("x", we)
          }),
          y.jsx(Ht, {
            label: "Y",
            value: se,
            unit: r.unit,
            isDark: n,
            onChange: (we) => Me("y", we)
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Kt, {
            label: "Size",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "W",
            value: ge,
            unit: r.unit,
            isDark: n,
            onChange: (we) => $e("width", we)
          }),
          y.jsx(Ht, {
            label: "H",
            value: ve,
            unit: r.unit,
            isDark: n,
            onChange: (we) => $e("height", we)
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
                onClick: Ze,
                className: B("flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-xs transition-colors", Le ? n ? "border-white/20 bg-white/10 text-white/80" : "border-black/20 bg-black/10 text-black/80" : n ? "border-white/10 text-white/40 hover:text-white/60" : "border-black/10 text-black/40 hover:text-black/60"),
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
                    children: Le ? y.jsxs(y.Fragment, {
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
                  Le ? "On" : "Off"
                ]
              })
            ]
          })
        ]
      });
    }
    if (!o) {
      const I = gt(E.x / Se, r), se = gt(-E.y / Se, r);
      return y.jsxs("div", {
        ref: G,
        className: "flex flex-col pb-2",
        onWheel: (ge) => ge.stopPropagation(),
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
          y.jsx(Kt, {
            label: "Name",
            isDark: n
          }),
          f ? y.jsx(_3, {
            label: "Name",
            value: f,
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
          y.jsx(Kt, {
            label: "Origin",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "X",
            value: I,
            unit: r.unit,
            isDark: n,
            onChange: (ge) => T("x", ge)
          }),
          y.jsx(Ht, {
            label: "Y",
            value: se,
            unit: r.unit,
            isDark: n,
            onChange: (ge) => T("y", ge)
          })
        ]
      });
    }
    const { elements: F, bounds: ce, isMixed: _e } = o, be = F.length === 1, L = F[0], D = F.every((I) => I.id.startsWith("ref:")) || s != null && s.get_group_ids(L.id).length > 1 || ((_a = dr(L.id)) == null ? void 0 : _a.type) === "ref";
    if (be && s && s.is_text_element(L.id)) {
      const I = s.get_text_element_info(L.id);
      if (I) {
        const se = gt(I.x / Se, r), ge = gt(-I.y / Se, r), ve = gt(I.height / Se, r), Le = (we, je) => {
          if (!c) return;
          const Ae = je * r.scale, et = we === "y" ? -Ae * Se : Ae * Se, Fe = new JS(L.id, I.x, I.y, we === "x" ? et : I.x, we === "y" ? et : I.y);
          de.getState().execute(Fe, {
            library: s,
            renderer: c
          });
        }, Me = (we) => {
          if (!c || we === I.text) return;
          const je = new WS(L.id, I.text, we);
          de.getState().execute(je, {
            library: s,
            renderer: c
          }), xe.getState().bumpSyncGeneration();
        }, $e = (we) => {
          if (!c) return;
          const Ae = we * r.scale * Se;
          if (Ae <= 0) return;
          const et = new e2(L.id, I.height, Ae);
          de.getState().execute(et, {
            library: s,
            renderer: c
          }), xe.getState().bumpSyncGeneration();
        }, Ze = (we, je) => {
          if (!c) return;
          const Ae = new Ey([
            L.id
          ], we, je);
          de.getState().execute(Ae, {
            library: s,
            renderer: c
          }), xe.getState().bumpSyncGeneration();
        };
        return y.jsxs("div", {
          ref: G,
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
            y.jsx(Kt, {
              label: "Layer",
              isDark: n
            }),
            y.jsx(jf, {
              currentLayer: I.layer,
              currentDatatype: I.datatype,
              isDark: n,
              onChange: Ze
            }),
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Kt, {
              label: "Content",
              isDark: n
            }),
            y.jsx(k3, {
              label: "Text",
              value: I.text,
              isDark: n,
              onChange: Me
            }),
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Kt, {
              label: "Position",
              isDark: n
            }),
            y.jsx(Ht, {
              label: "X",
              value: se,
              unit: r.unit,
              isDark: n,
              onChange: (we) => Le("x", we)
            }),
            y.jsx(Ht, {
              label: "Y",
              value: ge,
              unit: r.unit,
              isDark: n,
              onChange: (we) => Le("y", we)
            }),
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(Kt, {
              label: "Size",
              isDark: n
            }),
            y.jsx(Ht, {
              label: "Size",
              value: ve,
              unit: r.unit,
              isDark: n,
              onChange: $e
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
                  const we = new j0([
                    L.id
                  ]);
                  de.getState().execute(we, {
                    library: s,
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
    const $ = be && L ? d.get(L.id) : void 0;
    if (w.current = $, C.current = L == null ? void 0 : L.id, $ && be) {
      const I = gt($.width / Se, r), se = gt($.cornerRadius / Se, r), ge = ce ? gt(ce.minX / Se, r) : "\u2014", ve = ce ? gt(-ce.maxY / Se, r) : "\u2014", Le = $.waypoints.map((Me, $e) => {
        const Ze = gt(Me.x / Se, r), we = gt(-Me.y / Se, r);
        return y.jsx(D1, {
          index: $e,
          x: Ze,
          y: we,
          unit: r.unit,
          isDark: n,
          canRemove: $.waypoints.length > 2,
          onChangeX: (je) => q($e, "x", je),
          onChangeY: (je) => q($e, "y", je),
          onRemove: () => {
            if ($.waypoints.length <= 2) return;
            const je = w.current, Ae = C.current;
            if (!je || !Ae || !s || !c) return;
            const et = je.waypoints.filter((Ut, hn) => hn !== $e), Fe = new Ms(Ae, je, {
              ...je,
              waypoints: et
            }, "Remove path waypoint");
            de.getState().execute(Fe, {
              library: s,
              renderer: c
            });
          }
        }, $e);
      });
      return y.jsxs("div", {
        ref: G,
        className: "flex flex-col pb-2",
        onWheel: (Me) => Me.stopPropagation(),
        children: [
          y.jsx("div", {
            className: "px-3 pt-2 pb-1",
            children: y.jsxs("span", {
              className: B("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
              children: [
                "Path \xB7 ",
                $.waypoints.length,
                " waypoints"
              ]
            })
          }),
          y.jsx("div", {
            className: B("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Kt, {
            label: "Layer",
            isDark: n
          }),
          y.jsx(jf, {
            currentLayer: L.layer,
            currentDatatype: L.datatype,
            isDark: n,
            onChange: A
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Kt, {
            label: "Path",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "Width",
            value: I,
            unit: r.unit,
            isDark: n,
            onChange: me
          }),
          y.jsx(Ht, {
            label: "Radius",
            value: se,
            unit: r.unit,
            isDark: n,
            onChange: Ee
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Kt, {
            label: "Position",
            isDark: n
          }),
          y.jsx(Ht, {
            label: "X",
            value: ge,
            unit: r.unit,
            isDark: n,
            onChange: (Me) => U("x", Me)
          }),
          y.jsx(Ht, {
            label: "Y",
            value: ve,
            unit: r.unit,
            isDark: n,
            onChange: (Me) => U("y", Me)
          }),
          y.jsx("div", {
            className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
          }),
          y.jsx(Kt, {
            label: "Waypoints",
            isDark: n
          }),
          y.jsx("div", {
            className: "flex max-h-48 flex-col overflow-y-auto",
            children: Le
          })
        ]
      });
    }
    const J = ce ? gt(ce.minX / Se, r) : "\u2014", W = ce ? gt(-ce.maxY / Se, r) : "\u2014", ie = ce ? gt((ce.maxX - ce.minX) / Se, r) : "\u2014", X = ce ? gt((ce.maxY - ce.minY) / Se, r) : "\u2014", ue = D || be;
    return y.jsxs("div", {
      ref: G,
      className: "flex flex-col pb-2",
      onWheel: (I) => I.stopPropagation(),
      children: [
        y.jsx("div", {
          className: "px-3 pt-2 pb-1",
          children: y.jsx("span", {
            className: B("text-xs font-medium select-none", n ? "text-white/70" : "text-black/70"),
            children: be ? `Polygon \xB7 ${L.vertexCount} vertices` : `${F.length} elements`
          })
        }),
        y.jsx("div", {
          className: B("mx-3 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        !D && y.jsxs(y.Fragment, {
          children: [
            y.jsx(Kt, {
              label: "Layer",
              isDark: n
            }),
            _e ? y.jsxs("div", {
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
            }) : y.jsx(jf, {
              currentLayer: L.layer,
              currentDatatype: L.datatype,
              isDark: n,
              onChange: A
            }),
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            })
          ]
        }),
        y.jsx(Kt, {
          label: "Position",
          isDark: n
        }),
        y.jsx(Ht, {
          label: "X",
          value: J,
          unit: r.unit,
          isDark: n,
          onChange: ue ? (I) => U("x", I) : void 0,
          readOnly: !ue
        }),
        y.jsx(Ht, {
          label: "Y",
          value: W,
          unit: r.unit,
          isDark: n,
          onChange: ue ? (I) => U("y", I) : void 0,
          readOnly: !ue
        }),
        y.jsx("div", {
          className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
        }),
        y.jsx(Kt, {
          label: "Size",
          isDark: n
        }),
        y.jsx(Ht, {
          label: "W",
          value: ie,
          unit: r.unit,
          isDark: n,
          onChange: be && !D ? (I) => N("width", I) : void 0,
          readOnly: !be || D
        }),
        y.jsx(Ht, {
          label: "H",
          value: X,
          unit: r.unit,
          isDark: n,
          onChange: be && !D ? (I) => N("height", I) : void 0,
          readOnly: !be || D
        }),
        (be || D) && y.jsxs(y.Fragment, {
          children: [
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            D && !be ? F.map((I, se) => y.jsx(Av, {
              vertices: I.vertices,
              unitInfo: r,
              isDark: n,
              onChangeVertex: R,
              onRemoveVertex: O,
              onAddVertex: H,
              readOnly: true,
              label: F.length > 1 ? `Vertices (${se + 1}/${F.length})` : void 0
            }, I.id)) : y.jsx(Av, {
              vertices: L.vertices,
              unitInfo: r,
              isDark: n,
              onChangeVertex: R,
              onRemoveVertex: O,
              onAddVertex: H,
              readOnly: D
            })
          ]
        }),
        fe && y.jsxs(y.Fragment, {
          children: [
            y.jsx("div", {
              className: B("mx-3 mt-1 h-px", n ? "bg-white/5" : "bg-black/5")
            }),
            y.jsx(M3, {
              sourceInfo: fe,
              isDark: n
            })
          ]
        })
      ]
    });
  }
  const I1 = [
    {
      id: "layers",
      icon: H4,
      label: "Layers",
      shortcut: "L"
    },
    {
      id: "inspector",
      icon: n4,
      label: "Inspector",
      shortcut: "I"
    }
  ];
  function A3({ isDark: l, onExpand: n }) {
    return y.jsx("div", {
      className: B("fixed top-4 right-4 z-40 flex w-[38px] flex-col items-center gap-1 rounded-xl border py-1", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: I1.map((r) => {
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
            className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
            children: y.jsx("div", {
              className: "flex h-4 w-4 items-center justify-center",
              children: y.jsx(o, {
                className: B("h-4 w-4", l ? "text-white/60" : "text-black/60")
              })
            })
          })
        }, r.id);
      })
    });
  }
  function Tv() {
    const n = pe((T) => T.theme) === "dark", r = pe((T) => T.sidebarCollapsed), o = pe((T) => T.toggleSidebarCollapsed), s = pe((T) => T.sidebarWidth), c = pe((T) => T.setSidebarWidth), { isSm: f } = gh(), { handleProps: d } = L1({
      side: "right",
      width: s,
      onResize: c
    }), m = pe((T) => T.sidebarTab), p = pe((T) => T.setSidebarTab), v = Wo((T) => T.isMinimized), [b, S] = g.useState(false), E = g.useRef(null);
    g.useEffect(() => {
      if (!f || !b) return;
      const T = (A) => {
        E.current && !E.current.contains(A.target) && S(false);
      };
      return document.addEventListener("mousedown", T), () => document.removeEventListener("mousedown", T);
    }, [
      f,
      b
    ]);
    const k = g.useCallback((T) => {
      p(T), f ? S(true) : o();
    }, [
      f,
      o,
      p
    ]), C = (v ? 0 : 206) + 24;
    if (r && !(f && b)) return y.jsx(A3, {
      isDark: n,
      onExpand: k
    });
    const _ = f && b;
    return y.jsxs(y.Fragment, {
      children: [
        _ && y.jsx("div", {
          className: "fixed inset-0 z-39"
        }),
        y.jsxs("div", {
          ref: E,
          className: B("fixed top-4 right-4 z-40 rounded-xl border", n ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]", _ && "shadow-xl"),
          style: {
            width: s
          },
          children: [
            y.jsx("div", {
              ...d
            }),
            y.jsxs("div", {
              className: "flex items-center gap-1 px-1 pt-1 pb-[3px]",
              children: [
                I1.map((T) => {
                  const A = T.icon, j = m === T.id;
                  return y.jsx(qn, {
                    label: T.label,
                    shortcut: {
                      modifiers: [
                        Ie.shift
                      ],
                      key: T.shortcut
                    },
                    children: y.jsx("button", {
                      onClick: () => p(T.id),
                      className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", j && (n ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: y.jsx("div", {
                        className: "flex h-4 w-4 items-center justify-center",
                        children: y.jsx(A, {
                          className: B("h-4 w-4", n ? "text-white/90" : "text-black/90")
                        })
                      })
                    })
                  }, T.id);
                }),
                !f && y.jsx("button", {
                  type: "button",
                  onClick: o,
                  className: B("ml-auto cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", n ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                  children: y.jsx(E1, {
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
              onWheel: (T) => T.stopPropagation(),
              children: [
                m === "layers" && y.jsx(E3, {}),
                m === "inspector" && y.jsx(R3, {})
              ]
            })
          ]
        })
      ]
    });
  }
  const T3 = (l) => {
    const n = 1 / (l * Se), r = Gv * n, o = sh(l), s = r / o.scale, c = fS.find((d) => d >= s) ?? s, f = o.unit === "mm" && c >= 1e3 ? c.toExponential(1) : c;
    return {
      length: c * o.scale,
      label: `${f} ${o.unit}`
    };
  }, Nv = "0.1.6";
  function N3({ isDark: l }) {
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
            Nv
          ]
        }),
        y.jsxs("div", {
          className: B("pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-56 rounded-lg border p-2.5 text-[11px] leading-relaxed opacity-0 transition-opacity group-hover:opacity-100", l ? "border-white/10 bg-[rgb(29,29,29)] text-white/70" : "border-black/10 bg-[rgb(241,241,241)] text-black/70"),
          children: [
            y.jsxs("span", {
              className: B("font-medium", l ? "text-white/90" : "text-black/90"),
              children: [
                "Rosette v",
                Nv,
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
  function O3({ isDark: l }) {
    const n = Dt((o) => o.message), r = Dt((o) => o.level);
    return n ? y.jsx("div", {
      className: "flex min-w-0 flex-1 items-center justify-center",
      children: y.jsx("span", {
        className: B("truncate text-[11px] select-none", r === "warn" && (l ? "text-yellow-400/80" : "text-yellow-600/80"), r === "error" && (l ? "text-red-400/80" : "text-red-600/80"), r === "info" && (l ? "text-white/50" : "text-black/50")),
        children: n
      })
    }) : y.jsx("div", {
      className: "flex-1"
    });
  }
  function D3({ isDark: l }) {
    const n = oe((m) => m.selectedIds), r = xe((m) => m.library), o = ye((m) => m.layers), s = nn((m) => m.pathMetadata), c = g.useMemo(() => {
      const m = n.size;
      if (m === 0 || !r) return null;
      const p = n.values().next().value, v = p.startsWith("ref:");
      if (m === 1 && v) {
        const w = r.get_cell_ref_info(p);
        if (w) {
          const C = w.cell_name;
          return w.free(), {
            label: `Instance "${C}"`,
            layerNumber: null,
            datatype: null
          };
        }
      }
      if (m === 1 && r.is_text_element(p)) {
        const w = r.get_text_element_info(p);
        if (w) return {
          label: `Text "${w.text.length > 20 ? w.text.slice(0, 20) + "\u2026" : w.text}"`,
          layerNumber: w.layer,
          datatype: w.datatype
        };
      }
      if (m === 1) {
        const w = s.get(p);
        if (w) return {
          label: `Path \xB7 ${w.waypoints.length} waypoints`,
          layerNumber: w.layer,
          datatype: w.datatype
        };
      }
      let b = null, S = null, E = false, k = 0;
      for (const w of n) {
        const C = r.get_element_info(w);
        if (C && (b === null ? (b = C.layer, S = C.datatype) : (C.layer !== b || C.datatype !== S) && (E = true), m === 1 && (k = C.vertices.length / 2), C.free(), E && m > 1)) break;
      }
      return m === 1 ? {
        label: `Polygon \xB7 ${k} vertices`,
        layerNumber: b,
        datatype: S
      } : E ? {
        label: `${m} elements \xB7 Mixed layers`,
        layerNumber: null,
        datatype: null
      } : {
        label: `${m} elements`,
        layerNumber: b,
        datatype: S
      };
    }, [
      n,
      r,
      s
    ]);
    if (!c) return null;
    const f = g.useMemo(() => {
      if (c.layerNumber === null) return null;
      for (const m of o.values()) if (m.layerNumber === c.layerNumber && m.datatype === c.datatype) return {
        name: m.name,
        color: m.color
      };
      return null;
    }, [
      c,
      o
    ]), d = c.layerNumber !== null ? ` \xB7 ${(f == null ? void 0 : f.name) ? `${c.layerNumber}/${c.datatype} ${f.name}` : `${c.layerNumber}/${c.datatype}`}` : "";
    return y.jsxs("div", {
      className: "flex min-w-0 flex-1 items-center justify-center gap-1.5",
      children: [
        f && y.jsx("div", {
          className: "h-2 w-2 flex-shrink-0 rounded-full -translate-y-px",
          style: {
            backgroundColor: f.color
          }
        }),
        y.jsxs("span", {
          className: B("truncate text-[11px] select-none", l ? "text-white/50" : "text-black/50"),
          children: [
            c.label,
            d
          ]
        })
      ]
    });
  }
  function I3({ isDark: l }) {
    const n = Dt((o) => o.message), r = oe((o) => o.selectedIds.size > 0);
    return n ? y.jsx(O3, {
      isDark: l
    }) : r ? y.jsx(D3, {
      isDark: l
    }) : y.jsx("div", {
      className: "flex-1"
    });
  }
  function Ov({ isDark: l, widthInPixels: n, label: r }) {
    return y.jsxs("div", {
      className: "flex items-center gap-1.5",
      children: [
        y.jsx("div", {
          className: B("h-px", l ? "bg-white/50" : "bg-black/50"),
          style: {
            width: `${Math.max(n, 20)}px`
          }
        }),
        y.jsx("span", {
          className: B("text-[10px] select-none pointer-events-none", l ? "text-white/40" : "text-black/40"),
          children: r
        })
      ]
    });
  }
  function Dv({ compact: l = false, minimal: n = false }) {
    const r = pe((T) => {
      var _a;
      return (_a = T.cursorWorld) == null ? void 0 : _a.x;
    }), o = pe((T) => {
      var _a;
      return (_a = T.cursorWorld) == null ? void 0 : _a.y;
    }), s = pe((T) => T.theme), c = ze((T) => T.zoom), f = pe((T) => T.zenMode), d = pe((T) => T.toggleZenMode), m = Wo((T) => T.isMinimized), p = Wo((T) => T.toggle), v = s === "dark", b = g.useMemo(() => sh(c), [
      c
    ]), S = g.useMemo(() => r !== void 0 ? gt(r, b) : "\u2014", [
      r,
      b
    ]), E = g.useMemo(() => o !== void 0 ? gt(o, b) : "\u2014", [
      o,
      b
    ]), { length: k, label: w } = g.useMemo(() => T3(c), [
      c
    ]), C = Math.min(k * c * Se, dS), _ = !l && !n;
    return y.jsxs("div", {
      className: "relative flex-shrink-0",
      children: [
        !_ && y.jsx("div", {
          className: "absolute bottom-full right-3 mb-2 font-mono text-[11px]",
          children: y.jsx(Ov, {
            isDark: v,
            widthInPixels: C,
            label: w
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
                    y.jsx(N3, {
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
                    b.unit
                  ]
                }) : y.jsxs(y.Fragment, {
                  children: [
                    y.jsx("span", {
                      className: B("select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "x:"
                    }),
                    y.jsx("span", {
                      className: B("w-18 text-right select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: S
                    }),
                    y.jsx("span", {
                      className: B("text-[10px] select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: b.unit
                    }),
                    y.jsx("span", {
                      className: B("mx-1 select-none pointer-events-none", v ? "text-white/20" : "text-black/20"),
                      children: "\xB7"
                    }),
                    y.jsx("span", {
                      className: B("select-none pointer-events-none", v ? "text-white/40" : "text-black/40"),
                      children: "y:"
                    }),
                    y.jsx("span", {
                      className: B("w-18 text-right select-none pointer-events-none", v ? "text-white/70" : "text-black/70"),
                      children: E
                    }),
                    y.jsx("span", {
                      className: B("text-[10px] select-none pointer-events-none", v ? "text-white/30" : "text-black/30"),
                      children: b.unit
                    })
                  ]
                })
              ]
            }),
            !n && y.jsx(I3, {
              isDark: v
            }),
            n && y.jsx("div", {
              className: "flex-1"
            }),
            y.jsxs("div", {
              className: "flex flex-shrink-0 items-center gap-2",
              children: [
                _ && y.jsx(Ov, {
                  isDark: v,
                  widthInPixels: C,
                  label: w
                }),
                y.jsx(qn, {
                  label: "Zen Mode",
                  position: "top",
                  children: y.jsx("button", {
                    onClick: d,
                    className: B("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", f && (v ? "bg-white/10" : "bg-black/10")),
                    children: y.jsx(TM, {
                      width: 14,
                      height: 14,
                      className: B(v ? "text-white/50" : "text-black/50")
                    })
                  })
                }),
                y.jsx(qn, {
                  label: "Minimap",
                  position: "top",
                  align: "end",
                  children: y.jsx("button", {
                    onClick: p,
                    className: B("flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors focus:outline-none", v ? "hover:bg-white/10" : "hover:bg-black/10", !m && (v ? "bg-white/10" : "bg-black/10")),
                    children: y.jsx(rM, {
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
  function z3({ title: l, titleId: n, ...r }, o) {
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
  const yh = g.forwardRef(z3);
  function H3({ title: l, titleId: n, ...r }, o) {
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
  const bh = g.forwardRef(H3), U3 = [
    {
      id: "select",
      icon: yh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "laser",
      icon: C1,
      label: "Laser Pointer",
      shortcut: "Q"
    },
    {
      id: "pan",
      icon: bh,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: hh,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: mh,
      label: "Zoom",
      shortcut: "Z"
    },
    {
      id: "ruler",
      icon: k1,
      label: "Ruler",
      shortcut: "U"
    }
  ], Iv = [
    {
      id: "rectangle",
      icon: xM,
      label: "Rectangle",
      shortcut: "R"
    },
    {
      id: "polygon",
      icon: Bk,
      label: "Polygon",
      shortcut: "G"
    },
    {
      id: "path",
      icon: Dk,
      label: "Path",
      shortcut: "H"
    },
    {
      id: "text",
      icon: HM,
      label: "Text",
      shortcut: "T"
    }
  ], Y3 = [
    {
      id: "select",
      icon: yh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: bh,
      label: "Pan",
      shortcut: "P"
    },
    {
      id: "move",
      icon: hh,
      label: "Move",
      shortcut: "M"
    },
    {
      id: "zoom",
      icon: mh,
      label: "Zoom",
      shortcut: "Z"
    }
  ], zv = [
    {
      id: "laser",
      icon: C1,
      label: "Laser Pointer",
      shortcut: "Q"
    },
    {
      id: "ruler",
      icon: k1,
      label: "Ruler",
      shortcut: "U"
    }
  ], B3 = [
    {
      id: "select",
      icon: yh,
      label: "Select",
      shortcut: "V"
    },
    {
      id: "pan",
      icon: bh,
      label: "Pan",
      shortcut: "P"
    }
  ];
  function Hv({ tool: l, isActive: n, onClick: r, isDark: o }) {
    const s = l.icon;
    return y.jsx(qn, {
      label: l.label,
      shortcut: {
        key: l.shortcut
      },
      children: y.jsx("button", {
        onClick: r,
        className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", o ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", n && (o ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(s, {
            className: B("h-5 w-5", o ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function Uv({ isDark: l }) {
    return y.jsx("div", {
      className: B("mx-0 h-6 w-[1px]", l ? "bg-white/10" : "bg-black/10")
    });
  }
  function X3({ isDark: l, overflowBaseTools: n, overflowShapeTools: r, showInstance: o, showCommands: s }) {
    const [c, f] = g.useState(false), d = g.useRef(null), m = g.useRef(null), { activeTool: p, setTool: v } = Xt(), b = ln((w) => w.open), S = ln((w) => w.toggle), E = [
      ...n,
      ...r
    ].some((w) => w.id === p);
    g.useEffect(() => {
      if (!c) return;
      const w = (_) => {
        var _a, _b2;
        const T = _.target;
        !((_a = m.current) == null ? void 0 : _a.contains(T)) && !((_b2 = d.current) == null ? void 0 : _b2.contains(T)) && f(false);
      }, C = (_) => {
        _.key === "Escape" && f(false);
      };
      return document.addEventListener("mousedown", w, true), document.addEventListener("keydown", C), () => {
        document.removeEventListener("mousedown", w, true), document.removeEventListener("keydown", C);
      };
    }, [
      c
    ]);
    const k = g.useCallback(() => {
      if (!d.current) return {
        left: 0,
        top: 0
      };
      const w = d.current.getBoundingClientRect(), C = 200;
      let _ = w.left;
      return _ + C > window.innerWidth - 8 && (_ = window.innerWidth - C - 8), {
        left: _,
        top: w.bottom + 8
      };
    }, []);
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(qn, {
          label: "More tools",
          className: c ? "[&>div:last-child]:hidden" : void 0,
          children: y.jsx("button", {
            ref: d,
            onClick: () => f(!c),
            className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", (E || c) && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
            children: y.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: y.jsx(bk, {
                className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        c && li.createPortal(y.jsxs("div", {
          ref: m,
          className: B("fixed z-[9999] min-w-[180px] rounded-xl border p-1 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: (() => {
            const w = k();
            return {
              left: `${w.left}px`,
              top: `${w.top}px`
            };
          })(),
          children: [
            n.length > 0 && y.jsx("div", {
              className: "flex flex-col",
              children: n.map((w) => {
                const C = w.icon, _ = p === w.id;
                return y.jsxs("button", {
                  onClick: () => {
                    v(w.id), f(false);
                  },
                  className: B("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", _ && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                  children: [
                    y.jsx(C, {
                      className: B("h-4 w-4", l ? "text-white/90" : "text-black/90")
                    }),
                    y.jsx("span", {
                      className: l ? "text-white/90" : "text-black/90",
                      children: w.label
                    }),
                    y.jsx("kbd", {
                      className: B("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                      children: w.shortcut
                    })
                  ]
                }, w.id);
              })
            }),
            r.length > 0 && y.jsxs(y.Fragment, {
              children: [
                y.jsx("div", {
                  className: B("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                y.jsx("div", {
                  className: "flex flex-col",
                  children: r.map((w) => {
                    const C = w.icon, _ = p === w.id;
                    return y.jsxs("button", {
                      onClick: () => {
                        v(w.id), f(false);
                      },
                      className: B("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", _ && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
                      children: [
                        y.jsx(C, {
                          className: B("h-4 w-4", l ? "text-white/90" : "text-black/90")
                        }),
                        y.jsx("span", {
                          className: l ? "text-white/90" : "text-black/90",
                          children: w.label
                        }),
                        y.jsx("kbd", {
                          className: B("ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]", l ? "border-white/15 bg-white/10 text-white/70" : "border-black/15 bg-black/10 text-black/70"),
                          children: w.shortcut
                        })
                      ]
                    }, w.id);
                  })
                })
              ]
            }),
            (o || s) && y.jsxs(y.Fragment, {
              children: [
                y.jsx("div", {
                  className: B("my-1 h-px", l ? "bg-white/10" : "bg-black/10")
                }),
                y.jsxs("div", {
                  className: "flex flex-col",
                  children: [
                    o && y.jsxs("button", {
                      onClick: () => {
                        b("add instance "), f(false);
                      },
                      className: B("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        y.jsx(_1, {
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
                    s && y.jsxs("button", {
                      onClick: () => {
                        S(), f(false);
                      },
                      className: B("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                      children: [
                        y.jsx(M1, {
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
  function Yv({ compact: l = false, minimal: n = false }) {
    const { activeTool: r, setTool: o } = Xt(), c = pe((k) => k.theme) === "dark", f = n ? B3 : l ? Y3 : U3, d = !l && !n, m = !l && !n, p = !l && !n, v = !l && !n, b = l || n, S = n ? [
      ...zv,
      {
        id: "move",
        icon: hh,
        label: "Move",
        shortcut: "M"
      },
      {
        id: "zoom",
        icon: mh,
        label: "Zoom",
        shortcut: "Z"
      }
    ] : l ? zv : [], E = l || n ? Iv : [];
    return y.jsxs("div", {
      className: B("fixed top-4 z-50 mx-auto w-fit", l || n ? "left-14 right-14" : "left-0 right-0", "flex items-center gap-1 rounded-xl border px-1 pt-1 pb-[3px]", c ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
      children: [
        f.map((k) => y.jsx(Hv, {
          tool: k,
          isActive: r === k.id,
          onClick: () => o(k.id),
          isDark: c
        }, k.id)),
        d && y.jsxs(y.Fragment, {
          children: [
            y.jsx(Uv, {
              isDark: c
            }),
            Iv.map((k) => y.jsx(Hv, {
              tool: k,
              isActive: r === k.id,
              onClick: () => o(k.id),
              isDark: c
            }, k.id))
          ]
        }),
        m && y.jsx(V3, {
          isDark: c
        }),
        p && y.jsx($3, {
          isDark: c
        }),
        y.jsx(Uv, {
          isDark: c
        }),
        v && y.jsx(q3, {
          isDark: c
        }),
        b && y.jsx(X3, {
          isDark: c,
          overflowBaseTools: S,
          overflowShapeTools: E,
          showInstance: true,
          showCommands: true
        })
      ]
    });
  }
  const Bv = [
    {
      id: "union",
      icon: $M,
      label: "Union",
      kind: "boolean"
    },
    {
      id: "subtract",
      icon: kM,
      label: "Subtract",
      kind: "boolean"
    },
    {
      id: "intersect",
      icon: ok,
      label: "Intersect",
      kind: "boolean"
    },
    {
      id: "xor",
      icon: ek,
      label: "Exclude",
      kind: "boolean"
    },
    {
      id: "align-left",
      icon: x4,
      label: "Align Left",
      kind: "align"
    },
    {
      id: "align-center-h",
      icon: $_,
      label: "Align Center H",
      kind: "align"
    },
    {
      id: "align-right",
      icon: k4,
      label: "Align Right",
      kind: "align"
    },
    {
      id: "center-align",
      icon: s4,
      label: "Center Align",
      kind: "align"
    },
    {
      id: "align-top",
      icon: T4,
      label: "Align Top",
      kind: "align"
    },
    {
      id: "align-center-v",
      icon: F_,
      label: "Align Center V",
      kind: "align"
    },
    {
      id: "align-bottom",
      icon: m4,
      label: "Align Bottom",
      kind: "align"
    },
    {
      id: "origin-align",
      icon: Wk,
      label: "Origin Align",
      kind: "align"
    }
  ];
  function Xv(l) {
    const { library: n, renderer: r } = xe.getState();
    if (!n || !r) return;
    const { selectedIds: o, lastSelectedId: s } = oe.getState();
    if (o.size !== 0) if (l.kind === "boolean") {
      if (o.size < 2) return;
      const c = [
        ...o
      ], f = s ?? c[0], d = new R0(c, l.id, f);
      de.getState().execute(d, {
        library: n,
        renderer: r
      });
    } else {
      const c = l.id;
      if (c !== "origin-align" && o.size < 2) return;
      const f = new L0(new Set(o), s, c);
      de.getState().execute(f, {
        library: n,
        renderer: r
      });
    }
  }
  function V3({ isDark: l }) {
    const [n, r] = g.useState(Bv[0]), [o, s] = g.useState(false), c = g.useRef(null), f = g.useRef(null), d = g.useRef(null), m = n.icon;
    g.useEffect(() => {
      if (!o) return;
      const A = (j) => {
        j.key === "Escape" && s(false);
      };
      return document.addEventListener("keydown", A), () => {
        document.removeEventListener("keydown", A);
      };
    }, [
      o
    ]);
    const p = g.useCallback(() => {
      d.current = setTimeout(() => s(false), 150);
    }, []), v = g.useCallback(() => {
      d.current && (clearTimeout(d.current), d.current = null);
    }, []), b = g.useCallback(() => {
      v(), s(true);
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
    ]), w = g.useCallback(() => {
      Xv(n);
    }, [
      n
    ]), C = g.useCallback((A) => {
      A.preventDefault(), s(true);
    }, []), _ = g.useCallback((A) => {
      r(A), s(false), setTimeout(() => Xv(A), 0);
    }, []), T = g.useCallback(() => {
      if (!c.current) return {
        left: 0,
        top: 0
      };
      const A = c.current.getBoundingClientRect(), j = 180, U = 160;
      let N = A.left, R = A.bottom + 8;
      return N + j > window.innerWidth - 8 && (N = window.innerWidth - j - 8), R + U > window.innerHeight - 8 && (R = A.top - U - 8), {
        left: N,
        top: R
      };
    }, []);
    return y.jsxs(y.Fragment, {
      children: [
        y.jsx(qn, {
          label: n.label,
          className: o ? "[&>div:last-child]:hidden" : void 0,
          children: y.jsx("button", {
            ref: c,
            onClick: w,
            onContextMenu: C,
            onMouseEnter: b,
            onMouseLeave: S,
            className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
            children: y.jsx("div", {
              className: "flex h-5 w-5 items-center justify-center",
              children: y.jsx(m, {
                className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
              })
            })
          })
        }),
        o && li.createPortal(y.jsx("div", {
          ref: f,
          onMouseEnter: E,
          onMouseLeave: k,
          className: B("fixed z-[9999] rounded-xl border p-2 backdrop-blur-xl", l ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]"),
          style: (() => {
            const A = T();
            return {
              left: `${A.left}px`,
              top: `${A.top}px`
            };
          })(),
          children: y.jsx("div", {
            className: "grid grid-cols-4 gap-1",
            children: Bv.map((A) => y.jsx(qn, {
              label: A.label,
              children: y.jsx("button", {
                onClick: () => _(A),
                className: B("cursor-pointer rounded-lg p-1.5 transition-colors", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]"),
                children: y.jsx(A.icon, {
                  className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
                })
              })
            }, A.id))
          })
        }), document.body)
      ]
    });
  }
  function $3({ isDark: l }) {
    const n = ln((c) => c.open), r = ln((c) => c.isOpen), o = ln((c) => c.initialSearch), s = r && !!o;
    return y.jsx(qn, {
      label: "Instance",
      shortcut: {
        key: "I"
      },
      children: y.jsx("button", {
        onClick: () => n("add instance "),
        className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", s && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(_1, {
            className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  function q3({ isDark: l }) {
    const n = ln((c) => c.isOpen), r = ln((c) => c.initialSearch), o = ln((c) => c.toggle), s = n && !r;
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
        className: B("cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none", l ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]", s && (l ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]")),
        children: y.jsx("div", {
          className: "flex h-5 w-5 items-center justify-center",
          children: y.jsx(M1, {
            className: B("h-5 w-5", l ? "text-white/90" : "text-black/90")
          })
        })
      })
    });
  }
  const G3 = 5e3;
  function P3() {
    const [l, n] = g.useState({
      status: "idle"
    }), [r, o] = g.useState(false), s = pe((p) => p.theme) === "dark", c = g.useRef(null), f = g.useRef("");
    g.useEffect(() => {
      if (!Dn) return;
      const p = setTimeout(async () => {
        try {
          n({
            status: "checking"
          });
          const { check: v } = await ht(async () => {
            const { check: S } = await import("./index-DWHWQ1OU.js");
            return {
              check: S
            };
          }, __vite__mapDeps([3,1]), import.meta.url), b = await v();
          b ? (c.current = b, f.current = b.version, n({
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
      }, G3);
      return () => clearTimeout(p);
    }, []);
    const d = g.useCallback(async () => {
      const p = c.current;
      if (p) try {
        const v = f.current;
        n({
          status: "downloading",
          version: v,
          progress: 0
        });
        let b = 0, S = 1;
        await p.downloadAndInstall((E) => {
          switch (E.event) {
            case "Started":
              S = E.data.contentLength ?? 1;
              break;
            case "Progress":
              b += E.data.chunkLength ?? 0, n({
                status: "downloading",
                version: v,
                progress: Math.min(b / S, 1)
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
        const { relaunch: p } = await ht(async () => {
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
      className: B("fixed bottom-10 right-4 z-[200] flex w-72 flex-col gap-2 rounded-xl border p-3 shadow-lg backdrop-blur-xl animate-[update-toast-in_0.3s_ease-out]", s ? "border-white/10 bg-[rgb(29,29,29)]/95 text-white/90" : "border-black/10 bg-[rgb(241,241,241)]/95 text-black/90"),
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
              className: B("flex h-5 w-5 items-center justify-center rounded transition-colors", s ? "hover:bg-white/10 text-white/40" : "hover:bg-black/10 text-black/40"),
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
          className: B("text-[11px]", s ? "text-white/50" : "text-black/50"),
          children: [
            "v",
            l.version,
            " is ready to install"
          ]
        }),
        l.status === "error" && y.jsx("p", {
          className: B("text-[11px]", s ? "text-red-400/80" : "text-red-600/80"),
          children: l.message
        }),
        l.status === "downloading" && y.jsx("div", {
          className: B("h-1 w-full overflow-hidden rounded-full", s ? "bg-white/10" : "bg-black/10"),
          children: y.jsx("div", {
            className: "h-full rounded-full bg-brand-purple transition-[width] duration-300 ease-out",
            style: {
              width: `${Math.round(l.progress * 100)}%`
            }
          })
        }),
        l.status === "available" && y.jsx("button", {
          type: "button",
          onClick: d,
          className: "mt-0.5 flex h-7 items-center justify-center rounded-lg border border-brand-purple-dark/50 bg-brand-purple px-3 text-xs font-medium text-white shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15 transition-colors hover:bg-brand-purple-light active:translate-y-px",
          children: "Download and install"
        }),
        l.status === "downloading" && y.jsxs("p", {
          className: B("text-center text-[11px]", s ? "text-white/40" : "text-black/40"),
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
          className: B("mt-0.5 flex h-7 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors active:translate-y-px", s ? "border-white/10 text-white/70 hover:bg-white/5" : "border-black/10 text-black/70 hover:bg-black/5"),
          children: "Dismiss"
        })
      ]
    });
  }
  function K3() {
    const l = pe((d) => d.theme), n = pe((d) => d.zenMode), { isLg: r, isMd: o, isSm: s } = gh(), c = Zo(), f = g.useRef(null);
    return g.useEffect(() => {
      f.current === null ? r ? (pe.getState().setExplorerCollapsed(false), pe.getState().setSidebarCollapsed(false)) : (pe.getState().setExplorerCollapsed(true), pe.getState().setSidebarCollapsed(true)) : f.current && !r ? (pe.getState().setExplorerCollapsed(true), pe.getState().setSidebarCollapsed(true)) : !f.current && r && (pe.getState().setExplorerCollapsed(false), pe.getState().setSidebarCollapsed(false)), f.current = r;
    }, [
      r
    ]), g.useEffect(() => {
      if (!c) return;
      const d = OS();
      d !== null && (pe.getState().setExplorerWidth(d), pe.getState().setSidebarWidth(d));
    }, [
      c
    ]), g.useEffect(() => {
      if (!Dn || c) return;
      const d = async (m) => {
        if (m.metaKey || m.ctrlKey) {
          if (m.key === "n") m.preventDefault(), await ph();
          else if (m.key === "o") {
            m.preventDefault();
            const v = await t0();
            v && await Kf(v);
          } else if (m.key === "s" && m.shiftKey) m.preventDefault(), await Zf(true);
          else if (m.key === "s" && !m.shiftKey) m.preventDefault(), await Zf(false);
          else if (m.key === "t") {
            m.preventDefault();
            const v = Ve.getState().activeTabId;
            if (v) {
              Ko(v);
              const b = xe.getState().library;
              b && qo(v, b);
            }
            window.dispatchEvent(new CustomEvent("rosette-new-tab"));
          } else if (m.key === "w") {
            m.preventDefault();
            const v = Ve.getState().activeTabId;
            v && window.dispatchEvent(new CustomEvent("rosette-close-tab", {
              detail: v
            }));
          } else if (m.key === "[" && m.shiftKey) {
            m.preventDefault();
            const { tabs: v, activeTabId: b } = Ve.getState();
            if (v.length > 1 && b) {
              const E = (v.findIndex((k) => k.id === b) - 1 + v.length) % v.length;
              Hr(b, v[E].id), Ve.getState().setActiveTab(v[E].id);
            }
          } else if (m.key === "]" && m.shiftKey) {
            m.preventDefault();
            const { tabs: v, activeTabId: b } = Ve.getState();
            if (v.length > 1 && b) {
              const E = (v.findIndex((k) => k.id === b) + 1) % v.length;
              Hr(b, v[E].id), Ve.getState().setActiveTab(v[E].id);
            }
          }
        }
      };
      return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
    }, [
      c
    ]), g.useEffect(() => {
      if (c) return;
      const d = async (m) => {
        const p = m.detail;
        if (!p) return;
        const v = Ve.getState().getTab(p);
        if (!v) return;
        const b = Ve.getState().activeTabId === p;
        if ((b ? v.isDirty || $n.getState().isDirty : v.isDirty) && !await R1()) return;
        const E = Ve.getState(), k = E.tabs.findIndex((w) => w.id === p);
        if (b && E.tabs.length > 1) {
          const w = E.tabs.filter((_) => _.id !== p), C = k < w.length ? w[k].id : w[w.length - 1].id;
          Hr(p, C), Ve.getState().closeTab(p), qs(p);
        } else b && E.tabs.length === 1 ? (Ve.getState().closeTab(p), window.dispatchEvent(new CustomEvent("rosette-new-tab")), qs(p)) : (Ve.getState().closeTab(p), qs(p));
      };
      return window.addEventListener("rosette-close-tab", d), () => window.removeEventListener("rosette-close-tab", d);
    }, [
      c
    ]), g.useEffect(() => {
      if (!Dn || c) return;
      let d = null, m = false;
      return (async () => {
        try {
          const { getCurrentWebviewWindow: p } = await ht(async () => {
            const { getCurrentWebviewWindow: S } = await import("./webviewWindow-DoRoZnHQ.js");
            return {
              getCurrentWebviewWindow: S
            };
          }, __vite__mapDeps([5,1,2]), import.meta.url), b = await p().onDragDropEvent(async (S) => {
            if (S.payload.type === "drop") {
              const k = S.payload.paths.find((w) => w.endsWith(".gds") || w.endsWith(".gds2") || w.endsWith(".gdsii"));
              k && await Kf(k);
            }
          });
          m ? b() : d = b;
        } catch {
        }
      })(), () => {
        m = true, d == null ? void 0 : d();
      };
    }, [
      c
    ]), c ? y.jsxs("div", {
      className: `flex h-screen w-screen flex-col ${l === "dark" ? "bg-black" : "bg-white"}`,
      children: [
        y.jsxs("div", {
          className: "relative min-h-0 flex-1",
          children: [
            y.jsx(nb, {}),
            !n && y.jsx(Yv, {
              compact: !r,
              minimal: s
            }),
            !n && y.jsx(jv, {}),
            !n && y.jsx(Tv, {}),
            !s && y.jsx(Lv, {}),
            y.jsx(vb, {})
          ]
        }),
        y.jsx(Dv, {
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
            y.jsx(nb, {}),
            !n && y.jsx(Yv, {
              compact: !r,
              minimal: s
            }),
            !n && y.jsx(jv, {}),
            !n && y.jsx(Tv, {}),
            !s && y.jsx(Lv, {}),
            y.jsx(vb, {})
          ]
        }),
        y.jsx(Dv, {
          compact: o || s,
          minimal: s
        }),
        y.jsx(P3, {})
      ]
    });
  }
  Ww.createRoot(document.getElementById("root")).render(y.jsx(g.StrictMode, {
    children: y.jsx(K3, {})
  }));
})();
