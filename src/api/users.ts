import { client } from '@/utils/httpClient'

export const getUsers = <T>() => {
  return client.get<T>('/users')
}
