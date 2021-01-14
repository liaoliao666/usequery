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
