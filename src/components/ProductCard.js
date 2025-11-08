// src/components/ProductCard.js
import React from 'react';
import styles from './styles/ProductCard.module.css';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className={styles.card} style={{ backgroundColor: product.bgColor }}>
      <img src={product.image} alt={product.name} className={styles.image} />
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.description}>{product.description}</p>
      <p className={styles.price}>${product.price.toFixed(2)}</p>
      
      <button 
        className={styles.addToCartButton} 
        onClick={handleAddToCart}
      >
        ADD TO CART
      </button>
    </div>
  );
}

export default ProductCard;