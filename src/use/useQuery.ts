import { QueryObserver } from '../core'
import { QueryFunction, QueryKeyWithRef } from '../core/types'
import { parseQueryArgs } from '../core/utils'
import { UseQueryOptionsWithRef, UseQueryResult } from './types'
import { useBaseQuery } from './useBaseQuery'

// HOOK

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  options: UseQueryOptionsWithRef<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError>
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKeyWithRef,
  options?: UseQueryOptionsWithRef<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError>
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKeyWithRef,
  queryFn: QueryFunction<TQueryFnData>,
  options?: UseQueryOptionsWithRef<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError>
export function useQuery<TQueryFnData, TError, TData = TQueryFnData>(
  arg1: QueryKeyWithRef | UseQueryOptionsWithRef<TQueryFnData, TError, TData>,
  arg2?:
    | QueryFunction<TQueryFnData>
    | UseQueryOptionsWithRef<TQueryFnData, TError, TData>,
  arg3?: UseQueryOptionsWithRef<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError> {
  return useBaseQuery(() => parseQueryArgs(arg1, arg2, arg3), QueryObserver)
}
