<template>
  <div>
    <Button @click="$emit('setActiveProject', null)">Back</Button>
    <h1>{{ activeProject }} <Spinner v-if="isFetching" /></h1>
    <div v-if="data">
      <p>forks: {{ data.forks_count }}</p>
      <p>stars: {{ data.stargazers_count }}</p>
      <p>watchers: {{ data.watchers }}</p>
    </div>
    <br />
    <br />
  </div>
</template>

<script>
import { toRefs, reactive, computed } from 'vue'
import { useQuery } from 'vu-query'

import { fetchProject } from '../api/queries'
import Button from './Button.vue'
import Spinner from './Spinner.vue'

export default {
  components: {
    Button,
    Spinner,
  },
  props: {
    activeProject: {
      type: String,
    },
  },
  emits: ['setActiveProject'],
  setup(props) {
    const query = useQuery(
      reactive([
        'project',
        { activeProject: computed(() => props.activeProject) },
      ]),
      () => fetchProject(props.activeProject)
    )

    const { data, isFetching } = toRefs(query)

    return {
      data,
      isFetching,
    }
  },
}
</script>
