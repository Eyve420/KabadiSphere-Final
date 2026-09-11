import React, { useState } from 'react';
import { ScrapCategory, ScrapCategoryId } from '../types';
import { SCRAP_CATEGORIES } from '../data/scrapData';
import { TrendingUp, TrendingDown, Calendar, Factory } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface MarketRatesChartProps {
  categories?: ScrapCategory[];
  onSelectCategoryForBooking?: (categoryId: ScrapCategoryId) => void;
  onSelectCategoryForPickup?: (categoryId: ScrapCategoryId) => void;
}

export const MarketRatesChart: React.FC<MarketRatesChartProps> = ({
  categories = SCRAP_CATEGORIES,
  onSelectCategoryForBooking,
  onSelectCategoryForPickup,
}) => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategoryId>('laptops_computers');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const activeCategory = categories.find((c) => c.id === selectedCategory) || categories[0];
  const historyData = viewMode === 'weekly' ? activeCategory.weeklyHistory : activeCategory.monthlyHistory;

  const handleBookingClick = (catId: ScrapCategoryId) => {
    if (onSelectCategoryForPickup) {
      onSelectCategoryForPickup(catId);
    } else if (onSelectCategoryForBooking) {
      onSelectCategoryForBooking(catId);
    }
  };

  // Calculate SVG dimensions and coordinate mapping
  const width = 640;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const minRate = Math.min(...historyData.map((d) => d.rate)) * 0.95;
  const maxRate = Math.max(...historyData.map((d) => d.rate)) * 1.05;

  const points = historyData.map((d, index) => {
    const x = paddingX + (index / (historyData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.rate - minRate) / (maxRate - minRate || 1)) * (height - paddingY * 2);
    return { x, y, label: d.label, rate: d.rate };
  });

  // Generate smooth SVG curve path
  const linePath = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + point.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div id="market-rates-section" className="rounded-3xl border border-emerald-900/15 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xs transition-colors">
      {/* Header section */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {language === 'hi' ? 'लाइव ई-कचरा कमोडिटी एक्सचेंज' : 'Live E-Waste Commodity Spot Exchange'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">MCX / LME Indices (SIH 2026)</span>
        </div>
        <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {language === 'hi' ? 'लाइव ई-कचरा बाजार दर ट्रैकर' : 'Live E-Waste Market Rates Tracker'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {language === 'hi'
            ? 'कीमती धातुओं, तांबे की शुद्धता और EPR ब्रांड सब्सिडी के आधार पर परिवारों को दी जाने वाली वास्तविक बायबैक दरें।'
            : 'Real-time buyback prices paid to households based on precious metals, copper purity, and EPR brand subsidies.'}
        </p>
      </div>

      {/* Category Pills Selector */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedCategory;
          const label = language === 'hi' ? (cat.hindiName || cat.name.split('(')[0].trim()) : cat.name.split('(')[0].trim();
          return (
            <button
              key={cat.id}
              id={`pill-category-${cat.id}`}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setHoveredPointIndex(null);
              }}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-700/30'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <span>{label}</span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
                  isSelected ? 'bg-emerald-950/40 text-emerald-100' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                }`}
              >
                ₹{cat.ratePerKg}/kg
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart Visualizer */}
      <div className="mt-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 p-4 sm:p-5">
        {/* Metric stats row with Refinery Demand and Weekly/Monthly Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-750">
          <div className="flex items-center gap-3.5">
            {activeCategory.sampleImageUrl && (
              <img
                src={activeCategory.sampleImageUrl}
                alt={activeCategory.name}
                referrerPolicy="no-referrer"
                className="h-14 w-14 shrink-0 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
              />
            )}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  ₹{activeCategory.ratePerKg}
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'प्रति किलोग्राम' : 'per kilogram'}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeCategory.trendChange >= 0
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {activeCategory.trendChange >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {activeCategory.trendChange >= 0 ? '+' : ''}
                  {activeCategory.trendChange}% {language === 'hi' ? `इस ${viewMode === 'weekly' ? 'सप्ताह' : 'महीने'}` : `this ${viewMode === 'weekly' ? 'week' : 'month'}`}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {activeCategory.sampleImageCaption || (language === 'hi' ? `खरीद बैंड: ₹${activeCategory.minRate} - ₹${activeCategory.maxRate}/किग्रा` : `Procurement band: ₹${activeCategory.minRate} - ₹${activeCategory.maxRate}/kg`)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-800 px-3 py-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <Factory className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-600 dark:text-slate-400">{language === 'hi' ? 'रिफाइनरी मांग:' : 'Refinery Demand:'}</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{activeCategory.plantDemand}</span>
            </div>

            {/* Weekly / Monthly Toggle in graph area */}
            <div className="flex items-center rounded-xl bg-white dark:bg-slate-800 p-1 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                id="btn-view-weekly"
                type="button"
                onClick={() => {
                  setViewMode('weekly');
                  setHoveredPointIndex(null);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  viewMode === 'weekly'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{language === 'hi' ? 'साप्ताहिक' : 'Weekly'}</span>
              </button>
              <button
                id="btn-view-monthly"
                type="button"
                onClick={() => {
                  setViewMode('monthly');
                  setHoveredPointIndex(null);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  viewMode === 'monthly'
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{language === 'hi' ? 'मासिक' : 'Monthly'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive SVG Trend Chart with Smooth Transitions */}
        <div className="relative mt-4 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${viewMode}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full"
            >
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-48 sm:h-56 select-none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id={`grad-${activeCategory.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={activeCategory.color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={activeCategory.color} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Background grid lines */}
                {[0, 0.33, 0.66, 1].map((ratio, i) => {
                  const y = paddingY + ratio * (height - paddingY * 2);
                  const val = Math.round(maxRate - ratio * (maxRate - minRate));
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={width - paddingX}
                        y2={y}
                        stroke="currentColor"
                        className="text-slate-200 dark:text-slate-700/70"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="fill-slate-400 dark:fill-slate-500 font-mono"
                        fontSize="10"
                        fontWeight="500"
                      >
                        ₹{val}
                      </text>
                    </g>
                  );
                })}

                {/* Filled Area below line */}
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  d={areaPath}
                  fill={`url(#grad-${activeCategory.id})`}
                />

                {/* Main Trend Line */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0.4 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  d={linePath}
                  fill="none"
                  stroke={activeCategory.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {points.map((pt, i) => {
                  const isHovered = hoveredPointIndex === i;
                  return (
                    <g key={i}>
                      {/* Vertical guide line on hover */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={paddingY}
                          x2={pt.x}
                          y2={height - paddingY}
                          stroke={activeCategory.color}
                          strokeDasharray="2 2"
                          strokeWidth="1.5"
                        />
                      )}

                      {/* Outer circle */}
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: Math.min(i * 0.02, 0.22), duration: 0.2, ease: 'easeOut' }}
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill="#ffffff"
                        stroke={activeCategory.color}
                        strokeWidth={isHovered ? 3 : 2}
                        className="transition-all duration-150"
                      />

                      {/* Invisible enlarged hit area */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={18}
                        fill="transparent"
                        onMouseEnter={() => setHoveredPointIndex(i)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />

                      {/* X Axis Label */}
                      <text
                        x={pt.x}
                        y={height - 10}
                        textAnchor="middle"
                        className={isHovered ? 'fill-slate-900 dark:fill-white font-bold' : 'fill-slate-500 dark:fill-slate-400 font-mono'}
                        fontSize="11"
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </motion.div>
          </AnimatePresence>

          {/* Floating Tooltip */}
          <AnimatePresence>
            {hoveredPointIndex !== null && points[hoveredPointIndex] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 4 }}
                transition={{ duration: 0.12 }}
                className="pointer-events-none absolute -top-1 z-20 rounded-lg bg-slate-900 dark:bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-white shadow-lg"
                style={{
                  left: `${(points[hoveredPointIndex].x / width) * 100}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <div className="font-semibold">{points[hoveredPointIndex].label}</div>
                <div className="font-bold text-emerald-400">₹{points[hoveredPointIndex].rate.toFixed(1)} / kg</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* E-Waste Specific Metal Breakdown & EPR Subsidy info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
          <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 block mb-1">
              {language === 'hi' ? 'पुनर्प्राप्त धातुएं' : 'Recoverable Metals'}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCategory.preciousMetalsRecoverable}</span>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block mb-1">
              {language === 'hi' ? 'सरकारी EPR क्रेडिट सब्सिडी' : 'Govt EPR Credit Subsidy'}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {language === 'hi' ? `+₹${activeCategory.eprCreditPerKg} / किग्रा ब्रांड अनुपालन प्रोत्साहन` : `+₹${activeCategory.eprCreditPerKg} / kg Brand Compliance Incentive`}
            </span>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block mb-1">
              {language === 'hi' ? 'निष्प्रभावी किए जाने वाले विषैले घटक' : 'Hazardous Toxins Neutralized'}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCategory.hazardousComponents}</span>
          </div>
        </div>
      </div>

      {/* Grid of All Categories Market Overview */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            id={`card-market-cat-${cat.id}`}
            className={`rounded-2xl border p-4 transition-all ${
              cat.id === selectedCategory
                ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/30 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                {cat.sampleImageUrl && (
                  <img
                    src={cat.sampleImageUrl}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 shrink-0 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {language === 'hi' ? (cat.hindiName || cat.name) : cat.name}
                  </h3>
                  {language === 'hi' ? (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block truncate">{cat.name}</span>
                  ) : (
                    cat.hindiName && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">{cat.hindiName}</span>
                    )
                  )}
                </div>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-xs font-extrabold shrink-0 ${cat.badgeBg}`}>
                ₹{cat.ratePerKg}/kg
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{cat.description}</p>

            <div className="mt-3 flex flex-wrap gap-1">
              {cat.commonItems.slice(0, 2).map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'दायरा:' : 'Range:'} <span className="font-medium text-slate-700 dark:text-slate-300">₹{cat.minRate} - ₹{cat.maxRate}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  handleBookingClick(cat.id);
                }}
                className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {language === 'hi' ? 'पिकअप बुक करें →' : 'Schedule Pickup →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
