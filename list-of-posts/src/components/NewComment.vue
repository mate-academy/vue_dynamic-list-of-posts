<script setup>
import { defineProps, defineEmits } from "vue";
const prop = defineProps(["comment", "onDelete"]);
const emit = defineEmits(["delete"]);

const deleteComment = () => {
	prop.onDelete(prop.comment.id);
};
</script>

<template>
	<article className="message is-small mt-4">
		<div className="message-header">
			<a href="{`mailto:${email}`}"> {{ comment.email }} </a>
			<button @click="deleteComment" type="button" className="delete is-small" aria-label="delete"></button>
		</div>
		<div className="message-body">{{ comment.body }}</div>
	</article>
</template>
