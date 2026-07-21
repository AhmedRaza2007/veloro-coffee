import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, Users, Plus, Edit, Trash2, Eye, EyeOff, Check, X, Shield, RefreshCw, Tag, Calendar, AlertTriangle, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminDashboard() {
  const { fetchProducts, currency, showToast, user } = useStore();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'coupons' | 'reservations'

  const [analytics, setAnalytics] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [reservationsList, setReservationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Form Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    subtitle: '',
    category: 'Reserve Single Origin',
    roastLevel: 'Medium Roast',
    origin: 'Boquete, Panama',
    price: '',
    salePrice: '',
    stock: '50',
    imageUrl: '/assets/hero_veloro_coffee.jpg',
    description: '',
    featured: false,
    badge: 'Cellar Reserve'
  });
  const [imageFile, setImageFile] = useState(null);

  // Coupon Form state
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    value: '20',
    minSpend: '50'
  });

  // Fetch all Admin Data
  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [resAnal, resProd, resOrd, resCoup, resRes] = await Promise.all([
        fetch('/api/analytics').then(r => r.json()),
        fetch('/api/products?includeHidden=true').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/coupons').then(r => r.json()),
        fetch('/api/reservations').then(r => r.json())
      ]);

      if (resAnal.success) setAnalytics(resAnal);
      if (resProd.success) setProductsList(resProd.products);
      if (resOrd.success) setOrdersList(resOrd.orders);
      if (resCoup.success) setCouponsList(resCoup.coupons);
      if (resRes.success) setReservationsList(resRes.reservations);

    } catch (err) {
      console.error("Admin data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handle Product Add / Edit Submit
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', prodForm.name);
      formData.append('subtitle', prodForm.subtitle);
      formData.append('category', prodForm.category);
      formData.append('roastLevel', prodForm.roastLevel);
      formData.append('origin', prodForm.origin);
      formData.append('price', prodForm.price);
      if (prodForm.salePrice) formData.append('salePrice', prodForm.salePrice);
      formData.append('stock', prodForm.stock);
      formData.append('imageUrl', prodForm.imageUrl);
      formData.append('description', prodForm.description);
      formData.append('featured', prodForm.featured);
      formData.append('badge', prodForm.badge);

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (data.success) {
        showToast(editingProduct ? 'Product Updated' : 'New Product Added', 'gold');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setImageFile(null);
        loadAdminData();
        fetchProducts();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error saving product', 'error');
    }
  };

  // Toggle Product Active / Hidden
  const handleToggleProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        showToast(`Product visibility updated to ${data.status}`, 'info');
        loadAdminData();
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coffee product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Product Deleted', 'info');
        loadAdminData();
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order ${orderId} updated to ${newStatus}`, 'gold');
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Promo Code ${data.coupon.code} Created!`, 'gold');
        setCouponForm({ code: '', discountType: 'percentage', value: '20', minSpend: '50' });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#FAF6F0] p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#D4AF37]/30 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center text-[#0A0908] font-bold shadow-lg shadow-[#D4AF37]/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-gold-gradient">Executive Admin Control Center</h1>
            <p className="text-xs text-[#A39B8B] font-mono">Veloro Coffee Haute Cellar Management System • Live REST API</p>
          </div>
        </div>

        <button
          onClick={loadAdminData}
          className="bg-[#141210] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold px-4 py-2.5 rounded-xl hover:bg-[#D4AF37]/10 transition flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Database</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-[#D4AF37]/20 pb-4 overflow-x-auto">
        {[
          { id: 'overview', label: 'Revenue Overview', icon: TrendingUp },
          { id: 'products', label: 'Coffee Catalog (CRUD)', icon: Package },
          { id: 'orders', label: 'Order Management', icon: ShoppingBag },
          { id: 'coupons', label: 'Promotions & Coupons', icon: Tag },
          { id: 'reservations', label: 'VIP Lounge Bookings', icon: Calendar }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold flex items-center space-x-2 transition ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0908] shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-[#141210] text-[#A39B8B] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && analytics && (
        <div className="space-y-8">
          
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 space-y-2">
              <div className="flex justify-between items-center text-[#A39B8B] text-xs font-mono">
                <span>Total Revenue</span>
                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="font-serif text-4xl font-bold text-gold-gradient block">
                {currency}{analytics.kpi.totalRevenue.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#D4AF37] font-mono">+18.4% from last month</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 space-y-2">
              <div className="flex justify-between items-center text-[#A39B8B] text-xs font-mono">
                <span>Total Orders Placed</span>
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="font-serif text-4xl font-bold text-[#FAF6F0] block">
                {analytics.kpi.totalOrders}
              </span>
              <span className="text-[10px] text-[#A39B8B] font-mono">100% Stored in Database</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 space-y-2">
              <div className="flex justify-between items-center text-[#A39B8B] text-xs font-mono">
                <span>Avg Order Value</span>
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="font-serif text-4xl font-bold text-[#FAF6F0] block">
                {currency}{analytics.kpi.avgOrderValue.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#D4AF37] font-mono">High Margin Luxury Orders</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 space-y-2">
              <div className="flex justify-between items-center text-[#A39B8B] text-xs font-mono">
                <span>Low Stock Alerts</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-serif text-4xl font-bold text-amber-400 block">
                {analytics.kpi.lowStockCount}
              </span>
              <span className="text-[10px] text-[#A39B8B] font-mono">Coffee batches &lt; 15 units</span>
            </div>

          </div>

          {/* Recent Orders Overview Table */}
          <div className="p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#FAF6F0]">Recent Live Customer Orders</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-[#0A0908] text-[#D4AF37] uppercase border-b border-[#D4AF37]/20">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  {analytics.recentOrders.map(o => (
                    <tr key={o.id} className="hover:bg-[#0A0908]/40">
                      <td className="p-3 text-[#D4AF37] font-bold">{o.id}</td>
                      <td className="p-3 text-[#FAF6F0]">{o.customerName}</td>
                      <td className="p-3 text-[#A39B8B]">{o.items.length} items</td>
                      <td className="p-3 font-bold text-[#D4AF37]">{currency}{o.totalAmount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border border-[#D4AF37]/40">
                          {o.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-2xl font-bold text-[#FAF6F0]">Coffee Product Catalog Management</h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProdForm({
                  name: '', subtitle: '', category: 'Reserve Single Origin', roastLevel: 'Medium Roast', origin: 'Panama', price: '55', salePrice: '', stock: '50', imageUrl: '/assets/hero_veloro_coffee.jpg', description: '', featured: false, badge: 'Cellar Reserve'
                });
                setIsProductModalOpen(true);
              }}
              className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0908] font-bold text-xs uppercase font-mono px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Coffee Product</span>
            </button>
          </div>

          {/* Products List Table */}
          <div className="p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-[#0A0908] text-[#D4AF37] uppercase border-b border-[#D4AF37]/20">
                <tr>
                  <th className="p-3">Coffee</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {productsList.map(p => (
                  <tr key={p.id} className={`hover:bg-[#0A0908]/40 ${p.status === 'hidden' ? 'opacity-50' : ''}`}>
                    <td className="p-3 flex items-center space-x-3">
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-[#D4AF37]/30" />
                      <div>
                        <span className="font-serif text-sm font-bold text-[#FAF6F0] block">{p.name}</span>
                        <span className="text-[10px] text-[#A39B8B]">{p.origin}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[#A39B8B]">{p.category}</td>
                    <td className="p-3 font-bold text-[#D4AF37]">
                      {currency}{p.salePrice ? p.salePrice.toFixed(2) : p.price.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock < 15 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${p.status === 'active' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-gray-700 text-gray-400'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleProduct(p.id)}
                        className="p-1.5 rounded-lg border border-[#D4AF37]/30 text-[#A39B8B] hover:text-[#D4AF37]"
                        title="Toggle Active/Hidden"
                      >
                        {p.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProdForm({
                            name: p.name,
                            subtitle: p.subtitle,
                            category: p.category,
                            roastLevel: p.roastLevel,
                            origin: p.origin,
                            price: p.price.toString(),
                            salePrice: p.salePrice ? p.salePrice.toString() : '',
                            stock: p.stock.toString(),
                            imageUrl: p.imageUrl,
                            description: p.description,
                            featured: p.featured,
                            badge: p.badge || ''
                          });
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#FAF6F0]">Complete Customer Orders Database</h3>

          <div className="p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-[#0A0908] text-[#D4AF37] uppercase border-b border-[#D4AF37]/20">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer Details</th>
                  <th className="p-3">Items Ordered</th>
                  <th className="p-3">Total Paid</th>
                  <th className="p-3">Order Status</th>
                  <th className="p-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {ordersList.map(o => (
                  <tr key={o.id} className="hover:bg-[#0A0908]/40">
                    <td className="p-3 text-[#D4AF37] font-bold">
                      {o.id}
                      <span className="text-[10px] text-[#A39B8B] block font-normal">{new Date(o.createdAt).toLocaleString()}</span>
                    </td>
                    <td className="p-3 text-[#FAF6F0]">
                      <span className="font-bold block">{o.customerName}</span>
                      <span className="text-[10px] text-[#A39B8B] block">{o.email}</span>
                      <span className="text-[10px] text-[#A39B8B] block">{o.shippingAddress}</span>
                    </td>
                    <td className="p-3 text-[#FAF6F0]">
                      {o.items.map((it, i) => (
                        <div key={i} className="text-[11px]">
                          {it.quantity}x {it.name} ({it.grind || 'Whole Bean'})
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-serif font-bold text-base text-[#D4AF37]">
                      {currency}{o.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] uppercase font-bold border border-[#D4AF37]/40">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="bg-[#0A0908] text-xs text-[#FAF6F0] border border-[#D4AF37]/40 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Roasting">Artisan Roasting</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#FAF6F0]">Promotions & Discount Codes</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Coupon Form */}
            <form onSubmit={handleCreateCoupon} className="p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 space-y-4">
              <h4 className="font-serif text-lg font-bold text-gold-gradient">Create New Promo Code</h4>
              
              <div>
                <label className="text-xs font-mono text-[#A39B8B] block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER30"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#0A0908] text-xs font-mono text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs font-mono text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A39B8B] block mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    required
                    value={couponForm.minSpend}
                    onChange={(e) => setCouponForm({ ...couponForm, minSpend: e.target.value })}
                    className="w-full bg-[#0A0908] text-xs font-mono text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0908] font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg"
              >
                Create Promo Code
              </button>
            </form>

            {/* Coupons List */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 overflow-x-auto">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-[#0A0908] text-[#D4AF37] uppercase border-b border-[#D4AF37]/20">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Min Spend</th>
                    <th className="p-3">Usage</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  {couponsList.map(c => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold text-[#D4AF37]">{c.code}</td>
                      <td className="p-3 text-[#FAF6F0]">{c.value}% OFF</td>
                      <td className="p-3 text-[#A39B8B]">${c.minSpend}</td>
                      <td className="p-3 text-[#A39B8B]">{c.usageCount} times</td>
                      <td className="p-3">
                        <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded-full text-[10px] uppercase font-bold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: RESERVATIONS */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#FAF6F0]">VIP Tasting Lounge Table Reservations</h3>

          <div className="p-6 rounded-3xl bg-[#141210] border border-[#D4AF37]/30 overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-[#0A0908] text-[#D4AF37] uppercase border-b border-[#D4AF37]/20">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Guest Name</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Party Size</th>
                  <th className="p-3">Experience Tier</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {reservationsList.map(r => (
                  <tr key={r.id}>
                    <td className="p-3 font-bold text-[#D4AF37]">{r.id}</td>
                    <td className="p-3 text-[#FAF6F0]">
                      <span className="font-bold block">{r.customerName}</span>
                      <span className="text-[10px] text-[#A39B8B]">{r.email}</span>
                    </td>
                    <td className="p-3 text-[#FAF6F0]">{r.date} • {r.timeSlot}</td>
                    <td className="p-3 text-[#A39B8B]">{r.guests} Guests</td>
                    <td className="p-3 text-[#D4AF37] font-bold">{r.tastingTier}</td>
                    <td className="p-3">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT EDIT / ADD MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0908]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#141210] rounded-3xl border border-[#D4AF37]/40 shadow-2xl p-8 my-8">
            
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 text-[#A39B8B] hover:text-[#D4AF37]">
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-6">
              {editingProduct ? 'Edit Coffee Product' : 'Add New Cellar Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
              
              <div>
                <label className="text-[#A39B8B] block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Veloro Obsidian French Roast"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full bg-[#0A0908] text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A39B8B] block mb-1">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-[#0A0908] text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5"
                  >
                    <option value="Reserve Single Origin">Reserve Single Origin</option>
                    <option value="Gold Leaf Blends">Gold Leaf Blends</option>
                    <option value="Limited Cellar Vintage">Limited Cellar Vintage</option>
                    <option value="Luxury Accessories & Pods">Luxury Accessories & Pods</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#A39B8B] block mb-1">Roast Profile</label>
                  <input
                    type="text"
                    value={prodForm.roastLevel}
                    onChange={(e) => setProdForm({ ...prodForm, roastLevel: e.target.value })}
                    className="w-full bg-[#0A0908] text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#A39B8B] block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full bg-[#0A0908] text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5"
                  />
                </div>
                <div>
                  <label className="text-[#A39B8B] block mb-1">Sale Price (Opt)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodForm.salePrice}
                    onChange={(e) => setProdForm({ ...prodForm, salePrice: e.target.value })}
                    className="w-full bg-[#0A0908] text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5"
                  />
                </div>
                <div>
                  <label className="text-[#A39B8B] block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    className="w-full bg-[#0A0908] text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A39B8B] block mb-1">Image Upload or Asset URL</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full bg-[#0A0908] text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl p-2 mb-2"
                />
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={prodForm.imageUrl}
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  className="w-full bg-[#0A0908] text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="text-[#A39B8B] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-[#0A0908] text-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl p-3"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  checked={prodForm.featured}
                  onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <span className="text-[#FAF6F0]">Feature on Hero Showcase</span>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0908] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-xl mt-4"
              >
                Save Product Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
