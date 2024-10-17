export const getLocaleStorage = (key) => {
  const value = window.localStorage.getItem(key);

  if (value) {
    try {
      return JSON.parse(value);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  return null;
};
