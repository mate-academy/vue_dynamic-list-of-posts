<script setup>
import { postsApi } from '@/api/posts';
import { inject, ref } from 'vue';

const activePost = inject('activePost');
const emit = defineEmits(['edit']);

const deletePost = async () => {
	try {

		await postsApi.deletePost(activePost.value.id);
		activePost.value = null;
		
	} catch (error) {
		console.error(error)
	}

}

</script>

<template>
	<div class="block">
		<div
			class="is-flex is-justify-content-space-between is-align-items-center"
		>
			<h2>#{{ activePost?.id }}: {{activePost?.title}}</h2>
			<div class="is-flex">
				<span @click="emit('edit')" class="icon is-small is-right is-clickable">
					<i class="fas fa-pen-to-square"></i>
				</span>
				<span
					@click="deletePost"
					class="icon is-small is-right has-text-danger is-clickable ml-3"
				>
					<i class="fas fa-trash"></i>
				</span>
			</div>
		</div>
		<p data-cy="PostBody">{{ activePost?.body }}</p>
	</div>
</template>