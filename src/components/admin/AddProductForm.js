import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/AddProductForm.module.css';
import { useToast } from '../../context/ToastContext';

// Категории
const CATEGORIES = ['Fresh', 'Woody', 'Floral', 'Oriental', 'Fruity', 'Spicy'];

function AddProductForm() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [baseDescription, setBaseDescription] = useState('');
  const [totalStockMl, setTotalStockMl] = useState('');
  const [category, setCategory] = useState('Fresh');
  
  // В стейте храним сам ФАЙЛ (imageFile), а не строку
  const [variants, setVariants] = useState([
    { size: '', price: '', imageFile: null } 
  ]);
  
  const [loading, setLoading] = useState(false);

  // Обработчик изменения полей (для файла логика другая)
  const handleVariantChange = (index, event) => {
    const newVariants = [...variants];
    if (event.target.name === 'image') {
        // ❗️ Берем первый файл
        newVariants[index].imageFile = event.target.files[0];
    } else {
        newVariants[index][event.target.name] = event.target.value;
    }
    setVariants(newVariants);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: '', price: '', imageFile: null }]);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
      showToast('Вы не авторизованы.', 'error');
      navigate('/auth');
      setLoading(false);
      return;
    }

    // Проверка: все ли картинки выбраны
    if (variants.some(v => !v.imageFile)) {
        showToast('Пожалуйста, загрузите фото для всех вариантов.', 'error');
        setLoading(false);
        return;
    }

    // ❗️ СОЗДАЕМ FORMDATA (для отправки файлов)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('baseDescription', baseDescription);
    formData.append('totalStockMl', totalStockMl);
    formData.append('category', category);

    // 1. Добавляем данные вариантов как JSON-строку
    // (Мы убираем imageFile из JSON, так как файлы отправляются отдельно)
    const variantsData = variants.map(v => ({
        size: Number(v.size),
        price: Number(v.price)
    }));
    formData.append('variants', JSON.stringify(variantsData));

    // 2. Добавляем сами файлы
    // Имя поля будет "image-0", "image-1" и т.д., чтобы бэкенд знал, к какому варианту относится фото
    variants.forEach((v, index) => {
        formData.append(`image-${index}`, v.imageFile);
    });

    try {
      // ❗️ Убрали 'Content-Type': 'application/json', браузер сам поставит multipart/form-data
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData, 
      });

      if (response.ok) {
        showToast('Товар успешно добавлен!', 'success');
        setName('');
        setBaseDescription('');
        setTotalStockMl('');
        setVariants([{ size: '', price: '', imageFile: null }]);
      } else {
        const errorData = await response.json();
        showToast(`Ошибка: ${errorData.message}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Ошибка сети', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>➕ Добавить Новый Аромат</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <label>Название Аромата:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Категория:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{width: '100%', padding: '10px', marginBottom: '15px'}}>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <label>Базовое Описание:</label>
        <textarea value={baseDescription} onChange={(e) => setBaseDescription(e.target.value)} required />
        
        <label>Общий запас (мл):</label>
        <input type="number" placeholder="Например: 1000" value={totalStockMl} onChange={(e) => setTotalStockMl(e.target.value)} required />
        
        <div className={styles.separator}></div>
        
        <h3>Варианты</h3>
        {variants.map((variant, index) => (
          <div key={index} className={styles.variantBox}>
            <h4>Вариант #{index + 1}</h4>
            <div className={styles.variantInputs}>
              <input name="size" placeholder="Объем (мл)" value={variant.size} onChange={(e) => handleVariantChange(index, e)} type="number" required />
              <input name="price" placeholder="Цена (£)" value={variant.price} onChange={(e) => handleVariantChange(index, e)} type="number" step="0.01" required />
              
              {/* ❗️ ПОЛЕ ЗАГРУЗКИ ФАЙЛА */}
              <input 
                type="file" 
                name="image" 
                accept="image/*"
                onChange={(e) => handleVariantChange(index, e)} 
                required 
                style={{padding: '5px'}}
              />
            </div>
            {variants.length > 1 && (
              <button type="button" className={styles.removeBtn} onClick={() => handleRemoveVariant(index)}>Удалить</button>
            )}
          </div>
        ))}
        
        <button type="button" className={styles.addBtn} onClick={handleAddVariant}>+ Вариант</button>
        <div className={styles.separator}></div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Загрузка...' : 'Добавить Товар'}</button>
      </form>
    </div>
  );
}

export default AddProductForm;