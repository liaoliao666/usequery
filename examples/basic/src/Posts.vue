<script setup>
import { defineProps, toRefs } from 'vue'
import { useQueryClient, useQuery } from 'vu-query'
import axios from 'axios'

const props = defineProps({
  setPostId: Function,
})

function usePosts() {
  return useQuery('posts', async () => {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )
    return data
  })
}

const { setPostId } = props
const queryClient = useQueryClient()
const query = usePosts()

const { status, data, error, isFetching } = toRefs(query)
</script>

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
              @click="setPostId(post.id)"
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
