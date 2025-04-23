<script>
export default {
  name: "NeedToRegister",
  data() {
    return {
      name: "",
    };
  },
};
</script>

<template>
  <div class="field">
    <label class="label" for="user-name"> Your Name </label>

    <div class="control has-icons-left">
      <input
        v-model="name"
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        required
        minlength="4"
      />
      <!--<div class="body">
        <slot :x="name">{{ name }}</slot>
      </div>-->
      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>
    </div>

    <p v-if="!name" class="help is-danger">Start type Your Name please!</p>
  </div>
</template>

<style></style>
<!-- ParentComponent.vue 
<template>
  <div>
    <ChildComponent @data-sent="handleData" />
    <p>{{ receivedData.message }}</p>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent
  },
  data() {
    return {
      receivedData: {}
    };
  },
  methods: {
    handleData(data) {
      this.receivedData = data;
    }
  }
}
</script>
 ChildComponent.vue 
<template>
  <button @click="sendData">Send Data</button>
</template>

<script>
export default {
  methods: {
    sendData() {
      const data = { message: 'Hello from Child' };
      this.$emit('data-sent', data);
    }
  }
}
</script> -->
