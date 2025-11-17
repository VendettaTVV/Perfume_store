import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// 1. Создаем контекст
const ToastContext = createContext(null);

// Хук для использования в компонентах
export const useToast = () => useContext(ToastContext);

// 2. Провайдер
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
  };

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((currentToasts) => [...currentToasts, { id, message, type }]);
    
    // Удаляем через 3 секунды
    setTimeout(() => removeToast(id), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// --- ВНУТРЕННИЕ КОМПОНЕНТЫ (Визуал) ---

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, removeToast }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Анимация появления
    const timer = setTimeout(() => setIsFading(true), 2700); // Начинаем исчезать чуть раньше удаления
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsFading(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  // Выбор стиля в зависимости от типа (успех или ошибка)
  const typeStyle = toast.type === 'error' ? styles.error : styles.success;

  return (
    <div
      style={{
        ...styles.toast,
        ...typeStyle,
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'translateX(100%)' : 'translateX(0)',
      }}
    >
      <div style={styles.message}>{toast.message}</div>
      <button style={styles.closeBtn} onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

// --- СТИЛИ (Внутри JS) ---
const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  toast: {
    minWidth: '300px',
    padding: '16px 20px',
    borderRadius: '8px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease-in-out',
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: '14px',
    lineHeight: '1.4',
  },
  success: {
    backgroundColor: '#333', // Темный фон (как у вас на сайте)
    borderLeft: '4px solid #4CAF50', // Зеленая полоска
  },
  error: {
    backgroundColor: '#333',
    borderLeft: '4px solid #F44336', // Красная полоска
  },
  message: {
    flexGrow: 1,
    marginRight: '10px',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0',
    lineHeight: '1',
  },
};

export default ToastContext;