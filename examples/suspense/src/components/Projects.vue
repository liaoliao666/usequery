<template>
  <div>
    <h1>Projects<Spinner v-if="isFetching" /></h1>
    <p v-for="project in data" :key="project.name">
      <Button
        @click="
          () => {
            // Prefetch the project query
            queryClient.prefetchQuery(
              ['project', { activeProject: project.name }],
              () => fetchProject(project.name)
            )
            $emit('setActiveProject', project.name)
          }
        "
      >
        Load </Button
      >&nbsp; {{ project.name }}
    </p>
  </div>
</template>

<script>
import { toRefs } from 'vue'
import { useQuery, useQueryClient } from 'vu-query'
import { when } from '@vueuse/core'

import { fetchProjects, fetchProject } from '../api/queries'
import Spinner from './Spinner.vue'
import Button from './Button.vue'

export default {
  components: {
    Spinner,
    Button,
  },
  emits: ['setActiveProject'],
  async setup() {
    const queryClient = useQueryClient()
    const query = useQuery('projects', fetchProjects)

    const { data, isFetching, isSuccess } = toRefs(query)

    await when(isSuccess).toBe(true)

    return {
      queryClient,
      data,
      isFetching,
      fetchProjects,
      fetchProject,
    }
  },
}
</script>
