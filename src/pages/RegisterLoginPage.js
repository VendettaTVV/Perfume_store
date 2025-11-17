import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import styles from './styles/RegisterLoginPage.module.css';
// ❗️ Мы больше не импортируем useToast, так как уведомления 
//    теперь обрабатываются ВНУТРИ LoginForm и RegisterForm

function RegisterLoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Эта функция теперь просто переключает вкладку на "Вход"
  // после успешной регистрации.
  const handleRegisterSuccess = () => {
    setIsLogin(true); 
  };

  // Эта функция (для LoginForm) может остаться пустой,
  // так как LoginForm сам перенаправляет на главную.
  const handleLoginSuccess = (userData) => {
    // alert() УБРАН ОТСЮДА
    // LoginForm сам покажет toast
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
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <RegisterForm onSuccess={handleRegisterSuccess} />
      )}
    </div>
  );
}

export default RegisterLoginPage;