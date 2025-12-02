import React from 'react';
import styles from './styles/HeroSection.module.css';

import heroImage from '../assets/hero-bg-v1.png'; 

function HeroSection() {
  return (
    <section 
      className={styles.hero} 
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className={styles.heroContent}>
        <h1 className={styles.title}>UNLOCK YOUR STORY</h1>
        <p className={styles.subtitle}>Where every chord is a chapter, and every note a memory.</p>
      </div>
    </section>
  );
}

export default HeroSection;