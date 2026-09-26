import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Building 
} from 'lucide-react';
import { jobApi } from '../api';
import { JobCard } from '../components/JobCard';
import { Loader } from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../config/routes.config';

export const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await jobApi.getAllJobs();
        const jobs = res?.data || [];
        setRecentJobs(jobs.slice(0, 6)); // Show latest 6
      } catch (err) {
        console.error('Failed to load recent jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentJobs();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle.trim()) params.append('title', searchTitle.trim());
    if (searchLocation.trim()) params.append('location', searchLocation.trim());
    navigate(`${ROUTES.JOBS}?${params.toString()}`);
  };

  const handleApply = async (jobId) => {
    try {
      setApplyingId(jobId);
      await jobApi.applyToJob(jobId);
      showToast('Application submitted successfully!', 'success');
      // Refresh
      const res = await jobApi.getAllJobs();
      setRecentJobs((res?.data || []).slice(0, 6));
    } catch (err) {
      showToast(err.customMessage || 'Failed to submit application', 'error');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Next-Gen Hiring & Professional Network</span>
            </div>

            <h1 className="hero-title">
              Find Your Dream Job or <span>Hire Top Talent</span>
            </h1>

            <p className="hero-subtitle">
              Discover high-impact opportunities, connect with innovative companies, and participate in an active community of professionals.
            </p>

            {/* Search Box */}
            <form onSubmit={handleHeroSearch} className="hero-search-card">
              <div className="search-input-group">
                <Search size={18} className="search-input-icon" />
                <input
                  type="text"
                  placeholder="Job title, role, or keyword..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>

              <div className="search-input-group">
                <MapPin size={18} className="search-input-icon" />
                <input
                  type="text"
                  placeholder="City, state, or Remote..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                <span>Find Jobs</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Stats */}
            <div className="stats-banner">
              <div className="stat-item">
                <span className="stat-number">5,000+</span>
                <span className="stat-label">Verified Jobs</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1,200+</span>
                <span className="stat-label">Hiring Companies</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">25,000+</span>
                <span className="stat-label">Active Seekers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Latest Job Openings</h2>
              <p className="section-subtitle">
                Explore handpicked career opportunities updated in real time.
              </p>
            </div>
            <Link to={ROUTES.JOBS} className="btn btn-outline-primary">
              <span>View All Jobs</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading latest opportunities..." />
          ) : recentJobs.length > 0 ? (
            <div className="jobs-grid">
              {recentJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApply={handleApply}
                  isApplying={applyingId === job._id}
                />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Briefcase size={36} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
              <h3>No jobs posted yet</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Be the first employer to post an opening!
              </p>
              <Link to={ROUTES.POST_JOB} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                Post a Job
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="section" style={{ background: '#fff', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <h2 className="section-title">Why Professionals Choose HireMe</h2>
            <p className="section-subtitle">
              A comprehensive portal engineered to make hiring transparent, fast, and collaborative.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>One-Click Applications</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Upload your resume once and apply directly to verified openings with zero repetitive forms.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Building size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Employer Portal</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Post listings, manage job requirements, and reach thousands of motivated candidates effortlessly.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Interactive Community</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Share career advice, showcase project work, post updates, and engage in real-time discussions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA Banner */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div 
              style={{
                background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '1rem' }}>
                  Candidates
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
                  Looking for your next big role?
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
                  Create your profile, upload your resume, and get discovered by top tech and creative companies.
                </p>
              </div>
              <Link to={ROUTES.USER_REGISTER} className="btn" style={{ background: '#fff', color: 'var(--primary)', width: 'fit-content' }}>
                Create Job Seeker Account
              </Link>
            </div>

            <div 
              style={{
                background: 'linear-gradient(135deg, #0f766e, #0d9488)',
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span className="badge badge-secondary" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '1rem' }}>
                  Employers
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
                  Ready to grow your team?
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
                  Publish your listings in minutes and access qualified professionals ready to contribute.
                </p>
              </div>
              <Link to={ROUTES.EMPLOYER_REGISTER} className="btn" style={{ background: '#fff', color: 'var(--secondary)', width: 'fit-content' }}>
                Register as Employer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
