import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, color = 'primary', trend, suffix = '' }) {
  const colorMap = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      border: 'border-primary-100',
      value: 'text-primary-700',
    },
    accent: {
      bg: 'bg-accent-50',
      icon: 'text-accent-600',
      border: 'border-accent-100',
      value: 'text-accent-700',
    },
    success: {
      bg: 'bg-success-50',
      icon: 'text-success-600',
      border: 'border-success-100',
      value: 'text-success-700',
    },
    warning: {
      bg: 'bg-warning-50',
      icon: 'text-warning-600',
      border: 'border-warning-100',
      value: 'text-warning-600',
    },
    danger: {
      bg: 'bg-danger-50',
      icon: 'text-danger-600',
      border: 'border-danger-100',
      value: 'text-danger-600',
    },
  };

  const style = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl p-5 border ${style.border} shadow-premium card-hover`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`${style.bg} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${style.icon}`} />
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend >= 0 ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'
            }`}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-dark-500 text-sm font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold ${style.value} font-heading`}>
        {value}
        {suffix && <span className="text-sm font-normal text-dark-400 ml-1">{suffix}</span>}
      </p>
    </motion.div>
  );
}
