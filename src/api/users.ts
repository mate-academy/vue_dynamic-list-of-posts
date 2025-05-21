import { User } from '../utils/types'
import { client } from '../utils/fetchClient'

export const getUser = async (email: string): Promise<User> => {
  const response = await client.get(`/users?email=${email}`)

  return response.data
}

export const createUser = async (email: string, name: string): Promise<User> => {
  const response = await client.post('/users', {
    email,
    name,
  })

  return response.data
}
