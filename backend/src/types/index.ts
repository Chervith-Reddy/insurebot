export type ClaimStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export type ClaimType = 'accident' | 'health' | 'property' | 'vehicle' | 'unknown';

export type IncidentType =
  | 'Car Accident'
  | 'Health Issue'
  | 'Property Damage'
  | 'Vehicle Theft'
  | 'Natural Disaster'
  | 'Other';

export interface IClaim {
  _id?: string;
  policyNumber: string;
  incidentType: IncidentType;
  description: string;
  amount: number;
  claimType: ClaimType;
  status: ClaimStatus;
  claimerEmail: string;
  claimerName: string;
  statusHistory: StatusHistoryEntry[];
  createdAt?: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
}

export interface StatusHistoryEntry {
  status: ClaimStatus;
  changedAt: Date;
  note?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AnalyticsData {
  claimsByType: { type: string; count: number }[];
  claimsByStatus: { status: string; count: number }[];
  averageResolutionTime: number;
  totalClaims: number;
  totalAmount: number;
}

export interface AIClassificationResult {
  claimType: ClaimType;
  confidence: number;
  reasoning: string;
}
