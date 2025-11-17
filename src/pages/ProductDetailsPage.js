import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext'; 
import styles from './styles/ProductDetailsPage.module.css';

function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast(); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Не удалось загрузить данные');
        const products = await response.json();
        const foundProduct = products.find(p => p._id === productId); 
        if (foundProduct) setProduct(foundProduct);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return; 

    // ❗️ Проверка остатка на складе
    if (product.totalStockMl < selectedVariant.size) {
      showToast('К сожалению, этого объема нет в наличии', 'error');
      return;
    }

    const cartItemId = `${product._id}-${selectedVariant.size}ml`;
    const itemToAdd = {
      cartItemId: cartItemId,
      id: product._id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: selectedVariant.image
    };
    
    addToCart(itemToAdd);
    showToast(`${product.name} (${selectedVariant.size}ml) добавлен в корзину!`);
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.imageGallery}>
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
              // ❗️ Проверка остатка на кнопке
              disabled={product.totalStockMl < variant.size}
              onClick={() => handleVariantClick(variant)}
            >
              {variant.size} ml
            </button>
          ))}
        </div>
        
        {/* ❗️ Проверка остатка - сообщение */}
        {product.totalStockMl < selectedVariant.size && (
          <p className={styles.stockError}>Нет в наличии</p>
        )}

        <div className={styles.price}>
          £{selectedVariant.price.toFixed(2)} {/* 👈 ИЗМЕНЕНИЕ ЗДЕСЬ */}
        </div>

        <button 
          className={styles.addToCartButton} 
          onClick={handleAddToCart}
          // ❗️ Отключаем кнопку, если нет в наличии
          disabled={product.totalStockMl < selectedVariant.size}
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
}

export default ProductDetailsPage;