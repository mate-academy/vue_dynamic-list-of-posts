<script setup>
import { useRouter } from "vue-router";
import { getUser, removeUser } from "@/utils/user.js";

const router = useRouter();

const user = getUser() || {}; // Fallback to an empty object if getUser() returns null
const { name } = user;

// Redirect to login if the user is not found
if (!name) {
	router.push("/login");
}

const logOut = () => {
	removeUser();
	router.push("/login");
};
</script>

<template>
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-item">
			<h2 class="is-size-4">Vue List Of Posts</h2>
		</div>
		<div class="navbar-end">
			<div class="navbar-item">
				<div class="buttons">
					<div class="mr-5 mb-2">
						<p>User: {{ name }}</p>
					</div>

					<a class="button is-light" @click="logOut"> Logout </a>
				</div>
			</div>
		</div>
	</nav>
</template>

<!-- <script setup>
import { useRouter } from "vue-router";
import { getUser, removeUser } from "@/utils/user.js";

const router = useRouter();
const logOut = () => {
	removeUser();
	router.push("/login");
};
</script>

<template>
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-item">
			<h2 class="is-size-4">Vue List Of Posts</h2>
		</div>
		<div class="navbar-end">
			<div class="navbar-item">
				<div class="buttons">
					<div class="mr-5 mb-2">
						<p>User: {{ getUser().name }}</p>
					</div>

					<a class="button is-light" @click="logOut"> Logout </a>
				</div>
			</div>
		</div>
	</nav>
</template> -->
