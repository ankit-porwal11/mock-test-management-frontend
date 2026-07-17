import { motion } from 'framer-motion';
import { HiInboxStack, HiExclamationTriangle, HiMagnifyingGlass, HiShoppingCart } from 'react-icons/hi2';

const icons = {
  empty: HiInboxStack,
  error: HiExclamationTriangle,
  search: HiMagnifyingGlass,
  cart: HiShoppingCart,
};

export default function EmptyState({
  icon = 'empty',
  title = 'No data found',
  description = 'There is nothing to display at the moment.',
  action,
  actionLabel,
  variant = 'default',
}) {
  const IconComponent = icons[icon] || icons.empty;

  const variants = {
    default: {
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-400',
    },
    error: {
      iconBg: 'bg-danger-50',
      iconColor: 'text-danger-500',
    },
    search: {
      iconBg: 'bg-accent-50',
      iconColor: 'text-accent-500',
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className={`${style.iconBg} p-6 rounded-full mb-6`}>
        <IconComponent className={`w-12 h-12 ${style.iconColor}`} />
      </div>
      <h3 className="text-xl font-semibold text-dark-800 mb-2">{title}</h3>
      <p className="text-dark-500 text-center max-w-md mb-6">{description}</p>
      {action && actionLabel && (
        <button onClick={action} className="btn-primary text-sm">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <EmptyState
      icon="error"
      variant="error"
      title="Oops! An error occurred"
      description={message}
      action={onRetry}
      actionLabel="Try Again"
    />
  );
}
