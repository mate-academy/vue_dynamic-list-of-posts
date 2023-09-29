<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-reserved-component-names -->
<script>
export default {
  name: 'Post',
  props: {
    post: Object,
    isOnPreview: Boolean,
  },
  emits: ['closePreview', 'openPreview'],
}
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>

    <td>{{ post.title }}</td>

    <td className="has-text-right is-vcentered">
      <button 
        type="button" 
        class="button is-link"
        :class="{ 'is-light': !isOnPreview }"
        @click="isOnPreview ? $emit('closePreview') : $emit('openPreview')"
      >
        {{ isOnPreview ? 'Close' : 'Open' }}
      </button>
    </td>
  </tr>
</template>
