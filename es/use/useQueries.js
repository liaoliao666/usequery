import { reactive, readonly, watchEffect, onMounted, onUnmounted } from 'vue';
import { QueriesObserver } from '../core/queriesObserver';
import { useQueryClient } from './QueryClientProvider';
import { replaceShallowEqualDeep } from '../core/utils';
export function useQueries(queries) {
  var queryClient = useQueryClient(); // Create queries observer

  var observer;
  watchEffect(function () {
    if (observer) {
      // Update queries
      if (observer.hasListeners()) {
        observer.setQueries(queries);
      }
    } else {
      observer = new QueriesObserver(queryClient, queries);
    }
  });
  var currentResult = reactive(observer.getCurrentResult());
  var unsubscribe; // Subscribe to the observer

  onMounted(function () {
    unsubscribe = observer.subscribe(function (result) {
      replaceShallowEqualDeep(currentResult, result);
    });
  });
  onUnmounted(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  });
  return readonly(currentResult);
}