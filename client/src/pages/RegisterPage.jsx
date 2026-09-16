import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, ChevronLeft, Upload, Check, AlertCircle, QrCode, Copy, CheckCircle2, ArrowRight, Anchor, Compass } from 'lucide-react';
import api from '../services/api';
import { EVENT_CONFIG } from '../utils/config';

const steps = [
  '1. CREW INFO',
  '2. CAPTAIN',
  '3. CREW MATES',
  '4. PASS CARDS',
  '5. REVIEW',
  '6. TREASURY',
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

  // Participant #1 (Leader / Captain)
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

  // Client-side quick image compression to make uploads instant (< 1 second)
  const compressImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) return file;
    if (file.size < 500 * 1024) return file;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                  type: 'image/webp',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/webp',
            0.8
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleLeaderIdCard = async (file) => {
    if (!file) return;
    const processed = await compressImage(file);
    setLeader((prev) => ({ ...prev, idCardFile: processed }));
  };

  const handleMemberIdCard = async (index, file) => {
    if (!file) return;
    const processed = await compressImage(file);
    const updated = [...members];
    updated[index].idCardFile = processed;
    setMembers(updated);
  };

  const handlePaymentScreenshot = async (file) => {
    if (!file) return;
    const processed = await compressImage(file);
    setPaymentScreenshotFile(processed);
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
        setErrorMessage('Please enter your Fleet / Team Name.');
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
        setErrorMessage('Please fill in all mandatory Team Leader (Captain) details.');
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
          setErrorMessage(`Please fill in all mandatory details for Crew Member #${i + 2}.`);
          return false;
        }
        if (!m.email.includes('@')) {
          setErrorMessage(`Invalid email address for Crew Member #${i + 2}.`);
          return false;
        }
      }
    }

    if (step === 4) {
      if (!leader.idCardFile) {
        setErrorMessage('Please upload the Student ID Card photo for Team Captain.');
        return false;
      }
      for (let i = 0; i < members.length; i++) {
        if (!members[i].idCardFile) {
          setErrorMessage(`Please upload the Student ID Card photo for Crew Member #${i + 2}.`);
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
      <div className="min-h-screen bg-[#03070b] pt-28 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Ocean Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,45,66,0.3)_0%,rgba(3,7,11,0.95)_100%)] pointer-events-none" />

        <div className="bg-[#08121a]/95 border-2 border-[#ffd700] rounded-2xl p-8 sm:p-12 max-w-xl w-full text-center shadow-[0_0_50px_rgba(255,215,0,0.3)] animate-fadeIn relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] via-[#f39c12] to-[#b8860b] rounded-full flex items-center justify-center mx-auto mb-6 text-black shadow-[0_0_25px_#ffd700]">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="font-pirate font-black text-4xl text-[#ffd700] mb-2 pirate-gold-glow">
            TREASURE TRIBUTE SUBMITTED
          </h2>
          <p className="font-cinzel text-xs text-[#e5c158] uppercase tracking-widest mb-6">
            FLEET REGISTRATION LOGGED INTO HIGH SEAS MANIFEST
          </p>

          <div className="bg-[#04090f] border border-[#3a2e1d] rounded-xl p-6 text-left space-y-3 mb-8 font-mono text-sm">
            <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
              <span className="text-gray-400 font-cinzel">Registration ID:</span>
              <span className="text-[#ffd700] font-bold">{submissionSuccess.registrationId}</span>
            </div>
            <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
              <span className="text-gray-400 font-cinzel">Fleet Name:</span>
              <span className="text-white font-bold">{submissionSuccess.teamName}</span>
            </div>
            <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
              <span className="text-gray-400 font-cinzel">Crew Size:</span>
              <span className="text-white">{submissionSuccess.teamSize} Pirates</span>
            </div>
            <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
              <span className="text-gray-400 font-cinzel">Total Gold Tribute:</span>
              <span className="text-[#ffd700] font-bold">₹{submissionSuccess.expectedAmount}</span>
            </div>
            <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
              <span className="text-gray-400 font-cinzel">Transaction UTR:</span>
              <span className="text-gray-300">{submissionSuccess.transactionId}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-400 font-cinzel">Verification Status:</span>
              <span className="text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 text-xs font-cinzel">
                AWAITING ADMIRAL VERIFICATION
              </span>
            </div>
          </div>

          {/* SUCCESS NOTIFICATION */}
          <div className="space-y-2 mb-6">
            <div className="p-4 rounded-xl text-left font-cinzel text-xs border bg-[#061928]/80 border-[#00e5ff]/40 text-[#00e5ff] flex items-start space-x-3">
              <div className="mt-0.5">📜</div>
              <div className="flex-1">
                <div className="font-bold flex items-center justify-between">
                  <span>DISPATCH TRANSMITTED</span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">
                    QUEUED ✅
                  </span>
                </div>
                <p className="mt-1 text-gray-300 font-sans text-xs">
                  Your crew details and payment receipt have been safely recorded and queued for committee verification.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#0a1724] border border-[#ffd700]/30 rounded-xl mb-8 font-cinzel text-xs text-[#f4e6c3] text-left">
            ⚓ <strong>Next Steps:</strong> The Admirals will verify your payment UTR and student ID cards. You will receive an automated confirmation bird once approved!
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/status?id=${submissionSuccess.registrationId}`}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(255,215,0,0.5)] uppercase tracking-wider text-center"
            >
              TRACK CREW STATUS
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 px-4 bg-[#061019] border border-[#3a2e1d] text-gray-300 hover:text-[#ffd700] font-cinzel text-xs rounded-lg text-center transition-colors"
            >
              RETURN TO FLAGSHIP
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Ambient Ocean Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,45,66,0.25)_0%,rgba(3,7,11,0.95)_100%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs font-cinzel text-[#ffd700] mb-3 hover:underline">
            <ChevronLeft className="w-4 h-4" />
            <span>RETURN TO FLAGSHIP</span>
          </Link>
          <h1 className="font-pirate font-black text-4xl sm:text-6xl text-white tracking-wider">
            VOYAGE <span className="text-[#ffd700] pirate-gold-glow">REGISTRATION</span>
          </h1>
          <p className="font-cinzel text-xs text-[#e5c158] mt-2 tracking-wider">
            OFFICIAL FLEET ENTRY • ₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} TRIBUTE PER PIRATE
          </p>
        </div>

        {/* Wizard Progress Indicator */}
        <div className="mb-10 overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[650px] border-b border-[#3a2e1d] pb-4">
            {steps.map((label, index) => {
              const stepNum = index + 1;
              const isActive = currentStep === stepNum;
              const isDone = currentStep > stepNum;
              return (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-cinzel text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-[#ffd700] text-black shadow-[0_0_12px_rgba(255,215,0,0.6)]'
                        : isActive
                        ? 'bg-[#0c1e2d] text-[#ffd700] border-2 border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.5)]'
                        : 'bg-[#08121a] text-gray-500 border border-[#3a2e1d]'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : stepNum}
                  </div>
                  <span
                    className={`font-cinzel text-[10px] mt-2 tracking-tighter ${
                      isActive ? 'text-[#ffd700] font-bold' : 'text-gray-500'
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
        <div className="bg-[#08121a]/95 border border-[#3a2e1d] rounded-2xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.9)] relative backdrop-blur-md">
          {/* STEP 1: TEAM INFO */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-cinzel font-bold text-xl text-[#ffd700] border-b border-[#3a2e1d] pb-3 flex items-center space-x-2">
                <Anchor className="w-5 h-5 text-[#ffd700]" />
                <span>STEP 1: FLEET INFORMATION</span>
              </h2>

              <div>
                <label className="block font-cinzel text-xs text-[#e5c158] mb-2 uppercase tracking-wider">
                  CREW / FLEET NAME *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. BLACK_PEARL_RAIDERS"
                  className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-lg px-4 py-3 text-[#f4e6c3] font-mono text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-cinzel text-xs text-[#e5c158] mb-2 uppercase tracking-wider">
                  SELECT CREW SIZE (4, 5, OR 6 PIRATES ALLOWED) *
                </label>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                  {[4, 5, 6].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleTeamSizeChange(size)}
                      className={`py-3 sm:py-4 px-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                        teamSize === size
                          ? 'bg-[#0f2334] border-[#ffd700] text-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                          : 'bg-[#04090f] border-[#3a2e1d] text-gray-400 hover:border-[#b8860b]'
                      }`}
                    >
                      <span className="font-pirate font-black text-2xl sm:text-3xl leading-tight">
                        {size}
                      </span>
                      <span className="font-cinzel text-[9px] sm:text-xs tracking-wider uppercase mt-0.5">
                        PIRATES
                      </span>
                    </button>
                  ))}
                </div>
                <p className="font-cinzel text-xs text-gray-400 mt-2.5">
                  Total Gold Tribute: <span className="text-[#ffd700] font-bold">₹{calculatedFee}</span> (₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} × {teamSize} pirates)
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: TEAM LEADER */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-cinzel font-bold text-xl text-[#ffd700] border-b border-[#3a2e1d] pb-3 flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#ffd700]" />
                <span>STEP 2: CAPTAIN DETAILS (PARTICIPANT #1)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-cinzel text-xs text-[#e5c158] mb-1">FULL NAME *</label>
                  <input
                    type="text"
                    value={leader.fullName}
                    onChange={(e) => setLeader({ ...leader, fullName: e.target.value })}
                    placeholder="Jack Sparrow"
                    className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-lg px-4 py-2.5 text-sm text-[#f4e6c3] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-cinzel text-xs text-[#e5c158] mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    value={leader.email}
                    onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                    placeholder="captain@blackpearl.com"
                    className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-lg px-4 py-2.5 text-sm text-[#f4e6c3] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-cinzel text-xs text-[#e5c158] mb-1">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    value={leader.phone}
                    onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-lg px-4 py-2.5 text-sm text-[#f4e6c3] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-cinzel text-xs text-[#e5c158] mb-1">COLLEGE NAME *</label>
                  <input
                    type="text"
                    value={leader.college}
                    onChange={(e) => setLeader({ ...leader, college: e.target.value })}
                    placeholder="Institute of Technology"
                    className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-lg px-4 py-2.5 text-sm text-[#f4e6c3] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-cinzel text-xs text-[#e5c158] mb-1">DEPARTMENT *</label>
                  <input
                    type="text"
                    value={leader.department}
                    onChange={(e) => setLeader({ ...leader, department: e.target.value })}
                    placeholder="Computer Science & Engineering"
                    className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-lg px-4 py-2.5 text-sm text-[#f4e6c3] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-cinzel text-xs text-[#e5c158] mb-1">YEAR OF STUDY *</label>
                  <select
                    value={leader.year}
                    onChange={(e) => setLeader({ ...leader, year: e.target.value })}
                    className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-lg px-4 py-2.5 text-sm text-[#f4e6c3] outline-none"
                  >
                    <option value="1st Year">1st Year (UG)</option>
                    <option value="2nd Year">2nd Year (UG)</option>
                    <option value="3rd Year">3rd Year (UG)</option>
                    <option value="4th Year">4th Year (UG)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-cinzel text-xs text-[#e5c158] mb-1">STUDENT ID / ROLL NUMBER *</label>
                  <input
                    type="text"
                    value={leader.studentId}
                    onChange={(e) => setLeader({ ...leader, studentId: e.target.value })}
                    placeholder="e.g. 21CS001"
                    className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-lg px-4 py-2.5 text-sm text-[#f4e6c3] outline-none"
                  />
                </div>

                {/* Leader ID Card Upload */}
                <div className="md:col-span-2 bg-[#04090f] border border-[#3a2e1d] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block font-cinzel font-bold text-xs text-[#ffd700]">
                      COLLEGE ID PASS PHOTO *
                    </label>
                    <p className="font-mono text-[10px] text-gray-400">
                      Upload clear photo of College ID card (JPG, PNG, WEBP max 5MB)
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <label className="cursor-pointer px-4 py-2 bg-[#0c1e2d] border border-[#ffd700]/60 rounded-lg text-xs font-cinzel text-[#ffd700] hover:bg-[#ffd700] hover:text-black transition-all inline-flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>{leader.idCardFile ? 'CHANGE PASS CARD' : 'UPLOAD PASS CARD'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => setLeader({ ...leader, idCardFile: e.target.files[0] })}
                        className="hidden"
                      />
                    </label>
                    {leader.idCardFile && (
                      <span className="block font-mono text-[10px] text-[#ffd700] mt-1 text-left sm:text-right truncate max-w-[200px]">
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
              <h2 className="font-cinzel font-bold text-xl text-[#ffd700] border-b border-[#3a2e1d] pb-3">
                STEP 3: CREW MATES DETAILS ({members.length} PIRATES)
              </h2>

              {members.map((member, idx) => (
                <div key={idx} className="bg-[#04090f] border border-[#3a2e1d] p-5 rounded-xl space-y-4">
                  <h3 className="font-cinzel font-bold text-sm text-[#e5c158]">
                    CREW MATE #{idx + 2}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-cinzel text-xs text-gray-400 mb-1">FULL NAME *</label>
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) => handleMemberChange(idx, 'fullName', e.target.value)}
                        className="w-full bg-[#08121a] border border-[#3a2e1d] focus:border-[#ffd700] rounded px-3 py-2 text-sm text-[#f4e6c3] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-cinzel text-xs text-gray-400 mb-1">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        className="w-full bg-[#08121a] border border-[#3a2e1d] focus:border-[#ffd700] rounded px-3 py-2 text-sm text-[#f4e6c3] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-cinzel text-xs text-gray-400 mb-1">PHONE NUMBER *</label>
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                        className="w-full bg-[#08121a] border border-[#3a2e1d] focus:border-[#ffd700] rounded px-3 py-2 text-sm text-[#f4e6c3] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-cinzel text-xs text-gray-400 mb-1">COLLEGE NAME *</label>
                      <input
                        type="text"
                        value={member.college}
                        onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                        className="w-full bg-[#08121a] border border-[#3a2e1d] focus:border-[#ffd700] rounded px-3 py-2 text-sm text-[#f4e6c3] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-cinzel text-xs text-gray-400 mb-1">DEPARTMENT *</label>
                      <input
                        type="text"
                        value={member.department}
                        onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                        className="w-full bg-[#08121a] border border-[#3a2e1d] focus:border-[#ffd700] rounded px-3 py-2 text-sm text-[#f4e6c3] outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-cinzel text-xs text-gray-400 mb-1">STUDENT ROLL NO / ID *</label>
                      <input
                        type="text"
                        value={member.studentId}
                        onChange={(e) => handleMemberChange(idx, 'studentId', e.target.value)}
                        placeholder="Student ID / Roll No"
                        className="w-full bg-[#08121a] border border-[#3a2e1d] focus:border-[#ffd700] rounded px-3 py-2 text-sm text-[#f4e6c3] outline-none"
                      />
                    </div>

                    {/* Member ID Card Upload */}
                    <div className="md:col-span-2 bg-[#08121a] border border-[#3a2e1d] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="block font-cinzel font-bold text-xs text-[#ffd700]">
                          CREW MATE #{idx + 2} COLLEGE ID PASS PHOTO *
                        </label>
                        <p className="font-mono text-[10px] text-gray-400">
                          Upload College ID card photo (JPG, PNG, WEBP max 5MB)
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <label className="cursor-pointer px-3.5 py-1.5 bg-[#0c1e2d] border border-[#ffd700]/60 rounded-lg text-xs font-cinzel text-[#ffd700] hover:bg-[#ffd700] hover:text-black transition-all inline-flex items-center space-x-2">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{member.idCardFile ? 'CHANGE PASS CARD' : 'UPLOAD PASS CARD'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleMemberIdCard(idx, e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                        {member.idCardFile && (
                          <span className="block font-mono text-[10px] text-[#ffd700] mt-1 text-left sm:text-right truncate max-w-[200px]">
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
              <h2 className="font-cinzel font-bold text-xl text-[#ffd700] border-b border-[#3a2e1d] pb-3">
                STEP 4: STUDENT ID PASS UPLOADS ({teamSize} UPLOADS MANDATORY)
              </h2>
              <p className="font-cinzel text-xs text-gray-400">
                Supported formats: JPG, JPEG, PNG, WEBP (Max 5MB each file).
              </p>

              {/* Leader Upload */}
              <div className="bg-[#04090f] border border-[#3a2e1d] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-cinzel font-bold text-sm text-[#ffd700] block">
                    CAPTAIN: {leader.fullName || 'Team Leader'}
                  </span>
                  <span className="font-mono text-xs text-gray-400">ID: {leader.studentId}</span>
                </div>
                <div>
                  <label className="cursor-pointer px-4 py-2 bg-[#0c1e2d] border border-[#ffd700]/60 rounded-lg text-xs font-cinzel text-[#ffd700] hover:bg-[#ffd700] hover:text-black transition-all inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>{leader.idCardFile ? 'CHANGE FILE' : 'UPLOAD PASS PHOTO'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleLeaderIdCard(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {leader.idCardFile && (
                    <span className="block font-mono text-[10px] text-[#ffd700] mt-1 text-right truncate max-w-[150px]">
                      ✓ {leader.idCardFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Members Upload */}
              {members.map((member, idx) => (
                <div key={idx} className="bg-[#04090f] border border-[#3a2e1d] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-cinzel font-bold text-sm text-[#f4e6c3] block">
                      CREW MATE #{idx + 2}: {member.fullName || `Member ${idx + 2}`}
                    </span>
                    <span className="font-mono text-xs text-gray-400">ID: {member.studentId}</span>
                  </div>
                  <div>
                    <label className="cursor-pointer px-4 py-2 bg-[#0c1e2d] border border-[#ffd700]/60 rounded-lg text-xs font-cinzel text-[#ffd700] hover:bg-[#ffd700] hover:text-black transition-all inline-flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>{member.idCardFile ? 'CHANGE FILE' : 'UPLOAD PASS PHOTO'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleMemberIdCard(idx, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {member.idCardFile && (
                      <span className="block font-mono text-[10px] text-[#ffd700] mt-1 text-right truncate max-w-[150px]">
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
              <h2 className="font-cinzel font-bold text-xl text-[#ffd700] border-b border-[#3a2e1d] pb-3">
                STEP 5: REVIEW FLEET ROSTER
              </h2>

              <div className="bg-[#04090f] border border-[#3a2e1d] rounded-xl p-6 space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
                  <span className="text-gray-400 font-cinzel">Fleet Name:</span>
                  <span className="text-[#ffd700] font-bold">{teamName}</span>
                </div>
                <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
                  <span className="text-gray-400 font-cinzel">Crew Size:</span>
                  <span className="text-white">{teamSize} Pirates</span>
                </div>
                <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
                  <span className="text-gray-400 font-cinzel">Captain:</span>
                  <span className="text-white">{leader.fullName} ({leader.email})</span>
                </div>
                <div className="flex justify-between border-b border-[#3a2e1d] pb-2">
                  <span className="text-gray-400 font-cinzel">ID Passes Attached:</span>
                  <span className="text-[#ffd700] font-bold">{1 + members.filter(m => m.idCardFile).length}/{teamSize} Uploaded</span>
                </div>
                <div className="flex justify-between pt-2 text-base">
                  <span className="text-gray-300 font-bold font-cinzel">Total Registration Fee:</span>
                  <span className="text-[#ffd700] font-extrabold font-pirate text-2xl pirate-gold-glow">₹{calculatedFee}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: UPI & BANK PAYMENT */}
          {currentStep === 6 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <h2 className="font-cinzel font-bold text-xl text-[#ffd700] border-b border-[#3a2e1d] pb-3">
                STEP 6: TREASURY TRIBUTE PAYMENT
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                {/* 1. Official College Bank Account Card */}
                <div className="bg-[#04090f] border-2 border-[#ffd700]/70 rounded-3xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.15)] space-y-4">
                  <div className="flex items-center space-x-3 pb-3 border-b border-[#3a2e1d]">
                    <div className="w-12 h-12 rounded-2xl bg-[#0c1e2d] border border-[#ffd700] flex items-center justify-center font-cinzel font-extrabold text-[#ffd700] text-xs shadow-md">
                      CUB
                    </div>
                    <div>
                      <h3 className="font-cinzel font-bold text-base text-white">
                        {EVENT_CONFIG.BANK_NAME}
                      </h3>
                      <span className="font-mono text-[11px] text-[#ffd700] block">
                        {EVENT_CONFIG.BRANCH_NAME}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="bg-[#08121a] p-3 rounded-xl border border-[#3a2e1d]">
                      <span className="text-gray-400 block text-[10px] font-cinzel">BENEFICIARY / ACCOUNT NAME</span>
                      <span className="text-white font-bold text-xs">{EVENT_CONFIG.ACCOUNT_NAME}</span>
                    </div>

                    <div className="bg-[#08121a] p-3 rounded-xl border border-[#3a2e1d] flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 block text-[10px] font-cinzel">SB ACCOUNT NUMBER</span>
                        <span className="text-[#ffd700] font-extrabold text-base tracking-wider">{EVENT_CONFIG.ACCOUNT_NUMBER}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(EVENT_CONFIG.ACCOUNT_NUMBER);
                          alert('Account Number copied to clipboard!');
                        }}
                        className="px-2.5 py-1 bg-[#0c1e2d] hover:bg-[#ffd700] text-[#ffd700] hover:text-black border border-[#ffd700]/60 rounded text-[10px] font-cinzel font-bold transition-all"
                      >
                        COPY
                      </button>
                    </div>

                    <div className="bg-[#08121a] p-3 rounded-xl border border-[#3a2e1d] flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 block text-[10px] font-cinzel">IFS CODE (CUB)</span>
                        <span className="text-white font-bold text-sm tracking-wider">{EVENT_CONFIG.IFSC_CODE}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(EVENT_CONFIG.IFSC_CODE);
                          alert('IFSC Code copied to clipboard!');
                        }}
                        className="px-2.5 py-1 bg-[#0c1e2d] hover:bg-[#ffd700] text-[#ffd700] hover:text-black border border-[#ffd700]/60 rounded text-[10px] font-cinzel font-bold transition-all"
                      >
                        COPY
                      </button>
                    </div>

                    <div className="bg-[#08121a] p-3 rounded-xl border border-[#3a2e1d] flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 block text-[10px] font-cinzel">UPI VPA / ID</span>
                        <span className="text-[#00e5ff] font-bold text-xs">{EVENT_CONFIG.UPI_ID}</span>
                      </div>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="px-2.5 py-1 bg-[#ffd700] text-black font-cinzel font-bold rounded text-[10px] transition-all shadow-[0_0_10px_#ffd700]"
                      >
                        {copiedUpi ? 'COPIED!' : 'COPY'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Official Dynamic QR Code Card */}
                <div className="bg-[#04090f] border-2 border-[#ffd700] rounded-3xl p-6 shadow-[0_0_35px_rgba(255,215,0,0.25)] flex flex-col items-center justify-center text-center">
                  <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#3a2e1d]">
                    <span className="font-cinzel font-bold text-xs text-gray-300">SCAN & PAY VIA UPI</span>
                    <span className="font-cinzel text-[10px] px-2 py-0.5 rounded bg-[#0c1e2d] text-[#ffd700] border border-[#ffd700]/40">
                      CITY UNION BANK UPI
                    </span>
                  </div>

                  {/* Dynamic QR Code tailored to Exact Team Fee */}
                  <div className="w-56 h-56 bg-white p-3 rounded-2xl flex items-center justify-center mb-3 shadow-xl border-2 border-[#ffd700] relative">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=${encodeURIComponent(
                        `upi://pay?pa=${EVENT_CONFIG.UPI_ID}&pn=${encodeURIComponent(
                          EVENT_CONFIG.UPI_MERCHANT_NAME
                        )}&am=${calculatedFee}&cu=INR&tn=${encodeURIComponent(`CODIENYCH 1.0 Crew ${teamName || 'Registration'}`)}`
                      )}`}
                      alt="College CUB UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Dynamic Exact Fee Display */}
                  <div className="font-pirate font-black text-4xl text-[#ffd700] pirate-gold-glow mb-0.5">
                    ₹{calculatedFee}
                  </div>
                  <p className="font-cinzel text-[11px] text-gray-400 mb-2">
                    ({teamSize} Pirates × ₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} per person)
                  </p>

                  <div className="w-full bg-[#08121a] border border-[#3a2e1d] rounded-xl p-2 text-center">
                    <span className="font-cinzel text-[10px] text-gray-300 block">
                      Payee: <strong>{EVENT_CONFIG.UPI_MERCHANT_NAME}</strong>
                    </span>
                    <span className="font-mono text-[10px] text-[#ffd700] block font-bold">
                      UPI ID: {EVENT_CONFIG.UPI_ID}
                    </span>
                  </div>

                  <p className="font-cinzel text-[10px] text-gray-400 mt-3">
                    Supported: GPay, PhonePe, Paytm, BHIM, Cred, CUB Mobile & All UPI Apps
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: PAYMENT PROOF */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-cinzel font-bold text-xl text-[#ffd700] border-b border-[#3a2e1d] pb-3">
                STEP 7: PAYMENT PROOF ENTRY
              </h2>

              <div>
                <label className="block font-cinzel text-xs text-[#e5c158] mb-2 uppercase tracking-wider">
                  ENTER UPI TRANSACTION ID / UTR NUMBER *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 4278XXXXXXXX or UTR Number"
                  className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-lg px-4 py-3 text-white font-mono text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-cinzel text-xs text-[#e5c158] mb-2 uppercase tracking-wider">
                  UPLOAD PAYMENT RECEIPT SCREENSHOT *
                </label>
                <label className="cursor-pointer border-2 border-dashed border-[#ffd700]/50 hover:border-[#ffd700] bg-[#04090f] p-8 rounded-xl flex flex-col items-center justify-center text-center transition-all">
                  <Upload className="w-10 h-10 text-[#ffd700] mb-2" />
                  <span className="font-cinzel text-xs text-[#f4e6c3]">
                    {paymentScreenshotFile ? paymentScreenshotFile.name : 'CLICK TO UPLOAD PAYMENT SCREENSHOT (JPG, PNG, WEBP)'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handlePaymentScreenshot(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 8: SUBMISSION REVIEW */}
          {currentStep === 8 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <h2 className="font-cinzel font-bold text-xl text-[#ffd700] border-b border-[#3a2e1d] pb-3">
                STEP 8: SUBMIT REGISTRATION
              </h2>

              <p className="font-cinzel text-sm text-[#f4e6c3] max-w-lg mx-auto leading-relaxed">
                By clicking submit, your team manifest, pirate student ID photos, and UPI payment UTR proof will be transmitted to the CODIENYCH 1.0 Admirals for verification.
              </p>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-12 py-4 rounded-xl font-cinzel font-extrabold text-base text-black bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] transition-all shadow-[0_0_30px_rgba(255,215,0,0.6)] transform hover:-translate-y-1 disabled:opacity-50 uppercase tracking-wider cursor-pointer"
              >
                {loading ? 'TRANSMITTING MANIFEST...' : 'SUBMIT CREW REGISTRATION NOW'}
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-[#3a2e1d] mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 rounded-lg border border-[#3a2e1d] text-gray-300 font-cinzel text-xs hover:border-[#ffd700] hover:text-[#ffd700] flex items-center space-x-1 transition-colors"
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
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] text-black font-cinzel font-bold text-xs hover:from-[#ffe043] hover:to-[#d4af37] transition-all shadow-[0_0_15px_rgba(255,215,0,0.4)] flex items-center space-x-1 uppercase tracking-wider"
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
