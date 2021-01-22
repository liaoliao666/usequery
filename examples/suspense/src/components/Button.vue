<template>
  <button :disabled="loading">
    <slot />
    <Spinner v-if="loading" />
  </button>
</template>

<script>
import Spinner from './Spinner'

export default {
  components: { Spinner },
  props: {
    loading: {
      type: Boolean,
    },
  },
}
</script>
