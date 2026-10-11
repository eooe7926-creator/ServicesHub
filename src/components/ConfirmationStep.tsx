import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  RotateCcw,
  Printer,
  ChevronRight,
  Sparkles,
  Truck,
  CookingPot,
  Eye,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderStatus } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

interface ConfirmationStepProps {
  order: Order;
  onNewOrder: () => void;
  onViewAllOrders: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const STATUS_STAGES: {
  status: OrderStatus;
  title: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    status: 'received',
    title: 'تم استلام الطلب والإيصال',
    desc: 'تم تسجيل طلبك وإرسال الإشعار لمطبخ كشري هاند ومراجعة لقطة شاشة الكاش.',
    icon: FileCheck,
  },
  {
    status: 'preparing',
    title: 'جاري التحضير في المطبخ',
    desc: 'الشيف يقوم بسكب الكشري الطازج، تحميص التقلية، وتجهيز الطواجن بالفرن.',
    icon: CookingPot,
  },
  {
    status: 'on_the_way',
    title: 'الطلب مع مندوب التوصيل',
    desc: 'الوجبات الساخنة في الطريق إلى عنوانك الآن مع الدليفري.',
    icon: Truck,
  },
  {
    status: 'delivered',
    title: 'تم التسليم بالهناء والشفاء!',
    desc: 'ألف صحة وعافية. نأمل أن تنال وجبة كشري هاند إعجابك.',
    icon: CheckCircle2,
  },
];

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  order,
  onNewOrder,
  onViewAllOrders,
  onUpdateOrderStatus,
}) => {
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d97706', '#b45309', '#10b981', '#ef4444', '#f59e0b'],
      });
    } catch {
      // safe fallback if canvas not available
    }
  }, []);

  const currentStageIndex = STATUS_STAGES.findIndex(
    (s) => s.status === order.status
  );
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  // Generate WhatsApp message content for 1-tap customer follow-up
  const generateWhatsAppUrl = () => {
    const itemsList = order.items
      .map((i) => `• ${i.menuItem.name} (${i.quantity}x) [${i.itemTotal} ج.م]`)
      .join('\n');

    const msg = `*طلب جديد من كشري هاند 🍲*
رقم الطلب: ${order.orderNumber}
الاسم: ${order.delivery.fullName}
الهاتف: ${order.delivery.phone}
العنوان: ${order.delivery.area} - ${order.delivery.street} (عمارة: ${order.delivery.building})
طريقة الدفع: ${order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش (تم إرفاق الإيصال)' : 'كاش عند الاستلام'}
الإجمالي: ${order.total} ج.م

الطلبات:
${itemsList}

ملاحظات: ${order.delivery.deliveryNotes || 'لا توجد'}`;

    return `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  const handleAdvanceSimulation = () => {
    const sequence: OrderStatus[] = ['received', 'preparing', 'on_the_way', 'delivered'];
    const idx = sequence.indexOf(order.status);
    const nextStatus = sequence[(idx + 1) % sequence.length];
    onUpdateOrderStatus(order.id, nextStatus);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-4 space-y-6">
      {/* Top Banner (Exact prompt text) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce shadow-md">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            تم إرسال الطلب بنجاح!
          </h2>
          <p className="text-sm font-medium text-stone-600">
            سيتم التواصل معك قريباً لتأكيد الحجز والتوصيل.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full text-xs">
          <span className="text-stone-500">رقم طلبك:</span>
          <span className="font-mono font-black text-amber-800 text-sm tracking-wider">
            {order.orderNumber}
          </span>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            التوصيل المتوقع: خلال ٣٥ دقيقة
          </span>
        </div>
      </div>

      {/* Live Order Status Tracker */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>متابعة حالة الطلب الحية</span>
          </h3>
          <button
            type="button"
            onClick={handleAdvanceSimulation}
            className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
            title="تجربة تقدم حالة التوصيل"
          >
            تقدم المرحلة تجريبياً ↻
          </button>
        </div>

        {/* Vertical/Horizontal Steps */}
        <div className="space-y-4">
          {STATUS_STAGES.map((stage, idx) => {
            const isDone = activeIndex > idx;
            const isCurrent = activeIndex === idx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.status}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isCurrent
                    ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-500'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-stone-100 bg-stone-50/50 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-amber-600 text-white animate-pulse'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-black text-xs sm:text-sm ${
                        isCurrent
                          ? 'text-amber-950 font-extrabold'
                          : isDone
                          ? 'text-emerald-950'
                          : 'text-stone-600'
                      }`}
                    >
                      {stage.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        المرحلة الحالية
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        مكتمل ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Quick Action Button */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-black text-base">إرسال تفاصيل الطلب عبر واتساب</h3>
            <p className="text-xs text-emerald-100 mt-1">
              تواصل مباشرة مع إدارة كشري هاند لتسريع التأكيد ومتابعة المندوب لحظياً.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>

        <a
          href={generateWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-white text-emerald-800 hover:bg-emerald-50 font-bold py-3 px-4 rounded-xl shadow-xs transition-colors cursor-pointer text-xs sm:text-sm"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
          <span>فتح محادثة واتساب المطعم بنقرة واحدة</span>
        </a>
      </div>

      {/* Invoice Details Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-black text-base text-stone-900">فاتورة الطلب</h3>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
        </div>

        {/* Customer & Address Recap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-stone-400 block">بيانات العميل:</span>
            <div className="font-bold text-stone-800">{order.delivery.fullName}</div>
            <div className="text-stone-600 font-mono" dir="ltr">{order.delivery.phone}</div>
          </div>

          <div className="space-y-1">
            <span className="text-stone-400 block">عنوان التوصيل:</span>
            <div className="font-bold text-stone-800">
              {order.delivery.area} - {order.delivery.street}
            </div>
            <div className="text-stone-600">
              {order.delivery.building} · {order.delivery.apartment}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-stone-100 pt-2">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-stone-900">
                  {item.quantity}x {item.menuItem.name}
                </div>
                {item.options.sizeName && (
                  <div className="text-[11px] text-stone-500">
                    الحجم: {item.options.sizeName}
                  </div>
                )}
              </div>
              <div className="font-mono font-bold text-stone-800">
                {item.itemTotal} ج.م
              </div>
            </div>
          ))}
        </div>

        {/* Payment recap */}
        <div className="pt-2 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>المجموع الفرعي:</span>
            <span className="font-mono">{order.subtotal} ج.م</span>
          </div>
          <div className="flex justify-between">
            <span>رسوم التوصيل:</span>
            <span className="font-mono">
              {order.deliveryFee === 0 ? 'مجاناً' : `${order.deliveryFee} ج.م`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>الخصم:</span>
              <span className="font-mono">-{order.discount} ج.م</span>
            </div>
          )}
          <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-stone-900">
            <span>الإجمالي المدفوع:</span>
            <span className="font-mono text-base text-amber-700">{order.total} ج.م</span>
          </div>
        </div>

        {/* Attached Screenshot preview */}
        {order.paymentScreenshot && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-600">لقطة شاشة التحويل المرفقة:</span>
            <button
              type="button"
              onClick={() => setShowScreenshotModal(true)}
              className="text-amber-700 font-bold hover:underline flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة الإيصال</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onNewOrder}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>طلب وجبة جديدة من كشري هاند</span>
        </button>

        <button
          type="button"
          onClick={onViewAllOrders}
          className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold py-3.5 px-4 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm"
        >
          <span>عرض جميع طلباتي السابقة</span>
        </button>
      </div>

      {/* Modal for Screenshot Preview */}
      {showScreenshotModal && order.paymentScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowScreenshotModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-stone-900">لقطة شاشة تحويل الكاش</h4>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="text-stone-500 hover:text-stone-800 text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
            <div className="bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center max-h-96">
              <img
                src={order.paymentScreenshot}
                alt="إيصال التحويل"
                className="max-h-96 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
