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
    <div className="min-h-screen bg-[#050b07] text-white pb-20">
      <AdminNavbar title="TEAM REGISTRATIONS" showBack={true} backTo="/admin" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search & Filter Controls */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Team Name, Leader Name, Email, College, UTR..."
              className="w-full bg-[#0a140e] border border-[#1b3524] focus:border-[#00ff66] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0a140e] border border-[#1b3524] text-gray-300 font-mono text-xs rounded-xl px-4 py-2.5 outline-none"
          >
            <option value="">ALL STATUSES</option>
            <option value="PENDING">PENDING</option>
            <option value="REGISTRATION CONFIRMED">REGISTRATION CONFIRMED</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#00ff66] text-black font-orbitron font-bold text-xs rounded-xl hover:bg-[#10b981] transition-all"
          >
            SEARCH
          </button>
        </form>

        {/* Registrations List */}
        <div className="bg-[#0a140e] border border-[#1b3524] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#050b07] border-b border-[#1b3524] text-gray-400 uppercase">
                  <th className="py-4 px-4">REG ID</th>
                  <th className="py-4 px-4">TEAM NAME</th>
                  <th className="py-4 px-4">SIZE</th>
                  <th className="py-4 px-4">TEAM LEADER</th>
                  <th className="py-4 px-4">COLLEGE</th>
                  <th className="py-4 px-4">PAYMENT</th>
                  <th className="py-4 px-4">ID CARDS</th>
                  <th className="py-4 px-4">REG STATUS</th>
                  <th className="py-4 px-4">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b3524]/60">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-500">
                      LOADING REGISTRATIONS...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-500">
                      NO REGISTRATION RECORDS FOUND.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#0f1e14]/50">
                      <td className="py-3.5 px-4 font-bold text-[#00ff66]">{reg.registrationId}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{reg.teamName}</td>
                      <td className="py-3.5 px-4 text-gray-300">{reg.teamSize}</td>
                      <td className="py-3.5 px-4 text-gray-200">
                        <div>{reg.teamLeader}</div>
                        <div className="text-[10px] text-gray-500">{reg.leaderEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 max-w-[150px] truncate">{reg.college}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          reg.paymentStatus === 'VERIFIED'
                            ? 'bg-green-500/20 text-green-400'
                            : reg.paymentStatus === 'REJECTED'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#00ff66] font-bold">{reg.idVerificationProgress}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#00ff66] hover:bg-[#10b981] text-black font-orbitron font-bold text-[11px] rounded-lg transition-all shadow-[0_0_10px_rgba(0,255,102,0.3)]"
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
