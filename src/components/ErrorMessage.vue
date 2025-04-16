<script>
    export default {
        name: 'ErrorMessage',
        props: {
            props: String,
        },
        emits: ['close']
    }
</script>

<template>
    <article class="message is-danger">
        <div class="message-header">
            <p>Error</p>
            <button class="delete" aria-label="delete" @click="$emit('close')"></button>
        </div>
        <div class="message-body">
            Cant download {{ props }}.
        </div>
    </article>
</template>