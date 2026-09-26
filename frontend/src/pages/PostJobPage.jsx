import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building, MapPin, DollarSign, FileText, Send, Sparkles } from 'lucide-react';
import { jobApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../config/routes.config';

export const PostJobPage = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    location: '',
    salary: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.location || !formData.salary || !formData.description) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await jobApi.postJob({
        ...formData,
        salary: Number(formData.salary),
      });

      showToast('Job posted successfully!', 'success');
      await refreshProfile();
      navigate(ROUTES.EMPLOYER_DASHBOARD);
    } catch (err) {
      showToast(err.customMessage || 'Failed to post job. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 0', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={14} /> Employer Portal
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Create New Job Listing</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
          Publish open roles to attract qualified candidates across industries.
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <div className="search-input-group">
              <Briefcase size={18} className="search-input-icon" />
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Senior Full Stack Engineer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="company">Company Name *</label>
              <div className="search-input-group">
                <Building size={18} className="search-input-icon" />
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <div className="search-input-group">
                <MapPin size={18} className="search-input-icon" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. San Francisco, CA / Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="salary">Annual Salary (USD) *</label>
            <div className="search-input-group">
              <DollarSign size={18} className="search-input-icon" />
              <input
                id="salary"
                name="salary"
                type="number"
                min="1000"
                step="1000"
                placeholder="e.g. 125000"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description & Requirements *</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={8}
              placeholder="Outline the responsibilities, required qualifications, tech stack, and benefits..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Send size={18} />
              <span>{submitting ? 'Publishing...' : 'Publish Job Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
