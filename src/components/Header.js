import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/Header.module.css';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartIcon = ({ count }) => <div style={{ fontWeight: 'bold' }}>🛒({count})</div>;
const UserIcon = () => <div>👤</div>;

function Header() {
  const { totalQuantity } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    showToast('Вы успешно вышли из системы.', 'success');
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
          
          {isAdmin && (
            <>
              <li><Link to="/admin/add" style={{color: '#c0392b'}}>+ Добавить Товар</Link></li>
              <li><Link to="/admin/manage" style={{color: '#2980b9'}}>Заказы</Link></li>
              {/* ❗️ НОВАЯ ССЫЛКА ДЛЯ УПРАВЛЕНИЯ ТОВАРАМИ */}
              <li><Link to="/admin/products" style={{color: '#27ae60'}}>Товары</Link></li>
            </>
          )}
        </ul>
      </nav>
      
      <div className={styles.icons}>
        <Link to="/cart">
          <CartIcon count={totalQuantity} />
        </Link>
        {token ? (
          <button onClick={handleLogout} className={styles.logoutButton}>
            ВЫХОД
          </button>
        ) : (
          <Link to="/auth">
            <UserIcon />
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;