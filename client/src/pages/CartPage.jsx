import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Plus, Minus, Trash2, 
  ArrowRight, ArrowLeft, ShieldCheck, 
  Truck, CreditCard, ChevronRight,
  MapPin, CheckCircle2, Loader2, X, Smartphone
} from 'lucide-react';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import ScrollReveal from '../components/layout/ScrollReveal';
import api from '../services/api';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Checkout Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: user?.address || 'Wadajir, Suuqa Weyn',
    city: 'Mogadishu',
    postalCode: '00252',
    country: 'Somalia',
    phone: user?.phone || '+252 61 5550192'
  });
  const [paymentMethod, setPaymentMethod] = useState('evc_plus');
  const [mockPaymentOutcome, setMockPaymentOutcome] = useState('success');

  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        address: user.address || prev.address,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const shipping = 0; // FREE
  
  const discountAmount = appliedCoupon ? (
    appliedCoupon.discountType === 'percentage' 
      ? parseFloat(((cartTotal * appliedCoupon.discountValue) / 100).toFixed(2))
      : Math.min(appliedCoupon.discountValue, cartTotal)
  ) : 0;

  const discountedItemsTotal = Math.max(0, cartTotal - discountAmount);
  const tax = discountedItemsTotal * 0.05;
  const grandTotal = discountedItemsTotal + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const { data } = await api.get(`/coupons/validate/${couponCode.trim().toUpperCase()}`);
      if (data.success) {
        const minAmount = data.data.minOrderAmount || 0;
        if (cartTotal < minAmount) {
          toast.error(`This coupon requires a minimum order of $${minAmount.toFixed(2)}`);
          return;
        }
        setAppliedCoupon(data.data);
        toast.success(`Coupon "${couponCode.toUpperCase()}" applied successfully!`);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid or expired coupon code';
      toast.error(message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleCheckoutClick = () => {
    if (!user) {
      toast.error('Please log in to proceed to checkout');
      navigate('/login');
      return;
    }
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderItems = cartItems.map(item => ({
      product: item._id || item.id,  // support both _id (MongoDB) and id (frontend normalized)
      name: item.name,
      image: item.img || item.image,
      price: item.price,
      quantity: item.quantity
    }));

    try {
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod,
        mockPaymentOutcome,
        itemsPrice: discountedItemsTotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: grandTotal,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined
      });

      clearCart();
      setOrderSuccess(data.data);
      setCheckoutOpen(false);
      toast.success('Order placed successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'var(--bg-surface)',
            padding: '48px',
            borderRadius: '32px',
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center',
            maxWidth: '560px',
            width: '100%'
          }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(31, 128, 68, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={48} />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', fontFamily: "'Playfair Display', serif" }}>Order Successfully Placed!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '24px', lineHeight: 1.6 }}>
            Thank you for shopping with Amal Market. Your order <strong style={{ color: 'var(--primary)' }}>#{orderSuccess._id.slice(-8).toUpperCase()}</strong> is now being processed.
          </p>

          <div style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '20px', textAlign: 'left', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Deliver to:</span>
              <span style={{ fontWeight: 700 }}>{orderSuccess.shippingAddress.fullName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Address:</span>
              <span>{orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{orderSuccess.paymentMethod.replace(/_/g, ' ')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-soft)', paddingTop: '8px', marginTop: '4px', fontSize: '16px', fontWeight: 800 }}>
              <span style={{ color: 'var(--primary)' }}>Total Paid:</span>
              <span style={{ color: 'var(--primary)' }}>${orderSuccess.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/products" className="btn-outline" style={{ flex: 1, textDecoration: 'none', justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <Link to="/products" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--text-muted)', 
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '16px',
            transition: 'color 0.2s'
          }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
            Your <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Shopping Basket</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '8px' }}>
            You have {cartCount} items in your basket.
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-layout-container">
            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartItems.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.1}>
                  <motion.div 
                    layout
                    whileHover={{ y: -4 }}
                    className="cart-item-row"
                    style={{ 
                      background: 'var(--bg-surface)',
                      padding: '20px',
                      borderRadius: '24px',
                      border: '1px solid var(--border-soft)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Image */}
                    <div style={{ width: '120px', height: '120px', borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-main)' }}>
                      <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Info */}
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {item.cat}
                      </span>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 8px 0' }}>{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          background: 'none', 
                          border: 'none', 
                          color: '#ff4d4d', 
                          fontSize: '13px', 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    {/* Quantity */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '16px',
                      background: 'var(--bg-main)',
                      padding: '10px 16px',
                      borderRadius: '14px',
                      border: '1px solid var(--border-soft)',
                      width: 'fit-content'
                    }}>
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{ fontSize: '16px', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Subtotal</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}

              {/* Trust Badges */}
              <div style={{ 
                marginTop: '24px', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '20px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', background: 'rgba(31, 128, 68, 0.05)', borderRadius: '20px' }}>
                  <ShieldCheck size={24} color="var(--primary)" />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Secure Checkout</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', background: 'rgba(247, 127, 0, 0.05)', borderRadius: '20px' }}>
                  <Truck size={24} color="var(--secondary)" />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Express Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', background: 'rgba(212, 168, 83, 0.05)', borderRadius: '20px' }}>
                  <CreditCard size={24} color="var(--accent-gold)" />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Buyer Protection</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ 
                background: 'var(--bg-surface)', 
                padding: '32px', 
                borderRadius: '30px', 
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>Order Summary</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Items Total ({cartCount})</span>
                    <span style={{ fontWeight: 600 }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                      <span style={{ fontWeight: 700 }}>Promo Discount ({appliedCoupon.code})</span>
                      <span style={{ fontWeight: 700 }}>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shipping Fee</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (5%)</span>
                    <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ 
                  paddingTop: '24px', 
                  borderTop: '1px dashed var(--border-soft)',
                  marginBottom: '32px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Amount</div>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                        ${grandTotal.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                      VAT Included
                    </div>
                  </div>
                </div>

                {/* Coupon */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    PROMO CODE
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Enter code..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={isApplyingCoupon || !!appliedCoupon}
                      style={{ 
                        flex: 1, 
                        background: 'var(--bg-main)', 
                        border: '1px solid var(--border-soft)', 
                        padding: '12px 16px', 
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                    />
                    <button 
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !!appliedCoupon}
                      style={{ 
                        padding: '0 20px', 
                        background: 'var(--text-primary)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        fontWeight: 700, 
                        fontSize: '13px',
                        cursor: (isApplyingCoupon || !!appliedCoupon) ? 'not-allowed' : 'pointer',
                        opacity: (isApplyingCoupon || !!appliedCoupon) ? 0.7 : 1
                      }}
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(31, 128, 68, 0.1)', border: '1px solid rgba(31, 128, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>
                        <CheckCircle2 size={16} /> Code "{appliedCoupon.code}" Applied (-${discountAmount.toFixed(2)})
                      </div>
                      <button 
                        type="button" 
                        onClick={handleRemoveCoupon} 
                        style={{ background: 'none', border: 'none', color: '#ff4d4d', fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleCheckoutClick}
                  className="btn-primary" 
                  style={{ 
                    width: '100%', 
                    padding: '18px', 
                    borderRadius: '16px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '12px',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>

                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px' }}>
                  By clicking checkout, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 0',
            background: 'var(--bg-surface)',
            borderRadius: '40px',
            border: '1px solid var(--border-soft)'
          }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              background: 'var(--bg-main)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 32px auto',
              color: 'var(--text-muted)'
            }}>
              <ShoppingBag size={56} />
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Your basket is empty</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '400px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
              Explore our fresh organic selection and start adding some goodness to your kitchen!
            </p>
            <Link to="/products" className="btn-primary" style={{ padding: '16px 48px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              Go to Market <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: '32px',
                padding: '40px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-2xl)',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setCheckoutOpen(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--bg-main)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>

              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Demo Checkout</span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '4px 0 8px 0' }}>Shipping & Payment</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>This is a testing-only checkout. No real money or payment information is processed.</p>
              </div>

              <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={shippingAddress.fullName}
                      onChange={e => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                      style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Phone Number</label>
                    <input 
                      type="text" 
                      required
                      value={shippingAddress.phone}
                      onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Street Address</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      required
                      value={shippingAddress.address}
                      onChange={e => setShippingAddress({...shippingAddress, address: e.target.value})}
                      style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>City</label>
                    <input 
                      type="text" 
                      required
                      value={shippingAddress.city}
                      onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})}
                      style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Postal Code</label>
                    <input 
                      type="text" 
                      required
                      value={shippingAddress.postalCode}
                      onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                      style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Country</label>
                    <input 
                      type="text" 
                      required
                      value={shippingAddress.country}
                      onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})}
                      style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-soft)', background: 'var(--bg-main)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Payment Method</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { id: 'evc_plus', label: 'Mock EVC Plus', icon: Smartphone },
                      { id: 'credit_card', label: 'Mock Credit Card', icon: CreditCard }
                    ].map(method => (
                      <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '10px', 
                          padding: '20px', 
                          borderRadius: '16px', 
                          border: `2px solid ${paymentMethod === method.id ? 'var(--primary)' : 'var(--border-soft)'}`,
                          background: paymentMethod === method.id ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-main)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: paymentMethod === method.id ? '0 4px 14px rgba(34, 197, 94, 0.15)' : 'none'
                        }}
                      >
                        <method.icon size={24} color={paymentMethod === method.id ? 'var(--primary)' : 'var(--text-muted)'} />
                        <span style={{ fontSize: '14px', fontWeight: paymentMethod === method.id ? 700 : 600, color: paymentMethod === method.id ? 'var(--primary)' : 'var(--text-primary)' }}>{method.label}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '16px', padding: '16px', borderRadius: '14px', background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)' }}>Demo Payment Result</label>
                    <select value={mockPaymentOutcome} onChange={(event) => setMockPaymentOutcome(event.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-soft)', background: 'var(--bg-surface)', fontSize: '14px', color: 'var(--text-primary)' }}>
                      <option value="success">Simulate successful payment</option>
                      <option value="failure">Simulate declined payment</option>
                    </select>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>No card numbers, CVV, mobile-wallet prompts, or real transactions are used.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-soft)', paddingTop: '24px', marginTop: '8px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Grand Total</span>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>${grandTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="btn-primary" 
                    style={{ padding: '16px 36px', borderRadius: '16px', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                  >
                    {submitting ? <Loader2 className="pulse-anim" size={20} /> : <>Place Order <ArrowRight size={20} /></>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
