import { onMounted, onUnmounted, watchEffect } from 'vue'

import { QueryObserver } from '../core/queryObserver'
import { useQueryClient } from './QueryClientProvider'
import { useQueryErrorResetBoundary } from './QueryErrorResetBoundary'
import { UseBaseQueryOptions } from './types'

export function useBaseQuery<TQueryFnData, TError, TData, TQueryData>(
  optionsFn: () => UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData>,
  Observer: typeof QueryObserver
) {
  const queryClient = useQueryClient()
  const errorResetBoundary = useQueryErrorResetBoundary()

  let observer!: QueryObserver<any, any, any, any>

  watchEffect(() => {
    const defaultedOptions = queryClient.defaultQueryObserverOptions(
      optionsFn()
    )

    // Always set stale time when using suspense to prevent
    // fetching again when directly re-mounting after suspense
    if (
      defaultedOptions.suspense &&
      typeof defaultedOptions.staleTime !== 'number'
    ) {
      defaultedOptions.staleTime = 1000
    }

    if (observer) {
      // Update options
      if (observer.hasListeners()) {
        observer.setOptions(defaultedOptions)
      }
    } else {
      // Create query observer
      observer = new Observer(queryClient, defaultedOptions)
    }
  })

  const currentResult = observer.getReadonlyResult()

  // Subscribe to the observer
  let unsubscribe: () => void
  onMounted(() => {
    errorResetBoundary.clearReset()
    unsubscribe = observer.subscribe()
  })
  onUnmounted(() => {
    unsubscribe?.()
  })

  // Handle suspense
  watchEffect(
    () => {
      if (observer.options.suspense || observer.options.useErrorBoundary) {
        if (
          currentResult.isError &&
          !errorResetBoundary.isReset() &&
          !observer.getCurrentQuery().isFetching()
        ) {
          throw currentResult.error
        }
      }
    },
    {
      flush: 'pre',
    }
  )

  if (observer.options.suspense) {
    errorResetBoundary.clearReset()
    const unsubscribe = observer.subscribe()
    throw observer.refetch().finally(unsubscribe)
  }

  return currentResult
}
