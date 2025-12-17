const StorageService = {
    // adicionar OU alterar item Ass. Isaque
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // procurar item Ass. Isaque
    get(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },

    // excluir item Ass. Isaque
    remove(key) {
        localStorage.removeItem(key);
    }
};

export default StorageService;
