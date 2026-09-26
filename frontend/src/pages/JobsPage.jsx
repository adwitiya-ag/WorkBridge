import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, RotateCcw, Briefcase } from 'lucide-react';
import { jobApi } from '../api';
import { JobCard } from '../components/JobCard';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const { refreshProfile } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  // Form search states
  const [titleQuery, setTitleQuery] = useState(searchParams.get('title') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');

  const fetchJobs = useCallback(async (title = '', location = '') => {
    setLoading(true);
    try {
      if (title.trim() || location.trim()) {
        const res = await jobApi.searchJobs({ title: title.trim(), location: location.trim() });
        setJobs(res?.data || []);
      } else {
        const res = await jobApi.getAllJobs();
        setJobs(res?.data || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      showToast('Failed to load job listings', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const initialTitle = searchParams.get('title') || '';
    const initialLoc = searchParams.get('location') || '';
    setTitleQuery(initialTitle);
    setLocationQuery(initialLoc);
    fetchJobs(initialTitle, initialLoc);
  }, [searchParams, fetchJobs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (titleQuery) params.title = titleQuery;
    if (locationQuery) params.location = locationQuery;
    setSearchParams(params);
    fetchJobs(titleQuery, locationQuery);
  };

  const handleResetFilters = () => {
    setTitleQuery('');
    setLocationQuery('');
    setSearchParams({});
    fetchJobs('', '');
  };

  const handleApply = async (jobId) => {
    try {
      setApplyingId(jobId);
      await jobApi.applyToJob(jobId);
      showToast('Successfully applied for this position!', 'success');
      await refreshProfile();
      // Re-fetch to update state
      fetchJobs(titleQuery, locationQuery);
    } catch (err) {
      showToast(err.customMessage || 'Failed to submit application', 'error');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div>
      {/* Header & Filter Bar */}
      <section className="jobs-page-header">
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Find Available Positions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Browse open opportunities and apply with your verified resume.
          </p>

          <form onSubmit={handleSearchSubmit} className="search-filter-bar">
            <div className="search-input-group" style={{ flex: '1 1 280px' }}>
              <Search size={18} className="search-input-icon" />
              <input
                type="text"
                placeholder="Search job title, skills, or company..."
                value={titleQuery}
                onChange={(e) => setTitleQuery(e.target.value)}
              />
            </div>

            <div className="search-input-group" style={{ flex: '1 1 240px' }}>
              <MapPin size={18} className="search-input-icon" />
              <input
                type="text"
                placeholder="Location (e.g. Remote, New York)..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Filter size={16} />
              <span>Search</span>
            </button>

            {(titleQuery || locationQuery) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-outline"
                title="Reset filters"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Listings Section */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
            Showing {jobs.length} {jobs.length === 1 ? 'position' : 'positions'}
          </div>
        </div>

        {loading ? (
          <Loader message="Searching available jobs..." />
        ) : jobs.length > 0 ? (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApply={handleApply}
                isApplying={applyingId === job._id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No matching jobs found"
            description="We couldn't find any job postings matching your current criteria. Try adjusting your search keywords or location."
            actionLabel="View All Jobs"
            onAction={handleResetFilters}
          />
        )}
      </section>
    </div>
  );
};
