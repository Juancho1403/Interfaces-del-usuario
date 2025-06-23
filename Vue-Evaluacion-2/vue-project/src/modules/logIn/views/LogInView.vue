<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { schema } from '../schemas/validateSchema';
import { useLoginStore } from '../stores/loginStrore';
import { ref } from 'vue';

const loginStore = useLoginStore();

const username = ref('');
const email = ref('');
const password = ref('');

const onSubmit = () => {
    loginStore.saveUser(username.value, email.value, password.value);
    console.log('Form submitted');
};
</script>

<template>
    <div>
        <h2>Log In Form</h2>
        <Form :validation-schema="schema" @submit="onSubmit">
            <div class="form">
                <label for="username">Username</label>
                <Field type="text" name="username" id="username" placeholder="Username" v-model="username"/>
                <ErrorMessage name="username"/>
            </div>
            <div class="form">
                <label for="email">Email</label>
                <Field type="email" name="email" id="email" placeholder="Email" v-model="email"/>
                <ErrorMessage name="email"/>
            </div>
            <div class="form">
                <label for="password">Password</label>
                <Field type="password" name="password" id="password" placeholder="Password" v-model="password"/>
                <ErrorMessage name="password"/>
            </div>
            <div class="form">
                <button type="submit">Log In</button>
            </div>
        </Form>
    </div>
</template>

<style scoped>
    .form {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input {
        width: 30%;
        padding: 8px;
        box-sizing: border-box;
    }

    button {
        padding: 10px 15px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>