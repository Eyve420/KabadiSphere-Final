import React, { useState } from 'react';
import { PickupOrder } from '../types';
import {
  User,
  ShieldCheck,
  Award,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  Calendar,
  X,
  Printer,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AccountTabProps {
  orders: PickupOrder[];
  onCancelOrder: (orderId: string) => void;
  onUpdateOrderStatus?: (orderId: string, status: PickupOrder['status']) => void;
  onNavigateToPickup: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  orders,
  onCancelOrder,
  onUpdateOrderStatus,
  onNavigateToPickup,
}) => {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [viewingCertificateOrder, setViewingCertificateOrder] = useState<PickupOrder | null>(null);

  // Compute stats based on orders
  const totalWeightKg = orders.reduce((acc, o) => acc + o.estimatedKg, 0);
  const totalPayout = orders.reduce((acc, o) => acc + (o.estimatedPayoutMin + o.estimatedPayoutMax) / 2, 0);
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const activeOrders = orders.filter((o) => o.status !== 'completed');

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') return order.status !== 'completed';
    if (filter === 'completed') return order.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Account Profile & Eco Impact Header */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xl">
                <User className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {language === 'hi' ? 'हरित नागरिक खाता' : 'Green Citizen Account'}
                  </h2>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                    {language === 'hi' ? 'सत्यापित' : 'Verified'}
                  </span>
                </div>
                <p className="text-xs text-emerald-100/70 mt-0.5">
                  {language === 'hi'
                    ? 'सदस्य: 2026 • स्मार्ट इंडिया हैकाथॉन (SIH 2026) सत्यापित नागरिक'
                    : 'Member since Jan 2026 • Smart India Hackathon (SIH 2026) Verified Citizen'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToPickup}
                className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition-all cursor-pointer"
              >
                {language === 'hi' ? '+ नया पिकअप' : '+ New Pickup'}
              </button>
            </div>
          </div>

          {/* Eco Impact Stats Row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 border-t border-emerald-800/50">
            <div className="rounded-2xl bg-emerald-950/70 border border-emerald-700/40 p-3.5">
              <span className="text-[11px] text-emerald-200/80 font-medium block">
                {language === 'hi' ? 'कुल ई-कचरा रीसायकल' : 'Total E-Waste Diverted'}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{totalWeightKg}</span>
                <span className="text-xs font-semibold text-emerald-300">kg</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">
                {language === 'hi' ? '100% शून्य लैंडफिल' : '100% Zero-Landfill'}
              </span>
            </div>

            <div className="rounded-2xl bg-emerald-950/70 border border-emerald-700/40 p-3.5">
              <span className="text-[11px] text-emerald-200/80 font-medium block">
                {language === 'hi' ? 'कुल प्राप्त भुगतान' : 'Green Cash Payout'}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">₹{Math.round(totalPayout).toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">
                {language === 'hi' ? 'सीधा UPI/नकद प्राप्त' : 'Direct UPI/Cash Paid'}
              </span>
            </div>

            <div className="rounded-2xl bg-emerald-950/70 border border-emerald-700/40 p-3.5">
              <span className="text-[11px] text-emerald-200/80 font-medium block">
                {language === 'hi' ? 'विषाक्त लेड निष्प्रभावी' : 'Toxic Lead Neutralized'}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{Math.round(totalWeightKg * 0.08 * 10) / 10}</span>
                <span className="text-xs font-semibold text-emerald-300">kg</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">
                {language === 'hi' ? 'मिट्टी में मिलने से बचाया' : 'Prevented in Soil'}
              </span>
            </div>

            <div className="rounded-2xl bg-emerald-950/70 border border-emerald-700/40 p-3.5">
              <span className="text-[11px] text-emerald-200/80 font-medium block">
                {language === 'hi' ? 'हरित प्रमाण पत्र' : 'Green Certificates'}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{completedOrders.length}</span>
                <span className="text-xs font-semibold text-emerald-300">
                  {language === 'hi' ? 'जारी' : 'Issued'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">
                {language === 'hi' ? 'ऑडिट योग्य रीसाइक्लिंग' : 'Auditable Recycling'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Info strip */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {language === 'hi' ? 'सत्यापित नागरिक आईडी #SIH-EPR-2026-8942' : 'Verified Citizen ID #SIH-EPR-2026-8942'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {language === 'hi' ? 'सेवा नेटवर्क: डोरस्टेप रीसाइक्लिंग हब' : 'Service Network: Doorstep Urban Collection Network'}
            </span>
          </div>
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
            {language === 'hi' ? 'वैधानिक नियमों के अनुरूप' : 'Statutory Manifests Compliant'}
          </span>
        </div>
      </section>

      {/* Pickup History Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'डोरस्टेप पिकअप इतिहास एवं लाइव ट्रैकिंग' : 'Doorstep Pickup History & Real-Time Tracking'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? 'नियुक्त संग्राहक देखें, OTP प्राप्त करें या आधिकारिक निपटान प्रमाणपत्र डाउनलोड करें।'
                : 'Track assigned collectors, view OTPs, or download official disposal certificates'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'सभी' : 'All'} ({orders.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${
                filter === 'active'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'सक्रिय' : 'Active'} ({activeOrders.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${
                filter === 'completed'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? 'पूर्ण' : 'Completed'} ({completedOrders.length})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center transition-colors">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
              <Truck className="h-7 w-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {language === 'hi' ? 'कोई पिकअप नहीं मिला' : 'No Pickups Found'}
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {language === 'hi'
                ? 'इस फ़िल्टर से मेल खाता कोई पिकअप नहीं है। अपने पुराने ई-कचरे को रीसायकल करने के लिए तैयार हैं?'
                : "You haven't scheduled any pickups matching this filter yet. Ready to clear your obsolete tech?"}
            </p>
            <button
              onClick={onNavigateToPickup}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 dark:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 dark:hover:bg-emerald-700 cursor-pointer"
            >
              <span>{language === 'hi' ? 'ई-कचरा पिकअप शेड्यूल करें' : 'Schedule an E-Waste Pickup'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map((order) => {
              const isCompleted = order.status === 'completed';
              const isInTransit = order.status === 'in_transit';

              return (
                <div
                  key={order.id}
                  id={`history-card-${order.id}`}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isCompleted
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs'
                      : 'border-emerald-700/30 dark:border-emerald-600/40 bg-white dark:bg-slate-900 shadow-xs ring-1 ring-emerald-500/20'
                  }`}
                >
                  {/* Card Top Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 px-5 py-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                        #{order.id}
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">•</span>
                      <span className="text-slate-500 dark:text-slate-400">{order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : isInTransit
                            ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{language === 'hi' ? 'संयंत्र में जमा' : 'Delivered to Smelter'}</span>
                          </>
                        ) : isInTransit ? (
                          <>
                            <Truck className="h-3 w-3" />
                            <span>{language === 'hi' ? 'संग्राहक रास्ते में' : 'Collector In-Transit'}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            <span>{language === 'hi' ? 'संग्राहक नियुक्त' : 'Collector Assigned'}</span>
                          </>
                        )}
                      </span>

                      {/* View Certificate Button for Completed Pickups */}
                      {isCompleted && (
                        <button
                          onClick={() => setViewingCertificateOrder(order)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                        >
                          <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{language === 'hi' ? 'हरित प्रमाणपत्र' : 'Green Certificate'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Scrap Summary */}
                      <div className="flex items-start gap-4">
                        {order.photoUrl ? (
                          <img
                            src={order.photoUrl}
                            alt="Scrap item"
                            className="h-20 w-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 shrink-0">
                            <Scale className="h-8 w-8" />
                          </div>
                        )}

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-bold text-slate-900 dark:text-white">
                              {order.categoryName}
                            </span>
                            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              ~{order.estimatedKg} kg ({order.weightCategory} {language === 'hi' ? 'स्लैब' : 'bracket'})
                            </span>
                          </div>

                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                              ₹{order.estimatedPayoutMin} - ₹{order.estimatedPayoutMax}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              ({language === 'hi' ? 'डोरस्टेप डिजिटल वजन' : 'Doorstep digital weigh-in'})
                            </span>
                          </div>

                          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              {order.pickupDate} ({order.pickupTimeSlot === 'morning' ? (language === 'hi' ? 'सुबह 7:00 - 11:00' : '7:00 - 11:00 AM') : (language === 'hi' ? 'दोपहर 2:00 - 6:00' : '2:00 - 6:00 PM')})
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {order.address.city || 'Local Hub'}, {order.address.state || order.address.pincode || 'India'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Collector & Logistics Box */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 min-w-[260px] text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                              {language === 'hi' ? 'अधिकृत संग्राहक' : 'Authorized Collector'}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-100">{order.collector.name}</span>
                          </div>
                          <span className="rounded bg-amber-100 dark:bg-amber-950/70 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            ★ {order.collector.rating} ({order.collector.completedPickups})
                          </span>
                        </div>

                        <div className="mt-2 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                          <div><strong>{language === 'hi' ? 'वाहन:' : 'Vehicle:'}</strong> {order.collector.vehicleType}</div>
                          <div><strong>{language === 'hi' ? 'स्थिति:' : 'Status:'}</strong> {order.collector.estimatedArrival}</div>
                        </div>

                        {!isCompleted && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {language === 'hi' ? 'डोरस्टेप OTP:' : 'Doorstep OTP:'}
                            </span>
                            <span className="rounded-md bg-emerald-800 px-2.5 py-1 font-mono text-xs font-black text-emerald-200 tracking-wider">
                              {order.pickupOtp}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Simulation / Actions row */}
                    {!isCompleted && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 dark:text-slate-400">
                            {language === 'hi' ? 'लॉजिस्टिक्स चरण:' : 'Live Logistics Step:'}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {order.status === 'scheduled' && (language === 'hi' ? 'डिस्पैच की प्रतीक्षा' : 'Awaiting Dispatch')}
                            {order.status === 'collector_assigned' && (language === 'hi' ? 'वार्ड में संग्राहक नियुक्त' : 'Collector Assigned to Ward')}
                            {order.status === 'in_transit' && (language === 'hi' ? 'संग्राहक रास्ते में है' : 'Collector En Route to House')}
                            {order.status === 'weighing' && (language === 'hi' ? 'डिजिटल तराजू तौल एवं भुगतान जारी' : 'Digital Scale Payout in Progress')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {onUpdateOrderStatus && (
                            <button
                              onClick={() => {
                                const nextStatus =
                                  order.status === 'scheduled'
                                    ? 'collector_assigned'
                                    : order.status === 'collector_assigned'
                                    ? 'in_transit'
                                    : order.status === 'in_transit'
                                    ? 'completed'
                                    : 'completed';
                                onUpdateOrderStatus(order.id, nextStatus);
                              }}
                              className="rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 cursor-pointer"
                            >
                              {language === 'hi'
                                ? `सिमुलेशन आगे बढ़ाएं → ${order.status === 'in_transit' ? 'पूर्ण करें एवं सर्टिफिकेट दें' : 'अगला चरण'}`
                                : `Advance Simulation → ${order.status === 'in_transit' ? 'Complete & Issue Certificate' : 'Next Step'}`}
                            </button>
                          )}

                          <button
                            onClick={() => onCancelOrder(order.id)}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            {language === 'hi' ? 'पिकअप रद्द करें' : 'Cancel Pickup'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Green Recycling Certificate Modal */}
      {viewingCertificateOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border-4 border-emerald-800 dark:border-emerald-700 transition-colors">
            {/* Close Button */}
            <button
              onClick={() => setViewingCertificateOrder(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Certificate Layout */}
            <div className="text-center border-b-2 border-emerald-800/30 dark:border-emerald-700/40 pb-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-2">
                <Award className="h-8 w-8" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400">
                {language === 'hi'
                  ? 'स्मार्ट इंडिया हैकाथॉन (SIH 2026) ई-कचरा रूपरेखा अनुरूप'
                  : 'Smart India Hackathon (SIH 2026) E-Waste Framework Compliant'}
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {language === 'hi' ? 'हरित ई-कचरा निपटान प्रमाण पत्र' : 'Green E-Waste Disposal Certificate'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Certificate ID: {viewingCertificateOrder.certificateId || `SIH-EPR-2026-${viewingCertificateOrder.id}`}
              </p>
            </div>

            <div className="my-6 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <p className="leading-relaxed text-center">
                {language === 'hi' ? (
                  <>यह प्रमाणित किया जाता है कि <strong>{viewingCertificateOrder.address.fullName || 'सत्यापित नागरिक'}</strong> ने <strong>ई-कचरा (प्रबंधन) नियम, 2022</strong> के तहत रीसाइक्लिंग हेतु अप्रचलित इलेक्ट्रॉनिक कचरा विधिवत रूप से सौंपा है।</>
                ) : (
                  <>This is to officially certify that <strong>{viewingCertificateOrder.address.fullName || 'Verified Citizen'}</strong> has formally surrendered obsolete electronic waste for recycling under the <strong>E-Waste (Management) Rules, 2022</strong>.</>
                )}
              </p>

              <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">
                    {language === 'hi' ? 'कचरा श्रेणी' : 'Scrap Category'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewingCertificateOrder.categoryName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">
                    {language === 'hi' ? 'शुद्ध वजन' : 'Net Weight Diverted'}
                  </span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">{viewingCertificateOrder.estimatedKg} kg</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">
                    {language === 'hi' ? 'अधिकृत संयंत्र' : 'Authorized Facility'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewingCertificateOrder.recyclingPlantName || 'GreenTech High-Recovery Smelting Facility'}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">
                    {language === 'hi' ? 'सुरक्षित निस्तारण' : 'Safe Dismantling'}
                  </span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">
                    {language === 'hi' ? '100% शून्य लैंडफिल' : '100% Zero Landfill'}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
                <strong>{language === 'hi' ? 'पर्यावरणीय सत्यापन:' : 'Environmental Verification:'}</strong>{' '}
                {language === 'hi'
                  ? 'RoHS मानकों के अनुसार लेड सोल्डर एवं मरकरी लैंप को अलग किया गया। कीमती धातुओं (सोना, चांदी, तांबा) को औद्योगिक आपूर्ति श्रृंखला में वापस प्रवाहित किया गया।'
                  : 'Heavy metals including Lead solder and Mercury lamps were isolated in accordance with RoHS standards. Precious metals (Au, Ag, Cu) channeled into domestic circular industrial supply chains.'}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {language === 'hi'
                    ? 'कबाड़ी स्फीयर लॉजिस्टिक्स (SIH 2026) द्वारा प्रमाणित'
                    : 'Digitally Authenticated by Kabadi Sphere Logistics (SIH 2026)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
                </button>

                <button
                  onClick={() => setViewingCertificateOrder(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 dark:bg-emerald-700 px-4 py-2 font-bold text-white hover:bg-emerald-900 dark:hover:bg-emerald-600 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{language === 'hi' ? 'हो गया' : 'Done'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
