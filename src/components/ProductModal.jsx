import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductModal({ product, onClose }) {
  const { addToCart, toggleWishlist, wishlist, currency, showToast } = useStore();
  const [selectedGrind, setSelectedGrind] = useState('Whole Bean');
  const [bagSize, setBagSize] = useState('500g Luxury Tin');
  const [isSubscription, setIsSubscription] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const isWishlisted = wishlist.includes(product.id);

  // Price calculations based on bag size and subscription
  const sizeMultiplier = bagSize.includes('1kg') ? 1.8 : bagSize.includes('250g') ? 0.6 : 1.0;
  const basePrice = (product.salePrice || product.price) * sizeMultiplier;
  const finalUnitPrice = isSubscription ? basePrice * 0.85 : basePrice;
  const totalPrice = finalUnitPrice * quantity;

  // Load Product Reviews
  useEffect(() => {
    fetch(`/api/products/${product.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        }
      })
      .catch(err => console.error("Error loading reviews:", err));
  }, [product.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          author: authorName || 'Connoisseur Member',
          rating: newRating,
          comment: newComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setNewComment('');
        showToast('Thank you! Your review has been published.', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0908]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-5xl bg-[#141210] rounded-3xl border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-[#0A0908]/80 text-[#FAF6F0] hover:text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Image & Sensory Column */}
          <div className="p-8 bg-[#0A0908]/80 border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20 flex flex-col justify-between space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 group">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 bg-[#0A0908]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/40 text-xs font-mono text-[#D4AF37]">
                Cupping Score: 98.5 / 100
              </div>
            </div>

            {/* Sensory Radar Profile Breakdown */}
            {product.sensoryNotes && (
              <div className="bg-[#1E1915]/60 p-5 rounded-2xl border border-[#D4AF37]/20 space-y-3">
                <h4 className="font-serif text-lg font-bold text-gold-gradient">Master Roaster Sensory Profile</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[#A39B8B] mb-1">
                      <span>Acidity</span>
                      <span className="font-mono text-[#D4AF37]">{product.sensoryNotes.acidic}/10</span>
                    </div>
                    <div className="w-full bg-[#0A0908] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#D4AF37] h-full" style={{ width: `${(product.sensoryNotes.acidic / 10) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#A39B8B] mb-1">
                      <span>Boldness</span>
                      <span className="font-mono text-[#D4AF37]">{product.sensoryNotes.boldness}/10</span>
                    </div>
                    <div className="w-full bg-[#0A0908] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#D4AF37] h-full" style={{ width: `${(product.sensoryNotes.boldness / 10) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#A39B8B] mb-1">
                      <span>Sweetness</span>
                      <span className="font-mono text-[#D4AF37]">{product.sensoryNotes.sweetness}/10</span>
                    </div>
                    <div className="w-full bg-[#0A0908] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#D4AF37] h-full" style={{ width: `${(product.sensoryNotes.sweetness / 10) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#A39B8B] mb-1">
                      <span>Aroma</span>
                      <span className="font-mono text-[#D4AF37]">{product.sensoryNotes.aroma}/10</span>
                    </div>
                    <div className="w-full bg-[#0A0908] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#D4AF37] h-full" style={{ width: `${(product.sensoryNotes.aroma / 10) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Product Details & Configurator Column */}
          <div className="p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">{product.category} • {product.origin}</span>
              <h2 className="font-serif text-3xl font-bold text-[#FAF6F0] mt-1">{product.name}</h2>
              <p className="text-xs text-[#A39B8B] mt-1">{product.subtitle}</p>

              {/* Description */}
              <p className="text-sm text-[#A39B8B] leading-relaxed mt-4">{product.description}</p>

              {/* Flavor Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.flavorTags && product.flavorTags.map((tag, i) => (
                  <span key={i} className="text-xs bg-[#1E1915] text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full font-mono">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bag Size Selector */}
              <div className="mt-6">
                <label className="text-xs font-mono text-[#A39B8B] uppercase tracking-wider block mb-2">Select Packaging Size:</label>
                <div className="grid grid-cols-3 gap-3">
                  {['250g Glass Canister', '500g Luxury Tin', '1kg Cellar Vault'].map(size => (
                    <button
                      key={size}
                      onClick={() => setBagSize(size)}
                      className={`py-2 px-3 text-xs font-mono rounded-xl border transition ${
                        bagSize === size ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'border-[#D4AF37]/20 text-[#FAF6F0]/70 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grind Selector */}
              <div className="mt-4">
                <label className="text-xs font-mono text-[#A39B8B] uppercase tracking-wider block mb-2">Select Grind Profile:</label>
                <select
                  value={selectedGrind}
                  onChange={(e) => setSelectedGrind(e.target.value)}
                  className="w-full bg-[#0A0908] text-sm text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Whole Bean">Whole Bean (Preserve Freshness)</option>
                  <option value="Fine Espresso">Fine Grind (Espresso Machine)</option>
                  <option value="French Press Coarse">Coarse Grind (French Press / Cold Brew)</option>
                  <option value="Pour Over Drip">Medium Grind (V60 / Chemex / Drip)</option>
                </select>
              </div>

              {/* Subscription Toggle */}
              <div className="mt-6 p-4 rounded-2xl bg-[#1E1915]/50 border border-[#D4AF37]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#D4AF37] block">Veloro Auto-Ship Reserve (-15% OFF)</span>
                  <span className="text-[11px] text-[#A39B8B]">Delivered fresh from roast every 30 days. Cancel anytime.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isSubscription}
                  onChange={(e) => setIsSubscription(e.target.checked)}
                  className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
                />
              </div>

            </div>

            {/* Price & Add to Cart Footer */}
            <div className="pt-6 border-t border-[#D4AF37]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#A39B8B] block">Total Amount</span>
                  <span className="font-serif text-3xl font-bold text-gold-gradient">
                    {currency}{totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center space-x-3 bg-[#0A0908] p-1.5 rounded-full border border-[#D4AF37]/30">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full text-[#D4AF37] hover:bg-[#D4AF37]/20 font-bold">-</button>
                  <span className="font-mono text-sm px-2 text-[#FAF6F0]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full text-[#D4AF37] hover:bg-[#D4AF37]/20 font-bold">+</button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-2xl border transition ${isWishlisted ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'border-[#D4AF37]/30 text-[#FAF6F0]/80 hover:border-[#D4AF37]'}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#D4AF37]' : ''}`} />
                </button>

                <button
                  onClick={() => {
                    addToCart(product, quantity, selectedGrind, bagSize);
                    onClose();
                  }}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#0A0908] font-bold text-sm tracking-wider uppercase py-3.5 rounded-2xl shadow-xl shadow-[#D4AF37]/20 hover:brightness-110 transition flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5 text-[#0A0908]" />
                  <span>Add to Reserve Cart • {currency}{totalPrice.toFixed(2)}</span>
                </button>
              </div>

              {/* Reviews Section */}
              <div className="pt-6 border-t border-[#D4AF37]/15">
                <h4 className="font-serif text-lg font-bold text-[#FAF6F0] mb-3">Connoisseur Reviews ({reviews.length})</h4>
                
                {/* Submit Form */}
                <form onSubmit={handleSubmitReview} className="space-y-3 mb-4 bg-[#0A0908]/60 p-4 rounded-xl border border-[#D4AF37]/20">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#A39B8B] font-mono">Write a Tasting Review:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          onClick={() => setNewRating(star)}
                          className={`w-4 h-4 cursor-pointer ${star <= newRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#A39B8B]'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Sommelier Julian)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-[#141210] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <textarea
                    placeholder="Describe aromas, body, crema, and flavor experience..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                    className="w-full bg-[#141210] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-lg p-3 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button type="submit" className="bg-[#D4AF37] text-[#0A0908] font-bold text-xs px-4 py-1.5 rounded-lg flex items-center space-x-1 hover:brightness-110">
                    <Send className="w-3 h-3" />
                    <span>Submit Review</span>
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-xl bg-[#0A0908]/40 border border-[#D4AF37]/10 text-xs">
                      <div className="flex justify-between items-center text-[#D4AF37] font-semibold">
                        <span>{rev.author}</span>
                        <div className="flex text-[#D4AF37]">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#A39B8B] mt-1">{rev.comment}</p>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
