<script setup>
import { inject } from 'vue';

	const {posts} = defineProps({
		posts: Array,
	})

	const activePost = inject('activePost');

</script>

<template>
	<table class="table is-fullwidth is-striped is-hoverable is-narrow">
		<thead>
		<tr class="has-background-link-light">
			<th>ID</th>
			<th>Title</th>
			<th class="has-text-right">Actions</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="post of posts" :key="post.id">
			<td>{{ post.id }}</td>
			<td>{{ post.title }}</td>
			<td class="has-text-right is-vcentered">
				<button 
					type="button" 
					class="button is-link"
					:class="{'is-light': activePost?.id === post.id}"
					@click="activePost = post"
				>
					{{ activePost?.id === post.id ? 'Close' : 'Open' }}
				</button>
			</td>
		</tr>
		</tbody>
	</table>
</template>