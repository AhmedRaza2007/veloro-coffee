import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('veloro_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('veloro_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('veloro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currency, setCurrency] = useState('$');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('veloro_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('veloro_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch Products from API
  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/products?${queryParams}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const addToCart = (product, quantity = 1, grind = 'Whole Bean', bagSize = '500g Luxury Tin') => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id && item.grind === grind && item.bagSize === bagSize);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.salePrice || product.price,
        imageUrl: product.imageUrl,
        quantity,
        grind,
        bagSize
      }];
    });
    showToast(`Added "${product.name}" to your Reserve Cart`, 'gold');
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (index, delta) => {
    setCart(prev => {
      const copy = [...prev];
      copy[index].quantity += delta;
      if (copy[index].quantity <= 0) {
        return copy.filter((_, i) => i !== index);
      }
      return copy;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to Reserve Wishlist', 'gold');
        return [...prev, productId];
      }
    });
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('veloro_user', JSON.stringify(userData));
    showToast(`Welcome back, ${userData.name}`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('veloro_user');
    showToast('Logged out of Veloro Account', 'info');
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      cart,
      wishlist,
      user,
      currency,
      toast,
      loading,
      cartSubtotal,
      cartCount,
      fetchProducts,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      login,
      logout,
      setCurrency,
      showToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
