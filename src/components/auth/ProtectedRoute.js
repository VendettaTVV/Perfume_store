// src/components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Этот компонент-обертка проверяет, есть ли токен аутентификации в localStorage.
 * Если токена нет, он перенаправляет пользователя на страницу входа (/auth).
 * Если токен есть, он отображает дочерние компоненты (children), 
 * которые ему переданы (например, страницу админки).
 */
const ProtectedRoute = ({ children }) => {
  // 1. Проверяем, есть ли токен в хранилище
  const token = localStorage.getItem('authToken');

  if (!token) {
    // 2. Если токена нет - отправляем на страницу входа
    // 'replace' означает, что мы заменяем текущую историю, 
    // чтобы пользователь не мог нажать "назад" и вернуться в админку
    return <Navigate to="/auth" replace />;
  }

  // 3. Если токен есть - отображаем защищенный контент (например, <AddProductForm />)
  return children;
};

export default ProtectedRoute;