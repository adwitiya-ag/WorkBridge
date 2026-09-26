import React from 'react';
import { SearchX, Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are currently no records to display.',
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        margin: '2rem 0',
      }}
    >
      <div
        style={{
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          background: 'var(--bg-alt)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
