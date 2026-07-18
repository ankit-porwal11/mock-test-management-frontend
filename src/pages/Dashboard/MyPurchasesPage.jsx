import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiAcademicCap,
  HiPlayCircle,
  HiClock,
  HiQuestionMarkCircle,
  HiCalendarDays,
  HiCurrencyRupee,
} from 'react-icons/hi2';
import api from '../../api/axios';
import { SkeletonCard } from '../../components/LoadingSpinner';
import EmptyState, { ErrorState } from '../../components/EmptyState';
import { formatDate, formatPrice, getDifficultyColor, truncateText } from '../../utils/helpers';

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(
 '/purchases/my-purchases'
);

setPurchases(
 res.data.data || []
);
     const purchases =
  res.data.data?.purchases || [];

setPurchases(purchases);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-900 font-heading flex items-center gap-2">
          <HiAcademicCap className="w-7 h-7 text-accent-600" />
          My Purchases
        </h1>
        <p className="text-dark-500 text-sm mt-1">All your purchased mock tests in one place</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && <ErrorState message={error} onRetry={fetchPurchases} />}

      {/* Empty */}
      {!loading && !error && purchases.length === 0 && (
        <EmptyState
          icon="cart"
          title="No purchases yet"
          description="You haven't purchased any mock tests yet. Browse our collection to get started!"
          action={() => window.location.href = '/mock-tests'}
          actionLabel="Browse Tests"
        />
      )}

      {/* Purchases Grid */}
      {!loading && !error && purchases.length > 0 && (
        <>
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <HiAcademicCap className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-primary-800 text-sm font-medium">
              You have <span className="font-bold">{purchases.length}</span> purchased mock test{purchases.length !== 1 ? 's' : ''}
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {purchases.map((purchase, index) => {
              const test = purchase.mockTest || purchase.mockTestId || {};
              return (
                <motion.div
                  key={purchase._id || index}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-dark-100 shadow-premium overflow-hidden card-hover"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-accent-600 p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-bold text-lg font-heading">
                          {test.title || 'Mock Test'}
                        </h3>
                        <p className="text-white/70 text-sm mt-1">
                          {truncateText(test.description, 60)}
                        </p>
                      </div>
                      <span className="bg-success-500 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                        ✓ Purchased
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-dark-500 text-sm">
                        <HiQuestionMarkCircle className="w-4 h-4 text-primary-400" />
                        {test.totalQuestions || 0} Questions
                      </div>
                      <div className="flex items-center gap-2 text-dark-500 text-sm">
                        <HiClock className="w-4 h-4 text-accent-400" />
                        {test.duration || 0} Minutes
                      </div>
                      <div className="flex items-center gap-2 text-dark-500 text-sm">
                        <HiCurrencyRupee className="w-4 h-4 text-success-500" />
                        {formatPrice(test.price)}
                      </div>
                      <div className="flex items-center gap-2 text-dark-500 text-sm">
                        <HiCalendarDays className="w-4 h-4 text-warning-500" />
                        {formatDate(purchase.createdAt).split(',')[0]}
                      </div>
                    </div>

                    {test.difficultyLevel && (
                      <span className={`badge ${getDifficultyColor(test.difficultyLevel)} mb-4 inline-flex`}>
                        {test.difficultyLevel}
                      </span>
                    )}

                   <Link
  to={`/mock-tests/${test._id}`}
  className="btn-success w-full py-2.5 mt-2"
>
                      <HiPlayCircle className="w-5 h-5" />
                      Start Test
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
