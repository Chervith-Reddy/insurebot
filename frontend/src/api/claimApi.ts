import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  Claim,
  ClaimFormData,
  PaginatedClaims,
  AnalyticsData,
  ClaimStats,
  ClaimStatus,
  ClaimType,
  AIClassificationResult,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.data?.error) {
      return Promise.reject(new Error(error.response.data.error));
    }
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
  }
);

export const submitClaim = async (
  formData: ClaimFormData
): Promise<ApiResponse<{ claim: Claim; aiClassification: AIClassificationResult }>> => {
  const response = await apiClient.post<
    ApiResponse<{ claim: Claim; aiClassification: AIClassificationResult }>
  >('/claims', {
    ...formData,
    amount: parseFloat(formData.amount),
  });
  return response.data;
};

export const getClaimById = async (id: string): Promise<ApiResponse<Claim>> => {
  const response = await apiClient.get<ApiResponse<Claim>>(`/claims/${id}`);
  return response.data;
};

export const getClaimsByPolicyNumber = async (
  policyNumber: string
): Promise<ApiResponse<Claim[]>> => {
  const response = await apiClient.get<ApiResponse<Claim[]>>(
    `/claims/policy/${policyNumber.toUpperCase()}`
  );
  return response.data;
};

export const getAllClaims = async (params: {
  status?: ClaimStatus | '';
  claimType?: ClaimType | '';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<ApiResponse<PaginatedClaims>> => {
  const queryParams = new URLSearchParams();

  if (params.status) queryParams.append('status', params.status);
  if (params.claimType) queryParams.append('claimType', params.claimType);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const response = await apiClient.get<ApiResponse<PaginatedClaims>>(
    `/claims?${queryParams.toString()}`
  );
  return response.data;
};

export const updateClaimStatus = async (
  id: string,
  status: ClaimStatus,
  note?: string
): Promise<ApiResponse<Claim>> => {
  const response = await apiClient.patch<ApiResponse<Claim>>(`/admin/claims/${id}/status`, {
    status,
    note,
  });
  return response.data;
};

export const getAnalytics = async (): Promise<ApiResponse<AnalyticsData>> => {
  const response = await apiClient.get<ApiResponse<AnalyticsData>>('/admin/analytics');
  return response.data;
};

export const getClaimStats = async (): Promise<ApiResponse<ClaimStats>> => {
  const response = await apiClient.get<ApiResponse<ClaimStats>>('/admin/stats');
  return response.data;
};

export const deleteClaim = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/admin/claims/${id}`);
  return response.data;
};
