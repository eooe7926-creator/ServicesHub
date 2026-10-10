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
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { AdminLoginView, AdminDashboardView, MASTER_EMAIL } from './components/AdminViews';
import {
  MenuItem,
  CartItem,
  CartItemOption,
  UserProfile,
  DeliveryDetails,
  PaymentMethod,
  Order,
  OrderStatus,
  UserRole,
  StaffAccount,
  StaffPermissions,
  ActivityLog,
  StoreSettings,
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

const DEFAULT_STAFF: StaffAccount[] = [
  {
    id: 'staff-demo-1',
    email: 'staff@kosharyhand.com',
    pass: 'staff123',
    permissions: { menu: true, orders: true },
    createdAt: '١٠:٠٠ ص',
  },
];

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    user: 'vibersvge@gmail.com',
    action: 'تشغيل وبدء نظام كشري هاند الآمن وتعيين صلاحيات المدير',
    time: '١٠:٠٠ ص',
    timestamp: Date.now() - 3600000,
  },
];

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  customerServicePhone: RESTAURANT_INFO.hotline,
  customerServiceWhatsapp: RESTAURANT_INFO.whatsappNumber,
  deliveryManagerPhone: '01066934250',
  deliverySpecialists: [
    {
      id: 'spec-1',
      name: 'كابتن محمود حسن',
      phone: '01098765432',
      area: 'وسط البلد والتحرير والدقي',
      vehicle: 'موتوسيكل سريع',
      isAvailable: true,
    },
    {
      id: 'spec-2',
      name: 'كابتن إبراهيم فؤاد',
      phone: '01123456789',
      area: 'المعادي ومصر القديمة',
      vehicle: 'موتوسيكل سريع',
      isAvailable: true,
    },
    {
      id: 'spec-3',
      name: 'كابتن ياسر طلعت',
      phone: '01234567890',
      area: 'مدينة نصر ومصر الجديدة',
      vehicle: 'سكوتر كهربائي',
      isAvailable: true,
    },
  ],
  privacyPolicy:
    'نحن في كشري هاند نلتزم بأعلى معايير الأمان وحماية خصوصية عملائنا الكرام. لا يتم استخدام أرقام الهواتف أو العناوين إلا لغرض إيصال الطلبات وتأكيد حالة الدفع. نحن نضمن عدم مشاركة أي بيانات شخصية مع أي جهة خارجية تحت أي ظرف.',
  termsOfService:
    '١. يتم تحضير جميع الوجبات طازجة فور تأكيد إرفاق الدفع أو طلب الكاش.\n٢. في حال وجود أي ملاحظة على جودة الطعام أو تأخر التوصيل عن الموعد المحدد، يحق للعميل استبدال الوجبة فوراً أو استرداد قيمتها عبر التواصل مع خدمة العملاء.\n٣. يلتزم الطيار بتسليم الطلب ساخناً ومغلفاً ومرفقاً معه الدقة والشطة والتقلية الأصلية.',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'customer' | 'admin-login' | 'admin-dashboard'>('customer');

  // RBAC Authentication State
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('guest');
  const [currentStaffPermissions, setCurrentStaffPermissions] = useState<StaffPermissions>({
    menu: true,
    orders: true,
  });
  const [currentAdminEmail, setCurrentAdminEmail] = useState<string>('');

  // Staff accounts management
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(() => {
    try {
      const saved = localStorage.getItem('koshary_staff_accounts');
      return saved ? JSON.parse(saved) : DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
    }
  });

  // Security activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('koshary_activity_logs');
      return saved ? JSON.parse(saved) : DEFAULT_LOGS;
    } catch {
      return DEFAULT_LOGS;
    }
  });

  // Store settings (خدمة العملاء، التوصيل، سياسة الخصوصية)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('koshary_store_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // Dynamic restaurant brand state (customizable via Admin dashboard)
  const [brandName, setBrandName] = useState<string>(() => {
    return localStorage.getItem('koshary_brand_name') || 'كشري هاند';
  });

  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return (
      localStorage.getItem('koshary_logo_url') ||
      'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=150&q=80'
    );
  });

  const [dishName, setDishName] = useState<string>(() => {
    return localStorage.getItem('koshary_dish_name') || 'طبق كشري هاند الخاص';
  });

  const [dishPrice, setDishPrice] = useState<number>(() => {
    const saved = localStorage.getItem('koshary_product_price');
    return saved ? Number(saved) : 55;
  });

  const [dishImg, setDishImg] = useState<string>(() => {
    return localStorage.getItem('koshary_product_img') || '';
  });

  // Dynamic menu items list with persistent additions, edits, and image updates
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('koshary_menu_items');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return MENU_ITEMS;
  });

  // Customer Support & Policy Modal state
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportModalTab, setSupportModalTab] = useState<'contact' | 'delivery' | 'privacy'>('contact');

  // Cart & Ordering State
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
            menuItem: MENU_ITEMS[10] || MENU_ITEMS[1],
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
        paymentPhone: '+201066934250',
        paymentProofName: 'vodafone_receipt_sample.png',
        paymentScreenshot:
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        status: 'preparing',
        statusUpdates: [
          {
            status: 'received',
            timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
            note: 'تم الدفع وتأكيد الإرفاق',
          },
        ],
      },
    ];
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  // Activity logger helper
  const logActivity = (user: string, action: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user,
      action,
      time: new Date().toLocaleTimeString('ar-EG'),
      timestamp: Date.now(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Sync staff, logs, settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('koshary_staff_accounts', JSON.stringify(staffAccounts));
    } catch {
      // ignore
    }
  }, [staffAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem('koshary_activity_logs', JSON.stringify(activityLogs));
    } catch {
      // ignore
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('koshary_store_settings', JSON.stringify(storeSettings));
    } catch {
      // ignore
    }
  }, [storeSettings]);

  // Sync brand settings to localStorage
  const handleUpdateMenuData = (data: {
    brandName: string;
    logoUrl: string;
    dishName: string;
    dishPrice: number;
    dishImg: string;
  }) => {
    setBrandName(data.brandName);
    setLogoUrl(data.logoUrl);
    setDishName(data.dishName);
    setDishPrice(data.dishPrice);
    setDishImg(data.dishImg);

    localStorage.setItem('koshary_brand_name', data.brandName);
    localStorage.setItem('koshary_logo_url', data.logoUrl);
    localStorage.setItem('koshary_dish_name', data.dishName);
    localStorage.setItem('koshary_product_price', String(data.dishPrice));
    localStorage.setItem('koshary_product_img', data.dishImg);

    logActivity(
      currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail || 'عامل',
      'تحديث بيانات اسم المطعم والطبق الرئيسي والأسعار'
    );
  };

  // Manager: Update single meal
  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      try {
        localStorage.setItem('koshary_menu_items', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    logActivity(
      currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail || 'عامل',
      `تعديل بيانات الوجبة: ${updatedItem.name}`
    );
  };

  // Manager: Add new meal (وضع مأكولات)
  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('koshary_menu_items', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    logActivity(
      currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail || 'عامل',
      `إضافة وجبة جديدة للمنيو: ${newItem.name}`
    );
  };

  // Manager: Delete meal (إزالة مأكولات)
  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => {
      const target = prev.find((i) => i.id === itemId);
      const updated = prev.filter((item) => item.id !== itemId);
      try {
        localStorage.setItem('koshary_menu_items', JSON.stringify(updated));
      } catch {
        // ignore
      }
      logActivity(
        currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail || 'عامل',
        `إزالة وحذف وجبة من المنيو: ${target?.name || itemId}`
      );
      return updated;
    });
  };

  // Image management handlers (Controlled strictly by Manager)
  const handleUpdateMenuItemImage = (itemId: string, newUrl: string) => {
    if (itemId === 'hero' || itemId === 'koshary-super') {
      const val = newUrl === '' ? 'NONE' : newUrl;
      setDishImg(val);
      localStorage.setItem('koshary_product_img', val);
    }

    setMenuItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId || (itemId === 'hero' && item.id === 'koshary-super')) {
          return {
            ...item,
            image: newUrl,
          };
        }
        return item;
      });

      try {
        localStorage.setItem('koshary_menu_items', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    logActivity(
      currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail || 'مدير',
      `تحديث أو إزالة صورة الوجبة (${itemId})`
    );
  };

  const handleUpdateLogo = (newUrl: string) => {
    setLogoUrl(newUrl);
    localStorage.setItem('koshary_logo_url', newUrl);
    logActivity(
      currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail || 'مدير',
      'تحديث أو إزالة شعار المطعم'
    );
  };

  const handleResetAllImagesToDefault = () => {
    localStorage.removeItem('koshary_menu_items');
    localStorage.removeItem('koshary_product_img');
    localStorage.removeItem('koshary_logo_url');
    setMenuItems(MENU_ITEMS);
    setDishImg('');
    setLogoUrl(
      'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=150&q=80'
    );
    logActivity(
      currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail || 'مدير',
      'استعادة كافة الصور الافتراضية الأصلية'
    );
  };

  // Update Store Settings (خدمة العملاء، التوصيل، السياسة)
  const handleUpdateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    logActivity(
      currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail || 'مدير',
      'تحديث أرقام خدمة العملاء والتوصيل وسياسة الخصوصية'
    );
  };

  const handleCreateStaff = (staff: StaffAccount) => {
    setStaffAccounts((prev) => [...prev, staff]);
    logActivity(MASTER_EMAIL, `إضافة حساب عامل جديد: ${staff.email}`);
  };

  const handleDeleteStaff = (staffId: string) => {
    const target = staffAccounts.find((s) => s.id === staffId);
    setStaffAccounts((prev) => prev.filter((s) => s.id !== staffId));
    if (target) {
      logActivity(MASTER_EMAIL, `إلغاء وحذف حساب العامل: ${target.email}`);
    }
  };

  // Sync orders to localStorage
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

  // Quick order hero item matching selectProductAndNext('dish-1')
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
    const newCartItem: CartItem = {
      cartItemId,
      menuItem: item,
      quantity: 1,
      options: defaultOption,
      itemTotal: item.price,
    };

    setCart([newCartItem]);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitPrice = item.itemTotal / item.quantity;
          return {
            ...item,
            quantity: newQty,
            itemTotal: unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleApplyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'HAND10') {
      setDiscount(10);
      return { success: true, message: 'تم تطبيق خصم ١٠ جنيه بنجاح! كود HAND10' };
    } else if (clean === 'KOSHARY20') {
      setDiscount(20);
      return { success: true, message: 'تم تطبيق خصم ٢٠ جنيه بنجاح! كود KOSHARY20' };
    }
    return { success: false, message: 'كود الخصم غير صحيح أو منتهي الصلاحية.' };
  };

  // Order submission
  const handleFinishOrder = (
    paymentMethod: PaymentMethod,
    screenshotData?: string,
    screenshotName?: string
  ) => {
    const subtotal = cart.reduce((acc, i) => acc + i.itemTotal, 0);
    const deliveryFee = subtotal > 150 ? 0 : RESTAURANT_INFO.deliveryFee;
    const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#HAND-${randomSuffix}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: deliveryDetails.fullName || userProfile.fullName || 'عميل كشري هاند',
        phone: deliveryDetails.phone || userProfile.phone || '01000000000',
        email: userProfile.email,
      },
      delivery: deliveryDetails,
      items: [...cart],
      subtotal,
      deliveryFee,
      discount,
      total: grandTotal,
      paymentMethod,
      paymentPhone: RESTAURANT_INFO.vodafoneCashNumber,
      paymentScreenshot: screenshotData,
      paymentProofName: screenshotName,
      status: 'received',
      statusUpdates: [
        {
          status: 'received',
          timestamp: new Date().toISOString(),
          note:
            paymentMethod === 'vodafone_cash'
              ? 'تم استلام وتأكيد إرفاق إيصال فودافون كاش'
              : 'تم تأكيد الطلب للدفع عند الاستلام',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]);
    setDiscount(0);
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    logActivity(
      newOrder.customer.fullName,
      `طلب جديد ${newOrder.orderNumber} بقيمة ${newOrder.total} ج.م`
    );
  };

  // Status Updater from admin or tracking
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statusLabels: Record<OrderStatus, string> = {
            received: 'تم تأكيد الطلب والدفع',
            reviewing_payment: 'مراجعة إيصال التحويل',
            preparing: 'جاري التحضير في المطبخ',
            on_the_way: 'الطلب مع كابتن الدليفري في الطريق',
            delivered: 'تم تسليم الطلب للعميل بنجاح ✓',
            cancelled: 'تم إلغاء الطلب',
          };

          const newUpdate = {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: statusLabels[newStatus],
          };

          return {
            ...ord,
            status: newStatus,
            statusUpdates: [newUpdate, ...ord.statusUpdates],
          };
        }
        return ord;
      })
    );

    logActivity(
      currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail || 'المطعم',
      `تحديث حالة الطلب (${orderId}) إلى: ${newStatus}`
    );
  };

  // Navigation Guard for customer steps
  const canNavigateTo = (step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return cart.length > 0;
    if (step === 3) return cart.length > 0 && userProfile.isLoggedIn;
    if (step === 4) return cart.length > 0 && !!deliveryDetails.fullName && !!deliveryDetails.phone;
    if (step === 5) return !!activeOrder;
    return false;
  };

  const handleSelectPastOrder = (order: Order) => {
    setActiveOrder(order);
    setViewMode('customer');
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartTotal = cart.reduce((acc, i) => acc + i.itemTotal, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Top Navbar - Clean customer interface without any camera/edit icons */}
      <Header
        brandName={brandName}
        logoUrl={logoUrl}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenAdminLogin={() => {
          setViewMode(currentUserRole !== 'guest' ? 'admin-dashboard' : 'admin-login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => {
          setSupportModalTab('contact');
          setIsSupportModalOpen(true);
        }}
        ordersCount={orders.length}
        customerServicePhone={storeSettings.customerServicePhone}
      />

      {/* Main Container */}
      <div className="flex-1 w-full flex flex-col">
        {/* Admin Login View */}
        {viewMode === 'admin-login' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <AdminLoginView
              onLoginSuccess={(role, perms, email) => {
                setCurrentUserRole(role);
                setCurrentStaffPermissions(perms);
                setCurrentAdminEmail(email);
                setViewMode('admin-dashboard');
              }}
              onCancel={() => setViewMode('customer')}
              staffAccounts={staffAccounts}
              onLogActivity={logActivity}
            />
          </div>
        )}

        {/* Admin Dashboard View - Exclusive Manager & Staff Authority */}
        {viewMode === 'admin-dashboard' && (
          <div className="flex-1 w-full">
            <AdminDashboardView
              currentUserRole={currentUserRole}
              currentStaffPermissions={currentStaffPermissions}
              currentAdminEmail={currentAdminEmail}
              brandName={brandName}
              logoUrl={logoUrl}
              dishName={dishName}
              dishPrice={dishPrice}
              dishImg={dishImg}
              menuItems={menuItems}
              onUpdateMenuData={handleUpdateMenuData}
              onUpdateMenuItem={handleUpdateMenuItem}
              onAddMenuItem={handleAddMenuItem}
              onDeleteMenuItem={handleDeleteMenuItem}
              onUpdateMenuItemImage={handleUpdateMenuItemImage}
              onUpdateLogo={handleUpdateLogo}
              onResetAllImagesToDefault={handleResetAllImagesToDefault}
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              staffAccounts={staffAccounts}
              onCreateStaff={handleCreateStaff}
              onDeleteStaff={handleDeleteStaff}
              activityLogs={activityLogs}
              storeSettings={storeSettings}
              onUpdateStoreSettings={handleUpdateStoreSettings}
              onLogout={() => {
                logActivity(currentUserRole === 'manager' ? MASTER_EMAIL : currentAdminEmail, 'تسجيل خروج');
                setCurrentUserRole('guest');
                setViewMode('customer');
              }}
            />
          </div>
        )}

        {/* Customer View */}
        {viewMode === 'customer' && (
          <div id="customer-view" className="flex-1 flex flex-col">
            {/* Step Stepper Progress Bar */}
            <StepProgressBar
              currentStep={currentStep}
              onSelectStep={(step) => {
                setCurrentStep(step);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              canNavigateTo={canNavigateTo}
            />

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
              {/* Step 1: Menu & Customer Ordering - Pure Clean Customer Interface */}
              {currentStep === 1 && (
                <div id="step-1" className="step active-step">
                  <MenuStep
                    brandName={brandName}
                    dishName={dishName}
                    productPrice={dishPrice}
                    productImg={dishImg}
                    menuItems={menuItems}
                    onSelectItem={(item) => setSelectedMenuItem(item)}
                    onQuickOrderHero={handleQuickOrderHero}
                    cart={cart}
                    onOpenCart={() => setIsCartOpen(true)}
                    onProceedToStep2={() => {
                      if (cart.length === 0) {
                        handleQuickOrderHero(menuItems[0] || MENU_ITEMS[0]);
                      } else {
                        setCurrentStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  />
                </div>
              )}

              {/* Step 2: Login / Account */}
              {currentStep === 2 && (
                <div id="step-2" className="step active-step">
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
                </div>
              )}

              {/* Step 3: Delivery Details & Address */}
              {currentStep === 3 && (
                <div id="step-3" className="step active-step">
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
                </div>
              )}

              {/* Step 4: Payment & Vodafone Cash Proof */}
              {currentStep === 4 && (
                <div id="step-4" className="step active-step">
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
                </div>
              )}

              {/* Step 5: Confirmation & Live Order Tracking */}
              {currentStep === 5 && activeOrder && (
                <div id="step-5" className="step active-step">
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
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Footer with customer links to customer service, delivery team, and privacy policy */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-8 text-center text-xs text-stone-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <h4 className="font-black text-sm text-stone-900">{brandName}</h4>
            <p className="text-[11px] text-stone-400 mt-0.5">
              الأصل في الكشري المصري الأصيل مع أسرع خدمة توصيل ساخنة
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSupportModalTab('contact');
                setIsSupportModalOpen(true);
              }}
              className="text-stone-700 hover:text-amber-800 transition-colors cursor-pointer"
            >
              📞 أرقام خدمة العملاء
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setSupportModalTab('delivery');
                setIsSupportModalOpen(true);
              }}
              className="text-stone-700 hover:text-amber-800 transition-colors cursor-pointer"
            >
              🚚 فريق التوصيل والطيارين
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setSupportModalTab('privacy');
                setIsSupportModalOpen(true);
              }}
              className="text-stone-700 hover:text-amber-800 transition-colors cursor-pointer"
            >
              📜 سياسة الخصوصية والشروط
            </button>
          </div>

          <div className="text-[11px] text-stone-400">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لـ {brandName}
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

      {/* Customer Support & Privacy Policy Modal */}
      <CustomerSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        settings={storeSettings}
        brandName={brandName}
        initialTab={supportModalTab}
      />
    </div>
  );
}
