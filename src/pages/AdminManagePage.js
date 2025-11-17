import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/AdminManagePage.module.css';
import { useToast } from '../context/ToastContext';

// --- Компонент Модального Окна (встроен здесь) ---
// Он будет получать данные о товаре и функции для управления
const ConfirmDeleteModal = ({ product, onConfirm, onCancel }) => {
  
  // ❗️ Убрали showConfirmModal.
  //    Теперь окно показывается, только если 'product' - это объект, а не null.
  if (!product) {
    return null;
  }

  return (
    // Оверлей (темный фон)
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Подтвердите удаление</h2>
        <p>
          Вы уверены, что хотите навсегда удалить товар:
          <br />
          <strong>{product.name}</strong>?
        </p>
        <p className={styles.modalWarning}>
          Это действие нельзя отменить.
        </p>
        <div className={styles.modalActions}>
          <button onClick={onCancel} className={`${styles.btn} ${styles.modalBtnCancel}`}>
            Отмена
          </button>
          <button onClick={onConfirm} className={`${styles.btn} ${styles.modalBtnConfirm}`}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Основной Компонент Страницы ---

function AdminManagePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ❗️ 1. УБИРАЕМ ненужное состояние
  // const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // ❗️ Оставляем только это

  const { showToast } = useToast();
  const navigate = useNavigate();

  // (Функции handleAuthError и fetchAllProducts остаются без изменений)
  const handleAuthError = useCallback((response) => {
    if (response.status === 401 || response.status === 403) {
      showToast('Сессия истекла. Пожалуйста, войдите заново.', 'error');
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
      if (!token) {
         showToast('Вы не авторизованы.', 'error');
         navigate('/auth');
         return;
      }
      const response = await fetch('http://localhost:5000/api/products/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (handleAuthError(response)) return;
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      if (!err.message.includes('401') && !err.message.includes('403')) {
         showToast('Не удалось загрузить список товаров', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [showToast, navigate, handleAuthError]); 

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // (toggleVisibility остается без изменений)
  const toggleVisibility = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isHidden: !currentStatus })
      });
      if (handleAuthError(response)) return;
      if (response.ok) {
        showToast(`Товар ${!currentStatus ? 'скрыт' : 'виден'}`, 'success');
        fetchAllProducts();
      }
    } catch (err) {
      showToast('Ошибка при обновлении', 'error');
    }
  };

  // ❗️ 2. Эта функция теперь просто устанавливает товар
  const handleDeleteClick = (product) => {
    setProductToDelete(product); // Запоминаем, какой товар хотим удалить
    // setShowConfirmModal(true); // ❗️ УБИРАЕМ
  };

  // ❗️ 3. Эта функция просто сбрасывает товар
  const handleCancelDelete = () => {
    // setShowConfirmModal(false); // ❗️ УБИРАЕМ
    setProductToDelete(null); // Сбрасываем товар
  };

  // ❗️ 4. Эта функция выполняет реальное УДАЛЕНИЕ
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/products/${productToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (handleAuthError(response)) return;
      if (response.ok) {
        showToast('Товар удален', 'success');
        fetchAllProducts();
      }
    } catch (err) {
      showToast('Ошибка при удалении', 'error');
    } finally {
      // Закрываем окно в любом случае
      // setShowConfirmModal(false); // ❗️ УБИРАЕМ
      setProductToDelete(null);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      
      {/* ❗️ 5. Рендерим модальное окно */}
      {/* Оно само решит, показываться или нет, на основе (productToDelete !== null) */}
      <ConfirmDeleteModal 
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <h1 className={styles.header}>Управление Товарами</h1>
      
      <div className={styles.productList}>
        {products.map(product => (
          <div key={product._id} className={`${styles.productItem} ${product.isHidden ? styles.hidden : ''}`}>
            
            <img 
              src={product.variants[0]?.image} 
              alt={product.name} 
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
                className={`${styles.btn} ${styles.toggleBtn} ${product.isHidden ? styles.show : ''}`}
                onClick={() => toggleVisibility(product._id, product.isHidden)}
              >
                {product.isHidden ? 'Показать' : 'Скрыть'}
              </button>
              
              <button 
                className={`${styles.btn} ${styles.deleteBtn}`}
                onClick={() => handleDeleteClick(product)}
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

export default AdminManagePage;