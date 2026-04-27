import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Claim from '../models/Claim';
import { AIService } from '../services/aiService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { ApiResponse, IClaim, IncidentType } from '../types';

export const submitClaim = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { policyNumber, incidentType, description, amount, claimerEmail, claimerName } = req.body;

  const aiResult = await AIService.classifyClaim(incidentType as IncidentType, description);

  const claim = new Claim({
    policyNumber: policyNumber.toUpperCase(),
    incidentType,
    description,
    amount: parseFloat(amount),
    claimType: aiResult.claimType,
    status: 'Pending',
    claimerEmail,
    claimerName,
    statusHistory: [],
  });

  await claim.save();

  const response: ApiResponse<{ claim: IClaimDocument; aiClassification: typeof aiResult }> = {
    success: true,
    message: 'Claim submitted successfully',
    data: {
      claim: claim.toJSON() as unknown as IClaimDocument,
      aiClassification: aiResult,
    },
  };

  res.status(201).json(response);
});

type IClaimDocument = IClaim & { _id: string };

export const getClaimById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError('Invalid claim ID format', 400);
  }

  const claim = await Claim.findById(id);

  if (!claim) {
    throw createError('Claim not found', 404);
  }

  const response: ApiResponse<IClaim> = {
    success: true,
    data: claim.toJSON() as unknown as IClaim,
  };

  res.status(200).json(response);
});

export const getClaimByPolicyNumber = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { policyNumber } = req.params;

  const claims = await Claim.find({
    policyNumber: policyNumber.toUpperCase(),
  }).sort({ createdAt: -1 });

  if (!claims || claims.length === 0) {
    throw createError('No claims found for this policy number', 404);
  }

  const response: ApiResponse<IClaim[]> = {
    success: true,
    data: claims.map((c) => c.toJSON()) as unknown as IClaim[],
    message: `Found ${claims.length} claim(s)`,
  };

  res.status(200).json(response);
});

export const getAllClaims = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    status,
    claimType,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const filter: Record<string, string> = {};

  if (status && typeof status === 'string') {
    filter['status'] = status;
  }

  if (claimType && typeof claimType === 'string') {
    filter['claimType'] = claimType;
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = { [sortBy as string]: sortDirection };

  const [claims, total] = await Promise.all([
    Claim.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
    Claim.countDocuments(filter),
  ]);

  const response = {
    success: true,
    data: {
      claims: claims.map((c) => c.toJSON()),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    },
  };

  res.status(200).json(response);
});
