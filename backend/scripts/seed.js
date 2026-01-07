import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog_database';

const users = [
  { username: 'nguyenvana', email: 'nguyenvana@example.com', password: 'password123', fullName: 'Nguyễn Văn A', bio: 'Lập trình viên Full-stack' },
  { username: 'tranthib', email: 'tranthib@example.com', password: 'password123', fullName: 'Trần Thị B', bio: 'Food blogger' },
  { username: 'levanc', email: 'levanc@example.com', password: 'password123', fullName: 'Lê Văn C', bio: 'Travel blogger' },
  { username: 'phamthid', email: 'phamthid@example.com', password: 'password123', fullName: 'Phạm Thị D', bio: 'Chuyên gia sức khỏe' },
  { username: 'hoangvane', email: 'hoangvane@example.com', password: 'password123', fullName: 'Hoàng Văn E', bio: 'Doanh nhân' }
];

const blogData = [
  { category: 'technology', title: 'Machine Learning cơ bản', content: 'Machine Learning là nhánh của AI cho phép máy tính học từ dữ liệu mà không cần lập trình cụ thể. Có 3 loại chính: supervised learning (học có giám sát) sử dụng dữ liệu được gán nhãn, unsupervised learning (học không giám sát) tìm patterns trong dữ liệu, và reinforcement learning (học tăng cường) học qua thử và sai. Ứng dụng ML rất đa dạng từ nhận diện hình ảnh, xử lý ngôn ngữ tự nhiên, đến xe tự lái và chẩn đoán y tế. Các thuật toán phổ biến bao gồm Linear Regression, Decision Trees, Neural Networks.', tags: ['AI', 'ML', 'Tech'] },
  { category: 'technology', title: 'Python cho beginners', content: 'Python là ngôn ngữ lập trình dễ học nhất cho người mới. Cú pháp đơn giản, gần với ngôn ngữ tự nhiên. Python được dùng rộng rãi trong web development (Django, Flask), data science (NumPy, Pandas), machine learning (TensorFlow, PyTorch), và automation. Để bắt đầu, học về biến, kiểu dữ liệu, vòng lặp for/while, hàm functions, và OOP. Python có cộng đồng lớn với hàng ngàn thư viện miễn phí. Bạn có thể làm các project như calculator, to-do list, web scraper để thực hành.', tags: ['Python', 'Programming'] },
  { category: 'technology', title: 'React vs Vue comparison', content: 'React và Vue là 2 framework JavaScript phổ biến nhất. React được Facebook phát triển, có ecosystem lớn và nhiều thư viện. Vue do Evan You tạo ra, dễ học hơn với documentation tốt. React dùng JSX để viết UI, Vue dùng template HTML. Cả hai đều có virtual DOM và component-based architecture. React phù hợp cho dự án lớn cần nhiều thư viện, Vue tốt cho người mới và dự án vừa. Performance tương đương nhau. Chọn framework phụ thuộc vào team và project requirements.', tags: ['React', 'Vue', 'Frontend'] },
  { category: 'technology', title: 'Node.js REST API guide', content: 'Node.js cho phép chạy JavaScript trên server side. Express là framework minimal và flexible nhất cho Node. Để build REST API, cần hiểu HTTP methods: GET (đọc), POST (tạo), PUT (update), DELETE (xóa). Express giúp handle requests, responses, middleware, và routing dễ dàng. Kết hợp với MongoDB tạo MERN stack mạnh mẽ. Best practices: validation, error handling, authentication với JWT, rate limiting, và logging. API design nên follow RESTful conventions và versioning.', tags: ['Node', 'Express', 'API'] },
  { category: 'technology', title: 'Docker containerization', content: 'Docker là platform để develop, ship và run applications trong containers. Container giống VM nhẹ, chứa app và dependencies. Docker đảm bảo app chạy giống nhau trên mọi môi trường. Dockerfile định nghĩa cách build image với các instructions như FROM, RUN, COPY, CMD. Docker Compose quản lý multi-container apps. Docker rất hữu ích cho microservices architecture và CI/CD pipelines. Benefits: consistency, isolation, scalability, và faster deployment.', tags: ['Docker', 'DevOps'] }
];

console.log('Starting seed...');

// Generate 50 blogs from templates
function generateBlogs() {
  const categories = ['technology', 'food', 'travel', 'health', 'lifestyle', 'business', 'education', 'entertainment', 'sports', 'science'];
  const allBlogs = [];
  
  // Multiply existing blogs and modify them
  for (let i = 0; i < 10; i++) {
    blogData.forEach((blog, index) => {
      const newBlog = {
        ...blog,
        title: `${blog.title} - Phần ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        tags: [...blog.tags, `part${i+1}`]
      };
      allBlogs.push(newBlog);
    });
  }
  
  return allBlogs.slice(0, 50); // Take first 50
}

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = new User({
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=667eea&color=fff`
      });
      await user.save();
      createdUsers.push(user);
      console.log(`  ✓ Created user: ${user.fullName}`);
    }

    // Generate and create 50 blogs
    console.log('📝 Creating 50 blogs...');
    const blogs = generateBlogs();
    let blogCount = 0;
    
    // Create all blogs first
    const createdBlogs = [];
    for (const blogTemplate of blogs) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      const blog = new Blog({
        title: blogTemplate.title,
        content: blogTemplate.content,
        excerpt: blogTemplate.content.substring(0, 150) + '...',
        author: randomUser._id,
        category: blogTemplate.category,
        tags: blogTemplate.tags,
        coverImage: `https://picsum.photos/seed/${blogCount}/800/400`,
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 200),
        featured: Math.random() > 0.85
      });
      
      await blog.save();
      createdBlogs.push({ blog, userId: randomUser._id });
      
      blogCount++;
      if (blogCount % 10 === 0) {
        console.log(`  ✓ Created ${blogCount} blogs...`);
      }
    }
    
    // Update users with their blogs
    console.log('🔗 Linking blogs to users...');
    for (const { blog, userId } of createdBlogs) {
      await User.findByIdAndUpdate(userId, {
        $push: { blogs: blog._id }
      });
    }

    console.log(`\n🎉 Seeding completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Users created: ${createdUsers.length}`);
    console.log(`   - Blogs created: ${blogCount}`);
    console.log(`\n✅ Database is ready to use!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
