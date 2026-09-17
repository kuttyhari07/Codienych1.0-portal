import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations();
  }, [statusFilter]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const res = await api.get('/admin/registrations', { params });
      if (res.data.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRegistrations();
  };

  return (
    <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] pb-20 relative overflow-hidden">
      <AdminNavbar title="FLEET MANIFEST & REGISTRATIONS" showBack={true} backTo="/admin" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search & Filter Controls */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Fleet Name, Captain, Email, College, UTR..."
              className="w-full bg-[#08121a] border border-[#3a2e1d] focus:border-[#ffd700] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f4e6c3] font-mono outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#08121a] border border-[#3a2e1d] text-[#e5c158] font-cinzel text-xs rounded-xl px-4 py-2.5 outline-none"
          >
            <option value="">ALL STATUSES</option>
            <option value="PENDING">PENDING</option>
            <option value="REGISTRATION CONFIRMED">REGISTRATION CONFIRMED</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] uppercase tracking-wider cursor-pointer"
          >
            SEARCH
          </button>
        </form>

        {/* Registrations List */}
        <div className="bg-[#08121a] border border-[#3a2e1d] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#04090f] border-b border-[#3a2e1d] text-[#e5c158] uppercase font-cinzel">
                  <th className="py-4 px-4">REG ID</th>
                  <th className="py-4 px-4">FLEET NAME</th>
                  <th className="py-4 px-4">DOMAIN / TRACK</th>
                  <th className="py-4 px-4">SIZE</th>
                  <th className="py-4 px-4">CAPTAIN</th>
                  <th className="py-4 px-4">COLLEGE</th>
                  <th className="py-4 px-4">TRIBUTE</th>
                  <th className="py-4 px-4">PASS CARDS</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a2e1d]/60">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-gray-400 font-cinzel">
                      SEARCHING FLEET RECORDS...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-gray-400 font-cinzel">
                      NO FLEET MANIFEST RECORDS FOUND.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#0c1e2d]/50">
                      <td className="py-3.5 px-4 font-bold text-[#ffd700]">{reg.registrationId}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{reg.teamName}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded bg-[#0c1e2d] border border-[#00e5ff]/40 text-[#00e5ff] text-[10px] font-cinzel font-bold whitespace-nowrap inline-block">
                          {reg.domain || 'Not Specified'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">{reg.teamSize}</td>
                      <td className="py-3.5 px-4 text-gray-200">
                        <div className="font-bold">{reg.teamLeader}</div>
                        <div className="text-[10px] text-[#e5c158]">{reg.leaderEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 max-w-[150px] truncate">{reg.college}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-cinzel font-bold ${
                          reg.paymentStatus === 'VERIFIED'
                            ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40'
                            : reg.paymentStatus === 'REJECTED'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#ffd700] font-bold">{reg.idVerificationProgress}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-cinzel font-bold ${
                          reg.registrationStatus === 'REGISTRATION CONFIRMED'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                            : reg.registrationStatus === 'REJECTED'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {reg.registrationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/admin/registrations/${reg.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-[11px] rounded-lg transition-all shadow-[0_0_10px_rgba(255,215,0,0.3)] uppercase tracking-wider"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>REVIEW & VERIFY</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminRegistrationsPage;
