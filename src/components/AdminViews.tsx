import React, { useState, useMemo } from 'react';
import {
  Lock,
  ShieldCheck,
  Store,
  DollarSign,
  Image as ImageIcon,
  ArrowRight,
  LogOut,
  Phone,
  MessageCircle,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  ShieldAlert,
  History,
  KeyRound,
  Trash2,
  UserCheck,
  Plus,
  Truck,
  FileText,
  TrendingUp,
  BarChart3,
  Layers,
  Camera,
  Edit,
  Save,
  RotateCcw,
  MapPin,
  Check,
} from 'lucide-react';
import {
  Order,
  OrderStatus,
  UserRole,
  StaffAccount,
  StaffPermissions,
  ActivityLog,
  MenuItem,
  CategoryId,
  StoreSettings,
  DeliverySpecialist,
} from '../types';
import { EasyImagePicker } from './EasyImagePicker';

export const MASTER_EMAIL = 'vibersvge@gmail.com';
export const MASTER_PASS = 'eE2001257@';

interface AdminLoginProps {
  onLoginSuccess: (role: UserRole, permissions: StaffPermissions, userEmail: string) => void;
  onCancel: () => void;
  staffAccounts: StaffAccount[];
  onLogActivity: (user: string, action: string) => void;
}

export const AdminLoginView: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onCancel,
  staffAccounts,
  onLogActivity,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (cleanEmail === MASTER_EMAIL && cleanPass === MASTER_PASS) {
      // Manager login
      onLogActivity(cleanEmail, 'تسجيل دخول [مدير النظام]');
      onLoginSuccess('manager', { menu: true, orders: true }, cleanEmail);
    } else {
      // Search in staff accounts
      const staff = staffAccounts.find((s) => s.email === cleanEmail && s.pass === cleanPass);
      if (staff) {
        onLogActivity(cleanEmail, 'تسجيل دخول [عامل]');
        onLoginSuccess('staff', staff.permissions, cleanEmail);
      } else {
        setError('عذراً، البريد الإلكتروني أو كلمة المرور غير صحيحة!');
        onLogActivity(cleanEmail || 'مجهول', 'محاولة دخول فاشلة ❌');
      }
    }
  };

  const handleFillManagerCredentials = () => {
    setEmail(MASTER_EMAIL);
    setPassword(MASTER_PASS);
    setError(null);
  };

  const handleFillStaffCredentials = () => {
    if (staffAccounts.length > 0) {
      setEmail(staffAccounts[0].email);
      setPassword(staffAccounts[0].pass);
    } else {
      setEmail('staff@kosharyhand.com');
      setPassword('staff123');
    }
    setError(null);
  };

  return (
    <div id="admin-login-view" className="max-w-md mx-auto py-8 px-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-amber-500 shadow-2xl p-6 sm:p-8 space-y-5 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-stone-900">تسجيل دخول طاقم المطعم</h2>
          <p style={{ fontSize: '12px', color: '#666' }}>
            سجل الدخول بحساب المدير للتحكم الكامل، أو بحسابات العمال المصرح لهم.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2 text-right">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="admin-email">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="البريد الإلكتروني"
              className="w-full text-xs px-3.5 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="admin-pass">
              كلمة المرور
            </label>
            <input
              type="password"
              id="admin-pass"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="كلمة المرور"
              className="w-full text-xs px-3.5 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors cursor-pointer text-sm"
          >
            دخول للنظام
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{ background: '#777', marginTop: '10px' }}
            className="w-full text-white font-bold py-2.5 px-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer text-xs"
          >
            إلغاء والعودة للمتجر
          </button>
        </form>

        {/* Quick Credentials Helpers for instant testing */}
        <div className="pt-3 border-t border-stone-100 space-y-2 text-right">
          <span className="text-[11px] text-stone-400 block text-center">أزرار التجربة السريعة للحسابات:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillManagerCredentials}
              className="text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg border border-red-200 transition-colors cursor-pointer text-center"
            >
              👑 تجربة حساب المدير
            </button>
            <button
              type="button"
              onClick={handleFillStaffCredentials}
              className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg border border-emerald-200 transition-colors cursor-pointer text-center"
            >
              👷 تجربة حساب عامل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface AdminDashboardProps {
  currentUserRole: UserRole;
  currentStaffPermissions: StaffPermissions;
  currentAdminEmail: string;
  brandName: string;
  logoUrl: string;
  dishName: string;
  dishPrice: number;
  dishImg: string;
  menuItems: MenuItem[];
  onUpdateMenuData: (data: {
    brandName: string;
    logoUrl: string;
    dishName: string;
    dishPrice: number;
    dishImg: string;
  }) => void;
  onUpdateMenuItem: (updatedItem: MenuItem) => void;
  onAddMenuItem: (newItem: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
  onUpdateMenuItemImage: (itemId: string, newUrl: string) => void;
  onUpdateLogo: (newUrl: string) => void;
  onResetAllImagesToDefault: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  staffAccounts: StaffAccount[];
  onCreateStaff: (staff: StaffAccount) => void;
  onDeleteStaff: (staffId: string) => void;
  activityLogs: ActivityLog[];
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (newSettings: StoreSettings) => void;
  onLogout: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardProps> = ({
  currentUserRole,
  currentStaffPermissions,
  currentAdminEmail,
  brandName,
  logoUrl,
  dishName,
  dishPrice,
  dishImg,
  menuItems,
  onUpdateMenuData,
  onUpdateMenuItem,
  onAddMenuItem,
  onDeleteMenuItem,
  onUpdateMenuItemImage,
  onUpdateLogo,
  onResetAllImagesToDefault,
  orders,
  onUpdateOrderStatus,
  staffAccounts,
  onCreateStaff,
  onDeleteStaff,
  activityLogs,
  storeSettings,
  onUpdateStoreSettings,
  onLogout,
}) => {
  const isManager = currentUserRole === 'manager';
  const canEditMenu = isManager || currentStaffPermissions.menu;
  const canViewOrders = isManager || currentStaffPermissions.orders;

  // Active Tab
  type AdminTab = 'menu' | 'images' | 'sales' | 'orders' | 'support' | 'policy' | 'staff' | 'logs';
  const [activeTab, setActiveTab] = useState<AdminTab>(isManager ? 'menu' : canEditMenu ? 'menu' : 'orders');

  // Brand and Signature Dish Edit state
  const [editBrandName, setEditBrandName] = useState(brandName);
  const [editLogoUrl, setEditLogoUrl] = useState(logoUrl);
  const [editDishName, setEditDishName] = useState(dishName);
  const [editDishPrice, setEditDishPrice] = useState<number>(dishPrice);
  const [editDishImg, setEditDishImg] = useState(dishImg);

  // New Dish Form state (وضع مأكولات جديدة)
  const [isAddingNewDish, setIsAddingNewDish] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState<number>(40);
  const [newDishCategory, setNewDishCategory] = useState<CategoryId>('koshary');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImg, setNewDishImg] = useState('');
  const [newDishServing, setNewDishServing] = useState('حجم وسط');
  const [newDishCalories, setNewDishCalories] = useState<number>(500);

  // Editing existing dish modal/inline
  const [editingDishItem, setEditingDishItem] = useState<MenuItem | null>(null);

  // Selected item for image control tab
  const [selectedImageTarget, setSelectedImageTarget] = useState<string>('logo'); // 'logo' | itemId

  // Store Settings (خدمة العملاء، التوصيل، السياسة)
  const [editCsPhone, setEditCsPhone] = useState(storeSettings.customerServicePhone);
  const [editCsWhatsapp, setEditCsWhatsapp] = useState(storeSettings.customerServiceWhatsapp);
  const [editDeliveryManagerPhone, setEditDeliveryManagerPhone] = useState(storeSettings.deliveryManagerPhone);
  const [editPrivacyPolicy, setEditPrivacyPolicy] = useState(storeSettings.privacyPolicy);
  const [editTermsOfService, setEditTermsOfService] = useState(storeSettings.termsOfService);

  // New Delivery Specialist
  const [isAddingSpecialist, setIsAddingSpecialist] = useState(false);
  const [specName, setSpecName] = useState('');
  const [specPhone, setSpecPhone] = useState('');
  const [specArea, setSpecArea] = useState('وسط البلد / التحرير');
  const [specVehicle, setSpecVehicle] = useState('موتوسيكل');

  // New staff form state
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [permMenu, setPermMenu] = useState(true);
  const [permOrders, setPermOrders] = useState(true);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sales Analytics Calculations
  const salesStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const deliveredOrders = orders.filter((o) => o.status === 'delivered');
    const preparingOrders = orders.filter((o) => o.status === 'preparing' || o.status === 'on_the_way');
    const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

    // Item sales breakdown
    const itemSales: Record<string, { name: string; count: number; totalRev: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const id = item.menuItem.id;
        if (!itemSales[id]) {
          itemSales[id] = { name: item.menuItem.name, count: 0, totalRev: 0 };
        }
        itemSales[id].count += item.quantity;
        itemSales[id].totalRev += item.itemTotal;
      });
    });

    const bestSellers = Object.values(itemSales).sort((a, b) => b.totalRev - a.totalRev);

    return {
      totalRevenue,
      totalOrders: orders.length,
      deliveredCount: deliveredOrders.length,
      preparingCount: preparingOrders.length,
      avgOrderValue,
      bestSellers,
    };
  }, [orders]);

  // Handle Save Brand & Signature Dish
  const handleSaveBrandInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMenuData({
      brandName: editBrandName.trim() || 'كشري هاند',
      logoUrl: editLogoUrl.trim() || logoUrl,
      dishName: editDishName.trim() || dishName,
      dishPrice: Number(editDishPrice) || 55,
      dishImg: editDishImg.trim() || dishImg,
    });
    showToast('تم حفظ وتحديث بيانات البراند والأكلة الرئيسية فوراً!');
  };

  // Handle Add New Meal (وضع مأكولات)
  const handleAddNewMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) {
      alert('يرجى إدخال اسم الوجبة.');
      return;
    }

    const newItem: MenuItem = {
      id: `dish-custom-${Date.now()}`,
      name: newDishName.trim(),
      nameEn: newDishName.trim(),
      category: newDishCategory,
      price: Number(newDishPrice) || 30,
      description: newDishDesc.trim() || 'وجبة طازجة وشهية من كشري هاند',
      image: newDishImg.trim(),
      servingSize: newDishServing.trim() || 'حجم عادي',
      calories: Number(newDishCalories) || 500,
      customizable: newDishCategory === 'koshary' || newDishCategory === 'tajin',
    };

    onAddMenuItem(newItem);
    setNewDishName('');
    setNewDishPrice(40);
    setNewDishDesc('');
    setNewDishImg('');
    setIsAddingNewDish(false);
    showToast(`تمت إضافة الوجبة الجديدة "${newItem.name}" للمنيو بنجاح!`);
  };

  // Handle Save Edited Dish
  const handleSaveEditedDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDishItem) return;
    onUpdateMenuItem(editingDishItem);
    setEditingDishItem(null);
    showToast(`تم تحديث بيانات الوجبة "${editingDishItem.name}" بنجاح!`);
  };

  // Handle Delete Meal (إزالة مأكولات)
  const handleDeleteMealClick = (item: MenuItem) => {
    if (window.confirm(`هل أنت متأكد تماماً من إزالة وحذف الوجبة "${item.name}" من المنيو؟`)) {
      onDeleteMenuItem(item.id);
      showToast(`تم حذف الوجبة "${item.name}" من المنيو.`);
    }
  };

  // Handle Save Store Contacts & Delivery
  const handleSaveStoreContacts = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreSettings({
      ...storeSettings,
      customerServicePhone: editCsPhone.trim(),
      customerServiceWhatsapp: editCsWhatsapp.trim(),
      deliveryManagerPhone: editDeliveryManagerPhone.trim(),
    });
    showToast('تم تحديث أرقام خدمة العملاء والتوصيل بنجاح!');
  };

  // Handle Add Delivery Specialist
  const handleAddDeliverySpecialist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specName.trim() || !specPhone.trim()) {
      alert('يرجى إدخال اسم ورقم هاتف الطيار.');
      return;
    }

    const newSpec: DeliverySpecialist = {
      id: `spec-${Date.now()}`,
      name: specName.trim(),
      phone: specPhone.trim(),
      area: specArea.trim(),
      vehicle: specVehicle.trim(),
      isAvailable: true,
    };

    const updated = [...(storeSettings.deliverySpecialists || []), newSpec];
    onUpdateStoreSettings({
      ...storeSettings,
      deliverySpecialists: updated,
    });

    setSpecName('');
    setSpecPhone('');
    setIsAddingSpecialist(false);
    showToast(`تمت إضافة الطيار "${newSpec.name}" لفريق التوصيل بنجاح!`);
  };

  // Handle Remove Delivery Specialist
  const handleRemoveSpecialist = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الطيار "${name}"؟`)) {
      const updated = (storeSettings.deliverySpecialists || []).filter((s) => s.id !== id);
      onUpdateStoreSettings({
        ...storeSettings,
        deliverySpecialists: updated,
      });
      showToast(`تم حذف الطيار "${name}" من القائمة.`);
    }
  };

  // Handle Toggle Specialist Availability
  const handleToggleSpecialistStatus = (id: string) => {
    const updated = (storeSettings.deliverySpecialists || []).map((s) => {
      if (s.id === id) return { ...s, isAvailable: !s.isAvailable };
      return s;
    });
    onUpdateStoreSettings({
      ...storeSettings,
      deliverySpecialists: updated,
    });
  };

  // Handle Save Privacy Policy
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreSettings({
      ...storeSettings,
      privacyPolicy: editPrivacyPolicy.trim(),
      termsOfService: editTermsOfService.trim(),
    });
    showToast('تم حفظ وتحديث نصوص سياسة الخصوصية وشروط الخدمة بنجاح!');
  };

  // Handle Create Staff
  const handleCreateNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail.trim() || !newStaffPass.trim()) {
      alert('يرجى كتابة البريد وكلمة المرور للعامل.');
      return;
    }

    const newAccount: StaffAccount = {
      id: `staff-${Date.now()}`,
      email: newStaffEmail.trim(),
      pass: newStaffPass.trim(),
      permissions: { menu: permMenu, orders: permOrders },
      createdAt: new Date().toLocaleTimeString('ar-EG'),
    };

    onCreateStaff(newAccount);
    setNewStaffEmail('');
    setNewStaffPass('');
    setPermMenu(true);
    setPermOrders(true);
    showToast(`تم إنشاء حساب العامل ${newAccount.email} وتحديد الصلاحيات بنجاح!`);
  };

  // Current item being configured in Image Management Tab
  const activeImageItem = useMemo(() => {
    if (selectedImageTarget === 'logo') {
      return {
        id: 'logo',
        title: 'شعار المطعم (Logo)',
        currentUrl: logoUrl,
        category: 'logo' as const,
      };
    }
    if (selectedImageTarget === 'hero') {
      return {
        id: 'hero',
        title: `الطبق الرئيسي المميز (${dishName})`,
        currentUrl: dishImg,
        category: 'koshary' as const,
      };
    }
    const found = menuItems.find((i) => i.id === selectedImageTarget);
    return found
      ? {
          id: found.id,
          title: found.name,
          currentUrl: found.image,
          category: (found.category as any) || 'all',
        }
      : {
          id: 'logo',
          title: 'شعار المطعم (Logo)',
          currentUrl: logoUrl,
          category: 'logo' as const,
        };
  }, [selectedImageTarget, logoUrl, dishImg, dishName, menuItems]);

  return (
    <div id="admin-dashboard-view" className="max-w-6xl mx-auto py-6 px-4 space-y-6 text-right animate-in fade-in duration-200">
      {/* Top Header & Role Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 m-0">لوحة تحكم إدارة المطعم</h2>
              <span
                id="user-role-badge"
                className={`badge px-3 py-1 rounded-md text-xs font-bold text-white ${
                  isManager ? 'badge-manager bg-red-600' : 'badge-staff bg-emerald-600'
                }`}
              >
                {isManager ? '👑 مدير النظام (كامل الصلاحيات الفنية والإدارية)' : '👷 حساب عامل (صلاحيات مخصصة)'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              المستخدم النشط: <strong className="font-mono text-stone-800">{currentAdminEmail}</strong>
              {isManager && ' · المخول الوحيد بتغيير الصور والأسعار وإدارة المأكولات وسياسة الخصوصية'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            style={{ background: '#555' }}
            className="text-white font-bold py-2.5 px-4 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 text-xs cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج والعودة للمتجر</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab Navigation Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 no-scrollbar text-xs font-bold">
        {canEditMenu && (
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>🍔 المأكولات والمنيو ({menuItems.length})</span>
          </button>
        )}

        {isManager && (
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'images'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📸 لوحة تحكم الصور والشعار</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('sales')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sales'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 المبيعات والتقارير ({salesStats.totalRevenue} ج.م)</span>
        </button>

        {canViewOrders && (
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>📦 طلبات العملاء ({orders.length})</span>
          </button>
        )}

        {isManager && (
          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'support'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>📞 خدمة العملاء والتوصيل</span>
          </button>
        )}

        {isManager && (
          <button
            type="button"
            onClick={() => setActiveTab('policy')}
            className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'policy'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📜 سياسة الخصوصية والشروط</span>
          </button>
        )}

        {isManager && (
          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'staff'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👥 حسابات العمال ({staffAccounts.length})</span>
          </button>
        )}

        {isManager && (
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>🛡️ سجل النشاطات</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MENU & DISHES MANAGEMENT (وضع أو إزالة مأكولات وتغيير الأسماء والأسعار) */}
      {/* ========================================================================= */}
      {activeTab === 'menu' && canEditMenu && (
        <div className="space-y-6 animate-in fade-in">
          {/* Quick Actions Bar */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-stone-900 m-0">إدارة مأكولات المنيو والأسعار</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                يمكنك وضع مأكولات جديدة، أو إزالة أي وجبة من المنيو، أو تعديل الأسماء والأسعار
              </p>
            </div>

            {isManager && (
              <button
                type="button"
                onClick={() => setIsAddingNewDish(!isAddingNewDish)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingNewDish ? 'إغلاق نموذج الإضافة' : '➕ وضع وجبة جديدة في المنيو'}</span>
              </button>
            )}
          </div>

          {/* Form: Add New Meal (وضع مأكولات جديدة) */}
          {isAddingNewDish && isManager && (
            <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-6 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm text-stone-900">إضافة وجبة جديدة للمنيو</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingNewDish(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                >
                  إلغاء ✕
                </button>
              </div>

              <form onSubmit={handleAddNewMealSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">اسم الوجبة:</label>
                    <input
                      type="text"
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      placeholder="مثال: طاجن كبدة إسكندراني"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">سعر الوجبة (ج.م):</label>
                    <input
                      type="number"
                      value={newDishPrice}
                      onChange={(e) => setNewDishPrice(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">التصنيف:</label>
                    <select
                      value={newDishCategory}
                      onChange={(e) => setNewDishCategory(e.target.value as CategoryId)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-bold"
                    >
                      <option value="koshary">كشري هاند</option>
                      <option value="tajin">طواجن الفرن</option>
                      <option value="extras">الإضافات والصوصات</option>
                      <option value="dessert">حلو بلدي</option>
                      <option value="drinks">مشروبات</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">وصف الوجبة ومكوناتها:</label>
                  <textarea
                    rows={2}
                    value={newDishDesc}
                    onChange={(e) => setNewDishDesc(e.target.value)}
                    placeholder="اكتب وصفاً جذاباً للوجبة والمكونات المرفقة..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">حجم الوجبة:</label>
                    <input
                      type="text"
                      value={newDishServing}
                      onChange={(e) => setNewDishServing(e.target.value)}
                      placeholder="مثال: حجم سوبر / يكفي شخصين"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">السعرات الحرارية التقريبية:</label>
                    <input
                      type="number"
                      value={newDishCalories}
                      onChange={(e) => setNewDishCalories(Number(e.target.value))}
                      placeholder="مثال: 650"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Optional Image Picker for new dish */}
                <div>
                  <EasyImagePicker
                    label="صورة الوجبة (اختياري - يمكنك وضع صورة أو تركها)"
                    currentImageUrl={newDishImg}
                    onImageChange={(url) => setNewDishImg(url)}
                    filterPresetCategory={newDishCategory}
                    helperText="ارفع صورة من جهازك، أو اختر من المعرض الجاهز، أو اتركها بدون صورة"
                    heightClass="h-28"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewDish(false)}
                    className="bg-white border border-stone-300 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md"
                  >
                    حفظ وإضافة الوجبة للمنيو فوراً
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Brand & Signature Dish form */}
          {isManager && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="border-b pb-3 flex items-center justify-between">
                <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>تعديل اسم المطعم والطبق الرئيسي المميز</span>
                </h4>
                <span className="text-[11px] text-stone-400">خاص بالمدير</span>
              </div>

              <form onSubmit={handleSaveBrandInfo} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">اسم المطعم / البراند:</label>
                    <input
                      type="text"
                      value={editBrandName}
                      onChange={(e) => setEditBrandName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">اسم الطبق المميز بالبانر:</label>
                    <input
                      type="text"
                      value={editDishName}
                      onChange={(e) => setEditDishName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">سعر الطبق المميز (ج.م):</label>
                    <input
                      type="number"
                      value={editDishPrice}
                      onChange={(e) => setEditDishPrice(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-black py-2.5 px-5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  حفظ وتحديث اسم المطعم والطبق المميز
                </button>
              </form>
            </div>
          )}

          {/* List of all current menu items with Edit & Delete (وضع وإزالة مأكولات) */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <h4 className="font-black text-sm text-stone-900">
                قائمة جميع وجبات المنيو الحالية ({menuItems.length} صنف)
              </h4>
              <span className="text-xs text-stone-400">يمكن للمدير تعديل أي صنف أو حذفه تماماً</span>
            </div>

            <div className="table-responsive overflow-x-auto rounded-2xl border border-stone-200 bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-900 text-white text-xs">
                    <th className="p-3 text-right">الصورة</th>
                    <th className="p-3 text-right">اسم الوجبة</th>
                    <th className="p-3 text-center">التصنيف</th>
                    <th className="p-3 text-center">السعر</th>
                    <th className="p-3 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400 bg-stone-100 font-bold">
                              بدون صورة
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-3 font-extrabold text-stone-900">
                        <div>{item.name}</div>
                        <div className="text-[11px] text-stone-400 font-normal truncate max-w-xs">{item.description}</div>
                      </td>

                      <td className="p-3 text-center">
                        <span className="bg-stone-100 text-stone-700 px-2 py-1 rounded-md text-[11px] font-bold">
                          {item.category}
                        </span>
                      </td>

                      <td className="p-3 text-center font-mono font-black text-amber-700 text-sm">
                        {item.price} ج.م
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingDishItem(item)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            title="تعديل الوجبة والأسعار"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>

                          {isManager && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMealClick(item)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="إزالة الوجبة تماماً من المنيو"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal / Inline Editor for Single Meal */}
          {editingDishItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-right">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-black text-sm text-stone-900">
                    تعديل بيانات الوجبة: {editingDishItem.name}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingDishItem(null)}
                    className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                  >
                    إغلاق ✕
                  </button>
                </div>

                <form onSubmit={handleSaveEditedDishSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">اسم الوجبة:</label>
                    <input
                      type="text"
                      value={editingDishItem.name}
                      onChange={(e) =>
                        setEditingDishItem({ ...editingDishItem, name: e.target.value })
                      }
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">السعر (ج.م):</label>
                      <input
                        type="number"
                        value={editingDishItem.price}
                        onChange={(e) =>
                          setEditingDishItem({ ...editingDishItem, price: Number(e.target.value) })
                        }
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">التصنيف:</label>
                      <select
                        value={editingDishItem.category}
                        onChange={(e) =>
                          setEditingDishItem({
                            ...editingDishItem,
                            category: e.target.value as CategoryId,
                          })
                        }
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-bold"
                      >
                        <option value="koshary">كشري هاند</option>
                        <option value="tajin">طواجن الفرن</option>
                        <option value="extras">الإضافات والصوصات</option>
                        <option value="dessert">حلو بلدي</option>
                        <option value="drinks">مشروبات</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">الوصف:</label>
                    <textarea
                      rows={2}
                      value={editingDishItem.description}
                      onChange={(e) =>
                        setEditingDishItem({ ...editingDishItem, description: e.target.value })
                      }
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                    />
                  </div>

                  {/* Easy Image Picker for dish */}
                  <div>
                    <EasyImagePicker
                      label="صورة الوجبة"
                      currentImageUrl={editingDishItem.image}
                      onImageChange={(url) => setEditingDishItem({ ...editingDishItem, image: url })}
                      filterPresetCategory={editingDishItem.category}
                      helperText="ارفع صورة من جهازك، أو اختر من المعرض، أو احذفها تماماً"
                      heightClass="h-28"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingDishItem(null)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-6 py-2 rounded-xl"
                    >
                      حفظ التعديلات
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MANAGER IMAGE MANAGEMENT (لوحة تحكم الصور والشعار - خاص بالمدير فقط) */}
      {/* ========================================================================= */}
      {activeTab === 'images' && isManager && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-black text-lg text-stone-900 m-0">
                  لوحة التحكم في صور الوجبات والشعار (خاص بالمدير)
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                المدير هو الوحيد المصرح له برفع أو تغيير أو إزالة صور أي وجبة أو شعار المتجر. لا تظهر هذه الأيقونات للزبائن إطلاقاً.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('هل تود استعادة كافة الصور الأصلية الافتراضية للوجبات والشعار؟')) {
                  onResetAllImagesToDefault();
                  showToast('تمت استعادة كافة الصور الافتراضية بنجاح!');
                }
              }}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-stone-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>استعادة الصور الافتراضية الأصلية</span>
            </button>
          </div>

          {/* Selector & Detailed Image Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Pick which item to edit */}
            <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <h4 className="font-black text-xs text-stone-500 uppercase tracking-wider">
                اختر الوجبة أو الشعار لتغيير صورته:
              </h4>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {/* Logo Option */}
                <button
                  type="button"
                  onClick={() => setSelectedImageTarget('logo')}
                  className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    selectedImageTarget === 'logo'
                      ? 'bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-500'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-900 border border-stone-300 shrink-0">
                      {logoUrl ? (
                        <img src={logoUrl} alt="الشعار" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-stone-400">
                          بدون
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-black text-xs text-stone-900">شعار المطعم (Logo)</div>
                      <div className="text-[10px] text-stone-400">يظهر في الهيدر والفوتر</div>
                    </div>
                  </div>
                  {selectedImageTarget === 'logo' && <Check className="w-4 h-4 text-amber-600" />}
                </button>

                {/* Hero Dish Option */}
                <button
                  type="button"
                  onClick={() => setSelectedImageTarget('hero')}
                  className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    selectedImageTarget === 'hero'
                      ? 'bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-500'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-900 border border-stone-300 shrink-0">
                      {dishImg && dishImg !== 'NONE' ? (
                        <img src={dishImg} alt="الطبق المميز" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-stone-400">
                          بدون
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-black text-xs text-stone-900">الطبق المميز بالبانر ({dishName})</div>
                      <div className="text-[10px] text-stone-400">الطبق الأكثر طلباً بالواجهة</div>
                    </div>
                  </div>
                  {selectedImageTarget === 'hero' && <Check className="w-4 h-4 text-amber-600" />}
                </button>

                {/* All Menu Items */}
                <div className="pt-2 border-t text-[11px] font-bold text-stone-400">جميع وجبات المنيو:</div>

                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedImageTarget(item.id)}
                    className={`w-full p-2.5 rounded-2xl border text-right flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      selectedImageTarget === item.id
                        ? 'bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-500'
                        : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-900 border border-stone-300 shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-stone-400">
                            بدون
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-stone-900">{item.name}</div>
                        <div className="text-[10px] text-stone-400">{item.price} ج.م · {item.category}</div>
                      </div>
                    </div>
                    {selectedImageTarget === item.id && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: EasyImagePicker for the selected item */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="border-b pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    جاري التحكم في صورة:
                  </span>
                  <h4 className="font-black text-base text-stone-900 mt-1">{activeImageItem.title}</h4>
                </div>

                {activeImageItem.currentUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeImageItem.id === 'logo') {
                        onUpdateLogo('');
                      } else if (activeImageItem.id === 'hero') {
                        onUpdateMenuItemImage('hero', '');
                      } else {
                        onUpdateMenuItemImage(activeImageItem.id, '');
                      }
                      showToast(`تمت إزالة صورة ${activeImageItem.title} تماماً.`);
                    }}
                    className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إزالة الصورة تماماً</span>
                  </button>
                ) : null}
              </div>

              <EasyImagePicker
                label={`تحرير أو وضع صورة جديدة لـ: ${activeImageItem.title}`}
                currentImageUrl={activeImageItem.currentUrl}
                onImageChange={(newUrl) => {
                  if (activeImageItem.id === 'logo') {
                    onUpdateLogo(newUrl);
                  } else if (activeImageItem.id === 'hero') {
                    onUpdateMenuItemImage('hero', newUrl);
                  } else {
                    onUpdateMenuItemImage(activeImageItem.id, newUrl);
                  }
                  showToast(`تم تحديث صورة ${activeImageItem.title} بنجاح!`);
                }}
                filterPresetCategory={activeImageItem.category}
                helperText="ارفع صورة من الموبايل أو الكمبيوتر، أو اختر من المعرض الجاهز، أو احذفها تماماً"
                heightClass="h-48"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SALES & REVENUE REPORTS (التحكم في المبيعات والتقارير المالية) */}
      {/* ========================================================================= */}
      {activeTab === 'sales' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">إجمالي المبيعات المحققة</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
                {salesStats.totalRevenue} ج.م
              </div>
              <div className="text-[11px] text-stone-400">مجموع دخل كافة الطلبات المسجلة</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">عدد الطلبات الإجمالي</span>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
                {salesStats.totalOrders} طلبات
              </div>
              <div className="text-[11px] text-stone-400">المكتمل والمسجل بالنظام</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">الطلبات المسلمة بنجاح</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
                {salesStats.deliveredCount}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">تم تسليمها للعميل</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">متوسط قيمة السلة (AOV)</span>
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700">
                {salesStats.avgOrderValue} ج.م
              </div>
              <div className="text-[11px] text-stone-400">متوسط إجمالي الطلب الواحد</div>
            </div>
          </div>

          {/* Best Sellers Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-600" />
                <span>الوجبات والأصناف الأكثر مبيعاً وتحقيقاً للإيراد</span>
              </h4>
              <span className="text-xs text-stone-400">ترتيب تنازلي حسب الدخل</span>
            </div>

            {salesStats.bestSellers.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                لا توجد مبيعات مسجلة حتى الآن.
              </div>
            ) : (
              <div className="table-responsive overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-stone-900 text-white text-xs">
                      <th className="p-3 text-right">الوجبة / الصنف</th>
                      <th className="p-3 text-center">الكمية المباعة</th>
                      <th className="p-3 text-center">إجمالي المبيعات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs font-bold">
                    {salesStats.bestSellers.map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/30">
                        <td className="p-3 text-stone-900">{item.name}</td>
                        <td className="p-3 text-center font-mono text-stone-700">{item.count} علبة / وجبة</td>
                        <td className="p-3 text-center font-mono text-amber-700">{item.totalRev} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ORDERS TRACKING (طلبات العملاء الحالية وإيصالات الكاش) */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && canViewOrders && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 animate-in fade-in" id="perm-box-orders">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2 m-0">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>📦 طلبات العملاء الواردة ({orders.length})</span>
            </h3>
            <span className="text-xs text-stone-400">تحديث فوري مع تغيير الحالات</span>
          </div>

          <div className="table-responsive overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-stone-900 text-white text-xs">
                  <th className="p-3">رقم الطلب</th>
                  <th className="p-3">الاسم</th>
                  <th className="p-3">الهاتف</th>
                  <th className="p-3">الوجبات</th>
                  <th className="p-3">الإجمالي</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">الإيصال والتواصل</th>
                </tr>
              </thead>
              <tbody id="orders-list-body" className="divide-y divide-stone-100 text-xs text-stone-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-stone-400">
                      لا توجد طلبات جديدة حالياً.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const firstDish = order.items[0]?.menuItem.name || dishName;
                    return (
                      <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-center">{order.orderNumber}</td>
                        <td className="p-3 font-bold text-center">{order.delivery.fullName}</td>
                        <td className="p-3 font-mono text-center" dir="ltr">{order.delivery.phone}</td>
                        <td className="p-3 text-center truncate max-w-xs">{firstDish}</td>
                        <td className="p-3 font-mono font-black text-amber-700 text-center">{order.total} ج.م</td>
                        <td className="p-3 text-center">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs font-bold p-1 rounded border border-stone-200 bg-white"
                          >
                            <option value="received">تم الدفع وتأكيد الإرفاق</option>
                            <option value="preparing">في المطبخ</option>
                            <option value="on_the_way">مع الدليفري</option>
                            <option value="delivered">تم التسليم ✓</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {order.paymentScreenshot ? (
                              <button
                                type="button"
                                onClick={() => setSelectedScreenshot(order.paymentScreenshot || null)}
                                className="text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded text-[11px] font-bold cursor-pointer"
                                title="معاينة إيصال الكاش"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-stone-400 text-[10px]">كاش يدوي</span>
                            )}
                            <a
                              href={`https://wa.me/2${order.delivery.phone.replace(/^0+/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-800"
                              title="محادثة واتساب"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CUSTOMER SERVICE & DELIVERY SPECIALISTS (أرقام الدعم والتوصيل) */}
      {/* ========================================================================= */}
      {activeTab === 'support' && isManager && (
        <div className="space-y-6 animate-in fade-in">
          {/* Customer Service Hotline Form */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>تعديل أرقام خدمة العملاء والدعم الفني ومسؤول التوصيل</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  هذه الأرقام تظهر للزبائن للتواصل المباشر والاستفسارات
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveStoreContacts} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رقم خدمة العملاء (الخط الساخن):</label>
                  <input
                    type="text"
                    value={editCsPhone}
                    onChange={(e) => setEditCsPhone(e.target.value)}
                    placeholder="19876 أو 010xxxxxxxx"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رقم واتساب خدمة العملاء:</label>
                  <input
                    type="text"
                    value={editCsWhatsapp}
                    onChange={(e) => setEditCsWhatsapp(e.target.value)}
                    placeholder="01066934250"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">رقم هاتف مسؤول عمليات التوصيل:</label>
                  <input
                    type="text"
                    value={editDeliveryManagerPhone}
                    onChange={(e) => setEditDeliveryManagerPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                حفظ وتحديث أرقام خدمة العملاء فوراً
              </button>
            </form>
          </div>

          {/* Delivery Specialists Team (المتخصصين على توصيل الطلبات والطيارين) */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>فريق المتخصصين على توصيل الطلبات (الطيارين)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  إدارة قائمة كابتن الدليفري ومناطق تغطيتهم وأرقام هواتفهم
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingSpecialist(!isAddingSpecialist)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingSpecialist ? 'إلغاء' : 'إضافة طيار جديد'}</span>
              </button>
            </div>

            {/* Form: Add Specialist */}
            {isAddingSpecialist && (
              <form onSubmit={handleAddDeliverySpecialist} className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">اسم الطيار:</label>
                    <input
                      type="text"
                      value={specName}
                      onChange={(e) => setSpecName(e.target.value)}
                      placeholder="كابتن أحمد سامي"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">رقم الهاتف:</label>
                    <input
                      type="text"
                      value={specPhone}
                      onChange={(e) => setSpecPhone(e.target.value)}
                      placeholder="01012345678"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">منطقة التغطية:</label>
                    <input
                      type="text"
                      value={specArea}
                      onChange={(e) => setSpecArea(e.target.value)}
                      placeholder="وسط البلد والتحرير"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">المركبة:</label>
                    <select
                      value={specVehicle}
                      onChange={(e) => setSpecVehicle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-bold"
                    >
                      <option value="موتوسيكل">موتوسيكل</option>
                      <option value="سكوتر كهربائي">سكوتر كهربائي</option>
                      <option value="سيارة">سيارة</option>
                      <option value="دراجة">دراجة</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingSpecialist(false)}
                    className="bg-white border text-stone-600 text-xs font-bold px-3 py-1.5 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-1.5 rounded-xl"
                  >
                    إضافة الطيار للقائمة
                  </button>
                </div>
              </form>
            )}

            {/* List of Specialists */}
            <div className="table-responsive overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-800 text-white text-xs">
                    <th className="p-3">اسم الطيار</th>
                    <th className="p-3">رقم الهاتف</th>
                    <th className="p-3">منطقة التغطية</th>
                    <th className="p-3">المركبة</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-800">
                  {(storeSettings.deliverySpecialists || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-stone-400">
                        لا يوجد طيارين مسجلين بعد. يمكنك إضافة طيار جديد بالأعلى.
                      </td>
                    </tr>
                  ) : (
                    (storeSettings.deliverySpecialists || []).map((spec) => (
                      <tr key={spec.id} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-center">{spec.name}</td>
                        <td className="p-3 font-mono text-center" dir="ltr">{spec.phone}</td>
                        <td className="p-3 text-center">{spec.area}</td>
                        <td className="p-3 text-center">{spec.vehicle}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSpecialistStatus(spec.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                              spec.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {spec.isAvailable ? 'متاح للطلب' : 'في مهمة'}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecialist(spec.id, spec.name)}
                            className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="حذف الطيار"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: PRIVACY POLICY & TERMS (السياسة الخصوصية وشروط الخدمة والتوصيل) */}
      {/* ========================================================================= */}
      {activeTab === 'policy' && isManager && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>كتابة وتعديل سياسة الخصوصية وشروط الخدمة والتوصيل</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                تظهر هذه النصوص في صفحة الشروط ومودال سياسة الخصوصية أمام الزبائن
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                نص سياسة الخصوصية وحماية بيانات العملاء:
              </label>
              <textarea
                rows={4}
                value={editPrivacyPolicy}
                onChange={(e) => setEditPrivacyPolicy(e.target.value)}
                placeholder="اكتب سياسة الخصوصية المعتمدة لحفظ بيانات وسجلات أرقام العملاء..."
                className="w-full text-xs p-3.5 rounded-xl border border-stone-200 bg-white leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                نص شروط الخدمة وضمانات جودة التوصيل والاسترجاع:
              </label>
              <textarea
                rows={4}
                value={editTermsOfService}
                onChange={(e) => setEditTermsOfService(e.target.value)}
                placeholder="اكتب شروط التوصيل والاستبدال وسياسة الاسترجاع..."
                className="w-full text-xs p-3.5 rounded-xl border border-stone-200 bg-white leading-relaxed"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black py-3 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                حفظ وتحديث سياسة الخصوصية والشروط
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditPrivacyPolicy(
                    `نحن في ${brandName} نلتزم بحماية خصوصية عملائنا الكرام. لا يتم استخدام أرقام الهواتف أو العناوين إلا لغرض إيصال الطلبات وتأكيد حالة الدفع. نحن نضمن عدم مشاركة أي بيانات شخصية مع أي جهة خارجية تحت أي ظرف.`
                  );
                  setEditTermsOfService(
                    `١. يتم تحضير جميع الوجبات طازجة فور تأكيد إرفاق الدفع أو طلب الكاش.\n٢. في حال وجود أي ملاحظة على جودة الطعام أو تأخر التوصيل عن الموعد المحدد، يحق للعميل استبدال الوجبة فوراً أو استرداد قيمتها عبر التواصل مع خدمة العملاء.\n٣. يلتزم الطيار بتسليم الطلب ساخناً ومغلفاً ومرفقاً معه الدقة والشطة والتقلية الأصلية.`
                  );
                }}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer"
              >
                استعادة النص النموذجي الافتراضي
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: STAFF ACCOUNTS & ROLES (حسابات العمال والصلاحيات - خاص بالمدير) */}
      {/* ========================================================================= */}
      {activeTab === 'staff' && isManager && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5 animate-in fade-in" id="manager-only-users">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2 m-0">
              <Users className="w-5 h-5 text-blue-600" />
              <span>👥 إدارة حسابات العمال والصلاحيات (خاص بالمدير)</span>
            </h3>
            <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2 py-0.5 rounded">
              صلاحية المدير
            </span>
          </div>

          <form onSubmit={handleCreateNewStaff} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="new-staff-email">
                  البريد الإلكتروني للعامل:
                </label>
                <input
                  type="email"
                  id="new-staff-email"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="البريد الإلكتروني للعامل"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-blue-600 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="new-staff-pass">
                  كلمة المرور:
                </label>
                <input
                  type="password"
                  id="new-staff-pass"
                  value={newStaffPass}
                  onChange={(e) => setNewStaffPass(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-blue-600 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 'bold', fontSize: '13px' }} className="block mb-1 text-stone-800">
                تحديد الصلاحيات المتاحة للعامل:
              </label>
              <div className="permission-checkboxes flex flex-wrap gap-4 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    id="p-menu"
                    checked={permMenu}
                    onChange={(e) => setPermMenu(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-stone-300"
                  />
                  <span>الاطلاع على المنيو والأسعار</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    id="p-orders"
                    checked={permOrders}
                    onChange={(e) => setPermOrders(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-stone-300"
                  />
                  <span>عرض ومتابعة طلبات المطبخ</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              style={{ background: '#2196F3' }}
              className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors cursor-pointer text-xs sm:text-sm hover:opacity-90"
            >
              إضافة حساب عامل جديد
            </button>
          </form>

          <div className="pt-2">
            <h4 className="font-extrabold text-sm text-stone-900 mb-2">قائمة العمال المصرح لهم:</h4>
            <div className="table-responsive overflow-x-auto rounded-2xl border border-stone-200 bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-800 text-white text-xs">
                    <th className="p-3">البريد الإلكتروني</th>
                    <th className="p-3">تعديل المنيو</th>
                    <th className="p-3">عرض الطلبات</th>
                    <th className="p-3">إجراء</th>
                  </tr>
                </thead>
                <tbody id="staff-list-body" className="divide-y divide-stone-100 text-xs">
                  {staffAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-stone-400">
                        لا يوجد حسابات عمال مسجلة حالياً.
                      </td>
                    </tr>
                  ) : (
                    staffAccounts.map((s) => (
                      <tr key={s.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold text-center">{s.email}</td>
                        <td className="p-3 text-center font-bold">
                          {s.permissions.menu ? (
                            <span className="text-emerald-700">✅ متاح</span>
                          ) : (
                            <span className="text-red-600">❌ ممتنع</span>
                          )}
                        </td>
                        <td className="p-3 text-center font-bold">
                          {s.permissions.orders ? (
                            <span className="text-emerald-700">✅ متاح</span>
                          ) : (
                            <span className="text-red-600">❌ ممتنع</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => onDeleteStaff(s.id)}
                            className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="حذف الحساب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: AUDIT TRAIL LOGS (سجل الأمان والنشاطات - خاص بالمدير) */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && isManager && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 animate-in fade-in" id="manager-only-logs">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2 m-0">
              <History className="w-5 h-5 text-amber-600" />
              <span>🛡️ سجل النشاطات وعمليات تسجيل الدخول</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">{activityLogs.length} سجلات</span>
          </div>

          <div className="table-responsive overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-stone-900 text-white text-xs">
                  <th className="p-3">المستخدم</th>
                  <th className="p-3">الحدث / النشاط</th>
                  <th className="p-3">التوقيت</th>
                </tr>
              </thead>
              <tbody id="logs-list-body" className="divide-y divide-stone-100 text-xs">
                {activityLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-stone-400">
                      لا توجد نشاطات مسجلة بعد.
                    </td>
                  </tr>
                ) : (
                  activityLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold text-center">{l.user}</td>
                      <td className="p-3 text-center font-medium">{l.action}</td>
                      <td className="p-3 font-mono text-center text-stone-500">{l.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Screenshot full modal preview */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-sm text-stone-900">
                إيصال تحويل فودافون كاش
              </h4>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="text-stone-500 hover:text-stone-900 text-xs font-bold"
              >
                إغلاق ✕
              </button>
            </div>
            <div className="bg-stone-100 rounded-xl overflow-hidden max-h-[70vh] flex items-center justify-center">
              <img
                src={selectedScreenshot}
                alt="إيصال كاش"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
