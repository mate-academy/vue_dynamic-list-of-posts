<script>
export default {
  name: 'Loader',
  props: {
    centered: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: (value) => ['small', 'medium', 'large'].includes(value),
    },
  },
};
</script>

<template>
  <div :class="['lds-ring', size, { centered }]">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style scoped>
.lds-ring {
  display: inline-block;
  position: relative;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  border-style: solid;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #c0c0c0 transparent transparent transparent;
}

/* Розміри: small, medium, large */
.lds-ring.small {
  width: 40px;
  height: 40px;
}
.lds-ring.small div {
  width: 24px;
  height: 24px;
  margin: 8px;
  border-width: 4px;
}

.lds-ring.medium {
  width: 80px;
  height: 80px;
}
.lds-ring.medium div {
  width: 64px;
  height: 64px;
  margin: 8px;
  border-width: 8px;
}

.lds-ring.large {
  width: 120px;
  height: 120px;
}
.lds-ring.large div {
  width: 96px;
  height: 96px;
  margin: 12px;
  border-width: 12px;
}

/* Анімація */
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Центрування */
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
