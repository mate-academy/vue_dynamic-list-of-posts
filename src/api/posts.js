import { client } from './../assets/http'

const userId = 1871
const getPosts = async () => {
	const posts = await client.get(`/posts?userId=${userId}`)

	return posts;
}

const createPost = async (data) => {
	const post = await client.post('/posts', {
		...data,
		userId
	});

	return post;
}

const updatePost = async (data, postId) => {
	const post = await client.patch(`/posts/${postId}`, data);

	return post;
}

const deletePost = async (postId) => {
	await client.delete(`/posts/${postId}`)
}
export const postsApi = {
	getPosts,
	createPost,
	updatePost, 
	deletePost
}