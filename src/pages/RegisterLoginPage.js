import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import styles from './styles/RegisterLoginPage.module.css';

function RegisterLoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Switches to the 'Login' tab after successful registration.
  const handleRegisterSuccess = () => {
    setIsLogin(true); 
  };

  // This function can remain empty as the LoginForm handles redirection/toasts internally.
  const handleLoginSuccess = () => {
    // Logic handled in LoginForm component
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.toggle}>
        <button 
          className={isLogin ? styles.active : ''}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button 
          className={!isLogin ? styles.active : ''}
          onClick={() => setIsLogin(false)}
        >
          Register
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