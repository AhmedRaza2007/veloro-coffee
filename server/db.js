import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'database.json');

// Default initial state
const defaultData = {
  products: [
    {
      id: "prod-1",
      name: "Veloro Black Velvet Cellar Reserve",
      subtitle: "100% Panama Geisha Micro-Lot",
      category: "Reserve Single Origin",
      roastLevel: "Medium-Light",
      origin: "Boquete, Panama (Elevation 1,900m)",
      price: 68.00,
      salePrice: null,
      stock: 45,
      imageUrl: "assets/hero_veloro_coffee.jpg",
      sensoryNotes: { acidic: 8, boldness: 6, sweetness: 9, aroma: 10 },
      flavorTags: ["Black Cherry", "Jasmine", "Wild Honey", "Smoked Plum"],
      description: "Harvested exclusively at midnight under moonlight on the high volcanic slopes of Boquete. Offers an ethereal floral cup with radiant notes of wild jasmine, black cherry jam, and raw golden honey finish.",
      status: "active",
      featured: true,
      badge: "Cellar Reserve"
    },
    {
      id: "prod-2",
      name: "Imperial 24k Gold Infused Espresso",
      subtitle: "Jamaican Blue Mountain & Edible 24k Gold",
      category: "Gold Leaf Blends",
      roastLevel: "Dark Espresso",
      origin: "Blue Mountain, Jamaica & Estate Blends",
      price: 95.00,
      salePrice: 88.00,
      stock: 20,
      imageUrl: "assets/veloro_espresso_gold.jpg",
      sensoryNotes: { acidic: 4, boldness: 10, sweetness: 7, aroma: 9 },
      flavorTags: ["Dark Chocolate Truffle", "Smoked Oak", "24k Gold Flakes", "Caramelized Fig"],
      description: "The crown jewel of Veloro Coffee. Roasted slow over hickory wood and infused with certified 24k edible gold leaf. Creates a dense, golden crema with hints of melted dark chocolate truffle and aged cognac.",
      status: "active",
      featured: true,
      badge: "24k Gold Infused"
    },
    {
      id: "prod-3",
      name: "Veloro Bourbon Barrel Aged Vintage",
      subtitle: "Aged 90 Days in Charred Bourbon Casks",
      category: "Limited Cellar Vintage",
      roastLevel: "Medium Roast",
      origin: "Huehuetenango, Guatemala",
      price: 72.00,
      salePrice: null,
      stock: 30,
      imageUrl: "assets/veloro_reserve_blend.jpg",
      sensoryNotes: { acidic: 5, boldness: 8, sweetness: 9, aroma: 10 },
      flavorTags: ["Kentucky Bourbon", "Vanilla Bean", "Toasted Pecan", "Molasses"],
      description: "Green coffee beans aged for 90 days inside charred oak Kentucky bourbon barrels before micro-batch roasting. Warm notes of butterscotch, Madagascar vanilla, toasted pecans, and a velvety spirit-infused aroma.",
      status: "active",
      featured: true,
      badge: "Barrel Aged"
    },
    {
      id: "prod-4",
      name: "Grand Cellar Yirgacheffe Special",
      subtitle: "Heirloom Natural Processed Micro-Lot",
      category: "Reserve Single Origin",
      roastLevel: "Light Roast",
      origin: "Gedeo Zone, Yirgacheffe, Ethiopia",
      price: 48.00,
      salePrice: null,
      stock: 60,
      imageUrl: "assets/veloro_pour_over.jpg",
      sensoryNotes: { acidic: 9, boldness: 4, sweetness: 8, aroma: 9 },
      flavorTags: ["Peach Blossom", "Meyer Lemon", "Bergamot", "Cacao Nibs"],
      description: "Hand-picked natural processed heirloom beans dried on raised African beds for 21 days. Vibrant acidity reminiscent of peach nectar, Bergamot Earl Grey tea, and crisp Meyer lemon zest.",
      status: "active",
      featured: false,
      badge: "Limited Batch"
    },
    {
      id: "prod-5",
      name: "Nocturne French Dark Velvet",
      subtitle: "Highland Estate Triple Dark Roast",
      category: "Reserve Single Origin",
      roastLevel: "French Roast",
      origin: "Antioquia, Colombia",
      price: 42.00,
      salePrice: 36.00,
      stock: 80,
      imageUrl: "assets/hero_veloro_coffee.jpg",
      sensoryNotes: { acidic: 2, boldness: 10, sweetness: 6, aroma: 8 },
      flavorTags: ["85% Dark Cocoa", "Toasted Hazelnut", "Charred Cedar", "Espresso Crema"],
      description: "Deep, intense, and uncompromising. Double-roasted to perfection to unleash heavy dark cocoa oils, smoky cedar notes, and a lingering bittersweet truffle finish.",
      status: "active",
      featured: false,
      badge: "Best Seller"
    },
    {
      id: "prod-6",
      name: "Veloro Opus Gold Capsules (30 Count)",
      subtitle: "Recyclable Gold Aluminium Pods",
      category: "Luxury Accessories & Pods",
      roastLevel: "Dark Espresso",
      origin: "Multi-Estate Reserve Blend",
      price: 54.00,
      salePrice: null,
      stock: 100,
      imageUrl: "assets/veloro_espresso_gold.jpg",
      sensoryNotes: { acidic: 5, boldness: 9, sweetness: 7, aroma: 8 },
      flavorTags: ["Italian Crema", "Roasted Almond", "Brown Sugar"],
      description: "Hermetically sealed gold aluminum capsules crafted for ultimate crema extraction. Compatible with all Nespresso Original machines.",
      status: "active",
      featured: false,
      badge: "Collector's Pack"
    }
  ],
  categories: [
    { id: "cat-1", name: "Reserve Single Origin", slug: "reserve-single-origin", count: 3 },
    { id: "cat-2", name: "Gold Leaf Blends", slug: "gold-leaf-blends", count: 1 },
    { id: "cat-3", name: "Limited Cellar Vintage", slug: "limited-cellar-vintage", count: 1 },
    { id: "cat-4", name: "Luxury Accessories & Pods", slug: "luxury-accessories-pods", count: 1 }
  ],
  orders: [
    {
      id: "VEL-89421",
      customerName: "Lord Harrison Sterling",
      email: "sterling@luxuryvillas.com",
      phone: "+1 (555) 234-5678",
      shippingAddress: "740 Park Avenue, Apt 14B, New York, NY 10021",
      items: [
        { id: "prod-1", name: "Veloro Black Velvet Cellar Reserve", price: 68.00, quantity: 2, grind: "Whole Bean", bagSize: "500g Luxury Tin" },
        { id: "prod-2", name: "Imperial 24k Gold Infused Espresso", price: 88.00, quantity: 1, grind: "Fine Espresso", bagSize: "250g Glass Canister" }
      ],
      subtotal: 224.00,
      discount: 44.80,
      shipping: 0.00,
      totalAmount: 179.20,
      paymentMethod: "Veloro Gold Card",
      paymentStatus: "Paid",
      orderStatus: "Roasting",
      trackingCode: "TRK-VEL-89421-US",
      notes: "Please deliver with signature required.",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: "VEL-89422",
      customerName: "Sophia Montclair",
      email: "sophia@montclair.design",
      phone: "+1 (555) 987-6543",
      shippingAddress: "320 Rodeo Drive, Beverly Hills, CA 90210",
      items: [
        { id: "prod-3", name: "Veloro Bourbon Barrel Aged Vintage", price: 72.00, quantity: 1, grind: "French Press Coarse", bagSize: "500g Luxury Tin" }
      ],
      subtotal: 72.00,
      discount: 0.00,
      shipping: 0.00,
      totalAmount: 72.00,
      paymentMethod: "Apple Pay (Amex Black)",
      paymentStatus: "Paid",
      orderStatus: "Shipped",
      trackingCode: "TRK-VEL-89422-US",
      notes: "Leave at private security gate.",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ],
  coupons: [
    { id: "coup-1", code: "VELORO20", discountType: "percentage", value: 20, minSpend: 50, active: true, usageCount: 42 },
    { id: "coup-2", code: "GOLDVIP", discountType: "fixed", value: 25, minSpend: 80, active: true, usageCount: 18 }
  ],
  users: [
    {
      id: "usr-admin",
      name: "Veloro Executive Admin",
      email: "admin@veloro.com",
      password: "veloro123",
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr-1",
      name: "Lord Harrison Sterling",
      email: "sterling@luxuryvillas.com",
      password: "password123",
      role: "customer",
      createdAt: new Date().toISOString()
    }
  ],
  reservations: [
    {
      id: "RES-401",
      customerName: "Baron Alexander Vance",
      email: "vance@vanceholdings.co",
      phone: "+1 555-0192",
      date: "2026-08-05",
      timeSlot: "17:00 (Sunset Vintage Flight)",
      guests: 4,
      tastingTier: "Imperial Gold Experience ($250/person)",
      status: "Confirmed",
      createdAt: new Date().toISOString()
    }
  ],
  reviews: [
    {
      id: "rev-1",
      productId: "prod-1",
      author: "Julian Vance, Master Sommelier",
      rating: 5,
      title: "An Unrivaled Sensory Masterpiece",
      comment: "The floral jasmine aromatics when opening the sealed tin are overwhelming. The body is crisp, clear, and velvety.",
      date: "2026-07-15"
    },
    {
      id: "rev-2",
      productId: "prod-2",
      author: "Elena Rostova",
      rating: 5,
      title: "Pure Luxury in Every Sip",
      comment: "The gold crema is hypnotic. Tastes divine with dark artisan chocolate.",
      date: "2026-07-18"
    }
  ]
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_PATH)) {
      this.saveData(defaultData);
    }
  }

  readData() {
    try {
      if (!fs.existsSync(DB_PATH)) {
        this.saveData(defaultData);
        return defaultData;
      }
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error("DB Read error, resetting to default:", err);
      this.saveData(defaultData);
      return defaultData;
    }
  }

  saveData(data) {
    try {
      const tempPath = DB_PATH + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_PATH);
    } catch (err) {
      console.error("DB Save error:", err);
    }
  }
}

export default new Database();
