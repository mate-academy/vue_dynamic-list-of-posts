const API_URL = 'https://mate-academy.github.io/fe-students-api'

export async function getPosts() {
  const response = await fetch(
    `${API_URL}/posts`,
  )

  if (!response.ok) {
    throw new Error('Failed to load posts')
  }

  return response.json()
}