import React from 'react';
import styles from './styles/AboutPage.module.css';

function AboutPage() {
  return (
    <div className={styles.container}>
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>AROMATICUS</h1>
          <p className={styles.subtitle}>The Art of Capturing a Moment</p>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.textContent}>
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <p className={styles.text}>
            It all began with a single memory. The scent of rain on hot asphalt in Paris, 
            the aroma of old books in an Oxford library, the freshness of morning mist in the Alps.
          </p>
          <p className={styles.text}>
            We believe that perfume is an invisible accessory that says more about you than words. 
            Founded in 2023, AROMATICUS was born from a single aim: to create fragrances that tell stories. 
            Not just scents, but olfactory journeys.
          </p>
        </div>
      </section>

      <section className={styles.philosophySection}>
        <h2 className={styles.sectionTitle}>Our Philosophy</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueItem}>
            <h3>Purity</h3>
            <p>We use only rare and natural ingredients, gathered by hand in Grasse and other corners of the globe.</p>
          </div>
          <div className={styles.valueItem}>
            <h3>Individuality</h3>
            <p>Our fragrances are not for everyone. They are for those who seek a unique signature and are not afraid to stand out.</p>
          </div>
          <div className={styles.valueItem}>
            <h3>Time</h3>
            <p>We do not chase trends. Each of our fragrances matures for months to reveal the full depth of its pyramid.</p>
          </div>
        </div>
      </section>

      <section className={styles.founderSection}>
        <div className={styles.quoteBox}>
          <p className={styles.quote}>
            "Perfume is memory that never fails."
          </p>
          <span className={styles.author}>— The Founders of AROMATICUS</span>
        </div>
      </section>

    </div>
  );
}

export default AboutPage;