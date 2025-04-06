import { errorMessages } from '@/constants/errorMessages'
import { validationRules } from '@/constants/validationRules'

function hasErrors(errors) {
  return Object.values(errors).some((error) => error.length > 0)
}

export const validateForm = (form) => {
  const errors = {}
  for (const [key, value] of Object.entries(form)) {
    const errorMessage = validationRules.required(value, errorMessages.emptyField(key))

    if (errorMessage) {
      errors[key] = errorMessage
      continue
    }

    if (key === 'email') {
      errors[key] = validationRules.email(value)
    }
  }

  return { errors, hasErrors: hasErrors(errors) }
}
