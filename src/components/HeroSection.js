import React from 'react';
import styles from './styles/HeroSection.module.css';

// 1. ❗️ ИСПРАВЛЕННЫЙ ПУТЬ:
// Мы поднимаемся на ОДИН уровень (из /components в /src)
// и спускаемся в /assets
import heroImage from '../assets/hero-bg.png'; 

function HeroSection() {
  
  // 2. ❗️ Создаем объект стиля
  const heroStyles = {
    // Webpack сам подставит правильный путь в url()
    backgroundImage: `url(${heroImage})`
  };

  return (
    // 3. ❗️ Применяем стиль к секции
    <section className={styles.hero} style={heroStyles}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>UNLOCK YOUR STORY</h1>
        <p className={styles.subtitle}>Where every chord is a chapter, and every note a memory.</p>
        {/* Кнопка <button> отсюда удалена */}
      </div>
    </section>
  );
}

export default HeroSection;