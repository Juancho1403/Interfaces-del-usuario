<template>
  <div class="container-fluid">
    <div v-if="isAdmin">
      <div class="row">
        <!-- Columna del Editor -->
        <div class="col-md-5 form-section">
          <div class="editor-container">
            <h3 class="mb-4">Panel de Control de Estilos</h3>

            <!-- Pestañas -->
            <div class="module-tabs">
              <button :class="['tab-btn', { active: activeTab === 'colors' }]" @click="activeTab = 'colors'">Colores</button>
              <button :class="['tab-btn', { active: activeTab === 'styles' }]" @click="activeTab = 'styles'">Tamaños y Tipografías</button>
            </div>

            <!-- Módulo de Colores -->
            <div v-show="activeTab === 'colors'" class="module-content">
              <h4 class="section-title">Paletas Guardadas</h4>
              <div v-if="!paletas.length" class="text-muted">No hay paletas guardadas.</div>
              <div v-for="paleta in paletas" :key="paleta.id" class="saved-item">
                <span>{{ paleta.nombre_paleta }}</span>
                <div class="actions">
                  <button @click="aplicarEstilos(paleta)" class="btn btn-sm btn-info" title="Aplicar"><i class="fas fa-paint-brush"></i></button>
                  <button @click="editarPaleta(paleta)" class="btn btn-sm btn-warning" title="Editar"><i class="fas fa-edit"></i></button>
                  <button @click="eliminarPaleta(paleta.id)" class="btn btn-sm btn-danger" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
              </div>
              <hr>
              <h4 class="section-title">{{ editandoId ? 'Editando Paleta' : 'Nueva Paleta' }}</h4>
              <form @submit.prevent="guardarPaleta">
                <div class="form-group">
                  <label>Nombre de la Paleta</label>
                  <input type="text" class="form-control" v-model="colorForm.nombre_paleta" required>
                </div>
                <div class="row">
                  <div class="col-6 form-group"><label>Primario</label><input type="color" class="form-control" v-model="colorForm.color_primario"></div>
                  <div class="col-6 form-group"><label>Secundario</label><input type="color" class="form-control" v-model="colorForm.color_secundario"></div>
                  <div class="col-6 form-group"><label>Terciario</label><input type="color" class="form-control" v-model="colorForm.color_terciario"></div>
                  <div class="col-6 form-group"><label>Texto</label><input type="color" class="form-control" v-model="colorForm.color_texto"></div>
                  <div class="col-6 form-group"><label>Fondo</label><input type="color" class="form-control" v-model="colorForm.color_fondo"></div>
                </div>
                <button type="submit" class="btn btn-primary w-100">{{ editandoId ? 'Actualizar Paleta' : 'Guardar Nueva Paleta' }}</button>
                <button v-if="editandoId" @click="cancelarEdicion" type="button" class="btn btn-secondary w-100 mt-2">Cancelar Edición</button>
              </form>
              <button @click="revertirColoresOriginales" class="btn btn-outline-dark w-100 mt-3">
                <i class="fas fa-undo"></i> Restaurar Colores Originales
              </button>
            </div>
            
             <!-- Módulo de Tamaños y Tipografías -->
            <div v-show="activeTab === 'styles'" class="module-content">
              <h4 class="section-title">Tamaños y Tipografía</h4>
              <form @submit.prevent="guardarConfig">
                <div class="form-group">
                  <label>Nombre de la Configuración</label>
                  <input type="text" class="form-control" v-model="configForm.nombre" required>
                </div>
                <div class="form-group">
                  <label>Fuente para Título</label>
                  <input type="text" class="form-control" v-model="configForm.fuente_titulo" placeholder="Ej: Montserrat, Arial, etc." required>
                </div>
                <div class="form-group">
                  <label>Fuente para Texto</label>
                  <input type="text" class="form-control" v-model="configForm.fuente_texto" placeholder="Ej: Montserrat, Arial, etc." required>
                </div>
                <div class="form-group">
                  <label>Tamaño Título (px)</label>
                  <input type="number" class="form-control" v-model.number="configForm.tam_titulo" required>
                </div>
                <div class="form-group">
                  <label>Tamaño Subtítulo (px)</label>
                  <input type="number" class="form-control" v-model.number="configForm.tam_subtitulo" required>
                </div>
                <div class="form-group">
                  <label>Tamaño Texto (px)</label>
                  <input type="number" class="form-control" v-model.number="configForm.tam_texto" required>
                </div>
                <button type="submit" class="save-btn">{{ editandoId ? 'Actualizar' : 'Guardar' }}</button>
                <button v-if="editandoId" @click="cancelarEdicion" type="button" class="btn btn-secondary w-100 mt-2">Cancelar Edición</button>
                <button @click="restaurarValores" type="button" class="btn btn-outline-dark w-100 mt-3">Restaurar Valores Predeterminados</button>
              </form>
            </div>

            <router-link to="/" class="btn btn-outline-dark w-100 mt-4">Volver al Home</router-link>

          </div>
        </div>

        <!-- Columna de Vista Previa -->
        <div class="col-md-7 preview-section-container">
           <div class="preview-header">
              <i class="fas fa-eye"></i> Vista Previa en Vivo
           </div>
          <div class="preview-section">
            <Home :isPreview="true" />
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
import Home from './Home.vue';
import { is_admin } from '../isAdmin';

const API_BASE_URL = 'http://localhost:3001/api';

const COLORES_ORIGINALES = {
  nombre_paleta: '',
  color_primario: '#7AB730',
  color_secundario: '#5f8f25',
  color_terciario: '#89b70d',
  color_texto: '#212121',
  color_fondo: '#FFFFFF'
};

export default {
  name: 'ConfiguracionesVista',
  components: { Home },
  data() {
    return {
      activeTab: 'colors',
      paletas: [],
      editandoId: null,
      colorForm: {
        nombre_paleta: '',
        color_primario: '#7AB730',
        color_secundario: '#5f8f25',
        color_terciario: '#89b70d',
        color_texto: '#212121',
        color_fondo: '#FFFFFF'
      },
      configs: [],
      configForm: {
        nombre: '',
        fuente_titulo: '',
        fuente_texto: '',
        tam_titulo: 40,
        tam_subtitulo: 24,
        tam_texto: 16
      }
    };
  },
  computed: {
    isAdmin() {
      return is_admin.value;
    }
  },
  watch: {
    // Watcher para la vista previa en tiempo real
    colorForm: {
      handler(newColors) { this.aplicarEstilos(newColors); },
      deep: true
    },
    configForm: {
      handler(newConfig) { this.aplicarConfig(newConfig); },
      deep: true
    }
  },
  created() {
    this.fetchPaletas();
    this.fetchConfigs();
  },
  methods: {
    // --- Lógica de Estilos ---
    aplicarEstilos(paleta) {
      document.documentElement.style.setProperty('--color-primary', paleta.color_primario);
      document.documentElement.style.setProperty('--color-secondary', paleta.color_secundario);
      document.documentElement.style.setProperty('--color-accent', paleta.color_terciario); // Asumiendo que terciario es el acento
      document.documentElement.style.setProperty('--color-text', paleta.color_texto);
      document.documentElement.style.setProperty('--color-background', paleta.color_fondo);
    },
    aplicarConfig(config) {
      document.documentElement.style.setProperty('--font-heading', config.fuente_titulo);
      document.documentElement.style.setProperty('--font-main', config.fuente_texto);
      document.documentElement.style.setProperty('--font-size-title', `${config.tam_titulo}px`);
      document.documentElement.style.setProperty('--font-size-subtitle', `${config.tam_subtitulo}px`);
      document.documentElement.style.setProperty('--font-size-paragraph', `${config.tam_texto}px`);
    },

    // --- CRUD de Paletas ---
    async fetchPaletas() {
      try {
        const response = await axios.get(`${API_BASE_URL}/colores`);
        this.paletas = response.data;
      } catch (error) {
        console.error("Error al obtener las paletas:", error);
        alert("No se pudieron cargar las paletas. Asegúrate de que el servidor backend esté funcionando.");
      }
    },
    async guardarPaleta() {
      try {
        if (this.editandoId) {
          // Actualizar
          await axios.put(`${API_BASE_URL}/colores/${this.editandoId}`, this.colorForm);
        } else {
          // Crear
          await axios.post(`${API_BASE_URL}/colores`, this.colorForm);
        }
        this.fetchPaletas();
        this.cancelarEdicion();
      } catch (error) {
        console.error("Error al guardar la paleta:", error);
        alert("Error al guardar la paleta.");
      }
    },
    editarPaleta(paleta) {
      this.editandoId = paleta.id;
      this.colorForm = { ...paleta }; // Copia los datos al formulario
    },
    cancelarEdicion() {
      this.editandoId = null;
      this.colorForm = { ...COLORES_ORIGINALES };
    },
    async eliminarPaleta(id) {
      if (!confirm("¿Estás seguro de que quieres eliminar esta paleta?")) return;
      try {
        await axios.delete(`${API_BASE_URL}/colores/${id}`);
        this.fetchPaletas();
      } catch (error) {
        console.error("Error al eliminar la paleta:", error);
        alert("Error al eliminar la paleta.");
      }
    },

    // --- CRUD de Configuraciones ---
    async fetchConfigs() {
      const res = await axios.get(`${API_BASE_URL}/tipografia-tamanio`);
      this.configs = res.data;
      // Aplicar automáticamente la última configuración guardada al cargar
      if (this.configs.length > 0) {
        this.aplicarConfig(this.configs[this.configs.length - 1]);
      }
    },
    async guardarConfig() {
      try {
        if (this.editandoId) {
          await axios.put(`${API_BASE_URL}/tipografia-tamanio/${this.editandoId}`, this.configForm);
        } else {
          await axios.post(`${API_BASE_URL}/tipografia-tamanio`, this.configForm);
        }
        await this.fetchConfigs();
        // Aplicar la última configuración guardada a la plantilla
        if (this.configs.length > 0) {
          this.aplicarConfig(this.configs[this.configs.length - 1]);
        }
        alert('Configuración de tipografía y tamaños guardada y aplicada correctamente.');
        this.cancelarEdicion();
      } catch (e) {
        alert('Error al guardar la configuración.');
      }
    },
    editarConfig(config) {
      this.editandoId = config.id;
      this.configForm = { ...config };
    },
    async eliminarConfig(id) {
      if (!confirm('¿Eliminar configuración?')) return;
      await axios.delete(`${API_BASE_URL}/tipografia-tamanio/${id}`);
      this.fetchConfigs();
    },

    revertirColoresOriginales() {
      this.colorForm = { ...COLORES_ORIGINALES };
      this.aplicarEstilos(this.colorForm);
      alert('Los colores han sido restaurados a los valores originales de la plantilla.');
    },
    restaurarValores() {
      // Valores predeterminados
      document.documentElement.style.setProperty('--font-heading', 'Montserrat, sans-serif');
      document.documentElement.style.setProperty('--font-main', 'Montserrat, sans-serif');
      document.documentElement.style.setProperty('--font-size-title', '40px');
      document.documentElement.style.setProperty('--font-size-subtitle', '24px');
      document.documentElement.style.setProperty('--font-size-paragraph', '16px');
      alert('Valores predeterminados restaurados.');
    }
  }
};
</script>

<style scoped>
/* Contenedores Principales */
.form-section { padding: 20px; background-color: #f8f9fa; }
.editor-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  padding: 25px;
  font-family: 'Montserrat', Arial, sans-serif !important;
  font-size: 16px !important;
}
.editor-container label,
.editor-container input,
.editor-container button,
.editor-container select,
.editor-container textarea {
  font-family: 'Montserrat', Arial, sans-serif !important;
  font-size: 16px !important;
}
.preview-section-container { position: relative; height: 100vh; padding: 0; }
.preview-header { padding: 15px 20px; background-color: #343a40; color: white; font-weight: 600; font-family: 'Montserrat', sans-serif; }
.preview-header .fas { margin-right: 10px; }
.preview-section { background: white; height: calc(100vh - 56px); overflow-y: auto; border-left: 1px solid #dee2e6; }

/* Pestañas */
.module-tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #dee2e6; }
.tab-btn { padding: 10px 20px; background: none; border: none; cursor: pointer; font-weight: 500; color: #6c757d; position: relative; transition: color 0.3s; }
.tab-btn.active { color: var(--color-primary, #719a0a); }
.tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background: var(--color-primary, #719a0a); }

/* Formularios y Secciones */
.section-title { font-family: 'Montserrat', sans-serif; font-size: 1.2rem; color: #343a40; margin-bottom: 15px; margin-top: 10px; padding-bottom: 5px; border-bottom: 2px solid #e9ecef; }
.form-group label { margin-bottom: 5px; font-weight: 500; font-size: 0.9rem; }
.form-control[type="color"] { padding: 2px; height: 38px; }
.save-btn { background-color: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; cursor: pointer; width: 100%; margin-top: 10px; transition: background-color 0.3s; }
.save-btn:hover { background-color: #218838; }

/* Elementos Guardados */
.saved-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-radius: 6px; margin-bottom: 8px; background-color: #f8f9fa; border: 1px solid #e9ecef; }
.saved-item span { font-weight: 500; }
.actions button { margin-left: 5px; padding: 5px 8px; }
.actions .fas { font-size: 0.9rem; }
</style> 