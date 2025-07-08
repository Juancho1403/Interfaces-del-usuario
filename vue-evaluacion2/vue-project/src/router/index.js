import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import CompleteProfile from '../views/CompleteProfile.vue';
import Profile from '../views/Profile.vue';
import Configuraciones from '../views/Configuraciones.vue';
import UsuariosAdmin from '../views/UsuariosAdmin.vue';
import usuarios from '@/views/usuarios.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guest: true } },
  { path: '/completar-perfil', name: 'CompleteProfile', component: CompleteProfile,  },
  { path: '/perfil', name: 'Profile', component: Profile, },
  { path: '/configuraciones', name: 'Configuraciones', component: Configuraciones},
  { path: '/usuarios-admin', name: 'UsuariosAdmin', component: UsuariosAdmin,  },
  { path: '/usuarios', name: 'CompleteProfile', component: usuarios,  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      return next({ name: 'Login' });
    }
    if (to.meta.role && to.meta.role !== role) {
      return next({ name: 'Home' });
    }
  }
  if (to.matched.some(record => record.meta.guest)) {
    if (token) {
      return next({ name: 'Home' });
    }
  }
  next();
});

export default router; 