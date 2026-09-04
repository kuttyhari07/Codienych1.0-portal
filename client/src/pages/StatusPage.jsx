import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Shield, Terminal, AlertCircle, CheckCircle, Clock, XCircle, ArrowLeft, MessageCircle, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { EVENT_CONFIG } from '../utils/config';

const StatusPage = () => {
  const [searchParams] = useSearchParams();
  const [registrationId, setRegistrationId] = useState(searchParams.get('id') || '');
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');

  const fetchStatus = async (idToQuery) => {
    const targetId = idToQuery || registrationId;
    if (!targetId || !targetId.trim()) {
      setError('Please enter a valid Registration ID.');
      return;
    }

    setLoading(true);
    setError('');
    setStatusData(null);

    try {
      const response = await api.get(`/registrations/${targetId.trim()}`);
      if (response.data.success) {
        setStatusData(response.data.data);
      } else {
        setError(response.data.message || 'Registration record not found.');
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Registration ID not found. Please verify your ID.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialId = searchParams.get('id');
    if (initialId) {
      fetchStatus(initialId);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStatus();
  };

  return (
    <div className="min-h-screen bg-[#050b07] text-white pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-mono text-[#00ff66] mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO MISSION CONTROL</span>
        </Link>

        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#0f2416] border border-[#10b981] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#00ff66] shadow-[0_0_20px_#00ff66]">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-wider">
            REGISTRATION <span className="text-[#00ff66]">STATUS TRACKER</span>
          </h1>
          <p className="font-mono text-xs text-gray-400 mt-2">
            ENTER YOUR UNIQUE REGISTRATION ID TO CHECK VERIFICATION PROGRESS
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
                placeholder="e.g. CODIENYCH-2026-12345"
                className="w-full bg-[#0a140e] border-2 border-[#1b3524] focus:border-[#00ff66] rounded-xl px-5 py-3.5 text-white font-mono text-sm uppercase tracking-wider outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-8 bg-[#00ff66] hover:bg-[#10b981] text-black font-orbitron font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'SEARCHING...' : 'CHECK STATUS'}</span>
            </button>
          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-sm font-sans flex items-center space-x-3 mb-8">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Card */}
        {statusData && (
          <div className="bg-[#0a140e] border-2 border-[#10b981] rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#1b3524] pb-4 mb-6">
              <div>
                <span className="font-mono text-xs text-gray-400 block">REGISTRATION ID</span>
                <span className="font-orbitron font-bold text-2xl text-[#00ff66] neon-glow-green">
                  {statusData.registrationId}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-gray-400 block">TEAM NAME</span>
                <span className="font-orbitron font-bold text-lg text-white">
                  {statusData.teamName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-sm mb-6">
              <div className="bg-[#050b07] p-4 rounded-xl border border-[#1b3524]">
                <span className="text-gray-400 text-xs block mb-1">TEAM SIZE</span>
                <span className="text-white font-bold">{statusData.teamSize} Members</span>
              </div>

              <div className="bg-[#050b07] p-4 rounded-xl border border-[#1b3524]">
                <span className="text-gray-400 text-xs block mb-1">REGISTRATION DATE</span>
                <span className="text-white">{new Date(statusData.registrationDate).toLocaleDateString()}</span>
              </div>

              <div className="bg-[#050b07] p-4 rounded-xl border border-[#1b3524]">
                <span className="text-gray-400 text-xs block mb-1">PAYMENT STATUS</span>
                <span className={`font-bold inline-block px-2.5 py-0.5 rounded text-xs mt-1 ${
                  statusData.paymentStatus === 'VERIFIED'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                    : statusData.paymentStatus === 'REJECTED'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {statusData.paymentStatus}
                </span>
              </div>

              <div className="bg-[#050b07] p-4 rounded-xl border border-[#1b3524]">
                <span className="text-gray-400 text-xs block mb-1">STUDENT ID VERIFICATION</span>
                <span className="text-[#00ff66] font-bold text-xs">{statusData.participantVerificationProgress}</span>
              </div>
            </div>

            {/* Overall Registration Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center space-x-4 ${
              statusData.registrationStatus === 'REGISTRATION CONFIRMED'
                ? 'bg-[#0f2e1a] border-[#00ff66] text-[#00ff66]'
                : statusData.registrationStatus === 'REJECTED'
                ? 'bg-red-950/40 border-red-500/50 text-red-300'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            }`}>
              {statusData.registrationStatus === 'REGISTRATION CONFIRMED' ? (
                <CheckCircle className="w-8 h-8 flex-shrink-0" />
              ) : statusData.registrationStatus === 'REJECTED' ? (
                <XCircle className="w-8 h-8 flex-shrink-0" />
              ) : (
                <Clock className="w-8 h-8 flex-shrink-0" />
              )}
              <div>
                <span className="font-orbitron font-extrabold text-lg block uppercase tracking-wide">
                  {statusData.registrationStatus}
                </span>
                <p className="font-mono text-xs opacity-80 mt-0.5">
                  {statusData.registrationStatus === 'REGISTRATION CONFIRMED'
                    ? 'Your team is officially registered and confirmed for CODIENYCH 1.0!'
                    : statusData.registrationStatus === 'REJECTED'
                    ? 'Registration was not verified by admin. Please contact support.'
                    : 'Payment or student ID verification is currently pending admin review.'}
                </p>
              </div>
            </div>

            {/* Approved Students: WhatsApp Group Join Card */}
            {statusData.registrationStatus === 'REGISTRATION CONFIRMED' && (
              <div className="mt-6 bg-[#0f2416] border-2 border-[#25D366] rounded-2xl p-6 shadow-[0_0_25px_rgba(37,211,102,0.3)] animate-pulse">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center flex-shrink-0 text-[#25D366]">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-base text-white">
                        OFFICIAL PARTICIPANT COMMUNITY
                      </h3>
                      <p className="font-mono text-xs text-gray-300 mt-0.5">
                        Congratulations! Join the WhatsApp group for hackathon updates, schedule, and team announcements.
                      </p>
                    </div>
                  </div>

                  <a
                    href={EVENT_CONFIG.WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#1ebd59] text-black font-orbitron font-black text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.5)] flex items-center justify-center space-x-2 flex-shrink-0 uppercase tracking-wider"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>JOIN TO WHATSAPP GROUP</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
