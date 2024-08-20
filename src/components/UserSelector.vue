<script>
export default {
  props: {
    users: Object,
    selectedUser: Object,
  },
  data () {
    return {
      isActiveDropDown: false,
    }
  },
  emits: ['changeSelectedUser'],
  methods: {
    changedSelectedUser(user) {
      this.isActiveDropDown = false;
      this.$emit('changeSelectedUser', user);
    }
  }
}
</script>


<template>
      <div
      class="dropdown"
      :class="{'is-active': isActiveDropDown }"
    >
      <div
        class="dropdown-trigger"
        ref={dropdownRef}
        tabIndex={0}
        @blur="isActiveDropDown = false"
      >
        <button
          type="button"
          class="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          @click="isActiveDropDown = true"
        >
          <span>{{selectedUser ? selectedUser.name : 'Choose a user'}}</span>

          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a
            v-for="user of users"
            :key="user.id"
            :href="`#user-${user.id}`"
            class="dropdown-item"
            :class="{
              'is-active': user.id === selectedUser?.id,
            }"
            @click="changedSelectedUser(user)"
            >
              {{user.name}}
            </a>
        </div>
      </div>
    </div>
</template>