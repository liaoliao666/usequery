<script setup>
import { computed, toRefs, defineProps, watchEffect } from 'vue'
import { useQuery } from 'vu-query'
import axios from 'axios'
import { reactive } from 'vue'

const props = defineProps({
  postId: Number,
  setPostId: Function,
})

const getPostById = async id => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )
  return data
}

const { setPostId } = props
const query = useQuery(
  ['post', postId],
  () => getPostById(postId),
  reactive({
    enabled: computed(() => !!props.postId),
  })
)
const { status, data, error, isFetching } = toRefs(query)
</script>

<template>
  <div>
    <div>
      <a @click="setPostId(-1)" href="#"> Back </a>
    </div>
    <span v-if="!postId || status === 'loading'">Loading...</span>
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
