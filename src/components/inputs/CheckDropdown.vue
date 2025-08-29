<template>
  <div class="dropdown">
    <button
      :id="id"
      class="form-select text-start"
      :class="{ 'is-invalid': isInvalid }"
      data-bs-toggle="dropdown"
      data-bs-auto-close="outside"
      :disabled="disabled"
      aria-expanded="false"
      :aria-describedby="`${id}Feedback`"
      type="button"
    >
      {{ serializedCheck || placeholder || defaultPlaceholder }}
    </button>
    <ul class="dropdown-menu" style="max-height: 256px; overflow-y: auto">
      <li class="dropdown-item container">
        <div class="form-check" @click="toggleSemuaCheckbox()">
          <input :id="semuaId" class="form-check-input" type="checkbox" :checked="semua" />
          <label :for="semuaId" class="form-check-label my-min-width"> SEMUA </label>
        </div>
      </li>
      <li v-for="option in componentOptions" :key="option.value" class="dropdown-item container">
        <div class="form-check" @click="toggleCheckbox(option.value)">
          <input
            :id="option.value"
            class="form-check-input"
            type="checkbox"
            :checked="option.checked"
          />
          <label :for="option.value" class="form-check-label my-min-width">
            {{ option.label }}
          </label>
        </div>
      </li>
    </ul>
    <div :id="`${id}Feedback`" class="invalid-feedback">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/check-dropdown.css'
import { strings } from '@/models/strings'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  values: String, // selected/picked oleh parent
  id: {
    type: String,
    required: true,
  },
  options: Array,
  placeholder: String,
  //required: Boolean, untuk sekarang selalu tidak required
  errorMessage: String,
  validationToggle: null,
  disabled: Boolean,
})
const emit = defineEmits(['change'])

const componentStrings = Object.freeze({
  codesSeparator: ';',
  defaultPlaceholder: 'Pilih',
  labelSeparator: '; ',
})

const componentOptions = ref([])
const isInvalid = ref(false)
const semua = ref(false)
const serializedCheck = ref(strings.emptyString)

const semuaId = computed(() => `semua${props.id}`)

watch(
  () => props.options,
  (newOptions) => {
    componentOptions.value = newOptions
  },
)
watch(
  componentOptions,
  (newOptions) => {
    serializedCheck.value = newOptions
      .filter((option) => option.checked)
      .map((option) => option.label)
      .join(componentStrings.labelSeparator)
    emitChange()
  },
  { deep: true },
)
watch(
  () => props.values,
  (newValues) => {
    let chainAnd = true
    const valuesArray = newValues?.split(componentStrings.codesSeparator) || []
    componentOptions.value.forEach((option) => {
      const isCocok = valuesArray.findIndex((j) => j == option.value) >= 0
      option.checked = isCocok
      const el = document.getElementById(option.value)
      if (el) {
        el.checked = isCocok
      }
      chainAnd &&= isCocok
    })
    evaluasiSemuaJabatan(chainAnd)
  },
)

// A workaround to trigger toggle from parent
// Uncomment jika field required
// watch(
//   () => props.validationToggle,
// eslint-disable-next-line no-unused-vars
//   (_) => {
//     if (!serializedCheck.value) {
//       isInvalid.value = true
//     }
//   }
// )

function evaluasiSemuaJabatan(newChecked) {
  if (semua.value && !newChecked) {
    semua.value = false
    const el = document.getElementById(semuaId.value)
    if (el) {
      el.checked = false
    }
  } else if (!semua.value && componentOptions.value.findIndex((option) => !option.checked) < 0) {
    semua.value = true
    const el = document.getElementById(semuaId)
    if (el) {
      el.checked = true
    }
  }
}
function toggleSemuaCheckbox() {
  semua.value = !semua.value
  componentOptions.value.forEach((option) => {
    option.checked = semua.value
    const el = document.getElementById(option.value)
    if (el) {
      el.checked = semua.value
    }
  })
  emitChange()
}
function toggleCheckbox(value) {
  const index = componentOptions.value.findIndex((option) => option.value === value)
  if (index < 0) {
    return
  }
  componentOptions.value[index].checked = !componentOptions.value[index].checked
  evaluasiSemuaJabatan(componentOptions.value[index].checked)
  emitChange()
}
function emitChange() {
  emit(
    'change',
    componentOptions.value
      .filter((option) => option.checked)
      .map(function (option) {
        return option.value
      })
      .join(componentStrings.codesSeparator),
    props.id,
  )
}
</script>
