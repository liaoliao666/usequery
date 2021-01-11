"use strict";

exports.__esModule = true;
exports.useIsFetching = useIsFetching;

var _vue = require("vue");

var _utils = require("../core/utils");

var _QueryClientProvider = require("./QueryClientProvider");

function useIsFetching(arg1, arg2) {
  var queryClient = (0, _QueryClientProvider.useQueryClient)();

  var _parseFilterArgs = (0, _utils.parseFilterArgs)(arg1, arg2),
      filters = _parseFilterArgs[0];

  var isFetching = (0, _vue.ref)(queryClient.isFetching(filters));
  var unsubscribe;
  (0, _vue.onMounted)(function () {
    unsubscribe = queryClient.getQueryCache().subscribe(function () {
      var newIsFetching = queryClient.isFetching(filters);
      isFetching.value = newIsFetching;
    });
  });
  (0, _vue.onUnmounted)(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  });
  return isFetching;
}