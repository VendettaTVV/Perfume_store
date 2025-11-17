import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/AddProductForm.module.css';
import { useToast } from '../../context/ToastContext';

function AddProductForm() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [baseDescription, setBaseDescription] = useState('');
  const [totalStockMl, setTotalStockMl] = useState('');
  
  const [variants, setVariants] = useState([
    { size: '', price: '', image: '' }
  ]);
  
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
      showToast('Вы не авторизованы. Войдите в систему.', 'error');
      navigate('/auth');
      setLoading(false);
      return;
    }

    const productData = {
      name,
      baseDescription,
      totalStockMl: Number(totalStockMl),
      variants: variants.map(v => ({
        size: Number(v.size),
        price: Number(v.price),
        image: v.image,
      }))
    };
    
    if (isNaN(productData.totalStockMl) || productData.variants.some(v => isNaN(v.size) || isNaN(v.price))) {
        showToast('Пожалуйста, введите корректные числа.', 'error');
        setLoading(false);
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(productData), 
      });

      if (response.ok) {
        showToast('Товар успешно добавлен!', 'success');
        setName('');
        setBaseDescription('');
        setTotalStockMl('');
        setVariants([{ size: '', price: '', image: '' }]);
      } else {
        if (response.status === 401 || response.status === 403) {
            showToast('Сессия истекла. Пожалуйста, войдите заново.', 'error');
            localStorage.removeItem('authToken');
            navigate('/auth');
            return;
        }
        const errorData = await response.json();
        showToast(`Ошибка от сервера: ${errorData.message}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Ошибка сети. Бэкенд запущен?', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>➕ Добавить Новый Аромат</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <label>Название Аромата:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />

        <label>Базовое Описание:</label>
        <textarea 
          value={baseDescription} 
          onChange={(e) => setBaseDescription(e.target.value)} 
          required 
        />
        
        <label>Общий запас (мл):</label>
        <input 
          type="number" 
          placeholder="Например: 1000"
          value={totalStockMl} 
          onChange={(e) => setTotalStockMl(e.target.value)} 
          required 
          min="0"
        />
        
        <div className={styles.separator}></div>
        
        <h3>Варианты (Объемы и Цены)</h3>
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
                placeholder="Цена (£)" /* 👈 ИЗМЕНЕНИЕ ЗДЕСЬ */
                value={variant.price} 
                onChange={(e) => handleVariantChange(index, e)} 
                type="number" 
                step="0.01" 
                required 
              />
              <input 
                name="image" 
                placeholder="Путь к картинке" 
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
    </div>
  );
}

export default AddProductForm;