import { 
  LayoutDashboard, ShoppingBag, Package, FolderTree, 
  Users, Settings, LogOut, ArrowLeft, TrendingUp, Percent, Tag, X
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';

const SidebarLink = ({ icon: Icon, label, active = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="admin-sidebar-link"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '14px 20px',
      borderRadius: '16px',
      cursor: 'pointer',
      fontWeight: active ? 700 : 500,
      color: active ? 'white' : 'var(--text-secondary)',
      background: active ? 'var(--primary)' : 'transparent',
      boxShadow: active ? '0 8px 20px rgba(31, 128, 68, 0.3)' : 'none',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'var(--bg-main)'; } }}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}
  >
    <Icon size={20} />
    <span style={{ fontSize: '15px' }}>{label}</span>
  </button>
);

const Sidebar = ({ activeTab, onTabChange, isOpen = false, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleTab = (tab) => {
    onTabChange(tab);
    if (onClose) onClose();
  };

  return (
    <aside id="admin-sidebar" className={`admin-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Admin sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', paddingLeft: '8px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 20px rgba(31,128,68,0.3)' }}>
          <TrendingUp size={24} />
        </div>
        <button type="button" className="admin-sidebar-close" onClick={onClose} aria-label="Close admin sidebar">
          <X size={22} />
        </button>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Playfair Display', serif", margin: 0, lineHeight: 1 }}>Amal Admin</h2>
          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Management</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', display: 'block', paddingLeft: '12px' }}>Overview</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => handleTab('dashboard')} />
            <SidebarLink icon={ShoppingBag} label="Orders" active={activeTab === 'orders'} onClick={() => handleTab('orders')} />
            <SidebarLink icon={Users} label="Customers" active={activeTab === 'users'} onClick={() => handleTab('users')} />
          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', display: 'block', paddingLeft: '12px' }}>Catalog</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SidebarLink icon={Package} label="Products" active={activeTab === 'products'} onClick={() => handleTab('products')} />
            <SidebarLink icon={Percent} label="Discounts" active={activeTab === 'discounts'} onClick={() => handleTab('discounts')} />
            <SidebarLink icon={Tag} label="Coupons" active={activeTab === 'coupons'} onClick={() => handleTab('coupons')} />
            <SidebarLink icon={FolderTree} label="Categories" active={activeTab === 'categories'} onClick={() => handleTab('categories')} />

          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', display: 'block', paddingLeft: '12px' }}>Store</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div 
              onClick={() => navigate('/')} 
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderRadius: '16px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'var(--bg-main)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <ArrowLeft size={20} />
              <span style={{ fontSize: '15px' }}>Back to Store</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer / Logout */}
      <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '24px' }}>
        <div 
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderRadius: '16px', color: '#ff4d4d', cursor: 'pointer', fontWeight: 700, transition: 'all 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={20} />
          <span style={{ fontSize: '15px' }}>Sign Out</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
