import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  wishlistItems: Product[];
  onClose: () => void;
  onRemoveItem: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export default function WishlistDrawer({
  wishlistItems,
  onClose,
  onRemoveItem,
  onMoveToCart,
}: WishlistDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-fade-up" style={{ animationDuration: '0.2s' }}>
      <div className="w-full max-w-sm bg-[#FAF6F0] h-full shadow-2xl flex flex-col justify-between">
        {/* Wishlist Header */}
        <div className="px-5 py-4 bg-white border-b border-[#D4C19D]/20 flex justify-between items-center">
          <div className="flex items-baseline gap-1.5">
            <Heart className="h-4 w-4 text-[#b89153] fill-current" />
            <h2 className="font-serif text-base font-bold uppercase tracking-wider text-[#1E1C1A]">
              My Wishlist
            </h2>
            <span className="text-xs text-gray-500 font-light">({wishlistItems.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#1E1C1A] hover:text-[#b89153] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wishlisted items list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-64 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#1E1C1A]/5 flex items-center justify-center text-gray-300">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-[#1E1C1A] font-semibold text-sm">Wishlist is pristine</p>
                <p className="text-[11px] text-gray-500 mt-1 max-w-[200px] mx-auto">
                  Click the heart icon on any jewelry item to store them here.
                </p>
              </div>
            </div>
          ) : (
            wishlistItems.map((product) => (
              <div
                key={product.id}
                className="p-3 bg-white border border-[#D4C19D]/15 rounded-xl flex gap-3 items-center justify-between group"
              >
                {/* Product details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#FAF6F0] flex-shrink-0 border">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-[#1E1C1A] truncate max-w-[150px]">{product.name}</h4>
                    <span className="text-xs font-bold text-[#b89153]">₹{product.price}</span>
                  </div>
                </div>

                {/* Quick transfer action and Delete */}
                <div className="flex gap-1.5 items-center">
                  <button
                    onClick={() => onMoveToCart(product)}
                    className="p-1.5 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                    title="Move to Shopping Bag"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold">Bag</span>
                  </button>

                  <button
                    onClick={() => onRemoveItem(product)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Wishlist footer info */}
        {wishlistItems.length > 0 && (
          <div className="p-4 bg-white border-t border-[#D4C19D]/10 text-center text-[10px] text-gray-400">
            <span>Items saved in Wishlist do not lock inventory. Checkout soon!</span>
          </div>
        )}
      </div>
    </div>
  );
}
