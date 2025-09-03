<template>
  <div
    class="input-group"
    :class="`${classProp} ${!disabled && isInvalid ? 'is-invalid' : emptyString}`"
  >
    <button class="btn my-btn-abu" type="button" @click="decrement()" :disabled="disabled">
      -
    </button>
    <input
      :id="id"
      v-model="model"
      class="input-group-text"
      :class="{ 'is-invalid': !disabled && isInvalid }"
      type="number"
      :min="min"
      :max="max"
      :disabled="disabled"
    />
    <button class="btn my-btn-abu" type="button" @click="increment()" :disabled="disabled">
      +
    </button>
  </div>
</template>

<script setup>
import '@/assets/css/form.css'
import { ref, watch } from 'vue'

const {
  disabled = false,
  max = 8,
  min = 1,
  ...props
} = defineProps({
  classProp: String,
  disabled: Boolean,
  id: String,
  max: Number,
  min: Number,
  value: Number,
})
const emit = defineEmits(['change'])

const emptyString = ''
const isInvalid = ref(false)
const model = ref(1)

watch(model, (newModel) => {
  if (newModel < min) {
    model.value = min
  } else if (newModel > max) {
    model.value = max
  }
  isInvalid.value = false
  emit('change', model.value, props.id)
})
watch(
  () => max,
  (newMax) => {
    if (model.value > newMax) {
      isInvalid.value = true
    }
  },
)
watch(
  () => props.value,
  (newValue) => {
    if (newValue || newValue === '') {
      model.value = newValue
    }
  },
)

function decrement() {
  if (model.value > min) {
    --model.value
  }
}
function increment() {
  if (model.value < max) {
    ++model.value
  }
}
</script>

<style scoped>
.input-group-text.is-invalid {
  border-color: #dc3545;
}
.input-group-text.is-invalid:focus {
  outline-color: #dc3545;
}
</style>
