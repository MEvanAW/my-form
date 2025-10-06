<template>
  <div class="card my-square-card">
    <div class="card-header container-fluid">
      <div class="col px-0">
        <h1>{{ $t('title.myForm') }}</h1>
      </div>
      <div class="d-none d-md-block col px-0 position-relative">
        <div class="pb-2 me-3 position-absolute top-50 end-0 translate-middle-y">
          <label class="d-inline-block mb-5 fs-5 me-2">Bahasa Indonesia</label>
          <div class="d-inline-block mb-5 form-check form-switch fs-5">
            <input v-model="isEnglish" class="form-check-input" type="checkbox" role="switch" id="localeSwitch">
            <label class="form-check-label" for="localeSwitch">English</label>
          </div>
        </div>
      </div>
      <div class="d-block d-md-none col px-0">
        <label class="d-inline-block fs-5 me-2">Bahasa Indonesia</label>
        <div class="d-inline-block form-check form-switch fs-5">
          <input v-model="isEnglish" class="form-check-input" type="checkbox" role="switch" id="localeSwitch">
          <label class="form-check-label" for="localeSwitch">English</label>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <div v-if="displayWarningMessage" class="alert alert-warning" role="alert">
        {{ displayWarningMessage }}
      </div>
      <div class="row mb-2 mx-sm-0">
        <div class="col-sm me-lg-4">
          <div class="row mb-2">
            <label for="toko" class="col-sm-4 col-form-label">{{ $t('label.toko') }}</label>
            <div class="col-sm-8">
              <SelectInput
                id="toko"
                :placeholder="$t('placeholder.toko')"
                :required="true"
                :options="kodeTokoOptions"
                :error-message="$t('message.tokoRequired')"
                :validation-toggle="validationToggle"
                :selected="selectedToko"
                :disabled="kodeTokoOptions.length === 1"
                @change="change"
              />
            </div>
          </div>
          <div class="row mb-2">
            <label for="karyawan" class="col-sm-4 col-form-label">{{ $t('label.karyawan') }}</label>
            <div class="col-sm-8">
              <div class="input-group">
                <input
                  id="karyawan"
                  class="form-control"
                  :class="{ 'is-invalid': isKaryawanInvalid }"
                  :placeholder="$t('placeholder.karyawan')"
                  disabled
                  v-model="karyawan.display.value"
                  aria-describedby="karyawanFeedback"
                />
                <InfoButton
                  class-prop="z-0"
                  data-bs-toggle="modal"
                  data-bs-target="#cariKaryawanModal"
                  :disabled="!inputModels.toko.value"
                  :title="
                    inputModels.toko.value ? viewStrings.emptyString : viewStrings.cariKaryawanTitle
                  "
                >
                  {{ $t('button.pilih') }}
                </InfoButton>
              </div>
              <div v-if="isKaryawanInvalid" id="karyawanFeedback`" class="invalid-feedback d-block">
                {{ $t('message.karyawanRequired') }}
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <label for="jabatan" class="col-sm-4 col-form-label">{{ $t('label.jabatan') }}</label>
            <div class="col-sm-8">
              <span id="jabatan" class="input-group-text">{{ jabatan || $t('label.jabatan') }}</span>
            </div>
          </div>
          <div class="row mb-2">
            <label for="shift" class="col-sm-4 col-form-label">{{ $t('label.shift') }}</label>
            <div class="col-sm-8">
              <div class="input-group">
                <span id="shift" class="input-group-text">{{ shift }}</span>
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <label for="jamShift" class="col-sm-4 col-form-label">{{ $t('label.jamShift') }}</label>
            <div class="col-sm-8">
              <div id="jamShift" class="input-group">
                <span class="input-group-text">{{ shiftMulai || $t('label.jamMulai') }}</span>
                <span class="input-group-text">s/d</span>
                <span class="input-group-text">{{ shiftSelesai || $t('label.jamSelesai') }}</span>
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <label for="tanggalLembur" class="col-sm-4 col-form-label">{{ $t('label.tanggalLembur') }}</label>
            <div class="col-sm-8">
              <DateInput
                id="tanggalLembur"
                :required="true"
                :errorMessage="$t('message.karyawanRequired')"
                :validation-toggle="validationToggle"
                :min="dateInputMin()"
                :max="dateInputMax()"
                :picked="inputModels.tanggalLembur.value"
                @change="change"
              />
            </div>
          </div>
          <div class="row mb-2">
            <label for="rincianTugas" class="col-sm-4 col-form-label">{{ $t('label.rincianTugas') }}</label>
            <div class="col-sm-8">
              <textarea
                v-model="rincianTugas"
                id="rincianTugas"
                class="form-control"
                rows="3"
                maxlength="160"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="col-sm ms-lg-4">
          <div class="row mb-2">
            <label for="aturBerdasarkan" class="col-sm-4 col-form-label">{{ $t('label.lemburBerdasarkan') }}</label>
            <div class="col-sm-8">
              <SelectInput
                id="aturBerdasarkan"
                :placeholder="$t('placeholder.lemburBerdasarkan')"
                :required="true"
                :options="aturBerdasarkanOptions"
                :error-message="$t('message.lemburBerdasarkanRequired')"
                :validation-toggle="validationToggle"
                :disabled="shift?.toUpperCase() === viewStrings.off"
                :selected="inputModels.aturBerdasarkan.value"
                @change="change"
              />
            </div>
          </div>
          <div class="card mb-2">
            <div
              class="card-body"
              :class="{
                'bg-primary': !durasiLemburDisabled,
                'bg-secondary-subtle': durasiLemburDisabled,
              }"
            >
              <div class="row mb-2">
                <label
                  for="durasiLembur"
                  class="col-sm-4 col-form-label"
                  :class="{
                    'text-white': !durasiLemburDisabled,
                  }"
                  >{{ $t('label.durasiLembur') }}</label
                >
                <div class="col-sm-8">
                  <NumberInput
                    @change="change"
                    :class-prop="!durasiLemburDisabled && isIstirahat ? '' : 'mb-2'"
                    :disabled="durasiLemburDisabled"
                    id="durasiLembur"
                    :max="durasiLemburMax"
                    :value="inputModels.durasiLembur.value"
                  />
                </div>
              </div>
              <div class="row">
                <label
                  for="jamShift"
                  class="col-sm-4 col-form-label"
                  :class="{
                    'text-white': !durasiLemburDisabled,
                  }"
                  >{{ $t('label.jamLembur') }}</label
                >
                <div class="col-sm-8">
                  <div id="jamShift" class="input-group">
                    <TimeInput
                      id="jamMulaiLembur"
                      :required="!durasiLemburDisabled"
                      :validation-toggle="validationToggle"
                      :picked="inputModels.jamMulaiLembur.value"
                      :disabled="durasiLemburDisabled"
                      @change="change"
                      @invalidate="invalidate"
                    />
                    <span class="input-group-text">{{ $t('label.until') }}</span>
                    <TimeInput
                      id="jamSelesaiLembur"
                      :required="!durasiLemburDisabled"
                      :validation-toggle="validationToggle"
                      :picked="inputModels.jamSelesaiLembur.value"
                      :disabled="durasiLemburDisabled"
                      :max="viewStrings.maxTime"
                      @change="change"
                      @invalidate="invalidate"
                    />
                  </div>
                  <div
                    v-if="!durasiLemburDisabled && isIstirahat"
                    class="valid-feedback text-white d-block mb-2"
                  >
                    {{ $t('message.jamIstirahat') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card mb-2">
            <div
              class="card-body"
              :class="{
                'bg-primary': !shiftLemburDisabled,
                'bg-secondary-subtle': shiftLemburDisabled,
              }"
            >
              <div class="row mb-2">
                <label
                  for="shiftLembur"
                  class="col-sm-4 col-form-label"
                  :class="{
                    'text-white': !shiftLemburDisabled,
                  }"
                  >{{ $t('label.shiftLembur') }}</label
                >
                <div class="col-sm-8">
                  <SelectInput
                    id="shiftLembur"
                    :placeholder="$t('placeholder.shiftLembur')"
                    :required="
                      inputModels.aturBerdasarkan.value === aturBerdasarkanEnum.shiftLembur
                    "
                    :options="shiftLemburOptions"
                    :error-message="$t('message.shiftLemburRequired')"
                    :validation-toggle="validationToggle"
                    :selected="shiftLembur"
                    :disabled="shiftLemburDisabled"
                    @change="changeShiftLembur"
                  />
                </div>
              </div>
              <div class="row">
                <label
                  for="jamShiftLembur"
                  class="col-sm-4 col-form-label"
                  :class="{
                    'text-white': !shiftLemburDisabled,
                  }"
                  >{{ $t('label.jamLembur') }}</label
                >
                <div class="col-sm-8">
                  <div id="jamShiftLembur" class="input-group">
                    <span class="input-group-text">{{
                      jamShiftLembur.jamMulai.value || $t('label.jamMulai')
                    }}</span>
                    <span class="input-group-text">s/d</span>
                    <span class="input-group-text">{{
                      jamShiftLembur.jamSelesai.value || $t('label.jamSelesai')
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-lg-4">
              <label for="dokumenPendukung" class="col-form-label">{{ $t('label.dokumen') }}</label><br />
              <small class="text-danger"><i>*Max. 1 MB</i></small
              ><br />
              <small class="text-danger"><i>{{ $t('message.fileFormat') }}</i></small>
            </div>
            <div class="col-lg-8">
              <input
                id="dokumenPendukung"
                class="form-control"
                :placeholder="$t('placeholder.dokumen')"
                type="file"
                accept="image/png,.jpeg,.jpg,.pdf"
                aria-describedby="dokumenPendukungFeedback"
                required
                @change="onFileChanged"
              />
              <div
                v-if="isFileInvalid"
                id="dokumenPendukungFeedback`"
                class="invalid-feedback d-block"
              >
                {{ fileInvalidMessage }}
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-lg-3"></div>
            <div class="col-lg-6 d-grid gap-2">
              <button class="btn btn-success">{{ $t('button.ajukan') }}</button>
            </div>
            <div class="col-lg-3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CariKaryawanModal
    :display-jabatan="true"
    :employees="employees"
    :is-nik-input="false"
    @pilih="pilih"
  />
  <BerhasilModal :symbol="berhasilModalToggle" :is-static="true" @konfirmasi-berhasil="refresh"
    >Pengajuan BA SPL berhasil disimpan!</BerhasilModal
  >
</template>

<script setup>
import '@/assets/css/form.css'
import BerhasilModal from '@/components/modals/BerhasilModal.vue'
import CariKaryawanModal from '@/components/modals/CariKaryawanModal.vue'
import { computed, ref, watch } from 'vue'
import DateInput from '@/components/inputs/DateInput.vue'
import { datesService } from '@/services/dates'
import InfoButton from '@/components/buttons/InfoButton.vue'
import NumberInput from '@/components/inputs/NumberInput.vue'
import SelectInput from '@/components/inputs/SelectInput.vue'
import { strings } from '@/models/strings'
import TimeInput from '@/components/inputs/TimeInput.vue'
import { timesService } from '@/services/times'
import { useI18n } from 'vue-i18n';

const aturBerdasarkanEnum = Object.freeze({
  durasiLembur: Symbol(1),
  shiftLembur: Symbol(2),
})
const viewStrings = Object.freeze({
  cariKaryawanTitle: 'Silakan pilih kode toko terlebih dahulu.',
  durasiLembur: 'Durasi',
  emptyString: strings.emptyString,
  en: 'en',
  enam: '6',
  fileMax1Mb: 'File tidak boleh melebihi 1 MB.',
  formatFileTidakDidukung: 'Format file tidak didukung.',
  id: 'id',
  idGroupShift: 'ID Group Shift',
  jabatanErrorMessage: 'Mohon maaf, gagal mengisi data jabatan. Mohon laporkan ke pengembang.',
  jamNol: '00:00:00',
  lima: '5',
  maxTime: '23:59:59',
  namaKaryawanDefault: 'Nama karyawan tak terbaca',
  nikDefault: 'NIK tak terbaca',
  shift: 'Shift',
  off: 'OFF',
})
// const emptyArray = Object.freeze([])
const supportedFileTypes = Object.freeze(['image/png', 'image/jpeg', 'application/pdf'])

const employees = [
  {
    jabatan: 'PIMPINAN SHIFT',
    name: 'FULAN',
    nik: '1999010220000304',
    shift: '1',
    shift_end: '11:30:00',
    shift_start: '08:00:00',
  },
  {
    jabatan: 'STORE CREW',
    name: 'FULANAH',
    nik: '2000020320010405',
    shift: '2',
    shift_end: '16:30:00',
    shift_start: '13:00:00',
  },
]
const errorMessage = ref('')
const isEnglish = ref(false)
const { locale } = useI18n({ useScope: 'global' });
const warningMessage = ref(viewStrings.emptyString)
const selectedToko = ref('')
const durasiLemburMax = ref(8)
const inputModels = {
  aturBerdasarkan: ref(viewStrings.emptyString),
  durasiLembur: ref(1),
  jamMulaiLembur: ref(null),
  jamSelesaiLembur: ref(null),
  tanggalLembur: ref(''),
  toko: ref(''),
}
const invalidInputs = {
  jamSelesaiLembur: false,
}
const shiftLembur = ref('')
const karyawan = {
  nik: viewStrings.emptyString,
  name: viewStrings.emptyString,
  display: ref(viewStrings.emptyString),
}
const jabatan = ref('')
const shift = ref(viewStrings.shift)
const shiftMulai = ref(viewStrings.emptyString)
const shiftSelesai = ref(viewStrings.emptyString)
const kodeTokoOptions = [
  {
    label: 'FRESH ANCOL 1',
    value: 'T001',
  },
  {
    label: 'TOKO LAIN',
    value: 'LAIN',
  },
]
const validationToggle = ref(false)
const berhasilModalToggle = ref(false)
const isKaryawanInvalid = ref(false)
const shiftLemburOptions = [
  {
    label: '1',
    shift_end: '11:30:00',
    shift_start: '08:00:00',
    value: '1',
  },
  {
    label: '2',
    shift_end: '16:30:00',
    shift_start: '13:00:00',
    value: '2',
  },
]
const jamShiftLembur = {
  jamMulai: ref(''),
  jamSelesai: ref(''),
}
const rincianTugas = ref('')
let file = null
const isFileInvalid = ref(false)
const fileInvalidMessage = ref('File invalid.')

const durasiLemburDisabled = computed(
  () => inputModels.aturBerdasarkan.value !== aturBerdasarkanEnum.durasiLembur,
)
const shiftLemburDisabled = computed(
  () => inputModels.aturBerdasarkan.value !== aturBerdasarkanEnum.shiftLembur,
)
const isIstirahat = computed(() => inputModels.durasiLembur.value >= 5)
const jamSelesaiLembur = computed(() => {
  if (!shiftSelesai.value || !inputModels.jamMulaiLembur.value) {
    return viewStrings.emptyString
  }
  const pergeseranJam = isIstirahat.value
    ? inputModels.durasiLembur.value + 1
    : inputModels.durasiLembur.value
  return timesService.translateTimeByHour(inputModels.jamMulaiLembur.value, pergeseranJam)
})
const aturBerdasarkanOptions = computed(() => {
  return [
    { value: aturBerdasarkanEnum.durasiLembur, label: viewStrings.durasiLembur },
    { value: aturBerdasarkanEnum.shiftLembur, label: viewStrings.shift },
  ]
})
const displayWarningMessage = computed(() => warningMessage.value || viewStrings.emptyString)

watch(isEnglish, (newIsEnglish) => {
  if (newIsEnglish) {
    locale.value = viewStrings.en
  } else {
    locale.value = viewStrings.id
  }
})
watch(shiftLemburDisabled, (newShiftLemburDisabled) => {
  if (newShiftLemburDisabled) {
    shiftLembur.value = viewStrings.emptyString
    jamShiftLembur.jamMulai.value = viewStrings.emptyString
    jamShiftLembur.jamSelesai.value = viewStrings.emptyString
  }
})
watch(
  [durasiLemburDisabled, jamSelesaiLembur, inputModels.durasiLembur],
  ([newDurasiLemburDisabled, newJamSelesaiLembur]) => {
    if (newDurasiLemburDisabled) {
      return
    }
    inputModels.jamSelesaiLembur.value = newJamSelesaiLembur
  },
)

function pilih(terpilih) {
  karyawan.nik = terpilih.nik
  karyawan.name = terpilih.name
  karyawan.display.value = `${terpilih.nik || viewStrings.nikDefault} - ${terpilih.name || viewStrings.namaKaryawanDefault}`
  isKaryawanInvalid.value = false
  jabatan.value = terpilih.jabatan
  if (!jabatan.value) {
    errorMessage.value = viewStrings.jabatanErrorMessage
  }
  shift.value = terpilih.shift
  shiftMulai.value = terpilih.shift_start
  shiftSelesai.value = terpilih.shift_end
  inputModels.jamMulaiLembur.value = terpilih.shift_end
}
function change(value, id) {
  inputModels[id].value = value
}
function changeShiftLembur(value) {
  shiftLembur.value = value
  const shiftObject = shiftLemburOptions.find((shift) => shift.value === value)
  jamShiftLembur.jamMulai.value = shiftObject?.shift_start
  jamShiftLembur.jamSelesai.value = shiftObject?.shift_end
}
function invalidate(value, id) {
  invalidInputs[id] = value
}
function refresh() {
  router.go(0)
}
function onFileChanged(e) {
  file = e.target.files[0]
  if (!file) {
    isFileInvalid.value = false
    return
  }
  if (supportedFileTypes.indexOf(file.type) === -1) {
    fileInvalidMessage.value = viewStrings.formatFileTidakDidukung
    isFileInvalid.value = true
  } else if (file.size > 1048576) {
    fileInvalidMessage.value = viewStrings.fileMax1Mb
    isFileInvalid.value = true
  } else {
    isFileInvalid.value = false
  }
}
function dateInputMax() {
  const date = new Date()
  return datesService.toDatePickerString(new Date(date.getFullYear(), date.getMonth() + 2, 0))
}
function dateInputMin() {
  return datesService.toDatePickerString()
}
</script>

<style>
.my-square-card {
  border-radius: 0;
}
</style>
