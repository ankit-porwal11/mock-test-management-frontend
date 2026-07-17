import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiArrowLeft,
  HiClock,
  HiQuestionMarkCircle,
  HiSignal,
  HiCurrencyRupee,
  HiShieldCheck,
  HiPlayCircle,
  HiCheckBadge,
  HiShoppingCart,
} from 'react-icons/hi2';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { SkeletonDetail } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/EmptyState';
import { formatPrice, getDifficultyColor } from '../../utils/helpers';

export default function MockTestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  const fetchTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/mock-tests/get-mock-test/${id}`);
      const data = res.data.data;
      setTest(data);

      // Check if user has already purchased this test
      if (isAuthenticated) {
        setCheckingPurchase(true);
        try {
          const paymentRes = await api.get('/payments/payment-history', {
            params: { status: 'SUCCESS', limit: 100 },
          });
          const payments = paymentRes.data.data?.payments || paymentRes.data.data || [];
          const purchased = payments.some(
            (p) =>
              (p.mockTestId?._id || p.mockTestId || p.mockTest?._id || p.mockTest) === id &&
              p.status === 'SUCCESS'
          );
          setIsPurchased(purchased);
        } catch {
          // Fail silently — purchase check is non-critical
        } finally {
          setCheckingPurchase(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load test details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTest();
  }, [id]);

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase this test');
      navigate('/login', { state: { from: `/mock-tests/${id}` } });
      return;
    }
    navigate(`/checkout/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <SkeletonDetail />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message={error} onRetry={fetchTest} />
      </div>
    );
  }

  if (!test) return null;

  const highlights = [
    { icon: HiClock, label: 'Duration', value: `${test.duration || 0} Minutes`, color: 'text-primary-600 bg-primary-50' },
    { icon: HiQuestionMarkCircle, label: 'Questions', value: `${test.totalQuestions || 0} Questions`, color: 'text-accent-600 bg-accent-50' },
    { icon: HiSignal, label: 'Difficulty', value: test.difficulty || 'Medium', color: 'text-warning-600 bg-warning-50' },
    { icon: HiShieldCheck, label: 'Type', value: 'Full Length', color: 'text-success-600 bg-success-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/mock-tests" className="hover:text-white transition-colors">Mock Tests</Link>
            <span>/</span>
            <span className="text-white">{test.title}</span>
          </div>

          <button
            onClick={() => navigate('/mock-tests')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Mock Tests
          </button>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3 font-heading"
          >
            {test.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className={`badge ${getDifficultyColor(test.difficulty)}`}>
              {test.difficulty || 'Medium'}
            </span>
            {isPurchased && (
              <span className="bg-success-500/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-success-400/30">
                <HiCheckBadge className="w-4 h-4" /> Purchased
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column — Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {highlights.map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-4 border border-dark-100 shadow-premium text-center">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-dark-400 font-medium">{item.label}</p>
                  <p className="text-sm font-bold text-dark-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-dark-100 shadow-premium"
            >
              <h2 className="text-xl font-bold text-dark-800 mb-4 font-heading">About This Test</h2>
              <div className="text-dark-600 leading-relaxed whitespace-pre-line">
                {test.description || 'No description available for this mock test.'}
              </div>
            </motion.div>

            {/* What You'll Get */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 border border-dark-100 shadow-premium"
            >
              <h2 className="text-xl font-bold text-dark-800 mb-4 font-heading">What You'll Get</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Full-length mock test experience',
                  'Real exam-pattern questions',
                  'Timed test environment',
                  'Instant access after purchase',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-dark-600 text-sm">
                    <HiCheckBadge className="w-5 h-5 text-success-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column — Purchase Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-dark-100 shadow-premium-lg sticky top-24"
            >
              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <HiCurrencyRupee className="w-8 h-8 text-dark-900" />
                  <span className="text-4xl font-bold text-dark-900 font-heading">
                    {test.price || 0}
                  </span>
                </div>
                <p className="text-dark-400 text-sm">One-time payment • Lifetime access</p>
              </div>

              {/* Action Button */}
              {isPurchased ? (
                <div className="space-y-3">
                  <div className="bg-success-50 border border-success-200 rounded-xl p-4 text-center">
                    <HiCheckBadge className="w-8 h-8 text-success-500 mx-auto mb-2" />
                    <p className="font-semibold text-success-700">Already Purchased</p>
                    <p className="text-success-600 text-xs mt-1">You have full access to this test</p>
                  </div>
                  <button className="btn-success w-full py-3 text-base">
                    <HiPlayCircle className="w-5 h-5" />
                    Start Test
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBuyNow}
                  disabled={checkingPurchase}
                  className="btn-primary w-full py-3 text-base"
                >
                  <HiShoppingCart className="w-5 h-5" />
                  Buy Now
                </button>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-dark-100">
                <div className="space-y-2.5">
                  {[
                    { icon: HiShieldCheck, text: 'Secure Payment' },
                    { icon: HiCheckBadge, text: 'Instant Access' },
                  ].map((badge) => (
                    <div key={badge.text} className="flex items-center gap-2 text-dark-500 text-sm">
                      <badge.icon className="w-4 h-4 text-primary-500" />
                      {badge.text}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
