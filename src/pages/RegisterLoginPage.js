// src/pages/RegisterLoginPage.js
import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import styles from './styles/RegisterLoginPage.module.css';

function RegisterLoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSuccess = (userData) => {
    // В реальном приложении: сохранить токен, обновить стейт аутентификации, перенаправить на главную
    alert(`Успешный вход/регистрация для ${userData.name || userData.email}!`);
    // Например, перенаправление: navigate('/');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.toggle}>
        <button 
          className={isLogin ? styles.active : ''}
          onClick={() => setIsLogin(true)}
        >
          Вход
        </button>
        <button 
          className={!isLogin ? styles.active : ''}
          onClick={() => setIsLogin(false)}
        >
          Регистрация
        </button>
      </div>
      
      {isLogin ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <RegisterForm onSuccess={handleSuccess} />
      )}
    </div>
  );
}

export default RegisterLoginPage;