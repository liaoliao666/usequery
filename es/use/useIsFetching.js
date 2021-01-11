import { onMounted, onUnmounted, ref } from 'vue';
import { parseFilterArgs } from '../core/utils';
import { useQueryClient } from './QueryClientProvider';
export function useIsFetching(arg1, arg2) {
  var queryClient = useQueryClient();

  var _parseFilterArgs = parseFilterArgs(arg1, arg2),
      filters = _parseFilterArgs[0];

  var isFetching = ref(queryClient.isFetching(filters));
  var unsubscribe;
  onMounted(function () {
    unsubscribe = queryClient.getQueryCache().subscribe(function () {
      var newIsFetching = queryClient.isFetching(filters);
      isFetching.value = newIsFetching;
    });
  });
  onUnmounted(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  });
  return isFetching;
}