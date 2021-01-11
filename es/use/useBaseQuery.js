import { onMounted, onUnmounted, watchEffect } from 'vue';
import { useQueryClient } from './QueryClientProvider';
export function useBaseQuery(optionsFn, Observer) {
  var queryClient = useQueryClient();
  var observer;
  watchEffect(function () {
    var defaultedOptions = queryClient.defaultQueryObserverOptions(optionsFn()); // Always set stale time when using suspense to prevent
    // fetching again when directly re-mounting after suspense

    if (defaultedOptions.suspense && typeof defaultedOptions.staleTime !== 'number') {
      defaultedOptions.staleTime = 1000;
    }

    if (observer) {
      // Update options
      if (observer.hasListeners()) {
        observer.setOptions(defaultedOptions);
      }
    } else {
      // Create query observer
      observer = new Observer(queryClient, defaultedOptions);
    }
  });
  var currentResult = observer.getReadonlyResult(); // Subscribe to the observer

  var unsubscribe;
  onMounted(function () {
    unsubscribe = observer.subscribe();
  });
  onUnmounted(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  }); // Handle suspense

  if (observer.options.suspense && currentResult.isLoading) {
    var _unsubscribe = observer.subscribe();

    throw observer.refetch()["finally"](_unsubscribe);
  }

  return currentResult;
}