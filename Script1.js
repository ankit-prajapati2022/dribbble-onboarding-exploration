(function (s) {
  function l(t, e) {
    return "function" == typeof t ? t.call(e) : t;
  }
  function e(t) {
    for (; (t = t.parentNode); ) if (t == document) return !0;
    return !1;
  }
  function d(t, e) {
    (this.$element = s(t)),
      (this.options = e),
      (this.enabled = !0),
      this.fixTitle();
  }
  (d.prototype = {
    show: function () {
      var t = this.getTitle();
      if (t && this.enabled) {
        var e = this.tip();
        e.find(".tipsy-inner")[this.options.html ? "html" : "text"](t),
          (e[0].className = "tipsy"),
          e
            .remove()
            .css({ top: 0, left: 0, visibility: "hidden", display: "block" })
            .prependTo(document.body);
        var i,
          n = s.extend({}, this.$element.offset(), {
            width: this.$element[0].offsetWidth,
            height: this.$element[0].offsetHeight,
          }),
          o = e[0].offsetWidth,
          a = e[0].offsetHeight,
          r = l(this.options.gravity, this.$element[0]);
        switch (r.charAt(0)) {
          case "n":
            i = {
              top: n.top + n.height + this.options.offset,
              left: n.left + n.width / 2 - o / 2,
            };
            break;
          case "s":
            i = {
              top: n.top - a - this.options.offset,
              left: n.left + n.width / 2 - o / 2,
            };
            break;
          case "e":
            i = {
              top: n.top + n.height / 2 - a / 2,
              left: n.left - o - this.options.offset,
            };
            break;
          case "w":
            i = {
              top: n.top + n.height / 2 - a / 2,
              left: n.left + n.width + this.options.offset,
            };
        }
        2 == r.length &&
          ("w" == r.charAt(1)
            ? (i.left = n.left + n.width / 2 - 15)
            : (i.left = n.left + n.width / 2 - o + 15)),
          e.css(i).addClass("tipsy-" + r),
          (e.find(".tipsy-arrow")[0].className =
            "tipsy-arrow tipsy-arrow-" + r.charAt(0)),
          this.options.className &&
            e.addClass(l(this.options.className, this.$element[0])),
          this.options.fade
            ? e
                .stop()
                .css({ opacity: 0, display: "block", visibility: "visible" })
                .animate({ opacity: this.options.opacity })
            : e.css({ visibility: "visible", opacity: this.options.opacity });
      }
    },
    hide: function () {
      this.options.fade
        ? this.tip()
            .stop()
            .fadeOut(function () {
              s(this).remove();
            })
        : this.tip().remove();
    },
    fixTitle: function () {
      var t = this.$element;
      (t.attr("title") || "string" != typeof t.attr("original-title")) &&
        t.attr("original-title", t.attr("title") || "").removeAttr("title");
    },
    getTitle: function () {
      if (this.enabled) {
        var t,
          e = this.$element,
          i = this.options;
        return (
          this.fixTitle(),
          "string" == typeof (i = this.options).title
            ? (t = e.attr("title" == i.title ? "original-title" : i.title))
            : "function" == typeof i.title && (t = i.title.call(e[0])),
          (t = ("" + t).replace(/(^\s*|\s*$)/, "")) || i.fallback
        );
      }
    },
    tip: function () {
      return (
        this.$tip ||
          ((this.$tip = s('<div class="tipsy"></div>').html(
            '<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>'
          )),
          this.$tip.data("tipsy-pointee", this.$element[0])),
        this.$tip
      );
    },
    validate: function () {
      this.$element[0].parentNode ||
        (this.hide(), (this.$element = null), (this.options = null));
    },
    enable: function () {
      this.enabled = !0;
    },
    disable: function () {
      this.enabled = !1;
    },
    toggleEnabled: function () {
      this.enabled = !this.enabled;
    },
  }),
    (s.fn.tipsy = function (i) {
      function e(t) {
        var e = s.data(t, "tipsy");
        return (
          e ||
            ((e = new d(t, s.fn.tipsy.elementOptions(t, i))),
            s.data(t, "tipsy", e)),
          e
        );
      }
      function t() {
        var t = e(this);
        (t.hoverState = "in"),
          0 == i.delayIn
            ? t.show()
            : (t.fixTitle(),
              setTimeout(function () {
                "in" == t.hoverState && t.show();
              }, i.delayIn));
      }
      function n() {
        var t = e(this);
        (t.hoverState = "out"),
          0 == i.delayOut
            ? t.hide()
            : setTimeout(function () {
                "out" == t.hoverState && t.hide();
              }, i.delayOut);
      }
      if (!0 === i) return this.data("tipsy");
      if ("string" == typeof i) {
        var o = this.data("tipsy");
        return o && o[i](), this;
      }
      if (
        ((i = s.extend({}, s.fn.tipsy.defaults, i)).live ||
          this.each(function () {
            e(this);
          }),
        "manual" != i.trigger)
      ) {
        var a = "hover" == i.trigger ? "mouseenter" : "focus",
          r = "hover" == i.trigger ? "mouseleave" : "blur";
        this.on(a, t).on(r, n);
      }
      return this;
    }),
    (s.fn.tipsy.defaults = {
      className: null,
      delayIn: 0,
      delayOut: 0,
      fade: !1,
      fallback: "",
      gravity: "n",
      html: !1,
      live: !1,
      offset: 0,
      opacity: 0.8,
      title: "title",
      trigger: "hover",
    }),
    (s.fn.tipsy.revalidate = function () {
      s(".tipsy").each(function () {
        var t = s.data(this, "tipsy-pointee");
        (t && e(t)) || s(this).remove();
      });
    }),
    (s.fn.tipsy.elementOptions = function (t, e) {
      return s.metadata ? s.extend({}, e, s(t).metadata()) : e;
    }),
    (s.fn.tipsy.autoNS = function () {
      return s(this).offset().top >
        s(document).scrollTop() + s(window).height() / 2
        ? "s"
        : "n";
    }),
    (s.fn.tipsy.autoWE = function () {
      return s(this).offset().left >
        s(document).scrollLeft() + s(window).width() / 2
        ? "e"
        : "w";
    }),
    (s.fn.tipsy.autoBounds = function (o, a) {
      return function () {
        var t = { ns: a[0], ew: 1 < a.length && a[1] },
          e = s(document).scrollTop() + o,
          i = s(document).scrollLeft() + o,
          n = s(this);
        return (
          n.offset().top < e && (t.ns = "n"),
          n.offset().left < i && (t.ew = "w"),
          s(window).width() + s(document).scrollLeft() - n.offset().left < o &&
            (t.ew = "e"),
          s(window).height() + s(document).scrollTop() - n.offset().top < o &&
            (t.ns = "s"),
          t.ns + (t.ew ? t.ew : "")
        );
      };
    });
})(jQuery),
  (function (r, i) {
    "use strict";
    var l = r.console || i,
      d = r.document,
      n = r.navigator,
      o = !1,
      a = r.setTimeout,
      s = r.clearTimeout,
      c = r.setInterval,
      u = r.clearInterval,
      h = r.JSON,
      f = r.alert,
      b = (r.History = r.History || {}),
      p = r.history;
    if (
      ((h.stringify = h.stringify || h.encode),
      (h.parse = h.parse || h.decode),
      "undefined" != typeof b.init)
    )
      (b.initCore = function () {
        if (
          ((b.initCore.initialized = !0),
          (b.normalizeState = function (t) {
            var e, i;
            return (
              (t && "object" == typeof t) || (t = {}),
              "undefined" != typeof t.normalized
                ? t
                : ((t.data && "object" == typeof t.data) || (t.data = {}),
                  ((e = { normalized: !0 }).title = t.title || ""),
                  (e.url = b.getFullUrl(t.url ? t.url : b.getLocationHref())),
                  (e.hash = b.getShortUrl(e.url)),
                  (e.data = b.cloneObject(t.data)),
                  (e.id = b.getIdByState(e)),
                  (e.cleanUrl = e.url.replace(/\??\&_suid.*/, "")),
                  (e.url = e.cleanUrl),
                  (i = !b.isEmptyObject(e.data)),
                  (e.title || i) &&
                    !0 !== b.options.disableSuid &&
                    ((e.hash = b
                      .getShortUrl(e.url)
                      .replace(/\??\&_suid.*/, "")),
                    /\?/.test(e.hash) || (e.hash += "?"),
                    (e.hash += "&_suid=" + e.id)),
                  (e.hashedUrl = b.getFullUrl(e.hash)),
                  (b.emulated.pushState || b.bugs.safariPoll) &&
                    b.hasUrlDuplicate(e) &&
                    (e.url = e.hashedUrl),
                  e)
            );
          }),
          (b.createStateObject = function (t, e, i) {
            var n = { data: t, title: e, url: i };
            return (n = b.normalizeState(n));
          }),
          (b.getStateById = function (t) {
            return (t = String(t)), b.idToState[t] || b.store.idToState[t] || i;
          }),
          (b.getStateString = function (t) {
            var e;
            return (
              (e = {
                data: b.normalizeState(t).data,
                title: t.title,
                url: t.url,
              }),
              h.stringify(e)
            );
          }),
          (b.getStateId = function (t) {
            return b.normalizeState(t).id;
          }),
          (b.getHashByState = function (t) {
            return b.normalizeState(t).hash;
          }),
          (b.extractId = function (t) {
            var e, i;
            return (
              (i = -1 != t.indexOf("#") ? t.split("#")[0] : t),
              ((e = /(.*)\&_suid=([0-9]+)$/.exec(i)) && e[1]) || t,
              (e ? String(e[2] || "") : "") || !1
            );
          }),
          (b.isTraditionalAnchor = function (t) {
            return !/[\/\?\.]/.test(t);
          }),
          (b.extractState = function (t, e) {
            var i,
              n,
              o = null;
            return (
              (e = e || !1),
              (i = b.extractId(t)) && (o = b.getStateById(i)),
              o ||
                ((n = b.getFullUrl(t)),
                (i = b.getIdByUrl(n) || !1) && (o = b.getStateById(i)),
                !o &&
                  e &&
                  !b.isTraditionalAnchor(t) &&
                  (o = b.createStateObject(null, null, n))),
              o
            );
          }),
          (b.getIdByUrl = function (t) {
            return b.urlToId[t] || b.store.urlToId[t] || i;
          }),
          (b.getLastSavedState = function () {
            return b.savedStates[b.savedStates.length - 1] || i;
          }),
          (b.getLastStoredState = function () {
            return b.storedStates[b.storedStates.length - 1] || i;
          }),
          (b.hasUrlDuplicate = function (t) {
            var e;
            return (e = b.extractState(t.url)) && e.id !== t.id;
          }),
          (b.storeState = function (t) {
            return (
              (b.urlToId[t.url] = t.id),
              b.storedStates.push(b.cloneObject(t)),
              t
            );
          }),
          (b.isLastSavedState = function (t) {
            var e = !1;
            return (
              b.savedStates.length && (e = t.id === b.getLastSavedState().id), e
            );
          }),
          (b.saveState = function (t) {
            return (
              !b.isLastSavedState(t) &&
              (b.savedStates.push(b.cloneObject(t)), !0)
            );
          }),
          (b.getStateByIndex = function (t) {
            return void 0 === t
              ? b.savedStates[b.savedStates.length - 1]
              : t < 0
              ? b.savedStates[b.savedStates.length + t]
              : b.savedStates[t];
          }),
          (b.getCurrentIndex = function () {
            return b.savedStates.length < 1 ? 0 : b.savedStates.length - 1;
          }),
          (b.getHash = function (t) {
            var e = b.getLocationHref(t);
            return b.getHashByUrl(e);
          }),
          (b.unescapeHash = function (t) {
            var e = b.normalizeHash(t);
            return (e = decodeURIComponent(e));
          }),
          (b.normalizeHash = function (t) {
            return t.replace(/[^#]*#/, "").replace(/#.*/, "");
          }),
          (b.setHash = function (t, e) {
            var i, n;
            return !1 !== e && b.busy()
              ? (b.pushQueue({
                  scope: b,
                  callback: b.setHash,
                  args: arguments,
                  queue: e,
                }),
                !1)
              : (b.busy(!0),
                (i = b.extractState(t, !0)) && !b.emulated.pushState
                  ? b.pushState(i.data, i.title, i.url, !1)
                  : b.getHash() !== t &&
                    (b.bugs.setHash
                      ? ((n = b.getPageUrl()),
                        b.pushState(null, null, n + "#" + t, !1))
                      : (d.location.hash = t)),
                b);
          }),
          (b.escapeHash = function (t) {
            var e = b.normalizeHash(t);
            return (
              (e = r.encodeURIComponent(e)),
              b.bugs.hashEscape ||
                (e = e
                  .replace(/\%21/g, "!")
                  .replace(/\%26/g, "&")
                  .replace(/\%3D/g, "=")
                  .replace(/\%3F/g, "?")),
              e
            );
          }),
          (b.getHashByUrl = function (t) {
            var e = String(t).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
            return (e = b.unescapeHash(e));
          }),
          (b.setTitle = function (t) {
            var e,
              i = t.title;
            i ||
              ((e = b.getStateByIndex(0)) &&
                e.url === t.url &&
                (i = e.title || b.options.initialTitle));
            try {
              d.getElementsByTagName("title")[0].innerHTML = i
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace(" & ", " &amp; ");
            } catch (n) {}
            return (d.title = i), b;
          }),
          (b.queues = []),
          (b.busy = function (t) {
            if (
              (void 0 !== t
                ? (b.busy.flag = t)
                : "undefined" == typeof b.busy.flag && (b.busy.flag = !1),
              !b.busy.flag)
            ) {
              s(b.busy.timeout);
              var n = function () {
                var t, e, i;
                if (!b.busy.flag)
                  for (t = b.queues.length - 1; 0 <= t; --t)
                    0 !== (e = b.queues[t]).length &&
                      ((i = e.shift()),
                      b.fireQueueItem(i),
                      (b.busy.timeout = a(n, b.options.busyDelay)));
              };
              b.busy.timeout = a(n, b.options.busyDelay);
            }
            return b.busy.flag;
          }),
          (b.busy.flag = !1),
          (b.fireQueueItem = function (t) {
            return t.callback.apply(t.scope || b, t.args || []);
          }),
          (b.pushQueue = function (t) {
            return (
              (b.queues[t.queue || 0] = b.queues[t.queue || 0] || []),
              b.queues[t.queue || 0].push(t),
              b
            );
          }),
          (b.queue = function (t, e) {
            return (
              "function" == typeof t && (t = { callback: t }),
              void 0 !== e && (t.queue = e),
              b.busy() ? b.pushQueue(t) : b.fireQueueItem(t),
              b
            );
          }),
          (b.clearQueue = function () {
            return (b.busy.flag = !1), (b.queues = []), b;
          }),
          (b.stateChanged = !1),
          (b.doubleChecker = !1),
          (b.doubleCheckComplete = function () {
            return (b.stateChanged = !0), b.doubleCheckClear(), b;
          }),
          (b.doubleCheckClear = function () {
            return (
              b.doubleChecker && (s(b.doubleChecker), (b.doubleChecker = !1)), b
            );
          }),
          (b.doubleCheck = function (t) {
            return (
              (b.stateChanged = !1),
              b.doubleCheckClear(),
              b.bugs.ieDoubleCheck &&
                (b.doubleChecker = a(function () {
                  return b.doubleCheckClear(), b.stateChanged || t(), !0;
                }, b.options.doubleCheckInterval)),
              b
            );
          }),
          (b.safariStatePoll = function () {
            var t = b.extractState(b.getLocationHref());
            if (!b.isLastSavedState(t))
              return (
                t || b.createStateObject(), b.Adapter.trigger(r, "popstate"), b
              );
          }),
          (b.back = function (t) {
            return !1 !== t && b.busy()
              ? (b.pushQueue({
                  scope: b,
                  callback: b.back,
                  args: arguments,
                  queue: t,
                }),
                !1)
              : (b.busy(!0),
                b.doubleCheck(function () {
                  b.back(!1);
                }),
                p.go(-1),
                !0);
          }),
          (b.forward = function (t) {
            return !1 !== t && b.busy()
              ? (b.pushQueue({
                  scope: b,
                  callback: b.forward,
                  args: arguments,
                  queue: t,
                }),
                !1)
              : (b.busy(!0),
                b.doubleCheck(function () {
                  b.forward(!1);
                }),
                p.go(1),
                !0);
          }),
          (b.go = function (t, e) {
            var i;
            if (0 < t) for (i = 1; i <= t; ++i) b.forward(e);
            else {
              if (!(t < 0))
                throw new Error(
                  "History.go: History.go requires a positive or negative integer passed."
                );
              for (i = -1; t <= i; --i) b.back(e);
            }
            return b;
          }),
          b.emulated.pushState)
        ) {
          var t = function () {};
          (b.pushState = b.pushState || t),
            (b.replaceState = b.replaceState || t);
        } else
          (b.onPopState = function (t, e) {
            var i,
              n,
              o = !1,
              a = !1;
            return (
              b.doubleCheckComplete(),
              (i = b.getHash())
                ? ((n = b.extractState(i || b.getLocationHref(), !0))
                    ? b.replaceState(n.data, n.title, n.url, !1)
                    : (b.Adapter.trigger(r, "anchorchange"), b.busy(!1)),
                  (b.expectedStateId = !1))
                : ((a = (o = b.Adapter.extractEventData("state", t, e) || !1)
                    ? b.getStateById(o)
                    : b.expectedStateId
                    ? b.getStateById(b.expectedStateId)
                    : b.extractState(b.getLocationHref())) ||
                    (a = b.createStateObject(null, null, b.getLocationHref())),
                  (b.expectedStateId = !1),
                  b.isLastSavedState(a)
                    ? (b.busy(!1), !1)
                    : (b.storeState(a),
                      b.saveState(a),
                      b.setTitle(a),
                      b.Adapter.trigger(r, "statechange"),
                      b.busy(!1),
                      !0))
            );
          }),
            b.Adapter.bind(r, "popstate", b.onPopState),
            (b.pushState = function (t, e, i, n) {
              if (b.getHashByUrl(i) && b.emulated.pushState)
                throw new Error(
                  "History.js does not support states with fragement-identifiers (hashes/anchors)."
                );
              if (!1 !== n && b.busy())
                return (
                  b.pushQueue({
                    scope: b,
                    callback: b.pushState,
                    args: arguments,
                    queue: n,
                  }),
                  !1
                );
              b.busy(!0);
              var o = b.createStateObject(t, e, i);
              return (
                b.isLastSavedState(o)
                  ? b.busy(!1)
                  : (b.storeState(o),
                    (b.expectedStateId = o.id),
                    p.pushState(o.id, o.title, o.url),
                    b.Adapter.trigger(r, "popstate")),
                !0
              );
            }),
            (b.replaceState = function (t, e, i, n) {
              if (b.getHashByUrl(i) && b.emulated.pushState)
                throw new Error(
                  "History.js does not support states with fragement-identifiers (hashes/anchors)."
                );
              if (!1 !== n && b.busy())
                return (
                  b.pushQueue({
                    scope: b,
                    callback: b.replaceState,
                    args: arguments,
                    queue: n,
                  }),
                  !1
                );
              b.busy(!0);
              var o = b.createStateObject(t, e, i);
              return (
                b.isLastSavedState(o)
                  ? b.busy(!1)
                  : (b.storeState(o),
                    (b.expectedStateId = o.id),
                    p.replaceState(o.id, o.title, o.url),
                    b.Adapter.trigger(r, "popstate")),
                !0
              );
            });
        if (o) {
          try {
            b.store = h.parse(o.getItem("History.store")) || {};
          } catch (e) {
            b.store = {};
          }
          b.normalizeStore();
        } else (b.store = {}), b.normalizeStore();
        b.Adapter.bind(r, "unload", b.clearAllIntervals),
          b.saveState(b.storeState(b.extractState(b.getLocationHref(), !0))),
          o &&
            ((b.onUnload = function () {
              var t, e, i;
              try {
                t = h.parse(o.getItem("History.store")) || {};
              } catch (d) {
                t = {};
              }
              for (e in ((t.idToState = t.idToState || {}),
              (t.urlToId = t.urlToId || {}),
              (t.stateToId = t.stateToId || {}),
              b.idToState))
                b.idToState.hasOwnProperty(e) &&
                  (t.idToState[e] = b.idToState[e]);
              for (e in b.urlToId)
                b.urlToId.hasOwnProperty(e) && (t.urlToId[e] = b.urlToId[e]);
              for (e in b.stateToId)
                b.stateToId.hasOwnProperty(e) &&
                  (t.stateToId[e] = b.stateToId[e]);
              (b.store = t), b.normalizeStore(), (i = h.stringify(t));
              try {
                o.setItem("History.store", i);
              } catch (n) {
                if (n.code !== DOMException.QUOTA_EXCEEDED_ERR) throw n;
                o.length &&
                  (o.removeItem("History.store"),
                  o.setItem("History.store", i));
              }
            }),
            b.intervalList.push(c(b.onUnload, b.options.storeInterval)),
            b.Adapter.bind(r, "beforeunload", b.onUnload),
            b.Adapter.bind(r, "unload", b.onUnload)),
          b.emulated.pushState ||
            (b.bugs.safariPoll &&
              b.intervalList.push(
                c(b.safariStatePoll, b.options.safariPollInterval)
              ),
            ("Apple Computer, Inc." !== n.vendor &&
              "Mozilla" !== (n.appCodeName || "")) ||
              (b.Adapter.bind(r, "hashchange", function () {
                b.Adapter.trigger(r, "popstate");
              }),
              b.getHash() &&
                b.Adapter.onDomLoad(function () {
                  b.Adapter.trigger(r, "hashchange");
                })));
      }),
      (!b.options || !b.options.delayInit) && b.init();
  })(window);

var Dribbble = Dribbble || {};
(Dribbble.JsConfig = Dribbble.JsConfig || {}),
  (Dribbble.Hotkeys = {
    listeners: {},
    map: function (t, e, i) {
      return (
        this.listeners[t] && this.listeners[t].off(),
        (this.listeners[t] = e),
        (this.listeners[t].isApplicable =
          i ||
          function () {
            return !0;
          }),
        (this.listeners[t].off = function () {
          delete this.listeners[t];
        }.bind(this)),
        this.listeners[t]
      );
    },
  }),
  (Dribbble.MessageModalNew = function MessageModalNew() {
    this.characterCounter = function (t, e, i) {
      function n() {
        (i.innerHTML = "Characters left: " + (e - t.value.length)),
          t.value.length > e
            ? ((i.innerHTML = "You have exceeded the character limit"),
              i.classList.add("text-red"))
            : i.classList.remove("text-red"),
          t.addEventListener("blur", function () {
            i.style.display = "none";
          }),
          t.addEventListener("focus", function () {
            i.style.display = "block";
          });
      }
    };
  });
