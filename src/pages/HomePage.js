import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SignatureScents from '../components/SignatureScents';
import styles from './styles/HomePage.module.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Получаем поисковый запрос из URL (если он был введен в Хедере)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Формируем URL
      let url = 'http://localhost:5000/api/products';
      if (keyword) {
        url += `?keyword=${keyword}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Ошибка при загрузке товаров:", err);
    } finally {
      setLoading(false);
    }
  };

  // Перезагружаем товары, когда меняется поиск
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [keyword]); 

  return (
    <>
      {/* Баннер показываем только если не идет поиск */}
      {!keyword && <HeroSection />}
      
      <div className={styles.container}>
        
        {/* Заголовок результатов поиска */}
        {keyword && (
           <h2 className={styles.searchTitle}>
             Результаты поиска: "{keyword}"
           </h2>
        )}

        {loading ? (
           <div className={styles.message}>Загрузка...</div>
        ) : products.length > 0 ? (
           <SignatureScents products={products} />
        ) : (
           <div className={styles.message}>
             Ничего не найдено.
           </div>
        )}
      </div>
    </>
  );
}

export default HomePage;