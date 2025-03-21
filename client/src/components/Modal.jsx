import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styles from './Modal.module.css'

// eslint-disable-next-line react/prop-types
const Modal = ({ children }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    setPortalElement(element);

    return () => {
      document.body.removeChild(element);
    };
  }, []);

  if (!portalElement) return null;

  return ReactDOM.createPortal(
    <div className={styles["modal-overlay"]}>
      {children}
    </div>
    ,portalElement);
};

export default Modal;