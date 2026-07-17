import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiAcademicCap,
  HiCurrencyRupee,
  HiCheckCircle,
  HiClock,
  HiArrowTrendingUp,
  HiBookOpen,
  HiCreditCard,
  HiUserCircle,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import { SkeletonDashboard } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/EmptyState';
import { formatDate, formatPrice, getStatusColor } from '../../utils/helpers';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPurchases: 0, totalSpent: 0, successCount: 0, pendingCount: 0 });
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/payments/payment-history', { params: { limit: 50 } });
      const payments = res.data.data?.payments || res.data.data || [];

      const successful = payments.filter((p) => p.status === 'SUCCESS');
      const pending = payments.filter((p) => p.status === 'PENDING');
      const totalSpent = successful.reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalPurchases: successful.length,
        totalSpent,
        successCount: successful.length,
        pendingCount: pending.length,
      });

      setRecentPayments(payments.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <SkeletonDashboard />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboardData} />;

  const quickActions = [
    { icon: HiBookOpen, label: 'Browse Tests', to: '/mock-tests', color: 'primary', desc: 'Explore available mock tests' },
    { icon: HiAcademicCap, label: 'My Purchases', to: '/dashboard/purchases', color: 'accent', desc: 'View purchased tests' },
    { icon: HiCreditCard, label: 'Payments', to: '/dashboard/payments', color: 'success', desc: 'View payment history' },
    { icon: HiUserCircle, label: 'Profile', to: '/dashboard/profile', color: 'warning', desc: 'Manage your profile' },
  ];

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
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-2">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Here's an overview of your learning journey. Keep up the great work!
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiAcademicCap} label="Total Purchases" value={stats.totalPurchases} color="primary" />
        <StatCard icon={HiCurrencyRupee} label="Total Spent" value={formatPrice(stats.totalSpent)} color="accent" />
        <StatCard icon={HiCheckCircle} label="Successful" value={stats.successCount} color="success" />
        <StatCard icon={HiClock} label="Pending" value={stats.pendingCount} color="warning" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-bold text-dark-800 mb-4 font-heading">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const colorMap = {
              primary: 'bg-primary-50 text-primary-600 group-hover:bg-primary-100',
              accent: 'bg-accent-50 text-accent-600 group-hover:bg-accent-100',
              success: 'bg-success-50 text-success-600 group-hover:bg-success-50',
              warning: 'bg-warning-50 text-warning-600 group-hover:bg-warning-50',
            };
            return (
              <Link
                key={action.label}
                to={action.to}
                className="group bg-white rounded-2xl p-5 border border-dark-100 card-hover flex items-start gap-4 shadow-premium"
              >
                <div className={`p-3 rounded-xl transition-colors ${colorMap[action.color]}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-dark-800 group-hover:text-primary-700 transition-colors">{action.label}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-dark-800 font-heading">Recent Transactions</h2>
          <Link to="/dashboard/payments" className="text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors">
            View All →
          </Link>
        </div>

        {recentPayments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dark-100 p-8 text-center">
            <HiCreditCard className="w-12 h-12 text-dark-300 mx-auto mb-3" />
            <p className="text-dark-500 font-medium">No transactions yet</p>
            <p className="text-dark-400 text-sm mt-1">Your payment history will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dark-100 shadow-premium overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-dark-50 text-xs font-semibold text-dark-500 uppercase tracking-wider">
              <div className="col-span-3">Transaction ID</div>
              <div className="col-span-3">Mock Test</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
            </div>

            {/* Table Rows */}
            {recentPayments.map((payment, index) => (
              <div
                key={payment._id || index}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-t border-dark-100 hover:bg-primary-50/30 transition-colors"
              >
                <div className="md:col-span-3">
                  <span className="md:hidden text-xs font-semibold text-dark-400 uppercase">Txn ID: </span>
                  <span className="font-mono text-sm text-dark-600 break-all">
                    {(payment.transactionId || payment._id || '').slice(0, 16)}...
                  </span>
                </div>
                <div className="md:col-span-3">
                  <span className="md:hidden text-xs font-semibold text-dark-400 uppercase">Test: </span>
                  <span className="text-sm font-medium text-dark-800">
                    {payment.mockTest?.title || payment.mockTestId?.title || 'Mock Test'}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="md:hidden text-xs font-semibold text-dark-400 uppercase">Amount: </span>
                  <span className="text-sm font-semibold text-dark-800">{formatPrice(payment.amount)}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="md:hidden text-xs font-semibold text-dark-400 uppercase">Status: </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="md:hidden text-xs font-semibold text-dark-400 uppercase">Date: </span>
                  <span className="text-sm text-dark-500">{formatDate(payment.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
