<script setup>
import { QueryClientProvider, QueryClient } from 'v-use-query'

import App from './App.vue'

const queryClient = new QueryClient()
</script>

<template>
  <QueryClientProvider :client="queryClient">
    <App />
  </QueryClientProvider>
</template>

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
