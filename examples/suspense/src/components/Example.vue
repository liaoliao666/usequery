<template>
  <Button
    @click="
      () => {
        if (!showProjects) {
          queryClient.prefetchQuery('projects', fetchProjects)
        }
        setShowProjects(!showProjects)
      }
    "
  >
    {{ showProjects ? 'Hide Projects' : 'Show Projects' }}
  </Button>

  <hr />

  <QueryErrorResetBoundary>
    <template #default="{ reset }">
      <ErrorBoundary @reset="reset">
        <Suspense v-if="showProjects">
          <template #default>
            <Project
              v-if="activeProject"
              :activeProject="activeProject"
              @setActiveProject="setActiveProject"
            />
            <Projects v-else @setActiveProject="setActiveProject" />
          </template>
          <template #fallback>
            <h1>Loading projects...</h1>
          </template>
        </Suspense>
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
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'
import { useQueryClient, QueryErrorResetBoundary } from 'vu-query'
import { ErrorBoundary } from 'vu-error-boundary'

import { fetchProjects } from '../api/queries'
import Button from './Button.vue'

export default {
  components: {
    ErrorBoundary,
    QueryErrorResetBoundary,
    Button,
    Projects: defineAsyncComponent(() => import('./Projects.vue')),
    Project: defineAsyncComponent(() => import('./Project.vue')),
  },
  setup() {
    const queryClient = useQueryClient()
    const showProjects = ref(false)
    const setShowProjects = bool => {
      showProjects.value = bool
    }
    const activeProject = ref(null)
    const setActiveProject = name => {
      activeProject.value = name
    }

    return {
      queryClient,
      showProjects,
      setShowProjects,
      activeProject,
      setActiveProject,
      fetchProjects,
    }
  },
}
</script>
