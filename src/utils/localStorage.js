const VALID_KEY = 'loggedInUser'
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(VALID_KEY))
  } catch {
    return
  }
}

export function setUser(user) {
  try {
    return localStorage.setItem(VALID_KEY, JSON.stringify(user))
  } catch {
    return
  }
}

export function clearUser() {
  localStorage.removeItem(VALID_KEY)
}
