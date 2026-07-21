import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowLeft, Printer, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';

export default function CheckoutModal({ isOpen, onClose, checkoutData, onOrderCompleted }) {
  const { cart, clearCart, currency, showToast, user } = useStore();

  const [formData, setFormData] = useState({
    customerName: user ? user.name : '',
    email: user ? user.email : '',
    phone: '',
    shippingAddress: '',
    city: '',
    zip: '',
    paymentMethod: 'Veloro Gold Card',
    notes: ''
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 8899',
    expiry: '12/28',
    cvv: '999'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.shippingAddress || !formData.customerName || !formData.email) {
      showToast('Please complete all shipping address fields', 'error');
      return;
    }

    try {
      setIsProcessing(true);

      // Simulate 3D Secure Luxury Verification delay
      await new Promise(r => setTimeout(r, 1800));

      const fullAddress = `${formData.shippingAddress}, ${formData.city} ${formData.zip}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          shippingAddress: fullAddress,
          items: cart,
          subtotal: checkoutData.cartSubtotal,
          discount: checkoutData.finalDiscount,
          shipping: checkoutData.shippingCost,
          totalAmount: checkoutData.grandTotal,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes
        })
      });

      const data = await res.json();

      if (data.success) {
        setCompletedOrder(data.order);
        clearCart();
        
        // Trigger Gold Confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F3E5AB', '#9A7B1C', '#FAF6F0']
        });

        showToast(`Order ${data.order.id} Placed Successfully!`, 'gold');
        onOrderCompleted(data.order);
      } else {
        showToast(data.message || 'Order failed', 'error');
      }
    } catch (err) {
      showToast('Error connecting to Veloro Order Gateway', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0908]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#141210] rounded-3xl border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-[#0A0908] border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-2xl font-bold text-gold-gradient">
              {completedOrder ? 'Order Confirmation' : 'Veloro Luxury Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A39B8B] hover:text-[#D4AF37] transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ORDER CONFIRMATION VIEW */}
        {completedOrder ? (
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center text-[#0A0908] shadow-lg shadow-[#D4AF37]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest block">Payment Authorized • Order Received</span>
              <h3 className="font-serif text-3xl font-bold text-[#FAF6F0] mt-1">Thank You, {completedOrder.customerName}</h3>
              <p className="text-xs text-[#A39B8B] mt-1">Your order code is <span className="text-[#D4AF37] font-mono font-bold">{completedOrder.id}</span></p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-6 rounded-2xl bg-[#0A0908]/80 border border-[#D4AF37]/30 text-left space-y-4 max-w-lg mx-auto">
              <div className="flex justify-between text-xs font-mono text-[#A39B8B] pb-3 border-b border-[#D4AF37]/20">
                <span>Tracking Reference:</span>
                <span className="text-[#D4AF37] font-bold">{completedOrder.trackingCode}</span>
              </div>

              <div className="space-y-2">
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-[#FAF6F0]">
                    <span>{it.quantity}x {it.name} ({it.grind})</span>
                    <span className="font-mono">{currency}{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/20 flex justify-between font-serif text-lg font-bold text-gold-gradient">
                <span>Total Paid:</span>
                <span>{currency}{completedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold flex items-center space-x-2 hover:bg-[#D4AF37]/10"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0908] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF37]/20"
              >
                Return to Store
              </button>
            </div>
          </div>
        ) : (

          /* CHECKOUT FORM VIEW */
          <form onSubmit={handleSubmitOrder} className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Shipping Address */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#FAF6F0] flex items-center space-x-2">
                <span>1. VIP Delivery Destination</span>
              </h3>

              <div>
                <label className="text-xs font-mono text-[#A39B8B] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Lord Harrison Sterling"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sterling@luxury.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-1122"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A39B8B] block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="740 Park Avenue, Apt 14B"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">ZIP / Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="10021"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A39B8B] block mb-1">Delivery Instructions (Optional)</label>
                <textarea
                  placeholder="e.g. Leave with private doorman..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl p-3 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Right Column: Payment Method & Order Summary */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#FAF6F0] mb-3">2. Express Payment Authorization</h3>
                
                {/* Method selector */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Veloro Gold Card' })}
                    className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center space-y-1 transition ${
                      formData.paymentMethod === 'Veloro Gold Card' ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'border-[#D4AF37]/20 text-[#A39B8B]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Veloro Gold Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Credit Card' })}
                    className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center space-y-1 transition ${
                      formData.paymentMethod === 'Credit Card' ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'border-[#D4AF37]/20 text-[#A39B8B]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Visa / Mastercard / Amex</span>
                  </button>
                </div>

                {/* Card input mockup */}
                <div className="p-4 rounded-2xl bg-[#0A0908]/90 border border-[#D4AF37]/30 space-y-3">
                  <div>
                    <label className="text-[10px] font-mono text-[#A39B8B] block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      className="w-full bg-[#141210] text-xs font-mono text-[#FAF6F0] border border-[#D4AF37]/20 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-[#A39B8B] block mb-1">Expires</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-[#141210] text-xs font-mono text-[#FAF6F0] border border-[#D4AF37]/20 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#A39B8B] block mb-1">CVV Security</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-[#141210] text-xs font-mono text-[#FAF6F0] border border-[#D4AF37]/20 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary box */}
                <div className="mt-4 p-4 rounded-2xl bg-[#0A0908]/60 border border-[#D4AF37]/20 space-y-2 text-xs">
                  <div className="flex justify-between text-[#A39B8B]">
                    <span>Items Total ({cart.length})</span>
                    <span className="font-mono">{currency}{checkoutData.cartSubtotal.toFixed(2)}</span>
                  </div>
                  {checkoutData.finalDiscount > 0 && (
                    <div className="flex justify-between text-[#D4AF37]">
                      <span>Discount ({checkoutData.promoCode})</span>
                      <span className="font-mono">-{currency}{checkoutData.finalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#A39B8B]">
                    <span>VIP Express Courier</span>
                    <span className="font-mono">{checkoutData.shippingCost === 0 ? 'FREE' : `${currency}${checkoutData.shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#D4AF37]/20 font-serif text-lg font-bold text-gold-gradient">
                    <span>Grand Total</span>
                    <span>{currency}{checkoutData.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#0A0908] font-bold text-sm uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-[#D4AF37]/30 hover:brightness-110 transition flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-[#0A0908] border-t-transparent rounded-full animate-spin"></span>
                    <span>Authorizing 3D Secure...</span>
                  </span>
                ) : (
                  <span>Authorize Payment • {currency}{checkoutData.grandTotal.toFixed(2)}</span>
                )}
              </button>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}
