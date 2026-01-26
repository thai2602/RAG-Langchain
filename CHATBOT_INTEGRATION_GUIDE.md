# 🤖 Hướng dẫn tích hợp AI Chatbot vào Project khác

## 📋 Tổng quan

Chatbot AI này là một component React hiện đại với 4 chế độ hoạt động khác nhau, tích hợp AI để tìm kiếm thông minh, tạo nội dung và tương tác với dữ liệu. Chatbot có thể dễ dàng tích hợp vào bất kỳ project React nào.

## 🎯 Tính năng chính

- **4 chế độ hoạt động**: Smart Search, Search, Generate Content, Create Blog
- **Giao diện floating button** với animation mượt mà
- **Real-time chat interface** với typing indicator
- **Responsive design** cho mọi thiết bị
- **Tích hợp AI** với Groq API
- **Customizable** cho nhiều loại dữ liệu khác nhau

## 🚀 Cách tích hợp vào project của bạn

### Bước 1: Copy các file cần thiết

**Frontend Components:**
```
src/
├── ChatBot.jsx          # Component chính
├── ChatBot.css          # Styling
└── [YourData]Tools.js   # Tools cho AI (tùy chỉnh theo dữ liệu của bạn)
```

**Backend Files:**
```
backend/
├── routes/
│   ├── aiRoutes.js      # API routes cho AI
│   └── toolRoutes.js    # API routes cho AI tools
└── tools/
    └── [yourData]Tools.js  # AI tools cho dữ liệu của bạn
```

### Bước 2: Cài đặt dependencies

**Frontend:**
```bash
npm install axios
```

**Backend:**
```bash
npm install groq-sdk langchain
```

### Bước 3: Tùy chỉnh ChatBot component

#### 3.1. Thay đổi API endpoints trong ChatBot.jsx:

```javascript
// Thay đổi API_URL theo backend của bạn
const API_URL = 'http://localhost:YOUR_PORT/api';

// Tùy chỉnh các chế độ chat theo nhu cầu
const [chatMode, setChatMode] = useState('smart-search');

// Cập nhật switch case trong handleSend():
switch (chatMode) {
  case 'smart-search':
    res = await axios.post(`${API_URL}/ai/smart-search`, { query });
    // Tùy chỉnh xử lý kết quả theo dữ liệu của bạn
    break;
  
  case 'search':
    res = await axios.post(`${API_URL}/ai/chat`, { query });
    break;
    
  case 'generate':
    res = await axios.post(`${API_URL}/ai/generate`, { 
      topic: query,
      style: 'chuyên nghiệp' 
    });
    break;
    
  case 'create-item':  // Thay 'create-blog' thành loại dữ liệu của bạn
    res = await axios.post(`${API_URL}/tools/create-item-with-ai`, { 
      userRequest: query
    });
    break;
}
```

#### 3.2. Tùy chỉnh giao diện và placeholder:

```javascript
// Thay đổi placeholder theo dữ liệu của bạn
placeholder={
  chatMode === 'smart-search' ? 'Tìm kiếm sản phẩm, dịch vụ...' :
  chatMode === 'search' ? 'Tìm kiếm trong dữ liệu...' :
  chatMode === 'generate' ? 'Tạo nội dung mới...' :
  chatMode === 'create-item' ? 'Mô tả item bạn muốn tạo...' :
  'Nhập tin nhắn...'
}

// Tùy chỉnh message chào mừng
const [messages, setMessages] = useState([
  {
    type: 'bot',
    text: 'Xin chào! 👋 Tôi là AI Assistant cho [TÊN PROJECT CỦA BẠN]. Tôi có thể giúp bạn:\n\n🎯 Tìm kiếm [LOẠI DỮ LIỆU]\n📝 Tóm tắt thông tin\n📊 Phân tích dữ liệu\n✨ Tạo nội dung mới\n📝 Tạo [ITEM MỚI] trực tiếp\n\nBạn cần tôi giúp gì?'
  }
]);
```

### Bước 4: Tạo AI Tools cho dữ liệu của bạn

#### 4.1. Tạo file `yourDataTools.js`:

```javascript
import YourModel from '../models/YourModel.js';

// Tool definitions cho LLM
export const yourDataTools = [
  {
    type: 'function',
    function: {
      name: 'create_item',
      description: 'Tạo một item mới với các thông tin cần thiết',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Tiêu đề của item'
          },
          description: {
            type: 'string',
            description: 'Mô tả chi tiết của item'
          },
          category: {
            type: 'string',
            description: 'Danh mục của item'
          },
          // Thêm các properties khác theo model của bạn
        },
        required: ['title', 'description', 'category']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_categories',
      description: 'Lấy danh sách tất cả các danh mục có sẵn',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  }
];

// Tool execution functions
export async function executeYourDataTool(toolName, toolInput) {
  try {
    switch (toolName) {
      case 'create_item':
        return await createItem(toolInput);
      case 'get_categories':
        return await getCategories();
      default:
        return { error: `Tool ${toolName} not found` };
    }
  } catch (error) {
    return { error: error.message };
  }
}

// Implementation functions
async function createItem(input) {
  try {
    const { title, description, category } = input;
    
    // Validation logic
    if (!title || title.trim().length === 0) {
      return { error: 'Tiêu đề không được để trống' };
    }
    
    // Create item logic
    const item = new YourModel({
      title: title.trim(),
      description: description.trim(),
      category: category,
      // Thêm các fields khác
    });
    
    await item.save();
    
    return {
      success: true,
      message: `✅ Item "${title}" đã được tạo thành công!`,
      item: {
        _id: item._id,
        title: item.title,
        category: item.category
      }
    };
  } catch (error) {
    return { error: `Lỗi khi tạo item: ${error.message}` };
  }
}
```

### Bước 5: Setup Backend Routes

#### 5.1. AI Routes (`aiRoutes.js`):

```javascript
import express from 'express';
import { Groq } from 'groq-sdk';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Smart search endpoint
router.post('/smart-search', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Lấy dữ liệu từ database của bạn
    const items = await YourModel.find().populate('author');
    
    // Tạo context cho AI
    const context = items.map(item => 
      `Title: ${item.title}\nDescription: ${item.description}\nCategory: ${item.category}`
    ).join('\n\n');
    
    // Gọi AI để tìm kiếm thông minh
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Bạn là AI assistant cho hệ thống [TÊN HỆ THỐNG]. Dựa vào context sau để trả lời câu hỏi của người dùng:\n\n${context}`
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000
    });
    
    const answer = completion.choices[0]?.message?.content;
    
    // Logic tìm kiếm và filter items
    const relevantItems = items.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({
      answer,
      items: relevantItems,
      total: relevantItems.length
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

#### 5.2. Tool Routes (`toolRoutes.js`):

```javascript
import express from 'express';
import { Groq } from 'groq-sdk';
import { yourDataTools, executeYourDataTool } from '../tools/yourDataTools.js';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/create-item-with-ai', async (req, res) => {
  try {
    const { userRequest } = req.body;
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Bạn là AI assistant giúp tạo items mới. Sử dụng tools để tạo item theo yêu cầu của người dùng."
        },
        {
          role: "user",
          content: userRequest
        }
      ],
      model: "llama-3.1-70b-versatile",
      tools: yourDataTools,
      tool_choice: "auto"
    });
    
    const message = completion.choices[0]?.message;
    let toolResults = [];
    
    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolInput = JSON.parse(toolCall.function.arguments);
        const result = await executeYourDataTool(toolName, toolInput);
        toolResults.push({ toolName, result });
      }
    }
    
    res.json({
      message: message.content || "Đã xử lý yêu cầu của bạn",
      toolResults
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Bước 6: Tích hợp vào App component

```javascript
import ChatBot from './ChatBot';

function App() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  
  const handleItemSelect = (itemId) => {
    // Logic xử lý khi user click vào item từ chatbot
    // Ví dụ: navigate to item detail page
  };
  
  const handleSearchResults = (items) => {
    // Logic xử lý kết quả tìm kiếm từ chatbot
    setFilteredItems(items);
  };
  
  return (
    <div className="App">
      {/* Your existing components */}
      
      <ChatBot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen(!chatbotOpen)}
        onItemSelect={handleItemSelect}
        onSearchResults={handleSearchResults}
      />
    </div>
  );
}
```

### Bước 7: Environment Variables

Thêm vào file `.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

## 🎨 Tùy chỉnh giao diện

### Thay đổi màu sắc chính trong ChatBot.css:

```css
/* Thay đổi gradient chính */
.chatbot-toggle {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

.chatbot-header {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

/* Thay đổi màu accent */
.mode-btn.active,
.send-btn {
  background: #YOUR_ACCENT_COLOR;
}
```

## 📱 Responsive Design

Chatbot đã được tối ưu cho mobile:
- Tự động điều chỉnh kích thước trên màn hình nhỏ
- Touch-friendly buttons
- Smooth animations

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **CORS Error**: Thêm CORS middleware trong backend
2. **API Key Error**: Kiểm tra GROQ_API_KEY trong .env
3. **Database Connection**: Kiểm tra MONGO_URI
4. **Component Not Rendering**: Kiểm tra import paths

### Debug Tips:

```javascript
// Thêm console.log để debug
console.log('ChatBot props:', { isOpen, onToggle, onItemSelect });
console.log('API Response:', res.data);
console.log('Chat Mode:', chatMode);
```

## 🚀 Performance Tips

1. **Lazy Loading**: Load chatbot component khi cần
2. **Debounce**: Thêm debounce cho input
3. **Caching**: Cache AI responses
4. **Pagination**: Phân trang cho kết quả nhiều

## 📚 Tài liệu tham khảo

- [Groq API Documentation](https://console.groq.com/docs)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 💡 Ví dụ tích hợp cho các loại project

### E-commerce:
- Smart search sản phẩm
- Tạo product descriptions
- Customer support

### CMS/Blog:
- Tìm kiếm bài viết
- Tạo content mới
- SEO optimization

### CRM:
- Tìm kiếm khách hàng
- Tạo reports
- Data analysis

### Learning Management:
- Tìm kiếm khóa học
- Tạo quiz/assignments
- Student support

---

**Lưu ý**: Hãy tùy chỉnh các tên biến, API endpoints, và logic xử lý theo dữ liệu cụ thể của project bạn. Chatbot này được thiết kế để dễ dàng mở rộng và tùy chỉnh cho nhiều loại ứng dụng khác nhau.