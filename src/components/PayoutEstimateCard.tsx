import React from 'react';
import { ScrapCategory, WeightCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Banknote,
  AlertTriangle,
  Scale,
  Droplets,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface PayoutEstimateCardProps {
  category: ScrapCategory;
  weightCategory: WeightCategory;
  estimatedKg: number;
}

export const PayoutEstimateCard: React.FC<PayoutEstimateCardProps> = ({
  category,
  weightCategory,
  estimatedKg,
}) => {
  const { language } = useLanguage();
  const minPayout = Math.round(estimatedKg * category.minRate);
  const maxPayout = Math.round(estimatedKg * category.maxRate);
  const avgPayout = Math.round(estimatedKg * category.ratePerKg);

  return (
    <div className="space-y-4">
      {/* Payout Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-800/20 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 p-5 sm:p-6 text-white shadow-md">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Banknote className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {language === 'hi' ? 'अनुमानित भुगतान राशि' : 'Rough Estimate of Payout'}
              </span>
            </div>
            <span className="rounded-full bg-emerald-800/50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-200 border border-emerald-600/30">
              {language === 'hi' ? 'घर पर तत्काल UPI / नकद भुगतान' : 'Instant UPI / Cash at Doorstep'}
            </span>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-300">
                  ₹{minPayout} - ₹{maxPayout}
                </span>
                <span className="text-xs font-semibold text-emerald-100/70">
                  {language === 'hi' ? `(औसत अनुमानित ₹${avgPayout})` : `(Estimated avg ₹${avgPayout})`}
                </span>
              </div>
              <p className="mt-1 text-xs text-emerald-100/80">
                {language === 'hi'
                  ? `~${estimatedKg} किलो ${category.hindiName || category.name} के लिए ₹${category.ratePerKg}/किलो की मानक बाजार दर पर आकलित।`
                  : `Calculated for ~${estimatedKg} kg of ${category.name} at standard market rate of ₹${category.ratePerKg}/kg.`}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-xs">
              <div className="inline-flex items-center gap-1.5 text-emerald-200">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'शून्य पिकअप शुल्क' : 'Zero pickup fee guaranteed'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'सटीक डिजिटल तराजू' : 'Calibrated Digital Scales'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimers Box */}
      <div className="rounded-xl border border-amber-300 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/30 p-4 text-amber-950 dark:text-amber-200 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-900 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          {language === 'hi' ? 'महत्वपूर्ण तौल व भुगतान शर्तें' : 'Important Weighing & Payment Disclaimers'}
        </div>

        <ul className="mt-2.5 space-y-2 text-xs text-amber-900/90 dark:text-amber-200/90">
          <li className="flex items-start gap-2 leading-relaxed">
            <Scale className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>{language === 'hi' ? 'वास्तविक वजन एवं ग्रेड सत्यापन:' : 'Actual Weight & Grade Check:'}</strong>{' '}
              {language === 'hi'
                ? 'वास्तविक मूल्य आपके सामने सटीक डिजिटल तराजू से तौलने के बाद तय होगा। उच्च श्रेणी के पीसीबी (मदरबोर्ड/रैम) के लिए प्लास्टिक केसिंग की तुलना में अधिक दर मिलती है।'
                : 'Real prices may vary according to the actual weight which will be checked at the time of pickup using calibrated digital scales in front of you. High-grade PCBs (motherboards/RAM) carry premium payouts compared to mixed plastic enclosures.'}
            </span>
          </li>
          <li className="flex items-start gap-2 leading-relaxed">
            <Droplets className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>{language === 'hi' ? 'नमी एवं अशुद्धता कटौती:' : 'Moisture & Impurity Deductions:'}</strong>{' '}
              {language === 'hi'
                ? 'यदि उपकरणों में अत्यधिक नमी, पानी या गैर-इलेक्ट्रॉनिक मलबा हो तो भुगतान समायोजित किया जा सकता है। आवश्यक तांबे की वाइंडिंग गायब होने पर दर में अंतर आ सकता है।'
                : 'Payment might be reduced if there is heavy dirt, water moisture, or non-electronic debris inside cabinets. Missing essential recovery components (e.g., copper motor windings removed from compressors) will adjust rates.'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
