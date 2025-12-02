import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import styles from './styles/CartPage.module.css';

function CartPage() {
  const { cartItems, removeFromCart, total } = useCart();

  // Free shipping logic
  const FREE_SHIPPING_THRESHOLD = 50;
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  if (cartItems.length === 0) {
    return <h2 className={styles.emptyCart}>Your basket is empty. Start shopping!</h2>;
  }

  return (
    <div className={styles.container}>
      <h1>Your Shopping Basket</h1>
      
      {/* Shipping progress bar */}
      <div className={styles.shippingProgressContainer}>
        <p className={styles.shippingText}>
          {remaining > 0 
            ? <>Add **£{remaining.toFixed(2)}** more for **FREE DELIVERY**</>
            : <span style={{color: '#27ae60'}}>Congratulations! You qualify for free delivery 🎉</span>
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
              <p className={styles.variantInfo}>Volume: {item.size} ml</p>
              <p>Quantity: {item.quantity}</p>
              <p>Unit Price: £{item.price.toFixed(2)}</p>
            </div>
            <div className={styles.itemActions}>
              <p className={styles.itemTotal}>£{(item.price * item.quantity).toFixed(2)}</p>
              <button 
                className={styles.removeButton} 
                onClick={() => removeFromCart(item.cartItemId)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.summary}>
        <h2>Basket Total: £{total.toFixed(2)}</h2>
        <Link to="/checkout" className={styles.checkoutButton}>
          PROCEED TO CHECKOUT
        </Link>
      </div>
    </div>
  );
}

export default CartPage;