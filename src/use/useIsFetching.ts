import { onMounted, onUnmounted, ref, Ref } from 'vue'

import { QueryKey } from '../core/types'
import { parseFilterArgs, QueryFilters } from '../core/utils'
import { useQueryClient } from './QueryClientProvider'

export function useIsFetching(filters?: QueryFilters): Ref<number>
export function useIsFetching(
  queryKey?: QueryKey,
  filters?: QueryFilters
): Ref<number>
export function useIsFetching(
  arg1?: QueryKey | QueryFilters,
  arg2?: QueryFilters
): Ref<number> {
  const queryClient = useQueryClient()
  const [filters] = parseFilterArgs(arg1, arg2)

  const isFetching = ref<number>(queryClient.isFetching(filters))

  let unsubscribe: () => void
  onMounted(() => {
    unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const newIsFetching = queryClient.isFetching(filters)
      isFetching.value = newIsFetching
    })
  })
  onUnmounted(() => {
    unsubscribe?.()
  })

  return isFetching
}
