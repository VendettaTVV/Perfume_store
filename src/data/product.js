// src/data/products.js

export const mockProducts = [
  { 
    id: 1, 
    name: 'NOCTURE',
    baseDescription: 'Глубокий древесный аромат для ценителей.',
    bgColor: '#D4CFCB',
    variants: [
      // ❗ Указываем просто путь строкой. Убедитесь, что названия файлов совпадают!
      { size: 5, price: 16.50, image: '/images/images.jpeg' },
      { size: 10, price: 30.00, image: '/images/shopping (1).webp' },
      { size: 15, price: 42.00, image: '/images/shopping (2).webp' },
    ]
  },
  { 
    id: 2, 
    name: 'LUMIÈRE ÉTERNELLE', 
    baseDescription: 'Яркий цветочный аромат, который держится весь день.',
    bgColor: '#D4CFCB',
    variants: [
      { size: 5, price: 22.00, image: '/images/shopping (1).webp' },
      { size: 10, price: 40.00, image: '/images/shopping (2).webp' },
    ]
  },
  { 
    id: 3, 
    name: 'LUMIÈRE ÉTERNELLE', 
    baseDescription: 'Яркий цветочный аромат, который держится весь день.',
    bgColor: '#D4CFCB',
    variants: [
      { size: 5, price: 22.00, image: '/images/shopping (2).webp' },
      { size: 10, price: 40.00, image: '/images/shopping (1).webp' },
    ]
  },
  { 
    id: 4, 
    name: 'LUMIÈRE ÉTERNELLE', 
    baseDescription: 'Яркий цветочный аромат, который держится весь день.',
    bgColor: '#D4CFCB',
    variants: [
      { size: 5, price: 22.00, image: '/images/shopping (3).webp' },
      { size: 10, price: 40.00, image: '/images/shopping (2).webp' },
    ]
  },
  
];