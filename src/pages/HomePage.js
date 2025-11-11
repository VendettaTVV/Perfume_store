// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import SignatureScents from '../components/SignatureScents';

function HomePage() {
  const [products, setProducts] = useState([]); // По-прежнему массив по умолчанию
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Стейт для хранения ошибки

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null); // Сбрасываем предыдущие ошибки

        const response = await fetch('http://localhost:5000/api/products');

        // --- 1. ПРОВЕРКА ОТВЕТА ---
        if (!response.ok) {
          // Если ответ 404, 500 и т.д. - выбрасываем ошибку
          throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // --- 2. ПРОВЕРКА, ЧТО ДАННЫЕ - МАССИВ ---
        if (Array.isArray(data)) {
          setProducts(data); // Все в порядке, сохраняем массив
        } else {
          // Если сервер вернул не массив (например, объект ошибки)
          console.error("Получены не-массивные данные:", data);
          setProducts([]); // Устанавливаем пустой массив, чтобы .map() не сломался
          setError("Формат полученных данных некорректен.");
        }

      } catch (err) {
        // Ловим ошибки (Failed to fetch, или те, что мы "бросили" выше)
        console.error("Ошибка при загрузке товаров:", err);
        setError(`Не удалось загрузить товары. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // [] - пустой массив означает "запустить 1 раз при загрузке"

  // --- 3. РЕНДЕРИНГ НА ОСНОВЕ СОСТОЯНИЯ ---

  // Показываем индикатор загрузки
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Загрузка ароматов...</div>;
  }

  // Показываем сообщение об ошибке, если она есть
  if (error) {
    return <div style={{ textAlign: 'center', padding: '100px', color: 'red' }}>{error}</div>;
  }

  // Показываем товары, если все в порядке
  return (
    <>
      <HeroSection />
      {products.length > 0 ? (
        <SignatureScents products={products} />
      ) : (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          В каталоге пока нет ни одного аромата.
        </div>
      )}
    </>
  );
}

export default HomePage;