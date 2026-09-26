import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowLeft, 
  CheckCircle, 
  Briefcase, 
  Share2, 
  AlertCircle 
} from 'lucide-react';
import { jobApi } from '../api';
import { Loader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../config/routes.config';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isJobSeeker, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobApi.getJobById(id);
        setJob(res?.data || null);
      } catch (err) {
        console.error('Failed to load job details:', err);
        showToast('Job listing not found', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, showToast]);

  const hasApplied = isJobSeeker && user?.appliedJobs?.some(
    (applied) => (applied._id || applied) === job?._id
  );

  const handleApply = async () => {
    if (!isAuthenticated) {
      showToast('Please login as a Job Seeker to apply', 'info');
      navigate(ROUTES.USER_LOGIN);
      return;
    }

    if (!isJobSeeker) {
      showToast('Only Job Seekers can apply to positions', 'warning');
      return;
    }

    try {
      setApplying(true);
      await jobApi.applyToJob(job._id);
      showToast('Your application has been successfully submitted!', 'success');
      await refreshProfile();
    } catch (err) {
      showToast(err.customMessage || 'Failed to submit application', 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Job link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return <Loader message="Loading position details..." fullPage />;
  }

  if (!job) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Job listing not found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          This job may have been closed or removed.
        </p>
        <Link to={ROUTES.JOBS} className="btn btn-primary">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const formattedSalary = Number(job?.salary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const formattedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="container">
      <div style={{ paddingTop: '2rem' }}>
        <Link to={ROUTES.JOBS} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to all listings</span>
        </Link>
      </div>

      <div className="job-detail-layout">
        {/* Main Job Body */}
        <div className="job-detail-card">
          <div className="job-detail-header">
            <h1 className="job-detail-title">{job.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              <div className="job-company-badge" style={{ fontSize: '1.1rem' }}>
                <Building2 size={20} />
                <span>{job.company}</span>
              </div>

              <div className="job-meta-item">
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>

              {formattedDate && (
                <div className="job-meta-item">
                  <Calendar size={16} />
                  <span>Posted {formattedDate}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              About the Role
            </h2>
            <div style={{ fontSize: '1.02rem', lineHeight: '1.8', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
              {job.description || 'No additional description provided for this job opening.'}
            </div>
          </div>
        </div>

        {/* Sidebar Action Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="job-sidebar-card">
            <div className="sidebar-salary-box">
              <span className="sidebar-salary-label">Estimated Compensation</span>
              <div className="sidebar-salary-value">{formattedSalary} <span style={{ fontSize: '1rem', fontWeight: 500 }}>/ year</span></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {hasApplied ? (
                <div 
                  style={{
                    background: 'var(--success-light)',
                    color: 'var(--success)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle size={20} />
                  <span>You Have Applied</span>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  {applying ? 'Submitting Application...' : 'Apply Now'}
                </button>
              )}

              <button onClick={handleShare} className="btn btn-outline" style={{ width: '100%' }}>
                <Share2 size={18} />
                <span>Share Job</span>
              </button>
            </div>

            {!isAuthenticated && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Have an account? <Link to={ROUTES.USER_LOGIN}>Sign in</Link> to apply instantly with your saved resume.
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Hiring Company
            </h4>
            <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{job.company}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Location: {job.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
