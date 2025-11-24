import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // Переиспользуем карточки
import styles from './styles/WishlistPage.module.css';
import { useToast } from '../context/ToastContext';

function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/user/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          throw new Error('Ошибка');
        }
      } catch (err) {
        console.error(err);
        showToast('Не удалось загрузить избранное', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate, showToast]);

  if (loading) return <div style={{padding: 50, textAlign: 'center'}}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои Избранные Ароматы</h1>
      
      {products.length === 0 ? (
        <p className={styles.empty}>Ваш список желаний пуст.</p>
      ) : (
        <div className={styles.grid}>
          {products.map(product => (
            // ❗️ Важно: Передаем product, карточка сама разберется как его отобразить
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;