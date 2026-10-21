<script setup>
import { usePostStore } from '@/store/postStore.js';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import { computed, ref, watch } from 'vue';


const props = defineProps({
  isComment: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
  postToEdit: { type: Object, default: null }
});

const isErrorPostTitle = ref(false);

const isErrorAuthor = ref(false);
const isErrorEmail = ref(false);

const isErrorpostBody = ref(false);

const globalState = usePostStore()
const userId = JSON.parse(localStorage.getItem("user"))?.id

const postList = computed(() => globalState.state.postsList || []);

const currentPost = computed(() =>
  postList.value.find((post) => globalState.state.activePostId === post.id),
);

const postTitle = ref(props.isEditing ? currentPost.value.title : "");
const postBodyLocal = ref(props.isEditing ? currentPost.value.body : "");

// Substitui os ref locais por computadas ligadas à Store
const commentAuthor = computed({
  get: () => globalState.state.commentAuthor,
  set: (val) => { globalState.setCommentAuthor(val); }
});

const commentEmail = computed({
  get: () => globalState.state.commentEmail,
  set: (val) => { globalState.setCommentEmail(val) ; }
});

const commentBody = computed({
  get: () => globalState.state.commentBody,
  set: (val) => { globalState.setCommentBody(val); }
});

const activeBody = computed({
  get: () => props.isComment ? commentBody.value : postBodyLocal.value,
  set: (val) => {
    if (props.isComment) {
      commentBody.value = val;
    } else {
      postBodyLocal.value = val;
    }
  }
});

watch(
  () => [props.isEditing, currentPost.value],
  ([isEditing, post]) => {
    if (isEditing && post) {
      postTitle.value = post.title || "";
      postBodyLocal.value = post.body || "";
    } else if (!isEditing) {
      postTitle.value = "";
      postBodyLocal.value = "";
    }
  },
  { immediate: true, deep: true }
);



const handleSubmit = async () => {
  if (props.isEditing) {
    // Lógica de Edição (Valida Título e Corpo)
    if (postTitle.value && postBodyLocal.value) {
      const realPostId = currentPost.value.id.value !== undefined 
        ? currentPost.value.id.value 
        : currentPost.value.id
      await globalState.fetchUpdatePost({
        postId: Number(realPostId),
        userId,
        title: postTitle.value,
        body: postBodyLocal.value
      });
    } else {
      // CORRIGIDO: Valida os campos corretos da edição
      isErrorPostTitle.value = !postTitle.value;
      isErrorpostBody.value = !postBodyLocal.value;
    }
  } else if (props.isComment) {
    // Validação e envio de Comentário
    if (commentAuthor.value && commentEmail.value && commentBody.value) {
      await globalState.fetchAddComment({
        postId: globalState.state.activePostId,
        name: commentAuthor.value,
        email: commentEmail.value,
        body: commentBody.value
      });
      globalState.clearCommentForm();
      globalState.handleShowFormComment(false);
      
      // Limpa os erros de comentário após o sucesso (opcional mas recomendado)
      isErrorAuthor.value = false;
      isErrorEmail.value = false;
      isErrorpostBody.value = false;
    } else {
      // ADICIONADO: O 'else' que faltava para marcar os erros de comentário se falhar
      isErrorAuthor.value = !commentAuthor.value;
      isErrorEmail.value = !commentEmail.value;
      isErrorpostBody.value = !commentBody.value;
    }
  } else {
    // Validação e envio de Post Novo
    if (postTitle.value && postBodyLocal.value) {
      await globalState.fecthAddPost({
        userId,
        title: postTitle.value,
        body: postBodyLocal.value
      });
    } else {
      isErrorPostTitle.value = !postTitle.value;
      isErrorpostBody.value = !postBodyLocal.value;
    }
  }
};

</script>

<template>
  
  <form @submit.prevent="handleSubmit()">
    
    <!-- SE FOR COMENTÁRIO: Mostra Autor e E-mail -->
    <template v-if="isComment">
      <InputField 
        v-model="commentAuthor" 
        v-model:isError="isErrorAuthor" 
        isComment 
      />
      <InputField 
        v-model="commentEmail" 
        v-model:isError="isErrorEmail" 
        isEmail 
      />
    </template>

    <!-- SE FOR POST (Criação ou Edição): Mostra apenas o Título -->
    <template v-else>
      <InputField 
        v-model="postTitle" 
        v-model:isError="isErrorPostTitle" 
      />
    </template>

    <!-- O corpo (textarea) é comum para os dois! -->
    <TextAreaField 
      v-model="activeBody" 
      v-model:isError="isErrorpostBody" 
    />

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" >
          {{ isEditing ? "Save" : (isComment ? "Add a comment" : "Save") }}
        </button>
      </div>
      <div class="control">
        <button 
          type="button"
          class="button is-link is-light" 
          @click="isEditing ? globalState.handleIsEditing(false) : (globalState.handleShowPost(false), globalState.handleShowFormComment(false))"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
