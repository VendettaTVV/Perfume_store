import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// --- 1. Функция для ЗАГРУЗКИ корзины из localStorage ---
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
  const [cartItems, setCartItems] = useState(getInitialCart);

  // --- 3. useEffect для СОХРАНЕНИЯ корзины ---
  useEffect(() => {
    try {
      localStorage.setItem('perfumeCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Не удалось сохранить корзину в localStorage", error);
    }
  }, [cartItems]); // Зависимость - cartItems

  // --- 4. Функции управления корзиной ---

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

  // ❗️ 👇 НОВАЯ ФУНКЦИЯ ОЧИСТКИ КОРЗИНЫ
  const clearCart = () => {
    setCartItems([]);
  };

  // --- 5. Подсчеты ---

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- 6. Провайдер ---

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart,
      clearCart, // ❗️ 👈 ДОБАВИЛИ clearCart В КОНТЕКСТ
      total,
      totalQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};