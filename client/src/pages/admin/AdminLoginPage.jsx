import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#050b07] text-white flex items-center justify-center px-4">
      <div className="bg-[#0a140e] border-2 border-[#10b981] rounded-2xl p-8 sm:p-10 max-w-md w-full shadow-[0_0_40px_rgba(0,255,102,0.3)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0f2416] border border-[#00ff66] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#00ff66] shadow-[0_0_20px_#00ff66]">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-orbitron font-extrabold text-2xl text-white tracking-wider">
            ADMIN <span className="text-[#00ff66]">CONTROL CENTER</span>
          </h1>
          <p className="font-mono text-xs text-gray-400 mt-1">
            AUTHORIZED CODIENYCH 1.0 PERSONNEL ONLY
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs font-mono flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-mono text-xs text-gray-300 mb-1.5 uppercase">
              ADMIN EMAIL
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@codienych.com"
                className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-gray-300 mb-1.5 uppercase">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00ff66] hover:bg-[#10b981] text-black font-orbitron font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] uppercase tracking-wider"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO ADMIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
