---
id: useQueryErrorResetBoundary
title: useQueryErrorResetBoundary
---

This hook will reset any query errors within the closest `QueryErrorResetBoundary`. If there is no boundary defined it will reset them globally:

```js
import { useQueryErrorResetBoundary } from 'vue-query'
import { ErrorBoundary } from 'vue-error-boundary'

const App: Vue.FC = () => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <div>
          There was an error!
          <Button onClick={() => resetErrorBoundary()}>Try again</Button>
        </div>
      )}
    >
      <Page />
    </ErrorBoundary>
  )
}
```
