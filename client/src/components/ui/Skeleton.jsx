import React from 'react';
import './skeleton.css';

export const Skeleton = ({ className, style }) => {
  return (
    <div className={`skeleton-base ${className || ''}`} style={style} />
  );
};

export const SkeletonCard = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="skeleton-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
        <Skeleton className="skeleton-card-img" style={{ width: '180px', height: '120px', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Skeleton style={{ width: '100px', height: '12px' }} />
          <Skeleton className="skeleton-card-title" style={{ width: '50%' }} />
          <Skeleton style={{ width: '80%', height: '16px' }} />
          <div className="skeleton-card-footer">
            <Skeleton className="skeleton-card-price" />
            <Skeleton className="skeleton-card-btn" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-card">
      <Skeleton className="skeleton-card-img" />
      <Skeleton style={{ width: '80px', height: '12px', marginTop: '4px' }} />
      <Skeleton className="skeleton-card-title" />
      <Skeleton className="skeleton-card-text" />
      <div className="skeleton-card-footer">
        <Skeleton className="skeleton-card-price" />
        <Skeleton className="skeleton-card-btn" />
      </div>
    </div>
  );
};

export const SkeletonRow = () => {
  return (
    <div className="skeleton-row">
      <Skeleton className="skeleton-row-avatar" />
      <div className="skeleton-row-content">
        <Skeleton className="skeleton-row-title" />
        <Skeleton className="skeleton-row-subtitle" />
      </div>
      <Skeleton className="skeleton-row-action" />
    </div>
  );
};

export const SkeletonGrid = ({ count = 8, viewMode = 'grid' }) => {
  return (
    <div className={viewMode === 'grid' ? "skeleton-grid" : ""} style={{ display: viewMode === 'grid' ? 'grid' : 'flex', flexDirection: viewMode === 'grid' ? 'unset' : 'column', gap: '24px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} viewMode={viewMode} />
      ))}
    </div>
  );
};
