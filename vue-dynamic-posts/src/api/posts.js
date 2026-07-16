const API_URL = 'https://mate-academy.github.io/fe-students-api'

export async function getPosts() {
  const response = await fetch(`${API_URL}/posts`)

  return response.json()
}