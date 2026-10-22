import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import CommentForm from '../src/components/CommentForm.vue';
import PostDetails from '../src/components/PostDetails.vue';
import AuthForm from '../src/components/AuthForm.vue';
import { api } from '../src/api';
vi.mock('../src/api', () => ({ api: Object.fromEntries(['findUsers', 'createUser', 'getPosts', 'createPost', 'updatePost', 'deletePost', 'getComments', 'createComment', 'deleteComment'].map(key => [key, vi.fn()])) }));
const user = { id: 42, name: 'Andrew', email: 'andrew@example.com' };
const post = { id: 11, userId: 42, title: 'First post', body: 'Original body' };
const comment = { id: 31, postId: 11, name: 'Author', email: 'author@example.com', body: 'Comment text' };
const wrappers = [];
function render(component, props) { const wrapper = mount(component, { props }); wrappers.push(wrapper); return wrapper; }
function deferred() { let resolve, reject; const promise = new Promise((res, rej) => { resolve = res; reject = rej; }); return { promise, resolve, reject }; }
async function clickText(wrapper, text) { const button = wrapper.findAll('button').find(item => item.text() === text); expect(button, `Missing button ${text}`).toBeTruthy(); await button.trigger('click'); await flushPromises(); }
async function fillComment(wrapper) { await wrapper.get('#comment-name').setValue('Author'); await wrapper.get('#comment-email').setValue('author@example.com'); await wrapper.get('#comment-body').setValue('A new comment'); }
beforeEach(() => {
  vi.resetAllMocks(); localStorage.clear();
  api.getPosts.mockResolvedValue([post]); api.getComments.mockResolvedValue([]);
});
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()));
describe('Comment form', () => {
  it('validates on submit, clears individual errors on input and all errors on Clear', async () => {
    const wrapper = render(CommentForm, { postId: 11 });
    expect(wrapper.findAll('[data-cy="ErrorMessage"]')).toHaveLength(0);
    await wrapper.get('form').trigger('submit');
    expect(wrapper.findAll('[data-cy="ErrorMessage"]')).toHaveLength(3);
    await wrapper.get('#comment-name').setValue('Andrew');
    expect(wrapper.findAll('[data-cy="ErrorMessage"]')).toHaveLength(2);
    await wrapper.get('form').trigger('reset');
    expect(wrapper.findAll('[data-cy="ErrorMessage"]')).toHaveLength(0);
    expect(wrapper.get('#comment-name').element.value).toBe('');
  });
  it('preserves author, clears body, and emits the exact server response', async () => {
    const pending = deferred(); api.createComment.mockReturnValue(pending.promise);
    const wrapper = render(CommentForm, { postId: 11 }); await fillComment(wrapper);
    await wrapper.get('form').trigger('submit');
    expect(wrapper.get('[type="submit"]').classes()).toContain('is-loading');
    pending.resolve(comment); await flushPromises();
    expect(wrapper.emitted('added')[0]).toEqual([comment]);
    expect(wrapper.get('#comment-name').element.value).toBe('Author');
    expect(wrapper.get('#comment-email').element.value).toBe('author@example.com');
    expect(wrapper.get('#comment-body').element.value).toBe('');
    expect(api.createComment).toHaveBeenCalledWith({ postId: 11, name: 'Author', email: 'author@example.com', body: 'A new comment' });
  });
  it('retains all data after failure and allows retry', async () => {
    api.createComment.mockRejectedValueOnce(new Error()).mockResolvedValueOnce(comment);
    const wrapper = render(CommentForm, { postId: 11 }); await fillComment(wrapper);
    await wrapper.get('form').trigger('submit'); await flushPromises();
    expect(wrapper.get('#comment-body').element.value).toBe('A new comment');
    expect(wrapper.get('[role="alert"]').text()).toContain('try again');
    await wrapper.get('form').trigger('submit'); await flushPromises();
    expect(wrapper.emitted('added')).toHaveLength(1);
  });
});
describe('Post details', () => {
  it('loads comments with a loader and retries a failed load', async () => {
    const pending = deferred(); api.getComments.mockReturnValueOnce(pending.promise).mockResolvedValueOnce([]);
    const wrapper = render(PostDetails, { post }); await nextTick();
    expect(wrapper.find('[data-cy="Loader"]').exists()).toBe(true);
    pending.reject(new Error()); await flushPromises();
    expect(wrapper.find('[data-cy="CommentsError"]').exists()).toBe(true);
    await clickText(wrapper, 'Try again');
    expect(wrapper.find('[data-cy="NoComments"]').exists()).toBe(true);
  });
  it('hides immediately, restores on deletion failure, and retries', async () => {
    api.getComments.mockResolvedValue([comment]);
    const pending = deferred(); api.deleteComment.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(null);
    const wrapper = render(PostDetails, { post }); await flushPromises();
    await wrapper.get('[aria-label="Delete comment"]').trigger('click');
    expect(wrapper.find('[data-cy="Comment"]').exists()).toBe(false);
    pending.reject(new Error()); await flushPromises();
    expect(wrapper.get('[data-cy="Comment"]').text()).toContain('Comment text');
    await clickText(wrapper, 'Try again');
    expect(wrapper.find('[data-cy="Comment"]').exists()).toBe(false);
  });
  it('restores the original order when concurrent deletes fail in reverse order', async () => {
    const other = { ...comment, id: 32, body: 'Second comment' };
    api.getComments.mockResolvedValue([comment, other]);
    const first = deferred(), second = deferred();
    api.deleteComment.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const wrapper = render(PostDetails, { post }); await flushPromises();
    await wrapper.findAll('[aria-label="Delete comment"]')[0].trigger('click');
    await wrapper.findAll('[aria-label="Delete comment"]')[0].trigger('click');
    second.reject(new Error()); await flushPromises(); first.reject(new Error()); await flushPromises();
    expect(wrapper.findAll('.message-body').map(item => item.text())).toEqual(['Comment text', 'Second comment']);
  });
  it('keeps the form open after adding and appends the server comment', async () => {
    api.getComments.mockResolvedValue([comment]);
    api.createComment.mockResolvedValue({ ...comment, id: 99, body: 'A new comment' });
    const wrapper = render(PostDetails, { post }); await flushPromises();
    await clickText(wrapper, 'Write a comment'); await fillComment(wrapper);
    await wrapper.get('form').trigger('submit'); await flushPromises();
    expect(wrapper.findAll('.message-body').map(item => item.text())).toEqual(['Comment text', 'A new comment']);
    expect(wrapper.find('form').exists()).toBe(true);
  });
});
describe('Application', () => {
  beforeEach(() => localStorage.setItem('vue-posts-user', JSON.stringify(user)));
  it('creates, edits, and deletes a post for the selected user', async () => {
    api.getPosts.mockResolvedValue([]);
    api.createPost.mockResolvedValue(post);
    api.updatePost.mockResolvedValue({ ...post, title: 'Updated title' });
    api.deletePost.mockResolvedValue(null);
    const wrapper = render(App); await flushPromises();
    expect(api.getPosts).toHaveBeenCalledWith(42);
    expect(wrapper.text()).toContain('No posts yet');
    await clickText(wrapper, 'Create new post');
    expect(wrapper.get('.Sidebar').classes()).toContain('Sidebar--open');
    await wrapper.get('#post-title').setValue('First post'); await wrapper.get('#post-body').setValue('Original body');
    await wrapper.get('form').trigger('submit'); await flushPromises();
    expect(api.createPost).toHaveBeenCalledWith({ userId: 42, title: 'First post', body: 'Original body' });
    expect(wrapper.get('[data-cy="PostBody"]').text()).toBe('Original body');
    await clickText(wrapper, 'Edit'); await wrapper.get('#post-title').setValue('Updated title');
    await wrapper.get('form').trigger('submit'); await flushPromises();
    expect(wrapper.get('tbody').text()).toContain('Updated title');
    await clickText(wrapper, 'Delete');
    expect(wrapper.get('.Sidebar').classes()).not.toContain('Sidebar--open');
    expect(wrapper.text()).toContain('No posts yet');
  });
  it('isolates delayed comments and hides the form when another post opens', async () => {
    api.getPosts.mockResolvedValue([post, { ...post, id: 12, title: 'Another post' }]);
    const old = deferred(); api.getComments.mockReturnValueOnce(old.promise).mockResolvedValueOnce([{ ...comment, postId: 12, body: 'New post comment' }]);
    const wrapper = render(App); await flushPromises();
    await clickText(wrapper, 'Open');
    await clickText(wrapper, 'Open');
    old.resolve([comment]); await flushPromises();
    expect(wrapper.text()).toContain('New post comment');
    expect(wrapper.text()).not.toContain('Comment text');
    await clickText(wrapper, 'Write a comment');
    await clickText(wrapper, 'Open');
    expect(wrapper.find('[data-cy="NewCommentForm"]').exists()).toBe(false);
  });
  it('shows a load error with retry and ignores a late response after logout', async () => {
    api.getPosts.mockRejectedValueOnce(new Error());
    const wrapper = render(App); await flushPromises();
    expect(wrapper.find('[data-cy="PostsError"]').exists()).toBe(true);
    const pending = deferred(); api.getPosts.mockReturnValueOnce(pending.promise);
    await clickText(wrapper, 'Try again'); await clickText(wrapper, 'Logout');
    pending.resolve([post]); await flushPromises();
    expect(wrapper.find('[data-cy="PostsList"]').exists()).toBe(false);
    expect(localStorage.getItem('vue-posts-user')).toBe(null);
  });
  it('retains the post and sidebar when deletion fails', async () => {
    api.deletePost.mockRejectedValue(new Error());
    const wrapper = render(App); await flushPromises(); await clickText(wrapper, 'Open'); await clickText(wrapper, 'Delete');
    expect(wrapper.find('tbody tr').exists()).toBe(true);
    expect(wrapper.get('.Sidebar').classes()).toContain('Sidebar--open');
    expect(wrapper.get('[role="alert"]').text()).toContain('Unable to delete');
  });
});
it('logs in with an existing user and registers when none exists', async () => {
  api.findUsers.mockResolvedValueOnce([user]).mockResolvedValue([]); api.createUser.mockResolvedValue(user);
  const wrapper = render(AuthForm); await wrapper.get('#user-email').setValue(user.email);
  await wrapper.get('form').trigger('submit'); await flushPromises();
  expect(wrapper.emitted('login')[0]).toEqual([user]);
  const registration = render(AuthForm); await registration.get('#user-email').setValue(user.email);
  await registration.get('form').trigger('submit'); await flushPromises();
  await registration.get('#user-name').setValue(user.name);
  await registration.get('form').trigger('submit'); await flushPromises();
  expect(api.createUser).toHaveBeenCalledWith({ name: user.name, email: user.email });
  expect(registration.emitted('login')[0]).toEqual([user]);
});
