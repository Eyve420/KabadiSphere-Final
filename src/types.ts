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
  subtitleEn?: string;
  subtitleHi?: string;
  ratePerKg: number;
  minRate: number;
  maxRate: number;
  unit: string;
  unitHindi?: string;
  color: string;
  darkColor?: string;
  badgeBg: string;
  darkBadgeBg?: string;
  description: string;
  descriptionHindi?: string;
  commonItems: string[];
  commonItemsHindi?: string[];
  environmentalBenefit: string;
  environmentalBenefitHindi?: string;
  preciousMetalsRecoverable: string;
  preciousMetalsRecoverableHindi?: string;
  eprCreditPerKg: number;
  hazardousComponents: string;
  hazardousComponentsHindi?: string;
  weeklyHistory: { label: string; rate: number }[];
  monthlyHistory: { label: string; rate: number }[];
  trendChange: number; // e.g. +3.5%
  plantDemand: 'High' | 'Moderate' | 'Peak';
  plantDemandHindi?: string;
  sampleImageUrl?: string;
  sampleImageCaption?: string;
  sampleImageCaptionHindi?: string;
}

export interface SampleScrapPhoto {
  id: string;
  name: string;
  nameHindi?: string;
  category: ScrapCategoryId;
  imageUrl: string;
  description: string;
  descriptionHindi?: string;
}

export type WeightCategoryId = 'light' | 'medium' | 'bulk';

export interface WeightCategory {
  id: WeightCategoryId;
  label: string;
  labelHindi?: string;
  rangeText: string;
  rangeTextHindi?: string;
  ruleText: string;
  ruleTextHindi?: string;
  minKg: number;
  maxKg: number;
  defaultKg: number;
  description: string;
  descriptionHindi?: string;
  vehicleAssigned: string;
  vehicleAssignedHindi?: string;
}

export type TimeSlotId = 'morning' | 'afternoon';

export interface TimeSlot {
  id: TimeSlotId;
  label: string;
  labelHindi?: string;
  hours: string;
  hoursHindi?: string;
  description: string;
  descriptionHindi?: string;
}

export interface AIAnalysisResult {
  primaryCategory: ScrapCategoryId;
  categoryName: string;
  categoryNameHindi?: string;
  confidence: number;
  detectedItems: string[];
  detectedItemsHindi?: string[];
  purityEstimate: string;
  purityEstimateHindi?: string;
  recyclingAdvice: string;
  recyclingAdviceHindi?: string;
  moistureOrImpurityWarning?: string;
  moistureOrImpurityWarningHindi?: string;
  errorNotice?: string;
  errorNoticeHindi?: string;
  suggestedWeightCategory?: WeightCategoryId;
  suggestedWeightKg?: number;
}

export interface PickupOrder {
  id: string;
  createdAt: string;
  createdAtHindi?: string;
  category: ScrapCategoryId;
  categoryName: string;
  categoryNameHindi?: string;
  weightCategory: WeightCategoryId;
  estimatedKg: number;
  estimatedPayoutMin: number;
  estimatedPayoutMax: number;
  pickupDate: string;
  pickupDateHindi?: string;
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
    vehicleTypeHindi?: string;
    estimatedArrival: string;
    estimatedArrivalHindi?: string;
  };
  pickupOtp: string;
  recyclingPlantName?: string;
  recyclingPlantNameHindi?: string;
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
