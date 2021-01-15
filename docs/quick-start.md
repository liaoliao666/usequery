---
id: quick-start
title: Quick Start
---

This example very briefly illustrates the 3 core concepts of Vu Query:

- Queries
- Mutations
- Query Invalidation

```js
import { defineComponent, createApp } from 'vue'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'vu-query'
import { getTodos, postTodo } from '../my-api'

const Todos = defineComponent(() => {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery('todos', getTodos)

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('todos')
    },
  })

  return () => (
    <div>
      <ul>
        {query.data?.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
})

// Create a client
const queryClient = new QueryClient()

const App = defineComponent({
  render() {
    return (
      // Provide the client to your App
      <QueryClientProvider client={queryClient}>
        <Todos />
      </QueryClientProvider>
    )
  },
})

createApp(App).mount('#app')
```

These three concepts make up most of the core functionality of Vu Query. The next sections of the documentation will go over each of these core concepts in great detail.
