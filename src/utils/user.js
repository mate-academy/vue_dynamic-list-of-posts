export const setUser = user => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => JSON.parse(localStorage.getItem('user'));

export const getUserId = () => JSON.parse(localStorage.getItem('user')).id;

export const removeUser = () => localStorage.removeItem('user');
