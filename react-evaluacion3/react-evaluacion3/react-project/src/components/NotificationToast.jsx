import React from 'react';

const NotificationToast = ({ notifications, removeNotification }) => {
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`toast show ${notification.type === 'error' ? 'bg-danger text-white' : 
                     notification.type === 'success' ? 'bg-success text-white' : 
                     'bg-info text-white'}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">
              {notification.type === 'error' ? 'Error' : 
               notification.type === 'success' ? 'Éxito' : 'Información'}
            </strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => removeNotification(notification.id)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            {notification.message}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast; 