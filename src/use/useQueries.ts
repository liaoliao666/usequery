import { reactive, readonly, watchEffect, onMounted, onUnmounted } from 'vue'

import { QueriesObserver } from '../core/queriesObserver'
import { useQueryClient } from './QueryClientProvider'
import { UseQueryOptions, UseQueryResult } from './types'
import { replaceEqualShallow } from '../core/utils'

export function useQueries(
  queriesArg: UseQueryOptions[] | (() => UseQueryOptions[])
): UseQueryResult[] {
  const queryClient = useQueryClient()

  // Create queries observer
  let observer!: QueriesObserver

  watchEffect(() => {
    const queries = typeof queriesArg === 'function' ? queriesArg() : queriesArg

    if (observer) {
      // Update queries
      if (observer.hasListeners()) {
        observer.setQueries(queries)
      }
    } else {
      observer = new QueriesObserver(queryClient, queries)
    }
  })

  const currentResult = reactive(observer.getCurrentResult())

  let unsubscribe: () => void
  // Subscribe to the observer
  onMounted(() => {
    unsubscribe = observer.subscribe(result => {
      replaceEqualShallow(currentResult, result)
    })
  })
  onUnmounted(() => {
    unsubscribe?.()
  })

  return readonly(currentResult) as UseQueryResult[]
}
