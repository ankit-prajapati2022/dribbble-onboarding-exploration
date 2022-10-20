var Dribbble = Dribbble || {};
(Dribbble.JsConfig = Dribbble.JsConfig || {}),
  (Dribbble.Hotkeys = {
    listeners: {},
    map: function (t, e, i) {
      return this.listeners[t] && this.listeners[t].off();
    },
  });
