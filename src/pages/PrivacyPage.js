import React from 'react';
import styles from './styles/InfoPage.module.css';

function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p>AROMATICUS respects your privacy and is committed to protecting your personal data.</p>
      <p>All data collected during the purchase and registration process is used solely for order fulfilment and internal analytics.</p>
    </div>
  );
}

export default PrivacyPage;