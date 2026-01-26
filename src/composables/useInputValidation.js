import { ref, watch } from 'vue'

/**
 * Composable for handling input validation logic
 * Provides common validation patterns used across form input components
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Input element ID
 * @param {boolean} props.required - Whether the field is required
 * @param {string|null} props.validationToggle - Signal to trigger validation
 * @param {Function} emit - Emit function for component events
 * @returns {Object} Validation state and methods
 */
export function useInputValidation(props, emit) {
  const isInvalid = ref(false)
  const inputClass = ref({
    'is-invalid': false,
  })

  // Handle validation toggle from parent
  watch(
    () => props.validationToggle,
    // eslint-disable-next-line no-unused-vars
    (_) => {
      if (props.required && !props.modelValue) {
        setInvalidState(true)
      }
    },
  )

  // Watch for changes to the required prop
  watch(
    () => props.required,
    (newRequired) => {
      if (!newRequired) {
        setInvalidState(false)
      }
    },
  )

  /**
   * Set the invalid state of the input
   * @param {boolean} invalid - Whether the input should be marked as invalid
   */
  function setInvalidState(invalid) {
    isInvalid.value = invalid
    inputClass.value['is-invalid'] = invalid
  }

  /**
   * Validate the input value
   * @param {*} value - The input value to validate
   * @returns {boolean} True if valid, false otherwise
   */
  function validateValue(value) {
    if (props.required && !value) {
      setInvalidState(true)
      return false
    }
    return true
  }

  /**
   * Clear the invalid state
   */
  function clearInvalid() {
    setInvalidState(false)
  }

  /**
   * Emit invalidate event
   * @param {boolean} invalid - Whether the input is invalid
   */
  function emitInvalidate(invalid) {
    emit?.('invalidate', invalid, props.id)
  }

  return {
    isInvalid,
    inputClass,
    setInvalidState,
    validateValue,
    clearInvalid,
    emitInvalidate,
  }
}
