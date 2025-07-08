<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card p-4">
          <h2 class="mb-4 text-center">Completar Perfil</h2>
          <form @submit.prevent="handleSubmit">
            <!-- Aquí van los campos del dummyjson, puedes usar v-model para cada uno -->
            <div class="form-row">
              <div class="form-group col-md-6">
                <label>Nombre</label>
                <input type="text" v-model="form.firstName" class="form-control" required />
              </div>
              <div class="form-group col-md-6">
                <label>Apellido</label>
                <input type="text" v-model="form.lastName" class="form-control" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-4">
                <label>Edad</label>
                <input type="number" v-model="form.age" class="form-control" required />
              </div>
              <div class="form-group col-md-4">
                <label>Género</label>
                <select v-model="form.gender" class="form-control" required>
                  <option value="">Seleccionar</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
              <div class="form-group col-md-4">
                <label>Fecha de Nacimiento</label>
                <input type="date" v-model="form.birthDate" class="form-control" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label>Apellido de Soltera</label>
                <input type="text" v-model="form.maidenName" class="form-control" />
              </div>
              <div class="form-group col-md-6">
                <label>Username</label>
                <input type="text" v-model="form.username" class="form-control" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label>Teléfono</label>
                <input type="text" v-model="form.phone" class="form-control" required />
              </div>
              <div class="form-group col-md-6">
                <label>Universidad</label>
                <input type="text" v-model="form.university" class="form-control" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label>Empresa</label>
                <input type="text" v-model="form.company_name" class="form-control" />
              </div>
              <div class="form-group col-md-6">
                <label>Cargo</label>
                <input type="text" v-model="form.company_title" class="form-control" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label>Departamento</label>
                <input type="text" v-model="form.company_department" class="form-control" />
              </div>
              <div class="form-group col-md-6">
                <label>Grupo Sanguíneo</label>
                <input type="text" v-model="form.bloodGroup" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <input type="text" v-model="form.address_address" class="form-control" required />
            </div>
            <div class="form-row">
              <div class="form-group col-md-4">
                <label>Ciudad</label>
                <input type="text" v-model="form.address_city" class="form-control" required />
              </div>
              <div class="form-group col-md-4">
                <label>Estado</label>
                <input type="text" v-model="form.address_state" class="form-control" required />
              </div>
              <div class="form-group col-md-4">
                <label>Código Postal</label>
                <input type="text" v-model="form.address_postalCode" class="form-control" required />
              </div>
            </div>
            <div class="form-group">
              <label>País</label>
              <input type="text" v-model="form.address_country" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-success w-100">Guardar Perfil</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      form: {
        firstName: '', lastName: '', age: '', gender: '', birthDate: '', maidenName: '', username: '', phone: '', university: '', company_name: '', company_title: '', company_department: '', bloodGroup: '', address_address: '', address_city: '', address_state: '', address_postalCode: '', address_country: ''
      }
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:3001/api/usuarios/profile', this.form, { headers: { Authorization: `Bearer ${token}` } });
        alert('Perfil actualizado');
        this.$router.push('/perfil');
      } catch (e) {
        alert('Error al guardar perfil');
      }
    }
  }
};
</script> 