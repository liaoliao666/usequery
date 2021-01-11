"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useMutation = useMutation;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _vue = require("vue");

var _utils = require("../core/utils");

var _mutationObserver = require("../core/mutationObserver");

var _QueryClientProvider = require("./QueryClientProvider");

function useMutation(arg1, arg2, arg3) {
  var queryClient = (0, _QueryClientProvider.useQueryClient)(); // Create mutation observer

  var observer; // Create mutation currentResult

  var currentResult;
  (0, _vue.watchEffect)(function () {
    var options = (0, _utils.parseMutationArgs)(arg1, arg2, arg3);

    if (observer) {
      // Update options
      if (observer.hasListeners()) {
        observer.setOptions(options);
      } else {
        // init observer & currentResult
        observer = new _mutationObserver.MutationObserver(queryClient, options);

        var mutate = function mutate(variables, mutateOptions) {
          observer.mutate(variables, mutateOptions)["catch"](_utils.noop);
        };

        currentResult = (0, _vue.reactive)((0, _extends2["default"])({}, observer.getCurrentResult(), {
          mutate: mutate,
          mutateAsync: observer.getCurrentResult().mutate
        }));
      }
    }
  });
  var unsubscribe;
  (0, _vue.onMounted)(function () {
    // Subscribe to the observer
    unsubscribe = observer.subscribe(function (result) {
      // Check if the component is still mounted
      if (observer.hasListeners()) {
        Object.assign(currentResult, result);
      }
    });
  });
  (0, _vue.onUnmounted)(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  });
  return (0, _vue.readonly)(currentResult);
}