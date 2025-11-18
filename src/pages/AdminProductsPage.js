import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/AdminProductsPage.module.css'; 
import { useToast } from '../context/ToastContext';

// Компонент модального окна
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
  const [productToDelete, setProductToDelete] = useState(null);

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

      // ❗️ ЗАПРОС ТОВАРОВ
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

  if (loading) return <div style={{padding: 50, textAlign: 'center'}}>Загрузка товаров...</div>;

  return (
    <div className={styles.container}>
      <ConfirmDeleteModal 
        product={productToDelete} 
        onConfirm={handleConfirmDelete} 
        onCancel={() => setProductToDelete(null)} 
      />

      <h1 className={styles.header}>Управление Товарами (Склад)</h1>
      
      <div className={styles.productList}>
        {products.map(product => (
          <div key={product._id} className={`${styles.productItem} ${product.isHidden ? styles.hidden : ''}`}>
            
            {/* Картинка */}
            <img 
              src={product.variants[0]?.image} 
              alt="" 
              className={styles.productImage}
            />
            
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>
                {product.name} {product.isHidden && '(Скрыт)'}
              </h3>
              <p className={styles.productStock}>
                Общий запас: <b>{product.totalStockMl} мл</b>
              </p>
            </div>

            <div className={styles.actions}>
              <button 
                className={`${styles.btn} ${styles.toggleBtn}`} 
                onClick={() => toggleVisibility(product._id, product.isHidden)}
              >
                {product.isHidden ? 'Показать' : 'Скрыть'}
              </button>
              
              <button 
                className={`${styles.btn} ${styles.deleteBtn}`} 
                onClick={() => setProductToDelete(product)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
        
        {products.length === 0 && <p>Товаров пока нет.</p>}
      </div>
    </div>
  );
}

export default AdminProductsPage;