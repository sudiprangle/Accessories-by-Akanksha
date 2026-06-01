import React, { useState } from 'react';
import { X, CreditCard, ShoppingBag, ShieldCheck, CheckCircle2, QrCode, Truck, Landmark, Upload, Trash2, Image, Sparkles } from 'lucide-react';
import { CartItem, Order, User } from '../types';

interface CheckoutModalProps {
  cartItems: CartItem[];
  discountPercent: number;
  promoApplied: string;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  currentUserEmail?: string;
  currentUserName?: string;
  deliveryCharge?: number;
  deliveryThreshold?: number;
  currentUser?: User | null;
}

export default function CheckoutModal({
  cartItems,
  discountPercent,
  promoApplied,
  onClose,
  onOrderSuccess,
  currentUserEmail = '',
  currentUserName = '',
  deliveryCharge = 60,
  deliveryThreshold = 499,
  currentUser,
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Completed
  
  const nameParts = currentUserName ? currentUserName.trim().split(/\s+/) : [];
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  const [shippingForm, setShippingForm] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: currentUserEmail || currentUser?.email || '',
    phone: currentUser?.mobile || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  
  // Drag and drop payment screenshot state
  const [paymentScreenshotVal, setPaymentScreenshotVal] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [agreedToCodTerms, setAgreedToCodTerms] = useState(false);

  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Billing formulas
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const deliveryCharges = subtotal > deliveryThreshold ? 0 : deliveryCharge;
  const total = subtotal - discountAmount + deliveryCharges;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.firstName || !shippingForm.lastName || !shippingForm.phone || !shippingForm.address || !shippingForm.city || !shippingForm.pincode) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'upi' && !paymentScreenshotVal) {
      alert('Please upload a screenshot of your successful UPI payment first.');
      return;
    }
    if (paymentMethod === 'cod' && !agreedToCodTerms) {
      alert('Please agree to the Cash on Delivery Terms & Conditions first.');
      return;
    }

    setIsProcessing(true);

    // Simulate luxury processing and transaction security validation
    setTimeout(() => {
      const orderId = `AK-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNo = `TRAK-${Math.floor(1000000 + Math.random() * 9000000)}`;
      
      const newOrder: Order = {
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        customerName: `${shippingForm.firstName} ${shippingForm.lastName}`.trim(),
        customerEmail: currentUser?.email || shippingForm.email || 'N/A',
        customerUserId: currentUser?.email || currentUser?.mobile || '',
        shippingAddress: {
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          pincode: shippingForm.pincode,
          phone: shippingForm.phone,
        },
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          color: item.selectedColor,
          size: item.selectedSize,
        })),
        subtotal,
        deliveryCharges,
        total,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
        paymentScreenshot: paymentMethod === 'upi' && paymentScreenshotVal ? paymentScreenshotVal : undefined,
        shippingStatus: 'Processing',
        trackingNumber: trackingNo,
      };

      // Construct data payload for Google Sheet via Google Apps Script Web App with comprehensive header variations
      const productNamesCombined = cartItems.map(item => item.product.name).join(', ');
      const productDetailsCombined = cartItems.map(item => `${item.product.name} (Qty: ${item.quantity}, Color: ${item.selectedColor || 'Gold'}, Size: ${item.selectedSize || 'Standard'})`).join(', ');

      const syncPayload = {
        // Screenshot payload
        paymentScreenshot: paymentMethod === 'upi' ? (paymentScreenshotVal || '') : '',
        transactionRef: paymentMethod === 'upi' ? transactionRef : '',
        // First name & Last name combinations
        firstName: shippingForm.firstName,
        lastName: shippingForm.lastName,
        first_name: shippingForm.firstName,
        last_name: shippingForm.lastName,
        FirstName: shippingForm.firstName,
        LastName: shippingForm.lastName,

        // Email
        email: shippingForm.email || 'N/A',
        Email: shippingForm.email || 'N/A',

        // Contact / Phone
        contact: shippingForm.phone,
        phone: shippingForm.phone,
        Contact: shippingForm.phone,
        Phone: shippingForm.phone,
        contactNumber: shippingForm.phone,
        contact_number: shippingForm.phone,

        // Address variants
        address: shippingForm.address,
        Address: shippingForm.address,
        shippingAddress: shippingForm.address,
        shipping_address: shippingForm.address,
        streetAddress: shippingForm.address,
        street_address: shippingForm.address,

        // City & State
        city: shippingForm.city,
        City: shippingForm.city,
        state: shippingForm.state,
        State: shippingForm.state,

        // Pincode variants
        pincode: shippingForm.pincode,
        pin_code: shippingForm.pincode,
        pinCode: shippingForm.pincode,
        PinCode: shippingForm.pincode,
        Pincode: shippingForm.pincode,
        PINCode: shippingForm.pincode,
        pin: shippingForm.pincode,
        zip: shippingForm.pincode,
        zipcode: shippingForm.pincode,
        zip_code: shippingForm.pincode,

        // Product Name variants
        productName: productNamesCombined,
        product_name: productNamesCombined,
        ProductName: productNamesCombined,
        product: productNamesCombined,
        Product: productNamesCombined,
        products: productNamesCombined,
        Products: productNamesCombined,
        selectedProduct: productDetailsCombined,
        selected_product: productDetailsCombined,
        selectedProducts: productDetailsCombined,
        selected_products: productDetailsCombined,
        SelectedProduct: productDetailsCombined,

        // Payment Method variants - Covering intensive naming schemes, spaces, and case variants
        paymentMethod: paymentMethod.toUpperCase(),
        payment_method: paymentMethod.toUpperCase(),
        PaymentMethod: paymentMethod.toUpperCase(),
        payment: paymentMethod.toUpperCase(),
        Payment: paymentMethod.toUpperCase(),
        paymentmode: paymentMethod.toUpperCase(),
        paymentMode: paymentMethod.toUpperCase(),
        payment_mode: paymentMethod.toUpperCase(),
        PaymentMode: paymentMethod.toUpperCase(),
        method: paymentMethod.toUpperCase(),
        Method: paymentMethod.toUpperCase(),
        paymentmethod: paymentMethod.toUpperCase(),
        "payment method": paymentMethod.toUpperCase(),
        "Payment Method": paymentMethod.toUpperCase(),
        "PAYMENT METHOD": paymentMethod.toUpperCase(),
        "Payment_Method": paymentMethod.toUpperCase(),
        "payment mode": paymentMethod.toUpperCase(),
        "Payment Mode": paymentMethod.toUpperCase(),
        "PAYMENT MODE": paymentMethod.toUpperCase(),
        "payment type": paymentMethod.toUpperCase(),
        "Payment Type": paymentMethod.toUpperCase(),
        "PAYMENT TYPE": paymentMethod.toUpperCase(),
        "paymentOption": paymentMethod.toUpperCase(),
        "PaymentOption": paymentMethod.toUpperCase(),
        "payment_option": paymentMethod.toUpperCase(),
        "Payment Option": paymentMethod.toUpperCase(),
        "payment option": paymentMethod.toUpperCase(),
        "payMethod": paymentMethod.toUpperCase(),
        "pay_method": paymentMethod.toUpperCase(),
        "PayMethod": paymentMethod.toUpperCase(),
        "mode": paymentMethod.toUpperCase(),
        "Mode": paymentMethod.toUpperCase(),
        "MODE": paymentMethod.toUpperCase(),
        
        // Alternative values using more natural spacing/case values in case of validation on Google Form/Sheet end
        "paymentMethodTitle": paymentMethod === 'upi' ? 'UPI' : 'COD',
        "paymentMethodFull": paymentMethod === 'upi' ? 'UPI (GPay/Paytm)' : 'Cash on Delivery (COD)',
        "paymentMethodSimple": paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
        "paymentMethodLower": paymentMethod,
        
        // Directly maps space and lowercase variants to formatted values
        "payment method simple": paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
        "Payment Method Simple": paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
        "Payment Method Text": paymentMethod === 'upi' ? 'UPI (GPay/Paytm)' : 'Cash on Delivery (COD)',
        "payment method text": paymentMethod === 'upi' ? 'UPI (GPay/Paytm)' : 'Cash on Delivery (COD)',

        // Total Amount variants
        totalAmount: total,
        total_amount: total,
        total: total,
        Total: total,
        amount: total,
        Amount: total,
        totalPrice: total,
        total_price: total,
        TotalPrice: total
      };

      // Send JSON payload directly to the specified Google Apps Script Web App URL
      fetch('https://script.google.com/macros/s/AKfycbzSFQx2flQvTPRPUKf5xdXDqWOKkmh0eKfI7tKLZn2JCBxcw5h3clJbpawWGgsBKnlJ/exec', {
        method: 'POST',
        mode: 'no-cors', // Bypasses CORS browser pre-flight checks specifically required for standalone Google Apps Script end points
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(syncPayload),
      })
      .then(() => {
        console.log('Order synchronization payload delivered successfully.');
      })
      .catch((err) => {
        console.warn('Silent fallback for tracking transmission:', err);
      });

      setCompletedOrder(newOrder);
      setIsProcessing(false);
      setStep(3);
    }, 2800);
  };

  const finishCheckoutAndRedirect = () => {
    if (completedOrder) {
      onOrderSuccess(completedOrder);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#FAF6F0] rounded-3xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Checkout container Header */}
        <div className="bg-[#1E1C1A] text-white px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#b89153]" />
            <span className="font-serif tracking-widest text-sm uppercase">Secure Diamond Checkout Gateway</span>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/60 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 3 && (
          <div className="bg-white border-b border-[#D4C19D]/15 px-6 py-3 flex justify-center gap-8 text-xs text-gray-500 font-medium">
            <span className={step === 1 ? 'text-[#b89153] font-bold' : ''}>1. Shipping & Dispatch</span>
            <span>&rarr;</span>
            <span className={step === 2 ? 'text-[#b89153] font-bold' : ''}>2. Secure Money Transfer</span>
            <span>&rarr;</span>
            <span>3. Order Placed</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: SHIPPING DETAIL INPUTS */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="md:col-span-7 p-6 space-y-4">
              <h3 className="font-serif text-[#1E1C1A] text-base font-semibold uppercase tracking-wide">
                Shipping Address Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">First Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.firstName}
                    onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153]"
                    placeholder="First name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.lastName}
                    onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153]"
                    placeholder="Last name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">Email (Optional)</label>
                  <input
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153]"
                    placeholder="name@email.com (optional)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153]"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">Street/Suite Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153] resize-none"
                    placeholder="House/Apartment number, street name, locality"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153]"
                    placeholder="City"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">State *</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153]"
                    placeholder="State"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block">Pincode *</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={shippingForm.pincode}
                    onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153]"
                    placeholder="6 PIN digits"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E1C1A] hover:bg-[#b89153] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Proceed to Payment Parameters
              </button>
            </form>
          )}

          {/* STEP 2: SECURE PAYMENT MODAL */}
          {step === 2 && (
            <div className="md:col-span-7 p-6 space-y-5">
              <h3 className="font-serif text-[#1E1C1A] text-base font-semibold uppercase tracking-wide">
                Complete Safe Payment
              </h3>

              {/* Selector tabs */}
              <div className="flex bg-[#FAF6F0] p-1 rounded-xl border border-[#D4C19D]/20 text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-1.5 text-center rounded-lg font-medium transition-colors cursor-pointer ${
                    paymentMethod === 'upi' ? 'bg-[#1E1C1A] text-white' : 'text-gray-650 hover:bg-black/5'
                  }`}
                >
                  UPI (GPay/Paytm)
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex-1 py-1.5 text-center rounded-lg font-medium transition-colors cursor-pointer ${
                    paymentMethod === 'cod' ? 'bg-[#1E1C1A] text-white' : 'text-gray-650 hover:bg-black/5'
                  }`}
                >
                  Cash (COD)
                </button>
              </div>

              {/* Payment Details forms */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {paymentMethod === 'upi' && (
                  <div className="space-y-4 animate-fade-up">
                    {/* Exquisite QR Code Card mirroring user representation */}
                    <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-[#D4C19D]/20 flex flex-col items-center w-full shadow-xs text-center">
                      
                      {/* Avatar and Name */}
                      <div className="flex items-center gap-2 mb-4 bg-white/60 px-4 py-2 rounded-2xl border border-[#D4C19D]/10">
                        <div className="w-8 h-8 rounded-full border-2 border-white shadow-xs overflow-hidden bg-[#FAF6F0] flex items-center justify-center">
                          <span className="font-serif text-[10px] font-bold text-gray-700">AR</span>
                        </div>
                        <span className="font-sans font-bold text-[#1E1C1A] text-xs tracking-wide">Akanksha R</span>
                      </div>

                      {/* White QR Code container */}
                      <div className="bg-white p-5 rounded-2xl shadow-md w-full max-w-[260px] flex flex-col items-center relative border border-gray-100">
                        <div className="relative w-40 h-40 flex items-center justify-center bg-white p-1">
                          <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=akanksharakshe13-1@okicici%26pn=Akanksha%20R%26cu=INR" 
                            alt="Payment QR Code" 
                            className="w-full h-full object-contain"
                          />
                          {/* GPay multicolored loop-themed center overlay */}
                          <div className="absolute w-9 h-9 bg-white rounded-full p-1 border shadow-xs flex items-center justify-center">
                            <span className="text-[9px] font-serif font-black flex flex-col items-center leading-none">
                              <span className="text-blue-600 font-extrabold">G</span>
                              <span className="text-red-500 font-bold text-[8px] -mt-1">Pay</span>
                            </span>
                          </div>
                        </div>

                        {/* UPI ID block */}
                        <div className="w-full border-t border-gray-100 pt-3 mt-2">
                          <p className="text-[10px] font-semibold text-gray-700 font-mono tracking-tight block">
                            UPI ID: akanksharakshe13-1@okicici
                          </p>
                        </div>
                      </div>

                      {/* Footer outside white box */}
                      <p className="text-[11px] text-gray-500 mt-4 font-medium flex items-center gap-1 justify-center leading-none">
                        Scan to pay with any UPI app
                      </p>
                    </div>

                    {/* Integrated Drag & Drop Payment Screenshot Area */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-wider uppercase text-gray-600 block">
                        Upload Payment Screenshot * <span className="text-red-500 font-normal normal-case italic">(required)</span>
                      </label>
                      
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            if (!file.type.startsWith('image/')) {
                              alert('Please upload an image file (PNG, JPG, JPEG) for the payment proof.');
                              return;
                            }
                            const r = new FileReader();
                            r.onload = () => setPaymentScreenshotVal(r.result as string);
                            r.readAsDataURL(file);
                          }
                        }}
                        onClick={() => document.getElementById('screenshot-picker')?.click()}
                        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[140px] ${
                          isDragging 
                            ? 'border-[#b89153] bg-[#b89153]/5' 
                            : paymentScreenshotVal 
                              ? 'border-emerald-500/80 bg-emerald-50/5' 
                              : 'border-[#D4C19D]/30 bg-white hover:border-[#b89153]/60'
                        }`}
                      >
                        <input
                          id="screenshot-picker"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                alert('Please upload an image file (PNG, JPG, JPEG) for the payment proof.');
                                return;
                              }
                              const r = new FileReader();
                              r.onload = () => setPaymentScreenshotVal(r.result as string);
                              r.readAsDataURL(file);
                            }
                          }}
                        />

                        {paymentScreenshotVal ? (
                          <div className="w-full h-full flex flex-col items-center justify-center space-y-2" onClick={(e) => e.stopPropagation()}>
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-500/30 relative shadow-sm group">
                              <img src={paymentScreenshotVal} alt="Screenshot preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setPaymentScreenshotVal(null)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                              >
                                <Trash2 className="h-4 w-4 text-rose-400" />
                              </button>
                            </div>
                            <div className="text-center">
                              <p className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 justify-center leading-none">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Screenshot Loaded!
                              </p>
                              <button
                                type="button"
                                onClick={() => setPaymentScreenshotVal(null)}
                                className="text-[10px] text-red-500 hover:underline mt-0.5"
                              >
                                Remove & upload another
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 my-1 pointer-events-none flex flex-col items-center select-none">
                            <div className="p-2.5 bg-[#FAF6F0] rounded-full text-[#b89153]/80 mb-1">
                              <Upload className="h-4 w-4" />
                            </div>
                            <p className="text-[11px] font-semibold text-gray-750 leading-none">
                              Drag & drop payment screenshot here
                            </p>
                            <p className="text-[9px] text-gray-400 font-light mt-0.5">
                              or click to browse from files (PNG, JPG, JPEG)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Optional Transaction reference identifier */}
                    <div className="w-full space-y-1 text-left">
                      <label className="text-[10px] font-bold tracking-wider uppercase text-gray-500 block">
                        UPI Transaction / UTR Ref ID <span className="text-gray-400 font-normal lowercase italic">(optional)</span>
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#b89153]"
                        placeholder="12-digit transaction Ref Number"
                      />
                    </div>
                  </div>
                )}



                {paymentMethod === 'cod' && (
                  <div className="space-y-4 animate-fade-up text-left">
                    {/* COD Info & Policy Box */}
                    <div className="p-4 bg-amber-50/40 border border-[#D4C19D]/30 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-start gap-2.5">
                        <Truck className="h-5 w-5 text-[#b89153] mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-semibold text-xs text-[#1E1C1A] uppercase tracking-wide">Cash on Delivery (COD) Option</p>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-normal">
                            Pay in cash upon handoff courier arrival. Please read carefully and agree to our luxury terms before proceeding.
                          </p>
                        </div>
                      </div>

                      {/* Explicit Terms list */}
                      <div className="border-t border-[#D4C19D]/15 pt-2.5 space-y-2 text-[10px] text-gray-600 font-light leading-normal">
                        <p className="flex items-start gap-1.5">
                          <span className="text-[#b89153] font-bold">&bull;</span>
                          <span><strong>A Phone Verification/Call</strong> will be triggered to your shipping contact listed (+91 {shippingForm.phone || 'recipient number'}) prior to final dispatch. If unreachable, the order will be auto-canceled.</span>
                        </p>
                        <p className="flex items-start gap-1.5">
                          <span className="text-[#b89153] font-bold">&bull;</span>
                          <span><strong>No Open-Delivery option:</strong> You must complete full Cash payment to the logistics partner before opening or unpacking the parcel.</span>
                        </p>
                        <p className="flex items-start gap-1.5">
                          <span className="text-[#b89153] font-bold">&bull;</span>
                          <span><strong>Package Refusal Policy:</strong> Repeated deliberate rejection or refusal of shipment upon delivery will restrict your account from future dispatch privileges.</span>
                        </p>
                      </div>
                    </div>

                    {/* Interactive Terms checkmark checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none bg-white p-3 rounded-xl border border-[#D4C19D]/20 hover:border-[#b89153]/55 transition-colors">
                      <input 
                        type="checkbox"
                        checked={agreedToCodTerms}
                        onChange={(e) => setAgreedToCodTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-[#D4C19D]/40 text-[#b89153] focus:ring-[#b89153] cursor-pointer"
                      />
                      <span className="text-[11px] text-gray-650 leading-snug">
                        I write to agree and accept the <strong>Cash on Delivery (COD) Terms & Conditions</strong> and commit to hand over the total amount of <strong>₹{total.toLocaleString('en-IN')}</strong> to the shipping courier agent.
                      </span>
                    </label>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 bg-transparent border border-[#1E1C1A]/20 text-[#1E1C1A]/70 text-xs font-semibold rounded-xl uppercase tracking-wider"
                    disabled={isProcessing}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#1E1C1A] hover:bg-[#b89153] text-white text-xs font-semibold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Finishing SECURE payment processing...
                      </span>
                    ) : (
                      <span>Complete Payment ₹{total.toLocaleString('en-IN')}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: TRANSACTION SUCCESS PREVIEW */}
          {step === 3 && completedOrder && (
            <div className="col-span-12 p-8 text-center space-y-6 flex flex-col items-center animate-fade-up">
              <div className="h-16 w-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Congratulations, Order Placed!
                </h2>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Your payment was authorized successfully. An invoice has been emailed to{' '}
                  <strong className="text-gray-700">{completedOrder.customerEmail}</strong>.
                </p>
              </div>

              {/* Order Info Card summary details */}
              <div className="bg-white border border-[#D4C19D]/15 rounded-2xl p-4 sm:p-5 max-w-md w-full text-left grid grid-cols-2 gap-3 divide-y divide-[#D4C19D]/10">
                <div className="col-span-2 flex justify-between pb-2 font-mono text-[11px] text-gray-400">
                  <span>Order Number</span>
                  <span className="font-semibold text-gray-800">{completedOrder.id}</span>
                </div>
                <div className="pt-2 text-xs">
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest block">Recipient Name</span>
                  <span className="font-semibold text-[#1E1C1A] block">{completedOrder.customerName}</span>
                </div>
                <div className="pt-2 text-xs text-right">
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest block">Estimated Delivery</span>
                  <span className="font-semibold text-emerald-600 block">3-4 business days</span>
                </div>
                <div className="col-span-2 pt-2 text-xs flex justify-between">
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest leading-6">Tracking Number</span>
                  <span className="font-mono text-gray-700 text-xs font-semibold leading-6 bg-[#FAF6F0] border border-[#D4C19D]/10 px-2 rounded">
                    {completedOrder.trackingNumber}
                  </span>
                </div>
              </div>

              <button
                onClick={finishCheckoutAndRedirect}
                className="px-8 py-3 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] font-semibold text-xs rounded-full uppercase tracking-widest transition-colors cursor-pointer"
              >
                Track Live Order Dispatch Status
              </button>
            </div>
          )}

          {/* RIGHT COLUMN: RECAP & ORDER SUMMARY */}
          {step !== 3 && (
            <div className="md:col-span-5 bg-white border-l border-[#D4C19D]/15 p-6 space-y-4">
              <h4 className="font-serif text-[#1E1C1A] text-sm font-semibold uppercase tracking-wider pb-2 border-b border-[#D4C19D]/10 flex items-center justify-between">
                <span>Summary</span>
                <span className="text-xs text-gray-400 font-light font-mono">{cartItems.length} items</span>
              </h4>

              {/* Items strip */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3 items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border bg-[#FAF6F0]">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-gray-800 truncate max-w-[120px]">{item.product.name}</p>
                        <p className="text-[9px] text-[#b89153] uppercase">{item.selectedColor || 'Gold'}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] font-bold text-gray-800">₹{item.product.price * item.quantity}</p>
                      <p className="text-[9px] text-gray-400 font-light">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations breakdown strip */}
              <div className="border-t border-[#D4C19D]/10 pt-3 space-y-2 text-xs">
                {promoApplied && (
                  <div className="p-1.5 bg-yellow-50 text-yellow-800 text-[10px] rounded border border-yellow-100 flex justify-between items-center font-medium">
                    <span>Applied: {promoApplied.substring(0, 15)}...</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Delivery fee</span>
                  <span>{deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}</span>
                </div>
                <div className="flex justify-between text-sm text-[#1E1C1A] font-bold pt-2 border-t border-[#D4C19D]/10">
                  <span>Final Total</span>
                  <span className="text-[#b89153]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
