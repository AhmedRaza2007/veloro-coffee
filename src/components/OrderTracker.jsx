import React, { useState } from 'react';
import { X, Search, Compass, Package, Flame, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function OrderTracker({ isOpen, onClose }) {
  const { currency } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      const res = await fetch(`/api/orders/track/${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.orders);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 1;
      case 'processing': return 1;
      case 'roasting': return 2;
      case 'shipped': return 4;
      case 'delivered': return 5;
      case 'completed': return 5;
      default: return 2;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0908]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl bg-[#141210] rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden my-8 p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#A39B8B] hover:text-[#D4AF37] transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-gold-gradient">Track Your Veloro Roast</h2>
          <p className="text-xs text-[#A39B8B]">Enter your Order ID (e.g. VEL-89421) or email address to monitor live roasting & delivery.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex space-x-3 max-w-xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-[#D4AF37]" />
            <input
              type="text"
              placeholder="Order ID (VEL-89421) or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0908] text-sm text-[#FAF6F0] border border-[#D4AF37]/40 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#D4AF37] font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0908] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl hover:brightness-110 shadow-lg shadow-[#D4AF37]/20"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            {!results || results.length === 0 ? (
              <div className="text-center py-8 text-[#A39B8B] text-xs">
                No active orders found matching "{searchQuery}". Try searching for <span className="text-[#D4AF37] font-mono">VEL-89421</span>.
              </div>
            ) : (
              results.map((order) => {
                const currentStep = getStatusStep(order.orderStatus);

                return (
                  <div key={order.id} className="p-6 rounded-2xl bg-[#0A0908]/80 border border-[#D4AF37]/30 space-y-6">
                    
                    {/* Order Top Meta */}
                    <div className="flex flex-wrap justify-between items-center pb-4 border-b border-[#D4AF37]/20 text-xs">
                      <div>
                        <span className="font-mono text-[#D4AF37] font-bold text-base block">{order.id}</span>
                        <span className="text-[#A39B8B] font-mono">Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-full font-mono font-bold uppercase text-[11px]">
                          Status: {order.orderStatus}
                        </span>
                        <span className="text-[#A39B8B] font-mono block mt-1">{order.trackingCode}</span>
                      </div>
                    </div>

                    {/* Timeline Tracker Graphic */}
                    <div className="py-4">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono relative">
                        
                        {/* Step 1: Confirmed */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 1 ? 'bg-[#D4AF37] text-[#0A0908]' : 'bg-[#1E1915] text-[#A39B8B]'}`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className={currentStep >= 1 ? 'text-[#D4AF37] font-bold' : 'text-[#A39B8B]'}>Order Placed</span>
                        </div>

                        {/* Step 2: Roasting */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 2 ? 'bg-[#D4AF37] text-[#0A0908]' : 'bg-[#1E1915] text-[#A39B8B]'}`}>
                            <Flame className="w-4 h-4" />
                          </div>
                          <span className={currentStep >= 2 ? 'text-[#D4AF37] font-bold' : 'text-[#A39B8B]'}>Artisan Roasting</span>
                        </div>

                        {/* Step 3: In Transit */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 4 ? 'bg-[#D4AF37] text-[#0A0908]' : 'bg-[#1E1915] text-[#A39B8B]'}`}>
                            <Truck className="w-4 h-4" />
                          </div>
                          <span className={currentStep >= 4 ? 'text-[#D4AF37] font-bold' : 'text-[#A39B8B]'}>In Transit</span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 5 ? 'bg-[#D4AF37] text-[#0A0908]' : 'bg-[#1E1915] text-[#A39B8B]'}`}>
                            <Package className="w-4 h-4" />
                          </div>
                          <span className={currentStep >= 5 ? 'text-[#D4AF37] font-bold' : 'text-[#A39B8B]'}>Delivered</span>
                        </div>

                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="pt-2 space-y-2">
                      <span className="text-xs font-mono text-[#A39B8B] block">Order Content:</span>
                      {order.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-xs text-[#FAF6F0] bg-[#141210] p-2.5 rounded-xl border border-[#D4AF37]/15">
                          <span>{it.quantity}x {it.name} ({it.grind || 'Whole Bean'})</span>
                          <span className="font-mono text-[#D4AF37]">{currency}{(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}
