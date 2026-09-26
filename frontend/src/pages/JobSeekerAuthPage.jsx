import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  ArrowRight, 
  Sparkles,
  CheckCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../config/routes.config';

export const JobSeekerAuthPage = ({ defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginJobSeeker, registerJobSeeker } = useAuth();
  const { showToast } = useToast();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      await loginJobSeeker(loginForm);
      showToast('Welcome back!', 'success');
      const destination = location.state?.from?.pathname || ROUTES.JOBS;
      navigate(destination, { replace: true });
    } catch (err) {
      showToast(err.customMessage || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      showToast('Please fill out all text fields', 'error');
      return;
    }

    if (!profileImageFile) {
      showToast('Please select a profile image', 'warning');
      return;
    }

    if (!resumeFile) {
      showToast('Please select a resume file (PDF or document)', 'warning');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', registerForm.name);
      formData.append('email', registerForm.email);
      formData.append('password', registerForm.password);
      formData.append('profileImage', profileImageFile);
      formData.append('resume', resumeFile);

      await registerJobSeeker(formData);
      showToast('Account created successfully! Please sign in with your credentials.', 'success');
      setActiveTab('login');
      setLoginForm({ email: registerForm.email, password: '' });
    } catch (err) {
      showToast(err.customMessage || 'Registration failed. Please check your details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            <User size={14} /> Job Seeker Portal
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {activeTab === 'login' ? 'Welcome Back' : 'Create Candidate Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {activeTab === 'login'
              ? 'Sign in to access your applications and applied jobs.'
              : 'Join HireMe to explore jobs and apply in one click.'}
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
              <label htmlFor="login-email">Email Address</label>
              <div className="search-input-group">
                <Mail size={18} className="search-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="search-input-group">
                <Lock size={18} className="search-input-icon" />
                <input
                  id="login-password"
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
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem' }}
              disabled={loading}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Candidate'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Are you an employer? <Link to={ROUTES.EMPLOYER_LOGIN} style={{ fontWeight: 600 }}>Employer Sign In</Link>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name *</label>
              <div className="search-input-group">
                <User size={18} className="search-input-icon" />
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Jane Doe"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address *</label>
              <div className="search-input-group">
                <Mail size={18} className="search-input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="jane.doe@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password *</label>
              <div className="search-input-group">
                <Lock size={18} className="search-input-icon" />
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Profile Image File Upload */}
            <div className="form-group">
              <label>Profile Picture *</label>
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
                  required
                />
              </div>
            </div>

            {/* Resume File Upload */}
            <div className="form-group">
              <label>Resume (PDF / DOC) *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <FileText size={20} />
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleResumeChange}
                  className="form-control"
                  style={{ padding: '0.45rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem' }}
              disabled={loading}
            >
              <span>{loading ? 'Creating Account...' : 'Complete Candidate Registration'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Are you an employer? <Link to={ROUTES.EMPLOYER_REGISTER} style={{ fontWeight: 600 }}>Register Company</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
