import axios from 'axios'

export const client = axios.create({
  baseURL: 'https://mate.academy/students-api',

  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
