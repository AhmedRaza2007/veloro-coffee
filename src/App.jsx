import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import StoreFront from './pages/StoreFront';
import AdminDashboard from './pages/AdminDashboard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTracker from './components/OrderTracker';
import ReserveModal from './components/ReserveModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleProceedCheckout = (data) => {
    setCheckoutData(data);
    setIsCheckoutOpen(true);
  };

  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#0A0908] text-[#FAF6F0] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0A0908]">
        
        {/* Sticky Luxury Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenTracker={() => setIsTrackerOpen(true)}
          onOpenReserve={() => setIsReserveOpen(true)}
          onSearchClick={() => {
            setActiveTab('store');
            const el = document.getElementById('catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Main Body Page Switcher */}
        <main className="flex-1">
          {activeTab === 'store' ? (
            <StoreFront
              onQuickView={(prod) => setQuickViewProduct(prod)}
              onOpenReserve={() => setIsReserveOpen(true)}
            />
          ) : (
            <AdminDashboard />
          )}
        </main>

        {/* Modals & Slide-out Panels */}
        {quickViewProduct && (
          <ProductModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onProceedCheckout={handleProceedCheckout}
        />

        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            checkoutData={checkoutData}
            onOrderCompleted={() => {
              // Stay on confirmation view inside modal
            }}
          />
        )}

        <OrderTracker
          isOpen={isTrackerOpen}
          onClose={() => setIsTrackerOpen(false)}
        />

        <ReserveModal
          isOpen={isReserveOpen}
          onClose={() => setIsReserveOpen(false)}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />

        {/* Global Luxury Toast Notifications */}
        <Toast />

      </div>
    </StoreProvider>
  );
}
