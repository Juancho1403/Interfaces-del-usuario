import React, { useState, useEffect } from 'react';
import { getColores, getTipografias, getTamaniosFuente } from '../api';

const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [data, setData] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Probar conexión con diferentes endpoints
        const colores = await getColores();
        const tipografias = await getTipografias();
        const tamanios = await getTamaniosFuente();
        
        setData({
          colores: colores.length,
          tipografias: tipografias.length,
          tamanios: tamanios.length
        });
        setConnectionStatus('✅ Conexión exitosa con el backend');
      } catch (error) {
        console.error('Error de conexión:', error);
        setConnectionStatus(`❌ Error de conexión: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Test de Conexión Backend-Frontend</h3>
      <p><strong>Estado:</strong> {connectionStatus}</p>
      {data && (
        <div>
          <p><strong>Datos recibidos:</strong></p>
          <ul>
            <li>Colores: {data.colores} registros</li>
            <li>Tipografías: {data.tipografias} registros</li>
            <li>Tamaños de fuente: {data.tamanios} registros</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest; 