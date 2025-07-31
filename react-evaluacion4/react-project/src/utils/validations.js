// Validaciones para formularios
export const validations = {
  // Validación de email
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'El email es requerido';
    if (!emailRegex.test(value)) return 'El email no es válido';
    return null;
  },

  // Validación de contraseña
  password: (value) => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (value.length > 50) return 'La contraseña no puede tener más de 50 caracteres';
    return null;
  },

  // Validación de confirmación de contraseña
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Confirma tu contraseña';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return null;
  },

  // Validación de nombre
  name: (value) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{2,50}$/;
    if (!value) return 'El nombre es requerido';
    if (!nameRegex.test(value)) return 'El nombre solo debe contener letras (2-50 caracteres)';
    return null;
  },

  // Validación de teléfono
  phone: (value) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{7,15}$/;
    if (!value) return 'El teléfono es requerido';
    if (!phoneRegex.test(value)) return 'El teléfono no es válido';
    return null;
  },

  // Validación de edad
  age: (value) => {
    const age = parseInt(value);
    if (!value) return 'La edad es requerida';
    if (isNaN(age)) return 'La edad debe ser un número';
    if (age < 1 || age > 120) return 'La edad debe estar entre 1 y 120 años';
    return null;
  },

  // Validación de fecha
  date: (value) => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!value) return 'La fecha es requerida';
    if (!dateRegex.test(value)) return 'La fecha debe tener el formato dd/mm/aaaa';
    return null;
  },

  // Validación de código postal
  postalCode: (value) => {
    const postalRegex = /^\d{4,10}$/;
    if (!value) return 'El código postal es requerido';
    if (!postalRegex.test(value)) return 'El código postal debe tener 4-10 dígitos';
    return null;
  },

  // Validación de usuario
  username: (value) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!value) return 'El usuario es requerido';
    if (!usernameRegex.test(value)) return 'El usuario debe tener 3-20 caracteres (letras, números, _ y -)';
    return null;
  },

  // Validación de campos requeridos
  required: (value, fieldName) => {
    if (!value || value.trim() === '') return `${fieldName} es requerido`;
    return null;
  },

  // Validación de longitud mínima
  minLength: (value, min, fieldName) => {
    if (!value) return `${fieldName} es requerido`;
    if (value.length < min) return `${fieldName} debe tener al menos ${min} caracteres`;
    return null;
  },

  // Validación de longitud máxima
  maxLength: (value, max, fieldName) => {
    if (value && value.length > max) return `${fieldName} no puede tener más de ${max} caracteres`;
    return null;
  }
};

// Función para validar un formulario completo
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];

    for (const rule of rules) {
      const error = rule(value, formData);
      if (error) {
        errors[field] = error;
        break; // Solo el primer error por campo
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Función para validar un campo específico
export const validateField = (value, validations) => {
  for (const validation of validations) {
    const error = validation(value);
    if (error) return error;
  }
  return null;
}; 