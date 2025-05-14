import { ref } from 'vue';

export function useFetch(fetchFunc, defaultValue) {
  const data = ref(defaultValue);
  const isLoading = ref(false);
  const errorMessage = ref('');

  const execute = async () => {
    if (!fetchFunc) {
      errorMessage.value = 'No fetch function provided';
      return;
    }

    isLoading.value = true;

    try {
      const result = await fetchFunc();
      data.value = result;
    } catch (err) {
      errorMessage.value =
        err instanceof Error ? err.message : 'An unexpected error occurred';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data,
    isLoading,
    errorMessage,
    execute,
  };
}
