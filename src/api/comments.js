import { client } from './../assets/http'

const getComments = async (postId) => {
	const comments = await client.get(`/comments?postId=${postId}`)

	return comments;
}

const createComment = async (data) => {
	const comment = await client.post('/comments', data);

	return comment;
}

const updateComment = async (data, commentId) => {
	const comment = await client.patch(`/comments/${commentId}`, data);

	return comment;
}

const deleteComment = async (commentId) => {
	await client.delete(`/comments/${commentId}`)
}

export const commentsApi = {
	getComments,
	createComment,
	updateComment, 
	deleteComment
}