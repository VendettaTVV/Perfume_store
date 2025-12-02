import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/Header.module.css';
import { useCart } from '../context/CartContext';

const CartIcon = ({ count }) => (
  <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
    <span style={{fontSize: '1.4em'}}>🛒</span>
    {count > 0 && (
      <span className={styles.cartCount}>{count}</span>
    )}
  </div>
);

const UserIcon = () => <span style={{fontSize: '1.4em'}}>👤</span>;

function Header() {
  const { totalQuantity } = useCart();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <div className={styles.logo}>
          <span className={styles.brandName}>AROMATICUS</span>
          <span className={styles.tagline}>THE SCENT OF STORIES</span>
        </div>
      </Link>

      <div className={styles.centerSection}>
        <p className={styles.slogan}>Perfume is memory that never fails</p>
        <p className={styles.subSlogan}>Original Niche Perfume Decants</p>
        
        {isAdmin && (
          <nav className={styles.adminNav}>
            <Link to="/admin/add" style={{color: '#c0392b'}}>+ Product</Link>
            <Link to="/admin/orders" style={{color: '#2980b9'}}>Orders</Link>
            <Link to="/admin/products" style={{color: '#27ae60'}}>Inventory</Link>
            <Link to="/admin/analytics" style={{color: '#f39c12'}}>Reports</Link>
          </nav>
        )}
      </div>
      
      <div className={styles.rightSection}>
        <form onSubmit={submitHandler} className={styles.searchForm}>
          <input
            type="text"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search..."
            className={styles.searchInput}
          />
        </form>

        <div className={styles.icons}>
          <Link to="/cart" className={styles.iconLink} title="Cart">
            <CartIcon count={totalQuantity} />
          </Link>
          
          <div className={styles.authBlock}>
            {token ? (
              <Link to="/profile" className={styles.iconLinkWithText}>
                 <UserIcon />
                 <span>Account</span>
              </Link>
            ) : (
              <Link to="/auth" className={styles.iconLinkWithText}>
                <UserIcon />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;