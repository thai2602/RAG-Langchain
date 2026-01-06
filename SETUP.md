# 🚀 Hướng dẫn Setup nhanh

## Bước 1: Cài đặt MongoDB

### Windows:
```bash
# Download và cài đặt từ:
https://www.mongodb.com/try/download/community

# Tạo thư mục data
mkdir C:\data\db

# Khởi động MongoDB
mongod --dbpath C:\data\db
```

## Bước 2: Setup Backend

```bash
# Di chuyển vào thư mục backend
cd RAG-Langchain/backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
venv\Scripts\activate

# Cài đặt packages
pip install -r requirements.txt

# Tạo file .env từ template
copy .env.example .env
```

### Cấu hình .env:
1. Mở file `.env`
2. Thêm Groq API key:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
MONGO_URI=mongodb://localhost:27017/
```

### Lấy Groq API Key (MIỄN PHÍ):
1. Truy cập: https://console.groq.com
2. Đăng ký tài khoản
3. Vào "API Keys" → "Create API Key"
4. Copy key và paste vào file .env

## Bước 3: Setup Frontend

```bash
# Mở terminal mới
cd RAG-Langchain/frontend

# Cài đặt dependencies
npm install
```

## Bước 4: Chạy ứng dụng

### Terminal 1 - Backend:
```bash
cd RAG-Langchain/backend
venv\Scripts\activate
python app.py
```
✅ Backend: http://localhost:5000

### Terminal 2 - Frontend:
```bash
cd RAG-Langchain/frontend
npm start
```
✅ Frontend: http://localhost:3000

## Bước 5: Test ứng dụng

1. Mở trình duyệt: http://localhost:3000
2. Click "Tạo dữ liệu mẫu"
3. Thử các tính năng:
   - 🔍 Tìm kiếm: "Có blog nào về Python?"
   - 📝 Tóm tắt: Chọn blog → Click "Tóm tắt"
   - 📊 Phân tích: Chọn blog → Click "Phân tích"
   - 💡 Gợi ý: Chọn blog → Click "Gợi ý"
   - ✨ Tạo nội dung: Nhập chủ đề mới

## ⚠️ Troubleshooting

### MongoDB không chạy:
```bash
# Kiểm tra
mongod --version

# Khởi động lại
mongod --dbpath C:\data\db
```

### Port đã được sử dụng:
```bash
# Backend (port 5000)
# Sửa trong app.py: app.run(debug=True, port=5001)

# Frontend (port 3000)
# Chọn port khác khi được hỏi
```

### Lỗi import packages:
```bash
# Backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
npm install --force
```

## 🎉 Hoàn thành!

Bây giờ bạn có thể sử dụng RAG Chatbot để:
- Tìm kiếm blogs thông minh
- Tóm tắt nội dung
- Phân tích sentiment
- Nhận gợi ý blogs tương tự
- Tạo nội dung mới với AI
