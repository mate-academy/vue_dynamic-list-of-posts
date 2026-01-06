<template>
    <div class="tile is-parent">
        <div class="tile is-child box is-success">
            <div class="block">
                <table class="table">
                    <thead>
                        <tr class="has-background-link-light">
                            <th>ID</th>
                            <th>Title</th>
                            <th class="has-text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.title }}</td>
                            <td class="has-text-right is-vcentered">
                                <button @click="openPost" type="button" class="button is-link">Open</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <h1 v-if="isActiveOpen">FOI</h1>
</template>

<script setup>
import { ref } from 'vue';

const isActiveOpen = ref(false);

function openPost() {
    if (isActiveOpen.value === false) isActiveOpen.value = true;
    else isActiveOpen.value = false;
}

defineProps({
    list: {
        type: Array,
        required: true,
    }
})
</script>

<style scoped>
.block {
    width: 700px;
    margin-bottom: 40px;
}

.table {
    width: 100%;
    table-layout: fixed;
}

.has-background-link-light {
    background-color: rgb(239, 241, 250);
    width: 100%;
    color: rgb(54, 55, 57);
    text-align: left;
}

th:nth-child(1),
td:nth-child(1) {
  width: 8%;
}


th:nth-child(3),
td:nth-child(3) {
  width: 80px;
  text-align: center;
}

td:nth-child(3) button {
    width: 70px;
    height: 30px;
    background-color: rgb(239, 241, 250);
    border: none;
    border-radius: 5px;
    color: rgb(64, 106, 201);
    font-size: 15px;
    cursor: pointer;
}
</style>