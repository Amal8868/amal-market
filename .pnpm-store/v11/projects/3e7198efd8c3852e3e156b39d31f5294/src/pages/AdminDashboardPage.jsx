import React, { useState, useEffect, useRef } from 'react';
import { SkeletonGrid, SkeletonRow, Skeleton } from '../components/ui/Skeleton';
import AdminLayout from '../components/layout/AdminLayout';
import api from '../services/api';
import toast from 'react-hot-toast';

// Import modular tab components
import DashboardTab from '../components/admin/DashboardTab';
import OrdersTab from '../components/admin/OrdersTab';
import ProductsTab from '../components/admin/ProductsTab';
import DiscountsTab from '../components/admin/DiscountsTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import UsersTab from '../components/admin/UsersTab';
import CouponsTab from '../components/admin/CouponsTab';


import ConfirmModal from '../components/ui/ConfirmModal';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // General Entity State
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Analytics State
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState(null);

  const [dataLoaded, setDataLoaded] = useState({
    dashboard: false,
    orders: false,
    products: false,
    discounts: false,
    coupons: false,
    categories: false,
    users: false
  });

  // Custom Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: () => {}
  });

  const requestConfirm = ({ title, message, confirmText = 'Delete', onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm
    });
  };


  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, revRes, topProdsRes, recentRes] = await Promise.all([
        api.get('/analytics/orders-summary').catch(() => null),
        api.get('/analytics/revenue').catch(() => null),
        api.get('/analytics/top-products').catch(() => null),
        api.get('/analytics/recent-activity').catch(() => null)
      ]);
      if (summaryRes?.data?.success) setAnalyticsStats(summaryRes.data.data);
      if (revRes?.data?.success) setRevenueData(revRes.data.data);
      if (topProdsRes?.data?.success) setTopProducts(topProdsRes.data.data);
      if (recentRes?.data?.success) setRecentActivity(recentRes.data.data);
      setDataLoaded(prev => ({ ...prev, dashboard: true }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      if (data?.success) setOrders(data.data);
      setDataLoaded(prev => ({ ...prev, orders: true }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/categories')
      ]);
      if (prodsRes.data?.success) setProducts(prodsRes.data.data);
      if (catsRes.data?.success) setCategories(catsRes.data.data);
      setDataLoaded(prev => ({ ...prev, products: true, categories: true }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesData = async () => {
    if (dataLoaded.categories) return;
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      if (data?.success) setCategories(data.data);
      setDataLoaded(prev => ({ ...prev, categories: true }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/users');
      if (data?.success) setUsersList(data.data);
      setDataLoaded(prev => ({ ...prev, users: true }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscountsData = async () => {
    setLoading(true);
    try {
      const [discountsRes, prodsRes] = await Promise.all([
        api.get('/discounts'),
        api.get('/products?limit=100')
      ]);
      if (discountsRes.data?.success) setDiscounts(discountsRes.data.data);
      if (prodsRes.data?.success) setProducts(prodsRes.data.data);
      setDataLoaded(prev => ({ ...prev, discounts: true, products: true }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load discounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCouponsData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/coupons');
      if (data?.success) setCoupons(data.data);
      setDataLoaded(prev => ({ ...prev, coupons: true }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (couponData) => {
    try {
      const { data } = await api.post('/coupons', couponData);
      if (data?.success) {
        toast.success(`Promo code "${data.data.code}" created!`);
        fetchCouponsData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create coupon';
      toast.error(msg);
    }
  };

  const handleDeleteCoupon = (id) => {
    requestConfirm({
      title: 'Delete Coupon',
      message: 'Are you sure you want to delete this promo coupon?',
      confirmText: 'Delete Coupon',
      onConfirm: async () => {
        try {
          const { data } = await api.delete(`/coupons/${id}`);
          if (data?.success) {
            toast.success('Coupon deleted');
            fetchCouponsData();
          }
        } catch (err) {
          const msg = err.response?.data?.message || 'Failed to delete coupon';
          toast.error(msg);
        }
      }
    });
  };

  const refreshActiveTab = async () => {
    switch (activeTab) {
      case 'dashboard':
        await fetchDashboardData();
        break;
      case 'orders':
        await fetchOrdersData();
        break;
      case 'products':
        await fetchProductsData();
        break;
      case 'discounts':
        await fetchDiscountsData();
        break;
      case 'coupons':
        await fetchCouponsData();
        break;
      case 'categories':
        await fetchCategoriesData();
        break;
      case 'users':
        await fetchUsersData();
        break;
      default:
        break;
    }
  };

  const tabLoadersRef = useRef({});
  tabLoadersRef.current = {
    dashboard: fetchDashboardData,
    orders: fetchOrdersData,
    products: fetchProductsData,
    discounts: fetchDiscountsData,
    coupons: fetchCouponsData,
    categories: fetchCategoriesData,
    users: fetchUsersData
  };

  useEffect(() => {
    if (!dataLoaded[activeTab]) {
      tabLoadersRef.current[activeTab]?.();
    }
  }, [activeTab, dataLoaded]);


  /* ─── Shared Administrative Form Actions ─── */

  // Order Fulfillment Updates
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      const statusLabel = newStatus === 'pending' ? 'New order' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
      toast.success(`Fulfillment status updated to ${statusLabel}`);
      // Refresh analytics in background
      await refreshActiveTab();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Product Addition & Modification Form Submission
  const handleProductSubmit = async (editingProduct, form) => {
    try {
      const payload = {
        name: form.name,
        categoryId: form.categoryId,
        price: parseFloat(form.price),
        image: form.image || 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600',
        stock: parseInt(form.stock),
        badge: form.badge
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('Catalog item updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }
      await refreshActiveTab();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save product details');
    }
  };

  // Product Deletion
  const handleDeleteProduct = (productId) => {
    const targetProd = products.find(p => p._id === productId);
    const nameText = targetProd?.name ? `"${targetProd.name}"` : 'this product';

    requestConfirm({
      title: 'Delete Product',
      message: `Are you sure you want to permanently delete ${nameText}? This product will be removed from your catalog.`,
      confirmText: 'Delete Product',
      onConfirm: async () => {
        try {
          await api.delete(`/products/${productId}`);
          toast.success('Product removed from catalog');
          await refreshActiveTab();
        } catch (err) {
          console.error(err);
          toast.error('Failed to remove product');
        }
      }
    });
  };

  // Category Addition
  const handleCategorySubmit = async (form) => {
    try {
      await api.post('/categories', form);
      toast.success('Department created successfully');
      await refreshActiveTab();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create department');
    }
  };

  // Discount Addition & Mod Form Submission
  const handleDiscountSubmit = async (editingDiscount, form) => {
    try {
      const payload = {
        product: form.product,
        type: form.type,
        value: parseFloat(form.value),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive
      };

      if (editingDiscount) {
        await api.put(`/discounts/${editingDiscount._id}`, payload);
        toast.success('Discount schedule updated successfully');
      } else {
        await api.post('/discounts', payload);
        toast.success('Discount scheduled successfully');
      }
      await refreshActiveTab();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Failed to save discount details';
      toast.error(message);
    }
  };

  // Discount Deletion
  const handleDeleteDiscount = (discountId) => {
    requestConfirm({
      title: 'Remove Discount',
      message: 'Are you sure you want to remove this discount schedule?',
      confirmText: 'Remove Discount',
      onConfirm: async () => {
        try {
          await api.delete(`/discounts/${discountId}`);
          toast.success('Discount removed successfully');
          await refreshActiveTab();
        } catch (err) {
          console.error(err);
          toast.error('Failed to remove discount');
        }
      }
    });
  };

  return (
    <AdminLayout 
      title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
          {activeTab === 'dashboard' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} style={{ height: '120px', borderRadius: '24px' }} />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <Skeleton style={{ height: '300px', borderRadius: '24px' }} />
                <Skeleton style={{ height: '300px', borderRadius: '24px' }} />
              </div>
            </>
          ) : activeTab === 'categories' ? (
            <SkeletonGrid count={8} viewMode="grid" />
          ) : (
            <div style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-soft)' }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Dashboard General Overview */}
          {activeTab === 'dashboard' && (
            <DashboardTab 
              stats={analyticsStats} 
              revenueData={revenueData} 
              topProducts={topProducts} 
              recentActivity={recentActivity}
              onViewAllOrders={() => setActiveTab('orders')}
            />
          )}

          {/* Orders Tracking Ledger */}
          {activeTab === 'orders' && (
            <OrdersTab 
              orders={orders} 
              onUpdateStatus={handleUpdateOrderStatus} 
            />
          )}

          {/* Product Catalog Inventory */}
          {activeTab === 'products' && (
            <ProductsTab 
              products={products} 
              categories={categories} 
              onSubmitProduct={handleProductSubmit} 
              onDeleteProduct={handleDeleteProduct} 
            />
          )}

          {/* Discounts Tab */}
          {activeTab === 'discounts' && (
            <DiscountsTab 
              discounts={discounts} 
              products={products} 
              onSubmitDiscount={handleDiscountSubmit} 
              onDeleteDiscount={handleDeleteDiscount} 
            />
          )}

          {/* Promo Coupons Tab */}
          {activeTab === 'coupons' && (
            <CouponsTab 
              coupons={coupons} 
              onCreateCoupon={handleCreateCoupon} 
              onDeleteCoupon={handleDeleteCoupon} 
            />
          )}


          {/* Category / Department Grids */}
          {activeTab === 'categories' && (
            <CategoriesTab 
              categories={categories} 
              onSubmitCategory={handleCategorySubmit} 
            />
          )}

          {/* Users & Accounts Ledger */}
          {activeTab === 'users' && (
            <UsersTab 
              users={usersList} 
            />
          )}
        </>
      )}

      {/* Custom Confirmation Popup Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
      />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
