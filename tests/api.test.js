import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiError, API_BASE_URL, request } from '../src/api/client.js';
import { createComment, deleteComment, getCommentsByPostId } from '../src/api/comments.js';
import { createPost, deletePost, getPostsByUserId, updatePost } from '../src/api/posts.js';
import { createUser, getUserByEmail } from '../src/api/users.js';

function jsonResponse(data, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    headers: {
      get(name) {
        return name.toLowerCase() === 'content-type' ? 'application/json; charset=utf-8' : null;
      },
    },
    async json() {
      return data;
    },
    async text() {
      return JSON.stringify(data);
    },
  };
}

function emptyResponse({ ok = true, status = 204 } = {}) {
  return {
    ok,
    status,
    headers: { get: () => '' },
    async json() {
      return null;
    },
    async text() {
      return '';
    },
  };
}

test('API_BASE_URL defaults to the documented Mate API', () => {
  assert.equal(API_BASE_URL, 'https://mate.academy/students-api');
});

test('post API uses the expected URLs, methods, and JSON payloads', async () => {
  const calls = [];
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });

    if (options.method === 'DELETE') {
      return emptyResponse();
    }

    return jsonResponse(options.body ? JSON.parse(options.body) : []);
  };

  try {
    await getPostsByUserId(7);
    await createPost({ title: 'A', body: 'B', userId: 7 });
    await updatePost(31, { title: 'Edited', body: 'Body' });
    await deletePost(31);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(calls[0].url, `${API_BASE_URL}/posts?userId=7`);
  assert.equal(calls[0].options.method, undefined);

  assert.equal(calls[1].url, `${API_BASE_URL}/posts`);
  assert.equal(calls[1].options.method, 'POST');
  assert.deepEqual(JSON.parse(calls[1].options.body), { title: 'A', body: 'B', userId: 7 });
  assert.equal(calls[1].options.headers['Content-Type'], 'application/json; charset=utf-8');

  assert.equal(calls[2].url, `${API_BASE_URL}/posts/31`);
  assert.equal(calls[2].options.method, 'PATCH');
  assert.equal(calls[2].options.headers['Content-Type'], 'application/json; charset=utf-8');
  assert.deepEqual(JSON.parse(calls[2].options.body), { title: 'Edited', body: 'Body' });

  assert.equal(calls[3].url, `${API_BASE_URL}/posts/31`);
  assert.equal(calls[3].options.method, 'DELETE');
});

test('user API filters by encoded email and creates users with POST', async () => {
  const calls = [];
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });

    if (url.includes('/users?')) {
      return jsonResponse([{ id: 4, name: 'Joel', email: 'joel+test@example.com' }]);
    }

    return jsonResponse({ id: 5, ...JSON.parse(options.body) }, { status: 201 });
  };

  try {
    const existing = await getUserByEmail('joel+test@example.com');
    const created = await createUser({ name: 'New User', email: 'new@example.com' });

    assert.equal(existing.id, 4);
    assert.equal(created.id, 5);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(calls[0].url, `${API_BASE_URL}/users?email=joel%2Btest%40example.com`);
  assert.equal(calls[1].options.method, 'POST');
  assert.equal(calls[1].options.headers['Content-Type'], 'application/json; charset=utf-8');
});

test('comment API filters by post, appends via POST, and deletes by id', async () => {
  const calls = [];
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });

    if (options.method === 'DELETE') {
      return emptyResponse();
    }

    return jsonResponse(options.body ? { id: 99, ...JSON.parse(options.body) } : []);
  };

  try {
    await getCommentsByPostId(12);
    const created = await createComment({ postId: 12, name: 'A', email: 'a@b.com', body: 'Hi' });
    await deleteComment(created.id);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(calls[0].url, `${API_BASE_URL}/comments?postId=12`);
  assert.equal(calls[1].options.method, 'POST');
  assert.equal(calls[1].options.headers['Content-Type'], 'application/json; charset=utf-8');
  assert.equal(calls[2].url, `${API_BASE_URL}/comments/99`);
  assert.equal(calls[2].options.method, 'DELETE');
});

test('request throws ApiError with server message and status', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => jsonResponse({ error: 'Server rejected request' }, { ok: false, status: 422 });

  try {
    await assert.rejects(
      request('/posts'),
      error => error instanceof ApiError && error.status === 422 && error.message === 'Server rejected request',
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
