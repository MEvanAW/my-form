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
import '@/assets/scss/main.scss'
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
div.input-group.is-invalid ~ .my-invalid-feedback {
  display: block;
}
.input-group-text.is-invalid {
  border-color: #dc3545;
}
.input-group-text.is-invalid:focus {
  outline-color: #dc3545;
}
.my-btn-abu {
  --bs-btn-color: #000;
  --bs-btn-bg: #e8e9ea;
  --bs-btn-border-color: #e8e9ea;
  --bs-btn-hover-color: #000;
  --bs-btn-hover-bg: #c3c4c5;
  --bs-btn-hover-border-color: #b6b7b8;
  --bs-btn-focus-shadow-rgb: 211, 212, 213;
  --bs-btn-active-color: #000;
  --bs-btn-active-bg: #b6b7b8;
  --bs-btn-active-border-color: #aaabac;
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: #000;
  --bs-btn-disabled-bg: #e8e9ea;
  --bs-btn-disabled-border-color: #e8e9ea;
}
</style>
