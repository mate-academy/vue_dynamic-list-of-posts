import { addPost } from '../api/posts';
export default (await import('vue')).defineComponent({
    name: 'postForm',
    data() {
        return {
            loading: false,
            title: this.post ? this.post.title : '',
            titleError: false,
            body: this.post ? this.post.body : '',
            bodyError: false,
        };
    },
    props: {
        sidebar: Boolean,
        post: Object,
        editing: Boolean,
    },
    emits: ['handleSidebar', 'updatePost'],
    methods: {
        handleSubmit() {
            this.loading = true;
            const postId = this.post ? this.post.id : null;
            if (!this.title) {
                this.titleError = true;
            }
            const title = this.title;
            if (!this.body) {
                this.bodyError = true;
            }
            const body = this.body;
            if (this.titleError || this.bodyError) {
                this.loading = false;
                return;
            }
            const userId = 1416;
            if (this.editing) {
                this.$emit('updatePost', { postId, title, body });
            }
            else if (!this.editing) {
                addPost({ userId, title, body }).finally(() => this.loading = false);
            }
        }
    },
    watch: {
        title(newTitle, oldTitle) {
            if (newTitle !== oldTitle) {
                this.titleError = false;
            }
        },
        body(newBody, oldBody) {
            if (newBody !== oldBody) {
                this.bodyError = false;
            }
        }
    }
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tile is-parent is-8-desktop Sidebar" },
    ...{ class: ({ 'Sidebar--open': __VLS_ctx.sidebar }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tile is-child box is-success" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
});
if (__VLS_ctx.editing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
    'data-cy': "NameField",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "label" },
    for: "comment-author-name-title",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "control has-icons-left has-icons-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "text",
    name: "title",
    id: "comment-author-name-title",
    placeholder: "Post title",
    ...{ class: "input" },
    ...{ class: ({ 'is-danger': __VLS_ctx.titleError }) },
    value: (__VLS_ctx.title),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "icon is-small is-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "fas fa-user fa-heading" },
});
if (__VLS_ctx.titleError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        className: "icon is-small is-right has-text-danger",
        'data-cy': "ErrorIcon",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        className: "fas fa-exclamation-triangle",
    });
}
if (__VLS_ctx.titleError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        className: "help is-danger",
        'data-cy': "ErrorMessage",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
    'data-cy': "BodyField",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "label" },
    for: "comment-body",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "control" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    id: "comment-body",
    name: "body",
    placeholder: "Post body",
    ...{ class: "textarea" },
    ...{ class: ({ 'is-danger': __VLS_ctx.bodyError }) },
    value: (__VLS_ctx.body),
});
if (__VLS_ctx.bodyError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        className: "help is-danger",
        'data-cy': "ErrorMessage",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field is-grouped" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "control" },
});
if (__VLS_ctx.editing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: "submit",
        ...{ class: "button is-link" },
        ...{ class: ({ 'is-loading': __VLS_ctx.loading }) },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: "submit",
        ...{ class: "button is-link" },
        ...{ class: ({ 'is-loading': __VLS_ctx.loading }) },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('handleSidebar');
        } },
    ...{ class: "control" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "reset",
    ...{ class: "button is-link is-light" },
});
/** @type {__VLS_StyleScopedClasses['tile']} */ ;
/** @type {__VLS_StyleScopedClasses['is-parent']} */ ;
/** @type {__VLS_StyleScopedClasses['is-8-desktop']} */ ;
/** @type {__VLS_StyleScopedClasses['Sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['Sidebar--open']} */ ;
/** @type {__VLS_StyleScopedClasses['tile']} */ ;
/** @type {__VLS_StyleScopedClasses['is-child']} */ ;
/** @type {__VLS_StyleScopedClasses['box']} */ ;
/** @type {__VLS_StyleScopedClasses['is-success']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['has-icons-left']} */ ;
/** @type {__VLS_StyleScopedClasses['has-icons-right']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['is-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['is-small']} */ ;
/** @type {__VLS_StyleScopedClasses['is-left']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-user']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['is-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['is-grouped']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['is-link']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['is-link']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['is-link']} */ ;
/** @type {__VLS_StyleScopedClasses['is-light']} */ ;
var __VLS_dollars;
let __VLS_self;
