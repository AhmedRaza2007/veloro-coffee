import React, { useState } from 'react';
import { X, Trash2, Tag, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CartDrawer({ isOpen, onClose, onProceedCheckout }) {
  const { cart, cartSubtotal, updateCartQty, removeFromCart, currency, showToast } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);
  const [validating, setValidating] = useState(false);

  if (!isOpen) return null;

  // Free shipping threshold ($100)
  const freeShippingThreshold = 100;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountLeftForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const applyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode) return;

    try {
      setValidating(true);
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (data.success) {
        setDiscountInfo(data);
        showToast(data.message, 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error validating promo code', 'error');
    } finally {
      setValidating(false);
    }
  };

  const finalDiscount = discountInfo ? discountInfo.discountAmount : 0;
  const shippingCost = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 15.00;
  const grandTotal = Math.max(0, cartSubtotal - finalDiscount + shippingCost);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0A0908]/80 backdrop-blur-md">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141210] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-2xl font-bold text-gold-gradient">Reserve Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#A39B8B] hover:text-[#D4AF37] transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3 bg-[#0A0908]/60 border-b border-[#D4AF37]/15">
            <div className="flex justify-between text-xs text-[#A39B8B] mb-1 font-mono">
              {amountLeftForFreeShipping > 0 ? (
                <span>Add {currency}{amountLeftForFreeShipping.toFixed(2)} for <span className="text-[#D4AF37]">Complimentary Express VIP Shipping</span></span>
              ) : (
                <span className="text-[#D4AF37] font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                  Unlocked Complimentary Express Courier
                </span>
              )}
            </div>
            <div className="w-full bg-[#1E1915] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-16 h-16 mx-auto text-[#D4AF37]/30" />
                <p className="font-serif text-xl text-[#FAF6F0]/60">Your Reserve Cart is Empty</p>
                <p className="text-xs text-[#A39B8B]">Explore our artisanal single-origin roasts and 24k gold editions.</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="p-4 rounded-2xl bg-[#0A0908]/60 border border-[#D4AF37]/20 flex space-x-4 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border border-[#D4AF37]/20"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-serif font-bold text-sm text-[#FAF6F0] line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-[#A39B8B] hover:text-red-400 text-xs ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#D4AF37] font-mono block">{item.grind} • {item.bagSize}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-serif font-bold text-sm text-[#D4AF37]">
                        {currency}{(item.price * item.quantity).toFixed(2)}
                      </span>

                      <div className="flex items-center space-x-2 bg-[#1E1915] px-2 py-1 rounded-lg border border-[#D4AF37]/20 text-xs font-mono">
                        <button onClick={() => updateCartQty(index, -1)} className="text-[#D4AF37] font-bold px-1.5">-</button>
                        <span className="text-[#FAF6F0]">{item.quantity}</span>
                        <button onClick={() => updateCartQty(index, 1)} className="text-[#D4AF37] font-bold px-1.5">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer & Promo Code */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#D4AF37]/20 bg-[#0A0908]/90 space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={applyPromo} className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]" />
                  <input
                    type="text"
                    placeholder="Promo Code (e.g. VELORO20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-[#141210] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#D4AF37] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={validating}
                  className="bg-[#1E1915] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono font-bold px-4 py-2.5 rounded-xl hover:bg-[#D4AF37] hover:text-[#0A0908] transition"
                >
                  Apply
                </button>
              </form>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#A39B8B]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#FAF6F0]">{currency}{cartSubtotal.toFixed(2)}</span>
                </div>

                {finalDiscount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>Discount ({discountInfo.code})</span>
                    <span className="font-mono">-{currency}{finalDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>VIP Delivery</span>
                  <span className="font-mono text-[#FAF6F0]">
                    {shippingCost === 0 ? <span className="text-[#D4AF37]">COMPLIMENTARY</span> : `${currency}${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#D4AF37]/20 text-sm font-bold text-[#FAF6F0]">
                  <span>Total Amount</span>
                  <span className="font-serif text-xl text-gold-gradient">{currency}{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedCheckout({ cartSubtotal, finalDiscount, shippingCost, grandTotal, promoCode: discountInfo?.code });
                }}
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#0A0908] font-bold text-sm uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-[#D4AF37]/25 hover:brightness-110 transition flex items-center justify-center space-x-2"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#A39B8B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>256-Bit SSL Encrypted Luxury Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
