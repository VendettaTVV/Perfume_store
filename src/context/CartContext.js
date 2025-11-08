// src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Функция добавления товара
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Если товар уже в корзине, увеличиваем количество
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Иначе добавляем новый товар
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Функция удаления товара
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Общая стоимость
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Общее количество товаров
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