<script>
import PostLoader from '@/components/PostLoader.vue';

export default {
    components: {
        PostLoader
    },
    emits: ['open', 'close'],
    props: {
        posts: {
            type: Array
        },
        opened: {
          type: Boolean
        },
        isLoad: {
          type: Boolean
        }
    },
    data() {
        return {
            currentId: -1,
        }
    },
    methods: {
      open() {
        this.$emit('open');

        this.currentId = -1;
      },
      openWithParam(post) {
        if (post && this.currentId !== post.id) {
          this.currentId = post.id;
          this.$emit('open', post);

          return;
        }

        if (this.opened && this.currentId < 0) {
          this.currentId = post.id;
          this.$emit('open', post);

          return;
        }

        if (!this.opened) {
          this.$emit('open', post);
          this.currentId = post.id;
        } else {
          this.$emit('close');
          this.currentId = -1;
        }
      },
      isActive(post) {
        return this.currentId === post.id;
      }
    },
}
</script>

<template>
    <div class="tile is-parent">
        <div class="tile is-child box is-success">
          <div class="block">
            <div class="block is-flex is-justify-content-space-between">
              <p class="title">Posts</p>
              <button 
                type="button" 
                class="button" 
                :class="{ 'is-link' : opened && currentId < 0 }" 
                @click="open"
              >
                Add New Post
              </button>
            </div>
        
            <PostLoader v-if="isLoad" />

            <p v-else-if="!isLoad && posts.length === 0">No posts yet</p>

            <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
              <thead>
                <tr class="has-background-link-light">
                  <th>ID</th>
                  <th>Title</th>
                  <th class="has-text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post of posts" :key="post.id">
                  {{ { id, title } = post }}

                  <td>{{ id }}</td>
                  <td>{{ title }}</td>
                  <td class="has-text-right is-vcentered">
                    <button
                      type="button" 
                      class="button" 
                      :class="{'is-link' : isActive(post)}" 
                      @click="openWithParam(post)"
                    >
                     {{ isActive(post) ? 'Close' : 'Open' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>
</template>