import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './styles/AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Add Product', path: '/admin/add' },
    { name: 'Manage Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/manage' },
    { name: 'Analytics', path: '/admin/analytics' },
  ];

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Admin Panel</h2>
        <nav>
          <ul className={styles.navList}>
            {navItems.map(item => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? styles.activeLink : styles.link}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;