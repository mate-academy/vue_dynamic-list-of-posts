export const BASE_URL = 'https://mate-academy.github.io/fe-students-api';

export async function getData(url) {
  const res = await fetch(BASE_URL + url);

  if (!res.ok) {
    throw new Error("Error")
  }

  return res.json();
}