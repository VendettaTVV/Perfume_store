// src/components/admin/AddProductForm.js
import React, { useState } from 'react';
import styles from './styles/AddProductForm.module.css';

const initialProductState = {
  name: '',
  description: '',
  price: '',
  notes: '', 
  imageFile: null,
  imageUrl: '', 
};

function AddProductForm() {
  const [productData, setProductData] = useState(initialProductState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    for (const key in productData) {
        if (key !== 'imageUrl') {
            formData.append(key, productData[key]);
        }
    }

    try {
      // ⚠️ Имитация запроса на добавление товара (ЗАМЕНИТЬ на реальный API!)
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        // В реальном приложении: body: formData, headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      if (true /* response.ok */) { // Имитация успеха
        setMessage('✅ Товар успешно добавлен!');
        setProductData(initialProductState);
      } else {
        setMessage('❌ Ошибка добавления: Произошла ошибка на сервере.');
      }
    } catch (error) {
      setMessage('❌ Ошибка сети. Проверьте соединение с сервером.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>➕ Добавить Новый Аромат (Админка)</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <label>Название Аромата:</label>
        <input type="text" name="name" value={productData.name} onChange={handleChange} required />

        <label>Описание:</label>
        <textarea name="description" value={productData.description} onChange={handleChange} required />
        
        <label>Цена ($):</label>
        <input type="number" name="price" value={productData.price} onChange={handleChange} required min="0.01" step="0.01" />

        <label>Ключевые Ноты (через запятую):</label>
        <input type="text" name="notes" value={productData.notes} onChange={handleChange} />

        <label>Изображение:</label>
        <input type="file" name="imageFile" accept="image/*" onChange={handleImageChange} required />
        
        {productData.imageUrl && (
            <div className={styles.imagePreview}>
                <img src={productData.imageUrl} alt="Предпросмотр" />
            </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Добавить Товар'}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default AddProductForm;