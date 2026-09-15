import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, EyeOff, Loader2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const isEmailValid = email.includes('@') && email.includes('.');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Somalia Phone Validation
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^(\+?252)?(0)?(61|62|68|77)\d{7}$/.test(cleanPhone)) {
      toast.error('☎️ Please enter a valid Somalia mobile number (prefixes: 061, 062, 068, 077)');
      return;
    }

    // Address Length Validation
    if (address.trim().length < 8) {
      toast.error('📍 Delivery address is too short. Please include your neighborhood (e.g., Wadajir, Suuqa Weyn)');
      return;
    }

    setSubmitting(true);
    const fullName = `${firstName} ${lastName}`.trim();
    const res = await register(fullName, email, password, phone, address);
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
        backgroundImage: 'url("https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?q=80&w=2000")', 
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
          maxWidth: '960px', 
          minHeight: '600px',
          background: '#ffffff', 
          borderRadius: '24px', 
          boxShadow: '0 35px 85px rgba(0,0,0,0.6)', 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 0.8fr', 
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
              Create Account
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Sign up to discover farm-fresh groceries delivered to your door.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="name-grid form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  First Name
                </label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Amal"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
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
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Last Name
                </label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
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
              </div>
            </div>

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

            {/* Phone Number Field */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Phone Number
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+252 61"
                required
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
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
            </div>

            {/* Full Shipping Address Field */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Delivery Street Address
              </label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Wadajir, Suuqa Weyn, Mogadishu"
                required
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <input 
                type="checkbox" 
                id="terms" 
                required 
                style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }} 
              />
              <label htmlFor="terms" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                I agree to the <Link to="/terms" style={{ color: '#16a34a', fontWeight: 600 }}>Terms</Link> & <Link to="/privacy" style={{ color: '#16a34a', fontWeight: 600 }}>Privacy Policy</Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <div style={{ marginTop: '12px' }}>
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
                {submitting ? <Loader2 className="pulse-anim" size={18} /> : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div style={{ marginTop: '40px', fontSize: '14px', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Right 50% — Beautiful Food Art Image */}
        <div className="auth-image-panel" style={{ position: 'relative', background: '#000000', overflow: 'hidden' }}>
          <img 
            src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?q=80&w=1200" 
            alt="Vibrant Gourmet Produce" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
