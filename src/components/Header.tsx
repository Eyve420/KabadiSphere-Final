import React from 'react';
import { Home, CalendarPlus, UserCheck, Recycle, Moon, Sun, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type AppTab = 'home' | 'pickup' | 'account';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  activePickupsCount: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  activePickupsCount,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo & Name */}
          <div
            id="brand-logo"
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-800 dark:bg-emerald-700 text-emerald-100 shadow-sm transition-transform group-hover:scale-105">
              <Recycle className="h-5 w-5 sm:h-7 sm:w-7 text-emerald-300 animate-[spin_16s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  {language === 'hi' ? 'कबाड़ी' : 'Kabadi'}<span className="text-emerald-700 dark:text-emerald-400">{language === 'hi' ? 'स्फीयर' : 'Sphere'}</span>
                </span>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hidden xs:inline-flex">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1">
                <span>{language === 'hi' ? 'घर से ई-कचरा निष्पादन' : 'Doorstep E-Waste Logistics'}</span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  {language === 'hi' ? 'वैज्ञानिक रीसाइक्लिंग' : 'Smart India Hackathon Project'}
                </span>
              </p>
            </div>
          </div>

          {/* Right Navigation & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop / Tablet Tabs Navigation (Mobile uses the Bottom Navigation Bar) */}
            <nav className="hidden sm:flex items-center gap-0.5 sm:gap-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800 p-1 sm:p-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              {/* Tab 1: Home */}
              <button
                type="button"
                id="nav-tab-home"
                onClick={() => onTabChange('home')}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-xs font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Home className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${activeTab === 'home' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-xs">{language === 'hi' ? 'होम' : 'Home'}</span>
              </button>

              {/* Tab 2: Pickup */}
              <button
                type="button"
                id="nav-tab-pickup"
                onClick={() => onTabChange('pickup')}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 transition-all cursor-pointer ${
                  activeTab === 'pickup'
                    ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-xs font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <CalendarPlus className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${activeTab === 'pickup' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-xs">{language === 'hi' ? 'पिकअप' : 'Pickup'}</span>
              </button>

              {/* Tab 3: Account */}
              <button
                type="button"
                id="nav-tab-account"
                onClick={() => onTabChange('account')}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 transition-all relative cursor-pointer ${
                  activeTab === 'account'
                    ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-xs font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <UserCheck className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${activeTab === 'account' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-xs">{language === 'hi' ? 'खाता' : 'Account'}</span>
                {activePickupsCount > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-700 dark:bg-emerald-600 px-1 text-[10px] font-bold text-white">
                    {activePickupsCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Language Switcher Button (EN / हिन्दी) */}
            <button
              type="button"
              id="lang-toggle-btn"
              onClick={toggleLanguage}
              title={language === 'en' ? 'Switch to Hindi (हिन्दी)' : 'Switch to English'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold shadow-2xs hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all cursor-pointer"
            >
              <Languages className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Dark Mode Toggle Button */}
            {onToggleDarkMode && (
              <button
                type="button"
                id="theme-toggle-btn"
                onClick={onToggleDarkMode}
                aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-300 shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 animate-[spin_8s_linear_infinite]" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 hover:text-emerald-700 transition-colors" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
