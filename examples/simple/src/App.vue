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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
