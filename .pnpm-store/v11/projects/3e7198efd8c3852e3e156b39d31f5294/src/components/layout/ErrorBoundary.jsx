import React, { Component } from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: 'var(--bg-main)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            padding: '48px',
            borderRadius: '32px',
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center',
            maxWidth: '520px',
            width: '100%'
          }}>
            <AlertCircle size={64} color="#ff4d4d" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>Something went wrong</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              We encountered an unexpected frontend error. Please try refreshing the page or contact support if the issue persists.
            </p>
            <div style={{
              background: 'var(--bg-main)',
              padding: '16px',
              borderRadius: '16px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#ff4d4d',
              textAlign: 'left',
              overflowX: 'auto',
              marginBottom: '32px',
              border: '1px solid var(--border-soft)'
            }}>
              {this.state.error && this.state.error.toString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
