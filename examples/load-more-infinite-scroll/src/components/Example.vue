<template>
  <div>
    <h1>Infinite Loading</h1>
    <p v-if="status === 'loading'">Loading...</p>
    <span v-else-if="status === 'error'">Error: {{ error.message }}</span>
    <div v-else>
      <div>
        <button
          @click="fetchPreviousPage"
          :disabled="!hasPreviousPage || isFetchingPreviousPage"
        >
          {{
            isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Load Older'
              : 'Nothing more to load'
          }}
        </button>
      </div>
      <template v-for="page in data.pages" :key="page.nextId">
        <p
          v-for="project in page.data"
          :key="project.id"
          :style="{
            border: '1px solid gray',
            borderRadius: '5px',
            padding: '10rem 1rem',
            background: `hsla(${project.id * 30}, 60%, 80%, 1)`,
          }"
        >
          {{ project.name }}
        </p>
      </template>

      <div>
        <button
          ref="loadMoreButtonRef"
          @click="fetchNextPage"
          :disabled="!hasNextPage || isFetchingNextPage"
        >
          {{
            isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Load Newer'
              : 'Nothing more to load'
          }}
        </button>
      </div>
      <div>
        {{
          isFetching && !isFetchingNextPage ? 'Background Updating...' : null
        }}
      </div>
    </div>
    <hr />
    <!-- <Link href="/about">
      <a>Go to another page</a>
    </Link> -->
  </div>
</template>

<script>
import { toRefs, ref, reactive } from 'vue'
import { useInfiniteQuery } from 'vu-query'
import useIntersectionObserver from '../composable/useIntersectionObserver'
import loadProjects from '../api/projects'

export default {
  setup() {
    const query = useInfiniteQuery(
      'projects',
      async ({ pageParam = 0 }) => {
        const data = await loadProjects(pageParam)
        console.log(
          'data',
          data?.data.map(item => item.id)
        )
        return data
      },
      {
        getPreviousPageParam: firstPage => firstPage.previousId ?? false,
        getNextPageParam: lastPage => lastPage.nextId ?? false,
      }
    )

    const {
      status,
      data,
      error,
      isFetching,
      isFetchingNextPage,
      isFetchingPreviousPage,
      hasNextPage,
      hasPreviousPage,
    } = toRefs(query)

    const { fetchNextPage, fetchPreviousPage } = query

    const loadMoreButtonRef = ref()
    useIntersectionObserver(
      reactive({
        target: loadMoreButtonRef,
        onIntersect: fetchNextPage,
        enabled: hasNextPage,
      })
    )

    return {
      loadMoreButtonRef,
      status,
      data,
      error,
      isFetching,
      isFetchingNextPage,
      isFetchingPreviousPage,
      fetchNextPage,
      fetchPreviousPage,
      hasNextPage,
      hasPreviousPage,
    }
  },
}
</script>
