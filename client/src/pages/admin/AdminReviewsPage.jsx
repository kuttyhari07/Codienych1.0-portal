import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, Plus, Edit2, Trash2, Play, Pause, CheckCircle2, 
  ExternalLink, Sparkles, AlertCircle, ArrowLeft, RotateCcw, 
  Radio, MapPin, Send, FastForward, ShieldAlert, Check, X, Loader2 
} from 'lucide-react';
import api from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Create / Edit Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    roundNumber: 1,
    startTime: '',
    endTime: '',
    venue: 'Main Hackathon Bay / Software Labs',
    description: '',
    announcement: '',
    status: 'UPCOMING',
    isCurrent: false,
  });

  // Quick announcement update state
  const [quickAnnouncement, setQuickAnnouncement] = useState('');
  const navigate = useNavigate();

  // Helper to format ISO to datetime-local string
  const toDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews/active');
      if (res.data.success && res.data.data) {
        setReviews(res.data.data.allReviews || []);
        setActiveReview(res.data.data.activeReview || null);
        if (res.data.data.activeReview) {
          setQuickAnnouncement(res.data.data.activeReview.announcement || '');
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Failed to load review schedule.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingReview(null);
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    setFormData({
      title: `Review ${reviews.length + 1}: `,
      roundNumber: reviews.length + 1,
      startTime: toDateTimeLocal(oneHourLater),
      endTime: toDateTimeLocal(threeHoursLater),
      venue: 'Main Hackathon Bay / Software Labs',
      description: '',
      announcement: '',
      status: 'UPCOMING',
      isCurrent: false,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (rev) => {
    setEditingReview(rev);
    setFormData({
      title: rev.title,
      roundNumber: rev.roundNumber,
      startTime: toDateTimeLocal(rev.startTime),
      endTime: toDateTimeLocal(rev.endTime),
      venue: rev.venue || '',
      description: rev.description || '',
      announcement: rev.announcement || '',
      status: rev.status || 'UPCOMING',
      isCurrent: !!rev.isCurrent,
    });
    setShowModal(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError('');
      setMessage('');

      if (!formData.title || !formData.startTime || !formData.endTime) {
        setError('Title, start time, and end time are required.');
        return;
      }

      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        setError('End time must be after start time.');
        return;
      }

      if (editingReview) {
        const res = await api.put(`/admin/reviews/${editingReview._id}`, formData);
        if (res.data.success) {
          setMessage(`Updated "${formData.title}" successfully.`);
        }
      } else {
        const res = await api.post('/admin/reviews', formData);
        if (res.data.success) {
          setMessage(`Created "${formData.title}" successfully.`);
        }
      }

      setShowModal(false);
      await fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetActive = async (id, title) => {
    try {
      setActionLoading(true);
      const res = await api.post(`/admin/reviews/${id}/set-active`);
      if (res.data.success) {
        setMessage(`Set "${title}" as the live review!`);
        await fetchReviews();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set active review.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtendTime = async (id, minutes) => {
    try {
      setActionLoading(true);
      const res = await api.post(`/admin/reviews/${id}/extend`, { minutes });
      if (res.data.success) {
        setMessage(`Added +${minutes} minutes to review end time.`);
        await fetchReviews();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to extend time.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/admin/reviews/${id}/status`, { status });
      if (res.data.success) {
        setMessage(`Review marked as ${status}.`);
        await fetchReviews();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReview = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      setActionLoading(true);
      const res = await api.delete(`/admin/reviews/${id}`);
      if (res.data.success) {
        setMessage(`Deleted "${title}".`);
        await fetchReviews();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateQuickAnnouncement = async () => {
    if (!activeReview) return;
    try {
      setActionLoading(true);
      const res = await api.put(`/admin/reviews/${activeReview._id}`, {
        announcement: quickAnnouncement,
      });
      if (res.data.success) {
        setMessage('Live jury announcement broadcasted to countdown page!');
        await fetchReviews();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to broadcast announcement.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all reviews to standard 4 hackathon milestones (Review 1, 2, 3, and Final)? Current changes will be overwritten.')) {
      return;
    }
    try {
      setActionLoading(true);
      const res = await api.post('/admin/reviews/reset-defaults');
      if (res.data.success) {
        setMessage('Default hackathon review rounds restored.');
        await fetchReviews();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restore defaults.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDisplayTime = (dt) => {
    if (!dt) return 'TBD';
    return new Date(dt).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03070b] text-[#ffd700] flex items-center justify-center font-cinzel text-sm">
        LOADING REVIEW CONTROL CENTER...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] pb-20">
      <AdminNavbar title="REVIEW TIMING CONTROL CENTER" showBack backTo="/admin" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="font-cinzel font-black text-xl sm:text-2xl text-white tracking-wide">
                REVIEW TIMINGS & LIVE COUNTDOWN
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40 text-xs font-mono font-bold">
                STAGE MANAGER
              </span>
            </div>
            <p className="font-cinzel text-xs text-[#e5c158] mt-1">
              Set review start/end timings, broadcast announcements, and monitor the public countdown clock
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-3.5 py-2.5 bg-[#0c1e2d] hover:bg-[#152e46] border border-[#00e5ff]/50 text-[#00e5ff] font-cinzel font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
              title="Open public projector screen in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span>PROJECTOR COUNTDOWN SCREEN</span>
            </Link>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#f39c12] text-black font-cinzel font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:brightness-110 transition-all cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW REVIEW</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="p-2.5 bg-[#140e06] border border-[#8a6d1b]/60 text-gray-400 hover:text-[#ffd700] rounded-xl transition-colors cursor-pointer"
              title="Restore standard hackathon default reviews"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-cinzel text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage('')} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 font-cinzel text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {/* ACTIVE REVIEW SPOTLIGHT & RAPID CONTROLS */}
        {activeReview && (
          <div className="bg-gradient-to-r from-[#0d1e2e] via-[#091522] to-[#0d1e2e] border-2 border-[#ffd700] rounded-2xl p-5 sm:p-7 mb-8 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-mono font-bold flex items-center space-x-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>CURRENT LIVE FOCUS STAGE</span>
                  </span>
                  <span className="text-xs font-mono text-[#00e5ff]">
                    Round {activeReview.roundNumber} of {reviews.length}
                  </span>
                </div>

                <h2 className="font-pirate text-2xl sm:text-3xl text-white mb-2">
                  {activeReview.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs font-cinzel text-gray-300">
                  <span className="bg-[#050e17] px-3 py-1 rounded-lg border border-[#ffd700]/30 text-[#ffd700] font-bold">
                    ⏰ {formatDisplayTime(activeReview.startTime)} → {formatDisplayTime(activeReview.endTime)}
                  </span>
                  <span className="bg-[#050e17] px-3 py-1 rounded-lg border border-[#ffd700]/30">
                    📍 {activeReview.venue}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold ${
                    activeReview.status === 'ACTIVE'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : activeReview.status === 'PAUSED'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    STATUS: {activeReview.status}
                  </span>
                  {activeReview.extendedMinutes > 0 && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-mono text-xs">
                      +{activeReview.extendedMinutes}m Extended
                    </span>
                  )}
                </div>
              </div>

              {/* Right Quick Controls */}
              <div className="flex flex-col gap-3 min-w-[260px]">
                <span className="text-xs font-cinzel text-[#ffd700] font-bold tracking-wider uppercase">
                  ⚡ QUICK TIME EXTENSION:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleExtendTime(activeReview._id, mins)}
                      disabled={actionLoading}
                      className="px-2 py-2 rounded-lg bg-[#0e2236] hover:bg-[#ffd700] text-[#ffd700] hover:text-black border border-[#ffd700]/50 font-mono font-bold text-xs transition-all cursor-pointer shadow-sm disabled:opacity-50"
                      title={`Add ${mins} minutes to this round`}
                    >
                      +{mins}m
                    </button>
                  ))}
                </div>

                {/* Status Toggles */}
                <div className="flex items-center gap-2 mt-1">
                  {activeReview.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleUpdateStatus(activeReview._id, 'PAUSED')}
                      disabled={actionLoading}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/50 text-amber-300 font-cinzel font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>PAUSE</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(activeReview._id, 'ACTIVE')}
                      disabled={actionLoading}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-green-950/60 hover:bg-green-900 border border-green-500/50 text-green-300 font-cinzel font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>RESUME</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleUpdateStatus(activeReview._id, 'COMPLETED')}
                    disabled={actionLoading}
                    className="py-1.5 px-3 rounded-lg bg-blue-950/60 hover:bg-blue-900 border border-blue-500/50 text-cyan-300 font-cinzel font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CONCLUDE</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(activeReview)}
                    className="py-1.5 px-3 rounded-lg bg-[#0c1e2d] hover:bg-[#1a3854] border border-[#3b4c60] text-gray-300 font-cinzel font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>EDIT</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Broadcast Announcement Input */}
            <div className="mt-5 pt-4 border-t border-[#1f3347] flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={quickAnnouncement}
                  onChange={(e) => setQuickAnnouncement(e.target.value)}
                  placeholder="Broadcast live announcement to countdown screen (e.g. 'Jury visiting Bay 1 & 2 now!')..."
                  className="w-full bg-[#040a12] border border-[#2b3d52] focus:border-[#ffd700] rounded-xl px-4 py-2 text-xs font-cinzel text-white outline-none"
                />
              </div>
              <button
                onClick={handleUpdateQuickAnnouncement}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#ffd700] hover:bg-[#ffe066] text-black font-cinzel font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap shadow-md disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>BROADCAST TO SCREEN</span>
              </button>
            </div>
          </div>
        )}

        {/* Master Review Schedule Table */}
        <div className="bg-[#08121a] border border-[#3a2e1d] rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-cinzel font-bold text-base sm:text-lg text-white">
                ALL REVIEW SCHEDULE MILESTONES
              </h2>
              <p className="font-cinzel text-xs text-[#e5c158]">
                Full timeline of evaluation rounds for the 24-hour hackathon
              </p>
            </div>
            <span className="font-mono text-xs text-gray-400">
              Total {reviews.length} Rounds
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#3a2e1d] text-[#e5c158] uppercase bg-[#04090f] font-cinzel">
                  <th className="py-3 px-4">ROUND</th>
                  <th className="py-3 px-4">REVIEW TITLE</th>
                  <th className="py-3 px-4">TIMING WINDOW</th>
                  <th className="py-3 px-4">VENUE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a2e1d]/60">
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400 font-cinzel">
                      No review rounds recorded yet. Click "Add New Review" to set up your first round.
                    </td>
                  </tr>
                )}
                {reviews.map((rev) => {
                  const isCurrent = activeReview && activeReview._id === rev._id;
                  return (
                    <tr
                      key={rev._id}
                      className={`hover:bg-[#0c1e2d]/50 transition-colors ${
                        isCurrent ? 'bg-[#0f2336]/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#ffd700]">
                        Round {rev.roundNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold">{rev.title}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#ffd700] text-black font-cinzel font-black">
                              LIVE
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-300">
                        {formatDisplayTime(rev.startTime)} → {formatDisplayTime(rev.endTime)}
                      </td>

                      <td className="py-3.5 px-4 text-gray-400">
                        {rev.venue || 'Labs'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-cinzel font-bold ${
                          rev.status === 'ACTIVE'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : rev.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : rev.status === 'PAUSED'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {rev.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {!isCurrent && (
                            <button
                              onClick={() => handleSetActive(rev._id, rev.title)}
                              disabled={actionLoading}
                              className="px-2.5 py-1 rounded-lg bg-[#ffd700]/20 hover:bg-[#ffd700] text-[#ffd700] hover:text-black border border-[#ffd700]/50 font-cinzel font-bold text-[11px] transition-colors cursor-pointer"
                              title="Set as active countdown review"
                            >
                              MAKE LIVE
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEditModal(rev)}
                            className="p-1.5 rounded-lg bg-[#0e1f30] hover:bg-[#1a3854] text-gray-300 hover:text-white border border-[#233547] transition-colors cursor-pointer"
                            title="Edit Timing & Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteReview(rev._id, rev.title)}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CREATE / EDIT REVIEW MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#08121a] border-2 border-[#ffd700] rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.25)] flex flex-col max-h-[90vh]">
            <div className="bg-[#0e1d2c] px-6 py-4 border-b border-[#ffd700]/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-5 h-5 text-[#ffd700]" />
                <h3 className="font-cinzel font-black text-base text-white tracking-wider">
                  {editingReview ? 'EDIT REVIEW MILESTONE' : 'CREATE REVIEW MILESTONE'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 overflow-y-auto space-y-4">
              {/* Title & Round Number */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-cinzel text-gray-300 uppercase mb-1">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Review 1: Ideation & Architecture"
                    className="w-full bg-[#04090e] border border-[#2b3c4f] focus:border-[#ffd700] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-gray-300 uppercase mb-1">
                    Round #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.roundNumber}
                    onChange={(e) => setFormData({ ...formData, roundNumber: e.target.value })}
                    className="w-full bg-[#04090e] border border-[#2b3c4f] focus:border-[#ffd700] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Timing Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel text-[#ffd700] uppercase mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-[#04090e] border border-[#ffd700]/50 focus:border-[#ffd700] rounded-xl px-3.5 py-2 text-xs text-[#ffd700] font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-[#ffd700] uppercase mb-1">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-[#04090e] border border-[#ffd700]/50 focus:border-[#ffd700] rounded-xl px-3.5 py-2 text-xs text-[#ffd700] font-mono outline-none"
                  />
                </div>
              </div>

              {/* Venue & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel text-gray-300 uppercase mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Respective Team Bays / Software Labs"
                    className="w-full bg-[#04090e] border border-[#2b3c4f] focus:border-[#ffd700] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-gray-300 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#04090e] border border-[#2b3c4f] focus:border-[#ffd700] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ACTIVE">ACTIVE (In Progress)</option>
                    <option value="PAUSED">PAUSED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              {/* Guidelines / Description */}
              <div>
                <label className="block text-xs font-cinzel text-gray-300 uppercase mb-1">
                  Rubric & Evaluation Guidelines
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Criteria: 5 min presentation + 3 min Q&A. Focus on database model, architecture, and live prototype..."
                  className="w-full bg-[#04090e] border border-[#2b3c4f] focus:border-[#ffd700] rounded-xl px-3.5 py-2 text-xs text-gray-200 font-mono outline-none"
                />
              </div>

              {/* Live Announcement */}
              <div>
                <label className="block text-xs font-cinzel text-[#ffd700] uppercase mb-1">
                  Announcement Banner (Shown on Countdown Screen)
                </label>
                <input
                  type="text"
                  value={formData.announcement}
                  onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                  placeholder="e.g. Jury visiting Bays 1 and 2 now. Have your slides and terminals ready!"
                  className="w-full bg-[#04090e] border border-[#ffd700]/40 focus:border-[#ffd700] rounded-xl px-3.5 py-2 text-xs text-[#ffd700] font-mono outline-none"
                />
              </div>

              {/* Is Current Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isCurrentCheck"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="w-4 h-4 accent-[#ffd700] cursor-pointer"
                />
                <label htmlFor="isCurrentCheck" className="text-xs font-cinzel text-white cursor-pointer">
                  Make this the active live review now (Countdown clock will point to this round)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#1e2e40] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-cinzel text-xs cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#ffd700] hover:bg-[#ffe066] text-black font-cinzel font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingReview ? 'UPDATE REVIEW' : 'CREATE REVIEW'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
