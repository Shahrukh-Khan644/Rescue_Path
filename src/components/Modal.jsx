import React from 'react';
import './map_modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button> {/* Cross button */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
