<script>
  import { addComment } from '@/api/comments';
  import InputField from './InputField.vue';
  import TextAreaField from './TextAreaField.vue';

  export default {
    name: "AddCommentForm",
    components: {
      InputField,
      TextAreaField,
    },
    props: {
      postId: Number,
    },
    data() {
      return {
        inputName: "",
        inputNameError: "",
        inputEmail: "",
        inputEmailError: "",
        body: "",
        bodyError: "",
        isLoadingSubmit: false,
        userName: "",
        submitError: "",
      };
    },
    emits: ["closeCommentForm", "addComment"],
    mounted() {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        this.userName = currentUser.name;
      }
    },
    methods: {
      clearErrors() {
        this.inputNameError = "";
        this.inputEmailError = "";
        this.bodyError = "";
        this.submitError = "";
      },
      handleSubmit() {
        const postId = this.postId;
        const name = this.inputName.trim();
        const email = this.inputEmail.trim();
        const body = this.body.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name.length) {
          this.inputNameError = "Name is required";
        }

        if (name.length > 33) {
          this.inputNameError = "Max length of name is 33 symbols";
        }

        if (!emailRegex.test(email)) {
          this.inputEmailError = "Email is required";
        }

        if (!body.length) {
          this.bodyError = "Comment is required";
        }

        if (
          this.inputNameError.length ||
          this.inputEmailError.length ||
          this.bodyError.length
        ) {
          return;
        }

        this.isLoadingSubmit = true;
        this.submitError = "";
        addComment({ postId, name, email, body })
          .then(({ data }) => {
            this.$emit("addComment", data);
            this.body = "";
          })
          .catch((error) => {
            this.submitError = "Failed to add comment. Please check your network and try again.";
          })
          .finally(() => {
            this.isLoadingSubmit = false;
          });
      },
    },
  };
  </script>

  <template>
    <form @submit.prevent="handleSubmit" novalidate>
      <div v-if="submitError" class="notification is-danger is-light mb-4">
        {{ submitError }}
      </div>

      <InputField
        v-model="inputName"
        :inputError="inputNameError"
        label="Author Name"
        placeholder="Name Surname"
        icon="fa-user"
        :id="'comment-author-name-'+userName"
        @input="clearErrors"
      />

      <InputField
        v-model="inputEmail"
        :inputError="inputEmailError"
        label="Author Email"
        placeholder="Your Email"
        icon="fa-envelope"
        :id="'comment-author-email-'+userName"
        @input="clearErrors"
      />

      <TextAreaField
        v-model="body"
        :bodyError="bodyError"
        label="Comment Body"
        placeholder="Your comment"
        :id="'comment-body-'+userName"
        @input="clearErrors"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isLoadingSubmit }"
          >
            Add comment
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="$emit('closeCommentForm'); clearErrors()" 
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </template>

  <style></style>
