import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiShieldCheck,
  HiLockClosed,
  HiCreditCard,
  HiArrowLeft,
  HiCurrencyRupee,
  HiCheckBadge,
} from 'react-icons/hi2';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner, { SkeletonDetail } from '../../components/LoadingSpinner';
import { formatPrice } from '../../utils/helpers';

export default function CheckoutPage() {
  const { mockTestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/mock-tests/get-mock-test/${mockTestId}`);
        setTest(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load test details');
        navigate('/mock-tests');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [mockTestId]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const res = await api.post('/payments/create-payment', { mockTestId });
      const paymentData = res.data.data;

      // Handle PayU redirect: backend returns form data or redirect URL
      if (paymentData?.url) {
        window.location.href = paymentData.url;
      } else if (paymentData?.formAction || paymentData?.action) {
        // Create and submit a hidden form for PayU
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentData.formAction || paymentData.action;

        const formFields = paymentData.formFields || paymentData.params || paymentData;
        Object.entries(formFields).forEach(([key, value]) => {
          if (key === 'formAction' || key === 'action' || key === 'url') return;
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        // Fallback: if backend returns a different structure, try to handle it
        toast.error('Unexpected payment response. Please contact support.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <SkeletonDetail />
      </div>
    );
  }

  if (!test) return null;

  const subtotal = test.price || 0;
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-mesh py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-dark-500 text-sm mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/mock-tests" className="hover:text-primary-600 transition-colors">Mock Tests</Link>
          <span>/</span>
          <span className="text-dark-800 font-medium">Checkout</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-dark-500 hover:text-primary-600 text-sm font-medium mb-6 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6"
        >
          {/* Order Summary */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 border border-dark-100 shadow-premium">
              <h1 className="text-2xl font-bold text-dark-900 mb-6 font-heading flex items-center gap-2">
                <HiCreditCard className="w-7 h-7 text-primary-600" />
                Checkout
              </h1>

              {/* Test Info */}
              <div className="bg-dark-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiCreditCard className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-dark-800 text-lg">{test.title}</h3>
                    <p className="text-dark-500 text-sm mt-1 line-clamp-2">{test.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-dark-500">
                      <span>{test.totalQuestions || 0} Questions</span>
                      <span>•</span>
                      <span>{test.duration || 0} Minutes</span>
                      <span>•</span>
                      <span>{test.difficulty || 'Medium'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-dark-700 text-sm uppercase tracking-wider mb-3">Buyer Details</h3>
                <div className="bg-dark-50 rounded-xl p-4 space-y-2">
                  <p className="text-dark-700 text-sm"><span className="text-dark-400">Name:</span> {user?.fullName || 'N/A'}</p>
                  <p className="text-dark-700 text-sm"><span className="text-dark-400">Email:</span> {user?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div>
                <h3 className="font-semibold text-dark-700 text-sm uppercase tracking-wider mb-3">Price Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-dark-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-dark-600">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-dark-200 pt-3 flex justify-between">
                    <span className="text-lg font-bold text-dark-900">Total</span>
                    <span className="text-lg font-bold text-primary-700">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-dark-100 shadow-premium-lg sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <HiCurrencyRupee className="w-7 h-7 text-dark-900" />
                  <span className="text-3xl font-bold text-dark-900 font-heading">{total}</span>
                </div>
                <p className="text-dark-400 text-sm">Total Amount</p>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn-primary w-full py-3.5 text-base mb-4"
              >
                {processing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Processing...
                  </>
                ) : (
                  <>
                    <HiLockClosed className="w-5 h-5" />
                    Proceed to Payment
                  </>
                )}
              </button>

              {/* Trust */}
              <div className="space-y-3 pt-4 border-t border-dark-100">
                {[
                  { icon: HiShieldCheck, text: '256-bit SSL Encrypted' },
                  { icon: HiLockClosed, text: 'Secure Payment Gateway' },
                  { icon: HiCheckBadge, text: 'Instant Test Unlock' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-dark-500 text-xs">
                    <item.icon className="w-4 h-4 text-success-500" />
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
