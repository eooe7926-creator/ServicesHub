import React from 'react';
import { X, Camera } from 'lucide-react';
import { EasyImagePicker } from './EasyImagePicker';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentImageUrl: string;
  onSaveImage: (newUrl: string) => void;
  filterPresetCategory?: 'koshary' | 'tajin' | 'dessert' | 'logo' | 'extras' | 'drinks' | 'all';
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  onClose,
  title,
  currentImageUrl,
  onSaveImage,
  filterPresetCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-stone-900">{title}</h3>
              <p className="text-[11px] text-stone-500">
                رفع صورة جديدة من جهازك أو اختيارها من المعرض أو حذفها
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Easy Image Picker */}
        <EasyImagePicker
          label="معاينة وتحرير الصورة"
          currentImageUrl={currentImageUrl}
          onImageChange={(newUrl) => {
            onSaveImage(newUrl);
          }}
          filterPresetCategory={filterPresetCategory}
          helperText="اختر صورة من موبايلك أو كمبيوترك أو احذفها تماماً"
        />

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-colors cursor-pointer"
          >
            تم وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
