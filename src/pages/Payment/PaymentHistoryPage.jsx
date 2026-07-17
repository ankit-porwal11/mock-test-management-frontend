import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiCreditCard,
  HiFunnel,
  HiArrowDownTray,
} from 'react-icons/hi2';
import api from '../../api/axios';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import { SkeletonTable } from '../../components/LoadingSpinner';
import EmptyState, { ErrorState } from '../../components/EmptyState';
import { formatDate, formatPrice, getStatusColor } from '../../utils/helpers';
import { ITEMS_PER_PAGE, PAYMENT_STATUS } from '../../utils/constants';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/payments/payment-history', {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          ...(statusFilter && { status: statusFilter }),
          ...(search && { search }),
        },
      });
      const data = res.data.data;
      if (Array.isArray(data)) {
        setPayments(data);
        setTotalCount(data.length);
        setTotalPages(1);
      } else {
        setPayments(data?.payments || data?.docs || []);
        setTotalCount(data?.totalCount || data?.total || 0);
        setTotalPages(data?.totalPages || Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE) || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter, search]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status === statusFilter ? '' : status);
    setCurrentPage(1);
  };

  const statusFilters = [
    { label: 'All', value: '' },
    { label: 'Success', value: PAYMENT_STATUS.SUCCESS },
    { label: 'Pending', value: PAYMENT_STATUS.PENDING },
    { label: 'Failed', value: PAYMENT_STATUS.FAILED },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 font-heading flex items-center gap-2">
            <HiCreditCard className="w-7 h-7 text-primary-600" />
            Payment History
          </h1>
          <p className="text-dark-500 text-sm mt-1">Track all your transactions and payment records</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search by transaction ID or test name..."
          value={search}
          onChange={handleSearch}
        />
        <div className="flex items-center gap-2">
          <HiFunnel className="w-4 h-4 text-dark-400" />
          <div className="flex gap-1.5">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleStatusFilter(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  statusFilter === filter.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && <SkeletonTable rows={6} />}

      {/* Error */}
      {!loading && error && <ErrorState message={error} onRetry={fetchPayments} />}

      {/* Empty */}
      {!loading && !error && payments.length === 0 && (
        <EmptyState
          icon="cart"
          title="No payments found"
          description={statusFilter || search ? 'No payments match your filters.' : 'You have not made any payments yet.'}
          action={statusFilter || search ? () => { setStatusFilter(''); setSearch(''); } : undefined}
          actionLabel={statusFilter || search ? 'Clear Filters' : undefined}
        />
      )}

      {/* Table */}
      {!loading && !error && payments.length > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-dark-100 shadow-premium overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-dark-50 text-xs font-semibold text-dark-500 uppercase tracking-wider">
              <div className="col-span-3">Transaction ID</div>
              <div className="col-span-3">Mock Test</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
            </div>

            {/* Rows */}
            {payments.map((payment, index) => (
              <motion.div
                key={payment._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-t border-dark-100 hover:bg-primary-50/30 transition-colors"
              >
                <div className="md:col-span-3">
                  <span className="md:hidden text-xs font-semibold text-dark-400 block mb-0.5">Transaction ID</span>
                  <span className="font-mono text-sm text-dark-600 break-all">
                    {payment.transactionId || payment._id || 'N/A'}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <span className="md:hidden text-xs font-semibold text-dark-400 block mb-0.5">Mock Test</span>
                  <span className="text-sm font-medium text-dark-800">
                    {payment.mockTest?.title || payment.mockTestId?.title || 'Mock Test'}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="md:hidden text-xs font-semibold text-dark-400 block mb-0.5">Amount</span>
                  <span className="text-sm font-semibold text-dark-800">
                    {formatPrice(payment.amount)}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="md:hidden text-xs font-semibold text-dark-400 block mb-0.5">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="md:hidden text-xs font-semibold text-dark-400 block mb-0.5">Date</span>
                  <span className="text-sm text-dark-500">
                    {formatDate(payment.createdAt)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-dark-500 text-sm">
              Showing {payments.length} of {totalCount} payments
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => { setCurrentPage(p); }}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
