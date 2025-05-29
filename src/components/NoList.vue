<script setup>
	defineOptions({
		name: 'NoList'
	})
	
	const {text} = defineProps({
		text: String
	})
</script>

<template>
	<div class="block">
		<p class="title is-4">No {{text}} yet</p>
	</div>
</template>