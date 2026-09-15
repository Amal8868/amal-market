import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, X, Tag, Calendar, DollarSign, Percent } from 'lucide-react';

const createDefaultForm = () => ({
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderAmount: '0',
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  usageLimit: '',
  isActive: true
});

const CouponsTab = ({ coupons, onCreateCoupon, onDeleteCoupon }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(createDefaultForm);

  const filtered = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = () => {
    setForm(createDefaultForm());
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateCoupon({
      ...form,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount || 0),
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null
    });
    setIsModalOpen(false);
  };

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Promo Coupon Management</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            Create and control checkout discount promo codes.
          </p>
        </div>
        <button 
          onClick={openModal} 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px' }}
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '360px' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search promo codes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-soft)', textAlign: 'left' }}>
              <th style={{ padding: '14px' }}>Code</th>
              <th style={{ padding: '14px' }}>Discount</th>
              <th style={{ padding: '14px' }}>Min Order</th>
              <th style={{ padding: '14px' }}>Expires</th>
              <th style={{ padding: '14px' }}>Used</th>
              <th style={{ padding: '14px' }}>Status</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No promo coupons found. Click "Create Coupon" to add one.
                </td>
              </tr>
            ) : (
              filtered.map(coupon => (
                <tr key={coupon._id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td style={{ padding: '14px', fontWeight: 800 }}>
                    <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', letterSpacing: '1px' }}>
                      🏷️ {coupon.code}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700 }}>
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}
                  </td>
                  <td style={{ padding: '14px' }}>${coupon.minOrderAmount || 0}</td>
                  <td style={{ padding: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px', fontSize: '13px' }}>
                    {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'times'}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: coupon.isActive ? 'rgba(31, 128, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: coupon.isActive ? 'var(--primary)' : '#ef4444'
                    }}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button 
                      onClick={() => onDeleteCoupon(coupon._id)} 
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'var(--bg-surface)', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '480px', border: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Create New Promo Code</h4>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Coupon Code</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. SUMMER20" 
                    value={form.code}
                    onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Type</label>
                    <select 
                      value={form.discountType}
                      onChange={e => setForm({...form, discountType: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed ($)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Value</label>
                    <input 
                      type="number" 
                      required 
                      min="1"
                      placeholder={form.discountType === 'percentage' ? '20' : '5'}
                      value={form.discountValue}
                      onChange={e => setForm({...form, discountValue: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Min Order ($)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={form.minOrderAmount}
                      onChange={e => setForm({...form, minOrderAmount: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Expiry Date</label>
                    <input 
                      type="date" 
                      required 
                      value={form.expiryDate}
                      onChange={e => setForm({...form, expiryDate: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Usage Limit (Optional)</label>
                  <input 
                    type="number" 
                    placeholder="Leave blank for unlimited" 
                    value={form.usageLimit}
                    onChange={e => setForm({...form, usageLimit: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '14px', borderRadius: '14px', marginTop: '8px', fontWeight: 800 }}>
                  Save Promo Code
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponsTab;
