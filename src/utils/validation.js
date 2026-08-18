const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isBlank(value) {
  return String(value ?? '').trim().length === 0;
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value ?? '').trim());
}

export function validateLogin({ email, name, registrationRequired }) {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email';
  }

  if (registrationRequired && String(name ?? '').trim().length < 4) {
    errors.name = 'Name must contain at least 4 characters';
  }

  return errors;
}

export function validatePost({ title, body }) {
  const errors = {};

  if (isBlank(title)) {
    errors.title = 'Title is required';
  }

  if (isBlank(body)) {
    errors.body = 'Post body is required';
  }

  return errors;
}

export function validateComment({ name, email, body }) {
  const errors = {};

  if (isBlank(name)) {
    errors.name = 'Name is required';
  }

  if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email';
  }

  if (isBlank(body)) {
    errors.body = 'Comment text is required';
  }

  return errors;
}
