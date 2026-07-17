import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts (eager — structural)
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Route Guard (eager)
import ProtectedRoute from './ProtectedRoute';

// Full-page loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      <p className="text-gray-500 text-sm font-medium">Loading…</p>
    </div>
  </div>
);

// ── Lazy-loaded pages ────────────────────────────────────────
const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Auth/RegisterPage'));
const MockTestListPage = lazy(() => import('../pages/MockTest/MockTestListPage'));
const MockTestDetailPage = lazy(() => import('../pages/MockTest/MockTestDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const MyPurchasesPage = lazy(() => import('../pages/Dashboard/MyPurchasesPage'));
const PaymentHistoryPage = lazy(() => import('../pages/Payment/PaymentHistoryPage'));
const ProfilePage = lazy(() => import('../pages/Dashboard/ProfilePage'));
const AnalyticsPage = lazy(() => import('../pages/Dashboard/AnalyticsPage'));
const CheckoutPage = lazy(() => import('../pages/Checkout/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('../pages/Payment/PaymentSuccessPage'));
const PaymentFailedPage = lazy(() => import('../pages/Payment/PaymentFailedPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Landing page — standalone (has its own Navbar & Footer) ── */}
        <Route index element={<LandingPage />} />

        {/* ── Public routes inside MainLayout ──────────────────── */}
        <Route element={<MainLayout />}>
          <Route path="mock-tests" element={<MockTestListPage />} />
          <Route path="mock-tests/:id" element={<MockTestDetailPage />} />
          <Route path="payment/success" element={<PaymentSuccessPage />} />
          <Route path="payment/failure" element={<PaymentFailedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ── Auth routes (login / register) ───────────────────── */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* ── Protected: Dashboard routes ──────────────────────── */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="purchases" element={<MyPurchasesPage />} />
          <Route path="payments" element={<PaymentHistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* ── Protected: Checkout ──────────────────────────────── */}
        <Route element={<MainLayout />}>
          <Route
            path="checkout/:mockTestId"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
