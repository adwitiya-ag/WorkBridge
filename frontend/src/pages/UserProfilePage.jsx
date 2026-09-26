import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  FileText, 
  ExternalLink, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { ROUTES } from '../config/routes.config';

export const UserProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await authApi.getUserProfile();
        if (res?.data) {
          setProfileData(res.data);
        }
      } catch (err) {
        console.error('Failed to reload profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <Loader message="Loading profile and applications..." fullPage />;
  }

  const appliedJobs = profileData?.appliedJobs || [];

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      {/* Profile Header */}
      <div className="profile-header-card">
        {profileData?.profileImage ? (
          <img
            src={profileData.profileImage}
            alt={profileData.name}
            className="profile-avatar-large"
          />
        ) : (
          <div className="profile-avatar-large-placeholder">
            {profileData?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{profileData?.name}</h1>
            <span className="badge badge-primary">Candidate Profile</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', margin: '0.75rem 0 1.25rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
              <Mail size={16} />
              <span>{profileData?.email}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
              <Briefcase size={16} />
              <span>{appliedJobs.length} {appliedJobs.length === 1 ? 'Application' : 'Applications'} Submitted</span>
            </div>
          </div>

          {profileData?.resume ? (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href={profileData.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                <FileText size={16} />
                <span>View Uploaded Resume</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No resume uploaded
            </span>
          )}
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Job Applications</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Track all positions you have applied for through HireMe.
            </p>
          </div>

          <Link to={ROUTES.JOBS} className="btn btn-outline-primary btn-sm">
            <span>Explore More Jobs</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {appliedJobs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appliedJobs.map((job) => {
              if (!job || typeof job !== 'object') return null;

              const salary = Number(job.salary).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              });

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
                    padding: '1.25rem 1.75rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{job.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontWeight: 600 }}>
                        <Building2 size={15} /> {job.company}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={15} /> {job.location}
                      </span>
                      {job.salary && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                          <DollarSign size={15} /> {salary}/yr
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="badge badge-success">
                      <CheckCircle2 size={14} /> Applied
                    </span>
                    <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
                      View Position
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No applications yet"
            description="You haven't applied to any jobs yet. Browse current openings and submit your application with a single click!"
            actionLabel="Browse Available Jobs"
            onAction={() => window.location.href = ROUTES.JOBS}
          />
        )}
      </div>
    </div>
  );
};
