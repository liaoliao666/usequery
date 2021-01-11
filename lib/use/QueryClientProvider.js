"use strict";

exports.__esModule = true;
exports.QueryClientProvider = exports.useQueryClient = void 0;

var _vue = require("vue");

var symbol = Symbol('QueryClientProvider');

var useQueryClient = function useQueryClient() {
  var queryClient = (0, _vue.inject)(symbol, undefined);

  if (!queryClient) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one');
  }

  return queryClient;
};

exports.useQueryClient = useQueryClient;
var QueryClientProvider = (0, _vue.defineComponent)({
  name: 'QueryClientProvider',
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var client = props.client;
    (0, _vue.provide)(symbol, client);
    (0, _vue.onMounted)(function () {
      client.mount();
    });
    (0, _vue.onUnmounted)(function () {
      client.unmount();
    });
    return slots["default"] == null ? void 0 : slots["default"]();
  }
});
exports.QueryClientProvider = QueryClientProvider;