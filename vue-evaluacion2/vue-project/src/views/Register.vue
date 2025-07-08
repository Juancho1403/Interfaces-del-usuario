<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4">
          <h2 class="mb-4 text-center">Registro</h2>
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="email" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" v-model="password" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Confirmar Contraseña</label>
              <input type="password" v-model="confirmPassword" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-success w-100">Registrarse</button>
          </form>
          <router-link to="/login" class="btn btn-link w-100 mt-3">¿Ya tienes cuenta? Inicia sesión</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    async handleRegister() {
      try {
        await axios.post('http://localhost:3001/api/usuarios/register', {
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword
        });
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.$router.push('/login');
      } catch (e) {
        alert(JSON.stringify(e.response?.data || e));
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