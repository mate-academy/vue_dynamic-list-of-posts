export const validationRules = {
  required: (value, message) => (value ? null : message),
  email: (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      return 'Email is required.'
    } else if (!emailPattern.test(value)) {
      return 'Please enter a valid email address.'
    } else {
      return ''
    }
  },
  minValue: (value, min, message) => (value >= min ? null : message),
}
