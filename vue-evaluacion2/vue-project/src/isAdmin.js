import { ref } from 'vue';

// Inicializa el valor leyendo el rol del localStorage
const is_admin = ref(false);
const storedRole = localStorage.getItem('role');
if (storedRole === 'admin') {
  is_admin.value = true;
}

// Función para cambiar el estado de is_admin
function setIsAdmin(value) {
  is_admin.value = value;
  // Actualiza el localStorage para persistencia
  if (value) {
    localStorage.setItem('role', 'admin');
  } else {
    localStorage.setItem('role', 'user');
  }
}

// Función para obtener el valor actual de is_admin
function getIsAdmin() {
  return is_admin.value;
}

export { is_admin, setIsAdmin, getIsAdmin }; 