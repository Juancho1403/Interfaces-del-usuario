<script setup>
import { useLoginStore } from '@/modules/logIn/stores/loginStrore';
import { ref, watch } from 'vue';

const loginStore = useLoginStore();

const username = ref(loginStore.username);
const email = ref(loginStore.email);

watch(() => loginStore.username, (newValue) => {
    localusername.value = newValue;
})

watch(() => loginStore.email, (newValue) => {
    email.value = newValue;
});
</script>

<template>
    <div class="sidebar">
        <h2>Welcome</h2>
        <h3>Username: {{ username }}</h3>
        <h3>Email: {{ email }}</h3>
        <ul>
            <li>
                <router-link to="/counter">Counter</router-link>
            </li>
            <li>
                <router-link to="/to-do-list">To Do List</router-link>
            </li>
            <li>
                <router-link to="/login">Log In</router-link>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .sidebar {
        width: 200px;
        background-color: #f0f0f0;
        padding: 20px;
    }
</style>