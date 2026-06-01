import React, { useState } from 'react';
import { X, Heart, Star, Sparkles, Shield, Droplets, ShoppingBag, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailDrawerProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color: 'gold' | 'silver', size: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  allProducts: Product[];
  onSelectRelated: (product: Product) => void;
}

export default function ProductDetailDrawer({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  allProducts,
  onSelectRelated,
}: ProductDetailDrawerProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<'gold' | 'silver'>('gold');
  const [selectedSize, setSelectedSize] = useState('Standard Size');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Retrieve related items in same item category
  const related = allProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-end animate-fade-up" style={{ animationDuration: '0.3s' }}>
      <div className="w-full max-w-2xl bg-[#FAF6F0] h-full shadow-2xl overflow-y-auto flex flex-col">
        {/* Detail Header */}
        <div className="sticky top-0 z-20 bg-[#FAF6F0] px-6 py-4 border-b border-[#D4C19D]/20 flex justify-between items-center">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#b89153] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Accessories by Akanksha Premium
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#1E1C1A] hover:text-[#b89153] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 flex-1 space-y-8">
          {/* Main Visuals & Details layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left side multiple images */}
            <div className="space-y-3">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-[#D4C19D]/10">
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Optional thumbnails selection */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIdx === i ? 'border-[#b89153] scale-95' : 'border-[#D4C19D]/15 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side options */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] tracking-widest uppercase bg-[#1E1C1A]/5 text-gray-500 px-2.5 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  {product.isTennisJewellery && (
                    <span className="text-[10px] tracking-widest uppercase bg-[#b89153]/10 text-[#b89153] px-2.5 py-0.5 rounded-full font-semibold">
                      Tennis Star
                    </span>
                  )}
                  {product.isWaterproof !== false && (
                    <span className="text-[10px] tracking-widest uppercase bg-[#b89153]/5 text-[#b89153] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      Waterproof
                    </span>
                  )}
                  {product.isAntiTarnish !== false && (
                    <span className="text-[10px] tracking-widest uppercase bg-[#b89153]/5 text-[#b89153] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Anti-Tarnish
                    </span>
                  )}
                  {product.badge && !product.isTennisJewellery && (
                    <span className="text-[10px] tracking-widest uppercase bg-[#1E1C1A] text-[#FAF6F0] px-2.5 py-0.5 rounded-full font-medium">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-lg md:text-xl font-bold tracking-normal text-[#1E1C1A] leading-tight">
                  {product.name}
                </h2>
                
                {/* Rating */}
                <div className="flex items-center gap-1 text-[#b89153] pt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3 w-3 ${s <= Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {product.rating} ({product.reviewsCount} customer reviews)
                  </span>
                </div>
              </div>

              {/* Price Tag */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-bold text-xl text-[#b89153]">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>

              {/* Metal Coloring Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold tracking-wider text-gray-700 uppercase">
                  Select Coating Material:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedColor('gold')}
                    className={`flex-1 py-2 text-xs border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedColor === 'gold'
                        ? 'border-[#b89153] bg-[#b89153]/5 font-semibold text-[#b89153]'
                        : 'border-[#D4C19D]/20 hover:border-gray-400 text-gray-600 bg-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5C158]" />
                    <span>18K Gold Plated</span>
                  </button>
                  <button
                    onClick={() => setSelectedColor('silver')}
                    className={`flex-1 py-2 text-xs border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedColor === 'silver'
                        ? 'border-slate-500 bg-slate-500/5 font-semibold text-slate-700'
                        : 'border-[#D4C19D]/20 hover:border-gray-400 text-gray-600 bg-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span>Rhodium Silver</span>
                  </button>
                </div>
              </div>

              {/* Sizes section with manual guide */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-gray-700 uppercase">
                  <span>Size Option:</span>
                  <span className="text-[#b89153] lowercase font-light italic">anti-tarnish design</span>
                </div>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#b89153] cursor-pointer"
                >
                  <option value="Standard Size">Standard Adjustable (Adjusts 15-20cm)</option>
                  <option value="Sleek Small">Sleek Small (16cm)</option>
                  <option value="Classic Medium">Classic Medium (18cm)</option>
                  <option value="Bold Large">Bold Large (20cm)</option>
                </select>
                {product.sizeGuide && (
                  <p className="text-[10px] text-gray-500 italic mt-0.5">{product.sizeGuide}</p>
                )}
              </div>

              {/* Inventory Alert banner */}
              <div className="text-[11px] flex items-center gap-1 px-3 py-2 bg-[#FAF6F0] rounded-xl border border-[#D4C19D]/15">
                <div className={`w-1.5 h-1.5 rounded-full ${product.stockCount > 5 ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
                <span className="text-gray-600">
                  {product.stockCount > 5
                    ? `In Stock - ${product.stockCount} items ready to dispatch`
                    : `Selling fast! Only ${product.stockCount} pieces remaining`}
                </span>
              </div>

              {/* Add to Cart Actions */}
              <div className="flex gap-2 pt-2">
                <div className="flex items-center border border-[#D4C19D]/20 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs hover:text-[#b89153]"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-semibold text-gray-700">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-xs hover:text-[#b89153]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-[#1E1C1A] hover:bg-[#b89153] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add To Bag</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-[#D4C19D]/20 text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {addedNotice && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center justify-center gap-1.5 border border-emerald-100 animate-fade-up">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Successfully added to your shopping cart!</span>
                </div>
              )}
            </div>
          </div>

          {/* Description & Premium details */}
          <div className="space-y-4 pt-3 border-t border-[#D4C19D]/15">
            <h4 className="font-serif text-[#1E1C1A] text-sm font-semibold uppercase tracking-wider">
              Product Overview & Materials
            </h4>
            <div className="text-xs text-gray-600 leading-relaxed space-y-2">
              <p>{product.description}</p>
              <div className="bg-white/50 border border-[#D4C19D]/10 rounded-2xl p-4 grid grid-cols-2 gap-3 mt-4">
                <div>
                  <p className="font-semibold text-gray-700 uppercase text-[9px] tracking-wide">Base Metal</p>
                  <p className="text-[11px] font-light text-gray-600">Pure Grade Anti-Tarnish Stainless/Brass Plating</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 uppercase text-[9px] tracking-wide">Crystals Type</p>
                  <p className="text-[11px] font-light text-gray-600">Selected Premium AAA+ Cubic Zirconia</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 uppercase text-[9px] tracking-wide">Waterproof Coating</p>
                  <p className="text-[11px] font-light text-gray-600">
                    {product.isWaterproof !== false ? 'Yes, IP68 Sweat-Proof Shielded' : 'Water-resistant, keep away from persistent liquids'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 uppercase text-[9px] tracking-wide">Plating Quality</p>
                  <p className="text-[11px] font-light text-gray-600">
                    {product.isAntiTarnish !== false ? 'Physical Vapor Deposition (PVD) Premium Barrier' : 'Standard Polished Finish'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Care Instructions Guide */}
          <div className="p-4 bg-[#b89153]/5 rounded-2xl border border-[#b89153]/15 space-y-2">
            <h5 className="text-[#b89153] text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Signature Anti-Tarnish Lifetime Promise
            </h5>
            <p className="text-[11px] text-gray-600 leading-relaxed font-light">
              Every item is layered with an exclusive protective PVD barrier coat, offering defense against ocean water, soaps, perfumes, and perspiration. Store in your satin pouch when not in use.
            </p>
          </div>

          {/* Related products inline stack */}
          {related.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#D4C19D]/15">
              <h4 className="font-serif text-[#1E1C1A] text-sm font-semibold uppercase tracking-wider">
                Complementary Pieces
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {related.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectRelated(item);
                      setActiveImageIdx(0);
                    }}
                    className="bg-white/80 border border-[#D4C19D]/10 rounded-xl p-2 cursor-pointer hover:border-[#b89153]/40 group/item transition-colors"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-1.5">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" referrerPolicy="no-referrer" />
                    </div>
                    <p className="text-[11px] font-medium text-gray-800 truncate line-clamp-1 group-hover/item:text-[#b89153]">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-bold text-[#b89153]">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
