<script setup>
import { toRefs, ref } from 'vue'
import { useQuery } from 'vu-query'

import Posts from './Posts'
import Post from './Post'

ref: postId = -1
const setPostId = id => (postId = id)
</script>

<template>
  <p>
    As you visit the posts below, you will notice them in a loading state the
    first time you load them. However, after you return to this list and click
    on any posts you have already visited again, you will see them load
    instantly and background refresh right before your eyes!{" "}
    <strong>
      (You may need to throttle your network speed to simulate longer loading
      sequences)
    </strong>
  </p>

  <Post v-if="postId > -1" :postId="postId" :setPostId="setPostId" />
  <Posts v-else :setPostId="setPostId" />
</template>

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
