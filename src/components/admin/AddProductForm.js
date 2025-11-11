// src/components/admin/AddProductForm.js
import React, { useState } from 'react';
import styles from './styles/AddProductForm.module.css';

function AddProductForm() {
  const [name, setName] = useState('');
  const [baseDescription, setBaseDescription] = useState('');
  const [variants, setVariants] = useState([
    { size: '', price: '', image: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- УПРАВЛЕНИЕ ВАРИАНТАМИ ---

  const handleVariantChange = (index, event) => {
    const newVariants = [...variants];
    newVariants[index][event.target.name] = event.target.value;
    setVariants(newVariants);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: '', price: '', image: '' }]);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  // --- ОТПРАВКА ФОРМЫ ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1. ❗ Получаем токен из localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('❌ Вы не авторизованы. Войдите в систему.');
      setLoading(false);
      return;
    }

    const productData = {
      name,
      baseDescription,
      variants: variants.map(v => ({
        ...v,
        size: Number(v.size),
        price: Number(v.price),
      }))
    };
    
    // (Валидация...)

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 2. ❗ ДОБАВЛЯЕМ ТОКЕН В ЗАГОЛОВОК
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(productData), 
      });

      // 3. ❗ Обрабатываем ошибки авторизации
      if (response.status === 401 || response.status === 403) {
        setMessage('❌ Ошибка авторизации. Ваш токен недействителен или истек.');
      } else if (response.ok) {
        setMessage('✅ Товар успешно добавлен!');
        setName('');
        setBaseDescription('');
        setVariants([{ size: '', price: '', image: '' }]);
      } else {
        const errorData = await response.json();
        setMessage(`❌ Ошибка от сервера: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Ошибка сети. Бэкенд запущен?');
    } finally {
      setLoading(false);
    }
  };

  // --- JSX (Верстка) ---
  return (
    <div className={styles.container}>
      <h2>➕ Добавить Новый Аромат (Админка)</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <label>Название Аромата:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Базовое Описание:</label>
        <textarea value={baseDescription} onChange={(e) => setBaseDescription(e.target.value)} required />
        
        <div className={styles.separator}></div>
        
        <h3>Варианты (Объемы)</h3>
        {variants.map((variant, index) => (
          <div key={index} className={styles.variantBox}>
            <h4>Вариант #{index + 1}</h4>
            <div className={styles.variantInputs}>
              <input 
                name="size" 
                placeholder="Объем (мл)" 
                value={variant.size} 
                onChange={(e) => handleVariantChange(index, e)} 
                type="number" 
                required 
              />
              <input 
                name="price" 
                placeholder="Цена ($)" 
                value={variant.price} 
                onChange={(e) => handleVariantChange(index, e)} 
                type="number" 
                step="0.01" 
                required 
              />
              <input 
                name="image" 
                placeholder="Путь к картинке (напр. /images/foto.jpg)" 
                value={variant.image} 
                onChange={(e) => handleVariantChange(index, e)} 
                type="text" 
                required 
              />
            </div>
            {variants.length > 1 && (
              <button type="button" className={styles.removeBtn} onClick={() => handleRemoveVariant(index)}>
                Удалить этот вариант
              </button>
            )}
          </div>
        ))}
        
        <button type="button" className={styles.addBtn} onClick={handleAddVariant}>
          + Добавить еще вариант
        </button>

        <div className={styles.separator}></div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Загрузка...' : 'Добавить Товар в Базу'}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default AddProductForm;