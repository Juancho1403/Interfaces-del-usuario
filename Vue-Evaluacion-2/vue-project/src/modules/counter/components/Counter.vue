<script setup>
import { ref } from 'vue';

const counter =ref(0);

const increment = () => {
  counter.value++;
}
const decrement = () => {
  counter.value--;
}
</script>

<template>
<h1>Hello Vue</h1>
<p>{{ counter }}</p>
<button @click="increment">Increment</button>
<button @click="decrement">Decrement</button>
</template>

<style scoped>
p {
  color: blue;
}
</style>
