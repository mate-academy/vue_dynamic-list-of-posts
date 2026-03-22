import { reactive } from 'vue';

// Criamos um estado reativo simples para compartilhar o usuário
// logado por toda a aplicação, evitando o uso de bibliotecas pesadas (Pinia/Vuex)
export const userStore = reactive({
  user: null,
});

// Define o usuário no estado (usado no login/registro)
export function setUser(user) {
  userStore.user = user;
}

// Retorna o usuário logado
export function getUser() {
  return userStore.user;
}

// Limpa o usuário do estado (usado no logout)
export function clearUser() {
  userStore.user = null;
}
