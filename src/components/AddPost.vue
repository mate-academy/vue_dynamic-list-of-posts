<script>
import TextAreaField from "./TextAreaField.vue";
import InputField from "./InputField.vue";
import { createPost, updatePost } from "@/api/post";

export default {
  name: "AddPost",
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    title: String,
  },
  data() {
    return {
      newPostTitle: this.$store.state.currentPost?.title || "",
      newPostText: this.$store.state.currentPost?.body || "",
      hasErrorTitle: false,
      hasErrorText: false,
    };
  },
  methods: {
    send() {
      if (!this.validation()) {
        return;
      }
      const sendData = {
        body: this.newPostText,
        title: this.newPostTitle,
        userId: this.$store.state.userId,
        postId: this.$store.state.currentPost?.id,
      };

      if (this.$store.state.inSidebar === "creatingPost") {
        this.creatingPost(sendData);
      } else {
        this.updatingPost(sendData);
      }
    },

    creatingPost(e) {
      createPost(e).then(({ data }) => {
        this.$store.commit("addPostList", data);
        this.$store.commit("setCurrentPost", data);
        this.$store.commit("setInSidebar", "postDetails");
      });
    },

    updatingPost(e) {
      updatePost(e).then(({ data }) => {
        this.$store.commit("updatePost", data);
        this.$store.commit("setCurrentPost", data);
        this.$store.commit("setInSidebar", "postDetails");
      });
    },

    validation() {
      let hasErr = false;

      switch ("") {
        case this.newPostTitle:
          hasErr = true;
          this.hasErrorTitle = true;

        case this.newPostText:
          hasErr = true;
          this.hasErrorText = true;
          break;

        default:
          hasErr = false;
          break;
      }

      return !hasErr;
    },

    cancel() {
      if (this.$store.state.inSidebar === "creatingPost") {
        this.$store.commit("setInSidebar", "");
      } else {
        this.$store.commit("setInSidebar", "postDetails");
      }
    },

    reset() {
      this.newPostTitle = "";
      this.newPostText = "";
      this.hasErrorTitle = false;
      this.hasErrorText = false;
    },
  },
};
</script>

<template>
  <div className="content">
    <h2>{{ title }}</h2>

    <form @submit.prevent="send">
      <InputField
        v-model.trim="newPostTitle"
        :hasError="hasErrorTitle"
        name="title"
        title="Title"
        placeholder="Post title"
        errorText="Title is required"
        @removeErr="hasErrorTitle = false"
      />
      <TextAreaField
        v-model.trim="newPostText"
        :hasError="hasErrorText"
        name="postText"
        title="Write Post Body"
        placeholder="Post body"
        errorText="Body is required"
        @removeErr="hasErrorText = false"
      />

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">Save</button>
        </div>
        <div class="control">
          <button @click="cancel" type="reset" class="button is-link is-light">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>
