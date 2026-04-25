import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getClaimsByPolicyNumber } from '../api/claimApi';
import { Claim } from '../types';
import ClaimStatusCard from '../components/ClaimStatus';

const TrackClaimPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [policyNumber, setPolicyNumber] = useState(searchParams.get('policy') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('policy') || '');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const policyFromUrl = searchParams.get('policy');
    if (policyFromUrl) {
      setInputValue(policyFromUrl);
      setPolicyNumber(policyFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (policyNumber) {
      handleSearch(policyNumber);
    }
  }, [policyNumber]);

  const handleSearch = async (policy: string) => {
    if (!policy.trim()) {
      setError('Please enter a policy number');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await getClaimsByPolicyNumber(policy.trim());
      if (response.success && response.data) {
        setClaims(response.data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to find claims';
      setError(message);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Track Your Claim</h1>
      <p className="page-subtitle">
        Enter your policy number to view all associated claims and their current status.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="form-label" htmlFor="policySearch">
                Policy Number
              </label>
              <input
                id="policySearch"
                type="text"
                className="form-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                placeholder="e.g. POL-123456"
                maxLength={20}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !inputValue.trim()}
              style={{ padding: '10px 24px', height: 42 }}
            >
              {loading ? (
                <>
                  <div className="spinner spinner-sm" />
                  Searching...
                </>
              ) : (
                <>🔍 Search</>
              )}
            </button>
          </div>
          {error && (
            <div className="alert alert-error" style={{ marginTop: 12 }}>
              ⚠️ {error}
            </div>
          )}
        </form>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div className="spinner" />
          <p style={{ color: '#6b7280', marginTop: 16 }}>
            Searching for claims with policy number <strong>{inputValue}</strong>...
          </p>
        </div>
      )}

      {!loading && searched && claims.length === 0 && !error && (
        <div className="card empty-state">
          <div className="empty-state-icon">🔎</div>
          <p className="empty-state-text">No claims found</p>
          <p className="empty-state-sub">
            No claims were found for policy number <strong>{inputValue}</strong>.
            Please check the number and try again.
          </p>
        </div>
      )}

      {!loading && claims.length > 0 && (
        <div>
          <div className="section-header" style={{ marginBottom: 16 }}>
            <p className="section-title">
              {claims.length} Claim{claims.length !== 1 ? 's' : ''} Found
            </p>
            <span
              style={{
                background: '#eff6ff',
                color: '#1e40af',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Policy: {inputValue}
            </span>
          </div>
          {claims.map((claim) => (
            <ClaimStatusCard key={claim._id} claim={claim} />
          ))}
        </div>
      )}

      {!searched && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginTop: 8,
          }}
        >
          {[
            { icon: '📋', title: 'Enter Policy Number', desc: 'Use the policy number from your insurance documents.' },
            { icon: '🔍', title: 'View All Claims', desc: 'See all claims associated with your policy.' },
            { icon: '📊', title: 'Track Progress', desc: 'Follow your claim through each stage of review.' },
          ].map((tip) => (
            <div key={tip.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{tip.icon}</div>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{tip.title}</p>
              <p style={{ color: '#6b7280', fontSize: 13 }}>{tip.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackClaimPage;
