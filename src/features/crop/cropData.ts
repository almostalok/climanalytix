export interface DistrictCropRecord {
  id: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  insurer: string;
  scheme: 'PMFBY' | 'RWBCIS';
  year: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  sumInsured: number; // ₹ Cr
  grossPremium: number; // ₹ Cr
  farmers: number;
  claimRatio: number; // %
  rainfallDeparture: number; // %
  droughtSpi: number; // Standardized Precipitation Index (-3 to +3)
  sowingProgress: number; // % of normal area
  majorCrops: string[];
  riskCategory: 'LOW_RISK' | 'NORMAL' | 'ELEVATED' | 'HIGH_CLAIM' | 'DROUGHT_ALERT';
}

export type CropMetricParameter =
  | 'premium'
  | 'sum_insured'
  | 'claim_ratio'
  | 'rainfall_departure'
  | 'drought_spi'
  | 'sowing_progress';

export const STATE_VIEWPORTS: Record<string, { center: [number, number]; zoom: number }> = {
  'All India': { center: [22.8, 79.5], zoom: 5 },
  'Uttar Pradesh': { center: [26.85, 80.95], zoom: 7 },
  'Maharashtra': { center: [19.5, 75.7], zoom: 7 },
  'Madhya Pradesh': { center: [23.2, 77.8], zoom: 7 },
  'Rajasthan': { center: [26.8, 74.2], zoom: 7 },
  'Karnataka': { center: [14.8, 75.8], zoom: 7 },
  'Gujarat': { center: [22.3, 71.5], zoom: 7 },
  'Punjab': { center: [30.9, 75.4], zoom: 8 },
  'Haryana': { center: [29.2, 76.3], zoom: 8 },
};

// Comprehensive district catalogue across major agricultural states
const MASTER_DISTRICT_COORDINATES = [
  // Uttar Pradesh
  { state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', lat: 28.35, lon: 77.55, crops: ['Paddy', 'Wheat', 'Mustard'] },
  { state: 'Uttar Pradesh', district: 'Bulandshahr', lat: 28.40, lon: 77.85, crops: ['Wheat', 'Sugarcane', 'Maize'] },
  { state: 'Uttar Pradesh', district: 'Aligarh', lat: 27.88, lon: 78.08, crops: ['Paddy', 'Mustard', 'Bajra'] },
  { state: 'Uttar Pradesh', district: 'Mathura', lat: 27.49, lon: 77.67, crops: ['Bajra', 'Wheat', 'Mustard'] },
  { state: 'Uttar Pradesh', district: 'Agra', lat: 27.18, lon: 78.00, crops: ['Potato', 'Mustard', 'Bajra'] },
  { state: 'Uttar Pradesh', district: 'Meerut', lat: 28.98, lon: 77.70, crops: ['Sugarcane', 'Wheat', 'Paddy'] },
  { state: 'Uttar Pradesh', district: 'Lucknow', lat: 26.84, lon: 80.94, crops: ['Paddy', 'Wheat', 'Pulses'] },
  { state: 'Uttar Pradesh', district: 'Varanasi', lat: 25.31, lon: 82.97, crops: ['Paddy', 'Wheat', 'Vegetables'] },
  { state: 'Uttar Pradesh', district: 'Prayagraj', lat: 25.43, lon: 81.84, crops: ['Paddy', 'Wheat', 'Arhar'] },
  { state: 'Uttar Pradesh', district: 'Gorakhpur', lat: 26.76, lon: 83.37, crops: ['Paddy', 'Sugarcane', 'Wheat'] },
  { state: 'Uttar Pradesh', district: 'Kanpur Nagar', lat: 26.44, lon: 80.33, crops: ['Wheat', 'Paddy', 'Mustard'] },
  { state: 'Uttar Pradesh', district: 'Bareilly', lat: 28.36, lon: 79.41, crops: ['Paddy', 'Sugarcane', 'Wheat'] },
  { state: 'Uttar Pradesh', district: 'Jhansi', lat: 25.44, lon: 78.56, crops: ['Soyabean', 'Gram', 'Urad'] },
  { state: 'Uttar Pradesh', district: 'Ayodhya', lat: 26.79, lon: 82.19, crops: ['Paddy', 'Wheat', 'Sugarcane'] },

  // Maharashtra
  { state: 'Maharashtra', district: 'Pune', lat: 18.52, lon: 73.85, crops: ['Sugarcane', 'Soyabean', 'Gram'] },
  { state: 'Maharashtra', district: 'Nashik', lat: 19.99, lon: 73.78, crops: ['Onion', 'Grapes', 'Soyabean'] },
  { state: 'Maharashtra', district: 'Chhatrapati Sambhajinagar', lat: 19.87, lon: 75.34, crops: ['Cotton', 'Soyabean', 'Bajra'] },
  { state: 'Maharashtra', district: 'Nagpur', lat: 21.14, lon: 79.08, crops: ['Cotton', 'Soyabean', 'Oranges'] },
  { state: 'Maharashtra', district: 'Solapur', lat: 17.65, lon: 75.90, crops: ['Jowar', 'Pomegranate', 'Sugarcane'] },
  { state: 'Maharashtra', district: 'Amravati', lat: 20.93, lon: 77.75, crops: ['Cotton', 'Soyabean', 'Pigeon Pea'] },
  { state: 'Maharashtra', district: 'Kolhapur', lat: 16.70, lon: 74.24, crops: ['Sugarcane', 'Paddy', 'Soyabean'] },
  { state: 'Maharashtra', district: 'Latur', lat: 18.40, lon: 76.58, crops: ['Soyabean', 'Tur', 'Gram'] },
  { state: 'Maharashtra', district: 'Jalgaon', lat: 21.00, lon: 75.56, crops: ['Cotton', 'Banana', 'Maize'] },
  { state: 'Maharashtra', district: 'Satara', lat: 17.68, lon: 74.01, crops: ['Sugarcane', 'Strawberry', 'Soyabean'] },
  { state: 'Maharashtra', district: 'Ahmednagar', lat: 19.09, lon: 74.74, crops: ['Cotton', 'Soyabean', 'Onion'] },
  { state: 'Maharashtra', district: 'Nanded', lat: 19.15, lon: 77.31, crops: ['Cotton', 'Soyabean', 'Tur'] },

  // Madhya Pradesh
  { state: 'Madhya Pradesh', district: 'Bhopal', lat: 23.25, lon: 77.41, crops: ['Wheat', 'Soyabean', 'Gram'] },
  { state: 'Madhya Pradesh', district: 'Indore', lat: 22.71, lon: 75.85, crops: ['Soyabean', 'Wheat', 'Potato'] },
  { state: 'Madhya Pradesh', district: 'Jabalpur', lat: 23.18, lon: 79.98, crops: ['Wheat', 'Paddy', 'Gram'] },
  { state: 'Madhya Pradesh', district: 'Gwalior', lat: 26.21, lon: 78.17, crops: ['Mustard', 'Wheat', 'Bajra'] },
  { state: 'Madhya Pradesh', district: 'Ujjain', lat: 23.17, lon: 75.78, crops: ['Soyabean', 'Wheat', 'Garlic'] },
  { state: 'Madhya Pradesh', district: 'Sagar', lat: 23.83, lon: 78.73, crops: ['Soyabean', 'Wheat', 'Gram'] },
  { state: 'Madhya Pradesh', district: 'Dewas', lat: 22.96, lon: 76.05, crops: ['Soyabean', 'Wheat', 'Gram'] },
  { state: 'Madhya Pradesh', district: 'Satna', lat: 24.58, lon: 80.83, crops: ['Wheat', 'Paddy', 'Mustard'] },
  { state: 'Madhya Pradesh', district: 'Ratlam', lat: 23.33, lon: 75.03, crops: ['Soyabean', 'Wheat', 'Garlic'] },
  { state: 'Madhya Pradesh', district: 'Sehore', lat: 23.20, lon: 77.08, crops: ['Wheat', 'Soyabean', 'Gram'] },

  // Rajasthan
  { state: 'Rajasthan', district: 'Jaipur', lat: 26.91, lon: 75.78, crops: ['Mustard', 'Bajra', 'Barley'] },
  { state: 'Rajasthan', district: 'Jodhpur', lat: 26.23, lon: 73.02, crops: ['Bajra', 'Moong', 'Guar'] },
  { state: 'Rajasthan', district: 'Kota', lat: 25.18, lon: 75.83, crops: ['Soyabean', 'Wheat', 'Mustard'] },
  { state: 'Rajasthan', district: 'Bikaner', lat: 28.02, lon: 73.31, crops: ['Guar', 'Moth', 'Groundnut'] },
  { state: 'Rajasthan', district: 'Udaipur', lat: 24.58, lon: 73.71, crops: ['Maize', 'Wheat', 'Gram'] },
  { state: 'Rajasthan', district: 'Ajmer', lat: 26.44, lon: 74.63, crops: ['Jowar', 'Bajra', 'Moong'] },
  { state: 'Rajasthan', district: 'Bhilwara', lat: 25.34, lon: 74.63, crops: ['Maize', 'Urad', 'Cotton'] },
  { state: 'Rajasthan', district: 'Alwar', lat: 27.55, lon: 76.63, crops: ['Mustard', 'Bajra', 'Wheat'] },
  { state: 'Rajasthan', district: 'Sikar', lat: 27.61, lon: 75.14, crops: ['Bajra', 'Guar', 'Gram'] },
  { state: 'Rajasthan', district: 'Sri Ganganagar', lat: 29.90, lon: 73.87, crops: ['Cotton', 'Wheat', 'Mustard'] },

  // Karnataka
  { state: 'Karnataka', district: 'Bengaluru Rural', lat: 13.28, lon: 77.58, crops: ['Ragi', 'Maize', 'Vegetables'] },
  { state: 'Karnataka', district: 'Mysuru', lat: 12.29, lon: 76.63, crops: ['Paddy', 'Ragi', 'Cotton'] },
  { state: 'Karnataka', district: 'Belagavi', lat: 15.84, lon: 74.49, crops: ['Sugarcane', 'Soyabean', 'Maize'] },
  { state: 'Karnataka', district: 'Dharwad', lat: 15.45, lon: 75.00, crops: ['Cotton', 'Soyabean', 'Chilli'] },
  { state: 'Karnataka', district: 'Kalaburagi', lat: 17.32, lon: 76.83, crops: ['Tur', 'Jowar', 'Sunflower'] },
  { state: 'Karnataka', district: 'Davanagere', lat: 14.46, lon: 75.92, crops: ['Paddy', 'Maize', 'Cotton'] },
  { state: 'Karnataka', district: 'Ballari', lat: 15.13, lon: 76.92, crops: ['Paddy', 'Cotton', 'Chilli'] },
  { state: 'Karnataka', district: 'Vijayapura', lat: 16.83, lon: 75.71, crops: ['Jowar', 'Grapes', 'Pomegranate'] },
  { state: 'Karnataka', district: 'Shivamogga', lat: 13.92, lon: 75.56, crops: ['Paddy', 'Arecanut', 'Maize'] },
  { state: 'Karnataka', district: 'Raichur', lat: 16.20, lon: 77.35, crops: ['Paddy', 'Cotton', 'Groundnut'] },

  // Gujarat
  { state: 'Gujarat', district: 'Ahmedabad', lat: 23.02, lon: 72.57, crops: ['Cotton', 'Wheat', 'Paddy'] },
  { state: 'Gujarat', district: 'Surat', lat: 21.17, lon: 72.83, crops: ['Sugarcane', 'Paddy', 'Banana'] },
  { state: 'Gujarat', district: 'Vadodara', lat: 22.30, lon: 73.18, crops: ['Cotton', 'Tur', 'Tobacco'] },
  { state: 'Gujarat', district: 'Rajkot', lat: 22.30, lon: 70.80, crops: ['Groundnut', 'Cotton', 'Sesamum'] },
  { state: 'Gujarat', district: 'Bhavnagar', lat: 21.76, lon: 72.15, crops: ['Groundnut', 'Cotton', 'Onion'] },
  { state: 'Gujarat', district: 'Jamnagar', lat: 22.47, lon: 70.05, crops: ['Groundnut', 'Cotton', 'Garlic'] },

  // Punjab & Haryana
  { state: 'Punjab', district: 'Ludhiana', lat: 30.90, lon: 75.85, crops: ['Paddy', 'Wheat', 'Maize'] },
  { state: 'Punjab', district: 'Amritsar', lat: 31.63, lon: 74.87, crops: ['Paddy', 'Wheat', 'Vegetables'] },
  { state: 'Punjab', district: 'Bathinda', lat: 30.21, lon: 74.94, crops: ['Cotton', 'Wheat', 'Paddy'] },
  { state: 'Haryana', district: 'Karnal', lat: 29.68, lon: 76.98, crops: ['Basmati Paddy', 'Wheat', 'Sugarcane'] },
  { state: 'Haryana', district: 'Hisar', lat: 29.14, lon: 75.72, crops: ['Cotton', 'Wheat', 'Mustard'] },
  { state: 'Haryana', district: 'Sirsa', lat: 29.53, lon: 75.02, crops: ['Cotton', 'Wheat', 'Guar'] },
];

const INSURERS = [
  'Agriculture Insurance Co. (AIC)',
  'HDFC ERGO General',
  'Bajaj Allianz General',
  'ICICI Lombard',
  'SBI General Insurance',
];

// Simple pseudorandom generator for deterministic seeded demo metrics
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateDistrictCropData(
  selectedState: string,
  selectedYear: string,
  selectedSeason: 'Kharif' | 'Rabi' | 'Zaid',
  selectedInsurer: string,
  selectedScheme: 'PMFBY' | 'RWBCIS'
): DistrictCropRecord[] {
  const yearSeed = parseInt(selectedYear.split('-')[0], 10) || 2024;
  const seasonFactor = selectedSeason === 'Kharif' ? 1.0 : selectedSeason === 'Rabi' ? 0.75 : 0.35;
  const schemeFactor = selectedScheme === 'PMFBY' ? 1.0 : 0.65;

  const targetDistricts =
    selectedState === 'All India'
      ? MASTER_DISTRICT_COORDINATES
      : MASTER_DISTRICT_COORDINATES.filter((d) => d.state === selectedState);

  return targetDistricts.map((item, idx) => {
    // Generate deterministic seed per district + year + season
    const seed = yearSeed * 100 + idx * 7 + (selectedSeason === 'Kharif' ? 1 : 2);
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 1);
    const r3 = seededRandom(seed + 2);
    const r4 = seededRandom(seed + 3);
    const r5 = seededRandom(seed + 4);

    // Distribute insurers across clusters
    const insurer = INSURERS[(idx + yearSeed) % INSURERS.length];

    // Calculate metrics
    const baseSumInsured = 800 + Math.round(r1 * 2200);
    const sumInsured = Number((baseSumInsured * seasonFactor * schemeFactor).toFixed(1));
    const premiumRate = 0.08 + r2 * 0.06; // 8% to 14% actuarial premium rate
    const grossPremium = Number((sumInsured * premiumRate).toFixed(1));
    const farmers = Math.round(35000 + r3 * 110000 * seasonFactor);

    // Weather departure & claim ratio correlation
    // Negative rainfall departure correlates with higher claims ratio
    const rainfallDeparture = Number((-45 + r4 * 90).toFixed(1)); // -45% to +45%
    let claimRatio = Math.round(30 + r5 * 55);
    if (rainfallDeparture < -20) {
      claimRatio += Math.round(Math.abs(rainfallDeparture) * 0.8);
    }
    claimRatio = Math.min(135, Math.max(18, claimRatio));

    // Drought SPI Index (-2.8 to +2.5)
    const droughtSpi = Number((rainfallDeparture / 25 + (r1 - 0.5) * 0.6).toFixed(2));

    // Sowing Progress (% of normal)
    const sowingProgress = Math.round(65 + r2 * 45);

    // Risk Classification
    let riskCategory: DistrictCropRecord['riskCategory'] = 'NORMAL';
    if (claimRatio > 80) riskCategory = 'HIGH_CLAIM';
    else if (droughtSpi < -1.5 || rainfallDeparture < -30) riskCategory = 'DROUGHT_ALERT';
    else if (claimRatio > 60 || sowingProgress < 75) riskCategory = 'ELEVATED';
    else if (claimRatio < 40) riskCategory = 'LOW_RISK';

    return {
      id: `${item.state}_${item.district}`.toLowerCase().replace(/\s+/g, '_'),
      district: item.district,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
      insurer,
      scheme: selectedScheme,
      year: selectedYear,
      season: selectedSeason,
      sumInsured,
      grossPremium,
      farmers,
      claimRatio,
      rainfallDeparture,
      droughtSpi,
      sowingProgress,
      majorCrops: item.crops,
      riskCategory,
    };
  });
}
