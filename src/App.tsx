import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ArrowRight, 
  Instagram, 
  Send, 
  CheckCircle,
  HelpCircle,
  Phone,
  MessageSquare,
  Gift,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Lock,
  Droplets
} from 'lucide-react';

import { Product, CartItem, Order, User } from './types';
import { products as baseProducts, reviews as customerReviews } from './data/products';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailDrawer from './components/ProductDetailDrawer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTracker from './components/OrderTracker';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  // --- CORE DEEP STATES ---
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // --- SHIPPING & DELIVERY CONTROL STATES ---
  const [deliveryCharge, setDeliveryCharge] = useState<number>(() => {
    const saved = localStorage.getItem('akanksha_delivery_charge');
    return saved !== null ? Number(saved) : 60;
  });
  const [deliveryThreshold, setDeliveryThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('akanksha_delivery_threshold');
    return saved !== null ? Number(saved) : 499;
  });

  const handleUpdateDeliverySettings = (charge: number, threshold: number) => {
    setDeliveryCharge(charge);
    setDeliveryThreshold(threshold);
    localStorage.setItem('akanksha_delivery_charge', String(charge));
    localStorage.setItem('akanksha_delivery_threshold', String(threshold));
  };

  // --- FILTER & DISPLAY STATES ---
  const [categories, setCategories] = useState<{ id: string; name: string; img?: string }[]>(() => {
    const saved = localStorage.getItem('akanksha_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: 'necklaces', name: 'Chains', img: 'https://arakshe22extc-byte.github.io/acessriesbyakanksha1/korean%20chain%20299%20-%20chain%20-6.jpg' },
      { id: 'bracelets', name: 'Bracelets', img: 'https://arakshe22extc-byte.github.io/acessriesbyakanksha1/white%20heart%20braaclet%20300%20-%20braclet%204.jpg' },
      { id: 'rings', name: 'Rings', img: 'https://arakshe22extc-byte.github.io/acessriesbyakanksha1/v%20ring%20silver%202%20at%20180%20rupee.jpg' },
      { id: 'earrings', name: 'Earrings', img: 'https://arakshe22extc-byte.github.io/acessriesbyakanksha1/plain%20heart%20earrings%203%20-%2099%20ruppes.jpg' },
      { id: 'sets', name: 'Combos / Sets', img: 'https://arakshe22extc-byte.github.io/acessriesbyakanksha1/combo%20sky%20and%20chain%20550.jpg' },
      { id: 'charms', name: 'Charms & Key', img: 'https://arakshe22extc-byte.github.io/acessriesbyakanksha1/phone%20charms%20200.jpg' },
    ];
  });

  const handleUpdateCategories = (newCats: { id: string; name: string; img?: string }[]) => {
    setCategories(newCats);
    localStorage.setItem('akanksha_categories', JSON.stringify(newCats));
  };

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyWaterproof, setOnlyWaterproof] = useState<boolean>(false);

  // --- DRAWER & OVERLAY MODAL STATES ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [orderTrackOpen, setOrderTrackOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminViewMode, setAdminViewMode] = useState<'console' | 'dashboard' | 'account'>('console');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // --- CHECKOUT SUB-STATES ---
  const [activeDiscount, setActiveDiscount] = useState(0);
  const [activePromoCode, setActivePromoCode] = useState('');
  const [trackImmediateId, setTrackImmediateId] = useState('');

  // --- NEWSLETTER STATE ---
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // --- BOOTSTRAP INITIALlocalStorage ---
  useEffect(() => {
    // 1. Products bootstrap
    const localProds = localStorage.getItem('akanksha_products');
    let productsToUse = baseProducts;
    if (localProds) {
      const parsedProds = JSON.parse(localProds);
      const hasSamples = parsedProds.some((p: any) => p.id.startsWith('tennis-'));
      if (hasSamples) {
        localStorage.setItem('akanksha_products', JSON.stringify(baseProducts));
        productsToUse = baseProducts;
      } else {
        productsToUse = parsedProds.map((p: any) => ({ ...p, badge: 'Anti-Tarnish' }));
      }
    } else {
      localStorage.setItem('akanksha_products', JSON.stringify(baseProducts));
    }
    setProducts(productsToUse);

    // 2. Active Cart list
    const localCart = localStorage.getItem('akanksha_cart');
    if (localCart) setCart(JSON.parse(localCart));

    // 3. Wishlisted list
    const localWish = localStorage.getItem('akanksha_wishlist');
    if (localWish) setWishlist(JSON.parse(localWish));

    // 4. Client transactions orders list
    const localOrders = localStorage.getItem('akanksha_orders');
    if (localOrders) {
      setOrders(JSON.parse(localOrders));
    } else {
      // Mock initial demo orders so that user tracker immediately displays beautiful metrics
      const demoOrders: Order[] = [
        {
          id: 'AK-394821',
          date: '2026-05-30',
          customerName: 'Aishwarya R.',
          customerEmail: 'aishwarya@gmail.com',
          shippingAddress: {
            address: '402, Sea Breeze Apts, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            phone: '+91 98210 54321',
          },
          items: [
            {
              productId: 'site-cnt-03',
              productName: 'Pink Square Diamond Chain',
              price: 280,
              quantity: 1,
              image: 'https://arakshe22extc-byte.github.io/acessriesbyakanksha1/pink%20square%20diamond%20280%20chain%20-3.jpg',
              color: 'gold',
              size: 'Standard Size',
            }
          ],
          subtotal: 280,
          deliveryCharges: 0,
          total: 280,
          paymentMethod: 'CARD',
          paymentStatus: 'Paid',
          shippingStatus: 'Dispatched',
          trackingNumber: 'TRAK-84201948',
        }
      ];
      localStorage.setItem('akanksha_orders', JSON.stringify(demoOrders));
      setOrders(demoOrders);
    }

    // 5. User authentication state
    const localUser = localStorage.getItem('akanksha_user');
    if (localUser) setCurrentUser(JSON.parse(localUser));
  }, []);

  // --- DYNAMIC HELPERS to sync localStorage ---
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('akanksha_cart', JSON.stringify(newCart));
  };

  const saveWishlist = (newWish: Product[]) => {
    setWishlist(newWish);
    localStorage.setItem('akanksha_wishlist', JSON.stringify(newWish));
  };

  const saveProducts = (newProds: Product[]) => {
    setProducts(newProds);
    localStorage.setItem('akanksha_products', JSON.stringify(newProds));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('akanksha_orders', JSON.stringify(newOrders));
  };

  // --- CORE EVENT HANDLERS ---
  const handleAddToCart = (product: Product, quantity = 1, color: 'gold' | 'silver' = 'gold', size = 'Standard Size') => {
    const existingIdx = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
    );

    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += quantity;
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity, selectedColor: color, selectedSize: size }]);
    }
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number, color?: string, size?: string) => {
    const updated = cart.map((item) => {
      if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveCartItem = (productId: string, color?: string, size?: string) => {
    const filtered = cart.filter(
      (item) => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
    );
    saveCart(filtered);
  };

  const handleToggleWishlist = (product: Product) => {
    const isPresent = wishlist.some((item) => item.id === product.id);
    if (isPresent) {
      saveWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      saveWishlist([...wishlist, product]);
    }
  };

  const handleMoveWishlistToCart = (product: Product) => {
    handleAddToCart(product, 1, 'gold', 'Standard Size');
    saveWishlist(wishlist.filter((item) => item.id !== product.id));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('akanksha_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('akanksha_user');
    setCart([]);
    localStorage.removeItem('akanksha_cart');
    setWishlist([]);
    localStorage.removeItem('akanksha_wishlist');
    setOrders([]);
    localStorage.removeItem('akanksha_orders');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  // --- CHECKOUT COUPLERS ---
  const handleStartCheckout = (discount: number, promo: string) => {
    if (!currentUser) {
      alert('To complete your luxurious purchase, please Register or Log In first. This keeps your delivery information and purchase receipt secure under your account!');
      setAuthOpen(true);
      return;
    }
    setActiveDiscount(discount);
    setActivePromoCode(promo);
    setCartOpen(false);
    
    // Auto launch Checkout or ask user to authenticate / login first as helpful guidance
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    
    // Reduce product quantities in Manage Products & Inventory
    const updatedProducts = products.map((p) => {
      const orderedItem = newOrder.items.find((item) => item.productId === p.id);
      if (orderedItem) {
        const newStock = Math.max(0, p.stockCount - orderedItem.quantity);
        return {
          ...p,
          stockCount: newStock,
          inStock: newStock > 0,
        };
      }
      return p;
    });
    saveProducts(updatedProducts);
    
    // Clear active card purchases
    saveCart([]);
    setCheckoutOpen(false);

    // Save in local guest session order list
    try {
      const localGuestIds = JSON.parse(localStorage.getItem('akanksha_session_order_ids') || '[]');
      if (!localGuestIds.includes(newOrder.id)) {
        localGuestIds.push(newOrder.id);
        localStorage.setItem('akanksha_session_order_ids', JSON.stringify(localGuestIds));
      }
    } catch (err) {
      console.warn('Silent local guest sync error:', err);
    }
    
    // Auto redirect target tracker input
    setTrackImmediateId(newOrder.id);
    setOrderTrackOpen(true);
  };

  // --- ADMIN INTERFACE SHIMS ---
  const handleAdminAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    saveProducts(updated);
  };

  const handleAdminDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    saveProducts(updated);
  };

  const handleAdminUpdateInventory = (productId: string, newStock: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stockCount: newStock, inStock: newStock > 0 };
      }
      return p;
    });
    saveProducts(updated);
  };

  const handleAdminUpdateOrderStatus = (orderId: string, newStatus: Order['shippingStatus'], reason?: string) => {
    const orderToUpdate = orders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    const oldStatus = orderToUpdate.shippingStatus;
    if (oldStatus === newStatus) return;

    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { 
          ...o, 
          shippingStatus: newStatus,
          ...(newStatus === 'Cancelled' && reason ? { cancelReason: reason } : {})
        };
      }
      return o;
    });
    saveOrders(updated);

    // If changing TO Cancelled from active status, restore inventory stock count
    if (newStatus === 'Cancelled') {
      const updatedProducts = products.map((p) => {
        const orderedItem = orderToUpdate.items.find((item) => item.productId === p.id);
        if (orderedItem) {
          const newStock = p.stockCount + orderedItem.quantity;
          return {
            ...p,
            stockCount: newStock,
            inStock: true,
          };
        }
        return p;
      });
      saveProducts(updatedProducts);
    }
    // If changing FROM Cancelled to active status, reduce inventory stock count
    else if (oldStatus === 'Cancelled') {
      const updatedProducts = products.map((p) => {
        const orderedItem = orderToUpdate.items.find((item) => item.productId === p.id);
        if (orderedItem) {
          const newStock = Math.max(0, p.stockCount - orderedItem.quantity);
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0,
          };
        }
        return p;
      });
      saveProducts(updatedProducts);
    }
  };

  const handleAdminDeleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    saveOrders(updated);
  };

  // --- DYNAMIC FILTER RUNS FOR BOUTIQUE ---
  const filteredProducts = products.filter((p) => {
    // 1. Category check
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    
    // 2. Search check
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.material.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // 3. Waterproof check
    const matchesWaterproof = onlyWaterproof ? (p.isWaterproof !== false || p.badge?.toLowerCase().includes('waterproof') || p.id === 'site-cnt-01') : true;

    return matchesCategory && matchesSearch && matchesWaterproof;
  });

  const bestsellers = products.filter((p) => p.isBestseller);

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-gray-800">
      
      {/* 1. STICKY TOP BANNER NAVBAR */}
      <Navbar
        categories={categories}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setOnlyWaterproof(false);
          const block = document.getElementById('boutique-showcase-grid');
          if (block) block.scrollIntoView({ behavior: 'smooth' });
        }}
        activeCategory={activeCategory}
        cartCount={cart.reduce((acc, it) => acc + it.quantity, 0)}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenOrderTracker={() => {
          if (!currentUser) {
            alert('To securely track your orders, you must be logged in. Let\'s get you signed in or registered first!');
            setAuthOpen(true);
            return;
          }
          setTrackImmediateId('');
          setOrderTrackOpen(true);
        }}
        onOpenAdmin={(mode) => {
          setAdminViewMode(mode);
          setAdminOpen(true);
        }}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          const block = document.getElementById('boutique-showcase-grid');
          if (block) block.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. MAIN HOMEPAGE WRAPPER */}
      <main className="flex-1">
        
        {/* EDITORIAL HERO */}
        <Hero 
          onShopCollection={() => {
            setActiveCategory('all');
            setOnlyWaterproof(false);
            const block = document.getElementById('boutique-showcase-grid');
            if (block) block.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreTennis={() => {
            setOnlyWaterproof(true);
            setActiveCategory('all');
            const block = document.getElementById('boutique-showcase-grid');
            if (block) block.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. LUXURY FEATURED CATEGORIES CLUSTER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-[10px] tracking-[0.3em] text-[#b89153] font-bold uppercase block">Browse by category</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1C1A]">Precious Collections</h2>
            <div className="w-12 h-0.5 bg-[#b89153] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOnlyWaterproof(false);
                    const block = document.getElementById('boutique-showcase-grid');
                    if (block) block.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative h-40 rounded-2xl overflow-hidden shadow-sm border border-[#D4C19D]/10 cursor-pointer text-left"
                >
                  <img src={cat.img || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80'} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C1A]/85 via-[#1E1C1A]/20 to-transparent flex flex-col justify-end p-3" />
                  <div className="absolute bottom-3 left-3 z-10 text-white">
                    <p className="font-serif text-xs font-bold uppercase tracking-wider">{cat.name}</p>
                    <p className="text-[8px] text-gray-300 font-light tracking-wide">{count} premium {count === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. BESTSELLERS CAROUSEL ROW */}
        <section className="bg-white/60 border-y border-[#D4C19D]/15 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] tracking-[0.3em] text-[#b89153] font-bold uppercase block">Highly Coveted</span>
                <p className="font-serif text-2xl font-bold text-[#1E1C1A]">Akanksha Bestsellers</p>
              </div>
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setOnlyWaterproof(true);
                  const block = document.getElementById('boutique-showcase-grid');
                  if (block) block.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs uppercase font-bold text-[#b89153] hover:underline flex items-center gap-1 shrink-0 px-4 py-2 hover:bg-[#FAF6F0] rounded-full transition-colors"
              >
                <span>Discover Waterproof Jewels</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestsellers.slice(0, 4).map((item) => (
                <div key={item.id}>
                  <ProductCard
                    product={item}
                    onAddToCart={(p) => handleAddToCart(p)}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some((w) => w.id === item.id)}
                    onSelectProduct={setSelectedProduct}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BOUTIQUE CATALOG WITH SEARCH & FILTER SYSTEM */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-8" id="boutique-showcase-grid">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center space-y-1.5">
              <span className="text-[10px] tracking-[0.3em] text-[#b89153] font-bold uppercase block">The Boutique Curates</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1C1A]">Explore Full Collection</h2>
              <div className="w-12 h-0.5 bg-[#b89153] mx-auto mt-2" />
            </div>

            {/* In-view filter operations and switches */}
            <div className="w-full max-w-4xl bg-white border border-[#D4C19D]/15 p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Left filter options categories */}
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {[
                  { id: 'all', label: 'All Listings' },
                  ...categories.map((c) => ({ id: c.id, label: c.name })),
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCategory(tab.id);
                      setOnlyWaterproof(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategory === tab.id && !onlyWaterproof
                        ? 'bg-[#1E1C1A] text-white'
                        : 'bg-[#FAF6F0] hover:bg-[#D4C19D]/15 text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Right Waterproof exclusive toggle */}
              <button
                onClick={() => {
                  setOnlyWaterproof(!onlyWaterproof);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 border transition-all cursor-pointer ${
                  onlyWaterproof
                    ? 'bg-[#1E1C1A] text-[#FAF6F0] border-[#1E1C1A]'
                    : 'bg-white text-gray-700 border-[#D4C19D]/30 shadow-xs hover:border-gray-400'
                }`}
              >
                <Droplets className="h-3.5 w-3.5" />
                <span>Waterproof Only</span>
              </button>
            </div>
          </div>

          {/* Catalog grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 space-y-3 bg-white border rounded-3xl p-6">
              <SlidersHorizontal className="h-10 w-10 text-gray-300 mx-auto" />
              <div>
                <p className="font-serif text-[#1E1C1A] text-lg font-bold">No jewelry pieces match your search filter</p>
                <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
                  Try clearing your search query or enabling category "All Listings" to retrieve more anti-tarnish premium models.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setOnlyWaterproof(false);
                }}
                className="mt-2 text-xs font-semibold text-[#b89153] hover:underline uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard
                    product={p}
                    onAddToCart={(prod) => handleAddToCart(prod)}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some((w) => w.id === p.id)}
                    onSelectProduct={setSelectedProduct}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#1E1C1A] text-white pt-12 pb-8 border-t border-[#D4C19D]/15 font-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-white/5">
          {/* Col 1 Brand branding */}
          <div className="space-y-4 text-left">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.3em] text-[#b89153] uppercase font-bold">Accessories by Akanksha</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Luxurious watersafe accessories engineered to resist tarnish. Inspiring premium fashion in athletic settings and daily commutes seamlessly since 2026.
            </p>
          </div>

          {/* Col 2 Collection Quick Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-[#b89153] text-xs font-bold uppercase tracking-widest font-serif">Deep Curations</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => { setActiveCategory('necklaces'); setOnlyWaterproof(true); }} className="hover:text-white transition-colors">Premium Waterproof Chains</button></li>
              <li><button onClick={() => { setActiveCategory('bracelets'); setOnlyWaterproof(true); }} className="hover:text-white transition-colors">Waterproof Bracelets</button></li>
              <li><button onClick={() => { setActiveCategory('necklaces'); setOnlyWaterproof(false); }} className="hover:text-white transition-colors">Classic Anti-Tarnish Chains</button></li>
              <li><button onClick={() => { setActiveCategory('rings'); setOnlyWaterproof(false); }} className="hover:text-white transition-colors">Chevron Rings</button></li>
              <li><button onClick={() => { setActiveCategory('sets'); setOnlyWaterproof(false); }} className="hover:text-white transition-colors">Waterproof Gifts Combos</button></li>
            </ul>
          </div>

          {/* Col 3 Contact credentials details */}
          <div className="space-y-3.5 text-left text-xs">
            <h4 className="text-[#b89153] text-xs font-bold uppercase tracking-widest font-serif">Connect with Us</h4>
            <div className="space-y-2.5 text-gray-400">
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-[#b89153] mt-0.5 shrink-0" />
                <span>Call/WhatsApp: +91 93223 67084</span>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-[#b89153] mt-0.5 shrink-0" />
                <span>Email: akanksharakshe13@gmail.com</span>
              </div>
              <p className="text-[10px] text-gray-400 italic mt-1 pb-1">
                Office: At. Post Sadvali Devrukh Tal- Sangmeshwar Dist- Ratnagiri 415804
              </p>
            </div>
          </div>
        </div>

        {/* Credit bottom line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 gap-4">
          <p>© 2026 Accessories by Akanksha. All Rights Protected.</p>
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>Encrypted PCI Compliance Gateway Directives</span>
          </div>
        </div>
      </footer>


      {/* ===================== OVERLAYS / DRAWER MODALS DECLARATIONS ===================== */}

      {/* A. PRODUCT IN-DEPTH DETAIL ACCORDION VIEWER DRAWER */}
      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some((w) => w.id === selectedProduct.id)}
          allProducts={products}
          onSelectRelated={(relatedItem) => setSelectedProduct(relatedItem)}
        />
      )}

      {/* B. CART DRAWER OVERLAY */}
      {cartOpen && (
        <CartDrawer
          cartItems={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onStartCheckout={handleStartCheckout}
          deliveryCharge={deliveryCharge}
          deliveryThreshold={deliveryThreshold}
        />
      )}

      {/* C. WISHLIST DRAWER OVERLAY */}
      {wishlistOpen && (
        <WishlistDrawer
          wishlistItems={wishlist}
          onClose={() => setWishlistOpen(false)}
          onRemoveItem={handleToggleWishlist}
          onMoveToCart={handleMoveWishlistToCart}
        />
      )}

      {/* D. SECURE CHECKOUT PAYMENTS WIZARD */}
      {checkoutOpen && (
        <CheckoutModal
          cartItems={cart}
          discountPercent={activeDiscount}
          promoApplied={activePromoCode}
          onClose={() => setCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
          currentUserEmail={currentUser?.email || ''}
          currentUserName={currentUser?.name || ''}
          deliveryCharge={deliveryCharge}
          deliveryThreshold={deliveryThreshold}
          currentUser={currentUser}
        />
      )}

      {/* E. TRANSIT TRACK TIMELINE GRAPHICS MAP */}
      {orderTrackOpen && (
        <OrderTracker
          orders={orders}
          onClose={() => setOrderTrackOpen(false)}
          onTrackImmediateId={trackImmediateId}
          onCancelOrder={(orderId, reason) => handleAdminUpdateOrderStatus(orderId, 'Cancelled', reason)}
          currentUser={currentUser}
        />
      )}

      {/* F. STANDARD REGISTRATION LOGIN USER ACCESS PORTAL */}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onLoginSuccess={handleLogin}
        />
      )}

      {/* G. STORE OWNER ADMIN INSTRUMENTS CONTROL MODULE */}
      {adminOpen && (
        <AdminDashboard
          viewMode={adminViewMode}
          products={products}
          orders={orders}
          onClose={() => setAdminOpen(false)}
          onAddProduct={handleAdminAddProduct}
          onDeleteProduct={handleAdminDeleteProduct}
          onUpdateInventory={handleAdminUpdateInventory}
          onUpdateOrderStatus={handleAdminUpdateOrderStatus}
          onDeleteOrder={handleAdminDeleteOrder}
          deliveryCharge={deliveryCharge}
          deliveryThreshold={deliveryThreshold}
          onUpdateDeliverySettings={handleUpdateDeliverySettings}
          categories={categories}
          onUpdateCategories={handleUpdateCategories}
        />
      )}

    </div>
  );
}
