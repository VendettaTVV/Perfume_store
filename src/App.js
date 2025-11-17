import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Импорты компонентов
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Наш "охранник"

// Импорты Публичных Страниц
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import RegisterLoginPage from './pages/RegisterLoginPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
// import SuccessPage from './pages/SuccessPage'; // (Оставьте закомментированным, если еще не создали)

// Импорты Админ-Страниц
import AddProductForm from './components/admin/AddProductForm';
import AdminManagePage from './pages/AdminManagePage';

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
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
              {/* <Route path="/success" element={<SuccessPage />} /> */}
              
              {/* --- ЗАЩИЩЕННЫЕ РОУТЫ (Только для Админа) --- */}
              {/* Здесь мы говорим: "Пускать на этот роут, только если
                пользователь вошел (токен есть) И он админ (adminOnly=true)"
              */}
              <Route path="/admin/add" element={
                <ProtectedRoute adminOnly={true}>
                  <AddProductForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/manage" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminManagePage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<h1 style={{ textAlign: 'center', padding: '50px' }}>404 - Страница не найдена</h1>} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;