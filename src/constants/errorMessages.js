export const errorMessages = {
  emptyField(value) {
    const capitalizedValue = value[0].toUpperCase() + value.slice(1)
    return `${capitalizedValue} is required.`
  },

  email: 'Please provide valid email.',
}
