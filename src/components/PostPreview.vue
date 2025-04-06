<script lang="ts">
import { LoadingStatus, SidebarMode } from '@/enums';
import { deleteComment, getComments, postComment } from '@/httpClient';
import type { Comment, Post } from '@/types/types';
import { defineComponent, type PropType } from 'vue';
import PostLoader from './PostLoader.vue';
import NoCommentsYet from './NoCommentsYet.vue';
import PostComment from './PostComment.vue';
import WriteCommentBtn from './WriteCommentBtn.vue';
import AddComment from './AddComment.vue';
import type { SetAddCommentErrors } from '@/types/functions';

export default defineComponent({
  components: {
    PostLoader,
    NoCommentsYet,
    PostComment,
    WriteCommentBtn,
    AddComment,
  },
  props: {
    sidebarMode: {
      type: String as PropType<SidebarMode>,
      reqired: true,
    },
    savedName: {
      type: String,
      required: true,
    },
    savedEmail: {
      type: String,
      required: true,
    },
    post: {
      type: Object as PropType<Post>,
      required: true,
    }
  },
  data(): {
    deleteError: boolean,
    loadingStatus: LoadingStatus,
    writeCommentFormOpened: boolean,
    comments: Comment[],
    commentsDuringDeletion: Comment[] | null,
    commentIdDuringDeletion: number | null,
  } {
    return {
      deleteError: false,
      loadingStatus: LoadingStatus.Loading,
      writeCommentFormOpened: false,
      comments: [],
      commentsDuringDeletion: null,
      commentIdDuringDeletion: null,
    }
  },
  mounted() {
    this.handleCommentsLoad();
  },
  watch: {
    comments: {
      deep: true,
      handler() {
        this.updateLoadingStatus();
      }
    }
  },
  emits: ['postDelete', 'update:sidebarMode', 'update:savedName', 'update:savedEmail'],
  setup() {
    return { SidebarMode, LoadingStatus };
  },
  methods: {
    updateLoadingStatus() {
      if (this.comments.length) {
        this.loadingStatus = LoadingStatus.Success;
      } else {
        this.loadingStatus = LoadingStatus.NoData;
      }
    },
    setDeleteError(deleteError: boolean = false) {
      this.deleteError = deleteError;
    },
    handleDeleteButtonClick() {
      this.setDeleteError();
      this.$emit('postDelete', this.post.id, this.setDeleteError);
    },
    async handleCommentsLoad() {
      try {
        this.comments = await getComments(this.post.id);
        this.updateLoadingStatus();
      } catch {
        this.loadingStatus = LoadingStatus.Error;
      }
    },
    async handleCommentAdd(name: string, email: string, body: string, setErrors: SetAddCommentErrors) {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedBody = body.trim();
      const emailRegex =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      const isEmailValid = emailRegex.test(trimmedEmail);

      if (trimmedName && trimmedEmail && trimmedBody && isEmailValid) {
        try {
          const sentComment = await postComment({
            postId: this.post.id,
            name: trimmedName,
            email: trimmedEmail,
            body: trimmedBody,
          });

          this.comments.push(sentComment);
          this.$emit('update:savedName', trimmedName);
          this.$emit('update:savedEmail', trimmedEmail)
          this.writeCommentFormOpened = false;
          setErrors();
        } catch {
          setErrors(true);
        }
      } else {
        setErrors(false, !trimmedName, !trimmedEmail || !isEmailValid, !trimmedBody);
      }
    },
    async handleCommentDelete(commentId: number) {
      const arrayToCopy = this.commentsDuringDeletion || this.comments;
      const arrayToCopyIndex = arrayToCopy.findIndex(comment => comment.id === commentId);

      this.setDeleteError();

      if (arrayToCopyIndex !== -1) {
        const commentsDuringThisDeletion = [...arrayToCopy];

        commentsDuringThisDeletion.splice(arrayToCopyIndex, 1);
        this.commentsDuringDeletion = commentsDuringThisDeletion;
        this.commentIdDuringDeletion = commentId;

        try {
          await deleteComment(commentId);
          const index = this.comments.findIndex(comment => comment.id === commentId);
          this.comments.splice(index, 1);
        } catch {
          this.setDeleteError(true);
        } finally {
          if (commentId === this.commentIdDuringDeletion) {
            this.commentsDuringDeletion = null;
            this.commentIdDuringDeletion = null;
          }
        }
      } else {
        this.setDeleteError(true);
      }
    }
  },
});
</script>

<template>
  <div class="block">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h2>#{{post.id}}: {{post.title}}</h2>

      <div class="is-flex">
        <span @click="$emit('update:sidebarMode', SidebarMode.Edit)" class="icon is-small is-right is-clickable">
          <i class="fas fa-pen-to-square"></i>
        </span>

        <span
          @click="handleDeleteButtonClick"
          class="icon is-small is-right has-text-danger is-clickable ml-3"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>

    <h3
      v-if="deleteError"
      class="mt-2 has-text-centered has-text-danger"
    >
      Something went wrong!
    </h3>

    <p data-cy="PostBody">{{post.body}}</p>
  </div>

  <div class="block" v-if="!writeCommentFormOpened">
    <PostLoader v-if="loadingStatus === LoadingStatus.Loading"/>
    <NoCommentsYet v-else-if="loadingStatus === LoadingStatus.NoData"/>

    <div v-else-if="loadingStatus === LoadingStatus.Error" class="block">
      <p class="title is-4 has-text-danger">Something went wrong!</p>
    </div>

    <PostComment
      v-else
      v-for="comment of (commentsDuringDeletion || comments)"
      @delete="handleCommentDelete"
      :key="comment.id"
      :comment="comment"
    />

    <WriteCommentBtn
      v-if="(loadingStatus === LoadingStatus.Success || loadingStatus === LoadingStatus.NoData)"
      v-model="writeCommentFormOpened"
    />
  </div>

  <div class="block" v-else>
    <NoCommentsYet v-if="loadingStatus === LoadingStatus.NoData"/>

    <AddComment
      @submit="handleCommentAdd"
      v-model="writeCommentFormOpened"
      :start-name="savedName"
      :start-email="savedEmail"
    />
  </div>
</template>
