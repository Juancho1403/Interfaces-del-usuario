import React from 'react';

const LoadingSpinner = ({ message = "Cargando...", size = "medium" }) => {
  const sizeClasses = {
    small: "spinner-border-sm",
    medium: "spinner-border",
    large: "spinner-border"
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div className={`${sizeClasses[size]} text-primary`} role="status">
        <span className="sr-only">Cargando...</span>
      </div>
      {message && (
        <p className="mt-3 text-muted">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 