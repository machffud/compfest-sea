import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './AdminDashboard.css';
import AdminTestimonials from './AdminTestimonials';
import AdminUsers from './AdminUsers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchAllSubscriptions();
  }, [dateRange]);

  // Recalculate status distribution when subscriptions change
  useEffect(() => {
    if (subscriptions.length > 0) {
      console.log('Subscriptions data changed, recalculating status distribution...');
      const statusDistribution = calculateStatusDistribution();
      console.log('Recalculated status distribution:', statusDistribution);
    }
  }, [subscriptions]);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/dashboard/admin/metrics', {
        params: {
          start_date: dateRange.startDate,
          end_date: dateRange.endDate
        }
      });
      setMetrics(response.data.metrics);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard metrics');
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubscriptions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/subscriptions/admin/all');
      console.log('Fetched subscriptions response:', response.data);
      console.log('subscriptions 79', subscriptions);
      setSubscriptions(response.data || []);
      console.log('subscriptions 82', subscriptions);
      
      // Debug: Log each subscription
      if (response.data.data) {
        response.data.data.forEach((sub, index) => {
          console.log(`Subscription ${index + 1}:`, {
            id: sub.id,
            name: sub.name,
            is_active: sub.is_active,
            pause_start_date: sub.pause_start_date,
            pause_end_date: sub.pause_end_date,
            created_at: sub.created_at
          });
        });
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  // Calculate status distribution from real data
  const calculateStatusDistribution = () => {
    // Use current date (July 1st, 2025)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    console.log('Calculating status distribution for', subscriptions.length, 'subscriptions');
    console.log('Today:', today.toISOString().split('T')[0]);
    
    const active = subscriptions.filter(sub => {
      console.log(`Subscription ${sub.id}: is_active=${sub.is_active}, pause_start=${sub.pause_start_date}, pause_end=${sub.pause_end_date}`);
      
      if (!sub.is_active) {
        console.log(`  -> Cancelled (not active)`);
        return false;
      }
      
      if (!sub.pause_start_date || !sub.pause_end_date) {
        console.log(`  -> Active (no pause dates)`);
        return true;
      }
      
      const pauseStart = new Date(sub.pause_start_date);
      const pauseEnd = new Date(sub.pause_end_date);
      pauseStart.setHours(0, 0, 0, 0);
      pauseEnd.setHours(0, 0, 0, 0);
      
      const isCurrentlyPaused = today >= pauseStart && today <= pauseEnd;
      console.log(`  -> Pause period: ${pauseStart.toISOString().split('T')[0]} to ${pauseEnd.toISOString().split('T')[0]}`);
      console.log(`  -> Is currently paused: ${isCurrentlyPaused}`);
      console.log(`  -> Today vs pause dates: ${today.toISOString().split('T')[0]} >= ${pauseStart.toISOString().split('T')[0]} && ${today.toISOString().split('T')[0]} <= ${pauseEnd.toISOString().split('T')[0]}`);
      
      return !isCurrentlyPaused;
    }).length;
    
    const paused = subscriptions.filter(sub => {
      if (!sub.is_active) return false;
      if (!sub.pause_start_date || !sub.pause_end_date) return false;
      
      const pauseStart = new Date(sub.pause_start_date);
      const pauseEnd = new Date(sub.pause_end_date);
      pauseStart.setHours(0, 0, 0, 0);
      pauseEnd.setHours(0, 0, 0, 0);
      
      return today >= pauseStart && today <= pauseEnd;
    }).length;
    
    const cancelled = subscriptions.filter(sub => !sub.is_active).length;
    
    // Additional calculations for better understanding
    const totalWithPauseDates = subscriptions.filter(sub => sub.is_active && sub.pause_start_date && sub.pause_end_date).length;
    const futurePaused = subscriptions.filter(sub => {
      if (!sub.is_active || !sub.pause_start_date || !sub.pause_end_date) return false;
      const pauseStart = new Date(sub.pause_start_date);
      pauseStart.setHours(0, 0, 0, 0);
      return today < pauseStart;
    }).length;
    
    console.log('Detailed analysis:', {
      total: subscriptions.length,
      active,
      paused,
      cancelled,
      totalWithPauseDates,
      futurePaused
    });
    
    return { active, paused, cancelled };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Chart data for subscription growth
  const subscriptionGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Subscriptions',
        data: [120, 150, 180, 220, 280, metrics?.active_subscriptions || 320],
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'New Subscriptions',
        data: [30, 35, 40, 45, 60, metrics?.new_subscriptions || 40],
        borderColor: 'rgb(40, 167, 69)',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Chart data for revenue
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Recurring Revenue',
        data: [3600000, 4500000, 5400000, 6600000, 8400000, metrics?.monthly_recurring_revenue || 9600000],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgb(102, 126, 234)',
        borderWidth: 2,
      }
    ]
  };

  // Chart data for subscription status distribution using real data
  const statusDistribution = calculateStatusDistribution();
  const statusDistributionData = {
    labels: ['Active', 'Paused', 'Cancelled'],
    datasets: [
      {
        data: [
          statusDistribution.active,
          statusDistribution.paused,
          statusDistribution.cancelled
        ],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)'
        ],
        borderColor: [
          'rgb(40, 167, 69)',
          'rgb(255, 193, 7)',
          'rgb(220, 53, 69)'
        ],
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Subscription Growth Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Recurring Revenue',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Subscription Status Distribution',
      },
    },
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.full_name}!</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.full_name}!</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchDashboardMetrics}>Try Again</button>
        </div>
      )}

      {/* Date Range Selector */}
      <div className="date-range-selector">
        <h3>Date Range</h3>
        <div className="date-inputs">
          <div className="date-input">
            <label>Start Date:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            />
          </div>
          <div className="date-input">
            <label>End Date:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            />
          </div>
          <button 
            className="btn-refresh"
            onClick={fetchDashboardMetrics}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>New Subscriptions</h3>
            <p className="metric-value">{formatNumber(metrics?.new_subscriptions || 0)}</p>
            <p className="metric-period">
              {format(new Date(dateRange.startDate), 'MMM dd')} - {format(new Date(dateRange.endDate), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Monthly Recurring Revenue</h3>
            <p className="metric-value">{formatCurrency(metrics?.monthly_recurring_revenue || 0)}</p>
            <p className="metric-period">Current MRR</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔄</div>
          <div className="metric-content">
            <h3>Reactivations</h3>
            <p className="metric-value">{formatNumber(metrics?.reactivations || 0)}</p>
            <p className="metric-period">
              {format(new Date(dateRange.startDate), 'MMM dd')} - {format(new Date(dateRange.endDate), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>Active Subscriptions</h3>
            <p className="metric-value">{formatNumber(metrics?.active_subscriptions || 0)}</p>
            <p className="metric-period">Total Active</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <Line data={subscriptionGrowthData} options={chartOptions} />
        </div>
        
        <div className="charts-row">
          <div className="chart-container half">
            <Bar data={revenueData} options={revenueChartOptions} />
          </div>
          <div className="chart-container half">
            <Doughnut data={statusDistributionData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Debug Section - Show actual subscription counts */}
      <div className="debug-section">
        <h3>Subscription Status Debug Info</h3>
        <div className="debug-grid">
          <div className="debug-item">
            <strong>Total Subscriptions:</strong> {subscriptions.length}
          </div>
          <div className="debug-item">
            <strong>Active:</strong> {statusDistribution.active}
          </div>
          <div className="debug-item">
            <strong>Currently Paused:</strong> {statusDistribution.paused}
          </div>
          <div className="debug-item">
            <strong>Cancelled:</strong> {statusDistribution.cancelled}
          </div>
          <div className="debug-item">
            <strong>With Pause Dates:</strong> {subscriptions.filter(sub => sub.is_active && sub.pause_start_date && sub.pause_end_date).length}
          </div>
          <div className="debug-item">
            <strong>Future Paused:</strong> {subscriptions.filter(sub => {
              if (!sub.is_active || !sub.pause_start_date || !sub.pause_end_date) return false;
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const pauseStart = new Date(sub.pause_start_date);
              pauseStart.setHours(0, 0, 0, 0);
              return today < pauseStart;
            }).length}
          </div>
        </div>
        <div className="debug-details">
          <h4>Subscription Details:</h4>
          {subscriptions.map((sub, index) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let status = sub.is_active ? 'Active' : 'Cancelled';
            let statusColor = sub.is_active ? 'green' : 'red';
            
            if (sub.is_active && sub.pause_start_date && sub.pause_end_date) {
              const pauseStart = new Date(sub.pause_start_date);
              const pauseEnd = new Date(sub.pause_end_date);
              pauseStart.setHours(0, 0, 0, 0);
              pauseEnd.setHours(0, 0, 0, 0);
              
              if (today >= pauseStart && today <= pauseEnd) {
                status = 'Currently Paused';
                statusColor = 'orange';
              } else if (today < pauseStart) {
                status = 'Future Paused';
                statusColor = 'blue';
              }
            }
            
            return (
              <div key={sub.id} className="debug-subscription">
                <span>ID: {sub.id}</span>
                <span>Name: {sub.name}</span>
                <span style={{color: statusColor}}>Status: {status}</span>
                <span>Pause: {sub.pause_start_date && sub.pause_end_date ? `${sub.pause_start_date} to ${sub.pause_end_date}` : 'None'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => setShowUsers(true)}>
            <span className="action-icon">👥</span>
            <span>View All Users</span>
          </button>
        </div>
      </div>
      {showTestimonials && <AdminTestimonials onClose={() => setShowTestimonials(false)} />}
      {showUsers && <AdminUsers onClose={() => setShowUsers(false)} />}
    </div>
  );
};

export default AdminDashboard; 