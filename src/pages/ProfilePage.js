import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import styles from './styles/ProfilePage.module.css';

function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('orders'); 

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    showToast('Session expired. Please log in again.', 'error');
    navigate('/auth');
  }, [navigate, showToast]);

  const onLogoutClick = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    showToast('You have been logged out', 'success');
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch Orders
        const ordersResponse = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (ordersResponse.status === 401 || ordersResponse.status === 403) {
          handleLogout();
          return;
        }
        
        // 2. Fetch Wishlist
        const wishlistResponse = await fetch('http://localhost:5000/api/user/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (ordersResponse.ok && wishlistResponse.ok) {
           const ordersData = await ordersResponse.json();
           const wishlistData = await wishlistResponse.json();
           setOrders(ordersData);
           setWishlist(wishlistData);
        } else {
           throw new Error('Error loading profile data');
        }

      } catch (err) {
        console.error(err);
        if (localStorage.getItem('authToken')) {
            showToast('Failed to load profile data', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, showToast, handleLogout]);

  if (loading) return <div className={styles.loading}>Loading Profile...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Account</h1>
        <button onClick={onLogoutClick} className={styles.logoutBtn}>
          Log Out
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          My Orders ({orders.length})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'wishlist' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          My Wishlist ({wishlist.length})
        </button>
      </div>

      {/* --- ORDERS SECTION --- */}
      {activeTab === 'orders' && (
        <div className={styles.section}>
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You currently have no orders.</p>
              <Link to="/" className={styles.shopLink}>Go to Shop</Link>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map(order => (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <span className={styles.orderId}>Order #ID: {order._id.slice(-6)}</span>
                      <span className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <div className={styles.orderStatus}>
                      Status: <b>{order.status}</b>
                    </div>
                  </div>

                  <div className={styles.orderBody}>
                    {order.orderItems.map((item, index) => (
                      <div key={index} className={styles.orderItem}>
                        <img src={item.image} alt={item.name} />
                        <div className={styles.itemDetails}>
                          <p className={styles.itemName}>{item.name}</p>
                          <p className={styles.itemInfo}>{item.size} ml x {item.quantity}</p>
                        </div>
                        <div className={styles.itemPrice}>
                          £{item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.totalPrice}>
                      Total Paid: £{order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- WISHLIST SECTION --- */}
      {activeTab === 'wishlist' && (
        <div className={styles.section}>
          {wishlist.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Your wishlist is empty.</p>
              <Link to="/" className={styles.shopLink}>Discover Scents</Link>
            </div>
          ) : (
            <div className={styles.wishlistGrid}>
              {wishlist.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default ProfilePage;