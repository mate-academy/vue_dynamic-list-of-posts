<script setup>
import { ref } from 'vue';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import { addComment } from '@/helpers/comments';

const emit = defineEmits(['cancel', 'onAdd']);
const props = defineProps({
    postId: Number,
})

const name = ref('');
const email = ref('');
const body = ref('');

const nameError = ref('');
const emailError = ref('');
const bodyError = ref('');

const isSubmitting = ref(false);
const formErrorMessage = ref('');

const handleFormSubmit = async () => {
    formErrorMessage.value = '';

    nameError.value = name.value.trim() ? '' : 'Name is required';
    emailError.value = email.value.trim() ? '' : 'Email is required';
    bodyError.value = body.value.trim() ? '' : 'Comment body is required';

    if (nameError.value || emailError.value || bodyError.value) {
        return;
    }

    isSubmitting.value = true;
    try {
        const newComment = {
            // postId: props.postId,
            name: name.value,
            email: email.value,
            body: body.value,
        };

        await addComment({
            ...newComment,
            postId: props.postId,
        });
        emit('onAdd', newComment);

        body.value = '';
    }
    catch (e) {
        formErrorMessage.value = e.message;
    }
    finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="content">
        <form @submit.prevent="handleFormSubmit">
            <InputField title="Author Name" name="name" placeholder="Enter your name" v-model="name"
                :errorMessage="nameError" :icon="'user'" />
            <InputField title="Author Email" name="email" placeholder="Enter your email" v-model="email"
                :errorMessage="emailError" :icon="'envelope'" />
            <TextAreaField title="Write Post Body" name="body" placeholder="Type your comment here" v-model="body"
                :errorMessage="bodyError" />

            <div class="field is-grouped">
                <div class="control">
                    <button type="submit" class="button is-link" :class="{ 'is-loading': isSubmitting }">Save</button>
                </div>
                <div class="control">
                    <button type="button" class="button is-link is-light" @click="$emit('cancel')">
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
