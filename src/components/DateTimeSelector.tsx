import React, { useEffect } from 'react';
import { TimeSlotId } from '../types';
import { TIME_SLOTS } from '../data/scrapData';
import { Calendar as CalendarIcon, Clock, SunMedium, Sunrise, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DateTimeSelectorProps {
  pickupDate: string;
  onPickupDateChange: (date: string) => void;
  pickupTimeSlot: TimeSlotId;
  onPickupTimeSlotChange: (slot: TimeSlotId) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  pickupDate,
  onPickupDateChange,
  pickupTimeSlot,
  onPickupTimeSlotChange,
}) => {
  const { language, t } = useLanguage();

  const now = new Date();
  const currentHour = now.getHours();

  // Calculate today, tomorrow, day-after
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDateLabel = (d: Date) => {
    return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const todayIso = today.toISOString().split('T')[0];
  const tomorrowIso = tomorrow.toISOString().split('T')[0];
  const dayAfterIso = dayAfter.toISOString().split('T')[0];

  // Expiration rules for today:
  // Morning cutoff: 11:00 AM (11:00)
  // Afternoon/Evening cutoff: 6:00 PM (18:00)
  const isMorningExpiredForToday = currentHour >= 11;
  const isAfternoonExpiredForToday = currentHour >= 18;
  const isTodayFullyClosed = isMorningExpiredForToday && isAfternoonExpiredForToday;

  // Auto-switch to valid date/slot if current selection is expired
  useEffect(() => {
    if (pickupDate === todayIso) {
      if (isTodayFullyClosed) {
        // Today has no slots left -> advance to tomorrow
        onPickupDateChange(tomorrowIso);
        onPickupTimeSlotChange('morning');
      } else if (pickupTimeSlot === 'morning' && isMorningExpiredForToday) {
        // Morning is over today -> switch to afternoon
        onPickupTimeSlotChange('afternoon');
      }
    }
  }, [pickupDate, todayIso, isTodayFullyClosed, isMorningExpiredForToday, pickupTimeSlot, tomorrowIso, onPickupDateChange, onPickupTimeSlotChange]);

  const isSelectedDateToday = pickupDate === todayIso;

  const quickDates = [
    {
      label: language === 'hi' ? 'आज' : 'Today',
      sublabel: formatDateLabel(today),
      value: todayIso,
      disabled: isTodayFullyClosed,
      badge: isTodayFullyClosed ? (language === 'hi' ? 'स्लॉट बंद' : 'Closed') : undefined,
    },
    {
      label: language === 'hi' ? 'कल' : 'Tomorrow',
      sublabel: formatDateLabel(tomorrow),
      value: tomorrowIso,
      disabled: false,
    },
    {
      label: language === 'hi' ? 'परसों' : 'In 2 Days',
      sublabel: formatDateLabel(dayAfter),
      value: dayAfterIso,
      disabled: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t('step3Title', '3. Pickup Date')}</span>
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'hi'
            ? 'अपनी सुविधानुसार दिन चुनें। हमारी सेवा सप्ताह के सातों दिन उपलब्ध है।'
            : 'Select when our certified doorstep collector should visit your address.'}
        </p>

        {isTodayFullyClosed && (
          <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-2.5 text-xs text-amber-900 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              {language === 'hi'
                ? 'आज के सभी पिकअप स्लॉट (शाम 6:00 बजे तक) समाप्त हो चुके हैं। कृपया कल या आने वाले दिनों के लिए बुक करें।'
                : 'All collection slots for today have completed. Tomorrow\'s fresh morning slots are open.'}
            </span>
          </div>
        )}

        {/* Quick Date Chips */}
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {quickDates.map((d) => {
            const isSelected = pickupDate === d.value;
            return (
              <button
                key={d.value}
                id={`date-pill-${d.value}`}
                type="button"
                disabled={d.disabled}
                onClick={() => !d.disabled && onPickupDateChange(d.value)}
                className={`relative flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all ${
                  d.disabled
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 text-slate-400'
                    : isSelected
                    ? 'border-2 border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-300 font-bold shadow-xs cursor-pointer'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'
                }`}
              >
                {d.badge && (
                  <span className="absolute -top-2 right-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[9px] font-extrabold px-1.5 py-0.2 border border-rose-200 dark:border-rose-800">
                    {d.badge}
                  </span>
                )}
                <span className="text-xs font-bold">{d.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{d.sublabel}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Date Picker */}
        <div className="mt-2.5 flex items-center gap-2">
          <label htmlFor="custom-date-input" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {language === 'hi' ? 'या विशिष्ट तिथि चुनें:' : 'Or pick specific date:'}
          </label>
          <input
            id="custom-date-input"
            type="date"
            min={isTodayFullyClosed ? tomorrowIso : todayIso}
            value={pickupDate}
            onChange={(e) => onPickupDateChange(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-2xs focus:border-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Time Slot Selection */}
      <div className="pt-2">
        <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t('step4Title', '4. Pickup Time Window')}</span>
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'hi'
            ? 'हमारा प्रमाणित लोकल कलेक्टर इस निर्धारित समय विंडो में आपके घर पहुंचेगा।'
            : 'Our verified doorstep collector will arrive within this designated window.'}
        </p>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIME_SLOTS.map((slot) => {
            const isSelected = pickupTimeSlot === slot.id;
            const isExpired =
              isSelectedDateToday &&
              ((slot.id === 'morning' && isMorningExpiredForToday) ||
                (slot.id === 'afternoon' && isAfternoonExpiredForToday));

            return (
              <button
                key={slot.id}
                id={`slot-btn-${slot.id}`}
                type="button"
                disabled={isExpired}
                onClick={() => !isExpired && onPickupTimeSlotChange(slot.id)}
                className={`relative flex items-start gap-3 rounded-xl p-4 text-left transition-all ${
                  isExpired
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700'
                    : isSelected
                    ? 'border-2 border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 shadow-xs cursor-pointer'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800 cursor-pointer'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isExpired
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      : isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {slot.id === 'morning' ? (
                    <Sunrise className="h-5 w-5" />
                  ) : (
                    <SunMedium className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'hi'
                        ? slot.id === 'morning'
                          ? 'सुबह का स्लॉट'
                          : 'दोपहर / शाम का स्लॉट'
                        : slot.label}
                    </h4>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-extrabold ${
                        isExpired
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-emerald-100/70 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                      }`}
                    >
                      {isExpired
                        ? language === 'hi'
                          ? 'समय समाप्त'
                          : 'Window Closed'
                        : slot.hours}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isExpired
                      ? language === 'hi'
                        ? 'आज के लिए यह समय बीत चुका है। कृपया अगला उपलब्ध स्लॉट चुनें।'
                        : 'This pickup window has ended for today. Please select the next available slot.'
                      : language === 'hi'
                      ? slot.id === 'morning'
                        ? 'सुबह 7 से 11 बजे के बीच सुविधाजनक डिजिटल तौल व संग्रह।'
                        : 'दोपहर 2 से शाम 6 बजे के बीच त्वरित डोरस्टेप पिकअप।'
                      : slot.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
