import { defineComponent, inject, provide, renderSlot } from 'vue'

// CONTEXT

type QueryErrorResetBoundaryValue = {
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
    const value = createValue()
    provide(symbol, value)

    return () => renderSlot(slots, 'default', value)
  },
})
