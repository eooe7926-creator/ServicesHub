import React from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  FileText,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { StoreSettings } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  brandName: string;
  initialTab?: 'contact' | 'delivery' | 'privacy';
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose,
  settings,
  brandName,
  initialTab = 'contact',
}) => {
  const [activeTab, setActiveTab] = React.useState<'contact' | 'delivery' | 'privacy'>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const csPhone = settings.customerServicePhone || RESTAURANT_INFO.hotline;
  const csWhatsapp = settings.customerServiceWhatsapp || RESTAURANT_INFO.whatsappNumber;
  const deliveryManager = settings.deliveryManagerPhone || RESTAURANT_INFO.hotline;
  const specialists = settings.deliverySpecialists || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 text-right overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-sm">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-stone-900 m-0">
                خدمة العملاء والتوصيل والسياسة · {brandName}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                تواصل مباشر مع فريق العمل والمتخصصين في التوصيل وسياسة الخصوصية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100 bg-stone-50/50 p-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-white text-amber-900 shadow-xs border border-amber-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Phone className="w-4 h-4 text-amber-600" />
            <span>أرقام خدمة العملاء والدعم</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-white text-amber-900 shadow-xs border border-amber-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-600" />
            <span>فريق التوصيل والطيارين</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white text-amber-900 shadow-xs border border-amber-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>سياسة الخصوصية والشروط</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Tab 1: Customer Service Contacts */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900">رقم خدمة العملاء الموحد</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      متاح يومياً للطلبات والاستفسارات والشكاوى
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${csPhone}`}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-colors shrink-0 text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span dir="ltr">{csPhone}</span>
                </a>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900">واتساب خدمة العملاء المباشر</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      تواصل فوري لإرسال إيصالات الدفع أو متابعة موقع الدليفري
                    </p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/2${csWhatsapp.replace(/^0+/, '').replace(/^\+2/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-colors shrink-0 text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>محادثة واتساب فورية</span>
                </a>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900">مسؤول عمليات التوصيل واللوجستيات</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      للتواصل المباشر في حالات تأخر الطلبات أو تغيير عنوان التسليم
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${deliveryManager}`}
                  className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-colors shrink-0 text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span dir="ltr">{deliveryManager}</span>
                </a>
              </div>
            </div>
          )}

          {/* Tab 2: Delivery Specialists Team */}
          {activeTab === 'delivery' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-amber-950 font-medium">
                فريق الطيارين والمتخصصين على توصيل الطلبات لضمان وصول وجبتك ساخنة في أقل من ٣٠ دقيقة:
              </div>

              {specialists.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                  لا يوجد بيانات طيارين مسجلة حالياً، يمكنك التواصل مع مسؤول التوصيل: {deliveryManager}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {specialists.map((spec) => (
                    <div
                      key={spec.id}
                      className="bg-stone-50 hover:bg-amber-50/40 p-4 rounded-2xl border border-stone-200 space-y-2 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-stone-900">{spec.name}</h4>
                            <span className="text-[10px] text-stone-500">متخصص توصيل</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          spec.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {spec.isAvailable ? 'متاح للطلب' : 'في مهمة'}
                        </span>
                      </div>

                      <div className="text-[11px] text-stone-600 space-y-1 pt-1 border-t border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>منطقة التغطية: <strong>{spec.area}</strong></span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-stone-500">المركبة: {spec.vehicle}</span>
                          <a
                            href={`tel:${spec.phone}`}
                            className="text-amber-700 hover:text-amber-900 font-mono font-bold text-xs bg-amber-100/70 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span dir="ltr">{spec.phone}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Privacy Policy & Terms */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-black text-sm border-b pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>سياسة الخصوصية وحماية بيانات الزبائن</span>
                </div>
                <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line font-normal">
                  {settings.privacyPolicy ||
                    `نحن في ${brandName} نلتزم بحماية خصوصية عملائنا الكرام. لا يتم استخدام أرقام الهواتف أو العناوين إلا لغرض إيصال الطلبات وتأكيد حالة الدفع. نحن نضمن عدم مشاركة أي بيانات شخصية مع أي جهة خارجية تحت أي ظرف.`}
                </div>
              </div>

              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-black text-sm border-b pb-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>شروط الخدمة وضمانات جودة التوصيل</span>
                </div>
                <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line font-normal">
                  {settings.termsOfService ||
                    `١. يتم تحضير جميع الوجبات طازجة فور تأكيد إرفاق الدفع أو طلب الكاش.\n٢. في حال وجود أي ملاحظة على جودة الطعام أو تأخر التوصيل عن الموعد المحدد، يحق للعميل استبدال الوجبة فوراً أو استرداد قيمتها عبر التواصل مع خدمة العملاء.\n٣. يلتزم الطيار بتسليم الطلب ساخناً ومغلفاً ومرفقاً معه الدقة والشطة والتقلية الأصلية.`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            {brandName} · خدمة العملاء والتوصيل في خدمتكم ٢٤/٧
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2 px-5 rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
