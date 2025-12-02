import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import styles from './styles/ProductDetailsPage.module.css';

// Auxiliary Rating Component
const Rating = ({ value, text }) => {
  return (
    <div className={styles.rating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= value ? '#333' : '#ccc' }}>
          ★
        </span>
      ))}
      {text && <span className={styles.ratingText}>{text}</span>}
    </div>
  );
};

function ProductDetailsPage() {
  const { productId } = useParams();
  const { cartItems, addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        
        if (!response.ok) {
           throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line
  }, [productId]);

  useEffect(() => {
    if (product) {
      if (!selectedVariant || product.variants.some(v => v.size !== selectedVariant.size)) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product, selectedVariant]);

  // --- BASKET LOGIC ---
  const getStockInCart = (id) => {
    return cartItems
      .filter(item => item.id === id)
      .reduce((totalMl, item) => totalMl + (item.size * item.quantity), 0);
  };
  
  const isVariantOutOfStock = (variant) => {
    if (!product) return true;
    const stockInCart = getStockInCart(product._id);
    return product.totalStockMl < (stockInCart + variant.size);
  };
  
  const isOutOfStock = selectedVariant ? isVariantOutOfStock(selectedVariant) : true;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    if (isOutOfStock) {
      showToast('Sorry, this volume is out of stock', 'error');
      return;
    }
    const cartItemId = `${product._id}-${selectedVariant.size}ml`;
    const itemToAdd = {
      cartItemId,
      id: product._id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: selectedVariant.image
    };
    addToCart(itemToAdd);
    showToast(`${product.name} (${selectedVariant.size}ml) added to basket!`);
  };


  // --- REVIEWS LOGIC ---
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
        showToast('Please log in to submit a review', 'error');
        return;
    }

    setReviewLoading(true);
    try {
        const response = await fetch(`http://localhost:5000/api/products/${product._id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rating, comment })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Review submitted successfully!', 'success');
            setRating(5);
            setComment('');
            fetchProductDetails(); 
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Error submitting review', 'error');
    } finally {
        setReviewLoading(false);
    }
  };


  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;
  if (!product || !selectedVariant) return <div style={{ textAlign: 'center', padding: '100px' }}>Product not found</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.imageGallery}>
          <img src={selectedVariant.image} alt={product.name} />
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{product.name}</h1>
          
          <div style={{marginBottom: '20px'}}>
             <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </div>

          <p className={styles.description}>{product.baseDescription}</p>
          <div className={styles.separator}></div>
          
          <label className={styles.label}>Select Volume:</label>
          <div className={styles.variantSelector}>
            {product.variants.map((variant) => (
              <button
                key={variant.size}
                className={`${styles.variantButton} ${variant.size === selectedVariant.size ? styles.active : ''}`}
                disabled={isVariantOutOfStock(variant)}
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.size} ml
              </button>
            ))}
          </div>

          {isOutOfStock && <p className={styles.stockError}>Out of Stock</p>}
          <div className={styles.price}>£{selectedVariant.price.toFixed(2)}</div>

          <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={isOutOfStock}>
            Add to Basket
          </button>
          
          {/* TRUST BADGES BLOCK */}
          <div className={styles.trustBadges}>
              <div className={styles.badge}>
               <span className={styles.badgeIcon}>💎</span>
               <div className={styles.badgeText}>
                 <span className={styles.badgeTitle}>100% Authentic</span>
                 <span className={styles.badgeSubtitle}>Authenticity guaranteed</span>
               </div>
              </div>
              <div className={styles.badge}>
               <span className={styles.badgeIcon}>✨</span>
               <div className={styles.badgeText}>
                 <span className={styles.badgeTitle}>Hand Decanted</span>
                 <span className={styles.badgeSubtitle}>Made with care</span>
               </div>
              </div>
          </div>

        </div>
      </div>

      {/* SIMILAR PRODUCTS SECTION */}
      {product.similarProducts && product.similarProducts.length > 0 && (
        <div className={styles.similarSection}>
          <h2 className={styles.sectionTitle}>You Might Also Like</h2>
          <div className={styles.similarGrid}>
            {product.similarProducts.map(simProduct => (
              typeof simProduct === 'object' ? (
                  <div key={simProduct._id} style={{width: 250}}>
                    <ProductCard product={simProduct} />
                  </div>
              ) : null
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS SECTION */}
      <div className={styles.reviewsContainer}>
        <h2>Reviews ({product.numReviews})</h2>
        
        <div className={styles.reviewsContent}>
            <div className={styles.reviewList}>
                {product.reviews.length === 0 && <p style={{fontStyle: 'italic', color: '#777'}}>No reviews yet. Be the first!</p>}
                {product.reviews.map((review, index) => (
                    <div key={review._id || index} className={styles.reviewItem}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <strong>{review.name}</strong>
                          <Rating value={review.rating} />
                        </div>
                        <p className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString('en-GB')}</p>
                        <p style={{marginTop: '10px', lineHeight: '1.5'}}>{review.comment}</p>
                    </div>
                ))}
            </div>

            <div className={styles.reviewForm}>
                <h3>Write a Review</h3>
                {localStorage.getItem('authToken') ? (
                    <form onSubmit={submitReviewHandler}>
                        <div className={styles.formGroup}>
                            <label>Rating</label>
                            <select value={rating} onChange={(e) => setRating(e.target.value)}>
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Good</option>
                                <option value="3">3 - Average</option>
                                <option value="2">2 - Poor</option>
                                <option value="1">1 - Terrible</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Comment</label>
                            <textarea 
                                rows="4" 
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)}
                                required
                                placeholder="Share your thoughts..."
                            ></textarea>
                        </div>
                        <button type="submit" className={styles.submitReviewBtn} disabled={reviewLoading}>
                            {reviewLoading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                ) : (
                    <div style={{padding: '20px', background: '#f9f9f9', borderRadius: '4px'}}>
                        Please <Link to="/auth" style={{textDecoration: 'underline', fontWeight: 'bold', color: '#333'}}>log in</Link> to submit a review.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;