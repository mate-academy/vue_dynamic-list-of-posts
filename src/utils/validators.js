export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email.trim());
};
