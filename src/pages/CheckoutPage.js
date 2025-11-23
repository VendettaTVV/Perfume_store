import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import styles from './styles/CheckoutPage.module.css';

function CheckoutPage() {
  const { cartItems, total } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [shippingCost, setShippingCost] = useState(0); 

  // Состояния для Купона
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [shippingInfo, setShippingInfo] = useState({
    name: '', email: '', addressLine1: '', addressLine2: '', city: '', postcode: '', country: 'United Kingdom'
  });
  
  // Мы убрали стейт выбора метода, теперь он всегда 'standard'

  const calculateShipping = useCallback(async (postcode) => {
    if (!postcode || postcode.length < 2) { setShippingCost(0); return; }
    setIsCalculating(true);
    try {
        const response = await fetch('http://localhost:5000/api/checkout/calculate-shipping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // ❗️ Хардкодим метод 'standard'
            body: JSON.stringify({ postcode, method: 'standard' }),
        });
        if (response.ok) {
            const data = await response.json();
            setShippingCost(data.price);
        } else { setShippingCost(5.00); } // Дефолтная цена если ошибка
    } catch (error) { setShippingCost(5.00); } 
    finally { setIsCalculating(false); }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        calculateShipping(shippingInfo.postcode);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [shippingInfo.postcode, calculateShipping]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const response = await fetch('http://localhost:5000/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await response.json();
      
      if (response.ok && data.isValid) {
        setAppliedCoupon({ code: data.code, percent: data.discountPercent });
        showToast(`Купон ${data.code} применен!`, 'success');
      } else {
        setAppliedCoupon(null);
        showToast(data.message || 'Неверный купон', 'error');
      }
    } catch (err) {
      showToast('Ошибка проверки купона', 'error');
    }
  };

  const discountAmount = appliedCoupon ? (total * appliedCoupon.percent / 100) : 0;
  const totalAfterDiscount = total - discountAmount;
  const finalTotal = totalAfterDiscount + shippingCost;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Проверка: цена доставки должна быть рассчитана
    if (shippingCost === 0 && shippingInfo.postcode.length >= 2) {
      showToast("Пожалуйста, дождитесь расчета стоимости доставки.", 'error');
      setLoading(false); return;
    }
    
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch('http://localhost:5000/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cartItems, 
          shippingInfo, 
          shippingMethod: 'standard', // ❗️ Хардкодим метод
          userId,
          couponCode: appliedCoupon ? appliedCoupon.code : null
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка на сервере');
      }
      const session = await response.json();
      if (session.url) window.location.href = session.url;
      else throw new Error('Не удалось получить ссылку на оплату');
    } catch (error) {
      console.error(error);
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return <div className={styles.container}><h2>Ваша корзина пуста</h2></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Оформление Заказа</h1>
      
      <div className={styles.formColumn}>
        <form id="checkout-form" onSubmit={handlePayment} className={styles.form}>
           <h2>Адрес Доставки (United Kingdom)</h2>
           <div className={styles.inputGroup}>
            <label>ФИО Получателя</label><input type="text" name="name" value={shippingInfo.name} onChange={handleChange} required />
           </div>
           <div className={styles.inputGroup}>
            <label>Email</label><input type="email" name="email" value={shippingInfo.email} onChange={handleChange} required />
           </div>
           <div className={styles.inputGroup}>
            <label>Адрес 1</label><input type="text" name="addressLine1" value={shippingInfo.addressLine1} onChange={handleChange} required />
           </div>
           <div className={styles.inputGroup}>
            <label>Адрес 2</label><input type="text" name="addressLine2" value={shippingInfo.addressLine2} onChange={handleChange} />
           </div>
           <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Город</label><input type="text" name="city" value={shippingInfo.city} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Почтовый Индекс</label><input type="text" name="postcode" value={shippingInfo.postcode} onChange={handleChange} required />
            </div>
           </div>
           
           {/* ❗️ Блок выбора доставки удален, так как она рассчитывается автоматически */}
        </form>
      </div>

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
        
        <div className={styles.couponSection}>
          <label className={styles.couponLabel}>Промокод</label>
          <div className={styles.couponForm}>
            <input 
              type="text" 
              placeholder="Введите код" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className={styles.couponInput}
              disabled={!!appliedCoupon} 
            />
            {appliedCoupon ? (
               <button type="button" onClick={() => {setAppliedCoupon(null); setCouponCode('');}} className={styles.couponRemoveBtn}>
                 Отмена
               </button>
            ) : (
               <button type="button" onClick={handleApplyCoupon} className={styles.couponBtn}>
                 OK
               </button>
            )}
          </div>
          {appliedCoupon && <p className={styles.couponSuccess}>✓ Скидка {appliedCoupon.percent}% применена</p>}
        </div>
        
        <div className={styles.summaryRow}>
          <span>Товары:</span><span>£{total.toFixed(2)}</span>
        </div>
        
        {appliedCoupon && (
          <div className={`${styles.summaryRow} ${styles.discountRow}`}>
            <span>Скидка:</span><span>-£{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className={styles.summaryRow}>
          <span>Доставка:</span>
          <span>
            {isCalculating 
              ? '...' 
              : shippingCost === 0 && shippingInfo.postcode.length < 2
                ? 'Введите индекс'
                : `£${shippingCost.toFixed(2)}`
            }
          </span>
        </div>
        
        <div className={styles.summaryTotal}>
          <span>Итого:</span><span>£{finalTotal.toFixed(2)}</span>
        </div>

        <button 
          type="submit" 
          form="checkout-form" 
          className={styles.payButton}
          disabled={loading || isCalculating || (shippingCost === 0 && shippingInfo.postcode.length > 1)}
        >
          {loading ? 'Обработка...' : 'ОПЛАТИТЬ ЗАКАЗ'}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;