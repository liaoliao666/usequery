import { defineComponent, toRaw, watchEffect } from 'vue';
import { useQueryClient } from '../use';
import { hydrate } from './hydration';
export function useHydrate(state, options) {
  var queryClient = useQueryClient();
  var rawOptions = toRaw(options); // Running hydrate again with the same queries is safe,
  // it wont overwrite or initialize existing queries,
  // relying on useMemo here is only a performance optimization

  watchEffect(function () {
    if (state) {
      hydrate(queryClient, state, rawOptions);
    }
  });
}
export var Hydrate = defineComponent({
  name: 'Hydrate',
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var state = props.state,
        options = props.options;
    useHydrate(state, options);
    return slots["default"] == null ? void 0 : slots["default"]();
  }
});