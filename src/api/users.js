import axios from 'axios'

const API_URL = 'https://mate.academy/students-api'

export function getUserByEmail(email) {
  return axios.get(`${API_URL}/users`, {
    params: { email },
  })
}

export function createUser(user) {
  return axios.post(`${API_URL}/users`, user)
}