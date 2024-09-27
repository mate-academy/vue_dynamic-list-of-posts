import { client } from './httpClient'

export const getUser = (email) => {
  return client.get(`/users?email=${email}`)
}

export const registerUser = ({ email, name }) => {
  return client.post('/users', { email, name })
}
