<template>
  <div
    class="modal fade"
    id="cariKaryawanModal"
    tabindex="-1"
    aria-labelledby="modalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalLabel">Cari NIK/Nama Karyawan</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Tutup"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="errorMessage" :class="`alert alert-${alertType}`" role="alert">
            {{ errorMessage }}
          </div>
          <div v-if="displayWarningMessage" class="alert alert-warning" role="alert">
            {{ displayWarningMessage }}
          </div>
          <div v-if="isNikInput" class="row mb-3">
            <label for="nikKaryawan" class="col-sm-2 col-form-label">NIK Karyawan</label>
            <div class="col-sm-10">
              <div class="input-group">
                <input
                  v-model="nikForCari"
                  id="nikKaryawan"
                  class="form-control"
                  :class="{ 'is-invalid': nikForCari.length > 0 && cariIsInvalid }"
                  placeholder="Input Minimal 5 Karakter"
                  min="5"
                />
                <button class="btn btn-primary text-light" type="button" @click="cari(nikForCari)">
                  Cari
                </button>
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-sm-7"></div>
            <div class="col-12 col-sm-5">
              <div class="input-group ms-auto">
                <input v-model="searchKeyword" class="form-control" placeholder="Cari" />
                <button class="btn btn-outline-secondary icon-link" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div style="overflow-x: auto">
            <table class="table table-bordered mb-3" style="table-layout: fixed">
              <thead>
                <tr class="table-dark text-center">
                  <th scope="col" style="width: 73px"></th>
                  <th scope="col" class="my-position-md-relative" @click="sortByNik()">
                    NIK
                    <SortNumericAscending v-if="sortBy == sortByEnum.nikAscending" />
                    <SortNumericDescending v-else-if="sortBy == sortByEnum.nikDescending" />
                  </th>
                  <th scope="col" class="my-position-md-relative" @click="sortByNama()">
                    NAMA
                    <SortAlphabetAscending v-if="sortBy == sortByEnum.namaAscending" />
                    <SortAlphabetDescending v-else-if="sortBy == sortByEnum.namaDescending" />
                  </th>
                  <th
                    v-if="displayJabatan"
                    scope="col"
                    class="my-position-md-relative"
                    @click="sortByJabatan()"
                  >
                    JABATAN
                    <SortAlphabetAscending v-if="sortBy == sortByEnum.jabatanAscending" />
                    <SortAlphabetDescending v-else-if="sortBy == sortByEnum.jabatanDescending" />
                  </th>
                  <th
                    v-if="isShift"
                    scope="col"
                    class="my-position-md-relative"
                    @click="sortByShift()"
                  >
                    SHIFT
                    <SortAlphabetAscending v-if="sortBy === fieldKeys.shift && isAscending" />
                    <SortAlphabetDescending v-else-if="sortBy === fieldKeys.shift" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="karyawan in displayEmployees" :key="karyawan.nik">
                  <th scope="row" style="width: 73px">
                    <button
                      class="btn btn-success py-1"
                      type="button"
                      data-bs-dismiss="modal"
                      @click="pilih(karyawan)"
                    >
                      Pilih
                    </button>
                  </th>
                  <td class="text-center">{{ karyawan.nik }}</td>
                  <td>{{ karyawan.name }}</td>
                  <td v-if="displayJabatan">{{ karyawan.jabatan }}</td>
                  <td v-if="isShift">{{ karyawan?.[fieldKeys.shift] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-sm my-position-sm-relative mb-3 mb-sm-0">
              <div class="my-y-center">
                Show
                <input
                  type="number"
                  v-model="showInput"
                  :min="min"
                  :max="max"
                  class="my-form-control"
                  :class="{ 'is-invalid': showIsInvalid }"
                />
                of <b>{{ max }}</b> entries
              </div>
            </div>
            <MyPagination :page-count="pageCount" :symbol="symbol" @navigate="navigate" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/form.css'
import '@/assets/css/position.css'
import { ref, watch, computed } from 'vue'
import MyPagination from '@/components/MyPagination.vue'
import SortNumericAscending from '@/components/svg/SortNumericAscending.vue'
import SortNumericDescending from '@/components/svg/SortNumericDescending.vue'
import SortAlphabetAscending from '../svg/SortAlphabetAscending.vue'
import SortAlphabetDescending from '../svg/SortAlphabetDescending.vue'
import { sortByEnum } from '@/models/sortByEnum'
import { strings } from '@/models/strings'

const danger = 'danger'
const fieldKeys = Object.freeze({
  shift: 'shift',
})
const warning = 'warning'
const emptyArray = Object.freeze([])

const props = defineProps({
  isNikInput: Boolean,
  emitArg: null,
  populate: Function,
  populateArg: Array,
  populationToggle: null,
  displayJabatan: Boolean,
})
const emit = defineEmits(['pilih'])

const errorMessage = ref('')
const displayWarningMessage = ref(strings.emptyString)
const employees = ref([])
const isAscending = ref(true)
const nikForCari = ref('')
const searchKeyword = ref('')
const displayEmployees = ref(employees.value.slice(0, 5))
const sortBy = ref(sortByEnum.nikAscending)
const alertType = ref(danger)
const filteredEmployees = computed(() =>
  employees.value.filter(
    (karyawan) =>
      karyawan.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      karyawan.nik.includes(searchKeyword.value) ||
      karyawan?.[fieldKeys.shift]?.includes(searchKeyword.value),
  ),
)
const isShift = computed(() => props.populateArg?.[4])
const min = computed(() => Math.min(5, filteredEmployees.value.length))
const max = computed(() => Math.min(filteredEmployees.value.length, 99))
const showInput = ref(min.value)
const validatedShow = ref(min.value)
const symbol = ref(Symbol(validatedShow.value))
const pageCount = computed(() => {
  const ceil = Math.ceil(filteredEmployees.value.length / validatedShow.value)
  return isNaN(ceil) ? 0 : ceil
})
const cariIsInvalid = computed(
  () => !nikForCari.value || !nikForCari.value.length || nikForCari.value.length < 5,
)
const showIsInvalid = computed(() => showInput.value < min.value || showInput.value > max.value)

watch(showInput, (count) => {
  if (!showIsInvalid.value) {
    validatedShow.value = count
    symbol.value = Symbol(count)
  }
})
watch(filteredEmployees, (f) => {
  if (validatedShow.value > f.length) {
    validatedShow.value = f.length
    showInput.value = f.length
  } else if (validatedShow.value < min.value) {
    validatedShow.value = min.value
    showInput.value = min.value
  }
})
// A workaround to trigger toggle from parent
watch(
  () => props.populationToggle,
  // eslint-disable-next-line no-unused-vars
  (_) => {
    if (props.populate) {
      employees.value = emptyArray
      displayWarningMessage.value = strings.defaultLoadingMessage
      props.populate
        .apply(this, props.populateArg)
        .then(function (response) {
          employees.value = response?.data?.constructor === Array ? response.data : emptyArray
          errorMessage.value = strings.emptyString
        })
        .catch(function (error) {
          errorMessage.value = error?.errorMessage || 'Mohon maaf, gagal mengambil data karyawan.'
        })
        .finally(function () {
          displayWarningMessage.value = strings.emptyString
        })
    }
  },
)

function cari(nik) {
  if (cariIsInvalid.value) {
    return
  }
  // To do: logika cari
}
function pilih(karyawan) {
  emit('pilih', karyawan, props.emitArg)
}
function navigate(page) {
  if (sortBy.value == sortByEnum.nikAscending) {
    displayEmployees.value = filteredEmployees.value.slice(
      (page - 1) * validatedShow.value,
      page * validatedShow.value,
    )
  } else if (sortBy.value == sortByEnum.nikDescending) {
    const startIndex = filteredEmployees.value.length - page * validatedShow.value
    displayEmployees.value = filteredEmployees.value
      .slice(startIndex < 0 ? 0 : startIndex, startIndex + validatedShow.value)
      .toSorted(() => -1)
  } else if (sortBy.value == sortByEnum.namaAscending) {
    displayByNamaAscending(page)
  } else if (sortBy.value == sortByEnum.namaDescending) {
    displayByNamaDescending(page)
  } else if (sortBy.value == sortByEnum.jabatanAscending) {
    displayByJabatanAscending(page)
  } else if (sortBy.value === sortByEnum.jabatanDescending) {
    displayByJabatanDescending(page)
  } else {
    displayByShift(page)
  }
}
function sortByJabatan() {
  if (sortBy.value != sortByEnum.jabatanAscending) {
    sortBy.value = sortByEnum.jabatanAscending
    displayByJabatanAscending(1)
  } else {
    sortBy.value = sortByEnum.jabatanDescending
    displayByJabatanDescending(1)
  }
  symbol.value = sortBy.value
}
function sortByNama() {
  if (sortBy.value != sortByEnum.namaAscending) {
    sortBy.value = sortByEnum.namaAscending
    displayByNamaAscending(1)
  } else {
    sortBy.value = sortByEnum.namaDescending
    displayByNamaDescending(1)
  }
  symbol.value = sortBy.value
}
function sortByNik() {
  if (sortBy.value != sortByEnum.nikAscending) {
    sortBy.value = sortByEnum.nikAscending
    displayEmployees.value = filteredEmployees.value.slice(0, validatedShow.value)
  } else {
    sortBy.value = sortByEnum.nikDescending
    displayEmployees.value = filteredEmployees.value.slice(-validatedShow.value).sort(() => -1)
  }
  symbol.value = sortBy.value
}
function sortByShift() {
  if (sortBy.value === fieldKeys.shift) {
    isAscending.value = !isAscending.value
  } else {
    sortBy.value = fieldKeys.shift
    isAscending.value = true
  }
  displayByShift(1)
  symbol.value = sortBy.value
}
function displayByJabatanAscending(page) {
  displayEmployees.value = filteredEmployees.value
    .toSorted((a, b) => namaSortComparer(a, b, 'jabatan'))
    .slice((page - 1) * validatedShow.value, page * validatedShow.value)
}
function displayByJabatanDescending(page) {
  displayEmployees.value = filteredEmployees.value
    .toSorted((a, b) => -namaSortComparer(a, b, 'jabatan'))
    .slice((page - 1) * validatedShow.value, page * validatedShow.value)
}
function displayByNamaAscending(page) {
  displayEmployees.value = filteredEmployees.value
    .toSorted((a, b) => namaSortComparer(a, b))
    .slice((page - 1) * validatedShow.value, page * validatedShow.value)
}
function displayByNamaDescending(page) {
  displayEmployees.value = filteredEmployees.value
    .toSorted((a, b) => -namaSortComparer(a, b))
    .slice((page - 1) * validatedShow.value, page * validatedShow.value)
}
function displayByShift(page) {
  const orderMultiplier = isAscending.value ? 1 : -1
  displayEmployees.value = filteredEmployees.value
    .toSorted((a, b) => orderMultiplier * namaSortComparer(a, b, fieldKeys.shift))
    .slice((page - 1) * validatedShow.value, page * validatedShow.value)
}
function namaSortComparer(a, b, field = 'name') {
  if (a[field] > b[field]) {
    return 1
  } else if (a[field] < b[field]) {
    return -1
  } else {
    return 0
  }
}
</script>

<style scoped>
.my-form-control {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}
.my-form-control.is-invalid {
  border-color: #dc3545;
}
.my-form-control.is-invalid:focus {
  outline-color: #dc3545;
}
@media (min-width: 576px) {
  .my-y-center {
    transform: translateY(-50%) !important;
    left: 0.75rem !important;
    top: 50% !important;
    position: absolute !important;
  }
}
</style>
