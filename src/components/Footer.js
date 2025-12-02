import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        <div className={styles.brandColumn}>
          <span className={styles.brandName}>AROMATICUS</span>
          <p className={styles.footerText}>
            Original Niche Perfume Decants.<br />
            Luxury experience, one drop at a time.
          </p>
        </div>
        <div className={styles.linksColumn}>
          <h4>Shop</h4>
          <Link to="/" className={styles.link}>Collection</Link>
          <Link to="/about" className={styles.link}>Our Story</Link>
          <Link to="/contact" className={styles.link}>Contact</Link>
          <Link to="/discovery-set" className={styles.link}>Discovery Sets</Link>
        </div>
        <div className={styles.linksColumn}>
          <h4>Customer Service</h4>
          <Link to="/shipping" className={styles.link}>Delivery & Returns</Link>
          <Link to="/faq" className={styles.link}>FAQs</Link>
          <Link to="/profile" className={styles.link}>My Cabinet</Link>
          <Link to="/admin/orders" className={styles.link}>Track My Order</Link>
        </div>
        <div className={styles.linksColumn}>
          <h4>Legal & Info</h4>
          <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
          <Link to="/terms" className={styles.link}>Terms & Conditions</Link>
        </div>
        <div className={styles.trustSocialColumn}>
          <h4>Connect</h4>
          <a href="https://trustpilot.com" target="_blank" rel="noreferrer" className={styles.trustLink}>
            Trustpilot Reviews
          </a>
          <div className={styles.socialIconsContainer}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialIconLink}>
              <span className={styles.socialIcon}></span> Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className={styles.socialIconLink}>
              <span className={styles.socialIcon}></span> TikTok
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <span className={styles.copyright}>&copy; {currentYear} AROMATICUS. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;