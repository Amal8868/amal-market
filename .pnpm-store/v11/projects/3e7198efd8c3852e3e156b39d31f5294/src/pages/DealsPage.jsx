import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Clock, Zap, Percent, ArrowRight, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cart';
import ScrollReveal from '../components/layout/ScrollReveal';
import api from '../services/api';

const fallbackDeals = [
  { id: 101, name: 'Premium Organic Strawberries', oldPrice: 8.50, price: 4.90, discount: '42%', img: 'https://images.unsplash.com/photo-1464960139141-862f40ca88a3?q=80&w=800', cat: 'Fresh Fruits', rating: 4.9, time: '12:45:10' },
  { id: 102, name: 'Hass Avocados (Pack of 3)', oldPrice: 12.00, price: 7.50, discount: '37%', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800', cat: 'Fresh Fruits', rating: 4.8, time: '08:20:15' },
  { id: 103, name: 'Artisanal Sourdough Bundle', oldPrice: 15.00, price: 9.90, discount: '34%', img: 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08?q=80&w=800', cat: 'Bakery', rating: 5.0, time: '15:10:00' },
  { id: 104, name: 'Wild Caught Salmon Fillet', oldPrice: 28.00, price: 19.90, discount: '29%', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800', cat: 'Meat & Seafood', rating: 4.9, time: '05:30:45' },
  { id: 105, name: 'Organic Heirloom Tomatoes', oldPrice: 6.50, price: 3.80, discount: '41%', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800', cat: 'Vegetables', rating: 4.7, time: '11:00:00' },
  { id: 106, name: 'Cold Pressed Green Juice', oldPrice: 7.50, price: 4.50, discount: '40%', img: 'https://images.unsplash.com/photo-1622597467825-f30a587ba053?q=80&w=800', cat: 'Beverages', rating: 4.8, time: '20:00:00' },
];

const DealsPage = () => {
  const { addToCart } = useCart();
  const [deals, setDeals] = useState(fallbackDeals);
  const [loading, setLoading] = useState(true);

  // Live realistic countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 10
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await api.get('/products/deals');
        if (data?.data?.length > 0) {
          setDeals(data.data.map(p => {
            return {
              id: p._id,
              name: p.name,
              oldPrice: p.price,
              price: p.discountedPrice,
              discount: `${p.discountPercentage}%`,
              img: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1464960139141-862f40ca88a3?q=80&w=800',
              cat: p.categoryName || 'Organic',
              rating: p.rating ?? 0,
              reviews: p.numReviews ?? 0,
              time: '12:45:10'
            };
          }));
        } else {
          setDeals([]);
        }
      } catch (err) {
        console.error('Failed to load deals from API, using fallback:', err);
      } finally {
        setTimeLeft({ hours: 12, minutes: 45, seconds: 10 }); // Keep live timer fresh
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '100px' }}>
      {/* ─── Hero Banner ─── */}
      <section style={{ padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%)',
              borderRadius: '40px',
              padding: '80px 60px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 20px 40px rgba(13, 59, 30, 0.2)'
            }}
          >
            {/* Background pattern */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
              Harvest <span style={{ fontStyle: 'italic', color: 'var(--hero-accent)' }}>Savings.</span>
            </h1>
            <p style={{ fontSize: '20px', opacity: 0.8, maxWidth: '600px', marginBottom: '48px', lineHeight: 1.6 }}>
              Up to 50% off on peak-season organic produce and premium artisanal goods. Refreshed every 24 hours.
            </p>

            {/* Live realistic countdown container */}
            <div style={{ 
              display: 'flex', 
              gap: '24px', 
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '24px 48px',
              borderRadius: '28px',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <div style={{ minWidth: '80px', textAlign: 'center' }}>
                <div style={{ fontSize: '38px', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-gold)' }}>
                  {formatNumber(timeLeft.hours)}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>Hours</div>
              </div>
              <div style={{ fontSize: '28px', opacity: 0.4, fontWeight: 700, paddingBottom: '16px' }}>:</div>
              <div style={{ minWidth: '80px', textAlign: 'center' }}>
                <div style={{ fontSize: '38px', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-gold)' }}>
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>Mins</div>
              </div>
              <div style={{ fontSize: '28px', opacity: 0.4, fontWeight: 700, paddingBottom: '16px' }}>:</div>
              <div style={{ minWidth: '80px', textAlign: 'center' }}>
                <div style={{ fontSize: '38px', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-gold)' }}>
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>Secs</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Deals Grid ─── */}
      <section style={{ padding: '60px 0 120px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800 }}>Daily Flash Deals</h2>
              {loading && <Loader2 className="pulse-anim" size={24} color="var(--primary)" />}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px' }}>
                <Filter size={16} /> All Departments
              </button>
            </div>
          </div>

          <div className="grid-3" style={{ gap: '30px' }}>
            {deals.map((deal, i) => (
              <ScrollReveal key={deal.id} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-soft)',
                    boxShadow: 'var(--shadow-md)',
                    position: 'relative'
                  }}
                >
                  {/* Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 2,
                    background: 'var(--secondary)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(247, 127, 0, 0.3)'
                  }}>
                    {deal.discount} OFF
                  </div>

                  {/* Image */}
                  <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={deal.img} 
                      alt={deal.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '20px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontSize: '12px', fontWeight: 600 }}>
                        <Clock size={14} color="var(--accent-gold)" /> Ends in: {deal.time}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {deal.cat}
                    </span>
                    <h3 style={{ fontSize: '19px', fontWeight: 700, margin: '8px 0 12px 0', minHeight: '48px' }}>{deal.name}</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                      <Star size={16} fill={deal.rating > 0 ? "var(--accent-gold)" : "none"} color={deal.rating > 0 ? "var(--accent-gold)" : "var(--text-muted)"} />
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>{deal.rating > 0 ? deal.rating.toFixed(1) : 'No rating'}</span>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>({deal.reviews} review{deal.reviews !== 1 ? 's' : ''})</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>${deal.price.toFixed(2)}</span>
                        <span style={{ fontSize: '15px', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '10px' }}>
                          ${deal.oldPrice.toFixed(2)}
                        </span>
                      </div>
                      <button 
                        onClick={() => addToCart(deal)}
                        className="btn-primary" 
                        style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '16px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          padding: 0
                        }}
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section style={{ padding: '0 0 120px 0' }}>
        <div className="container">
          <div style={{ 
            background: 'var(--bg-surface)', 
            borderRadius: '40px', 
            padding: '60px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ maxWidth: '500px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Don't miss a single deal</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                Subscribe to our flash alerts and get notified 30 minutes before new daily deals go live.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '400px', marginLeft: '40px' }}>
              <input 
                type="email" 
                placeholder="Your email address..." 
                style={{ flex: 1, background: 'var(--bg-main)', border: '1px solid var(--border-soft)', padding: '16px 24px', borderRadius: '16px', outline: 'none' }} 
              />
              <button className="btn-primary" style={{ padding: '0 30px' }}>Join Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DealsPage;
