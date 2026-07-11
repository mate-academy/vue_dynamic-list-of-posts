export const BASE_URL = 'https://mate.academy/students-api';

export async function getData(url) {
  const res = await fetch(BASE_URL + url);

  if (!res.ok) {
    throw new Error("Error")
  }

  return res.json();
} 