<script setup>
import { inject, ref, watch } from 'vue';
import NoList from './NoList.vue';
import Comment from './Comment.vue'
import CommentButton from './CommentButton.vue';
import AddComment from './AddComment.vue';
import { commentsApi } from '@/api/comments';

const activePost = inject('activePost');
const comments = ref([]);
const isEditComment = ref(false);
const {isEditPost} = defineProps({
	isEditPost: Boolean
})

const loadComments = async () => {
	try {
		const {data} = await commentsApi.getComments(activePost.value.id);
	
		comments.value = data;
	} catch (error) {
		console.error(error)
	}
}

watch(() => activePost.value?.id, (val) => {
	if(val) {
		loadComments()
	}
})

const submitForm = async (formData) => {
	try {
			await commentsApi.createComment({
		...formData,
		postId: activePost.value.id
	})

	await loadComments();
	} catch (error) {
		console.error(error)
	}

}

const removeComment = async (commentId) => {
	try {
		await commentsApi.deleteComment(commentId);
		await loadComments();
	} catch (error) {
		console.error(error)
	}
}

const reset = () => {
	isEditComment.value = false;
}
</script>

<template>
	<div class="column is-half is-8-desktop Sidebar">
		<div class="box is-success ">
			<div class="content">
				<slot></slot>
				
				<template v-if="!isEditPost && activePost">
					<NoList text="comment" v-if="comments.length === 0"/>
					<Comment 
						v-for="comment of comments" 
						:key="comment.id" 
						:comment="comment"
						@remove="removeComment"
					/>
					<CommentButton v-if="!isEditComment" v-model="isEditComment"/>
					<AddComment v-else @submit="submitForm" @reset="reset"/>
				</template>
			</div>
		</div>
	</div>
</template>

<style>
.Sidebar {
	overflow: hidden;
	opacity: 0;
	transition-property: max-width, opacity;
	transition-duration: 0.5s;
	transition-timing-function: ease-in-out;

	@media (min-width: 769px) {
		max-width: 0;
	}
}

.Sidebar--open {
	opacity: 1;

	@media (min-width: 769px) {
		max-width: 50%;
	}
}
</style>