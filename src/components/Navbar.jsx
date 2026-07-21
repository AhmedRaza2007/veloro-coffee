import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User, ShieldCheck, Compass, Calendar, Volume2, VolumeX, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar({ onOpenCart, onOpenAuth, onOpenTracker, onOpenReserve, onSearchClick, activeTab, setActiveTab }) {
  const { cartCount, wishlist, user, currency, setCurrency } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);

  // Synthesized Luxury Coffee Pour & Lounge Ambiance via Web Audio API
  const toggleAudio = () => {
    if (!audioPlaying) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.015; // Soft pink noise stream
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(ctx.destination);
      whiteNoise.start();

      setAudioCtx({ ctx, source: whiteNoise });
      setAudioPlaying(true);
    } else {
      if (audioCtx) {
        audioCtx.source.stop();
        audioCtx.ctx.close();
      }
      setAudioPlaying(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0908]/85 backdrop-blur-xl border-b border-[#D4AF37]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Crest & Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('store')}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#9A7B1C] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 border border-[#D4AF37]/40">
              <span className="font-serif font-bold text-xl text-[#0A0908]">V</span>
            </div>
            <div>
              <span className="font-serif text-2xl tracking-[0.25em] font-bold text-gold-gradient block leading-none">
                VELORO
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#A39B8B] uppercase font-mono block mt-1">
                HAUTE COFFEE CELLAR
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('store')} 
              className={`text-sm tracking-widest uppercase transition-colors font-medium py-1 border-b-2 ${
                activeTab === 'store' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-[#FAF6F0]/80 hover:text-[#D4AF37]'
              }`}
            >
              Collection
            </button>

            <button 
              onClick={onOpenReserve} 
              className="text-sm tracking-widest uppercase transition-colors font-medium text-[#FAF6F0]/80 hover:text-[#D4AF37] flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>VIP Lounge</span>
            </button>

            <button 
              onClick={onOpenTracker} 
              className="text-sm tracking-widest uppercase transition-colors font-medium text-[#FAF6F0]/80 hover:text-[#D4AF37] flex items-center space-x-1.5"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>Track Order</span>
            </button>

            <button 
              onClick={() => setActiveTab('admin')} 
              className={`text-sm tracking-widest uppercase transition-all font-medium py-1 px-3 rounded-full border ${
                activeTab === 'admin' ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]' : 'border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10'
              } flex items-center space-x-1.5`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            
            {/* Audio Ambiance Toggle */}
            <button
              onClick={toggleAudio}
              title="Toggle Coffee Bar Ambient Sound"
              className="p-2 rounded-full border border-[#D4AF37]/20 text-[#A39B8B] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition"
            >
              {audioPlaying ? <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#141210] text-[#FAF6F0] text-xs font-mono border border-[#D4AF37]/30 rounded-md px-2 py-1.5 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
              <option value="¥">¥ JPY</option>
            </select>

            {/* Search Trigger */}
            <button
              onClick={onSearchClick}
              className="p-2 text-[#FAF6F0]/80 hover:text-[#D4AF37] transition"
              title="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setActiveTab('store')}
              className="relative p-2 text-[#FAF6F0]/80 hover:text-[#D4AF37] transition"
              title="Reserve Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0A0908] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <button
              onClick={onOpenAuth}
              className="p-2 text-[#FAF6F0]/80 hover:text-[#D4AF37] transition"
              title={user ? `Logged in as ${user.name}` : "Sign In"}
            >
              {user ? (
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center font-bold text-xs text-[#D4AF37]">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {/* Cart Drawer Button */}
            <button
              onClick={onOpenCart}
              className="relative bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0908] font-bold px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 transition duration-200"
            >
              <ShoppingBag className="w-4 h-4 text-[#0A0908]" />
              <span className="text-xs uppercase tracking-wider hidden sm:inline">Cart</span>
              <span className="bg-[#0A0908] text-[#D4AF37] text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ml-1">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#FAF6F0]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0908] border-b border-[#D4AF37]/30 px-6 py-6 space-y-4">
          <button 
            onClick={() => { setActiveTab('store'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-serif text-lg tracking-widest text-[#FAF6F0] hover:text-[#D4AF37]"
          >
            Collection
          </button>
          <button 
            onClick={() => { onOpenReserve(); setMobileMenuOpen(false); }}
            className="block w-full text-left font-serif text-lg tracking-widest text-[#FAF6F0] hover:text-[#D4AF37]"
          >
            VIP Tasting Room
          </button>
          <button 
            onClick={() => { onOpenTracker(); setMobileMenuOpen(false); }}
            className="block w-full text-left font-serif text-lg tracking-widest text-[#FAF6F0] hover:text-[#D4AF37]"
          >
            Track Order
          </button>
          <button 
            onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
            className="block w-full text-left font-serif text-lg tracking-widest text-[#D4AF37]"
          >
            Admin Dashboard
          </button>
        </div>
      )}
    </header>
  );
}
