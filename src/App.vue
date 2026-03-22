<template>
  <div id="app">
    <!-- O router-view é o ponto de montagem dinâmico das rotas -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Estilos globais básicos da aplicação */
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
