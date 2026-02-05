import { client } from '@/utils/http.ts'

export const getUsers = async () => {
  const response = await client.get('/users')

  return response.data
}

export const createUser = async (name: string, email: string) => {
  const response = await client.post('/users', { name, email })

  return response.data
}

export const getUserById = async (id: number) => {
  const response = await client.get(`/users/${id}`)

  return response.data
}
