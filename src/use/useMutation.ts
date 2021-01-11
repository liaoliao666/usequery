import { reactive, readonly, watchEffect, onMounted, onUnmounted } from 'vue'

import { noop, parseMutationArgs } from '../core/utils'
import { MutationObserver } from '../core/mutationObserver'
import { useQueryClient } from './QueryClientProvider'
import {
  UseMutateFunction,
  UseMutationOptions,
  UseMutationResult,
} from './types'
import {
  MutationFunction,
  MutationKey,
  MutationObserverResult,
} from '../core/types'

// HOOK

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  arg1:
    | MutationKey
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg2?:
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const queryClient = useQueryClient()

  // Create mutation observer
  let observer: MutationObserver<TData, TError, TVariables, TContext>

  // Create mutation currentResult
  let currentResult!: UseMutationResult<TData, TError, TVariables, TContext>

  watchEffect(() => {
    const options = parseMutationArgs(arg1, arg2, arg3)

    if (observer) {
      // Update options
      if (observer.hasListeners()) {
        observer.setOptions(options)
      } else {
        // init observer & currentResult
        observer = new MutationObserver(queryClient, options)

        const mutate: UseMutateFunction<TData, TError, TVariables, TContext> = (
          variables,
          mutateOptions
        ) => {
          observer.mutate(variables, mutateOptions).catch(noop)
        }

        currentResult = reactive({
          ...observer.getCurrentResult(),
          mutate,
          mutateAsync: observer.getCurrentResult().mutate,
        }) as UseMutationResult<TData, TError, TVariables, TContext>
      }
    }
  })

  let unsubscribe: () => void
  onMounted(() => {
    // Subscribe to the observer
    unsubscribe = observer.subscribe(
      (result: MutationObserverResult<TData, TError, TVariables, TContext>) => {
        // Check if the component is still mounted
        if (observer.hasListeners()) {
          Object.assign(currentResult, result)
        }
      }
    )
  })
  onUnmounted(() => {
    unsubscribe?.()
  })

  return readonly(currentResult) as UseMutationResult<
    TData,
    TError,
    TVariables,
    TContext
  >
}
