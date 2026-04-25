import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClaimForm from '../components/ClaimForm';
import { Claim, AIClassificationResult } from '../types';

const SubmitClaimPage: React.FC = () => {
  const [submittedClaim, setSubmittedClaim] = useState<Claim | null>(null);
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);

  const handleSuccess = (claim: Claim, ai: AIClassificationResult) => {
    setSubmittedClaim(claim);
    setAiResult(ai);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  if (submittedClaim) {
    return (
      <div className="page-container" style={{ maxWidth: 680 }}>
        <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#065f46', marginBottom: 8 }}>
            Claim Submitted Successfully!
          </h1>
          <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 15 }}>
            Your insurance claim has been received and is being processed.
          </p>

          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: 10,
              padding: '20px 24px',
              textAlign: 'left',
              marginBottom: 20,
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 14, color: '#166534', marginBottom: 12 }}>
              📋 Claim Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {[
                { label: 'Policy Number', value: submittedClaim.policyNumber },
                { label: 'Status', value: submittedClaim.status },
                { label: 'Incident Type', value: submittedClaim.incidentType },
                { label: 'Amount', value: `$${submittedClaim.amount.toLocaleString()}` },
                { label: 'Claimant', value: submittedClaim.claimerName },
                { label: 'Email', value: submittedClaim.claimerEmail },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {aiResult && (
            <div
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 10,
                padding: '20px 24px',
                textAlign: 'left',
                marginBottom: 20,
              }}
            >
              <p style={{ fontWeight: 700, fontSize: 14, color: '#1e40af', marginBottom: 12 }}>
                🤖 AI Classification Result
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Claim Type
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: '#1e3a8a',
                      textTransform: 'capitalize',
                    }}
                  >
                    {aiResult.claimType}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Confidence
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: '#e2e8f0',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${aiResult.confidence * 100}%`,
                          height: '100%',
                          background: getConfidenceColor(aiResult.confidence),
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: getConfidenceColor(aiResult.confidence),
                      }}
                    >
                      {(aiResult.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                  AI Reasoning
                </p>
                <p style={{ fontSize: 13, color: '#374151', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{aiResult.reasoning}"
                </p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={`/track-claim?policy=${submittedClaim.policyNumber}`}
              className="btn btn-primary"
            >
              🔍 Track This Claim
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSubmittedClaim(null);
                setAiResult(null);
              }}
            >
              ➕ Submit Another Claim
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 680 }}>
      <h1 className="page-title">Submit a Claim</h1>
      <p className="page-subtitle">
        Fill out the form below. Our AI will automatically classify your claim and expedite processing.
      </p>

      <div
        className="alert alert-info"
        style={{ marginBottom: 24 }}
      >
        <span>🤖</span>
        <span>
          Our AI will analyze your claim description and automatically classify it for faster review.
        </span>
      </div>

      <div className="card">
        <ClaimForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default SubmitClaimPage;
