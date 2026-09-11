import React from 'react';
import { Home, CalendarPlus, UserCheck, Sparkles } from 'lucide-react';
import { AppTab } from './Header';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  activePickupsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  activePickupsCount,
}) => {
  const { language } = useLanguage();

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.4)] px-3 py-1.5 transition-colors pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-3 items-center max-w-md mx-auto gap-1">
        {/* Tab 1: Home */}
        <button
          type="button"
          id="mobile-nav-home"
          onClick={() => {
            onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
            activeTab === 'home'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
              activeTab === 'home'
                ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="h-4 w-4" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">
            {language === 'hi' ? 'होम' : 'Home'}
          </span>
        </button>

        {/* Tab 2: Pickup (Hero Center Action) */}
        <button
          type="button"
          id="mobile-nav-pickup"
          onClick={() => {
            onTabChange('pickup');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
            activeTab === 'pickup'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
              activeTab === 'pickup'
                ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
            }`}
          >
            <CalendarPlus className="h-4 w-4" />
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-medium">
            {language === 'hi' ? 'पिकअप' : 'Book Pickup'}
          </span>
        </button>

        {/* Tab 3: Account */}
        <button
          type="button"
          id="mobile-nav-account"
          onClick={() => {
            onTabChange('account');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer select-none active:scale-95 relative ${
            activeTab === 'account'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-7 rounded-full transition-all relative ${
              activeTab === 'account'
                ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            {activePickupsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {activePickupsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">
            {language === 'hi' ? 'खाता' : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
};
