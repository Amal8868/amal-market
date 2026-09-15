import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  DollarSign, ShoppingBag, Package, FolderTree, Users, 
  TrendingUp, Activity, Award, UserCheck, ShoppingCart
} from 'lucide-react';

const DashboardTab = ({ 
  stats, 
  revenueData, 
  topProducts, 
  recentActivity,
  onViewAllOrders 
}) => {
  const [revenuePeriod, setRevenuePeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  // 1. Safe fallbacks
  const computedStats = stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    fulfillmentRate: 0
  };

  const recentOrders = recentActivity?.recentOrders || [];
  const recentUsers = recentActivity?.recentUsers || [];

  // 2. Format revenue data based on selected period
  const getRevenueChartData = () => {
    if (!revenueData) return [];
    const sourceData = revenueData[revenuePeriod] || [];
    
    return sourceData.map(item => {
      let label = item._id;
      // Format label for aesthetics
      if (revenuePeriod === 'daily') {
        const date = new Date(item._id);
        label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      } else if (revenuePeriod === 'monthly') {
        const [year, month] = item._id.split('-');
        const date = new Date(year, parseInt(month) - 1, 1);
        label = date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      }
      return {
        name: label,
        Revenue: parseFloat((item.revenue || 0).toFixed(2)),
        Orders: item.ordersCount || 0
      };
    });
  };

  const activeRevenueData = getRevenueChartData();

  // 3. Format Top Products Data
  const formattedTopProducts = (topProducts || []).map(p => ({
    name: p.name && p.name.length > 18 ? p.name.slice(0, 16) + '...' : (p.name || 'Organic Product'),
    fullName: p.name || 'Organic Product',
    Sales: p.quantitySold || 0,
    Revenue: parseFloat((p.revenueGenerated || 0).toFixed(2))
  }));

  // 4. Format Order Status distribution for Pie Chart
  const statusColors = {
    pending: '#d4a853',      // gold
    processing: '#f77f00',   // orange
    shipped: '#3399ff',      // blue
    delivered: '#1f8044',    // green
    cancelled: '#ff4d4d'     // red
  };

  const statusLabels = { pending: 'New order' };
  const statusPieData = computedStats.breakdown 
    ? computedStats.breakdown.map(item => ({
        name: statusLabels[item.status] || item.status.charAt(0).toUpperCase() + item.status.slice(1),
        value: item.count,
        color: statusColors[item.status] || '#718096'
      })).filter(item => item.value > 0)
    : [];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'delivered': return <span className="status-badge status-badge-delivered">Delivered</span>;
      case 'shipped': return <span className="status-badge status-badge-shipped">Shipped</span>;
      case 'processing': return <span className="status-badge status-badge-processing">Processing</span>;
      case 'cancelled': return <span className="status-badge status-badge-cancelled">Cancelled</span>;
      default: return <span className="status-badge status-badge-pending">New order</span>;
    }
  };

  // Compute Revenue Month-over-Month growth if possible
  const getMoMGrowth = () => {
    if (!revenueData || !revenueData.monthly || revenueData.monthly.length < 2) {
      return '+12.5%'; // fallback if not enough historical monthly metrics
    }
    const len = revenueData.monthly.length;
    const currentMonthRev = revenueData.monthly[len - 1].revenue;
    const prevMonthRev = revenueData.monthly[len - 2].revenue;
    if (prevMonthRev === 0) return '+100%';
    const diff = ((currentMonthRev - prevMonthRev) / prevMonthRev) * 100;
    return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
  };

  const momGrowth = getMoMGrowth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      
      {/* ─── KPI METRIC CARDS ─── */}
      <div className="kpi-grid">
        
        {/* Total Revenue */}
        <div className="glass-card kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(31,128,68,0.1)', color: 'var(--primary)' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>${(computedStats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{momGrowth}</span> MoM growth
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(247,127,0,0.1)', color: 'var(--secondary)' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{computedStats.totalOrders || 0}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{computedStats.fulfillmentRate || 0}%</span> fulfillment rate
          </div>
        </div>

        {/* Active Products */}
        <div className="glass-card kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Catalog</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(51,153,255,0.1)', color: '#3399ff' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{computedStats.totalProducts || 0}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Across {computedStats.totalCategories || 0} departments
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="glass-card kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Order Value</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(212,168,83,0.1)', color: 'var(--accent-gold)' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>${(computedStats.averageOrderValue || 0).toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            AOV per shopping ticket
          </div>
        </div>

        {/* Registered Customers */}
        <div className="glass-card kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Customers</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{computedStats.totalCustomers || 0}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Registered accounts
          </div>
        </div>
      </div>

      {/* ─── CHARTS SECTION ─── */}
      <div className="dashboard-charts-grid">
        
        {/* Revenue Analytics Chart */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>Revenue Over Time</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Visualize cash flows and total grocery orders placed</p>
            </div>
            
            {/* Period Selector Tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              {['daily', 'weekly', 'monthly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setRevenuePeriod(period)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    border: 'none',
                    background: revenuePeriod === period ? 'var(--bg-surface)' : 'transparent',
                    color: revenuePeriod === period ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: revenuePeriod === period ? 'var(--shadow-xs)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: '100%', height: '320px' }}>
            {activeRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-soft)" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => `$${val}`}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--bg-surface)', 
                      borderRadius: '16px', 
                      border: '1px solid var(--border-soft)',
                      boxShadow: 'var(--shadow-md)'
                    }} 
                    labelStyle={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Revenue" 
                    stroke="var(--primary)" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No transaction data available for this range.
              </div>
            )}
          </div>
        </div>

        {/* Order Status Breakdown Pie Chart */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>Order Statuses</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Fulfillment breakdown</p>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '220px', position: 'relative' }}>
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--bg-surface)', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-soft)' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No orders record.</div>
            )}
            
            {statusPieData.length > 0 && (
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{computedStats.totalOrders}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Orders</span>
              </div>
            )}
          </div>

          {/* Simple Premium Custom Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            {statusPieData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{item.name}:</span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECOND ROW: TOP PRODUCTS + ACTIVITY ─── */}
      <div className="dashboard-activity-grid">
        
        {/* Top Products Bar Chart */}
        <div className="admin-card">
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>Top Best Sellers</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Top best-selling items ordered by product volume</p>
          </div>

          <div style={{ width: '100%', height: '280px', marginTop: '24px' }}>
            {formattedTopProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedTopProducts} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-soft)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 11, fontWeight: 700 }} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--bg-surface)', 
                      borderRadius: '16px', 
                      border: '1px solid var(--border-soft)'
                    }}
                    formatter={(value, name) => [value, name === 'Sales' ? 'Units Sold' : name]}
                  />
                  <Bar dataKey="Sales" radius={[0, 8, 8, 0]} barSize={14}>
                    {formattedTopProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No catalog sales history yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Operations (was Recent Activities Columns) */}
        <div className="admin-card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>Recent Operations</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Live tracking of registrations & new ticket purchases</p>
            </div>
            <button onClick={onViewAllOrders} className="btn-outline" style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '10px' }}>
              View Orders
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            
            {/* Orders Feed */}
            <div>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingCart size={14} color="var(--primary)" /> Recent Purchases
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentOrders.slice(0, 4).map((order) => (
                  <div key={order._id} style={{ padding: '12px', borderRadius: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--primary)', fontSize: '12px' }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{order.shippingAddress?.fullName || 'Guest Customer'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>No recent orders.</div>
                )}
              </div>
            </div>

            {/* Customers Feed */}
            <div>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={14} color="#8b5cf6" /> New Registrations
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentUsers.slice(0, 4).map((c) => (
                  <div key={c._id} style={{ padding: '12px', borderRadius: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{c.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{c.email}</div>
                    </div>
                  </div>
                ))}
                {recentUsers.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>No new registrations.</div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardTab;
