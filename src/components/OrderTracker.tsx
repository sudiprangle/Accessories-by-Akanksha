import React, { useState } from 'react';
import { Search, MapPin, Truck, Check, HelpCircle, ShieldAlert, FileText, X, AlertCircle, XCircle } from 'lucide-react';
import { Order, User } from '../types';

interface OrderTrackerProps {
  orders: Order[];
  onClose: () => void;
  onTrackImmediateId?: string;
  onCancelOrder?: (orderId: string, reason: string) => void;
  currentUser?: User | null;
}

export default function OrderTracker({
  orders,
  onClose,
  onTrackImmediateId = '',
  onCancelOrder,
  currentUser,
}: OrderTrackerProps) {
  const [searchTrackId, setSearchTrackId] = useState(onTrackImmediateId || '');
  const [verificationInput, setVerificationInput] = useState('');
  const [errorSearch, setErrorSearch] = useState('');

  // Cancellation State
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReasonOption, setCancelReasonOption] = useState('Changed my mind');
  const [customComment, setCustomComment] = useState('');

  // 1. FILTERING: User can only see/track their own orders
  const allowedOrders = orders.filter((o) => {
    // Admins can see all orders
    if (currentUser?.isAdmin) return true;

    if (currentUser) {
      // Clean registered user details
      const userEmail = currentUser.email?.trim().toLowerCase();
      const userMobile = currentUser.mobile?.trim().replace(/\D/g, '');

      // Clean order details
      const orderEmail = o.customerEmail?.trim().toLowerCase();
      const orderPhone = o.shippingAddress?.phone?.trim().replace(/\D/g, '');
      const orderUserId = o.customerUserId?.trim().toLowerCase();

      const idMatch = orderUserId && (
        (userEmail && orderUserId === userEmail) ||
        (userMobile && orderUserId === userMobile)
      );

      const emailMatch = userEmail && orderEmail && userEmail === orderEmail;
      const mobileMatch = userMobile && orderPhone && (userMobile === orderPhone || userMobile.includes(orderPhone) || orderPhone.includes(userMobile));

      return !!(idMatch || emailMatch || mobileMatch);
    }

    // Guests/Anonymous tracking is disabled (login is required)
    return false;
  });

  // Find initial active ID from matching allowed orders first, or fall back
  const initialMatchedOrder = orders.find(
    (o) => o.id === onTrackImmediateId || o.trackingNumber === onTrackImmediateId
  );

  const [activeTrackOrderId, setActiveTrackOrderId] = useState<string | null>(() => {
    if (initialMatchedOrder) {
      // Ensure guest or logged user has access to it, otherwise we verify first
      const hasDirectAccess = allowedOrders.some((ao) => ao.id === initialMatchedOrder.id);
      if (hasDirectAccess || currentUser?.isAdmin) {
        return initialMatchedOrder.id;
      }
    }
    
    // Otherwise fall back to first allowed order
    if (allowedOrders.length > 0) {
      return allowedOrders[0].id;
    }
    return null;
  });

  // Deriving the tracked order object dynamically ensures any status updates are tracked instantly
  const activeTrackOrder = orders.find((o) => o.id === activeTrackOrderId) || null;

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSearch('');
    const query = searchTrackId.trim().toUpperCase();

    if (!query) return;

    // Search globally in orders list
    const matched = orders.find(
      (o) => o.id.toUpperCase() === query || o.trackingNumber.toUpperCase() === query
    );

    if (!matched) {
      setErrorSearch('No matching order or tracking number located. Try "AK-XXXXXX"!');
      return;
    }

    // Ownership Verification Rules
    if (currentUser?.isAdmin) {
      // Admins bypass all authentication checks
      setActiveTrackOrderId(matched.id);
      setShowCancelForm(false);
      return;
    }

    if (currentUser) {
      // Authenticated User: Checking if order phone, email or userId matches user registry
      const userEmail = currentUser.email?.trim().toLowerCase();
      const userMobile = currentUser.mobile?.trim().replace(/\D/g, '');
      const orderEmail = matched.customerEmail?.trim().toLowerCase();
      const orderPhone = matched.shippingAddress?.phone?.trim().replace(/\D/g, '');
      const orderUserId = matched.customerUserId?.trim().toLowerCase();

      const idMatch = orderUserId && (
        (userEmail && orderUserId === userEmail) ||
        (userMobile && orderUserId === userMobile)
      );

      const emailMatch = userEmail && orderEmail && userEmail === orderEmail;
      const mobileMatch = userMobile && orderPhone && (userMobile === orderPhone || userMobile.includes(orderPhone) || orderPhone.includes(userMobile));

      if (idMatch || emailMatch || mobileMatch) {
        setActiveTrackOrderId(matched.id);
        setShowCancelForm(false);
      } else {
        setErrorSearch('Access Denied: This order does not belong to your registered user profile.');
      }
    } else {
      setErrorSearch('Access Denied: Please Log In or Sign Up first. Guest tracking is disabled.');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in" id="order-tracker-overlay">
      <div className="w-full max-w-4xl bg-[#FAF6F0] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-12 gap-0 animate-fade-up md:h-[85vh] max-h-[95vh] md:max-h-none" id="order-tracker-container">
        
        {/* Tracker Header Bar */}
        <div className="col-span-12 bg-[#1E1C1A] text-white px-5 sm:px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#b89153]" />
            <span className="font-serif tracking-widest text-xs sm:text-sm uppercase">Live Courier Transit tracker</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-1.5 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
            id="tracker-close-button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Left column: search and filtered orders list */}
        <div className="md:col-span-4 bg-white p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[#D4C19D]/15 flex flex-col gap-4 md:justify-between md:h-[calc(85vh-56px)] overflow-y-auto max-h-[40vh] md:max-h-none shrink-0 text-left">
          <div className="space-y-4">
            
            {/* Search Input bar with Security Verification */}
            <form onSubmit={handleTrackSearch} className="space-y-2">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Query order details</label>
              
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Order ID or Track #"
                  value={searchTrackId}
                  onChange={(e) => setSearchTrackId(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2.5 text-xs text-gray-700 font-semibold focus:outline-none focus:border-[#b89153]"
                />

                {/* Secure Verification text field required only for non-admins and when they aren't logged in */}
                {currentUser && (
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-[#b89153] uppercase tracking-wider block">
                      🛡️ SECURED BY ACCOUNT LOGIN
                    </p>
                    <p className="text-[9px] text-gray-400 italic">
                      Tracking queries are auto-verified under: <span className="font-semibold">{currentUser.email}</span>
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Search className="h-3 w-3" />
                  <span>Verify & Track Order</span>
                </button>
              </div>

              {errorSearch && (
                <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-[9px] text-red-500 font-medium flex items-start gap-1 leading-normal animate-fade-in">
                  <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
                  <span>{errorSearch}</span>
                </div>
              )}
            </form>

            {/* List of orders if available */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block border-b border-[#D4C19D]/10 pb-1">
                Your Past Transactions ({allowedOrders.length})
              </span>
              
              {allowedOrders.length === 0 ? (
                <div className="p-3 bg-[#FAF6F0]/40 rounded-xl border border-[#D4C19D]/15 text-center space-y-1.5">
                  <p className="text-[10px] text-gray-400 italic font-light leading-relaxed">No transactions matching your profile identified.</p>
                  <p className="text-[9px] text-[#b89153] font-medium leading-normal">
                    💡 Register or Log In with your ordering numbers, or enter any Guest Order ID and matching Phone/Email above to sync it here!
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[140px] md:max-h-[220px] overflow-y-auto pr-1">
                  {allowedOrders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setActiveTrackOrderId(o.id);
                        setErrorSearch('');
                        setShowCancelForm(false);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-colors block ${
                        activeTrackOrder?.id === o.id
                          ? 'border-[#b89153] bg-[#b89153]/5'
                          : 'border-[#D4C19D]/15 hover:border-gray-400 bg-[#FAF6F0]/40'
                      }`}
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="font-mono text-xs font-bold text-gray-800">{o.id}</span>
                        <span className={`text-[9px] font-bold uppercase ${o.shippingStatus === 'Cancelled' ? 'text-red-500' : 'text-[#b89153]'}`}>
                          {o.shippingStatus}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 flex justify-between">
                        <span>{o.date}</span>
                        <span>₹{o.total.toLocaleString('en-IN')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick assistance guide */}
          <div className="p-3 bg-yellow-50/50 rounded-xl border border-yellow-200/50 flex gap-2 text-[10px] text-gray-600 leading-normal font-light shrink-0">
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
            <div className="space-y-5 animate-fade-in">
              
              {/* Header card summary details */}
              <div className="p-4 bg-white border border-[#D4C19D]/15 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 text-left relative overflow-hidden">
                <div className="relative z-10 font-sans">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Dispatch Target</p>
                  <h4 className="font-serif text-gray-800 font-bold text-sm sm:text-base mt-1">
                    Order {activeTrackOrder.id} ({activeTrackOrder.customerName})
                  </h4>
                  <p className="text-xs text-gray-500 font-light mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#b89153] flex-shrink-0" />
                    <span>Deliver to: {activeTrackOrder.shippingAddress.address}, {activeTrackOrder.shippingAddress.city}, PIN {activeTrackOrder.shippingAddress.pincode}</span>
                  </p>
                </div>
                
                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-[#D4C19D]/10 pt-3 sm:pt-0 sm:pl-4 flex-shrink-0 relative z-10 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipment Tracking Code</p>
                    <p className="font-mono text-xs font-bold text-[#b89153] mt-0.5">{activeTrackOrder.trackingNumber}</p>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1 sm:justify-end">
                    <span className="inline-block text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-100">
                      {activeTrackOrder.paymentStatus === 'Paid' ? 'Prepaid' : 'COD'}
                    </span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                      activeTrackOrder.shippingStatus === 'Cancelled'
                        ? 'bg-rose-50 text-rose-800 border-rose-100'
                        : 'bg-amber-50 text-amber-805 border-amber-100'
                    }`}>
                      {activeTrackOrder.shippingStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* CANCEL ORDER ACTION ROW WITH INLINE MODAL FORM & CANCEL REASON */}
              {activeTrackOrder.shippingStatus === 'Processing' && onCancelOrder && (
                <div className="animate-fade-in p-4 bg-white border border-[#D4C19D]/15 rounded-2xl text-left space-y-4">
                  {!showCancelForm ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-805 flex items-center gap-1.5 leading-none">
                          <AlertCircle className="h-4 w-4 text-[#b89153]" />
                          <span>Order Cancellation Option</span>
                        </p>
                        <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                          You are allowed to cancel because your order is currently processing. All inventory will be restocked immediately.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCancelForm(true)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] shrink-0"
                        id="trigger-cancel-wizard"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel Order
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5 border-t border-[#D4C19D]/10 pt-1 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5 leading-none">
                          <XCircle className="h-4 w-4 text-rose-600" />
                          <span>Order Cancellation Reason Form</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCancelForm(false);
                            setCustomComment('');
                          }}
                          className="text-[10px] text-gray-400 hover:text-gray-600 font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          Keep Order
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-550 uppercase tracking-widest block">Reason for cancellation *</label>
                          <select
                            value={cancelReasonOption}
                            onChange={(e) => setCancelReasonOption(e.target.value)}
                            className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-2.5 py-2 text-xs text-gray-705 focus:outline-none focus:border-[#b89153] font-sans"
                            id="cancel-reason-preset-selector"
                          >
                            <option value="Changed my mind">Changed my mind / No longer needed</option>
                            <option value="Incorrect size/color selected">Incorrect size or color selected</option>
                            <option value="Incorrect shipping address">Incorrect shipping address</option>
                            <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                            <option value="Delivery window is too long">Delivery window is too long</option>
                            <option value="Other">Other reason (Enter below)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block">Additional comments / Details</label>
                          <input
                            type="text"
                            placeholder="Optional custom clarification notes..."
                            value={customComment}
                            onChange={(e) => setCustomComment(e.target.value)}
                            className="w-full bg-[#FAF6F0] border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153] font-sans"
                            id="cancel-reason-custom-input"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCancelForm(false);
                            setCustomComment('');
                          }}
                          className="px-3 py-2 border border-[#D4C19D]/20 text-gray-500 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-gray-55 transition-colors cursor-pointer"
                        >
                          Nevermind
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const combinedReason = customComment.trim() 
                              ? `${cancelReasonOption}: ${customComment.trim()}`
                              : cancelReasonOption;
                            if (onCancelOrder) {
                              onCancelOrder(activeTrackOrder.id, combinedReason);
                            }
                            setShowCancelForm(false);
                            setCustomComment('');
                          }}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm shadow-rose-200 cursor-pointer"
                          id="confirm-cancel-action-button"
                        >
                          Confirm Order Cancellation
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CANCELLED EXPLANATION BANNER OR CHRONOLOGICAL TIMELINE */}
              {activeTrackOrder.shippingStatus === 'Cancelled' ? (
                <div className="p-5 bg-rose-50/50 text-rose-800 rounded-3xl border border-rose-100 flex items-start gap-3.5 text-left animate-fade-up">
                  <div className="p-2 bg-rose-100 rounded-2xl text-rose-600">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 bg-transparent">
                    <h5 className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wide text-rose-900">This Order Has Been Cancelled</h5>
                    <p className="text-[11px] text-rose-700 font-light leading-relaxed">
                      This transaction has been voided. All ordered jewelry pieces have been returned to our standard catalog inventories, and the dispatch courier log is deleted. No delivery attempts will be made.
                    </p>
                    
                    {activeTrackOrder.cancelReason && (
                      <div className="mt-2.5 p-3 bg-white border border-rose-100/55 rounded-xl text-[11px] text-rose-900 leading-normal" id="cancel-reason-feedback-display">
                        <strong className="font-semibold text-rose-950 uppercase tracking-wide text-[9px] block mb-0.5">Customer-Logged Cancellation Motive:</strong>
                        <span className="italic">"{activeTrackOrder.cancelReason}"</span>
                      </div>
                    )}

                    <div className="mt-3.5 flex items-center gap-1.5 text-[9px] bg-rose-100/50 px-3 py-1.5 rounded-lg border border-rose-200/20 text-rose-800 font-mono w-max">
                      <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5" />
                      <span>Boutique items successfully restocked</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}

              {/* Payment Proof Details and Transaction Identifier */}
              {(activeTrackOrder.paymentScreenshot || activeTrackOrder.transactionRef) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-[#D4C19D]/10 text-left">
                  {activeTrackOrder.paymentScreenshot && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Uploaded UPI Screenshot proof</span>
                      <div className="flex items-center gap-2">
                        <a 
                          href={activeTrackOrder.paymentScreenshot} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-12 h-12 rounded-lg overflow-hidden border border-[#D4C19D]/20 block hover:opacity-80 transition-opacity shrink-0"
                        >
                          <img src={activeTrackOrder.paymentScreenshot} alt="Transaction confirmation screenshot" className="w-[#48px] h-[#48px] object-cover" />
                        </a>
                        <div>
                          <p className="text-[10px] text-gray-600 font-semibold leading-tight">Payment Screenshot</p>
                          <a 
                            href={activeTrackOrder.paymentScreenshot} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[9px] text-[#b89153] uppercase font-bold hover:underline mt-0.5 inline-block"
                          >
                            View Image &rarr;
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTrackOrder.transactionRef && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">UPI Transaction Reference / UTR ID</span>
                      <div className="bg-[#FAF6F0] px-3 py-1.5 rounded-lg border border-[#D4C19D]/15 flex flex-col justify-center min-h-[48px]">
                        <p className="text-xs font-mono font-bold text-gray-800 tracking-wider">
                          {activeTrackOrder.transactionRef}
                        </p>
                        <p className="text-[8px] text-gray-400 uppercase tracking-tight font-semibold mt-0.5">
                          Verified Reference
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  Provide an Order reference, shipping address email, or dispatch number on the left panel to display deep delivery progression securely.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
