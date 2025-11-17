import React, { useState } from 'react';
import styles from './styles/ContactPage.module.css';
import { useToast } from '../context/ToastContext';

function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки на бэкенд в будущем
    // Пока просто имитируем успешную отправку
    showToast('Ваше сообщение отправлено! Мы свяжемся с вами.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <h1 className={styles.title}>СВЯЖИТЕСЬ С НАМИ</h1>
        <p className={styles.subtitle}>Мы всегда рады ответить на ваши вопросы</p>
      </div>

      <div className={styles.contentWrapper}>
        {/* Левая колонка: Информация */}
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>Посетите Нас</h3>
            <p>ул. Парфюмерная, 12<br />Париж, Франция, 75001</p>
          </div>
          
          <div className={styles.infoBlock}>
            <h3>Контакты</h3>
            <p>Email: hello@aromaticus.com</p>
            <p>Тел: +33 1 23 45 67 89</p>
          </div>

          <div className={styles.infoBlock}>
            <h3>Часы Работы</h3>
            <p>Пн - Пт: 10:00 - 20:00</p>
            <p>Сб - Вс: 11:00 - 18:00</p>
          </div>
        </div>

        {/* Правая колонка: Форма */}
        <div className={styles.formColumn}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                name="name" 
                placeholder="Ваше Имя" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="text" 
                name="subject" 
                placeholder="Тема сообщения" 
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <textarea 
                name="message" 
                placeholder="Ваше сообщение..." 
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required 
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              ОТПРАВИТЬ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;