import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

function SuccessPage() {
  const { clearCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    clearCart();
    showToast('Order successfully paid!', 'success');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Times New Roman, serif' }}>
      <h1 style={{ color: '#27ae60', fontSize: '2.5em' }}>Payment Successful! 🎉</h1>
      <p style={{ fontSize: '1.2em', color: '#333' }}>
        Thank you for your order. We will be in touch shortly regarding delivery.
      </p>
      <Link 
        to="/" 
        style={{ 
          textDecoration: 'none', 
          color: '#fff', 
          backgroundColor: '#333', 
          padding: '10px 20px',
          marginTop: '20px',
          display: 'inline-block',
          fontSize: '1em',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default SuccessPage;