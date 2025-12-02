import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import styles from './styles/DiscoverySetPage.module.css';

function DiscoverySetPage() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [allProducts, setAllProducts] = useState([]);
  const [baseSetProduct, setBaseSetProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selections, setSelections] = useState([
    '', '', '', '', ''
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        
        const setProduct = data.find(p => p.name === 'Discovery Set');
        const availableScents = data.filter(p => p.name !== 'Discovery Set' && !p.isHidden);

        if (setProduct) {
          setBaseSetProduct(setProduct);
        }
        setAllProducts(availableScents);
        
      } catch (error) {
        console.error(error);
        showToast('Error loading product data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const handleSelectChange = (index, value) => {
    const newSelections = [...selections];
    newSelections[index] = value;
    setSelections(newSelections);
  };

  const handleAddToCart = () => {
    if (!baseSetProduct) {
        showToast('The "Discovery Set" product was not found in the database!', 'error');
        return;
    }

    if (selections.some(s => s === '')) {
      showToast('Please select all 5 scents.', 'error');
      return;
    }

    const scentsList = selections.join(', ');
    const customName = `Discovery Set (${scentsList})`;
    
    const variant = baseSetProduct.variants[0];

    if (!variant) {
        showToast('The Discovery Set product has no price variants.', 'error');
        return;
    }

    const itemToAdd = {
      cartItemId: `${baseSetProduct._id}-${Date.now()}`, 
      id: baseSetProduct._id,
      name: customName, 
      size: variant.size, 
      price: variant.price,
      image: variant.image,
      quantity: 1
    };

    addToCart(itemToAdd);
    showToast('Discovery Set added to your basket!', 'success');
  };

  if (loading) return <div className={styles.centeredMessage}>Loading...</div>;

  if (!baseSetProduct) return (
    <div className={styles.centeredMessage}>
      <h2>"Discovery Set" product not found.</h2>
      <p>Please create a product named **Discovery Set** in your admin panel.</p>
    </div>
  );

  return (
    <div className={styles.pageContent}>
      <div className={styles.mainContent}>
        <div className={styles.imageContainer}>
          <img 
            src={baseSetProduct.variants[0]?.image || 'https://via.placeholder.com/400'} 
            alt="Discovery Set" 
            className={styles.productImage}
          />
        </div>
        
        <h1 className={styles.title}>CREATE YOUR SAMPLE SET</h1>
        
        <div className={styles.price}>
            £{baseSetProduct.variants[0]?.price.toFixed(2)}
        </div>

        <p className={styles.subtitle}>
          Select 5 scents (2ml each) to explore our collection.
        </p>
        
        <div className={styles.selectors}>
          {selections.map((sel, index) => (
            <div key={index} className={styles.selectGroup}>
              <label htmlFor={`scent-select-${index}`} className={styles.selectLabel}>
                Scent #{index + 1}
              </label>
              <select 
                id={`scent-select-${index}`}
                value={sel} 
                onChange={(e) => handleSelectChange(index, e.target.value)}
                className={styles.select}
              >
                <option value="">-- Select a scent --</option>
                {allProducts.map(p => (
                  <option key={p._id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button 
          className={styles.addBtn} 
          onClick={handleAddToCart}
          disabled={selections.some(s => s === '')}
        >
          Add Set to Basket
        </button>
      </div>
    </div>
  );
}

export default DiscoverySetPage;