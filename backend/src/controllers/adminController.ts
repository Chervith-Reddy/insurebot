import { Request, Response } from 'express';
import Claim from '../models/Claim';
import { sendStatusUpdateEmail } from '../services/emailService';
import { getAnalyticsData, getMonthlyTrends } from '../services/analyticsService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { ApiResponse, ClaimStatus, IClaim } from '../types';

export const updateClaimStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, note } = req.body as { status: ClaimStatus; note?: string };

  const claim = await Claim.findById(id);

  if (!claim) {
    throw createError('Claim not found', 404);
  }

  const previousStatus = claim.status;

  if (previousStatus === status) {
    throw createError(`Claim is already in ${status} status`, 400);
  }

  claim.status = status;
  claim.statusHistory.push({
    status,
    changedAt: new Date(),
    note: note || `Status changed from ${previousStatus} to ${status}`,
  });

  if (status === 'Approved' || status === 'Rejected') {
    claim.resolvedAt = new Date();
  } else {
    claim.resolvedAt = undefined as unknown as Date;
  }

  await claim.save();

  await sendStatusUpdateEmail(claim.toJSON() as unknown as IClaim, status, note);

  const response: ApiResponse<IClaim> = {
    success: true,
    message: `Claim status updated to ${status}`,
    data: claim.toJSON() as unknown as IClaim,
  };

  res.status(200).json(response);
});

export const getAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const analytics = await getAnalyticsData();
  const trends = await getMonthlyTrends();

  const response = {
    success: true,
    data: {
      ...analytics,
      monthlyTrends: trends,
    },
  };

  res.status(200).json(response);
});

export const deleteClaim = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const claim = await Claim.findById(id);

  if (!claim) {
    throw createError('Claim not found', 404);
  }

  await Claim.findByIdAndDelete(id);

  const response: ApiResponse<null> = {
    success: true,
    message: 'Claim deleted successfully',
  };

  res.status(200).json(response);
});

export const getClaimStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const [pending, underReview, approved, rejected, total] = await Promise.all([
    Claim.countDocuments({ status: 'Pending' }),
    Claim.countDocuments({ status: 'Under Review' }),
    Claim.countDocuments({ status: 'Approved' }),
    Claim.countDocuments({ status: 'Rejected' }),
    Claim.countDocuments(),
  ]);

  const response = {
    success: true,
    data: {
      pending,
      underReview,
      approved,
      rejected,
      total,
    },
  };

  res.status(200).json(response);
});
