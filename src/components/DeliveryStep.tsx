import React, { useState } from 'react';
import { User, Phone, MapPin, Building, FileText, ArrowRight, ArrowLeft, Clock, ShieldAlert } from 'lucide-react';
import { DeliveryDetails } from '../types';
import { CAIRO_AREAS } from '../data/menuData';

interface DeliveryStepProps {
  initialDetails: DeliveryDetails;
  onSaveDetails: (details: DeliveryDetails) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  initialDetails,
  onSaveDetails,
  onProceed,
  onBack,
}) => {
  const [fullName, setFullName] = useState(initialDetails.fullName || '');
  const [phone, setPhone] = useState(initialDetails.phone || '');
  const [secondaryPhone, setSecondaryPhone] = useState(initialDetails.secondaryPhone || '');
  const [area, setArea] = useState(initialDetails.area || CAIRO_AREAS[0]);
  const [street, setStreet] = useState(initialDetails.street || '');
  const [building, setBuilding] = useState(initialDetails.building || '');
  const [apartment, setApartment] = useState(initialDetails.apartment || '');
  const [deliveryNotes, setDeliveryNotes] = useState(initialDetails.deliveryNotes || '');
  const [deliveryType, setDeliveryType] = useState<'immediate' | 'scheduled'>(initialDetails.deliveryType || 'immediate');
  const [scheduledTime, setScheduledTime] = useState(initialDetails.scheduledTime || 'خلال ساعة');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError('يرجى كتابة الاسم الكامل');
      return;
    }

    if (!phone.trim() || phone.trim().length < 9) {
      setError('يرجى إدخال رقم هاتف / واتساب صحيح للتواصل');
      return;
    }

    if (!street.trim()) {
      setError('يرجى إدخال اسم الشارع أو العنوان التقريبي');
      return;
    }

    setError(null);
    onSaveDetails({
      fullName: fullName.trim(),
      phone: phone.trim(),
      secondaryPhone: secondaryPhone.trim(),
      city: 'القاهرة / الجيزة',
      area,
      street: street.trim(),
      building: building.trim() || 'غير محدد',
      apartment: apartment.trim() || 'غير محدد',
      deliveryNotes: deliveryNotes.trim(),
      deliveryType,
      scheduledTime: deliveryType === 'scheduled' ? scheduledTime : undefined,
    });
    onProceed();
  };

  const handleQuickDemoFill = () => {
    setFullName('أحمد عبد الرحمن');
    setPhone('01098765432');
    setArea('وسط البلد / التحرير');
    setStreet('شارع قصر النيل بجوار ميدان التحرير');
    setBuilding('عمارة رقم ١٤');
    setApartment('الدور الثالث - شقة ٦');
    setDeliveryNotes('رن الجرس أو ابعت على الواتساب عند الوصول');
    setError(null);
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 px-4">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>الرجوع للخطوة السابقة</span>
          </button>

          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors"
          >
            تعبئة بيانات تجريبية سريعة
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-stone-900">تفاصيل التوصيل والطلب</h2>
          <p className="text-xs text-stone-500">
            أدخل بيانات التوصيل حتى يصلك طلب كشري هاند ساخناً وفي الوقت المحدد
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800" htmlFor="username">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              <input
                id="username"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError(null);
                }}
                placeholder="الاسم الكامل"
                className="w-full text-xs pr-10 pl-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                required
              />
            </div>
          </div>

          {/* Primary Phone / WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800" htmlFor="phone">
                رقم الموبايل / الواتساب <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError(null);
                  }}
                  placeholder="رقم الموبايل / الواتساب"
                  className="w-full text-xs pr-10 pl-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors font-mono"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800" htmlFor="secondaryPhone">
                رقم إضافي بديل (اختياري)
              </label>
              <input
                id="secondaryPhone"
                type="tel"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                placeholder="رقم آخر إن وجد"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors font-mono"
                dir="ltr"
              />
            </div>
          </div>

          {/* Area Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              منطقة أو حي التوصيل
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full text-xs pr-10 pl-3 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors cursor-pointer"
              >
                {CAIRO_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed Street Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800" htmlFor="street">
              اسم الشارع والعلامة المميزة <span className="text-red-500">*</span>
            </label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => {
                setStreet(e.target.value);
                setError(null);
              }}
              placeholder="مثال: شارع التحرير، أمام محطة المترو مباشرة"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              required
            />
          </div>

          {/* Building and Apartment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800" htmlFor="building">
                رقم العمارة / المبنى
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
                <input
                  id="building"
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="عمارة ١٢"
                  className="w-full text-xs pr-10 pl-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800" htmlFor="apartment">
                رقم الشقة / الدور
              </label>
              <input
                id="apartment"
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="شقة ٤ - الدور الثاني"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          {/* Delivery Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              موعد التوصيل
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('immediate')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  deliveryType === 'immediate'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>الآن (٣٠ - ٤٥ دقيقة)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('scheduled')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  deliveryType === 'scheduled'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>تحديد وقت لاحق</span>
              </button>
            </div>
          </div>

          {/* Delivery Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800" htmlFor="notes">
              ملاحظات إضافية للتوصيل والمندوب
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              <textarea
                id="notes"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="مثال: الاتصال قبل الوصول بـ ٥ دقائق، ترك الطلب عند الأمن..."
                rows={2}
                className="w-full text-xs pr-10 pl-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button (Matching prompt text: "تأكيد البيانات والانتقال للدفع") */}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
          >
            <span>الانتقال للدفع</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
