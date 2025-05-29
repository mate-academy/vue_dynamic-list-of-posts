<script setup>

const emit = defineEmits(['update:modelValue']);

const {fieldName, type, modelValue, errorMessage} = defineProps({
	fieldName: String,
	type: String,
	modelValue: String,
	errorMessage: String
})
</script>

<template>
	<div class="field" data-cy="NameField">
		<label class="label" :for="`${type}-author-name-${fieldName}`">
			{{ fieldName }}
		</label>
		<div class="control has-icons-left has-icons-right">
			<input
				type="text"
				:name="fieldName"
				:id="`${type}-author-name-${fieldName}`"
				:placeholder="type === 'post' ? 'Enter title' : `Enter ${fieldName}`"
				class="input"
				:class="{'is-danger': errorMessage}"
				:value="modelValue"
				@input="emit('update:modelValue', $event.target.value)"
			/>
			<span class="icon is-small is-left">
				<i class="fa-solid fa-envelope" v-if="fieldName === 'email'"></i>
				<i class="fas fa-user" v-else></i>
			</span>

			<span
				class="icon is-small is-right"
				:class="{'has-text-danger': errorMessage, 'is-hidden' : !errorMessage}"

				data-cy="ErrorIcon"
			>
				<i class="fas fa-exclamation-triangle"></i>
			</span>
		</div>

		<p v-if="errorMessage" class="help is-danger" data-cy="ErrorMessage">{{ errorMessage }}</p>
	</div>
</template>