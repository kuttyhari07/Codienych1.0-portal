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
    <div className="min-h-screen bg-[#050b07] text-white pb-20">
      <AdminNavbar title="STUDENT ID CARDS" showBack={true} backTo="/admin" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#0a140e] border border-[#1b3524] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#050b07] border-b border-[#1b3524] text-gray-400 uppercase">
                  <th className="py-4 px-4">PARTICIPANT</th>
                  <th className="py-4 px-4">ROLE</th>
                  <th className="py-4 px-4">STUDENT ID</th>
                  <th className="py-4 px-4">COLLEGE / DEPT</th>
                  <th className="py-4 px-4">ID CARD PHOTO</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b3524]/60">
                {loading ? (
                  <tr><td colSpan="7" className="py-8 text-center text-gray-500">LOADING PARTICIPANTS...</td></tr>
                ) : participants.length === 0 ? (
                  <tr><td colSpan="7" className="py-8 text-center text-gray-500">NO PARTICIPANTS FOUND.</td></tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p._id} className="hover:bg-[#0f1e14]/50">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{p.fullName}</div>
                        <div className="text-[10px] text-gray-400">{p.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#00ff66]">{p.role}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-200">{p.studentId}</td>
                      <td className="py-3.5 px-4 text-gray-300">
                        <div>{p.college}</div>
                        <div className="text-[10px] text-gray-500">{p.department} ({p.year})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <a href={assetUrl(p.idCardUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-[#00ff66] hover:underline">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>VIEW ID CARD</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.verificationStatus === 'VERIFIED'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/40'
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
                            className="px-3 py-1 bg-[#00ff66] text-black font-orbitron font-bold text-[10px] rounded hover:bg-[#10b981] hover:text-white"
                          >
                            VERIFY
                          </button>
                        </div>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="Rejection reason..."
                            value={rejectionReasons[p._id] || ''}
                            onChange={(e) => setRejectionReasons({ ...rejectionReasons, [p._id]: e.target.value })}
                            className="bg-[#050b07] border border-[#1b3524] px-2 py-1 text-[10px] text-white rounded outline-none"
                          />
                          <button
                            onClick={() => handleReject(p._id)}
                            className="px-2 py-1 bg-red-950 text-red-300 font-bold text-[10px] rounded hover:bg-red-900 border border-red-500/50"
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
