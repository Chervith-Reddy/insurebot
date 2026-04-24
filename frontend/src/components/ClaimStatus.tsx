import React from 'react';
import { Claim, ClaimStatus as ClaimStatusType } from '../types';

interface ClaimStatusProps {
  claim: Claim;
}

const STATUS_STEPS: ClaimStatusType[] = ['Pending', 'Under Review', 'Approved'];

const getStatusIndex = (status: ClaimStatusType): number => {
  if (status === 'Rejected') return -1;
  return STATUS_STEPS.indexOf(status);
};

const getStatusBadgeClass = (status: ClaimStatusType): string => {
  const map: Record<ClaimStatusType, string> = {
    Pending: 'badge-pending',
    'Under Review': 'badge-review',
    Approved: 'badge-approved',
    Rejected: 'badge-rejected',
  };
  return `badge ${map[status]}`;
};

const getClaimTypeBadgeClass = (type: string): string => {
  const map: Record<string, string> = {
    accident: 'badge-accident',
    health: 'badge-health',
    property: 'badge-property',
    vehicle: 'badge-vehicle',
    unknown: 'badge-unknown',
  };
  return `badge ${map[type] || 'badge-unknown'}`;
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ClaimStatusCard: React.FC<ClaimStatusProps> = ({ claim }) => {
  const currentIndex = getStatusIndex(claim.status);
  const isRejected = claim.status === 'Rejected';

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            Policy: {claim.policyNumber}
          </h3>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            Submitted: {formatDate(claim.createdAt)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className={getClaimTypeBadgeClass(claim.claimType)} style={{ textTransform: 'capitalize' }}>
            {claim.claimType}
          </span>
          <span className={getStatusBadgeClass(claim.status)}>{claim.status}</span>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        {isRejected ? (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>❌</span>
            <div>
              <p style={{ fontWeight: 700, color: '#991b1b', marginBottom: 2 }}>Claim Rejected</p>
              <p style={{ color: '#b91c1c', fontSize: 14 }}>
                Your claim has been reviewed and unfortunately rejected. Please contact support.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', padding: '20px 0' }}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 24,
                right: 24,
                height: 4,
                background: '#e2e8f0',
                transform: 'translateY(-50%)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 24,
                width: currentIndex >= 0 ? `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` : '0%',
                height: 4,
                background: 'linear-gradient(to right, #3b82f6, #10b981)',
                transform: 'translateY(-50%)',
                zIndex: 1,
                transition: 'width 0.5s ease',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
                padding: '0 0',
              }}
            >
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = currentIndex >= index;
                const isCurrent = currentIndex === index;

                return (
                  <div
                    key={step}
                    style={{ textAlign: 'center', flex: 1 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: isCompleted ? (isCurrent ? '#3b82f6' : '#10b981') : '#e2e8f0',
                        border: `3px solid ${isCompleted ? (isCurrent ? '#3b82f6' : '#10b981') : '#d1d5db'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px',
                        color: isCompleted ? 'white' : '#9ca3af',
                        fontWeight: 700,
                        fontSize: 14,
                        boxShadow: isCurrent ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none',
                      }}
                    >
                      {isCompleted && !isCurrent ? '✓' : index + 1}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCompleted ? '#111827' : '#9ca3af',
                      }}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 20,
          padding: '16px',
          background: '#f8fafc',
          borderRadius: 8,
        }}
      >
        <div>
          <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Incident Type
          </p>
          <p style={{ fontSize: 14, fontWeight: 600 }}>{claim.incidentType}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Claim Amount
          </p>
          <p style={{ fontSize: 14, fontWeight: 600 }}>${claim.amount.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Claimer
          </p>
          <p style={{ fontSize: 14, fontWeight: 600 }}>{claim.claimerName}</p>
        </div>
        {claim.resolvedAt && (
          <div>
            <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              Resolved At
            </p>
            <p style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(claim.resolvedAt)}</p>
          </div>
        )}
      </div>

      <div>
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#374151' }}>
          📋 Status History
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {claim.statusHistory
            .slice()
            .reverse()
            .map((entry, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '10px 14px',
                  background: index === 0 ? '#eff6ff' : '#f8fafc',
                  borderRadius: 8,
                  borderLeft: `3px solid ${index === 0 ? '#3b82f6' : '#d1d5db'}`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <span
                      className={getStatusBadgeClass(entry.status)}
                      style={{ fontSize: 11 }}
                    >
                      {entry.status}
                    </span>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                      {formatDate(entry.changedAt)}
                    </span>
                  </div>
                  {entry.note && (
                    <p style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>{entry.note}</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimStatusCard;
