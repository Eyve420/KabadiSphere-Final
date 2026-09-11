export type ScrapCategoryId =
  | 'laptops_computers'
  | 'smartphones_tablets'
  | 'large_appliances'
  | 'cables_adapters'
  | 'small_gadgets'
  | 'batteries_ups'
  | 'monitors_tvs';

export interface ScrapCategory {
  id: ScrapCategoryId;
  name: string;
  hindiName?: string;
  ratePerKg: number;
  minRate: number;
  maxRate: number;
  unit: string;
  color: string;
  badgeBg: string;
  description: string;
  commonItems: string[];
  environmentalBenefit: string;
  preciousMetalsRecoverable: string;
  eprCreditPerKg: number;
  hazardousComponents: string;
  weeklyHistory: { label: string; rate: number }[];
  monthlyHistory: { label: string; rate: number }[];
  trendChange: number; // e.g. +3.5%
  plantDemand: 'High' | 'Moderate' | 'Peak';
  sampleImageUrl?: string;
  sampleImageCaption?: string;
}

export interface SampleScrapPhoto {
  id: string;
  name: string;
  category: ScrapCategoryId;
  imageUrl: string;
  description: string;
}

export type WeightCategoryId = 'light' | 'medium' | 'bulk';

export interface WeightCategory {
  id: WeightCategoryId;
  label: string;
  rangeText: string;
  ruleText: string;
  minKg: number;
  maxKg: number;
  defaultKg: number;
  description: string;
  vehicleAssigned: string;
}

export type TimeSlotId = 'morning' | 'afternoon';

export interface TimeSlot {
  id: TimeSlotId;
  label: string;
  hours: string;
  description: string;
}

export interface AIAnalysisResult {
  primaryCategory: ScrapCategoryId;
  categoryName: string;
  confidence: number;
  detectedItems: string[];
  purityEstimate: string;
  recyclingAdvice: string;
  moistureOrImpurityWarning?: string;
  errorNotice?: string;
  suggestedWeightCategory?: WeightCategoryId;
  suggestedWeightKg?: number;
}

export interface PickupOrder {
  id: string;
  createdAt: string;
  category: ScrapCategoryId;
  categoryName: string;
  weightCategory: WeightCategoryId;
  estimatedKg: number;
  estimatedPayoutMin: number;
  estimatedPayoutMax: number;
  pickupDate: string;
  pickupTimeSlot: TimeSlotId;
  address: {
    fullName: string;
    phone: string;
    flatStreet: string;
    locality: string;
    city: string;
    state?: string;
    pincode: string;
    notes?: string;
  };
  photoUrl?: string;
  aiAnalysis?: AIAnalysisResult;
  status: 'scheduled' | 'collector_assigned' | 'in_transit' | 'weighing' | 'completed';
  collector: {
    name: string;
    phone: string;
    rating: number;
    completedPickups: number;
    vehicleNumber: string;
    vehicleType: string;
    estimatedArrival: string;
  };
  pickupOtp: string;
  recyclingPlantName?: string;
  certificateId?: string;
}

export interface GovtPolicy {
  id: string;
  actTitle: string;
  actTitleHindi?: string;
  shortTitle?: string;
  shortTitleHindi?: string;
  authority: string;
  authorityHindi?: string;
  year: string;
  summary: string;
  summaryHindi?: string;
  citizenRelevance: string;
  citizenRelevanceHindi?: string;
  penaltiesOrIncentives: string;
  penaltiesOrIncentivesHindi?: string;
  keyDirectives: string[];
  keyDirectivesHindi?: string[];
  officialDocUrl?: string;
}
