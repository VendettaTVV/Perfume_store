import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Импортируем useNavigate
import styles from './styles/Header.module.css';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext'; // 2. Импортируем useToast

const CartIcon = ({ count }) => <div style={{ fontWeight: 'bold' }}>🛒({count})</div>;
const UserIcon = () => <div>👤</div>;

function Header() {
  const { totalQuantity } = useCart();
  const { showToast } = useToast(); // 3. Получаем функцию уведомлений
  const navigate = useNavigate(); // 4. Получаем функцию навигации
  
  // 5. Проверяем, вошел ли пользователь (по наличию токена)
  const token = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // 6. Функция Выхода
  const handleLogout = () => {
    // Очищаем хранилище
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');

    // Показываем уведомление
    showToast('Вы успешно вышли из системы.', 'success');

    // Перенаправляем на главную страницу
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <div className={styles.logo}>
          <span className={styles.logoText}>HTML/CSS and JavaScript React</span>
          <span className={styles.brandName}>AROMATICUS</span>
          <span className={styles.tagline}>THE SCENT OF STORIES</span>
        </div>
      </Link>
      
      <nav className={styles.nav}>
        <ul>
          <li><Link to="/">COLLECTION</Link></li>
          <li><Link to="/about">ABOUT US</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
          
          {/* Показываем админ-ссылки, только если админ */}
          {isAdmin && (
            <>
              <li><Link to="/admin/add" style={{color: '#c0392b'}}>+ Добавить Товар</Link></li>
              <li><Link to="/admin/manage" style={{color: '#2980b9'}}>Управление</Link></li>
            </>
          )}
        </ul>
      </nav>
      
      <div className={styles.icons}>
        <Link to="/cart">
          <CartIcon count={totalQuantity} />
        </Link>

        {/* 7. ЛОГИКА ВХОДА/ВЫХОДА */}
        {token ? (
          // Если пользователь вошел, показываем кнопку "Выход"
          <button onClick={handleLogout} className={styles.logoutButton}>
            ВЫХОД
          </button>
        ) : (
          // Если не вошел, показываем иконку "Вход"
          <Link to="/auth">
            <UserIcon />
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;