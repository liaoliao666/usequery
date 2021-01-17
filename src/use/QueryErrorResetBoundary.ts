import { defineComponent, inject, provide } from 'vue'

// CONTEXT

interface QueryErrorResetBoundaryValue {
  clearReset: () => void
  isReset: () => boolean
  reset: () => void
}

function createValue(): QueryErrorResetBoundaryValue {
  let isReset = false
  return {
    clearReset: () => {
      isReset = false
    },
    reset: () => {
      isReset = true
    },
    isReset: () => {
      return isReset
    },
  }
}

const symbol = Symbol('QueryErrorResetBoundary')

// HOOK

export const useQueryErrorResetBoundary = () =>
  inject<QueryErrorResetBoundaryValue>(symbol, createValue())

// COMPONENT

export const QueryErrorResetBoundary = defineComponent({
  name: 'QueryErrorResetBoundary',
  setup(_, { slots }) {
    provide(symbol, createValue())

    return () => slots.default?.()
  },
})
