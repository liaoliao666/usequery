<template>
  <QueryClientProvider :client="queryClient">
    <Example />
  </QueryClientProvider>
</template>

<script>
import { QueryClient, QueryClientProvider } from 'vu-query'
import Example from './components/Example'

const queryClient = new QueryClient()
export default {
  name: 'App',
  components: {
    QueryClientProvider,
    Example,
  },
  setup() {
    return {
      queryClient,
    }
  },
}
function Todos() {
  const page = ref(0)

  const fetchProjects = (page = 0) => fetch('/api/projects?page=' + page)

  const query = useQuery(
    ['projects', reactive({ page })],
    () => fetchProjects(page.value),
    { keepPreviousData: true }
  )

  return () => {
    return (
      <div>
        {query.isLoading ? (
          <div>Loading...</div>
        ) : query.sError ? (
          <div>Error: {query.error.message}</div>
        ) : (
          <div>
            {query.data.projects.map(project => (
              <p key={project.id}>{project.name}</p>
            ))}
          </div>
        )}
        <span>Current Page: {page.value + 1}</span>
        <button
          onClick={(page.value = Math.max(page.value - 1, 0))}
          disabled={page.value === 0}
        >
          Previous Page
        </button>{' '}
        <button
          onClick={() => {
            if (!query.isPreviousData && query.data.hasMore) {
              page.value = page.value + 1
            }
          }}
          // Disable the Next Page button until we know a next page is available
          disabled={query.isPreviousData || !query.data.hasMore}
        >
          Next Page
        </button>
        {query.isFetching ? <span> Loading...</span> : null}{' '}
      </div>
    )
  }
}
</script>
