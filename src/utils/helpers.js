/**
 * Format a date value into a human-readable string.
 * @param {string | number | Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

/**
 * Format a numeric amount as Indian Rupees.
 * @param {number} amount
 * @returns {string}
 */
export const formatPrice = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

/**
 * Truncate text to a maximum length, appending an ellipsis when trimmed.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
};

/**
 * Extract initials from a full name (up to 2 letters).
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
};

/**
 * Return a Tailwind color class string for a given difficulty level.
 * @param {string} difficulty
 * @returns {string}
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    Easy: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    Hard: 'bg-red-100 text-red-700',
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-700';
};

/**
 * Return a Tailwind color class string for a payment status.
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = (status) => {
  const colors = {
    SUCCESS: 'bg-emerald-100 text-emerald-700',
    PENDING: 'bg-amber-100 text-amber-700',
    FAILED: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

/**
 * Merge / conditionally join CSS class strings (lightweight clsx alternative).
 * @param  {...(string | false | null | undefined)} classes
 * @returns {string}
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
