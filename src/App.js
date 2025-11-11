// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Страницы магазина
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import RegisterLoginPage from './pages/RegisterLoginPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

// Страницы админки
import AddProductForm from './components/admin/AddProductForm'; 
import ProtectedRoute from './components/auth/ProtectedRoute'; // 👈 1. Импортируем "Охранника"

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* --- Публичные Роуты --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth" element={<RegisterLoginPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          
          {/* --- Защищенный Роут Админки --- */}
          <Route 
            path="/admin" 
            element={
              // 👈 2. Оборачиваем
              <ProtectedRoute>
                <AddProductForm />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<h1 style={{ textAlign: 'center', padding: '100px' }}>404: Страница не найдена</h1>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;