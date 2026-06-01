import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Ticket, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  onRemoveItem: (productId: string, color?: string, size?: string) => void;
  onStartCheckout: (discountPercentage: number, promoApplied: string) => void;
  deliveryCharge?: number;
  deliveryThreshold?: number;
}

export default function CartDrawer({
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onStartCheckout,
  deliveryCharge = 60,
  deliveryThreshold = 499,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [promoApplied, setPromoApplied] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'AKANKSHA10') {
      setDiscountPercent(10);
      setPromoApplied('AKANKSHA10 (10% OFF)');
      setCouponCode('');
    } else if (code === 'TENNISTODAY') {
      setDiscountPercent(15);
      setPromoApplied('TENNISTODAY (15% OFF TENNIS SPECIAL)');
      setCouponCode('');
    } else if (code === 'WELCOME50') {
      // flat ₹50? Let's just make it a 5% off
      setDiscountPercent(5);
      setPromoApplied('WELCOME50 (5% OFF)');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try "AKANKSHA10" or "TENNISTODAY"!');
    }
  };

  const clearCoupon = () => {
    setDiscountPercent(0);
    setPromoApplied('');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const deliveryCharges = subtotal > deliveryThreshold || subtotal === 0 ? 0 : deliveryCharge; // Free delivery over threshold
  const total = subtotal - discountAmount + deliveryCharges;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-fade-up" style={{ animationDuration: '0.2s' }}>
      <div 
        className="w-full max-w-md bg-[#FAF6F0] h-full shadow-2xl flex flex-col justify-between"
        id="cart-drawer-container"
      >
        {/* Cart Header */}
        <div className="px-6 py-5 bg-white border-b border-[#D4C19D]/20 flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-[#1E1C1A]">
              Shopping Bag
            </h2>
            <span className="text-xs text-gray-500 font-light">({cartItems.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#1E1C1A] hover:text-[#b89153] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart items listing */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-64 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#1E1C1A]/5 flex items-center justify-center text-gray-400">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-serif text-[#1E1C1A] font-semibold text-base">Your shopping bag is empty</p>
                <p className="text-xs text-gray-500 mt-1 max-w-[240px] mx-auto">
                  Explore our luxury collection of tennis bracelets and chains to find your sparkle!
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#b89153] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                className="p-3 bg-white border border-[#D4C19D]/15 rounded-2xl flex gap-3.5 items-center justify-between"
              >
                {/* Product thumbnail */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF6F0] flex-shrink-0 border border-[#D4C19D]/10">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-[#1E1C1A] truncate">{item.product.name}</h3>
                    <p className="text-[10px] text-gray-500 capitalize italic mt-0.5 font-light">
                      {item.selectedColor || 'Gold'} / {item.selectedSize || 'Standard'}
                    </p>
                    
                    {/* Item single/multi pricing */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#b89153]">₹{item.product.price}</span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-gray-400 font-light">
                          (₹{(item.product.price * item.quantity).toLocaleString('en-IN')} total)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Adjustments & deletion */}
                <div className="flex flex-col items-end justify-between gap-2">
                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                    className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center border border-[#D4C19D]/20 rounded-lg bg-[#FAF6F0] transform scale-90">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.selectedColor, item.selectedSize)}
                      className="px-2 py-1 text-xs hover:text-[#b89153]"
                    >
                      -
                    </button>
                    <span className="px-1 text-xs font-bold text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                      className="px-2 py-1 text-xs hover:text-[#b89153]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pricing calculations footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-[#D4C19D]/20 space-y-4">
            {/* Promo Codes Application form */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Apply Coupon (e.g., AKANKSHA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-[#b89153] uppercase"
                  />
                  <Ticket className="absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E1C1A] hover:bg-[#b89153] text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{couponError}</span>
                </p>
              )}
              {promoApplied && (
                <div className="p-1 px-2 bg-yellow-50 text-yellow-800 text-[10px] rounded-lg border border-yellow-105 flex items-center justify-between">
                  <span>Promo Activated: <strong>{promoApplied}</strong></span>
                  <button type="button" onClick={clearCoupon} className="text-[#1E1C1A] underline font-bold uppercase text-[9px]">Remove</button>
                </div>
              )}
            </form>

            {/* Calculations breakdown */}
            <div className="space-y-2 border-t border-[#D4C19D]/10 pt-3">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-medium">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-gray-500">
                <span>Standard Delivery</span>
                <span>{deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}</span>
              </div>
              
              {subtotal > 0 && subtotal <= deliveryThreshold && (
                <p className="text-[10px] text-[#b89153] tracking-wide text-right italic font-light mt-0.5">
                  Add just ₹{(deliveryThreshold + 1 - subtotal).toLocaleString('en-IN')} more to unlock FREE courier delivery!
                </p>
              )}

              <div className="flex justify-between text-sm text-[#1E1C1A] font-bold border-t border-[#D4C19D]/10 pt-2">
                <span>Total Amount</span>
                <span className="text-[#b89153]">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Secure payment shield */}
            <div className="flex items-center gap-1.5 justify-center py-1 text-[10px] text-gray-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Secure 256-Bit SSL Checkout Gateways</span>
            </div>

            {/* Proceed Action */}
            <button
              onClick={() => onStartCheckout(discountPercent, promoApplied)}
              className="w-full py-3.5 bg-[#1E1C1A] hover:bg-[#b89153] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#1E1C1A]/10 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
