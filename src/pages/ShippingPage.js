import React from 'react';
import styles from './styles/InfoPage.module.css';

function ShippingPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Delivery & Returns</h1>
      <p>Standard delivery within the UK is free for orders over £50, and £5 otherwise.</p>
      <p>Estimated delivery time: 3-5 working days.</p>
      <h2 className={styles.subtitle}>Returns</h2>
      <p>We accept returns of unused, sealed items within 30 days of purchase.</p>
    </div>
  );
}

export default ShippingPage;