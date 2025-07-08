<template>
  <div class="container py-5">
    <div v-if="isAdmin">
      <div class="row justify-content-center">
        <div class="col-md-12">
          <div class="card p-4">
            <h2 class="mb-4 text-center">Usuarios (Admin)</h2>
            <table class="table table-bordered" id="datatable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Username</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.firstName }}</td>
                  <td>{{ user.lastName }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <button class="btn btn-info btn-sm mr-2" @click="verDetalles(user)">Ver</button>
                    <button class="btn btn-danger btn-sm" @click="deshabilitarUsuario(user.id)">Deshabilitar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-danger text-center mt-5">
      No tienes permisos para acceder a esta vista.
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { is_admin } from '../isAdmin';
export default {
  data() {
    return { users: [] };
  },
  computed: {
    isAdmin() {
      return is_admin.value;
    }
  },
  async mounted() {
    await this.fetchUsuarios();
  },
  methods: {
    async fetchUsuarios() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/usuarios/admin', { headers: { Authorization: `Bearer ${token}` } });
        this.users = res.data;
      } catch (e) {
        alert('Error al cargar usuarios');
      }
    },
    verDetalles(user) {
      alert(JSON.stringify(user, null, 2)); // Puedes mejorar esto con un modal bonito
    },
    async deshabilitarUsuario(id) {
      if (!confirm('¿Deshabilitar este usuario?')) return;
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:3001/api/usuarios/${id}/disable`, {}, { headers: { Authorization: `Bearer ${token}` } });
        alert('Usuario deshabilitado');
        this.fetchUsuarios();
      } catch (e) {
        alert('Error al deshabilitar usuario');
      }
    }
  }
};
</script> 