export const setLocaleStorage = (key, data) => {
  try {
    const jsonData = JSON.stringify(data);

    window.localStorage.setItem(key, jsonData);
  } catch (err) {
    console.error(err);
  }
};
