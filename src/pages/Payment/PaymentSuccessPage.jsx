import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiArrowRight, HiClipboardDocumentList, HiHome } from 'react-icons/hi2';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(true);
  const transactionId = searchParams.get('transactionId') || searchParams.get('txnid') || 'N/A';

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 via-white to-primary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-success-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      {/* Animated confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ['#22c55e', '#6366f1', '#a855f7', '#f59e0b', '#ef4444'][i % 5],
                left: `${Math.random() * 100}%`,
                top: '-5%',
              }}
              animate={{
                y: '110vh',
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                x: (Math.random() - 0.5) * 200,
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 2,
                ease: 'easeIn',
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="bg-white rounded-3xl shadow-premium-lg p-8 md:p-12 max-w-lg w-full text-center relative z-10"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          className="mx-auto w-24 h-24 bg-success-50 rounded-full flex items-center justify-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', bounce: 0.6 }}
          >
            <HiCheckCircle className="w-16 h-16 text-success-500" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-dark-900 mb-3 font-heading"
        >
          Payment Successful! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-dark-500 mb-6"
        >
          Your payment has been processed successfully. The mock test has been unlocked and added to your purchases.
        </motion.p>

        {/* Transaction Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-dark-50 rounded-2xl p-4 mb-8"
        >
          <p className="text-sm text-dark-500 mb-1">Transaction ID</p>
          <p className="font-mono text-dark-800 font-semibold text-sm break-all">
            {transactionId}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/dashboard"
            className="btn-primary flex-1 justify-center py-3"
          >
            <HiHome className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <Link
            to="/dashboard/payments"
            className="btn-secondary flex-1 justify-center py-3"
          >
            <HiClipboardDocumentList className="w-5 h-5" />
            Payment History
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6"
        >
          <Link
            to="/dashboard/purchases"
            className="text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center gap-1 transition-colors"
          >
            View My Purchases <HiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
