import React from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
// import { stripePromise } from '../utils/stripe'; 
import styles from './styles/CartPage.module.css';

function CartPage() {
  const { cartItems, removeFromCart, total } = useCart();
  const { showToast } = useToast();

  const handleCheckout = () => {
    // ❗️ Пока Stripe не настроен, используем заглушку
    showToast("Переход к оплате (Stripe будет настроен позже)", "success");
  };

  if (cartItems.length === 0) {
    return <h2 className={styles.emptyCart}>Ваша корзина пуста. Начните покупки!</h2>;
  }

  return (
    <div className={styles.container}>
      <h1>Ваша Корзина</h1>
      <div className={styles.cartList}>
        {cartItems.map(item => (
          <div key={item.cartItemId} className={styles.cartItem}>
            
            <img src={item.image} alt={item.name} className={styles.itemImage} />
            
            <div className={styles.itemDetails}>
              <h3>{item.name}</h3>
              <p className={styles.variantInfo}>Объем: {item.size} ml</p>
              <p>Количество: {item.quantity}</p>
              <p>Цена за ед.: £{item.price.toFixed(2)}</p> {/* 👈 ИЗМЕНЕНИЕ ЗДЕСЬ */}
            </div>
            
            <div className={styles.itemActions}>
              <p className={styles.itemTotal}>£{(item.price * item.quantity).toFixed(2)}</p> {/* 👈 ИЗМЕНЕНИЕ ЗДЕСЬ */}
              
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
        <h2>Общая Сумма: £{total.toFixed(2)}</h2> {/* 👈 ИЗМЕНЕНИЕ ЗДЕСЬ */}
        <button className={styles.checkoutButton} onClick={handleCheckout}>
          ПЕРЕЙТИ К ОФОРМЛЕНИЮ
        </button> 
      </div>
    </div>
  );
}

export default CartPage;