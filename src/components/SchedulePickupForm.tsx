import React, { useState, useEffect, useRef } from 'react';
import {
  ScrapCategoryId,
  WeightCategoryId,
  TimeSlotId,
  AIAnalysisResult,
  PickupOrder,
} from '../types';
import { SCRAP_CATEGORIES, WEIGHT_CATEGORIES } from '../data/scrapData';
import { PhotoCapture } from './PhotoCapture';
import { WeightCategorySelector } from './WeightCategorySelector';
import { DateTimeSelector } from './DateTimeSelector';
import { PayoutEstimateCard } from './PayoutEstimateCard';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  User,
  Phone,
  Send,
  Building,
  CheckCircle,
  FileText,
  Truck,
  Sparkles,
  ShieldCheck,
  Navigation,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Crosshair,
  Search,
  X,
} from 'lucide-react';

interface SchedulePickupFormProps {
  initialCategoryId?: ScrapCategoryId;
  onOrderCreated: (order: PickupOrder) => void;
}

interface AddressSearchResult {
  id: number;
  title: string;
  displayName: string;
  road: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  coordsText: string;
}

export const SchedulePickupForm: React.FC<SchedulePickupFormProps> = ({
  initialCategoryId = 'laptops_computers',
  onOrderCreated,
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategoryId>(initialCategoryId);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);

  const [selectedWeightCategory, setSelectedWeightCategory] = useState<WeightCategoryId>('medium');
  const [estimatedKg, setEstimatedKg] = useState<number>(25);

  const todayIso = new Date().toISOString().split('T')[0];
  const [pickupDate, setPickupDate] = useState<string>(todayIso);
  const [pickupTimeSlot, setPickupTimeSlot] = useState<TimeSlotId>('morning');

  // Address State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [flatStreet, setFlatStreet] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');

  // Location detection and place search states
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Address Autocomplete Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentCategory = SCRAP_CATEGORIES.find((c) => c.id === selectedCategory) || SCRAP_CATEGORIES[0];
  const currentWeightCategory = WEIGHT_CATEGORIES.find((w) => w.id === selectedWeightCategory) || WEIGHT_CATEGORIES[0];

  const handleCategorySelected = (category: ScrapCategoryId, aiResult?: AIAnalysisResult) => {
    setSelectedCategory(category);
    if (aiResult) {
      setAiAnalysis(aiResult);
      // Auto-select weight bracket and estimated kg from AI inspection!
      let targetWeight: WeightCategoryId = 'medium';
      let targetKg = 15;

      if (aiResult.suggestedWeightCategory) {
        targetWeight = aiResult.suggestedWeightCategory;
        targetKg = aiResult.suggestedWeightKg || (targetWeight === 'light' ? 5 : targetWeight === 'bulk' ? 60 : 20);
      } else {
        if (category === 'large_appliances') {
          targetWeight = 'bulk';
          targetKg = 60;
        } else if (category === 'smartphones_tablets' || category === 'cables_adapters' || category === 'small_gadgets') {
          targetWeight = 'light';
          targetKg = 5;
        } else if (category === 'batteries_ups') {
          targetWeight = 'medium';
          targetKg = 25;
        } else {
          targetWeight = 'medium';
          targetKg = 15;
        }
      }
      setSelectedWeightCategory(targetWeight);
      setEstimatedKg(targetKg);
    } else {
      // Manual category click
      if (category === 'large_appliances') {
        setSelectedWeightCategory('bulk');
        setEstimatedKg(60);
      } else if (category === 'smartphones_tablets' || category === 'cables_adapters' || category === 'small_gadgets') {
        setSelectedWeightCategory('light');
        setEstimatedKg(5);
      } else if (category === 'batteries_ups') {
        setSelectedWeightCategory('medium');
        setEstimatedKg(25);
      }
    }
  };

  const handleWeightCategoryChange = (category: WeightCategoryId, defaultKg: number) => {
    setSelectedWeightCategory(category);
    setEstimatedKg(defaultKg);
  };

  // Debounced address search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search-address?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowSearchResults(true);
        }
      } catch (err) {
        console.warn('Address search request failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to dismiss search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchResult = (result: AddressSearchResult) => {
    // Auto-fill all address fields cleanly
    const street = result.road || (result.title !== result.city && result.title !== result.locality ? result.title : '') || result.locality || '';
    if (street) {
      setFlatStreet(street);
    }

    const loc = result.locality || (result.title !== result.city ? result.title : '');
    if (loc) {
      setLocality(loc);
    }

    if (result.city) {
      setCity(result.city);
    }

    if (result.state) {
      setState(result.state);
    }

    if (result.pincode) {
      setPincode(result.pincode);
    }

    setSearchQuery(result.displayName || result.title);
    setShowSearchResults(false);
    setLocationError(null);
  };

  // Geolocation auto-detection handler with high-precision server-side reverse geocoding
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        language === 'hi'
          ? 'आपके ब्राउज़र में जीपीएस लोकेशन समर्थित नहीं है।'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`);

          if (res.ok) {
            const data = await res.json();
            if (data.city) setCity(data.city);
            if (data.state) setState(data.state);
            if (data.pincode) setPincode(data.pincode);
            if (data.locality) setLocality(data.locality);
            if (data.road) setFlatStreet(data.road);
          }
        } catch (fetchErr) {
          console.warn('Reverse geocode request failed:', fetchErr);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError(
            language === 'hi'
              ? 'जीपीएस अनुमति अस्वीकृत। कृपया नीचे अपना शहर और पता मैन्युअल रूप से दर्ज करें।'
              : 'GPS permission denied. Please enter your city and address manually below.'
          );
        } else {
          setLocationError(
            language === 'hi'
              ? 'जीपीएस फिक्स प्राप्त नहीं हो सका। कृपया अपना पता मैन्युअल रूप से लिखें।'
              : 'Could not acquire GPS fix. Please enter your address details below.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!fullName.trim() || !phone.trim() || !flatStreet.trim()) {
      setValidationError(
        language === 'hi'
          ? 'कृपया अपना पूरा नाम, मोबाइल नंबर और मकान/स्ट्रीट पता अवश्य भरें।'
          : 'Please provide your full name, mobile number, and street address.'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const minPayout = Math.round(estimatedKg * currentCategory.minRate);
      const maxPayout = Math.round(estimatedKg * currentCategory.maxRate);

      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const randomOrderId = `SIH-${Math.floor(1000 + Math.random() * 9000)}`;

      // Neutral pan-India green verified collector pool (SIH 2026)
      const collectorPool = [
        {
          name: 'Rajesh Kumar',
          phone: '+91 98860 11234',
          rating: 4.9,
          completedPickups: 428,
          vehicleNumber: `EV-VAN-${Math.floor(1000 + Math.random() * 9000)}`,
          vehicleType: currentWeightCategory.vehicleAssigned,
          estimatedArrival: 'Assigned (Window: ' + (pickupTimeSlot === 'morning' ? '7-11 AM' : '2-6 PM') + ')',
        },
        {
          name: 'Sunil Paswan',
          phone: '+91 99002 88471',
          rating: 4.8,
          completedPickups: 310,
          vehicleNumber: `EV-TRUCK-${Math.floor(1000 + Math.random() * 9000)}`,
          vehicleType: currentWeightCategory.vehicleAssigned,
          estimatedArrival: 'Assigned (Window: ' + (pickupTimeSlot === 'morning' ? '7-11 AM' : '2-6 PM') + ')',
        },
      ];
      const collector = collectorPool[Math.floor(Math.random() * collectorPool.length)];

      const newOrder: PickupOrder = {
        id: randomOrderId,
        createdAt: 'Just now',
        category: selectedCategory,
        categoryName: currentCategory.name,
        weightCategory: selectedWeightCategory,
        estimatedKg,
        estimatedPayoutMin: minPayout,
        estimatedPayoutMax: maxPayout,
        pickupDate: pickupDate === todayIso ? (language === 'hi' ? 'आज' : 'Today') : pickupDate,
        pickupTimeSlot,
        address: {
          fullName,
          phone,
          flatStreet,
          locality: locality || 'Doorstep Area',
          city: city || 'Local Hub',
          state: state || undefined,
          pincode,
          notes,
        },
        photoUrl: photoUrl || undefined,
        aiAnalysis: aiAnalysis || undefined,
        status: 'collector_assigned',
        collector,
        pickupOtp: randomOtp,
        recyclingPlantName: 'Govt. Authorized E-Waste Smelter & Hydrometallurgy Facility (SIH 2026)',
        certificateId: `SIH-EPR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      };

      setIsSubmitting(false);
      onOrderCreated(newOrder);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Photo capture & AI categorization */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs transition-colors">
        <PhotoCapture
          selectedCategory={selectedCategory}
          onCategorySelected={handleCategorySelected}
          photoUrl={photoUrl}
          onPhotoChanged={setPhotoUrl}
        />
      </div>

      {/* Step 2: Weight category selector */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs transition-colors">
        <WeightCategorySelector
          selectedWeightCategory={selectedWeightCategory}
          estimatedKg={estimatedKg}
          onWeightCategoryChange={handleWeightCategoryChange}
          onEstimatedKgChange={setEstimatedKg}
        />
      </div>

      {/* Step 3: Date & Time selector */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs transition-colors">
        <DateTimeSelector
          pickupDate={pickupDate}
          onPickupDateChange={setPickupDate}
          pickupTimeSlot={pickupTimeSlot}
          onPickupTimeSlotChange={setPickupTimeSlot}
        />
      </div>

      {/* Step 4: Rough Estimate of Payout with Required Disclaimers */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs transition-colors">
        <PayoutEstimateCard
          category={currentCategory}
          weightCategory={currentWeightCategory}
          estimatedKg={estimatedKg}
        />
      </div>

      {/* Step 5: Household Address, Location Detection & Contact */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {language === 'hi' ? '5. घरेलू पता और पिकअप स्थान' : '5. Household Address & Pickup Location'}
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'कलेक्टर आपके दरवाजे पर पहुंचने पर सीधे आपसे संपर्क करेगा। शून्य रसद शुल्क।' : 'Collector coordinates with you directly upon doorstep arrival. Zero logistics fee.'}
            </p>
          </div>

          {/* Location Feature: Auto-Detect GPS Button */}
          <button
            type="button"
            onClick={handleAutoDetectLocation}
            disabled={isDetectingLocation}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all cursor-pointer shadow-2xs self-start sm:self-auto disabled:opacity-60"
          >
            {isDetectingLocation ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'hi' ? 'GPS लोकेशन खोजी जा रही है...' : 'Acquiring GPS Fix...'}</span>
              </>
            ) : (
              <>
                <Crosshair className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'hi' ? 'वर्तमान स्थान स्वचालित रूप से खोजें' : 'Auto-Detect Current Location'}</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Place & Landmark Search */}
        <div ref={searchContainerRef} className="relative">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              {language === 'hi' ? 'कॉलोनी, सोसायटी, गली या लैंडमार्क खोजें' : 'Search Colony, Society, Street, or Landmark'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
              {language === 'hi' ? 'स्वतः पूर्ण करने के लिए 2+ अक्षर लिखें' : 'Type 2+ letters to auto-complete'}
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowSearchResults(true);
              }}
              placeholder={language === 'hi' ? 'उदा. इंदिरानगर, डीएलएफ फेज 2...' : 'e.g. Indiranagar Sector 14, DLF Phase 2, Powai Lake, or Whitefield...'}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 px-3.5 py-2.5 pl-9 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden transition-colors"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-3 h-3.5 w-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
            )}
            {!isSearching && searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-20 mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 scrollbar-thin">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSearchResult(result);
                  }}
                  onClick={() => handleSelectSearchResult(result)}
                  className="w-full text-left p-3 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-colors flex items-start gap-2.5 cursor-pointer group"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {result.title}
                      </p>
                      {result.pincode && (
                        <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                          {result.pincode}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {result.displayName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSearchResults && searchResults.length === 0 && !isSearching && searchQuery.trim().length >= 2 && (
            <div className="absolute z-20 mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-3 text-center text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'कोई मेल खाता स्थान नहीं मिला। आप अपना विवरण नीचे मैन्युअल रूप से दर्ज कर सकते हैं।' : 'No matching location found. You can enter your street and city manually below.'}
            </div>
          )}
        </div>

        {/* Location Error feedback */}
        {locationError && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:border-emerald-600 focus:outline-hidden transition-colors"
              />
              <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'मोबाइल नंबर (ओटीपी और संपर्क हेतु)' : 'Mobile Number (for OTP & Contact)'}
            </label>
            <div className="mt-1 relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:border-emerald-600 focus:outline-hidden transition-colors"
              />
              <Phone className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'मकान नं. / भवन / गली' : 'Flat / House No. & Building / Street'}
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                required
                value={flatStreet}
                onChange={(e) => setFlatStreet(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. फ्लैट 302, ग्रीन वैली, 5वीं क्रॉस रोड' : 'e.g. Flat 302, Palm Heights, 5th Cross Road'}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:border-emerald-600 focus:outline-hidden transition-colors"
              />
              <Building className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'इलाका / लैंडमार्क' : 'Locality / Area / Landmark'}
            </label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. मेट्रो स्टेशन के पास या मेन मार्केट' : 'e.g. Near Metro Station, Sector 14, or Main Market'}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:border-emerald-600 focus:outline-hidden transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 sm:col-span-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'शहर / जिला' : 'City / District'}
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New Delhi"
                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:border-emerald-600 focus:outline-hidden transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'राज्य' : 'State'}
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Delhi / UP"
                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:border-emerald-600 focus:outline-hidden transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'पिनकोड' : 'Pincode'}
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 110001"
                className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:border-emerald-600 focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'अतिरिक्त निर्देश (वैकल्पिक)' : 'Pickup Instructions (Optional)'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. 2 पुराने लैपटॉप व चार्जर बॉक्स में पैक हैं' : 'e.g. 2 dead laptops & old adapters packed in carton, call on arrival'}
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs focus:border-emerald-600 focus:outline-hidden transition-colors"
            />
          </div>
        </div>
      </div>

      {validationError && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-800 dark:text-rose-300">
          {validationError}
        </div>
      )}

      {/* Confirmation & Dispatch Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-emerald-900/20 dark:border-emerald-900/40 bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 p-6 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              {language === 'hi' ? 'सत्यापित ई-कचरा डोरस्टेप पिकअप (SIH 2026)' : 'Verified Doorstep E-Waste Channelization (SIH 2026)'}
            </h4>
          </div>
          <p className="text-xs text-emerald-200/80">
            {language === 'hi'
              ? 'सत्यापित स्क्रैप कलेक्टर कैलिब्रेटेड डिजिटल तराजू के साथ आएगा। तत्काल UPI या नकद भुगतान।'
              : 'A verified scrap collector arrives with a calibrated digital hanging scale. Payment made immediately via UPI or Cash.'}
          </p>
        </div>

        <button
          type="submit"
          id="btn-schedule-pickup-submit"
          disabled={isSubmitting}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg hover:bg-emerald-400 focus:outline-hidden disabled:opacity-60 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Truck className="h-4 w-4 animate-bounce" />
              <span>{language === 'hi' ? 'कलेक्टर असाइन किया जा रहा है...' : 'Assigning Collector...'}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{language === 'hi' ? 'कलेक्टर बुक करें' : 'Confirm & Dispatch Collector'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
