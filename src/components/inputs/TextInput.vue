<template>
  <input
    :id="id"
    v-model="model"
    class="form-control"
    :class="inputClass"
    :placeholder="placeholder"
    :required="required"
    :aria-describedby="`${id}Feedback`"
    :pattern="pattern"
    autocomplete="off"
    list="datalistOptions"
    :type="type || defaultType"
    :disabled="disabled"
    @keyup="onKeyup"
  />
  <div :id="`${id}Feedback`" class="invalid-feedback">{{ errorMessage }}</div>
  <datalist id="datalistOptions" v-if="datalist">
    <option v-for="dropdown in datalist" :value="dropdown.value" :key="dropdown.value"></option>
  </datalist>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  placeholder: String,
  required: Boolean,
  errorMessage: {
    type: String,
    required: true,
  },
  validationToggle: null,
  classProp: String,
  value: String,
  datalist: Array,
  pattern: String,
  validate: Function,
  type: String,
  disabled: Boolean,
})
const emit = defineEmits(['change', 'keyup'])

const defaultType = 'text'
const isInvalid = 'is-invalid'
const functionString = 'function'
const model = ref('')
const inputClass = ref({
  'is-invalid': false,
})

onMounted(() => {
  if (props.classProp) {
    inputClass.value[props.classProp] = true
  }
  if (props.value) {
    model.value = props.value
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
    } else if (typeof props.validate === functionString && !props.validate(model.value)) {
      inputClass.value[isInvalid] = true
    }
  },
)
watch(
  () => props.value,
  (newValue) => {
    if (newValue || newValue === '') {
      model.value = newValue
    }
  },
)

function onKeyup(param) {
  emit('keyup', param)
}
</script>
