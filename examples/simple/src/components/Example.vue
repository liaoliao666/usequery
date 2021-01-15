<template>
  <span v-if="isLoading"></span>
  <span v-else-if="error">{{ 'An error has occurred: ' + error.message }}</span>
  <div v-else>
    <h1>{{ data.name }}</h1>
    <p>{{ data.description }}</p>
    <strong>👀 {{ data.subscribers_count }}</strong
    >&nbsp; <strong>✨ {{ data.stargazers_count }}</strong
    >&nbsp;
    <strong>🍴 {{ data.forks_count }}</strong>
    <div>{{ isFetching ? 'Updating...' : '' }}</div>
  </div>
  );
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

    const { isLoading, error, data, isFetching } = toRefs(query)

    return {
      isLoading,
      error,
      data,
      isFetching,
    }
  },
}
</script>
