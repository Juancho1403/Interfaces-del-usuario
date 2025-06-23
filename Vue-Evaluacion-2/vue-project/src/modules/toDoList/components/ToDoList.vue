<script setup>
import { ref } from 'vue';

const tasks = ref([]);
const newTask = ref('');

const addTask = () => {
    tasks.value.push(newTask.value);
    newTask.value = '';
}

const removeTask = (index) => {
    tasks.value.splice(index, 1);
}
</script>

<template>
    <div>
        <h2>To Do List</h2>
        <input type="text" v-model="newTask" @keyup.enter="addTask" name="" id="">
        <ul>
            <li v-for="(task, i) in tasks" :key="i">
                {{ task }}
                <button @click="removeTask(i)">remove</button>
            </li>
        </ul>
    </div>
</template>

<style>

</style>