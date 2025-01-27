<!-- <script setup>
import textAreaField from "./textAreaField.vue";
import InputField from "./InputField.vue";
import { ref, defineEmits, watch } from "vue";

const emit = defineEmits(["close", "save"]);

const inputValue = ref("");
const textAreaValue = ref("");

const test = (e) => {
	e.preventDefault();
	console.log(inputValue, textAreaValue);
};
</script>

<template>
	<div class="content">
		<form>
			<div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isOpen }">
				<div class="content">
					<h2>Create New Post</h2>
					<InputField v-model:data="inputValue" />
					<textAreaField v-model:data="textAreaValue" />
					<div class="field is-grouped">
						<div class="control">
							<button
								@submit.prevent="emit('save', [inputValue.value, textAreaValue.value])"
								type="submit"
								class="button is-link"
							>
								Save
							</button>
						</div>
						<div class="control">
							<button @click.prevent="emit('close')" type="reset" class="button is-link is-light">
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</template> -->

<!-- <script setup>
import textAreaField from "./textAreaField.vue";
import InputField from "./InputField.vue";
import { ref, defineEmits, defineProps, watch } from "vue";

const props = defineProps({
	mode: String, // "add" or "edit"
	post: Object, // Post object for editing
});
const emit = defineEmits(["close", "save"]);

// Input values
const inputValue = ref("");
const textAreaValue = ref("");

watch(
	() => props.post,
	(oldPost, newPost) => {
		if (props.mode === "edit" && newPost) {
			inputValue.value = newPost.title || "";
			textAreaValue.value = newPost.body || "";
		}
	},
	{ immediate: true }
);
</script>

<template>
	<div class="content">
		<form @submit.prevent="emit('save', { title: inputValue, body: textAreaValue })">
			<div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isOpen }">
				<div class="content">
					<h2>{{ mode === "edit" ? "Edit Post" : "Create New Post" }}</h2>
					<InputField v-model:data="inputValue" />
					<textAreaField v-model:data="textAreaValue" />
					<div class="field is-grouped">
						<div class="control">
							<button type="submit" class="button is-link">
								{{ mode === "edit" ? "Save Changes" : "Save" }}
							</button>
						</div>
						<div class="control">
							<button @click.prevent="emit('close')" type="button" class="button is-link is-light">
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</template> -->

<script setup>
import textAreaField from "./textAreaField.vue";
import InputField from "./InputField.vue";
import { ref, defineEmits, defineProps, watch } from "vue";

const prop = defineProps(["post"]);
const inputValue = ref("");
const textAreaValue = ref("");

watch(
	() => prop.post,
	(newPost) => {
		if (newPost !== null) {
			inputValue.value = newPost.title || "";
			textAreaValue.value = newPost.body || "";
		} else {
			inputValue.value = "";
			textAreaValue.value = "";
		}
	},
	{ immediate: true }
);

const emit = defineEmits(["close", "create"]);
</script>

<template>
	<div class="content">
		<form @submit.prevent="emit('create', prop.post?.id, inputValue, textAreaValue, prop.post)">
			<div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isOpen }">
				<div class="content">
					<h2>
						{{ prop.post !== null ? "Edit Post" : "Create New Post" }}
					</h2>
					<InputField v-model:data="inputValue" />
					<textAreaField v-model:data="textAreaValue" />
					<div class="field is-grouped">
						<div class="control">
							<button type="submit" class="button is-link">
								{{ prop.post !== null ? "Save" : "Create" }}
							</button>
						</div>
						<div class="control">
							<button @click.prevent="emit('close')" type="button" class="button is-link is-light">
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>
