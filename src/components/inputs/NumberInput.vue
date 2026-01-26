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
import { watch } from 'vue'
import { useNumberInput } from '@/composables/useNumberInput'

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
})
const emit = defineEmits(['change'])

const emptyString = ''

const { value, isInvalid, increment, decrement, clearInvalid, setMin, setMax } = useNumberInput(
  {
    min: min,
    max: max,
    step: 1,
    initialValue: 1,
  },
  emit,
)

const model = defineModel()
model.value = value.value

watch(value, (newValue) => {
  model.value = newValue
  clearInvalid()
  emit('change', newValue, props.id)
})

watch(model, (newModel) => {
  if (newModel !== value.value) {
    value.value = newModel
  }
})

watch(
  () => max,
  (newMax) => {
    setMax(newMax)
    if (value.value > newMax) {
      isInvalid.value = true
    }
  },
)

watch(
  () => min,
  (newMin) => {
    setMin(newMin)
  },
)
</script>

<style scoped>
.input-group-text.is-invalid {
  border-color: #dc3545;
}
.input-group-text.is-invalid:focus {
  outline-color: #dc3545;
}
</style>
