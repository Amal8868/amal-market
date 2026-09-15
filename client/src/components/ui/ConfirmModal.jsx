import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmVariant = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="admin-modal-overlay" style={{ zIndex: 9999 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="admin-modal-content"
          style={{ maxWidth: '440px', width: '90%', padding: '28px', borderRadius: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        >
          <button onClick={onClose} className="admin-modal-close">
            <X size={18} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              {title || 'Are you sure?'}
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              {message || 'This action cannot be undone.'}
            </p>

            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-soft)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: confirmVariant === 'danger' ? '#ef4444' : 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;

