import React from 'react';

export default function Topbar() {
  return (
    <div className="container-fluid bg-light py-2 border-bottom" style={{ fontSize: '1.05rem' }}>
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center" style={{ gap: 16 }}>
          <span><i className="fa fa-envelope mr-2" style={{ color: '#7AB730' }}></i> info@example.com</span>
          <span className="text-body">|</span>
          <span><i className="fa fa-phone-alt mr-2" style={{ color: '#7AB730' }}></i> +012 345 6789</span>
        </div>
        <div className="d-flex align-items-center" style={{ gap: 8 }}>
          <a className="text-primary px-2" href="#"><i className="fab fa-facebook-f" style={{ color: '#7AB730' }}></i></a>
          <a className="text-primary px-2" href="#"><i className="fab fa-twitter" style={{ color: '#7AB730' }}></i></a>
          <a className="text-primary px-2" href="#"><i className="fab fa-linkedin-in" style={{ color: '#7AB730' }}></i></a>
          <a className="text-primary px-2" href="#"><i className="fab fa-instagram" style={{ color: '#7AB730' }}></i></a>
          <a className="text-primary px-2" href="#"><i className="fab fa-youtube" style={{ color: '#7AB730' }}></i></a>
        </div>
      </div>
    </div>
  );
} 