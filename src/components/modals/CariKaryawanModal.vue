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
          <h1 class="modal-title fs-5" id="modalLabel">{{ $t('title.cariKaryawanModal') }}</h1>
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
                  {{ $t('placeholder.cari') }}
                </button>
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-sm-7"></div>
            <div class="col-12 col-sm-5">
              <div class="input-group ms-auto">
                <input
                  v-model="searchKeyword"
                  class="form-control"
                  :placeholder="$t('placeholder.cari')"
                />
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
                  <th scope="col" class="my-position-md-relative" @click="toggleSort('nik')">
                    {{ $t('label.nik') }}
                    <SortNumericAscending v-if="sortBy === 'nik' && isAscending" />
                    <SortNumericDescending v-else-if="sortBy === 'nik'" />
                  </th>
                  <th scope="col" class="my-position-md-relative" @click="toggleSort('nama')">
                    {{ $t('label.nama') }}
                    <SortAlphabetAscending v-if="sortBy === 'nama' && isAscending" />
                    <SortAlphabetDescending v-else-if="sortBy === 'nama'" />
                  </th>
                  <th
                    v-if="displayJabatan"
                    scope="col"
                    class="my-position-md-relative"
                    @click="toggleSort('jabatan')"
                  >
                    {{ $t('column.jabatan') }}
                    <SortAlphabetAscending v-if="sortBy === 'jabatan' && isAscending" />
                    <SortAlphabetDescending v-else-if="sortBy === 'jabatan'" />
                  </th>
                  <th scope="col" class="my-position-md-relative" @click="toggleSort('shift')">
                    {{ $t('column.shift') }}
                    <SortAlphabetAscending v-if="sortBy === 'shift' && isAscending" />
                    <SortAlphabetDescending v-else-if="sortBy === 'shift'" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="karyawan in displayedItems" :key="karyawan.nik">
                  <th scope="row" style="width: 73px">
                    <button
                      class="btn btn-success py-1"
                      type="button"
                      data-bs-dismiss="modal"
                      @click="pilih(karyawan)"
                    >
                      {{ $t('button.pilih') }}
                    </button>
                  </th>
                  <td class="text-center">{{ karyawan.nik }}</td>
                  <td>{{ karyawan.name }}</td>
                  <td v-if="displayJabatan">{{ karyawan.jabatan }}</td>
                  <td>{{ karyawan?.[fieldKeys.shift] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-sm my-position-sm-relative mb-3 mb-sm-0">
              <div class="my-y-center">
                {{ $t('label.lihat') }}
                <input
                  type="number"
                  v-model="showInput"
                  :min="itemsPerPageMin"
                  :max="itemsPerPageMax"
                  class="my-form-control"
                  :class="{ 'is-invalid': showIsInvalid }"
                />
                {{ $t('label.dari') }} <b>{{ itemsPerPageMax }}</b> entries
              </div>
            </div>
            <MyPagination :page-count="pageCount" :symbol="symbol" @navigate="navigateToPage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/scss/main.scss'
import { ref, watch, computed } from 'vue'
import MyPagination from '@/components/MyPagination.vue'
import SortNumericAscending from '@/components/svg/SortNumericAscending.vue'
import SortNumericDescending from '@/components/svg/SortNumericDescending.vue'
import SortAlphabetAscending from '../svg/SortAlphabetAscending.vue'
import SortAlphabetDescending from '../svg/SortAlphabetDescending.vue'
import { useTableSorting } from '@/composables/useTableSorting'
import { strings } from '@/models/strings'

const danger = 'danger'
const fieldKeys = Object.freeze({
  shift: 'shift',
})
const emptyArray = Object.freeze([])

const props = defineProps({
  isNikInput: Boolean,
  emitArg: null,
  employees: Array,
  displayJabatan: Boolean,
})
const emit = defineEmits(['pilih'])

const errorMessage = ref('')
const displayWarningMessage = ref(strings.emptyString)
const nikForCari = ref('')
const alertType = ref(danger)
const cariIsInvalid = computed(
  () => !nikForCari.value || !nikForCari.value.length || nikForCari.value.length < 5,
)

// Table sorting configuration
const employees = ref(emptyArray)
const sortFieldKeys = {
  nik: 'nik',
  nama: 'name',
  jabatan: 'jabatan',
  shift: 'shift',
}

const sortConfig = {
  sortFields: {
    nik: {
      field: 'nik',
      compare: (a, b, field) => {
        // Numeric comparison for NIK
        const numA = Number(a[field])
        const numB = Number(b[field])
        return numA - numB
      },
    },
    nama: {
      field: 'name',
      compare: (a, b, field) => {
        const strA = a[field].toLowerCase()
        const strB = b[field].toLowerCase()
        if (strA < strB) return -1
        if (strA > strB) return 1
        return 0
      },
    },
    jabatan: {
      field: 'jabatan',
      compare: (a, b, field) => {
        const strA = a[field].toLowerCase()
        const strB = b[field].toLowerCase()
        if (strA < strB) return -1
        if (strA > strB) return 1
        return 0
      },
    },
    shift: {
      field: 'shift',
      compare: (a, b, field) => {
        const strA = a[field]?.toLowerCase() || ''
        const strB = b[field]?.toLowerCase() || ''
        if (strA < strB) return -1
        if (strA > strB) return 1
        return 0
      },
    },
  },
  defaultSortKey: 'nik',
  initialItemsPerPage: 5,
  minItemsPerPage: 5,
  maxItemsPerPage: 99,
  searchFields: ['name', 'nik', 'shift'],
}

const {
  sortBy,
  isAscending,
  searchKeyword,
  itemsPerPage,
  itemsPerPageMin,
  itemsPerPageMax,
  filteredItems,
  displayedItems,
  pageCount,
  toggleSort,
  navigateToPage,
  setItemsPerPage,
  calculateItemsPerPageBounds,
  isValidItemsPerPage,
} = useTableSorting(employees, sortConfig)

// Items per page input handling
const showInput = itemsPerPage
const symbol = ref(Symbol(itemsPerPage.value))

const showIsInvalid = computed(() => !isValidItemsPerPage(showInput.value))

watch(showInput, (count) => {
  if (!showIsInvalid.value) {
    setItemsPerPage(count)
    symbol.value = Symbol(count)
  }
})

watch(filteredItems, (f) => {
  calculateItemsPerPageBounds(5, 99)
  if (itemsPerPage.value > f.length) {
    setItemsPerPage(Math.max(f.length, 5))
    showInput.value = itemsPerPage.value
  }
})

watch(
  () => props.employees,
  (newEmployees) => {
    if (newEmployees?.constructor === Array) {
      employees.value = newEmployees
      navigateToPage(1)
    }
  },
  { immediate: true },
)

function cari() {
  if (cariIsInvalid.value) {
    return
  }
  // TODO: logika cari
}
function pilih(karyawan) {
  emit('pilih', karyawan, props.emitArg)
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
