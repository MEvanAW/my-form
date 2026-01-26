import { ref, computed, watch } from 'vue'

/**
 * Composable for handling number input functionality
 * Provides validation, range constraints, and increment/decrement functionality
 *
 * @param {Object} options - Configuration options
 * @param {number} options.min - Minimum allowed value
 * @param {number} options.max - Maximum allowed value
 * @param {number} options.step - Step size for increment/decrement (default: 1)
 * @param {number} options.initialValue - Initial value
 * @param {Function} emit - Optional emit function for custom events
 * @returns {Object} Number input state and methods
 */
export function useNumberInput(options = {}, emit) {
  const min = ref(options.min !== undefined ? options.min : 0)
  const max = ref(options.max !== undefined ? options.max : Infinity)
  const step = ref(options.step !== undefined ? options.step : 1)
  const value = ref(options.initialValue !== undefined ? options.initialValue : min.value)
  const isInvalid = ref(false)

  /**
   * Check if current value is within valid range
   */
  const isValidRange = computed(() => {
    return value.value >= min.value && value.value <= max.value
  })

  /**
   * Check if value is less than minimum
   */
  const isBelowMin = computed(() => {
    return value.value < min.value
  })

  /**
   * Check if value is greater than maximum
   */
  const isAboveMax = computed(() => {
    return value.value > max.value
  })

  /**
   * Clamp value to be within valid range
   * @param {number} val - Value to clamp
   * @returns {number} Clamped value
   */
  function clampValue(val) {
    if (val < min.value) return min.value
    if (val > max.value) return max.value
    return val
  }

  /**
   * Set value and validate it
   * @param {number} val - New value
   */
  function setValue(val) {
    const numValue = Number(val)
    if (isNaN(numValue)) {
      value.value = min.value
    } else {
      value.value = numValue
    }
    validate()
  }

  /**
   * Increment value by step
   */
  function increment() {
    const newValue = clampValue(value.value + step.value)
    value.value = newValue
    validate()
    emitChange()
  }

  /**
   * Decrement value by step
   */
  function decrement() {
    const newValue = clampValue(value.value - step.value)
    value.value = newValue
    validate()
    emitChange()
  }

  /**
   * Validate current value and update invalid state
   */
  function validate() {
    isInvalid.value = !isValidRange.value
    return isValidRange.value
  }

  /**
   * Clear invalid state
   */
  function clearInvalid() {
    isInvalid.value = false
  }

  /**
   * Emit change event if emit function is provided
   */
  function emitChange() {
    if (emit) {
      emit('update:modelValue', value.value)
    }
  }

  /**
   * Get CSS classes for input validation
   * @returns {Object} Object with 'is-invalid' property
   */
  function getInputClasses() {
    return {
      'is-invalid': isInvalid.value,
    }
  }

  /**
   * Handle input event
   * @param {Event} event - Input event
   */
  function handleInput(event) {
    const val = Number(event.target.value)
    if (isNaN(val)) {
      value.value = ''
      isInvalid.value = true
    } else {
      value.value = val
      validate()
    }
    emitChange()
  }

  /**
   * Handle blur event
   * @param {Event} event - Blur event
   */
  function handleBlur(event) {
    const val = Number(event.target.value)
    if (isNaN(val) || val === '') {
      value.value = min.value
    } else {
      value.value = clampValue(val)
    }
    validate()
    emitChange()
  }

  /**
   * Reset to minimum value
   */
  function resetToMin() {
    value.value = min.value
    clearInvalid()
    emitChange()
  }

  /**
   * Reset to maximum value
   */
  function resetToMax() {
    value.value = max.value
    clearInvalid()
    emitChange()
  }

  /**
   * Reset to initial value
   */
  function resetToInitial() {
    value.value = options.initialValue !== undefined ? options.initialValue : min.value
    clearInvalid()
    emitChange()
  }

  /**
   * Set minimum value
   * @param {number} newMin - New minimum value
   */
  function setMin(newMin) {
    min.value = newMin
    if (value.value < newMin) {
      value.value = newMin
    }
    validate()
  }

  /**
   * Set maximum value
   * @param {number} newMax - New maximum value
   */
  function setMax(newMax) {
    max.value = newMax
    if (value.value > newMax) {
      value.value = newMax
    }
    validate()
  }

  /**
   * Set step value
   * @param {number} newStep - New step value
   */
  function setStep(newStep) {
    step.value = newStep
  }

  // Watch for value changes and emit
  watch(value, () => {
    emitChange()
  })

  return {
    // State
    value,
    isInvalid,
    min,
    max,
    step,

    // Computed
    isValidRange,
    isBelowMin,
    isAboveMax,

    // Methods
    setValue,
    increment,
    decrement,
    validate,
    clearInvalid,
    clampValue,
    getInputClasses,
    handleInput,
    handleBlur,
    resetToMin,
    resetToMax,
    resetToInitial,
    setMin,
    setMax,
    setStep,
  }
}
