export const textCheck = (text, type) => {
  if (!text.trim()) {
    return `${type} is require`;
  }

  return '';
};

export const emailCheck = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return 'Email is required';
  }

  if (!emailRegex.test(email)) {
    return 'Email is not valid';
  }

  return '';
}
