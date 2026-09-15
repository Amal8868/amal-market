import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Home } from 'lucide-react';
import UserLayout from '../components/layout/UserLayout';

const NotFoundPage = () => {
  return (
    <UserLayout>
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px'
      }}>
        <div style={{
          fontSize: '120px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--primary), #4dabf7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '16px'
        }}>
          404
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '460px', marginBottom: '32px', lineHeight: 1.6 }}>
          Oops! The page you are looking for doesn't exist, was moved, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn-primary" style={{ padding: '14px 28px', textDecoration: 'none', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/products" className="btn-outline" style={{ padding: '14px 28px', textDecoration: 'none', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} /> Browse Products
          </Link>
        </div>
      </div>
    </UserLayout>
  );
};

export default NotFoundPage;
