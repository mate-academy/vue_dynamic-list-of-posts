import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from './App.vue';
import CommentForm from './components/CommentForm.vue';

const post = { id: 10, userId: 4506, title: 'First post', body: 'First body' };
const second = { ...post, id: 20, title: 'Second post' };
const comment = { id: 30, postId: 10, name: 'Author', email: 'author@example.com', body: 'Hello' };
let wrapper;
let handler;
const response = data => ({ ok: true, status: 200, json: async () => data });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const button = text => wrapper.findAll('button').find(item => item.text() === text);

beforeEach(() => {
  handler = (url) => {
    if (url.includes('/users/')) return response({ id: 4506, name: 'Andrzej' });
    if (url.includes('/posts?')) return response([post, second]);
    if (url.includes('/comments?')) return response([comment]);
    throw new Error(`Unexpected request ${url}`);
  };
  vi.stubGlobal('fetch', vi.fn((url, options) => handler(url, options)));
});
afterEach(() => { wrapper?.unmount(); vi.unstubAllGlobals(); });

async function start() { wrapper = mount(App); await flushPromises(); }
async function fillComment() {
  await wrapper.get('#comment-name').setValue('Author');
  await wrapper.get('#comment-email').setValue('author@example.com');
  await wrapper.get('#comment-body').setValue('New comment');
}

describe('Posts and comments', () => {
  it('loads only user 4506 posts and offers retry after loading failure', async () => {
    handler = url => url.includes('/users/') ? response({ name: 'Andrzej' }) : Promise.reject(new Error());
    await start();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/posts?userId=4506'), expect.anything());
    expect(wrapper.get('[data-cy="PostsError"]').text()).toContain('Retry');
    handler = () => response([]);
    await button('Retry').trigger('click'); await flushPromises();
    expect(wrapper.get('[data-cy="NoPosts"]').text()).toBe('No posts yet');
  });

  it('validates, creates, edits and deletes a post through API responses', async () => {
    await start();
    const original = handler;
    handler = (url, options) => {
      if (options.method === 'POST') return response({ ...JSON.parse(options.body), id: 99 });
      if (options.method === 'PATCH') return response({ ...JSON.parse(options.body), id: 99 });
      if (options.method === 'DELETE') return response(null);
      return original(url, options);
    };
    await button('Create new post').trigger('click');
    await wrapper.get('[data-cy="PostForm"]').trigger('submit');
    expect(wrapper.findAll('[data-cy="ErrorMessage"]')).toHaveLength(2);
    await wrapper.get('#post-title').setValue(' New title ');
    await wrapper.get('#post-body').setValue(' New body ');
    await wrapper.get('[data-cy="PostForm"]').trigger('submit'); await flushPromises();
    expect(wrapper.get('[data-cy="PostPreview"]').text()).toContain('New title');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/posts'), expect.objectContaining({ method: 'POST', body: JSON.stringify({ title: 'New title', body: 'New body', userId: 4506 }) }));
    await button('Edit').trigger('click');
    await wrapper.get('#post-title').setValue('Edited title');
    await wrapper.get('[data-cy="PostForm"]').trigger('submit'); await flushPromises();
    expect(wrapper.get('[data-cy="PostPreview"]').text()).toContain('Edited title');
    await button('Delete').trigger('click'); await flushPromises();
    expect(wrapper.get('.Sidebar').classes()).not.toContain('Sidebar--open');
    expect(wrapper.text()).not.toContain('Edited title');
  });

  it('ignores comments arriving for a previously opened post', async () => {
    const slow = deferred();
    const original = handler;
    handler = (url, options) => url.includes('postId=10') ? slow.promise : url.includes('postId=20') ? response([]) : original(url, options);
    await start();
    await wrapper.findAll('tbody button')[0].trigger('click');
    expect(wrapper.find('[data-cy="Loader"]').exists()).toBe(true);
    await wrapper.findAll('tbody button')[1].trigger('click'); await flushPromises();
    slow.resolve(response([comment])); await flushPromises();
    expect(wrapper.get('[data-cy="NoComments"]').text()).toBe('No comments yet');
    expect(wrapper.find('[data-cy="Comment"]').exists()).toBe(false);
  });

  it('removes a comment immediately, restores it on failure, and retries', async () => {
    await start(); await button('Open').trigger('click'); await flushPromises();
    const slow = deferred();
    handler = () => slow.promise;
    await wrapper.get('[data-cy="Comment"] button').trigger('click');
    expect(wrapper.find('[data-cy="Comment"]').exists()).toBe(false);
    slow.resolve({ ok: false, status: 500 }); await flushPromises();
    expect(wrapper.get('[data-cy="Comment"]').text()).toContain('Unable to delete');
    handler = () => response(null);
    await button('Retry').trigger('click'); await flushPromises();
    expect(wrapper.find('[data-cy="Comment"]').exists()).toBe(false);
  });

  it('shows comment loading errors and successfully retries', async () => {
    const original = handler;
    handler = (url, options) => url.includes('/comments?') ? Promise.reject(new Error()) : original(url, options);
    await start(); await button('Open').trigger('click'); await flushPromises();
    expect(wrapper.get('[data-cy="CommentsError"]').text()).toContain('Unable to load comments');
    handler = () => response([comment]);
    await button('Retry').trigger('click'); await flushPromises();
    expect(wrapper.get('[data-cy="Comment"]').text()).toContain('Hello');
  });

  it('keeps the post and sidebar available when deletion fails', async () => {
    await start(); await button('Open').trigger('click'); await flushPromises();
    handler = () => Promise.reject(new Error());
    await button('Delete').trigger('click'); await flushPromises();
    expect(wrapper.text()).toContain('Unable to delete the post');
    expect(wrapper.get('.Sidebar').classes()).toContain('Sidebar--open');
    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
    handler = () => response(null);
    await button('Delete').trigger('click'); await flushPromises();
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
  });

  it('keeps comment identity, clears body, and preserves the form during post editing', async () => {
    await start(); await button('Open').trigger('click'); await flushPromises();
    await button('Write a comment').trigger('click'); await fillComment();
    handler = () => response({ ...comment, id: 31, body: 'New comment' });
    await wrapper.get('[data-cy="NewCommentForm"]').trigger('submit'); await flushPromises();
    expect(wrapper.get('#comment-name').element.value).toBe('Author');
    expect(wrapper.get('#comment-email').element.value).toBe('author@example.com');
    expect(wrapper.get('#comment-body').element.value).toBe('');
    expect(wrapper.findAll('[data-cy="Comment"]')).toHaveLength(2);
    await button('Edit').trigger('click'); await button('Cancel').trigger('click');
    expect(wrapper.get('#comment-name').element.value).toBe('Author');
  });

  it('validates only on submit, clears individual errors and all fields on Clear', async () => {
    wrapper = mount(CommentForm, { props: { postId: 10 } });
    expect(wrapper.findAll('[data-cy="ErrorMessage"]')).toHaveLength(0);
    await wrapper.get('form').trigger('submit');
    expect(wrapper.findAll('[data-cy="ErrorMessage"]')).toHaveLength(3);
    await wrapper.get('#comment-name').setValue('Author');
    expect(wrapper.findAll('[data-cy="ErrorMessage"]')).toHaveLength(2);
    await button('Clear').trigger('click');
    expect(wrapper.findAll('[data-cy="ErrorMessage"]')).toHaveLength(0);
    expect(wrapper.get('#comment-name').element.value).toBe('');
  });

  it('retains comment text on API failure and submits it again successfully', async () => {
    wrapper = mount(CommentForm, { props: { postId: 10 } }); await fillComment();
    const slow = deferred(); handler = () => slow.promise;
    await wrapper.get('form').trigger('submit');
    expect(button('Add comment').classes()).toContain('is-loading');
    slow.resolve({ ok: false, status: 500 }); await flushPromises();
    expect(wrapper.get('#comment-body').element.value).toBe('New comment');
    expect(wrapper.text()).toContain('Unable to add');
    handler = () => response(comment);
    await wrapper.get('form').trigger('submit'); await flushPromises();
    expect(wrapper.emitted('added')[0]).toEqual([comment]);
    expect(wrapper.get('#comment-body').element.value).toBe('');
  });
});
