<template>
  <div>
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
import { computed, toRefs } from 'vue'
import usePost from '../composable/usePost'

export default {
  async setup() {
    const query = useQuery('repoData', () =>
      fetch(
        'https://api.github.com/repos/tannerlinsley/react-query'
      ).then(res => res.json())
    )

    const { data, isFetching } = toRefs(query)

    return {
      data,
      isFetching,
    }
  },
}
</script>
