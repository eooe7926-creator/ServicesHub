import React, { useState } from 'react';
import {
  X,
  Camera,
  Trash2,
  Sparkles,
  RotateCcw,
  Check,
  Image as ImageIcon,
  Layers,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { MenuItem, CategoryId } from '../types';
import { EasyImagePicker } from './EasyImagePicker';

interface BatchImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  logoUrl: string;
  onUpdateLogo: (newUrl: string) => void;
  dishName: string;
  heroImg: string;
  onUpdateHeroImg: (newUrl: string) => void;
  menuItems: MenuItem[];
  onUpdateMenuItemImage: (itemId: string, newUrl: string) => void;
  onResetAllImagesToDefault: () => void;
}

export const BatchImageManagerModal: React.FC<BatchImageManagerModalProps> = ({
  isOpen,
  onClose,
  brandName,
  logoUrl,
  onUpdateLogo,
  dishName,
  heroImg,
  onUpdateHeroImg,
  menuItems,
  onUpdateMenuItemImage,
  onResetAllImagesToDefault,
}) => {
  // Current item being actively edited in detail
  const [activeEditingItem, setActiveEditingItem] = useState<{
    id: string; // 'logo' | 'hero' | itemId
    title: string;
    currentUrl: string;
    category?: 'koshary' | 'tajin' | 'dessert' | 'logo' | 'extras' | 'drinks' | 'all';
  } | null>(null);

  const [filterCategory, setFilterCategory] = useState<CategoryId | 'all'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredMenuItems =
    filterCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 text-right overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-md font-bold">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 m-0">
                لوحة التحكم في صور المطعم والمنيو
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                تغيير أو إزالة أي صورة حالية، أو وضع صور جديدة من جهازك أو المعرض بسهولة فائقة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('هل أنت متأكد من استعادة كافة الصور الأصلية الافتراضية؟')) {
                  onResetAllImagesToDefault();
                  showToast('تمت استعادة كافة الصور الافتراضية بنجاح!');
                }
              }}
              className="text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-100 text-xs font-bold px-3 py-2 rounded-xl border border-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="استعادة الصور الافتراضية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">استعادة الصور الأصلية</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast */}
        {successToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Active Detail Editor if user picked an item */}
          {activeEditingItem && (
            <div className="bg-amber-50/50 border-2 border-amber-400 rounded-3xl p-5 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    جاري تحرير الصورة لـ:
                  </span>
                  <h3 className="font-black text-sm text-stone-900">{activeEditingItem.title}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveEditingItem(null)}
                  className="text-xs text-stone-500 hover:text-stone-900 font-bold bg-white px-3 py-1.5 rounded-lg border border-stone-200 cursor-pointer"
                >
                  إغلاق المحرر والعودة للقائمة ✕
                </button>
              </div>

              <EasyImagePicker
                label={`صورة: ${activeEditingItem.title}`}
                currentImageUrl={activeEditingItem.currentUrl}
                onImageChange={(newUrl) => {
                  if (activeEditingItem.id === 'logo') {
                    onUpdateLogo(newUrl);
                    showToast('تم تحديث شعار المطعم بنجاح!');
                  } else if (activeEditingItem.id === 'hero') {
                    onUpdateHeroImg(newUrl);
                    showToast('تم تحديث صورة الطبق الرئيسي بنجاح!');
                  } else {
                    onUpdateMenuItemImage(activeEditingItem.id, newUrl);
                    showToast(`تم تحديث صورة: ${activeEditingItem.title}`);
                  }
                  setActiveEditingItem((prev) => (prev ? { ...prev, currentUrl: newUrl } : null));
                }}
                filterPresetCategory={activeEditingItem.category || 'all'}
                helperText="ارفع صورة من الموبايل/الكمبيوتر، أو اختر من المعرض، أو احذفها تماماً"
              />
            </div>
          )}

          {/* Section 1: Logo and Signature Dish */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-stone-500 uppercase tracking-wider">
              ١. صور الهوية الرئيسية (الشعار والطبق الأكثر طلباً)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Logo Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-900 border-2 border-amber-500 shrink-0">
                    {logoUrl ? (
                      <img src={logoUrl} alt="الشعار" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-stone-900">شعار المطعم (Logo)</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {logoUrl ? 'الصورة معتمدة في الهيدر' : 'تمت إزالة الشعار (بدون صورة)'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveEditingItem({
                        id: 'logo',
                        title: 'شعار المطعم (Logo)',
                        currentUrl: logoUrl,
                        category: 'logo',
                      })
                    }
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{logoUrl ? 'تغيير الشعار' : 'وضع شعار'}</span>
                  </button>

                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateLogo('');
                        showToast('تمت إزالة شعار المطعم تماماً');
                      }}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>إزالة تماماً</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Hero Dish Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-900 border-2 border-amber-500 shrink-0">
                    {heroImg && heroImg !== 'NONE' ? (
                      <img src={heroImg} alt={dishName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-800 text-[9px] p-1 text-center font-bold">
                        <ImageIcon className="w-5 h-5 text-amber-400 mb-0.5" />
                        <span>بدون صورة</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-stone-900">{dishName}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {heroImg && heroImg !== 'NONE' ? 'الطبق المميز بالبانر' : 'تمت إزالة صورة الطبق المميز'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveEditingItem({
                        id: 'hero',
                        title: dishName,
                        currentUrl: heroImg === 'NONE' ? '' : heroImg,
                        category: 'koshary',
                      })
                    }
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{heroImg && heroImg !== 'NONE' ? 'تغيير الصورة' : 'وضع صورة'}</span>
                  </button>

                  {heroImg && heroImg !== 'NONE' && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateHeroImg('NONE');
                        showToast('تمت إزالة صورة الطبق الرئيسي تماماً');
                      }}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>إزالة تماماً</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: All Menu Items */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
              <h3 className="text-xs font-black text-stone-500 uppercase tracking-wider">
                ٢. جميع وجبات المنيو ({menuItems.length} وجبة)
              </h3>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-1">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'koshary', label: 'كشري' },
                  { id: 'tajin', label: 'طواجن' },
                  { id: 'extras', label: 'إضافات' },
                  { id: 'dessert', label: 'حلو' },
                  { id: 'drinks', label: 'مشروبات' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilterCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      filterCategory === cat.id
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredMenuItems.map((item) => {
                const hasImage = item.image && item.image.trim() !== '';
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-stone-200 hover:border-amber-400 rounded-2xl p-3.5 flex flex-col justify-between gap-3 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        {hasImage ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50 text-[10px]">
                            <ImageIcon className="w-5 h-5 text-stone-300 mb-0.5" />
                            <span className="text-[9px]">بدون</span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-stone-900 truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-black text-xs text-amber-700 font-mono">
                            {item.price} ج.م
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              hasImage
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {hasImage ? 'بصورة' : 'بدون صورة'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveEditingItem({
                            id: item.id,
                            title: item.name,
                            currentUrl: item.image || '',
                            category: item.category,
                          })
                        }
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold py-1.5 px-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-600" />
                        <span>{hasImage ? 'تغيير الصورة' : 'وضع صورة'}</span>
                      </button>

                      {hasImage && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateMenuItemImage(item.id, '');
                            showToast(`تمت إزالة صورة ${item.name} تماماً`);
                          }}
                          className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-xl transition-colors cursor-pointer"
                          title="إزالة الصورة تماماً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            💡 يتم حفظ كافة الصور والتعديلات تلقائياً في المتصفح وتظهر على الواجهة فوراً.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-colors cursor-pointer mr-auto sm:mr-0"
          >
            إغلاق وحفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};
