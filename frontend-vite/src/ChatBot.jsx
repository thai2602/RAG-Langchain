import { useState } from 'react';
import axios from 'axios';
import './ChatBot.css';

const API_URL = 'http://localhost:5000/api';

function ChatBot({ isOpen, onToggle, onBlogSelect, onSearchResults }) {
  const [chatMode, setChatMode] = useState('smart-search');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Xin chào! 👋 Tôi là AI Assistant. Tôi có thể giúp bạn:\n\n🎯 Tìm kiếm blogs theo chủ đề\n📝 Tóm tắt nội dung\n📊 Phân tích bài viết\n✨ Tạo nội dung mới\n📝 Tạo blog mới trực tiếp\n\nBạn cần tôi giúp gì?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = { type: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      let res;
      let botResponse = '';
      let foundBlogs = [];

      switch (chatMode) {
        case 'smart-search':
          res = await axios.post(`${API_URL}/ai/smart-search`, { query });
          botResponse = res.data.answer;
          foundBlogs = res.data.blogs || [];
          // Gửi kết quả tìm kiếm lên App.js để lọc giao diện
          if (foundBlogs.length > 0 && onSearchResults) {
            onSearchResults(foundBlogs);
          }
          break;

        case 'search':
          res = await axios.post(`${API_URL}/ai/chat`, { query });
          botResponse = res.data.answer;
          break;

        case 'generate':
          res = await axios.post(`${API_URL}/ai/generate`, { 
            topic: query,
            style: 'chuyên nghiệp'
          });
          botResponse = res.data.generated_content;
          break;

        case 'create-blog':
          res = await axios.post(`${API_URL}/tools/create-blog-with-ai`, { 
            userRequest: query
          });
          botResponse = res.data.message;
          if (res.data.toolResults && res.data.toolResults.length > 0) {
            const result = res.data.toolResults[0].result;
            if (result.success) {
              botResponse += `\n\n✅ ${result.message}`;
            } else if (result.error) {
              botResponse += `\n\n❌ ${result.error}`;
            }
          }
          break;

        default:
          botResponse = 'Vui lòng chọn chế độ chat phù hợp.';
      }

      const botMessage = { 
        type: 'bot', 
        text: botResponse,
        blogs: foundBlogs 
      };
      setMessages(prev => [...prev, botMessage]);
      setQuery('');
    } catch (error) {
      const errorMessage = { 
        type: 'bot', 
        text: '❌ Lỗi: ' + (error.response?.data?.error || error.message)
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blogId) => {
    if (onBlogSelect) {
      onBlogSelect(blogId);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        title="Chat với AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <h3>AI Assistant</h3>
              <span className="chatbot-status">● Online</span>
            </div>
          </div>
          <button className="chatbot-close" onClick={onToggle}>✕</button>
        </div>

        <div className="chatbot-modes">
          <button 
            className={`mode-btn ${chatMode === 'smart-search' ? 'active' : ''}`}
            onClick={() => setChatMode('smart-search')}
            title="Tìm kiếm thông minh"
          >
            🎯
          </button>
          <button 
            className={`mode-btn ${chatMode === 'search' ? 'active' : ''}`}
            onClick={() => setChatMode('search')}
            title="Tìm kiếm"
          >
            🔍
          </button>
          <button 
            className={`mode-btn ${chatMode === 'generate' ? 'active' : ''}`}
            onClick={() => setChatMode('generate')}
            title="Tạo nội dung"
          >
            ✨
          </button>
          <button 
            className={`mode-btn ${chatMode === 'create-blog' ? 'active' : ''}`}
            onClick={() => setChatMode('create-blog')}
            title="Tạo blog mới"
          >
            📝
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.type === 'bot' && <div className="message-avatar">🤖</div>}
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
                {msg.blogs && msg.blogs.length > 0 && (
                  <div className="message-blogs">
                    {msg.blogs.map((blog, i) => (
                      <div 
                        key={i} 
                        className="message-blog-item"
                        onClick={() => handleBlogClick(blog.blog_id)}
                      >
                        <h4>{blog.title}</h4>
                        <span className="blog-cat">📁 {blog.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {msg.type === 'user' && <div className="message-avatar">👤</div>}
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            placeholder={
              chatMode === 'smart-search' ? 'Hỏi về bất kỳ chủ đề nào...' :
              chatMode === 'search' ? 'Tìm kiếm blogs...' :
              chatMode === 'generate' ? 'Nhập chủ đề để tạo nội dung...' :
              chatMode === 'create-blog' ? 'Mô tả blog bạn muốn tạo...' :
              'Nhập tin nhắn...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSend();
              }
            }}
            disabled={loading}
          />
          <button 
            onClick={handleSend} 
            disabled={loading || !query.trim()}
            className="send-btn"
          >
            {loading ? '⏳' : '🚀'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatBot;