import React, { useState } from 'react';
import { Claim, ClaimStatus, ClaimType } from '../types';
import { updateClaimStatus, deleteClaim } from '../api/claimApi';

interface ClaimsTableProps {
  claims: Claim[];
  onRefresh: () => void;
}

const STATUS_OPTIONS: ClaimStatus[] = ['Pending', 'Under Review', 'Approved', 'Rejected'];

const getStatusBadgeClass = (status: ClaimStatus) => {
  const map: Record<ClaimStatus, string> = {
    Pending: 'badge-pending',
    'Under Review': 'badge-review',
    Approved: 'badge-approved',
    Rejected: 'badge-rejected',
  };
  return `badge ${map[status]}`;
};

const getTypeBadgeClass = (type: ClaimType) => {
  const map: Record<ClaimType, string> = {
    accident: 'badge-accident',
    health: 'badge-health',
    property: 'badge-property',
    vehicle: 'badge-vehicle',
    unknown: 'badge-unknown',
  };
  return `badge ${map[type]}`;
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const ClaimsTable: React.FC<ClaimsTableProps> = ({ claims, onRefresh }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState<string>('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ClaimStatus>('Pending');
  const [actionError, setActionError] = useState('');

  const openStatusModal = (claim: Claim) => {
    setSelectedClaim(claim);
    setNewStatus(claim.status);
    setStatusNote('');
    setActionError('');
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedClaim) return;

    setUpdatingId(selectedClaim._id);
    setActionError('');

    try {
      await updateClaimStatus(selectedClaim._id, newStatus, statusNote || undefined);
      setShowStatusModal(false);
      onRefresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setActionError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this claim? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteClaim(id);
      onRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete claim. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (claims.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p className="empty-state-text">No claims found</p>
        <p className="empty-state-sub">Try adjusting your filters or submit a new claim.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Policy #</th>
              <th>Claimant</th>
              <th>Type</th>
              <th>Incident</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim._id}>
                <td>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 13 }}>
                    {claim.policyNumber}
                  </span>
                </td>
                <td>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{claim.claimerName}</p>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>{claim.claimerEmail}</p>
                  </div>
                </td>
                <td>
                  <span
                    className={getTypeBadgeClass(claim.claimType)}
                    style={{ textTransform: 'capitalize', fontSize: 11 }}
                  >
                    {claim.claimType}
                  </span>
                </td>
                <td style={{ maxWidth: 150 }}>
                  <span style={{ fontSize: 13 }}>{claim.incidentType}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>
                    ${claim.amount.toLocaleString()}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadgeClass(claim.status)} style={{ fontSize: 11 }}>
                    {claim.status}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{formatDate(claim.createdAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => openStatusModal(claim)}
                      disabled={updatingId === claim._id}
                    >
                      {updatingId === claim._id ? (
                        <div className="spinner spinner-sm" />
                      ) : (
                        '✏️ Update'
                      )}
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => handleDelete(claim._id)}
                      disabled={deletingId === claim._id}
                    >
                      {deletingId === claim._id ? (
                        <div className="spinner spinner-sm" />
                      ) : (
                        '🗑️'
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showStatusModal && selectedClaim && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowStatusModal(false);
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 28,
              width: '100%',
              maxWidth: 460,
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Update Claim Status</h3>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
              Policy: <strong>{selectedClaim.policyNumber}</strong> — {selectedClaim.claimerName}
            </p>

            {actionError && (
              <div className="alert alert-error" style={{ marginBottom: 16 }}>
                {actionError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">New Status</label>
              <select
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ClaimStatus)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Note (Optional)</label>
              <textarea
                className="form-textarea"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add a note for the claimant..."
                rows={3}
                maxLength={500}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleStatusUpdate}
                disabled={!!updatingId || newStatus === selectedClaim.status}
              >
                {updatingId ? (
                  <>
                    <div className="spinner spinner-sm" />
                    Updating...
                  </>
                ) : (
                  '✅ Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClaimsTable;
