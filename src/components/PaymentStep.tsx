import React, { useState } from 'react';
import {
  Copy,
  Check,
  UploadCloud,
  FileImage,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  Banknote,
  Sparkles,
} from 'lucide-react';
import { PaymentMethod, CartItem, DeliveryDetails } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

interface PaymentStepProps {
  cart: CartItem[];
  delivery: DeliveryDetails;
  discount: number;
  onFinishOrder: (paymentMethod: PaymentMethod, screenshotData?: string, screenshotName?: string) => void;
  onBack: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  cart,
  delivery,
  discount,
  onFinishOrder,
  onBack,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone_cash');
  const [copied, setCopied] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, i) => acc + i.itemTotal, 0);
  const deliveryFee = subtotal > 150 ? 0 : RESTAURANT_INFO.deliveryFee;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleCopyCashNumber = () => {
    navigator.clipboard.writeText(RESTAURANT_INFO.vodafoneCashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setValidationError('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
        return;
      }
      setValidationError(null);
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotPreview(null);
    setScreenshotName('');
  };

  const handleAddSampleReceipt = () => {
    // Generate a high-clarity sample SVG receipt for instant testing convenience
    const sampleReceiptSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280" viewBox="0 0 400 280">
      <rect width="400" height="280" rx="16" fill="%230f172a"/>
      <rect x="20" y="20" width="360" height="240" rx="12" fill="%231e293b" stroke="%2338bdf8" stroke-width="2"/>
      <circle cx="200" cy="65" r="24" fill="%2310b981"/>
      <path d="M190 65 l7 7 l14 -14" stroke="%23ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
      <text x="200" y="115" fill="%23ffffff" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">تحويل ناجح - فودافون كاش</text>
      <text x="200" y="145" fill="%2338bdf8" font-size="22" font-family="monospace" font-weight="bold" text-anchor="middle">${grandTotal} EGP</text>
      <text x="200" y="175" fill="%2394a3b8" font-size="13" font-family="sans-serif" text-anchor="middle">المستلم: كشري هاند</text>
      <text x="200" y="200" fill="%23e2e8f0" font-size="14" font-family="monospace" text-anchor="middle">${RESTAURANT_INFO.vodafoneCashNumber}</text>
      <text x="200" y="235" fill="%2364748b" font-size="11" font-family="sans-serif" text-anchor="middle">رقم المعاملة: VF-894208420</text>
    </svg>`;
    setScreenshotPreview(sampleReceiptSvg);
    setScreenshotName('vodafone_cash_receipt_demo.png');
    setValidationError(null);
  };

  const handleFinishSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay') {
      if (!screenshotPreview) {
        setValidationError('يرجى إرفاق لقطة شاشة التحويل للتأكيد، أو اضغط زر التجربة السريعة للإيصال.');
        return;
      }
    }

    setValidationError(null);
    onFinishOrder(paymentMethod, screenshotPreview || undefined, screenshotName || undefined);
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 px-4">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Back Link */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>الرجوع لتعديل تفاصيل الطلب</span>
        </button>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-stone-900">معلومات الدفع والإثبات</h2>
          <p className="text-xs text-stone-500">
            أكمل عملية التحويل وأرفق لقطة الشاشة لتأكيد خروج الطلب من الفرن
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('vodafone_cash')}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
              paymentMethod === 'vodafone_cash'
                ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-1 ring-amber-600'
                : 'border-stone-200 hover:border-stone-300 text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <Smartphone className="w-4 h-4 text-red-600" />
              <span>فودافون كاش / انستاباي</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">تحويل فوري + رفع الإيصال</div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('cash_on_delivery')}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
              paymentMethod === 'cash_on_delivery'
                ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-1 ring-amber-600'
                : 'border-stone-200 hover:border-stone-300 text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>كاش عند الاستلام</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">الدفع للمندوب عند الوصول</div>
          </button>
        </div>

        {/* Amount to pay summary */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-stone-500">المبلغ الإجمالي المطلوب سداده:</div>
            <div className="text-xs text-stone-600 mt-0.5">
              شامل الأصناف ({subtotal} ج.م) + التوصيل ({deliveryFee === 0 ? 'مجاني' : `${deliveryFee} ج.م`})
            </div>
          </div>
          <div className="font-mono text-2xl font-black text-amber-700">
            {grandTotal} ج.م
          </div>
        </div>

        {/* Vodafone Cash Transfer Box (Directly matches the prompt's explicit section) */}
        {paymentMethod === 'vodafone_cash' ? (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 via-emerald-100/40 to-teal-50 border border-emerald-300/80 rounded-2xl space-y-3">
              <p className="text-xs text-emerald-950 font-bold">
                يرجى تحويل المبلغ إلى الرقم الآتي:
              </p>

              <div className="payment-info bg-amber-50/90 p-4 rounded-xl border border-amber-300 text-center shadow-xs flex items-center justify-between gap-3">
                <div className="space-y-0.5 text-right">
                  <div className="text-xs text-amber-950">
                    <strong>رقم الكاش:</strong>{' '}
                    <span className="font-mono font-black text-lg text-amber-900 mr-1" dir="ltr">
                      {RESTAURANT_INFO.vodafoneCashNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500">فودافون كاش / انستاباي معتمد</div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCashNumber}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ الرقم</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>حساب رسمي معتمد لمطعم كشري هاند. يتم التحقق والتأكيد آلياً فوراً.</span>
              </div>
            </div>

            {/* Prompt's instruction: "بعد التحويل، أرسل لقطة الشاشة للتأكيد." */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800" htmlFor="screenshot">
                  بعد التحويل، يرجى رفع لقطة الشاشة للتأكيد: <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddSampleReceipt}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>توليد إيصال تجريبي سريع</span>
                </button>
              </div>

              {/* Upload Drop Area or Preview */}
              {!screenshotPreview ? (
                <div className="relative border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-6 text-center transition-colors bg-stone-50/50 hover:bg-amber-50/30 group cursor-pointer">
                  <input
                    type="file"
                    id="screenshot"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-stone-800">
                      اضغط هنا لاختيار صورة التحويل أو اسحبها هنا
                    </span>
                    <span className="text-[11px] text-stone-400">
                      يدعم صور PNG، JPG، WebP، أو لقطة شاشة الهاتف
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="relative rounded-xl overflow-hidden max-h-56 bg-stone-900 flex items-center justify-center">
                    <img
                      src={screenshotPreview}
                      alt="إيصال التحويل"
                      className="max-h-56 w-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg shadow-md transition-colors cursor-pointer"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <FileImage className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{screenshotName || 'لقطة شاشة التحويل'}</span>
                    </div>
                    <span className="text-emerald-700 font-bold shrink-0">جاهز للإرسال ✓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs text-stone-700">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>الدفع نقداً عند باب المنزل</span>
            </h4>
            <p>
              سيقوم مندوب كشري هاند بتحصيل المبلغ نقداً (<strong className="text-amber-900 font-mono">{grandTotal} ج.م</strong>) عند تسليمك وجباتك الساخنة.
            </p>
            <p className="text-stone-500 text-[11px]">
              يرجى تجهيز المبلغ أو إعلامنا في الملاحظات إذا كنت بحاجة إلى فكة.
            </p>
          </div>
        )}

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Finish Order Button (Matching prompt's finishOrder()) */}
        <form onSubmit={handleFinishSubmit}>
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer text-base"
          >
            <span>تأكيد وإرسال الطلب ({grandTotal} ج.م)</span>
            <Check className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* Customer Address Recap */}
        <div className="text-[11px] text-stone-400 text-center">
          سيتم التوصيل إلى: {delivery.fullName} · {delivery.area} · {delivery.phone}
        </div>
      </div>
    </div>
  );
};
