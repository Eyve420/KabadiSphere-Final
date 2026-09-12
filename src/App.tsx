import React, { useState, useEffect } from 'react';
import { Header, AppTab } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeTab } from './components/HomeTab';
import { SchedulePickupForm } from './components/SchedulePickupForm';
import { AccountTab } from './components/AccountTab';
import { INITIAL_ORDERS, SCRAP_CATEGORIES } from './data/scrapData';
import { ScrapCategoryId, PickupOrder } from './types';
import { useLanguage } from './context/LanguageContext';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Recycle,
  Sparkles,
  Phone,
  FileText,
  Building,
  HeartHandshake,
  MapPin,
} from 'lucide-react';

export default function App() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [orders, setOrders] = useState<PickupOrder[]>(() => {
    const saved = localStorage.getItem('kabadi_sphere_ewaste_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Robust schema validation to prevent crashes from old local storage data
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sample = parsed[0];
          if (!sample.address || typeof sample.address !== 'object' || !sample.address.city || !sample.collector || !sample.collector.name) {
            console.warn('Old or invalid order schema detected, resetting to initial orders to prevent crash');
            return INITIAL_ORDERS;
          }
          return parsed;
        }
        return Array.isArray(parsed) ? parsed : INITIAL_ORDERS;
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // Dark mode state with persistence & system preference fallback
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('kabadi_sphere_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kabadi_sphere_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kabadi_sphere_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const [preselectedCategory, setPreselectedCategory] = useState<ScrapCategoryId>('laptops_computers');
  const [showSuccessToast, setShowSuccessToast] = useState<{ id: string; otp: string } | null>(null);

  const handleOrderCreated = (newOrder: PickupOrder) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('kabadi_sphere_ewaste_orders', JSON.stringify(updated));
    setShowSuccessToast({ id: newOrder.id, otp: newOrder.pickupOtp });
    // Switch to Account tab to view the active pickup tracker
    setActiveTab('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem('kabadi_sphere_ewaste_orders', JSON.stringify(updated));
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: PickupOrder['status']) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStatus,
          collector: {
            ...o.collector,
            estimatedArrival:
              nextStatus === 'completed'
                ? 'Delivered to Authorized Smelter Plant'
                : nextStatus === 'in_transit'
                ? 'Arriving at doorstep in 10 mins'
                : 'Collector assigned and dispatched',
          },
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('kabadi_sphere_ewaste_orders', JSON.stringify(updated));
  };

  const handleNavigateToPickup = (categoryId?: string) => {
    if (categoryId && SCRAP_CATEGORIES.some((c) => c.id === categoryId)) {
      setPreselectedCategory(categoryId as ScrapCategoryId);
    }
    setActiveTab('pickup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activePickupsCount = orders.filter((o) => o.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Banner Notice */}
      <div className="bg-emerald-950 dark:bg-black text-emerald-100 text-[11px] sm:text-xs py-2 px-4 text-center flex items-center justify-center gap-2 font-medium border-b border-emerald-900/40">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          <strong>{language === 'hi' ? 'स्मार्ट इंडिया हैकथॉन (SIH 2026):' : 'Smart India Hackathon (SIH 2026):'}</strong>{' '}
          {language === 'hi'
            ? 'ई-कचरा (प्रबंधन) नियम 2022 • घर से संग्रह और प्रमाणित रीसाइक्लिंग नेटवर्क'
            : 'E-Waste (Management) Rules 2022 • Nationwide doorstep collection & verified recycling network.'}
        </span>
      </div>

      {/* 3-Part Header Navigation with Dark Mode Toggle */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activePickupsCount={activePickupsCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Success Booking Toast */}
      {showSuccessToast && (
        <div className="mx-auto max-w-4xl px-4 pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500 bg-emerald-900 p-4 text-white shadow-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {language === 'hi' ? 'डोरस्टेप पिकअप बुक हो गया! बुकिंग #' : 'Doorstep Pickup Scheduled! Booking #'}{showSuccessToast.id}
                </h4>
                <p className="text-xs text-emerald-200">
                  {language === 'hi'
                    ? 'आपका प्रमाणित लोकल ई-कचरा कलेक्टर आवंटित कर दिया गया है। आपका सत्यापन OTP है '
                    : 'Your certified local e-waste collector has been assigned. Your Doorstep Verification OTP is '}
                  <span className="font-mono font-bold text-white bg-emerald-800 px-2 py-0.5 rounded border border-emerald-600">
                    {showSuccessToast.otp}
                  </span>
                  {language === 'hi'
                    ? '। डिजिटल तौल के बाद कलेक्टर को यह साझा करें।'
                    : '. Share this with the collector after digital scale weigh-in.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessToast(null)}
              className="text-emerald-300 hover:text-white p-1 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 sm:pb-8">
        {/* TAB 1: HOME (Policies, Live Market Rates Explanation, Market Rates Chart, Landfill Matrix) */}
        {activeTab === 'home' && (
          <HomeTab onNavigateToPickup={handleNavigateToPickup} />
        )}

        {/* TAB 2: PICKUP (Schedule Form with Photo Capture, Weight Brackets, Date/Time, Payout, Location detection) */}
        {activeTab === 'pickup' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-emerald-900/15 dark:border-slate-800 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 p-6 sm:p-8 text-white shadow-md">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 mb-2 border border-emerald-400/30">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'AI विज़न और जीपीएस समर्थित डोरस्टेप बुकिंग' : 'AI Vision & GPS Assisted Doorstep Booking'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {language === 'hi' ? 'घर से ई-कचरा पिकअप शेड्यूल करें' : 'Schedule E-Waste Doorstep Collection'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
                {language === 'hi'
                  ? 'अपने पुराने इलेक्ट्रॉनिक्स की तस्वीर लें या नीचे श्रेणी चुनें। हमारा अधिकृत कलेक्टर प्रमाणित डिजिटल तराजू के साथ आएगा और UPI या नकद तुरंत भुगतान करेगा।'
                  : 'Snap a photo of your electronic scrap or choose a category below. Our certified collector arrives with calibrated digital scales and issues instant payment via UPI or Cash.'}
              </p>
            </div>

            <SchedulePickupForm
              initialCategoryId={preselectedCategory}
              onOrderCreated={handleOrderCreated}
            />
          </div>
        )}

        {/* TAB 3: ACCOUNT (User Profile, Green Impact Stats, Pickup History, Green Certificates) */}
        {activeTab === 'account' && (
          <AccountTab
            orders={orders}
            onCancelOrder={handleCancelOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onNavigateToPickup={() => setActiveTab('pickup')}
          />
        )}
      </main>

      {/* Universal Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 pb-32 sm:pb-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 dark:bg-emerald-700 text-white font-bold">
                <Recycle className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Kabadi<span className="text-emerald-700 dark:text-emerald-400">Sphere</span> E-Waste
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Certified Household & Institutional Electronic Waste Logistics Network • SIH 2026 Initiative
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                SIH 2026 E-Waste Logistics
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Building className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                EPR Portal Manifest Compliant
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                Citizen Support: 1800-419-SPHERE
              </span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
            <p>
              © 2026 Kabadi Sphere Logistics. All rights reserved. Complies with Ministry of Environment, Forest and Climate Change (MoEFCC) E-Waste (Management) Rules.
            </p>
            <p>
              Statutory Disclaimer: Digital scale readings at doorstep determine final payment. Moisture or impurities subject to standard deduction.
            </p>
          </div>
        </div>
      </footer>

      {/* Modern Mobile Bottom Navigation Bar (Visible on mobile screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activePickupsCount={activePickupsCount}
      />
    </div>
  );
}
