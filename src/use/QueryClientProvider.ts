import { defineComponent, inject, onMounted, onUnmounted, provide } from 'vue'

import { QueryClient } from '../core'

const symbol = Symbol('QueryClientProvider')

export const useQueryClient = () => {
  const queryClient = inject<QueryClient | undefined>(symbol, undefined)

  if (!queryClient) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one')
  }

  return queryClient
}

export interface QueryClientProviderProps {
  client: QueryClient
}

export const QueryClientProvider = defineComponent({
  name: 'QueryClientProvider',
  props: {
    client: {
      type: QueryClient,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { client } = props

    provide(symbol, client)
    onMounted(() => {
      client.mount()
    })
    onUnmounted(() => {
      client.unmount()
    })

    return () => slots.default?.()
  },
})
