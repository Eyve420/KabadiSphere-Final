import React from 'react';
import { Leaf, Trees, Wind, Award, Recycle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RecyclingImpactBannerProps {
  totalKgRecycled: number;
  totalPayoutEarned: number;
}

export const RecyclingImpactBanner: React.FC<RecyclingImpactBannerProps> = ({
  totalKgRecycled,
  totalPayoutEarned,
}) => {
  const { language } = useLanguage();

  // Environmental formula approximations
  const treesSaved = (totalKgRecycled * 0.017).toFixed(1);
  const co2PreventedKg = Math.round(totalKgRecycled * 1.8);

  return (
    <div className="rounded-2xl border border-emerald-800/15 dark:border-emerald-800/30 bg-emerald-900/5 dark:bg-emerald-950/20 p-5 sm:p-6 text-slate-900 dark:text-white transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-emerald-900/10 dark:border-emerald-800/30 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 dark:bg-emerald-700 text-white shadow-2xs">
            <Recycle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'घरेलू पुनर्चक्रण एवं चक्रीय अर्थव्यवस्था प्रभाव' : 'Household Recycling & Circular Economy Impact'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {language === 'hi'
                ? 'प्रमाणित पुनर्चक्रण संयंत्रों को भेजे गए डोरस्टेप पिकअप का सीधा योगदान।'
                : 'Direct contributions from doorstep pickups transferred to certified recycling plants.'}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 self-start sm:self-auto">
          <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          {language === 'hi' ? 'शून्य लैंडफिल पहल' : 'Zero Landfill Initiative'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-emerald-900/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <Trees className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {language === 'hi' ? 'बचाए गए पेड़' : 'Trees Preserved'}
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{treesSaved}</div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
            {language === 'hi' ? 'वन संरक्षण समतुल्य' : 'Equivalent forest savings'}
          </span>
        </div>

        <div className="rounded-xl border border-emerald-900/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <Wind className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            {language === 'hi' ? 'CO₂ भरपाई' : 'CO₂ Offset'}
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{co2PreventedKg} {language === 'hi' ? 'किलो' : 'kg'}</div>
          <span className="text-[10px] text-sky-700 dark:text-sky-400 font-semibold">
            {language === 'hi' ? 'उत्सर्जन से बचाव' : 'Greenhouse gas averted'}
          </span>
        </div>

        <div className="rounded-xl border border-emerald-900/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <Recycle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {language === 'hi' ? 'पुनर्चक्रित कचरा' : 'Scrap Recycled'}
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalKgRecycled} {language === 'hi' ? 'किलो' : 'kg'}</div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
            {language === 'hi' ? 'लैंडफिल से हटाया गया' : 'Diverted from city landfills'}
          </span>
        </div>

        <div className="rounded-xl border border-emerald-900/10 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            {language === 'hi' ? 'परिवार को भुगतान' : 'Household Payout'}
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">₹{totalPayoutEarned.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
            {language === 'hi' ? 'नकद / UPI भुगतान' : 'Cash / UPI disbursed'}
          </span>
        </div>
      </div>
    </div>
  );
};
