import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// Мы используем стили для заказов (убедитесь, что файл src/pages/styles/AdminOrdersPage.module.css существует)
import styles from './styles/AdminOrdersPage.module.css'; 
import { useToast } from '../context/ToastContext';

const STATUS_OPTIONS = ['Оплачено', 'В работе', 'Отправлено', 'Доставлено', 'Отменено'];

function AdminManagePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = useCallback((response) => {
    if (response.status === 401 || response.status === 403) {
      showToast('Сессия истекла. Войдите заново.', 'error');
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAdmin');
      navigate('/auth');
      return true;
    }
    return false;
  }, [showToast, navigate]);

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
         navigate('/auth');
         return;
      }
      // ❗️ ЗАПРОС ЗАКАЗОВ
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (handleAuthError(response)) return;
      if (!response.ok) throw new Error('Ошибка загрузки');
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      showToast('Не удалось загрузить заказы', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, navigate, handleAuthError]); 

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (handleAuthError(response)) return;
      if (response.ok) {
        showToast('Статус обновлен!', 'success');
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      showToast('Ошибка обновления', 'error');
    }
  };

  if (loading) return <div style={{padding: 50, textAlign: 'center'}}>Загрузка заказов...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Управление Заказами</h1>
      <div className={styles.orderList}>
        {orders.length === 0 && <p>Заказов пока нет.</p>}
        {orders.map(order => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.orderHeaderInfo}>
                <p><strong>Заказ #{order._id.slice(-6)}</strong></p>
                <p>Сумма: <strong>£{order.totalPrice.toFixed(2)}</strong></p>
              </div>
              <select 
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className={styles.statusSelect}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className={styles.orderBody}>
               {/* Здесь список товаров внутри заказа */}
               <div className={styles.itemsList}>
                 {order.orderItems.map(item => (
                   <div key={item._id} className={styles.item}>
                      <img src={item.image} alt="" className={styles.itemImage}/>
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.name} ({item.size}ml)</p>
                        <p>x{item.quantity} — £{item.price}</p>
                      </div>
                   </div>
                 ))}
               </div>
               <div className={styles.shippingInfo}>
                 <h4>Доставка:</h4>
                 <p className={styles.shippingAddress}>
                   {order.shippingInfo.name}<br/>
                   {order.shippingInfo.address}, {order.shippingInfo.city}
                 </p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManagePage;