export interface CalculationResult {
  monthlyBenefit: number;
  benefitMonths: number;
  totalBenefit: number;
  reservedMonths: number;
  maxCap: number;
  isCapped: boolean;
}

export interface RegionLocation {
  province: string;
  details: string;
}

export interface Region {
  id: number;
  name: string;
  minWage: number;
  label: string;
  locations: RegionLocation[];
}
