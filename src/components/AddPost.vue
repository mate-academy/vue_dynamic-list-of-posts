<script setup>
import { inject, ref, watch } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import { errorMessages } from 'vue/compiler-sfc';

const activePost = inject('activePost');
const title = ref(activePost.value?.title || '');
const body = ref(activePost.value?.body || '');

const titleErrorMessage = ref('');
const bodyErrorMessage = ref('');

const emit = defineEmits(['submit', 'reset', 'update'])

const cleanFields = () => {
	title.value = '';
	body.value = '';
}

watch(() => activePost.value?.id, (val) => {
	if(!val) {
		cleanFields()
	}
})


const submitData = () => {
	if( title.value.length < 6) {
		titleErrorMessage.value = 'Title must have more than 6 char'
	}
	if (body.value.length === 0) {
		bodyErrorMessage.value = 'Body cannot be empty'
	}

	if(!titleErrorMessage && !bodyErrorMessage) {
		if(activePost.value) {
			emit('update', {title: title.value, body: body.value});
		} else {
			emit('submit', {title: title.value, body: body.value});
		}
		
		cleanFields()
	}
}
const resetForm = () => {
	emit('reset');
	cleanFields()
}

</script>

<template>
	<div class="content">
		<h2>{{ activePost ? 'Edit post' : 'Create new post'}}</h2>

		<form @submit.prevent="submitData">
			<InputField 
				fieldName="title" 
				type="post" 
				v-model="title" 
				:errorMessage="titleErrorMessage"
			/>
			<TextAreaField 
				fieldName="body" 
				type="post" 
				v-model="body" 
				:errorMessage="bodyErrorMessage"
			/>

			<div class="field is-grouped">
				<div class="control">
				<button type="submit" class="button is-link">Save</button>
				</div>
				<div class="control">
				<button @click="resetForm" type="reset" class="button is-link is-light">Cancel</button>
				</div>
			</div>
		</form>
	</div>
</template>