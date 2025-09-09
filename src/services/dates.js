const hari = Object.freeze({
  0: 'MINGGU',
  1: 'SENIN',
  2: 'SELASA',
  3: 'RABU',
  4: 'KAMIS',
  5: 'JUMAT',
  6: 'SABTU',
})
const bulan = {
  0: 'Januari',
  1: 'Februari',
  2: 'Maret',
  3: 'April',
  4: 'Mei',
  5: 'Juni',
  6: 'Juli',
  7: 'Agustus',
  8: 'September',
  9: 'Oktober',
  10: 'November',
  11: 'Desember',
}
const zeroChar = '0'

export const datesService = {
  hariDictionary: hari,
  hari(dayIndex = new Date().getDay()) {
    return hari[dayIndex]
  },
  bulan(monthIndex = new Date().getMonth()) {
    return bulan[monthIndex]
  },
  formatTanggal(tanggal = new Date(), isUpperCase = false, isTahun = true) {
    const namaBulan = isUpperCase
      ? this.bulan(tanggal.getMonth()).toUpperCase()
      : this.bulan(tanggal.getMonth())
    const stringTanggal = `${tanggal.getDate()} ${namaBulan}`
    return isTahun ? stringTanggal.concat(` ${tanggal.getFullYear()}`) : stringTanggal
  },
  toDatePickerString(date = new Date()) {
    const month = (date.getMonth() + 1).toString().padStart(2, zeroChar)
    const dateString = date.getDate().toString().padStart(2, zeroChar)
    return `${date.getFullYear()}-${month}-${dateString}`
  },
}
