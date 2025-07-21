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
    const doc = new jsPDF();
    doc.addImage(logoUsuarios, 'SVG', 10, 10, 20, 20);
    doc.text('Lista de Usuarios', 14, 35);
    autoTable(doc, {
      head: [basicFields.map(f => basicLabels[f] || f)],
      body: users.map(user => basicFields.map(f => user[f] ?? '')),
      styles: { fontSize: 7 },
      startY: 40
    });
    doc.save('usuarios.pdf');
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