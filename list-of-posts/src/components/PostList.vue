<script setup>
import * as apiPost from "@/api/posts";
import Loader from "./Loader.vue";
import { ref, onBeforeMount, computed, watch } from "vue";
import * as local from "@/utils/user";
import Sidebar from "./Sidebar.vue";
import PostPreview from "./PostPreview.vue";
import AddPost from "./addPost.vue";

const posts = ref([]);
const errorMessage = ref(null);
const isLoading = ref(false);
const userId = local.getUserId();
const selectedPost = ref(null);
const isAddingNewPost = ref(false);
const isEditing = ref(false);

const isSidebarOpen = computed(() => selectedPost.value !== null || isAddingNewPost.value);

watch(
	() => selectedPost.value,
	(newPost, oldPost) => {
		if (oldPost && !newPost && !isAddingNewPost.value) {
			isEditing.value = false;
		} else if (oldPost && newPost && newPost.id !== oldPost.id) {
			isEditing.value = false;
		}
	},
	{ immediate: true }
);

watch(
	() => isAddingNewPost.value,
	(newPost, oldPost) => {
		if (isEditing && isAddingNewPost) {
			isEditing.value = false;
		}
	},
	{ immediate: true }
);

onBeforeMount(async () => {
	try {
		isLoading.value = true;
		posts.value = await apiPost.getPosts(userId);
	} catch (error) {
		errorMessage.value = "Failed to load posts";
	} finally {
		isLoading.value = false;
	}
});

const handleOpeningPost = (post) => {
	if (isAddingNewPost.value) isAddingNewPost.value = false;

	selectedPost.value = selectedPost.value?.id === post.id ? null : post;
};

const toggleAddNewPost = () => {
	selectedPost.value = null;
	isAddingNewPost.value = !isAddingNewPost.value;
};

const handlePostDelete = (postId) => {
	posts.value = posts.value.filter((post) => post.id !== postId);
	if (selectedPost.value?.id === postId) {
		selectedPost.value = null;
	}
};

const handlePostEdit = () => {
	isEditing.value = true;
};

const addNewPost = async (postId, inputValue, textAreaValue, edit) => {
	if (edit !== null) {
		const editedPost = {
			title: inputValue,
			body: textAreaValue,
		};

		const newEditedPost = await apiPost.editPost(postId, editedPost);
		const index = posts.value.findIndex((post) => post.id === postId);
		if (index !== -1) {
			posts.value[index] = { ...posts.value[index], ...newEditedPost };
		}

		// Optionally, update the selected post
		selectedPost.value = posts.value[index];
		isEditing.value = false;
	} else {
		try {
			const newPost = {
				userId: userId,
				title: inputValue,
				body: textAreaValue,
			};
			const newAddedPost = await apiPost.addPost(newPost);
			posts.value = [...posts.value, newAddedPost];
			selectedPost.value = newAddedPost;
			isAddingNewPost.value = false;
		} catch (error) {
			alert("An error occurred while creating the post. Please try again.");
		}
	}
};

const closeForm = () => {
	isAddingNewPost.value = false;
	isEditing.value = false;
};
</script>

<template>
	<div class="tile is-parent">
		<div class="tile is-child box is-success">
			<div class="block">
				<!-- Header -->
				<div class="block is-flex is-justify-content-space-between">
					<p class="title">Posts</p>
					<button
						@click="toggleAddNewPost"
						type="button"
						class="button"
						:class="{ 'is-link': !isAddingNewPost }"
					>
						Add New Post
					</button>
				</div>

				<!-- Error Message -->
				<div v-if="errorMessage" class="notification is-danger has-text-centered">
					{{ errorMessage }}
				</div>

				<!-- No Posts Message -->
				<div v-if="!isLoading && posts.length === 0 && !errorMessage" class="has-text-centered">
					<p>No posts yet</p>
				</div>

				<!-- Loading Indicator -->
				<div v-else-if="isLoading" class="has-text-centered">
					<Loader />
				</div>

				<!-- Posts Table -->
				<table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
					<thead>
						<tr class="has-background-link-light">
							<th>ID</th>
							<th>Title</th>
							<th class="has-text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="post in posts" :key="post.id">
							<td>{{ post.id }}</td>
							<td>{{ post.title }}</td>
							<td class="has-text-right">
								<button
									@click="handleOpeningPost(post)"
									type="button"
									class="button"
									:class="{ 'is-link': selectedPost?.id !== post.id }"
								>
									{{ selectedPost?.id === post.id ? "Close" : "Open" }}
								</button>
							</td>
						</tr>
					</tbody>
				</table>

				<!-- Sidebar -->
				<TransitionGroup name="sidebar">
					<Sidebar :isOpen="isSidebarOpen" v-if="isSidebarOpen">
						<PostPreview
							v-if="selectedPost && !isAddingNewPost && !isEditing"
							:post="selectedPost"
							:onDelete="handlePostDelete"
							:onEdit="handlePostEdit"
						/>
						<AddPost v-else :post="selectedPost" @create="addNewPost" @close="closeForm" />
					</Sidebar>
				</TransitionGroup>
			</div>
		</div>
	</div>
</template>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
	transition: all 0.5s;
}
.sidebar-enter-from,
.sidebar-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>
