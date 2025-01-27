import { client } from "@/utils/fetchClient";

export const getPosts = async (userId) => {
	const response = await client.get("/posts", {
		params: {
			userId,
		},
	});

	return response.data;
};

export const addPost = async (post) => {
	const response = await client.post("/posts", {
		...post,
	});

	return response.data;
};

export const editPost = async (postId, post) => {
	const response = await client.patch(`/posts/${postId}`, {
		...post,
	});

	return response.data;
};

export const deletePost = async (postId) => {
	const response = await client.delete(`/posts/${postId}`);

	return response.data;
};
