import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, EyeOff, Loader2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isEmailValid = email.includes('@') && email.includes('.');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '40px 20px',
      position: 'relative',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Immersive Store Backdrop Blur */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        filter: 'blur(8px) brightness(0.4)',
        transform: 'scale(1.02)',
        zIndex: 0 
      }} />

      {/* Floating 50/50 Split Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="auth-split-card"
        style={{ 
          position: 'relative', 
          zIndex: 10, 
          width: '100%', 
          maxWidth: '920px', 
          minHeight: '580px',
          background: '#ffffff', 
          borderRadius: '24px', 
          boxShadow: '0 35px 85px rgba(0,0,0,0.6)', 
          display: 'grid', 
          gridTemplateColumns: '1.15fr 0.85fr', 
          overflow: 'hidden' 
        }}
      >
        {/* Left 50% — Clean White Form */}
        <div className="auth-form-panel" style={{ padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#ffffff', color: '#1e293b' }}>
          
          {/* Brand Header */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '36px' }}>
            <div style={{ width: '34px', height: '34px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} color="white" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.5px' }}>
              Amal Market
            </span>
          </Link>

          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Sign in with your email address and Password.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe123@xyz.com"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '14px 44px 14px 16px', 
                    borderRadius: '10px', 
                    border: '1px solid #cbd5e1', 
                    background: '#f8fafc',
                    color: '#0f172a',
                    outline: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
                />
                {isEmailValid && (
                  <CheckCircle2 size={18} color="#16a34a" style={{ position: 'absolute', right: '14px' }} />
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '14px 44px 14px 16px', 
                    borderRadius: '10px', 
                    border: '1px solid #cbd5e1', 
                    background: '#f8fafc',
                    color: '#0f172a',
                    outline: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="remember" 
                  defaultChecked 
                  style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }} 
                />
                <label htmlFor="remember" style={{ fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#16a34a'} onMouseLeave={e => e.target.style.color='#94a3b8'}>
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <div style={{ marginTop: '16px' }}>
              <button 
                disabled={submitting} 
                style={{ 
                  background: '#16a34a', 
                  color: 'white', 
                  padding: '14px 42px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  fontWeight: 700, 
                  fontSize: '15px', 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                  transition: 'all 0.2s',
                  opacity: submitting ? 0.7 : 1
                }}
                onMouseEnter={e => { e.target.style.background = '#15803d'; e.target.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.target.style.background = '#16a34a'; e.target.style.transform = 'translateY(0)'; }}
              >
                {submitting ? <Loader2 className="pulse-anim" size={18} /> : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div style={{ marginTop: '40px', fontSize: '14px', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right 50% — Beautiful Food Art Image (Exactly like Urbee design) */}
        <div className="auth-image-panel" style={{ position: 'relative', background: '#000000', overflow: 'hidden' }}>
          <img 
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200" 
            alt="Vibrant Gourmet Food" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
