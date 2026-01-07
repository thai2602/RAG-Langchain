import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import BlogDetail from './BlogDetail';
import ChatBot from './ChatBot';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [detailBlogId, setDetailBlogId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/blogs`);
      setBlogs(res.data.blogs);
    } catch (error) {
      console.error('Lỗi khi tải blogs:', error);
    }
  };

  const handleSeedData = async () => {
    try {
      alert('Dữ liệu đã được tạo sẵn 50 blogs! Refresh trang để xem.');
      await fetchBlogs();
    } catch (error) {
      alert('Lỗi khi tải dữ liệu');
    }
  };

  const openBlogDetail = (blogId) => {
    setDetailBlogId(blogId);
    setViewMode('detail');
  };

  const closeBlogDetail = () => {
    setViewMode('list');
    setDetailBlogId(null);
    fetchBlogs();
  };

  const categories = ['all', ...new Set(blogs.map(b => b.category))];
  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory);

  if (viewMode === 'detail' && detailBlogId) {
    return (
      <>
        <BlogDetail blogId={detailBlogId} onBack={closeBlogDetail} onNavigate={openBlogDetail} />
        <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
      </>
    );
  }

  return (
    <div className="App">
      <header className="blog-header">
        <div className="header-content">
          <h1>📚 My Blog</h1>
          <p>Khám phá kiến thức và chia sẻ trải nghiệm</p>
        </div>
      </header>

      <nav className="blog-nav">
        <div className="nav-content">
          <div className="categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? '🏠 Tất cả' : `📁 ${cat}`}
              </button>
            ))}
          </div>
          <button onClick={handleSeedData} className="seed-btn">
            ➕ Tạo dữ liệu mẫu
          </button>
        </div>
      </nav>

      <main className="blog-main">
        <div className="blog-grid">
          {filteredBlogs.map(blog => (
            <article key={blog._id} className="blog-card" onClick={() => openBlogDetail(blog._id)}>
              <div className="blog-card-header">
                <span className="blog-category">{blog.category}</span>
                <span className="blog-views">👁️ {blog.views}</span>
              </div>
              <h2 className="blog-title">{blog.title}</h2>
              <p className="blog-excerpt">
                {blog.excerpt || blog.content.substring(0, 150) + '...'}
              </p>
              <div className="blog-card-footer">
                <span className="blog-author">👤 {blog.author?.fullName || blog.author?.username}</span>
                <span className="read-more">Đọc thêm →</span>
              </div>
            </article>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="empty-state">
            <h2>📭 Chưa có bài viết nào</h2>
            <p>Hãy tạo dữ liệu mẫu để bắt đầu!</p>
            <button onClick={handleSeedData} className="seed-btn-large">
              ➕ Tạo dữ liệu mẫu
            </button>
          </div>
        )}
      </main>

      <footer className="blog-footer">
        <p>© 2024 My Blog - Powered by AI RAG Chatbot</p>
      </footer>

      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
}

export default App;
