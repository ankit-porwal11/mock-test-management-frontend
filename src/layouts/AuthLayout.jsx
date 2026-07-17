import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_NAME } from '../utils/constants';
import { HiOutlineAcademicCap } from 'react-icons/hi2';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* ── Left panel — branding (hidden on mobile) ──────── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <HiOutlineAcademicCap className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">{APP_NAME}</span>
            </div>

            {/* Tagline */}
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Master Your Exams <br /> With Confidence
            </h1>
            <p className="text-lg text-white/70 max-w-md mx-auto leading-relaxed">
              Practice with curated mock tests, track your performance, and achieve your goals — all in one place.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-10">
              {[
                { value: '10K+', label: 'Students' },
                { value: '500+', label: 'Mock Tests' },
                { value: '95%', label: 'Success Rate' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right panel — form area ──────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile brand strip */}
        <div className="lg:hidden px-6 py-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
