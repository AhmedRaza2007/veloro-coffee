const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadsDir));

// --- API ENDPOINTS ---

// 1. PRODUCTS
app.get('/api/products', (req, res) => {
  const data = db.readData();
  let products = data.products || [];
  
  const { category, roast, search, sort, includeHidden } = req.query;

  if (!includeHidden) {
    products = products.filter(p => p.status !== 'hidden');
  }
  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }
  if (roast && roast !== 'All') {
    products = products.filter(p => p.roastLevel.toLowerCase().includes(roast.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.subtitle.toLowerCase().includes(q) || 
      p.origin.toLowerCase().includes(q) ||
      p.flavorTags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  }

  res.json({ success: true, count: products.length, products });
});

app.get('/api/products/:id', (req, res) => {
  const data = db.readData();
  const product = data.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  
  const reviews = (data.reviews || []).filter(r => r.productId === req.params.id);
  res.json({ success: true, product, reviews });
});

app.post('/api/products', upload.single('imageFile'), (req, res) => {
  const data = db.readData();
  const body = req.body;
  
  let imageUrl = body.imageUrl || '/assets/hero_veloro_coffee.jpg';
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: body.name || 'New Cellar Reserve Coffee',
    subtitle: body.subtitle || 'Artisanal Reserve Roast',
    category: body.category || 'Reserve Single Origin',
    roastLevel: body.roastLevel || 'Medium Roast',
    origin: body.origin || 'Single Estate Reserve',
    price: parseFloat(body.price) || 50.00,
    salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
    stock: parseInt(body.stock) || 50,
    imageUrl: imageUrl,
    sensoryNotes: body.sensoryNotes ? JSON.parse(body.sensoryNotes) : { acidic: 7, boldness: 7, sweetness: 7, aroma: 8 },
    flavorTags: body.flavorTags ? body.flavorTags.split(',').map(s => s.trim()) : ['Rich Cocoa', 'Golden Honey'],
    description: body.description || 'Exclusive artisanal coffee batch.',
    status: body.status || 'active',
    featured: body.featured === 'true' || body.featured === true,
    badge: body.badge || 'New Vintage'
  };

  data.products.unshift(newProduct);
  db.saveData(data);

  res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
});

app.put('/api/products/:id', upload.single('imageFile'), (req, res) => {
  const data = db.readData();
  const idx = data.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });

  const body = req.body;
  let imageUrl = data.products[idx].imageUrl;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (body.imageUrl) {
    imageUrl = body.imageUrl;
  }

  data.products[idx] = {
    ...data.products[idx],
    name: body.name || data.products[idx].name,
    subtitle: body.subtitle || data.products[idx].subtitle,
    category: body.category || data.products[idx].category,
    roastLevel: body.roastLevel || data.products[idx].roastLevel,
    origin: body.origin || data.products[idx].origin,
    price: parseFloat(body.price) || data.products[idx].price,
    salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
    stock: parseInt(body.stock) || data.products[idx].stock,
    imageUrl: imageUrl,
    description: body.description || data.products[idx].description,
    status: body.status || data.products[idx].status,
    featured: body.featured === 'true' || body.featured === true,
    badge: body.badge || data.products[idx].badge
  };

  db.saveData(data);
  res.json({ success: true, message: 'Product updated', product: data.products[idx] });
});

app.delete('/api/products/:id', (req, res) => {
  const data = db.readData();
  data.products = data.products.filter(p => p.id !== req.params.id);
  db.saveData(data);
  res.json({ success: true, message: 'Product deleted' });
});

app.patch('/api/products/:id/toggle', (req, res) => {
  const data = db.readData();
  const prod = data.products.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ success: false, message: 'Product not found' });

  prod.status = prod.status === 'active' ? 'hidden' : 'active';
  db.saveData(data);
  res.json({ success: true, status: prod.status, product: prod });
});

// 2. CATEGORIES
app.get('/api/categories', (req, res) => {
  const data = db.readData();
  res.json({ success: true, categories: data.categories || [] });
});

// 3. ORDERS & CHECKOUT
app.get('/api/orders', (req, res) => {
  const data = db.readData();
  res.json({ success: true, orders: data.orders || [] });
});

app.get('/api/orders/track/:query', (req, res) => {
  const data = db.readData();
  const q = req.params.query.trim().toLowerCase();
  
  const found = data.orders.filter(o => 
    o.id.toLowerCase() === q || 
    o.email.toLowerCase() === q ||
    (o.trackingCode && o.trackingCode.toLowerCase() === q)
  );

  res.json({ success: true, orders: found });
});

app.post('/api/orders', (req, res) => {
  const data = db.readData();
  const { customerName, email, phone, shippingAddress, items, subtotal, discount, shipping, totalAmount, paymentMethod, notes } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  // Generate Unique Luxury Order ID
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderId = `VEL-${randomNum}`;
  const trackingCode = `TRK-VEL-${randomNum}-US`;

  const newOrder = {
    id: orderId,
    customerName: customerName || 'VIP Guest',
    email: email || 'guest@veloro.com',
    phone: phone || 'N/A',
    shippingAddress: shippingAddress || 'Default Address',
    items,
    subtotal: parseFloat(subtotal) || 0,
    discount: parseFloat(discount) || 0,
    shipping: parseFloat(shipping) || 0,
    totalAmount: parseFloat(totalAmount) || 0,
    paymentMethod: paymentMethod || 'Veloro Gold Card',
    paymentStatus: 'Paid',
    orderStatus: 'Roasting',
    trackingCode,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  // Deduct inventory stock
  items.forEach(item => {
    const p = data.products.find(prod => prod.id === item.id);
    if (p && p.stock >= item.quantity) {
      p.stock -= item.quantity;
    }
  });

  data.orders.unshift(newOrder);
  db.saveData(data);

  res.status(201).json({ 
    success: true, 
    message: 'Order created successfully', 
    order: newOrder 
  });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const data = db.readData();
  const { status } = req.body;
  const order = data.orders.find(o => o.id === req.params.id);

  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.orderStatus = status;
  db.saveData(data);

  res.json({ success: true, message: `Order status updated to ${status}`, order });
});

// 4. COUPONS
app.post('/api/coupons/validate', (req, res) => {
  const data = db.readData();
  const { code, subtotal } = req.body;
  const coupon = (data.coupons || []).find(c => c.code.toUpperCase() === (code || '').trim().toUpperCase() && c.active);

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or expired promo code' });
  }

  if (coupon.minSpend && subtotal < coupon.minSpend) {
    return res.status(400).json({ success: false, message: `Minimum spend of $${coupon.minSpend} required for this code` });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (subtotal * coupon.value) / 100;
  } else {
    discountAmount = coupon.value;
  }

  res.json({
    success: true,
    code: coupon.code,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    message: `Applied ${coupon.code}! Savings: $${discountAmount.toFixed(2)}`
  });
});

app.get('/api/coupons', (req, res) => {
  const data = db.readData();
  res.json({ success: true, coupons: data.coupons || [] });
});

app.post('/api/coupons', (req, res) => {
  const data = db.readData();
  const { code, discountType, value, minSpend } = req.body;
  
  const newCoupon = {
    id: `coup-${Date.now()}`,
    code: (code || '').toUpperCase(),
    discountType: discountType || 'percentage',
    value: parseFloat(value) || 10,
    minSpend: parseFloat(minSpend) || 0,
    active: true,
    usageCount: 0
  };

  data.coupons.push(newCoupon);
  db.saveData(data);
  res.status(201).json({ success: true, coupon: newCoupon });
});

// 5. AUTHENTICATION (ADMIN & CUSTOMER)
app.post('/api/auth/login', (req, res) => {
  const data = db.readData();
  const { email, password } = req.body;

  const user = data.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Use admin@veloro.com / veloro123' });
  }

  res.json({
    success: true,
    token: `jwt-mock-token-${user.id}-${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const data = db.readData();
  const { name, email, password } = req.body;

  if (data.users.some(u => u.email.toLowerCase() === (email || '').toLowerCase())) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'Valued Member',
    email: email,
    password: password,
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  db.saveData(data);

  res.status(201).json({
    success: true,
    token: `jwt-mock-token-${newUser.id}`,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: 'customer' }
  });
});

// 6. RESERVATIONS
app.get('/api/reservations', (req, res) => {
  const data = db.readData();
  res.json({ success: true, reservations: data.reservations || [] });
});

app.post('/api/reservations', (req, res) => {
  const data = db.readData();
  const { customerName, email, phone, date, timeSlot, guests, tastingTier } = req.body;

  const newRes = {
    id: `RES-${Math.floor(100 + Math.random() * 900)}`,
    customerName,
    email,
    phone,
    date,
    timeSlot,
    guests: parseInt(guests) || 2,
    tastingTier: tastingTier || 'Imperial Gold Experience ($250/person)',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  data.reservations.unshift(newRes);
  db.saveData(data);

  res.status(201).json({ success: true, message: 'VIP Tasting Table reserved successfully!', reservation: newRes });
});

// 7. REVIEWS & RATINGS
app.post('/api/reviews', (req, res) => {
  const data = db.readData();
  const { productId, author, rating, title, comment } = req.body;

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    author: author || 'Connoisseur Guest',
    rating: parseInt(rating) || 5,
    title: title || 'Exceptional Quality',
    comment: comment || 'Smooth roast and gorgeous aroma.',
    date: new Date().toISOString().split('T')[0]
  };

  data.reviews = data.reviews || [];
  data.reviews.unshift(newReview);
  db.saveData(data);

  res.status(201).json({ success: true, review: newReview });
});

// 8. ADMIN ANALYTICS DASHBOARD KPI
app.get('/api/analytics', (req, res) => {
  const data = db.readData();
  const orders = data.orders || [];
  const products = data.products || [];

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const lowStockCount = products.filter(p => p.stock < 15).length;
  const activeUsersCount = (data.users || []).length;

  res.json({
    success: true,
    kpi: {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalOrders,
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      lowStockCount,
      activeUsersCount,
      totalProducts: products.length
    },
    recentOrders: orders.slice(0, 5)
  });
});

app.listen(PORT, () => {
  console.log(`✨ VELORO COFFEE Express API Server running on port ${PORT}`);
});
