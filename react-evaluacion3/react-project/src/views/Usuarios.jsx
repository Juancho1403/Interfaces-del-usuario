import React, { useState, useEffect, useCallback } from 'react';
import logoUsuarios from '../assets/logo-usuarios.svg';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import ProtectedRoute from '../ProtectedRoute';

const initialFormData = {
  id: '',
  firstName: '',
  lastName: '',
  maidenName: '',
  age: '',
  gender: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  birthDate: '',
  image: '',
  bloodGroup: '',
  height: '',
  weight: '',
  eyeColor: '',
  hair: {
    color: '',
    type: ''
  },
  ip: '',
  address: {
    address: '',
    city: '',
    state: '',
    stateCode: '',
    postalCode: '',
    coordinates: {
      lat: '',
      lng: ''
    },
    country: ''
  },
  macAddress: '',
  university: '',
  bank: {
    cardExpire: '',
    cardNumber: '',
    cardType: '',
    currency: '',
    iban: ''
  },
  company: {
    department: '',
    name: '',
    title: '',
    address: {
      address: '',
      city: '',
      state: '',
      stateCode: '',
      postalCode: '',
      coordinates: {
        lat: '',
        lng: ''
      },
      country: ''
    }
  },
  ein: '',
  ssn: '',
  userAgent: '',
  crypto: {
    coin: '',
    wallet: '',
    network: ''
  },
  role: ''
};

const Usuarios = () => {
  // Campos básicos y labels para tabla, PDF y Excel
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
  const [activeTab, setActiveTab] = useState('register');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ ...initialFormData });
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  // Asegura que existan los siguientes hooks y funciones:
  const [errors, setErrors] = useState({});

  // Mueve wizardSteps aquí, antes de cualquier uso
  const wizardSteps = [
    {
      label: 'Personal',
      fields: [
        'id', 'firstName', 'lastName', 'maidenName', 'age', 'gender', 'birthDate', 'image', 'height', 'weight', 'eyeColor', 'hair.color', 'hair.type', 'bloodGroup'
      ]
    },
    {
      label: 'Contacto',
      fields: [
        'email', 'phone', 'username', 'password', 'ip', 'macAddress', 'address.address', 'address.city', 'address.state', 'address.stateCode', 'address.postalCode', 'address.coordinates.lat', 'address.coordinates.lng', 'address.country'
      ]
    },
    {
      label: 'Profesional',
      fields: [
        'university', 'company.name', 'company.title', 'company.department', 'company.address.address', 'company.address.city', 'company.address.state', 'company.address.stateCode', 'company.address.postalCode', 'company.address.coordinates.lat', 'company.address.coordinates.lng', 'company.address.country', 'bank.cardExpire', 'bank.cardNumber', 'bank.cardType', 'bank.currency', 'bank.iban', 'ein', 'ssn', 'userAgent', 'crypto.coin', 'crypto.wallet', 'crypto.network', 'role'
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Soporta campos anidados
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData((prev) => {
        let updated = { ...prev };
        let obj = updated;
        for (let i = 0; i < parts.length - 1; i++) {
          obj[parts[i]] = { ...obj[parts[i]] };
          obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setIsEditMode(false);
    setIsViewMode(false);
    setEditUserId(null);
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep - 1)) {
      return;
    }
    setIsLoading(true);
    try {
      if (isEditMode) {
        await updateUsuario(editUserId, formData);
        alert('Usuario actualizado correctamente');
      } else {
        await createUsuario(formData);
        alert('Usuario registrado correctamente');
      }
      resetForm();
      if (isAdmin) fetchUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('Error al guardar usuario: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.addImage(logoUsuarios, 'SVG', 10, 10, 20, 20);
    doc.text('Lista de Usuarios', 14, 35);
    autoTable(doc, {
      startY: 40,
      head: [basicFields.map(f => basicLabels[f] || f)],
      body: users.map(user => basicFields.map(f => user[f] ?? '')),
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

  const viewUser = (user) => {
    setFormData({ ...user });
    setIsViewMode(true);
    setIsEditMode(false);
    setEditUserId(user.id);
    setActiveTab('register');
    setCurrentStep(1);
  };
  const editUser = (user) => {
    setFormData({ ...user });
    setIsEditMode(true);
    setIsViewMode(false);
    setEditUserId(user.id);
    setActiveTab('register');
    setCurrentStep(1);
  };
  const toggleUserStatus = async (user) => {
    try {
      const updatedUser = { ...user, estado: user.estado === 'activo' ? 'inactivo' : 'activo' };
      await updateUsuario(user.id, updatedUser);
      alert(`Usuario ${updatedUser.estado === 'activo' ? 'activado' : 'desactivado'} correctamente`);
      fetchUsers();
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      alert('Error al cambiar estado del usuario');
    }
  };

  // Validaciones
  const validateLettersOnly = (value) => /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value);
  const validateNumbersOnly = (value) => /^\d*$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value) => /^\+?\d{7,15}$/.test(value);
  const validateUsername = (value) => /^[a-zA-Z0-9_-]{3,20}$/.test(value);

  // Validaciones en español para cada campo
  const validateField = (field, value) => {
    if ([
      'firstName', 'lastName', 'maidenName', 'company.name', 'company.department', 'company.title', 'company.address.city', 'company.address.state', 'company.address.country', 'address.city', 'address.state', 'address.country', 'university'
    ].includes(field) && (!value || !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value))) {
      return 'Solo letras';
    }
    if ([
      'age', 'height', 'weight', 'address.postalCode', 'company.address.postalCode', 'address.coordinates.lat', 'address.coordinates.lng', 'company.address.coordinates.lat', 'company.address.coordinates.lng', 'ein', 'ssn'
    ].includes(field) && (value === '' || isNaN(value))) {
      return 'Debe ser numérico';
    }
    if (field === 'email' && (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
      return 'Correo electrónico inválido';
    }
    if (field === 'phone' && (!value || !/^\+?\d{7,15}$/.test(value))) {
      return 'Teléfono inválido';
    }
    if (field === 'username' && (!value || !/^[a-zA-Z0-9_-]{3,20}$/.test(value))) {
      return 'Usuario inválido (3-20 caracteres, letras, números, guion o guion bajo)';
    }
    if (field === 'password' && (!value || value.length < 6)) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (field === 'birthDate' && (!value || !/^\d{4}-\d{1,2}-\d{1,2}$/.test(value))) {
      return 'Formato de fecha: aaaa-mm-dd';
    }
    if (!value && !['image','eyeColor','hair.color','hair.type','macAddress','ip','userAgent','crypto.coin','crypto.wallet','crypto.network','bank.cardExpire','bank.cardNumber','bank.cardType','bank.currency','bank.iban'].includes(field)) {
      return 'Este campo es obligatorio';
    }
    return '';
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const usuarios = await getUsuarios();
      setUsers(usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios: ' + (error.response?.data?.message || error.message));
    }
    setIsLoading(false);
  }, []);

  // Fetch users (for admin)
  useEffect(() => {
    setIsAdmin(localStorage.getItem('role') === 'admin');
    if (localStorage.getItem('role') === 'admin') {
      fetchUsers();
    }
  }, [fetchUsers]);

  // Wizard navigation
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Validación de todos los campos del paso actual
  const validateStep = (stepIdx) => {
    const step = wizardSteps[stepIdx];
    let valid = true;
    let newErrors = {};
    step.fields.forEach(field => {
      // Obtener valor anidado
      let value = field.split('.').reduce((o, k) => (o || {})[k], formData);
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const goToStep = (idx) => {
    if (idx < currentStep) {
      setCurrentStep(idx);
    } else if (validateStep(currentStep-1)) {
      setCurrentStep(idx);
    }
  };

  // Calcula si el paso actual es válido
  const isCurrentStepValid = () => {
    const stepIdx = currentStep - 1;
    const step = wizardSteps[stepIdx];
    let valid = true;
    for (let field of step.fields) {
      let value = field.split('.').reduce((o, k) => (o || {})[k], formData);
      const error = validateField(field, value);
      if (error) {
        valid = false;
        break;
      }
    }
    return valid;
  };

  // Diccionario de traducción de campos a español
  const fieldLabels = {
    id: 'ID',
    firstName: 'Nombre',
    lastName: 'Apellido',
    maidenName: 'Apellido de soltera',
    age: 'Edad',
    gender: 'Género',
    birthDate: 'Fecha de nacimiento',
    image: 'Imagen (URL)',
    height: 'Altura (cm)',
    weight: 'Peso (kg)',
    eyeColor: 'Color de ojos',
    'hair.color': 'Color de cabello',
    'hair.type': 'Tipo de cabello',
    bloodGroup: 'Grupo sanguíneo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    username: 'Usuario',
    password: 'Contraseña',
    ip: 'IP',
    macAddress: 'Dirección MAC',
    'address.address': 'Dirección',
    'address.city': 'Ciudad',
    'address.state': 'Estado',
    'address.stateCode': 'Código de estado',
    'address.postalCode': 'Código postal',
    'address.coordinates.lat': 'Latitud',
    'address.coordinates.lng': 'Longitud',
    'address.country': 'País',
    university: 'Universidad',
    'company.name': 'Empresa',
    'company.title': 'Cargo',
    'company.department': 'Departamento',
    'company.address.address': 'Dirección empresa',
    'company.address.city': 'Ciudad empresa',
    'company.address.state': 'Estado empresa',
    'company.address.stateCode': 'Código estado empresa',
    'company.address.postalCode': 'Código postal empresa',
    'company.address.coordinates.lat': 'Latitud empresa',
    'company.address.coordinates.lng': 'Longitud empresa',
    'company.address.country': 'País empresa',
    'bank.cardExpire': 'Vencimiento tarjeta',
    'bank.cardNumber': 'Número de tarjeta',
    'bank.cardType': 'Tipo de tarjeta',
    'bank.currency': 'Moneda',
    'bank.iban': 'IBAN',
    ein: 'EIN',
    ssn: 'SSN',
    userAgent: 'User Agent',
    'crypto.coin': 'Criptomoneda',
    'crypto.wallet': 'Wallet',
    'crypto.network': 'Red',
    role: 'Rol',
    estado: 'Estado'
  };

  // Generador dinámico de campos para el wizard
  const renderFields = (fields) => (
    <div className="row">
      {fields.map((field, idx) => {
        const fieldParts = field.split('.');
        let value = formData;
        let name = '';
        fieldParts.forEach((part, i) => {
          value = value ? value[part] : '';
          name += (i > 0 ? '.' : '') + part;
        });
        // Label amigable
        const label = fieldLabels[name] || fieldParts[fieldParts.length-1].replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        // Tipo de input
        let type = 'text';
        if (['age','height','weight','address.postalCode','company.address.postalCode','address.coordinates.lat','address.coordinates.lng','company.address.coordinates.lat','company.address.coordinates.lng'].includes(field)) type = 'number';
        if (['email'].includes(field)) type = 'email';
        if (['password'].includes(field)) type = 'password';
        if (['birthDate'].includes(field)) type = 'date';
        if (['image'].includes(field)) type = 'url';
        // Selects especiales
        if (field === 'gender') {
          return (
            <div className="col-md-6" key={field+idx}>
              <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <select id={name} name={name} value={value || ''} onChange={handleInputChange} className="form-control" disabled={isViewMode} required>
                  <option value="">Seleccionar</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
                {errors[name] && <div className="text-danger">{errors[name]}</div>}
              </div>
            </div>
          );
        }
        if (field === 'bloodGroup') {
          return (
            <div className="col-md-6" key={field+idx}>
              <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <select id={name} name={name} value={value || ''} onChange={handleInputChange} className="form-control" disabled={isViewMode}>
                  <option value="">Seleccionar grupo</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors[name] && <div className="text-danger">{errors[name]}</div>}
              </div>
            </div>
          );
        }
        if (field === 'role') {
          return (
            <div className="col-md-6" key={field+idx}>
              <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <select id={name} name={name} value={value || ''} onChange={handleInputChange} className="form-control" disabled={isViewMode} required>
                  <option value="">Seleccionar rol</option>
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
                {errors[name] && <div className="text-danger">{errors[name]}</div>}
              </div>
            </div>
          );
        }
        // Input genérico
        return (
          <div className="col-md-6" key={field+idx}>
            <div className="form-group">
              <label htmlFor={name}>{label}</label>
              <input type={type} id={name} name={name} value={value || ''} onChange={handleInputChange} className="form-control" disabled={isViewMode} required />
              {errors[name] && <div className="text-danger">{errors[name]}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );

  // 3. Renderiza los pasos del wizard con círculos clickeables y línea de progreso
  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="wizard-step">
          <h4 className="mb-4">Información Personal</h4>
          {renderFields(wizardSteps[0].fields)}
        </div>
      );
    }
    if (currentStep === 2) {
      return (
        <div className="wizard-step">
          <h4 className="mb-4">Información de Contacto</h4>
          {renderFields(wizardSteps[1].fields)}
        </div>
      );
    }
    if (currentStep === 3) {
      return (
        <div className="wizard-step">
          <h4 className="mb-4">Información Profesional</h4>
          {renderFields(wizardSteps[2].fields)}
        </div>
      );
    }
    return null;
  };

  // 1. Generar lista de campos planos para tabla y exportaciones
  const flatFields = [
    'id', 'firstName', 'lastName', 'maidenName', 'age', 'gender', 'birthDate', 'image', 'height', 'weight', 'eyeColor', 'hair.color', 'hair.type', 'bloodGroup',
    'email', 'phone', 'username', 'password', 'ip', 'macAddress', 'address.address', 'address.city', 'address.state', 'address.stateCode', 'address.postalCode', 'address.coordinates.lat', 'address.coordinates.lng', 'address.country',
    'university', 'company.name', 'company.title', 'company.department', 'company.address.address', 'company.address.city', 'company.address.state', 'company.address.stateCode', 'company.address.postalCode', 'company.address.coordinates.lat', 'company.address.coordinates.lng', 'company.address.country',
    'bank.cardExpire', 'bank.cardNumber', 'bank.cardType', 'bank.currency', 'bank.iban', 'ein', 'ssn', 'userAgent', 'crypto.coin', 'crypto.wallet', 'crypto.network', 'role', 'estado'
  ];

  // Render
  return (
    <div className="container-fluid py-5">
      {/* Encabezado profesional */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <img src={logoUsuarios} alt="Logo Gestión de Usuarios" style={{ height: 60, marginRight: 16 }} />
                  <div>
                    <h2 className="text-success mb-0">Gestión de Usuarios</h2>
                    <small className="text-muted">Administra y registra usuarios fácilmente</small>
                  </div>
                </div>
                {/* Tabs de navegación */}
                <ul className="nav nav-tabs mb-4" id="userTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link${activeTab === 'register' ? ' active' : ''}`} onClick={() => { setActiveTab('register'); resetForm(); }}>Registro</button>
                  </li>
                  {isAdmin && (
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link${activeTab === 'list' ? ' active' : ''}`} onClick={() => { setActiveTab('list'); fetchUsers(); }}>Lista de Usuarios</button>
                    </li>
                  )}
                </ul>
                {/* Notificaciones */}
                {/* Contenido de tabs */}
                <div className="tab-content mt-4">
                  {activeTab === 'register' && (
                    <div className="tab-pane fade show active">
                      {/* Formulario de registro/edición */}
                      <form onSubmit={handleSubmit} className="row g-3">
                        {isEditMode && (
                          <div className="alert alert-info mb-4">
                            <i className="fa fa-edit mr-2"></i>
                            <strong>Modo Edición:</strong> Editando usuario ID: {editUserId}
                          </div>
                        )}
                        {renderStep()}
                        {/* Navegación del wizard */}
                        <div className="wizard-buttons mt-4">
                          {currentStep > 1 && (
                            <button type="button" className="btn btn-secondary mr-2" onClick={prevStep}>Anterior</button>
                          )}
                          {currentStep < 3 && (
                            <button type="button" className="btn btn-primary" onClick={nextStep} disabled={!isCurrentStepValid()}>Siguiente</button>
                          )}
                          {currentStep === 3 && !isViewMode && (
                            <button type="submit" className="btn btn-success">{isEditMode ? 'Actualizar' : 'Registrar'}</button>
                          )}
                        </div>
                        {(isViewMode || isEditMode) && (
                          <button type="button" className="btn btn-secondary mt-3 w-100" onClick={resetForm}>Limpiar</button>
                        )}
                      </form>
                    </div>
                  )}
                  {isAdmin && activeTab === 'list' && (
                    <div className="tab-pane fade show active">
                      {/* Tabla de usuarios */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>Lista de Usuarios</h4>
                        <div>
                          <button className="btn btn-danger mr-2" onClick={downloadPDF}>
                            <i className="fa fa-file-pdf-o mr-1"></i>Descargar PDF
                          </button>
                          <button className="btn btn-success mr-2" onClick={downloadExcel}>
                            <i className="fa fa-file-excel-o mr-1"></i>Descargar Excel
                          </button>
                          <button className="btn btn-primary ml-2" onClick={fetchUsers}>
                            <i className="fa fa-refresh mr-2"></i>Actualizar
                          </button>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead className="table-success">
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
                                  <button className="btn btn-info btn-sm me-1" onClick={() => viewUser(user)}>Ver</button>
                                  <button className="btn btn-warning btn-sm me-1" onClick={() => editUser(user)}>Editar</button>
                                  <button className="btn btn-danger btn-sm" onClick={() => toggleUserStatus(user)}>{user.estado === 'activo' ? 'Desactivar' : 'Activar'}</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UsuariosProtected() {
  return (
    <ProtectedRoute>
      <Usuarios />
    </ProtectedRoute>
  );
} 