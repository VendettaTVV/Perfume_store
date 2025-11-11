import React from 'react';
import styles from './styles/ProductCard.module.css';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  // Ищем самую низкую цену
  const startingPrice = product.variants.reduce(
    (min, v) => (v.price < min ? v.price : min),
    product.variants[0].price
  );

  // Картинка первого варианта для превью
  const mainImage = product.variants[0].image;

  return (
    // ❗ 1. Вся карточка — это ссылка
    // ❗ 2. ВАЖНО: Мы используем product._id (с подчеркиванием), так как это ID из MongoDB
    <Link to={`/product/${product._id}`} className={styles.cardLink}>
      <div className={styles.card} style={{ backgroundColor: product.bgColor }}>
        
        {/* Путь к картинке уже правильный, так как он пришел из БД */}
        <img src={mainImage} alt={product.name} className={styles.image} />
        
        <h3 className={styles.name}>{product.name}</h3>
        
        <p className={styles.price}>От ${startingPrice.toFixed(2)}</p>
        
      </div>
    </Link>
  );
}

export default ProductCard;