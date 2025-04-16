import Header from './component/header.vue';
import login from './component/login.vue';
import postsList from './component/postsList.vue';
export default (await import('vue')).defineComponent({
    components: {
        Header,
        login,
        postsList,
    },
    data() {
        return {
            user: {},
            loading: false,
            loginPage: true,
        };
    },
    methods: {
        addUser($event) {
            this.user = { ...$event[0] };
            this.loginPage = false;
            localStorage.setItem('user', JSON.stringify(this.user));
        },
        Logout() {
            this.user = {};
            this.loginPage = true;
            localStorage.removeItem('user');
        },
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user')) || {};
        if (this.user.id) {
            this.loginPage = false;
        }
    },
    watch: {
        user() {
            console.log(this.user);
        },
    },
});
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Header,
    login,
    postsList,
};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.loginPage) {
    const __VLS_0 = {}.login;
    /** @type {[typeof __VLS_components.Login, typeof __VLS_components.login, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onAddUser': {} },
        user: (__VLS_ctx.user),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onAddUser': {} },
        user: (__VLS_ctx.user),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onAddUser: (__VLS_ctx.addUser)
    };
    var __VLS_8 = {};
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    if (__VLS_ctx.user) {
        const __VLS_9 = {}.Header;
        /** @type {[typeof __VLS_components.Header, ]} */ ;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
            ...{ 'onLogout': {} },
            user: (__VLS_ctx.user),
        }));
        const __VLS_11 = __VLS_10({
            ...{ 'onLogout': {} },
            user: (__VLS_ctx.user),
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        let __VLS_13;
        let __VLS_14;
        let __VLS_15;
        const __VLS_16 = {
            onLogout: (__VLS_ctx.Logout)
        };
        var __VLS_12;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
        ...{ class: "section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tile is-ancestor" },
    });
    if (__VLS_ctx.user) {
        const __VLS_17 = {}.postsList;
        /** @type {[typeof __VLS_components.PostsList, typeof __VLS_components.postsList, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            user: (__VLS_ctx.user),
        }));
        const __VLS_19 = __VLS_18({
            user: (__VLS_ctx.user),
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    }
}
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['tile']} */ ;
/** @type {__VLS_StyleScopedClasses['is-ancestor']} */ ;
var __VLS_dollars;
let __VLS_self;
