import React from 'react';
import styles from './styles/InfoPage.module.css';

function FAQPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Frequently Asked Questions (FAQ)</h1>
      <h2 className={styles.subtitle}>Are your decants authentic?</h2>
      <p>Yes. We guarantee 100% authenticity. All fragrances are sourced directly from reputable UK retailers.</p>
      <h2 className={styles.subtitle}>How long does shipping take?</h2>
      <p>Standard delivery is 3-5 working days via Royal Mail.</p>
    </div>
  );
}

export default FAQPage;