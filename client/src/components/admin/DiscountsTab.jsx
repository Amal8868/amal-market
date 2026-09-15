import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

const DiscountsTab = ({ discounts, products, onSubmitDiscount, onDeleteDiscount }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Local Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [discountForm, setDiscountForm] = useState({
    product: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  // Filtered Discounts based on search query (product name or discount type)
  const filteredDiscounts = discounts.filter(d => {
    const productName = d.product?.name || '';
    return productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const openAddModal = () => {
    setEditingDiscount(null);
    setDiscountForm({
      product: products?.[0]?._id || '',
      type: 'percentage',
      value: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (d) => {
    setEditingDiscount(d);
    setDiscountForm({
      product: d.product?._id || '',
      type: d.type,
      value: d.value,
      startDate: d.startDate ? new Date(d.startDate).toISOString().split('T')[0] : '',
      endDate: d.endDate ? new Date(d.endDate).toISOString().split('T')[0] : '',
      isActive: d.isActive
    });
    setIsModalOpen(true);
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmitDiscount(editingDiscount, discountForm);
    setIsModalOpen(false);
  };

  return (
    <div className="admin-card">
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Discount Schemes ({filteredDiscounts.length})</h3>
          
          {/* Search Box */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by product name..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 16px 12px 44px', 
                borderRadius: '12px', 
                border: '1px solid var(--border-soft)', 
                background: 'var(--bg-main)', 
                fontSize: '14px', 
                color: 'var(--text-primary)',
                outline: 'none' 
              }}
            />
          </div>
        </div>

        {/* Add Discount Button */}
        <button 
          onClick={openAddModal}
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
          <Plus size={18} /> Add New Discount
        </button>
      </div>

      {/* Discounts Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Original Price</th>
              <th>Discount Type / Value</th>
              <th>Calculated Sale Price</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.map(d => {
              const originalPrice = d.product?.price || 0;
              let finalPrice = originalPrice;
              if (d.type === 'percentage') {
                finalPrice = originalPrice * (1 - d.value / 100);
              } else {
                finalPrice = Math.max(0, originalPrice - d.value);
              }

              // Check if discount is currently active based on dates
              const now = new Date();
              const isDateActive = now >= new Date(d.startDate) && now <= new Date(d.endDate);
              const isFullyActive = d.isActive && isDateActive;

              return (
                <tr key={d._id}>
                  {/* Image */}
                  <td>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                      <img src={d.product?.image} alt={d.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>

                  {/* Product Name */}
                  <td style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                    {d.product?.name || 'Unknown Product'}
                  </td>

                  {/* Original Price */}
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                    ${originalPrice.toFixed(2)}
                  </td>

                  {/* Type / Value */}
                  <td style={{ fontWeight: 700 }}>
                    {d.type === 'percentage' ? `${d.value}% OFF` : `$${d.value.toFixed(2)} OFF`}
                  </td>

                  {/* Calculated Sale Price */}
                  <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '15px' }}>
                    ${finalPrice.toFixed(2)}
                  </td>

                  {/* Dates */}
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {new Date(d.startDate).toLocaleDateString()}
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {new Date(d.endDate).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td>
                    {isFullyActive ? (
                      <span style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, background: 'rgba(31,128,68,0.1)', color: 'var(--primary)' }}>
                        🟢 Active
                      </span>
                    ) : !d.isActive ? (
                      <span style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, background: '#cbd5e1', color: '#64748b' }}>
                        ⚪ Disabled
                      </span>
                    ) : !isDateActive && now < new Date(d.startDate) ? (
                      <span style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, background: '#fef3c7', color: '#d97706' }}>
                        🟡 Upcoming
                      </span>
                    ) : (
                      <span style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, background: '#fee2e2', color: '#ef4444' }}>
                        🔴 Expired
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => onSubmitDiscount(d, { ...d, isActive: !d.isActive })}
                        style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: d.isActive ? 'var(--primary)' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        title={d.isActive ? "Deactivate Discount" : "Activate Discount"}
                      >
                        {d.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <button 
                        onClick={() => openEditModal(d)}
                        style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => onDeleteDiscount(d._id)}
                        style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(255,77,77,0.3)', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredDiscounts.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No active or upcoming discount schemes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── MODAL: ADD / EDIT DISCOUNT ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="admin-modal-content"
              style={{ maxWidth: '550px', width: '100%' }}
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="admin-modal-close"
              >
                <X size={18} />
              </button>

              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>
                {editingDiscount ? 'Edit Product Discount' : 'Schedule New Discount'}
              </h2>

              <form onSubmit={handleLocalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Product Select (Only editable on create) */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Select Target Product</label>
                  <select 
                    value={discountForm.product} 
                    onChange={e => setDiscountForm({...discountForm, product: e.target.value})} 
                    className="admin-form-input"
                    disabled={!!editingDiscount}
                    style={{ cursor: editingDiscount ? 'not-allowed' : 'pointer' }}
                  >
                    <option value="" disabled>Choose a product...</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name} (${p.price.toFixed(2)})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Discount Type */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Discount Type</label>
                    <select 
                      value={discountForm.type} 
                      onChange={e => setDiscountForm({...discountForm, type: e.target.value})} 
                      className="admin-form-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  {/* Discount Value */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      {discountForm.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      required 
                      value={discountForm.value} 
                      onChange={e => setDiscountForm({...discountForm, value: e.target.value})} 
                      className="admin-form-input"
                      placeholder={discountForm.type === 'percentage' ? '20' : '5.00'} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Start Date */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Start Date</label>
                    <input 
                      type="date" 
                      required 
                      value={discountForm.startDate} 
                      onChange={e => setDiscountForm({...discountForm, startDate: e.target.value})} 
                      className="admin-form-input" 
                    />
                  </div>
                  {/* End Date */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">End Date</label>
                    <input 
                      type="date" 
                      required 
                      value={discountForm.endDate} 
                      onChange={e => setDiscountForm({...discountForm, endDate: e.target.value})} 
                      className="admin-form-input" 
                    />
                  </div>
                </div>

                {/* Is Active Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={discountForm.isActive} 
                    onChange={e => setDiscountForm({...discountForm, isActive: e.target.checked})} 
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="isActive" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
                    Enable this discount immediately
                  </label>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: 800, marginTop: '12px', cursor: 'pointer' }}>
                  {editingDiscount ? 'Save Changes' : 'Schedule Discount'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscountsTab;
