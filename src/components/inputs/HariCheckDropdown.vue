<template>
  <div class="col-lg-8 dropdown">
    <button
      :id="id"
      class="form-select text-start"
      :class="{ 'is-invalid': isHariInvalid }"
      data-bs-toggle="dropdown"
      data-bs-auto-close="outside"
      aria-expanded="false"
      aria-describedby="hariFeedback"
      type="button"
    >
      {{ hariDisplay || componentStrings.pilihHari }}
    </button>
    <ul class="dropdown-menu">
      <li class="dropdown-item container">
        <div class="row">
          <div class="col form-check" @click="semuaHariToggle()">
            <input id="semuaHari" class="form-check-input" type="checkbox" :checked="semuaHari" />
            <label for="semuaHari" class="form-check-label tsm-min-width"> SEMUA </label>
          </div>
          <div class="col form-check">
            <input
              v-model="kamis"
              :true-value="namaHariEnum.kamis"
              id="kamis"
              class="form-check-input"
              type="checkbox"
            />
            <label for="kamis" class="form-check-label tsm-min-width"> Kamis </label>
          </div>
        </div>
      </li>
      <li class="dropdown-item container">
        <div class="row">
          <div class="col form-check">
            <input
              v-model="senin"
              :true-value="namaHariEnum.senin"
              id="senin"
              class="form-check-input"
              type="checkbox"
            />
            <label for="senin" class="form-check-label tsm-min-width"> Senin </label>
          </div>
          <div class="col form-check">
            <input
              v-model="jumat"
              :true-value="namaHariEnum.jumat"
              id="jumat"
              class="form-check-input"
              type="checkbox"
            />
            <label for="jumat" class="form-check-label tsm-min-width"> Jumat </label>
          </div>
        </div>
      </li>
      <li class="dropdown-item container">
        <div class="row">
          <div class="col form-check">
            <input
              v-model="selasa"
              :true-value="namaHariEnum.selasa"
              id="selasa"
              class="form-check-input"
              type="checkbox"
            />
            <label for="selasa" class="form-check-label tsm-min-width"> Selasa </label>
          </div>
          <div class="col form-check">
            <input
              v-model="sabtu"
              :true-value="namaHariEnum.sabtu"
              id="sabtu"
              class="form-check-input"
              type="checkbox"
            />
            <label for="sabtu" class="form-check-label tsm-min-width"> Sabtu </label>
          </div>
        </div>
      </li>
      <li class="dropdown-item container">
        <div class="row">
          <div class="col form-check">
            <input
              v-model="rabu"
              :true-value="namaHariEnum.rabu"
              id="rabu"
              class="form-check-input"
              type="checkbox"
            />
            <label for="rabu" class="form-check-label tsm-min-width"> Rabu </label>
          </div>
          <div class="col form-check">
            <input
              v-model="minggu"
              :true-value="namaHariEnum.minggu"
              id="minggu"
              class="form-check-input"
              type="checkbox"
            />
            <label for="minggu" class="form-check-label tsm-min-width"> Minggu </label>
          </div>
        </div>
      </li>
    </ul>
    <div id="hariFeedback" class="invalid-feedback">Hari wajib dipilih.</div>
  </div>
</template>

<script setup>
import '@/assets/css/check-dropdown.css'
import { computed, ref, watch } from 'vue'
import { namaHariEnum } from '@/models/namaHariEnum'

const props = defineProps({
  hari: Object, // selected/picked oleh parent
  id: {
    type: String,
    required: true,
  },
  //placeholder: String, untuk sekarang selalu 'Pilih Hari'
  //required: Boolean, untuk sekarang selalu required
  //errorMessage: String, untuk sekarang selalu 'Hari wajib dipilih'
  validationToggle: null,
  //disabled: Boolean untuk sekarang selalu enabled
})
const emit = defineEmits(['change'])

const componentStrings = Object.freeze({
  pilihHari: 'Pilih Hari',
})

const isHariInvalid = ref(false)
const semuaHari = ref(false)
const senin = ref(false)
const selasa = ref(false)
const rabu = ref(false)
const kamis = ref(false)
const jumat = ref(false)
const sabtu = ref(false)
const minggu = ref(false)

const hariDisplay = computed(() => {
  const days = [senin, selasa, rabu, kamis, jumat, sabtu, minggu]
  const mappedDays = days.filter((hari) => hari.value).map((hari) => hari.value)
  if (mappedDays.length > 0) {
    // Secara konvensi seharusnya ditaruh di watch daripada di computed. Namun, dengan ditaruh di computed jadi lebih efisien
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    isHariInvalid.value = false
  }
  return mappedDays.join(', ')
})

watch(
  () => props.hari,
  (newHari) => {
    senin.value = newHari?.senin ? namaHariEnum.senin : false
    selasa.value = newHari?.selasa ? namaHariEnum.selasa : false
    rabu.value = newHari?.rabu ? namaHariEnum.rabu : false
    kamis.value = newHari?.kamis ? namaHariEnum.kamis : false
    jumat.value = newHari?.jumat ? namaHariEnum.jumat : false
    sabtu.value = newHari?.sabtu ? namaHariEnum.sabtu : false
    minggu.value = newHari?.minggu ? namaHariEnum.minggu : false
  },
)
watch(
  [senin, selasa, rabu, kamis, jumat, sabtu, minggu],
  ([newSenin, newSelasa, newRabu, newKamis, newJumat, newSabtu, newMinggu]) => {
    if (!newSenin || !newSelasa || !newRabu || !newKamis || !newJumat || !newSabtu || !newMinggu) {
      semuaHari.value = false
    } else if (newSenin && newSelasa && newRabu && newKamis && newJumat && newSabtu && newMinggu) {
      semuaHari.value = true
    }
    emit('change', newSenin, newSelasa, newRabu, newKamis, newJumat, newSabtu, newMinggu)
  },
)
// A workaround to trigger toggle from parent
watch(
  () => props.validationToggle,
  // eslint-disable-next-line no-unused-vars
  (_) => {
    if (!hariDisplay.value) {
      isHariInvalid.value = true
    }
  },
)

function semuaHariToggle() {
  semuaHari.value = !semuaHari.value
  if (semuaHari.value) {
    senin.value = namaHariEnum.senin
    selasa.value = namaHariEnum.selasa
    rabu.value = namaHariEnum.rabu
    kamis.value = namaHariEnum.kamis
    jumat.value = namaHariEnum.jumat
    sabtu.value = namaHariEnum.sabtu
    minggu.value = namaHariEnum.minggu
    return
  }
  senin.value = false
  selasa.value = false
  rabu.value = false
  kamis.value = false
  jumat.value = false
  sabtu.value = false
  minggu.value = false
}
</script>
