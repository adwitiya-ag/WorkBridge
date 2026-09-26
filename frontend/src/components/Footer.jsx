import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart } from 'lucide-react';
import { ROUTES } from '../config/routes.config';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-title">
              <Briefcase size={22} style={{ color: 'var(--primary)' }} />
              <span>Hire<span style={{ color: 'var(--primary)' }}>Me</span></span>
            </div>
            <p className="footer-desc">
              Connecting talented candidates with forward-thinking companies. Explore thousands of career opportunities and build professional networks.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">For Candidates</h4>
            <ul className="footer-links">
              <li><Link to={ROUTES.JOBS} className="footer-link">Browse Jobs</Link></li>
              <li><Link to={ROUTES.USER_LOGIN} className="footer-link">Candidate Login</Link></li>
              <li><Link to={ROUTES.USER_REGISTER} className="footer-link">Create Account</Link></li>
              <li><Link to={ROUTES.COMMUNITY} className="footer-link">Community Network</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">For Employers</h4>
            <ul className="footer-links">
              <li><Link to={ROUTES.POST_JOB} className="footer-link">Post a Job</Link></li>
              <li><Link to={ROUTES.EMPLOYER_LOGIN} className="footer-link">Employer Portal</Link></li>
              <li><Link to={ROUTES.EMPLOYER_REGISTER} className="footer-link">Register Company</Link></li>
              <li><Link to={ROUTES.EMPLOYER_DASHBOARD} className="footer-link">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to={ROUTES.HOME} className="footer-link">About HireMe</Link></li>
              <li><Link to={ROUTES.COMMUNITY} className="footer-link">Discussions</Link></li>
              <li><span className="footer-link" style={{ cursor: 'pointer' }}>Privacy Policy</span></li>
              <li><span className="footer-link" style={{ cursor: 'pointer' }}>Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HireMe Portal. Built with care for seamless hiring experiences.</p>
        </div>
      </div>
    </footer>
  );
};
