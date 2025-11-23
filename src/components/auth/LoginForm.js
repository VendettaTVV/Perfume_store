import React, { useState } from 'react';
import styles from './styles/Auth.module.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext'; // 1. Импорт

function LoginForm({ onSuccess, onForgotPasswordClick }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth(); // 2. Достаем функцию login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Используем login из контекста (он сам сохранит в localStorage)
        login(data.token, data.user);
        
        if (onSuccess) onSuccess(data.user);
        showToast('Вход выполнен успешно!', 'success');
        navigate('/');
      } else {
        setError(data.message || 'Неверный email или пароль.');
      }
    } catch (err) {
      console.error(err);
      setError('Ошибка сети. Проверьте ваше подключение.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Вход в Аккаунт</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        <label htmlFor="password">Пароль:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      {onForgotPasswordClick && (
        <button onClick={onForgotPasswordClick} className={styles.backButton}>
          Забыли пароль?
        </button>
      )}
    </div>
  );
}

export default LoginForm;