<template>
  <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        <img
          src="https://bulma.io/images/placeholders/128x128.png"
          alt="Avatar"
        />
      </p>
    </figure>

    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ comment.name }}</strong>
          <small>{{ comment.email }}</small>
          <br />
          {{ comment.body }}
        </p>
      </div>

      <nav class="level is-mobile">
        <div class="level-left">
          <button
            class="button is-small is-danger level-item"
            @click="handleDelete"
            :class="{ 'is-loading': deleting }"
          >
            Delete
          </button>
        </div>
      </nav>
    </div>
  </article>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  emits: ["delete-comment"],
  setup(props, { emit }) {
    const deleting = ref(false);

    const handleDelete = async () => {
      deleting.value = true;
      try {
        emit("delete-comment", props.comment.id);
      } finally {
      }
    };

    return {
      deleting,
      handleDelete,
    };
  },
};
</script>
