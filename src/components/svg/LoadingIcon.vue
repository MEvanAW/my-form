<template>
  <div class="bi" :class="classProp">
    <div class="my-circle my-solid-border"></div>
    <div class="my-circle my-loading"></div>
  </div>
</template>

<script setup>
//import { onMounted } from 'vue'

/*const props =*/ defineProps({
  classProp: String,
})

// const inputClass = ref({
//   'my-double-radio': true,
//   'is-invalid': false
// })
// onMounted(() => {
//   if (props.classProp) {
//     inputClass.value[props.classProp] = true
//   }
// })
</script>

<style scoped>
.my-double-radio {
  padding: 0.375rem 0.75rem;
}
</style>

<style scoped>
.my-circle {
  position: absolute;
  width: 1.28571429em;
  height: 1.28571429em;
  border-radius: 500rem;
}
.my-solid-border {
  border: 0.2em solid rgba(0, 0, 0, 0.1);
}
@keyframes my-button-spin {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
.my-loading {
  animation: my-button-spin 0.6s linear;
  animation-iteration-count: infinite;
  border-color: #d6d6d6 transparent transparent;
  border-style: solid;
  border-width: 0.2em;
  box-shadow: 0 0 0 1px transparent;
}
</style>
