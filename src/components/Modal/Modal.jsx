import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const modalRoot = document.getElementById('modal-root');

const Modal = ({ close, src, alt }) => {
  const closeModal = ({ target, currentTarget, code }) => {
    if (target === currentTarget || code === 'Escape') {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', closeModal);

    return () => document.removeEventListener('keydown', closeModal);
  }, []);

  return createPortal(
    <div className="Overlay" onClick={closeModal}>
      <div className="Modal">
        <img src={src} alt={alt} onClick={close} />
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
