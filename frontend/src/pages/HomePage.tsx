import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Classification',
    description:
      'Our LLM-based AI automatically classifies your claim type for faster processing.',
  },
  {
    icon: '⚡',
    title: 'Real-time Status Tracking',
    description:
      'Track your claim status from Pending to Approved with a live progress tracker.',
  },
  {
    icon: '📧',
    title: 'Email Notifications',
    description:
      'Receive instant email updates whenever your claim status changes.',
  },
  {
    icon: '🔒',
    title: 'Secure & Reliable',
    description:
      'Your claim data is securely stored with enterprise-grade reliability.',
  },
];

const claimTypes = [
  { icon: '🚗', label: 'Accident', color: '#fde8d8', border: '#f97316' },
  { icon: '🏥', label: 'Health', color: '#d1fae5', border: '#10b981' },
  { icon: '🏠', label: 'Property', color: '#e0e7ff', border: '#8b5cf6' },
  { icon: '🚙', label: 'Vehicle', color: '#fef9c3', border: '#f59e0b' },
];

const HomePage: React.FC = () => {
  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛡️</div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              marginBottom: 16,
              letterSpacing: '-1px',
              lineHeight: 1.2,
            }}
          >
            InsureBot
          </h1>
          <p
            style={{
              fontSize: 20,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            AI-Powered Insurance Claims Assistant
          </p>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: 40,
              lineHeight: 1.7,
            }}
          >
            Submit, track, and manage insurance claims with the power of artificial intelligence.
            Get instant AI classification, real-time status updates, and email notifications.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/submit-claim"
              className="btn"
              style={{
                background: 'white',
                color: '#1e3a8a',
                fontSize: 16,
                padding: '14px 32px',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}
            >
              🚀 Submit a Claim
            </Link>
            <Link
              to="/track-claim"
              className="btn"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.4)',
                fontSize: 16,
                padding: '14px 32px',
                fontWeight: 700,
              }}
            >
              🔍 Track My Claim
            </Link>
          </div>
        </div>
      </div>

      <div style={{ background: '#f8fafc', padding: '48px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: '#1e3a8a',
              marginBottom: 8,
            }}
          >
            Coverage Types We Handle
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: 36,
              fontSize: 15,
            }}
          >
            Our AI automatically classifies your claim into the right category
          </p>
          <div className="grid-4">
            {claimTypes.map((type) => (
              <div
                key={type.label}
                style={{
                  background: type.color,
                  border: `2px solid ${type.border}`,
                  borderRadius: 12,
                  padding: '24px 16px',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 10 }}>{type.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#1f2937' }}>{type.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '64px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: '#1e3a8a',
              marginBottom: 8,
            }}
          >
            Why InsureBot?
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: 40,
              fontSize: 15,
            }}
          >
            Everything you need for a seamless claims experience
          </p>
          <div className="grid-2" style={{ gap: 24 }}>
            {features.map((feature) => (
              <div key={feature.title} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    fontSize: 32,
                    background: '#eff6ff',
                    borderRadius: 10,
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: '#1e3a8a' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#1e3a8a',
          padding: '60px 20px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Ready to file your claim?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 28, fontSize: 15 }}>
          It takes less than 2 minutes. Our AI handles the rest.
        </p>
        <Link
          to="/submit-claim"
          className="btn"
          style={{
            background: '#3b82f6',
            color: 'white',
            fontSize: 16,
            padding: '14px 36px',
            fontWeight: 700,
          }}
        >
          Get Started →
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
