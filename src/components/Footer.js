// src/components/Footer.js
import React from 'react';
import styles from './styles/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms &amp; Service</a>
        <span className={styles.copyright}>&copy; 2023 Madisont Cant</span>
      </div>
      <div className={styles.socialIcons}>
        <span>🐦</span>
        <span>📸</span>
        <span>📘</span>
      </div>
    </footer>
  );
}

export default Footer;