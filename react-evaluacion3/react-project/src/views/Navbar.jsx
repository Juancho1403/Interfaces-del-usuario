import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout }) {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <div className="container-fluid position-relative nav-bar p-0">
      <div className="container-lg position-relative p-0 px-lg-3" style={{ zIndex: 9 }}>
        <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-lg py-3 py-lg-0 px-3">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <h1 className="m-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
              <span style={{ color: '#222' }}>TRAVEL</span><span style={{ color: '#7AB730' }}>ER</span>
            </h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end px-3" id="navbarCollapse">
            <div className="navbar-nav ml-auto py-0 d-flex align-items-center flex-lg-nowrap flex-wrap justify-content-lg-end" style={{ fontSize: '1.15rem', fontWeight: 500, gap: 24 }}>
              <NavLink to="/" className={({ isActive }) => 'nav-item nav-link' + (isActive ? ' active' : '')} end>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => 'nav-item nav-link' + (isActive ? ' active' : '')}>About</NavLink>
              <NavLink to="/service" className={({ isActive }) => 'nav-item nav-link' + (isActive ? ' active' : '')}>Services</NavLink>
              <NavLink to="/package" className={({ isActive }) => 'nav-item nav-link' + (isActive ? ' active' : '')}>Tour Packages</NavLink>
              {/* Solo admin puede ver Usuarios y Configuraciones */}
              {isLoggedIn && role === 'admin' && (
                <>
                  <NavLink to="/Usuarios" className={({ isActive }) => 'nav-item nav-link' + (isActive ? ' active' : '')}>Usuarios</NavLink>
                  <NavLink to="/Configuraciones" className={({ isActive }) => 'nav-item nav-link' + (isActive ? ' active' : '')}>Configuraciones</NavLink>
                </>
              )}
              {/* Usuarios normales solo pueden ver Usuarios si están logueados */}
              {isLoggedIn && role !== 'admin' && (
                <NavLink to="/usuarios" className={({ isActive }) => 'nav-item nav-link' + (isActive ? ' active' : '')}>Usuarios</NavLink>
              )}
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                <div className="dropdown-menu border-0 rounded-0 m-0">
                  <NavLink to="/blog" className="dropdown-item">Blog Grid</NavLink>
                  <NavLink to="/single" className="dropdown-item">Blog Detail</NavLink>
                  <NavLink to="/destination" className="dropdown-item">Destination</NavLink>
                  <NavLink to="/guide" className="dropdown-item">Travel Guides</NavLink>
                  <NavLink to="/testimonial" className="dropdown-item">Testimonial</NavLink>
                </div>
              </div>
              <NavLink to="/contact" className={({ isActive }) => 'nav-item nav-link' + (isActive ? ' active' : '')}>Contact</NavLink>
              {/* Botones de sesión */}
              {!isLoggedIn && (
                <>
                  <NavLink to="/login" className={({ isActive }) => 'btn btn-success ml-2' + (isActive ? ' active' : '')} style={{ minWidth: 130 }}>Iniciar Sesión</NavLink>
                  <NavLink to="/register" className={({ isActive }) => 'btn btn-outline-primary ml-2' + (isActive ? ' active' : '')} style={{ minWidth: 130 }}>Registrarse</NavLink>
                </>
              )}
              {isLoggedIn && (
                <button className="btn btn-danger ml-2" style={{ minWidth: 130 }} onClick={handleLogout}>Salir de sesión</button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}