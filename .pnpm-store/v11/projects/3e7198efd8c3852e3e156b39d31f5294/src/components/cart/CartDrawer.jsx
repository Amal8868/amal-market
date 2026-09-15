import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Maximize2 } from 'lucide-react';
import { useCart } from '../../context/cart';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 2000
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '450px',
              background: 'var(--bg-surface, #ffffff)',
              backgroundColor: 'var(--bg-surface, #ffffff)',
              boxShadow: '-10px 0 50px rgba(0,0,0,0.3)',
              zIndex: 2200,
              display: 'flex',
              flexDirection: 'column',
              outline: 'none',
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '24px', 
              borderBottom: '1px solid var(--border-soft)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-surface, #ffffff)',
              zIndex: 5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  background: 'var(--primary-light)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Your Basket</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{cartCount} items</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  border: 'none', 
                  background: 'var(--bg-main)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '24px',
              background: 'var(--bg-surface, #ffffff)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {cartItems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {cartItems.map((item) => (
                    <motion.div 
                      layout
                      key={item.id}
                      style={{ 
                        display: 'flex', 
                        gap: '16px',
                        background: 'var(--bg-main, #fafafa)',
                        padding: '16px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-soft)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: 'white' }}>
                        <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{item.cat}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            background: 'var(--bg-surface)',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-soft)'
                          }}>
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ fontSize: '14px', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: 'var(--bg-main)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: 'var(--text-muted)'
                  }}>
                    <ShoppingBag size={40} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Your basket is empty</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                    Looks like you haven't added any premium products yet.
                  </p>
                  <button 
                    onClick={onClose}
                    className="btn-primary"
                    style={{ padding: '12px 32px' }}
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div style={{ 
                padding: '24px', 
                borderTop: '1px solid var(--border-soft)',
                background: 'var(--bg-surface)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Subtotal</span>
                  <span style={{ fontWeight: 700, fontSize: '16px' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Shipping</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px' }}>FREE</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '24px',
                  paddingTop: '12px',
                  borderTop: '1px dashed var(--border-soft)'
                }}>
                  <span style={{ fontWeight: 800, fontSize: '18px' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: '22px', color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={handleCheckout}
                  style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                >
                  Checkout Now <ArrowRight size={18} />
                </button>
                <button 
                  onClick={handleCheckout}
                  style={{ 
                    width: '100%', 
                    marginTop: '12px', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Maximize2 size={14} /> View Full Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
