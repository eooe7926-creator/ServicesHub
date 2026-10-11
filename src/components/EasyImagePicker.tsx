import React, { useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Check,
  Sparkles,
  Link as LinkIcon,
  X,
  Camera,
  Layers,
} from 'lucide-react';

export interface PresetImage {
  id: string;
  name: string;
  url: string;
  category: 'koshary' | 'tajin' | 'dessert' | 'logo' | 'extras' | 'drinks';
}

export const PRESET_IMAGES: PresetImage[] = [
  {
    id: 'koshary-1',
    name: 'كشري مصري أصيل بالتقلية والصلصة',
    url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
    category: 'koshary',
  },
  {
    id: 'koshary-2',
    name: 'كشري فاخر في طبق خزفي',
    url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    category: 'koshary',
  },
  {
    id: 'koshary-3',
    name: 'طبق كشري مشكل عائلي ضخم',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    category: 'koshary',
  },
  {
    id: 'koshary-4',
    name: 'كشري مصري بصلصة حارة ودقة حمص',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    category: 'koshary',
  },
  {
    id: 'tajin-1',
    name: 'طاجن مكرونة بالفرن البلدي واللحمة',
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
    category: 'tajin',
  },
  {
    id: 'tajin-2',
    name: 'طاجن مكرونة بقطع الفراخ والموتزاريلا',
    url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    category: 'tajin',
  },
  {
    id: 'tajin-3',
    name: 'طاجن مكرونة بالسجق البلدي والجبنة السايحة',
    url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
    category: 'tajin',
  },
  {
    id: 'dessert-1',
    name: 'أرز باللبن فرن بالقشطة والمكسرات',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    category: 'dessert',
  },
  {
    id: 'dessert-2',
    name: 'طاجن أم علي محمر بالسمنة والمكسرات',
    url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    category: 'dessert',
  },
  {
    id: 'extras-1',
    name: 'تقلية بصل مقرمش ذهبي فريش',
    url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
    category: 'extras',
  },
  {
    id: 'extras-2',
    name: 'حمص الشام والدقة وصلصة الشطة الحارة',
    url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
    category: 'extras',
  },
  {
    id: 'drinks-1',
    name: 'مشروب غازي مثلج ومنعش',
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    category: 'drinks',
  },
  {
    id: 'drinks-2',
    name: 'مياه معدنية مثلجة نقية',
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    category: 'drinks',
  },
  {
    id: 'logo-1',
    name: 'شعار مطعم كشري هاند الذهبي',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    category: 'logo',
  },
  {
    id: 'logo-2',
    name: 'شعار الشيف المصري الكلاسيكي',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
    category: 'logo',
  },
];

interface EasyImagePickerProps {
  label: string;
  currentImageUrl: string;
  onImageChange: (newUrl: string) => void;
  allowPresets?: boolean;
  filterPresetCategory?: 'koshary' | 'tajin' | 'dessert' | 'logo' | 'extras' | 'drinks' | 'all';
  helperText?: string;
  heightClass?: string;
}

export const EasyImagePicker: React.FC<EasyImagePickerProps> = ({
  label,
  currentImageUrl,
  onImageChange,
  allowPresets = true,
  filterPresetCategory,
  helperText,
  heightClass = 'h-36 sm:h-44',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onImageChange(result);
      setUrlInput('');
      setStatusMessage('تم رفع الصورة وتعيينها بنجاح!');
      setTimeout(() => setStatusMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange('');
    setUrlInput('');
    setStatusMessage('تمت إزالة الصورة تماماً.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleApplyUrl = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      setStatusMessage('تم تعيين رابط الصورة بنجاح!');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const presetsToDisplay =
    filterPresetCategory && filterPresetCategory !== 'all'
      ? PRESET_IMAGES.filter((p) => p.category === filterPresetCategory)
      : PRESET_IMAGES;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs text-right">
      {/* Top Label & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-stone-900">{label}</label>
          {helperText && <p className="text-[11px] text-stone-400 mt-0.5">{helperText}</p>}
        </div>

        {currentImageUrl ? (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="حذف وإزالة الصورة تماماً"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>إزالة الصورة</span>
          </button>
        ) : (
          <span className="text-[11px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded font-medium">
            بدون صورة حالياً
          </span>
        )}
      </div>

      {/* Current Preview or Empty State Box */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-100 group">
        {currentImageUrl ? (
          <div className={`w-full ${heightClass} relative bg-stone-900 flex items-center justify-center`}>
            <img
              src={currentImageUrl}
              alt={label}
              className="w-full h-full object-cover"
              onError={(e) => {
                // broken image fallback
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80';
              }}
            />
            {/* Overlay badge */}
            <div className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>الصورة الحالية المعتمدة</span>
            </div>
            {/* Quick Remove floating button on top left */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 left-2 bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-md transition-colors cursor-pointer"
              title="إزالة الصورة"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className={`w-full ${heightClass} flex flex-col items-center justify-center text-stone-400 p-4 border-dashed border-2 border-stone-300`}>
            <ImageIcon className="w-8 h-8 mb-1.5 text-stone-300 stroke-[1.5]" />
            <span className="text-xs font-bold text-stone-600">لا توجد صورة موضوعة حالياً</span>
            <span className="text-[11px] text-stone-400 mt-0.5">
              اختر صورة من جهازك أو من المعرض أدناه
            </span>
          </div>
        )}
      </div>

      {statusMessage && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-1.5 animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs: Upload / Gallery / URL */}
      <div className="space-y-3 pt-1">
        <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>رفع من جهازك</span>
          </button>

          {allowPresets && (
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>معرض صور جاهز</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-stone-500" />
            <span>رابط صورة (URL)</span>
          </button>
        </div>

        {/* Tab 1: Upload from device */}
        {activeTab === 'upload' && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-amber-600 bg-amber-50/70'
                : 'border-stone-300 hover:border-amber-500 bg-stone-50/50 hover:bg-amber-50/30'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-1.5 pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-800">
                اضغط لاختيار صورة من الموبايل أو الكمبيوتر
              </span>
              <span className="text-[10px] text-stone-400">
                يدعم JPG، PNG، WebP، أو السحب والإفلات المباشر
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Gallery of presets */}
        {activeTab === 'gallery' && (
          <div className="space-y-2">
            <span className="text-[11px] text-stone-500 block">
              اختر أي صورة بنقرة واحدة لتطبيقها فوراً:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 border border-stone-100 rounded-xl">
              {presetsToDisplay.map((preset) => {
                const isSelected = currentImageUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onImageChange(preset.url);
                      setStatusMessage(`تم اختيار: ${preset.name}`);
                      setTimeout(() => setStatusMessage(null), 3000);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 group transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 ring-2 ring-amber-400'
                        : 'border-stone-200 hover:border-amber-400'
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-600/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Paste URL */}
        {activeTab === 'url' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyUrl(e);
                }
              }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-600 bg-white"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              تطبيق
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
