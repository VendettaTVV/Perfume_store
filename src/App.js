// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Страницы магазина
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import RegisterLoginPage from './pages/RegisterLoginPage';

// Страницы админки
import AddProductForm from './components/admin/AddProductForm'; // Используем форму как страницу

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* Магазин */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth" element={<RegisterLoginPage />} />
          
          {/* Админ-панель (Для простоты пока не защищаем, но нужно!) */}
          <Route path="/admin" element={<AddProductForm />} />
          
          <Route path="*" element={<h1 style={{ textAlign: 'center', padding: '100px' }}>404: Страница не найдена</h1>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;