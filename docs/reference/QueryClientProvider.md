---
id: QueryClientProvider
title: QueryClientProvider
---

Use the `QueryClientProvider` component to connect and provide a `QueryClient` to your application:

```js
import { QueryClient, QueryClientProvider } from 'usequery'

const queryClient = new QueryClient()

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```
