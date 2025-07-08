<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container-fluid py-5">
    <!-- Sistema de notificaciones -->
    <div class="notifications-container">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="notification"
        :class="notification.type"
      >
        <div class="notification-content">
          <i :class="getNotificationIcon(notification.type)"></i>
          <span>{{ notification.message }}</span>
        </div>
        <button @click="removeNotification(notification.id)" class="notification-close">
          <i class="fa fa-times"></i>
        </button>
      </div>
    </div>
    
    <div class="container pt-5">
      <div class="row">
        <div class="col-lg-12">
          <div class="bg-white p-4 p-lg-5 shadow">
            <div class="d-flex align-items-center mb-4">
              <img src="@/assets/logo-usuarios.svg" alt="Logo Gestión de Usuarios" style="height: 60px; margin-right: 16px;">
              <h2 class="text-primary mb-0">Gestión de Usuarios</h2>
            </div>
            
            <!-- Tabs de navegación -->
            <ul class="nav nav-tabs" id="userTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{active: activeTab === 'register'}" @click="activeTab = 'register'" id="register-tab" type="button" role="tab">
                  <i class="fa fa-user-plus mr-2"></i>Registro
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" :class="{active: activeTab === 'list'}" @click="activeTab = 'list'" id="list-tab" type="button" role="tab">
                  <i class="fa fa-list mr-2"></i>Lista de Usuarios
                </button>
              </li>
            </ul>

            <!-- Contenido de los tabsss -->
            <div class="tab-content mt-4" id="userTabsContent">
              <!-- Spinner de carga -->
              <div v-if="isLoading" class="loading-overlay">
                <div class="spinner-container">
                  <div class="spinner"></div>
                  <p class="mt-3 text-white">Cargando...</p>
                </div>
              </div>
              
              <!-- Tab de Registro/Edición/Ver -->
              <div class="tab-pane fade" :class="{ 'show active': activeTab === 'register' }" id="register" role="tabpanel">
                <div class="wizard-container">
                  <!-- Indicadores de progreso -->
                  <div class="wizard-steps mb-4">
                    <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
                      <div class="step-number">1</div>
                      <div class="step-title">Información Personal</div>
                    </div>
                    <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
                      <div class="step-number">2</div>
                      <div class="step-title">Información de Contacto</div>
                    </div>
                    <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
                      <div class="step-number">3</div>
                      <div class="step-title">Información Profesional</div>
                    </div>
                  </div>

                  <!-- Formulario Wizard -->
                  <form @submit.prevent="handleSubmit" class="wizard-form">
                    <!-- Indicador de modo edición -->
                    <div v-if="isEditMode" class="alert alert-info mb-4">
                      <i class="fa fa-edit mr-2"></i>
                      <strong>Modo Edición:</strong> Editando usuario ID: {{ editUserId }}
                    </div>
                    
                    <!-- Paso 1: Información Personal -->
                    <div v-if="currentStep === 1" class="wizard-step">
                      <h4 class="mb-4">Información Personal</h4>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="firstName">Nombre *</label>
                            <input 
                              type="text" 
                              id="firstName" 
                              v-model="formData.firstName" 
                              @input="validateLettersOnly($event, 'firstName')"
                              @keydown="preventNumbers($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                            >
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="lastName">Apellido *</label>
                            <input 
                              type="text" 
                              id="lastName" 
                              v-model="formData.lastName" 
                              @input="validateLettersOnly($event, 'lastName')"
                              @keydown="preventNumbers($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group">
                            <label for="age">Edad *</label>
                            <input 
                              type="number" 
                              id="age" 
                              v-model="formData.age" 
                              @input="validateAge($event)"
                              @keydown="preventLetters($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                              min="1"
                              max="120"
                            >
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label>Género *</label>
                            <div class="mt-2">
                              <div class="form-check form-check-inline">
                                <input 
                                  class="form-check-input" 
                                  type="radio" 
                                  id="male" 
                                  value="male" 
                                  v-model="formData.gender"
                                  :disabled="isViewMode"
                                  required
                                >
                                <label class="form-check-label" for="male">Masculino</label>
                              </div>
                              <div class="form-check form-check-inline">
                                <input 
                                  class="form-check-input" 
                                  type="radio" 
                                  id="female" 
                                  value="female" 
                                  v-model="formData.gender"
                                  :disabled="isViewMode"
                                  required
                                >
                                <label class="form-check-label" for="female">Femenino</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label for="birthDate">Fecha de Nacimiento *</label>
                            <input
                              type="text"
                              id="birthDate"
                              v-model="formData.birthDate"
                              @input="autoFormatBirthDate"
                              @keydown="handleDateKeydown"
                              class="form-control"
                              :disabled="isViewMode"
                              required
                              placeholder="dd/mm/aaaa"
                              maxlength="10"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="maidenName">Apellido de Soltera</label>
                            <input 
                              type="text" 
                              id="maidenName" 
                              v-model="formData.maidenName" 
                              @input="validateLettersOnly($event, 'maidenName')"
                              @keydown="preventNumbers($event)"
                              class="form-control"
                              :disabled="isViewMode"
                            >
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="username">Nombre de Usuario *</label>
                            <input 
                              type="text" 
                              id="username" 
                              v-model="formData.username" 
                              @input="validateUsername($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Paso 2: Información de Contacto -->
                    <div v-if="currentStep === 2" class="wizard-step">
                      <h4 class="mb-4">Información de Contacto</h4>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="email">Correo Electrónico *</label>
                            <input 
                              type="email" 
                              id="email" 
                              v-model="formData.email" 
                              @input="validateEmail($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                            >
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="phone">Teléfono *</label>
                            <input 
                              type="tel" 
                              id="phone" 
                              v-model="formData.phone" 
                              @input="validatePhone($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label for="address">Dirección *</label>
                            <div class="input-group">
                              <input 
                                type="text" 
                                id="address" 
                                v-model="formData.address.address" 
                                @input="validateAddress($event)"
                                class="form-control" 
                                :disabled="isViewMode"
                                required
                                placeholder="Dirección completa"
                              />
                              <div class="input-group-append">
                                <button 
                                  type="button" 
                                  class="btn btn-outline-primary" 
                                  @click="openLocationSelector"
                                  :disabled="isViewMode"
                                  title="Seleccionar ubicación en el mapa"
                                >
                                  <i class="fa fa-map-marker"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group">
                            <label for="city">Ciudad *</label>
                            <input 
                              type="text" 
                              id="city" 
                              v-model="formData.address.city" 
                              @input="validateLettersOnly($event, 'city')"
                              @keydown="preventNumbers($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                            >
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label for="state">Estado *</label>
                            <input 
                              type="text" 
                              id="state" 
                              v-model="formData.address.state" 
                              @input="validateLettersOnly($event, 'state')"
                              @keydown="preventNumbers($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                            >
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label for="postalCode">Código Postal *</label>
                            <input 
                              type="text" 
                              id="postalCode" 
                              v-model="formData.address.postalCode" 
                              @input="validateNumbersOnly($event)"
                              @keydown="preventLetters($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="country">País *</label>
                            <input 
                              type="text" 
                              id="country" 
                              v-model="formData.address.country" 
                              @input="validateLettersOnly($event, 'country')"
                              @keydown="preventNumbers($event)"
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                            >
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="password">Contraseña *</label>
                            <input 
                              type="password" 
                              id="password" 
                              v-model="formData.password" 
                              class="form-control" 
                              :disabled="isViewMode"
                              required
                              minlength="6"
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Paso 3: Información Profesional -->
                    <div v-if="currentStep === 3" class="wizard-step">
                      <h4 class="mb-4">Información Profesional</h4>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="university">Universidad</label>
                            <input 
                              type="text" 
                              id="university" 
                              v-model="formData.university" 
                              @input="validateLettersOnly($event, 'university')"
                              @keydown="preventNumbers($event)"
                              class="form-control"
                              :disabled="isViewMode"
                            >
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="role">Rol *</label>
                            <select id="role" v-model="formData.role" class="form-control" :disabled="isViewMode" required>
                              <option value="">Seleccionar rol</option>
                              <option value="user">Usuario</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="companyName">Empresa</label>
                            <input 
                              type="text" 
                              id="companyName" 
                              v-model="formData.company.name" 
                              @input="validateCompanyName($event)"
                              class="form-control"
                              :disabled="isViewMode"
                            >
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="jobTitle">Cargo</label>
                            <input 
                              type="text" 
                              id="jobTitle" 
                              v-model="formData.company.title" 
                              @input="validateLettersOnly($event, 'jobTitle')"
                              @keydown="preventNumbers($event)"
                              class="form-control"
                              :disabled="isViewMode"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="department">Departamento</label>
                            <input 
                              type="text" 
                              id="department" 
                              v-model="formData.company.department" 
                              @input="validateLettersOnly($event, 'department')"
                              @keydown="preventNumbers($event)"
                              class="form-control"
                              :disabled="isViewMode"
                            >
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="bloodGroup">Grupo Sanguíneo</label>
                            <select id="bloodGroup" v-model="formData.bloodGroup" class="form-control" :disabled="isViewMode">
                              <option value="">Seleccionar grupo</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Resumen de la información -->
                      <div class="card mt-4">
                        <div class="card-header">
                          <h5 class="mb-0">Resumen de la Información</h5>
                        </div>
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-6">
                              <p><strong>Nombre:</strong> {{ formData.firstName }} {{ formData.lastName }}</p>
                              <p><strong>Email:</strong> {{ formData.email }}</p>
                              <p><strong>Teléfono:</strong> {{ formData.phone }}</p>
                              <p><strong>Rol:</strong> {{ formData.role }}</p>
                            </div>
                            <div class="col-md-6">
                              <p><strong>Edad:</strong> {{ formData.age }} años</p>
                              <p><strong>Género:</strong> {{ formData.gender === 'male' ? 'Masculino' : 'Femenino' }}</p>
                              <p><strong>Ciudad:</strong> {{ formData.address.city }}, {{ formData.address.state }}</p>
                              <p><strong>Empresa:</strong> {{ formData.company.name || 'No especificada' }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Botones de navegación -->
                    <div class="wizard-buttons mt-4">
                      <button type="button" @click="nextStep" class="btn btn-primary" v-if="currentStep < 3">Siguiente</button>
                      <button type="submit" class="btn btn-success" v-if="currentStep === 3 && !isViewMode">{{ isEditMode ? 'Actualizar Usuario' : 'Registrar Usuario' }}</button>
                    </div>
                    <button v-if="isViewMode || isEditMode" type="button" class="btn btn-secondary mt-3 w-100" @click="resetForm">Cancelar</button>
                  </form>
                  <router-link to="/" class="btn btn-outline-dark w-100 mt-4">Volver al Home</router-link>
                </div>
              </div>

              <!-- Tab de Lista de Usuarios SOLO para admin -->
              <div v-if="isAdmin && activeTab === 'list'" class="tab-pane fade show active" id="list" role="tabpanel">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h4>Lista de Usuarios</h4>
                  <div>
                    <button class="btn btn-danger mr-2" @click="downloadPDF">
                      <i class="fa fa-file-pdf-o mr-1"></i>Descargar PDF
                    </button>
                    <button class="btn btn-success" @click="downloadExcel">
                      <i class="fa fa-file-excel-o mr-1"></i>Descargar Excel
                    </button>
                    <button class="btn btn-primary ml-2" @click="refreshUsers">
                      <i class="fa fa-refresh mr-2"></i>Actualizar
                    </button>
                  </div>
                </div>
                
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead class="thead-dark">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Edad</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.firstName }} {{ user.lastName }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.age }}</td>
                        <td>
                          <span :class="getRoleBadgeClass(user.role)">
                            {{ user.role }}
                          </span>
                        </td>
                        <td>
                          <span :class="getStatusBadgeClass(user.estado)">
                            {{ user.estado }}
                          </span>
                        </td>
                        <td class="action-buttons">
                          <button class="btn btn-sm btn-view mr-1" @click="viewUser(user)">
                            <i class="fa fa-eye"></i>
                          </button>
                          <button class="btn btn-sm btn-edit mr-1" @click="editUser(user)">
                            <i class="fa fa-edit"></i>
                          </button>
                          <button 
                            class="btn btn-sm" 
                            :class="user.estado === 'activo' ? 'btn-disable' : 'btn-enable'"
                            @click="toggleUserStatus(user)"
                          >
                            <i :class="user.estado === 'activo' ? 'fa fa-ban' : 'fa fa-check'"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <router-link to="/" class="btn btn-outline-dark w-100 mt-4">Volver al Home</router-link>
              </div>
              <div v-else-if="activeTab === 'list'" class="alert alert-danger text-center mt-5">
                No tienes permisos para ver la lista de usuarios.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal para selector de ubicación -->
  <div v-if="showLocationModal" class="modal-overlay" @click="closeLocationModal">
    <div class="modal-dialog modal-lg" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="locationModalLabel">
            <i class="fa fa-map-marker mr-2"></i>
            Seleccionar Ubicación
          </h5>
          <button type="button" class="close" @click="closeLocationModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="locationSearch">Buscar ubicación:</label>
              <input 
                type="text" 
                id="locationSearch" 
                v-model="locationSearch" 
                class="form-control" 
                placeholder="Buscar ciudad, estado o país..."
                @input="filterLocations"
              />
            </div>
            <div class="col-md-6">
              <label>Ubicación seleccionada:</label>
              <div class="selected-location-display">
                <span v-if="selectedLocation">{{ selectedLocation.display }}</span>
                <span v-else class="text-muted">Ninguna ubicación seleccionada</span>
              </div>
            </div>
          </div>
          
          <div class="location-list">
            <div 
              v-for="location in filteredLocations" 
              :key="location.id"
              class="location-item"
              @click="selectLocation(location)"
              :class="{ 'selected': selectedLocation && selectedLocation.id === location.id }"
            >
              <div class="location-info">
                <strong>{{ location.city }}, {{ location.state }}</strong>
                <div class="location-details">
                  <span class="country">{{ location.country }}</span>
                  <span class="postal-code">CP: {{ location.postalCode }}</span>
                </div>
              </div>
              <i class="fa fa-check-circle" v-if="selectedLocation && selectedLocation.id === location.id"></i>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeLocationModal">Cancelar</button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="applyLocation"
            :disabled="!selectedLocation"
          >
            <i class="fa fa-check mr-2"></i>Aplicar Ubicación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { is_admin } from '../isAdmin';

export default {
  name: 'UserManagement',
  data() {
    return {
      currentStep: 1,
      formData: {
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        birthDate: '',
        maidenName: '',
        username: '',
        email: '',
        phone: '',
        address: {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        password: '',
        role: '',
        university: '',
        company: {
          name: '',
          title: '',
          department: ''
        },
        bloodGroup: ''
      },
      users: [],
      selectedUser: null,
      isViewMode: false,
      isEditMode: false,
      editUserId: null,
      activeTab: 'register',
      isLoading: false,
      notifications: [],
      locationSearch: '',
      filteredLocations: [],
      selectedLocation: null,
      showLocationModal: false,
      locations: [
        // Caracas
        { id: 1, city: 'Caracas', state: 'Distrito Capital', country: 'Venezuela', postalCode: '1010', display: 'Caracas, Distrito Capital, Venezuela' },
        { id: 2, city: 'Caracas', state: 'Miranda', country: 'Venezuela', postalCode: '1060', display: 'Caracas, Miranda, Venezuela' },
        
        // Valencia (UJAP)
        { id: 3, city: 'Valencia', state: 'Carabobo', country: 'Venezuela', postalCode: '2001', display: 'Valencia, Carabobo, Venezuela' },
        { id: 4, city: 'Valencia', state: 'Carabobo', country: 'Venezuela', postalCode: '2002', display: 'Valencia, Carabobo, Venezuela' },
        { id: 5, city: 'Valencia', state: 'Carabobo', country: 'Venezuela', postalCode: '2003', display: 'Valencia, Carabobo, Venezuela' },
        { id: 6, city: 'Valencia', state: 'Carabobo', country: 'Venezuela', postalCode: '2004', display: 'Valencia, Carabobo, Venezuela' },
        { id: 7, city: 'Valencia', state: 'Carabobo', country: 'Venezuela', postalCode: '2005', display: 'Valencia, Carabobo, Venezuela' },
        
        // Maracay
        { id: 8, city: 'Maracay', state: 'Aragua', country: 'Venezuela', postalCode: '2101', display: 'Maracay, Aragua, Venezuela' },
        { id: 9, city: 'Maracay', state: 'Aragua', country: 'Venezuela', postalCode: '2102', display: 'Maracay, Aragua, Venezuela' },
        { id: 10, city: 'Maracay', state: 'Aragua', country: 'Venezuela', postalCode: '2103', display: 'Maracay, Aragua, Venezuela' },
        
        // Barquisimeto
        { id: 11, city: 'Barquisimeto', state: 'Lara', country: 'Venezuela', postalCode: '3001', display: 'Barquisimeto, Lara, Venezuela' },
        { id: 12, city: 'Barquisimeto', state: 'Lara', country: 'Venezuela', postalCode: '3002', display: 'Barquisimeto, Lara, Venezuela' },
        
        // Maracaibo
        { id: 13, city: 'Maracaibo', state: 'Zulia', country: 'Venezuela', postalCode: '4001', display: 'Maracaibo, Zulia, Venezuela' },
        { id: 14, city: 'Maracaibo', state: 'Zulia', country: 'Venezuela', postalCode: '4002', display: 'Maracaibo, Zulia, Venezuela' },
        
        // Mérida
        { id: 15, city: 'Mérida', state: 'Mérida', country: 'Venezuela', postalCode: '5101', display: 'Mérida, Mérida, Venezuela' },
        
        // San Cristóbal
        { id: 16, city: 'San Cristóbal', state: 'Táchira', country: 'Venezuela', postalCode: '5001', display: 'San Cristóbal, Táchira, Venezuela' },
        
        // Ciudad Bolívar
        { id: 17, city: 'Ciudad Bolívar', state: 'Bolívar', country: 'Venezuela', postalCode: '8001', display: 'Ciudad Bolívar, Bolívar, Venezuela' },
        
        // Ciudad Guayana
        { id: 18, city: 'Ciudad Guayana', state: 'Bolívar', country: 'Venezuela', postalCode: '8050', display: 'Ciudad Guayana, Bolívar, Venezuela' },
        
        // Maturín
        { id: 19, city: 'Maturín', state: 'Monagas', country: 'Venezuela', postalCode: '6201', display: 'Maturín, Monagas, Venezuela' },
        
        // Barcelona
        { id: 20, city: 'Barcelona', state: 'Anzoátegui', country: 'Venezuela', postalCode: '6001', display: 'Barcelona, Anzoátegui, Venezuela' },
        
        // Puerto La Cruz
        { id: 21, city: 'Puerto La Cruz', state: 'Anzoátegui', country: 'Venezuela', postalCode: '6023', display: 'Puerto La Cruz, Anzoátegui, Venezuela' },
        
        // Cumaná
        { id: 22, city: 'Cumaná', state: 'Sucre', country: 'Venezuela', postalCode: '6101', display: 'Cumaná, Sucre, Venezuela' },
        
        // Coro
        { id: 23, city: 'Coro', state: 'Falcón', country: 'Venezuela', postalCode: '4101', display: 'Coro, Falcón, Venezuela' },
        
        // Punto Fijo
        { id: 24, city: 'Punto Fijo', state: 'Falcón', country: 'Venezuela', postalCode: '4102', display: 'Punto Fijo, Falcón, Venezuela' },
        
        // Guanare
        { id: 25, city: 'Guanare', state: 'Portuguesa', country: 'Venezuela', postalCode: '3350', display: 'Guanare, Portuguesa, Venezuela' },
        
        // Acarigua
        { id: 26, city: 'Acarigua', state: 'Portuguesa', country: 'Venezuela', postalCode: '3301', display: 'Acarigua, Portuguesa, Venezuela' },
        
        // San Fernando de Apure
        { id: 27, city: 'San Fernando de Apure', state: 'Apure', country: 'Venezuela', postalCode: '7001', display: 'San Fernando de Apure, Apure, Venezuela' },
        
        // Calabozo
        { id: 28, city: 'Calabozo', state: 'Guárico', country: 'Venezuela', postalCode: '2312', display: 'Calabozo, Guárico, Venezuela' },
        
        // Valle de la Pascua
        { id: 29, city: 'Valle de la Pascua', state: 'Guárico', country: 'Venezuela', postalCode: '2350', display: 'Valle de la Pascua, Guárico, Venezuela' },
        
        // Los Teques
        { id: 30, city: 'Los Teques', state: 'Miranda', country: 'Venezuela', postalCode: '1201', display: 'Los Teques, Miranda, Venezuela' },
        
        // Petare
        { id: 31, city: 'Petare', state: 'Miranda', country: 'Venezuela', postalCode: '1073', display: 'Petare, Miranda, Venezuela' },
        
        // Guarenas
        { id: 32, city: 'Guarenas', state: 'Miranda', country: 'Venezuela', postalCode: '1220', display: 'Guarenas, Miranda, Venezuela' },
        
        // Guatire
        { id: 33, city: 'Guatire', state: 'Miranda', country: 'Venezuela', postalCode: '1220', display: 'Guatire, Miranda, Venezuela' },
        
        // La Victoria
        { id: 34, city: 'La Victoria', state: 'Aragua', country: 'Venezuela', postalCode: '2121', display: 'La Victoria, Aragua, Venezuela' },
        
        // Turmero
        { id: 35, city: 'Turmero', state: 'Aragua', country: 'Venezuela', postalCode: '2115', display: 'Turmero, Aragua, Venezuela' },
        
        // Puerto Cabello
        { id: 36, city: 'Puerto Cabello', state: 'Carabobo', country: 'Venezuela', postalCode: '2050', display: 'Puerto Cabello, Carabobo, Venezuela' },
        
        // Guacara
        { id: 37, city: 'Guacara', state: 'Carabobo', country: 'Venezuela', postalCode: '2015', display: 'Guacara, Carabobo, Venezuela' },
        
        // Los Guayos
        { id: 38, city: 'Los Guayos', state: 'Carabobo', country: 'Venezuela', postalCode: '2016', display: 'Los Guayos, Carabobo, Venezuela' },
        
        // San Diego
        { id: 39, city: 'San Diego', state: 'Carabobo', country: 'Venezuela', postalCode: '2017', display: 'San Diego, Carabobo, Venezuela' },
        
        // Naguanagua
        { id: 40, city: 'Naguanagua', state: 'Carabobo', country: 'Venezuela', postalCode: '2018', display: 'Naguanagua, Carabobo, Venezuela' }
      ],
    }
  },
  mounted() {
    this.fetchUsuarios();
  },
  methods: {
    // Métodos para notificaciones
    showNotification(message, type = 'info') {
      const notification = {
        id: Date.now(),
        message,
        type
      };
      this.notifications.push(notification);
      
      // Auto-remover después de 5 segundos
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 5000);
    },
    
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    },
    
    getNotificationIcon(type) {
      const icons = {
        success: 'fa fa-check-circle',
        error: 'fa fa-exclamation-circle',
        warning: 'fa fa-exclamation-triangle',
        info: 'fa fa-info-circle'
      };
      return icons[type] || icons.info;
    },
    
    nextStep() {
      if (this.validateCurrentStep()) {
        this.isLoading = true;
        setTimeout(() => {
          this.currentStep++;
          this.isLoading = false;
        }, 500); // Mostrar spinner por 500ms
      }
    },
    isValidName(name) {
      // Solo letras (mayúsculas, minúsculas, tildes y espacios)
      return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name.trim());
    },
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    isValidPhone(phone) {
      return /^[\d\s\-()+]{7,}$/.test(phone);
    },
    isValidDate(date) {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false;
      
      const [d, m, y] = date.split('/').map(Number);
      
      // Validaciones básicas
      if (m < 1 || m > 12 || d < 1 || d > 31) return false;
      
      // Validaciones específicas por mes
      const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
      // Ajustar febrero para años bisiestos
      if (m === 2) {
        const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
        daysInMonth[2] = isLeapYear ? 29 : 28;
      }
      
      if (d > daysInMonth[m]) return false;
      
      // Validar año (entre 1900 y año actual + 10)
      const currentYear = new Date().getFullYear();
      if (y < 1900 || y > currentYear + 10) return false;
      
      // Comprobar que la fecha no sea futura (opcional, puedes comentar si quieres permitir fechas futuras)
      const inputDate = new Date(y, m - 1, d);
      const today = new Date();
      if (inputDate > today) return false;
      
      return true;
    },
    isValidPostalCode(code) {
      return /^\d{4,10}$/.test(code);
    },
    isValidPassword(password) {
      return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
    },
    validateCurrentStep() {
      // Paso 1: Información Personal
      if (this.currentStep === 1) {
        if (!this.formData.firstName.trim()) {
          this.showNotification('El nombre es obligatorio', 'error');
          return false;
        }
        if (!this.isValidName(this.formData.firstName)) {
          this.showNotification('El nombre solo debe contener letras y espacios', 'error');
          return false;
        }
        if (!this.formData.lastName.trim()) {
          this.showNotification('El apellido es obligatorio', 'error');
          return false;
        }
        if (!this.isValidName(this.formData.lastName)) {
          this.showNotification('El apellido solo debe contener letras y espacios', 'error');
          return false;
        }
        if (this.formData.maidenName && !this.isValidName(this.formData.maidenName)) {
            this.showNotification('El apellido de soltera solo debe contener letras y espacios', 'error');
            return false;
        }
        if (!this.formData.age || isNaN(this.formData.age) || this.formData.age < 1 || this.formData.age > 120) {
          this.showNotification('Edad inválida (debe ser entre 1 y 120)', 'error');
          return false;
        }
        if (!this.formData.gender) {
          this.showNotification('Selecciona un género', 'error');
          return false;
        }
        if (!this.formData.birthDate || !this.isValidDate(this.formData.birthDate)) {
          this.showNotification('Fecha de nacimiento inválida (usa formato dd/mm/aaaa)', 'error');
          return false;
        }
        if (!this.formData.username.trim()) {
          this.showNotification('El nombre de usuario es obligatorio', 'error');
          return false;
        }
      }
      // Paso 2: Información de Contacto
      else if (this.currentStep === 2) {
        if (!this.formData.email.trim() || !this.isValidEmail(this.formData.email)) {
          this.showNotification('Correo electrónico inválido', 'error');
          return false;
        }
        if (!this.formData.phone.trim() || !this.isValidPhone(this.formData.phone)) {
          this.showNotification('Teléfono inválido', 'error');
          return false;
        }
        if (!this.formData.address.address.trim()) {
          this.showNotification('La dirección es obligatoria', 'error');
          return false;
        }
        if (!this.formData.address.city.trim()) {
          this.showNotification('La ciudad es obligatoria', 'error');
          return false;
        }
        if (!this.isValidName(this.formData.address.city)) {
          this.showNotification('La ciudad solo debe contener letras y espacios', 'error');
          return false;
        }
        if (!this.formData.address.state.trim()) {
          this.showNotification('El estado es obligatorio', 'error');
          return false;
        }
        if (!this.isValidName(this.formData.address.state)) {
          this.showNotification('El estado solo debe contener letras y espacios', 'error');
          return false;
        }
        if (!this.formData.address.postalCode.trim() || !this.isValidPostalCode(this.formData.address.postalCode)) {
          this.showNotification('Código postal inválido', 'error');
          return false;
        }
        if (!this.formData.address.country.trim()) {
          this.showNotification('El país es obligatorio', 'error');
          return false;
        }
        if (!this.isValidName(this.formData.address.country)) {
          this.showNotification('El país solo debe contener letras y espacios', 'error');
          return false;
        }
        if (!this.isEditMode) { // Requerido para usuarios nuevos
            if (!this.formData.password || !this.isValidPassword(this.formData.password)) {
                this.showNotification('La contraseña debe tener al menos 6 caracteres, una letra y un número', 'error');
                return false;
            }
        } else { // Opcional para usuarios existentes, pero se valida si se ingresa
            if (this.formData.password && !this.isValidPassword(this.formData.password)) {
                this.showNotification('Si desea cambiar la contraseña, debe tener al menos 6 caracteres, una letra y un número', 'error');
                return false;
            }
        }
      }
      // Paso 3: Información Profesional
      else if (this.currentStep === 3) {
        if (!this.formData.role) {
          this.showNotification('Por favor selecciona un rol', 'error');
          return false;
        }
        if (this.formData.university && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.,'-]+$/.test(this.formData.university)) {
            this.showNotification('Nombre de universidad inválido.', 'error');
            return false;
        }
        if (this.formData.company.name && !/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,'-]+$/.test(this.formData.company.name)) {
            this.showNotification('Nombre de empresa inválido.', 'error');
            return false;
        }
        if (this.formData.company.title && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.,'-]+$/.test(this.formData.company.title)) {
            this.showNotification('Cargo inválido.', 'error');
            return false;
        }
        if (this.formData.company.department && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.,'-]+$/.test(this.formData.company.department)) {
            this.showNotification('Departamento inválido.', 'error');
            return false;
        }
      }
      return true;
    },
    async handleSubmit() {
      this.isLoading = true;
      try {
        const [day, month, year] = this.formData.birthDate.split('/');
        const birthDateForDb = this.isValidDate(this.formData.birthDate) ? `${year}-${month}-${day}` : this.formData.birthDate;
        const userData = {
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          age: this.formData.age,
          gender: this.formData.gender,
          birthDate: birthDateForDb,
          maidenName: this.formData.maidenName,
          username: this.formData.username,
          email: this.formData.email,
          phone: this.formData.phone,
          address_address: this.formData.address.address,
          address_city: this.formData.address.city,
          address_state: this.formData.address.state,
          address_postalCode: this.formData.address.postalCode,
          address_country: this.formData.address.country,
          password: this.formData.password,
          role: this.formData.role,
          university: this.formData.university,
          company_name: this.formData.company.name,
          company_title: this.formData.company.title,
          company_department: this.formData.company.department,
          bloodGroup: this.formData.bloodGroup
        };
        if (this.isEditMode && this.editUserId) {
          console.log('Actualizando usuario con ID:', this.editUserId);
          console.log('Datos a actualizar:', userData);
          if (!userData.password) {
            delete userData.password;
          }
          const response = await axios.put(`http://localhost:3001/api/usuarios/${this.editUserId}`, userData);
          console.log('Respuesta de actualización:', response.data);
          this.showNotification('Usuario actualizado exitosamente', 'success');
        } else {
          console.log('Creando nuevo usuario');
          const response = await axios.post('http://localhost:3001/api/usuarios', userData);
          this.showNotification(response.data.message, 'success');
        }
        this.resetForm();
        this.fetchUsuarios();
        this.activeTab = 'list';
        this.isEditMode = false;
        this.editUserId = null;
      } catch (error) {
        console.error('Error en handleSubmit:', error);
        console.error('Respuesta del servidor:', error.response?.data);
        this.showNotification(error.response?.data?.message || 'Error al procesar usuario', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    resetForm() {
      this.currentStep = 1;
      this.formData = {
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        birthDate: '',
        maidenName: '',
        username: '',
        email: '',
        phone: '',
        address: {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        password: '',
        role: '',
        university: '',
        company: {
          name: '',
          title: '',
          department: ''
        },
        bloodGroup: ''
      };
      this.selectedUser = null;
      this.isViewMode = false;
      this.isEditMode = false;
      this.editUserId = null;
    },
    async fetchUsuarios() {
      try {
        this.isLoading = true;
        const response = await axios.get('http://localhost:3001/api/usuarios');
        this.users = response.data;
      } catch (error) {
        this.showNotification('Error al cargar la lista de usuarios', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    refreshUsers() {
      this.fetchUsuarios();
    },
    async viewUser(user) {
      try {
        this.isLoading = true;
        const response = await axios.get(`http://localhost:3001/api/usuarios/${user.id}`);
        const fullUser = response.data;

        const datos = `
          Nombre: ${fullUser.firstName || 'No especificado'} ${fullUser.lastName || 'No especificado'}
          Edad: ${fullUser.age || 'No especificado'}
          Género: ${fullUser.gender === 'male' ? 'Masculino' : fullUser.gender === 'female' ? 'Femenino' : 'No especificado'}
          Fecha de Nacimiento: ${this.formatDisplayDate(fullUser.birthDate) || 'No especificado'}
          Usuario: ${fullUser.username || 'No especificado'}
          Email: ${fullUser.email || 'No especificado'}
          Teléfono: ${fullUser.phone || 'No especificado'}
          Dirección: ${fullUser.address_address || 'No especificado'}, ${fullUser.address_city || 'No especificado'}, ${fullUser.address_state || 'No especificado'}, ${fullUser.address_postalCode || 'No especificado'}, ${fullUser.address_country || 'No especificado'}
          Rol: ${fullUser.role || 'No especificado'}
          Universidad: ${fullUser.university || 'No especificado'}
          Empresa: ${fullUser.company_name || 'No especificado'}
          Cargo: ${fullUser.company_title || 'No especificado'}
          Departamento: ${fullUser.company_department || 'No especificado'}
          Grupo Sanguíneo: ${fullUser.bloodGroup || 'No especificado'}
        `.trim();
        
        this.showNotification(datos, 'info');
      } catch (error) {
        console.error('Error en viewUser:', error);
        this.showNotification('Error al obtener los detalles del usuario.', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    async editUser(user) {
      try {
        this.isLoading = true;
        const response = await axios.get(`http://localhost:3001/api/usuarios/${user.id}`);
        const fullUser = response.data;

        this.isEditMode = true;
        this.isViewMode = true; // Deshabilita edición
        this.editUserId = fullUser.id;
        this.fillFormFromUser(fullUser);
        this.currentStep = 1;
        this.activeTab = 'register';
        this.showNotification('Solo puedes ver los datos, no editarlos.', 'info');
      } catch (error) {
        console.error('Error en editUser:', error);
        this.showNotification('Error al cargar los datos del usuario para editar.', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    fillFormFromUser(user) {
      this.formData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age || '',
        gender: user.gender || '',
        birthDate: this.formatDisplayDate(user.birthDate) || '',
        maidenName: user.maidenName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          address: user.address_address || '',
          city: user.address_city || '',
          state: user.address_state || '',
          postalCode: user.address_postalCode || '',
          country: user.address_country || ''
        },
        password: '',
        role: user.role || '',
        university: user.university || '',
        company: {
          name: user.company_name || '',
          title: user.company_title || '',
          department: user.company_department || ''
        },
        bloodGroup: user.bloodGroup || ''
      };
    },
    toggleUserStatus(user) {
      user.estado = user.estado === 'activo' ? 'deshabilitado' : 'activo'
    },
    getRoleBadgeClass(role) {
      return role === 'admin' ? 'badge badge-danger' : 'badge badge-primary'
    },
    getStatusBadgeClass(estado) {
      return estado === 'activo' ? 'badge badge-success' : 'badge badge-secondary'
    },
    autoFormatBirthDate(e) {
      let value = e.target.value.replace(/\D/g, ''); // Solo números
      if (value.length > 8) value = value.slice(0, 8);

      let formatted = '';
      if (value.length >= 4) {
        // Validar día (1-31)
        const day = parseInt(value.slice(0, 2));
        if (day < 1 || day > 31) {
          // Si el día es inválido, usar 31 como máximo
          value = '31' + value.slice(2);
        }
        
        // Validar mes (1-12)
        const month = parseInt(value.slice(2, 4));
        if (month < 1 || month > 12) {
          // Si el mes es inválido, usar 12 como máximo
          value = value.slice(0, 2) + '12' + value.slice(4);
        }
        
        formatted = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
      } else if (value.length >= 2) {
        // Validar día (1-31)
        const day = parseInt(value.slice(0, 2));
        if (day < 1 || day > 31) {
          value = '31';
        }
        formatted = value.slice(0, 2) + '/' + value.slice(2, 4);
      } else {
        formatted = value;
      }

      this.formData.birthDate = formatted;
    },
    handleDateKeydown(e) {
      const value = this.formData.birthDate.replace(/\D/g, '');
      
      // Permitir teclas de navegación
      if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        return;
      }
      
      // Solo permitir números
      if (!/\d/.test(e.key)) {
        e.preventDefault();
        return;
      }
      
      // Si ya tenemos 8 dígitos, no permitir más
      if (value.length >= 8) {
        e.preventDefault();
        return;
      }
      
      // Auto-avanzar después de completar cada sección
      if (value.length === 1 && parseInt(value + e.key) > 3) {
        // Si el primer dígito del día es mayor a 3, agregar 0 al inicio
        this.formData.birthDate = '0' + value + e.key + '/';
        e.preventDefault();
        return;
      }
      
      if (value.length === 2) {
        // Después del día, agregar /
        setTimeout(() => {
          if (this.formData.birthDate.length === 2) {
            this.formData.birthDate += '/';
          }
        }, 10);
      }
      
      if (value.length === 4) {
        // Después del mes, agregar /
        setTimeout(() => {
          if (this.formData.birthDate.length === 5) {
            this.formData.birthDate += '/';
          }
        }, 10);
      }
    },
    formatDisplayDate(dateString) {
      if (!dateString) return '';
      // Asume que la fecha viene como YYYY-MM-DD o un formato que Date puede interpretar
      const date = new Date(dateString);
      // Corrige el problema de la zona horaria al interpretar la fecha
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const correctedDate = new Date(date.getTime() + userTimezoneOffset);

      const day = String(correctedDate.getDate()).padStart(2, '0');
      const month = String(correctedDate.getMonth() + 1).padStart(2, '0'); // Mes es 0-indexado
      const year = correctedDate.getFullYear();
      if (isNaN(day)) return ''; // Devuelve vacío si la fecha no es válida
      return `${day}/${month}/${year}`;
    },
    downloadPDF() {
      const doc = new jsPDF();
      
      // Logo en la esquina superior izquierda (igual al del formulario)
      // Círculo principal azul
      doc.setFillColor(0, 123, 255);
      doc.circle(15, 15, 8, 'F');
      
      // Borde blanco
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.circle(15, 15, 8, 'S');
      
      // Letras Ji juntas (igual que en el SVG)
      doc.setTextColor(255, 255, 255); // Blanco para J
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('J', 13, 19, { align: 'center' });
      
      doc.setTextColor(255, 193, 7); // Amarillo para i
      doc.text('i', 17, 19, { align: 'center' });
      
      // Título centrado
      doc.setTextColor(0, 0, 0); // Negro
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Lista de Usuarios', 105, 20, { align: 'center' });
      
      // Subtítulo con fecha
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const fecha = new Date().toLocaleDateString('es-ES');
      doc.text(`Generado el: ${fecha}`, 105, 30, { align: 'center' });
      
      // Tabla de usuarios (bajada para no sobreponerse)
      const columns = [
        'ID', 'Nombre', 'Email', 'Teléfono', 'Edad', 'Rol', 'Estado'
      ];
      const rows = this.users.map(user => [
        user.id,
        `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        user.email,
        user.phone,
        user.age,
        user.role,
        user.estado
      ]);
      
      autoTable(doc, { 
        head: [columns], 
        body: rows, 
        startY: 45, // Bajado para dar espacio al encabezado
        headStyles: { fillColor: [0, 123, 255] },
        styles: { fontSize: 10 }
      });
      
      doc.save('usuarios.pdf');
    },
    downloadExcel() {
      const wsData = [
        ['ID', 'Nombre', 'Email', 'Teléfono', 'Edad', 'Rol', 'Estado'],
        ...this.users.map(user => [
          user.id,
          `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          user.email,
          user.phone,
          user.age,
          user.role,
          user.estado
        ])
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
      XLSX.writeFile(wb, 'usuarios.xlsx');
    },
    validateLettersOnly(event) {
      const value = event.target.value;
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        event.target.value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
      }
    },
    preventNumbers(event) {
      const value = event.target.value;
      if (/^\d+$/.test(value)) {
        event.target.value = '';
      }
    },
    validateUsername(event) {
      const value = event.target.value;
      if (!/^[A-Za-z0-9_]+$/.test(value)) {
        event.target.value = value.replace(/[^A-Za-z0-9_]/g, '');
      }
    },
    validateAddress(event) {
      const value = event.target.value;
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        event.target.value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
      }
    },
    validateNumbersOnly(event) {
      const value = event.target.value;
      if (!/^[0-9]+$/.test(value)) {
        event.target.value = value.replace(/[^0-9]/g, '');
      }
    },
    preventLetters(event) {
      const value = event.target.value;
      if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        event.target.value = '';
      }
    },
    validateCompanyName(event) {
      const value = event.target.value;
      if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,'-]+$/.test(value)) {
        event.target.value = value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,'-]/g, '');
      }
    },
    validateAge(event) {
      const value = event.target.value;
      if (!/^\d+$/.test(value)) {
        event.target.value = value.replace(/[^0-9]/g, '');
      }
    },
    validatePhone(event) {
      const value = event.target.value;
      if (!/^[\d\s\-()+]{7,}$/.test(value)) {
        event.target.value = value.replace(/[^0-9\s\-()+]/g, '');
      }
    },
    validateEmail(event) {
      const value = event.target.value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        event.target.value = value.replace(/[^A-Za-z0-9@._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i, '');
      }
    },
    openLocationSelector() {
      this.locationSearch = '';
      this.selectedLocation = null;
      this.filteredLocations = [...this.locations];
      this.showLocationModal = true;
    },
    filterLocations() {
      if (!this.locationSearch.trim()) {
        this.filteredLocations = [...this.locations];
        return;
      }
      
      const searchTerm = this.locationSearch.toLowerCase();
      this.filteredLocations = this.locations.filter(location => 
        location.city.toLowerCase().includes(searchTerm) ||
        location.state.toLowerCase().includes(searchTerm) ||
        location.country.toLowerCase().includes(searchTerm) ||
        location.postalCode.includes(searchTerm)
      );
    },
    selectLocation(location) {
      this.selectedLocation = location;
    },
    applyLocation() {
      if (this.selectedLocation) {
        this.formData.address.city = this.selectedLocation.city;
        this.formData.address.state = this.selectedLocation.state;
        this.formData.address.country = this.selectedLocation.country;
        this.formData.address.postalCode = this.selectedLocation.postalCode;
        
        this.showNotification(`Ubicación aplicada: ${this.selectedLocation.display}`, 'success');
        this.showLocationModal = false;
      }
    },
    closeLocationModal() {
      this.showLocationModal = false;
    }
  },
  computed: {
    isAdmin() {
      return is_admin.value;
    }
  }
}
</script>

<style scoped>
/* Rediseño del formulario de gestión de usuarios */

/* Contenedor principal del wizard */
.wizard-container {
  max-width: 800px;
  margin: 2rem auto;
  font-family: 'Poppins', sans-serif; /* Usar una fuente más moderna si está disponible */
}

/* Estilo de las pestañas de navegación */
.nav-tabs {
  border-bottom: 2px solid #dee2e6;
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 2px solid transparent;
  color: #6c757d;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
  border-bottom-color: #007bff;
  color: #0056b3;
}

.nav-tabs .nav-link.active {
  border-color: #007bff;
  color: #007bff;
  background-color: transparent;
}

/* Estilo de los pasos del wizard */
.wizard-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
}

/* Línea de conexión entre pasos */
.wizard-steps::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e9ecef;
  transform: translateY(-50%);
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 2;
  background-color: white; /* Para que esté sobre la línea */
  padding: 0 10px;
}

.step-number {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid #e9ecef;
  background-color: white;
  color: #adb5bd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  transition: all 0.4s ease;
}

.step.active .step-number {
  border-color: #007bff;
  background-color: #007bff;
  color: white;
  transform: scale(1.1);
}

.step.completed .step-number {
  border-color: #28a745;
  background-color: #28a745;
  color: white;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #6c757d;
  text-align: center;
  transition: color 0.4s ease;
}

.step.active .step-title {
  color: #007bff;
  font-weight: 700;
}

/* Contenido de cada paso */
.wizard-step {
  min-height: 400px;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilo de los grupos de formulario y etiquetas */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

/* Estilo de los campos de entrada */
.form-control {
  height: calc(1.5em + 1rem + 2px);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.3rem;
  border: 1px solid #ced4da;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  background-color: #fff;
}

/* Estilo para los botones */
.btn {
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border-radius: 0.3rem;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Botones de navegación del wizard */
.wizard-buttons {
  display: flex;
  justify-content: flex-end; /* Alinear botones a la derecha */
  align-items: center;
}

/* Tarjeta de resumen */
.card {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

/* Responsividad para la tabla */
.table-responsive {
  margin-top: 1rem;
}

/* Estilos para los botones de acción en la tabla */
.action-buttons .btn-sm {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  margin: 0 2px;
}

.btn-view {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
.btn-view:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-edit {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}
.btn-edit:hover {
  background: linear-gradient(135deg, #e085e8 0%, #e04a5f 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.btn-disable {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}
.btn-disable:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e74c3c 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.btn-enable {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}
.btn-enable:hover {
  background: linear-gradient(135deg, #43a3f0 0%, #00e5f2 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

/* Mejoras para los botones principales */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.btn-success:hover {
  background: linear-gradient(135deg, #43a3f0 0%, #00e5f2 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e74c3c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

/* Mejoras para los badges */
.badge-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5em 0.8em;
  border-radius: 6px;
}

.badge-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 0.5em 0.8em;
  border-radius: 6px;
}

.badge-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 0.5em 0.8em;
  border-radius: 6px;
}

.badge-secondary {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  color: white;
  padding: 0.5em 0.8em;
  border-radius: 6px;
}

/* Estilo para el campo de fecha */
#birthDate {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  letter-spacing: 1px;
  text-align: center;
}

#birthDate:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

#birthDate::placeholder {
  color: #adb5bd;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

/* Animación para el campo de fecha cuando se completa */
#birthDate:valid {
  border-color: #28a745;
  background-color: #f8fff9;
}

/* Indicador visual de formato */
.form-group label[for="birthDate"]::after {
  content: " (dd/mm/aaaa)";
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: normal;
}

/* Feedback visual para campos con errores */
.form-control.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  background-color: #fff5f5;
}

.form-control.valid {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  background-color: #f8fff9;
}

/* Mensajes de error */
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: none;
}

.form-control.error + .error-message {
  display: block;
}

/* Spinner de carga */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.spinner-container {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Efecto de pulso para el texto */
.spinner-container p {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Sistema de notificaciones */
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInRight 0.3s ease-out;
  max-height: 200px;
  overflow-y: auto;
}

.notification.success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.notification.error {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.notification.warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.notification.info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.notification-content {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 10px;
}

.notification-content i {
  margin-right: 10px;
  font-size: 1.2rem;
}

.notification-content span {
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: pre-line;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.notification-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Animación de salida */
.notification.removing {
  animation: slideOutRight 0.3s ease-in forwards;
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Estilos para el selector de ubicación */
.location-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.location-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.location-item:last-child {
  border-bottom: none;
}

.location-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(5px);
}

.location-item.selected {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(79, 172, 254, 0.3);
}

.location-info {
  flex: 1;
}

.location-info strong {
  font-size: 1.1rem;
  display: block;
  margin-bottom: 0.25rem;
}

.location-details {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.country {
  font-weight: 500;
}

.postal-code {
  font-family: 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.location-item i.fa-check-circle {
  color: white;
  font-size: 1.2rem;
  margin-left: 1rem;
}

.selected-location-display {
  background: #e9ecef;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid #667eea;
  font-weight: 500;
}

/* Estilos para el botón del mapa */
.input-group-append .btn {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.input-group-append .btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

/* Modal personalizado */
.modal-content {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px 15px 0 0;
  border-bottom: none;
}

.modal-header .close {
  color: white;
  opacity: 0.8;
}

.modal-header .close:hover {
  opacity: 1;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

/* Scrollbar personalizado para la lista */
.location-list::-webkit-scrollbar {
  width: 8px;
}

.location-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.location-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.location-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* Modal overlay personalizado */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.modal-overlay .modal-dialog {
  margin: 0;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
}

.modal-overlay .modal-content {
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-overlay .modal-body {
  flex: 1;
  overflow: hidden;
}
</style>