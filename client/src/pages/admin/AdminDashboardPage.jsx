import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, CreditCard, CheckCircle, Clock, XCircle, DollarSign, FileCheck, 
  Download, ShieldCheck, ArrowRight, Anchor, Search, Send, MessageSquare, 
  AlertTriangle, Check, Loader2, Sparkles, X 
} from 'lucide-react';
import api, { apiUrl } from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // WhatsApp Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState(null);
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [broadcastLimit, setBroadcastLimit] = useState('240');
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
      try {
        const revRes = await api.get('/reviews/active');
        if (revRes.data.success) {
          setReviewData(revRes.data.data);
        }
      } catch (e) {}
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Failed to load dashboard metrics.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apiUrl('/api/admin/export-report'), {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CODIENYCH_1.0_Attendance_Master_Sheet_${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error downloading report: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadCsvReport = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apiUrl('/api/admin/export-report?format=csv'), {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate CSV report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CODIENYCH_1.0_Attendance_Sheet_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error downloading CSV report: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const fetchBroadcastStatus = async () => {
    try {
      setBroadcastLoading(true);
      const res = await api.get('/admin/whatsapp-broadcast/status');
      if (res.data.success) {
        setBroadcastStatus(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load broadcast status:', err);
    } finally {
      setBroadcastLoading(false);
    }
  };

  const handleStartBroadcast = async () => {
    const targetLabel = broadcastTarget === 'members' 
      ? 'TEAM MEMBERS ONLY' 
      : broadcastTarget === 'leaders' 
      ? 'TEAM LEADERS ONLY' 
      : 'ALL PARTICIPANTS (LEADERS + MEMBERS)';
      
    if (!window.confirm(`Are you sure you want to broadcast the WhatsApp Fleet link to ${targetLabel}?`)) {
      return;
    }

    try {
      setBroadcasting(true);
      setBroadcastResult(null);
      const res = await api.post('/admin/whatsapp-broadcast/send', {
        target: broadcastTarget,
        limit: broadcastLimit ? parseInt(broadcastLimit, 10) : null,
      });

      if (res.data.success) {
        setBroadcastResult(res.data.data);
        await fetchBroadcastStatus();
      }
    } catch (err) {
      alert('Broadcast dispatch failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setBroadcasting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03070b] text-[#ffd700] flex items-center justify-center font-cinzel tracking-wider text-sm">
        DECIPHERING HIGH SEAS MANIFEST...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] pb-20 relative overflow-hidden">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Header & Download Details Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-cinzel font-extrabold text-xl sm:text-2xl text-white tracking-wide">
              FLEET OPERATIONAL OVERVIEW
            </h1>
            <p className="font-cinzel text-xs text-[#e5c158] mt-0.5">
              Live registration manifests and treasury metrics
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/admin/reviews"
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] via-[#e5c158] to-[#d4af37] text-black font-cinzel font-black text-xs rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.35)] hover:brightness-110 transition-all cursor-pointer flex-shrink-0 uppercase tracking-wider"
              title="Manage review schedule, timings, and stage countdown"
            >
              <Clock className="w-4 h-4 text-black" />
              <span>REVIEW TIMINGS & TIMER</span>
            </Link>

            <button
              onClick={() => {
                setShowBroadcastModal(true);
                fetchBroadcastStatus();
              }}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54] hover:from-[#2ef075] hover:to-[#17ad9b] text-white font-cinzel font-black text-xs rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all cursor-pointer flex-shrink-0 uppercase tracking-wider"
              title="Broadcast WhatsApp link to all participants"
            >
              <Send className="w-4 h-4 text-white" />
              <span>BROADCAST WHATSAPP LINK</span>
            </button>

            <button
              onClick={handleDownloadCsvReport}
              disabled={downloading}
              className="inline-flex items-center justify-center space-x-2 px-3.5 py-2.5 bg-[#0c1e2d] hover:bg-[#152e46] border border-[#00e5ff]/50 text-[#00e5ff] font-cinzel font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex-shrink-0 uppercase tracking-wider"
              title="Download direct spreadsheet CSV"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'EXPORTING...' : 'EXPORT CSV'}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              disabled={downloading}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all cursor-pointer flex-shrink-0 uppercase tracking-wider"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'EXPORTING...' : 'EXPORT LOG (EXCEL / HTML)'}</span>
            </button>
          </div>
        </div>

        {/* Live Review Chronometer Telemetry Widget */}
        {reviewData?.activeReview && (
          <div className="bg-gradient-to-r from-[#0d1e2e] via-[#091522] to-[#0a1827] border-2 border-[#ffd700]/70 rounded-2xl p-4 sm:p-5 mb-8 shadow-[0_0_25px_rgba(255,215,0,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/40 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#ffd700] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#00e5ff] font-bold uppercase tracking-wider">
                    STAGE CHRONOMETER • ROUND {reviewData.activeReview.roundNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    reviewData.activeReview.status === 'ACTIVE'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {reviewData.activeReview.status}
                  </span>
                </div>
                <h3 className="font-pirate text-lg sm:text-xl text-white">
                  {reviewData.activeReview.title}
                </h3>
                <p className="text-xs font-cinzel text-gray-400">
                  Window: {new Date(reviewData.activeReview.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(reviewData.activeReview.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({reviewData.activeReview.venue || 'Labs'})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <Link
                to="/admin/reviews"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f39c12] text-black font-cinzel font-bold text-xs flex items-center space-x-1.5 hover:brightness-110 shadow-md transition-all"
              >
                <Clock className="w-3.5 h-3.5 text-black" />
                <span>CONFIGURE TIMING →</span>
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards Matrix */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
            <div className="bg-[#08121a] border border-[#3a2e1d] rounded-xl p-5 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-xs text-gray-400 uppercase">TOTAL FLEETS</span>
                <Users className="w-5 h-5 text-[#ffd700]" />
              </div>
              <div className="font-pirate font-black text-3xl sm:text-4xl text-[#ffd700] pirate-gold-glow">
                {stats.totalTeams}
              </div>
            </div>

            <div className="bg-[#08121a] border border-[#3a2e1d] rounded-xl p-5 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-xs text-gray-400 uppercase">TOTAL PIRATES</span>
                <Users className="w-5 h-5 text-[#e5c158]" />
              </div>
              <div className="font-pirate font-black text-3xl sm:text-4xl text-[#e5c158]">
                {stats.totalParticipants}
              </div>
            </div>

            <div className="bg-[#08121a] border border-amber-500/40 rounded-xl p-5 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-xs text-amber-400 uppercase">PENDING TRIBUTES</span>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="font-pirate font-black text-3xl sm:text-4xl text-amber-400">
                {stats.pendingPayments}
              </div>
            </div>

            <div className="bg-[#08121a] border border-[#ffd700]/50 rounded-xl p-5 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-xs text-[#ffd700] uppercase">VERIFIED TRIBUTES</span>
                <CheckCircle className="w-5 h-5 text-[#ffd700]" />
              </div>
              <div className="font-pirate font-black text-3xl sm:text-4xl text-[#ffd700]">
                {stats.verifiedPayments}
              </div>
            </div>

            <div className="bg-[#08121a] border border-red-500/40 rounded-xl p-5 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-xs text-red-400 uppercase">REJECTED TRIBUTES</span>
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="font-pirate font-black text-3xl sm:text-4xl text-red-400">
                {stats.rejectedPayments}
              </div>
            </div>

            <div className="bg-[#08121a] border border-[#ffd700] rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-xs text-gray-300 uppercase">TREASURY COLLECTION</span>
                <DollarSign className="w-5 h-5 text-[#ffd700]" />
              </div>
              <div className="font-pirate font-black text-3xl sm:text-4xl text-[#ffd700] pirate-gold-glow">
                ₹{stats.totalCollection}
              </div>
            </div>

            <div className="bg-[#08121a] border border-[#3a2e1d] rounded-xl p-5 sm:col-span-2 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-cinzel text-xs text-gray-400 uppercase">PENDING PASS VERIFICATIONS</span>
                <FileCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div className="font-cinzel font-bold text-xl sm:text-2xl text-amber-300">
                {stats.pendingIdVerifications} ID Cards Pending Review
              </div>
            </div>
          </div>
        )}

        {/* All Fleet Registrations Manifest Table */}
        {(() => {
          const allRegistrations = stats?.recentRegistrations || [];
          const displayedRegistrations = allRegistrations.filter((reg) => {
            if (!searchTerm.trim()) return true;
            const term = searchTerm.toLowerCase().trim();
            return (
              (reg.registrationId && reg.registrationId.toLowerCase().includes(term)) ||
              (reg.teamName && reg.teamName.toLowerCase().includes(term)) ||
              (reg.status && reg.status.toLowerCase().includes(term))
            );
          });

          return (
            <div className="bg-[#08121a] border border-[#3a2e1d] rounded-xl p-4 sm:p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-cinzel font-bold text-base sm:text-lg text-white">FLEET MANIFEST LOGS</h2>
                    {stats && stats.recentRegistrations && (
                      <span className="px-2.5 py-0.5 text-[11px] font-bold font-mono rounded-full bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40">
                        {stats.recentRegistrations.length} {stats.recentRegistrations.length === 1 ? 'TEAM' : 'TEAMS'}
                      </span>
                    )}
                  </div>
                  <p className="font-cinzel text-[11px] text-[#e5c158]">All registered fleets, tributes, and approval manifests</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Filter by name, ID, status..."
                      className="bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-xl pl-9 pr-7 py-1.5 text-xs text-[#f4e6c3] font-mono outline-none w-48 sm:w-64 transition-all"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2.5 top-1.5 text-xs text-gray-400 hover:text-white"
                        title="Clear filter"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <Link to="/admin/registrations" className="font-cinzel text-xs text-[#ffd700] hover:underline flex items-center space-x-1 whitespace-nowrap">
                    <span>VIEW ALL FLEETS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-[#3a2e1d] text-[#e5c158] uppercase bg-[#04090f] font-cinzel">
                      <th className="py-3 px-4">REG ID</th>
                      <th className="py-3 px-4">FLEET NAME</th>
                      <th className="py-3 px-4">SIZE</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">DATE</th>
                      <th className="py-3 px-4 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3a2e1d]/60">
                    {displayedRegistrations.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-gray-400 font-cinzel">
                          {searchTerm ? 'No fleet matches your search filter.' : 'No fleet registrations recorded yet.'}
                        </td>
                      </tr>
                    )}
                    {displayedRegistrations.map((reg) => (
                      <tr key={reg._id} className="hover:bg-[#0c1e2d]/50 transition-colors">
                        <td className="py-3.5 px-4 text-[#ffd700] font-bold">{reg.registrationId}</td>
                        <td className="py-3.5 px-4 text-white font-bold">{reg.teamName}</td>
                        <td className="py-3.5 px-4 text-gray-300">{reg.teamSize}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-cinzel font-bold ${
                            reg.status === 'REGISTRATION CONFIRMED'
                              ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/30'
                              : reg.status === 'REJECTED'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-400">{new Date(reg.createdAt).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4 text-center">
                          <Link
                            to={`/admin/registrations/${reg._id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-[11px] transition-all shadow-[0_0_10px_rgba(255,215,0,0.3)] cursor-pointer uppercase tracking-wider"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>REVIEW & VERIFY</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </main>

      {/* WhatsApp Fleet Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#08121a] border-2 border-[#25D366]/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(37,211,102,0.25)] flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#0b1b13] px-6 py-4 border-b border-[#25D366]/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center">
                  <Send className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-cinzel font-black text-lg text-white tracking-wider flex items-center space-x-2">
                    <span>WHATSAPP FLEET BROADCAST</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 uppercase font-mono">
                      LEADERS + MEMBERS
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Dispatch official WhatsApp community join invitation to all participants
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {broadcastLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#25D366] animate-spin" />
                  <p className="text-xs font-cinzel text-gray-400">Scanning fleet manifest & Brevo quota...</p>
                </div>
              ) : broadcastStatus ? (
                <>
                  {/* Status Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#04090e] border border-[#243447] rounded-xl p-3 text-center">
                      <span className="text-[11px] font-cinzel text-gray-400 uppercase block">Total Pirates</span>
                      <span className="text-xl font-pirate font-black text-[#ffd700] mt-1 block">
                        {broadcastStatus.totalParticipants}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {broadcastStatus.totalLeaders} Lead / {broadcastStatus.totalMembers} Mem
                      </span>
                    </div>

                    <div className="bg-[#04090e] border border-green-500/30 rounded-xl p-3 text-center">
                      <span className="text-[11px] font-cinzel text-green-400 uppercase block">Already Sent</span>
                      <span className="text-xl font-pirate font-black text-green-400 mt-1 block">
                        {broadcastStatus.sentCount}
                      </span>
                      <span className="text-[10px] text-gray-500">Zero Duplicates</span>
                    </div>

                    <div className="bg-[#04090e] border border-amber-500/30 rounded-xl p-3 text-center">
                      <span className="text-[11px] font-cinzel text-amber-400 uppercase block">Pending Members</span>
                      <span className="text-xl font-pirate font-black text-amber-400 mt-1 block">
                        {broadcastStatus.pendingMembers}
                      </span>
                      <span className="text-[10px] text-amber-500/70 font-semibold">Priority Target</span>
                    </div>

                    <div className="bg-[#04090e] border border-[#00e5ff]/30 rounded-xl p-3 text-center">
                      <span className="text-[11px] font-cinzel text-[#00e5ff] uppercase block">Brevo Credits</span>
                      <span className="text-xl font-pirate font-black text-[#00e5ff] mt-1 block">
                        {broadcastStatus.brevoCredits}
                      </span>
                      <span className="text-[10px] text-gray-500">Daily Free Limit</span>
                    </div>
                  </div>

                  {/* Target Selector */}
                  <div className="bg-[#04090e] border border-[#243447] rounded-xl p-4 space-y-3">
                    <label className="text-xs font-cinzel font-bold text-[#ffd700] uppercase tracking-wider block">
                      Select Broadcast Target:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <label className={`flex items-center space-x-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        broadcastTarget === 'all' 
                          ? 'bg-[#25D366]/15 border-[#25D366] text-white font-bold' 
                          : 'bg-[#08121a] border-[#1e293b] text-gray-400 hover:border-gray-600'
                      }`}>
                        <input
                          type="radio"
                          name="target"
                          value="all"
                          checked={broadcastTarget === 'all'}
                          onChange={() => setBroadcastTarget('all')}
                          className="text-[#25D366] focus:ring-0"
                        />
                        <span>All Pirates ({broadcastStatus.pendingTotal})</span>
                      </label>

                      <label className={`flex items-center space-x-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        broadcastTarget === 'members' 
                          ? 'bg-[#25D366]/15 border-[#25D366] text-white font-bold' 
                          : 'bg-[#08121a] border-[#1e293b] text-gray-400 hover:border-gray-600'
                      }`}>
                        <input
                          type="radio"
                          name="target"
                          value="members"
                          checked={broadcastTarget === 'members'}
                          onChange={() => setBroadcastTarget('members')}
                          className="text-[#25D366] focus:ring-0"
                        />
                        <span>Members Only ({broadcastStatus.pendingMembers})</span>
                      </label>

                      <label className={`flex items-center space-x-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        broadcastTarget === 'leaders' 
                          ? 'bg-[#25D366]/15 border-[#25D366] text-white font-bold' 
                          : 'bg-[#08121a] border-[#1e293b] text-gray-400 hover:border-gray-600'
                      }`}>
                        <input
                          type="radio"
                          name="target"
                          value="leaders"
                          checked={broadcastTarget === 'leaders'}
                          onChange={() => setBroadcastTarget('leaders')}
                          className="text-[#25D366] focus:ring-0"
                        />
                        <span>Leaders Only ({broadcastStatus.pendingLeaders})</span>
                      </label>
                    </div>
                  </div>

                  {/* Batch Limit & Quota Advisory */}
                  <div className="bg-[#04090e] border border-[#243447] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <label className="text-xs font-cinzel font-bold text-gray-300 uppercase tracking-wider block">
                        Batch Dispatch Limit:
                      </label>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Set max emails to send in this run (safely controlled)
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={broadcastLimit}
                        onChange={(e) => setBroadcastLimit(e.target.value)}
                        className="bg-[#08121a] border border-[#3b4b5e] text-white text-xs rounded-lg px-3 py-2 font-mono focus:border-[#25D366] outline-none cursor-pointer"
                      >
                        <option value="50">50 emails</option>
                        <option value="100">100 emails</option>
                        <option value="200">200 emails</option>
                        <option value="240">240 emails (Full Daily Quota)</option>
                        <option value="">All Pending</option>
                      </select>
                    </div>
                  </div>

                  {/* Broadcast Result Banner */}
                  {broadcastResult && (
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      broadcastResult.quotaHit 
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
                        : 'bg-green-950/40 border-green-500/50 text-green-200'
                    }`}>
                      <div className="font-bold font-cinzel text-sm mb-1 flex items-center space-x-2">
                        {broadcastResult.quotaHit ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : <CheckCircle className="w-4 h-4 text-green-400" />}
                        <span>{broadcastResult.quotaHit ? 'DAILY BREVO QUOTA REACHED' : 'BROADCAST BATCH COMPLETED'}</span>
                      </div>
                      <p>
                        Successfully delivered: <strong>{broadcastResult.sentCount}</strong> emails. 
                        Failed/Skipped: <strong>{broadcastResult.failedCount}</strong>. 
                        Remaining in queue: <strong>{broadcastResult.totalRemaining}</strong> participants.
                      </p>
                      {broadcastResult.quotaHit && (
                        <p className="text-amber-400 mt-1.5 font-sans">
                          💡 The Brevo daily free limit has been reached for today. Quota resets daily at 00:00 UTC (5:30 AM IST). You can click Broadcast again tomorrow and it will seamlessly finish the rest without duplicating!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Terminal CLI hint */}
                  <div className="p-3 bg-[#03070b] border border-gray-800 rounded-lg text-[11px] text-gray-400 font-mono">
                    <span className="text-[#ffd700]">💻 Terminal Alternative:</span>
                    <span className="ml-2 text-gray-300">node server/scripts/broadcastWhatsAppInvite.js --target=members</span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-red-400">Failed to load broadcast information.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#0b1b13] px-6 py-4 border-t border-[#25D366]/30 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 bg-[#0c1e2d] hover:bg-[#152e46] text-gray-300 font-cinzel font-bold text-xs rounded-xl border border-gray-700 cursor-pointer"
              >
                CLOSE
              </button>

              <button
                type="button"
                disabled={broadcasting || broadcastLoading || (broadcastStatus?.pendingTotal === 0)}
                onClick={handleStartBroadcast}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54] hover:from-[#2ef075] hover:to-[#17ad9b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-cinzel font-black text-xs rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all cursor-pointer uppercase tracking-wider"
              >
                {broadcasting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>TRANSMITTING DISPATCHES...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>LAUNCH BROADCAST NOW</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

