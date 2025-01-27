import { createWebHashHistory, createRouter } from "vue-router";

import Login from "./components/Login.vue";
import Home from "./components/Home.vue";
// import Header from "./components/Header.vue";

const routes = [
	{ path: "/", component: Home },
	{ path: "/login", component: Login },
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
