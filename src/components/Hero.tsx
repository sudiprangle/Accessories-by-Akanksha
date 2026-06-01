import React from 'react';
import { ArrowRight, Sparkles, Shield, Droplets, Compass } from 'lucide-react';

interface HeroProps {
  onShopCollection: () => void;
  onExploreTennis: () => void;
}

export default function Hero({ onShopCollection, onExploreTennis }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#D4C19D]/10">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#EEDAD2]/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-[#b89153]/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b89153]/10 text-[#b89153] text-[9px] sm:text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Accessories by Akanksha</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-[#1E1C1A]">
                The Elite <br />
                <span className="italic font-light text-[#b89153]">Tennis Jewellery</span> <br />
                Unveiled.
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-lg font-light leading-relaxed">
                Premium anti-tarnish and waterproof treasures designed for the contemporary woman. Inspired by athletic grace, radiating opulent brilliance with every swing.
              </p>
            </div>

            {/* Certifications row */}
            <div className="grid grid-cols-3 gap-4 border-y border-[#D4C19D]/20 py-5 max-w-md">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                <div className="h-7 w-7 rounded-full bg-[#1E1C1A]/5 flex items-center justify-center text-[#b89153]">
                  <Droplets className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#1E1C1A] uppercase mt-1">Waterproof</span>
                <span className="text-[9px] text-gray-500">Won't fade on contact</span>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                <div className="h-7 w-7 rounded-full bg-[#1E1C1A]/5 flex items-center justify-center text-[#b89153]">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#1E1C1A] uppercase mt-1">Anti-Tarnish</span>
                <span className="text-[9px] text-gray-500">Lifetime gold luster</span>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                <div className="h-7 w-7 rounded-full bg-[#1E1C1A]/5 flex items-center justify-center text-[#b89153]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#1E1C1A] uppercase mt-1">Hypoallergenic</span>
                <span className="text-[9px] text-gray-500">Kind to sensitive skin</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onExploreTennis}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1E1C1A] hover:bg-[#b89153] text-white text-xs font-semibold tracking-wider rounded-full uppercase transition-all duration-300 shadow-lg shadow-[#1E1C1A]/10 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Shop Tennis Core</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button
                onClick={onShopCollection}
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#1E1C1A] text-[#1E1C1A] hover:bg-[#1E1C1A] hover:text-[#FAF6F0] text-xs font-semibold tracking-wider rounded-full uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Full Collection</span>
              </button>
            </div>
          </div>

          {/* Luxury Imagery Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[340px] sm:max-w-md lg:max-w-full">
              {/* Main Image Frame with Gold Border */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] transform hover:-rotate-1 transition-transform duration-500">
                <img
                  src="https://arakshe22extc-byte.github.io/acessriesbyakanksha1/pink%20square%20diamond%20280%20chain%20-3.jpg"
                  alt="Premium pink square diamond necklace"
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C1A]/40 via-transparent to-transparent" />
                
                {/* Embedded Floating product badge label */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#FAF6F0]/90 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/40 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] tracking-wider uppercase text-[#b89153] font-semibold">Pink Square Diamond</p>
                    <p className="font-serif text-sm text-[#1E1C1A] font-bold">Premium Core Chain</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 line-through">₹499</p>
                    <p className="text-sm text-[#1E1C1A] font-bold ml-1">₹280</p>
                  </div>
                </div>
              </div>

              {/* Backing Accent Panel */}
              <div className="absolute -top-6 -right-6 w-1/2 h-1/2 rounded-3xl bg-[#EEDAD2]/40 -z-10 blur-xl" />
              {/* Secondary overlap thumbnail */}
              <div className="absolute -bottom-8 -left-8 w-1/3 aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-xl hidden sm:block">
                <img
                  src="https://arakshe22extc-byte.github.io/acessriesbyakanksha1/v%20ring%20golden%20-%201%20price%20180.jpg"
                  alt="Golden V-Ring"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
