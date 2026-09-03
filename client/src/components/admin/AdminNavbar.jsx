import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const AdminNavbar = ({ title, showBack = false, backTo = '/admin' }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  return (
    <header className="bg-[#0a140e]/95 backdrop-blur-md border-b border-[#1b3524] px-4 sm:px-6 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Logo or Back + Title */}
        <div className="flex items-center space-x-3 min-w-0">
          {showBack ? (
            <Link
              to={backTo}
              className="p-1.5 sm:p-2 rounded-lg bg-[#0f2416] border border-[#1b3524] text-[#00ff66] hover:bg-[#00ff66] hover:text-black flex-shrink-0 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          ) : (
            <Link
              to="/admin"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0f2416] border border-[#00ff66] flex items-center justify-center text-[#00ff66] flex-shrink-0 shadow-[0_0_10px_rgba(0,255,102,0.3)]"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}

          <div className="truncate">
            <h1 className="font-orbitron font-extrabold text-sm sm:text-base lg:text-lg text-white truncate tracking-wide">
              {title || (
                <>
                  CODIENYCH 1.0 <span className="text-[#00ff66]">ADMIN</span>
                </>
              )}
            </h1>
            <span className="hidden sm:block text-[10px] font-mono text-gray-400 leading-none mt-0.5">
              CONTROL CENTER PORTAL
            </span>
          </div>
        </div>

        {/* Right Side: Logout Button */}
        <div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/50 font-mono text-xs flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
