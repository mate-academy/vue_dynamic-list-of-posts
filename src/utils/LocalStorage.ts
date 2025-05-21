export const getUser = () => {
  return JSON.parse(localStorage.getItem('user'))
}

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const logoutUser = () => {
  localStorage.removeItem('user')
}

export const getUserId = () => {
  return getUser()?.id
}
