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
    // Future backend submission logic goes here
    showToast('Your message has been sent! We will be in touch shortly.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <h1 className={styles.title}>GET IN TOUCH</h1>
        <p className={styles.subtitle}>We are always happy to answer your questions</p>
      </div>

      <div className={styles.contentWrapper}>
        {/* Left Column: Information */}
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>Visit Us</h3>
            <p>12 Perfume Lane<br />London, United Kingdom, SW1A 0AA</p>
          </div>
          
          <div className={styles.infoBlock}>
            <h3>Contact Details</h3>
            <p>Email: hello@aromaticus.com</p>
            <p>Tel: +44 20 7946 0123</p>
          </div>

          <div className={styles.infoBlock}>
            <h3>Opening Hours</h3>
            <p>Mon - Fri: 10:00 - 20:00</p>
            <p>Sat - Sun: 11:00 - 18:00</p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className={styles.formColumn}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="text" 
                name="subject" 
                placeholder="Subject" 
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <textarea 
                name="message" 
                placeholder="Your message..." 
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required 
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;