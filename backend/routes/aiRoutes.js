import express from 'express';
import axios from 'axios';
import Blog from '../models/Blog.js';

const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Helper function to call Groq API
async function callGroqAPI(prompt) {
  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error('AI API Error: ' + error.message);
  }
}

// Smart search - find relevant blogs
router.post('/smart-search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }
    
    // Search blogs using text search
    const blogs = await Blog.find(
      { $text: { $search: query }, published: true },
      { score: { $meta: 'textScore' } }
    )
    .populate('author', 'username fullName avatar')
    .sort({ score: { $meta: 'textScore' } })
    .limit(5);
    
    if (blogs.length === 0) {
      return res.json({
        success: true,
        answer: 'Xin lỗi, tôi không tìm thấy blog nào phù hợp với câu hỏi của bạn.',
        blogs: []
      });
    }
    
    // Create AI response
    const blogList = blogs.map(b => `- ${b.title} (${b.category})`).join('\n');
    const prompt = `Dựa trên câu hỏi: "${query}"

Tôi đã tìm thấy các blog sau:
${blogList}

Hãy viết một câu trả lời ngắn gọn (2-3 câu) giới thiệu các blog này và giải thích tại sao chúng phù hợp với câu hỏi.`;
    
    const aiAnswer = await callGroqAPI(prompt);
    
    res.json({
      success: true,
      answer: aiAnswer,
      blogs: blogs.map(b => ({
        blog_id: b._id,
        title: b.title,
        category: b.category,
        excerpt: b.excerpt,
        author: b.author,
        coverImage: b.coverImage
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Summarize blog
router.post('/summarize', async (req, res) => {
  try {
    const { blog_id } = req.body;
    
    const blog = await Blog.findById(blog_id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    const prompt = `Hãy tóm tắt bài viết sau một cách ngắn gọn và súc tích:

Tiêu đề: ${blog.title}
Nội dung: ${blog.content}

Tóm tắt:`;
    
    const summary = await callGroqAPI(prompt);
    
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze blog
router.post('/analyze', async (req, res) => {
  try {
    const { blog_id } = req.body;
    
    const blog = await Blog.findById(blog_id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    const prompt = `Phân tích bài viết sau:

Tiêu đề: ${blog.title}
Nội dung: ${blog.content}

Hãy cung cấp:
1. Sentiment (tích cực/tiêu cực/trung lập)
2. Chủ đề chính
3. Từ khóa quan trọng
4. Đánh giá chất lượng nội dung

Phân tích:`;
    
    const analysis = await callGroqAPI(prompt);
    
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate content
router.post('/generate', async (req, res) => {
  try {
    const { topic, style = 'chuyên nghiệp' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }
    
    const prompt = `Viết một bài blog về chủ đề: ${topic}

Phong cách: ${style}
Độ dài: Khoảng 300-500 từ

Bài viết:`;
    
    const content = await callGroqAPI(prompt);
    
    res.json({ success: true, generated_content: content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat with general questions
router.post('/chat', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }
    
    // Get some context from blogs
    const blogs = await Blog.find({ published: true })
      .limit(3)
      .sort({ views: -1 });
    
    const context = blogs.map(b => `${b.title}: ${b.excerpt}`).join('\n\n');
    
    const prompt = `Bạn là một AI assistant cho một trang blog. Dưới đây là một số bài viết phổ biến:

${context}

Câu hỏi của người dùng: ${query}

Hãy trả lời câu hỏi một cách hữu ích và thân thiện.`;
    
    const answer = await callGroqAPI(prompt);
    
    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
