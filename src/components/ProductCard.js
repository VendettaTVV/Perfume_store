import React from 'react';
import styles from './styles/ProductCard.module.css';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const startingPrice = product.variants.reduce(
    (min, v) => (v.price < min ? v.price : min),
    product.variants[0].price
  );

  const mainImage = product.variants[0].image;

  return (
    <Link to={`/product/${product._id}`} className={styles.cardLink}>
      <div className={styles.card} style={{ backgroundColor: product.bgColor }}>
        
        <img src={mainImage} alt={product.name} className={styles.image} />
        
        <h3 className={styles.name}>{product.name}</h3>
        
        <p className={styles.price}>От £{startingPrice.toFixed(2)}</p> {/* 👈 ИЗМЕНЕНИЕ ЗДЕСЬ */}
        
      </div>
    </Link>
  );
}

export default ProductCard;