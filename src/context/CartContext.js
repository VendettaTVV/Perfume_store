// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// --- 1. Функция для ЗАГРУЗКИ корзины из localStorage ---
// Мы выносим ее за пределы компонента
const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('perfumeCart');
    // Если корзина есть, парсим ее. Если нет - возвращаем пустой массив.
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Не удалось загрузить корзину из localStorage", error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  // --- 2. Инициализируем стейт С ПОМОЩЬЮ ФУНКЦИИ ---
  // Этот код выполнится только один раз при запуске
  const [cartItems, setCartItems] = useState(getInitialCart);

  // --- 3. useEffect для СОХРАНЕНИЯ корзины ---
  // Этот код будет срабатывать КАЖДЫЙ РАЗ, когда cartItems меняется
  useEffect(() => {
    try {
      localStorage.setItem('perfumeCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Не удалось сохранить корзину в localStorage", error);
    }
  }, [cartItems]); // Зависимость - cartItems

  // --- (Остальная логика не изменилась) ---

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cartItemId === product.cartItemId);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.cartItemId === product.cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart,
      total,
      totalQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};