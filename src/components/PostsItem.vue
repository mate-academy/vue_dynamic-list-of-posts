<script setup>
const props = defineProps({
  post: {
    type: Object
  }
})
</script>

<template>
  <tr>
    <td>{{ props.post.id }}</td>
    <td>{{ props.post.title }}</td>
    <td className="has-text-right is-vcentered">
      <button type="button" className="button is-link">Open</button>
    </td>
  </tr>
</template>
