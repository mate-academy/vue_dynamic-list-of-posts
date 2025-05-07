export const getLocalUser = () => {
  let user = null;
  const jsonData = localStorage.getItem('user') || null;

  try {
    user = JSON.parse(jsonData);
  } catch (e) {
    return user;
  }

  return user;
}
