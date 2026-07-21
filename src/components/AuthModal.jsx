import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, user, logout, showToast } = useStore();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Pre-fill Admin Demo Credentials
  const handleQuickAdmin = () => {
    setEmail('admin@veloro.com');
    setPassword('veloro123');
    showToast('Admin Demo Credentials Loaded', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
          login(data.user);
          onClose();
        } else {
          showToast(data.message || 'Login failed', 'error');
        }
      } else if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (data.success) {
          login(data.user);
          onClose();
        } else {
          showToast(data.message || 'Registration failed', 'error');
        }
      } else if (mode === 'forgot') {
        showToast(`Password reset link sent to ${email}`, 'gold');
        setMode('login');
      }
    } catch (err) {
      showToast('Authentication server error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0908]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-md bg-[#141210] rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#A39B8B] hover:text-[#D4AF37] transition"
        >
          <X className="w-6 h-6" />
        </button>

        {user ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-2xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#FAF6F0]">{user.name}</h3>
              <p className="text-xs text-[#A39B8B] font-mono">{user.email}</p>
              <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] uppercase font-mono px-3 py-1 rounded-full mt-2 border border-[#D4AF37]/30">
                Role: {user.role}
              </span>
            </div>

            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full bg-[#1E1915] border border-red-500/40 text-red-400 font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl hover:bg-red-500/20 transition"
            >
              Sign Out of Account
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center space-y-2 mb-6">
              <h2 className="font-serif text-3xl font-bold text-gold-gradient">
                {mode === 'login' ? 'Veloro VIP Access' : mode === 'register' ? 'Join Veloro Reserve' : 'Reset Password'}
              </h2>
              <p className="text-xs text-[#A39B8B]">
                {mode === 'login' ? 'Sign in to access cellar allocations & order history.' : 'Create an exclusive account.'}
              </p>
            </div>

            {/* Quick Demo Credentials Banner */}
            <div className="mb-6 p-3 rounded-xl bg-[#0A0908] border border-[#D4AF37]/30 flex items-center justify-between text-xs">
              <div className="text-[#A39B8B] font-mono">
                <span className="text-[#D4AF37] font-bold block">Admin Credentials:</span>
                admin@veloro.com / veloro123
              </div>
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 text-[10px] font-mono hover:bg-[#D4AF37] hover:text-[#0A0908] transition"
              >
                Auto Fill
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Lady Eleanor Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-[#A39B8B] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@veloro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#0A0908] font-bold text-sm uppercase tracking-wider py-3.5 rounded-2xl shadow-xl hover:brightness-110 transition"
              >
                {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Account' : mode === 'register' ? 'Create VIP Membership' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex justify-between text-xs text-[#A39B8B]">
              {mode === 'login' ? (
                <>
                  <button onClick={() => setMode('register')} className="hover:text-[#D4AF37]">Create Account</button>
                  <button onClick={() => setMode('forgot')} className="hover:text-[#D4AF37]">Forgot Password?</button>
                </>
              ) : (
                <button onClick={() => setMode('login')} className="hover:text-[#D4AF37] text-center w-full">Back to Sign In</button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
