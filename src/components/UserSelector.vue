<template>
  <div class="dropdown" :class="{ 'is-active': isOpen }" data-cy="UserSelector" ref="dropdownRef">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="toggleDropdown" data-cy="UserSelectorToggle">
        <span>{{ selectedUser ? selectedUser.name : 'Choose a user' }}</span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a
          v-for="user in users"
          :key="user.id"
          href="#"
          class="dropdown-item"
          :class="{ 'is-active': selectedUser?.id === user.id }"
          @click.prevent="selectUser(user)"
          data-cy="UserSelectorItem"
        >
          {{ user.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'UserSelector',
  props: ['users', 'selectedUser'],
  emits: ['userSelect'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const dropdownRef = ref(null);

    const toggleDropdown = () => { isOpen.value = !isOpen.value; };
    const selectUser = (user) => { emit('userSelect', user); isOpen.value = false; };

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    onMounted(() => document.addEventListener('mousedown', handleClickOutside));
    onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside));

    return { isOpen, dropdownRef, toggleDropdown, selectUser };
  }
};
</script>
