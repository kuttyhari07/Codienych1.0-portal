import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, CornerDownLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EVENT_CONFIG } from '../utils/config';
import { playChirp, playLaserBlip, playVictoryFanfare } from '../utils/cyberSound';

const CyberTerminalCli = ({ isOpen, onClose, onTriggerMatrix }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { text: '==================================================', type: 'system' },
    { text: '⚡ CODIENYCH 1.0 TACTICAL SHELL // v1.0.0-PROD', type: 'system' },
    { text: 'Type "help" to list available operational commands.', type: 'info' },
    { text: '==================================================', type: 'system' },
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      playChirp();

      const newHistory = [...history, { text: `> ${input}`, type: 'user' }];

      switch (cmd) {
        case 'help':
          newHistory.push(
            { text: 'COMMANDS AVAILABLE:', type: 'system' },
            { text: '  fee       - View registration fee & team pricing breakdown', type: 'info' },
            { text: '  dates     - View important registration & hackathon dates', type: 'info' },
            { text: '  rules     - View squad eligibility and event directives', type: 'info' },
            { text: '  prizes    - Inspect Upto ₹50,000+ bounties & Free Internship perks', type: 'info' },
            { text: '  matrix    - Engage full-screen digital matrix cascade', type: 'info' },
            { text: '  register  - Jump directly to team registration form', type: 'info' },
            { text: '  contact   - Display coordinator hotlines and support', type: 'info' },
            { text: '  clear     - Wipe terminal screen', type: 'info' },
            { text: '  exit      - Terminate tactical terminal session', type: 'info' }
          );
          break;

        case 'fee':
          newHistory.push(
            { text: `ENTRY FEE: ₹${EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} / Member`, type: 'highlight' },
            { text: `  • 3 Members Squad: ₹${(3 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()}`, type: 'info' },
            { text: `  • 4 Members Squad: ₹${(4 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()}`, type: 'info' },
            { text: `  • 5 Members Squad: ₹${(5 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()}`, type: 'info' },
            { text: `  • 6 Members Squad: ₹${(6 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()}`, type: 'info' },
            { text: `  • UPI ID: ${EVENT_CONFIG.UPI_ID}`, type: 'info' }
          );
          break;

        case 'dates':
          newHistory.push(
            { text: `REGISTRATION DEADLINE: ${EVENT_CONFIG.REGISTRATION_DEADLINE_DISPLAY}`, type: 'highlight' },
            { text: `HACKATHON START: ${EVENT_CONFIG.HACKATHON_DATES_DISPLAY}`, type: 'highlight' },
            { text: 'VENUE: ESEC Convention Center, Erode Sengunthar Engineering College', type: 'info' }
          );
          break;

        case 'rules':
          newHistory.push(
            { text: 'SQUAD DIRECTIVES:', type: 'highlight' },
            { text: '  • Team Size: 3 to 6 members (3 members can also register!)', type: 'info' },
            { text: '  • Eligibility: UG students from recognized colleges & ESEC (Limited slots for ESEC)', type: 'info' },
            { text: '  • One Leader registers the complete team', type: 'info' },
            { text: '  • College physical ID card mandatory for every participant', type: 'info' }
          );
          break;

        case 'prizes':
          playVictoryFanfare();
          newHistory.push(
            { text: 'VAULT REWARDS (UPTO ₹50,000+ & FREE INTERNSHIP):', type: 'highlight' },
            { text: '  🥇 1st Prize: Top Cash Bounty Share + Free Internship', type: 'highlight' },
            { text: '  🥈 2nd Prize: Cash Bounty Share + Free Internship', type: 'highlight' },
            { text: '  🥉 3rd Prize: Cash Bounty Share + Goodies & Perks', type: 'highlight' },
            { text: '  💼 Free Internship Opportunities for top performers!', type: 'info' }
          );
          break;

        case 'matrix':
          if (onTriggerMatrix) onTriggerMatrix();
          newHistory.push({ text: '⚡ MATRIX RAIN CASCADE TRIGGERED!', type: 'highlight' });
          break;

        case 'register':
          onClose();
          navigate('/register');
          return;

        case 'contact':
          newHistory.push(
            { text: `HELPLINE: ${EVENT_CONFIG.PHONE_NUMBER} | EMAIL: ${EVENT_CONFIG.ORGANIZER_EMAIL}`, type: 'info' },
            { text: `WHATSAPP GROUP: ${EVENT_CONFIG.WHATSAPP_GROUP_URL}`, type: 'info' }
          );
          break;

        case 'clear':
          setHistory([]);
          setInput('');
          return;

        case 'exit':
        case 'quit':
          onClose();
          return;

        case '':
          break;

        default:
          newHistory.push({
            text: `Command not recognized: "${cmd}". Type "help" for a list of directives.`,
            type: 'error',
          });
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg select-none">
      <div className="w-full max-w-2xl bg-[#04090f] border-2 border-[#ffd700] rounded-2xl shadow-[0_0_60px_rgba(255,215,0,0.4)] overflow-hidden flex flex-col h-[480px] max-h-[85vh] pirate-corner-box">
        {/* Terminal Title Bar */}
        <div className="bg-[#0c1e2d] border-b border-[#ffd700]/40 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-[#ffd700]" />
            <span className="text-[#ffd700] font-bold">CODIENYCH_CLI // PIRATE_SESSION</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#ffd700] animate-ping" />
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#03070b] text-gray-400 hover:text-[#ffd700] border border-[#3a2e1d]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-thin">
          {history.map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed ${
                line.type === 'user'
                  ? 'text-white font-bold'
                  : line.type === 'highlight'
                  ? 'text-[#ffd700] font-bold'
                  : line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'system'
                  ? 'text-[#00e5ff]'
                  : 'text-gray-300'
              }`}
            >
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Line Input */}
        <div className="bg-[#08121a] border-t border-[#3a2e1d] p-3 flex items-center space-x-2 font-mono text-xs">
          <span className="text-[#ffd700] font-bold">pirate@codienych:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            placeholder="Type 'help'..."
            className="flex-1 bg-transparent text-white outline-none font-mono placeholder-gray-600 caret-[#ffd700]"
          />
          <CornerDownLeft className="w-3.5 h-3.5 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default CyberTerminalCli;
