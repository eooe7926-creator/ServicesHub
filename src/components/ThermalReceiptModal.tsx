import React from 'react';
import { X, Printer, CheckCircle, Phone, MapPin, Receipt, Clock } from 'lucide-react';
import { Order } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

interface ThermalReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-stone-900">فاتورة طلب كشري هاند</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-100 flex justify-center">
          <div
            id="thermal-receipt-area"
            className="w-full max-w-[340px] bg-white p-6 shadow-sm border border-stone-200 rounded-lg font-mono text-stone-900 text-xs space-y-4"
          >
            {/* Header */}
            <div className="text-center space-y-1 border-b border-dashed border-stone-300 pb-4">
              <h2 className="font-black text-lg text-stone-900">كشري هاند 🥣</h2>
              <p className="text-[11px] text-stone-500">KOSHARY HAND EGYPT</p>
              <p className="text-[10px] text-stone-500">وسط البلد - شارع طلعت حرب</p>
              <p className="text-[10px] text-stone-500">الخط الساخن: {RESTAURANT_INFO.hotline}</p>
            </div>

            {/* Order meta */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-3">
              <div className="flex justify-between font-bold">
                <span>رقم الطلب:</span>
                <span className="text-sm font-black">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>التاريخ والوقت:</span>
                <span>{new Date(order.createdAt).toLocaleString('ar-EG')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>طريقة الدفع:</span>
                <span>
                  {order.paymentMethod === 'vodafone_cash'
                    ? 'فودافون كاش'
                    : order.paymentMethod === 'instapay'
                    ? 'إنستاباي'
                    : 'كاش عند الاستلام'}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-3 bg-stone-50 p-2 rounded">
              <div className="font-bold text-stone-800">بيانات العميل:</div>
              <div>الاسم: {order.delivery.fullName}</div>
              <div>الهاتف: {order.delivery.phone}</div>
              <div>
                العنوان: {order.delivery.area} - {order.delivery.street} (عمارة {order.delivery.building}، شقة {order.delivery.apartment})
              </div>
              {order.delivery.deliveryNotes && (
                <div className="text-amber-800 font-medium">
                  ملاحظة: {order.delivery.deliveryNotes}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 border-b border-dashed border-stone-300 pb-3">
              <div className="font-bold text-[11px] flex justify-between text-stone-500">
                <span>الصنف / الكمية</span>
                <span>الإجمالي</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-xs">
                    <span>
                      {item.quantity} × {item.menuItem.name} ({item.options.sizeName})
                    </span>
                    <span>{item.itemTotal} ج.م</span>
                  </div>
                  {item.options.notes && (
                    <div className="text-[10px] text-stone-500 pr-2">
                      ملاحظة: {item.options.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="space-y-1 text-xs border-b border-dashed border-stone-300 pb-3">
              <div className="flex justify-between text-stone-600">
                <span>المجموع الفرعي:</span>
                <span>{order.subtotal} ج.م</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>رسوم التوصيل:</span>
                <span>{order.deliveryFee === 0 ? 'مجاني' : `${order.deliveryFee} ج.م`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>-{order.discount} ج.م</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm pt-1 border-t border-stone-200">
                <span>المبلغ الإجمالي:</span>
                <span>{order.total} ج.م</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center space-y-1 pt-2 text-[10px] text-stone-500">
              <p>شكراً لطلبكم من كشري هاند!</p>
              <p>بالهنا والشفا · نتمنى لكم وجبة شهية 😋</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
