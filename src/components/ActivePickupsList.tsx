import React from 'react';
import { PickupOrder } from '../types';
import {
  Truck,
  Phone,
  CheckCircle2,
  Clock,
  KeyRound,
  MapPin,
  Scale,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ActivePickupsListProps {
  orders: PickupOrder[];
  onCancelOrder?: (orderId: string) => void;
}

export const ActivePickupsList: React.FC<ActivePickupsListProps> = ({
  orders,
}) => {
  const { language } = useLanguage();

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center transition-colors">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          <Truck className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-bold text-slate-800 dark:text-white">
          {language === 'hi' ? 'कोई सक्रिय पिकअप निर्धारित नहीं' : 'No Active Pickups Scheduled'}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {language === 'hi'
            ? 'ऊपर अपना पहला स्क्रैप पिकअप शेड्यूल करें। हमारे स्थानीय संग्राहक सुरक्षित रूप से कचरे को सत्यापित रीसाइक्लिंग संयंत्रों तक पहुंचाते हैं।'
            : 'Schedule your first scrap pickup above. Our local scrap collectors ensure safe transit directly to verified recycling plants.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {language === 'hi' ? 'शेड्यूल किए गए पिकअप एवं लॉजिस्टिक्स ट्रैकर' : 'Scheduled Pickups & Logistics Tracker'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'आपके पिकअप का वास्तविक समय स्टेटस, निर्दिष्ट संग्राहक एवं OTP सत्यापन।'
              : 'Real-time status of your household pickups, assigned collectors, and OTP verification.'}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          {orders.length} {language === 'hi' ? 'कुल बुकिंग' : 'Total Bookings'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => {
          const isCompleted = order.status === 'completed';
          const isInTransit = order.status === 'in_transit';

          return (
            <div
              key={order.id}
              id={`pickup-card-${order.id}`}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isCompleted
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                  : 'border-emerald-700/25 dark:border-emerald-700/40 bg-white dark:bg-slate-900 shadow-xs'
              }`}
            >
              {/* Order Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 px-5 py-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white tracking-wide">
                    {language === 'hi' ? 'ऑर्डर' : 'Order'} #{order.id}
                  </span>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className="text-slate-500 dark:text-slate-400">{language === 'hi' && order.createdAtHindi ? order.createdAtHindi : order.createdAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                      isCompleted
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : isInTransit
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isCompleted
                          ? 'bg-slate-500'
                          : isInTransit
                          ? 'bg-amber-500 animate-ping'
                          : 'bg-emerald-500 animate-pulse'
                      }`}
                    />
                    {isCompleted
                      ? (language === 'hi' ? 'रीसाइक्लिंग प्लांट में जमा' : 'Delivered to Recycle Plant')
                      : isInTransit
                      ? (language === 'hi' ? 'संग्राहक रास्ते में है' : 'Collector On The Way')
                      : (language === 'hi' ? 'संग्राहक नियुक्त' : 'Collector Assigned')}
                  </span>
                </div>
              </div>

              {/* Order Card Content */}
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Left: Scrap & Payout Details */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {language === 'hi' ? 'कचरा श्रेणी एवं वजन' : 'Scrap Category & Weight'}
                      </span>
                      <div className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                        {language === 'hi' && order.categoryNameHindi ? order.categoryNameHindi : order.categoryName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        <Scale className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          {order.weightCategory.toUpperCase()} {language === 'hi' ? 'स्लैब' : 'bracket'} (~{order.estimatedKg} {language === 'hi' ? 'किलो' : 'kg'})
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 p-3 border border-emerald-200/60 dark:border-emerald-800/60">
                      <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        {language === 'hi' ? 'अनुमानित भुगतान:' : 'Rough Payout Estimate:'}
                      </div>
                      <div className="text-lg font-extrabold text-emerald-900 dark:text-emerald-200">
                        ₹{order.estimatedPayoutMin} - ₹{order.estimatedPayoutMax}
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {language === 'hi'
                          ? 'सटीक वजन एवं शुद्धता जांच के अधीन।'
                          : 'Subject to actual scale weight & purity inspection.'}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Pickup Schedule & Doorstep Address */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {language === 'hi' ? 'निर्धारित समय' : 'Scheduled Slot'}
                      </span>
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{language === 'hi' ? 'दिनांक:' : 'Date:'} {language === 'hi' && order.pickupDateHindi ? order.pickupDateHindi : order.pickupDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          {order.pickupTimeSlot === 'morning'
                            ? (language === 'hi' ? 'सुबह (7:00 AM - 11:00 AM)' : 'Morning (7:00 AM - 11:00 AM)')
                            : (language === 'hi' ? 'दोपहर (2:00 PM - 6:00 PM)' : 'Afternoon (2:00 PM - 6:00 PM)')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {language === 'hi' ? 'पिकअप पता' : 'Pickup Address'}
                      </span>
                      <div className="mt-1 flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
                        <span>
                          {order.address.flatStreet}, {order.address.locality},{' '}
                          {order.address.city} - {order.address.pincode}
                        </span>
                      </div>
                      {order.address.notes && (
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 italic">
                          {language === 'hi' ? 'नोट:' : 'Note:'} {order.address.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Assigned Collector & Doorstep OTP */}
                  <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {language === 'hi' ? 'निर्दिष्ट स्थानीय संग्राहक' : 'Assigned Local Collector'}
                        </span>
                        <span className="rounded bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          ★ {order.collector.rating}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 dark:bg-emerald-700 text-white font-bold text-sm shadow-2xs">
                          {order.collector.name[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {order.collector.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {order.collector.vehicleType} • {order.collector.vehicleNumber}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{order.collector.estimatedArrival}</span>
                      </div>
                    </div>

                    {/* Doorstep OTP */}
                    <div className="mt-3 rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                          <KeyRound className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                          {language === 'hi' ? 'डोरस्टेप सत्यापन OTP' : 'Doorstep Verification OTP'}
                        </span>
                        <div className="text-base font-black tracking-widest text-slate-900 dark:text-white font-mono">
                          {order.pickupOtp}
                        </div>
                      </div>
                      <a
                        href={`tel:${order.collector.phone}`}
                        className="flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 transition-colors"
                      >
                        <Phone className="h-3 w-3" />
                        {language === 'hi' ? 'कॉल' : 'Call'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Logistics Step Progress Bar */}
                <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {language === 'hi' ? 'शेड्यूल' : 'Scheduled'}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {language === 'hi' ? 'संग्राहक नियुक्त' : 'Collector Assigned'}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          isInTransit || isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Truck className="h-3.5 w-3.5" />
                      </div>
                      <span
                        className={`font-bold ${
                          isInTransit ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {language === 'hi' ? 'रास्ते में' : 'In-Transit'}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <span
                        className={`font-bold ${
                          isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {language === 'hi' ? 'प्लांट में रीसायकल' : 'Recycled at Plant'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
