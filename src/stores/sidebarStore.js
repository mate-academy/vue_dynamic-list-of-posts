import { defineStore } from "pinia";
import { ref } from "vue";


const useSidebarStore = defineStore("sidebar", () => {
  const isOpen = ref(false);
  const openNewPost = ref(false);
  const writeACommentBtn = ref(false);
  const editPost = ref(false);

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  return {
    isOpen,
    openNewPost,
    writeACommentBtn,
    editPost,
    open,
    close,
    toggle,
  };
});

export default useSidebarStore;