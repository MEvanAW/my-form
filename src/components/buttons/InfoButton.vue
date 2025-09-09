<template>
  <button
    class="btn btn-primary text-light icon-link my-pointer-events-auto"
    :class="classRef"
    type="button"
    :disabled="disabled || isLoading"
    :title="title"
    :data-bs-toggle="dataBsToggle"
    :data-bs-target="dataBsTarget"
    @click="buttonClicked()"
  >
    <slot>Aksi</slot>
    <LoadingIcon v-if="isLoading" />
  </button>
</template>

<script setup>
import '@/assets/css/form.css'
import LoadingIcon from '../svg/LoadingIcon.vue'
import { onMounted, ref } from 'vue'

const { classProp, disabled } = defineProps({
  isLoading: Boolean,
  disabled: Boolean,
  title: String,
  dataBsToggle: String,
  dataBsTarget: String,
  classProp: String,
})
const emit = defineEmits(['buttonClicked'])

const classRef = ref({ 'my-forbidden': disabled })

onMounted(() => {
  classRef.value[classProp] = true
})

function buttonClicked() {
  emit('buttonClicked')
}
</script>
