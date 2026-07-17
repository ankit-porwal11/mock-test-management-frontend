import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiExclamationTriangle } from 'react-icons/hi2';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/40 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] left-[10%] w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[40%] right-[25%] w-48 h-48 bg-pink-200/20 rounded-full blur-2xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 150 }}
          className="relative mb-6"
        >
          <h1 className="text-[10rem] sm:text-[12rem] font-black leading-none bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent select-none">
            404
          </h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute top-8 right-4 sm:right-12"
          >
            <HiExclamationTriangle className="w-12 h-12 text-amber-400 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <HiHome className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            Go Home
          </Link>
          <Link
            to="/mock-tests"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-indigo-200 text-indigo-700 font-semibold rounded-2xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
          >
            Browse Tests
          </Link>
        </motion.div>

        {/* Subtle breadcrumb */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 text-sm text-gray-400"
        >
          PrepMaster &bull; Learn. Practice. Succeed.
        </motion.p>
      </motion.div>
    </div>
  );
}
