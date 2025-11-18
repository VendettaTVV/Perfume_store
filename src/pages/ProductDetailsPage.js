import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import styles from './styles/ProductDetailsPage.module.css';

function ProductDetailsPage() {
  const { productId } = useParams();
  const { cartItems, addToCart } = useCart(); // ❗️ 1. Достаем cartItems
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // ... (useEffect для загрузки данных остается без изменений) ...
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

  // ❗️ 2. НОВАЯ ЛОГИКА ПРОВЕРКИ ОСТАТКОВ
  
  // Эта функция считает, сколько МЛ этого продукта УЖЕ в корзине
  const getStockInCart = (productId) => {
    return cartItems
      .filter(item => item.id === productId) // Находим все варианты этого товара в корзине
      .reduce((totalMl, item) => totalMl + (item.size * item.quantity), 0);
  };
  
  // Проверяем наличие ДЛЯ ВЫБРАННОГО ВАРИАНТА
  const isVariantOutOfStock = (variant) => {
    if (!product) return true;
    
    const stockInCart = getStockInCart(product._id);
    // (Общий запас) < (Уже в корзине + То, что хотим добавить)
    return product.totalStockMl < (stockInCart + variant.size);
  };
  
  // Проверяем наличие ДЛЯ КНОПКИ "Добавить в корзину"
  // (она должна проверять именно 'selectedVariant')
  const isOutOfStock = selectedVariant ? isVariantOutOfStock(selectedVariant) : true;
  

  // --- ОБРАБОТЧИКИ ---

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    // ❗️ 3. Используем новую проверку
    if (isOutOfStock) {
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

  // ... (Код загрузки и ошибок) ...
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
              // ❗️ 4. Кнопка отключается, если ЕЕ вариант нельзя добавить
              disabled={isVariantOutOfStock(variant)}
              onClick={() => handleVariantClick(variant)}
            >
              {variant.size} ml
            </button>
          ))}
        </div>

        {/* ❗️ 5. Сообщение об ошибке (если выбранный вариант закончился) */}
        {isOutOfStock && (
          <p className={styles.stockError}>Нет в наличии</p>
        )}

        <div className={styles.price}>
          £{selectedVariant.price.toFixed(2)}
        </div>

        <button
          className={styles.addToCartButton}
          onClick={handleAddToCart}
          // ❗️ 6. Отключаем кнопку, если выбранный вариант закончился
          disabled={isOutOfStock}
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
}

export default ProductDetailsPage;