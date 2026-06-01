import React, { useState } from 'react';
import { Search, MapPin, Truck, Check, HelpCircle, ArrowRight, ShieldAlert, FileText, ChevronRight, X } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerProps {
  orders: Order[];
  onClose: () => void;
  onTrackImmediateId?: string;
}

export default function OrderTracker({
  orders,
  onClose,
  onTrackImmediateId = '',
}: OrderTrackerProps) {
  const [searchTrackId, setSearchTrackId] = useState(onTrackImmediateId || '');
  const [activeTrackOrder, setActiveTrackOrder] = useState<Order | null>(
    orders.find((o) => o.id === onTrackImmediateId || o.trackingNumber === onTrackImmediateId) || 
    (orders.length > 0 ? orders[0] : null)
  );
  const [errorSearch, setErrorSearch] = useState('');

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSearch('');
    const id = searchTrackId.trim().toUpperCase();

    if (!id) return;

    // Search anywhere inside ID, Tracking, or Email
    const matched = orders.find(
      (o) => o.id.toUpperCase() === id || o.trackingNumber.toUpperCase() === id || o.customerEmail.toUpperCase() === id
    );

    if (matched) {
      setActiveTrackOrder(matched);
    } else {
      setErrorSearch('No matching order or tracking number located. Try "AK-XXXXXX" !');
    }
  };

  const getStatusIndex = (status: Order['shippingStatus']) => {
    switch (status) {
      case 'Processing': return 1;
      case 'Dispatched': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const activeStepIdx = activeTrackOrder ? getStatusIndex(activeTrackOrder.shippingStatus) : 1;

  // Timeline statuses
  const steps = [
    { idx: 1, title: 'Received & Signature Quality Sealing', desc: 'Awaiting premium anti-tarnish final coat polish', time: 'Day 1' },
    { idx: 2, title: 'Dispatched via Express Blue Dart', desc: 'Secured inside velvet jewelry housing box', time: 'Day 2' },
    { idx: 3, title: 'In Transit Local City Hub', desc: 'Sort scan complete, loading delivery van', time: 'Day 3' },
    { idx: 4, title: 'Safely Delivered & Unboxed', desc: 'Enjoy your lifetime shine Akanksha accessory', time: 'Day 4' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-[#FAF6F0] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-12 gap-0 animate-fade-up md:h-[85vh] max-h-[95vh] md:max-h-none">
        {/* Tracker Header Bar */}
        <div className="col-span-12 bg-[#1E1C1A] text-white px-5 sm:px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#b89153]" />
            <span className="font-serif tracking-widest text-xs sm:text-sm uppercase">Live Courier Transit tracker</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-1.5 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Left column: search and previous orders list */}
        <div className="md:col-span-4 bg-white p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[#D4C19D]/15 flex flex-col gap-4 md:justify-between md:h-[calc(85vh-56px)] overflow-y-auto max-h-[35vh] md:max-h-none shrink-0 text-left">
          <div className="space-y-4">
            {/* Search Input bar */}
            <form onSubmit={handleTrackSearch} className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Query order details</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Order ID or Track #"
                  value={searchTrackId}
                  onChange={(e) => setSearchTrackId(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl pl-3 pr-10 py-2.5 text-xs text-gray-700 font-semibold focus:outline-none focus:border-[#b89153]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-[#1E1C1A] hover:bg-[#b89153] text-white transition-colors cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
              {errorSearch && (
                <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1">
                  <ShieldAlert className="h-3 w-3" />
                  <span>{errorSearch}</span>
                </p>
              )}
            </form>

            {/* List of orders if available */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block border-b border-[#D4C19D]/10 pb-1">Your Past Transactions</span>
              {orders.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic font-light">No order histories logged inside this browser session.</p>
              ) : (
                <div className="space-y-1.5 max-h-[120px] md:max-h-[220px] overflow-y-auto pr-1">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => {
                        setActiveTrackOrder(o);
                        setErrorSearch('');
                      }}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        activeTrackOrder?.id === o.id
                          ? 'border-[#b89153] bg-[#b89153]/5'
                          : 'border-[#D4C19D]/15 hover:border-gray-400 bg-[#FAF6F0]/40'
                      }`}
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="font-mono text-xs font-bold text-gray-800">{o.id}</span>
                        <span className="text-[9px] text-[#b89153] font-semibold uppercase">{o.shippingStatus}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 flex justify-between">
                        <span>{o.date}</span>
                        <span>₹{o.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick assistance guide */}
          <div className="p-3 bg-yellow-50/50 rounded-xl border border-yellow-200/50 flex gap-2 text-[10px] text-gray-600 leading-normal font-light">
            <HelpCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Need shipment assistance?</p>
              <p className="mt-0.5 text-[9px]">WhatsApp screenshot references: +91 93245 XXXXX</p>
            </div>
          </div>
        </div>

        {/* Right column: timeline graphic and courier route simulator */}
        <div className="md:col-span-8 p-4 sm:p-6 md:p-8 overflow-y-auto md:h-[calc(85vh-56px)] space-y-5 flex-1 bg-[#FAF6F0]">
          {activeTrackOrder ? (
            <div className="space-y-5">
              {/* Header card summary details */}
              <div className="p-4 bg-white border border-[#D4C19D]/15 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 text-left">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Dispatch Target</p>
                  <h4 className="font-serif text-gray-800 font-bold text-sm sm:text-base mt-0.5">
                    Order {activeTrackOrder.id} ({activeTrackOrder.customerName})
                  </h4>
                  <p className="text-xs text-gray-500 font-light mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#b89153] flex-shrink-0" />
                    <span>Deliver to: {activeTrackOrder.shippingAddress.address}, {activeTrackOrder.shippingAddress.city}, PIN {activeTrackOrder.shippingAddress.pincode}</span>
                  </p>
                </div>
                
                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-[#D4C19D]/10 pt-3 sm:pt-0 sm:pl-4 flex-shrink-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipment Tracking Code</p>
                  <p className="font-mono text-xs font-bold text-[#b89153] mt-0.5">{activeTrackOrder.trackingNumber}</p>
                  <span className="mt-1.5 inline-block text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-100">
                    {activeTrackOrder.paymentStatus === 'Paid' ? 'Prepaid Transaction' : 'Cash on Delivery (COD)'}
                  </span>
                </div>
              </div>

              {/* Transit milestones timeline graphic vertical */}
              <div className="relative pl-6 space-y-5">
                {/* Connecting track line */}
                <div className="absolute left-2.5 top-0 bottom-4 w-[1.5px] bg-[#D4C19D]/20" />

                {steps.map((st) => {
                  const isCompleted = activeStepIdx >= st.idx;
                  const isCurrent = activeStepIdx === st.idx;

                  return (
                    <div key={st.idx} className="relative flex gap-4 items-start text-left">
                      {/* Check dot marker */}
                      <div className={`absolute -left-6 h-5.5 w-5.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isCompleted
                          ? 'bg-[#b89153] border-[#b89153] text-[#FAF6F0]'
                          : 'bg-[#FAF6F0] border-[#D4C19D]/45 text-gray-400'
                      }`}>
                        {isCompleted ? <Check className="h-3 w-3" /> : <span className="text-[9px] font-bold">{st.idx}</span>}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <h5 className={`text-xs uppercase font-bold tracking-wide ${isCurrent ? 'text-[#b89153]' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                            {st.title} {isCurrent && <span className="animate-pulse lowercase italic font-normal text-amber-600 font-sans tracking-tight">(active phase)</span>}
                          </h5>
                          <span className="text-[10px] font-mono text-gray-400 font-medium">{st.time}</span>
                        </div>
                        <p className={`text-[11px] font-light mt-0.5 ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Courier Simulated map tracker graphic */}
              <div className="relative h-32 sm:h-40 rounded-2xl overflow-hidden bg-slate-100 border border-[#D4C19D]/15 flex items-center justify-center p-4">
                {/* Visual map outline sketch */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                {/* Background highway shapes */}
                <svg className="absolute inset-0 w-full h-full text-slate-300 opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20 20 Q 150 120 300 40 T 600 150" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="5,5" />
                  <path d="M 50 150 L 550 50" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>

                {/* Tracking nodes */}
                <div className="absolute left-[10%] top-[25%] flex flex-col items-center">
                  <div className="h-4 w-4 bg-[#1E1C1A] text-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-[8px] font-bold">A</span>
                  </div>
                  <span className="text-[8px] text-[#1E1C1A] font-medium bg-white px-1.5 py-0.5 rounded shadow-xs mt-1">Origin Hub</span>
                </div>

                <div className="absolute right-[10%] bottom-[20%] flex flex-col items-center">
                  <div className="h-4 w-4 bg-[#b89153] text-[#FAF6F0] rounded-full flex items-center justify-center animate-bounce shadow-md">
                    <MapPin className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-[8px] text-gray-800 font-bold bg-white px-1.5 py-0.5 rounded shadow-xs mt-1">Delivery Destination</span>
                </div>

                {/* Animated shipping van moving */}
                <div 
                  className="absolute flex flex-col items-center transition-all duration-[6s] ease-in-out"
                  style={{
                    left: `${15 + (activeStepIdx - 1) * 20}%`,
                    top: `${40 + (activeStepIdx % 2) * 15}%`,
                  }}
                >
                  <div className="p-1.5 bg-[#b89153] text-white rounded-full shadow-lg relative animate-pulse">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#b89153] bg-white border border-[#D4C19D]/15 px-1.5 py-0.5 rounded-full mt-1 shrink-0">
                    In Transit
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 bg-[#1E1C1A]/85 text-white text-[8px] px-2 py-1 rounded flex items-center gap-1 backdrop-blur-xs">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>Telemetry Live</span>
                </div>
              </div>

              {/* Items in active tracked order overview listed */}
              <div className="space-y-2 pt-2 text-left">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Products Included</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTrackOrder.items.map((it, idx) => (
                    <div key={`${it.productId}-${idx}`} className="flex gap-2.5 items-center p-2 bg-white border border-[#D4C19D]/10 rounded-xl">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border bg-[#FAF6F0] shrink-0">
                        <img src={it.image} alt={it.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{it.productName}</p>
                        <p className="text-[9px] text-gray-500">Qty: {it.quantity} | {it.color || 'Gold'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-64 space-y-3 bg-[#FAF6F0]">
              <div className="h-12 w-12 rounded-full bg-[#1E1C1A]/5 flex items-center justify-center text-gray-300">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-[#1E1C1A] font-semibold text-sm">Select or Enter an Order</p>
                <p className="text-[11px] text-gray-400 max-w-xs mt-1 mx-auto leading-relaxed font-light">
                  Provide an Order reference, shipping address email, or dispatch number on the left panel to display deep delivery progression.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
