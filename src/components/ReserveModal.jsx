import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ReserveModal({ isOpen, onClose }) {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: '2026-08-05',
    timeSlot: '17:00 (Sunset Vintage Flight)',
    guests: 2,
    tastingTier: 'Imperial Gold Experience ($250/person)'
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setBookingConfirmed(data.reservation);
        showToast('VIP Lounge Table Reserved!', 'gold');
      } else {
        showToast('Reservation failed', 'error');
      }
    } catch (err) {
      showToast('Error booking reservation', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0908]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-[#141210] rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden my-8 p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#A39B8B] hover:text-[#D4AF37] transition"
        >
          <X className="w-6 h-6" />
        </button>

        {bookingConfirmed ? (
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] to-[#9A7B1C] flex items-center justify-center text-[#0A0908] shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest block">VIP Tasting Confirmation</span>
              <h3 className="font-serif text-3xl font-bold text-[#FAF6F0] mt-1">Reservation Confirmed</h3>
              <p className="text-xs text-[#A39B8B] mt-1">Booking Ref: <span className="text-[#D4AF37] font-mono font-bold">{bookingConfirmed.id}</span></p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0A0908]/80 border border-[#D4AF37]/30 text-left space-y-2 text-xs font-mono text-[#FAF6F0] max-w-md mx-auto">
              <div className="flex justify-between"><span>Guest:</span><span className="text-[#D4AF37]">{bookingConfirmed.customerName}</span></div>
              <div className="flex justify-between"><span>Date:</span><span>{bookingConfirmed.date}</span></div>
              <div className="flex justify-between"><span>Time:</span><span>{bookingConfirmed.timeSlot}</span></div>
              <div className="flex justify-between"><span>Party Size:</span><span>{bookingConfirmed.guests} Guests</span></div>
              <div className="flex justify-between"><span>Tier:</span><span className="text-[#D4AF37]">{bookingConfirmed.tastingTier}</span></div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0908] font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:brightness-110"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gold-gradient">Veloro VIP Tasting Cellar</h2>
              <p className="text-xs text-[#A39B8B]">Book a private tasting experience hosted by our Master Roasters and Sommelier team.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Guest Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Baron Alexander Vance"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="vance@vance.co"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Time Flight</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="14:00 (Sommelier Cupping Flight)">14:00 (Cupping Flight)</option>
                    <option value="17:00 (Sunset Vintage Flight)">17:00 (Sunset Vintage)</option>
                    <option value="20:00 (Reserve Bourbon Pairing)">20:00 (Bourbon Pairing)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Guests</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  >
                    {[1, 2, 3, 4, 6, 8].map(g => (
                      <option key={g} value={g}>{g} Guests</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A39B8B] block mb-1">Tasting Experience Tier</label>
                <select
                  value={formData.tastingTier}
                  onChange={(e) => setFormData({ ...formData, tastingTier: e.target.value })}
                  className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Artisan Cupping Flight ($150/person)">Artisan Cupping Flight ($150/person)</option>
                  <option value="Imperial Gold Experience ($250/person)">Imperial Gold & 24k Edible Gold Pairing ($250/person)</option>
                  <option value="Cellar Master Private Vault ($400/person)">Cellar Master Private Vault ($400/person)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#0A0908] font-bold text-sm uppercase tracking-wider py-4 rounded-2xl shadow-xl hover:brightness-110 transition mt-4"
              >
                {loading ? 'Confirming...' : 'Request VIP Lounge Reservation'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
