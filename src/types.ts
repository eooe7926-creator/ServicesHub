export type CategoryId = 'all' | 'koshary' | 'tajin' | 'extras' | 'dessert' | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  nameEn: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  badge?: string;
  popular?: boolean;
  calories?: number;
  servingSize?: string;
  customizable?: boolean;
  available?: boolean; // toggle in admin panel
}

export interface CartItemOption {
  size: 'small' | 'medium' | 'large' | 'mega';
  sizeName: string;
  sizePriceDiff: number;
  spiceLevel: 'cold' | 'medium' | 'fire';
  extraSauce: boolean;
  extraTekleya: boolean;
  extraDakkah: boolean;
  extraShatta: boolean;
  extraChickpeas: boolean;
  notes?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  options: CartItemOption;
  itemTotal: number;
}

export interface UserProfile {
  id?: string;
  email: string;
  fullName: string;
  phone: string;
  isLoggedIn: boolean;
  rememberMe?: boolean;
  provider?: 'email' | 'google' | 'phone' | 'guest';
  avatar?: string;
  createdAt?: string;
}

export interface RegisteredAccount {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  provider: 'email' | 'google' | 'phone' | 'guest';
  createdAt: string;
  totalOrdersCount: number;
  totalSpent: number;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number; // e.g. 10 for 10% or 15 for 15 EGP
  minOrder?: number;
  active: boolean;
  description: string;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  secondaryPhone?: string;
  city: string;
  area: string;
  street: string;
  building: string;
  apartment: string;
  landmark?: string;
  deliveryNotes?: string;
  deliveryType: 'immediate' | 'scheduled';
  scheduledTime?: string;
}

export type PaymentMethod = 'vodafone_cash' | 'instapay' | 'cash_on_delivery';

export type OrderStatus =
  | 'received'
  | 'reviewing_payment'
  | 'preparing'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
  };
  delivery: DeliveryDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentPhone: string;
  paymentScreenshot?: string;
  paymentProofName?: string;
  status: OrderStatus;
  statusUpdates: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}
