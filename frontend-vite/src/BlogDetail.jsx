import { useState, useEffect } from 'react';
import axios from 'axios';
import './BlogDetail.css';

const API_URL = 'http://localhost:5000/api';

function BlogDetail({ blogId, onBack, onNavigate }) {
  const [blog, setBlog] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState('');
  const [summary, setSummary] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    fetchBlogDetail();
  }, [blogId]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/blogs/${blogId}`);
      setBlog(res.data.blog);
      
      // Lấy gợi ý blogs tương tự
      const recRes = await axios.get(`${API_URL}/blogs/${blogId}/related`);
      setRecommendations(recRes.data.blogs || []);
    } catch (error) {
      console.error('Lỗi khi tải blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setShowAnalysis(true);
      if (!analysis) {
        const res = await axios.post(`${API_URL}/ai/analyze`, { blog_id: blogId });
        setAnalysis(res.data.analysis);
      }
    } catch (error) {
      console.error('Lỗi khi phân tích:', error);
    }
  };

  const handleSummarize = async () => {
    try {
      setShowSummary(true);
      if (!summary) {
        const res = await axios.post(`${API_URL}/ai/summarize`, { blog_id: blogId });
        setSummary(res.data.summary);
      }
    } catch (error) {
      console.error('Lỗi khi tóm tắt:', error);
    }
  };

  if (loading) {
    return <div className="blog-detail-loading">⏳ Đang tải...</div>;
  }

  if (!blog) {
    return <div className="blog-detail-error">❌ Không tìm thấy blog</div>;
  }

  return (
    <div className="blog-detail">
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>

      <article className="blog-article">
        <header className="blog-header">
          <h1>{blog.title}</h1>
          <div className="blog-meta">
            <span>👤 {blog.author?.fullName || blog.author?.username}</span>
            <span>📁 {blog.category}</span>
            <span>👁️ {blog.views} lượt xem</span>
            <span>❤️ {blog.likes} likes</span>
            <span>📅 {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
            <span>⏱️ {blog.readTime} phút đọc</span>
          </div>
        </header>

        <div className="blog-actions">
          <button onClick={handleSummarize} className="action-btn">
            📝 Tóm tắt
          </button>
          <button onClick={handleAnalyze} className="action-btn">
            📊 Phân tích
          </button>
        </div>

        {showSummary && summary && (
          <div className="blog-summary">
            <h3>📝 Tóm tắt</h3>
            <p>{summary}</p>
          </div>
        )}

        {showAnalysis && analysis && (
          <div className="blog-analysis">
            <h3>📊 Phân tích</h3>
            <pre>{analysis}</pre>
          </div>
        )}

        <div className="blog-body">
          <p>{blog.content}</p>
        </div>
      </article>

      {recommendations.length > 0 && (
        <aside className="recommendations">
          <h3>💡 Bài viết liên quan</h3>
          <div className="recommendation-list">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="recommendation-item"
                onClick={() => onNavigate && onNavigate(rec.blog_id)}
              >
                <h4>{rec.title}</h4>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

export default BlogDetail;