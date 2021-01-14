<script setup>
import { toRefs } from 'vue'
import { useQuery } from 'vu-query'

const result = useQuery('repoData', () =>
  fetch('https://api.github.com/repos/liaoliao666/vu-query').then(res =>
    res.json()
  )
)
const { isLoading, error, data, isFetching } = toRefs(result)
</script>

<template>
  <span v-if="isLoading">Loading...</span>
  <span v-else-if="error">Loading...</span>
  <div v-else>
    <h1>{{ data.name }}</h1>
    <p>{{ data.description }}</p>
    <strong>👀 {{ data.subscribers_count }}</strong>
    <strong>✨ {{ data.stargazers_count }}</strong>
    <strong>🍴 {{ data.forks_count }}</strong>
    <div>{{ isFetching ? 'Updating...' : '' }}</div>
  </div>
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
