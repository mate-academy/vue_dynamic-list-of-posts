<script setup>
import { reactive, ref } from 'vue';
import { api } from '../api';
const props = defineProps({ postId: { type: Number, required: true } });
const emit = defineEmits(['added']);
const form = reactive({ name: '', email: '', body: '' });
const errors = reactive({ name: '', email: '', body: '' });
const busy = ref(false);
const serverError = ref('');
function clear() {
  if (busy.value) return;
  for (const key of Object.keys(form)) { form[key] = ''; errors[key] = ''; }
  serverError.value = '';
}
async function submit() {
  if (busy.value) return;
  errors.name = form.name.trim() ? '' : 'Name is required';
  errors.email = !form.email.trim() ? 'Email is required'
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : 'Enter a valid email';
  errors.body = form.body.trim() ? '' : 'Comment is required';
  serverError.value = '';
  if (Object.values(errors).some(Boolean)) return;
  busy.value = true;
  try {
    const comment = await api.createComment({ postId: props.postId, name: form.name.trim(), email: form.email.trim(), body: form.body.trim() });
    emit('added', comment);
    form.body = '';
  } catch { serverError.value = 'Unable to add a comment. Please try again.'; }
  finally { busy.value = false; }
}
</script>
<template>
  <form novalidate data-cy="NewCommentForm" @submit.prevent="submit" @reset.prevent="clear">
    <fieldset :disabled="busy">
      <div v-for="field in ['name', 'email']" :key="field" class="field" :data-cy="field === 'name' ? 'NameField' : 'EmailField'">
        <label class="label" :for="`comment-${field}`">{{ field === 'name' ? 'Author name' : 'Author email' }}</label>
        <div class="control has-icons-left has-icons-right">
          <input :id="`comment-${field}`" v-model="form[field]" :name="field" :type="field === 'email' ? 'email' : 'text'" class="input" :class="{ 'is-danger': errors[field] }" :aria-invalid="!!errors[field]" :placeholder="field === 'name' ? 'Your name' : 'Your email'" @input="errors[field] = ''">
          <span class="icon is-small is-left"><i :class="field === 'name' ? 'fas fa-user' : 'fas fa-envelope'"></i></span>
          <span v-if="errors[field]" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon"><i class="fas fa-exclamation-triangle"></i></span>
        </div>
        <p v-if="errors[field]" class="help is-danger" data-cy="ErrorMessage">{{ errors[field] }}</p>
      </div>
      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body">Comment</label>
        <textarea id="comment-body" v-model="form.body" name="body" class="textarea" :class="{ 'is-danger': errors.body }" :aria-invalid="!!errors.body" placeholder="Write a comment" @input="errors.body = ''"></textarea>
        <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">{{ errors.body }}</p>
      </div>
      <p v-if="serverError" class="notification is-danger" role="alert">{{ serverError }}</p>
      <div class="field is-grouped">
        <div class="control"><button type="submit" class="button is-link" :class="{ 'is-loading': busy }">{{ serverError ? 'Try again' : 'Add' }}</button></div>
        <div class="control"><button type="reset" class="button is-link is-light">Clear</button></div>
      </div>
    </fieldset>
  </form>
</template>
