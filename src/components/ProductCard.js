import React, { useState } from 'react';
import styles from './styles/ProductCard.module.css';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

function ProductCard({ product }) {
  const { showToast } = useToast();
  
  // В идеале здесь нужно проверять, лайкнут ли товар при загрузке,
  // но для простоты пока сделаем локальный стейт (сердечко загорится при клике)
  const [isLiked, setIsLiked] = useState(false);

  const minSize = product.variants.reduce(
    (min, v) => (v.size < min ? v.size : min),
    product.variants[0].size
  );

  const startingPrice = product.variants.reduce(
    (min, v) => (v.price < min ? v.price : min),
    product.variants[0].price
  );

  const mainImage = product.variants[0].image;
  const isOutOfStock = product.totalStockMl < minSize;

  // Функция лайка
  const handleLike = async (e) => {
    e.preventDefault(); // Чтобы не переходить по ссылке карточки
    e.stopPropagation();

    const token = localStorage.getItem('authToken');
    if (!token) {
      showToast('Войдите, чтобы добавить в избранное', 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/user/wishlist/${product._id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsLiked(data.isLiked);
        showToast(data.message, 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.cardWrapper}>
      <Link to={`/product/${product._id}`} className={styles.cardLink}>
        <div className={`${styles.card} ${isOutOfStock ? styles.outOfStock : ''}`}>
          
          {isOutOfStock && <span className={styles.soldOutBadge}>Sold Out</span>}

          {/* ❗️ КНОПКА ЛАЙКА */}
          <button 
            className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`} 
            onClick={handleLike}
            title="Добавить в избранное"
          >
            ♥
          </button>

          <img src={mainImage} alt={product.name} className={styles.image} />
          
          <h3 className={styles.name}>{product.name}</h3>
          
          {isOutOfStock ? (
             <p className={styles.price} style={{color: '#666', fontStyle: 'italic'}}>Нет в наличии</p>
          ) : (
             <p className={styles.price}>От £{startingPrice.toFixed(2)}</p>
          )}
          
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;