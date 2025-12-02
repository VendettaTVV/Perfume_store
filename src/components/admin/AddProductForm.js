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
  const [gender, setGender] = useState('Unisex'); 
  
  const [variants, setVariants] = useState([
    { size: '', price: '', imageFile: null } 
  ]);
  
  const [loading, setLoading] = useState(false);

  const handleVariantChange = (index, event) => {
    const newVariants = [...variants];
    if (event.target.name === 'image') {
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
      showToast('You are not authorised.', 'error');
      navigate('/auth');
      setLoading(false);
      return;
    }

    if (variants.some(v => !v.imageFile)) {
        showToast('Please upload photos for all variants.', 'error');
        setLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('baseDescription', baseDescription);
    formData.append('totalStockMl', totalStockMl);
    formData.append('gender', gender);

    const variantsData = variants.map(v => ({
        size: Number(v.size),
        price: Number(v.price)
    }));
    formData.append('variants', JSON.stringify(variantsData));

    variants.forEach((v, index) => {
        formData.append(`image-${index}`, v.imageFile);
    });

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData, 
      });

      if (response.ok) {
        showToast('Product successfully added!', 'success');
        setName('');
        setBaseDescription('');
        setTotalStockMl('');
        setGender('Unisex');
        setVariants([{ size: '', price: '', imageFile: null }]);
      } else {
        const errorData = await response.json();
        showToast(`Error: ${errorData.message}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Fragrance</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <label>Fragrance Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Gender:</label>
        <select 
          value={gender} 
          onChange={(e) => setGender(e.target.value)} 
          style={{width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px'}}
        >
          <option value="Unisex">Unisex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Base Description:</label>
        <textarea value={baseDescription} onChange={(e) => setBaseDescription(e.target.value)} required />
        
        <label>Total Stock (ml):</label>
        <input type="number" placeholder="E.g. 1000" value={totalStockMl} onChange={(e) => setTotalStockMl(e.target.value)} required />
        
        <div className={styles.separator}></div>
        
        <h3>Variants</h3>
        {variants.map((variant, index) => (
          <div key={index} className={styles.variantBox}>
            <h4>Variant #{index + 1}</h4>
            <div className={styles.variantInputs}>
              <input name="size" placeholder="Volume (ml)" value={variant.size} onChange={(e) => handleVariantChange(index, e)} type="number" required />
              <input name="price" placeholder="Price (£)" value={variant.price} onChange={(e) => handleVariantChange(index, e)} type="number" step="0.01" required />
              
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
              <button type="button" className={styles.removeBtn} onClick={() => handleRemoveVariant(index)}>Delete</button>
            )}
          </div>
        ))}
        
        <button type="button" className={styles.addBtn} onClick={handleAddVariant}>+ Variant</button>
        <div className={styles.separator}></div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Loading...' : 'Add Product'}</button>
      </form>
    </div>
  );
}

export default AddProductForm;