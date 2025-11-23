import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles/AnalyticsPage.module.css';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

// Импорты для графиков
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler, // 👈 1. ИМПОРТИРУЕМ FILLER
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler // 👈 2. РЕГИСТРИРУЕМ FILLER
);

const API_URL = 'http://localhost:5000';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = useCallback((response) => {
    if (response.status === 401 || response.status === 403) {
      showToast('Сессия истекла. Войдите заново.', 'error');
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAdmin');
      navigate('/auth');
      return true;
    }
    return false;
  }, [showToast, navigate]);

  const fetchAnalytics = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      showToast('Необходимо войти.', 'error');
      navigate('/auth');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/orders/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (handleAuthError(response)) return;
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Ошибка при получении аналитики:', err);
      showToast('Не удалось загрузить данные аналитики.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, navigate, handleAuthError]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return <div className={styles.container} style={{textAlign: 'center', padding: '100px'}}>Загрузка...</div>;

  if (!analyticsData || !analyticsData.summary) {
    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Отчеты и Аналитика</h1>
        <p>Нет доступных данных. Оплаченных заказов не найдено.</p>
      </div>
    );
  }

  const { summary, monthlySales, topProductsAllTime, topProductsThisMonth } = analyticsData;

  // Графики
  const labels = monthlySales.map(item => item.date);
  const revenueChartData = {
    labels,
    datasets: [{
      label: 'Общая Выручка (£)',
      data: monthlySales.map(item => parseFloat(item.totalRevenue.toFixed(2))),
      borderColor: '#2980b9',
      backgroundColor: 'rgba(41, 128, 185, 0.5)',
      fill: true, // Теперь это будет работать без ошибки
      tension: 0.3,
    }],
  };
  const ordersChartData = {
    labels,
    datasets: [{
      label: 'Количество Заказов',
      data: monthlySales.map(item => item.totalOrders),
      backgroundColor: '#8e44ad',
      borderColor: '#8e44ad',
      borderWidth: 1,
    }],
  };

  const ProductTable = ({ title, data }) => (
    <div className={styles.tableSection}>
      <h3>{title}</h3>
      {(!data || data.length === 0) ? (
        <p>Нет продаж за этот период.</p>
      ) : (
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Товар</th>
              <th>Объем</th>
              <th>Продано (шт)</th>
              <th>Общий объем (мл)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item._id.name}</td>
                <td>{item._id.size} ml</td>
                <td><strong>{item.totalSold}</strong></td>
                <td>{item.totalMlSold} ml</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Отчеты и Аналитика</h1>

      <h3 className={styles.sectionTitle}>Общая Сводка</h3>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardTitle}>Чистая Выручка</div>
          <div className={styles.cardValue}>£{summary.totalRevenue.toFixed(2)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardTitle}>Всего Заказов</div>
          <div className={styles.cardValue}>{summary.totalOrders}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardTitle}>Средний Чек</div>
          <div className={styles.cardValue}>£{summary.avgOrderValue.toFixed(2)}</div>
        </div>
      </div>

      <div className={styles.tablesContainer}>
        <ProductTable title="Топ продаж (Текущий месяц)" data={topProductsThisMonth} />
        <ProductTable title="Топ продаж (За все время)" data={topProductsAllTime} />
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.sectionTitle}>Ежемесячная Динамика</h3>
        <div className={styles.chart}><Line options={{responsive:true, maintainAspectRatio: false}} data={revenueChartData} /></div>
        <div className={styles.chart}><Bar options={{responsive:true, maintainAspectRatio: false}} data={ordersChartData} /></div>
      </div>
    </div>
  );
};

export default AnalyticsPage;