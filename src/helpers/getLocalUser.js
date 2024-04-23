export const getLocalUser = () => {
  let user = {};
  const jsonData = localStorage.getItem('user') || '{}';

  try {
    user = JSON.parse(jsonData);
  } catch (e) {
    return user;
  }

  return user;
}