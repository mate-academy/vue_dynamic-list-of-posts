const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getCurrentUser = async () => {
  const response = await fetch(`${BASE_URL}/users/1`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};
