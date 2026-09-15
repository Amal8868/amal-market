import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children, title = "Dashboard", activeTab, onTabChange }) => {
  // Kept separate from the customer navigation state in Navbar.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabChange = (tab) => {
    setIsSidebarOpen(false);
    onTabChange(tab);
  };

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsSidebarOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <div className="admin-shell">
      {isSidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="admin-content">
        <header className="admin-header">
          <button
            type="button"
            className="admin-menu-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open admin sidebar"
            aria-expanded={isSidebarOpen}
            aria-controls="admin-sidebar"
          >
            <span aria-hidden="true" style={{ fontSize: '24px', lineHeight: 1 }}>▤</span>
          </button>
          <div>
            <h1 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, margin: 0 }}>{title}</h1>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Amal Market Administration System</span>
          </div>
        </header>

        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
