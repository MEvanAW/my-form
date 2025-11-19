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
  <div :id="`${id}Feedback`" class="invalid-feedback">{{ errorMessage }}</div>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'

const props = defineProps({
  additionalData: null,
  id: {
    type: String,
    required: true,
  },
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
const emit = defineEmits(['change'])

const isInvalid = 'is-invalid'
const model = defineModel()
const inputClass = ref({
  'is-invalid': false,
})

onMounted(() => {
  if (props.classProp) {
    inputClass.value[props.classProp] = true
  }
})

watchEffect(() => {
  if (model.value) {
    inputClass.value[isInvalid] = false
  }
  emit('change', model.value, props.id, props.additionalData)
})

// A workaround to trigger toggle from parent
watch(
  () => props.validationToggle,
  // eslint-disable-next-line no-unused-vars
  (_) => {
    if (props.required && !model.value) {
      inputClass.value[isInvalid] = true
    }
  },
)
</script>
