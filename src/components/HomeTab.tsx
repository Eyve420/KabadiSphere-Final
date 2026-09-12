import React, { useState } from 'react';
import { ScrapCategory, GovtPolicy } from '../types';
import { SCRAP_CATEGORIES, GOVT_POLICIES } from '../data/scrapData';
import { MarketRatesChart } from './MarketRatesChart';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  TrendingUp,
  Cpu,
  FileText,
  AlertOctagon,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Coins,
  Scale,
  Award,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface HomeTabProps {
  onNavigateToPickup: (categoryId?: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateToPickup }) => {
  const { language } = useLanguage();
  const [selectedPolicy, setSelectedPolicy] = useState<GovtPolicy>(GOVT_POLICIES[0]);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [isRefreshingRates, setIsRefreshingRates] = useState<boolean>(false);
  const [rateModifier, setRateModifier] = useState<number>(0);
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);

  const handleSimulateRateSync = () => {
    setIsRefreshingRates(true);
    setTimeout(() => {
      // Simulate slight realistic fluctuation (+/- 1-3 Rs)
      const delta = (Math.random() * 4 - 2);
      setRateModifier(Math.round(delta * 10) / 10);
      setLastSyncTime('Just now');
      setIsRefreshingRates(false);
    }, 800);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300 mb-4 backdrop-blur-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{language === 'hi' ? 'स्मार्ट इंडिया हैकथॉन (SIH 2026) ई-कचरा लॉजिस्टिक्स' : 'Smart India Hackathon (SIH 2026) E-Waste Logistics'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'hi' ? (
              <>पुराने इलेक्ट्रॉनिक्स को बनाएं <span className="text-emerald-400">ग्रीन कैश</span> और पर्यावरण सुरक्षा।</>
            ) : (
              <>Turn Dead Electronics Into <span className="text-emerald-400">Green Cash</span> & Certified Impact.</>
            )}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-2xl">
            {language === 'hi'
              ? 'कबाड़ी स्फीयर परिवारों को अधिकृत ई-कचरा संग्राहकों और रिफाइनरों से जोड़ता है। हमारा लक्ष्य सोने, चांदी और तांबे का निष्कर्षण सुनिश्चित करना है, साथ ही सीसा, पारा और कैडमियम जैसे विषैले तत्वों को निष्प्रभावी करना है।'
              : 'Kabadi Sphere bridges households with authorized e-waste collectors and government-registered smelting refiners nationwide. Our goal is to ensure extraction of gold, silver, and copper while strictly neutralizing toxic lead, mercury, and cadmium.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              id="btn-hero-schedule"
              onClick={() => onNavigateToPickup()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 active:scale-95 transition-all cursor-pointer"
            >
              <span>{language === 'hi' ? 'घर से ई-कचरा पिकअप बुक करें' : 'Schedule E-Waste Pickup'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href="#govt-policies"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-600/40 bg-emerald-900/30 px-5 py-3.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-800/40 transition-colors"
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>{language === 'hi' ? 'सरकारी नियम व नीतियां' : 'Explore Govt Policies'}</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 pt-6 border-t border-emerald-800/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">{language === 'hi' ? '7+ श्रेणियां' : '7+ Types'}</div>
              <div className="text-emerald-100/70 font-medium">{language === 'hi' ? 'ई-कचरा श्रेणियां' : 'E-Waste Categories'}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">{language === 'hi' ? '₹185/किलो' : '₹185/kg'}</div>
              <div className="text-emerald-100/70 font-medium">{language === 'hi' ? 'औसत पीसीबी भुगतान' : 'Avg PCB Recovery Payout'}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">{language === 'hi' ? 'सटीक तराजू' : 'Digital Scales'}</div>
              <div className="text-emerald-100/70 font-medium">{language === 'hi' ? 'पारदर्शी डोरस्टेप तौल' : 'Doorstep Weighing'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Answer: "How are the Live Market Rates Updating?" Section */}
      <section className="rounded-3xl border border-emerald-900/15 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
              <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>{language === 'hi' ? 'पारदर्शी मूल्य निर्धारण इंजन' : 'Transparent Price Discovery Engine'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'लाइव बाजार दरें कैसे अपडेट होती हैं?' : 'How are Live Market Rates Updating?'}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'साधारण कचरे के विपरीत, ई-कचरे का मूल्य कमोडिटी मेटल स्पॉट बोर्ड, वैधानिक EPR क्रेडिट और रिफाइनरी मांग के वास्तविक समय के सूचकांक से तय होता है।'
                : 'Unlike ordinary trash, e-waste value is derived from a real-time mathematical index combining commodity metal spot boards, statutory EPR manufacturer credits, and refinery queue rates.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{language === 'hi' ? 'दरें स्थिति: ' : 'Rate Feed Status: '}</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{language === 'hi' ? 'लाइव (अभी अपडेट)' : `Live (Synced ${lastSyncTime})`}</span>
            </div>

            <button
              id="btn-simulate-rate-refresh"
              onClick={handleSimulateRateSync}
              disabled={isRefreshingRates}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-600/30 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 ${isRefreshingRates ? 'animate-spin' : ''}`} />
              <span>{isRefreshingRates ? (language === 'hi' ? 'दरें लोड हो रही हैं...' : 'Polling Live Rates...') : (language === 'hi' ? 'दरें रिफ्रेश करें' : 'Refresh Live Rates')}</span>
            </button>
          </div>
        </div>

        {/* 3 Pillars of E-Waste Pricing */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-4 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 font-black text-xs">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'कीमती धातु स्पॉट सूचकांक' : 'Precious Metal Spot Index'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'सर्किट बोर्ड (PCB), रैम और सीपीयू में सोना (Au), चांदी (Ag), पैलेडियम (Pd) और उच्च शुद्धता वाला तांबा होता है। MCX के घरेलू स्पॉट रेट सीधे हमारे कबाड़ मूल्यांकन को प्रभावित करते हैं।'
                : 'Printed circuit boards (PCBs), RAM, and CPUs contain micro-plated Gold (Au), Silver (Ag), Palladium (Pd), and high-purity Copper. Domestic spot rates from MCX directly influence our scrap valuations.'}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500 dark:text-slate-400">{language === 'hi' ? 'मानक दर:' : 'Benchmark:'}</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono">
                {language === 'hi' ? 'MCX सोना ₹7,450/ग्राम | तांबा ₹780/किलो' : 'MCX Gold ₹7,450/g | Cu ₹780/kg'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-4 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 font-black text-xs">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'सरकारी EPR ब्रांड सब्सिडी' : 'Govt EPR Brand Subsidies'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'ई-कचरा नियम 2022 के तहत, ब्रांडों (Dell, Apple, Samsung) को कानूनी रूप से ई-कचरा पुनर्प्राप्ति को फंड करना पड़ता है। अधिकृत रिफाइनर ये ₹18 – ₹55/किलो सब्सिडी सीधे नागरिकों को देते हैं।'
                : 'Under the E-Waste Rules 2022, electronic brands (Dell, Apple, Samsung) must legally finance e-waste recovery. Authorized recyclers pass these ₹18 – ₹55/kg EPR compliance subsidies directly to households.'}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500 dark:text-slate-400">{language === 'hi' ? 'वैधानिक क्रेडिट:' : 'Statutory Credit:'}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono">{language === 'hi' ? '+₹18 से ₹55 / किलो प्रोत्साहन' : '+₹18 to ₹55 / kg Incentive'}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-4 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 dark:bg-sky-400/10 text-sky-700 dark:text-sky-400 font-black text-xs">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'स्मेल्टर और रिफाइनरी मांग' : 'Smelter & Refiner Capacity'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'माध्यमिक रिफाइनरी प्लांट रीयल-टाइम इनटेक कोटा निर्धारित करते हैं। जब प्लांट की मांग बढ़ती है (पीक या उच्च), तो कबाड़ बायबैक की दरें भी स्वतः बढ़ जाती हैं।'
                : 'Secondary hydrometallurgical smelting plants set real-time intake quotas. When plant demand spikes (marked "Peak" or "High"), scrap buyback prices automatically climb.'}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500 dark:text-slate-400">{language === 'hi' ? 'वर्तमान मांग:' : 'Current Ingestion:'}</span>
              <span className="text-sky-700 dark:text-sky-400 font-semibold">{language === 'hi' ? 'उच्च मांग (92% क्षमता)' : 'Peak Demand (92% capacity)'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Formula Display */}
        <div className="mt-5 rounded-2xl bg-emerald-950 p-4 sm:p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Scale className="h-5 w-5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {language === 'hi' ? 'पारदर्शी मूल्य निर्धारण सूत्र' : 'Transparent Pricing Formula'}
                </span>
                <p className="text-xs text-emerald-200/90 font-mono mt-0.5 break-words whitespace-normal leading-relaxed">
                  {language === 'hi'
                    ? 'भुगतान = (मूल धातु वजन × स्पॉट दर) + (पीसीबी ग्रेड बोनस) + (EPR ब्रांड क्रेडिट) - (प्रदूषण मुक्ति शुल्क)'
                    : 'Payout = (Base Metal Weight × Spot Rate) + (PCB Grade Bonus) + (EPR Brand Credit) - (Depollution Surcharge)'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFormulaModal(!showFormulaModal)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white underline underline-offset-4 cursor-pointer shrink-0"
            >
              <Info className="h-3.5 w-3.5" />
              <span>{showFormulaModal ? (language === 'hi' ? 'विवरण छुपाएं' : 'Hide breakdown') : (language === 'hi' ? 'गणना विवरण देखें' : 'View calculation details')}</span>
            </button>
          </div>

          {showFormulaModal && (
            <div className="mt-4 pt-4 border-t border-emerald-800/60 text-xs text-emerald-100/90 space-y-2">
              <p>
                <strong>{language === 'hi' ? '10 किलो डेस्कटॉप कंप्यूटर पीसी स्क्रैप का उदाहरण:' : 'Example for 10 kg Desktop Computer PC Scrap:'}</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-emerald-200/80">
                {language === 'hi' ? (
                  <>
                    <li>कैबिनेट शीट मेटल और एल्युमिनियम हीट सिंक (7 किलो): ₹40/किलो = ₹280</li>
                    <li>मदरबोर्ड पीसीबी और रैम कार्ड (2 किलो @ ₹185/किलो): ₹370</li>
                    <li>कॉपर इंसुलेटेड बिजली केबल (1 किलो @ ₹135/किलो): ₹135</li>
                    <li>वैधानिक EPR ब्रांड रिकवरी प्रोत्साहन (10 किलो × ₹28/किलो): +₹280</li>
                    <li><strong>कुल अनुमानित डोरस्टेप भुगतान: ~₹1,065</strong> (UPI या नकद में तुरंत)।</li>
                  </>
                ) : (
                  <>
                    <li>Chassis sheet metal & aluminum heat sink (7 kg): ₹40/kg = ₹280</li>
                    <li>Motherboard PCB & RAM cards (2 kg @ ₹185/kg): ₹370</li>
                    <li>Copper insulated power supply cables (1 kg @ ₹135/kg): ₹135</li>
                    <li>Statutory EPR Brand Recovery Incentive (10 kg × ₹28/kg): +₹280</li>
                    <li><strong>Total Estimated Doorstep Payout: ~₹1,065</strong> instantly credited via UPI/Cash.</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Live Market Rates Graph Component */}
      <section>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'लाइव ई-कचरा बाजार दर ट्रैकर' : 'Live E-Waste Market Rates Tracker'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'साप्ताहिक और मासिक औसत के साथ ई-कचरा वस्तुओं का वास्तविक समय मूल्य रुझान' : 'Interactive historical trend of e-waste commodities with weekly & monthly aggregation'}
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
            {language === 'hi' ? `आज अद्यतन: ${rateModifier !== 0 ? `${rateModifier > 0 ? '+' : ''}${rateModifier} ₹/किलो समायोजन सक्रिय` : 'मानक विनिमय दर'}` : `Updated Today: ${rateModifier !== 0 ? `${rateModifier > 0 ? '+' : ''}${rateModifier} ₹/kg adjustment active` : 'Standard Exchange Feed'}`}
          </span>
        </div>

        <MarketRatesChart onSelectCategoryForPickup={(catId) => onNavigateToPickup(catId)} />
      </section>

      {/* Government Policies & Statutory Acts Section */}
      <section id="govt-policies" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
          <FileText className="h-4 w-4 shrink-0" />
          <span>{language === 'hi' ? 'वैधानिक ढांचा और अनुपालन' : 'Statutory Framework & Compliance'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'सरकारी नीतियां एवं नागरिक निर्देश' : 'Government Policies & Citizen Directives'}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'भारत सरकार इलेक्ट्रॉनिक कचरे को खुले में फेंकने या जलाने पर पूर्ण प्रतिबंध लगाती है। वैधानिक पर्यावरण नियमों के तहत नागरिकों के लिए आवश्यक जानकारी।'
            : 'The Government of India strictly prohibits the dumping or burning of electrical scrap. Here is what households and institutions need to know under statutory environmental acts.'}
        </p>

        {/* Policy Selector Tabs - Mobile Friendly Smooth Horizontal Scroll */}
        <div className="mt-6 flex overflow-x-auto sm:flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 -mx-2 px-2 sm:mx-0 sm:px-0">
          {GOVT_POLICIES.map((policy) => {
            const isSelected = selectedPolicy.id === policy.id;
            const tabLabel = language === 'hi'
              ? (policy.shortTitleHindi || policy.shortTitle || policy.actTitleHindi || policy.actTitle)
              : (policy.shortTitle || policy.actTitle.split('(')[0].trim());
            return (
              <button
                key={policy.id}
                onClick={() => setSelectedPolicy(policy)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/40'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tabLabel}
              </button>
            );
          })}
        </div>

        {/* Selected Policy Detail Card */}
        <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 p-4 sm:p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
                  {selectedPolicy.year}
                </span>
                <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 break-words max-w-full">
                  {language === 'hi' ? (selectedPolicy.authorityHindi || selectedPolicy.authority) : selectedPolicy.authority}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {language === 'hi' ? (selectedPolicy.actTitleHindi || selectedPolicy.actTitle) : selectedPolicy.actTitle}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-800 px-3 py-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0 self-start">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{language === 'hi' ? 'प्रमाणित निष्कासन' : 'Compliant Channelization'}</span>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {language === 'hi' ? (selectedPolicy.summaryHindi || selectedPolicy.summary) : selectedPolicy.summary}
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white dark:bg-slate-800 p-4 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {language === 'hi' ? 'घरों व नागरिकों के लिए इसका अर्थ' : 'What it means for Households'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'hi' ? (selectedPolicy.citizenRelevanceHindi || selectedPolicy.citizenRelevance) : selectedPolicy.citizenRelevance}
              </p>
            </div>

            <div className="rounded-xl bg-white dark:bg-slate-800 p-4 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                {language === 'hi' ? 'प्रोत्साहन एवं कानूनी प्रावधान' : 'Incentives & Legal Directives'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'hi' ? (selectedPolicy.penaltiesOrIncentivesHindi || selectedPolicy.penaltiesOrIncentives) : selectedPolicy.penaltiesOrIncentives}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              {language === 'hi' ? 'प्रमुख निर्देश और सुरक्षा उपाय:' : 'Key Directives & Safeguards:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(language === 'hi' && selectedPolicy.keyDirectivesHindi ? selectedPolicy.keyDirectivesHindi : selectedPolicy.keyDirectives).map((directive, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed break-words">{directive}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hazardous Elements Warning Matrix */}
      <section className="rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-5 sm:p-8 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-rose-800 dark:text-rose-400 mb-1.5">
          <AlertOctagon className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{language === 'hi' ? 'ई-कचरा सामान्य कूड़ेदान में क्यों नहीं डालना चाहिए' : 'Why E-Waste Must Never Enter Municipal Dustbins'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {language === 'hi' ? 'इलेक्ट्रॉनिक्स में छिपे अदृश्य खतरे' : 'The Invisible Danger in Common Electronics'}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          {language === 'hi'
            ? 'इलेक्ट्रॉनिक उपकरणों में जहरीली भारी धातुएं और ज्वलनशील बैटरी रसायन होते हैं, जो सामान्य लैंडफिल में फेंकने पर भूजल को जहरीला कर देते हैं या आग पैदा करते हैं।'
            : 'Electronic items contain toxic heavy metals and reactive battery chemistries that leach into our drinking groundwater or ignite toxic fires when tossed into normal landfills.'}
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-rose-700 dark:text-rose-400">{language === 'hi' ? 'सीसा / लेड (Pb)' : 'Lead (Pb)'}</span>
              <span className="text-[11px] font-semibold text-slate-400">{language === 'hi' ? 'सर्किट सोल्डरिंग' : 'Circuit Soldering'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'पुराने पीसीबी सोल्डर और सीआरटी में पाया जाता है। मिट्टी और पानी में मिलने पर तंत्रिका तंत्र और किडनी को भारी नुकसान पहुंचाता है।'
                : 'Found in older PCB solder and cathode ray tubes. Causes acute neurotoxicity and kidney damage if leached into soil.'}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-700 dark:text-amber-400">{language === 'hi' ? 'पारा / मर्करी (Hg)' : 'Mercury (Hg)'}</span>
              <span className="text-[11px] font-semibold text-slate-400">{language === 'hi' ? 'डिस्प्ले और CCFL ट्यूब' : 'Flat Displays & CCFL'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'मॉनिटर और फ्लोरोसेंट लैंप टूटने पर मर्करी गैस बनकर हवा में फैलती है, जिससे श्वसन तंत्र को गंभीर क्षति पहुंचती है।'
                : 'Cold cathode fluorescent lamps in older monitors vaporize when crushed, causing severe respiratory damage.'}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-rose-700 dark:text-rose-400">{language === 'hi' ? 'कैडमियम (Cd)' : 'Cadmium (Cd)'}</span>
              <span className="text-[11px] font-semibold text-slate-400">{language === 'hi' ? 'चिप कॉन्टैक्ट्स और बैटरी' : 'Chip Contacts & Ni-Cd'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'अत्यधिक खतरनाक कैंसरकारी तत्व जो मानव हड्डियों और पीने के पानी में संचित होकर स्थायी क्षति पहुंचाता है।'
                : 'Extremely persistent carcinogen that accumulates in human bones and municipal water supplies.'}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-violet-700 dark:text-violet-400">{language === 'hi' ? 'लिथियम-आयन' : 'Lithium-Ion'}</span>
              <span className="text-[11px] font-semibold text-slate-400">{language === 'hi' ? 'फोन और लैपटॉप' : 'Phones & Laptops'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'दबे या गर्म हुए लिथियम सेल स्वतः आग पकड़ते हैं, जिससे कचरा ढेरों में जहरीले विस्फोट और अनियंत्रित आग लगती है।'
                : 'Punctured or overheated lithium pouches trigger spontaneous chemical thermal runaways and landfill explosions.'}
            </p>
          </div>
        </div>
      </section>

      {/* Final Schedule CTA Card */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-md">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            {language === 'hi' ? 'ई-कचरा रीसायकल करने के लिए तैयार हैं?' : 'Ready to Recycle Your E-Waste?'}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold mt-1">
            {language === 'hi' ? 'घर पर पुराने खराब इलेक्ट्रॉनिक्स या उपकरण हैं?' : 'Have dead electronics or old appliances at home?'}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
            {language === 'hi'
              ? 'हमारे अधिकृत कलेक्टर सटीक डिजिटल तराजू के साथ आपके दरवाजे पर आते हैं, तत्काल नकद/UPI भुगतान करते हैं, और स्क्रैप को सीधे लाइसेंस प्राप्त रिफाइनरियों में भेजते हैं।'
              : 'Our authorized collectors come to your doorstep with certified digital scales, provide cash/UPI payout, and send your scrap straight to licensed smelters.'}
          </p>
        </div>

        <button
          onClick={() => onNavigateToPickup()}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-bold text-emerald-900 shadow-md hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
        >
          <span>{language === 'hi' ? 'अभी डोरस्टेप पिकअप शेड्यूल करें' : 'Schedule Doorstep Pickup Now'}</span>
          <ArrowRight className="h-4 w-4 text-emerald-700" />
        </button>
      </section>
    </div>
  );
};
