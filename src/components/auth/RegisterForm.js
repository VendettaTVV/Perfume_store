// src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import styles from './styles/Auth.module.css';

function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают!');
      return;
    }

    setLoading(true);

    try {
      // ⚠️ Имитация запроса на регистрацию (ЗАМЕНИТЬ на реальный API!)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });

      if (response.ok) {
        const data = { user: { id: 1, name: formData.name, email: formData.email } }; // Имитация ответа
        onSuccess(data.user); 
      } else {
        setError('Ошибка регистрации. Email может быть занят.');
      }
    } catch (err) {
      setError('Ошибка сети. Проверьте ваше подключение.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Создать Аккаунт</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor="name">Имя:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

        <label htmlFor="password">Пароль:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="8" />

        <label htmlFor="confirmPassword">Повторите Пароль:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;