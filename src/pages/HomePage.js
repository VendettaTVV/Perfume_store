import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; 
import HeroSection from '../components/HeroSection';
import SignatureScents from '../components/SignatureScents';
import styles from './styles/HomePage.module.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/products';
      if (keyword) {
        url += `?keyword=${keyword}`;
      }

      const response = await fetch(url);
      
      // 1. Проверяем статус ответа
      if (!response.ok) {
        console.error("Ошибка сервера:", response.status);
        setProducts([]); // Ставим пустой список, чтобы сайт не падал
        return;
      }

      const data = await response.json();
      
      // 2. Проверяем, что data - это массив, прежде чем фильтровать
      if (Array.isArray(data)) {
        const filteredData = data.filter(p => p.name !== 'Discovery Set');
        setProducts(filteredData);
      } else {
        console.error("Сервер вернул не массив:", data);
        setProducts([]);
      }

    } catch (err) {
      console.error("Ошибка сети:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [keyword]); 

  return (
    <>
      {!keyword && <HeroSection />}
      
      <div className={styles.container}>
        
        {!keyword && (
          <div className={styles.discoveryBanner}>
            <h2 className={styles.discoveryTitle}>
              Создай Свой Уникальный Сет
            </h2>
            <p className={styles.discoveryText}>
              Выберите 5 ароматов, которые вас вдохновляют, и соберите персональную коллекцию миниатюр для знакомства с брендом.
            </p>
            <Link to="/discovery-set" className={styles.discoveryBtn}>
              СОБРАТЬ СЕТ
            </Link>
          </div>
        )}

        {keyword && (
           <h2 className={styles.searchTitle}>
             Результаты поиска: "{keyword}"
           </h2>
        )}

        {loading ? (
           <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>Загрузка...</div>
        ) : products.length > 0 ? (
           <SignatureScents products={products} />
        ) : (
           <div style={{ textAlign: 'center', padding: '50px', color: '#777' }}>
             Товары не найдены.
           </div>
        )}
      </div>
    </>
  );
}

export default HomePage;