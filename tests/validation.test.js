import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isBlank,
  isValidEmail,
  validateComment,
  validateLogin,
  validatePost,
} from '../src/utils/validation.js';

test('isBlank treats whitespace-only values as blank', () => {
  assert.equal(isBlank('   '), true);
  assert.equal(isBlank('\n\t'), true);
  assert.equal(isBlank('post'), false);
});

test('isValidEmail rejects malformed emails', () => {
  assert.equal(isValidEmail('john@example.com'), true);
  assert.equal(isValidEmail(' john@example.com '), true);
  assert.equal(isValidEmail('john@'), false);
  assert.equal(isValidEmail('john example.com'), false);
});

test('validateLogin requires a valid email', () => {
  assert.deepEqual(
    validateLogin({ email: 'bad', name: '', registrationRequired: false }),
    { email: 'Enter a valid email' },
  );
});

test('validateLogin requires a 4 character name only during registration', () => {
  assert.deepEqual(
    validateLogin({ email: 'a@b.com', name: '', registrationRequired: false }),
    {},
  );
  assert.deepEqual(
    validateLogin({ email: 'a@b.com', name: 'Joe', registrationRequired: true }),
    { name: 'Name must contain at least 4 characters' },
  );
});

test('validatePost validates title and body independently', () => {
  assert.deepEqual(validatePost({ title: '', body: '' }), {
    title: 'Title is required',
    body: 'Post body is required',
  });
  assert.deepEqual(validatePost({ title: 'Title', body: 'Body' }), {});
});

test('validateComment requires name, valid email, and body', () => {
  assert.deepEqual(validateComment({ name: '', email: 'bad', body: '' }), {
    name: 'Name is required',
    email: 'Enter a valid email',
    body: 'Comment text is required',
  });
  assert.deepEqual(
    validateComment({ name: 'Joel', email: 'joel@example.com', body: 'Nice post' }),
    {},
  );
});
