import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокручиваем в самый верх (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // Срабатывает при каждом изменении пути

  return null; // Этот компонент ничего не рендерит визуально
}

export default ScrollToTop;