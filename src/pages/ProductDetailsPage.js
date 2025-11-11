import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// import { mockProducts } from '../data/products'; // 👈 Больше не нужно
import { useCart } from '../context/CartContext';
import styles from './styles/ProductDetailsPage.module.css';

function ProductDetailsPage() {
  // 1. Получаем ID из URL (это будет _id из MongoDB, например "6911eb5a...")
  const { productId } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null); // Стейт для ОДНОГО товара
  const [loading, setLoading] = useState(true);
  
  // 2. Логика загрузки данных
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // ❗ Мы могли бы создать новый эндпоинт (GET /api/products/:id),
        // ❗ но ПРОЩЕ загрузить ВСЕ товары и найти нужный.
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Не удалось загрузить данные');
        }
        const products = await response.json();

        // 3. Находим наш товар в массиве по _id
        const foundProduct = products.find(p => p._id === productId); 
        
        if (foundProduct) {
          setProduct(foundProduct);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Зависимость - productId (чтобы страница перезагружалась, если ID изменится)


  // 4. Логика выбора варианта (перенесена внутрь useEffect, чтобы избежать ошибки)
  // Стейт для выбранного варианта
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    // Этот useEffect сработает, когда 'product' загрузится
    if (product) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);


  // --- Обработчики ---

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    // Убедимся, что все загрузилось
    if (!product || !selectedVariant) return; 

    const cartItemId = `${product._id}-${selectedVariant.size}ml`; // Используем _id
    const itemToAdd = {
      cartItemId: cartItemId,
      id: product._id, // Используем _id
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: selectedVariant.image
    };
    addToCart(itemToAdd);
    alert(`${product.name} (${selectedVariant.size}ml) добавлен в корзину!`);
  };

  // --- Рендеринг ---

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Загрузка аромата...</div>;
  }

  if (!product || !selectedVariant) {
    return (
      <div className={styles.container}>
        <h2>Продукт не найден</h2>
        <Link to="/">Вернуться в каталог</Link>
      </div>
    );
  }

  // 7. JSX (Верстка) - она остается почти такой же
  return (
    <div className={styles.container}>
      <div className={styles.imageGallery}>
        {/* Изображение теперь зависит от selectedVariant */}
        <img src={selectedVariant.image} alt={`${product.name} ${selectedVariant.size}ml`} />
      </div>

      <div className={styles.details}>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.description}>{product.baseDescription}</p>
        
        <div className={styles.separator}></div>
        
        <label className={styles.label}>Выберите объем:</label>
        <div className={styles.variantSelector}>
          {product.variants.map((variant) => (
            <button
              key={variant.size}
              className={`${styles.variantButton} ${
                variant.size === selectedVariant.size ? styles.active : ''
              }`}
              onClick={() => handleVariantClick(variant)}
            >
              {variant.size} ml
            </button>
          ))}
        </div>

        <div className={styles.price}>
          ${selectedVariant.price.toFixed(2)}
        </div>

        <button 
          className={styles.addToCartButton} 
          onClick={handleAddToCart}
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
}

export default ProductDetailsPage;