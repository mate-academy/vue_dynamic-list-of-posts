export default (await import('vue')).defineComponent({
    name: 'postItem',
    props: {
        post: {},
        selectedPost: {},
    },
    emits: ['handlePostButton'],
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
(__VLS_ctx.post.id);
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
(__VLS_ctx.post.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
    className: "has-text-right is-vcentered",
});
if (__VLS_ctx.selectedPost === __VLS_ctx.post) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.selectedPost === __VLS_ctx.post))
                    return;
                __VLS_ctx.$emit('handlePostButton', __VLS_ctx.post);
            } },
        type: "button",
        className: "button is-link",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.selectedPost === __VLS_ctx.post))
                    return;
                __VLS_ctx.$emit('handlePostButton', __VLS_ctx.post);
            } },
        type: "button",
        className: "button is-link is-light",
    });
}
var __VLS_dollars;
let __VLS_self;
