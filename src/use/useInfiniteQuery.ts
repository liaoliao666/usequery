import { QueryObserver } from '../core'
import { InfiniteQueryObserver } from '../core/infiniteQueryObserver'
import { QueryFunction, QueryKeyWithRef } from '../core/types'
import { parseQueryArgs } from '../core/utils'
import { UseInfiniteQueryOptionsWithRef, UseInfiniteQueryResult } from './types'
import { useBaseQuery } from './useBaseQuery'

// HOOK

export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  options: UseInfiniteQueryOptionsWithRef<TQueryFnData, TError, TData>
): UseInfiniteQueryResult<TData, TError>
export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKeyWithRef,
  options?: UseInfiniteQueryOptionsWithRef<TQueryFnData, TError, TData>
): UseInfiniteQueryResult<TData, TError>
export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKeyWithRef,
  queryFn: QueryFunction<TQueryFnData>,
  options?: UseInfiniteQueryOptionsWithRef<TQueryFnData, TError, TData>
): UseInfiniteQueryResult<TData, TError>
export function useInfiniteQuery<TQueryFnData, TError, TData = TQueryFnData>(
  arg1:
    | QueryKeyWithRef
    | UseInfiniteQueryOptionsWithRef<TQueryFnData, TError, TData>,
  arg2?:
    | QueryFunction<TQueryFnData>
    | UseInfiniteQueryOptionsWithRef<TQueryFnData, TError, TData>,
  arg3?: UseInfiniteQueryOptionsWithRef<TQueryFnData, TError, TData>
): UseInfiniteQueryResult<TData, TError> {
  return useBaseQuery(
    () => parseQueryArgs(arg1, arg2, arg3),
    InfiniteQueryObserver as typeof QueryObserver
  ) as UseInfiniteQueryResult<TData, TError>
}
