<template>
  <div>
    <div>
      <a @click="props.setPostId(-1)" href="#"> Back </a>
    </div>
    <span v-if="!props.postId || status === 'loading'">Loading...</span>
    <span v-else-if="status === 'error'">Error: {{ error.message }}</span>
    <div v-else>
      <h1>{{ data.title }}</h1>
      <div>
        <p>{{ data.body }}</p>
      </div>
      <div>{{ isFetching ? 'Background Updating...' : ' ' }}</div>
    </div>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import { usePost } from '../composable/usePosts'

export default {
  props: {
    setPostId: Function,
    postId: Number,
  },
  setup(props) {
    const query = usePost(computed(() => props.postId))
    const { status, data, error, isFetching } = toRefs(query)

    return {
      status,
      data,
      error,
      isFetching,
      props,
    }
  },
}
</script>
