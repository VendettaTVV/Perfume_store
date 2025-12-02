import React from 'react';
import styles from './styles/SignatureScents.module.css';
import ProductCard from './ProductCard';

function SignatureScents({ products }) {
  return (
    <section className={styles.signatureScents}>
      <h2 className={styles.title}>SIGNATURE SCENTS</h2>
      <div className={styles.productList}>
        {products.map(product => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default SignatureScents;