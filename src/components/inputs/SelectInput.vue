<template>
  <select
    :id="id"
    v-model="model"
    class="form-select"
    :class="inputClass"
    :required="required"
    :aria-describedby="`${id}Feedback`"
    :disabled="disabled"
  >
    <option v-if="placeholder" value="" selected disabled hidden>
      {{ placeholder }}
    </option>
    <option v-for="option in options" :value="option.value" :key="option.value">
      {{ option.label }}
    </option>
  </select>
  <div :id="`${id}Feedback`" class="invalid-feedback" :class="{ 'text-light': lightErrorMessage }">
    {{ errorMessage }}
  </div>
</template>

<script setup>
import { onMounted, watchEffect } from 'vue'
import { useInputValidation } from '@/composables/useInputValidation'

const props = defineProps({
  additionalData: null,
  id: {
    type: String,
    required: true,
  },
  lightErrorMessage: Boolean,
  placeholder: String,
  required: Boolean,
  options: {
    type: Array,
    required: true,
  },
  errorMessage: String,
  validationToggle: null,
  classProp: String,
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
  emit('change', model.value, props.id, props.additionalData)
})
</script>
