import { defineComponent, PropType, toRaw, watchEffect } from 'vue'

import { useQueryClient } from '../use'
import { hydrate, HydrateOptions } from './hydration'

export function useHydrate(state: unknown, options?: HydrateOptions) {
  const queryClient = useQueryClient()

  // Running hydrate again with the same queries is safe,
  // it wont overwrite or initialize existing queries,
  // toRaw on watchEffect here is only a performance optimization
  watchEffect(() => {
    if (state) {
      hydrate(queryClient, state, toRaw(options))
    }
  })
}

export interface HydrateProps {
  state?: unknown
  options?: HydrateOptions
}

export const Hydrate = defineComponent({
  name: 'Hydrate',
  props: {
    state: Object as PropType<unknown>,
    options: Object as PropType<HydrateOptions>,
  },
  setup(props, { slots }) {
    const { state, options } = props
    useHydrate(state, options)

    return () => slots.default?.()
  },
})
