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

const placeholderValue = computed(() => props.placeholder || "Post body");
const nameValue = computed(() => props.name || "Write post body");
</script>

<template>
	<div class="field" data-cy="BodyField">
		<label class="label" :for="`comment-${data}`">{{ nameValue }}</label>
		<div class="control">
			<textarea
				:id="`comment-${data}`"
				name="name"
				:placeholder="placeholderValue"
				class="textarea"
				@input="updateValue"
				:value="data"
			></textarea>
			<!--is-danger class if error-->
		</div>

		<!-- <p class="help" data-cy="ErrorMessage">error text</p> -->
		<!--is-danger class if error-->
	</div>
</template>
