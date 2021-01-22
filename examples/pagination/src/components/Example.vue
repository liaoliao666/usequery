<template>
  <div>
    <p>
      In this example, each page of data remains visible as the next page is
      fetched. The buttons and capability to proceed to the next page are also
      supressed until the next page cursor is known. Each page is cached as a
      normal query too, so when going to previous pages, you'll see them
      instantaneously while they are also refetched invisibly in the background.
    </p>
    <div v-if="status === 'loading'">Loading...</div>
    <div v-else-if="status === 'error'">Error: {error.message}</div>
    <!-- `data` will either resolve to the latest page's data -->
    <!-- or if fetching a new page, the last successful page's data -->
    <div v-else>
      <p v-for="project in data.projects" :key="project.id">
        {{ project.name }}
      </p>
    </div>
    <div>Current Page: {{ page + 1 }}</div>
    <button @click="setPage(Math.max(page - 1, 0))" :disabled="page === 0">
      Previous Page</button
    >&nbsp;
    <button
      @click="setPage(data?.hasMore ? page + 1 : page)"
      :disabled="isPreviousData || !data?.hasMore"
    >
      Next Page
    </button>

    <!-- Since the last page's data potentially sticks around between page requests, -->
    <!-- we can use `isFetching` to show a background loading -->
    <!-- indicator since our `status === 'loading'` state won't be triggered -->
    <span v-if="isFetching"> Loading...</span>
    &nbsp;
  </div>
</template>

<script>
import { toRefs, ref, watch, unref, reactive } from 'vue'
import { useQueryClient, useQuery } from 'vu-query'
import loadProjects from '../api/projects'

export default {
  setup() {
    const queryClient = useQueryClient()
    const page = ref(0)
    const setPage = val => {
      page.value = val
    }

    const query = useQuery(
      reactive(['projects', { page }]),
      () => loadProjects(unref(page)),
      {
        keepPreviousData: true,
        staleTime: 5000,
      }
    )

    // Prefetch the next page!
    watch(
      page,
      () => {
        if (query.data?.hasMore) {
          const nextPage = unref(page) + 1
          queryClient.prefetchQuery(['projects', { page: nextPage }], () =>
            loadProjects(nextPage)
          )
        }
      },
      {
        immediate: true,
      }
    )

    const { status, data, error, isFetching, isPreviousData } = toRefs(query)

    return {
      status,
      data,
      error,
      isFetching,
      isPreviousData,
      page,
      setPage,
    }
  },
}
</script>
