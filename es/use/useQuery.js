import { QueryObserver } from '../core';
import { parseQueryArgs } from '../core/utils';
import { useBaseQuery } from './useBaseQuery'; // HOOK

export function useQuery(arg1, arg2, arg3) {
  return useBaseQuery(function () {
    return parseQueryArgs(arg1, arg2, arg3);
  }, QueryObserver);
}