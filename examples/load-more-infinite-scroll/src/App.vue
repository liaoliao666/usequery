<template>
  <QueryClientProvider :client="queryClient">
    <Example />
  </QueryClientProvider>
</template>

<script>
import { QueryClient, QueryClientProvider } from 'vu-query'
import Example from './components/Example'

const queryClient = new QueryClient()

export default {
  name: 'App',
  components: {
    QueryClientProvider,
    Example,
  },
  setup() {
    return {
      queryClient,
    }
  },
}
</script>
