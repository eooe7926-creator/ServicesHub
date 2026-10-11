import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  MessageCircle,
  Eye,
  CheckCircle2,
  Clock,
  CookingPot,
  Truck,
  TrendingUp,
  Receipt,
  FileImage,
  UtensilsCrossed,
  Tag,
  Users,
  Download,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  Printer,
  ChevronRight,
  Filter,
  DollarSign,
  Lock,
  Unlock,
  Package,
} from 'lucide-react';
import { Order, OrderStatus, MenuItem, PromoCode, RegisteredAccount } from '../types';
import { ThermalReceiptModal } from './ThermalReceiptModal';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder?: (orderId: string) => void;
  menuItems: MenuItem[];
  onUpdateMenuItems: (items: MenuItem[]) => void;
  promoCodes: PromoCode[];
  onUpdatePromoCodes: (codes: PromoCode[]) => void;
  registeredUsers: RegisteredAccount[];
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateStatus,
  onDeleteOrder,
  menuItems,
  onUpdateMenuItems,
  promoCodes,
  onUpdatePromoCodes,
  registeredUsers,
}) => {
  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('koshary_admin_authed') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'menu' | 'promos' | 'customers' | 'export'>('orders');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals inside Admin
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [selectedPrintOrder, setSelectedPrintOrder] = useState<Order | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Add Item form state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemNameEn, setNewItemNameEn] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<MenuItem['category']>('koshary');
  const [newItemPrice, setNewItemPrice] = useState<number>(50);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  // Add Promo form state
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percent' | 'fixed'>('percent');
  const [newPromoValue, setNewPromoValue] = useState<number>(10);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  if (!isOpen) return null;

  // Handle Admin PIN Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput.toLowerCase() === 'admin') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('koshary_admin_authed', 'true');
      setPinError(null);
    } else {
      setPinError('رمز المرور غير صحيح. جرب 1234');
    }
  };

  const handleQuickDemoAuth = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('koshary_admin_authed', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('koshary_admin_authed');
  };

  // Analytics Metrics
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const vodafoneCashSales = orders
    .filter((o) => o.paymentMethod === 'vodafone_cash' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const cashSales = orders
    .filter((o) => o.paymentMethod === 'cash_on_delivery' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (paymentFilter !== 'all' && order.paymentMethod !== paymentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.delivery.fullName.toLowerCase().includes(q);
      const matchPhone = order.delivery.phone.includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  // Helpers
  const formatWhatsappLink = (order: Order) => {
    let cleanPhone = order.delivery.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '2' + cleanPhone;
    }
    const message = encodeURIComponent(
      `أهلاً أستاذ ${order.delivery.fullName}، معكم إدارة مطعم كشري هاند بخصوص طلبكم ${order.orderNumber} بقيمة ${order.total} ج.م. حالتكم الحالية: ${
        order.status === 'preparing'
          ? 'قيد التجهيز في المطبخ 👨‍🍳'
          : order.status === 'on_the_way'
          ? 'خرج مع مندوب التوصيل 🛵'
          : 'تم استلام طلبكم بنجاح ✓'
      }`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // Menu Items Management
  const handleToggleItemAvailability = (itemId: string) => {
    const updated = menuItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, available: item.available === false ? true : false };
      }
      return item;
    });
    onUpdateMenuItems(updated);
  };

  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    if (newPrice < 1) return;
    const updated = menuItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, price: newPrice };
      }
      return item;
    });
    onUpdateMenuItems(updated);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      nameEn: newItemNameEn.trim() || 'New Item',
      category: newItemCategory,
      price: Number(newItemPrice) || 50,
      description: newItemDesc.trim() || 'طبق شهي ومميز من كشري هاند',
      image:
        newItemImage.trim() ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      popular: false,
      available: true,
      customizable: true,
    };

    onUpdateMenuItems([newItem, ...menuItems]);
    setIsAddingItem(false);
    setNewItemName('');
    setNewItemNameEn('');
    setNewItemPrice(50);
    setNewItemDesc('');
    setNewItemImage('');
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الصنف من القائمة؟')) {
      onUpdateMenuItems(menuItems.filter((i) => i.id !== itemId));
    }
  };

  // Promo Codes Management
  const handleTogglePromo = (code: string) => {
    const updated = promoCodes.map((p) => {
      if (p.code === code) {
        return { ...p, active: !p.active };
      }
      return p;
    });
    onUpdatePromoCodes(updated);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const code = newPromoCode.trim().toUpperCase();
    if (promoCodes.some((p) => p.code === code)) {
      alert('كود الخصم موجود بالفعل');
      return;
    }

    const newPromo: PromoCode = {
      code,
      type: newPromoType,
      value: Number(newPromoValue),
      active: true,
      description: newPromoDesc.trim() || `خصم ${newPromoValue}${newPromoType === 'percent' ? '%' : ' ج.م'}`,
    };

    onUpdatePromoCodes([...promoCodes, newPromo]);
    setIsAddingPromo(false);
    setNewPromoCode('');
    setNewPromoValue(10);
    setNewPromoDesc('');
  };

  // CSV Export
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('لا توجد طلبات للتصدير حالياً');
      return;
    }

    const headers = ['رقم الطلب', 'تاريخ الطلب', 'اسم العميل', 'رقم الهاتف', 'المنطقة', 'العنوان', 'طريقة الدفع', 'الإجمالي (ج.م)', 'الحالة'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleString('ar-EG'),
      `"${o.delivery.fullName}"`,
      `"${o.delivery.phone}"`,
      `"${o.delivery.area}"`,
      `"${o.delivery.street}"`,
      o.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'كاش عند الاستلام',
      o.total,
      o.status,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `koshary_hand_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      orders,
      menuItems,
      promoCodes,
      registeredUsers,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `koshary_hand_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* If Not Authenticated, Show Protected Admin Login */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-stone-900">
                تسجيل الدخول إلى لوحة إدارة كشري هاند
              </h3>
              <p className="text-xs text-stone-500 max-w-md">
                هذه اللوحة مخصصة لمدير المطعم، الكاشير، وطاقم المطبخ لمتابعة الطلبات وتعديل الأسعار وإدارة العمليات
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-stone-700 block">
                  أدخل رمز المرور السري (PIN):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(null);
                    }}
                    placeholder="رمز الدخول (مثال 1234)"
                    className="w-full text-center tracking-widest font-mono text-base pr-10 pl-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600"
                    autoFocus
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-red-600 font-bold text-center mt-1">
                    {pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition-colors"
              >
                تأكيد الدخول
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemoAuth}
                  className="w-full text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>دخول تجريبي سريع بنقرة واحدة (Demo Mode)</span>
                </button>
              </div>
            </form>

            <button
              onClick={onClose}
              className="text-xs text-stone-400 hover:text-stone-700 underline"
            >
              الرجوع إلى صفحة الطلبات والزبائن
            </button>
          </div>
        ) : (
          <>
            {/* Authenticated Admin Top Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg text-white">
                      لوحة المدير والعمليات · كشري هاند
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      متصل مباشر
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    التحكم الكامل بالطلبات، المطبخ، الأسعار، العروض، والتقارير
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdminLogout}
                  className="text-[11px] text-stone-400 hover:text-white px-2.5 py-1 rounded-lg border border-stone-700 hover:bg-stone-800 transition-colors"
                  title="تسجيل خروج المدير"
                >
                  قفل اللوحة
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex border-b border-stone-200 bg-stone-100 px-3 sm:px-5 gap-1.5 sm:gap-2 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <CookingPot className="w-4 h-4 text-amber-600" />
                <span>الطلبات والمطبخ</span>
                {activeOrdersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>المبيعات والإحصائيات</span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'menu'
                    ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <span>قائمة الطعام ({menuItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('promos')}
                className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'promos'
                    ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Tag className="w-4 h-4 text-purple-600" />
                <span>كوبونات الخصم ({promoCodes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'customers'
                    ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>سجل العملاء</span>
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'export'
                    ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Download className="w-4 h-4 text-stone-700" />
                <span>تصدير ونسخ احتياطي</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
              {/* 1. ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Filter controls strip */}
                  <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-stone-500 flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" />
                        <span>حالة الطلب:</span>
                      </span>
                      {[
                        { id: 'all', label: 'الكل' },
                        { id: 'received', label: 'جديد' },
                        { id: 'preparing', label: 'بالمطبخ' },
                        { id: 'on_the_way', label: 'مع الدليفري' },
                        { id: 'delivered', label: 'مكتمل' },
                        { id: 'cancelled', label: 'ملغي' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setStatusFilter(st.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                            statusFilter === st.id
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="بحث بالرقم أو اسم العميل..."
                        className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 w-44 sm:w-56"
                      />
                    </div>
                  </div>

                  {/* Orders Cards List */}
                  {filteredOrders.length === 0 ? (
                    <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-stone-200">
                      <Receipt className="w-12 h-12 mx-auto text-stone-300" />
                      <p className="font-bold text-stone-700 text-sm">لا توجد طلبات مطابقة للفلتر</p>
                      <p className="text-xs text-stone-400">
                        يمكنك تغيير خيارات البحث أو تصفية الحالة لرؤية الطلبات الأخرى
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => {
                        const statusColors: Record<OrderStatus, { bg: string; text: string; label: string }> = {
                          received: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-900', label: 'طلب جديد وارد' },
                          reviewing_payment: { bg: 'bg-blue-100 border-blue-300', text: 'text-blue-900', label: 'مراجعة الدفع' },
                          preparing: { bg: 'bg-orange-100 border-orange-300', text: 'text-orange-900', label: 'جاري التجهيز بالمطبخ' },
                          on_the_way: { bg: 'bg-purple-100 border-purple-300', text: 'text-purple-900', label: 'خرج مع مندوب التوصيل' },
                          delivered: { bg: 'bg-emerald-100 border-emerald-300', text: 'text-emerald-900', label: 'تم التسليم للعميل بنجاح' },
                          cancelled: { bg: 'bg-stone-200 border-stone-300', text: 'text-stone-600', label: 'طلب ملغي' },
                        };

                        const currStatus = statusColors[order.status] || statusColors.received;

                        return (
                          <div
                            key={order.id}
                            className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4 hover:border-amber-300 transition-colors"
                          >
                            {/* Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-black text-lg text-stone-900">
                                  {order.orderNumber}
                                </span>
                                <span className="text-xs text-stone-400 font-mono">
                                  {new Date(order.createdAt).toLocaleTimeString('ar-EG', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                <span
                                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currStatus.bg} ${currStatus.text}`}
                                >
                                  {currStatus.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                    order.paymentMethod === 'vodafone_cash'
                                      ? 'bg-red-50 text-red-700 border border-red-200'
                                      : order.paymentMethod === 'instapay'
                                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  }`}
                                >
                                  {order.paymentMethod === 'vodafone_cash'
                                    ? 'فودافون كاش'
                                    : order.paymentMethod === 'instapay'
                                    ? 'إنستاباي'
                                    : 'كاش عند الاستلام'}
                                </span>
                                <span className="font-mono font-black text-lg text-amber-700">
                                  {order.total} ج.م
                                </span>
                              </div>
                            </div>

                            {/* Customer & Address details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
                              <div className="space-y-1.5">
                                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                  <span>العميل:</span>
                                  <span className="text-amber-950 font-black">{order.delivery.fullName}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <a
                                    href={`tel:${order.delivery.phone}`}
                                    className="inline-flex items-center gap-1 font-mono text-stone-800 hover:text-amber-700 bg-white px-2.5 py-1 rounded-lg border border-stone-200"
                                  >
                                    <Phone className="w-3 h-3 text-amber-600" />
                                    <span>{order.delivery.phone}</span>
                                  </a>
                                  <a
                                    href={formatWhatsappLink(order)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>واتساب العميل</span>
                                  </a>
                                </div>
                              </div>

                              <div className="space-y-1 text-stone-600">
                                <div>
                                  <strong className="text-stone-800">العنوان:</strong> {order.delivery.area} - {order.delivery.street} (عمارة {order.delivery.building}، شقة {order.delivery.apartment})
                                </div>
                                {order.delivery.deliveryNotes && (
                                  <div className="text-amber-800 bg-amber-50/70 p-1 rounded font-medium">
                                    ملاحظات: {order.delivery.deliveryNotes}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Items list */}
                            <div className="space-y-1.5">
                              <div className="text-[11px] font-bold text-stone-500">محتويات الوجبة:</div>
                              <div className="flex flex-wrap gap-2">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs bg-stone-100 text-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-200 flex items-center gap-1.5"
                                  >
                                    <span className="font-mono font-bold text-amber-800">{item.quantity}×</span>
                                    <span>{item.menuItem.name}</span>
                                    <span className="text-[10px] text-stone-500">({item.options.sizeName})</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Bottom Actions: Screenshot preview, print receipt, status progression */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Print Thermal Receipt */}
                                <button
                                  onClick={() => {
                                    setSelectedPrintOrder(order);
                                    setIsPrintModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-3 py-1.5 rounded-xl border border-stone-200 transition-colors"
                                >
                                  <Printer className="w-3.5 h-3.5 text-stone-600" />
                                  <span>طباعة الفاتورة</span>
                                </button>

                                {/* Vodafone Cash Receipt Screenshot */}
                                {order.paymentScreenshot && (
                                  <button
                                    onClick={() => setSelectedScreenshot(order.paymentScreenshot || null)}
                                    className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-800 font-bold px-3 py-1.5 rounded-xl border border-red-200 transition-colors"
                                  >
                                    <FileImage className="w-3.5 h-3.5 text-red-600" />
                                    <span>معاينة إيصال كاش</span>
                                  </button>
                                )}
                              </div>

                              {/* Quick Status Changers */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] text-stone-500">تحديث المرحلة:</span>
                                {order.status !== 'preparing' && order.status !== 'delivered' && (
                                  <button
                                    onClick={() => onUpdateStatus(order.id, 'preparing')}
                                    className="bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold px-2.5 py-1 rounded-lg border border-orange-200 transition-colors"
                                  >
                                    👨‍🍳 إرسال للمطبخ
                                  </button>
                                )}

                                {order.status !== 'on_the_way' && order.status !== 'delivered' && (
                                  <button
                                    onClick={() => onUpdateStatus(order.id, 'on_the_way')}
                                    className="bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
                                  >
                                    🛵 مع الدليفري
                                  </button>
                                )}

                                {order.status !== 'delivered' && (
                                  <button
                                    onClick={() => onUpdateStatus(order.id, 'delivered')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg shadow-xs transition-colors"
                                  >
                                    ✓ تم التوصيل
                                  </button>
                                )}

                                {onDeleteOrder && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                                        onDeleteOrder(order.id);
                                      }
                                    }}
                                    className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"
                                    title="حذف الطلب"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 2. ANALYTICS TAB */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Top 4 KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
                      <div className="text-xs text-stone-500 font-medium">إجمالي المبيعات</div>
                      <div className="font-mono font-black text-2xl text-amber-700">{totalSales} ج.م</div>
                      <div className="text-[10px] text-emerald-600 font-bold">من جميع الطلبات الناجحة</div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
                      <div className="text-xs text-stone-500 font-medium">عدد الطلبات الواردة</div>
                      <div className="font-mono font-black text-2xl text-stone-900">{orders.length}</div>
                      <div className="text-[10px] text-stone-500">{deliveredCount} طلب مكتمل ومسلّم</div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
                      <div className="text-xs text-stone-500 font-medium">طلبات جارية بالمطبخ</div>
                      <div className="font-mono font-black text-2xl text-orange-600">{activeOrdersCount}</div>
                      <div className="text-[10px] text-orange-600 font-bold">تحتاج لمتابعة فورية</div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1">
                      <div className="text-xs text-stone-500 font-medium">متوسط قيمة الطلب (AOV)</div>
                      <div className="font-mono font-black text-2xl text-purple-700">{avgOrderValue} ج.م</div>
                      <div className="text-[10px] text-stone-500">لكل وجبة مباعة</div>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-black text-sm text-stone-900">توزيع المبيعات حسب طريقة الدفع</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-red-900">فودافون كاش (تحويل إلكتروني)</span>
                          <span className="font-mono font-black text-red-700">{vodafoneCashSales} ج.م</span>
                        </div>
                        <div className="w-full bg-red-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-red-600 h-full rounded-full"
                            style={{
                              width: `${totalSales > 0 ? (vodafoneCashSales / totalSales) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <p className="text-[11px] text-red-800">
                          نسبة {totalSales > 0 ? Math.round((vodafoneCashSales / totalSales) * 100) : 0}% من إجمالي المبيعات
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-emerald-900">كاش عند الاستلام (COD)</span>
                          <span className="font-mono font-black text-emerald-700">{cashSales} ج.م</span>
                        </div>
                        <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{
                              width: `${totalSales > 0 ? (cashSales / totalSales) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <p className="text-[11px] text-emerald-800">
                          نسبة {totalSales > 0 ? Math.round((cashSales / totalSales) * 100) : 0}% من إجمالي المبيعات
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. MENU ITEMS TAB */}
              {activeTab === 'menu' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-stone-900">إدارة أصناف المنيو وتوفرها</h4>
                      <p className="text-xs text-stone-500">
                        يمكنك تعديل الأسعار أو تبديل توفر الصنف في المطبخ فوراً
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingItem(!isAddingItem)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة وجبة جديدة</span>
                    </button>
                  </div>

                  {/* Add New Item Form */}
                  {isAddingItem && (
                    <form
                      onSubmit={handleCreateNewItem}
                      className="bg-white p-5 rounded-2xl border border-amber-200 shadow-md space-y-4"
                    >
                      <div className="font-bold text-xs text-amber-900">بيانات الوجبة أو الصنف الجديد:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-stone-700 mb-1">اسم الصنف (بالعربية)*</label>
                          <input
                            type="text"
                            required
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="مثال: كشري فوكس سوبر"
                            className="w-full p-2 rounded-lg border border-stone-300"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 mb-1">الاسم بالإنجليزي</label>
                          <input
                            type="text"
                            value={newItemNameEn}
                            onChange={(e) => setNewItemNameEn(e.target.value)}
                            placeholder="Fox Super Bowl"
                            className="w-full p-2 rounded-lg border border-stone-300"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 mb-1">السعر (ج.م)*</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-stone-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-stone-700 mb-1">التصنيف</label>
                          <select
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value as any)}
                            className="w-full p-2 rounded-lg border border-stone-300"
                          >
                            <option value="koshary">كشري (Koshary)</option>
                            <option value="tajin">طواجن فرن (Tajin)</option>
                            <option value="extras">إضافات وصوصات (Extras)</option>
                            <option value="dessert">حلويات (Desserts)</option>
                            <option value="drinks">مشروبات (Drinks)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-stone-700 mb-1">رابط الصورة (اختياري)</label>
                          <input
                            type="url"
                            value={newItemImage}
                            onChange={(e) => setNewItemImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full p-2 rounded-lg border border-stone-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-stone-700 mb-1">الوصف والمكونات</label>
                        <input
                          type="text"
                          value={newItemDesc}
                          onChange={(e) => setNewItemDesc(e.target.value)}
                          placeholder="مكرونة وأرز وعدس بجبة مع تقلية مقرمشة وصلصة كشري هاند..."
                          className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setIsAddingItem(false)}
                          className="px-3.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700"
                        >
                          حفظ وإضافة للصالة
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Menu Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {menuItems.map((item) => {
                      const isAvailable = item.available !== false;
                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isAvailable
                              ? 'bg-white border-stone-200'
                              : 'bg-stone-100 border-stone-300 opacity-70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                            />
                            <div className="space-y-0.5">
                              <div className="font-bold text-xs text-stone-900 flex items-center gap-2">
                                <span>{item.name}</span>
                                {!isAvailable && (
                                  <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    نفذ من المطبخ
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-500 line-clamp-1">{item.description}</p>
                              <div className="flex items-center gap-2 pt-1 text-xs">
                                <span className="font-bold text-amber-800">السعر:</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.price}
                                  onChange={(e) => handleUpdateItemPrice(item.id, Number(e.target.value))}
                                  className="w-16 font-mono font-bold text-xs px-1.5 py-0.5 rounded border border-stone-200 text-center"
                                />
                                <span className="text-[11px] text-stone-500">ج.م</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <button
                              onClick={() => handleToggleItemAvailability(item.id)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                                isAvailable
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
                              }`}
                            >
                              {isAvailable ? 'متوفر ✓' : 'غير متوفر ✕'}
                            </button>

                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-stone-400 hover:text-red-600 p-1"
                              title="حذف الصنف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. PROMO CODES TAB */}
              {activeTab === 'promos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-stone-900">كوبونات الخصم والعروض الترويجية</h4>
                      <p className="text-xs text-stone-500">
                        أنشئ أكواد خصم يكتبها الزبائن في السلة للحصول على تخفيض
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingPromo(!isAddingPromo)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة كود جديد</span>
                    </button>
                  </div>

                  {isAddingPromo && (
                    <form
                      onSubmit={handleCreatePromo}
                      className="bg-white p-5 rounded-2xl border border-amber-200 shadow-md space-y-4 text-xs"
                    >
                      <div className="font-bold text-amber-900">إضافة كوبون خصم جديد:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-stone-700 mb-1">رمز الكود (بالإنجليزية)*</label>
                          <input
                            type="text"
                            required
                            value={newPromoCode}
                            onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                            placeholder="مثال: SUMMER20"
                            className="w-full p-2 rounded-lg border border-stone-300 font-mono uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 mb-1">نوع الخصم</label>
                          <select
                            value={newPromoType}
                            onChange={(e) => setNewPromoType(e.target.value as any)}
                            className="w-full p-2 rounded-lg border border-stone-300"
                          >
                            <option value="percent">نسبة مئوية (%)</option>
                            <option value="fixed">مبلغ ثابت (ج.م)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-stone-700 mb-1">القيمة*</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={newPromoValue}
                            onChange={(e) => setNewPromoValue(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-stone-300"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingPromo(false)}
                          className="px-3.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700"
                        >
                          تفعيل الكوبون
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {promoCodes.map((promo) => (
                      <div
                        key={promo.code}
                        className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2 relative"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-black text-sm tracking-wide text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            {promo.code}
                          </span>
                          <button
                            onClick={() => handleTogglePromo(promo.code)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              promo.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {promo.active ? 'نشط' : 'معطل'}
                          </button>
                        </div>
                        <div className="text-xs font-bold text-stone-900">
                          {promo.type === 'percent' ? `خصم ${promo.value}٪` : `خصم ${promo.value} ج.م`}
                        </div>
                        <p className="text-[11px] text-stone-500">{promo.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. CUSTOMERS DIRECTORY TAB */}
              {activeTab === 'customers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-stone-900">سجل العملاء والمستخدمين</h4>
                      <p className="text-xs text-stone-500">
                        قائمة بالزبائن المسجلين وتاريخ مشترياتهم
                      </p>
                    </div>
                    <span className="text-xs text-stone-500 font-bold bg-white px-3 py-1 rounded-xl border border-stone-200">
                      إجمالي العملاء: {registeredUsers.length}
                    </span>
                  </div>

                  {registeredUsers.length === 0 ? (
                    <div className="py-12 text-center text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
                      لا يوجد عملاء مسجلون بعد
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {registeredUsers.map((cust) => {
                        let cleanPhone = cust.phone.replace(/[^0-9]/g, '');
                        if (cleanPhone.startsWith('0')) cleanPhone = '2' + cleanPhone;

                        return (
                          <div
                            key={cust.id}
                            className="bg-white p-3.5 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="font-bold text-stone-900 flex items-center gap-2">
                                <span>{cust.fullName}</span>
                                <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                                  {cust.provider === 'google'
                                    ? 'حساب جوجل'
                                    : cust.provider === 'phone'
                                    ? 'هاتف'
                                    : cust.provider === 'guest'
                                    ? 'زائر'
                                    : 'إيميل'}
                                </span>
                              </div>
                              <div className="text-stone-500 flex items-center gap-3 text-[11px]">
                                <span>{cust.phone || 'بدون هاتف'}</span>
                                <span>·</span>
                                <span>{cust.email || 'بدون بريد'}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-left font-mono">
                                <div className="font-bold text-amber-800">{cust.totalSpent} ج.م</div>
                                <div className="text-[10px] text-stone-400">{cust.totalOrdersCount} طلبات</div>
                              </div>
                              {cust.phone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-xl border border-emerald-200"
                                  title="مراسلة واتساب"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 6. EXPORT & BACKUP TAB */}
              {activeTab === 'export' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 text-xs">
                    <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-600" />
                      <span>تصدير تقارير المبيعات والنسخ الاحتياطي</span>
                    </h4>
                    <p className="text-stone-600 leading-relaxed">
                      يمكنك تنزيل بيانات الطلبات الحالية بملف Excel (CSV) لمراجعة الحسابات، أو تصدير قاعدة البيانات بالكامل مجاناً للحفظ على جهازك.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={handleExportCSV}
                        className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-900 font-bold flex flex-col items-center gap-2 transition-colors text-center"
                      >
                        <FileImage className="w-6 h-6 text-emerald-700" />
                        <span>تصدير ملف Excel / CSV للطلبات</span>
                        <span className="text-[10px] font-normal text-emerald-700">
                          يحتوي على كافة الحسابات والعناوين
                        </span>
                      </button>

                      <button
                        onClick={handleExportJSON}
                        className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 font-bold flex flex-col items-center gap-2 transition-colors text-center"
                      >
                        <Package className="w-6 h-6 text-amber-700" />
                        <span>تصدير نسخة احتياطية كاملة (JSON)</span>
                        <span className="text-[10px] font-normal text-amber-700">
                          تشمل الطلبات والأصناف وقاعدة الزبائن
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Footer */}
            <div className="p-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>نظام إدارة كشري هاند · متاح للعمل بدون اشتراك أو مصاريف دورية</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-colors"
              >
                إغلاق اللوحة
              </button>
            </div>
          </>
        )}

        {/* Screenshot preview modal */}
        {selectedScreenshot && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-stone-800">إيصال تحويل فودافون كاش</span>
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-1 text-stone-500 hover:text-stone-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-stone-100 rounded-xl p-2">
                <img
                  src={selectedScreenshot}
                  alt="إيصال كاش"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="w-full bg-stone-900 text-white text-xs font-bold py-2 rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

        {/* Thermal Receipt Print Modal */}
        <ThermalReceiptModal
          isOpen={isPrintModalOpen}
          order={selectedPrintOrder}
          onClose={() => {
            setIsPrintModalOpen(false);
            setSelectedPrintOrder(null);
          }}
        />
      </div>
    </div>
  );
};
