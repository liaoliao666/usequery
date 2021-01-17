<template>
  <div>
    <p>
      In this example, new items can be created using a mutation. The new item
      will be optimistically added to the list in hopes that the server accepts
      the item. If it does, the list is refetched with the true items from the
      list. Every now and then, the mutation may fail though. When that happens,
      the previous list of items is restored and the list is again refetched
      from the server.
    </p>
    <form
      @submit="
        e => {
          e.preventDefault()
          addTodoMutation.mutate(text)
        }
      "
    >
      <input v-model="text" type="text" />
      <button>
        {{ addTodoMutation.isLoading ? 'Creating...' : 'Create' }}
      </button>
    </form>
    <br />
    <span v-if="status === 'loading'">Loading...</span>
    <span v-else-if="status === 'error'">{{ error.message }}</span>
    <span v-else>
      <div>Updated At: {{ new Date(data.ts).toLocaleTimeString() }}</div>
      <ul>
        <li v-for="datum in data.items" :key="datum">{{ datum }}</li>
      </ul>
      <div>{{ isFetching ? 'Updating in background...' : ' ' }}</div>
    </span>
  </div>
</template>

<script>
import { toRefs, ref } from 'vue'
import { useQueryClient, useQuery, useMutation } from 'vu-query'
import dataApi from '../api/data'

export default {
  setup() {
    const queryClient = useQueryClient()
    const text = ref('')

    const query = useQuery('todos', async () => {
      const data = await dataApi()
      return data
    })

    const addTodoMutation = useMutation(text => dataApi(text), {
      // Optimistically update the cache value on mutate, but store
      // the old value and return it so that it's accessible in case of
      // an error
      onMutate: async txt => {
        text.value = ''
        await queryClient.cancelQueries('todos')

        // copy previous value
        const previousValue = JSON.parse(
          JSON.stringify(queryClient.getQueryData('todos'))
        )

        queryClient.setQueryData('todos', old => {
          old.items.push(txt)

          return old
        })

        return previousValue
      },
      // On failure, roll back to the previous value
      onError: (err, variables, previousValue) => {
        queryClient.setQueryData('todos', previousValue)
      },
      // After success or failure, refetch the todos query
      onSuccess: () => {
        queryClient.invalidateQueries('todos')
      },
    })

    const { status, data, error, isFetching } = toRefs(query)

    return {
      status,
      data,
      error,
      isFetching,
      addTodoMutation,
      text,
    }
  },
}
</script>
