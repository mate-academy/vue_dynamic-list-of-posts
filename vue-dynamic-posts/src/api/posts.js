const API_URL = 'https://mate.academy/students-api'

export async function getPosts() {
  const response = await fetch(`${API_URL}/posts`)

  return response.json()
}