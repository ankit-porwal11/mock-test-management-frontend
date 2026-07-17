import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  HiAcademicCap,
  HiClipboardDocumentList,
  HiChartBar,
  HiCurrencyRupee,
  HiClock,
  HiQuestionMarkCircle,
  HiStar,
  HiArrowRight,
  HiCheckBadge,
  HiUsers,
  HiBookOpen,
  HiTrophy,
  HiShieldCheck,
  HiArrowTopRightOnSquare,
} from 'react-icons/hi2';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

/* ─────────────────────────────── Helpers ─────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const difficultyColor = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

function truncate(str, len = 80) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

/* ─────────────── Animated Counter (fires once on scroll) ─────────────── */

function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setValue(end);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ──────────────────── Skeleton Card (loading state) ──────────────────── */

function SkeletonCard() {
  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-5" />
      <div className="flex items-center gap-3 mb-4">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-9 w-24 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get('/mock-tests/get-all-mock-tests?limit=6');
        const data = res.data.data;
        setTests(Array.isArray(data) ? data : data?.mockTests || data?.tests || data?.docs || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ─────────── HERO ─────────── */}
      <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-indigo-200/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 50, 0], x: [0, -40, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 -right-20 w-[35rem] h-[35rem] bg-purple-200/35 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -25, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-100/30 rounded-full blur-2xl"
          />
          {/* Floating geometric shapes */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[20%] right-[12%] w-16 h-16 border-2 border-indigo-200/50 rounded-xl"
          />
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[25%] left-[8%] w-12 h-12 border-2 border-purple-200/50 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[60%] right-[8%] w-8 h-8 bg-indigo-300/20 rounded-lg rotate-45"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/80 backdrop-blur border border-indigo-200/50 text-indigo-700 text-sm font-medium mb-8"
          >
            <HiCheckBadge className="w-4 h-4" />
            Trusted by 10,000+ Students
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight"
          >
            Master Your Exams with
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              AI-Powered Mock Tests
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Practice with real exam patterns, get instant AI analytics, track your progress, and
            ace your exams with confidence. Join thousands of successful students.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/mock-tests"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 text-base"
            >
              Explore Tests
              <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-indigo-300 shadow-lg shadow-gray-100/50 transition-all duration-300 text-base"
            >
              Get Started Free
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400"
          >
            <span className="flex items-center gap-1.5"><HiShieldCheck className="w-4 h-4 text-green-500" /> Secure & Private</span>
            <span className="flex items-center gap-1.5"><HiTrophy className="w-4 h-4 text-amber-500" /> Top-Rated Platform</span>
            <span className="flex items-center gap-1.5"><HiBookOpen className="w-4 h-4 text-indigo-500" /> Comprehensive Coverage</span>
          </motion.div>
        </div>
      </section>

      {/* ─────────── FEATURED MOCK TESTS ─────────── */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-indigo-600 tracking-wider uppercase">Explore</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">Popular Mock Tests</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Start practicing with our most popular tests curated by experts
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error || tests.length === 0 ? (
            /* Empty / Error State */
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-3xl flex items-center justify-center mb-6">
                <HiBookOpen className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tests Available Yet</h3>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                We're preparing amazing mock tests for you. Check back soon or explore other sections.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
              >
                Get Notified <HiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test, i) => (
                <motion.div
                  key={test._id || i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-100/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden group"
                >
                  {/* Top accent bar */}
                  <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-800 leading-snug line-clamp-2 flex-1 pr-3">
                        {test.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize shrink-0 ${
                          difficultyColor[test.difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {test.difficulty || 'N/A'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                      {truncate(test.description, 100)}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
                      <span className="flex items-center gap-1">
                        <HiClock className="w-4 h-4" /> {test.duration || '—'} min
                      </span>
                      <span className="flex items-center gap-1">
                        <HiQuestionMarkCircle className="w-4 h-4" /> {test.totalQuestions || '—'} Qs
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-lg font-bold text-gray-800">
                        {test.price === 0 || !test.price ? (
                          <span className="text-emerald-600">Free</span>
                        ) : (
                          <>₹{test.price}</>
                        )}
                      </span>
                      <Link
                        to={`/mock-tests/${test._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors group/btn"
                      >
                        View Details
                        <HiArrowTopRightOnSquare className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && !error && tests.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mt-12"
            >
              <Link
                to="/mock-tests"
                className="inline-flex items-center gap-2 px-6 py-3 text-indigo-700 font-semibold border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 rounded-2xl transition-all"
              >
                View All Mock Tests <HiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─────────── WHY CHOOSE US ─────────── */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] bg-gradient-to-b from-indigo-50/60 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-indigo-600 tracking-wider uppercase">Why Us</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">Why Choose PrepMaster</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Everything you need to prepare smarter and score higher
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: HiAcademicCap,
                title: 'AI-Powered Tests',
                desc: 'Adaptive difficulty that matches your skill level and helps you improve faster with personalized question sets.',
                color: 'from-indigo-500 to-blue-500',
                bg: 'bg-indigo-50',
              },
              {
                icon: HiClipboardDocumentList,
                title: 'Real Exam Pattern',
                desc: 'Tests designed to mirror actual exam formats, timing, and difficulty — so there are no surprises on exam day.',
                color: 'from-purple-500 to-pink-500',
                bg: 'bg-purple-50',
              },
              {
                icon: HiChartBar,
                title: 'Detailed Analytics',
                desc: 'Deep-dive into your performance with section-wise analysis, time tracking, and improvement suggestions.',
                color: 'from-emerald-500 to-teal-500',
                bg: 'bg-emerald-50',
              },
              {
                icon: HiCurrencyRupee,
                title: 'Affordable Pricing',
                desc: 'Premium quality at budget-friendly prices. Many free tests available to get you started immediately.',
                color: 'from-amber-500 to-orange-500',
                bg: 'bg-amber-50',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-7 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
              >
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 rounded-2xl" />
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className={`w-7 h-7 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} style={{ color: undefined }} />
                    {/* Since bg-clip-text doesn't work on icons, use a solid color */}
                    <item.icon className={`w-7 h-7 absolute`} style={{ color: item.color.includes('indigo') ? '#6366f1' : item.color.includes('purple') ? '#a855f7' : item.color.includes('emerald') ? '#10b981' : '#f59e0b' }} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── PLATFORM STATISTICS ─────────── */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { icon: HiUsers, value: 10000, suffix: '+', label: 'Students' },
              { icon: HiBookOpen, value: 500, suffix: '+', label: 'Mock Tests' },
              { icon: HiTrophy, value: 95, suffix: '%', label: 'Success Rate' },
              { icon: HiShieldCheck, value: 24, suffix: '/7', label: 'Support' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-4">
                  <stat.icon className="w-7 h-7 text-white/90" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-indigo-200 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── TESTIMONIALS ─────────── */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50/80 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-indigo-600 tracking-wider uppercase">Testimonials</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">What Our Students Say</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Hear from students who transformed their exam preparation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                quote: 'PrepMaster\'s mock tests were incredibly close to the actual exam. The detailed analytics helped me identify weak areas and improve my score by 40%. Highly recommended!',
                rating: 5,
                course: 'UPSC Prelims',
                avatar: 'PS',
              },
              {
                name: 'Rahul Verma',
                quote: 'The AI-powered difficulty adjustment is a game changer. Each test felt personalized to my level, pushing me just enough to grow without overwhelming me.',
                rating: 5,
                course: 'CAT Preparation',
                avatar: 'RV',
              },
              {
                name: 'Anita Desai',
                quote: 'Affordable, comprehensive, and well-designed. I tried 3 other platforms before PrepMaster, and nothing comes close. The UI is beautiful and the content is top-notch.',
                rating: 4,
                course: 'GATE CS',
                avatar: 'AD',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md shadow-gray-100/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <HiStar
                      key={si}
                      className={`w-5 h-5 ${si < t.rating ? 'text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.course}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 -right-20 w-[28rem] h-[28rem] bg-white/5 rounded-full blur-3xl"
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Ready to Ace Your Exams?
            </h2>
            <p className="mt-5 text-lg text-indigo-200 max-w-xl mx-auto leading-relaxed">
              Join thousands of students who are already preparing smarter with PrepMaster. Start your journey today — it's free.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-2xl shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 text-base"
              >
                Sign Up for Free
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/mock-tests"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-2xl transition-all duration-300 text-base"
              >
                Browse Tests
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-white">PrepMaster</span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-500 mb-5">
                India's most trusted online exam preparation platform. Practice with AI-powered mock tests and achieve your dream score.
              </p>
              <div className="flex gap-3">
                {[FiTwitter, FiLinkedin, FiInstagram, FiGithub].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-indigo-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Mock Tests', path: '/mock-tests' },
                  { name: 'Login', path: '/login' },
                  { name: 'Register', path: '/register' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-indigo-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2.5">
                {['Study Material', 'Blog', 'FAQs', 'Support'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-indigo-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-2.5 text-sm">
                <li>support@prepmaster.in</li>
                <li>+91 98765 43210</li>
                <li>Mumbai, India</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} PrepMaster. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
