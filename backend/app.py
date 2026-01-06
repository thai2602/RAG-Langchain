import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from datetime import datetime
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

# Cấu hình
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")

# Kết nối MongoDB
client = MongoClient(MONGO_URI)
db = client['blog_database']
blogs_collection = db['blogs']
users_collection = db['users']

# Khởi tạo LLM và Embeddings
llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",
    temperature=0.7
)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# Vector store global
vector_store = None

def initialize_vector_store():
    """Khởi tạo vector store từ tất cả blogs trong MongoDB"""
    global vector_store
    
    blogs = list(blogs_collection.find())
    if not blogs:
        return None
    
    texts = []
    metadatas = []
    
    for blog in blogs:
        content = f"Tiêu đề: {blog['title']}\n\nNội dung: {blog['content']}\n\nTác giả: {blog['author']}"
        texts.append(content)
        metadatas.append({
            'blog_id': str(blog['_id']),
            'title': blog['title'],
            'author': blog['author'],
            'category': blog.get('category', 'general')
        })
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    split_texts = text_splitter.create_documents(texts, metadatas=metadatas)
    vector_store = FAISS.from_documents(split_texts, embeddings)
    
    return vector_store

# Khởi tạo vector store khi start app
initialize_vector_store()

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Server đang chạy"})

@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    """Lấy danh sách tất cả blogs"""
    blogs = list(blogs_collection.find())
    for blog in blogs:
        blog['_id'] = str(blog['_id'])
    return jsonify({"blogs": blogs})

@app.route('/api/blogs/<blog_id>', methods=['GET'])
def get_blog_detail(blog_id):
    """Lấy chi tiết một blog"""
    try:
        from bson import ObjectId
        blog = blogs_collection.find_one({'_id': ObjectId(blog_id)})
        
        if not blog:
            return jsonify({"error": "Không tìm thấy blog"}), 404
        
        blog['_id'] = str(blog['_id'])
        
        # Tăng lượt xem
        blogs_collection.update_one(
            {'_id': ObjectId(blog_id)},
            {'$inc': {'views': 1}}
        )
        
        return jsonify({"blog": blog})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/blogs', methods=['POST'])
def create_blog():
    """Tạo blog mới"""
    data = request.json
    
    blog = {
        'title': data.get('title'),
        'content': data.get('content'),
        'author': data.get('author'),
        'category': data.get('category', 'general'),
        'created_at': datetime.now(),
        'views': 0
    }
    
    result = blogs_collection.insert_one(blog)
    
    # Cập nhật vector store
    initialize_vector_store()
    
    return jsonify({
        "message": "Blog đã được tạo",
        "blog_id": str(result.inserted_id)
    })

@app.route('/api/chat/summarize', methods=['POST'])
def summarize_blog():
    """Tóm tắt blog theo ID hoặc tất cả blogs"""
    data = request.json
    blog_id = data.get('blog_id')
    
    if blog_id:
        from bson import ObjectId
        blog = blogs_collection.find_one({'_id': ObjectId(blog_id)})
        if not blog:
            return jsonify({"error": "Không tìm thấy blog"}), 404
        
        content = f"Tiêu đề: {blog['title']}\n\nNội dung: {blog['content']}"
    else:
        blogs = list(blogs_collection.find().limit(5))
        content = "\n\n---\n\n".join([
            f"Tiêu đề: {b['title']}\nNội dung: {b['content'][:500]}..."
            for b in blogs
        ])
    
    prompt = f"""Hãy tóm tắt nội dung sau một cách ngắn gọn và súc tích:

{content}

Tóm tắt:"""
    
    response = llm.invoke(prompt)
    
    return jsonify({"summary": response.content})

@app.route('/api/chat/search', methods=['POST'])
def search_blogs():
    """Tìm kiếm blogs theo nội dung sử dụng RAG"""
    data = request.json
    query = data.get('query')
    
    if not query:
        return jsonify({"error": "Vui lòng nhập câu hỏi"}), 400
    
    if not vector_store:
        return jsonify({"error": "Chưa có dữ liệu blogs"}), 404
    
    # Tạo retriever
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    
    # Tạo prompt template
    template = """Sử dụng thông tin sau để trả lời câu hỏi. Nếu không tìm thấy thông tin phù hợp, hãy nói rằng bạn không biết.

Thông tin: {context}

Câu hỏi: {question}

Trả lời chi tiết:"""
    
    prompt = ChatPromptTemplate.from_template(template)
    
    # Tạo chain sử dụng LCEL
    def format_docs(docs):
        return "\n\n".join([doc.page_content for doc in docs])
    
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    result = rag_chain.invoke(query)
    
    return jsonify({
        "answer": result,
        "query": query
    })

@app.route('/api/chat/smart-search', methods=['POST'])
def smart_search():
    """Tìm kiếm thông minh và trả về blog IDs liên quan"""
    data = request.json
    query = data.get('query')
    
    if not query:
        return jsonify({"error": "Vui lòng nhập câu hỏi"}), 400
    
    if not vector_store:
        return jsonify({"error": "Chưa có dữ liệu blogs"}), 404
    
    # Tìm các documents liên quan
    similar_docs = vector_store.similarity_search(query, k=5)
    
    # Lấy blog IDs và scores
    blog_results = []
    seen_ids = set()
    
    for doc in similar_docs:
        blog_id = doc.metadata.get('blog_id')
        if blog_id and blog_id not in seen_ids:
            seen_ids.add(blog_id)
            blog_results.append({
                'blog_id': blog_id,
                'title': doc.metadata.get('title'),
                'category': doc.metadata.get('category'),
                'snippet': doc.page_content[:200] + '...'
            })
    
    # Tạo câu trả lời tự nhiên với AI
    if blog_results:
        blog_list = "\n".join([f"- {b['title']} (ID: {b['blog_id']})" for b in blog_results])
        
        ai_prompt = f"""Dựa trên câu hỏi: "{query}"

Tôi đã tìm thấy các blog sau:
{blog_list}

Hãy viết một câu trả lời ngắn gọn (2-3 câu) giới thiệu các blog này và giải thích tại sao chúng phù hợp với câu hỏi."""
        
        ai_response = llm.invoke(ai_prompt)
        
        return jsonify({
            "answer": ai_response.content,
            "blogs": blog_results,
            "query": query
        })
    else:
        return jsonify({
            "answer": "Xin lỗi, tôi không tìm thấy blog nào phù hợp với câu hỏi của bạn.",
            "blogs": [],
            "query": query
        })

@app.route('/api/chat/analyze', methods=['POST'])
def analyze_blog():
    """Phân tích sentiment và chủ đề của blog"""
    data = request.json
    blog_id = data.get('blog_id')
    
    if not blog_id:
        return jsonify({"error": "Vui lòng cung cấp blog_id"}), 400
    
    from bson import ObjectId
    blog = blogs_collection.find_one({'_id': ObjectId(blog_id)})
    
    if not blog:
        return jsonify({"error": "Không tìm thấy blog"}), 404
    
    prompt = f"""Phân tích bài viết sau:

Tiêu đề: {blog['title']}
Nội dung: {blog['content']}

Hãy cung cấp:
1. Sentiment (tích cực/tiêu cực/trung lập)
2. Chủ đề chính
3. Từ khóa quan trọng
4. Đánh giá chất lượng nội dung

Phân tích:"""
    
    response = llm.invoke(prompt)
    
    return jsonify({
        "analysis": response.content,
        "blog_title": blog['title']
    })

@app.route('/api/chat/recommend', methods=['POST'])
def recommend_blogs():
    """Gợi ý blogs tương tự dựa trên nội dung"""
    data = request.json
    blog_id = data.get('blog_id')
    
    if not blog_id or not vector_store:
        return jsonify({"error": "Thiếu thông tin hoặc chưa có dữ liệu"}), 400
    
    from bson import ObjectId
    blog = blogs_collection.find_one({'_id': ObjectId(blog_id)})
    
    if not blog:
        return jsonify({"error": "Không tìm thấy blog"}), 404
    
    query = f"{blog['title']} {blog['content'][:200]}"
    similar_docs = vector_store.similarity_search(query, k=4)
    
    recommendations = []
    for doc in similar_docs:
        if doc.metadata.get('blog_id') != blog_id:
            recommendations.append({
                'title': doc.metadata.get('title'),
                'blog_id': doc.metadata.get('blog_id')
            })
    
    return jsonify({"recommendations": recommendations[:3]})

@app.route('/api/chat/generate', methods=['POST'])
def generate_content():
    """Tạo nội dung blog mới dựa trên chủ đề"""
    data = request.json
    topic = data.get('topic')
    style = data.get('style', 'chuyên nghiệp')
    
    if not topic:
        return jsonify({"error": "Vui lòng cung cấp chủ đề"}), 400
    
    prompt = f"""Viết một bài blog về chủ đề: {topic}

Phong cách: {style}
Độ dài: Khoảng 300-500 từ

Bài viết:"""
    
    response = llm.invoke(prompt)
    
    return jsonify({
        "generated_content": response.content,
        "topic": topic
    })

@app.route('/api/users', methods=['POST'])
def create_user():
    """Tạo user mới"""
    data = request.json
    
    user = {
        'username': data.get('username'),
        'email': data.get('email'),
        'created_at': datetime.now(),
        'favorite_blogs': []
    }
    
    result = users_collection.insert_one(user)
    
    return jsonify({
        "message": "User đã được tạo",
        "user_id": str(result.inserted_id)
    })

@app.route('/api/seed', methods=['POST'])
def seed_data():
    """Tạo dữ liệu mẫu cho database"""
    # Xóa dữ liệu cũ
    blogs_collection.delete_many({})
    users_collection.delete_many({})
    
    # Tạo users mẫu
    users = [
        {"username": "nguyen_van_a", "email": "a@example.com", "created_at": datetime.now(), "favorite_blogs": []},
        {"username": "tran_thi_b", "email": "b@example.com", "created_at": datetime.now(), "favorite_blogs": []}
    ]
    users_collection.insert_many(users)
    
    # Tạo blogs mẫu
    blogs = [
        {
            "title": "Giới thiệu về Machine Learning",
            "content": "Machine Learning là một nhánh của trí tuệ nhân tạo cho phép máy tính học từ dữ liệu mà không cần lập trình cụ thể. Các thuật toán ML có thể phát hiện patterns trong dữ liệu và đưa ra dự đoán. Có 3 loại chính: supervised learning, unsupervised learning, và reinforcement learning.",
            "author": "nguyen_van_a",
            "category": "technology",
            "created_at": datetime.now(),
            "views": 150
        },
        {
            "title": "Hướng dẫn nấu Phở Việt Nam",
            "content": "Phở là món ăn truyền thống của Việt Nam. Để nấu phở ngon, bạn cần nước dùng trong, thơm từ xương hầm 8-10 tiếng. Gia vị quan trọng gồm hành, gừng nướng, hồi, quế. Bánh phở phải mềm dai, thịt bò thái mỏng. Ăn kèm với rau thơm, chanh, ớt.",
            "author": "tran_thi_b",
            "category": "food",
            "created_at": datetime.now(),
            "views": 200
        },
        {
            "title": "Du lịch Đà Lạt - Thành phố ngàn hoa",
            "content": "Đà Lạt nổi tiếng với khí hậu mát mẻ quanh năm, nhiều đồi thông và hoa. Các địa điểm nên ghé thăm: Hồ Xuân Hương, Thung lũng Tình Yêu, Đồi Mộng Mơ, Vườn hoa thành phố. Đặc sản: dâu tây, atiso, rượu vang. Thời điểm đẹp nhất: tháng 12-3.",
            "author": "nguyen_van_a",
            "category": "travel",
            "created_at": datetime.now(),
            "views": 180
        },
        {
            "title": "Lập trình Python cho người mới bắt đầu",
            "content": "Python là ngôn ngữ lập trình dễ học, cú pháp đơn giản. Ứng dụng rộng rãi: web development, data science, AI, automation. Bắt đầu với: biến, vòng lặp, hàm, class. Thư viện phổ biến: NumPy, Pandas, Django, Flask. Cộng đồng lớn, tài liệu phong phú.",
            "author": "tran_thi_b",
            "category": "technology",
            "created_at": datetime.now(),
            "views": 300
        },
        {
            "title": "Bí quyết chăm sóc sức khỏe mùa đông",
            "content": "Mùa đông cần chú ý giữ ấm cơ thể, đặc biệt vùng cổ, ngực, bàn chân. Uống đủ nước, ăn nhiều trái cây giàu vitamin C. Tập thể dục đều đặn nhưng tránh ra ngoài quá sớm. Ngủ đủ giấc 7-8 tiếng. Rửa tay thường xuyên phòng bệnh.",
            "author": "nguyen_van_a",
            "category": "health",
            "created_at": datetime.now(),
            "views": 120
        }
    ]
    blogs_collection.insert_many(blogs)
    
    # Khởi tạo lại vector store
    initialize_vector_store()
    
    return jsonify({
        "message": "Đã tạo dữ liệu mẫu thành công",
        "users": len(users),
        "blogs": len(blogs)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
