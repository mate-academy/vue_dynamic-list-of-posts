<script setup>
import TextAreaField from "./TextAreaField.vue";
import Input from "./Input.vue";
import { reactive } from "vue";
import { BODY_ERROR, CREATION_BODY_PLACEHOLDER, CREATION_TITLE_PLACEHOLDER, TITLE_ERROR } from "@/const";

const props = defineProps({
  title: String,
  buttonText: String,
  selectedPost: Object,
});

const emit = defineEmits(["postAction", "close"]);

const formData = reactive({
  title: props.selectedPost?.title || "",
  body: props.selectedPost?.body || "",
  titleError: "",
  bodyError: "",
});

const formAction = () => {
  const { title, body } = formData;
  if (!title) {
    formData.titleError = TITLE_ERROR;
  } else if (!body) {
    formData.bodyError = BODY_ERROR;
  } else {
    emit("postAction", formData);
  }
};
</script>

<template>
  <div class="content">
    <h2>{{ title }}</h2>

    <form @reset="emit('close')" @submit.prevent="formAction($event)">
      <Input
        :placeholder="CREATION_TITLE_PLACEHOLDER"
        :error="formData.titleError"
        label="Title"
        name="title"
        v-model="formData.title"
      />

      <TextAreaField
        :placeholder="CREATION_BODY_PLACEHOLDER"
        label="Write Post Body"
        name="body"
        :error="formData.bodyError"
        v-model="formData.body"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">
            {{ buttonText }}
          </button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>
