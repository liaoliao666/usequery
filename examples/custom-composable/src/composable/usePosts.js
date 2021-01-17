import { reactive, unref } from 'vue'
import { useQuery } from 'vu-query'
import axios from 'axios'

const getPosts = async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts')
  return data
}

export function usePosts() {
  return useQuery('posts', getPosts)
}

const getPostById = async postId => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  )
  return data
}

export function usePost(postId) {
  return useQuery(reactive(['post', { postId }]), () =>
    getPostById(unref(postId))
  )
}
