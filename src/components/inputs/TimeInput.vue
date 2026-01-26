<template>
  <input
    :id="id"
    v-model="model"
    class="form-control"
    :class="inputClass"
    :required="required"
    :aria-describedby="`${id}Feedback`"
    type="time"
    :min="min"
    :max="max"
    :disabled="disabled"
    step="30"
  />
  <div
    :id="`${id}Feedback`"
    class="invalid-feedback"
    :class="{ 'd-none': !inputClass['is-invalid'] }"
  >
    {{ errorMessage || displayErrorMessage }}
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useInputValidation } from '@/composables/useInputValidation'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  required: Boolean,
  errorMessage: String,
  validationToggle: null,
  classProp: String,
  min: null,
  max: null,
  disabled: Boolean,
})
const emit = defineEmits(['change', 'invalidate'])

const isInvalid = 'is-invalid'
const model = defineModel()
const displayErrorMessage = ref(props.errorMessage)

const { inputClass } = useInputValidation(props, emit)

onMounted(() => {
  if (props.classProp) {
    inputClass.value[props.classProp] = true
  }
})

watch([model, () => props.disabled], ([newModel, newDisabled]) => {
  if (!newDisabled && (newModel < props.min || newModel > props.max)) {
    inputClass.value[isInvalid] = true
    if (!props.errorMessage) {
      displayErrorMessage.value = document.getElementById(props.id).validationMessage
    }
    emit('invalidate', true, props.id)
  } else if (newModel || newDisabled) {
    inputClass.value[isInvalid] = false
    emit('invalidate', false, props.id)
  }
  emit('change', newModel, props.id)
})
</script>
