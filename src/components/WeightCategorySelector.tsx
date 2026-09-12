import React from 'react';
import { WeightCategoryId } from '../types';
import { WEIGHT_CATEGORIES } from '../data/scrapData';
import { Scale, Bike, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WeightCategorySelectorProps {
  selectedWeightCategory: WeightCategoryId;
  estimatedKg: number;
  onWeightCategoryChange: (category: WeightCategoryId, defaultKg: number) => void;
  onEstimatedKgChange: (kg: number) => void;
}

export const WeightCategorySelector: React.FC<WeightCategorySelectorProps> = ({
  selectedWeightCategory,
  estimatedKg,
  onWeightCategoryChange,
  onEstimatedKgChange,
}) => {
  const { language, t } = useLanguage();
  const currentCategory = WEIGHT_CATEGORIES.find((w) => w.id === selectedWeightCategory) || WEIGHT_CATEGORIES[0];

  const getVehicleIcon = (id: WeightCategoryId) => {
    switch (id) {
      case 'light':
        return <Bike className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case 'medium':
        return <Scale className="h-5 w-5 text-sky-600 dark:text-sky-400" />;
      case 'bulk':
        return <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getCategoryLabel = (id: WeightCategoryId) => {
    if (language === 'hi') {
      switch (id) {
        case 'light':
          return 'हल्का भार';
        case 'medium':
          return 'मध्यम भार';
        case 'bulk':
          return 'थोक स्क्रैप';
      }
    }
    switch (id) {
      case 'light':
        return 'Light Volume';
      case 'medium':
        return 'Medium Volume';
      case 'bulk':
        return 'Bulk Scrap';
    }
  };

  const getCategoryDescription = (id: WeightCategoryId) => {
    if (language === 'hi') {
      switch (id) {
        case 'light':
          return 'स्मार्टफोन, केबल, चार्जर, एडेप्टर, राउटर व छोटे गैजेट्स के लिए उपयुक्त।';
        case 'medium':
          return 'लैपटॉप, डेस्कटॉप, टीवी स्क्रीन, माइक्रोवेव व घरेलू इन्वर्टर के लिए उपयुक्त।';
        case 'bulk':
          return 'फ्रिज, एसी, वाशिंग मशीन या भारी मात्रा में इलेक्ट्रॉनिक स्क्रैप।';
      }
    }
    switch (id) {
      case 'light':
        return 'Ideal for smartphones, cables, routers, chargers, and small home electronics.';
      case 'medium':
        return 'Perfect for laptops, desktop PCs, monitors, microwaves, and home UPS units.';
      case 'bulk':
        return 'Heavy industrial scrap, large refrigerators, split AC units, or office cleanouts.';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Scale className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t('step2Title', '2. Select Weight Category')}</span>
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'hi'
            ? 'अपेक्षित वजन ब्रैकेट चुनें ताकि हम सही वाहन व कैलिब्रेटेड डिजिटल तराजू भेज सकें।'
            : 'Choose the expected weight bracket so we assign the right transport vehicle and calibrated digital scale.'}
        </p>
      </div>

      {/* 3 Weight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {WEIGHT_CATEGORIES.map((category) => {
          const isSelected = category.id === selectedWeightCategory;
          return (
            <button
              key={category.id}
              id={`weight-category-${category.id}`}
              type="button"
              onClick={() => onWeightCategoryChange(category.id, category.defaultKg)}
              className={`relative flex flex-col items-start rounded-2xl p-4 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-500/20'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isSelected ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {getVehicleIcon(category.id)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {getCategoryLabel(category.id)}
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">{category.rangeText}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {getCategoryDescription(category.id)}
              </div>

              <div className="mt-3 w-full border-t border-slate-100 dark:border-slate-700/60 pt-2 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium">
                <span className="truncate">
                  {language === 'hi' ? 'वाहन:' : 'Vehicle:'} {category.vehicleAssigned.split(' ')[0]} {category.vehicleAssigned.split(' ')[1]}
                </span>
              </div>

              {isSelected && (
                <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fine-Tuning Slider for Weight within Category */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'hi' ? 'श्रेणी में अनुमानित वजन:' : `Approximate Weight (${currentCategory.ruleText}):`}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? 'कलेक्टर को सटीक डिजिटल वजन और नकद/UPI भुगतान तैयार रखने में मदद करता है।'
                : 'Helps collector bring exact change and payload space.'}
            </p>
          </div>
          <div className="flex items-baseline gap-1 rounded-lg bg-emerald-700 dark:bg-emerald-600 px-3 py-1 text-white shadow-2xs">
            <span className="text-lg font-black">{estimatedKg}</span>
            <span className="text-xs font-bold">{language === 'hi' ? 'किलो' : 'kg'}</span>
          </div>
        </div>

        <div className="mt-3">
          <input
            id="slider-estimated-kg"
            type="range"
            min={currentCategory.minKg}
            max={currentCategory.maxKg}
            step={1}
            value={estimatedKg}
            onChange={(e) => onEstimatedKgChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700 accent-emerald-700 dark:accent-emerald-500"
          />
          <div className="mt-1 flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
            <span>{currentCategory.minKg} {language === 'hi' ? 'किलो' : 'kg'}</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-400">{estimatedKg} {language === 'hi' ? 'किलो' : 'kg'}</span>
            <span>{currentCategory.maxKg} {language === 'hi' ? 'किलो' : 'kg'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
