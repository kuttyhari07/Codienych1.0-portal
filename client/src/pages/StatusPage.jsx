import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Compass, Anchor, AlertCircle, CheckCircle, Clock, XCircle, ArrowLeft, MessageCircle, ExternalLink } from 'lucide-react';
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
        setError(response.data.message || 'Registration record not found on the high seas.');
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
    <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Ambient Ocean Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,45,66,0.25)_0%,rgba(3,7,11,0.95)_100%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-cinzel text-[#ffd700] mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO FLAGSHIP</span>
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#0c1e2d] border border-[#ffd700] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#ffd700] shadow-[0_0_25px_rgba(255,215,0,0.35)]">
            <Compass className="w-9 h-9" />
          </div>
          <h1 className="font-pirate font-black text-4xl sm:text-5xl text-white tracking-wider">
            CREW <span className="text-[#ffd700] pirate-gold-glow">STATUS TRACKER</span>
          </h1>
          <p className="font-cinzel text-xs text-[#e5c158] mt-2 tracking-wider">
            ENTER YOUR REGISTRATION ID TO CHECK VERIFICATION & FLEET ADMISSION
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
                className="w-full bg-[#04090f] border-2 border-[#3a2e1d] focus:border-[#ffd700] rounded-xl px-5 py-3.5 text-[#f4e6c3] font-mono text-sm uppercase tracking-wider outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-8 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'SEEKING...' : 'CHECK STATUS'}</span>
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
          <div className="bg-[#08121a]/95 border-2 border-[#ffd700]/70 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] animate-fadeIn backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[#3a2e1d] pb-4 mb-6">
              <div>
                <span className="font-cinzel text-xs text-gray-400 block">REGISTRATION ID</span>
                <span className="font-pirate font-bold text-3xl text-[#ffd700] pirate-gold-glow">
                  {statusData.registrationId}
                </span>
              </div>
              <div className="text-right">
                <span className="font-cinzel text-xs text-gray-400 block">FLEET NAME</span>
                <span className="font-cinzel font-bold text-lg text-white">
                  {statusData.teamName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-sm mb-6">
              <div className="bg-[#04090f] p-4 rounded-xl border border-[#3a2e1d]">
                <span className="text-gray-400 font-cinzel text-xs block mb-1">CREW SIZE</span>
                <span className="text-white font-bold">{statusData.teamSize} Pirates</span>
              </div>

              <div className="bg-[#04090f] p-4 rounded-xl border border-[#3a2e1d]">
                <span className="text-gray-400 font-cinzel text-xs block mb-1">SIGN-UP DATE</span>
                <span className="text-white">{new Date(statusData.registrationDate).toLocaleDateString()}</span>
              </div>

              <div className="bg-[#04090f] p-4 rounded-xl border border-[#3a2e1d]">
                <span className="text-gray-400 font-cinzel text-xs block mb-1">PAYMENT STATUS</span>
                <span className={`font-bold inline-block px-2.5 py-0.5 rounded text-xs mt-1 font-cinzel ${
                  statusData.paymentStatus === 'VERIFIED'
                    ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40'
                    : statusData.paymentStatus === 'REJECTED'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {statusData.paymentStatus}
                </span>
              </div>

              <div className="bg-[#04090f] p-4 rounded-xl border border-[#3a2e1d]">
                <span className="text-gray-400 font-cinzel text-xs block mb-1">STUDENT ID PASSES</span>
                <span className="text-[#ffd700] font-bold text-xs">{statusData.participantVerificationProgress}</span>
              </div>

              <div className="bg-[#04090f] p-4 rounded-xl border border-[#3a2e1d] sm:col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 font-cinzel text-xs block mb-0.5">CHOSEN TRACK / DOMAIN</span>
                  <span className="text-[#00e5ff] font-bold text-sm font-cinzel">{statusData.domain || 'Not Specified'}</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#0c1e2d] border border-[#00e5ff]/40 text-[#00e5ff] text-[10px] font-cinzel font-bold">
                  EXPEDITION REALM
                </span>
              </div>
            </div>

            {/* Overall Registration Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center space-x-4 ${
              statusData.registrationStatus === 'REGISTRATION CONFIRMED'
                ? 'bg-[#0b2416] border-[#25D366] text-[#25D366]'
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
                <span className="font-cinzel font-extrabold text-lg block uppercase tracking-wide">
                  {statusData.registrationStatus}
                </span>
                <p className="font-cinzel text-xs opacity-80 mt-0.5">
                  {statusData.registrationStatus === 'REGISTRATION CONFIRMED'
                    ? 'Ahoy! Your fleet is officially confirmed and ready to sail for CODIENYCH 1.0!'
                    : statusData.registrationStatus === 'REJECTED'
                    ? 'Registration was not verified by the Admirals. Please contact the organizers.'
                    : 'Tribute payment and pirate student ID cards are currently under Admiral review.'}
                </p>
              </div>
            </div>

            {/* Approved Students: WhatsApp Group Join Card */}
            {statusData.registrationStatus === 'REGISTRATION CONFIRMED' && (
              <div className="mt-6 bg-[#081c16] border-2 border-[#25D366] rounded-2xl p-6 shadow-[0_0_25px_rgba(37,211,102,0.3)] animate-pulse">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center flex-shrink-0 text-[#25D366]">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-cinzel font-bold text-base text-white">
                        OFFICIAL CREW COMMUNITY (WHATSAPP)
                      </h3>
                      <p className="font-cinzel text-xs text-gray-300 mt-0.5">
                        Welcome aboard! Join the official WhatsApp crew for fleet dispatches, hackathon timeline, and announcements.
                      </p>
                    </div>
                  </div>

                  <a
                    href={EVENT_CONFIG.WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#1ebd59] text-black font-cinzel font-black text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.5)] flex items-center justify-center space-x-2 flex-shrink-0 uppercase tracking-wider"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>JOIN WHATSAPP CREW</span>
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
