import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  CookingPot,
  Truck,
  TrendingUp,
  Receipt,
  FileImage,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onClearAllOrders?: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateStatus,
}) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-stone-900">
                لوحة تحكم الطلبات والمطبخ · كشري هاند
              </h3>
              <p className="text-[11px] text-stone-500">
                متابعة الطلبات اللحظية، مراجعة إيصالات فودافون كاش، وتحديث مراحل التوصيل
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-200/60"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 p-4 sm:p-5 border-b border-stone-100 bg-white">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="text-[11px] text-stone-500">إجمالي المبيعات:</div>
            <div className="font-mono font-black text-lg text-amber-700 mt-0.5">
              {totalSales} ج.م
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="text-[11px] text-stone-500">عدد الطلبات:</div>
            <div className="font-mono font-black text-lg text-stone-900 mt-0.5">
              {orders.length}
            </div>
          </div>
          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200">
            <div className="text-[11px] text-amber-800">طلبات قيد التجهيز والتوصيل:</div>
            <div className="font-mono font-black text-lg text-amber-900 mt-0.5">
              {pendingOrders}
            </div>
          </div>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Receipt className="w-12 h-12 mx-auto text-stone-300" />
              <p className="font-bold text-stone-700 text-sm">لا توجد طلبات واردة حالياً</p>
              <p className="text-xs text-stone-400">
                اطلب وجبة تجريبية من صفحة المتجر لتراها هنا فوراً!
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4"
              >
                {/* Top info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-base text-stone-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      {new Date(order.createdAt).toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                        order.paymentMethod === 'vodafone_cash'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'كاش عند الاستلام'}
                    </span>
                  </div>

                  <div className="font-mono font-black text-base text-amber-700">
                    {order.total} ج.م
                  </div>
                </div>

                {/* Customer and address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                  <div className="space-y-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span>العميل:</span>
                      <span>{order.delivery.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${order.delivery.phone}`}
                        className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 font-mono"
                        dir="ltr"
                      >
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <span>{order.delivery.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/2${order.delivery.phone.replace(/^0+/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-0.5 text-stone-600">
                    <div>
                      <strong>العنوان:</strong> {order.delivery.area} - {order.delivery.street}
                    </div>
                    <div>
                      {order.delivery.building} · {order.delivery.apartment}
                    </div>
                    {order.delivery.deliveryNotes && (
                      <div className="text-stone-500 italic text-[11px]">
                        ملاحظة: "{order.delivery.deliveryNotes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="text-xs space-y-1">
                  <div className="font-bold text-stone-700">الوجبات المطلوبة:</div>
                  <div className="space-y-1">
                    {order.items.map((i) => (
                      <div
                        key={i.cartItemId}
                        className="flex justify-between items-center text-stone-600 border-b border-stone-50 py-1"
                      >
                        <span>
                          {i.quantity}x {i.menuItem.name}
                          {i.options.sizeName ? ` (${i.options.sizeName})` : ''}
                        </span>
                        <span className="font-mono font-bold">{i.itemTotal} ج.م</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Screenshot Verification */}
                {order.paymentScreenshot && (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-medium">
                      <FileImage className="w-4 h-4 text-emerald-600" />
                      <span>إيصال تحويل فودافون كاش مرفق</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedScreenshot(order.paymentScreenshot || null)}
                      className="bg-white hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-lg border border-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة الإيصال</span>
                    </button>
                  </div>
                )}

                {/* Status Changer Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-stone-600">تحديث حالة المطبخ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { status: 'received' as const, label: 'تم الاستلام' },
                      { status: 'preparing' as const, label: 'في المطبخ' },
                      { status: 'on_the_way' as const, label: 'مع الدليفري' },
                      { status: 'delivered' as const, label: 'تم التسليم' },
                    ].map((st) => (
                      <button
                        key={st.status}
                        type="button"
                        onClick={() => onUpdateStatus(order.id, st.status)}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          order.status === st.status
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Screenshot full modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-60 bg-stone-950/85 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-sm text-stone-900">
                إيصال تحويل فودافون كاش للتحقق
              </h4>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="text-stone-500 hover:text-stone-900 text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
            <div className="bg-stone-100 rounded-xl overflow-hidden max-h-[70vh] flex items-center justify-center">
              <img
                src={selectedScreenshot}
                alt="إيصال كاش"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
