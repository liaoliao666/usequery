"use strict";

var _vue = require("vue");

var a = {
  a: {
    a: 1
  }
};
var b = (0, _vue.reactive)(a);
console.log((0, _vue.isReactive)(b), (0, _vue.isReactive)((0, _vue.toRaw)(b)), (0, _vue.isReactive)((0, _vue.toRaw)(b).a), (0, _vue.toRaw)(b)); // watchEffect(() => {
//   console.log(toRaw(b.a.a))
// })
// a.a.a = 2

console.log(b.a.a);