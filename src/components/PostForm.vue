<script>
import InputField from './InputField.vue';
import TextareaField from './TextareaField.vue';

  export default {
    name: "PostForm",
    data() {
      const { status, postPreview } = this;

      return {
        title: (status === 'update') ? postPreview.title : '',
        body: (status === 'update') ? postPreview.body : '',
        textError: '',
        bodyError: '',
      }
    },
    components: {
      InputField,
      TextareaField
    },
    props: {
      status: String,
      postPreview: Object,
    },
    emits: ['setStatusForm', 'setPosts', 'setPreviewId', 'setIsPreview'],
    methods: {
      handleSubmit() {
        const { status, title, body, $emit } = this;

        if (title.trim() === '') {
          this.textError = "Can't be empty";
          return;
        };

        this.textError = '';

        if (body.trim() === '') {
          this.bodyError = "Can't be empty";
          return;
        };

        this.bodyError = '';

        const newPost = {
          id: Math.ceil(Math.random() * (1000 - 1) + 1),
          title: title,
          body: body,
          comments: (status === 'update') ? this.postPreview.comments : [],
        };

        $emit('setPosts', newPost);
        $emit('setStatusForm', 'off');
        $emit('setIsPreview', true);

        if (status === 'create') {
          $emit('setPreviewId', newPost.id);
        }
      },
    },
  }
</script>

<template>
  <div className="content">
    <h2>{{ (status === 'create') ? 'Create new post' : 'Post editing'}}</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="title"
        type="text"
        name="Title"
        placeholder="Post title"
        :textError="textError"
      />
      <TextareaField
        v-model="body"
        name="Write Post Body"
        placeholder="Post body"
        :textError="bodyError"
      />

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">
            {{ (status === 'create') ? 'Create' : 'Save'}}
          </button>
        </div>
        <div className="control">
          <button
            type="reset"
            className="button is-link is-light"
            @click="$emit('setStatusForm', 'off'); (status === 'update') ? $emit('setIsPreview', true) : ''"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
[{
  id: 2138471928
  name: 'Misha'
},{
  name: 'Serafim'
},{
 name: 'Nikita'
}]
