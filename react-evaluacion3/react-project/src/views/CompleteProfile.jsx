import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', age: '', gender: '', birthDate: '', maidenName: '', username: '', phone: '', university: '', company_name: '', company_title: '', company_department: '', bloodGroup: '', address_address: '', address_city: '', address_state: '', address_postalCode: '', address_country: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/api/usuarios/profile', form, { headers: { Authorization: `Bearer ${token}` } });
      alert('Perfil actualizado');
      navigate('/perfil');
    } catch (e) {
      alert('Error al guardar perfil');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            <h2 className="mb-4 text-center">Completar Perfil</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Nombre</label>
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group col-md-6">
                  <label>Apellido</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label>Edad</label>
                  <input type="number" name="age" value={form.age} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group col-md-4">
                  <label>Género</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="form-control" required>
                    <option value="">Seleccionar</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label>Fecha de Nacimiento</label>
                  <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Apellido de Soltera</label>
                  <input type="text" name="maidenName" value={form.maidenName} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group col-md-6">
                  <label>Username</label>
                  <input type="text" name="username" value={form.username} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Teléfono</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group col-md-6">
                  <label>Universidad</label>
                  <input type="text" name="university" value={form.university} onChange={handleChange} className="form-control" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Empresa</label>
                  <input type="text" name="company_name" value={form.company_name} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group col-md-6">
                  <label>Cargo</label>
                  <input type="text" name="company_title" value={form.company_title} onChange={handleChange} className="form-control" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Departamento</label>
                  <input type="text" name="company_department" value={form.company_department} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group col-md-6">
                  <label>Grupo Sanguíneo</label>
                  <input type="text" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="form-control" />
                </div>
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input type="text" name="address_address" value={form.address_address} onChange={handleChange} className="form-control" required />
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label>Ciudad</label>
                  <input type="text" name="address_city" value={form.address_city} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group col-md-4">
                  <label>Estado</label>
                  <input type="text" name="address_state" value={form.address_state} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group col-md-4">
                  <label>Código Postal</label>
                  <input type="text" name="address_postalCode" value={form.address_postalCode} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="form-group">
                <label>País</label>
                <input type="text" name="address_country" value={form.address_country} onChange={handleChange} className="form-control" required />
              </div>
              <button type="submit" className="btn btn-success w-100">Guardar Perfil</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile; 