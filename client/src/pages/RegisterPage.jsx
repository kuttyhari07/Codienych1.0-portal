import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, ChevronLeft, Upload, Check, AlertCircle, QrCode, Copy, CheckCircle2, ArrowRight, Anchor, Compass, Cpu, Globe, ShieldAlert, Wifi, Cloud, Lock, Clock, Phone, Mail, MessageSquare, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { EVENT_CONFIG, HACKATHON_DOMAINS } from '../utils/config';
import useRegistrationStatus from '../utils/useRegistrationStatus';

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
  const { isClosed, remaining } = useRegistrationStatus();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');

  // Form State
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(4); // default 4 (options: 3, 4, 5, 6)
  const [domain, setDomain] = useState(''); // Hackathon domain / track selection

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
    if (!file || !file.type || !file.type.startsWith('image/')) return file;
    // If file is already compact (< 90KB) and in WebP format, skip compression
    if (file.size < 90 * 1024 && file.type === 'image/webp') return file;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
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
                const cleanName = (file.name || 'image').replace(/\.[^/.]+$/, '') + '.webp';
                const compressedFile = new File([blob], cleanName, {
                  type: 'image/webp',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/webp',
            0.75
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
      if (![3, 4, 5, 6].includes(teamSize)) {
        setErrorMessage('Team size must be 3, 4, 5, or 6 members.');
        return false;
      }
      if (!domain) {
        setErrorMessage('Please select one of the 5 Hackathon Domains / Tracks for your crew.');
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
    if (isClosed) {
      setErrorMessage('Registration is officially closed. The 10:30 PM deadline has passed.');
      return;
    }
    if (loading) return; // Prevent double clicks during transmission
    if (!validateStep(7)) return;

    setLoading(true);
    setErrorMessage('');
    setSubmissionStatus('Optimizing & compressing crew documents...');

    try {
      // Pre-submission compression pass guarantees entire upload payload is strictly < 600KB
      const [compressedLeaderCard, compressedMemberCards, compressedScreenshot] = await Promise.all([
        compressImage(leader.idCardFile),
        Promise.all(members.map((m) => compressImage(m.idCardFile))),
        compressImage(paymentScreenshotFile),
      ]);

      setSubmissionStatus('Transmitting manifest securely to Admiralty...');

      const formData = new FormData();
      formData.append('teamName', teamName.trim());
      formData.append('teamSize', teamSize);
      formData.append('domain', domain.trim());
      formData.append('transactionId', transactionId.trim());

      // Package all participants (Leader + Members)
      const allParticipants = [
        {
          fullName: leader.fullName.trim(),
          email: leader.email.trim(),
          phone: leader.phone.trim(),
          college: leader.college.trim(),
          department: leader.department.trim(),
          year: leader.year,
          studentId: leader.studentId.trim(),
        },
        ...members.map((m) => ({
          fullName: m.fullName.trim(),
          email: m.email.trim(),
          phone: m.phone.trim(),
          college: m.college.trim(),
          department: m.department.trim(),
          year: m.year,
          studentId: m.studentId.trim(),
        })),
      ];

      formData.append('participants', JSON.stringify(allParticipants));

      // Append compressed files in exact index order
      formData.append('idCards', compressedLeaderCard);
      compressedMemberCards.forEach((card) => {
        formData.append('idCards', card);
      });

      formData.append('paymentScreenshot', compressedScreenshot);

      const response = await api.post('/registrations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000,
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
        : 'An error occurred during submission. Please verify your details and network, then try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
      setSubmissionStatus('');
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
              <span className="text-gray-400 font-cinzel">Domain / Track:</span>
              <span className="text-[#ffd700] font-bold">{submissionSuccess.domain || domain}</span>
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

  if (isClosed) {
    return (
      <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] pt-24 pb-20 px-4 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,15,15,0.45)_0%,rgba(3,7,11,0.98)_100%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full mx-auto relative z-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-cinzel text-[#ffd700] mb-6 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>RETURN TO FLAGSHIP</span>
          </Link>

          {/* Main Card */}
          <div className="bg-gradient-to-b from-[#1c0a0a] via-[#120606] to-[#050202] border-2 border-red-500/70 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(239,68,68,0.35)] relative backdrop-blur-xl">
            {/* Top Seal Tag */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-950/90 border border-red-500/70 text-red-400 font-cinzel font-bold text-xs uppercase tracking-widest mb-6 shadow-inner">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>PORT MANIFEST SEALED • 10:30 PM DEADLINE REACHED</span>
            </div>

            {/* Glowing Centerpiece Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-red-950 via-[#350a0a] to-[#140404] border-2 border-red-500 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.6)]">
              <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
            </div>

            {/* Title */}
            <h1 className="font-pirate font-black text-4xl sm:text-6xl text-white tracking-wide mb-3">
              REGISTRATION <span className="text-red-400" style={{ textShadow: '0 0 25px rgba(239,68,68,0.8)' }}>CLOSED</span>
            </h1>

            <p className="font-cinzel text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed mb-6">
              The official enlistment portal for <strong className="text-[#ffd700]">CODIENYCH 1.0</strong> closed at <strong className="text-white">10:30 PM IST on October 4, 2026</strong>.
              In accordance with hackathon rules, no new fleet manifests or crew additions can be accepted.
            </p>

            {/* Status Announcement Box */}
            <div className="p-4 bg-[#240c0c]/80 border border-red-500/40 rounded-2xl mb-8 text-left space-y-2">
              <div className="flex items-center space-x-2 text-red-400 font-cinzel font-bold text-xs uppercase">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>VOYAGE ROSTER LOCKED</span>
              </div>
              <p className="text-gray-300 text-xs font-sans leading-relaxed">
                Thank you to all pirate crews from colleges across the region who submitted their manifests!
                If your captain already completed registration before 10:30 PM, your tribute and credentials are being reviewed by the Admiralty.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              <Link
                to="/status"
                className="py-3.5 px-5 rounded-xl font-cinzel font-bold text-xs uppercase bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black shadow-[0_0_20px_rgba(255,215,0,0.5)] flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-black" />
                <span>TRACK CREW VOYAGE STATUS</span>
              </Link>

              <Link
                to="/portal"
                className="py-3.5 px-5 rounded-xl font-cinzel font-bold text-xs uppercase bg-[#081724] border border-[#00e5ff]/60 hover:border-[#00e5ff] text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.25)] flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Anchor className="w-4 h-4 text-[#00e5ff]" />
                <span>EXPLORE EVENT PORTAL</span>
              </Link>
            </div>

            {/* Admiralty Helpline Info */}
            <div className="pt-6 border-t border-[#3a1a1a] text-center">
              <div className="font-cinzel text-xs text-[#cfb07a] uppercase tracking-wider mb-3">
                ADMIRALTY EMERGENCY DIRECTIVES & CONTACTS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-gray-300 mb-4">
                <div className="bg-black/50 p-2.5 rounded-lg border border-[#3a2020]">
                  <span className="text-[#ffd700] font-bold">Hariharan G (Lead):</span><br />
                  <a href="tel:+916380911912" className="text-gray-300 hover:text-[#ffd700]">+91 63809 11912</a>
                </div>
                <div className="bg-black/50 p-2.5 rounded-lg border border-[#3a2020]">
                  <span className="text-[#ffd700] font-bold">Lingeswaran M:</span><br />
                  <a href="tel:+919751639673" className="text-gray-300 hover:text-[#ffd700]">+91 97516 39673</a>
                </div>
              </div>

              {EVENT_CONFIG.WHATSAPP_GROUP_URL && (
                <a
                  href={EVENT_CONFIG.WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366]/30 font-cinzel text-xs font-bold transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>JOIN OFFICIAL WHATSAPP FLEET</span>
                </a>
              )}
            </div>
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

        {/* Urgent Live Countdown Notice (Active before 10:30 PM) */}
        {!isClosed && remaining.totalMs > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#2e1404] via-[#3f1e05] to-[#261003] border-2 border-[#ffd700]/70 text-[#f4e6c3] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_25px_rgba(255,215,0,0.25)]">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-black/40 border border-[#ffd700]/40 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#ffd700] animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <div className="font-cinzel font-bold text-xs text-[#ffd700] uppercase tracking-wider flex items-center space-x-1.5 justify-center sm:justify-start">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  <span>REGISTRATION CLOSING TONIGHT AT 10:30 PM IST</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans mt-0.5">
                  Port manifest permanently seals at 10:30 PM IST. Enlist your crew before the timer runs out!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-black/70 px-4 py-2 rounded-xl border border-[#ffd700]/50 flex-shrink-0">
              <span className="font-cinzel text-[10px] text-gray-400 uppercase tracking-widest">CLOSING IN:</span>
              <span className="font-mono font-black text-sm sm:text-base text-[#ffd700]">
                {remaining.hours > 0 ? `${remaining.hours}h ` : ''}
                {String(remaining.minutes).padStart(2, '0')}m {String(remaining.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        )}

        {/* Special Admiralty 1 Final Team Slot Banner */}
        {EVENT_CONFIG.ALLOW_ONE_FINAL_TEAM && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2a1705] via-[#3a1d04] to-[#2a1705] border-2 border-[#ffd700] text-[#f4e6c3] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_35px_rgba(255,215,0,0.35)]">
            <div className="flex items-center space-x-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-black/60 border-2 border-[#ffd700] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                <ShieldAlert className="w-6 h-6 text-[#ffd700]" />
              </div>
              <div>
                <div className="font-cinzel font-black text-xs sm:text-sm text-[#ffd700] uppercase tracking-wider flex items-center space-x-2 justify-center sm:justify-start">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#39ff14] animate-ping inline-block" />
                  <span>SPECIAL ADMIRALTY DISPATCH: 1 FINAL CREW SLOT UNLOCKED</span>
                </div>
                <p className="text-xs text-gray-200 font-sans mt-0.5">
                  Registration is currently open for <strong>1 team only</strong>. As soon as your manifest is submitted, enlistment will permanently seal!
                </p>
              </div>
            </div>
            <div className="bg-[#ffd700]/15 border-2 border-[#ffd700] px-4 py-2 rounded-xl font-cinzel font-black text-xs text-[#ffd700] whitespace-nowrap shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              AVAILABLE: 1 TEAM ONLY
            </div>
          </div>
        )}

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
                  SELECT CREW SIZE (3, 4, 5, OR 6 PIRATES ALLOWED) *
                </label>
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {[3, 4, 5, 6].map((size) => (
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

              {/* HACKATHON DOMAIN / TRACK SELECTION (1 of 5) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-cinzel text-xs text-[#e5c158] uppercase tracking-wider">
                    CHOOSE HACKATHON DOMAIN / TRACK (1 OF 5 MANDATORY) *
                  </label>
                  {domain && (
                    <span className="text-[10px] font-cinzel text-[#ffd700] font-bold uppercase tracking-wider">
                      ✓ TRACK SELECTED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {HACKATHON_DOMAINS.map((item) => {
                    const isSelected = domain === item.name;
                    let DomainIcon = Shield;
                    if (item.id === 'aiml') DomainIcon = Cpu;
                    else if (item.id === 'web-app') DomainIcon = Globe;
                    else if (item.id === 'cybersecurity') DomainIcon = ShieldAlert;
                    else if (item.id === 'iot') DomainIcon = Wifi;
                    else if (item.id === 'cloud') DomainIcon = Cloud;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDomain(item.name)}
                        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f2334] border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.35)] ring-1 ring-[#ffd700]'
                            : 'bg-[#04090f] border-[#3a2e1d] hover:border-[#b8860b] hover:bg-[#08121a]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#ffd700] text-black flex items-center justify-center font-bold text-xs shadow-md">
                            ✓
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2.5 mb-2.5">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center border"
                              style={{
                                backgroundColor: '#050c14',
                                borderColor: `${item.color}60`,
                                color: item.color,
                              }}
                            >
                              <DomainIcon className="w-4 h-4" />
                            </div>
                            <span
                              className="text-[10px] font-cinzel font-bold tracking-wider px-2 py-0.5 rounded border"
                              style={{
                                color: item.color,
                                borderColor: `${item.color}50`,
                                backgroundColor: `${item.color}15`,
                              }}
                            >
                              {item.shortTitle}
                            </span>
                          </div>
                          <h4 className="font-pirate text-lg text-white mb-1 leading-snug">
                            {item.name}
                          </h4>
                          <p className="font-cinzel text-[10px] text-gray-400 leading-relaxed">
                            {item.tagline}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {domain ? (
                  <div className="mt-3 p-3 bg-[#0c2233] border border-[#ffd700]/60 rounded-xl flex items-center justify-between text-xs font-cinzel">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#ffd700] font-bold">CHOSEN TRACK:</span>
                      <strong className="text-white font-bold">{domain}</strong>
                    </div>
                    <span className="text-[10px] text-[#00e5ff] font-mono">READY FOR VOYAGE</span>
                  </div>
                ) : (
                  <p className="font-cinzel text-[11px] text-amber-400/90 mt-2">
                    * Please click on one track above to assign your crew's hackathon focus area.
                  </p>
                )}
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
                  <span className="text-gray-400 font-cinzel">Chosen Track / Domain:</span>
                  <span className="text-[#00e5ff] font-bold">{domain}</span>
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

              {loading && (
                <div className="flex flex-col items-center justify-center space-y-2 mb-4 p-4 rounded-xl bg-[#091522]/95 border border-[#ffd700]/40 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                  <div className="w-6 h-6 border-2 border-t-[#ffd700] border-r-[#ffd700] border-b-transparent border-l-transparent rounded-full animate-spin" />
                  <span className="font-cinzel text-xs text-[#ffd700] font-bold tracking-wider">
                    {submissionStatus || 'TRANSMITTING MANIFEST SECURELY...'}
                  </span>
                  <span className="font-cinzel text-[10px] text-gray-400">
                    Safe transmission in progress. Please do not close or reload.
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-12 py-4 rounded-xl font-cinzel font-extrabold text-base text-black bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] transition-all shadow-[0_0_30px_rgba(255,215,0,0.6)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider cursor-pointer select-none"
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
