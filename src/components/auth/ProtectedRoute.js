import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Этот компонент-обертка ("охранник") решает, можно ли 
 * пользователю посетить страницу.
 * * @param {object} props
 * @param {React.ReactNode} props.children - Компонент, который мы защищаем (напр. <AddProductForm />)
 * @param {boolean} [props.adminOnly=false] - Нужно ли требовать права админа для этого роута
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  
  // 1. Получаем данные о пользователе из localStorage
  const token = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Сравниваем со строкой 'true'

  // 2. ПЕРВАЯ ПРОВЕРКА: Есть ли токен?
  // Если токена нет, пользователь не вошел в систему.
  if (!token) {
    // Отправляем на страницу входа
    return <Navigate to="/auth" replace />;
  }

  // 3. ВТОРАЯ ПРОВЕРКА: Нужны ли права админа?
  // Если этот роут требует админа (adminOnly === true), 
  // а пользователь НЕ админ (isAdmin === false)...
  if (adminOnly && !isAdmin) {
    // ...отправляем его на главную страницу, ему сюда нельзя.
    return <Navigate to="/" replace />;
  }

  // 4. УСПЕХ:
  // Если токен есть, И (если нужно) права админа тоже есть,
  // то показываем дочерний компонент (например, админ-панель).
  return children;
};

export default ProtectedRoute;