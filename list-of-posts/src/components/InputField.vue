<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
	data: {
		type: String,
		required: true,
	},
	placeholder: {
		type: String,
		required: false,
	},
	name: {
		type: String,
		required: false,
	},
});

const emit = defineEmits(["update:data"]);

const updateValue = (event) => {
	emit("update:data", event.target.value);
};

// Computed property for placeholder
const placeholderValue = computed(() => props.placeholder || "Title");
const nameValue = computed(() => props.name || "Title");
</script>

<template>
	<div class="field" data-cy="NameField">
		<label class="label" :for="`comment-author-name-${data}`">{{ nameValue }}</label>
		<div class="control has-icons-left has-icons-right">
			<input
				type="text"
				:name="nameValue"
				:id="`comment-author-name-${data}`"
				:placeholder="placeholderValue"
				class="input"
				:value="data"
				@input="updateValue"
			/>
			<!--has-text-danger class if error-->
			<span class="icon is-small is-left">
				<i class="fas fa-user"></i>
			</span>

			<span class="icon is-small is-right" data-cy="ErrorIcon">
				<!--has-text-danger class if error-->
				<i class="fas fa-exclamation-triangle"></i>
			</span>
		</div>

		<!-- <p class="help is-danger" data-cy="ErrorMessage">error text</p> -->
	</div>
</template>
