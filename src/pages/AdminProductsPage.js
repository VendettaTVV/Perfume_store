import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/AdminProductsPage.module.css';
import { useToast } from '../context/ToastContext';

// --- Модальное окно ПОПОЛНЕНИЯ (Restock) ---
const RestockModal = ({ product, onConfirm, onCancel }) => {
  const [amountToAdd, setAmountToAdd] = useState('');

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Передаем введенное число в функцию подтверждения
    onConfirm(Number(amountToAdd));
    setAmountToAdd(''); // Сброс
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Пополнить склад: {product.name}</h3>
        <p>Текущий остаток: <b>{product.totalStockMl} мл</b></p>
        
        <form onSubmit={handleSubmit}>
          <label style={{display: 'block', textAlign: 'left', marginBottom: 5, fontSize: '0.9em'}}>
            Сколько мл добавить?
          </label>
          <input 
            type="number" 
            className={styles.restockInput}
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
            placeholder="Например: 1000"
            min="1"
            required
            autoFocus
          />
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onCancel} className={styles.modalBtnCancel}>Отмена</button>
            <button type="submit" className={styles.modalBtnConfirm} style={{backgroundColor: '#27ae60'}}>
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Модальное окно УДАЛЕНИЯ ---
const ConfirmDeleteModal = ({ product, onConfirm, onCancel }) => {
  if (!product) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Удалить {product.name}?</h3>
        <p>Это действие нельзя отменить.</p>
        <div className={styles.modalActions}>
          <button onClick={onCancel} className={styles.modalBtnCancel}>Отмена</button>
          <button onClick={onConfirm} className={styles.modalBtnConfirm}>Удалить</button>
        </div>
      </div>
    </div>
  );
};

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для модалок
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToRestock, setProductToRestock] = useState(null); // 👈 Для пополнения

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = useCallback((response) => {
    if (response.status === 401 || response.status === 403) {
      showToast('Сессия истекла.', 'error');
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAdmin');
      navigate('/auth');
      return true;
    }
    return false;
  }, [showToast, navigate]);

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { navigate('/auth'); return; }

      const response = await fetch('http://localhost:5000/api/products/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (handleAuthError(response)) return;
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      showToast('Не удалось загрузить товары', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, navigate, handleAuthError]); 

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // --- ФУНКЦИИ ---

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isHidden: !currentStatus })
      });
      fetchAllProducts();
      showToast('Видимость изменена', 'success');
    } catch (err) {
      showToast('Ошибка', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`http://localhost:5000/api/products/${productToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showToast('Товар удален', 'success');
      fetchAllProducts();
    } catch (err) {
      showToast('Ошибка удаления', 'error');
    } finally {
      setProductToDelete(null);
    }
  };

  // ❗️ ФУНКЦИЯ ПОПОЛНЕНИЯ СКЛАДА
  const handleConfirmRestock = async (addedAmount) => {
    if (!productToRestock || !addedAmount) return;
    
    // Считаем новый общий итог
    const newTotal = productToRestock.totalStockMl + addedAmount;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/products/${productToRestock._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        // Отправляем новое значение totalStockMl
        body: JSON.stringify({ totalStockMl: newTotal }) 
      });

      if (handleAuthError(response)) return;
      
      if (response.ok) {
        showToast(`Добавлено ${addedAmount} мл. Новый остаток: ${newTotal} мл`, 'success');
        fetchAllProducts(); // Обновляем список
      }
    } catch (err) {
      showToast('Ошибка пополнения', 'error');
    } finally {
      setProductToRestock(null); // Закрываем окно
    }
  };

  if (loading) return <div style={{padding: 50, textAlign: 'center'}}>Загрузка товаров...</div>;

  return (
    <div className={styles.container}>
      
      {/* Модалка Удаления */}
      <ConfirmDeleteModal 
        product={productToDelete} 
        onConfirm={handleConfirmDelete} 
        onCancel={() => setProductToDelete(null)} 
      />

      {/* ❗️ Модалка Пополнения */}
      <RestockModal 
        product={productToRestock}
        onConfirm={handleConfirmRestock}
        onCancel={() => setProductToRestock(null)}
      />

      <h1 className={styles.header}>Управление Товарами (Склад)</h1>
      
      <div className={styles.productList}>
        {products.map(product => (
          <div key={product._id} className={`${styles.productItem} ${product.isHidden ? styles.hidden : ''}`}>
            <img src={product.variants[0]?.image} alt="" className={styles.productImage}/>
            
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>
                {product.name} {product.isHidden && '(Скрыт)'}
              </h3>
              <p className={styles.productStock}>
                Запас: <b style={{color: product.totalStockMl < 50 ? 'red' : 'green'}}>{product.totalStockMl} мл</b>
              </p>
            </div>

            <div className={styles.actions}>
              
              {/* ❗️ Кнопка Пополнить */}
              <button 
                className={`${styles.btn} ${styles.restockBtn}`} 
                onClick={() => setProductToRestock(product)}
                title="Пополнить склад"
              >
                + МЛ
              </button>

              <button className={`${styles.btn} ${styles.toggleBtn}`} onClick={() => toggleVisibility(product._id, product.isHidden)}>
                {product.isHidden ? 'Показать' : 'Скрыть'}
              </button>
              
              <button className={`${styles.btn} ${styles.deleteBtn}`} onClick={() => setProductToDelete(product)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProductsPage;