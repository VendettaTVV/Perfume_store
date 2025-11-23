import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        
        {/* 1. БРЕНД И ОПИСАНИЕ */}
        <div className={styles.brandColumn}>
          <span className={styles.brandName}>AROMATICUS</span>
          <p className={styles.footerText}>
            Оригинальная нишевая парфюмерия.<br />
            Искусство в каждом флаконе.
          </p>
        </div>

        {/* 2. НАВИГАЦИЯ */}
        <div className={styles.linksColumn}>
          <h4>Магазин</h4>
          <Link to="/" className={styles.link}>Каталог</Link>
          <Link to="/about" className={styles.link}>О Бренде</Link>
          <Link to="/contact" className={styles.link}>Контакты</Link>
        </div>

        {/* 3. ПОМОЩЬ */}
        <div className={styles.linksColumn}>
          <h4>Покупателям</h4>
          <Link to="/profile" className={styles.link}>Личный кабинет</Link>
          <Link to="/cart" className={styles.link}>Корзина</Link>
          {/* Ссылки-заглушки для вида */}
          <span className={styles.link} style={{cursor: 'pointer'}}>Доставка и Оплата</span>
          <span className={styles.link} style={{cursor: 'pointer'}}>Возврат</span>
        </div>

        {/* 4. СОЦСЕТИ */}
        <div className={styles.socialColumn}>
          <h4>Мы в соцсетях</h4>
          <div className={styles.socialIcons}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink}>Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className={styles.socialLink}>TikTok</a>
          </div>
        </div>
      </div>

      {/* НИЖНЯЯ ПОЛОСА */}
      <div className={styles.bottomSection}>
        <span className={styles.copyright}>
          &copy; {currentYear} AROMATICUS. Все права защищены.
        </span>
      </div>
    </footer>
  );
}

export default Footer;