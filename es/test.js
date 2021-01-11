import { reactive, isReactive, toRaw } from 'vue';
var a = {
  a: {
    a: 1
  }
};
var b = reactive(a);
console.log(isReactive(b), isReactive(toRaw(b)), isReactive(toRaw(b).a), toRaw(b)); // watchEffect(() => {
//   console.log(toRaw(b.a.a))
// })
// a.a.a = 2

console.log(b.a.a);