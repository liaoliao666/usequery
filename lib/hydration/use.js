"use strict";

exports.__esModule = true;
exports.useHydrate = useHydrate;
exports.Hydrate = void 0;

var _vue = require("vue");

var _use = require("../use");

var _hydration = require("./hydration");

function useHydrate(state, options) {
  var queryClient = (0, _use.useQueryClient)();
  var rawOptions = (0, _vue.toRaw)(options); // Running hydrate again with the same queries is safe,
  // it wont overwrite or initialize existing queries,
  // relying on useMemo here is only a performance optimization

  (0, _vue.watchEffect)(function () {
    if (state) {
      (0, _hydration.hydrate)(queryClient, state, rawOptions);
    }
  });
}

var Hydrate = (0, _vue.defineComponent)({
  name: 'Hydrate',
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var state = props.state,
        options = props.options;
    useHydrate(state, options);
    return slots["default"] == null ? void 0 : slots["default"]();
  }
});
exports.Hydrate = Hydrate;