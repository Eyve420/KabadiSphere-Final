import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & General
    appTitle: 'Kabadi Sphere E-Waste',
    sihBadge: 'Smart India Hackathon 2026 Project',
    navLiveRates: 'Live Rates & Trends',
    navSchedule: 'Schedule Pickup',
    navImpact: 'Eco Payouts',
    navPolicies: 'Govt Regulations',
    navAccount: 'Green Account',
    languageToggle: 'हिन्दी',

    // Home / Hero
    heroBadge: 'Smart India Hackathon (SIH 2026) E-Waste Network',
    heroTitle: 'Scientific Doorstep E-Waste Recycling with Certified Payouts',
    heroSubtitle: 'Connecting households and institutions directly with certified electronic recyclers. Transparent digital weighing, live metal commodity indices, and doorstep green payouts.',
    ctaSchedule: 'Schedule Doorstep Pickup',
    ctaExploreRates: 'Explore Live Metal Rates',
    refreshRates: 'Refresh Live Rates',

    // Pickup Form Steps
    step1Title: '1. Photo Capture & AI Electronic Scrap Identification',
    step1Subtitle: 'Upload or take a photo of your electronic scrap. Our AI identifies the category and auto-suggests weight volume.',
    step2Title: '2. Scrap Weight Bracket',
    step2Subtitle: 'Select your approximate electronic scrap volume. Calibrated digital scale weighing on arrival.',
    step3Title: '3. Pickup Date',
    step3Subtitle: 'Choose your preferred date. Pickups operate 7 days a week.',
    step4Title: '4. Pickup Time Window',
    step4Subtitle: 'Our verified doorstep collector will arrive within this designated window.',
    step5Title: '5. Household Address & Contact',
    step5Subtitle: 'Collector coordinates directly with you upon arrival. Zero logistics fee.',

    // Weight brackets
    weightLight: 'Light Volume',
    weightMedium: 'Medium Volume',
    weightBulk: 'Bulk / Commercial',
    autoWeightBadge: 'Auto-Selected by AI Scan',

    // Time Slot
    morningSlot: 'Morning Slot',
    afternoonSlot: 'Afternoon / Evening Slot',
    slotExpired: 'Slot Closed for Today',
    slotsClosedToday: 'Today\'s slots closed',

    // Location
    autoDetectLocation: 'Auto-Detect Current Location',
    acquiringGps: 'Acquiring GPS fix...',
    gpsLocked: 'GPS Location Verified',
    searchColonyPlaceholder: 'Search society, street, or landmark...',
    fullName: 'Full Name',
    mobileNumber: 'Mobile Number (for OTP & Calling)',
    flatStreet: 'Flat / House No. & Building / Street',
    locality: 'Locality / Area / Landmark',
    city: 'City / District',
    state: 'State',
    pincode: 'Pincode',
    instructions: 'Pickup Instructions (Optional)',

    // Actions
    confirmPickup: 'Confirm & Schedule Doorstep Pickup',
    scheduling: 'Scheduling with Local Collector...',

    // Categories
    cat_laptops_computers: 'Laptops, PCs & Motherboards',
    cat_smartphones_tablets: 'Smartphones & Tablets',
    cat_large_appliances: 'Refrigerators, ACs & Heavy Appliances',
    cat_cables_adapters: 'Copper Cables, Chargers & Adapters',
    cat_small_gadgets: 'Mixers, Routers & Small Gadgets',
    cat_batteries_ups: 'Home UPS & Inverter Batteries',
    cat_monitors_tvs: 'LCD, LED TVs & Monitors',
  },
  hi: {
    // Nav & General
    appTitle: 'कबाड़ी स्फीयर ई-कचरा',
    sihBadge: 'स्मार्ट इंडिया हैकथॉन 2026 प्रोजेक्ट',
    navLiveRates: 'लाइव दरें और रुझान',
    navSchedule: 'पिकअप शेड्यूल करें',
    navImpact: 'इको भुगतान',
    navPolicies: 'सरकारी नियम',
    navAccount: 'ग्रीन खाता',
    languageToggle: 'English',

    // Home / Hero
    heroBadge: 'स्मार्ट इंडिया हैकथॉन (SIH 2026) ई-कचरा नेटवर्क',
    heroTitle: 'प्रमाणित भुगतान के साथ घर बैठे वैज्ञानिक ई-कचरा रीसाइक्लिंग',
    heroSubtitle: 'घरों और संस्थानों को प्रमाणित ई-कचरा रिफाइनरों से सीधे जोड़ना। पारदर्शी डिजिटल तौल, धातु सूचकांक और तत्काल डिजिटल भुगतान।',
    ctaSchedule: 'घर से पिकअप बुक करें',
    ctaExploreRates: 'लाइव धातु दरें देखें',
    refreshRates: 'दरें रिफ्रेश करें',

    // Pickup Form Steps
    step1Title: '1. फोटो कैप्चर और AI ई-कचरा पहचान',
    step1Subtitle: 'अपने इलेक्ट्रॉनिक स्क्रैप की फोटो लें या अपलोड करें। AI स्वचालित रूप से श्रेणी और वजन ब्रैकेट का चयन करेगा।',
    step2Title: '2. स्क्रैप वजन श्रेणी',
    step2Subtitle: 'अपने स्क्रैप का अनुमानित वजन चुनें। आगमन पर सटीक डिजिटल तराजू से तौल की जाएगी।',
    step3Title: '3. पिकअप की तिथि',
    step3Subtitle: 'अपनी सुविधानुसार दिन चुनें। हमारी सेवा सप्ताह के सातों दिन उपलब्ध है।',
    step4Title: '4. पिकअप समय स्लॉट',
    step4Subtitle: 'हमारा प्रमाणित लोकल कलेक्टर इस निर्धारित समय में आपके घर पहुंचेगा।',
    step5Title: '5. घर का पता और संपर्क विवरण',
    step5Subtitle: 'पहुंचने पर कलेक्टर आपसे सीधे संपर्क करेगा। शून्य लॉजिस्टिक्स शुल्क।',

    // Weight brackets
    weightLight: 'हल्का भार (< 10 किग्रा)',
    weightMedium: 'मध्यम भार (10 – 50 किग्रा)',
    weightBulk: 'थोक / भारी स्क्रैप (> 50 किग्रा)',
    autoWeightBadge: 'AI स्कैन द्वारा चयनित',

    // Time Slot
    morningSlot: 'सुबह का स्लॉट',
    afternoonSlot: 'दोपहर / शाम का स्लॉट',
    slotExpired: 'आज के लिए स्लॉट समाप्त',
    slotsClosedToday: 'आज के स्लॉट बंद',

    // Location
    autoDetectLocation: 'GPS से वर्तमान स्थान खोजें',
    acquiringGps: 'GPS लोकेशन खोजी जा रही है...',
    gpsLocked: 'GPS स्थान सत्यापित',
    searchColonyPlaceholder: 'कॉलोनी, सोसायटी, सड़क या लैंडमार्क खोजें...',
    fullName: 'पूरा नाम',
    mobileNumber: 'मोबाइल नंबर (OTP और कॉल के लिए)',
    flatStreet: 'मकान / फ्लैट नं. और बिल्डिंग / गली',
    locality: 'इलाका / कॉलोनी / लैंडमार्क',
    city: 'शहर / जिला',
    state: 'राज्य',
    pincode: 'पिन कोड',
    instructions: 'पिकअप निर्देश (वैकल्पिक)',

    // Actions
    confirmPickup: 'पुष्टि करें और पिकअप शेड्यूल करें',
    scheduling: 'कलेक्टर से समन्वय किया जा रहा है...',

    // Categories
    cat_laptops_computers: 'लैपटॉप, पीसी और मदरबोर्ड',
    cat_smartphones_tablets: 'स्मार्टफोन और टैबलेट',
    cat_large_appliances: 'फ्रिज, एसी और बड़े उपकरण',
    cat_cables_adapters: 'कॉपर केबल, चार्जर और एडेप्टर',
    cat_small_gadgets: 'मिक्सर, राउटर और छोटे गैजेट्स',
    cat_batteries_ups: 'होम यूपीएस और इन्वर्टर बैटरी',
    cat_monitors_tvs: 'एलईडी टीवी, मॉनिटर और स्क्रीन',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('kabadisphere_lang');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('kabadisphere_lang', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      try {
        localStorage.setItem('kabadisphere_lang', next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const t = (key: string, defaultText?: string): string => {
    return translations[language]?.[key] || defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
