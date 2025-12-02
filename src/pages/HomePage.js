import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; 
import HeroSection from '../components/HeroSection';
import SignatureScents from '../components/SignatureScents';
import styles from './styles/HomePage.module.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';

  const [genderFilter, setGenderFilter] = useState('All'); 
  const [sortOption, setSortOption] = useState('newest'); 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (genderFilter !== 'All') params.append('gender', genderFilter);
      if (sortOption !== 'newest') params.append('sort', sortOption);

      const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      
      if (!response.ok) {
        setProducts([]);
        return;
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        const filteredData = data.filter(p => p.name !== 'Discovery Set');
        setProducts(filteredData);
      } else {
        setProducts([]);
      }

    } catch (err) {
      console.error("Network Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [keyword, genderFilter, sortOption]); 

  return (
    <>
      {!keyword && <HeroSection />}
      
      <div className={styles.container}>
        <div className={styles.filterBar}>
            <div className={styles.genderTabs}>
                <button 
                    className={`${styles.genderBtn} ${genderFilter === 'All' ? styles.active : ''}`}
                    onClick={() => setGenderFilter('All')}
                >
                    All
                </button>
                <button 
                    className={`${styles.genderBtn} ${genderFilter === 'Female' ? styles.active : ''}`}
                    onClick={() => setGenderFilter('Female')}
                >
                    For Her
                </button>
                <button 
                    className={`${styles.genderBtn} ${genderFilter === 'Male' ? styles.active : ''}`}
                    onClick={() => setGenderFilter('Male')}
                >
                    For Him
                </button>
                <button 
                    className={`${styles.genderBtn} ${genderFilter === 'Unisex' ? styles.active : ''}`}
                    onClick={() => setGenderFilter('Unisex')}
                >
                    Unisex
                </button>
            </div>
            <div className={styles.sortWrapper}>
                <select 
                    className={styles.sortSelect}
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="newest">New Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>
        </div>

        {!keyword && (
          <div className={styles.discoveryBanner}>
            <h2 className={styles.discoveryTitle}>Create Your Bespoke Set</h2>
            <p className={styles.discoveryText}>
              Select 5 scents that inspire you and build a personalised collection of miniatures.
            </p>
            <Link to="/discovery-set" className={styles.discoveryBtn}>
              BUILD YOUR SET
            </Link>
          </div>
        )}

        {keyword && (
           <h2 className={styles.searchTitle}>Search Results for: "{keyword}"</h2>
        )}

        {loading ? (
           <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>Loading...</div>
        ) : products.length > 0 ? (
           <SignatureScents products={products} />
        ) : (
           <div style={{ textAlign: 'center', padding: '50px', color: '#777' }}>
             No products found.
           </div>
        )}
      </div>
    </>
  );
}

export default HomePage;