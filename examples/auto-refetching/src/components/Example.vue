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
      <input v-model="intervalMs" type="number" step="100" />&nbsp;
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
    <form
      @submit="
        event => {
          event.preventDefault()
          addMutation.mutate(value, {
            onSuccess: () => {
              value = ''
            },
          })
        }
      "
    >
      <input placeholder="enter something" v-model="value" />
    </form>
    <ul>
      <li v-for="item in data" :key="item">{{ item }}</li>
    </ul>
    <div>
      <button @click="clearMutation.mutate">Clear All</button>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from 'vu-query'
import dataApi from '../api/data'

export default {
  setup() {
    const queryClient = useQueryClient()
    const intervalMs = ref(1000)
    const value = ref('')

    const query = useQuery(
      'todos',
      async () => {
        return dataApi()
      },
      reactive({
        // Refetch the data every second
        refetchInterval: computed(() => Number(intervalMs.value)),
      })
    )

    const { status, data, error, isFetching } = toRefs(query)

    const addMutation = useMutation(value => dataApi({ add: value }), {
      onSuccess: () => queryClient.invalidateQueries('todos'),
    })

    const clearMutation = useMutation(() => dataApi({ clear: true }), {
      onSuccess: () => queryClient.invalidateQueries('todos'),
    })

    return {
      status,
      data,
      error,
      isFetching,
      addMutation,
      clearMutation,
      value,
      intervalMs,
    }
  },
}
</script>
