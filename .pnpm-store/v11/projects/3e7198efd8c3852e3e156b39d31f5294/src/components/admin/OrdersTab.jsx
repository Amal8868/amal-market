import React, { useState } from 'react';
import { Search, Download, FileSpreadsheet, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const OrdersTab = ({ orders, onUpdateStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Filter Orders
  const filteredOrders = orders.filter(o => 
    o._id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shippingAddress?.phone?.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 2. Status Badge Renderer
  const getStatusBadge = (status) => {
    switch(status) {
      case 'delivered': 
        return <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: 'rgba(31,128,68,0.1)', color: 'var(--primary)' }}>Delivered</span>;
      case 'shipped': 
        return <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: 'rgba(51,153,255,0.1)', color: '#3399ff' }}>Shipped</span>;
      case 'processing': 
        return <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: 'rgba(247,127,0,0.1)', color: 'var(--secondary)' }}>Processing</span>;
      case 'cancelled': 
        return <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: 'rgba(255,77,77,0.1)', color: '#ff4d4d' }}>Cancelled</span>;
      case 'pending':
        return <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: 'rgba(212,168,83,0.1)', color: 'var(--accent-gold)' }}>New order</span>;
      default: 
        return <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: 'rgba(212,168,83,0.1)', color: 'var(--accent-gold)' }}>New order</span>;
    }
  };

  // 3. Export to CSV Handler
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export!');
      return;
    }

    // Define CSV Headers
    const headers = [
      'Order ID', 
      'Customer Name', 
      'Customer Phone', 
      'Shipping Address', 
      'City',
      'Items Ordered', 
      'Subtotal ($)', 
      'Discount Applied ($)', 
      'Shipping Fee ($)', 
      'Tax Price ($)', 
      'Total Paid ($)', 
      'Payment Method', 
      'Fulfillment Status', 
      'Date Placed'
    ];

    // Format rows
    const rows = filteredOrders.map(order => {
      const itemsList = (order.orderItems || []).map(i => `${i.quantity}x ${i.name}`).join('; ');
      return [
        order._id,
        order.shippingAddress?.fullName || 'Anonymous',
        order.shippingAddress?.phone || 'N/A',
        `"${(order.shippingAddress?.address || '').replace(/"/g, '""')}"`,
        order.shippingAddress?.city || '',
        `"${itemsList.replace(/"/g, '""')}"`,
        order.itemsPrice || 0,
        order.discountPrice || 0,
        order.shippingPrice || 0,
        order.taxPrice || 0,
        order.totalPrice || 0,
        order.paymentMethod,
        order.status,
        new Date(order.createdAt).toISOString()
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Create download element
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `amal_market_orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('📊 Orders data successfully exported to CSV!');
  };

  return (
    <div className="admin-card">
      
      {/* Search and Action Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>All Orders ({filteredOrders.length})</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Review customer shipping info, change fulfillment status, or export ledger</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Export to CSV Button */}
          <button 
            onClick={handleExportCSV}
            className="btn-outline" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 20px', 
              borderRadius: '14px', 
              fontSize: '13px', 
              fontWeight: 700, 
              border: '1px solid var(--border-soft)',
              background: 'var(--bg-main)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <FileSpreadsheet size={16} color="var(--primary)" />
            Export to CSV
          </button>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by ID, name, or phone..." 
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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
      </div>

      {/* Orders Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer & Contact</th>
              <th>Items Purchased</th>
              <th>Total Price</th>
              <th>Fulfillment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map(order => (
              <tr key={order._id}>
                {/* ID */}
                <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                  #{order._id.slice(-8).toUpperCase()}
                </td>

                {/* Customer */}
                <td>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{order.shippingAddress?.fullName || 'Anonymous'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Phone: {order.shippingAddress?.phone || '—'}
                  </div>
                </td>

                {/* Items */}
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                  <div style={{ fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {(order.orderItems || []).map((i, idx) => (
                      <span key={idx}>
                        • {i.quantity}x <strong style={{ color: 'var(--text-primary)' }}>{i.name}</strong>
                      </span>
                    ))}
                  </div>
                </td>

                {/* Total */}
                <td style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ${(order.totalPrice || 0).toFixed(2)}
                </td>

                {/* Status */}
                <td>
                  {getStatusBadge(order.status)}
                </td>

                {/* Select Actions */}
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    disabled={['delivered', 'cancelled'].includes(order.status)}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '10px', 
                      border: '1px solid var(--border-soft)', 
                      background: 'var(--bg-main)', 
                      color: 'var(--text-primary)', 
                      fontWeight: 600, 
                      fontSize: '13px', 
                      outline: 'none',
                      cursor: 'pointer' 
                    }}
                  >
                    <option value="pending" disabled={order.status !== 'pending'}>New order</option>
                    <option value="processing" disabled={!['pending', 'processing'].includes(order.status)}>Processing</option>
                    <option value="shipped" disabled={!['processing', 'shipped'].includes(order.status)}>Shipped</option>
                    <option value="delivered" disabled={order.status !== 'shipped'}>Delivered</option>
                    <option value="cancelled" disabled={!['pending', 'processing'].includes(order.status)}>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No orders matched search query.
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

export default OrdersTab;
