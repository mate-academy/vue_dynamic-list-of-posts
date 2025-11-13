// TextAreaField Component
const TextAreaField = {
  name: 'TextAreaField',
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  template: `
    <div class="field" data-cy="BodyField">
      <label class="label" :for="name">
        {{ label }}
      </label>
      <div class="control">
        <textarea
          :id="name"
          :name="name"
          :placeholder="placeholder"
          :class="['textarea', { 'is-danger': error }]"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        ></textarea>
      </div>

      <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
        {{ error }}
      </p>
    </div>
  `
};
