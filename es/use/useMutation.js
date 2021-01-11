import _extends from "@babel/runtime/helpers/esm/extends";
import { reactive, readonly, watchEffect, onMounted, onUnmounted } from 'vue';
import { noop, parseMutationArgs } from '../core/utils';
import { MutationObserver } from '../core/mutationObserver';
import { useQueryClient } from './QueryClientProvider';
export function useMutation(arg1, arg2, arg3) {
  var queryClient = useQueryClient(); // Create mutation observer

  var observer; // Create mutation currentResult

  var currentResult;
  watchEffect(function () {
    var options = parseMutationArgs(arg1, arg2, arg3);

    if (observer) {
      // Update options
      if (observer.hasListeners()) {
        observer.setOptions(options);
      } else {
        // init observer & currentResult
        observer = new MutationObserver(queryClient, options);

        var mutate = function mutate(variables, mutateOptions) {
          observer.mutate(variables, mutateOptions)["catch"](noop);
        };

        currentResult = reactive(_extends({}, observer.getCurrentResult(), {
          mutate: mutate,
          mutateAsync: observer.getCurrentResult().mutate
        }));
      }
    }
  });
  var unsubscribe;
  onMounted(function () {
    // Subscribe to the observer
    unsubscribe = observer.subscribe(function (result) {
      // Check if the component is still mounted
      if (observer.hasListeners()) {
        Object.assign(currentResult, result);
      }
    });
  });
  onUnmounted(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  });
  return readonly(currentResult);
}