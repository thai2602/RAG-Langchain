# RAG Blog Frontend - Vite + React

Frontend được xây dựng với Vite + React cho hệ thống blog với AI chatbot.

## 🚀 Tính năng

- **Blog System**: Hiển thị danh sách blogs, chi tiết blog, phân loại theo category
- **AI Chatbot**: 4 chế độ chat với AI
  - 🎯 Smart Search: Tìm kiếm thông minh và lọc kết quả trên giao diện
  - 🔍 Search: Tìm kiếm cơ bản
  - ✨ Generate: Tạo nội dung mới
  - 📝 Create Blog: Tạo blog mới trực tiếp với AI
- **Responsive Design**: Tối ưu cho mobile và desktop
- **Modern UI**: Gradient design với animations mượt mà

## 🛠️ Công nghệ

- **Vite**: Build tool nhanh và hiện đại
- **React 19**: UI framework với hooks
- **Axios**: HTTP client
- **CSS3**: Animations và responsive design
- **JavaScript + SWC**: Compilation nhanh

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
# hoặc
npm start

# Build production
npm run build

# Preview production build
npm run preview
```

## 🌐 URLs

- **Development**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## 📁 Cấu trúc

```
src/
├── App.jsx          # Main component
├── ChatBot.jsx      # AI Chatbot component
├── BlogDetail.jsx   # Blog detail page
├── App.css          # Main styles
├── ChatBot.css      # Chatbot styles
├── BlogDetail.css   # Blog detail styles
├── index.css        # Global styles
└── main.jsx         # Entry point
```

## 🔧 Cấu hình

- **Port**: 5173 (Vite default)
- **API URL**: http://localhost:5000/api
- **Hot Reload**: Enabled
- **SWC**: Enabled for fast compilation

## 🎨 UI Components

### Blog Cards
- Hover animations
- Category badges
- View counts
- Author information

### Chatbot
- Floating button
- 4 chat modes
- Typing indicators
- Blog result cards
- Mobile responsive

### Blog Detail
- AI analysis và summarization
- Related blog recommendations
- Navigation between blogs
- Responsive layout

## 🚀 Performance

- **Vite HMR**: Hot module replacement
- **SWC**: Fast compilation
- **Tree shaking**: Optimized bundles
- **Code splitting**: Lazy loading

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- Mobile-optimized chatbot
- Adaptive layouts