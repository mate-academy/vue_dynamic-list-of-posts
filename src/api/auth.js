import { client } from '@/httpClient'

export const auth = {
  getId(email) {
    return client.get(`/users?email=${email}`)
  },
  createUser(data) {
    return client.post(`/users?email=${data.email}`, data)
  },
}
