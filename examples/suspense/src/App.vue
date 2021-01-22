<template>
  <QueryClientProvider :client="queryClient">
    <Example />
  </QueryClientProvider>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { QueryClient, QueryClientProvider } from 'vu-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
    },
  },
})
export default {
  name: 'App',
  components: {
    QueryClientProvider,
    Example: defineAsyncComponent(() => import('./components/Example.vue')),
  },
  setup() {
    return {
      queryClient,
    }
  },
}
</script>
