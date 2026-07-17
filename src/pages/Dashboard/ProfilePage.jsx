import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiUserCircle,
  HiEnvelope,
  HiUser,
  HiIdentification,
  HiCamera,
  HiPencilSquare,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getInitials } from '../../utils/helpers';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      toast.error('All fields are required');
      return;
    }
    setSaving(true);
    try {
      await updateUser(form);
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });
    setEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-900 font-heading flex items-center gap-2">
          <HiUserCircle className="w-7 h-7 text-primary-600" />
          My Profile
        </h1>
        <p className="text-dark-500 text-sm mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-dark-100 shadow-premium overflow-hidden"
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>

        {/* Avatar */}
        <div className="px-6 pb-6 -mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <div className="relative group">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white font-heading">
                    {getInitials(user?.fullName)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <HiCamera className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-dark-900 font-heading">{user?.fullName || 'User'}</h2>
              <p className="text-dark-500 text-sm">@{user?.username || 'username'}</p>
            </div>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn-secondary self-start sm:self-auto"
              >
                <HiPencilSquare className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Info / Edit Form */}
          {!editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: HiUser, label: 'Full Name', value: user?.fullName },
                { icon: HiIdentification, label: 'Username', value: `@${user?.username || ''}` },
                { icon: HiEnvelope, label: 'Email', value: user?.email },
              ].map((item) => (
                <div key={item.label} className="bg-dark-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-dark-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  <p className="text-dark-800 font-medium">{item.value || 'N/A'}</p>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1.5">Email</label>
                <div className="relative">
                  <HiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
