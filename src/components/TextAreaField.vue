<script setup>
	const emit = defineEmits(['update:modelValue']);

const {fieldName, type, modelValue, errorMessage} = defineProps({
	type: String,
	fieldName: String,
	modelValue: String,
	errorMessage: String
})

</script>

<template>
	<div class="field" data-cy="BodyField">
		<label 
			class="label" 
			:for="`${type}-${fieldName}`"
		> 
			Write {{type}} {{ fieldName }} 
		</label>
		<div class="control">
			<textarea
				:id="`${type}-${fieldName}`"
				:name="fieldName"
				:placeholder="`${type} ${fieldName}`"
				class="textarea"
				:class="{'is-danger': errorMessage}"
				:value="modelValue"
				@input="emit('update:modelValue', $event.target.value)"
			></textarea>
		</div>

		<p v-if="errorMessage" class="help is-danger" data-cy="ErrorMessage">{{ errorMessage }}</p>
	</div>
</template>