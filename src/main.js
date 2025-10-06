import 'bootstrap/scss/bootstrap.scss'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

const i18n = createI18n({
  legacy: false,
  locale: 'id',
  fallbackLocale: 'en',
  messages: {
    id: {
      button: {
        ajukan: 'Ajukan',
        pilih: 'Pilih'
      },
      column: {
        jabatan: '@.upper:label.jabatan',
        shift: '@.upper:label.shift'
      },
      placeholder: {
        cari: 'Cari',
        dokumen: 'Pilih Dokumen Pendukung',
        lemburBerdasarkan: 'Pilih Dasar Pengaturan',
        shiftLembur: 'Pilih Shift Lembur',
        toko: 'Pilih Toko',
        karyawan: 'Pilih Karyawan'
      },
      title: {
        cariKaryawanModal: 'Cari NIK/Nama Karyawan',
        myForm: 'Form Pengajuan Lembur'
      },
      label: {
        dari: 'dari',
        dokumen: 'Dokumen Pendukung',
        durasiLembur: 'Durasi Lembur',
        jabatan: 'Jabatan',
        jamLembur: 'Jam Lembur',
        jamMulai: 'Jam Mulai',
        jamSelesai: 'Jam Selesai',
        jamShift: 'Jam Shift',
        lemburBerdasarkan: 'Lembur Berdasarkan',
        lihat: 'Lihat',
        nama: 'NAMA',
        nik: 'NIK',
        rincianTugas: 'Rincian Tugas',
        shift: 'Shift',
        shiftLembur: 'Shift Lembur',
        tanggalLembur: 'Tanggal Lembur',
        toko: 'Toko',
        until: 's/d',
        karyawan: 'NIK – Nama Karyawan'
      },
      message: {
        fileFormat: '*Format file JPEG, JPG, PNG, PDF',
        jamIstirahat: 'Termasuk 1 jam istirahat',
        lemburBerdasarkanRequired: 'Dasar pengaturan wajib dipilih.',
        shiftLemburRequired: 'Shift lembur wajib dipilih.',
        tanggalLemburRequired: 'Tanggal lembur wajib dipilih.',
        tokoRequired: 'Toko wajib dipilih.',
        karyawanRequired: 'Karyawan wajib dipilih.'
      }
    },
    en: {
      button: {
        ajukan: 'Submit',
        pilih: 'Pick'
      },
      column: {
        jabatan: '@.upper:label.jabatan',
        shift: '@.upper:label.shift'
      },
      placeholder: {
        cari: 'Search',
        dokumen: 'Select Supporting Document',
        lemburBerdasarkan: 'Select Overtime by',
        shiftLembur: 'Select Overtime Shift',
        toko: 'Select Store',
        karyawan: 'Select Employee'
      },
      title: {
        cariKaryawanModal: 'Search Employee ID/Name',
        myForm: 'Overtime Request Form'
      },
      label: {
        dari: 'of',
        dokumen: 'Supporting Document',
        durasiLembur: 'Overtime Duration',
        jabatan: 'Position',
        jamLembur: 'Overtime Period',
        jamMulai: 'Start Time',
        jamSelesai: 'End Time',
        jamShift: 'Shift Period',
        lemburBerdasarkan: 'Overtime by',
        lihat: 'Show',
        nama: 'NAME',
        nik: 'ID',
        rincianTugas: 'Task Description',
        shift: 'Shift',
        shiftLembur: 'Overtime Shift',
        tanggalLembur: 'Overtime Date',
        toko: 'Store',
        until: 'until',
        karyawan: 'ID – Employee Name'
      },
      message: {
        fileFormat: '*File formats JPEG, JPG, PNG, PDF',
        jamIstirahat: '1 hour recess included',
        lemburBerdasarkanRequired: 'Overtime by is required.',
        shiftLemburRequired: 'Overtime shift is required.',
        tanggalLemburRequired: 'Overtime date is required.',
        tokoRequired: 'Store is required.',
        karyawanRequired: 'Employee is required.'
      }
    }
  }
})

app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
