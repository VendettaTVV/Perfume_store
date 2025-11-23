import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import styles from './styles/ProductDetailsPage.module.css';

// Вспомогательный компонент Звездочек
const Rating = ({ value, text }) => {
  return (
    <div className={styles.rating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= value ? '#f8e825' : '#ccc' }}>
          ★
        </span>
      ))}
      {text && <span className={styles.ratingText}>{text}</span>}
    </div>
  );
};

function ProductDetailsPage() {
  const { productId } = useParams();
  const { cartItems, addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Стейт для формы отзыва
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        const foundProduct = products.find(p => p._id === productId);
        if (foundProduct) setProduct(foundProduct);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line
  }, [productId]);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // --- ЛОГИКА КОРЗИНЫ ---
  const getStockInCart = (productId) => {
    return cartItems
      .filter(item => item.id === productId)
      .reduce((totalMl, item) => totalMl + (item.size * item.quantity), 0);
  };
  
  const isVariantOutOfStock = (variant) => {
    if (!product) return true;
    const stockInCart = getStockInCart(product._id);
    return product.totalStockMl < (stockInCart + variant.size);
  };
  
  const isOutOfStock = selectedVariant ? isVariantOutOfStock(selectedVariant) : true;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    if (isOutOfStock) {
      showToast('К сожалению, этого объема нет в наличии', 'error');
      return;
    }
    const cartItemId = `${product._id}-${selectedVariant.size}ml`;
    const itemToAdd = {
      cartItemId,
      id: product._id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: selectedVariant.image
    };
    addToCart(itemToAdd);
    showToast(`${product.name} (${selectedVariant.size}ml) добавлен в корзину!`);
  };


  // --- ЛОГИКА ОТЗЫВОВ ---
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
        showToast('Пожалуйста, войдите, чтобы оставить отзыв', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/products/${product._id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rating, comment })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Отзыв успешно добавлен!', 'success');
            setRating(5);
            setComment('');
            fetchProductDetails(); // Обновляем данные
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Ошибка отправки отзыва', 'error');
    }
  };


  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Загрузка...</div>;
  if (!product || !selectedVariant) return <div>Продукт не найден</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.imageGallery}>
          <img src={selectedVariant.image} alt={product.name} />
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{product.name}</h1>
          
          {/* Рейтинг товара */}
          <div style={{marginBottom: '20px'}}>
             <Rating value={product.rating} text={`${product.numReviews} отзывов`} />
          </div>

          <p className={styles.description}>{product.baseDescription}</p>
          <div className={styles.separator}></div>
          
          <label className={styles.label}>Выберите объем:</label>
          <div className={styles.variantSelector}>
            {product.variants.map((variant) => (
              <button
                key={variant.size}
                className={`${styles.variantButton} ${variant.size === selectedVariant.size ? styles.active : ''}`}
                disabled={isVariantOutOfStock(variant)}
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.size} ml
              </button>
            ))}
          </div>

          {isOutOfStock && <p className={styles.stockError}>Нет в наличии</p>}
          <div className={styles.price}>£{selectedVariant.price.toFixed(2)}</div>

          <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={isOutOfStock}>
            Добавить в корзину
          </button>
        </div>
      </div>

      {/* --- СЕКЦИЯ ОТЗЫВОВ --- */}
      <div className={styles.reviewsContainer}>
        <h2>Отзывы ({product.reviews.length})</h2>
        
        <div className={styles.reviewsContent}>
            {/* Список отзывов */}
            <div className={styles.reviewList}>
                {product.reviews.length === 0 && <p>Нет отзывов. Будьте первым!</p>}
                {product.reviews.map(review => (
                    <div key={review._id} className={styles.reviewItem}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                        <p className={styles.reviewDate}>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                    </div>
                ))}
            </div>

            {/* Форма отзыва */}
            <div className={styles.reviewForm}>
                <h3>Написать отзыв</h3>
                {localStorage.getItem('authToken') ? (
                    <form onSubmit={submitReviewHandler}>
                        <div className={styles.formGroup}>
                            <label>Оценка</label>
                            <select value={rating} onChange={(e) => setRating(e.target.value)}>
                                <option value="1">1 - Плохо</option>
                                <option value="2">2 - Так себе</option>
                                <option value="3">3 - Нормально</option>
                                <option value="4">4 - Хорошо</option>
                                <option value="5">5 - Отлично</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Комментарий</label>
                            <textarea 
                                rows="3" 
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className={styles.submitReviewBtn}>Отправить</button>
                    </form>
                ) : (
                    <p>Пожалуйста <Link to="/auth" style={{textDecoration: 'underline'}}>войдите</Link>, чтобы оставить отзыв.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;