import { watchEffect } from 'vue'

export function test(dummy) {
  watchEffect(() => {
    console.log('test-dummy', dummy())

    //   const deepGet = values => {
    //     if (typeof values === 'object') {
    //       for (const key in values) {
    //         console.log('values[key]', values[key])
    //         deepGet(values[key])
    //       }
    //       return
    //     }
    //   }

    //   deepGet(dummy)
  })
}
