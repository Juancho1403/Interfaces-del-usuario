<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card p-4">
          <h2 class="mb-4 text-center">Mi Perfil</h2>
          <div v-if="user">
            <div class="row">
              <div class="col-md-6"><strong>Nombre:</strong> {{ user.firstName }}</div>
              <div class="col-md-6"><strong>Apellido:</strong> {{ user.lastName }}</div>
            </div>
            <div class="row">
              <div class="col-md-4"><strong>Edad:</strong> {{ user.age }}</div>
              <div class="col-md-4"><strong>Género:</strong> {{ user.gender }}</div>
              <div class="col-md-4"><strong>Username:</strong> {{ user.username }}</div>
            </div>
            <div class="row">
              <div class="col-md-6"><strong>Email:</strong> {{ user.email }}</div>
              <div class="col-md-6"><strong>Teléfono:</strong> {{ user.phone }}</div>
            </div>
            <div class="row">
              <div class="col-md-6"><strong>Universidad:</strong> {{ user.university }}</div>
              <div class="col-md-6"><strong>Empresa:</strong> {{ user.company_name }}</div>
            </div>
            <div class="row">
              <div class="col-md-6"><strong>Cargo:</strong> {{ user.company_title }}</div>
              <div class="col-md-6"><strong>Departamento:</strong> {{ user.company_department }}</div>
            </div>
            <div class="row">
              <div class="col-md-6"><strong>Dirección:</strong> {{ user.address_address }}</div>
              <div class="col-md-6"><strong>Ciudad:</strong> {{ user.address_city }}</div>
            </div>
            <div class="row">
              <div class="col-md-6"><strong>Estado:</strong> {{ user.address_state }}</div>
              <div class="col-md-6"><strong>Código Postal:</strong> {{ user.address_postalCode }}</div>
            </div>
            <div class="row">
              <div class="col-md-6"><strong>País:</strong> {{ user.address_country }}</div>
              <div class="col-md-6"><strong>Grupo Sanguíneo:</strong> {{ user.bloodGroup }}</div>
            </div>
          </div>
          <div v-else class="text-center">Cargando...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'UserProfile',
  data() {
    return { user: null };
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/usuarios/profile', { headers: { Authorization: `Bearer ${token}` } });
      this.user = res.data;
    } catch (e) {
      alert('Error al cargar perfil');
    }
  }
};
</script> 