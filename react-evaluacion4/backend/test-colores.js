const axios = require('axios');

const API_URL = 'http://localhost:3001/api/colores';

async function testColores() {
  try {
    console.log('=== Iniciando pruebas para colores ===');

    // 1. Crear una nueva paleta de colores
    console.log('\n1. Creando nueva paleta...');
    const nuevaPaleta = {
      nombre_paleta: "Test Paleta",
      color_primario: "#FF5733",
      color_secundario: "#33FF57",
      color_terciario: "#3357FF",
      color_texto: "#000000",
      color_fondo: "#FFFFFF"
    };

    const creacion = await axios.post(API_URL, nuevaPaleta);
    const idPaleta = creacion.data.id;
    console.log('✅ Paleta creada con ID:', idPaleta);
    console.log('Respuesta completa:', creacion.data);

    // 2. Obtener la paleta recién creada
    console.log('\n2. Obteniendo paleta...');
    const obtencion = await axios.get(`${API_URL}/${idPaleta}`);
    console.log('✅ Paleta obtenida:');
    console.log(obtencion.data);

    // 3. Listar todas las paletas
    console.log('\n3. Listando todas las paletas...');
    const listado = await axios.get(API_URL);
    console.log('✅ Total paletas:', listado.data.length);
    console.log('Primeras paletas:', listado.data.slice(0, 3));

    // 4. Actualizar la paleta
    console.log('\n4. Actualizando paleta...');
    const actualizacion = await axios.put(`${API_URL}/${idPaleta}`, {
      ...nuevaPaleta,
      nombre_paleta: "Paleta Modificada",
      color_primario: "#FF0000"
    });
    console.log('✅ Paleta actualizada:', actualizacion.data);

    // 5. Eliminar la paleta
    console.log('\n5. Eliminando paleta...');
    const eliminacion = await axios.delete(`${API_URL}/${idPaleta}`);
    console.log('✅ Paleta eliminada:', eliminacion.data);

    // 6. Verificar eliminación
    console.log('\n6. Verificando eliminación...');
    try {
      await axios.get(`${API_URL}/${idPaleta}`);
    } catch (error) {
      console.log('✅ Verificado - La paleta ya no existe (error esperado):');
      console.log(error.response?.data || error.message);
    }

    console.log('\n=== Todas las pruebas completadas con éxito ===');
  } catch (error) {
    console.error('❌ Error en las pruebas:');
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}

testColores();