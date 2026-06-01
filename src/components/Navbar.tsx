import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Settings, Compass, HelpCircle, LogOut, Menu, X, ArrowUpRight } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  onCategoryChange: (category: string) => void;
  activeCategory: string;
  cartCount: number;
  wishlistCount: number;
  currentUser: UserType | null;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenOrderTracker: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: { id: string; name: string }[];
}

export default function Navbar({
  onCategoryChange,
  activeCategory,
  cartCount,
  wishlistCount,
  currentUser,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenOrderTracker,
  onOpenAdmin,
  onLogout,
  searchQuery,
  onSearchChange,
  categories,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const fullCategories = [
    { id: 'all', name: 'All Collection' },
    ...categories,
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#D4C19D]/20 transition-all duration-300">
      {/* Promotion Line */}
      <div className="bg-[#1E1C1A] text-[#FAF6F0] text-center py-1.5 text-xs font-light tracking-widest uppercase flex items-center justify-center gap-2">
        <span>✨ PREMIUM ANTI-TARNISH & WATERPROOF TENNIS COLLECTION</span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline">FREE SHIPPING ACROSS INDIA FOR ORDERS OVER ₹499 ✨</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1E1C1A] hover:text-[#b89153] transition-colors p-1"
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo Brand Title */}
          <div className="flex-1 md:flex-initial flex justify-center md:justify-start items-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCategoryChange('all');
              }}
              className="flex flex-col items-center md:items-start group"
            >
              <span className="text-sm tracking-[0.25em] uppercase text-[#b89153] font-medium transition-colors duration-300 group-hover:text-[#1E1C1A]">
                Accessories by Akanksha
              </span>
            </a>
          </div>

          {/* Desktop Nav Actions / Categories */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {fullCategories.slice(0, 10).map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`text-sm tracking-wider uppercase transition-all duration-300 relative py-2 ${
                  activeCategory === category.id
                    ? 'text-[#b89153] font-medium'
                    : 'text-[#1E1C1A]/80 hover:text-[#b89153]'
                }`}
              >
                {category.name}
                {activeCategory === category.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#b89153] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Search, Wishlist, Cart, User Auth */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Elegant Search bar on Desktop */}
            <div className="hidden lg:relative lg:block">
              <input
                type="text"
                placeholder="Search premium jewellery..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-48 xl:w-64 bg-[#F2ECDF]/60 focus:bg-white text-xs text-[#1E1C1A] placeholder-[#1E1C1A]/40 pl-9 pr-3 py-2 rounded-full border border-[#D4C19D]/20 focus:border-[#b89153] focus:outline-none transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#1E1C1A]/50" />
            </div>

            {/* Compact Search Trigger for Tablets/Mobile */}
            <button
              onClick={() => {
                const query = prompt('Enter item name to search:') || '';
                onSearchChange(query);
              }}
              className="lg:hidden text-[#1E1C1A] hover:text-[#b89153] transition-colors p-1"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Icon with count */}
            <button
              onClick={onOpenWishlist}
              className="text-[#1E1C1A] hover:text-[#b89153] transition-colors relative p-1.5"
              id="wishlist-btn"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b89153] text-[#FAF6F0] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon with count */}
            <button
              onClick={onOpenCart}
              className="text-[#1E1C1A] hover:text-[#b89153] transition-colors relative p-1.5"
              id="cart-btn"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1E1C1A] text-[#FAF6F0] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown wrapper */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="text-[#1E1C1A] hover:text-[#b89153] transition-colors flex items-center gap-1 p-1.5 focus:outline-none"
                id="user-menu-btn"
              >
                <User className="h-5 w-5" />
                {currentUser && (
                  <span className="hidden md:inline text-xs font-medium max-w-[80px] truncate">
                    {currentUser.name}
                  </span>
                )}
              </button>

              {showUserDropdown && (
                <div 
                  className="absolute right-0 mt-3 w-56 bg-white border border-[#D4C19D]/10 rounded-2xl shadow-xl overflow-hidden py-1 z-50 animate-fade-up"
                  style={{ animationDuration: '0.2s' }}
                >
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 bg-[#FAF6F0] border-b border-[#D4C19D]/10">
                        <p className="text-xs text-gray-500">Logged in as</p>
                        <p className="text-sm font-semibold text-[#1E1C1A] truncate">{currentUser.name}</p>
                        {currentUser.isAdmin && (
                          <span className="mt-1 inline-block bg-yellow-100 text-yellow-800 text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded">
                            Store Owner / Admin
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          onOpenOrderTracker();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1E1C1A] hover:bg-[#FAF6F0] hover:text-[#b89153] transition-colors flex items-center justify-between"
                      >
                        <span>My Orders & Live Tracking</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                      {currentUser.isAdmin && (
                        <button
                          onClick={() => {
                            onOpenAdmin();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-[#1E1C1A] hover:bg-[#FAF6F0] hover:text-amber-700 font-medium transition-colors flex items-center justify-between"
                        >
                          <span className="flex items-center gap-1.5">
                            <Settings className="h-3.5 w-3.5 text-amber-600" />
                            Admin Console
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 border-t border-[#D4C19D]/10"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 bg-[#FAF6F0] border-b border-[#D4C19D]/10">
                        <p className="text-xs text-[#1E1C1A]/60">Welcome to Akanksha Jewellery</p>
                      </div>
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1E1C1A] hover:bg-[#FAF6F0] hover:text-[#b89153] transition-colors font-medium"
                      >
                        Secure Login / Sign Up
                      </button>
                      <button
                        onClick={() => {
                          onOpenOrderTracker();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1E1C1A] hover:bg-[#FAF6F0] hover:text-[#b89153] transition-colors"
                      >
                        Anonymous Guest Order Tracking
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6F0] border-b border-[#D4C19D]/20 animate-fade-up">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
            {/* Mobile Search */}
            <div className="px-3 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jewellery..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-[#F2ECDF]/60 focus:bg-white text-xs text-[#1E1C1A] pl-9 pr-3 py-2.5 rounded-full border border-[#D4C19D]/20 focus:outline-none focus:border-[#b89153]"
                />
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-[#1E1C1A]/50" />
              </div>
            </div>

            {fullCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left block px-4 py-2.5 rounded-xl text-sm tracking-wider uppercase transition-colors ${
                  activeCategory === category.id
                    ? 'bg-[#b89153]/10 text-[#b89153] font-medium'
                    : 'text-[#1E1C1A]/80 hover:bg-[#FAF6F0]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
