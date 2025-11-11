import React, { useState } from 'react';
import styles from './styles/Auth.module.css';
import { useNavigate } from 'react-router-dom'; // Импортируем для перенаправления

function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Хук для навигации

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Отправляем запрос на бэкенд
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json(); // Ожидаем { token, user: { ... } }
        
        // 2. ❗ ВАЖНО: Сохраняем токен в браузере
        localStorage.setItem('authToken', data.token);
        
        // 3. Вызываем onSuccess (если он есть) и перенаправляем на главную
        if (onSuccess) onSuccess(data.user);
        navigate('/'); // Перенаправляем на главную страницу
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Неверный email или пароль.');
      }
    } catch (err) {
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
    </div>
  );
}

export default LoginForm;