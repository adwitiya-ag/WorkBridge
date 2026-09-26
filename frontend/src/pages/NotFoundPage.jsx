import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../config/routes.config';

export const NotFoundPage = () => {
  return (
    <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
      <div
        style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}
      >
        <HelpCircle size={40} />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to={ROUTES.HOME} className="btn btn-primary">
        <ArrowLeft size={16} />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
