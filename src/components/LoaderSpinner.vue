<template>
  <div class="Loader" data-cy="Loader">
    <div class="Loader__content" />
  </div>
</template>

<style>
.Loader {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.Loader__content {
  border-radius: 50%;
  width: 2em;
  height: 2em;
  margin: 1em auto;
  border: 0.3em solid #a7a4a4;
  border-left-color: #ebe6e6;
  animation: load8 1.2s infinite linear;
}

@keyframes load8 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
