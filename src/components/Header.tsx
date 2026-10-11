import React from 'react';
import { ShoppingBag, UtensilsCrossed, Phone, ClipboardList, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenMyOrders: () => void;
  onOpenAdmin: () => void;
  ordersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenMyOrders,
  onOpenAdmin,
  ordersCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
            <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-stone-900">
                {RESTAURANT_INFO.name}
              </span>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded">
                مفتوح الآن
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              {RESTAURANT_INFO.tagline} · وسط البلد
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Hotline */}
          <a
            href={`tel:${RESTAURANT_INFO.hotline}`}
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-700 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            title="الخط الساخن"
          >
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>الخط الساخن: {RESTAURANT_INFO.hotline}</span>
          </a>

          {/* Orders History */}
          <button
            onClick={onOpenMyOrders}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 px-2.5 py-2 rounded-lg hover:bg-stone-100 transition-colors"
            title="طلباتي السابقة"
          >
            <ClipboardList className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">طلباتي</span>
            {ordersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-[11px] font-bold flex items-center justify-center">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Staff Mode Toggle */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-amber-800 px-2.5 py-2 rounded-lg hover:bg-amber-50/70 border border-stone-200 transition-colors"
            title="إدارة المطعم والمطبخ"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">لوحة الإدارة</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all"
            aria-label="سلة المشتريات"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden xs:inline">السلة</span>
            {cartTotal > 0 && (
              <span className="bg-amber-700/60 text-amber-50 text-xs px-2 py-0.5 rounded font-mono">
                {cartTotal} ج.م
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
