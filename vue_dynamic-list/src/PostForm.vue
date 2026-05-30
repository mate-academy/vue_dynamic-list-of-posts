<template>
  <form @submit.prevent="handleSubmit">
    <h2 class="title is-4">
      {{ initialData ? "Edit post" : "Create new post" }}
    </h2>

    <div class="field" data-cy="NameField">
      <label class="label" for="post-title">Title</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="form.title"
          type="text"
          id="post-title"
          placeholder="Post title"
          class="input"
          :class="{ 'is-danger': errors.title }"
          @input="errors.title = ''"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span v-if="errors.title" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.title" class="help is-danger" data-cy="ErrorMessage">
        {{ errors.title }}
      </p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="post-body">Write Post Body</label>
      <div class="control">
        <textarea
          v-model="form.body"
          id="post-body"
          placeholder="Post body"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          @input="errors.body = ''"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">
        {{ errors.body }}
      </p>
    </div>

    <div class="field is-grouped mt-4">
      <div class="control">
        <button 
          type="submit" 
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
        >
          {{ initialData ? "Save" : "Create" }}
        </button>
      </div>
      <div class="control">
        <button type="button" class="button is-link is-light" @click="handleCancel">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, ref } from "vue";

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["save", "cancel"]);

const form = reactive({
  title: "",
  body: "",
});

const errors = reactive({
  title: "",
  body: "",
});

const isSubmitting = ref(false);

const clearForm = () => {
  form.title = "";
  form.body = "";
  errors.title = "";
  errors.body = "";
};

const initializeForm = () => {
  if (props.initialData) {
    form.title = props.initialData.title;
    form.body = props.initialData.body;
  } else {
    clearForm();
  }
  isSubmitting.value = false; 
};

initializeForm();

watch(
  () => props.initialData,
  () => {
    initializeForm();
  },
);

const handleCancel = () => {
  emit("cancel");
};

const validate = () => {
  let isValid = true;

  if (!form.title.trim()) {
    errors.title = "Title is required";
    isValid = false;
  }
  if (!form.body.trim()) {
    errors.body = "Body is required";
    isValid = false;
  }
  return isValid;
};

const handleSubmit = () => {
  if (validate()) {
    isSubmitting.value = true;
    
    emit("save", {
      ...form,
      id: props.initialData ? props.initialData.id : undefined,
    });
  }
};
</script>