---
id: suspense
title: Suspense
---

> NOTE: Suspense mode for Vu Query is experimental, same as Suspense for data fetching itself. These APIs WILL change and should not be used in production unless you lock both your React and Vu Query versions to patch-level versions that are compatible with each other.

Vu Query can also be used with Vue's new Suspense for Data Fetching API's. To enable this mode, you can set either the global or query level config's `suspense` option to `true`.

Global configuration:

```js
// Configure for all queries
import { QueryClient, QueryClientProvider } from 'vu-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
})

const Root = defineComponent({
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )
  }
})
```

Query configuration:

```js
import { useQuery } from 'vu-query'

// Enable for an individual query
useQuery(queryKey, queryFn, { suspense: true })
```

When using suspense mode, `status` states and `error` objects are not needed and are then replaced by usage of the `Suspense` component (including the use of the `fallback` prop and Vue error boundaries for catching errors). Please read the [Resetting Error Boundaries](#resetting-error-boundaries) and look at the [Suspense Example](https://codesandbox.io/s/github/tannerlinsley/react-query/tree/master/examples/suspense) for more information on how to set up suspense mode.

In addition to queries behaving differently in suspense mode, mutations also behave a bit differently. By default, instead of supplying the `error` variable when a mutation fails, it will be thrown during the next render of the component it's used in and propagate to the nearest error boundary, similar to query errors. If you wish to disable this, you can set the `useErrorBoundary` option to `false`. If you wish that errors are not thrown at all, you can set the `throwOnError` option to `false` as well!

## Resetting Error Boundaries

Whether you are using **suspense** or **useErrorBoundaries** in your queries, you will need a way to let queries know that you want to try again when re-rendering after some error occured.

Query errors can be reset with the `QueryErrorResetBoundary` component or with the `useQueryErrorResetBoundary` hook.

When using the component it will reset any query errors within the boundaries of the component:

```js
import { QueryErrorResetBoundary } from 'vu-query'
import { ErrorBoundary } from 'vu-error-boundary'

const App = defineComponent({
  components: {
    QueryErrorResetBoundary,
    ErrorBoundary
  },
  template: ` 
  <QueryErrorResetBoundary>
      <template #default="{ reset }">
        <ErrorBoundary @reset="reset">
          <Page />
          <template #fallback="{ resetErrorBoundary, error }">
            <div>
              There was an error!&nbsp;
              <button @click="() => resetErrorBoundary()">Try again</button>
              <pre :style="{ whiteSpace: 'normal' }">{{ error }}</pre>
            </div>
          </template>
        </ErrorBoundary>
      </template>
    </QueryErrorResetBoundary>
    `
})
```

When using the hook it will reset any query errors within the closest `QueryErrorResetBoundary`. If there is no boundary defined it will reset them globally:

```js
import { useQueryErrorResetBoundary } from 'vu-query'
import { ErrorBoundary } from 'react-error-boundary'

const App = defineComponent({
  components: {
    ErrorBoundary
  },
  setup() {
    const { reset } = useQueryErrorResetBoundary()

    return { reset }
  },
  template: ` 
        <ErrorBoundary @reset="reset">
          <Page />
          <template #fallback="{ resetErrorBoundary, error }">
            <div>
              There was an error!&nbsp;
              <button @click="() => resetErrorBoundary()">Try again</button>
              <pre :style="{ whiteSpace: 'normal' }">{{ error }}</pre>
            </div>
          </template>
        </ErrorBoundary>
    `
})
```

## Fetch-on-render vs Render-as-you-fetch

Out of the box, Vu Query in `suspense` mode works really well as a **Fetch-on-render** solution with no additional configuration. This means that when your components attempt to mount, they will trigger query fetching and suspend, but only once you have imported them and mounted them. If you want to take it to the next level and implement a **Render-as-you-fetch** model, we recommend implementing [Prefetching](./prefetching) on routing callbacks and/or user interactions events to start loading queries before they are mounted and hopefully even before you start importing or mounting their parent components.
