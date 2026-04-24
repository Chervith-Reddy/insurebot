import React, { useEffect, useState, useCallback } from 'react';
import { getAllClaims, getAnalytics, getClaimStats } from '../api/claimApi';
import { AnalyticsData, Claim, ClaimStats, ClaimStatus, ClaimType } from '../types';
import ClaimsTable from './ClaimsTable';
import AnalyticsChart from './AnalyticsChart';

type TabType = 'overview' | 'claims' | 'analytics';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [stats, setStats] = useState<ClaimStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState<ClaimStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<ClaimType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [claimsRes, analyticsRes, statsRes] = await Promise.all([
        getAllClaims({
          status: statusFilter,
          claimType: typeFilter,
          page: currentPage,
          limit: LIMIT,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }),
        getAnalytics(),
        getClaimStats(),
      ]);

      if (claimsRes.success && claimsRes.data) {
        setClaims(claimsRes.data.claims);
        setTotalPages(claimsRes.data.pagination.totalPages);
        setTotal(claimsRes.data.pagination.total);
      }

      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchData();
  };

  const statCards = [
    {
      label: 'Total Claims',
      value: stats?.total ?? 0,
      color: '#3b82f6',
      icon: '📋',
    },
    {
      label: 'Pending',
      value: stats?.pending ?? 0,
      color: '#f59e0b',
      icon: '⏳',
    },
    {
      label: 'Under Review',
      value: stats?.underReview ?? 0,
      color: '#6366f1',
      icon: '🔍',
    },
    {
      label: 'Approved',
      value: stats?.approved ?? 0,
      color: '#10b981',
      icon: '✅',
    },
    {
      label: 'Rejected',
      value: stats?.rejected ?? 0,
      color: '#ef4444',
      icon: '❌',
    },
    {
      label: 'Avg Resolution',
      value: analytics ? `${analytics.averageResolutionTime}h` : '—',
      color: '#8b5cf6',
      icon: '⏱️',
    },
  ];

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'claims', label: 'Claims', icon: '📋' },
    { key: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div>
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          ⚠️ {error}
          <button
            onClick={fetchData}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: '#991b1b',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'white', padding: 6, borderRadius: 10, width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 18px',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              background: activeTab === tab.key ? '#1e3a8a' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className="stat-card"
            style={{ borderLeftColor: card.color }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">{card.label}</span>
              <span style={{ fontSize: 22 }}>{card.icon}</span>
            </div>
            {loading ? (
              <div style={{ height: 32, background: '#f1f5f9', borderRadius: 4, marginTop: 4 }} />
            ) : (
              <span className="stat-value" style={{ color: card.color }}>
                {card.value}
              </span>
            )}
          </div>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="section-header">
            <p className="section-title">Recent Claims</p>
            <button className="btn btn-secondary" onClick={fetchData}>
              🔄 Refresh
            </button>
          </div>
          <div className="card">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div className="spinner" />
                <p style={{ color: '#6b7280', marginTop: 12 }}>Loading claims...</p>
              </div>
            ) : (
              <ClaimsTable claims={claims.slice(0, 5)} onRefresh={fetchData} />
            )}
          </div>
        </div>
      )}

      {activeTab === 'claims' && (
        <div>
          <div className="section-header">
            <p className="section-title">All Claims ({total})</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 160 }}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ClaimStatus | '');
                  handleFilterChange();
                }}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 160 }}
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as ClaimType | '');
                  handleFilterChange();
                }}
              >
                <option value="">All Types</option>
                <option value="accident">Accident</option>
                <option value="health">Health</option>
                <option value="property">Property</option>
                <option value="vehicle">Vehicle</option>
                <option value="unknown">Unknown</option>
              </select>
              <button className="btn btn-secondary" onClick={fetchData}>
                🔄 Refresh
              </button>
            </div>
          </div>

          <div className="card">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div className="spinner" />
                <p style={{ color: '#6b7280', marginTop: 12 }}>Loading claims...</p>
              </div>
            ) : (
              <>
                <ClaimsTable claims={claims} onRefresh={fetchData} />
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 20,
                      paddingTop: 16,
                      borderTop: '1px solid #e2e8f0',
                    }}
                  >
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 14px', fontSize: 13 }}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Prev
                    </button>
                    <span style={{ fontSize: 14, color: '#6b7280' }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 14px', fontSize: 13 }}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <div className="section-header">
            <p className="section-title">Analytics Dashboard</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {analytics && (
                <div
                  style={{
                    background: 'white',
                    borderRadius: 8,
                    padding: '8px 16px',
                    border: '1px solid #e2e8f0',
                    fontSize: 13,
                  }}
                >
                  💰 Total Claims Value:{' '}
                  <strong>${(analytics.totalAmount || 0).toLocaleString()}</strong>
                </div>
              )}
            </div>
          </div>
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div className="spinner" />
              <p style={{ color: '#6b7280', marginTop: 12 }}>Loading analytics...</p>
            </div>
          ) : analytics ? (
            <AnalyticsChart data={analytics} />
          ) : (
            <div className="card empty-state">
              <p>No analytics data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
