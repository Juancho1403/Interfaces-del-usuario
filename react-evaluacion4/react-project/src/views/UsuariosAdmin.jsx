import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import logoUsuarios from '../assets/logo-usuarios.svg';

const UsuariosAdmin = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('role') === 'admin');
    fetchUsuarios();
    // eslint-disable-next-line
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/usuarios/admin', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch {
      alert('Error al cargar usuarios');
    }
  };

  const verDetalles = (user) => {
    alert(JSON.stringify(user, null, 2));
  };

  const deshabilitarUsuario = async (id) => {
    if (!window.confirm('¿Deshabilitar este usuario?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/api/usuarios/${id}/disable`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Usuario deshabilitado');
      fetchUsuarios();
    } catch {
      alert('Error al deshabilitar usuario');
    }
  };

  // 1. Generar lista de campos planos para tabla y exportaciones
  const basicFields = [
    'id', 'firstName', 'lastName', 'email', 'phone', 'age', 'role', 'estado'
  ];
  const basicLabels = {
    id: 'ID',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    age: 'Edad',
    role: 'Rol',
    estado: 'Estado'
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 20;
      const logoX = 10; // Posicionado a la izquierda
      let logoOk = false;
      
      // Crear el logo "Ji" con el diseño específico
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        // Fondo circular azul
        ctx.fillStyle = '#0066cc';
        ctx.beginPath();
        ctx.arc(60, 60, 55, 0, 2 * Math.PI);
        ctx.fill();
        
        // Sombra sutil
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Letra "J" en blanco
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('J', 45, 75);
        
        // Letra "i" en amarillo
        ctx.fillStyle = '#ffcc00';
        ctx.fillText('i', 75, 75);
        
        // Punto de la "i" como cuadrado
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(78, 25, 6, 6);
        
        // Puntos conectados en el perímetro
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        const dots = [
          {x: 60, y: 10}, {x: 110, y: 60}, 
          {x: 60, y: 110}, {x: 10, y: 60}
        ];
        
        dots.forEach(dot => {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 3, 0, 2 * Math.PI);
          ctx.fill();
        });
        
        // Líneas conectando los puntos
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dots[0].x, dots[0].y);
        ctx.lineTo(dots[1].x, dots[1].y);
        ctx.lineTo(dots[2].x, dots[2].y);
        ctx.lineTo(dots[3].x, dots[3].y);
        ctx.closePath();
        ctx.stroke();
        
        const logoDataURL = canvas.toDataURL('image/png');
        doc.addImage(logoDataURL, 'PNG', logoX, 10, logoWidth, 20);
        logoOk = true;
      } catch (e) {
        console.log('Error al crear logo Ji:', e);
        logoOk = false;
      }
      
      doc.setFontSize(16);
      doc.text('Lista de Usuarios', logoOk ? 35 : 14, logoOk ? 35 : 25);
      
      autoTable(doc, {
        head: [basicFields.map(f => basicLabels[f] || f)],
        body: users.map(user => basicFields.map(f => user[f] ?? '')),
        styles: { fontSize: 7 },
        startY: logoOk ? 40 : 30,
        headStyles: { fillColor: [122, 183, 48], textColor: 255, halign: 'center' },
        bodyStyles: { halign: 'center' },
        theme: 'grid',
        margin: { left: 10, right: 10 },
        tableWidth: 'auto',
      });
      
      doc.save('usuarios.pdf');
      alert('PDF descargado correctamente.');
    } catch (e) {
      console.error('Error al generar PDF:', e);
      alert('Error al generar el PDF: ' + e.message);
    }
  };
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users.map(user => {
      const row = {};
      basicFields.forEach(f => {
        row[basicLabels[f] || f] = user[f] ?? '';
      });
      return row;
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, 'usuarios.xlsx');
  };

  if (!isAdmin) {
    return <div className="alert alert-danger text-center mt-5">No tienes permisos para acceder a esta vista.</div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card p-4">
            <h2 className="mb-4 text-center">Usuarios (Admin)</h2>
            <button className="btn btn-danger mb-3" onClick={downloadPDF}>
              <i className="fa fa-file-pdf-o mr-1"></i> Descargar PDF
            </button>
            <button className="btn btn-success mb-3" onClick={downloadExcel}>
              <i className="fa fa-file-excel-o mr-1"></i> Descargar Excel
            </button>
            <table className="table table-bordered" id="datatable">
              <thead>
                <tr>
                  {basicFields.map(f => (
                    <th key={f}>{basicLabels[f] || f}</th>
                  ))}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    {basicFields.map(f => (
                      <td key={f}>{user[f] ?? ''}</td>
                    ))}
                    <td>
                      <button className="btn btn-info btn-sm mr-2" onClick={() => verDetalles(user)}>Ver</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deshabilitarUsuario(user.id)}>Deshabilitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosAdmin; 