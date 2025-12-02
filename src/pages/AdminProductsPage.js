import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/AdminProductsPage.module.css';
import { useToast } from '../context/ToastContext';

// --- MODALS ---

const ConfirmDeleteModal = ({ product, onConfirm, onCancel }) => {
  if (!product) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Delete {product.name}?</h3>
        <div className={styles.modalActions}>
          <button onClick={onCancel} className={styles.modalBtnCancel}>Cancel</button>
          <button onClick={onConfirm} className={styles.modalBtnConfirm} style={{backgroundColor: '#d32f2f'}}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const RestockModal = ({ product, onConfirm, onCancel }) => {
  const [amountToAdd, setAmountToAdd] = useState('');
  if (!product) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Restock: {product.name}</h3>
        <p>Current Stock: <b>{product.totalStockMl} ml</b></p>
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(Number(amountToAdd)); setAmountToAdd(''); }}>
          <input type="number" className={styles.restockInput} value={amountToAdd} onChange={(e) => setAmountToAdd(e.target.value)} placeholder="E.g. 1000" required autoFocus />
          <div className={styles.modalActions}>
            <button type="button" onClick={onCancel} className={styles.modalBtnCancel}>Cancel</button>
            <button type="submit" className={styles.modalBtnConfirm} style={{backgroundColor: '#27ae60'}}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditPriceModal = ({ product, onConfirm, onCancel }) => {
  const [editedVariants, setEditedVariants] = useState([]);
  useEffect(() => { if (product) setEditedVariants(product.variants.map(v => ({ ...v }))); }, [product]);
  if (!product) return null;
  const handlePriceChange = (index, newPrice) => { const newVars = [...editedVariants]; newVars[index].price = Number(newPrice); setEditedVariants(newVars); };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Edit Prices</h3>
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
            <button type="button" onClick={onCancel} className={styles.modalBtnCancel}>Cancel</button>
            <button type="submit" className={styles.modalBtnConfirm} style={{backgroundColor: '#2980b9'}}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditDescriptionModal = ({ product, onConfirm, onCancel }) => {
  const [description, setDescription] = useState('');
  useEffect(() => { if (product) setDescription(product.baseDescription); }, [product]);
  if (!product) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Edit Description</h3>
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(description); }}>
          <textarea className={styles.descriptionInput} value={description} onChange={(e) => setDescription(e.target.value)} rows="6" required />
          <div className={styles.modalActions}>
            <button type="button" onClick={onCancel} className={styles.modalBtnCancel}>Cancel</button>
            <button type="submit" className={styles.modalBtnConfirm} style={{backgroundColor: '#e67e22'}}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditImageModal = ({ product, onConfirm, onCancel }) => {
    const [newImages, setNewImages] = useState({});
    if (!product) return null;
    const handleFileChange = (index, file) => { setNewImages(prev => ({ ...prev, [index]: file })); };
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h3>Change Photo</h3>
          <form onSubmit={(e) => { e.preventDefault(); onConfirm(newImages); }}>
            <div className={styles.variantsList}>
              {product.variants.map((variant, index) => (
                <div key={index} className={styles.variantRow}>
                  <img src={variant.image} alt={variant.size + 'ml'} width="40" height="40" style={{objectFit:'cover', borderRadius:4}} />
                  <span className={styles.variantLabel}>{variant.size} ml</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(index, e.target.files[0])} style={{flex: 1}} />
                </div>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button type="button" onClick={onCancel} className={styles.modalBtnCancel}>Cancel</button>
              <button type="submit" className={styles.modalBtnConfirm} style={{backgroundColor: '#8e44ad'}}>Upload</button>
            </div>
          </form>
        </div>
      </div>
    );
};

const EditSimilarModal = ({ product, allProducts, onConfirm, onCancel }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  useEffect(() => {
    if (product && product.similarProducts) {
      const ids = product.similarProducts.map(p => (p && typeof p === 'object') ? p._id : p);
      setSelectedIds(ids);
    }
  }, [product]);
  
  if (!product) return null;
  
  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };
  
  const handleSubmit = (e) => { e.preventDefault(); onConfirm(selectedIds); };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Cross-Sell Products</h3>
        <div className={styles.similarList}>
            {allProducts
              .filter(p => p._id !== product._id)
              .map(p => (
                <div key={p._id} className={`${styles.similarItem} ${selectedIds.includes(p._id) ? styles.selected : ''}`} onClick={() => toggleSelection(p._id)}>
                  <img src={p.variants[0]?.image} alt={p.name} className={styles.miniImg}/>
                  <span>{p.name}</span>
                  {selectedIds.includes(p._id) && <span className={styles.checkMark}>✔</span>}
                </div>
            ))}
        </div>
        <div className={styles.modalActions}>
            <button onClick={onCancel} className={styles.modalBtnCancel}>Cancel</button>
            <button onClick={handleSubmit} className={styles.modalBtnConfirm} style={{backgroundColor: '#00acc1'}}>Save</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

function AdminProductsPage() {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToRestock, setProductToRestock] = useState(null);
  const [productToEditPrice, setProductToEditPrice] = useState(null);
  const [productToEditDesc, setProductToEditDesc] = useState(null);
  const [productToEditImage, setProductToEditImage] = useState(null);
  const [productToEditSimilar, setProductToEditSimilar] = useState(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = useCallback((response) => {
    if (response.status === 401 || response.status === 403) {
      showToast('Session expired. Please log in again.', 'error');
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

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
        showToast('Server data error.', 'error');
      }

    } catch (err) {
      showToast('Failed to load products', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [showToast, navigate, handleAuthError]); 

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // --- ACTIONS ---
  const toggleVisibility = async (id, currentStatus) => {
      try {
        const token = localStorage.getItem('authToken');
        await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ isHidden: !currentStatus })
        });
        fetchAllProducts();
        showToast('Visibility updated', 'success');
      } catch (e) { showToast('Error', 'error'); }
  };
  const handleConfirmDelete = async () => {
      if (!productToDelete) return;
      try {
          const token = localStorage.getItem('authToken');
          await fetch(`http://localhost:5000/api/products/${productToDelete._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          showToast('Deleted', 'success');
          fetchAllProducts();
      } catch (e) { showToast('Error', 'error'); } finally { setProductToDelete(null); }
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
          showToast('Stock replenished', 'success');
          fetchAllProducts();
      } catch (e) { showToast('Error', 'error'); } finally { setProductToRestock(null); }
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
          showToast('Prices updated', 'success');
          fetchAllProducts();
      } catch (e) { showToast('Error', 'error'); } finally { setProductToEditPrice(null); }
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
          showToast('Description updated', 'success');
          fetchAllProducts();
       } catch (e) { showToast('Error', 'error'); } finally { setProductToEditDesc(null); }
  };
  const handleConfirmImageEdit = async (newImagesMap) => {
    if (!productToEditImage) return;
    if (Object.keys(newImagesMap).length === 0) { setProductToEditImage(null); return; }
    try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        Object.keys(newImagesMap).forEach(index => { formData.append(`image-${index}`, newImagesMap[index]); });
        formData.append('variants', JSON.stringify(productToEditImage.variants));
        const response = await fetch(`http://localhost:5000/api/products/${productToEditImage._id}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (handleAuthError(response)) return;
        if (response.ok) { showToast('Photo updated!', 'success'); fetchAllProducts(); }
    } catch (err) { showToast('Error loading photo', 'error'); } finally { setProductToEditImage(null); }
  };

  const handleConfirmSimilarEdit = async (similarIds) => {
    if (!productToEditSimilar) return;
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/products/${productToEditSimilar._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ similarProducts: JSON.stringify(similarIds) })
        });
        if (handleAuthError(response)) return;
        if (response.ok) { showToast('Recommendations updated!', 'success'); fetchAllProducts(); }
    } catch (err) { showToast('Error', 'error'); } finally { setProductToEditSimilar(null); }
  };

  if (loading) return <div style={{padding: 50, textAlign: 'center'}}>Loading products...</div>;

  return (
    <div className={styles.container}>
      {/* MODALS */}
      <ConfirmDeleteModal product={productToDelete} onConfirm={handleConfirmDelete} onCancel={() => setProductToDelete(null)} />
      <RestockModal product={productToRestock} onConfirm={handleConfirmRestock} onCancel={() => setProductToRestock(null)} />
      <EditPriceModal product={productToEditPrice} onConfirm={handleConfirmPriceEdit} onCancel={() => setProductToEditPrice(null)} />
      <EditDescriptionModal product={productToEditDesc} onConfirm={handleConfirmDescriptionEdit} onCancel={() => setProductToEditDesc(null)} />
      <EditImageModal product={productToEditImage} onConfirm={handleConfirmImageEdit} onCancel={() => setProductToEditImage(null)} />
      <EditSimilarModal product={productToEditSimilar} allProducts={products} onConfirm={handleConfirmSimilarEdit} onCancel={() => setProductToEditSimilar(null)} />

      <h1 className={styles.header}>Inventory Management</h1>
      
      <div className={styles.productList}>
        {Array.isArray(products) && products.map(product => (
          <div key={product._id} className={`${styles.productItem} ${product.isHidden ? styles.hidden : ''}`}>
            <img src={product.variants[0]?.image} alt={product.name} className={styles.productImage}/>
            
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name} {product.isHidden && '(Hidden)'}</h3>
              <p className={styles.productStock}>Stock: <b style={{color: product.totalStockMl < 50 ? 'red' : 'green'}}>{product.totalStockMl} ml</b></p>
            </div>

            <div className={styles.actions}>
              <button className={`${styles.btn} ${styles.restockBtn}`} onClick={() => setProductToRestock(product)} title="Restock">+ ML</button>
              <button className={`${styles.btn} ${styles.priceBtn}`} onClick={() => setProductToEditPrice(product)} title="Edit Price">£</button>
              <button className={`${styles.btn} ${styles.descBtn}`} onClick={() => setProductToEditDesc(product)} title="Edit Description">Txt</button>
              <button className={`${styles.btn} ${styles.imgBtn}`} onClick={() => setProductToEditImage(product)} title="Change Photo">📷</button>
              <button className={`${styles.btn} ${styles.similarBtn}`} onClick={() => setProductToEditSimilar(product)} title="Cross-Sell">🔗</button>
              <button className={`${styles.btn} ${styles.toggleBtn}`} onClick={() => toggleVisibility(product._id, product.isHidden)}>{product.isHidden ? 'Show' : 'Hide'}</button>
              <button className={`${styles.btn} ${styles.deleteBtn}`} onClick={() => setProductToDelete(product)}>Delete</button>
            </div>
          </div>
        ))}
        
        {Array.isArray(products) && products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}

export default AdminProductsPage;