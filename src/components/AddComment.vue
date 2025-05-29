<script setup>
import { ref } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';

const name = ref('');
const email = ref('');
const body = ref('');
const emit = defineEmits(['submit', 'reset'])
const errorMessages = ref({
	email: '',
	name: '',
	body: ''
})

const isValidEmail = (email) => {
	const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return re.test(email);
};

const cleanFields = () => {
	name.value = '';
	body.value = '';
	email.value = '';
}

const submitData = () => {
	if( name.value.length < 6) {
		errorMessages.value.name = 'Title must have more than 6 char'
		errorMessages.value.hasError = true;
	}
	if (!isValidEmail(email.value)) {
		errorMessages.value.email = 'Email doesn\'t valid';
		errorMessages.value.hasError = true;
	}
	if (body.value.length === 0) {
		errorMessages.value.body = 'Body cannot be empty';
		errorMessages.value.hasError = true;
	}

	if(!errorMessages.value.name 
	&& !errorMessages.value.body &&
		!errorMessages.value.email
	) {
		emit('submit', {name: name.value, email: email.value, body: body.value});
		cleanFields()
	}
}

const resetForm = () => {
	emit('reset')
	cleanFields()
}

</script>

<template>
	<form @submit.prevent="submitData">
		<InputField 
			fieldName="name" 
			type="comment" 
			v-model="name" 
			:errorMessage="errorMessages.name"
		/>
		<InputField 
			fieldName="email" 
			type="comment" 
			v-model="email" 
			:errorMessage="errorMessages.email"
		/>
		<TextAreaField 
			fieldName="body" 
			type="comment" 
			v-model="body" 
			:errorMessage="errorMessages.body"
		/>

		<div class="field is-grouped">
			<div class="control">
			<button type="submit" class="button is-link">Add comment</button>
			</div>
			<div class="control">
			<button @click="resetForm" type="reset" class="button is-link is-light">Cancel</button>
			</div>
		</div>
	</form>
</template>