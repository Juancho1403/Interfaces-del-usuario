import { useState } from 'react';

// Hook personalizado para manejar el rol de admin
export function useIsAdmin() {
  // Lee el rol del localStorage al inicializar
  const [isAdmin, setIsAdmin] = useState(() => {
    const storedRole = localStorage.getItem('role');
    return storedRole === 'admin';
  });

  // Cambia el estado y actualiza localStorage
  const setAdmin = (value) => {
    setIsAdmin(value);
    if (value) {
      localStorage.setItem('role', 'admin');
    } else {
      localStorage.setItem('role', 'user');
    }
  };

  return [isAdmin, setAdmin];
}

// Función utilitaria para obtener el valor actual sin hook
export function getIsAdmin() {
  return localStorage.getItem('role') === 'admin';
} 