import { Router } from 'express';
import {
  submitClaim,
  getClaimById,
  getClaimByPolicyNumber,
  getAllClaims,
} from '../controllers/claimController';
import { validateClaim, handleValidationErrors } from '../middleware/validateRequest';

const router = Router();

/**
 * POST /api/claims
 * Submit a new insurance claim
 */
router.post('/', validateClaim, handleValidationErrors, submitClaim);

/**
 * GET /api/claims
 * Get all claims (with pagination and filters)
 * Query params: status, claimType, page, limit, sortBy, sortOrder
 */
router.get('/', getAllClaims);

/**
 * GET /api/claims/policy/:policyNumber
 * Get all claims for a policy number
 * MUST be before /:id to avoid 'policy' matching as an ID
 */
router.get('/policy/:policyNumber', getClaimByPolicyNumber);

/**
 * GET /api/claims/:id
 * Get a specific claim by MongoDB ID
 */
router.get('/:id', getClaimById);

export default router;
