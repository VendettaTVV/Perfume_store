import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext'; // 1. Импорт
import styles from './styles/ProfilePage.module.css';

function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 2. Достаем user и logout

  useEffect(() => {
    const fetchMyOrders = async () => {
      // Используем user из контекста
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          showToast('Сессия истекла.', 'error');
          logout(); // 3. Используем logout контекста
          navigate('/auth');
          return;
        }

        if (!response.ok) throw new Error('Ошибка');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        if (user) showToast('Ошибка загрузки профиля', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate, showToast, logout]);

  const handleLogoutClick = () => {
    logout(); // 4. Выход
    showToast('Вы вышли из системы', 'success');
    navigate('/');
  };

  if (loading) return <div className={styles.loading}>Загрузка профиля...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Мой Кабинет</h1>
        <button onClick={handleLogoutClick} className={styles.logoutBtn}>
          Выйти
        </button>
      </div>

      <div className={styles.ordersSection}>
        <h2>История Заказов</h2>
        {orders.length === 0 ? (
          <p className={styles.noOrders}>У вас пока нет заказов.</p>
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
                      <div className={styles.itemPrice}>£{item.price}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.orderFooter}>
                  <div className={styles.totalPrice}>Итого: £{order.totalPrice.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;