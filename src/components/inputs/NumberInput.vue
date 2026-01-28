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
import { computed, nextTick, ref, watch } from 'vue'

const {
  disabled = false,
  errorMessage = '',
  max = 8,
  min = 1,
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
const isInvalid = ref(false)
const model = defineModel()
model.value = 1

/**
 * Check if current value is within valid range
 */
const isValidRange = computed(() => {
  return model.value >= min && model.value <= max
})

watch(model, () => {
  if (!isInvalid.value) {
    emit('invalidate', false, props.id)
  }
})
watch(
  () => max,
  (newMax) => {
    if (model.value > newMax) {
      isInvalid.value = true
      emit('invalidate', true, props.id)
    }
  },
)
watch(
  () => props.validationToggle,
  // eslint-disable-next-line no-unused-vars
  (_) => {
    if (!disabled && (model.value < min || model.value > max)) {
      isInvalid.value = true
      emit('invalidate', true, props.id)
    }
  },
)

/**
 * Clamp value to be within valid range
 * @param {number} val - Value to clamp
 * @returns {number} Clamped value
 */
function clampValue(val) {
  if (val < min) return min
  if (val > max) return max
  return val
}
function decrement() {
  if (model.value > min) {
    --model.value
  }
}
/**
 * Handle blur event
 * @param {Event} event - Blur event
 */
function handleBlur(event) {
  const val = Number(event.target.value)
  if (isNaN(val) || val === '') {
    model.value = min
  } else {
    model.value = clampValue(val)
  }
  validate()
}
/**
 * Handle input event
 * @param {Event} event - Input event
 */
function handleInput(event) {
  const val = Number(event.target.value)
  if (isNaN(val)) {
    model.value = ''
  } else {
    model.value = val
  }
  validate()
}
function increment() {
  if (model.value < max) {
    ++model.value
  }
}
/**
 * Validate current value and update invalid state
 */
async function validate() {
  await nextTick()
  isInvalid.value = !isValidRange.value
  return isValidRange.value
}
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
