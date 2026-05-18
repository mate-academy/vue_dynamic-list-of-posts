const USERS_URL = 'https://mate.academy/students-api/users'

export const findUserByEmail = async (email) => {
  const response = await fetch(`${USERS_URL}?email=${encodeURIComponent(email)}`)

  if (!response.ok) {
    throw new Error('Unable to check this email right now')
  }

  const users = await response.json()

  return users[0] || null
}

export const createUser = async ({ email, name }) => {
  const response = await fetch(USERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ email, name }),
  })

  if (!response.ok) {
    throw new Error('Unable to create this user right now')
  }

  return response.json()
}
