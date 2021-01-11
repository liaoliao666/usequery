"use strict";

exports.__esModule = true;
exports.useQueries = useQueries;

var _vue = require("vue");

var _queriesObserver = require("../core/queriesObserver");

var _QueryClientProvider = require("./QueryClientProvider");

var _utils = require("../core/utils");

function useQueries(queries) {
  var queryClient = (0, _QueryClientProvider.useQueryClient)(); // Create queries observer

  var observer;
  (0, _vue.watchEffect)(function () {
    if (observer) {
      // Update queries
      if (observer.hasListeners()) {
        observer.setQueries(queries);
      }
    } else {
      observer = new _queriesObserver.QueriesObserver(queryClient, queries);
    }
  });
  var currentResult = (0, _vue.reactive)(observer.getCurrentResult());
  var unsubscribe; // Subscribe to the observer

  (0, _vue.onMounted)(function () {
    unsubscribe = observer.subscribe(function (result) {
      (0, _utils.replaceShallowEqualDeep)(currentResult, result);
    });
  });
  (0, _vue.onUnmounted)(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  });
  return (0, _vue.readonly)(currentResult);
}