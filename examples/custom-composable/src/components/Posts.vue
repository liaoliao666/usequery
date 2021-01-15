<template>
  <div>
    <h1>Posts</h1>
    <div>
      <span v-if="status === 'loading'"> Loading...</span>
      <span v-if="status === 'error'"> Error: {{ error.message }}</span>

      <div>
        <div>
          <p v-for="post in data" :key="post.id">
            <a
              @click="props.setPostId(post.id)"
              href="#"
              :style="
                // We can access the query data here to show bold links for
                // ones that are cached
                queryClient.getQueryData(['post', post.id])
                  ? {
                      fontWeight: 'bold',
                      color: 'green',
                    }
                  : {}
              "
            >
              {{ post.title }}
            </a>
          </p>
        </div>
        <div>{{ isFetching ? 'Background Updating...' : ' ' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs } from 'vue'
import { useQueryClient } from 'vu-query'
import usePosts from '../composable/usePosts'

export default {
  props: {
    setPostId: Function,
  },
  setup(props) {
    const queryClient = useQueryClient()
    const query = usePosts()
    const { status, data, error, isFetching } = toRefs(query)

    return {
      props,
      status,
      data,
      error,
      isFetching,
      queryClient,
    }
  },
}
</script>
