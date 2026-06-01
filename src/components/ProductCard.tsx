import React from 'react';
import { Heart, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
}: ProductCardProps) {
  // Format prices with INR symbol
  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;
  const formattedOriginalPrice = product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : null;

  return (
    <div className="group relative bg-[#FAF6F0] rounded-2xl overflow-hidden border border-[#D4C19D]/15 hover:border-[#b89153]/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      {/* Product Image Frame */}
      <div className="relative aspect-square overflow-hidden bg-white/70 cursor-pointer" onClick={() => onSelectProduct(product)}>
        {/* Soft Hover Overlay zoom */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-[#b89153] text-[#FAF6F0] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Anti-Tarnish
          </span>
          {product.isNew && (
            <span className="bg-[#FAF6F0] text-[#1E1C1A] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#D4C19D]/30 shadow-xs">
              NEW
            </span>
          )}
        </div>

        {/* Favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full border shadow-sm backdrop-blur-md transition-all duration-350 cursor-pointer z-10 ${
            isWishlisted
              ? 'bg-[#1E1C1A] border-[#1E1C1A] text-[#EEDAD2]'
              : 'bg-white/80 border-[#D4C19D]/10 text-gray-700 hover:bg-white hover:text-red-500'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick look backdrop hint */}
        <div className="absolute inset-0 bg-[#1E1C1A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-[#FAF6F0] text-[#1E1C1A] text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded-full shadow-lg border border-[#D4C19D]/20">
            View Details
          </span>
        </div>
      </div>

      {/* product descriptions & specs */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div className="space-y-1">
          {/* Metadata category */}
          <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest">
            <span>{product.category}</span>
            {/* Rating */}
            <div className="flex items-center gap-0.5 text-[#b89153]">
              <Star className="h-3 w-3 fill-current" />
              <span className="font-medium text-gray-700">{product.rating}</span>
            </div>
          </div>

          {/* Product name */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-serif text-[#1E1C1A] text-sm sm:text-base font-semibold tracking-wide hover:text-[#b89153] cursor-pointer transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

        </div>

        {/* Pricing tag & CTA Button wrapper */}
        <div className="mt-4 pt-3 border-t border-[#D4C19D]/10 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm sm:text-base text-[#1E1C1A]">{formattedPrice}</span>
            {formattedOriginalPrice && (
              <span className="text-[11px] sm:text-xs text-gray-400 line-through font-light">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="p-2 sm:px-4 sm:py-2.5 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] rounded-full sm:rounded-full text-xs font-semibold tracking-wider transition-colors duration-300 flex items-center gap-1.5 group/btn cursor-pointer"
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline uppercase text-[10px]">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
