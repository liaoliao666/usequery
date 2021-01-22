<template>
  <div className="App">
    <p>
      Hovering over a character will prefetch it, and when it's been prefetched
      it will turn <strong>bold</strong>. Clicking on a prefetched character
      will show their stats below immediately.
    </p>
    <h2>Characters</h2>
    <div v-if="charactersQuery.isLoading">Loading...</div>
    <template v-else>
      <ul>
        <li
          v-for="char in charactersQuery.data?.results"
          :key="char.id"
          @click="setSelectedChar(char.id)"
          @mouseenter="
            queryClient
              .prefetchQuery(
                ['character', { selectedChar: char.id }],
                () => getCharacter(char.id),
                {
                  staleTime: 10 * 1000,
                }
              )
              .then(() => $forceUpdate())
          "
        >
          <div
            :style="
              queryClient.getQueryData(['character', { selectedChar: char.id }])
                ? {
                    fontWeight: 'bold',
                  }
                : {}
            "
          >
            {{ char.id }} - {{ char.name }}
          </div>
        </li>
      </ul>

      <h3>Selected Character</h3>
      <div v-if="characterQuery.isLoading">Loading...</div>
      <pre v-else>{{ JSON.stringify(characterQuery.data, null, 2) }}</pre>
    </template>
  </div>
</template>

<script>
import { ref, unref } from 'vue'
import { useQueryClient, useQuery } from 'vu-query'
import axios from 'axios'
import { reactive } from 'vue'

const getCharacters = async () => {
  await new Promise(r => setTimeout(r, 500))
  const { data } = await axios.get('https://rickandmortyapi.com/api/character/')
  return data
}

const getCharacter = async selectedChar => {
  await new Promise(r => setTimeout(r, 500))
  const { data } = await axios.get(
    `https://rickandmortyapi.com/api/character/${selectedChar}`
  )
  return data
}

export default {
  setup() {
    const queryClient = useQueryClient()
    const selectedChar = ref(1)
    const setSelectedChar = val => {
      selectedChar.value = val
    }
    const charactersQuery = useQuery('characters', getCharacters)

    const characterQuery = useQuery(
      ['character', reactive({ selectedChar })],
      () => getCharacter(unref(selectedChar))
    )

    return {
      charactersQuery,
      characterQuery,
      queryClient,
      setSelectedChar,
      getCharacter,
    }
  },
}
</script>
