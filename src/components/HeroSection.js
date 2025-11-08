// src/components/HeroSection.js
import React from 'react';
import styles from './styles/HeroSection.module.css';

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>UNLOCK YOUR STORY</h1>
        <p className={styles.subtitle}>Where every chord is a chapter, and every note a memory.</p>
        <button className={styles.ctaButton}>EXPLORE THE COLLECTION</button>
      </div>
    </section>
  );
}

export default HeroSection;