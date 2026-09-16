import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, CreditCard, CheckCircle, Clock, XCircle, DollarSign, FileCheck, Download, ShieldCheck, ArrowRight, Anchor } from 'lucide-react';
import api, { apiUrl } from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
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
      a.download = `CODIENYCH_1.0_Student_Payment_Details_${new Date().toISOString().slice(0, 10)}.html`;
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

          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all cursor-pointer flex-shrink-0 uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'EXPORTING...' : 'EXPORT LOG (EXCEL / HTML)'}</span>
          </button>
        </div>

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

        {/* Recent Registrations Table */}
        <div className="bg-[#08121a] border border-[#3a2e1d] rounded-xl p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-cinzel font-bold text-base sm:text-lg text-white">RECENT MANIFEST LOGS</h2>
              <p className="font-cinzel text-[11px] text-[#e5c158]">Review fleet tributes, verify payments and approve crew passes</p>
            </div>
            <Link to="/admin/registrations" className="font-cinzel text-xs text-[#ffd700] hover:underline flex items-center space-x-1">
              <span>VIEW ALL FLEETS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
                {stats && stats.recentRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-gray-400 font-cinzel">
                      No fleet registrations recorded yet.
                    </td>
                  </tr>
                )}
                {stats && stats.recentRegistrations.map((reg) => (
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
      </main>
    </div>
  );
};

export default AdminDashboardPage;
