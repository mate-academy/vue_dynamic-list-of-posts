import { client } from '@/utils/https'
import { getUser, setUser } from '@/utils/localStorage'

export const getCurrentUser = async () => {
  const localUser = getUser()
  if (localUser) {
    return localUser
  }
  const resp = await client.get(`/users/${getUser().id || ''}`)
  setUser(resp.data)

  return resp.data
}

export const logInUser = async (email) => {
  const resp = await client.get(`/users?email=${email}`)

  return resp
}
