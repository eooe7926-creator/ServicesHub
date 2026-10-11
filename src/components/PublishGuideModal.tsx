import React, { useState } from 'react';
import {
  X,
  Globe,
  UploadCloud,
  CheckCircle2,
  Download,
  Terminal,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Info,
} from 'lucide-react';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPWA?: () => void;
  isInstallable?: boolean;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({
  isOpen,
  onClose,
  onInstallPWA,
  isInstallable,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'hosts' | 'pwa' | 'export'>('quick');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl">
                  دليل النشر المجاني 100% على جوجل والإنترنت
                </h3>
                <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  بدون فيزا أو دفع
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                طريقة نشر الموقع وتشغيله فوراً على هواتف المستخدمين مجاناً بدون الحاجة لأي بطاقة بنكية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2 gap-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'quick'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>لماذا لا تحتاج لدفع أي مبالغ؟</span>
          </button>

          <button
            onClick={() => setActiveTab('hosts')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'hosts'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>أفضل 3 استضافات مجانية 100%</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'pwa'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span>تثبيت كتطبيق موبايل (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'export'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>خطوات بناء المشروع وتحميله</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-stone-800">
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex gap-3.5">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1.5 leading-relaxed">
                  <p className="font-bold text-amber-950 text-sm">
                    سبب طلب معلومات الدفع منك:
                  </p>
                  <p className="text-stone-700">
                    عند محاولة رفع تطبيق كملف APK على <strong>Google Play Console</strong>، تشترط جوجل رسماً إلزامياً بقيمة <strong>25 دولاراً</strong> وبطاقة بنكية دولية لفتح حساب مطور.
                  </p>
                  <p className="text-stone-700">
                    <strong>الحل الأمثل والذكي:</strong> نشر التطبيق كـ <strong>Web App (تطبيق ويب تقدمي PWA)</strong>. يمنحك ذلك موقعاً حقيقياً مع رابط دوت كوم، ويعمل كتطبيق كامل على هواتف العملاء بشاشتهم الرئيسية دون دفع مليم واحد ودون الحاجة لأي بطاقة دفع!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <h4 className="font-black text-sm text-stone-900">مجاني 100% مدى الحياة</h4>
                  <p className="text-[11px] text-stone-600 leading-normal">
                    لا يطلب أي بطاقة ائتمان أو كارت بنكي. النشر مجاني بالكامل على Vercel أو Netlify.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    📱
                  </div>
                  <h4 className="font-black text-sm text-stone-900">تثبيت فوري على الهواتف</h4>
                  <p className="text-[11px] text-stone-600 leading-normal">
                    يظهر للمستخدم زر "تثبيت التطبيق" على أندرويد وآيفون، ويفتح بأيقونة كاملة وبدون شريط متصفح.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <h4 className="font-black text-sm text-stone-900">أرشفة على بحث جوجل</h4>
                  <p className="text-[11px] text-stone-600 leading-normal">
                    يتم أرشفته فوراً على محرك بحث جوجل (Google Search) ليجده أي شخص يبحث عن كشري هاند.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hosts' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                إليك أفضل 3 منصات عالمية موثوقة تتيح لك نشر هذا الموقع برابط مجاني دائم (مثل <span className="font-mono text-amber-700">koshary-hand.vercel.app</span>) بدون طلب أي بطاقة دفع:
              </p>

              <div className="space-y-3">
                {/* Vercel */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900">1. منصة Vercel (الأسهل والأسرع)</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        مجاني 0$
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      سجل دخول بحساب GitHub أو بريدك الإلكتروني، واختر المجلد أو المستودع، وسيتم النشر في ثوانٍ.
                    </p>
                  </div>
                  <a
                    href="https://vercel.com/signup"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-xl shrink-0"
                  >
                    <span>فتح Vercel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Netlify Drop */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900">2. منصة Netlify Drop (سحب وإفلات فوري)</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        بدون أوامر
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      افتح صفحة Netlify Drop واسحب مجلد <code className="bg-stone-100 px-1 py-0.5 rounded">dist</code> مباشرة وسيعطيك الرابط فوراً!
                    </p>
                  </div>
                  <a
                    href="https://app.netlify.com/drop"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-2 rounded-xl shrink-0"
                  >
                    <span>Netlify Drop</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* GitHub Pages */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-amber-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900">3. منصة GitHub Pages</span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        مستودع مجاني
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      ارفع الكود على حسابك في GitHub وفعل GitHub Pages من إعدادات المستودع بنقرة زر.
                    </p>
                  </div>
                  <a
                    href="https://pages.github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 px-3.5 py-2 rounded-xl shrink-0"
                  >
                    <span>شرح GitHub Pages</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs space-y-2">
                <div className="font-bold text-purple-900 text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-700" />
                  <span>تطبيق ويب تقدمي (PWA) مجهز بالفعل في هذا الموقع</span>
                </div>
                <p className="text-purple-800 leading-relaxed">
                  لقد قمنا بتهيئة ملفات <strong>Web App Manifest</strong> و <strong>Service Worker</strong> وأيقونات الهواتف (192px و 512px). بمجرد فتح أي شخص للموقع من متصفح الهاتف يظهر له خيار التثبيت تلقائياً.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-stone-200 rounded-2xl space-y-2 bg-stone-50">
                  <h4 className="font-black text-xs text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">🤖</span>
                    طريقة التثبيت على أندرويد (Google Chrome):
                  </h4>
                  <ol className="text-xs text-stone-600 list-decimal list-inside space-y-1.5 leading-normal">
                    <li>افتح رابط الموقع في متصفح Chrome.</li>
                    <li>اضغط على زر <strong>"تثبيت التطبيق"</strong> الذي يظهر أعلى الموقع.</li>
                    <li>أو اضغط على قائمة الثلاث نقاط في المتصفح ثم اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</li>
                    <li>يظهر التطبيق في قائمة التطبيقات كأي تطبيق رسمي!</li>
                  </ol>
                </div>

                <div className="p-4 border border-stone-200 rounded-2xl space-y-2 bg-stone-50">
                  <h4 className="font-black text-xs text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-800 text-white flex items-center justify-center text-[10px]">🍎</span>
                    طريقة التثبيت على آيفون (Apple Safari):
                  </h4>
                  <ol className="text-xs text-stone-600 list-decimal list-inside space-y-1.5 leading-normal">
                    <li>افتح رابط الموقع في متصفح Safari.</li>
                    <li>اضغط على زر المشاركة <strong>(Share / سهم لأعلى)</strong> أسفل الشاشة.</li>
                    <li>انزل لأسفل واختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</li>
                    <li>اضغط "إضافة" وسيظهر التطبيق بأيقونة كشري هاند.</li>
                  </ol>
                </div>
              </div>

              {isInstallable && (
                <div className="text-center pt-2">
                  <button
                    onClick={onInstallPWA}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>جرّب تثبيت التطبيق الآن على جهازك الحالي</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                لبناء ملفات الموقع النهائية الجاهزة للنشر فوراً، يمكنك تشغيل أمر البناء التالي:
              </p>

              <div className="p-3.5 bg-stone-900 rounded-xl text-stone-200 font-mono text-xs flex items-center justify-between">
                <span>npm run build</span>
                <button
                  onClick={() => copyToClipboard('npm run build', 'cmd')}
                  className="text-stone-400 hover:text-white p-1 text-[11px] flex items-center gap-1"
                >
                  {copiedText === 'cmd' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-2">
                <h4 className="font-black text-stone-900">ماذا ينتج عن أمر البناء؟</h4>
                <p className="text-stone-600 leading-relaxed">
                  يتم إنشاء مجلد باسم <strong className="font-mono text-amber-800">dist/</strong> يحتوي على كامل صفحات الموقع والمخططات والـ Service Worker في ملفات HTML و JS نقية وخفيفة جداً، جاهزة للرفع على أي استضافة دون الحاجة لسيرفر مدفوع.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>كشري هاند جاهز ومُجهّز كـ Web App بالكامل</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
          >
            فهمت، حسناً
          </button>
        </div>
      </div>
    </div>
  );
};
