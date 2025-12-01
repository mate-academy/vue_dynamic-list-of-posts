import type { User } from '../utils/types'

export const getUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null

    return JSON.parse(raw) as User
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error)
    return null
  }
}

export const setUser = (user: User): void => {
  try {
    localStorage.setItem('user', JSON.stringify(user))
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

export const logoutUser = (): void => {
  localStorage.removeItem('user')
}

export const getUserId = (): number | undefined => {
  return getUser()?.id
}
