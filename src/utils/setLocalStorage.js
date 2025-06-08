export const setLocalStorage = (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};
