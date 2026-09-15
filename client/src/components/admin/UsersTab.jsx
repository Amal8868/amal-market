import React, { useState } from 'react';
import { Search } from 'lucide-react';

const UsersTab = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Users
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone?.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="admin-card">
      
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Registered Customers & Admins ({filteredUsers.length})</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Review registered customer profiles, contact numbers, and Mogadishu delivery locations</p>
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{ 
              width: '100%', 
              padding: '12px 16px 12px 44px', 
              borderRadius: '12px', 
              border: '1px solid var(--border-soft)', 
              background: 'var(--bg-main)', 
              color: 'var(--text-primary)',
              fontSize: '14px', 
              outline: 'none' 
            }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email Address</th>
              <th>Somalia Phone</th>
              <th>Mogadishu Address</th>
              <th>System Role</th>
              <th>Registered Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(u => (
              <tr key={u._id}>
                
                {/* Avatar & Name */}
                <td style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      background: u.role === 'admin' ? 'var(--primary)' : 'rgba(31,128,68,0.1)', 
                      border: '1px solid var(--border-soft)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justify: 'center', 
                      fontWeight: 800, 
                      color: u.role === 'admin' ? 'white' : 'var(--primary)',
                      fontSize: '14px'
                    }}>
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    {u.name}
                  </div>
                </td>

                {/* Email */}
                <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {u.email}
                </td>

                {/* Phone */}
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {u.phone || '—'}
                </td>

                {/* Address */}
                <td style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>
                  {u.address || '—'}
                </td>

                {/* Role */}
                <td>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '10px', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    background: u.role === 'admin' ? 'rgba(31,128,68,0.1)' : 'rgba(51,153,255,0.1)', 
                    color: u.role === 'admin' ? 'var(--primary)' : '#3399ff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {u.role || 'user'}
                  </span>
                </td>

                {/* Date */}
                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>

              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No customer records found matching query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-soft)' }}>
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-soft)', background: currentPage === 1 ? 'var(--bg-main)' : 'var(--bg-surface)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>Page <span style={{ color: 'var(--primary)' }}>{currentPage}</span> of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-soft)', background: currentPage === totalPages ? 'var(--bg-main)' : 'var(--bg-surface)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default UsersTab;
