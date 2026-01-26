# 🚀 RAG Blog với AI Chatbot

Trang web blog hiện đại với AI Chatbot tích hợp, sử dụng RAG (Retrieval-Augmented Generation) để tìm kiếm và tương tác thông minh.

## 🎯 Tính năng

### Frontend (Vite + React)
- ✅ Giao diện blog hiện đại với grid layout
- ✅ Filter blogs theo category
- ✅ Blog detail page với đầy đủ thông tin
- ✅ AI Chatbot floating button với 4 modes
- ✅ Smart search với filtering trên UI
- ✅ Responsive design cho mọi thiết bị
- ✅ Smooth animations và transitions
- ✅ Fast HMR với Vite + SWC

### Backend (Node.js + Express)
- ✅ RESTful API với Express
- ✅ MongoDB database với Mongoose ODM
- ✅ User và Blog models với relationships
- ✅ AI integration với Groq API
- ✅ Smart search với RAG
- ✅ Blog summarization và analysis
- ✅ Content generation
- ✅ AI Tools cho blog creation

### AI Features
- 🎯 **Smart Search**: Tìm kiếm thông minh với AI và lọc kết quả trên UI
- 📝 **Summarize**: Tóm tắt nội dung blog
- 📊 **Analyze**: Phân tích sentiment và chủ đề
- ✨ **Generate**: Tạo nội dung blog mới
- 📝 **Create Blog**: Tạo blog mới trực tiếp với AI
- 💡 **Recommendations**: Gợi ý blogs liên quan

## 🏗️ Tech Stack

### Frontend
- **Vite**: Modern build tool với HMR
- **React 19**: Latest React với hooks
- **SWC**: Fast compilation
- **Axios**: HTTP client
- **CSS3**: Modern styling với animations

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Groq AI API
- LangChain

## 📦 Cài đặt

### Prerequisites
- Node.js >= 16
- MongoDB
- Groq API Key

### 1. Clone repository
```bash
git clone https://github.com/thai2602/RAG-Langchain.git
cd RAG-Langchain
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Tạo file `.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb://localhost:27017/blog_database
PORT=5000
NODE_ENV=development
```

Seed database với 50 blogs:
```bash
node scripts/seed.js
```

Start backend:
```bash
npm start
# hoặc
npm run dev  # với nodemon
```

Backend chạy tại: http://localhost:5000

### 3. Setup Frontend (Vite)
```bash
cd frontend-vite
npm install
npm run dev
# hoặc
npm start
```

Frontend chạy tại: http://localhost:5173

## 📁 Cấu trúc Project

```
RAG-Langchain/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Blog.js          # Blog model
│   ├── routes/
│   │   ├── userRoutes.js    # User API routes
│   │   ├── blogRoutes.js    # Blog API routes
│   │   ├── aiRoutes.js      # AI API routes
│   │   └── toolRoutes.js    # AI Tools routes
│   ├── tools/
│   │   └── blogTools.js     # AI Tools for blog creation
│   ├── scripts/
│   │   └── seed.js          # Seed 50 blogs
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env
├── frontend/ (Legacy CRA)
├── frontend-vite/ (New Vite)
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── BlogDetail.jsx   # Blog detail page
│   │   ├── ChatBot.jsx      # AI Chatbot
│   │   ├── App.css
│   │   ├── BlogDetail.css
│   │   ├── ChatBot.css
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Blogs
- `GET /api/blogs` - Lấy tất cả blogs
- `GET /api/blogs/:id` - Lấy blog theo ID
- `POST /api/blogs` - Tạo blog mới
- `PUT /api/blogs/:id` - Cập nhật blog
- `DELETE /api/blogs/:id` - Xóa blog
- `GET /api/blogs/:id/related` - Lấy blogs liên quan
- `POST /api/blogs/:id/like` - Like blog

### Users
- `GET /api/users` - Lấy tất cả users
- `GET /api/users/:id` - Lấy user theo ID
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `GET /api/users/:id/blogs` - Lấy blogs của user

### AI
- `POST /api/ai/smart-search` - Tìm kiếm thông minh
- `POST /api/ai/summarize` - Tóm tắt blog
- `POST /api/ai/analyze` - Phân tích blog
- `POST /api/ai/generate` - Tạo nội dung
- `POST /api/ai/chat` - Chat với AI

### AI Tools
- `POST /api/tools/create-blog-with-ai` - Tạo blog với AI tools

## 💾 Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String,
  fullName: String,
  avatar: String,
  bio: String,
  role: String (user/admin),
  blogs: [Blog],
  favoriteBlogs: [Blog],
  timestamps: true
}
```

### Blog Model
```javascript
{
  title: String,
  content: String,
  excerpt: String,
  author: User (ref),
  category: String,
  tags: [String],
  coverImage: String,
  views: Number,
  likes: Number,
  published: Boolean,
  featured: Boolean,
  readTime: Number,
  timestamps: true
}
```

## 🎨 Features Demo

### 1. Trang chủ Blog
- Grid layout hiển thị blogs
- Filter theo category
- Smart search filtering trên UI
- Click vào blog để xem chi tiết

### 2. Blog Detail
- Hiển thị toàn bộ nội dung
- Author information
- Views, likes, read time
- AI features: Summarize, Analyze
- Related blogs với navigation

### 3. AI Chatbot (4 Modes)
- **🎯 Smart Search**: Tìm kiếm và lọc kết quả trên giao diện
- **🔍 Search**: Tìm kiếm cơ bản
- **✨ Generate**: Tạo nội dung mới
- **📝 Create Blog**: Tạo blog mới trực tiếp với AI tools
- Floating button ở góc dưới phải
- Chat interface với typing indicator
- Click vào blog results để xem detail

## 🚀 Performance (Vite)

- **Fast HMR**: Hot Module Replacement với Vite
- **SWC Compilation**: Faster than Babel
- **Tree Shaking**: Optimized bundles
- **Code Splitting**: Lazy loading
- **Dev Server**: Lightning fast development

## 🚀 Deployment

### Backend
```bash
# Build for production
npm start

# Hoặc dùng PM2
pm2 start server.js --name "blog-backend"
```

### Frontend (Vite)
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve với serve
npx serve -s dist
```

## 📝 Environment Variables

### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key
MONGO_URI=mongodb://localhost:27017/blog_database
PORT=5000
NODE_ENV=production
```

## 🔄 Migration từ CRA sang Vite

Đã migrate thành công từ Create React App sang Vite:
- ✅ Faster development server
- ✅ Better build performance
- ✅ Modern tooling với SWC
- ✅ Tất cả features hoạt động bình thường
- ✅ Responsive design được giữ nguyên

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Thai2602**
- GitHub: [@thai2602](https://github.com/thai2602)

## 🙏 Acknowledgments

- Groq AI for the API
- MongoDB for the database
- React team for the framework
- Vite team for the amazing build tool
- Express team for the backend framework

---

Made with ❤️ by Thai2602
