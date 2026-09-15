import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/cart';
import { useNavigate } from 'react-router-dom';

const WishlistDrawer = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const navigate = useNavigate();

  const handleTransferToCart = (item) => {
    addToCart({ id: item.id, name: item.name, price: item.price, img: item.img, cat: item.cat });
    toggleWishlist(item); // Remove from wishlist after moving to basket
  };

  const handleExplore = () => {
    onClose();
    navigate('/products');
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
                  background: 'rgba(239, 68, 68, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#ef4444'
                }}>
                  <Heart size={20} fill="#ef4444" />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Your Wishlist</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{wishlist.length} saved items</p>
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
              {wishlist.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {wishlist.map((item) => (
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
                            onClick={() => toggleWishlist(item)}
                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '4px' }}
                            title="Remove from wishlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{item.cat || 'Organic'}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                            ${parseFloat(item.price || 0).toFixed(2)}
                          </span>
                          <button 
                            onClick={() => handleTransferToCart(item)}
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <ShoppingBag size={14} /> Move to Cart
                          </button>
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
                    <Heart size={40} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Your wishlist is empty</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                    Save your favorite items here to purchase them later.
                  </p>
                  <button 
                    onClick={handleExplore}
                    className="btn-primary"
                    style={{ padding: '12px 32px' }}
                  >
                    Explore Products
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
