import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard'; // Импортируем карточку для вишлиста
import styles from './styles/ProfilePage.module.css';

function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]); // Стейт для вишлиста
  const [loading, setLoading] = useState(true);
  
  // Состояние для переключения вкладок (по умолчанию 'orders')
  const [activeTab, setActiveTab] = useState('orders'); 

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    showToast('Сессия истекла. Пожалуйста, войдите заново.', 'error');
    navigate('/auth');
  }, [navigate, showToast]);

  const onLogoutClick = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    showToast('Вы вышли из системы', 'success');
    navigate('/');
  };

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/auth');
        return;
      }

      try {
        // 1. Загружаем Заказы
        const ordersResponse = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (ordersResponse.status === 401 || ordersResponse.status === 403) {
          handleLogout();
          return;
        }
        
        // 2. Загружаем Вишлист
        const wishlistResponse = await fetch('http://localhost:5000/api/user/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (ordersResponse.ok && wishlistResponse.ok) {
           const ordersData = await ordersResponse.json();
           const wishlistData = await wishlistResponse.json();
           setOrders(ordersData);
           setWishlist(wishlistData);
        } else {
           throw new Error('Ошибка загрузки данных');
        }

      } catch (err) {
        console.error(err);
        // Проверка на токен, чтобы не показывать ошибку при редиректе
        if (localStorage.getItem('authToken')) {
            showToast('Не удалось загрузить данные профиля', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, showToast, handleLogout]);

  if (loading) return <div className={styles.loading}>Загрузка профиля...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Личный Кабинет</h1>
        <button onClick={onLogoutClick} className={styles.logoutBtn}>
          Выйти
        </button>
      </div>

      {/* Вкладки (Tabs) */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Мои Заказы ({orders.length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'wishlist' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          Избранное ({wishlist.length})
        </button>
      </div>

      {/* --- СЕКЦИЯ ЗАКАЗОВ --- */}
      {activeTab === 'orders' && (
        <div className={styles.section}>
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <p>У вас пока нет заказов.</p>
              <Link to="/" className={styles.shopLink}>Перейти в каталог</Link>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map(order => (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <span className={styles.orderId}>Заказ #{order._id.slice(-6)}</span>
                      <span className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.orderStatus}>
                      Статус: <b>{order.status}</b>
                    </div>
                  </div>

                  <div className={styles.orderBody}>
                    {order.orderItems.map((item, index) => (
                      <div key={index} className={styles.orderItem}>
                        <img src={item.image} alt={item.name} />
                        <div className={styles.itemDetails}>
                          <p className={styles.itemName}>{item.name}</p>
                          <p className={styles.itemInfo}>{item.size} ml x {item.quantity}</p>
                        </div>
                        <div className={styles.itemPrice}>
                          £{item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.totalPrice}>
                      Итого: £{order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- СЕКЦИЯ ИЗБРАННОГО (ВИШЛИСТ) --- */}
      {activeTab === 'wishlist' && (
        <div className={styles.section}>
          {wishlist.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Ваш список желаний пуст.</p>
              <Link to="/" className={styles.shopLink}>Найти ароматы</Link>
            </div>
          ) : (
            <div className={styles.wishlistGrid}>
              {wishlist.map(product => (
                // Переиспользуем ProductCard для отображения товара
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default ProfilePage;