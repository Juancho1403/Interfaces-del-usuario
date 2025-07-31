import React, { useState } from 'react';
import { register } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { validations } from '../utils/validations';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Validar email
    const emailError = validations.email(email);
    if (emailError) newErrors.email = emailError;
    
    // Validar contraseña
    const passwordError = validations.password(password);
    if (passwordError) newErrors.password = passwordError;
    
    // Validar confirmación de contraseña
    const confirmPasswordError = validations.confirmPassword(password, confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        email,
        password,
        confirmPassword
      });
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Error en el registro');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="mb-4 text-center">Registro</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                  required 
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                  required 
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} 
                  required 
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
              <button type="submit" className="btn btn-success w-100">Registrarse</button>
            </form>
            <Link to="/login" className="btn btn-link w-100 mt-3">¿Ya tienes cuenta? Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 