import { addComment, deleteComment, getComments } from '../api/comments';
import Comment from './comment.vue';
import CommentForm from './CommentForm.vue';
import ErrorMessage from './ErrorMessage.vue';
import Loader from './Loader.vue';
import PostForm from './postForm.vue';
export default (await import('vue')).defineComponent({
    name: 'postPreview',
    components: {
        Comment,
        CommentForm,
        PostForm,
        Loader,
        ErrorMessage,
    },
    data() {
        return {
            comments: [],
            commentForm: false,
            loading: false,
            errorMessage: false,
        };
    },
    props: {
        post: {},
    },
    emits: ['deletePost', 'handleEditing'],
    mounted() {
        this.loading = true;
        getComments(this.post.id).then(({ data }) => { this.comments = data; }).catch(() => this.errorMessage = true).finally(() => this.loading = false);
    },
    methods: {
        addComment({ name, email, body }) {
            this.loading = true;
            const postId = this.post.id;
            addComment({ postId, name, email, body }).then(({ data }) => this.comments.push(data)).finally(() => this.loading = false);
        },
        deleteComment(commentId) {
            deleteComment(commentId).then(this.comments = this.comments.filter(comment => comment.id !== commentId));
        }
    },
    watch: {
        post(newPost, oldPost) {
            if (newPost !== oldPost) {
                this.loading = true;
                getComments(this.post.id).then(({ data }) => { this.comments = data; }).finally(() => this.loading = false);
            }
        },
    }
});
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Comment,
    CommentForm,
    PostForm,
    Loader,
    ErrorMessage,
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tile is-parent is-8-desktop Sidebar--open" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tile is-child box is-success" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "block",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "is-flex is-justify-content-space-between is-align-items-center",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
(__VLS_ctx.post.id);
(__VLS_ctx.post.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "is-flex",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('handleEditing');
        } },
    className: "icon is-small is-right is-clickable",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    className: "fas fa-pen-to-square",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('deletePost', __VLS_ctx.post.id);
        } },
    className: "icon is-small is-right has-text-danger is-clickable ml-3",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    className: "fas fa-trash",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    'data-cy': "PostBody",
});
(__VLS_ctx.post.body);
if (!__VLS_ctx.commentForm) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        className: "block",
    });
    if (__VLS_ctx.loading) {
        const __VLS_0 = {}.Loader;
        /** @type {[typeof __VLS_components.Loader, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
        const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
    if (__VLS_ctx.errorMessage) {
        const __VLS_4 = {}.ErrorMessage;
        /** @type {[typeof __VLS_components.ErrorMessage, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            ...{ 'onClose': {} },
            props: ('comments'),
        }));
        const __VLS_6 = __VLS_5({
            ...{ 'onClose': {} },
            props: ('comments'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        let __VLS_8;
        let __VLS_9;
        let __VLS_10;
        const __VLS_11 = {
            onClose: (...[$event]) => {
                if (!(!__VLS_ctx.commentForm))
                    return;
                if (!(__VLS_ctx.errorMessage))
                    return;
                __VLS_ctx.errorMessage = false;
            }
        };
        var __VLS_7;
    }
    else {
        for (const [comment] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
            const __VLS_12 = {}.Comment;
            /** @type {[typeof __VLS_components.Comment, ]} */ ;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
                ...{ 'onDeleteComment': {} },
                comment: (comment),
                key: (comment.id),
            }));
            const __VLS_14 = __VLS_13({
                ...{ 'onDeleteComment': {} },
                comment: (comment),
                key: (comment.id),
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            let __VLS_16;
            let __VLS_17;
            let __VLS_18;
            const __VLS_19 = {
                onDeleteComment: (__VLS_ctx.deleteComment)
            };
            var __VLS_15;
        }
    }
    if (__VLS_ctx.comments.length === 0 && !__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            className: "block",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            className: "title is-4",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.commentForm))
                    return;
                __VLS_ctx.commentForm = true;
            } },
        type: "button",
        className: "button is-link",
    });
}
if (__VLS_ctx.commentForm) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        className: "block",
    });
    const __VLS_20 = {}.CommentForm;
    /** @type {[typeof __VLS_components.CommentForm, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onClose': {} },
        ...{ 'onAddComment': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClose': {} },
        ...{ 'onAddComment': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.commentForm))
                return;
            __VLS_ctx.commentForm = false;
        }
    };
    const __VLS_28 = {
        onAddComment: (__VLS_ctx.addComment)
    };
    var __VLS_23;
}
/** @type {__VLS_StyleScopedClasses['tile']} */ ;
/** @type {__VLS_StyleScopedClasses['is-parent']} */ ;
/** @type {__VLS_StyleScopedClasses['is-8-desktop']} */ ;
/** @type {__VLS_StyleScopedClasses['Sidebar--open']} */ ;
/** @type {__VLS_StyleScopedClasses['tile']} */ ;
/** @type {__VLS_StyleScopedClasses['is-child']} */ ;
/** @type {__VLS_StyleScopedClasses['box']} */ ;
/** @type {__VLS_StyleScopedClasses['is-success']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
var __VLS_dollars;
let __VLS_self;
