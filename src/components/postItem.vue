<script>

export default {
    name: 'postItem',
    props: {
        post: {},
        selectedPost: {},
    },
    emits: ['handlePostButton'],
}
</script>

<template>
    <tr>
        <td>{{ post.id }}</td>
        <td>{{ post.title }}</td>
        <td className="has-text-right is-vcentered">
            <button 
                type="button" 
                className="button is-link" 
                @click="$emit('handlePostButton', post)" 
                v-if="selectedPost === post"
            >
                Close
            </button>
            <button 
                type="button" 
                className="button is-link is-light" 
                @click="$emit('handlePostButton', post)" 
                v-else
            >
                Open
            </button>
        </td>
    </tr>
</template>