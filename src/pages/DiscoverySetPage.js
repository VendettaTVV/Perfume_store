import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import styles from './styles/DiscoverySetPage.module.css';

function DiscoverySetPage() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [allProducts, setAllProducts] = useState([]);
  const [baseSetProduct, setBaseSetProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Состояние для 5 слотов (выбранные ароматы)
  const [selections, setSelections] = useState([
    '', '', '', '', ''
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        
        // 1. Находим сам товар "Discovery Set" (по названию) для цены и картинки
        const setProduct = data.find(p => p.name === 'Discovery Set');
        
        // 2. Остальные товары - это то, что можно выбрать
        const availableScents = data.filter(p => p.name !== 'Discovery Set' && !p.isHidden);

        if (setProduct) {
          setBaseSetProduct(setProduct);
        }
        setAllProducts(availableScents);
        
      } catch (error) {
        console.error(error);
        showToast('Ошибка загрузки данных', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const handleSelectChange = (index, value) => {
    const newSelections = [...selections];
    newSelections[index] = value;
    setSelections(newSelections);
  };

  const handleAddToCart = () => {
    if (!baseSetProduct) {
        showToast('Товар "Discovery Set" не найден в базе!', 'error');
        return;
    }

    // Проверяем, все ли 5 слотов заполнены
    if (selections.some(s => s === '')) {
      showToast('Пожалуйста, выберите все 5 ароматов.', 'error');
      return;
    }

    // Формируем название
    const scentsList = selections.join(', ');
    const customName = `Discovery Set (${scentsList})`;
    
    // Берем цену и картинку из базового товара
    // (Предполагаем, что у него есть хотя бы один вариант, например 10ml)
    const variant = baseSetProduct.variants[0];

    if (!variant) {
        showToast('У товара Discovery Set нет вариантов цены.', 'error');
        return;
    }

    const itemToAdd = {
      // Уникальный ID для корзины
      cartItemId: `${baseSetProduct._id}-${Date.now()}`, 
      id: baseSetProduct._id,
      name: customName, 
      size: variant.size, 
      price: variant.price,
      image: variant.image,
      quantity: 1
    };

    addToCart(itemToAdd);
    showToast('Набор пробников добавлен в корзину!', 'success');
  };

  if (loading) return <div style={{textAlign: 'center', padding: 50}}>Загрузка...</div>;

  if (!baseSetProduct) return (
    <div style={{textAlign: 'center', padding: 50}}>
      <h2>Товар "Discovery Set" не найден.</h2>
      <p>Пожалуйста, зайдите в админку и создайте товар с названием <b>Discovery Set</b>.</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.imageCol}>
        {/* Показываем картинку базового товара */}
        <img 
          src={baseSetProduct.variants[0]?.image || 'https://via.placeholder.com/400'} 
          alt="Discovery Set" 
        />
      </div>
      
      <div className={styles.infoCol}>
        <h1 className={styles.title}>Собери Свой Набор</h1>
        <p className={styles.subtitle}>
          Выберите 5 ароматов (по 2 мл каждый), чтобы познакомиться с нашей коллекцией.
        </p>
        
        <div className={styles.price}>
            £{baseSetProduct.variants[0]?.price.toFixed(2)}
        </div>

        <div className={styles.selectors}>
          {selections.map((sel, index) => (
            <div key={index} className={styles.selectGroup}>
              <label>Аромат #{index + 1}</label>
              <select 
                value={sel} 
                onChange={(e) => handleSelectChange(index, e.target.value)}
                className={styles.select}
              >
                <option value="">-- Выберите аромат --</option>
                {allProducts.map(p => (
                  <option key={p._id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button className={styles.addBtn} onClick={handleAddToCart}>
          Добавить набор в корзину
        </button>
      </div>
    </div>
  );
}

export default DiscoverySetPage;