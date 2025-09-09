export const validationService = {
  isBoolean(field) {
    return field === true || field === false
  },
  isNotBoolean(field) {
    return field !== true && field !== false
  },
}
