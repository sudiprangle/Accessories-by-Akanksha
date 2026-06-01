export interface Product {
  id: string;
  name: string;
  price: number; // in INR (₹)
  originalPrice?: number; // for showing discount
  category: 'necklaces' | 'bracelets' | 'rings' | 'earrings' | 'sets' | 'charms' | 'new-arrivals';
  isTennisJewellery: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  material: string;
  sizeGuide?: string;
  inStock: boolean;
  stockCount: number;
  badge?: string; // e.g., "18K Gold Plated", "Waterproof", "Best Seller"
  isWaterproof?: boolean;
  isAntiTarnish?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: 'gold' | 'silver' | 'rose-gold';
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    color?: string;
    size?: string;
  }[];
  subtotal: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  shippingStatus: 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
}

export interface CustomerReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface User {
  email?: string;
  mobile?: string;
  name: string;
  token?: string;
  isAdmin?: boolean;
}
