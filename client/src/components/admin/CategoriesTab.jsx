import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const CategoriesTab = ({ categories, onSubmitCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
    color: '#1f8044'
  });

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmitCategory(categoryForm);
    setIsModalOpen(false);
    setCategoryForm({
      name: '',
      description: '',
      image: '',
      color: '#1f8044'
    });
  };

  return (
    <div className="admin-card">
      
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Store Departments ({categories.length})</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Manage product departments and organic catalogs</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '12px 24px', 
            borderRadius: '14px', 
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Grid of Department Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {categories.map((cat, i) => (
          <div 
            key={cat._id || i} 
            className="glass-card"
            style={{ 
              background: 'var(--bg-main)', 
              padding: '24px', 
              borderRadius: '24px', 
              border: '1px solid var(--border-soft)', 
              position: 'relative', 
              overflow: 'hidden',
              transition: 'transform 0.2s',
              cursor: 'default'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Colored top border decoration */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: cat.color || 'var(--primary)' }} />

            <div style={{ width: '100%', height: '160px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', border: '1px solid var(--border-soft)' }}>
              <img 
                src={cat.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600'} 
                alt={cat.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
              {cat.name}
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, marginBottom: 0 }}>
              {cat.description || 'Premium organic department'}
            </p>
          </div>
        ))}
        {categories.length === 0 && (
          <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No departments loaded. Create one to get started!
          </div>
        )}
      </div>

      {/* ─── MODAL: ADD CATEGORY ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="admin-modal-content"
              style={{ maxWidth: '500px', width: '100%' }}
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="admin-modal-close"
              >
                <X size={18} />
              </button>

              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>Add Store Department</h2>

              <form onSubmit={handleLocalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Department Name</label>
                  <input 
                    type="text" 
                    required 
                    value={categoryForm.name} 
                    onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} 
                    className="admin-form-input"
                    placeholder="Exotic Cheeses" 
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea 
                    rows="3" 
                    required 
                    value={categoryForm.description} 
                    onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} 
                    className="admin-form-input"
                    style={{ resize: 'none' }}
                    placeholder="Finest imported organic cheeses from around the globe" 
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Image URL</label>
                  <input 
                    type="url" 
                    required 
                    value={categoryForm.image} 
                    onChange={e => setCategoryForm({...categoryForm, image: e.target.value})} 
                    className="admin-form-input"
                    placeholder="https://images.unsplash.com/photo-..." 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '16px', alignItems: 'center' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Accent Decora Color</label>
                    <input 
                      type="text" 
                      required 
                      value={categoryForm.color} 
                      onChange={e => setCategoryForm({...categoryForm, color: e.target.value})} 
                      className="admin-form-input"
                      placeholder="#1f8044" 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label" style={{ textAlign: 'center' }}>Preview</label>
                    <input 
                      type="color" 
                      value={categoryForm.color} 
                      onChange={e => setCategoryForm({...categoryForm, color: e.target.value})} 
                      style={{ width: '100%', height: '48px', border: 'none', padding: 0, borderRadius: '10px', overflow: 'hidden', background: 'transparent', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: 800, marginTop: '12px', cursor: 'pointer' }}>
                  Create Department
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CategoriesTab;
