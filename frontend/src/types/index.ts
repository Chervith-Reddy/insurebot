export type ClaimStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export type ClaimType = 'accident' | 'health' | 'property' | 'vehicle' | 'unknown';

export type IncidentType =
  | 'Car Accident'
  | 'Health Issue'
  | 'Property Damage'
  | 'Vehicle Theft'
  | 'Natural Disaster'
  | 'Other';

export interface StatusHistoryEntry {
  status: ClaimStatus;
  changedAt: string;
  note?: string;
}

export interface Claim {
  _id: string;
  policyNumber: string;
  incidentType: IncidentType;
  description: string;
  amount: number;
  claimType: ClaimType;
  status: ClaimStatus;
  claimerEmail: string;
  claimerName: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ClaimFormData {
  policyNumber: string;
  incidentType: IncidentType | '';
  description: string;
  amount: string;
  claimerEmail: string;
  claimerName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedClaims {
  claims: Claim[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AnalyticsData {
  claimsByType: { type: string; count: number }[];
  claimsByStatus: { status: string; count: number }[];
  averageResolutionTime: number;
  totalClaims: number;
  totalAmount: number;
  monthlyTrends: { year: number; month: number; count: number; totalAmount: number }[];
}

export interface ClaimStats {
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface AIClassificationResult {
  claimType: ClaimType;
  confidence: number;
  reasoning: string;
}
