import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/AdminProductsPage.module.css';
import { useToast } from '../context/ToastContext';

// --- МОДАЛКА: ИЗМЕНЕНИЕ ФОТО ---
const EditImageModal = ({ product, onConfirm, onCancel }) => {
  const [newImages, setNewImages] = useState({}); // { 0: file, 1: file }

  if (!product) return null;

  const handleFileChange = (index, file) => {
    setNewImages(prev => ({ ...prev, [index]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(newImages);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Изменить фото: {product.name}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.variantsList}>
            {product.variants.map((variant, index) => (
              <div key={index} className={styles.variantRow}>
                <img src={variant.image} alt="" width="40" height="40" style={{objectFit:'cover', borderRadius:4}} />
                <span className={styles.variantLabel}>{variant.size} ml</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  style={{flex: 1}}
                />
              </div>
            ))}
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onCancel} className={styles.modalBtnCancel}>Отмена</button>
            <button type="submit" className={styles.modalBtnConfirm} style={{backgroundColor: '#8e44ad'}}>
              Загрузить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- МОДАЛКА: ОПИСАНИЕ ---
const EditDescriptionModal = ({ product, onConfirm, onCancel }) => {
  const [description, setDescription] = useState('');
  useEffect(() => { if (product) setDescription(product.baseDescription); }, [product]);
  if (!product) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Редактировать описание</h3>
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(description); }}>
          <textarea className={styles.descriptionInput} value={description} onChange={(e) => setDescription(e.target.value)} rows="6" required />
          <div className={styles.modalActions}>
            <button type="button" onClick={onCancel} className={styles.modalBtnCancel}>Отмена</button>
            <button type="submit" className={styles.modalBtnConfirm} style={{backgroundColor: '#e67e22'}}>Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- МОДАЛКА: ЦЕНЫ ---
const EditPriceModal = ({ product, onConfirm, onCancel }) => {
  const [editedVariants, setEditedVariants] = useState([]);
  useEffect(() => { if (product) setEditedVariants(product.variants.map(v => ({ ...v }))); }, [product]);
  if (!product) return null;
  const handlePriceChange = (index, newPrice) => {
    const newVars = [...editedVariants]; newVars[index].price = Number(newPrice); setEditedVariants(newVars);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Изменить цены</h3>
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(editedVariants); }}>
          <div className={styles.variantsList}>
            {editedVariants.map((variant, index) => (
              <div key={index} className={styles.variantRow}>
                <span className={styles.variantLabel}>{variant.size} ml</span>
                <input type="number" className={styles.priceInput} value={variant.price} onChange={(e) => handlePriceChange(index, e.target.value)} step="0.01" required />
                <span className={styles.currencyLabel}>£</span>
              </div>
            ))}
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onCancel} className={styles.modalBtnCancel}>Отмена</button>
            <button type="submit" className={styles.modalBtnConfirm} style={{backgroundColor: '#2980b9'}}>Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- МОДАЛКА: СКЛАД ---
const RestockModal = ({ product, onConfirm, onCancel }) => {
  const [amountToAdd, setAmountToAdd] = useState('');
  if (!product) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Пополнить склад</h3>
        <p>Текущий: <b>{product.totalStockMl} мл</b></p>
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(Number(amountToAdd)); setAmountToAdd(''); }}>
          <input type="number" className={styles.restockInput} value={amountToAdd} onChange={(e) => setAmountToAdd(e.target.value)} placeholder="Например: 1000" required autoFocus />
          <div className={styles.modalActions}>
            <button type="button" onClick={onCancel} className={styles.modalBtnCancel}>Отмена</button>
            <button type="submit" className={styles.modalBtnConfirm} style={{backgroundColor: '#27ae60'}}>Добавить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- МОДАЛКА: УДАЛЕНИЕ ---
const ConfirmDeleteModal = ({ product, onConfirm, onCancel }) => {
  if (!product) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Удалить {product.name}?</h3>
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
  const [productToRestock, setProductToRestock] = useState(null);
  const [productToEditPrice, setProductToEditPrice] = useState(null);
  const [productToEditDesc, setProductToEditDesc] = useState(null);
  const [productToEditImage, setProductToEditImage] = useState(null); // ❗️ Состояние для фото

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

  // --- ФУНКЦИИ ОБРАБОТКИ ---

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
      } catch (e) { showToast('Ошибка', 'error'); }
  };

  const handleConfirmDelete = async () => {
      if (!productToDelete) return;
      try {
          const token = localStorage.getItem('authToken');
          await fetch(`http://localhost:5000/api/products/${productToDelete._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          showToast('Удалено', 'success');
          fetchAllProducts();
      } catch (e) { showToast('Ошибка', 'error'); } finally { setProductToDelete(null); }
  };

  const handleConfirmRestock = async (val) => {
      if (!productToRestock) return;
      try {
          const token = localStorage.getItem('authToken');
          const newTotal = productToRestock.totalStockMl + val;
          await fetch(`http://localhost:5000/api/products/${productToRestock._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ totalStockMl: newTotal })
          });
          showToast('Склад пополнен', 'success');
          fetchAllProducts();
      } catch (e) { showToast('Ошибка', 'error'); } finally { setProductToRestock(null); }
  };

  const handleConfirmPriceEdit = async (vars) => {
      if (!productToEditPrice) return;
      try {
          const token = localStorage.getItem('authToken');
          await fetch(`http://localhost:5000/api/products/${productToEditPrice._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ variants: vars })
          });
          showToast('Цены обновлены', 'success');
          fetchAllProducts();
      } catch (e) { showToast('Ошибка', 'error'); } finally { setProductToEditPrice(null); }
  };

  const handleConfirmDescriptionEdit = async (desc) => {
       if (!productToEditDesc) return;
       try {
          const token = localStorage.getItem('authToken');
          await fetch(`http://localhost:5000/api/products/${productToEditDesc._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ baseDescription: desc })
          });
          showToast('Описание обновлено', 'success');
          fetchAllProducts();
       } catch (e) { showToast('Ошибка', 'error'); } finally { setProductToEditDesc(null); }
  };

  // ❗️ ФУНКЦИЯ ЗАГРУЗКИ ФОТО
  const handleConfirmImageEdit = async (newImagesMap) => {
    if (!productToEditImage) return;

    if (Object.keys(newImagesMap).length === 0) {
        setProductToEditImage(null);
        return;
    }

    try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        
        // Добавляем файлы
        Object.keys(newImagesMap).forEach(index => {
            formData.append(`image-${index}`, newImagesMap[index]);
        });
        
        // Отправляем текущие варианты (чтобы бэкенд знал структуру)
        formData.append('variants', JSON.stringify(productToEditImage.variants));

        const response = await fetch(`http://localhost:5000/api/products/${productToEditImage._id}`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${token}` 
                // ❗️ Content-Type не ставим, это FormData
            },
            body: formData
        });

        if (handleAuthError(response)) return;
        if (response.ok) {
            showToast('Фото обновлены!', 'success');
            fetchAllProducts();
        }
    } catch (err) {
        console.error(err);
        showToast('Ошибка загрузки фото', 'error');
    } finally {
        setProductToEditImage(null);
    }
  };

  if (loading) return <div style={{padding: 50, textAlign: 'center'}}>Загрузка товаров...</div>;

  return (
    <div className={styles.container}>
      
      <ConfirmDeleteModal product={productToDelete} onConfirm={handleConfirmDelete} onCancel={() => setProductToDelete(null)} />
      <RestockModal product={productToRestock} onConfirm={handleConfirmRestock} onCancel={() => setProductToRestock(null)} />
      <EditPriceModal product={productToEditPrice} onConfirm={handleConfirmPriceEdit} onCancel={() => setProductToEditPrice(null)} />
      <EditDescriptionModal product={productToEditDesc} onConfirm={handleConfirmDescriptionEdit} onCancel={() => setProductToEditDesc(null)} />
      
      {/* ❗️ Модалка Фото */}
      <EditImageModal product={productToEditImage} onConfirm={handleConfirmImageEdit} onCancel={() => setProductToEditImage(null)} />

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
              <p style={{fontSize: '0.8em', color: '#777', marginTop: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px'}}>
                {product.baseDescription}
              </p>
            </div>

            <div className={styles.actions}>
              <button className={`${styles.btn} ${styles.restockBtn}`} onClick={() => setProductToRestock(product)} title="Пополнить склад">+ МЛ</button>
              <button className={`${styles.btn} ${styles.priceBtn}`} onClick={() => setProductToEditPrice(product)} title="Изменить цену">£</button>
              <button className={`${styles.btn} ${styles.descBtn}`} onClick={() => setProductToEditDesc(product)} title="Редактировать описание">Txt</button>
              
              {/* ❗️ Кнопка Фото */}
              <button className={`${styles.btn} ${styles.imgBtn}`} onClick={() => setProductToEditImage(product)} title="Изменить фото">📷</button>

              <button className={`${styles.btn} ${styles.toggleBtn}`} onClick={() => toggleVisibility(product._id, product.isHidden)}>
                {product.isHidden ? 'Показать' : 'Скрыть'}
              </button>
              <button className={`${styles.btn} ${styles.deleteBtn}`} onClick={() => setProductToDelete(product)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProductsPage;