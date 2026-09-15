import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, LayoutGrid, Loader2 } from 'lucide-react';
import ScrollReveal from '../components/layout/ScrollReveal';
import { categories as fallbackCategories } from '../data/constants';
import api from '../services/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data?.data?.length > 0) {
          setCategories(data.data.map(c => ({
            name: c.name,
            desc: c.description || 'Premium selection of organic items.',
            img: c.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
            color: c.color || '#1f8044',
            count: 'Explore items'
          })));
        }
      } catch (err) {
        console.error('Failed to load live categories, using fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '100px' }}>
      {/* ─── Hero Header ─── */}
      <section style={{ 
        position: 'relative',
        height: '400px',
        width: '100%',
        marginBottom: '60px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img 
            src="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2000" 
            alt="Categories" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(13, 59, 30, 0.9), rgba(6, 33, 17, 0.6))',
          }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-label" style={{ color: 'var(--accent-gold)' }}>Explore Our Aisles</span>
            <h1 style={{ color: 'white', fontSize: 'clamp(40px, 6vw, 56px)', fontWeight: 800, marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
              Shop by <span style={{ fontStyle: 'italic', color: 'var(--hero-accent)' }}>Category</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', maxWidth: '550px', lineHeight: 1.6 }}>
              Find exactly what you need through our organized collection of premium groceries and fresh produce.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container">
        {/* Toolbar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '48px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-soft)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LayoutGrid size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>All Departments</h2>
            {loading && <Loader2 className="pulse-anim" size={20} color="var(--primary)" />}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{categories.length}</strong> categories available
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid-4" style={{ gap: '30px', paddingBottom: '100px' }}>
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.name} delay={i * 0.1}>
              <Link to={`/products?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div
                  whileHover={{ y: -10 }}
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '30px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-soft)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'box-shadow 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                >
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={cat.img} 
                      alt={cat.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(255,255,255,0.9)',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: cat.color,
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>
                      {cat.count}
                    </div>
                  </div>
                  
                  <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '4px', 
                      background: cat.color, 
                      borderRadius: '2px', 
                      marginBottom: '16px' 
                    }} />
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>{cat.name}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                      {cat.desc}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '14px' }}>
                      Browse Products <ChevronRight size={16} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
