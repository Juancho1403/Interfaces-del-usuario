import React, { useEffect, useCallback } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './assets/style.css';
import './assets/theme.css';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import CompleteProfile from './views/CompleteProfile';
import Profile from './views/Profile';
import Configuraciones from './views/Configuraciones';
import UsuariosAdmin from './views/UsuariosAdmin';
import UsuariosProtected from './views/Usuarios';
import Service from './views/Service';
import Single from './views/Single';
import Testimonial from './views/Testimonial';
import Destination from './views/Destination';
import Guide from './views/Guide';
import Package from './views/Package';
import Blog from './views/Blog';
import About from './views/About';
import Contact from './views/Contact';
import Navbar from './views/Navbar';
import Topbar from './views/Topbar';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const location = useLocation();
  const hideHeaderRoutes = ['/usuarios', '/configuraciones', '/usuarios-admin'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  const [showSplash, setShowSplash] = React.useState(() => {
    return localStorage.getItem('splashShown') !== 'true';
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    // Aplicar configuración de colores guardada
    const coloresGuardados = localStorage.getItem('coloresConfig');
    if (coloresGuardados) {
      const paleta = JSON.parse(coloresGuardados);
      document.documentElement.style.setProperty('--color-primary', paleta.color_primario);
      document.documentElement.style.setProperty('--color-secondary', paleta.color_secundario);
      document.documentElement.style.setProperty('--color-accent', paleta.color_terciario);
      document.documentElement.style.setProperty('--color-text', paleta.color_texto);
      document.documentElement.style.setProperty('--color-background', paleta.color_fondo);
    } else {
      const coloresOriginales = {
        color_primario: '#7AB730',
        color_secundario: '#5f8f25',
        color_terciario: '#89b70d',
        color_texto: '#212121',
        color_fondo: '#FFFFFF',
      };
      Object.entries(coloresOriginales).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key.replace('_', '-')}`, value);
      });
    }
    // Aplicar configuración de tipografía/tamaños guardada
    const tipografiaGuardada = localStorage.getItem('tipografiaConfig');
    if (tipografiaGuardada) {
      const config = JSON.parse(tipografiaGuardada);
      document.documentElement.style.setProperty('--font-heading', config.fuente_titulo);
      document.documentElement.style.setProperty('--font-main', config.fuente_texto);
      document.documentElement.style.setProperty('--font-size-title', `${config.tam_titulo}px`);
      document.documentElement.style.setProperty('--font-size-subtitle', `${config.tam_subtitulo}px`);
      document.documentElement.style.setProperty('--font-size-paragraph', `${config.tam_texto}px`);
    }
  }, []);

  React.useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      localStorage.setItem('splashShown', 'true');
      setShowSplash(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, [showSplash]);

  return (
    <div>
      {showSplash ? (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'linear-gradient(135deg, #1a1a2e, #2a2a2a)',
          transition: 'opacity 1.2s',
        }}>
          <iframe
            src="/privado/animacion_b3.html"
            title="Animación Tangram 3D"
            style={{
              width: '100vw',
              height: '100vh',
              border: 'none',
              display: 'block',
              background: 'transparent',
            }}
            allowFullScreen
          />
        </div>
      ) : (
        <>
          {!shouldHideHeader && (
            <>
              <Topbar />
              <Navbar isLoggedIn={!!token} onLogout={logout} />
            </>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/completar-perfil" element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/configuraciones" element={
              <AdminRoute>
                <Configuraciones />
              </AdminRoute>
            } />
            <Route path="/usuarios-admin" element={
              <AdminRoute>
                <UsuariosAdmin />
              </AdminRoute>
            } />
            <Route path="/usuarios" element={<UsuariosProtected />} />
            <Route path="/service" element={<Service />} />
            <Route path="/single" element={<Single />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/destination" element={<Destination />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/package" element={<Package />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
