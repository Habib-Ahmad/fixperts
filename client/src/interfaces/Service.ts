export interface Service extends ServicePayload {
  id: string;
  providerId: string;
  mediaUrls: string[];
  averageRating: number;
}

export interface ServicePayload {
  name: string;
  description: string;
  price: number;
  isValidated: boolean;
  category: ServiceCategory;
  emergencyAvailable: boolean;
}

export const serviceCategories = [
  'PLUMBING',
  'ELECTRICAL',
  'CLEANING',
  'HVAC',
  'APPLIANCE_REPAIR',
  'PEST_CONTROL',
  'LANDSCAPING',
  'PAINTING',
  'MOVING',
  'HANDYMAN',
] as const;
export type ServiceCategory = (typeof serviceCategories)[number];
