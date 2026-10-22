import { afterEach, expect, it, vi } from 'vitest';
import { api, request } from '../src/api';
afterEach(() => vi.unstubAllGlobals());
it('encodes email filters and sends JSON with PATCH', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '{"id":11}' });
  vi.stubGlobal('fetch', fetchMock);
  await api.findUsers('a+b@example.com');
  expect(fetchMock.mock.calls[0][0]).toBe('https://mate.academy/students-api/users?email=a%2Bb%40example.com');
  await api.updatePost(11, { title: 'Changed' });
  expect(fetchMock.mock.calls[1][1]).toMatchObject({ method: 'PATCH', body: '{"title":"Changed"}', headers: { 'Content-Type': 'application/json' } });
});
it('handles an empty DELETE response', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204 }));
  expect(await api.deleteComment(31)).toBe(null);
});
it('rejects HTTP errors', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
  await expect(request('/posts')).rejects.toThrow('500');
});
