// src/pages/CartPage.js
import React from 'react';
import { useCart } from '../context/CartContext';
import styles from './styles/CartPage.module.css';

function CartPage() {
  const { cartItems, removeFromCart, total } = useCart();

  if (cartItems.length === 0) {
    return <h2 className={styles.emptyCart}>Ваша корзина пуста. Начните покупки!</h2>;
  }

  return (
    <div className={styles.container}>
      <h1>Ваша Корзина</h1>
      <div className={styles.cartList}>
        {cartItems.map(item => (
          <div key={item.id} className={styles.cartItem}>
            <img src={item.image} alt={item.name} className={styles.itemImage} />
            <div className={styles.itemDetails}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Количество: {item.quantity}</p>
              <p>Цена за ед.: ${item.price.toFixed(2)}</p>
            </div>
            <div className={styles.itemActions}>
              <p className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</p>
              <button 
                className={styles.removeButton} 
                onClick={() => removeFromCart(item.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.summary}>
        <h2>Общая Сумма: ${total.toFixed(2)}</h2>
        <button className={styles.checkoutButton}>
          ПЕРЕЙТИ К ОФОРМЛЕНИЮ
        </button> 
        {/* Здесь будет переход на Checkout.js */}
      </div>
    </div>
  );
}

export default CartPage;