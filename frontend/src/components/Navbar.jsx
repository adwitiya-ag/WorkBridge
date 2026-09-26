import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../config/routes.config';
import { 
  Briefcase, 
  Users, 
  PlusCircle, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  Menu, 
  X,
  FileText
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, isJobSeeker, isEmployer, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    showToast('Logged out successfully', 'success');
    navigate(ROUTES.HOME);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to={ROUTES.HOME} className="navbar-brand">
          <div className="brand-icon">
            <Briefcase size={20} />
          </div>
          <span>Hire<span className="brand-highlight">Me</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          <NavLink 
            to={ROUTES.JOBS} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Briefcase size={18} />
            <span>Explore Jobs</span>
          </NavLink>

          <NavLink 
            to={ROUTES.COMMUNITY} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Community</span>
          </NavLink>

          {isEmployer && (
            <NavLink 
              to={ROUTES.POST_JOB} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <PlusCircle size={18} />
              <span>Post a Job</span>
            </NavLink>
          )}

          {isJobSeeker && (
            <NavLink 
              to={ROUTES.USER_PROFILE} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <FileText size={18} />
              <span>My Applications</span>
            </NavLink>
          )}
        </nav>

        {/* Auth / Profile Area */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu" ref={dropdownRef}>
              <button 
                className="user-avatar-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="user-name-label">{user?.name}</span>
                <ChevronDown size={14} className="text-muted" />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-name">{user?.name}</div>
                    <div className="dropdown-email">{user?.email}</div>
                    <div className="badge badge-primary" style={{ marginTop: '0.4rem', display: 'inline-block' }}>
                      {role === 'JobSeeker' ? 'Job Seeker' : 'Employer'}
                    </div>
                  </div>

                  {isJobSeeker && (
                    <Link 
                      to={ROUTES.USER_PROFILE} 
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>
                  )}

                  {isEmployer && (
                    <>
                      <Link 
                        to={ROUTES.EMPLOYER_DASHBOARD} 
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        <span>Employer Dashboard</span>
                      </Link>
                      <Link 
                        to={ROUTES.POST_JOB} 
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <PlusCircle size={16} />
                        <span>Post New Job</span>
                      </Link>
                    </>
                  )}

                  <button className="dropdown-item danger-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to={ROUTES.USER_LOGIN} className="btn btn-outline btn-sm">
                Job Seeker
              </Link>
              <Link to={ROUTES.EMPLOYER_LOGIN} className="btn btn-primary btn-sm">
                For Employers
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid var(--border-light)', padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link 
              to={ROUTES.JOBS} 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Briefcase size={18} />
              <span>Explore Jobs</span>
            </Link>
            <Link 
              to={ROUTES.COMMUNITY} 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users size={18} />
              <span>Community</span>
            </Link>
            {isEmployer && (
              <>
                <Link 
                  to={ROUTES.POST_JOB} 
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlusCircle size={18} />
                  <span>Post a Job</span>
                </Link>
                <Link 
                  to={ROUTES.EMPLOYER_DASHBOARD} 
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  <span>Employer Dashboard</span>
                </Link>
              </>
            )}
            {isJobSeeker && (
              <Link 
                to={ROUTES.USER_PROFILE} 
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>My Profile</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
