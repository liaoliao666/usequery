<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">An error has occurred: {{ error.message }}</div>
  <div v-else>
    <h1>{{ data.name }}</h1>
    <p>{{ data.description }}</p>
    <strong>👀 {{ data.subscribers_count }}</strong
    >&nbsp; <strong>✨ {{ data.stargazers_count }}</strong
    >&nbsp;
    <strong>🍴 {{ data.forks_count }}</strong>
    <div>{{ isFetching ? 'Updating...' : '' }}</div>
  </div>
</template>

<script>
import { toRefs } from 'vue'
import { useQuery } from 'vu-query'

export default {
  setup() {
    const query = useQuery('repoData', () =>
      fetch('https://api.github.com/repos/liaoliao666/vu-query').then(res =>
        res.json()
      )
    )

    const { data, isFetching, isLoading, error } = toRefs(query)

    return {
      data,
      isFetching,
      isLoading,
      error,
    }
  },
}
</script>
