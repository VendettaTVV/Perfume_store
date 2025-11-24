import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import styles from './styles/CartPage.module.css';

function CartPage() {
  const { cartItems, removeFromCart, total } = useCart();

  // ❗️ Логика бесплатной доставки
  const FREE_SHIPPING_THRESHOLD = 50;
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  if (cartItems.length === 0) {
    return <h2 className={styles.emptyCart}>Ваша корзина пуста. Начните покупки!</h2>;
  }

  return (
    <div className={styles.container}>
      <h1>Ваша Корзина</h1>
      
      {/* ❗️ ПРОГРЕСС-БАР */}
      <div className={styles.shippingProgressContainer}>
        <p className={styles.shippingText}>
          {remaining > 0 
            ? <>Добавьте товаров на <b>£{remaining.toFixed(2)}</b>, чтобы получить <b>БЕСПЛАТНУЮ ДОСТАВКУ</b></>
            : <span style={{color: '#27ae60'}}>Поздравляем! У вас бесплатная доставка 🎉</span>
          }
        </p>
        <div className={styles.progressBarBg}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.cartList}>
        {cartItems.map(item => (
          <div key={item.cartItemId} className={styles.cartItem}>
            <img src={item.image} alt={item.name} className={styles.itemImage} />
            <div className={styles.itemDetails}>
              <h3>{item.name}</h3>
              <p className={styles.variantInfo}>Объем: {item.size} ml</p>
              <p>Количество: {item.quantity}</p>
              <p>Цена за ед.: £{item.price.toFixed(2)}</p>
            </div>
            <div className={styles.itemActions}>
              <p className={styles.itemTotal}>£{(item.price * item.quantity).toFixed(2)}</p>
              <button 
                className={styles.removeButton} 
                onClick={() => removeFromCart(item.cartItemId)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.summary}>
        <h2>Общая Сумма: £{total.toFixed(2)}</h2>
        <Link to="/checkout" className={styles.checkoutButton}>
            ПЕРЕЙТИ К ОФОРМЛЕНИЮ
        </Link>
      </div>
    </div>
  );
}

export default CartPage;