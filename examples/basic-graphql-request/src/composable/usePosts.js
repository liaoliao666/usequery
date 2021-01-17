import { reactive, unref } from 'vue'
import { useQuery } from 'vu-query'
import { request, gql } from 'graphql-request'

const endpoint = 'https://graphqlzero.almansi.me/api'

const getPosts = async () => {
  const {
    posts: { data },
  } = await request(
    endpoint,
    gql`
      query {
        posts {
          data {
            id
            title
          }
        }
      }
    `
  )
  return data
}

export function usePosts() {
  return useQuery('posts', getPosts)
}

const getPostById = async postId => {
  const { post } = await request(
    endpoint,
    gql`
    query {
      post(id: ${postId}) {
        id
        title
        body
      }
    }
    `
  )

  return post
}

export function usePost(postId) {
  return useQuery(reactive(['post', { postId }]), () =>
    getPostById(unref(postId))
  )
}
