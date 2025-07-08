<template>
  <div>
    <button v-if="token" @click="logout" class="btn btn-danger" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">Cerrar sesión</button>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    token() {
      return localStorage.getItem('token');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      this.$router.push('/login');
    },
    aplicarEstilos(paleta) {
      document.documentElement.style.setProperty('--color-primary', paleta.color_primario);
      document.documentElement.style.setProperty('--color-secondary', paleta.color_secundario);
      document.documentElement.style.setProperty('--color-accent', paleta.color_terciario);
      document.documentElement.style.setProperty('--color-text', paleta.color_texto);
      document.documentElement.style.setProperty('--color-background', paleta.color_fondo);
    }
  },
  created() {
    const coloresOriginales = {
      color_primario: '#7AB730',
      color_secundario: '#5f8f25',
      color_terciario: '#89b70d',
      color_texto: '#212121',
      color_fondo: '#FFFFFF'
    };
    this.aplicarEstilos(coloresOriginales);
  }
}
</script>

<style>
@import "@/assets/style.css";
</style>
