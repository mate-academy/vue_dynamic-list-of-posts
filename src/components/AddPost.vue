<script setup>
import { ref } from "vue";

const title = ref("");
const content = ref("");

const addPost = async () => {
  // Logic to add a new post
};

</script>
<template>
  <div class="content">
  <h2>title</h2>

  <form>
    <!-- inputs... -->

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Save</button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light">Cancel</button>
      </div>
    </div>
  </form>
</div>

</template>
