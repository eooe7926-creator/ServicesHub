import React, { useState } from 'react';
import { Download, Smartphone, Globe, Sparkles, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onOpenPublishGuide: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenPublishGuide }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('koshary_pwa_banner_dismissed') === 'true';
  });
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (dismissed || isInstalled) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => setDismissed(true), 3000);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('koshary_pwa_banner_dismissed', 'true');
  };

  return (
    <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white py-2.5 px-4 shadow-sm border-b border-amber-700/40 relative z-30">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Message */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-200">موقع ويب + تطبيق PWA مجاني 100%:</span>{' '}
            <span className="text-stone-300 hidden sm:inline">
              جاهز للنشر الفوري والتثبيت على أي موبايل بدون متجر وبدون الحاجة لفيزا أو بطاقة دفع!
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* In-App Install Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              {installedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-stone-950" />
                  <span>تم التثبيت بنجاح!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>تثبيت التطبيق على جهازك</span>
                </>
              )}
            </button>
          )}

          {/* iOS Safari Guide Button */}
          {isIOS && (
            <button
              onClick={onOpenPublishGuide}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold px-3 py-1 rounded-lg text-xs border border-amber-500/30 transition-colors"
            >
              طريقة التثبيت على الآيفون 📱
            </button>
          )}

          {/* Zero-Cost Publish Guide Button */}
          <button
            onClick={onOpenPublishGuide}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 border border-white/20 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>دليل النشر المجاني</span>
          </button>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="p-1 text-stone-400 hover:text-white rounded transition-colors"
            title="إخفاء الشريط"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
