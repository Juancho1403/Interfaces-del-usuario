import { defineStore } from 'pinia';
import { ref, computed } from "vue";

export const useLoginStore = defineStore('login',()=>{
    const username = ref('');
    const email = ref('');
    const password = ref('');

    const saveUser = (usernameFrom, emailForm, passwordForm) => {
        username.value = usernameFrom;
        email.value = emailForm;
        password.value = passwordForm;
    }
    return { username: username, email: email, password: password, saveUser }
})