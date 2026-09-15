import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react';

const ProductsTab = ({ products, categories, onSubmitProduct, onDeleteProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: categories?.[0]?._id || '',
    price: '',
    image: '',
    stock: 50,
    badge: ''
  });

  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'

  // Stock status counts
  const stockCounts = {
    all: products.length,
    in_stock: products.filter(p => p.stock > 5).length,
    low_stock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    out_of_stock: products.filter(p => p.stock <= 0).length,
  };

  // 1. Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (stockFilter === 'in_stock') return p.stock > 5;
    if (stockFilter === 'low_stock') return p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'out_of_stock') return p.stock <= 0;

    return true;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      categoryId: categories?.[0]?._id || '',
      price: '',
      image: '',
      stock: 50,
      badge: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      categoryId: prod.category?._id || prod.category || categories?.[0]?._id || '',
      price: prod.price,
      image: prod.image || prod.images?.[0] || '',
      stock: prod.stock || 0,
      badge: prod.badge || ''
    });
    setIsModalOpen(true);
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    // Pass up to parent with payload + edit ID if applicable
    onSubmitProduct(editingProduct, productForm);
    setIsModalOpen(false);
  };

  return (
    <div className="admin-card">
      
      {/* Header Row: Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Products Catalog</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Manage product inventory, stock levels, and pricing</p>
        </div>

        {/* Add Product Button */}
        <button 
          onClick={openAddModal}
          className="btn-primary" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '10px 20px', 
            borderRadius: '12px', 
            fontSize: '14px', 
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Toolbar Row: Segmented Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        {/* Segmented Filter Control */}
        <div style={{ 
          display: 'inline-flex', 
          background: 'var(--bg-main)', 
          padding: '4px', 
          borderRadius: '12px', 
          border: '1px solid var(--border-soft)',
          gap: '4px'
        }}>
          {[
            { id: 'all', label: 'All', count: stockCounts.all },
            { id: 'in_stock', label: 'In Stock', count: stockCounts.in_stock },
            { id: 'low_stock', label: 'Low Stock', count: stockCounts.low_stock },
            { id: 'out_of_stock', label: 'Sold Out', count: stockCounts.out_of_stock },
          ].map(tab => {
            const isActive = stockFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStockFilter(tab.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  background: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{tab.label}</span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.06)', 
                  color: isActive ? '#ffffff' : 'var(--text-muted)' 
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search product name or dept..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '9px 14px 9px 40px', 
              borderRadius: '10px', 
              border: '1px solid var(--border-soft)', 
              background: 'var(--bg-main)', 
              fontSize: '13px', 
              color: 'var(--text-primary)',
              outline: 'none' 
            }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Department</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th>Badge</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(prod => (
              <tr key={prod._id}>
                {/* Image */}
                <td>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                    <img src={prod.image || prod.images?.[0]} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </td>

                {/* Name */}
                <td style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                  {prod.name}
                </td>

                {/* Category */}
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                  {prod.categoryName || 'Fresh Fruits'}
                </td>

                {/* Price */}
                <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '15px' }}>
                  ${prod.price.toFixed(2)}
                </td>

                {/* Stock */}
                <td>
                  {prod.stock <= 0 ? (
                    <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px' }}>
                      Sold Out
                    </span>
                  ) : prod.stock <= 5 ? (
                    <span style={{ color: '#eab308', fontWeight: 600, fontSize: '13px' }}>
                      Low Stock ({prod.stock} left)
                    </span>
                  ) : (
                    <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '13px' }}>
                      In Stock ({prod.stock})
                    </span>
                  )}
                </td>

                {/* Badge */}
                <td>
                  {prod.badge ? (
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>
                      {prod.badge}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => openEditModal(prod)}
                      style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => onDeleteProduct(prod._id)}
                      style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(255,77,77,0.3)', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No matching catalog products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── MODAL: ADD / EDIT PRODUCT ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="admin-modal-content"
              style={{ maxWidth: '600px', width: '100%' }}
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="admin-modal-close"
              >
                <X size={18} />
              </button>

              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleLocalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Product Name</label>
                  <input 
                    type="text" 
                    required 
                    value={productForm.name} 
                    onChange={e => setProductForm({...productForm, name: e.target.value})} 
                    className="admin-form-input" 
                    placeholder="Organic Honeycrisp Apple" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Department</label>
                    <select 
                      value={productForm.categoryId}
                      onChange={e => setProductForm({...productForm, categoryId: e.target.value})}
                      className="admin-form-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="" disabled>Select a Category...</option>
                      {categories.map((c, idx) => (
                        <option key={c._id || idx} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Stock Quantity</label>
                    <input 
                      type="number" 
                      required 
                      value={productForm.stock} 
                      onChange={e => setProductForm({...productForm, stock: e.target.value})} 
                      className="admin-form-input"
                      placeholder="50" 
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={productForm.price} 
                    onChange={e => setProductForm({...productForm, price: e.target.value})} 
                    className="admin-form-input" 
                    placeholder="4.99" 
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Image URL</label>
                  <input 
                    type="url" 
                    value={productForm.image} 
                    onChange={e => setProductForm({...productForm, image: e.target.value})} 
                    className="admin-form-input" 
                    placeholder="https://images.unsplash.com/photo-..." 
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Badge (Optional)</label>
                  <input 
                    type="text" 
                    value={productForm.badge} 
                    onChange={e => setProductForm({...productForm, badge: e.target.value})} 
                    className="admin-form-input" 
                    placeholder="Best Seller, Organic, Sale..." 
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: 800, marginTop: '12px', cursor: 'pointer' }}>
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductsTab;
