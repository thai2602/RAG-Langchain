# 🤖 RAG Blog Chatbot với LangChain

Hệ thống chatbot AI sử dụng RAG (Retrieval-Augmented Generation) để tìm kiếm, tóm tắt và phân tích blogs.

## ✨ Tính năng

### 🔍 Tìm kiếm thông minh
- Tìm kiếm nội dung blogs bằng ngôn ngữ tự nhiên
- Sử dụng vector embeddings và FAISS để tìm kiếm semantic

### 📝 Tóm tắt nội dung
- Tóm tắt một blog cụ thể hoặc nhiều blogs
- Trích xuất ý chính một cách ngắn gọn

### 📊 Phân tích blog
- Phân tích sentiment (tích cực/tiêu cực/trung lập)
- Xác định chủ đề chính và từ khóa
- Đánh giá chất lượng nội dung

### 💡 Gợi ý thông minh
- Đề xuất các blogs tương tự dựa trên nội dung
- Sử dụng similarity search

### ✨ Tạo nội dung
- Tự động tạo nội dung blog mới từ chủ đề
- Tùy chỉnh phong cách viết

## 🛠️ Công nghệ sử dụng

### Backend
- **Flask**: Web framework
- **MongoDB**: Database lưu trữ blogs và users
- **LangChain**: Framework cho RAG
- **Groq API**: LLM (Llama 3.3 70B)
- **FAISS**: Vector store cho similarity search
- **HuggingFace**: Sentence embeddings (multilingual)

### Frontend
- **React**: UI framework
- **Axios**: HTTP client

## 📦 Cài đặt

### 1. Cài đặt MongoDB

**Windows:**
```bash
# Download từ: https://www.mongodb.com/try/download/community
# Hoặc dùng Chocolatey:
choco install mongodb
```

**Khởi động MongoDB:**
```bash
mongod --dbpath C:\data\db
```

### 2. Backend Setup

```bash
cd RAG-Langchain/backend

# Tạo virtual environment
python -m venv venv
venv\Scripts\activate

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env
copy .env.example .env
```

**Cấu hình .env:**
```
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb://localhost:27017/
```

**Lấy Groq API Key:**
1. Truy cập: https://console.groq.com
2. Đăng ký tài khoản miễn phí
3. Tạo API key mới
4. Copy vào file .env

### 3. Frontend Setup

```bash
cd RAG-Langchain/frontend

# Cài đặt dependencies
npm install
```

## 🚀 Chạy ứng dụng

### Terminal 1 - Backend:
```bash
cd RAG-Langchain/backend
venv\Scripts\activate
python app.py
```
Backend chạy tại: http://localhost:5000

### Terminal 2 - Frontend:
```bash
cd RAG-Langchain/frontend
npm start
```
Frontend chạy tại: http://localhost:3000

## 📖 Hướng dẫn sử dụng

### 1. Tạo dữ liệu mẫu
- Click nút "Tạo dữ liệu mẫu" để tạo 5 blogs mẫu
- Dữ liệu bao gồm: công nghệ, ẩm thực, du lịch, lập trình, sức khỏe

### 2. Tìm kiếm blogs
- Chọn mode "🔍 Tìm kiếm"
- Nhập câu hỏi: "Có blog nào về lập trình không?"
- AI sẽ tìm và trả lời dựa trên nội dung blogs

### 3. Tóm tắt blog
- Chọn một blog từ danh sách
- Chọn mode "📝 Tóm tắt"
- Nhấn Enter để nhận tóm tắt

### 4. Phân tích blog
- Chọn một blog
- Chọn mode "📊 Phân tích"
- Nhận phân tích về sentiment, chủ đề, từ khóa

### 5. Gợi ý blogs tương tự
- Chọn một blog
- Chọn mode "💡 Gợi ý"
- Nhận danh sách blogs liên quan

### 6. Tạo nội dung mới
- Chọn mode "✨ Tạo nội dung"
- Nhập chủ đề: "Cách học React hiệu quả"
- AI sẽ tạo nội dung blog hoàn chỉnh

### 7. Tạo blog mới
- Điền form "Tạo Blog Mới" ở sidebar
- Nhập: tiêu đề, nội dung, tác giả, danh mục
- Click "Tạo Blog"

## 🔧 API Endpoints

### Blogs
- `GET /api/blogs` - Lấy danh sách blogs
- `POST /api/blogs` - Tạo blog mới
- `POST /api/seed` - Tạo dữ liệu mẫu

### Chat/RAG
- `POST /api/chat/search` - Tìm kiếm với RAG
- `POST /api/chat/summarize` - Tóm tắt blog
- `POST /api/chat/analyze` - Phân tích blog
- `POST /api/chat/recommend` - Gợi ý blogs tương tự
- `POST /api/chat/generate` - Tạo nội dung mới

### Users
- `POST /api/users` - Tạo user mới

## 🎯 Kiến trúc RAG

```
User Query → Embedding → Vector Search (FAISS)
                ↓
        Retrieved Documents
                ↓
        LLM (Groq) + Context → Response
```

## 📝 Cấu trúc Database

### Collection: blogs
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  author: String,
  category: String,
  created_at: Date,
  views: Number
}
```

### Collection: users
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  created_at: Date,
  favorite_blogs: Array
}
```

## 🔍 Troubleshooting

### Lỗi kết nối MongoDB
```bash
# Kiểm tra MongoDB đang chạy
mongod --version

# Khởi động MongoDB
mongod --dbpath C:\data\db
```

### Lỗi Groq API
- Kiểm tra API key trong file .env
- Đảm bảo có kết nối internet
- Verify key tại: https://console.groq.com

### Lỗi dependencies
```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
npm install --force
```

## 🚀 Mở rộng

### Thêm tính năng mới:
1. **Multi-language support**: Thêm hỗ trợ nhiều ngôn ngữ
2. **User authentication**: Đăng nhập/đăng ký
3. **Favorite blogs**: Lưu blogs yêu thích
4. **Comments**: Hệ thống bình luận
5. **Advanced search**: Lọc theo category, author, date
6. **Export**: Xuất blogs ra PDF/Word

### Tối ưu hóa:
- Cache vector embeddings
- Pagination cho danh sách blogs
- Rate limiting cho API
- Deploy lên cloud (Vercel + MongoDB Atlas)

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa

## 👨‍💻 Author

Được xây dựng với ❤️ sử dụng LangChain và Groq AI
