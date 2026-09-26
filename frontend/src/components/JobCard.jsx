import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const JobCard = ({ job, onApply, isApplying = false }) => {
  const { user, isJobSeeker } = useAuth();

  // Check if current user has already applied to this job
  const hasApplied = isJobSeeker && user?.appliedJobs?.some(
    (applied) => (applied._id || applied) === job._id
  );

  const formattedSalary = Number(job?.salary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const formattedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="job-card">
      <div>
        <div className="job-card-header">
          <div>
            <h3 className="job-card-title">{job.title}</h3>
            <div className="job-company-badge">
              <Building2 size={16} />
              <span>{job.company}</span>
            </div>
          </div>
          {hasApplied && (
            <span className="badge badge-success">
              <CheckCircle size={12} /> Applied
            </span>
          )}
        </div>

        <div className="job-meta-list">
          <div className="job-meta-item">
            <MapPin size={14} />
            <span>{job.location}</span>
          </div>
          <div className="job-meta-item">
            <DollarSign size={14} />
            <span>{formattedSalary}/yr</span>
          </div>
          {formattedDate && (
            <div className="job-meta-item">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {job.description && (
          <p className="job-description-preview">{job.description}</p>
        )}
      </div>

      <div className="job-card-footer">
        <div className="job-salary">{formattedSalary} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/yr</span></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
            Details
          </Link>
          {isJobSeeker && (
            <button
              onClick={() => onApply && onApply(job._id)}
              disabled={hasApplied || isApplying}
              className={`btn btn-sm ${hasApplied ? 'btn-outline' : 'btn-primary'}`}
            >
              {hasApplied ? 'Applied' : isApplying ? 'Applying...' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
