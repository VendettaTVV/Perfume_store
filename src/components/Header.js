// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Header.module.css';
import { useCart } from '../context/CartContext';

// ⚠️ Замените это на свои иконки или библиотеку!
const CartIcon = ({ count }) => <div style={{ fontWeight: 'bold' }}>🛒({count})</div>;
const UserIcon = () => <div>👤</div>;

function Header() {
  const { totalQuantity } = useCart();
  
  return (
    <header className={styles.header}>
      {/* ... Логотип (из предыдущего ответа) ... */}
      <Link to="/" className={styles.logoLink}>
      <div className={styles.logo}>
       {/*} <span className={styles.logoText}></span> */}
        <span className={styles.brandName}>AROMATICUS</span>
        <span className={styles.tagline}>THE SCENT OF STORIES</span>
      </div>
      </Link>
      
      <nav className={styles.nav}>
        <ul>
          <li><Link to="/">COLLECTION</Link></li>
          <li><Link to="/about">ABOUT US</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
          <li><Link to="/admin">ADMIN</Link></li> {/* Ссылка на админку */}
        </ul>
      </nav>
      <div className={styles.icons}>
        <Link to="/cart">
          <CartIcon count={totalQuantity} />
        </Link>
        <Link to="/auth">
          <UserIcon />
        </Link>
      </div>
    </header>
  );
}

export default Header;