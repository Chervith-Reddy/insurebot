import { Router } from 'express';
import {
  updateClaimStatus,
  getAnalytics,
  deleteClaim,
  getClaimStats,
} from '../controllers/adminController';
import { validateStatusUpdate, handleValidationErrors } from '../middleware/validateRequest';

const router = Router();

/**
 * GET /api/admin/analytics
 * Get analytics data for dashboard
 */
router.get('/analytics', getAnalytics);

/**
 * GET /api/admin/stats
 * Get quick stats counts
 */
router.get('/stats', getClaimStats);

/**
 * PATCH /api/admin/claims/:id/status
 * Update claim status (admin action)
 */
router.patch('/claims/:id/status', validateStatusUpdate, handleValidationErrors, updateClaimStatus);

/**
 * DELETE /api/admin/claims/:id
 * Delete a claim (admin only)
 */
router.delete('/claims/:id', deleteClaim);

export default router;
