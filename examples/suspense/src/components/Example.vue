<template>
  <h1 v-if="status === 'loading'">Loading...</h1>
  <span v-else-if="status === 'error'">Error: {{ error.message }}</span>
  <div v-else>
    <h1>Auto Refetch with stale-time set to 1s)</h1>
    <p>
      This example is best experienced on your own machine, where you can open
      multiple tabs to the same localhost server and see your changes propagate
      between the two.
    </p>
    <label>
      Query Interval speed (ms):&nbsp;
      <span
        :style="{
          display: 'inline-block',
          marginLeft: '.5rem',
          width: 10,
          height: 10,
          background: isFetching ? 'green' : 'transparent',
          transition: !isFetching ? 'all .3s ease' : 'none',
          borderRadius: '100%',
          transform: 'scale(2)',
        }"
      />
    </label>
    <h2>Todo List</h2>
    <ul>
      <li v-for="item in data" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
import { toRefs } from 'vue'
import { useQuery } from 'vu-query'
import { when } from '@vueuse/core'
import dataApi from '../api/data'

export default {
  async setup() {
    const query = useQuery('todos', async () => {
      return dataApi()
    })

    const { status, data, error, isFetching } = toRefs(query)

    await when(status).toBe('success')

    return {
      status,
      data,
      error,
      isFetching,
    }
  },
}
</script>
