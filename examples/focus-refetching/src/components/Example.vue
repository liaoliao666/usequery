<template>
  <div>
    <p>
      In this example, you should open two tabs, log in or out on one tab, then
      focus the other to see it sync up! (Pro Tip: Do NOT use incognito tabs)
    </p>
    <h1 v-if="status === 'loading'">Loading...</h1>
    <span v-else-if="status === 'error'">Error: {{ error.message }}</span>
    <div v-else-if="data.loggedIn">
      <h1>Welcome, {{ data.name }}</h1>
      <img :src="data.avatar" width="80" />
      <div>
        <button @click="logoutMutation.mutate">Logout</button>
      </div>
    </div>
    <div v-else>
      <h1>Please login</h1>
      <div>
        <button @click="loginMutation.mutate">Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs } from 'vue'
import { useQuery, useMutation, useQueryClient } from 'vu-query'
import userApi from '../api/user'

function login() {
  window['swr-test-token'] = 'swr'
}

function logout() {
  window['swr-test-token'] = ''
}

export default {
  setup() {
    const queryClient = useQueryClient()

    const query = useQuery('user', async () => {
      const data = await userApi()
      return data
    })

    const { status, data, error } = toRefs(query)

    const logoutMutation = useMutation(logout, {
      onSuccess: () => queryClient.invalidateQueries('user'),
    })

    const loginMutation = useMutation(login, {
      onSuccess: () => queryClient.invalidateQueries('user'),
    })

    return {
      status,
      data,
      error,
      logoutMutation,
      loginMutation,
    }
  },
}
</script>
