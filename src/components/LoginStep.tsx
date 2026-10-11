import React, { useState } from 'react';
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  Smartphone,
  Sparkles,
  User,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { UserProfile, CartItem, RegisteredAccount } from '../types';

interface LoginStepProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onProceed: () => void;
  onBackToMenu: () => void;
  cart: CartItem[];
  onRegisterAccount?: (account: RegisteredAccount) => void;
}

export const LoginStep: React.FC<LoginStepProps> = ({
  userProfile,
  onUpdateProfile,
  onProceed,
  onBackToMenu,
  cart,
  onRegisterAccount,
}) => {
  // Login Method: 'google' | 'phone' | 'email' | 'guest'
  const [authMethod, setAuthMethod] = useState<'google' | 'phone' | 'email'>('google');

  // Form states
  const [fullName, setFullName] = useState(userProfile.fullName || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartTotal = cart.reduce((acc, i) => acc + i.itemTotal, 0);

  // 1. One-Click Google Login
  const handleGoogleLogin = (mockEmail: string, mockName: string) => {
    const profile: Partial<UserProfile> = {
      fullName: mockName,
      email: mockEmail,
      phone: phone || '01012345678',
      isLoggedIn: true,
      provider: 'google',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    };
    onUpdateProfile(profile);

    if (onRegisterAccount) {
      onRegisterAccount({
        id: `user-${Date.now()}`,
        fullName: mockName,
        email: mockEmail,
        phone: phone || '01012345678',
        provider: 'google',
        createdAt: new Date().toISOString(),
        totalOrdersCount: 1,
        totalSpent: cartTotal,
      });
    }

    onProceed();
  };

  // 2. Phone OTP Login
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.length < 10) {
      setError('يرجى إدخال رقم هاتف محمول مصري صحيح (مثال: 01012345678)');
      return;
    }
    setError(null);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234' && otpCode.length < 4) {
      setError('كود التحقق غير صحيح. كود التجربة التلقائي هو: 1234');
      return;
    }

    const name = fullName.trim() || 'عميل كشري هاند';
    const profile: Partial<UserProfile> = {
      fullName: name,
      phone: phone.trim(),
      email: email.trim() || `${phone.trim()}@user.kosharyhand.com`,
      isLoggedIn: true,
      provider: 'phone',
    };
    onUpdateProfile(profile);

    if (onRegisterAccount) {
      onRegisterAccount({
        id: `user-${Date.now()}`,
        fullName: name,
        phone: phone.trim(),
        email: profile.email || '',
        provider: 'phone',
        createdAt: new Date().toISOString(),
        totalOrdersCount: 1,
        totalSpent: cartTotal,
      });
    }

    onProceed();
  };

  // 3. Email & Password Login / Register
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
      return;
    }

    const name = fullName.trim() || email.split('@')[0];
    const profile: Partial<UserProfile> = {
      fullName: name,
      email: email.trim(),
      phone: phone.trim() || '01000000000',
      isLoggedIn: true,
      provider: 'email',
    };
    onUpdateProfile(profile);

    if (onRegisterAccount) {
      onRegisterAccount({
        id: `user-${Date.now()}`,
        fullName: name,
        email: email.trim(),
        phone: profile.phone || '',
        provider: 'email',
        createdAt: new Date().toISOString(),
        totalOrdersCount: 1,
        totalSpent: cartTotal,
      });
    }

    onProceed();
  };

  // 4. Instant Guest Mode
  const handleGuestContinue = () => {
    const profile: Partial<UserProfile> = {
      fullName: 'زائر المطعم',
      email: 'guest@kosharyhand.com',
      phone: '01000000000',
      isLoggedIn: true,
      provider: 'guest',
    };
    onUpdateProfile(profile);
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
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100/70 flex items-center justify-center text-amber-700 mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-stone-900">تسجيل الدخول للطلب</h2>
          <p className="text-xs text-stone-500">
            متاح لجميع المستخدمين بسهولة وبدون أي رسوم
          </p>
        </div>

        {/* Cart preview */}
        {cart.length > 0 && (
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-stone-700">
              عدد الوجبات بالسلة: <strong className="text-stone-900 font-mono">{cart.length}</strong>
            </span>
            <span className="font-mono font-black text-amber-800">{cartTotal} ج.م</span>
          </div>
        )}

        {/* Auth Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('google');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              authMethod === 'google'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            حساب Google
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              authMethod === 'phone'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            رقم الموبايل
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              authMethod === 'email'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            البريد وكلمة السر
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. GOOGLE AUTH METHOD */}
        {authMethod === 'google' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>دخول سريع ومباشر بحساب Google</span>
              </p>
              <p className="text-stone-600 text-[11px]">
                اختر حسابك المفضل للدخول الفوري ومتابعة طلبك بدون الحاجة لكتابة كلمات مرور
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleLogin('ahmed.koshary@gmail.com', 'أحمد محمود')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 hover:bg-stone-50 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    G
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-900">أحمد محمود</div>
                    <div className="text-[10px] text-stone-400">ahmed.koshary@gmail.com</div>
                  </div>
                </div>
                <span className="text-amber-700 font-bold">تسجيل الدخول</span>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleLogin('sarah.aly@gmail.com', 'سارة علي')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 hover:bg-stone-50 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                    G
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-900">سارة علي</div>
                    <div className="text-[10px] text-stone-400">sarah.aly@gmail.com</div>
                  </div>
                </div>
                <span className="text-amber-700 font-bold">تسجيل الدخول</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const customName = prompt('أدخل اسمك الكريم:') || 'عميل كشري هاند';
                  const customEmail = prompt('أدخل بريدك الإلكتروني:') || 'user@gmail.com';
                  handleGoogleLogin(customEmail, customName);
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-bold transition-all text-center"
              >
                + الدخول بحساب Google آخر
              </button>
            </div>
          </div>
        )}

        {/* 2. PHONE OTP METHOD */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">الاسم الكامل</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: كريم محمود"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">رقم الهاتف المحمول</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full text-xs pr-9 pl-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-600 font-mono text-right"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  إرسال كود التحقق (OTP)
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                  <span>تم إرسال كود التحقق لرقم: {phone}</span>
                  <span className="font-mono font-bold bg-emerald-200 px-1.5 py-0.5 rounded text-[10px]">
                    كود التجربة: 1234
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">أدخل كود التحقق (٤ أرقام)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full text-center tracking-widest font-mono text-base py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
                >
                  تأكيد الدخول ومتابعة الطلب
                </button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-[11px] text-stone-500 hover:text-stone-800 underline text-center"
                >
                  تعديل رقم الهاتف
                </button>
              </form>
            )}
          </div>
        )}

        {/* 3. EMAIL METHOD */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">الاسم الكامل</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أحمد محمد"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-200"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full text-xs pr-9 pl-3 py-2.5 rounded-xl border border-stone-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">كلمة المرور</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pr-9 pl-3 py-2.5 rounded-xl border border-stone-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs"
            >
              تسجيل الدخول / إنشاء حساب
            </button>
          </form>
        )}

        {/* Guest Alternative Option */}
        <div className="pt-2 border-t border-stone-100 text-center">
          <button
            type="button"
            onClick={handleGuestContinue}
            className="text-xs text-stone-500 hover:text-stone-900 underline font-medium"
          >
            أو المتابعة السريعة كزائر دون تسجيل حساب
          </button>
        </div>
      </div>
    </div>
  );
};
