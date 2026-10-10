import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowLeft, Tag, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  discount: number;
  onApplyPromoCode: (code: string) => { success: boolean; message: string };
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  discount,
  onApplyPromoCode,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);
  const deliveryFee = subtotal > 150 ? 0 : RESTAURANT_INFO.deliveryFee;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = onApplyPromoCode(promoInput.trim());
    setPromoMessage({ text: res.message, isError: !res.success });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-black text-stone-900">سلة طلبات كشري هاند</h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((c, i) => c + i.quantity, 0)} عناصر
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/60"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-stone-800 text-base">سلتك فارغة حالياً</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  اختر من قائمة كشري هاند الشهية وأضف أطباقك المفضلة وسنبدأ التحضير فوراً!
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg transition-colors"
                >
                  تصفح قائمة الطعام
                </button>
              </div>
            ) : (
              <>
                {/* Free delivery bar */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs">
                  {subtotal >= 150 ? (
                    <p className="font-bold text-amber-900 flex items-center gap-1.5">
                      <span>🎉 مبروك! حصلت على توصيل مجاني لطلبك.</span>
                    </p>
                  ) : (
                    <div>
                      <p className="text-stone-700">
                        أضف بما قيمته <span className="font-bold text-amber-800 font-mono">{150 - subtotal} ج.م</span> للحصول على توصيل مجاني!
                      </p>
                      <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-amber-600 h-full transition-all"
                          style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="divide-y divide-stone-100">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="py-3.5 flex gap-3">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-stone-900 truncate">
                            {item.menuItem.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                            title="حذف الصنف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Options badge notes */}
                        <div className="text-[11px] text-stone-500 mt-0.5 space-y-0.5">
                          {item.options.sizeName && (
                            <div>الحجم: {item.options.sizeName}</div>
                          )}
                          {item.options.spiceLevel && (
                            <div>
                              الشطة:{' '}
                              {item.options.spiceLevel === 'fire'
                                ? 'جمر نارية 🔥'
                                : item.options.spiceLevel === 'medium'
                                ? 'وسط'
                                : 'بدون شطة'}
                            </div>
                          )}
                          {item.options.notes && (
                            <div className="italic text-stone-400">"{item.options.notes}"</div>
                          )}
                        </div>

                        {/* Controls & Price */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-white shadow-xs flex items-center justify-center text-stone-700 hover:bg-stone-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-white shadow-xs flex items-center justify-center text-stone-700 hover:bg-stone-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-black text-xs font-mono text-stone-900">
                            {item.itemTotal} ج.م
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="كود الخصم (جرب: HAND10)"
                        className="w-full text-xs pr-8 pl-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="text-xs font-bold px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl transition-colors shrink-0"
                    >
                      تطبيق
                    </button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`text-[11px] mt-1.5 font-medium ${
                        promoMessage.isError ? 'text-red-600' : 'text-emerald-700'
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono font-bold text-stone-900">{subtotal} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم التوصيل:</span>
                  <span className="font-mono">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">مجاناً</span>
                    ) : (
                      `${deliveryFee} ج.م`
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>قيمة الخصم:</span>
                    <span className="font-mono font-bold">-{discount} ج.م</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-950">
                  <span>الإجمالي النهائي:</span>
                  <span className="font-mono text-base text-amber-700">{grandTotal} ج.م</span>
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="px-3 py-3 border border-stone-200 rounded-xl text-stone-500 hover:text-red-600 hover:bg-stone-100 transition-colors"
                  title="تفريغ السلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <span>متابعة الطلب ({grandTotal} ج.م)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
