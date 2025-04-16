import { addUser, getUser } from '../api/users';
import ErrorMessage from './ErrorMessage.vue';
import Loader from './Loader.vue';
export default (await import('vue')).defineComponent({
    name: 'login',
    components: {
        Loader,
        ErrorMessage,
    },
    data() {
        return {
            register: false,
            email: '',
            name: '',
            loading: false,
            errorMessage: false,
        };
    },
    props: {
        user: {},
    },
    emits: ['addUser'],
    methods: {
        handleLogin() {
            this.loading = true;
            getUser(this.email)
                .then(({ data }) => {
                if (!data.length) {
                    this.register = true;
                }
                else {
                    this.$emit('addUser', data);
                    this.register = false;
                }
            })
                .catch(() => this.errorMessage = true)
                .finally(() => this.loading = false);
        },
        Register() {
            this.loading = true;
            const name = this.name;
            const email = this.email;
            const username = null;
            const phone = null;
            addUser({ name, username, email, phone }).finally(this.handleLogin(email));
            this.register = false;
        },
    },
    emits: [],
    watch: {}
});
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Loader,
    ErrorMessage,
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "container is-flex is-justify-content-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (...[$event]) => {
            __VLS_ctx.register ? __VLS_ctx.Register() : __VLS_ctx.handleLogin(__VLS_ctx.email);
        } },
    ...{ class: "box mt-5" },
});
if (__VLS_ctx.register) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        className: "title is-3",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "title is-3" },
    });
}
if (__VLS_ctx.errorMessage) {
    const __VLS_0 = {}.ErrorMessage;
    /** @type {[typeof __VLS_components.ErrorMessage, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClose': {} },
        props: ('user'),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClose': {} },
        props: ('user'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.errorMessage))
                return;
            __VLS_ctx.errorMessage = false;
        }
    };
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "label" },
    htmlFor: "user-email",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "control has-icons-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "email",
    id: "user-email",
    name: "email",
    ...{ class: "input" },
    placeholder: "Enter your email",
    required: true,
    disabled: (__VLS_ctx.register || __VLS_ctx.loading),
    autocomplete: "off",
});
(__VLS_ctx.email);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "icon is-small is-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "fas fa-envelope" },
});
if (__VLS_ctx.register) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        className: "field",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        className: "label",
        htmlFor: "user-name",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        className: "control has-icons-left",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "text",
        id: "user-name",
        name: "name",
        className: "input",
        placeholder: "Enter your name",
        required: true,
        minlength: "{4}",
        value: (__VLS_ctx.name),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        className: "icon is-small is-left",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        className: "fas fa-user",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
});
if (__VLS_ctx.loading) {
    const __VLS_8 = {}.Loader;
    /** @type {[typeof __VLS_components.Loader, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
else {
    if (__VLS_ctx.register) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            type: "submit",
            ...{ class: "button is-primary" },
            ...{ class: ({ 'is-loading': __VLS_ctx.loading }) },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            type: "submit",
            ...{ class: "button is-primary" },
            ...{ class: ({ 'is-loading': __VLS_ctx.loading }) },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['is-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['is-justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['box']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['is-3']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['has-icons-left']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['is-small']} */ ;
/** @type {__VLS_StyleScopedClasses['is-left']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-envelope']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['is-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['is-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
var __VLS_dollars;
let __VLS_self;
