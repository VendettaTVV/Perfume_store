import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import styles from './styles/CheckoutPage.module.css';

function CheckoutPage() {
  const { cartItems, total } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [shippingCost, setShippingCost] = useState(null); 

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [shippingInfo, setShippingInfo] = useState({
    name: '', email: '', addressLine1: '', addressLine2: '', city: '', postcode: '', country: 'United Kingdom'
  });

  const discountAmount = appliedCoupon ? (total * appliedCoupon.percent / 100) : 0;
  const totalAfterDiscount = total - discountAmount;

  const calculateShipping = useCallback(async (postcode) => {
    if (!postcode || postcode.length < 2) { 
        setShippingCost(null);
        return; 
    }
    setIsCalculating(true);
    try {
        const response = await fetch('http://localhost:5000/api/checkout/calculate-shipping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                postcode, 
                method: 'standard',
                cartTotal: totalAfterDiscount
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setShippingCost(data.price);
        } else { 
            setShippingCost(5.00); // Fallback
        }
    } catch (error) { 
        setShippingCost(5.00); // Fallback
    } finally { 
        setIsCalculating(false); 
    }
  }, [totalAfterDiscount]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        calculateShipping(shippingInfo.postcode);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [shippingInfo.postcode, calculateShipping]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const response = await fetch('http://localhost:5000/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await response.json();
      
      if (response.ok && data.isValid) {
        setAppliedCoupon({ code: data.code, percent: data.discountPercent });
        showToast(`Coupon ${data.code} applied!`, 'success');
      } else {
        setAppliedCoupon(null);
        showToast(data.message || 'Invalid coupon code', 'error');
      }
    } catch (err) {
      showToast('Error validating coupon', 'error');
    }
  };

  const displayShipping = shippingCost === null ? 0 : shippingCost;
  const finalTotal = totalAfterDiscount + displayShipping;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (shippingCost === null && shippingInfo.postcode.length >= 2) {
      showToast("Please wait for shipping costs to be calculated.", 'error');
      setLoading(false); 
      return;
    }
    
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch('http://localhost:5000/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cartItems, 
          shippingInfo, 
          shippingMethod: 'standard',
          userId,
          couponCode: appliedCoupon ? appliedCoupon.code : null
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server Error');
      }
      
      const session = await response.json();
      if (session.url) {
          window.location.href = session.url;
      } else {
          throw new Error('Failed to retrieve payment link');
      }

    } catch (error) {
      console.error(error);
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return <div className={styles.container}><h2>Your basket is empty</h2></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>
      
      <div className={styles.formColumn}>
        <form id="checkout-form" onSubmit={handlePayment} className={styles.form}>
            <h2>Delivery Address (United Kingdom)</h2>
            <div className={styles.inputGroup}>
             <label>Full Name</label><input type="text" name="name" value={shippingInfo.name} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
             <label>Email</label><input type="email" name="email" value={shippingInfo.email} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
             <label>Address Line 1</label><input type="text" name="addressLine1" value={shippingInfo.addressLine1} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
             <label>Address Line 2 (Optional)</label><input type="text" name="addressLine2" value={shippingInfo.addressLine2} onChange={handleChange} />
            </div>
            <div className={styles.row}>
             <div className={styles.inputGroup}>
               <label>City / Town</label><input type="text" name="city" value={shippingInfo.city} onChange={handleChange} required />
             </div>
             <div className={styles.inputGroup}>
               <label>Postcode</label><input type="text" name="postcode" value={shippingInfo.postcode} onChange={handleChange} required placeholder="e.g. CT6 8AP"/>
             </div>
            </div>
        </form>
      </div>

      <div className={styles.summaryColumn}>
        <h2>Your Order Summary</h2>
        <div className={styles.summaryItems}>
          {cartItems.map(item => (
            <div key={item.cartItemId} className={styles.summaryItem}>
              <span>{item.name} ({item.size}ml) x {item.quantity}</span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.couponSection}>
          <label className={styles.couponLabel}>Promo Code</label>
          <div className={styles.couponForm}>
            <input 
              type="text" 
              placeholder="Enter code" 
              value={couponCode} 
              onChange={(e) => setCouponCode(e.target.value)} 
              className={styles.couponInput} 
              disabled={!!appliedCoupon} 
            />
            {appliedCoupon ? (
              <button 
                type="button" 
                onClick={() => {setAppliedCoupon(null); setCouponCode('');}} 
                className={styles.couponRemoveBtn}
              >
                ✕
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleApplyCoupon} 
                className={styles.couponBtn}
              >
                Apply
              </button>
            )}
          </div>
          {appliedCoupon && <p className={styles.couponSuccess}>✓ {appliedCoupon.percent}% Discount Applied</p>}
        </div>
        
        <div className={styles.totalsSection}>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span><span>£{total.toFixed(2)}</span>
          </div>
          {appliedCoupon && (
            <div className={`${styles.summaryRow} ${styles.discountRow}`}>
              <span>Discount ({appliedCoupon.percent}%):</span><span>-£{discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div className={styles.summaryRow}>
            <span>Delivery:</span>
            <span>
              {isCalculating 
                ? '...' 
                : shippingCost === null 
                  ? '—' // Not yet calculated
                  : shippingCost === 0 
                    ? <span style={{color: '#27ae60', fontWeight: 'bold'}}>FREE</span> 
                    : `£${shippingCost.toFixed(2)}`
              }
            </span>
          </div>
          
          <div className={styles.summaryTotal}>
            <span>Order Total:</span><span>£{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button 
          type="submit" 
          form="checkout-form" 
          className={styles.payButton}
          disabled={loading || isCalculating || shippingCost === null}
        >
          {loading ? 'Processing...' : 'PAY FOR ORDER'}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;