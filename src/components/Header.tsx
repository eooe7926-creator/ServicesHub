import React from 'react';
import { ShoppingBag, Phone, ClipboardList, KeyRound } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeaderProps {
  brandName: string;
  logoUrl: string;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenMyOrders: () => void;
  onOpenAdminLogin: () => void;
  onOpenSupport?: () => void;
  ordersCount: number;
  customerServicePhone?: string;
}

export const Header: React.FC<HeaderProps> = ({
  brandName,
  logoUrl,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenMyOrders,
  onOpenAdminLogin,
  onOpenSupport,
  ordersCount,
  customerServicePhone,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-white shadow-md">
      {/* Top Navbar matching the prompt's .navbar specification */}
      <div className="navbar max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo - Clean display with NO camera or edit icons */}
        <div className="brand-logo-container flex items-center gap-3">
          <div className="relative">
            {logoUrl ? (
              <img
                id="nav-logo"
                src={logoUrl}
                alt="لوجو المطعم"
                className="brand-logo w-10 h-10 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=150&q=80';
                }}
              />
            ) : (
              <div
                id="nav-logo"
                className="brand-logo w-10 h-10 rounded-full bg-amber-600 border-2 border-amber-400 flex items-center justify-center font-black text-xs text-stone-950 shadow-sm"
              >
                هاند
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span id="nav-brand-name" className="font-black text-lg sm:text-xl text-white tracking-tight">
              {brandName || 'كشري هاند'}
            </span>
            <span className="text-[10px] text-amber-400 font-medium hidden sm:block">
              {RESTAURANT_INFO.tagline}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Customer Service & Delivery Contact */}
          {onOpenSupport ? (
            <button
              type="button"
              onClick={onOpenSupport}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              title="خدمة العملاء والتوصيل"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">خدمة العملاء والتوصيل</span>
              <span className="md:hidden">الدعم</span>
            </button>
          ) : (
            <a
              href={`tel:${customerServicePhone || RESTAURANT_INFO.hotline}`}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-stone-800 transition-colors"
              title="الخط الساخن"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{customerServicePhone || RESTAURANT_INFO.hotline}</span>
            </a>
          )}

          {/* Orders History */}
          <button
            onClick={onOpenMyOrders}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            title="طلباتي السابقة"
          >
            <ClipboardList className="w-4 h-4 text-stone-400" />
            <span className="hidden sm:inline">طلباتي</span>
            {ordersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-stone-700 text-stone-200 text-[10px] font-bold flex items-center justify-center font-mono">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-3 py-2 rounded-xl font-bold text-xs border border-stone-700 transition-all cursor-pointer"
            aria-label="سلة المشتريات"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {cartCount}
                </span>
              )}
            </div>
            {cartTotal > 0 && (
              <span className="text-amber-400 font-mono font-bold">
                {cartTotal} ج.م
              </span>
            )}
          </button>

          {/* Admin / Cashier Button: matching prompt .admin-icon-btn exactly */}
          <button
            className="admin-icon-btn bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            onClick={onOpenAdminLogin}
          >
            <span>🔒 لوحة المطعم</span>
          </button>
        </div>
      </div>
    </header>
  );
};
