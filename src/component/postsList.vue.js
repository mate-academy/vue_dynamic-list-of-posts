import { deletePost, getPosts, updatePost } from '../api/posts';
import ErrorMessage from './ErrorMessage.vue';
import Loader from './Loader.vue';
import PostForm from './postForm.vue';
import PostItem from './postItem.vue';
import PostPreview from './postPreview.vue';
export default (await import('vue')).defineComponent({
    name: 'postList',
    components: {
        Loader,
        PostForm,
        PostPreview,
        PostItem,
        ErrorMessage,
    },
    data() {
        return {
            posts: [],
            sidebar: false,
            postPreview: false,
            selectedPost: {},
            editing: false,
            loading: false,
            errorMessage: false,
        };
    },
    props: {
        user: {},
    },
    mounted() {
        this.loading = true;
        getPosts().then(({ data }) => { this.posts = data; }).catch(() => this.errorMessage = true).finally(() => this.loading = false);
    },
    methods: {
        handleSidebar() {
            if (this.sidebar && !this.editing) {
                this.sidebar = false;
                this.editing = false;
            }
            else if (this.sidebar && this.editing) {
                this.editing = false;
                this.sidebar = false;
            }
            else {
                this.sidebar = true;
                this.postPreview = false;
                this.editing = false;
                this.selectedPost = {};
            }
        },
        handlePostButton(post) {
            if (this.selectedPost === post) {
                this.selectedPost = {};
                this.postPreview = false;
                this.editing = false;
                this.sidebar = false;
            }
            else {
                this.selectedPost = post;
                this.postPreview = true;
                this.editing = false;
                this.sidebar = false;
            }
        },
        deletePost(postId) {
            deletePost(postId);
            this.posts = this.posts.filter(item => item.id !== postId);
            this.postPreview = false;
        },
        updatePost({ postId, title, body }) {
            updatePost({ postId, title, body }).then(({ data }) => {
                this.posts = this.posts.map(post => {
                    if (post.id === postId) {
                        post = { ...data };
                        return { ...data };
                    }
                    else {
                        return post;
                    }
                });
            }).finally(() => this.loading = false);
        },
        handleEditing() {
            this.sidebar = true;
            this.editing = true;
        }
    }
});
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Loader,
    PostForm,
    PostPreview,
    PostItem,
    ErrorMessage,
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "tile is-parent",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "tile is-child box is-success",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "block",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "block is-flex is-justify-content-space-between",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    className: "title",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleSidebar) },
    type: "button",
    ...{ class: "button is-link" },
    ...{ class: ({ 'is-light': __VLS_ctx.sidebar && !__VLS_ctx.editing }) },
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
        props: ('posts'),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClose': {} },
        props: ('posts'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.errorMessage))
                return;
            __VLS_ctx.errorMessage = false;
        }
    };
    var __VLS_7;
}
if (__VLS_ctx.posts.length > 1 && !__VLS_ctx.loading) {
    for (const [post] of __VLS_getVForSourceType((__VLS_ctx.posts))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
            className: "table is-fullwidth is-striped is-hoverable is-narrow",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            className: "has-background-link-light",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            className: "has-text-right",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
        const __VLS_12 = {}.PostItem;
        /** @type {[typeof __VLS_components.PostItem, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            ...{ 'onHandlePostButton': {} },
            post: (post),
            selectedPost: (__VLS_ctx.selectedPost),
            key: (post.id),
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onHandlePostButton': {} },
            post: (post),
            selectedPost: (__VLS_ctx.selectedPost),
            key: (post.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_16;
        let __VLS_17;
        let __VLS_18;
        const __VLS_19 = {
            onHandlePostButton: (...[$event]) => {
                if (!(__VLS_ctx.posts.length > 1 && !__VLS_ctx.loading))
                    return;
                __VLS_ctx.handlePostButton(post);
            }
        };
        var __VLS_15;
    }
}
if (__VLS_ctx.posts.length === 0 && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        className: "block",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        className: "mt-2 has-text-centered",
    });
}
if (__VLS_ctx.postPreview && !__VLS_ctx.sidebar) {
    const __VLS_20 = {}.postPreview;
    /** @type {[typeof __VLS_components.PostPreview, typeof __VLS_components.postPreview, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onDeletePost': {} },
        ...{ 'onHandleEditing': {} },
        post: (__VLS_ctx.selectedPost),
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onDeletePost': {} },
        ...{ 'onHandleEditing': {} },
        post: (__VLS_ctx.selectedPost),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onDeletePost: (__VLS_ctx.deletePost)
    };
    const __VLS_28 = {
        onHandleEditing: (__VLS_ctx.handleEditing)
    };
    var __VLS_23;
}
if (__VLS_ctx.sidebar) {
    const __VLS_29 = {}.PostForm;
    /** @type {[typeof __VLS_components.PostForm, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        ...{ 'onHandleSidebar': {} },
        ...{ 'onUpdatePost': {} },
        sidebar: (__VLS_ctx.sidebar),
        post: (__VLS_ctx.selectedPost),
        editing: (__VLS_ctx.editing),
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onHandleSidebar': {} },
        ...{ 'onUpdatePost': {} },
        sidebar: (__VLS_ctx.sidebar),
        post: (__VLS_ctx.selectedPost),
        editing: (__VLS_ctx.editing),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_33;
    let __VLS_34;
    let __VLS_35;
    const __VLS_36 = {
        onHandleSidebar: (__VLS_ctx.handleSidebar)
    };
    const __VLS_37 = {
        onUpdatePost: (__VLS_ctx.updatePost)
    };
    var __VLS_32;
}
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['is-link']} */ ;
/** @type {__VLS_StyleScopedClasses['is-light']} */ ;
var __VLS_dollars;
let __VLS_self;
