import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Image as ImageIcon, 
  Send, 
  Sparkles, 
  X, 
  MessageSquare, 
  Users 
} from 'lucide-react';
import { communityApi } from '../api';
import { PostCard } from '../components/PostCard';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../config/routes.config';

export const CommunityPage = () => {
  const { user, isAuthenticated, isJobSeeker, isEmployer } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [likingId, setLikingId] = useState(null);

  const fileInputRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const res = await communityApi.getPosts();
      setPosts(res?.data || []);
    } catch (err) {
      console.error('Failed to load community posts:', err);
      showToast('Failed to load community feed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG/JPG/WEBP)', 'warning');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) {
      showToast('Please enter some text or attach an image', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('content', content);
      if (selectedImage) {
        formData.append('postImage', selectedImage);
      }

      await communityApi.createPost(formData);
      showToast('Post shared with the community!', 'success');
      setContent('');
      handleRemoveImage();
      await fetchPosts();
    } catch (err) {
      showToast(err.customMessage || 'Failed to publish post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      showToast('Please sign in to like posts', 'info');
      return;
    }

    try {
      setLikingId(postId);
      const res = await communityApi.toggleLike(postId);
      // Update the post in state directly
      const updatedPost = res?.data;
      if (updatedPost) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, likes: updatedPost.likes } : p))
        );
      } else {
        await fetchPosts();
      }
    } catch (err) {
      showToast(err.customMessage || 'Failed to update like', 'error');
    } finally {
      setLikingId(null);
    }
  };

  return (
    <div className="container community-layout">
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
          <Users size={14} /> Professional Network
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Community Feed</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem' }}>
          Connect, discuss career advice, share updates, and discover opportunities together.
        </p>
      </div>

      {/* Create Post Card */}
      {isAuthenticated ? (
        <div className="create-post-card">
          <form onSubmit={handleCreatePost}>
            <div className="create-post-header">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Share an update, {user?.name}
              </span>
            </div>

            <textarea
              className="create-post-textarea"
              placeholder="What's happening in your career or company? Share tips, openings, or ask questions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />

            {imagePreview && (
              <div style={{ position: 'relative', marginTop: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '250px', background: 'var(--bg-alt)' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'cover', display: 'block' }} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="create-post-actions">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="post-image-file"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline btn-sm"
                >
                  <ImageIcon size={16} />
                  <span>{selectedImage ? 'Change Image' : 'Add Image'}</span>
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submitting || (!content.trim() && !selectedImage)}
              >
                <Send size={16} />
                <span>{submitting ? 'Posting...' : 'Post'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '2.5rem' }}>
          <MessageSquare size={32} style={{ color: 'var(--primary)', margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Join the Discussion</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0.5rem 0 1.25rem' }}>
            Sign in as a Job Seeker or Employer to share thoughts, ask questions, and like posts.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <Link to={ROUTES.USER_LOGIN} className="btn btn-primary btn-sm">Candidate Sign In</Link>
            <Link to={ROUTES.EMPLOYER_LOGIN} className="btn btn-outline btn-sm">Employer Sign In</Link>
          </div>
        </div>
      )}

      {/* Feed List */}
      <div>
        {loading ? (
          <Loader message="Loading community feed..." />
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              isLiking={likingId === post._id}
            />
          ))
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No posts yet"
            description="Be the first to start a conversation in the HireMe community!"
          />
        )}
      </div>
    </div>
  );
};
