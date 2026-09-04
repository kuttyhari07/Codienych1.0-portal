import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, ChevronLeft, Upload, Check, AlertCircle, QrCode, Copy, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { EVENT_CONFIG } from '../utils/config';

const steps = [
  '1. TEAM INFO',
  '2. LEADER',
  '3. MEMBERS',
  '4. ID CARDS',
  '5. REVIEW',
  '6. PAYMENT',
  '7. PROOF',
  '8. SUBMISSION',
];

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Form State
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(4); // default 4 (options: 4, 5, 6)

  // Participant #1 (Leader)
  const [leader, setLeader] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '3rd Year',
    studentId: '',
    idCardFile: null,
  });

  // Dynamic Members (Array length depends on teamSize - 1)
  const [members, setMembers] = useState([
    { fullName: '', email: '', phone: '', college: '', department: '', year: '3rd Year', studentId: '', idCardFile: null },
    { fullName: '', email: '', phone: '', college: '', department: '', year: '3rd Year', studentId: '', idCardFile: null },
    { fullName: '', email: '', phone: '', college: '', department: '', year: '3rd Year', studentId: '', idCardFile: null },
  ]);

  // Payment Proof
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshotFile, setPaymentScreenshotFile] = useState(null);

  // Handle Team Size Change dynamically
  const handleTeamSizeChange = (size) => {
    const numSize = parseInt(size, 10);
    setTeamSize(numSize);

    // Adjust members array length (numSize - 1)
    const needed = numSize - 1;
    if (members.length < needed) {
      const newMembers = [...members];
      while (newMembers.length < needed) {
        newMembers.push({ fullName: '', email: '', phone: '', college: '', department: '', year: '3rd Year', studentId: '', idCardFile: null });
      }
      setMembers(newMembers);
    } else if (members.length > needed) {
      setMembers(members.slice(0, needed));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleMemberIdCard = (index, file) => {
    const updated = [...members];
    updated[index].idCardFile = file;
    setMembers(updated);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(EVENT_CONFIG.UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Fee calculation (display only, recalculated on backend)
  const calculatedFee = teamSize * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER;

  // Validation per step
  const validateStep = (step) => {
    setErrorMessage('');
    if (step === 1) {
      if (!teamName.trim()) {
        setErrorMessage('Please enter your Team Name.');
        return false;
      }
      if (![4, 5, 6].includes(teamSize)) {
        setErrorMessage('Team size must be 4, 5, or 6 members.');
        return false;
      }
    }

    if (step === 2) {
      const { fullName, email, phone, college, department, year, studentId } = leader;
      if (!fullName.trim() || !email.trim() || !phone.trim() || !college.trim() || !department.trim() || !year.trim() || !studentId.trim()) {
        setErrorMessage('Please fill in all mandatory Team Leader details.');
        return false;
      }
      if (!email.includes('@')) {
        setErrorMessage('Please enter a valid email address for Team Leader.');
        return false;
      }
    }

    if (step === 3) {
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m.fullName.trim() || !m.email.trim() || !m.phone.trim() || !m.college.trim() || !m.department.trim() || !m.year.trim() || !m.studentId.trim()) {
          setErrorMessage(`Please fill in all mandatory details for Team Member #${i + 2}.`);
          return false;
        }
        if (!m.email.includes('@')) {
          setErrorMessage(`Invalid email address for Team Member #${i + 2}.`);
          return false;
        }
      }
    }

    if (step === 4) {
      if (!leader.idCardFile) {
        setErrorMessage('Please upload the Student ID Card photo for Team Leader.');
        return false;
      }
      for (let i = 0; i < members.length; i++) {
        if (!members[i].idCardFile) {
          setErrorMessage(`Please upload the Student ID Card photo for Team Member #${i + 2}.`);
          return false;
        }
      }
    }

    if (step === 7) {
      if (!transactionId.trim()) {
        setErrorMessage('UPI Transaction ID / UTR Number is required.');
        return false;
      }
      if (!paymentScreenshotFile) {
        setErrorMessage('Payment Screenshot proof upload is required.');
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 8));
    }
  };

  const prevStep = () => {
    setErrorMessage('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(7)) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('teamName', teamName);
      formData.append('teamSize', teamSize);
      formData.append('transactionId', transactionId);

      // Package all participants (Leader + Members)
      const allParticipants = [
        {
          fullName: leader.fullName,
          email: leader.email,
          phone: leader.phone,
          college: leader.college,
          department: leader.department,
          year: leader.year,
          studentId: leader.studentId,
        },
        ...members.map((m) => ({
          fullName: m.fullName,
          email: m.email,
          phone: m.phone,
          college: m.college,
          department: m.department,
          year: m.year,
          studentId: m.studentId,
        })),
      ];

      formData.append('participants', JSON.stringify(allParticipants));

      // Append files in exact index order
      formData.append('idCards', leader.idCardFile);
      members.forEach((m) => {
        formData.append('idCards', m.idCardFile);
      });

      formData.append('paymentScreenshot', paymentScreenshotFile);

      const response = await api.post('/registrations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setSubmissionSuccess(response.data.data);
      } else {
        setErrorMessage(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration submit error:', error);
      const msg = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'An error occurred during submission. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS PAGE STATE
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-[#050b07] pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="bg-[#0a140e] border-2 border-[#00ff66] rounded-2xl p-8 sm:p-12 max-w-xl w-full text-center shadow-[0_0_50px_rgba(0,255,102,0.4)] animate-fadeIn">
          <div className="w-20 h-20 bg-[#00ff66] rounded-full flex items-center justify-center mx-auto mb-6 text-black shadow-[0_0_25px_#00ff66]">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="font-orbitron font-black text-3xl text-white mb-2">
            PAYMENT SUBMITTED
          </h2>
          <p className="font-mono text-xs text-[#00ff66] uppercase tracking-widest mb-6">
            REGISTRATION DATA RECORDED SUCCESSFULLY
          </p>

          <div className="bg-[#040e08] border border-[#1b3524] rounded-xl p-6 text-left space-y-3 mb-8 font-mono text-sm">
            <div className="flex justify-between border-b border-[#1b3524] pb-2">
              <span className="text-gray-400">Registration ID:</span>
              <span className="text-[#00ff66] font-bold">{submissionSuccess.registrationId}</span>
            </div>
            <div className="flex justify-between border-b border-[#1b3524] pb-2">
              <span className="text-gray-400">Team Name:</span>
              <span className="text-white font-bold">{submissionSuccess.teamName}</span>
            </div>
            <div className="flex justify-between border-b border-[#1b3524] pb-2">
              <span className="text-gray-400">Team Size:</span>
              <span className="text-white">{submissionSuccess.teamSize} Members</span>
            </div>
            <div className="flex justify-between border-b border-[#1b3524] pb-2">
              <span className="text-gray-400">Total Amount:</span>
              <span className="text-white font-bold">₹{submissionSuccess.expectedAmount}</span>
            </div>
            <div className="flex justify-between border-b border-[#1b3524] pb-2">
              <span className="text-gray-400">Transaction ID:</span>
              <span className="text-gray-300">{submissionSuccess.transactionId}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-400">Status:</span>
              <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                PENDING VERIFICATION
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#0f2416] border border-[#10b981]/40 rounded-xl mb-8 font-sans text-xs text-gray-300 text-left">
            💡 <strong>What's Next?</strong> Our committee will verify your payment UTR and participant student ID cards. You will receive an automated email confirmation once verified!
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/status?id=${submissionSuccess.registrationId}`}
              className="flex-1 py-3 px-4 bg-[#00ff66] hover:bg-[#10b981] text-black font-orbitron font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_#00ff66]"
            >
              TRACK REGISTRATION STATUS
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 px-4 bg-[#0f1e14] border border-[#1b3524] text-gray-300 hover:text-white font-mono text-xs rounded-lg text-center"
            >
              RETURN TO HOME
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b07] text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs font-mono text-[#00ff66] mb-3 hover:underline">
            <ChevronLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </Link>
          <h1 className="font-orbitron font-black text-3xl sm:text-5xl text-white tracking-wider">
            MISSION <span className="text-[#00ff66]">REGISTRATION</span>
          </h1>
          <p className="font-mono text-xs text-gray-400 mt-2">
            OFFICIAL TEAM ENTRY FORM • ₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} PER PARTICIPANT
          </p>
        </div>

        {/* Wizard Progress Indicator */}
        <div className="mb-10 overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[650px] border-b border-[#1b3524] pb-4">
            {steps.map((label, index) => {
              const stepNum = index + 1;
              const isActive = currentStep === stepNum;
              const isDone = currentStep > stepNum;
              return (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-[#00ff66] text-black shadow-[0_0_10px_#00ff66]'
                        : isActive
                        ? 'bg-[#0f2416] text-[#00ff66] border-2 border-[#00ff66] shadow-[0_0_15px_#00ff66]'
                        : 'bg-[#0a140e] text-gray-500 border border-[#1b3524]'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : stepNum}
                  </div>
                  <span
                    className={`font-mono text-[10px] mt-2 tracking-tighter ${
                      isActive ? 'text-[#00ff66] font-bold' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-sm font-sans flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-[#0a140e] border border-[#1b3524] rounded-2xl p-6 sm:p-10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {/* STEP 1: TEAM INFO */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-orbitron font-bold text-xl text-[#00ff66] border-b border-[#1b3524] pb-3">
                STEP 1: TEAM INFORMATION
              </h2>

              <div>
                <label className="block font-mono text-xs text-gray-300 mb-2 uppercase">
                  TEAM NAME *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. CYBER_SHADOWS"
                  className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-lg px-4 py-3 text-white font-mono text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-300 mb-2 uppercase">
                  SELECT TEAM SIZE (ALLOWED ONLY 4, 5, OR 6 MEMBERS) *
                </label>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                  {[4, 5, 6].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleTeamSizeChange(size)}
                      className={`py-3 sm:py-4 px-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                        teamSize === size
                          ? 'bg-[#0f2e1a] border-[#00ff66] text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                          : 'bg-[#050b07] border-[#1b3524] text-gray-400 hover:border-[#10b981]'
                      }`}
                    >
                      <span className="font-orbitron font-black text-xl sm:text-2xl leading-tight">
                        {size}
                      </span>
                      <span className="font-mono text-[9px] sm:text-xs tracking-wider uppercase mt-0.5">
                        MEMBERS
                      </span>
                    </button>
                  ))}
                </div>
                <p className="font-mono text-xs text-gray-400 mt-2.5">
                  Total Fee: <span className="text-[#00ff66] font-bold">₹{calculatedFee}</span> (₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} × {teamSize} participants)
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: TEAM LEADER */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-orbitron font-bold text-xl text-[#00ff66] border-b border-[#1b3524] pb-3">
                STEP 2: TEAM LEADER DETAILS (PARTICIPANT #1)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">FULL NAME *</label>
                  <input
                    type="text"
                    value={leader.fullName}
                    onChange={(e) => setLeader({ ...leader, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    value={leader.email}
                    onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                    placeholder="leader@gmail.com"
                    className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    value={leader.phone}
                    onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">COLLEGE NAME *</label>
                  <input
                    type="text"
                    value={leader.college}
                    onChange={(e) => setLeader({ ...leader, college: e.target.value })}
                    placeholder="Institute of Technology"
                    className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">DEPARTMENT *</label>
                  <input
                    type="text"
                    value={leader.department}
                    onChange={(e) => setLeader({ ...leader, department: e.target.value })}
                    placeholder="Computer Science & Engineering"
                    className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">YEAR OF STUDY *</label>
                  <select
                    value={leader.year}
                    onChange={(e) => setLeader({ ...leader, year: e.target.value })}
                    className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-mono text-xs text-gray-300 mb-1">STUDENT ID / ROLL NUMBER *</label>
                  <input
                    type="text"
                    value={leader.studentId}
                    onChange={(e) => setLeader({ ...leader, studentId: e.target.value })}
                    placeholder="e.g. 21CS001"
                    className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                {/* Leader ID Card Upload */}
                <div className="md:col-span-2 bg-[#050b07] border border-[#1b3524] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block font-orbitron font-bold text-xs text-white">
                      STUDENT ID CARD PHOTO *
                    </label>
                    <p className="font-mono text-[10px] text-gray-400">
                      Upload clear photo of College ID card (JPG, PNG, WEBP max 5MB)
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <label className="cursor-pointer px-4 py-2 bg-[#0f2416] border border-[#10b981] rounded-lg text-xs font-mono text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-all inline-flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>{leader.idCardFile ? 'CHANGE ID CARD' : 'UPLOAD ID CARD'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => setLeader({ ...leader, idCardFile: e.target.files[0] })}
                        className="hidden"
                      />
                    </label>
                    {leader.idCardFile && (
                      <span className="block font-mono text-[10px] text-[#00ff66] mt-1 text-left sm:text-right truncate max-w-[200px]">
                        ✓ {leader.idCardFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC TEAM MEMBERS */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="font-orbitron font-bold text-xl text-[#00ff66] border-b border-[#1b3524] pb-3">
                STEP 3: TEAM MEMBERS DETAILS ({members.length} MEMBERS)
              </h2>

              {members.map((member, idx) => (
                <div key={idx} className="bg-[#050b07] border border-[#1b3524] p-5 rounded-xl space-y-4">
                  <h3 className="font-orbitron font-bold text-sm text-[#10b981]">
                    TEAM MEMBER #{idx + 2}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-gray-300 mb-1">FULL NAME *</label>
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) => handleMemberChange(idx, 'fullName', e.target.value)}
                        className="w-full bg-[#0a140e] border border-[#1b3524] focus:border-[#00ff66] rounded px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-gray-300 mb-1">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        className="w-full bg-[#0a140e] border border-[#1b3524] focus:border-[#00ff66] rounded px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-gray-300 mb-1">PHONE NUMBER *</label>
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                        className="w-full bg-[#0a140e] border border-[#1b3524] focus:border-[#00ff66] rounded px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-gray-300 mb-1">COLLEGE NAME *</label>
                      <input
                        type="text"
                        value={member.college}
                        onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                        className="w-full bg-[#0a140e] border border-[#1b3524] focus:border-[#00ff66] rounded px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-gray-300 mb-1">DEPARTMENT *</label>
                      <input
                        type="text"
                        value={member.department}
                        onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                        className="w-full bg-[#0a140e] border border-[#1b3524] focus:border-[#00ff66] rounded px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-mono text-xs text-gray-300 mb-1">YEAR / ROLL NO *</label>
                      <input
                        type="text"
                        value={member.studentId}
                        onChange={(e) => handleMemberChange(idx, 'studentId', e.target.value)}
                        placeholder="Student ID / Roll No"
                        className="w-full bg-[#0a140e] border border-[#1b3524] focus:border-[#00ff66] rounded px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>

                    {/* Member ID Card Upload */}
                    <div className="md:col-span-2 bg-[#0a140e] border border-[#1b3524] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="block font-orbitron font-bold text-xs text-white">
                          MEMBER #{idx + 2} STUDENT ID CARD PHOTO *
                        </label>
                        <p className="font-mono text-[10px] text-gray-400">
                          Upload College ID card photo (JPG, PNG, WEBP max 5MB)
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <label className="cursor-pointer px-3.5 py-1.5 bg-[#0f2416] border border-[#10b981] rounded-lg text-xs font-mono text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-all inline-flex items-center space-x-2">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{member.idCardFile ? 'CHANGE ID CARD' : 'UPLOAD ID CARD'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleMemberIdCard(idx, e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                        {member.idCardFile && (
                          <span className="block font-mono text-[10px] text-[#00ff66] mt-1 text-left sm:text-right truncate max-w-[200px]">
                            ✓ {member.idCardFile.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: ID CARD UPLOADS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-orbitron font-bold text-xl text-[#00ff66] border-b border-[#1b3524] pb-3">
                STEP 4: STUDENT ID CARD UPLOADS ({teamSize} UPLOADS MANDATORY)
              </h2>
              <p className="font-mono text-xs text-gray-400">
                Supported formats: JPG, JPEG, PNG, WEBP (Max 5MB each file).
              </p>

              {/* Leader Upload */}
              <div className="bg-[#050b07] border border-[#1b3524] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-orbitron font-bold text-sm text-white block">
                    LEADER: {leader.fullName || 'Team Leader'}
                  </span>
                  <span className="font-mono text-xs text-gray-400">ID: {leader.studentId}</span>
                </div>
                <div>
                  <label className="cursor-pointer px-4 py-2 bg-[#0f2416] border border-[#10b981] rounded-lg text-xs font-mono text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-all inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>{leader.idCardFile ? 'CHANGE FILE' : 'UPLOAD ID PHOTO'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setLeader({ ...leader, idCardFile: e.target.files[0] })}
                      className="hidden"
                    />
                  </label>
                  {leader.idCardFile && (
                    <span className="block font-mono text-[10px] text-[#00ff66] mt-1 text-right truncate max-w-[150px]">
                      ✓ {leader.idCardFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Members Upload */}
              {members.map((member, idx) => (
                <div key={idx} className="bg-[#050b07] border border-[#1b3524] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-orbitron font-bold text-sm text-white block">
                      MEMBER #{idx + 2}: {member.fullName || `Member ${idx + 2}`}
                    </span>
                    <span className="font-mono text-xs text-gray-400">ID: {member.studentId}</span>
                  </div>
                  <div>
                    <label className="cursor-pointer px-4 py-2 bg-[#0f2416] border border-[#10b981] rounded-lg text-xs font-mono text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-all inline-flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>{member.idCardFile ? 'CHANGE FILE' : 'UPLOAD ID PHOTO'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleMemberIdCard(idx, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {member.idCardFile && (
                      <span className="block font-mono text-[10px] text-[#00ff66] mt-1 text-right truncate max-w-[150px]">
                        ✓ {member.idCardFile.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: REVIEW TEAM */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-orbitron font-bold text-xl text-[#00ff66] border-b border-[#1b3524] pb-3">
                STEP 5: REVIEW TEAM DISPATCH
              </h2>

              <div className="bg-[#050b07] border border-[#1b3524] rounded-xl p-6 space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-[#1b3524] pb-2">
                  <span className="text-gray-400">Team Name:</span>
                  <span className="text-[#00ff66] font-bold">{teamName}</span>
                </div>
                <div className="flex justify-between border-b border-[#1b3524] pb-2">
                  <span className="text-gray-400">Team Size:</span>
                  <span className="text-white">{teamSize} Members</span>
                </div>
                <div className="flex justify-between border-b border-[#1b3524] pb-2">
                  <span className="text-gray-400">Team Leader:</span>
                  <span className="text-white">{leader.fullName} ({leader.email})</span>
                </div>
                <div className="flex justify-between border-b border-[#1b3524] pb-2">
                  <span className="text-gray-400">ID Cards Attached:</span>
                  <span className="text-[#00ff66] font-bold">{1 + members.filter(m => m.idCardFile).length}/{teamSize} Uploaded</span>
                </div>
                <div className="flex justify-between pt-2 text-base">
                  <span className="text-gray-300 font-bold">Total Registration Fee:</span>
                  <span className="text-[#00ff66] font-extrabold font-orbitron text-xl">₹{calculatedFee}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: UPI PAYMENT */}
          {currentStep === 6 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <h2 className="font-orbitron font-bold text-xl text-[#00ff66] border-b border-[#1b3524] pb-3">
                STEP 6: OFFICIAL UPI PAYMENT
              </h2>

              <div className="max-w-sm mx-auto bg-[#0a140e] border-2 border-[#00ff66] rounded-3xl p-6 shadow-[0_0_35px_rgba(0,255,102,0.25)]">
                {/* GPay Style Top Header */}
                <div className="flex items-center justify-center space-x-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00ff66] to-[#10b981] flex items-center justify-center font-orbitron font-bold text-black text-sm shadow-[0_0_10px_#00ff66]">
                    HG
                  </div>
                  <div className="text-left">
                    <h3 className="font-orbitron font-bold text-base text-white leading-tight">
                      {EVENT_CONFIG.UPI_MERCHANT_NAME}
                    </h3>
                    <span className="font-mono text-[11px] text-[#00ff66] block">
                      CODIENYCH 1.0 ORGANIZER
                    </span>
                  </div>
                </div>

                {/* Dynamic QR Code Box */}
                <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-gray-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=${encodeURIComponent(
                      `upi://pay?pa=${EVENT_CONFIG.UPI_ID}&pn=${encodeURIComponent(
                        EVENT_CONFIG.UPI_MERCHANT_NAME
                      )}&am=${calculatedFee}&cu=INR&tn=${encodeURIComponent(`CODIENYCH 1.0 Team ${teamName || 'Registration'}`)}`
                    )}`}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Dynamic Amount Display */}
                <div className="font-orbitron font-black text-3xl text-[#00ff66] neon-glow-green mb-1">
                  ₹{calculatedFee}
                </div>
                <p className="font-mono text-[11px] text-gray-400 mb-4">
                  ({teamSize} Participants × ₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER})
                </p>

                {/* UPI ID Pill & Copy Button */}
                <div className="bg-[#050b07] border border-[#1b3524] rounded-xl p-3 flex items-center justify-between font-mono text-xs mb-3">
                  <span className="text-gray-300 font-semibold truncate text-left mr-2">
                    {EVENT_CONFIG.UPI_ID}
                  </span>
                  <button
                    type="button"
                    onClick={copyUpiId}
                    className="px-3 py-1.5 bg-[#00ff66] hover:bg-[#10b981] text-black font-orbitron font-bold text-[11px] rounded-lg transition-all shadow-[0_0_10px_rgba(0,255,102,0.3)] flex items-center space-x-1 flex-shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedUpi ? 'COPIED!' : 'COPY'}</span>
                  </button>
                </div>

                <p className="font-mono text-[10px] text-gray-400 tracking-wider">
                  Scan with Google Pay, PhonePe, Paytm or any UPI App
                </p>
              </div>
            </div>
          )}

          {/* STEP 7: PAYMENT PROOF */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-orbitron font-bold text-xl text-[#00ff66] border-b border-[#1b3524] pb-3">
                STEP 7: PAYMENT PROOF ENTRY
              </h2>

              <div>
                <label className="block font-mono text-xs text-gray-300 mb-2 uppercase">
                  ENTER UPI TRANSACTION ID / UTR NUMBER *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 4278XXXXXXXX or UTR Number"
                  className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-lg px-4 py-3 text-white font-mono text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-300 mb-2 uppercase">
                  UPLOAD PAYMENT SCREENSHOT PROOF *
                </label>
                <label className="cursor-pointer border-2 border-dashed border-[#10b981]/50 hover:border-[#00ff66] bg-[#050b07] p-8 rounded-xl flex flex-col items-center justify-center text-center transition-all">
                  <Upload className="w-10 h-10 text-[#00ff66] mb-2" />
                  <span className="font-mono text-xs text-gray-300">
                    {paymentScreenshotFile ? paymentScreenshotFile.name : 'CLICK TO UPLOAD PAYMENT SCREENSHOT (JPG, PNG, WEBP)'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setPaymentScreenshotFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 8: SUBMISSION REVIEW */}
          {currentStep === 8 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <h2 className="font-orbitron font-bold text-xl text-[#00ff66] border-b border-[#1b3524] pb-3">
                STEP 8: SUBMIT REGISTRATION
              </h2>

              <p className="font-sans text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                By clicking submit, your team registration, participant student ID photos, and UPI payment UTR proof will be transmitted to the CODIENYCH 1.0 committee for manual verification.
              </p>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-12 py-4 rounded-xl font-orbitron font-extrabold text-base text-black bg-[#00ff66] hover:bg-[#10b981] hover:text-white transition-all shadow-[0_0_30px_rgba(0,255,102,0.6)] transform hover:-translate-y-1 disabled:opacity-50"
              >
                {loading ? 'TRANSMITTING DATA...' : 'SUBMIT REGISTRATION NOW'}
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-[#1b3524] mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 rounded-lg border border-[#1b3524] text-gray-300 font-mono text-xs hover:border-[#10b981] flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS</span>
              </button>
            )}

            <div className="ml-auto">
              {currentStep < 8 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 rounded-lg bg-[#00ff66] text-black font-orbitron font-bold text-xs hover:bg-[#10b981] hover:text-white transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)] flex items-center space-x-1"
                >
                  <span>NEXT STEP</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
