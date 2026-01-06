# 🚀 Hướng dẫn cài đặt trên Windows

## Bước 1: Cài đặt MongoDB

### Tải và cài đặt:
1. Truy cập: https://www.mongodb.com/try/download/community
2. Chọn version mới nhất cho Windows
3. Cài đặt với tùy chọn "Complete"
4. Chọn "Install MongoDB as a Service"

### Khởi động MongoDB:
```cmd
# MongoDB sẽ tự động chạy như service
# Kiểm tra:
mongod --version
```

## Bước 2: Cài đặt Backend (Python)

### Mở PowerShell/CMD trong thư mục backend:
```cmd
cd RAG-Langchain\backend
```

### Cài đặt packages (từng bước):
```cmd
# Bước 1: Cài packages cơ bản
py -m pip install flask flask-cors pymongo python-dotenv requests

# Bước 2: Cài numpy và scipy
py -m pip install numpy scipy

# Bước 3: Cài PyTorch (CPU version)
py -m pip install torch --index-url https://download.pytorch.org/whl/cpu

# Bước 4: Cài LangChain
py -m pip install langchain langchain-core langchain-community

# Bước 5: Cài Groq
py -m pip install langchain-groq groq

# Bước 6: Cài sentence-transformers
py -m pip install sentence-transformers

# Bước 7: Cài FAISS
py -m pip install faiss-cpu
```

### Tạo file .env:
```cmd
copy .env.example .env
notepad .env
```

Thêm vào file .env:
```
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb://localhost:27017/
```

**Lấy Groq API Key:**
1. Truy cập: https://console.groq.com
2. Đăng ký/Đăng nhập
3. Tạo API key mới
4. Copy và paste vào file .env

## Bước 3: Cài đặt Frontend (React)

### Cài Node.js (nếu chưa có):
1. Tải từ: https://nodejs.org/
2. Chọn LTS version
3. Cài đặt với tùy chọn mặc định

### Cài đặt dependencies:
```cmd
cd RAG-Langchain\frontend
npm install
```

## Bước 4: Chạy ứng dụng

### Terminal 1 - Backend:
```cmd
cd RAG-Langchain\backend
py app.py
```

Chờ thấy: `Running on http://127.0.0.1:5000`

### Terminal 2 - Frontend:
```cmd
cd RAG-Langchain\frontend
npm start
```

Trình duyệt sẽ tự động mở: http://localhost:3000

## Bước 5: Sử dụng

1. Click "Tạo dữ liệu mẫu" để tạo 5 blogs mẫu
2. Thử các tính năng:
   - 🔍 Tìm kiếm: "Có blog nào về Python?"
   - 📝 Tóm tắt: Chọn blog → Click "Tóm tắt"
   - 📊 Phân tích: Chọn blog → Click "Phân tích"
   - 💡 Gợi ý: Chọn blog → Click "Gợi ý"
   - ✨ Tạo nội dung: Nhập chủ đề mới

## ⚠️ Troubleshooting

### Lỗi "MongoDB not running":
```cmd
# Khởi động MongoDB service
net start MongoDB
```

### Lỗi "Port already in use":
```cmd
# Backend (port 5000)
# Sửa trong app.py dòng cuối: app.run(debug=True, port=5001)

# Frontend (port 3000)
# Chọn port khác khi được hỏi
```

### Lỗi cài đặt packages:
```cmd
# Nâng cấp pip
py -m pip install --upgrade pip

# Cài lại từng package
py -m pip install --upgrade <package_name>
```

### Lỗi Groq API:
- Kiểm tra API key trong file .env
- Đảm bảo có kết nối internet
- Verify key tại: https://console.groq.com

## 📝 Lưu ý

- Đảm bảo MongoDB đang chạy trước khi start backend
- Backend phải chạy trước frontend
- Lần đầu chạy sẽ download models (khoảng 500MB)
- Cần kết nối internet để sử dụng Groq API

## 🎉 Hoàn thành!

Bây giờ bạn có thể sử dụng RAG Chatbot với đầy đủ tính năng!
