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
import { strings } from '@/models/strings'
import { onMounted, ref, watch, watchEffect } from 'vue'

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
  picked: null,
  disabled: Boolean,
})
const emit = defineEmits(['change'])

const isInvalid = 'is-invalid'
const model = ref('')
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
  emit('change', model.value, props.id)
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
watch(
  () => props.picked,
  (newPicked) => {
    if (newPicked || newPicked === strings.emptyString) {
      model.value = newPicked
    }
  },
)
</script>
