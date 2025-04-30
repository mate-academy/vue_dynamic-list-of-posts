const USER_KEY = 'user';

export const setUser = user => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem(USER_KEY));
};

export const getUserId = () => {
  return getUser()?.id;
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};
