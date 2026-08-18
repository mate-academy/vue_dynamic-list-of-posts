import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('API modules use the documented Mate endpoints and CRUD methods', () => {
  const users = read('src/api/users.js');
  const posts = read('src/api/posts.js');
  const comments = read('src/api/comments.js');

  assert.match(users, /\/users\?/);
  assert.match(users, /method: 'POST'/);
  assert.match(posts, /\/posts\?/);
  assert.match(posts, /method: 'POST'/);
  assert.match(posts, /method: 'PATCH'/);
  assert.match(posts, /method: 'DELETE'/);
  assert.match(comments, /\/comments\?/);
  assert.match(comments, /method: 'POST'/);
  assert.match(comments, /method: 'DELETE'/);
});


test('JSON mutation requests declare the required UTF-8 content type', () => {
  const users = read('src/api/users.js');
  const posts = read('src/api/posts.js');
  const comments = read('src/api/comments.js');
  const expectedHeader = /'Content-Type': 'application\/json; charset=utf-8'/g;

  assert.equal((users.match(expectedHeader) || []).length, 1);
  assert.equal((posts.match(expectedHeader) || []).length, 2);
  assert.equal((comments.match(expectedHeader) || []).length, 1);
});

test('comment retry handler is passed without eager invocation', () => {
  const app = read('src/App.vue');

  assert.match(app, /@retry-comments="loadComments"/);
  assert.doesNotMatch(app, /@retry-comments="loadComments\(\)"/);
});

test('test-facing data-cy contracts are present', () => {
  const source = [
    read('src/App.vue'),
    read('src/components/PostsList.vue'),
    read('src/components/PostPreview.vue'),
    read('src/components/CommentItem.vue'),
    read('src/components/NewCommentForm.vue'),
    read('src/components/Sidebar.vue'),
  ].join('\n');

  const required = [
    'MainContent',
    'Sidebar',
    'PostsList',
    'Post',
    'PostId',
    'PostButton',
    'PostDetails',
    'PostTitle',
    'PostBody',
    'CommentsError',
    'NoCommentsMessage',
    'Comment',
    'CommentAuthor',
    'CommentBody',
    'WriteCommentButton',
    'NewCommentForm',
    'NameField',
    'EmailField',
    'BodyField',
  ];

  for (const contract of required) {
    assert.match(source, new RegExp(`data-cy=\\"${contract}\\"`));
  }
});

test('sidebar has the required open modifier class', () => {
  const sidebar = read('src/components/Sidebar.vue');
  const styles = read('src/styles.css');

  assert.match(sidebar, /Sidebar--open/);
  assert.match(styles, /\.Sidebar--open/);
});
