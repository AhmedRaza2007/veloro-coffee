import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Star, Sparkles, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, wishlist, currency } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const [selectedGrind, setSelectedGrind] = useState('Whole Bean');

  return (
    <div className="group relative bg-[#141210] rounded-2xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col h-full">
      
      {/* Top Badge & Wishlist Button */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        {product.badge && (
          <span className="bg-[#0A0908]/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>{product.badge}</span>
          </span>
        )}
      </div>

      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#0A0908]/70 backdrop-blur-md border border-[#D4AF37]/30 flex items-center justify-center text-[#FAF6F0] hover:text-[#D4AF37] hover:border-[#D4AF37] transition"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
      </button>

      {/* Image Banner */}
      <div className="relative h-72 w-full overflow-hidden bg-[#0A0908] cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent opacity-90" />
        
        {/* Quick View Floating Overlay */}
        <div className="absolute inset-0 bg-[#0A0908]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="bg-[#0A0908]/90 text-[#D4AF37] border border-[#D4AF37] text-xs font-mono tracking-widest uppercase px-5 py-2.5 rounded-full flex items-center space-x-2 hover:bg-[#D4AF37] hover:text-[#0A0908] transition duration-300 shadow-xl"
          >
            <Eye className="w-4 h-4" />
            <span>Explore Sensory Profile</span>
          </button>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Origin & Roast */}
          <div className="flex items-center justify-between text-xs font-mono text-[#A39B8B] mb-1">
            <span className="truncate max-w-[180px]">{product.origin}</span>
            <span className="text-[#D4AF37] font-semibold">{product.roastLevel}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif text-xl font-bold text-[#FAF6F0] group-hover:text-gold-gradient transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#A39B8B] font-light mt-1 line-clamp-1">{product.subtitle}</p>

          {/* Flavor Notes Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.flavorTags && product.flavorTags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] bg-[#1E1915] text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded-md font-mono">
                {tag}
              </span>
            ))}
          </div>

          {/* Sensory Progress Metrics */}
          {product.sensoryNotes && (
            <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 rounded-xl bg-[#0A0908]/60 border border-[#D4AF37]/10 text-[11px]">
              <div>
                <div className="flex justify-between text-[#A39B8B] mb-0.5">
                  <span>Aroma</span>
                  <span className="font-mono text-[#D4AF37]">{product.sensoryNotes.aroma}/10</span>
                </div>
                <div className="w-full bg-[#1E1915] h-1 rounded-full overflow-hidden">
                  <div className="bg-[#D4AF37] h-full" style={{ width: `${(product.sensoryNotes.aroma / 10) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#A39B8B] mb-0.5">
                  <span>Boldness</span>
                  <span className="font-mono text-[#D4AF37]">{product.sensoryNotes.boldness}/10</span>
                </div>
                <div className="w-full bg-[#1E1915] h-1 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] h-full" style={{ width: `${(product.sensoryNotes.boldness / 10) * 100}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grind Selector & Price / Add to Cart Footer */}
        <div className="pt-4 border-t border-[#D4AF37]/15 space-y-3">
          
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-mono text-[#A39B8B]">Grind:</label>
            <select
              value={selectedGrind}
              onChange={(e) => setSelectedGrind(e.target.value)}
              className="bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-md px-2 py-1 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="Whole Bean">Whole Bean</option>
              <option value="Fine Espresso">Fine Espresso</option>
              <option value="French Press Coarse">French Press</option>
              <option value="Pour Over Drip">Pour Over</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* Price */}
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-2xl font-bold text-[#D4AF37]">
                  {currency}{product.salePrice ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
                </span>
                {product.salePrice && (
                  <span className="text-xs text-[#A39B8B] line-through font-mono">
                    {currency}{product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#A39B8B] font-mono block">Includes Collector Tin</span>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => addToCart(product, 1, selectedGrind)}
              className="bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#0A0908] p-3 rounded-xl hover:brightness-110 transition shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center font-bold"
              title="Add to Reserve Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
