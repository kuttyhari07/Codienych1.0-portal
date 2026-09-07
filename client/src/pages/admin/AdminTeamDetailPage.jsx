import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import api, { assetUrl } from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminTeamDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentRejectionReason, setPaymentRejectionReason] = useState('');
  const [participantRejectionReasons, setParticipantRejectionReasons] = useState({});
  const [actionMessage, setActionMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamDetail();
  }, [id]);

  const fetchTeamDetail = async () => {
    try {
      const res = await api.get(`/admin/registrations/${id}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Payment Verify / Reject
  const handleVerifyPayment = async () => {
    if (!data || !data.payment) return;
    try {
      const res = await api.patch(`/admin/payments/${data.payment._id}/verify`);
      if (res.data.success) {
        setActionMessage('Payment verified successfully.');
        fetchTeamDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error verifying payment.');
    }
  };

  const handleRejectPayment = async () => {
    if (!data || !data.payment) return;
    if (!paymentRejectionReason.trim()) {
      alert('Rejection reason is mandatory when rejecting payment.');
      return;
    }
    try {
      const res = await api.patch(`/admin/payments/${data.payment._id}/reject`, {
        rejectionReason: paymentRejectionReason,
      });
      if (res.data.success) {
        setActionMessage('Payment rejected.');
        fetchTeamDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting payment.');
    }
  };

  // Participant ID Verify / Reject
  const handleVerifyParticipant = async (participantId) => {
    try {
      const res = await api.patch(`/admin/participants/${participantId}/verify`);
      if (res.data.success) {
        setActionMessage('Participant ID card verified.');
        fetchTeamDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error verifying participant.');
    }
  };

  const handleRejectParticipant = async (participantId) => {
    const reason = participantRejectionReasons[participantId];
    if (!reason || !reason.trim()) {
      alert('Rejection reason is mandatory when rejecting an ID card.');
      return;
    }
    try {
      const res = await api.patch(`/admin/participants/${participantId}/reject`, {
        rejectionReason: reason,
      });
      if (res.data.success) {
        setActionMessage('Participant ID card rejected.');
        fetchTeamDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting participant.');
    }
  };

  const [emailStatusModal, setEmailStatusModal] = useState(null);

  // 1-Click Approve Entire Team & Send Confirmation Email
  const handleApproveEntireTeam = async () => {
    if (!window.confirm(`Approve Team ${data.registration.teamName} and send official Confirmation Email to Team Leader?`)) return;
    try {
      const res = await api.patch(`/admin/registrations/${id}/approve-team`);
      if (res.data.success) {
        setActionMessage(res.data.message || 'Team approved and confirmation email sent!');
        setEmailStatusModal({
          type: res.data.emailSent ? 'SUCCESS' : 'WARNING',
          title: res.data.emailSent ? 'CONFIRMATION EMAIL DELIVERED! 📨' : 'TEAM APPROVED (EMAIL NOTICE)',
          message: res.data.emailSent
            ? `Official Registration Confirmation Email has been successfully sent from codienych@gmail.com to Team Leader (${data.participants?.find(p => p.role === 'LEADER')?.email || 'Leader'})!`
            : `Team status was updated to CONFIRMED, but the confirmation email could not be sent. Please check your SMTP configuration in Render dashboard.`,
        });
        fetchTeamDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving team.');
    }
  };

  const handleRejectEntireTeam = async () => {
    const reason = prompt('Enter mandatory reason for rejecting this team registration:');
    if (!reason || !reason.trim()) {
      alert('Rejection reason is mandatory.');
      return;
    }
    try {
      const res = await api.patch(`/admin/registrations/${id}/reject-team`, { rejectionReason: reason.trim() });
      if (res.data.success) {
        setActionMessage(res.data.message || 'Team rejected and notice sent.');
        setEmailStatusModal({
          type: 'WARNING',
          title: 'TEAM REJECTED & NOTICE SENT',
          message: `Team marked as REJECTED. Notification sent to Team Leader (${data.participants?.find(p => p.role === 'LEADER')?.email || 'Leader'}). Reason: ${reason.trim()}`,
        });
        fetchTeamDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting team.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b07] text-white flex items-center justify-center font-mono">
        LOADING TEAM INSPECTION DATA...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#050b07] text-white p-8 text-center font-mono">
        TEAM RECORD NOT FOUND.
      </div>
    );
  }

  const { registration, participants, payment } = data;

  return (
    <div className="min-h-screen bg-[#050b07] text-white pb-24">
      <AdminNavbar
        title={`INSPECT: ${registration.teamName}`}
        showBack={true}
        backTo="/admin/registrations"
      />

      {/* EMAIL STATUS POPUP MODAL */}
      {emailStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0a140e] border-2 border-[#00ff66] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,255,102,0.4)] text-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl ${
              emailStatusModal.type === 'SUCCESS' ? 'bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66]' : 'bg-amber-500/20 border border-amber-500 text-amber-400'
            }`}>
              {emailStatusModal.type === 'SUCCESS' ? '✓' : '⚠️'}
            </div>

            <h3 className="font-orbitron font-bold text-xl text-white">
              {emailStatusModal.title}
            </h3>

            <p className="font-mono text-xs text-gray-300 leading-relaxed bg-[#050b07] p-4 rounded-xl border border-[#1b3524]">
              {emailStatusModal.message}
            </p>

            <button
              onClick={() => setEmailStatusModal(null)}
              className="w-full py-3 px-4 bg-[#00ff66] hover:bg-[#10b981] text-black font-orbitron font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_#00ff66]"
            >
              GOT IT / CLOSE POPUP
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {actionMessage && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 font-mono text-xs shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            ✓ {actionMessage}
          </div>
        )}

        {/* TEAM SUMMARY HEADER CARD WITH 1-CLICK ACTIONS */}
        <div className="bg-[#0a140e] border-2 border-[#10b981] rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="font-mono text-xs text-gray-400 block">REGISTRATION ID</span>
            <div className="font-orbitron font-black text-3xl text-[#00ff66] neon-glow-green">
              {registration.registrationId}
            </div>
            <div className="font-mono text-sm text-gray-300 mt-1">
              Team: <strong className="text-white">{registration.teamName}</strong> ({registration.teamSize} Members) | Registered On: {new Date(registration.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <span className="font-mono text-[10px] text-gray-400 block text-left sm:text-right">CURRENT STATUS</span>
              <span className={`font-orbitron font-extrabold text-sm px-3 py-1 rounded-lg border block text-center mt-0.5 ${
                registration.status === 'REGISTRATION CONFIRMED'
                  ? 'bg-green-500/20 text-green-400 border-green-500/40'
                  : registration.status === 'REJECTED'
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                {registration.status}
              </span>
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={handleApproveEntireTeam}
                className="px-4 py-2.5 bg-[#00ff66] hover:bg-[#10b981] text-black hover:text-white font-orbitron font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] flex items-center space-x-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>APPROVE TEAM & SEND EMAIL</span>
              </button>

              <button
                onClick={handleRejectEntireTeam}
                className="px-4 py-2.5 bg-red-950/90 hover:bg-red-900 border border-red-500/60 text-red-300 font-mono text-xs rounded-xl transition-all flex items-center space-x-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>REJECT TEAM</span>
              </button>
            </div>
          </div>
        </div>

        {/* PAYMENT VERIFICATION CARD */}
        {payment && (
          <div className="bg-[#0a140e] border border-[#1b3524] rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-orbitron font-bold text-xl text-[#00ff66] border-b border-[#1b3524] pb-3 flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6" />
              <span>PAYMENT INFORMATION & UTR PROOF</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between border-b border-[#1b3524] pb-2">
                  <span className="text-gray-400">Expected Amount:</span>
                  <span className="text-[#00ff66] font-bold">₹{payment.expectedAmount}</span>
                </div>
                <div className="flex justify-between border-b border-[#1b3524] pb-2">
                  <span className="text-gray-400">UPI ID Paid:</span>
                  <span className="text-white">{payment.upiId}</span>
                </div>
                <div className="flex justify-between border-b border-[#1b3524] pb-2">
                  <span className="text-gray-400">Transaction ID / UTR:</span>
                  <span className="text-white font-bold">{payment.transactionId}</span>
                </div>
                <div className="flex justify-between border-b border-[#1b3524] pb-2">
                  <span className="text-gray-400">Payment Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                    payment.status === 'VERIFIED'
                      ? 'bg-green-500/20 text-green-400'
                      : payment.status === 'REJECTED'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {payment.status}
                  </span>
                </div>
                {payment.rejectionReason && (
                  <div className="text-red-400 text-xs bg-red-950/40 p-2 rounded border border-red-500/30">
                    Rejection Reason: {payment.rejectionReason}
                  </div>
                )}

                {/* Admin Actions */}
                <div className="pt-4 space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handleVerifyPayment}
                      className="flex-1 py-2.5 bg-[#00ff66] text-black font-orbitron font-bold text-xs rounded-lg hover:bg-[#10b981] hover:text-white transition-all shadow-[0_0_15px_#00ff66]"
                    >
                      VERIFY PAYMENT
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#1b3524]">
                    <select
                      value={paymentRejectionReason}
                      onChange={(e) => setPaymentRejectionReason(e.target.value)}
                      className="w-full bg-[#050b07] border border-[#1b3524] text-gray-300 font-mono text-xs rounded px-3 py-2 outline-none"
                    >
                      <option value="">SELECT REJECTION REASON *</option>
                      <option value="Incorrect amount paid">Incorrect amount paid</option>
                      <option value="Invalid transaction ID / UTR number">Invalid transaction ID / UTR number</option>
                      <option value="Screenshot image unclear or unreadable">Screenshot image unclear or unreadable</option>
                      <option value="Payment not found in bank records">Payment not found in bank records</option>
                      <option value="Duplicate transaction ID">Duplicate transaction ID</option>
                    </select>

                    <button
                      onClick={handleRejectPayment}
                      className="w-full py-2 bg-red-950/80 border border-red-500/60 text-red-300 font-mono text-xs rounded hover:bg-red-900 transition-colors"
                    >
                      REJECT PAYMENT
                    </button>
                  </div>
                </div>
              </div>

              {/* Screenshot Preview */}
              <div>
                <span className="font-mono text-xs text-gray-400 block mb-2">PAYMENT SCREENSHOT PROOF</span>
                <div className="bg-[#050b07] border border-[#1b3524] rounded-xl p-2 h-72 flex items-center justify-center overflow-hidden">
                  <a href={assetUrl(payment.screenshotUrl)} target="_blank" rel="noopener noreferrer" className="h-full">
                    <img
                      src={assetUrl(payment.screenshotUrl)}
                      alt="Payment Proof"
                      className="h-full object-contain hover:scale-105 transition-transform"
                    />
                  </a>
                </div>
                <a
                  href={assetUrl(payment.screenshotUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 font-mono text-xs text-[#00ff66] mt-2 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>VIEW FULL SCREENSHOT</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* PARTICIPANTS & ID CARDS VERIFICATION GRID */}
        <div className="space-y-6">
          <h2 className="font-orbitron font-bold text-xl text-white">
            PARTICIPANTS & STUDENT ID CARDS ({participants.length} MEMBERS)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {participants.map((p, idx) => (
              <div key={p._id} className="bg-[#0a140e] border border-[#1b3524] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1b3524] pb-3">
                  <div>
                    <span className="font-orbitron font-bold text-base text-white">
                      {p.fullName}
                    </span>
                    <span className="font-mono text-xs text-[#00ff66] block">
                      ROLE: {p.role}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    p.verificationStatus === 'VERIFIED'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                      : p.verificationStatus === 'REJECTED'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    ID {p.verificationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs text-gray-300">
                  <div><span className="text-gray-500">Email:</span> {p.email}</div>
                  <div><span className="text-gray-500">Phone:</span> {p.phone}</div>
                  <div><span className="text-gray-500">College:</span> {p.college}</div>
                  <div><span className="text-gray-500">Dept:</span> {p.department} ({p.year})</div>
                  <div className="col-span-2"><span className="text-gray-500">Student ID / Roll No:</span> <strong className="text-white">{p.studentId}</strong></div>
                </div>

                {/* ID Card Image Preview */}
                <div className="bg-[#050b07] border border-[#1b3524] rounded-xl p-2 h-48 flex items-center justify-center overflow-hidden">
                  <a href={assetUrl(p.idCardUrl)} target="_blank" rel="noopener noreferrer" className="h-full">
                    <img
                      src={assetUrl(p.idCardUrl)}
                      alt="Student ID Card"
                      className="h-full object-contain hover:scale-105 transition-transform"
                    />
                  </a>
                </div>

                {p.rejectionReason && (
                  <div className="text-red-400 text-xs bg-red-950/40 p-2 rounded border border-red-500/30 font-mono">
                    Rejection Reason: {p.rejectionReason}
                  </div>
                )}

                {/* Admin Actions */}
                <div className="space-y-2 pt-2 border-t border-[#1b3524]">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerifyParticipant(p._id)}
                      className="flex-1 py-2 bg-[#00ff66] text-black font-orbitron font-bold text-xs rounded hover:bg-[#10b981] hover:text-white transition-colors"
                    >
                      VERIFY ID CARD
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Rejection reason mandatory..."
                      value={participantRejectionReasons[p._id] || ''}
                      onChange={(e) => setParticipantRejectionReasons({ ...participantRejectionReasons, [p._id]: e.target.value })}
                      className="flex-1 bg-[#050b07] border border-[#1b3524] rounded px-3 py-1.5 font-mono text-xs text-white outline-none"
                    />
                    <button
                      onClick={() => handleRejectParticipant(p._id)}
                      className="px-4 py-1.5 bg-red-950 border border-red-500/60 text-red-300 font-mono text-xs rounded hover:bg-red-900 transition-colors"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTeamDetailPage;
