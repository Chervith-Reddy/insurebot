import React, { useState } from 'react';
import { submitClaim } from '../api/claimApi';
import { ClaimFormData, IncidentType, Claim, AIClassificationResult } from '../types';

interface ClaimFormProps {
  onSuccess: (claim: Claim, aiResult: AIClassificationResult) => void;
}

const INCIDENT_TYPES: IncidentType[] = [
  'Car Accident',
  'Health Issue',
  'Property Damage',
  'Vehicle Theft',
  'Natural Disaster',
  'Other',
];

const initialFormData: ClaimFormData = {
  policyNumber: '',
  incidentType: '',
  description: '',
  amount: '',
  claimerEmail: '',
  claimerName: '',
};

type FormErrors = Partial<Record<keyof ClaimFormData, string>>;

const ClaimForm: React.FC<ClaimFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<ClaimFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = 'Policy number is required';
    } else if (!/^[A-Za-z0-9-]{6,20}$/.test(formData.policyNumber.trim())) {
      newErrors.policyNumber = 'Policy number must be 6-20 alphanumeric characters';
    }

    if (!formData.incidentType) {
      newErrors.incidentType = 'Please select an incident type';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    if (!formData.amount) {
      newErrors.amount = 'Claim amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) < 1) {
      newErrors.amount = 'Amount must be at least $1';
    } else if (parseFloat(formData.amount) > 10000000) {
      newErrors.amount = 'Amount cannot exceed $10,000,000';
    }

    if (!formData.claimerEmail.trim()) {
      newErrors.claimerEmail = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.claimerEmail)) {
      newErrors.claimerEmail = 'Must be a valid email address';
    }

    if (!formData.claimerName.trim()) {
      newErrors.claimerName = 'Full name is required';
    } else if (formData.claimerName.trim().length < 2) {
      newErrors.claimerName = 'Name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ClaimFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await submitClaim(formData);
      if (response.success && response.data) {
        onSuccess(response.data.claim, response.data.aiClassification);
        setFormData(initialFormData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit claim';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="claimerName">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="claimerName"
            name="claimerName"
            type="text"
            className={`form-input ${errors.claimerName ? 'error' : ''}`}
            value={formData.claimerName}
            onChange={handleChange}
            placeholder="John Doe"
            maxLength={100}
          />
          {errors.claimerName && <p className="form-error">⚠ {errors.claimerName}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="claimerEmail">
            Email Address <span className="required">*</span>
          </label>
          <input
            id="claimerEmail"
            name="claimerEmail"
            type="email"
            className={`form-input ${errors.claimerEmail ? 'error' : ''}`}
            value={formData.claimerEmail}
            onChange={handleChange}
            placeholder="john@example.com"
          />
          {errors.claimerEmail && <p className="form-error">⚠ {errors.claimerEmail}</p>}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="policyNumber">
            Policy Number <span className="required">*</span>
          </label>
          <input
            id="policyNumber"
            name="policyNumber"
            type="text"
            className={`form-input ${errors.policyNumber ? 'error' : ''}`}
            value={formData.policyNumber}
            onChange={handleChange}
            placeholder="e.g. POL-123456"
            maxLength={20}
          />
          {errors.policyNumber && <p className="form-error">⚠ {errors.policyNumber}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="incidentType">
            Incident Type <span className="required">*</span>
          </label>
          <select
            id="incidentType"
            name="incidentType"
            className={`form-select ${errors.incidentType ? 'error' : ''}`}
            value={formData.incidentType}
            onChange={handleChange}
          >
            <option value="">Select incident type...</option>
            {INCIDENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.incidentType && <p className="form-error">⚠ {errors.incidentType}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="amount">
          Claim Amount (USD) <span className="required">*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontWeight: 600,
            }}
          >
            $
          </span>
          <input
            id="amount"
            name="amount"
            type="number"
            className={`form-input ${errors.amount ? 'error' : ''}`}
            style={{ paddingLeft: 26 }}
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="1"
            max="10000000"
            step="0.01"
          />
        </div>
        {errors.amount && <p className="form-error">⚠ {errors.amount}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Incident Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          value={formData.description}
          onChange={handleChange}
          placeholder="Please describe the incident in detail (minimum 20 characters)..."
          rows={5}
          maxLength={2000}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          {errors.description ? (
            <p className="form-error">⚠ {errors.description}</p>
          ) : (
            <span />
          )}
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            {formData.description.length}/2000
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }}
      >
        {isSubmitting ? (
          <>
            <div className="spinner spinner-sm" />
            Processing with AI...
          </>
        ) : (
          <>🚀 Submit Claim</>
        )}
      </button>
    </form>
  );
};

export default ClaimForm;
