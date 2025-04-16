export default (await import('vue')).defineComponent({
    name: 'CommentForm',
    data() {
        return {
            name: '',
            email: '',
            body: '',
            nameError: false,
            emailError: false,
            bodyError: false,
        };
    },
    props: {
        loading: Boolean,
    },
    emits: ['close', 'addComment'],
    methods: {
        handleAddButton() {
            if (!this.name) {
                this.nameError = true;
            }
            const name = this.name;
            if (!this.email || !this.email.includes('@')) {
                this.emailError = true;
            }
            const email = this.email;
            if (!this.body) {
                this.bodyError = true;
            }
            const body = this.body;
            if (this.nameError || this.emailError || this.bodyError) {
                return;
            }
            this.$emit('addComment', { name, email, body });
            this.body = '';
        }
    },
    watch: {
        name(newName, oldName) {
            if (newName !== oldName) {
                this.nameError = false;
            }
        },
        email(newEmail, oldEmail) {
            if (newEmail !== oldEmail) {
                this.emailError = false;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "field",
    'data-cy': "NameField",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    className: "label",
    htmlFor: "{`comment-author-name-${name}`}",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "control has-icons-left has-icons-right",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "text",
    name: (__VLS_ctx.name),
    id: "'{`comment-author-name-${name}`}",
    placeholder: "Name Surname",
    ...{ class: "input" },
    ...{ class: ({ 'is-danger': __VLS_ctx.nameError }) },
    value: (__VLS_ctx.name),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    className: "icon is-small is-left",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    className: "fas fa-user",
});
if (__VLS_ctx.nameError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        className: "icon is-small is-right has-text-danger",
        'data-cy': "ErrorIcon",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        className: "fas fa-exclamation-triangle",
    });
}
if (__VLS_ctx.nameError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        className: "help is-danger",
        'data-cy': "ErrorMessage",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "field",
    'data-cy': "NameField",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    className: "label",
    htmlFor: "{`comment-author-email-${email}`}",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    className: "control has-icons-left has-icons-right",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "email",
    name: "{email}",
    id: "{`comment-author-email-${email`}",
    placeholder: "Your email",
    ...{ class: "input" },
    ...{ class: ({ 'is-danger': __VLS_ctx.emailError }) },
});
(__VLS_ctx.email);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    className: "icon is-small is-left",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    className: "fas fa-user fa-envelope",
});
if (__VLS_ctx.emailError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        className: "icon is-small is-right has-text-danger",
        'data-cy': "ErrorIcon",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        className: "fas fa-exclamation-triangle",
    });
}
if (__VLS_ctx.emailError) {
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleAddButton) },
    type: "submit",
    ...{ class: "button is-link" },
    ...{ class: ({ 'is-loading': __VLS_ctx.loading }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('close');
        } },
    ...{ class: "control" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "reset",
    ...{ class: "button is-link is-light" },
});
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['is-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['is-danger']} */ ;
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
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['is-link']} */ ;
/** @type {__VLS_StyleScopedClasses['is-light']} */ ;
var __VLS_dollars;
let __VLS_self;
