import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineCreditCard,
  HiOutlineUserCircle,
  HiOutlineChartBarSquare,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import { APP_NAME } from '../utils/constants';

const sidebarItems = [
  { label: 'Dashboard', path: '/dashboard', icon: HiOutlineHome, end: true },
  { label: 'My Purchases', path: '/dashboard/purchases', icon: HiOutlineShoppingBag },
  { label: 'Payment History', path: '/dashboard/payments', icon: HiOutlineCreditCard },
  { label: 'Profile', path: '/dashboard/profile', icon: HiOutlineUserCircle },
  { label: 'Analytics', path: '/dashboard/analytics', icon: HiOutlineChartBarSquare },
];

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Brand ──────────────────────────────────────────── */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">PM</span>
          </div>
          <span className="text-lg font-bold text-white">{APP_NAME}</span>
        </div>
        {/* Mobile close */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white">
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* ── User card ──────────────────────────────────────── */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(user?.fullName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.fullName || 'User'}</p>
            <p className="text-xs text-white/60 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* ── Nav links ──────────────────────────────────────── */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {sidebarItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/20 text-white shadow-lg shadow-black/10'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ─────────────────────────────────────────── */}
      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer"
        >
          <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Sidebar — desktop (always visible) ────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Sidebar — mobile (overlay) ────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Panel */}
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content area ─────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — mobile hamburger */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center h-14 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <HiOutlineBars3 className="w-6 h-6" />
          </button>
          <span className="ml-3 text-sm font-semibold text-gray-800">{APP_NAME}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
