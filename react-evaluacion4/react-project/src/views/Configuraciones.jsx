import React, { useState, useEffect, useCallback } from 'react';
import {
  getColores,
  createColor,
  updateColor,
  deleteColor,
  getTipografiaTamanio,
  createTipografiaTamanio,
  updateTipografiaTamanio,
  deleteTipografiaTamanio
} from '../api';
import Home from './Home';
import { useCarousel } from '../context/CarouselContext';

const COLORES_ORIGINALES = {
  nombre_paleta: '',
  color_primario: '#7AB730',
  color_secundario: '#5f8f25',
  color_terciario: '#89b70d',
  color_texto: '#212121',
  color_fondo: '#FFFFFF',
};
const CONFIG_ORIGINAL = {
  nombre: '',
  fuente_titulo: 'Montserrat, Arial, sans-serif',
  fuente_texto: 'Montserrat, Arial, sans-serif',
  tam_titulo: 40,
  tam_subtitulo: 24,
  tam_texto: 16,
};
const COLORES_FIGURAS_ORIGINALES = [
  '#cd0e66', '#0f82f2', '#6d3bbf', '#fd8c00', '#eb4726', '#009ea6', '#22ab24'
];

const Configuraciones = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const [paletas, setPaletas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [colorForm, setColorForm] = useState({ ...COLORES_ORIGINALES });
  const [configs, setConfigs] = useState([]);
  const [configForm, setConfigForm] = useState({ ...CONFIG_ORIGINAL });
  const [coloresFiguras, setColoresFiguras] = useState(
    JSON.parse(localStorage.getItem('coloresFigurasSplash')) || COLORES_FIGURAS_ORIGINALES
  );
  const { carouselImages, addCarouselImage, removeCarouselImage } = useCarousel();

  // Definir fetchPaletas y fetchConfigs con useCallback ANTES del useEffect principal
  const fetchPaletas = useCallback(async () => {
    try {
      const response = await getColores();
      setPaletas(response);
    } catch (error) {
      console.error('Error al cargar paletas:', error);
      alert('No se pudieron cargar las paletas.');
    }
  }, []);

  const fetchConfigs = useCallback(async () => {
    try {
      const res = await getTipografiaTamanio();
      setConfigs(res);
      if (res.length > 0) {
        aplicarConfig(res[res.length - 1]);
      }
    } catch (error) {
      console.error('Error al cargar configuraciones:', error);
      // Puede no haber configs
    }
  }, []);

  useEffect(() => {
    // Leer configuración de colores guardada
    const coloresGuardados = localStorage.getItem('coloresConfig');
    if (coloresGuardados) {
      const paleta = JSON.parse(coloresGuardados);
      setColorForm(paleta);
      aplicarEstilos(paleta);
    } else {
      fetchPaletas();
    }
    // Leer configuración de tipografía guardada
    const tipografiaGuardada = localStorage.getItem('tipografiaConfig');
    if (tipografiaGuardada) {
      const config = JSON.parse(tipografiaGuardada);
      setConfigForm(config);
      aplicarConfig(config);
    } else {
      fetchConfigs();
    }
  }, [fetchPaletas, fetchConfigs]);

  useEffect(() => {
    aplicarEstilos(colorForm);
  }, [colorForm]);

  useEffect(() => {
    aplicarConfig(configForm);
  }, [configForm]);

  const guardarPaleta = async (e) => {
    e.preventDefault();
    try {
      if (editandoId && activeTab === 'colors') {
        await updateColor(editandoId, colorForm);
      } else if (activeTab === 'colors') {
        await createColor(colorForm);
      }
      fetchPaletas();
      cancelarEdicion();
    } catch {
      alert('Error al guardar la paleta.');
    }
  };

  const editarPaleta = (paleta) => {
    setEditandoId(paleta.id);
    setColorForm({ ...paleta });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setColorForm({ ...COLORES_ORIGINALES });
    setConfigForm({ ...CONFIG_ORIGINAL });
  };

  const eliminarPaleta = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta paleta?')) return;
    try {
      await deleteColor(id);
      fetchPaletas();
    } catch {
      alert('Error al eliminar la paleta.');
    }
  };

  const revertirColoresOriginales = () => {
    setColorForm({ ...COLORES_ORIGINALES });
  };

  const handleRemoveCarouselImage = (imageId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen del carrusel?')) {
      removeCarouselImage(imageId);
    }
  };

  // Guardar y aplicar colores globalmente y en la vista previa
  function aplicarEstilos(paleta) {
    document.documentElement.style.setProperty('--color-primary', paleta.color_primario);
    document.documentElement.style.setProperty('--color-secondary', paleta.color_secundario);
    document.documentElement.style.setProperty('--color-accent', paleta.color_terciario);
    document.documentElement.style.setProperty('--color-text', paleta.color_texto);
    document.documentElement.style.setProperty('--color-background', paleta.color_fondo);
    localStorage.setItem('coloresConfig', JSON.stringify(paleta));
  }

  // --- Tipografías y Tamaños ---
  const guardarConfig = async (e) => {
    e.preventDefault();
    try {
      if (editandoId && activeTab === 'styles') {
        await updateTipografiaTamanio(editandoId, configForm);
      } else if (activeTab === 'styles') {
        await createTipografiaTamanio(configForm);
      }
      await fetchConfigs();
      if (configs.length > 0) {
        aplicarConfig(configs[configs.length - 1]);
      }
      alert('Configuración de tipografía y tamaños guardada y aplicada correctamente.');
      cancelarEdicion();
    } catch {
      alert('Error al guardar la configuración.');
    }
  };

  const editarConfig = (config) => {
    setEditandoId(config.id);
    setConfigForm({ ...config });
  };

  const eliminarConfig = async (id) => {
    if (!window.confirm('¿Eliminar configuración?')) return;
    await deleteTipografiaTamanio(id);
    fetchConfigs();
  };

  const restaurarValores = () => {
    setConfigForm({ ...CONFIG_ORIGINAL });
    aplicarConfig(CONFIG_ORIGINAL);
    alert('Valores predeterminados restaurados.');
  };

  // Guardar y aplicar tipografía/tamaños globalmente y en la vista previa
  function aplicarConfig(config) {
    document.documentElement.style.setProperty('--font-heading', config.fuente_titulo);
    document.documentElement.style.setProperty('--font-main', config.fuente_texto);
    document.documentElement.style.setProperty('--font-size-title', `${config.tam_titulo}px`);
    document.documentElement.style.setProperty('--font-size-subtitle', `${config.tam_subtitulo}px`);
    document.documentElement.style.setProperty('--font-size-paragraph', `${config.tam_texto}px`);
    localStorage.setItem('tipografiaConfig', JSON.stringify(config));
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 mb-4">
            <div className="card-body p-4">
              <h3 className="mb-4 text-success">Panel de Control de Estilos</h3>
              <ul className="nav nav-pills mb-4" role="tablist">
                <li className="nav-item">
                  <button className={`nav-link${activeTab === 'colors' ? ' active' : ''}`} onClick={() => { setActiveTab('colors'); cancelarEdicion(); }}>Colores</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link${activeTab === 'styles' ? ' active' : ''}`} onClick={() => { setActiveTab('styles'); cancelarEdicion(); }}>Tipografía</button>
                </li>
              </ul>
              {/* Módulo de Figuras Splash */}
              <div className="card shadow-lg border-0 mb-4">
                <div className="card-body p-4">
                  <h4 className="mb-3 text-primary">Colores de Figuras Splash</h4>
                  {coloresFiguras.map((color, idx) => (
                    <div key={idx} className="mb-2 d-flex align-items-center">
                      <label className="me-2">Figura {idx + 1}:</label>
                      <input
                        type="color"
                        value={color}
                        onChange={e => {
                          const nuevos = [...coloresFiguras];
                          nuevos[idx] = e.target.value;
                          setColoresFiguras(nuevos);
                          localStorage.setItem('coloresFigurasSplash', JSON.stringify(nuevos));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Fin módulo figuras */}
              {activeTab === 'colors' && (
                <div>
                  <h4 className="section-title">Paletas Guardadas</h4>
                  {!paletas.length && <div className="text-muted">No hay paletas guardadas.</div>}
                  {paletas.map((paleta) => (
                    <div key={paleta.id} className="paleta-card">
                      <span className="paleta-nombre">{paleta.nombre_paleta}</span>
                      <div className="paleta-actions">
                        <button onClick={() => aplicarEstilos(paleta)} className="btn btn-info btn-sm" title="Aplicar">Aplicar</button>
                        <button onClick={() => editarPaleta(paleta)} className="btn btn-warning btn-sm" title="Editar">Editar</button>
                        <button onClick={() => eliminarPaleta(paleta.id)} className="btn btn-danger btn-sm" title="Eliminar">Eliminar</button>
                      </div>
                    </div>
                  ))}
                  <hr />
                  <h4 className="section-title">{editandoId && activeTab === 'colors' ? 'Editando Paleta' : 'Nueva Paleta'}</h4>
                  <form onSubmit={guardarPaleta} className="row g-3">
                    <div className="col-12">
                      <label>Nombre de la Paleta</label>
                      <input type="text" className="form-control" value={colorForm.nombre_paleta} onChange={e => setColorForm(f => ({ ...f, nombre_paleta: e.target.value }))} required />
                    </div>
                    <div className="col-6">
                      <label>Primario</label>
                      <input type="color" className="form-control form-control-color" value={colorForm.color_primario} onChange={e => setColorForm(f => ({ ...f, color_primario: e.target.value }))} />
                    </div>
                    <div className="col-6">
                      <label>Secundario</label>
                      <input type="color" className="form-control form-control-color" value={colorForm.color_secundario} onChange={e => setColorForm(f => ({ ...f, color_secundario: e.target.value }))} />
                    </div>
                    <div className="col-6">
                      <label>Terciario</label>
                      <input type="color" className="form-control form-control-color" value={colorForm.color_terciario} onChange={e => setColorForm(f => ({ ...f, color_terciario: e.target.value }))} />
                    </div>
                    <div className="col-6">
                      <label>Texto</label>
                      <input type="color" className="form-control form-control-color" value={colorForm.color_texto} onChange={e => setColorForm(f => ({ ...f, color_texto: e.target.value }))} />
                    </div>
                    <div className="col-6">
                      <label>Fondo</label>
                      <input type="color" className="form-control form-control-color" value={colorForm.color_fondo} onChange={e => setColorForm(f => ({ ...f, color_fondo: e.target.value }))} />
                    </div>
                    <div className="col-12 d-flex gap-2">
                      <button type="submit" className="btn btn-primary w-100">{editandoId && activeTab === 'colors' ? 'Actualizar Paleta' : 'Guardar Nueva Paleta'}</button>
                      {editandoId && activeTab === 'colors' && <button onClick={cancelarEdicion} type="button" className="btn btn-secondary w-100">Cancelar Edición</button>}
                    </div>
                    <div className="col-12">
                      <button onClick={revertirColoresOriginales} type="button" className="btn btn-outline-dark w-100 mt-2">Restaurar Colores Originales</button>
                    </div>
                  </form>
                  {activeTab === 'colors' && (
                    <div className="mt-3">
                      <button className="btn btn-outline-primary w-100" onClick={() => window.location.href = '/'}>Ir al Home</button>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'styles' && (
                <div>
                  <h4 className="section-title">Tamaños y Tipografía</h4>
                  <form onSubmit={guardarConfig} className="row g-3">
                    <div className="col-12">
                      <label>Nombre de la Configuración</label>
                      <input type="text" className="form-control" value={configForm.nombre} onChange={e => setConfigForm(f => ({ ...f, nombre: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <label>Fuente para Título</label>
                      <input type="text" className="form-control" value={configForm.fuente_titulo} onChange={e => setConfigForm(f => ({ ...f, fuente_titulo: e.target.value }))} placeholder="Ej: Montserrat, Arial, etc." required />
                    </div>
                    <div className="col-12">
                      <label>Fuente para Texto</label>
                      <input type="text" className="form-control" value={configForm.fuente_texto} onChange={e => setConfigForm(f => ({ ...f, fuente_texto: e.target.value }))} placeholder="Ej: Montserrat, Arial, etc." required />
                    </div>
                    <div className="col-4">
                      <label>Tamaño Título (px)</label>
                      <input type="number" className="form-control" value={configForm.tam_titulo} onChange={e => setConfigForm(f => ({ ...f, tam_titulo: e.target.value }))} required />
                    </div>
                    <div className="col-4">
                      <label>Tamaño Subtítulo (px)</label>
                      <input type="number" className="form-control" value={configForm.tam_subtitulo} onChange={e => setConfigForm(f => ({ ...f, tam_subtitulo: e.target.value }))} required />
                    </div>
                    <div className="col-4">
                      <label>Tamaño Texto (px)</label>
                      <input type="number" className="form-control" value={configForm.tam_texto} onChange={e => setConfigForm(f => ({ ...f, tam_texto: e.target.value }))} required />
                    </div>
                    <div className="col-12 d-flex gap-2">
                      <button type="submit" className="btn btn-primary w-100">{editandoId && activeTab === 'styles' ? 'Actualizar' : 'Guardar'}</button>
                      {editandoId && activeTab === 'styles' && <button onClick={cancelarEdicion} type="button" className="btn btn-secondary w-100">Cancelar Edición</button>}
                      <button onClick={restaurarValores} type="button" className="btn btn-outline-dark w-100">Restaurar Valores Predeterminados</button>
                    </div>
                  </form>
                  <h4 className="section-title mt-4">Configuraciones Guardadas</h4>
                  {!configs.length && <div className="text-muted">No hay configuraciones guardadas.</div>}
                  {configs.map((config) => (
                    <div key={config.id} className="d-flex align-items-center mb-2">
                      <span className="me-2">{config.nombre}</span>
                      <div className="d-flex gap-2">
                        <button onClick={() => aplicarConfig(config)} className="btn btn-info btn-sm me-1" title="Aplicar">Aplicar</button>
                        <button onClick={() => editarConfig(config)} className="btn btn-warning btn-sm me-1" title="Editar">Editar</button>
                        <button onClick={() => eliminarConfig(config.id)} className="btn btn-danger btn-sm" title="Eliminar">Eliminar</button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-3">
                    <button className="btn btn-outline-primary w-100" onClick={() => window.location.href = '/'}>Ir al Home</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Vista Previa en Vivo */}
        <div className="col-md-7">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white">
              <i className="fas fa-eye"></i> Vista Previa en Vivo
            </div>
            <div className="card-body p-0" style={{ minHeight: 400 }}>
              <Home isPreview={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuraciones; 