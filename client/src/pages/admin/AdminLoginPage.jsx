import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, Anchor } from 'lucide-react';
import api from '../../services/api';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        navigate('/admin');
      } else {
        setError(response.data.message || 'Login failed.');
      }
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Invalid credentials or server error.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03070b] text-[#f4e6c3] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ocean Ambient Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,45,66,0.35)_0%,rgba(3,7,11,0.95)_100%)] pointer-events-none" />

      <div className="bg-[#08121a]/95 border-2 border-[#ffd700]/70 rounded-2xl p-8 sm:p-10 max-w-md w-full shadow-[0_0_45px_rgba(255,215,0,0.25)] relative z-10 backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0c1e2d] border border-[#ffd700] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.4)]">
            <Anchor className="w-8 h-8 text-[#ffd700]" />
          </div>
          <h1 className="font-pirate font-black text-3xl text-white tracking-wider">
            ADMIRAL <span className="text-[#ffd700] pirate-gold-glow">COMMAND CENTER</span>
          </h1>
          <p className="font-cinzel text-xs text-[#e5c158] mt-1 tracking-wider">
            AUTHORIZED CODIENYCH 1.0 PERSONNEL ONLY
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs font-cinzel flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-cinzel text-xs text-[#e5c158] mb-1.5 uppercase tracking-wider">
              ADMIRAL EMAIL
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@codienych.com"
                className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f4e6c3] font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-cinzel text-xs text-[#e5c158] mb-1.5 uppercase tracking-wider">
              CIPHER PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#04090f] border border-[#3a2e1d] focus:border-[#ffd700] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f4e6c3] font-mono outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe043] hover:to-[#d4af37] text-black font-cinzel font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] uppercase tracking-wider cursor-pointer"
          >
            {loading ? 'DECIPHERING CREDENTIALS...' : 'BOARD COMMAND DECK'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
