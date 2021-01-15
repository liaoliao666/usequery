import { reactive, unref } from 'vue'
import { useQuery } from 'vu-query'
import axios from 'axios'

const getPostById = async postId => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  )
  return data
}

export default function usePost(postId) {
  return useQuery(reactive(['post', postId]), () => getPostById(unref(postId)))
}
