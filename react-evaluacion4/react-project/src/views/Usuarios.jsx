import React, { useState, useEffect, useCallback } from 'react';
import logoUsuarios from '../assets/logo-usuarios.svg';
import { getUsuarios, createUsuario, updateUsuario } from '../api';
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
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  // Asegura que existan los siguientes hooks y funciones:
  const [errors, setErrors] = useState({});

  // Mueve wizardSteps aquí, antes de cualquier uso
  // Wizard de 6 fases (todos los campos incluidos)
  const wizardSteps = [
    {
      label: 'Identidad',
      fields: [
        'id', 'firstName', 'lastName', 'maidenName', 'age', 'gender', 'birthDate', 'image'
      ]
    },
    {
      label: 'Físico',
      fields: [
        'height', 'weight', 'eyeColor', 'hair.color', 'hair.type', 'bloodGroup'
      ]
    },
    {
      label: 'Contacto',
      fields: [
        'email', 'phone', 'username', 'password', 'ip', 'macAddress'
      ]
    },
    {
      label: 'Dirección',
      fields: [
        'address.address', 'address.city', 'address.state', 'address.stateCode', 'address.postalCode', 'address.coordinates.lat', 'address.coordinates.lng', 'address.country'
      ]
    },
    {
      label: 'Profesional',
      fields: [
        'university', 'company.name', 'company.title', 'company.department', 'company.address.address', 'company.address.city', 'company.address.state', 'company.address.stateCode', 'company.address.postalCode', 'company.address.coordinates.lat', 'company.address.coordinates.lng', 'company.address.country', 'role'
      ]
    },
    {
      label: 'Finanzas y Otros',
      fields: [
        'bank.cardExpire', 'bank.cardNumber', 'bank.cardType', 'bank.currency', 'bank.iban', 'ein', 'ssn', 'userAgent', 'crypto.coin', 'crypto.wallet', 'crypto.network'
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
    }
  };

  const downloadPDF = () => {
    if (!users || users.length === 0) {
      alert('No hay usuarios para exportar.');
      return;
    }
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 30;
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
        doc.addImage(logoDataURL, 'PNG', logoX, 10, logoWidth, 30);
        logoOk = true;
      } catch (e) {
        console.log('Error al crear logo Ji:', e);
        logoOk = false;
      }
      
      doc.setFontSize(18);
      doc.text('Lista de Usuarios', pageWidth / 2, logoOk ? 48 : 24, { align: 'center' });
      
      const tableBody = users.map(user => basicFields.map(f => {
        let val = user[f];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
      }));
      
      autoTable(doc, {
        startY: logoOk ? 55 : 30,
        head: [basicFields.map(f => basicLabels[f] || f)],
        body: tableBody,
        styles: { fontSize: 10, cellPadding: 2 },
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
  const validateField = (field, value) => {
    // Letras
    if ([
      'firstName', 'lastName', 'maidenName', 'company.name', 'company.department', 'company.title', 'company.address.address', 'company.address.city', 'company.address.state', 'company.address.stateCode', 'company.address.country', 'address.address', 'address.city', 'address.state', 'address.stateCode', 'address.country', 'university', 'eyeColor', 'hair.color', 'hair.type', 'crypto.coin', 'crypto.network'
    ].includes(field) && (!value || !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value))) {
      return 'Solo letras';
    }
    // Números estrictos (no permitir letras ni símbolos)
    if ([
      'id', 'age', 'height', 'weight', 'address.postalCode', 'company.address.postalCode', 'address.coordinates.lat', 'address.coordinates.lng', 'company.address.coordinates.lat', 'company.address.coordinates.lng', 'ein', 'ssn', 'bank.cardNumber'
    ].includes(field)) {
      if (value === '' || !/^-?\d+(\.\d+)?$/.test(value)) {
        return 'Debe ser numérico';
      }
    }
    // Email
    if (field === 'email' && (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
      return 'Correo electrónico inválido';
    }
    // Teléfono: solo números y opcionalmente + al inicio, longitud 7-15
    if (field === 'phone') {
      if (!value || !/^\+?\d{7,15}$/.test(value)) {
        return 'Teléfono inválido (solo números, 7-15 dígitos)';
      }
    }
    // Username
    if (field === 'username' && (!value || !/^[a-zA-Z0-9_-]{3,20}$/.test(value))) {
      return 'Usuario inválido (3-20 caracteres, letras, números, guion o guion bajo)';
    }
    // Password
    if (field === 'password' && (!value || value.length < 6)) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    // Fecha de nacimiento: formato y no permitir fechas futuras ni menores de 1900
    if (field === 'birthDate') {
      if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return 'Formato de fecha: aaaa-mm-dd';
      }
      const date = new Date(value);
      const now = new Date();
      if (date > now) {
        return 'La fecha de nacimiento no puede ser futura';
      }
      if (date.getFullYear() < 1900) {
        return 'La fecha de nacimiento no puede ser menor a 1900';
      }
    }
    // IBAN
    if (field === 'bank.iban' && value && !/^([A-Z]{2}\d{2}[A-Z0-9]{1,30})$/.test(value)) {
      return 'IBAN inválido';
    }
    // Card Expire
    if (field === 'bank.cardExpire' && value && !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(value)) {
      return 'Formato de vencimiento: MM/YY';
    }
    // Card Type
    if (field === 'bank.cardType' && value && !['Visa','Mastercard','Amex','Diners','Discover','JCB'].includes(value)) {
      return 'Tipo de tarjeta inválido';
    }
    // Currency
    if (field === 'bank.currency' && value && !/^[A-Z]{3}$/.test(value)) {
      return 'Moneda inválida (ej: USD, EUR)';
    }
    // Wallet
    if (field === 'crypto.wallet' && value && value.length < 5) {
      return 'Wallet inválida';
    }
    // UserAgent
    if (field === 'userAgent' && value && value.length < 5) {
      return 'UserAgent inválido';
    }
    // Imagen URL
    if (field === 'image' && value && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(value)) {
      return 'URL de imagen inválida';
    }
    // MAC Address
    if (field === 'macAddress' && value && !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value)) {
      return 'MAC Address inválida';
    }
    // IP
    if (field === 'ip' && value && !/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
      return 'IP inválida';
    }
    // bloodGroup
    if (field === 'bloodGroup' && value && !['A+','A-','B+','B-','AB+','AB-','O+','O-'].includes(value)) {
      return 'Grupo sanguíneo inválido';
    }
    // gender
    if (field === 'gender' && value && !['male','female'].includes(value)) {
      return 'Género inválido';
    }
    // role
    if (field === 'role' && value && !['user','admin'].includes(value)) {
      return 'Rol inválido';
    }
    // Campos obligatorios (excepto los explícitamente opcionales)
    if (!value && !['image','eyeColor','hair.color','hair.type','macAddress','ip','userAgent','crypto.coin','crypto.wallet','crypto.network','bank.cardExpire','bank.cardNumber','bank.cardType','bank.currency','bank.iban'].includes(field)) {
      return 'Este campo es obligatorio';
    }
    return '';
  };

  const fetchUsers = useCallback(async () => {
    try {
      const usuarios = await getUsuarios();
      setUsers(usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios: ' + (error.response?.data?.message || error.message));
    }
  }, []);

  // Fetch users (for admin)
  useEffect(() => {
    setIsAdmin(localStorage.getItem('role') === 'admin');
    if (localStorage.getItem('role') === 'admin') {
      fetchUsers();
    }
  }, [fetchUsers]);

  // Wizard navigation
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
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

  // Mejorar renderFields para agregar validaciones HTML a cada input
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
        // Tipo de input y validaciones HTML
        let type = 'text';
        let inputProps = { required: true };
        if ([
          'age','height','weight','address.postalCode','company.address.postalCode','address.coordinates.lat','address.coordinates.lng','company.address.coordinates.lat','company.address.coordinates.lng','ein','ssn','bank.cardNumber'
        ].includes(field)) {
          type = 'number';
          inputProps.min = 0;
          inputProps.step = 'any';
          inputProps.pattern = '^\\d+(\\.\\d+)?$';
        }
        if (['email'].includes(field)) {
          type = 'email';
          inputProps.pattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
        }
        if (['password'].includes(field)) {
          type = 'password';
          inputProps.minLength = 6;
        }
        if (['birthDate'].includes(field)) {
          type = 'date';
          inputProps.min = '1900-01-01';
          inputProps.max = new Date().toISOString().split('T')[0];
        }
        if (['image'].includes(field)) {
          type = 'url';
          inputProps.pattern = 'https?://.+\\.(jpg|jpeg|png|gif|svg)';
        }
        if (field === 'phone') {
          type = 'tel';
          inputProps.pattern = '^\\+?\\d{7,15}$';
          inputProps.title = 'Solo números, 7-15 dígitos, puede iniciar con +';
        }
        if ([
          'firstName', 'lastName', 'maidenName', 'company.name', 'company.department', 'company.title', 'company.address.city', 'company.address.state', 'company.address.country', 'address.city', 'address.state', 'address.country', 'university', 'eyeColor', 'hair.color', 'hair.type', 'crypto.coin', 'crypto.network'
        ].includes(field)) {
          inputProps.pattern = '^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\\s]*$';
          inputProps.title = 'Solo letras';
        }
        if (field === 'macAddress') {
          inputProps.pattern = '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$';
          inputProps.title = 'MAC Address válida';
        }
        if (field === 'ip') {
          inputProps.pattern = '^(\\d{1,3}\\.){3}\\d{1,3}$';
          inputProps.title = 'IP válida';
        }
        if (field === 'bank.iban') {
          inputProps.pattern = '^([A-Z]{2}\\d{2}[A-Z0-9]{1,30})$';
          inputProps.title = 'IBAN válido';
        }
        if (field === 'bank.cardExpire') {
          inputProps.pattern = '^(0[1-9]|1[0-2])/(\\d{2})$';
          inputProps.title = 'Formato MM/YY';
        }
        if (field === 'bank.currency') {
          inputProps.pattern = '^[A-Z]{3}$';
          inputProps.title = 'Ejemplo: USD, EUR';
        }
        if (field === 'crypto.wallet') {
          inputProps.minLength = 5;
        }
        if (field === 'userAgent') {
          inputProps.minLength = 5;
        }
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
              <input type={type} id={name} name={name} value={value || ''} onChange={handleInputChange} className="form-control" disabled={isViewMode} {...inputProps} />
              {errors[name] && <div className="text-danger">{errors[name]}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Reemplazar el renderizado de los pasos del wizard
  const renderStep = () => {
    const step = wizardSteps[currentStep - 1];
    return (
      <div className="wizard-step">
        <h4 className="mb-4">{step.label}</h4>
        {renderFields(step.fields)}
      </div>
    );
  };

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
                      {/* Wizard Steps Visual */}
                      {activeTab === 'register' && (
                        <div className="wizard-progress mb-4">
                          <div className="d-flex align-items-center justify-content-center">
                            {[1,2,3,4,5,6].map((step) => (
                              <React.Fragment key={step}>
                                <button
                                  type="button"
                                  className={`wizard-circle btn btn-${currentStep === step ? 'success' : 'light'} mx-2 ${currentStep === step ? 'font-weight-bold' : ''}`}
                                  style={{ borderRadius: '50%', width: 40, height: 40, border: currentStep === step ? '2px solid #7AB730' : '1px solid #ccc', color: currentStep === step ? '#fff' : '#7AB730', background: currentStep === step ? '#7AB730' : '#fff', transition: 'all 0.2s' }}
                                  onClick={() => goToStep(step)}
                                  disabled={currentStep === step}
                                >
                                  {step}
                                </button>
                                {step < 6 && (
                                  <div style={{ width: 40, height: 4, background: currentStep > step ? '#7AB730' : '#ccc', borderRadius: 2 }}></div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                          <div className="d-flex justify-content-between mt-2 px-2" style={{fontSize: 13, color: '#7AB730'}}>
                            {wizardSteps.map(s => <span key={s.label}>{s.label}</span>)}
                          </div>
                        </div>
                      )}
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
                          {currentStep < 6 && (
                            <button type="button" className="btn btn-primary" onClick={nextStep} >Siguiente</button>
                          )}
                          {currentStep === 6 && !isViewMode && (
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