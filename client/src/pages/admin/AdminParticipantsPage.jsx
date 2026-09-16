import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import api, { assetUrl } from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminParticipantsPage = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/participants');
      if (res.data.success) {
        setParticipants(res.data.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      const res = await api.patch(`/admin/participants/${id}/verify`);
      if (res.data.success) {
        fetchParticipants();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification error.');
    }
  };

  const handleReject = async (id) => {
    const reason = rejectionReasons[id];
    if (!reason || !reason.trim()) {
      alert('Rejection reason is mandatory.');
      return;
    }
    try {
      const res = await api.patch(`/admin/participants/${id}/reject`, { rejectionReason: reason });
      if (res.data.success) {
        fetchParticipants();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection error.');
    }
  };

  return (
    <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] pb-20 relative overflow-hidden">
      <AdminNavbar title="CREW ID PASS VERIFICATIONS" showBack={true} backTo="/admin" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#08121a] border border-[#3a2e1d] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#04090f] border-b border-[#3a2e1d] text-[#e5c158] uppercase font-cinzel">
                  <th className="py-4 px-4">PIRATE NAME</th>
                  <th className="py-4 px-4">ROLE</th>
                  <th className="py-4 px-4">STUDENT ID</th>
                  <th className="py-4 px-4">COLLEGE / DEPT</th>
                  <th className="py-4 px-4">PASS PHOTO</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a2e1d]/60">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400 font-cinzel">
                      SEARCHING CREW ROSTER...
                    </td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400 font-cinzel">
                      NO CREW PARTICIPANTS FOUND.
                    </td>
                  </tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p._id} className="hover:bg-[#0c1e2d]/50">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{p.fullName}</div>
                        <div className="text-[10px] text-[#e5c158]">{p.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#ffd700] font-cinzel">{p.role}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-200">{p.studentId}</td>
                      <td className="py-3.5 px-4 text-gray-300">
                        <div>{p.college}</div>
                        <div className="text-[10px] text-gray-500">{p.department} ({p.year})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={assetUrl(p.idCardUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[#00e5ff] hover:text-[#ffd700] underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>VIEW PASS CARD</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-cinzel font-bold ${
                          p.verificationStatus === 'VERIFIED'
                            ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40'
                            : p.verificationStatus === 'REJECTED'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {p.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerify(p._id)}
                            className="px-3 py-1 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-[10px] rounded cursor-pointer shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                          >
                            VERIFY PASS
                          </button>
                        </div>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="Rejection reason..."
                            value={rejectionReasons[p._id] || ''}
                            onChange={(e) => setRejectionReasons({ ...rejectionReasons, [p._id]: e.target.value })}
                            className="bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] px-2 py-1 text-[10px] text-white rounded outline-none"
                          />
                          <button
                            onClick={() => handleReject(p._id)}
                            className="px-2 py-1 bg-red-950/80 text-red-300 font-cinzel font-bold text-[10px] rounded hover:bg-red-900 border border-red-500/50 cursor-pointer"
                          >
                            REJECT
                          </button>
                        </div>
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

export default AdminParticipantsPage;
