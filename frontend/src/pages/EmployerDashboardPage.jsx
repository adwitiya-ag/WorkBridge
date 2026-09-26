import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  PlusCircle, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Layers,
  FileText,
  ExternalLink,
  Users,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { ROUTES } from '../config/routes.config';

export const EmployerDashboardPage = () => {
  const { user, refreshProfile } = useAuth();
  const [employerData, setEmployerData] = useState(user);
  const [applicants, setApplicants] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'applicants'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [empRes, appRes] = await Promise.allSettled([
          authApi.getEmployerProfile(),
          authApi.getEmployerApplicants()
        ]);

        if (empRes.status === 'fulfilled' && empRes.value?.data) {
          setEmployerData(empRes.value.data);
        }
        if (appRes.status === 'fulfilled' && appRes.value?.data) {
          setApplicants(appRes.value.data);
        }
      } catch (err) {
        console.error('Failed to load employer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loader message="Loading employer workspace..." fullPage />;
  }

  const postedJobs = employerData?.postedJobs || [];

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      {/* Top Banner / Welcome */}
      <div className="profile-header-card" style={{ marginBottom: '2.5rem' }}>
        {employerData?.profileImage ? (
          <img
            src={employerData.profileImage}
            alt={employerData.company || employerData.name}
            className="profile-avatar-large"
          />
        ) : (
          <div className="profile-avatar-large-placeholder">
            {employerData?.company?.charAt(0).toUpperCase() || employerData?.name?.charAt(0).toUpperCase() || 'E'}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{employerData?.company || 'Company Workspace'}</h1>
            <span className="badge badge-secondary">Verified Employer</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', margin: '0.75rem 0 1.25rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
              <Building2 size={16} />
              <span>Representative: {employerData?.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
              <Mail size={16} />
              <span>{employerData?.email}</span>
            </div>
          </div>
        </div>

        <Link to={ROUTES.POST_JOB} className="btn btn-primary" style={{ width: 'fit-content', whiteSpace: 'nowrap' }}>
          <PlusCircle size={18} />
          <span>Post New Job Opening</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {postedJobs.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Active Postings
            </div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {applicants.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Candidate Applicants
            </div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Active
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Hiring Status
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'jobs' ? '3px solid var(--primary)' : '3px solid transparent',
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: activeTab === 'jobs' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Briefcase size={18} />
          <span>Posted Jobs ({postedJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applicants')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'applicants' ? '3px solid var(--primary)' : '3px solid transparent',
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: activeTab === 'applicants' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <UserCheck size={18} />
          <span>Applicants & Resumes ({applicants.length})</span>
        </button>
      </div>

      {/* Tab: Posted Jobs */}
      {activeTab === 'jobs' && (
        <div>
          {postedJobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {postedJobs.map((job) => {
                if (!job || typeof job !== 'object') return null;

                const salary = Number(job.salary).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                });

                const date = job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : null;

                return (
                  <div
                    key={job._id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      padding: '1.5rem',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        {job.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={15} /> {job.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          <DollarSign size={15} /> {salary}/yr
                        </span>
                        {date && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={15} /> Posted {date}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
                        <span>View Public Listing</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No jobs posted yet"
              description="You haven't posted any job listings yet. Create your first opening to start receiving candidate applications."
              actionLabel="Post a Job Now"
              onAction={() => window.location.href = ROUTES.POST_JOB}
            />
          )}
        </div>
      )}

      {/* Tab: Applicants & Resumes */}
      {activeTab === 'applicants' && (
        <div>
          {applicants.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {applicants.map((candidate) => (
                <div
                  key={candidate._id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {candidate.profileImage ? (
                      <img
                        src={candidate.profileImage}
                        alt={candidate.name}
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                      />
                    ) : (
                      <div className="avatar-placeholder" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                        {candidate.name?.charAt(0).toUpperCase() || 'C'}
                      </div>
                    )}

                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{candidate.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Mail size={14} /> {candidate.email}
                        </span>
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Applied
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {candidate.resume ? (
                      <a
                        href={candidate.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                        style={{ display: 'inline-flex', gap: '0.4rem', textDecoration: 'none' }}
                      >
                        <FileText size={16} />
                        <span>View Resume</span>
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="badge badge-neutral">No Resume Uploaded</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No candidate applications yet"
              description="When job seekers apply for your posted job openings, their profiles and full resumes will appear here."
            />
          )}
        </div>
      )}
    </div>
  );
};
