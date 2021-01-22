<template>
  <div class="loader"></div>
</template>

<script>
export default {
  setup() {},
}
</script>

<style>
@keyframes loader-rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loader {
  width: 8px;
  height: 8px;
  border: 4px solid #0052ec;
  border-right-color: transparent;
  border-radius: 50%;
  position: relative;
  animation: loader-rotate 1s linear infinite;
  top: 50%;
  display: inline-block;
  margin-left: 4px;
  vertical-align: middle;
}
</style>
