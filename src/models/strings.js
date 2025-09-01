export const strings = {
  commaSeparator: ',',
  debug: Object.freeze({
    defaultNik: '2024220789',
  }),
  defaultErrorMessage: 'Service sedang tidak tersedia. Mohon coba lagi nanti.',
  defaultLoadingMessage: 'Sedang mengambil data dari service ...',
  errNetwork: 'ERR_NETWORK',
  functionString: 'function',
  networkErrorMessage: 'Masalah jaringan terdeteksi. Mohon periksa internet Anda.',
  routeNames: Object.freeze({
    home: 'home',
    login: 'login',
    notFound: 'notFound',
  }),
  trueString: 'true',
  javascriptErrorMessage:
    'Mohon maaf, terjadi kesalahan Javascript. Silakan laporkan ke pengembang.',
  string: 'string',
  loginHref: '/login',
  emptyString: '',
  isString(value) {
    return typeof value === this.string || value instanceof String
  },
}
