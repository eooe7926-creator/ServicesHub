import React, { useState } from 'react';
import { X, Plus, Minus, Flame, Sparkles } from 'lucide-react';
import { MenuItem, CartItemOption } from '../types';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, options: CartItemOption, quantity: number) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'medium' | 'large' | 'mega'>('medium');
  const [spiceLevel, setSpiceLevel] = useState<'cold' | 'medium' | 'fire'>('medium');
  const [extraTekleya, setExtraTekleya] = useState(false);
  const [extraSauce, setExtraSauce] = useState(false);
  const [extraDakkah, setExtraDakkah] = useState(false);
  const [extraShatta, setExtraShatta] = useState(false);
  const [extraChickpeas, setExtraChickpeas] = useState(false);
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const sizeOptions = [
    { key: 'medium' as const, name: 'حجم عادي (وسط)', priceDiff: 0 },
    { key: 'large' as const, name: 'حجم سوبر (كبير)', priceDiff: 10 },
    { key: 'mega' as const, name: 'حجم ميجا جامبو (عائلي)', priceDiff: 20 },
  ];

  const currentSizeOption = sizeOptions.find((s) => s.key === selectedSize)!;
  const isKosharyOrTajin = item.category === 'koshary' || item.category === 'tajin';

  let extrasTotal = 0;
  if (extraTekleya) extrasTotal += 10;
  if (extraSauce) extrasTotal += 8;
  if (extraDakkah) extrasTotal += 7;
  if (extraShatta) extrasTotal += 7;
  if (extraChickpeas) extrasTotal += 10;

  const singleItemPrice = item.price + (isKosharyOrTajin ? currentSizeOption.priceDiff : 0) + extrasTotal;
  const grandTotal = singleItemPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(
      item,
      {
        size: selectedSize,
        sizeName: currentSizeOption.name,
        sizePriceDiff: currentSizeOption.priceDiff,
        spiceLevel,
        extraSauce,
        extraTekleya,
        extraDakkah,
        extraShatta,
        extraChickpeas,
        notes: notes.trim(),
      },
      quantity
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header Image */}
        <div className="relative h-52 w-full bg-stone-900 overflow-hidden flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-800 p-4">
              <span className="text-3xl mb-1">🍲</span>
              <span className="text-xs font-bold text-stone-300">{item.name}</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 bg-white/90 hover:bg-white text-stone-700 p-2 rounded-full shadow-md transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          {item.badge && (
            <span className="absolute top-3 right-3 bg-amber-600 text-white font-bold text-xs px-3 py-1 rounded-md shadow-sm">
              {item.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-black text-stone-900">{item.name}</h3>
              <span className="text-xl font-black text-amber-700 font-mono shrink-0">
                {singleItemPrice} ج.م
              </span>
            </div>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">{item.description}</p>
          </div>

          {/* Size Selection (for Koshary & Tajin) */}
          {isKosharyOrTajin && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                اختيار الحجم
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedSize(opt.key)}
                    className={`p-2.5 rounded-xl border text-right transition-all ${
                      selectedSize === opt.key
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-1 ring-amber-600'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{opt.name}</div>
                    <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                      {opt.priceDiff > 0 ? `+${opt.priceDiff} ج.م` : 'السعر الأساسي'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spice Level */}
          {isKosharyOrTajin && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  درجة الشطة والحرارة
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cold' as const, label: 'بارد بدون شطة', sub: 'صلصة عادية' },
                  { id: 'medium' as const, label: 'وسط مضبوط', sub: 'حرارة متوازنة' },
                  { id: 'fire' as const, label: 'شطة جمر نارية 🔥', sub: 'لعشاق الحامي' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSpiceLevel(s.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      spiceLevel === s.id
                        ? 'border-red-600 bg-red-50/70 text-red-950 ring-1 ring-red-600'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{s.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras and Add-ons */}
          {isKosharyOrTajin && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                إضافات كشري هاند المخصوصة
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    checked: extraTekleya,
                    toggle: () => setExtraTekleya(!extraTekleya),
                    title: 'تقلية بصل مقرمش ذهبي زيادة',
                    price: 10,
                  },
                  {
                    checked: extraSauce,
                    toggle: () => setExtraSauce(!extraSauce),
                    title: 'علبة صلصة طماطم مسبكة إضافية',
                    price: 8,
                  },
                  {
                    checked: extraDakkah,
                    toggle: () => setExtraDakkah(!extraDakkah),
                    title: 'علبة دقة ثوم وخل وليمون إضافية',
                    price: 7,
                  },
                  {
                    checked: extraShatta,
                    toggle: () => setExtraShatta(!extraShatta),
                    title: 'علبة شطة زيت خارجية حامية',
                    price: 7,
                  },
                  {
                    checked: extraChickpeas,
                    toggle: () => setExtraChickpeas(!extraChickpeas),
                    title: 'علبة حمص الشام بالكمون إضافية',
                    price: 10,
                  },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      item.checked
                        ? 'border-amber-600 bg-amber-50/50 text-amber-950'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={item.toggle}
                        className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                      />
                      <span className="text-xs font-semibold">{item.title}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-600">
                      +{item.price} ج.م
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              ملاحظاتك الخاصة للشيف
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: التقلية تكون على جنب، زيادة ليمون في الدقة..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
            />
          </div>

          {/* Footer Controls: Quantity & Add Button */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-4">
            <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-stone-700 hover:bg-stone-100"
                aria-label="تقليل الكمية"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-sm font-mono text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-stone-700 hover:bg-stone-100"
                aria-label="زيادة الكمية"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-between transition-colors"
            >
              <span>إضافة إلى السلة</span>
              <span className="font-mono text-sm bg-amber-700/60 px-2.5 py-1 rounded-lg">
                {grandTotal} ج.م
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
