<script setup>
const props = defineProps(['active', 'posts'])
const emit = defineEmits(['open', 'close', 'create'])
</script>

<template>
  <div>
    <div class="tile is-parent">
      <div class="tile is-child box is-success">
        <div class="block">
          <div class="block is-flex is-justify-content-space-between">
            <p class="title">Posts</p>
            <button type="button" class="button is-link" @click="emit('create')">
              Add New Post
            </button>
          </div>

          <table class="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
              <tr class="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="post of posts" :key="post.id">
                <td>{{ post?.id }}</td>

                <td>{{ post.title }}</td>

                <td class="has-text-right is-vcentered">
                  <button
                    v-if="props.active === post.id && props.active"
                    type="button"
                    class="button is-link"
                    @click="emit('close')"
                  >
                    Close
                  </button>

                  <button
                    v-else
                    type="button"
                    class="button is-link"
                    @click="emit('open', post.id)"
                  >
                    Open
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
