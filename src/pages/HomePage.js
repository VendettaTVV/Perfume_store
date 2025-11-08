// src/pages/HomePage.js
import React from 'react';
import HeroSection from '../components/HeroSection';
import SignatureScents from '../components/SignatureScents';


// Заглушка данных для товаров
const mockProducts = [
  { id: 1, name: 'NOCTURE', description: 'Ceramic for-flam.', price: 16.50, image: '/images/images.jpeg', bgColor: '#D4CFCB' },
  { id: 2, name: 'LUMIÈRE ÉTERNELLE', description: 'Eastment. Fusion', price: 22.00, image: '/images/shopping (1).webp', bgColor: '#D4CFCB' },
  { id: 3, name: 'LUMIÈRE ÉTERNELLE', description: 'Doritompoza Forte', price: 33.00, image: '/images/shopping.webp', bgColor: '#D4CFCB' },
  { id: 4, name: 'SUNHINE SCENTS', description: 'Unberromom Tiermad', price: 55.00, image: '/images/shopping (2).webp', bgColor: '#D4CFCB' },
];

function HomePage() {
  return (
    <>
      <HeroSection />
      <SignatureScents products={mockProducts} />
    </>
  );
}

export default HomePage;