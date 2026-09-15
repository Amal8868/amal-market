import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Calendar, MapPin, DollarSign, ExternalLink, X, CheckCircle2, Clock, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Active Tab: 'orders' or 'details'
  const [activeTab, setActiveTab] = useState('orders');

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [editCurrentPassword, setEditCurrentPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync edits if user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditAddress(user.address || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Full Name is required');
      return;
    }

    if (editPassword) {
      if (!editCurrentPassword) {
        toast.error('Current password is required to set a new password');
        return;
      }
      if (editPassword !== editConfirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setIsSaving(true);
    try {
      const updateData = {
        name: editName,
        phone: editPhone,
        address: editAddress
      };

      if (editPassword) {
        updateData.password = editPassword;
        updateData.currentPassword = editCurrentPassword;
      }

      const { data } = await api.put('/auth/me', updateData);
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated successfully!');
        setEditPassword('');
        setEditConfirmPassword('');
        setEditCurrentPassword('');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error('Failed to load order history:', err);
        toast.error('Failed to load order history');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);


  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="badge" style={{ background: '#dcfce7', color: '#15803d', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Delivered</span>;
      case 'shipped':
        return <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Truck size={14} /> Shipped</span>;
      case 'processing':
        return <span className="badge" style={{ background: '#fef3c7', color: '#b45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Processing</span>;
      case 'pending':
      default:
        return <span className="badge" style={{ background: '#fef3c7', color: '#b45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> New order</span>;
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px', fontFamily: "'Inter', sans-serif" }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header Profile Card */}
        <div style={{ 
          background: 'var(--bg-surface)', 
          padding: '36px', 
          borderRadius: '28px', 
          border: '1px solid var(--border-soft)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ 
              width: '84px', 
              height: '84px', 
              borderRadius: '24px', 
              background: 'linear-gradient(135deg, var(--primary), #1a6b38)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(31, 128, 68, 0.3)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {user.role === 'admin' ? 'Administrator Account' : 'Verified Member'}
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '4px 0 6px 0', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>
                {user.name}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {user.email}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              style={{ padding: '12px 24px', borderRadius: '14px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = '#ef4444'; e.target.style.color = 'white'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; }}
            >
              Sign Out
            </button>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '14px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                Admin Portal
              </Link>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-soft)', paddingBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 28px',
              borderRadius: '16px',
              border: 'none',
              background: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'orders' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Package size={18} /> Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '12px 28px',
              borderRadius: '16px',
              border: 'none',
              background: activeTab === 'details' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'details' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <User size={18} /> Account Details
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' ? (
          <div>
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                <Loader2 className="pulse-anim" size={40} style={{ margin: '0 auto 16px' }} />
                <p style={{ fontWeight: 600 }}>Loading your recent orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '28px',
                      borderRadius: '24px',
                      border: '1px solid var(--border-soft)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={28} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {order.shippingAddress?.city}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Total Paid</span>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>${order.totalPrice?.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-outline"
                        style={{ padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}
                      >
                        View Details <ExternalLink size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--bg-surface)', borderRadius: '28px', border: '1px solid var(--border-soft)' }}>
                <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No orders placed yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>When you place orders, their real-time delivery status will show here.</p>
                <Link to="/products" className="btn-primary" style={{ padding: '14px 32px', borderRadius: '14px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
                  Explore Market
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} style={{ background: 'var(--bg-surface)', padding: '36px', borderRadius: '28px', border: '1px solid var(--border-soft)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Account Profile Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '720px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address (Read Only)</label>
                <input 
                  type="text" 
                  readOnly 
                  value={user.email} 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 500, cursor: 'not-allowed' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Phone Number</label>
                <input 
                  type="text" 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)} 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Shipping Address</label>
                <input 
                  type="text" 
                  value={editAddress} 
                  onChange={(e) => setEditAddress(e.target.value)} 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Current Password (Required for password changes)</label>
                <input 
                  type="password" 
                  value={editCurrentPassword} 
                  onChange={(e) => setEditCurrentPassword(e.target.value)} 
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>New Password (Leave blank to keep current)</label>
                <input 
                  type="password" 
                  value={editPassword} 
                  onChange={(e) => setEditPassword(e.target.value)} 
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={editConfirmPassword} 
                  onChange={(e) => setEditConfirmPassword(e.target.value)} 
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }} 
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-start', borderTop: '1px solid var(--border-soft)', paddingTop: '24px' }}>
              <button 
                type="submit" 
                disabled={isSaving}
                className="btn-primary" 
                style={{ padding: '14px 36px', borderRadius: '14px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="pulse-anim" size={18} /> Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: '32px',
                padding: '40px',
                maxWidth: '640px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-2xl)',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--bg-main)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>

              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Details</span>
                <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '4px 0 8px 0', color: 'var(--text-primary)' }}>
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Purchased Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item._id || item.product} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-main)', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{item.name}</span>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.price?.toFixed(2)}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>${(item.quantity * item.price)?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery info */}
              <div style={{ background: 'var(--bg-main)', padding: '24px', borderRadius: '20px', marginBottom: '32px', fontSize: '14px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Shipping & Payment Summary</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                  <div><strong>Deliver to:</strong> {selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})</div>
                  <div><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}</div>
                  <div><strong>Payment Method:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{selectedOrder.paymentMethod?.replace(/_/g, ' ')}</span></div>
                </div>
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-soft)', paddingTop: '20px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Total Paid</span>
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>${selectedOrder.totalPrice?.toFixed(2)}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfilePage;
