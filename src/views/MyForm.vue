<template>
  <div v-if="errorMessage" class="alert alert-danger" role="alert">
    {{ errorMessage }}
  </div>
  <div v-if="displayWarningMessage" class="alert alert-warning" role="alert">
    {{ displayWarningMessage }}
  </div>
  <div class="row mb-2 mx-sm-0">
    <div class="col-sm me-lg-4">
      <div class="row mb-2">
        <label for="toko" class="col-sm-4 col-form-label">Kode Toko</label>
        <div class="col-sm-8">
          <SelectInput
            id="toko"
            placeholder="Pilih Toko"
            :required="true"
            :options="kodeTokoOptions"
            error-message="Toko wajib dipilih."
            :validation-toggle="validationToggle"
            :selected="selectedToko"
            :disabled="kodeTokoOptions.length === 1"
            @change="change"
          />
        </div>
      </div>
      <div class="row mb-2">
        <label for="karyawan" class="col-sm-4 col-form-label">NIK – Nama Karyawan</label>
        <div class="col-sm-8">
          <div class="input-group">
            <input
              id="karyawan"
              class="form-control"
              :class="{ 'is-invalid': isKaryawanInvalid }"
              placeholder="Pilih Karyawan"
              disabled
              v-model="karyawan.display.value"
              aria-describedby="karyawanFeedback"
            />
            <InfoButton
              class-prop="z-0"
              data-bs-toggle="modal"
              data-bs-target="#cariKaryawanModal"
              :disabled="!inputModels.toko.value"
            >
              Cari
            </InfoButton>
          </div>
          <div v-if="isKaryawanInvalid" id="karyawanFeedback`" class="invalid-feedback d-block">
            Karyawan wajib dipilih.
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <label for="jabatan" class="col-sm-4 col-form-label">Jabatan</label>
        <div class="col-sm-8">
          <span id="jabatan" class="input-group-text">{{ jabatan || 'Jabatan' }}</span>
        </div>
      </div>
      <div class="row mb-2">
        <label for="idGroupShift" class="col-sm-4 col-form-label">ID Group Shift</label>
        <div class="col-sm-8">
          <span id="idGroupShift" class="input-group-text">{{
            karyawan.idShiftGroup.value || viewStrings.idGroupShift
          }}</span>
        </div>
      </div>
      <div class="row mb-2">
        <label for="tanggalLembur" class="col-sm-4 col-form-label">Tanggal Lembur</label>
        <div class="col-sm-8">
          <DateInput
            id="tanggalLembur"
            :required="true"
            errorMessage="Tanggal lembur wajib dipilih."
            :validation-toggle="validationToggle"
            :min="dateInputMin()"
            :max="dateInputMax()"
            :picked="inputModels.tanggalLembur.value"
            @change="change"
          />
        </div>
      </div>
      <div class="row mb-2">
        <label for="nomorSpl" class="col-lg-4 col-form-label">Nomor SPL</label>
        <div class="col-lg-8">
          <div class="input-group">
            <SelectInput
              id="nomorSpl"
              placeholder="Pilih Nomor SPL"
              :options="nomorSplOptions"
              error-message="Nomor SPL invalid."
              :validation-toggle="validationToggle"
              :selected="inputModels.nomorSpl.value"
              @change="change"
            />
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <label for="shift" class="col-sm-4 col-form-label">Shift</label>
        <div class="col-sm-8">
          <div class="input-group">
            <span id="shift" class="input-group-text">{{ shift }}</span>
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <label for="jamShift" class="col-sm-4 col-form-label">Jam Shift</label>
        <div class="col-sm-8">
          <div id="jamShift" class="input-group">
            <span class="input-group-text">{{ shiftMulai || viewStrings.jamMulai }}</span>
            <span class="input-group-text">s/d</span>
            <span class="input-group-text">{{ shiftSelesai || viewStrings.jamSelesai }}</span>
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <label for="alasanLembur" class="col-sm-4 col-form-label">Alasan Lembur</label>
        <div class="col-sm-8">
          <SelectInput
            id="alasanLembur"
            placeholder="Pilih Alasan Lembur"
            :required="true"
            :options="alasanLemburOptions"
            error-message="Alasan lembur wajib dipilih."
            :validation-toggle="validationToggle"
            :selected="inputModels.alasanLembur.value"
            @change="change"
          />
        </div>
      </div>
      <div v-show="subAlasanOptions !== emptyArray" class="row mb-2">
        <label for="alasanLembur" class="col-sm-4 col-form-label">Sub Alasan</label>
        <div class="col-sm-8">
          <SelectInput
            id="subAlasan"
            placeholder="Pilih Sub Alasan"
            :required="true"
            :options="subAlasanOptions"
            error-message="Sub alasan wajib dipilih."
            :validation-toggle="validationToggle"
            :selected="inputModels.subAlasan.value"
            @change="change"
          />
        </div>
      </div>
    </div>
    <div class="col-sm ms-lg-4">
      <div class="row mb-2">
        <label for="alasanBaSpl" class="col-sm-4 col-form-label">Alasan Pengajuan BA SPL</label>
        <div class="col-sm-8">
          <SelectInput
            id="alasanBaSpl"
            placeholder="Pilih Alasan Pengajuan BA SPL"
            :required="true"
            :options="alasanBaSplOptions"
            error-message="Alasan pengajuan BA SPL wajib dipilih."
            :validation-toggle="validationToggle"
            @change="change"
          />
        </div>
      </div>
      <div class="row mb-2">
        <label for="aturBerdasarkan" class="col-sm-4 col-form-label">Lembur Berdasarkan</label>
        <div class="col-sm-8">
          <SelectInput
            id="aturBerdasarkan"
            placeholder="Pilih Dasar Pengaturan"
            :required="true"
            :options="aturBerdasarkanOptions"
            error-message="Dasar pengaturan wajib dipilih."
            :validation-toggle="validationToggle"
            :disabled="shift?.toUpperCase() === viewStrings.off || !inputModels.alasanLembur.value"
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
              >Durasi Lembur</label
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
              <div id="durasiLemburFeedback" class="my-invalid-feedback">
                Shift group 6S dan 6NS tidak boleh lembur melebihi 7 jam.
              </div>
            </div>
          </div>
          <div class="row">
            <label
              for="jamShift"
              class="col-sm-4 col-form-label"
              :class="{
                'text-white': !durasiLemburDisabled,
              }"
              >Jam Lembur</label
            >
            <div class="col-sm-8">
              <div id="jamShift" class="input-group">
                <TimeInput
                  id="jamMulaiLembur"
                  :required="!durasiLemburDisabled"
                  :validation-toggle="validationToggle"
                  :picked="inputModels.jamMulaiLembur.value"
                  :disabled="durasiLemburDisabled"
                  :min="jamMulaiLemburMin"
                  @change="change"
                  @invalidate="invalidate"
                />
                <span class="input-group-text">s/d</span>
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
                Termasuk 1 jam istirahat
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
              >Shift Lembur</label
            >
            <div class="col-sm-8">
              <SelectInput
                id="shiftLembur"
                placeholder="Pilih Shift Lembur"
                :required="inputModels.aturBerdasarkan.value === aturBerdasarkanEnum.shiftLembur"
                :options="shiftLemburOptions"
                error-message="Shift lembur wajib dipilih."
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
              >Jam Shift Lembur</label
            >
            <div class="col-sm-8">
              <div id="jamShiftLembur" class="input-group">
                <span class="input-group-text">{{
                  jamShiftLembur.jamMulai.value || viewStrings.jamMulai
                }}</span>
                <span class="input-group-text">s/d</span>
                <span class="input-group-text">{{
                  jamShiftLembur.jamSelesai.value || viewStrings.jamSelesai
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <label for="rincianTugas" class="col-sm-4 col-form-label">Rincian Tugas</label>
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
      <div class="row mb-2">
        <div class="col-lg-4">
          <label for="dokumenPendukung" class="col-form-label">Dokumen Pendukung</label
          ><br class="d-inline d-lg-none" />
          <small class="text-danger"><i>*Max. 1 MB</i></small
          ><br />
          <small class="text-danger"><i>*Format file JPEG, JPG, PNG, PDF</i></small>
        </div>
        <div class="col-lg-8">
          <input
            id="dokumenPendukung"
            class="form-control"
            placeholder="Pilih Dokumen Pendukung"
            type="file"
            accept="image/png,.jpeg,.jpg,.pdf"
            aria-describedby="dokumenPendukungFeedback"
            required
            @change="onFileChanged"
          />
          <div v-if="isFileInvalid" id="dokumenPendukungFeedback`" class="invalid-feedback d-block">
            {{ fileInvalidMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <CariKaryawanModal :is-nik-input="false" @pilih="pilih" :display-jabatan="true" />
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

const aturBerdasarkanEnum = Object.freeze({
  durasiLembur: Symbol(1),
  shiftLembur: Symbol(2),
})
const viewStrings = Object.freeze({
  alasanListErrorMessage: 'Mohon maaf, gagal mengambil data alasan.',
  cariKaryawan: 'Cari karyawan',
  dokumenPendukungWajibDiisi: 'Dokumen pendukung wajib diisi.',
  durasiLembur: 'Durasi',
  employeeShiftErrorMessage: 'Mohon maaf, gagal mengambil data shift.',
  hapusNomorSplSebelumCariKaryawanLain: 'Hapus nomor SPL sebelum cari karyawan lain',
  idGroupShift: 'ID Group Shift',
  jamMulai: 'Jam Mulai',
  jamSelesai: 'Jam Selesai',
  namaKaryawanDefault: 'Nama karyawan tak terbaca',
  nikDefault: 'NIK tak terbaca',
  nomorSplSudahTerbayarErrorMessage:
    'Nomor SPL terpilih sudah terbayar sehingga tidak bisa dibuatkan BA SPL.',
  pilihKaryawan: 'Pilih Karyawan',
  sebelumSetelahShiftWajibDipilih: 'Sebelum/setelah shift wajib dipilih.',
  shift: 'Shift',
  simpanButtonTitle: 'Mohon pilih nomor SPL dengan status selain terbayar.',
  waktuLemburHarusBackTime: 'Waktu lembur untuk BA SPL harus backtime.',
  off: 'OFF',
  jamShiftLemburErrorMessage: 'Mohon maaf, gagal mengambil data jam shift lembur.',
  jamNol: '00:00:00',
  maxTime: '23:59:59',
  emptyString: strings.emptyString,
  y: 'Y',
  n: 'N',
  createBaSplErrorMessage: 'Mohon maaf, gagal mengajukan BA SPL.',
  dateServerValidationError: 'Mohon maaf, service gagal memvalidasi tanggal SPL.',
  getListNoSplErrorMessage: 'Mohon maaf, gagal mengambil nomor SPL.',
  jabatanErrorMessage: 'Mohon maaf, gagal mengisi data jabatan. Mohon laporkan ke pengembang.',
  defaultLoadingWarningMessage: 'Sedang mengambil data dari service ...',
  satu: '1',
  dua: '2',
  tiga: '3',
  lima: '5',
  enam: '6',
  formatFileTidakDidukung: 'Format file tidak didukung.',
  fileMax1Mb: 'File tidak boleh melebihi 1 MB.',
})
const emptyArray = Object.freeze([])
const supportedFileTypes = Object.freeze(['image/png', 'image/jpeg', 'application/pdf'])

const errorMessage = ref('')
const warningMessage = ref(viewStrings.emptyString)
const selectedToko = ref('')
const durasiLemburMax = ref(7)
const inputModels = {
  alasanLembur: ref(''),
  alasanBaSpl: ref(''),
  aturBerdasarkan: ref(viewStrings.emptyString),
  durasiLembur: ref(1),
  jamMulaiLembur: ref(null),
  jamSelesaiLembur: ref(null),
  subAlasan: ref(viewStrings.emptyString),
  tanggalLembur: ref(''),
  toko: ref(''),
  nomorSpl: ref(''),
}
const invalidInputs = {
  jamMulaiLembur: false,
  jamSelesaiLembur: false,
}
const shiftLembur = ref('')
const karyawan = {
  nik: viewStrings.emptyString,
  name: viewStrings.emptyString,
  idShiftGroup: ref(viewStrings.emptyString),
  display: ref(viewStrings.emptyString),
}
const jabatan = ref('')
const shift = ref(viewStrings.shift)
const shiftMulai = ref(viewStrings.emptyString)
const shiftSelesai = ref(viewStrings.emptyString)
const kodeTokoOptions = ref([])
const alasanLemburOptions = ref([])
const alasanBaSplOptions = ref([])
const validationToggle = ref(false)
const berhasilModalToggle = ref(false)
const isKaryawanInvalid = ref(false)
const shiftLemburOptions = ref(emptyArray)
const jamShiftLembur = {
  jamMulai: ref(''),
  jamSelesai: ref(''),
}
const rincianTugas = ref('')
const nomorSplOptions = ref(emptyArray)
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
const jamMulaiLembur = computed(() => {
  if (!shiftMulai.value || !inputModels.jamSelesaiLembur.value) {
    return viewStrings.emptyString
  }
  const pergeseranJam = isIstirahat.value
    ? -inputModels.durasiLembur.value - 1
    : -inputModels.durasiLembur.value
  return timesService.translateTimeByHour(inputModels.jamSelesaiLembur.value, pergeseranJam)
})
const jamMulaiLemburMin = computed(() => {
  return shiftSelesai.value === viewStrings.off ? viewStrings.jamNol : shiftSelesai.value
})
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
const subAlasanOptions = computed(() => {
  const option = alasanLemburOptions.value.find(
    (option) => option?.value === inputModels.alasanLembur.value,
  )
  return (
    option?.sub_alasan?.map((sub) => {
      return { value: sub, label: sub }
    }) || emptyArray
  )
})

watch(shiftLemburDisabled, (newShiftLemburDisabled) => {
  if (newShiftLemburDisabled) {
    shiftLembur.value = viewStrings.emptyString
    jamShiftLembur.jamMulai.value = viewStrings.emptyString
    jamShiftLembur.jamSelesai.value = viewStrings.emptyString
  }
})
watch(
  [durasiLemburDisabled, jamSelesaiLembur, jamMulaiLembur, inputModels.durasiLembur],
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
  karyawan.idShiftGroup.value = terpilih.id_shift_group
  if (karyawan.idShiftGroup.value.startsWith?.(viewStrings.lima)) {
    durasiLemburMax.value = 8
  } else if (karyawan.idShiftGroup.value.startsWith?.(viewStrings.enam)) {
    durasiLemburMax.value = 7
  }
  karyawan.display.value = `${terpilih.nik || viewStrings.nikDefault} - ${terpilih.name || viewStrings.namaKaryawanDefault}`
  isKaryawanInvalid.value = false
  jabatan.value = terpilih.jabatan
  if (!jabatan.value) {
    errorMessage.value = viewStrings.jabatanErrorMessage
  }
}
function change(value, id) {
  inputModels[id].value = value
}
function changeShiftLembur(value) {
  shiftLembur.value = value
  const shiftObject = shiftLemburOptions.value.find((shift) => shift.value === value)
  jamShiftLembur.jamMulai.value = shiftObject?.shift_mulai
  jamShiftLembur.jamSelesai.value = shiftObject?.shift_selesai
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
  date.setDate(date.getDate() - 1)
  return datesService.toDatePickerString(date)
}
function dateInputMin() {
  const date = new Date()
  if (date.getDate() < 6) {
    date.setMonth(date.getMonth() - 3, 1)
  } else {
    date.setMonth(date.getMonth() - 2, 1)
  }
  return datesService.toDatePickerString(date)
}
</script>
