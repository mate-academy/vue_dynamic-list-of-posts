// InputField Component
const InputField = {
  name: 'InputField',
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
    icon: {
      type: String,
      default: 'fa-user',
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
  template: `
    <div class="field" :data-cy="name + 'Field'">
      <label class="label" :for="name">
        {{ label }}
      </label>
      <div class="control has-icons-left has-icons-right">
        <input
          :type="type"
          :name="name"
          :id="name"
          :placeholder="placeholder"
          :class="['input', { 'is-danger': error }]"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <span class="icon is-small is-left">
          <i :class="['fas', icon]"></i>
        </span>

        <span
          v-if="error"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
        {{ error }}
      </p>
    </div>
  `
};
