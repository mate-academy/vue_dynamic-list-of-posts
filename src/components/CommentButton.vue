<script setup>
	const {modelValue} = defineProps({
		modelValue: Boolean
	})

	const emit = defineEmits(['update:modelValue'])
</script>

<template>
	<button 
		type="button" 
		class="button is-link"
		@click="emit('update:modelValue',true)"
	>
		Write a comment
	</button>
</template>

