import React from 'react';
import { Utensils, User, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  canNavigateTo: (step: number) => boolean;
}

const STEPS = [
  { number: 1, label: 'القائمة', icon: Utensils, subtext: 'الوجبات والسلة' },
  { number: 2, label: 'تسجيل الدخول', icon: User, subtext: 'حساب العميل' },
  { number: 3, label: 'تفاصيل الطلب', icon: MapPin, subtext: 'العنوان والاتصال' },
  { number: 4, label: 'معلومات الدفع', icon: CreditCard, subtext: 'فودافون كاش' },
  { number: 5, label: 'التأكيد والتتبع', icon: CheckCircle2, subtext: 'حالة الطلب' },
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onSelectStep,
  canNavigateTo,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      <nav aria-label="مراحل الطلب" className="relative">
        {/* Progress connecting line */}
        <div className="hidden sm:block absolute top-5 right-8 left-8 h-0.5 bg-stone-200 -z-0">
          <div
            className="h-full bg-amber-600 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-5 gap-1 sm:gap-2 relative z-10">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isClickable = canNavigateTo(step.number);
            const Icon = step.icon;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => isClickable && onSelectStep(step.number)}
                disabled={!isClickable}
                className={`flex flex-col items-center text-center group transition-all ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                {/* Circle Icon Indicator */}
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 mb-1.5 shadow-sm ${
                    isCurrent
                      ? 'bg-amber-600 text-white ring-4 ring-amber-100 scale-105'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-stone-400 border border-stone-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Text Labels */}
                <div className="min-w-0">
                  <span
                    className={`block text-[11px] sm:text-xs font-bold leading-tight truncate ${
                      isCurrent
                        ? 'text-amber-800'
                        : isCompleted
                        ? 'text-stone-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="hidden md:block text-[10px] text-stone-500 mt-0.5 truncate">
                    {step.subtext}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
