export const clearAppLocalStorage = () => {
  const keysToRemove = ['user']; // додай сюди інші ключі, які хочеш видалити

  try {
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (err) {
    console.error('Error removing app-specific keys from localStorage:', err);
  }
};
