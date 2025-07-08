<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4">
          <h2 class="mb-4 text-center">Iniciar Sesión</h2>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="email" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" v-model="password" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Entrar</button>
          </form>
          <router-link to="/register" class="btn btn-link w-100 mt-3">¿No tienes cuenta? Regístrate</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { setIsAdmin } from '../isAdmin';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await axios.post('http://localhost:3001/api/usuarios/login', { email: this.email, password: this.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('userId', res.data.id);
        setIsAdmin(res.data.role === 'admin');
        console.log('is_admin actualizado:', res.data.role === 'admin');
        console.log('Valor en localStorage:', localStorage.getItem('role'));
        this.$router.push('/');
      } catch (e) {
        alert(e.response?.data?.message || 'Error al iniciar sesión');
      }
    }
  }
};
</script>

<style scoped>
.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style> 