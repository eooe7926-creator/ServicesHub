import React, { useState, useMemo } from 'react';
import { Search, Flame, ShoppingBag, ArrowLeft, Star, Clock } from 'lucide-react';
import { MenuItem, CategoryId, CartItem } from '../types';
import { MENU_ITEMS, RESTAURANT_INFO } from '../data/menuData';

interface MenuStepProps {
  onSelectItem: (item: MenuItem) => void;
  onQuickOrderHero: (item: MenuItem) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onProceedToStep2: () => void;
}

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'koshary', label: 'كشري هاند' },
  { id: 'tajin', label: 'طواجن الفرن' },
  { id: 'extras', label: 'الإضافات والصوصات' },
  { id: 'dessert', label: 'حلو بلدي' },
  { id: 'drinks', label: 'مشروبات' },
];

export const MenuStep: React.FC<MenuStepProps> = ({
  onSelectItem,
  onQuickOrderHero,
  cart,
  onOpenCart,
  onProceedToStep2,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Primary hero item corresponding to user's prototype (كشري ٥٥ جنيهاً)
  const heroItem = useMemo(() => {
    return MENU_ITEMS.find((item) => item.id === 'koshary-super') || MENU_ITEMS[0];
  }, []);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const cartTotal = cart.reduce((acc, i) => acc + i.itemTotal, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Featured Banner / Step 1 Signature Highlight */}
      <section className="bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative ambient elements */}
        <div className="absolute -left-16 -top-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
              <span className="bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-400/30">
                الطبق الأكثر طلباً في مصر 🔥
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {RESTAURANT_INFO.rating} ({RESTAURANT_INFO.reviewsCount} تقييم)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
              {heroItem.name}
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              {heroItem.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-amber-400">
                  {heroItem.price} جنيهاً
                </span>
                {heroItem.originalPrice && (
                  <span className="text-sm font-mono text-stone-400 line-through">
                    {heroItem.originalPrice} ج.م
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onQuickOrderHero(heroItem)}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm px-6 py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>اطلب الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectItem(heroItem)}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl border border-white/20 transition-colors cursor-pointer"
                >
                  تخصيص الإضافات والشطة
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-stone-300 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>تحضير فوري في ٥ دقائق</span>
              </div>
              <span>·</span>
              <div>دقة بالخل والليمون + شطة زيت مجاناً مع كل علبة</div>
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/20 group">
              <img
                src={heroItem.image}
                alt={heroItem.name}
                className="w-full h-60 sm:h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 right-3 left-3 flex justify-between items-end">
                <div className="text-white">
                  <span className="text-[10px] uppercase font-bold text-amber-300">طازج وساخن</span>
                  <h4 className="font-extrabold text-sm">{heroItem.name}</h4>
                </div>
                <span className="bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-1 rounded font-mono">
                  {heroItem.price} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Search */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              قائمة طعام كشري هاند
            </h2>
            <p className="text-xs text-stone-500">
              اختر وجباتك المفضلة وسنجهزها طازجة فور طلبك
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن صنف أو إضافة..."
              className="w-full text-xs pr-9 pl-3 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Menu Grid */}
      <section>
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-2">
            <p className="text-stone-500 text-sm font-semibold">
              لم نعثر على أصناف تطابق بحثك "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs text-amber-700 font-bold hover:underline"
            >
              إعادة تعيين البحث والفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 hover:border-amber-400/80 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {item.badge && (
                    <span className="absolute top-2.5 right-2.5 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {item.servingSize && (
                    <span className="absolute bottom-2 left-2 bg-stone-900/80 text-stone-100 text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                      {item.servingSize}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-black text-base text-amber-700 font-mono shrink-0">
                        {item.price} ج.م
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    {item.calories && (
                      <span className="text-[11px] text-stone-400 font-mono">
                        {item.calories} سعرة
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 ml-auto">
                      {item.customizable ? (
                        <button
                          type="button"
                          onClick={() => onSelectItem(item)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          تخصيص
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onQuickOrderHero(item)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>اطلب الآن</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Bottom Bar if Cart has items */}
      {cartCount > 0 && (
        <aside aria-label="شريط متابعة السلة" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-stone-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-stone-800 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
              {cartCount}
            </div>
            <div>
              <div className="text-xs text-stone-400">إجمالي السلة الحالية:</div>
              <div className="font-mono font-black text-base text-amber-400">
                {cartTotal} ج.م
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCart}
              className="text-xs font-bold text-stone-300 hover:text-white px-2 py-2"
            >
              عرض السلة
            </button>
            <button
              type="button"
              onClick={onProceedToStep2}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>متابعة الطلب</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
