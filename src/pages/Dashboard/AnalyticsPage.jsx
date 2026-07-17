import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiChartBarSquare,
  HiCurrencyRupee,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiArrowTrendingUp,
  HiBanknotes,
} from 'react-icons/hi2';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import { SkeletonDashboard } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/EmptyState';
import { formatPrice } from '../../utils/helpers';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try admin analytics endpoint first, fallback to payment history
      let analyticsData = null;
      try {
        const res = await api.get('/payments/admin/payment-analytics');
        analyticsData = res.data.data;
      } catch {
        // Not admin or endpoint unavailable, calculate from payment history
      }

      const paymentRes = await api.get('/payments/payment-history', { params: { limit: 200 } });
      const paymentList = Array.isArray(paymentRes.data.data)
        ? paymentRes.data.data
        : paymentRes.data.data?.payments || paymentRes.data.data?.docs || [];

      setPayments(paymentList);

      if (analyticsData) {
        setAnalytics(analyticsData);
      } else {
        // Calculate analytics from payment data
        const successful = paymentList.filter((p) => p.status === 'SUCCESS');
        const failed = paymentList.filter((p) => p.status === 'FAILED');
        const pending = paymentList.filter((p) => p.status === 'PENDING');
        const totalRevenue = successful.reduce((sum, p) => sum + (p.amount || 0), 0);

        setAnalytics({
          totalPayments: paymentList.length,
          successfulPayments: successful.length,
          failedPayments: failed.length,
          pendingPayments: pending.length,
          totalRevenue,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <SkeletonDashboard />;
  if (error) return <ErrorState message={error} onRetry={fetchAnalytics} />;
  if (!analytics) return null;

  const successRate = analytics.totalPayments > 0
    ? Math.round((analytics.successfulPayments / analytics.totalPayments) * 100)
    : 0;

  // Monthly breakdown from payments
  const monthlyData = {};
  payments.forEach((p) => {
    if (p.status === 'SUCCESS' && p.createdAt) {
      const month = new Date(p.createdAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + (p.amount || 0);
    }
  });
  const months = Object.keys(monthlyData).slice(-6);
  const maxMonthly = Math.max(...Object.values(monthlyData), 1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-dark-900 font-heading flex items-center gap-2">
          <HiChartBarSquare className="w-7 h-7 text-primary-600" />
          Analytics
        </h1>
        <p className="text-dark-500 text-sm mt-1">Your payment and purchase analytics overview</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          icon={HiBanknotes}
          label="Total Payments"
          value={analytics.totalPayments}
          color="primary"
        />
        <StatCard
          icon={HiCheckCircle}
          label="Successful"
          value={analytics.successfulPayments}
          color="success"
        />
        <StatCard
          icon={HiXCircle}
          label="Failed"
          value={analytics.failedPayments}
          color="danger"
        />
        <StatCard
          icon={HiClock}
          label="Pending"
          value={analytics.pendingPayments}
          color="warning"
        />
        <StatCard
          icon={HiCurrencyRupee}
          label="Total Spent"
          value={formatPrice(analytics.totalRevenue)}
          color="accent"
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Rate */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 border border-dark-100 shadow-premium"
        >
          <h3 className="text-lg font-bold text-dark-800 mb-6 font-heading">Payment Success Rate</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-44 h-44">
              {/* Background circle */}
              <svg className="w-44 h-44 -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#successGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - successRate / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-dark-900 font-heading">{successRate}%</span>
                <span className="text-xs text-dark-400 font-medium">Success Rate</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-dark-500">
              <div className="w-3 h-3 rounded-full bg-success-500" />
              Success ({analytics.successfulPayments})
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-500">
              <div className="w-3 h-3 rounded-full bg-danger-500" />
              Failed ({analytics.failedPayments})
            </div>
          </div>
        </motion.div>

        {/* Monthly Spending Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 border border-dark-100 shadow-premium"
        >
          <h3 className="text-lg font-bold text-dark-800 mb-6 font-heading">Monthly Spending</h3>
          {months.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-dark-400">
              <HiArrowTrendingUp className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">No spending data yet</p>
            </div>
          ) : (
            <div className="flex items-end gap-3 h-48 px-2">
              {months.map((month) => {
                const value = monthlyData[month];
                const height = Math.max((value / maxMonthly) * 100, 8);
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-dark-500 font-semibold">
                      {formatPrice(value)}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="w-full bg-gradient-to-t from-primary-600 to-accent-500 rounded-t-lg min-h-[8px] relative group cursor-pointer"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatPrice(value)}
                      </div>
                    </motion.div>
                    <span className="text-xs text-dark-400 font-medium">{month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Summary Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold font-heading">Summary</h3>
            <p className="text-white/70 text-sm mt-1">
              You've made {analytics.totalPayments} payments with a {successRate}% success rate.
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs uppercase tracking-wider">Total Spent</p>
            <p className="text-3xl font-bold font-heading">{formatPrice(analytics.totalRevenue)}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
