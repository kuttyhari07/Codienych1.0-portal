import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, FileText, ExternalLink, ShieldCheck, Anchor } from 'lucide-react';
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
        setActionMessage('Treasury payment tribute verified successfully.');
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
        setActionMessage('Treasury payment rejected.');
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
        setActionMessage('Pirate student ID pass card verified.');
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
        setActionMessage('Pirate student ID card rejected.');
        fetchTeamDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting participant.');
    }
  };

  const [isApproving, setIsApproving] = useState(false);
  const [emailStatusModal, setEmailStatusModal] = useState(null);
  const [showConfirmApproveModal, setShowConfirmApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [teamRejectionReasonInput, setTeamRejectionReasonInput] = useState('');

  // 1-Click Approve Entire Team & Send Confirmation Email
  const handleApproveEntireTeam = async () => {
    setShowConfirmApproveModal(false);
    setIsApproving(true);
    try {
      const res = await api.patch(`/admin/registrations/${id}/approve-team`);
      if (res.data.success) {
        setActionMessage(res.data.message || 'Fleet approved and parchment confirmation dispatched!');
        setEmailStatusModal({
          type: res.data.emailSent ? 'SUCCESS' : 'WARNING',
          title: res.data.emailSent ? 'CONFIRMATION DISPATCH SENT! 📨' : 'FLEET APPROVED (EMAIL ISSUE)',
          message: res.data.emailSent
            ? `Official Pirates Aztec Gold Confirmation Email dispatched to Captain (${data.participants?.find(p => p.role === 'LEADER')?.email || 'Captain'})!`
            : `Fleet status was updated to CONFIRMED, but the confirmation email could not be delivered to ${data.participants?.find(p => p.role === 'LEADER')?.email || 'Captain'}. Please check SMTP configuration.`,
        });
        await fetchTeamDetail();
      }
    } catch (err) {
      setEmailStatusModal({
        type: 'ERROR',
        title: 'APPROVAL FAILED',
        message: err.response?.data?.message || 'Error occurred while approving fleet.',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectEntireTeam = async () => {
    if (!teamRejectionReasonInput.trim()) {
      alert('Rejection reason is mandatory.');
      return;
    }
    setShowRejectModal(false);
    setIsApproving(true);
    try {
      const res = await api.patch(`/admin/registrations/${id}/reject-team`, { rejectionReason: teamRejectionReasonInput.trim() });
      if (res.data.success) {
        setActionMessage(res.data.message || 'Fleet rejected and notice dispatched.');
        setEmailStatusModal({
          type: 'WARNING',
          title: 'FLEET REJECTED & NOTICE DISPATCHED',
          message: `Fleet marked as REJECTED. Notification sent to Captain (${data.participants?.find(p => p.role === 'LEADER')?.email || 'Captain'}). Reason: ${teamRejectionReasonInput.trim()}`,
        });
        await fetchTeamDetail();
      }
    } catch (err) {
      setEmailStatusModal({
        type: 'ERROR',
        title: 'REJECTION FAILED',
        message: err.response?.data?.message || 'Error rejecting fleet.',
      });
    } finally {
      setIsApproving(false);
      setTeamRejectionReasonInput('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03070b] text-[#ffd700] flex items-center justify-center font-cinzel">
        INSPECTING FLEET MANIFEST...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] p-8 text-center font-cinzel">
        FLEET RECORD NOT FOUND ON HIGH SEAS.
      </div>
    );
  }

  const { registration, participants, payment } = data;

  return (
    <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] pb-24 relative overflow-hidden">
      <AdminNavbar
        title={`INSPECT: ${registration.teamName}`}
        showBack={true}
        backTo="/admin/registrations"
      />

      {/* MODAL: CONFIRM APPROVE ENTIRE TEAM */}
      {showConfirmApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#08121a] border-2 border-[#ffd700] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(255,215,0,0.4)] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ffd700]/20 border border-[#ffd700] flex items-center justify-center mx-auto text-[#ffd700] text-2xl font-bold">
              ✓
            </div>
            <h3 className="font-cinzel font-bold text-xl text-white">
              APPROVE FLEET REGISTRATION?
            </h3>
            <p className="font-mono text-xs text-gray-300 leading-relaxed bg-[#04090f] p-4 rounded-xl border border-[#3a2e1d]">
              This will mark Payment & All Crew ID Passes as <span className="text-[#ffd700] font-bold">VERIFIED</span> and automatically dispatch the official <span className="text-white font-bold">Pirates Confirmation Email</span> to Captain (<span className="text-[#ffd700]">{data?.participants?.find(p => p.role === 'LEADER')?.email || 'Captain'}</span>).
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmApproveModal(false)}
                className="flex-1 py-3 px-4 bg-[#0c1e2d] hover:bg-[#152e46] text-gray-300 font-cinzel font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleApproveEntireTeam}
                disabled={isApproving}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] cursor-pointer uppercase tracking-wider"
              >
                {isApproving ? 'DISPATCHING...' : 'CONFIRM & DISPATCH EMAIL'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT ENTIRE TEAM */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#08121a] border-2 border-red-500 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(239,68,68,0.4)] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center mx-auto text-red-400 text-2xl font-bold">
              ✕
            </div>
            <h3 className="font-cinzel font-bold text-xl text-white">
              REJECT FLEET REGISTRATION
            </h3>
            <div className="space-y-2 text-left">
              <label className="font-cinzel text-xs text-gray-400 block">Mandatory Rejection Reason:</label>
              <textarea
                value={teamRejectionReasonInput}
                onChange={(e) => setTeamRejectionReasonInput(e.target.value)}
                placeholder="e.g. Invalid payment UTR / Unreadable student ID uploaded..."
                rows={3}
                className="w-full bg-[#04090f] border border-red-500/50 rounded-xl p-3 font-mono text-xs text-white outline-none focus:border-red-400"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 px-4 bg-[#0c1e2d] hover:bg-[#152e46] text-gray-300 font-cinzel font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleRejectEntireTeam}
                disabled={isApproving}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-cinzel font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer uppercase tracking-wider"
              >
                {isApproving ? 'DISPATCHING...' : 'REJECT & NOTIFY CAPTAIN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL STATUS POPUP MODAL */}
      {emailStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#08121a] border-2 border-[#ffd700] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(255,215,0,0.4)] text-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold ${
              emailStatusModal.type === 'SUCCESS' ? 'bg-[#ffd700]/20 border border-[#ffd700] text-[#ffd700]' : 'bg-amber-500/20 border border-amber-500 text-amber-400'
            }`}>
              {emailStatusModal.type === 'SUCCESS' ? '✓' : '⚠️'}
            </div>

            <h3 className="font-cinzel font-bold text-xl text-white">
              {emailStatusModal.title}
            </h3>

            <p className="font-mono text-xs text-gray-300 leading-relaxed bg-[#04090f] p-4 rounded-xl border border-[#3a2e1d]">
              {emailStatusModal.message}
            </p>

            <button
              onClick={() => setEmailStatusModal(null)}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(255,215,0,0.4)] cursor-pointer uppercase tracking-wider"
            >
              ACKNOWLEDGE & CLOSE
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {actionMessage && (
          <div className="p-4 bg-[#0a1f2e] border border-[#ffd700]/50 rounded-xl text-[#ffd700] font-cinzel text-xs shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            ✓ {actionMessage}
          </div>
        )}

        {/* TEAM SUMMARY HEADER CARD WITH 1-CLICK ACTIONS */}
        <div className="bg-[#08121a] border-2 border-[#ffd700]/70 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-md">
          <div>
            <span className="font-cinzel text-xs text-gray-400 block">REGISTRATION ID</span>
            <div className="font-pirate font-black text-4xl text-[#ffd700] pirate-gold-glow">
              {registration.registrationId}
            </div>
            <div className="font-cinzel text-sm text-gray-300 mt-1">
              Fleet: <strong className="text-white font-bold">{registration.teamName}</strong> ({registration.teamSize} Pirates) | Registered: {new Date(registration.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <span className="font-cinzel text-[10px] text-gray-400 block text-left sm:text-right">CURRENT STATUS</span>
              <span className={`font-cinzel font-extrabold text-sm px-3 py-1 rounded-lg border block text-center mt-0.5 ${
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
                onClick={() => setShowConfirmApproveModal(true)}
                disabled={isApproving}
                className="px-4 py-2.5 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 uppercase tracking-wider"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isApproving ? 'PROCESSING...' : 'APPROVE FLEET & SEND EMAIL'}</span>
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isApproving}
                className="px-4 py-2.5 bg-red-950/90 hover:bg-red-900 border border-red-500/60 text-red-300 font-cinzel text-xs rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 uppercase tracking-wider"
              >
                <XCircle className="w-4 h-4" />
                <span>REJECT FLEET</span>
              </button>
            </div>
          </div>
        </div>

        {/* PAYMENT VERIFICATION CARD */}
        {payment && (
          <div className="bg-[#08121a] border border-[#3a2e1d] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="font-cinzel font-bold text-xl text-[#ffd700] border-b border-[#3a2e1d] pb-3 flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-[#ffd700]" />
              <span>TREASURY TRIBUTE & UTR PROOF</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
                  <span className="text-gray-400 font-cinzel">Expected Amount:</span>
                  <span className="text-[#ffd700] font-bold">₹{payment.expectedAmount}</span>
                </div>
                <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
                  <span className="text-gray-400 font-cinzel">UPI ID Paid:</span>
                  <span className="text-white">{payment.upiId}</span>
                </div>
                <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
                  <span className="text-gray-400 font-cinzel">Transaction ID / UTR:</span>
                  <span className="text-white font-bold">{payment.transactionId}</span>
                </div>
                <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
                  <span className="text-gray-400 font-cinzel">Payment Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-xs font-cinzel ${
                    payment.status === 'VERIFIED'
                      ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40'
                      : payment.status === 'REJECTED'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
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
                      className="flex-1 py-2.5 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] cursor-pointer uppercase tracking-wider"
                    >
                      VERIFY TRIBUTE PAYMENT
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#3a2e1d]">
                    <select
                      value={paymentRejectionReason}
                      onChange={(e) => setPaymentRejectionReason(e.target.value)}
                      className="w-full bg-[#04090f] border border-[#3a2e1d] text-gray-300 font-mono text-xs rounded px-3 py-2 outline-none"
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
                      className="w-full py-2 bg-red-950/80 border border-red-500/60 text-red-300 font-cinzel text-xs rounded hover:bg-red-900 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      REJECT TRIBUTE
                    </button>
                  </div>
                </div>
              </div>

              {/* Screenshot Preview */}
              <div>
                <span className="font-cinzel text-xs text-[#e5c158] block mb-2">PAYMENT RECEIPT PROOF</span>
                <div className="bg-[#04090f] border border-[#3a2e1d] rounded-xl p-2 h-72 flex items-center justify-center overflow-hidden">
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
                  className="inline-flex items-center space-x-1 font-cinzel text-xs text-[#00e5ff] mt-2 hover:text-[#ffd700] underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>VIEW FULL RECEIPT</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* PARTICIPANTS & ID CARDS VERIFICATION GRID */}
        <div className="space-y-6">
          <h2 className="font-cinzel font-bold text-xl text-white">
            CREW MATES & COLLEGE PASS CARDS ({participants.length} PIRATES)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {participants.map((p, idx) => (
              <div key={p._id} className="bg-[#08121a] border border-[#3a2e1d] rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-[#3a2e1d] pb-3">
                  <div>
                    <span className="font-cinzel font-bold text-base text-white">
                      {p.fullName}
                    </span>
                    <span className="font-cinzel text-xs text-[#ffd700] block">
                      ROLE: {p.role}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-cinzel font-bold ${
                    p.verificationStatus === 'VERIFIED'
                      ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40'
                      : p.verificationStatus === 'REJECTED'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    PASS {p.verificationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs text-gray-300">
                  <div><span className="text-gray-500 font-cinzel">Email:</span> {p.email}</div>
                  <div><span className="text-gray-500 font-cinzel">Phone:</span> {p.phone}</div>
                  <div><span className="text-gray-500 font-cinzel">College:</span> {p.college}</div>
                  <div><span className="text-gray-500 font-cinzel">Dept:</span> {p.department} ({p.year})</div>
                  <div className="col-span-2"><span className="text-gray-500 font-cinzel">Student ID:</span> <strong className="text-white">{p.studentId}</strong></div>
                </div>

                {/* ID Card Image Preview */}
                <div className="bg-[#04090f] border border-[#3a2e1d] rounded-xl p-2 h-48 flex items-center justify-center overflow-hidden">
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
                <div className="space-y-2 pt-2 border-t border-[#3a2e1d]">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerifyParticipant(p._id)}
                      className="flex-1 py-2 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-xs rounded transition-colors uppercase tracking-wider cursor-pointer shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                    >
                      VERIFY PASS CARD
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Rejection reason mandatory..."
                      value={participantRejectionReasons[p._id] || ''}
                      onChange={(e) => setParticipantRejectionReasons({ ...participantRejectionReasons, [p._id]: e.target.value })}
                      className="flex-1 bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded px-3 py-1.5 font-mono text-xs text-white outline-none"
                    />
                    <button
                      onClick={() => handleRejectParticipant(p._id)}
                      className="px-4 py-1.5 bg-red-950/80 border border-red-500/60 text-red-300 font-cinzel font-bold text-xs rounded hover:bg-red-900 transition-colors uppercase tracking-wider cursor-pointer"
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
