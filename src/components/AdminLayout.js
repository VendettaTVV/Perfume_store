import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './styles/AdminLayout.module.css'; // Предполагаем, что стили существуют

/**
 * Компонент-обертка для всех административных страниц.
 * Отображает боковое меню и основной контент.
 */
const AdminLayout = ({ children }) => {
  const location = useLocation();

  // Список навигационных ссылок для админ-панели
  const navItems = [
    { name: 'Добавить Товар', path: '/admin/add' },
    { name: 'Управление Товарами', path: '/admin/products' },
    { name: 'Заказы', path: '/admin/manage' },
    // ❗️ НОВАЯ ССЫЛКА ДЛЯ АНАЛИТИКИ
    { name: 'Отчеты', path: '/admin/analytics' }, 
  ];

  return (
    <div className={styles.adminContainer}>
      
      {/* Боковое меню */}
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Admin Panel</h2>
        <nav>
          <ul className={styles.navList}>
            {navItems.map(item => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  // Выделяем активную ссылку
                  className={location.pathname === item.path ? styles.activeLink : styles.link}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Основной контент */}
      <main className={styles.content}>
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;