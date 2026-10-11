import React, { useState, useEffect } from 'react';
import { Users, Activity } from 'lucide-react';

export const UserStatsSection: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(1250);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Format count into Arabic comma style
  const formattedCount = userCount.toLocaleString('ar-EG');

  return (
    <div className="mt-8 p-5 bg-stone-900 text-white rounded-2xl shadow-lg border border-stone-800 text-center space-y-2 stats-section">
      <div className="flex items-center justify-center gap-2 text-stone-400 text-xs font-semibold">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <Activity className="w-3.5 h-3.5 text-emerald-400" />
        <span>نشاط حي على مدار الساعة في القاهرة</span>
      </div>

      <div className="text-base sm:text-lg text-stone-200 font-medium">
        عدد مستخدمي الموقع حالياً:{' '}
        <span
          id="user-count"
          className="font-mono font-black text-2xl sm:text-3xl text-amber-500 tracking-wider inline-block transition-transform duration-300"
        >
          {formattedCount}
        </span>
        <span className="text-xs text-stone-400 mr-1.5">عميل يتصفح الآن</span>
      </div>
    </div>
  );
};
