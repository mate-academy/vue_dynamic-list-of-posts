export default (await import('vue')).defineComponent({
    name: 'comment',
    props: {
        comment: {},
    },
    emits: ['deleteComment']
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    className: "message is-small",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "message-header",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    href: ('mailto:' + __VLS_ctx.comment.email),
});
(__VLS_ctx.comment.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('deleteComment', __VLS_ctx.comment.id);
        } },
    type: "button",
    className: "delete is-small",
    'aria-label': "delete",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "message-body",
});
(__VLS_ctx.comment.body);
var __VLS_dollars;
let __VLS_self;
