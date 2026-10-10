import React from 'react';
import { X, Clock, MapPin, ShoppingBag, Eye, CheckCircle2, Truck, CookingPot } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  received: { label: 'تم الاستلام', bg: 'bg-blue-50', text: 'text-blue-700', icon: Clock },
  reviewing_payment: { label: 'مراجعة الكاش', bg: 'bg-amber-50', text: 'text-amber-800', icon: Clock },
  preparing: { label: 'في المطبخ', bg: 'bg-amber-100', text: 'text-amber-900', icon: CookingPot },
  on_the_way: { label: 'مع الدليفري', bg: 'bg-purple-50', text: 'text-purple-700', icon: Truck },
  delivered: { label: 'تم التسليم', bg: 'bg-emerald-50', text: 'text-emerald-800', icon: CheckCircle2 },
  cancelled: { label: 'ملغي', bg: 'bg-red-50', text: 'text-red-700', icon: X },
};

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-lg text-stone-900">طلباتي السابقة</h3>
            <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-mono font-bold">
              {orders.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-300" />
              <p className="text-sm font-bold text-stone-700">لا توجد طلبات مسجلة بعد</p>
              <p className="text-xs text-stone-400">
                عند إتمام أول طلب كشري، ستظهر جميع الفواتير ومراحل التوصيل هنا.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.received;
              const StatusIcon = statusCfg.icon;

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400/80 transition-all bg-white hover:bg-stone-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-stone-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-stone-400">·</span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md ${statusCfg.bg} ${statusCfg.text}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusCfg.label}</span>
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-stone-600 line-clamp-1">
                    {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(' ، ')}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                    <div className="font-mono font-black text-amber-700 text-sm">
                      {order.total} ج.م
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectOrder(order);
                        onClose();
                      }}
                      className="text-stone-700 hover:text-amber-800 font-bold flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>تتبع وفاتورة الطلب</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
