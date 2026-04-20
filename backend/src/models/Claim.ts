import mongoose, { Schema, Document } from 'mongoose';
import { IClaim, ClaimStatus, ClaimType, IncidentType, StatusHistoryEntry } from '../types';

export interface IClaimDocument extends Omit<IClaim, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const StatusHistorySchema = new Schema<StatusHistoryEntry>(
  {
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const ClaimSchema = new Schema<IClaimDocument>(
  {
    policyNumber: {
      type: String,
      required: [true, 'Policy number is required'],
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9-]{6,20}$/, 'Policy number must be 6-20 alphanumeric characters'],
    },
    incidentType: {
      type: String,
      enum: ['Car Accident', 'Health Issue', 'Property Damage', 'Vehicle Theft', 'Natural Disaster', 'Other'],
      required: [true, 'Incident type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Claim amount is required'],
      min: [1, 'Amount must be at least $1'],
      max: [10000000, 'Amount cannot exceed $10,000,000'],
    },
    claimType: {
      type: String,
      enum: ['accident', 'health', 'property', 'vehicle', 'unknown'],
      default: 'unknown',
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    claimerEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    claimerName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    statusHistory: {
      type: [StatusHistorySchema],
      default: [],
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ClaimSchema.index({ policyNumber: 1 });
ClaimSchema.index({ status: 1 });
ClaimSchema.index({ claimType: 1 });
ClaimSchema.index({ createdAt: -1 });
ClaimSchema.index({ claimerEmail: 1 });

ClaimSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: 'Pending',
      changedAt: new Date(),
      note: 'Claim submitted',
    });
  }
  next();
});

const Claim = mongoose.model<IClaimDocument>('Claim', ClaimSchema);

export default Claim;
