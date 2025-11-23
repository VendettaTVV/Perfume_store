import React from 'react';
import styles from './styles/ProductCard.module.css';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  // 1. Находим самый маленький объем флакона у этого товара
  const minSize = product.variants.reduce(
    (min, v) => (v.size < min ? v.size : min),
    product.variants[0].size
  );

  // 2. Находим стартовую цену
  const startingPrice = product.variants.reduce(
    (min, v) => (v.price < min ? v.price : min),
    product.variants[0].price
  );

  const mainImage = product.variants[0].image;

  // 3. ГЛАВНАЯ ПРОВЕРКА: Хватает ли запаса хотя бы на минимальный флакон?
  const isOutOfStock = product.totalStockMl < minSize;

  return (
    <Link to={`/product/${product._id}`} className={styles.cardLink}>
      <div 
        className={`${styles.card} ${isOutOfStock ? styles.outOfStock : ''}`} 
        /* ❗️ УБРАЛ style={{ backgroundColor: product.bgColor }} */
        /* Теперь цвет будет браться из CSS файла */
      >
        
        {/* 4. Показываем бейдж, если нет в наличии */}
        {isOutOfStock && <span className={styles.soldOutBadge}>Sold Out</span>}

        <img src={mainImage} alt={product.name} className={styles.image} />
        
        <h3 className={styles.name}>{product.name}</h3>
        
        {/* 5. Меняем цену на надпись */}
        {isOutOfStock ? (
           <p className={styles.price} style={{color: '#666', fontStyle: 'italic'}}>Нет в наличии</p>
        ) : (
           <p className={styles.price}>От £{startingPrice.toFixed(2)}</p>
        )}
        
      </div>
    </Link>
  );
}

export default ProductCard;