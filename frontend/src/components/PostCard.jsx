import React from 'react';
import { Heart, Building2, User, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PostCard = ({ post, onLike, isLiking = false }) => {
  const { user, isAuthenticated } = useAuth();

  const authorName = post?.postedBy?.name || (typeof post?.postedBy === 'string' ? 'Community Member' : 'Anonymous');
  const authorRole = post?.postedByRole || 'Member';
  const authorCompany = post?.postedBy?.company;
  const authorAvatar = post?.postedBy?.profileImage;

  // Check if current user has liked this post
  const isLiked = isAuthenticated && post?.likes?.some(
    (like) => (like.likedBy?._id || like.likedBy) === user?._id
  );

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="post-author-info">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="post-author-name">{authorName}</span>
              <span className={`badge ${authorRole === 'Employer' ? 'badge-primary' : 'badge-neutral'}`}>
                {authorRole === 'Employer' ? 'Employer' : 'Job Seeker'}
              </span>
              {authorCompany && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  at {authorCompany}
                </span>
              )}
            </div>
            <div className="post-time" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="post-content">{post.content}</div>

      {post.postImage && (
        <div className="post-image-container">
          <img src={post.postImage} alt="Post attachment" className="post-image" loading="lazy" />
        </div>
      )}

      <footer className="post-footer">
        <button
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike && onLike(post._id)}
          disabled={!isAuthenticated || isLiking}
          title={!isAuthenticated ? 'Sign in to like' : isLiked ? 'Unlike' : 'Like'}
        >
          <Heart size={18} />
          <span>{post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}</span>
        </button>
      </footer>
    </article>
  );
};
