import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { ApiResponse } from '../types';

export const validateClaim: ValidationChain[] = [
  body('policyNumber')
    .trim()
    .notEmpty()
    .withMessage('Policy number is required')
    .matches(/^[A-Za-z0-9-]{6,20}$/)
    .withMessage('Policy number must be 6-20 alphanumeric characters'),

  body('incidentType')
    .notEmpty()
    .withMessage('Incident type is required')
    .isIn(['Car Accident', 'Health Issue', 'Property Damage', 'Vehicle Theft', 'Natural Disaster', 'Other'])
    .withMessage('Invalid incident type'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),

  body('amount')
    .notEmpty()
    .withMessage('Claim amount is required')
    .isFloat({ min: 1, max: 10000000 })
    .withMessage('Amount must be between $1 and $10,000,000'),

  body('claimerEmail')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('claimerName')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
];

export const validateStatusUpdate: ValidationChain[] = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Pending', 'Under Review', 'Approved', 'Rejected'])
    .withMessage('Invalid status value'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: errorMessages.join(', '),
      data: errors.array(),
    });
    return;
  }

  next();
};
