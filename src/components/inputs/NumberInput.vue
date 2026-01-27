<template>
  <div
    class="input-group"
    :class="`${classProp} ${!disabled && isInvalid ? 'is-invalid' : emptyString}`"
  >
    <button class="btn my-btn-abu" type="button" @click="decrement()" :disabled="disabled">
      -
    </button>
    <input
      @blur="(event) => handleBlur(event)"
      :id="id"
      @input="(event) => handleInput(event)"
      v-model="model"
      class="input-group-text"
      :class="{ 'is-invalid': !disabled && isInvalid }"
      type="number"
      :min="min"
      :max="max"
      :disabled="disabled"
      :aria-describedby="`${id}Feedback`"
    />
    <button class="btn my-btn-abu" type="button" @click="increment()" :disabled="disabled">
      +
    </button>
  </div>
  <div
    v-if="!disabled && isInvalid"
    :id="`${id}Feedback`"
    class="invalid-feedback d-block"
    :class="{ 'text-light': lightErrorMessage }"
  >
    {{ errorMessage || 'Nilai harus antara ' + min + ' dan ' + max }}
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
  errorMessage = '',
  validationToggle = null,
  ...props
} = defineProps({
  classProp: String,
  disabled: Boolean,
  errorMessage: String,
  id: String,
  lightErrorMessage: Boolean,
  max: Number,
  min: Number,
  validationToggle: null,
})
const emit = defineEmits(['change', 'invalidate'])

const emptyString = ''

const { value, isInvalid, increment, decrement, setMin, setMax, handleBlur, handleInput } =
  useNumberInput(
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
  if (!isInvalid.value) {
    emit('invalidate', false, props.id)
  }
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
      emit('invalidate', true, props.id)
    }
  },
)

watch(
  () => props.validationToggle,
  // eslint-disable-next-line no-unused-vars
  (_) => {
    if (!disabled && (value.value < min || value.value > max)) {
      isInvalid.value = true
      emit('invalidate', true, props.id)
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
