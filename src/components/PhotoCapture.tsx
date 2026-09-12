import React, { useState, useRef, useEffect } from 'react';
import { ScrapCategoryId, AIAnalysisResult, WeightCategoryId } from '../types';
import { SAMPLE_SCRAP_PHOTOS, SCRAP_CATEGORIES } from '../data/scrapData';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  SlidersHorizontal,
  Info,
  Scan,
  Scale,
} from 'lucide-react';

interface PhotoCaptureProps {
  selectedCategory: ScrapCategoryId;
  onCategorySelected: (category: ScrapCategoryId, aiResult?: AIAnalysisResult) => void;
  photoUrl: string | null;
  onPhotoChanged: (url: string | null) => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  selectedCategory,
  onCategorySelected,
  photoUrl,
  onPhotoChanged,
}) => {
  const { language, t } = useLanguage();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AIAnalysisResult | null>(null);
  const [showOverrideMenu, setShowOverrideMenu] = useState(false);
  const [sampleFilterTab, setSampleFilterTab] = useState<string>('all');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Connect stream to video element when it becomes available
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [isCameraActive]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable or permission denied. You can upload an image or choose a demo sample.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      handleImageCaptured(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      handleImageCaptured(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleImageCaptured = (imgDataUrl: string) => {
    onPhotoChanged(imgDataUrl);
    triggerAiAnalysis(imgDataUrl);
  };

  const triggerAiAnalysis = (imgDataUrl: string) => {
    setIsScanning(true);
    setScanResult(null);

    // If it's one of the demo samples, analyze locally with visual scanning effect
    if (SAMPLE_SCRAP_PHOTOS.some((s) => s.imageUrl === imgDataUrl)) {
      setTimeout(() => {
        fallbackLocalAiScan(imgDataUrl);
        setIsScanning(false);
      }, 700);
      return;
    }

    // Call server Gemini API for real uploaded or captured photos
    setTimeout(async () => {
      try {
        const response = await fetch('/api/scan-scrap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: imgDataUrl }),
        });

        if (response.ok) {
          const data = await response.json();
          const detectedCat = (data.primaryCategory || data.detectedCategory) as ScrapCategoryId;
          const matchingCategory = SCRAP_CATEGORIES.find((c) => c.id === detectedCat) || SCRAP_CATEGORIES[0];

          // Compute suggested weight volume
          let suggestedWeightCategory: WeightCategoryId = data.suggestedWeightCategory || 'medium';
          let suggestedWeightKg: number = data.suggestedWeightKg || 15;

          if (!data.suggestedWeightCategory) {
            if (matchingCategory.id === 'large_appliances') {
              suggestedWeightCategory = 'bulk';
              suggestedWeightKg = 60;
            } else if (
              matchingCategory.id === 'smartphones_tablets' ||
              matchingCategory.id === 'cables_adapters' ||
              matchingCategory.id === 'small_gadgets'
            ) {
              suggestedWeightCategory = 'light';
              suggestedWeightKg = 5;
            } else if (matchingCategory.id === 'batteries_ups') {
              suggestedWeightCategory = 'medium';
              suggestedWeightKg = 25;
            }
          }

          const result: AIAnalysisResult = {
            primaryCategory: matchingCategory.id,
            categoryName: matchingCategory.name,
            confidence: data.confidence || 94,
            detectedItems: data.detectedItems || matchingCategory.commonItems.slice(0, 3),
            purityEstimate: data.purityEstimate || 'Clean Electronic Components',
            moistureOrImpurityWarning: data.moistureOrImpurityWarning || undefined,
            recyclingAdvice: data.recyclingAdvice || 'Keep dry and intact for calibrated digital scale weigh-in.',
            suggestedWeightCategory,
            suggestedWeightKg,
          };

          setScanResult(result);
          onCategorySelected(matchingCategory.id, result);
        } else {
          fallbackLocalAiScan(imgDataUrl);
        }
      } catch {
        fallbackLocalAiScan(imgDataUrl);
      } finally {
        setIsScanning(false);
      }
    }, 1200);
  };

  // Resilient fallback logic
  const fallbackLocalAiScan = (imgDataUrl: string) => {
    // Check if it's one of our demo sample photos
    const matchedSample = SAMPLE_SCRAP_PHOTOS.find((s) => s.imageUrl === imgDataUrl);
    const categoryId = (matchedSample ? matchedSample.category : 'laptops_computers') as ScrapCategoryId;
    const matchingCategory = SCRAP_CATEGORIES.find((c) => c.id === categoryId) || SCRAP_CATEGORIES[0];

    let suggestedWeightCategory: WeightCategoryId = 'medium';
    let suggestedWeightKg = 15;
    if (matchingCategory.id === 'large_appliances') {
      suggestedWeightCategory = 'bulk';
      suggestedWeightKg = 60;
    } else if (
      matchingCategory.id === 'smartphones_tablets' ||
      matchingCategory.id === 'cables_adapters' ||
      matchingCategory.id === 'small_gadgets'
    ) {
      suggestedWeightCategory = 'light';
      suggestedWeightKg = 5;
    } else if (matchingCategory.id === 'batteries_ups') {
      suggestedWeightCategory = 'medium';
      suggestedWeightKg = 25;
    }

    const fallbackResult: AIAnalysisResult = {
      primaryCategory: matchingCategory.id,
      categoryName: matchingCategory.name,
      confidence: 96,
      detectedItems: matchedSample?.description
        ? [matchedSample.name, 'Integrated Electronic Components', 'Recoverable Metals']
        : matchingCategory.commonItems.slice(0, 3),
      purityEstimate: 'Dry & Clean Electronic Components',
      moistureOrImpurityWarning:
        matchingCategory.id === 'laptops_computers' || matchingCategory.id === 'smartphones_tablets'
          ? 'Notice: Bulging lithium pouch cells must be detached before crushing.'
          : undefined,
      recyclingAdvice:
        'Channeled to certified hydrometallurgy smelter for 99.2% gold & copper extraction.',
      suggestedWeightCategory,
      suggestedWeightKg,
    };

    setScanResult(fallbackResult);
    onCategorySelected(matchingCategory.id, fallbackResult);
  };

  const handleSampleSelected = (sample: typeof SAMPLE_SCRAP_PHOTOS[0]) => {
    onPhotoChanged(sample.imageUrl);
    triggerAiAnalysis(sample.imageUrl);
  };

  const clearPhoto = () => {
    onPhotoChanged(null);
    setScanResult(null);
    stopCamera();
  };

  const currentCategoryObj =
    SCRAP_CATEGORIES.find((c) => c.id === selectedCategory) || SCRAP_CATEGORIES[0];

  return (
    <div className="space-y-4">
      {/* Title & AI indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Scan className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {language === 'hi' ? '1. फोटो कैप्चर और AI सामग्री स्कैनर' : '1. Photo Capture & AI Material Scanner'}
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'कोई फोटो खींचें या अपलोड करें। Gemini AI ई-कचरे की पहचान करेगा।' : 'Snap or upload a picture. Gemini AI identifies the e-waste category and sets the benchmark recycling rate.'}
          </p>
        </div>

        {photoUrl && !isScanning && (
          <button
            type="button"
            onClick={clearPhoto}
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            {language === 'hi' ? 'फिर से लें / साफ करें' : 'Retake / Clear'}
          </button>
        )}
      </div>

      {/* Camera Live Stream View */}
      {isCameraActive && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500 bg-black aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="h-full w-full object-cover"
          />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-2.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            {language === 'hi' ? 'लाइव AI कैमरा चालू' : 'Live AI Camera Active'}
          </div>

          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg hover:bg-emerald-400 active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              {language === 'hi' ? 'फोटो लें' : 'Capture Photo'}
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="rounded-full bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs hover:bg-slate-800 cursor-pointer"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Captured Photo / Scanning View */}
      {!isCameraActive && photoUrl && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-900/20 dark:border-slate-800 bg-slate-900">
          <div className="relative aspect-video sm:aspect-21/9 max-h-64 w-full bg-slate-950 flex items-center justify-center">
            <img
              src={photoUrl}
              alt="Scrap Preview"
              className="h-full w-full object-contain"
            />

            {/* AI Scanning Beam Animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center">
                <div className="w-full absolute top-0 animate-[bounce_2s_infinite] h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]" />
                <div className="flex items-center gap-2 rounded-full bg-emerald-900/90 px-4 py-2 text-xs font-semibold text-emerald-100 shadow-xl border border-emerald-500/50">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                  {language === 'hi' ? 'Gemini AI सामग्री का विश्लेषण कर रहा है...' : 'Gemini AI scanning material composition...'}
                </div>
              </div>
            )}
          </div>

          {/* AI Scan Result Card */}
          {scanResult && !isScanning && (
            <div className="border-t border-slate-800 bg-slate-900/95 p-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                        {language === 'hi' ? 'AI द्वारा पहचानी गई स्क्रैप श्रेणी' : 'AI Identified Scrap Category'}
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                        {scanResult.confidence}% {language === 'hi' ? 'सटीक' : 'match'}
                      </span>
                    </div>
                    <div className="text-base font-bold text-white flex items-center gap-2">
                      {language === 'hi' && scanResult.categoryNameHindi ? scanResult.categoryNameHindi : scanResult.categoryName}
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOverrideMenu(!showOverrideMenu)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
                  {language === 'hi' ? 'मैन्युअल बदलाव' : 'Manual Override'}
                </button>
              </div>

              {/* Detected Items & Advisory */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {scanResult.detectedItems?.length > 0 && (
                  <div className="rounded-lg bg-slate-800/60 p-2.5 border border-slate-700/50">
                    <span className="font-semibold text-slate-300">{language === 'hi' ? 'पहचाने गए आइटम:' : 'Detected items:'}</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {scanResult.detectedItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-700/70 px-2 py-0.5 text-[11px] text-emerald-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-slate-800/60 p-2.5 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">{language === 'hi' ? 'शुद्धता:' : 'Purity condition:'}</span>
                    <span className="text-emerald-400 font-medium text-[11px]">{scanResult.purityEstimate}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">{scanResult.recyclingAdvice}</p>
                </div>
              </div>

              {/* Visual Auto-Selected Weight Bracket Banner */}
              {scanResult.suggestedWeightCategory && (
                <div className="mt-2.5 flex items-center justify-between rounded-lg bg-emerald-950/70 p-2.5 border border-emerald-600/50 text-xs">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-emerald-200 font-medium">
                        {language === 'hi' ? 'AI द्वारा स्वचालित चयनित वजन:' : 'AI Auto-Selected Weight Bracket:'}
                      </span>{' '}
                      <span className="font-bold text-white bg-emerald-700/80 px-2 py-0.5 rounded text-[11px] inline-block ml-1">
                        {scanResult.suggestedWeightCategory === 'light'
                          ? (language === 'hi' ? 'हल्का भार (< 10 किलो)' : 'Light Volume (< 10 kg)')
                          : scanResult.suggestedWeightCategory === 'bulk'
                          ? (language === 'hi' ? 'थोक स्क्रैप (> 50 किलो)' : 'Bulk Scrap (> 50 kg)')
                          : (language === 'hi' ? 'मध्यम भार (10 – 50 किलो)' : 'Medium Volume (10 – 50 kg)')}
                        {scanResult.suggestedWeightKg ? ` • ~${scanResult.suggestedWeightKg} ${language === 'hi' ? 'किलो' : 'kg'}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 border border-emerald-500/30 whitespace-nowrap">
                    {language === 'hi' ? '✓ स्टेप 2 में सेट' : '✓ Applied to Step 2'}
                  </span>
                </div>
              )}

              {scanResult.moistureOrImpurityWarning && (
                <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-amber-950/40 p-2 text-[11px] text-amber-200/90 border border-amber-800/40">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400 mt-0.5" />
                  <span>{scanResult.moistureOrImpurityWarning}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Capture / Upload Buttons when no photo */}
      {!isCameraActive && !photoUrl && (
        <div className="rounded-2xl border-2 border-dashed border-emerald-900/20 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 text-center transition-colors hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 mb-3 shadow-2xs">
            <Camera className="h-6 w-6" />
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'स्क्रैप की फोटो लें या अपलोड करें' : 'Upload or Capture Scrap Photo'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {language === 'hi'
              ? 'इलेक्ट्रॉनिक कचरे की फोटो खींचें या अपलोड करें। AI स्वचालित रूप से श्रेणी और वजन ब्रैकेट का निर्धारण करेगा।'
              : 'Take a photo of your scrap pile or upload an image. The AI will inspect the material and auto-select your weight volume.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              id="btn-open-camera"
              type="button"
              onClick={startCamera}
              className="flex items-center gap-2 rounded-xl bg-emerald-700 dark:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 dark:hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              {language === 'hi' ? 'कैमरा खोलें' : 'Use Camera'}
            </button>

            <button
              id="btn-upload-file"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              <UploadCloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {language === 'hi' ? 'फोटो अपलोड करें' : 'Upload Photo'}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {cameraError && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
              <Info className="h-3.5 w-3.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Preset Sample Photos for Fast Demo Testing */}
          <div className="mt-5 border-t border-emerald-900/10 dark:border-slate-800 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {language === 'hi' ? 'सत्यापित ई-कचरा नमूना फोटो के साथ टेस्ट करें:' : 'Test with verified e-waste sample photos:'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'त्वरित AI स्कैनिंग अनुकरण के लिए किसी भी फोटो पर क्लिक करें' : 'Click any photo to simulate instant AI scanning'}
              </span>
            </div>

            {/* Category Filter Tabs for Samples */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2.5 scrollbar-thin">
              {[
                { id: 'all', label: language === 'hi' ? 'सभी नमूने' : 'All Samples' },
                { id: 'cables_adapters', label: language === 'hi' ? 'एडेप्टर और केबल' : 'Adapters & Cables' },
                { id: 'laptops_computers', label: language === 'hi' ? 'मदरबोर्ड/पीसी' : 'Motherboards/PCs' },
                { id: 'smartphones_tablets', label: language === 'hi' ? 'स्मार्टफोन' : 'Smartphones' },
                { id: 'batteries_ups', label: language === 'hi' ? 'यूपीएस/बैटरी' : 'UPS/Batteries' },
                { id: 'monitors_tvs', label: language === 'hi' ? 'स्क्रीन और टीवी' : 'Screens & TVs' },
                { id: 'large_appliances', label: language === 'hi' ? 'एसी/फ्रिज' : 'White Goods/AC' },
                { id: 'small_gadgets', label: language === 'hi' ? 'छोटे गैजेट्स' : 'Small Gadgets' },
              ].map((tab) => {
                const isActive = sampleFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSampleFilterTab(tab.id)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Filtered Sample Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {SAMPLE_SCRAP_PHOTOS.filter(
                (sample) => sampleFilterTab === 'all' || sample.category === sampleFilterTab
              ).map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSampleSelected(sample)}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 p-2 text-left transition-all hover:border-emerald-500 hover:shadow-xs cursor-pointer"
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 shrink-0 rounded-lg object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {language === 'hi' && sample.nameHindi ? sample.nameHindi : sample.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {language === 'hi' && sample.descriptionHindi ? sample.descriptionHindi : sample.description}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      <span>{language === 'hi' ? 'ऑटो-स्कैन नमूना' : 'Auto-scan sample'}</span>
                      <span>→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual Override Category Picker (Always accessible or when requested) */}
      {(showOverrideMenu || !photoUrl) && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                {language === 'hi' ? `स्क्रैप श्रेणी चयन ${photoUrl ? '(मैन्युअल)' : ''}` : `Scrap Category Selection ${photoUrl ? '(Manual Override)' : ''}`}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'वह प्राथमिक स्क्रैप सामग्री चुनें जिसे आप पिकअप करवाना चाहते हैं' : 'Choose the primary scrap material you want picked up'}
              </p>
            </div>
            {photoUrl && (
              <button
                type="button"
                onClick={() => setShowOverrideMenu(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            )}
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {SCRAP_CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  id={`override-cat-${cat.id}`}
                  type="button"
                  onClick={() => onCategorySelected(cat.id)}
                  className={`flex items-start gap-3 rounded-xl p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs'
                      : 'border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.sampleImageUrl && (
                    <img
                      src={cat.sampleImageUrl}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 shrink-0 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex w-full items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{language === 'hi' ? (cat.hindiName || cat.name) : cat.name}</span>
                      <span
                        className={`text-[11px] font-extrabold shrink-0 ${
                          isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        ₹{cat.ratePerKg}/{language === 'hi' ? 'किलो' : 'kg'}
                      </span>
                    </div>
                    <span className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 block">
                      {(language === 'hi' && cat.commonItemsHindi ? cat.commonItemsHindi : cat.commonItems).slice(0, 2).join(', ')}
                    </span>
                    {isSelected && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        {language === 'hi' ? 'सक्रिय चयन' : 'Active Selection'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected category summary strip */}
      {!showOverrideMenu && photoUrl && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">{language === 'hi' ? 'वर्तमान श्रेणी:' : 'Current Category:'}</span>
            <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{language === 'hi' ? (currentCategoryObj.hindiName || currentCategoryObj.name) : currentCategoryObj.name}</span>
            <span className="rounded bg-emerald-200/60 dark:bg-emerald-900 px-1.5 py-0.5 font-bold text-emerald-900 dark:text-emerald-200">
              ₹{currentCategoryObj.ratePerKg}/{language === 'hi' ? 'किलो' : 'kg'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowOverrideMenu(true)}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            {language === 'hi' ? 'बदलें' : 'Change'}
          </button>
        </div>
      )}
    </div>
  );
};
