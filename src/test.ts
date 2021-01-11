import { reactive, isReactive, toRaw } from 'vue'

const a = {
  a: {
    a: 1,
  },
}

const b = reactive(a)

console.log(
  isReactive(b),
  isReactive(toRaw(b)),
  isReactive(toRaw(b).a),
  toRaw(b)
)

// watchEffect(() => {
//   console.log(toRaw(b.a.a))
// })

// a.a.a = 2

console.log(b.a.a)
