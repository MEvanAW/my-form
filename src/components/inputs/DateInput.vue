<template>
  <input
    :id="id"
    v-model="model"
    class="form-control"
    :class="inputClass"
    :required="required"
    :aria-describedby="`${id}Feedback`"
    type="date"
    :min="min"
    :max="max"
    :disabled="disabled"
  />
  <div :id="`${id}Feedback`" class="invalid-feedback">{{ errorMessage }}</div>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
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

const { inputClass } = useInputValidation(props, emit)

onMounted(() => {
  if (props.classProp) {
    inputClass.value[props.classProp] = true
  }
})

watchEffect(() => {
  if (model.value) {
    inputClass.value[isInvalid] = false
    emit('invalidate', false, props.id)
  } else if (props.required) {
    emit('invalidate', true, props.id)
  }
  emit('change', model.value, props.id)
})
</script>
