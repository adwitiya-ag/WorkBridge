import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Briefcase,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../config/routes.config';

export const EmployerAuthPage = ({ defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginEmployer, registerEmployer } = useAuth();
  const { showToast } = useToast();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', company: '' });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      showToast('Please enter employer email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      await loginEmployer(loginForm);
      showToast('Employer session active', 'success');
      const destination = location.state?.from?.pathname || ROUTES.EMPLOYER_DASHBOARD;
      navigate(destination, { replace: true });
    } catch (err) {
      showToast(err.customMessage || 'Invalid employer credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.company) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', registerForm.name);
      formData.append('email', registerForm.email);
      formData.append('password', registerForm.password);
      formData.append('company', registerForm.company);
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      await registerEmployer(formData);
      showToast('Employer account registered successfully! Please sign in.', 'success');
      setActiveTab('login');
      setLoginForm({ email: registerForm.email, password: '' });
    } catch (err) {
      showToast(err.customMessage || 'Employer registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>
            <Building2 size={14} /> Employer Portal
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {activeTab === 'login' ? 'Employer Sign In' : 'Register Your Company'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {activeTab === 'login'
              ? 'Access your hiring dashboard and manage job listings.'
              : 'Create an employer account to post openings and source talent.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="emp-login-email">Company / Work Email</label>
              <div className="search-input-group">
                <Mail size={18} className="search-input-icon" />
                <input
                  id="emp-login-email"
                  type="email"
                  placeholder="recruiter@company.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emp-login-password">Password</label>
              <div className="search-input-group">
                <Lock size={18} className="search-input-icon" />
                <input
                  id="emp-login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1.25rem' }}
              disabled={loading}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Employer'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Looking for a job? <Link to={ROUTES.USER_LOGIN} style={{ fontWeight: 600 }}>Candidate Sign In</Link>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="emp-reg-name">Representative Full Name *</label>
              <div className="search-input-group">
                <User size={18} className="search-input-icon" />
                <input
                  id="emp-reg-name"
                  type="text"
                  placeholder="e.g. John Smith"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emp-reg-company">Company / Organization Name *</label>
              <div className="search-input-group">
                <Building2 size={18} className="search-input-icon" />
                <input
                  id="emp-reg-company"
                  type="text"
                  placeholder="e.g. Acme Technologies Inc."
                  value={registerForm.company}
                  onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emp-reg-email">Work Email *</label>
              <div className="search-input-group">
                <Mail size={18} className="search-input-icon" />
                <input
                  id="emp-reg-email"
                  type="email"
                  placeholder="recruiting@acme.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emp-reg-password">Password *</label>
              <div className="search-input-group">
                <Lock size={18} className="search-input-icon" />
                <input
                  id="emp-reg-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Profile Image / Company Logo Upload */}
            <div className="form-group">
              <label>Company Logo / Representative Photo (Optional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {profilePreview ? (
                  <img src={profilePreview} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <ImageIcon size={20} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="form-control"
                  style={{ padding: '0.45rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1.25rem' }}
              disabled={loading}
            >
              <span>{loading ? 'Registering...' : 'Complete Employer Registration'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Looking for a job? <Link to={ROUTES.USER_REGISTER} style={{ fontWeight: 600 }}>Create Candidate Profile</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
