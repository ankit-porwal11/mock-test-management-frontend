import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiXCircle, HiArrowPath, HiHome, HiExclamationTriangle } from 'react-icons/hi2';

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || searchParams.get('error') || 'Payment could not be completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-danger-50 via-white to-dark-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-danger-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-dark-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="bg-white rounded-3xl shadow-premium-lg p-8 md:p-12 max-w-lg w-full text-center relative z-10"
      >
        {/* Failed Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          className="mx-auto w-24 h-24 bg-danger-50 rounded-full flex items-center justify-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', bounce: 0.6 }}
          >
            <HiXCircle className="w-16 h-16 text-danger-500" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-dark-900 mb-3 font-heading"
        >
          Payment Failed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-dark-500 mb-6"
        >
          Unfortunately, your payment could not be processed. Don't worry, no money has been deducted from your account.
        </motion.p>

        {/* Reason */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-danger-50 border border-danger-200 rounded-2xl p-4 mb-8 flex items-start gap-3"
        >
          <HiExclamationTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-semibold text-danger-700">Reason</p>
            <p className="text-sm text-danger-600 mt-0.5">{reason}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/mock-tests"
            className="btn-primary flex-1 justify-center py-3"
          >
            <HiArrowPath className="w-5 h-5" />
            Try Again
          </Link>
          <Link
            to="/dashboard"
            className="btn-secondary flex-1 justify-center py-3"
          >
            <HiHome className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
