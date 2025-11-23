import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

// Импорты компонентов
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop'; // 👈 1. ИМПОРТИРУЕМ НОВЫЙ КОМПОНЕНТ

// Импорты Публичных Страниц
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import RegisterLoginPage from './pages/RegisterLoginPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SuccessPage from './pages/SuccessPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';

// Импорты Админ-Страниц
import AddProductForm from './components/admin/AddProductForm';
import AdminManagePage from './pages/AdminManagePage'; 
import AdminProductsPage from './pages/AdminProductsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            {/* ❗️ 2. ПОДКЛЮЧЕНИЕ ШРИФТА (Playfair Display) */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
            
            {/* ❗️ 3. ВСТАВЛЯЕМ ScrollToTop ЗДЕСЬ (Внутри Router, но перед контентом) */}
            <ScrollToTop />
            
            <Header />
            <main>
              <Routes>
                {/* --- ПУБЛИЧНЫЕ РОУТЫ --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/auth" element={<RegisterLoginPage />} />
                <Route path="/product/:productId" element={<ProductDetailsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/success" element={<SuccessPage />} /> 
                <Route path="/checkout" element={<CheckoutPage />} />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                {/* --- АДМИН РОУТЫ --- */}
                <Route path="/admin/add" element={
                  <ProtectedRoute adminOnly={true}><AddProductForm /></ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute adminOnly={true}><AdminManagePage /></ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedRoute adminOnly={true}><AdminProductsPage /></ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <ProtectedRoute adminOnly={true}><AnalyticsPage /></ProtectedRoute>
                } />
                
                <Route path="*" element={<h1 style={{ textAlign: 'center', padding: '50px' }}>404</h1>} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;