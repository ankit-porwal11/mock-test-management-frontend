import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import MockTestCard from '../../components/MockTestCard';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import { SkeletonCard } from '../../components/LoadingSpinner';
import EmptyState, { ErrorState } from '../../components/EmptyState';
import { ITEMS_PER_PAGE } from '../../utils/constants';

export default function MockTestListPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTests, setTotalTests] = useState(0);

  const fetchTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/mock-tests/get-all-mock-tests', {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          ...(search && { search }),
        },
      });

      const data = res.data.data;
      // Handle both array response and paginated object response
      if (Array.isArray(data)) {
        setTests(data);
        setTotalTests(data.length);
        setTotalPages(1);
      } else {
        setTests(data?.mockTests || data?.tests || data?.docs || []);
        setTotalTests(data?.totalCount || data?.total || data?.totalDocs || 0);
        setTotalPages(data?.totalPages || Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE) || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load mock tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [currentPage, search]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3 font-heading"
          >
            Explore Mock Tests
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg mb-6 max-w-2xl"
          >
            Practice with our curated collection of mock tests designed to help you ace your exams.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar
              placeholder="Search mock tests by title or topic..."
              value={search}
              onChange={handleSearch}
            />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6"
          >
            <p className="text-dark-500 text-sm">
              Showing <span className="font-semibold text-dark-800">{tests.length}</span> of{' '}
              <span className="font-semibold text-dark-800">{totalTests}</span> tests
              {search && (
                <span className="ml-1">
                  for "<span className="text-primary-600 font-medium">{search}</span>"
                </span>
              )}
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && <ErrorState message={error} onRetry={fetchTests} />}

        {/* Empty State */}
        {!loading && !error && tests.length === 0 && (
          <EmptyState
            icon="search"
            variant="search"
            title="No mock tests found"
            description={search ? `No tests match "${search}". Try a different search term.` : 'No mock tests are available at the moment. Check back later!'}
            action={search ? () => { setSearch(''); setCurrentPage(1); } : undefined}
            actionLabel={search ? 'Clear Search' : undefined}
          />
        )}

        {/* Test Cards Grid */}
        {!loading && !error && tests.length > 0 && (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tests.map((test) => (
                <MockTestCard key={test._id} test={test} />
              ))}
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
