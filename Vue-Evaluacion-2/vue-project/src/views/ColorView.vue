<script setup>
    // const { createApp, ref } = Vue
        
    //     createApp({
    //     setup() {
    //         const selectedColor = ref('#3498db')
            
    //         const changeBackgroundColor = () => {
    //         if (selectedColor.value) {
    //             // Actualizamos el color de fondo usando una variable CSS
    //             document.documentElement.style.setProperty('--bg-color', selectedColor.value)
    //         }
    //         }
            
    //         return {
    //         selectedColor,
    //         changeBackgroundColor
    //         }
    //     }
    //     }).mount('#app')
</script>

<template>
<div id="app">
    <h1 class="title"><i class="fas fa-palette"></i> Cambiador de Color</h1>
    <p class="subtitle">Selecciona un color y cambia el fondo de la página</p>

    <div class="color-selector">
        <div class="color-preview">
        <div class="color-preview-text">Color seleccionado: {{ selectedColor || '#3498db' }}</div>
        </div>
        
        <div class="color-input-container">
        <label for="color-picker"><i class="fas fa-eye-dropper"></i> Selecciona un color:</label>
        <input type="color" id="color-picker" v-model="selectedColor">
        </div>
        
        <button class="btn-submit" @click="changeBackgroundColor">
        <i class="fas fa-magic"></i> Cambiar color de fondo
        </button>
    </div>

    <div class="instructions">
        <h3><i class="fas fa-info-circle"></i> Instrucciones:</h3>
        <ul>
        <li>Selecciona un color usando el selector de color</li>
        <li>Haz clic en el botón "Cambiar color de fondo"</li>
        <li>El fondo de la página cambiará al color seleccionado</li>
        <li>Puedes seguir cambiando el color cuantas veces quieras</li>
        </ul>
    </div>

    <p class="footer">El estilo de esta aplicación está definido completamente en CSS, sin inyección de estilos desde JavaScript</p>
</div>
</template>

<style scoped>
/* Estilo para el fondo definido completamente en CSS */
body {
    background: linear-gradient(135deg, var(--bg-color, #6a11cb) 0%, #2575fc 100%);
}

</style>