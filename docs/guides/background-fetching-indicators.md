---
id: background-fetching-indicators
title: Background Fetching Indicators
---

A query's `status === 'loading'` state is sufficient enough to show the initial hard-loading state for a query, but sometimes you may want to display an additional indicator that a query is refetching in the background. To do this, queries also supply you with an `isFetching` boolean that you can use to show that it's in a fetching state, regardless of the state of the `status` variable:

```js
const Todos = defineComponent({
  setup() {
    const query = useQuery('todos', fetchTodos)
    
    return () => {
       return query.status === 'loading' ? (
          <span>Loading...</span>
        ) : query.status === 'error' ? (
          <span>Error: {query.error.message}</span>
        ) : (
          <>
            {query.isFetching ? <div>Refreshing...</div> : null}

            <div>
              {query.data.map(todo => (
                <Todo todo={todo} />
              ))}
            </div>
          </>
        )
      }
    }
})
```

# Displaying Global Background Fetching Loading State

In addition to individual query loading states, if you would like to show a global loading indicator when **any** queries are fetching (including in the background), you can use the `useIsFetching` hook:

```js
import { useIsFetching } from 'vu-query'

const GlobalLoadingIndicator = defineComponent({
  setup() {
    const isFetching = useIsFetching()

    return () => {
      return isFetching.value ? (
        <div>Queries are fetching in the background...</div>
      ) : null
    }
  },
})
```
