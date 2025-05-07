<script>
  export default {
    props: {
      post: Object,
      selectedPost: Object,
    },
    emits: ['openPost', 'closePost'],
    setup(props, { emit }) {
      const { id, title } = props.post;
      const { id: selectId } = props.selectedPost || {};

      const openPost = () => {
        if (props.selectedPost && props.selectedPost.id === id) {
          emit('closePost');
        } else {
          emit('openPost', props.post);
        }
      };

      return {
        id,
        title,
        selectId,
        openPost
      };
    }
  }
</script>

<template>
  <tr>
    <td>{{ id }}</td>
    <td>{{ title }}</td>
    <td class="has-text-right is-vcentered">
      <button type="button" class="button" :class="{'is-link': selectedPost && id === selectId}" @click="openPost">
        {{ selectedPost && id === selectId ? 'Close' : 'Open' }}
      </button>
    </td>
  </tr>
</template>
