export const getUserFromLS = (): User.Data | null => {
  const userData = localStorage.getItem("user");

  return userData ? JSON.parse(userData) : null;
};
