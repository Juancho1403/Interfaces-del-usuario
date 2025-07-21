import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/usuarios/profile', { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data);
      } catch (e) {
        alert('Error al cargar perfil');
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            <h2 className="mb-4 text-center">Mi Perfil</h2>
            {user ? (
              <>
                <div className="row">
                  <div className="col-md-6"><strong>Nombre:</strong> {user.firstName}</div>
                  <div className="col-md-6"><strong>Apellido:</strong> {user.lastName}</div>
                </div>
                <div className="row">
                  <div className="col-md-4"><strong>Edad:</strong> {user.age}</div>
                  <div className="col-md-4"><strong>Género:</strong> {user.gender}</div>
                  <div className="col-md-4"><strong>Username:</strong> {user.username}</div>
                </div>
                <div className="row">
                  <div className="col-md-6"><strong>Email:</strong> {user.email}</div>
                  <div className="col-md-6"><strong>Teléfono:</strong> {user.phone}</div>
                </div>
                <div className="row">
                  <div className="col-md-6"><strong>Universidad:</strong> {user.university}</div>
                  <div className="col-md-6"><strong>Empresa:</strong> {user.company_name}</div>
                </div>
                <div className="row">
                  <div className="col-md-6"><strong>Cargo:</strong> {user.company_title}</div>
                  <div className="col-md-6"><strong>Departamento:</strong> {user.company_department}</div>
                </div>
                <div className="row">
                  <div className="col-md-6"><strong>Dirección:</strong> {user.address_address}</div>
                  <div className="col-md-6"><strong>Ciudad:</strong> {user.address_city}</div>
                </div>
                <div className="row">
                  <div className="col-md-6"><strong>Estado:</strong> {user.address_state}</div>
                  <div className="col-md-6"><strong>Código Postal:</strong> {user.address_postalCode}</div>
                </div>
                <div className="row">
                  <div className="col-md-6"><strong>País:</strong> {user.address_country}</div>
                  <div className="col-md-6"><strong>Grupo Sanguíneo:</strong> {user.bloodGroup}</div>
                </div>
              </>
            ) : (
              <div className="text-center">Cargando...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 