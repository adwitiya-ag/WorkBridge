import React from 'react';

export const Loader = ({ message = 'Loading...', fullPage = false }) => {
  return (
    <div
      className="page-loader"
      style={{
        minHeight: fullPage ? '80vh' : '40vh',
      }}
    >
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};
