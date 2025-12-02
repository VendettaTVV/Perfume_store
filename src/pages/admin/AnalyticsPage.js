import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles/AnalyticsPage.module.css';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

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
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

const API_URL = 'http://localhost:5000';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = useCallback((response) => {
    if (response.status === 401 || response.status === 403) {
      showToast('Session expired. Please log in again.', 'error');
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
      showToast('Login required.', 'error');
      navigate('/auth');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/orders/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (handleAuthError(response)) return;

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      showToast('Failed to load analytics data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, navigate, handleAuthError]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className={styles.container} style={{textAlign: 'center', padding: '100px'}}>
        Loading...
      </div>
    );
  }

  if (!analyticsData || !analyticsData.summary || analyticsData.summary.totalOrders === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Reports & Analytics</h1>
        <p>No paid orders found to display data.</p>
      </div>
    );
  }

  const { summary, monthlySales, topProductsAllTime, topProductsThisMonth } = analyticsData;

  const labels = monthlySales.map(item => {
    const [year, month] = item.date.split('-');
    return `${month}/${year}`;
  });

  const revenueChartData = {
    labels,
    datasets: [{
      label: 'Total Revenue (£)',
      data: monthlySales.map(item => parseFloat(item.totalRevenue.toFixed(2))),
      borderColor: '#2980b9',
      backgroundColor: 'rgba(41, 128, 185, 0.5)',
      fill: true,
      tension: 0.3,
    }],
  };
  const ordersChartData = {
    labels,
    datasets: [{
      label: 'Total Orders',
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
        <p>No sales during this period.</p>
      ) : (
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Volume</th>
              <th>Sold (units)</th>
              <th>Total Volume (ml)</th>
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
      <h1 className={styles.header}>Reports & Analytics</h1>

      <h3 className={styles.sectionTitle}>Overall Summary</h3>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardTitle}>Net Revenue</div>
          <div className={styles.cardValue}>
            £{summary.totalRevenue.toFixed(2)}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardTitle}>Total Orders</div>
          <div className={styles.cardValue}>{summary.totalOrders}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardTitle}>Avg Order Value</div>
          <div className={styles.cardValue}>
            £{summary.avgOrderValue.toFixed(2)}
          </div>
        </div>
      </div>

      <div className={styles.tablesContainer}>
        <ProductTable title="Top Sellers (Current Month)" data={topProductsThisMonth} />
        <ProductTable title="Top Sellers (All Time)" data={topProductsAllTime} />
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.sectionTitle}>Monthly Performance</h3>
        <div className={styles.chart}><Line options={{responsive:true, maintainAspectRatio: false}} data={revenueChartData} /></div>
        <div className={styles.chart}><Bar options={{responsive:true, maintainAspectRatio: false}} data={ordersChartData} /></div>
      </div>
    </div>
  );
};

export default AnalyticsPage;