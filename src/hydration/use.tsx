import { defineComponent, toRaw, watchEffect } from 'vue'

import { useQueryClient } from '../use'
import { hydrate, HydrateOptions } from './hydration'

export function useHydrate(state: unknown, options?: HydrateOptions) {
  const queryClient = useQueryClient()
  const rawOptions = toRaw(options)

  // Running hydrate again with the same queries is safe,
  // it wont overwrite or initialize existing queries,
  // relying on useMemo here is only a performance optimization
  watchEffect(() => {
    if (state) {
      hydrate(queryClient, state, rawOptions)
    }
  })
}

export interface HydrateProps {
  state?: unknown
  options?: HydrateOptions
}

export const Hydrate = defineComponent<HydrateProps>({
  name: 'Hydrate',
  setup(props, { slots }) {
    const { state, options } = props
    useHydrate(state, options)

    return slots.default?.()
  },
})
