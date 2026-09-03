import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, CreditCard, CheckCircle, Clock, XCircle, DollarSign, FileCheck, Download, ShieldCheck, ArrowRight } from 'lucide-react';
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
      <div className="min-h-screen bg-[#050b07] text-white flex items-center justify-center font-mono">
        LOADING DASHBOARD METRICS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b07] text-white pb-20">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Header & Download Details Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white">
              OPERATIONAL OVERVIEW
            </h1>
            <p className="font-mono text-xs text-gray-400 mt-0.5">
              Live registration and payment metrics
            </p>
          </div>

          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white hover:bg-gray-200 text-black font-mono font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all cursor-pointer flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'DOWNLOADING...' : 'DOWNLOAD DETAILS (EXCEL / HTML)'}</span>
          </button>
        </div>

        {/* Stats Cards Matrix */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
            <div className="bg-[#0a140e] border border-[#1b3524] rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-gray-400 uppercase">TOTAL TEAMS</span>
                <Users className="w-5 h-5 text-[#00ff66]" />
              </div>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-white">
                {stats.totalTeams}
              </div>
            </div>

            <div className="bg-[#0a140e] border border-[#1b3524] rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-gray-400 uppercase">TOTAL PARTICIPANTS</span>
                <Users className="w-5 h-5 text-[#10b981]" />
              </div>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-[#10b981]">
                {stats.totalParticipants}
              </div>
            </div>

            <div className="bg-[#0a140e] border border-amber-500/40 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-amber-400 uppercase">PENDING PAYMENTS</span>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-amber-400">
                {stats.pendingPayments}
              </div>
            </div>

            <div className="bg-[#0a140e] border border-[#00ff66]/50 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-[#00ff66] uppercase">VERIFIED PAYMENTS</span>
                <CheckCircle className="w-5 h-5 text-[#00ff66]" />
              </div>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-[#00ff66]">
                {stats.verifiedPayments}
              </div>
            </div>

            <div className="bg-[#0a140e] border border-red-500/40 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-red-400 uppercase">REJECTED PAYMENTS</span>
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-red-400">
                {stats.rejectedPayments}
              </div>
            </div>

            <div className="bg-[#0a140e] border border-[#00ff66] rounded-xl p-5 shadow-[0_0_15px_rgba(0,255,102,0.2)]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-gray-300 uppercase">TOTAL COLLECTION</span>
                <DollarSign className="w-5 h-5 text-[#00ff66]" />
              </div>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-[#00ff66] neon-glow-green">
                ₹{stats.totalCollection}
              </div>
            </div>

            <div className="bg-[#0a140e] border border-[#1b3524] rounded-xl p-5 sm:col-span-2">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-gray-400 uppercase">PENDING ID VERIFICATIONS</span>
                <FileCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-amber-400">
                {stats.pendingIdVerifications} ID Cards Pending
              </div>
            </div>
          </div>
        )}

        {/* Recent Registrations Table */}
        <div className="bg-[#0a140e] border border-[#1b3524] rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-orbitron font-bold text-base sm:text-lg text-white">RECENT REGISTRATIONS</h2>
              <p className="font-mono text-[11px] text-gray-400">Review, verify payments and approve student IDs</p>
            </div>
            <Link to="/admin/registrations" className="font-mono text-xs text-[#00ff66] hover:underline flex items-center space-x-1">
              <span>VIEW ALL TEAMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1b3524] text-gray-400 uppercase bg-[#050b07]">
                  <th className="py-3 px-4">REG ID</th>
                  <th className="py-3 px-4">TEAM NAME</th>
                  <th className="py-3 px-4">SIZE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b3524]/60">
                {stats && stats.recentRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-gray-400">
                      No registrations recorded yet.
                    </td>
                  </tr>
                )}
                {stats && stats.recentRegistrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-[#0f1e14]/50 transition-colors">
                    <td className="py-3.5 px-4 text-[#00ff66] font-bold">{reg.registrationId}</td>
                    <td className="py-3.5 px-4 text-white font-bold">{reg.teamName}</td>
                    <td className="py-3.5 px-4 text-gray-300">{reg.teamSize}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        reg.status === 'REGISTRATION CONFIRMED'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
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
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#00ff66] hover:bg-[#10b981] text-black font-orbitron font-bold text-[11px] transition-all shadow-[0_0_10px_rgba(0,255,102,0.3)]"
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
