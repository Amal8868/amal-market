import React from 'react';
import { Sprout, ShieldCheck, Truck, ArrowRight, Award, Sun, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/layout/ScrollReveal';

const milestones = [
  {
    step: '01',
    title: 'Pristine Soil & Heirloom Seeds',
    desc: 'We collaborate with organic agronomists to cultivate nutrient-dense heirloom seed varieties in mineral-rich, pesticide-free regional soil.'
  },
  {
    step: '02',
    title: 'Daily Dawn Harvests',
    desc: 'Every morning at 5:00 AM, our partner farmers handpick fruits and greens at peak ripeness to ensure maximum natural flavor and vitamins.'
  },
  {
    step: '03',
    title: 'Direct Electric Cold-Chain',
    desc: 'By eliminating wholesale storage facilities, we transport orders directly to your door in refrigerated electric vans within hours of harvest.'
  }
];

const standards = [
  { icon: Sprout, title: '100% Certified Organic', text: 'Non-GMO, synthetic-free foods guaranteed.' },
  { icon: Award, title: 'Fair Trade Sourcing', text: 'Direct partnerships empowering local family farms.' },
  { icon: ShieldCheck, title: 'Curator Inspected', text: 'Boutique quality control on every single loaf and apple.' },
  { icon: Truck, title: 'Carbon Neutral Fleet', text: 'Eco-friendly refrigerated doorstep delivery.' }
];

const AboutPage = () => {
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px' }}>
      
      {/* ─── Premium Split Hero ─── */}
      <section style={{ marginBottom: '100px' }}>
        <div className="container">
          <div className="about-hero-card" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.1fr 0.9fr', 
            gap: '64px', 
            alignItems: 'center',
            background: 'var(--bg-surface)',
            padding: '64px',
            borderRadius: '40px',
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div>


              <h1 style={{ fontSize: 'clamp(38px, 5vw, 56px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '28px', fontFamily: "'Playfair Display', serif", lineHeight: 1.15 }}>
                Rooted in Nature.<br />
                <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Crafted for Your Kitchen.</span>
              </h1>

              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
                Amal Market was born from a simple realization: modern grocery chains prioritize long shelf-life over real flavor and nutrition. Produce often spends weeks in wholesale transit before ever reaching the grocery aisle.
              </p>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '36px' }}>
                We reimagined the grocery experience. By partnering directly with over 40 family-owned regional organic farms, we shorten the food chain. When you order from Amal Market, you are receiving produce harvested at dawn and delivered with absolute care.
              </p>

              <div className="about-stats">
                <div style={{ padding: '16px 24px', borderRadius: '20px', background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', fontFamily: "'Playfair Display', serif" }}>40+</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>Regional Farms</div>
                </div>
                <div style={{ padding: '16px 24px', borderRadius: '20px', background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', fontFamily: "'Playfair Display', serif" }}>100%</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>Organic Certified</div>
                </div>
                <div style={{ padding: '16px 24px', borderRadius: '20px', background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', fontFamily: "'Playfair Display', serif" }}>24h</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>Farm to Door</div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
            <div className="about-hero-media" style={{ height: '520px', borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-2xl)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000" 
                  alt="Organic harvest produce" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Journey (The 3-Step Process) ─── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-section-alt)', marginBottom: '100px' }}>
        <div className="container">
          <div style={{ marginBottom: '64px', maxWidth: '700px' }}>
            <span className="section-label" style={{ marginBottom: '12px', display: 'inline-block' }}>How We Operate</span>
            <h2 style={{ fontSize: '36px', fontWeight: 800, fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', margin: 0 }}>
              The Journey to Your Kitchen
            </h2>
          </div>

          <div className="grid-3" style={{ gap: '32px' }}>
            {milestones.map((m, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div style={{ background: 'var(--bg-surface)', padding: '48px 36px', borderRadius: '32px', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden', height: '100%' }}>
                  <div style={{ fontSize: '64px', fontWeight: 800, fontFamily: "'Playfair Display', serif", color: 'rgba(31,128,68,0.15)', position: 'absolute', top: '24px', right: '32px', lineHeight: 1 }}>
                    {m.step}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)', marginTop: '20px', position: 'relative', zIndex: 1 }}>{m.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7, margin: 0, position: 'relative', zIndex: 1 }}>{m.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Standards Banner ─── */}
      <section style={{ marginBottom: '100px' }}>
        <div className="container">
          <div style={{ marginBottom: '48px' }}>
            <span className="section-label" style={{ marginBottom: '12px', display: 'inline-block' }}>Boutique Standards</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', margin: 0 }}>
              Uncompromising Quality
            </h2>
          </div>
          
          <div className="grid-4" style={{ gap: '24px' }}>
            {standards.map((st, i) => (
              <div key={i} style={{ background: 'var(--bg-surface)', padding: '32px 24px', borderRadius: '24px', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(31,128,68,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <st.icon size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>{st.title}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{st.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Premium Split CTA ─── */}
      <section>
        <div className="container">
          <div className="about-cta" style={{
            background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-700) 100%)',
            color: 'white',
            padding: '64px 80px',
            borderRadius: '36px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 24px 48px rgba(13, 59, 30, 0.25)'
          }}>
            <div style={{ maxWidth: '560px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', fontFamily: "'Playfair Display', serif", margin: 0 }}>
                Taste the Organic Difference
              </h2>
              <p style={{ fontSize: '18px', opacity: 0.9, margin: '16px 0 0 0', lineHeight: 1.6 }}>
                Explore our morning harvest catalog or discover daily flash deals delivered straight to your door.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn-primary" style={{ background: 'white', color: 'var(--primary)', padding: '18px 36px', borderRadius: '20px', fontWeight: 800, fontSize: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                Explore Catalog <ArrowRight size={20} />
              </Link>
              <Link to="/deals" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', padding: '18px 36px', borderRadius: '20px', fontWeight: 800, fontSize: '16px', textDecoration: 'none' }}>
                View Daily Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
