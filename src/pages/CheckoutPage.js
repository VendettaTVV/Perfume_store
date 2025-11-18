import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import styles from './styles/CheckoutPage.module.css';

function CheckoutPage() {
  const { cartItems, total } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Данные формы
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postcode: '',
    country: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard');

  // Обновление полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  // Расчет итоговой суммы с доставкой
  const shippingCost = shippingMethod === 'express' ? 10 : 5;
  const finalTotal = total + shippingCost;

  // Обработчик оплаты
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Отправляем корзину И адрес на бэкенд
      const response = await fetch('http://localhost:5000/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cartItems, 
          shippingInfo, 
          shippingMethod 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка на сервере');
      }

      const session = await response.json();

      // Перенаправляем на Stripe
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Не удалось получить ссылку на оплату');
      }

    } catch (error) {
      console.error(error);
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className={styles.container}><h2>Ваша корзина пуста</h2></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Оформление Заказа</h1>
      
      {/* ЛЕВАЯ КОЛОНКА: ФОРМА */}
      <div className={styles.formColumn}>
        <form id="checkout-form" onSubmit={handlePayment} className={styles.form}>
          <h2>Адрес Доставки</h2>
          
          <div className={styles.inputGroup}>
            <label>ФИО Получателя</label>
            <input type="text" name="name" value={shippingInfo.name} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" name="email" value={shippingInfo.email} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Адрес (Улица, Дом, Кв)</label>
            <input type="text" name="address" value={shippingInfo.address} onChange={handleChange} required />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Город</label>
              <input type="text" name="city" value={shippingInfo.city} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Индекс</label>
              <input type="text" name="postcode" value={shippingInfo.postcode} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Страна</label>
            <input type="text" name="country" value={shippingInfo.country} onChange={handleChange} required />
          </div>

          <h2>Способ Доставки</h2>
          <div className={styles.shippingOptions}>
            <label className={shippingMethod === 'standard' ? styles.selected : ''}>
              <input 
                type="radio" 
                name="shippingMethod" 
                value="standard" 
                checked={shippingMethod === 'standard'} 
                onChange={(e) => setShippingMethod(e.target.value)} 
              />
              Стандартная (5-7 дней) - <strong>£5.00</strong>
            </label>
            
            <label className={shippingMethod === 'express' ? styles.selected : ''}>
              <input 
                type="radio" 
                name="shippingMethod" 
                value="express" 
                checked={shippingMethod === 'express'} 
                onChange={(e) => setShippingMethod(e.target.value)} 
              />
              Экспресс (1-2 дня) - <strong>£10.00</strong>
            </label>
          </div>
        </form>
      </div>

      {/* ПРАВАЯ КОЛОНКА: ИТОГ */}
      <div className={styles.summaryColumn}>
        <h2>Ваш Заказ</h2>
        <div className={styles.summaryItems}>
          {cartItems.map(item => (
            <div key={item.cartItemId} className={styles.summaryItem}>
              <span>{item.name} ({item.size}ml) x {item.quantity}</span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.summaryRow}>
          <span>Товары:</span>
          <span>£{total.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Доставка:</span>
          <span>£{shippingCost.toFixed(2)}</span>
        </div>
        
        <div className={styles.summaryTotal}>
          <span>Итого:</span>
          <span>£{finalTotal.toFixed(2)}</span>
        </div>

        <button 
          type="submit" 
          form="checkout-form" 
          className={styles.payButton}
          disabled={loading}
        >
          {loading ? 'Обработка...' : 'Оплатить Заказ'}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;