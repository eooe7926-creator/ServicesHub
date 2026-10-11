import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, ArrowLeft, UserCheck, ShieldAlert } from 'lucide-react';
import { UserProfile, CartItem } from '../types';

interface LoginStepProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onProceed: () => void;
  onBackToMenu: () => void;
  cart: CartItem[];
}

export const LoginStep: React.FC<LoginStepProps> = ({
  userProfile,
  onUpdateProfile,
  onProceed,
  onBackToMenu,
  cart,
}) => {
  const [email, setEmail] = useState(userProfile.email || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(userProfile.rememberMe ?? true);
  const [error, setError] = useState<string | null>(null);

  const cartTotal = cart.reduce((acc, i) => acc + i.itemTotal, 0);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني للمتابعة');
      return;
    }
    if (!email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('يرجى إدخال كلمة المرور (٤ أحرف أو أرقام على الأقل)');
      return;
    }

    setError(null);
    onUpdateProfile({
      email: email.trim(),
      isLoggedIn: true,
      rememberMe,
    });
    onProceed();
  };

  const handleGuestOrQuickFill = () => {
    const demoEmail = email.trim() || 'customer@kosharyhand.com';
    onUpdateProfile({
      email: demoEmail,
      isLoggedIn: true,
      rememberMe: true,
    });
    onProceed();
  };

  return (
    <div className="max-w-md mx-auto py-4 sm:py-8 px-4">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Back Link */}
        <button
          type="button"
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>الرجوع إلى قائمة الطعام</span>
        </button>

        {/* Heading */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-stone-900">تسجيل الدخول للطلب</h2>
          <p className="text-xs text-stone-500">
            سجّل دخولك لحفظ بيانات التوصيل ومتابعة حالة وجباتك فوراً
          </p>
        </div>

        {/* Order Preview Badge */}
        {cart.length > 0 && (
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-stone-700">
              عدد الأصناف في السلة: <strong className="text-stone-900 font-mono">{cart.length}</strong>
            </span>
            <span className="font-mono font-black text-amber-800">
              {cartTotal} ج.م
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800" htmlFor="email">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="example@mail.com"
                className="w-full text-xs pr-10 pl-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800" htmlFor="password">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
                className="w-full text-xs pr-10 pl-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Remember me & Quick hint */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
              />
              <span>تذكر بياناتي في هذا الجهاز</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
          >
            <span>دخول والمتابعة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        {/* Guest or Fast Demo Checkout Option */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <div className="text-center">
            <span className="text-[11px] text-stone-400">أو للمتابعة السريعة دون كلمة مرور</span>
          </div>

          <button
            type="button"
            onClick={handleGuestOrQuickFill}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-stone-600" />
            <span>المتابعة السريعة كضيف / تجربة فورية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
