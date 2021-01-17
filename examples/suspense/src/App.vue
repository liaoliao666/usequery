<template>
  <QueryClientProvider :client="queryClient">
    <Suspense>
      <template #default><Example /></template>
      <template #fallback> loading </template>
    </Suspense>
  </QueryClientProvider>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { QueryClient, QueryClientProvider } from 'vu-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
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
