import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, Award, Flame, Shield, ArrowRight, Star, Mail, CheckCircle2, ChevronRight } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export default function StoreFront({ onQuickView, onOpenReserve }) {
  const { products, categories, loading, showToast } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'hidden') return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedRoast !== 'All' && !p.roastLevel.toLowerCase().includes(selectedRoast.toLowerCase())) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSub = p.subtitle.toLowerCase().includes(q);
        const matchOrigin = p.origin.toLowerCase().includes(q);
        const matchTag = p.flavorTags && p.flavorTags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchSub && !matchOrigin && !matchTag) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.salePrice || a.price) - (b.salePrice || b.price);
      if (sortBy === 'price-high') return (b.salePrice || b.price) - (a.salePrice || a.price);
      if (sortBy === 'rating') return 5 - 5;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedRoast, searchQuery, sortBy]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast(`Welcome! Use promo code VELORO20 for 20% off your order.`, 'gold');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#FAF6F0] relative overflow-hidden">
      
      {/* HERO SECTION WITH CINEMATIC CANVAS */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        
        {/* Interactive 3D Coffee Bean Particle Canvas */}
        <HeroCanvas />

        {/* Ambient Radial Golden Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Top Gold Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#141210]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4AF37]/40 shadow-xl">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" />
            <span className="text-xs font-mono tracking-[0.2em] text-[#D4AF37] uppercase font-semibold">
              The 2026 Cellar Reserve Collection
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#FAF6F0] leading-none">
            The Crown of <br />
            <span className="text-gold-gradient italic font-normal">Artisanal Roasts</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#A39B8B] font-light leading-relaxed">
            Exclusively micro-batched single-origin Geishas, bourbon-barrel-aged vintages, and certified 24k gold leaf infused espresso. Crafted for true coffee connoisseurs.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#catalog"
              className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#0A0908] font-bold text-xs uppercase tracking-[0.2em] px-9 py-4 rounded-full shadow-2xl shadow-[#D4AF37]/30 hover:brightness-110 transition flex items-center justify-center space-x-2"
            >
              <span>Explore Reserve Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenReserve}
              className="w-full sm:w-auto bg-[#141210]/80 border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-[#D4AF37]/10 transition flex items-center justify-center space-x-2"
            >
              <span>Book VIP Tasting Lounge</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-12 grid grid-cols-3 max-w-2xl mx-auto border-t border-[#D4AF37]/20 text-center">
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient block">98.5</span>
              <span className="text-[10px] font-mono text-[#A39B8B] uppercase tracking-wider">Cupping Score</span>
            </div>
            <div className="border-x border-[#D4AF37]/20">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient block">100%</span>
              <span className="text-[10px] font-mono text-[#A39B8B] uppercase tracking-wider">Single Origin</span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient block">24k Gold</span>
              <span className="text-[10px] font-mono text-[#A39B8B] uppercase tracking-wider">Infused Editions</span>
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCT CATALOG SECTION */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Curated Private Cellar
            </span>
            <h2 className="font-serif text-4xl font-bold text-[#FAF6F0]">Master Reserve Collection</h2>
          </div>

          {/* Search Query Bar & Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#D4AF37]" />
              <input
                type="text"
                placeholder="Search coffee notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141210] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#D4AF37] font-mono"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#141210] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37] font-mono w-full sm:w-auto"
            >
              <option value="featured">Sort: Cellar Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-3 pb-4 mb-8 no-scrollbar">
          {['All', 'Reserve Single Origin', 'Gold Leaf Blends', 'Limited Cellar Vintage', 'Luxury Accessories & Pods'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0908] font-bold shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-[#141210] text-[#A39B8B] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Roast Filter Chips */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono text-[#A39B8B]">
          <span className="uppercase text-[#D4AF37]">Roast Level:</span>
          {['All', 'Light Roast', 'Medium Roast', 'Dark Espresso', 'French Roast'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRoast(r)}
              className={`px-3 py-1 rounded-md transition ${
                selectedRoast === r ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' : 'hover:text-[#FAF6F0]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-[#141210] rounded-2xl animate-pulse border border-[#D4AF37]/10" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#141210]/50 rounded-3xl border border-[#D4AF37]/20 space-y-4">
            <Sparkles className="w-12 h-12 mx-auto text-[#D4AF37]/40" />
            <p className="font-serif text-2xl text-[#FAF6F0]">No Roasts Match Your Selection</p>
            <p className="text-xs text-[#A39B8B]">Try resetting your filter parameters or search query.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedRoast('All'); setSearchQuery(''); }}
              className="bg-[#D4AF37] text-[#0A0908] font-bold text-xs px-6 py-2.5 rounded-full uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}

      </section>

      {/* ARTISANAL PROCESS HIGHLIGHT */}
      <section className="bg-[#141210]/80 border-y border-[#D4AF37]/20 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
            <img
              src="/assets/veloro_pour_over.jpg"
              alt="Veloro Artisanal Roast Craft"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0A0908]/90 backdrop-blur-md border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37]">
              <span>Hand Crafted by Master Sommelier Artisan Roasters</span>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest block">
              The Veloro Philosophy
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#FAF6F0] leading-tight">
              Uncompromising Quality in Every Drop
            </h2>
            <p className="text-sm text-[#A39B8B] leading-relaxed">
              From high-altitude micro-lots harvested strictly under full moon light to slow hickory wood roasting and hermetically sealed nitrogen tin packaging, Veloro preserves 100% of volatile aromatic oils.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 mt-1">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#FAF6F0]">Certified 24k Edible Gold Leaf</h4>
                  <p className="text-xs text-[#A39B8B]">Infused with certified pharmaceutical-grade 24k gold flakes for a velvety crema.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 mt-1">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#FAF6F0]">Charred Hickory Micro-Roasting</h4>
                  <p className="text-xs text-[#A39B8B]">Roasted in small 5kg batches to achieve precise roast curve parameters.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* VIP TASTING LOUNGE BANNER */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl p-12 lg:p-16 flex flex-col justify-end min-h-[420px]">
          <img
            src="/assets/veloro_tasting_room.jpg"
            alt="Veloro VIP Lounge Bar"
            className="absolute inset-0 w-full h-full object-cover brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/60 to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest">
              Private Cellar Tastings
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#FAF6F0]">
              Experience the Veloro Tasting Lounge
            </h2>
            <p className="text-sm text-[#A39B8B]">
              Immerse yourself in a guided 5-course coffee Sommelier flight with paired artisanal chocolates in our private dark marble cellar lounge.
            </p>

            <button
              onClick={onOpenReserve}
              className="bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#0A0908] font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-2xl hover:brightness-110 transition inline-flex items-center space-x-2 mt-4"
            >
              <span>Reserve Table Experience</span>
              <ChevronRight className="w-4 h-4 text-[#0A0908]" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER & NEWSLETTER */}
      <footer className="bg-[#0A0908] pt-16 pb-12 border-t border-[#D4AF37]/20 text-xs text-[#A39B8B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Newsletter Box */}
          <div className="p-8 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#FAF6F0]">Join the Private Cellar Club</h3>
              <p className="text-xs text-[#A39B8B] mt-1">Receive early allocation notifications for micro-lots & 20% off your first order.</p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto space-x-2">
              <input
                type="email"
                required
                placeholder="Enter VIP Email Address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] w-full md:w-64 font-mono"
              />
              <button type="submit" className="bg-[#D4AF37] text-[#0A0908] font-bold text-xs uppercase px-6 py-3 rounded-xl hover:brightness-110 transition">
                Subscribe
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
            <div className="space-y-3">
              <span className="font-serif text-2xl font-bold text-gold-gradient block">VELORO</span>
              <p className="text-[11px] leading-relaxed">Haute Artisanal Coffee & Private Cellar Reserve. Engineered for extraordinary taste.</p>
            </div>

            <div>
              <h4 className="font-serif text-sm font-bold text-[#FAF6F0] uppercase tracking-wider mb-3">Reserve Collections</h4>
              <ul className="space-y-2 font-mono">
                <li><a href="#catalog" className="hover:text-[#D4AF37]">Panama Geisha Reserve</a></li>
                <li><a href="#catalog" className="hover:text-[#D4AF37]">24k Gold Infused Espresso</a></li>
                <li><a href="#catalog" className="hover:text-[#D4AF37]">Bourbon Barrel Vintage</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-sm font-bold text-[#FAF6F0] uppercase tracking-wider mb-3">Client Concierge</h4>
              <ul className="space-y-2 font-mono">
                <li><button onClick={onOpenReserve} className="hover:text-[#D4AF37]">Tasting Room Reservations</button></li>
                <li><a href="#catalog" className="hover:text-[#D4AF37]">Corporate Luxury Gifting</a></li>
                <li><a href="#catalog" className="hover:text-[#D4AF37]">Shipping & Delivery Terms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-sm font-bold text-[#FAF6F0] uppercase tracking-wider mb-3">Flagship Lounge</h4>
              <p className="font-mono text-[11px]">740 Fifth Avenue, Suite 100<br />New York, NY 10019</p>
              <p className="font-mono text-[11px] mt-2 text-[#D4AF37]">concierge@velorocoffee.com</p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono">
            <span>© 2026 VELORO COFFEE HAUTE CELLAR. ALL RIGHTS RESERVED.</span>
            <span>DESIGNED WITH ULTRA-LUXURY EXCELLENCE</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
