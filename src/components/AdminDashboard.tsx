import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Archive, DollarSign, Users, ShoppingCart, ListCollapse, Play, Check, ShieldAlert, Truck, Droplets, Sparkles, Layers, Lock } from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateInventory: (productId: string, newStock: number) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['shippingStatus']) => void;
  onDeleteOrder: (orderId: string) => void;
  deliveryCharge: number;
  deliveryThreshold: number;
  onUpdateDeliverySettings: (charge: number, threshold: number) => void;
  categories: { id: string; name: string; img?: string }[];
  onUpdateCategories: (newCats: { id: string; name: string; img?: string }[]) => void;
}

export default function AdminDashboard({
  products,
  orders,
  onClose,
  onAddProduct,
  onDeleteProduct,
  onUpdateInventory,
  onUpdateOrderStatus,
  onDeleteOrder,
  deliveryCharge,
  deliveryThreshold,
  onUpdateDeliverySettings,
  categories,
  onUpdateCategories,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'categories'>('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirmOrderId, setDeleteConfirmOrderId] = useState<string | null>(null);
  const [deleteConfirmProductId, setDeleteConfirmProductId] = useState<string | null>(null);

  // Category management lists states
  const [newCatName, setNewCatName] = useState('');
  const [newCatImg, setNewCatImg] = useState('');
  const [catDeleteWarningId, setCatDeleteWarningId] = useState<string | null>(null);

  // Delivery settings local inputs
  const [inputCharge, setInputCharge] = useState(String(deliveryCharge));
  const [inputThreshold, setInputThreshold] = useState(String(deliveryThreshold));
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Password and username override states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newAdminUsernameInput, setNewAdminUsernameInput] = useState(localStorage.getItem('akanksha_admin_username') || 'admin@accessoriesofakanksha.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDeliverySettings(Number(inputCharge), Number(inputThreshold));
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3500);
  };

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const storedAdminPass = localStorage.getItem('akanksha_admin_password') || 'admin123';
    if (currentPassword !== storedAdminPass) {
      setPasswordError('Current administrator password did not match records.');
      return;
    }

    if (!newAdminUsernameInput.trim()) {
      setPasswordError('Admin username/email cannot be empty.');
      return;
    }

    // If new password is provided, validate and update it
    if (newPassword) {
      if (newPassword.length < 5) {
        setPasswordError('Excellent security demands a password at least 5 characters long.');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setPasswordError('Confirm password does not match the newly entered security string.');
        return;
      }
      localStorage.setItem('akanksha_admin_password', newPassword);
    }

    localStorage.setItem('akanksha_admin_username', newAdminUsernameInput.trim().toLowerCase());
    setPasswordSuccess('Success! Administrator login credentials updated.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  // Form states for creating custom items
  const [newProd, setNewProd] = useState({
    name: '',
    price: '',
    category: categories[0]?.id || 'necklaces',
    isTennisJewellery: false,
    isWaterproof: true,
    isAntiTarnish: true,
    badge: 'Waterproof & Anti-Tarnish',
    description: '',
    material: '18K Gold Plated Brass, Genuine AAA+ Clear Crystals',
    stockCount: '35',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
  });

  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setNewProd(prev => ({ ...prev, image: e.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    const added: Product = {
      id: `p-${Date.now()}`,
      name: newProd.name,
      price: Number(newProd.price),
      originalPrice: Math.round(Number(newProd.price) * 1.5),
      category: newProd.category as any,
      isTennisJewellery: newProd.isTennisJewellery,
      isWaterproof: newProd.isWaterproof,
      isAntiTarnish: newProd.isAntiTarnish,
      images: [newProd.image],
      description: newProd.description || 'Premium meticulously crafted jewelry accessory by Accessories by Akanksha elite store lines.',
      material: newProd.material,
      stockCount: Number(newProd.stockCount) || 20,
      inStock: (Number(newProd.stockCount) || 20) > 0,
      rating: 4.8,
      reviewsCount: 1,
      badge: newProd.badge || undefined,
    };

    onAddProduct(added);
    setShowAddForm(false);
    // Reset
    setNewProd({
      name: '',
      price: '',
      category: categories[0]?.id || 'necklaces',
      isTennisJewellery: false,
      isWaterproof: true,
      isAntiTarnish: true,
      badge: 'Waterproof & Anti-Tarnish',
      description: '',
      material: '18K Gold Plated Brass, Genuine AAA+ Clear Crystals',
      stockCount: '35',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
    });
  };

  // Calculated KPI cards
  const totalSalesRevenue = orders.reduce((acc, o) => o.paymentStatus === 'Paid' ? acc + o.total : acc, 0);
  const totalStockCount = products.reduce((acc, p) => acc + p.stockCount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#FAF6F0] rounded-3xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Title Bar head */}
        <div className="bg-[#1E1C1A] text-white px-6 py-5 flex justify-between items-center border-b border-[#D4C19D]/20">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
            <h1 className="font-serif tracking-widest text-sm uppercase">Akanksha Owner Console & Administration</h1>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/65 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="bg-white border-b border-[#D4C19D]/15 p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#D4C19D]/15 flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#b89153]/10 text-[#b89153] shrink-0">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Total Sales (Prepaid)</p>
              <p className="text-sm sm:text-base font-bold text-gray-800">₹{totalSalesRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#D4C19D]/15 flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#b89153]/10 text-[#b89153] shrink-0">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Total orders</p>
              <p className="text-sm sm:text-base font-bold text-gray-800">{orders.length} orders</p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#D4C19D]/15 flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#b89153]/10 text-[#b89153] shrink-0">
              <Archive className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Active Stock count</p>
              <p className="text-sm sm:text-base font-bold text-gray-800">{totalStockCount} pieces</p>
            </div>
          </div>

          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#D4C19D]/15 flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#b89153]/10 text-[#b89153] shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Active Customers</p>
              <p className="text-sm sm:text-base font-bold text-gray-800">5 enrolled</p>
            </div>
          </div>
        </div>

        {/* INNER TABS BAR */}
        <div className="bg-[#FAF6F0] px-6 py-2 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-[#D4C19D]/10">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products' ? 'border-[#b89153] text-[#b89153]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            Manage Products & Inventory
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'categories' ? 'border-[#b89153] text-[#b89153]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            Manage Categories
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'border-[#b89153] text-[#b89153]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            Manage Customer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'border-[#b89153] text-[#b89153]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            Delivery & Shipping Settings
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[55vh] min-h-[40vh]">
          {/* TAB 1: PRODUCT LISTING & ADD FORM */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 italic">Total boutique database catalog: {products.length} items</span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 bg-[#1E1C1A] hover:bg-[#b89153] text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{showAddForm ? 'Hide Form' : 'Register New Item'}</span>
                </button>
              </div>

              {/* Add product Form */}
              {showAddForm && (
                <form onSubmit={handleCreateProduct} className="p-5 bg-white border border-[#D4C19D]/20 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 animate-fade-up">
                  <div className="col-span-12">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block border-l-2 border-amber-600 pl-2">Create Jewelry Record</span>
                  </div>

                  <div className="md:col-span-6 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={newProd.name}
                      onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      placeholder="e.g., Deluxe Tennis Ankle Chain"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      placeholder="e.g., 999"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Stock Count *</label>
                    <input
                      type="number"
                      required
                      value={newProd.stockCount}
                      onChange={(e) => setNewProd({ ...newProd, stockCount: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      placeholder="e.g., 35"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Category *</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-8 flex flex-wrap gap-4 items-center pt-5">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is-tennis-check"
                        checked={newProd.isTennisJewellery}
                        onChange={(e) => setNewProd({ ...newProd, isTennisJewellery: e.target.checked })}
                        className="h-4 w-4 text-[#b89153] focus:ring-0 rounded cursor-pointer"
                      />
                      <label htmlFor="is-tennis-check" className="text-[10px] font-bold text-gray-700 uppercase ml-1.5 block cursor-pointer">
                        Is Tennis Elite?
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is-waterproof-check"
                        checked={newProd.isWaterproof}
                        onChange={(e) => setNewProd({ ...newProd, isWaterproof: e.target.checked })}
                        className="h-4 w-4 text-[#b89153] focus:ring-0 rounded cursor-pointer"
                      />
                      <label htmlFor="is-waterproof-check" className="text-[10px] font-bold text-gray-700 uppercase ml-1.5 block cursor-pointer">
                        💧 Waterproof
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is-anti-tarnish-check"
                        checked={newProd.isAntiTarnish}
                        onChange={(e) => setNewProd({ ...newProd, isAntiTarnish: e.target.checked })}
                        className="h-4 w-4 text-[#b89153] focus:ring-0 rounded cursor-pointer"
                      />
                      <label htmlFor="is-anti-tarnish-check" className="text-[10px] font-bold text-gray-700 uppercase ml-1.5 block cursor-pointer">
                        ✨ Anti-Tarnish
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Product custom badge / Label text</label>
                    <input
                      type="text"
                      value={newProd.badge}
                      onChange={(e) => setNewProd({ ...newProd, badge: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      placeholder="e.g., Waterproof & Anti-Tarnish"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Plating / Sizing details</label>
                    <input
                      type="text"
                      value={newProd.material}
                      onChange={(e) => setNewProd({ ...newProd, material: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      placeholder="e.g., 18K Gold Plated Brass, Genuine AAA+ Clear Crystals"
                    />
                  </div>

                  {/* Drag and Drop Product Showcase Image */}
                  <div className="col-span-12 space-y-2 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Product Showcase Image *</label>
                    
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all bg-[#FAF6F0] relative flex flex-col md:flex-row items-center justify-center gap-6 cursor-pointer ${
                        dragActive 
                          ? 'border-[#b89153] bg-[#b89153]/10' 
                          : 'border-[#D4C19D]/30 hover:border-[#b89153]/50'
                      }`}
                    >
                      <input
                        type="file"
                        id="prod-file-upload"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      
                      {/* Left: Image preview or placeholder icon */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-[#D4C19D]/25 flex items-center justify-center shrink-0 relative shadow-inner">
                        {newProd.image ? (
                          <img src={newProd.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <Droplets className="w-8 h-8 text-gray-300 animate-pulse" />
                        )}
                      </div>
                      
                      {/* Right: upload text instructions */}
                      <div className="space-y-1 text-center md:text-left">
                        <p className="text-xs font-semibold text-gray-700">Drag & drop product image file here</p>
                        <p className="text-[11px] text-[#b89153] underline font-medium">or click to choose custom local file</p>
                        <p className="text-[9px] text-gray-400">Perfect for PNG, JPG, JPEG, SVG or WebP formats</p>
                      </div>
                    </div>

                    {/* Or paste directly via text URL */}
                    <div className="pt-1 bg-white/40 p-2.5 rounded-xl border border-dashed border-[#D4C19D]/20">
                      <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Direct High-Resolution Web Image URL (Optional Overlay):</p>
                      <input
                        type="text"
                        value={newProd.image}
                        onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                        className="w-full bg-[#FAF6F0] border border-[#D4C19D]/15 rounded-xl px-3 py-1.5 text-[11px] text-gray-650 focus:outline-none"
                        placeholder="Or customize via Direct URL"
                      />
                    </div>
                  </div>

                  <div className="col-span-12 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block">Product description (Shows on detail overview tab)</label>
                    <textarea
                      rows={2}
                      value={newProd.description}
                      onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs focus:outline-none resize-none"
                      placeholder="Enter detailed review lines, base material details, plating or unique style highlights of the accessory..."
                    />
                  </div>

                  <div className="col-span-12 text-right">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#b89153] hover:bg-[#1E1C1A] text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition-all"
                    >
                      Publish to Boutique Showcase
                    </button>
                  </div>
                </form>
              )}

              {/* Products Inventory Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((p) => (
                  <div key={p.id} className="p-3.5 bg-white border border-[#D4C19D]/15 rounded-2xl flex justify-between items-center">
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF6F0] relative border shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate leading-tight">{p.name}</p>
                        <p className="text-[10px] text-gray-400 capitalize mt-0.5">{p.category} | {p.material.substring(0, 30)}...</p>
                        <div className="flex gap-3 pt-1 text-[11px] font-bold text-gray-700">
                          <span className="text-[#b89153]">₹{p.price}</span>
                          <span className="font-medium text-gray-400">Stock count:</span>
                          <span className={`${p.stockCount < 10 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{p.stockCount} remaining</span>
                        </div>
                      </div>
                    </div>

                    {/* Adjust limits & Trash */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center scale-90 border rounded-lg bg-[#FAF6F0]">
                        <button
                          onClick={() => onUpdateInventory(p.id, Math.max(0, p.stockCount - 1))}
                          className="px-2 py-1 hover:text-[#b89153] text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-1.5 text-xs font-bold text-gray-650">{p.stockCount}</span>
                        <button
                          onClick={() => onUpdateInventory(p.id, p.stockCount + 1)}
                          className="px-2 py-1 hover:text-[#b89153] text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                      {deleteConfirmProductId === p.id ? (
                        <div className="flex items-center gap-1.5 animate-fade-in sm:scale-95 origin-right">
                          <button
                            onClick={() => {
                              onDeleteProduct(p.id);
                              setDeleteConfirmProductId(null);
                            }}
                            className="px-2 py-1 text-[10px] bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmProductId(null)}
                            className="px-2 py-1 text-[10px] bg-gray-205 text-gray-700 rounded font-bold hover:bg-gray-300 transition-colors cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmProductId(p.id)}
                          className="p-1 px-1.5 text-red-500 hover:bg-[#FAF6F0] rounded cursor-pointer"
                          title="Remove Product Listing"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE CUSTOMER ORDERS & TIMELINE SHIPMENTS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <span className="text-xs text-gray-500 italic block border-b border-[#D4C19D]/10 pb-2">Active store checkouts: {orders.length} transactions</span>
              {orders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="font-serif text-[#1E1C1A] text-sm font-semibold">No transactions available yet.</p>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto">Place a purchase through the client cart drawer mock checkout to load items here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 bg-white border border-[#D4C19D]/20 rounded-2xl space-y-3.5 text-left">
                      <div className="flex justify-between items-start flex-wrap gap-2 pb-2.5 border-b border-[#D4C19D]/10">
                        <div>
                          <span className="font-mono text-xs font-bold text-gray-900">Order Ref: {o.id}</span>
                          <p className="text-[10px] text-gray-500">{o.date} &bull; Client: {o.customerName} &bull; {o.customerEmail}</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="text-right">
                            <p className="text-xs font-serif font-bold text-gray-800">Total: ₹{o.total.toLocaleString('en-IN')}</p>
                            <span className="text-[9px] bg-[#FAF6F0] border px-1.5 py-0.5 rounded text-gray-600 font-mono inline-block mt-0.5">{o.trackingNumber}</span>
                          </div>
                          {deleteConfirmOrderId === o.id ? (
                            <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-xl border border-red-200 animate-fade-in shrink-0">
                              <button
                                onClick={() => {
                                  onDeleteOrder(o.id);
                                  setDeleteConfirmOrderId(null);
                                }}
                                className="px-2 py-1 text-[10px] bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmOrderId(null)}
                                className="px-2 py-1 text-[10px] bg-gray-200 text-gray-850 rounded-lg font-bold hover:bg-gray-300 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmOrderId(o.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors cursor-pointer mt-0.5"
                              title="Delete Customer Order"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {o.items.map((it, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <div className="w-8 h-8 rounded overflow-hidden bg-gray-50 border shrink-0">
                              <img src={it.image} alt={it.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <p className="truncate text-gray-750 font-light max-w-[200px]">{it.productName} (x{it.quantity}) &bull; <span className="text-[#b89153]">{it.color}</span></p>
                          </div>
                        ))}
                      </div>

                      {/* ADJUST SHIPPING STATUS TIMELINE */}
                      <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4C19D]/15 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-750">
                          <span>Timeline courier status:</span>
                          <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] uppercase font-bold tracking-widest px-1.5 rounded">
                            {o.shippingStatus}
                          </span>
                        </div>

                        {/* Dropdown status update setter */}
                        <div className="flex gap-1.5 items-center">
                          <span className="text-[10px] text-gray-400">Promote phase:</span>
                          <div className="flex gap-1">
                            {['Processing', 'Dispatched', 'Out for Delivery', 'Delivered'].map((phase) => (
                              <button
                                key={phase}
                                onClick={() => onUpdateOrderStatus(o.id, phase as any)}
                                className={`px-2 py-1 text-[9px] font-bold uppercase rounded-lg transition-colors border ${
                                  o.shippingStatus === phase
                                    ? 'bg-[#1E1C1A] text-[#FAF6F0] border-[#1E1C1A]'
                                    : 'bg-white text-gray-500 border-[#D4C19D]/15 hover:border-gray-400'
                                }`}
                              >
                                {phase === 'Processing' ? 'Step 1' : phase === 'Dispatched' ? 'Step 2' : phase === 'Out for Delivery' ? 'Step 3' : 'Step 4'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DELIVERY & SHIPPING SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left items-start pb-10">
              
              {/* Delivery rates form block */}
              <form onSubmit={handleSaveSettings} className="space-y-6 p-6 bg-white border border-[#D4C19D]/15 rounded-3xl shadow-sm">
                <h3 className="font-serif text-[#1E1C1A] text-base font-semibold uppercase tracking-wide border-b border-[#D4C19D]/10 pb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#b89153]" />
                  Configure Shipping Rates & Policies
                </h3>
                
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  As the boutique administrator, you can configure global courier charges and threshold values dynamically. These adjustments synchronized immediately across client checkouts.
                </p>

                {settingsSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5 font-medium animate-fade-up">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Global delivery policies updated successfully!
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-650 block">Standard Delivery Fee (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={inputCharge}
                      onChange={(e) => setInputCharge(e.target.value)}
                      className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#b89153]"
                      placeholder="e.g. 60"
                    />
                    <p className="text-[10px] text-gray-400 italic">Standard rate applied to purchases underneath the free checkout pricing mark.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-650 block">Free Shipping Threshold Target (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={inputThreshold}
                      onChange={(e) => setInputThreshold(e.target.value)}
                      className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#b89153]"
                      placeholder="e.g. 499"
                    />
                    <p className="text-[10px] text-gray-400 italic">Handoffs above this item subtotal will dismiss the standard delivery fee completely.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Save Delivery Policies
                </button>
              </form>

              {/* Credentials update block */}
              <form onSubmit={handleChangeCredentials} className="space-y-6 p-6 bg-white border border-[#D4C19D]/15 rounded-3xl shadow-sm">
                <h3 className="font-serif text-[#1E1C1A] text-base font-semibold uppercase tracking-wide border-b border-[#D4C19D]/10 pb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#b89153]" />
                  Change Admin Credentials
                </h3>
                
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  Keep your digital showcase secure. You can update your Admin Username/Email, and optionally specify a new password passcode.
                </p>

                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-medium animate-fade-in">
                    ⚠️ {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5 font-medium animate-fade-up">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    {passwordSuccess}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-650 block font-sans">Admin Username / Email *</label>
                    <input
                      type="text"
                      required
                      value={newAdminUsernameInput}
                      onChange={(e) => setNewAdminUsernameInput(e.target.value)}
                      className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#b89153]"
                      placeholder="e.g. admin@accessoriesofakanksha.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-650 block font-sans">Current Admin Password (Required to Save) *</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#b89153]"
                      placeholder="••••••••"
                    />
                  </div>

                  <hr className="border-[#D4C19D]/20 my-2" />

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-650 block font-sans">New Password (Leave blank to keep current)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#b89153]"
                      placeholder="Min 5 characters"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-650 block font-sans">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#b89153]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Save Admin Credentials
                </button>
              </form>

            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-8 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Category Form Column */}
                <div className="bg-white border border-[#D4C19D]/15 p-6 rounded-3xl space-y-4 h-fit">
                  <h3 className="font-serif text-[#1E1C1A] text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4C19D]/10 pb-2">
                    <Plus className="h-4 w-4 text-[#b89153]" />
                    Add New Category
                  </h3>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newCatName.trim()) return;
                      const catId = newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      if (categories.some(c => c.id === catId)) {
                        alert('A category with this name or ID already exists!');
                        return;
                      }
                      const newlyCreated = {
                        id: catId,
                        name: newCatName.trim(),
                        img: newCatImg.trim() || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80'
                      };
                      onUpdateCategories([...categories, newlyCreated]);
                      setNewCatName('');
                      setNewCatImg('');
                    }} 
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Category Name *</label>
                      <input
                        type="text"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g., Anklets, Body Chains"
                        className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Image URL (Optional)</label>
                      <input
                        type="text"
                        value={newCatImg}
                        onChange={(e) => setNewCatImg(e.target.value)}
                        placeholder="e.g., Unsplash jewelry photo URL"
                        className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                      <p className="text-[9px] text-gray-400">If omitted, a beautiful fine-jewelry placeholder image is assigned automatically.</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Create Category
                    </button>
                  </form>
                </div>

                {/* Existing Categories Dashboard Grid Column */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-serif text-[#1E1C1A] text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4C19D]/10 pb-2">
                    <Layers className="h-4 w-4 text-[#b89153]" />
                    Active Store Collections ({categories.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((cat) => {
                      const associatedCount = products.filter(p => p.category === cat.id).length;
                      const isWarn = catDeleteWarningId === cat.id;

                      return (
                        <div 
                          key={cat.id} 
                          className="bg-white border border-[#D4C19D]/15 p-4 rounded-2xl flex gap-3 shadow-xs relative overflow-hidden group hover:border-[#b89153]/40 transition-colors"
                        >
                          {/* Image preview square */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#D4C19D]/10 shrink-0">
                            <img 
                              src={cat.img || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80'} 
                              alt={cat.name} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <p className="font-serif text-xs font-bold text-gray-800 uppercase block truncate">{cat.name}</p>
                            <p className="text-[10px] text-[#b89153] font-mono select-all">id: {cat.id}</p>
                            <span className="inline-block bg-[#1E1C1A]/5 text-gray-600 text-[9px] px-1.5 py-0.5 rounded-full font-semibold">
                              {associatedCount} active {associatedCount === 1 ? 'product' : 'products'}
                            </span>
                          </div>

                          {/* Actions / Delete */}
                          <div className="flex items-start shrink-0">
                            {isWarn ? (
                              <div className="absolute inset-0 bg-white/95 flex flex-col justify-center items-center p-3 text-center z-10 animate-fade-in space-y-1.5">
                                <p className="text-[10px] text-red-600 font-bold uppercase leading-tight">
                                  ⚠️ Confirm Deletion?
                                </p>
                                <p className="text-[9px] text-gray-500 leading-normal max-w-[200px]">
                                  Associated products ({associatedCount}) will fallback to generic options. There is no undo!
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      // Perform deletion of category
                                      const updatedCats = categories.filter(c => c.id !== cat.id);
                                      onUpdateCategories(updatedCats);
                                      setCatDeleteWarningId(null);
                                    }}
                                    className="bg-red-650 hover:bg-red-700 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                                  >
                                    Yes, Delete
                                  </button>
                                  <button
                                    onClick={() => setCatDeleteWarningId(null)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setCatDeleteWarningId(cat.id)}
                                title="Delete collection category"
                                className="p-1.5 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
