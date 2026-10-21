<script setup>
import { usePostStore } from '@/store/postStore';

const text = defineModel();
const isError = defineModel('isError');

const global = usePostStore();


</script>
<template>
  <div class="field" data-cy="BodyField">
  <label class="label" :for="`comment-body`"> {{ global.state.isEditing ? "Write Post Body" : "Title" }}</label>
  <div class="control">
    <textarea
      id="comment-body"
      name="name"
      placeholder="message body"
      class="textarea "
      :class="{'is-danger': isError && text.length === 0}"
      v-model="text"
      @input="isError = false"
      
    ></textarea>
  </div>

  <p class="help is-danger" data-cy="ErrorMessage">{{(isError && text.length === 0) ? "É necessário ter um copo" : ""}}</p>
</div>

</template>