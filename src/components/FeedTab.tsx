'use client';

import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Send, Image, Video, Smile, Tag, TrendingUp, MessageCircle } from 'lucide-react';
import { createPost, likePost, addComment } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface Comment {
  id: number;
  postId: number;
  authorName: string;
  content: string;
  createdAt: Date;
}

interface Post {
  id: number;
  authorName: string;
  authorRole: string;
  content: string;
  likesCount: number;
  createdAt: Date;
  comments: Comment[];
}

interface FeedTabProps {
  posts: Post[];
  currentUser: {
    name: string;
    role: 'candidate' | 'employer';
  };
}

export default function FeedTab({ posts, currentUser }: FeedTabProps) {
  const router = useRouter();
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await createPost({
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: newPostContent,
    });

    if (result.success) {
      setNewPostContent('');
      router.refresh();
    } else {
      alert('Không thể tạo bài viết. Vui lòng thử lại!');
    }
    setIsSubmitting(false);
  };

  const handleLikePost = async (postId: number) => {
    const result = await likePost(postId);
    if (result.success) {
      router.refresh();
    }
  };

  const handleCommentSubmit = async (postId: number, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    const result = await addComment({
      postId,
      authorName: currentUser.name,
      content: commentText,
    });

    if (result.success) {
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      router.refresh();
    }
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  // Helper to format date relative
  const formatRelativeTime = (dateInput: Date) => {
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="container">
      <div className="feed-layout">
        <div className="feed-main">
          {/* Post Creator */}
          <div className="composer-card">
            <div className="composer-header">
              <div className="avatar-circle">
                {currentUser.name.charAt(0)}
              </div>
              <textarea
                className="composer-input"
                placeholder={
                  currentUser.role === 'employer'
                    ? 'Đăng tin tuyển dụng mới hoặc chia sẻ thông tin...'
                    : 'Hôm nay bạn muốn chia sẻ điều gì về sự nghiệp của mình?'
                }
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>
            <div className="composer-footer">
              <div className="composer-options">
                <button type="button" className="composer-opt-btn">
                  <Image size={16} className="text-secondary" style={{ color: 'var(--success)' }} />
                  Ảnh/Video
                </button>
                <button type="button" className="composer-opt-btn">
                  <Tag size={16} className="text-secondary" style={{ color: 'var(--secondary)' }} />
                  Thẻ
                </button>
                <button type="button" className="composer-opt-btn">
                  <Smile size={16} className="text-secondary" style={{ color: 'var(--warning)' }} />
                  Cảm xúc
                </button>
              </div>
              <button
                type="submit"
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isSubmitting}
                className="composer-submit"
              >
                {isSubmitting ? 'Đang đăng...' : 'Đăng tin'}
              </button>
            </div>
          </div>

          {/* Posts List */}
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-meta">
                  <div className="avatar-circle">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="post-author-name">{post.authorName}</div>
                    <div className="post-author-title">
                      <span className={`badge ${post.authorRole === 'recruiter' ? 'success' : 'primary'}`} style={{
                        backgroundColor: post.authorRole === 'recruiter' ? 'var(--success-bg)' : 'var(--primary-light)',
                        color: post.authorRole === 'recruiter' ? 'var(--success)' : 'var(--primary)',
                        padding: '2px 6px',
                        fontSize: '10px'
                      }}>
                        {post.authorRole === 'recruiter' ? 'Nhà tuyển dụng' : 'Ứng viên'}
                      </span>
                      • {formatRelativeTime(post.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="post-content">{post.content}</div>

              <div className="post-actions">
                <button
                  type="button"
                  className="post-action-btn"
                  onClick={() => handleLikePost(post.id)}
                >
                  <ThumbsUp size={16} />
                  Thích ({post.likesCount})
                </button>
                <button type="button" className="post-action-btn">
                  <MessageSquare size={16} />
                  Bình luận ({post.comments?.length || 0})
                </button>
              </div>

              {/* Comment Section */}
              <div className="comments-section">
                {post.comments?.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      {comment.authorName.charAt(0)}
                    </div>
                    <div className="comment-bubble">
                      <div className="comment-author">{comment.authorName}</div>
                      <div className="comment-content">{comment.content}</div>
                    </div>
                  </div>
                ))}

                {/* Create Comment Form */}
                <form
                  onSubmit={(e) => handleCommentSubmit(post.id, e)}
                  className="comment-composer"
                >
                  <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <input
                    type="text"
                    className="comment-composer-input"
                    placeholder="Viết bình luận công khai..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  />
                  <button type="submit" className="comment-submit-btn">
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar widgets */}
        <div className="trends-card card">
          <h3 className="flex-center" style={{ gap: '8px', justifyContent: 'flex-start', fontSize: '16px' }}>
            <TrendingUp size={18} className="text-secondary" style={{ color: 'var(--primary)' }} />
            Chủ đề tuyển dụng nóng
          </h3>
          <div className="trends-list">
            <div className="trend-item">
              <span className="trend-hashtag">#tuyendungdev</span>
              <span className="trend-count">1.2k bài đăng tuần này</span>
            </div>
            <div className="trend-item">
              <span className="trend-hashtag">#reviewcv</span>
              <span className="trend-count">850 thảo luận</span>
            </div>
            <div className="trend-item">
              <span className="trend-hashtag">#nextjs15</span>
              <span className="trend-count">430 lượt quan tâm</span>
            </div>
            <div className="trend-item">
              <span className="trend-hashtag">#vietnamit</span>
              <span className="trend-count">320 bài chia sẻ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
