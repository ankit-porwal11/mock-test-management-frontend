import { motion } from 'framer-motion';

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-dark-100">
    <div className="skeleton h-40 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="flex justify-between pt-2">
        <div className="skeleton h-8 w-20" />
        <div className="skeleton h-8 w-24" />
      </div>
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
    <div className="skeleton h-12 w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-t border-dark-100">
        <div className="skeleton h-5 flex-1" />
        <div className="skeleton h-5 flex-1" />
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-5 w-20" />
      </div>
    ))}
  </div>
);

const SkeletonDetail = () => (
  <div className="space-y-6">
    <div className="skeleton h-8 w-2/3" />
    <div className="skeleton h-4 w-full" />
    <div className="skeleton h-4 w-5/6" />
    <div className="skeleton h-4 w-4/6" />
    <div className="flex gap-4 pt-4">
      <div className="skeleton h-12 w-32" />
      <div className="skeleton h-12 w-32" />
    </div>
  </div>
);

const SkeletonDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="stat-card">
          <div className="skeleton h-4 w-24 mb-3" />
          <div className="skeleton h-8 w-16" />
        </div>
      ))}
    </div>
    <div className="skeleton h-64 w-full rounded-2xl" />
  </div>
);

export { SkeletonCard, SkeletonTable, SkeletonDetail, SkeletonDashboard };

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`${sizes[size]} border-3 border-primary-200 border-t-primary-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <p className="text-dark-500 text-sm font-medium">{text}</p>
      )}
    </div>
  );
}
