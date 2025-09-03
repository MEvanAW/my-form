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
import { strings } from '@/models/strings'
import { onMounted, ref, watch } from 'vue'

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
const emit = defineEmits(['change', 'invalidate'])

const isInvalid = 'is-invalid'
const model = ref('')
const inputClass = ref({
  'is-invalid': false,
})
const displayErrorMessage = ref(props.errorMessage)

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
watch(
  () => props.required,
  (newRequired) => {
    if (!newRequired) {
      inputClass.value[isInvalid] = false
    }
  },
)
</script>
