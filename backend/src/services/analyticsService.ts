import Claim from '../models/Claim';
import { AnalyticsData } from '../types';

export class AnalyticsService {
  static async getAnalyticsData(): Promise<AnalyticsData> {
    const [
      claimsByTypeRaw,
      claimsByStatusRaw,
      totalClaims,
      totalAmountResult,
      resolvedClaims,
    ] = await Promise.all([
      Claim.aggregate([
        { $group: { _id: '$claimType', count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      Claim.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      Claim.countDocuments(),

      Claim.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),

      Claim.aggregate([
        {
          $match: {
            resolvedAt: { $ne: null },
            status: { $in: ['Approved', 'Rejected'] },
          },
        },
        {
          $project: {
            resolutionTime: {
              $subtract: ['$resolvedAt', '$createdAt'],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgResolutionTime: { $avg: '$resolutionTime' },
          },
        },
      ]),
    ]);

    const avgResolutionMs = resolvedClaims[0]?.avgResolutionTime || 0;
    const averageResolutionTime = Math.round(avgResolutionMs / (1000 * 60 * 60));

    const totalAmount = totalAmountResult[0]?.total || 0;

    return {
      claimsByType: claimsByTypeRaw,
      claimsByStatus: claimsByStatusRaw,
      averageResolutionTime,
      totalClaims,
      totalAmount,
    };
  }

  static async getMonthlyTrends() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return Claim.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
          totalAmount: 1,
        },
      },
    ]);
  }
}
