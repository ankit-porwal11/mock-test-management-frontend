import { motion } from 'framer-motion';
import { HiClock, HiQuestionMarkCircle, HiCurrencyRupee, HiSignal } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { formatPrice, truncateText, getDifficultyColor } from '../utils/helpers';

export default function MockTestCard({ test, isPurchased = false }) {
  const difficultyStyle = getDifficultyColor(test.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden border border-dark-100 shadow-premium card-hover group"
    >
      {/* Card Header with Gradient */}
      <div className="relative h-36 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 p-5 flex flex-col justify-between overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="flex justify-between items-start relative z-10">
          <span className={`badge ${difficultyStyle}`}>
            {test.difficulty || 'Medium'}
          </span>
          {isPurchased && (
            <span className="bg-success-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              ✓ Purchased
            </span>
          )}
        </div>

        <h3 className="text-white font-bold text-lg leading-tight relative z-10 font-heading">
          {truncateText(test.title, 50)}
        </h3>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <p className="text-dark-500 text-sm mb-4 min-h-[40px]">
          {truncateText(test.description, 80)}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-dark-500">
            <HiQuestionMarkCircle className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-medium">{test.totalQuestions || 0} Qs</span>
          </div>
          <div className="flex items-center gap-1.5 text-dark-500">
            <HiClock className="w-4 h-4 text-accent-400" />
            <span className="text-xs font-medium">{test.duration || 0} min</span>
          </div>
          <div className="flex items-center gap-1.5 text-dark-500">
            <HiSignal className="w-4 h-4 text-warning-500" />
            <span className="text-xs font-medium">{test.difficulty || 'N/A'}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-100">
          <div className="flex items-center gap-1">
            <HiCurrencyRupee className="w-5 h-5 text-primary-600" />
            <span className="text-xl font-bold text-dark-900">
              {test.price ? formatPrice(test.price) : 'Free'}
            </span>
          </div>

          <Link
            to={isPurchased ? '#' : `/mock-tests/${test._id}`}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${
              isPurchased
                ? 'bg-success-50 text-success-700 cursor-default'
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 hover:shadow-md'
            }`}
          >
            {isPurchased ? 'Purchased' : 'View Details →'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
