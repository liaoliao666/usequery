import { defineComponent, inject, onMounted, onUnmounted, provide } from 'vue';
var symbol = Symbol('QueryClientProvider');
export var useQueryClient = function useQueryClient() {
  var queryClient = inject(symbol, undefined);

  if (!queryClient) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one');
  }

  return queryClient;
};
export var QueryClientProvider = defineComponent({
  name: 'QueryClientProvider',
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var client = props.client;
    provide(symbol, client);
    onMounted(function () {
      client.mount();
    });
    onUnmounted(function () {
      client.unmount();
    });
    return slots["default"] == null ? void 0 : slots["default"]();
  }
});