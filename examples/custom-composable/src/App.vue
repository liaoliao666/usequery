<template>
  <QueryClientProvider :client="queryClient">
    <p>
      This example is exactly the same as the basic example, but each query has
      been refactored to be it's own custom hook. This design is the suggested
      way to use Vu Query, as it makes it much easier to manage query keys and
      shared query logic.
    </p>

    <Post v-if="postId > -1" :postId="postId" :setPostId="setPostId" />
    <Posts v-else :setPostId="setPostId" />
  </QueryClientProvider>
</template>

<script>
import { ref } from 'vue'
import { QueryClient, QueryClientProvider } from 'vu-query'
import Posts from './components/Posts'
import Post from './components/Post'

const queryClient = new QueryClient()

export default {
  name: 'App',
  components: {
    QueryClientProvider,
    Posts,
    Post,
  },
  setup() {
    const postId = ref(-1)
    const setPostId = id => (postId.value = id)

    return {
      postId,
      setPostId,
      queryClient,
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
