/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { MenuStep } from './components/MenuStep';
import { LoginStep } from './components/LoginStep';
import { DeliveryStep } from './components/DeliveryStep';
import { PaymentStep } from './components/PaymentStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { CartDrawer } from './components/CartDrawer';
import { ItemModal } from './components/ItemModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { AdminOrdersModal } from './components/AdminOrdersModal';
import {
  MenuItem,
  CartItem,
  CartItemOption,
  UserProfile,
  DeliveryDetails,
  PaymentMethod,
  Order,
  OrderStatus,
} from './types';
import { MENU_ITEMS, RESTAURANT_INFO, CAIRO_AREAS } from './data/menuData';

const INITIAL_PROFILE: UserProfile = {
  email: '',
  fullName: '',
  phone: '',
  isLoggedIn: false,
  rememberMe: true,
};

const INITIAL_DELIVERY: DeliveryDetails = {
  fullName: '',
  phone: '',
  secondaryPhone: '',
  city: 'القاهرة',
  area: CAIRO_AREAS[0],
  street: '',
  building: '',
  apartment: '',
  deliveryNotes: '',
  deliveryType: 'immediate',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [discount, setDiscount] = useState(0);

  // User & delivery state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('koshary_user_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>(() => {
    try {
      const saved = localStorage.getItem('koshary_delivery_details');
      return saved ? JSON.parse(saved) : INITIAL_DELIVERY;
    } catch {
      return INITIAL_DELIVERY;
    }
  });

  // Orders repository
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('koshary_orders_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Seed with 1 initial sample order for realistic preview
    return [
      {
        id: 'ord-sample-1',
        orderNumber: '#HAND-7382',
        createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        customer: {
          fullName: 'كريم محمود',
          phone: '01065432198',
          email: 'karim@gmail.com',
        },
        delivery: {
          fullName: 'كريم محمود',
          phone: '01065432198',
          city: 'القاهرة',
          area: 'وسط البلد / التحرير',
          street: 'شارع طلعت حرب بجوار قهوة ريش',
          building: 'عمارة ٨',
          apartment: 'الدور الثاني - شقة ٤',
          deliveryNotes: 'التقلية تكون مقرمشة بزيادة من فضلك',
          deliveryType: 'immediate',
        },
        items: [
          {
            cartItemId: 'item-demo-1',
            menuItem: MENU_ITEMS[0],
            quantity: 2,
            options: {
              size: 'large',
              sizeName: 'حجم سوبر (كبير)',
              sizePriceDiff: 10,
              spiceLevel: 'medium',
              extraSauce: true,
              extraTekleya: true,
              extraDakkah: false,
              extraShatta: false,
              extraChickpeas: false,
            },
            itemTotal: 130,
          },
          {
            cartItemId: 'item-demo-2',
            menuItem: MENU_ITEMS[10], // Roz bel laban
            quantity: 2,
            options: {
              size: 'medium',
              sizeName: 'حجم عادي',
              sizePriceDiff: 0,
              spiceLevel: 'cold',
              extraSauce: false,
              extraTekleya: false,
              extraDakkah: false,
              extraShatta: false,
              extraChickpeas: false,
            },
            itemTotal: 50,
          },
        ],
        subtotal: 180,
        deliveryFee: 0,
        discount: 10,
        total: 170,
        paymentMethod: 'vodafone_cash',
        paymentPhone: '01012345678',
        paymentProofName: 'vodafone_receipt_sample.png',
        paymentScreenshot:
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        status: 'preparing',
        statusUpdates: [
          {
            status: 'received',
            timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
            note: 'تم استلام الطلب ومطابقة كاش',
          },
          {
            status: 'preparing',
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            note: 'جاري التجهيز في المطبخ',
          },
        ],
      },
    ];
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('koshary_orders_history', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('koshary_user_profile', JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('koshary_delivery_details', JSON.stringify(deliveryDetails));
    } catch {
      // ignore
    }
  }, [deliveryDetails]);

  // If activeOrder is set and updated in orders, keep it synchronized
  useEffect(() => {
    if (activeOrder) {
      const match = orders.find((o) => o.id === activeOrder.id);
      if (match) {
        setActiveOrder(match);
      }
    }
  }, [orders]);

  // Cart actions
  const handleAddToCart = (item: MenuItem, options: CartItemOption, quantity: number) => {
    const singlePrice =
      item.price +
      options.sizePriceDiff +
      (options.extraTekleya ? 10 : 0) +
      (options.extraSauce ? 8 : 0) +
      (options.extraDakkah ? 7 : 0) +
      (options.extraShatta ? 7 : 0) +
      (options.extraChickpeas ? 10 : 0);

    const itemTotal = singlePrice * quantity;
    const cartItemId = `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    setCart((prev) => [...prev, { cartItemId, menuItem: item, quantity, options, itemTotal }]);
    setIsCartOpen(true);
  };

  // Quick 1-click order for hero item (matching prompt's "كشري ب ٥٥ جنيهاً - اطلب الآن")
  const handleQuickOrderHero = (item: MenuItem) => {
    const defaultOption: CartItemOption = {
      size: 'medium',
      sizeName: 'حجم عادي (وسط)',
      sizePriceDiff: 0,
      spiceLevel: 'medium',
      extraSauce: false,
      extraTekleya: false,
      extraDakkah: false,
      extraShatta: false,
      extraChickpeas: false,
    };
    const cartItemId = `${item.id}-${Date.now()}`;
    setCart((prev) => [
      ...prev,
      {
        cartItemId,
        menuItem: item,
        quantity: 1,
        options: defaultOption,
        itemTotal: item.price,
      },
    ]);
    // Directly advance to Step 2 (تسجيل الدخول للطلب) as in the user's wireframe!
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => {
        if (i.cartItemId === cartItemId) {
          const unitPrice = i.itemTotal / i.quantity;
          return { ...i, quantity: newQty, itemTotal: unitPrice * newQty };
        }
        return i;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const handleApplyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'HAND10') {
      const sub = cart.reduce((acc, i) => acc + i.itemTotal, 0);
      const disc = Math.round(sub * 0.1);
      setDiscount(disc);
      return { success: true, message: `تم تطبيق خصم ١٠٪ (-${disc} ج.م)` };
    }
    if (clean === 'EGYPT' || clean === 'KOSHARY') {
      setDiscount(15);
      return { success: true, message: 'تم تطبيق خصم التوصيل المجاني (-١٥ ج.م)' };
    }
    return { success: false, message: 'كود الخصم غير صحيح أو منتهي الصلاحية' };
  };

  // Step navigation rules
  const canNavigateTo = (targetStep: number): boolean => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return cart.length > 0;
    if (targetStep === 3) return cart.length > 0 && userProfile.isLoggedIn;
    if (targetStep === 4)
      return (
        cart.length > 0 &&
        userProfile.isLoggedIn &&
        Boolean(deliveryDetails.fullName && deliveryDetails.phone)
      );
    if (targetStep === 5) return activeOrder !== null;
    return false;
  };

  const handleFinishOrder = (
    paymentMethod: PaymentMethod,
    screenshotData?: string,
    screenshotName?: string
  ) => {
    const subtotal = cart.reduce((acc, i) => acc + i.itemTotal, 0);
    const deliveryFee = subtotal > 150 ? 0 : RESTAURANT_INFO.deliveryFee;
    const total = Math.max(0, subtotal + deliveryFee - discount);
    const orderNum = `#HAND-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: deliveryDetails.fullName,
        phone: deliveryDetails.phone,
        email: userProfile.email,
      },
      delivery: { ...deliveryDetails },
      items: [...cart],
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      paymentPhone: RESTAURANT_INFO.vodafoneCashNumber,
      paymentScreenshot: screenshotData,
      paymentProofName: screenshotName,
      status: 'received',
      statusUpdates: [
        {
          status: 'received',
          timestamp: new Date().toISOString(),
          note: 'تم استلام الطلب وتأكيد الإرسال',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]);
    setDiscount(0);
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            statusUpdates: [
              ...o.statusUpdates,
              {
                status: newStatus,
                timestamp: new Date().toISOString(),
                note: `تم تغيير الحالة إلى: ${newStatus}`,
              },
            ],
          };
        }
        return o;
      })
    );
  };

  const handleSelectPastOrder = (order: Order) => {
    setActiveOrder(order);
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartTotal = cart.reduce((acc, i) => acc + i.itemTotal, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Top Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        ordersCount={orders.length}
      />

      {/* Breadcrumb Stepper */}
      <StepProgressBar
        currentStep={currentStep}
        onSelectStep={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        canNavigateTo={canNavigateTo}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
        {/* Step 1: Menu / Food Ordering */}
        {currentStep === 1 && (
          <MenuStep
            onSelectItem={(item) => setSelectedMenuItem(item)}
            onQuickOrderHero={handleQuickOrderHero}
            cart={cart}
            onOpenCart={() => setIsCartOpen(true)}
            onProceedToStep2={() => {
              if (cart.length === 0) {
                // if cart empty, add the default signature bowl
                handleQuickOrderHero(MENU_ITEMS[0]);
              } else {
                setCurrentStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        )}

        {/* Step 2: Login / Account */}
        {currentStep === 2 && (
          <LoginStep
            userProfile={userProfile}
            onUpdateProfile={(updated) => setUserProfile((p) => ({ ...p, ...updated }))}
            onProceed={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToMenu={() => {
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            cart={cart}
          />
        )}

        {/* Step 3: Delivery Details & Address */}
        {currentStep === 3 && (
          <DeliveryStep
            initialDetails={deliveryDetails}
            onSaveDetails={(details) => setDeliveryDetails(details)}
            onProceed={() => {
              setCurrentStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Step 4: Payment & Vodafone Cash Proof */}
        {currentStep === 4 && (
          <PaymentStep
            cart={cart}
            delivery={deliveryDetails}
            discount={discount}
            onFinishOrder={handleFinishOrder}
            onBack={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Step 5: Confirmation & Live Order Tracking */}
        {currentStep === 5 && activeOrder && (
          <ConfirmationStep
            order={activeOrder}
            onNewOrder={() => {
              setActiveOrder(null);
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewAllOrders={() => setIsMyOrdersOpen(true)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white/70 py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} {RESTAURANT_INFO.name} ({RESTAURANT_INFO.nameEn}) · جميع الحقوق محفوظة
          </p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>{RESTAURANT_INFO.openingHours}</span>
            <span>·</span>
            <span>الخط الساخن: {RESTAURANT_INFO.hotline}</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentStep(2);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        discount={discount}
        onApplyPromoCode={handleApplyPromoCode}
      />

      <ItemModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onAddToCart={handleAddToCart}
      />

      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        orders={orders}
        onSelectOrder={handleSelectPastOrder}
      />

      <AdminOrdersModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
