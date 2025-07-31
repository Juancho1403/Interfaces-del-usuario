import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funciones para usuarios
export const getUsuarios = async () => {
  try {
    const response = await api.get('/api/usuarios');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const response = await api.post('/api/usuarios', usuarioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await api.put(`/api/usuarios/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    const response = await api.delete(`/api/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para autenticación
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/usuarios/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/usuarios/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Ejemplo de body correcto
fetch('http://localhost:3001/api/usuarios/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'usuario@ejemplo.com', password: 'tucontraseña' })
});

// Funciones para otras entidades (colores, tipografías, etc.)
export const getColores = async () => {
  try {
    const response = await api.get('/api/colores');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTipografias = async () => {
  try {
    const response = await api.get('/api/tipografias');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTamaniosFuente = async () => {
  try {
    const response = await api.get('/api/tamanios-fuente');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTipografiaTamanio = async () => {
  try {
    const response = await api.get('/api/tipografia-tamanio');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para Colores
export const createColor = async (colorData) => {
  try {
    const response = await api.post('/api/colores', colorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateColor = async (id, colorData) => {
  try {
    const response = await api.put(`/api/colores/${id}`, colorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteColor = async (id) => {
  try {
    const response = await api.delete(`/api/colores/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para Tipografía y Tamaño
export const createTipografiaTamanio = async (data) => {
  try {
    const response = await api.post('/api/tipografia-tamanio', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTipografiaTamanio = async (id, data) => {
  try {
    const response = await api.put(`/api/tipografia-tamanio/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTipografiaTamanio = async (id) => {
  try {
    const response = await api.delete(`/api/tipografia-tamanio/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para datos de About
export const getAboutData = async () => {
  try {
    const response = await api.get('/api/about');
    return response.data;
  } catch (error) {
    // Si no existe el endpoint, devolver datos por defecto
    return {
      title: "Sobre Nosotros",
      subtitle: "Descubre nuestra historia y misión",
      description: "Somos una empresa comprometida con la excelencia y la innovación.",
      features: [
        { title: "Experiencia", description: "Más de 10 años en el mercado" },
        { title: "Calidad", description: "Servicios de alta calidad garantizados" },
        { title: "Innovación", description: "Tecnología de vanguardia" }
      ]
    };
  }
};

// Funciones para datos de Blog
export const getBlogPosts = async () => {
  try {
    const response = await api.get('/api/blog');
    return response.data;
  } catch (error) {
    // Datos por defecto si no existe el endpoint
    return [
      {
        id: 1,
        title: "Nuevas Tecnologías",
        excerpt: "Descubre las últimas tendencias en tecnología...",
        image: "/blog-1.jpg",
        date: "2024-01-15"
      },
      {
        id: 2,
        title: "Innovación Digital",
        excerpt: "Cómo la innovación está transformando...",
        image: "/blog-2.jpg",
        date: "2024-01-10"
      }
    ];
  }
};

// Funciones para datos de Contact
export const sendContactMessage = async (messageData) => {
  try {
    const response = await api.post('/api/contact', messageData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;