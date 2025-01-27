<script setup>
import { defineProps, ref, watch } from "vue";
import * as apiComments from "@/api/comments";
import * as apiPost from "@/api/posts";

import NewComment from "./NewComment.vue";
import AddNewComment from "./AddNewComment.vue";
import NoCommentsYet from "./NoCommentsYet.vue";
import Loader from "./Loader.vue";

const comments = ref([]);
const isLoading = ref(false);
const showCommentForm = ref(false); // State to toggle AddNewComment

const props = defineProps({
	post: {
		type: Object,
		required: true,
	},
	onDelete: {
		type: Function,
		required: true,
	},
	onEdit: {
		type: Function,
		required: true,
	},
});

const deletePost = async () => {
	try {
		await apiPost.deletePost(props.post.id);
		props.onDelete(props.post.id);
	} catch (err) {
		console.error("Error deleting post:", err);
	}
};

const editPost = async () => {
	try {
		props.onEdit(props.post.id, {
			title: props.post.title,
			body: props.post.body,
		});
	} catch (err) {
		console.error("Error editing post:", err);
	}
};

const fetchComments = async () => {
	try {
		isLoading.value = true;
		comments.value = await apiComments.getComments(props.post.id);
	} catch (err) {
		console.error("Error fetching comments:", err);
	} finally {
		isLoading.value = false;
	}
};

watch(() => props.post, fetchComments);

fetchComments();

const deleteComment = async (id) => {
	try {
		await apiComments.deleteComment(id);
		comments.value = comments.value.filter((comment) => comment.id !== id);
	} catch (err) {
		console.error("Error deleting comment:", err);
	}
};

const openCommentForm = () => {
	showCommentForm.value = true;
};

const closeCommentForm = () => {
	showCommentForm.value = false;
};

const addComment = async (authorName, authorEmail, textAreaValue) => {
	try {
		const createdComment = await apiComments.addComment({
			postId: props.post.id,
			name: authorName,
			email: authorEmail,
			body: textAreaValue,
		});
		comments.value.push(createdComment);
		closeCommentForm();
	} catch (err) {
		console.error("Error adding comment:", err);
	}
};
</script>

<template>
	<div class="block">
		<div class="is-flex is-justify-content-space-between is-align-items-center">
			<h2>#{{ props.post.id }}: {{ props.post.title }}</h2>
			<div class="is-flex">
				<span @click="editPost" class="icon is-small is-right is-clickable">
					<i class="fas fa-pen-to-square"></i>
				</span>
				<span @click="deletePost" class="icon is-small is-right has-text-danger is-clickable ml-3">
					<i class="fas fa-trash"></i>
				</span>
			</div>
		</div>
		<p data-cy="PostBody">{{ props.post.body }}</p>

		<Loader v-if="isLoading" />

		<template v-else>
			<template v-if="comments.length && !showCommentForm">
				<div v-for="comment in comments" :key="comment.id" class="comment">
					<NewComment :onDelete="deleteComment" v-if="comment.postId === props.post.id" :comment="comment" />
				</div>
			</template>
			<template v-else-if="!showCommentForm">
				<NoCommentsYet />
			</template>
		</template>

		<AddNewComment v-if="showCommentForm" :onClose="closeCommentForm" @create="addComment" />

		<button v-if="!showCommentForm" @click="openCommentForm" type="button" class="button is-link mt-4">
			Write a comment
		</button>
	</div>
</template>
