---
id: dependent-queries
title: Dependent Queries
---

Dependent (or serial) queries depend on previous ones to finish before they can execute. To achive this, it's as easy as using the `enabled` option to tell a query when it is ready to run:

```js
// Get the user
const qeury = useQuery(['user', email], getUserByEmail)

const userId = computed(() => query?.data?.id)

// Then get the user's projects
const query = useQuery(
  ['projects', reactive({ userId })],
  getProjectsByUser,
  reactive({
    // The query will not execute until the userId exists
    enabled: computed(() => !!unref(userId)),
  })
)

const { isIdle, data: projects } = toRefs(query)

// isIdle will be `true` until `enabled` is true and the query begins to fetch.
// It will then go to the `isLoading` stage and hopefully the `isSuccess` stage :)
```
